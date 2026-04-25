import { useMemo, useState } from 'react'
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
  type Question,
} from './game'

type Screen = 'setup' | 'game' | 'summary'

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

function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG)
  const [session, setSession] = useState<GameSession | null>(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [roundNotice, setRoundNotice] = useState<string | null>(null)

  const selectedNumbers = new Set(config.selectedNumbers)
  const currentQuestion = session?.questions[session.currentIndex] ?? null
  const questionCount = config.selectedNumbers.length * config.maxMultiplier
  const latestIncorrectAttempts = useMemo(
    () => (session ? getLatestIncorrectAttempts(session.attempts) : []),
    [session],
  )
  const starPreviewCount = Math.min(session?.correctCount ?? 0, 15)

  const updateConfig = (partial: Partial<GameConfig>) => {
    setConfig((current) => ({ ...current, ...partial }))
  }

  const toggleNumber = (value: number) => {
    const nextSelection = selectedNumbers.has(value)
      ? config.selectedNumbers.filter((number) => number !== value)
      : [...config.selectedNumbers, value].sort((left, right) => left - right)

    updateConfig({ selectedNumbers: nextSelection })
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
      setRoundNotice("Retry round! Let's practice the tricky ones once more.")
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
    setRoundNotice('Practice round: only the questions that still need work.')
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

  const selectionSummary =
    config.selectedNumbers.length > 0 ? config.selectedNumbers.join(', ') : 'Choose at least one number'

  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">Math game</p>
          <h1>Star Multiplication Mission</h1>
          <p className="subtitle">
            Practice selected multiplication tables with a simple, mobile-friendly game.
          </p>
        </div>
        <div className="star-bank" aria-label="Collected stars preview">
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
            <p className="section-label">Setup</p>
            <h2>Choose what to practice</h2>
            <p>
              Pick the multiplication tables to train, choose how far to go, and start the
              mission.
            </p>
          </div>

          <div className="setup-grid">
            <div className="card">
              <h3>Numbers to practice</h3>
              <p className="hint">Tap one or more numbers from 1 to {MAX_TABLE_NUMBER}.</p>
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
              <h3>Session options</h3>
              <label className="field">
                <span>Max multiplier</span>
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
                <span>Shuffle questions</span>
              </label>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={config.retryIncorrectAtEnd}
                  onChange={(event) =>
                    updateConfig({ retryIncorrectAtEnd: event.target.checked })
                  }
                />
                <span>Retry missed questions once at the end</span>
              </label>
            </div>
          </div>

          <div className="session-preview">
            <div>
              <p className="section-label">Session preview</p>
              <p className="preview-line">
                <strong>Numbers:</strong> {selectionSummary}
              </p>
              <p className="preview-line">
                <strong>Questions:</strong> {questionCount}
              </p>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={startGame}
              disabled={config.selectedNumbers.length === 0}
            >
              Start mission
            </button>
          </div>
        </section>
      ) : null}

      {screen === 'game' && session && currentQuestion ? (
        <section className="panel panel-large">
          <div className="status-grid">
            <div className="status-card">
              <span className="status-label">Round</span>
              <strong>{session.round}</strong>
            </div>
            <div className="status-card">
              <span className="status-label">Question</span>
              <strong>
                {session.currentIndex + 1} / {session.questions.length}
              </strong>
            </div>
            <div className="status-card">
              <span className="status-label">Correct</span>
              <strong>{session.correctCount}</strong>
            </div>
            <div className="status-card">
              <span className="status-label">Incorrect</span>
              <strong>{session.incorrectCount}</strong>
            </div>
          </div>

          {roundNotice ? <div className="notice-banner">{roundNotice}</div> : null}

          <div className="game-card">
            <p className="section-label">Solve the multiplication</p>
            <div className="question">{formatQuestion(currentQuestion)}</div>

            <form
              className="answer-panel"
              onSubmit={(event) => {
                event.preventDefault()
                submitAnswer()
              }}
            >
              <label className="field answer-field">
                <span>Your answer</span>
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

              <div className="keypad" aria-label="Number pad">
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
                  Clear
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
                  Back
                </button>
              </div>

              <div className="action-row">
                {!feedback ? (
                  <button type="submit" className="primary-button" disabled={answer.trim() === ''}>
                    Check answer
                  </button>
                ) : (
                  <button type="button" className="primary-button" onClick={goToNextStep}>
                    {session.currentIndex === session.questions.length - 1
                      ? 'Finish round'
                      : 'Next question'}
                  </button>
                )}
              </div>
            </form>

            {feedback ? (
              <div className={`feedback-card ${feedback.isCorrect ? 'success' : 'warning'}`}>
                <strong>{feedback.isCorrect ? 'Great job!' : 'Nice try!'}</strong>
                <p>
                  {feedback.isCorrect
                    ? `${formatQuestion(currentQuestion)} = ${feedback.correctAnswer}`
                    : `${formatQuestion(currentQuestion)} = ${feedback.correctAnswer}. You answered ${feedback.childAnswer}.`}
                </p>
              </div>
            ) : (
              <p className="hint centered">Collect one star for every correct answer.</p>
            )}
          </div>
        </section>
      ) : null}

      {screen === 'summary' && session ? (
        <section className="panel panel-large">
          <div className="section-copy">
            <p className="section-label">Summary</p>
            <h2>Mission complete</h2>
            <p>
              You collected <strong>{session.correctCount}</strong> stars and finished{' '}
              <strong>{session.totalQuestionCount}</strong> unique questions.
            </p>
          </div>

          <div className="summary-grid">
            <div className="summary-card">
              <span className="status-label">Correct answers</span>
              <strong>{session.correctCount}</strong>
            </div>
            <div className="summary-card">
              <span className="status-label">Incorrect answers</span>
              <strong>{session.incorrectCount}</strong>
            </div>
            <div className="summary-card">
              <span className="status-label">Still to review</span>
              <strong>{latestIncorrectAttempts.length}</strong>
            </div>
            <div className="summary-card">
              <span className="status-label">Attempts made</span>
              <strong>{session.attempts.length}</strong>
            </div>
          </div>

          <div className="card review-card">
            <h3>Questions to review</h3>
            {latestIncorrectAttempts.length === 0 ? (
              <p className="success-copy">
                Amazing work. Every question has been corrected by the end of the session.
              </p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Your last answer</th>
                      <th>Correct answer</th>
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
              New session
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={restartWithMissedQuestions}
              disabled={latestIncorrectAttempts.length === 0}
            >
              Retry missed questions
            </button>
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default App
