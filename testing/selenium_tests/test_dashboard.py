import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_dashboard_empty_state_or_populated(driver, target_url):
    """
    TS-SEL-041: Verify stats cards or empty state display on Dashboard page.
    """
    driver.get(target_url + "/dashboard")
    
    # Wait for the main dashboard content
    container = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//main"))
    )
    
    # Check if empty state or stats grid is shown
    page_text = container.text
    if "No analyses yet" in page_text:
        # Check for Analyze a story CTA
        cta_btn = driver.find_element(By.XPATH, "//a[contains(text(), 'Analyze a story')]")
        assert cta_btn.is_displayed()
    else:
        # Should contain stats cards
        stats_cards = driver.find_elements(By.XPATH, "//*[contains(text(), 'Total analyzed')]")
        assert len(stats_cards) > 0
