<?php

namespace App\Http\Controllers;

use App\Models\Explanation;
use App\Services\OpenAIExplanationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class CodeExplainerController
{
    public function explain(Request $request, OpenAIExplanationService $service): JsonResponse
    {
        $validated = $request->validate([
            'language' => ['required', 'string', 'in:javascript,python'],
            'code' => ['required', 'string', 'max:20000'],
        ]);

        try {
            $result = $service->explain($validated['language'], $validated['code']);

            $record = Explanation::create([
                'language' => $validated['language'],
                'code' => $validated['code'],
                'explanation' => $result['explanation'],
                'key_logic' => $result['key_logic'],
                'time_complexity' => $result['time_complexity'],
                'space_complexity' => $result['space_complexity'],
                'complexity_note' => $result['complexity_note'],
            ]);

            return response()->json(['data' => $record], 201);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Unable to explain this snippet right now. Please try again.',
            ], 502);
        }
    }

    public function history(): JsonResponse
    {
        return response()->json([
            'data' => Explanation::query()->latest()->limit(20)->get(),
        ]);
    }
}
