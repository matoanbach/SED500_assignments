
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import random
from bs4 import BeautifulSoup

import time

from selenium.common.exceptions import NoSuchElementException

def test_re_01dot3(driver: webdriver):
    try:
        company_symbol = driver.find_element(By.ID, "symbol")
        return company_symbol.is_displayed()
    except:
        return False

def test_re_01dot5(driver, required_options):
    try: 
        category = driver.find_element(By.ID, "category")
        visible_options = category.find_elements(By.TAG_NAME, "option")
        # selenium gives unreadable objects - need to convert that to text
        options = set([option.text.lower() for option in visible_options])
        
        for option in options:
            if option not in required_options:
                return False
            
        return True
    except:
        return False

def test_re_01dot6(driver):
    try:
        company_symbol = driver.find_element(By.ID, "submit")
        return company_symbol.is_displayed()
    except:
        return False

def test_re_01dot7(driver):
    try:
        company_symbol = driver.find_element(By.ID, "reset")
        return company_symbol.is_displayed()
    except:
        return False

def test_re_02dot2(driver, required_categories):
    try: 
        # Select a stock screener category. 
        category = driver.find_element(By.ID, "category")
        select = Select(category)
        select.select_by_visible_text("Stock screener")

        # find options within the stock screen category
        stock_screener = driver.find_element(By.ID, "stock-screener")
        visible_options = stock_screener.find_elements(By.TAG_NAME, "option")
        
        # selenium gives unreadable objects - need to convert that to text.lowercase()
        options = set([option.text.lower() for option in visible_options])
        
        for option in options:
            if option not in required_categories:
                return False
            
        return True
    except:
        return False

def test_re_02dot3(driver):
    try:
        # Select a stock screener category. 
        category = driver.find_element(By.ID, "category")
        select = Select(category)
        select.select_by_visible_text("Stock screener")


        # locate the value field
        value_selector = driver.find_element(By.ID, "stock-screener-value")
        
        # Enter random values
        for i in range(50):
            value_selector.clear()
            value_selector.send_keys(random.randint(0, 100000))
            time.sleep(0.1)
        
        return True
    except:
        return False

def test_re_03(driver):
    try:
        # Select a stock screener category. 
        category = driver.find_element(By.ID, "category")
        select = Select(category)
        select.select_by_visible_text("Stock screener")

        # locate and click the submit button
        submit_button_selector = driver.find_element(By.ID, "submit")
        submit_button_selector.click()
        
        # wait for the page to load
        time.sleep(5)
        
        # see if data is visible in UI
        data_selector = driver.find_element(By.ID, "data")
        return data_selector.is_displayed()
    except:
        return False

def test_re_08(driver: webdriver):
    try:
        # Select a stock screener category. 
        category = driver.find_element(By.ID, "category")
        select = Select(category)
        select.select_by_visible_text("Stock screener")

        # locate and click the submit button
        submit_button_selector = driver.find_element(By.ID, "submit")
        submit_button_selector.click()
        
        # wait for the page to load
        time.sleep(5)
        
        # locate and click the set button
        reset_button_selector = driver.find_element(By.ID, "reset")
        reset_button_selector.click()
        
        # wait for the page to load
        time.sleep(5)
        
        # open original html file
        f = open("StockPicker.html")
                
        # html passers
        original_soup = BeautifulSoup(f.read(), features="html.parser")
        current_soup = BeautifulSoup(driver.page_source, features="html.parser")
        
        # select the stock search UI
        original_search_form = original_soup.select("form")
        current_search_form = current_soup.select("form")
        
        return original_search_form == current_search_form
    except:
        return False