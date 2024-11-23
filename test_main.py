from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import random

# Import test functions
from tests import (
    test_re_01dot3,
    test_re_01dot5,
    test_re_01dot6,
    test_re_01dot7,
    test_re_02dot2,
    test_re_02dot3,
    test_re_03,
    test_re_08
)

# Helper function to run each test with formatted output
def run_test(test_name, test_func, *args, **kwargs):
    loading_icon = "⏳"
    check_icon = "✅"
    cross_icon = "❌"

    # Print the test name with the loading icon
    print(f"{test_name}: Running {loading_icon}", end="\r")
    time.sleep(random.uniform(0.5, 1.5))  # Simulate loading

    # Run the test and capture the result
    result = test_func(*args, **kwargs)

    # Determine pass/fail icon and result text
    result_text = "Passed" if result else "Failed"
    icon = check_icon if result else cross_icon

    # Print the final test result
    print(f"{test_name}: Done - Result: {result_text} {icon}")

try:
    driver = webdriver.Firefox()
    driver.get("http://127.0.0.1:5500/StockPicker.html")
    
    # Run tests with formatted output
    run_test("Test RE-01.3", test_re_01dot3, driver=driver)
    run_test("Test RE-01.5", test_re_01dot5, driver=driver, required_options=set([
        "income statement",
        "balance sheet statement",
        "cash flow statement",
        "financial statements as reported on SEC",
        "financial ratios",
        "key metrics",
        "enterprise value",
        "financial statements growth",
        "discounted cash flow value",
        "rating",
        "market capitalization",
        "stock screener",
        "real-time quotes",
        "ticker search",
        "company profile",
        "daily stock dividend"
    ]))
    run_test("Test RE-01.6", test_re_01dot6, driver=driver)
    run_test("Test RE-01.7", test_re_01dot7, driver=driver)
    run_test("Test RE-02.2", test_re_02dot2, driver=driver, required_categories=set([
        "market capitalization, more than",
        "market capitalization, less than",
        "beta, more than",
        "beta, less than",
        "dividend yield, more than",
        "dividend yield, less than",
        "average volume, more than",
        "average volume, less than"
    ]))
    run_test("Test RE-02.3", test_re_02dot3, driver=driver)
    run_test("Test RE-03", test_re_03, driver=driver)
    run_test("Test RE-08", test_re_08, driver=driver)

except Exception as e:
    print("An error occurred during testing:", e)

finally:
    driver.quit()
