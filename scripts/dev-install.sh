#!/bin/bash
# Build et install local pour dev
# Usage: ./dev-install.sh [target] [--global]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TARGET="."
GLOBAL=false

# Parse args
while [[ $# -gt 0 ]]; do
    case $1 in
        --global|-g)
            GLOBAL=true
            shift
            ;;
        *)
            TARGET="$1"
            shift
            ;;
    esac
done

cd "$PROJECT_ROOT"

echo ""
echo "=== Claude GitFlow Dev Install ==="
echo ""

# Build
echo "[1/2] Building..."
npm run build

# Install
echo ""
echo "[2/2] Installing..."

if [ "$GLOBAL" = true ]; then
    echo "Target: ~/.claude (global)"
    node dist/index.js install --force --skip-license
else
    RESOLVED_TARGET="$(cd "$TARGET" 2>/dev/null && pwd || echo "$TARGET")"
    echo "Target: $RESOLVED_TARGET/.claude (local)"

    pushd "$TARGET" > /dev/null
    node "$PROJECT_ROOT/dist/index.js" install --local --force --skip-license
    popd > /dev/null
fi

echo ""
echo "=== Done! ==="
echo "Test with: /gitflow or /apex in Claude Code"
echo ""
