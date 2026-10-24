FROM php:8.3-cli-alpine

RUN apk add --no-cache postgresql-dev oniguruma-dev \
    && docker-php-ext-install pdo_pgsql mbstring

WORKDIR /var/www

COPY . .

EXPOSE 8080

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public", "public/index.php"]
