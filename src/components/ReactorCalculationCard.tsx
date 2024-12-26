import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FormData } from '../types';
import { Beaker, ChevronDown, ChevronUp } from 'lucide-react';
import { parseChemicalValues, calculateReactorDistribution } from '../utils/calculations';

interface Props {
  receipt: FormData;
  multiplier: number;
  onCalculate?: (calculations: ReturnType<typeof calculateReactorDistribution>) => void;
}

export default function ReactorCalculationCard({ receipt, multiplier, onCalculate }: Props) {
  const [totalInput, setTotalInput] = useState<number>(0);
  const [showDetails, setShowDetails] = useState(false);

  // Memoize chemical values parsing to prevent unnecessary recalculations
  const values = useMemo(() => parseChemicalValues(receipt), [receipt]);
  
  // Memoize calculations to prevent unnecessary recalculations
  const calculations = useMemo(() => 
    calculateReactorDistribution(values, totalInput, multiplier),
    [values, totalInput, multiplier]
  );

  // Memoize the callback to prevent unnecessary effects
  const notifyCalculations = useCallback(() => {
    onCalculate?.(calculations);
  }, [calculations, onCalculate]);

  // Only trigger onCalculate when calculations actually change
  useEffect(() => {
    notifyCalculations();
  }, [notifyCalculations]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalInput(Math.max(0, Number(e.target.value)));
  }, []);

  const toggleDetails = useCallback(() => {
    setShowDetails(prev => !prev);
  }, []);

  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Beaker className="w-6 h-6" />
          <div>
            <h3 className="text-xl font-semibold text-blue-600">REACTOR</h3>
            <p className="text-lg font-bold text-red-600">{receipt.name}</p>
          </div>
        </div>
        <button
          onClick={toggleDetails}
          className="p-1 hover:bg-green-400 rounded-full transition-colors"
        >
          {showDetails ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-md font-medium text-white-100 mb-1">
            Total Reactor Input
          </label>
          <input
            type="number"
            value={totalInput}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-green-600 border border-green-400 rounded-md text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-300"
            min="0"
            step="any"
            placeholder="Enter total value"
          />
        </div>

        <div className="bg-green-600/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Distribution Results</h4>
          {calculations.map(({ chemical, ratio, distributedValue }) => (
            <div key={chemical} className="flex justify-between items-center text-sm py-1">
              <span className="block text-md font-medium text-white-100">{chemical}:</span>
              <div className="text-right">
                <span className="text-green-100">
                  {(ratio * 100).toFixed(1)}% × {totalInput} = 
                </span>
                <span className="font-semibold">{distributedValue.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {showDetails && (
          <div className="bg-green-600/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Original Values</h4>
            {calculations.map(({ chemical, originalValue }) => (
              <div key={chemical} className="flex justify-between items-center text-sm py-1">
                <span className="text-green-100">{chemical}:</span>
                <span className="font-semibold">{originalValue}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}