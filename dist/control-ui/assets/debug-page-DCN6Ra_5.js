import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,u as n}from"./control-ui-foundation-43q8Lf_T.js";import{dt as r,ft as i}from"./control-ui-foundation-DQl2NL7K.js";import{$ as a,D as o,J as s,U as c,X as l,k as u,z as d}from"./lit-runtime-CE4wpvNA.js";import{Ci as f,Mi as p,Mr as m,Nr as h,Pi as g,bi as _,fn as v,pn as y}from"./control-ui-core-Dx4utKSD.js";import{Ut as b,at as x,it as S,jt as C}from"./control-ui-core-6OhF3OIO.js";import{o as w,t as T}from"./control-ui-core-CXeSrnoQ.js";import{n as E,t as D}from"./settings-workspace-BhCB-OeS.js";import{a as O,c as k,n as A,o as j,t as M,u as N}from"./settings-ui-BJ5HJKwt.js";import{n as P,r as F}from"./markdown-UmoHCmlv.js";import{i as I,s as L}from"./presenter-PwgnXVPR.js";async function R(e){let[t,n,r,i]=await Promise.all([e.request(`status`,{}),e.request(`health`,{}),e.request(`models.list`,{}),e.request(`last-heartbeat`,{})]),a=r;return{status:t,health:n,models:Array.isArray(a?.models)?a.models:[],heartbeat:i}}var z=e((()=>{}));function B(e,t){return j({title:e,stacked:!0,control:a`<pre class="code-block">
${u(P(JSON.stringify(t??{},null,2)))}</pre>`})}function V(e){let t=(e.status&&typeof e.status==`object`?e.status.securityAudit:null)?.summary??null;if(!t)return l;let n=t.critical??0,r=t.warn??0,i=t.info??0,o=n>0?`danger`:r>0?`warn`:`ok`,s=n>0?w(`debug.security.critical`,{count:String(n)}):r>0?w(`debug.security.warnings`,{count:String(r)}):w(`debug.security.noCriticalIssues`),c=i>0?` · ${w(`debug.security.info`,{count:String(i)})}`:``;return j({title:w(`debug.security.audit`),description:a`
      ${w(`debug.security.runPrefix`)}
      <span class="mono">openclaw security audit --deep</span>
      ${w(`debug.security.runSuffix`)}
    `,control:N({kind:o,label:`${s}${c}`})})}function H(e){return j({title:e.event,description:_(e.ts,void 0,``),stacked:!0,control:a`<pre class="code-block">
${u(P(I(e.payload)))}</pre>`})}function U(e){return O(a`${k({title:w(`debug.snapshotsTitle`),description:w(`debug.snapshotsSubtitle`),actions:a`
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?w(`common.refreshing`):w(`common.refresh`)}
        </button>
      `},a`
      ${V(e)} ${B(w(`debug.status`),e.status)}
      ${B(w(`debug.health`),e.health)}
      ${B(w(`debug.lastHeartbeat`),e.heartbeat)}
    `)} ${k({title:w(`debug.manualRpcTitle`),description:w(`debug.manualRpcSubtitle`)},a`
      ${j({title:w(`debug.method`),control:a`
          <select
            class="settings-select"
            aria-label=${w(`debug.method`)}
            .value=${e.callMethod}
            @change=${t=>e.onCallMethodChange(t.target.value)}
          >
            ${e.callMethod?l:a` <option value="" disabled>${w(`debug.selectMethod`)}</option> `}
            ${e.methods.map(e=>a`<option value=${e}>${e}</option>`)}
          </select>
        `})}
      ${j({title:w(`debug.paramsJson`),stacked:!0,control:a`
          <textarea
            class="settings-input"
            aria-label=${w(`debug.paramsJson`)}
            .value=${e.callParams}
            @input=${t=>e.onCallParamsChange(t.target.value)}
            rows="6"
          ></textarea>
        `})}
      ${j({title:w(`common.call`),control:a`
          <button class="btn primary" @click=${e.onCall}>${w(`common.call`)}</button>
        `})}
      ${e.callError?a`
            <div class="settings-row settings-row--stacked">
              ${N({kind:`danger`,label:w(`debug.callFailed`)})}
              <pre class="code-block">${e.callError}</pre>
            </div>
          `:l}
      ${e.callResult?a`
            <div class="settings-row settings-row--stacked">
              ${N({kind:`ok`,label:w(`common.ok`)})}
              <pre class="code-block">${u(P(e.callResult))}</pre>
            </div>
          `:l}
    `)} ${k({title:w(`debug.modelsTitle`),description:w(`debug.modelsSubtitle`)},a`
      <div class="settings-row settings-row--stacked">
        <pre class="code-block">
${u(P(JSON.stringify(e.models??[],null,2)))}</pre>
      </div>
    `)} ${k({title:w(`debug.eventLogTitle`),description:w(`debug.eventLogSubtitle`)},e.eventLog.length===0?A(w(`debug.noEvents`)):e.eventLog.map(e=>H(e)))}`,{wide:!0})}var W=e((()=>{s(),o(),F(),M(),T(),f(),L()})),G,K;e((()=>{r(),s(),d(),C(),x(),D(),z(),g(),y(),h(),W(),n(),G=3e3,K=class extends p{constructor(...e){super(...e),this.client=null,this.connected=!1,this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod=``,this.debugCallParams=`{}`,this.debugCallResult=null,this.debugCallError=null,this.eventLog=[],this.polling=new v(this,G,()=>{this.loadDiagnostics()},!1),this.hasBoundGatewaySource=!1,this.gatewaySource=null,this.requestGeneration=0,this.subscriptions=new m(this).effect(()=>this.context?.gateway,e=>{let t=this.hasBoundGatewaySource;this.hasBoundGatewaySource=!0,this.gatewaySource=e,this.requestGeneration+=1;let n=e.subscribe(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.applyGatewaySnapshot(t)});return this.applyGatewaySnapshot(e.snapshot,t),n}).watch(()=>this.context?.gateway,(e,t)=>e.subscribeEventLog(t),e=>{this.eventLog=e.eventLog})}disconnectedCallback(){this.subscriptions.clear(),this.requestGeneration+=1,this.gatewaySource=null,this.debugLoading=!1,super.disconnectedCallback()}applyGatewaySnapshot(e,t=!1){let n=e.connected!==this.connected,r=t||e.client!==this.client;(r||n)&&(this.requestGeneration+=1),this.client=e.client,this.connected=e.connected,r?this.resetServerState():n&&(this.debugLoading=!1),this.syncPolling(),this.ensureInitialDebug()}resetServerState(){this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallResult=null,this.debugCallError=null}syncPolling(){if(!this.connected||!this.client){this.polling.stop();return}this.polling.start()}ensureInitialDebug(){!this.connected||!this.client||this.debugStatus||this.debugLoading||this.loadDiagnostics()}captureRequestScope(){let e=this.gatewaySource,t=this.client;return!e||!t||!this.connected||!this.isConnected||this.context.gateway!==e?null:{gateway:e,client:t,generation:this.requestGeneration}}isRequestScopeCurrent(e){return this.isConnected&&this.gatewaySource===e.gateway&&this.context.gateway===e.gateway&&this.requestGeneration===e.generation&&this.client===e.client&&this.connected}async loadDiagnostics(){let e=this.captureRequestScope();if(!(!e||this.debugLoading)){this.debugLoading=!0;try{let t=await R(e.client);if(!this.isRequestScopeCurrent(e))return;this.debugStatus=t.status,this.debugHealth=t.health,this.debugModels=t.models,this.debugHeartbeat=t.heartbeat}catch(t){this.isRequestScopeCurrent(e)&&(this.debugCallError=String(t))}finally{this.isRequestScopeCurrent(e)&&(this.debugLoading=!1)}}}async callDebugMethod(){let e=this.captureRequestScope();if(e){this.debugCallError=null,this.debugCallResult=null;try{let t=this.debugCallParams.trim()?JSON.parse(this.debugCallParams):{},n=await e.client.request(this.debugCallMethod.trim(),t);this.isRequestScopeCurrent(e)&&(this.debugCallResult=JSON.stringify(n,null,2))}catch(t){this.isRequestScopeCurrent(e)&&(this.debugCallError=String(t))}}}render(){let e=U({loading:this.debugLoading,status:this.debugStatus,health:this.debugHealth,models:this.debugModels,heartbeat:this.debugHeartbeat,eventLog:this.eventLog,methods:(this.context.gateway.snapshot.hello?.features?.methods??[]).toSorted(),callMethod:this.debugCallMethod,callParams:this.debugCallParams,callResult:this.debugCallResult,callError:this.debugCallError,onCallMethodChange:e=>this.debugCallMethod=e,onCallParamsChange:e=>this.debugCallParams=e,onRefresh:()=>void this.loadDiagnostics(),onCall:()=>void this.callDebugMethod()});return a`
      <section class="content-header">
        <div>
          <div class="page-title">${b(`debug`)}</div>
        </div>
      </section>
      ${E(e)}
    `}},t([i({context:S,subscribe:!0})],K.prototype,`context`,void 0),t([c()],K.prototype,`client`,void 0),t([c()],K.prototype,`connected`,void 0),t([c()],K.prototype,`debugLoading`,void 0),t([c()],K.prototype,`debugStatus`,void 0),t([c()],K.prototype,`debugHealth`,void 0),t([c()],K.prototype,`debugModels`,void 0),t([c()],K.prototype,`debugHeartbeat`,void 0),t([c()],K.prototype,`debugCallMethod`,void 0),t([c()],K.prototype,`debugCallParams`,void 0),t([c()],K.prototype,`debugCallResult`,void 0),t([c()],K.prototype,`debugCallError`,void 0),t([c()],K.prototype,`eventLog`,void 0),customElements.get(`openclaw-debug-page`)||customElements.define(`openclaw-debug-page`,K)}))();
//# sourceMappingURL=debug-page-DCN6Ra_5.js.map