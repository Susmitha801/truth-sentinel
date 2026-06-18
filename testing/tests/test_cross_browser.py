import pytest
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions

def test_chrome_options_compatibility():
    """
    CB-01: Verify ChromeOptions setup in headless configuration.
    """
    options = ChromeOptions()
    options.add_argument("--headless")
    assert "--headless" in options.arguments

def test_edge_options_compatibility():
    """
    CB-02: Verify EdgeOptions setup in headless configuration.
    """
    options = EdgeOptions()
    options.add_argument("--headless")
    assert "--headless" in options.arguments

def test_firefox_options_compatibility():
    """
    CB-03: Verify FirefoxOptions setup in headless configuration.
    """
    options = FirefoxOptions()
    options.add_argument("-headless")
    assert "-headless" in options.arguments
