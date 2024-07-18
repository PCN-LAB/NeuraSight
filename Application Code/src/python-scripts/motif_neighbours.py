import pandas as pd
import numpy as np
import networkx as nx
# import matplotlib.pyplot as plt
import random
from networkx.algorithms import isomorphism
import sys
import json
from datetime import datetime

motifGraphInfo = json.loads(sys.argv[1])
# { nodes:[], edges:[]}

nodes_list = []
# Reading nodes_list from file
with open("./nodes_list.txt", "r") as file:
    nodes_list = [line.strip() for line in file]

edges_list = []
# read each line from the file and append in edgeslist
with open("./edges_list.txt", "r") as file:
    for line in file:
        line = line.strip()
        edges_list.append(line)
# Convert strings into tuples and dictionaries
parsed_edges_list = []
for item in edges_list:
    parsed_item = eval(item.replace("Timestamp", "pd.Timestamp"))
    parsed_edges_list.append(parsed_item)
edges_list = parsed_edges_list

# print(edges_list[:5])
G = nx.MultiDiGraph()

# Adding nodes to the graph
# Add nodes and edges to the graph
G.add_nodes_from(nodes_list)
G.add_edges_from(edges_list)


# NEIGHBOURHOOD ANALYSIS --------------------------------------------------------------
def get_neighboring_nodes(graph, node, radius):
    visited = set()
    neighbors = set([node])
    for _ in range(radius):
        temp = set()
        for neighbor in neighbors:
            if neighbor not in visited:
                temp.update(set(graph.neighbors(neighbor)))
                visited.add(neighbor)
        neighbors.update(temp)
    return neighbors


def visualize_patterns_with_neighbors(graph, motif_graph_info, radius):
    # Initialize a set to store all nodes in the vicinity of all patterns
    nodes_to_visualize = set()
    for motif in motif_graph_info["nodes"]:
        nodes_to_visualize.add(motif["id"])
        # Extract neighboring nodes for each pattern node
        nodes_to_visualize.update(get_neighboring_nodes(graph, motif["id"], radius))

    # Generate the subgraph containing all patterns and their neighbors
    subgraph = graph.subgraph(nodes_to_visualize)

    # Remove duplicate edges and self-loops
    subgraph = nx.DiGraph(subgraph)
    subgraph.remove_edges_from(nx.selfloop_edges(subgraph))
    subgraph = nx.DiGraph(subgraph)

    # Create node mapping
    node_mapping = {node: i + 1 for i, node in enumerate(subgraph.nodes())}

    # Create motif with mapped nodes and edges
    mapped_nodes = [(node_mapping[node], node) for node in subgraph.nodes()]
    edges = [
        (node_mapping[edge[0]], node_mapping[edge[1]]) for edge in subgraph.edges()
    ]

    # Construct graphInfo object
    graph_info = {"mappedNodes": mapped_nodes, "edges": edges}
    return graph_info


def adjust_positions(unique_subgraphs_with_neighbors, motif_graph_info):
    closeness_threshold = 50
    # Initialize dictionary to store node positions
    node_positions = {}

    # Extract motif nodes
    motif_nodes = [
        node_info[1] for node_info in unique_subgraphs_with_neighbors["mappedNodes"]
    ]

    # Initialize node positions using motifGraphInfo if available
    for node_info in motif_graph_info["nodes"]:
        node_id = node_info["id"]
        if node_id in motif_nodes:
            node_positions[node_id] = (
                node_info["position"]["x"],
                node_info["position"]["y"],
            )

    # Calculate min and max values for x and y coordinates
    min_x = min(node_info["position"]["x"] for node_info in motif_graph_info["nodes"])
    max_x = max(node_info["position"]["x"] for node_info in motif_graph_info["nodes"])
    min_y = min(node_info["position"]["y"] for node_info in motif_graph_info["nodes"])
    max_y = max(node_info["position"]["y"] for node_info in motif_graph_info["nodes"])

    # add 200 in max_x and max_y
    max_x += 200
    max_y += 200
    # sub 200 in min_x and min_y
    min_x -= 200
    min_y -= 200

    # Calculate positions for other nodes
    for node_index, node_id in unique_subgraphs_with_neighbors["mappedNodes"]:
        # print(node_index, node_id)
        if node_id not in node_positions:
            # print(node_index, node_id)
            x = 0
            y = 0
            # find the nodes the node_id has edge with
            for edge in unique_subgraphs_with_neighbors["edges"]:
                if edge[1] == node_index:
                    neighbor_node_index = edge[0]
                    # neighbor_node_id = [node_info[1] for node_info in unique_subgraphs_with_neighbors['mappedNodes'] if node_info[0] == neighbor_node_index][0]
                    # print(neighbor_node_id)
                    x = random.uniform(min_x, max_x)
                    y = random.uniform(min_y, max_y)
                    # if x or y is within 100 units of any node in the node_positions, then reassign x and y until it is not within 100 units of any node
                    while any(
                        abs(x - node[0]) < closeness_threshold
                        for node in node_positions.values()
                    ):
                        x = random.uniform(min_x, max_x)
                    while any(
                        abs(y - node[1]) < closeness_threshold
                        for node in node_positions.values()
                    ):
                        y = random.uniform(min_y, max_y)
                    node_positions[node_id] = (x, y)
                elif edge[0] == node_index:
                    neighbor_node_index = edge[1]
                    # neighbor_node_id = [node_info[1] for node_info in unique_subgraphs_with_neighbors['mappedNodes'] if node_info[0] == neighbor_node_index][0]
                    # print(neighbor_node_id)
                    x = random.uniform(min_x, max_x)
                    y = random.uniform(min_y, max_y)
                    # if x or y is within closeness_threshold units of any node in the node_positions, then reassign x and y until it is not within closeness_threshold units of any node
                    while any(
                        abs(x - node[0]) < closeness_threshold
                        for node in node_positions.values()
                    ):
                        x = random.uniform(min_x, max_x)
                    while any(
                        abs(y - node[1]) < closeness_threshold
                        for node in node_positions.values()
                    ):
                        y = random.uniform(min_y, max_y)
                    node_positions[node_id] = (x, y)

    return node_positions


def visualize_unique_subgraphs(unique_subgraphs_with_neighbors, motif_graph_info):
    node_positions = adjust_positions(unique_subgraphs_with_neighbors, motif_graph_info)
    return node_positions


def format_node_info(node_id, position):
    return {"id": node_id, "position": {"x": position[0], "y": position[1]}}


def format_graph_info(
    node_positions, unique_subgraphs_with_neighbors, motif_graph_info
):
    # Create a mapping from node index to account name
    node_index_to_id = {
        node_info[0]: node_info[1]
        for node_info in unique_subgraphs_with_neighbors["mappedNodes"]
    }

    # Convert node positions to the desired format
    nodes = [
        format_node_info(node_id, position)
        for node_id, position in node_positions.items()
    ]

    # Convert edges to use account names instead of node indices
    edges = [
        {"source": node_index_to_id[edge[0]], "target": node_index_to_id[edge[1]]}
        for edge in unique_subgraphs_with_neighbors["edges"]
    ]

    return {"nodes": nodes, "edges": edges}


# motifGraphInfo = {}
# Visualize patterns with neighboring nodes and highlight the pattern
uniqueSubgraphs_with_neighbors = visualize_patterns_with_neighbors(G, motifGraphInfo, 1)
# print(uniqueSubgraphs_with_neighbors)
adjusted_positions = visualize_unique_subgraphs(
    uniqueSubgraphs_with_neighbors, motifGraphInfo
)
# print(adjusted_positions)
# Format graph info with account names instead of indices
neighbourMotifInfoGraph = format_graph_info(
    adjusted_positions, uniqueSubgraphs_with_neighbors, motifGraphInfo
)
# print(neighbourMotifInfoGraph)
neighbourMotifInfoGraph_json = json.dumps(neighbourMotifInfoGraph)
print(neighbourMotifInfoGraph_json)
