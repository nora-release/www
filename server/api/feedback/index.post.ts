import { requireFeedbackUser } from '../../utils/feedback/auth'
import { jsonResponse, readJsonBody, withApiResponse } from '../../utils/feedback/http'
import { createFeedbackItem } from '../../utils/feedback/store'

export default (event: any) => withApiResponse(event, async () => {
  const user = await requireFeedbackUser(event)
  const body = await readJsonBody(event)
  const item = await createFeedbackItem(event, user, body)

  return jsonResponse({ item }, 201)
})
