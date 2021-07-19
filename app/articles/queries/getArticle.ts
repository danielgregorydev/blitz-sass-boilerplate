import Guard from "app/guard/ability"
import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetArticle = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default Guard.authorize(
  "read",
  "article",
  resolver.pipe(resolver.zod(GetArticle), async ({ id }) => {
    const article = await db.article.findFirst({ where: { id } })

    if (!article) throw new NotFoundError()

    return article
  })
)
