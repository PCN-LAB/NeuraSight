import pandas as pd
import numpy as np
import sys
import json

dataset_path = sys.argv[1]

# Load the dataset
df = pd.read_csv(dataset_path)
# df = pd.read_csv("D:\FYP\FYP Scripts (Testing)\HI-Small_Trans.csv")
# df = df.head(10000)

# total transactions
total_transactions = df.shape[0]

# total number of unique Accounts
total_accounts = df["Account"].nunique()
# print("Total Unique Accounts: ", total_accounts)

# total number of unique Banks
total_banks = df["From Bank"].nunique()
# print("Total Unique Banks: ", total_banks)

# most used payment currency
most_used_currency = df["Payment Currency"].value_counts().idxmax()
# print("Most used currency: ", most_used_currency)

# most used payment format
most_used_format = df["Payment Format"].value_counts().idxmax()
# print("Most used Payment format: ", most_used_format)

# top 5 accounts with the highest number of transactions
top_5_accounts = df["Account"].value_counts().head(10)
# print("Top 5 accounts with the highest number of transactions: \n", top_5_accounts)

# top 5 accounts with highest transaction amounts
top_5_accounts_amount = (
    df.groupby("Account")["Amount Paid"].sum().nlargest(5)
)
# print("Top 5 accounts with highest transaction amounts: \n", top_5_accounts_amount)

# total transactions on daily basis
df["Timestamp"] = pd.to_datetime(df["Timestamp"])
df["Date"] = df["Timestamp"].dt.date
total_transactions_daily = df["Date"].value_counts()
# Convert date objects to strings in the total_transactions_daily dictionary
total_transactions_daily = {
    str(date): count for date, count in total_transactions_daily.items()
}
# print("Total transactions on daily basis: \n", total_transactions_daily)


# Define a custom function to handle formatting
def format_value(value):
    if isinstance(value, float):
        return "{:.2f}".format(value)  # Format floats with two decimal places
    else:
        return value


data_overview = {
    "numTransactions": total_transactions,
    "numUniqueAccounts": total_accounts,
    "numUniqueBanks": total_banks,
    "mostUsedCurrency": most_used_currency,
    "mostUsedFormat": most_used_format,
    "topAccountsTransactions": {
        str(key): format_value(value) for key, value in top_5_accounts.items()
    },
    "topAccountsAmount": {
        str(key): format_value(value) for key, value in top_5_accounts_amount.items()
    },
    "numTransactionsDaily": total_transactions_daily,
}

# Convert to JSON string
data_overview = json.dumps(data_overview)

# Print the dictionary
print(data_overview)