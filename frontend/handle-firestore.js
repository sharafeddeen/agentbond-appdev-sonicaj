// Import Firestore from Firebase
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, onSnapshot, orderBy, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore(); // Get the Firestore instance
const auth = getAuth();

// Create a new conversation document
export async function createNewConversation() {
  console.log("handle firestore -- createNewConversation");
    
    const conversationDocRef = await addDoc(collection(db, 'conversations'), {
        participants: [auth.currentUser.email, 'openai'],
        createdAt: serverTimestamp(),
    });    

    console.log('createNewConversation -- id: ', conversationDocRef.id)
    return conversationDocRef.id;
}

// Function to save chats to Firestore
export async function sendMessage(message, conversationId) {
  console.log("handle firestore -- sendMessage");

    // Add the message to the messages subcollection of the conversation document
    const messagesCollectionRef = collection(db, 'conversations', conversationId, 'messages');
    await addDoc(messagesCollectionRef, {
        content: message.content,
        role: message.role,
        sender: message.role === 'user' ? auth.currentUser.email : 'openai',
        timestamp: serverTimestamp(),
    });

    return conversationId;
}

// Fetch all conversations user is part of, to display on sidebar
export async function fetchConversations() {    
  console.log("handle firestore -- fetchConversations");
    try {
      const q = query(collection(db, 'conversations'), where('participants', 'array-contains', auth.currentUser.email));
      const querySnapshot = await getDocs(q); 
      console.log("handle firestore -- fetchConversations querySnapshot: ", q)
  
      // Use map to transform each conversationDoc into a promise that resolves to the full conversation data
      const conversationsPromises = querySnapshot.docs.map(async (conversationDoc) => {
        const conversationId = conversationDoc.id;
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        
        // Execute query for messages
        const messagesQuerySnapshot = await getDocs(messagesRef);
  
        const messagesData = messagesQuerySnapshot.docs.map(messageDoc => ({
          id: messageDoc.id, 
          ...messageDoc.data()
        }));
  
        // Return the full conversation data, now including messagesData
        return { 
          id: conversationId, 
          createdAt: conversationDoc.data().createdAt,
          participants: conversationDoc.data().participants,
          title: conversationDoc.data().title,
          hubspot_instance_id: conversationDoc.data().hubspot_instance_id,
          messages: messagesData 
        };
      });
  
      // Wait for all conversation data promises to resolve
      //    Using Promis.all is crucial here! The sidebar receives
      //    an empty conversations array if we don't wait!
      const conversationsData = await Promise.all(conversationsPromises);
  
      return conversationsData;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

// Listen for real-time updates to messages in a specific conversation
export function onMessageAdded(conversationId, callback) {
  console.log("handle firestore -- onMessageAdded");
    const messagesCollectionRef = collection(db, 'conversations', conversationId, 'messages');
    // Query messages ordered by timestamp
    const q = query(messagesCollectionRef, orderBy('timestamp'));
  
    // Subscribe to query updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
        // Handle document changes
        const changes = snapshot.docChanges().map(change => {
            if (change.type === 'added') {
                return { id: change.doc.id, ...change.doc.data() };
            }
            return null;
        }).filter(change => change != null); // Filter out non-'added' changes for simplicity
  
        // Call the callback function with the new changes
        if(changes.length > 0) {
            callback(changes);
        }
    });
  
    return unsubscribe; // Return the unsubscribe function for cleanup
  }

// Listen for real-time updates to the participants of a specific conversation
export function onConversationParticipantsUpdated(conversationId, callback) {
  console.log("handle firestore -- onConversationParticipantsUpdated");
    const conversationDocRef = doc(db, 'conversations', conversationId);

    // Subscribe to updates on the specific conversation document
    const unsubscribe = onSnapshot(conversationDocRef, (doc) => {
        // Check if the document exists and has data
        if (doc.exists()) {
            const conversationData = { id: doc.id, ...doc.data() };
            callback(conversationData);
        }
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
}

// Store new user information in Firestore
export async function onNewUserCreated (userCredential, additionalInfo) {

  console.log ('handle firestore -- onNewUserCreated called with: ', userCredential, additionalInfo)
  //setTimeout(() => null, 5000);
  await setDoc(doc(db, 'users', `${userCredential.user.email}`), {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    createdAt: userCredential.user.metadata.createdAt,
    firstName: additionalInfo.fname, // Add the first name here
    lastName: additionalInfo.lname, // Add the last name here
    profilePicture: '', // Add the profile picture URL here
    company: '', // Add the company here
    role: '' // Add the role here
  });
}