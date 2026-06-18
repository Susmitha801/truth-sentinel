import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_home_page_loads(driver, target_url):
    """
    TS-SEL-001: Verify Home Page loads successfully.
    """
    driver.get(target_url)
    assert "Fake News Shield" in driver.title or "Truth" in driver.page_source

def test_navigation_to_analyze(driver, target_url):
    """
    TS-SEL-002: Verify navigation to Analyze page via Header.
    """
    driver.get(target_url)
    # Find navigation link for Analyze
    analyze_link = driver.find_element(By.XPATH, "//a[contains(@href, '/analyze')]")
    analyze_link.click()
    
    # Wait for URL to update
    WebDriverWait(driver, 5).until(EC.url_contains("/analyze"))
    assert "/analyze" in driver.current_url

def test_navigation_to_dashboard(driver, target_url):
    """
    TS-SEL-003: Verify navigation to Dashboard page via Header.
    """
    driver.get(target_url)
    dashboard_link = driver.find_element(By.XPATH, "//a[contains(@href, '/dashboard')]")
    dashboard_link.click()
    
    WebDriverWait(driver, 5).until(EC.url_contains("/dashboard"))
    assert "/dashboard" in driver.current_url

def test_hero_buttons_redirection(driver, target_url):
    """
    TS-SEL-011: Verify 'Analyze a story' CTA button action.
    """
    driver.get(target_url)
    # Target 'Analyze a story' inside main hero section
    cta_btn = driver.find_element(By.XPATH, "//main//a[contains(text(), 'Analyze a story')]")
    cta_btn.click()
    
    WebDriverWait(driver, 5).until(EC.url_contains("/analyze"))
    assert "/analyze" in driver.current_url
