import json
import math
import os

import matplotlib.pyplot as plt

import config as CONFIG
from graph.util import data_util, plot_util
from graph.util import network_util


def plot_degree_distribution(degree_distribution, plot_loglog=False):
    x = []
    y = []

    for k, v in degree_distribution.items():
        x.append(k)
        y.append(v)

    if plot_loglog:
        _show_loglog_plot(x, y)
    else:
        _show_usual_plot(x, y)


def plot_log_binned_degree_distribution(degree_count):
    n, bins = plot_util.log_binning(degree_count, n_bins=50)
    bin_centers = list((bins[1:] + bins[:-1]) / 2)
    n = list(n)
    plot_util.plot_scatter(bin_centers, n, title='Log-Log Degree Distribution', x_label='k', y_label='P(k)', log_log=True)


def _show_loglog_plot(x, y):
    x_log = [math.log(val) for val in x]
    y_log = [math.log(val) for val in y]
    _show_usual_plot(x_log, y_log)


def _show_usual_plot(x, y):
    plt.scatter(x, y, s=20*0.01)
    plt.show()


def _store_dict_to_json(d, file_name):
    file_path = os.path.join(CONFIG.RESULTS_DIR_PATH, file_name)
    f = open(file_path, 'w')
    json.dump(d, f)
    f.close()


if __name__ == '__main__':
    network = data_util.get_network()
    degree_count = network_util.count_degree(network)
    _store_dict_to_json(degree_count, 'degree_count.json')

    degree_distribution = network_util.analyze_degree_distribution(degree_count)
    _store_dict_to_json(degree_distribution, 'degree_distribution.json')

    first_moment = network_util.calculate_moment(degree_count, n=1)
    second_moment = network_util.calculate_moment(degree_count, n=2)
    print('First Moment:', first_moment)
    print('Second Moment:', second_moment)

    plot_degree_distribution(degree_distribution, plot_loglog=False)
    plot_log_binned_degree_distribution(degree_count)