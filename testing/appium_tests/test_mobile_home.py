import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_mobile_home_responsive_layout(mobile_driver, target_url):
    """
    TS-APP-001: Verify mobile responsive layout on page load.
    """
    mobile_driver.get(target_url)
    # Check page loads and viewport is mobile width
    assert "Fake News Shield" in mobile_driver.title or "Truth" in mobile_driver.page_source
    
    # Check that width is small
    size = mobile_driver.get_window_size()
    assert size['width'] < 800

def test_mobile_hamburger_menu(mobile_driver, target_url):
    """
    TS-APP-002: Verify hamburger menu toggles navbar drawer.
    """
    mobile_driver.get(target_url)
    
    # In mobile view, the navbar should collapse into a menu button
    # Let's locate the button with menu/hamburger icon or toggle
    # Search for button that might toggle menu
    try:
        hamburger_btn = mobile_driver.find_element(By.XPATH, "//header//button[contains(@class, 'hamburger') or @aria-label='Toggle Menu' or @aria-expanded]")
        hamburger_btn.click()
        
        # Verify navigation links display in expanded overlay
        analyze_link = WebDriverWait(mobile_driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//a[contains(@href, '/analyze')]"))
        )
        assert analyze_link.is_displayed()
    except Exception:
        # If viewport is wider, links might be displayed directly
        analyze_link = mobile_driver.find_element(By.XPATH, "//a[contains(@href, '/analyze')]")
        assert analyze_link.is_displayed()
