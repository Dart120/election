<script lang="ts">
    export let answer = '';
    export let label = '';
    export let status = false;
    export let election_store;
    export let win_info;
    export let loading = false;
    import Textfield from '@smui/textfield';
    import Button from '@smui/button';
    import Label from '@smui/button';
    const handleSubmit = async () => {
      // Logic to handle form submission
      console.log(`Answer: ${answer}`);
      loading = true
      status = true;
      const response = await fetch(`https://api-dart120-dart120s-projects.vercel.app/postcode/${answer}`);
      const data = await response.json();
      election_store.set(collateData(data));
      loading = false
      
    };
    const collateData = (data) => {
      let most_votes = 0;
      let most_votes_party = "";
      let total_votes = 0;
      let cand_list = [];
      for (const [key, value] of Object.entries(data["candidate"])) {
        cand_list.push([key,value])
      }
      console.log(cand_list)
      cand_list.forEach((cand, index)=>{


        let party = data["party_name"][cand[0]]
        let votes = data["votes"][cand[0]]
        let percent = data["vote_share_percent"][cand[0]]
        total_votes += votes;
        if (votes > most_votes){
          most_votes = votes
          most_votes_party = party
        }
        

        cand_list[index].push(party)
        cand_list[index].push(votes)
        cand_list[index].push(percent)
      });
     
      win_info.win_party = most_votes_party; 
      win_info.win_votes = total_votes - most_votes; 
      return cand_list
    };
  </script>
<div class="input">

    <Textfield variant="outlined" bind:value={answer} label={label} class="sub" disabled={status}>
    </Textfield>
 

    <Button on:click={() => handleSubmit()} variant="raised" class="sub button" disabled={status}>
      <Label class="label">Submit</Label>
    </Button>

  </div>

<style>
  .input{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  * :global(.sub){
    margin: 1em;
  }
  * :global(.label){
    color: aliceblue;
  }

</style>
    
 
