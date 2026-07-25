import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,o as n,u as r}from"./control-ui-foundation-43q8Lf_T.js";import{dt as i,ft as a}from"./control-ui-foundation-DQl2NL7K.js";import{$ as o,J as s,U as c,X as l,z as u}from"./lit-runtime-CE4wpvNA.js";import{st as d,ut as f}from"./control-ui-foundation-DFIFKu9N.js";import{$n as p,Bo as ee,Ci as m,Di as h,Ha as g,Mi as _,Mr as v,Nr as y,Pi as te,Si as ne,bi as re,hr as ie,io as ae}from"./control-ui-core-Dx4utKSD.js";import{Ut as oe,at as se,g as ce,it as le,jt as ue,p as de}from"./control-ui-core-6OhF3OIO.js";import{o as b,t as x}from"./control-ui-core-CXeSrnoQ.js";import{at as S,ot as C}from"./control-ui-core-vPyynwls.js";import{n as w,t as T}from"./settings-workspace-BhCB-OeS.js";import{d as E,o as D,t as O,u as k}from"./settings-ui-BJ5HJKwt.js";function A(e){return typeof e==`string`&&e.trim()||null}function j(e){return e&&typeof e==`object`?e:null}function M(e,t=Date.now()){let n=j(e),r=A(n?.runId),i=j(n?.data),a=n?.stream===`tool`,o=n?.stream===`item`&&A(i?.kind)===`answer_candidate`;if(!n||!a&&!o||!r||!i)return null;let s=A(n.sessionKey),c=A(n.agentId);return{stream:a?`tool`:`item`,runId:r,ts:typeof n.ts==`number`?n.ts:t,receivedAt:t,...s?{sessionKey:s}:{},...c?{agentId:c}:{},data:i}}function N(e){if(typeof e==`string`)return e;if(typeof e==`number`||typeof e==`boolean`)return String(e);let t=j(e);if(!t)return null;if(typeof t.text==`string`)return t.text;let n=t.content;if(!Array.isArray(n))return null;let r=n.map(e=>{let t=j(e);return t?.type===`text`&&typeof t.text==`string`?t.text:null}).filter(e=>!!e);return r.length>0?r.join(`
`):null}function P(e){let t=N(e);if(t!==null)return t;if(e==null)return null;try{return JSON.stringify(e,null,2)}catch{return ne(e)}}function F(e){return W.reduce((e,[t,n])=>e.replace(t,n),e)}function I(e){let t=P(e);if(!t)return{truncated:!1};let n=h(F(t),H);return{text:n.text,truncated:n.truncated}}function L(e){if(e==null)return 0;if(Array.isArray(e))return e.length;let t=j(e);return t?Object.keys(t).length:1}function R(e){return e?.isError===!0||e?.is_error===!0}function z(e){if(A(e.phase)!==`result`)return`running`;let t=j(e.result);if(R(e)||R(t))return`error`;let n=A(e.status)??A(t?.status);if(n&&/error|fail|failed|failure/i.test(n))return`error`;let r=Number(t?.exitCode??e.exitCode);return Number.isFinite(r)&&r!==0?`error`:`done`}function B(e){return U[e]}function fe(e,t,n){let r=`${n} argument${n===1?``:`s`} hidden`;return`${e} ${B(t)}; ${r}`}function V(e,t){let n=t.data??{};if(t.stream===`item`)return me(e,t);let r=A(n.toolCallId);if(!r)return e;let i=A(n.name)??`tool`,a=`${t.runId}:${r}`,o=t.receivedAt,s=typeof t.ts==`number`?t.ts:o,c=z(n),l=I(n.phase===`update`?n.partialResult:n.phase===`result`?n.result:null),u=e.find(e=>e.id===a),d=n.args===void 0?u?.hiddenArgumentCount??0:L(n.args),f=l.text??u?.outputPreview,p={id:a,toolCallId:r,runId:t.runId,...t.sessionKey?{sessionKey:t.sessionKey}:{},toolName:i,entryKind:`tool`,status:c,startedAt:u?.startedAt??s,updatedAt:o,durationMs:Math.max(0,o-(u?.startedAt??s)),outputTruncated:l.truncated||u?.outputTruncated===!0,summary:fe(i,c,d),hiddenArgumentCount:d,...f?{outputPreview:f}:{}};return(u?e.map(e=>e.id===a?p:e):[...e,p]).slice(-100)}function pe(e){return e===`candidate`||e===`superseded`||e===`selected`?e:null}function me(e,t){let n=A(t.data.itemId),r=pe(t.data.status);if(!n||!r)return e;let i=`${t.runId}:answer_candidate:${n}`,a=e.find(e=>e.id===i),o=t.receivedAt,s=a?.startedAt??t.ts,c=I(t.data.progressText),l={id:i,toolCallId:n,itemId:n,runId:t.runId,...t.sessionKey?{sessionKey:t.sessionKey}:{},toolName:`answer_candidate`,entryKind:`answer_candidate`,candidateStatus:r,status:r===`candidate`?`running`:`done`,startedAt:s,updatedAt:o,durationMs:Math.max(0,o-s),outputTruncated:c.truncated||a?.outputTruncated===!0,summary:`answer_candidate.${r}`,hiddenArgumentCount:0,...c.text?{outputPreview:c.text}:{}};return(a?e.map(e=>e.id===i?l:e):[...e,l]).slice(-100)}var H,U,W,he=e((()=>{m(),H=2e3,U={running:`running`,done:`completed`,error:`failed`},W=[[/\b(Authorization|Cookie|Set-Cookie)\s*:\s*[^\n\r]+/gi,`$1: [redacted]`],[/\b(Bearer\s+)[A-Za-z0-9._~+/=-]{12,}/gi,`$1[redacted]`],[/\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(["'])(\s*:\s*)"(?:\\.|[^"\\\r\n])*"/gi,`$1$2$3"[redacted]"`],[/\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(["'])(\s*:\s*)'(?:\\.|[^'\\\r\n])*'/gi,`$1$2$3'[redacted]'`],[/\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(\s*[:=]\s*)["']?[^"',\s}]+/gi,`$1$2[redacted]`],[/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,`[redacted private key]`],[/(^|[\s"'`=])(?:\/Users\/|\/home\/|\/var\/folders\/|[A-Za-z]:\\)[^\s"'`,;]+/g,`$1[redacted path]`]]})),ge=e((()=>{}));function _e(e){return re(e,{hour:`numeric`,minute:`2-digit`,second:`2-digit`},``)}function ve(e){return!Number.isFinite(e)||e<0?b(`common.na`):n(e,{spaced:!0})??`0ms`}function G(e){return b(`activity.status.${e}`)}function K(e){return e===1?b(`activity.argumentHiddenOne`):b(`activity.argumentsHidden`,{count:String(e)})}function q(e){return e.entryKind===`answer_candidate`?b(`activity.answerCandidate.${e.candidateStatus??`candidate`}`):b(`activity.entrySummary`,{argumentSummary:K(e.hiddenArgumentCount),status:G(e.status),tool:e.toolName})}function J(e){return e.entryKind===`answer_candidate`?b(`activity.answerCandidate.title`):e.toolName}function ye(e,t){return t?f([e.toolName,J(e),e.candidateStatus,e.status,e.summary,q(e),e.outputPreview,e.runId,e.toolCallId,e.sessionKey].filter(Boolean).join(` `)).includes(t):!0}function be(e){return d(e.map(e=>e.toolName))}function xe(e){let t=f(e.filterText);return e.entries.filter(n=>!e.statusFilters[n.status]||e.toolFilter&&n.toolName!==e.toolFilter?!1:ye(n,t))}function Se(e,t){return o`
    <label class="activity-status-filter">
      <input
        type="checkbox"
        .checked=${e.statusFilters[t]}
        @change=${n=>e.onStatusToggle(t,n.target.checked)}
      />
      <span>${G(t)}</span>
    </label>
  `}function Ce(e){return Z[e]}function we(e,t){let n=e.expandedIds.has(t.id);return o`
    <details
      class="activity-entry activity-entry--${t.status}"
      role="listitem"
      .open=${n}
      @toggle=${n=>e.onEntryToggle(t.id,n.currentTarget.open)}
    >
      <summary class="activity-entry__summary">
        <span class="activity-entry__chevron" aria-hidden="true">${S.chevronRight}</span>
        <span class="activity-entry__main">
          <span class="activity-entry__title">
            ${k({kind:Ce(t.status),label:G(t.status)})}
            <span class="activity-entry__tool mono">${J(t)}</span>
          </span>
          <span class="activity-entry__text">${q(t)}</span>
        </span>
        <span class="activity-entry__meta">
          <span>${_e(t.updatedAt)}</span>
          <span>${ve(t.durationMs)}</span>
        </span>
      </summary>
      <div class="activity-entry__body">
        <div class="activity-entry__facts">
          ${t.entryKind===`answer_candidate`?o`<span class="mono"
                >${b(`activity.answerCandidate.itemId`)}: ${t.itemId}</span
              >`:o`
                <span>${K(t.hiddenArgumentCount)}</span>
                <span class="mono">${b(`activity.toolCallId`)}: ${t.toolCallId}</span>
              `}
          <span class="mono">${b(`activity.runId`)}: ${t.runId}</span>
          ${t.sessionKey?o`<span class="mono">${b(`activity.session`)}: ${t.sessionKey}</span>`:l}
        </div>
        ${t.outputPreview?o`
              <pre class="activity-entry__preview">${t.outputPreview}</pre>
              ${t.outputTruncated?o`<div class="activity-entry__note">${b(`activity.outputTruncated`)}</div>`:l}
            `:o`<div class="activity-entry__note">${b(`activity.noOutputPreview`)}</div>`}
      </div>
    </details>
  `}function Y(e){let t=be(e.entries),n=xe(e),r=e.filterText.trim()||e.toolFilter||X.some(t=>!e.statusFilters[t]);return o`
    <section class="activity-page" aria-label=${b(`activity.title`)}>
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${b(`activity.title`)}</h2>
        <div class="settings-section__actions">
          <span class="activity-count" aria-live="polite">
            ${b(`activity.visibleCount`,{visible:String(n.length),total:String(e.entries.length)})}
          </span>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${n.length===0}
            @click=${e.onExpandAll}
          >
            ${b(`activity.expandAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${e.expandedIds.size===0}
            @click=${e.onCollapseAll}
          >
            ${b(`activity.collapseAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm danger"
            ?disabled=${e.entries.length===0}
            @click=${e.onClear}
          >
            ${b(`activity.clear`)}
          </button>
        </div>
      </div>
      <div class="settings-group activity-group">
        ${D({title:b(`activity.search`),control:o`
            <input
              class="settings-input"
              type="search"
              aria-label=${b(`activity.search`)}
              .value=${e.filterText}
              placeholder=${b(`activity.searchPlaceholder`)}
              @input=${t=>e.onFilterTextChange(t.target.value)}
            />
          `})}
        ${D({title:b(`activity.toolFilter`),control:o`
            <select
              class="settings-select"
              aria-label=${b(`activity.toolFilter`)}
              .value=${e.toolFilter}
              @change=${t=>e.onToolFilterChange(t.target.value)}
            >
              <option value="">${b(`activity.allTools`)}</option>
              ${t.map(e=>o`<option value=${e}>${e}</option>`)}
            </select>
          `})}
        ${D({title:b(`activity.statusFilters`),control:o`
            <span
              role="group"
              aria-label=${b(`activity.statusFilters`)}
              class="activity-status-filters"
            >
              ${X.map(t=>Se(e,t))}
            </span>
          `})}
        ${D({title:b(`activity.autoFollow`),control:E({checked:e.autoFollow,ariaLabel:b(`activity.autoFollow`),onChange:t=>e.onToggleAutoFollow(t)})})}
        <div
          class="activity-stream"
          role="list"
          aria-label=${b(`activity.streamLabel`)}
          @scroll=${e.onScroll}
        >
          ${n.length===0?o`
                <div class="activity-empty">
                  ${e.entries.length===0||!r?b(`activity.empty`):b(`activity.emptyFiltered`)}
                </div>
              `:n.map(t=>we(e,t))}
        </div>
      </div>
    </section>
  `}var X,Z,Te=e((()=>{s(),C(),O(),x(),m(),ee(),ge(),X=[`running`,`done`,`error`],Z={running:`warn`,done:`ok`,error:`danger`}})),Q,$;e((()=>{i(),s(),u(),ue(),se(),de(),T(),p(),g(),te(),y(),he(),Te(),r(),$=class extends _{constructor(...e){super(...e),this.entries=[],this.filterText=``,this.statusFilters={running:!0,done:!0,error:!0},this.toolFilter=``,this.expandedIds=new Set,this.autoFollow=!0,this.atBottom=!0,this.sessionKey=``,this.scrollFrame=null,this.subscriptions=new v(this).effect(()=>this.context?.gateway,e=>{this.applyGatewaySnapshot(e,e.snapshot,!0);let t=e.subscribeEvents(t=>{this.applyGatewayEvent(e,t,Date.now())}),n=e.subscribe(t=>this.applyGatewaySnapshot(e,t,!1));return()=>{n(),t()}})}updated(e){this.autoFollow&&this.atBottom&&(e.has(`entries`)||e.has(`autoFollow`))&&this.scheduleScroll(e.has(`autoFollow`))}disconnectedCallback(){this.subscriptions.clear(),this.scrollFrame!==null&&(cancelAnimationFrame(this.scrollFrame),this.scrollFrame=null),super.disconnectedCallback()}applyGatewaySnapshot(e,t,n){let r=this.sessionKey;this.sessionKey=ie(ce().sessionKey,t.hello),(n||this.sessionKey!==r)&&this.rebuildEntries(e,t)}rebuildEntries(e,t){let n=[],r=e.eventLog,i=Q?r.indexOf(Q):-1,a=i<0?r:r.slice(0,i);for(let e of a.toReversed())n=this.reduceGatewayEvent(n,t,e.event,e.payload,e.ts);(n.length>0||this.entries.length>0)&&(this.entries=n),this.expandedIds.size>0&&(this.expandedIds=new Set),this.atBottom=!0}applyGatewayEvent(e,t,n){if(this.context.gateway!==e)return;let r=this.reduceGatewayEvent(this.entries,e.snapshot,t.event,t.payload,n);r!==this.entries&&(this.entries=r)}reduceGatewayEvent(e,t,n,r,i){if(n!==`agent`&&n!==`session.tool`)return e;let a=M(r,i);return!a||!ae({sessionKey:this.sessionKey,assistantAgentId:t.assistantAgentId,hello:t.hello},a.sessionKey,a.agentId)?e:V(e,a)}scheduleScroll(e=!1){this.scrollFrame!==null&&cancelAnimationFrame(this.scrollFrame),this.updateComplete.then(()=>{this.isConnected&&(this.scrollFrame=requestAnimationFrame(()=>{this.scrollFrame=null;let t=this.querySelector(`.activity-stream`);if(!t)return;let n=t.scrollHeight-t.scrollTop-t.clientHeight;!e&&(!this.autoFollow||!this.atBottom&&n>=120)||(t.scrollTop=t.scrollHeight,this.atBottom=!0)}))})}handleScroll(e){let t=e.currentTarget;if(!t)return;let n=t.scrollHeight-t.scrollTop-t.clientHeight;this.atBottom=n<120}clearEntries(){Q=this.context.gateway.eventLog[0],this.entries=[],this.expandedIds=new Set,this.atBottom=!0}render(){let e=Y({entries:this.entries,filterText:this.filterText,statusFilters:this.statusFilters,toolFilter:this.toolFilter,expandedIds:this.expandedIds,autoFollow:this.autoFollow,onFilterTextChange:e=>this.filterText=e,onToolFilterChange:e=>this.toolFilter=e,onStatusToggle:(e,t)=>{this.statusFilters={...this.statusFilters,[e]:t}},onToggleAutoFollow:e=>{this.autoFollow=e,e&&this.scheduleScroll(!0)},onClear:()=>this.clearEntries(),onExpandAll:()=>{this.expandedIds=new Set(this.entries.map(e=>e.id))},onCollapseAll:()=>{this.expandedIds=new Set},onEntryToggle:(e,t)=>{let n=new Set(this.expandedIds);t?n.add(e):n.delete(e),this.expandedIds=n},onScroll:e=>this.handleScroll(e)});return o`
      <section class="content-header">
        <div>
          <div class="page-title">${oe(`activity`)}</div>
        </div>
      </section>
      ${w(e,{fillHeight:!0})}
    `}},t([a({context:le,subscribe:!0})],$.prototype,`context`,void 0),t([c()],$.prototype,`entries`,void 0),t([c()],$.prototype,`filterText`,void 0),t([c()],$.prototype,`statusFilters`,void 0),t([c()],$.prototype,`toolFilter`,void 0),t([c()],$.prototype,`expandedIds`,void 0),t([c()],$.prototype,`autoFollow`,void 0),t([c()],$.prototype,`atBottom`,void 0),customElements.get(`openclaw-activity-page`)||customElements.define(`openclaw-activity-page`,$)}))();
//# sourceMappingURL=activity-page-f3WYnPqG.js.map