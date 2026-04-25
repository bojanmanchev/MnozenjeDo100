# Math Multiplying Game Specification

## Goal

Create a very simple game for a child to practice the multiplication table up to 100 by **guessing the result of a multiplication**.

Example:
- Question: `2 x 4`
- Child answer: `8`

The first version should be easy to build, easy to use, and available from both **web** and **mobile browser**.

---

## Recommended Technology

**Recommendation:** build it as a **responsive web app**.

### Why this is the easiest way

- One codebase for desktop, tablet, and phone
- No need to build separate Android and iPhone apps
- Easy to open from a browser
- Can later be upgraded to a **PWA** (Progressive Web App) so it feels more like an app on mobile

### Suggested language and stack

- **Language:** TypeScript
- **UI:** React
- **Starter/build tool:** Vite
- **Styling:** simple CSS or a lightweight UI library

### Why TypeScript

- Easy to maintain
- Good for defining game configuration clearly
- Works well for web and mobile-friendly interfaces

---

## Do You Need a Mobile App?

**No, not for this version.** A responsive web app should be enough.

For the first version, a web app is the best choice because:
- it is simpler,
- faster to build,
- easier to test,
- and works on phones through the browser.

If later you want:
- offline mode,
- push notifications,
- install-from-home-screen behavior,
- or deeper phone integration,

then you can convert it into a **PWA** or build a mobile app later.

---

## Core Game Idea

The child sees one multiplication expression and must enter the correct result.

Example session:
1. `2 x 1`
2. `2 x 2`
3. `2 x 3`
4. ...
5. `3 x 1`
6. `3 x 2`
7. ...

The game should generate questions from a configuration like:
- practice up to `10`
- selected multiplication numbers: `[2, 3]`

This should produce:
- `2 x 1` to `2 x 10`
- `3 x 1` to `3 x 10`

---

## Functional Requirements

### 1. Practice Configuration

The parent should be able to configure:

- **Max multiplier**
  - example: `10`
- **Selected base numbers**
  - example: `[2, 3]`

### 2. Question Generation

From the configuration:
- for each selected number,
- generate multiplication questions from `number x 1` to `number x maxMultiplier`

Example:
- selected numbers: `2, 3`
- max multiplier: `10`

Generated set:
- `2 x 1` ... `2 x 10`
- `3 x 1` ... `3 x 10`

### 3. Game Flow

The game should:
- show one question at a time
- allow the child to type or tap the answer
- show immediate feedback:
  - correct
  - incorrect
- move to the next question

### 4. Session Tracking Only

For this first version, no account system and no long-term score storage are needed.

Track only for the current session:
- how many answers were correct
- how many answers were incorrect
- which questions were answered incorrectly

### 5. Session Summary

At the end of the session, show:
- total questions
- correct answers count
- incorrect answers count
- list of incorrect questions
- correct answer for each incorrect question

Example:

| Question | Child Answer | Correct Answer |
|---|---:|---:|
| 3 x 4 | 11 | 12 |
| 2 x 7 | 12 | 14 |

---

## Suggested Gamification

Keep the gamification simple and encouraging.

### Recommended approach

Use a **small adventure/progress style**:
- each correct answer moves the child one step forward
- a session is presented as a short journey
- for example: crossing a bridge, climbing a mountain, collecting stars, or helping an animal reach home

### Best simple theme

**Star collecting** is recommended.

How it works:
- every correct answer gives **1 star**
- finishing all questions completes the mission
- end screen says things like:
  - "Great job!"
  - "You collected 14 stars!"
  - "Let's practice the tricky ones again."

### Why this is good

- positive and easy to understand
- motivating without needing a complex scoring system
- good for younger children
- easy to implement

### For incorrect answers

Do not punish heavily.

Instead:
- show a gentle correction
- optionally repeat missed questions at the end
- highlight improvement, not failure

---

## Recommended First Version UX

### Main screens

1. **Setup screen**
   - choose multiplication numbers (for example 2 and 3)
   - choose max multiplier (default 10)
   - start game

2. **Game screen**
   - big multiplication question
   - large answer input or number buttons
   - submit/check button
   - visible progress
   - visible session counters:
     - correct
     - incorrect

3. **Summary screen**
   - session results
   - incorrect answers review
   - button to retry missed questions
   - button to start a new session

### Child-friendly design

- very large text
- high contrast colors
- large tap targets
- minimal distractions
- optional sound effects
- optional success animation for correct answers

---

## Game Rules for Version 1

- One question is shown at a time
- Questions can be shown in order or shuffled
- Child answers with a number
- Immediate feedback is shown
- Session continues until all generated questions are answered
- End summary shows correct and incorrect answers

### Recommended default behavior

- **Default max multiplier:** 10
- **Default mode:** shuffled questions
- **Default retry mode:** repeat incorrect questions once at the end

---

## Data Model Suggestion

### Configuration

```ts
type GameConfig = {
  selectedNumbers: number[];
  maxMultiplier: number;
  shuffleQuestions: boolean;
  retryIncorrectAtEnd: boolean;
};
```

### Question

```ts
type Question = {
  left: number;
  right: number;
  correctAnswer: number;
};
```

### Answer Result

```ts
type AnswerResult = {
  question: Question;
  childAnswer: number | null;
  isCorrect: boolean;
};
```

### Session State

```ts
type GameSession = {
  questions: Question[];
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
  incorrectAnswers: AnswerResult[];
};
```

---

## Question Generation Logic

Input:

```ts
selectedNumbers = [2, 3]
maxMultiplier = 10
```

Output:

```ts
[
  { left: 2, right: 1, correctAnswer: 2 },
  { left: 2, right: 2, correctAnswer: 4 },
  ...
  { left: 2, right: 10, correctAnswer: 20 },
  { left: 3, right: 1, correctAnswer: 3 },
  ...
  { left: 3, right: 10, correctAnswer: 30 }
]
```

---

## Nice-to-Have Features for Later

Not needed now, but good future ideas:

- sound effects
- spoken questions
- timer per question
- badges or levels
- saving progress locally
- parent dashboard
- difficulty modes
- mixed multiplication sets
- support for division practice later

---

## Final Recommendation

Build **a responsive web app in TypeScript + React**.

For the first version:
- use a **web app**, not a mobile app
- keep only **session-based tracking**
- use **star collecting** or similar light gamification
- support configurable multiplication practice such as:
  - numbers `2` and `3`
  - up to multiplier `10`

This is the easiest, fastest, and most practical approach for your child to practice multiplication on both desktop and mobile.
