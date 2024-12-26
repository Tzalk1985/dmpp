import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { FormData } from '../types';
import ReceiptForm from './ReceiptForm';
import ReceiptList from './ReceiptList';
import CalculationCard from './CalculationCard';
import ReactorCalculationCard from './ReactorCalculationCard';
import SummaryCard from './SummaryCard';
import { receiptsService } from '../services/receipts';
import { ReactorCalculation } from '../utils/calculations';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [receipts, setReceipts] = useState<FormData[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<FormData>({
    id: '',
    name: '',
    DMP: '',
    H3PO4: '',
    COLOR: '',
    yellow: '',
    blue: '',
    kilos: '',
    Litre: '',
  });
  const [reactorCalculations, setReactorCalculations] = useState<Record<string, ReactorCalculation[]>>({});
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = receiptsService.subscribeToReceipts((updatedReceipts) => {
      const sortedReceipts = [...updatedReceipts].sort((a, b) => {
        const aKilos = parseFloat(a.kilos);
        const bKilos = parseFloat(b.kilos);
        return sortDirection === 'asc' ? aKilos - bKilos : bKilos - aKilos;
      });
      setReceipts(sortedReceipts);
    });

    return () => unsubscribe();
  }, [user, sortDirection]);

  const handleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleToggleSelect = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        const { id, ...updateData } = currentReceipt;
        await receiptsService.updateReceipt(id, updateData);
        toast.success('Receipt updated successfully');
      } else {
        await receiptsService.addReceipt(currentReceipt);
        toast.success('Receipt added successfully');
      }
      handleClear();
    } catch (error) {
      console.error('Error saving receipt:', error);
      toast.error('Failed to save receipt');
    }
  };

  const handleEdit = (receipt: FormData) => {
    setCurrentReceipt(receipt);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await receiptsService.deleteReceipt(id);
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
      toast.success('Receipt deleted successfully');
    } catch (error) {
      console.error('Error deleting receipt:', error);
      toast.error('Failed to delete receipt');
    }
  };

  const handleClear = () => {
    setCurrentReceipt({
      id: '',
      name: '',
      DMP: '',
      H3PO4: '',
      COLOR: '',
      yellow: '',
      blue: '',
      kilos: '',
      Litre: '',
    });
    setIsEditing(false);
  };

  const handleReactorCalculation = useCallback((receiptId: string, calculations: ReactorCalculation[]) => {
    setReactorCalculations(prev => {
      // Only update if calculations have actually changed
      const currentCalcs = prev[receiptId];
      if (JSON.stringify(currentCalcs) === JSON.stringify(calculations)) {
        return prev;
      }
      return { ...prev, [receiptId]: calculations };
    });
  }, []);

  const selectedReceipts = receipts.filter(receipt => selectedRows.includes(receipt.id));

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow">
          <ReceiptForm
            data={currentReceipt}
            onChange={setCurrentReceipt}
            onSubmit={handleSubmit}
            onClear={handleClear}
            isEditing={isEditing}
          />
        </div>

        <ReceiptList
          receipts={receipts}
          selectedRows={selectedRows}
          onToggleSelect={handleToggleSelect}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {selectedRows.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {selectedRows.length > 1 && (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <SummaryCard 
                  receipts={selectedReceipts}
                  calculations={selectedRows.map(id => reactorCalculations[id] || [])}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {selectedReceipts.map((receipt) => (
                <React.Fragment key={receipt.id}>
                  <CalculationCard receipt={receipt} multiplier={1} />
                  <ReactorCalculationCard 
                    receipt={receipt} 
                    multiplier={1}
                    onCalculate={(calculations) => handleReactorCalculation(receipt.id, calculations)}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}