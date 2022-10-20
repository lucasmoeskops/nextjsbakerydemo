import {convertObjectKeys} from "../utils/caseconverters";

const defaultFormatter = convertObjectKeys

export const fetcherForSWR = async (url, init) => {
  const response = await fetch(url)
  const json = await response.json()
  return defaultFormatter(json)
}

export function buildPublicApiUrl(relativePath) {
  return `${process.env.NEXT_PUBLIC_API_URL}${relativePath}`
}
