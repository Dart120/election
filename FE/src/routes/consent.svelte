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
    position: sticky;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    text-align: center;
    padding: 1rem;
    z-index: 1000;
    box-shadow: 0 -4px 6px rgba(0,0,0,0.1); 
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
    </div>
{/if}