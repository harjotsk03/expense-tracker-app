import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signOut, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { async } from '@firebase/util';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailLogIn, setEmailLogIn] = useState('');
    const [passwordLogIn, setPasswordLogIn] = useState('');
    const [signedUp, setSignedUp] = useState(false);

    const navigate = useNavigate();

    console.log(auth?.currentUser?.email);

    const checkPassword = () => {
        if(password === confirmPassword){
            signUp();
        } else if (password === '' || confirmPassword === '' || email === '') {
            alert("PLEASE ENTER YOUR EMAIL AND PASSWORD TO SIGN UP!")
        } else {
            alert('PASSWORDS DO NOT MATCH!')
            return;
        }
    }
    
    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);

            setEmail('');
            setPassword('');
            setEmailLogIn('');
            setPasswordLogIn('');
            setSignedUp(false);
            logOut();
        } catch (error) {
            if (error.code === "auth/weak-password") {
                alert("Password is too weak. Choose a stronger password.");
            } else if (error.code === "auth/email-already-in-use") {
                alert("This email address is already in use. Please use a different one.");
            } else if (error.code === "auth/invalid-email") {
                alert("Please enter a valid email address.");
            } else if (error.code === "auth/wrong-password") {
                alert("That password is not correct, please try again.");
            } else if(error.code === "auth/invalid-credential"){
                alert("The email or password you entered is incorrect. If you dont have an account click sign up now!")
            }
            else {
                alert("Something went wrong! Please try to sign up again or ensure you are entering a valid email address/password.");
            }
        }
    };

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, emailLogIn, passwordLogIn);
            navigate('/expense-tracker');
        } catch (error) {
            if (error.code === "auth/weak-password") {
                alert("Password is too weak. Choose a stronger password.");
            } else if (error.code === "auth/email-already-in-use") {
                alert("This email address is already in use. Please use a different one.");
            } else if (error.code === "auth/invalid-email") {
                alert("Please enter a valid email address.");
            } else if (error.code === "auth/wrong-password") {
                alert("That password is not correct, please try again.");
            } else if(error.code === "auth/invalid-credential"){
                alert("The email or password you entered is incorrect. If you dont have an account click sign up now!")
            }
            else {
                alert("Something went wrong! Please try to sign up again or ensure you are entering a valid email address/password.");
            }
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/expense-tracker');
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

    return (
        <>
            <div className='signUpPage'>
                {signedUp ? (
                    <div className='signUpSection'>
                        <button className='buttonPrimary' id='signUpLogInBtn' onClick={() => setSignedUp(false)}>Log In</button>
                        <h1>Sign Up</h1>
        
                        <input placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
                        <input placeholder='Password' type='password' onChange={(e) => setPassword(e.target.value)}/>
                        <input placeholder='Confirm Password' type='password' onChange={(e) => setConfirmPassword(e.target.value)}/>
        
                        <button onClick={checkPassword}>Sign Up</button>
                
                    </div>
                ) : (
                    <div className='logInSection'>   
                        <h1 className='logInSectionTitle'>Sign In</h1>
                        <h4 className='logInSectionSubTitle'>Stay up to date with your finances.</h4>

                        <input id='logInInput' placeholder='Email' onChange={(e) => setEmailLogIn(e.target.value)}/>
                        <input id='logInInput' placeholder='Password' type='password' onChange={(e) => setPasswordLogIn(e.target.value)}/>
                        <button className='forgotPasswordBtn'>FORGOT PASSWORD</button>

                        <button className='buttonPrimary' id='logInBtn' onClick={signIn}>Log In</button>
                        <div className='line'>
                            <div id='line'></div>
                            <div className='orText'>or</div>
                        </div>
                        <button className='buttonSecondary' id='googleBtn' onClick={signInWithGoogle}>Sign In With Google</button>
                        <button className='buttonSecondary' id='faceBookBtn' onClick={signInWithGoogle}>Sign In With Facebook</button>

                        <div className='signUpLogInSwitch'>
                            <h4>New To FinVue?</h4>
                            <button className='' id='signUpLogInBtn' onClick={() => setSignedUp(true)}>Sign Up</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );    
};
