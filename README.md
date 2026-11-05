# AI-Powered Code Explainer

A full-stack AI-powered application built with **React + Vite, Laravel 12, Groq AI, and MySQL**.

The application helps developers understand source code by generating plain-English explanations, identifying key logic, and estimating time and space complexity.

## Features

- Accepts JavaScript and Python code snippets.
- Sends source code to **Groq AI** through the Laravel backend.
- Keeps the Groq API key securely on the server; it never reaches the browser.
- Generates short plain-English code explanations.
- Identifies important logic and operations.
- Estimates time and space complexity using Big-O notation.
- Saves successful explanations to MySQL.
- Displays recent explanation history.
- Includes loading indicators and API error handling.

> This is a full-stack starter application. Install Laravel and Node.js dependencies before running it. The repository does not include `vendor/` or `node_modules/`.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Code Editor | Monaco Editor (if included in the current frontend implementation) |
| Backend | PHP 8.3, Laravel 12 |
| AI Provider | Groq AI |
| AI Model | `openai/gpt-oss-20b` |
| Database | MySQL |
| API | RESTful API |
| PHP Dependencies | Composer |
| Frontend Dependencies | npm |

## Requirements

- PHP 8.3+
- Composer 2
- Node.js 20+
- npm
- MySQL 8+ or compatible MySQL/MariaDB
- Git
- A Groq API key

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-code-explainer.git
cd ai-code-explainer
```

## 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install Laravel dependencies:

```bash
composer install
```

Create the environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**Linux/macOS:**

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

## 3. Configure MySQL Database

Start MySQL using XAMPP or your local MySQL server.

Create the database:

```sql
CREATE DATABASE ai_code_explainer
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Open `backend/.env` and configure your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_code_explainer
DB_USERNAME=root
DB_PASSWORD=
```

Change the username and password according to your local MySQL configuration.

## 4. Configure Groq AI

The application uses the Groq API to generate code explanations.

Create a Groq API key:

https://console.groq.com/keys

Add the following configuration to `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
GROQ_BASE_URL=https://api.groq.com/openai/v1
```

Replace `your_groq_api_key` with your actual Groq API key.

**Security:** Never commit your actual `.env` file or expose your API key in frontend code or GitHub.

## 5. Run Database Migrations

From the backend directory:

```bash
php artisan config:clear
php artisan migrate
```

Laravel will create the required database tables using the migration files included in the repository.

## 6. Start Laravel Backend

```bash
php artisan serve
```

Backend URL:

```text
http://127.0.0.1:8000
```

Keep this terminal running.

## 7. Configure the Frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Create the frontend environment file if required:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**Linux/macOS:**

```bash
cp .env.example .env
```

The frontend uses the backend API URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Start the React development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## 8. Use the Application

1. Open `http://localhost:5173`.
2. Select JavaScript or Python.
3. Paste a code snippet into the editor.
4. Click **Explain code**.
5. Review the generated explanation.
6. Check key logic and time/space complexity.
7. View recent successful requests in the history panel.

## API Documentation

### POST `/api/explain`

Generates an AI-powered explanation for the submitted source code.

**Request:**

```json
{
  "language": "javascript",
  "code": "function add(a, b) { return a + b; }\nconsole.log(add(10, 20));"
}
```

**Response shape:**

```json
{
  "data": {
    "id": 1,
    "language": "javascript",
    "code": "function add(a, b) { return a + b; }",
    "explanation": "The function adds two values...",
    "key_logic": [
      "Defines add(a, b)",
      "Returns a + b"
    ],
    "time_complexity": "O(1)",
    "space_complexity": "O(1)",
    "complexity_note": "Estimated from the visible snippet."
  }
}
```

### GET `/api/history`

Returns the latest 20 saved explanations.

## Architecture and Technical Decisions

```text
React UI
   |
   | JSON over HTTP
   v
Laravel 12 API
   |
   |-- Request Validation
   |
   |-- CodeExplainerController
   |
   |-- OpenAIExplanationService
   |       |
   |       | HTTPS Request
   |       v
   |    Groq AI API
   |    openai/gpt-oss-20b
   |
   |-- Explanation Model
   |
   v
MySQL Database
   |
   v
React UI displays explanation
and recent history
```

### Technology Decisions

- **React + Vite:** Component-based frontend with a fast development server.
- **Laravel 12:** Handles request validation, API orchestration, environment configuration, persistence, and error handling.
- **Groq AI:** Generates natural-language code explanations using the OpenAI-compatible Chat Completions API.
- **MySQL:** Stores submitted code snippets and generated explanations for history.
- **Server-side API key:** All Groq API requests are made through Laravel. The API key is never exposed to the browser.

### AI Response Structure

The AI returns structured JSON containing:

- `explanation` – Plain-English explanation.
- `key_logic` – Important operations and code behavior.
- `time_complexity` – Estimated Big-O time complexity.
- `space_complexity` – Estimated Big-O space complexity.
- `complexity_note` – Assumptions and limitations.

## Accuracy and Hallucination Handling

- The system prompt instructs the model to explain only behavior supported by the supplied code.
- Missing context and uncertainty should be explicitly mentioned.
- Complexity analysis is an estimate rather than a formal proof.
- Incomplete snippets or behavior depending on external data may prevent reliable complexity analysis.
- A future improvement could use language parsers or AST analysis for deterministic syntax validation and code structure extraction.

LLM-generated output is not guaranteed to be correct. Review explanations before relying on them for production or safety-critical decisions.

## Security and Production Considerations

- Never commit `.env` files or API keys.
- Keep the Groq API key in Laravel environment configuration.
- Do not expose API credentials in frontend code.
- Add authentication, rate limiting, request-size limits, logging, and abuse controls before public deployment.
- Consider redacting secrets from submitted source code before sending it to an external AI provider.
- Add automated tests for validation, provider failures, malformed AI responses, and database persistence.
- The application stores submitted source code in MySQL. Do not use confidential source code without appropriate authorization and data-retention controls.

## Troubleshooting

| Issue | Possible Solution |
|---|---|
| `GROQ_API_KEY is not configured` | Verify `GROQ_API_KEY` in `backend/.env` and clear Laravel configuration cache. |
| Database connection error | Check MySQL service and `DB_*` configuration. |
| CORS error | Verify Laravel CORS configuration and the frontend origin. |
| Groq HTTP 401 | Verify the API key. |
| Groq HTTP 429 | Check provider rate limits and usage quotas. |
| Model not found | Verify that the configured model is available in your Groq account. |
| Frontend API error | Verify that Laravel is running and `VITE_API_BASE_URL` is correct. |

## Future Enhancements

1. Add Python AST and JavaScript parser integration for deterministic code analysis.
2. Add original-versus-optimized code comparison.
3. Add authentication and per-user explanation history.
4. Add code quality and best-practice recommendations.
5. Add automated backend and frontend tests.
6. Add support for additional programming languages.

## Author

**Sourabh Mhetre**

Full Stack Software Engineer

**Project:** AI-Powered Code Explainer  
**Stack:** React.js | Laravel 12 | PHP 8.3 | MySQL | Groq AI