import os
import sys
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# Ensure the parent folders are on sys.path so modules resolve correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

@pytest.fixture(scope="session")
def target_url():
    return os.environ.get("TEST_TARGET_URL", "http://localhost:5173")

@pytest.fixture(scope="function")
def driver(request):
    """
    Setup and teardown WebDriver with screenshot-on-failure hooks.
    """
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1280,1024")
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(5)
    
    yield driver
    
    # Take screenshot if test failed
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        os.makedirs("screenshots", exist_ok=True)
        filename = f"screenshots/fail_{request.node.name}.png"
        driver.save_screenshot(filename)
        print(f"Test failed. Screenshot saved to: {filename}")
        
    driver.quit()

# Hook to retrieve failure report inside drivers
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, "rep_" + rep.when, rep)
