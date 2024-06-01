const getUserNameByEmail = async (email) => {
    let data = null
    console.log('get participants -- getting info for user: ', email)
    await fetch(`https://firestore-dot-agentbond-mvp.uc.r.appspot.com/user-by-email/?email=${email}`, {
        method: 'GET',
    })
    .then(async result => {
        data = await result.json()
        //console.log('chat message -- name: ', data)
    })
    return data 
}



/******** Logic to get names of conversation participants ********* */
const getParticipants = async (participants) => {
    const promises = 
        participants
        .filter(participant => participant != 'openai')
        .map(participant => 
            (getUserNameByEmail(participant))
        )
    
    const results = await Promise.all(promises);
    console.log('participants: ', results)
    return results;
}

export default getParticipants;