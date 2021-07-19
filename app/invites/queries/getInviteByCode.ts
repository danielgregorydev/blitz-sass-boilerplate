import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetInvite = z.object({
  // This accepts type of undefined, but is required at runtime
  code: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetInvite), async ({ code }) => {
  const invite = await db.invite.findFirst({
    where: { code },
    select: { id: true, membershipId: true, membership: true },
  })

  if (!invite) throw new NotFoundError()

  return invite
})
