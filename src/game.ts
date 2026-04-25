export const MAX_TABLE_NUMBER = 10

export type GameConfig = {
  selectedNumbers: number[]
  maxMultiplier: number
  shuffleQuestions: boolean
  retryIncorrectAtEnd: boolean
}

export type Question = {
  left: number
  right: number
  correctAnswer: number
}

export type AttemptRecord = {
  question: Question
  childAnswer: number
  isCorrect: boolean
  round: number
}

export const DEFAULT_CONFIG: GameConfig = {
  selectedNumbers: [2, 3],
  maxMultiplier: 10,
  shuffleQuestions: true,
  retryIncorrectAtEnd: true,
}

export function createQuestionKey(question: Question): string {
  return `${question.left}x${question.right}`
}

export function formatQuestion(question: Question): string {
  return `${question.left} × ${question.right}`
}

export function createQuestions(config: GameConfig): Question[] {
  const questions = config.selectedNumbers.flatMap((left) =>
    Array.from({ length: config.maxMultiplier }, (_, index) => {
      const right = index + 1

      return {
        left,
        right,
        correctAnswer: left * right,
      }
    }),
  )

  return config.shuffleQuestions ? shuffleQuestions(questions) : questions
}

export function getLatestIncorrectAttempts(attempts: AttemptRecord[]): AttemptRecord[] {
  const latestAttempts = new Map<string, AttemptRecord>()

  for (const attempt of attempts) {
    latestAttempts.set(createQuestionKey(attempt.question), attempt)
  }

  return Array.from(latestAttempts.values())
    .filter((attempt) => !attempt.isCorrect)
    .sort(
      (left, right) =>
        left.question.left - right.question.left || left.question.right - right.question.right,
    )
}

function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}
