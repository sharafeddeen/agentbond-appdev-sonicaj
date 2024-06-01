'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import app from '../firebase-init';
import styles from './page.module.css';
import '../globals.css';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // State to track loading
    const [error, setError] = useState({condition: false, message: null}); // If there's an error logging in

    const provider = new GoogleAuthProvider();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); // Set loading to true while logging in
            await signInWithEmailAndPassword(getAuth(app), email, password);
        } catch (error) {
            setError({condition: true, message: error.message});
            console.error('Error logging in: ', error.message);
        } finally {
            // setting timeout to test loading animation
            setTimeout(() => {
                //setLoading(false); // Reset loading state
                router.push('/home'); // Redirect on successful login
            }, 0);
        }
    };

    const handleGoogleAuth = async (event) => {
        event.preventDefault();
        try {
            setLoading(true); // Set loading to true while logging in
    
            // Start a sign in process for an unauthenticated user using a popup.
            const result = await signInWithPopup(getAuth(app), provider);
            
            // The signed-in user info.
            const user = result.user;
            console.log('Logged in with Google -- user: ', user);
            
            // Redirect to '/home' on successful login.
            router.push('/home');
    
        } catch (error) {
            console.error('Error authenticating with Google: ', error.message);
        }
    };

    return (
        <div className={styles.container}>
            <Image
                src='/images/logo.svg'
                width={144}
                height={144}
                className={styles.logo}
            />
            <div className={styles.glowEffectContainer}></div>
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Login</h1>

                {loading && <div className={styles.loader}></div>}
                
                <div className={styles.formInnerContainer}>
                    <form onSubmit={handleLogin} className={styles.form}>
                        <input
                            type="text"
                            id="email"
                            placeholder='Email Address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.wholeLineInput}
                        />
                        <input
                            type="password"
                            id="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.wholeLineInput}
                        />
                        <button type="submit" className={styles.button}>Login</button>
                    </form>

                    {error.condition && 
                        <div className={styles.errorContainer}>
                            <p className={styles.errorHeader}>ERROR!</p>
                            <div className={styles.errorSymbol}></div>
                            <p className={styles.errorMessage}>
                                Please check your credentials & try again.
                            </p>
                        </div>
                    }

                </div>
                <div className={styles.createAccountContainer}>
                    Don't have an account?
                    <a href='/register' className={styles.registerLink}> Register</a>
                </div>
                <div className={styles.borderContainer}>
                    <div className={styles.borderLine}></div>
                    <p>OR</p>
                    <div className={styles.borderLine}></div>
                </div>
                <button onClick={handleGoogleAuth} className={styles.googleButton}>
                    <Image 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        width={30}
                        height={30}
                        className={styles.googleLogo}
                    />
                    <p className={styles.googleAuthText}>Continue with Google</p>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;