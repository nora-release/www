import { requireFeedbackUser } from '../../utils/feedback/auth'
import { feedbackError, withApiResponse } from '../../utils/feedback/http'
import {
  listAdminUsers,
  listKnownFeedbackUsers,
} from '../../utils/feedback/store'

export default (event: any) => withApiResponse(event, async () => {
  const user = await requireFeedbackUser(event)

  if (!user.isAdmin) {
    throw feedbackError(403, 'Only feedback admins can view admins.')
  }

  const [admins, users] = await Promise.all([
    listAdminUsers(event),
    listKnownFeedbackUsers(event),
  ])

  return {
    admins,
    users,
  }
})
