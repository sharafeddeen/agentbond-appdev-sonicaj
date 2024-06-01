import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

import { ListItemText, Box, Avatar, AvatarGroup } from '@mui/material';
import { grey } from '@mui/material/colors';

import getParticipants from './get-participants';


const ChatOverview = ({ conversation }) => {

    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);

    // Async function to fetch participant names
    const fetchParticipantNames = async () => {
        setLoading(true); // Start loading
        const results = await getParticipants(conversation.participants);
        const names = results.map(result => result.displayName)
        console.log('chat overview -- got participant names: ', names)
        setParticipants(results); // Update the names in state
        setLoading(false); // End loading
    };

    useEffect(() => {
        fetchParticipantNames();
    }, [conversation.participants]);

    if (loading) {
        return <div></div>;
    }

    return (
        <div>
            {participants.length > 0 ? 
            (
                <Box>
                    <ListItemText 
                        primary={ conversation.title?.length > 0 ? conversation.title : `Group Chat ID: ${conversation.id}`} 
                        secondary={participants.map(participant => participant.uid == getAuth().currentUser.uid ? 'You' : participant.displayName).join(', ')} 
                        primaryTypographyProps={{ color: grey['300'], fontSize: 14 }}
                        secondaryTypographyProps={{ color: grey['500'], fontSize: 12 }}
                    />
                    <AvatarGroup 
                        max={3} 
                        sx={{
                            pl:1, 
                            width: 'fit-content', 
                            '& .MuiAvatar-root': { 
                                width: 22, 
                                height: 22, 
                                fontSize: 15, 
                                borderColor: '#19213D' 
                            },
                        }} 
                    >
                        {participants.map((participant) => (
                            <Avatar key={participant.uid} alt={`Avatar ${participant}`} src={participant == "openai"? `/images/bond.png` : participant.photoURL}>H</Avatar>
                        ))}
                    </AvatarGroup>

                </Box>
            ) 
            : 
            (
                <ListItemText 
                    primary={`Chat ID: ${conversation.id}`} 
                    secondary='No participants' 
                    primaryTypographyProps={{ color: grey['300'], fontSize: 14 }}
                    secondaryTypographyProps={{ color: grey['500'], fontSize: 12 }}
                    sx={{ width: 150 }}
                />
            )
            }
        </div>
    );
};

export default ChatOverview;