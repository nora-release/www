import {
  sanitizeReturnTo,
} from '../../utils/feedback/auth'
import {
  getQueryValue,
  redirectResponse,
  withApiResponse,
} from '../../utils/feedback/http'

export default (event: any) => withApiResponse(event, () => {
  const returnTo = sanitizeReturnTo(getQueryValue(event, 'next'))

  return redirectResponse(`/auth/github?next=${encodeURIComponent(returnTo)}`, 302)
})
