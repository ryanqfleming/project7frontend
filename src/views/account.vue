<template>
<HeaderBar />
<button class="btn btn-secondary btn-large" @click="deleteAccount">Delete Account</button>
<button class="btn btn-secondary btn-large" @click="logout">Logout </button>
</template>

<script>
const ValidateToken = require('../models/validateToken')
import HeaderBar from '../components/Header.vue'
export default {
 name: 'account',
    components:{
        HeaderBar,
    },
mounted: async function(){
        //call validation and route to login if false
         ValidateToken.then(result=>{
     console.log('validate processed', result)
     if(result != 'true'){
         this.$router.push('/login')
     }
 })},
    methods: {
        logout(){
            localStorage.clear()
            this.$router.go()
        },
        deleteAccount(){

            if(confirm("Are you sure you would like to delete your account? This action cannot be reversed")== true){
                 
const response = fetch("http://localhost:3000/delete",{
    method: "POST",
    headers:{
        "content-Type" : "application/json",
        "Authorization" : 'Bearer ' + localStorage.getItem("jwt")
    },
     
})
response.then(result=>{
this.logout()
})
            }
        }
    }
}
</script>

<style>

</style>