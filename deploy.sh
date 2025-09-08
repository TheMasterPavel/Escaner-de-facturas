#!/bin/bash
# Este script inicializa un repositorio de Git, lo conecta a un remoto en GitHub y sube el código.

# 1. Inicializa el repositorio de Git localmente (si no está ya inicializado)
if [ ! -d ".git" ]; then
  git init
  echo "Repositorio de Git inicializado."
else
  echo "El repositorio de Git ya existe."
fi

# 2. Añade todos los archivos al área de preparación
git add .
echo "Todos los archivos han sido añadidos al área de preparación."

# 3. Realiza el commit inicial
# Comprueba si ya hay commits para no fallar si se ejecuta de nuevo
if git rev-parse --verify HEAD >/dev/null 2>&1; then
  git commit -m "Actualización del proyecto"
else
  git commit -m "Commit inicial del proyecto FacturaVision"
fi
echo "Commit creado."

# 4. Añade el repositorio remoto de GitHub
# Comprueba si el remoto 'origin' ya existe
if git remote | grep -q 'origin'; then
  git remote set-url origin https://github.com/TheMasterPavel/Escaner-de-facturas
  echo "La URL del remoto 'origin' ha sido actualizada."
else
  git remote add origin https://github.com/TheMasterPavel/Escaner-de-facturas
  echo "Repositorio remoto 'origin' añadido."
fi

# 5. Renombra la rama actual a 'main'
git branch -M main
echo "Rama actual renombrada a 'main'."

# 6. Sube el código a la rama 'main' de GitHub (forzando la subida)
git push --force -u origin main

echo "¡Éxito! Tu código ha sido subido a GitHub."
echo "Ahora puedes reintentar el despliegue en Vercel."
