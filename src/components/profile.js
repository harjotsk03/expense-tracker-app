import { auth, googleProvider, storage } from '../config/firebase';
import { createUserWithEmailAndPassword, signOut, signInWithPopup, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { Form, useNavigate } from 'react-router-dom';
import defaultPhoto from '../images/fakeLogo.webp'; 
import { upload } from '@testing-library/user-event/dist/upload';
import Modal from 'react-modal';
import { useSendFeedback } from '../hooks/useSendFeedback';
import FirebaseImageUpload from './FIrebaseImageUpload';


Modal.setAppElement('#root'); // Set the root element for accessibility

const CustomModal = ({ isOpen, onRequestClose, onConfirm, onCancel }) => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="custom-modal"
        overlayClassName="overlay"
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


export const Profile = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [fileUpload, setFileUpload] = useState(null);
    const [profileIsOpen, setProfileIsOpen] = useState(false);
    const [personalInfo, setPersonalInfo] = useState(true);
    const [cardWallet, setCardWallet] = useState(false);
    const [support, setSupport] = useState(false);
    const [activeTab, setActiveTab] = useState('personalInfo');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { addFeedback } = useSendFeedback(); // Extract transactions from the hook
    const [userID, setUserID] = useState("");
    const [feedBack, setFeedback] = useState('');


    const handleLogout = async () => {
      // Display confirmation modal
      setShowConfirmation(true);
    };


    useEffect(() => {
        setUserID(auth?.currentUser?.uid); // Use auth?.currentUser?.uid instead of auth?.currentUser?.userID
    }, []);

    
    const onSubmit = (e) => {
        e.preventDefault();
      
        if (userID) {
          addFeedback({
            userID: userID,
            text: feedBack,
          });
      
        } else {
          console.error("userID is undefined. Transaction not added.");
        }

        setFeedback('');
      };
      

    const confirmLogout = async () => {
        // Proceed with logout
        try {
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

    const personalInfoTab = () => {
        setPersonalInfo(true);
        setCardWallet(false);
        setSupport(false);
        setActiveTab('personalInfo');
      };
      
      const cardsTab = () => {
        setPersonalInfo(false);
        setCardWallet(true);
        setSupport(false);
        setActiveTab('cardWallet');
      };
      
      const supportTab = () => {
        setPersonalInfo(false);
        setCardWallet(false);
        setSupport(true);
        setActiveTab('support');
      };
      
    const toggleProfile = () => {
        setProfileIsOpen(!profileIsOpen);
    };

    const copyEmail = async () => {
        try {
          await navigator.clipboard.writeText('finvue@support.com');
          alert('Copied to clipboard!');
        } catch (err) {
          console.error('Unable to copy to clipboard.', err);
          alert('Copy to clipboard failed. Please copy manually.');
        }
      };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
                setUserName(user.displayName || '');
                setUserPhoto(user.photoURL || defaultPhoto);
            } else {
                // User is not logged in, navigate to login page or handle as needed
                navigate('/login');
            }
        });

        return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
    }, [navigate]);

    const splitName = userName.split(" ");


    const backToDash = () => {
        navigate('/expense-tracker');
    };

    const handleDisplayNameChange = (newDisplayName) => {
        const user = auth.currentUser;

        if (newDisplayName === '' || userName === '' || setUserName === ''){
            alert("You must enter a new username! (Or re-enter you original name!");
            return;
        } else{
            updateProfile(user, { displayName: newDisplayName })
            .then(() => {
                setUserName(newDisplayName);
                setIsEditingName(false);
                console.log('Display name updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating display name:', error.message);
            });
        }
    };

    const uploadFile = async () => {
        if (!fileUpload) return;
        const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
        try{
            await uploadBytes(filesFolderRef, fileUpload);
            setFileUpload(null);
        } catch (error) {
            console.error(error);
        }
    };

    const logOut = async () => {
        // Display confirmation dialog
        const confirmLogout = window.confirm('Are you sure you want to log out?');
        if (confirmLogout) {
          try {
            // Proceed with logout
            await signOut(auth);
            navigate('/');
          } catch (error) {
            console.error(error);
          }
        }
      };


    const goToProfile = () => {
        navigate('/profile');
    };

    return (
        <div className='profilePage'>
            <div className="profilePageHeader">
                <button className='buttonPrimary' id='backToDash' onClick={backToDash}><span id='arrowBack'>R </span> Back To Dashboard</button>        
                
                <div className='userInfoProfileHeader'>
                    <h4 className='userNameHeader'>{userName}</h4>
                    <button id='arrowBtn' onClick={toggleProfile}>{profileIsOpen ? 
                    <div className='closed'>S</div> 
                    : <div className='opened'>T</div>
                    }</button>
                </div>
            </div>
            <div className={profileIsOpen ? 'dropDownProfile open' : 'dropDownProfile'}>
                {profileIsOpen ? (
                <div className='dropDownContent'>
                    <button className='buttonSecondary' id='profileBtn' onClick={goToProfile}>
                    Profile
                    </button>
                    <button className='buttonPrimary' id='logBtn' onClick={logOut}>Log Out</button>
                </div>
                ) : null}
            </div>
            <div className='profilePageContentLeft'>
                <button
                onClick={personalInfoTab}
                className={`buttonPrimary ${activeTab === 'personalInfo' ? 'activeButton' : 'personalInfo'}`}
                id='profileSideBarBtns'
                >
                Personal Information
                </button>

                <button
                onClick={cardsTab}
                className={`buttonPrimary ${activeTab === 'cardWallet' ? 'activeButton' : 'cardWallet'}`}
                id='profileSideBarBtns'
                >
                Cards & Wallet
                </button>

                <button
                onClick={supportTab}
                className={`buttonPrimary ${activeTab === 'support' ? 'activeButton' : 'support'}`}
                id='profileSideBarBtns'
                >
                Support
                </button>

                <button className='buttonPrimary' id='logOutProfileSide' onClick={handleLogout}>Log Out</button>
                <div className='modalBox'>
                    <CustomModal
                    isOpen={showConfirmation}
                    onRequestClose={cancelLogout}
                    onConfirm={confirmLogout}
                    onCancel={cancelLogout}
                    />
                </div>          

            </div>
            <div className='profilePageContent'>
                    {personalInfo ? (
                        <div>
                            <h1 className='profilePageTitle'>Personal Information</h1>
                            <FirebaseImageUpload />
                            <div className='userName'>
                                {isEditingName ? (
                                    <div className='editNameFalse'>
                                        <div className='nameContainer'>
                                            <label className='nameLabel'>First Name</label>
                                            <input
                                                type="text"
                                                className='nameBox'
                                                value={splitName[0]}
                                                onChange={(e) => setUserName(`${e.target.value} ${splitName[1]}`)}
                                            />
                                        </div>
                                        <div className='nameContainer'>
                                            <label className='nameLabel'>Last Name</label>
                                            <input
                                                className='nameBox'
                                                type="text"
                                                value={splitName[1]}
                                                onChange={(e) => setUserName(`${splitName[0]} ${e.target.value}`)}
                                            />
                                        </div>
                                        <button className='editNameBtn' onClick={() => handleDisplayNameChange(userName)}>V</button>
                                        <button className='editNameBtn2' onClick={() => handleDisplayNameChange(userName)}>V</button>
                                    </div>
                                ) : (
                                    <div className='editNameTrue'>
                                        <div className='nameContainer'>
                                            <label className='nameLabel'>First Name</label>
                                            <p className='nameBox' id='nameBox'>{splitName[0]}</p>
                                        </div>
                                        <div className='nameContainer'>
                                            <label className='nameLabel'>Last Name</label>
                                            <p className='nameBox' id='nameBox'>{splitName[1]}</p>
                                        </div>
                                        <button className='editNameBtn' onClick={() => setIsEditingName(true)}>E</button>
                                        <button className='editNameBtn2' onClick={() => setIsEditingName(true)}>E</button>
                                    </div>
                                )}
                            </div>
                            <div className='nameContainer'>
                                <label className='nameLabel'>Email</label>
                                <p className='emailBox'>{userEmail}</p>
                            </div>

                            {/*
                            <div>
                                <input className='' type='file' onChange={(e) => setFileUpload(e.target.files[0])}/>
                                <button onClick={uploadFile}>Upload File</button>
                            </div>
                            */}
                        </div>
                    ) : cardWallet ? (
                        <div>
                            <h1 className='profilePageTitle'>Cards & Wallet</h1>
                        </div>
                    ) : support ? (
                        <div>
                            <h1 className='profilePageTitle'>Support</h1>
                            <div className='supportEmail'>
                                <p className='supportEmailMain'>Send us an email.</p>
                                <p className='supportEmailEmail'>finvue@support.com</p>
                                <button onClick={copyEmail} className='supportEmailBtn'>A</button>
                            </div>
                            <div className='supportEmail'>
                                <p className='supportEmailMain'>Give us a call.</p>
                                <p className='supportEmailEmail'>(888)-888-8888</p>
                                <button onClick={copyEmail} className='supportPhoneBtn'>A</button>
                            </div>
                            <div>
                                <form onSubmit={onSubmit} className='supportForm'>
                                    <label className='supportFormLabel'>Please give any and all feedback and/or issues.</label>
                                    <textarea value={feedBack} onChange={(e) => setFeedback(e.target.value)} className='supportFormBox'></textarea>
                                    <button className='buttonPrimary' id='supportFormBtn'>Submit</button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className='profilePageTitle'>Unknown</h1>
                        </div>
                    )}
            </div>
        </div>
    );
};
