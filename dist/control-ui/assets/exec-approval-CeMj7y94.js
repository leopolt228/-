import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,u as n}from"./control-ui-foundation-43q8Lf_T.js";import{$ as r,B as i,G as a,J as o,U as s,X as c,z as l}from"./lit-runtime-CE4wpvNA.js";import{Pi as u,ji as d}from"./control-ui-core-Dx4utKSD.js";import{bt as f,xt as p}from"./control-ui-core-6OhF3OIO.js";import{o as m,t as h}from"./control-ui-core-CXeSrnoQ.js";import{D as g}from"./control-ui-core-vPyynwls.js";import{a as _,i as v,n as y,o as b,r as x,t as S}from"./exec-approval-card-BtCcEiBp.js";function C(e){let t=e.replace(/\s+/g,` `).trim();return t.length>64?`${t.slice(0,61)}…`:t}function w(e){let t=e.queue.filter(t=>t.id!==e.activeId);return t.length===0?c:r`
    <div class="exec-approval-list" aria-label=${m(`execApproval.otherPending`)}>
      <div class="exec-approval-list__heading">${m(`execApproval.otherPending`)}</div>
      ${t.map(t=>{let n=C(t.request.command),i=t.request.agentId?.trim()||`—`,a=x(t.expiresAtMs,e.nowMs);return r`
          <button
            class="exec-approval-list__item"
            type="button"
            aria-label=${m(`execApproval.reviewRequest`,{agent:i,command:n})}
            @click=${()=>e.onSelect(t.id)}
          >
            <span class="exec-approval-list__agent">${i}</span>
            <span class="exec-approval-list__command mono">${n}</span>
            <span class="exec-approval-list__expiry" aria-hidden="true">${a}</span>
          </button>
        `})}
    </div>
  `}function T(e){return e.composedPath().some(e=>e instanceof Element&&e.closest(`input, textarea, [contenteditable]:not([contenteditable='false'])`)!==null)}function E(e){return!((e.metaKey||e.ctrlKey)&&!e.altKey)||T(e)?null:e.key===`Enter`?e.shiftKey?`allow-always`:`allow-once`:!e.shiftKey&&e.key.toLowerCase()===`d`?`deny`:null}var D;e((()=>{o(),l(),f(),h(),u(),v(),g(),n(),D=class extends d{constructor(...e){super(...e),this.selectedApprovalId=null,this.forceShowAll=!1}show(){this.forceShowAll=!0,this.updateComplete.then(()=>this.dialog?.show())}displayedQueue(){let e=this.props;return e?this.forceShowAll?e.queue:p(e.queue,e.inlineApprovalId):[]}activeApproval(e){return e.find(e=>e.id===this.selectedApprovalId)??e.at(0)??null}handleKeydown(e,t){if(e.defaultPrevented||e.repeat||this.props?.busy)return;let n=E(e);!n||!b(t).includes(n)||(e.preventDefault(),this.props?.onDecision(t.id,n))}willUpdate(e){if(e.get(`props`)?.queue.length&&!this.props?.queue.length){this.forceShowAll=!1,this.selectedApprovalId=null;return}let t=this.displayedQueue();t.some(e=>e.id===this.selectedApprovalId)||(this.selectedApprovalId=t.at(0)?.id??null)}render(){let e=this.props,t=this.displayedQueue(),n=this.activeApproval(t);if(!e||!n)return c;let i=b(n);return r`
      <openclaw-modal-dialog
        label=${y(n)}
        description=${S(n.expiresAtMs,e.nowMs)}
        @keydown=${e=>this.handleKeydown(e,n)}
        @modal-cancel=${()=>{!e.busy&&i.includes(`deny`)&&e.onDecision(n.id,`deny`)}}
      >
        <div class="exec-approval-modal-stack">
          ${_({approval:n,busy:e.busy,error:e.errors.get(n.id)??null,nowMs:e.nowMs,variant:`modal`,queueCount:t.length,onDecision:e.onDecision})}
          ${w({queue:t,activeId:n.id,nowMs:e.nowMs,onSelect:e=>{this.selectedApprovalId=e}})}
        </div>
      </openclaw-modal-dialog>
    `}},t([a({attribute:!1})],D.prototype,`props`,void 0),t([i(`openclaw-modal-dialog`)],D.prototype,`dialog`,void 0),t([s()],D.prototype,`selectedApprovalId`,void 0),t([s()],D.prototype,`forceShowAll`,void 0),customElements.get(`openclaw-exec-approval`)||customElements.define(`openclaw-exec-approval`,D)}))();
//# sourceMappingURL=exec-approval-CeMj7y94.js.map