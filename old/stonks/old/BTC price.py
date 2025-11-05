import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import requests
import seaborn as sns
import sqlite3
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split


def create_time_feature(df):
    df['dayofmonth'] = df['date'].dt.day
    df['dayofweek'] = df['date'].dt.dayofweek
    df['quarter'] = df['date'].dt.quarter
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    df['dayofyear'] = df['date'].dt.dayofyear
    df['weekofyear'] = df['date'].dt.weekofyear
    return df


def read_data_from_database(path):
    # Read data from local sqlite database
    conn = sqlite3.connect(path)
    query = "SELECT * FROM events"
    df = pd.read_sql_query(query, conn)
    conn.close()

    return df


def write_data_to_database(df, path):
    # Write data to local sqlite database
    conn = sqlite3.connect(path)
    df.to_sql('events', conn, if_exists='append', index=False)
    conn.close()


def read_data_from_api():
    # Read data from API
    url = 'https://api.coindesk.com/v1/bpi/historical/close.json'
    response = requests.get(url)
    data = response.json()
    df = pd.DataFrame(data)
    return df


def fetchAndStoreData():
    # Read data from API
    df = read_data_from_api()

    # Write data to database
    write_data_to_database(df, 'data.db')


def train_model():
    # Read data from database
    df = read_data_from_database('data.db')

    # Create time features
    df['date'] = pd.to_datetime(df['date'])
    df = create_time_feature(df)

    # Train test split
    x = df[['dayofmonth', 'dayofweek', 'quarter', 'month', 'year', 'dayofyear', 'weekofyear']]
    y = df['price']
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

    # Train model
    model = LinearRegression()
    model.fit(x_train, y_train)

    # Predict
    y_pred = model.predict(x_test)

    # Evaluate
    mse = mean_squared_error(y_test, y_pred)
    print(f'Mean Squared Error: {mse}')

    # Plot
    plt.figure(figsize=(10, 6))
    sns.lineplot(x=x_test['date'], y=y_test, label='Actual')
    sns.lineplot(x=x_test['date'], y=y_pred, label='Predicted')
    plt.legend()
    plt.show()


def series_to_supervised(data, n_in=1, n_out=1, dropnan=True):
    """
    Frame a time series as a supervised learning dataset.
    Arguments:
    data: Sequence of observations as a list or NumPy array.
    n_in: Number of lag observations as input (X).
    n_out: Number of observations as output (y).
    dropnan: Boolean whether or not to drop rows with NaN values.
    Returns:
    Pandas DataFrame of series framed for supervised learning.
    """
    n_vars = 1 if type(data) is list else data.shape[1]
    df = pd.DataFrame(data)
    cols = list()

    # input sequence (t-n, ... t-1)
    for i in range(n_in, 0, -1):
        cols.append(df.shift(i))

    # forecast sequence (t, t+1, ... t+n)
    for i in range(0, n_out):
        cols.append(df.shift(-i))

    # put it all together
    agg = pd.concat(cols, axis=1)

    # drop rows with NaN values
    if dropnan:
        agg.dropna(inplace=True)

    return agg.values


if __name__ == "__main__":
    print("""Selection:
    1. Read new data from API and write to database
    2. Train model and evaluate score
""")

    selection = input("Enter your selection: ")

    if selection == '1':
        fetchAndStoreData()
    elif selection == '2':
        train_model()
