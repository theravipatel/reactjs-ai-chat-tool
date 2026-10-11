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

## 3) Generate Gemini API Key & Integrate it in React App
- We can get a Gemini API key by logging into Google AI Studio (https://aistudio.google.com/app/apikey) and creating a new key.
- The most secure and scalable approach is to route requests through a backend server (like Laravel/Node.js) to protect our key but we are not using backend as of now so we will integrate the key from frontend side.
- To integrate the Gemini Key from frontend side, we can run the below command to install the official Google Gen AI SDK.
    - Ref. Documentation as of Oct-2026 (https://ai.google.dev/gemini-api/docs/get-started)
    -   ```cmd
        npm install @google/genai
        ```
- Now to store our API key securely, create a `.env` file in the root of our project.
    - Example:
        -   ```env
            GEMINI_API_KEY=our_actual_api_key_here
            ```
- Integrate google/genai
    - Example:
        -   ```jsx
            import { GoogleGenAI } from '@google/genai';
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const ai = new GoogleGenAI({apiKey});

            const response = await ai.interactions.create({
                model: 'gemini-3.8-flash',
                input: inputMessage,
            });
            conole.log(response.output_text);
            ```


## 4) Format the Gemini Raw response by using react-markdown library
- Gemini provides structured text formatted in Markdown by default (`*** or **`).
- Placing Markdown syntax natively into a React JSX layout causes text to display raw punctuation characters rather than structured layout headers and linebreaks.
- To resolve this gracefully, used the react-markdown library to convert formatting structures dynamically into matching Tailwind CSS elements.
    - Command to install:
        -   ```cmd
            npm install react-markdown
            ```
    - Example:
        -   ```jsx
            <ReactMarkdown>{ responseMessage }</ReactMarkdown>
            ```