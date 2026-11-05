<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAIExplanationService
{
    public function explain(string $language, string $code): array
    {
        $apiKey = config('services.groq.api_key');

        if (!$apiKey) {
            throw new RuntimeException('GROQ_API_KEY is not configured.');
        }

        $systemPrompt = <<<'PROMPT'
You are a careful senior software engineer explaining code to a developer.
Explain only behavior supported by the provided snippet. Do not invent missing context.

Return valid JSON only, with these exact keys:
{
  "explanation": "2 to 4 concise plain-English sentences",
  "key_logic": ["short bullet", "short bullet"],
  "time_complexity": "Big-O estimate or 'Cannot determine reliably'",
  "space_complexity": "Big-O estimate or 'Cannot determine reliably'",
  "complexity_note": "Briefly state assumptions or why it cannot be determined"
}

Complexity must be an estimate based on the visible code.
Distinguish auxiliary space from input space when relevant.
If code is incomplete or behavior depends on external data, state that limitation.
PROMPT;

        $response = Http::withToken($apiKey)
            ->acceptJson()
            ->timeout(90)
            ->post(
                rtrim(config('services.groq.base_url'), '/') . '/chat/completions',
                [
                    'model' => config('services.groq.model', 'openai/gpt-oss-20b'),
                    'temperature' => 0.2,
                    'response_format' => ['type' => 'json_object'],
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => "Language: {$language}\n\nCode:\n{$code}"],
                    ],
                ]
            );

        if ($response->failed()) {
            $errorMessage = data_get(
                $response->json(),
                'error.message',
                'Unknown Groq API error'
            );

            throw new RuntimeException(
                'Groq API request failed (HTTP ' .
                $response->status() . '): ' . $errorMessage
            );
        }

        $content = data_get($response->json(), 'choices.0.message.content');

        if (!is_string($content) || trim($content) === '') {
            throw new RuntimeException('Groq returned an empty response.');
        }

        $result = json_decode($content, true);

        if (
            !is_array($result) ||
            !isset($result['explanation']) ||
            !is_string($result['explanation'])
        ) {
            throw new RuntimeException('Groq returned an invalid explanation format.');
        }

        return [
            'explanation' => $result['explanation'],
            'key_logic' => is_array($result['key_logic'] ?? null)
                ? $result['key_logic']
                : [],
            'time_complexity' => (string) (
                $result['time_complexity'] ?? 'Cannot determine reliably'
            ),
            'space_complexity' => (string) (
                $result['space_complexity'] ?? 'Cannot determine reliably'
            ),
            'complexity_note' => (string) ($result['complexity_note'] ?? ''),
        ];
    }
}
