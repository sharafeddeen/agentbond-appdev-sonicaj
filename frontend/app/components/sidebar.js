import React, { useState, useEffect } from 'react';
import styles from "./sidebar.module.css";
import '../firebase-init';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { fetchConversations } from '@/handle-firestore';

const Sidebar = ({ onStartNewChat, onConversationSelect }) => {
  const auth = getAuth(); // Get the Firebase Auth instance
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true); // Prevents render before fetching conversations

  // Fetch conversations from Firestore when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const conversationsData = await fetchConversations();
        // Sort conversations based on the timestamp of the most recent message
        conversationsData.sort((a, b) => {
          // Get the timestamp of the most recent message in conversation a
          const mostRecentMessageA = a.messages.reduce((prev, current) => (prev.timestamp > current.timestamp) ? prev : current);
          
          // Get the timestamp of the most recent message in conversation b
          const mostRecentMessageB = b.messages.reduce((prev, current) => (prev.timestamp > current.timestamp) ? prev : current);
          
          // Compare the timestamps of the most recent messages for sorting
          return mostRecentMessageB.timestamp - mostRecentMessageA.timestamp;
        })
        setConversations(conversationsData);
        setLoading(false); // Set loading state to false after updating conversations state
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false); // Set loading state to false even in case of error
      }
    };

    fetchData();
  }, []);

  const handleConversationClick = (conversationId) => {
    onConversationSelect(conversationId); // Call the passed function with the selected conversation ID
  };

  // Handler function to start new chat
  const handleNewChatClick = () => {
    onStartNewChat(); // Call the callback function to start a new chat
  };

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push('/'); // Redirect to the landing page after logout
      });
  }

  //console.log("Sidebar re-render", conversations.length);

  return (
    <div className={styles.sidebar}>
      <div className={styles.newChatButton} onClick={handleNewChatClick}>
        Start<br></br>new chat
      </div>

      <h2>Active Chats</h2>
    {loading ? (
      <p>Loading conversations...</p>
    ) : (
      <div>
        {/*console.log('sidebar -- conversations: ', conversations)*/}
        <h3>Group Chats</h3>
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            conversation.participants.length > 2? 
            (
            <button key={conversation.id} onClick={() => handleConversationClick(conversation.id)}>
              Chat - {conversation.id}
            </button>
            ) 
            : 
            null
          ))
        ) : (
          <p>No conversations found.</p>
        )}

        <h3>Private Chats</h3>
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            conversation.participants.length == 2? 
            (
            <button key={conversation.id} onClick={() => handleConversationClick(conversation.id)}>
              Chat - {conversation.id}
            </button>
            ) 
            : 
            null
          ))
        ) : (
          <p>No conversations found.</p>
        )}
      </div>
    )}

    <h2>Log Out</h2>
    <button onClick={handleLogOut}>Log Out</button>
  </div>
);
};

export default Sidebar;