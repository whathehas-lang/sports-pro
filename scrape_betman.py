import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrape_betman():
    url = "https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do?gmId=G101&gmTs=260102"
    print(f"Opening headless Chrome for URL: {url}")

    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

    driver = webdriver.Chrome(options=chrome_options)

    try:
        driver.get(url)
        print("Page loaded. Waiting 5 seconds for AJAX data...")
        time.sleep(5)

        # Scroll down to load all dynamic content
        print("Scrolling down page...")
        for i in range(10):
            driver.execute_script("window.scrollBy(0, 1000);")
            time.sleep(0.5)

        # Extract all table rows or match elements
        page_source = driver.page_source
        print(f"Page Source Length: {len(page_source)}")

        # Save HTML for inspection
        with open("betman_scraped_live.html", "w", encoding="utf-8") as f:
            f.write(page_source)

        # Try to locate game rows
        rows = driver.find_elements(By.TAG_NAME, "tr")
        print(f"Total TR elements found: {len(rows)}")

        matches = []
        for idx, row in enumerate(rows):
            text = row.text.strip()
            if text and ("vs" in text.lower() or "VS" in text or "승" in text or "패" in text):
                matches.append({
                    "row_index": idx,
                    "text": text
                })

        print(f"Extracted matches count: {len(matches)}")
        with open("betman_scraped_matches.json", "w", encoding="utf-8") as f:
            json.dump(matches, f, ensure_ascii=False, indent=2)

    except Exception as e:
        print("Error during scraping:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_betman()
