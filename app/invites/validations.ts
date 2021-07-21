import { z } from "zod"

const password = z.string().min(10).max(100)

export const AcceptInvite = z.object({
  name: z.string(),
  email: z.string().email(),
  password,
  membershipId: z.number(),
  inviteId: z.number(),
})

export const CreateInvite = z.object({
  invitedName: z.string(),
  invitedEmail: z.string().email(),
})

export const DeleteInvite = z.object({
  id: z.number(),
})
