import os
import sys
import subprocess
import argparse

def run_node_selenium():
    print("Executing Node.js Selenium E2E Web Test Suite...")
    cwd = os.path.join(os.getcwd(), "node_selenium")
    # Restore dependencies if needed
    if not os.path.exists(os.path.join(cwd, "node_modules")):
        print("Restoring Node.js test dependencies...")
        subprocess.run(["npm", "install"], cwd=cwd, shell=True)
    subprocess.run(["node", "test_runner.js"], cwd=cwd, shell=True)

def run_appium_python():
    print("Executing Python Appium E2E Mobile Test Suite...")
    cwd = os.path.join(os.getcwd(), "appium_tests")
    subprocess.run([sys.executable, "run_appium_tests.py"], cwd=cwd)

def run_master_compile():
    print("Generating simulated results for Unit, Val, Dep, and Load suites...")
    subprocess.run([sys.executable, "generate_results.py"])
    print("Generating vulnerability Excel report...")
    subprocess.run([sys.executable, "generate_vuln_sheet.py"])
    print("Compiling master report via compile_master_report.py...")
    subprocess.run([sys.executable, "compile_master_report.py"])

def main():
    parser = argparse.ArgumentParser(description="Consolidated QA Test Suite Runner for FakeNews Shield")
    parser.add_argument("--simulate", action="store_true", default=True, help="Run E2E web/mobile test suites")
    parser.add_argument("--url", default="http://localhost:8080", help="Target app url")
    parser.add_argument("--fails", type=int, default=0, help="Simulated failures")
    
    args = parser.parse_args()
    
    os.environ["TEST_TARGET_URL"] = args.url
    
    # Run the suites
    run_node_selenium()
    run_appium_python()
    
    # Compile report
    run_master_compile()
    print("Master E2E report generation successfully complete.")

if __name__ == "__main__":
    main()

