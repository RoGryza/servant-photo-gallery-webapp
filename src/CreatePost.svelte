<script>
 import { getContext } from 'svelte';
 import { navigateTo } from './Router.svelte';
 import Error from './Error.svelte';

 let service = getContext('service');

 let createdAtStr = '';
 let files = [];
 let caption = '';
 let createdAtElement;
 let disabled = false;
 let error = null;

 $: {
   if (createdAtElement && createdAtStr !== '') {
     const raw = Date.parse(createdAtStr);
     const validity = raw ? '' : 'Invalid date';
     createdAtElement.setCustomValidity(validity);
   }
 }
 
 async function onSubmit() {
   disabled = true;
   try {
     const path = await service.upload(files[0]);
     const createdAt = createdAtStr === '' ? null : new Date(Date.parse(createdAtStr));
     const id = await service.createPost(path, caption.replace(/\n/g, ''), createdAt);
     navigateTo('/');
   } catch (e) {
     error = e;
   } finally {
     disabled = false;
   }
 }
</script>

<form on:submit|preventDefault={onSubmit}>
  <label for="created_at">Date (empty for today)</label>
  <input bind:this={createdAtElement} id="created_at" bind:value={createdAtStr}
    {disabled}/>

  <label for="file">Image <small>JPEG only</small></label>
  <input type="file" accept=".jpg, .jpeg" bind:files required {disabled}/>

  <label class="long" for="caption">Caption</label>
  <textarea id="caption" cols="60" lines="2" bind:value={caption} {disabled}/>

  <br/>
  <input type="submit" value="Post" {disabled}>
</form>
{#if error}
  <Error>{error}</Error>
{/if}

<style>
 textarea {
   resize: none;
 }
</style>
