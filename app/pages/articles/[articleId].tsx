import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getArticle from "app/articles/queries/getArticle"
import deleteArticle from "app/articles/mutations/deleteArticle"

export const Article = () => {
  const router = useRouter()
  const articleId = useParam("articleId", "number")
  const [deleteArticleMutation] = useMutation(deleteArticle)
  const [article] = useQuery(getArticle, { id: articleId })

  return (
    <>
      <Head>
        <title>Article {article.id}</title>
      </Head>

      <div>
        <h1>Article {article.id}</h1>
        <pre>{JSON.stringify(article, null, 2)}</pre>

        <Link href={Routes.EditArticlePage({ articleId: article.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteArticleMutation({ id: article.id })
              router.push(Routes.ArticlesPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowArticlePage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ArticlesPage()}>
          <a>Articles</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Article />
      </Suspense>
    </div>
  )
}

ShowArticlePage.authenticate = true
ShowArticlePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowArticlePage
