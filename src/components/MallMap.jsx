import React from 'react';

export default function MallMap() {
  return (
    <div className="bg-white rounded-lg p-2 mt-2 border border-gray-200">
      <div className="bg-blue-50 rounded-lg p-4 relative">
        <h3 className="text-center font-bold text-blue-700 mb-2">Mall Directory</h3>
        
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="bg-blue-100 p-2 rounded">
            <h4 className="font-bold">Level 1</h4>
            <p>Main Entrance, Customer Service, Fashion, Cafés, Apple Store</p>
          </div>
          
          <div className="bg-green-100 p-2 rounded">
            <h4 className="font-bold">Level 2</h4>
            <p>Electronics, Home Goods, Fashion, Banking Services</p>
          </div>
          
          <div className="bg-yellow-100 p-2 rounded">
            <h4 className="font-bold">Level 3</h4>
            <p>Food Court, Kids Zone, Toys, Entertainment</p>
          </div>
          
          <div className="bg-purple-100 p-2 rounded">
            <h4 className="font-bold">Level 4</h4>
            <p>Luxury Brands, Fine Dining, CineMax Theater</p>
          </div>
        </div>
        
        <div className="absolute top-1 right-1">
          <button className="text-xs text-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
}