<template>
    <nav class="topnav shadow">
        <img src="/icon-left-font.svg" alt="" class="headLogo" @click="home">
        <div class="headLinks"> <button class="btn btn-sm btn-secondary" @click="logout">Account</button></div>
    </nav>
</template>

<script>
export default {
    methods: {
        logout(){
            this.$router.push('/account')
        },
        home(){
            this.$router.push("/")
        }
    }
}
</script>
