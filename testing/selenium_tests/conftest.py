import os
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

@pytest.fixture(scope="session")
def target_url():
    """
    Returns the target URL for testing, default is localhost:5173.
    """
    return os.environ.get("TEST_TARGET_URL", "http://localhost:5173")

@pytest.fixture(scope="function")
def driver():
    """
    Setup and teardown local Selenium Chrome WebDriver.
    """
    chrome_options = Options()
    chrome_options.add_argument("--headless") # Run in headless mode by default for CI/automation
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    
    # Initialize webdriver (expects chromedriver on PATH)
    driver = webdriver.Chrome(options=chrome_options)
    
    # Set implicit wait for finding elements
    driver.implicitly_wait(5)
    
    yield driver
    
    # Teardown
    driver.quit()
