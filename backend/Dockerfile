FROM php:8.2-fpm

# Instalar extensiones necesarias de Laravel
RUN apt-get update && apt-get install -y \
    zip unzip curl git libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www