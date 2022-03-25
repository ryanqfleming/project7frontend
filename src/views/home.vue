<template>
<HeaderBar />
<CommentPoster />

<ul>
    <li v-for="post in posts" :key="post" v-bind:id="post.id" class="postList rounded shadow">
        <div class="homePost" :class="(post.viewed == 'true')?'viewedTrue':'viewedFalse'">
            <div class="h3 p-2 border-bottom">{{ post.user }}</div>
            <img v-if="post.img !== null" v-bind:src="post.img" alt="userPosts" class="homePostImage rounded-top shadow-sm border-top">
 <div class="h6 p-3 bg-light">{{ post.postText }}</div>
            <div class="h6 p-2 bg-white border-bottom"></div>
           
        </div>
    </li>

</ul>
<div ref="loadBar" class="text-center">{{ loadBar }}</div>
</template>



<script>

const ValidateToken = require('../models/validateToken')
let host = 'http://localhost:3000'

import HeaderBar from '../components/Header.vue'
import CommentPoster from '../components/createpost.vue'
let _= require('lodash')
export default {

    mounted: async function(){
        //call validation and route to login if false
         ValidateToken.then(result=>{
     console.log('validate processed', result)
     if(result != 'true'){
         this.$router.push('/login')
     }
 })

this.resizeLoader()
window.addEventListener('resize', this.resizeLoader)
//using lodash to throttle the scroll loader
window.addEventListener('scroll', _.throttle(this.scrollLoader, 500))


 // initial getting of user posts
        getPosts(this.currentTier).then(result=>{
            console.log('post data', result)

            this.posts = result
            this.loadedPosts = this.viewedSplicer(result)
        })
    },
    name: 'home',
    components:{
        HeaderBar,
        CommentPoster
    },
    methods:{
        //remove viewed items from the loaded array when it's pulled from the backend
        viewedSplicer(result){
           let holder = []
            for(let i =0; i < result.length; i++){
                console.log('in for loop', holder)
                console.log(result[i].viewed)
                if(result[i].viewed == 'false'){
                    console.log(result[i])
                    holder.push(result[i])
                }
            }
            console.log(holder, 'holder')
            return holder
        },
        resizeLoader(){
            console.log('resize called')
            this.viewportHeight = document.documentElement.clientHeight
        },
        //handle the events we need when scrolling
        scrollLoader(){
            console.log('scrolled')
            this.postLoader()
            this.viewedScript()
            
        },
        //it loads posts
        postLoader(){
            let fromTop = this.$refs.loadBar.getBoundingClientRect().top;
            if(fromTop < this.$data.viewportHeight*2){
                console.log('bottom')
                if(this.morePosts != false){
                    this.addPosts()
                }
            }
        },
        //checks if the element bottom has passed 0(we have scrolled past it). Makes post/lets the backend know and removes it from the loadedPosts array so the for loop is not heavy
        viewedScript(){
            //cleanse it first of viewed items
            this.loadedPosts = this.viewedSplicer(this.loadedPosts)
            for(let i=0; i < this.loadedPosts.length; i++){
                let loadElement = document.getElementById(this.loadedPosts[i].id)
                let elementView = loadElement.getBoundingClientRect()
                let container = {
                    post: this.loadedPosts[i].id
                }
                let test = JSON.stringify(container)
                if(elementView.bottom < this.viewportHeight -(this.viewportHeight / 2) & this.loadedPosts[i].viewed == "false"){
                    const viewRequest ={
                        method: "POST",
                       
                        body: test,
                        headers:{
                            authorization: this.userToken,
                            "content-Type" : "application/json"
                        }
                    };
                    fetch('http://localhost:3000/view', viewRequest)
                    this.loadedPosts[i].viewed = 'true'
                }
            }
        },
        //adds the posts to the page
        addPosts(){
            this.currentTier = this.currentTier + 1;
            getPosts(this.currentTier).then(result=>{
                console.log(result)
                this.loadedPosts = this.loadedPosts.concat(this.viewedSplicer(result)) 
                console.log(this.loadedPosts, 'loaded posts updated')
                //if the posts are ending lets not ping the server for more
                if(result.length < 10){
                    this.morePosts = false
                    this.loadBar = "No More Posts To View. Why Don't You add More?"
                } 
                this.posts = this.posts.concat(result)
            })
            
        },
    },
data: function() {
      return {
          userToken: 'Bearer ' + localStorage.getItem("jwt"),
          loadedPosts: [],
          scrolling: false,
          isViewedTheme: 'viewed',
          postId: null,
          morePosts: true,
          viewportHeight: 0,
          loadBar:"",
          currentTier:0,
          newPost: '',
          posts: [{user: 'null', img: "", text: "null"}],
      } 
    },
}
//pulls posts from backend
async function getPosts(tier) {
    let url = host + '/posts'
    let bodyData = {tier: tier}
    try {
        let res = await fetch(url,{
            method: "POST",
            headers:{
            "content-Type" : "application/json",
            "Authorization" : 'Bearer ' + localStorage.getItem("jwt")
    },
    body: JSON.stringify(bodyData)
        });
        
        return await res.json();
    } catch(error) {
        console.error(error);
    }
    
}

</script>
<style>
.viewedTrue{
    border: 5px solid rgb(202, 202, 240);
    border-radius: 5px;
}

</style>

