import React, { useState } from 'react';
import { FormData } from '../types';
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  receipt: FormData;
  multiplier: number;
}

export default function CalculationCard({ receipt, multiplier: globalMultiplier }: Props) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [localMultiplier, setLocalMultiplier] = useState<number>(1);

  const getValues = () => [
    { label: 'DMP', value: parseFloat(receipt.DMP) || 0 },
    { label: 'H3PO4', value: parseFloat(receipt.H3PO4) || 0 },
    { label: 'COLOR', value: parseFloat(receipt.COLOR) || 0 },
    { label: 'Yellow', value: parseFloat(receipt.yellow) || 0 },
    { label: 'Blue', value: parseFloat(receipt.blue) || 0 }
  ];

  const calculateTotal = () => {
    return getValues().reduce((acc, { value }) => acc + value, 0) * globalMultiplier * localMultiplier;
  };

  const getMultipliedValues = () => {
    return getValues().map(item => ({
      ...item,
      multipliedValue: item.value * globalMultiplier * localMultiplier
    }));
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calculator className="w-6 h-6" />
          <div>
            <h3 className="text-xl font-semibold">Calculation Reciept</h3>
            <p className="text-lg font-bold text-green-400">{receipt.name}</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-1 hover:bg-blue-400 rounded-full transition-colors"
        >
          {showDetails ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

        <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-blue-100">Kilos/Ton: {calculateTotal() / (globalMultiplier * localMultiplier)}</p>
          <div className="space-y-1">
            <div>
              <label className="block text-md font-medium text-white-100 mb-1">
                Tons For Production
              </label>
              <input
                type="number"
                value={localMultiplier}
                onChange={(e) => setLocalMultiplier(Math.max(0.01, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-blue-600 border border-blue-400 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 bg-blue-600/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Multiplied Values</h4>
          {getMultipliedValues().map(({ label, value, multipliedValue }) => (
            <div key={label} className="flex justify-between items-center text-sm">
              <span className="block text-md font-medium text-white-100">{label}:</span>
              <div className="text-right">
                <span className="text-blue-100">
                  {value} × {localMultiplier} = 
                </span>
                <span className="font-semibold">{multipliedValue.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {showDetails && (
          <div className="mt-4 space-y-2 bg-blue-600/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Original Values</h4>
            {getValues().map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center text-sm">
                <span className="text-blue-100">{label}:</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-blue-400">
          <div className="text-center">
            <p className="text-3xl font-bold">Total: {calculateTotal().toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}