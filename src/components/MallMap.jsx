import React from 'react';

export default function MallMap({ onClose }) {
  return (
    <div className="h-[50vh] sm:h-[400px] w-full bg-white p-2 sm:p-4 overflow-hidden">
      <div className="bg-blue-50 h-full w-full rounded-lg p-2 sm:p-4 overflow-auto">
        <h2 className="text-center text-blue-800 text-sm sm:text-base font-bold mb-2 sm:mb-4">Mall Directory</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Floor 1</h3>
            <ul className="text-[10px] sm:text-xs text-gray-600 space-y-0.5 sm:space-y-1">
              <li>Main Entrance & Information Desk</li>
              <li>Fashion Stores: H&M, Zara, Uniqlo</li>
              <li>Apple Store, Sephora, Starbucks</li>
            </ul>
          </div>
          
          <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Floor 2</h3>
            <ul className="text-[10px] sm:text-xs text-gray-600 space-y-0.5 sm:space-y-1">
              <li>Electronics: Best Buy, Apple Store</li>
              <li>Home Goods: IKEA, Home Depot</li>
              <li>Fashion: Gap, Old Navy</li>
              <li>Banking Services: Chase, Bank of America</li>
            </ul>
          </div>
          
          <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Floor 3</h3>
            <ul className="text-[10px] sm:text-xs text-gray-600 space-y-0.5 sm:space-y-1">
              <li>Food Court: Various Fast Food Outlets</li>
              <li>Kids Zone: Toys "R" Us, LEGO Store</li>
              <li>Entertainment: Arcade, Mini Golf</li>
            </ul>
          </div>
          
          <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Floor 4</h3>
            <ul className="text-[10px] sm:text-xs text-gray-600 space-y-0.5 sm:space-y-1">
              <li>Luxury Brands: Gucci, Prada, Louis Vuitton</li>
              <li>Fine Dining: The Cheesecake Factory, P.F. Chang's</li>
              <li>CineMax Theater: Latest Movies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}