# Minimal zshrc for FamiPrint project
# This file helps avoid shell session errors

# Basic shell setup
export PATH="$HOME/.npm-global/bin:/usr/local/bin:/usr/bin:/bin"
export NODE_ENV=development

# Project directory
cd "$(dirname "$0")" 2>/dev/null || true

# Aliases for quick server management
alias start-dev="npm run dev:3003"
alias start-server="npm run start-server"

echo "🚀 FamiPrint shell environment loaded"
echo "📁 Current directory: $(pwd)"
echo "💡 Use 'start-dev' or 'start-server' to launch the development server"