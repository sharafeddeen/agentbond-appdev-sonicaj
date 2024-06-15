'use client'

import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './chat-message';
import styles from "./chat-window.module.css";
import { sendMessage, createNewConversation, fetchConversations, onMessageAdded, onConversationParticipantsUpdated } from '../../handle-firestore';
import { getAuth } from 'firebase/auth';
import { Button, Modal, Fade, Box, Typography } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';

const ChatWindow = ({ chat, onParticipantsUpdated, publicBot }) => {

  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [landingPageChatLog, setLandingPageChatLog] = useState([]);
  const [conversationId, setConversationId] = useState(null); // State variable to hold conversation ID
  const [unsubscribe, setUnsubscribe] = useState(null); // Keep track of the unsubscribe function for cleanup
  const [unsubscribeMessages, setUnsubscribeMessages] = useState(null); // Keep track of the unsubscribe function for cleanup
  const [unsubscribeParticipants, setUnsubscribeParticipants] = useState(null); // Keep track of the unsubscribe function for cleanup
  const [open, setOpen] = useState(false);
  const [disableSuggestion, setDisableSuggestion] = useState(true);
  const [actionDisabled, setActionDisabled] = useState(false);

  const loginSuggestion = "We’ve reached the conversation limit, please book time with Grayson and myself below in order to continue the conversation!";
  




  // Send the message and update the chat log when conversationId changes
  useEffect(() => {  
    async function sendInputAfterConversationCreated() {
      if (conversationId && finalInput.trim() !== '') {
        console.log('chat window -- (sendInputAfter...) new conversation created with ID: ', conversationId);

        // Clear the input field
        //setInput('');  

        // Send the message using the updated conversation ID
        console.log('chat window -- (sendInputAfter...) sending to Firestore:', { role: 'user', content: finalInput }, `${conversationId}}`)
        await sendMessage({ role: 'user', content: finalInput }, conversationId);
        
        // Update the chat log with the new message
        //const newChatLog = [...chatLog, { role: 'user', content: input }];
        //setChatLog(newChatLog);
      }
    }
    
    sendInputAfterConversationCreated(); // Call the function immediately after mounting or when conversationId changes
  }, [conversationId]); // Dependency on conversationId ensures the effect runs whenever conversationId changes

  const setupConversationListener = (conversationId) => {
    // Unsubscribe existing listeners to avoid multiple subscriptions
    console.log("Setting up conversation listener for chat: ", conversationId);
    if (unsubscribe) {
      unsubscribe();
    }
  
    // Setup a new unsubscribe function for changes in the conversation document (participants, etc.)
    const unsubscribeConv = onConversationParticipantsUpdated(conversationId, (updatedConversation) => {
      // Here, you could react to changes in the participants
      // For most cases, the existing message listener should seamlessly continue working
      // because the messages collection isn't directly affected by participants changes
      // However, this is where you could add logic if needed based on participants changes
      console.log("Participants updated", updatedConversation.participants);
    });

    // Combine both unsubscriptions for cleanup
    setUnsubscribe(() => () => {
      unsubscribeConv();
    });
  };

  

  /*********** Logic to listen to updates to current conversation (msgs or participants) ************ */
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribeMsg = onMessageAdded(conversationId, (newMessages) => {
      console.log('chat window -- useEffect listener messages - setting chatLog: ', [...chatLog], [...newMessages.map(message => message)], `for conversationId: ${conversationId}. Selecting conv? ${selectingConversation}`)
      setTimeout(() => {
        setChatLog(chatLog => [...chatLog, ...newMessages.map(message => message)]);
      }, 1000)
    });

    setUnsubscribeMessages(() => unsubscribeMsg);

    return () => unsubscribeMsg(); // Cleanup when component unmounts or conversationId changes.
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribePtc = onConversationParticipantsUpdated(conversationId, (updatedConversation) => {
      console.log(`chat window -- useEffect participants - participants updated ${updatedConversation.participants} for conversationId: ${conversationId}`);
      // This callback doesn't need to perform actions since message updates
      // are handled by the onMessageAdded listener.
      onParticipantsUpdated(conversationId, updatedConversation.participants.length);
    });

    setUnsubscribeParticipants(() => unsubscribePtc);

    return () => unsubscribePtc(); // Cleanup when component unmounts or conversationId changes.
  }, [conversationId]);




  
  /************ Logic to handle user sending a message ****************** */

  const [finalInput, setFinalInput] = useState('');

  async function handleSubmit(message) {
    if (finalInput.trim() !== '') {
      setSubmitted(true);
      console.log('chat window -- (handleSubmit) submitting with chatID: ', conversationId)
      if (!conversationId) {
        // If no conversation exists, create a new one
        //setChatLog([]);
        const newConversationId = await createNewConversation();
        setConversationId(id => newConversationId);
        console.log('chat window -- (handleSubmit) new conversation created with ID: ', conversationId);
        // rest of logic picks up at useEffect --> sendInputAfterConversationCreated()
        //    couldn't complete it here because useState is async
        //    & needs useEffect to become synchronous
      } else {
        // Clear the input field
        setInput('');
        setFinalInput('');
  
        console.log("chat window -- (handleSubmit) sending to selected conversation: ", conversationId, chatLog)
        await sendMessage({ role: 'user', content: message }, conversationId);
        // Update the chat log with the new message
        //const newChatLog = [...chatLog, { role: 'user', content: message }];
        //console.log('chat window -- (handleSubmit) updating chatLog to: ', newChatLog)
        //setChatLog(newChatLog);
        
        
      }

    }
  }

  const landingPageHandleSubmit = async (message) => {
    setLandingPageChatLog(prevChatLog => [...prevChatLog, { role: "user", content: message }]);
    setInput('');
    setFinalInput('');
    setDisabled(false)
  };

  useEffect(() => {
    const callApi = async () => {
      setActionDisabled(true);
      try {
        let response = await fetch(
          `https://landingpage-ai-dot-agentbond-beta.uc.r.appspot.com/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: landingPageChatLog }),
          }
        );

        let resData = await response.json();
        setLandingPageChatLog(prevChatLog => [...prevChatLog, resData]);
        if(resData.content === loginSuggestion){
          setOpen(true);
        }
        setActionDisabled(false);
      } catch (error) {
        console.log(`home (get_instance) -- Error occured!`, error);
      }
    };

    if (landingPageChatLog.length > 0 && landingPageChatLog[landingPageChatLog.length - 1].role === "user") {
      callApi();
      setDisabled(false)
    }
  }, [landingPageChatLog]);


  useEffect(() => {
    if (finalInput && finalInput.trim() != '') {
      if(publicBot) {
        landingPageHandleSubmit(finalInput);
      } else {
        handleSubmit(finalInput)
      }
    }
  }, [finalInput])


  
  /************** User just sent a message, send to AI for a response ***************/
  const [submitted, setSubmitted] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    
    setDisabled(chatLog[chatLog.length-1]?.role === 'user')
    async function fetchData(messages) {
      console.log('chat window -- (fetchData) messages are being sent to AI: ', messages)
      console.log ('chat window -- (fetchData) fetch started -- submitted: ', submitted)
      const userName = getAuth().currentUser.displayName
      const userEmail = getAuth().currentUser.email
      console.log(`chat window -- (fetchData) user is: ${userName} and their email is: ${userEmail}`)
      console.log("stringified json is: ", JSON.stringify({
        messages,
        conversationId,
        userName,
        userEmail
    }))

      try {
          const response = await fetch('https://ai-dot-agentbond-mvp.uc.r.appspot.com', {
          //const response = await fetch('http://localhost:8080', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  messages,
                  conversationId,
                  userName,
                  userEmail,
                  instanceID
              })
          });
          setDisabled(false)
          if (!response.ok) {
            const errorResponse = await response.json(); // Properly await the JSON response
            throw new Error(`Network response was not ok. Error: ${JSON.stringify(errorResponse, null, 2)}`);
          }
          const res = await response.json();
          console.log('chat window -- (fetchData) succes res: ', res);
          await sendMessage({ role: res.data.message.role, content: res.data.message.content }, conversationId);

        } catch (error) {
          console.error('chat window -- (fetchData) error fetching data:', error);
          // Handle the error appropriately, e.g., display a message to the user or perform additional actions
      }
    };

    const fetchDataWithPrep = async () => {
      // Fetch the bot's response and update the chat log
      // Need to change encoding (openai only accepts role and content properties in a message)
      const prepForOpenAI = chatLog.map(message => ({ role: message.role, content: message.content }));
      console.log('chat window -- (fetchDataWithPrep) prepForOpenAI: ', prepForOpenAI);
      await fetchData([...prepForOpenAI]);
    }
    
    console.log(`chat window -- useEffect trying to send to AI: Selecting conv? ${selectingConversation}   chatLog: `, chatLog);
    if (
        chatLog 
        && chatLog.length > 0
        && chatLog[chatLog.length-1]?.role != 'assistant'
        && chatLog[chatLog.length-1]?.content != ''
        && !selectingConversation
        && submitted
        ) {
          console.log('chat window -- (fetchDataWithPrep) sending chatLog to AI: ', chatLog)
          fetchDataWithPrep()
          setSubmitted(false);
    } else {
      console.log('chat window -- (fetchDataWithPrep) not fetching -- submitted: ', submitted)
    }
  }, [chatLog]);

  



  /************** Logic to handle conversation selection ********************/
  const [selectingConversation, setSelectingConversation] = useState(false);
  const [conversations, setConversations] = useState([]);

  const handleConversationSelection = async (chatID) => {
    console.log('chat window -- (handleConversationSelection) chat is rendering: ', chatID)
    //setupConversationListener(chatID); // This is a new function
    console.log('chat window -- (handleConversationSelection) selecting new convo! ' + ` chatID: ${chatID} & conversationId: ${conversationId}`)
    console.log(`chat window -- (handleConversationSelection):     input: ${input}   finalInput: ${finalInput}    chatLog: `, chatLog)
    setInput('');
    setFinalInput('');
    setChatLog([]);
    setConversationId(chatID); // Set the state with the new conversationId

    if (unsubscribe) {
      unsubscribe(); // Unsubscribe from current conversation before switching
    }

    try {
        const conversations = await fetchConversations();
        console.log('chat window -- (handleConversationSelection) conversations: ', conversations);
        
        // Introduce a delay of 1 second using setTimeout
        setTimeout(() => {
          console.log(`chat window -- (handleConversationSelection)   convId==chatID? ${conversationId === chat}, conversationId: ${conversationId}, chatID: ${chatID}`)
            if (conversations.length > 0) {
                setTimeout(()=>{}, 5000);
                setConversations(conversations);
                setSelectingConversation(true);
            } else {
                //console.log('No conversations found');
            }
          }, 1000); // 1 second delay
          
          
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      };
      
      
  useEffect(() => {
    if (selectingConversation) {
        console.log('chat window -- (useEffect selectingConversation) getting conversation: ', conversationId);
        const selectedConversation = conversations.find(conversation => conversation.id === conversationId);
        console.log('chat window -- (useEffect selectingConversation) found conversation!', selectedConversation);
        const sortedMessages = selectedConversation.messages.sort((a, b) => a.timestamp - b.timestamp);
        console.log('chat window -- (useEffect selectingConversation) selected conversation messages: ', sortedMessages);
        if (sortedMessages && sortedMessages.length > 0) {
          setInstanceID(selectedConversation.hubspot_instance_id)
          setChatLog(sortedMessages); // Update chatLog with messages
        }
        console.log("chat window -- (useEffect selectingConversation) instanceID: ", instanceID);
        console.log("chat window -- (useEffect selectingConversation) chatLog: ", chatLog);
        setSelectingConversation(false);
    }

  }, [selectingConversation])



  useEffect(() => {
    if (chat && chat != 'newChat') {
      handleConversationSelection(chat);
    } else if (chat === 'newChat') {
      setConversationId(null);
      setChatLog([]);
    }
  }, [chat]);







  /* This code is to auto expand the input box vertically when
      the user query exceeds the length of 1 row.
      /
  */
const textareaRef = useRef(null); // Create a ref for the textarea
  useEffect(() => {
    // Function to auto-expand textarea
    const autoExpandTextarea = () => {
      //console.log("expanding???")
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto'; // Reset height to auto
        textarea.style.height = textarea.scrollHeight + 'px'; // Set height to scroll height
      }
    };

    // Add event listener to dynamically adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.addEventListener('input', autoExpandTextarea);
    }

    // Cleanup function to remove event listener
    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener('input', autoExpandTextarea);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once after initial render 

  // New useEffect to focus the textarea on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus(); // Focus the textarea
    }
  }, []); // Empty dependency array to ensure it runs once after the component mounts
  // Scroll to the bottom whenever chatLog updates
  const messageContainerRef = useRef(null); // Ref for the message container
  useEffect(() => {
    if (messageContainerRef.current) {
      // Use scrollTo with smooth behavior
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: 'smooth' // This prop causes the smooth scrolling
      });
    }
  }, [chatLog]); // Dependency on chatLog to trigger scroll on update




  const [instanceID, setInstanceID] = useState(null);
  useEffect(() => {
    console.log('chat window -- setting the instance: ')
  }, [chat])

  let suggestions = [
    "What is the difference between HubSpot Native and Custom Attribution?",
    "What are some of the problems custom attribution solves?",
    "What is the purpose of setting up custom attribution / what business outcomes can I receive?",
    "How long will it take?",
    "What exactly are you doing?",
    "Who all needs to be involved?",
    "Who is SonaMation? / What is SonaMation? Who created this?",
    "What is AgentBond?"
  ];
  suggestions = suggestions.sort((a, b) => a.length - b.length);

  const messagesToRender = landingPageChatLog.length > 0 ? landingPageChatLog : chatLog;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 

  return (
    <div className={styles.container}>
      {/*console.log('chat window -- new instance: ', instanceID)*/}
      <div className={styles.messageContainer} ref={messageContainerRef}>
        {messagesToRender.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            currentUser={message.sender ? message.sender === getAuth().currentUser.email : true}
            isLastMessage={index === messagesToRender.length - 1}
          />
        ))}
      </div>

      <div className={styles.suggestions}>
        {suggestions.map((suggestion, index) => (
          <div key={index} className={styles.suggestion} onClick={() => {!actionDisabled && setFinalInput(suggestion), setDisableSuggestion(false)}}>
            {suggestion}
          </div>
        ))}
      </div>
      
      <section className={styles.chatBox}>
        <div className={styles.chatInputHolder}>
          <form className={styles.inputForm}>
            <textarea 
              id='message-input'
              value={input}
              ref={textareaRef}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Check if the enter key is pressed without the shift key being held down
                if (e.key === 'Enter' &&
                    !e.shiftKey &&
                    !disabled || (publicBot && disableSuggestion)
                ) {
                    e.preventDefault(); // Prevent default to avoid adding a new line
                    setFinalInput(e.target.value); // Trigger the handleSubmit function
                    setDisabled(true);
                }
              }}
              className={styles.chatInputTextarea} 
              rows='1' 
              placeholder={publicBot && disableSuggestion ? 'Try any question from above to unlock prompt...' : 'Your prompt here...'}
              disabled={publicBot && disableSuggestion}
            ></textarea>
              <button 
                onClick={(e)=>{
                  e.preventDefault();
                  setFinalInput(input)
                  setDisabled(true);
                }} 
                className={`${styles.sendButton} ${
                  (publicBot ? actionDisabled : disabled) && 
                  styles.cursorPointer
                }`}
                disabled={publicBot ? actionDisabled : disabled}
              >Send</button>
          </form>
        </div>
      </section>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            borderRadius: 4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            border: '2px solid black',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography id="transition-modal-title" sx={{ color: "#5f5ff6", fontSize:"32px", fontWeight: "600", textAlign: "center" }}>
              Login
            </Typography>
            <CloseIcon onClick={() => setOpen(false)} sx={{ position: "absolute", top: 15, right: 15, cursor: "pointer", color: "#5f5ff6" }}/>
            <Typography id="transition-modal-description" sx={{ my: 4, color: "black" , fontSize: "24px", textAlign:"center" }}>
              We’ve reached the conversation limit, please book time with Grayson or login to continue the conversation!
            </Typography>
            <Link href="/login">
              <Button
                variant="outlined"
                size="lg"
                className={styles.button}
              >
                Login
              </Button>
            </Link>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ChatWindow;