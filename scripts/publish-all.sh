#!/bin/bash

# Publish all packages to npm
# Usage: ./scripts/publish-all.sh <otp-code>

OTP=$1

if [ -z "$OTP" ]; then
  echo "Usage: ./scripts/publish-all.sh <otp-code>"
  exit 1
fi

PACKAGES=(
  "theme"
  "components"
  "navigation"
  "cli"
  "datagrid"
  "datepicker"
  "storage"
  "mcp-server"
  "oauth-client"
  "translate"
  "tooling"
  "config"
  "markdown"
  "lottie"
  "animate"
  "blur"
  "audio"
  "svg"
  "files"
  "biometrics"
  "payments"
  "notifications"
  "live-activity"
  "network"
)

for pkg in "${PACKAGES[@]}"; do
  echo "Publishing @idealyst/$pkg..."
  cd "packages/$pkg" && npm publish --otp="$OTP" && cd ../..
  if [ $? -ne 0 ]; then
    echo "Failed to publish @idealyst/$pkg"
    exit 1
  fi
done

echo "All packages published successfully!"
