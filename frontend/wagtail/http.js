export class RequestError extends Error {
  constructor (message, response) {
    super(message)
    this.response = response
  }
}

export async function fetchExpectStatusCode(fetchArgs, statusCode = 200) {
  const response = await fetch(...fetchArgs)

  if (response.status === statusCode) {
    return response
  }

  throw new RequestError(response.statusText, response)
}
