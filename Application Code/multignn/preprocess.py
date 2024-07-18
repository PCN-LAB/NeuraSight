import numpy as np
import datatable as dt
from datetime import datetime
from datatable import f, join, sort
import sys
import os

def format_transactions(input_path, output_path):

    raw = dt.fread(input_path, columns = dt.str32)

    currency = dict()
    payment_format = dict()
    bank_acc = dict()
    account = dict()

    def get_dict_val(name, collection):
        if name in collection:
            val = collection[name]
        else:
            val = len(collection)
            collection[name] = val
        return val

    header = "EdgeID,from_id,to_id,Timestamp,\
    Amount Sent,Sent Currency,Amount Received,Received Currency,\
    Payment Format,Is Laundering\n"

    first_ts = -1

    # with dt.open(input_path) as f:
    #     raw = f[:, :]

    with open(output_path, 'w') as writer:
        writer.write(header)
        for i in range(raw.nrows):
            datetime_object = datetime.strptime(raw[i, "Timestamp"], '%Y/%m/%d %H:%M')
            ts = datetime_object.timestamp()
            day = datetime_object.day
            month = datetime_object.month
            year = datetime_object.year
            hour = datetime_object.hour
            minute = datetime_object.minute

            if first_ts == -1:
                start_time = datetime(year, month, day)
                first_ts = start_time.timestamp() - 10

            ts = ts - first_ts

            cur1 = get_dict_val(raw[i, "Receiving Currency"], currency)
            cur2 = get_dict_val(raw[i, "Payment Currency"], currency)

            fmt = get_dict_val(raw[i, "Payment Format"], payment_format)

            from_acc_id_str = raw[i, "From Bank"] + raw[i, 2]
            from_id = get_dict_val(from_acc_id_str, account)

            to_acc_id_str = raw[i, "To Bank"] + raw[i, 4]
            to_id = get_dict_val(to_acc_id_str, account)

            amount_received_orig = float(raw[i, "Amount Received"])
            amount_paid_orig = float(raw[i, "Amount Paid"])

            isl = int(raw[i, "Is Laundering"])

            line = '%d,%d,%d,%d,%f,%d,%f,%d,%d,%d\n' % \
                        (i, from_id, to_id, ts, amount_paid_orig, cur2, amount_received_orig, cur1, fmt, isl)

            writer.write(line)

    formatted = dt.fread(output_path)
    formatted = formatted[:, :, sort(3)]

    formatted.to_csv(output_path)

# Example usage:
# format_transactions("input_file.csv", "output_file.csv")
