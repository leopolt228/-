import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,r as n,u as r}from"./control-ui-foundation-43q8Lf_T.js";import{dt as i,ft as a}from"./control-ui-foundation-DQl2NL7K.js";import{$ as o,D as s,J as c,S as l,U as u,X as d,b as f,k as ee,m as te,p as ne,z as re}from"./lit-runtime-CE4wpvNA.js";import{at as ie,ct as ae,st as oe}from"./control-ui-foundation-DFIFKu9N.js";import{$n as se,$r as ce,Ai as le,Bo as p,Br as ue,Ci as m,Gr as de,Hr as fe,Jr as pe,Kr as h,Lr as me,Mi as he,Mr as ge,Nr as _e,Oi as ve,Pi as ye,Qr as g,Rr as _,Ur as be,Vr as xe,Wr as v,Xr as Se,Yr as Ce,Zr as we,ci as Te,ct as Ee,ei as y,ii as De,ki as Oe,li as ke,ni as b,oi as Ae,ot as je,qr as Me,ri as x,si as Ne,ti as Pe,xr as Fe,yi as S,zr as C}from"./control-ui-core-Dx4utKSD.js";import{Ct as Ie,Tt as Le,Ut as Re,at as ze,it as Be,jt as Ve}from"./control-ui-core-6OhF3OIO.js";import{o as w,t as T}from"./control-ui-core-CXeSrnoQ.js";import{Q as He,at as Ue,it as E,ot as D,tt as O}from"./control-ui-core-vPyynwls.js";import{t as We}from"./web-awesome-tabs-CEtFMiPt.js";import{n as Ge,t as Ke}from"./settings-workspace-BhCB-OeS.js";import{a as qe,c as k,d as Je,f as Ye,o as Xe,t as Ze}from"./settings-ui-BJ5HJKwt.js";import{o as Qe,r as $e}from"./markdown-UmoHCmlv.js";import{a as et,n as tt,s as nt}from"./presenter-PwgnXVPR.js";import{n as rt,t as it}from"./agent-scope-control-ClLrhBs5.js";import{t as at}from"./text-BbRV7ftC.js";import{t as ot}from"./web-awesome-popover-DRskEwBZ.js";function A(e){return oe(e.map(e=>e.trim()).filter(Boolean))}function st(e){let t=je(e.runtimeConfig),n=e.cron.cronForm.deliveryChannel.trim()||`last`,r=A([...e.agentsList?.agents.map(e=>e.id.trim())??[],...e.cron.cronJobs.map(e=>typeof e.agentId==`string`?e.agentId.trim():``)]),i=A([...e.modelSuggestions,...we(t),...e.cron.cronJobs.map(e=>{let t=ue(e);return t?.kind===`agentTurn`&&typeof t.model==`string`?t.model.trim():``})]),a=e.cron.cronJobs.map(e=>typeof e.delivery?.to==`string`?e.delivery.to.trim():``).filter(Boolean),o=(n===`last`?Object.values(e.channels.channelsSnapshot?.channelAccounts??{}).flat():e.channels.channelsSnapshot?.channelAccounts?.[n]??[]).flatMap(e=>[e.accountId,e.name]).filter(e=>typeof e==`string`).map(e=>e.trim()).filter(Boolean),s=A([...a,...o]);return{agentSuggestions:r,modelSuggestions:i,accountTargets:o,deliveryToSuggestions:e.cron.cronForm.deliveryMode===`webhook`?s.filter(e=>/^https?:\/\//i.test(e)):s}}var ct,j,lt=e((()=>{Ee(),be(),p(),ct=[`off`,`minimal`,`low`,`medium`,`high`],j=[`UTC`,`America/Los_Angeles`,`America/Denver`,`America/Chicago`,`America/New_York`,`Europe/London`,`Europe/Berlin`,`Asia/Tokyo`]})),ut=e((()=>{}));function M(e){let t=e.tabs;return t?o`
      <wa-tab-group
        class="settings-segmented cron-tabs"
        activation="manual"
        .active=${e.value}
        aria-label=${l(e.ariaLabel)}
        @wa-tab-show=${t=>e.onChange(t.detail.name)}
      >
        ${e.options.map(n=>o`
            <wa-tab
              slot="nav"
              id=${`${t.idPrefix}${n.value}`}
              class="settings-segmented__btn cron-tab"
              panel=${n.value}
              .active=${n.value===e.value}
              aria-controls=${t.panelId}
              data-test-id=${l(n.testId)}
            >
              ${n.label}
            </wa-tab>
          `)}
      </wa-tab-group>
    `:o`
    <wa-radio-group
      class="settings-segmented"
      size="s"
      orientation="horizontal"
      label=${l(e.ariaLabel)}
      .value=${e.value}
      @change=${t=>{let n=t.currentTarget.value;n!==void 0&&e.onChange(n)}}
    >
      ${e.options.map(t=>o`
          <wa-radio
            class="settings-segmented__btn"
            appearance="button"
            value=${t.value}
            .checked=${t.value===e.value}
            data-test-id=${l(t.testId)}
          >
            ${t.label}
          </wa-radio>
        `)}
    </wa-radio-group>
  `}var dt=e((()=>{c(),f(),We()}));function ft(e){let t=e.agentScoped?e.scopedTotal??w(`common.na`):e.status?.jobs??Math.max(e.jobsTotal,e.jobs.length),n=e.status?.enabled===!1?null:e.agentScoped?e.scopedNextWakeAtMs:e.status?.nextWakeAtMs??null,r=e.failingCount;return o`
    <div class="cron-stats">
      <div class="cron-stat">
        <span class="cron-stat__label">${w(`cron.stats.tasks`)}</span>
        <span class="cron-stat__value">${t}</span>
      </div>
      <button
        type="button"
        class="cron-stat cron-stat--action"
        data-test-id="cron-stat-failing"
        title=${w(`cron.list.activityTab`)}
        @click=${()=>{e.onListTabChange(`activity`),e.onRunsFiltersChange({cronRunsStatuses:[`error`]})}}
      >
        <span class="cron-stat__label">${w(`cron.stats.failing`)}</span>
        <span
          class="cron-stat__value ${typeof r==`number`&&r>0?`cron-stat__value--danger`:``}"
        >
          ${r??w(`common.na`)}
        </span>
        <span class="cron-stat__go" aria-hidden="true">${E(`chevronRight`)}</span>
      </button>
      <div class="cron-stat">
        <span class="cron-stat__label">${w(`cron.stats.nextWake`)}</span>
        <span class="cron-stat__value cron-stat__value--time">
          ${et(n)}
        </span>
      </div>
    </div>
  `}var pt=e((()=>{c(),D(),T(),nt()}));function N(e,t,n,r){return{id:e,emoji:t,nameKey:`cron.suggestions.ideas.${e}.name`,taglineKey:`cron.suggestions.ideas.${e}.tagline`,promptKey:`cron.suggestions.ideas.${e}.prompt`,scheduleKey:n,schedule:r}}function mt(e){return{name:w(e.nameKey),payloadText:w(e.promptKey),payloadKind:`agentTurn`,sessionTarget:`isolated`,deliveryMode:`announce`,wakeMode:`now`,deleteAfterRun:!1,enabled:!0,...e.schedule}}var P,F,I,L,R,ht=e((()=>{T(),P={scheduleKind:`cron`,cronExpr:`0 9 * * 1-5`},F={scheduleKind:`cron`,cronExpr:`0 8 * * *`},I={scheduleKind:`cron`,cronExpr:`0 9 * * 1`},L={scheduleKind:`every`,everyAmount:`1`,everyUnit:`hours`},R=[N(`repoPulse`,`🐙`,`cron.suggestions.schedules.weekdayMornings`,P),N(`standupGhostwriter`,`👻`,`cron.suggestions.schedules.weekdayMornings`,P),N(`hackerNewsScout`,`🔭`,`cron.suggestions.schedules.everyMorning`,F),N(`dependencyRadar`,`🛰️`,`cron.suggestions.schedules.weekly`,I),N(`watchdog`,`🦉`,`cron.suggestions.schedules.hourly`,L),N(`polyglotMinute`,`🗣️`,`cron.suggestions.schedules.everyMorning`,F)]}));function gt(){return[{value:`ok`,label:w(`cron.runs.runStatusOk`)},{value:`error`,label:w(`cron.runs.runStatusError`)},{value:`skipped`,label:w(`cron.runs.runStatusSkipped`)}]}function _t(){return[{value:`delivered`,label:w(`cron.runs.deliveryDelivered`)},{value:`not-delivered`,label:w(`cron.runs.deliveryNotDelivered`)},{value:`unknown`,label:w(`cron.runs.deliveryUnknown`)},{value:`not-requested`,label:w(`cron.runs.deliveryNotRequested`)}]}function z(e,t,n){let r=new Set(e);return n?r.add(t):r.delete(t),Array.from(r)}function B(e,t){return e.length===0?t:e.length<=2?e.join(`, `):`${e[0]} +${e.length-1}`}function V(e){return o`
    <div class="cron-filter-dropdown" data-filter=${e.id}>
      <wa-dropdown
        class="cron-filter-dropdown__details"
        placement="bottom-start"
        @wa-select=${t=>{let n=t.detail.item.value;if(n===`${G}clear`){e.onClear();return}if(n?.startsWith(W)){t.preventDefault();let r=n.slice(7);e.onToggle(r,!e.selected.includes(r))}}}
      >
        <button
          slot="trigger"
          type="button"
          class="btn btn--sm cron-filter-dropdown__trigger ${e.selected.length>0?`active`:``}"
          title=${e.title}
          aria-label=${e.title}
        >
          <span>${e.summary}</span>
          ${E(`chevronDown`)}
        </button>
        ${e.options.map(t=>o`
            <wa-dropdown-item
              class="cron-filter-dropdown__option"
              type="checkbox"
              value=${`${W}${t.value}`}
              .checked=${e.selected.includes(t.value)}
            >
              ${t.label}
            </wa-dropdown-item>
          `)}
        <div class="session-menu__separator" role="separator"></div>
        <wa-dropdown-item value=${`${G}clear`}>
          ${w(`cron.runs.clear`)}
        </wa-dropdown-item>
      </wa-dropdown>
    </div>
  `}function H(e){let t=e.runs.toSorted((t,n)=>e.runsSortDir===`asc`?t.ts-n.ts:n.ts-t.ts),n=e.runsQuery.trim().length>0||e.runsStatuses.length>0||e.runsDeliveryStatuses.length>0,r=gt(),i=_t(),a=r.filter(t=>e.runsStatuses.includes(t.value)).map(e=>e.label),s=i.filter(t=>e.runsDeliveryStatuses.includes(t.value)).map(e=>e.label),c=B(a,w(`cron.runs.allStatuses`)),l=B(s,w(`cron.runs.allDelivery`));return o`
    <div class="cron-runs">
      <div class="cron-run-filters">
        <div class="cron-search-box cron-run-filter-search">
          <span class="cron-search-box__icon" aria-hidden="true">${E(`search`)}</span>
          <input
            type="search"
            class="settings-input"
            .value=${e.runsQuery}
            aria-label=${w(`cron.runs.searchRuns`)}
            placeholder=${w(`cron.runs.searchPlaceholder`)}
            @input=${t=>e.onRunsFiltersChange({cronRunsQuery:t.target.value})}
          />
        </div>
        ${V({id:`status`,title:w(`cron.runs.status`),summary:c,options:r,selected:e.runsStatuses,onToggle:(t,n)=>{let r=z(e.runsStatuses,t,n);e.onRunsFiltersChange({cronRunsStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsStatuses:[]})}})}
        ${V({id:`delivery`,title:w(`cron.runs.delivery`),summary:l,options:i,selected:e.runsDeliveryStatuses,onToggle:(t,n)=>{let r=z(e.runsDeliveryStatuses,t,n);e.onRunsFiltersChange({cronRunsDeliveryStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsDeliveryStatuses:[]})}})}
        <select
          class="cron-run-sort"
          aria-label=${w(`cron.jobs.sort`)}
          title=${w(`cron.jobs.sort`)}
          .value=${e.runsSortDir}
          @change=${t=>e.onRunsFiltersChange({cronRunsSortDir:t.target.value})}
        >
          <option value="desc">${w(`cron.runs.newestFirst`)}</option>
          <option value="asc">${w(`cron.runs.oldestFirst`)}</option>
        </select>
      </div>
      ${t.length===0?n?o`<div class="muted cron-runs__empty">${w(`cron.runs.noMatching`)}</div>`:o`
              <div class="cron-empty-state">
                <div class="cron-empty-state__title">${w(`cron.runs.emptyTitle`)}</div>
                <div class="cron-empty-state__copy">${w(`cron.runs.emptyHint`)}</div>
              </div>
            `:o`
            <div class="cron-runs__list">
              ${t.map(t=>bt(t,e.basePath,e.onNavigateToChat))}
            </div>
          `}
      ${e.runsHasMore?o`
            <button
              class="btn btn--sm cron-load-more"
              ?disabled=${e.runsLoadingMore}
              @click=${e.onLoadMoreRuns}
            >
              ${e.runsLoadingMore?w(`cron.list.loading`):w(`cron.runs.loadMore`)}
            </button>
          `:d}
    </div>
  `}function vt(e,t=Date.now()){let r=n(e);return w(e>t?`cron.runEntry.next`:`cron.runEntry.due`,{rel:r})}function U(e){switch(e){case`ok`:return w(`cron.runs.runStatusOk`);case`error`:return w(`cron.runs.runStatusError`);case`skipped`:return w(`cron.runs.runStatusSkipped`);default:return w(`cron.runs.runStatusUnknown`)}}function yt(e){switch(e){case`delivered`:return w(`cron.runs.deliveryDelivered`);case`not-delivered`:return w(`cron.runs.deliveryNotDelivered`);case`not-requested`:return w(`cron.runs.deliveryNotRequested`);default:return w(`cron.runs.deliveryUnknown`)}}function bt(e,t,n){let r=typeof e.sessionKey==`string`&&e.sessionKey.trim().length>0?`${Le(`chat`,t)}${Fe(e.sessionKey)}`:null,i=U(e.status??`unknown`),a=yt(e.deliveryStatus??`not-requested`),s=e.usage,c=s&&typeof s.total_tokens==`number`?`${s.total_tokens} tokens`:s&&typeof s.input_tokens==`number`&&typeof s.output_tokens==`number`?`${s.input_tokens} in / ${s.output_tokens} out`:null,l=e.summary||e.error||w(`cron.runEntry.noSummary`),u=!!e.error&&!!e.summary,f=[a,e.model,e.provider,c].filter(Boolean);return o`
    <div class="cron-run-entry">
      <div class="cron-run-entry__header">
        <div class="cron-run-entry__main">
          <div class="cron-run-entry__title">
            ${e.jobName??e.jobId}
            <span class="muted"> · ${i}</span>
          </div>
          <div class="cron-run-entry__facts muted">${f.join(` · `)}</div>
        </div>
        <div class="cron-run-entry__meta">
          <div>${S(e.ts)}</div>
          ${typeof e.runAtMs==`number`?o`<div class="muted">${w(`cron.runEntry.runAt`)} ${S(e.runAtMs)}</div>`:d}
          <div class="muted">${e.durationMs??0}ms</div>
          ${typeof e.nextRunAtMs==`number`?o`<div class="muted">${vt(e.nextRunAtMs)}</div>`:d}
          ${r?o`<div>
                <a
                  class="session-link"
                  href=${r}
                  @click=${t=>{t.defaultPrevented||t.button!==0||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||n&&e.sessionKey&&(t.preventDefault(),n(e.sessionKey))}}
                  >${w(`cron.runEntry.openRunChat`)}</a
                >
              </div>`:d}
          ${u?o`<div class="muted">${e.error}</div>`:d}
          ${e.deliveryError?o`<div class="muted">${e.deliveryError}</div>`:d}
        </div>
      </div>
      <div class="cron-run-entry__body chat-text">
        ${ee(Qe(l))}
      </div>
    </div>
  `}var W,G,xt=e((()=>{c(),s(),Ie(),D(),O(),$e(),T(),m(),se(),W=`option:`,G=`command:`}));function K(e){let t=[`last`,...e.channels.filter(Boolean)],n=e.form.deliveryChannel?.trim();n&&!t.includes(n)&&t.push(n);let r=new Set;return t.filter(e=>r.has(e)?!1:(r.add(e),!0))}function q(e,t){if(t===`last`)return`last`;let n=e.channelMeta?.find(e=>e.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function J(e,t){let n=ae(ie(t));return n.length===0?d:o`<datalist id=${e}>
    ${n.map(e=>o`<option value=${e}></option> `)}
  </datalist>`}function Y(e){return`cron-error-${e}`}function St(e){return e===`name`?`cron-name`:e===`scheduleAt`?`cron-schedule-at`:e===`everyAmount`?`cron-every-amount`:e===`cronExpr`?`cron-cron-expr`:e===`staggerAmount`?`cron-stagger-amount`:e===`payloadText`?`cron-payload-text`:e===`payloadModel`?`cron-payload-model`:e===`payloadThinking`?`cron-payload-thinking`:e===`timeoutSeconds`?`cron-timeout-seconds`:e===`failureAlertAfter`?`cron-failure-alert-after`:e===`failureAlertCooldownSeconds`?`cron-failure-alert-cooldown-seconds`:`cron-delivery-to`}function Ct(e,t,n){return e===`payloadText`?t.payloadKind===`systemEvent`?w(`cron.form.mainTimelineMessage`):w(`cron.form.assistantTaskPrompt`):e===`deliveryTo`?w(n===`webhook`?`cron.form.webhookUrl`:`cron.form.to`):{name:w(`cron.form.fieldName`),scheduleAt:w(`cron.form.runAt`),everyAmount:w(`cron.form.every`),cronExpr:w(`cron.form.expression`),staggerAmount:w(`cron.form.staggerWindow`),payloadText:w(`cron.form.assistantTaskPrompt`),payloadModel:w(`cron.form.model`),payloadThinking:w(`cron.form.thinking`),timeoutSeconds:w(`cron.form.timeoutSeconds`),deliveryTo:w(`cron.form.to`),failureAlertAfter:w(`cron.form.failureAlertAfter`),failureAlertCooldownSeconds:w(`cron.form.failureAlertCooldown`)}[e]}function wt(e,t,n){let r=[`name`,`scheduleAt`,`everyAmount`,`cronExpr`,`staggerAmount`,`payloadText`,`payloadModel`,`payloadThinking`,`timeoutSeconds`,`deliveryTo`,`failureAlertAfter`,`failureAlertCooldownSeconds`],i=[];for(let a of r){let r=e[a];r&&i.push({key:a,label:Ct(a,t,n),message:r,inputId:St(a)})}return i}function Tt(e){let t=document.getElementById(e);t instanceof HTMLElement&&(typeof t.scrollIntoView==`function`&&t.scrollIntoView({block:`center`,behavior:`smooth`}),t.focus())}function Et(e,t){return e?o`<div id=${l(t)} class="cron-help cron-error">${w(e)}</div>`:d}function Dt(e){return o`
    ${e}
    <span class="cron-required-marker" aria-hidden="true">*</span>
    <span class="cron-required-sr">${w(`cron.form.requiredSr`)}</span>
  `}function X(e){let t=e.wide?`cron-control cron-control--wide`:`cron-control`,n=e.error?o`<div class=${t}>
        ${e.control}${Et(e.error,e.errorId)}
      </div>`:o`<div class=${t}>${e.control}</div>`;return o`
    <div class=${e.stacked?`settings-row settings-row--stacked`:`settings-row`}>
      <label class="settings-row__text" for=${e.controlId}>
        <span class="settings-row__title">
          ${e.required?Dt(e.label):e.label}
        </span>
        ${e.help?o`<span class="settings-row__desc">${e.help}</span>`:d}
      </label>
      <div class="settings-row__control">${n}</div>
    </div>
  `}function Z(e){return Ye({title:e.label,description:e.help,checked:e.checked,disabled:e.disabled,onChange:e.onChange})}function Ot(e){let t=e.editingJobId?`job`:e.createOpen?`create`:`overview`;return o`
    ${t===`overview`?kt(e):Rt(e,t)}
    ${J(`cron-agent-suggestions`,e.agentSuggestions)}
    ${J(`cron-model-suggestions`,e.modelSuggestions)}
    ${J(`cron-thinking-suggestions`,e.thinkingSuggestions)}
    ${J(`cron-tz-suggestions`,e.timezoneSuggestions)}
    ${J(`cron-delivery-to-suggestions`,e.deliveryToSuggestions)}
    ${J(`cron-delivery-account-suggestions`,e.accountSuggestions)}
  `}function kt(e){let t=e.jobsScheduleKindFilter!==`all`||e.jobsLastStatusFilter!==`all`||e.jobsSortBy!==`nextRunAtMs`||e.jobsSortDir!==`asc`,n=t||e.jobsQuery.trim().length>0||e.jobsEnabledFilter!==`all`;return o`
    <section class="cron-page" data-panel-mode="overview">
      ${qe([k({},ft(e)),e.status&&!e.status.enabled?o`
          <div class="cron-error-banner" data-test-id="cron-scheduler-banner">
            <strong>${w(`cron.list.schedulerOff`)}</strong> ${w(`cron.runNotStarted.stopped`)}
          </div>
        `:d,e.error?o`<div class="cron-error-banner">${e.error}</div>`:d,jt(e,t),o`
      <div
        id="cron-list-panel"
        class="cron-tab-panel"
        role="tabpanel"
        aria-labelledby=${`cron-list-tab-${e.listTab}`}
      >
        ${e.listTab===`activity`?k({},o`<div class="cron-activity">${H(e)}</div>`):[k({},Nt(e,n)),n?d:Lt(e)]}
      </div>
    `],{wide:!0})}
    </section>
  `}function At(e){return M({value:e.listTab,options:[{value:`tasks`,label:w(`cron.list.tasksTab`),testId:`cron-list-tab-tasks`},{value:`activity`,label:w(`cron.list.activityTab`),testId:`cron-list-tab-activity`}],ariaLabel:w(`cron.list.viewLabel`),tabs:{idPrefix:`cron-list-tab-`,panelId:`cron-list-panel`},onChange:e.onListTabChange})}function jt(e,t){return o`
    <div class="cron-toolbar">
      ${At(e)}
      ${e.listTab===`tasks`?o`
            ${M({value:e.jobsEnabledFilter,options:Xt.map(e=>({value:e.value,label:w(e.labelKey),testId:`cron-tab-${e.value}`})),ariaLabel:w(`cron.tabs.filterLabel`),onChange:t=>void e.onJobsFiltersChange({cronJobsEnabledFilter:t})})}
            <div class="cron-search-box">
              <span class="cron-search-box__icon" aria-hidden="true">${E(`search`)}</span>
              <input
                type="search"
                class="settings-input"
                .value=${e.jobsQuery}
                aria-label=${w(`cron.list.searchPlaceholder`)}
                placeholder=${w(`cron.list.searchPlaceholder`)}
                @input=${t=>e.onJobsFiltersChange({cronJobsQuery:t.target.value})}
              />
            </div>
            ${Mt(e,t)}
          `:d}
      <div class="cron-toolbar__end">
        <button
          type="button"
          class="btn btn--sm btn--ghost cron-refresh ${e.loading?`cron-refresh--loading`:``}"
          ?disabled=${e.loading}
          title=${e.loading?w(`cron.list.refreshing`):w(`cron.list.refresh`)}
          aria-label=${w(`cron.list.refresh`)}
          @click=${e.onRefresh}
        >
          ${E(`refresh`)}
        </button>
        <button
          type="button"
          class="btn primary btn--sm cron-new-task"
          data-test-id="cron-new-task"
          @click=${()=>e.onOpenCreate()}
        >
          ${E(`plus`)} ${w(`cron.list.newTask`)}
        </button>
      </div>
    </div>
  `}function Mt(e,t){return o`
    <button
      id="cron-jobs-filter-trigger"
      type="button"
      class="btn btn--sm cron-filter-popover__trigger ${t?`active`:``}"
      title=${w(`cron.list.filters`)}
      aria-label=${w(`cron.list.filters`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${E(`listFilter`)}
    </button>
    <wa-popover
      class="cron-filter-popover"
      for="cron-jobs-filter-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${e=>{e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,`true`)}}
      @wa-hide=${e=>{e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,`false`)}}
    >
      <div class="cron-filter-popover__panel">
        <label class="field">
          <span>${w(`cron.jobs.schedule`)}</span>
          <select
            class="settings-select"
            data-test-id="cron-jobs-schedule-filter"
            .value=${e.jobsScheduleKindFilter}
            @change=${t=>e.onJobsFiltersChange({cronJobsScheduleKindFilter:t.target.value})}
          >
            <option value="all">${w(`cron.jobs.all`)}</option>
            <option value="at">${w(`cron.form.at`)}</option>
            <option value="every">${w(`cron.form.every`)}</option>
            <option value="cron">${w(`cron.form.cronOption`)}</option>
          </select>
        </label>
        <label class="field">
          <span>${w(`cron.jobs.lastRun`)}</span>
          <select
            class="settings-select"
            data-test-id="cron-jobs-last-status-filter"
            .value=${e.jobsLastStatusFilter}
            @change=${t=>e.onJobsFiltersChange({cronJobsLastStatusFilter:t.target.value})}
          >
            <option value="all">${w(`cron.jobs.all`)}</option>
            <option value="ok">${w(`cron.runs.runStatusOk`)}</option>
            <option value="error">${w(`cron.runs.runStatusError`)}</option>
            <option value="skipped">${w(`cron.runs.runStatusSkipped`)}</option>
            <option value="unknown">${w(`cron.runs.runStatusUnknown`)}</option>
          </select>
        </label>
        <label class="field">
          <span>${w(`cron.jobs.sort`)}</span>
          <select
            class="settings-select"
            .value=${e.jobsSortBy}
            @change=${t=>e.onJobsFiltersChange({cronJobsSortBy:t.target.value})}
          >
            <option value="nextRunAtMs">${w(`cron.jobs.nextRun`)}</option>
            <option value="updatedAtMs">${w(`cron.jobs.recentlyUpdated`)}</option>
            <option value="name">${w(`cron.jobs.name`)}</option>
          </select>
        </label>
        <label class="field">
          <span>${w(`cron.jobs.direction`)}</span>
          <select
            class="settings-select"
            .value=${e.jobsSortDir}
            @change=${t=>e.onJobsFiltersChange({cronJobsSortDir:t.target.value})}
          >
            <option value="asc">${w(`cron.jobs.ascending`)}</option>
            <option value="desc">${w(`cron.jobs.descending`)}</option>
          </select>
        </label>
        <button
          class="btn btn--sm"
          data-test-id="cron-jobs-filters-reset"
          ?disabled=${!t}
          @click=${e.onJobsFiltersReset}
        >
          ${w(`cron.jobs.reset`)}
        </button>
      </div>
    </wa-popover>
  `}function Nt(e,t){return o`
    <div class="cron-table">
      <div class="cron-table__head" role="row">
        <span>${w(`cron.jobs.name`)}</span>
        <span>${w(`cron.jobs.schedule`)}</span>
        <span>${w(`cron.jobs.nextRun`)}</span>
        <span>${w(`cron.jobs.lastRun`)}</span>
        <span aria-hidden="true"></span>
      </div>
      ${e.jobs.length===0?o`
            <div class="cron-empty-state">
              <div class="cron-empty-state__title">
                ${w(t?`cron.list.noMatching`:`cron.list.emptyTitle`)}
              </div>
              ${t?d:o`<div class="cron-empty-state__copy">${w(`cron.list.emptyHint`)}</div>`}
            </div>
          `:te(e.jobs,e=>e.id,t=>Pt(t,e))}
      <div class="cron-table__footer">
        <span class="muted">
          ${w(`cron.list.shownOf`,{shown:String(e.jobs.length),total:String(Math.max(e.jobsTotal,e.jobs.length))})}
        </span>
        ${e.jobsHasMore?o`
              <button
                class="btn btn--sm cron-load-more"
                ?disabled=${e.loading||e.jobsLoadingMore}
                @click=${e.onLoadMoreJobs}
              >
                ${e.jobsLoadingMore?w(`cron.list.loading`):w(`cron.list.loadMore`)}
              </button>
            `:d}
      </div>
    </div>
  `}function Pt(e,t){let r=e.state?.nextRunAtMs,i=typeof r==`number`&&Number.isFinite(r),a=Oe(e)?`cron-table__dot--error`:e.enabled?`cron-table__dot--active`:``;return o`
    <div
      class="cron-table__row ${e.enabled?``:`cron-table__row--paused`}"
      role="button"
      tabindex="0"
      data-test-id=${`cron-row-${e.id}`}
      @click=${()=>t.onSelectJob(e)}
      @keydown=${n=>{(n.key===`Enter`||n.key===` `)&&(n.preventDefault(),t.onSelectJob(e))}}
    >
      <span class="cron-table__name">
        <span class="cron-table__dot ${a}" aria-hidden="true"></span>
        <span class="cron-table__name-text">${e.name}</span>
        ${e.enabled?d:o`<span class="muted cron-table__paused-note">${w(`cron.list.paused`)}</span>`}
      </span>
      <span class="cron-table__cell">${tt(e)}</span>
      <span class="cron-table__cell">
        ${i?n(r):w(`common.na`)}
      </span>
      <span class="cron-table__cell cron-table__last">${Ft(e)}</span>
      <span
        class="cron-table__actions"
        @click=${e=>e.stopPropagation()}
        @keydown=${e=>e.stopPropagation()}
      >
        <button
          type="button"
          class="btn btn--sm btn--ghost cron-row-run"
          data-test-id=${`cron-row-run-${e.id}`}
          title=${w(`cron.actions.runNow`)}
          aria-label=${w(`cron.actions.runNow`)}
          ?disabled=${t.busy}
          @click=${()=>t.onRun(e,`force`)}
        >
          ${E(`play`)}
        </button>
        ${Bt(t,e,{compact:!0,testId:`cron-row-toggle-${e.id}`})}
        ${It(t,e)}
      </span>
    </div>
  `}function Ft(e){let t=le(e),r=e.state?.lastRunAtMs,i=typeof r==`number`&&Number.isFinite(r)?n(r):null;if(t===`unknown`||!i)return o`<span class="muted">${w(`common.na`)}</span>`;let a=t===`ok`?o`<span class="cron-last-glyph cron-last-glyph--ok">${E(`check`)}</span>`:t===`error`?o`<span class="cron-last-glyph cron-last-glyph--error">${E(`x`)}</span>`:o`<span class="cron-last-glyph">${E(`cornerDownRight`)}</span>`,s=U(t);return o`
    <span class="cron-table__last-run" role="img" aria-label=${s} title=${s}>
      ${a}
      <span class="cron-table__last-time">${i}</span>
    </span>
  `}function It(e,t){return o`
    <wa-dropdown
      class="cron-job-menu"
      placement="bottom-end"
      @wa-select=${n=>{switch(n.detail.item.value){case`run-if-due`:e.onRun(t,`due`);break;case`clone`:e.onClone(t);break;case`remove`:e.onRemove(t);break;case void 0:break}}}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost cron-job-menu__trigger"
        aria-label=${w(`cron.actions.more`)}
        title=${w(`cron.actions.more`)}
      >
        ${E(`moreHorizontal`)}
      </button>
      ${Q(e,`run-if-due`,w(`cron.actions.runIfDue`))}
      ${Q(e,`clone`,w(`cron.actions.clone`))}
      ${Q(e,`remove`,w(`cron.actions.remove`),{danger:!0})}
    </wa-dropdown>
  `}function Lt(e){return k({title:w(`cron.suggestions.title`)},R.map(t=>o`
        <button
          type="button"
          class="settings-row settings-row--nav cron-suggestion"
          data-suggestion=${t.id}
          @click=${()=>e.onOpenCreate(mt(t))}
        >
          <div class="settings-row__text">
            <span class="settings-row__title">
              <span aria-hidden="true">${t.emoji}</span> ${w(t.nameKey)}
            </span>
            <span class="settings-row__desc">${w(t.taglineKey)}</span>
          </div>
          <div class="settings-row__control">
            <span class="settings-row__value">${w(t.scheduleKey)}</span>
            <span class="settings-row__chevron">${Ue.chevronRight}</span>
          </div>
        </button>
      `))}function Rt(e,t){let n=t===`job`?e.jobs.find(t=>t.id===e.editingJobId):void 0,r=t===`job`&&!!n,i=t===`job`&&e.detailTab===`history`;return o`
    <section class="cron-page cron-page--detail" data-panel-mode=${t}>
      ${qe([o`
      <div class="cron-back-row">
        <button
          type="button"
          class="cron-back"
          data-test-id="cron-back"
          ?disabled=${e.busy}
          @click=${e.onClosePanel}
        >
          ${E(`arrowLeft`)} ${w(`cron.detail.back`)}
        </button>
      </div>
    `,zt(e,t,n),r?Vt(e):d,e.error?o`<div class="cron-error-banner">${e.error}</div>`:d,o`
      <div
        id="cron-detail-panel"
        class="cron-tab-panel"
        role=${r?`tabpanel`:d}
        aria-labelledby=${r?`cron-detail-tab-${e.detailTab}`:d}
      >
        ${i?k({title:w(`cron.detail.historyTitle`)},o`<div class="cron-history">${H(e)}</div>`):Ht(e,t)}
      </div>
    `],{wide:!0})}
    </section>
  `}function zt(e,t,r){let i=t===`job`?r?.name??e.form.name:w(`cron.detail.newTitle`),a=r?.state?.nextRunAtMs,s=typeof a==`number`&&Number.isFinite(a)?` · ${w(`cron.jobState.next`)} ${n(a)}`:``,c=t===`job`&&r?`${tt(r)}${s}`:w(`cron.detail.newSubtitle`);return o`
    <div class="cron-detail-header">
      <div class="cron-detail-header__copy">
        <div class="cron-detail-title">${i}</div>
        <div class="cron-detail-meta">
          ${t===`job`&&r?Bt(e,r):d}
          <span class="cron-detail-sub">${c}</span>
        </div>
      </div>
      <div class="cron-detail-actions">
        ${t===`job`&&r?o`
              <button
                type="button"
                class="btn btn--sm"
                data-test-id="cron-run-now"
                ?disabled=${e.busy}
                @click=${()=>e.onRun(r,`force`)}
              >
                ${E(`play`)} ${w(`cron.actions.runNow`)}
              </button>
              ${It(e,r)}
            `:d}
      </div>
    </div>
  `}function Bt(e,t,n){let r=t.enabled?w(`cron.detail.active`):w(`cron.detail.paused`),i=t.enabled?w(`cron.actions.pause`):w(`cron.actions.resume`);return o`
    <span
      class="cron-enabled-toggle"
      data-test-id=${n?.testId??`cron-toggle-enabled`}
      title=${n?.compact?i:d}
    >
      ${Je({checked:t.enabled,disabled:e.busy,ariaLabel:n?.compact?i:r,onChange:n=>e.onToggle(t,n)})}
      ${n?.compact?d:o`<span class="cron-detail-sub">${r}</span>`}
    </span>
  `}function Vt(e){return M({value:e.detailTab,options:[{value:`settings`,label:w(`cron.detail.settingsTab`),testId:`cron-detail-tab-settings`},{value:`history`,label:w(`cron.detail.historyTitle`),testId:`cron-detail-tab-history`}],ariaLabel:w(`cron.detail.tabsLabel`),tabs:{idPrefix:`cron-detail-tab-`,panelId:`cron-detail-panel`},onChange:e.onDetailTabChange})}function Ht(e,t){let n=e.form.payloadLocked,r=!n&&e.form.payloadKind===`agentTurn`,i=e.form.sessionTarget!==`main`&&(e.form.payloadKind===`agentTurn`||n),a=e.form.deliveryMode===`announce`&&!i?`none`:e.form.deliveryMode,s=wt(e.fieldErrors,e.form,a),c=!e.busy&&s.length>0,l=c&&!e.canSubmit?s.length===1?w(`cron.form.fixFields`,{count:String(s.length)}):w(`cron.form.fixFieldsPlural`,{count:String(s.length)}):``;return o`
    <fieldset class="cron-editor" ?disabled=${e.busy} aria-busy=${String(e.busy)}>
      ${Ut(e,{payloadLocked:n,isAgentTurn:r})} ${Wt(e)}
      ${Kt(e)}
      ${qt(e,{supportsAnnounce:i,selectedDeliveryMode:a})}
      ${Jt(e,{mode:t,isAgentTurn:r,selectedDeliveryMode:a})}
      ${c?o`
            <div class="cron-form-status" role="status" aria-live="polite">
              <div class="cron-form-status__title">${w(`cron.form.cantAddYet`)}</div>
              <div class="cron-help">${w(`cron.form.fillRequired`)}</div>
              <ul class="cron-form-status__list">
                ${s.map(e=>o`
                    <li>
                      <button
                        type="button"
                        class="cron-form-status__link"
                        @click=${()=>Tt(e.inputId)}
                      >
                        ${e.label}: ${w(e.message)}
                      </button>
                    </li>
                  `)}
              </ul>
            </div>
          `:d}
      <div class="cron-editor-actions">
        <button
          class="btn primary"
          data-test-id="cron-submit"
          ?disabled=${e.busy||!e.canSubmit}
          @click=${e.onSubmit}
        >
          ${e.busy?w(`cron.form.saving`):w(t===`job`?`cron.form.saveChanges`:`cron.form.createTask`)}
        </button>
        ${t===`create`?o`
              <button
                class="btn"
                data-test-id="cron-submit-run"
                ?disabled=${e.busy||!e.canSubmit}
                @click=${e.onSubmitRunNow}
              >
                ${w(`cron.form.createAndRun`)}
              </button>
            `:d}
        <button class="btn" ?disabled=${e.busy} @click=${e.onClosePanel}>
          ${w(`cron.form.cancel`)}
        </button>
        ${l?o` <div class="cron-submit-reason" aria-live="polite">${l}</div> `:d}
      </div>
    </fieldset>
  `}function Q(e,t,n,r){return o`
    <wa-dropdown-item
      class=${r?.danger?`cron-job-menu__item danger`:`cron-job-menu__item`}
      value=${t}
      variant=${r?.danger?`danger`:`default`}
      ?disabled=${e.busy}
    >
      ${n}
    </wa-dropdown-item>
  `}function Ut(e,t){return k({},o`${X({label:t.payloadLocked?w(`cron.form.command`):e.form.payloadKind===`systemEvent`?w(`cron.form.mainTimelineMessage`):w(`cron.form.assistantTaskPrompt`),controlId:`cron-payload-text`,required:!0,help:t.payloadLocked?void 0:e.form.payloadKind===`systemEvent`?w(`cron.form.systemEventHelp`):w(`cron.form.agentTurnHelp`),stacked:!0,wide:!0,error:e.fieldErrors.payloadText,errorId:Y(`payloadText`),control:o`
      <textarea
        id="cron-payload-text"
        class="settings-input"
        rows="6"
        .value=${e.form.payloadText}
        ?readonly=${t.payloadLocked}
        aria-required="true"
        placeholder=${w(`cron.form.promptPlaceholder`)}
        aria-invalid=${e.fieldErrors.payloadText?`true`:`false`}
        aria-describedby=${l(e.fieldErrors.payloadText?Y(`payloadText`):void 0)}
        @input=${t=>e.onFormChange({payloadText:t.target.value})}
      ></textarea>
    `})}${X({label:w(`cron.form.action`),controlId:`cron-payload-kind`,control:t.payloadLocked?o`
          <input
            id="cron-payload-kind"
            class="settings-input"
            .value=${w(`cron.form.command`)}
            readonly
          />
        `:o`
          <select
            id="cron-payload-kind"
            class="settings-select"
            .value=${e.form.payloadKind}
            @change=${t=>e.onFormChange({payloadKind:t.target.value})}
          >
            <option value="systemEvent">${w(`cron.form.systemEvent`)}</option>
            <option value="agentTurn">${w(`cron.form.agentTurn`)}</option>
          </select>
        `})}${t.isAgentTurn?o`
        ${X({label:w(`cron.form.model`),controlId:`cron-payload-model`,help:w(`cron.form.modelHelp`),error:e.fieldErrors.payloadModel,errorId:Y(`payloadModel`),control:o`
            <input
              id="cron-payload-model"
              class="settings-input"
              .value=${e.form.payloadModel}
              list="cron-model-suggestions"
              placeholder=${w(`cron.form.modelPlaceholder`)}
              aria-invalid=${e.fieldErrors.payloadModel?`true`:`false`}
              @input=${t=>e.onFormChange({payloadModel:t.target.value})}
            />
          `})}
        ${X({label:w(`cron.form.thinking`),controlId:`cron-payload-thinking`,help:w(`cron.form.thinkingHelp`),error:e.fieldErrors.payloadThinking,errorId:Y(`payloadThinking`),control:o`
            <input
              id="cron-payload-thinking"
              class="settings-input"
              .value=${e.form.payloadThinking}
              list="cron-thinking-suggestions"
              placeholder=${w(`cron.form.thinkingPlaceholder`)}
              aria-invalid=${e.fieldErrors.payloadThinking?`true`:`false`}
              @input=${t=>e.onFormChange({payloadThinking:t.target.value})}
            />
          `})}
      `:d}`)}function Wt(e){let t=e.form.sessionTarget,n=t===`main`||t===`isolated`;return k({title:w(`cron.detail.generalSection`)},o`
      ${X({label:w(`cron.form.fieldName`),controlId:`cron-name`,required:!0,error:e.fieldErrors.name,errorId:Y(`name`),control:o`
          <input
            id="cron-name"
            class="settings-input"
            aria-required="true"
            .value=${e.form.name}
            placeholder=${w(`cron.form.namePlaceholder`)}
            aria-invalid=${e.fieldErrors.name?`true`:`false`}
            aria-describedby=${l(e.fieldErrors.name?Y(`name`):void 0)}
            @input=${t=>e.onFormChange({name:t.target.value})}
          />
        `})}
      ${X({label:w(`cron.form.agentId`),controlId:`cron-agent-id`,help:w(`cron.form.agentHelp`),control:o`
          <input
            id="cron-agent-id"
            class="settings-input"
            .value=${e.form.agentId}
            list="cron-agent-suggestions"
            ?disabled=${e.form.clearAgent}
            placeholder=${w(`cron.form.agentPlaceholder`)}
            @input=${t=>e.onFormChange({agentId:t.target.value})}
          />
        `})}
      ${X({label:w(`cron.form.runsIn`),controlId:`cron-session-target`,help:w(`cron.form.sessionHelp`),control:o`
          <select
            id="cron-session-target"
            class="settings-select"
            .value=${t}
            @change=${t=>e.onFormChange({sessionTarget:t.target.value})}
          >
            <option value="main">${w(`cron.form.mainSession`)}</option>
            <option value="isolated">${w(`cron.form.isolatedSession`)}</option>
            ${n?d:o`<option value=${t}>${t}</option>`}
          </select>
        `})}
    `)}function Gt(e){if(e.scheduleKind===`every`){let t=e.everyAmount.trim();return ke(t,e.everyUnit)===void 0?null:Number(t)===1?w(e.everyUnit===`seconds`?`cron.form.summaryEverySecondOne`:e.everyUnit===`minutes`?`cron.form.summaryEveryMinuteOne`:e.everyUnit===`hours`?`cron.form.summaryEveryHourOne`:`cron.form.summaryEveryDayOne`):w(e.everyUnit===`seconds`?`cron.form.summaryEverySeconds`:e.everyUnit===`minutes`?`cron.form.summaryEveryMinutes`:e.everyUnit===`hours`?`cron.form.summaryEveryHours`:`cron.form.summaryEveryDays`,{amount:t})}if(e.scheduleKind===`at`){let t=Date.parse(e.scheduleAt);return Number.isFinite(t)?w(`cron.form.summaryOnce`,{at:S(t)}):null}if(e.scheduleKind===`cron`){let t=e.cronExpr.trim();if(!t)return null;let n=e.cronTz.trim();return n?w(`cron.form.summaryCronTz`,{expr:t,tz:n}):w(`cron.form.summaryCron`,{expr:t})}return e.scheduleKind===`on-exit`?w(`cron.form.repeatOnExit`):null}function Kt(e){let t=e.form,n=t.scheduleKind===`on-exit`,r=[...n?[{value:`on-exit`,label:w(`cron.form.repeatOnExit`),testId:`cron-schedule-kind-on-exit`}]:[],{value:`every`,label:w(`cron.form.repeatInterval`),testId:`cron-schedule-kind-every`},{value:`at`,label:w(`cron.form.repeatOnce`),testId:`cron-schedule-kind-at`},{value:`cron`,label:w(`cron.form.cronOption`),testId:`cron-schedule-kind-cron`}],i=Gt(t);return k({title:w(`cron.detail.scheduleSection`)},o`
      ${Xe({title:w(`cron.form.repeat`),description:n?w(`cron.form.onExitHelp`):void 0,stacked:!0,control:M({value:t.scheduleKind,options:r,ariaLabel:w(`cron.form.repeat`),onChange:n=>e.onFormChange({scheduleKind:n,...n===`at`&&(t.scheduleKind===`every`||t.scheduleKind===`cron`)?{deleteAfterRun:!0}:n===`every`||n===`cron`?{deleteAfterRun:!1}:{}})})})}
      ${t.scheduleKind===`at`?X({label:w(`cron.form.runAt`),controlId:`cron-schedule-at`,required:!0,error:e.fieldErrors.scheduleAt,errorId:Y(`scheduleAt`),control:o`
              <input
                id="cron-schedule-at"
                class="settings-input"
                type="datetime-local"
                aria-required="true"
                .value=${t.scheduleAt}
                aria-invalid=${e.fieldErrors.scheduleAt?`true`:`false`}
                aria-describedby=${l(e.fieldErrors.scheduleAt?Y(`scheduleAt`):void 0)}
                @input=${t=>e.onFormChange({scheduleAt:t.target.value})}
              />
            `}):d}
      ${t.scheduleKind===`every`?X({label:w(`cron.form.every`),controlId:`cron-every-amount`,required:!0,error:e.fieldErrors.everyAmount,errorId:Y(`everyAmount`),control:o`
              <div class="cron-inline-controls">
                <input
                  id="cron-every-amount"
                  class="settings-input"
                  aria-required="true"
                  .value=${t.everyAmount}
                  aria-invalid=${e.fieldErrors.everyAmount?`true`:`false`}
                  aria-describedby=${l(e.fieldErrors.everyAmount?Y(`everyAmount`):void 0)}
                  placeholder=${w(`cron.form.everyAmountPlaceholder`)}
                  @input=${t=>e.onFormChange({everyAmount:t.target.value})}
                />
                <select
                  class="settings-select"
                  .value=${t.everyUnit}
                  aria-label=${w(`cron.form.unit`)}
                  @change=${t=>e.onFormChange({everyUnit:t.target.value})}
                >
                  <option value="seconds">${w(`cron.form.seconds`)}</option>
                  <option value="minutes">${w(`cron.form.minutes`)}</option>
                  <option value="hours">${w(`cron.form.hours`)}</option>
                  <option value="days">${w(`cron.form.days`)}</option>
                </select>
              </div>
            `}):d}
      ${t.scheduleKind===`cron`?o`
            ${X({label:w(`cron.form.expression`),controlId:`cron-cron-expr`,required:!0,error:e.fieldErrors.cronExpr,errorId:Y(`cronExpr`),control:o`
                <input
                  id="cron-cron-expr"
                  class="settings-input mono"
                  aria-required="true"
                  .value=${t.cronExpr}
                  aria-invalid=${e.fieldErrors.cronExpr?`true`:`false`}
                  aria-describedby=${l(e.fieldErrors.cronExpr?Y(`cronExpr`):void 0)}
                  placeholder=${w(`cron.form.expressionPlaceholder`)}
                  @input=${t=>e.onFormChange({cronExpr:t.target.value})}
                />
              `})}
            ${X({label:w(`cron.form.timezoneOptional`),controlId:`cron-cron-tz`,help:w(`cron.form.timezoneHelp`),control:o`
                <input
                  id="cron-cron-tz"
                  class="settings-input"
                  .value=${t.cronTz}
                  list="cron-tz-suggestions"
                  placeholder=${w(`cron.form.timezonePlaceholder`)}
                  @input=${t=>e.onFormChange({cronTz:t.target.value})}
                />
              `})}
          `:d}
      ${i?o` <div class="cron-schedule-summary">${E(`clock`)}<span>${i}</span></div> `:d}
    `)}function qt(e,t){let n=K(e);return k({title:w(`cron.detail.deliverySection`)},o`
      ${X({label:w(`cron.form.deliveryModeLabel`),controlId:`cron-delivery-mode`,help:w(`cron.form.deliveryHelp`),control:o`
          <select
            id="cron-delivery-mode"
            class="settings-select"
            .value=${t.selectedDeliveryMode}
            @change=${t=>e.onFormChange({deliveryMode:t.target.value})}
          >
            ${t.supportsAnnounce?o`<option value="announce">${w(`cron.form.announceDefault`)}</option>`:d}
            <option value="webhook">${w(`cron.form.webhookPost`)}</option>
            <option value="none">${w(`cron.form.noneInternal`)}</option>
          </select>
        `})}
      ${t.selectedDeliveryMode===`announce`?o`
            ${X({label:w(`cron.form.channel`),controlId:`cron-delivery-channel`,help:w(`cron.form.channelHelp`),control:o`
                <select
                  id="cron-delivery-channel"
                  class="settings-select"
                  .value=${e.form.deliveryChannel||`last`}
                  @change=${t=>e.onFormChange({deliveryChannel:t.target.value})}
                >
                  ${n.map(t=>o`<option value=${t}>
                        ${q(e,t)}
                      </option>`)}
                </select>
              `})}
            ${X({label:w(`cron.form.to`),controlId:`cron-delivery-to`,help:w(`cron.form.toHelp`),control:o`
                <input
                  id="cron-delivery-to"
                  class="settings-input"
                  .value=${e.form.deliveryTo}
                  list="cron-delivery-to-suggestions"
                  placeholder=${w(`cron.form.toPlaceholder`)}
                  @input=${t=>e.onFormChange({deliveryTo:t.target.value})}
                />
              `})}
          `:d}
      ${t.selectedDeliveryMode===`webhook`?X({label:w(`cron.form.webhookUrl`),controlId:`cron-delivery-to`,required:!0,help:w(`cron.form.webhookHelp`),error:e.fieldErrors.deliveryTo,errorId:Y(`deliveryTo`),control:o`
              <input
                id="cron-delivery-to"
                class="settings-input"
                aria-required="true"
                .value=${e.form.deliveryTo}
                list="cron-delivery-to-suggestions"
                aria-invalid=${e.fieldErrors.deliveryTo?`true`:`false`}
                aria-describedby=${l(e.fieldErrors.deliveryTo?Y(`deliveryTo`):void 0)}
                placeholder=${w(`cron.form.webhookPlaceholder`)}
                @input=${t=>e.onFormChange({deliveryTo:t.target.value})}
              />
            `}):d}
    `)}function Jt(e,t){let n=e.form.scheduleKind===`cron`,r=K(e);return o`
    <section class="settings-section">
      <details class="cron-advanced">
        <summary class="settings-section__heading cron-advanced__summary">
          ${w(`cron.form.advanced`)}
        </summary>
        <p class="settings-section__desc">${w(`cron.form.advancedHelp`)}</p>
        <div class="settings-group">
          ${X({label:w(`cron.form.description`),controlId:`cron-description`,control:o`
              <input
                id="cron-description"
                class="settings-input"
                .value=${e.form.description}
                placeholder=${w(`cron.form.descriptionPlaceholder`)}
                @input=${t=>e.onFormChange({description:t.target.value})}
              />
            `})}
          ${t.mode===`create`?Z({label:w(`cron.form.startEnabled`),checked:e.form.enabled,onChange:t=>e.onFormChange({enabled:t})}):d}
          ${X({label:w(`cron.form.wakeMode`),controlId:`cron-wake-mode`,help:w(`cron.form.wakeModeHelp`),control:o`
              <select
                id="cron-wake-mode"
                class="settings-select"
                .value=${e.form.wakeMode}
                @change=${t=>e.onFormChange({wakeMode:t.target.value})}
              >
                <option value="now">${w(`cron.form.now`)}</option>
                <option value="next-heartbeat">${w(`cron.form.nextHeartbeat`)}</option>
              </select>
            `})}
          ${t.isAgentTurn?X({label:w(`cron.form.timeoutSeconds`),controlId:`cron-timeout-seconds`,help:w(`cron.form.timeoutHelp`),error:e.fieldErrors.timeoutSeconds,errorId:Y(`timeoutSeconds`),control:o`
                  <input
                    id="cron-timeout-seconds"
                    class="settings-input"
                    .value=${e.form.timeoutSeconds}
                    placeholder=${w(`cron.form.timeoutPlaceholder`)}
                    aria-invalid=${e.fieldErrors.timeoutSeconds?`true`:`false`}
                    aria-describedby=${l(e.fieldErrors.timeoutSeconds?Y(`timeoutSeconds`):void 0)}
                    @input=${t=>e.onFormChange({timeoutSeconds:t.target.value})}
                  />
                `}):d}
          ${e.form.scheduleKind===`at`||e.form.scheduleKind===`on-exit`?Z({label:w(`cron.form.deleteAfterRun`),checked:e.form.deleteAfterRun,help:w(`cron.form.deleteAfterRunHelp`),onChange:t=>e.onFormChange({deleteAfterRun:t})}):d}
          ${Z({label:w(`cron.form.clearAgentOverride`),checked:e.form.clearAgent,help:w(`cron.form.clearAgentHelp`),onChange:t=>e.onFormChange({clearAgent:t})})}
          ${X({label:w(`cron.form.sessionKey`),controlId:`cron-session-key`,help:w(`cron.form.sessionKeyHelp`),control:o`
              <input
                id="cron-session-key"
                class="settings-input"
                .value=${e.form.sessionKey}
                placeholder="agent:main:main"
                @input=${t=>e.onFormChange({sessionKey:t.target.value})}
              />
            `})}
          ${n?o`
                ${Z({label:w(`cron.form.exactTiming`),checked:e.form.scheduleExact,help:w(`cron.form.exactTimingHelp`),onChange:t=>e.onFormChange({scheduleExact:t})})}
                ${X({label:w(`cron.form.staggerWindow`),controlId:`cron-stagger-amount`,error:e.fieldErrors.staggerAmount,errorId:Y(`staggerAmount`),control:o`
                    <div class="cron-inline-controls">
                      <input
                        id="cron-stagger-amount"
                        class="settings-input"
                        .value=${e.form.staggerAmount}
                        ?disabled=${e.form.scheduleExact}
                        aria-invalid=${e.fieldErrors.staggerAmount?`true`:`false`}
                        aria-describedby=${l(e.fieldErrors.staggerAmount?Y(`staggerAmount`):void 0)}
                        placeholder=${w(`cron.form.staggerPlaceholder`)}
                        @input=${t=>e.onFormChange({staggerAmount:t.target.value})}
                      />
                      <select
                        class="settings-select"
                        .value=${e.form.staggerUnit}
                        ?disabled=${e.form.scheduleExact}
                        aria-label=${w(`cron.form.staggerUnit`)}
                        @change=${t=>e.onFormChange({staggerUnit:t.target.value})}
                      >
                        <option value="seconds">${w(`cron.form.seconds`)}</option>
                        <option value="minutes">${w(`cron.form.minutes`)}</option>
                      </select>
                    </div>
                  `})}
              `:d}
          ${t.isAgentTurn?o`
                ${X({label:w(`cron.form.accountId`),controlId:`cron-delivery-account-id`,help:w(`cron.form.accountIdHelp`),control:o`
                    <input
                      id="cron-delivery-account-id"
                      class="settings-input"
                      .value=${e.form.deliveryAccountId}
                      list="cron-delivery-account-suggestions"
                      ?disabled=${t.selectedDeliveryMode!==`announce`}
                      placeholder="default"
                      @input=${t=>e.onFormChange({deliveryAccountId:t.target.value})}
                    />
                  `})}
                ${Z({label:w(`cron.form.lightContext`),checked:e.form.payloadLightContext,help:w(`cron.form.lightContextHelp`),onChange:t=>e.onFormChange({payloadLightContext:t})})}
                ${Yt(e,r)}
              `:d}
          ${t.selectedDeliveryMode===`none`?d:Z({label:w(`cron.form.bestEffortDelivery`),checked:e.form.deliveryBestEffort,help:w(`cron.form.bestEffortHelp`),onChange:t=>e.onFormChange({deliveryBestEffort:t})})}
        </div>
      </details>
    </section>
  `}function Yt(e,t){return o`
    ${X({label:w(`cron.form.failureAlerts`),controlId:`cron-failure-alert-mode`,help:w(`cron.form.failureAlertsHelp`),control:o`
        <select
          id="cron-failure-alert-mode"
          class="settings-select"
          .value=${e.form.failureAlertMode}
          @change=${t=>e.onFormChange({failureAlertMode:t.target.value})}
        >
          <option value="inherit">${w(`cron.form.failureAlertInherit`)}</option>
          <option value="disabled">${w(`cron.form.failureAlertDisabled`)}</option>
          <option value="custom">${w(`cron.form.failureAlertCustom`)}</option>
        </select>
      `})}
    ${e.form.failureAlertMode===`custom`?o`
          ${X({label:w(`cron.form.failureAlertAfter`),controlId:`cron-failure-alert-after`,help:w(`cron.form.failureAlertAfterHelp`),error:e.fieldErrors.failureAlertAfter,errorId:Y(`failureAlertAfter`),control:o`
              <input
                id="cron-failure-alert-after"
                class="settings-input"
                .value=${e.form.failureAlertAfter}
                aria-invalid=${e.fieldErrors.failureAlertAfter?`true`:`false`}
                aria-describedby=${l(e.fieldErrors.failureAlertAfter?Y(`failureAlertAfter`):void 0)}
                placeholder="2"
                @input=${t=>e.onFormChange({failureAlertAfter:t.target.value})}
              />
            `})}
          ${X({label:w(`cron.form.failureAlertCooldown`),controlId:`cron-failure-alert-cooldown-seconds`,help:w(`cron.form.failureAlertCooldownHelp`),error:e.fieldErrors.failureAlertCooldownSeconds,errorId:Y(`failureAlertCooldownSeconds`),control:o`
              <input
                id="cron-failure-alert-cooldown-seconds"
                class="settings-input"
                .value=${e.form.failureAlertCooldownSeconds}
                aria-invalid=${e.fieldErrors.failureAlertCooldownSeconds?`true`:`false`}
                aria-describedby=${l(e.fieldErrors.failureAlertCooldownSeconds?Y(`failureAlertCooldownSeconds`):void 0)}
                placeholder="3600"
                @input=${t=>e.onFormChange({failureAlertCooldownSeconds:t.target.value})}
              />
            `})}
          ${X({label:w(`cron.form.failureAlertChannel`),controlId:`cron-failure-alert-channel`,control:o`
              <select
                id="cron-failure-alert-channel"
                class="settings-select"
                .value=${e.form.failureAlertChannel||`last`}
                @change=${t=>e.onFormChange({failureAlertChannel:t.target.value})}
              >
                ${t.map(t=>o`<option value=${t}>${q(e,t)}</option>`)}
              </select>
            `})}
          ${X({label:w(`cron.form.failureAlertTo`),controlId:`cron-failure-alert-to`,help:w(`cron.form.failureAlertToHelp`),control:o`
              <input
                id="cron-failure-alert-to"
                class="settings-input"
                .value=${e.form.failureAlertTo}
                list="cron-delivery-to-suggestions"
                placeholder=${w(`cron.form.failureAlertToPlaceholder`)}
                @input=${t=>e.onFormChange({failureAlertTo:t.target.value})}
              />
            `})}
          ${X({label:w(`cron.form.failureAlertMode`),controlId:`cron-failure-alert-delivery-mode`,control:o`
              <select
                id="cron-failure-alert-delivery-mode"
                class="settings-select"
                .value=${e.form.failureAlertDeliveryMode||`announce`}
                @change=${t=>e.onFormChange({failureAlertDeliveryMode:t.target.value})}
              >
                <option value="announce">${w(`cron.form.failureAlertAnnounce`)}</option>
                <option value="webhook">${w(`cron.form.failureAlertWebhook`)}</option>
              </select>
            `})}
          ${X({label:w(`cron.form.failureAlertAccountId`),controlId:`cron-failure-alert-account-id`,control:o`
              <input
                id="cron-failure-alert-account-id"
                class="settings-input"
                .value=${e.form.failureAlertAccountId}
                placeholder=${w(`cron.form.failureAlertAccountPlaceholder`)}
                @input=${t=>e.onFormChange({failureAlertAccountId:t.target.value})}
              />
            `})}
        `:d}
  `}var Xt,Zt=e((()=>{c(),f(),ne(),at(),ut(),D(),Ze(),He(),O(),ot(),T(),ve(),Te(),m(),nt(),p(),dt(),pt(),ht(),xt(),Xt=[{value:`all`,labelKey:`cron.tabs.all`},{value:`enabled`,labelKey:`cron.tabs.active`},{value:`disabled`,labelKey:`cron.tabs.paused`}]})),$;e((()=>{i(),c(),re(),Ve(),ze(),it(),Ke(),be(),se(),ye(),_e(),lt(),Zt(),r(),$=class extends he{constructor(...e){super(...e),this.cron=C(),this.agentsList=null,this.cronModelSuggestions=[],this.listTab=`tasks`,this.detailTab=`settings`,this.modelSuggestionsState=null,this.subscriptions=new ge(this).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t),()=>this.syncAgentsState()).watch(()=>this.context?.channels,(e,t)=>e.subscribe(t)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>e.subscribe(e=>{if(this.cron.cronAgentId===e.scopeId)return;let t={client:this.cron.client,connected:this.cron.connected};this.resetGatewayState(t),this.cron.cronAgentId=e.scopeId,this.listTab=`tasks`,this.detailTab=`settings`,this.ensureInitialData(),this.requestUpdate()})).effect(()=>this.context?.gateway,e=>{let t=this.gatewaySource!==void 0&&this.gatewaySource!==e;return this.gatewaySource=e,this.syncGatewayState(e.snapshot,t),this.ensureInitialData(),e.subscribe(t=>{this.gatewaySource===e&&(this.syncGatewayState(t,!1),this.ensureInitialData())})}).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{this.gatewaySource===e&&e.snapshot.connected&&e.snapshot.client&&t.event===`cron`&&this.refreshCron({tableFilters:!0})})),this.lastPanelKey=null}disconnectedCallback(){this.gatewaySource=void 0,this.resetGatewayState(),this.subscriptions.clear(),super.disconnectedCallback()}resetGatewayState(e={}){this.cron=C(e),this.cron.cronAgentId=this.context.agentSelection.state.scopeId,this.agentsList=e.connected?this.context.agents.state.agentsList:null,this.cronModelSuggestions=[],this.modelSuggestionsState=null}syncGatewayState(e,t){(t||this.cron.client!==e.client||this.cron.connected!==e.connected)&&this.resetGatewayState(e)}syncAgentsState(){this.agentsList=this.context.agents.state.agentsList}ensureInitialData(){if(!(!this.cron.connected||!this.cron.client)&&(!this.agentsList&&!this.context.agents.state.agentsLoading&&this.context.agents.ensureList(),!this.cron.cronStatus&&!this.cron.cronLoading?this.refreshCron({tableFilters:!0}):!this.cron.cronRuns.length&&!this.cron.cronRunsLoadingMore&&this.loadRuns(this.cron.cronRunsScope===`all`?null:this.cron.cronRunsJobId),this.modelSuggestionsState!==this.cron)){let e=this.cron;this.modelSuggestionsState=e,this.loadModelSuggestions(e)}}requestCronUpdate(e=this.cron){this.cron===e&&this.requestUpdate()}updated(){let e=`${this.cron.cronEditingJobId?`job`:this.cron.cronCreateOpen?`create`:`overview`}:${this.cron.cronEditingJobId??``}`;if(e!==this.lastPanelKey){this.lastPanelKey=e,this.detailTab=`settings`;let t=this.closest(`.content`);t instanceof HTMLElement&&typeof t.scrollTo==`function`&&t.scrollTo({top:0})}}async refreshCron(e){let t=this.cron;if(!t.connected||!t.client)return;let n=t.cronRunsScope===`job`?t.cronRunsJobId:null;this.loadRuns(n),this.context.channels.refresh(!1),await Promise.all([this.runCronTask(e=>Me(e)),this.runCronTask(e=>Ae(e)),this.runCronTask(e=>Ne(e)),this.runCronTask(t=>v(t,{tableFilters:e.tableFilters}))])}loadRuns(e){return this.runCronTask(t=>h(t,e))}async loadModelSuggestions(e){let t={client:e.client,connected:e.connected,cronModelSuggestions:this.cronModelSuggestions};await de(t),this.isConnected&&this.cron===e&&this.modelSuggestionsState===e&&e.connected&&t.client===e.client&&(this.cronModelSuggestions=t.cronModelSuggestions)}async runCronTask(e){let t=this.cron;try{let n=e(t);return this.requestCronUpdate(t),await n}finally{this.requestCronUpdate(t)}}patchForm(e){this.cron.cronForm=Ce({...this.cron.cronForm,...e}),this.cron.cronFieldErrors=De(this.cron.cronForm),this.requestCronUpdate()}selectJob(e){this.cron.cronCreateOpen=!1,y(this.cron,e),this.requestCronUpdate(),this.runCronTask(async t=>{x(t,{cronRunsScope:`job`}),t.cronRunsJobId=e.id,await h(t,e.id)})}openCreate(e){if(_(this.cron),this.cron.cronCreateOpen=!0,e){this.patchForm(e);return}this.requestCronUpdate()}cloneJob(e){ce(this.cron,e),this.cron.cronCreateOpen=!0,this.requestCronUpdate()}closePanel(){_(this.cron),this.cron.cronCreateOpen=!1,this.requestCronUpdate(),this.runCronTask(async e=>{x(e,{cronRunsScope:`all`}),e.cronRunsJobId=null,await h(e,null)})}submitForm(e={}){this.runCronTask(async t=>{let n=t.cronEditingJobId,r=await me(t);if(r.saved){if(n){let e=t.cronJobs.find(e=>e.id===n);e&&y(t,e);return}e.runNow&&r.jobId&&await g(t,r.jobId,`force`),t.cronCreateOpen=!1,t.cronRunsScope===`job`&&(x(t,{cronRunsScope:`all`}),t.cronRunsJobId=null,await h(t,null))}})}render(){let e=this.context.channels.state,t=st({channels:e,runtimeConfig:this.context.runtimeConfig.state,cron:this.cron,agentsList:this.agentsList,modelSuggestions:this.cronModelSuggestions});return o`
      <section class="content-header">
        <div>
          <div class="page-title">${Re(`cron`)}</div>
        </div>
        ${rt({agents:this.agentsList?.agents??[],selection:this.context.agentSelection})}
      </section>
      ${Ge(Ot({basePath:this.context.basePath,loading:this.cron.cronLoading,status:this.cron.cronStatus,failingCount:this.cron.cronFailingCount,agentScoped:this.cron.cronAgentId!==null,scopedTotal:this.cron.cronScopedTotal,scopedNextWakeAtMs:this.cron.cronScopedNextWakeAtMs,jobs:xe(this.cron),jobsLoadingMore:this.cron.cronJobsLoadingMore,jobsTotal:this.cron.cronJobsTotal,jobsHasMore:this.cron.cronJobsHasMore,jobsQuery:this.cron.cronJobsQuery,jobsEnabledFilter:this.cron.cronJobsEnabledFilter,jobsScheduleKindFilter:this.cron.cronJobsScheduleKindFilter,jobsLastStatusFilter:this.cron.cronJobsLastStatusFilter,jobsSortBy:this.cron.cronJobsSortBy,jobsSortDir:this.cron.cronJobsSortDir,editingJobId:this.cron.cronEditingJobId,createOpen:this.cron.cronCreateOpen,listTab:this.listTab,detailTab:this.detailTab,error:this.cron.cronError,busy:this.cron.cronBusy,form:this.cron.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(e=>e.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runs:this.cron.cronRuns,runsTotal:this.cron.cronRunsTotal,runsHasMore:this.cron.cronRunsHasMore,runsLoadingMore:this.cron.cronRunsLoadingMore,runsStatuses:this.cron.cronRunsStatuses,runsDeliveryStatuses:this.cron.cronRunsDeliveryStatuses,runsQuery:this.cron.cronRunsQuery,runsSortDir:this.cron.cronRunsSortDir,fieldErrors:this.cron.cronFieldErrors,canSubmit:!fe(this.cron.cronFieldErrors),agentSuggestions:t.agentSuggestions,modelSuggestions:t.modelSuggestions,thinkingSuggestions:ct,timezoneSuggestions:j,deliveryToSuggestions:t.deliveryToSuggestions,accountSuggestions:t.accountTargets,onListTabChange:e=>{this.listTab=e},onDetailTabChange:e=>{this.detailTab=e},onFormChange:e=>this.patchForm(e),onRefresh:()=>void this.refreshCron({tableFilters:!0}),onSubmit:()=>this.submitForm(),onSubmitRunNow:()=>this.submitForm({runNow:!0}),onSelectJob:e=>this.selectJob(e),onOpenCreate:e=>this.openCreate(e),onClosePanel:()=>this.closePanel(),onClone:e=>this.cloneJob(e),onToggle:(e,t)=>void this.runCronTask(async n=>{await Pe(n,e,t)&&n.cronEditingJobId===e.id&&(n.cronForm={...n.cronForm,enabled:t})}),onRun:(e,t)=>void this.runCronTask(n=>g(n,e.id,t??`force`)),onRemove:e=>void this.runCronTask(async t=>{await Se(t,e),t.cronRunsScope===`job`&&t.cronRunsJobId===null&&(x(t,{cronRunsScope:`all`}),await h(t,null))}),onLoadMoreJobs:()=>void this.runCronTask(e=>v(e,{append:!0,tableFilters:!0})),onJobsFiltersChange:e=>void this.runCronTask(async t=>{b(t,e),await v(t,{append:!1,tableFilters:!0})}),onJobsFiltersReset:()=>void this.runCronTask(async e=>{b(e,{cronJobsScheduleKindFilter:`all`,cronJobsLastStatusFilter:`all`,cronJobsSortBy:`nextRunAtMs`,cronJobsSortDir:`asc`}),await v(e,{append:!1,tableFilters:!0})}),onLoadMoreRuns:()=>void this.runCronTask(e=>pe(e)),onRunsFiltersChange:e=>void this.runCronTask(async t=>{x(t,e),await h(t,t.cronRunsScope===`all`?null:t.cronRunsJobId)}),onNavigateToChat:e=>this.context.navigate(`chat`,{search:Fe(e)})}))}
    `}},t([a({context:Be,subscribe:!0})],$.prototype,`context`,void 0),t([u()],$.prototype,`cron`,void 0),t([u()],$.prototype,`agentsList`,void 0),t([u()],$.prototype,`cronModelSuggestions`,void 0),t([u()],$.prototype,`listTab`,void 0),t([u()],$.prototype,`detailTab`,void 0),customElements.get(`openclaw-cron-page`)||customElements.define(`openclaw-cron-page`,$)}))();
//# sourceMappingURL=cron-page-B2acgajt.js.map