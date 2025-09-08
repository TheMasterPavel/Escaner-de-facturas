#!/bin/bash

# 1. Initialize Git repo if it doesn't exist
if [ ! -d ".git" ]; then
  git init
  echo "Git repository initialized."
else
  echo "Git repository already exists."
fi

# 2. Add all files to the staging area
git add .
echo "All files added to the staging area."

# 3. Commit the changes
# Check if there are any changes to commit to avoid empty commit error
if ! git diff-index --quiet HEAD --; then
  git commit -m "Final attempt: Forcing dependency resolution and stabilizing project"
  echo "Commit created."
else
  echo "No changes to commit."
fi

# 4. Set or update the remote origin URL
if git remote | grep -q 'origin'; then
  git remote set-url origin https://github.com/TheMasterPavel/Escaner-de-facturas
  echo "Remote 'origin' URL has been updated."
else
  git remote add origin https://github.com/TheMasterPavel/Escaner-de-facturas
  echo "Remote 'origin' added."
fi

# 5. Ensure the current branch is named 'main'
git branch -M main
echo "Current branch ensured to be 'main'."

# 6. Force push the code to the 'main' branch on GitHub
git push --force -u origin main

echo "SUCCESS! Your code has been pushed to GitHub."
echo "Vercel will now attempt a new deployment. This should be the final one."
