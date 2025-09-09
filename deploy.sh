#!/bin/bash

set -e

echo "Inicializando el repositorio Git si es necesario..."
if [ ! -d ".git" ]; then
  git init
  git remote add origin https://github.com/TheMasterPavel/Escaner-de-facturas
  git branch -M main
fi

echo "Añadiendo todos los cambios..."
git add -A

echo "Creando un nuevo commit..."
COMMIT_MESSAGE="Deploy en $(date +'%Y-%m-%d %H:%M:%S')"
git commit --allow-empty -m "$COMMIT_MESSAGE"

echo "Subiendo los cambios a GitHub..."
git push -u origin main --force

echo "¡ÉXITO! Los cambios han sido subidos a GitHub."
echo "Vercel debería iniciar un nuevo despliegue ahora."
