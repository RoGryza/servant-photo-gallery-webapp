<script>
 export let width = "60px";
 export let height = "60px";
</script>

<div class="spinner"
     style="width: {width}; height: {height};"/>

<style>
 .spinner {
   border: 18px dotted #ffffffaa;
   border-radius: 50%;
   animation: spin 3.0s ease infinite;
 }

 @keyframes spin {
   0% { transform:rotate(0deg); }
   100% { transform:rotate(360deg); }
 }
</style>
