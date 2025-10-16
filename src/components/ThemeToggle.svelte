<script>
  import { onMount } from 'svelte';

  const MODES = ['auto', 'light', 'dark'];
  const STORAGE_KEY = 'themeMode';
  const MODE_LABELS = {
    auto: 'Theme: Auto (system default)',
    light: 'Theme: Light',
    dark: 'Theme: Dark'
  };

  let mode = 'auto';
  let activeMode = 'light';
  let mediaQuery;

  onMount(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    updateActiveMode();
    mediaQuery.addEventListener('change', handleSystemChange);

    const stored = localStorage.getItem(STORAGE_KEY);
    setMode(MODES.includes(stored) ? stored : 'auto');

    return () => {
      mediaQuery?.removeEventListener('change', handleSystemChange);
    };
  });

  function handleSystemChange() {
    updateActiveMode();
    if (mode === 'auto') {
      applyTheme('auto');
    }
  }

  function updateActiveMode() {
    const prefersDark = mediaQuery?.matches ?? false;
    activeMode = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode;
  }

  function setMode(nextMode) {
    mode = nextMode;
    applyTheme(nextMode);
    updateActiveMode();
  }

  function applyTheme(currentMode) {
    const root = document.documentElement;
    if (!root) return;

    if (currentMode === 'auto') {
      root.removeAttribute('data-color-scheme');
      root.style.setProperty('color-scheme', 'light dark');
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    root.setAttribute('data-color-scheme', currentMode);
    root.style.setProperty('color-scheme', currentMode);
    localStorage.setItem(STORAGE_KEY, currentMode);
  }

  function cycleMode() {
    const currentIndex = MODES.indexOf(mode);
    const nextMode = MODES[(currentIndex + 1) % MODES.length];
    setMode(nextMode);
  }
</script>

<button
  class="theme-toggle"
  type="button"
  on:click={cycleMode}
  aria-pressed={mode !== 'auto'}
  aria-label={MODE_LABELS[mode]}
  title={MODE_LABELS[mode]}
  data-mode={mode}
  data-active={activeMode}
>
  <span class="icon sun" aria-hidden="true">
    <svg viewBox="0 0 24 24" role="presentation" focusable="false">
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-10a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM11 2h2v3h-2zm0 17h2v3h-2zM4.22 5.64l1.42-1.42L7.78 6.36 6.36 7.78zM16.22 17.78l1.42-1.42 2.12 2.12-1.42 1.42zM2 11h3v2H2zm17 0h3v2h-3zM6.36 17.64 7.78 16.22l-2.12-2.12-1.42 1.42zm12.98-10.9L17.92 5.3l-2.12 2.12 1.42 1.42z"
      />
    </svg>
  </span>
  <span class="icon moon" aria-hidden="true">
    <svg viewBox="0 0 24 24" role="presentation" focusable="false">
      <path
        d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79Zm-8 6.21a7 7 0 0 0 6.92-5.89A9 9 0 0 1 11.1 5.08 5 5 0 0 0 13 20Z"
      />
    </svg>
  </span>
  <span class="indicator" data-mode={mode}></span>
</button>

<style>
  .theme-toggle {
    --toggle-height: 32px;
    --toggle-padding: 4px;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 64px;
    padding: 0 var(--toggle-padding);
    height: var(--toggle-height);
    border-radius: var(--toggle-height);
    border: 1px solid color-mix(in srgb, var(--color-accent) 50%, transparent);
    background: color-mix(in srgb, var(--background) 88%, transparent);
    color: var(--text);
    transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
    cursor: pointer;
  }

  .theme-toggle:hover,
  .theme-toggle:focus-visible {
    border-color: var(--color-primary);
    outline: none;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 35%, transparent);
  }

  .icon {
    display: inline-flex;
    width: 18px;
    height: 18px;
    opacity: 0.3;
    transition: opacity 160ms ease, transform 180ms ease;
  }

  .theme-toggle[data-active='light'] .sun {
    opacity: 1;
    transform: scale(1.05);
  }

  .theme-toggle[data-active='dark'] .moon {
    opacity: 1;
    transform: scale(1.05);
  }

  svg {
    width: 100%;
    height: 100%;
    fill: var(--text);
  }

  .indicator {
    position: absolute;
    top: var(--toggle-padding);
    bottom: var(--toggle-padding);
    left: var(--toggle-padding);
    width: calc((100% - (var(--toggle-padding) * 2)) / 3);
    border-radius: calc(var(--toggle-height) / 2);
    background: color-mix(in srgb, var(--color-primary) 30%, transparent);
    transition: transform 200ms ease, background 200ms ease, opacity 200ms ease;
    z-index: -1;
  }

  .indicator[data-mode='light'] {
    transform: translateX(0);
    opacity: 0.7;
  }

  .indicator[data-mode='auto'] {
    transform: translateX(100%);
    opacity: 0.55;
  }

  .indicator[data-mode='dark'] {
    transform: translateX(200%);
    opacity: 0.85;
  }
</style>
