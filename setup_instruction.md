# Setup and Deployment Instructions

## 1. Prerequisites

Install these tools first:

1. **Node.js 24+**
2. **npm** (comes with Node.js)

To verify the installation, open a terminal in `E:\KnowledgeGames Simon\MnozenjeDo100` and run:

```powershell
node -v
npm -v
```

---

## 2. Install the project dependencies

Run:

```powershell
npm install
```

This installs React, Vite, TypeScript, and the rest of the project dependencies.

---

## 3. Start the application locally

Run:

```powershell
npm run dev
```

Then open the local address shown in the terminal, usually:

```text
http://localhost:5173
```

Use this mode while developing because changes appear immediately in the browser.

---

## 4. Build the production version

Run:

```powershell
npm run build
```

This creates an optimized production build in the `dist` folder.

---

## 5. Preview the production build locally

After building, run:

```powershell
npm run preview
```

Open the preview address shown in the terminal to check the production build before deploying.

---

## 6. Easiest deployment option: Netlify

This app is a static web app, so Netlify is one of the easiest ways to publish it.

### Steps

1. Build the app:

```powershell
npm run build
```

2. Open [https://app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the generated `dist` folder into the page
4. Wait for Netlify to upload and publish the app
5. Open the public URL that Netlify gives you

### Important build settings

If you deploy through a connected Git repository later, use:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |

---

## 7. Alternative deployment option: Vercel

If you later push the project to GitHub, Vercel is also very simple.

### Steps

1. Push the project to a GitHub repository
2. Open [https://vercel.com](https://vercel.com)
3. Import the GitHub repository
4. Keep the detected framework as **Vite**
5. Confirm the build settings
6. Deploy

### Vercel build settings

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |

---

## 8. How to use the app

1. Open the app in the browser
2. Choose the multiplication numbers to practice
3. Set the max multiplier
4. Leave shuffle and retry enabled for the recommended experience
5. Press **Start mission**
6. Enter answers using the keyboard or the on-screen number pad
7. Review the summary and retry missed questions if needed

---

## 9. Mobile access

You do **not** need a separate mobile app for this version.

After deployment, open the same web URL on:

1. phone
2. tablet
3. desktop

Because the interface is responsive, it should work in the mobile browser as well.
