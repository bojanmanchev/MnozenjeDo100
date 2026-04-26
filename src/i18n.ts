export type Locale = 'en' | 'mk'

const localeStorageKey = 'star-multiplication-locale'

type Translation = {
  htmlLang: string
  metaTitle: string
  languageLabel: string
  languageOptions: Record<Locale, string>
  eyebrow: string
  title: string
  subtitle: string
  starBankAriaLabel: string
  setupLabel: string
  setupTitle: string
  setupDescription: string
  numbersToPractice: string
  numberSelectionHint: (maxTableNumber: number) => string
  sessionOptions: string
  maxMultiplier: string
  shuffleQuestions: string
  retryIncorrectAtEnd: string
  sessionPreview: string
  numbersLabel: string
  questionsLabel: string
  chooseAtLeastOneNumber: string
  startMission: string
  roundLabel: string
  questionLabel: string
  correctLabel: string
  incorrectLabel: string
  solveMultiplication: string
  yourAnswer: string
  keypadAriaLabel: string
  clear: string
  back: string
  checkAnswer: string
  finishRound: string
  nextQuestion: string
  collectStarHint: string
  greatJob: string
  niceTry: string
  retryRoundNotice: string
  practiceRoundNotice: string
  correctFeedback: (formattedQuestion: string, correctAnswer: number) => string
  incorrectFeedback: (
    formattedQuestion: string,
    correctAnswer: number,
    childAnswer: number,
  ) => string
  summaryLabel: string
  summaryTitle: string
  summaryDescription: (correctCount: number, totalQuestionCount: number) => string
  correctAnswers: string
  incorrectAnswers: string
  stillToReview: string
  attemptsMade: string
  questionsToReview: string
  allCorrectedMessage: string
  reviewQuestionColumn: string
  reviewLastAnswerColumn: string
  reviewCorrectAnswerColumn: string
  newSession: string
  retryMissedQuestions: string
}

const translations: Record<Locale, Translation> = {
  en: {
    htmlLang: 'en',
    metaTitle: 'Star Multiplication Mission',
    languageLabel: 'Language',
    languageOptions: {
      en: 'English',
      mk: 'Makedonski',
    },
    eyebrow: 'Math game',
    title: 'Star Multiplication Mission',
    subtitle: 'Practice selected multiplication tables with a simple, mobile-friendly game.',
    starBankAriaLabel: 'Collected stars preview',
    setupLabel: 'Setup',
    setupTitle: 'Choose what to practice',
    setupDescription:
      'Pick the multiplication tables to train, choose how far to go, and start the mission.',
    numbersToPractice: 'Numbers to practice',
    numberSelectionHint: (maxTableNumber) =>
      `Tap one or more numbers from 1 to ${maxTableNumber}.`,
    sessionOptions: 'Session options',
    maxMultiplier: 'Max multiplier',
    shuffleQuestions: 'Shuffle questions',
    retryIncorrectAtEnd: 'Retry missed questions once at the end',
    sessionPreview: 'Session preview',
    numbersLabel: 'Numbers',
    questionsLabel: 'Questions',
    chooseAtLeastOneNumber: 'Choose at least one number',
    startMission: 'Start mission',
    roundLabel: 'Round',
    questionLabel: 'Question',
    correctLabel: 'Correct',
    incorrectLabel: 'Incorrect',
    solveMultiplication: 'Solve the multiplication',
    yourAnswer: 'Your answer',
    keypadAriaLabel: 'Number pad',
    clear: 'Clear',
    back: 'Back',
    checkAnswer: 'Check answer',
    finishRound: 'Finish round',
    nextQuestion: 'Next question',
    collectStarHint: 'Collect one star for every correct answer.',
    greatJob: 'Great job!',
    niceTry: 'Nice try!',
    retryRoundNotice: "Retry round! Let's practice the tricky ones once more.",
    practiceRoundNotice: 'Practice round: only the questions that still need work.',
    correctFeedback: (formattedQuestion, correctAnswer) =>
      `${formattedQuestion} = ${correctAnswer}`,
    incorrectFeedback: (formattedQuestion, correctAnswer, childAnswer) =>
      `${formattedQuestion} = ${correctAnswer}. You answered ${childAnswer}.`,
    summaryLabel: 'Summary',
    summaryTitle: 'Mission complete',
    summaryDescription: (correctCount, totalQuestionCount) =>
      `You collected ${correctCount} stars and finished ${totalQuestionCount} unique questions.`,
    correctAnswers: 'Correct answers',
    incorrectAnswers: 'Incorrect answers',
    stillToReview: 'Still to review',
    attemptsMade: 'Attempts made',
    questionsToReview: 'Questions to review',
    allCorrectedMessage:
      'Amazing work. Every question has been corrected by the end of the session.',
    reviewQuestionColumn: 'Question',
    reviewLastAnswerColumn: 'Your last answer',
    reviewCorrectAnswerColumn: 'Correct answer',
    newSession: 'New session',
    retryMissedQuestions: 'Retry missed questions',
  },
  mk: {
    htmlLang: 'mk',
    metaTitle: 'Ѕвездена мисија за множење',
    languageLabel: 'Јазик',
    languageOptions: {
      en: 'English',
      mk: 'Македонски',
    },
    eyebrow: 'Математичка игра',
    title: 'Ѕвездена мисија за множење',
    subtitle: 'Вежбај ги избраните таблици за множење со едноставна игра прилагодена за мобилен.',
    starBankAriaLabel: 'Преглед на собрани ѕвезди',
    setupLabel: 'Поставување',
    setupTitle: 'Избери што да вежбаш',
    setupDescription:
      'Избери кои таблици за множење да ги вежбаш, до каде да одиш и започни ја мисијата.',
    numbersToPractice: 'Броеви за вежбање',
    numberSelectionHint: (maxTableNumber) =>
      `Допрете еден или повеќе броеви од 1 до ${maxTableNumber}.`,
    sessionOptions: 'Опции за сесијата',
    maxMultiplier: 'Најголем множител',
    shuffleQuestions: 'Измешај ги прашањата',
    retryIncorrectAtEnd: 'Повтори ги неточните прашања еднаш на крај',
    sessionPreview: 'Преглед на сесијата',
    numbersLabel: 'Броеви',
    questionsLabel: 'Прашања',
    chooseAtLeastOneNumber: 'Избери барем еден број',
    startMission: 'Започни мисија',
    roundLabel: 'Круг',
    questionLabel: 'Прашање',
    correctLabel: 'Точни',
    incorrectLabel: 'Неточни',
    solveMultiplication: 'Реши го множењето',
    yourAnswer: 'Твој одговор',
    keypadAriaLabel: 'Нумеричка тастатура',
    clear: 'Избриши',
    back: 'Назад',
    checkAnswer: 'Провери одговор',
    finishRound: 'Заврши круг',
    nextQuestion: 'Следно прашање',
    collectStarHint: 'Собери една ѕвезда за секој точен одговор.',
    greatJob: 'Одлично!',
    niceTry: 'Добар обид!',
    retryRoundNotice: 'Круг за повторување! Ајде уште еднаш да ги вежбаме потешките прашања.',
    practiceRoundNotice: 'Круг за вежбање: само прашањата што уште треба да се увежбаат.',
    correctFeedback: (formattedQuestion, correctAnswer) =>
      `${formattedQuestion} = ${correctAnswer}`,
    incorrectFeedback: (formattedQuestion, correctAnswer, childAnswer) =>
      `${formattedQuestion} = ${correctAnswer}. Ти одговори ${childAnswer}.`,
    summaryLabel: 'Резиме',
    summaryTitle: 'Мисијата е завршена',
    summaryDescription: (correctCount, totalQuestionCount) =>
      `Собра ${correctCount} ѕвезди и заврши ${totalQuestionCount} различни прашања.`,
    correctAnswers: 'Точни одговори',
    incorrectAnswers: 'Неточни одговори',
    stillToReview: 'Остануваат за преглед',
    attemptsMade: 'Направени обиди',
    questionsToReview: 'Прашања за преглед',
    allCorrectedMessage:
      'Одлична работа. Сите прашања се поправени до крајот на сесијата.',
    reviewQuestionColumn: 'Прашање',
    reviewLastAnswerColumn: 'Твој последен одговор',
    reviewCorrectAnswerColumn: 'Точен одговор',
    newSession: 'Нова сесија',
    retryMissedQuestions: 'Повтори ги неточните прашања',
  },
}

export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const storedLocale = window.localStorage.getItem(localeStorageKey)

  if (storedLocale === 'en' || storedLocale === 'mk') {
    return storedLocale
  }

  return window.navigator.language.toLowerCase().startsWith('mk') ? 'mk' : 'en'
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(localeStorageKey, locale)
  }
}

export function getTranslation(locale: Locale): Translation {
  return translations[locale]
}
