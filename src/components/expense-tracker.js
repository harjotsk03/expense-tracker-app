import { auth, googleProvider } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fakeLogo from '../images/fakeLogo.svg'; 
import Modal from 'react-modal';


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

  const handleLogout = async () => {
    // Display confirmation modal
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

    
     
    </div>
  );
};
