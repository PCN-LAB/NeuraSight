# Motif Analysis
The motif analysis module identifies user-queried patterns within the transaction graph of the entire dataset. Each detected pattern, referred to as a "motif," represents a bidirectional subgraph indicative of potential money laundering activities. In these motifs, each node represents an account, and each edge represents a transaction between accounts. The module filters motifs from the transactional graph using specified conditions such as time frame, bank-to-bank transactions, or account-to-account interactions. Once filtered, these motifs are referred to as "Unique Subgraphs." However, since our primary goal is to identify the specific transactions involved in money laundering, the module uses the nodes and edges of each motif to extract the relevant transactions. As a result, the module returns a nested list structure: a list of motifs, where each motif is a list of transactions involved in that particular pattern. An example of how the output actually looks is shown below:
[
    [
        [
            "2022-09-01 00:31:00",
            3208,
            "8000EC280",
            1,
            "8000F5340",
            0.01,
            "US Dollar",
            0.01,
            "US Dollar",
            "Cheque"
        ],
        [
            "2022-09-01 00:20:00",
            3208,
            "8000F4580",
            1,
            "8000F5340",
            0.01,
            "US Dollar",
            0.01,
            "US Dollar",
            "Cheque"
        ]
    ],
    [
        [
            "2022-09-01 00:31:00",
            3208,
            "8000EC280",
            1,
            "8000F5340",
            0.01,
            "US Dollar",
            0.01,
            "US Dollar",
            "Cheque"
        ],
        [
            "2022-09-01 00:20:00",
            3208,
            "8000F4580",
            1,
            "8000F5340",
            0.01,
            "US Dollar",
            0.01,
            "US Dollar",
            "Cheque"
        ]
    ]
]

# Motif Neighbors: submodule of motif analysis
The Motif Neighbours module, a submodule of Motif Analysis, extends its functionality by identifying neighboring nodes (accounts) of the nodes in the investigated motif. This module finds the closest accounts that transacted with the accounts within the motif and expands depth-wise. For example, a depth of 1 finds the nearest neighboring accounts, while a depth of 2 finds the nearest neighboring accounts of the depth 1 accounts, and so on. This process results in an extended motif subgraph, capturing more transactions and identifying related suspicious accounts that may be indirectly involved in money laundering. Consequently, the module returns a JSON object structured with nodes and edges:
{
    "nodes": [
        {
            "id": "8000EBD30",
            "position": {
                "x": 2777.3464294735495,
                "y": -1227.4755816245934
            }
        },
        {
            "id": "8000F4580",
            "position": {
                "x": 1862.9475418671473,
                "y": 2862.1159997975574
            }
        }
    ],
    "edges": [
        {
            "source": "8000F5340",
            "target": "8000EBD30"
        },
        {
            "source": "8000EBD30",
            "target": "8000F5340"
        }
    ]
}

# Time Series Analsysis
The Time Series Analysis module uses the SARIMAX model for time series forecasting to identify trends in various attributes, such as the amount received and transaction count. Although not directly related to money laundering detection, this module provides valuable insights as part of data exploratory analysis, helping to understand current data trends and predict future patterns. The module returns two key-value pairs: "Actual" and "Predicted." Each key maps to a list of tuples, where each tuple consists of a timestamp and its corresponding value for the forecasted attribute. Since the analysis includes two attributes, the result contains a JSON object structured with actual and predicted for each attribute. An example of how the output actually looks is shown below:
{
    "Actual": [
        ["2022-09-01T00:00:00", 31.77],
        ["2022-09-02T00:00:00", 31.00]
    ],
    "Predicted": [
        ["2022-09-14T00:00:00", 30.22],
        ["2022-09-27T00:00:00", 17.56]
    ]
}

# Data Overview
The Data Overview module provides an in-depth exploratory data analysis and statistical summary of the financial dataset. It computes various key metrics and insights to facilitate a comprehensive understanding of the dataset. The data is returned in a structured JSON format. Each key corresponds to a specific metric or insight computed from the financial dataset, here's how it looks like:
{
    "numTransactions": 5078355,
    "numUniqueAccounts": 496995,
    "numUniqueBanks": 30470,
    "mostUsedCurrency": "US Dollar",
    "mostUsedFormat": "Cheque",
    "topAccountsTransactions": {
        "100428660": 168672,
        "100428738": 13756,
    },
    "topAccountsAmount": {
        "800E8B7F0": "1505695821885.76",
        "8059FB490": "1086461390890.06",
    },
    "numTransactionsDaily": {
        "2022-09-01": 1114931,
        "2022-09-02": 754449,
    }
}
