import {buildPublicApiUrl} from "../api/public";
import {getCsrfToken} from "../security";
import {getJsonFromApiResponse} from "../api/base";


class FormSubmissionError extends Error {

}


export async function submitPageForm (pagePk, formElement) {
  const formData = new FormData(formElement)
  formData.set('csrfmiddlewaretoken', await getCsrfToken())
  const request = new Request(
      buildPublicApiUrl(`/forms/${pagePk}/submit/`),
      {body: formData, method: 'POST'}
  )
  const response = await fetch(request)

  if (![200, 400].includes(response.status)) {
    throw new FormSubmissionError('Form submission failed.')
  }

  const data = await getJsonFromApiResponse(response)

  return {
    success: response.status === 200,
    data,
  }
}
