import {
  Link,
  useRouter,
  useMutation,
  BlitzPage,
  Routes,
  useQuery,
  AuthorizationError,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import createInvite from "app/invites/mutations/createInvite"
import { InviteForm, FORM_ERROR } from "app/invites/components/InviteForm"
import { CreateInvite } from "app/invites/validations"
import getAbility from "app/guard/queries/getAbility"
import { Suspense, useEffect } from "react"

const NewInvite = () => {
  const router = useRouter()
  const [createInviteMutation] = useMutation(createInvite)

  const [[canManageInvite], { isLoading }] = useQuery(getAbility, [["manage", "invite"]])

  useEffect(() => {
    if (isLoading || canManageInvite) {
      return
    }

    router.push(Routes.LoginPage())
  }, [isLoading, canManageInvite, router])

  return !isLoading ? (
    <div>
      <h1>Create New Invite</h1>

      <InviteForm
        submitText="Create Invite"
        schema={CreateInvite}
        onSubmit={async (values) => {
          try {
            await createInviteMutation(values)
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
  ) : (
    <div>Loading</div>
  )
}

const NewInvitePage: BlitzPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <NewInvite />
  </Suspense>
)

NewInvitePage.authenticate = true
NewInvitePage.getLayout = (page) => <Layout title={"Create New Invite"}>{page}</Layout>

export default NewInvitePage
