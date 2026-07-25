import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,o as n,u as r}from"./control-ui-foundation-43q8Lf_T.js";import{F as i,I as a,L as o,P as s,R as c}from"./control-ui-core-DF5v1q4q.js";import{dt as l,ft as u}from"./control-ui-foundation-DQl2NL7K.js";import{$ as d,G as f,J as p,X as m,z as h}from"./lit-runtime-CE4wpvNA.js";import{M as g,P as _,f as v}from"./control-ui-foundation-DFIFKu9N.js";import{$ as y,$n as b,A as x,C as S,Ci as C,D as w,E as T,F as ee,Ft as te,H as ne,J as re,K as ie,L as ae,Mi as oe,Mr as se,N as ce,Nr as le,Nt as ue,O as de,P as fe,Pi as pe,R as E,T as me,U as he,W as ge,Y as D,Z as O,_i as _e,et as ve,gi as ye,it as be,j as xe,nt as Se,q as Ce,rt as we,tt as Te,w as Ee,x as De,xr as Oe}from"./control-ui-core-Dx4utKSD.js";import{B as ke,H as k,U as Ae,Ut as je,at as Me,it as Ne,jt as Pe}from"./control-ui-core-6OhF3OIO.js";import{o as A,t as j}from"./control-ui-core-CXeSrnoQ.js";import{D as Fe,Q as Ie,at as M,ot as Le}from"./control-ui-core-vPyynwls.js";import{t as Re}from"./web-awesome-select-BN23D6HL.js";import{n as ze,t as Be}from"./agent-scope-control-ClLrhBs5.js";function N(e,t){return e?.name??e?.identity?.name??e?.id??t}function Ve(e,t){return e.agentId?.trim()||t?.defaultId||``}function He(e,t){let n=Ve(e,t);return n?t?.agents.find(e=>e.id===n):void 0}function Ue(e,t){let n=e.agentId?.trim()||A(`workboard.defaultAgent`);return N(He(e,t),n)}function We(e,t,n){if(n===`all`)return!0;let r=e.agentId?.trim();return n==="default"?!r:r===n}function Ge(e,t,n){if(!n)return!0;let r=e.agentId?.trim();return r===n||!r&&t?.defaultId===n}function P(e){return typeof e==`string`?e.trim():``}function Ke(e){let t=new Set,n=P(e?.defaultId),r=[];for(let i of e?.agents??[]){let e=P(i.id);!e||t.has(e)||(t.add(e),r.push({id:e,label:N(i,e),isDefault:!!(n&&e===n)}))}return r}function qe(e){return e.find(e=>e.isDefault)?.label??A(`workboard.defaultAgent`)}function Je(e,t){let n=Ke(e),r=new Set(n.map(e=>e.id)),i=[...new Set(t.map(e=>P(e.agentId)).filter(e=>e&&!r.has(e)))].toSorted((e,t)=>e.localeCompare(t)),a=[{id:`all`,label:A(`workboard.allAgents`)},{id:`default`,label:A(`workboard.agentFilterUnassigned`,{agent:qe(n)}),description:A(`workboard.agentFilterUnassignedHelp`)}];for(let e of n)a.push({id:e.id,label:e.isDefault?A(`workboard.agentFilterConfiguredDefault`,{agent:e.label}):e.label,...e.isDefault?{description:A(`workboard.agentFilterConfiguredDefaultHelp`)}:{}});for(let e of i)a.push({id:e,label:A(`workboard.agentCurrentUnconfigured`,{agent:e})});return a}function Ye(e,t){let n=Ke(e),r=P(t),i=r?n.some(e=>e.id===r):!0;return[{id:``,label:A(`workboard.agentFilterUnassigned`,{agent:qe(n)})},...n.map(e=>({id:e.id,label:e.isDefault?A(`workboard.agentFilterConfiguredDefault`,{agent:e.label}):e.label})),...i?[]:[{id:r,label:A(`workboard.agentCurrentUnconfigured`,{agent:r})}]]}function Xe(e,t){return e.some(e=>e.id===t)?t:`all`}var Ze=e((()=>{j()})),Qe=e((()=>{}));function F(e){let t=d`
    <wa-select
      class="workboard-select ${e.className??``}"
      label=${e.label}
      value=${e.value}
      ?disabled=${e.disabled}
      @change=${t=>{let n=t.currentTarget.value;n!==void 0&&e.options.some(e=>e.value===n&&!e.disabled)&&(e.onChange(n),e.requestUpdate?.())}}
    >
      ${e.options.map(t=>d`
          <wa-option
            class="workboard-select__option"
            value=${t.value}
            .label=${t.label}
            ?selected=${t.value===e.value}
            ?disabled=${t.disabled}
          >
            <span class="workboard-select__copy">
              <span class="workboard-select__label">${t.label}</span>
              ${t.description?d`<span class="workboard-select__description">${t.description}</span>`:m}
            </span>
          </wa-option>
        `)}
    </wa-select>
  `;return e.showLabel===!1?t:d`
    <div class="workboard-field">
      <span>${e.label}</span>
      ${t}
    </div>
  `}var $e=e((()=>{p(),Re()}));function I(e){return A(`workboard.status.${e}`)}function L(e){return e.charAt(0).toUpperCase()+e.slice(1)}function et(e){return e?ye(e,{month:`short`,day:`numeric`},``):``}function tt(e){return new Intl.DateTimeFormat(void 0,{hour:`numeric`,minute:`2-digit`}).format(new Date(e))}function R(e){return e?_e(e,{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`},``):``}function nt(e){return e?n(Math.max(0,Date.now()-e),{spaced:!0})??`0ms`:``}function z(e,t=64){let n=e.trim();return n.length<=t?n:`${_(n,Math.max(0,t-1))}…`}function B(e){return e.canWrite!==!1&&Te(O(e.host))}function rt(e){return e.canWrite!==!1}function V(e){switch(e.kind){case`created`:return A(`workboard.eventCreated`);case`edited`:return A(`workboard.eventEdited`);case`moved`:return e.toStatus?A(`workboard.eventMovedTo`,{status:I(e.toStatus)}):A(`workboard.eventMoved`);case`linked`:return A(`workboard.eventLinked`);case`specified`:return A(`workboard.eventSpecified`);case`decomposed`:return A(`workboard.eventDecomposed`);case`claimed`:return A(`workboard.eventClaimed`);case`heartbeat`:return A(`workboard.eventHeartbeat`);case`execution_updated`:return A(`workboard.eventExecutionUpdated`);case`attempt_started`:return A(`workboard.eventAttemptStarted`);case`attempt_updated`:return A(`workboard.eventAttemptUpdated`);case`comment_added`:return A(`workboard.eventCommentAdded`);case`link_added`:return A(`workboard.eventLinkAdded`);case`proof_added`:return A(`workboard.eventProofAdded`);case`artifact_added`:return A(`workboard.eventArtifactAdded`);case`attachment_added`:return A(`workboard.eventAttachmentAdded`);case`diagnostic`:return A(`workboard.eventDiagnostic`);case`notification`:return A(`workboard.eventNotification`);case`dispatch`:return A(`workboard.eventDispatch`);case`orchestration`:return A(`workboard.eventOrchestration`);case`protocol_violation`:return A(`workboard.eventProtocolViolation`);case`archived`:return A(`workboard.eventArchived`);case`unarchived`:return A(`workboard.eventUnarchived`);case`stale`:return A(`workboard.eventStale`)}return``}function it(e){let t=(e.events??[]).toReversed().slice(0,4);return t.length===0?m:d`
    <ol class="workboard-events" aria-label=${A(`workboard.eventsLabel`)}>
      ${t.map(e=>d`
          <li>
            <span>${V(e)}</span>
            <time>${et(e.at)}</time>
          </li>
        `)}
    </ol>
  `}function at(e,t){let n=e.metadata,r=[],i=n?.diagnostics?.toSorted((e,t)=>t.lastSeenAt-e.lastSeenAt)[0],a=e.status===`blocked`?n?.notifications?.at(-1)?.message??n?.workerProtocol?.detail??i?.detail:void 0;if(n?.templateId&&r.push(d`<span>${A(`workboard.template.${n.templateId}`)}</span>`),(t??e.taskId)&&r.push(d`<span>${A(`workboard.badgeTaskLinked`)}</span>`),n?.attempts?.length&&r.push(d`<span
        >${A(`workboard.badgeAttempts`,{count:String(n.attempts.length)})}</span
      >`),n?.failureCount&&r.push(d`
      <span class="workboard-card__badge--warning">
        ${M.alertTriangle}${A(`workboard.badgeFailures`,{count:String(n.failureCount)})}
      </span>
    `),n?.comments?.length&&r.push(d`<span
        >${A(`workboard.badgeComments`,{count:String(n.comments.length)})}</span
      >`),n?.proof?.length&&r.push(d`<span>${A(`workboard.badgeProof`,{count:String(n.proof.length)})}</span>`),n?.claim){r.push(d`<span>${A(`workboard.badgeClaimed`,{owner:n.claim.ownerId})}</span>`);let e=nt(n.claim.lastHeartbeatAt);e&&r.push(d`<span>${A(`workboard.badgeHeartbeat`,{age:e})}</span>`)}return i&&r.push(d`<span class="workboard-card__badge--warning" title=${i.detail}>
        ${M.alertTriangle}${z(i.title)}
      </span>`),a&&r.push(d`<span class="workboard-card__badge--warning" title=${a}>
        ${M.alertTriangle}${z(a)}
      </span>`),n?.stale&&r.push(d`<span class="workboard-card__badge--warning"
        >${M.alertTriangle}${A(`workboard.badgeStale`)}</span
      >`),r.length===0?m:d` <div class="workboard-card__badges">${r}</div> `}function ot(e,t){if(t.priority!==`all`&&e.priority!==t.priority)return!1;let n=t.query.trim().toLowerCase();return n?[e.title,e.notes,e.agentId,e.sessionKey,e.execution?.engine,e.execution?.mode,e.execution?.model,e.execution?.sessionKey,e.metadata?.templateId,e.metadata?.automation?.tenant,e.metadata?.automation?.idempotencyKey,e.metadata?.automation?.workspace?.kind,e.metadata?.automation?.workspace?.path,e.metadata?.automation?.workspace?.branch,...e.metadata?.automation?.skills??[],...e.metadata?.automation?.createdCardIds??[],...(e.metadata?.comments??[]).map(e=>e.body),...(e.metadata?.links??[]).flatMap(e=>[e.title,e.url,e.targetCardId]),...(e.metadata?.proof??[]).flatMap(e=>[e.label,e.command,e.url,e.note]),...(e.metadata?.artifacts??[]).flatMap(e=>[e.label,e.url,e.path,e.mimeType]),...(e.metadata?.attachments??[]).flatMap(e=>[e.fileName,e.mimeType,e.note]),...(e.metadata?.workerLogs??[]).map(e=>e.message),e.metadata?.workerProtocol?.state,e.metadata?.workerProtocol?.detail,e.metadata?.claim?.ownerId,...(e.metadata?.diagnostics??[]).flatMap(e=>[e.kind,e.severity,e.title,e.detail]),...(e.metadata?.notifications??[]).map(e=>e.message),...e.labels].filter(e=>typeof e==`string`).some(e=>e.toLowerCase().includes(n)):!0}function st(e,t){let n=e.filter(e=>e.status===t).map(e=>e.position);return(n.length?Math.max(...n):0)+1e3}function ct(e){if(e.archived||e.kind===`global`)return!1;let t=[e.key,e.label,e.displayName].filter(e=>typeof e==`string`).join(`:`).toLowerCase();return!/(^|:)heartbeat(:|$)/.test(t)}function lt(e){return e.target instanceof Element?!!e.target.closest(`button, a, input, select, textarea`):!1}function ut(e){return A(e===`codex`?`workboard.engineOpenAI`:`workboard.engineClaude`)}function dt(e,t,n){if(!n)return null;let r=He(t,e.agentsList),i=r?.agentRuntime?.id?.trim();if(!i)return null;let a=i.toLowerCase();return a===`openclaw`||a===`pi`?null:A(`workboard.engineDisabledRuntime`,{agent:N(r,t.agentId??A(`workboard.defaultAgent`)),runtime:i})}function ft(e,t){let n=Ue(t,e.agentsList);return d`<span class="workboard-agent-chip" title=${t.agentId?A(`workboard.agentLinked`,{agent:n}):A(`workboard.agentDefaultLinked`,{agent:n})}>${n}</span>`}function pt(e){return d`
    <span class="workboard-engine-mark workboard-engine-mark--${e}" aria-hidden="true">
      ${e===`codex`?`OpenAI`:`Claude`}
    </span>
  `}function mt(e,t,n,r){n===t.status||r.busyCardIds.has(t.id)||r.dispatching||!e.connected||!e.client||x({host:e.host,client:e.client,cardId:t.id,status:n,position:st(r.cards,n),requestUpdate:e.onRequestUpdate})}function ht(e,t,n,r={}){let i=O(e.host),a=i.statuses.includes(t.status)?i.statuses:[t.status,...i.statuses];return a.length<2?m:d`
    <label
      class="workboard-card__move ${r.wide?`workboard-card__move--wide`:``}"
      title=${A(`workboard.fieldStatus`)}
    >
      <span class="workboard-card__move-icon" aria-hidden="true">${M.cornerDownRight}</span>
      <select
        class="workboard-card__move-select"
        aria-keyshortcuts="ArrowLeft ArrowRight"
        aria-label=${`${A(`workboard.fieldStatus`)}: ${t.title}`}
        .value=${t.status}
        ?disabled=${n||!e.connected||!e.client}
        @change=${n=>{let r=n.currentTarget;mt(e,t,r.value,i)}}
        @keydown=${n=>{if(n.key!==`ArrowLeft`&&n.key!==`ArrowRight`)return;if(i.busyCardIds.has(t.id)||i.dispatching||!e.connected||!e.client){n.preventDefault();return}let r=a.indexOf(t.status),o=n.key===`ArrowRight`?1:-1,s=a[r+o];s&&(n.preventDefault(),mt(e,t,s,i))}}
      >
        ${a.map(e=>d`<option value=${e} ?selected=${e===t.status}>
              ${I(e)}
            </option>`)}
      </select>
    </label>
  `}function H(e){return d`
    <span class="workboard-card__action-slot">
      ${e===m?d`<span class="workboard-card__action-placeholder" aria-hidden="true"></span>`:e}
    </span>
  `}function gt(e,t){let n=O(e.host),r=n.tasksByCardId.get(t.id),i=re(t,e.sessions),a=n.busyCardIds.has(t.id)||n.dispatching,o=Nt(t,r,n.missingTaskIds),s=B(e);return{state:n,task:r,busy:a,activeTask:o,live:o||Pt(t)||i?.hasActiveRun===!0||i?.hasActiveRun!==!1&&i?.status===`running`,linkedSessionKey:t.sessionKey??t.execution?.sessionKey,writable:s,showStartControls:s&&Ft(n,e.sessions,t),archived:!!t.metadata?.archivedAt}}function U(e){let t=d`
    <button
      class=${e.iconOnly?`btn btn--icon workboard-card__icon ${e.className??``}`:`btn ${e.className??``}`}
      type="button"
      aria-label=${e.label}
      aria-haspopup=${e.ariaHaspopup??m}
      ?disabled=${e.disabled}
      @click=${e.onClick}
    >
      ${e.icon}${e.iconOnly?m:d`<span>${e.label}</span>`}
    </button>
  `;return e.iconOnly?d`<openclaw-tooltip .content=${e.label}>${t}</openclaw-tooltip>`:t}function _t(e,t,n={}){let r=O(e.host);return U({label:A(`workboard.editCard`),icon:M.edit,iconOnly:n.iconOnly,ariaHaspopup:`dialog`,disabled:r.dispatching,onClick:()=>{Et(r,t),e.onRequestUpdate?.()}})}function vt(e,t,n,r,i={}){return U({label:A(r?`workboard.unarchiveCard`:`workboard.archiveCard`),icon:r?M.archiveRestore:M.archive,iconOnly:i.iconOnly,disabled:n,onClick:()=>{T({host:e.host,client:e.client,cardId:t.id,archived:!r,requestUpdate:e.onRequestUpdate})}})}function yt(e,t,n={}){return t?U({label:A(`workboard.openSession`),icon:M.messageSquare,iconOnly:n.iconOnly,onClick:()=>e.onOpenSession(t)}):m}function bt(e,t,n,r={}){return U({label:A(`workboard.stopSession`),icon:M.stop,iconOnly:r.iconOnly,disabled:n||!e.connected,onClick:()=>{Ee({host:e.host,client:e.client,card:t,requestUpdate:e.onRequestUpdate})}})}function xt(e,t,n,r={}){return U({label:A(`workboard.deleteCard`),icon:M.trash,iconOnly:r.iconOnly,className:`workboard-card__delete`,disabled:n,onClick:()=>{w({host:e.host,client:e.client,cardId:t.id,requestUpdate:e.onRequestUpdate})}})}function W(e,t){e.detailCardId=t.id,e.detailCommentBody=``}function St(e){e.detailCardId=null,e.detailCommentBody=``}function Ct(e){if(!e.detailCardId||e.draftOpen)return null;let t=e.cards.find(t=>t.id===e.detailCardId)??null;return!t||t.metadata?.archivedAt&&!e.showArchived?null:t}function wt(e){let t=e.loaded&&e.mutationReadiness===`stale_edit_draft`;e.draftOpen=!1,e.editingCardId=null,e.draftTitle=``,e.draftNotes=``,e.draftStatus=`todo`,e.draftPriority=`normal`,e.draftLabels=``,e.draftAgentId=``,e.draftSessionKey=``,e.draftTemplateId=``,e.draftCommentBody=``,t&&(e.mutationReadiness=`ready`)}function Tt(e){wt(e),e.draftOpen=!0}function Et(e,t){e.draftOpen=!0,e.editingCardId=t.id,e.draftTitle=t.title,e.draftNotes=t.notes??``,e.draftStatus=t.status,e.draftPriority=t.priority,e.draftLabels=t.labels.join(`, `),e.draftAgentId=t.agentId??``,e.draftSessionKey=t.sessionKey??``,e.draftTemplateId=t.metadata?.templateId??``,e.draftCommentBody=``}function Dt(e,t){let n=Q.find(e=>e.id===t);n&&(e.draftTemplateId=n.id,e.draftTitle=A(n.titleKey),e.draftNotes=A(n.notesKey),e.draftLabels=n.labels,e.draftPriority=n.priority)}function Ot(e){let t=O(e.host),n=Ye(e.agentsList,t.draftAgentId),r=e.sessions.filter(ct),i=t.statuses.map(e=>({value:e,label:I(e)})),a=v.map(e=>({value:e,label:L(e)})),o=n.map(e=>({value:e.id,label:e.label})),s=[{value:``,label:A(`workboard.noLinkedSession`)},...r.map(e=>({value:e.key,label:e.displayName??e.label??e.key}))];if(t.draftSessionKey&&!s.some(e=>e.value===t.draftSessionKey)&&s.push({value:t.draftSessionKey,label:t.draftSessionKey}),!t.draftOpen)return m;let c=!!t.editingCardId,l=(t.editingCardId?t.cards.find(e=>e.id===t.editingCardId)??null:null)?.metadata?.comments??[],u=c&&t.busyCardIds.has(t.editingCardId??``),f=!B(e)||t.loading||t.dispatching||u,p=t.draftSaving,h=()=>p?!1:(wt(t),!0);return d`
    <openclaw-modal-dialog
      label=${A(c?`workboard.editCard`:`workboard.newCard`)}
      description=${A(c?`workboard.editCardHelp`:`workboard.newCardHelp`)}
      style="--openclaw-modal-width: min(1120px, calc(100vw - 56px)); --openclaw-modal-max-height: calc(100dvh - 56px);"
      @modal-cancel=${t=>{if(!h()){t.preventDefault();return}e.onRequestUpdate?.()}}
    >
      <form
        id=${Y}
        class="workboard-draft"
        aria-busy=${f?`true`:`false`}
        @submit=${t=>{t.preventDefault(),!f&&xe({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}}
      >
        <div class="workboard-modal__header">
          <div>
            <h2 id=${Xt}>
              ${A(c?`workboard.editCard`:`workboard.newCard`)}
            </h2>
            <p id=${Zt}>
              ${A(c?`workboard.editCardHelp`:`workboard.newCardHelp`)}
            </p>
          </div>
          <openclaw-tooltip .content=${A(`common.cancel`)}>
            <button
              class="btn btn--icon workboard-card__icon"
              type="button"
              aria-label=${A(`common.cancel`)}
              ?disabled=${p}
              @click=${()=>{h()&&e.onRequestUpdate?.()}}
            >
              ${M.x}
            </button>
          </openclaw-tooltip>
        </div>
        <div class="workboard-draft__body">
          ${c?m:d`
                <div class="workboard-template-strip" aria-label=${A(`workboard.templatesLabel`)}>
                  ${Q.map(n=>d`
                      <button
                        class="btn btn--xs ${t.draftTemplateId===n.id?`workboard-template-strip__button--active`:``}"
                        type="button"
                        ?disabled=${f}
                        @click=${()=>{Dt(t,n.id),e.onRequestUpdate?.()}}
                      >
                        ${A(`workboard.template.${n.id}`)}
                      </button>
                    `)}
                </div>
              `}
          <div class="workboard-draft__main">
            <label class="workboard-field">
              <span>${A(`workboard.fieldTitle`)}</span>
              <input
                class="input workboard-draft__title"
                autofocus
                placeholder=${A(`workboard.titlePlaceholder`)}
                ?disabled=${f}
                .value=${t.draftTitle}
                @input=${n=>{t.draftTitle=n.currentTarget.value,e.onRequestUpdate?.()}}
              />
            </label>
            <label class="workboard-field">
              <span>${A(`workboard.fieldNotes`)}</span>
              <textarea
                class="input workboard-draft__notes"
                placeholder=${A(`workboard.notesPlaceholder`)}
                ?disabled=${f}
                .value=${t.draftNotes}
                @input=${n=>{t.draftNotes=n.currentTarget.value,e.onRequestUpdate?.()}}
              ></textarea>
            </label>
          </div>
          <div class="workboard-draft__meta">
            ${F({value:t.draftStatus,options:i,label:A(`workboard.fieldStatus`),onChange:e=>{t.draftStatus=e},requestUpdate:e.onRequestUpdate,disabled:f})}
            ${F({value:t.draftPriority,options:a,label:A(`workboard.fieldPriority`),onChange:e=>{t.draftPriority=e},requestUpdate:e.onRequestUpdate,disabled:f})}
            ${F({value:t.draftAgentId,options:o,label:A(`workboard.fieldAgent`),onChange:e=>{t.draftAgentId=e},requestUpdate:e.onRequestUpdate,disabled:f})}
            ${F({value:t.draftSessionKey,options:s,label:A(`workboard.fieldSession`),onChange:e=>{t.draftSessionKey=e},requestUpdate:e.onRequestUpdate,disabled:f})}
            <label class="workboard-field workboard-field--wide">
              <span>${A(`workboard.fieldLabels`)}</span>
              <input
                class="input"
                placeholder=${A(`workboard.labelsPlaceholder`)}
                ?disabled=${f}
                .value=${t.draftLabels}
                @input=${n=>{t.draftLabels=n.currentTarget.value,e.onRequestUpdate?.()}}
              />
            </label>
          </div>
          ${c?d`
                <section
                  class="workboard-field workboard-field--wide"
                  aria-labelledby="workboard-card-comments-title"
                >
                  <span id="workboard-card-comments-title">
                    ${A(`workboard.badgeComments`,{count:String(l.length)})}
                  </span>
                  ${l.length?d`
                        <ol>
                          ${l.map(e=>d`<li>${e.body}</li>`)}
                        </ol>
                      `:m}
                  <textarea
                    class="input workboard-comments__input"
                    aria-labelledby="workboard-card-comments-title"
                    maxlength="2000"
                    ?disabled=${f}
                    .value=${t.draftCommentBody}
                    @input=${n=>{t.draftCommentBody=n.currentTarget.value,e.onRequestUpdate?.()}}
                  ></textarea>
                  <div class="workboard-modal__actions">
                    <button
                      class="btn"
                      type="button"
                      ?disabled=${f||!t.draftCommentBody.trim()}
                      @click=${()=>{me({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}}
                    >
                      ${M.plus} ${A(`common.create`)}
                    </button>
                  </div>
                </section>
              `:m}
        </div>
        <div class="workboard-modal__actions">
          <button class="btn primary" ?disabled=${f||!t.draftTitle.trim()}>
            ${A(c?`common.save`:`common.create`)}
          </button>
          <button
            class="btn"
            type="button"
            ?disabled=${p}
            @click=${()=>{h()&&e.onRequestUpdate?.()}}
          >
            ${A(`common.cancel`)}
          </button>
        </div>
      </form>
    </openclaw-modal-dialog>
  `}function kt(e){switch(e.state){case`running`:return{label:A(`workboard.lifecycleRunning`),detail:A(`workboard.lifecycleRunningDetail`),tone:`live`};case`succeeded`:return{label:A(`workboard.lifecycleDone`),detail:A(`workboard.lifecycleDoneDetail`),tone:`done`};case`failed`:return{label:A(`workboard.lifecycleNeedsReview`),detail:A(`workboard.lifecycleNeedsReviewDetail`),tone:`blocked`};case`stale`:return{label:A(`workboard.lifecycleStale`),detail:A(`workboard.lifecycleStaleDetail`),tone:`blocked`};case`idle`:return{label:A(`workboard.lifecycleLinked`),detail:A(`workboard.lifecycleIdleDetail`),tone:`idle`};case`missing`:return{label:A(`workboard.lifecycleMissing`),detail:A(`workboard.lifecycleMissingDetail`),tone:`blocked`};case`unlinked`:return{label:A(`workboard.lifecycleUnlinked`),detail:A(`workboard.lifecycleUnlinkedDetail`),tone:`idle`}}throw Error(`Unknown workboard lifecycle state.`)}function G(e){return e.status===`queued`||e.status===`running`?e.progressSummary??e.title??e.taskId:e.terminalSummary??e.error??e.progressSummary??e.title??e.taskId}function At(e,t){switch(e.status){case`queued`:case`running`:return t.state===`running`;case`completed`:return t.state===`succeeded`;case`failed`:case`cancelled`:case`timed_out`:return t.state===`failed`}return!1}function jt(e){return e?.status===`queued`||e?.status===`running`}function Mt(e,t,n){return!!(e.taskId&&!t&&!n.has(e.taskId))}function Nt(e,t,n){return jt(t)||e.status===`running`&&Mt(e,t,n)}function Pt(e){let t=e.sessionKey??e.execution?.sessionKey,n=e.runId??e.execution?.runId;return e.status===`running`&&!!(t&&n)}function Ft(e,t,n){let r=e.tasksByCardId.get(n.id),i=re(n,t),a=jt(r)||Mt(n,r,e.missingTaskIds),o=n.sessionKey??n.execution?.sessionKey;return!a&&!Pt(n)&&(!o||!i)}function It(e){if(e.missing)return A(`workboard.dependencyMissing`,{parent:e.title});let t=e.status?I(e.status):A(`workboard.unknownStatus`);return`${e.title} (${t})`}function Lt(e){return e.blockedParents.length===0?null:A(`workboard.dependenciesBlockedTitle`,{parents:e.blockedParents.map(It).join(`, `)})}function Rt(e){if(e.parents.length===0)return m;let t=e.blockedParents.length;return d`
    <div class="workboard-dependencies" title=${Lt(e)??A(`workboard.dependenciesReadyTitle`,{count:String(e.parents.length)})}>
      ${t>0?d`
            <span class="workboard-dependency workboard-dependency--blocked">
              ${M.alertTriangle}${A(`workboard.dependenciesBlocked`,{count:String(t)})}
            </span>
          `:d`
            <span class="workboard-dependency workboard-dependency--ready">
              ${A(`workboard.dependenciesReady`,{count:String(e.parents.length)})}
            </span>
          `}
    </div>
  `}function zt(e){return e.parents.length===0?m:d`
    <section class="workboard-detail__section">
      <h3>${A(`workboard.dependencies`)}</h3>
      <ul class="workboard-detail__list workboard-detail__dependencies">
        ${e.parents.map(e=>d`
            <li class=${e.done?`is-done`:`is-blocked`}>
              ${e.done?d`<span class="workboard-detail__dependency-spacer"></span>`:M.alertTriangle}
              <span>${e.title}</span>
              <span>
                ${e.missing?A(`workboard.dependencyStatusMissing`):e.status?I(e.status):A(`workboard.unknownStatus`)}
              </span>
            </li>
          `)}
      </ul>
    </section>
  `}function Bt(e,t,n){let r=D(e,t,n),i=kt(r),a=r.session,o=e.execution,s=r.state===`stale`,c=n?At(n,r):!1,l=n&&c?A(`workboard.taskStatus.${n.status}`):null;return d`
    <div class="workboard-card__lifecycle">
      <span class="workboard-lifecycle workboard-lifecycle--${i.tone}">
        ${l??(s||!o?i.label:`${o.engine?`${o.engine} `:``}${o.mode}`)}
      </span>
      <span class="workboard-card__lifecycle-detail">
        ${n&&c?G(n):s?i.detail:a?.displayName??a?.label??i.detail}
      </span>
    </div>
  `}function K(e,t,n,r,i={}){let a=O(e.host),o=a.busyCardIds.has(t.id)||a.dispatching,s=dt(e,t,n),c=o||!e.connected||!!s||!!t.metadata?.archivedAt,l=s||(n?A(r===`autonomous`?`workboard.runEngine`:`workboard.openEngine`,{engine:ut(n)}):A(`workboard.runDefaultAgent`)),u=d`
    <button
      class="btn btn--xs workboard-card__start workboard-card__start--${r} ${i.iconOnly?`workboard-card__start--icon`:``} ${n?``:`workboard-card__start--default`}"
      type="button"
      aria-label=${l}
      ?disabled=${c}
      @click=${async()=>{let i=await S({host:e.host,client:e.client,card:t,...n?{engine:n}:{},mode:r,requestUpdate:e.onRequestUpdate});i&&e.onOpenSession(i)}}
    >
      ${n?d`${pt(n)}${i.iconOnly?m:d`<span
                >${A(r===`autonomous`?`workboard.run`:`workboard.open`)}</span
              >`}`:d`${r===`autonomous`?M.play:M.penLine}${i.iconOnly?m:d`<span>${A(`workboard.start`)}</span>`}`}
    </button>
  `;return i.iconOnly?d`<openclaw-tooltip .content=${l}>${u}</openclaw-tooltip>`:u}function Vt(e,t){let n=e.canModelOverride!==!1;return d`
    <div class="workboard-card__execution-controls">
      ${K(e,t,null,`autonomous`)}
      ${n?d`${K(e,t,`codex`,`autonomous`)}
          ${K(e,t,`claude`,`autonomous`)}`:m}
      ${K(e,t,`codex`,`manual`)}
      ${K(e,t,`claude`,`manual`)}
    </div>
  `}function q(e,t){if(typeof t!=`string`&&typeof t!=`number`)return m;let n=String(t).trim();return n?d`
    <div class="workboard-detail__row">
      <span>${e}</span>
      <strong>${n}</strong>
    </div>
  `:m}function J(e,t,n=m){let r=t.map(e=>e.trim()).filter(Boolean).slice(-6);return r.length===0?n:d`
    <section class="workboard-detail__section">
      <h3>${e}</h3>
      <ol class="workboard-detail__list">
        ${r.map(e=>d`<li>${e}</li>`)}
      </ol>
    </section>
  `}function Ht(e){let t=O(e.host),n=Ct(t);if(!n)return m;let{task:r,busy:i,activeTask:a,live:o,linkedSessionKey:s,writable:c,showStartControls:l,archived:u}=gt(e,n),f=D(n,e.sessions,r),p=kt(f),h=r?At(r,f):!1,g=n.metadata?.comments??[],_=n.metadata?.attempts??[],v=n.metadata?.links??[],y=n.metadata?.proof??[],b=n.metadata?.artifacts??[],x=n.metadata?.attachments??[],S=n.metadata?.diagnostics??[],C=n.metadata?.workerLogs??[],w=n.metadata?.workerProtocol,T=n.metadata?.automation,ee=(n.events??[]).slice(-6).toReversed(),te=Se(n,t.cards);return d`
    <openclaw-modal-dialog
      class="drawer"
      label=${n.title}
      description=${r&&h?G(r):f.session?.displayName??p.detail}
      style="--openclaw-modal-width: min(460px, 100vw); --openclaw-modal-max-height: 100dvh;"
      @modal-cancel=${()=>{St(t),e.onRequestUpdate?.()}}
    >
      <aside id=${X} class="workboard-detail-drawer">
        <div class="workboard-detail">
          <header class="workboard-detail__header">
            <div>
              <span class="workboard-card__priority">${L(n.priority)}</span>
              <h2 id=${Qt}>
                <span class="workboard-sr-only">${A(`workboard.detailTitle`)}: </span>${n.title}
              </h2>
            </div>
            <openclaw-tooltip .content=${A(`common.cancel`)}>
              <button
                class="btn btn--icon workboard-card__icon"
                type="button"
                aria-label=${A(`common.cancel`)}
                @click=${()=>{St(t),e.onRequestUpdate?.()}}
              >
                ${M.x}
              </button>
            </openclaw-tooltip>
          </header>

          <section class="workboard-detail__section">
            <div class="workboard-card__lifecycle">
              <span class="workboard-lifecycle workboard-lifecycle--${p.tone}">
                ${p.label}
              </span>
              <span id=${Z} class="workboard-card__lifecycle-detail">
                ${r&&h?G(r):f.session?.displayName??p.detail}
              </span>
            </div>
            <div class="workboard-detail__grid">
              ${q(A(`workboard.fieldStatus`),I(n.status))}
              ${q(A(`workboard.fieldAgent`),n.agentId??A(`workboard.defaultAgent`))}
              ${q(A(`workboard.detailTask`),r?.taskId??n.taskId)}
              ${q(A(`workboard.fieldSession`),s)}
              ${q(A(`workboard.detailRun`),n.runId??n.execution?.runId)}
              ${q(A(`workboard.detailUpdated`),R(n.updatedAt))}
            </div>
          </section>

          ${n.notes?d`
                <section class="workboard-detail__section">
                  <h3>${A(`workboard.fieldNotes`)}</h3>
                  <p>${n.notes}</p>
                </section>
              `:m}
          ${zt(te)}
          ${J(A(`workboard.fieldLabels`),n.labels)}
          ${J(A(`workboard.badgeAttempts`,{count:String(_.length)}),_.map(e=>[e.status,e.model,e.sessionKey,e.error].filter(Boolean).join(` - `)))}
          ${J(A(`workboard.badgeLinks`,{count:String(v.length)}),v.map(e=>[e.type,e.title,e.targetCardId,e.url].filter(Boolean).join(` - `)))}
          ${J(A(`workboard.detailProof`),y.map(e=>[e.status,e.label,e.command,e.url,e.note].filter(Boolean).join(` - `)))}
          ${J(A(`workboard.badgeArtifacts`,{count:String(b.length)}),b.map(e=>[e.label,e.url,e.path,e.mimeType].filter(Boolean).join(` - `)))}
          ${J(A(`workboard.badgeAttachments`,{count:String(x.length)}),x.map(e=>[e.fileName,e.mimeType,e.note].filter(Boolean).join(` - `)))}
          ${J(A(`workboard.detailDiagnostics`),S.map(e=>`${e.severity}: ${e.title}`))}
          ${J(A(`workboard.detailWorkerLogs`),C.map(e=>`${e.level}: ${e.message}`))}
          ${w?J(A(`workboard.detailWorkerProtocol`),[w.state,w.detail??``,w.updatedAt?A(`workboard.detailUpdatedValue`,{time:R(w.updatedAt)}):``]):m}
          ${T?J(A(`workboard.detailAutomation`),[T.tenant?A(`workboard.detailAutomationTenant`,{tenant:T.tenant}):``,T.boardId?A(`workboard.detailAutomationBoard`,{board:T.boardId}):``,T.skills?.length?A(`workboard.detailAutomationSkills`,{skills:T.skills.join(`, `)}):``,T.workspace?A(`workboard.detailAutomationWorkspace`,{workspace:[T.workspace.kind,T.workspace.path,T.workspace.branch].filter(Boolean).join(` `)}):``,T.dispatchCount?A(`workboard.badgeDispatches`,{count:String(T.dispatchCount)}):``,T.lastDispatchAt?A(`workboard.detailUpdatedValue`,{time:R(T.lastDispatchAt)}):``,T.summary?A(`workboard.detailAutomationSummary`,{summary:T.summary}):``]):m}
          ${J(A(`workboard.eventsLabel`),ee.map(e=>`${V(e)} ${R(e.at)}`))}

          <section class="workboard-detail__section">
            <h3>${A(`workboard.detailOperatorNotes`)}</h3>
            ${g.length?d`
                  <ol class="workboard-detail__list">
                    ${g.slice(-6).map(e=>d`<li>${e.body}</li>`)}
                  </ol>
                `:d`<p>${A(`workboard.detailNoNotes`)}</p>`}
            ${c?d`
                  <textarea
                    class="input workboard-detail__note"
                    maxlength="2000"
                    placeholder=${A(`workboard.detailNotePlaceholder`)}
                    .value=${t.detailCommentBody}
                    @input=${n=>{t.detailCommentBody=n.currentTarget.value,e.onRequestUpdate?.()}}
                  ></textarea>
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${i||!t.detailCommentBody.trim()}
                    @click=${()=>me({host:e.host,client:e.client,cardId:n.id,body:t.detailCommentBody,requestUpdate:e.onRequestUpdate})}
                  >
                    ${M.plus} ${A(`workboard.detailAddNote`)}
                  </button>
                `:m}
          </section>

          <div class="workboard-detail__actions">
            ${c&&!u?_t(e,n):m}
            ${c?vt(e,n,i,u):m}
            ${c?ht(e,n,i,{wide:!0}):m}
            ${c&&(s?o:a)?bt(e,n,i):m}
            ${yt(e,s)}
            ${c?xt(e,n,i):m}
            ${l?Vt(e,n):m}
          </div>
        </div>
      </aside>
    </openclaw-modal-dialog>
  `}function Ut(e){let t=e.lastDispatchSummary;return t?d`
    <div class="callout">
      ${A(t.started+t.failures+t.promoted+t.blocked+t.reclaimed+t.orchestrated===0?`workboard.dispatchSummaryEmpty`:`workboard.dispatchSummary`,{started:String(t.started),failures:String(t.failures),promoted:String(t.promoted),blocked:String(t.blocked),reclaimed:String(t.reclaimed),orchestrated:String(t.orchestrated)})}
    </div>
  `:m}function Wt(e,t,n){let r=[[`running`,A(`workboard.healthRunning`),t.running],[`blocked`,A(`workboard.healthBlocked`),t.blocked],[`stale`,A(`workboard.healthStale`),t.stale],[`readyUnassigned`,A(`workboard.healthReadyUnassigned`),t.readyUnassigned],[`missingProof`,A(`workboard.healthMissingProof`),t.missingProof],[`failedAttempts`,A(`workboard.healthFailedAttempts`),t.failedAttempts]];return d`
    <div class="workboard-health" aria-label=${A(`workboard.healthLabel`)}>
      ${r.map(([t,r,i])=>d`
          <button
            class="workboard-health__item workboard-health__item--${t} ${e.activeHealthHighlight===t?`workboard-health__item--active`:``} ${i===0?`workboard-health__item--empty`:``}"
            type="button"
            aria-pressed=${e.activeHealthHighlight===t}
            aria-label=${`${i} ${r}`}
            @click=${()=>{e.activeHealthHighlight=e.activeHealthHighlight===t?null:t,n?.()}}
          >
            <strong>${i}</strong>${r}
          </button>
        `)}
    </div>
  `}function Gt(e){return e.lastRefreshAt?d`<span
      class="workboard-refresh-status ${e.lastRefreshError?`workboard-refresh-status--error`:``}"
      title=${e.lastRefreshError?A(`workboard.refreshError`):``}
    >
      ${A(`workboard.lastRefreshed`,{time:tt(e.lastRefreshAt)})}
    </span>`:e.lastRefreshError?d`<span class="workboard-refresh-status workboard-refresh-status--error">
      ${A(`workboard.refreshError`)}
    </span>`:m}function Kt(){return d`
    <div class="workboard-empty-state" role="status">
      <strong>${A(`workboard.emptyFilteredTitle`)}</strong>
      <span>${A(`workboard.emptyFilteredHint`)}</span>
    </div>
  `}function qt(e,t){let{state:n,task:r,busy:i,activeTask:a,live:o,linkedSessionKey:s,writable:c,showStartControls:l,archived:u}=gt(e,t),f=n.syncingCardIds.has(t.id),p=n.activeHealthHighlight?Ce(t,n.activeHealthHighlight,e.sessions,r):!1,h=Se(t,n.cards),g=l?K(e,t,null,`autonomous`,{iconOnly:!0}):m,_=c&&!u?_t(e,t,{iconOnly:!0}):m,v=c?vt(e,t,i,u,{iconOnly:!0}):m,y=d`
    <openclaw-tooltip .content=${A(`workboard.viewDetails`)}>
      <button
        class="btn btn--icon workboard-card__icon"
        aria-label=${A(`workboard.viewDetails`)}
        aria-haspopup="dialog"
        aria-expanded=${n.detailCardId===t.id?`true`:`false`}
        aria-controls=${X}
        @click=${()=>{W(n,t),e.onRequestUpdate?.()}}
      >
        ${M.panelRightOpen}
      </button>
    </openclaw-tooltip>
  `,b=yt(e,s,{iconOnly:!0}),x=c&&(s?o:a)?bt(e,t,i,{iconOnly:!0}):m,S=c?ht(e,t,i):m,C=c?xt(e,t,i,{iconOnly:!0}):m;return d`
    <article
      class="workboard-card priority-${t.priority} ${i?`workboard-card--busy`:``} ${u?`workboard-card--archived`:``}
      ${n.draggedCardId===t.id?`workboard-card--dragging`:``} ${p?`workboard-card--health-highlight workboard-card--health-highlight-${n.activeHealthHighlight}`:``} workboard-card--openable"
      role="button"
      tabindex="0"
      title=${A(`workboard.viewDetails`)}
      aria-haspopup="dialog"
      aria-expanded=${n.detailCardId===t.id?`true`:`false`}
      aria-controls=${X}
      draggable=${c&&!n.dispatching?`true`:`false`}
      @click=${r=>{lt(r)||(W(n,t),e.onRequestUpdate?.())}}
      @keydown=${r=>{lt(r)||r.key!==`Enter`&&r.key!==` `||(W(n,t),e.onRequestUpdate?.(),r.preventDefault())}}
      @dragstart=${r=>{if(!c||n.dispatching){r.preventDefault();return}n.draggedCardId=t.id,r.dataTransfer?.setData(`text/plain`,t.id),r.dataTransfer?.setDragImage(r.currentTarget,16,16),e.onRequestUpdate?.()}}
      @dragend=${()=>{n.draggedCardId=null,e.onRequestUpdate?.()}}
    >
      <div class="workboard-card__top">
        <div
          class="workboard-card__updated"
          title=${A(`workboard.detailUpdatedValue`,{time:R(t.updatedAt)})}
          aria-label=${A(`workboard.detailUpdatedValue`,{time:R(t.updatedAt)})}
        >
          <span class="workboard-card__updated-icon" aria-hidden="true">${M.clock}</span>
          <span>${R(t.updatedAt)}</span>
        </div>
        <div class="workboard-card__quick-actions">
          ${H(g)} ${H(_)}
          ${H(v)}
        </div>
      </div>
      <div class="workboard-card__chips">
        <span class="workboard-card__priority">${L(t.priority)}</span>
        ${ft(e,t)}
        ${u?d`<span class="workboard-card__archived">${A(`workboard.archived`)}</span>`:m}
        ${o?d`<span class="workboard-live">${A(`workboard.live`)}</span>`:m}
        ${f?d`<span class="workboard-live">${A(`common.saving`)}</span>`:m}
      </div>
      <h3>${t.title}</h3>
      ${t.notes?d`<p>${t.notes}</p>`:m}
      ${Bt(t,e.sessions,r)} ${Rt(h)}
      ${t.labels.length?d`<div class="workboard-labels">
            ${t.labels.map(e=>d`<span>${e}</span>`)}
          </div>`:m}
      ${at(t,r)}
      <div class="workboard-card__meta">
        <span>${s??A(`workboard.noLinkedSession`)}</span>
      </div>
      ${it(t)}
      <div class="workboard-card__actions">
        ${H(y)}
        <div class="workboard-card__actions-primary">
          ${H(b)} ${H(x)}
          ${H(S)}
        </div>
        ${H(C)}
      </div>
    </article>
  `}function Jt(e,t,n){let r=O(e.host),i=B(e);return d`
    <section
      class="workboard-column workboard-column--${t} ${r.draggedCardId?`workboard-column--drop`:``}"
      @dragover=${e=>{i&&r.draggedCardId&&e.preventDefault()}}
      @drop=${n=>{if(n.preventDefault(),!i)return;let a=n.dataTransfer?.getData(`text/plain`)||r.draggedCardId;a&&x({host:e.host,client:e.client,cardId:a,status:t,position:st(r.cards,t),requestUpdate:e.onRequestUpdate})}}
    >
      <div class="workboard-column__header">
        <h2>${I(t)}</h2>
        <span>${n.length}</span>
      </div>
      <div class="workboard-column__cards">
        ${n.length?n.map(t=>qt(e,t)):d`<div class="workboard-empty">${A(`workboard.emptyColumn`)}</div>`}
      </div>
    </section>
  `}function Yt(e){let t=O(e.host);if(e.pluginEnabled===null)return e.pluginEnablementError?d`
        <section class="workboard">
          <div class="callout danger" role="alert">${e.pluginEnablementError}</div>
          ${e.onReloadConfig?d`<button class="btn" type="button" @click=${e.onReloadConfig}>
                ${A(`lazyView.retry`)}
              </button>`:m}
        </section>
      `:d`
      <section class="card lazy-view-state lazy-view-state--loading">
        <div class="card-title">${A(`lazyView.loadingTitle`)}</div>
        <div class="card-sub">${A(`common.loading`)}</div>
      </section>
    `;if(!e.pluginEnabled)return d`
      <section class="workboard">
        <div class="callout">
          ${A(`workboard.disabledHelpStart`)}
          <code>${A(`workboard.enableConfigKey`)}</code>${A(`workboard.disabledHelpEnd`)}
        </div>
      </section>
    `;let n=Je(e.agentsList,t.cards);t.agentFilter=Xe(n,t.agentFilter);let r=s(t.boards,t.cards),i=o(r,t.boardFilter),c=n=>n.filter(e=>t.showArchived||!e.metadata?.archivedAt).filter(e=>a(e,i)).filter(t=>Ge(t,e.agentsList,e.scopeAgentId)).filter(n=>We(n,e.agentsList,t.agentFilter)).filter(e=>ot(e,{query:t.query,priority:t.priorityFilter})),l=n=>c(ge({cards:t.cards,preset:n,tasksByCardId:t.tasksByCardId,sessions:e.sessions,defaultAgentId:e.agentsList?.defaultId})),u=l(t.viewPreset),f=ie({cards:u,tasksByCardId:t.tasksByCardId,sessions:e.sessions}),p=t.error??t.lifecycleTaskRefreshError,h=B(e),g=new Map;for(let e of t.statuses)g.set(e,[]);for(let e of u)g.get(e.status)?.push(e);let _=t.hideEmptyColumns||t.viewPreset!==`all`?t.statuses.filter(e=>(g.get(e)?.length??0)>0):t.statuses,y=!t.showArchived&&t.cards.some(e=>e.metadata?.archivedAt),b=t.viewPreset!==`all`||t.query.trim()!==``||t.priorityFilter!==`all`||t.agentFilter!==`all`||i!==`__all__`||y,x=u.length===0&&b,S=$t.map(e=>{let t=l(e.value).length;return{value:e.value,label:A(e.labelKey),description:e.value===`all`?void 0:A(`workboard.viewPresetCount`,{count:String(t)}),disabled:e.value!==`all`&&t===0}}),C=[{value:`all`,label:A(`workboard.allPriorities`)},...v.map(e=>({value:e,label:L(e)}))],w=n.map(e=>{let t={value:e.id,label:e.label};return e.description&&(t.description=e.description),t}),T=t.draftOpen||!!Ct(t);return d`
    <section class="workboard">
      <div class="workboard-main" ?inert=${T} aria-hidden=${T?`true`:m}>
        <div class="workboard-toolbar">
          <div class="workboard-toolbar__filters">
            <input
              class="input"
              type="search"
              title=${A(`workboard.searchPlaceholder`)}
              placeholder=${A(`workboard.searchPlaceholder`)}
              .value=${t.query}
              @input=${n=>{t.query=n.currentTarget.value,e.onRequestUpdate?.()}}
            />
            ${F({value:t.viewPreset,options:S,label:A(`workboard.viewPreset`),onChange:e=>{t.viewPreset=e},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar`,showLabel:!1})}
            ${F({value:t.priorityFilter,options:C,label:A(`workboard.allPriorities`),onChange:e=>{t.priorityFilter=e},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar`,showLabel:!1})}
            ${r.length>2?F({value:i,options:r,label:A(`workboard.boardFilter`),onChange:n=>{t.boardFilter=n,e.onBoardFilterChange?.(n)},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar workboard-select--toolbar-board`,showLabel:!1}):m}
            ${e.showAgentFilter===!1?m:F({value:t.agentFilter,options:w,label:A(`workboard.agentFilter`),onChange:e=>{t.agentFilter=e},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar workboard-select--toolbar-agent`,showLabel:!1})}
            <button
              class="btn workboard-archive-toggle ${t.showArchived?`active`:``}"
              type="button"
              aria-pressed=${t.showArchived}
              @click=${()=>{t.showArchived=!t.showArchived,e.onRequestUpdate?.()}}
            >
              ${t.showArchived?M.eye:M.eyeOff}
              ${t.showArchived?A(`workboard.hideArchivedShort`):A(`workboard.showArchivedShort`)}
            </button>
            <div class="workboard-layout-controls">
              <div class="workboard-layout-toggle" role="group" aria-label=${A(`workboard.layout`)}>
                <openclaw-tooltip .content=${A(`workboard.layoutCompact`)}>
                  <button
                    class="btn btn--icon ${t.layout===`compact`?`active`:``}"
                    type="button"
                    aria-label=${A(`workboard.layoutCompact`)}
                    aria-pressed=${t.layout===`compact`}
                    @click=${()=>{t.layout=`compact`,e.onRequestUpdate?.()}}
                  >
                    ${M.layoutCompact}
                  </button>
                </openclaw-tooltip>
                <openclaw-tooltip .content=${A(`workboard.layoutComfortable`)}>
                  <button
                    class="btn btn--icon ${t.layout===`comfortable`?`active`:``}"
                    type="button"
                    aria-label=${A(`workboard.layoutComfortable`)}
                    aria-pressed=${t.layout===`comfortable`}
                    @click=${()=>{t.layout=`comfortable`,e.onRequestUpdate?.()}}
                  >
                    ${M.layoutComfortable}
                  </button>
                </openclaw-tooltip>
              </div>
              ${Gt(t)}
            </div>
            <label class="workboard-toggle">
              <input
                type="checkbox"
                name="workboard-hide-empty-columns"
                .checked=${t.hideEmptyColumns}
                @change=${n=>{t.hideEmptyColumns=n.currentTarget.checked,e.onRequestUpdate?.()}}
              />
              <span>${A(`workboard.hideEmptyColumns`)}</span>
            </label>
          </div>
          <div class="workboard-toolbar__actions">
            <button
              class="btn"
              type="button"
              ?disabled=${t.loading||t.dispatching||ve(t)}
              @click=${()=>he({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate,source:`manual`,refreshDiagnostics:rt(e)})}
            >
              ${t.loading?A(`common.refreshing`):A(`common.refresh`)}
            </button>
            ${h?d`
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${t.dispatching||ve(t)}
                    @click=${()=>de({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}
                  >
                    ${M.zap} ${A(`workboard.dispatch`)}
                  </button>
                `:m}
            ${h?d`
                  <button
                    class="btn primary"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded=${t.draftOpen?`true`:`false`}
                    aria-controls=${Y}
                    ?disabled=${t.dispatching}
                    @click=${()=>{Tt(t),e.onRequestUpdate?.()}}
                  >
                    ${M.plus} ${A(`workboard.newCard`)}
                  </button>
                `:m}
          </div>
        </div>
        ${Wt(t,f,e.onRequestUpdate)}
        ${p?d`<div class="callout danger">${p}</div>`:m}
        ${Ut(t)}
        ${x||_.length===0?Kt():d`
              <div
                class="workboard-board workboard-board--${t.layout} ${_.length===1?`workboard-board--single-column`:``}"
              >
                ${_.map(t=>Jt(e,t,g.get(t)??[]))}
              </div>
            `}
      </div>
      ${Ot(e)} ${Ht(e)}
    </section>
  `}var Xt,Zt,Y,X,Qt,Z,Q,$t,en=e((()=>{g(),p(),Le(),Fe(),Ie(),j(),C(),Qe(),De(),Ze(),i(),$e(),Xt=`workboard-card-modal-title`,Zt=`workboard-card-modal-description`,Y=`workboard-card-modal`,X=`workboard-card-detail-drawer`,Qt=`workboard-card-detail-title`,Z=`workboard-card-detail-description`,Q=[{id:`bugfix`,titleKey:`workboard.templateDraft.bugfixTitle`,notesKey:`workboard.templateDraft.bugfixNotes`,labels:`fix, test`,priority:`high`},{id:`docs`,titleKey:`workboard.templateDraft.docsTitle`,notesKey:`workboard.templateDraft.docsNotes`,labels:`docs`,priority:`normal`},{id:`release`,titleKey:`workboard.templateDraft.releaseTitle`,notesKey:`workboard.templateDraft.releaseNotes`,labels:`release`,priority:`urgent`},{id:`pr_review`,titleKey:`workboard.templateDraft.prReviewTitle`,notesKey:`workboard.templateDraft.prReviewNotes`,labels:`review`,priority:`normal`},{id:`plugin`,titleKey:`workboard.templateDraft.pluginTitle`,notesKey:`workboard.templateDraft.pluginNotes`,labels:`plugin`,priority:`normal`}],$t=[{value:`all`,labelKey:`workboard.viewAll`},{value:`default_agent`,labelKey:`workboard.viewDefaultAgent`},{value:`ready`,labelKey:`workboard.viewReady`},{value:`running`,labelKey:`workboard.viewRunning`},{value:`blocked`,labelKey:`workboard.viewBlocked`},{value:`review`,labelKey:`workboard.viewReview`},{value:`stale`,labelKey:`workboard.viewStale`},{value:`missing_proof`,labelKey:`workboard.viewMissingProof`},{value:`recently_done`,labelKey:`workboard.viewRecentlyDone`}]})),$;e((()=>{l(),p(),h(),Pe(),Me(),Ae(),Be(),ue(),b(),we(),De(),pe(),le(),Ze(),i(),en(),r(),$=class extends oe{constructor(...e){super(...e),this.requestPageUpdate=()=>this.context?.workboard.notify(),this.subscriptions=new se(this).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>{let t=()=>this.syncWorkboardAgentScope();return t(),e.subscribe(t)}).effect(()=>this.context?.runtimeConfig,e=>{let t=()=>{this.requestUpdate(),this.ensureInitialData()};return t(),e.subscribe(t)}).watch(()=>this.context?.sessions,(e,t)=>e.subscribe(t)).effect(()=>this.context?.workboard,e=>{this.syncWorkboardAgentScope();let t=e.subscribe(()=>this.requestUpdate());return()=>{t(),E(e),y(e)}}).effect(()=>this.context?.gateway,e=>{let t=e=>{e.connected&&e.client?this.ensureInitialData():this.context?.workboard&&(E(this.context.workboard),y(this.context.workboard)),this.requestUpdate()};return t(e.snapshot),e.subscribe(t)}).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{let n=this.context?.workboard;n&&e.snapshot.connected&&t.event===`plugin.workboard.changed`&&ee(n,t.payload)})),this.handleVisibilityChange=()=>{document.visibilityState===`visible`&&this.context?.workboard&&ae(this.context.workboard)}}connectedCallback(){super.connectedCallback(),this.ensureInitialData(),this.syncWorkboardBoardFilter(),this.syncWorkboardRuntime(),document.addEventListener(`visibilitychange`,this.handleVisibilityChange)}updated(e){e.has(`routeData`)&&this.syncWorkboardBoardFilter(),this.syncWorkboardRuntime(),this.context?.workboard&&ae(this.context.workboard)}disconnectedCallback(){document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.subscriptions.clear(),super.disconnectedCallback()}ensureInitialData(){let e=this.context,t=e?.gateway.snapshot;!e||!t?.connected||!t.client||(!e.runtimeConfig.state.configSnapshot&&!e.runtimeConfig.state.configLoading&&e.runtimeConfig.ensureLoaded(),!e.agents.state.agentsList&&!e.agents.state.agentsLoading&&e.agents.ensureList(),!e.sessions.state.result&&!e.sessions.state.loading&&e.sessions.refresh())}pluginEnabled(){let e=this.context?.runtimeConfig.state.configSnapshot;return e?te(e):null}syncWorkboardRuntime(){let e=this.context,t=e?.gateway.snapshot,n=this.pluginEnabled();if(!e||!t?.connected||!t.client||n!==!0){e&&(E(e.workboard),y(e.workboard));return}let r=e.workboard.state,i=fe({host:e.workboard,client:t.client,requestUpdate:this.requestPageUpdate});ne({host:e.workboard,client:t.client,requestUpdate:this.requestPageUpdate,force:i,refreshDiagnostics:k(t.hello?.auth??null)}),r.dispatching||ce({host:e.workboard,client:t.client,sessions:e.sessions.state.result?.sessions??[],canWrite:k(t.hello?.auth??null),requestUpdate:this.requestPageUpdate})}reloadConfig(){let e=this.context;e&&e.runtimeConfig.refresh({discardPendingChanges:!0})}syncWorkboardAgentScope(){let e=this.context;if(!e)return;let t=e.agentSelection.state.scopeId;if(this.observedAgentScopeId!==t){this.observedAgentScopeId=t;let n=e.workboard.state,r=e.agents.state.agentsList,i=e=>{let i=n.cards.find(t=>t.id===e);return!!(i&&Ge(i,r,t))};n.agentFilter=`all`,n.detailCardId&&!i(n.detailCardId)&&(n.detailCardId=null,n.detailCommentBody=``),n.editingCardId&&!i(n.editingCardId)&&be(n),e.workboard.notify()}}syncWorkboardBoardFilter(){let e=this.context,t=this.routeData?.boardFilter;!e||!t||e.workboard.state.boardFilter===t||(e.workboard.state.boardFilter=t,e.workboard.notify())}setWorkboardBoardFilter(e){let t=this.context;t&&t.replace(`workboard`,{search:c(this.routeData?.search??``,e)})}render(){let e=this.context;if(!e)return m;let t=e.gateway.snapshot,n=e.runtimeConfig.state,r=t.hello?.auth??null,i=this.pluginEnabled();return d`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${je(`workboard`)}</div>
        </div>
        ${ze({agents:e.agents.state.agentsList?.agents??[],selection:e.agentSelection})}
      </section>
      ${Yt({host:e.workboard,client:t.client,connected:t.connected,canWrite:k(r),canModelOverride:ke(r),pluginEnabled:i,pluginEnablementError:!n.configSnapshot&&!n.configLoading?n.lastError:null,agentsList:e.agents.state.agentsList,sessions:e.sessions.state.result?.sessions??[],scopeAgentId:e.agentSelection.state.scopeId,showAgentFilter:e.agentSelection.state.scopeId===null,onOpenSession:t=>{e.navigate(`chat`,{search:Oe(t),hash:``})},onReloadConfig:()=>this.reloadConfig(),onBoardFilterChange:e=>this.setWorkboardBoardFilter(e),onRequestUpdate:this.requestPageUpdate})}
    `}},t([u({context:Ne,subscribe:!0})],$.prototype,`context`,void 0),t([f({attribute:!1})],$.prototype,`routeData`,void 0),customElements.get(`openclaw-workboard-page`)||customElements.define(`openclaw-workboard-page`,$)}))();
//# sourceMappingURL=workboard-page-r-Cbdkgf.js.map