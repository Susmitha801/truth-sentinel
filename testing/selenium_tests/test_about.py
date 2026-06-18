import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_about_page_elements(driver, target_url):
    """
    TS-SEL-047: Verify 'Capabilities' list items display on About page.
    """
    driver.get(target_url + "/about")
    
    # Wait for capabilities section or page header
    header = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(., 'About')]"))
    )
    assert header.is_displayed()
    
    # Verify capabilities list contains items
    capabilities_items = driver.find_elements(By.XPATH, "//li[contains(., 'BERT-based') or contains(., 'Explainable') or contains(., 'credibility')]")
    assert len(capabilities_items) > 0

def test_about_navigation_links(driver, target_url):
    """
    TS-SEL-048: Verify navigation redirect buttons at bottom of About page.
    """
    driver.get(target_url + "/about")
    
    # Locate buttons
    try_btn = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Try the analyzer')]"))
    )
    try_btn.click()
    
    # Check url
    WebDriverWait(driver, 5).until(EC.url_contains("/analyze"))
    assert "/analyze" in driver.current_url
