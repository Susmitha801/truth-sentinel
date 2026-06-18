import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_analyze_empty_validation(driver, target_url):
    """
    TS-SEL-019: Verify empty text submission validation.
    """
    driver.get(target_url + "/analyze")
    
    # Wait for the textarea to be present
    textarea = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//textarea"))
    )
    textarea.clear()
    
    # Click analyze button
    analyze_btn = driver.find_element(By.XPATH, "//button[contains(., 'Analyze')]")
    analyze_btn.click()
    
    # Assert validation error triggers (toast error)
    # The application uses 'sonner' for toasts
    toast = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'provide at least 30')]"))
    )
    assert toast.is_displayed()

def test_analyze_sample_selection(driver, target_url):
    """
    TS-SEL-022: Verify Sample 1 button inserts fake news sample.
    """
    driver.get(target_url + "/analyze")
    
    # Wait for sample button
    sample_btn = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Try sample 1')]"))
    )
    sample_btn.click()
    
    textarea = driver.find_element(By.XPATH, "//textarea")
    text_val = textarea.get_attribute("value")
    assert len(text_val) > 30
    assert "miracle cure" in text_val.lower()

def test_analyze_execution_flow(driver, target_url):
    """
    TS-SEL-024: Verify successful analysis execution for Sample 1.
    """
    driver.get(target_url + "/analyze")
    
    # Click Try Sample 1
    sample_btn = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Try sample 1')]"))
    )
    sample_btn.click()
    
    # Click Analyze
    analyze_btn = driver.find_element(By.XPATH, "//button[contains(., 'Analyze')]")
    analyze_btn.click()
    
    # Wait for loader sequence
    # Heuristics loader displays "Analyzing..." and then disappears
    WebDriverWait(driver, 10).until(
        EC.invisibility_of_element_located((By.XPATH, "//*[contains(text(), 'Analyzing…')]"))
    )
    
    # Result card should display
    result_card = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "result"))
    )
    assert result_card.is_displayed()
    
    # Verify confidence rating is shown
    confidence = driver.find_element(By.XPATH, "//*[contains(text(), 'confidence')]")
    assert confidence.is_displayed()
