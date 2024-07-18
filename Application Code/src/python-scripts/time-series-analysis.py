# ---------------------------------------------------IMPORTS-------------
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.dates import DateFormatter
from matplotlib.ticker import FuncFormatter
import seaborn as sns
import joblib
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import sys
import json
import copy


# ---------------------------------------------------LOADING DATASET-------------
dataset_path = sys.argv[1]
model_path = sys.argv[2]
filters = json.loads(sys.argv[3])

df = pd.read_csv(dataset_path)

# print("filters: ", filters)


# filters = {
#     "startDate": "2022-09-01",
#     "endDate": "2022-09-02",
#     "accounts": [
#         {"8000ECA90":"both"}
#     ],
#     "banks": [
#         {"11": "both"}
#     ]
# }

# df = pd.read_csv("LI-Small_Trans.csv")
is_laundering_col = df["Is Laundering"]  # Extract 'Is Laundering' column
df.pop("Is Laundering")

# ---------------------------------------------------SAMPLING (OPTIONAL/TESTING)------------
df = df.sample(n=10000, random_state=42)  # Select 20000 random rows
df["Timestamp"] = pd.to_datetime(df["Timestamp"])

# ---------------------------------------------------APPLYING FILTERS------------
# Extract accounts from filters
accounts_with_roles = filters.get("accounts", [])
# Extract bank numbers and their roles from filters
banks_with_roles = filters.get("banks", {})
# applying time period filters where I have a start and end date
start_date_str = filters.get("startDate", None)
end_date_str = filters.get("endDate", None)
# Convert to datetime only if the strings are not empty
start_date = pd.to_datetime(start_date_str).date() if start_date_str else None
end_date = pd.to_datetime(end_date_str).date() if end_date_str else None

if accounts_with_roles:
    # Extract account numbers and their roles
    specified_accounts = [
        list(account_dict.keys())[0] for account_dict in accounts_with_roles
    ]
    # Check if all specified accounts are present in the dataset
    if not set(specified_accounts).issubset(set(df["Account"].unique())):
        print(json.dumps("One or more specified accounts are not present in the dataset."))
        exit()

if banks_with_roles:
    # Check if all specified banks are present in the dataset
    specified_banks = [int(list(bank_dict.keys())[0]) for bank_dict in banks_with_roles]
    if not set(specified_banks).issubset(set(df["From Bank"].unique())):
        print(json.dumps("One or more specified banks are not present in the dataset."))
        exit()

if start_date is not None and end_date is not None:
    # Check if both start date and end date are present in the DataFrame
    if (start_date not in df["Timestamp"].dt.date.values) or (
        end_date not in df["Timestamp"].dt.date.values
    ):
        print(json.dumps("Start date or end date not present in the dataset"))
        exit() 

# ---------------------------------------------------PREPROCESSING------------
df["Year"] = df["Timestamp"].dt.year
df["Month"] = df["Timestamp"].dt.month
df["Day"] = df["Timestamp"].dt.day
df["Hour"] = df["Timestamp"].dt.hour
df["Minute"] = df["Timestamp"].dt.minute
df["Second"] = df["Timestamp"].dt.second
df["TimeOfDay"] = pd.cut(
    df["Hour"],
    bins=[0, 6, 12, 18, 24],
    labels=["Night", "Morning", "Afternoon", "Evening"],
)
df["DayOfWeek"] = df["Timestamp"].dt.day_name()
df["amount_difference"] = df["Amount Paid"] - df["Amount Received"]
average_amount_received = df["Amount Received"].mean()
df["surge"] = (df["Amount Received"] > average_amount_received).astype(int)
df["IsWeekend"] = (df["Timestamp"].dt.dayofweek >= 5).astype(int)

date_related_cols = [
    "Timestamp",
    "Year",
    "Month",
    "Day",
    "Hour",
    "Minute",
    "Second",
    "TimeOfDay",
    "DayOfWeek",
]
df = df[date_related_cols + [col for col in df.columns if col not in date_related_cols]]

# ---------------------------------------------------ONE HOT ENDCODING------------
# Perform one-hot encoding including the extracted features
categorical_columns = [
    "Receiving Currency",
    "Payment Currency",
    "Payment Format",
    "TimeOfDay",
    "DayOfWeek",
]
df_encoded = pd.get_dummies(df, columns=categorical_columns)
# Apply Label Encoding for 'Account' and 'Account.1'
label_encoder = LabelEncoder()
df_encoded["Encoded_Account"] = label_encoder.fit_transform(df_encoded["Account"])
df_encoded["Encoded_Account.1"] = label_encoder.fit_transform(df_encoded["Account.1"])

# ---------------------------------------------------SORTING BY TIMESTAMP------------
df_encoded = df_encoded.sort_values(by="Timestamp")
df_encoded = df_encoded.reset_index(
    drop=True
)  # Resetting index while dropping the old index column

# ---------------------------------------------------IMPORTANT FEATURES-----------
# Assuming your dataframe is called 'data'
selected_columns = [
    "Payment Format_ACH",
    "Amount Received",
    "DayOfWeek_Sunday",
    "TimeOfDay_Afternoon",
    "Amount Paid",
    "Payment Currency_Brazil Real",
    "Receiving Currency_Yen",
    "Payment Currency_Yen",
    "Encoded_Account.1",
    "Receiving Currency_Brazil Real",
    "amount_difference",
    "Month",
    "Year",
]
X = df_encoded[selected_columns]

# ---------------------------------------------------ANOMALY DETECTION-----------
# Load the saved model
# model_path = model_path + "isolation_forest_model.pkl"
loaded_model = joblib.load(model_path)
# Use the loaded model to make predictions
y_pred_loaded = loaded_model.predict(X)
# Reshape the prediction values to 0 for valid transactions, 1 for fraud transactions
y_pred_loaded[y_pred_loaded == 1] = 0
y_pred_loaded[y_pred_loaded == -1] = 1
# Add the predicted values to your DataFrame
df_encoded["Predicted_Is_Laundering"] = y_pred_loaded
# Separate fraudulent and non-fraudulent transactions
fraudulent_transactions = df_encoded[df_encoded["Predicted_Is_Laundering"] == 1]
non_fraudulent_transactions = df_encoded[df_encoded["Predicted_Is_Laundering"] == 0]
# Sample 10% of the fraudulent transactions
fraudulent_transactions_sampled = fraudulent_transactions.sample(frac=0.10, random_state=42)
# Combine sampled fraudulent and non-fraudulent transactions
df_balanced = pd.concat([fraudulent_transactions_sampled, non_fraudulent_transactions])
# Shuffle the combined DataFrame
df_balanced = df_balanced.sample(frac=1, random_state=42).reset_index(drop=True)
df_encoded = df_balanced
# Display the resulting DataFrame

# ---------------------------------------------------APPLYING FILTERS------------
if accounts_with_roles:
    filtered_accounts_df = pd.DataFrame()  # Initialize an empty DataFrame to store filtered rows
    for account_dict in accounts_with_roles:
        account, role = list(account_dict.items())[0]
        if role == "sender":
            filtered_accounts_df = pd.concat([filtered_accounts_df, df_encoded[df_encoded["Account"].isin([account])]])
        elif role == "receiver":
            filtered_accounts_df = pd.concat([filtered_accounts_df, df_encoded[df_encoded["Account.1"].isin([account])]])
        elif role == "both":
            filtered_df = df_encoded[df_encoded["Account"].isin([account])]
            filtered_df = pd.concat([filtered_df, df_encoded[df_encoded["Account.1"].isin([account])]])
            filtered_accounts_df = pd.concat([filtered_accounts_df, filtered_df])
    df_encoded = filtered_accounts_df

if banks_with_roles:
    filtered_banks_df = pd.DataFrame()  # Initialize an empty DataFrame to store filtered rows  
    for bank_dict in banks_with_roles:
        bank, role = list(bank_dict.items())[0]
        if role == "sender":
            filtered_banks_df = pd.concat([filtered_banks_df, df_encoded[df_encoded["From Bank"].isin([int(bank)])]])
        elif role == "receiver":
            filtered_banks_df = pd.concat([filtered_banks_df, df_encoded[df_encoded["To Bank"].isin([int(bank)])]])
        elif role == "both":
            filtered_df = df_encoded[df_encoded["To Bank"].isin([int(bank)])]
            filtered_df = pd.concat([filtered_df, df_encoded[df_encoded["From Bank"].isin([int(bank)])]])
            filtered_banks_df = pd.concat([filtered_banks_df, filtered_df])

    df_encoded = filtered_banks_df  # Replace original DataFrame with filtered DataFrame for banks

# Filter the DataFrame by start date and end date
if start_date is not None and end_date is not None:
    df_encoded = df_encoded[
        (df_encoded["Timestamp"].dt.date >= start_date) & (df_encoded["Timestamp"].dt.date <= end_date)
    ]



# ---------------------------------------------------VISUALIZATION FUNCTIONS-----------
def visualize_classification_distribution(df_encoded):
    fraud_data = df_encoded[df_encoded["Predicted_Is_Laundering"] == 1]
    normal_data = df_encoded[df_encoded["Predicted_Is_Laundering"] == 0]

    # Print the count of fraud and valid transactions
    count_fraud_valid = df_encoded["Predicted_Is_Laundering"].value_counts()
    # outlier_fraction = len(fraud_data) / (len(normal_data) + len(fraud_data))
    # print("\nTotal Money Laundering Fraud Classification:\n", count_fraud_valid)
    # print(
    #     "\nPercentage of Money Laundering Fraud Transactions:", outlier_fraction * 100
    # )
    # Create an object to store variables
    classification_data = {
        "Legitimate": len(normal_data),
        "Anomalies": len(fraud_data),
    }

    # Convert the data to JSON format
    classification_json = json.dumps(classification_data)
    return classification_json


# Call the function with your DataFrame df_encoded
json_data = visualize_classification_distribution(df_encoded)
print(json_data)


def visualize_anomalous_transactions_by_format(df):
    # Get the 'Payment Format' columns
    format_columns = [col for col in df.columns if col.startswith("Payment Format_")]
    df_copy = df.copy()
    # Reverse the one-hot encoding to get a single 'Format' column
    df_copy["Format"] = (
        df[format_columns].idxmax(axis=1).str.replace("Payment Format_", "")
    )
    # Filter data for fraudulent transactions
    fraudulent_transactions = df_copy[df_copy["Predicted_Is_Laundering"] > 0]
    # Group by format and count fraudulent transactions
    fraudulent_by_format = (
        fraudulent_transactions["Format"].value_counts().sort_values(ascending=False)
    )
    # Convert int64 values to int for JSON serialization
    fraudulent_by_format = fraudulent_by_format.astype(np.int64)
    fraudulent_by_format_tuple = list(
        zip(fraudulent_by_format.index, fraudulent_by_format.values)
    )
    # Convert format_counts_tuple to JSON
    fraudulent_by_format_dict = {
        str(payment_format): int(count)
        for payment_format, count in fraudulent_by_format_tuple
    }
    fraudulent_by_format_json = json.dumps(fraudulent_by_format_dict)
    print(fraudulent_by_format_json)


# Example usage
visualize_anomalous_transactions_by_format(df_encoded)


# Call the function with your DataFrame df_encoded
# json_top_features = visualize_top_features(df_encoded)
# print(json_top_features)


def line_plot_anomalies_over_time(df,time_period):
    if time_period == "daily":
        resample_rule = "D"
        time_label = "Daily"
    elif time_period == "weekly":
        resample_rule = "W"
        time_label = "Weekly"
    elif time_period == "monthly":
        resample_rule = "M"
        time_label = "Monthly"
    elif time_period == "yearly":
        resample_rule = "Y"
        time_label = "Yearly"
    else:
        raise ValueError(
            "Invalid time period. Choose from 'daily', 'weekly', 'monthly', or 'yearly'."
        )

    resampled_data = (
        df.set_index("Timestamp")
        .resample(resample_rule)["Predicted_Is_Laundering"]
        .sum()
    )
    anomalies_count = resampled_data.astype(np.int64)

    # Convert the timestamp index to string format ('YYYY-MM-DD')
    anomalies_count.index = anomalies_count.index.strftime("%Y-%m-%d")

    # Create a dictionary for anomalies counts with formatted timestamps
    anomalies_counts_dict = anomalies_count.to_dict()
    anomalies_counts_json = json.dumps(anomalies_counts_dict)

    return anomalies_counts_json


# Example usage
anomalies_counts = line_plot_anomalies_over_time(df_encoded, "daily")
print(anomalies_counts)


def top_accounts_with_fraudulent_transactions(df_encoded, top_n):
    # Group by 'Account' and sum the predicted fraudulent transactions
    fraudulent_counts = df_encoded.groupby("Account")["Predicted_Is_Laundering"].sum()
    # Find the accounts with the most predicted fraudulent transactions
    fraudulent_counts = fraudulent_counts.sort_values(ascending=False).head(top_n)
    # Plot the top accounts with the most fraudulent transactions

    # Convert int64 values to int for JSON serialization
    fraudulent_counts = fraudulent_counts.astype(np.int64)
    fraudulent_counts_tuple = list(
        zip(fraudulent_counts.index, fraudulent_counts.values)
    )
    # Convert fraudulent_counts_tuple to JSON
    fraudulent_counts_dict = {
        str(account): int(count) for account, count in fraudulent_counts_tuple
    }
    fraudulent_counts_json = json.dumps(fraudulent_counts_dict)
    return fraudulent_counts_json


# Example usage:
top_accounts_data = top_accounts_with_fraudulent_transactions(df_encoded, top_n=10)
print(top_accounts_data)
