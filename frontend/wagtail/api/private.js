import {doFetch, RequestError} from "../http";
import {getJsonFromApiResponse} from "./base";

async function findPagePkByPath(path) {
  const params = new URLSearchParams()
  params.set('html_path', path)
  const queryString = params.toString()
  const response = await fetch(
      new Request(
          buildPrivateApiUrl(`/pages/find/?${queryString.replace('%2C','/')}`),
          {redirect: 'manual'}
      )
  )

  if (response.status === 302) {
    const detailUrl = new URL(response.headers.get('location'))
    return detailUrl.pathname.split('/')[4]
  }

  throw new RequestError(response.statusText, response)
}

export function buildPrivateApiUrl(relativePath) {
  return `${process.env.PRIVATE_API_URL}${relativePath}`
}

export async function getPrivateApiJson(relative_path) {
  const url = new URL(buildPrivateApiUrl(relative_path))
  url.searchParams.set('format', 'json')
  const response = await fetch(url)

  if (response.status === 200) {
    return getJsonFromApiResponse(response)
  }

  throw new RequestError(response.statusText, response)
}

export async function getPageDataByPath(path, options = {}) {
  const pk = await findPagePkByPath(path)
  return getPrivateApiJson(`/pages/${pk}/`)
}
