async function validateToken(){
    try{
const response = await fetch("http://localhost:3000/authenticate",{
    method: "POST",
    headers:{
        "content-Type" : "application/json",
        "Authorization" : 'Bearer ' + localStorage.getItem("jwt")
    }
    
})
    const respounded = await response.text()
    console.log('return', respounded)
    return respounded;
    } catch(err){
        console.log("validate error", err.message)
        return 'false'
    }
}
let valToken = validateToken()
module.exports = valToken