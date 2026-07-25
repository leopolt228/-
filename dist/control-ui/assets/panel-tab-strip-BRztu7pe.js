import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{$ as t,J as n,X as r,it as i,tt as a}from"./lit-runtime-CE4wpvNA.js";import{t as o}from"./web-awesome-tabs-CEtFMiPt.js";function s(e){let n=n=>t`
    <button
      slot=${n?`nav`:r}
      class="tabstrip-new"
      type="button"
      ?disabled=${e.newDisabled}
      title=${e.newLabel}
      aria-label=${e.newLabel}
      @click=${e.onNew}
    >
      ${l}
    </button>
  `;return e.tabs.length===0?n(!1):t`
    <wa-tab-group
      class="tabstrip"
      .active=${e.activeId??``}
      activation="auto"
      without-scroll-controls
      @wa-tab-show=${t=>e.onSelect(t.detail.name)}
    >
      ${e.tabs.map(n=>t`
          <wa-tab
            id=${n.domId}
            class=${`tabstrip-tab ${n.className??``}`}
            panel=${n.id}
            aria-controls=${e.ariaControls}
            title=${n.title||r}
            @auxclick=${t=>{t.button===1&&(t.preventDefault(),e.onClose(n.id))}}
          >
            ${n.icon==null||n.icon===r?r:t`<span class="tabstrip-tab__icon" aria-hidden="true">${n.icon}</span>`}
            <span class="tabstrip-tab__label">${n.label}</span>
            ${n.badge?t`<span class="tabstrip-tab__badge">${n.badge}</span>`:r}
            ${n.statusLabel?t`<span class="tabstrip-tab__status">${n.statusLabel}</span>`:r}
          </wa-tab>
          <button
            slot="nav"
            class="tabstrip-tab__close"
            type="button"
            title=${n.closeLabel}
            aria-label=${n.closeLabel}
            @click=${()=>e.onClose(n.id)}
          >
            <span class="tabstrip-tab__close-box">${c}</span>
          </button>
        `)}
      ${n(!0)}
    </wa-tab-group>
  `}var c,l,u,d=e((()=>{n(),o(),c=a`<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>`,l=a`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 3v10M3 8h10" /></svg>`,u=i`
  .tabstrip {
    --track-width: 0;
    display: block;
    /* Allow the strip to shrink inside a flex header so wide tab rows scroll
       here instead of squeezing out sibling header controls. */
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabstrip::part(nav) {
    display: flex;
    align-items: stretch;
  }
  .tabstrip::part(body) {
    display: none;
  }
  .tabstrip::-webkit-scrollbar {
    display: none;
  }
  .tabstrip-tab::part(base) {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0 4px 0 10px;
    height: 36px;
    color: var(--muted, #8a919e);
    white-space: nowrap;
    font-size: 12.5px;
    border-bottom: 2px solid transparent;
    transition:
      color 0.12s ease,
      background 0.12s ease;
  }
  .tabstrip-tab:hover::part(base) {
    color: var(--text, #d7dae0);
    background: color-mix(in srgb, var(--text, #d7dae0) 6%, transparent);
  }
  .tabstrip-tab[active]::part(base) {
    color: var(--text, #d7dae0);
    border-bottom-color: var(--accent, #ff5c5c);
  }
  .tabstrip-tab.is-exited::part(base) {
    opacity: 0.55;
  }
  .tabstrip-tab.is-connecting .tabstrip-tab__icon {
    animation: tabstrip-pulse 1.2s ease-in-out infinite;
  }
  .tabstrip-tab__icon {
    display: inline-flex;
    color: var(--accent, #4ec9a8);
  }
  .tabstrip-tab.is-exited .tabstrip-tab__icon {
    color: var(--muted, #8a919e);
  }
  .tabstrip-tab__label {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-variant-numeric: tabular-nums;
  }
  .tabstrip-tab__status {
    font-size: 11px;
    color: var(--muted, #8a919e);
  }
  .tabstrip-tab__badge {
    border: 1px solid color-mix(in srgb, var(--accent, #4ec9a8) 45%, transparent);
    border-radius: 999px;
    color: var(--accent, #4ec9a8);
    font-size: 9px;
    line-height: 14px;
    padding: 0 5px;
    text-transform: uppercase;
  }
  /* Each close button sits right after its tab in the nav slot; the pair is
     styled as one surface (shared hover background, shared active underline)
     while the X keeps its own inner highlight. */
  .tabstrip-tab__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    flex: 0 0 auto;
    width: 24px;
    margin-right: 1px;
    padding: 0 4px 0 0;
    opacity: 0;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--muted, #8a919e);
    transition:
      color 0.12s ease,
      background 0.12s ease,
      opacity 0.12s ease;
  }
  .tabstrip-tab__close-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 5px;
  }
  :where(.tabstrip-tab:hover, .tabstrip-tab[active]) + .tabstrip-tab__close,
  .tabstrip-tab__close:hover,
  .tabstrip-tab__close:focus-visible {
    opacity: 1;
  }
  .tabstrip-tab:hover + .tabstrip-tab__close,
  .tabstrip-tab__close:hover,
  .tabstrip-tab__close:focus-visible {
    background: color-mix(in srgb, var(--text, #d7dae0) 6%, transparent);
  }
  /* Back-propagate hover from the X to its tab so the pair lights up together. */
  .tabstrip-tab:has(+ .tabstrip-tab__close:hover)::part(base),
  .tabstrip-tab:has(+ .tabstrip-tab__close:focus-visible)::part(base) {
    color: var(--text, #d7dae0);
    background: color-mix(in srgb, var(--text, #d7dae0) 6%, transparent);
  }
  .tabstrip-tab[active] + .tabstrip-tab__close {
    border-bottom-color: var(--accent, #ff5c5c);
  }
  .tabstrip-tab__close:hover,
  .tabstrip-tab__close:focus-visible {
    color: var(--text, #d7dae0);
  }
  .tabstrip-tab__close:hover .tabstrip-tab__close-box,
  .tabstrip-tab__close:focus-visible .tabstrip-tab__close-box {
    background: color-mix(in srgb, var(--text, #d7dae0) 14%, transparent);
  }
  .tabstrip-new {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    align-self: center;
    width: 26px;
    height: 26px;
    border: none;
    background: transparent;
    color: var(--muted, #8a919e);
    border-radius: 6px;
    padding: 0;
  }
  .tabstrip-new:hover {
    background: color-mix(in srgb, var(--text, #d7dae0) 12%, transparent);
    color: var(--text, #d7dae0);
  }
  @keyframes tabstrip-pulse {
    50% {
      opacity: 0.35;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .tabstrip-tab.is-connecting .tabstrip-tab__icon {
      animation: none;
    }
  }
`}));export{u as n,s as r,d as t};
//# sourceMappingURL=panel-tab-strip-BRztu7pe.js.map