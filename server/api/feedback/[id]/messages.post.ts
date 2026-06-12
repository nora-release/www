import { requireFeedbackUser } from '../../../utils/feedback/auth'
import {
  feedbackError,
  getRouterValue,
  readJsonBody,
  withApiResponse,
} from '../../../utils/feedback/http'
import { addFeedbackMessage } from '../../../utils/feedback/store'

export default (event: any) => withApiResponse(event, async () => {
  const user = await requireFeedbackUser(event)
  const id = getRouterValue(event, 'id')

  if (!id) {
    throw feedbackError(400, 'Feedback id is required.')
  }

  const body = await readJsonBody(event)
  const item = await addFeedbackMessage(event, id, user, body)

  return {
    item,
  }
})
