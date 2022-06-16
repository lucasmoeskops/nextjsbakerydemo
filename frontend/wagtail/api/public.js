import useSWRImmutable from 'swr/immutable'
import {convertObjectKeys} from "../utils/caseconverters";

const defaultFormatter = convertObjectKeys

export const fetcher = async (url) => {
  const response = await fetch(url)
  const json = await response.json()
  return defaultFormatter(json)
}
