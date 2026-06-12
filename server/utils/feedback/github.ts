import { feedbackError } from './http'
import type { FeedbackItem, GitHubIssueLink } from './types'

type FeedbackRuntimeConfig = {
  feedback?: {
    githubRepo?: string
    githubToken?: string
  }
}

const getFeedbackConfig = (_event: unknown): FeedbackRuntimeConfig => {
  return {
    feedback: {
      githubRepo: process.env.NORA_FEEDBACK_GITHUB_REPO || '',
      githubToken: process.env.NORA_FEEDBACK_GITHUB_TOKEN || '',
    },
  }
}

const parseRepo = (repo: string) => {
  const [owner, name] = repo.split('/')

  if (!owner || !name || repo.split('/').length !== 2) {
    return null
  }

  return {
    owner,
    name,
    fullName: `${owner}/${name}`,
  }
}

const buildIssueBody = (item: FeedbackItem) => {
  const discussion = item.messages
    .map((message, index) => {
      return [
        `### Reply ${index + 1} by @${message.author.login}`,
        '',
        message.body,
      ].join('\n')
    })
    .join('\n\n')

  return [
    `Submitted by [@${item.author.login}](${item.author.htmlUrl})`,
    `Created at: ${item.createdAt}`,
    '',
    '## Feedback',
    '',
    item.description,
    discussion ? '\n## Discussion\n' : '',
    discussion,
  ].join('\n')
}

export const getIssuePromotionConfig = (event: unknown) => {
  const config = getFeedbackConfig(event)

  return {
    configured: Boolean(config.feedback?.githubRepo && config.feedback?.githubToken),
    repo: config.feedback?.githubRepo ?? '',
  }
}

export const createFeedbackIssue = async (
  event: unknown,
  item: FeedbackItem,
): Promise<GitHubIssueLink> => {
  const config = getFeedbackConfig(event)
  const repo = parseRepo(config.feedback?.githubRepo ?? '')
  const token = config.feedback?.githubToken ?? ''

  if (!repo || !token) {
    throw feedbackError(500, 'GitHub issue promotion is not configured.')
  }

  const response = await fetch(
    `https://api.github.com/repos/${repo.owner}/${repo.name}/issues`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'nora-www-feedback',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        title: `[Feedback] ${item.title}`,
        body: buildIssueBody(item),
      }),
    },
  )

  const responseBody = await response.json().catch(() => null)

  if (!response.ok) {
    throw feedbackError(502, 'GitHub issue creation failed.', responseBody)
  }

  if (
    typeof responseBody?.number !== 'number' ||
    typeof responseBody?.html_url !== 'string'
  ) {
    throw feedbackError(502, 'GitHub issue response is incomplete.')
  }

  return {
    repo: repo.fullName,
    number: responseBody.number,
    url: responseBody.html_url,
    createdAt: new Date().toISOString(),
  }
}
