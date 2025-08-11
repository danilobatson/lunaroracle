# 🔮 LunarOracle - The Social Sentiment Prophet

An AI agent for creator.bid that predicts cryptocurrency price movements using social sentiment data from LunarCrush.

## 🎯 Project Overview

LunarOracle leverages social media sentiment, Galaxy Scores, and AI-powered analysis to provide cryptocurrency price predictions with confidence scoring.

### Tech Stack
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: Cloudflare Workers + Hono.js
- **Database**: Cloudflare D1 (lunarcrush-universal-db)
- **AI**: Google Gemini 1.5 Pro
- **Data**: LunarCrush SDK
- **Cache**: Cloudflare KV Store

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Setup environment variables
cp .env.example .env.local

# Start development server
yarn dev
```

## 📊 Development Progress

- [ ] Phase 1: Foundation Setup (Week 1)
- [ ] Phase 2: AI Integration & Logic (Week 2)
- [ ] Phase 3: Creator.bid Integration (Week 3)
- [ ] Phase 4: Testing & Deployment (Week 4)

## 🤖 Agent Capabilities

- **Timeframes**: 24h, 48h, 72h predictions
- **Assets**: Top 50 cryptocurrencies by market cap
- **Confidence Levels**: 0-100 scale with threshold minimums
- **Update Frequency**: Every 4-6 hours for new predictions

Built with ❤️ by [Danilo Batson](https://danilobatson.github.io/)
