#!/bin/bash
echo "🚀 Quick Vercel deployment..."
Install Vercel CLI if needed
if ! command -v vercel &> /dev/null; then
npm i -g vercel
fi
Deploy directly
echo "📡 Deploying to Vercel..."
vercel --prod
echo ""
echo "✅ Deployment complete!"
echo "🔑 Don't forget to add environment variables in Vercel dashboard"
