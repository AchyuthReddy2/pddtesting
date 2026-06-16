# VillageConnect — Comprehensive Test Suite Documentation

## Overview

This document describes the **105 automated test cases** for the VillageConnect application, covering end-to-end Selenium testing, API validation, UI/UX verification, input validation, unit testing, and deployment readiness checks.

## Test Architecture

```
tests/
├── selenium_e2e.test.js          # Main test suite (105 test cases)
├── VillageConnect_Test_Report.xlsx # Auto-generated Excel report
└── TEST_README.md                 # This file
```

## How to Run

### Prerequisites
- **Node.js** 18+ (with native fetch support)
- **Google Chrome** (latest stable)
- **ChromeDriver** (matching Chrome version)

### Run Locally
```bash
# Install dependencies
npm install

# Run the full test suite
node tests/selenium_e2e.test.js
```

### Run via npm script
```bash
npm run test:selenium:e2e
```

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `FRONTEND_URL` | `http://localhost:8081` | Expo web app URL |
| `API_BASE_URL` | `https://villageconnect-782o.onrender.com/api` | Backend API base URL |

---

## Test Categories

### 1. Selenium E2E Functional Tests (35 Tests)
Full browser-based end-to-end user flow testing using Selenium WebDriver with headless Chrome.

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

### 2. API/Backend Functional Tests (25 Tests)
REST API endpoint validation testing against the deployed backend.

| Test ID | Test Name | Description |
|---------|-----------|-------------|
| TC-036 | GET /health returns { ok: true } | Backend health check endpoint |
| TC-037 | POST /auth/send-otp with valid email returns success | OTP sending with valid email |
| TC-038 | POST /auth/send-otp with invalid email returns 400 | Rejects non-email strings |
| TC-039 | POST /auth/send-otp with empty body returns 400 | Rejects empty request body |
| TC-040 | POST /auth/verify-otp with wrong OTP returns 401 | Rejects incorrect OTP codes |
| TC-041 | POST /auth/verify-otp with invalid email returns 400 | Rejects malformed email |
| TC-042 | POST /auth/signup without token returns 401 | Signup requires auth token |
| TC-043 | POST /auth/signup with invalid phone returns 400 | Rejects short phone numbers |
| TC-044 | GET /announcements returns array | Public announcements endpoint |
| TC-045 | GET /directory returns array | Public directory endpoint |
| TC-046 | GET /market returns array | Public market listings endpoint |
| TC-047 | GET /schemes returns array | Public schemes endpoint |
| TC-048 | GET /schemes/:id returns scheme detail | Individual scheme retrieval |
| TC-049 | GET /groups returns array | Public groups endpoint |
| TC-050 | GET /mandi-prices returns array | Public mandi prices endpoint |
| TC-051 | GET /calendar returns array | Public panchayat calendar |
| TC-052 | GET /emergency-contacts returns array | Public emergency contacts |
| TC-053 | GET /help-board returns array | Public help board posts |
| TC-054 | GET /config returns categories configuration | App configuration endpoint |
| TC-055 | POST /announcements without auth returns 401 | Auth protection on create |
| TC-056 | POST /market without auth returns 401 | Auth protection on create |
| TC-057 | POST /grievances without auth returns 401 | Auth protection on create |
| TC-058 | GET /notifications without auth returns 401 | Auth protection on read |
| TC-059 | PATCH /notifications/read-all without auth returns 401 | Auth protection on update |
| TC-060 | POST /help-board without auth returns 401 | Auth protection on create |

---

### 3. UI/UX Tests (15 Tests)
Visual element verification, layout validation, and design consistency checks.

| Test ID | Test Name | Description |
|---------|-----------|-------------|
| TC-061 | Login screen logo icon renders | Leaf icon in logo circle |
| TC-062 | Login screen app title "VillageConnect" displayed | Brand name visibility |
| TC-063 | Login screen tagline text visible | Subtitle/tagline text |
| TC-064 | Login card container renders properly | Card layout with input fields |
| TC-065 | Email input placeholder shows "you@example.com" | Correct placeholder text |
| TC-066 | OTP input enforces maxLength of 6 digits | Input length restriction |
| TC-067 | Signup screen back arrow button exists | Navigation back button |
| TC-068 | Signup screen avatar circle renders | Profile avatar placeholder |
| TC-069 | Signup language selector shows language chips | EN/HI/TE chip selectors |
| TC-070 | Home screen header uses green primary color | #1B5E3F primary theming |
| TC-071 | Emergency SOS strip uses red danger color | Red emergency styling |
| TC-072 | Bottom tabs show icons for all sections | Tab bar icon rendering |
| TC-073 | Feed notice cards show category badges | Category tag badges |
| TC-074 | Directory cards show contact phone numbers | Phone number display |
| TC-075 | Market cards display price prominently | ₹ price visibility |

---

### 4. Validation Tests (15 Tests)
Input validation, error handling, and boundary condition testing.

| Test ID | Test Name | Description |
|---------|-----------|-------------|
| TC-076 | Login rejects empty email field | Empty email validation |
| TC-077 | Login rejects invalid email format "notanemail" | No @ symbol |
| TC-078 | Login rejects email without domain "user@" | Missing domain |
| TC-079 | Login rejects email without TLD "user@domain" | Missing TLD |
| TC-080 | Signup rejects empty name field | Required name validation |
| TC-081 | Signup rejects empty village field | Required village validation |
| TC-082 | Signup rejects phone less than 10 digits | Phone length check |
| TC-083 | Signup rejects phone with letters | Phone format check |
| TC-084 | API rejects announcement without title | Required field validation |
| TC-085 | API rejects announcement without body | Required field validation |
| TC-086 | API rejects market item without title | Required field validation |
| TC-087 | API rejects market item without price | Required field validation |
| TC-088 | API rejects grievance without category | Required field validation |
| TC-089 | API rejects grievance without description | Required field validation |
| TC-090 | API rejects help board post without title | Required field validation |

---

### 5. Unit Tests (10 Tests)
Logic verification for utility functions, data transforms, and configuration.

| Test ID | Test Name | Description |
|---------|-----------|-------------|
| TC-091 | Email regex validates correct email formats | Positive email validation |
| TC-092 | Email regex rejects malformed emails | Negative email validation |
| TC-093 | Phone number strips non-digit characters | Phone sanitization |
| TC-094 | Phone validation requires 10 digits minimum | Length requirement |
| TC-095 | OTP code is exactly 6 digits | Format validation |
| TC-096 | API base URL is correctly configured | Configuration check |
| TC-097 | User role defaults to "Resident" | Default value check |
| TC-098 | Grievance status allows only valid values | Enum validation |
| TC-099 | Market price auto-prepends ₹ symbol | Price formatting |
| TC-100 | Announcement category maps to correct icon | Icon mapping check |

---

### 6. Deployment Readiness Tests (5 Tests)
Production readiness, performance, and infrastructure validation.

| Test ID | Test Name | Description |
|---------|-----------|-------------|
| TC-101 | Backend health endpoint responds within 5s | Response time check |
| TC-102 | Frontend loads within 15s timeout | Page load performance |
| TC-103 | API CORS headers present in response | Cross-origin support |
| TC-104 | API returns proper JSON content-type | Content-type header |
| TC-105 | All public API endpoints return valid JSON arrays | Comprehensive API check |

---

## Test Report Format

The test suite automatically generates `VillageConnect_Test_Report.xlsx` with the following sheets:

| Sheet Name | Contents |
|------------|----------|
| **Summary** | Overall pass rate, environment info, per-category breakdown, deployable status |
| **E2E Functional Tests** | TC-001 to TC-035 detailed results |
| **API Functional Tests** | TC-036 to TC-060 detailed results |
| **UI-UX Tests** | TC-061 to TC-075 detailed results |
| **Validation Tests** | TC-076 to TC-090 detailed results |
| **Unit Tests** | TC-091 to TC-100 detailed results |
| **Deployment Tests** | TC-101 to TC-105 detailed results |
| **All Test Cases** | Complete 105-test listing with all columns |

Each result row includes: **Test ID**, **Test Name**, **Category**, **Status**, **Duration (ms)**, **Details**.

---

## CI/CD Pipeline

The test suite runs automatically via GitHub Actions on:
- Push to `main` or `master` branch
- Pull requests targeting `main` or `master`
- Manual trigger via `workflow_dispatch`

### Workflow File
`.github/workflows/selenium-tests.yml`

### Artifacts
The XLSX test report is uploaded as a GitHub Actions artifact after each run, available for download for 30 days.

---

## Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Selenium WebDriver | 4.20+ | Browser automation |
| Google Chrome | Latest | Headless browser |
| Node.js | 20+ | Test runtime |
| xlsx (SheetJS) | 0.18+ | Excel report generation |

---

## Test Design Principles

1. **Independence**: Each test case is self-contained and does not depend on other tests' success
2. **Resilience**: All tests use try/catch to record results without halting the suite
3. **Completeness**: 105 tests cover all 21 screens, 14 models, and 30+ API endpoints
4. **Reporting**: Every test generates detailed timing and status data for the XLSX report
5. **CI/CD Ready**: Tests run in headless mode and are compatible with GitHub Actions
