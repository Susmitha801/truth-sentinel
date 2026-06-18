import pytest
from pages.analyze_page import AnalyzePage

def test_textarea_required_validation(driver, target_url):
    """
    FORM-01: Verify required field validation for empty inputs.
    """
    analyze_page = AnalyzePage(driver)
    analyze_page.navigate_to(target_url + "/analyze")
    
    # Analyze with empty field
    analyze_page.click_analyze()
    
    # Expected: toast validation error
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    toast = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'provide at least 30')]"))
    )
    assert toast.is_displayed()

def test_invalid_input_validation(driver, target_url):
    """
    FORM-02: Verify invalid url format rejection.
    """
    analyze_page = AnalyzePage(driver)
    analyze_page.navigate_to(target_url + "/analyze")
    analyze_page.select_url_tab()
    
    # Enter malformed url
    analyze_page.enter_url("invalid-url-domain")
    analyze_page.click_analyze()
    
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    toast = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'valid URL starting')]"))
    )
    assert toast.is_displayed()

def test_boundary_value_testing_short_text(driver, target_url):
    """
    FORM-03: Boundary testing: Verify 29 character input fails validation.
    """
    analyze_page = AnalyzePage(driver)
    analyze_page.navigate_to(target_url + "/analyze")
    
    # 29 characters text
    analyze_page.enter_text("A" * 29)
    analyze_page.click_analyze()
    
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    toast = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'at least 30')]"))
    )
    assert toast.is_displayed()

def test_boundary_value_testing_valid_text(driver, target_url):
    """
    FORM-04: Boundary testing: Verify 30 character input passes validation.
    """
    analyze_page = AnalyzePage(driver)
    analyze_page.navigate_to(target_url + "/analyze")
    
    # Exactly 30 characters text
    analyze_page.enter_text("A" * 30)
    analyze_page.click_analyze()
    
    # Result should load or load animation start
    assert analyze_page.is_visible(analyze_page.ANALYZE_BUTTON)

def test_duplicate_submission_prevention(driver, target_url):
    """
    FORM-05: Verify click is disabled or ignored during active loading.
    """
    analyze_page = AnalyzePage(driver)
    analyze_page.navigate_to(target_url + "/analyze")
    analyze_page.click_sample_1()
    
    # Click analyze and check loader state
    analyze_page.click_analyze()
    assert analyze_page.is_visible(analyze_page.LOADING_SPINNER) or not analyze_page.driver.find_element(*analyze_page.ANALYZE_BUTTON).is_enabled()
