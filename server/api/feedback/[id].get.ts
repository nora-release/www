import { resolveFeedbackSessionUser } from '../../utils/feedback/auth'
import { feedbackError, getRouterValue, withApiResponse } from '../../utils/feedback/http'
import { getFeedbackItem } from '../../utils/feedback/store'

export default (event: any) => withApiResponse(event, async () => {
  const user = await resolveFeedbackSessionUser(event)
  const id = getRouterValue(event, 'id')

  if (!id) {
    throw feedbackError(400, 'Feedback id is required.')
  }

  const item = await getFeedbackItem(event, id, user)

  return {
    item,
  }
})
