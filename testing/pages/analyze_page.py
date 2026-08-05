from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class AnalyzePage(BasePage):
    """
    AnalyzePage models the input tab system (Text, URL, File) and submission controls.
    """
    # Tabs
    TEXT_TAB_TRIGGER = (By.XPATH, "//button[@role='tab' and contains(., 'Text')]")
    URL_TAB_TRIGGER = (By.XPATH, "//button[@role='tab' and contains(., 'URL')]")
    FILE_TAB_TRIGGER = (By.XPATH, "//button[@role='tab' and contains(., 'File')]")
    
    # Text Inputs & Controls
    TEXTAREA = (By.XPATH, "//textarea")
    CHAR_COUNT_LABEL = (By.XPATH, "//span[contains(text(), 'character')]")
    SAMPLE_1_BUTTON = (By.XPATH, "//button[contains(., 'Try sample 1')]")
    SAMPLE_2_BUTTON = (By.XPATH, "//button[contains(., 'Try sample 2')]")
    
    # URL Inputs
    URL_INPUT = (By.ID, "url-input")
    
    # File Inputs
    FILE_INPUT = (By.XPATH, "//input[@type='file']")
    FILE_LOADED_LABEL = (By.XPATH, "//*[contains(text(), 'Loaded')]")
    
    # Action Trigger
    ANALYZE_BUTTON = (By.ID, "analyze-btn")
    LOADING_SPINNER = (By.XPATH, "//*[contains(text(), 'Analyzing') or contains(@class, 'spin')]")
    
    # Result Card
    RESULT_CONTAINER = (By.ID, "result")
    VERDICT_LABEL = (By.XPATH, "//div[@id='result']//*[contains(text(), 'confidence') or contains(text(), 'Verdict')]")
    
    def select_text_tab(self):
        self.click(self.TEXT_TAB_TRIGGER)

    def select_url_tab(self):
        self.click(self.URL_TAB_TRIGGER)

    def select_file_tab(self):
        self.click(self.FILE_TAB_TRIGGER)

    def enter_text(self, text):
        self.type(self.TEXTAREA, text)

    def get_char_count_text(self):
        return self.get_text(self.CHAR_COUNT_LABEL)

    def click_sample_1(self):
        self.click(self.SAMPLE_1_BUTTON)

    def click_sample_2(self):
        self.click(self.SAMPLE_2_BUTTON)

    def enter_url(self, url):
        self.type(self.URL_INPUT, url)

    def upload_file(self, absolute_path):
        element = self.driver.find_element(*self.FILE_INPUT)
        element.send_keys(absolute_path)

    def click_analyze(self):
        self.click(self.ANALYZE_BUTTON)

    def wait_for_result(self):
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
        
        # Wait for loading to start and then finish
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located(self.RESULT_CONTAINER)
        )
        return self.is_visible(self.RESULT_CONTAINER)
        
    def get_verdict(self):
        return self.get_text(self.VERDICT_LABEL)
