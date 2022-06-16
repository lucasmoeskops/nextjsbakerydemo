import useSWRImmutable from 'swr/immutable'
import {convertObjectKeys} from "../utils/caseconverters";
import {fetchExpectStatusCode} from "../http";

const defaultFormatter = convertObjectKeys

export const fetcher = async (url) => {
  const response = await fetch(url)
  const json = await response.json()
  return defaultFormatter(json)
}

export async function wagtailApiFetcher(resource, init) {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${resource}`
  return fetcher(fullUrl, init)
}