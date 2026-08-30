import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def test_rendering():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1400,1100")

    driver = webdriver.Chrome(options=chrome_options)
    try:
        url = "http://localhost:5173/"
        driver.get(url)
        time.sleep(2)

        # Find Tottenham or Liverpool card
        buttons = driver.find_elements(By.XPATH, "//div[contains(., '토트넘') or contains(., '리버풀') or contains(., '시미즈')]//span[contains(text(), '상세보기')] | //div[contains(., '토트넘') or contains(., '리버풀') or contains(., '시미즈')]//button[contains(text(), '상세보기')]")
        if not buttons:
            buttons = driver.find_elements(By.XPATH, "//span[contains(text(), '상세보기')] | //button[contains(text(), '상세보기')]")
        
        print(f"Found {len(buttons)} target buttons.")
        if buttons:
            buttons[0].click()
            time.sleep(1)
            driver.save_screenshot("verified_epl_fact_modal.png")
            print("Saved verified_epl_fact_modal.png successfully!")

    except Exception as e:
        print("Error during test:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_rendering()
