import db from "db"
import { GuardBuilder, PrismaModelsType } from "@blitz-guard/core"

type ExtendedResourceTypes = PrismaModelsType<typeof db>

type ExtendedAbilityTypes = "send email"

const Guard = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx, { can, cannot }) => {
    cannot("manage", "all")

    if (ctx.session.$isAuthorized()) {
      can("create", "article")

      can("manage", "article", async (args) => {
        return (
          (await db.article.count({
            where: { id: args.id, organizationId: ctx.session.orgId },
          })) === 1
        )
      })
    }
  }
)

export default Guard
