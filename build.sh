#!/bin/bash

# Terapia Website - Production Build Script
# This script optimizes the website for production deployment

echo "🚀 Starting Terapia Website Production Build..."

# Create build directory
mkdir -p build
echo "📁 Created build directory"

# Copy HTML files
cp *.html build/
echo "📄 Copied HTML files"

# Copy and optimize CSS
mkdir -p build/css
cp css/*.css build/css/
echo "🎨 Copied CSS files"

# Copy and optimize JavaScript
mkdir -p build/js
cp js/*.js build/js/
echo "⚡ Copied JavaScript files"

# Copy images (in production, these should be optimized)
cp -r img build/
echo "🖼️  Copied images"

# Copy libraries
cp -r lib build/
echo "📚 Copied libraries"

# Create optimized versions (requires additional tools)
echo "🔧 Creating optimized versions..."

# Minify CSS (requires cssnano or similar)
if command -v cssnano &> /dev/null; then
    cssnano build/css/style.css build/css/style.min.css
    echo "✅ CSS minified"
else
    echo "⚠️  CSS minification skipped (cssnano not found)"
fi

# Minify JavaScript (requires uglify-js or similar)
if command -v uglifyjs &> /dev/null; then
    uglifyjs build/js/main.js -o build/js/main.min.js -c -m
    echo "✅ JavaScript minified"
else
    echo "⚠️  JavaScript minification skipped (uglifyjs not found)"
fi

# Optimize images (requires imagemin or similar)
if command -v imagemin &> /dev/null; then
    imagemin build/img/* --out-dir=build/img/optimized
    echo "✅ Images optimized"
else
    echo "⚠️  Image optimization skipped (imagemin not found)"
fi

# Create gzipped versions
echo "📦 Creating gzipped versions..."
find build -name "*.css" -exec gzip -k {} \;
find build -name "*.js" -exec gzip -k {} \;
find build -name "*.html" -exec gzip -k {} \;
echo "✅ Gzipped files created"

# Generate file checksums for cache busting
echo "🔐 Generating file checksums..."
find build -type f \( -name "*.css" -o -name "*.js" \) -exec md5sum {} \; > build/checksums.txt
echo "✅ Checksums generated"

# Create sitemap.xml
echo "🗺️  Creating sitemap..."
cat > build/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://terapia-therapy.com/</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://terapia-therapy.com/about.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://terapia-therapy.com/contact.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://terapia-therapy.com/appointment.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://terapia-therapy.com/blog.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>
EOF
echo "✅ Sitemap created"

# Create robots.txt
echo "🤖 Creating robots.txt..."
cat > build/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://terapia-therapy.com/sitemap.xml
EOF
echo "✅ Robots.txt created"

# Create .htaccess for Apache servers
echo "⚙️  Creating .htaccess..."
cat > build/.htaccess << 'EOF'
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
EOF
echo "✅ .htaccess created"

# Generate build report
echo "📊 Generating build report..."
cat > build/BUILD-REPORT.md << EOF
# Build Report

**Build Date**: $(date)
**Build Version**: 2.0.0

## Files Generated
- HTML files: $(find build -name "*.html" | wc -l)
- CSS files: $(find build -name "*.css" | wc -l)
- JS files: $(find build -name "*.js" | wc -l)
- Image files: $(find build -name "*.jpg" -o -name "*.png" -o -name "*.gif" | wc -l)

## Optimizations Applied
- ✅ File compression (gzip)
- ✅ Cache headers configured
- ✅ Security headers added
- ✅ Sitemap generated
- ✅ Robots.txt created

## Total Build Size
$(du -sh build | cut -f1)

## Next Steps
1. Upload build/ directory to production server
2. Configure DNS settings
3. Install SSL certificate
4. Test all functionality
5. Submit sitemap to search engines
EOF

echo "✅ Build report generated"

# Final summary
echo ""
echo "🎉 Production build completed successfully!"
echo "📁 Build files are in the 'build' directory"
echo "📊 Total build size: $(du -sh build | cut -f1)"
echo ""
echo "Next steps:"
echo "1. Review build/BUILD-REPORT.md"
echo "2. Test the build locally"
echo "3. Upload to production server"
echo "4. Follow DEPLOYMENT-CHECKLIST.md"
echo ""
echo "🚀 Ready for production deployment!"