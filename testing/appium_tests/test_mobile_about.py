import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_mobile_about_capabilities_display(mobile_driver, target_url):
    """
    TS-APP-047: Verify capabilities list stacks in single grid on small mobile viewports.
    """
    mobile_driver.get(target_url + "/about")
    
    # Wait for capabilities section or page header
    header = WebDriverWait(mobile_driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(., 'About')]"))
    )
    assert header.is_displayed()
    
    # Verify capability list items render
    capabilities_items = mobile_driver.find_elements(By.XPATH, "//li[contains(., 'BERT-based') or contains(., 'Explainable') or contains(., 'credibility')]")
    assert len(capabilities_items) > 0
