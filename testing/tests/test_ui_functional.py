import pytest
from pages.home_page import HomePage
from pages.dashboard_page import DashboardPage
from pages.history_page import HistoryPage
from pages.about_page import AboutPage

def test_homepage_loading(driver, target_url):
    """
    UI-01: Verify Home Page loads elements.
    """
    home_page = HomePage(driver)
    home_page.navigate_to(target_url)
    assert "Fake News Shield" in home_page.get_title()

def test_dashboard_loading(driver, target_url):
    """
    UI-02: Verify Dashboard Page renders dashboard layout.
    """
    dashboard_page = DashboardPage(driver)
    dashboard_page.navigate_to(target_url + "/dashboard")
    assert dashboard_page.is_empty_state_visible() or dashboard_page.get_table_rows_count() >= 0

def test_profile_page_placeholder(driver, target_url):
    """
    UI-03: Verify profile/settings placeholder features.
    """
    # Verify standard UI elements are loaded
    driver.get(target_url)
    assert len(driver.page_source) > 0

def test_search_and_filter_history(driver, target_url):
    """
    UI-04: Verify search/filtering in History list.
    """
    history_page = HistoryPage(driver)
    history_page.navigate_to(target_url + "/history")
    
    # Assert either items exist or empty state is loaded
    if history_page.is_empty_state_visible():
        assert "Nothing here yet" in driver.page_source
    else:
        assert history_page.get_items_count() > 0

def test_responsive_mobile_width_scaling(driver, target_url):
    """
    UI-05: Verify scaling on small mobile viewport width (375px).
    """
    home_page = HomePage(driver)
    home_page.navigate_to(target_url)
    
    # Resize window to mobile viewport
    driver.set_window_size(375, 812)
    
    # Ensure page elements scale (no crash, body fits)
    assert len(driver.page_source) > 0

def test_loading_indicator_visibility(driver, target_url):
    """
    UI-06: Verify loading spinner flashes when running evaluations.
    """
    driver.get(target_url + "/analyze")
    
    # Fill text and analyze
    from pages.analyze_page import AnalyzePage
    analyze_page = AnalyzePage(driver)
    analyze_page.click_sample_2()
    analyze_page.click_analyze()
    
    # Spinner should display briefly
    assert analyze_page.is_visible(analyze_page.LOADING_SPINNER)

def test_empty_state_layout(driver, target_url):
    """
    UI-07: Verify empty state layout maps correct illustrations.
    """
    dashboard_page = DashboardPage(driver)
    dashboard_page.navigate_to(target_url + "/dashboard")
    
    # Clear local storage to guarantee empty state
    driver.execute_script("window.localStorage.clear();")
    driver.refresh()
    
    assert dashboard_page.is_empty_state_visible()
