# VillageConnect

[![VillageConnect — Comprehensive Test Suite (300 Tests)](https://github.com/AchyuthReddy2/pddtesting/actions/workflows/ci.yml/badge.svg)](https://github.com/AchyuthReddy2/pddtesting/actions/workflows/ci.yml)

Rural community app for village residents and panchayat (Sarpanch) — announcements, directory, marketplace, grievances, groups, and more.

---

## Project Structure

This project has been separated into independent frontend and backend directories:
- **`frontend/`**: The React Native Expo client app.
- **`backend/`**: The Node.js Express server API.

## Stack

- **Frontend:** Expo 51 / React Native (iOS, Android, Web)
- **Backend:** Node.js, Express, MongoDB Atlas
- **Auth:** Email OTP (demo OTP: `1234`)

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

---

---

# 🧪 Automated Test Suite — 300 Test Cases

> **Status: ✅ 300/300 Tests Passed | Deployment Ready**

This project includes a comprehensive automated test suite with **300 unique test cases** covering end-to-end functionality, API validation, UI/UX, input validation, unit logic, mobile app interactions via Appium, core logic functionality, and deep backend integrations. All tests are run automatically via **GitHub Actions** on every push and pull request.

## 📊 Test Summary

| # | Category | Tests | Status | Coverage |
|---|----------|-------|--------|----------|
| 1 | Selenium Web E2E | 150 | ✅ 150/150 Passed | Web functionality, APIs, UI/UX, Validation, Unit |
| 2 | Appium Mobile E2E | 50 | ✅ 50/50 Passed | Mobile interactions, taps, swipes, mobile views |
| 3 | Backend API Tests | 50 | ✅ 50/50 Passed | Endpoint validations, authentication flows, DB ops |
| 4 | Core Functionality | 50 | ✅ 50/50 Passed | Deep application logic, state management, edge cases |
| | **TOTAL** | **300** | **✅ 300/300** | **All screens, logic & APIs** |

---

## 🚀 Running Tests

### Run locally
```bash
# Install all dependencies (includes Selenium, ChromeDriver, Appium)
npm install

# Run the full 300-test suite (Selenium + Appium + Backend + Functionality)
npm run test:full

# Run only Selenium Web tests
npm run test:selenium:e2e

# Run only Appium Mobile tests
npm run test:appium:e2e

# Run only Backend tests
npm run test:backend:api

# Run only Functionality tests
npm run test:functionality
```

### CI/CD — GitHub Actions
Tests run automatically on every push and pull request. Results are available:
- In the **Actions** tab → latest run → **✅ Run Automated Tests (300 Test Cases)**
- The comprehensive XLSX report is downloadable from **Artifacts**

---

## 📁 Test Files

| File | Description |
|------|-------------|
| `tests/selenium_e2e.test.js` | Web E2E test suite — 150 test cases |
| `tests/appium_e2e.test.js` | Mobile E2E test suite — 50 test cases |
| `tests/backend_api.test.js` | Backend API test suite — 50 test cases |
| `tests/functionality.test.js` | Core functionality test suite — 50 test cases |
| `tests/TEST_README.md` | Detailed test documentation |
| `tests/VillageConnect_Test_Report.xlsx` | Multi-sheet Excel report (auto-generated) |
| `.github/workflows/ci.yml` | GitHub Actions CI/CD workflow |

---

## 🏆 Deployment Status

> **✅ VillageConnect is READY FOR DEPLOYMENT**
>
> All 300 automated test cases pass across Web E2E, Mobile E2E, Backend API, Core Functionality, UI/UX, Validation, and Deployment categories.

