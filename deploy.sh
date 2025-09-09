#!/bin/bash
set -e
git add -A
git commit -m "Deploy $(date)" --allow-empty
git push
echo "¡ÉXITO! Los cambios han sido subidos a GitHub. Vercel debería iniciar un nuevo despliegue ahora."
