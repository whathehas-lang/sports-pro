import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def test_bournemouth_section2():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1400,1200")

    driver = webdriver.Chrome(options=chrome_options)
    try:
        url = "http://localhost:5173/"
        driver.get(url)
        time.sleep(2)

        # 1. Click G011 tab
        g011_btn = driver.find_elements(By.XPATH, "//button[contains(., '축구 승무패') or contains(., 'G011')]")
        if g011_btn:
            driver.execute_script("arguments[0].click();", g011_btn[0])
            time.sleep(1.5)

        # 2. Click "상세보기"
        detail_buttons = driver.find_elements(By.XPATH, "//span[contains(text(), '상세보기')] | //button[contains(text(), '상세보기')]")
        if detail_buttons:
            driver.execute_script("arguments[0].click();", detail_buttons[0])
            time.sleep(1.5)

            # Scroll inside modal to Section 2
            driver.execute_script("""
                const modalBody = document.querySelector('.overflow-y-auto, [class*="overflow-y"]');
                if (modalBody) {
                    modalBody.scrollTop = 550;
                }
            """)
            time.sleep(1.5)
            driver.save_screenshot("verified_bournemouth_section2.png")
            print("Saved verified_bournemouth_section2.png successfully!")

    except Exception as e:
        print("Error during test:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_bournemouth_section2()
