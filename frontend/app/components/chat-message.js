import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from "./chat-message.module.css";
import { Avatar } from '@mui/material';
import { getAuth } from 'firebase/auth';


const ChatMessage = ({ message, currentUser }) => {

  const [userName, setUserName] = useState({displayName: ''});
  
  //console.log('chat-message -- message: ', message);

  
  useEffect(() => {
    (async function fetch_name () {
      if (message.role === 'user' && !currentUser) {
        //console.log('chat-message -- sender before request: ', message.sender);
        await fetch(`https://firestore-dot-agentbond-mvp.uc.r.appspot.com/user-by-email/?email=${message.sender}`, {
          method: 'GET',
        })
        .then(async result => {
          let data = await result.json()
          //console.log('chat message -- name: ', data)
          setUserName(data)
        })
      }
    })()
  }, [message]);


  const [showReview, setShowReview] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  useEffect(() => {

    let content = message.content.toLowerCase()

    if (content.includes('review')) {
      const delay = setTimeout(() => {
        setShowReview(true)
      }, 5000)
      return () => clearTimeout(delay)
    }

    else if (content.includes('awesome') && content.includes('setup') && content.includes('hubspot')) {
      const delay = setTimeout(() => {
        setShowDashboard(true)
      }, 5000)
      return () => clearTimeout(delay)
    }

  }, [message])


  const [renderedMessages, setRenderedMessages] = useState([]);

  useEffect(() => {
    const delayRender = () => {
      const splitMessages = message.content.split('\n\n');
      const renderInterval = setInterval(() => {
        if (renderedMessages.length < splitMessages.length) {
          //console.log ('chat message -- splitting! ', splitMessages[renderedMessages.length])
          setRenderedMessages(prevRenderedMessages => [
            ...prevRenderedMessages,
            splitMessages[prevRenderedMessages.length]
          ]);
        } else {
          clearInterval(renderInterval);
        }
      }, 2000); // Adjust the delay as needed

      return () => clearInterval(renderInterval);
    };

    delayRender();
  }, []);


  const review1 = `I’ve completed the data review.`
  const review2 = `It looks like you get quite a few people who find you from Paid Google and Facebook ads.`
  const review3 = `Would you like to separate those 2 out or keep them combined?`

  const setup_completed = `Here's the Link to your new Dashboard: https://app.hubspot.com/reports-dashboard/24273568/view/11446541`

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (
    <div className={styles.chatMessage}>
      {message.role == 'user' && currentUser &&
        <div className={styles.currentUserMessageContainer} >
          <div className={`${styles.currentUserAvatar}`}>
            <p>You</p>
            <div className={styles.gap}></div>
            <Avatar src={getAuth().currentUser.photoURL} />
          </div>
          <div className={`${styles.message} ${styles.currentUserMessage}`}>
            <div className={styles.message}>
              {message.content}
              {message.content.includes('screenshot') ? <Screenshot/> : null }
            </div>
          </div>
        </div>
      }
      {message.role == 'user' && !currentUser && 
      <div>
        <div className={`${styles.avatarStyle}`}>
          <Avatar src={userName.photoURL} />
          <div className={styles.gap}></div>
          <p>{userName.displayName}</p>
        </div>
        <div className={`${styles.message} ${styles.otherUserMessage}`}>
          <div className={styles.message}>
            {message.content}
            {message.content.includes('screenshot') ? <Screenshot/> : null }
          </div>
        </div>
      </div>
      }
      {message.role == 'assistant' &&
      <div>
        <div className={`${styles.avatarStyle}`}>
          <Avatar src='/images/bond.png' />
          <div className={styles.gap}></div>
          <p>Bond</p>
        </div>
        {/*console.log('chat message -- content: ', message.content.split('\n\n').filter(m => m !== undefined))*/}
        {message.content.split('\n\n').filter(m => m !== undefined).map((msg, index) => (
          <div className={`${styles.message} ${styles.botMessage}`}>
            <div className={styles.message} key={index}>
              {msg?.includes('https') ?
              <div>
                {msg.substring(0, msg.indexOf('https'))}
                <a 
                  href={msg.substring(msg.indexOf('https'), msg.length)}
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'yellow', textDecoration: 'underline' }}
                >
                    {msg.substring(msg.indexOf('https'), msg.length)}
                </a> 
              </div> 
              : 
              msg
              }
            </div>
          </div>
        ))}
        {false && showReview &&
        <div>
          <div className={`${styles.message} ${messageStyle}`}>
            <div className={styles.message}>
              {review1}
            </div>
          </div>
          <div className={`${styles.message} ${messageStyle}`}>
            <div className={styles.message}>
              {review2}
            </div>
          </div>
          <div className={`${styles.message} ${messageStyle}`}>
            <div className={styles.message}>
              {review3}
            </div>
          </div>
        </div>
        }
        {false && showDashboard &&
          <div className={`${styles.message} ${messageStyle}`}>
            <div className={styles.message}>
              {setup_completed}
            </div>
          </div>
        }
      </div>
      }
    </div>
  );
};

export default ChatMessage;