import csv
from flask import Flask, render_template, jsonify, request
from waitress import serve
import pandas as pd
import numpy as np

app = Flask(__name__)

data1 = pd.read_csv("static/data/eclipse_removed.csv") 
data2 = pd.read_csv('static/data/eclipse_data_enriched_5000_years.csv')
geodata = pd.read_csv("static/data/geo_coded_data_clean.csv")
data = None
with open('../data/geo_coded_data_clean.csv', 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        data = list(reader)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scatter_plot')
def scatter_plot():
    data = data2.replace({np.nan: None})
    return jsonify(data.to_dict(orient="records"))
    #return jsonify(data1.to_dict(orient="records"))
    #return jsonify(data)

@app.route('/chloropleth')
def chloropleth():
    return jsonify(data)

@app.route('/donut')
def donut_chart():
    def categorize_eclipse_type(e_type):
        if "H" in e_type:
            return "Hybrid"
        elif "A" in e_type:
            return "Annular"
        elif "T" in e_type:
            return "Total"
        elif "P" in e_type:
            return "Partial"
        return "Other"  
   
    geodata['Simplified Type'] = geodata['Eclipse Type'].apply(categorize_eclipse_type)
    
    type_counts = geodata['Simplified Type'].value_counts().to_dict()
    
    return jsonify(type_counts)

@app.route('/timeseries')
def timeseries_plot():
    
    selected_columns = data2[["Decade", "Eclipse Magnitude"]]
    data_dict = selected_columns.to_dict(orient="records")
    
    return jsonify(data_dict)

@app.route('/radialChart')
def sun_constellation_data():
    grouped = geodata.groupby(['Sun Constellation', 'Daytime/Nighttime']).size().unstack(fill_value=0).reset_index()
    #grouped['Sun Constellation'] = grouped['Sun Constellation'].apply(lambda x: x[:2].upper())
    result = grouped.to_dict(orient='records') 
    return jsonify(result)


if __name__ == '__main__':
    # serve(app, host='0.0.0.0', port=8080)
    app.run(debug=True)