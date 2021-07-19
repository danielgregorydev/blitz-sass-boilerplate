import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getInvites from "app/invites/queries/getInvites"
import deleteInviteMutation from "app/invites/mutations/deleteInvite"

const ITEMS_PER_PAGE = 100
// TODO Add authentication guards
export const InvitesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ invites, hasMore }, { refetch: refetchInvites }] = usePaginatedQuery(getInvites, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const [deleteInvite] = useMutation(deleteInviteMutation)

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {invites.map((invite) => (
          <li key={invite.id}>
            {invite.membership.invitedName} - {invite.membership.invitedEmail} - {invite.status}
            {invite.status !== "accepted" && (
              <>
                {" "}
                -{" "}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_SITE_URL}/invites/accept/${invite.code}`
                    )
                  }}
                >
                  Copy invite link
                </button>
                <button
                  onClick={async () => {
                    await deleteInvite({ id: invite.id })
                    await refetchInvites()
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const InvitesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Invites</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewInvitePage()}>
            <a>Create Invite</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <InvitesList />
        </Suspense>
      </div>
    </>
  )
}

InvitesPage.authenticate = true
InvitesPage.getLayout = (page) => <Layout>{page}</Layout>

export default InvitesPage
