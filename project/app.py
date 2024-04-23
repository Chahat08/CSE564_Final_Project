import csv
from flask import Flask, render_template, jsonify, request
from waitress import serve
import pandas as pd

app = Flask(__name__)

data = pd.read_csv("static/data/eclipse_removed.csv") 
geodata = pd.read_csv("static/data/geo_coded_data_clean.csv")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/hexbin_plot')
def hexbin_plot():
    return jsonify({"data": "hexbin data"})

@app.route('/chloropleth')
def chloropleth():
    with open('../data/geo_coded_data_clean.csv', 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        data = list(reader)
    return jsonify(data)

if __name__ == '__main__':
    # serve(app, host='0.0.0.0', port=8080)
    app.run(debug=True)