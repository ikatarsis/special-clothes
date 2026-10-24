<?php

declare(strict_types=1);

namespace App\Controllers;

final class EmployeeController extends BaseController
{
    public function index(): array
    {
        return $this->list('');
    }

    public function show(int $id): array
    {
        $rows = $this->list('WHERE e.id = :id', ['id' => $id]);

        return $rows[0] ?? $this->notFound();
    }

    public function store(): array
    {
        $body = $this->body();
        $fullName = $this->string($body, 'fullName', 200);
        $position = $this->string($body, 'position', 120);
        $workshopId = $this->positiveInt($body, 'workshopId');
        $this->ensureExists('workshops', $workshopId);

        $statement = $this->pdo->prepare(
            'INSERT INTO employees (full_name, position, workshop_id)
             VALUES (:fullName, :position, :workshopId) RETURNING id',
        );
        $statement->execute(compact('fullName', 'position', 'workshopId'));

        return $this->show((int) $statement->fetchColumn());
    }

    public function update(int $id): array
    {
        $this->show($id);
        $body = $this->body();
        $fullName = $this->string($body, 'fullName', 200);
        $position = $this->string($body, 'position', 120);
        $workshopId = $this->positiveInt($body, 'workshopId');
        $this->ensureExists('workshops', $workshopId);

        $statement = $this->pdo->prepare(
            'UPDATE employees
             SET full_name = :fullName, position = :position, workshop_id = :workshopId
             WHERE id = :id',
        );
        $statement->execute(compact('id', 'fullName', 'position', 'workshopId'));

        return $this->show($id);
    }

    public function destroy(int $id): void
    {
        $statement = $this->pdo->prepare('DELETE FROM employees WHERE id = :id');
        $statement->execute(['id' => $id]);

        if ($statement->rowCount() === 0) {
            $this->notFound();
        }
    }

    private function list(string $where, array $parameters = []): array
    {
        $statement = $this->pdo->prepare(
            'SELECT e.id,
                    e.full_name AS "fullName",
                    e.position,
                    e.workshop_id AS "workshopId",
                    w.name AS "workshopName",
                    e.created_at AS "createdAt"
             FROM employees e
             JOIN workshops w ON w.id = e.workshop_id
             ' . $where . '
             ORDER BY e.full_name',
        );
        $statement->execute($parameters);

        return $statement->fetchAll();
    }
}
