#!/bin/bash

set -e

DOMAIN=${DOMAIN:-localhost}
EMAIL=${LETSENCRYPT_EMAIL:-admin@example.com}

echo "🔒 Inicializando Let's Encrypt para: $DOMAIN"

# Crear directorio www si no existe
mkdir -p www

# Si el dominio es localhost, saltar la obtención de certificados
if [ "$DOMAIN" = "localhost" ]; then
    echo "⚠️  Modo desarrollo detectado. Se usarán certificados autofirmados."
    mkdir -p certbot-etc/live/localhost
    
    # Generar certificado autofirmado si no existe
    if [ ! -f "certbot-etc/live/localhost/fullchain.pem" ]; then
        openssl req -x509 -newkey rsa:4096 -keyout certbot-etc/live/localhost/privkey.pem \
            -out certbot-etc/live/localhost/fullchain.pem -days 365 -nodes \
            -subj "/CN=localhost"
        echo "✅ Certificado autofirmado creado"
    fi
    exit 0
fi

echo "📥 Obteniendo certificado SSL de Let's Encrypt..."

docker-compose run --rm certbot certonly --webroot -w /var/www/certbot \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    --agree-tos \
    --non-interactive \
    --register-unsafely-without-email 2>/dev/null || true

echo "✅ Inicialización completada"
