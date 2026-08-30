import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def check_browser():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

    driver = webdriver.Chrome(options=chrome_options)
    try:
        url = "http://localhost:5173/"
        print(f"Navigating to {url}...")
        driver.get(url)
        driver.implicitly_wait(5)
        
        # Get console logs
        logs = driver.get_log('browser')
        print(f"Browser Console Logs ({len(logs)}):")
        for log in logs:
            print(f"[{log['level']}] {log['message']}")
            
        page_source = driver.page_source
        print(f"Page Source length: {len(page_source)}")
        
        driver.save_screenshot("localhost_screenshot.png")
        print("Saved screenshot to localhost_screenshot.png")

    except Exception as e:
        print("Error checking browser:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    check_browser()
