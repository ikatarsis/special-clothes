<?php

declare(strict_types=1);

namespace App\Database;

use PDO;

final class Connection
{
    public static function create(): PDO
    {
        $host = getenv('DB_HOST') ?: 'postgres';
        $port = getenv('DB_PORT') ?: '5432';
        $database = getenv('DB_NAME') ?: 'special_clothes';
        $username = getenv('DB_USER') ?: 'app';
        $password = getenv('DB_PASSWORD') ?: '';

        return new PDO(
            "pgsql:host={$host};port={$port};dbname={$database}",
            $username,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ],
        );
    }
}
