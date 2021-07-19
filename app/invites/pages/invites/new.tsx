import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createInvite from "app/invites/mutations/createInvite"
import { InviteForm, FORM_ERROR } from "app/invites/components/InviteForm"

// TODO Add authentication guards
const NewInvitePage: BlitzPage = () => {
  const router = useRouter()
  const [createInviteMutation] = useMutation(createInvite)

  return (
    <div>
      <h1>Create New Invite</h1>

      <InviteForm
        submitText="Create Invite"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateInvite}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const invite = await createInviteMutation(values)
            router.push(Routes.InvitesPage())
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.InvitesPage()}>
          <a>Invites</a>
        </Link>
      </p>
    </div>
  )
}

NewInvitePage.authenticate = true
NewInvitePage.getLayout = (page) => <Layout title={"Create New Invite"}>{page}</Layout>

export default NewInvitePage
