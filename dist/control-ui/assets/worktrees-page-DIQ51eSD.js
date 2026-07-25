import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,r as n,u as r}from"./control-ui-foundation-43q8Lf_T.js";import{dt as i,ft as a}from"./control-ui-foundation-DQl2NL7K.js";import{$ as o,J as s,U as c,X as l,z as u}from"./lit-runtime-CE4wpvNA.js";import{$n as d,Ci as f,Mi as p,Mr as m,Nr as h,Pi as g,xr as _}from"./control-ui-core-Dx4utKSD.js";import{Ct as v,Tt as y,Ut as b,at as x,it as S,jt as C}from"./control-ui-core-6OhF3OIO.js";import{o as w,t as T}from"./control-ui-core-CXeSrnoQ.js";import{n as E,t as D}from"./settings-workspace-BhCB-OeS.js";import{a as O,c as k,n as A,o as j,t as M,u as N}from"./settings-ui-BJ5HJKwt.js";import{n as P,t as F}from"./sessions-hub-tabs-eM_x01uP.js";function I(e){return e.split(/[\\/]/).findLast(Boolean)??e}var L;e((()=>{i(),s(),u(),C(),v(),x(),F(),M(),D(),T(),f(),d(),g(),h(),r(),L=class extends p{constructor(...e){super(...e),this.loading=!1,this.records=[],this.error=null,this.busyId=null,this.createOpen=!1,this.createRepoRoot=``,this.createName=``,this.createBaseRef=``,this.createBranches=[],this.creating=!1,this.client=null,this.gatewayConnected=!1,this.hasBoundGateway=!1,this.loadGeneration=0,this.branchesGeneration=0,this.operationEpoch=0,this.subscriptions=new m(this).effect(()=>this.context?.gateway,e=>{let t=this.hasBoundGateway&&this.gatewaySource!==e;return this.gatewaySource=e,this.hasBoundGateway=!0,this.applyGatewaySnapshot(e.snapshot,t),e.subscribe(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.applyGatewaySnapshot(t)})})}disconnectedCallback(){this.subscriptions.clear(),this.invalidateLoad(),this.invalidateOperations(),this.gatewaySource=void 0,this.client=null,this.gatewayConnected=!1,super.disconnectedCallback()}applyGatewaySnapshot(e,t=!1){let n=e.client!==this.client,r=e.connected!==this.gatewayConnected,i=t||n;this.client=e.client,this.gatewayConnected=e.connected,(i||r)&&(this.invalidateLoad(),this.invalidateOperations()),i&&(this.records=[],this.error=null),e.connected&&e.client&&this.load()}invalidateLoad(){this.loadGeneration+=1,this.loading=!1}invalidateOperations(){this.operationEpoch+=1,this.busyId=null,this.creating=!1}captureOperationScope(){let e=this.gatewaySource,t=this.client;return!e||!t||!this.gatewayConnected||!this.isConnected||this.context.gateway!==e?null:{gateway:e,client:t,epoch:this.operationEpoch}}isOperationScopeCurrent(e){return this.isConnected&&this.gatewayConnected&&this.gatewaySource===e.gateway&&this.context.gateway===e.gateway&&this.client===e.client&&this.operationEpoch===e.epoch}get operationPending(){return this.loading||this.busyId!==null||this.creating}async load(e={}){let t=this.client;if(!t||!this.gatewayConnected||this.operationPending)return;let n=++this.loadGeneration;this.loading=!0,e.preserveError||(this.error=null);try{let e=await t.request(`worktrees.list`,{});n===this.loadGeneration&&t===this.client&&(this.records=e.worktrees.toSorted((e,t)=>t.lastActiveAt-e.lastActiveAt))}catch(e){n===this.loadGeneration&&t===this.client&&(this.error=String(e))}finally{n===this.loadGeneration&&t===this.client&&(this.loading=!1)}}async removeWorktree(e){let t=this.captureOperationScope();if(!(!t||this.operationPending||!window.confirm(w(`worktrees.confirmDelete`,{name:e.name})))){this.busyId=e.id,this.error=null;try{let n=await t.client.request(`worktrees.remove`,{id:e.id});if(!this.isOperationScopeCurrent(t)||n.removed)return;let r=n.snapshotError??``;if(!window.confirm(w(`worktrees.confirmForceDelete`,{error:r}))){this.error=r||null;return}if(!this.isOperationScopeCurrent(t))return;try{await t.client.request(`worktrees.remove`,{id:e.id,force:!0})}catch(e){this.isOperationScopeCurrent(t)&&(this.error=String(e))}}catch(e){this.isOperationScopeCurrent(t)&&(this.error=String(e))}finally{this.isOperationScopeCurrent(t)&&(this.busyId=null,await this.load({preserveError:!0}))}}}async restore(e){let t=this.captureOperationScope();if(!(!t||this.operationPending)){this.busyId=e.id,this.error=null;try{await t.client.request(`worktrees.restore`,{id:e.id})}catch(e){this.isOperationScopeCurrent(t)&&(this.error=String(e))}finally{this.isOperationScopeCurrent(t)&&(this.busyId=null,await this.load({preserveError:!0}))}}}async gc(){let e=this.captureOperationScope();if(!(!e||this.operationPending)){this.loading=!0,this.error=null;try{await e.client.request(`worktrees.gc`,{})}catch(t){this.isOperationScopeCurrent(e)&&(this.error=String(t))}finally{this.isOperationScopeCurrent(e)&&(this.loading=!1,await this.load({preserveError:!0}))}}}toggleCreate(){if(!this.creating&&(this.createOpen=!this.createOpen,this.createOpen&&!this.createRepoRoot)){let e=this.context.agents.state.agentsList,t=e?.agents.find(t=>t.id===e.defaultId);this.createRepoRoot=t?.workspace??``,this.loadCreateBranches()}}loadCreateBranches(){let e=++this.branchesGeneration,t=this.captureOperationScope(),n=this.createRepoRoot.trim();if(!t||!n){this.createBranches=[];return}t.client.request(`worktrees.branches`,{repoRoot:n}).then(n=>{e===this.branchesGeneration&&this.isOperationScopeCurrent(t)&&(this.createBranches=n.branches.map(e=>e.name),this.createBaseRef||=n.defaultBranch??n.headBranch??``)}).catch(()=>{e===this.branchesGeneration&&this.isOperationScopeCurrent(t)&&(this.createBranches=[])})}async createWorktree(){let e=this.captureOperationScope(),t=this.createRepoRoot.trim();if(!(!e||!t||this.operationPending)){this.creating=!0,this.error=null;try{await e.client.request(`worktrees.create`,{repoRoot:t,...this.createName.trim()?{name:this.createName.trim()}:{},...this.createBaseRef.trim()?{baseRef:this.createBaseRef.trim()}:{}}),this.isOperationScopeCurrent(e)&&(this.createOpen=!1,this.createName=``)}catch(t){this.isOperationScopeCurrent(e)&&(this.error=String(t))}finally{this.isOperationScopeCurrent(e)&&(this.creating=!1,await this.load({preserveError:!0}))}}}renderOwner(e){return e.ownerKind===`session`&&e.ownerId?o`<a href=${`${y(`chat`,this.context.basePath)}${_(e.ownerId)}`} title=${e.ownerId}>${w(`worktrees.ownerSession`)}</a>`:e.ownerKind===`workboard`?o`<span title=${e.ownerId??``}>${w(`worktrees.ownerWorkboard`)}</span>`:o`<span>${w(`worktrees.ownerManual`)}</span>`}renderCreateRows(){return this.createOpen?o`
      ${j({title:w(`worktrees.repo`),control:o`
          <input
            class="settings-input"
            type="text"
            aria-label=${w(`worktrees.repo`)}
            ?disabled=${this.creating}
            .value=${this.createRepoRoot}
            @change=${e=>{this.createRepoRoot=e.target.value,this.createBaseRef=``,this.loadCreateBranches()}}
          />
        `})}
      ${j({title:w(`worktrees.name`),control:o`
          <input
            class="settings-input"
            type="text"
            aria-label=${w(`worktrees.name`)}
            ?disabled=${this.creating}
            placeholder=${w(`newSession.worktreeNamePlaceholder`)}
            .value=${this.createName}
            @input=${e=>{this.createName=e.target.value}}
          />
        `})}
      ${j({title:w(`newSession.baseBranch`),control:o`
          <input
            class="settings-input"
            type="text"
            aria-label=${w(`newSession.baseBranch`)}
            ?disabled=${this.creating}
            list="worktrees-create-branches"
            .value=${this.createBaseRef}
            @input=${e=>{this.createBaseRef=e.target.value}}
          />
          <datalist id="worktrees-create-branches">
            ${this.createBranches.map(e=>o`<option value=${e}></option>`)}
          </datalist>
        `})}
      ${j({title:w(`worktrees.newWorktree`),control:o`
          <button
            class="btn btn--sm"
            ?disabled=${this.operationPending||!this.createRepoRoot.trim()}
            @click=${()=>void this.createWorktree()}
          >
            ${this.creating?w(`common.loading`):w(`common.create`)}
          </button>
        `})}
    `:l}renderRecordRow(e){return j({title:e.name,description:o`
        <span title=${e.repoRoot}>${I(e.repoRoot)}</span> · ${e.branch} ·
        ${this.renderOwner(e)} · ${n(e.lastActiveAt)}
      `,control:o`
        ${e.removedAt?N({kind:`muted`,label:w(`worktrees.restorable`)}):N({kind:`ok`,label:w(`common.active`)})}
        <button
          class=${e.removedAt?`btn btn--sm`:`btn btn--sm danger`}
          ?disabled=${this.operationPending}
          @click=${()=>void(e.removedAt?this.restore(e):this.removeWorktree(e))}
        >
          ${e.removedAt?w(`worktrees.restore`):w(`common.delete`)}
        </button>
      `})}render(){let e=o`
      <button class="btn" ?disabled=${this.creating} @click=${()=>this.toggleCreate()}>
        ${w(`worktrees.newWorktree`)}
      </button>
      <button class="btn" ?disabled=${this.operationPending} @click=${()=>void this.gc()}>
        ${this.loading?w(`common.loading`):w(`worktrees.cleanNow`)}
      </button>
    `,t=o`
      ${this.renderCreateRows()}
      ${this.records.length===0?A(w(`worktrees.empty`)):this.records.map(e=>this.renderRecordRow(e))}
    `,n=O(o`
        ${this.error?o`<div class="callout danger">${this.error}</div>`:l}
        ${k({title:w(`worktrees.title`),description:w(`worktrees.subtitle`),actions:e},t)}
      `,{wide:!0});return o`
      <section class="content-header">
        <div>
          <div class="page-title">${b(`sessions`)}</div>
        </div>
        ${P({active:`worktrees`,onSelect:e=>{e!==`worktrees`&&this.context?.navigate(e)}})}
      </section>
      ${E(n,{id:`sessions-hub-panel`})}
    `}},t([a({context:S,subscribe:!0})],L.prototype,`context`,void 0),t([c()],L.prototype,`loading`,void 0),t([c()],L.prototype,`records`,void 0),t([c()],L.prototype,`error`,void 0),t([c()],L.prototype,`busyId`,void 0),t([c()],L.prototype,`createOpen`,void 0),t([c()],L.prototype,`createRepoRoot`,void 0),t([c()],L.prototype,`createName`,void 0),t([c()],L.prototype,`createBaseRef`,void 0),t([c()],L.prototype,`createBranches`,void 0),t([c()],L.prototype,`creating`,void 0),customElements.get(`openclaw-worktrees-page`)||customElements.define(`openclaw-worktrees-page`,L)}))();
//# sourceMappingURL=worktrees-page-DIQ51eSD.js.map