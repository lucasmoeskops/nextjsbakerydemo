import {convertObjectKeys, snakeToCamel} from "../utils/caseconverters";

export const variableNameConverter = snakeToCamel
export const defaultFormatter = (data) => convertObjectKeys(data, true, variableNameConverter)


export async function getJsonFromApiResponse(fetchResponse) {
  const data = await fetchResponse.json()
  return defaultFormatter(data)
}
