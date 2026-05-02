import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  DEFAULT_CONFIG,
  MAX_TABLE_NUMBER,
  createQuestionKey,
  createQuestions,
  formatQuestion,
  getLatestIncorrectAttempts,
  type AttemptRecord,
  type GameConfig,
  type Operation,
  type Question,
} from './game'
import { getInitialLocale, getTranslation, setStoredLocale, type Locale } from './i18n'

type Screen = 'setup' | 'game' | 'summary'
type RoundNotice = 'retryRound' | 'practiceRound' | null

type Feedback = {
  isCorrect: boolean
  correctAnswer: number
  childAnswer: number
}

type GameSession = {
  config: GameConfig
  totalQuestionCount: number
  questions: Question[]
  currentIndex: number
  round: number
  correctCount: number
  incorrectCount: number
  attempts: AttemptRecord[]
  autoRetryUsed: boolean
}

const keypadButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
const locales: Locale[] = ['en', 'mk']
const operations: Operation[] = ['multiplication', 'division']

function App() {
  const [locale, setLocale] = useState<Locale>(() => getInitialLocale())
  const [screen, setScreen] = useState<Screen>('setup')
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG)
  const [session, setSession] = useState<GameSession | null>(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [roundNotice, setRoundNotice] = useState<RoundNotice>(null)

  const t = getTranslation(locale)
  const selectedNumbers = new Set(config.selectedNumbers)
  const selectedOperations = new Set(config.selectedOperations)
  const currentQuestion = session?.questions[session.currentIndex] ?? null
  const questionCount =
    config.selectedNumbers.length * config.selectedOperations.length * config.maxMultiplier
  const latestIncorrectAttempts = useMemo(
    () => (session ? getLatestIncorrectAttempts(session.attempts) : []),
    [session],
  )
  const starPreviewCount = Math.min(session?.correctCount ?? 0, 15)
  const numberSelectionSummary =
    config.selectedNumbers.length > 0 ? config.selectedNumbers.join(', ') : t.chooseAtLeastOneNumber
  const operationSelectionSummary =
    config.selectedOperations.length > 0
      ? config.selectedOperations.map((operation) => t.operationOptions[operation]).join(', ')
      : t.chooseAtLeastOneOperation

  useEffect(() => {
    document.title = t.metaTitle
    document.documentElement.lang = t.htmlLang
  }, [t])

  useEffect(() => {
    setStoredLocale(locale)
  }, [locale])

  const updateConfig = (partial: Partial<GameConfig>) => {
    setConfig((current) => ({ ...current, ...partial }))
  }

  const toggleNumber = (value: number) => {
    const nextSelection = selectedNumbers.has(value)
      ? config.selectedNumbers.filter((number) => number !== value)
      : [...config.selectedNumbers, value].sort((left, right) => left - right)

    updateConfig({ selectedNumbers: nextSelection })
  }

  const toggleOperation = (value: Operation) => {
    const nextSelection = selectedOperations.has(value)
      ? config.selectedOperations.filter((operation) => operation !== value)
      : [...config.selectedOperations, value]

    updateConfig({ selectedOperations: nextSelection })
  }

  const startGame = () => {
    const questions = createQuestions(config)

    if (questions.length === 0) {
      return
    }

    setSession({
      config,
      totalQuestionCount: questions.length,
      questions,
      currentIndex: 0,
      round: 1,
      correctCount: 0,
      incorrectCount: 0,
      attempts: [],
      autoRetryUsed: false,
    })
    setAnswer('')
    setFeedback(null)
    setRoundNotice(null)
    setScreen('game')
  }

  const goToNextStep = () => {
    if (!session) {
      return
    }

    const isLastQuestionInRound = session.currentIndex === session.questions.length - 1

    if (!isLastQuestionInRound) {
      setSession({
        ...session,
        currentIndex: session.currentIndex + 1,
      })
      setAnswer('')
      setFeedback(null)
      setRoundNotice(null)
      return
    }

    if (
      session.round === 1 &&
      session.config.retryIncorrectAtEnd &&
      latestIncorrectAttempts.length > 0 &&
      !session.autoRetryUsed
    ) {
      setSession({
        ...session,
        questions: latestIncorrectAttempts.map((attempt) => attempt.question),
        currentIndex: 0,
        round: session.round + 1,
        autoRetryUsed: true,
      })
      setAnswer('')
      setFeedback(null)
      setRoundNotice('retryRound')
      return
    }

    setFeedback(null)
    setRoundNotice(null)
    setScreen('summary')
  }

  const submitAnswer = () => {
    if (!session || !currentQuestion || feedback || answer.trim() === '') {
      return
    }

    const childAnswer = Number(answer)
    const isCorrect = childAnswer === currentQuestion.correctAnswer
    const attempt: AttemptRecord = {
      question: currentQuestion,
      childAnswer,
      isCorrect,
      round: session.round,
    }

    setSession({
      ...session,
      correctCount: session.correctCount + (isCorrect ? 1 : 0),
      incorrectCount: session.incorrectCount + (isCorrect ? 0 : 1),
      attempts: [...session.attempts, attempt],
    })
    setFeedback({
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
      childAnswer,
    })
  }

  const restartWithMissedQuestions = () => {
    if (!session || latestIncorrectAttempts.length === 0) {
      return
    }

    setSession({
      ...session,
      questions: latestIncorrectAttempts.map((attempt) => attempt.question),
      currentIndex: 0,
      round: session.round + 1,
    })
    setAnswer('')
    setFeedback(null)
    setRoundNotice('practiceRound')
    setScreen('game')
  }

  const startNewSession = () => {
    setSession(null)
    setAnswer('')
    setFeedback(null)
    setRoundNotice(null)
    setScreen('setup')
  }

  const handleInputChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setAnswer(value.slice(0, 3))
    }
  }

  const appendDigit = (digit: string) => {
    if (feedback) {
      return
    }

    setAnswer((current) => {
      const nextValue = current === '0' ? digit : `${current}${digit}`
      return nextValue.slice(0, 3)
    })
  }

  const removeLastDigit = () => {
    if (feedback) {
      return
    }

    setAnswer((current) => current.slice(0, -1))
  }

  const clearAnswer = () => {
    if (!feedback) {
      setAnswer('')
    }
  }

  const noticeText =
    roundNotice === 'retryRound'
      ? t.retryRoundNotice
      : roundNotice === 'practiceRound'
        ? t.practiceRoundNotice
        : null

  return (
    <main className="app-shell">
      <section className="app-header">
        <div className="header-copy">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className="subtitle">{t.subtitle}</p>
          </div>
          <div className="language-switcher" role="group" aria-label={t.languageLabel}>
            <span className="language-label">{t.languageLabel}</span>
            <div className="language-options">
              {locales.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`language-button ${locale === option ? 'active' : ''}`}
                  onClick={() => setLocale(option)}
                  aria-pressed={locale === option}
                >
                  {t.languageOptions[option]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="star-bank" aria-label={t.starBankAriaLabel}>
          {Array.from({ length: starPreviewCount }).map((_, index) => (
            <span key={index} className="star">
              ★
            </span>
          ))}
          {session && session.correctCount > starPreviewCount ? (
            <span className="star-count">+{session.correctCount - starPreviewCount}</span>
          ) : null}
        </div>
      </section>

      {screen === 'setup' ? (
        <section className="panel panel-large">
          <div className="section-copy">
            <p className="section-label">{t.setupLabel}</p>
            <h2>{t.setupTitle}</h2>
            <p>{t.setupDescription}</p>
          </div>

          <div className="setup-grid">
            <div className="card">
              <h3>{t.numbersToPractice}</h3>
              <p className="hint">{t.numberSelectionHint(MAX_TABLE_NUMBER)}</p>
              <div className="number-grid">
                {Array.from({ length: MAX_TABLE_NUMBER }, (_, index) => index + 1).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`number-pill ${selectedNumbers.has(value) ? 'selected' : ''}`}
                    onClick={() => toggleNumber(value)}
                    aria-pressed={selectedNumbers.has(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>{t.operationsToPractice}</h3>
              <p className="hint">{t.operationSelectionHint}</p>
              <div className="operation-grid">
                {operations.map((operation) => (
                  <button
                    key={operation}
                    type="button"
                    className={`number-pill ${selectedOperations.has(operation) ? 'selected' : ''}`}
                    onClick={() => toggleOperation(operation)}
                    aria-pressed={selectedOperations.has(operation)}
                  >
                    {t.operationOptions[operation]}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>{t.sessionOptions}</h3>
              <label className="field">
                <span>{t.maxMultiplier}</span>
                <input
                  type="number"
                  min={1}
                  max={MAX_TABLE_NUMBER}
                  value={config.maxMultiplier}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value)

                    updateConfig({
                      maxMultiplier: Number.isNaN(nextValue)
                        ? 1
                        : Math.min(Math.max(nextValue, 1), MAX_TABLE_NUMBER),
                    })
                  }}
                />
              </label>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={config.shuffleQuestions}
                  onChange={(event) => updateConfig({ shuffleQuestions: event.target.checked })}
                />
                <span>{t.shuffleQuestions}</span>
              </label>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={config.retryIncorrectAtEnd}
                  onChange={(event) => updateConfig({ retryIncorrectAtEnd: event.target.checked })}
                />
                <span>{t.retryIncorrectAtEnd}</span>
              </label>
            </div>
          </div>

          <div className="session-preview">
            <div>
              <p className="section-label">{t.sessionPreview}</p>
              <p className="preview-line">
                <strong>{t.operationsLabel}:</strong> {operationSelectionSummary}
              </p>
              <p className="preview-line">
                <strong>{t.numbersLabel}:</strong> {numberSelectionSummary}
              </p>
              <p className="preview-line">
                <strong>{t.questionsLabel}:</strong> {questionCount}
              </p>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={startGame}
              disabled={config.selectedNumbers.length === 0 || config.selectedOperations.length === 0}
            >
              {t.startMission}
            </button>
          </div>
        </section>
      ) : null}

      {screen === 'game' && session && currentQuestion ? (
        <section className="panel panel-large">
          <div className="status-grid">
            <div className="status-card">
              <span className="status-label">{t.roundLabel}</span>
              <strong>{session.round}</strong>
            </div>
            <div className="status-card">
              <span className="status-label">{t.questionLabel}</span>
              <strong>
                {session.currentIndex + 1} / {session.questions.length}
              </strong>
            </div>
            <div className="status-card">
              <span className="status-label">{t.correctLabel}</span>
              <strong>{session.correctCount}</strong>
            </div>
            <div className="status-card">
              <span className="status-label">{t.incorrectLabel}</span>
              <strong>{session.incorrectCount}</strong>
            </div>
          </div>

          {noticeText ? <div className="notice-banner">{noticeText}</div> : null}

          <div className="game-card">
            <p className="section-label">{t.solveQuestion}</p>
            <div className="question">{formatQuestion(currentQuestion)}</div>

            <form
              className="answer-panel"
              onSubmit={(event) => {
                event.preventDefault()
                submitAnswer()
              }}
            >
              <label className="field answer-field">
                <span>{t.yourAnswer}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={answer}
                  onChange={(event) => handleInputChange(event.target.value)}
                  disabled={Boolean(feedback)}
                  autoFocus
                />
              </label>

              <div className="keypad" aria-label={t.keypadAriaLabel}>
                {keypadButtons.slice(0, 9).map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    className="keypad-button"
                    onClick={() => appendDigit(digit)}
                    disabled={Boolean(feedback)}
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  className="keypad-button secondary"
                  onClick={clearAnswer}
                  disabled={Boolean(feedback)}
                >
                  {t.clear}
                </button>
                <button
                  type="button"
                  className="keypad-button"
                  onClick={() => appendDigit('0')}
                  disabled={Boolean(feedback)}
                >
                  0
                </button>
                <button
                  type="button"
                  className="keypad-button secondary"
                  onClick={removeLastDigit}
                  disabled={Boolean(feedback)}
                >
                  {t.back}
                </button>
              </div>

              <div className="action-row">
                {!feedback ? (
                  <button type="submit" className="primary-button" disabled={answer.trim() === ''}>
                    {t.checkAnswer}
                  </button>
                ) : (
                  <button type="button" className="primary-button" onClick={goToNextStep}>
                    {session.currentIndex === session.questions.length - 1
                      ? t.finishRound
                      : t.nextQuestion}
                  </button>
                )}
              </div>
            </form>

            {feedback ? (
              <div className={`feedback-card ${feedback.isCorrect ? 'success' : 'warning'}`}>
                <strong>{feedback.isCorrect ? t.greatJob : t.niceTry}</strong>
                <p>
                  {feedback.isCorrect
                    ? t.correctFeedback(formatQuestion(currentQuestion), feedback.correctAnswer)
                    : t.incorrectFeedback(
                        formatQuestion(currentQuestion),
                        feedback.correctAnswer,
                        feedback.childAnswer,
                      )}
                </p>
              </div>
            ) : (
              <p className="hint centered">{t.collectStarHint}</p>
            )}
          </div>
        </section>
      ) : null}

      {screen === 'summary' && session ? (
        <section className="panel panel-large">
          <div className="section-copy">
            <p className="section-label">{t.summaryLabel}</p>
            <h2>{t.summaryTitle}</h2>
            <p>
              {t.summaryDescription(session.correctCount, session.totalQuestionCount)
                .split(/(\d+)/)
                .map((part, index) =>
                  /^\d+$/.test(part) ? <strong key={index}>{part}</strong> : part,
                )}
            </p>
          </div>

          <div className="summary-grid">
            <div className="summary-card">
              <span className="status-label">{t.correctAnswers}</span>
              <strong>{session.correctCount}</strong>
            </div>
            <div className="summary-card">
              <span className="status-label">{t.incorrectAnswers}</span>
              <strong>{session.incorrectCount}</strong>
            </div>
            <div className="summary-card">
              <span className="status-label">{t.stillToReview}</span>
              <strong>{latestIncorrectAttempts.length}</strong>
            </div>
            <div className="summary-card">
              <span className="status-label">{t.attemptsMade}</span>
              <strong>{session.attempts.length}</strong>
            </div>
          </div>

          <div className="card review-card">
            <h3>{t.questionsToReview}</h3>
            {latestIncorrectAttempts.length === 0 ? (
              <p className="success-copy">{t.allCorrectedMessage}</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>{t.reviewQuestionColumn}</th>
                      <th>{t.reviewLastAnswerColumn}</th>
                      <th>{t.reviewCorrectAnswerColumn}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestIncorrectAttempts.map((attempt) => (
                      <tr key={createQuestionKey(attempt.question)}>
                        <td>{formatQuestion(attempt.question)}</td>
                        <td>{attempt.childAnswer}</td>
                        <td>{attempt.question.correctAnswer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="action-row action-row-wide">
            <button type="button" className="secondary-button" onClick={startNewSession}>
              {t.newSession}
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={restartWithMissedQuestions}
              disabled={latestIncorrectAttempts.length === 0}
            >
              {t.retryMissedQuestions}
            </button>
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default App
