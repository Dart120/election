<script lang="ts">
    import { writable } from 'svelte/store';
    import FormInput from './form_input.svelte';
    let home_postcode = '';
    let uni_postcode = '';
    let uni_submitted = false;
    let home_submitted = false;
    const election_data_uni = writable({});
    const election_data_home = writable({});
    
    

</script>

<div>
    <FormInput answer = {uni_postcode} label = 'University Postcode' bind:status = {uni_submitted} election_store = {election_data_uni}></FormInput>
    <FormInput answer = {home_postcode} label = 'Home Postcode' bind:status = {home_submitted} election_store = {election_data_home}></FormInput>
    {home_submitted}
    {uni_submitted}
    {#if uni_submitted && home_submitted}
    <h1>
        {JSON.stringify($election_data_uni)}
       
    </h1>
    {/if}
</div>