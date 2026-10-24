<?php

declare(strict_types=1);

namespace App\Controllers;

final class WorkshopController extends BaseController
{
    public function index(): array
    {
        return $this->pdo->query('SELECT id, name, created_at AS "createdAt" FROM workshops ORDER BY name')->fetchAll();
    }

    public function show(int $id): array
    {
        $statement = $this->pdo->prepare('SELECT id, name, created_at AS "createdAt" FROM workshops WHERE id = :id');
        $statement->execute(['id' => $id]);

        return $statement->fetch() ?: $this->notFound();
    }

    public function store(): array
    {
        $name = $this->string($this->body(), 'name', 120);
        $statement = $this->pdo->prepare('INSERT INTO workshops (name) VALUES (:name) RETURNING id');
        $statement->execute(['name' => $name]);

        return $this->show((int) $statement->fetchColumn());
    }

    public function update(int $id): array
    {
        $this->show($id);
        $name = $this->string($this->body(), 'name', 120);
        $statement = $this->pdo->prepare('UPDATE workshops SET name = :name WHERE id = :id');
        $statement->execute(['id' => $id, 'name' => $name]);

        return $this->show($id);
    }

    public function destroy(int $id): void
    {
        $statement = $this->pdo->prepare('DELETE FROM workshops WHERE id = :id');
        $statement->execute(['id' => $id]);

        if ($statement->rowCount() === 0) {
            $this->notFound();
        }
    }
}
