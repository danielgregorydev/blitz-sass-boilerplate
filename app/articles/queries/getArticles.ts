import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetArticlesInput
  extends Pick<Prisma.ArticleFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetArticlesInput, ctx) => {
    const validatedWhere = { ...where, organizationId: ctx.session.orgId }
    const {
      items: articles,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.article.count({ where: validatedWhere }),
      query: (paginateArgs) =>
        db.article.findMany({ ...paginateArgs, where: validatedWhere, orderBy }),
    })

    return {
      articles,
      nextPage,
      hasMore,
      count,
    }
  }
)
