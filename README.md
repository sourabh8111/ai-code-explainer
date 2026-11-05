# AI-Powered Code Explainer

A starter full-stack application built with React + Vite, Laravel 12, OpenAI API, and MySQL.

## Features

- Accepts JavaScript and Python snippets.
- Sends code to OpenAI from the Laravel backend (API key never reaches the browser).
- Returns a short plain-English explanation, key logic, and estimated time/space complexity.
- Saves each successful explanation to MySQL and displays recent history.
- Includes loading and API error states.

> This is a starter project. Install the Laravel and Node dependencies before running it. The ZIP does not include `vendor/` or `node_modules/`.

## Requirements

- PHP 8.2+
- Composer 2
- Node.js 20+
- MySQL 8+ (or compatible MySQL/MariaDB)
- An OpenAI API key

## 1. Configure the backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `backend/.env` and set your database credentials and OpenAI key:

```env
DB_DATABASE=ai_code_explainer
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

Create the database in MySQL:

```sql
CREATE DATABASE ai_code_explainer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations and start Laravel:

```bash
php artisan migrate
php artisan serve
```

Backend URL: `http://127.0.0.1:8000`

## 2. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend URL: `http://localhost:5173`

The frontend calls `http://127.0.0.1:8000/api` by default. You can change `VITE_API_BASE_URL` in `frontend/.env`.

## 3. Use the application

1. Open `http://localhost:5173`.
2. Select JavaScript or Python.
3. Paste a snippet into the editor.
4. Click **Explain code**.
5. Review the explanation, key logic, and complexity estimate.
6. Recent successful requests appear in the history panel.

## API

### `POST /api/explain`

Request:

```json
{
  "language": "javascript",
  "code": "function add(a, b) { return a + b; }\\nconsole.log(add(10, 20));"
}
```

Response shape:

```json
{
  "data": {
    "id": 1,
    "language": "javascript",
    "code": "function add(a, b) { return a + b; }",
    "explanation": "The function adds two values...",
    "key_logic": ["Defines add(a, b)", "Returns a + b"],
    "time_complexity": "O(1)",
    "space_complexity": "O(1)",
    "complexity_note": "Estimated from the visible snippet."
  }
}
```

### `GET /api/history`

Returns the latest 20 saved explanations.

## Architecture and technical decisions

```text
React UI (Monaco Editor)
       |
       | JSON over HTTP
       v
Laravel API
  |-- Request validation
  |-- CodeExplainerController
  |-- OpenAIExplanationService
  |-- Explanation model / MySQL
       |
       | HTTPS request (server-side API key)
       v
OpenAI Chat Completions API
```

- **React + Vite:** fast development server and component-based UI.
- **Monaco Editor:** familiar editor experience with language-aware syntax highlighting.
- **Laravel:** validation, API orchestration, secret management, persistence, and error handling.
- **OpenAI:** generates natural-language explanations. The model is configurable through `OPENAI_MODEL`.
- **MySQL:** stores submitted snippets and explanations so history survives page reloads.
- **No browser-side API key:** all OpenAI requests are made by Laravel.

## Accuracy and hallucination handling

- The prompt tells the model to describe only behavior supported by the supplied snippet and to state uncertainty when context is missing.
- Complexity is explicitly an estimate, not a formal proof. The model must say when complexity cannot be determined reliably.
- A language parser/AST pass is a useful next improvement for syntax validation and deterministic extraction of functions, loops, and branches. It is not included in this starter ZIP.
- LLM output is not guaranteed to be correct. Review generated explanations before relying on them for safety-critical or production decisions.

## Security and production notes

- Never commit `.env` files or API keys.
- Add authentication, rate limiting, request-size limits, logging, and abuse controls before public deployment.
- Consider redacting secrets from pasted code before sending it to an external LLM.
- Add tests for validation, provider failures, malformed model responses, and persistence.
- The starter stores submitted source code in MySQL. Do not use it with confidential code unless you have appropriate authorization and data-retention controls.

## Troubleshooting

- **`OPENAI_API_KEY is not configured`:** set the key in `backend/.env`, then restart Laravel.
- **Database connection error:** verify MySQL is running and the `DB_*` values match your local setup.
- **CORS error:** the Laravel CORS config allows the Vite dev origin `http://localhost:5173`; adjust it for your environment.
- **401 from OpenAI:** verify the API key and account API access/billing.
- **Model not found:** change `OPENAI_MODEL` to a model enabled for your API account.

## Suggested next improvements

1. Add Python `ast` and a JavaScript parser for deterministic code annotations.
2. Add an original-vs-optimized code diff view.
3. Add authentication and per-user history.
4. Add automated backend and frontend tests.
