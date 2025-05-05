import csv
from datetime import datetime

def generate_ssn(index):
    return f"{index:09d}"[:3] + '-' + f"{index:09d}"[3:5] + '-' + f"{index:09d}"[5:]

def generate_email(index):
    return f"john_{index + 1}@example.com"

def generate_phone(index):
    return f"555-{(1000 + index):04d}"

def generate_license_number(index):
    return f"DL{10000 + index}"

def generate_synthetic_data(num_records):
    data = []

    for i in range(1, num_records + 1):
        ssn = generate_ssn(i)
        first_name = "John"
        last_name = "Doe"
        email = generate_email(i)
        phone = generate_phone(i)
        address = f"{123 + i} Main St"
        city = "Anytown"
        state = "CA"
        zip_code = f"{90000 + (i % 10000):05d}"  # Rotate within CA zip codes
        license_number = generate_license_number(i)
        vehicle_make = "Toyota"
        vehicle_model = "Camry"
        vehicle_year = 2015 + (i % 10)  # Rotate years 2015–2024
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        updated_at = created_at

        data.append([
            ssn, first_name, last_name, email, phone, address,
            city, state, zip_code, license_number, vehicle_make,
            vehicle_model, vehicle_year, created_at, updated_at
        ])
    
    return data

# --- CONFIG ---
num_records = 10000  # Change as needed

# --- GENERATE & SAVE ---
synthetic_data = generate_synthetic_data(num_records)

with open('synthetic_data.csv', mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow([
        "ssn", "firstName", "lastName", "email", "phone", "address",
        "city", "state", "zip", "licenseNumber", "vehicleMake",
        "vehicleModel", "vehicleYear", "createdAt", "updatedAt"
    ])
    writer.writerows(synthetic_data)

print(f"✅ Generated {num_records} records and saved to 'synthetic_data.csv'")
