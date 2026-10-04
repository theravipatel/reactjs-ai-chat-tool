# Simple AI Chat Tool using React JS

## 1) Installation

- Install Node.js
- Install Vite
    - Why Vite?
        - Officially recommended by React docs
        - Super fast dev server
        - Cleaner build process
        - Supports TypeScript, CSS modules, pre-processors, and more!
- Setup React App via Terminal:
    -   ```
        npm create vite@latest
        ```
    - Follow the prompts and select as per your need
- Install Node Modules
    -   ```
        npm install
        ```
- Run the React App
    -   ```
        npm run dev
        ```
    - App should now run on localhost:5173 (Vite's default port).


## 2) Installation of Tailwind CSS in React
- To install `Tailwind CSS v4` in a React.js project built with Vite, follow the streamlined step-by-step guide from the official site i.e. (As of today - https://tailwindcss.com/docs/installation/using-vite). Vite is the modern, industry-standard tool for creating React applications.
- 1) Install `tailwindcss` and `@tailwindcss/vite` via npm:
    - `npm install tailwindcss @tailwindcss/vite`
- 2) Add the `@tailwindcss/vite` plugin to your Vite configuration:
    -   ```jsx
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig({
            plugins: [
                tailwindcss(),
            ],
        })
        ```
- 3) Add an `@import` to our CSS file that imports Tailwind CSS.
    - `@import "tailwindcss";`
- 4) Run your build process with npm run dev or whatever command is configured in your package.json file.