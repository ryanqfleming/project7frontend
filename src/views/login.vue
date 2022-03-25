<script>
const ValidateToken = require('../models/validateToken')
export default {
   mounted(){
 ValidateToken.then(result=>{
     console.log('validate processed', result)
     if(result == 'true'){
         this.$router.push('/')
     }
 })
   }, 
   methods:{
  login() {
    accountControl(true).then(result=>{
        console.log('account control: ', result)
        if(result == true){
            console.log('login if')
        this.$router.go('/')
        }
        
    }) 
  },
  createAccount() {
      accountControl(false).then(result=>{
          console.log('account control', result)
          if(result === true){
              this.$router.go('/')
          }
      })
  }
}
}
const emailRegex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
//using the same form for account login and creation
async function accountControl(type){
let route = "/login";
    if(type === false){
        route = "/createUser"
    } 
    let container = await validateFields()
    if(container === false){return false}
    try{
        const response = await fetch("http://localhost:3000"+route,{
            method: "POST",
            body: JSON.stringify(container),
            headers:{
                "content-Type": "application/json"
            }

        })
        const respounded = await response.text()
        //if an error is returned instead of valid json lets display it
        try {
            let json = JSON.parse(respounded)
            localStorage.removeItem('jwt')
            localStorage.setItem("jwt", json.token)
            localStorage.setItem("userid", json.userid)
            console.log("jwt set")
            return true;
        } catch(e) {
            if(e instanceof SyntaxError){
                document.getElementById("errorHolder").innerHTML = respounded
                return false   
            }
        }
        
    } catch (err) {
        console.error(err.message)
        return false
    }
}

async function validateFields() {
    let email = document.getElementById("emailInput").value
    let password = document.getElementById("inputPassword").value
    if(email.match(emailRegex) === null){
        document.getElementById("errorHolder").innerHTML = "Invalid Email"
        return false 
     } else if(password.match(passwordRegex) === null){
         document.getElementById("errorHolder").innerHTML = "Password must have Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"
         return false
     }
    let container = {
        user: email,
        password: password 
    }

    return container;
}
</script>

<template>

    <div class="form-signin text-center bg-white shadow">
        <form>
            <img src="..\Groupomania_Logos\icon.svg" alt="Groupomaina logo" class="mb-4"  width="90" height="90">
            <h1 class="h3 mb-3 fw-normal">Welcome to Groupomaina Rally Point</h1>
        <div class="form-floating">
            <input type="email" class="form-control" id="emailInput" placeholder="Email Address" @keyup.enter="login">
            <label for="emailInput">Email Address</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="inputPassword" placeholder="Password" @keyup.enter="login">
            <label for="inputPassword">Password</label>
        </div>
        <div class="form-floating">
            <button type="button" class="m-2 btn mw-25 btn-lg btn-primary" @click="login">login</button>
            <button type="button" class="m-2 btn btn-secondary btn-lg mw-25" @click="createAccount">Create Account</button>
        </div>
    </form>
    <div id="errorHolder"></div>
    </div>

    
</template>