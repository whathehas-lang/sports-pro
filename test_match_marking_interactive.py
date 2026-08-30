import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def test_marking():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1440,1100")

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

        # 2. Find and click [홈승], [무승부] on match 1, [원정승] on match 2
        win_btns = driver.find_elements(By.XPATH, "//button[contains(., '[홈승]')]")
        draw_btns = driver.find_elements(By.XPATH, "//button[contains(., '[무승부]')]")
        lose_btns = driver.find_elements(By.XPATH, "//button[contains(., '[원정승]')]")

        if win_btns:
            driver.execute_script("arguments[0].click();", win_btns[0]) # Match 1 승
            time.sleep(0.5)
        if draw_btns:
            driver.execute_script("arguments[0].click();", draw_btns[0]) # Match 1 무 (복식!)
            time.sleep(0.5)
        if len(lose_btns) > 1:
            driver.execute_script("arguments[0].click();", lose_btns[1]) # Match 2 패
            time.sleep(0.5)

        time.sleep(1)
        driver.save_screenshot("verified_match_marking_interactive.png")
        print("Saved verified_match_marking_interactive.png successfully!")

    except Exception as e:
        print("Error during test:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_marking()
