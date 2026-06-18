import os
import pytest
from appium import webdriver
from appium.options.common import AppiumOptions

@pytest.fixture(scope="session")
def target_url():
    """
    Returns the target URL for testing, default is localhost:5173 or local network IP.
    On mobile emulator, localhost refers to the emulator itself, so 10.0.2.2 is usually used.
    """
    # 10.0.2.2 is the default bridge to the host machine's localhost in Android Emulator
    return os.environ.get("TEST_TARGET_URL", "http://10.0.2.2:5173")

@pytest.fixture(scope="function")
def mobile_driver():
    """
    Setup and teardown local Appium Android Chrome Driver.
    Requires Appium server running at http://localhost:4723 and an Android emulator active.
    """
    options = AppiumOptions()
    options.set_capability("platformName", "Android")
    options.set_capability("automationName", "UiAutomator2")
    options.set_capability("browserName", "Chrome")
    options.set_capability("deviceName", "Android Emulator")
    options.set_capability("chromedriverExecutable", os.environ.get("CHROMEDRIVER_PATH", ""))
    
    # Appium Server URL
    appium_server = os.environ.get("APPIUM_SERVER_URL", "http://localhost:4723")
    
    # Initialize driver
    driver = webdriver.Remote(appium_server, options=options)
    driver.implicitly_wait(5)
    
    yield driver
    
    # Teardown
    driver.quit()
