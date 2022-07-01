import bcrypt from "bcryptjs"
import {buildApiUrl} from "./api/public";

function readCsrfFromCookie() {
  return document.cookie
  .split('; ')
  .find(row => row.startsWith('csrftoken='))
  ?.split('=')[1];
}

export async function getCsrfToken() {
  const value = readCsrfFromCookie()
  if (value) {
    return value
  }

  await fetch(buildApiUrl('/forms/obtain_csrf/'))
  return readCsrfFromCookie()
}

export async function verifyServerSecret(serverSecret, value) {
  if (serverSecret.length !== 60) {
    return false
  }
  const salt = bcrypt.getSalt(serverSecret)
  const result = await bcrypt.hash(process.env.SECRET_KEY + value, salt)
  return serverSecret === result
}
