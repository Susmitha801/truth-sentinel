import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_history_page_loads(driver, target_url):
    """
    TS-SEL-044: Verify empty history screen displays or loaded data view.
    """
    driver.get(target_url + "/history")
    
    # Wait for page title header
    header = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(., 'Fact-check history')]"))
    )
    assert header.is_displayed()
    
    main_text = driver.find_element(By.XPATH, "//main").text
    if "Nothing here yet" in main_text:
        analyze_btn = driver.find_element(By.XPATH, "//a[contains(text(), 'Analyze a story')]")
        assert analyze_btn.is_displayed()
    else:
        # History is populated - check sidebar list elements
        sidebar_buttons = driver.find_elements(By.XPATH, "//main//button")
        assert len(sidebar_buttons) > 0
