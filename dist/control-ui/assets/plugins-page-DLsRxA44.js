import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,u as n}from"./control-ui-foundation-43q8Lf_T.js";import{dt as r,ft as i}from"./control-ui-foundation-DQl2NL7K.js";import{$ as a,G as o,J as s,U as c,X as l,f as ee,m as u,p as te,u as ne,z as re}from"./lit-runtime-CE4wpvNA.js";import{$t as ie,Mi as ae,Mr as oe,Nr as se,Pi as ce,an as le,bn as ue,ct as de,en as d,in as fe,lt as pe,nn as f,on as me,rn as he,sn as ge,tn as _e,vn as ve,yn as ye}from"./control-ui-core-Dx4utKSD.js";import{B as be,Ct as xe,F as Se,P as Ce,Tt as we,U as Te,Ut as Ee,at as De,it as Oe,jt as ke}from"./control-ui-core-6OhF3OIO.js";import{o as p,t as m}from"./control-ui-core-CXeSrnoQ.js";import{D as Ae,at as h,ot as je}from"./control-ui-core-vPyynwls.js";import{n as Me,t as Ne}from"./settings-workspace-BhCB-OeS.js";import{a as Pe,c as g,l as Fe,n as _,t as v,u as y}from"./settings-ui-BJ5HJKwt.js";import{t as Ie}from"./openclaw-mascot-Bo-d0_tR.js";import{a as b,c as x,i as S,n as Le,o as C,r as w,s as T,t as Re}from"./presentation-DqKeN4xp.js";import{a as ze,c as Be,i as E,l as Ve,n as He,o as Ue,r as We,s as Ge,t as Ke,u as qe}from"./mcp-server-form-BsEHXbd1.js";import{n as Je,r as Ye}from"./icon-loader-Bh1ITktZ.js";import{n as Xe,r as Ze,t as Qe}from"./plugins-CDorkKpm.js";function $e(e){switch(e){case`all`:return p(`pluginsPage.filterAll`);case`enabled`:return p(`pluginsPage.enabled`);case`disabled`:return p(`pluginsPage.disabled`);case`issues`:return p(`pluginsPage.filterIssues`);default:return e}}function et(e){switch(e){case`work`:return p(`pluginsPage.connectorGroupWork`);case`dev`:return p(`pluginsPage.connectorGroupDev`);case`home`:return p(`pluginsPage.connectorGroupHome`);case`life`:return p(`pluginsPage.connectorGroupLife`);default:return e}}function D(e){return`plugin:${e}`}function tt(e){return`clawhub:${e}`}function O(e){return`connector:${e}`}function k(e){return e.trim().toLocaleLowerCase()}function A(e,t){let n=k(t);return n?[e.name,e.id,e.description,e.origin,e.category,...e.kind??[]].some(e=>e?.toLocaleLowerCase().includes(n)):!0}function j(e,t){let n=k(t);return n?[e.id,e.name,p(e.descriptionKey)].some(e=>e.toLocaleLowerCase().includes(n)):!0}function M(e){return e.toSorted((e,t)=>{let n=Number(!!t.featured)-Number(!!e.featured);if(n!==0)return n;if(e.featured&&t.featured){let n=e.featuredAt,r=t.featuredAt;if(n!==void 0||r!==void 0){if(n===void 0)return 1;if(r===void 0)return-1;if(n!==r)return r-n}}return(e.order??2**53-1)-(t.order??2**53-1)||e.name.localeCompare(t.name)})}function nt(e,t=``,n=`all`){return M(e.filter(e=>{if(!e.installed||!A(e,t))return!1;switch(n){case`enabled`:return e.enabled&&e.state!==`error`;case`disabled`:return!e.enabled&&e.state!==`error`;case`issues`:return e.state===`error`;default:return!0}}))}function rt(e){let t=new Map;for(let n of e){let e=n.category??`other`,r=t.get(e)??[];r.push(n),t.set(e,r)}let n=e=>{let t=w.indexOf(e);return t===-1?w.length:t};return[...t.entries()].map(([e,t])=>({category:e,label:C(e),plugins:t})).toSorted((e,t)=>n(e.category)-n(t.category))}function it(e,t=``){let n=M(e.filter(e=>e.featured&&A(e,t))),r=new Set(n.map(e=>e.id));return{featured:n,official:M(e.filter(e=>!r.has(e.id)&&e.origin===`official`&&!e.installed&&A(e,t))),connectors:Le.filter(e=>j(e,t))}}function N(e,t,n,r){let i=b(e);if(i)return a`<span class="plugins-tile">
      <img src=${i} alt="" loading="lazy" decoding="async" />
    </span>`;if(n)return a`<span class="plugins-tile">
      <img
        class="plugins-icon"
        src=${n}
        alt=""
        loading="lazy"
        decoding="async"
        @error=${r}
      />
    </span>`;let[o,s]=T(e),c=x(t);return a`<span
    class="plugins-tile plugins-tile--fallback"
    style=${`--plugins-art-a:${o};--plugins-art-b:${s}`}
    aria-hidden="true"
  >
    ${c?a`<span>${c}</span>`:h.puzzle}
  </span>`}function at(e){switch(e.state){case`enabled`:return p(`pluginsPage.enabled`);case`disabled`:return p(`pluginsPage.disabled`);case`error`:return p(`pluginsPage.needsAttention`);case`not-installed`:return p(`pluginsPage.available`);default:return e.state}}function P(e){return y({kind:e.state===`enabled`?`ok`:e.state===`error`?`danger`:`muted`,label:at(e)})}function F(e){return e.state===`error`?P(e):l}function I(e){switch(e){case`bundled`:return p(`pluginsPage.included`);case`global`:return p(`pluginsPage.global`);case`workspace`:return p(`pluginsPage.workspace`);case`config`:return p(`pluginsPage.config`);case`official`:return p(`pluginsPage.official`);default:return e}}function L(e){let t=e.filter(e=>e!==l&&e!==``);return t.length===0?l:a`<span class="settings-row__desc plugins-meta">
    ${t.map((e,t)=>a`${t>0?a`<span aria-hidden="true"> · </span>`:l}${e}`)}
  </span>`}function R(e,t,n,r){if(!t)return l;let i=t.kind===`error`?`alert`:`status`;return a`
    <div class="plugins-row-message plugins-row-message--${t.kind}" role=${i}>
      <span>${t.text}</span>
      ${t.acknowledge?a`
            <button
              type="button"
              class="btn btn--sm"
              title=${r.mutationBlockedReason??``}
              ?disabled=${n||!r.canMutate}
              @click=${()=>r.onInstall(e,{source:`clawhub`,packageName:t.acknowledge?.packageName??``,...t.acknowledge?.version?{version:t.acknowledge.version}:{},acknowledgeClawHubRisk:!0})}
            >
              ${p(n?`pluginsPage.installing`:`pluginsPage.acknowledgeRisk`)}
            </button>
          `:l}
    </div>
  `}function z(e){return!!e.target?.closest(`button, a, input, label, form, [role='menu']`)}function B(e,t,n){let r=!n.enabled;return a`
    <button
      type="button"
      class="btn btn--sm"
      title=${e.mutationBlockedReason??``}
      ?disabled=${!e.canMutate||t}
      @click=${e=>{e.stopPropagation(),n.onToggle(r)}}
    >
      ${p(t?`pluginsPage.working`:r?`pluginsPage.enableAction`:`pluginsPage.disableAction`)}
    </button>
  `}function V(e,t,n,r){return a`
    <button
      type="button"
      class="btn btn--sm btn--icon plugins-remove"
      aria-label=${p(`pluginsPage.removeNamed`,{name:n})}
      title=${e.mutationBlockedReason??p(`pluginsPage.removeNamed`,{name:n})}
      ?disabled=${!e.canMutate||t}
      @click=${e=>{e.stopPropagation(),r()}}
    >
      ${h.trash}
    </button>
  `}function H(e,t,n,r,i){return a`
    <button
      type="button"
      class="btn btn--sm plugins-install"
      title=${e.mutationBlockedReason??``}
      aria-label=${p(`pluginsPage.installNamed`,{name:r})}
      ?disabled=${!e.canMutate||t}
      @click=${t=>{t.stopPropagation(),e.onInstall(n,i)}}
    >
      ${p(t?`pluginsPage.installing`:`pluginsPage.install`)}
    </button>
  `}function U(e,t,n,r){return a`
    <span
      class="plugins-remove-confirm"
      role="alertdialog"
      aria-label=${p(`pluginsPage.removeNamed`,{name:e.name})}
    >
      <span>${p(`pluginsPage.removeConfirm`)}</span>
      <button
        type="button"
        class="btn btn--sm danger"
        ?disabled=${n||!t.canMutate}
        @click=${n=>{n.stopPropagation(),t.onUninstall(e.id,r)}}
      >
        ${p(n?`pluginsPage.removing`:`pluginsPage.remove`)}
      </button>
      <button
        type="button"
        class="btn btn--sm"
        ?disabled=${n}
        @click=${e=>{e.stopPropagation(),t.onCancelUninstall(r)}}
      >
        ${p(`pluginsPage.cancel`)}
      </button>
    </span>
  `}function W(e,t,n,r){if(t.pendingRemoval[r])return U(e,t,n,r);if(!e.installed){let i=e.install;return i?H(t,n,r,e.name,i):a`<span class="plugins-action-note">${p(`pluginsPage.unavailable`)}</span>`}return a`
    ${B(t,n,{enabled:e.enabled,onToggle:n=>t.onSetEnabled(e.id,n,r)})}
    ${e.removable?V(t,n,e.name,()=>t.onRequestUninstall(r)):l}
  `}function ot(e){let t=(e.result?.plugins??[]).filter(e=>e.installed),n=t.filter(e=>e.state===`error`).length,r=t.filter(e=>e.enabled&&e.state!==`error`).length,i={all:t.length,enabled:r,disabled:t.length-r-n,issues:n};return Fe({value:e.installedFilter,ariaLabel:p(`pluginsPage.filterLabel`),options:Y.map(e=>({value:e,label:a`${$e(e)} <span class="settings-count">${i[e]}</span>`})),onChange:t=>e.onFilterChange(t)})}function st(e,t){let n=D(e.id),r=t.busy[n]??!1;return a`
    <article
      class="settings-row plugins-item plugins-item--clickable"
      data-plugin-id=${e.id}
      data-plugin-source=${e.origin??`unknown`}
      data-plugin-status=${e.state}
      aria-busy=${r?`true`:`false`}
      @click=${n=>{z(n)||t.onShowDetails(e.id)}}
    >
      ${N(e.id,e.name,t.iconUrls[e.id],()=>t.onIconError(e.id))}
      <div class="settings-row__text">
        <h3 class="settings-row__title">
          ${e.name}
          ${e.version?a`<span class="plugins-version">v${e.version}</span>`:l}
        </h3>
        <span class="settings-row__desc">
          ${e.description||p(`pluginsPage.optionalCapability`)}
        </span>
        ${L([e.origin?I(e.origin):l,e.packageName?a`<span class="plugins-meta__mono">${e.packageName}</span>`:l])}
      </div>
      <div class="settings-row__control">
        ${F(e)} ${W(e,t,r,n)}
      </div>
      ${e.error?a`<div class="plugins-row-message plugins-row-message--error" role="alert">
            ${e.error}
          </div>`:l}
      ${R(n,t.messages[n],r,t)}
    </article>
  `}function ct(e){let t=k(e.query),n=e.mcpServers?.filter(e=>!t||e.name.toLocaleLowerCase().includes(t)||e.target.toLocaleLowerCase().includes(t));if(t&&n&&n.length===0)return l;let r=n?n.length===0?_(p(`pluginsPage.mcpEmpty`)):u(n,e=>e.name,t=>lt(t,e)):a`<div class="plugins-search-state" role="status">${p(`pluginsPage.loading`)}</div>`;return g({title:p(`pluginsPage.mcpServersGroup`),...n?{count:n.length}:{},description:p(`pluginsPage.mcpHint`),actions:a`
        <a class="plugins-group__link" href=${e.mcpSettingsHref}
          >${p(`pluginsPage.mcpSettingsLink`)}</a
        >
        <button
          type="button"
          class="btn btn--sm"
          title=${e.mutationBlockedReason??``}
          ?disabled=${!e.canMutate||e.mcpBusy}
          @click=${()=>e.onMcpFormToggle(!e.mcpFormOpen)}
        >
          <span aria-hidden="true">${h.plus}</span>
          ${p(`mcpServers.add`)}
        </button>
      `},a`
      ${e.mcpFormOpen?He({busy:e.mcpBusy,disabled:!e.canMutate,blockedReason:e.mutationBlockedReason,onSubmit:e.onMcpAdd,onCancel:()=>e.onMcpFormToggle(!1)}):l}
      ${e.mcpMessage?a`<div
            class="plugins-row-message plugins-row-message--${e.mcpMessage.kind} plugins-group-message"
            role=${e.mcpMessage.kind===`error`?`alert`:`status`}
          >
            <span>${e.mcpMessage.text}</span>
          </div>`:l}
      ${r}
    `)}function lt(e,t){return a`
    <article class="settings-row plugins-item" data-mcp-name=${e.name}>
      ${N(e.name,e.name)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">${e.name}</h3>
        <span class="settings-row__desc plugins-meta__mono">
          ${e.target||p(`mcpServers.missingTransport`)}
        </span>
        ${L([p(`pluginsPage.mcp`),e.transport,e.auth===`oauth`?p(`pluginsPage.oauth`):l])}
      </div>
      <div class="settings-row__control">
        ${B(t,t.mcpBusy,{enabled:e.enabled,onToggle:n=>t.onMcpToggle(e.name,n)})}
        ${V(t,t.mcpBusy,e.name,()=>t.onMcpRemove(e.name))}
      </div>
    </article>
  `}function ut(e){let t=rt(nt(e.result?.plugins??[],e.query,e.installedFilter)),n=!!(e.query||e.installedFilter!==`all`);return a`
    ${t.length===0?J(p(n?`pluginsPage.noInstalledMatchTitle`:`pluginsPage.noInstalledTitle`),p(n?`pluginsPage.noMatchBody`:`pluginsPage.noInstalledBody`),n?`curious`:`sleepy`):t.map(t=>g({title:t.label,count:t.plugins.length},u(t.plugins,e=>e.id,t=>st(t,e))))}
    ${ct(e)}
  `}function G(e,t){let n=D(e.id),r=t.busy[n]??!1;return a`
    <article
      class="settings-row plugins-item plugins-item--clickable"
      data-plugin-id=${e.id}
      data-plugin-source=${e.origin??`unknown`}
      data-plugin-status=${e.state}
      aria-busy=${r?`true`:`false`}
      @click=${n=>{z(n)||t.onShowDetails(e.id)}}
    >
      ${N(e.id,e.name,t.iconUrls[e.id],()=>t.onIconError(e.id))}
      <div class="settings-row__text">
        <h3 class="settings-row__title">
          ${e.name}
          ${e.version?a`<span class="plugins-version">v${e.version}</span>`:l}
        </h3>
        <span class="settings-row__desc">
          ${e.description||p(`pluginsPage.optionalCapability`)}
        </span>
        ${L([e.origin?I(e.origin):l])}
      </div>
      <div class="settings-row__control">
        ${e.installed?F(e):l}
        ${W(e,t,r,n)}
      </div>
      ${e.error?a`<div class="plugins-row-message plugins-row-message--error" role="alert">
            ${e.error}
          </div>`:l}
      ${R(n,t.messages[n],r,t)}
    </article>
  `}function dt(e,t){let n=O(e.id),r=t.busy[n]??!1,i=e.action.kind===`mcp`,o=i&&!!t.mcpServers?.some(t=>e.action.kind===`mcp`&&t.name===e.action.mcp.serverName);return a`
    <article
      class="settings-row plugins-item"
      data-connector-id=${e.id}
      aria-busy=${r?`true`:`false`}
    >
      ${N(e.id,e.name)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">${e.name}</h3>
        <span class="settings-row__desc">${p(e.descriptionKey)}</span>
        ${L(i?[p(`pluginsPage.mcp`),p(`pluginsPage.connectorMcpNote`)]:[p(`pluginsPage.connectorClawHubNote`)])}
      </div>
      <div class="settings-row__control">
        ${i?o?y({kind:`ok`,label:p(`pluginsPage.connectorAdded`)}):a`
                <button
                  type="button"
                  class="btn btn--sm"
                  title=${t.mutationBlockedReason??``}
                  ?disabled=${!t.canMutate||r}
                  @click=${()=>t.onAddConnector(e)}
                >
                  ${p(r?`mcpServers.adding`:`pluginsPage.connectorAdd`)}
                </button>
              `:a`
              <button
                type="button"
                class="btn btn--sm"
                @click=${()=>e.action.kind===`clawhub`&&t.onSearchClawHub(e.action.query)}
              >
                <span aria-hidden="true">${h.search}</span>
                ${p(`pluginsPage.connectorSearch`)}
              </button>
            `}
      </div>
      ${R(n,t.messages[n],r,t)}
    </article>
  `}function K(e,t){return t.length===0?l:g({title:e,count:t.length},t)}function ft(e,t){return t.find(t=>t.installed&&(t.id===e.package.runtimeId||t.packageName===e.package.name||t.install?.source===`clawhub`&&t.install.packageName===e.package.name))}function pt(e){return e===`source-linked`?p(`pluginsPage.verifiedSource`):e}function mt(e,t){let n=e.package,r=ft(e,t.result?.plugins??[]),i=tt(n.name),o=t.busy[i]??!1,s=n.runtimeId??n.name;return a`
    <article
      class="settings-row plugins-item ${r?`plugins-item--clickable`:``}"
      data-package-name=${n.name}
      data-plugin-source="clawhub"
      data-plugin-status=${r?.state??`not-installed`}
      aria-busy=${o?`true`:`false`}
      @click=${e=>{r&&!z(e)&&t.onShowDetails(r.id)}}
    >
      ${N(s,n.displayName)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">
          ${n.displayName}
          ${n.latestVersion?a`<span class="plugins-version">v${n.latestVersion}</span>`:l}
        </h3>
        <span class="settings-row__desc">${n.summary||n.name}</span>
        ${L([n.isOfficial?p(`pluginsPage.official`):l,n.verificationTier?pt(n.verificationTier):l,typeof n.downloads==`number`?a`<span class="plugins-downloads">
                <span aria-hidden="true">${h.download}</span>
                ${X.format(n.downloads)}
              </span>`:l,n.family===`bundle-plugin`?p(`pluginsPage.bundlePlugin`):p(`pluginsPage.codePlugin`)])}
      </div>
      <div class="settings-row__control">
        ${r?a`${F(r)}${W(r,t,o,i)}`:H(t,o,i,n.displayName,{source:`clawhub`,packageName:n.name})}
      </div>
      ${R(i,t.messages[i],o,t)}
    </article>
  `}function ht(e){let t=e.query.trim();if(t.length<2)return l;let n;return n=e.searchLoading||!e.searchResults&&!e.searchError?a`<div class="plugins-search-state" role="status">
      ${p(`pluginsPage.searching`)}
    </div>`:e.searchError?a`<div class="plugins-search-state plugins-search-state--error" role="alert">
      ${e.searchError}
    </div>`:e.searchResults&&e.searchResults.length===0?a`${_(p(`pluginsPage.noClawHubResultsBody`,{query:t}))}`:a`
      ${u(e.searchResults??[],e=>e.package.name,t=>mt(t,e))}
    `,g({title:p(`pluginsPage.fromClawHub`),...e.searchResults?{count:e.searchResults.length}:{},actions:a`
        <a
          class="plugins-group__link"
          href=${ie}
          target=${ve}
          rel=${ye()}
        >
          ${p(`pluginsPage.browseClawHub`)}
          <span class="plugins-group__link-icon" aria-hidden="true">${h.externalLink}</span>
        </a>
      `},n)}function gt(e){let t=it(e.result?.plugins??[],e.query),n=t.featured.map(t=>G(t,e)),r=t.official.map(t=>G(t,e)),i=ht(e);return!n.length&&!r.length&&!t.connectors.length?a`
      ${i===l?J(p(`pluginsPage.noDiscoverMatchTitle`),p(`pluginsPage.noMatchBody`),`curious`):l}
      ${i}
    `:a`
    ${K(p(`pluginsPage.featuredGroup`),n)}
    ${K(p(`pluginsPage.officialGroup`),r)}
    ${_t(t.connectors,e)} ${i}
  `}function _t(e,t){if(e.length===0)return l;let n=Re.map(t=>({group:t,entries:e.filter(e=>e.group===t)})).filter(e=>e.entries.length>0);return g({title:p(`pluginsPage.connectorsGroup`),count:e.length,description:p(`pluginsPage.connectorsHint`)},n.map(e=>a`
        <h3 class="plugins-subheader" data-connector-group=${e.group}>
          ${et(e.group)}
        </h3>
        ${e.entries.map(e=>dt(e,t))}
      `))}function q(e,t){return a`
    <div class="plugins-detail__meta-row">
      <span class="plugins-detail__meta-label">${e}</span>
      <span class="plugins-detail__meta-value">${t}</span>
    </div>
  `}function vt(e){let t=e.detailPluginId?e.result?.plugins.find(t=>t.id===e.detailPluginId):void 0;if(!t)return l;let n=D(t.id),r=e.busy[n]??!1;return a`
    <openclaw-modal-dialog
      label=${t.name}
      style="--openclaw-modal-width: min(580px, calc(100vw - 32px));"
      @modal-cancel=${()=>e.onShowDetails(null)}
    >
      <section class="plugins-detail" data-detail-plugin-id=${t.id}>
        <button
          type="button"
          class="btn btn--sm btn--icon plugins-detail__close"
          aria-label=${p(`pluginsPage.detailClose`)}
          @click=${()=>e.onShowDetails(null)}
        >
          ${h.x}
        </button>
        ${yt(t.id,t.name,e.iconUrls[t.id],()=>e.onIconError(t.id))}
        <div class="plugins-detail__body">
          <div class="plugins-detail__title">
            <h2>${t.name}</h2>
            ${t.version?a`<span class="plugins-version">v${t.version}</span>`:l}
            ${P(t)}
          </div>
          <p class="plugins-detail__description">
            ${t.description||p(`pluginsPage.optionalCapability`)}
          </p>
          <div class="plugins-detail__actions">
            ${e.pendingRemoval[n]?U(t,e,r,n):a`
                  ${t.installed?a`
                        <button
                          type="button"
                          class="btn ${t.enabled?``:`primary`}"
                          title=${e.mutationBlockedReason??``}
                          ?disabled=${!e.canMutate||r}
                          @click=${()=>e.onSetEnabled(t.id,!t.enabled,n)}
                        >
                          ${r?p(`pluginsPage.working`):t.enabled?p(`pluginsPage.disableAction`):p(`pluginsPage.enableAction`)}
                        </button>
                      `:t.install?H(e,r,n,t.name,t.install):l}
                  ${t.removable?a`
                        <button
                          type="button"
                          class="btn plugins-detail__remove"
                          title=${e.mutationBlockedReason??``}
                          ?disabled=${!e.canMutate||r}
                          @click=${()=>e.onRequestUninstall(n)}
                        >
                          <span aria-hidden="true">${h.trash}</span>
                          ${p(`pluginsPage.remove`)}
                        </button>
                      `:l}
                `}
          </div>
          ${t.error?a`<div class="plugins-row-message plugins-row-message--error" role="alert">
                ${t.error}
              </div>`:l}
          ${R(n,e.messages[n],r,e)}
          <div class="plugins-detail__meta">
            ${t.origin?q(p(`pluginsPage.detailOrigin`),I(t.origin)):l}
            ${t.category?q(p(`pluginsPage.detailCategory`),C(t.category)):l}
            ${t.packageName?q(p(`pluginsPage.detailPackage`),a`<code>${t.packageName}</code>`):l}
            ${q(p(`pluginsPage.detailPluginId`),a`<code>${t.id}</code>`)}
          </div>
        </div>
      </section>
    </openclaw-modal-dialog>
  `}function yt(e,t,n,r){let i=b(e);if(i)return a`<span class="plugins-cover">
      <img src=${i} alt="" loading="lazy" decoding="async" />
    </span>`;if(n)return a`<span class="plugins-cover">
      <img
        class="plugins-icon"
        src=${n}
        alt=""
        loading="lazy"
        decoding="async"
        @error=${r}
      />
    </span>`;let[o,s]=T(e),c=x(t);return a`<span
    class="plugins-cover plugins-cover--fallback"
    style=${`--plugins-art-a:${o};--plugins-art-b:${s}`}
    aria-hidden="true"
  >
    ${c?a`<span>${c}</span>`:h.puzzle}
  </span>`}function J(e,t,n){return a`
    <div class="plugins-empty">
      <!-- Sleepy marks truly empty inventory; curious marks a filter/search miss. -->
      ${n?a`<openclaw-mascot
            class="plugins-empty__mascot"
            .mood=${n}
            .size=${84}
          ></openclaw-mascot>`:a`<span class="plugins-empty__icon" aria-hidden="true">${h.puzzle}</span>`}
      <h2>${e}</h2>
      <p>${t}</p>
    </div>
  `}function bt(e){switch(e.activeTab){case`installed`:return ut(e);case`discover`:return gt(e);default:return e.activeTab}}function xt(e){let t=!!e.result,n=e.loading&&!t?`loading`:e.error&&!t?`error`:!e.connected&&!t?`offline`:`content`;return Pe(a`
      <div class="plugins-toolbar">
        <input
          id="plugins-global-search"
          class="settings-input plugins-toolbar__search"
          name="plugins-search"
          type="search"
          autocomplete="off"
          aria-label=${p(`pluginsPage.searchLabel`)}
          .value=${ee(e.query)}
          placeholder=${p(`pluginsPage.searchPlaceholder`)}
          @input=${t=>e.onQueryChange(t.currentTarget.value)}
        />
        ${e.activeTab===`installed`&&n===`content`?ot(e):l}
        <button
          type="button"
          class="btn btn--sm btn--icon plugins-refresh"
          aria-label=${p(`pluginsPage.refresh`)}
          title=${p(`pluginsPage.refresh`)}
          ?disabled=${e.loading||!e.connected}
          @click=${e.onRefresh}
        >
          <span aria-hidden="true">${h.refresh}</span>
        </button>
      </div>

      ${e.mutationBlockedReason?a`<div class="plugins-readonly" role="note">
            <span aria-hidden="true">${h.alertTriangle}</span>
            <span>${e.mutationBlockedReason}</span>
          </div>`:l}
      ${e.error?a`<div class="plugins-page-error" role="alert">
            <span>${e.error}</span>
            <button type="button" class="btn btn--sm" @click=${e.onRefresh}>
              ${p(`pluginsPage.tryAgain`)}
            </button>
          </div>`:l}
      ${e.pageNotice?a`<div
            class="plugins-row-message plugins-row-message--${e.pageNotice.kind} plugins-page-notice"
            role=${e.pageNotice.kind===`error`?`alert`:`status`}
          >
            <span>${e.pageNotice.text}</span>
          </div>`:l}

      <wa-tab-panel
        id="plugins-hub-panel"
        class="plugins-panel"
        name=${e.activeTab}
        active
        aria-labelledby=${`plugins-tab-${e.activeTab}`}
      >
        ${n===`loading`?a`<div class="plugins-search-state" role="status">${p(`pluginsPage.loading`)}</div>`:n===`error`?l:n===`offline`?J(p(`pluginsPage.offlineTitle`),p(`pluginsPage.offlineBody`)):bt(e)}
      </wa-tab-panel>
      ${vt(e)}
    `,{wide:!0})}var Y,X,St=e((()=>{s(),ne(),te(),je(),Ke(),Ae(),Ie(),v(),m(),ue(),Qe(),d(),S(),Y=[`all`,`enabled`,`disabled`,`issues`],X=new Intl.NumberFormat(void 0,{notation:`compact`,maximumFractionDigits:1})}));function Z(e){return e instanceof Error?e.message:String(e)}function Ct(e,t){if(!e)return e;let n=e.plugins.findIndex(e=>e.id===t.id),r=[...e.plugins];return n>=0?r[n]=t:r.push(t),{...e,plugins:r}}function Q(e,t){let n=t.restartRequired?`pluginsPage.${e}Restart`:`pluginsPage.${e}Success`,r=`warnings`in t?t.warnings??[]:[];return[p(n,{name:t.plugin.name}),...r].filter(Boolean).join(`
`)}var $;e((()=>{r(),s(),re(),ke(),xe(),De(),Ce(),Te(),Xe(),Ne(),m(),de(),Ge(),d(),ce(),se(),Ye(),S(),St(),n(),$=class extends ae{constructor(...e){super(...e),this.client=null,this.connected=!1,this.loading=!1,this.result=null,this.error=null,this.configRefreshError=null,this.activeTab=`installed`,this.query=``,this.installedFilter=`all`,this.searchResults=null,this.searchLoading=!1,this.searchError=null,this.busy={},this.messages={},this.pendingRemoval={},this.detailPluginId=null,this.iconUrls={},this.pageNotice=null,this.mcpServers=null,this.mcpMessage=null,this.mcpBusy=!1,this.mcpFormOpen=!1,this.sourceGeneration=0,this.catalogRequestGeneration=0,this.configRequestGeneration=0,this.searchRequestGeneration=0,this.routeDataConsumed=!1,this.searchTimer=null,this.mutationToken=0,this.mutationTokens=new Map,this.iconMisses=new Set,this.iconRequests=new Map,this.iconAuthCandidates=[],this.subscriptions=new oe(this).effect(()=>this.context?.gateway,e=>{let t=this.gatewaySource!==void 0&&this.gatewaySource!==e;return this.gatewaySource=e,this.applyGatewaySnapshot(e.snapshot,t),e.subscribe(t=>{this.gatewaySource===e&&this.applyGatewaySnapshot(t,!1)})}).effect(()=>this.context?.runtimeConfig,e=>(this.syncMcpServers(),e.subscribe(()=>this.syncMcpServers()))),this.handleDocumentKeydown=e=>{e.key===`Escape`&&this.detailPluginId&&(this.detailPluginId=null,e.stopPropagation())}}willUpdate(e){e.has(`routeData`)&&this.applyRouteData()}connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0)}disconnectedCallback(){document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),this.subscriptions.clear(),this.clearSearchTimer(),this.invalidateRequests(),this.resetPluginIcons(),super.disconnectedCallback()}applyGatewaySnapshot(e,t){let n=e.connected!==this.connected,r=e.client!==this.client,i=Se({hello:e.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password}),a=i.length!==this.iconAuthCandidates.length||i.some((e,t)=>e!==this.iconAuthCandidates[t]);this.iconAuthCandidates=i;let o=(t||n||r||a)&&e.connected&&this.routeDataConsumed;(t||n||r||a)&&(this.invalidateRequests(),this.resetPluginIcons(),this.client=e.client,this.connected=e.connected,this.loading=!1,this.searchLoading=!1,this.busy={},this.mcpBusy=!1,this.configRefreshError=null,this.searchResults=null,this.searchError=null,(t||r)&&(this.result=null,this.error=null,this.messages={},this.pendingRemoval={},this.detailPluginId=null,this.pageNotice=null,this.mcpMessage=null)),o?this.refreshPage():this.ensureInitialData(),e.connected&&this.context?.runtimeConfig.ensureLoaded().then(()=>this.syncMcpServers()),(t||n||r||a)&&e.connected&&this.activeTab===`discover`&&this.scheduleSearch()}applyRouteData(){let e=this.routeData;if(this.routeDataConsumed=!0,!e){this.ensureInitialData();return}let t=e.initialTab??`installed`;t!==this.activeTab&&this.changeTab(t);let n=this.context.gateway.snapshot;if(e.gateway!==this.context.gateway||e.gatewaySnapshot!==n){this.ensureInitialData();return}this.client=n.client,this.connected=n.connected,this.loading=!1,this.replaceResult(e.result),this.error=e.error,this.ensureInitialData()}invalidateRequests(){this.sourceGeneration+=1,this.catalogRequestGeneration+=1,this.configRequestGeneration+=1,this.searchRequestGeneration+=1,this.clearSearchTimer(),this.mutationTokens.clear()}replaceResult(e,t=!1){t?this.reconcilePluginIcons(e):this.resetPluginIcons(),this.result=e,this.syncPluginIcons()}reconcilePluginIcons(e){let t=new Set((e?.plugins??[]).filter(e=>e.hasIcon&&!b(e.id)).map(e=>e.id)),n={...this.iconUrls},r=!1;for(let[e,i]of Object.entries(n))t.has(e)||(URL.revokeObjectURL(i),delete n[e],r=!0);r&&(this.iconUrls=n);for(let[e,n]of this.iconRequests)t.has(e)||(clearTimeout(n.timeout),n.controller.abort(),this.iconRequests.delete(e));for(let e of this.iconMisses)t.has(e)||this.iconMisses.delete(e)}resetPluginIcons(){for(let e of this.iconRequests.values())clearTimeout(e.timeout),e.controller.abort();for(let e of Object.values(this.iconUrls))URL.revokeObjectURL(e);this.iconRequests.clear(),this.iconMisses.clear(),this.iconUrls={}}syncPluginIcons(){for(let e of this.result?.plugins??[])!e.hasIcon||b(e.id)||this.iconUrls[e.id]||this.iconMisses.has(e.id)||this.iconRequests.has(e.id)||this.fetchPluginIcon(e.id)}fetchPluginIcon(e){let t=new AbortController,n=setTimeout(()=>t.abort(new DOMException(`plugin icon fetch timed out`,`TimeoutError`)),1e4),r={controller:t,timeout:n};this.iconRequests.set(e,r),Je({pluginId:e,basePath:this.context.basePath,gatewayUrl:this.context.gateway.connection.gatewayUrl,auth:{hello:this.context.gateway.snapshot.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password},signal:t.signal}).then(t=>{if(this.iconRequests.get(e)!==r||!this.isConnected){t&&URL.revokeObjectURL(t);return}t?this.iconUrls={...this.iconUrls,[e]:t}:this.iconMisses.add(e)}).catch(()=>{this.iconRequests.get(e)===r&&this.iconMisses.add(e)}).finally(()=>{clearTimeout(n),this.iconRequests.get(e)===r&&this.iconRequests.delete(e)})}handlePluginIconError(e){this.invalidatePluginIcon(e),this.iconMisses.add(e)}invalidatePluginIcon(e){let t=this.iconRequests.get(e);t&&(clearTimeout(t.timeout),t.controller.abort(),this.iconRequests.delete(e));let n=this.iconUrls[e];n&&URL.revokeObjectURL(n);let r={...this.iconUrls};delete r[e],this.iconUrls=r,this.iconMisses.delete(e)}clearSearchTimer(){this.searchTimer&&=(clearTimeout(this.searchTimer),null)}isCurrentSource(e,t){return this.isConnected&&this.connected&&this.client===e&&this.sourceGeneration===t}ensureInitialData(){!this.connected||!this.client||this.loading||this.result||this.error||this.routeData&&!this.routeDataConsumed||this.refreshCatalog()}async refreshCatalog(){let e=this.client;if(!e||!this.connected)return;let t=this.sourceGeneration,n=++this.catalogRequestGeneration,r=()=>this.isCurrentSource(e,t)&&n===this.catalogRequestGeneration;this.loading=!0,this.error=null;try{let t=await f(e);r()&&this.replaceResult(t)}catch(e){r()&&(this.error=Z(e))}finally{r()&&(this.loading=!1)}}async refreshRuntimeConfig(){let e=this.client;if(!e||!this.connected)return;let t=this.context.runtimeConfig,n=this.sourceGeneration,r=++this.configRequestGeneration,i=()=>this.isCurrentSource(e,n)&&r===this.configRequestGeneration;this.configRefreshError=null;let a=null;try{await t.refresh()}catch(e){a=Z(e)}if(!i())return;this.syncMcpServers();let o=a??t.state.lastError;this.configRefreshError=o?p(`pluginsPage.configRefreshFailed`,{error:o}):null}async refreshPage(){await Promise.all([this.refreshCatalog(),this.refreshRuntimeConfig()])}syncMcpServers(){let e=this.context?.runtimeConfig.state.configSnapshot;this.mcpServers=qe(pe(e))}selectHubTab(e){if(e===`installed`||e===`discover`){this.changeTab(e),this.context.navigate(`plugins`,e===`discover`?{search:`?tab=discover`}:void 0);return}this.context.navigate(e===`skills`?`skills`:`skill-workshop`)}changeTab(e){this.activeTab=e,this.clearSearchTimer(),this.searchRequestGeneration+=1,this.searchLoading=!1,this.searchResults=null,this.searchError=null,e===`discover`&&this.scheduleSearch()}changeQuery(e){this.query=e,this.clearSearchTimer(),this.searchRequestGeneration+=1,this.searchLoading=!1,this.searchResults=null,this.searchError=null,this.activeTab===`discover`&&this.scheduleSearch()}openClawHubSearch(e){this.query=e,this.changeTab(`discover`)}scheduleSearch(){let e=this.query.trim();e.length<2||!this.connected||!this.client||(this.searchTimer=setTimeout(()=>{this.searchTimer=null,this.searchClawHub(e)},300))}async searchClawHub(e){let t=this.client;if(!t||!this.connected||e.length<2)return;let n=this.sourceGeneration,r=++this.searchRequestGeneration,i=()=>this.isCurrentSource(t,n)&&r===this.searchRequestGeneration&&this.activeTab===`discover`&&this.query.trim()===e;this.searchLoading=!0,this.searchError=null,this.searchResults=null;try{let n=await le(t,e);i()&&(this.searchResults=n.results)}catch(e){i()&&(this.searchError=Z(e))}finally{i()&&(this.searchLoading=!1)}}mutationBlockedReason(){return this.connected?be(this.context.gateway.snapshot.hello?.auth??null)?this.result&&!this.result.mutationAllowed?p(`pluginsPage.changesDisabled`):null:p(`pluginsPage.adminRequired`):p(`pluginsPage.connectToChange`)}canMutate(){return!!this.result?.mutationAllowed&&this.mutationBlockedReason()===null}setBusy(e,t){let n={...this.busy};t?n[e]=!0:delete n[e],this.busy=n}setMessage(e,t){let n={...this.messages};t?n[e]=t:delete n[e],this.messages=n}setPendingRemoval(e,t){let n={...this.pendingRemoval};t?n[e]=!0:delete n[e],this.pendingRemoval=n}applyMutationResult(e){this.invalidatePluginIcon(e.plugin.id),this.replaceResult(Ct(this.result,e.plugin),!0)}async refreshAfterMutation(e,t){let n=++this.catalogRequestGeneration;this.loading=!1,this.error=null;let[r]=await Promise.allSettled([f(e),this.refreshRuntimeConfig()]);!this.isCurrentSource(e,t)||n!==this.catalogRequestGeneration||(r.status===`fulfilled`?this.replaceResult(r.value):this.error=Z(r.reason))}pageError(){let e=[this.error,this.configRefreshError].filter(e=>!!e);return e.length>0?e.join(` `):null}async install(e,t){let n=this.client;if(!n||!this.canMutate()||this.busy[e])return;let r=this.sourceGeneration,i=++this.mutationToken;this.mutationTokens.set(e,i);let a=()=>this.isCurrentSource(n,r)&&this.mutationTokens.get(e)===i;this.setBusy(e,!0),this.setMessage(e,null);try{let i=await _e(n,t);if(!a())return;this.applyMutationResult(i),this.setMessage(e,{kind:`success`,text:Q(`installed`,i)}),await this.refreshAfterMutation(n,r)}catch(n){if(!a())return;let r=fe(n),i=t.source===`clawhub`?t.packageName:null;i&&he(n)?this.setMessage(e,{kind:`error`,text:r?.warning??p(`pluginsPage.defaultRiskWarning`),acknowledge:{packageName:i,...r?.version?{version:r.version}:{}}}):this.setMessage(e,{kind:`error`,text:Z(n)})}finally{this.mutationTokens.get(e)===i&&(this.mutationTokens.delete(e),this.setBusy(e,!1))}}async updateEnabled(e,t,n=D(e)){let r=this.client;if(!r||!this.canMutate()||this.busy[n])return;let i=this.sourceGeneration,a=++this.mutationToken;this.mutationTokens.set(n,a);let o=()=>this.isCurrentSource(r,i)&&this.mutationTokens.get(n)===a;this.setBusy(n,!0),this.setMessage(n,null);try{let a=await me(r,e,t);if(!o())return;this.applyMutationResult(a),this.setMessage(n,{kind:`success`,text:Q(t?`enabled`:`disabled`,a)}),await this.refreshAfterMutation(r,i)}catch(e){o()&&this.setMessage(n,{kind:`error`,text:Z(e)})}finally{this.mutationTokens.get(n)===a&&(this.mutationTokens.delete(n),this.setBusy(n,!1))}}async uninstall(e,t){let n=this.client;if(!n||!this.canMutate()||this.busy[t])return;let r=this.sourceGeneration,i=++this.mutationToken;this.mutationTokens.set(t,i);let a=()=>this.isCurrentSource(n,r)&&this.mutationTokens.get(t)===i;this.setBusy(t,!0),this.setMessage(t,null);try{let i=await ge(n,e);if(!a())return;this.setPendingRemoval(t,!1),this.pageNotice={kind:`success`,text:[p(`pluginsPage.removedRestart`,{name:i.pluginId}),...i.warnings??[]].filter(Boolean).join(`
`)},await this.refreshAfterMutation(n,r)}catch(e){a()&&this.setMessage(t,{kind:`error`,text:Z(e)})}finally{this.mutationTokens.get(t)===i&&(this.mutationTokens.delete(t),this.setBusy(t,!1))}}async mutateMcpServers(e){if(!this.canMutate()||this.mcpBusy)return!1;let t=this.context.runtimeConfig;this.mcpBusy=!0,e.busyKey&&(this.setBusy(e.busyKey,!0),this.setMessage(e.busyKey,null)),this.mcpMessage=null;let n=t=>(e.busyKey?this.setMessage(e.busyKey,{kind:`error`,text:t}):this.mcpMessage={kind:`error`,text:t},!1);try{let r=await Ve(t,{buildPatch:e.buildPatch,note:e.note});return r.ok?(this.syncMcpServers(),this.mcpMessage={kind:`success`,text:e.successText},!0):n(r.error)}catch(e){return n(Z(e))}finally{this.mcpBusy=!1,e.busyKey&&this.setBusy(e.busyKey,!1)}}async addMcpServer(e){let t=e.name.trim();if(!We.test(t)){this.mcpMessage={kind:`error`,text:p(`mcpServers.nameInvalid`)};return}let n=Be(e.target,e.transport);if(!n){this.mcpMessage={kind:`error`,text:p(`mcpServers.targetInvalid`)};return}await this.mutateMcpServers({buildPatch:e=>E(e,t,n),note:`plugins: add MCP server ${t}`,successText:p(`mcpServers.addedSuccess`,{name:t})})&&(this.mcpFormOpen=!1)}async toggleMcpServer(e,t){await this.mutateMcpServers({buildPatch:n=>Ue(n,e,t),note:`plugins: ${t?`enable`:`disable`} MCP server ${e}`,successText:p(t?`mcpServers.enabledSuccess`:`mcpServers.disabledSuccess`,{name:e})})}async removeMcpServer(e){await this.mutateMcpServers({buildPatch:t=>ze(t,e),note:`plugins: remove MCP server ${e}`,successText:p(`mcpServers.removedSuccess`,{name:e})})}async addConnector(e){if(e.action.kind!==`mcp`)return;let t=e.action.mcp,n=O(e.id),r=t.followUp===`oauth`?p(`pluginsPage.connectorAddedOauth`,{name:e.name,command:`openclaw mcp login ${t.serverName}`}):t.followUp===`endpoint`?p(`pluginsPage.connectorAddedEndpoint`,{name:e.name}):p(`pluginsPage.connectorAddedReady`,{name:e.name});await this.mutateMcpServers({buildPatch:e=>E(e,t.serverName,structuredClone(t.config)),note:`plugins: add MCP connector ${t.serverName}`,successText:r,busyKey:n})&&(this.setMessage(n,{kind:`success`,text:r}),this.mcpMessage=null)}render(){let e=this.mutationBlockedReason();return a`
      <section class="content-header content-header--page plugins-content-header">
        <div>
          <h1 class="page-title">${Ee(`plugins`)}</h1>
        </div>
      </section>
      ${Me(a`
        <div class="plugins-hub-tabs-row">
          ${Ze({active:this.activeTab,installedCount:this.result?.plugins.filter(e=>e.installed).length??0,onSelect:e=>this.selectHubTab(e)})}
        </div>
        ${xt({connected:this.connected,loading:this.loading,result:this.result,error:this.pageError(),activeTab:this.activeTab,query:this.query,installedFilter:this.installedFilter,searchResults:this.searchResults,searchLoading:this.searchLoading,searchError:this.searchError,busy:this.busy,messages:this.messages,pendingRemoval:this.pendingRemoval,detailPluginId:this.detailPluginId,iconUrls:this.iconUrls,canMutate:this.canMutate(),mutationBlockedReason:e,pageNotice:this.pageNotice,mcpSettingsHref:we(`mcp`,this.context?.basePath??``),mcpServers:this.mcpServers,mcpMessage:this.mcpMessage,mcpBusy:this.mcpBusy,mcpFormOpen:this.mcpFormOpen,onQueryChange:e=>this.changeQuery(e),onFilterChange:e=>{this.installedFilter=e},onRefresh:()=>void this.refreshPage(),onIconError:e=>this.handlePluginIconError(e),onShowDetails:e=>{this.detailPluginId=e},onSetEnabled:(e,t,n)=>void this.updateEnabled(e,t,n),onInstall:(e,t)=>void this.install(e,t),onRequestUninstall:e=>this.setPendingRemoval(e,!0),onCancelUninstall:e=>this.setPendingRemoval(e,!1),onUninstall:(e,t)=>void this.uninstall(e,t),onAddConnector:e=>void this.addConnector(e),onSearchClawHub:e=>this.openClawHubSearch(e),onMcpToggle:(e,t)=>void this.toggleMcpServer(e,t),onMcpRemove:e=>void this.removeMcpServer(e),onMcpFormToggle:e=>{this.mcpFormOpen=e,e&&(this.mcpMessage=null)},onMcpAdd:e=>void this.addMcpServer(e)})}
      `)}
    `}},t([i({context:Oe,subscribe:!0})],$.prototype,`context`,void 0),t([o({attribute:!1})],$.prototype,`routeData`,void 0),t([c()],$.prototype,`client`,void 0),t([c()],$.prototype,`connected`,void 0),t([c()],$.prototype,`loading`,void 0),t([c()],$.prototype,`result`,void 0),t([c()],$.prototype,`error`,void 0),t([c()],$.prototype,`configRefreshError`,void 0),t([c()],$.prototype,`activeTab`,void 0),t([c()],$.prototype,`query`,void 0),t([c()],$.prototype,`installedFilter`,void 0),t([c()],$.prototype,`searchResults`,void 0),t([c()],$.prototype,`searchLoading`,void 0),t([c()],$.prototype,`searchError`,void 0),t([c()],$.prototype,`busy`,void 0),t([c()],$.prototype,`messages`,void 0),t([c()],$.prototype,`pendingRemoval`,void 0),t([c()],$.prototype,`detailPluginId`,void 0),t([c()],$.prototype,`iconUrls`,void 0),t([c()],$.prototype,`pageNotice`,void 0),t([c()],$.prototype,`mcpServers`,void 0),t([c()],$.prototype,`mcpMessage`,void 0),t([c()],$.prototype,`mcpBusy`,void 0),t([c()],$.prototype,`mcpFormOpen`,void 0),customElements.get(`openclaw-plugins-page`)||customElements.define(`openclaw-plugins-page`,$)}))();
//# sourceMappingURL=plugins-page-DLsRxA44.js.map