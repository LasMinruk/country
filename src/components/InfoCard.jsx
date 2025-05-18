// Import React
import React from "react";

// Simple card component for displaying label-value pairs
const InfoCard = ({ label, value }) => (
  <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-lg font-semibold text-gray-800">{value}</p>
  </div>
);

export default InfoCard;
