# import dependencies
import pandas as pd
import requests
from bs4 import BeautifulSoup
from splinter import Browser
from splinter.exceptions import ElementDoesNotExist
import re
import time
from tqdm import tqdm
import pymongo
from pymongo import MongoClient

# PyMongo Set Up
# Initialize PyMongo to work with MongoDBs
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

# define database
db = client.glassdoor_db

# define the collection name
collection = db.glassdoor_listings

# set the chromedriver path
executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
browser = Browser("chrome", **executable_path, headless=False)

# city urls
phoenix_url = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=Data+Scientist&sc.keyword=Data+Scientist&locT=C&locId=1133904&jobType="
portland_url = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=Data+Scientist&sc.keyword=Data+Scientist&locT=C&locId=1151614&jobType="
houston_url = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=Data+Scientist&sc.keyword=Data+Scientist&locT=C&locId=1140171&jobType="
seattle_url = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=Data+Scientist&sc.keyword=Data+Scientist&locT=C&locId=1150505&jobType="
sanfrancisco_url = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=Data+Scientist&sc.keyword=Data+Scientist&locT=C&locId=1147401&jobType="
austin_url = "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=Data%20Scientist&locT=C&locId=1139761&locKeyword=Austin, %20TX&srs=RECENT_SEARCHES"
sanjose_url = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=Data+Scientist&sc.keyword=Data+Scientist&locT=C&locId=1147436&jobType="
boston_url = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=Data+Scientist&sc.keyword=Data+Scientist&locT=C&locId=1154532&jobType="
washington_url = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=Data+Scientist&sc.keyword=Data+Scientist&locT=C&locId=1138213&jobType="
philadelphia_url = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=Data+Scientist&sc.keyword=Data+Scientist&locT=C&locId=1152672&jobType="

city_urls = [phoenix_url,
            portland_url,
            houston_url,
            seattle_url,
            sanfrancisco_url,
            austin_url,
            sanjose_url,
            boston_url,
            washington_url,
            philadelphia_url]

# web-scraping functions
def close_modal():
    if len(browser.find_by_css(".xBtn")):
        browser.find_by_css(".xBtn")[0].click()

def is_last_page():
    if len(browser.find_by_css("li.page.current.last")):
        return True
    return False

def next_page():
    try:
        next_pages = browser.find_by_css("li.next")
        next_pages[0].click()
        return True
    except:
        return False

def save_results():
    results = browser.find_by_xpath(xpath)
    for res in results:
        try:
            # use this to grab different job descriptions
            res.click()
            close_modal()
            time.sleep(2)
            
            # collect the salary data and translate them into integers
            salary_info = res.find_by_css("div:nth-child(3) > div:nth-child(1) > span").text
            salary_low = int(salary_info.split('-')[0].split('k')[0].split('$')[1]) * 1000
            salary_high = int(salary_info.split('-')[1].split('k')[0].split('$')[1]) * 1000

            # gather company_name, city and state
            company_info = res.find_by_css("div.flexbox.empLoc > div").text
            company_name = company_info.split('–')[0]
            city = company_info.split('–')[1].split(',')[0]
            state = company_info.split('–')[1].split(',')[1]

            # make the rating float number
            rating = float(res.find_by_css("div.logoWrap > span").text)

            # gather the job_description information
            job_description = browser.find_by_id("JobDescriptionContainer").text

            # save data into mongodb
            posting = {
                'company_name': company_name,
                'city': city,
                'state': state,
                'salary_low': salary_low,
                'salary_high': salary_high,
                'rating': rating,
                'job_description': job_description
            }
            
            collection.insert_one(posting)
            
        except:
            pass

# scrape the data
for city_url in tqdm(city_urls):

    browser.visit(city_url)
    xpath = "//*[@id='MainCol']/div/ul/li"

    last_page = False
    counter = 0
    while not last_page:
        if is_last_page(): 
                last_page = True
        close_modal()
        print(f"Processing Page {counter+1}")
        save_results()
        counter += 1
        if not next_page():
            last_page = True

# to csv