import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,u as n}from"./control-ui-foundation-43q8Lf_T.js";import{dt as r,ft as i}from"./control-ui-foundation-DQl2NL7K.js";import{$ as a,D as o,G as s,J as c,U as l,X as u,k as d,m as f,p,z as m}from"./lit-runtime-CE4wpvNA.js";import{ut as h}from"./control-ui-foundation-DFIFKu9N.js";import{Bo as ee,Bt as g,Ci as te,Gt as _,Ht as v,It as y,Jt as b,Kt as ne,Lt as re,Mi as ie,Mr as ae,Nr as oe,Pi as se,Qt as ce,Rt as x,Vt as le,Wt as S,Xt as ue,Yt as de,Zt as C,pi as w,qt as T,wn as E,xn as D,zt as O}from"./control-ui-core-Dx4utKSD.js";import{Ut as k,at as A,it as j,jt as M}from"./control-ui-core-6OhF3OIO.js";import{o as N,t as P}from"./control-ui-core-CXeSrnoQ.js";import{D as F,at as I,ot as L}from"./control-ui-core-vPyynwls.js";import{n as R,t as z}from"./settings-workspace-BhCB-OeS.js";import{a as B,c as V,d as H,l as fe,n as U,p as pe,t as me,u as W}from"./settings-ui-BJ5HJKwt.js";import{a as he,c as ge,i as G,n as _e,o as ve,r as ye,s as be,t as xe}from"./skills-shared-TieB6ubK.js";import{o as Se,r as Ce}from"./markdown-UmoHCmlv.js";import{n as we,r as Te,t as Ee}from"./plugins-CDorkKpm.js";function K(e){return e?E(e,window.location.href):null}function De(e,t){switch(t){case`all`:return!0;case`ready`:return!e.disabled&&G(e);case`needs-setup`:return!e.disabled&&!G(e);case`disabled`:return e.disabled}throw Error(`Unsupported skills status filter`)}function Oe(e){return e.disabled?`muted`:G(e)?`ok`:`warn`}function ke(e){return e.disabled?W({kind:`muted`,label:N(`skillsPage.tabs.disabled`)}):G(e)?W({kind:`ok`,label:N(`skillsPage.tabs.ready`)}):W({kind:`warn`,label:N(`skillsPage.tabs.needsSetup`)})}function q(e,t){let n=e.clawhub;return!n||n.status!==`linked`||!n.valid?null:t[y({registry:n.registry,slug:n.slug,version:n.installedVersion})]??null}function J(e){if(!e)return N(`skillsPage.verdict.unavailable`);let t=e.securityStatus?.trim()||null;return e.ok&&e.decision===`pass`?t===`clean`||!t?N(`skillsPage.verdict.clean`):t:N(t===`pending`||t===`not-run`?`skillsPage.verdict.pending`:t===`malicious`?`skillsPage.verdict.blocked`:t===`suspicious`?`skillsPage.verdict.review`:`skillsPage.verdict.unavailable`)}function Ae(e){if(!e)return`chip-warn`;if(e.ok&&e.decision===`pass`)return`chip-ok`;let t=e.securityStatus?.trim()||null;return t===`pending`||t===`not-run`?`chip`:`chip-warn`}function je(e){if(!e)return`warn`;if(e.ok&&e.decision===`pass`)return`ok`;let t=e.securityStatus?.trim()||null;return t===`pending`||t===`not-run`?`muted`:`warn`}function Me(e,t){let n=e.identity?.name?.trim()||e.name?.trim()||e.id;return e.id===t?N(`skillsPage.defaultAgent`,{name:n}):n}function Y(e){return e.loading||e.operation!==null}function Ne(e,t){return e.operation?.kind===`skill`&&e.operation.skillKey===t}function X(e,t){return e.operation?.kind===`clawhub`&&e.operation.slug===t}function Pe(e){let t=e.report?.skills??[],n={all:t.length,ready:0,"needs-setup":0,disabled:0};for(let e of t)e.disabled?n.disabled++:G(e)?n.ready++:n[`needs-setup`]++;let r=e.statusFilter===`all`?t:t.filter(t=>De(t,e.statusFilter)),i=h(e.filter),o=i?r.filter(e=>h([e.name,e.description,e.source].join(` `)).includes(i)):r,s=ve(o),c=e.detailKey?t.find(t=>t.skillKey===e.detailKey)??null:null;return a`
    ${B(a`
        ${Ie(e,n,o.length)}
        ${e.error?a`<div class="callout danger" role="alert">${e.error}</div>`:u}
        ${Le(e)}
        ${o.length===0?U(!e.connected&&!e.report?N(`skillsPage.disconnected`):N(`skillsPage.empty`)):s.map(t=>Fe(t,e))}
      `,{wide:!0})}
    ${c?Be(c,e):u}
    ${e.clawhubDetailSlug?ze(e):u}
  `}function Fe(e,t){return a`
    <details class="settings-section skills-group" open>
      <summary class="settings-section__header skills-group__summary">
        <h2 class="settings-section__heading">
          ${e.label} <span class="settings-count">${e.skills.length}</span>
        </h2>
        <span class="skills-group__chevron" aria-hidden="true">${I.chevronDown}</span>
      </summary>
      <div class="settings-group">
        ${f(e.skills,e=>e.skillKey,e=>Z(e,t))}
      </div>
    </details>
  `}function Ie(e,t,n){let r=e.agentsList?.agents??[],i=e.selectedAgentId??e.agentsList?.defaultId??r[0]?.id??``;return a`
    <div class="plugins-toolbar plugins-toolbar--fields">
      ${fe({value:e.statusFilter,ariaLabel:N(`skillsPage.title`),options:Q.map(e=>({value:e.id,label:a`${N(e.labelKey)}
            <span class="settings-count">${t[e.id]}</span>`})),onChange:t=>e.onStatusFilterChange(t)})}
      ${r.length>0?a`
            <label class="plugins-field skills-toolbar__agent">
              <span>${N(`usage.filters.agent`)}</span>
              <select
                name="skills-agent"
                class="settings-select"
                .value=${i}
                ?disabled=${Y(e)||!e.connected||r.length<2}
                @change=${t=>e.onAgentChange(t.target.value)}
              >
                ${r.map(t=>a`
                    <option value=${t.id} ?selected=${t.id===i}>
                      ${Me(t,e.agentsList?.defaultId)}
                    </option>
                  `)}
              </select>
            </label>
          `:u}
      <label class="plugins-field skills-toolbar__search">
        <span>${N(`common.search`)}</span>
        <input
          class="settings-input"
          .value=${e.filter}
          @input=${t=>e.onFilterChange(t.target.value)}
          placeholder=${N(`skillsPage.filterPlaceholder`)}
          autocomplete="off"
          name="skills-filter"
        />
      </label>
      <span class="plugins-toolbar__hint">
        ${N(`skillsPage.shown`,{count:String(n)})}
      </span>
      <button
        type="button"
        class="btn"
        ?disabled=${Y(e)||!e.connected}
        @click=${e.onRefresh}
      >
        ${e.loading?N(`common.loading`):N(`common.refresh`)}
      </button>
    </div>
  `}function Le(e){return V({title:N(`skillsPage.clawHub`),description:N(`skillsPage.clawHubSubtitle`)},a`
      <div class="settings-row">
        <input
          class="settings-input plugins-row-input"
          .value=${e.clawhubQuery}
          @input=${t=>e.onClawHubQueryChange(t.target.value)}
          placeholder=${N(`skillsPage.searchClawHub`)}
          autocomplete="off"
          name="clawhub-search"
        />
        ${e.clawhubSearchLoading?a`<span class="plugins-toolbar__hint">${N(`skillsPage.searching`)}</span>`:u}
      </div>
      ${e.clawhubSearchError?a`<div class="callout danger plugins-group-message">${e.clawhubSearchError}</div>`:u}
      ${e.clawhubInstallMessage?a`<div
            class="callout ${e.clawhubInstallMessage.kind===`error`?`danger`:`success`} plugins-group-message"
          >
            <div
              style="max-width: 100%; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word;"
            >
              ${e.clawhubInstallMessage.text}
            </div>
            ${e.clawhubInstallMessage.acknowledgeSlug?a`<button
                  type="button"
                  class="btn btn--sm"
                  style="margin-top: 10px; white-space: normal;"
                  ?disabled=${Y(e)}
                  @click=${()=>e.onClawHubInstall(e.clawhubInstallMessage?.acknowledgeSlug??``,!0,e.clawhubInstallMessage?.acknowledgeVersion)}
                >
                  ${e.clawhubInstallMessage.acknowledgeLabel??N(`skillsPage.acknowledgeRisk`)}
                </button>`:u}
          </div>`:u}
      ${Re(e)}
    `)}function Re(e){let t=e.clawhubResults;return t?t.length===0?U(N(`skillsPage.noClawHubResults`)):a`
    ${t.map(t=>a`
        <div class="settings-row plugins-item plugins-item--clickable">
          <button
            type="button"
            class="settings-row__text plugins-item__detail-button"
            aria-label=${N(`skillsPage.openDetails`,{name:t.displayName})}
            @click=${()=>e.onClawHubDetailOpen(t.slug)}
          >
            <span class="settings-row__title">${t.displayName}</span>
            <span class="settings-row__desc">
              ${t.summary?w(t.summary,120):t.slug}
            </span>
          </button>
          <div class="settings-row__control">
            ${t.version?pe(`v${t.version}`):u}
            <button
              class="btn btn--sm"
              ?disabled=${Y(e)}
              @click=${()=>e.onClawHubInstall(t.slug)}
            >
              ${X(e,t.slug)?N(`skillsPage.installing`):N(`skillsPage.install`)}
            </button>
          </div>
        </div>
      `)}
  `:u}function ze(e){let t=e.clawhubDetail;return a`
    <openclaw-modal-dialog
      label=${t?.skill?.displayName??e.clawhubDetailSlug??N(`skillsPage.notFound`)}
      style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${e.onClawHubDetailClose}
    >
      <div class="md-preview-dialog__panel">
        <div class="md-preview-dialog__header">
          <div class="md-preview-dialog__title">
            ${t?.skill?.displayName??e.clawhubDetailSlug}
          </div>
          <button class="btn btn--sm" @click=${e.onClawHubDetailClose}>
            ${N(`skillsPage.close`)}
          </button>
        </div>
        <div class="md-preview-dialog__body" style="display: grid; gap: 16px;">
          ${e.clawhubDetailLoading?a`<div class="muted">${N(`common.loading`)}</div>`:e.clawhubDetailError?a`<div class="callout danger">${e.clawhubDetailError}</div>`:t?.skill?a`
                    <div style="font-size: 14px; line-height: 1.5;">
                      ${t.skill.summary??``}
                    </div>
                    ${t.owner?.displayName?a`<div class="muted" style="font-size: 13px;">
                          ${N(`skillsPage.by`)}
                          ${t.owner.displayName}${t.owner.handle?a` (@${t.owner.handle})`:u}
                        </div>`:u}
                    ${t.latestVersion?a`<div class="muted" style="font-size: 13px;">
                          ${N(`skillsPage.latest`,{version:t.latestVersion.version})}
                        </div>`:u}
                    ${t.latestVersion?.changelog?a`<div
                          style="font-size: 13px; border-top: 1px solid var(--border); padding-top: 12px; white-space: pre-wrap;"
                        >
                          ${t.latestVersion.changelog}
                        </div>`:u}
                    ${t.metadata?.os?a`<div class="muted" style="font-size: 12px;">
                          ${N(`skillsPage.platforms`,{platforms:t.metadata.os.join(`, `)})}
                        </div>`:u}
                    <button
                      class="btn primary"
                      ?disabled=${Y(e)}
                      @click=${()=>{e.clawhubDetailSlug&&e.onClawHubInstall(e.clawhubDetailSlug)}}
                    >
                      ${X(e,e.clawhubDetailSlug??``)?N(`skillsPage.installing`):N(`skillsPage.installNamed`,{name:t.skill.displayName})}
                    </button>
                  `:a`<div class="muted">${N(`skillsPage.notFound`)}</div>`}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function Z(e,t){let n=Y(t),r=q(e,t.clawhubVerdicts);return a`
    <div class="settings-row plugins-item plugins-item--clickable">
      <button
        type="button"
        class="settings-row__text plugins-item__detail-button"
        aria-label=${N(`skillsPage.openDetails`,{name:e.name})}
        @click=${()=>t.onDetailOpen(e.skillKey)}
      >
        <span class="settings-row__title">
          ${e.emoji?a`<span>${e.emoji}</span> `:u}${e.name}
        </span>
        <span class="settings-row__desc">${w(e.description,140)}</span>
      </button>
      <div class="settings-row__control">
        ${ke(e)}
        ${e.clawhub?.status===`linked`?W({kind:je(r),label:J(r)}):e.clawhub?.status===`invalid`?W({kind:`warn`,label:N(`skillsPage.invalidLink`)}):u}
        ${H({checked:!e.disabled,disabled:n,ariaLabel:N(`skillsPage.enabledNamed`,{name:e.name}),onChange:()=>t.onToggle(e.skillKey,e.disabled)})}
      </div>
    </div>
  `}function Be(e,t){let n=Y(t),r=Ne(t,e.skillKey),i=t.edits[e.skillKey]??``,o=t.messages[e.skillKey]??null,s=e.install[0],c=s!==void 0&&e.missing.bins.length>0,l=!!(e.bundled&&e.source!==`openclaw-bundled`),d=xe(e),f=_e(e),p=q(e,t.clawhubVerdicts),m=t.detailTab===`card`&&e.skillCard?.present?`card`:`overview`;return a`
    <openclaw-modal-dialog
      label=${e.name}
      style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${t.onDetailClose}
    >
      <div class="md-preview-dialog__panel">
        <div class="md-preview-dialog__header">
          <div
            class="md-preview-dialog__title"
            style="display: flex; align-items: center; gap: 8px;"
          >
            <span class="statusDot ${Oe(e)}"></span>
            ${e.emoji?a`<span style="font-size: 18px;">${e.emoji}</span>`:u}
            <span>${e.name}</span>
          </div>
          <button class="btn btn--sm" @click=${t.onDetailClose}>
            ${N(`skillsPage.close`)}
          </button>
        </div>
        <div class="md-preview-dialog__body" style="display: grid; gap: 16px;">
          <div>
            <div style="font-size: 14px; line-height: 1.5; color: var(--text);">
              ${e.description}
            </div>
            ${he({skill:e,showBundledBadge:l})}
          </div>

          ${e.clawhub||e.skillCard?.present?a`
                <div class="agent-tabs">
                  <button
                    class="agent-tab ${m===`overview`?`active`:``}"
                    @click=${()=>t.onDetailTabChange(`overview`)}
                  >
                    ${N(`skillsPage.overview`)}
                  </button>
                  ${e.skillCard?.present?a`<button
                        class="agent-tab ${m===`card`?`active`:``}"
                        @click=${()=>t.onDetailTabChange(`card`)}
                      >
                        ${N(`skillsPage.skillCard`)}
                      </button>`:u}
                </div>
              `:u}
          ${m===`overview`?Ve(e,t,p):He(e,t)}
          ${d.length>0?a`
                <div
                  class="callout"
                  style="border-color: var(--warn-subtle); background: var(--warn-subtle); color: var(--warn);"
                >
                  <div style="font-weight: 600; margin-bottom: 4px;">
                    ${N(`skillsPage.missingRequirements`)}
                  </div>
                  <div>${d.join(`, `)}</div>
                </div>
              `:u}
          ${f.length>0?a`
                <div class="muted" style="font-size: 13px;">
                  ${N(`skillsPage.reason`,{reasons:f.join(`, `)})}
                </div>
              `:u}

          <div style="display: flex; align-items: center; gap: 12px;">
            ${H({checked:!e.disabled,disabled:n,ariaLabel:e.name,onChange:()=>t.onToggle(e.skillKey,e.disabled)})}
            <span style="font-size: 13px; font-weight: 500;">
              ${e.disabled?N(`skillsPage.disabled`):N(`skillsPage.enabled`)}
            </span>
            ${c?a`<button
                  class="btn"
                  ?disabled=${n}
                  @click=${()=>s&&t.onInstall(e.skillKey,e.name,s.id)}
                >
                  ${r?N(`skillsPage.installing`):s?.label}
                </button>`:u}
          </div>

          ${o?a`<div class="callout ${o.kind===`error`?`danger`:`success`}">
                ${o.message}
              </div>`:u}
          ${e.primaryEnv?a`
                <div style="display: grid; gap: 8px;">
                  <div class="field">
                    <span
                      >${N(`skillsPage.apiKey`)}
                      <span class="muted" style="font-weight: normal; font-size: 0.88em;"
                        >(${e.primaryEnv})</span
                      ></span
                    >
                    <input
                      type="password"
                      ?disabled=${n}
                      .value=${i}
                      @input=${n=>t.onEdit(e.skillKey,n.target.value)}
                    />
                  </div>
                  ${(()=>{let t=K(e.homepage);return t?a`<div class="muted" style="font-size: 13px;">
                          ${N(`skillsPage.getKey`)}
                          <a href="${t}" target="_blank" rel="noopener noreferrer"
                            >${e.homepage}</a
                          >
                        </div>`:u})()}
                  <button
                    class="btn primary"
                    ?disabled=${n}
                    @click=${()=>t.onSaveKey(e.skillKey)}
                  >
                    ${N(`skillsPage.saveKey`)}
                  </button>
                </div>
              `:u}

          <div
            style="border-top: 1px solid var(--border); padding-top: 12px; display: grid; gap: 6px; font-size: 12px; color: var(--muted);"
          >
            <div>
              <span style="font-weight: 600;">${N(`skillsPage.source`)}</span> ${e.source}
            </div>
            <div style="font-family: var(--mono); word-break: break-all;">${e.filePath}</div>
            ${(()=>{let t=K(e.homepage);return t?a`<div>
                    <a href="${t}" target="_blank" rel="noopener noreferrer"
                      >${e.homepage}</a
                    >
                  </div>`:u})()}
          </div>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function Ve(e,t,n){let r=e.clawhub;if(!r)return u;if(r.status===`invalid`)return a`<div class="callout danger">
      <div style="font-weight: 600; margin-bottom: 4px;">${N(`skillsPage.invalidLink`)}</div>
      <div>${r.reason}</div>
    </div>`;let i=K(n?.securityAuditUrl??void 0),o=n?.reasons?.length?n.reasons.join(`, `):null;return a`
    <div
      class="callout"
      style="display: grid; gap: 8px; border-color: var(--border); background: var(--panel-2);"
    >
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span class="chip ${Ae(n)}">${J(n)}</span>
        <span class="muted" style="font-size: 12px;">${r.slug}@${r.installedVersion}</span>
        ${t.clawhubVerdictsLoading?a`<span class="muted">${N(`skillsPage.refreshing`)}</span>`:u}
      </div>
      ${t.clawhubVerdictsError?a`<div class="muted" style="font-size: 13px;">${t.clawhubVerdictsError}</div>`:o?a`<div class="muted" style="font-size: 13px;">${o}</div>`:u}
      ${i?a`<div style="font-size: 13px;">
            <a href="${i}" target="_blank" rel="noopener noreferrer"
              >${N(`skillsPage.fullSecurityReport`)}</a
            >
          </div>`:u}
    </div>
  `}function He(e,t){if(!e.skillCard?.present)return u;let n=t.skillCardContents[e.skillKey];if(n===void 0){let n=t.skillCardErrors[e.skillKey];return n?a`<div class="callout danger">${n}</div>`:a`<div class="muted" style="font-size: 13px;">
      ${t.skillCardLoadingKey===e.skillKey?N(`skillsPage.loadingSkillCard`):N(`skillsPage.skillCardNotLoaded`)}
    </div>`}return a`
    <article class="sidebar-markdown" style="max-width: 100%; overflow-wrap: anywhere;">
      ${d(Se(n))}
    </article>
  `}var Q,Ue=e((()=>{c(),p(),o(),L(),Ce(),F(),me(),P(),te(),D(),be(),Ee(),ge(),ye(),x(),ee(),Q=[{id:`all`,labelKey:`skillsPage.tabs.all`},{id:`ready`,labelKey:`skillsPage.tabs.ready`},{id:`needs-setup`,labelKey:`skillsPage.tabs.needsSetup`},{id:`disabled`,labelKey:`skillsPage.tabs.disabled`}]})),$;e((()=>{r(),c(),m(),M(),A(),we(),z(),x(),se(),oe(),Ue(),n(),$=class extends ie{constructor(...e){super(...e),this.client=null,this.connected=!1,this.agentsLoading=!1,this.agentsError=null,this.agentsList=null,this.skillsAgentId=null,this.skillsAgentRevision=0,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillsFilter=``,this.skillsStatusFilter=`all`,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.clawhubSearchQuery=``,this.clawhubSearchResults=null,this.clawhubSearchLoading=!1,this.clawhubSearchError=null,this.clawhubDetail=null,this.clawhubDetailSlug=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={},this.clawhubSearchTimer=null,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.hasBoundGatewaySource=!1,this.sourceGeneration=0,this.subscriptions=new ae(this).effect(()=>this.context?.gateway,e=>{let t=this.hasBoundGatewaySource;this.hasBoundGatewaySource=!0;let n=e.subscribe(e=>this.applyGatewaySnapshot(e));return this.applyGatewaySnapshot(e.snapshot,t),n}).effect(()=>this.context?.agents,e=>{let t=e.subscribe(()=>{this.syncAgentState(),this.requestUpdate()});return this.syncAgentState(),this.ensureInitialData(),t})}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}disconnectedCallback(){this.subscriptions.clear(),this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),this.resetLoadedSkillState(),super.disconnectedCallback()}applyGatewaySnapshot(e,t=!1){let n=t||e.client!==this.client,r=e.connected!==this.connected;this.client=e.client,this.connected=e.connected,(n||r)&&this.resetLoadedSkillState(),this.ensureInitialData()}syncAgentState(){let e=this.context.agents.state;if(this.agentsLoading=e.agentsLoading,this.agentsError=e.agentsError,this.agentsList=e.agentsList,e.agentsList){let t=this.skillsAgentId;_(this,e.agentsList),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`)}}resetLoadedSkillState(){this.sourceGeneration++,this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.agentsLoading=!1,this.agentsError=null,this.agentsList=null,this.skillsAgentId=null,this.skillsAgentRevision++,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.clawhubSearchResults=null,this.clawhubSearchLoading=!1,this.clawhubSearchError=null,this.clawhubDetail=null,this.clawhubDetailSlug=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={}}applyRouteData(){let e=this.routeData;if(!e)return;this.routeDataInitialized=!0,this.routeDataEnabled=!0;let t=this.context.gateway,n=t.snapshot;if(this.client=n.client,this.connected=n.connected,e.gateway!==t||e.gatewaySnapshot!==n||e.agents!==this.context.agents){this.routeDataEnabled=!1;return}this.skillsAgentId&&e.selectedAgentId&&e.selectedAgentId!==this.skillsAgentId||(this.agentsLoading=!1,this.agentsError=null,this.agentsList=e.agentsList??this.context.agents.state.agentsList,this.skillsAgentId=e.selectedAgentId??this.skillsAgentId,this.skillsLoading=!1,this.skillsReport=e.report,this.skillsError=e.error)}ensureInitialData(){!this.connected||!this.client||this.routeDataEnabled&&(this.routeData?.agentsList||this.routeData?.report||this.routeData?.error)||(!this.agentsList&&!this.agentsLoading&&this.loadAgents(),!this.skillsReport&&!this.skillsLoading&&S(this),this.clawhubSearchQuery.trim()&&!this.clawhubSearchLoading&&!this.clawhubSearchResults&&!this.clawhubSearchError&&b(this,this.clawhubSearchQuery))}async loadAgents(){let e=this.client;if(!e||!this.connected||this.agentsLoading)return;let t=this.context.gateway,n=this.context.agents,r=this.sourceGeneration,i=()=>this.isConnected&&this.connected&&this.client===e&&this.context.gateway===t&&this.context.agents===n&&this.sourceGeneration===r;if(n.state.agentsList){this.syncAgentState();return}this.agentsLoading=!0,this.agentsError=null;try{let e=await n.ensureList();if(!i())return;this.agentsList=e;let t=this.skillsAgentId;_(this,e),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`)}catch(e){i()&&(this.agentsError=String(e))}finally{i()&&(this.agentsLoading=!1)}}async refreshPage(){await ne(this,()=>this.loadAgents())}changeAgent(e){if(this.skillOperation||this.skillsLoading)return;let t=this.skillsAgentId;ue(this,e),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`),S(this,{clearMessages:!0})}changeClawHubQuery(e){de(this,e),this.clawhubSearchTimer&&clearTimeout(this.clawhubSearchTimer),this.clawhubSearchTimer=setTimeout(()=>void b(this,e),300)}changeDetailTab(e){this.skillsDetailTab=e,e===`card`&&this.skillsDetailKey&&v(this,this.skillsDetailKey)}selectHubTab(e){if(e!==`skills`){if(e===`workshop`){this.context.navigate(`skill-workshop`);return}this.context.navigate(`plugins`,e===`discover`?{search:`?tab=discover`}:void 0)}}render(){let e=this.skillsError??this.agentsError;return a`
      <section class="content-header content-header--page plugins-content-header">
        <div>
          <h1 class="page-title">${k(`skills`)}</h1>
        </div>
      </section>
      ${R(a`
        <div class="plugins-hub-tabs-row">
          ${Te({active:`skills`,onSelect:e=>this.selectHubTab(e)})}
        </div>
        <wa-tab-panel
          id="plugins-hub-panel"
          name="skills"
          active
          aria-labelledby="plugins-tab-skills"
        >
          ${Pe({connected:this.connected,loading:this.skillsLoading||this.agentsLoading,report:this.skillsReport,agentsList:this.agentsList,selectedAgentId:this.skillsAgentId??this.agentsList?.defaultId??null,error:e,filter:this.skillsFilter,statusFilter:this.skillsStatusFilter,edits:this.skillEdits,messages:this.skillMessages,operation:this.skillOperation,detailKey:this.skillsDetailKey,detailTab:this.skillsDetailTab,clawhubVerdicts:this.clawhubVerdicts,clawhubVerdictsLoading:this.clawhubVerdictsLoading,clawhubVerdictsError:this.clawhubVerdictsError,skillCardContents:this.skillCardContents,skillCardLoadingKey:this.skillCardLoadingKey,skillCardErrors:this.skillCardErrors,clawhubQuery:this.clawhubSearchQuery,clawhubResults:this.clawhubSearchResults,clawhubSearchLoading:this.clawhubSearchLoading,clawhubSearchError:this.clawhubSearchError,clawhubDetail:this.clawhubDetail,clawhubDetailSlug:this.clawhubDetailSlug,clawhubDetailLoading:this.clawhubDetailLoading,clawhubDetailError:this.clawhubDetailError,clawhubInstallMessage:this.clawhubInstallMessage,onAgentChange:e=>this.changeAgent(e),onFilterChange:e=>this.skillsFilter=e,onStatusFilterChange:e=>this.skillsStatusFilter=e,onRefresh:()=>void this.refreshPage(),onToggle:(e,t)=>void ce(this,e,t),onEdit:(e,t)=>C(this,e,t),onSaveKey:e=>void T(this,e),onInstall:(e,t,n)=>void g(this,e,t,n),onDetailOpen:e=>{this.skillsDetailKey=e,this.skillsDetailTab=`overview`},onDetailClose:()=>this.skillsDetailKey=null,onDetailTabChange:e=>this.changeDetailTab(e),onClawHubQueryChange:e=>this.changeClawHubQuery(e),onClawHubDetailOpen:e=>void le(this,e),onClawHubDetailClose:()=>re(this),onClawHubInstall:(e,t,n)=>void O(this,e,t,n)})}
        </wa-tab-panel>
      `)}
    `}},t([i({context:j,subscribe:!0})],$.prototype,`context`,void 0),t([s({attribute:!1})],$.prototype,`routeData`,void 0),t([l()],$.prototype,`client`,void 0),t([l()],$.prototype,`connected`,void 0),t([l()],$.prototype,`agentsLoading`,void 0),t([l()],$.prototype,`agentsError`,void 0),t([l()],$.prototype,`agentsList`,void 0),t([l()],$.prototype,`skillsAgentId`,void 0),t([l()],$.prototype,`skillsAgentRevision`,void 0),t([l()],$.prototype,`skillsLoading`,void 0),t([l()],$.prototype,`skillsReport`,void 0),t([l()],$.prototype,`skillsError`,void 0),t([l()],$.prototype,`skillOperation`,void 0),t([l()],$.prototype,`skillsFilter`,void 0),t([l()],$.prototype,`skillsStatusFilter`,void 0),t([l()],$.prototype,`skillEdits`,void 0),t([l()],$.prototype,`skillMessages`,void 0),t([l()],$.prototype,`skillsDetailKey`,void 0),t([l()],$.prototype,`skillsDetailTab`,void 0),t([l()],$.prototype,`clawhubSearchQuery`,void 0),t([l()],$.prototype,`clawhubSearchResults`,void 0),t([l()],$.prototype,`clawhubSearchLoading`,void 0),t([l()],$.prototype,`clawhubSearchError`,void 0),t([l()],$.prototype,`clawhubDetail`,void 0),t([l()],$.prototype,`clawhubDetailSlug`,void 0),t([l()],$.prototype,`clawhubDetailLoading`,void 0),t([l()],$.prototype,`clawhubDetailError`,void 0),t([l()],$.prototype,`clawhubInstallMessage`,void 0),t([l()],$.prototype,`clawhubVerdicts`,void 0),t([l()],$.prototype,`clawhubVerdictsLoading`,void 0),t([l()],$.prototype,`clawhubVerdictsError`,void 0),t([l()],$.prototype,`skillCardContents`,void 0),t([l()],$.prototype,`skillCardContentKeys`,void 0),t([l()],$.prototype,`skillCardLoadingKey`,void 0),t([l()],$.prototype,`skillCardErrors`,void 0),customElements.get(`openclaw-skills-page`)||customElements.define(`openclaw-skills-page`,$)}))();
//# sourceMappingURL=skills-page-DGlZokQH.js.map