import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_mobile_keyboard_focus(mobile_driver, target_url):
    """
    TS-APP-019: Verify text area focus behavior on mobile keyboard pop-up.
    """
    mobile_driver.get(target_url + "/analyze")
    
    # Wait for the text area and tap to focus (this usually triggers software keyboard)
    textarea = WebDriverWait(mobile_driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//textarea"))
    )
    textarea.click()
    
    # Verify textarea remains active and visible
    assert textarea.is_displayed()

def test_mobile_empty_submit_toast(mobile_driver, target_url):
    """
    TS-APP-020: Verify toast alert on empty submission in mobile.
    """
    mobile_driver.get(target_url + "/analyze")
    
    # Ensure textarea is empty
    textarea = WebDriverWait(mobile_driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//textarea"))
    )
    textarea.clear()
    
    # Click analyze button
    analyze_btn = mobile_driver.find_element(By.XPATH, "//button[contains(., 'Analyze')]")
    analyze_btn.click()
    
    # Expect validation toast message
    toast = WebDriverWait(mobile_driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'at least 30')]"))
    )
    assert toast.is_displayed()
