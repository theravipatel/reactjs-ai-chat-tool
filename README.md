# ReactJS AI Chat Tool

A browser-based AI chat application built with React, Vite, and the Google Gemini API. It supports saved conversations, model selection, image prompts, and Markdown-formatted responses.

**Live demo:** [reactjsaichat.onrender.com](https://reactjsaichat.onrender.com/)

> The app asks you to provide your own Gemini API key. Review the [security and privacy notes](#security-and-privacy) before using the live demo.

## Features

- Chat with Gemini models through the Google Gen AI SDK.
- Continue conversations using Gemini interaction IDs.
- Create and switch between saved chat sessions.
- Send text and supported image attachments (PNG, JPEG, WebP, HEIC, and HEIF; up to 2 MiB).
- Render model responses as Markdown with `react-markdown`.
- Choose an available model; the selected model is remembered in the browser.
- Validate the Gemini API key during the initial setup flow.
- Handle loading, empty-response, rate-limit, and service-unavailable states.

## Technology Stack

- React 19 for the component-based interface and hooks.
- Vite for local development and production builds.
- Tailwind CSS 4 through the Vite plugin.
- `@google/genai` for Gemini API interactions.
- `react-markdown` for formatted model output.
- Browser `localStorage` for API key, display name, model preference, and chat sessions.

## Project Structure

```text
src/
├── App.jsx
├── features/
│   ├── chat/
│   │   ├── components/       # Chat input, messages, list, and sidebar
│   │   ├── hooks/            # Chat workflow and orchestration
│   │   ├── reducers/         # Chat state transitions
│   │   ├── repositories/     # Browser-backed chat persistence
│   │   ├── services/         # Gemini API integration
│   │   └── utils/            # Message and session helpers
│   └── onboarding/
│       ├── components/       # Initial setup screen
│       └── hooks/            # Setup validation and persistence
└── shared/
    └── components/           # Header, footer, and logo
```

## Architecture and Code Patterns

The app uses a feature-oriented structure: chat-specific UI and logic live together under `features/chat`, onboarding has its own feature, and reusable layout elements live under `shared`.

### Chat data flow

```text
App
├── WelcomeScreen -> useOnboarding -> geminiService.validateApiKey
└── Chat UI -> useChat
    ├── chatReducer        -> updates UI state from explicit actions
    ├── geminiService      -> validates and sends Gemini requests
    ├── chatRepository     -> loads and saves sessions in localStorage
    └── chatUtils          -> creates and updates messages and sessions
```

`App` selects the onboarding or chat experience based on browser setup values. During onboarding, `useOnboarding` validates the supplied key through the Gemini service before storing the key and display name. Once setup is complete, `useChat` coordinates conversation actions: it dispatches reducer actions, calls the Gemini service, and saves updated sessions through the repository. Chat components receive state and callbacks rather than owning API or persistence logic.

The reducer keeps chat state transitions explicit. The service isolates Gemini SDK calls and response/error handling. The repository validates parsed session data before it is used, while utility functions handle message and session construction. This separation keeps rendering, state transitions, API communication, and browser persistence in distinct modules.

### Markdown responses

Gemini responses can contain Markdown formatting. The chat message component renders that content with `react-markdown` instead of displaying the Markdown markers as plain text.

## Getting Started

### Requirements

- Node.js compatible with the Vite version in this project.
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal. On first launch, enter a display name and Gemini API key in the setup screen. The app validates the key before continuing.

### Available scripts

```bash
npm run dev      # Start the Vite development server
npm run lint     # Run ESLint
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
```

## Gemini API Configuration

This project uses the official [`@google/genai`](https://ai.google.dev/gemini-api/docs/get-started) SDK. No `.env` file is required: the application collects the API key through its setup screen, validates it, and stores it in browser `localStorage` for subsequent visits. The available model choices are defined in the chat feature's Gemini service.

## Security and Privacy

This is a client-only demo. The Gemini API key is stored in browser `localStorage` and is used by requests sent directly from the browser to Gemini; it is not protected by a backend. A deployed frontend cannot keep a client-side key secret. Use a key appropriate for personal or testing use, understand the provider's usage and billing policies, and avoid entering a key on a shared or untrusted device. Remove the key by clearing this site's browser storage.

Chat sessions, the display name, and the selected model are also stored in browser `localStorage` on that device. They are not synchronized to a project backend.
