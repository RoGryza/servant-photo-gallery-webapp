#!/bin/bash

set -e

MEDIA=$1
DB=$2

mkdir -p "$MEDIA"
[[ -f "$DB" ]] || sqlite3 "$DB" < /app/user/migrations/01_initial.sql

servant-photo-gallery-exe
