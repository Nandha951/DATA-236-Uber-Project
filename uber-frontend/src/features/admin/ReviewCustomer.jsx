import React, { useEffect, useState } from 'react';
import { getAllCustomers } from '../../api/customerAPI';

const ReviewCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch customers", err);
        setError("Failed to load customers.");
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Accounts</h2>
      {loading ? (
        <p>Loading customers...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="py-2 px-4 border">{customer._id}</td>
                  <td className="py-2 px-4 border">{customer.firstName} {customer.lastName}</td>
                  <td className="py-2 px-4 border">{customer.email}</td>
                  <td className="py-2 px-4 border">{customer.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewCustomer;
