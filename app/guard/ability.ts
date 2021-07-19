import db from "db"
import { GuardBuilder, PrismaModelsType } from "@blitz-guard/core"

type ExtendedResourceTypes = PrismaModelsType<typeof db>

type ExtendedAbilityTypes = "send email"

const Guard = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx, { can, cannot }) => {
    cannot("manage", "all")
    /*
		Your rules go here, you can start by removing access to everything
		and gradually adding the necessary permissions

		eg:
		cannot("manage", "comment")
		cannot("manage", "article")

		can("read", "article")
		can("read", "comment")

    */
    if (ctx.session.$isAuthorized()) {
      can("create", "article")

      can("read", "article", async (_args) => {
        return (
          (await db.article.count({
            where: { id: _args.id, organizationId: ctx.session.orgId },
          })) === 1
        )
      })

      can("update", "article", async (_args) => {
        return (
          (await db.article.count({
            where: { id: _args.id, organizationId: ctx.session.orgId },
          })) === 1
        )
      })

      can("delete", "article", async (_args) => {
        return (
          (await db.article.count({
            where: { id: _args.id, organizationId: ctx.session.orgId },
          })) === 1
        )
      })
    }
  }
)

export default Guard
