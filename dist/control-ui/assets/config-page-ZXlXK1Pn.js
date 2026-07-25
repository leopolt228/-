import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,s as n,u as r}from"./control-ui-foundation-43q8Lf_T.js";import{C as i,D as a,E as o,O as s,S as c,T as l,Ut as u,Wt as d,x as f}from"./control-ui-core-DF5v1q4q.js";import{dt as p,ft as m}from"./control-ui-foundation-DQl2NL7K.js";import{$ as h,D as g,G as _,J as v,U as y,X as b,k as ee,z as x}from"./lit-runtime-CE4wpvNA.js";import{M as te,P as ne,gt as re,pt as S}from"./control-ui-foundation-DFIFKu9N.js";import{Ci as C,Mi as w,Mr as T,Nr as E,Pi as D,Qi as O,ct as k,di as A,dt as ie,fi as ae,fn as j,ft as M,lt as oe,na as N,pn as se,pt as ce,ra as P,ut as le}from"./control-ui-core-Dx4utKSD.js";import{A as ue,B as F,C as de,Ct as fe,Gt as pe,M as me,N as he,S as ge,Tt as _e,U as ve,Wt as ye,_ as be,at as xe,b as Se,d as Ce,f as we,g as I,it as Te,j as L,p as Ee,u as De,v as Oe}from"./control-ui-core-6OhF3OIO.js";import{i as ke,l as Ae,o as R,s as je,t as z}from"./control-ui-core-CXeSrnoQ.js";import{Q as Me,at as B,ot as V}from"./control-ui-core-vPyynwls.js";import{a as Ne,c as Pe,l as Fe,n as Ie,s as Le,t as Re,u as ze}from"./control-ui-shared-Ca9fxTB8.js";import{c as Be,d as Ve,i as He,l as Ue,r as H,s as We,t as Ge,u as Ke}from"./lobster-pet-_RYNeWJF.js";import{n as qe,t as Je}from"./settings-workspace-BhCB-OeS.js";import{a as Ye,c as U,f as W,i as Xe,l as G,n as Ze,o as K,p as q,r as Qe,t as J,u as Y}from"./settings-ui-BJ5HJKwt.js";import{n as $e,r as et}from"./markdown-UmoHCmlv.js";import{a as tt,n as nt,t as rt}from"./config-form-n-iRU_E_.js";import{d as it,f as at,g as ot,m as st,n as ct,r as lt,u as ut}from"./realtime-talk-Dku-5be9.js";import{a as dt,i as ft}from"./fast-mode-Drf8gt-u.js";import{a as pt,t as mt}from"./thinking-DEtfIII5.js";import{a as ht,c as gt,i as _t,l as vt,n as yt,o as bt,r as xt,s as St,t as Ct,u as wt}from"./mcp-server-form-BsEHXbd1.js";import{t as Tt}from"./web-awesome-select-BN23D6HL.js";var Et=e((()=>{})),Dt=e((()=>{}));function Ot(e){return/^[A-Za-z0-9._:/-]+$/.test(e)?e:`'${e.replaceAll(`'`,`'\\''`)}'`}function kt(e){switch(e){case`verify-off`:return R(`mcpPage.tlsVerifyOff`);case`mtls`:return R(`mcpPage.mtls`);default:return null}}var X,At=e((()=>{p(),v(),x(),xe(),ve(),z(),k(),St(),D(),E(),V(),Ct(),J(),r(),X=class extends w{constructor(...e){super(...e),this.pluginsHref=``,this.rows=null,this.busy=!1,this.message=null,this.formOpen=!1,this.subscriptions=new T(this).effect(()=>this.context?.runtimeConfig,e=>(this.syncRows(),e.ensureLoaded().then(()=>this.syncRows()).catch(e=>{this.message={kind:`error`,text:e instanceof Error?e.message:String(e)}}),e.subscribe(()=>this.syncRows()))).effect(()=>this.context?.gateway,e=>e.subscribe(()=>this.requestUpdate()))}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}syncRows(){let e=this.context?.runtimeConfig.state.configSnapshot;this.rows=wt(oe(e))}mutationBlockedReason(){let e=this.context?.gateway;return e?.snapshot.connected?F(e.snapshot.hello?.auth??null)?null:R(`mcpServers.adminRequired`):R(`mcpServers.connectRequired`)}canMutate(){return this.context!==void 0&&this.mutationBlockedReason()===null}async mutate(e){if(!this.context||!this.canMutate()||this.busy)return!1;this.busy=!0,this.message=null;let t=await vt(this.context.runtimeConfig,e);return this.busy=!1,t.ok?(this.syncRows(),this.message={kind:`success`,text:e.successText},!0):(this.message={kind:`error`,text:t.error},!1)}async addServer(e){let t=e.name.trim();if(!xt.test(t)){this.message={kind:`error`,text:R(`mcpServers.nameInvalid`)};return}let n=gt(e.target,e.transport);if(!n){this.message={kind:`error`,text:R(`mcpServers.targetInvalid`)};return}await this.mutate({buildPatch:e=>_t(e,t,n),note:`mcp settings: add server ${t}`,successText:R(`mcpServers.addedSuccess`,{name:t})})&&(this.formOpen=!1)}async toggleServer(e,t){await this.mutate({buildPatch:n=>bt(n,e,t),note:`mcp settings: ${t?`enable`:`disable`} server ${e}`,successText:R(t?`mcpServers.enabledSuccess`:`mcpServers.disabledSuccess`,{name:e})})}async removeServer(e){await this.mutate({buildPatch:t=>ht(t,e),note:`mcp settings: remove server ${e}`,successText:R(`mcpServers.removedSuccess`,{name:e})})}renderRow(e){let t=`openclaw mcp ${e.auth===`oauth`?`login`:`probe`} ${Ot(e.name)}`,n=[e.transport,e.auth,e.toolFilter?R(`mcpPage.toolFilter`):null,e.parallel?R(`mcpPage.parallel`):null,kt(e.tls)].filter(e=>!!e),r=this.mutationBlockedReason(),i=this.busy||!this.canMutate();return h`
      <div class="settings-row mcp-server-row" data-mcp-name=${e.name}>
        <div class="settings-row__text">
          <span class="settings-row__title">${e.name}</span>
          <span class="settings-row__desc mcp-server-row__launch">
            ${e.target||R(`mcpServers.missingTransport`)}
          </span>
          <span class="settings-row__desc">${n.join(` · `)}</span>
        </div>
        <div class="settings-row__control">
          ${Y({kind:e.enabled?`ok`:`muted`,label:e.enabled?R(`common.enabled`):R(`common.disabled`)})}
          <code>${t}</code>
          <button
            type="button"
            class="btn btn--sm"
            title=${r??``}
            ?disabled=${i}
            @click=${()=>void this.toggleServer(e.name,!e.enabled)}
          >
            ${this.busy?R(`mcpServers.working`):e.enabled?R(`mcpServers.disable`):R(`mcpServers.enable`)}
          </button>
          <button
            type="button"
            class="btn btn--sm btn--icon mcp-server-remove"
            aria-label=${R(`mcpServers.removeNamed`,{name:e.name})}
            title=${r??R(`mcpServers.removeNamed`,{name:e.name})}
            ?disabled=${i}
            @click=${()=>void this.removeServer(e.name)}
          >
            ${B.trash}
          </button>
        </div>
      </div>
    `}render(){let e=this.mutationBlockedReason(),t=this.rows,n=t?t.length===0?Ze(R(`mcpPage.noServers`)):t.map(e=>this.renderRow(e)):h`<div class="mcp-server-loading" role="status">${R(`common.loading`)}</div>`;return h`
      <div class="mcp-server-list">
        ${U({title:R(`mcpPage.configuredServers`),description:h`
              ${R(`mcpPage.runtimeHint`)}
              <a href=${this.pluginsHref}>${R(`mcpPage.connectorsLink`)}</a>
            `,actions:h`
              <button
                type="button"
                class="btn btn--sm"
                title=${e??``}
                ?disabled=${this.busy||!this.canMutate()}
                @click=${()=>{this.formOpen=!this.formOpen,this.formOpen&&(this.message=null)}}
              >
                <span aria-hidden="true">${B.plus}</span>
                ${R(`mcpServers.add`)}
              </button>
            `},h`
            ${this.formOpen?yt({busy:this.busy,disabled:!this.canMutate(),blockedReason:e,onSubmit:e=>void this.addServer(e),onCancel:()=>{this.formOpen=!1}}):b}
            ${this.message?h`<div
                  class="mcp-server-message mcp-server-message--${this.message.kind}"
                  role=${this.message.kind===`error`?`alert`:`status`}
                >
                  ${this.message.text}
                </div>`:b}
            ${n}
          `)}
      </div>
    `}},t([m({context:Te,subscribe:!0})],X.prototype,`context`,void 0),t([_()],X.prototype,`pluginsHref`,void 0),t([y()],X.prototype,`rows`,void 0),t([y()],X.prototype,`busy`,void 0),t([y()],X.prototype,`message`,void 0),t([y()],X.prototype,`formOpen`,void 0),customElements.get(`openclaw-mcp-servers-card`)||customElements.define(`openclaw-mcp-servers-card`,X)}));function jt(e){let t=wt(e.configObject)??[],n=t.filter(e=>e.enabled).length,r=t.filter(e=>e.auth===`oauth`).length,i=t.filter(e=>e.toolFilter).length;return h`
    <section class="mcp-page">
      <div class="settings-page">
        <section class="settings-section mcp-page__summary">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${R(`mcpPage.servers`)}</h2>
          </div>
          <div class="settings-group">
            ${K({title:R(`mcpPage.servers`),control:q(t.length)})}
            ${K({title:R(`common.enabled`),control:q(n)})}
            ${K({title:R(`mcpPage.oauth`),control:q(r)})}
            ${K({title:R(`mcpPage.filtered`),control:q(i)})}
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${R(`mcpPage.operatorCommands`)}</h2>
          </div>
          <p class="settings-section__desc">${R(`mcpPage.operatorCommandsHint`)}</p>
          <div class="settings-group">
            <div class="settings-row settings-row--stacked">
              <div class="mcp-command-card__grid">
                <code>openclaw mcp status --verbose</code>
                <code>openclaw mcp doctor --probe</code>
                <code>openclaw mcp login &lt;name&gt;</code>
                <code>openclaw mcp reload</code>
              </div>
            </div>
          </div>
        </section>

        <openclaw-mcp-servers-card .pluginsHref=${e.pluginsHref}></openclaw-mcp-servers-card>
      </div>

      ${e.editor}
    </section>
  `}var Mt=e((()=>{v(),At(),J(),z(),St()}));function Nt(e,t){return h`
    <wa-select
      class="settings-select"
      value=${e}
      @change=${e=>t(e.currentTarget.value)}
    >
      <span slot="label" class="settings-control__sr-label">${R(`quickSettings.language`)}</span>
      ${je.map(t=>{let n=R(`languages.${t.replace(/-([a-zA-Z])/g,(e,t)=>t.toUpperCase())}`);return h`
          <wa-option value=${t} .label=${n} .selected=${t===e}>
            ${n}
          </wa-option>
        `})}
    </wa-select>
  `}var Pt=e((()=>{v(),Tt(),z()}));function Ft(e){switch(e){case`granted`:return{kind:`ok`,label:R(`configView.notifications.granted`)};case`denied`:return{kind:`danger`,label:R(`configView.notifications.denied`)};case`notDetermined`:return{kind:`accent`,label:R(`configView.notifications.notRequested`)};default:return{kind:`muted`,label:R(`configView.notifications.checking`)}}}function It(e){let t=e.nativeNotifications;if(t){let n=Ft(t.permission),r=t.permission===`notDetermined`?h`
            <button
              class="btn primary"
              @click=${()=>e.onNativeNotificationsRequestPermission?.()}
            >
              ${R(`configView.notifications.enable`)}
            </button>
          `:t.permission===`denied`?h`
              <button class="btn" @click=${()=>e.onNativeNotificationsRequestPermission?.()}>
                ${R(`configView.notifications.openSystemSettings`)}
              </button>
            `:t.permission===`granted`?h`
                <button class="btn primary" @click=${()=>e.onNativeNotificationsSendTest?.()}>
                  ${B.send} ${R(`configView.notifications.sendTest`)}
                </button>
              `:b;return h`
      <div class="settings-page">
        <section class="settings-section" id=${c.notifications}>
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${R(`configView.notifications.nativeTitle`)}</h2>
            <div class="settings-section__actions">${Y(n)}</div>
          </div>
          <p class="settings-section__desc">${R(`configView.notifications.nativeHint`)}</p>
          <div class="settings-group">
            ${K({title:R(`configView.notifications.permission`),control:q(n.label)})}
            ${r===b?b:h`
                  <div class="settings-row">
                    <div class="settings-row__control">${r}</div>
                  </div>
                `}
            ${t.permission===`denied`?K({title:R(`configView.notifications.blocked`),description:R(`configView.notifications.nativeBlockedHint`),control:Y({kind:`danger`,label:R(`configView.notifications.denied`)})}):b}
          </div>
        </section>
      </div>
    `}let n=e.webPush;if(!n)return h`
      <div class="settings-page">
        <section class="settings-section" id=${c.notifications}>
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${R(`configView.notifications.title`)}</h2>
            <div class="settings-section__actions">
              ${Y({kind:`muted`,label:R(`configView.notifications.unavailable`)})}
            </div>
          </div>
          <div class="settings-group">
            <div class="settings-row">
              <div class="settings-row__text">
                <span class="settings-row__desc">
                  ${R(`configView.notifications.unavailableHint`)}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;let r=n.permission===`granted`?R(`configView.notifications.granted`):n.permission===`denied`?R(`configView.notifications.denied`):n.permission==="default"?R(`configView.notifications.notRequested`):R(`configView.notifications.unsupported`),i=n.subscribed?R(`configView.notifications.subscribed`):R(`configView.notifications.notSubscribed`),a=n.supported?n.permission===`denied`?R(`configView.notifications.blocked`):n.subscribed?R(`configView.notifications.subscribed`):R(`configView.notifications.ready`):R(`configView.notifications.unsupported`),o=n.supported?n.permission===`denied`?`danger`:n.subscribed?`ok`:`accent`:`muted`,s=n.supported&&n.permission!==`denied`?n.subscribed?h`
            <button
              class="btn"
              ?disabled=${n.loading||!e.connected}
              @click=${()=>e.onWebPushUnsubscribe?.()}
            >
              ${B.x} ${R(`configView.notifications.unsubscribe`)}
            </button>
            <button
              class="btn primary"
              ?disabled=${n.loading||!e.connected}
              @click=${()=>e.onWebPushTest?.()}
            >
              ${B.send} ${R(`configView.notifications.sendTest`)}
            </button>
          `:h`
            <button
              class="btn primary"
              ?disabled=${n.loading||!e.connected}
              @click=${()=>e.onWebPushSubscribe?.()}
            >
              ${n.loading?B.loader:b}
              ${n.loading?R(`configView.notifications.subscribing`):R(`configView.notifications.enable`)}
            </button>
          `:b;return h`
    <div class="settings-page">
      <section class="settings-section" id=${c.notifications}>
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${R(`configView.notifications.title`)}</h2>
          <div class="settings-section__actions">
            ${Y({kind:o,label:a})}
          </div>
        </div>
        <p class="settings-section__desc">${R(`configView.notifications.hint`)}</p>
        <div class="settings-group">
          ${K({title:R(`configView.notifications.browserSupport`),control:q(n.supported?R(`configView.notifications.available`):R(`configView.notifications.notSupported`))})}
          ${K({title:R(`configView.notifications.permission`),control:q(r)})}
          ${K({title:R(`configView.notifications.status`),control:Y({kind:n.subscribed?`ok`:`muted`,label:i})})}
          ${s===b?b:h`
                <div class="settings-row">
                  <div class="settings-row__control">${s}</div>
                </div>
              `}
          ${n.permission===`denied`?K({title:R(`configView.notifications.blocked`),description:R(`configView.notifications.blockedHint`),control:Y({kind:`danger`,label:R(`configView.notifications.denied`)})}):b}
          ${n.error?h`
                <div class="settings-row">
                  <div class="settings-row__text">
                    <span class="cfg-field__error">${n.error}</span>
                  </div>
                </div>
              `:b}
        </div>
      </section>
    </div>
  `}var Lt=e((()=>{v(),V(),J(),z(),l()}));function Rt(e){return K({title:e.title,control:h`
      <select
        class="settings-select"
        ?data-settings-send-shortcut=${e.setting===`send-shortcut`}
        ?data-settings-follow-up-mode=${e.setting===`follow-up-mode`}
        ?data-settings-catalog-open-target=${e.setting===`catalog-open-target`}
        aria-label=${e.title}
        .value=${e.value}
        @change=${t=>e.onChange(t.currentTarget.value)}
      >
        ${e.options.map(t=>h`
            <option value=${t.value} ?selected=${e.value===t.value}>
              ${t.label}
            </option>
          `)}
      </select>
    `})}var zt=e((()=>{v(),J()}));function Bt(){return{rawRevealed:!1,rawDiffOpen:!1,envRevealed:!1,validityDismissed:!1,revealedSensitivePaths:new Set,lastCustomThemeImportFocusToken:null,lastConfigContextKey:null,lastFormModeForScroll:null}}function Vt(e){return yn[e]??yn.default}function Ht(e,t){if(!e||ze(e)!==`object`||!e.properties)return e;let n=t.include,r=t.exclude,i={};for(let t of Object.keys(e.properties)){if(n&&n.size>0&&!n.has(t)||r&&r.size>0&&r.has(t))continue;let a=e.properties[t];a&&(i[t]=a)}return{...e,properties:i}}function Ut(e){return!e||typeof e!=`object`||Array.isArray(e)?null:e}function Wt(e){return e?.length?e.join(``):``}function Gt(e,t,n,r,i,a){let o=Wt(n),s=Wt(r),c=e.schemaAnalysisCache;if(c&&c.schema===t&&c.includeKey===o&&c.excludeKey===s)return c.analysis;let l=nt(Ht(t,{include:i,exclude:a}));return e.schemaAnalysisCache={schema:t,includeKey:o,excludeKey:s,analysis:l},l}function Kt(e){return e.length>0?e.join(`.`):R(`configView.root`)}function qt(e,t){if(!e||!t)return[];let n=[],r=0;function i(e,t,r){n.length<Z&&n.push({path:e,from:t,to:r})}function a(e,t,n){if(e.length!==t.length||e.length>wn)return!0;for(let r=0;r<e.length;r+=1)if(s(e[r],t[r],n+1))return!0;return!1}function o(e,t,n){let r=Object.keys(e),i=Object.keys(t);if(r.length!==i.length)return!0;for(let i of r)if(!Object.hasOwn(t,i)||s(e[i],t[i],n+1))return!0;return!1}function s(e,t,n){return r+=1,r>Cn||n>Sn?!0:e===t?!1:typeof e==typeof t?typeof e!=`object`||!e||t===null?e!==t:Array.isArray(e)||Array.isArray(t)?Array.isArray(e)&&Array.isArray(t)?a(e,t,n+1):!0:o(e,t,n+1):!0}function c(e,t,o,s){if(r+=1,r>Cn||s>Sn||n.length>=Z||e===t)return;if(typeof e!=typeof t){i(o,e,t);return}if(typeof e!=`object`||!e||t===null){e!==t&&i(o,e,t);return}if(Array.isArray(e)||Array.isArray(t)){(Array.isArray(e)&&Array.isArray(t)&&a(e,t,s+1)||!Array.isArray(e)||!Array.isArray(t))&&i(o,e,t);return}let l=e,u=t,d=new Set([...Object.keys(l),...Object.keys(u)]);for(let e of d)c(l[e],u[e],[...o,e],s+1)}return c(e,t,[],0),n}function Jt(e,t,n){if(e.rawDiffCache?.original===t&&e.rawDiffCache.current===n)return e.rawDiffCache.diff;if(t.length>Tn||n.length>Tn)return e.rawDiffCache={original:t,current:n,diff:[]},e.rawDiffCache.diff;try{let r=M(t),i=M(n);if(!r||!i||typeof r!=`object`||typeof i!=`object`||Array.isArray(r)||Array.isArray(i))return e.rawDiffCache={original:t,current:n,diff:[]},[];let a=qt(r,i);return e.rawDiffCache={original:t,current:n,diff:a},a}catch{return ie()&&(e.rawDiffCache={original:t,current:n,diff:[]}),[]}}function Yt(e,t=40){if(Array.isArray(e))return R(e.length===1?`configView.itemCount`:`configView.itemCountPlural`,{count:String(e.length)});let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:ne(n,t-3)+`...`}function Xt(e,t){let n=e.split(`.`);return n.length===t.length?n.every((e,n)=>e===`*`||e===t[n]):!1}function Zt(e,t){return Object.entries(t).some(([t,n])=>!!n.sensitive&&Xt(t,e))}function Qt(e,t){for(let n=1;n<=e.length;n+=1){let r=e.slice(0,n),i=Kt(r);if((Ne(r,t)?.sensitive??!1)||Zt(r,t)||Pe(i))return!0}return!1}function $t(e,t,n,r){let i=Ie(t,e,n)>0;return!r&&t!=null&&(Qt(e,n)||i)?Re:Yt(t)}function en(e,t){return e===`custom`&&t!==`custom`?h`<span class="settings-theme-card__icon" aria-hidden="true"
      >${B.download}</span
    >`:h`
    <span class="settings-theme-card__palette" aria-hidden="true">
      <span class="settings-theme-card__chip settings-theme-card__chip--accent"></span>
      <span class="settings-theme-card__chip settings-theme-card__chip--accent-2"></span>
      <span class="settings-theme-card__chip settings-theme-card__chip--bg"></span>
    </span>
  `}function tn(e){return e.hasCustomTheme&&e.customThemeLabel?e.customThemeLabel:R(`configView.appearance.importedTheme`)}function nn(){(typeof requestAnimationFrame==`function`?requestAnimationFrame:e=>window.setTimeout(()=>e(0),0))(()=>{let e=globalThis.document?.querySelector(`[data-custom-theme-import-input]`);e&&(typeof e.scrollIntoView==`function`&&e.scrollIntoView({block:`center`,behavior:`smooth`}),e.focus(),e.select())})}function rn(e){let t=e.state;if(!t||!e.onSelect)return b;let n=t.selectedDeviceId.trim(),r=t.devices.some(e=>e.deviceId===n),i=[{label:e.systemDefaultLabel,value:``},...t.devices.map(e=>({label:e.label,value:e.deviceId})),...n&&!r?[{label:e.fallbackLabel(t.devices.length+1),value:n}]:[]],a=`${R(`common.refresh`)}: ${e.title}`,o=t.error?h`<span role="alert">${t.error}</span>`:!t.loading&&t.devices.length===0?e.emptyLabel:void 0;return K({title:e.title,description:o,control:h`
      <select
        class="settings-select"
        data-settings-microphone=${e.dataAttribute===`microphone`?``:b}
        data-settings-camera=${e.dataAttribute===`camera`?``:b}
        aria-label=${e.title}
        .value=${n}
        @change=${t=>e.onSelect?.(t.currentTarget.value)}
      >
        ${i.map(e=>h`
            <option value=${e.value} ?selected=${e.value===n}>
              ${e.label}
            </option>
          `)}
      </select>
      <button
        type="button"
        class="btn btn--sm btn--icon"
        aria-label=${a}
        ?disabled=${t.loading}
        @click=${()=>e.onRefresh?.()}
      >
        ${t.loading?B.loader:B.refresh}
      </button>
    `})}function an(e){return rn({state:e.microphone,title:R(`chat.composer.microphoneInput`),systemDefaultLabel:R(`chat.composer.systemDefaultMicrophone`),emptyLabel:R(`chat.composer.noMicrophones`),fallbackLabel:e=>R(`chat.composer.microphoneFallback`,{number:String(e)}),dataAttribute:`microphone`,onRefresh:e.onMicrophoneRefresh,onSelect:e.onMicrophoneSelect})}function on(e){return rn({state:e.camera,title:R(`chat.composer.cameraInput`),systemDefaultLabel:R(`chat.composer.systemDefaultCamera`),emptyLabel:R(`chat.composer.noCameras`),fallbackLabel:e=>R(`chat.composer.cameraFallback`,{number:String(e)}),dataAttribute:`camera`,onRefresh:e.onCameraRefresh,onSelect:e.onCameraSelect})}function sn(e){let t=e.chatFollowUpMode??`server`,n=e.serverQueueMode??R(`chat.followUpModeLoading`),r=e.chatFollowUpMode?R(`chat.followUpModeOverriding`,{mode:n}):R(`chat.followUpModeUsingServer`,{mode:n});return h`
    <section id=${f.chat} class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${R(`configView.chatPrefs.title`)}</h2>
      </div>
      <p class="settings-section__desc">
        ${R(`configView.chatPrefs.hint`)} ${R(`configView.syncedHint`)}
      </p>
      <div class="settings-group">
        ${Rt({title:R(`chat.sendShortcut`),value:e.chatSendShortcut,setting:`send-shortcut`,options:[{value:`enter`,label:R(`chat.sendShortcutEnter`)},{value:`modifier-enter`,label:R(`chat.sendShortcutModifierEnter`)}],onChange:t=>e.setChatSendShortcut(Se(t))})}
        ${K({title:R(`chat.followUpMode`),description:r,control:h`
            <select
              class="settings-select"
              data-settings-follow-up-mode
              aria-label=${R(`chat.followUpMode`)}
              .value=${t}
              @change=${t=>{let n=t.currentTarget.value;e.setChatFollowUpMode(n===`server`?void 0:Oe(n))}}
            >
              <option value="server" ?selected=${t===`server`}>
                ${R(`chat.followUpModeServer`,{mode:n})}
              </option>
              <option value="steer" ?selected=${t===`steer`}>
                ${R(`chat.followUpModeSteer`)}
              </option>
              <option value="queue" ?selected=${t===`queue`}>
                ${R(`chat.followUpModeQueue`)}
              </option>
            </select>
            ${e.chatFollowUpMode?h`
                  <button
                    type="button"
                    class="btn btn--sm"
                    @click=${()=>e.setChatFollowUpMode(void 0)}
                  >
                    ${R(`chat.followUpModeReset`)}
                  </button>
                `:b}
          `})}
        ${Rt({title:R(`chat.catalogOpenTarget`),value:e.catalogOpenTarget,setting:`catalog-open-target`,options:[{value:`viewer`,label:R(`chat.catalogOpenTargetViewer`)},{value:`terminal`,label:R(`chat.catalogOpenTargetTerminal`)}],onChange:t=>e.setCatalogOpenTarget(be(t))})}
        ${an(e)} ${on(e)}
        ${e.setComposerHoldToRecord?W({title:R(`chat.composer.holdToRecordSetting`),description:R(`chat.composer.holdToRecordSettingDescription`),checked:e.composerHoldToRecord!==!1,onChange:e.setComposerHoldToRecord}):b}
      </div>
    </section>
  `}function cn(e){if(!e.setLobsterPetVisits||!e.setLobsterPetSounds)return b;let t=e.lobsterPetVisits===!0,n=e.lobsterPetSounds===!0;return h`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${R(`quickSettings.appearance.lobsterdex`)}</h2>
      </div>
      <div class="settings-group">
        ${W({title:R(`quickSettings.appearance.lobsterVisits`),description:R(t?`quickSettings.appearance.lobsterVisitsOn`:`quickSettings.appearance.lobsterVisitsOff`),checked:t,onChange:t=>e.setLobsterPetVisits?.(t)})}
        ${W({title:R(`quickSettings.appearance.lobsterSounds`),description:R(n?`quickSettings.appearance.lobsterSoundsOn`:`quickSettings.appearance.lobsterSoundsOff`),checked:n,onChange:t=>e.setLobsterPetSounds?.(t)})}
        ${K({title:R(`quickSettings.appearance.lobsterdex`),description:R(`quickSettings.appearance.lobsterdexSeen`,{seen:String(H.filter(e=>Be().has(e.id)).length),total:String(H.length)}),stacked:!0,control:h`
            <div class="lobsterdex">
              ${H.map(e=>{let t=Ue().get(e.id),n=t!==void 0,r=n?t.firstSeenAt===null?t.name??e.id:R(`quickSettings.appearance.lobsterdexFirstVisited`,{name:t.name??e.id,date:new Date(t.firstSeenAt).toLocaleDateString()}):`?`;return h`
                  <span
                    class="lobsterdex__mini lobster-pet--palette-${e.id} ${n?``:`lobsterdex__mini--unseen`}"
                    style="--lob-shell:${e.shell};--lob-claw:${e.claw}"
                    title=${r}
                  >
                    ${We(He(e),{standalone:!0})}
                  </span>
                `})}
            </div>
          `})}
      </div>
    </section>
  `}function ln(e){return h`
    <section id=${f.sidebar} class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${R(`configView.sidebarPrefs.title`)}</h2>
      </div>
      <p class="settings-section__desc">
        ${R(`configView.sidebarPrefs.hint`)} ${R(`configView.syncedHint`)}
      </p>
      <div class="settings-group">
        ${W({title:R(`configView.sidebarPrefs.liveActivity`),description:R(`configView.sidebarPrefs.liveActivityHint`),checked:e.sidebarLiveActivity,onChange:e.setSidebarLiveActivity})}
      </div>
    </section>
  `}function un(e){let t=e.viewState,n=e.hasCustomTheme||e.customThemeImportExpanded===!0;n&&e.customThemeImportFocusToken!=null&&e.customThemeImportFocusToken!==t.lastCustomThemeImportFocusToken&&(t.lastCustomThemeImportFocusToken=e.customThemeImportFocusToken,nn());let r=tn(e),i=[...En.map(e=>({id:e.id,label:R(e.labelKey),description:R(e.descriptionKey)})),{id:`custom`,label:e.hasCustomTheme?r:R(`configView.appearance.import`),description:e.hasCustomTheme?R(`configView.appearance.importedFrom`,{name:r}):R(`configView.appearance.importHint`)}];return h`
    <div class="settings-page">
      <section id=${f.theme} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${R(`configView.appearance.theme`)}</h2>
        </div>
        <p class="settings-section__desc">
          ${R(`configView.appearance.chooseTheme`)} ${R(`configView.syncedHint`)}
        </p>
        <div class="settings-group">
          <div class="settings-row settings-row--stacked">
            <div class="settings-theme-grid">
              ${i.map(t=>h`
                  <button
                    class="settings-theme-card settings-theme-card--${t.id} ${t.id===e.theme?`settings-theme-card--active`:``}"
                    title=${t.description}
                    @click=${n=>{if(t.id===`custom`&&!e.hasCustomTheme){e.onOpenCustomThemeImport?.();return}if(t.id!==e.theme){let r={element:n.currentTarget??void 0};e.setTheme(t.id,r)}}}
                  >
                    ${en(t.id,e.theme)}
                    <span class="settings-theme-card__label">${t.label}</span>
                    ${t.id===e.theme?h`<span class="settings-theme-card__check" aria-hidden="true"
                          >${B.check}</span
                        >`:b}
                  </button>
                `)}
            </div>
          </div>
          <div class="settings-row settings-row--stacked">
            ${n?h`
                  <div class="settings-theme-import">
                    <div class="settings-theme-import__copy">
                      <div class="settings-theme-import__title">
                        ${R(`configView.appearance.importFromTweakcn`)}
                      </div>
                      <p class="settings-theme-import__hint">
                        ${R(`configView.appearance.tweakcnInstructions`)}
                      </p>
                    </div>
                    <a
                      class="settings-theme-import__external"
                      href="https://tweakcn.com/editor/theme"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      ${R(`configView.appearance.browseTweakcn`)} ${B.externalLink}
                    </a>
                    <label class="settings-theme-import__field">
                      <span class="settings-theme-import__label"
                        >${R(`configView.appearance.themeLink`)}</span
                      >
                      <input
                        class="settings-theme-import__input"
                        data-custom-theme-import-input
                        type="text"
                        spellcheck="false"
                        placeholder="https://tweakcn.com/editor/theme?theme=... or amethyst-haze"
                        .value=${e.customThemeImportUrl}
                        @input=${t=>e.onCustomThemeImportUrlChange(t.currentTarget.value)}
                      />
                    </label>
                    <div class="settings-theme-import__actions">
                      <button
                        class="btn btn--sm primary"
                        ?disabled=${e.customThemeImportBusy||e.customThemeImportUrl.trim().length===0}
                        @click=${e.onImportCustomTheme}
                      >
                        ${e.customThemeImportBusy?R(`common.importing`):e.hasCustomTheme?R(`configView.appearance.replace`,{name:r}):R(`configView.appearance.importTheme`)}
                      </button>
                      ${e.hasCustomTheme?h`
                            <button class="btn btn--sm danger" @click=${e.onClearCustomTheme}>
                              ${R(`configView.appearance.clear`,{name:r})}
                            </button>
                          `:b}
                    </div>
                    ${e.hasCustomTheme?h`
                          <div class="settings-theme-import__meta">
                            <span class="settings-theme-import__meta-label"
                              >${R(`configView.appearance.loaded`)}</span
                            >
                            <span class="settings-theme-import__meta-value"
                              >${r} · ${e.customThemeSourceUrl??`tweakcn`}</span
                            >
                          </div>
                        `:b}
                    ${e.customThemeImportMessage?h`
                          <div
                            class="settings-theme-import__message settings-theme-import__message--${e.customThemeImportMessage.kind}"
                          >
                            ${e.customThemeImportMessage.text}
                          </div>
                        `:b}
                  </div>
                `:h`
                  <p class="settings-theme-import__inline-hint">
                    ${R(`configView.appearance.inlineHintBefore`)}
                    <strong>${R(`configView.appearance.import`)}</strong>
                    ${R(`configView.appearance.inlineHintAfter`)}
                  </p>
                `}
          </div>
        </div>
      </section>

      <section id=${f.textSize} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${R(`configView.appearance.textSize`)}</h2>
        </div>
        <div class="settings-group">
          <div class="settings-row settings-row--stacked">
            <div class="settings-text-scale">
              <div class="settings-text-scale__options">
                ${we.map(t=>h`
                    <button
                      type="button"
                      class="settings-text-scale__btn ${t===e.textScale?`active`:``}"
                      @click=${()=>e.setTextScale(t)}
                    >
                      <span class="settings-text-scale__sample">${R(vn[t])}</span>
                      <span class="settings-text-scale__label">${t}%</span>
                    </button>
                  `)}
              </div>
            </div>
          </div>
        </div>
      </section>

      ${ln(e)} ${cn(e)}
      ${sn(e)}

      <section id=${f.connection} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${R(`configView.connection.title`)}</h2>
        </div>
        <div class="settings-group">
          ${K({title:R(`configView.connection.gateway`),control:q(e.gatewayUrl||`-`,{mono:!0})})}
          ${K({title:R(`configView.connection.status`),control:Y({kind:e.connected?`ok`:`muted`,label:e.connected?R(`common.connected`):R(`common.offline`)})})}
          ${e.assistantName?K({title:R(`configView.connection.assistant`),control:q(e.assistantName)}):b}
        </div>
      </section>
    </div>
  `}function dn(e){return e.needsApply?h`
    <div class="config-apply-banner" role="status">
      <span class="config-apply-banner__text">${R(`configView.applyBannerText`)}</span>
      <button
        class="btn btn--sm"
        ?disabled=${e.busy||e.applying||!e.connected}
        aria-busy=${e.applying?`true`:`false`}
        @click=${e.onApply}
      >
        ${Dn(e.applying,R(`configView.applyBannerAction`),R(`configView.applying`))}
      </button>
    </div>
  `:b}function fn(e){switch(e.status){case`saving`:return Y({kind:`accent`,label:R(`configView.autoSaveSaving`)});case`saved`:return Y({kind:`ok`,label:R(`configView.autoSaveSaved`)});case`error`:return h`
        ${Y({kind:`danger`,label:R(`configView.autoSaveFailed`)})}
        <button class="btn btn--sm" @click=${e.onRetry}>${R(`configView.retry`)}</button>
      `;case`conflict`:return h`
        ${Y({kind:`danger`,label:R(`configView.autoSaveConflict`)})}
        <button class="btn btn--sm" @click=${e.onReload}>${R(`common.reload`)}</button>
      `;default:return b}}function pn(e){e.rawRevealed=!1,e.rawDiffOpen=!1,e.envRevealed=!1,e.validityDismissed=!1,e.revealedSensitivePaths.clear(),e.lastCustomThemeImportFocusToken=null,e.rawDiffCache=void 0}function mn(e){let t=e.includeSections?.join(``)??``,n=e.excludeSections?.join(``)??``;return[e.configPath??``,e.gatewayUrl,e.navRootLabel??``,t,n].join(``)}function hn(e,t){let n=Fe(t);return n?e.revealedSensitivePaths.has(n):!1}function gn(e,t){let n=Fe(t);n&&(e.revealedSensitivePaths.has(n)?e.revealedSensitivePaths.delete(n):e.revealedSensitivePaths.add(n))}function _n(e){let t=e.viewState,n=e.showModeToggle??!1,r=e.showRootTab??!0,i=e.valid==null?`unknown`:e.valid?`valid`:`invalid`,a=e.includeVirtualSections??!0,o=e.includeSections?.length?new Set(e.includeSections):null,s=e.excludeSections?.length?new Set(e.excludeSections):null,c=Gt(t,Ut(e.schema),e.includeSections,e.excludeSections,o,s),l=c.schema?c.unsupportedPaths.length>0:!1,u=e.rawAvailable??!0,d=!!e.rawDraftPending&&u,f=n&&u?e.formMode:`form`,p=d?`raw`:f,m=e.onViewStateChange,g=e=>{queueMicrotask(()=>{let t=[(e instanceof Element?e:null)?.closest(`.config-lead`)?.parentElement?.querySelector(`.config-content`)??globalThis.document?.querySelector(`.config-content`),globalThis.document?.querySelector(`.shell--settings .content`)];for(let e of t)e&&(typeof e.scrollTo==`function`?e.scrollTo({top:0,left:0,behavior:`auto`}):(e.scrollTop=0,e.scrollLeft=0))})};t.lastFormModeForScroll!==null&&t.lastFormModeForScroll!==p&&g(null),t.lastFormModeForScroll=p;let _=mn(e);t.lastConfigContextKey!==_&&(pn(t),t.lastConfigContextKey=_);let v=t.envRevealed,y=c.schema?.properties??{},x=new Set([`__appearance__`,`__notifications__`]),te=e=>a&&x.has(e)&&(e===`__appearance__`||o?.has(e)===!0),ne=e=>R(`configView.sections.${e===`__appearance__`?`theme`:e===`__notifications__`?`notifications`:e}`),re=bn.map(e=>({id:e.id,label:R(`configView.categories.${e.id}`),sections:e.sections.filter(e=>(te(e)||e in y)&&(!o||o.has(e))&&(!s||!s.has(e))).map(e=>({key:e,label:ne(e)}))})).filter(e=>e.sections.length>0),S=Object.keys(y).filter(e=>!xn.has(e)).map(e=>({key:e,label:e.charAt(0).toUpperCase()+e.slice(1)})),C=S.length>0?{id:`other`,label:R(`configView.categories.other`),sections:S}:null,w=[...r?[{key:null,label:e.navRootLabel??R(`nav.settings`)}]:[],...[...re,...C?[C]:[]].flatMap(e=>e.sections.map(e=>({key:e.key,label:e.label})))],T=e.settingsLayout??`tabs`,E=[...re,...C?[C]:[]];function D(){return h`
      <div class="config-accordion-nav">
        ${E.map(t=>h`
            <div class="config-accordion-group">
              <button
                class="config-accordion-group__header ${e.activeSection!=null&&t.sections.some(t=>t.key===e.activeSection)?`config-accordion-group__header--active`:``}"
                @click=${n=>{let r=t.sections[0]?.key??null,i=t.sections.some(t=>t.key===e.activeSection);e.onSectionChange(i?null:r),g(n.currentTarget)}}
              >
                <span class="config-accordion-group__icon">
                  ${Vt(t.sections[0]?.key??`default`)}
                </span>
                <span>${t.label}</span>
                <svg
                  class="config-accordion-group__chevron ${t.sections.some(t=>t.key===e.activeSection)?`config-accordion-group__chevron--open`:``}"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  width="14"
                  height="14"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              ${t.sections.some(t=>t.key===e.activeSection)?h`
                    <div class="config-accordion-group__items">
                      ${t.sections.map(t=>h`
                          <button
                            class="config-accordion-group__item ${e.activeSection===t.key?`config-accordion-group__item--active`:``}"
                            @click=${n=>{e.onSectionChange(t.key),g(n.currentTarget)}}
                          >
                            <span class="config-accordion-group__item-icon">
                              ${Vt(t.key)}
                            </span>
                            ${t.label}
                          </button>
                        `)}
                    </div>
                  `:b}
            </div>
          `)}
      </div>
    `}let O=p===`raw`&&e.raw!==e.originalRaw;(!O||p!==`raw`)&&t.rawDiffOpen&&(t.rawDiffOpen=!1),(!O||p!==`raw`||!t.rawDiffOpen)&&(t.rawDiffCache=void 0);let k=p===`raw`&&O&&t.rawDiffOpen?Jt(t,e.originalRaw,e.raw):[];p===`raw`&&O&&t.rawDiffOpen&&!ie()&&ce().then(()=>m()).catch(()=>void 0);let A=e.loading||e.saving||e.applying||e.updating,ae=e.connected&&!A&&O,j=fn({status:e.autoSaveStatus,onRetry:e.onSave,onReload:e.onRawDiscard}),M=a&&p===`form`&&e.activeSection===null&&!!o?.has(`__appearance__`),oe=O&&p===`raw`?h`
          <details
            class="config-diff"
            ?open=${t.rawDiffOpen}
            @toggle=${e=>{let n=e.target;t.rawDiffOpen!==n.open&&(t.rawDiffOpen=n.open,n.open||(t.rawDiffCache=void 0),m())}}
          >
            <summary class="config-diff__summary">
              <span>${R(`configView.viewPendingChangesRaw`)}</span>
              <svg
                class="config-diff__chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${k.length>0?k.map(n=>h`
                      <div class="config-diff__item">
                        <div class="config-diff__path">${Kt(n.path)}</div>
                        <div class="config-diff__values">
                          <span class="config-diff__from"
                            >${$t(n.path,n.from,e.uiHints,t.rawRevealed)}</span
                          >
                          <span class="config-diff__arrow">→</span>
                          <span class="config-diff__to"
                            >${$t(n.path,n.to,e.uiHints,t.rawRevealed)}</span
                          >
                        </div>
                      </div>
                    `):h`<div class="config-diff__item">${R(`configView.rawDiffUnavailable`)}</div>`}
            </div>
          </details>
        `:b,N=T!==`accordion`&&w.length>1,se=N?G({value:e.activeSection??`root`,options:w.map(e=>({value:e.key??`root`,label:e.label})),ariaLabel:R(`common.settingsSections`),onChange:(t,n)=>{e.onSectionChange(t===`root`?null:t),g(n)}}):b,P=n||N||j!==b,le=dn({needsApply:e.needsApply,applying:e.applying,busy:e.saving||e.loading||e.updating||e.autoSaveStatus===`saving`||O,connected:e.connected,onApply:e.onApply}),ue=i===`invalid`&&!t.validityDismissed,F=P||T===`accordion`||le!==b||ue,de=h`
    <div class="config-lead">
      ${P?h`
            <div class="config-toolbar">
              ${n?h`
                    <div class="config-mode-toggle">
                      <button
                        class="config-mode-toggle__btn ${p===`form`?`active`:``}"
                        ?disabled=${e.schemaLoading||!e.schema||d}
                        title=${d?R(`configView.rawDraftPendingFormTitle`):l?R(`configView.formUnsafeTitle`):``}
                        @click=${()=>e.onFormModeChange(`form`)}
                      >
                        ${R(`configView.form`)}
                      </button>
                      <button
                        class="config-mode-toggle__btn ${p===`raw`?`active`:``}"
                        ?disabled=${!u}
                        title=${R(u?`configView.rawTitle`:`configView.rawUnavailableTitle`)}
                        @click=${()=>e.onFormModeChange(`raw`)}
                      >
                        ${R(`configView.raw`)}
                      </button>
                    </div>
                  `:b}
              ${se}
              <div class="config-toolbar__status" role="status" aria-live="polite">
                ${j}
              </div>
            </div>
          `:b}
      ${T===`accordion`?D():b} ${le}
      ${ue?h`
            <div class="config-validity-warning">
              <svg
                class="config-validity-warning__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="16"
                height="16"
              >
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                ></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span class="config-validity-warning__text">${R(`configView.invalidConfig`)}</span>
              <button
                class="btn btn--sm"
                @click=${()=>{t.validityDismissed=!0,m()}}
              >
                ${R(`configView.dismissWarning`)}
              </button>
            </div>
          `:b}
    </div>
  `;return h`
    ${F?de:b}
    <!-- Form content -->
    <div
      id="config-section-panel"
      class="config-content"
      role="region"
      aria-label=${R(`common.settingsSections`)}
    >
      ${e.activeSection===`__appearance__`?a?un(e):b:e.activeSection===`__notifications__`?a?It(e):b:p===`form`?h`
                ${l&&n&&u?h`<div class="callout info">${R(`configView.formUnsafe`)}</div>`:b}
                ${M?un(e):b}
                ${e.schemaLoading?h`
                      <div class="config-loading">
                        <div class="config-loading__spinner"></div>
                        <span>${R(`configView.loadingSchema`)}</span>
                      </div>
                    `:tt({schema:c.schema,uiHints:e.uiHints,value:e.formValue,embedded:e.embeddedEditor===!0,rawAvailable:u,disabled:A||!e.formValue,unsupportedPaths:c.unsupportedPaths,onPatch:e.onFormPatch,activeSection:e.activeSection,activeSubsection:null,sectionActions:e.activeSection===`env`?h`
                              <button
                                class="btn btn--sm ${v?`active`:``}"
                                aria-pressed=${v?`true`:`false`}
                                title=${R(v?`configView.hideEnvValues`:`configView.revealEnvValues`)}
                                @click=${()=>{t.envRevealed=!t.envRevealed,m()}}
                              >
                                ${v?B.eyeOff:B.eye}
                                ${R(`configView.peek`)}
                              </button>
                            `:void 0,revealSensitive:e.activeSection===`env`?v:!1,isSensitivePathRevealed:e=>hn(t,e),onToggleSensitivePath:e=>{gn(t,e),m()}})}
              `:(()=>{let n=Ie(e.formValue,[],e.uiHints),r=n>0&&!t.rawRevealed;return h`
                  <div class="settings-page">
                    ${oe}
                    <!-- Raw editor: one group surface owning file-level operations. -->
                    <div class="settings-group">
                      <div class="settings-row settings-row--stacked">
                        <div class="config-raw-actions">
                          ${e.onOpenFile?h`
                                <button class="btn btn--sm" @click=${e.onOpenFile}>
                                  ${B.fileText} ${R(`configView.open`)}
                                </button>
                              `:b}
                          <button
                            class="btn btn--sm"
                            ?disabled=${A||!O}
                            @click=${e.onRawDiscard}
                          >
                            ${R(`configView.rawDiscard`)}
                          </button>
                          <button
                            class="btn btn--sm primary"
                            ?disabled=${!ae}
                            aria-busy=${e.saving?`true`:`false`}
                            @click=${e.onSave}
                          >
                            ${Dn(e.saving,R(`common.save`),R(`common.saving`))}
                          </button>
                        </div>
                        <div class="field config-raw-field">
                          <span style="display:flex;align-items:center;gap:8px;">
                            ${R(`configView.rawConfig`)}
                            ${n>0?h`
                                  <span class="settings-count"
                                    >${R(n===1?`configView.secretCount`:`configView.secretCountPlural`,{count:String(n)})}
                                    ${R(r?`configView.redacted`:`configView.visible`)}</span
                                  >
                                  <openclaw-tooltip
                                    .content=${R(r?`configView.revealSensitive`:`configView.hideSensitive`)}
                                  >
                                    <button
                                      class="btn btn--icon config-raw-toggle ${r?``:`active`}"
                                      aria-label=${R(`configView.toggleRawRedaction`)}
                                      aria-pressed=${!r}
                                      @click=${()=>{t.rawRevealed=!t.rawRevealed,m()}}
                                    >
                                      ${r?B.eyeOff:B.eye}
                                    </button>
                                  </openclaw-tooltip>
                                `:b}
                          </span>
                          ${r?h`
                                <div class="callout info" style="margin-top: 12px">
                                  ${R(n===1?`configView.sensitiveHidden`:`configView.sensitiveHiddenPlural`,{count:String(n)})}
                                </div>
                              `:h`
                                <textarea
                                  placeholder=${R(`configView.rawConfig`)}
                                  .value=${e.raw}
                                  ?disabled=${A}
                                  @input=${t=>{e.onRawChange(t.target.value)}}
                                ></textarea>
                              `}
                        </div>
                      </div>
                    </div>
                  </div>
                `})()}
      ${e.issues.length>0?h`<div class="callout danger" style="margin-top: 12px;">
            <pre class="code-block">
${ee($e(JSON.stringify(e.issues,null,2)))}</pre>
          </div>`:b}
    </div>
  `}var vn,yn,bn,xn,Sn,Cn,Z,wn,Tn,En,Dn,On=e((()=>{Ve(),te(),v(),g(),Ee(),Le(),rt(),Me(),V(),Ke(),Ge(),et(),J(),z(),le(),Lt(),zt(),l(),ce().catch(()=>void 0),vn={90:`configView.textSizes.small`,100:`configView.textSizes.default`,110:`configView.textSizes.large`,125:`configView.textSizes.xl`,140:`configView.textSizes.xxl`},yn={all:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,env:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M15 4V2"></path>
      <path d="M15 16v-2"></path>
      <path d="M8 9h2"></path>
      <path d="M20 9h2"></path>
      <path d="M17.8 11.8 19 13"></path>
      <path d="M15 9h0"></path>
      <path d="M17.8 6.2 19 5"></path>
      <path d="m3 21 9-9"></path>
      <path d="M12.2 6.2 11 5"></path>
    </svg>
  `,meta:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2v6"></path>
      <path d="m4.93 10.93 4.24 4.24"></path>
      <path d="M2 12h6"></path>
      <path d="m4.93 13.07 4.24-4.24"></path>
      <path d="M12 22v-6"></path>
      <path d="m19.07 13.07-4.24-4.24"></path>
      <path d="M22 12h-6"></path>
      <path d="m19.07 10.93-4.24 4.24"></path>
    </svg>
  `,diagnostics:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  `,cli:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,secrets:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"
      ></path>
    </svg>
  `,acp:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,mcp:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,__appearance__:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `,__notifications__:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  `,default:h`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},bn=[{id:`core`,sections:[`env`,`auth`,`update`,`meta`,`logging`,`diagnostics`,`cli`,`secrets`]},{id:`ai`,sections:[`agents`,`models`,`skills`,`tools`,`memory`,`session`]},{id:`communication`,sections:[`channels`,`messages`,`broadcast`,`__notifications__`,`talk`,`audio`]},{id:`security`,sections:[`security`,`approvals`]},{id:`automation`,sections:[`commands`,`hooks`,`bindings`,`cron`,`plugins`]},{id:`infrastructure`,sections:[`gateway`,`web`,`browser`,`nodeHost`,`canvasHost`,`discovery`,`media`,`acp`,`mcp`]},{id:`appearance`,sections:[`__appearance__`,`ui`,`wizard`]}],xn=new Set(bn.flatMap(e=>e.sections)),Sn=64,Cn=2e4,Z=1e3,wn=2e3,Tn=2e5,En=[{id:`claw`,labelKey:`configView.themes.claw.label`,descriptionKey:`configView.themes.claw.description`},{id:`knot`,labelKey:`configView.themes.knot.label`,descriptionKey:`configView.themes.knot.description`},{id:`dash`,labelKey:`configView.themes.dash.label`,descriptionKey:`configView.themes.dash.description`}],Dn=(e,t,n)=>e?h`<span class="config-action-spinner" aria-hidden="true">${B.loader}</span
        >${n}`:t}));function kn(e,t,n){return h`<div id=${e}>${U(t,n)}</div>`}function An(e){return e===`auto`?`auto`:e===`on`}function jn(e){return e.configLoading===!0||e.configSaving===!0||e.configApplying===!0||e.configUpdating===!0}function Mn(e){return U({title:R(`nav.settingsGeneral`)},[K({title:R(`quickSettings.language`),description:R(`configView.syncedHint`),control:Nt(e.locale,e.onLocaleChange)})])}function Nn(e){let t=ft(e.fastMode),n=jn(e);return kn(i.model,{title:R(`quickSettings.model.title`)},[Xe({title:R(`quickSettings.model.model`),control:q(e.currentModel||`default`,{mono:!0}),onClick:()=>e.onModelChange?.()}),K({title:R(`quickSettings.model.thinking`),control:G({value:e.thinkingLevel,options:Gn.map(e=>({value:e,label:R(`quickSettings.model.thinkingLevels.${e}`)})),disabled:n,onChange:t=>e.onThinkingChange?.(t)})}),K({title:R(`quickSettings.model.fastMode`),control:G({value:t,options:[{value:`auto`,label:R(`quickSettings.model.fastModes.auto`)},{value:`on`,label:R(`quickSettings.model.fastModes.fast`)},{value:`off`,label:R(`quickSettings.model.fastModes.standard`)}],disabled:n,onChange:n=>{n!==t&&e.onFastModeChange?.(An(n))}})})])}function Pn(e){return e>=.92?`critical`:e>=.75?`warn`:`ok`}function Fn(e,t){let n=Math.min(Math.max(t,0),1),r=Math.round(n*100);return h`
    <div
      class="config-host__meter"
      role="meter"
      aria-label=${R(`quickSettings.system.usage`,{label:e})}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${r}
    >
      <div
        class="config-host__meter-fill config-host__meter-fill--${Pn(n)}"
        style="--config-host-meter-fill: ${r}%"
      ></div>
    </div>
  `}function In(e){return h`
    <div class="config-host__stat" title=${e.title??``}>
      <div class="config-host__stat-label">${e.label}</div>
      <div class="config-host__stat-value">
        ${e.value}${e.unit?h` <span class="config-host__stat-unit">${e.unit}</span>`:b}
      </div>
      ${e.usedFraction==null?b:Fn(e.label,e.usedFraction)}
      ${e.detail?h`<div class="config-host__stat-detail">${e.detail}</div>`:b}
    </div>
  `}function Ln(e,t){if(!(e==null||t==null||e<=0))return(e-t)/e}function Rn(e){return`${Math.round(Math.min(Math.max(e,0),1)*100)}%`}function zn(e){let t=e.loadAverage?.[0],n=e.loadAverage?R(`quickSettings.system.loadAverage`,{values:e.loadAverage.map(e=>e.toFixed(1)).join(` · `)}):void 0,r=[e.cpuModel,n].filter(Boolean).join(` · `)||void 0,i=R(e.cpuCount===1?`quickSettings.system.core`:`quickSettings.system.cores`,{count:String(e.cpuCount)}),a=t==null?{label:R(`quickSettings.system.cpu`),value:i,detail:e.cpuModel,title:r}:{label:R(`quickSettings.system.cpu`),value:t.toFixed(1),unit:R(`quickSettings.system.load`),detail:i,usedFraction:e.cpuCount>0?t/e.cpuCount:void 0,title:r},o=Ln(e.memoryTotalBytes,e.memoryFreeBytes),s=[a,{label:R(`quickSettings.system.memory`),value:o==null?`—`:Rn(o),unit:o==null?void 0:R(`quickSettings.system.used`),detail:R(`quickSettings.system.freeOf`,{free:N(e.memoryFreeBytes),total:N(e.memoryTotalBytes)}),usedFraction:o}],c=Ln(e.diskTotalBytes,e.diskAvailableBytes);return c!=null&&s.push({label:R(`quickSettings.system.disk`),value:Rn(c),unit:R(`quickSettings.system.used`),detail:R(`quickSettings.system.freeOf`,{free:N(e.diskAvailableBytes),total:N(e.diskTotalBytes)}),usedFraction:c,title:e.diskPath}),s}function Bn(){return[{label:R(`quickSettings.system.cpu`),value:`—`},{label:R(`quickSettings.system.memory`),value:`—`},{label:R(`quickSettings.system.disk`),value:`—`}]}function Vn(e){if(e.systemInfoUnavailable)return b;let t=e.systemInfo,r=t&&t.hostname!==t.machineName?t.hostname:void 0,a=t?.lanAddress?`${t.lanAddress}${t.port==null?``:`:${t.port}`}`:void 0,o=t?zn(t):Bn();return kn(i.system,{title:R(`quickSettings.system.gatewayHost`),actions:t?Y({kind:`ok`,label:R(`quickSettings.system.up`,{duration:n(t.uptimeMs)})}):void 0},h`
      <div class="config-host">
        <div class="config-host__identity">
          <div class="config-host__name" title=${r??``}>
            ${t?.machineName??`—`}
          </div>
          <div class="config-host__meta">
            ${t?`${t.osLabel} · ${t.arch}`:`—`}
          </div>
          <div class="config-host__meta">
            ${t?R(`quickSettings.system.runtime`,{version:t.nodeVersion,pid:String(t.pid)}):`—`}
          </div>
          ${a?h`<code class="config-host__address">${a}</code>`:b}
        </div>
        <div class="config-host__stats">${o.map(In)}</div>
      </div>
    `)}function Hn(e){let t=[e.assistantName,e.version?`v${e.version}`:``].filter(Boolean).join(` · `);return Qe(K({title:Y({kind:e.connected?`ok`:`muted`,label:e.connected?R(`common.connected`):R(`common.offline`)}),control:t?q(t):b}))}function Un(e){let t=fn({status:e.configAutoSaveStatus??`idle`,onRetry:()=>e.onRetrySaveConfig?.(),onReload:()=>e.onDiscardConfig?.()});return t===b?b:h`
    <div class="config-toolbar__status" role="status" aria-live="polite">${t}</div>
  `}function Wn(e){return Ye(h`
    ${Un(e)}
    ${dn({needsApply:e.configNeedsApply===!0,applying:e.configApplying===!0,busy:e.configSaving===!0||e.configLoading===!0||e.configUpdating===!0||e.configAutoSaveStatus===`saving`||e.configRawDraftPending===!0,connected:e.connected,onApply:()=>e.onApplyConfig?.()})}
    ${Nn(e)} ${Mn(e)} ${Vn(e)}
    ${Hn(e)}
  `)}var Gn,Kn=e((()=>{v(),dt(),J(),z(),P(),pt(),C(),Pt(),l(),On(),Gn=mt.filter(e=>e!==`minimal`)}));function qn(e){let{gatewayAuth:t,execPolicy:n,deviceAuth:r,browserEnabled:i,toolProfile:a}=e.security,o=a.trim()||`full`,s=O.map(e=>({value:e.id,label:R(e.labelKey)}));return s.some(e=>e.value===o)||s.push({value:o,label:o}),U({title:R(`quickSettings.security.title`)},[K({title:R(`quickSettings.security.gatewayAuth`),control:Y({kind:t===`none`?`warn`:t===`unknown`?`muted`:`ok`,label:t})}),K({title:R(`quickSettings.security.execPolicy`),control:q(n)}),W({title:R(`quickSettings.security.browserEnabled`),checked:i,disabled:e.configBusy,onChange:t=>e.onBrowserEnabledToggle?.(t)}),K({title:R(`quickSettings.security.toolProfile`),stacked:!0,control:G({value:o,options:s,disabled:e.configBusy,onChange:t=>e.onToolProfileChange?.(t)})}),K({title:R(`quickSettings.security.deviceAuth`),control:Y({kind:r?`ok`:`warn`,label:R(r?`common.enabled`:`common.disabled`)})}),K({title:R(`nodes.pairing.title`),control:h`
        <button
          class="btn"
          title=${e.canPairDevice?``:R(`nodes.pairing.adminRequired`)}
          ?disabled=${!e.canPairDevice}
          @click=${e.onPairMobile}
        >
          ${B.smartphone} ${R(`nodes.pairing.button`)}
        </button>
      `})])}function Jn(e){return h`
    <section class="security-page">
      <div class="settings-page">${qn(e)}</div>
      ${e.editor}
    </section>
  `}var Yn=e((()=>{v(),V(),J(),z(),P()}));function Xn(e){return e instanceof ye&&e.gatewayCode===`INVALID_REQUEST`&&e.message.includes(`unknown method: system.info`)}function Zn(e){return e?.features?.methods?.includes(`system.info`)===!0}function Q(e){switch(e){case`communications`:return{activeSection:`messages`,activeSubsection:null};case`appearance`:return{activeSection:`__appearance__`,activeSubsection:null};case`notifications`:return{activeSection:`__notifications__`,activeSubsection:null};case`security`:return{activeSection:`security`,activeSubsection:null};case`automation`:return{activeSection:`commands`,activeSubsection:null};case`mcp`:return{activeSection:`mcp`,activeSubsection:null};case`infrastructure`:return{activeSection:`gateway`,activeSubsection:null};case`ai-agents`:return{activeSection:`agents`,activeSubsection:null};case`config`:case`advanced`:return{activeSection:null,activeSubsection:null}}throw Error(`Unknown config page`)}function Qn(e,t,n){let r=a(e)??null;return(e===`config`||e===`advanced`)&&t&&o.has(t)?{activeSection:null,activeSubsection:null}:r&&(!t||!r.includes(t))?Q(e):{activeSection:t,activeSubsection:n}}function $n(e,t){let n=new URLSearchParams(t).get(`section`);return n?Qn(e,n,null):Q(e)}function er(e){return R(e===`config`?`nav.settingsGeneral`:`tabs.${rr[e]}`)}function tr(e){let t=S(e?.configForm)??S(e);if(!t)return{gatewayAuth:`unknown`,execPolicy:`unknown`,deviceAuth:!1,browserEnabled:!0,toolProfile:`full`};let n=S(t.gateway),r=S(n?.auth),i=S(t.tools)??{},a=S(i.exec)??{},o=S(t.browser),s=S(n?.controlUi),c=`unknown`;r&&(c=(typeof r.mode==`string`?r.mode.trim():``)||(r.password?`password`:r.token?`token`:r.trustedProxy?`trusted-proxy`:`none`));let l=i.profile,u=a.security;return{gatewayAuth:c,execPolicy:typeof u==`string`&&u.trim()?u.trim():`allowlist`,deviceAuth:s?.dangerouslyDisableDeviceAuth!==!0,browserEnabled:o?.enabled!==!1,toolProfile:typeof l==`string`&&l.trim()?l.trim():`full`}}function nr(e){typeof document>`u`||document.documentElement.style.setProperty(`--control-ui-text-scale`,(ge(e)/100).toFixed(2))}var rr,ir,ar,$;e((()=>{Et(),Dt(),p(),re(),v(),x(),pe(),fe(),xe(),he(),ve(),Ee(),De(),ue(),Je(),z(),st(),A(),D(),se(),E(),at(),ct(),s(),Mt(),Kn(),d(),Yn(),On(),r(),rr={config:`config`,communications:`communications`,appearance:`appearance`,notifications:`notifications`,security:`security`,automation:`automation`,mcp:`mcp`,infrastructure:`infrastructure`,"ai-agents":`aiAgents`,advanced:`advanced`},ir={"communications:__notifications__":{routeId:`notifications`,keepSection:!1},"automation:approvals":{routeId:`security`,keepSection:!0}},ar=1e4,$=class extends w{constructor(...e){super(...e),this.pageId=`config`,this.routeData=null,this.settings=I(),this.systemInfo=null,this.systemInfoUnavailable=!1,this.microphoneDevices=[],this.microphoneLoading=!1,this.microphoneError=null,this.microphoneLoaded=!1,this.cameraDevices=[],this.cameraLoading=!1,this.cameraError=null,this.cameraLoaded=!1,this.cameraSelectionRequest=0,this.formModes={config:`form`,communications:`form`,appearance:`form`,notifications:`form`,security:`form`,automation:`form`,mcp:`form`,infrastructure:`form`,"ai-agents":`form`,advanced:`form`},this.selections={config:Q(`config`),communications:Q(`communications`),appearance:Q(`appearance`),notifications:Q(`notifications`),security:Q(`security`),automation:Q(`automation`),mcp:Q(`mcp`),infrastructure:Q(`infrastructure`),"ai-agents":Q(`ai-agents`),advanced:Q(`advanced`)},this.customThemeImportUrl=``,this.customThemeImportBusy=!1,this.customThemeImportMessage=null,this.customThemeImportExpanded=!1,this.customThemeImportFocusToken=0,this.customThemeImportSelectOnSuccess=!1,this.configViewState=Bt(),this.runtimeConfigSource=null,this.systemInfoGatewaySource=null,this.systemInfoClient=null,this.systemInfoLoading=!1,this.systemInfoRequestId=0,this.systemInfoPolling=new j(this,ar,()=>{this.loadSystemInfo()},!1),this.pendingRouteTargetId=null,this.subscriptions=new T(this).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t),e=>this.synchronizeRuntimeConfig(e)).watch(()=>this.context?.overlays,(e,t)=>e.subscribe(t)).watch(()=>this.context?.config,(e,t)=>e.subscribe(t)).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.synchronizeSystemInfoGateway(e)).watch(()=>this.context?.nativeNotifications??void 0,(e,t)=>e.subscribe(t)).watch(()=>this.context?.webPush,(e,t)=>e.subscribe(t)).watch(()=>this.context?.theme,(e,t)=>e.subscribe(t),()=>{this.settings=I()})}connectedCallback(){super.connectedCallback(),this.settings=I(),this.syncRouteData()}disconnectedCallback(){this.systemInfoPolling.stop(),this.invalidateSystemInfoRequest(),this.runtimeConfigSource=null,this.resetConfigViewState(),this.systemInfoGatewaySource=null,this.systemInfoClient=null,this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){(e.has(`pageId`)||e.has(`routeData`))&&this.syncRouteData()}updated(e){e.has(`pageId`)&&e.get(`pageId`)!==void 0&&this.invalidateSystemInfoRequest(),this.syncSystemInfoPolling(),this.scrollToPendingRouteTarget(),this.pageId===`appearance`&&!this.microphoneLoaded&&(this.microphoneLoaded=!0,this.refreshMicrophones(!1)),this.pageId===`appearance`&&!this.cameraLoaded&&(this.cameraLoaded=!0,this.refreshCameras(!1))}async refreshMicrophones(e){this.microphoneLoading=!0,this.microphoneError=null;try{let t=await it(e);this.microphoneDevices=t.devices,this.microphoneError=t.warning}catch(e){this.microphoneError=e instanceof Error?e.message:String(e)}finally{this.microphoneLoading=!1}}async refreshCameras(e){this.cameraLoading=!0,this.cameraError=null;try{let t=await ut(e);this.cameraDevices=t.devices,this.cameraError=t.warning}catch(e){this.cameraError=e instanceof Error?e.message:String(e)}finally{this.cameraLoading=!1}}syncRouteData(){let e=this.routeData?this.routeData.section:new URLSearchParams(globalThis.location?.search??``).get(`section`);if(e){let t=ir[`${this.pageId}:${e}`];if(t){this.context?.navigate(t.routeId,{search:t.keepSection?`?section=${encodeURIComponent(e)}`:``,hash:globalThis.location?.hash??``});return}}let t=this.routeData?Qn(this.pageId,this.routeData.section,null):$n(this.pageId,globalThis.location?.search??``);if(this.pageId===`config`&&t.activeSection){this.context?.navigate(`advanced`,{search:`?section=${encodeURIComponent(t.activeSection)}`,hash:globalThis.location?.hash??``});return}this.selections={...this.selections,[this.pageId]:t};let n=this.routeData?.targetBlockId??u(globalThis.location?.hash??``);this.pendingRouteTargetId=n}scrollToPendingRouteTarget(){let e=this.pendingRouteTargetId;if(!e)return;let t=[...this.renderRoot.querySelectorAll(`[id]`)].find(t=>t.id===e);t&&(t.scrollIntoView?.({behavior:`smooth`,block:`start`}),this.pendingRouteTargetId=null)}isSystemInfoVisible(){return this.pageId===`config`}synchronizeRuntimeConfig(e){e!==this.runtimeConfigSource&&(this.runtimeConfigSource=e,this.resetConfigViewState());let t=e.state;if(!t.configSnapshot&&!t.configLoading){e.ensureLoaded().then(()=>this.runtimeConfigSource===e?e.ensureSchemaLoaded():void 0).catch(()=>void 0);return}!t.configSchema&&!t.configSchemaLoading&&e.ensureSchemaLoaded().catch(()=>void 0)}synchronizeSystemInfoGateway(e){e!==this.systemInfoGatewaySource&&(this.systemInfoPolling.stop(),this.invalidateSystemInfoRequest(),this.systemInfoGatewaySource=e,this.resetConfigViewState(),this.systemInfoClient=null,this.systemInfo=null,this.systemInfoUnavailable=!1),this.handleSystemInfoGatewaySnapshot(e.snapshot)}resetConfigViewState(){this.configViewState=Bt()}handleSystemInfoGatewaySnapshot(e){let t=e.client!==this.systemInfoClient,n=Zn(e.hello);this.systemInfoClient=e.client,t?(this.invalidateSystemInfoRequest(),this.systemInfo=null,this.systemInfoUnavailable=!1):e.connected||(this.invalidateSystemInfoRequest(),this.systemInfo=null),e.connected&&e.hello&&(this.systemInfoUnavailable=!n,n||(this.invalidateSystemInfoRequest(),this.systemInfo=null)),this.syncSystemInfoPolling()}syncSystemInfoPolling(){let e=this.context.gateway.snapshot;if(!(this.isConnected&&this.isSystemInfoVisible()&&!this.systemInfoUnavailable&&e.connected&&Zn(e.hello)&&e.client!=null)){this.systemInfoPolling.stop();return}this.systemInfoPolling.start()&&this.loadSystemInfo()}invalidateSystemInfoRequest(){this.systemInfoRequestId+=1,this.systemInfoLoading=!1}isCurrentSystemInfoRequest(e,t,n){let r=n.snapshot;return this.isConnected&&this.isSystemInfoVisible()&&e===this.systemInfoRequestId&&this.systemInfoGatewaySource===n&&this.context.gateway===n&&r.connected&&r.client===t}async loadSystemInfo(){let e=this.systemInfoGatewaySource;if(!e||e!==this.context.gateway)return;let t=e.snapshot,n=t.client;if(!t.connected||!n||!this.isSystemInfoVisible()||this.systemInfoUnavailable||this.systemInfoLoading)return;let r=++this.systemInfoRequestId;this.systemInfoLoading=!0;try{let t=await n.request(`system.info`,{});if(!this.isCurrentSystemInfoRequest(r,n,e))return;this.systemInfo=t}catch(t){if(!this.isCurrentSystemInfoRequest(r,n,e))return;(ae(t)||Xn(t))&&(this.systemInfo=null,this.systemInfoUnavailable=!0,this.systemInfoPolling.stop())}finally{this.isCurrentSystemInfoRequest(r,n,e)&&(this.systemInfoLoading=!1)}}navigate(e){this.context.navigate(e)}setFormMode(e){this.formModes={...this.formModes,[this.pageId]:e}}setActiveSection(e){this.selections={...this.selections,[this.pageId]:{activeSection:e,activeSubsection:null}}}setActiveSubsection(e){this.selections={...this.selections,[this.pageId]:{...this.selections[this.pageId],activeSubsection:e}}}applySettings(e){this.settings=de({theme:e.theme,themeMode:e.themeMode,customTheme:e.customTheme,textScale:e.textScale,sidebarLiveActivity:e.sidebarLiveActivity,chatSendShortcut:e.chatSendShortcut,chatFollowUpMode:e.chatFollowUpMode,catalogOpenTarget:e.catalogOpenTarget,realtimeTalkInputDeviceId:e.realtimeTalkInputDeviceId,realtimeTalkVideoDeviceId:e.realtimeTalkVideoDeviceId,composerHoldToRecord:e.composerHoldToRecord,lobsterPetVisits:e.lobsterPetVisits,lobsterPetSounds:e.lobsterPetSounds}),nr(this.settings.textScale),this.context.theme.refresh()}setLocale(e){this.settings=de({locale:e}),ke.setLocale(e)}setTheme(e,t){let n=L(this.settings.theme,this.settings.themeMode),r={...this.settings,theme:e};Ce({currentTheme:n,nextTheme:L(r.theme,r.themeMode),context:t,applyTheme:()=>this.applySettings(r)})}setThemeMode(e,t){let n=L(this.settings.theme,this.settings.themeMode),r={...this.settings,themeMode:e};Ce({currentTheme:n,nextTheme:L(r.theme,r.themeMode),context:t,applyTheme:()=>this.applySettings(r)})}setSetting(e,t){this.applySettings({...this.settings,[e]:t})}selectMicrophone(e){this.applySettings({...this.settings,realtimeTalkInputDeviceId:e.trim()||void 0})}async selectCamera(e){let t=++this.cameraSelectionRequest,n=e.trim()||void 0;this.cameraError=null,this.applySettings({...this.settings,realtimeTalkVideoDeviceId:n});try{await lt(n)}catch(e){t===this.cameraSelectionRequest&&(this.cameraError=e instanceof Error?e.message:String(e))}}openCustomThemeImport(){this.customThemeImportExpanded=!0,this.customThemeImportFocusToken+=1,this.settings.customTheme||(this.customThemeImportSelectOnSuccess=!0)}async importCustomTheme(){if(!this.customThemeImportBusy){this.customThemeImportExpanded=!0,this.customThemeImportBusy=!0,this.customThemeImportMessage=null;try{let e=await me(this.customThemeImportUrl),t=!this.settings.customTheme||this.customThemeImportSelectOnSuccess;this.applySettings({...this.settings,customTheme:e,theme:t?`custom`:this.settings.theme}),this.customThemeImportUrl=``,this.customThemeImportSelectOnSuccess=!1,this.customThemeImportMessage={kind:`success`,text:R(`configPage.themeImported`,{name:e.label})}}catch(e){this.customThemeImportMessage={kind:`error`,text:e instanceof Error?e.message:String(e)}}finally{this.customThemeImportBusy=!1}}}clearCustomTheme(){this.customThemeImportExpanded=!0,this.customThemeImportSelectOnSuccess=!1,this.applySettings({...this.settings,theme:this.settings.theme===`custom`?`claw`:this.settings.theme,customTheme:void 0}),this.customThemeImportMessage={kind:`success`,text:R(`configPage.themeRemoved`)}}includeSections(){return a(this.pageId)}isUpdateBusy(){let e=this.context.overlays.snapshot;return e.updateRunning||e.updateReconciliationPending}renderAdvancedConfig(e){let t=this.context.runtimeConfig,n=t.state,r=this.includeSections(),i=this.pageId===`advanced`?[...o]:void 0,a=Qn(this.pageId,this.selections[this.pageId].activeSection,this.selections[this.pageId].activeSubsection),s=this.pageId===`mcp`?`mcp`:a.activeSection,c=this.pageId===`mcp`?null:a.activeSubsection,l={raw:n.configRaw,originalRaw:n.configRawOriginal,valid:n.configValid,issues:n.configIssues,loading:n.configLoading,saving:n.configSaving,applying:n.configApplying,updating:this.isUpdateBusy(),autoSaveStatus:n.configAutoSaveStatus,needsApply:n.configNeedsApply,connected:n.connected,schema:n.configSchema,schemaLoading:n.configSchemaLoading,uiHints:n.configUiHints,formMode:this.formModes[this.pageId],rawDraftPending:n.configFormMode===`raw`&&n.configFormDirty,viewState:this.configViewState,rawAvailable:!!(n.configSnapshot?.config||n.configForm||n.configRaw),showModeToggle:this.pageId===`advanced`,formValue:n.configForm,originalValue:n.configFormOriginal,activeSection:s,activeSubsection:c,onRawChange:e=>t.setRaw(e),onFormModeChange:e=>this.setFormMode(e),onViewStateChange:()=>this.requestUpdate(),onFormPatch:(e,n)=>t.patchForm(e,n),onSectionChange:e=>this.setActiveSection(e),onSubsectionChange:e=>this.setActiveSubsection(e),onSave:()=>void t.save(),onApply:()=>void t.apply(),onRawDiscard:()=>void t.discardDraft(),onOpenFile:()=>void t.openFile(),version:this.context.config.current.serverVersion??this.context.gateway.snapshot.hello?.server?.version??``,theme:this.settings.theme,themeMode:this.settings.themeMode,setTheme:(e,t)=>this.setTheme(e,t),setThemeMode:(e,t)=>this.setThemeMode(e,t),hasCustomTheme:!!this.settings.customTheme,customThemeLabel:this.settings.customTheme?.label??null,customThemeSourceUrl:this.settings.customTheme?.sourceUrl??null,customThemeImportUrl:this.customThemeImportUrl,customThemeImportBusy:this.customThemeImportBusy,customThemeImportMessage:this.customThemeImportMessage,customThemeImportExpanded:this.customThemeImportExpanded,customThemeImportFocusToken:this.customThemeImportFocusToken,onCustomThemeImportUrlChange:e=>{this.customThemeImportUrl=e,this.customThemeImportMessage?.kind===`error`&&(this.customThemeImportMessage=null)},onImportCustomTheme:()=>void this.importCustomTheme(),onClearCustomTheme:()=>this.clearCustomTheme(),onOpenCustomThemeImport:()=>this.openCustomThemeImport(),textScale:this.settings.textScale??100,setTextScale:e=>this.setSetting(`textScale`,ge(e)),sidebarLiveActivity:this.settings.sidebarLiveActivity!==!1,setSidebarLiveActivity:e=>this.setSetting(`sidebarLiveActivity`,e),lobsterPetVisits:this.settings.lobsterPetVisits!==!1,setLobsterPetVisits:e=>this.applySettings({...this.settings,lobsterPetVisits:e}),lobsterPetSounds:this.settings.lobsterPetSounds===!0,setLobsterPetSounds:e=>this.applySettings({...this.settings,lobsterPetSounds:e}),chatSendShortcut:Se(this.settings.chatSendShortcut),setChatSendShortcut:e=>this.setSetting(`chatSendShortcut`,e),chatFollowUpMode:this.settings.chatFollowUpMode,serverQueueMode:n.configSnapshot?ot(n.configSnapshot.runtimeConfig,{configNeedsApply:n.configNeedsApply}):void 0,setChatFollowUpMode:e=>this.setSetting(`chatFollowUpMode`,e),catalogOpenTarget:be(this.settings.catalogOpenTarget),setCatalogOpenTarget:e=>this.setSetting(`catalogOpenTarget`,e),microphone:{devices:this.microphoneDevices,selectedDeviceId:this.settings.realtimeTalkInputDeviceId??``,loading:this.microphoneLoading,error:this.microphoneError},composerHoldToRecord:this.settings.composerHoldToRecord!==!1,setComposerHoldToRecord:e=>this.setSetting(`composerHoldToRecord`,e),onMicrophoneRefresh:()=>void this.refreshMicrophones(!0),onMicrophoneSelect:e=>this.selectMicrophone(e),camera:{devices:this.cameraDevices,selectedDeviceId:this.settings.realtimeTalkVideoDeviceId??``,loading:this.cameraLoading,error:this.cameraError},onCameraRefresh:()=>void this.refreshCameras(!0),onCameraSelect:e=>void this.selectCamera(e),gatewayUrl:this.context.gateway.connection.gatewayUrl,assistantName:this.context.config.current.assistantIdentity.name,configPath:n.configSnapshot?.path??null,navRootLabel:this.pageId===`advanced`?void 0:er(this.pageId),showRootTab:!r?.length,includeSections:r?[...r]:void 0,excludeSections:i,includeVirtualSections:this.pageId===`appearance`||this.pageId===`notifications`,settingsLayout:this.pageId===`advanced`?`accordion`:void 0,nativeNotifications:this.context.nativeNotifications?.snapshot,onNativeNotificationsRequestPermission:()=>this.context.nativeNotifications?.requestPermission(),onNativeNotificationsSendTest:()=>this.context.nativeNotifications?.sendTest(),webPush:this.context.webPush.snapshot,onWebPushSubscribe:()=>void this.context.webPush.enable(),onWebPushUnsubscribe:()=>void this.context.webPush.disable(),onWebPushTest:()=>void this.context.webPush.sendTest()};if(this.pageId===`mcp`)return jt({configObject:e,pluginsHref:_e(`plugins`,this.context.basePath),editor:_n({...l,activeSection:`mcp`,activeSubsection:null,showModeToggle:!1,embeddedEditor:!0,navRootLabel:`MCP`})});if(this.pageId===`security`){let n=t.state,r=n.configLoading||n.configSaving||n.configApplying||this.isUpdateBusy();return Jn({security:tr(e),configBusy:r,canPairDevice:n.connected&&F(this.context.gateway.snapshot.hello?.auth??null),onPairMobile:()=>void this.context.overlays.openDevicePairSetup(),onBrowserEnabledToggle:e=>t.patchForm([`browser`,`enabled`],e),onToolProfileChange:e=>t.patchForm([`tools`,`profile`],e),editor:_n({...l,embeddedEditor:!0})})}return _n(l)}renderQuickConfig(e){let t=this.context.runtimeConfig,n=S(S(e.agents)?.defaults),r=typeof n?.model==`string`?n.model:`default`,i=typeof n?.thinkingDefault==`string`?n.thinkingDefault:`off`,a=n?.fastMode,o=this.context.config.current;return Wn({locale:Ae(this.settings.locale)?this.settings.locale:ke.getLocale(),onLocaleChange:e=>this.setLocale(e),currentModel:r,thinkingLevel:i,fastMode:a===`auto`||typeof a==`boolean`?a:!1,systemInfo:this.systemInfo,systemInfoUnavailable:this.systemInfoUnavailable,onModelChange:()=>{this.selections={...this.selections,"ai-agents":{activeSection:`models`,activeSubsection:null}},this.navigate(`ai-agents`)},connected:t.state.connected,assistantName:o.assistantIdentity.name,version:o.serverVersion??this.context.gateway.snapshot.hello?.server?.version??``,configLoading:t.state.configLoading,configSaving:t.state.configSaving,configApplying:t.state.configApplying,configUpdating:this.isUpdateBusy(),configNeedsApply:t.state.configNeedsApply,configRawDraftPending:t.state.configFormMode===`raw`&&t.state.configFormDirty,configAutoSaveStatus:t.state.configAutoSaveStatus,onApplyConfig:()=>void t.apply(),onRetrySaveConfig:()=>void t.save(),onDiscardConfig:()=>void t.discardDraft(),onThinkingChange:e=>t.patchForm([`agents`,`defaults`,`thinkingDefault`],e),onFastModeChange:e=>t.patchForm([`agents`,`defaults`,`fastMode`],e)})}render(){let e=this.context.runtimeConfig.state,t=S(e.configForm??e.configSnapshot?.config)??{},n=this.pageId===`config`?this.renderQuickConfig(t):this.renderAdvancedConfig(t);return h`
      <section class="content-header">
        <div>
          <div class="page-title">${er(this.pageId)}</div>
        </div>
      </section>
      ${qe(n,this.pageId===`config`?{id:`config-settings-panel`,ariaLabel:R(`configPage.content`)}:{})}
    `}},t([m({context:Te,subscribe:!0})],$.prototype,`context`,void 0),t([_({attribute:`page-id`})],$.prototype,`pageId`,void 0),t([_({attribute:!1})],$.prototype,`routeData`,void 0),t([y()],$.prototype,`settings`,void 0),t([y()],$.prototype,`systemInfo`,void 0),t([y()],$.prototype,`systemInfoUnavailable`,void 0),t([y()],$.prototype,`microphoneDevices`,void 0),t([y()],$.prototype,`microphoneLoading`,void 0),t([y()],$.prototype,`microphoneError`,void 0),t([y()],$.prototype,`cameraDevices`,void 0),t([y()],$.prototype,`cameraLoading`,void 0),t([y()],$.prototype,`cameraError`,void 0),t([y()],$.prototype,`formModes`,void 0),t([y()],$.prototype,`selections`,void 0),t([y()],$.prototype,`customThemeImportUrl`,void 0),t([y()],$.prototype,`customThemeImportBusy`,void 0),t([y()],$.prototype,`customThemeImportMessage`,void 0),t([y()],$.prototype,`customThemeImportExpanded`,void 0),t([y()],$.prototype,`customThemeImportFocusToken`,void 0),customElements.get(`openclaw-config-page`)||customElements.define(`openclaw-config-page`,$)}))();
//# sourceMappingURL=config-page-ZXlXK1Pn.js.map