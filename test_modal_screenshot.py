import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def test_modal_click():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1400,1000")

    driver = webdriver.Chrome(options=chrome_options)
    try:
        url = "http://localhost:5173/"
        driver.get(url)
        time.sleep(2)

        # Find and click the first "상세보기" button
        detail_buttons = driver.find_elements(By.XPATH, "//span[contains(text(), '상세보기')] | //button[contains(text(), '상세보기')]")
        print(f"Found {len(detail_buttons)} detail buttons.")
        if detail_buttons:
            detail_buttons[0].click()
            time.sleep(1)
            driver.save_screenshot("modal_screenshot.png")
            print("Saved modal_screenshot.png successfully!")

    except Exception as e:
        print("Error clicking modal:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_modal_click()
