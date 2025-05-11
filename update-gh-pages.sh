#!/bin/bash

# Checkout master branch
git checkout master

# Ensure we have the latest changes
git pull

# Make a temporary directory and copy frontend files
mkdir -p temp_deploy
cp -r frontend/* temp_deploy/

# Switch to gh-pages branch
git checkout gh-pages || git checkout -b gh-pages

# Remove existing files
rm -rf *.html *.js *.css *.json *.md

# Copy new files from temp directory
cp -r temp_deploy/* .

# Remove temp directory
rm -rf temp_deploy

# Add all new files
git add .

# Commit the changes
git commit -m "Update gh-pages with latest frontend files"

# Push to GitHub
git push -f origin gh-pages

# Go back to master branch
git checkout master 