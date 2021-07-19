import { resolver, NotFoundError } from "blitz"
import db from "db"

import { z } from "zod"

const GetInvite = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetInvite), resolver.authorize(), async ({ id }, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const invite = await db.invite.findFirst({ where: { id, organizationId: ctx.session.orgId } })

  if (!invite) throw new NotFoundError()

  return invite
})
