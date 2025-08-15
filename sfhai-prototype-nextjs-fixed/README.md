# SFH AI Prototype (Next.js + Tailwind)

A ready-to-deploy web prototype for your South Florida home-hunting app.

## Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel
- Create an account at https://vercel.com
- In this folder:
```bash
npm run build
npx vercel --prod
```
or import the repo in Vercel's dashboard.

## Notes
- Tailwind is preconfigured.
- Uses mock listings + simple budgeting calculator with Buyer/Renter switch.
```
---

## Notes for Vercel builds
- Tailwind config is now **tailwind.config.js** (no TypeScript needed).
- A `next-env.d.ts` file is included to satisfy Next.js TypeScript bootstrap on CI.
