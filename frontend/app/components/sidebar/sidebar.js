import React, { useState, useEffect } from 'react';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, AvatarGroup, Avatar, Divider, Button } from '@mui/material';
import { ExpandMore, ExpandLess, Inbox, StarBorder, MessageOutlined, AddBoxOutlined } from '@mui/icons-material';

import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { fetchConversations, createNewConversation } from '@/handle-firestore';
import { useRouter } from 'next/navigation';
import getParticipants from './get-participants';

import styles from './sidebar.module.css'
import { grey } from '@mui/material/colors';
import ChatOverview from './chat-overview';





export default function Sidebar ({ onSelectChat, participantsUpdated, onFinishParticipantsUpdated }) {

  
    const auth = getAuth();
    const user = auth.currentUser;
    const router = useRouter();

    /********* Logic to fetch conversations from firestore ******** */
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);
    
    // Fetch conversations from Firestore when component mounts
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

    useEffect(() => {
        fetchData();
    }, []);
    

    const [openGroup, setOpenGroup] = useState(true);    

    const handleClickGroup = () => {
        setOpenGroup(!openGroup);
    };

    const [openDM, setOpenDM] = useState(true);

    const handleClickDM = () => {
        setOpenDM(!openDM);
    };

    const [selectedItem, setSelectedItem] = React.useState(null);

    const handleItemClick = (item, type) => {
        
        if (newChat) { // previous conversation was new, update conversation records on sidebar
            setNewChat(false);
            fetchData();
        }
        
        onSelectChat(item);
        setSelectedItem({item: item, type: type});
    };



    const [profilePicture, setProfilePicture] = useState(null);

    const getProfilePicture = (userID) => {
        // Create a reference with an initial file path and name
        const storage = getStorage();
        const pathRef = ref(storage, `profile-pictures/${userID}`);
    
        getDownloadURL(pathRef)
        .then((url) => {
          //console.log('Profile pic: found! Here: ', url)
          return url ? url : null
        })
        .catch((error) => {
          //console.log('Error getting profile pic: ', error)
          return null
        })
    
    }  
    
    React.useEffect(() => {
        getProfilePicture(); // Run only on first render
    }, []); // Empty dependency array means it runs only once after initial render


    /*********** Logic to start new chat **************** */

    const [newChat, setNewChat] = useState(false);
    
    // Handler function to start new chat
    const handleNewChatClick = () => {
            setOpenGroup(false); // starting new DM - so close group chats
            setSelectedItem({ item: 'newChat', type: 'dm' })
            onSelectChat('newChat');
        }
        
        useEffect(() => {
            if (newChat) {
                handleNewChatClick()
                //setNewChat(false);
            }
    }, [newChat])


    /********* Logic to update sidebar after chat participants are updated ********* */
    useEffect(() => {
        if (participantsUpdated.status) {
            console.log('sidebar -- participants were updated!'. participantsUpdated)
            fetchData();
            if (participantsUpdated.count > 2) {
                setOpenDM(false);
                setOpenGroup(true);
                handleItemClick(participantsUpdated.chatID, 'gchat')
            } else {
                setOpenDM(true);
                setOpenGroup(false);
                handleItemClick(participantsUpdated.chatID, 'dm')
            }
            onFinishParticipantsUpdated();
        }
    }, [participantsUpdated])

    return (
        <div className={styles.container}>
            {console.log('sidebar -- conversations: ', conversations)}

            {console.log('sidebar -- newChat? ', newChat)}

            {console.log(`sidebar -- conversation selected? ${selectedItem !== null}`)}

            <Button onClick={() => setNewChat(true)} sx={{ border: '2px solid', borderColor: grey['500'], color: grey['200'] }} >
                <AddBoxOutlined sx={{mr: 1, color: grey[100] }} />
                Start New Chat
            </Button>

            <div className={styles.scrollbarCustom}>           
                <List>
                    <ListItemButton onClick={handleClickGroup}>
                        {openGroup ? <ExpandLess sx={{ color: grey[100] }} /> : <ExpandMore sx={{ color: grey[100] }} />}
                        <ListItemText primary="GROUP CHATS" sx={{color: grey[100]}} />
                    </ListItemButton>

                    <Collapse in={openGroup} timeout="auto" unmountOnExit >
                        <List component="div" disablePadding>
                            {
                            conversations.map((conversation) => (
                                conversation.participants.length > 2 &&
                                <ListItemButton 
                                    key={conversation.id}
                                    onClick={() => handleItemClick(conversation.id, 'gchat')}
                                    selected={selectedItem?.type === 'gchat' && selectedItem?.item === conversation.id}
                                    sx={{ pl: 5, "&.Mui-selected": {
                                            opacity: '100%',
                                        }, // style when selected  
                                        opacity: '70%',
                                    }}                    
                                >
                                    <ListItemIcon sx={{ minWidth: 20, alignSelf: 'flex-start', pt: 1, mr: 2 }} >
                                        <MessageOutlined sx={{ color: grey['100'] }} />
                                    </ListItemIcon>
                                    <ChatOverview conversation={conversation} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>



                    <ListItemButton onClick={handleClickDM} sx={{ mt: 5 }}>
                        {openDM ? <ExpandLess sx={{ color: grey[100] }} /> : <ExpandMore sx={{ color: grey[100] }} />}
                        <ListItemText primary="PRIVATE CONVERSATIONS" sx={{ color: grey[100] }} />
                    </ListItemButton>

                    <Collapse in={openDM} timeout="auto" unmountOnExit >
                        <List component="div" disablePadding>
                            {newChat && 
                            <ListItemButton 
                                onClick={() => handleItemClick('newChat', 'dm')}
                                selected={selectedItem?.type === 'dm' && selectedItem?.item === 'newChat'}
                                //selected={true}
                                sx={{ pl: 5, "&.Mui-selected": {
                                        opacity: '100%',
                                    }, // style when selected  
                                    opacity: '70%',
                                    display: 'flex',
                                    alignItems: 'flex-start'
                                }}                    
                            >
                                <ListItemText 
                                    primary={`New Chat`} 
                                    primaryTypographyProps={{ color: grey['300'], fontSize: 14 }}
                                    sx={{ minWidth: 150 }}
                                />
                            </ListItemButton>
                            }
                            {conversations.map((conversation) => (
                                conversation.participants.length === 2 
                                && 
                                <ListItemButton 
                                    key={conversation.id}
                                    onClick={() => handleItemClick(conversation.id, 'dm')}
                                    selected={selectedItem?.type === 'dm' && selectedItem?.item === conversation.id}
                                    sx={{ pl: 5, "&.Mui-selected": {
                                            opacity: '100%',
                                        }, // style when selected  
                                        opacity: '70%',
                                        display: 'flex',
                                        alignItems: 'flex-start'
                                    }}                    
                                >
                                    <ListItemText 
                                        //primary={ conversation.title?.length > 0 ? conversation.title : `Private Chat ID: ${conversation.id}`} 
                                        primary={ conversation.title?.length > 0 ? conversation.title : `New Chat`} 
                                        primaryTypographyProps={{ color: grey['300'], fontSize: 14 }}
                                        sx={{ minWidth: 150 }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>


                </List>
            </div>
        </div>
    )
}