import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{$ as t,J as n}from"./lit-runtime-CE4wpvNA.js";import{o as r,t as i}from"./control-ui-core-CXeSrnoQ.js";import{t as a}from"./web-awesome-tabs-CEtFMiPt.js";function o(e){switch(e){case`sessions`:return r(`tabs.sessions`);case`worktrees`:return r(`tabs.worktrees`);default:return e}}function s(e){return t`
    <wa-tab-group
      class="hub-tabs plugins-hub-tabs sessions-hub-tabs"
      aria-label=${r(`sessionsPage.hubTablistLabel`)}
      .active=${e.active}
      activation="manual"
      without-scroll-controls
      @wa-tab-show=${t=>e.onSelect(t.detail.name)}
    >
      ${c.map(n=>{let r=e.active===n;return t`
          <wa-tab
            id=${`sessions-tab-${n}`}
            panel=${n}
            aria-controls="sessions-hub-panel"
            class="hub-tab"
            ?active=${r}
          >
            ${o(n)}
          </wa-tab>
        `})}
    </wa-tab-group>
  `}var c,l=e((()=>{n(),i(),a(),c=[`sessions`,`worktrees`]}));export{s as n,l as t};
//# sourceMappingURL=sessions-hub-tabs-eM_x01uP.js.map