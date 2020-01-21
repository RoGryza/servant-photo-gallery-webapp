<script>
 import { setContext } from 'svelte';
 import APIService from './Service.js';
 import Home from './Home.svelte';
 import Login from './Login.svelte';
 import CreatePost from './CreatePost.svelte';
 import Router, { navigateTo } from './Router.svelte';

 export let api_base_url;
 setContext('service', new APIService(api_base_url))
</script>

<Router
  defaultRoute="/login"
  routes={{
           '/': () => Home,
           '/login': () => Login,
           '/posts/new': () => CreatePost,
         }}/>

<style>
</style>
