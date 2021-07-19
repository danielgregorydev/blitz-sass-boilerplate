import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteInvite = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteInvite), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const invite = await db.invite.update({ where: { id }, data: { status: "deleted" } })

  return invite
})
