import pandas as pd
import numpy as np
import torch
import logging
import itertools
from data_util import GraphData, HeteroData, z_norm, create_hetero_obj

def get_data(args, data_config):
    '''Loads the AML transaction data.
    
    1. The data is loaded from the csv and the necessary features are chosen.
    2. PyG Data objects are created with the entire dataset.
    '''

    #transaction_file = f"{data_config['paths']['aml_data']}/{args.data}/formatted_transactions.csv" #replace this with your path to the respective AML data objects
    transaction_file = data_config['paths']['formatted_data']
    df_edges = pd.read_csv(transaction_file)

    logging.info(f'Available Edge Features: {df_edges.columns.tolist()}')

    df_edges['Timestamp'] = df_edges['Timestamp'] - df_edges['Timestamp'].min()

    max_n_id = df_edges.loc[:, ['from_id', 'to_id']].to_numpy().max() + 1
    df_nodes = pd.DataFrame({'NodeID': np.arange(max_n_id), 'Feature': np.ones(max_n_id)})
    timestamps = torch.Tensor(df_edges['Timestamp'].to_numpy())
    y = torch.LongTensor(df_edges['Is Laundering'].to_numpy())

    logging.info(f"Illicit ratio = {sum(y)} / {len(y)} = {sum(y) / len(y) * 100:.2f}%")
    logging.info(f"Number of nodes (holdings doing transcations) = {df_nodes.shape[0]}")
    logging.info(f"Number of transactions = {df_edges.shape[0]}")

    edge_features = ['Timestamp', 'Amount Received', 'Received Currency', 'Payment Format']
    node_features = ['Feature']

    logging.info(f'Edge features being used: {edge_features}')
    logging.info(f'Node features being used: {node_features} ("Feature" is a placeholder feature of all 1s)')

    x = torch.tensor(df_nodes.loc[:, node_features].to_numpy()).float()
    edge_index = torch.LongTensor(df_edges.loc[:, ['from_id', 'to_id']].to_numpy().T)
    edge_attr = torch.tensor(df_edges.loc[:, edge_features].to_numpy()).float()

    n_days = int(timestamps.max() / (3600 * 24) + 1)
    n_samples = y.shape[0]
    logging.info(f'number of days and transactions in the data: {n_days} days, {n_samples} transactions')

    # Creating the final data object for the entire dataset
    te_x = x
    te_edge_index = edge_index
    te_edge_attr = edge_attr
    te_y = y
    te_edge_times = timestamps

    te_data = GraphData(x=te_x, y=te_y, edge_index=te_edge_index, edge_attr=te_edge_attr, timestamps=te_edge_times)

    # Adding ports and time-deltas if applicable
    if args.ports:
        logging.info(f"Start: adding ports")
        te_data.add_ports()
        logging.info(f"Done: adding ports")
    if args.tds:
        logging.info(f"Start: adding time-deltas")
        te_data.add_time_deltas()
        logging.info(f"Done: adding time-deltas")

    # Normalize data
    te_data.x = z_norm(te_data.x)
    if not args.model == 'rgcn':
        te_data.edge_attr = z_norm(te_data.edge_attr)
    else:
        te_data.edge_attr[:, :-1] = z_norm(te_data.edge_attr[:, :-1])

    # Create heterogenous if reverse MP is enabled
    if args.reverse_mp:
        te_data = create_hetero_obj(te_data.x, te_data.y, te_data.edge_index, te_data.edge_attr, te_data.timestamps, args)

    logging.info(f'test data object: {te_data}')

    te_inds = torch.arange(n_samples)  # Indices for the entire dataset

    return te_data, te_inds
    