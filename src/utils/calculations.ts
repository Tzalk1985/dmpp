// Utility functions for chemical calculations
export interface ChemicalValues {
  DMP: number;
  H3PO4: number;
  COLOR: number;
  yellow: number;
  blue: number;
}

export interface ReactorCalculation {
  chemical: keyof ChemicalValues;
  originalValue: number;
  ratio: number;
  distributedValue: number;
}

export const parseChemicalValues = (receipt: {
  DMP: string;
  H3PO4: string;
  COLOR: string;
  yellow: string;
  blue: string;
}): ChemicalValues => ({
  DMP: parseFloat(receipt.DMP) || 0,
  H3PO4: parseFloat(receipt.H3PO4) || 0,
  COLOR: parseFloat(receipt.COLOR) || 0,
  yellow: parseFloat(receipt.yellow) || 0,
  blue: parseFloat(receipt.blue) || 0,
});

export const calculateTotal = (values: ChemicalValues): number => {
  return Object.values(values).reduce((sum, value) => sum + value, 0);
};

export const calculateRatios = (values: ChemicalValues): Record<keyof ChemicalValues, number> => {
  const total = calculateTotal(values);
  return Object.entries(values).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: total > 0 ? value / total : 0,
  }), {} as Record<keyof ChemicalValues, number>);
};

export const calculateReactorDistribution = (
  receipt: ChemicalValues,
  totalInput: number,
  multiplier: number
): ReactorCalculation[] => {
  const ratios = calculateRatios(receipt);
  return Object.entries(receipt).map(([chemical, value]) => ({
    chemical: chemical as keyof ChemicalValues,
    originalValue: value,
    ratio: ratios[chemical as keyof ChemicalValues],
    distributedValue: totalInput * ratios[chemical as keyof ChemicalValues] * multiplier,
  }));
};

export const sumReactorCalculations = (calculations: ReactorCalculation[][]): ReactorCalculation[] => {
  const summedByChemical = calculations.flat().reduce((acc, calc) => {
    if (!acc[calc.chemical]) {
      acc[calc.chemical] = {
        chemical: calc.chemical,
        originalValue: calc.originalValue,
        ratio: calc.ratio,
        distributedValue: calc.distributedValue,
      };
    } else {
      acc[calc.chemical].distributedValue += calc.distributedValue;
    }
    return acc;
  }, {} as Record<keyof ChemicalValues, ReactorCalculation>);

  return Object.values(summedByChemical);
};