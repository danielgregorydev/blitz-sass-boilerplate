import Guard from "app/guard/ability"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateArticle = z.object({
  id: z.number(),
  title: z.string(),
})

export default Guard.authorize(
  "update",
  "article",
  resolver.pipe(resolver.zod(UpdateArticle), async ({ id, ...data }) => {
    const article = await db.article.update({ where: { id }, data })

    return article
  })
)
