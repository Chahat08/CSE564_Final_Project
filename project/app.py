from flask import Flask, render_template, jsonify, request
from waitress import serve
import pandas as pd

app = Flask(__name__)

data = pd.read_csv("static/data/eclipse_removed.csv") 

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/hexbin_plot')
def hexbin_plot():
    return jsonify(data.to_dict(orient='records'))    

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8080)