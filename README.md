# VillageConnect

Rural community app for village residents and panchayat (Sarpanch) — announcements, directory, marketplace, grievances, groups, and more.

## Stack

- **Frontend:** Expo 51 / React Native (iOS, Android, Web)
- **Backend:** Node.js, Express, MongoDB Atlas
- **Auth:** Phone OTP (demo OTP: `1234`)

## Quick start

### API

```bash
cd server
cp .env.example .env   # add MongoDB URI + JWT_SECRET
npm install
npm run seed
npm run dev
```

API runs at `http://localhost:4000`

### App

```bash
npm install
npx expo start --web
```

Set `EXPO_PUBLIC_API_URL` in `.env` if testing on a physical device.

## Demo logins (after seed)

| Role | Phone | OTP |
|------|-------|-----|
| Resident | `9876543210` | `1234` |
| Sarpanch | `9876599887` | `1234` |

Sarpanch can post announcements and manage village grievances under **Help → Village Complaints**.
