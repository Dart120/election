<script lang="ts">
    import CircularProgress from '@smui/circular-progress';
     import Button from '@smui/button';
     import Label from '@smui/button';
     import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import { writable } from 'svelte/store';
    import FormInput from './form_input.svelte';
    import Result from './result.svelte';
 
    let home_postcode = '';
    let uni_postcode = '';
    let uni_submitted = false;
    let loading_home = false
    let loading_uni = false
    let uni_win_info = {
    win_party : "" ,
    win_votes : 0 ,        
   
        }
    let home_win_info = {
        win_party : "" ,
        win_votes : 0 ,        
   
        }
    
    let home_submitted = false;
    const election_data_uni = writable([]);
    const election_data_home = writable([]);
    const startOver = () => {
        uni_submitted = false
        home_submitted = false
        uni_win_info = {
            win_party : "" ,
            win_votes : 0 ,        
        }
        home_win_info = {
            win_party : "" ,
            win_votes : 0 ,        
        }
        home_postcode = ""
        uni_postcode = ""
    }

    
    

</script>
<TopAppBar variant="static">
    <Row>
      <Section>
        <Title>Where to Vote!</Title>
      </Section>
    </Row>
  </TopAppBar>
<div class="vbox">
    <div class="card-display">
        <div class="card-container">
            <FormInput bind:loading = {loading_uni} bind:win_info = {uni_win_info} answer = {uni_postcode} label = 'University Postcode' bind:status = {uni_submitted} election_store = {election_data_uni}></FormInput>
            <FormInput bind:loading = {loading_home} bind:win_info = {home_win_info} answer = {home_postcode} label = 'Home Postcode' bind:status = {home_submitted} election_store = {election_data_home}></FormInput>
        </div>
    </div>
    {#if uni_submitted && home_submitted}

    <div class="card-display">
        <div class="card-container">
            {#if loading_home || loading_uni}
            <CircularProgress style="height: 32px; width: 32px;" indeterminate />

            {:else}

        {#if uni_win_info.win_votes <= home_win_info.win_votes}
          <h1>Your university seat is more marginal than your home seat</h1>
          {:else}
          <h1>Your home seat is more marginal than your university seat</h1>
          {/if}
          {/if}
       
        </div>
    </div>
    {/if}
<div class="hbox">
    {#if uni_submitted && home_submitted && !(loading_home || loading_uni)}
    
    <div class="card-display">
        <div class="card-container">
         
            <Result election_data={$election_data_home} win_info = {home_win_info}></Result>
       
        </div>
    </div>
    <div class="card-display">
        <div class="card-container">
      
    
            <Result election_data={$election_data_uni} win_info = {uni_win_info}></Result>
 
        </div>
    </div>
    {/if}
</div>
{#if uni_submitted && home_submitted}
<div class="card-display">
    <div style = "margin: 0 auto; color: white; " class="card-container b">
        <Button   on:click={() => startOver()} variant="raised" class="sub button">
            <Label style = "color: white; " class="label">Start Over</Label>
          </Button>
     
    </div>
</div>
{/if}
</div>

<style>
    .hbox{
        display: flex;
        justify-content: space-evenly;
    }
    .vbox{
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-content: center;
        height: 40%;
    }
    * :global(.card-display){
        margin: 1em;
        border: 2px dotted grey;
        border-radius: 5px;
  }
    * :global(.b){
        margin: 0 auto;
  }
  @media (max-width: 1300px) {
    .hbox {
      flex-direction: column;
    }
  }
</style>
