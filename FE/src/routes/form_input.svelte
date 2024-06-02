<script>
    export let answer = '';
    export let label = '';
    export let status;
    export let election_store;

    const handleSubmit = async () => {
      // Logic to handle form submission
      console.log(`Answer: ${answer}`);
      status = true;
      const response = await fetch(`http://127.0.0.1:5000/postcode/${answer}`);
      const data = await response.json();
      election_store.set(data);
    };
  </script>
  
  <form on:submit|preventDefault={handleSubmit}>
    <label for={label}>{label}</label>
    <input id={label} type="text" bind:value={answer} />
    <button type="submit">Submit</button>
  </form>