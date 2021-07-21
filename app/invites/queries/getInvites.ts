import Guard from "app/guard/ability"
import { paginate, resolver } from "blitz"
import db, { InviteStatus, Prisma } from "db"

interface GetInvitesInput
  extends Pick<Prisma.InviteFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default Guard.authorize(
  "manage",
  "invite",
  resolver.pipe(
    resolver.authorize(),
    async ({ where, orderBy, skip = 0, take = 100 }: GetInvitesInput, ctx) => {
      const validatedWhere = {
        ...where,
        organizationId: ctx.session.orgId,
        status: { not: "deleted" as InviteStatus },
      }
      const {
        items: invites,
        hasMore,
        nextPage,
        count,
      } = await paginate({
        skip,
        take,
        count: () => db.invite.count({ where: validatedWhere }),
        query: (paginateArgs) =>
          db.invite.findMany({
            ...paginateArgs,
            where: validatedWhere,
            orderBy,
            select: {
              id: true,
              status: true,
              code: true,
              membership: true,
            },
          }),
      })

      return {
        invites,
        nextPage,
        hasMore,
        count,
      }
    }
  )
)
