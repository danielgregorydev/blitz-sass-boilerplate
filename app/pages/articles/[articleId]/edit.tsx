import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getArticle from "app/articles/queries/getArticle"
import updateArticle from "app/articles/mutations/updateArticle"
import { ArticleForm, FORM_ERROR } from "app/articles/components/ArticleForm"

export const EditArticle = () => {
  const router = useRouter()
  const articleId = useParam("articleId", "number")
  const [article, { setQueryData }] = useQuery(
    getArticle,
    { id: articleId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateArticleMutation] = useMutation(updateArticle)

  return (
    <>
      <Head>
        <title>Edit Article {article.id}</title>
      </Head>

      <div>
        <h1>Edit Article {article.id}</h1>
        <pre>{JSON.stringify(article)}</pre>

        <ArticleForm
          submitText="Update Article"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateArticle}
          initialValues={article}
          onSubmit={async (values) => {
            try {
              const updated = await updateArticleMutation({
                id: article.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowArticlePage({ articleId: updated.id }))
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

const EditArticlePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditArticle />
      </Suspense>

      <p>
        <Link href={Routes.ArticlesPage()}>
          <a>Articles</a>
        </Link>
      </p>
    </div>
  )
}

EditArticlePage.authenticate = true
EditArticlePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditArticlePage
