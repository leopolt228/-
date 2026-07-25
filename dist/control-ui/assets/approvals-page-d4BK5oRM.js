import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,u as n}from"./control-ui-foundation-43q8Lf_T.js";import{dt as r,ft as i}from"./control-ui-foundation-DQl2NL7K.js";import{$ as a,J as o,U as s,X as c,z as l}from"./lit-runtime-CE4wpvNA.js";import{Mi as u,Mr as d,Nr as f,Pi as p}from"./control-ui-core-Dx4utKSD.js";import{Ut as m,at as h,it as g,jt as _}from"./control-ui-core-6OhF3OIO.js";import{i as v,o as y,t as b}from"./control-ui-core-CXeSrnoQ.js";import{r as x,t as S}from"./approval-result-validators-BO4pfEC7.js";import{n as C,t as w}from"./settings-workspace-BhCB-OeS.js";import{a as T,t as E}from"./settings-ui-BJ5HJKwt.js";function D(e){return new Intl.DateTimeFormat(v.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(e))}function O(e){switch(e){case`exec`:return y(`approvalHistory.kinds.exec`);case`plugin`:return y(`approvalHistory.kinds.plugin`);case`system-agent`:return y(`approvalHistory.kinds.systemAgent`)}return e}function k(e){switch(e){case`allowed`:return y(`approvalHistory.statuses.allowed`);case`denied`:return y(`approvalHistory.statuses.denied`);case`expired`:return y(`approvalHistory.statuses.expired`);case`cancelled`:return y(`approvalHistory.statuses.cancelled`)}return e}function A(e){switch(e){case`allow-once`:return y(`approvalHistory.decisions.allowOnce`);case`allow-always`:return y(`approvalHistory.decisions.allowAlways`);case`deny`:return y(`approvalHistory.decisions.deny`);case void 0:return y(`approvalHistory.notApplicable`)}return e}function j(e){switch(e){case`user`:return y(`approvalHistory.reasons.user`);case`timeout`:return y(`approvalHistory.reasons.timeout`);case`malformed-verdict`:return y(`approvalHistory.reasons.malformedVerdict`);case`no-route`:return y(`approvalHistory.reasons.noRoute`);case`run-aborted`:return y(`approvalHistory.reasons.runAborted`);case`gateway-restart`:return y(`approvalHistory.reasons.gatewayRestart`);case`storage-corrupt`:return y(`approvalHistory.reasons.storageCorrupt`)}return e}function M(e){let t=e.presentation;return(t.kind===`exec`?t.commandText:t.title)||y(`approvalHistory.unknown`)}function N(e){let t=[e.source?.agentId,e.source?.sessionKey].filter(e=>!!e);return t.length>0?t.join(` · `):y(`approvalHistory.unknown`)}function P(e){return e.resolver?e.resolver.id?`${e.resolver.kind} · ${e.resolver.id}`:e.resolver.kind:y(`approvalHistory.unknown`)}var F,I;e((()=>{r(),o(),l(),S(),_(),h(),E(),w(),b(),p(),f(),n(),F=50,I=class extends u{constructor(...e){super(...e),this.items=[],this.nextCursor=null,this.loading=!1,this.loadingMore=!1,this.error=null,this.connected=!1,this.client=null,this.gatewaySource=null,this.requestGeneration=0,this.hasLoaded=!1,this.subscriptions=new d(this).effect(()=>this.context?.gateway,e=>(this.gatewaySource!==e&&(this.requestGeneration+=1,this.loading=!1,this.loadingMore=!1,this.hasLoaded=!1,this.items=[],this.nextCursor=null,this.error=null),this.gatewaySource=e,this.applyGatewaySnapshot(e.snapshot),e.subscribe(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.applyGatewaySnapshot(t)})))}disconnectedCallback(){this.subscriptions.clear(),this.requestGeneration+=1,this.gatewaySource=null,super.disconnectedCallback()}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.connected!==this.connected;this.connected=e.connected,t?(this.client=e.client,this.requestGeneration+=1,this.items=[],this.nextCursor=null,this.error=null,this.hasLoaded=!1,this.loading=!1,this.loadingMore=!1):n&&(this.requestGeneration+=1,this.loading=!1,this.loadingMore=!1,e.connected&&(this.hasLoaded=!1)),e.connected&&e.client&&!this.hasLoaded&&!this.loading&&this.loadPage(!0)}async loadPage(e){let t=this.client,n=this.gatewaySource;if(!t||!n||!this.connected||this.loading||this.loadingMore)return;let r=this.requestGeneration,i=e?void 0:this.nextCursor??void 0;if(!e&&!i)return;e?this.loading=!0:this.loadingMore=!0,this.error=null;let a=()=>this.isConnected&&this.connected&&this.gatewaySource===n&&this.context.gateway===n&&n.snapshot.connected&&this.client===t&&this.requestGeneration===r;try{let n=await t.request(`approval.history`,{...i?{cursor:i}:{},limit:F});if(!x(n))throw Error(y(`approvalHistory.invalidResponse`));if(!a())return;this.items=e?n.items:[...this.items,...n.items],this.nextCursor=n.nextCursor??null,this.hasLoaded=!0}catch(e){a()&&(this.error=String(e),this.hasLoaded=!0)}finally{a()&&(this.loading=!1,this.loadingMore=!1)}}renderTable(){return a`
      <div class="data-table-container">
        <table class="data-table approval-history-table">
          <thead>
            <tr>
              <th>${y(`approvalHistory.columns.resolved`)}</th>
              <th>${y(`approvalHistory.columns.kind`)}</th>
              <th>${y(`approvalHistory.columns.request`)}</th>
              <th>${y(`approvalHistory.columns.decision`)}</th>
              <th>${y(`approvalHistory.columns.reason`)}</th>
              <th>${y(`approvalHistory.columns.source`)}</th>
              <th>${y(`approvalHistory.columns.resolver`)}</th>
            </tr>
          </thead>
          <tbody>
            ${this.items.length===0?a`
                  <tr>
                    <td colspan="7" class="data-table-empty-cell">
                      <div class="data-table-empty-state" role="status" aria-live="polite">
                        ${this.loading?y(`approvalHistory.loading`):this.error||!this.hasLoaded?y(`approvalHistory.unknown`):y(`approvalHistory.empty`)}
                      </div>
                    </td>
                  </tr>
                `:this.items.map(e=>a`
                    <tr>
                      <td>${D(e.resolvedAtMs)}</td>
                      <td>${O(e.presentation.kind)}</td>
                      <td class="mono">${M(e)}</td>
                      <td>
                        ${k(e.status)} ·
                        ${A(`decision`in e?e.decision:void 0)}
                      </td>
                      <td>${j(e.reason)}</td>
                      <td class="mono">${N(e)}</td>
                      <td class="mono">${P(e)}</td>
                    </tr>
                  `)}
          </tbody>
        </table>
      </div>
      <div class="data-table-pagination">
        <div class="data-table-pagination__info">${y(`approvalHistory.retention`)}</div>
        <div class="data-table-pagination__controls">
          ${this.nextCursor?a`
                <button ?disabled=${this.loadingMore} @click=${()=>void this.loadPage(!1)}>
                  ${this.loadingMore?y(`approvalHistory.loadingMore`):y(`approvalHistory.loadMore`)}
                </button>
              `:c}
        </div>
      </div>
    `}render(){let e=T(a`
        <p class="settings-page__intro">${y(`approvalHistory.description`)}</p>
        ${this.connected?c:a`<div class="callout warn">${y(`approvalHistory.offline`)}</div>`}
        ${this.error?a`
              <div class="callout danger">
                ${this.error}
                <button class="btn btn--sm" @click=${()=>void this.loadPage(!0)}>
                  ${y(`common.retry`)}
                </button>
              </div>
            `:c}
        ${this.renderTable()}
      `,{wide:!0});return a`
      <section class="content-header">
        <div><div class="page-title">${m(`approvals`)}</div></div>
      </section>
      ${C(e)}
    `}},t([i({context:g,subscribe:!0})],I.prototype,`context`,void 0),t([s()],I.prototype,`items`,void 0),t([s()],I.prototype,`nextCursor`,void 0),t([s()],I.prototype,`loading`,void 0),t([s()],I.prototype,`loadingMore`,void 0),t([s()],I.prototype,`error`,void 0),t([s()],I.prototype,`connected`,void 0),customElements.get(`openclaw-approvals-page`)||customElements.define(`openclaw-approvals-page`,I)}))();
//# sourceMappingURL=approvals-page-d4BK5oRM.js.map