import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createArticle from "app/articles/mutations/createArticle"
import { ArticleForm, FORM_ERROR } from "app/articles/components/ArticleForm"

const NewArticlePage: BlitzPage = () => {
  const router = useRouter()
  const [createArticleMutation] = useMutation(createArticle)

  return (
    <div>
      <h1>Create New Article</h1>

      <ArticleForm
        submitText="Create Article"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateArticle}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const article = await createArticleMutation(values)
            router.push(Routes.ShowArticlePage({ articleId: article.id }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.ArticlesPage()}>
          <a>Articles</a>
        </Link>
      </p>
    </div>
  )
}

NewArticlePage.authenticate = true
NewArticlePage.getLayout = (page) => <Layout title={"Create New Article"}>{page}</Layout>

export default NewArticlePage
