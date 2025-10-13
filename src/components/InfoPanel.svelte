<script>
  export let title = '';
</script>

<section class="info-panel">
  {#if title}
    <h2>{title}</h2>
  {/if}
  <slot />
</section>

<style>
  .info-panel {
    margin-top: var(--pad-xl);
    display: grid;
    gap: var(--pad-md);
    & h2 {
      margin: 0;
      color: var(--color-heading);
    }
  }


</style>
