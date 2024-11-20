import React, { useState } from 'react';
import { FormData } from '../types';
import { Beaker, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  receipt: FormData;
  multiplier: number;
}

export default function ReactorCalculationCard({ receipt, multiplier }: Props) {
  const [totalInput, setTotalInput] = useState<number>(0);
  const [showDetails, setShowDetails] = useState(false);

  const getOriginalRatios = () => {
    const values = [
      { label: 'DMP', value: parseFloat(receipt.DMP) || 0 },
      { label: 'H3PO4', value: parseFloat(receipt.H3PO4) || 0 },
      { label: 'COLOR', value: parseFloat(receipt.COLOR) || 0 },
      { label: 'Yellow', value: parseFloat(receipt.yellow) || 0 },
      { label: 'Blue', value: parseFloat(receipt.blue) || 0 }
    ];
    
    const total = values.reduce((sum, { value }) => sum + value, 0);
    return values.map(item => ({
      ...item,
      ratio: total > 0 ? item.value / total : 0,
      distributedValue: total > 0 ? (item.value / total) * totalInput * multiplier : 0
    }));
  };

  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Beaker className="w-5 h-5 sm:w-6 sm:h-6" />
          <div>
            <h3 className="text-lg sm:text-xl font-semibold">IN REACTOR</h3>
            <p className="text-sm sm:text-md font-bold text-green-100">{receipt.name}</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-1 hover:bg-green-400 rounded-full transition-colors"
        >
          {showDetails ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-green-100 mb-1">
            Total Reactor Input
          </label>
          <input
            type="number"
            value={totalInput}
            onChange={(e) => setTotalInput(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 bg-green-600 border border-green-400 rounded-md text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-300"
            min="0"
            step="any"
            placeholder="Enter total value"
          />
        </div>

        <div className="bg-green-600/50 p-3 sm:p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm sm:text-base">Distribution Results</h4>
          {getOriginalRatios().map(({ label, ratio, distributedValue }) => (
            <div key={label} className="flex justify-between items-center text-xs sm:text-sm py-1">
              <span className="text-green-100">{label}:</span>
              <div className="text-right">
                <span className="text-green-100">{(ratio * 100).toFixed(1)}% = </span>
                <span className="font-semibold">{distributedValue.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {showDetails && (
          <div className="bg-green-600/50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm sm:text-base">Original Values</h4>
            {getOriginalRatios().map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center text-xs sm:text-sm py-1">
                <span className="text-green-100">{label}:</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}