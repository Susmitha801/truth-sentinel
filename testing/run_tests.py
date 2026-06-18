import os
import sys
import argparse
import random
from report_generator import generate_report

def run_simulation(fail_count=2):
    """
    Simulates a test run, creating mock results for the 100 test cases
    to generate a sample Excel report without needing webdrivers.
    """
    print("Running simulated E2E test suite...")
    results = {}
    
    # We have TS-SEL-001 to TS-SEL-050 and TS-APP-001 to TS-APP-050
    # Let's mark a few specific test cases as FAIL to showcase the error reporting formatting
    failed_indices_sel = random.sample(range(1, 51), fail_count // 2)
    failed_indices_app = random.sample(range(1, 51), fail_count - (fail_count // 2))
    
    # Mock Selenium results
    for i in range(1, 51):
        tc_id = f"TS-SEL-{i:03d}"
        if i in failed_indices_sel:
            results[tc_id] = {
                "status": "FAIL",
                "actual": "Element not found or timed out after 10s: Button locator '//button[text()=\"Analyze\"]'.",
                "time": "10.4s"
            }
        else:
            results[tc_id] = {
                "status": "PASS",
                "actual": "Assertion succeeded. The targeted DOM elements matched expected layouts.",
                "time": f"{random.uniform(0.5, 2.5):.1f}s"
            }
            
    # Mock Appium results
    for i in range(1, 51):
        tc_id = f"TS-APP-{i:03d}"
        if i in failed_indices_app:
            results[tc_id] = {
                "status": "FAIL",
                "actual": "Appium connection lost during page transition or soft-keyboard overlaps input target.",
                "time": "12.1s"
            }
        else:
            results[tc_id] = {
                "status": "PASS",
                "actual": "Responsive elements rendered correctly. Tap target registered callback successfully.",
                "time": f"{random.uniform(0.6, 2.8):.1f}s"
            }
            
    print(f"Simulation completed. 100 tests executed: {100 - fail_count} passed, {fail_count} failed.")
    return results

def run_real_tests(target_url, platform):
    """
    Attempts to run real E2E tests using pytest.
    """
    print(f"Targeting E2E tests at: {target_url}")
    print(f"Suite selected: {platform}")
    
    try:
        import pytest
    except ImportError:
        print("Error: pytest is required to run real tests. Install it via 'pip install pytest'.")
        sys.exit(1)
        
    # Build arguments for pytest
    args = []
    if platform == "selenium":
        args.append("selenium_tests/")
    elif platform == "appium":
        args.append("appium_tests/")
    else:
        args.append("selenium_tests/")
        args.append("appium_tests/")
        
    # We can pass environmental variable for test configuration
    os.environ["TEST_TARGET_URL"] = target_url
    
    print(f"Executing: pytest {' '.join(args)}")
    # Running pytest programmatically
    exit_code = pytest.main(args)
    print(f"Pytest execution finished with exit code {exit_code}")
    
    # In a real environment, we'd read the JUnit XML or pytest-json-report 
    # to feed back into the report generator. We will fallback to generating the
    # spreadsheet.
    return None

def main():
    parser = argparse.ArgumentParser(description="E2E Test Automation Runner for Truth Sentinel")
    parser.add_argument("--simulate", action="store_true", help="Simulate a run to generate report immediately")
    parser.add_argument("--url", default="http://localhost:5173", help="Target URL for tests (default: http://localhost:5173)")
    parser.add_argument("--platform", choices=["all", "selenium", "appium"], default="all", help="Target platform (default: all)")
    parser.add_argument("--output", default="test_report.xlsx", help="Filename of the output Excel spreadsheet")
    parser.add_argument("--fails", type=int, default=2, help="Number of simulated test failures to inject (default: 2)")
    
    args = parser.parse_args()
    
    if args.simulate:
        results = run_simulation(args.fails)
        generate_report(results, args.output)
    else:
        print("Note: Running real tests requires webdriver setups (chromedriver or appium server).")
        print("Use --simulate to quickly test report generation without installing dependencies.")
        results = run_real_tests(args.url, args.platform)
        # Generate default sheet if pytest results weren't parsed
        generate_report(None, args.output)

if __name__ == "__main__":
    main()
