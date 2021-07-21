import { Link, useRouter, useMutation, BlitzPage, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"

import { InviteForm, FORM_ERROR } from "app/invites/components/InviteForm"
import acceptInvite from "app/invites/mutations/acceptInvite"
import getInviteByCode from "app/invites/queries/getInviteByCode"
import React, { Suspense } from "react"
import { AcceptInviteForm } from "app/invites/components/AcceptInviteForm"
import { password } from "../../../../auth/validations"
import { z } from "zod"

const AcceptInviteSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password,
})

const AcceptInvite: BlitzPage = () => {
  const router = useRouter()
  const [invite, { setQueryData }] = useQuery(
    getInviteByCode,
    {
      code: router.params.code,
    },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [acceptInviteMutation] = useMutation(acceptInvite)

  return (
    <div>
      <h1>Accept Invite</h1>

      <AcceptInviteForm
        submitText="Create Account"
        schema={AcceptInviteSchema}
        initialValues={{
          name: invite.membership.invitedName || undefined,
          email: invite.membership.invitedEmail || undefined,
        }}
        onSubmit={async (values) => {
          try {
            await acceptInviteMutation({
              ...values,
              membershipId: invite.membershipId,
              inviteId: invite.id,
            })

            // todo push to a better page
            router.push(Routes.Home())
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </div>
  )
}

const AcceptInvitePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AcceptInvite />
      </Suspense>
    </div>
  )
}

AcceptInvitePage.authenticate = false
AcceptInvitePage.getLayout = (page) => <Layout title={"Your invitation"}>{page}</Layout>

export default AcceptInvitePage
