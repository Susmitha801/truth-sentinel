from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class HistoryPage(BasePage):
    """
    HistoryPage models history selection sidebars and wiping options.
    """
    CLEAR_BUTTON = (By.XPATH, "//button[contains(., 'Clear')]")
    HISTORY_ITEMS = (By.XPATH, "//main//button[contains(@class, 'text-left')]")
    EMPTY_STATE_TITLE = (By.XPATH, "//*[contains(text(), 'Nothing here yet')]")
    SELECTED_RESULT_CARD = (By.ID, "result")
    
    def click_clear(self):
        self.click(self.CLEAR_BUTTON)

    def get_items_count(self):
        try:
            return len(self.find_elements(self.HISTORY_ITEMS))
        except:
            return 0

    def click_item_at_index(self, index):
        items = self.find_elements(self.HISTORY_ITEMS)
        if index < len(items):
            items[index].click()

    def is_empty_state_visible(self):
        return self.is_visible(self.EMPTY_STATE_TITLE)

    def is_result_card_visible(self):
        return self.is_visible(self.SELECTED_RESULT_CARD)
