"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../firebase-init";

import styles from "./bot.module.css";
import ChatWindow from "../../components/chat-window";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [botResponse, setBotResponse] = useState([]);

  useEffect(() => {
    //const app = initializeApp(firebaseConfig);
    const auth = getAuth(); // Get the Firebase Auth instance
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        // No user is signed in.
        // router.push("/login"); // Redirect to authentication page if not authenticated
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  /************* Logic to control current chat window ************ */
  const [chat, setChat] = useState(null);

  function handleSelectChat(chatID) {
    setChat(chatID);
  }

  /************* Logic to reload sidebar when participants are updated ************ */
  const [participantsUpdated, setParticipantsUpdated] = useState({
    status: false,
    chatID: null,
    count: 0,
  });

  function handleParticipantsUpdated(chatID, count) {
    console.log("home -- participants were updated!");
    setParticipantsUpdated({ status: true, chatID: chatID, count: count });
  }

  function finishParitipantsUpdated() {
    setParticipantsUpdated({ status: false, chatID: null, count: 0 });
  }

  async function get_instance() {
    try {
      let response = null;
      response = await fetch(
        `https://hubspot-instance-dot-agentbond-demo.uc.r.appspot.com/`,
        {
          //response = await fetch(`http://localhost:8080/`, {
          method: "GET",
        }
      );

      let resData = await response.json();

      let fetched_id = parseInt(resData);

      console.log(`home (get_instance) -- Fetched instance id:`, fetched_id);

      if (instance != fetched_id) setInstance(fetched_id);
    } catch (error) {
      console.log(`home (get_instance) -- Error occured!`, error);
      return error;
    }
  }

  const [instance, setInstance] = useState(null);
  useEffect(() => {
    (async () => {
      await get_instance();
    })();
  }, [router]);
  useEffect(() => {
    (async () => {
      await get_instance();
    })();
  }, []);

  return (
    <div>
      <div className={styles.container}>
        <div className={`${styles.chatwindowContainer} ${styles.borderRadius}`}>
          <ChatWindow
            chat={chat}
            onParticipantsUpdated={handleParticipantsUpdated}
            publicBot={true}
          />
        </div>
      </div>
    </div>
  );
};

function PublicDashBoard() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}

export default PublicDashBoard;
