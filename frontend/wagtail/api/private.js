import {doFetch} from "../http";
import {convertObjectKeys, snakeToCamel} from "../utils/caseconverters";

export const variableNameConverter = snakeToCamel
const defaultFormatter = (data) => convertObjectKeys(data, true, variableNameConverter)

async function findPagePkByPath(path) {
  const params = new URLSearchParams()
  params.set('html_path', path)
  const queryString = params.toString()
  const response = await doFetch(
    `${process.env.PRIVATE_API_URL}/pages/find/?${queryString.replace('%2C','/')}`,
      {
        request: (url) => new Request(url, {redirect: 'manual'}),
        handler: async (response) => {
          if (response.status === 302) {
            return response
          }
        }
    }
  )

  const detailUrl = new URL(response.headers.get('location'))
  return detailUrl.pathname.split('/')[4]
}

async function getDataByApiURL(url, options = {}) {
  options = typeof options === 'object' && options || {}
  options = {
    formatter: defaultFormatter,
    ...options,
  }
  url.searchParams.set('format', 'json')
  const json = await doFetch(url.toString(), options)
  return options.formatter(json)
}

export async function getPageDataByPath(path, options = {}) {
  const pk = await findPagePkByPath(path)
  return getDataByApiURL(new URL(`${process.env.PRIVATE_API_URL}/pages/${pk}/`), options)
}

export async function getDataByRelativeApiUrl(url, options = {}) {
  return getDataByApiURL(new URL(`${process.env.PRIVATE_API_URL}${url}`), options)
}
