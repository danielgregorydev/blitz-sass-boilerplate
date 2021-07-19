import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { v4 } from "uuid"
import Guard from "app/guard/ability"

const CreateInvite = z.object({
  invitedName: z.string(),
  invitedEmail: z.string().email(),
})

export default Guard.authorize(
  "create",
  "invite",
  resolver.pipe(
    resolver.zod(CreateInvite),
    resolver.authorize(),
    async ({ invitedName, invitedEmail }, ctx) => {
      const oldInvite = await db.invite.findFirst({
        where: {
          membership: { invitedEmail, organizationId: ctx.session.orgId },
          status: {
            in: ["deleted", "expired"],
          },
        },
      })

      if (oldInvite) {
        return await db.invite.update({
          where: { id: oldInvite.id },
          data: {
            code: v4(),
            status: "pending",
            membership: {
              update: {
                invitedName,
              },
            },
          },
        })
      }

      const invite = await db.invite.create({
        data: {
          code: v4(),
          organization: {
            connect: { id: ctx.session.orgId },
          },
          membership: {
            create: {
              role: "USER",
              organizationId: ctx.session.orgId,
              invitedName,
              invitedEmail,
            },
          },
        },
      })

      return invite
    }
  )
)
