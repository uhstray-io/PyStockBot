import time
import requests
import pandas as pd
from datetime import datetime

# Your CryptoCompare API key
api_key = '7a9cade21d9ecaa5d7da35f78450520549f47ca07e724c58d184985ba6c2962c'

# Define the endpoint and parameters
symbol = 'BTC'
comparison_symbol = 'USD'
limit = 2000  # Max number of days per request
aggregate = 1  # Daily data

print("Starting the data fetching process...")

# Prepare an empty DataFrame
df = pd.DataFrame(columns=['Date', 'Close Price', 'Volume'])

# Loop to get data in chunks
to_date = int(time.time())  # current timestamp
request_count = 0

while True:
    print(f"Preparing to fetch data up to timestamp: {to_date}")
    url = f'https://min-api.cryptocompare.com/data/v2/histoday?fsym={symbol}&tsym={comparison_symbol}&limit={limit}&aggregate={aggregate}&toTs={to_date}&api_key={api_key}'
    response = requests.get(url)
    response_json = response.json()
    request_count += 1

    if response_json['Response'] != 'Success':
        raise ValueError('Error fetching data from CryptoCompare API')

    print(f"Request {request_count} completed. Fetched {len(response_json['Data']['Data'])} days of data.")
    # Process and append the new data to the DataFrame
    new_data = []
    
    data = response_json['Data']['Data']
        
    for entry in data:
        try:
            date = datetime.fromtimestamp(entry['time']).strftime('%Y-%m-%d')
        except (OSError, ValueError):
            print(f"Invalid timestamp {entry['time']}, skipping entry.")
            continue

        close_price = entry['close']
        volume = entry['volumefrom']

        # Append new data to list
        new_data.append([date, close_price, volume])
        # Debugging statements to check the fetched data
        print(f"Date: {date}, Close Price: {close_price}, Volume: {volume}")

    # Convert list to DataFrame and concatenate with the main DataFrame
    df_new = pd.DataFrame(new_data, columns=['Date', 'Close Price', 'Volume'])
    df = pd.concat([df, df_new], ignore_index=True)
    print(f"Added {len(new_data)} new rows to DataFrame")

    # Break if we have fetched all available data
    if len(df) > limit:
        print("Fetched all available data.")
        break

    # Update to_date to the last timestamp minus one day
    to_date = response_json['Data']['Data'][0]['time'] - 86400

# Save the DataFrame to a CSV file
output_file = 'Bitcoin_Historical_Price_Volume2.csv'
df.to_csv(output_file, index=False)

print(f"Data fetching and writing process completed. Data has been written to {output_file}")
