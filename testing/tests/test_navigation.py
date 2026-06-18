import pytest
import time
from pages.home_page import HomePage

def test_verify_all_navbar_links(driver, target_url):
    """
    NAV-01: Verify all main navigation links in the header.
    """
    home_page = HomePage(driver)
    home_page.navigate_to(target_url)
    
    # Verify links exist
    assert home_page.is_visible(home_page.ANALYZE_NAV_LINK)
    assert home_page.is_visible(home_page.DASHBOARD_NAV_LINK)
    assert home_page.is_visible(home_page.HISTORY_NAV_LINK)
    assert home_page.is_visible(home_page.ABOUT_NAV_LINK)

def test_verify_dashboard_navigation(driver, target_url):
    """
    NAV-02: Verify direct navigation to Dashboard works.
    """
    home_page = HomePage(driver)
    home_page.navigate_to(target_url)
    home_page.click_dashboard_nav()
    
    assert "/dashboard" in home_page.get_current_url()

def test_verify_protected_routes(driver, target_url):
    """
    NAV-03: Verify routing rules.
    """
    home_page = HomePage(driver)
    home_page.navigate_to(target_url + "/dashboard")
    assert "/dashboard" in home_page.get_current_url()

def test_verify_logo_redirect(driver, target_url):
    """
    NAV-04: Verify clicking branding logo navigates to Home.
    """
    home_page = HomePage(driver)
    home_page.navigate_to(target_url + "/analyze")
    home_page.click_logo()
    
    assert home_page.get_current_url().rstrip("/") == target_url.rstrip("/")

def test_verify_back_forward_navigation(driver, target_url):
    """
    NAV-05: Verify browser back/forward buttons functionality.
    """
    home_page = HomePage(driver)
    home_page.navigate_to(target_url)
    home_page.click_analyze_nav()
    
    # Go back
    driver.back()
    assert home_page.get_current_url().rstrip("/") == target_url.rstrip("/")
    
    # Go forward
    driver.forward()
    assert "/analyze" in home_page.get_current_url()

def test_verify_page_refresh_behavior(driver, target_url):
    """
    NAV-06: Verify page state on refresh.
    """
    home_page = HomePage(driver)
    home_page.navigate_to(target_url + "/about")
    driver.refresh()
    assert "/about" in home_page.get_current_url()
