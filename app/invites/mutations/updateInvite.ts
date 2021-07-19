import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateInvite = z.object({
  id: z.number(),
  invitedEmail: z.string().email(),
  invitedName: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateInvite),
  resolver.authorize(),
  async ({ id, invitedName, invitedEmail }) => {
    // TODO: Add guard

    const invite = await db.invite.findFirst({ where: { id } })

    if (!invite?.membershipId) {
      throw new AuthenticationError()
    }

    const membership = await db.membership.update({
      where: { id: invite.membershipId },
      data: {
        invitedName,
        invitedEmail,
      },
    })

    return invite
  }
)
