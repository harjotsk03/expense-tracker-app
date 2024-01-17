import { auth, googleProvider, storage } from '../config/firebase';
import { createUserWithEmailAndPassword, signOut, signInWithPopup, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import defaultPhoto from '../images/fakeLogo.svg'; 
import { upload } from '@testing-library/user-event/dist/upload';

export const Profile = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [fileUpload, setFileUpload] = useState(null);

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
    }

    return (
        <div>
            <h1>Profile</h1>
            <button onClick={backToDash}>Back To Dashboard</button>        

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
                <input type='file' onChange={(e) => setFileUpload(e.target.files[0])}/>
                <button onClick={uploadFile}>Upload File</button>
            </div>
        </div>
    );
};
