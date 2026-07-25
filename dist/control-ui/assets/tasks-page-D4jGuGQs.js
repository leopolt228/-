import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,r as n,u as r}from"./control-ui-foundation-43q8Lf_T.js";import{dt as i,ft as a}from"./control-ui-foundation-DQl2NL7K.js";import{$ as o,J as s,U as c,X as l,m as u,p as d,z as f}from"./lit-runtime-CE4wpvNA.js";import{$n as p,Ci as m,Ha as h,Mi as g,Mr as _,Nr as v,Pi as ee,Ya as te,xr as y,yi as b}from"./control-ui-core-Dx4utKSD.js";import{Ct as x,H as S,Tt as C,U as w,Ut as T,at as E,it as D,jt as O}from"./control-ui-core-6OhF3OIO.js";import{o as k,t as A}from"./control-ui-core-CXeSrnoQ.js";import{it as j,ot as M}from"./control-ui-core-vPyynwls.js";import{c as N,d as P,f as ne,g as F,h as I,i as L,l as R,m as z,n as B,o as V,p as H,t as U}from"./data-Dl8IW4fj.js";import{n as W,t as G}from"./agent-scope-control-ClLrhBs5.js";function K(e,t){let n=e.childSessionKey??e.sessionKey;return n?o`<a
    class="session-link"
    href=${`${C(`chat`,t.basePath)}${y(n)}`}
    @click=${e=>{e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),t.onNavigateToChat(n))}}
    >${k(`tasksPage.openSession`)}</a
  >`:l}function q(e,t){let r=e.status===`queued`||e.status===`running`,i=I(e.updatedAt??e.createdAt),a=P(e),s=F(e),c=t.cancellingTaskIds.has(e.id);return o`
    <div class="list-item" data-task-id=${e.id}>
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="chip-row">
          <span class="chip ${H(e.status)}"
            >${z(e.status)}</span
          >
          <span class="chip">${ne(e)}</span>
          ${e.agentId?o`<span class="chip">${k(`tasksPage.agent`,{agent:e.agentId})}</span>`:l}
        </div>
        ${a?o`<div class="list-sub">${a}</div>`:l}
      </div>
      <div class="list-meta">
        ${i>0?o`<span title=${b(i)}>${n(i)}</span>`:o`<span>${k(`common.na`)}</span>`}
        ${K(e,t)}
        ${r&&t.canCancel?o`<button
              class="btn"
              type="button"
              aria-label=${k(`tasksPage.cancelTask`,{title:s})}
              ?disabled=${c||!t.connected}
              @click=${()=>t.onCancel(e.taskId)}
            >
              ${k(c?`tasksPage.cancelling`:`common.cancel`)}
            </button>`:l}
      </div>
    </div>
  `}function J(e){let t=(...t)=>e.filter(e=>t.includes(e.status)).length,n=t(`failed`,`timed_out`);return o`
    <section class="card summary-strip">
      <div class="summary-strip__stats">
        ${[{key:`running`,iconName:`play`,label:k(`tasksPage.status.running`),value:t(`running`)},{key:`queued`,iconName:`clock`,label:k(`tasksPage.status.queued`),value:t(`queued`)},{key:`completed`,iconName:`check`,label:k(`tasksPage.status.completed`),value:t(`completed`)},{key:`failed`,iconName:`alertTriangle`,label:k(`tasksPage.status.failed`),value:n,danger:n>0}].map(e=>o`
            <div
              class="summary-stat ${e.danger?`summary-stat--danger`:``}"
              data-stat=${e.key}
            >
              <span class="summary-stat__icon" aria-hidden="true">${j(e.iconName)}</span>
              <div class="summary-stat__copy">
                <div class="summary-stat__label">${e.label}</div>
                <div class="summary-stat__value">${e.value}</div>
              </div>
            </div>
          `)}
      </div>
    </section>
  `}function Y(e,t,n,r,i,a){return o`
    <section class="card stack" data-task-section=${e}>
      <div class="row" style="justify-content: space-between; align-items: flex-start; gap: 12px;">
        <div>
          <div class="card-title">${t}</div>
          <div class="card-sub">${n}</div>
        </div>
        <div class="muted">
          ${r.length===1?k(`tasksPage.taskCountOne`):k(`tasksPage.taskCount`,{count:String(r.length)})}
        </div>
      </div>
      ${r.length===0?o`<div class="muted">${i}</div>`:o`<div class="list">
            ${u(r,e=>e.id,e=>q(e,a))}
          </div>`}
    </section>
  `}function X(e){let{active:t,recent:n}=R(e.tasks);return o`
    <div class="stack">
      ${e.connected?l:o`<div class="callout warn">${k(`tasksPage.disconnected`)}</div>`}
      ${e.error?o`<div class="callout danger">${e.error}</div>`:l}
      ${J(e.tasks)}
      ${e.loading&&e.tasks.length===0?o`<div class="card muted">${k(`tasksPage.loading`)}</div>`:l}
      ${!e.loading&&e.tasks.length===0?o`<div class="card muted">${k(`tasksPage.empty`)}</div>`:l}
      ${Y(`active`,k(`tasksPage.active`),k(`tasksPage.activeSub`),t,k(`tasksPage.emptyActive`),e)}
      ${Y(`recent`,k(`tasksPage.recent`),k(`tasksPage.recentSub`),n,k(`tasksPage.emptyRecent`),e)}
    </div>
  `}var Z=e((()=>{s(),d(),x(),M(),A(),m(),p(),B()}));function Q(e,t){return e instanceof Error&&e.message.trim()?e.message.trim():typeof e==`string`&&e.trim()?e.trim():t}function re(e,t){return t?e.agentId?.trim()?e.agentId.trim().toLowerCase()===t:[e.sessionKey,e.childSessionKey,e.ownerKey].some(e=>te(e)?.agentId===t):!0}var $;e((()=>{i(),s(),f(),O(),E(),w(),G(),A(),p(),h(),B(),ee(),v(),Z(),r(),$=class extends g{constructor(...e){super(...e),this.tasks=[],this.connected=!1,this.loading=!1,this.error=null,this.cancellingTaskIds=new Set,this.client=null,this.loadGeneration=0,this.operationEpoch=0,this.subscriptions=new _(this).effect(()=>this.context?.gateway,e=>{let t=this.gatewaySource!==void 0&&this.gatewaySource!==e;this.gatewaySource=e,this.applyGatewaySnapshot(e.snapshot,t);let n=e.subscribe(t=>{if(this.gatewaySource!==e||this.context.gateway!==e)return;let n=this.connected,r=this.client;this.applyGatewaySnapshot(t,!1),this.connected&&(this.client!==r||!n)&&this.refreshTasks()}),r=e.subscribeEvents(t=>{if(this.gatewaySource!==e||this.context.gateway!==e||!this.connected||t.event!==`task`)return;let n=U(this.tasks,t.payload);if(n.refetch){this.refreshTasks();return}this.tasks=n.tasks.filter(e=>re(e,this.context.agentSelection.state.scopeId))});return this.connected&&this.refreshTasks(),()=>{n(),r()}}).effect(()=>this.context?.agentSelection,e=>{let t=()=>{let t=e.state.scopeId;if(this.observedAgentScopeId===void 0){this.observedAgentScopeId=t;return}this.observedAgentScopeId!==t&&(this.observedAgentScopeId=t,this.invalidateGatewayWork(),this.tasks=[],this.connected&&this.refreshTasks(),this.requestUpdate())};return t(),e.subscribe(t)}).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.subscriptions.clear(),this.invalidateGatewayWork(),this.gatewaySource=void 0,this.client=null,this.connected=!1,super.disconnectedCallback()}applyGatewaySnapshot(e,t){let n=t||this.client!==e.client,r=this.connected!==e.connected;(n||r)&&this.invalidateGatewayWork(),n&&(this.client=e.client,this.tasks=[],this.error=null),this.connected=e.connected,e.connected&&this.context.agents.ensureList()}invalidateGatewayWork(){this.loadGeneration+=1,this.operationEpoch+=1,this.loading=!1,this.cancellingTaskIds=new Set}isCancelScopeCurrent(e,t,n){return this.isConnected&&this.connected&&this.gatewaySource===e&&this.context.gateway===e&&this.client===t&&this.operationEpoch===n}isLoadScopeCurrent(e,t,n){return this.isConnected&&this.connected&&this.gatewaySource===e&&this.context.gateway===e&&this.client===t&&this.loadGeneration===n}async refreshTasks(){let e=this.gatewaySource,t=this.client;if(!e||this.context.gateway!==e||!this.connected||!t)return;let n=++this.loadGeneration;this.loading=!0,this.error=null;try{let r=this.context.agentSelection.state.scopeId??void 0,[i,a]=await Promise.all([t.request(`tasks.list`,{status:[`queued`,`running`],limit:500,...r?{agentId:r}:{}}),t.request(`tasks.list`,{limit:200,...r?{agentId:r}:{}})]),o=N(i),s=N(a);if(!o||!s)throw Error(k(`tasksPage.invalidResponse`));let c=L(s,o);this.isLoadScopeCurrent(e,t,n)&&(this.tasks=c)}catch(r){this.isLoadScopeCurrent(e,t,n)&&(this.error=Q(r,k(`tasksPage.loadFailed`)))}finally{this.isLoadScopeCurrent(e,t,n)&&(this.loading=!1)}}async cancelTask(e){let t=this.client,n=this.gatewaySource;if(!n||this.context.gateway!==n||!this.connected||!t||this.cancellingTaskIds.has(e))return;let r=this.operationEpoch;this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let i=await t.request(`tasks.cancel`,{taskId:e});if(!this.isCancelScopeCurrent(n,t,r))return;let a=V(i);a?.task&&(this.tasks=U(this.tasks,{action:`upserted`,task:a.task}).tasks),a?.cancelled||(this.error=a?.reason?.trim()||k(`tasksPage.cancelFailed`))}catch(e){this.isCancelScopeCurrent(n,t,r)&&(this.error=Q(e,k(`tasksPage.cancelFailed`)))}finally{if(this.isCancelScopeCurrent(n,t,r)){let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}render(){return o`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${T(`tasks`)}</div>
        </div>
        <div class="page-header-actions">
          ${W({agents:this.context.agents.state.agentsList?.agents??[],selection:this.context.agentSelection})}
          <button
            class="btn"
            type="button"
            ?disabled=${!this.connected||this.loading}
            @click=${()=>void this.refreshTasks()}
          >
            ${this.loading?k(`common.refreshing`):k(`common.refresh`)}
          </button>
        </div>
      </section>
      ${X({basePath:this.context.basePath,connected:this.connected,canCancel:S(this.context.gateway.snapshot.hello?.auth??null),loading:this.loading,error:this.error,tasks:this.tasks,cancellingTaskIds:this.cancellingTaskIds,onCancel:e=>void this.cancelTask(e),onNavigateToChat:e=>this.context.navigate(`chat`,{search:y(e)})})}
    `}},t([a({context:D,subscribe:!0})],$.prototype,`context`,void 0),t([c()],$.prototype,`tasks`,void 0),t([c()],$.prototype,`connected`,void 0),t([c()],$.prototype,`loading`,void 0),t([c()],$.prototype,`error`,void 0),t([c()],$.prototype,`cancellingTaskIds`,void 0),customElements.get(`openclaw-tasks-page`)||customElements.define(`openclaw-tasks-page`,$)}))();
//# sourceMappingURL=tasks-page-D4jGuGQs.js.map