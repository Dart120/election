<script>
    import { writable } from 'svelte/store';

    // Store to manage the display of the consent banner
    export let displayConsent = writable(true);

    // Function to handle consent acceptance
    function acceptConsent() {
        localStorage.setItem('userConsent', 'accepted');
        displayConsent.set(false);
    }

    // Function to handle consent rejection
    function rejectConsent() {
        localStorage.setItem('userConsent', 'rejected');
        displayConsent.set(false);
    }
</script>

<style>
    .consent-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        text-align: center;
        padding: 1rem;
        z-index: 1000;
    }

    button {
        margin: 0 10px;
        padding: 8px 16px;
        color: white;
        background-color: #4CAF50;
        border: none;
        cursor: pointer;
    }

    button.reject {
        background-color: #f44336;
    }
</style>

{#if $displayConsent}
    <div class="consent-banner">
        <p>We use cookies to enhance your experience (count page views!). By continuing to visit this site you agree to our use of cookies.</p>
        <button on:click={acceptConsent}>Accept</button>
        <button class="reject" on:click={rejectConsent}>Reject</button>
    </div>
{/if}