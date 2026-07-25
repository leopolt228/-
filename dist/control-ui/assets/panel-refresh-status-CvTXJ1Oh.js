import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{$ as t,J as n,X as r}from"./lit-runtime-CE4wpvNA.js";import{o as i,t as a}from"./control-ui-core-CXeSrnoQ.js";function o(){return{error:null,hasLoaded:!1,stale:!1}}function s(e,t){return{...e,error:t?.clearError===!1?e.error:null}}function c(){return{error:null,hasLoaded:!0,stale:!1}}function l(e,t){return{error:t,hasLoaded:e.hasLoaded,stale:e.hasLoaded}}function u(e){let{status:n}=e,a=e.errorMessage??n.error;if(!a&&!n.stale)return r;let o=e.className?` ${e.className}`:``;return a?t`
    <div class="callout danger callout--dismissible${o}" role="alert">
      <span class="callout__content">
        <span>${a}</span>
        ${n.stale?t`<br /><strong>${i(`common.staleData`)}</strong>`:r}
      </span>
      <button class="btn btn--sm" @click=${e.onRetry}>${i(`common.retry`)}</button>
    </div>
  `:t`
      <div class="callout warn${o}" role="status">
        <strong>${i(`common.staleData`)}</strong>
      </div>
    `}var d=e((()=>{n(),a()}));export{d as a,l as i,c as n,u as o,o as r,s as t};
//# sourceMappingURL=panel-refresh-status-CvTXJ1Oh.js.map