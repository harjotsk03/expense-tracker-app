import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signOut, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fakeLogo from '../images/fakeLogo.svg'; 

export const ExpenseTracker = () => {
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();
    const [profileIsOpen, setProfileIsOpen] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        setUserEmail(auth?.currentUser?.email);
        setUserName(auth?.currentUser?.displayName);
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
    };

    const toggleProfile = () => {
        setProfileIsOpen(!profileIsOpen);
    };

    return (
        <div className='expensePage'>
            <div className="landingPageHeader">
                <div className="landingPageHeaderLogo">
                    <img src={fakeLogo}/>
                    <h1 className="landingPageTitle">Fin<span style={{color: '#ebcb92'}}>Vue</span></h1>
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
                    <button className='buttonPrimary' onClick={logOut}>Log Out</button>
                </div>
                ) : null}
            </div>

        </div>
    );
};
