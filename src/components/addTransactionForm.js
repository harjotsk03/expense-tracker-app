import React, { useState } from 'react';

const AddTransactionForm = ({ addTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('expense');

  const handleInputChange = (e) => {
    // Handle input changes for description, amount, and transaction type
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Call addTransaction function passed from ExpenseTracker
    addTransaction({
      description,
      trnasactionAmount: parseFloat(amount),
      transactionType,
    });
    // Reset form fields
    setDescription('');
    setAmount('');
    setTransactionType('expense');
  };

  return (
    <div className='addTransactionsContainer'>
      <h2 className='addTransactionsTitle'>Add Transaction</h2>
      <form onSubmit={onSubmit}>
        {/* Input fields for description, amount, and transaction type */}
        <input
          className='transactionInput'
          placeholder='Transaction'
          type='text'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className='transactionInput'
          type='text'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder='Amount'
        />
        {/* Radio buttons for selecting transaction type */}
        <div className="radio-buttons">
          <label className={`radio-button ${transactionType === 'income' ? 'checked' : ''}`}>
            <input
              type="radio"
              name="incomeType"
              className="radio-input"
              value="income"
              checked={transactionType === 'income'}
              onChange={() => setTransactionType('income')}
            />
            <span className="radio-circle"></span>
            Income
          </label>

          <label className={`radio-button ${transactionType === 'expense' ? 'checked' : ''}`}>
            <input
              type="radio"
              name="incomeType"
              className="radio-input"
              value="expense"
              checked={transactionType === 'expense'}
              onChange={() => setTransactionType('expense')}
            />
            <span className="radio-circle"></span>
            Expense
          </label>
        </div>
        <button className='buttonPrimary' id='logTransactionBtn'>Log Transaction</button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
