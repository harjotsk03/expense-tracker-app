import { auth, googleProvider, storage } from '../config/firebase';
import { createUserWithEmailAndPassword, signOut, signInWithPopup, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import defaultPhoto from '../images/fakeLogo.svg'; 
import { upload } from '@testing-library/user-event/dist/upload';
import fakeLogo from '../images/fakeLogo.svg'; 


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


    const personalInfoTab = () => {
        setPersonalInfo(true);
        setCardWallet(false);
        setSupport(false);
    };

    const cardsTab = () => {
        setPersonalInfo(false);
        setCardWallet(true);
        setSupport(false);
    };

    const supportTab = () => {
        setPersonalInfo(false);
        setCardWallet(false);
        setSupport(true);
    };
    const toggleProfile = () => {
        setProfileIsOpen(!profileIsOpen);
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
                    <button onClick={personalInfoTab} className='buttonPrimary' id='profileSideBarBtns'>Personal Information</button>
                    <button onClick={cardsTab} className='buttonPrimary' id='profileSideBarBtns'>Cards & Wallet</button>
                    <button onClick={supportTab} className='buttonPrimary' id='profileSideBarBtns'>Support</button>
                    <button onClick={logOut} className='buttonPrimary' id='profileSideBarBtns'>Log Out</button>
            </div>
            <div className='profilePageContent'>
                    {personalInfo ? (
                        <div>
                            <h1 className='profilePageTitle'>Personal Information</h1>

                            { isEditingPhoto ? (
                                <div>
                                    <label>Update Profile Photo:</label>
                                </div>
                            ) : (
                                <div className='profilePhoto'>
                                    <img src={userPhoto} alt="User Photo" />
                                </div>
                            )}

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
