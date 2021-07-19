import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getInvite from "app/invites/queries/getInvite"
import updateInvite from "app/invites/mutations/updateInvite"
import { InviteForm, FORM_ERROR } from "app/invites/components/InviteForm"

// TODO Add authentication guards
export const EditInvite = () => {
  const router = useRouter()
  const inviteId = useParam("inviteId", "number")
  const [invite, { setQueryData }] = useQuery(
    getInvite,
    { id: inviteId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateInviteMutation] = useMutation(updateInvite)

  return (
    <>
      <Head>
        <title>Edit Invite {invite.id}</title>
      </Head>

      <div>
        <h1>Edit Invite {invite.id}</h1>
        <pre>{JSON.stringify(invite)}</pre>

        <InviteForm
          submitText="Update Invite"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateInvite}
          initialValues={invite}
          onSubmit={async (values) => {
            try {
              const updated = await updateInviteMutation({
                id: invite.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.InvitesPage())
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditInvitePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditInvite />
      </Suspense>

      <p>
        <Link href={Routes.InvitesPage()}>
          <a>Invites</a>
        </Link>
      </p>
    </div>
  )
}

EditInvitePage.authenticate = true
EditInvitePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditInvitePage
