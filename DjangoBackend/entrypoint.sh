#!/bin/sh

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."

    while ! nc -z $DATABSE_HOST $DATABASE_PORT; do
        sleep 0.1
    done

    echo "PostgreSQL started"
fi

echo "Making migrations and migrating the db"
python manage.py makemigrations main --noinput
python manage.py migrate --noinput

# If we want to collect our static files, we can do that below
# python manage.py collectstatic

exec "$@"