import requests
import csv
from datetime import datetime
import time

# Your CryptoCompare API key
api_key = '7a9cade21d9ecaa5d7da35f78450520549f47ca07e724c58d184985ba6c2962c'

# Define the endpoint and parameters
symbol = 'BTC'
comparison_symbol = 'USD'
limit = 2000  # Max number of days per request
aggregate = 1  # Daily data

print("Starting the data fetching process...")

# Prepare the CSV file and write the header
output_file = 'Bitcoin_Historical_Price_Volume.csv'
with open(output_file, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Date', 'Close Price', 'Volume'])

# Loop to get data in chunks
to_date = int(time.time())  # current timestamp
request_count = 0

while True:
    print(f"Preparing to fetch data up to timestamp: {to_date}")
    url = f'https://min-api.cryptocompare.com/data/v2/histoday?fsym={symbol}&tsym={comparison_symbol}&limit={limit}&aggregate={aggregate}&toTs={to_date}&api_key={api_key}'
    response = requests.get(url)
    data = response.json()
    request_count += 1
    
    if data['Response'] != 'Success':
        raise ValueError('Error fetching data from CryptoCompare API')

    print(f"Request {request_count} completed. Fetched {len(data['Data']['Data'])} days of data.")
    
    # Write the new data to the CSV file
    with open(output_file, mode='a', newline='') as file:
        writer = csv.writer(file)
        for entry in data['Data']['Data']:
            try:
                date = datetime.fromtimestamp(entry['time']).strftime('%Y-%m-%d')
            except (OSError, ValueError):
                print(f"Invalid timestamp {entry['time']}, skipping entry.")
                continue
            
            close_price = entry['close']
            volume = entry['volumefrom']
            
            # Debugging statements to check the fetched data
            print(f"Date: {date}, Close Price: {close_price}, Volume: {volume}")
            
            writer.writerow([date, close_price, volume])
        print(f"Written {len(data['Data']['Data'])} new rows to {output_file}")

    # Break if we have fetched all available data
    if len(data['Data']['Data']) < limit:
        print("Fetched all available data.")
        break
    
    # Update to_date to the last timestamp minus one day
    to_date = data['Data']['Data'][0]['time'] - 86400

print(f"Data fetching and writing process completed. Data has been written to {output_file}")
