<template>
<form @submit.prevent="onSubmit" enctype="multipart/form-data">
  <div class="postList rounded shadow">
      <div class="form-group">
    <label for="exampleFormControlTextarea1">Add a Post </label>
    <textarea class="form-control" id="textUpload" ref="textUpload" rows="3" @change="onSelect" ></textarea>
  </div>
  <div class="form-group p-2">
    <label for="exampleFormControlFile1">  </label>
    <input type="file" class="form-control-file" ref="file" id="file" @change="onSelect" />
<button class="btn btn-sm btn-primary float-end">Submit</button>
  </div></div>
</form>

</template>

<script>
//axios allows us to have headers for authorization when send formdata
import axios from 'axios';
export default {
      data(){
        return {
            file:"",
            message:"",
            userToken: 'Bearer ' + localStorage.getItem("jwt")
        }      
    },
methods: {
  onSelect(){
    const file = this.$refs.file.files[0];
    this.file = file;
    console.log(file, 'file')

  },
  async onSubmit(){

    this.message = this.$refs.textUpload.value;
    const formData = new FormData();
    console.log(this.file, 'the fileee')
    //check if we have an image or not. We don't want to send form data if we don't have an image. 
    if(this.file === undefined){
      const bigContainer ={
        message: this.message,
        hasImage: false,
      }
      try{
        const response = await fetch("http://localhost:3000/makePost",{
          method: "POST",
          body:JSON.stringify(bigContainer),
          headers:{
            "content-Type":"application/json",
            authorization: this.userToken
          }
        })
        const respounded = await response.text()
         this.$router.go()
      } catch(err){
       console.error(err) 
      }
      
    } else {
    formData.append('file',this.file);
    formData.append('message', this.message);
    formData.append('hasImage', 'true')
    formData.append('server', 'http://localhost:3000')
    
    try{
      await axios.post('http://localhost:3000/makePost',formData,
      {
        headers:{
          authorization: this.userToken
        }
      });
    } catch(err) {
      console.log(err);
    }
    this.$router.go()
  }
  }

 
}
}

</script>

<style>

</style>