import Guard from "app/guard/ability"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteArticle = z.object({
  id: z.number(),
})

export default Guard.authorize(
  "delete",
  "article",
  resolver.pipe(resolver.zod(DeleteArticle), async ({ id }) => {
    const article = await db.article.deleteMany({ where: { id } })

    return article
  })
)
