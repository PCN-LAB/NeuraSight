import sys
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import json
from datetime import datetime

# Load the dataset
dataset_path = sys.argv[1]
# trend = json.loads(sys.argv[2])

# dataset_path = r"C:\FAST\FYP\Motifs\HI-Small_Trans.csv"
trend = "daily"

df = pd.read_csv(dataset_path)

# Convert 'Timestamp' column to datetime format
df["Timestamp"] = pd.to_datetime(df["Timestamp"])

if trend == "daily":
    # Group by timestamp and aggregate counts and sums
    grouped = df.groupby(pd.Grouper(key="Timestamp", freq="D")).agg(
        {
            "Timestamp": "count",  # transaction count
            "Amount Received": "sum",
        }
    )
    # rename
    grouped.columns = ["Transaction Count", "Amount Received"]

elif trend == "hourly":
    # Group by timestamp and aggregate counts and sums
    grouped = df.groupby(pd.Grouper(key="Timestamp", freq="H")).agg(
        {
            "Timestamp": "count",  # transaction count
            "Amount Received": "sum",
        }
    )
    # rename
    grouped.columns = ["Transaction Count", "Amount Received"]

# Convert index to DatetimeIndex and set frequency if not already set
grouped.index = pd.to_datetime(grouped.index)

if trend == "daily":
    grouped = grouped.asfreq("D")  # Set frequency to daily if not already
elif trend == "hourly":
    grouped = grouped.asfreq("H")  # Set frequency to hourly if not already

# remove 0 row values
grouped = grouped[grouped["Transaction Count"] != 0]

# Interpolate missing values
grouped = grouped.interpolate(method="cubic", limit_direction="both")
# Convert negative values to positive
grouped = grouped.abs()
# Reset index to ensure continuous range
grouped = grouped.reset_index()
grouped = grouped.set_index(["Timestamp"])

# apply interpolation to 0 values again


# # Standardize amount values in billions in the same column
# grouped['Amount Received'] = grouped['Amount Received'] / 1e9
# grouped['Amount Paid'] = grouped['Amount Paid'] / 1e9

# # standarrdize count values in thousands
# grouped['Transaction Count'] = grouped['Transaction Count'] / 1e3

# convert to logartihmic but only for non zero values
grouped["Amount Received"] = np.log1p(grouped["Amount Received"])
grouped["Transaction Count"] = np.log1p(grouped["Transaction Count"])
# take only 70% i mean first 70 of the data
grouped = grouped.head(int(len(grouped) * 0.7))

# print amount rec first 5 rows
# print(grouped['Amount Received'].tail())
# print transaction count first 5
# print(grouped['Transaction Count'].head())

# reset timestamp index as column
grouped = grouped.reset_index()


# Custom JSON Encoder to handle Timestamp objects
class TimestampEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)


# make tuple of timestamp and amount received and maintain a list of tuples
amount_data = list(zip(grouped["Timestamp"], grouped["Amount Received"]))
# Convert amount_data to JSON
amount_data_json = json.dumps(amount_data, cls=TimestampEncoder)
print(amount_data_json)

# make tuple of timestamp and transaction count and maintain a list of tuples
count_data = list(zip(grouped["Timestamp"], grouped["Transaction Count"]))
# Convert count_data to JSON
count_data_json = json.dumps(count_data, cls=TimestampEncoder)
print(count_data_json)
