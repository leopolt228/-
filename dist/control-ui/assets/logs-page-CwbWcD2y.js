import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,u as n}from"./control-ui-foundation-43q8Lf_T.js";import{dt as r,ft as i}from"./control-ui-foundation-DQl2NL7K.js";import{$ as a,J as o,U as s,X as c,z as l}from"./lit-runtime-CE4wpvNA.js";import{ut as u}from"./control-ui-foundation-DFIFKu9N.js";import{Bo as d,Mi as ee,Mr as f,Nr as p,Pi as m,di as h,fi as g,fn as _,pn as te,ui as v}from"./control-ui-core-Dx4utKSD.js";import{Ut as y,at as b,it as x,jt as ne}from"./control-ui-core-6OhF3OIO.js";import{o as S,t as re}from"./control-ui-core-CXeSrnoQ.js";import{n as ie,t as ae}from"./settings-workspace-BhCB-OeS.js";import{d as oe,n as C,o as w,t as T,u as E}from"./settings-ui-BJ5HJKwt.js";import{a as D,i as O,n as k,o as A,r as j,t as M}from"./panel-refresh-status-CvTXJ1Oh.js";function N(e,t){return B.lastIndex=t,B.exec(e)?.[0]}function P(e,t){let n=e.charCodeAt(t);return n===155?1:n===27&&e.charCodeAt(t+1)===91?2:0}function F(e,t){let n=P(e,t);if(n===0)return;let r=t+n,i=[],a=!1;for(;r<e.length;){let t=e.charCodeAt(r);if(t===24||t===26){r+=1,a=!0;break}if(t===27||t===155){a=!0;break}if(t<=31||t===127){i.push(e.charAt(r)),r+=1;continue}if(t>=32&&t<=63){r+=1;continue}t>=64&&t<=126&&(r+=1),a=!0;break}return{controls:i,ended:a,value:e.slice(t,r)}}var I,L,R,z,B,V=e((()=>{I=`(?:\\x1b\\]|\\x9d)`,L=`(?:\\x1b\\\\|\\x07|\\x9c)`,R=`${I}[^\\x07\\x1b\\x9c]*${L}`,z=`[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]`,B=new RegExp(R,`y`)}));function H(e){return e.includes(`\x1B`)||e.includes(``)||e.includes(``)}function U(e,t){let n=[],r=0,i=0;for(;i<e.length;){let a=e.charCodeAt(i);if(a!==27&&a!==155&&a!==157){i+=1;continue}let o=N(e,i);if(o){n.push(e.slice(r,i)),i+=o.length,r=i;continue}let s=F(e,i);if(!s){K.lastIndex=i;let a=t.compatibilityGrammar?K.exec(e):null;if(a){n.push(e.slice(r,i)),i+=a[0].length,r=i;continue}i+=1;continue}K.lastIndex=i;let c=t.compatibilityGrammar?K.exec(e):null;if(!s.ended&&t.preserveIncompleteCsi)break;let l=i+s.value.length,u=s.value.length;s.controls.length===0&&c&&c[0].length>u&&(l=i+c[0].length),n.push(e.slice(r,i),...s.controls),i=l,r=l}return n.push(e.slice(r)),n.join(``)}function W(e){return H(e)?U(e,{compatibilityGrammar:!1}):e}var G,K,q=e((()=>{V(),G=`${I}[\\s\\S]*?${L}`,K=RegExp(`${G}|${z}`,`y`),typeof Intl<`u`&&`Segmenter`in Intl&&new Intl.Segmenter(void 0,{granularity:`grapheme`})}));function se(e){if(typeof e!=`string`)return null;let t=e.trim();if(!t.startsWith(`{`)||!t.endsWith(`}`))return null;try{let e=JSON.parse(t);return e&&typeof e==`object`?e:null}catch{return null}}function ce(e){if(typeof e!=`string`)return null;let t=u(e);return Y.has(t)?t:null}function le(e){if(!e.trim())return{raw:e,message:e};try{let t=JSON.parse(e),n=t&&typeof t._meta==`object`&&t._meta!==null?t._meta:null,r=typeof t.time==`string`?t.time:typeof n?.date==`string`?n.date:null,i=ce(n?.logLevelName??n?.level),a=typeof t[0]==`string`?t[0]:typeof n?.name==`string`?n.name:null,o=se(a),s=typeof o?.subsystem==`string`?o.subsystem:typeof o?.module==`string`?o.module:null;!s&&a&&a.length<120&&(s=a);let c=typeof t[1]==`string`?t[1]:typeof t[2]==`string`?t[2]:!o&&typeof t[0]==`string`?t[0]:typeof t.message==`string`?t.message:e;return{raw:e,time:r,level:i,subsystem:s&&W(s),message:W(c),meta:n??void 0}}catch{return{raw:e,message:W(e)}}}var J,Y,X=e((()=>{q(),d(),J={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},Y=new Set([`trace`,`debug`,`info`,`warn`,`error`,`fatal`])}));function ue(e){if(!e)return``;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function de(e,t){return t?u([e.message,e.subsystem,e.raw].filter(Boolean).join(` `)).includes(t):!0}function fe(e){let t=u(e.filterText),n=Z.some(t=>!e.levelFilters[t]),r=e.entries.filter(n=>n.level&&!e.levelFilters[n.level]?!1:de(n,t)),i=t||n?`filtered`:`visible`,o=S(`logsView.exportLabels.${i}`);return a`
    <div class="settings-section__header">
      <h2 class="settings-section__heading">${S(`logsView.title`)}</h2>
      <div class="settings-section__actions">
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?S(`common.loading`):S(`common.refresh`)}
        </button>
        <button
          class="btn"
          ?disabled=${r.length===0}
          @click=${()=>e.onExport(r.map(e=>e.raw),i)}
        >
          ${S(`logsView.exportButton`,{label:o})}
        </button>
      </div>
    </div>
    <p class="settings-section__desc">${S(`logsView.subtitle`)}</p>
    ${A({status:e.status,onRetry:e.onRefresh,className:`logs-refresh-status`})}
    <div class="settings-group logs-card">
      ${w({title:S(`logsView.filter`),description:e.file?S(`logsView.file`,{file:e.file}):void 0,control:a`
          <input
            class="settings-input"
            aria-label=${S(`logsView.filter`)}
            .value=${e.filterText}
            @input=${t=>e.onFilterTextChange(t.target.value)}
            placeholder=${S(`logsView.searchPlaceholder`)}
          />
        `})}
      <div class="settings-row">
        <div class="chip-row">
          ${Z.map(t=>a`
              <label class="chip log-chip ${t}">
                <input
                  type="checkbox"
                  .checked=${e.levelFilters[t]}
                  @change=${n=>e.onLevelToggle(t,n.target.checked)}
                />
                <span>${t}</span>
              </label>
            `)}
        </div>
        <div class="settings-row__control">
          ${oe({checked:e.autoFollow,ariaLabel:S(`logsView.autoFollow`),onChange:t=>e.onToggleAutoFollow(t)})}
          <span class="settings-row__value">${S(`logsView.autoFollow`)}</span>
        </div>
      </div>
      ${e.truncated?a`
            <div class="settings-row">
              ${E({kind:`warn`,label:S(`logsView.truncated`)})}
            </div>
          `:c}
      <div class="log-stream" @scroll=${e.onScroll}>
        ${r.length===0?C(S(`logsView.empty`)):r.map(e=>a`
                <div class="log-row">
                  <div class="log-time mono">${ue(e.time)}</div>
                  <div class="log-level ${e.level??``}">${e.level??``}</div>
                  <div class="log-subsystem mono">${e.subsystem??``}</div>
                  <div class="log-message mono">${e.message??e.raw}</div>
                </div>
              `)}
      </div>
    </div>
  `}var Z,pe=e((()=>{o(),D(),T(),re(),d(),Z=[`trace`,`debug`,`info`,`warn`,`error`,`fatal`]})),Q,$;e((()=>{r(),o(),l(),ne(),b(),D(),ae(),h(),m(),te(),p(),X(),pe(),n(),Q=2e3,$=class extends ee{constructor(...e){super(...e),this.client=null,this.connected=!1,this.logsLoading=!1,this.logsStatus=j(),this.logsFile=null,this.logsEntries=[],this.logsFilterText=``,this.logsLevelFilters={...J},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsAtBottom=!0,this.logsCursor=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.polling=new _(this,Q,()=>{this.loadLogs({quiet:!0})},!1),this.logsScrollFrame=null,this.contentScrollFrame=null,this.hasBoundGatewaySource=!1,this.gatewaySource=null,this.requestGeneration=0,this.activeRequest=null,this.subscriptions=new f(this).effect(()=>this.context?.gateway,e=>{let t=this.hasBoundGatewaySource;this.hasBoundGatewaySource=!0,this.gatewaySource=e,this.requestGeneration+=1;let n=e.subscribe(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.applyGatewaySnapshot(t)});return this.applyGatewaySnapshot(e.snapshot,t),this.logsAtBottom=!0,n})}firstUpdated(){this.resetContentScroll(),this.contentScrollFrame=requestAnimationFrame(()=>{this.contentScrollFrame=null,this.resetContentScroll()})}updated(e){let t=this.logsAutoFollow&&e.has(`logsAutoFollow`);(t||this.logsAutoFollow&&this.logsAtBottom&&e.has(`logsEntries`))&&this.scheduleScroll(t)}disconnectedCallback(){this.subscriptions.clear(),this.requestGeneration+=1,this.activeRequest=null,this.gatewaySource=null,this.logsLoading=!1,this.logsScrollFrame!==null&&(cancelAnimationFrame(this.logsScrollFrame),this.logsScrollFrame=null),this.contentScrollFrame!==null&&(cancelAnimationFrame(this.contentScrollFrame),this.contentScrollFrame=null),super.disconnectedCallback()}resetContentScroll(){let e=this.closest(`.content`);e&&(e.scrollTop=0,e.scrollLeft=0)}applyGatewaySnapshot(e,t=!1){let n=e.connected!==this.connected,r=t||e.client!==this.client;(r||n)&&(this.requestGeneration+=1,this.activeRequest=null),this.client=e.client,this.connected=e.connected,r?this.resetServerState():n&&(this.logsLoading=!1),this.syncPolling(),this.ensureInitialLogs()}resetServerState(){this.logsLoading=!1,this.logsStatus=j(),this.logsFile=null,this.logsEntries=[],this.logsTruncated=!1,this.logsCursor=null,this.logsAtBottom=!0}syncPolling(){if(!this.connected||!this.client){this.polling.stop();return}this.polling.start()}ensureInitialLogs(){!this.connected||!this.client||this.logsEntries.length>0||this.logsLoading||this.loadLogs({reset:!0}).then(e=>{e&&this.scheduleScroll(!0)})}captureRequestScope(){let e=this.gatewaySource,t=this.client;return!e||!t||!this.connected||!this.isConnected||this.context.gateway!==e?null:{gateway:e,client:t,generation:this.requestGeneration}}isRequestScopeCurrent(e){return this.isConnected&&this.gatewaySource===e.gateway&&this.context.gateway===e.gateway&&this.requestGeneration===e.generation&&this.client===e.client&&this.connected}async loadLogs(e){let t=this.captureRequestScope(),n=e?.quiet===!0;if(!t||this.activeRequest&&this.isRequestScopeCurrent(this.activeRequest))return!1;this.activeRequest=t;let r=()=>this.activeRequest===t&&this.isRequestScopeCurrent(t);n||(this.logsLoading=!0),this.logsStatus=M(this.logsStatus,{clearError:!n});try{let n=await t.client.request(`logs.tail`,{cursor:e?.reset?void 0:this.logsCursor??void 0,limit:this.logsLimit,maxBytes:this.logsMaxBytes});if(!r())return!1;let i=n,a=(Array.isArray(i.lines)?i.lines.filter(e=>typeof e==`string`):[]).map(le),o=e?.reset||i.reset||this.logsCursor==null;return this.logsEntries=o?a:[...this.logsEntries,...a].slice(-2e3),this.logsCursor=typeof i.cursor==`number`?i.cursor:this.logsCursor,this.logsFile=typeof i.file==`string`?i.file:this.logsFile,this.logsTruncated=!!i.truncated,this.logsStatus=k(),!0}catch(e){return r()?(g(e)?(this.logsEntries=[],this.logsStatus=O(j(),v(`logs`))):this.logsStatus=O(this.logsStatus,String(e)),!0):!1}finally{this.activeRequest===t&&(this.activeRequest=null,this.isRequestScopeCurrent(t)&&!n&&(this.logsLoading=!1))}}scheduleScroll(e=!1){this.logsScrollFrame!==null&&cancelAnimationFrame(this.logsScrollFrame);let t=this.gatewaySource,n=this.requestGeneration,r=()=>this.isConnected&&this.connected&&t!==null&&this.gatewaySource===t&&this.context.gateway===t&&this.requestGeneration===n;this.updateComplete.then(()=>{r()&&(this.logsScrollFrame=requestAnimationFrame(()=>{if(this.logsScrollFrame=null,!r())return;let t=this.querySelector(`.log-stream`);if(!t)return;let n=t.scrollHeight-t.scrollTop-t.clientHeight;(e||n<80)&&(t.scrollTop=t.scrollHeight)}))})}handleScroll(e){let t=e.currentTarget;if(!t)return;let n=t.scrollHeight-t.scrollTop-t.clientHeight;this.logsAtBottom=n<80}exportLogs(e,t){if(e.length===0)return;let n=new Blob([`${e.join(`
`)}\n`],{type:`text/plain`}),r=URL.createObjectURL(n),i=document.createElement(`a`),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,`-`);i.href=r,i.download=`openclaw-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(r)}render(){let e=fe({loading:this.logsLoading,status:this.logsStatus,file:this.logsFile,entries:this.logsEntries,filterText:this.logsFilterText,levelFilters:this.logsLevelFilters,autoFollow:this.logsAutoFollow,truncated:this.logsTruncated,onFilterTextChange:e=>this.logsFilterText=e,onLevelToggle:(e,t)=>{this.logsLevelFilters={...this.logsLevelFilters,[e]:t}},onToggleAutoFollow:e=>this.logsAutoFollow=e,onRefresh:()=>void this.loadLogs({reset:!0}).then(e=>{e&&this.scheduleScroll(!0)}),onExport:(e,t)=>this.exportLogs(e,t),onScroll:e=>this.handleScroll(e)});return a`
      <section class="content-header">
        <div>
          <div class="page-title">${y(`logs`)}</div>
        </div>
      </section>
      ${ie(e,{fillHeight:!0})}
    `}},t([i({context:x,subscribe:!0})],$.prototype,`context`,void 0),t([s()],$.prototype,`client`,void 0),t([s()],$.prototype,`connected`,void 0),t([s()],$.prototype,`logsLoading`,void 0),t([s()],$.prototype,`logsStatus`,void 0),t([s()],$.prototype,`logsFile`,void 0),t([s()],$.prototype,`logsEntries`,void 0),t([s()],$.prototype,`logsFilterText`,void 0),t([s()],$.prototype,`logsLevelFilters`,void 0),t([s()],$.prototype,`logsAutoFollow`,void 0),t([s()],$.prototype,`logsTruncated`,void 0),t([s()],$.prototype,`logsAtBottom`,void 0),customElements.get(`openclaw-logs-page`)||customElements.define(`openclaw-logs-page`,$)}))();
//# sourceMappingURL=logs-page-CwbWcD2y.js.map