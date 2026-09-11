import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';
import { ExpenseForm } from '../expenses/ExpenseForm';
import { useExpenses } from '../../context/ExpenseContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../common/Toast';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { addExpense, updateExpense, deleteExpense } = useExpenses();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setExpenseModalOpen(true);
  };

  const handleOpenEdit = (expense) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleCloseModal = () => {
    setExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const handleSaveExpense = async (formData) => {
    setActionLoading(true);
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, formData);
        addToast(t('expenseForm.toastEditSuccess'), 'success');
      } else {
        await addExpense(formData);
        addToast(t('expenseForm.toastAddSuccess'), 'success');
      }
      handleCloseModal();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to save expense.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingExpense) return;
    setActionLoading(true);
    try {
      await deleteExpense(deletingExpense.id);
      addToast(t('expenseForm.toastDeleteSuccess'), 'info');
      setDeletingExpense(null);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to delete expense.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main page content wrapper */}
      <div className="main-content">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAddExpense={handleOpenAdd}
        />
        <main className="page-body">
          <Outlet
            context={{
              onOpenAddExpense: handleOpenAdd,
              onOpenEditExpense: handleOpenEdit,
              onOpenDeleteExpense: setDeletingExpense
            }}
          />
        </main>
      </div>

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={handleCloseModal}
        title={editingExpense ? t('expenseForm.editTitle') : t('expenseForm.addTitle')}
      >
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={handleSaveExpense}
          onCancel={handleCloseModal}
          loading={actionLoading}
        />
      </Modal>

      {/* Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingExpense)}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleConfirmDelete}
        title={t('confirmModal.title')}
        message={
          deletingExpense
            ? t('confirmModal.confirmMessage', {
                title: deletingExpense.title,
                amount: Number(deletingExpense.amount).toFixed(2)
              })
            : ''
        }
        cancelText={t('confirmModal.cancelBtn')}
        confirmText={t('confirmModal.deleteBtn')}
        loading={actionLoading}
      />
    </div>
  );
};
