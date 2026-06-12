import { requireFeedbackUser } from '../../utils/feedback/auth'
import { readJsonBody, withApiResponse } from '../../utils/feedback/http'
import { addAdminUser } from '../../utils/feedback/store'

export default (event: any) => withApiResponse(event, async () => {
  const user = await requireFeedbackUser(event)
  const body = await readJsonBody(event)
  const admins = await addAdminUser(event, user, body)

  return {
    admins,
  }
})
