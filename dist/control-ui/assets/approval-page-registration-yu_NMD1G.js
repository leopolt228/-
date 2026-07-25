import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,u as n}from"./control-ui-foundation-43q8Lf_T.js";import{dt as r,ft as i}from"./control-ui-foundation-DQl2NL7K.js";import{$ as a,G as o,J as s,U as c,X as l,z as u}from"./lit-runtime-CE4wpvNA.js";import{_t as d,gt as f}from"./control-ui-foundation-DFIFKu9N.js";import{Mi as p,Pi as m}from"./control-ui-core-Dx4utKSD.js";import{Gt as h,Wt as g,at as _,ft as v,it as y,ut as b}from"./control-ui-core-6OhF3OIO.js";import{i as x,o as S,t as C}from"./control-ui-core-CXeSrnoQ.js";import{i as w,n as T,t as E}from"./approval-result-validators-BO4pfEC7.js";var D=e((()=>{}));function O(e){return e instanceof g?(d(e.details)?e.details.reason:void 0)===`APPROVAL_NOT_FOUND`||e.gatewayCode===`APPROVAL_NOT_FOUND`||e.gatewayCode===`INVALID_REQUEST`:!1}function k(e){return new Intl.DateTimeFormat(x.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(e))}function A(e){switch(e){case`allow-once`:return S(`execApproval.allowOnce`);case`allow-always`:return S(`execApproval.alwaysAllow`);case`deny`:return S(`execApproval.deny`)}return e}function j(e,t){return e.applied?t===`deny`?e.approval.status===`denied`:e.approval.status===`allowed`&&e.approval.decision===t:!0}function M(e,t){return t?a`<div class="approval-page__meta-row">
        <dt>${e}</dt>
        <dd title=${t}><bdi dir="ltr">${t}</bdi></dd>
      </div>`:l}function N(e){return e.kind===`exec`?a`
      ${e.warningText?a`<div class="approval-page__warning" role="note">${e.warningText}</div>`:l}
      ${e.commandPreview?a`
            <div class="approval-page__preview-label">${S(`approvalPage.summaryLabel`)}</div>
            <div class="approval-page__summary mono" dir="ltr">${e.commandPreview}</div>
          `:l}
      <div class="approval-page__preview-label">${S(`approvalPage.commandLabel`)}</div>
      <pre class="approval-page__preview mono" dir="ltr">${e.commandText}</pre>
      <dl class="approval-page__meta">
        ${M(S(`execApproval.labels.host`),e.host)}
        ${M(S(`approvalPage.nodeLabel`),e.nodeId)}
        ${M(S(`execApproval.labels.agent`),e.agentId)}
      </dl>
    `:a`
    <div class="approval-page__preview-label">${S(`approvalPage.requestLabel`)}</div>
    <div class=${`approval-page__preview approval-page__preview--prose`}>${e.description}</div>
    <dl class="approval-page__meta">
      ${e.kind===`plugin`?a`${M(S(`execApproval.labels.severity`),e.severity)}
            ${M(S(`execApproval.labels.plugin`),e.pluginId)}
            ${M(S(`approvalPage.toolLabel`),e.toolName)}`:l}
      ${M(S(`execApproval.labels.agent`),e.agentId)}
    </dl>
  `}function P(e,t){if(t===`elsewhere`&&(e.status===`allowed`||e.status===`denied`))return S(`approvalPage.resolvedElsewhere`);if(t===`here`&&e.status===`allowed`)return S(`approvalPage.approvedHere`);if(t===`here`&&e.status===`denied`)return S(`approvalPage.deniedHere`);let n=e.status;switch(n){case`allowed`:return S(`approvalPage.approved`);case`denied`:return S(`approvalPage.denied`);case`expired`:return S(`approvalPage.expired`);case`cancelled`:return S(`approvalPage.cancelled`);case`pending`:return S(`approvalPage.pending`)}return n}function F(e,t){if(t===`elsewhere`&&(e.status===`allowed`||e.status===`denied`))return S(`approvalPage.resolvedElsewhereDescription`);let n=e.status;switch(n){case`allowed`:return e.decision===`allow-always`?S(`approvalPage.allowedAlwaysDescription`):S(`approvalPage.allowedOnceDescription`);case`denied`:return S(`approvalPage.deniedDescription`);case`expired`:return S(`approvalPage.expiredDescription`);case`cancelled`:return S(`approvalPage.cancelledDescription`);case`pending`:return S(`approvalPage.pendingDescription`)}return n}var I,L,R,z=e((()=>{D(),r(),f(),s(),u(),E(),h(),_(),v(),C(),m(),n(),I=2e3,L=250,R=class extends p{constructor(...e){super(...e),this.approvalId=``,this.approval=null,this.connected=!1,this.loading=!0,this.resolving=!1,this.resolvingDecision=null,this.requestError=null,this.resolutionOrigin=`observed`,this.client=null,this.operationGeneration=0,this.handleVisibilityChange=()=>{if(document.visibilityState!==`visible`){this.clearPollTimer();return}this.approval?.status===`pending`&&this.hasGatewayConnection&&!this.resolving&&this.loadApproval({background:!0})}}connectedCallback(){this.replaceChildren(),super.connectedCallback(),document.addEventListener(`visibilitychange`,this.handleVisibilityChange),this.previousDocumentTitle=document.title,this.bindApprovalId(!0),this.stopGateway=this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.stopGateway?.(),this.stopGateway=void 0,this.invalidateOperations(),this.clearPollTimer(),this.client=null,this.connected=!1,this.previousDocumentTitle!==void 0&&(!this.activeDocumentTitle||document.title===this.activeDocumentTitle)&&(document.title=this.previousDocumentTitle),this.previousDocumentTitle=void 0,this.activeDocumentTitle=void 0,super.disconnectedCallback()}updated(e){e.has(`approvalId`)&&this.bindApprovalId(),this.updateDocumentTitle()}bindApprovalId(e=!1){!e&&this.boundApprovalId===this.approvalId||(this.boundApprovalId=this.approvalId,this.invalidateOperations(),this.clearPollTimer(),this.approval=null,this.loading=!!this.approvalId,this.resolving=!1,this.resolvingDecision=null,this.requestError=this.approvalId?null:`unavailable`,this.resolutionOrigin=`observed`,this.approvalId&&this.connected&&this.client&&this.loadApproval())}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.connected!==this.connected,r=e.connected&&!this.connected;if(this.client=e.client,this.connected=e.connected,(t||n)&&(this.invalidateOperations(),this.clearPollTimer(),this.resolving=!1,this.resolvingDecision=null),!e.connected||!e.client){this.approvalId&&(this.loading=!1,this.requestError=!this.approval||this.approval.status===`pending`?`connection`:null);return}if(!this.approvalId){this.loading=!1,this.requestError=`unavailable`;return}if(t||r||!this.approval){this.loadApproval();return}this.schedulePoll()}invalidateOperations(){this.operationGeneration+=1}isCurrentOperation(e){return this.hasGatewayConnection&&this.client===e.client&&this.approvalId===e.id&&this.operationGeneration===e.generation}get hasGatewayConnection(){return this.connected&&!!this.client}async loadApproval(e={}){let t=this.client,n=this.approvalId;if(!t||!this.connected||!n)return;let r=++this.operationGeneration,i=this.approval?.status,a=!1;this.clearPollTimer(),e.background||(this.loading=!0);try{let e=await t.request(`approval.get`,{id:n});if(!this.isCurrentOperation({client:t,generation:r,id:n}))return;if(!T(e)||e.approval.id!==n){this.approval=null,this.requestError=`unavailable`;return}this.requestError=null,this.approval=e.approval,e.approval.status===`pending`?this.resolutionOrigin=`observed`:i===`pending`&&this.resolutionOrigin===`observed`&&(this.resolutionOrigin=`elsewhere`,a=!0)}catch(e){if(!this.isCurrentOperation({client:t,generation:r,id:n}))return;O(e)?(this.approval=null,this.requestError=`unavailable`):this.requestError=`connection`}finally{this.isCurrentOperation({client:t,generation:r,id:n})&&(this.loading=!1,this.schedulePoll())}a&&this.isCurrentOperation({client:t,generation:r,id:n})&&await this.focusTerminalState()}async resolveApproval(e){let t=this.approval,n=this.client,r=this.approvalId;if(!n||!this.connected||!r||t?.status!==`pending`||!Array.prototype.includes.call(t.presentation.allowedDecisions,e)||this.resolving)return;let i=t.presentation.kind,a=++this.operationGeneration,o=!1,s=!1;this.clearPollTimer(),this.resolving=!0,this.resolvingDecision=e,this.requestError=null;try{let t=await n.request(`approval.resolve`,{id:r,kind:i,decision:e});if(!this.isCurrentOperation({client:n,generation:a,id:r}))return;!w(t)||t.approval.id!==r||t.approval.presentation.kind!==i||!j(t,e)?(this.requestError=`connection`,s=!0):(this.approval=t.approval,this.resolutionOrigin=t.applied?`here`:`elsewhere`,o=!0)}catch(e){if(!this.isCurrentOperation({client:n,generation:a,id:r}))return;this.requestError=O(e)?`unavailable`:`connection`}finally{this.isCurrentOperation({client:n,generation:a,id:r})&&(this.resolving=!1,this.resolvingDecision=null,this.schedulePoll())}if(s&&this.isCurrentOperation({client:n,generation:a,id:r})){await this.loadApproval({background:!0});return}o&&this.isCurrentOperation({client:n,generation:a,id:r})&&await this.focusTerminalState()}async focusTerminalState(){if(await this.updateComplete,this.approval?.status===`pending`)return;let e=this.querySelector(`#approval-page-title`);e?.focus({preventScroll:!0}),typeof e?.scrollIntoView==`function`&&e.scrollIntoView({behavior:`auto`,block:`center`,inline:`nearest`})}clearPollTimer(){this.pollTimer!==void 0&&(globalThis.clearTimeout(this.pollTimer),this.pollTimer=void 0)}schedulePoll(){this.clearPollTimer();let e=this.approval;if(!this.hasGatewayConnection||this.resolving||this.requestError===`unavailable`||e?.status!==`pending`||document.visibilityState!==`visible`)return;let t=e.expiresAtMs-Date.now(),n=Math.max(L,Math.min(I,t+L));this.pollTimer=globalThis.setTimeout(()=>{this.pollTimer=void 0,this.loadApproval({background:!0})},n)}renderHeader(){return a`
      <header class="approval-page__brand">
        <img
          class="approval-page__logo"
          src=${b(`apple-touch-icon.png`,this.context.basePath)}
          alt=""
        />
        <div>
          <div class="approval-page__eyebrow">${S(`approvalPage.eyebrow`)}</div>
          <div class="approval-page__brand-name">${S(`approvalPage.brandName`)}</div>
        </div>
      </header>
    `}renderLoading(){return a`
      <div class="approval-page__state approval-page__state--loading" role="status">
        <div class="approval-page__spinner" aria-hidden="true"></div>
        <h1 id="approval-page-title">${S(`approvalPage.loadingTitle`)}</h1>
        <p>${S(`approvalPage.loadingDescription`)}</p>
      </div>
    `}renderUnavailable(){return a`
      <div class="approval-page__state approval-page__state--unavailable" role="alert">
        <div class="approval-page__state-mark" aria-hidden="true">!</div>
        <h1 id="approval-page-title">${S(`approvalPage.unavailableTitle`)}</h1>
        <p>${S(`approvalPage.unavailableDescription`)}</p>
      </div>
    `}renderConnectionState(){return a`
      <div class="approval-page__state approval-page__state--connection" role="alert">
        <div class="approval-page__state-mark" aria-hidden="true">!</div>
        <h1 id="approval-page-title">${S(`approvalPage.connectionErrorTitle`)}</h1>
        <p>${S(`approvalPage.connectionErrorDescription`)}</p>
        <button
          type="button"
          class="btn"
          ?disabled=${!this.hasGatewayConnection||this.loading}
          @click=${()=>void this.loadApproval()}
        >
          ${S(`approvalPage.retry`)}
        </button>
      </div>
    `}renderConnectionError(){return a`
      <div class="approval-page__callout" role="alert">
        <div>
          <strong>${S(`approvalPage.connectionErrorTitle`)}</strong>
          <span>${S(`approvalPage.connectionErrorDescription`)}</span>
        </div>
        <button
          type="button"
          class="btn btn--sm"
          ?disabled=${!this.hasGatewayConnection||this.loading}
          @click=${()=>void this.loadApproval()}
        >
          ${S(`approvalPage.retry`)}
        </button>
      </div>
    `}renderApproval(e){let t=e.status===`pending`,n=e.presentation,r=t?n.kind===`plugin`?n.title:S(`approvalPage.execTitle`):P(e,this.resolutionOrigin),i=t?S(`approvalPage.pendingDescription`):F(e,this.resolutionOrigin);return a`
      <div class="approval-page__status" aria-live="polite" aria-atomic="true">
        <span
          class="approval-page__status-dot approval-page__status-dot--${e.status}"
          aria-hidden="true"
        ></span>
        ${t?S(`approvalPage.pending`):P(e,this.resolutionOrigin)}
      </div>
      <div class="approval-page__heading">
        <h1 id="approval-page-title" tabindex=${t?l:-1}>${r}</h1>
        <p>${i}</p>
      </div>
      ${N(n)}
      <div class="approval-page__timing">
        <span>${S(t?`approvalPage.expiresLabel`:`approvalPage.resolvedLabel`)}</span>
        <time
          datetime=${new Date(t?e.expiresAtMs:e.resolvedAtMs).toISOString()}
        >
          ${k(t?e.expiresAtMs:e.resolvedAtMs)}
        </time>
      </div>
      ${this.requestError===`connection`?this.renderConnectionError():l}
      ${t?a`
            <div
              class="approval-page__actions"
              role="group"
              aria-label=${S(`approvalPage.actionsLabel`)}
            >
              ${n.allowedDecisions.map(e=>a`
                  <button
                    type="button"
                    class="btn approval-page__action approval-page__action--${e}"
                    data-decision=${e}
                    ?disabled=${this.resolving||!this.hasGatewayConnection||this.requestError!==null}
                    @click=${()=>void this.resolveApproval(e)}
                  >
                    ${this.resolvingDecision===e?S(`approvalPage.resolvingDecision`,{decision:A(e)}):A(e)}
                  </button>
                `)}
            </div>
          `:a`
            <div class="approval-page__terminal" role="status">
              ${S(`approvalPage.safeToClose`)}
            </div>
          `}
    `}render(){let e=this.requestError===`unavailable`,t=this.requestError===`connection`&&!this.approval;return a`
      <main class="approval-page" data-state=${e?`unavailable`:t?`connection-error`:this.approval?.status??`loading`}>
        <div class="approval-page__backdrop" aria-hidden="true"></div>
        <section
          class="approval-page__card"
          aria-labelledby="approval-page-title"
          aria-busy=${this.loading||this.resolving?`true`:`false`}
        >
          ${this.renderHeader()}
          <div class="approval-page__content">
            ${this.loading&&!this.approval?this.renderLoading():t?this.renderConnectionState():e||!this.approval?this.renderUnavailable():this.renderApproval(this.approval)}
          </div>
        </section>
        <a class="approval-page__back-link" href=${`${this.context.basePath}/chat`}>
          ${S(`approvalPage.openControlUi`)}
        </a>
      </main>
    `}updateDocumentTitle(){let e=`${this.requestError===`unavailable`?S(`approvalPage.unavailableTitle`):this.requestError===`connection`&&!this.approval?S(`approvalPage.connectionErrorTitle`):this.approval?this.approval.status===`pending`?this.approval.presentation.kind===`plugin`?this.approval.presentation.title:S(`approvalPage.execTitle`):P(this.approval,this.resolutionOrigin):S(`approvalPage.loadingTitle`)} — ${S(`approvalPage.brandName`)}`;document.title=e,this.activeDocumentTitle=e}},t([i({context:y,subscribe:!1})],R.prototype,`context`,void 0),t([o({attribute:`approval-id`})],R.prototype,`approvalId`,void 0),t([c()],R.prototype,`approval`,void 0),t([c()],R.prototype,`connected`,void 0),t([c()],R.prototype,`loading`,void 0),t([c()],R.prototype,`resolving`,void 0),t([c()],R.prototype,`resolvingDecision`,void 0),t([c()],R.prototype,`requestError`,void 0),t([c()],R.prototype,`resolutionOrigin`,void 0)}));e((()=>{z(),customElements.get(`openclaw-approval-page`)||customElements.define(`openclaw-approval-page`,R)}))();
//# sourceMappingURL=approval-page-registration-yu_NMD1G.js.map