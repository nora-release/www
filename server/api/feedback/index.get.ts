import { withApiResponse } from '../../utils/feedback/http'
import { listFeedbackItems } from '../../utils/feedback/store'

export default (event: any) => withApiResponse(event, async () => {
  const items = await listFeedbackItems(event)

  return {
    items,
  }
})
