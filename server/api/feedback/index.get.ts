import { resolveFeedbackSessionUser } from '../../utils/feedback/auth'
import { getQueryValue, withApiResponse } from '../../utils/feedback/http'
import { listFeedbackItems } from '../../utils/feedback/store'
import type { FeedbackCategory } from '../../utils/feedback/types'

export default (event: any) => withApiResponse(event, async () => {
  const user = await resolveFeedbackSessionUser(event)
  const category = getQueryValue(event, 'category') as FeedbackCategory | undefined
  const sort = getQueryValue(event, 'sort') ?? undefined
  const search = getQueryValue(event, 'search') ?? undefined

  const items = await listFeedbackItems(event, {
    category,
    sort: sort ?? undefined,
    search: search ?? undefined,
    user,
  })

  return {
    items,
  }
})
