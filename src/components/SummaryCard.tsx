import React from 'react';
import { FormData } from '../types';
import { Beaker, ChevronDown, ChevronUp } from 'lucide-react';
import { ReactorCalculation, sumReactorCalculations } from '../utils/calculations';

interface Props {
  receipts: FormData[];
  calculations: ReactorCalculation[][];
}

export default function SummaryCard({ receipts, calculations }: Props) {
  const [showDetails, setShowDetails] = React.useState(false);
  const summedCalculations = sumReactorCalculations(calculations);

  const totalDistributed = summedCalculations.reduce(
    (sum, calc) => sum + calc.distributedValue,
    0
  );

  return (
    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Beaker className="w-6 h-6" />
          <div>
            <h3 className="text-xl font-semibold">Combined Reactor Results</h3>
            <p className="text-sm font-medium text-purple-200">
              {receipts.length} receipts combined
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-1 hover:bg-purple-400 rounded-full transition-colors"
        >
          {showDetails ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-purple-600/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Total Chemical Distribution</h4>
          {summedCalculations.map(({ chemical, distributedValue }) => (
            <div key={chemical} className="flex justify-between items-center text-sm py-1">
              <span className="text-purple-100">{chemical}:</span>
              <span className="font-semibold">{distributedValue.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {showDetails && (
          <div className="bg-purple-600/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Individual Receipts</h4>
            {receipts.map((receipt, index) => (
              <div key={receipt.id} className="border-b border-purple-400 last:border-0 py-2">
                <h5 className="font-medium text-purple-100">{receipt.name}</h5>
                <div className="mt-1 space-y-1">
                  {calculations[index]?.map(({ chemical, distributedValue }) => (
                    <div key={chemical} className="flex justify-between text-sm">
                      <span className="text-purple-200">{chemical}:</span>
                      <span>{distributedValue.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-purple-400">
          <div className="text-center">
            <p className="text-3xl font-bold">
              Total: {totalDistributed.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}