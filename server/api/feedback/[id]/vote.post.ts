import { requireFeedbackUser } from '../../../utils/feedback/auth'
import {
  feedbackError,
  getRouterValue,
  readJsonBody,
  withApiResponse,
} from '../../../utils/feedback/http'
import { voteFeedbackItem } from '../../../utils/feedback/store'

export default (event: any) => withApiResponse(event, async () => {
  const user = await requireFeedbackUser(event)
  const id = getRouterValue(event, 'id')

  if (!id) {
    throw feedbackError(400, 'Feedback id is required.')
  }

  const body = await readJsonBody(event)
  const item = await voteFeedbackItem(event, user, id, body)

  return {
    item,
  }
})
