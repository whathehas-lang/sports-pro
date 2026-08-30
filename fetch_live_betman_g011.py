import time
import json
import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

sys.stdout.reconfigure(encoding='utf-8')

def fetch_betman_g011():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1400,1100")

    driver = webdriver.Chrome(options=chrome_options)
    url = "https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do?gmId=G011&gmTs=260048"
    print(f"Fetching from: {url}")
    try:
        driver.get(url)
        time.sleep(3)

        # Look for table rows or match list
        rows = driver.find_elements(By.CSS_SELECTOR, "tr, .game_list tr, .bet_table tr, table tbody tr")
        print(f"Found {len(rows)} potential table rows.")

        matches = []
        # Save page source and screenshot to examine table structure
        with open("betman_g011_page.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)

        driver.save_screenshot("betman_g011_live.png")
        print("Saved betman_g011_live.png and betman_g011_page.html")

    except Exception as e:
        print("Error fetching Betman:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    fetch_betman_g011()
