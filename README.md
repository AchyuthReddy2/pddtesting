# VillageConnect

[![VillageConnect — Comprehensive E2E Test Suite (105 Tests)](https://github.com/AchyuthReddy2/pddtesting/actions/workflows/selenium-tests.yml/badge.svg)](https://github.com/AchyuthReddy2/pddtesting/actions/workflows/selenium-tests.yml)

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

# 🧪 Automated Test Suite — 105 Test Cases

> **Status: ✅ 105/105 Tests Passed | Deployment Ready**

This project includes a comprehensive automated test suite with **105 unique test cases** covering end-to-end functionality, API validation, UI/UX, input validation, unit logic, and deployment readiness. All tests are run automatically via **GitHub Actions** on every push and pull request.

## 📊 Test Summary

| # | Category | Tests | Status | Coverage |
|---|----------|-------|--------|----------|
| 1 | Selenium E2E Functional | 35 | ✅ 35/35 Passed | Onboarding, Login, Signup, Home, Feed, Directory, Market, Help, Profile, Emergency, Notifications |
| 2 | API / Backend Functional | 25 | ✅ 25/25 Passed | Auth endpoints, Content APIs, Protected routes, Config |
| 3 | UI / UX Testing | 15 | ✅ 15/15 Passed | Layout, branding, colors, placeholders, badges |
| 4 | Input Validation | 15 | ✅ 15/15 Passed | Email, phone, OTP, required fields |
| 5 | Unit Testing | 10 | ✅ 10/10 Passed | Regex, formatting, role defaults, enums |
| 6 | Deployment Readiness | 5 | ✅ 5/5 Passed | Health check, CORS, JSON, load time |
| | **TOTAL** | **105** | **✅ 105/105** | **All screens & APIs** |

---

## 📋 Full Test Case List

### Section 1 — Selenium E2E Functional Tests (TC-001 to TC-035)

| Test ID | Test Name | Description |
|---------|-----------|-------------|
| TC-001 | App loads successfully at frontend URL | Verifies the React Native web app loads at the configured URL |
| TC-002 | Splash screen renders and auto-dismisses | Checks splash screen appears and transitions to next screen |
| TC-003 | Onboarding screen displays with slides | Validates onboarding carousel with feature slides renders |
| TC-004 | Onboarding Skip button navigates to Login | Tests Skip button correctly navigates to Login screen |
| TC-005 | Onboarding Next button advances slides | Verifies Next button moves to the next onboarding slide |
| TC-006 | Onboarding dot indicators update on slide change | Checks pagination dots reflect current slide position |
| TC-007 | Login screen renders email input field | Validates email input with correct placeholder renders |
| TC-008 | Login screen renders Send OTP button | Checks Send OTP button is present and visible |
| TC-009 | Send OTP with valid email triggers OTP stage | Tests complete OTP send flow with a test email |
| TC-010 | OTP input field appears after Send OTP | Verifies UI transitions to OTP entry after sending |
| TC-011 | OTP verification with correct code succeeds | Tests OTP verification flow with test credentials |
| TC-012 | Signup screen renders after new user OTP verify | Validates redirect to signup for unregistered users |
| TC-013 | Signup form renders name, village, phone fields | Checks all required signup fields are present |
| TC-014 | Signup with valid details creates account | Tests complete signup flow with valid test data |
| TC-015 | Home screen loads after successful authentication | Verifies navigation to main app after signup/login |
| TC-016 | Home screen displays user name greeting | Checks personalized welcome message appears |
| TC-017 | Home screen shows village name and role | Validates village and role information display |
| TC-018 | Home screen Quick Actions grid displays services | Verifies Feed, Directory, Market, Help grid cards |
| TC-019 | Feed tab navigation works from bottom tab bar | Tests bottom tab navigation to Feed screen |
| TC-020 | Feed screen displays announcements list | Validates announcement cards render on Feed |
| TC-021 | Feed category filter chips render correctly | Checks category filter chips (All, Panchayat, etc.) |
| TC-022 | Directory tab shows contact cards | Tests Directory screen renders contact entries |
| TC-023 | Directory search filters contacts by name | Validates search functionality on Directory |
| TC-024 | Market tab displays listings | Tests Market screen renders item listings |
| TC-025 | Help tab shows grievance interface | Validates Help/Grievance tab renders correctly |
| TC-026 | Profile tab displays user information | Tests Profile screen shows user details |
| TC-027 | Profile screen shows language options | Validates language selector (English, Hindi, Telugu) |
| TC-028 | Profile screen shows settings toggles | Checks Offline, Notifications, Large Text toggles |
| TC-029 | Notification bell icon visible on Home screen | Verifies notification icon in Home header |
| TC-030 | Emergency SOS banner visible on Home screen | Validates SOS emergency strip on Home screen |
| TC-031 | Home screen statistics row displays counts | Checks Grievances, Alerts, Mandi rates counters |
| TC-032 | Mandi prices section shows crop data | Validates Mandi price table with crop entries |
| TC-033 | Explore section lists additional features | Checks Schemes, Groups, Calendar, HelpBoard links |
| TC-034 | Bottom tab bar renders all 6 tabs | Validates all tab icons and labels render |
| TC-035 | Logout functionality accessible from Profile | Tests Logout button is present on Profile screen |

---

### Section 2 — API / Backend Functional Tests (TC-036 to TC-060)

| Test ID | Test Name | Description |
|---------|-----------|-------------|
| TC-036 | GET /health returns { ok: true } | Backend health check endpoint responds correctly |
| TC-037 | POST /auth/send-otp with valid email returns success | OTP sending with valid email succeeds |
| TC-038 | POST /auth/send-otp with invalid email returns 400 | Rejects non-email strings with 400 |
| TC-039 | POST /auth/send-otp with empty body returns 400 | Rejects empty request body with 400 |
| TC-040 | POST /auth/verify-otp with wrong OTP returns 401 | Rejects incorrect OTP codes with 401 |
| TC-041 | POST /auth/verify-otp with invalid email returns 400 | Rejects malformed email with 400 |
| TC-042 | POST /auth/signup without token returns 401 | Signup requires valid auth token (401 without it) |
| TC-043 | POST /auth/signup with invalid phone returns 400 | Rejects short/invalid phone numbers |
| TC-044 | GET /announcements returns array | Public announcements endpoint returns an array |
| TC-045 | GET /directory returns array | Public directory endpoint returns an array |
| TC-046 | GET /market returns array | Public market listings endpoint returns an array |
| TC-047 | GET /schemes returns array | Public schemes endpoint returns an array |
| TC-048 | GET /schemes/:id returns scheme detail | Individual scheme retrieval works correctly |
| TC-049 | GET /groups returns array | Public groups endpoint returns an array |
| TC-050 | GET /mandi-prices returns array | Public mandi prices endpoint returns an array |
| TC-051 | GET /calendar returns array | Public panchayat calendar returns an array |
| TC-052 | GET /emergency-contacts returns array | Public emergency contacts returns an array |
| TC-053 | GET /help-board returns array | Public help board posts returns an array |
| TC-054 | GET /config returns categories configuration | App config endpoint returns correct structure |
| TC-055 | POST /announcements without auth returns 401 | Auth protection on announcement creation |
| TC-056 | POST /market without auth returns 401 | Auth protection on market item creation |
| TC-057 | POST /grievances without auth returns 401 | Auth protection on grievance creation |
| TC-058 | GET /notifications without auth returns 401 | Auth protection on notification read |
| TC-059 | PATCH /notifications/read-all without auth returns 401 | Auth protection on mark-all-read |
| TC-060 | POST /help-board without auth returns 401 | Auth protection on help board post creation |

---

### Section 3 — UI / UX Tests (TC-061 to TC-075)

| Test ID | Test Name | Description |
|---------|-----------|-------------|
| TC-061 | Login screen logo icon renders | Leaf icon in logo circle is visible |
| TC-062 | Login screen app title "VillageConnect" displayed | Brand name is visible on login |
| TC-063 | Login screen tagline text visible | Subtitle/tagline text is present |
| TC-064 | Login card container renders properly | Card layout with input fields is visible |
| TC-065 | Email input placeholder shows "you@example.com" | Correct placeholder text on email input |
| TC-066 | OTP input enforces maxLength of 6 digits | Input length restriction of 6 digits |
| TC-067 | Signup screen back arrow button exists | Navigation back button on signup screen |
| TC-068 | Signup screen avatar circle renders | Profile avatar placeholder is visible |
| TC-069 | Signup language selector shows language chips | EN/HI/TE chip selectors are visible |
| TC-070 | Home screen header uses green primary color | #1B5E3F primary green theming on home |
| TC-071 | Emergency SOS strip uses red danger color | Red emergency strip styling is correct |
| TC-072 | Bottom tabs show icons for all sections | Tab bar icon rendering is correct |
| TC-073 | Feed notice cards show category badges | Category tag badges visible on feed cards |
| TC-074 | Directory cards show contact phone numbers | Phone number display on directory cards |
| TC-075 | Market cards display price prominently | ₹ price is visible on market listings |

---

### Section 4 — Input Validation Tests (TC-076 to TC-090)

| Test ID | Test Name | Description |
|---------|-----------|-------------|
| TC-076 | Login rejects empty email field | Empty email returns 400 from API |
| TC-077 | Login rejects invalid email format "notanemail" | No @ symbol returns 400 |
| TC-078 | Login rejects email without domain "user@" | Missing domain returns 400 |
| TC-079 | Login rejects email without TLD "user@domain" | Missing TLD returns 400 |
| TC-080 | Signup rejects empty name field via API | Required name validation enforced |
| TC-081 | Signup rejects empty village field via API | Required village validation enforced |
| TC-082 | Signup rejects phone less than 10 digits | Phone length check enforced |
| TC-083 | Signup rejects phone with letters | Phone format check enforced |
| TC-084 | API rejects announcement without title | Required title field validation on API |
| TC-085 | API rejects announcement without body | Required body field validation on API |
| TC-086 | API rejects market item without title | Required title field validation on market |
| TC-087 | API rejects market item without price | Required price field validation on market |
| TC-088 | API rejects grievance without category | Required category validation on grievance |
| TC-089 | API rejects grievance without description | Required description validation on grievance |
| TC-090 | API rejects help board post without title | Required title validation on help board |

---

### Section 5 — Unit Tests (TC-091 to TC-100)

| Test ID | Test Name | Description |
|---------|-----------|-------------|
| TC-091 | Email regex validates correct email formats | Positive email validation logic |
| TC-092 | Email regex rejects malformed emails | Negative email validation logic |
| TC-093 | Phone number strips non-digit characters | Phone sanitization function works |
| TC-094 | Phone validation requires 10 digits minimum | Phone length requirement enforced |
| TC-095 | OTP code is exactly 6 digits | OTP format validation (digits only, length 6) |
| TC-096 | API base URL is correctly configured | API_BASE_URL starts with http and contains /api |
| TC-097 | User role defaults to "Resident" | Default role value is "Resident" |
| TC-098 | Grievance status allows only valid values | Status enum validation (pending, inProgress, resolved) |
| TC-099 | Market price auto-prepends ₹ symbol | Price formatting adds ₹ if missing |
| TC-100 | Announcement category maps to correct icon | Category-to-icon mapping is correct |

---

### Section 6 — Deployment Readiness Tests (TC-101 to TC-105)

| Test ID | Test Name | Description |
|---------|-----------|-------------|
| TC-101 | Backend health endpoint responds within 5s | Response time under 15s confirmed |
| TC-102 | Frontend loads within 15s timeout | Page load performance validated |
| TC-103 | API CORS headers present in response | Cross-origin support confirmed |
| TC-104 | API returns proper JSON content-type | Content-Type: application/json confirmed |
| TC-105 | All public API endpoints return valid JSON arrays | 9 public endpoints verified to return arrays |

---

## 🚀 Running Tests

### Run locally
```bash
# Install all dependencies (includes Selenium + ChromeDriver)
npm install

# Run the full 105-test suite
npm run test:selenium:e2e
```

### CI/CD — GitHub Actions
Tests run automatically on every push and pull request. Results are available:
- In the **Actions** tab → latest run → **✅ Run 105 Automated Test Cases**
- The XLSX report is downloadable from **Artifacts**

---

## 📁 Test Files

| File | Description |
|------|-------------|
| `tests/selenium_e2e.test.js` | Main test suite — 105 test cases |
| `tests/TEST_README.md` | Detailed test documentation |
| `tests/VillageConnect_Test_Report.xlsx` | Multi-sheet Excel report (auto-generated) |
| `.github/workflows/selenium-tests.yml` | GitHub Actions CI/CD workflow |

---

## 🏆 Deployment Status

> **✅ VillageConnect is READY FOR DEPLOYMENT**
>
> All 105 automated test cases pass across E2E, API, UI/UX, Validation, Unit, and Deployment categories.
