<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Http\ApiException;

final class ReportController extends BaseController
{
    public function issuances(array $query): array
    {
        $month = filter_var($query['month'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 12]]);
        $year = filter_var($query['year'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 2000, 'max_range' => 2100]]);

        if ($month === false || $year === false) {
            throw new ApiException('Параметры month и year обязательны и должны быть корректными.', 422);
        }

        $parameters = ['month' => $month, 'year' => $year];
        $workshopFilter = '';

        if (isset($query['workshopId']) && $query['workshopId'] !== '') {
            $workshopId = filter_var($query['workshopId'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

            if ($workshopId === false) {
                throw new ApiException('Параметр workshopId должен быть положительным целым числом.', 422);
            }

            $workshopFilter = ' AND w.id = :workshopId';
            $parameters['workshopId'] = $workshopId;
        }

        $sql =
            'SELECT w.id AS "workshopId",
                    w.name AS "workshopName",
                    e.id AS "employeeId",
                    e.full_name AS "employeeName",
                    ww.id AS "workwearId",
                    ww.name AS "workwearName",
                    i.issued_on AS "issuedOn",
                    i.unit_price AS "unitPrice",
                    i.discount_percent AS "discountPercent",
                    ROUND(i.unit_price * (1 - i.discount_percent / 100), 2) AS "discountedPrice"
             FROM issuances i
             JOIN employees e ON e.id = i.employee_id
             JOIN workshops w ON w.id = e.workshop_id
             JOIN workwear ww ON ww.id = i.workwear_id
             WHERE EXTRACT(MONTH FROM i.issued_on) = :month
               AND EXTRACT(YEAR FROM i.issued_on) = :year' . $workshopFilter . '
             ORDER BY w.name, e.full_name, i.issued_on';
        $statement = $this->pdo->prepare($sql);
        $statement->execute($parameters);
        $rows = $statement->fetchAll();

        $workshopTotals = [];
        $grandTotal = 0.0;

        foreach ($rows as $row) {
            $amount = (float) $row['discountedPrice'];
            $workshopId = (int) $row['workshopId'];

            if (!isset($workshopTotals[$workshopId])) {
                $workshopTotals[$workshopId] = [
                    'workshopId' => $workshopId,
                    'workshopName' => $row['workshopName'],
                    'total' => 0.0,
                ];
            }

            $workshopTotals[$workshopId]['total'] += $amount;
            $grandTotal += $amount;
        }

        return [
            'period' => ['month' => $month, 'year' => $year],
            'rows' => $rows,
            'workshopTotals' => array_values($workshopTotals),
            'grandTotal' => round($grandTotal, 2),
        ];
    }
}
