<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './adminHeader.vue';
    import vSidebar from './adminSidebar.vue';
    export default {
        components:{
            vHead, vSidebar
        },
        mounted(){
            console.log("home active");
            console.log(sessionStorage.getItem('ms_type'));
            var sessionType = sessionStorage.getItem('ms_type')
            if(sessionType != 1){
                this.$router.push('/nologin');
            }
        }

    }
</script>
