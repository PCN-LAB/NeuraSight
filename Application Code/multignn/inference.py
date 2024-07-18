import torch
import pandas as pd
from train_util import AddEgoIds, extract_param, add_arange_ids, get_loaders, evaluate_homo, evaluate_hetero
from training import get_model
from torch_geometric.nn import to_hetero, summary
import wandb
import logging
import os
import sys
import time
import json

script_start = time.time()

def infer_gnn(te_data, te_inds, args, data_config):
    # set device
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

    # define a model config dictionary and wandb logging at the same time
    wandb.init(
        mode="disabled" if args.testing else "online",
        project="your_proj_name",
        config={
            "epochs": args.n_epochs,
            "batch_size": args.batch_size,
            "model": args.model,
            "data": args.data,
            "num_neighbors": args.num_neighs,
            "lr": extract_param("lr", args),
            "n_hidden": extract_param("n_hidden", args),
            "n_gnn_layers": extract_param("n_gnn_layers", args),
            "loss": "ce",
            "w_ce1": extract_param("w_ce1", args),
            "w_ce2": extract_param("w_ce2", args),
            "dropout": extract_param("dropout", args),
            "final_dropout": extract_param("final_dropout", args),
            "n_heads": extract_param("n_heads", args) if args.model == 'gat' else None
        }
    )
    config = wandb.config

    # set the transform if ego ids should be used
    if args.ego:
        transform = AddEgoIds()
    else:
        transform = None

    # add the unique ids to later find the seed edges
    add_arange_ids([te_data])

    te_loader = get_loaders(te_data, te_inds, transform, args)

    # get the model
    sample_batch = next(iter(te_loader))
    model = get_model(sample_batch, config, args)

    if args.reverse_mp:
        model = to_hetero(model, te_data.metadata(), aggr='mean')

    logging.info("=> loading model checkpoint")
    checkpoint = torch.load(f'{data_config["paths"]["model_to_load"]}/{args.unique_name}.tar', map_location=device)
    start_epoch = checkpoint['epoch']
    model.load_state_dict(checkpoint['model_state_dict'])
    model.to(device)
    logging.info("=> loaded checkpoint (epoch {})".format(start_epoch))

    if not args.reverse_mp:
        pred, ground_truth = evaluate_homo(te_loader, te_inds, model, te_data, device, args)
    else:
        pred, ground_truth = evaluate_hetero(te_loader, te_inds, model, te_data, device, args)
    wandb.finish()

    return pred, ground_truth