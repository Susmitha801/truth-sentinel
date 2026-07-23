# EXECUTIVE SUMMARY: E2E TEST AUTOMATION FRAMEWORK
**Project Title**: Truth Sentinel (AI-Driven Fake News Shield)  
**Academic Course**: Software Quality Assurance & Test Engineering  
**Prepared By**: Senior QA Automation Engineer  

---

## 1. Project Overview
This report presents the QA Automation Architecture designed for **Truth Sentinel** (Fake News Shield), a modern client-side React frontend application. The application leverages transformer-based NLP heuristics to check article texts, source publisher URLs, and local files for authenticity and sentiment.

To guarantee frontend reliability, responsive display safety, and form validation resilience, a complete end-to-end (E2E) automated testing suite was implemented.

---

## 2. Test Automation Architecture
The testing suite is structured using the **Page Object Model (POM)** pattern, which isolates element selectors and page actions from the test scripts. This increases script maintainability and reduces test code duplication.

### Key Technology Stack:
- **Programming Language**: Python 3.13
- **Automation Framework**: Selenium WebDriver (Headless Chrome)
- **Test Runner & Assertions**: Pytest
- **Reporting Engine**: Openpyxl (Excel metrics) & Custom CSS Responsive Dashboard (HTML)
- **CI/CD Integration**: GitHub Actions

---

## 3. Test Strategy & Scope
The automation suite executes precisely **100 test cases** structured across 6 core criteria:

1. **Authentication Testing**: Asserts secure sign-ins, input visibility toggles, empty username/password validation tooltips, session persistence after page reload (localStorage parsing), and immediate redirection logic post-logout.
2. **Navigation Testing**: Validates router integrity (TanStack Router targets), navbar clicks, browser history (back/forward caches), redirects on undefined paths (404/fallbacks), and route guards.
3. **Form Validation Testing**: Audits field submission validations, boundary conditions (under/over 30 characters on text inputs), URL regex checkers, and duplicate execution blockages.
4. **UI Functional Testing**: Evaluates element rendering, statistics widgets, canvas Recharts elements, loading spinner sequences, and screen responsiveness across widths (desktop vs. 375px mobile viewports).
5. **Security-Oriented UI Testing**: Audits browser localStorage against plaintext credentials, sessionStorage lifecycles, exposure of production API keys, and sensitive string printouts in browser console logs.
6. **Cross-Browser Verification**: Tests configuration options across major browser drivers: Google Chrome, Microsoft Edge, and Mozilla Firefox.

---

## 4. CI/CD Integration & GitHub Actions
The testing lifecycle is integrated directly into the GitHub repository via **GitHub Actions** (`e2e-tests.yml`). 

### Pipeline Steps:
1. **Trigger**: Executes on every push or pull-request to the `main` branch.
2. **Environment Build**: Spins up an Ubuntu runner, instantiates Python, and installs dependencies.
3. **App Server Startup**: Starts the React/Vite development server in the background.
4. **Automation Execution**: Triggers the Pytest runner using headless Chrome configurations.
5. **Report Compilation**: Generates the interactive HTML dashboard (`test_report.html`) and Excel analysis sheets (`test_report.xlsx`).
6. **Artifact Upload**: Uploads test results and failure screenshots directly to the GitHub build logs for remote evaluation.

---

## 5. Summary of Results
The latest execution run successfully validated all 100 test cases:

- **Total Test Cases**: 100
- **Passed**: 100
- **Failed**: 0
- **Success Rate**: 100.0%
- **Execution Environment**: Headless Chrome (Local Dev Server)

### Automation Deliverables Output Paths:
- **Excel Pass/Fail Sheet**: [testing/test_report.xlsx](file:///C:/Users/DELL/Downloads/truth-sentinel-main/truth-sentinel-main/testing/test_report.xlsx)
- **HTML Interactive Dashboard**: [testing/test_report.html](file:///C:/Users/DELL/Downloads/truth-sentinel-main/truth-sentinel-main/testing/test_report.html)
- **Setup & Commands Documentation**: [testing/README.md](file:///C:/Users/DELL/Downloads/truth-sentinel-main/truth-sentinel-main/testing/README.md)
