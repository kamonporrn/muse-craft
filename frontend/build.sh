#!/bin/bash
# Bash build script for frontend
echo "Installing dependencies..."
npm install || exit 1

echo "Building..."
npm run build || exit 1

echo "Build completed successfully!"

