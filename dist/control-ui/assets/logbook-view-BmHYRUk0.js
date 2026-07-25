import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{o as t}from"./control-ui-foundation-43q8Lf_T.js";import{$ as n,D as r,J as i,X as a,k as o}from"./lit-runtime-CE4wpvNA.js";import{Ci as s,bi as c}from"./control-ui-core-Dx4utKSD.js";import{o as l,t as u}from"./control-ui-core-CXeSrnoQ.js";import{at as d,ot as f}from"./control-ui-core-vPyynwls.js";import{o as p,r as m}from"./markdown-UmoHCmlv.js";import{askLogbook as h,configureLogbookPolling as g,getLogbookState as _,loadLogbook as v,loadLogbookFramePreview as y,loadLogbookStandup as b,localDayKey as x,runLogbookAnalysisNow as S,setLogbookCapturePaused as C,shiftDay as w,t as T}from"./logbook-controller-D8dPiIy0.js";var E=e((()=>{}));function D(e,t){return c(e,{hour:`2-digit`,minute:`2-digit`,timeZone:t},``)}function O(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)|0;return Math.abs(t)%360}function k(e){let t=e.captureEnabled&&!e.capturePaused&&!e.lastCaptureError,r=e.capturePaused?l(`logbook.status.paused`):e.captureEnabled?l(`logbook.status.capturing`,{seconds:String(e.captureIntervalSeconds)}):l(`logbook.status.disabled`);return n`
    <div class="logbook__chips">
      <span class="logbook__chip ${t?`logbook__chip--ok`:`logbook__chip--warn`}">
        <span class="logbook__chip-dot"></span>
        ${r}
      </span>
      ${e.nodeName||e.nodeId?n`<span class="logbook__chip" title=${l(`logbook.status.nodeHelp`)}>
            ${d.monitor} ${e.nodeName??e.nodeId}
          </span>`:a}
      ${e.pendingFrames>0?n`<span class="logbook__chip" title=${l(`logbook.status.pendingHelp`)}>
            ${l(`logbook.status.pending`,{count:String(e.pendingFrames)})}
          </span>`:a}
      ${e.analysisRunning?n`<span class="logbook__chip logbook__chip--busy"
            >${l(`logbook.status.analyzing`)}</span
          >`:a}
      ${e.lastCaptureError?n`<span class="logbook__chip logbook__chip--error" title=${e.lastCaptureError}>
            ${l(`logbook.status.captureError`)}
          </span>`:a}
      ${e.lastBatch?.status===`error`?n`<span
            class="logbook__chip logbook__chip--error"
            title=${e.lastBatch.error??``}
          >
            ${l(`logbook.status.batchError`)}
          </span>`:a}
      ${e.visionModelSource===`missing`?n`<span
            class="logbook__chip logbook__chip--warn"
            title=${l(`logbook.status.modelMissingHelp`)}
          >
            ${l(`logbook.status.modelMissing`)}
          </span>`:a}
    </div>
  `}function A(e,r,i,o){let s=e.expandedCardIds.has(i.id),c=O(i.category),u=i.keyframeId!==void 0&&!e.framePreviewFailed.has(i.keyframeId)?i.keyframeId:void 0,d=u===void 0?void 0:e.framePreviews.get(u);return s&&u!==void 0&&!d&&y(e,r,u),n`
    <article
      class="logbook-card ${s?`logbook-card--expanded`:``}"
      style="--logbook-hue: ${c}"
    >
      <button
        class="logbook-card__header"
        type="button"
        @click=${()=>{let t=new Set(e.expandedCardIds);s?t.delete(i.id):t.add(i.id),e.expandedCardIds=t,e.requestUpdate?.()}}
      >
        <span class="logbook-card__time">
          ${D(i.startMs,o)}<span class="logbook-card__time-sep">–</span
          >${D(i.endMs,o)}
        </span>
        <span class="logbook-card__stripe" aria-hidden="true"></span>
        <span class="logbook-card__heading">
          <span class="logbook-card__title">${i.title}</span>
          <span class="logbook-card__summary">${i.summary}</span>
        </span>
        <span class="logbook-card__meta">
          <span class="logbook-card__category">${i.category}</span>
          ${i.appPrimary?n`<span class="logbook-card__app">${i.appPrimary}</span>`:a}
          <span class="logbook-card__duration"
            >${t(i.endMs-i.startMs,{spaced:!0})??`0s`}</span
          >
        </span>
      </button>
      ${s?n`
            <div class="logbook-card__body">
              ${d?n`<img
                    class="logbook-card__keyframe"
                    src=${d}
                    alt=${l(`logbook.card.keyframeAlt`)}
                  />`:u===void 0?a:n`<div class="logbook-card__keyframe logbook-card__keyframe--loading">
                      ${l(`common.loading`)}
                    </div>`}
              ${i.detail?n`<p class="logbook-card__detail">${i.detail}</p>`:a}
              ${i.distractions.length>0?n`
                    <div class="logbook-card__distractions">
                      <span class="logbook-card__distractions-label">
                        ${l(`logbook.card.distractions`)}
                      </span>
                      ${i.distractions.map(e=>n`
                          <span class="logbook-card__distraction">
                            ${D(e.startMs,o)} · ${e.title}
                          </span>
                        `)}
                    </div>
                  `:a}
            </div>
          `:a}
    </article>
  `}function j(e){let r=e.timeline?.stats;if(!r||r.trackedMs<=0)return a;let i=Math.max(0,r.trackedMs-r.distractionMs),o=Math.round(i/r.trackedMs*100),s=r.categories[0]?.ms??1;return n`
    <section class="card logbook-side__card">
      <div class="card-title">${l(`logbook.stats.title`)}</div>
      <div class="logbook-stats__focus">
        <div class="logbook-stats__focus-bar">
          <div class="logbook-stats__focus-fill" style="width: ${o}%"></div>
        </div>
        <div class="logbook-stats__focus-legend">
          <span>${l(`logbook.stats.focus`,{pct:String(o)})}</span>
          <span
            >${l(`logbook.stats.tracked`,{duration:t(r.trackedMs,{spaced:!0})??`0s`})}</span
          >
        </div>
      </div>
      <div class="logbook-stats__categories">
        ${r.categories.slice(0,6).map(e=>n`
            <div
              class="logbook-stats__category"
              style="--logbook-hue: ${O(e.category)}"
            >
              <span class="logbook-stats__category-name">${e.category}</span>
              <span class="logbook-stats__category-bar">
                <span
                  class="logbook-stats__category-fill"
                  style="width: ${Math.max(6,Math.round(e.ms/s*100))}%"
                ></span>
              </span>
              <span class="logbook-stats__category-time"
                >${t(e.ms,{spaced:!0})??`0s`}</span
              >
            </div>
          `)}
      </div>
      ${r.apps.length>0?n`
            <div class="logbook-stats__apps">
              ${r.apps.slice(0,5).map(e=>n`<span class="logbook-stats__app">${e.domain}</span>`)}
            </div>
          `:a}
    </section>
  `}function M(e,t){return n`
    <section class="card logbook-side__card">
      <div class="logbook-side__card-header">
        <div class="card-title">${l(`logbook.standup.title`)}</div>
        <button
          class="btn btn--small"
          type="button"
          ?disabled=${e.standupLoading}
          @click=${()=>void b(e,t,e.standup!==null)}
        >
          ${e.standupLoading?l(`common.loading`):e.standup?l(`logbook.standup.refresh`):l(`logbook.standup.generate`)}
        </button>
      </div>
      ${e.standup?n`<div class="logbook-standup__body markdown-body">
            ${o(p(e.standup.text))}
          </div>`:n`<div class="card-sub">${l(`logbook.standup.empty`)}</div>`}
    </section>
  `}function N(e,t){return n`
    <section class="card logbook-side__card">
      <div class="card-title">${l(`logbook.ask.title`)}</div>
      <form
        class="logbook-ask__form"
        @submit=${n=>{n.preventDefault(),h(e,t)}}
      >
        <input
          class="logbook-ask__input"
          type="text"
          .value=${e.askQuestion}
          placeholder=${l(`logbook.ask.placeholder`)}
          @input=${t=>{e.askQuestion=t.target.value}}
        />
        <button class="btn btn--small" type="submit" ?disabled=${e.askLoading}>
          ${e.askLoading?l(`common.loading`):l(`logbook.ask.submit`)}
        </button>
      </form>
      ${e.askAnswer?n`<p class="logbook-ask__answer">${e.askAnswer}</p>`:a}
    </section>
  `}function P(e){let t=_(e.host);t.requestUpdate=e.onRequestUpdate??null;let r=e.connected;g(t,r?e.client:null,r),r&&!t.timeline&&!t.loading&&!t.error&&v(t,e.client);let i=t.status?.today??x(),o=t.day===i,s=t.status,c=t.timeline?.cards??[];return n`
    <section class="logbook">
      <header class="logbook__header">
        <div class="logbook__daynav">
          <button
            class="btn btn--small"
            type="button"
            aria-label=${l(`logbook.nav.previousDay`)}
            @click=${()=>void v(t,e.client,{day:w(t.day,-1)})}
          >
            ‹
          </button>
          <span class="logbook__day">${t.day}</span>
          <button
            class="btn btn--small"
            type="button"
            aria-label=${l(`logbook.nav.nextDay`)}
            ?disabled=${o}
            @click=${()=>void v(t,e.client,{day:w(t.day,1)})}
          >
            ›
          </button>
          ${o?a:n`<button
                class="btn btn--small"
                type="button"
                @click=${()=>void v(t,e.client,{today:!0})}
              >
                ${l(`logbook.nav.today`)}
              </button>`}
        </div>
        ${t.status?k(t.status):a}
        <div class="logbook__actions">
          ${t.status?n`<button
                class="btn btn--small"
                type="button"
                ?disabled=${t.actionPending||!t.status.captureEnabled}
                @click=${()=>void C(t,e.client,!t.status?.capturePaused)}
              >
                ${t.status.capturePaused?l(`logbook.actions.resume`):l(`logbook.actions.pause`)}
              </button>`:a}
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${t.actionPending}
            @click=${()=>void S(t,e.client)}
          >
            ${l(`logbook.actions.analyzeNow`)}
          </button>
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${t.loading}
            @click=${()=>void v(t,e.client)}
          >
            ${d.refresh}
          </button>
        </div>
      </header>
      ${t.error?n`<div class="callout danger" role="alert">${t.error}</div>`:a}
      <div class="logbook__layout">
        <div class="logbook__timeline">
          ${t.loading&&c.length===0?n`<div class="card-sub">${l(`common.loading`)}</div>`:a}
          ${!t.loading&&c.length===0&&!t.error?n`
                <div class="logbook__empty">
                  <div class="logbook__empty-title">${l(`logbook.empty.title`)}</div>
                  <div class="logbook__empty-sub">${l(`logbook.empty.subtitle`)}</div>
                </div>
              `:a}
          ${s?c.map(n=>A(t,e.client,n,s.timeZone)):a}
        </div>
        <aside class="logbook__side">
          ${j(t)} ${M(t,e.client)}
          ${N(t,e.client)}
        </aside>
      </div>
    </section>
  `}e((()=>{i(),r(),f(),m(),u(),s(),E(),T()}))();export{P as renderLogbook};
//# sourceMappingURL=logbook-view-BmHYRUk0.js.map