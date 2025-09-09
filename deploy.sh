#!/bin/bash
set -e

echo "Añadiendo todos los cambios..."
git add -A

echo "Creando un nuevo commit..."
git commit --allow-empty -m "Deploy $(date)"

echo "Subiendo los cambios a GitHub..."
git push

echo "¡ÉXITO! Los cambios han sido subidos a GitHub."
echo "Vercel debería iniciar un nuevo despliegue ahora."
