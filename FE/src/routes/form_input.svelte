<script lang="ts">
    export let answer = '';
    export let label = '';
    export let status = false;
    export let election_store;
    export let win_info;
    export let loading = false;
    export let cons_name = "";
    let invalid = false
    import Textfield from '@smui/textfield';
    import Button from '@smui/button';
    import Label from '@smui/button';
    const handleSubmit = async () => {
      // Logic to handle form submission
      
      loading = true
      status = true;
      let san_answer = answer.replace(/\s/g, '')
      console.log(`Answer: ${answer}`);
      const response = await fetch(`https://api-i5i4rt6kr-dart120s-projects.vercel.app/postcode/${san_answer}`);
      
      
      invalid = !response.ok
      if (invalid){
        loading = false
        status = false
        return
      }
      const data = await response.json();
      
      election_store.set(collateData(data));
      loading = false
      
    };
    const collateData = (data) => {
      cons_name = Object.values(data["constituency"])[0]
      let most_votes = 0;
      let most_votes_party = "";
      let votes_list = [];
      let cand_list = [];
      for (const [key, value] of Object.entries(data["candidate"])) {
        cand_list.push([key,value])
      }
      console.log(cand_list)
      cand_list.forEach((cand, index)=>{


        let party = data["party_name"][cand[0]]
        let votes = data["votes"][cand[0]]
        let percent = data["vote_share_percent"][cand[0]]
        // total_votes += votes;
        votes_list.push(votes)
        
        if (votes > most_votes){
          most_votes = votes
          most_votes_party = party
        }
        

        cand_list[index].push(party)
        cand_list[index].push(votes)
        cand_list[index].push(percent)
      });
      console.log(votes_list)
      console.log(votes_list.sort((a, b) => b-a)[1])
      console.log(votes_list.sort((a, b) => b-a))
      win_info.win_party = most_votes_party; 
      win_info.win_votes = most_votes - votes_list.sort((a, b) => b-a)[1]; 
      console.log(most_votes)
      console.log(votes_list.sort((a, b) => a - b)[1])

      return cand_list
    };
  </script>
<div class="input">

    <Textfield  variant="outlined" bind:value={answer} label={label} class="sub" disabled={status} invalid={invalid}>
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
    
 
