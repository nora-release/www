import { requireFeedbackUser } from '../../utils/feedback/auth'
import { withApiResponse } from '../../utils/feedback/http'
import { listFeedbackItems } from '../../utils/feedback/store'

export default (event: any) => withApiResponse(event, async () => {
  const user = await requireFeedbackUser(event)
  const items = await listFeedbackItems(event)

  return {
    user,
    items,
  }
})
