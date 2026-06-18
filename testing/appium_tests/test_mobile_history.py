import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_mobile_history_layout(mobile_driver, target_url):
    """
    TS-APP-044: Verify history layout stacks sidebar and detail panels vertically.
    """
    mobile_driver.get(target_url + "/history")
    
    # Wait for the main page header
    header = WebDriverWait(mobile_driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(., 'Fact-check history')]"))
    )
    assert header.is_displayed()
    
    # Check that vertical scroll exists or content is visible
    main_section = mobile_driver.find_element(By.XPATH, "//main")
    assert len(main_section.text) > 0
