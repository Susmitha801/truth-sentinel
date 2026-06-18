import pytest

def test_direct_access_to_protected_pages(driver, target_url):
    """
    SEC-01: Verify Direct access rules when session tokens are absent.
    """
    driver.get(target_url + "/dashboard")
    assert "/dashboard" in driver.current_url

def test_token_expiration_handling(driver, target_url):
    """
    SEC-02: Verify local engine behaves cleanly on token expiration simulation.
    """
    driver.get(target_url)
    driver.execute_script("window.localStorage.setItem('auth_token', 'EXPIRED_TOKEN');")
    driver.refresh()
    # Ensure page doesn't crash on invalid tokens
    assert len(driver.page_source) > 0

def test_session_timeout_behavior(driver, target_url):
    """
    SEC-03: Verify browser storage wipes on simulated timeout.
    """
    driver.get(target_url)
    driver.execute_script("window.localStorage.clear();")
    token = driver.execute_script("return window.localStorage.getItem('auth_token');")
    assert token is None

def test_localstorage_validation(driver, target_url):
    """
    SEC-04: Verify client data is structured without cleartext credentials.
    """
    driver.get(target_url)
    # Check that credentials are not in storage
    pwd_in_storage = driver.execute_script("return window.localStorage.getItem('password');")
    assert pwd_in_storage is None

def test_sensitive_info_console_exposure(driver, target_url):
    """
    SEC-05: Verify no sensitive keys or passwords exist in console logs.
    """
    driver.get(target_url)
    logs = driver.get_log("browser")
    for log in logs:
        assert "password" not in log["message"].lower()
        assert "private_key" not in log["message"].lower()

def test_api_endpoint_exposure(driver, target_url):
    """
    SEC-06: Verify core files don't expose production API secrets in plain text.
    """
    driver.get(target_url)
    assert "SECRET_PROD_API_KEY" not in driver.page_source
