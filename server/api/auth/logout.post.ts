import { clearFeedbackSession } from '../../utils/feedback/auth'
import { withApiResponse } from '../../utils/feedback/http'

export default (event: any) => withApiResponse(event, () => {
  clearFeedbackSession(event)

  return {
    ok: true,
  }
})
