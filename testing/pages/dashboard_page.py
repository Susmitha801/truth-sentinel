from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class DashboardPage(BasePage):
    """
    DashboardPage maps stats metrics, tables, and Recharts containers.
    """
    STATS_TOTAL = (By.XPATH, "//*[contains(text(), 'Total analyzed')]/..//div[contains(@class, 'bold')]")
    STATS_REAL = (By.XPATH, "//*[contains(text(), 'Real')]/..//div[contains(@class, 'bold')]")
    STATS_FAKE = (By.XPATH, "//*[contains(text(), 'Fake')]/..//div[contains(@class, 'bold')]")
    STATS_SUSPICIOUS = (By.XPATH, "//*[contains(text(), 'Suspicious')]/..//div[contains(@class, 'bold')]")
    
    RECENT_TABLE = (By.XPATH, "//table")
    RECENT_TABLE_ROWS = (By.XPATH, "//table/tbody/tr")
    
    EMPTY_STATE_TITLE = (By.XPATH, "//*[contains(text(), 'No analyses yet')]")
    NEW_ANALYSIS_BUTTON = (By.XPATH, "//a[contains(text(), 'New analysis')]")

    def get_total_analyzed_count(self):
        return int(self.get_text(self.STATS_TOTAL))

    def get_real_count(self):
        return int(self.get_text(self.STATS_REAL))

    def get_fake_count(self):
        return int(self.get_text(self.STATS_FAKE))

    def get_suspicious_count(self):
        return int(self.get_text(self.STATS_SUSPICIOUS))

    def get_table_rows_count(self):
        try:
            return len(self.find_elements(self.RECENT_TABLE_ROWS))
        except:
            return 0

    def click_new_analysis(self):
        self.click(self.NEW_ANALYSIS_BUTTON)

    def is_empty_state_visible(self):
        return self.is_visible(self.EMPTY_STATE_TITLE)
