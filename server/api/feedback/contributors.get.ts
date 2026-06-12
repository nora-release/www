import { withApiResponse } from '../../utils/feedback/http'
import { listTopContributors } from '../../utils/feedback/store'

export default (event: any) => withApiResponse(event, async () => {
  const contributors = await listTopContributors(event)

  return {
    contributors,
  }
})
