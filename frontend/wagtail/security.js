import bcrypt from "bcryptjs"

export async function verifyServerSecret(serverSecret, value) {
  if (serverSecret.length !== 60) {
    return false
  }
  const salt = bcrypt.getSalt(serverSecret)
  const result = await bcrypt.hash(process.env.SECRET_KEY + value, salt)
  return serverSecret === result
}
