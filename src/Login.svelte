<script>
 import { getContext } from 'svelte';
 import { navigateTo } from './Router.svelte';
 import Error from './Error.svelte';

 const service = getContext('service');

 let username = '';
 let password = '';
 let error = null;
 let disabled = false;

 async function onLogin() {
   error = null;
   disabled = true;

   try {
     const resp = await service.login(username, password);
     document.cookie = `access_token=${resp.access_token}`;
     navigateTo('/');
   } catch (e) {
     error = e;
   } finally {
     disabled = false;
   }
 }
</script>

<main>
  <form on:submit|preventDefault={onLogin}>
    <label for="username">Username</label>
    <input id="username" required bind:value={username} {disabled}/>
    <label for="password">Password</label>
    <input id="password" required bind:value={password} {disabled}/>
    <br/>
    <input type="submit" value="Login" {disabled}/>
  </form>
  {#if error}
    <Error>{error}</Error>
  {/if}
</main>
