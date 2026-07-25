import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,o as n,r,u as i}from"./control-ui-foundation-43q8Lf_T.js";import{dt as a,ft as o}from"./control-ui-foundation-DQl2NL7K.js";import{$ as s,G as c,J as l,U as u,X as d,z as f}from"./lit-runtime-CE4wpvNA.js";import{L as p,ft as m,ut as h,z as g}from"./control-ui-foundation-DFIFKu9N.js";import{i as _,n as v}from"./gateway-runtime-DWs8EJ0W.js";import{$n as y,Ar as b,Ba as x,Bo as S,Ci as C,Fn as w,Ft as T,Ha as E,In as D,Li as O,Lo as k,Mi as ee,Mn as te,Mr as ne,Nr as re,Nt as ie,On as ae,Pi as oe,Qa as A,Ra as j,Ri as se,Sn as ce,Va as le,Ya as M,Zn as N,_n as ue,br as de,dr as fe,gn as pe,jn as me,jr as P,kn as he,ra as ge,ua as F,wi as I,x as _e,xi as L,xn as ve,xr as R,yi as ye,z as be,zo as xe}from"./control-ui-core-Dx4utKSD.js";import{Ct as Se,H as Ce,Tt as we,U as Te,Ut as Ee,at as De,it as Oe,jt as ke}from"./control-ui-core-6OhF3OIO.js";import{o as z,t as B}from"./control-ui-core-CXeSrnoQ.js";import{$ as Ae,H as je,Q as Me,U as Ne,V as Pe,W as Fe,at as V,ot as Ie}from"./control-ui-core-vPyynwls.js";import{n as Le,t as Re}from"./settings-workspace-BhCB-OeS.js";import{a as ze,c as H,t as Be,u as Ve}from"./settings-ui-BJ5HJKwt.js";import{o as He,s as Ue}from"./presenter-PwgnXVPR.js";import{a as We,c as U,f as Ge,i as Ke,n as qe,p as Je}from"./thinking-DEtfIII5.js";import{i as Ye,s as Xe,t as Ze}from"./session-goal-BCKLIdYx.js";import{n as Qe,t as $e}from"./agent-scope-control-ClLrhBs5.js";import{n as et,t as tt}from"./sessions-hub-tabs-eM_x01uP.js";function nt(e){return[...new Set((e?.sessions??[]).map(e=>M(e.key)?.agentId).filter(e=>!!e))]}function rt(e,t){return Object.fromEntries(nt(e).map(e=>[e,t(e)]).filter(e=>!!e[1]))}async function it(e){let t=[...e.result?.sessions??[]],n=e.result?.hasMore===!0?e.result.nextOffset??(e.result.offset??0)+e.result.sessions.length:null;for(;n!=null;){let r=await e.listSessions({...e.listOptions,limit:200,offset:n});if(!r)break;t.push(...r.sessions);let i=r.hasMore===!0?r.nextOffset??(r.offset??n)+r.sessions.length:null;if(i==null||i<=n)break;n=i}let r=new Map;for(let n of t){let t=e.resolveAgentId(n.key);if(!t)continue;let i=r.get(t)??[];i.push(n.key),r.set(t,i)}let i=[];for(let[t,n]of r)for(let r=0;r<n.length;r+=200)i.push(e.client.request(`sessions.search`,{agentId:t,sessionKeys:n.slice(r,r+200),query:e.query,limit:25}));let a=await Promise.all(i),o=a.flatMap(e=>e.results).toSorted((e,t)=>t.score-e.score||t.timestamp-e.timestamp).slice(0,25);return{results:o,indexing:a.some(e=>e.indexing===!0),truncated:a.some(e=>e.truncated===!0)||a.reduce((e,t)=>e+t.results.length,0)>o.length}}var at=e((()=>{E()}));function ot(e,t){let n=(e?.sessions??[]).map(e=>e.category?.trim()).filter(e=>!!e);return[...new Set([...t,...n.toSorted((e,t)=>e.localeCompare(t))])]}async function st(e){if(!(!e.sessions||e.knownCategories.includes(e.name)))try{await e.sessions.groupsPut([...e.sessions.state.groups??[],e.name])}catch(t){e.isCurrent()&&e.onError(String(t))}}var ct=e((()=>{}));function lt(){return te(k()?.getItem(G))}function ut(e){try{k()?.setItem(G,e)}catch{}}function W(e){return g(e)}var G,dt=e((()=>{p(),me(),xe(),G=`openclaw:sessions:group-by`})),ft=e((()=>{}));function K(e,t){return Object.hasOwn(e,t)?e[t]??null:null}function pt(e,t){let n=Je(e,t),r=qe(e.thinkingDefault??(n?t?.thinkingDefault:void 0)),i=e.thinkingLevels?.length?e.thinkingLevels:n&&t?.thinkingLevels?.length?t.thinkingLevels:(e.thinkingOptions?.length?e.thinkingOptions:n&&t?.thinkingOptions?.length?t.thinkingOptions:Z).map(e=>({id:U(e),label:e}));return[{value:``,label:r},...i.map(e=>({value:U(e.id),label:Ke(e.id,e.label)}))]}function mt(e,t){return!t||e.includes(t)?[...e]:[...e,t]}function q(e,t){return!t||e.some(e=>e.value===t)?[...e]:[...e,{value:t,label:Ke(t)}]}function ht(){return Xt.map(e=>({value:e,label:z(e===``?`sessionsView.inherit`:e===`off`?`sessionsView.offExplicit`:`sessionsView.${e}`)}))}function gt(){return Zt.map(e=>({value:e,label:z(e===``?`sessionsView.inherit`:`sessionsView.${e}`)}))}function _t(e){switch(e){case`running`:return z(`sessionsView.statusRunning`);case`done`:return z(`sessionsView.statusDone`);case`failed`:return z(`sessionsView.statusFailed`);case`killed`:return z(`sessionsView.statusKilled`);case`timeout`:return z(`sessionsView.statusTimeout`);default:return z(`sessionsView.statusUnknown`)}}function vt(e){if(P(e))return{label:z(`sessionsView.statusLive`),tone:`live`};if(e.status===`running`&&e.hasActiveRun===!1)return{label:z(`sessionsView.statusIdle`),tone:`idle`};if(e.status){let t=e.status===`done`?`done`:`failed`;return{label:_t(e.status),tone:t}}return e.hasActiveRun===!1?{label:z(`sessionsView.statusIdle`),tone:`idle`}:{label:z(`sessionsView.statusUnknown`),tone:`muted`}}function yt(e){let t=vt(e);return s`
    <openclaw-tooltip .content=${`${z(`sessionsView.status`)}: ${t.label}`}>
      ${Ve({kind:en[t.tone],label:t.label})}
    </openclaw-tooltip>
  `}function bt(e){return s`
    <span class="session-avatar session-avatar--${e.kind}" aria-hidden="true">
      ${tn[e.kind]??V.circle}
      ${P(e)?s`<span class="session-avatar__status"></span>`:d}
    </span>
  `}function xt(e){return typeof e.totalTokens==`number`&&Number.isFinite(e.totalTokens)}function St(e){let t=e.totalTokens;if(typeof t!=`number`||!Number.isFinite(t))return s`<span class="muted">${z(`common.na`)}</span>`;let n=e.totalTokensFresh!==!1,r=`${n?``:`~`}${L(t)}`,i=typeof e.contextTokens==`number`&&e.contextTokens>0?e.contextTokens:null;if(!i)return s`<span class="session-tokens__value">${r}</span>`;let a=Math.min(100,Math.round(t/i*100)),o=n?a>=rn?`danger`:a>=nn?`warn`:`ok`:`stale`,c=z(n?`sessionsView.contextUsage`:`sessionsView.contextUsageApprox`,{percent:String(a),used:t.toLocaleString(),context:i.toLocaleString()});return s`
    <openclaw-tooltip .content=${c}>
      <div class="session-tokens">
        <span class="session-tokens__value">${r} / ${L(i)}</span>
        <span
          class="session-context-meter session-context-meter--${o}"
          role="img"
          aria-label=${c}
        >
          <span class="session-context-meter__fill" style=${`width: ${a}%`}></span>
        </span>
      </div>
    </openclaw-tooltip>
  `}function Ct(e,t){let n=e.filter(e=>e.unread===!0).length,r=e.filter(xt),i=r.reduce((e,t)=>e+(t.totalTokens??0),0),a=r.length<e.length||r.some(e=>e.totalTokensFresh===!1),o=r.length===0?z(`common.na`):`${a?`~`:``}${L(i)}`;return s`
    <div class="sessions-overview">
      ${[{id:`sessions`,icon:V.messageSquare,label:z(`sessionsView.title`),value:String(e.length),active:!1},{id:`live`,icon:V.zap,label:z(`sessionsView.statusLive`),value:String(t),active:t>0},{id:`unread`,icon:V.eye,label:z(`sessionsView.unread`),value:String(n),active:n>0},{id:`tokens`,icon:V.barChart,label:z(`sessionsView.tokens`),value:o,active:!1}].map(e=>s`
          <div class=${[`sessions-overview__tile`,`sessions-overview__tile--${e.id}`,e.active?`sessions-overview__tile--active`:``].filter(Boolean).join(` `)}>
            <span class="sessions-overview__icon" aria-hidden="true">${e.icon}</span>
            <span class="sessions-overview__meta">
              <span class="sessions-overview__value">${e.value}</span>
              <span class="sessions-overview__label">${e.label}</span>
            </span>
          </div>
        `)}
    </div>
  `}function wt(e,t){let n=t.find(t=>t.key===e.sessionKey);return m(n?.label)??m(n?.displayName)??e.sessionKey}function Tt(e,t){let n=e.transcriptSearchQuery.trim().length>0,i=e.transcriptSearch,a=i.status===`results`?i.results:[],o=i.status===`loading`;return s`
    <section
      class="sessions-transcript-search"
      aria-label=${z(`sessionsView.transcriptSearchTitle`)}
    >
      <form
        class="sessions-transcript-search__form"
        role="search"
        aria-label=${z(`sessionsView.transcriptSearchTitle`)}
        @submit=${t=>{t.preventDefault(),e.transcriptSearchAvailable&&n&&!o&&e.onTranscriptSearch()}}
      >
        <div class="data-table-search sessions-transcript-search__input">
          <input
            type="search"
            maxlength="4096"
            aria-label=${z(`sessionsView.transcriptSearchInputLabel`)}
            placeholder=${z(`sessionsView.transcriptSearchPlaceholder`)}
            .value=${e.transcriptSearchQuery}
            ?disabled=${!e.transcriptSearchAvailable}
            @input=${t=>e.onTranscriptSearchChange(t.target.value)}
          />
        </div>
        <button
          class="btn primary"
          type="submit"
          ?disabled=${!e.transcriptSearchAvailable||!n||o}
        >
          ${z(o?`sessionsView.transcriptSearchSearching`:`sessionsView.transcriptSearchAction`)}
        </button>
        ${n?s`
              <button class="btn" type="button" @click=${e.onClearTranscriptSearch}>
                ${z(`sessionsView.transcriptSearchClear`)}
              </button>
            `:d}
      </form>
      ${e.transcriptSearchAvailable?d:s`
            <div class="muted" role="status">${z(`sessionsView.transcriptSearchUnavailable`)}</div>
          `}
      <div
        class="sessions-transcript-search__status"
        aria-live="polite"
        aria-busy=${o?`true`:`false`}
      >
        ${o?s`<span class="muted">${z(`sessionsView.transcriptSearchSearching`)}</span>`:d}
        ${i.status===`error`?s`
              <div
                class="sessions-transcript-search__notice sessions-transcript-search__notice--danger"
              >
                <span>${z(`sessionsView.transcriptSearchError`)}: ${i.message}</span>
                <button class="btn btn--sm" type="button" @click=${e.onTranscriptSearch}>
                  ${z(`sessionsView.transcriptSearchRetry`)}
                </button>
              </div>
            `:d}
        ${i.status===`results`&&i.indexing?s`
              <div class="sessions-transcript-search__notice">
                <span>${z(`sessionsView.transcriptSearchIndexing`)}</span>
                <button
                  class="btn btn--sm"
                  type="button"
                  ?disabled=${o}
                  @click=${e.onTranscriptSearch}
                >
                  ${z(`sessionsView.transcriptSearchRetry`)}
                </button>
              </div>
            `:d}
        ${i.status===`results`&&a.length===0&&!i.indexing?s`
              <div class="sessions-transcript-search__empty" role="status">
                ${z(`sessionsView.transcriptSearchEmpty`)}
              </div>
            `:d}
        ${a.length>0?s`
              <div class="sessions-transcript-search__results">
                <div class="sessions-transcript-search__summary">
                  <strong
                    >${z(`sessionsView.transcriptSearchMatches`,{count:String(a.length)})}</strong
                  >
                  ${i.status===`results`&&i.truncated?s`<span class="muted"
                        >${z(`sessionsView.transcriptSearchTruncated`)}</span
                      >`:d}
                </div>
                <div class="sessions-transcript-search__list">
                  ${a.map(n=>{let i=n.timestamp>0?r(n.timestamp):z(`common.na`),a=n.timestamp>0?ye(n.timestamp):i;return s`
                      <button
                        class="sessions-transcript-search__result"
                        type="button"
                        @click=${()=>e.onNavigateToChat?.(n.sessionKey)}
                      >
                        <span class="sessions-transcript-search__result-header">
                          <strong>${wt(n,t)}</strong>
                          <span class="muted" title=${a}>
                            ${z(`sessionsView.${n.role}`)} · ${i}
                          </span>
                        </span>
                        <span class="sessions-transcript-search__snippet">${n.snippet}</span>
                        <span class="sessions-transcript-search__key">${n.sessionKey}</span>
                      </button>
                    `})}
                </div>
              </div>
            `:d}
      </div>
    </section>
  `}function Et(e){return Array.from({length:an},(t,n)=>s`
      <tr class="session-skeleton-row" aria-hidden="true">
        ${Array.from({length:e},(e,t)=>t===0?s`<td class="data-table-checkbox-col"></td>`:s`<td>
                <span
                  class="session-skeleton ${t===1?`session-skeleton--key`:``}"
                  style=${`animation-delay: ${n*120}ms`}
                ></span>
              </td>`)}
      </tr>
    `)}function Dt(e){return e||null}function Ot(e,t,n){let r=h(t);return r?e.filter(e=>{let t=h(e.key),i=h(e.label),a=h(e.category),o=h(e.kind),s=h(e.displayName),c=h(F(e.agentRuntime)),l=h(e.status),u=e.goal?h(`${e.goal.objective} ${e.goal.status} ${Ye(e.goal)} ${e.goal.lastStatusNote??``}`):``,d=P(e)?`live running`:e.hasActiveRun===!1?`idle`:``;if(t.includes(r)||i.includes(r)||a.includes(r)||o.includes(r)||s.includes(r)||c.includes(r)||l.includes(r)||u.includes(r)||d.includes(r))return!0;let f=I(e.key);return(f?h(K(n,f.agentId)?.name):``).includes(r)}):e}function kt(e,t,n){let r=n===`asc`?1:-1;return[...e].toSorted((e,n)=>{let i=(n.pinnedAt??0)-(e.pinnedAt??0);if(i!==0)return i;let a=0;switch(t){case`key`:a=(e.key??``).localeCompare(n.key??``);break;case`kind`:a=(e.kind??``).localeCompare(n.kind??``);break;case`updated`:a=(e.updatedAt??0)-(n.updatedAt??0);break;case`tokens`:a=(e.totalTokens??e.inputTokens??e.outputTokens??0)-(n.totalTokens??n.inputTokens??n.outputTokens??0);break}return a*r})}function At(e,t,n){let r=t*n;return e.slice(r,r+n)}function jt(e){return W(e)!==void 0}function Mt(e){return h(e.searchQuery).length>0||jt(e.activeMinutes)||jt(e.limit)||!e.includeGlobal||!e.includeUnknown||!e.showArchived}function Nt(e){switch(e){case`manual`:return z(`sessionsView.manual`);case`auto-threshold`:return z(`sessionsView.autoThreshold`);case`overflow-retry`:return z(`sessionsView.overflowRetry`);case`timeout-retry`:return z(`sessionsView.timeoutRetry`);default:return e}}function Pt(e){return z(e===1?`sessionsView.checkpoint`:`sessionsView.checkpoints`,{count:String(e)})}function Ft(e){return typeof e.tokensBefore==`number`&&typeof e.tokensAfter==`number`&&Number.isFinite(e.tokensBefore)&&Number.isFinite(e.tokensAfter)?z(`sessionsView.tokenRange`,{before:e.tokensBefore.toLocaleString(),after:e.tokensAfter.toLocaleString()}):typeof e.tokensBefore==`number`&&Number.isFinite(e.tokensBefore)?z(`sessionsView.tokensBefore`,{count:e.tokensBefore.toLocaleString()}):z(`sessionsView.tokenDeltaUnavailable`)}function It(e){return typeof e!=`number`||!Number.isFinite(e)||e<0?null:n(e,{spaced:!0})??`0ms`}function Lt(e){if(!e)return d;let t=e.status===`active`?`accent`:e.status===`complete`?`ok`:e.status===`blocked`||e.status===`budget_limited`||e.status===`usage_limited`?`warn`:`muted`,n=Ze(e);return s`
    <openclaw-tooltip .content=${n}>
      <span tabindex="0" aria-label=${n}>
        ${Ve({kind:t,label:Ye(e)})}
      </span>
    </openclaw-tooltip>
  `}function Rt(e){let{row:t,updated:n,checkpointCount:r}=e,i=[{label:z(`sessionsView.key`),value:t.key},{label:z(`sessionsView.kind`),value:t.kind},{label:z(`sessionsView.updated`),value:n},{label:z(`sessionsView.tokens`),value:He(t)},{label:z(`sessionsView.compaction`),value:Pt(r)}],a=(e,t)=>{let n=m(t);n&&i.push({label:e,value:n})};return a(z(`sessionsView.group`),t.category),a(z(`sessionsView.status`),t.status),t.goal&&i.push({label:z(`sessionsView.goal`),value:Ze(t.goal)}),a(z(`sessionsView.goalNote`),t.goal?.lastStatusNote),a(z(`sessionsView.model`),t.model),a(z(`sessionsView.provider`),t.modelProvider),a(z(`sessionsView.runtime`),F(t.agentRuntime)),a(z(`sessionsView.runDuration`),It(t.runtimeMs)),a(z(`sessionsView.surface`),t.surface),a(z(`sessionsView.subject`),t.subject),a(z(`sessionsView.room`),t.room),a(z(`sessionsView.space`),t.space),a(z(`sessionsView.sessionId`),t.sessionId),typeof t.hasActiveRun==`boolean`&&i.push({label:z(`sessionsView.activeRun`),value:t.hasActiveRun?z(`common.yes`):z(`common.no`)}),typeof t.archived==`boolean`&&i.push({label:z(`sessionsView.archived`),value:t.archived?z(`common.yes`):z(`common.no`)}),typeof t.pinned==`boolean`&&i.push({label:z(`sessionsView.pinned`),value:t.pinned?z(`common.yes`):z(`common.no`)}),i}function J(e){return e.groupBy===`category`?8:7}function zt(e){switch(e){case`category`:return z(`sessionsView.groupByCategory`);case`channel`:return z(`sessionsView.groupByChannel`);case`kind`:return z(`sessionsView.groupByKind`);case`agent`:return z(`sessionsView.groupByAgent`);case`date`:return z(`sessionsView.groupByDate`);default:return z(`sessionsView.groupByNone`)}}function Bt(e,t){if(t.groupBy===`date`)switch(e){case`today`:return z(`sessionsView.dateToday`);case`yesterday`:return z(`sessionsView.dateYesterday`);case`week`:return z(`sessionsView.dateThisWeek`);case`older`:return z(`sessionsView.dateOlder`);default:return z(`sessionsView.dateNoActivity`)}if(e===``)return z(`sessionsView.ungrouped`);if(t.groupBy===`agent`){let n=K(t.agentIdentityById,e),r=m(n?.name);if(r){let e=m(n?.emoji);return e?`${e} ${r}`:r}}return e}function Y(e,t){e.currentTarget?.classList.toggle(`session-drop-target--active`,t)}function Vt(e,t){if(e.groupBy!==`category`)return{dragover:d,dragleave:d,drop:d};let n=e=>e.dataTransfer?.types.includes(w)===!0;return{dragover:e=>{n(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`move`),Y(e,!0))},dragleave:e=>Y(e,!1),drop:r=>{if(!n(r))return;r.preventDefault(),Y(r,!1);let i=r.dataTransfer?.getData(w);i&&e.onAssignCategory(i,t)}}}function Ht(e,t){let n=Bt(e.id,t),r=e.rows.length===1?z(`sessionsView.groupRowCountOne`,{count:`1`}):z(`sessionsView.groupRowCount`,{count:String(e.rows.length)}),i=Vt(t,e.id===``?null:e.id);return s`
    <tr
      class="session-group-row"
      @dragover=${i.dragover}
      @dragleave=${i.dragleave}
      @drop=${i.drop}
    >
      <td colspan=${J(t)}>
        <div class="session-group-row__header">
          <span class="session-group-row__icon" aria-hidden="true">${V.folder}</span>
          <span class="session-group-row__label">${n}</span>
          <span class="session-group-row__count">${r}</span>
        </div>
      </td>
    </tr>
  `}function Ut(e,t){let n=m(e.category)??``,r=[...t.knownCategories];return n&&!r.includes(n)&&r.push(n),s`
    <td>
      <select
        ?disabled=${t.loading}
        aria-label=${z(`sessionsView.moveToGroup`)}
        class="session-group-select"
        @change=${r=>{let i=r.target;if(i.value===Q){i.value=n,t.onRequestNewCategory(e.key);return}t.onAssignCategory(e.key,i.value||null)}}
      >
        <option value="" ?selected=${!n}>${z(`sessionsView.ungrouped`)}</option>
        ${r.map(e=>s`<option value=${e} ?selected=${n===e}>${e}</option>`)}
        <option value=${Q}>${z(`sessionsView.newGroup`)}</option>
      </select>
    </td>
  `}function Wt(e){return e instanceof Element&&!!e.closest(`a, button, input, label, select, textarea`)}function Gt(e){let t=[`session-filter-check`,`session-filter-toggle`,e.extraClass??``,e.checked?`session-filter-check--active`:``].filter(Boolean).join(` `);return s`
    <openclaw-tooltip .content=${e.title}>
      <label class=${t}>
        <input
          name=${e.name}
          class="session-filter-check__input"
          type="checkbox"
          .checked=${e.checked}
          @change=${t=>e.onChange(t.target.checked)}
        />
        <span class="session-filter-check__mark" aria-hidden="true">${V.check}</span>
        <span class="session-filter-check__label">${e.label}</span>
      </label>
    </openclaw-tooltip>
  `}function X(e){return s`
    <label class="session-override-field">
      <span class="session-override-field__label">${e.label}</span>
      <select
        class="settings-select"
        ?disabled=${e.disabled}
        @change=${t=>e.onChange(t.target.value)}
      >
        ${e.options.map(t=>s`<option value=${t.value} ?selected=${e.current===t.value}>
              ${t.label}
            </option>`)}
      </select>
    </label>
  `}function Kt(e){let t=e.result?.sessions??[],n=Ot(t,e.searchQuery,e.agentIdentityById),r=kt(n,e.sortColumn,e.sortDir),i=r.length,a=Math.max(1,Math.ceil(i/e.pageSize)),o=Math.min(e.page,a-1),c=e.groupBy!==`none`,l=c?he({rows:r,mode:e.groupBy,knownCategories:e.knownCategories}):null,u=c?r:At(r,o,e.pageSize),f=t.length===0?Mt(e):n.length===0,p=t.filter(e=>P(e)).length,m=t.filter(e=>e.archived===!0).length,h=(t,n,r=``)=>{let i=e.sortColumn===t,a=i&&e.sortDir===`asc`?`desc`:`asc`;return s`
      <th
        class=${r}
        data-sortable
        data-sort-dir=${i?e.sortDir:``}
        @click=${()=>e.onSortChange(t,i?a:`desc`)}
      >
        ${n}
        <span class="data-table-sort-icon">${V.arrowUpDown}</span>
      </th>
    `},g=s`
    ${z(`sessionsView.title`)}
    ${e.result?s`
          <openclaw-tooltip .content=${z(`sessionsView.store`,{path:e.result.path})}>
            <span class="settings-count">${t.length}</span>
          </openclaw-tooltip>
        `:d}
  `,_=s`
    ${e.showArchived?s`
          <button
            class="btn danger"
            ?disabled=${e.loading||m===0}
            @click=${e.onDeleteAllArchived}
          >
            ${V.trash} ${z(`sessionsView.deleteAllArchived`)}
          </button>
        `:d}
    <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
      ${e.loading?z(`common.loading`):z(`common.refresh`)}
    </button>
  `;return ze([e.error?s`<div class="sessions-error">${e.error}</div>`:d,e.result?H({},Ct(t,p)):d,H({title:z(`sessionsView.transcriptSearchTitle`),description:z(`sessionsView.transcriptSearchDescription`)},Tt(e,t)),H({title:g,description:z(`sessionsView.subtitle`),actions:_},qt(e,{paginated:u,groups:l,groupingActive:c,emptyBecauseFiltered:f,totalRows:i,totalPages:a,page:o,sortHeader:h}))],{wide:!0})}function qt(e,t){let{paginated:n,groups:r,groupingActive:i,emptyBecauseFiltered:a,totalRows:o,totalPages:c,page:l}=t,u=t.sortHeader,f=z(`sessionsView.activeTooltip`,{count:e.activeMinutes.trim()}),p=z(`sessionsView.limitTooltip`),m=z(`sessionsView.globalTooltip`),h=z(`sessionsView.unknownTooltip`);return s`
    <div
      class="sessions-toolbar sessions-filter-bar"
      aria-label=${z(`sessionsView.filterControls`)}
    >
      <div class="data-table-search sessions-toolbar__search">
        ${V.search}
        <input
          type="text"
          placeholder=${z(`sessionsView.searchPlaceholder`)}
          .value=${e.searchQuery}
          @input=${t=>e.onSearchChange(t.target.value)}
        />
      </div>
      <div class="session-filter-primary-row">
        <openclaw-tooltip .content=${f}>
          <label class="session-filter-field">
            <span class="session-filter-label">${z(`sessionsView.active`)}</span>
            <input
              class="session-filter-input session-filter-input--minutes"
              placeholder=${z(`sessionsView.minutesPlaceholder`)}
              .value=${e.activeMinutes}
              ?disabled=${e.showArchived}
              @input=${t=>e.onFiltersChange({activeMinutes:t.target.value,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown,showArchived:e.showArchived})}
            />
          </label>
        </openclaw-tooltip>
        <openclaw-tooltip .content=${p}>
          <label class="session-filter-field">
            <span class="session-filter-label">${z(`sessionsView.limit`)}</span>
            <input
              class="session-filter-input session-filter-input--limit"
              .value=${e.limit}
              @input=${t=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:t.target.value,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown,showArchived:e.showArchived})}
            />
          </label>
        </openclaw-tooltip>
      </div>
      <div
        class="session-filter-toggle-group"
        role="group"
        aria-label=${z(`sessionsView.sourceFilters`)}
      >
        ${Gt({name:`includeGlobal`,checked:e.includeGlobal,label:z(`sessionsView.global`),title:m,onChange:t=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:t,includeUnknown:e.includeUnknown,showArchived:e.showArchived})})}
        ${Gt({name:`includeUnknown`,checked:e.includeUnknown,label:z(`sessionsView.unknown`),title:h,onChange:t=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:t,showArchived:e.showArchived})})}
        <div
          class="settings-segmented sessions-view-segment"
          role="group"
          aria-label=${z(`sessionsView.sessionState`)}
        >
          <button
            type="button"
            class="settings-segmented__btn ${e.showArchived?``:`settings-segmented__btn--active`}"
            aria-pressed=${String(!e.showArchived)}
            @click=${()=>e.onArchivedViewChange(!1)}
          >
            ${z(`common.active`)}
          </button>
          <button
            type="button"
            class="settings-segmented__btn ${e.showArchived?`settings-segmented__btn--active`:``}"
            aria-pressed=${String(e.showArchived)}
            title=${z(`sessionsView.archivedOnlyTooltip`)}
            @click=${()=>e.onArchivedViewChange(!0)}
          >
            ${z(`sessionsView.archived`)}
          </button>
        </div>
      </div>
      <span class="sessions-toolbar__divider" aria-hidden="true"></span>
      <label class="session-groupby">
        <span class="session-groupby__label">${z(`sessionsView.groupBy`)}</span>
        <select
          class="session-groupby__select"
          @change=${t=>e.onGroupByChange(t.target.value)}
        >
          ${ae.map(t=>s`<option value=${t} ?selected=${e.groupBy===t}>
                ${zt(t)}
              </option>`)}
        </select>
      </label>
      ${e.groupBy===`category`?s`
            <button class="btn btn--sm" @click=${()=>e.onRequestNewCategory()}>
              ${V.plus} ${z(`sessionsView.newGroup`)}
            </button>
          `:d}
    </div>

    ${e.selectedKeys.size>0?s`
          <div class="data-table-bulk-bar">
            <span>${z(`sessionsView.selected`,{count:String(e.selectedKeys.size)})}</span>
            <button class="btn btn--sm" @click=${e.onDeselectAll}>
              ${z(`common.unselect`)}
            </button>
            <button
              class="btn btn--sm danger"
              ?disabled=${e.loading}
              @click=${e.onDeleteSelected}
            >
              ${V.trash} ${z(`sessionsView.deleteSelected`)}
            </button>
          </div>
        `:d}

    <div class="data-table-container">
      <table class="data-table sessions-table">
        <thead>
          <tr>
            <th class="data-table-checkbox-col">
              ${n.length>0?s`<input
                    type="checkbox"
                    .checked=${n.length>0&&n.every(t=>e.selectedKeys.has(t.key))}
                    .indeterminate=${n.some(t=>e.selectedKeys.has(t.key))&&!n.every(t=>e.selectedKeys.has(t.key))}
                    @change=${()=>{n.every(t=>e.selectedKeys.has(t.key))?e.onDeselectPage(n.map(e=>e.key)):e.onSelectPage(n.map(e=>e.key))}}
                    aria-label=${z(`sessionsView.selectAllOnPage`)}
                  />`:d}
            </th>
            ${u(`key`,z(`sessionsView.key`),`data-table-key-col`)}
            ${e.groupBy===`category`?s`<th>${z(`sessionsView.group`)}</th>`:d}
            ${u(`kind`,z(`sessionsView.kind`))}
            <th class="session-status-col">${z(`sessionsView.status`)}</th>
            ${u(`updated`,z(`sessionsView.updated`))}
            ${u(`tokens`,z(`sessionsView.tokens`))}
            <th class="session-actions-col">
              <span class="sessions-sr-only">${z(`sessionsView.actions`)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${e.loading&&!e.result?Et(J(e)):n.length===0?s`
                  <tr>
                    <td colspan=${J(e)} class="data-table-empty-cell">
                      ${a?s`
                            <div class="data-table-empty-state" role="status" aria-live="polite">
                              <div class="data-table-empty-state__message">
                                ${V.search}
                                <span>${z(`sessionsView.noSessionsMatchFilters`)}</span>
                              </div>
                              <button class="btn btn--sm" @click=${e.onClearFilters}>
                                ${z(`sessionsView.showAll`)}
                              </button>
                            </div>
                          `:s`
                            <div class="data-table-empty-state" role="status" aria-live="polite">
                              <div class="data-table-empty-state__message">
                                ${V.messageSquare}
                                <span>${z(`sessionsView.noSessions`)}</span>
                              </div>
                            </div>
                          `}
                    </td>
                  </tr>
                `:r?r.flatMap(t=>{let n=t.rows.flatMap(t=>Jt(t,e));return n.unshift(Ht(t,e)),n}):n.flatMap(t=>Jt(t,e))}
        </tbody>
      </table>
    </div>

    ${o>0&&!i?s`
          <div class="data-table-pagination">
            <div class="data-table-pagination__info">
              ${z(`sessionsView.pagination`,{start:String(l*e.pageSize+1),end:String(Math.min((l+1)*e.pageSize,o)),total:String(o)})}
            </div>
            <div class="data-table-pagination__controls">
              <select
                class="data-table-pagination__size"
                .value=${String(e.pageSize)}
                @change=${t=>e.onPageSizeChange(Number(t.target.value))}
              >
                ${$t.map(e=>s`<option value=${e}>
                      ${z(`sessionsView.rowsPerPage`,{count:String(e)})}
                    </option>`)}
              </select>
              <button ?disabled=${l<=0} @click=${()=>e.onPageChange(l-1)}>
                ${z(`common.previous`)}
              </button>
              <button
                ?disabled=${l>=c-1}
                @click=${()=>e.onPageChange(l+1)}
              >
                ${z(`common.next`)}
              </button>
            </div>
          </div>
        `:d}
  `}function Jt(e,t){let n=e.updatedAt?r(e.updatedAt):z(`common.na`),i=e.latestCompactionCheckpoint,a=e.compactionCheckpointCount??0,o=Math.max(a,+!!i),c=a>0||!!i,l=t.expandedSessionKey===e.key,u=`session-details-${encodeURIComponent(e.key)}`,f=m(e.displayName)??null,p=m(e.label)??``,h=!!(f&&f!==e.key&&f!==p),g=I(e.key),_=g?K(t.agentIdentityById,g.agentId):null,v=m(_?.emoji)??``,y=m(_?.name)??``,b=y&&g?`${v?`${v} `:``}${y} (${g.channel})`:null,x=b??e.key,S=e.kind!==`global`,C=S?`${we(`chat`,t.basePath)}${R(e.key)}`:null,T=`session-kind session-kind--${e.kind}`,E=[`session-data-row`,`session-data-row--expandable`,l?`session-data-row--expanded`:``,t.sessionMenu?.key===e.key?`session-data-row--menu-open`:``].filter(Boolean).join(` `),D=z(l?`sessionsView.hideSessionDetails`:`sessionsView.showSessionDetails`,{count:x}),O=t.groupBy===`category`,k=Vt(t,m(e.category)??null);return[s`<tr
      class=${E}
      tabindex="0"
      aria-expanded=${String(l)}
      aria-controls=${u}
      draggable=${O?`true`:d}
      aria-description=${O?z(`sessionsView.dragSessionHint`):d}
      @dragstart=${O?t=>{t.dataTransfer?.setData(w,e.key),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`)}:d}
      @dragover=${k.dragover}
      @dragleave=${k.dragleave}
      @drop=${k.drop}
      @contextmenu=${n=>{n.preventDefault(),t.onOpenSessionMenu(e,{x:n.clientX,y:n.clientY},null)}}
      @click=${n=>{Wt(n.target)||t.onToggleDetails(e.key)}}
      @keydown=${n=>{Wt(n.target)||(n.key===`Enter`||n.key===` `)&&(n.preventDefault(),t.onToggleDetails(e.key))}}
    >
      <td class="data-table-checkbox-col">
        <input
          type="checkbox"
          .checked=${t.selectedKeys.has(e.key)}
          @change=${()=>t.onToggleSelect(e.key)}
          aria-label=${z(`sessionsView.selectSession`)}
        />
      </td>
      <td class="data-table-key-col">
        <openclaw-tooltip .content=${x}>
          <div class=${b?`session-key-cell`:`mono session-key-cell`}>
            ${bt(e)}
            <div class="session-key-cell__text">
              <span class="session-key-cell__primary">
                ${e.unread===!0?s`<span
                      class="session-unread-dot"
                      role="img"
                      aria-label=${z(`sessionsView.unread`)}
                    ></span>`:d}
                ${S?s`<a
                      href=${C}
                      class="session-link"
                      @click=${n=>{n.defaultPrevented||n.button!==0||n.metaKey||n.ctrlKey||n.shiftKey||n.altKey||t.onNavigateToChat&&(n.preventDefault(),t.onNavigateToChat(e.key))}}
                      >${b??e.key}</a
                    >`:s`<span>${b??e.key}</span>`}
                ${p?s`<span class="session-label-chip" title=${p}
                      >${p}</span
                    >`:d}
              </span>
              ${h?s`<span class="muted session-key-display-name">${f}</span>`:d}
            </div>
          </div>
        </openclaw-tooltip>
      </td>
      ${O?Ut(e,t):d}
      <td>
        <span class=${T}>${e.kind}</span>
      </td>
      <td class="session-status-col">
        <div class="session-status-stack">
          ${yt(e)} ${Lt(e.goal)}
        </div>
      </td>
      <td>${n}</td>
      <td class="session-token-cell">${St(e)}</td>
      <td class="session-actions-cell">
        <div class="session-actions">
          <button
            class="session-details-toggle"
            type="button"
            aria-expanded=${String(l)}
            aria-controls=${u}
            aria-label=${D}
            @click=${n=>{n.stopPropagation(),t.onToggleDetails(e.key)}}
          >
            ${o>0?s`<span class="settings-count session-compaction-count"
                  >${o}</span
                >`:d}
            ${V.chevronDown}
          </button>
          <button
            class="icon-btn"
            type="button"
            title=${z(`chat.sidebar.openSessionMenu`)}
            aria-label=${z(`chat.sidebar.openSessionMenu`)}
            aria-haspopup="menu"
            aria-expanded=${String(t.sessionMenu?.key===e.key)}
            @click=${n=>{n.stopPropagation();let r=n.currentTarget,i=r.getBoundingClientRect();t.onOpenSessionMenu(e,{x:i.right,y:i.bottom+4},r)}}
          >
            ${V.moreHorizontal}
          </button>
        </div>
      </td>
    </tr>`,...l?[Yt({row:e,props:t,detailsId:u,friendlyKeyLabel:b,keyCellTitle:x,displayName:f,showDisplayName:h,kindClass:T,updated:n,visibleCheckpointCount:o,hasCheckpoints:c})]:[]]}function Yt(e){let{row:t,props:n,detailsId:i,friendlyKeyLabel:a,displayName:o,showDisplayName:c,kindClass:l,updated:u,visibleCheckpointCount:f,hasCheckpoints:p}=e,h=t.thinkingLevel??``,g=h?U(h):``,_=q(pt(t,n.result?.defaults),g),v=t.fastMode===`auto`?`auto`:t.fastMode===!0?`on`:t.fastMode===!1?`off`:``,y=q(gt(),v),b=t.verboseLevel??``,x=q(ht(),b),S=t.reasoningLevel??``,C=mt(Qt,S),w=n.checkpointItemsByKey[t.key]??[],T=n.checkpointErrorByKey[t.key],E=Pt(f),D=Rt({row:t,updated:u,checkpointCount:f});return s`<tr id=${i} class="session-details-row">
    <td colspan=${J(n)}>
      <div class="session-details-panel">
        <div class="session-details-panel__hero">
          <div>
            <div class="session-details-panel__eyebrow">${z(`sessionsView.sessionDetails`)}</div>
            <div class="session-details-panel__title">${a??t.key}</div>
            ${c?s`<div class="muted session-details-panel__subtitle">${o}</div>`:d}
          </div>
          <div class="session-details-panel__badges">
            ${yt(t)} ${Lt(t.goal)}
            <span class=${l}>${t.kind}</span>
          </div>
        </div>

        <div class="session-details-section">
          <div class="session-details-panel__eyebrow">${z(`sessionsView.overrides`)}</div>
          <div class="session-overrides-grid">
            <label class="session-override-field">
              <span class="session-override-field__label">${z(`sessionsView.label`)}</span>
              <input
                class="settings-input"
                .value=${t.label??``}
                ?disabled=${n.loading}
                placeholder=${z(`sessionsView.optionalPlaceholder`)}
                @change=${e=>{let r=m(e.target.value)??null;n.onPatch(t.key,{label:r})}}
              />
            </label>
            ${X({label:z(`sessionsView.thinking`),disabled:n.loading,options:_,current:g,onChange:e=>n.onPatch(t.key,{thinkingLevel:Dt(e)})})}
            ${X({label:z(`sessionsView.fast`),disabled:n.loading,options:y,current:v,onChange:e=>n.onPatch(t.key,{fastMode:e===``?null:e===`auto`?`auto`:e===`on`})})}
            ${X({label:z(`sessionsView.verbose`),disabled:n.loading,options:x,current:b,onChange:e=>n.onPatch(t.key,{verboseLevel:e||null})})}
            ${X({label:z(`sessionsView.reasoning`),disabled:n.loading,options:C.map(e=>({value:e,label:e||z(`sessionsView.inherit`)})),current:S,onChange:e=>n.onPatch(t.key,{reasoningLevel:e||null})})}
          </div>
        </div>

        <div class="session-details-grid">
          ${D.map(e=>s`
              <div class="session-detail-stat">
                <div class="session-detail-stat__label">${e.label}</div>
                <openclaw-tooltip .content=${e.value}>
                  <div class="session-detail-stat__value">${e.value}</div>
                </openclaw-tooltip>
              </div>
            `)}
        </div>

        <div class="session-details-section">
          <div class="session-details-section__header">
            <div>
              <div class="session-details-panel__eyebrow">
                ${z(`sessionsView.compactionHistory`)}
              </div>
              <div class="session-details-section__title">${E}</div>
            </div>
          </div>
          ${n.checkpointLoadingKey===t.key?s`<div class="muted session-details-empty">
                ${z(`sessionsView.loadingCheckpoints`)}
              </div>`:T?s`<div class="callout danger">${T}</div>`:!p||w.length===0?s`<div class="muted session-details-empty">
                    ${z(`sessionsView.noCheckpoints`)}
                  </div>`:s`
                    <div class="session-checkpoint-list">
                      ${w.map(e=>s`
                          <div class="session-checkpoint-card">
                            <div class="session-checkpoint-card__header">
                              <strong>
                                ${Nt(e.reason)} ·
                                ${r(e.createdAt)}
                              </strong>
                              <span class="muted session-checkpoint-card__delta">
                                ${Ft(e)}
                              </span>
                            </div>
                            ${e.summary?s`<div class="session-checkpoint-card__summary">
                                  ${e.summary}
                                </div>`:s`<div class="muted">${z(`sessionsView.noSummary`)}</div>`}
                            <div class="session-checkpoint-card__actions">
                              <button
                                class="btn btn--sm"
                                ?disabled=${n.checkpointBusyKey===e.checkpointId}
                                @click=${()=>n.onBranchFromCheckpoint(t.key,e.checkpointId)}
                              >
                                ${z(`sessionsView.branchFromCheckpoint`)}
                              </button>
                              <button
                                class="btn btn--sm"
                                ?disabled=${n.checkpointBusyKey===e.checkpointId}
                                @click=${()=>n.onRestoreCheckpoint(t.key,e.checkpointId)}
                              >
                                ${z(`sessionsView.restoreCheckpoint`)}
                              </button>
                            </div>
                          </div>
                        `)}
                    </div>
                  `}
        </div>
      </div>
    </td>
  </tr>`}var Z,Xt,Zt,Qt,$t,en,tn,nn,rn,an,Q,on=e((()=>{l(),ft(),Se(),Ie(),Be(),Me(),B(),ge(),We(),C(),Ue(),Xe(),Ge(),b(),D(),me(),y(),S(),dt(),Z=[`off`,`minimal`,`low`,`medium`,`high`],Xt=[``,`off`,`on`,`full`],Zt=[``,`auto`,`on`,`off`],Qt=[``,`off`,`on`,`stream`],$t=[10,25,50,100],en={live:`ok`,idle:`muted`,done:`ok`,failed:`danger`,muted:`muted`},tn={cron:V.clock,direct:V.messageSquare,group:V.users,global:V.globe,unknown:V.circle},nn=65,rn=85,an=4,Q=`__new-group__`})),$;e((()=>{a(),l(),f(),ke(),De(),Te(),$e(),Fe(),Ae(),Pe(),tt(),Re(),B(),O(),v(),ve(),ie(),y(),E(),S(),pe(),_e(),oe(),re(),at(),ct(),dt(),on(),i(),$=class extends ee{constructor(...e){super(...e),this.result=null,this.loading=!1,this.error=null,this.activeMinutes=``,this.limit=String(N.limit),this.includeGlobal=!0,this.includeUnknown=!1,this.showArchived=!1,this.searchQuery=``,this.transcriptSearchQuery=``,this.transcriptSearch={status:`idle`},this.sortColumn=`updated`,this.sortDir=`desc`,this.groupBy=lt(),this.page=0,this.pageSize=25,this.selectedKeys=new Set,this.sessionMenu=null,this.sessionMenuWork=null,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.checkpointItemsByKey={},this.checkpointLoadingKey=null,this.checkpointBusyKey=null,this.checkpointErrorByKey={},this.sessionRequestId=0,this.transcriptSearchRequestId=0,this.checkpointRequestId=0,this.pageEpoch=0,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.ignorePendingSharedRefresh=!1,this.sessionMutationPending=!1,this.sessionReloadQueued=!1,this.sharedSessionsResult=null,this.sharedSessionsLoading=!1,this.gatewayClient=null,this.gatewayConnected=!1,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion=0,this.hasBoundGatewaySource=!1,this.hasBoundSessionsSource=!1,this.subscriptions=new ne(this).effect(()=>this.context?.sessions,e=>{let t=this.hasBoundSessionsSource&&!Object.is(this.sessionsSource,e);this.hasBoundSessionsSource=!0,this.sessionsSource=e,t&&(this.invalidatePageWork(),this.resetProviderState()),this.sharedSessionsResult=e.state.result,this.sharedSessionsLoading=e.state.loading;let n=e.subscribe(t=>{if(!Object.is(this.context?.sessions,e))return;let n=t.result!==this.sharedSessionsResult,r=this.sharedSessionsLoading&&!t.loading;if(this.sharedSessionsResult=t.result,this.sharedSessionsLoading=t.loading,!(t.loading||!this.routeDataInitialized||this.sessionMutationPending)){if(this.ignorePendingSharedRefresh&&r){this.ignorePendingSharedRefresh=!1;return}n&&this.scheduleSessionReload()}});return t&&this.routeDataInitialized&&this.scheduleSessionReload(),n}).watch(()=>this.context?.agentIdentity,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>{let t=()=>{let t=e.state.scopeId;this.observedAgentScopeId!==t&&(this.observedAgentScopeId=t,this.resetTranscriptSearchState(this.transcriptSearchQuery),this.routeDataInitialized&&!this.deepLinkSessionKey&&(this.page=0,this.selectedKeys=new Set,this.loadSessions()),this.requestUpdate())};return t(),e.subscribe(t)}).effect(()=>this.context?.gateway,e=>{let t=this.hasBoundGatewaySource;this.hasBoundGatewaySource=!0;let n=e.subscribe(t=>{Object.is(this.context?.gateway,e)&&this.applyGatewaySnapshot(t)});return this.applyGatewaySnapshot(e.snapshot,t),n}).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).watch(()=>this.context?.workboard,(e,t)=>e.subscribe(t))}willUpdate(e){(e.has(`routeData`)||e.has(`context`))&&this.applyRouteData()}disconnectedCallback(){this.subscriptions.clear(),this.invalidatePageWork(),this.gatewayClient=null,this.gatewayConnected=!1,super.disconnectedCallback()}applyGatewaySnapshot(e,t=!1){let n=t||e.client!==this.gatewayClient,r=e.connected!==this.gatewayConnected,i=e.connected&&!this.gatewayConnected;if(this.gatewayClient=e.client,this.gatewayConnected=e.connected,(n||r)&&(this.invalidatePageWork(),this.ignorePendingSharedRefresh=!1),n&&this.resetProviderState(),!e.connected||!e.client){this.requestUpdate();return}this.routeDataInitialized&&(n||i)&&(this.ignorePendingSharedRefresh=!0,this.loadSessions()),this.requestUpdate()}invalidatePageWork(){this.pageEpoch+=1,this.sessionRequestId+=1,this.transcriptSearchRequestId+=1,this.checkpointRequestId+=1,this.sessionReloadQueued=!1,this.loading=!1,this.transcriptSearch.status===`loading`&&(this.transcriptSearch={status:`idle`}),this.checkpointLoadingKey=null,this.checkpointBusyKey=null,this.sessionMutationPending=!1,this.closeSessionMenu()}resetProviderState(){this.result=null,this.error=null,this.loading=!1,this.resetTranscriptSearchState(``),this.selectedKeys=new Set,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.checkpointItemsByKey={},this.checkpointLoadingKey=null,this.checkpointBusyKey=null,this.checkpointErrorByKey={}}captureRequestScope(){let e=this.context;if(!this.isConnected||!e)return null;let t=e.gateway,n=t.snapshot.client;return!t.snapshot.connected||!n?null:{epoch:this.pageEpoch,context:e,gateway:t,sessions:e.sessions,workboard:e.workboard,client:n}}isRequestScopeCurrent(e){let t=this.context,n=t?.gateway;return this.isConnected&&this.pageEpoch===e.epoch&&t===e.context&&n===e.gateway&&t.sessions===e.sessions&&t.workboard===e.workboard&&n.snapshot.connected&&n.snapshot.client===e.client}applyRouteData(){let e=this.routeData,t=this.context;if(!e||!t||(e!==this.appliedRouteData&&(this.appliedRouteData=e,this.routeDataEnabled=!0),this.routeDataInitialized=!0,!this.routeDataEnabled))return;this.showArchived=e.showArchived,e.expandedSessionKey?(this.activeMinutes=``,this.limit=String(N.limit),this.includeGlobal=!0,this.includeUnknown=!0,this.searchQuery=``,this.page=0,this.selectedKeys=new Set):(this.activeMinutes=``,this.limit=String(N.limit),this.includeGlobal=!0,this.includeUnknown=!1),this.expandedSessionKey=e.expandedSessionKey,this.deepLinkSessionKey=e.expandedSessionKey;let n=t.gateway,r=n.snapshot;if(this.gatewayClient=r.client,this.gatewayConnected=r.connected,e.gateway!==n||e.gatewaySnapshot!==r){this.routeDataEnabled=!1,this.loadSessions(),e.expandedSessionKey&&this.loadCheckpoint(e.expandedSessionKey);return}this.result=e.result?fe(e.result,{showArchived:e.showArchived}):null,this.error=e.error,this.loading=!1;let i=t.sessions.state;this.ignorePendingSharedRefresh=i.loading,this.ensureAgentIdentities(this.result),e.expandedSessionKey&&this.loadCheckpoint(e.expandedSessionKey)}scheduleSessionReload(){if(this.sessionReloadQueued)return;this.sessionReloadQueued=!0;let e=this.pageEpoch;queueMicrotask(()=>{if(e!==this.pageEpoch)return;this.sessionReloadQueued=!1;let t=this.context,n=t?.gateway.snapshot;this.isConnected&&t&&n?.connected&&n.client&&!t.sessions.state.loading&&this.loadSessions()})}sessionAgentId(e,t=this.context){if(!t)return;let{agentId:n}=de({assistantAgentId:t.agentSelection.state.selectedId,hello:t.gateway.snapshot.hello},e);return n}sessionListOptions(){let e=this.deepLinkSessionKey,t=this.context?.agentSelection.state.scopeId??void 0;return{activeMinutes:e||this.showArchived?void 0:W(this.activeMinutes),limit:e?N.limit:W(this.limit),search:e??void 0,includeGlobal:e?!0:this.includeGlobal,includeUnknown:e?!0:this.includeUnknown,showArchived:this.showArchived,...e?{agentId:this.sessionAgentId(e)}:t?{agentId:t}:{}}}async loadSessions(){let e=this.captureRequestScope();if(!e)return;let t=++this.sessionRequestId,n=this.result;this.routeDataEnabled=!1,this.loading=!0,this.error=null;try{let r=await e.sessions.list(this.sessionListOptions());if(t!==this.sessionRequestId||!this.isRequestScopeCurrent(e))return;this.result=r?fe(r,{showArchived:this.showArchived}):null,this.ensureAgentIdentities(this.result);let i=this.reconcileCheckpointCache(n,this.result);i&&this.loadCheckpoint(i)}catch(n){t===this.sessionRequestId&&this.isRequestScopeCurrent(e)&&(this.error=String(n))}finally{t===this.sessionRequestId&&this.isRequestScopeCurrent(e)&&(this.loading=!1)}}resetTranscriptSearchState(e){this.transcriptSearchRequestId+=1,this.transcriptSearchQuery=e,this.transcriptSearch={status:`idle`}}updateTranscriptSearchQuery(e){e!==this.transcriptSearchQuery&&this.resetTranscriptSearchState(e)}clearTranscriptSearch(){this.resetTranscriptSearchState(``)}async runTranscriptSearch(){let e=this.transcriptSearchQuery.trim();if(!e){this.clearTranscriptSearch();return}let t=this.captureRequestScope();if(!t||_(t.gateway.snapshot,`sessions.search`)!==!0)return;this.resetTranscriptSearchState(e);let n=this.transcriptSearchRequestId;this.transcriptSearch={status:`loading`};try{let r=await it({client:t.client,query:e,result:this.result,listSessions:t.sessions.list,listOptions:this.sessionListOptions(),resolveAgentId:e=>M(e)?.agentId??this.sessionAgentId(e,t.context)});if(n!==this.transcriptSearchRequestId||!this.isRequestScopeCurrent(t))return;this.transcriptSearch={status:`results`,results:r.results,indexing:r.indexing===!0,truncated:r.truncated===!0}}catch(e){n===this.transcriptSearchRequestId&&this.isRequestScopeCurrent(t)&&(this.transcriptSearch={status:`error`,message:String(e)})}}ensureAgentIdentities(e){let t=this.context;if(!t||!e)return;let n=nt(e).filter(e=>!t.agentIdentity.get(e));n.length!==0&&t.agentIdentity.ensure(n)}reconcileCheckpointCache(e,t){let n=new Map((t?.sessions??[]).map(e=>[e.key,e])),r=new Map((e?.sessions??[]).map(e=>[e.key,e])),i={...this.checkpointItemsByKey},a={...this.checkpointErrorByKey},o=null;for(let e of Object.keys(i)){let t=n.get(e),s=r.get(e);(!t||!s||s.compactionCheckpointCount!==t.compactionCheckpointCount||s.latestCompactionCheckpoint?.checkpointId!==t.latestCompactionCheckpoint?.checkpointId)&&(delete i[e],delete a[e],this.expandedSessionKey===e&&(o=e))}return this.checkpointItemsByKey=i,this.checkpointErrorByKey=a,o}updateFilters(e){this.activeMinutes=e.activeMinutes,this.limit=e.limit,this.includeGlobal=e.includeGlobal,this.includeUnknown=e.includeUnknown,this.showArchived=e.showArchived,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.loadSessions()}updateArchivedView(e){let t=this.context;e===this.showArchived||!t||(this.showArchived=e,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.loading=!0,this.error=null,t.navigate(`sessions`,e?{search:`?showArchived=1`}:void 0))}async deleteSelected(){let e=[...this.selectedKeys];e.length===0||this.loading||this.sessionMutationPending||window.confirm(`Delete ${e.length} ${e.length===1?`thread`:`threads`}?\n\nThis will delete the thread entries and archive their transcripts.`)&&await this.deleteSessions(e)}async deleteSessions(e,t={}){if(e.length===0||this.loading||this.sessionMutationPending)return;let n=this.captureRequestScope();if(n){this.sessionMutationPending=!0;try{let r=await n.sessions.deleteMany(e.map(e=>({key:e,agentId:this.sessionAgentId(e,n.context),...t})));if(!this.isRequestScopeCurrent(n))return;if(r.preservedWorktrees.length>0&&window.alert(z(`sessionsView.deletePreservedWorktrees`,{count:String(r.preservedWorktrees.length),branches:r.preservedWorktrees.map(e=>e.branch).join(`, `)})),r.deleted.length>0){let e=new Set(r.deleted),t=new Set(this.selectedKeys);for(let e of r.deleted)t.delete(e);if(this.selectedKeys=t,this.result){let t=this.result.sessions.filter(t=>!e.has(t.key));this.result={...this.result,count:Math.max(0,this.result.count-(this.result.sessions.length-t.length)),sessions:t}}this.expandedSessionKey&&e.has(this.expandedSessionKey)&&(this.expandedSessionKey=null),this.deepLinkSessionKey&&e.has(this.deepLinkSessionKey)&&(this.deepLinkSessionKey=null);let i=r.deleted.find(e=>j(e,n.gateway.snapshot.sessionKey));i&&n.gateway.setSessionKey(x({agentId:M(i)?.agentId??n.context.agentSelection.state.selectedId??`main`,mainKey:A({agentsList:n.context.agents.state.agentsList,hello:n.gateway.snapshot.hello})}))}r.errors.length>0&&(this.error=r.errors.join(`; `))}catch(e){this.isRequestScopeCurrent(n)&&(this.error=String(e))}finally{this.isRequestScopeCurrent(n)&&(this.sessionMutationPending=!1)}}}async deleteAllArchived(){let e=this.captureRequestScope();if(!e||this.loading||this.sessionMutationPending)return;let t=[];try{let n=this.sessionListOptions(),r=0;for(;;){let i=await e.sessions.list({...n,limit:1e3,offset:r});if(!this.isRequestScopeCurrent(e))return;if(!i){this.error=e.sessions.state.error;return}for(let e of i.sessions)e.archived===!0&&t.push(e.key);if(i.hasMore!==!0)break;if(typeof i.nextOffset!=`number`||i.nextOffset<=r)throw Error(`archived session enumeration did not advance`);r=i.nextOffset}}catch(t){this.isRequestScopeCurrent(e)&&(this.error=String(t));return}t.length===0||!window.confirm(z(`sessionsView.deleteAllArchivedConfirm`,{count:String(t.length)}))||await this.deleteSessions(t,{deleteTranscript:!0,archivedOnly:!0})}async deleteSessionFromMenu(e){let t=m(e.label)??e.key;window.confirm(z(`sessionsView.deleteSessionConfirm`,{session:t}))&&await this.deleteSessions([e.key])}async stopCloudWorker(e){let t=m(e.label)??e.key;if(!je(e.placement)||e.hasActiveRun===!0||!window.confirm(z(`sessionsView.stopCloudWorkerConfirm`,{session:t})))return;let n=this.captureRequestScope();if(!n)return;let r=M(e.key)?.agentId;this.sessionMutationPending=!0;try{await n.client.request(`sessions.reclaim`,{key:e.key,...r?{agentId:r}:{}},{timeoutMs:10*6e4}),this.isRequestScopeCurrent(n)&&await this.loadSessions()}catch(e){this.isRequestScopeCurrent(n)&&(this.error=String(e))}finally{this.isRequestScopeCurrent(n)&&(this.sessionMutationPending=!1)}}knownCategories(){return ot(this.result,this.context?.sessions.state.groups??[])}setGroupBy(e){this.groupBy=e,ut(e)}async rememberCustomGroup(e){let t=this.captureRequestScope();await st({name:e,knownCategories:this.knownCategories(),sessions:t?.sessions,isCurrent:()=>!!(t&&this.isRequestScopeCurrent(t)),onError:e=>{this.error=e}})}assignCategory(e,t){let n=this.result?.sessions.find(t=>t.key===e);n&&(n.category?.trim()||null)!==t&&(t&&this.rememberCustomGroup(t),this.patchSession(e,{category:t}))}requestNewCategory(e){let t=window.prompt(z(`sessionsView.newGroupPrompt`))?.trim();t&&(this.rememberCustomGroup(t),e&&this.patchSession(e,{category:t}))}renameSession(e){let t=window.prompt(z(`sessionsView.renameSessionPrompt`),m(e.label)??``);t!==null&&this.patchSession(e.key,{label:m(t)??null})}async patchSession(e,t,n=this.captureRequestScope()){if(!n)return`stale`;try{let r=await n.sessions.patch(e,t,{agentId:this.sessionAgentId(e,n.context)});if(!this.isRequestScopeCurrent(n))return`stale`;if(!r)return this.error=n.sessions.state.error,`failed`;let i=new Set(this.selectedKeys);return i.delete(e),this.selectedKeys=i,t.archived===!0&&j(e,n.gateway.snapshot.sessionKey)&&n.gateway.setSessionKey(x({agentId:M(e)?.agentId??n.context.agentSelection.state.selectedId??`main`,mainKey:A({agentsList:n.context.agents.state.agentsList,hello:n.gateway.snapshot.hello})})),`completed`}catch(e){return this.isRequestScopeCurrent(n)?(this.error=String(e),`failed`):`stale`}}async archiveSessionWithUndo(e){let t=this.captureRequestScope();if(!t)return;let n=j(e.key,t.gateway.snapshot.sessionKey);await this.patchSession(e.key,{archived:!0},t)!==`completed`||!this.isRequestScopeCurrent(t)||ue({message:z(`sessionsView.sessionArchived`),actionLabel:z(`common.undo`),onAction:()=>{(async()=>{this.isRequestScopeCurrent(t)&&await this.patchSession(e.key,{archived:!1,...e.pinned===!0?{pinned:!0}:{}},t)===`completed`&&n&&this.isRequestScopeCurrent(t)&&t.gateway.setSessionKey(e.key)})()}})}async forkSession(e){let t=this.captureRequestScope();if(!t)return;let n=this.sessionAgentId(e,t.context);try{let r=await t.sessions.create({parentSessionKey:e,fork:!0,...n?{agentId:n}:{}});if(!this.isRequestScopeCurrent(t))return;r?t.context.navigate(`chat`,{search:R(r),hash:``}):t.sessions.state.error&&(this.error=t.sessions.state.error)}catch(e){this.isRequestScopeCurrent(t)&&(this.error=String(e))}}async toggleSessionDetails(e){if(!this.context)return;if(this.deepLinkSessionKey=null,this.expandedSessionKey===e){this.checkpointRequestId+=1,this.expandedSessionKey=null;return}this.expandedSessionKey=e;let t=this.result?.sessions.find(t=>t.key===e);if(!((t?.compactionCheckpointCount??0)>0||t?.latestCompactionCheckpoint)){this.checkpointItemsByKey[e]||(this.checkpointItemsByKey={...this.checkpointItemsByKey,[e]:[]});return}this.checkpointItemsByKey[e]||await this.loadCheckpoint(e)}async loadCheckpoint(e){let t=this.captureRequestScope();if(!t)return;let n=++this.checkpointRequestId;this.checkpointLoadingKey=e,this.checkpointErrorByKey={...this.checkpointErrorByKey,[e]:``};try{let r=await t.sessions.listCheckpoints(e,{agentId:this.sessionAgentId(e,t.context)});if(n!==this.checkpointRequestId||!this.isRequestScopeCurrent(t))return;this.checkpointItemsByKey={...this.checkpointItemsByKey,[e]:r}}catch(r){if(n!==this.checkpointRequestId||!this.isRequestScopeCurrent(t))return;this.checkpointErrorByKey={...this.checkpointErrorByKey,[e]:String(r)}}finally{n===this.checkpointRequestId&&this.isRequestScopeCurrent(t)&&this.checkpointLoadingKey===e&&(this.checkpointLoadingKey=null)}}async branchCheckpoint(e,t){if(!window.confirm(`Create a new child thread from this compacted checkpoint?`))return;let n=this.captureRequestScope();if(n){this.checkpointBusyKey=t;try{let r=await n.sessions.branchCheckpoint(e,t,{agentId:this.sessionAgentId(e,n.context)});this.isRequestScopeCurrent(n)&&n.context.navigate(`chat`,{search:R(r.key),hash:``})}catch(e){this.isRequestScopeCurrent(n)&&(this.error=String(e))}finally{this.isRequestScopeCurrent(n)&&this.checkpointBusyKey===t&&(this.checkpointBusyKey=null)}}}async restoreCheckpoint(e,t){if(!window.confirm(`Restore this thread to the selected compacted checkpoint?

This replaces the current active transcript for the session key.`))return;let n=this.captureRequestScope();if(n){this.checkpointBusyKey=t;try{await n.sessions.restoreCheckpoint(e,t,{agentId:this.sessionAgentId(e,n.context)})}catch(e){this.isRequestScopeCurrent(n)&&(this.error=String(e))}finally{this.isRequestScopeCurrent(n)&&this.checkpointBusyKey===t&&(this.checkpointBusyKey=null)}}}openSessionMenu(e,t,n){if(this.sessionMenu?.key===e.key&&n){this.closeSessionMenu();return}this.sessionMenu={key:e.key,...t},this.sessionMenuTrigger=n,this.loadSessionMenuWork(e)}closeSessionMenu(){this.sessionMenu=null,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion+=1,this.sessionMenuWork=null}loadSessionMenuWork(e){let t=++this.sessionMenuWorkVersion;if(!e.worktree){this.sessionMenuWork=null;return}this.sessionMenuWork={loading:!0,pullRequestUrl:null,worktreePath:null};let n=this.captureRequestScope();if(!n){this.sessionMenuWork={loading:!1,pullRequestUrl:null,worktreePath:null};return}Ne({client:n.client,pullRequestsAvailable:_(n.context.gateway.snapshot,`controlUi.sessionPullRequests`)===!0,sessionKey:e.key,agentId:this.sessionAgentId(e.key,n.context),worktreeId:e.worktree.id}).then(e=>{t===this.sessionMenuWorkVersion&&(this.sessionMenuWork={loading:!1,...e})})}renderSessionMenu(){let e=this.sessionMenu,t=this.context,n=e?this.result?.sessions.find(t=>t.key===e.key):null;if(!e||!t||!n)return d;let r=t.gateway.snapshot,i=T(t.runtimeConfig.state.configSnapshot)&&Ce(r.hello?.auth??null),a=t.workboard.state,o=new Set(a.cards.flatMap(e=>[e.sessionKey,e.execution?.sessionKey]).filter(e=>typeof e==`string`&&e.length>0)),c=le(n,A({agentsList:t.agents.state.agentsList,hello:r.hello}));return s`
      <openclaw-session-menu
        .session=${{label:m(n.label)??n.key,icon:n.icon,pinned:n.pinned===!0,unread:n.unread===!0,archived:n.archived===!0,category:m(n.category)??null}}
        .anchor=${e}
        .trigger=${this.sessionMenuTrigger}
        .disabled=${this.loading}
        .forkDisabled=${n.modelSelectionLocked===!0}
        .archiveAllowed=${c}
        .cloudWorkerStopAllowed=${je(n.placement)&&n.hasActiveRun!==!0&&_(r,`sessions.reclaim`)===!0}
        .groups=${this.knownCategories()}
        .canOpenChat=${n.kind!==`global`}
        .work=${this.sessionMenuWork}
        .workboard=${i&&n.kind!==`global`?{captured:o.has(n.key),busy:[...a.capturingSessionKeys][0]===n.key}:null}
        .onClose=${()=>this.closeSessionMenu()}
        .onAction=${e=>{switch(e.kind){case`open-chat`:t.navigate(`chat`,{search:R(n.key),hash:``});break;case`open-pr`:ce(e.url);break;case`open-in`:se(e.editor,e.path);break;case`toggle-pin`:this.patchSession(n.key,{pinned:n.pinned!==!0});break;case`set-icon`:this.patchSession(n.key,{icon:e.icon});break;case`toggle-unread`:this.patchSession(n.key,{unread:n.unread!==!0});break;case`rename`:this.renameSession(n);break;case`fork`:this.forkSession(n.key);break;case`workboard`:this.addToWorkboard(n);break;case`move-to-group`:this.assignCategory(n.key,e.category);break;case`new-group`:this.requestNewCategory(n.key);break;case`toggle-archived`:n.archived===!0?this.patchSession(n.key,{archived:!1}):this.archiveSessionWithUndo(n);break;case`stop-cloud-worker`:this.stopCloudWorker(n);break;case`delete`:this.deleteSessionFromMenu(n);break}}}
      ></openclaw-session-menu>
    `}render(){let e=this.context;return e?s`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${Ee(`sessions`)}</div>
        </div>
        ${et({active:`sessions`,onSelect:t=>{t!==`sessions`&&e.navigate(t)}})}
        ${Qe({agents:e.agents.state.agentsList?.agents??[],selection:e.agentSelection})}
      </section>
      ${Le(Kt({loading:this.loading,result:this.result,error:this.error,activeMinutes:this.activeMinutes,limit:this.limit,includeGlobal:this.includeGlobal,includeUnknown:this.includeUnknown,showArchived:this.showArchived,basePath:e.basePath,searchQuery:this.searchQuery,transcriptSearchAvailable:_(e.gateway.snapshot,`sessions.search`)===!0,transcriptSearchQuery:this.transcriptSearchQuery,transcriptSearch:this.transcriptSearch,agentIdentityById:rt(this.result,t=>e.agentIdentity.get(t)??void 0),sortColumn:this.sortColumn,sortDir:this.sortDir,groupBy:this.groupBy,knownCategories:this.knownCategories(),page:this.page,pageSize:this.pageSize,selectedKeys:this.selectedKeys,sessionMenu:this.sessionMenu,expandedSessionKey:this.expandedSessionKey,checkpointItemsByKey:this.checkpointItemsByKey,checkpointLoadingKey:this.checkpointLoadingKey,checkpointBusyKey:this.checkpointBusyKey,checkpointErrorByKey:this.checkpointErrorByKey,onFiltersChange:e=>this.updateFilters(e),onClearFilters:()=>{this.activeMinutes=``,this.limit=String(N.limit),this.includeGlobal=!0,this.includeUnknown=!1,this.showArchived=!1,this.searchQuery=``,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.loadSessions()},onSearchChange:e=>{this.searchQuery=e,this.page=0},onTranscriptSearchChange:e=>this.updateTranscriptSearchQuery(e),onTranscriptSearch:()=>void this.runTranscriptSearch(),onClearTranscriptSearch:()=>this.clearTranscriptSearch(),onSortChange:(e,t)=>{this.sortColumn=e,this.sortDir=t,this.page=0},onGroupByChange:e=>this.setGroupBy(e),onAssignCategory:(e,t)=>this.assignCategory(e,t),onRequestNewCategory:e=>this.requestNewCategory(e),onPageChange:e=>{this.page=e},onPageSizeChange:e=>{this.pageSize=e,this.page=0},onRefresh:()=>void this.loadSessions(),onArchivedViewChange:e=>this.updateArchivedView(e),onDeleteAllArchived:()=>void this.deleteAllArchived(),onPatch:(e,t)=>void this.patchSession(e,t),onToggleSelect:e=>{let t=new Set(this.selectedKeys);t.has(e)?t.delete(e):t.add(e),this.selectedKeys=t},onSelectPage:e=>{this.selectedKeys=new Set([...this.selectedKeys,...e])},onDeselectPage:e=>{let t=new Set(this.selectedKeys);for(let n of e)t.delete(n);this.selectedKeys=t},onDeselectAll:()=>{this.selectedKeys=new Set},onDeleteSelected:()=>void this.deleteSelected(),onNavigateToChat:t=>e.navigate(`chat`,{search:R(t),hash:``}),onOpenSessionMenu:(e,t,n)=>this.openSessionMenu(e,t,n),onToggleDetails:e=>void this.toggleSessionDetails(e),onBranchFromCheckpoint:(e,t)=>void this.branchCheckpoint(e,t),onRestoreCheckpoint:(e,t)=>void this.restoreCheckpoint(e,t)}),{id:`sessions-hub-panel`})}
      ${this.renderSessionMenu()}
    `:s``}async addToWorkboard(e){let t=this.captureRequestScope();if(t)try{await be({host:t.workboard,client:t.client,session:e,requestUpdate:()=>{this.isRequestScopeCurrent(t)&&t.workboard.notify()}}),this.isRequestScopeCurrent(t)&&t.context.navigate(`workboard`)}catch(e){this.isRequestScopeCurrent(t)&&(this.error=String(e))}}},t([o({context:Oe,subscribe:!0})],$.prototype,`context`,void 0),t([c({attribute:!1})],$.prototype,`routeData`,void 0),t([u()],$.prototype,`result`,void 0),t([u()],$.prototype,`loading`,void 0),t([u()],$.prototype,`error`,void 0),t([u()],$.prototype,`activeMinutes`,void 0),t([u()],$.prototype,`limit`,void 0),t([u()],$.prototype,`includeGlobal`,void 0),t([u()],$.prototype,`includeUnknown`,void 0),t([u()],$.prototype,`showArchived`,void 0),t([u()],$.prototype,`searchQuery`,void 0),t([u()],$.prototype,`transcriptSearchQuery`,void 0),t([u()],$.prototype,`transcriptSearch`,void 0),t([u()],$.prototype,`sortColumn`,void 0),t([u()],$.prototype,`sortDir`,void 0),t([u()],$.prototype,`groupBy`,void 0),t([u()],$.prototype,`page`,void 0),t([u()],$.prototype,`pageSize`,void 0),t([u()],$.prototype,`selectedKeys`,void 0),t([u()],$.prototype,`sessionMenu`,void 0),t([u()],$.prototype,`sessionMenuWork`,void 0),t([u()],$.prototype,`expandedSessionKey`,void 0),t([u()],$.prototype,`checkpointItemsByKey`,void 0),t([u()],$.prototype,`checkpointLoadingKey`,void 0),t([u()],$.prototype,`checkpointBusyKey`,void 0),t([u()],$.prototype,`checkpointErrorByKey`,void 0),customElements.get(`openclaw-sessions-page`)||customElements.define(`openclaw-sessions-page`,$)}))();
//# sourceMappingURL=sessions-page-CNrVadNw.js.map