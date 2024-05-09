import csv
from flask import Flask, render_template, jsonify, request
from waitress import serve
import pandas as pd
import numpy as np

from sklearn import manifold
from sklearn.metrics import pairwise_distances

app = Flask(__name__)

values = {}

# data1 = pd.read_csv("static/data/eclipse_removed.csv") 
# data2 = pd.read_csv('static/data/eclipse_data_enriched_5000_years.csv')
geodata_countries = pd.read_csv("static/data/geodata_countries.csv")
geodatafull = pd.read_csv("static/data/geodatafull.csv")

geodata_countries = geodata_countries.replace({np.nan: None})
geodatafull = geodatafull.replace({np.nan: None})


numerical_cols = ['Delta T (s)','Gamma', 'Eclipse Magnitude', 'Sun Altitude',
                  'Sun Azimuth',  'Eclipse Latitude','Eclipse Longitude', 'obliquity', 'Inter-Eclipse Duration',
                  'Visibility Score', 'Moon Distance (km)', 'Sun Distance (km)', 'Decade']

df_numerical = geodata_countries[numerical_cols]

geodata_csv = None
with open('static/data/geodata_countries.csv', 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        geodata_csv = list(reader)
      
#def categorize_eclipse_type(e_type):
#        if "H" in e_type:
#            return "Hybrid"
#        elif "A" in e_type:
#            return "Annular"
#        elif "T" in e_type:
#            return "Total"
#        elif "P" in e_type:
#            return "Partial"
#        return "Other"  
   
#geodata_countries['Simplified Type'] = geodata_countries['Eclipse Type'].apply(categorize_eclipse_type)

#geodata_countries.to_csv("static/data/geodata_countries.csv", index = False)

#geodatafull['Simplified Type'] = geodatafull['Eclipse Type'].apply(categorize_eclipse_type)

#geodatafull.to_csv("static/data/geodatafull.csv", index = False)

@app.route('/')
def index():
    return render_template('index.html')

def filter_data(unfiltered_data):
    country_code = values.get("country", None)
    ec_types = values.get("ec_type", None)
    constellations = values.get("constellation", None)
    filtered_data = unfiltered_data
    if country_code:
        filtered_data = filtered_data[filtered_data['Alpha3'] == country_code]
    if ec_types:
        filtered_data = filtered_data[filtered_data['Simplified Type'].isin(ec_types)]
    if constellations:
        filtered_data = filtered_data[filtered_data['Sun Constellation'].isin(constellations)]


    return filtered_data


@app.route('/scatter_plot')
def scatter_plot():
    data = geodatafull.replace({np.nan: None})
    
    #FILTER TO UPDATE CHART
    filtered_data = filter_data(data)
    return jsonify(filtered_data.to_dict(orient="records"))
    #return jsonify(data1.to_dict(orient="records"))
    #return jsonify(data)

@app.route('/chloropleth')
def chloropleth():
    filtered_data = filter_data(geodata_countries)
    #filtered_csv = filtered_data.to_csv(index=False)
    #reader = csv.DictReader(filtered_csv)
    #geodata_csv = list(reader)
    
    result_data = filtered_data.to_dict(orient='records')
    return jsonify(result_data)

@app.route('/receive_data', methods=['POST'])
def receive_idi():
    print("Getting latest values")
    updated_values = request.get_json()
    values['country'] = updated_values['country']
    values['ec_type'] = updated_values['ec_type']
    values['constellation'] = updated_values['selectedConstellations']
    values['brush'] = updated_values['brush']
    
    return jsonify({'message': 'IDI received successfully',
                    "country" : values["country"],
                    "ec_type" : values['ec_type'],
                    "constellation" : values["constellation"],
                    "brush": values["brush"]})

@app.route('/donut')
def donut_chart():
    
    #FILTER TO UPDATE CHART
    filtered_data = filter_data(geodatafull)
    type_counts = filtered_data['Simplified Type'].value_counts().to_dict()
    
    return jsonify(type_counts)

@app.route('/timeseries')
def timeseries_plot():
    
    #FILTER TO UPDATE CHART
    filtered_data = filter_data(geodatafull)
    selected_columns = filtered_data[["Decade", "Eclipse Magnitude"]]
    data_dict = selected_columns.to_dict(orient="records")
    
    return jsonify(data_dict)

@app.route('/radialChart')
def sun_constellation_data():
    #FILTER TO UPDATE CHART
    filtered_data = filter_data(geodatafull)
    grouped = filtered_data.groupby(['Sun Constellation', 'Daytime/Nighttime']).size().unstack(fill_value=0).reset_index()
    print(grouped)
    #grouped['Sun Constellation'] = grouped['Sun Constellation'].apply(lambda x: x[:2].upper())
    # Sort by the sum of the counts across both 'Daytime' and 'Nighttime', descending
    grouped['Total'] = grouped['Daytime'] + grouped['Nighttime']
    grouped_sorted = grouped.sort_values(by='Total', ascending=False).drop(columns=['Total'])

    # Optionally, shorten the 'Sun Constellation' names or other processing
    # grouped_sorted['Sun Constellation'] = grouped_sorted['Sun Constellation'].apply(lambda x: x[:2].upper())

    result = grouped_sorted.to_dict(orient='records')
    #result = grouped.to_dict(orient='records') 
    return jsonify(result)

@app.route('/mdsplot')
def mds_attr():
    data_columns = []
    
    dissimilarities = 1 - np.abs(df_numerical.corr())
    mds = manifold.MDS(n_components=2, dissimilarity='precomputed', random_state=123)
    X = mds.fit_transform(dissimilarities)

    # Create DataFrame with MDS results
    data_columns = pd.DataFrame(X, columns=['Comp1', 'Comp2'])
    data_columns['feature'] = df_numerical.columns
    
    # Convert DataFrame to JSON
    json_data = data_columns.to_dict(orient='records')
    
    chart_data = {
        'mds_attr': json_data
    }
    return jsonify(chart_data)

if __name__ == '__main__':
    # serve(app, host='0.0.0.0', port=8080)
    app.run(debug=True)