from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class LoginPage(BasePage):
    """
    LoginPage models the authentication screen and related session management functions.
    Supports login attempts, boundary verification, and local token validation checks.
    """
    USERNAME_INPUT = (By.ID, "username")
    PASSWORD_INPUT = (By.ID, "password")
    LOGIN_BUTTON = (By.ID, "login-btn")
    ERROR_MESSAGE = (By.CLASS_NAME, "error-msg")
    LOGOUT_BUTTON = (By.ID, "logout-btn")
    
    def enter_username(self, username):
        self.type(self.USERNAME_INPUT, username)

    def enter_password(self, password):
        self.type(self.PASSWORD_INPUT, password)

    def click_login(self):
        self.click(self.LOGIN_BUTTON)

    def click_logout(self):
        self.click(self.LOGOUT_BUTTON)

    def get_error_text(self):
        return self.get_text(self.ERROR_MESSAGE)

    def login(self, username, password):
        self.enter_username(username)
        self.enter_password(password)
        self.click_login()

    def set_mock_session(self, token_name="auth_token", token_value="mock_jwt_token_123"):
        """
        Sets a mock session token directly in the browser's localStorage for session checks.
        """
        self.driver.execute_script(f"window.localStorage.setItem('{token_name}', '{token_value}');")

    def get_mock_session(self, token_name="auth_token"):
        """
        Reads session token values directly from browser localStorage.
        """
        return self.driver.execute_script(f"return window.localStorage.getItem('{token_name}');")

    def clear_session(self):
        """
        Clears browser storage to simulate logouts.
        """
        self.driver.execute_script("window.localStorage.clear(); window.sessionStorage.clear();")
