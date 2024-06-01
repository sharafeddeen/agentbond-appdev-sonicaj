'use client'

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import app from '../firebase-init';
import styles from './page.module.css';
import '../globals.css';
import { onNewUserCreated } from '@/handle-firestore';
import { getStorage, ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';

const RegisterPage = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [uploadClicked, setUploadClicked] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false); // State to track loading
    const [error, setError] = useState({condition: false, message: null}); // If there's an error logging in
    const fileInputRef = useRef(null);

    const provider = new GoogleAuthProvider();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); // Set loading to true while logging in
            
            await createUserWithEmailAndPassword(getAuth(app), email, password)
            .then(async (cred) => {
                // Upload profile picture to Google Cloud Storage
                const storage = getStorage(app);
                const profilePictureRef = ref(storage, `profile-pictures/${cred.user.email}`);
                console.log('register -- profile pic ref: ', profilePictureRef)
                await uploadBytes(profilePictureRef, profilePicture)
                .then(res => console.log('register -- uploading response: ', res))
                
                // Get the URL of the uploaded profile picture
                const profilePictureUrl = await getDownloadURL(profilePictureRef);
                
                console.log('uploaded pic -- ', profilePictureUrl)

                updateProfile(cred.user, {
                    displayName: `${firstName} ${lastName}`,
                    photoURL: profilePictureUrl
                })
                
                // Then send info to Firestore
                await onNewUserCreated(cred, {
                    fname: firstName,
                    lname: lastName,
                    profilePicture: profilePictureUrl
                });
            })
            .then(() => {
                // setting timeout to test loading animation
                setTimeout(() => {
                    router.push('/home'); // Redirect on successful login
                }, 0);
            })
        } catch (error) {
            setLoading(false); // Reset loading state
            setError({condition: true, message: error.message});
            console.error('Error registering user: ', error.message);
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

    // Function to prompt a "choose file" box to the user
    const handleUploadClicked = () => {
        // Trigger click event of the file input
        console.log('clicked')
        fileInputRef.current.click();    
    }
    
    // Function to handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Check if the profile picture exceeds the size limit (5 MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('The profile picture size exceeds the limit of 5 megabytes.');
            // Clear the file input field
            e.target.value = null;
        } else {
            setProfilePicture(file);
    
            // You can also preview the image here if needed
            const reader = new FileReader();
            reader.onload = (event) => {
                // Set the uploaded image preview
                // For example:
                document.getElementById('preview').src = event.target.result;
            };
            reader.readAsDataURL(file);
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
                <h1 className={styles.formTitle}>Register</h1>

                {loading && <div className={styles.loader}></div>}
                
                <div className={styles.formInnerContainer}>
                    <form onSubmit={handleRegister} className={styles.form}>
                        <div className={styles.nameContainer}>
                            <input
                                type="text"
                                id="first-name"
                                placeholder='First Name'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={styles.halfLineInput}
                            />
                            <input
                                type="text"
                                id="last-name"
                                placeholder='Last Name'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={styles.halfLineInput}
                            />
                        </div>
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
                        <input
                            type="file"
                            id="profile-picture"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className={styles.fileUpload}
                        />
                        <button 
                            type='button' 
                            onClick={handleUploadClicked} 
                            className={styles.uploadTriggerButton}
                        >
                            Upload Profile Picture
                        </button>
                        {
                            profilePicture &&
                            (
                                <Image
                                id="preview"
                                src=""
                                width={100}
                                height={100}
                                className={styles.profilePicture}
                                />
                            )
                        }
                        <button 
                            type="submit" 
                            disabled={
                                loading 
                                || !profilePicture 
                                || firstName === '' 
                                || lastName === '' 
                                || !email.includes('@') 
                                || password.length < 6 
                            } 
                            className={styles.button}
                        >Register</button>
                    </form>

                    {error.condition && 
                        <div className={styles.errorContainer}>
                            <p className={styles.errorHeader}>ERROR!</p>
                            <div className={styles.errorSymbol}></div>
                            <p className={styles.errorMessage}>
                                Couldn't create your account.
                                Please check your email address and try again.
                            </p>
                        </div>
                    }

                </div>
                <div className={styles.createAccountContainer}>
                    Already have an account?
                    <a href='/login' className={styles.registerLink}> Login</a>
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

export default RegisterPage;