import pandas as pd
import numpy as np
import networkx as nx
# import matplotlib.pyplot as plt
import random
from networkx.algorithms import isomorphism
import sys
import json
from datetime import datetime

dataset_path = sys.argv[1]
edges = json.loads(sys.argv[2])
filter_attributes = json.loads(sys.argv[3])  # recieved as a json string

# dataset_path = "C:\FAST\FYP\Motifs\HI-Small_Trans.csv"
# edges = ([(1, 2), (3, 2), (4, 2), (8,2), (2, 5), (2, 6), (2, 7), (2,9)])
# # edges = ([(1, 2), (2, 1)])
# filter_attributes = {
#   "numberOfTransSeq": "2000",
#   "numTransRandom": "",
#   "minTrans": "",
#   "maxTrans": "",
#   "startDate": "",
#   "endDate": "",
#   "accounts": [
#   ],
#   "banks": [
#   ]
# }

# Load the dataset
df = pd.read_csv(dataset_path)
# df = pd.read_csv("D:\FYP\FYP Scripts (Testing)\HI-Small_Trans.csv")
# df = df.head(1000)


# ----------------
# unique from banks
from_banks = df["From Bank"].unique()
# unique to banks
to_banks = df["To Bank"].unique()
# unique payment currencies
payment_currencies = df["Payment Currency"].unique()
# unique payment formats
payment_formats = df["Payment Format"].unique()
# unique accounts
accounts = df["Account"].unique()
# unique accounts.1
accounts1 = df["Account.1"].unique()

# FILTERS --------------------------------------------------------------
# # Filter by date
# def filter_by_date(df, dates_to_keep):
#     # Convert 'Timestamp' column to datetime if it's not already in datetime format
#     if not pd.api.types.is_datetime64_any_dtype(df["Timestamp"]):
#         df["Timestamp"] = pd.to_datetime(df["Timestamp"])
#     # Filter the DataFrame based on the given list of dates
#     df = df[df["Timestamp"].dt.date.isin(dates_to_keep)]

#     return df


# Filter by amount
def filter_by_amount(df, lower_bound, upper_bound):
    if upper_bound is None:
        # Filter DataFrame for values greater than or equal to the lower_bound
        df = df[df["Amount Paid"] >= lower_bound]
    else:
        # Filter DataFrame for values within the specified range (between lower_bound and upper_bound)
        df = df[(df["Amount Paid"] >= lower_bound) & (df["Amount Paid"] <= upper_bound)]
    return df


# # Filter by from_bank
# def filter_by_from_bank(df, from_banks_to_keep):
#     df = df[df["From Bank"].isin(from_banks_to_keep)]
#     return df

# # Filter by to_bank
# def filter_by_to_bank(df, to_banks_to_keep):
#     df = df[df["To Bank"].isin(to_banks_to_keep)]
#     return df

# # Filter by payment_currency
# def filter_by_payment_currency(df, currencies_to_keep):
#     df = df[df["Payment Currency"].isin(currencies_to_keep)]
#     return df

# # Filter by payment_format
# def filter_by_payment_format(df, formats_to_keep):
#     df = df[df["Payment Format"].isin(formats_to_keep)]
#     return df


# Filter by number of transactions randomly
def filter_by_num_transactions_random(df, num_transactions, random_state=42):
    total_transactions = df.shape[0]
    # Check if the specified number of transactions is greater than the total transactions
    if num_transactions >= total_transactions:
        return df  # Return the whole DataFrame if the requested number is greater or equal to the total
    # Set random state for reproducibility
    random.seed(random_state)
    # Randomly select the specified number of transactions
    selected_indices = random.sample(range(total_transactions), num_transactions)
    filtered_df = df.iloc[selected_indices]
    return filtered_df


# Filter by number of transactions sequentially
def filter_by_num_transactions_sequential(df, num_transactions):
    return df.iloc[:num_transactions]


# # Filter by Account
# def filter_by_account(df, from_accounts_to_keep):
#     df = df[df["Account"].isin(from_accounts_to_keep)]
#     return df

# # Filter by Account.1
# def filter_by_account1(df, to_accounts_to_keep):
#     df = df[df["Account.1"].isin(to_accounts_to_keep)]
#     return df


def motif_pattern(edges):
    P = nx.DiGraph()
    for edge in edges:
        P.add_edge(edge[0], edge[1])
    return P


# CHECKING FILTERS --------------------------------------------------------------
df["Timestamp"] = pd.to_datetime(df["Timestamp"])
# Extract accounts from filters
accounts_with_roles = filter_attributes.get("accounts", [])
# Extract bank numbers and their roles from filter_attributes
banks_with_roles = filter_attributes.get("banks", {})
# applying time period filter_attributes where I have a start and end date
start_date_str = filter_attributes.get("startDate", None)
end_date_str = filter_attributes.get("endDate", None)
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
        print(
            json.dumps("One or more specified accounts are not present in the dataset.")
        )
        exit()

if banks_with_roles:
    # Check if all specified banks are present in the dataset
    specified_banks = [int(list(bank_dict.keys())[0]) for bank_dict in banks_with_roles]
    if not set(specified_banks).issubset(set(df["From Bank"].unique())):
        print("One or more specified banks are not present in the dataset.")
        exit()

if start_date is not None and end_date is not None:
    # Check if both start date and end date are present in the DataFrame
    if (start_date not in df["Timestamp"].dt.date.values) or (
        end_date not in df["Timestamp"].dt.date.values
    ):
        print(json.dumps("Start date or end date not present in the dataset"))
        exit()


# FILTERS --------------------------------------------------------------
# apply filters on json
if filter_attributes["minTrans"] != "" and filter_attributes["maxTrans"] != "":
    df = filter_by_amount(
        df, int(filter_attributes["minTrans"]), int(filter_attributes["maxTrans"])
    )
if filter_attributes["numTransRandom"] != "":
    df = filter_by_num_transactions_random(df, int(filter_attributes["numTransRandom"]))
if filter_attributes["numberOfTransSeq"] != "":
    df = filter_by_num_transactions_sequential(
        df, int(filter_attributes["numberOfTransSeq"])
    )

if accounts_with_roles:
    filtered_accounts_df = (
        pd.DataFrame()
    )  # Initialize an empty DataFrame to store filtered rows
    for account_dict in accounts_with_roles:
        account, role = list(account_dict.items())[0]
        if role == "sender":
            filtered_accounts_df = pd.concat(
                [filtered_accounts_df, df[df["Account"].isin([account])]]
            )
        elif role == "receiver":
            filtered_accounts_df = pd.concat(
                [filtered_accounts_df, df[df["Account.1"].isin([account])]]
            )
        elif role == "both":
            filtered_df = df[df["Account"].isin([account])]
            filtered_df = pd.concat([filtered_df, df[df["Account.1"].isin([account])]])
            filtered_accounts_df = pd.concat([filtered_accounts_df, filtered_df])
    df = filtered_accounts_df

if banks_with_roles:
    filtered_banks_df = (
        pd.DataFrame()
    )  # Initialize an empty DataFrame to store filtered rows
    for bank_dict in banks_with_roles:
        bank, role = list(bank_dict.items())[0]
        if role == "sender":
            filtered_banks_df = pd.concat(
                [filtered_banks_df, df[df["From Bank"].isin([int(bank)])]]
            )
        elif role == "receiver":
            filtered_banks_df = pd.concat(
                [filtered_banks_df, df[df["To Bank"].isin([int(bank)])]]
            )
        elif role == "both":
            filtered_df = df[df["To Bank"].isin([int(bank)])]
            filtered_df = pd.concat(
                [filtered_df, df[df["From Bank"].isin([int(bank)])]]
            )
            filtered_banks_df = pd.concat([filtered_banks_df, filtered_df])

    df = filtered_banks_df  # Replace original DataFrame with filtered DataFrame for banks

# Filter the DataFrame by start date and end date
if start_date is not None and end_date is not None:
    df = df[
        (df["Timestamp"].dt.date >= start_date) & (df["Timestamp"].dt.date <= end_date)
    ]


# DRAWING GRAPH G --------------------------------------------------------------
# Create an empty MultiDiGraph
G = nx.MultiDiGraph()
# Extract unique nodes from both 'Account' and 'Account.1' columns
nodes_list = pd.concat([df["Account"], df["Account.1"]]).unique().tolist()

# Construct edges using apply() and zip() on DataFrame columns
edges_list = df.apply(
    lambda row: (
        row["Account"],
        row["Account.1"],
        {
            "timestamp": row["Timestamp"],
            "amount": row["Amount Paid"],
            "from_bank": row["From Bank"],
            "to_bank": row["To Bank"],
            "is_laundering": row["Is Laundering"],
        },
    ),
    axis=1,
).tolist()

# Save nodes_list to a file
with open("./nodes_list.txt", "w") as file:
    for node in nodes_list:
        file.write(node + "\n")

# Save edges_list to a file
with open("./edges_list.txt", "w") as file:
    for edge in edges_list:
        file.write(str(edge) + "\n")

# Add nodes and edges to the graph
G.add_nodes_from(nodes_list)
G.add_edges_from(edges_list)

# Example: Get the number of nodes and edges in the graph
num_nodes = G.number_of_nodes()
num_edges = G.number_of_edges()

# MOTIF ANLYSIS --------------------------------------------------------------
# Convert list of lists to list of tuples
edges = [(int(edge[0]), int(edge[1])) for edge in edges]
P = motif_pattern(edges)

# Create the DiGraphMatcher object
GM = isomorphism.DiGraphMatcher(G, P)

# # Find all subgraphs of G that are isomorphic to P
# subgraphs = list(GM.subgraph_monomorphisms_iter())
# # Convert each subgraph to a frozenset of its edges to remove duplicates
# unique_subgraphs = set(frozenset(G.edges(nodes)) for nodes in subgraphs)

# UNIQUE SUBGRAPHS --------------------------------------------------------------
# Initialize an empty list to store unique subgraphs
uniqueSubgraphs = []
# Iterate through all subgraph isomorphisms
for subgraph in GM.subgraph_monomorphisms_iter():
    # Extract nodes from the current subgraph
    G_nodes = set(subgraph.keys())
    P_nodes = set(subgraph.values())
    # print(G_nodes, P_nodes)
    # if uniqueSubgraphs is empty, add the subgraph to it
    if len(uniqueSubgraphs) == 0:
        uniqueSubgraphs.append(subgraph)
    else:
        # Initialize a flag to check if the subgraph is unique
        isUnique = True
        # Iterate through all unique subgraphs
        for uniqueSubgraph in uniqueSubgraphs:
            # Extract nodes from the current unique subgraph
            uniqueG_nodes = set(uniqueSubgraph.keys())
            uniqueP_nodes = set(uniqueSubgraph.values())
            # If the current subgraph is not unique, set the flag to False
            if G_nodes == uniqueG_nodes and P_nodes == uniqueP_nodes:
                isUnique = False
                break
        # If the subgraph is unique, add it to uniqueSubgraphs
        if isUnique:
            uniqueSubgraphs.append(subgraph)

uniqueSubgraphs_json = json.dumps(uniqueSubgraphs)

# TRANSACTION EXTRACTION --------------------------------------------------------------
# Initialize a list to store transactions for all motifs
all_motif_transactions = []

# Iterate through each unique subgraph
for graph in uniqueSubgraphs:
    # Initialize a set to store unique transactions for this motif
    motif_transactions_set = set()

    # Iterate through each edge in the motif
    for edge in edges:
        # Get the nodes mapping from the unique subgraph
        from_node = None
        to_node = None
        for key, value in graph.items():
            if value == edge[0]:
                from_node = key
            elif value == edge[1]:
                to_node = key

        # Filter the DataFrame based on the mapped nodes
        if from_node is not None and to_node is not None:
            # Retrieve transactions matching the edge
            transactions = df[
                (df["Account"] == from_node) & (df["Account.1"] == to_node)
            ].values.tolist()

            # Convert timestamps to strings and remove the last element
            for transaction in transactions:
                if transaction:  # Check if the transaction list is not empty
                    transaction[0] = datetime.strftime(
                        transaction[0], "%Y-%m-%d %H:%M:%S"
                    )  # Convert timestamp to string
                    transaction.pop()  # Remove the last element

            # Convert transactions to tuples for set comparison
            transactions = [tuple(transaction) for transaction in transactions]

            # Add unique transactions to the set
            motif_transactions_set.update(transactions)

    # Convert unique transactions back to lists and append to the list of all motifs
    motif_transactions = [list(transaction) for transaction in motif_transactions_set]
    all_motif_transactions.append(motif_transactions)


# Convert the nested list to JSON format
all_motif_transactions_json = json.dumps(all_motif_transactions)
# Print the JSON string
print(all_motif_transactions_json)

print(uniqueSubgraphs_json)
