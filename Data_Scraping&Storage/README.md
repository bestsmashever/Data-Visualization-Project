# Data Scraping

## Use splinter package to scrape the following variables on Glassdoor website
    - salary
    - company name, city and state
    - job descriptions

## Highlights
    - Design function to close the pop-up window
    - Design function to figure out the last page of each city and continue to the next city

# Data Storage
    - Connect to MongoDB through pymongo and save all the scraping results as document
    - Each document looks like: 
            document = {
                'company_name': company_name,
                'city': city,
                'state': state,
                'salary_low': salary_low,
                'salary_high': salary_high,
                'rating': rating,
                'job_description': job_description
            }
