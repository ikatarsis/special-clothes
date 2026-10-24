<?php

declare(strict_types=1);

namespace App\Controllers;

final class IssuanceController extends BaseController
{
    public function index(): array
    {
        return $this->list('');
    }

    public function show(int $id): array
    {
        $rows = $this->list('WHERE i.id = :id', ['id' => $id]);

        return $rows[0] ?? $this->notFound();
    }

    public function store(): array
    {
        $data = $this->validatedData($this->body());
        $unitPrice = $this->currentWorkwearPrice($data['workwearId']);
        $statement = $this->pdo->prepare(
            'INSERT INTO issuances (employee_id, workwear_id, issued_on, unit_price, discount_percent)
             VALUES (:employeeId, :workwearId, :issuedOn, :unitPrice, :discountPercent)
             RETURNING id',
        );
        $statement->execute($data + ['unitPrice' => $unitPrice]);

        return $this->show((int) $statement->fetchColumn());
    }

    public function update(int $id): array
    {
        $current = $this->show($id);
        $data = $this->validatedData($this->body());
        $unitPrice = $data['workwearId'] === (int) $current['workwearId']
            ? $current['unitPrice']
            : $this->currentWorkwearPrice($data['workwearId']);
        $statement = $this->pdo->prepare(
            'UPDATE issuances
             SET employee_id = :employeeId,
                 workwear_id = :workwearId,
                 issued_on = :issuedOn,
                 unit_price = :unitPrice,
                 discount_percent = :discountPercent
             WHERE id = :id',
        );
        $statement->execute($data + ['id' => $id, 'unitPrice' => $unitPrice]);

        return $this->show($id);
    }

    public function destroy(int $id): void
    {
        $statement = $this->pdo->prepare('DELETE FROM issuances WHERE id = :id');
        $statement->execute(['id' => $id]);

        if ($statement->rowCount() === 0) {
            $this->notFound();
        }
    }

    private function validatedData(array $body): array
    {
        $employeeId = $this->positiveInt($body, 'employeeId');
        $workwearId = $this->positiveInt($body, 'workwearId');
        $issuedOn = $this->date($body, 'issuedOn');
        $discountPercent = $this->decimal($body, 'discountPercent', 0, 100);
        $this->ensureExists('employees', $employeeId);
        $this->ensureExists('workwear', $workwearId);

        return compact('employeeId', 'workwearId', 'issuedOn', 'discountPercent');
    }

    private function currentWorkwearPrice(int $workwearId): float
    {
        $statement = $this->pdo->prepare('SELECT unit_price FROM workwear WHERE id = :id');
        $statement->execute(['id' => $workwearId]);

        return (float) $statement->fetchColumn();
    }

    private function list(string $where, array $parameters = []): array
    {
        $statement = $this->pdo->prepare(
            'SELECT i.id,
                    i.employee_id AS "employeeId",
                    e.full_name AS "employeeName",
                    w.id AS "workshopId",
                    w.name AS "workshopName",
                    i.workwear_id AS "workwearId",
                    ww.name AS "workwearName",
                    i.issued_on AS "issuedOn",
                    i.unit_price AS "unitPrice",
                    i.discount_percent AS "discountPercent",
                    ROUND(i.unit_price * (1 - i.discount_percent / 100), 2) AS "discountedPrice",
                    i.created_at AS "createdAt"
             FROM issuances i
             JOIN employees e ON e.id = i.employee_id
             JOIN workshops w ON w.id = e.workshop_id
             JOIN workwear ww ON ww.id = i.workwear_id
             ' . $where . '
             ORDER BY i.issued_on DESC, i.id DESC',
        );
        $statement->execute($parameters);

        return $statement->fetchAll();
    }
}
