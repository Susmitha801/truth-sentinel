# Truth Sentinel E2E Test Automation Framework (Appium & Selenium)

This directory contains the end-to-end (E2E) automated testing suite for the **Truth Sentinel (Fake News Shield)** application. It provides test scripts for both desktop browsers (via **Selenium WebDriver**) and Android mobile devices/emulators (via **Appium Mobile Driver**), and consolidates execution results into a unified, formatted Excel analysis report.

The test framework includes exactly **100 test cases** mapping UI verification, text analysis validation, source URL processing, file upload heuristics, dashboard rendering, fact-check history controls, theme toggling, and responsive layout adaptions.

---

## Directory Structure

```
testing/
├── requirements.txt            # Python packages (pytest, selenium, Appium-Python-Client, openpyxl)
├── run_tests.py                # Main test runner (triggers execution & consolidates outcomes)
├── report_generator.py         # Test cases catalog & Excel workbook formatting logic
├── README.md                   # Setup and execution guide (this file)
├── selenium_tests/             # Desktop Browser E2E Test Suite (using Selenium)
│   ├── __init__.py
│   ├── conftest.py             # Pytest fixtures for desktop webdriver options
│   ├── test_home.py
│   ├── test_analyze.py
│   ├── test_dashboard.py
│   ├── test_history.py
│   └── test_about.py
└── appium_tests/               # Android Mobile Browser/WebView Test Suite (using Appium)
    ├── __init__.py
    ├── conftest.py             # Pytest fixtures for mobile driver capabilities
    ├── test_mobile_home.py
    ├── test_mobile_analyze.py
    ├── test_mobile_dashboard.py
    ├── test_mobile_history.py
    └── test_mobile_about.py
```

---

## Setup Instructions

### 1. Python Environment Setup
Ensure you have Python 3.8+ installed (on Windows, `py` command is recommended).

```bash
# Navigate to the testing directory
cd testing

# Install the required dependencies
py -m pip install -r requirements.txt
```

### 2. Selenium Requirements (Desktop Tests)
- **WebDriver**: The test suite uses Google Chrome by default in headless mode. Ensure you have Google Chrome installed.
- Modern Selenium automatically manages Chrome WebDrivers, but you can configure local binary paths if desired.

### 3. Appium Requirements (Mobile Tests)
- **Appium Server**: Install Appium via Node.js:
  ```bash
  npm install -g appium
  ```
- **Android Driver**: Install the Appium UiAutomator2 driver:
  ```bash
  appium driver install uiautomator2
  ```
- **Android SDK & Device**:
  1. Set up an Android Emulator or connect a physical Android device with **USB Debugging** enabled.
  2. Install Google Chrome on the emulator/device.
  3. Set environment variable `ANDROID_HOME` pointing to your Android SDK directory (e.g., `C:\Users\<username>\AppData\Local\Android\Sdk`).
- **Start Appium Server**:
  ```bash
  appium
  ```
  *(Starts the appium server at `http://localhost:4723`)*

---

## Execution Guide

### Mode A: Simulated Run (Recommended for Quick Report Generation)
If you want to view the consolidated test report spreadsheet immediately without setting up WebDrivers or the Appium server stack, you can run the test suite in **Simulation Mode**. This generates mock results for the 100 test cases (including custom mock failures to showcase color styling).

```bash
# Generate test_report.xlsx with 100 simulated outcomes (98 PASS, 2 FAIL)
py run_tests.py --simulate
```

You can customize the number of simulated failures (to see how `FAIL` is formatted):
```bash
py run_tests.py --simulate --fails 5
```

### Mode B: Real Test Execution
Make sure your target application server is running (default is `http://localhost:5173`).

#### Run Selenium (Desktop) Tests:
```bash
py run_tests.py --platform selenium --url http://localhost:5173
```

#### Run Appium (Mobile) Tests:
Make sure your Appium server and Android device/emulator are online.
```bash
py run_tests.py --platform appium --url http://10.0.2.2:5173
```
*(Note: `10.0.2.2` represents the host machine's localhost inside standard Android Emulators)*

#### Run All Suites:
```bash
py run_tests.py --platform all
```

---

## Consolidated Excel Test Report Details

The output workbook (`test_report.xlsx`) is structured with two primary worksheets, fully styled for corporate QA handoffs:

### 1. Dashboard Summary Worksheet
- **Total Tests Counter**: Live cell formula reading overall count.
- **Passed & Failed KPIs**: Displays green/red metric blocks with count formulas.
- **Pass Rate Percentage**: Displays real-time calculations formatted as `0.0%`.
- **Platform Breakdown Table**: Highlights performance, pass rates, and volumes for *Selenium (Desktop Browser)* and *Appium (Android Mobile)* separate columns.

### 2. Test Cases Details Worksheet
A comprehensive grid mapping **100 test cases** with the following column structure:
- **Test Case ID** (formatted as `TS-SEL-00X` or `TS-APP-00X`)
- **Test Type** (Selenium vs Appium)
- **Module / Area** (Navigation, Home, Analyzer, Dashboard, History, etc.)
- **Scenario / Objective**
- **Pre-conditions**
- **Test Steps** (clear markdown-friendly lines)
- **Expected Result**
- **Actual Result** (dynamic depending on mock/real run outcomes)
- **Status** (Color-coded: soft green for `PASS`, soft red for `FAIL`)
- **Execution Time**

Column widths are auto-fit dynamically, borders are thin gray slate grids, zebra striping is enabled on rows for scannability, and header rows use dark gray fills with white text.
