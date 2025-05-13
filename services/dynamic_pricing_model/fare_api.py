from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# Load the model at startup
model = joblib.load("fare_prediction_model.pkl")

# Create FastAPI app
app = FastAPI(title="Uber Fare Prediction API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input schema
class FareRequest(BaseModel):
    distance_km: float
    passenger_count: int
    hour: int
    day_of_week: int
    is_weekend: int
    is_night: int

# Prediction route
@app.post("/predict")
def predict_fare(data: FareRequest):
    input_data = np.array([[ 
        data.distance_km, 
        data.passenger_count,
        data.hour,
        data.day_of_week,
        data.is_weekend,
        data.is_night
    ]])
    
    prediction = model.predict(input_data)[0]
    return {
        "estimated_price": round(float(prediction), 2)
    }
