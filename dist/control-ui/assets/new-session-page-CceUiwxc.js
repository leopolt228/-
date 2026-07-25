import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,u as n}from"./control-ui-foundation-43q8Lf_T.js";import{at as r,ct as i,dt as a,lt as o,ot as s,st as c,ut as l}from"./control-ui-core-DF5v1q4q.js";import{dt as u,ft as d}from"./control-ui-foundation-DQl2NL7K.js";import{$ as f,G as p,J as m,U as h,X as g,z as _}from"./lit-runtime-CE4wpvNA.js";import{ft as v}from"./control-ui-foundation-DFIFKu9N.js";import{$n as ee,Ba as te,Bo as y,Da as ne,Ea as b,Ha as x,Mi as re,Mr as ie,Nr as ae,Pi as oe,fo as S,po as C,qa as w,wa as se,xa as ce,xr as le}from"./control-ui-core-Dx4utKSD.js";import{B as ue,Gt as de,U as fe,Wt as pe,_t as me,at as he,g as ge,gt as _e,it as ve,p as ye}from"./control-ui-core-6OhF3OIO.js";import{o as T,t as E}from"./control-ui-core-CXeSrnoQ.js";import{Q as be,at as D,ot as O}from"./control-ui-core-vPyynwls.js";import{$ as xe,C as Se,T as Ce,_ as we,c as Te,d as k,et as Ee,h as De,ht as Oe,i as ke,l as Ae,m as je,n as Me,p as Ne,r as Pe,s as Fe,t as Ie,u as A,v as Le,w as Re}from"./chat-model-controls-Dkjngm_b.js";import{a as ze,c as Be}from"./attachment-payload-store-CcQeaOvD.js";import{t as Ve}from"./web-awesome-popover-DRskEwBZ.js";var He=e((()=>{})),Ue,We=e((()=>{ze(),Ue=class{constructor(e){this.notify=e,this.attachments=[],this.pendingReads=0,this.readController=new AbortController}get readSignal(){return this.readController.signal}replace(e){this.attachments=e,this.notify()}updatePending(e,t){this.readController.signal===e&&(this.pendingReads=Math.max(0,this.pendingReads+t),this.notify())}abortReads(){this.readController.abort(),this.readController=new AbortController,this.pendingReads=0,this.notify()}reset(e){this.abortReads(),e.release&&Be(this.attachments),this.attachments=[],this.notify()}clearAfterSubmit(e){e&&Be(this.attachments),this.attachments=[],this.notify()}}}));function Ge(e){return(Array.isArray(e)?e:[]).flatMap(e=>{let t=e,n=v(t.nodeId),r=Array.isArray(t.commands)?t.commands.filter(e=>typeof e==`string`):[];if(!n)return[];let i=t.connected===!0,a=i&&r.includes(`system.run`);return[{nodeId:n,displayName:v(t.displayName)??n,connected:i,canExec:a,canBrowse:a&&r.includes(`fs.listDir`)}]}).toSorted((e,t)=>e.displayName.localeCompare(t.displayName)||e.nodeId.localeCompare(t.nodeId))}function Ke(e){return(Array.isArray(e)?e:[]).flatMap(e=>{if(!e||typeof e!=`object`)return[];let t=e,n=v(t.id),r=v(t.providerId);return n&&r?[{id:n,providerId:r}]:[]}).toSorted((e,t)=>e.id.localeCompare(t.id))}var qe=e((()=>{y()}));function j(e){return e instanceof Error?e.message:String(e)}function M(e){return e instanceof pe?e.retryable||e.gatewayCode===`UNAVAILABLE`:!0}async function N(e,t){try{let n=await e.request(`sessions.describe`,{key:t});return n?.session===null?{status:`missing`}:{status:`read`,placement:n?.session?.placement}}catch(e){return M(e)?{status:`unavailable`}:{status:`rejected`,error:j(e)}}}async function P(e,t){t.abortRun&&await e.request(`sessions.abort`,{key:t.key,agentId:t.agentId}).catch(()=>void 0);let n=t.environmentId;if(typeof n!=`string`||!n.trim())return`cloud worker cleanup lost its environment identity`;try{await e.request(`environments.destroy`,{environmentId:n});return}catch(e){return j(e)}}async function F(e,t,n){let r=t.initial?{status:`read`,placement:t.initial}:void 0,i=typeof t.initial?.environmentId==`string`&&t.initial.environmentId.trim()?t.initial.environmentId:void 0,a=0,o=0;for(let s=0;s<Qe;s+=1){let s=r??await N(e,t.key);if(r=void 0,s.status===`missing`)return{status:`missing`};if(s.status===`rejected`)return{status:`cleanup-rejected`,error:s.error};if(s.status===`unavailable`){if(a+=1,!n()||a>=$e){if(!n()&&i){let n=await P(e,{key:t.key,agentId:t.agentId,environmentId:i,abortRun:!1});return n?{status:`cleanup-rejected`,error:n}:{status:`cancelled`}}return{status:`cleanup-rejected`,error:`cloud worker placement could not be verified`}}await new Promise(e=>{globalThis.setTimeout(e,R)});continue}if(a=0,s.status===`read`){let r=s.placement;if(r&&typeof r.environmentId==`string`&&r.environmentId.trim()&&(i=r.environmentId),r)o=0;else if(o+=1,o>=et)return{status:`cleanup-rejected`,error:`cloud worker placement could not be verified`};if(!n()){let n=typeof r?.environmentId==`string`&&r.environmentId.trim()?r.environmentId:i;if(n){let r=await P(e,{key:t.key,agentId:t.agentId,environmentId:n,abortRun:!1});return r?{status:`cleanup-rejected`,error:r}:{status:`cancelled`}}if(r?.state===`active`)return{status:`cleanup-rejected`,error:`cloud worker cleanup lost its environment identity`};if(r&&!z.has(String(r.state)))return{status:`cancelled`}}else if(r?.state===`active`)return{status:`active`,placement:r};else if(r&&!z.has(String(r.state))){if(i){let n=await P(e,{key:t.key,agentId:t.agentId,environmentId:i,abortRun:!1});if(n)return{status:`cleanup-rejected`,error:n}}return{status:`rejected`,placement:r}}}await new Promise(e=>{globalThis.setTimeout(e,R)})}return{status:`cleanup-rejected`,error:n()?`cloud worker placement reconciliation timed out`:`cloud worker cleanup timed out`}}async function I(e,t,n){if(!e)return`gateway unavailable during draft cleanup`;try{await e.request(`sessions.delete`,{key:t,agentId:n,deleteTranscript:!0});return}catch(e){return j(e)}}async function Je(e,t,n){if(!e)return`gateway unavailable during draft cleanup`;let r=await N(e,t);if(r.status!==`missing`){if(r.status===`rejected`)return r.error;if(r.status===`unavailable`)return`cloud worker placement could not be verified`;if(r.placement){let i=await F(e,{key:t,agentId:n,initial:r.placement},()=>!1);if(i.status===`cleanup-rejected`)return i.error;if(i.status===`active`)return`cloud worker cleanup did not cancel its active placement`}return I(e,t,n)}}async function Ye(e){return Ke((await e.request(`environments.list`,{}))?.profiles)}async function Xe(e,t,n,r=()=>!0){let i,a=``;if(t.recovering){let r=await N(e,t.key);r.status===`missing`?i={status:`missing`}:r.status===`rejected`?i={status:`cleanup-rejected`,error:r.error}:(r.status===`unavailable`||r.placement)&&(i=await F(e,{key:t.key,agentId:t.agentId,initial:r.status===`read`?r.placement:void 0},n)),t.retryTerminalPlacement&&i?.status===`rejected`&&(i=void 0)}if(!i)try{let r=await e.request(`sessions.dispatch`,{key:t.key,agentId:t.agentId,profileId:t.profileId});i=await F(e,{key:t.key,agentId:t.agentId,initial:r.placement},n)}catch(r){if(a=j(r),!M(r))return{status:`dispatch-rejected`,error:a};i=await F(e,{key:t.key,agentId:t.agentId},n)}if(i.status===`cancelled`||i.status===`cleanup-rejected`)return i;if(i.status===`missing`)return{status:`session-missing`,error:`cloud draft session no longer exists`};if(i.status===`rejected`){let e=typeof i.placement?.state==`string`?i.placement.state:``;return{status:`dispatch-rejected`,error:a||(e?`cloud worker placement became ${e}`:``)}}let o=i.placement;if(!n()){let n=await P(e,{key:t.key,agentId:t.agentId,environmentId:o.environmentId,abortRun:!1});return n?{status:`cleanup-rejected`,error:n}:{status:`cancelled`}}let s=t.messageId??S();if(!r()){let n=await P(e,{key:t.key,agentId:t.agentId,environmentId:o.environmentId,abortRun:!1});return n?{status:`cleanup-rejected`,error:n}:{status:`send-not-started`,error:`cloud recovery storage is unavailable`}}try{if(await e.request(`sessions.send`,{key:t.key,agentId:t.agentId,message:t.message,attachments:t.attachments,idempotencyKey:s}),!n()){let n=await P(e,{key:t.key,agentId:t.agentId,environmentId:o?.environmentId,abortRun:!0});return n?{status:`cleanup-rejected`,error:n,messageId:s}:{status:`cancelled`}}return{status:`started`,messageId:s}}catch(r){if(!n()){let n=await P(e,{key:t.key,agentId:t.agentId,environmentId:o?.environmentId,abortRun:!0});return n?{status:`cleanup-rejected`,error:n,messageId:s}:{status:`cancelled`}}if(!M(r)){let n=await P(e,{key:t.key,agentId:t.agentId,environmentId:o.environmentId,abortRun:!1});return n?{status:`cleanup-rejected`,error:n,messageId:s}:{status:`send-definitive-rejected`,error:j(r),messageId:s}}return{status:`send-rejected`,error:j(r),messageId:s}}}function L(e,t){return f`
    <button
      type="button"
      class="session-menu__item"
      data-value=${e.value}
      data-popover=${e.keepOpen?g:`close`}
      aria-pressed=${String(e.checked)}
      title=${e.title??g}
      ?disabled=${t||(e.disabled??!1)}
      @click=${e.onSelect}
    >
      <span class="session-menu__check" aria-hidden="true"
        >${e.checked?D.check:g}</span
      >
      <span class="session-menu__text">${e.label}</span>
    </button>
  `}function Ze(e){return e.profiles.map(t=>L({value:`cloud:${t.id}`,label:T(`newSession.cloudWorker`,{profile:t.id}),checked:e.selectedId===t.id,disabled:e.disabled,title:e.disabled&&e.disabledReason?e.disabledReason:T(`newSession.cloudWorkerProvider`,{provider:t.providerId}),onSelect:()=>e.onSelect(t.id)},e.submitting))}var R,Qe,$e,et,z,B=e((()=>{m(),de(),O(),E(),C(),qe(),R=250,Qe=1200,$e=4,et=20,z=new Set([`requested`,`provisioning`,`syncing`,`starting`,`draining`,`reconciling`])}));function tt(e,t,n){let r=e.length>0&&t?.recoveryScopeReady===!0&&!n;return{profiles:r?[]:e,unsupported:r}}var V,nt,rt=e((()=>{B(),V=[1e3,3e3,1e4,3e4,6e4],nt=class{constructor(e){this.host=e,this.requestToken=0,this.retryAttempt=0}invalidate(){this.requestToken+=1,globalThis.clearTimeout(this.retryTimer),this.retryTimer=void 0,this.retryAttempt=0,this.host.update({profiles:[],hydrated:!1})}stop(){globalThis.clearTimeout(this.retryTimer),this.retryTimer=void 0}async load(){let e=++this.requestToken;this.host.update({profiles:[],hydrated:!1});let t=this.host.snapshot();if(!t.connected||!t.client||!t.admin){this.resetRetry(),this.host.update({profiles:[],hydrated:!0,clearSelection:!t.pendingCloud});return}try{let n=await Ye(t.client);if(e!==this.requestToken)return;this.resetRetry(),this.host.update({profiles:n,hydrated:!0,selectionUnavailable:!t.pendingCloud&&!!t.selectedId&&!n.some(e=>e.id===t.selectedId)})}catch{e===this.requestToken&&(this.host.update({profiles:[],hydrated:!1}),this.scheduleRetry())}}resetRetry(){globalThis.clearTimeout(this.retryTimer),this.retryTimer=void 0,this.retryAttempt=0}scheduleRetry(){let e=this.host.snapshot();if(this.retryTimer||!e.connected||!e.client)return;if(this.retryAttempt>=V.length){this.host.update({profiles:[],hydrated:!0,selectionUnavailable:!e.pendingCloud&&!!e.selectedId});return}let t=V[this.retryAttempt];this.retryAttempt+=1,this.retryTimer=globalThis.setTimeout(()=>{this.retryTimer=void 0,this.host.snapshot().connected&&this.load()},t)}}}));function H(e,t){return`${st}${e}:${t}`}function U(e){return typeof e==`string`&&e.trim().length>0}function it(e,t,n){if(!e||typeof e!=`object`||Array.isArray(e))return null;let r=e,i=new Set([`key`,`agentId`,`message`,`worktree`,...K]);return Object.keys(r).some(e=>!i.has(e))||r.key!==t||r.agentId!==n||r.message!==``||r.worktree!==!0||K.some(e=>r[e]!==void 0&&!U(r[e]))?null:r}function W(e,t){if(!e||!t)return null;try{let n=globalThis.sessionStorage?.getItem(H(e,t));if(!n)return null;let r=JSON.parse(n);return!U(r.sessionKey)||!U(r.messageId)||typeof r.message!=`string`||!U(r.message)&&!r.attachments?.length||r.attachments!==void 0&&!Array.isArray(r.attachments)||!U(r.profileId)||!U(r.agentId)||r.gatewayUrl!==e||r.recoveryScope!==t||r.phase!==`creating`&&r.phase!==`dispatching`&&r.phase!==`sending`||r.phase===`creating`&&!it(r.createParams,r.sessionKey,r.agentId)?(globalThis.sessionStorage?.removeItem(H(e,t)),null):r}catch{return null}}function G(e){try{let t=globalThis.sessionStorage;return!t||!e.gatewayUrl||!e.recoveryScope?!1:(t.setItem(H(e.gatewayUrl,e.recoveryScope),JSON.stringify(e)),t.getItem(H(e.gatewayUrl,e.recoveryScope))!==null)}catch{return!1}}function at(e){let t=W(e.gatewayUrl,e.recoveryScope);return t&&t.sessionKey!==e.sessionKey?!1:G(e)}function ot(e,t,n){if(!(!e||!t))try{let r=globalThis.sessionStorage,i=H(e,t);if(n){let e=r?.getItem(i);if(!e||JSON.parse(e).sessionKey!==n)return}r?.removeItem(i)}catch{}}var st,K,ct=e((()=>{st=`openclaw.new-session.cloud-recovery.v1:`,K=[`model`,`thinkingLevel`,`worktreeBaseRef`,`worktreeName`,`cwd`,`execNode`,`catalogId`]}));function lt(e,t,n){let r=e.connected&&e.client?.recoveryScopeReady?e.client.recoveryScope??``:t;return{next:r,changed:!n&&e.connected&&t!==r}}var ut,dt=e((()=>{C(),ct(),ut=class{constructor(){this.sessionKey=``,this.messageId=``,this.message=``,this.profileId=``,this.agentId=``,this.gatewayUrl=``,this.recoveryScope=``,this.phase=`dispatching`,this.retryAllowed=!1,this.restored=!1}clear(){ot(this.gatewayUrl,this.recoveryScope,this.sessionKey),this.reset()}clearFor(e,t,n){ot(e,t,n),this.owns(e,t,n)&&this.reset()}owns(e,t,n){return this.gatewayUrl===e&&this.recoveryScope===t&&this.sessionKey===n}reset(){this.sessionKey=``,this.messageId=``,this.message=``,this.attachments=void 0,this.profileId=``,this.agentId=``,this.gatewayUrl=``,this.recoveryScope=``,this.phase=`dispatching`,this.createParams=void 0,this.retryAllowed=!1,this.restored=!1}restore(e,t){let n=W(e,t);return n?(this.apply(n,!0),n):null}capture(){return this.snapshot(this.sessionKey,this.phase)}stageCreate(e){let t=`agent:${e.agentId}:dashboard:${S()}`,n=it({...e.createParams,key:t},t,e.agentId);if(!n)return null;let r={sessionKey:t,messageId:S(),message:e.message,attachments:e.attachments,profileId:e.profileId,agentId:e.agentId,gatewayUrl:e.gatewayUrl,recoveryScope:e.recoveryScope,phase:`creating`,createParams:n};return G(r)?(this.apply(r,!1),n):null}promoteToDispatching(e){let t=this.snapshot(e,`dispatching`);return!t||!G(t)?!1:(this.sessionKey=e,this.phase=`dispatching`,this.createParams=void 0,!0)}snapshot(e,t){return!this.sessionKey||!this.messageId||!this.profileId||!this.agentId||t===`creating`&&!this.createParams?null:{sessionKey:e,messageId:this.messageId,message:this.message,attachments:this.attachments?[...this.attachments]:void 0,profileId:this.profileId,agentId:this.agentId,gatewayUrl:this.gatewayUrl,recoveryScope:this.recoveryScope,phase:t,...t===`creating`&&this.createParams?{createParams:{...this.createParams}}:{}}}apply(e,t){this.sessionKey=e.sessionKey,this.messageId=e.messageId,this.message=e.message,this.attachments=e.attachments,this.profileId=e.profileId,this.agentId=e.agentId,this.gatewayUrl=e.gatewayUrl,this.recoveryScope=e.recoveryScope,this.phase=e.phase,this.createParams=e.createParams,this.retryAllowed=!0,this.restored=t}}}));async function ft(e){let t={sessionKey:e.key,messageId:e.messageId,message:e.message,attachments:e.attachments,profileId:e.profileId,agentId:e.agentId,gatewayUrl:e.gatewayUrl,recoveryScope:e.recoveryScope,phase:e.recoveryPhase},n=e.recovering?W(e.gatewayUrl,e.recoveryScope):null;if(!e.isCurrent()){let r=e.recovering?n?.sessionKey===e.key:at(t),i=e.recovering?await Je(e.client,e.key,e.agentId):await I(e.client,e.key,e.agentId);return i||e.clearRecovery(),{status:`cancelled`,cleanupError:i,recoveryPersisted:i?r:!1}}let r=e.recovering?n?.sessionKey===e.key:G(t);if(!e.isCurrent()||!r){if(e.recovering&&!r)return{status:`cancelled`,cleanupError:`cloud recovery storage is unavailable`,recoveryPersisted:!1};let t=e.recovering?await Je(e.client,e.key,e.agentId):await I(e.client,e.key,e.agentId);return t||e.clearRecovery(),{status:`cancelled`,cleanupError:t,recoveryPersisted:r}}let i=await Xe(e.client,{key:e.key,agentId:e.agentId,profileId:e.profileId,message:e.message,attachments:e.attachments,messageId:e.messageId,recovering:e.recovering,retryTerminalPlacement:e.recovering&&e.recoveryPhase===`sending`},e.isCurrent,()=>{if(e.recoveryPhase===`sending`)return!0;let n=G({...t,phase:`sending`});return n&&e.setRecoveryPhase(`sending`),n});if(i.status===`cancelled`){let t=await I(e.client,e.key,e.agentId);return t||e.clearRecovery(),{status:`cancelled`,cleanupError:t,recoveryPersisted:!0}}if(i.status===`cleanup-rejected`)return i;if(i.status===`send-not-started`){let t=await I(e.client,e.key,e.agentId);return t||e.clearRecovery(),{status:`dispatch-rejected`,error:t||i.error}}if(i.status===`send-definitive-rejected`){let t=await I(e.client,e.key,e.agentId);return t||e.clearRecovery(),{status:`dispatch-rejected`,error:t||i.error}}if(i.status===`session-missing`)return e.clearRecovery(),{status:`dispatch-rejected`,error:i.error};if(i.status===`dispatch-rejected`){let t=await I(e.client,e.key,e.agentId);return t||e.clearRecovery(),{status:`dispatch-rejected`,error:t||i.error}}return i.status===`send-rejected`?i:!e.isCurrent()||!e.ownsRecovery()?{status:`ownership-lost`}:(e.clearRecovery(),i)}var pt=e((()=>{ct(),B()}));function mt(e,t){t.submitting||e.key!==`Enter`||e.shiftKey||e.isComposing||e.keyCode===229||(!t.requiresModifier||e.metaKey||e.ctrlKey)&&(e.preventDefault(),t.onSubmit())}function ht(e){let t=e.submitting?T(`newSession.starting`):T(`newSession.start`),n={attachments:e.attachments,disabled:e.submitting||e.messageLocked,getAttachments:e.getAttachments,draft:e.message,getDraft:()=>e.message,onAttachmentsChange:e.onAttachmentsChange,onDraftChange:e.onInput,onPendingReadsChange:e.onPendingReadsChange,readSignal:e.readSignal},r=!e.submitting&&!e.messageLocked,i=0,a=(e,t)=>{let n=e.currentTarget;if(n instanceof HTMLElement){if(t){if(!r||!k(e.dataTransfer))return;i+=1}else i=Math.max(0,i-1);n.toggleAttribute(`data-attachment-drop-active`,i>0)}},o=e=>{i=0;let t=e.currentTarget;t instanceof HTMLElement&&t.removeAttribute(`data-attachment-drop-active`)};return f`
    <div
      class="agent-chat__composer-shell new-session-page__composer"
      @drop=${e=>{if(!k(e.dataTransfer)){A(e)||e.preventDefault();return}e.preventDefault(),o(e),r&&Fe(e,n)}}
      @dragenter=${e=>a(e,!0)}
      @dragleave=${e=>a(e,!1)}
      @dragover=${e=>{if(!k(e.dataTransfer)){A(e)||(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`none`));return}e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=r?`copy`:`none`)}}
    >
      <div class="agent-chat__input">
        ${je(n)} ${Ne(n)}
        <div class="agent-chat__composer-input-row">
          ${De(n)}
          <div class="agent-chat__composer-combobox">
            <textarea
              class="new-session-page__message"
              rows="1"
              ?disabled=${e.submitting||e.messageLocked}
              placeholder=${T(`newSession.messagePlaceholder`)}
              .value=${e.message}
              @input=${t=>e.onInput(t.target.value)}
              @keydown=${t=>mt(t,e)}
              @paste=${t=>{!e.submitting&&!e.messageLocked&&Te(t,n)}}
            ></textarea>
          </div>
          <div class="agent-chat__composer-actions">
            <openclaw-tooltip content=${T(`newSession.start`)}>
              <button
                type="button"
                class="chat-send-btn"
                ?disabled=${!e.canSubmit}
                aria-label=${t}
                @click=${e.onSubmit}
              >
                ${e.submitting?D.loader:D.arrowUp}
              </button>
            </openclaw-tooltip>
          </div>
        </div>
        ${e.modelControl&&e.modelControl!==g?f`<div class="agent-chat__composer-footer">
              <div class="agent-chat__composer-controls">
                <div class="chat-composer-model-control">${e.modelControl}</div>
              </div>
            </div>`:g}
        ${e.pendingAttachmentReads>0?f`<span class="agent-chat__sr-only" role="status"
              >${T(`newSession.readingAttachment`)}</span
            >`:g}
      </div>
    </div>
  `}function gt(e){let t=e.attachmentDraft.readSignal;return ht({attachments:e.attachmentDraft.attachments,canSubmit:e.canSubmit,getAttachments:()=>e.attachmentDraft.attachments,message:e.message,modelControl:e.isCatalogTarget?g:e.modelControl.render({agent:e.agent,agentId:e.agentId,context:e.context,sending:e.submitting}),pendingAttachmentReads:e.attachmentDraft.pendingReads,readSignal:t,requiresModifier:e.requiresModifier,submitting:e.submitting,messageLocked:e.messageLocked,onAttachmentsChange:t=>{!e.submitting&&!e.messageLocked&&e.attachmentDraft.replace(t)},onPendingReadsChange:n=>e.attachmentDraft.updatePending(t,n),onInput:e.onInput,onSubmit:e.onSubmit})}var _t=e((()=>{m(),O(),be(),E(),Ae()}));function q(e){let t=e.trim();return!t||yt.test(t)}function vt(e){let t=v(e.cwd),n=v(e.workspace),r=v(e.execNode),i=v(e.catalogId),a=v(e.model),o=v(e.thinkingLevel),s=t&&t!==n?t:void 0;return{...v(e.key)?{key:v(e.key)}:{},agentId:w(e.agentId),message:e.message,...e.attachments?.length?{attachments:e.attachments}:{},...i?{catalogId:i}:{},...!i&&a?{model:a}:{},...!i&&o?{thinkingLevel:o}:{},...e.worktree?{worktree:!0,...v(e.baseRef)?{worktreeBaseRef:v(e.baseRef)}:{},...v(e.worktreeName)?{worktreeName:v(e.worktreeName)}:{},...s&&!r?{cwd:s}:{}}:{},...r?{execNode:r,...t?{cwd:t}:{}}:{}}}var yt,bt=e((()=>{x(),y(),yt=/^[a-z0-9][a-z0-9-]{0,63}$/}));function xt(e){if(!e.open)return g;let t=e.listing?.entries??[];return f`
    <div class="new-session-page__browser">
      <div class="new-session-page__browser-head">
        <button
          type="button"
          class="new-session-page__browser-nav"
          title=${T(`newSession.browserUp`)}
          aria-label=${T(`newSession.browserUp`)}
          ?disabled=${!e.target||!e.listing&&e.loading}
          @click=${()=>{e.listing?.parent?e.onNavigate(e.listing.parent):e.target&&e.onShowRoot()}}
        >
          ${D.arrowLeft}
        </button>
        ${e.target?f`
              <input
                class="new-session-page__browser-path"
                type="text"
                aria-label=${T(`newSession.folder`)}
                placeholder=${e.target.label}
                .value=${e.pathDraft}
                @input=${t=>{e.onPathDraftChange(t.target.value)}}
                @keydown=${t=>{t.key===`Enter`&&(t.preventDefault(),e.onNavigate(e.pathDraft.trim()||void 0))}}
              />
            `:f`<span class="new-session-page__browser-path">${T(`newSession.where`)}</span>`}
        ${e.loading?f`<span class="new-session-page__browser-loading">${T(`common.loading`)}</span>`:g}
        <button
          type="button"
          class="new-session-page__browser-nav"
          title=${T(`common.close`)}
          aria-label=${T(`common.close`)}
          @click=${e.onClose}
        >
          ${D.x}
        </button>
      </div>
      ${e.error?f`<div class="new-session-page__error">${e.error}</div>`:g}
      <div class="new-session-page__browser-list" role="group" aria-label=${T(`newSession.folder`)}>
        ${e.target?g:f`
              <button
                type="button"
                class="new-session-page__browser-entry"
                @click=${()=>e.onSelectTarget({nodeId:``,label:T(`newSession.gateway`)})}
              >
                <span class="new-session-page__target-icon" aria-hidden="true"
                  >${D.monitor}</span
                >
                <span>${T(`newSession.gateway`)}</span>
              </button>
              ${e.nodes.map(t=>f`
                  <button
                    type="button"
                    class="new-session-page__browser-entry"
                    ?disabled=${!t.canExec}
                    title=${e.nodeBlockedReason(t)??g}
                    @click=${()=>e.onSelectTarget({nodeId:t.nodeId,label:t.displayName})}
                  >
                    <span class="new-session-page__target-icon" aria-hidden="true"
                      >${D.monitor}</span
                    >
                    <span>${t.displayName}</span>
                  </button>
                `)}
            `}
        ${e.listing&&t.length===0&&!e.loading?f`<div class="new-session-page__browser-empty">${T(`newSession.browserEmpty`)}</div>`:g}
        ${e.target?t.map(t=>f`
                <button
                  type="button"
                  class="new-session-page__browser-entry ${t.hidden?`new-session-page__browser-entry--hidden`:``}"
                  title=${t.hidden?T(`newSession.hiddenFolder`):g}
                  @click=${()=>e.onNavigate(t.path)}
                >
                  <span class="new-session-page__target-icon" aria-hidden="true"
                    >${D.folder}</span
                  >
                  <span>${t.name}</span>
                </button>
              `):g}
      </div>
      <div class="new-session-page__browser-actions">
        <button
          type="button"
          class="new-session-page__browser-use"
          ?disabled=${!e.target||e.usablePath===null}
          @click=${()=>{e.target&&e.usablePath!==null&&(e.onApplyFolder(e.usablePath,e.target.nodeId),e.onClose())}}
        >
          ${T(`newSession.browserUse`)}
        </button>
      </div>
    </div>
  `}var St=e((()=>{m(),O(),E()}));function J(e,t,n){let r=ne(e,t,n);if(!r)return null;let i=r.toLowerCase(),a=n.find(e=>ce(e.id,e.provider).toLowerCase()===i);if(a)return{entry:a,model:a.id,provider:b(a.provider)||null};let o=r.indexOf(`/`);return o>0?{model:r.slice(o+1),provider:b(r.slice(0,o))||null}:{model:r,provider:b(t??``)||null}}var Ct,wt=e((()=>{se(),x(),Ie(),Ct=class{constructor(e){this.notify=e,this.requestToken=0,this.catalog=[],this.loading=!1,this.selected=``,this.thinkingLevel=``}invalidate(e=!1){this.requestToken+=1,this.loading=!1,this.catalog=[],e&&(this.selected=``,this.thinkingLevel=``)}reset(){this.invalidate(!0),this.notify()}load(e,t,n){let r=e?.gateway.snapshot,i=r?.client,a=w(t),o=++this.requestToken;if(this.catalog=[],!r?.connected||!i||!a||!n){this.loading=!1,this.notify();return}this.loading=!0,this.notify(),i.request(`chat.metadata`,{agentId:a}).then(e=>{o===this.requestToken&&(this.catalog=Array.isArray(e.models)?e.models:[])}).catch(()=>{o===this.requestToken&&(this.catalog=[])}).finally(()=>{o===this.requestToken&&(this.loading=!1,this.notify())})}resolveAgentRuntimeId(e){let t=e.context?.sessions.state.result?.defaults,n=e.agent?.model?.primary;if(this.selected)return J(this.selected,void 0,this.catalog)?.entry?.agentRuntime?.id.trim();let r=J(n??t?.model,n?void 0:t?.modelProvider,this.catalog)?.entry?.agentRuntime?.id.trim()??e.agent?.agentRuntime?.id.trim()??t?.agentRuntime?.id.trim();return r===`auto`||r==="default"?void 0:r}render(e){let t=e.context?.gateway.snapshot,n=`new-session:${w(e.agentId)}`,r=e.context?.sessions.state.result??null,i=e.agent?.model?.primary,a=J(i??r?.defaults.model,i?void 0:r?.defaults.modelProvider,this.catalog),o=J(this.selected,void 0,this.catalog),s={key:n,kind:`direct`,updatedAt:null,...o?{model:o.model,modelProvider:o.provider??void 0}:{},...this.thinkingLevel?{thinkingLevel:this.thinkingLevel}:{}},c={...r?.defaults,modelProvider:a?.provider??r?.defaults.modelProvider??null,model:a?.model??r?.defaults.model??null,contextTokens:r?.defaults.contextTokens??null,agentRuntime:e.agent?.agentRuntime??r?.defaults.agentRuntime,thinkingLevels:e.agent?.thinkingLevels??r?.defaults.thinkingLevels,thinkingOptions:e.agent?.thinkingOptions??r?.defaults.thinkingOptions,thinkingDefault:e.agent?.thinkingDefault??r?.defaults.thinkingDefault};return Me({activeRunId:null,agentDefaultModel:i,connected:t?.connected===!0,gatewayAvailable:!!t?.client,loading:!1,modelCatalog:this.catalog,modelOverrides:{[n]:this.selected},modelSwitching:!1,modelsLoading:this.loading,sending:e.sending,sessionKey:n,sessionsResult:r,showFastMode:!1,stream:null,thinkingDefaults:c,thinkingSession:s,onModelSelect:e=>{this.selected=e,J(e||i||r?.defaults.model,e||i?void 0:r?.defaults.modelProvider,this.catalog)?.entry?.reasoning===!1&&(this.thinkingLevel=``)},onThinkingSelect:e=>{this.thinkingLevel=e},onRequestUpdate:this.notify})}}}));function Y(e){return e.split(/[\\/]/).findLast(e=>e.length>0)??e}function Tt(e){return e.startsWith(`/`)||e.startsWith(`\\`)||/^[A-Za-z]:[\\/]/.test(e)}var Et=e((()=>{}));function Dt(e){let t=e.context.gateway.snapshot,n={id:S(),text:e.message,attachments:e.attachments,createdAt:Date.now(),kind:`queued`,refreshSessions:!0,sendAttempts:1,sendError:e.error,sendState:`failed`,sessionKey:e.sessionKey,agentId:w(e.agentId)};return xe({settings:ge(),assistantAgentId:t.assistantAgentId,agentsList:e.context.agents.state.agentsList,hello:t.hello},e.sessionKey,n)?!1:(Le(e.sessionKey,{...n,sendRunId:S()}),!0)}var Ot=e((()=>{ye(),x(),C(),Ee(),we()}));function X(e){return e.identity?.name??e.name??e.id}function kt(e){let t=w(e.agentId),n=e.agents.find(e=>w(e.id)===t),r=n?X(n):e.agentId;return f`
    <span class="new-session-page__select">
      <button
        id="new-session-agent-trigger"
        type="button"
        class="new-session-page__trigger ${e.popoverHiding?`new-session-page__trigger--hiding`:``}"
        title=${T(`newSession.agent`)}
        aria-label="${T(`newSession.agent`)}: ${r}"
        aria-haspopup="dialog"
        aria-expanded=${String(e.popoverOpen)}
        ?disabled=${e.disabled}
        @click=${e.onGuardTransition}
      >
        <span class="new-session-page__target-icon" aria-hidden="true">${D.bot}</span>
        <span class="new-session-page__trigger-label">${r}</span>
        <span class="new-session-page__trigger-chevron" aria-hidden="true"
          >${D.chevronDown}</span
        >
      </button>
    </span>
    <wa-popover
      class="new-session-page__select new-session-page__agent-popover"
      for="new-session-agent-trigger"
      placement="bottom-start"
      without-arrow
      @wa-show=${()=>e.onPopoverOpenChange(!0)}
      @wa-hide=${()=>{e.onPopoverOpenChange(!1),e.onPopoverHidingChange(!0)}}
      @wa-after-hide=${()=>{e.onPopoverHidingChange(!1),e.onRestoreTrigger()}}
    >
      <div class="new-session-page__menu-title">${T(`newSession.agent`)}</div>
      ${e.agents.map(n=>L({value:w(n.id),label:X(n),checked:w(n.id)===t,onSelect:()=>e.onSelect(w(n.id))},e.disabled))}
    </wa-popover>
  `}function At(e){let t=e.execNodes.find(t=>t.nodeId===e.execNode),n=e.cloudProfiles.find(t=>t.id===e.cloudProfileId),r=e.cloudProfileId?T(`newSession.cloudWorker`,{profile:e.cloudProfileId}):e.execNode?t?.displayName??e.execNode:T(`newSession.gateway`);return f`
    <span class="new-session-page__select">
      <button
        id="new-session-where-trigger"
        type="button"
        class="new-session-page__trigger ${e.popoverHiding?`new-session-page__trigger--hiding`:``}"
        title=${T(`newSession.where`)}
        aria-label="${T(`newSession.where`)}: ${r}"
        data-worktree=${String(e.worktree)}
        data-cloud-profile=${e.cloudProfileId||g}
        aria-haspopup="dialog"
        aria-expanded=${String(e.popoverOpen)}
        ?disabled=${e.submitting||e.pendingCloud}
        @click=${e.onGuardTransition}
      >
        <span class="new-session-page__target-icon" aria-hidden="true"
          >${e.cloudProfileId?D.server:D.monitor}</span
        >
        <span class="new-session-page__trigger-label">${r}</span>
        ${e.worktree?f`<span class="new-session-page__target-icon" aria-hidden="true"
              >${D.gitBranch}</span
            >`:g}
        <span class="new-session-page__trigger-chevron" aria-hidden="true"
          >${D.chevronDown}</span
        >
      </button>
    </span>
    <wa-popover
      class="new-session-page__select new-session-page__where-popover"
      for="new-session-where-trigger"
      placement="bottom-start"
      without-arrow
      @wa-show=${()=>e.onPopoverOpenChange(!0)}
      @wa-hide=${()=>{e.onPopoverOpenChange(!1),e.onPopoverHidingChange(!0)}}
      @wa-after-hide=${()=>{e.onPopoverHidingChange(!1),e.onRestoreTrigger()}}
    >
      ${e.showTargets?f`
            <div class="new-session-page__menu-title">${T(`newSession.where`)}</div>
            ${L({value:`gateway`,label:T(`newSession.gateway`),checked:!e.execNode&&!e.cloudProfileId,onSelect:()=>e.onSelectExecNode(``)},e.submitting)}
            ${e.execNodes.map(t=>L({value:`node:${t.nodeId}`,label:t.displayName,checked:e.execNode===t.nodeId,onSelect:()=>e.onSelectExecNode(t.nodeId)},e.submitting))}
            ${Ze({profiles:e.cloudProfiles,selectedId:e.cloudProfileId,submitting:e.submitting,disabled:!e.worktreeAvailable||!!e.cloudDisabledReason,disabledReason:e.cloudDisabledReason,onSelect:e.onSelectCloudProfile})}
            ${e.cloudProfileId&&!n?L({value:`cloud:${e.cloudProfileId}`,label:T(`newSession.cloudWorker`,{profile:e.cloudProfileId}),checked:!0,disabled:!0,title:T(`newSession.catalogUnavailable`),onSelect:()=>void 0},e.submitting):g}
            ${e.cloudProfileId&&e.syncFolder?f`<div class="new-session-page__menu-note">
                  ${T(`newSession.cloudSyncsFolder`,{folder:Y(e.syncFolder)})}
                </div>`:g}
          `:g}
      ${e.execNode?g:f`
            ${e.showTargets?f`<div class="session-menu__separator" role="separator"></div>`:g}
            ${L({value:`worktree`,label:T(`newSession.worktree`),checked:e.worktree,disabled:!!e.cloudProfileId||!e.worktreeAvailable||e.customFolder,title:e.cloudProfileId?T(`newSession.cloudRequiresWorktree`):e.worktreeAvailable?T(`chat.runControls.newSessionWorktree`):T(`newSession.worktreeUnavailable`),onSelect:e.onToggleWorktree,keepOpen:!0},e.submitting)}
            ${e.worktree?f`
                  <label class="new-session-page__menu-field">
                    <span>${T(`newSession.baseBranch`)}</span>
                    <input
                      type="text"
                      list="new-session-branches"
                      ?disabled=${e.submitting||e.pendingCloud}
                      placeholder=${e.branchesLoading?T(`common.loading`):e.branches?.defaultBranch??T(`newSession.baseBranch`)}
                      .value=${e.baseRef}
                      @input=${t=>e.onBaseRefInput(t.target.value.trim())}
                    />
                    <datalist id="new-session-branches">
                      ${(e.branches?.branches??[]).map(e=>f`<option value=${e.name}></option>`)}
                    </datalist>
                  </label>
                  <label class="new-session-page__menu-field">
                    <span>${T(`newSession.worktreeName`)}</span>
                    <input
                      type="text"
                      ?disabled=${e.submitting||e.pendingCloud}
                      placeholder=${T(`newSession.worktreeNamePlaceholder`)}
                      .value=${e.worktreeName}
                      @input=${t=>e.onWorktreeNameInput(t.target.value.trim())}
                    />
                  </label>
                `:g}
          `}
    </wa-popover>
  `}function jt(e){let t=e.folder.trim(),n=t?Y(t):e.execNode?T(`newSession.folderPlaceholder`):Y(e.workspace)||T(`newSession.folderPlaceholder`);return f`
    <span class="new-session-page__select">
      <button
        id="new-session-folder-trigger"
        type="button"
        class="new-session-page__trigger ${e.browseAvailable?``:`new-session-page__trigger--disabled`} ${e.popoverHiding?`new-session-page__trigger--hiding`:``}"
        title=${e.browseAvailable?T(`newSession.browse`):T(`newSession.browseRequiresAdmin`)}
        aria-label="${T(`newSession.folder`)}: ${n}"
        aria-haspopup="dialog"
        aria-expanded=${String(e.browserOpen)}
        ?disabled=${e.submitting||e.pendingCloud||!e.browseAvailable}
        @click=${e.onGuardTransition}
      >
        <span class="new-session-page__target-icon" aria-hidden="true">${D.folder}</span>
        <span class="new-session-page__trigger-label">${n}</span>
        <span class="new-session-page__trigger-chevron" aria-hidden="true"
          >${D.chevronDown}</span
        >
      </button>
    </span>
    <wa-popover
      class="new-session-page__select new-session-page__select--folder"
      for="new-session-folder-trigger"
      placement="bottom-start"
      without-arrow
      @wa-show=${e.onShow}
      @wa-hide=${e.onHide}
      @wa-after-hide=${e.onAfterHide}
    >
      <div class="new-session-page__browser-menu">${e.browser}</div>
    </wa-popover>
  `}var Mt=e((()=>{m(),O(),E(),x(),B(),Et()}));function Z(e){return f`
    <div class="callout danger new-session-page__error new-session-page__alert" role="alert">
      <span class="new-session-page__alert-icon" aria-hidden="true">${D.alertTriangle}</span>
      <span class="callout__content new-session-page__alert-message">${e}</span>
    </div>
  `}var Q,$;e((()=>{u(),m(),_(),he(),me(),fe(),ye(),O(),be(),Ve(),E(),ee(),x(),y(),oe(),ae(),Oe(),He(),Re(),Pe(),We(),s(),rt(),dt(),pt(),_t(),bt(),qe(),St(),wt(),Et(),Ot(),Mt(),n(),Q=[0,1e3,3e3],$=class extends re{constructor(...e){super(...e),this.agentId=``,this.folder=``,this.worktree=!1,this.worktreeName=``,this.baseRef=``,this.branches=null,this.branchesLoading=!1,this.nodes=[],this.execNode=``,this.cloudProfiles=[],this.cloudProfilesHydrated=!1,this.cloudProfileId=``,this.message=``,this.submitting=!1,this.submissionOutcomeUnknown=!1,this.error=null,this.catalogRetrying=!1,this.browserOpen=!1,this.browserLoading=!1,this.browserError=null,this.browserListing=null,this.browserTarget=null,this.wherePopoverOpen=!1,this.wherePopoverHiding=!1,this.agentPopoverOpen=!1,this.agentPopoverHiding=!1,this.folderPopoverHiding=!1,this.browserPathDraft=``,this.openedFor=null,this.agentsHydrated=!1,this.nodesHydrated=!1,this.agentSelectedByUser=!1,this.folderSelectedByUser=!1,this.submitRequestToken=0,this.nodesRequestToken=0,this.pendingCloud=new ut,this.cloudProfileDiscovery=new nt({snapshot:()=>({connected:this.gatewayConnected,client:this.gatewayClient,admin:this.isAdmin(),pendingCloud:!!this.pendingCloud.sessionKey,selectedId:this.cloudProfileId}),update:({profiles:e,hydrated:t,clearSelection:n,selectionUnavailable:r})=>{let i=tt(e,this.gatewayClient,this.gatewayRecoveryScope);this.cloudProfiles=i.profiles,this.cloudProfilesHydrated=t,n&&(this.cloudProfileId=``,this.closeWherePopover()),r?this.error=T(`newSession.catalogUnavailable`):i.unsupported?this.error=T(`newSession.cloudSecureContextRequired`):this.error===T(`newSession.cloudSecureContextRequired`)&&(this.error=null)}}),this.branchesRequestToken=0,this.baseRefEditGeneration=0,this.browserRequestToken=0,this.attachmentDraft=new Ue(()=>this.requestUpdate()),this.modelControl=new Ct(()=>this.requestUpdate()),this.gatewaySource=null,this.gatewayClient=null,this.gatewayUrl=``,this.gatewayRecoveryScope=``,this.gatewayRecoveryScopeReady=!1,this.gatewayConnected=!1,this.gatewayConnectionEpoch=0,this.catalogRetryScope=``,this.catalogRetryAttempt=0,this.subscriptions=new ie(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.synchronizeGateway(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).watch(()=>this.context?.sessions,(e,t)=>e.subscribe(t)),this.handleCatalogRetry=()=>{if(this.catalogRetrying||!this.gatewayConnected||!i(this.data)||c(this.data))return;let e=this.context?.revalidate(`new-session`);e&&(globalThis.clearTimeout(this.catalogRetryTimer),this.catalogRetryTimer=void 0,this.catalogRetrying=!0,e.catch(()=>void 0).then(()=>this.updateComplete).finally(()=>{this.catalogRetrying=!1,this.retryPendingCatalogTarget()}))}}synchronizeGateway(e){let t=e.snapshot,n=this.gatewaySource===null,r=!n&&this.gatewayUrl!==e.connection.gatewayUrl,i=!n&&(this.gatewaySource!==e||this.gatewayClient!==t.client),a=!n&&this.gatewayConnected!==t.connected,o=t.connected&&(i||!this.gatewayConnected),s=t.connected&&t.client?.recoveryScopeReady===!0&&!this.gatewayRecoveryScopeReady,c=lt(t,this.gatewayRecoveryScope,n);this.gatewaySource=e,this.gatewayClient=t.client,this.gatewayUrl=e.connection.gatewayUrl,this.gatewayRecoveryScope=c.next,this.gatewayRecoveryScopeReady=t.client?.recoveryScopeReady===!0,this.gatewayConnected=t.connected,(r||i||a||c.changed)&&this.invalidateGatewayDiscovery(r||c.changed),(n||r||c.changed||s||o)&&(this.pendingCloud.gatewayUrl&&(this.pendingCloud.gatewayUrl!==this.gatewayUrl||this.pendingCloud.recoveryScope!==this.gatewayRecoveryScope)&&(this.pendingCloud.reset(),this.submissionOutcomeUnknown=!1),t.connected&&t.client?.recoveryScopeReady&&this.restorePendingCloudRecovery(this.gatewayUrl,this.gatewayRecoveryScope)),(o||c.changed)&&(o&&(this.gatewayConnectionEpoch+=1,this.retryPendingCatalogTarget()),this.cloudProfileDiscovery.load())}invalidateGatewayDiscovery(e){this.nodesRequestToken+=1,this.nodesHydrated=!1,this.cloudProfileDiscovery.invalidate(),this.branchesRequestToken+=1,this.branchesLoading=!1,this.branches=null,this.baseRef=``,this.agentsHydrated=!1,this.modelControl.invalidate(e),this.attachmentDraft.abortReads(),this.closeBrowser(),this.invalidateSubmission(!0),e&&(this.pendingCloud.sessionKey&&(this.pendingCloud.retryAllowed=!1,this.submissionOutcomeUnknown=!0),this.agentId=``,this.agentSelectedByUser=!1,this.folder=``,this.folderSelectedByUser=!1,this.worktree=!1,this.worktreeName=``,this.baseRefEditGeneration+=1,this.nodes=[],this.execNode=``,this.cloudProfileId=``,this.error=null)}retryPendingCatalogTarget(){if(this.catalogRetrying)return;if(!this.gatewayConnected||!i(this.data)||c(this.data)){globalThis.clearTimeout(this.catalogRetryTimer),this.catalogRetryTimer=void 0,this.catalogRetryScope=``,this.catalogRetryAttempt=0;return}let e=`${this.gatewayConnectionEpoch}:${a(this.data)}`;if(this.catalogRetryScope!==e&&(globalThis.clearTimeout(this.catalogRetryTimer),this.catalogRetryTimer=void 0,this.catalogRetryScope=e,this.catalogRetryAttempt=0),this.catalogRetryTimer||this.catalogRetryAttempt>=Q.length)return;let t=Q[this.catalogRetryAttempt];this.catalogRetryAttempt+=1,this.catalogRetryTimer=globalThis.setTimeout(()=>{if(this.catalogRetryTimer=void 0,this.catalogRetryScope!==e||!this.gatewayConnected||!i(this.data)||c(this.data))return;let t=this.context?.revalidate(`new-session`);t&&t.catch(()=>void 0).then(()=>this.updateComplete).then(()=>this.retryPendingCatalogTarget())},t)}disconnectedCallback(){this.subscriptions.clear(),this.invalidateGatewayDiscovery(!0),this.gatewaySource=null,this.gatewayClient=null,this.gatewayConnected=!1,this.gatewayConnectionEpoch=0,this.catalogRetryScope=``,this.catalogRetryAttempt=0,globalThis.clearTimeout(this.catalogRetryTimer),this.catalogRetryTimer=void 0,this.attachmentDraft.reset({release:!0}),this.cloudProfileDiscovery.stop(),super.disconnectedCallback()}updated(){this.retryPendingCatalogTarget();let e=this.context?.agents.state,t=!!(this.gatewayConnected&&this.gatewayClient&&e?.connected&&e.client===this.gatewayClient&&this.agents().length>0),n=a(this.data);if(this.openedFor!==n){this.openedFor=n,this.agentsHydrated=t,this.resetDraft();return}!this.agentsHydrated&&t&&(this.agentsHydrated=!0,this.adoptAgentDefaults({preserveSelectedAgent:!0,preserveSelectedFolder:!0}))}agents(){return this.context?.agents.state.agentsList?.agents??[]}selectedAgent(){let e=w(this.agentId);return this.agents().find(t=>w(t.id)===e)}execNodes(){return this.nodes.filter(e=>e.canExec)}isAdmin(){return ue(this.context?.gateway.snapshot.hello?.auth??null)}workspacePath(){return v(this.selectedAgent()?.workspace)??``}usesCustomFolder(){let e=this.folder.trim();return!!e&&e!==this.workspacePath()}adoptAgentDefaults(e={}){let t=this.agents(),n=this.context?.agents.state.agentsList?.defaultId??t[0]?.id??`main`;e.preserveSelectedAgent&&this.agentSelectedByUser&&this.selectedAgent()||(this.agentId=l(this.data,t,n),this.agentSelectedByUser=!1);let r=e.preserveSelectedFolder&&this.folderSelectedByUser;!this.execNode&&!r&&!this.pendingCloud.sessionKey&&(this.folder=this.workspacePath(),this.folderSelectedByUser=!1),this.loadNodes(),this.modelControl.load(this.context,this.agentId,!i(this.data)),this.maybeLoadBranches()}resetDraft(){let e=!!this.pendingCloud.sessionKey;this.invalidateSubmission(),this.submissionOutcomeUnknown=e,this.agentSelectedByUser=!1,this.folder=``,this.folderSelectedByUser=!1,this.worktree=!1,this.worktreeName=``,this.baseRef=``,this.branches=null,this.branchesLoading=!1,this.execNode=``,this.modelControl.reset(),this.attachmentDraft.reset({release:!0}),this.cloudProfileId=``,e?(this.pendingCloud.restored||(this.pendingCloud.retryAllowed=!1),this.agentId=this.pendingCloud.agentId,this.cloudProfileId=this.pendingCloud.profileId,this.worktree=!0,this.folder=this.pendingCloud.createParams?.cwd??``,this.pendingCloud.restored=!1,this.message=this.pendingCloud.message,this.attachmentDraft.replace(Ce(this.pendingCloud.attachments))):(this.clearPendingCloudRecovery(),this.message=``),this.error=null,this.wherePopoverHiding=!1,this.agentPopoverHiding=!1,this.folderPopoverHiding=!1,this.closeWherePopover(),this.closeAgentPopover(),this.closeBrowser(),this.adoptAgentDefaults(),this.updateComplete.then(()=>{this.querySelector(`.new-session-page__message`)?.focus()})}invalidateSubmission(e=!1){this.submitRequestToken+=1,e&&this.submitting&&(this.submissionOutcomeUnknown=!0),this.submitting=!1}clearPendingCloudRecovery(){this.pendingCloud.clear(),this.submissionOutcomeUnknown=!1}clearPendingCloudRecoveryFor(e,t,n){this.pendingCloud.clearFor(e,t,n),this.pendingCloud.sessionKey||(this.submissionOutcomeUnknown=!1)}restorePendingCloudRecovery(e,t){let n=this.pendingCloud.restore(e,t);n&&(this.agentId=n.agentId,this.cloudProfileId=n.profileId,this.worktree=!0,this.folder=n.createParams?.cwd??``,this.message=n.message,this.attachmentDraft.replace(Ce(n.attachments)))}async loadNodes(){let e=++this.nodesRequestToken;this.nodesHydrated=!1;let t=this.context?.gateway.snapshot,n=t?.client;if(!t?.connected||!n||!this.isAdmin()){this.nodes=[],this.nodesHydrated=!0;return}try{let t=await n.request(`node.list`,{});if(e!==this.nodesRequestToken)return;let r=Ge(t?.nodes);this.nodes=r,this.nodesHydrated=!0,this.execNode&&!r.some(e=>e.nodeId===this.execNode&&e.canExec)&&(this.execNode=``,this.folder=this.workspacePath(),this.folderSelectedByUser=!1,this.worktree=!1,this.worktreeName=``,this.closeBrowser(),this.maybeLoadBranches())}catch{e===this.nodesRequestToken&&(this.nodes=[],this.nodesHydrated=!0)}}maybeLoadBranches(){let e=++this.branchesRequestToken,t=this.baseRefEditGeneration;if(this.branches=null,this.branchesLoading=!1,this.baseRef=``,this.execNode)return;let n=this.folder.trim()||this.workspacePath(),r=this.selectedAgent(),i=n===this.workspacePath();if(!n||i&&r?.workspaceGit!==!0){this.branches=null;return}let a=this.context?.gateway.snapshot,o=a?.client;!a?.connected||!o||(this.branchesLoading=!0,o.request(`worktrees.branches`,{repoRoot:n}).then(r=>{e===this.branchesRequestToken&&(this.branches=r?{...r,repoRoot:n}:null,t===this.baseRefEditGeneration&&(this.baseRef=r?.defaultBranch??r?.headBranch??``))}).catch(()=>{e===this.branchesRequestToken&&(this.branches=null)}).finally(()=>{e===this.branchesRequestToken&&(this.branchesLoading=!1)}))}worktreeAvailable(){return this.execNode?!1:this.usesCustomFolder()?this.isAdmin():this.selectedAgent()?.workspaceGit===!0}cloudProfileForSubmission(){return this.pendingCloud.sessionKey?this.pendingCloud.profileId:this.cloudProfileId}cloudRuntimeUnsupportedReason(){let e=this.modelControl.resolveAgentRuntimeId({agent:this.selectedAgent(),context:this.context});return e&&e!==`openclaw`?T(`newSession.cloudRequiresOpenClawRuntime`,{runtime:e}):void 0}canSubmit(){let e=!!this.pendingCloud.sessionKey,t=this.cloudProfileForSubmission(),n=e?this.pendingCloud.message:this.message.trim(),i=e?!!this.pendingCloud.attachments?.length:this.attachmentDraft.attachments.length>0,a=this.context?.gateway;return this.submitting||this.attachmentDraft.pendingReads>0||!e&&this.submissionOutcomeUnknown||!n&&!i||!a?.snapshot.connected||!a.snapshot.client?!1:e?!!(this.pendingCloud.retryAllowed&&a.snapshot.client.recoveryScopeReady&&t&&this.pendingCloud.agentId&&this.pendingCloud.gatewayUrl===a.connection.gatewayUrl&&this.pendingCloud.recoveryScope===a.snapshot.client?.recoveryScope&&this.isAdmin()):!(this.agents().length===0||!r(this.data,this.selectedAgent())||this.execNode&&(!this.nodesHydrated||!this.execNodes().some(e=>e.nodeId===this.execNode))||t&&(!this.isAdmin()||!a.snapshot.client.recoveryScope||!a.snapshot.client.recoveryScopeReady||!this.cloudProfilesHydrated||!this.worktree||!this.cloudProfiles.some(e=>e.id===t)||this.cloudRuntimeUnsupportedReason())||this.usesCustomFolder()&&(!this.isAdmin()||!this.execNode&&!this.worktree)||this.execNode&&this.worktree||this.worktree&&!this.worktreeAvailable()||this.worktree&&!q(this.worktreeName))}async submit(){let e=this.context;if(!e||!this.canSubmit())return;let t=!!this.pendingCloud.sessionKey,n=t?this.pendingCloud.message:this.message.trim(),r=this.attachmentDraft.attachments,i=t?this.pendingCloud.attachments:Se(r),a=t?this.pendingCloud.agentId:w(this.agentId),o=t?this.pendingCloud.gatewayUrl:e.gateway.connection.gatewayUrl,s=e.gateway.snapshot.client;if(!s)return;let c=t?this.pendingCloud.recoveryScope:s.recoveryScope,l=++this.submitRequestToken;this.submitting=!0,this.error=null,this.closeWherePopover(),this.closeAgentPopover(),this.closeBrowser();for(let e of this.querySelectorAll(`wa-dropdown[open]`))e.open=!1;try{let u=this.cloudProfileForSubmission(),d=vt({agentId:this.agentId,message:u?``:n,model:this.modelControl.selected,thinkingLevel:this.modelControl.thinkingLevel,attachments:u?void 0:i,worktree:this.worktree,baseRef:this.baseRef,worktreeName:this.worktreeName,cwd:this.folder,workspace:this.workspacePath(),execNode:this.execNode,catalogId:this.data?.catalogId}),f=u?t?this.pendingCloud.createParams:this.pendingCloud.stageCreate({agentId:a,profileId:u,message:n,attachments:i,gatewayUrl:o,recoveryScope:c,createParams:d}):void 0;if(u&&!t&&!f){this.error=T(`newSession.cloudStartFailed`,{error:`cloud recovery storage is unavailable`});return}let p=u?this.pendingCloud.capture():null;if(u&&!p){this.error=T(`newSession.cloudStartFailed`,{error:`cloud recovery storage is unavailable`});return}let m=p?.sessionKey??``,h=()=>this.pendingCloud.owns(o,c,m),g=()=>this.isConnected&&s.recoveryScopeReady&&l===this.submitRequestToken&&this.gatewayClient===s&&this.gatewayUrl===o&&this.gatewayRecoveryScope===c&&h(),_=t&&this.pendingCloud.phase!==`creating`?{key:this.pendingCloud.sessionKey,initialRun:{status:`idle`}}:await e.sessions.createResult(f??d);if(l!==this.submitRequestToken&&!u)return;if(!_){if(l!==this.submitRequestToken)return;this.error=e.sessions.state.error??T(`newSession.createFailed`);return}if(u&&p){let e=p.phase===`creating`?`dispatching`:p.phase;if(p.phase===`creating`&&g()){if(!this.pendingCloud.promoteToDispatching(_.key)){this.error=T(`newSession.cloudStartFailed`,{error:`cloud recovery storage is unavailable`});return}m=_.key}let n=await ft({client:s,key:_.key,agentId:a,profileId:u,message:p.message,attachments:p.attachments,messageId:p.messageId,gatewayUrl:o,recoveryScope:c,recoveryPhase:e,recovering:t,isCurrent:g,ownsRecovery:h,clearRecovery:()=>this.clearPendingCloudRecoveryFor(o,c,_.key),setRecoveryPhase:e=>{h()&&(this.pendingCloud.phase=e)}});if(n.status===`cancelled`){if(!h())return;n.cleanupError?(this.pendingCloud.retryAllowed=n.recoveryPersisted,this.submissionOutcomeUnknown=!n.recoveryPersisted,this.error=T(`newSession.cloudStartFailed`,{error:n.cleanupError})):n.recoveryPersisted||(this.error=T(`newSession.createFailed`));return}if(n.status===`cleanup-rejected`){if(!this.pendingCloud.owns(o,c,_.key))return;this.pendingCloud.sessionKey=_.key,n.messageId&&(this.pendingCloud.messageId=n.messageId);let e=l===this.submitRequestToken;this.pendingCloud.retryAllowed=e,this.submissionOutcomeUnknown=!e,this.message=this.pendingCloud.message,this.error=T(`newSession.cloudStartFailed`,{error:n.error});return}if(n.status===`dispatch-rejected`){this.error=T(`newSession.cloudStartFailed`,{error:n.error||T(`newSession.createFailed`)});return}if(n.status===`ownership-lost`)return;if(n.status===`send-rejected`){if(!this.pendingCloud.owns(o,c,_.key))return;this.pendingCloud.messageId=n.messageId,this.pendingCloud.retryAllowed=!0,this.error=n.error||T(`newSession.createFailed`);return}this.attachmentDraft.clearAfterSubmit(!0)}else{let t=_.initialRun.status===`rejected`&&Dt({agentId:this.agentId,attachments:r,context:e,error:_.initialRun.error,message:n,sessionKey:_.key});this.attachmentDraft.clearAfterSubmit(!t)}if(l!==this.submitRequestToken)return;e.gateway.setSessionKey(_.key),e.navigate(`chat`,{search:le(_.key)})}finally{l===this.submitRequestToken&&(this.submitting=!1)}}selectAgentId(e){this.submitting||this.pendingCloud.sessionKey||i(this.data)||w(e)!==w(this.agentId)&&(this.agentId=w(e),this.modelControl.reset(),this.error=null,this.agentSelectedByUser=!0,this.folder=this.execNode?``:this.workspacePath(),this.folderSelectedByUser=!1,this.cloudProfileId=``,this.worktree=!1,this.worktreeName=``,this.closeBrowser(),this.modelControl.load(this.context,this.agentId,!0),this.maybeLoadBranches())}branchesMatchCurrentRepo(){if(this.execNode)return!1;let e=this.folder.trim()||this.workspacePath();return this.branches?.repoRoot===e}applyFolder(e,t=this.execNode){this.submitting||this.pendingCloud.sessionKey||(this.execNode=t,t&&(this.cloudProfileId=``),this.error=null,this.folder=e.trim(),this.folderSelectedByUser=!0,this.execNode?this.worktree=!1:(this.usesCustomFolder()||this.cloudProfileId)&&(this.worktree=!0),this.maybeLoadBranches())}selectExecNode(e){if(this.submitting||this.pendingCloud.sessionKey||e===this.execNode&&!this.cloudProfileId)return;let t=!e&&!this.execNode;this.execNode=e,this.cloudProfileId=``,t||(this.folder=e?``:this.workspacePath(),this.folderSelectedByUser=!1),this.worktree=t&&this.usesCustomFolder(),this.closeBrowser(),this.branchesMatchCurrentRepo()||this.maybeLoadBranches()}selectCloudProfile(e){this.submitting||this.pendingCloud.sessionKey||!this.worktreeAvailable()||!this.cloudProfiles.some(t=>t.id===e)||(this.cloudProfileId=e,this.error=null,this.worktree=!0,this.closeBrowser(),this.branchesMatchCurrentRepo()||this.maybeLoadBranches())}browseAvailable(){return this.isAdmin()}nodeBrowseBlockedReason(e){if(!e.canBrowse)return e.connected?T(`newSession.nodeCannotBrowse`):T(`newSession.nodeOffline`)}closeBrowser(){this.browserRequestToken+=1,this.browserOpen=!1,this.browserLoading=!1,this.browserError=null,this.browserListing=null,this.browserTarget=null,this.browserPathDraft=``;let e=this.querySelector(`.new-session-page__select--folder`);e&&(e.open=!1)}closeWherePopover(){this.wherePopoverOpen=!1;let e=this.querySelector(`.new-session-page__where-popover`);e&&(e.open=!1)}closeAgentPopover(){this.agentPopoverOpen=!1;let e=this.querySelector(`.new-session-page__agent-popover`);e&&(e.open=!1)}guardPopoverTransition(e,t){t&&(e.preventDefault(),e.stopImmediatePropagation())}restorePopoverTrigger(e,t){let n=this.ownerDocument.activeElement,r=this.querySelector(t);n&&n!==this.ownerDocument.body&&!r?.contains(n)||this.querySelector(`#${e}`)?.focus()}showBrowserRoot(){this.browserRequestToken+=1,this.browserLoading=!1,this.browserError=null,this.browserListing=null,this.browserTarget=null,this.browserPathDraft=``}usableBrowserPath(){let e=this.browserPathDraft.trim();return e.length===0?``:Tt(e)?e:null}selectBrowserTarget(e){let t=this.folder.trim(),n=e.nodeId===this.execNode&&Tt(t)?t:void 0;this.browserTarget=e,this.loadBrowser(n)}loadBrowser(e){let t=this.context?.gateway.snapshot,n=t?.client,r=this.browserTarget;if(!t?.connected||!n||!r)return;let i=this.nodes.find(e=>e.nodeId===r.nodeId);if(i?.canExec&&!i.canBrowse){this.showBrowserRoot(),this.browserTarget=r,this.browserPathDraft=e??``;return}let a=++this.browserRequestToken;this.browserLoading=!0,this.browserError=null,this.browserListing=null,this.browserPathDraft=e??``;let o=this.browserPathDraft;n.request(`fs.listDir`,{...e?{path:e}:{},...r.nodeId?{nodeId:r.nodeId}:{}}).then(e=>{a===this.browserRequestToken&&(this.browserListing=e??null,e?.path&&this.browserPathDraft===o&&(this.browserPathDraft=e.path))}).catch(()=>{if(a===this.browserRequestToken){if(e){this.loadBrowser(void 0);return}this.browserError=T(`newSession.browserLoadFailed`)}}).finally(()=>{a===this.browserRequestToken&&(this.browserLoading=!1)})}renderBrowser(){return xt({open:this.browserOpen,listing:this.browserListing,target:this.browserTarget,nodes:this.nodes,loading:this.browserLoading,error:this.browserError,pathDraft:this.browserPathDraft,usablePath:this.usableBrowserPath(),onPathDraftChange:e=>{this.browserPathDraft=e},onNavigate:e=>this.loadBrowser(e),onShowRoot:()=>this.showBrowserRoot(),onClose:()=>this.closeBrowser(),onSelectTarget:e=>this.selectBrowserTarget(e),nodeBlockedReason:e=>this.nodeBrowseBlockedReason(e),onApplyFolder:(e,t)=>this.applyFolder(e,t)})}renderAgentSelect(e){return kt({agents:e,agentId:this.agentId,disabled:this.submitting||!!this.pendingCloud.sessionKey,popoverOpen:this.agentPopoverOpen,popoverHiding:this.agentPopoverHiding,onGuardTransition:e=>this.guardPopoverTransition(e,this.agentPopoverHiding),onPopoverOpenChange:e=>{this.agentPopoverOpen=e},onPopoverHidingChange:e=>{this.agentPopoverHiding=e},onRestoreTrigger:()=>this.restorePopoverTrigger(`new-session-agent-trigger`,`.new-session-page__agent-popover`),onSelect:e=>this.selectAgentId(e)})}renderWhereSelect(){let e=this.execNodes(),t=i(this.data)?[]:this.cloudProfiles;return At({execNodes:this.isAdmin()?e:[],cloudProfiles:this.isAdmin()?t:[],cloudProfileId:this.cloudProfileId,execNode:this.execNode,syncFolder:this.folder.trim()||this.workspacePath(),worktree:this.worktree,worktreeAvailable:this.worktreeAvailable(),cloudDisabledReason:this.cloudRuntimeUnsupportedReason(),customFolder:this.usesCustomFolder(),branches:this.branches,branchesLoading:this.branchesLoading,baseRef:this.baseRef,worktreeName:this.worktreeName,submitting:this.submitting,pendingCloud:!!this.pendingCloud.sessionKey,showTargets:this.isAdmin()&&(e.length>0||t.length>0||!!this.cloudProfileId),popoverOpen:this.wherePopoverOpen,popoverHiding:this.wherePopoverHiding,onGuardTransition:e=>this.guardPopoverTransition(e,this.wherePopoverHiding),onPopoverOpenChange:e=>{this.wherePopoverOpen=e},onPopoverHidingChange:e=>{this.wherePopoverHiding=e},onRestoreTrigger:()=>this.restorePopoverTrigger(`new-session-where-trigger`,`.new-session-page__where-popover`),onSelectExecNode:e=>this.selectExecNode(e),onSelectCloudProfile:e=>this.selectCloudProfile(e),onToggleWorktree:()=>{this.cloudProfileId||(this.worktree=!this.worktree,this.worktree&&this.maybeLoadBranches())},onBaseRefInput:e=>{this.submitting||(this.baseRefEditGeneration+=1,this.baseRef=e)},onWorktreeNameInput:e=>{this.submitting||(this.worktreeName=e)}})}renderFolderSelect(){return jt({browseAvailable:this.browseAvailable(),folder:this.folder,execNode:this.execNode,workspace:this.workspacePath(),browserOpen:this.browserOpen,popoverHiding:this.folderPopoverHiding,submitting:this.submitting,pendingCloud:!!this.pendingCloud.sessionKey,browser:this.renderBrowser(),onGuardTransition:e=>this.guardPopoverTransition(e,this.folderPopoverHiding),onShow:()=>{this.browserOpen=!0,this.showBrowserRoot()},onHide:()=>{this.folderPopoverHiding=!0,this.browserOpen&&this.closeBrowser()},onAfterHide:()=>{this.folderPopoverHiding=!1,this.restorePopoverTrigger(`new-session-folder-trigger`,`.new-session-page__select--folder`)}})}renderTargetBar(){let e=this.agents();return o({data:this.data,agentSelect:e.length>1?this.renderAgentSelect(e):g,folderSelect:this.renderFolderSelect(),whereSelect:this.renderWhereSelect(),retrying:this.catalogRetrying,onRetry:this.handleCatalogRetry})}renderDraftBlock(){let e=this.worktree&&!q(this.worktreeName);return f`
      <div class="new-session-page__draft" aria-busy=${String(this.submitting)}>
        ${this.renderTargetBar()}
        ${e?Z(T(`newSession.worktreeNameInvalid`)):g}
        ${this.error?Z(this.error):g}
        ${this.submissionOutcomeUnknown?Z(T(`newSession.createOutcomeUnknown`)):g}
        ${gt({agent:this.selectedAgent(),agentId:this.agentId,attachmentDraft:this.attachmentDraft,canSubmit:this.canSubmit(),context:this.context,isCatalogTarget:i(this.data),message:this.message,modelControl:this.modelControl,requiresModifier:ge().chatSendShortcut===`modifier-enter`,submitting:this.submitting,messageLocked:!!this.pendingCloud.sessionKey,onInput:e=>{!this.submitting&&!this.pendingCloud.sessionKey&&(this.message=e)},onSubmit:()=>void this.submit()})}
      </div>
    `}renderWelcome(){let e=this.selectedAgent(),t=e?.identity,n=this.context?.gateway.snapshot;return ke({assistantName:t?.name??e?.name??e?.id??``,assistantAvatar:t?.avatar??t?.emoji??null,assistantAvatarUrl:t?.avatarUrl??null,hint:T(`newSession.hint`),composer:this.renderDraftBlock(),sessions:this.context?.sessions.state.result,sessionKey:te({agentId:this.agentId||`main`,mainKey:this.context?.agents.state.agentsList?.mainKey}),sessionHost:{assistantAgentId:n?.assistantAgentId??null,agentsList:this.context?.agents.state.agentsList??null,hello:n?.hello??null},onDraftChange:e=>{!this.submitting&&!this.pendingCloud.sessionKey&&(this.message=e)},onSend:()=>void this.submit(),onOpenSession:e=>{this.submitting||this.pendingCloud.sessionKey||(this.context?.gateway.setSessionKey(e),this.context?.navigate(`chat`,{search:le(e)}))}})}render(){return f`
      <div class="new-session-page">
        <div
          class="new-session-page__scroll"
          ?inert=${this.submitting}
          aria-busy=${String(this.submitting)}
          @mousedown=${_e}
        >
          ${this.renderWelcome()}
        </div>
      </div>
    `}},t([p({attribute:!1})],$.prototype,`data`,void 0),t([d({context:ve,subscribe:!0})],$.prototype,`context`,void 0),t([h()],$.prototype,`agentId`,void 0),t([h()],$.prototype,`folder`,void 0),t([h()],$.prototype,`worktree`,void 0),t([h()],$.prototype,`worktreeName`,void 0),t([h()],$.prototype,`baseRef`,void 0),t([h()],$.prototype,`branches`,void 0),t([h()],$.prototype,`branchesLoading`,void 0),t([h()],$.prototype,`nodes`,void 0),t([h()],$.prototype,`execNode`,void 0),t([h()],$.prototype,`cloudProfiles`,void 0),t([h()],$.prototype,`cloudProfilesHydrated`,void 0),t([h()],$.prototype,`cloudProfileId`,void 0),t([h()],$.prototype,`message`,void 0),t([h()],$.prototype,`submitting`,void 0),t([h()],$.prototype,`submissionOutcomeUnknown`,void 0),t([h()],$.prototype,`error`,void 0),t([h()],$.prototype,`catalogRetrying`,void 0),t([h()],$.prototype,`browserOpen`,void 0),t([h()],$.prototype,`browserLoading`,void 0),t([h()],$.prototype,`browserError`,void 0),t([h()],$.prototype,`browserListing`,void 0),t([h()],$.prototype,`browserTarget`,void 0),t([h()],$.prototype,`wherePopoverOpen`,void 0),t([h()],$.prototype,`wherePopoverHiding`,void 0),t([h()],$.prototype,`agentPopoverOpen`,void 0),t([h()],$.prototype,`agentPopoverHiding`,void 0),t([h()],$.prototype,`folderPopoverHiding`,void 0),t([h()],$.prototype,`browserPathDraft`,void 0),customElements.get(`openclaw-new-session-page`)||customElements.define(`openclaw-new-session-page`,$)}))();
//# sourceMappingURL=new-session-page-CceUiwxc.js.map