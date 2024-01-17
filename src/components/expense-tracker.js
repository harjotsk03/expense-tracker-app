import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signOut, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ExpenseTracker = () => {
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setUserEmail(auth?.currentUser?.email);
    }, []);
    console.log(auth?.currentUser?.email);

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
    }

    return (
        <div>
            <h1>Expense Tracker</h1>

            <button onClick={logOut}>Log Out</button>

            <button onClick={goToProfile}>Profile</button>

        </div>
    );
};
