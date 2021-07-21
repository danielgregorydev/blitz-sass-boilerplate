import Guard from "app/guard/ability"
import { resolver } from "blitz"
import db from "db"
import { DeleteInvite } from "../validations"

export default Guard.authorize(
  "delete",
  "invite",
  resolver.pipe(resolver.zod(DeleteInvite), async ({ id }) => {
    const invite = await db.invite.update({ where: { id }, data: { status: "deleted" } })

    return invite
  })
)
