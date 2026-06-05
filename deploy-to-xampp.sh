#!/bin/bash
# deploy-to-xampp.sh
# Builds the React app and deploys it + PHP API to XAMPP htdocs/streamflix/

set -e

HTDOCS="/Applications/XAMPP/xamppfiles/htdocs"
DEST="$HTDOCS/streamflix"
PHP_API_SRC="./php-api"

echo "🎬 StreamFlix — XAMPP Deploy Script"
echo "====================================="

# 1. Build React app
echo "📦 Building React app for production..."
npm run build

# 2. Create destination directory
echo "📁 Creating $DEST ..."
mkdir -p "$DEST"

# 3. Copy React build output (dist/)
echo "📋 Copying React build → $DEST ..."
cp -r dist/* "$DEST/"

# 4. Copy movie poster images to htdocs/streamflix/images/
echo "🖼️  Copying images → $DEST/images/ ..."
mkdir -p "$DEST/images"
cp -r public/images/* "$DEST/images/" 2>/dev/null || true

# 5. Copy PHP API
echo "🐘 Copying PHP API → $DEST/php-api/ ..."
mkdir -p "$DEST/php-api"
cp -r "$PHP_API_SRC/"* "$DEST/php-api/"

# 6. Create storage directory for JSON data files (watchlist, users)
echo "💾 Creating storage directory ..."
mkdir -p "$DEST/storage"
chmod 755 "$DEST/storage"
# Initialize empty watchlist if not present
[ ! -f "$DEST/storage/watchlist.json" ] && echo "[]" > "$DEST/storage/watchlist.json"
[ ! -f "$DEST/storage/users.json" ]    && echo "[]" > "$DEST/storage/users.json"

# 7. Create the root .htaccess for XAMPP
echo "⚙️  Writing .htaccess ..."
cat > "$DEST/.htaccess" << 'HTACCESS'
Options -Indexes
RewriteEngine On

# 1. Let existing files and directories through untouched
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 2. Route /api/* requests to the PHP router
RewriteRule ^api/(.*)$ php-api/index.php [L,QSA]

# 3. React SPA fallback — everything else loads index.html
RewriteRule ^ index.html [L]

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>

# Cache static assets aggressively
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/png  "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css   "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
HTACCESS

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Open in browser: http://localhost/streamflix/"
echo "🔌 PHP API health: http://localhost/streamflix/api/health"
echo "🎬 Movies API:     http://localhost/streamflix/api/movies"
echo "🔍 Search API:     http://localhost/streamflix/api/search?q=dark"
echo ""
echo "⚠️  Make sure Apache is running in XAMPP!"
