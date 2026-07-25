import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{$ as t,J as n,X as r}from"./lit-runtime-CE4wpvNA.js";import{o as i,t as a}from"./control-ui-core-CXeSrnoQ.js";function o(e){let t=e.trim();if(!t||l(t))return t;let n=t.match(/^\/(?:home|Users)\/([^/]+)(.*)$/);if(n&&c(n[1]))return s(n[2]??``);let r=t.match(/^[A-Za-z]:[\\/]Users[\\/]([^\\/]+)(.*)$/i);return r&&c(r[1])?s(r[2]??``):t}function s(e){return`~${e.replace(/\\/g,`/`)}`}function c(e){return e!==void 0&&e!==`.`&&e!==`..`}function l(e){return/(^|[\\/])\.{1,2}(?=[\\/]|$)/.test(e)}var u=e((()=>{}));function d(e,t){let n=Math.max(0,Math.ceil((e-t)/1e3));return`${String(Math.floor(n/60)).padStart(2,`0`)}:${String(n%60).padStart(2,`0`)}`}function f(e,t){return e>t?i(`execApproval.expiresIn`,{time:d(e,t)}):i(`execApproval.expired`)}function p(e,n,i){return n?t`<div class="exec-approval-meta-row">
    <span>${e}</span><span>${i?.path?o(n):n}</span>
  </div>`:r}function m(e){let n=[...e.commandSpans??[]].filter(t=>Number.isSafeInteger(t.startIndex)&&Number.isSafeInteger(t.endIndex)&&t.startIndex>=0&&t.endIndex>t.startIndex&&t.endIndex<=e.command.length).toSorted((e,t)=>e.startIndex-t.startIndex||t.endIndex-e.endIndex),r=[],i=0;for(let e of n)e.startIndex>=i&&(r.push(e),i=e.endIndex);if(!r.length)return t`<div class="exec-approval-command mono">${e.command}</div>`;let a=[];i=0;for(let n of r)n.startIndex>i&&a.push(e.command.slice(i,n.startIndex)),a.push(t`<mark class="exec-approval-command-span"
        >${e.command.slice(n.startIndex,n.endIndex)}</mark
      >`),i=n.endIndex;return i<e.command.length&&a.push(e.command.slice(i)),t`<div class="exec-approval-command mono">${a}</div>`}function h(e){return t` ${m(e)}
    <div class="exec-approval-meta">
      ${p(i(`execApproval.labels.host`),e.host)}
      ${p(i(`execApproval.labels.agent`),e.agentId)}
      ${p(i(`execApproval.labels.session`),e.sessionKey)}
      ${p(i(`execApproval.labels.cwd`),e.cwd,{path:!0})}
      ${p(i(`execApproval.labels.resolved`),e.resolvedPath,{path:!0})}
      ${p(i(`execApproval.labels.security`),e.security)}
      ${p(i(`execApproval.labels.ask`),e.ask)}
    </div>`}function g(e){return t` ${e.pluginDescription?t`<pre class="exec-approval-command mono" style="white-space:pre-wrap">
${e.pluginDescription}</pre>`:r}
    <div class="exec-approval-meta">
      ${p(i(`execApproval.labels.severity`),e.pluginSeverity)}
      ${p(i(`execApproval.labels.plugin`),e.pluginId)}
      ${p(i(`execApproval.labels.agent`),e.request.agentId)}
      ${p(i(`execApproval.labels.session`),e.request.sessionKey)}
    </div>`}function _(e){return i(e===`allow-once`?`execApproval.allowOnce`:e===`allow-always`?`execApproval.alwaysAllow`:`execApproval.deny`)}function v(e){return e===`allow-once`?`btn primary`:e===`deny`?`btn danger`:`btn`}function y(e){return e===`allow-once`?`Ctrl/Cmd+Enter`:e===`allow-always`?`Ctrl/Cmd+Shift+Enter`:`Ctrl/Cmd+D`}function b(e){return e.request.allowedDecisions?.length?e.request.allowedDecisions:e.kind===`exec`&&e.request.ask===`always`?[`allow-once`,`deny`]:C}function x(e){return e.kind===`exec`?i(`execApproval.execApprovalNeeded`):e.pluginTitle??i(`execApproval.pluginApprovalNeeded`)}function S(e){let n=e.approval,a=b(n),o=x(n);return t` <div
    class="exec-approval-card exec-approval-card--${e.variant}"
    data-approval-id=${n.id}
  >
    <div class="exec-approval-header">
      <div>
        <div class="exec-approval-title">${o}</div>
        <div class="exec-approval-sub exec-approval-countdown" role="timer">
          ${f(n.expiresAtMs,e.nowMs)}
        </div>
      </div>
      ${(e.queueCount??0)>1?t`<div class="exec-approval-queue">
            ${i(`execApproval.pending`,{count:String(e.queueCount)})}
          </div>`:r}
    </div>
    ${n.kind===`exec`?h(n.request):g(n)}
    ${n.kind===`exec`&&!a.includes(`allow-always`)?t`<div class="exec-approval-warning">${i(`execApproval.allowAlwaysUnavailable`)}</div>`:r}
    ${e.error?t`<div class="exec-approval-error">${e.error}</div>`:r}
    <div class="exec-approval-actions">
      ${a.map(r=>{let i=_(r);return t`<button
          class=${v(r)}
          type="button"
          ?disabled=${e.busy}
          title=${e.variant===`modal`?`${i} (${y(r)})`:i}
          @click=${()=>e.onDecision(n.id,r)}
        >
          <span>${i}</span>
        </button>`})}
    </div>
  </div>`}var C,w=e((()=>{n(),u(),a(),C=[`allow-once`,`allow-always`,`deny`]}));export{S as a,w as i,x as n,b as o,d as r,f as t};
//# sourceMappingURL=exec-approval-card-BtCcEiBp.js.map