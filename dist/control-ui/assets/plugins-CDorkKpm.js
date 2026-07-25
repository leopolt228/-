import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{$ as t,A as n,J as r,N as i,X as a}from"./lit-runtime-CE4wpvNA.js";import{o,t as s}from"./control-ui-core-CXeSrnoQ.js";import{t as c}from"./web-awesome-tabs-CEtFMiPt.js";function l(e){switch(e){case`installed`:return o(`pluginsPage.installedTab`);case`discover`:return o(`pluginsPage.discoverTab`);case`skills`:return o(`tabs.skills`);case`workshop`:return o(`pluginsPage.workshopTab`);default:return e}}function u(e,t){!g&&e!==t.active&&(h={tab:e,at:Date.now()}),g=!1,t.onSelect(e)}function d(e,t){if(!t||h?.tab!==e)return;let n=h;h=null,!(Date.now()-n.at>m)&&window.setTimeout(()=>{t.isConnected&&t.focus()},0)}function f(e){return t`
    <wa-tab-group
      class="hub-tabs plugins-hub-tabs plugins-tabs"
      aria-label=${o(`pluginsPage.hubTablistLabel`)}
      .active=${e.active}
      activation="manual"
      without-scroll-controls
      @wa-tab-show=${t=>u(t.detail.name,e)}
    >
      ${p.map(n=>{let r=e.active===n,o=n===`installed`?e.installedCount??null:null;return t`
          <wa-tab
            id=${`plugins-tab-${n}`}
            panel=${n}
            aria-controls="plugins-hub-panel"
            class="hub-tab"
            ?active=${r}
            @click=${e=>{g=e.detail>0}}
            @keydown=${()=>{g=!1}}
            ${r?i(e=>d(n,e)):a}
          >
            ${l(n)}
            ${o===null?a:t`<span class="settings-count">${o}</span>`}
          </wa-tab>
        `})}
    </wa-tab-group>
  `}var p,m,h,g,_=e((()=>{r(),n(),s(),c(),p=[`installed`,`discover`,`skills`,`workshop`],m=2e3,h=null,g=!1})),v=e((()=>{}));export{_ as n,f as r,v as t};
//# sourceMappingURL=plugins-CDorkKpm.js.map