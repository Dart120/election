<script lang="ts">
    import CircularProgress from '@smui/circular-progress';
     import Button from '@smui/button';
     import Label from '@smui/button';
     import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import { writable } from 'svelte/store';
    import FormInput from './form_input.svelte';
    import Result from './result.svelte';
    import Consent from './consent.svelte';
    import { onMount } from 'svelte';

    onMount(() => {
        const userConsent = localStorage.getItem('userConsent');
        if (userConsent === 'accepted') {
            loadAnalytics();
        }
    });

    function loadAnalytics() {
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-M8Z8RE5FMZ';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M8Z8RE5FMZ');
        }
    }
 
    let home_postcode = '';
    let uni_postcode = '';
    let uni_submitted = false;
    let loading_home = false
    let loading_uni = false
    let home_cons = ""
    let uni_cons = ""
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
        <Title>Find Out Where to Vote - Register by Midnight 18th June!</Title>
      </Section>
    </Row>
  </TopAppBar>
<div class="vbox">
    <div class="card-display">
        <div class="card-container">
            <p>With their option to vote either at home or at university but register at both, students have the advantage of being able to choose to cast their ballots where they believe it will have a bigger impact on the overall result.
                 This tool helps students choose where to vote by pointing to the constituency that in 2019 produced the smaller vote difference between the winning party and the second-placed candidate.
                It is a reproduction of <a href="https://www.theguardian.com/politics/ng-interactive/2019/nov/07/should-you-vote-at-home-or-at-uni-students">this tool</a> by the Guardian published in 2019 with updated data from the previous election. <br>
                Please beware that this tool uses the old constituency boundaries, the results may be inaccurate if that has changed for you between elections.
            
            </p>
        </div>
    </div>
    <div class="card-display">
        <div class="card-container">
            <p>Simply enter both your home and university postcodes and click the Submit buttons.</p>
            <FormInput bind:cons_name = {uni_cons} bind:loading = {loading_uni} bind:win_info = {uni_win_info} answer = {uni_postcode} label = 'University Postcode' bind:status = {uni_submitted} election_store = {election_data_uni}></FormInput>
            <FormInput bind:cons_name = {home_cons} bind:loading = {loading_home} bind:win_info = {home_win_info} answer = {home_postcode} label = 'Home Postcode' bind:status = {home_submitted} election_store = {election_data_home}></FormInput>
        </div>
    </div>
    {#if uni_submitted && home_submitted}

    <div class="card-display">
        <div class="card-container">
            {#if loading_home || loading_uni}
            <CircularProgress style="height: 32px; width: 32px;" indeterminate />

            {:else}

        {#if uni_win_info.win_votes <= home_win_info.win_votes}
          <h1>Your university seat is more marginal than your home seat. Your vote would likely make more of a difference there.</h1>
          {:else}
          <h1>Your home seat is more marginal than your university seat.  Your vote would likely make more of a difference there.</h1>
          {/if}
          {/if}
       
        </div>
    </div>
    {/if}
<div class="hbox">
    {#if uni_submitted && home_submitted && !(loading_home || loading_uni)}
    
    <div class="card-display">
        <div class="card-container">
            <h1>Home:</h1>
            <Result cons_name = {home_cons} election_data={$election_data_home} win_info = {home_win_info}></Result>
       
        </div>
    </div>
    <div class="card-display">
        <div class="card-container">
      
            <h1>University:</h1>
            <Result cons_name = {uni_cons} election_data={$election_data_uni} win_info = {uni_win_info}></Result>
 
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
<Consent></Consent>
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
        padding: 1em;
  }
    * :global(.b){
        margin: 0 auto;
  }
  :global(body) {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  @media (max-width: 1300px) {
    .hbox {
      flex-direction: column;
    }
  }
</style>
