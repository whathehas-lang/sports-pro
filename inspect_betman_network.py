import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def find_betman_api():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    chrome_options.set_capability('goog:loggingPrefs', {'performance': 'ALL'})

    driver = webdriver.Chrome(options=chrome_options)
    try:
        url = "https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do?gmId=G101&gmTs=260102"
        print(f"Loading {url}...")
        driver.get(url)
        time.sleep(6)

        # Inspect network logs
        logs = driver.get_log('performance')
        api_urls = []
        for entry in logs:
            msg = json.loads(entry['message'])['message']
            if msg['method'] == 'Network.requestWillBeSent':
                req_url = msg['params']['request']['url']
                if 'betman.co.kr' in req_url and ('.do' in req_url or 'json' in req_url or 'ajax' in req_url or 'data' in req_url):
                    api_urls.append({
                        'url': req_url,
                        'method': msg['params']['request']['method']
                    })

        print("Captured API / .do URLs:", json.dumps(api_urls[:15], indent=2))

        # Check all table elements or div elements containing match info
        match_rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr, .tbl_game tr, .game_list tr, .slip_list tr, .list_body tr")
        print(f"Match rows with specific CSS selectors: {len(match_rows)}")

        # Check page text snippet
        body_text = driver.find_element(By.TAG_NAME, "body").text
        print(f"Body text length: {len(body_text)}")
        with open("betman_body_text.txt", "w", encoding="utf-8") as f:
            f.write(body_text)

    except Exception as e:
        print("Error:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    find_betman_api()
