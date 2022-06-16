import {verifyServerSecret} from "../../wagtail/security";

export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  const path = req.query.path || '/'
  const validatePath = req.query.path
  const secret = req.query.secret || ''

  const isValid = await verifyServerSecret(secret, validatePath)

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    await res.unstable_revalidate(path)
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.json({ revalidated: false, message: err.toString() })
    // return res.status(500).send(`Error revalidating: ${err}`)
  }
}
