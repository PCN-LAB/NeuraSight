from datetime import datetime
import sys
import numpy as np
import pandas as pd
import matplotlib.pylab as plt

# %matplotlib inline
from matplotlib.pylab import rcParams
from statsmodels.tsa.stattools import adfuller

# !pip install pmdarima --quiet
import pmdarima as pm
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.arima.model import ARIMA
import json

import warnings

warnings.filterwarnings("ignore")

dataset_path = sys.argv[1]
trend = sys.argv[2]

# dataset_path = "C:\FAST\FYP\Motifs\HI-Small_Trans.csv"
# trend = "daily"

# ---------------------------------------------------LOADING DATASET-------------
df = pd.read_csv(dataset_path)
# Step 1: Convert 'Timestamp' column to datetime object
df["Timestamp"] = pd.to_datetime(df["Timestamp"])

# ---------------------------------------------------HOURLY DATA-------------
if trend == "hourly":
    # Step 2: Aggregate data on hourly basis and adjust timestamp format
    trend_df = (
        df.groupby(df["Timestamp"].dt.strftime("%Y-%m-%d %H"))
        .agg({"Amount Paid": "sum", "Amount Received": "sum"})
        .reset_index()
    )
    # Step 3: Add ':00' to the timestamp column
    trend_df["Timestamp"] = trend_df["Timestamp"] + ":00"
    # Step 4: Add transaction count
    trend_df["Transaction Count"] = (
        df.groupby(df["Timestamp"].dt.strftime("%Y-%m-%d %H"))
        .size()
        .reset_index(name="Transaction Count")["Transaction Count"]
    )

# ---------------------------------------------------DAILY DATA-------------
elif trend == "daily":
    # Step 2: Aggregate data on daily basis and adjust timestamp format
    trend_df = (
        df.groupby(df["Timestamp"].dt.strftime("%Y-%m-%d"))
        .agg({"Amount Paid": "sum", "Amount Received": "sum"})
        .reset_index()
    )
    # Step 3: Add transaction count
    trend_df["Transaction Count"] = (
        df.groupby(df["Timestamp"].dt.strftime("%Y-%m-%d"))
        .size()
        .reset_index(name="Transaction Count")["Transaction Count"]
    )

# Step 5: Rename the columns and display the sample row
trend_df.columns = [
    "Timestamp",
    "Total Amount Paid",
    "Total Amount Received",
    "Transaction Count",
]
# trend_df
# string to date format
trend_df = trend_df.set_index(["Timestamp"])
# trend_df

# Convert index to DatetimeIndex and set frequency if not already set
trend_df.index = pd.to_datetime(trend_df.index)

if trend == "daily":
    trend_df = trend_df.asfreq("D")  # Set frequency to daily if not already
    m_value = 7
elif trend == "hourly":
    trend_df = trend_df.asfreq("H")  # Set frequency to hourly if not already
    m_value = 24

# Interpolate missing values
trend_df = trend_df.interpolate(method="cubic", limit_direction="both")
# Convert negative values to positive
trend_df = trend_df.abs()

# Reset index to ensure continuous range
trend_df = trend_df.reset_index()
trend_df = trend_df.set_index(["Timestamp"])
# trend_df

# # Apply logarithmic transformation to the columns
trend_df[["Total Amount Paid", "Total Amount Received", "Transaction Count"]] = (
    np.log1p(
        trend_df[["Total Amount Paid", "Total Amount Received", "Transaction Count"]]
    )
)
# trend_df

# test train split
train_df = trend_df.iloc[: int(len(trend_df) * 0.7)]
test_df = trend_df.iloc[int(len(trend_df) * 0.7) :]
start = test_df.index[0]  # Start prediction from the first date in the test data
end = test_df.index[-1]  # End prediction at the last date in the test data
# len(test_df), len(train_df)

# Extract hour of the day and assign it to a new column
auto_arima_model_amountReceived = pm.auto_arima(
    trend_df["Total Amount Received"],
    exogenous=trend_df[["Total Amount Paid"]],
    seasonal=True,
    m=m_value,
    trace=False,
)
auto_arima_model_transactionCount = pm.auto_arima(
    trend_df["Transaction Count"],
    exogenous=trend_df[["Total Amount Paid"]],
    seasonal=True,
    m=m_value,
    trace=False,
)

model_1 = SARIMAX(
    trend_df["Total Amount Received"],
    exog=trend_df[["Total Amount Paid"]],
    order=auto_arima_model_amountReceived.order,
    seasonal_order=auto_arima_model_amountReceived.seasonal_order,
)
res_1 = model_1.fit(disp=False)
prediction_1 = res_1.predict(start, end, exog=trend_df[["Total Amount Paid"]]).rename(
    "Prediction"
)
# ax = test_df['Total Amount Received'].plot(legend=True, figsize=(16,8))
# prediction_1.plot(legend=True)

model_2 = SARIMAX(
    trend_df["Transaction Count"],
    exog=trend_df[["Total Amount Paid"]],
    order=auto_arima_model_transactionCount.order,
    seasonal_order=auto_arima_model_transactionCount.seasonal_order,
)
res_2 = model_2.fit(disp=False)
prediction_2 = res_2.predict(start, end, exog=trend_df[["Total Amount Paid"]]).rename(
    "Prediction"
)
# ax = test_df['Transaction Count'].plot(legend=True, figsize=(16,8))
# prediction_2.plot(legend=True)

actual = train_df.drop(
    columns=["Total Amount Paid", "Transaction Count"], inplace=False
)
actual.reset_index(inplace=True)
prediction_1 = pd.DataFrame(prediction_1)
prediction_1.reset_index(inplace=True)

actual2 = train_df.drop(
    columns=["Total Amount Paid", "Total Amount Received"], inplace=False
)
actual2.reset_index(inplace=True)
prediction_2 = pd.DataFrame(prediction_2)
prediction_2.reset_index(inplace=True)

# Convert Timestamp column to datetime format
actual["Timestamp"] = pd.to_datetime(actual["Timestamp"])
prediction_1["index"] = pd.to_datetime(prediction_1["index"])

actual2["Timestamp"] = pd.to_datetime(actual2["Timestamp"])
prediction_2["index"] = pd.to_datetime(prediction_2["index"])

# Initialize lists for actual and predicted values as tuples
actual_values = list(zip(actual["Timestamp"], actual["Total Amount Received"]))
predicted_values = list(zip(prediction_1["index"], prediction_1["Prediction"]))

actual_values2 = list(zip(actual2["Timestamp"], actual2["Transaction Count"]))
predicted_values2 = list(zip(prediction_2["index"], prediction_2["Prediction"]))

# Create the forecastedValues object as dictionaries
forecastedValues = {"Actual": actual_values, "Predicted": predicted_values}

forecastedValues2 = {"Actual": actual_values2, "Predicted": predicted_values2}


# Custom JSON Encoder to handle Timestamp objects
class TimestampEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)


# Convert forecastedValues to JSON
forecastedValues_json = json.dumps(forecastedValues, cls=TimestampEncoder)
forecastedValues2_json = json.dumps(forecastedValues2, cls=TimestampEncoder)

print(forecastedValues_json)
print(forecastedValues2_json)
