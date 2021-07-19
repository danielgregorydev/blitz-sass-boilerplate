import { AuthenticationError, resolver, SecurePassword } from "blitz"
import db from "db"
import { z } from "zod"

const password = z.string().min(10).max(100)

const AcceptInvite = z.object({
  name: z.string(),
  email: z.string().email(),
  password,
  membershipId: z.number(),
  inviteId: z.number(),
})

export default resolver.pipe(
  resolver.zod(AcceptInvite),
  async ({ name, email, password, membershipId, inviteId }, ctx) => {
    const hashedPassword = await SecurePassword.hash(password.trim())

    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        hashedPassword,
        role: "CUSTOMER",
        memberships: {
          connect: { id: membershipId },
        },
      },
      select: { id: true, name: true, email: true, role: true, memberships: true },
    })

    if (!user?.memberships[0]) {
      throw new AuthenticationError()
    }

    await db.invite.update({ where: { id: inviteId }, data: { status: "accepted" } })

    await ctx.session.$create({
      userId: user.id,
      roles: [user?.role, user.memberships[0].role],
      orgId: user.memberships[0].organizationId,
    })

    // todo: notify org admin user has accepted invite
    return user
  }
)
