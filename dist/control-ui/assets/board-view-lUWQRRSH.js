const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./mcp-app-view-registration-685oGWVu.js","./rolldown-runtime-DaJ6WEGw.js","./control-ui-foundation-43q8Lf_T.js","./control-ui-foundation-DQl2NL7K.js","./lit-runtime-CE4wpvNA.js","./control-ui-foundation-DFIFKu9N.js","./control-ui-core-Dx4utKSD.js","./gateway-runtime-DWs8EJ0W.js","./control-ui-core-6OhF3OIO.js","./control-ui-core-DF5v1q4q.js","./control-ui-core-CXeSrnoQ.js","./control-ui-core-vPyynwls.js","./control-ui-shared-Ca9fxTB8.js","./control-ui-core-DMTVly6f.css","./config-runtime-DO1-qBew.js","./chat-message-RLWYyOXr.js","./message-extract-CIvi08Md.js","./approval-result-validators-BO4pfEC7.js","./markdown-UmoHCmlv.js","./markdown-runtime-BBD8XmVB.js","./attachment-payload-store-CcQeaOvD.js","./tool-display-6QR9l4PK.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{h as t,l as n,m as r,u as i}from"./control-ui-foundation-43q8Lf_T.js";import{dt as a,ft as o}from"./control-ui-foundation-DQl2NL7K.js";import{$ as s,F as c,G as l,J as u,P as d,U as f,X as p,m as ee,p as te,z as m}from"./lit-runtime-CE4wpvNA.js";import{Ha as ne,Ji as re,Mi as h,Pi as g,Ra as _,qi as ie}from"./control-ui-core-Dx4utKSD.js";import{at as ae,c as oe,it as se,l as ce}from"./control-ui-core-6OhF3OIO.js";import{o as v,t as y}from"./control-ui-core-CXeSrnoQ.js";import{Q as le,tt as ue}from"./control-ui-core-vPyynwls.js";import{t as de}from"./web-awesome-tabs-CEtFMiPt.js";import{ct as fe,dt as pe,ft as me,lt as he,pt as ge}from"./chat-message-RLWYyOXr.js";function b(e,t,n){return Math.min(n,Math.max(t,Number.isFinite(e)?Math.round(e):t))}function x(e,t){return{name:e.name,w:e.w,h:e.h,order:t}}function S(e){return e.map(e=>({name:e.name,w:b(e.w,1,12),h:b(e.h,1,T),order:Number.isFinite(e.order)?e.order:0})).toSorted((e,t)=>e.order-t.order||e.name.localeCompare(t.name)).map(x)}function _e(e,t,n,r,i){for(let a=n;a<n+i;a+=1)for(let n=t;n<t+r;n+=1)if(e[a]?.[n])return!1;return!0}function ve(e,t){for(let n=t.y;n<t.y+t.h;n+=1){let r=e[n]??Array.from({length:12},()=>!1);e[n]=r;for(let e=t.x;e<t.x+t.w;e+=1)r[e]=!0}}function ye(e,t){for(let n=0;;n+=1)for(let r=0;r<=12-t.w;r+=1)if(_e(e,r,n,t.w,t.h))return{name:t.name,x:r,y:n,w:t.w,h:t.h}}function C(e){let t=[],n=[];for(let r of S(e)){let e=ye(t,r);ve(t,e),n.push(e)}return n}function w(e,t){return t.x>=e.x&&t.x<e.x+e.w&&t.y>=e.y&&t.y<e.y+e.h}function be(e,t,n){let r=S(e),i=r.findIndex(e=>e.name===t);if(i<0)return{items:r,rects:C(r)};let a=C(r),o={x:b(n.x,0,11),y:Math.max(0,Number.isFinite(n.y)?Math.floor(n.y):0)},s=a.find(e=>e.name===t);if(s&&w(s,o))return{items:r,rects:a};let[c]=r.splice(i,1);if(!c)return{items:r,rects:C(r)};let l=a.find(e=>e.name!==t&&w(e,o))??a.filter(e=>e.name!==t&&(e.y>o.y||e.y===o.y&&e.x>=o.x)).toSorted((e,t)=>e.y-t.y||e.x-t.x)[0],u=l?r.findIndex(e=>e.name===l.name):r.length;r.splice(Math.max(0,u),0,c);let d=r.map(x);return{items:d,rects:C(d)}}function xe(e,t,n,r){return S(e).map(e=>e.name===t?{name:e.name,w:b(n,1,12),h:b(r,1,T),order:e.order}:e)}function Se(e,t,n){let r=S(e),i=r.findIndex(e=>e.name===t);if(i<0)return r;let a=n===`left`||n===`up`?-1:1,o=Math.min(r.length-1,Math.max(0,i+a));if(o!==i){let[e]=r.splice(i,1);e&&r.splice(o,0,e)}return r.map(x)}function Ce(e){return`grid-column: ${e.x+1} / span ${e.w}; grid-row: ${e.y+1} / span ${e.h};`}var T,E=e((()=>{T=20})),we=e((()=>{}));function D(e){return v(e===`queued`?`tasksPage.status.queued`:e===`running`?`tasksPage.status.running`:e===`done`?`activity.status.done`:`tasksPage.status.failed`)}function Te(e){return e.status===`running`||e.hasActiveRun===!0?`running`:e.status===`done`?`done`:e.status===`failed`||e.status===`killed`||e.status===`timeout`?`failed`:e.subagentRunState===`active`?`queued`:null}function Ee(e){return e.split(`:`).findLast(Boolean)??e}function De(e){let t=e.swarmPhaseRank;return typeof t==`number`&&Number.isFinite(t)?t:2**53-1}function Oe(e){let t=e.swarmPhase;return typeof t==`string`&&t.trim()?t.trim():void 0}function ke(e){let t=e.swarmLog;return typeof t==`string`&&t.trim()?t.trim():void 0}function Ae(e,t){if(e.parentSessionKey&&_(e.parentSessionKey,t)||e.spawnedBy&&_(e.spawnedBy,t))return!0;let n=e.swarmGroupId?.split(`:`).slice(1,-1).join(`:`);return!!(n&&_(n,t))}function je(e,t){let n=new Map;for(let r of e){let e=r.swarmGroupId?.trim();if(!e||!Ae(r,t))continue;let i=n.get(e)??[],a=Te(r);a&&(i.push({phase:Oe(r),phaseRank:De(r),log:ke(r),dot:{key:r.key,label:r.label?.trim()||r.displayName?.trim()||r.derivedTitle?.trim()||r.key,status:a}}),n.set(e,i))}return[...n.entries()].map(([e,t])=>{let n=t.map(e=>e.dot),r=new Map;for(let e of t){let t=r.get(e.phase)??{rank:e.phaseRank,dots:[]};t.rank=Math.min(t.rank,e.phaseRank),t.dots.push(e.dot),r.set(e.phase,t)}return{groupId:e,label:Ee(e),running:n.filter(e=>e.status===`running`).length,done:n.filter(e=>e.status===`done`).length,failed:n.filter(e=>e.status===`failed`).length,narrator:t.map(e=>e.log).find(Boolean),phases:[...r.entries()].toSorted((e,t)=>e[1].rank-t[1].rank).map(([e,t])=>({title:e,dots:t.dots}))}}).filter(e=>e.phases.some(e=>e.dots.some(e=>e.status===`queued`||e.status===`running`))).toSorted((e,t)=>e.groupId.localeCompare(t.groupId))}function Me({sessions:e,sessionKey:t}){let n=je(e,t);return n.length===0?s`<p class="swarm-widget__empty" data-test-id="swarm-empty">
      ${v(`labsPage.swarm.empty`)}
    </p>`:s`
    <div class="swarm-widget" data-test-id="swarm-widget">
      ${n.map(e=>s`
          <section class="swarm-widget__group" data-swarm-group=${e.groupId}>
            <header class="swarm-widget__group-header">
              <strong title=${e.groupId}>${e.label}</strong>
              <span
                >${e.running} ${D(`running`)} · ${e.done}
                ${D(`done`)} · ${e.failed} ${D(`failed`)}</span
              >
            </header>
            ${e.narrator?s`<div class="swarm-widget__narrator">${e.narrator}</div>`:p}
            ${e.phases.map(e=>s`
                <div class="swarm-widget__phase-row">
                  <div class="swarm-widget__phase">
                    ${e.title??v(`labsPage.swarm.defaultPhase`)}
                  </div>
                  <div class="swarm-widget__dots" role="list">
                    ${e.dots.map(e=>s`
                        <span
                          class=${`swarm-widget__dot swarm-widget__dot--${e.status}`}
                          role="listitem"
                          title=${`${e.label}: ${D(e.status)}`}
                          aria-label=${`${e.label}: ${D(e.status)}`}
                        ></span>
                      `)}
                  </div>
                </div>
              `)}
          </section>
        `)}
    </div>
  `}var Ne=e((()=>{u(),y(),ne()}));function Pe(e){return e?O[e]??null:null}var O,Fe=e((()=>{Ne(),O={swarm:Me}}));function Ie(e){let{appView:t,widget:n}=e,r=n.grantState===`pending`||n.grantState===`rejected`?k:0,i=Math.max(160,e.rectHeight*56+Math.max(0,e.rectHeight-1)*12-38-r),a=t?.status===`ready`&&t.expiresAtMs>Date.now()?t:void 0,o=s`<div class="board-widget__app-loading" data-test-id="board-mcp-app-loading">
    ${v(`board.widget.appLoading`)}
  </div>`,c=!e.nearVisible||!t?o:t.status===`stale`?s`<div class="board-widget__stale" data-test-id="board-mcp-app-stale">
            <strong>${v(`board.widget.appStaleTitle`)}</strong>
            <span>${v(`board.widget.appStaleDetail`)}</span>
            <div class="board-widget__grant-actions">
              <button
                class="btn btn--small btn--primary"
                type="button"
                ?disabled=${e.loading}
                @click=${e.retry}
              >
                ${v(`board.widget.retry`)}
              </button>
              <button
                class="btn btn--small"
                type="button"
                ?disabled=${e.busy}
                @click=${e.remove}
              >
                ${v(`board.widget.remove`)}
              </button>
            </div>
          </div>`:a?s`<mcp-app-view
              class="board-widget__mcp-app-view"
              .sessionKey=${e.sessionKey}
              .viewId=${a.viewId}
              .height=${i}
              .fixedHeight=${!0}
              .title=${n.title||n.name}
              @openclaw-mcp-app-view-expired=${e.expired}
            ></mcp-app-view>`:o;return s`<div class="board-widget__mcp-app">${e.accessNotice}${c}</div>`}var k,Le=e((()=>{u(),y(),E(),k=112}));function A(e,t){return`${e}\0${t.name}\0${t.revision}\0${t.instanceId??``}\0${t.grantState}`}function j(e){e!==void 0&&window.clearTimeout(e)}var M,N,P,Re=e((()=>{M=5e3,N=class{constructor(e,t){this.marginPx=e,this.visibilityChanged=t,this.nearVisible=!1}observe(e){e!==this.target&&(this.disconnect(),this.target=e,this.setNearVisible(this.isNearViewport(e)),!(typeof IntersectionObserver>`u`)&&(this.observer=new IntersectionObserver(e=>{let t=e.at(-1);!t||t.target!==this.target||this.setNearVisible(t.isIntersecting||this.isNearViewport(t.target))},{rootMargin:`${this.marginPx}px 0px`}),this.observer.observe(e)))}disconnect(){this.observer?.disconnect(),this.observer=void 0,this.target=void 0,this.setNearVisible(!1)}setNearVisible(e){e!==this.nearVisible&&(this.nearVisible=e,this.visibilityChanged())}isNearViewport(e){let t=e.getBoundingClientRect();return t.bottom>=-this.marginPx&&t.top<=window.innerHeight+this.marginPx}},P=class{constructor(e){this.host=e,this.loading=!1,this.key=``,this.generation=0,this.visibility=new N(600,()=>this.visibilityChanged())}get nearVisible(){return this.visibility.nearVisible}update(e,t){if(this.callbacks=t,!e||e.contentKind!==`mcp-app`||!t){this.reset();return}let n=A(this.host.sessionKey(),e);n!==this.key&&(this.clearTimers(),this.generation+=1,this.loading=!1,this.key=n,this.state=void 0)}observe(e,t){if(!e||!t){this.visibility.disconnect();return}this.visibility.observe(e)}sync(){let e=this.host.widget(),t=this.callbacks;if(!e||e.contentKind!==`mcp-app`||!t){this.renewalTimer=j(this.renewalTimer);return}if(!this.nearVisible){this.loading||(this.renewalTimer=j(this.renewalTimer));return}!this.state&&!this.loading?this.load(e,t,`cached`):this.state?.status===`ready`&&!this.loading&&this.renewalTimer===void 0&&this.expiryTimer===void 0&&this.scheduleRenewal(e,t,this.state,!1)}disconnect(){this.visibility.disconnect(),this.reset(),this.callbacks=void 0}retry(){let e=this.host.widget();e&&this.callbacks&&this.load(e,this.callbacks,`refresh`)}expire(){let e=this.host.widget(),t=this.callbacks;if(!e||!t)return;let n=this.loading;this.state={status:`stale`,error:`MCP App view expired`},this.loading=!1,this.notify(),n||this.load(e,t,`expired`)}reset(){this.clearTimers(),this.generation+=1,this.key=``,this.state=void 0,this.loading=!1}clearTimers(){this.renewalTimer=j(this.renewalTimer),this.expiryTimer=j(this.expiryTimer)}visibilityChanged(){queueMicrotask(()=>{this.host.connected()&&this.notify()}),!this.nearVisible&&!this.loading&&(this.renewalTimer=j(this.renewalTimer))}async load(e,t,n){if(this.loading||!this.nearVisible)return;let r=A(this.host.sessionKey(),e);if(r!==this.key)return;let i=++this.generation,a=()=>{let e=this.host.widget();return this.host.connected()&&i===this.generation&&this.key===r&&e?.contentKind===`mcp-app`&&A(this.host.sessionKey(),e)===r};this.clearTimers(),this.loading=!0;let o=n===`refresh`&&this.state?.status===`ready`?this.state:null;n===`expired`&&(this.state=void 0),this.notify(),o&&(this.expiryTimer=window.setTimeout(()=>{this.expiryTimer=void 0,a()&&(this.state={status:`stale`,error:`MCP App lease expired while renewing`},this.loading=!1,this.notify())},Math.max(0,o.expiresAtMs-Date.now())));try{let r=await(n===`cached`?t.widgetAppView(e.name,e.revision):t.refreshWidgetAppView(e.name,e.revision));if(!a())return;if(r.status===`stale`&&o&&o.expiresAtMs>Date.now()){this.loading=!1,this.notify();return}this.clearTimers(),this.state=r,this.loading=!1,this.scheduleRenewal(e,t,r,n!==`cached`),this.notify()}catch(e){if(!a())return;if(o&&o.expiresAtMs>Date.now()){this.loading=!1,this.notify();return}this.clearTimers(),this.state={status:`stale`,error:e instanceof Error?e.message:String(e)},this.loading=!1,this.notify()}}scheduleExpiry(e,t){if(t.status!==`ready`)return;this.expiryTimer=j(this.expiryTimer);let n=this.key;this.expiryTimer=window.setTimeout(()=>{this.expiryTimer=void 0;let r=this.host.widget(),i=this.state;this.host.connected()&&this.key===n&&r?.name===e.name&&r.revision===e.revision&&i?.status===`ready`&&i.viewId===t.viewId&&i.expiresAtMs===t.expiresAtMs&&(this.state={status:`stale`,error:`MCP App lease expired`},this.notify())},Math.max(0,t.expiresAtMs-Date.now()))}scheduleRenewal(e,t,n,r){if(this.renewalTimer=j(this.renewalTimer),n.status!==`ready`)return;let i=this.key,a=n.expiresAtMs-Date.now()-M;if(!this.nearVisible){r&&a<=0&&this.scheduleExpiry(e,n);return}if(a<=0){r?this.scheduleExpiry(e,n):this.load(e,t,`refresh`);return}this.renewalTimer=window.setTimeout(()=>{this.renewalTimer=void 0;let n=this.host.widget();this.host.connected()&&this.nearVisible&&this.key===i&&n?.name===e.name&&n.revision===e.revision&&this.load(n,t,`refresh`)},a)}notify(){this.host.requestUpdate()}}}));function ze(e){let{widget:t}=e,n=t.declared?.netOrigins??[],r=t.declared?.tools??[];return s`
    <div class="board-widget__grant board-widget__grant--pending" data-test-id="board-pending">
      <div class="board-widget__grant-mark" aria-hidden="true">!</div>
      <strong>${v(`board.widget.needsApproval`)}</strong>
      ${n.length>0||r.length>0?s`<div class="board-widget__grant-groups">
            ${n.length>0?s`<section>
                  <strong>${v(`board.widget.networkAccess`)}</strong>
                  <ul class="board-widget__grant-summary">
                    ${n.map(e=>s`<li>${e}</li>`)}
                  </ul>
                </section>`:p}
            ${r.length>0?s`<section>
                  <strong>${v(`board.widget.hostTools`)}</strong>
                  <ul class="board-widget__grant-summary">
                    ${r.map(e=>s`<li>${e}</li>`)}
                  </ul>
                </section>`:p}
          </div>`:t.declaredSummary?.length?s`<ul class="board-widget__grant-summary">
              ${t.declaredSummary.map(e=>s`<li>${e}</li>`)}
            </ul>`:s`<span>${v(`board.widget.needsApprovalDetail`)}</span>`}
      <div class="board-widget__grant-actions">
        <button
          class="btn btn--small btn--primary"
          type="button"
          data-test-id="board-grant-allow"
          ?disabled=${e.disabled}
          @click=${()=>e.onGrant(`granted`)}
        >
          ${v(`board.widget.allow`)}
        </button>
        <button
          class="btn btn--small"
          type="button"
          data-test-id="board-grant-reject"
          ?disabled=${e.disabled}
          @click=${()=>e.onGrant(`rejected`)}
        >
          ${v(`board.widget.reject`)}
        </button>
      </div>
      ${e.error??p}
    </div>
  `}function Be(e){if(e.grantState!==`granted`||!e.declared)return p;let t=[...(e.declared.netOrigins??[]).map(e=>v(`board.widget.networkCapability`,{capability:e})),...(e.declared.tools??[]).map(e=>v(`board.widget.toolCapability`,{capability:e}))];return t.length===0?p:s`
    <openclaw-tooltip
      .content=${`${v(`board.widget.activeCapabilities`)}\n${t.join(`
`)}`}
    >
      <span class="board-widget__capabilities" data-test-id="board-capabilities-granted">
        ${v(`board.widget.granted`)}
      </span>
    </openclaw-tooltip>
  `}var F=e((()=>{u(),y()}));function Ve(e){let t=e.querySelector(`.board-widget__menu`);t&&(t.open=!1)}function He(e){let{widget:t,tabs:n,disabled:r,onSelect:i}=e,a=n.filter(e=>e.tabId!==t.tabId);return s`
    <wa-dropdown class="board-widget__menu" placement="bottom-end" @wa-select=${i}>
      <button
        class="board-widget__menu-trigger"
        slot="trigger"
        type="button"
        aria-label=${v(`board.widget.menuLabel`)}
        title=${v(`board.widget.menuLabel`)}
      >
        ⋮
      </button>
      <div class="board-widget__menu-heading">${v(`board.widget.moveToTab`)}</div>
      ${a.length>0?a.map(e=>s`
              <wa-dropdown-item value=${`move:${e.tabId}`} ?disabled=${r}>
                ${e.title}
              </wa-dropdown-item>
            `):s`<span class="board-widget__menu-empty">${v(`board.widget.noOtherTabs`)}</span>`}
      <div class="board-widget__menu-heading">${v(`board.widget.resize`)}</div>
      ${Object.entries(B).map(([e,t])=>s`
          <wa-dropdown-item
            class="board-widget__preset"
            value=${`resize:${e}`}
            ?disabled=${r}
          >
            ${e.toUpperCase()}
            <span slot="details">${t.w}×${t.h}</span>
          </wa-dropdown-item>
        `)}
      <div class="board-widget__menu-separator" role="separator"></div>
      <wa-dropdown-item class="board-widget__menu-danger" value="remove" ?disabled=${r}>
        ${v(`board.widget.remove`)}
      </wa-dropdown-item>
    </wa-dropdown>
  `}function I(e){return ze(e)}function L(e){return s`
    <div class="board-widget__grant board-widget__grant--rejected" data-test-id="board-rejected">
      <strong>${v(`board.widget.rejected`)}</strong>
      <span>${v(`board.widget.rejectedDetail`)}</span>
      <button
        class="btn btn--small"
        type="button"
        ?disabled=${e.disabled}
        @click=${e.onRemove}
      >
        ${v(`board.widget.remove`)}
      </button>
    </div>
  `}function R(e){let t=e instanceof Error?e.message:String(e);return s`
    <div class="board-widget__error" role="alert" data-test-id="board-widget-error">
      <strong>${v(`board.widget.errorTitle`)}</strong>
      <span>${v(`board.widget.errorDetail`)}</span>
      <details>
        <summary>${v(`board.widget.errorShow`)}</summary>
        <code>${t}</code>
      </details>
    </div>
  `}function z(e,t=!1){return s`
    <div
      class=${`board-widget__error ${t?`board-widget__error--inline`:``}`}
      role="alert"
      data-test-id="board-widget-action-error"
    >
      <strong>${v(`board.widget.actionErrorTitle`)}</strong>
      <span>${v(`board.widget.actionErrorDetail`)}</span>
      <details>
        <summary>${v(`board.widget.errorShow`)}</summary>
        <code>${e}</code>
      </details>
    </div>
  `}var B,Ue=e((()=>{u(),y(),F(),B={sm:{w:3,h:3},md:{w:6,h:4},lg:{w:8,h:6},xl:{w:12,h:8}}}));function We(e){if(!e||typeof e!=`object`)return!1;let t=e;return t.type===`openclaw:widget-bridge-request`&&typeof t.id==`string`&&t.id.length>0&&t.id.length<=128&&typeof t.method==`string`&&typeof t.ticket==`string`}function Ge(e){if(!e||typeof e!=`object`||Array.isArray(e))throw Error(`widget host request params are invalid`);return e}function V(e,t){let n=e[t];if(typeof n!=`string`||n.length===0)throw Error(`widget host request ${t} is required`);return n}var H,U,W,G,Ke,qe=e((()=>{he(),H=8*1024,U=5e3,W=6e4,G=12,Ke=class{constructor(e){this.recentStatePayloads=new Map,this.pendingStates=new Map,this.stateAttemptTimes=[],this.frame=e.frame,this.ticket=e.ticket,this.client=e.client,this.rateKey=e.rateKey,this.confirmPrompt=e.confirmPrompt,this.dispatchPrompt=e.dispatchPrompt??fe,this.now=e.now??Date.now}updateIdentity(e,t){this.frame=e,this.ticket=t}async emitState(e){let t=JSON.stringify(e);if(t===void 0)throw Error(`widget state payload must be JSON`);if(new TextEncoder().encode(t).byteLength>H)throw Error(`widget state payload exceeds ${H} UTF-8 bytes`);let n=this.now();for(let[e,t]of this.recentStatePayloads)n-t>=U&&this.recentStatePayloads.delete(e);if(this.recentStatePayloads.has(t))return{ok:!0,appended:!1,coalesced:!0};let r=this.pendingStates.get(t);if(r)return await r;if(this.stateAttemptTimes=this.stateAttemptTimes.filter(e=>n-e<W),this.stateAttemptTimes.length>=G)throw Error(`widget state emission rate limit exceeded`);this.stateAttemptTimes.push(n);let i=this.client.request(`board.event`,{ticket:this.ticket,payload:e});this.pendingStates.set(t,i);try{let e=await i;return this.recentStatePayloads.set(t,this.now()),e}finally{this.pendingStates.get(t)===i&&this.pendingStates.delete(t)}}async handle(e,t={}){if(e.ticket!==this.ticket)throw Error(`widget view ticket does not match the active frame`);let n=Ge(e.params);switch(e.method){case`prompt.send`:{if(t.promptUserActivated!==!0)throw Error(`widget prompt requires active user interaction`);let e=V(n,`text`),r=await this.client.request(`board.prompt.authorize`,{ticket:this.ticket});if(t.isCurrent?.()===!1)throw Error(`widget prompt request is no longer current`);if(!this.dispatchPrompt(this.frame,e,this.rateKey,r.confirmationRequired===!1?void 0:this.confirmPrompt))throw Error(`widget prompt was not accepted`);return{ok:!0}}case`state.emit`:return await this.emitState(n.payload);case`data.read`:{let e=V(n,`bindingId`),t=n.params;if(t!==void 0&&(!t||typeof t!=`object`||Array.isArray(t)))throw Error(`widget data binding params are invalid`);return await this.client.request(`board.data.read`,{ticket:this.ticket,bindingId:e,...t?{params:t}:{}})}case`cron.trigger`:return await this.client.request(`board.action`,{ticket:this.ticket,action:`cron.trigger`,jobId:V(n,`jobId`)});default:throw Error(`widget host method is not supported: ${e.method}`)}}}})),Je,K,Ye=e((()=>{qe(),Je=1e4,K=class{constructor(e){this.bridgeController=null,this.bridgePort=null,this.adoptedTicket=``,this.offeredTicket=``,this.ready=!1,this.readyTimer=null,this.loadedDocumentKey=``,this.loadGeneration=0,this.requestGeneration=0,this.pendingRequests=new Map,this.options=e,this.scheduleReadyTimeout()}get frame(){return this.options.frame}update(e){let t=this.options.client,n=this.documentKey(),r=this.options.sandboxUrl;this.options=e;let i=n!==this.documentKey(),a=r!==e.sandboxUrl;(i||a)&&(this.reset(),this.bridgeController=null,this.bridgeClient=void 0),a&&(this.ready=!1,this.scheduleReadyTimeout()),t!==e.client&&(this.cancelPendingRequests(`Gateway connection changed`),this.requestGeneration+=1,this.bridgeController=null,this.bridgeClient=void 0),e.widget.viewTicket&&!i&&(this.adoptedTicket&&this.bridgeController?.updateIdentity(e.frame,this.adoptedTicket),this.postHostInit()),this.ready&&this.documentKey()!==this.loadedDocumentKey&&this.loadDocument()}reset(){this.loadGeneration+=1,this.requestGeneration+=1,this.pendingRequests.clear(),this.loadedDocumentKey=``,this.bridgePort?.close(),this.bridgePort=null,this.adoptedTicket=``,this.offeredTicket=``}dispose(){this.clearReadyTimeout(),this.reset(),this.ready=!1,this.bridgeController=null,this.bridgeClient=void 0}accepts(e){return e.source===this.options.frame.contentWindow&&e.origin===this.options.sandboxOrigin}handleFrameError(){this.ready||!this.options.frame.isConnected||(this.clearReadyTimeout(),this.retrySandboxFrame())}handleMessage(e){if(this.accepts(e)){if(e.data?.method===`ui/notifications/sandbox-proxy-ready`&&e.data?.params?.sandboxUrl===this.options.sandboxUrl){this.ready=!0,this.clearReadyTimeout(),this.loadDocument();return}if(this.ready){if(e.data?.type===`openclaw:widget-bridge-port-offer`){let t=e.ports[0];if(!t||this.bridgePort){t?.close();return}this.bridgePort=t,t.addEventListener(`message`,e=>{this.handleBridgeMessage(e.data)}),t.start(),this.postHostInit();return}e.data?.type===`openclaw:widget-bridge-ready`&&this.postHostInit()}}}handleBridgeMessage(e){if(e&&typeof e==`object`&&Reflect.get(e,`type`)===`openclaw:widget-host-init-ack`&&typeof Reflect.get(e,`ticket`)==`string`){let t=Reflect.get(e,`ticket`);if(t!==this.offeredTicket)return;this.offeredTicket=``,this.adoptedTicket=t,this.bridgeController?.updateIdentity(this.options.frame,t),this.postHostInit();return}this.handleBridgeRequest(e)}handleBridgeRequest(e){if(!this.ready||!We(e))return;let t=this.options.client,n=this.adoptedTicket;if(!t||!n){this.postResponse(e.id,!1,void 0,`Gateway unavailable`);return}!this.bridgeController||this.bridgeClient!==t?(this.bridgeClient=t,this.bridgeController=new Ke({frame:this.options.frame,ticket:n,client:t,rateKey:this.documentKey(),confirmPrompt:this.options.confirmPrompt})):this.bridgeController.updateIdentity(this.options.frame,n);let r=this.requestGeneration,i=this.options.frame;this.pendingRequests.set(e.id,r),this.bridgeController.handle(e,{promptUserActivated:e.method===`prompt.send`,isCurrent:()=>r===this.requestGeneration&&i===this.options.frame}).then(t=>{this.completeRequest(e.id,r,!0,t)}).catch(t=>{this.completeRequest(e.id,r,!1,void 0,t instanceof Error?t.message:String(t))})}completeRequest(e,t,n,r,i){t!==this.requestGeneration||this.pendingRequests.get(e)!==t||(this.pendingRequests.delete(e),this.postResponse(e,n,r,i))}cancelPendingRequests(e){for(let[t,n]of this.pendingRequests)n===this.requestGeneration&&this.postResponse(t,!1,void 0,e);this.pendingRequests.clear()}clearReadyTimeout(){this.readyTimer!==null&&(window.clearTimeout(this.readyTimer),this.readyTimer=null)}scheduleReadyTimeout(){this.ready||this.readyTimer!==null||(this.readyTimer=window.setTimeout(()=>{this.readyTimer=null,!(this.ready||!this.options.frame.isConnected)&&this.retrySandboxFrame()},Je))}retrySandboxFrame(){let{frame:e,sandboxUrl:t}=this.options;e.isConnected&&(this.ready=!1,this.reset(),e.src=t,this.options.onReadyTimeout(),this.scheduleReadyTimeout())}documentKey(){let e=this.options.resolveFrameUrl(this.options.widget.name,this.options.widget.revision).split(/[?#]/u,1)[0],t=this.options.widget.viewGeneration??this.options.widget.viewTicket??``;return`${e}\0${this.options.widget.revision}\0${t}`}postHostInit(){let e=this.options.widget.viewTicket;!this.ready||!this.bridgePort||!e||this.loadedDocumentKey!==this.documentKey()||e===this.adoptedTicket||this.offeredTicket!==``||(this.offeredTicket=e,this.bridgePort.postMessage({type:`openclaw:widget-host-init`,ticket:e},[]))}async loadDocument(){let{frame:e,widget:t,resolveFrameUrl:n}=this.options;if(!e.contentWindow)return;let r=n(t.name,t.revision),i;try{i=new URL(r,this.options.sourceOrigin)}catch(e){this.options.onError(e);return}if(i.origin!==this.options.sourceOrigin){this.options.onError(Error(`widget content URL is outside the active Gateway`));return}let a=i.href;this.options.onFrameUrl(a);let o=++this.loadGeneration;try{let n=await fetch(a,{cache:`no-store`});if(o!==this.loadGeneration||!e.isConnected)return;if(n.status===401){this.options.onUnauthorized(t);return}if(!n.ok)throw Error(`widget content request failed (${n.status})`);let r=await n.text();if(o!==this.loadGeneration||!e.isConnected)return;e.contentWindow?.postMessage({jsonrpc:`2.0`,method:`ui/notifications/sandbox-resource-ready`,params:{html:r}},this.options.sandboxOrigin),this.loadedDocumentKey=this.documentKey(),this.options.onLoaded(),this.postHostInit()}catch{o===this.loadGeneration&&this.options.onLoadFailed(t)}}postResponse(e,t,n,r){this.bridgePort?.postMessage({type:`openclaw:widget-bridge-response`,id:e,ok:t,...t?{result:n}:{error:r??`widget host request failed`}})}}}));function Xe(e){return e===`localhost`||e===`127.0.0.1`||e===`[::1]`}function Ze(e,t){if(!e.sandboxOrigin&&t)try{if(!Xe(new URL(t).hostname))return v(`board.widget.sandboxOriginRequired`)}catch{}return v(`board.widget.frameAuthorizationFailed`)}var q,Qe,$e,J,et,tt,nt,rt=e((()=>{u(),y(),Ye(),ie(),pe(),q=3,Qe=15e3,$e=1e3,J=1e3,et=3e4,tt=class{constructor(e){this.currentTicket=e,this.timer=null,this.attempts=0,this.scheduledTicket=``}clear(){this.timer!==null&&(window.clearTimeout(this.timer),this.timer=null)}schedule(e,t){let n=e?.viewTicket,r=e?re(e):void 0;if(!e||!t||!n||r===void 0){this.clear(),this.attempts=0,this.scheduledTicket=``;return}if(this.scheduledTicket===n)return;this.clear(),this.attempts=0,this.scheduledTicket=n;let i=Math.max($e,r-Qe);this.timer=window.setTimeout(()=>{this.timer=null,this.refresh(e.name,n,t)},i)}refresh(e,t,n){if(this.currentTicket()!==t||this.scheduledTicket!==t)return;this.attempts+=1;let r=()=>{this.currentTicket()!==t||this.scheduledTicket!==t||(this.clear(),this.timer=window.setTimeout(()=>{this.timer=null,this.refresh(e,t,n)},Math.min(J*this.attempts,et)))};n(e).then(r,r)}},nt=class{constructor(e){this.host=e,this.error=``,this.frameFailureKey=``,this.frameRefreshAttempts=0,this.frameProbeGeneration=0,this.lastFrameUrl=``,this.listening=!1,this.sandboxOrigin=``,this.sandboxHost=null,this.ticketRefresh=new tt(()=>this.host.widget()?.viewTicket),this.handleSandboxMessage=e=>{if(!this.host.connected())return;let t=this.host.root().querySelector(`.board-widget__frame`),n=this.host.widget();if(!t||!n?.viewTicket||e.source!==t.contentWindow||e.origin!==this.sandboxOrigin)return;let r=this.sandboxHostOptions(t,n);r&&(!this.sandboxHost||this.sandboxHost.frame!==t?(this.sandboxHost?.dispose(),this.sandboxHost=new K(r)):this.sandboxHost.update(r),this.sandboxHost.handleMessage(e))}}connect(){this.listening||=(window.addEventListener(`message`,this.handleSandboxMessage),!0)}disconnect(){this.listening&&=(window.removeEventListener(`message`,this.handleSandboxMessage),!1),this.ticketRefresh.clear(),this.sandboxHost?.dispose(),this.sandboxHost=null}widgetChanged(e,t){if(e.name!==t?.name||e.revision!==t?.revision){this.resetFailures(!1);return}if(!t||!this.error)return;let n=this.host.resolveFrameUrl()?.(t.name,t.revision)??``;n&&n!==this.lastFrameUrl&&this.setError(``,!1)}update(){this.ticketRefresh.schedule(this.host.widget(),this.host.refreshFrame()),this.updateSandboxHost()}render(e){let t=this.host.resolveFrameUrl();if(!t)throw Error(v(`board.widget.frameResolverMissing`));let n=t(e.name,e.revision);this.lastFrameUrl=n;let r=this.resolveSandboxFrameUrl(e);if(r)return s`
        <iframe
          class="board-widget__frame"
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerpolicy="origin"
          loading="eager"
          title=${e.title||e.name}
          src=${r}
          @error=${()=>{this.sandboxHost?this.sandboxHost.handleFrameError():this.refreshFailedFrame(e)}}
        ></iframe>
      `;if(e.sandboxUrl||e.sandboxPort||e.viewTicket)throw Error(v(`board.widget.sandboxUnavailable`));return s`
      <iframe
        class="board-widget__frame"
        sandbox="allow-scripts"
        referrerpolicy="no-referrer"
        loading="lazy"
        title=${e.title||e.name}
        src=${n}
        @error=${()=>this.refreshFailedFrame(e)}
        @load=${t=>this.verifyAuthorization(t,e)}
      ></iframe>
    `}setError(e,t=!0){this.error!==e&&(this.error=e,t&&this.host.requestUpdate())}resetFailures(e=!0){this.frameProbeGeneration+=1,this.frameFailureKey=``,this.frameRefreshAttempts=0,this.setError(``,e),this.sandboxHost?.reset()}refreshFailedFrame(e){this.frameProbeGeneration+=1;let t=`${e.name}:${e.revision}`;if(this.frameFailureKey!==t&&(this.resetFailures(!1),this.frameFailureKey=t),this.frameRefreshAttempts>=q){this.setError(Ze(e,this.sandboxOrigin));return}let n=this.host.refreshFrame();if(!n){this.setError(v(`board.widget.frameResolverMissing`));return}this.frameRefreshAttempts+=1,n(e.name).catch(e=>{this.setError(e instanceof Error?e.message:String(e))}),this.frameRefreshAttempts>=q&&this.setError(Ze(e,this.sandboxOrigin))}verifyAuthorization(e,t){let n=e.currentTarget,r=n instanceof HTMLIFrameElement?n.getAttribute(`src`)??``:``;if(!r.startsWith(`/__openclaw__/board/`))return;let i=this.frameProbeGeneration+1;this.frameProbeGeneration=i;let a=()=>n instanceof HTMLIFrameElement&&n.isConnected&&n.getAttribute(`src`)===r&&this.frameProbeGeneration===i&&this.host.widget()?.name===t.name&&this.host.widget()?.revision===t.revision;fetch(r,{cache:`no-store`}).then(e=>{a()&&(e.status===401?this.refreshFailedFrame(t):e.ok&&this.resetFailures())}).catch(()=>{a()&&this.refreshFailedFrame(t)})}resolveSandboxFrameUrl(e){let t=this.host.context()?.gateway.connection.gatewayUrl;if(!e.sandboxUrl||!e.sandboxPort||!e.viewTicket||t===void 0)return;let n=ge(e.sandboxUrl,e.sandboxPort,e.sandboxOrigin,t,window.location.origin);return this.sandboxOrigin=new URL(n).origin,n}sandboxHostOptions(e,t){let n=this.host.resolveFrameUrl();if(n)return{frame:e,widget:t,sandboxOrigin:this.sandboxOrigin,sandboxUrl:e.src,sourceOrigin:me(this.host.context()?.gateway.connection.gatewayUrl??``,window.location.origin),client:this.host.context()?.gateway.snapshot.client??void 0,resolveFrameUrl:n,confirmPrompt:e=>window.confirm(`${v(`common.confirm`)}:\n\n${e}`),onFrameUrl:e=>{this.lastFrameUrl=e},onLoadFailed:e=>this.refreshFailedFrame(e),onUnauthorized:e=>this.refreshFailedFrame(e),onReadyTimeout:()=>this.refreshFailedFrame(t),onLoaded:()=>{this.frameFailureKey=``,this.frameRefreshAttempts=0,this.setError(``)},onError:e=>{this.setError(e instanceof Error?e.message:String(e))}}}updateSandboxHost(){let e=this.host.root().querySelector(`.board-widget__frame`),t=this.host.widget();if(!e?.isConnected||!t||!t.sandboxUrl||!t.sandboxPort||!t.viewTicket){this.sandboxHost?.dispose(),this.sandboxHost=null;return}let n=this.sandboxHostOptions(e,t);n&&(!this.sandboxHost||this.sandboxHost.frame!==e?(this.sandboxHost?.dispose(),this.sandboxHost=new K(n)):this.sandboxHost.update(n))}}})),it,Y,at=e((()=>{a(),u(),m(),ae(),ce(),y(),E(),Fe(),g(),Le(),Re(),F(),Ue(),rt(),le(),ue(),i(),t(),it=()=>r(()=>import(`./mcp-app-view-registration-685oGWVu.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]),import.meta.url),Y=class extends h{constructor(...e){super(...e),this.tabs=[],this.sessionKey=``,this.sessions=[],this.dragging=!1,this.focusTabIndex=-1,this.positionInSet=1,this.setSize=1,this.busy=!1,this.canMutate=!0,this.canGrant=!0,this.actionError=``,this.actionPending=!1,this.appView=new P({connected:()=>this.isConnected,requestUpdate:()=>this.requestUpdate(),sessionKey:()=>this.sessionKey,widget:()=>this.widget}),this.frame=new nt({connected:()=>this.isConnected,context:()=>this.context,refreshFrame:()=>this.callbacks?.frameLoadFailed,requestUpdate:()=>this.requestUpdate(),resolveFrameUrl:()=>this.widgetFrameUrl,root:()=>this,widget:()=>this.widget})}connectedCallback(){super.connectedCallback(),this.frame.connect(),this.requestUpdate()}willUpdate(e){let t=e.get(`widget`);t&&t!==this.widget&&(this.actionError=``,this.frame.widgetChanged(t,this.widget)),this.appView.update(this.widget,this.callbacks)}updated(){if(!this.isConnected){this.appView.observe(null,!1);return}this.appView.observe(this.querySelector(`.board-widget`),this.widget?.contentKind===`mcp-app`),queueMicrotask(()=>{this.isConnected&&this.appView.sync()}),this.frame.update()}disconnectedCallback(){this.frame.disconnect(),this.appView.disconnect(),super.disconnectedCallback()}async runAction(e){if(!(this.actionPending||this.busy)){this.actionPending=!0,this.actionError=``,Ve(this);try{await e()}catch(e){this.actionError=e instanceof Error?e.message:String(e)}finally{this.actionPending=!1}}}handleMenuSelect(e,t,n){if(!this.canMutate)return;let r=e.detail.item.value;if(r===`remove`){this.runAction(()=>n.remove(t));return}if(r?.startsWith(`move:`)){this.runAction(()=>n.moveToTab(t,r.slice(5)));return}if(r?.startsWith(`resize:`)){let e=B[r.slice(7)];e&&this.runAction(()=>n.resizeTo(t,e.w,e.h))}}renderMcpApp(e,t){return oe(`mcp-app-view`,it).catch(()=>void 0),Ie({accessNotice:e.grantState===`pending`?I({widget:e,disabled:this.busy||this.actionPending||!this.canGrant,onGrant:n=>void this.runAction(()=>t.grant(e.name,n)),...this.actionError?{error:z(this.actionError,!0)}:{}}):e.grantState===`rejected`?L({widget:e,disabled:this.busy||this.actionPending||!this.canMutate,onRemove:()=>void this.runAction(()=>t.remove(e))}):p,appView:this.appView.state,busy:this.busy||this.actionPending||!this.canMutate,loading:this.appView.loading,nearVisible:this.appView.nearVisible,rectHeight:this.rect?.h??4,sessionKey:this.sessionKey,widget:e,expired:()=>this.appView.expire(),remove:()=>void this.runAction(()=>t.remove(e)),retry:()=>this.appView.retry()})}renderBody(e,t){if(e.contentKind===`mcp-app`)return this.renderMcpApp(e,t);if(e.grantState===`pending`)return I({widget:e,disabled:this.busy||this.actionPending||!this.canGrant,onGrant:n=>void this.runAction(()=>t.grant(e.name,n)),...this.actionError?{error:z(this.actionError,!0)}:{}});if(e.grantState===`rejected`)return L({widget:e,disabled:this.busy||this.actionPending||!this.canMutate,onRemove:()=>void this.runAction(()=>t.remove(e))});if(e.contentKind===`builtin`){let t=Pe(e.builtin);if(!t)throw Error(v(`board.widget.frameResolverMissing`));return t({sessions:this.sessions,sessionKey:this.sessionKey})}return this.frame.render(e)}handleKeyDown(e,t,n){if(e.target!==e.currentTarget||t.readOnly||!this.canMutate)return;let r=e.key===`ArrowLeft`?`left`:e.key===`ArrowRight`?`right`:e.key===`ArrowUp`?`up`:e.key===`ArrowDown`?`down`:null;r&&(e.preventDefault(),e.altKey?this.runAction(()=>n.nudge(t,r)):n.focus(t,r))}render(){let e=this.widget,t=this.rect,n=this.callbacks;if(!e||!t||!n)return p;let r,i;try{r=this.frame.error?R(this.frame.error):this.renderBody(e,n),i=!!this.frame.error}catch(e){r=R(e),i=!0}let a=e.title||e.name,o=e.readOnly===!0||!this.canMutate,c=i||this.actionError!==``||e.grantState===`pending`||e.grantState===`rejected`||e.contentKind===`mcp-app`;return s`
      <section
        class=${`board-widget ${this.dragging?`board-widget--dragging`:``}`}
        style=${Ce(t)}
        role="listitem"
        tabindex=${this.focusTabIndex}
        aria-posinset=${this.positionInSet}
        aria-setsize=${this.setSize}
        aria-label=${o?a:v(`board.widget.cellLabel`,{title:a})}
        data-widget-name=${e.name}
        data-test-id="board-widget"
        @focus=${()=>n.focusChanged(e.name)}
        @keydown=${t=>this.handleKeyDown(t,e,n)}
      >
        <header class="board-widget__bar">
          ${o?p:s`<span
                class="board-widget__drag-handle"
                aria-hidden="true"
                title=${v(`board.widget.moveHandle`,{title:a})}
                @pointerdown=${t=>n.movePointerDown(e,t)}
              >
                <span aria-hidden="true">⠿</span>
              </span>`}
          <span class="board-widget__title" title=${a}>${a}</span>
          ${e.contentKind===`builtin`?p:s`<span class="board-widget__kind"
                >${e.contentKind===`mcp-app`?v(`board.widget.kindMcp`):v(`board.widget.kindHtml`)}</span
              >`}
          ${e.contentKind===`builtin`?p:Be(e)}
          ${o?p:He({widget:e,tabs:this.tabs,disabled:this.busy||this.actionPending,onSelect:t=>this.handleMenuSelect(t,e,n)})}
        </header>
        <div
          class=${`board-widget__body ${c?`board-widget__body--scrollable`:``}`}
        >
          ${r}
          ${this.actionError&&e.grantState!==`pending`?s`<div class="board-widget__error-overlay">
                ${z(this.actionError)}
              </div>`:p}
        </div>
        ${o?p:s`<span
              class="board-widget__resize-handle"
              aria-hidden="true"
              title=${v(`board.widget.resizeHandle`,{title:a})}
              @pointerdown=${t=>n.resizePointerDown(e,t)}
            ></span>`}
      </section>
    `}},n([o({context:se,subscribe:!0})],Y.prototype,`context`,void 0),n([l({attribute:!1})],Y.prototype,`widget`,void 0),n([l({attribute:!1})],Y.prototype,`rect`,void 0),n([l({attribute:!1})],Y.prototype,`tabs`,void 0),n([l({attribute:!1})],Y.prototype,`sessionKey`,void 0),n([l({attribute:!1})],Y.prototype,`widgetFrameUrl`,void 0),n([l({attribute:!1})],Y.prototype,`callbacks`,void 0),n([l({attribute:!1})],Y.prototype,`sessions`,void 0),n([l({type:Boolean})],Y.prototype,`dragging`,void 0),n([l({type:Number})],Y.prototype,`focusTabIndex`,void 0),n([l({type:Number})],Y.prototype,`positionInSet`,void 0),n([l({type:Number})],Y.prototype,`setSize`,void 0),n([l({type:Boolean})],Y.prototype,`busy`,void 0),n([l({type:Boolean})],Y.prototype,`canMutate`,void 0),n([l({type:Boolean})],Y.prototype,`canGrant`,void 0),n([f()],Y.prototype,`actionError`,void 0),n([f()],Y.prototype,`actionPending`,void 0),customElements.get(`openclaw-board-widget-cell`)||customElements.define(`openclaw-board-widget-cell`,Y)}));function X(e){return e.tabs.toSorted((e,t)=>e.position-t.position||e.tabId.localeCompare(t.tabId))}function Z(e,t){return e.widgets.filter(e=>e.tabId===t).toSorted((e,t)=>e.position-t.position||e.name.localeCompare(t.name))}function Q(e){return e.map(e=>({name:e.name,w:e.sizeW,h:e.sizeH,order:e.position}))}var $;e((()=>{u(),m(),d(),te(),y(),E(),g(),we(),de(),ue(),at(),i(),$=class extends h{constructor(...e){super(...e),this.activeTabId=``,this.sessions=[],this.canMutate=!0,this.canGrant=!0,this.previewItems=null,this.gestureName=``,this.hoverTabId=``,this.announcement=``,this.announcementRevision=0,this.actionError=``,this.focusName=``,this.mutationPending=!1,this.gesture=null,this.mutationRequestId=0,this.stableCellOrder=new Map,this.stableCellOrderSequence=0,this.cellCallbacks={grant:async(e,t)=>{if(!this.callbacks)return;let n=this.snapshot?.sessionKey;await this.callbacks.grant(e,t),n===this.snapshot?.sessionKey&&this.announce(v(t===`granted`?`board.announcement.granted`:`board.announcement.rejected`))},movePointerDown:(e,t)=>this.beginGesture(`move`,e,t),resizePointerDown:(e,t)=>this.beginGesture(`resize`,e,t),moveToTab:async(e,t)=>{await this.applyOps([{kind:`widget_move`,name:e.name,tabId:t,position:this.nextPosition(t)}],v(`board.announcement.moved`,{title:e.title||e.name}))},resizeTo:async(e,t,n)=>{await this.applyOps([{kind:`widget_resize`,name:e.name,sizeW:t,sizeH:n}],v(`board.announcement.resized`,{title:e.title||e.name}))},remove:async e=>{await this.applyOps([{kind:`widget_remove`,name:e.name}],v(`board.announcement.removed`,{title:e.title||e.name}))},nudge:async(e,t)=>this.nudgeWidget(e,t),focus:(e,t)=>this.focusWidget(e,t),focusChanged:e=>{this.focusName=e},frameLoadFailed:async e=>{await this.callbacks?.frameLoadFailed?.(e)},widgetAppView:async(e,t)=>await this.callbacks?.widgetAppView?.(e,t)??{status:`stale`,error:`MCP App view unavailable`},refreshWidgetAppView:async(e,t)=>await this.callbacks?.refreshWidgetAppView?.(e,t)??{status:`stale`,error:`MCP App view unavailable`}},this.handlePointerMove=e=>{let t=this.gesture;if(!t||e.pointerId!==t.pointerId)return;if(t.mode===`move`){let n=document.elementFromPoint(e.clientX,e.clientY)?.closest(`[data-board-tab-id]`),r=n?.closest(`openclaw-board-view`)===this?n.dataset.boardTabId??``:``,i=r!==``&&(this.snapshot?.tabs.some(e=>e.tabId===r)??!1),a=this.snapshot?this.activeTab(X(this.snapshot))?.tabId:this.activeTabId;if(this.hoverTabId=i&&r!==a?r:``,n){this.previewItems=t.items,t.dropValid=this.hoverTabId!==``;return}let o=this.querySelector(`.board-grid`),s=document.elementFromPoint(e.clientX,e.clientY);if(!o||s?.closest(`.board-grid`)!==o){this.hoverTabId=``,this.previewItems=t.items,t.dropValid=!1;return}t.dropValid=!0;let c=o.getBoundingClientRect(),l=Math.max(1,(c.width-132)/12),u={x:Math.floor((e.clientX-c.left)/(l+12)),y:Math.floor((e.clientY-c.top)/68)};this.previewItems=be(t.items,t.name,u).items;return}let n=this.querySelector(`.board-grid`)?.getBoundingClientRect(),r=n?Math.max(1,(n.width-132)/12):56,i=Math.round((e.clientX-t.originClientX)/(r+12)),a=Math.round((e.clientY-t.originClientY)/68);this.previewItems=xe(t.items,t.name,t.originW+i,t.originH+a)},this.handlePointerUp=e=>{let t=this.gesture;if(!t||e.pointerId!==t.pointerId)return;this.handlePointerMove(e);let n=this.previewItems,r=this.hoverTabId;this.cancelGesture();let i=this.snapshot?.widgets.find(e=>e.name===t.name);if(!i)return;if(t.mode===`move`){if(!t.dropValid)return;let e=r?this.nextPosition(r):n?.find(e=>e.name===t.name)?.order??i.position;if(!r&&e===i.position)return;this.applyOps([{kind:`widget_move`,name:t.name,...r?{tabId:r}:{},position:e}],v(`board.announcement.moved`,{title:i.title||i.name})).catch(()=>void 0);return}let a=n?.find(e=>e.name===t.name);a&&(a.w!==i.sizeW||a.h!==i.sizeH)&&this.applyOps([{kind:`widget_resize`,name:t.name,sizeW:a.w,sizeH:a.h}],v(`board.announcement.resized`,{title:i.title||i.name})).catch(()=>void 0)},this.handlePointerCancel=e=>{this.gesture&&e.pointerId===this.gesture.pointerId&&this.cancelGesture()},this.handleTabShow=e=>{let t=this.snapshot?X(this.snapshot):[],n=this.activeTab(t)?.tabId??this.activeTabId;e.detail.name!==n&&t.some(t=>t.tabId===e.detail.name)&&this.callbacks?.selectTab(e.detail.name)},this.handleOverflowSelect=e=>{let t=e.detail.item.value;t&&this.snapshot?.tabs.some(e=>e.tabId===t)&&this.callbacks?.selectTab(t)}}willUpdate(e){e.has(`snapshot`)&&(this.actionError=``,e.get(`snapshot`)?.sessionKey!==this.snapshot?.sessionKey&&(this.mutationRequestId+=1,this.mutationPending=!1,this.focusName=``,this.stableCellOrder.clear(),this.stableCellOrderSequence=0)),e.has(`activeTabId`)&&(this.focusName=``),this.gesture&&(e.has(`snapshot`)||e.has(`activeTabId`))&&this.cancelGesture()}disconnectedCallback(){this.cancelGesture(),super.disconnectedCallback()}activeTab(e){return e.find(e=>e.tabId===this.activeTabId)??e[0]}announce(e){this.announcement=e,this.announcementRevision+=1}async applyOps(e,t){if(!this.callbacks)return;if(this.mutationPending)throw Error(v(`board.actionInProgress`));let n=this.snapshot?.sessionKey,r=this.mutationRequestId+1;this.mutationRequestId=r,this.mutationPending=!0,this.actionError=``;try{await this.callbacks.applyOps(e),r===this.mutationRequestId&&n===this.snapshot?.sessionKey&&this.announce(t)}catch(e){throw r===this.mutationRequestId&&n===this.snapshot?.sessionKey&&(this.actionError=v(`board.actionFailed`),this.announce(this.actionError)),e}finally{r===this.mutationRequestId&&(this.mutationPending=!1)}}nextPosition(e){let t=this.snapshot?.widgets.filter(t=>t.tabId===e).map(e=>e.position)??[0];return Math.max(-1,...t)+1}beginGesture(e,t,n){if(!this.canMutate||n.button!==0||this.gesture||this.mutationPending)return;let r=this.snapshot,i=r?X(r):[],a=this.activeTab(i);if(!r||!a)return;n.preventDefault(),n.stopPropagation();try{n.currentTarget?.setPointerCapture?.(n.pointerId)}catch{}let o=Q(Z(r,a.tabId));this.gesture={dropValid:!1,mode:e,name:t.name,originClientX:n.clientX,originClientY:n.clientY,originW:t.sizeW,originH:t.sizeH,pointerId:n.pointerId,items:o},this.previewItems=o,this.gestureName=t.name,window.addEventListener(`pointermove`,this.handlePointerMove),window.addEventListener(`pointerup`,this.handlePointerUp),window.addEventListener(`pointercancel`,this.handlePointerCancel)}cancelGesture(){window.removeEventListener(`pointermove`,this.handlePointerMove),window.removeEventListener(`pointerup`,this.handlePointerUp),window.removeEventListener(`pointercancel`,this.handlePointerCancel),this.gesture=null,this.previewItems=null,this.gestureName=``,this.hoverTabId=``}async nudgeWidget(e,t){let n=this.snapshot;if(!n)return;let r=Se(Q(Z(n,e.tabId)),e.name,t).find(t=>t.name===e.name);!r||r.order===e.position||await this.applyOps([{kind:`widget_move`,name:e.name,position:r.order}],v(`board.announcement.moved`,{title:e.title||e.name}))}focusWidget(e,t){let n=this.snapshot;if(!n)return;let r=Z(n,e.tabId),i=r.findIndex(t=>t.name===e.name);if(i<0)return;let a=r[Math.max(0,Math.min(i+(t===`left`||t===`up`?-1:1),r.length-1))];!a||a.name===e.name||(this.focusName=a.name,this.updateComplete.then(()=>{[...this.querySelectorAll(`openclaw-board-widget-cell`)].find(e=>e.widget?.name===a.name)?.querySelector(`.board-widget`)?.focus()}))}renderTab(e,t){let n=e.tabId===t,r=e.tabId===this.hoverTabId;return s`
      <wa-tab
        class=${`board-tabs__tab ${n?`board-tabs__tab--active`:``} ${r?`board-tabs__tab--drop`:``}`}
        panel=${e.tabId}
        ?active=${n}
        data-board-tab-id=${e.tabId}
      >
        ${e.title}
      </wa-tab>
    `}renderOverflowTab(e){return s`
      <wa-dropdown-item
        class="board-tabs__overflow-item"
        value=${e.tabId}
        data-board-tab-id=${e.tabId}
      >
        ${e.title}
      </wa-dropdown-item>
    `}renderTabs(e,t){if(e.length<=1)return p;let n=e.slice(0,6),r=e.find(e=>e.tabId===t);r&&!n.some(e=>e.tabId===r.tabId)&&(n[n.length-1]=r);let i=new Set(n.map(e=>e.tabId)),a=e.filter(e=>!i.has(e.tabId));return s`
      <nav class="board-tabs" aria-label=${v(`board.tabsLabel`)}>
        <wa-tab-group
          class="board-tabs__track"
          .active=${t}
          activation="manual"
          without-scroll-controls
          @wa-tab-show=${this.handleTabShow}
        >
          ${n.map(e=>this.renderTab(e,t))}
        </wa-tab-group>
        ${a.length>0?s`
              <wa-dropdown
                class="board-tabs__overflow"
                placement="bottom-end"
                @wa-select=${this.handleOverflowSelect}
              >
                <button
                  class="board-tabs__overflow-trigger"
                  slot="trigger"
                  type="button"
                  aria-label=${v(`board.moreTabs`)}
                  title=${v(`board.moreTabs`)}
                >
                  •••
                </button>
                ${a.map(e=>this.renderOverflowTab(e))}
              </wa-dropdown>
            `:p}
      </nav>
    `}renderGrid(e,t,n){if(e.length===0)return s`
        <div class="board-empty" data-test-id="board-empty">
          <span class="board-empty__mark" aria-hidden="true">＋</span>
          <strong>${v(`board.emptyTitle`)}</strong>
          <span>${v(`board.emptyHint`)}</span>
        </div>
      `;let r=C(this.previewItems??Q(e));for(let e of r)this.stableCellOrder.has(e.name)||(this.stableCellOrder.set(e.name,this.stableCellOrderSequence),this.stableCellOrderSequence+=1);let i=r.toSorted((e,t)=>(this.stableCellOrder.get(e.name)??0)-(this.stableCellOrder.get(t.name)??0)||e.name.localeCompare(t.name)),a=new Map(r.map((e,t)=>[e.name,t])),o=r.some(e=>e.name===this.focusName)?this.focusName:r[0]?.name??``,c=new Map(e.map(e=>[e.name,e]));return s`
      <div class="board-grid" role="list" aria-label=${v(`board.gridLabel`)}>
        ${ee(i,e=>`${n}\u0000${e.name}`,e=>{let i=c.get(e.name);return i?s`
              <openclaw-board-widget-cell
                .widget=${i}
                .rect=${e}
                .tabs=${t}
                .sessionKey=${n}
                .widgetFrameUrl=${this.widgetFrameUrl}
                .callbacks=${this.cellCallbacks}
                .sessions=${this.sessions}
                .dragging=${i.name===this.gestureName}
                .focusTabIndex=${i.name===o?0:-1}
                .positionInSet=${(a.get(i.name)??0)+1}
                .setSize=${r.length}
                .busy=${this.mutationPending}
                .canMutate=${this.canMutate}
                .canGrant=${this.canGrant}
              ></openclaw-board-widget-cell>
            `:p})}
        ${this.gesture?.mode===`move`?s`<div class="board-grid__append-zone" aria-hidden="true"></div>`:p}
      </div>
    `}render(){let e=this.snapshot;if(!e)return p;let t=X(e),n=this.activeTab(t),r=n?.tabId??this.activeTabId,i=n?Z(e,n.tabId):[];return s`
      <section class="board-view" aria-label=${v(`board.label`)}>
        ${this.renderTabs(t,r)} ${this.renderGrid(i,t,e.sessionKey)}
        ${this.actionError?s`<div class="board-view__error" role="alert">${this.actionError}</div>`:p}
        <div class="board-announcer" aria-live="polite" aria-atomic="true">
          ${this.announcement?c(this.announcementRevision,s`<span data-announcement-revision=${this.announcementRevision}
                  >${this.announcement}</span
                >`):p}
        </div>
      </section>
    `}},n([l({attribute:!1})],$.prototype,`snapshot`,void 0),n([l({attribute:!1})],$.prototype,`activeTabId`,void 0),n([l({attribute:!1})],$.prototype,`widgetFrameUrl`,void 0),n([l({attribute:!1})],$.prototype,`callbacks`,void 0),n([l({attribute:!1})],$.prototype,`sessions`,void 0),n([l({type:Boolean})],$.prototype,`canMutate`,void 0),n([l({type:Boolean})],$.prototype,`canGrant`,void 0),n([f()],$.prototype,`previewItems`,void 0),n([f()],$.prototype,`gestureName`,void 0),n([f()],$.prototype,`hoverTabId`,void 0),n([f()],$.prototype,`announcement`,void 0),n([f()],$.prototype,`announcementRevision`,void 0),n([f()],$.prototype,`actionError`,void 0),n([f()],$.prototype,`focusName`,void 0),n([f()],$.prototype,`mutationPending`,void 0),customElements.get(`openclaw-board-view`)||customElements.define(`openclaw-board-view`,$)}))();
//# sourceMappingURL=board-view-lUWQRRSH.js.map