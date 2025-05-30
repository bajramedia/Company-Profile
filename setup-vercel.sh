#!/bin/bash
# Setup script for Vercel deployment

echo "🚀 Bajramedia Vercel Deployment Setup"
echo "===================================="

# Check if git remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No GitHub remote found!"
    echo "Please add your GitHub repository:"
    echo "git remote add origin https://github.com/USERNAME/REPOSITORY_NAME.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    exit 1
fi

echo "✅ Git remote found"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Go to https://vercel.com"
    echo "3. Import your GitHub repository"
    echo "4. Add DATABASE_URL environment variable"
    echo "5. Deploy!"
    echo ""
    echo "📚 See VERCEL-DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi
