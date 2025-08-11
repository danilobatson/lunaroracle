# Manual Vercel Deployment Guide

## Step 1: Install Vercel CLI
```bash
npm i -g vercel
Step 2: Login to Vercel
bashvercel login
Step 3: Deploy from project directory
bashvercel --prod
Step 4: Add Environment Variables
When prompted or in Vercel dashboard, add:
Required (for basic functionality):

LUNARCRUSH_API_KEY = vcbhz3zf90hd7rtk97d3k436x8me7eb0tb77fjk2d
GEMINI_API_KEY = AIzaSyCBKmjYBpNOm-ZA4UKrqjlyoWXkWZRdKNc

Optional (for Cloudflare D1 database):

CLOUDFLARE_ACCOUNT_ID = your Cloudflare account ID
CLOUDFLARE_D1_DATABASE_ID = your D1 database ID
CLOUDFLARE_API_TOKEN = API token with D1 permissions

Step 5: Test Endpoints
After deployment, test:

https://your-app.vercel.app/api/health
https://your-app.vercel.app/api/topic/bitcoin
https://your-app.vercel.app/api/predict (POST)
https://your-app.vercel.app/api/agent/chat (POST)

The app will work with just the required keys and use in-memory storage as fallback.
