from flask import Flask, request, jsonify
import joblib
import numpy as np
from datetime import datetime

app = Flask(__name__)
model = joblib.load('model.pkl')

def is_peak_hour(dt):
    hour = dt.hour
    # Example: 7-9am and 5-8pm are peak
    return int((7 <= hour <= 9) or (17 <= hour <= 20))

@app.route('/predict-fare', methods=['POST'])
def predict_fare():
    data = request.json
    print('Received in ML service:', data)
    pickup_time = datetime.fromisoformat(data['pickupTime'].replace('Z', '+00:00'))
    distance = data['distanceCovered']
    rating = data.get('rating', 5)
    hour = pickup_time.hour
    day_of_week = pickup_time.weekday()
    peak = is_peak_hour(pickup_time)
    # Arrange features in the order your model expects
    features = np.array([[distance]])
    fare = model.predict(features)[0]
    return jsonify({"predicted_fare": float(fare)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 