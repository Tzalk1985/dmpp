import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { FormData } from '../types';
import ReceiptForm from './ReceiptForm';
import ReceiptList from './ReceiptList';
import CalculationCard from './CalculationCard';
import ReactorCalculationCard from './ReactorCalculationCard';
import toast from 'react-hot-toast';

const emptyForm: FormData = {
  id: '',
  name: '',
  DMP: '',
  H3PO4: '',
  COLOR: '',
  yellow: '',
  blue: '',
  kilos: '',
  Litre: '',
};

export default function Dashboard() {
  const [receipts, setReceipts] = useState<FormData[]>([]);
  const [currentReceipt, setCurrentReceipt] = useState<FormData>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    try {
      const q = query(collection(db, `users/${user.uid}/receipts`));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const receiptsData: FormData[] = [];
        querySnapshot.forEach((doc) => {
          receiptsData.push({ id: doc.id, ...doc.data() } as FormData);
        });
        setReceipts(receiptsData);
      }, (error) => {
        console.error("Firestore error:", error);
        toast.error('Error loading receipts. Please try again.');
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Setup error:", error);
      toast.error('Error setting up data connection. Please refresh the page.');
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to save receipts');
      return;
    }

    try {
      if (isEditing) {
        const docRef = doc(db, `users/${user.uid}/receipts`, currentReceipt.id);
        await updateDoc(docRef, currentReceipt);
        toast.success('Receipt updated successfully!');
      } else {
        await addDoc(collection(db, `users/${user.uid}/receipts`), currentReceipt);
        toast.success('Receipt added successfully!');
      }
      handleClear();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Error saving receipt. Please try again.');
    }
  };

  const handleEdit = (receipt: FormData) => {
    setCurrentReceipt(receipt);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete receipts');
      return;
    }

    try {
      await deleteDoc(doc(db, `users/${user.uid}/receipts`, id));
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
      toast.success('Receipt deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting receipt. Please try again.');
    }
  };

  const handleClear = () => {
    setCurrentReceipt(emptyForm);
    setIsEditing(false);
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedReceipts = [...receipts].sort((a, b) => {
    const aKilos = parseFloat(a.kilos) || 0;
    const bKilos = parseFloat(b.kilos) || 0;
    return sortDirection === 'asc' ? aKilos - bKilos : bKilos - aKilos;
  });

  const selectedReceipts = sortedReceipts.filter(receipt => 
    selectedRows.includes(receipt.id)
  );

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
          receipts={sortedReceipts}
          selectedRows={selectedRows}
          onToggleSelect={toggleRowSelection}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortDirection={sortDirection}
          onSort={toggleSort}
        />

        {selectedRows.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {selectedReceipts.map((receipt) => (
                <React.Fragment key={receipt.id}>
                  <CalculationCard receipt={receipt} multiplier={1} />
                  <ReactorCalculationCard receipt={receipt} multiplier={1} />
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}