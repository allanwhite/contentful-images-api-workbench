<script>
  import { createEventDispatcher } from 'svelte';

  export let value = '';

  const dispatch = createEventDispatcher();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch('submit', { value });
  };
</script>

<form class="base-url-form" on:submit={handleSubmit}>
  <label class="form-label" for="base-url-input">Base image URL</label>
  <div class="form-controls">
    <input
      id="base-url-input"
      class="url-input"
      type="url"
      placeholder="Image URL..."
      bind:value
      required
    />
    <button type="submit">Update</button>
  </div>
</form>

<style>
  .base-url-form {
    display: grid;
    gap: 0.5rem;
    width: min(100%, 50ch);
    margin: 0 auto;
    text-align: left;
  }

  .form-label {
    font-weight: 600;
    color: var(--color-heading);
  }

  .form-controls {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .url-input {
    flex: 1;
    padding: 0.65rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-family: monospace;
  }

  .url-input:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
  }
</style>
