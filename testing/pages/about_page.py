from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class AboutPage(BasePage):
    """
    AboutPage models capabilities sections and links in the Info screen.
    """
    HEADER_TITLE = (By.XPATH, "//h1[contains(text(), 'About')]")
    CAPABILITY_LIST_ITEMS = (By.XPATH, "//li[contains(., 'BERT') or contains(., 'Explainable') or contains(., 'credibility') or contains(., 'History')]")
    TRY_ANALYZER_BUTTON = (By.XPATH, "//a[contains(text(), 'Try the analyzer')]")
    SEE_DASHBOARD_BUTTON = (By.XPATH, "//a[contains(text(), 'See the dashboard')]")

    def is_title_visible(self):
        return self.is_visible(self.HEADER_TITLE)

    def get_capabilities_count(self):
        try:
            return len(self.find_elements(self.CAPABILITY_LIST_ITEMS))
        except:
            return 0

    def click_try_analyzer(self):
        self.click(self.TRY_ANALYZER_BUTTON)

    def click_see_dashboard(self):
        self.click(self.SEE_DASHBOARD_BUTTON)
