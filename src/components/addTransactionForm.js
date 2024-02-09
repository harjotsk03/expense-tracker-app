import { db ,auth, googleProvider } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fakeLogo from '../images/fakeLogo.webp'; 
import Modal from 'react-modal';
import { useAddTransaction } from '../hooks/useAddTransaction';
import { useGetTransactions } from '../hooks/useGetTransactinos';
import { getDocs, collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { async } from '@firebase/util';
import { BarChart } from './barChart';
import UserImage from './userImage';

export const AddTransactionForm = ({resetForm, setResetForm}) => {
  const [selectedIncomeType, setSelectedIncomeType] = useState(null);
  const [transactionType, setTransactionType] = useState('expense');
  const [userID, setUserID] = useState("");
  const { addTransaction } = useAddTransaction(); // Use the function directly
  const [description, setDescription] = useState('');
  const [trnasactionAmount, setTrnasactionAmount] = useState(0.00);
  const [addingNew, setAddingNew] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileIsOpen, setProfileIsOpen] = useState(false);

  const handleRadioChange = (value) => {
    setSelectedIncomeType(value);
    setTransactionType(value);
  };

  // Watch for changes in resetForm
  useEffect(() => {
    if (resetForm) {
      // Reset the form here
      setDescription('');
      setTrnasactionAmount('0.00');
      setTransactionType('expense');
  
      // After resetting, set resetForm back to false
      setResetForm(false);
    }
  }, [resetForm]);
  
// After adding a transaction, call setResetForm to true
const onSubmit = (e) => {
  e.preventDefault();

  if (userID) {
    addTransaction({
      userID: userID,
      description: description,
      trnasactionAmount: trnasactionAmount,
      transactionType: transactionType,
    });

    // Reset the input fields after submitting the form
    setResetForm(true); // Set resetForm to true here

    // Navigate to '/profile' after a delay of 1000 milliseconds (1 second)
    setTimeout(() => {
      navigate('/');
    }, 500);

    // Navigate to '/expense-tracker' after a delay of 2000 milliseconds (2 seconds)
    setTimeout(() => {
      navigate('/expense-tracker');
    }, 600);
  } else {
    console.error("userID is undefined. Transaction not added.");
  }
};



  

  const handleLogout = async () => {
    setShowConfirmation(true);
  };

  const confirmLogout = async () => {
    try {
      // Proceed with logout
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      // Close the confirmation modal
      setShowConfirmation(false);
    }
  };

  const cancelLogout = () => {
    // Close the confirmation modal
    setShowConfirmation(false);
  };




  useEffect(() => {
    setUserEmail(auth?.currentUser?.email);
    setUserName(auth?.currentUser?.displayName);
    setUserID(auth?.currentUser?.uid); // Use auth?.currentUser?.uid instead of auth?.currentUser?.userID
  }, []);

  

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const toggleProfile = () => {
    setProfileIsOpen(!profileIsOpen);
  };

  const [amount, setAmount] = useState('');
  const [hasPeriod, setHasPeriod] = useState(false);

  const handleInputChange = (e) => {
    // Remove non-numeric and non-'.' characters except '$'
    let sanitizedInput = e.target.value.replace(/[^0-9.$]/g, '');

    // Check if the input does not already start with '$'
    if (!sanitizedInput.startsWith('$')) {
      sanitizedInput = '$' + sanitizedInput;
    }

    // Ensure only one period in the input
    const parts = sanitizedInput.split('.');
    if (parts.length > 2) {
      // More than one period found, remove the last one
      parts.pop();
      sanitizedInput = parts.join('.');
    }

    // Update the state for the period existence
    setHasPeriod(parts.length === 2);

    // Ensure only two digits after the decimal point
    if (parts.length === 2) {
      const decimalPart = parts[1].slice(0, 2);
      sanitizedInput = `${parts[0]}.${decimalPart}`;
    }

    setTrnasactionAmount(sanitizedInput);
    setAmount(sanitizedInput);
  };

  const deleteTransaction = async (transactionId) => {
    try {
      const transactionDoc = doc(db, "transactions", transactionId);
      await deleteDoc(transactionDoc);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className='addTransactionsContainer'>
          <h2 className='addTransactionsTitle'>Add Transaction</h2>
          <form onSubmit={onSubmit}>
            <input className='transactionInput' placeholder='Transaction' type='text' onChange={(e) => setDescription(e.target.value)}/>
            <input
              type="text"
              value={amount}
              className="transactionInput"
              onChange={handleInputChange}
              placeholder="Amount"
              onKeyDown={(e) => {
                // Prevent typing additional periods
                if (e.key === '.' && hasPeriod) {
                  e.preventDefault();
                }
              }}
            />
            <div className="radio-buttons">
              <label className={`radio-button ${selectedIncomeType === 'income' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="incomeType"
                  className="radio-input"
                  value="income"
                  onChange={() => handleRadioChange('income')}
                />
                <span className="radio-circle"></span>
                Income
              </label>

              <label className={`radio-button ${selectedIncomeType === 'expense' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="incomeType"
                  className="radio-input"
                  value="expense"
                  onChange={() => handleRadioChange('expense')}
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
