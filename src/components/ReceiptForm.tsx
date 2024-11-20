import React from 'react';
import { FormData } from '../types';
import { X } from 'lucide-react';

interface Props {
  data: FormData;
  onChange: (data: FormData) => void;
  onSubmit: () => void;
  onClear: () => void;
  isEditing: boolean;
}

export default function ReceiptForm({ data, onChange, onSubmit, onClear, isEditing }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    
    if (['DMP', 'H3PO4', 'COLOR', 'yellow', 'blue'].includes(name)) {
      const kilos = calculateKilos(newData);
      newData.kilos = kilos.toString();
    }
    
    onChange(newData);
  };

  const calculateKilos = (formData: FormData) => {
    const values = [
      parseFloat(formData.DMP) || 0,
      parseFloat(formData.H3PO4) || 0,
      parseFloat(formData.COLOR) || 0,
      parseFloat(formData.yellow) || 0,
      parseFloat(formData.blue) || 0
    ];
    return values.reduce((sum, value) => sum + value, 0);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {isEditing ? 'Edit Receipt' : 'Add New Receipt'}
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">DMP</label>
          <input
            type="number"
            name="DMP"
            value={data.DMP}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            step="any"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">H3PO4</label>
          <input
            type="number"
            name="H3PO4"
            value={data.H3PO4}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            step="any"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">COLOR</label>
          <input
            type="number"
            name="COLOR"
            value={data.COLOR}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            step="any"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yellow</label>
          <input
            type="number"
            name="yellow"
            value={data.yellow}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            step="any"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blue</label>
          <input
            type="number"
            name="blue"
            value={data.blue}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            step="any"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kilos</label>
          <input
            type="number"
            name="kilos"
            value={data.kilos}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">Auto-calculated</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Litre</label>
          <input
            type="number"
            name="Litre"
            value={data.Litre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            step="any"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}