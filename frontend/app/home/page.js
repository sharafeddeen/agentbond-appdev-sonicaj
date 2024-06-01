'use client'

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../firebase-init';
import ChatWindow from '../components/chat-window';
import Navbar from '../components/navbar/navbar';

import styles from './page.module.css'
import Sidebar from '../components/sidebar/sidebar';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();



  useEffect(() => {
    //const app = initializeApp(firebaseConfig);
    const auth = getAuth(); // Get the Firebase Auth instance
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        // No user is signed in.
        router.push('/login'); // Redirect to authentication page if not authenticated
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);


  

  /************* Logic to control current chat window ************ */
  const [chat, setChat] = useState(null);

  function handleSelectChat (chatID) {
    setChat(chatID)
  }

  /************* Logic to reload sidebar when participants are updated ************ */
  const [participantsUpdated, setParticipantsUpdated] = useState({status: false, chatID: null, count: 0});

  function handleParticipantsUpdated (chatID, count) {
    console.log('home -- participants were updated!')
    setParticipantsUpdated({status: true, chatID: chatID, count: count})
  }

  function finishParitipantsUpdated () {
    setParticipantsUpdated({status: false, chatID: null, count: 0})
  }

      
  async function get_instance() {
    try {

      let response = null
      response = await fetch(`https://hubspot-instance-dot-agentbond-demo.uc.r.appspot.com/`, {
      //response = await fetch(`http://localhost:8080/`, {
        method: 'GET'
      })

      let resData = await response.json()

      let fetched_id = parseInt(resData)

      console.log(`home (get_instance) -- Fetched instance id:`, fetched_id)

      if (instance != fetched_id) setInstance(fetched_id)
      
    } catch (error) {
      console.log(`home (get_instance) -- Error occured!`, error)
      return error
    }
  }

  const [instance, setInstance] = useState(null)
  useEffect(() => {
    (async () => {
      await get_instance()
    })()
  }, [router]);
  useEffect(() => {
    (async () => {
      await get_instance()
    })()
  }, []);



  return (
      <div>
        {user && (
          <div className={styles.container}>
            <div className={styles.navbarContainer}>
              <Navbar current={'chat'} instance={instance} />
            </div>
            <div className={styles.sidebarContainer}>
              <Sidebar 
                onSelectChat={handleSelectChat} 
                participantsUpdated={participantsUpdated} 
                onFinishParticipantsUpdated={finishParitipantsUpdated}
              />
            </div>
            <div className={styles.chatwindowContainer}>
              <ChatWindow 
                chat={chat} 
                onParticipantsUpdated={handleParticipantsUpdated} 
              />
            </div>
          </div>
        )}
      </div>
  );
};


function Home({}) {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  )
}

export default Home;