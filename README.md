# VillageConnect

Rural community app for village residents and panchayat (Sarpanch) — announcements, directory, marketplace, grievances, groups, and more.

## Project Structure

This project has been separated into independent frontend and backend directories:
- **`frontend/`**: The React Native Expo client app.
- **`backend/`**: The Node.js Express server API.

## Stack

- **Frontend:** Expo 51 / React Native (iOS, Android, Web)
- **Backend:** Node.js, Express, MongoDB Atlas
- **Auth:** Phone OTP (demo OTP: `1234`)

## Running the Project

You can manage both folders from the root directory using the following scripts:

### Installation
Install dependencies for both projects:
```bash
npm run install:all
```

### Running Backend API
Start the backend server in development mode:
```bash
npm run start:backend
```
To seed the database:
```bash
npm run seed:backend
```

### Running Frontend App
Start the Expo development server:
```bash
# Start default Expo server
npm run start:frontend

# Or run frontend specifically in Web mode
npm run web --prefix frontend
```

---

## Direct Directory Run

Alternatively, you can run commands directly inside the directories:

### Backend (`/backend`)
```bash
cd backend
npm install
npm run seed
npm run dev
```

### Frontend (`/frontend`)
```bash
cd frontend
npm install
# Start for mobile app / Expo Go
npm run start
# Or start for Web app in browser
npm run web
```

## Demo logins (after seed)

| Role | Phone | OTP |
|------|-------|-----|
| Resident | `9876543210` | `1234` |
| Sarpanch | `9876599887` | `1234` |

Sarpanch can post announcements and manage village grievances under **Help → Village Complaints**.
