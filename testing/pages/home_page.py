from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class HomePage(BasePage):
    """
    HomePage maps to the primary landing screen, incorporating navbar controls,
    theme switches, and layout blocks.
    """
    ANALYZE_NAV_LINK = (By.XPATH, "//a[contains(@href, '/analyze')]")
    DASHBOARD_NAV_LINK = (By.XPATH, "//a[contains(@href, '/dashboard')]")
    HISTORY_NAV_LINK = (By.XPATH, "//a[contains(@href, '/history')]")
    ABOUT_NAV_LINK = (By.XPATH, "//a[contains(@href, '/about')]")
    LOGO_LINK = (By.XPATH, "//a[contains(., 'Fake News Shield') or contains(., 'Truth Sentinel')]")
    THEME_TOGGLE_BUTTON = (By.XPATH, "//button[contains(@class, 'theme') or @aria-label='Toggle theme' or contains(@class, 'nav')]/..//button")
    
    ANALYZE_HERO_BUTTON = (By.XPATH, "//main//a[contains(text(), 'Analyze a story')]")
    DASHBOARD_HERO_BUTTON = (By.XPATH, "//main//a[contains(text(), 'View dashboard')]")
    
    def click_analyze_nav(self):
        self.click(self.ANALYZE_NAV_LINK)

    def click_dashboard_nav(self):
        self.click(self.DASHBOARD_NAV_LINK)

    def click_history_nav(self):
        self.click(self.HISTORY_NAV_LINK)

    def click_about_nav(self):
        self.click(self.ABOUT_NAV_LINK)

    def click_logo(self):
        self.click(self.LOGO_LINK)

    def toggle_theme(self):
        self.click(self.THEME_TOGGLE_BUTTON)

    def click_analyze_hero(self):
        self.click(self.ANALYZE_HERO_BUTTON)

    def click_dashboard_hero(self):
        self.click(self.DASHBOARD_HERO_BUTTON)
