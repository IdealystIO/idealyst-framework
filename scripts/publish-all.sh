#!/bin/bash

# Publish all packages to npm in parallel
# Usage: ./scripts/publish-all.sh [otp-code]
# OTP is optional if using a granular access token without 2FA

OTP_FLAG=""

read -p "Enter OTP code (or press Enter to skip): " OTP

if [ -n "$OTP" ]; then
  OTP_FLAG="--otp=$OTP"
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
  "pdf"
  "camera"
  "charts"
)

ROOT_DIR=$(pwd)
LOG_DIR=$(mktemp -d)
PIDS=()
PKG_NAMES=()

echo "Publishing ${#PACKAGES[@]} packages in parallel..."

for pkg in "${PACKAGES[@]}"; do
  (
    cd "$ROOT_DIR/packages/$pkg" && npm publish $OTP_FLAG > "$LOG_DIR/$pkg.log" 2>&1
    echo $? > "$LOG_DIR/$pkg.exit"
  ) &
  PIDS+=($!)
  PKG_NAMES+=("$pkg")
done

# Wait for all and collect results
FAILED=()
SUCCEEDED=()

for i in "${!PIDS[@]}"; do
  wait "${PIDS[$i]}"
  EXIT_CODE=$(cat "$LOG_DIR/${PKG_NAMES[$i]}.exit" 2>/dev/null || echo "1")
  if [ "$EXIT_CODE" -eq 0 ]; then
    SUCCEEDED+=("${PKG_NAMES[$i]}")
    echo "  ✓ @idealyst/${PKG_NAMES[$i]}"
  else
    FAILED+=("${PKG_NAMES[$i]}")
    echo "  ✗ @idealyst/${PKG_NAMES[$i]}"
    cat "$LOG_DIR/${PKG_NAMES[$i]}.log" 2>/dev/null | tail -5
  fi
done

# Cleanup
rm -rf "$LOG_DIR"

echo ""
echo "Results: ${#SUCCEEDED[@]} succeeded, ${#FAILED[@]} failed out of ${#PACKAGES[@]}"

if [ ${#FAILED[@]} -gt 0 ]; then
  echo ""
  echo "Failed packages:"
  for pkg in "${FAILED[@]}"; do
    echo "  - @idealyst/$pkg"
  done
  exit 1
fi

echo "All packages published successfully!"
