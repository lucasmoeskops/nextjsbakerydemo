export class RequestError extends Error {
  constructor (message, response) {
    super(message)
    this.response = response
  }
}

export async function doFetch(url, options) {
  options = typeof options === 'object' && options || {}
  options = {
    request: async (url) => new Request(url),
    handler: async (response) => {
      if (response.status === 200) {
        return response.json()
      }
    },
    ...options,
  }
  const response = await fetch(await options.request(url))

  const result = options.handler(response)

  if (result) {
    return result;
  }

  throw new RequestError(response.statusText, response)
}
