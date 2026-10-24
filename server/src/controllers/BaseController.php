<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Http\ApiException;
use DateTimeImmutable;
use PDO;

abstract class BaseController
{
    public function __construct(protected readonly PDO $pdo)
    {
    }

    protected function body(): array
    {
        $rawBody = file_get_contents('php://input');

        if ($rawBody === false || $rawBody === '') {
            throw new ApiException('Тело запроса не должно быть пустым.', 422);
        }

        try {
            $body = json_decode($rawBody, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new ApiException('Тело запроса должно быть корректным JSON.', 400);
        }

        if (!is_array($body)) {
            throw new ApiException('Тело запроса должно быть JSON-объектом.', 422);
        }

        return $body;
    }

    protected function string(array $body, string $field, int $maxLength): string
    {
        $value = trim((string) ($body[$field] ?? ''));

        if ($value === '') {
            throw new ApiException("Поле {$field} обязательно.", 422);
        }

        if (mb_strlen($value) > $maxLength) {
            throw new ApiException("Поле {$field} не должно быть длиннее {$maxLength} символов.", 422);
        }

        return $value;
    }

    protected function positiveInt(array $body, string $field): int
    {
        $value = filter_var($body[$field] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

        if ($value === false) {
            throw new ApiException("Поле {$field} должно быть положительным целым числом.", 422);
        }

        return $value;
    }

    protected function decimal(array $body, string $field, float $min, float $max): float
    {
        $value = $body[$field] ?? null;

        if (!is_numeric($value) || (float) $value < $min || (float) $value > $max) {
            throw new ApiException("Поле {$field} должно быть числом от {$min} до {$max}.", 422);
        }

        return (float) $value;
    }

    protected function date(array $body, string $field): string
    {
        $value = (string) ($body[$field] ?? '');
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);

        if ($date === false || $date->format('Y-m-d') !== $value) {
            throw new ApiException("Поле {$field} должно иметь формат ГГГГ-ММ-ДД.", 422);
        }

        return $value;
    }

    protected function ensureExists(string $table, int $id): void
    {
        $statement = $this->pdo->prepare("SELECT 1 FROM {$table} WHERE id = :id");
        $statement->execute(['id' => $id]);

        if (!$statement->fetchColumn()) {
            throw new ApiException('Связанная запись не найдена.', 422);
        }
    }

    protected function notFound(): never
    {
        throw new ApiException('Запись не найдена.', 404);
    }
}
