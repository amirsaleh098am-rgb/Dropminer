## Packages
framer-motion | Smooth page transitions and micro-interactions
recharts | Visualizing mining statistics and referral data
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes

## Notes
API Endpoints:
- Mining: GET /api/mining/status, POST /api/mining/collect
- Withdraw: GET /api/withdraw/coins, POST /api/withdraw, GET /api/withdraw/history
- Referral: GET /api/referral (implied by requirements)
- Auth: Expects 401 handling, credentials: "include" for cookies

Design:
- Dark mode default
- Crypto/Cyberpunk aesthetic (Neon accents, dark backgrounds)
- Mobile-first layout (Bottom navigation)
