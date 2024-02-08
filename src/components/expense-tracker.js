import { db ,auth, googleProvider } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fakeLogo from '../images/fakeLogo.svg'; 
import Modal from 'react-modal';
import { useAddTransaction } from '../hooks/useAddTransaction';
import { useGetTransactions } from '../hooks/useGetTransactinos';
import { getDocs, collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { async } from '@firebase/util';
import { BarChart } from './barChart';




Modal.setAppElement('#root'); // Set the root element for accessibility

const CustomModal = ({ isOpen, onRequestClose, onConfirm, onCancel }) => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="custom-modal" // Apply the custom class for styling
        overlayClassName="overlay" // Apply the overlay class for styling
        contentLabel="Confirmation Modal"
      >
        <p>Are you sure you want to log out?</p>
        <div className='confirmContainer'>
            <button className='buttonSecondary' onClick={onConfirm}>Log Out</button>
            <button className='buttonPrimary' onClick={onCancel}>Cancel</button>
        </div>
      </Modal>
    );
};

export const ExpenseTracker = () => {
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const [profileIsOpen, setProfileIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedIncomeType, setSelectedIncomeType] = useState(null);
  const { addTransaction } = useAddTransaction(); // Use the function directly
  const { transactions, transactionIds, balance } = useGetTransactions(); // Extract transactions from the hook
  const [userID, setUserID] = useState("");

  const [description, setDescription] = useState('');
  const [trnasactionAmount, setTrnasactionAmount] = useState(0.00);
  const [transactionType, setTransactionType] = useState('expense');


  const handleRadioChange = (value) => {
    setSelectedIncomeType(value);
    setTransactionType(value);
  };

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
    setDescription('');
    setTrnasactionAmount('0.00');
    setTransactionType('expense');
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
    <div className='expensePage'>
      <div className="landingPageHeader">
        <div className="landingPageHeaderLogo">
          <img src={fakeLogo} alt="Logo" />
          <h1 className="landingPageTitle">Fin<span style={{ color: '#ebcb92' }}>Vue</span></h1>
        </div>

        <div className='userInfoHeader'>
          <h4 className='userNameHeader'>{userName}</h4>
          <button id='arrowBtn' onClick={toggleProfile}>{profileIsOpen ?
            <div className='closed'>S</div>
            : <div className='opened'>T</div>
          }</button>
        </div>
      </div>
      <div className={profileIsOpen ? 'dropDown open' : 'dropDown'}>
        {profileIsOpen ? (
          <div className='dropDownContent'>
            <button className='buttonSecondary' id='profileBtn' onClick={goToProfile}>
              Profile
            </button>
            <button className='buttonPrimary' onClick={handleLogout}>Log Out</button>
            <div className='modalBox'>
                <CustomModal
                isOpen={showConfirmation}
                onRequestClose={cancelLogout}
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
                />
            </div>          
            </div>
        ) : null}
      </div>
      <div className='balanceContainer'>
        <h1 className='balanceTitle'>Current Balance</h1>
        <h4 className='balanceAmount'>${balance.toFixed(2)}</h4>
      </div>
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
      <div className='stocksContainer'>
          <h2 className='stocksTitle'>Stock Market</h2>
      </div>
      <div className='transactionsContainer'>
        <h1 className='transactionsTitle'>Transaction</h1>
        {transactions.length === 0 ? (
          <div className='loadingContainer'>
            <p className='loader'></p>
          </div>
        ) : (
          <ul className='transactionsList'>
            {transactions.map((transaction) => {
              const { description, transactionType, trnasactionAmount } = transaction;
              return (
                <li key={transaction.id}>
                  <div className='transaction'>
                    <div>
                      <h4 className='transactionTitle'>{description}</h4>
                      <p className='transactionLine'> {trnasactionAmount.toFixed(2)} - <label>{transactionType}</label></p>
                    </div>
                    <button onClick={() => deleteTransaction(transaction.id)}>U</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className='chart'>
        <BarChart />
      </div>
      
    </div>
  );
};
