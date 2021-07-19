import Guard from "app/guard/ability"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateArticle = z.object({
  title: z.string(),
})

export default Guard.authorize(
  "create",
  "article",
  resolver.pipe(resolver.zod(CreateArticle), resolver.authorize(), async (input, ctx) => {
    const article = await db.article.create({
      data: { ...input, organizationId: ctx.session.orgId },
    })

    return article
  })
)
