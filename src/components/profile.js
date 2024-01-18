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

            </div>
            <div className='profilePageContent'>
                <div>
                    <h1 className='profilePageTitle'>My Profile</h1>

                    { isEditingPhoto ? (
                        <div>
                            <label>Update Profile Photo:</label>
                        </div>
                    ) : (
                        <div>
                            <img style={{ width: '100px' }} src={userPhoto} alt="User Photo" />
                        </div>
                    )}

                    {isEditingName ? (
                        <div>
                            <label>Update Display Name:</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <button onClick={() => handleDisplayNameChange(userName)}>Save</button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <p>{userName}</p>
                                <button onClick={(e) => setIsEditingName(true)}>Edit Name</button>
                            </div>
                        </>
                    )}

                    <p>{userEmail}</p>


                    <div>
                        <input className='' type='file' onChange={(e) => setFileUpload(e.target.files[0])}/>
                        <button onClick={uploadFile}>Upload File</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
