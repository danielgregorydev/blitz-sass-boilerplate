import { AuthenticationError, resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { Role } from "types"

export default resolver.pipe(
  resolver.zod(Signup),
  async ({ email, password, companyName }, ctx) => {
    const hashedPassword = await SecurePassword.hash(password.trim())

    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        hashedPassword,
        role: "CUSTOMER",
        memberships: {
          create: {
            role: "OWNER",
            organization: {
              create: {
                name: companyName,
              },
            },
          },
        },
      },
      select: { id: true, name: true, email: true, role: true, memberships: true },
    })

    if (!user?.memberships[0]) {
      throw new AuthenticationError()
    }

    await ctx.session.$create({
      userId: user.id,
      roles: [user?.role, user.memberships[0].role],
      orgId: user.memberships[0].organizationId,
    })

    return user
  }
)
