<?php

declare(strict_types=1);

use App\Controllers\EmployeeController;
use App\Controllers\IssuanceController;
use App\Controllers\ReportController;
use App\Controllers\WorkshopController;
use App\Controllers\WorkwearController;
use App\Database\Connection;
use App\Http\ApiException;
use PDOException;

require_once __DIR__ . '/../src/http/ApiException.php';
require_once __DIR__ . '/../src/database/Connection.php';
require_once __DIR__ . '/../src/controllers/BaseController.php';
require_once __DIR__ . '/../src/controllers/WorkshopController.php';
require_once __DIR__ . '/../src/controllers/EmployeeController.php';
require_once __DIR__ . '/../src/controllers/WorkwearController.php';
require_once __DIR__ . '/../src/controllers/IssuanceController.php';
require_once __DIR__ . '/../src/controllers/ReportController.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function respond(int $status, mixed $data = null): never
{
    http_response_code($status);

    if ($data !== null) {
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    exit;
}

function idFromPath(array $parts): ?int
{
    if (!isset($parts[2]) || !ctype_digit($parts[2]) || (int) $parts[2] < 1) {
        return null;
    }

    return (int) $parts[2];
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
    $parts = array_values(array_filter(explode('/', trim($path, '/'))));

    if ($method === 'GET' && $path === '/api/health') {
        respond(200, ['status' => 'ok']);
    }

    if (($parts[0] ?? null) !== 'api') {
        throw new ApiException('Маршрут не найден.', 404);
    }

    $pdo = Connection::create();

    if (($parts[1] ?? null) === 'reports' && ($parts[2] ?? null) === 'issuances' && $method === 'GET') {
        respond(200, (new ReportController($pdo))->issuances($_GET));
    }

    $controller = match ($parts[1] ?? null) {
        'workshops' => new WorkshopController($pdo),
        'employees' => new EmployeeController($pdo),
        'workwear' => new WorkwearController($pdo),
        'issuances' => new IssuanceController($pdo),
        default => throw new ApiException('Маршрут не найден.', 404),
    };
    $id = idFromPath($parts);

    if ($method === 'GET' && $id === null && count($parts) === 2) {
        respond(200, $controller->index());
    }

    if ($method === 'GET' && $id !== null && count($parts) === 3) {
        respond(200, $controller->show($id));
    }

    if ($method === 'POST' && $id === null && count($parts) === 2) {
        respond(201, $controller->store());
    }

    if ($method === 'PUT' && $id !== null && count($parts) === 3) {
        respond(200, $controller->update($id));
    }

    if ($method === 'DELETE' && $id !== null && count($parts) === 3) {
        $controller->destroy($id);
        respond(204);
    }

    throw new ApiException('Метод не поддерживается.', 405);
} catch (ApiException $exception) {
    respond($exception->status, ['error' => $exception->getMessage()]);
} catch (PDOException $exception) {
    $sqlState = $exception->getCode();
    $status = in_array($sqlState, ['23503', '23505'], true) ? 409 : 500;
    $message = $status === 409 ? 'Операция нарушает ограничения целостности данных.' : 'Внутренняя ошибка сервера.';
    respond($status, ['error' => $message]);
} catch (Throwable) {
    respond(500, ['error' => 'Внутренняя ошибка сервера.']);
}
