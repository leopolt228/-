import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,u as n}from"./control-ui-foundation-43q8Lf_T.js";import{dt as r,ft as i}from"./control-ui-foundation-DQl2NL7K.js";import{$ as a,J as o,U as s,X as c,z as l}from"./lit-runtime-CE4wpvNA.js";import{Mi as u,Mr as d,Nr as f,Pi as p}from"./control-ui-core-Dx4utKSD.js";import{Ut as m,at as h,it as g,jt as _}from"./control-ui-core-6OhF3OIO.js";import{o as v,t as y}from"./control-ui-core-CXeSrnoQ.js";import{D as b,at as x,ot as S}from"./control-ui-core-vPyynwls.js";import{n as C,t as w}from"./settings-workspace-BhCB-OeS.js";import{a as T,c as E,f as D,n as O,o as k,p as A,t as j,u as M}from"./settings-ui-BJ5HJKwt.js";import{i as N,n as P}from"./provider-icon-S1L7nSch.js";var F=e((()=>{}));function I(e,t){let n=e.details?.[t];return typeof n==`string`&&n.trim()?n:void 0}function L(e){let t=new Map;for(let n of e){let e=I(n,`collectionId`)??n.id,r=I(n,`collectionLabel`)??I(n,`sourceLabel`)??v(`memoryImport.unknownCollection`),i=t.get(e)??{id:e,label:r,items:[]};i.items.push(n),t.set(e,i)}return[...t.values()].toSorted((e,t)=>e.label.localeCompare(t.label))}function R(e){return e.providerId===`claude`?v(`memoryImport.claudeCode`):e.label}function z(e){return e.providerId===`codex`?v(`memoryImport.codexDescription`):e.providerId===`claude`?v(`memoryImport.claudeDescription`):v(`memoryImport.providerFallback`)}function B(e){return v(e===1?`memoryImport.fileCountOne`:`memoryImport.fileCount`,{count:String(e)})}function V(e){let t=I(e,`relativePath`);if(t)return t;let n=e.target??e.source??e.id;return n.split(/[\\/]/u).at(-1)??n}function H(e,t,n,r,i){let o=t.items.filter(e=>e.status===`planned`).map(e=>e.id),s=o.length>0&&o.every(e=>n.has(e)),l=t.items.filter(e=>e.status===`conflict`).length;return a`
    <div class="settings-row settings-row--stacked memory-import__collection">
      <div class="memory-import__collection-header">
        <label class="memory-import__collection-choice">
          <input
            type="checkbox"
            .checked=${s}
            ?disabled=${o.length===0||i}
            @change=${t=>r(e.providerId,o,t.currentTarget.checked)}
          />
          <span>
            <strong>${t.label}</strong>
            <small>${B(t.items.length)}</small>
          </span>
        </label>
        ${l>0?M({kind:`warn`,label:v(`memoryImport.alreadyImported`,{count:String(l)})}):c}
      </div>
      <details ?open=${t.items.length<=4}>
        <summary>${v(`memoryImport.reviewFiles`)}</summary>
        <ul class="memory-import__files">
          ${t.items.map(e=>a`
              <li>
                <span class="memory-import__file-icon" aria-hidden="true">${x.fileText}</span>
                <code title=${e.source??V(e)}>${V(e)}</code>
                <span class="memory-import__file-status memory-import__file-status--${e.status}">
                  ${e.status===`planned`?v(`memoryImport.ready`):e.status===`conflict`?v(`memoryImport.existing`):e.status}
                </span>
              </li>
            `)}
        </ul>
      </details>
    </div>
  `}function U(e){if(!e)return c;let t=e.summary.errors>0||e.summary.conflicts>0,n=e.items.filter(e=>e.status===`error`||e.status===`conflict`||I(e,`recoveryRecordPath`)!==void 0);return a`
    <div
      class="settings-row settings-row--stacked memory-import__result ${t?`memory-import__result--incomplete`:``}"
      role=${t?`alert`:`status`}
    >
      <span aria-hidden="true">${t?x.alertTriangle:x.check}</span>
      <div>
        <strong>
          ${v(t?`memoryImport.importIncomplete`:`memoryImport.importComplete`)}
        </strong>
        <span>
          ${t?v(`memoryImport.importedWithIssues`,{conflicts:String(e.summary.conflicts),errors:String(e.summary.errors),migrated:String(e.summary.migrated)}):v(`memoryImport.importedCount`,{count:String(e.summary.migrated)})}
        </span>
        ${e.reportDir?a`<span class="memory-import__result-path">
              ${v(`memoryImport.reportSaved`)}:
              <code title=${e.reportDir}>${e.reportDir}</code>
            </span>`:c}
        ${n.length>0?a`<ul class="memory-import__result-issues">
              ${n.map(e=>{let t=[{label:v(`memoryImport.recoveryFile`),path:I(e,`recoveryPath`)},{label:v(`memoryImport.recoveryJournal`),path:I(e,`recoveryRecordPath`)},{label:v(`memoryImport.itemBackup`),path:I(e,`backupPath`)}].filter(e=>!!e.path);return a`<li>
                  <strong>${V(e)}</strong>
                  <span>${e.reason??e.message??e.status}</span>
                  ${t.map(e=>a`<span class="memory-import__result-artifact">
                      <span>${e.label}</span>
                      <code title=${e.path}>${e.path}</code>
                    </span>`)}
                </li>`})}
            </ul>`:c}
      </div>
    </div>
  `}function W(e,t){let n=new Set(e.selectedByProvider[t.providerId]??[]),r=L(t.items),i=e.applyingProviderId===t.providerId,o=t.error?a`<div class="callout danger" role="alert">${t.error}</div>`:t.found?a`
          ${t.source?k({title:v(`memoryImport.source`),control:A(t.source,{mono:!0})}):c}
          ${t.target?k({title:v(`memoryImport.destination`),control:A(`${t.target}/memory/imports/`,{mono:!0})}):c}
          ${r.map(r=>H(t,r,n,e.onToggleCollection,e.loading||e.applyingProviderId!==null||e.error!==null))}
          ${k({title:n.size>0?v(`memoryImport.selectedCount`,{count:String(n.size)}):v(`memoryImport.selectAtLeastOne`),control:a`
              <button
                class="btn primary"
                data-test-id="memory-import-provider-button"
                ?disabled=${n.size===0||e.applyingProviderId!==null||e.loading||e.error!==null}
                @click=${()=>e.onRequestImport(t.providerId)}
              >
                ${v(i?`common.importing`:`memoryImport.importSelected`)}
              </button>
            `})}
        `:O(t.message??v(`memoryImport.noMemoryFound`));return a`
    <div data-provider-id=${t.providerId}>
      ${E({title:a`<span class="memory-import__provider-title">
            ${N(t.providerId,{className:`memory-import__provider-icon`})}
            ${R(t)}
          </span>`,description:z(t),actions:M({kind:t.found?`ok`:`muted`,label:t.found?B(t.items.length):v(`memoryImport.notFound`)})},a`${o}${U(e.lastResults[t.providerId])}`)}
    </div>
  `}function G(e){let t=e.plan?.providers.find(t=>t.providerId===e.pendingProviderId);if(!t)return c;let n=e.selectedByProvider[t.providerId]?.length??0,r=v(`memoryImport.confirmTitle`,{provider:R(t)}),i=v(`memoryImport.confirmDescription`,{count:String(n)});return a`
    <openclaw-modal-dialog
      label=${r}
      description=${i}
      @modal-cancel=${()=>{e.applyingProviderId===null&&e.onCancelImport()}}
    >
      <div class="exec-approval-card memory-import__confirm">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">${r}</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
        </div>
        <div class="callout ${e.replaceExisting?`warn`:``}">
          ${e.replaceExisting?v(`memoryImport.confirmReplace`):v(`memoryImport.confirmBackup`)}
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            data-test-id="memory-import-confirm"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onConfirmImport}
          >
            ${v(`memoryImport.confirmImport`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onCancelImport}
          >
            ${v(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function K(e){let t=e.loading||e.applyingProviderId!==null;return E({title:v(`memoryImport.title`),description:v(`memoryImport.subtitle`),actions:a`
        <button class="btn btn--sm" ?disabled=${t} @click=${e.onRefresh}>
          ${e.loading?v(`common.refreshing`):v(`common.refresh`)}
        </button>
      `},a`
      ${k({title:v(`memoryImport.agent`),control:a`
          <select
            class="settings-select"
            name="memory-import-agent"
            .value=${e.selectedAgentId??``}
            ?disabled=${t}
            @change=${t=>e.onSelectAgent(t.currentTarget.value)}
          >
            ${e.agents.map(t=>a`
                <option value=${t.id} ?selected=${t.id===e.selectedAgentId}>
                  ${t.identity?.name??t.name??t.id}
                </option>
              `)}
          </select>
        `})}
      ${D({title:v(`memoryImport.replaceExisting`),description:v(`memoryImport.replaceHint`),checked:e.replaceExisting,disabled:t,onChange:t=>e.onReplaceExisting(t)})}
    `)}function q(e){return e.connected?a`
    <div class="memory-import" data-test-id="memory-import-page">
      ${T(a`
        ${K(e)}
        ${e.error?a`<div class="callout danger" role="alert">${e.error}</div>`:c}
        ${e.applyError?a`<div class="callout danger" role="alert">${e.applyError}</div>`:c}
        ${e.loading&&!e.plan?a`<div class="settings-group memory-import__loading" aria-busy="true">
              <div class="memory-import__skeleton"></div>
              <div class="memory-import__skeleton"></div>
            </div>`:(e.plan?.providers??[]).map(t=>W(e,t))}
        ${G(e)}
      `)}
    </div>
  `:T(O(v(`memoryImport.disconnected`)))}var J=e((()=>{o(),b(),S(),P(),j(),y(),F()}));function Y(e){return e instanceof Error&&e.message.trim()?e.message:typeof e==`string`?e:`request failed`}function X(){return typeof globalThis.crypto.randomUUID==`function`?globalThis.crypto.randomUUID():[...globalThis.crypto.getRandomValues(new Uint32Array(4))].map(e=>e.toString(16).padStart(8,`0`)).join(``)}var Z;e((()=>{r(),o(),l(),_(),h(),w(),p(),f(),J(),n(),Z=class extends u{constructor(...e){super(...e),this.plan=null,this.loading=!1,this.error=null,this.replaceExisting=!1,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=null,this.applyError=null,this.lastResults={},this.loadedKey=null,this.requestedKey=null,this.loadedClient=null,this.requestedClient=null,this.refreshEpoch=0,this.applyEpoch=0,this.gatewayUnavailable=!1,this.subscriptions=new d(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.refreshEpoch+=1,this.applyEpoch+=1,this.subscriptions.clear(),super.disconnectedCallback()}updated(){let e=this.context.gateway.snapshot;if(!e.connected||!e.client){this.gatewayUnavailable||(this.gatewayUnavailable=!0,this.resetPlanState({preserveAttemptedImport:!0}));return}if(this.gatewayUnavailable=!1,!this.context.agents.state.agentsList){this.context.agents.ensureList();return}let t=this.currentAgentId();if(!t)return;let n=this.planKey(t),r=this.requestedClient??this.loadedClient,i=this.requestedKey??this.loadedKey;(r!==null&&r!==e.client||i!==null&&i!==n)&&this.resetPlanState({preserveAttemptedImport:r!==null&&r!==e.client}),!this.loading&&(this.loadedClient!==e.client||this.loadedKey!==n)&&(this.requestedClient!==e.client||this.requestedKey!==n)&&this.refresh()}currentAgentId(){let e=this.context.agents.state.agentsList;if(!e)return null;let t=this.context.agentSelection.state.selectedId;return t&&e.agents.some(e=>e.id===t)?t:e.defaultId??e.agents[0]?.id??null}planKey(e){return`${e}:${this.replaceExisting?`replace`:`safe`}`}resetPlanState(e={}){let t=e.preserveAttemptedImport&&this.pendingImport?.attempted?this.pendingImport:null;this.refreshEpoch+=1,this.applyEpoch+=1,this.plan=null,this.loading=!1,this.error=null,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=t,this.applyError=null,this.lastResults={},this.loadedKey=null,this.requestedKey=null,this.loadedClient=null,this.requestedClient=null}async refresh(e=!1){let t=this.context.gateway.snapshot,n=this.currentAgentId();if(!t.connected||!t.client||!n||this.loading)return;let r=t.client,i=this.planKey(n);if(!e&&this.loadedClient===r&&this.loadedKey===i)return;let a=++this.refreshEpoch;this.requestedKey=i,this.requestedClient=r,this.loading=!0,this.error=null;try{let e=await r.request(`migrations.memory.plan`,{agentId:n,overwrite:this.replaceExisting});if(a!==this.refreshEpoch)return;this.plan=e,this.loadedKey=i,this.loadedClient=r,this.selectedByProvider=Object.fromEntries(e.providers.map(e=>[e.providerId,e.items.filter(e=>e.status===`planned`).map(e=>e.id)]))}catch(e){a===this.refreshEpoch&&(this.error=Y(e),this.loadedKey=i,this.loadedClient=r)}finally{a===this.refreshEpoch&&(this.loading=!1,this.requestedKey=null,this.requestedClient=null)}}selectAgent(e){this.context.agentSelection.set(e),this.resetPlanState()}setReplaceExisting(e){this.replaceExisting=e,this.resetPlanState()}toggleCollection(e,t,n){let r=new Set(this.selectedByProvider[e]??[]);for(let e of t)n?r.add(e):r.delete(e);this.selectedByProvider={...this.selectedByProvider,[e]:[...r]}}requestImport(e){let t=this.currentAgentId(),n=this.plan?.providers.find(t=>t.providerId===e)?.planFingerprint,r=this.selectedByProvider[e]??[];this.loading||this.error!==null||this.applyingProviderId!==null||!t||this.plan?.agentId!==t||!n||r.length===0||(this.applyError=null,this.pendingImport={providerId:e,agentId:t,planFingerprint:n,itemIds:[...r],overwrite:this.replaceExisting,idempotencyKey:X(),attempted:!1})}async confirmImport(){if(this.applyingProviderId!==null)return;let e=this.pendingImport,t=this.context.gateway.snapshot;if(!e||!t.client||this.currentAgentId()!==e.agentId||this.plan?.agentId!==e.agentId)return;let n={...e,attempted:!0};this.pendingImport=n;let r=++this.applyEpoch;this.applyingProviderId=n.providerId,this.applyError=null;try{let e=await t.client.request(`migrations.memory.apply`,{idempotencyKey:n.idempotencyKey,agentId:n.agentId,providerId:n.providerId,planFingerprint:n.planFingerprint,itemIds:n.itemIds,overwrite:n.overwrite});if(r!==this.applyEpoch)return;this.lastResults={...this.lastResults,[n.providerId]:e},this.pendingImport=null,this.loadedKey=null,this.requestedKey=null,this.loadedClient=null,this.requestedClient=null,await this.refresh(!0)}catch(e){r===this.applyEpoch&&(this.applyError=Y(e))}finally{r===this.applyEpoch&&(this.applyingProviderId=null)}}render(){let e=this.context.gateway.snapshot,t=this.context.agents.state.agentsList,n=this.currentAgentId(),r=q({connected:e.connected,agents:t?.agents??[],selectedAgentId:n,plan:this.plan,loading:this.loading,error:this.error,applyError:this.applyError,replaceExisting:this.replaceExisting,selectedByProvider:this.selectedByProvider,applyingProviderId:this.applyingProviderId,pendingProviderId:this.pendingImport?.agentId===n?this.pendingImport.providerId:null,lastResults:this.lastResults,onSelectAgent:e=>this.selectAgent(e),onReplaceExisting:e=>this.setReplaceExisting(e),onRefresh:()=>void this.refresh(!0),onToggleCollection:(e,t,n)=>this.toggleCollection(e,t,n),onRequestImport:e=>this.requestImport(e),onConfirmImport:()=>void this.confirmImport(),onCancelImport:()=>{this.applyingProviderId===null&&(this.pendingImport=null,this.applyError=null)}});return a`
      <section class="content-header">
        <div>
          <div class="page-title">${m(`memory-import`)}</div>
        </div>
      </section>
      ${C(r)}
    `}},t([i({context:g,subscribe:!0})],Z.prototype,`context`,void 0),t([s()],Z.prototype,`plan`,void 0),t([s()],Z.prototype,`loading`,void 0),t([s()],Z.prototype,`error`,void 0),t([s()],Z.prototype,`replaceExisting`,void 0),t([s()],Z.prototype,`selectedByProvider`,void 0),t([s()],Z.prototype,`applyingProviderId`,void 0),t([s()],Z.prototype,`pendingImport`,void 0),t([s()],Z.prototype,`applyError`,void 0),t([s()],Z.prototype,`lastResults`,void 0),customElements.get(`openclaw-memory-import-page`)||customElements.define(`openclaw-memory-import-page`,Z)}))();
//# sourceMappingURL=memory-import-page-DNCWUv8o.js.map