import {getPrivateApiJson} from "../../wagtail/api/private";

export default async (req, res) => {
  // Check the required parameters
  if (!req.query.token || !req.query.content_type) {
    return res.status(401).json({ message: 'Missing token or content type' })
  }

  const contentType = req.query.content_type
  const token = req.query.token

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const post = await getPrivateApiJson(`/page_preview/get_path/?content_type=${contentType}&token=${token}`)

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: 'Invalid path' })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({token, contentType})

  // Redirect to the path from the fetched post
  res.redirect(post.path)
}