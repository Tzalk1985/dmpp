
import { FormData } from "../types";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";

interface Props {
  receipts: FormData[];
  selectedRows: string[];
  onToggleSelect: (id: string) => void;
  onEdit: (receipt: FormData) => void;
  onDelete: (id: string) => void;
  sortDirection: 'asc' | 'desc';
  onSort: () => void;
}

export default function ReceiptList({
  receipts,
  selectedRows,
  onToggleSelect,
  onEdit,
  onDelete,
  sortDirection,
  onSort,
}: Props) {
  if (receipts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No receipts added yet.</p>
      </div>
    );
  }

  // Mobile Card View
  const MobileView = () => (
    <div className="grid grid-cols-1 gap-3 p-4">
      {receipts.map((receipt) => (
        <div
          key={receipt.id}
          className={`bg-white rounded-lg shadow p-4 ${
            selectedRows.includes(receipt.id) ? "ring-2 ring-blue-500" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedRows.includes(receipt.id)}
                onChange={() => onToggleSelect(receipt.id)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <h3 className="font-medium text-gray-900">{receipt.name}</h3>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(receipt)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(receipt.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'DMP', value: receipt.DMP },
              { label: 'H3PO4', value: receipt.H3PO4 },
              { label: 'COLOR', value: receipt.COLOR },
              { label: 'Yellow', value: receipt.yellow },
              { label: 'Blue', value: receipt.blue },
              { label: 'K/T', value: parseFloat(receipt.kilos).toFixed(3) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-sm font-medium">{value}</div>
              </div>
            ))}
            <div className="col-span-3 bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">Litre/Ton</div>
              <div className="text-sm font-medium">{receipt.Litre}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop Table View
  const DesktopView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3 text-left">
              <input
                type="checkbox"
                checked={receipts.length > 0 && selectedRows.length === receipts.length}
                onChange={() => 
                  receipts.forEach(receipt => 
                    selectedRows.includes(receipt.id) 
                      ? onToggleSelect(receipt.id) 
                      : onToggleSelect(receipt.id)
                  )
                }
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              DMP
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              H3PO4
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Color
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Yellow
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Blue
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={onSort}
                className="flex items-center space-x-1 group"
              >
                <span>K/T</span>
                <ArrowUpDown className={`w-4 h-4 ${sortDirection === 'asc' ? '' : 'rotate-180'} text-gray-400 group-hover:text-blue-500`} />
              </button>
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              L/T
            </th>
            <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {receipts.map((receipt) => (
            <tr
              key={receipt.id}
              className={`hover:bg-gray-50 ${
                selectedRows.includes(receipt.id) ? "bg-blue-50" : ""
              }`}
            >
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(receipt.id)}
                  onChange={() => onToggleSelect(receipt.id)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {receipt.name}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {receipt.DMP}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {receipt.H3PO4}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {receipt.COLOR}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {receipt.yellow}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {receipt.blue}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {parseFloat(receipt.kilos).toFixed(2)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {receipt.Litre}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onEdit(receipt)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(receipt.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
        <h2 className="text-sm font-medium text-gray-700">Receipts List</h2>
        <button
          onClick={onSort}
          className="md:hidden flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600"
        >
          <span>Sort by K/T</span>
          <ArrowUpDown className={`w-4 h-4 ${sortDirection === 'asc' ? '' : 'rotate-180'}`} />
        </button>
      </div>
      <div className="block md:hidden">
        <MobileView />
      </div>
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </div>
  );
}