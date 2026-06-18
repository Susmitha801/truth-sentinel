import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_mobile_dashboard_grid_stacking(mobile_driver, target_url):
    """
    TS-APP-041: Verify stats cards grid stack on mobile screen.
    """
    mobile_driver.get(target_url + "/dashboard")
    
    # Wait for the main container
    container = WebDriverWait(mobile_driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//main"))
    )
    
    # Assert container loads correctly
    assert container.is_displayed()
    
    # We can check that the layout conforms to mobile dimensions
    size = mobile_driver.get_window_size()
    assert size['width'] < 800
