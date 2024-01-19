import { auth, googleProvider, storage } from '../config/firebase';
import { createUserWithEmailAndPassword, signOut, signInWithPopup, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import defaultPhoto from '../images/fakeLogo.svg'; 
import { upload } from '@testing-library/user-event/dist/upload';
import fakeLogo from '../images/fakeLogo.svg'; 
import { async } from '@firebase/util';

export const LogOutConfirm = () => {
    const navigate = useNavigate();

    const logOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const cancleLogOut = () => {
        navigate('/profile');
    };
    
    return(
        <div className="confirmLogOut">
            <button onClick={logOut}>Yes, Log Out</button>
            <button onClick={cancleLogOut}>Cancle</button>
        </div>
    )
}