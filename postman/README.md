# Postman API Testing Instructions

This folder contains a Postman collection to test all microservices APIs in this project.

## How to Use

1. **Import the Collection**
   - Open Postman.
   - Click `Import` and select the `Microservices-API-Collection.json` file in this folder.

2. **Set Environment Variables**
   - You need to set the following variables in your Postman environment:
     - `userBaseUrl` (e.g., `http://localhost:3001` for user-service)
     - `driverBaseUrl` (e.g., `http://localhost:3006` for driver-service)
     - `rideBaseUrl` (e.g., `http://localhost:3007` for ride-service)
     - `paymentBaseUrl` (e.g., `http://localhost:3008` for payment-service)
     - `jwtToken` (Paste a valid JWT token after logging in)

3. **Authentication**
   - Use the `user-service` authentication endpoints to obtain a JWT token.
   - Copy the token and set it as the `jwtToken` environment variable.

4. **Testing APIs**
   - Each folder in the collection corresponds to a microservice (User, Driver, Ride, Payment).
   - Endpoints are pre-configured to use the correct base URL and `jwtToken` variables.
   - Click `Send` to test each endpoint.

5. **Customizing Requests**
   - Edit request bodies and parameters as needed for your test cases.

---

For any issues, check the API documentation or codebase for required fields and expected responses. 