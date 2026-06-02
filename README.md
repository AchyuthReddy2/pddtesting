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

Local API runs at `http://localhost:4000` (development only).

### App (uses production API)

The mobile app always calls **`https://villageconnect-782o.onrender.com/api`** (see `src/config/api.js`).

```bash
npm install
npx expo start
```

### Build APK

```bash
npx eas build -p android --profile preview
```

Or local APK: `npx expo run:android` (release build uses the same production API URL).

## Demo logins (after seed)

| Role | Phone | OTP |
|------|-------|-----|
| Resident | `9876543210` | `1234` |
| Sarpanch | `9876599887` | `1234` |

Sarpanch can post announcements and manage village grievances under **Help → Village Complaints**.
