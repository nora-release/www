import { requireFeedbackUser } from '../../../utils/feedback/auth'
import { createFeedbackIssue } from '../../../utils/feedback/github'
import {
  feedbackError,
  getRouterValue,
  withApiResponse,
} from '../../../utils/feedback/http'
import {
  getFeedbackItem,
  markFeedbackPromoted,
} from '../../../utils/feedback/store'

export default (event: any) => withApiResponse(event, async () => {
  const user = await requireFeedbackUser(event)
  const id = getRouterValue(event, 'id')

  if (!user.isAdmin) {
    throw feedbackError(403, 'Only feedback admins can promote feedback.')
  }

  if (!id) {
    throw feedbackError(400, 'Feedback id is required.')
  }

  const item = await getFeedbackItem(event, id)

  if (item.issue) {
    return {
      item,
      issue: item.issue,
    }
  }

  const issue = await createFeedbackIssue(event, item)
  const updatedItem = await markFeedbackPromoted(event, id, issue)

  return {
    item: updatedItem,
    issue,
  }
})
