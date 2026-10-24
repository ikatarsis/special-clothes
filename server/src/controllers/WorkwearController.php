<?php

declare(strict_types=1);

namespace App\Controllers;

final class WorkwearController extends BaseController
{
    public function index(): array
    {
        return $this->pdo->query(
            'SELECT id, name, unit_price AS "unitPrice", created_at AS "createdAt" FROM workwear ORDER BY name',
        )->fetchAll();
    }

    public function show(int $id): array
    {
        $statement = $this->pdo->prepare(
            'SELECT id, name, unit_price AS "unitPrice", created_at AS "createdAt" FROM workwear WHERE id = :id',
        );
        $statement->execute(['id' => $id]);

        return $statement->fetch() ?: $this->notFound();
    }

    public function store(): array
    {
        $body = $this->body();
        $name = $this->string($body, 'name', 150);
        $unitPrice = $this->decimal($body, 'unitPrice', 0.01, 9999999999.99);
        $statement = $this->pdo->prepare(
            'INSERT INTO workwear (name, unit_price) VALUES (:name, :unitPrice) RETURNING id',
        );
        $statement->execute(compact('name', 'unitPrice'));

        return $this->show((int) $statement->fetchColumn());
    }

    public function update(int $id): array
    {
        $this->show($id);
        $body = $this->body();
        $name = $this->string($body, 'name', 150);
        $unitPrice = $this->decimal($body, 'unitPrice', 0.01, 9999999999.99);
        $statement = $this->pdo->prepare(
            'UPDATE workwear SET name = :name, unit_price = :unitPrice WHERE id = :id',
        );
        $statement->execute(compact('id', 'name', 'unitPrice'));

        return $this->show($id);
    }

    public function destroy(int $id): void
    {
        $statement = $this->pdo->prepare('DELETE FROM workwear WHERE id = :id');
        $statement->execute(['id' => $id]);

        if ($statement->rowCount() === 0) {
            $this->notFound();
        }
    }
}
