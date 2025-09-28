# Macintosh 3D Interactive Experience

An interactive 3D Macintosh computer experience built with React Three Fiber.  
This project renders a vintage Macintosh model and embeds an external portfolio site on the computer screen via an iframe.

## 🚀 Features

- High-quality 3D Macintosh model
- Interactive camera controls
- Ambient sound and background music
- Responsive layout
- Fast development with Vite
- Integrates an external portfolio website in the computer screen (via iframe)

## 🛠️ Tech Stack

- React 18
- Three.js
- React Three Fiber
- React Three Drei
- TypeScript
- Vite
- Tailwind CSS
- Zustand

## 📁 Project Structure

- public/
- src/
  - pages/
  - sence/ # Scene components (including Computer.tsx and main Sence.tsx)
  - stores/ # Zustand stores
  - ui/
  - utils/
  - assets/
- static/ # 3D assets (audio, draco, environment, images, models, textures, transition)
- dist/ # Build output (ignored by git)
- .netlify/ # Netlify deployment metadata (ignored by git)

## 📦 Setup

Prerequisites:

- Node.js 18+
- pnpm or npm

Install dependencies:

- npm:
  - `npm install`
- pnpm:
  - `pnpm install`

Start development:

- npm:
  - `npm run dev`
- pnpm:
  - `pnpm dev`

Build for production:

- npm:
  - `npm run build`
- pnpm:
  - `pnpm build`

Preview production build:

- npm:
  - `npm run preview`
- pnpm:
  - `pnpm preview`

## 🔗 Integration with Portfolio

This project embeds the “os-macintosh-portfolio” site inside the Macintosh screen via an iframe.

- Code location: `src/sence/Computer.tsx`
- Update the iframe `src` to point to the production URL of your portfolio (e.g. Netlify URL).
- Example:
  - `window.open("https://your-portfolio-url/", "_blank");`
  - `<iframe src="https://your-portfolio-url/" ... />`
- Tip: Ensure the portfolio is deployed and publicly accessible; local URLs may not work when this project is deployed.

## 🔒 Security & Open Source Notes

- Do not commit environment files (`.env*`), build outputs (`dist/`, `build/`), `node_modules/`, or deployment metadata (`.netlify/`, `.vercel/`)
- Avoid hardcoding personal information or private tokens in source code
- Avoid committing personal configs or secrets (e.g., `config/personal.json`, `secrets/`)
- Consider adding a LICENSE (e.g. MIT) and a CONTRIBUTING guideline

## 📄 License

MIT 
