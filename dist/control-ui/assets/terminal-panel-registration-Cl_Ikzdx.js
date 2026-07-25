const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./browser-Dzpv0Z88.js","./rolldown-runtime-DaJ6WEGw.js","./control-ui-foundation-43q8Lf_T.js","./control-ui-foundation-DQl2NL7K.js","./lit-runtime-CE4wpvNA.js","./control-ui-foundation-DFIFKu9N.js","./ghostty-web-Bg4ocL01.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{h as t,l as n,m as r,u as i}from"./control-ui-foundation-43q8Lf_T.js";import{$ as a,G as o,J as s,U as c,X as l,it as u,tt as d,z as f}from"./lit-runtime-CE4wpvNA.js";import{Ni as p,Pi as m}from"./control-ui-core-Dx4utKSD.js";import{o as h,t as g}from"./control-ui-core-CXeSrnoQ.js";import{J as ee,K as _,Y as te}from"./control-ui-core-vPyynwls.js";import{n as ne,t as re}from"./dock-panel-layout-BeKwwc_p.js";import{n as ie,r as ae,t as v}from"./panel-tab-strip-BRztu7pe.js";var y,b=e((()=>{y=class{constructor(e,t,n=()=>1){this.capacity=e,this.overflow=t,this.measure=n,this.values=[],this.size=0,this.closed=!1}push(e){if(this.closed)return!1;let t=this.measure(e);if(this.size+t<=this.capacity)return this.values.push(e),this.size+=t,!0;if(this.overflow.mode===`latch`)return this.closed=!0,!1;if(this.overflow.mode===`fail-closed`)return this.values=[],this.size=0,this.closed=!0,this.overflow.onOverflow(),!1;for(this.values.push(e),this.size+=t;this.size>this.capacity&&this.values.length>1;)this.size-=this.measure(this.values.shift());if(this.size>this.capacity){let t=this.overflow.fit?.(e,this.capacity);this.values=t===void 0?[]:[t],this.size=t===void 0?0:this.measure(t)}return!0}drain(){let e=this.values;return this.values=[],this.size=0,e}}}));function x(e){return e instanceof Error&&/^gateway request timed out after \d+ms: terminal\.open$/u.test(e.message)}function oe(e){return e instanceof Error&&(e.message===`terminal open timed out`||x(e))}var S,C,w,T,E,D,O,se=e((()=>{b(),S=2e4,C=5e3,w=2,T=5e3,E=35e3,D=class extends Error{constructor(e){super(`terminal open timed out`,{cause:e}),this.name=`TerminalOpenTimeoutError`}},O=class e{static{this.MAX_PENDING_EVENTS=512}constructor(e){this.streams=new Map,this.pending=new Map,this.unsubscribe=null,this.pendingOpenCount=0,this.livenessTimer=null,this.livenessProbeInFlight=!1,this.livenessProbeFailures=0,this.lastLivenessFailureActivityVersion=null,this.lastTerminalActivityAtMs=Date.now(),this.inboundActivityVersion=0,this.client=e}ensureSubscribed(){this.unsubscribe||=this.client.addEventListener(e=>{if(e.event===`terminal.data`){this.noteTerminalActivity();let t=e.payload;if(t?.sessionId&&typeof t.seq==`number`&&typeof t.data==`string`){let e={kind:`data`,seq:t.seq,data:t.data},n=this.streams.get(t.sessionId);n?this.deliverData(t.sessionId,n,e):this.bufferEarly(t.sessionId,e)}return}if(e.event===`terminal.exit`){this.noteTerminalActivity();let t=e.payload;if(t?.sessionId){let e={exitCode:t.exitCode??null,signal:t.signal??null,reason:t.reason,error:t.error},n=this.streams.get(t.sessionId);n?n.recovering?this.bufferEarly(t.sessionId,{kind:`exit`,info:e}):this.deliverExit(t.sessionId,n.sink,e):this.bufferEarly(t.sessionId,{kind:`exit`,info:e})}}})}async open(e,t){let n;try{n=await this.requestWhileHoldingStream(()=>this.client.request(`terminal.open`,e,{timeoutMs:E}))}catch(e){throw oe(e)?(x(e)&&this.forceReconnect(`terminal open watchdog timeout`),new D(e)):e}return this.adoptSession(n.sessionId,t,{seqMode:`unknown`,expectedSeq:0}),n}async attach(e,t){let n=await this.requestWhileHoldingStream(()=>this.client.request(`terminal.attach`,{sessionId:e})),r=typeof n.seq==`number`&&Number.isSafeInteger(n.seq)?n.seq:null;return this.adoptSession(e,t,r===null?{seqMode:`counter`,expectedSeq:null}:{seqMode:`offset`,expectedSeq:r},n.buffer,r??void 0),n}async list(){return(await this.client.request(`terminal.list`))?.sessions??[]}async requestWhileHoldingStream(e){this.ensureSubscribed(),this.pendingOpenCount+=1;try{let t=await e();return--this.pendingOpenCount,t}catch(e){throw--this.pendingOpenCount,this.maybeUnsubscribe(),e}}adoptSession(e,t,n,r,i){let a={sink:t,...n,recovering:!1};this.streams.set(e,a),this.lastTerminalActivityAtMs=Date.now(),r!==void 0&&(t.onReplay?t.onReplay(r,r.length):t.onData(r)),this.flushPending(e,a,i,r!==void 0),this.scheduleLivenessCheck()}deliverData(e,t,n){if(t.recovering){this.bufferEarly(e,n);return}if(!Number.isSafeInteger(n.seq)){this.recoverGap(e,t,n);return}if(t.seqMode===`counter`){t.expectedSeq=n.seq+1,t.sink.onData(n.data);return}if(n.seq-n.data.length===t.expectedSeq){n.data.length>0&&(t.seqMode=`offset`),t.expectedSeq=n.seq,t.sink.onData(n.data);return}if(t.seqMode===`unknown`&&t.expectedSeq===0&&n.seq===0){t.seqMode=`counter`,t.expectedSeq=1,t.sink.onData(n.data);return}this.recoverGap(e,t,n)}recoverGap(e,t,n){t.recovering||(t.recovering=!0,this.client.request(`terminal.attach`,{sessionId:e}).then(r=>{if(this.streams.get(e)!==t)return;let i=typeof r.seq==`number`&&Number.isSafeInteger(r.seq)?r.seq:null;if(i===null){t.seqMode=`counter`,t.expectedSeq=null,t.recovering=!1,this.deliverData(e,t,n),this.flushPending(e,t,void 0,!0);return}let a=t.expectedSeq;if(t.seqMode=`offset`,t.expectedSeq=i,!t.sink.onReplay){t.recovering=!1,this.pending.delete(e),this.forceReconnect(`terminal replay reset unavailable`);return}let o=i-r.buffer.length,s=typeof a==`number`?Math.max(0,Math.min(r.buffer.length,a-o)):0;t.sink.onReplay(r.buffer,s),t.recovering=!1,this.flushPending(e,t,i,!0)}).catch(()=>{if(this.streams.get(e)!==t)return;let r=this.pending.get(e)?.drain();if(r?.some(e=>e.kind===`exit`)){this.pending.delete(e),t.recovering=!1,t.sink.onData(n.data);for(let n of r)if(n.kind===`data`)t.sink.onData(n.data);else{this.deliverExit(e,t.sink,n.info);break}return}t.recovering=!1,this.pending.delete(e),this.forceReconnect(`terminal replay failed`)}))}flushPending(e,t,n,r=!1){let i=this.pending.get(e);if(!i)return;this.pending.delete(e);let a=i.drain();for(let i of a){if(this.streams.get(e)!==t)break;if(!(r&&i.kind===`exit`&&i.info.reason===`detached`))if(i.kind===`data`){if(n!==void 0&&i.seq<=n)continue;this.deliverData(e,t,i)}else t.recovering?this.bufferEarly(e,i):this.deliverExit(e,t.sink,i.info)}}deliverExit(e,t,n){t.onExit(n),this.streams.delete(e),this.pending.delete(e),this.maybeUnsubscribe()}bufferEarly(t,n){let r=this.pending.get(t)??new y(e.MAX_PENDING_EVENTS,{mode:`drop-oldest`});this.pending.set(t,r),r.push(n)}noteTerminalActivity(){this.resetLivenessProbeFailures(),this.lastTerminalActivityAtMs=Date.now(),this.inboundActivityVersion+=1}forceReconnect(e){this.resetLivenessProbeFailures(),this.client.forceReconnect(e)}resetLivenessProbeFailures(){this.livenessProbeFailures=0,this.lastLivenessFailureActivityVersion=null}scheduleLivenessCheck(e=S){this.livenessTimer||this.livenessProbeInFlight||this.streams.size===0||(this.livenessTimer=setTimeout(()=>{this.livenessTimer=null,this.checkLiveness()},Math.max(0,e)))}checkLiveness(){if(this.streams.size===0)return;let e=S-(Date.now()-this.lastTerminalActivityAtMs);if(e>0){this.scheduleLivenessCheck(e);return}let t=this.client.inboundActivitySeq??this.inboundActivityVersion;if(this.lastLivenessFailureActivityVersion!==null&&t!==this.lastLivenessFailureActivityVersion){this.resetLivenessProbeFailures(),this.lastTerminalActivityAtMs=Date.now(),this.scheduleLivenessCheck();return}let n=S;this.livenessProbeInFlight=!0,this.client.request(`terminal.list`,void 0,{timeoutMs:C}).then(()=>{this.resetLivenessProbeFailures(),this.lastTerminalActivityAtMs=Date.now()}).catch(()=>{if(this.streams.size===0){this.resetLivenessProbeFailures();return}let e=this.client.inboundActivitySeq??this.inboundActivityVersion;if(e!==t){this.resetLivenessProbeFailures(),this.lastTerminalActivityAtMs=Date.now();return}if(this.livenessProbeFailures+=1,this.lastLivenessFailureActivityVersion=e,this.livenessProbeFailures>=w){this.forceReconnect(`terminal liveness timeout`);return}n=T}).finally(()=>{this.livenessProbeInFlight=!1,this.scheduleLivenessCheck(n)})}async input(e,t){await this.client.request(`terminal.input`,{sessionId:e,data:t}).catch(()=>void 0)}async resize(e,t,n){await this.client.request(`terminal.resize`,{sessionId:e,cols:t,rows:n}).catch(()=>void 0)}async close(e){this.streams.delete(e),this.pending.delete(e),await this.client.request(`terminal.close`,{sessionId:e}).catch(()=>void 0),this.pending.delete(e),this.maybeUnsubscribe()}get size(){return this.streams.size}dispose(){this.streams.clear(),this.pending.clear(),this.stopLiveness(),this.dropSubscriptions()}maybeUnsubscribe(){this.streams.size===0&&this.pendingOpenCount===0&&(this.pending.clear(),this.stopLiveness(),this.dropSubscriptions())}stopLiveness(){this.resetLivenessProbeFailures(),this.livenessTimer&&=(clearTimeout(this.livenessTimer),null)}dropSubscriptions(){this.unsubscribe?.(),this.unsubscribe=null}}})),k,ce=e((()=>{s(),k=u`
  :host {
    position: fixed;
    z-index: 60;
    color: var(--text, #d7dae0);
    font-family: var(--font-sans, system-ui, sans-serif);
  }
  .tp {
    position: fixed;
    display: flex;
    flex-direction: column;
    background: var(--bg, #0e1015);
    overflow: hidden;
  }
  .tp--bottom {
    left: var(--shell-nav-width, 0);
    right: 0;
    bottom: 0;
    border-top: 1px solid var(--border, #262b34);
    --tp-session-menu-max-height: calc(var(--tp-panel-height) - 44px);
  }
  .tp--right {
    top: var(--shell-topbar-height, 0);
    right: 0;
    bottom: 0;
    border-left: 1px solid var(--border, #262b34);
    --tp-session-menu-max-height: calc(100dvh - var(--shell-topbar-height, 0px) - 44px);
  }
  .tp--fullscreen {
    inset: 0;
  }
  .tp-resizer {
    position: absolute;
    z-index: 2;
    background: transparent;
  }
  .tp-resizer:hover {
    background: var(--accent, #ff5c5c);
    opacity: 0.5;
  }
  .tp-resizer--bottom {
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    cursor: ns-resize;
  }
  .tp-resizer--right {
    top: 0;
    bottom: 0;
    left: 0;
    width: 5px;
    cursor: ew-resize;
  }
  .tp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0 6px 0 4px;
    border-bottom: 1px solid var(--border, #262b34);
    background: var(--bg, #0e1015);
    min-height: 36px;
  }
  .tp-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: none;
    background: transparent;
    color: var(--muted, #8a919e);
    border-radius: 6px;
    padding: 0;
  }
  .tp-icon:hover {
    background: color-mix(in srgb, var(--text, #d7dae0) 12%, transparent);
    color: var(--text, #d7dae0);
  }
  .tp-icon.is-active {
    color: var(--text, #d7dae0);
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
  }
  .tp-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    padding-left: 6px;
  }
  .tp-session-picker {
    position: relative;
  }
  .tp-session-menu {
    position: absolute;
    z-index: 4;
    top: 31px;
    right: 0;
    width: min(360px, calc(100vw - 24px));
    max-height: min(420px, var(--tp-session-menu-max-height));
    overflow-y: auto;
    border: 1px solid var(--border, #262b34);
    border-radius: 8px;
    background: var(--bg, #0e1015);
    box-shadow: 0 12px 30px rgb(0 0 0 / 35%);
    padding: 6px;
  }
  .tp-session-menu__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 6px 7px;
    color: var(--text, #d7dae0);
    font-size: 12px;
    font-weight: 600;
  }
  .tp-session-refresh {
    border: 0;
    background: transparent;
    color: var(--accent, #ff5c5c);
    font: inherit;
    font-weight: 500;
    padding: 2px 4px;
  }
  .tp-session {
    display: grid;
    grid-template-columns: minmax(70px, auto) minmax(100px, 1fr) auto;
    align-items: center;
    gap: 8px;
    width: 100%;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text, #d7dae0);
    padding: 7px 8px;
    text-align: left;
  }
  .tp-session:not(:disabled):hover,
  .tp-session:not(:disabled):focus-visible {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
  }
  .tp-session:disabled {
    opacity: 0.55;
  }
  .tp-session__agent {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    font-weight: 600;
  }
  .tp-session__cwd {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--muted, #8a919e);
    font:
      11px ui-monospace,
      SFMono-Regular,
      "SF Mono",
      Menlo,
      Consolas,
      "Liberation Mono",
      monospace;
  }
  .tp-session__state {
    color: var(--muted, #8a919e);
    font-size: 11px;
    white-space: nowrap;
  }
  .tp-session-empty {
    padding: 10px 8px;
    color: var(--muted, #8a919e);
    font-size: 12px;
  }
  .tp-viewport {
    position: relative;
    flex: 1;
    min-height: 0;
    background: var(--bg, #0e1015);
  }
  .tp-host {
    position: absolute;
    inset: 0;
    z-index: 0;
    padding: 6px 8px;
    caret-color: transparent;
  }
  .tp-connecting {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--muted, #8a919e);
    background: color-mix(in srgb, var(--bg, #0e1015) 88%, transparent);
    font-size: 12px;
    pointer-events: none;
  }
  .tp-connecting__spinner {
    width: 16px;
    height: 16px;
    border: 2px solid color-mix(in srgb, var(--accent, #ff5c5c) 24%, transparent);
    border-top-color: var(--accent, #ff5c5c);
    border-radius: 50%;
    animation: tp-spin 0.8s linear infinite;
  }
  .tp-empty,
  .tp-error {
    padding: 10px 12px;
    font-size: 12px;
    color: var(--muted, #8a919e);
  }
  .tp-error {
    color: var(--danger, #ff6b6b);
  }
  @keyframes tp-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .tp-connecting__spinner {
      animation: none;
    }
  }
`}));function le(e){return e.shellName??h(`terminal.tabLabel`,{n:String(e.sequence)})}function ue(e){return e.agentId===null||e.cwd===null?null:h(`terminal.tabHint`,{agent:e.agentId,cwd:e.cwd})}function de(e){return e.status===`connecting`?h(`terminal.connecting`):e.status===`exited`?e.exitReason===`detached`?h(`terminal.detached`):e.exitReason===`process_exit`&&typeof e.exitCode==`number`?h(`terminal.exitedCode`,{code:String(e.exitCode)}):h(`terminal.exited`):null}function fe(e){return ae({tabs:e.tabs.map(e=>{let t=le(e);return{id:e.id,domId:`terminal-tab-${e.id}`,label:t,title:ue(e),icon:A,statusLabel:de(e),badge:e.agentOwned?h(`terminal.agentOwnedBadge`):null,className:`is-${e.status}`,closeLabel:`${h(`terminal.closeSession`)}: ${t}`}}),activeId:e.activeId,ariaControls:`terminal-tab-panel`,onSelect:e.onSelect,onClose:e.onClose,onNew:e.onNew,newLabel:h(`terminal.newSession`),newDisabled:e.booting})}var A,pe=e((()=>{s(),g(),v(),A=d`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4l3 3-3 3M8 11h5" /></svg>`})),j,me=e((()=>{s(),j=u`
  .tp-icon:disabled {
    opacity: 0.35;
    pointer-events: none;
  }
  .tp-file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .tp-drop-overlay {
    position: absolute;
    z-index: 4;
    inset: 8px;
    display: grid;
    place-items: center;
    border: 1px dashed var(--accent, #ff5c5c);
    background: color-mix(in srgb, var(--bg, #0e1015) 88%, var(--accent, #ff5c5c));
    color: var(--text, #d7dae0);
    font-size: 13px;
    pointer-events: none;
  }
  .tp-upload-card {
    position: absolute;
    z-index: 5;
    right: 10px;
    bottom: 10px;
    width: min(300px, calc(100% - 20px));
    box-sizing: border-box;
    padding: 9px 10px 10px;
    border: 1px solid var(--border, #262b34);
    border-radius: 7px;
    background: color-mix(in srgb, var(--bg, #0e1015) 94%, var(--text, #d7dae0));
    box-shadow: 0 8px 24px rgb(0 0 0 / 28%);
    color: var(--text, #d7dae0);
    font-size: 11px;
  }
  .tp-upload-card--failed {
    border-color: color-mix(in srgb, var(--danger, #ff6b6b) 55%, var(--border, #262b34));
  }
  .tp-upload-card__header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .tp-upload-card__copy {
    flex: 1;
    min-width: 0;
  }
  .tp-upload-card__title {
    color: var(--text, #d7dae0);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .tp-upload-card--failed .tp-upload-card__title,
  .tp-upload-card__error {
    color: var(--danger, #ff6b6b);
  }
  .tp-upload-card__file {
    margin-top: 2px;
    overflow: hidden;
    color: var(--muted, #8a919e);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tp-upload-card__error {
    margin-top: 6px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
  .tp-upload-card__actions {
    display: flex;
    gap: 4px;
  }
  .tp-upload-card__action {
    margin: -3px 0;
    padding: 3px 5px;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: var(--muted, #8a919e);
    font: inherit;
    cursor: pointer;
  }
  .tp-upload-card__action:hover {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
    color: var(--text, #d7dae0);
  }
  .tp-upload-card__action:focus-visible {
    outline: 1px solid var(--accent, #ff5c5c);
    outline-offset: 1px;
  }
  .tp-upload-retry {
    color: var(--accent, #ff5c5c);
  }
  .tp-upload-progress {
    position: relative;
    height: 3px;
    margin-top: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: color-mix(in srgb, var(--border, #262b34) 72%, transparent);
  }
  .tp-upload-progress__fill,
  .tp-upload-progress__activity {
    position: absolute;
    inset-block: 0;
    left: 0;
    border-radius: inherit;
    background: var(--accent, #ff5c5c);
  }
  .tp-upload-progress__fill {
    transition: width 180ms ease-out;
  }
  .tp-upload-progress__activity {
    width: 26%;
    opacity: 0.7;
    animation: tp-upload-progress 1.15s ease-in-out infinite;
  }
  .tp-upload-card--failed .tp-upload-progress__fill {
    background: var(--danger, #ff6b6b);
  }
  @keyframes tp-upload-progress {
    from {
      transform: translateX(-110%);
    }
    to {
      transform: translateX(385%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .tp-upload-progress__activity {
      animation: none;
      transform: none;
    }
  }
`}));async function he(e,t,n,r){let i={sessionId:t,...n};return await(r?e.request(`terminal.upload`,i,{signal:r}):e.request(`terminal.upload`,i))}async function ge(e){if(e.size>M)throw Error(`File exceeds the 16 MiB terminal upload limit: ${e.name}`);let t=new Uint8Array(await e.arrayBuffer()),n=[],r=32*1024;for(let e=0;e<t.length;e+=r)n.push(String.fromCharCode(...t.subarray(e,e+r)));return btoa(n.join(``))}function _e(e,t){let n=t.split(/[\\/]/u).pop()?.toLowerCase()??``;if(/^(?:pwsh|powershell)(?:\.exe)?$/u.test(n))return`'${e.replaceAll(`'`,`''`)}'`;if(/^cmd(?:\.exe)?$/u.test(n)){if(/[%!]/u.test(e))throw Error(`Cannot safely insert an uploaded path containing % or ! into cmd.exe`);return`"${e.replaceAll(`"`,`""`)}"`}if(!/^(?:(?:ba|da|a|k|z)?sh|fish)(?:\.exe)?$/u.test(n))throw Error(`Cannot safely insert an uploaded path into unsupported shell: ${n||t}`);return/^[A-Za-z0-9_@%+=:,./-]+$/u.test(e)?e:`'${e.replaceAll(`'`,`'\\''`)}'`}var M,ve=e((()=>{M=16*1024*1024}));function ye(e){if(typeof e==`object`&&e&&`retryable`in e){let t=e;return t.gatewayCode===`UNAVAILABLE`||t.code===`UNAVAILABLE`?!0:t.retryable===!0}return!0}function be(e){return a`<div class="tp-actions">
    <input
      class="tp-file-input"
      type="file"
      multiple
      aria-hidden="true"
      tabindex="-1"
      @change=${e.upload.handleFileSelection}
    />
    <button
      class="tp-icon tp-upload"
      type="button"
      title=${h(`terminal.addFiles`)}
      aria-label=${h(`terminal.addFiles`)}
      ?disabled=${e.upload.hasPendingBatch()||!e.upload.hasActiveTab()}
      @click=${e.upload.chooseFiles}
    >
      ${L}
    </button>
    ${e.fullscreen?l:a`${e.sessionPicker}<button
            class="tp-icon ${e.dock===`bottom`?`is-active`:``}"
            type="button"
            title=${h(`terminal.dockBottom`)}
            aria-label=${h(`terminal.dockBottom`)}
            @click=${()=>e.onDock(`bottom`)}
          >
            ${F}
          </button>
          <button
            class="tp-icon ${e.dock===`right`?`is-active`:``}"
            type="button"
            title=${h(`terminal.dockRight`)}
            aria-label=${h(`terminal.dockRight`)}
            @click=${()=>e.onDock(`right`)}
          >
            ${I}
          </button>
          <button
            class="tp-icon"
            type="button"
            title=${h(`terminal.hide`)}
            aria-label=${h(`terminal.hide`)}
            @click=${e.onHide}
          >
            ${P}
          </button>`}
  </div>`}function N(e){let t=e.progress;return a`${e.dragActive?a`<div class="tp-drop-overlay">${h(`terminal.dropFiles`)}</div>`:l}
  ${t?a`<div
        class="tp-upload-card ${t.state===`failed`?`tp-upload-card--failed`:``}"
        role=${t.state===`failed`?`alert`:`status`}
        aria-live=${t.state===`failed`?`assertive`:`polite`}
      >
        <div class="tp-upload-card__header">
          <div class="tp-upload-card__copy">
            <div class="tp-upload-card__title">
              ${t.state===`failed`?h(`terminal.uploadFailed`):h(`terminal.uploadProgress`,{current:String(t.current),total:String(t.total)})}
            </div>
            <div class="tp-upload-card__file">${t.fileName}</div>
          </div>
          <div class="tp-upload-card__actions">
            ${t.state===`failed`&&t.retryable?a`<button
                  class="tp-upload-card__action tp-upload-retry"
                  type="button"
                  @click=${e.retry}
                >
                  ${h(`terminal.retryUpload`)}
                </button>`:l}
            <button
              class="tp-upload-card__action tp-upload-cancel"
              type="button"
              @click=${e.cancel}
            >
              ${h(`common.cancel`)}
            </button>
          </div>
        </div>
        <div
          class="tp-upload-progress"
          role="progressbar"
          aria-label=${t.state===`failed`?h(`terminal.uploadFailed`):h(`terminal.uploadProgress`,{current:String(t.current),total:String(t.total)})}
          aria-valuemin="0"
          aria-valuemax=${String(t.total)}
          aria-valuenow=${String(t.completed)}
        >
          <span
            class="tp-upload-progress__fill"
            style=${`width:${t.completed/t.total*100}%`}
          ></span>
          ${t.state===`uploading`?a`<span class="tp-upload-progress__activity"></span>`:l}
        </div>
        ${t.error?a`<div class="tp-upload-card__error">${t.error}</div>`:l}
      </div>`:l}`}var P,F,I,L,R,xe=e((()=>{s(),g(),ve(),P=d`<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>`,F=d`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M2 10h12" /></svg>`,I=d`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M10 2.5v11" /></svg>`,L=d`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5.2 8.1 9.8 3.5a2.5 2.5 0 0 1 3.5 3.5l-6 6a3.5 3.5 0 0 1-5-5l5.8-5.8" /><path d="m4.4 9 5.2-5.2a1.4 1.4 0 0 1 2 2l-5.3 5.3a2.3 2.3 0 0 1-3.2-3.2l4.6-4.6" /></svg>`,R=class{constructor(e){this.host=e,this.dragActive=!1,this.batch=null,this.dragDepth=0,this.chooseFiles=()=>{this.host.fileInput()?.click()},this.handleFileSelection=e=>{let t=e.currentTarget,n=Array.from(t.files??[]);t.value=``,this.uploadFiles(n)},this.handleDragEnter=e=>{!this.hasDraggedFiles(e)||!this.hasActiveTab()||this.hasPendingBatch()||(e.preventDefault(),this.dragDepth+=1,this.dragActive=!0,this.host.requestUpdate())},this.handleDragOver=e=>{!this.hasDraggedFiles(e)||!this.hasActiveTab()||this.hasPendingBatch()||(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`))},this.handleDragLeave=e=>{this.hasDraggedFiles(e)&&(this.dragDepth=Math.max(0,this.dragDepth-1),this.dragDepth===0&&(this.dragActive=!1,this.host.requestUpdate()))},this.handleDrop=e=>{this.hasDraggedFiles(e)&&(e.preventDefault(),this.dragDepth=0,this.dragActive=!1,this.host.requestUpdate(),!this.hasPendingBatch()&&this.uploadFiles(Array.from(e.dataTransfer?.files??[])))},this.retry=()=>{let e=this.batch;if(!(!e||e.state!==`failed`||!e.retryable)){if(!this.host.isCurrent(e.tab)||!this.host.client()){this.cancelBatch(e);return}e.state=`uploading`,e.error=null,e.retryable=!1,e.abortController=new AbortController,this.host.requestUpdate(),this.runBatch(e)}},this.cancel=()=>{let e=this.batch;e&&this.cancelBatch(e)}}hasActiveTab(){return!!this.host.activeTab()}hasPendingBatch(){return this.batch!==null}get progress(){let e=this.batch;if(!e)return null;let t=e.files.length,n=Math.min(e.nextIndex,t-1);return{completed:e.nextIndex,current:n+1,error:e.error,fileName:e.files[n]?.name??``,retryable:e.retryable,state:e.state,total:t}}hasDraggedFiles(e){return Array.from(e.dataTransfer?.types??[]).includes(`Files`)}uploadFiles(e){let t=this.host.activeTab();if(e.length===0||!t||!this.host.client()||this.hasPendingBatch())return;this.host.setError(null);let n={tab:t,files:e,paths:[],nextIndex:0,state:`uploading`,error:null,retryable:!1,abortController:new AbortController};this.batch=n,this.host.requestUpdate(),this.runBatch(n)}isActive(e){return this.batch===e&&!e.abortController.signal.aborted}ensureCurrent(e){return this.isActive(e)?this.host.isCurrent(e.tab)?!0:(this.cancelBatch(e),!1):!1}failBatch(e,t,n){this.ensureCurrent(e)&&(e.state=`failed`,e.error=t instanceof Error?t.message:String(t),e.retryable=n,this.host.requestUpdate())}async runBatch(e){let t=this.host.client();if(!t||!this.ensureCurrent(e)){this.cancelBatch(e);return}for(;e.nextIndex<e.files.length;){let n=e.files[e.nextIndex];if(!n||!this.ensureCurrent(e))return;this.host.requestUpdate();let r;try{r=await ge(n)}catch(t){this.failBatch(e,t,!1);return}if(!this.ensureCurrent(e))return;let i;try{let a=await he(t,e.tab.gatewaySessionId,{name:n.name,contentBase64:r},e.abortController.signal);if(!this.ensureCurrent(e))return;i=a.path}catch(t){this.failBatch(e,t,ye(t));return}try{i=_e(i,e.tab.shell)}catch(t){this.failBatch(e,t,!1);return}e.paths.push(i),e.nextIndex+=1,this.host.requestUpdate()}this.ensureCurrent(e)&&(e.tab.controller.terminal.paste(e.paths.join(` `)),e.tab.controller.terminal.focus(),this.batch=null,this.host.requestUpdate())}cancelForTab(e){let t=this.batch;t?.tab===e&&this.cancelBatch(t)}cancelBatch(e){this.batch===e&&(e.abortController.abort(),this.batch=null,this.dragActive=!1,this.dragDepth=0,this.host.requestUpdate())}dispose(){this.batch?.abortController.abort(),this.batch=null,this.dragActive=!1,this.dragDepth=0}}}));async function Se(e){let[{createGhosttyTerminal:t,loadGhosttyRuntime:n},i]=await Promise.all([r(()=>import(`./browser-Dzpv0Z88.js`),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url),r(()=>import(`./ghostty-web-Bg4ocL01.js`),__vite__mapDeps([6,1,2,3,4,5]),import.meta.url)]),a=await n({module:i});return t({...e,runtime:a})}var Ce=e((()=>{t()}));function we(e){return a`
    <div class="tp-session-picker">
      <button
        class="tp-icon"
        type="button"
        title=${h(`terminal.sessions`)}
        aria-label=${h(`terminal.sessions`)}
        aria-expanded=${e.open?`true`:`false`}
        @click=${e.onToggle}
      >
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="1.3"
          aria-hidden="true"
        >
          <path d="M3 3.25h10v3.5H3zM3 9.25h10v3.5H3z" />
          <path d="m5 4.5 1 1-1 1m0 4 1 1-1 1" />
        </svg>
      </button>
      ${e.open?a`<div class="tp-session-menu" role="dialog" aria-label=${h(`terminal.sessions`)}>
            <div class="tp-session-menu__header">
              <span>${h(`terminal.sessions`)}</span>
              <button class="tp-session-refresh" type="button" @click=${e.onRefresh}>
                ${h(`terminal.refreshSessions`)}
              </button>
            </div>
            ${e.loading?a`<div class="tp-session-empty">${h(`terminal.loadingSessions`)}</div>`:e.sessions.length===0?a`<div class="tp-session-empty">${h(`terminal.noSessions`)}</div>`:e.sessions.map(t=>{let n=e.currentSessionIds.has(t.sessionId),r=n?h(`terminal.currentSession`):t.attached?h(`terminal.sessionAttached`):h(`terminal.detached`);return a`<button
                      class="tp-session"
                      type="button"
                      ?disabled=${n}
                      title=${n?r:h(`terminal.attachSession`)}
                      @click=${()=>e.onAttach(t.sessionId,t.owner)}
                    >
                      <span class="tp-session__agent">${t.agentId}</span>
                      <span class="tp-session__cwd">${t.cwd}</span>
                      <span class="tp-session__state">${r}</span>
                    </button>`})}
          </div>`:l}
    </div>
  `}var Te=e((()=>{s(),g()}));function Ee(){try{let e=globalThis.sessionStorage?.getItem(z);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>typeof e==`string`&&e.length>0):[]}catch{return[]}}function De(e){try{globalThis.sessionStorage?.setItem(z,JSON.stringify(e))}catch{}}var z,Oe=e((()=>{z=`openclaw.terminal.sessions.v1`}));function ke(e,t){let n=new y(B,{mode:`latch`},e=>e.length);return{buffer:n,onData:r=>{let i=V.decode(r),a=t();a?e.input(a,i):n.push(i)},onResize:({columns:n,rows:r})=>{let i=t();i&&e.resize(i,n,r)}}}var B,V,Ae=e((()=>{b(),B=8*1024,V=new TextDecoder})),H,je=e((()=>{H=class{constructor(e){this.options=e}markReady(e){this.stop(e),e.status===`connecting`&&(e.status=`live`,this.options.onReady(e))}arm(e){e.readyTimer||e.status!==`connecting`||!e.awaitFirstOutput||(e.readyTimer=setTimeout(()=>{e.readyTimer=null,!(!this.options.isCurrent(e)||e.status!==`connecting`||!e.awaitFirstOutput)&&(e.awaitFirstOutput=!1,this.options.onTimeout(e))},this.options.timeoutMs()))}stop(e){e.readyTimer&&=(clearTimeout(e.readyTimer),null),e.awaitFirstOutput=!1}}}));async function Me(e,t){for(let n of t)if(await n(),!e())return}var U,Ne=e((()=>{U=class{constructor(){this.tail=Promise.resolve(),this.generation=0}enqueue(e){let t=this.generation,n=()=>t===this.generation,r=()=>n()?e(n):Promise.resolve(),i=this.tail.then(r,r);return this.tail=i.catch(()=>{}),i}enqueueSteps(...e){return this.enqueue(t=>Me(t,e))}reset(){this.generation+=1}}}));function W(e){return q[e]}function G(e){let t=W(e);return e===`light`?{...K,...t,cursorAccent:`#f7f8fa`,selectionBackground:`rgba(90, 162, 255, 0.30)`,black:`#3a3f4b`,white:`#1b1e26`}:{...K,...t,cursorAccent:`#0e1015`,selectionBackground:`rgba(90, 162, 255, 0.32)`}}var K,q,Pe=e((()=>{K={black:`#1b1e26`,red:`#ff6b6b`,green:`#4ec9a8`,yellow:`#e5c07b`,blue:`#5aa2ff`,magenta:`#c586c0`,cyan:`#56b6c2`,white:`#d7dae0`,brightBlack:`#5c6370`,brightRed:`#ff8787`,brightGreen:`#6fd7bd`,brightYellow:`#f0d197`,brightBlue:`#7cb7ff`,brightMagenta:`#d7a3d4`,brightCyan:`#7bd3dd`,brightWhite:`#ffffff`},q={dark:{background:`#0e1015`,cursor:`#ff5c5c`,foreground:`#d7dae0`},light:{background:`#f7f8fa`,cursor:`#1b1e26`,foreground:`#1b1e26`}}}));function Fe(e){let t=e.split(/[\\/]/).pop()?.trim();return t&&t.length>0?t:`shell`}function J(e){let t=e.terminal;t.renderer&&t.wasmTerm&&t.renderer.render(t.wasmTerm,!0,t.viewportY,t,0)}var Y,X,Z,Q,$,Ie=e((()=>{s(),f(),g(),m(),ne(),v(),ee(),se(),ce(),pe(),me(),xe(),Ce(),Te(),Oe(),Ae(),je(),Ne(),Pe(),i(),t(),Y=re({storageKey:`openclaw.terminal.panel.v1`,minHeight:140,minWidth:320,defaultDock:`bottom`,supportedDocks:[`bottom`,`right`],defaultHeight:320,defaultWidth:520}),X=`ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Symbols Nerd Font Mono", "MesloLGLDZ Nerd Font Mono", "JetBrainsMono Nerd Font Mono", "Liberation Mono", monospace`,Z=new TextEncoder,Q=3e4,$=class extends p{constructor(...e){super(...e),this.client=null,this.agentId=null,this.available=!1,this.themeMode=`dark`,this.fullscreen=!1,this.open=!1,this.dock=`bottom`,this.height=Y.defaults.height,this.width=Y.defaults.width,this.tabs=[],this.activeId=null,this.booting=!1,this.errorText=null,this.sessionPickerOpen=!1,this.sessionPickerLoading=!1,this.pickerSessions=[],this.connection=null,this.activeClient=null,this.activeAvailable=!1,this.lifecycleGeneration=0,this.sessionPickerRefreshGeneration=0,this.lifecycleAbortController=new AbortController,this.lifecycleSyncToken=0,this.resizeCleanup=null,this.tabSeq=0,this.upload=new R({activeTab:()=>this.tabs.find(e=>e.id===this.activeId&&e.status===`live`&&e.gatewaySessionId),client:()=>this.client,isCurrent:e=>this.tabs.includes(e)&&e.status===`live`,fileInput:()=>this.renderRoot.querySelector(`.tp-file-input`),setError:e=>this.errorText=e,requestUpdate:()=>this.requestUpdate()}),this.bootQueue=new U,this.createTerminal=Se,this.catalogReadyTimeoutMs=Q,this.readiness=new H({timeoutMs:()=>this.catalogReadyTimeoutMs,isCurrent:e=>this.tabs.includes(e),onReady:()=>{this.tabs=[...this.tabs],this.persistLiveSessions()},onTimeout:e=>{this.errorText=h(`terminal.connectionTimedOut`),this.connection?.close(e.gatewaySessionId),this.dropFailedTab(e),this.persistLiveSessions()}}),this.onGlobalKeyDown=e=>this.handleGlobalKey(e),this.onToggleRequest=e=>this.handleToggleRequest(e),this.onViewportResize=()=>{let e=Math.min(this.height,Y.maxHeight()),t=Math.min(this.width,Y.maxWidth());e===this.height&&t===this.width||(this.height=e,this.width=t,this.syncLayoutReservation(),this.tabs.find(e=>e.id===this.activeId)?.controller.fit())}}connectedCallback(){if(super.connectedCallback(),this.activeClient=this.client,this.activeAvailable=this.available,this.fullscreen)this.open=this.available;else{let e=Y.load();this.dock=e.dock,this.height=e.height,this.width=e.width,this.open=e.open&&this.available,window.addEventListener(`keydown`,this.onGlobalKeyDown),window.addEventListener(_,this.onToggleRequest),window.addEventListener(`resize`,this.onViewportResize)}this.open&&this.restoreSessions()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(`keydown`,this.onGlobalKeyDown),window.removeEventListener(_,this.onToggleRequest),window.removeEventListener(`resize`,this.onViewportResize),document.documentElement.style.setProperty(`--oc-terminal-reserve-bottom`,`0px`),document.documentElement.style.setProperty(`--oc-terminal-reserve-right`,`0px`),this.disposeAllTabs(),this.activeClient=null,this.activeAvailable=!1}updated(e){if((e.has(`client`)||e.has(`available`))&&this.scheduleLifecycleSync(),e.has(`themeMode`)){let e=G(this.themeMode);for(let t of this.tabs){let n=t.controller.terminal;n.renderer&&n.wasmTerm&&(n.renderer.setTheme(e),J(t.controller))}}if(this.open){let e=this.renderRoot.querySelector(`.tp-viewport`);if(e){for(let t of this.tabs)t.host.parentElement!==e&&e.append(t.host);let t=this.tabs.find(e=>e.id===this.activeId);t&&(t.controller.fit(),J(t.controller))}}this.syncLayoutReservation()}scheduleLifecycleSync(){let e=++this.lifecycleSyncToken,t=this.lifecycleGeneration;queueMicrotask(()=>{e!==this.lifecycleSyncToken||t!==this.lifecycleGeneration||!this.isConnected||this.synchronizeLifecycle()})}synchronizeLifecycle(){let e=this.client!==this.activeClient,t=this.available!==this.activeAvailable;if(!e&&!t)return;e&&(this.activeClient=this.client),this.activeAvailable=this.available;let n=t&&!this.available;(e||n)&&this.disposeAllTabs();let r=e&&this.available&&this.open;t&&(this.available?!this.open&&(this.fullscreen||Y.load().open)&&(this.open=!0,r=!0):this.open=!1),r&&this.restoreSessions()}syncLayoutReservation(){if(this.fullscreen)return;let e=document.documentElement.style,t=this.available&&this.open&&this.dock===`bottom`?`${this.height}px`:`0px`,n=this.available&&this.open&&this.dock===`right`?`${this.width}px`:`0px`;e.setProperty(`--oc-terminal-reserve-bottom`,t),e.setProperty(`--oc-terminal-reserve-right`,n)}toggle(){this.available&&(this.open?this.closePanel():(this.open=!0,this.syncLayoutReservation(),this.persistLayout(),this.restoreSessions()))}handleToggleRequest(e){let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null,n=t?.dock===`right`||t?.dock===`bottom`?t.dock:null;if(n&&(this.dock=n),t?.open===!1){this.closePanel();return}if(t?.terminalSessionId||t?.catalog||t?.open===!0){if(!this.available)return;this.open=!0,this.syncLayoutReservation(),this.persistLayout(),t.terminalSessionId?this.openRequestedSession(t.terminalSessionId):t.catalog?this.openCatalogSession(t.catalog):this.restoreSessions();return}this.toggle()}closePanel(){this.open=!1,this.syncLayoutReservation(),this.persistLayout()}handleGlobalKey(e){te(e)&&(e.preventDefault(),this.toggle())}async restoreSessions(){await this.bootQueue.enqueueSteps(()=>this.reattachPersistedSessions(),()=>this.ensureInitialSession())}async openCatalogSession(e){await this.bootQueue.enqueueSteps(()=>this.reattachPersistedSessions(),()=>this.openSessionNow(e))}async openRequestedSession(e){await this.enqueueAttachSession(e,!0)}async reattachPersistedSessions(){let e=this.captureTerminalOperation();if(!e||this.tabs.length>0)return;let t=Ee();if(t.length>0){this.booting=!0;try{let n=await this.connectionFor(e).list();if(!this.isTerminalOperationCurrent(e))return;let r=new Map(n.map(e=>[e.sessionId,e]));for(let n of t){let t=r.get(n);if(t?await this.attachSession(n,e,t.owner?.startsWith(`agent:`)===!0,!0):await this.restoreExitedSession(n,e),!this.isTerminalOperationCurrent(e))return}}catch{if(!this.isTerminalOperationCurrent(e))return}finally{this.isTerminalOperationCurrent(e)&&(this.booting=!1)}if(!this.isTerminalOperationCurrent(e))return;this.persistLiveSessions()}}async ensureInitialSession(){this.tabs.length===0&&!this.booting&&await this.openSessionNow()}toggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen,this.sessionPickerOpen&&this.refreshSessionPicker()}async refreshSessionPicker(){let e=this.captureTerminalOperation();if(!e)return;let t=++this.sessionPickerRefreshGeneration,n=()=>t===this.sessionPickerRefreshGeneration&&this.isTerminalOperationCurrent(e);this.sessionPickerLoading=!0;try{let t=await this.connectionFor(e).list();n()&&(this.pickerSessions=t)}catch{n()&&(this.pickerSessions=[])}finally{n()&&(this.sessionPickerLoading=!1)}}async attachPickedSession(e,t){this.sessionPickerOpen=!1,await this.enqueueAttachSession(e,t?.startsWith(`agent:`)===!0)}async enqueueAttachSession(e,t){await this.bootQueue.enqueue(async()=>{let n=this.tabs.find(t=>t.gatewaySessionId===e);if(n){this.switchTo(n.id);return}let r=this.captureTerminalOperation();if(r){this.booting=!0,this.errorText=null;try{!await this.attachSession(e,r,t)&&this.isTerminalOperationCurrent(r)&&(this.errorText=h(`terminal.attachFailed`))}finally{this.isTerminalOperationCurrent(r)&&(this.booting=!1)}}})}async bootTab(e,t={}){let n=this.connectionFor(e),i=document.createElement(`div`);i.className=`tp-host`;let a=`tab-${++this.tabSeq}`;if(await this.updateComplete,!this.isTerminalOperationCurrent(e))throw Error(`terminal operation cancelled`);let o=this.renderRoot.querySelector(`.tp-viewport`);if(!o)throw Error(`terminal viewport unavailable`);o.append(i);let s={current:void 0},c=ke(n,()=>s.current?.gatewaySessionId),{createTerminalDefaultColorQueryResponder:l}=await r(async()=>{let{createTerminalDefaultColorQueryResponder:e}=await import(`./browser-Dzpv0Z88.js`);return{createTerminalDefaultColorQueryResponder:e}},__vite__mapDeps([0,1,2,3,4,5]),import.meta.url),u=l({getColors:()=>W(this.themeMode),reply:e=>c.onData(Z.encode(e))}),d;try{d=await this.createTerminal({parent:i,readOnly:!1,terminalOptions:{fontSize:13,fontFamily:X,cursorBlink:!0,theme:G(this.themeMode),scrollback:5e3},signal:e.signal,onData:c.onData,onResize:c.onResize})}catch(e){throw i.remove(),e}if(!this.isTerminalOperationCurrent(e)){try{d.dispose()}finally{i.remove()}throw Error(`terminal operation cancelled`)}let f={id:a,sequence:this.tabSeq,gatewaySessionId:``,pendingInput:c.buffer,defaultColorQueries:u,shellName:null,shell:``,agentId:null,cwd:null,agentOwned:!1,controller:d,host:i,status:`connecting`,awaitFirstOutput:t.awaitFirstOutput===!0,readyTimer:null};s.current=f,this.tabs=[...this.tabs,f],this.activeId=a;let{terminal:p}=d;return{tab:f,connection:n,cols:p.cols||80,rows:p.rows||24}}tabSink(e){return{onData:t=>{e.cancelled||(e.defaultColorQueries.observe(t),e.controller.write(Z.encode(t)),t.length>0&&this.readiness.markReady(e))},onReplay:(t,n)=>{e.cancelled||(e.defaultColorQueries.primeFromReplay(t.slice(0,n)),e.defaultColorQueries.observe(t.slice(n)),e.controller.terminal.reset(),t&&(e.controller.write(Z.encode(t)),this.readiness.markReady(e)))},onExit:t=>this.handleExit(e.id,t)}}adoptSession(e,t,n=!1){e.gatewaySessionId=t.sessionId,e.shellName=t.title??Fe(t.shell),e.shell=t.shell,e.agentId=t.agentId,e.cwd=t.cwd,e.agentOwned=n;let{cols:r,rows:i}=e.controller.terminal;this.connection?.resize(t.sessionId,r||80,i||24);for(let n of e.pendingInput.drain())this.connection?.input(t.sessionId,n);e.status===`connecting`&&(e.awaitFirstOutput?this.readiness.arm(e):this.readiness.markReady(e)),this.tabs=[...this.tabs],this.persistLiveSessions()}dropFailedTab(e){this.disposeTab(e),this.tabs=this.tabs.filter(t=>t.id!==e.id),this.activeId===e.id&&(this.activeId=this.tabs.at(-1)?.id??null)}async openSession(e){await this.bootQueue.enqueue(()=>this.openSessionNow(e))}async openSessionNow(e){let t=this.captureTerminalOperation();if(!t)return;this.booting=!0,this.errorText=null;let n=this.agentId?.trim()||void 0,r;try{let i=await this.bootTab(t,{awaitFirstOutput:!!e});r=i.tab;let a=await i.connection.open({agentId:n,cols:i.cols,rows:i.rows,...e?{catalog:e}:{}},this.tabSink(i.tab));if(!this.isTerminalOperationCurrent(t)||i.tab.cancelled){i.connection.close(a.sessionId),this.tabs.includes(i.tab)&&(i.tab.cancelled=`lifecycle`,this.dropFailedTab(i.tab));return}this.adoptSession(i.tab,a),i.tab.controller.terminal.focus()}catch(e){if(r&&!r.gatewaySessionId&&this.tabs.includes(r)&&this.dropFailedTab(r),!this.isTerminalOperationCurrent(t))return;this.errorText=e instanceof D?h(`terminal.connectionTimedOut`):e instanceof Error?e.message:String(e)}finally{this.isTerminalOperationCurrent(t)&&(this.booting=!1)}}async attachSession(e,t,n=!1,r=!1){let i,a;try{let r=await this.bootTab(t);i=r.tab,a=r.connection;let o=await r.connection.attach(e,this.tabSink(r.tab));return!this.isTerminalOperationCurrent(t)||r.tab.cancelled?(r.tab.cancelled===`close`&&r.connection.close(o.sessionId),this.tabs.includes(r.tab)&&(r.tab.cancelled=`lifecycle`,this.dropFailedTab(r.tab)),!1):(this.adoptSession(r.tab,o,n),!0)}catch{let n=r&&a?await this.confirmRestoredSessionGone(a,e,t):!1;return i&&!i.gatewaySessionId&&this.tabs.includes(i)&&(n?this.markRestoredSessionExited(i,e):this.dropFailedTab(i)),!1}}async confirmRestoredSessionGone(e,t,n){try{let r=await e.list();return this.isTerminalOperationCurrent(n)&&!r.some(e=>e.sessionId===t)}catch{return!1}}async restoreExitedSession(e,t){let n=await this.bootTab(t);if(!this.isTerminalOperationCurrent(t)||n.tab.cancelled){this.tabs.includes(n.tab)&&(n.tab.cancelled=`lifecycle`,this.dropFailedTab(n.tab));return}this.markRestoredSessionExited(n.tab,e)}markRestoredSessionExited(e,t){e.gatewaySessionId=t,this.handleExit(e.id,{reason:`disconnected`,exitCode:null})}handleExit(e,t){let n=this.tabs.find(t=>t.id===e);n&&(this.readiness.stop(n),n.status=`exited`,n.exitReason=t.reason,n.exitCode=t.exitCode,t.error?.trim()&&(this.errorText=t.error.trim()),this.tabs=[...this.tabs],this.persistLiveSessions())}closeTab(e){let t=this.tabs.find(t=>t.id===e);t&&(this.upload.cancelForTab(t),t.gatewaySessionId&&t.status!==`exited`?this.connection?.close(t.gatewaySessionId):!t.gatewaySessionId&&t.status!==`exited`&&(t.cancelled=`close`),this.disposeTab(t),this.tabs=this.tabs.filter(t=>t.id!==e),this.activeId===e&&(this.activeId=this.tabs.at(-1)?.id??null),this.persistLiveSessions(),this.tabs.length===0&&!this.fullscreen&&this.closePanel())}switchTo(e){this.activeId=e;let t=this.tabs.find(t=>t.id===e);this.updateComplete.then(()=>{t&&(t.controller.fit(),J(t.controller),t.controller.terminal.focus())})}captureTerminalOperation(){let e=this.client;return!e||e!==this.activeClient||!this.available||!this.isConnected?null:{generation:this.lifecycleGeneration,client:e,signal:this.lifecycleAbortController.signal}}isTerminalOperationCurrent(e){return this.isConnected&&this.available&&this.client===e.client&&this.activeClient===e.client&&this.lifecycleGeneration===e.generation&&!e.signal.aborted}connectionFor(e){if(!this.isTerminalOperationCurrent(e))throw Error(`terminal operation cancelled`);return this.connection??=new O(e.client),this.connection}disposeTab(e){this.readiness.stop(e);try{e.controller.dispose()}catch{}finally{e.host.remove()}}disposeAllTabs(){this.lifecycleGeneration+=1,this.lifecycleAbortController.abort(),this.lifecycleAbortController=new AbortController,this.bootQueue.reset(),this.booting=!1,this.upload.dispose(),this.clearResizeListeners();for(let e of this.tabs)e.cancelled=`lifecycle`,this.disposeTab(e);this.tabs=[],this.activeId=null,this.sessionPickerOpen=!1,this.sessionPickerLoading=!1,this.sessionPickerRefreshGeneration+=1,this.pickerSessions=[],this.connection?.dispose(),this.connection=null}setDock(e){this.dock=e,this.syncLayoutReservation(),this.persistLayout(),this.updateComplete.then(()=>{for(let e of this.tabs)e.controller.fit()})}persistLiveSessions(){De(this.tabs.filter(e=>e.status===`live`&&e.gatewaySessionId).map(e=>e.gatewaySessionId))}persistLayout(){Y.save({open:this.open,dock:this.dock,height:this.height,width:this.width})}startResize(e){e.preventDefault(),this.clearResizeListeners();let t=e.clientX,n=e.clientY,r=this.height,i=this.width,a=e=>{if(this.dock===`bottom`){let t=Math.max(Y.minHeight,r+(n-e.clientY));this.height=Math.min(t,Y.maxHeight())}else{let n=Math.max(Y.minWidth,i+(t-e.clientX));this.width=Math.min(n,Y.maxWidth())}this.syncLayoutReservation(),this.tabs.find(e=>e.id===this.activeId)?.controller.fit()},o=()=>{window.removeEventListener(`pointermove`,a),window.removeEventListener(`pointerup`,s),window.removeEventListener(`pointercancel`,s),window.removeEventListener(`blur`,s),this.resizeCleanup===o&&(this.resizeCleanup=null)},s=()=>{o(),this.isConnected&&this.persistLayout()};this.resizeCleanup=o,window.addEventListener(`pointermove`,a),window.addEventListener(`pointerup`,s),window.addEventListener(`pointercancel`,s),window.addEventListener(`blur`,s)}clearResizeListeners(){this.resizeCleanup?.(),this.resizeCleanup=null}render(){if(!this.available||!this.open)return l;let e=this.fullscreen?`fullscreen`:this.dock,t=this.fullscreen?l:this.dock===`bottom`?`height:${this.height}px;--tp-panel-height:${this.height}px`:`width:${this.width}px`,n=this.tabs.find(e=>e.id===this.activeId),r=this.booting&&this.tabs.length===0||n?.status===`connecting`;return a`
      <section class="tp tp--${e}" style=${t} aria-label=${h(`terminal.title`)}>
        ${this.fullscreen?l:a`<div
              class="tp-resizer tp-resizer--${this.dock}"
              @pointerdown=${e=>this.startResize(e)}
              role="separator"
              aria-label=${h(`terminal.resize`)}
            ></div>`}
        <header class="tp-header">
          ${fe({tabs:this.tabs,activeId:this.activeId,booting:this.booting,onSelect:e=>this.switchTo(e),onClose:e=>this.closeTab(e),onNew:()=>void this.openSession()})}
          ${be({fullscreen:this.fullscreen,dock:this.dock,upload:this.upload,sessionPicker:we({open:this.sessionPickerOpen,loading:this.sessionPickerLoading,sessions:this.pickerSessions,currentSessionIds:new Set(this.tabs.map(e=>e.gatewaySessionId).filter(e=>typeof e==`string`&&e.length>0)),onToggle:()=>this.toggleSessionPicker(),onRefresh:()=>void this.refreshSessionPicker(),onAttach:(e,t)=>void this.attachPickedSession(e,t)}),onDock:e=>this.setDock(e),onHide:()=>this.closePanel()})}
        </header>
        ${this.errorText?a`<div class="tp-error" role="alert">${this.errorText}</div>`:l}
        <wa-tab-panel
          id="terminal-tab-panel"
          class="tp-viewport"
          name=${this.activeId??`terminal`}
          active
          aria-labelledby=${this.activeId?`terminal-tab-${this.activeId}`:l}
          @dragenter=${this.upload.handleDragEnter}
          @dragover=${this.upload.handleDragOver}
          @dragleave=${this.upload.handleDragLeave}
          @drop=${this.upload.handleDrop}
        >
          ${r?a`<div class="tp-connecting" role="status">
                <span class="tp-connecting__spinner" aria-hidden="true"></span>
                <span>${h(`terminal.connecting`)}</span>
              </div>`:l}
          ${N(this.upload)}
        </wa-tab-panel>
      </section>
    `}willUpdate(){for(let e of this.tabs)e.host.style.display=e.id===this.activeId?`block`:`none`}static{this.styles=[ie,k,j]}},n([o({attribute:!1})],$.prototype,`client`,void 0),n([o({attribute:!1})],$.prototype,`agentId`,void 0),n([o({type:Boolean})],$.prototype,`available`,void 0),n([o({attribute:!1})],$.prototype,`themeMode`,void 0),n([o({type:Boolean})],$.prototype,`fullscreen`,void 0),n([c()],$.prototype,`open`,void 0),n([c()],$.prototype,`dock`,void 0),n([c()],$.prototype,`height`,void 0),n([c()],$.prototype,`width`,void 0),n([c()],$.prototype,`tabs`,void 0),n([c()],$.prototype,`activeId`,void 0),n([c()],$.prototype,`booting`,void 0),n([c()],$.prototype,`errorText`,void 0),n([c()],$.prototype,`sessionPickerOpen`,void 0),n([c()],$.prototype,`sessionPickerLoading`,void 0),n([c()],$.prototype,`pickerSessions`,void 0)}));e((()=>{Ie(),customElements.get(`openclaw-terminal-panel`)||customElements.define(`openclaw-terminal-panel`,$)}))();
//# sourceMappingURL=terminal-panel-registration-Cl_Ikzdx.js.map