export type FeedbackAuthor = {
  id: number
  login: string
  name: string
  avatarUrl: string
  htmlUrl: string
}

export type PublicFeedbackUser = FeedbackAuthor & {
  isAdmin: boolean
}

export type FeedbackMessage = {
  id: string
  body: string
  createdAt: string
  author: FeedbackAuthor
}

export type GitHubIssueLink = {
  repo: string
  number: number
  url: string
  createdAt: string
}

export type FeedbackItem = {
  id: string
  title: string
  description: string
  status: 'open' | 'promoted'
  createdAt: string
  updatedAt: string
  author: FeedbackAuthor
  messages: FeedbackMessage[]
  issue: GitHubIssueLink | null
}
