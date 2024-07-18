import time
import logging
import pandas as pd
from util import create_parser, set_seed, logger_setup
from preprocess import format_transactions
from data_loading import get_data
from inference import infer_gnn
import json

def main():
    parser = create_parser()
    args = parser.parse_args()

    with open('data_config.json', 'r') as config_file:
        data_config = json.load(config_file)

    format_transactions(data_config['paths']['original_data'], data_config['paths']['formatted_data'])

    #Setup logging
    logger_setup()

    #set seed
    set_seed(args.seed)

    #get data
    logging.info("Retrieving data")
    t1 = time.perf_counter()
    
    te_data, te_inds = get_data(args, data_config)
    
    t2 = time.perf_counter()
    logging.info(f"Retrieved data in {t2-t1:.2f}s")

    #Inference
    logging.info(f"Running Inference")
    pred, ground_truth = infer_gnn(te_data, te_inds, args, data_config)

    #Append and save predictions
    formatted_df = pd.read_csv(data_config['paths']['formatted_data'])
    formatted_df['Is Laundering'] = pred
    formatted_df = formatted_df.sort_values(by='EdgeID', ascending=True)
    formatted_df = formatted_df.reset_index(drop=True)

    original_df = pd.read_csv(data_config['paths']['original_data'])
    original_df['Is Laundering'] = formatted_df['Is Laundering']

    predicted_df = original_df[original_df['Is Laundering'] == 1]
    predicted_df['Timestamp'] = pd.to_datetime(predicted_df['Timestamp'])
    predicted_df = predicted_df.sort_values(by='Timestamp')
    predicted_df = predicted_df.reset_index(drop=True)
    predicted_df.to_csv(data_config['paths']['prediction_data'], index=False)

if __name__ == "__main__":
    main()
