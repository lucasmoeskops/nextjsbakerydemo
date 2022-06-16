import {fetchExpectStatusCode} from "../http";
import {convertObjectKeys} from "../utils/caseconverters";

const defaultFormatter = convertObjectKeys

async function findPagePkByPath(path) {
  const params = new URLSearchParams()
  params.set('html_path', path)
  const queryString = params.toString()
  const response = await fetchExpectStatusCode(
    [`${process.env.PRIVATE_API_URL}/pages/find/?${queryString.replace('%2C','/')}`, {redirect: 'manual'}],
    302
  )

  const detailUrl = new URL(response.headers.get('location'))
  return detailUrl.pathname.split('/')[4]
}

async function getPageDataByApiUrl(url, formatter=defaultFormatter) {
  url.searchParams.set('format', 'json')
  const response = await fetchExpectStatusCode([url.toString()], 200)
  const json = await response.json()
  return formatter(json)
}

export async function getPageDataByPath(path, formatter=defaultFormatter) {
  const pk = await findPagePkByPath(path)
  return getPageDataByApiUrl(new URL(`${process.env.PRIVATE_API_URL}/pages/${pk}/`), formatter)
}

export async function getPagePreviewDataByPath(secret, pk, formatter=defaultFormatter) {
  // const pk = await findPagePkByPath(path)
  const previewPath = `${process.env.PRIVATE_API_URL}/pages/preview/${pk}/`
  const url = new URL(previewPath)
  url.searchParams.set('secret', secret)
  return getPageDataByApiUrl(url, formatter)
}
