import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,u as n}from"./control-ui-foundation-43q8Lf_T.js";import{Ct as r,St as i,_t as a,bt as o,gt as ee,ht as s,mt as te,vt as c,wt as ne,xt as re,yt as l}from"./control-ui-core-DF5v1q4q.js";import{dt as u,ft as d}from"./control-ui-foundation-DQl2NL7K.js";import{$ as f,G as ie,J as p,U as m,X as h,z as ae}from"./lit-runtime-CE4wpvNA.js";import{i as g,n as _}from"./gateway-runtime-DWs8EJ0W.js";import{Mi as v,Mr as y,Nr as b,Pi as x}from"./control-ui-core-Dx4utKSD.js";import{B as S,U as C,Ut as w,at as T,it as E,jt as D}from"./control-ui-core-6OhF3OIO.js";import{o as O,t as k}from"./control-ui-core-CXeSrnoQ.js";import{D as A}from"./control-ui-core-vPyynwls.js";import{d as j,f as M}from"./control-ui-shared-Ca9fxTB8.js";import{n as N,t as P}from"./settings-workspace-BhCB-OeS.js";import{r as F,t as I}from"./icon-loader-Bh1ITktZ.js";var L=e((()=>{}));function R(e){return e.deviceCode?f`
    <div class="model-setup-wizard__device-code">
      ${e.deviceCode.message?f`<div class="muted">${e.deviceCode.message}</div>`:h}
      <code>${e.deviceCode.code}</code>
      <button
        type="button"
        class="btn btn--sm"
        @click=${()=>void j(e.deviceCode.code)}
      >
        ${O(`modelSetup.wizard.copy`)}
      </button>
      ${e.deviceCode.expiresInMinutes?f`<div class="muted">
            ${O(`modelSetup.wizard.expires`,{count:String(e.deviceCode.expiresInMinutes)})}
          </div>`:h}
    </div>
  `:h}function z(e){if(e.state.phase!==`step`)return h;let t=e.state.step;return f`
    ${t.message?f`<div class="model-setup-wizard__message">${t.message}</div>`:h}
    ${t.externalUrl?f`<a class="btn btn--sm" href=${t.externalUrl} target="_blank" rel="noreferrer">
          ${O(`modelSetup.wizard.openSignIn`)}
        </a>`:h}
    ${R(t)}
    <button
      type="button"
      class="btn primary"
      ?disabled=${e.state.busy}
      @click=${()=>e.onAnswer(void 0,!1)}
    >
      ${O(`modelSetup.wizard.continue`)}
    </button>
  `}function B(e){if(e.state.phase!==`step`)return h;let t=e.state.step;return f`
    <form
      @submit=${t=>{t.preventDefault(),e.onAnswer(typeof e.value==`string`?e.value:``)}}
    >
      ${t.message?f`<div class="model-setup-wizard__message">${t.message}</div>`:h}
      <input
        class="input"
        name="wizard-text"
        type=${t.sensitive?`password`:`text`}
        autocomplete=${t.sensitive?`off`:`on`}
        placeholder=${t.placeholder??``}
        .value=${typeof e.value==`string`?e.value:``}
        ?disabled=${e.state.busy}
        @input=${t=>e.onValueChange(t.currentTarget.value)}
      />
      <button type="submit" class="btn primary" ?disabled=${e.state.busy}>
        ${O(`modelSetup.wizard.submit`)}
      </button>
    </form>
  `}function oe(e){if(e.state.phase!==`step`)return h;let t=e.state.step;return f`
    ${t.message?f`<div class="model-setup-wizard__message">${t.message}</div>`:h}
    <div class="model-setup-wizard__options" role="radiogroup">
      ${(t.options??[]).map(t=>f`
          <label class="model-setup-wizard__option">
            <input
              type="radio"
              name="wizard-option"
              .checked=${Object.is(e.value,t.value)}
              @change=${()=>e.onValueChange(t.value)}
            />
            <span>
              <strong>${t.label}</strong>
              ${t.hint?f`<small>${t.hint}</small>`:h}
            </span>
          </label>
        `)}
    </div>
    <button
      type="button"
      class="btn primary"
      ?disabled=${e.state.busy||e.value===void 0}
      @click=${()=>e.onAnswer(e.value)}
    >
      ${O(`modelSetup.wizard.continue`)}
    </button>
  `}function V(e){return e.state.phase===`step`?f`
    ${e.state.step.message?f`<div class="model-setup-wizard__message">${e.state.step.message}</div>`:h}
    <div class="model-setup-wizard__actions">
      <button
        type="button"
        class="btn"
        ?disabled=${e.state.busy}
        @click=${()=>e.onAnswer(!1)}
      >
        ${O(`common.no`)}
      </button>
      <button
        type="button"
        class="btn primary"
        ?disabled=${e.state.busy}
        @click=${()=>e.onAnswer(!0)}
      >
        ${O(`common.yes`)}
      </button>
    </div>
  `:h}function H(e){if(e.state.phase!==`step`)return h;let t=Array.isArray(e.value)?e.value:[];return f`
    ${e.state.step.message?f`<div class="model-setup-wizard__message">${e.state.step.message}</div>`:h}
    <div class="model-setup-wizard__options">
      ${(e.state.step.options??[]).map(n=>f`
          <label class="model-setup-wizard__option">
            <input
              type="checkbox"
              .checked=${t.some(e=>Object.is(e,n.value))}
              @change=${r=>{let i=r.currentTarget.checked;e.onValueChange(i?[...t,n.value]:t.filter(e=>!Object.is(e,n.value)))}}
            />
            <span>
              <strong>${n.label}</strong>
              ${n.hint?f`<small>${n.hint}</small>`:h}
            </span>
          </label>
        `)}
    </div>
    <button
      type="button"
      class="btn primary"
      ?disabled=${e.state.busy}
      @click=${()=>e.onAnswer(t)}
    >
      ${O(`modelSetup.wizard.continue`)}
    </button>
  `}function U(e){if(e.state.phase!==`step`)return h;switch(e.state.step.type){case`text`:return B(e);case`select`:return oe(e);case`confirm`:return V(e);case`multiselect`:return H(e);case`note`:case`progress`:case`action`:return z(e)}return h}function W(e){if(e.state.phase===`idle`)return h;let t=e.state.phase===`starting`||e.state.phase===`step`||e.state.phase===`done`;return f`
    <openclaw-modal-dialog
      label=${O(`modelSetup.wizard.dialogLabel`)}
      @modal-cancel=${t?e.onCancel:e.onClose}
    >
      <div class="model-setup-wizard">
        <div class="model-setup-wizard__header">
          <h2>
            ${e.state.phase===`step`&&e.state.step.title?e.state.step.title:O(`modelSetup.wizard.title`)}
          </h2>
        </div>
        <div class="model-setup-wizard__body">
          ${e.state.phase===`starting`?f`<div role="status">${O(`modelSetup.wizard.starting`)}</div>`:e.state.phase===`done`?f`<div role="status">${O(`modelSetup.wizard.checking`)}</div>`:e.state.phase===`error`||e.state.phase===`cancelled`?f`<div class="callout danger" role="alert">${e.state.message}</div>`:f`
                    ${e.state.validationError?f`<div class="callout danger" role="alert">
                          ${e.state.validationError}
                        </div>`:h}
                    ${U(e)}
                    ${e.state.busy?f`<div role="status">${O(`modelSetup.wizard.working`)}</div>`:h}
                  `}
        </div>
        <div class="model-setup-wizard__footer">
          <button type="button" class="btn" @click=${t?e.onCancel:e.onClose}>
            ${O(t?`common.cancel`:`common.close`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var G=e((()=>{p(),k(),A(),M()}));function K(e,t,n,r=``){let i=t?e.iconUrls[t]:void 0;return!t||!i?h:f`<img
    class=${`model-setup__icon ${r}`.trim()}
    src=${i}
    alt=${n}
    width="24"
    height="24"
    @error=${()=>e.onIconError(t)}
  />`}function q(e){return e.recommended?O(`modelSetup.candidates.recommended`):e.credentials===!0?O(`modelSetup.candidates.credentialsReady`):e.credentials===!1?O(`modelSetup.candidates.signInNeeded`):O(`modelSetup.candidates.detected`)}function J(e){let t={auth:O(`modelSetup.failure.auth`),rate_limit:O(`modelSetup.failure.rateLimit`),billing:O(`modelSetup.failure.billing`),timeout:O(`modelSetup.failure.timeout`),format:O(`modelSetup.failure.format`),unavailable:O(`modelSetup.failure.unavailable`),unknown:O(`modelSetup.failure.unknown`)};return t[e]??t.unknown}function se(e,t){return f`
    <div class="model-setup__success" role="status">
      <div>
        <strong>${O(`modelSetup.success.title`)}</strong>
        <div>
          ${e.latencyMs===void 0?e.modelRef:O(`modelSetup.success.detail`,{modelRef:e.modelRef,latencyMs:String(e.latencyMs)})}
        </div>
      </div>
      <button type="button" class="btn primary" @click=${t}>
        ${O(`modelSetup.success.openChat`)}
      </button>
    </div>
  `}function ce(e,t){return t.candidates.length===0?h:f`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${O(`modelSetup.candidates.title`)}</h2>
      </div>
      <div class="model-setup__rows">
        ${t.candidates.map(t=>{let n=e.activation.phase===`testing`&&e.activation.targetId===c(t.kind,t.modelRef),r=e.activation.phase===`failure`&&e.activation.targetId===c(t.kind,t.modelRef)?e.activation:null;return f`
            <div class="model-setup__row" data-candidate-kind=${t.kind}>
              <div class="model-setup__row-main">
                <div class="model-setup__row-title">
                  ${K(e,t.icon,t.label)}
                  <strong>${t.label}</strong>
                  <span class="model-setup__chip">${q(t)}</span>
                </div>
                <div class="muted">${t.modelRef} · ${t.detail}</div>
                ${n?f`<div class="model-setup__testing" role="status">
                      ${O(`modelSetup.candidates.testing`,{modelRef:t.modelRef})}
                    </div>`:h}
                ${r?f`<div class="callout danger" role="alert">
                      <strong>${J(r.status)}</strong> ${r.error}
                    </div>`:h}
              </div>
              <button
                type="button"
                class="btn primary"
                ?disabled=${e.actionsDisabled}
                @click=${()=>e.onActivateCandidate(t)}
              >
                ${O(n?`modelSetup.candidates.testingButton`:`modelSetup.candidates.testAndUse`)}
              </button>
            </div>
          `})}
      </div>
    </section>
  `}function le(e,t){let n=t.recommendedInstalls??[];return t.candidates.length>0||(t.authOptions?.length??0)>0||n.length===0?h:f`
    <section class="settings-section model-setup__empty">
      <div class="settings-section__header">
        <h2>${O(`modelSetup.empty.title`)}</h2>
      </div>
      <p class="muted">${O(`modelSetup.empty.intro`)}</p>
      <div class="model-setup__recommendations">
        ${n.map(t=>f`
            <div class="model-setup__recommendation" data-recommended-install=${t.id}>
              ${K(e,t.icon,t.label,`model-setup__icon--recommendation`)}
              <div class="model-setup__row-main">
                <strong>${t.label}</strong>
                <div class="muted">${t.hint}</div>
                <a href=${t.website} target="_blank" rel="noopener">${t.website}</a>
              </div>
            </div>
          `)}
      </div>
    </section>
  `}function ue(e,t){let n=e.verify.phase===`ok`?e.verify.modelRef:t;return f`
    <section class="settings-section model-setup__current" data-verify-phase=${e.verify.phase}>
      <div class="settings-section__header">
        <h2>${O(`modelSetup.verify.title`)}</h2>
      </div>
      <div class="model-setup__row">
        <div class="model-setup__row-main">
          <strong>${n}</strong>
          ${e.verify.phase===`checking`?f`<div class="model-setup__testing" role="status">
                ${O(`modelSetup.verify.checking`,{modelRef:t})}
              </div>`:e.verify.phase===`ok`?f`<div class="model-setup__verified" role="status">
                  ${e.verify.latencyMs===void 0?O(`modelSetup.verify.answered`):O(`modelSetup.verify.answeredIn`,{latencyMs:String(e.verify.latencyMs)})}
                </div>`:e.verify.phase===`failed`?f`<div class="callout danger" role="alert">
                    <strong>${J(e.verify.status)}</strong> ${e.verify.error}
                  </div>`:h}
        </div>
        ${e.canVerify?f`<button
              type="button"
              class="btn"
              ?disabled=${e.actionsDisabled}
              @click=${e.onVerify}
            >
              ${O(`modelSetup.verify.button`)}
            </button>`:h}
      </div>
    </section>
  `}function Y(e){return e.unavailableCandidates?.length?f`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${O(`modelSetup.unavailable.title`)}</h2>
      </div>
      <div class="model-setup__rows">
        ${e.unavailableCandidates.map(e=>f`
            <div class="model-setup__row model-setup__row--info">
              <div>
                <div><strong>${e.label}</strong> — ${e.detail}</div>
                <div>${e.reason}</div>
              </div>
            </div>
          `)}
      </div>
    </section>
  `:h}function X(e,t){return f`
    <div class="model-setup__row" data-auth-choice=${t.id}>
      <div class="model-setup__provider-copy">
        ${K(e,t.icon,t.label)}
        <div>
          <strong>${t.label}</strong>
          ${t.groupLabel?f`<div class="muted">${t.groupLabel}</div>`:h}
          ${t.hint?f`<div class="muted">${t.hint}</div>`:h}
        </div>
      </div>
      <button
        type="button"
        class="btn"
        ?disabled=${e.actionsDisabled}
        @click=${()=>e.onStartAuth(t)}
      >
        ${t.kind===`device-code`?O(`modelSetup.signIn.pair`):O(`modelSetup.signIn.signIn`)}
      </button>
    </div>
  `}function de(e,t){let n=(t.authOptions??[]).toSorted((e,t)=>Number(t.featured)-Number(e.featured));if(n.length===0)return h;let r=n.filter(e=>e.featured),i=n.filter(e=>!e.featured);return f`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${O(`modelSetup.signIn.title`)}</h2>
      </div>
      <div class="model-setup__rows">${r.map(t=>X(e,t))}</div>
      ${i.length?f`<details
            class="model-setup__more"
            .open=${e.moreSignInOpen}
            @toggle=${t=>e.onMoreSignInToggle(t.currentTarget.open)}
          >
            <summary>${O(`modelSetup.signIn.more`)}</summary>
            <div class="model-setup__rows">
              ${i.map(t=>X(e,t))}
            </div>
          </details>`:h}
    </section>
  `}function fe(e,t){let n=t.manualProviders.find(t=>t.id===e.manualProviderId),r=`manual:${e.manualProviderId}`,i=e.activation.phase===`testing`&&e.activation.targetId===r,a=e.activation.phase===`failure`&&e.activation.targetId===r?e.activation:null;return f`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${O(`modelSetup.manual.title`)}</h2>
      </div>
      <div class="model-setup__manual">
        <label class="field">
          <span>${O(`modelSetup.manual.provider`)}</span>
          <div class="model-setup__manual-provider">
            ${K(e,n?.icon,n?.label??``)}
            <select
              ?disabled=${e.actionsDisabled}
              @change=${t=>e.onManualProviderChange(t.currentTarget.value)}
            >
              <option value="" ?selected=${!e.manualProviderId}>
                ${O(`modelSetup.manual.selectProvider`)}
              </option>
              ${t.manualProviders.map(t=>f`
                  <option value=${t.id} ?selected=${t.id===e.manualProviderId}>
                    ${t.label}
                  </option>
                `)}
            </select>
          </div>
        </label>
        ${n?.hint?f`<div class="muted">${n.hint}</div>`:h}
        <label class="field">
          <span>${O(`modelSetup.manual.accessValue`)}</span>
          <input
            class="input"
            type="password"
            autocomplete="off"
            .value=${e.manualApiKey}
            ?disabled=${e.actionsDisabled}
            placeholder=${O(`modelSetup.manual.accessValuePlaceholder`)}
            @input=${t=>e.onManualApiKeyChange(t.currentTarget.value)}
          />
        </label>
        ${e.manualError?f`<div class="callout danger" role="alert">${e.manualError}</div>`:h}
        ${i?f`<div class="model-setup__testing" role="status">
              ${O(`modelSetup.candidates.testing`,{modelRef:n?.label??r})}
            </div>`:h}
        ${a?f`<div class="callout danger" role="alert">
              <strong>${J(a.status)}</strong> ${a.error}
            </div>`:h}
        <button
          type="button"
          class="btn primary"
          ?disabled=${e.actionsDisabled||!e.manualProviderId}
          @click=${e.onManualConnect}
        >
          ${O(i?`modelSetup.candidates.testingButton`:`modelSetup.manual.connect`)}
        </button>
      </div>
    </section>
  `}function pe(e,t){if(e.activation.phase===`success`)return se(e.activation,e.onOpenChat);let n=t.configuredModel?ue(e,t.configuredModel):h;return e.canAdmin?e.gatewayTooOld?f`${n}
      <div class="callout warning" role="note">${O(`modelSetup.access.gatewayTooOld`)}</div>`:f`
    ${n} ${le(e,t)} ${ce(e,t)}
    ${Y(t)} ${de(e,t)} ${fe(e,t)}
  `:f`${n}
      <div class="callout warning" role="note">${O(`modelSetup.access.adminRequired`)}</div>`}function me(e){let t;return e.page.phase===`ready`?t=pe(e,e.page.result):e.canAdmin?e.gatewayTooOld?t=f`<div class="callout warning" role="note">
      ${O(`modelSetup.access.gatewayTooOld`)}
    </div>`:e.page.phase===`loading`?t=f`<div class="model-setup__loading" role="status">${O(`modelSetup.loading`)}</div>`:e.page.phase===`detect-error`&&(t=f`
      <div class="callout danger" role="alert">${e.page.message}</div>
      <button type="button" class="btn" @click=${e.onDetect}>${O(`modelSetup.retry`)}</button>
    `):t=f`<div class="callout warning" role="note">
      ${O(`modelSetup.access.adminRequired`)}
    </div>`,f`
    <div class="model-setup">
      <div class="model-setup__intro">
        <div>
          <h1>${O(`modelSetup.heading`)}</h1>
          <p>${O(`modelSetup.intro`)}</p>
        </div>
        ${e.page.phase===`ready`&&e.activation.phase!==`success`&&e.canAdmin&&!e.gatewayTooOld?f`<button
              type="button"
              class="btn"
              ?disabled=${e.actionsDisabled}
              @click=${e.onDetect}
            >
              ${O(`modelSetup.checkAgain`)}
            </button>`:h}
      </div>
      ${t}
    </div>
    ${W({state:e.wizard,value:e.wizardValue,onValueChange:e.onWizardValueChange,onAnswer:e.onWizardAnswer,onCancel:e.onWizardCancel,onClose:e.onWizardClose})}
  `}var he=e((()=>{p(),k(),L(),o(),G()})),Z,ge=e((()=>{o(),Z=class{constructor(e){this.options=e,this.currentState={phase:`idle`},this.sessionId=null,this.abortController=null,this.generation=0}get state(){return this.currentState}async start(e){let t=this.options.getClient();if(!t||this.currentState.phase!==`idle`)return;let n=++this.generation,r=crypto.randomUUID(),i=new AbortController;this.sessionId=r,this.abortController=i,this.setState({phase:`starting`,authChoice:e});try{let o=await t.request(`openclaw.setup.auth.start`,{sessionId:r,authChoice:e},{timeoutMs:a,signal:i.signal});if(n!==this.generation)return;if(o.done){this.applyResult(e,o);return}await this.requestNext(e,void 0,n)}catch(e){this.handleError(e,n)}}async answer(e,t=!0){let n=this.currentState;if(n.phase!==`step`||n.busy||!this.sessionId)return;let r=this.generation;this.setState({...n,busy:!0,validationError:null});let i=t?{stepId:n.step.id,value:e}:{stepId:n.step.id};try{await this.requestNext(n.authChoice,i,r)}catch(e){this.handleError(e,r)}}async cancel(){let e=this.options.getClient(),t=this.sessionId;if(this.generation+=1,this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.setState({phase:`idle`}),!(!e||!t))try{await e.request(`wizard.cancel`,{sessionId:t},{timeoutMs:a})}catch{}}close(){this.generation+=1,this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.setState({phase:`idle`})}fail(e){this.sessionId=null,this.abortController=null,this.setState({phase:`error`,message:e})}async requestNext(e,t,n){let r=this.options.getClient(),i=this.sessionId,a=this.abortController?.signal;if(!r||!i||!a)return;let o=await r.request(`wizard.next`,{sessionId:i,...t?{answer:t}:{}},{timeoutMs:null,signal:a});n===this.generation&&this.applyResult(e,o)}applyResult(e,t){let n=ne(e,t,t.status===`cancelled`?this.options.cancelledMessage():this.options.requestFailedMessage());this.setState(n),n.phase===`done`&&(this.sessionId=null,this.abortController=null,this.options.onDone())}handleError(e,t){if(t!==this.generation)return;let n=this.options.getClient(),r=this.sessionId;this.sessionId=null,this.abortController?.abort(),this.abortController=null,n&&r&&n.request(`wizard.cancel`,{sessionId:r},{timeoutMs:a}).catch(()=>{});let i=e instanceof Error&&e.message.trim()?e.message:this.options.requestFailedMessage();this.setState({phase:`error`,message:i})}setState(e){this.currentState=e,this.options.onChange(e)}}}));function Q(e){return e instanceof Error&&e.message.trim()?e.message:typeof e==`string`&&e.trim()?e:O(`modelSetup.errors.requestFailed`)}var $;e((()=>{u(),p(),ae(),D(),T(),C(),P(),k(),_(),x(),b(),F(),s(),o(),he(),ge(),n(),$=class extends v{constructor(...e){super(...e),this.pageState={phase:`loading`},this.activationState={phase:`idle`},this.verifyState={phase:`idle`},this.wizardState={phase:`idle`},this.manualProviderId=``,this.manualApiKey=``,this.manualError=null,this.moreSignInOpen=!1,this.iconUrls={},this.observedClient=null,this.dataClient=null,this.detectAbort=null,this.activationAbort=null,this.verifyAbort=null,this.detectEpoch=0,this.activationEpoch=0,this.verifyEpoch=0,this.iconMisses=new Set,this.iconRequests=new Map,this.subscriptions=new y(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)),this.wizard=new Z({getClient:()=>this.context?.gateway.snapshot.client??null,onChange:e=>{let t=this.wizardState.phase===`step`?this.wizardState.step.id:null;this.wizardState=e,e.phase===`step`&&e.step.id!==t&&(this.wizardValue=re(e.step))},onDone:()=>void this.handleWizardDone(),requestFailedMessage:()=>O(`modelSetup.errors.requestFailed`),cancelledMessage:()=>O(`modelSetup.wizard.cancelled`)})}disconnectedCallback(){this.detectAbort?.abort(),this.activationAbort?.abort(),this.verifyAbort?.abort(),this.resetIcons(),this.wizard.cancel(),this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){e.has(`routeData`)&&this.routeData&&(this.pageState=this.routeData.state,this.dataClient=this.routeData.client,this.observedClient=this.routeData.client,this.syncManualProvider(this.routeData.state))}updated(){let e=this.context.gateway.snapshot;if(e.client===this.observedClient){this.reconcileIcons();return}this.observedClient=e.client,this.detectAbort?.abort(),this.activationAbort?.abort(),this.verifyAbort?.abort(),this.resetIcons(),this.activationState={phase:`idle`},this.verifyState={phase:`idle`},this.wizard.cancel(),!(!e.client||e.client===this.dataClient)&&(this.pageState={phase:`loading`},this.dataClient=e.client,this.canUseSetup(e.client)&&this.detect())}canUseSetup(e){let t=this.context.gateway.snapshot;return!!(e&&t.connected&&S(t.hello?.auth??null)&&g(t,`openclaw.setup.detect`)===!0)}syncManualProvider(e){e.phase===`ready`&&(e.result.manualProviders.some(e=>e.id===this.manualProviderId)||(this.manualProviderId=e.result.manualProviders[0]?.id??``))}currentIconUrls(){if(this.pageState.phase!==`ready`)return new Set;let e=this.pageState.result;return new Set([...e.candidates,...e.manualProviders,...e.authOptions??[],...e.recommendedInstalls??[]].flatMap(e=>e.icon?[e.icon]:[]))}reconcileIcons(){let e=this.currentIconUrls(),t={...this.iconUrls},n=!1;for(let[r,i]of Object.entries(t))e.has(r)||(URL.revokeObjectURL(i),delete t[r],n=!0);n&&(this.iconUrls=t);for(let[t,n]of this.iconRequests)e.has(t)||(clearTimeout(n.timeout),n.controller.abort(),this.iconRequests.delete(t));for(let t of this.iconMisses)e.has(t)||this.iconMisses.delete(t);for(let t of e)!this.iconUrls[t]&&!this.iconMisses.has(t)&&!this.iconRequests.has(t)&&this.fetchIcon(t)}fetchIcon(e){let t=new AbortController,n=setTimeout(()=>t.abort(new DOMException(`catalog icon fetch timed out`,`TimeoutError`)),1e4),r={controller:t,timeout:n};this.iconRequests.set(e,r),I({iconUrl:e,basePath:this.context.basePath,gatewayUrl:this.context.gateway.connection.gatewayUrl,auth:{hello:this.context.gateway.snapshot.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password},signal:t.signal}).then(t=>{if(this.iconRequests.get(e)!==r||!this.context.gateway.snapshot.connected||!this.currentIconUrls().has(e)){t&&URL.revokeObjectURL(t);return}t?this.iconUrls={...this.iconUrls,[e]:t}:this.iconMisses.add(e)}).catch(()=>{this.iconRequests.get(e)===r&&this.iconMisses.add(e)}).finally(()=>{clearTimeout(n),this.iconRequests.get(e)===r&&this.iconRequests.delete(e)})}invalidateIcon(e){let t=this.iconRequests.get(e);t&&(clearTimeout(t.timeout),t.controller.abort(),this.iconRequests.delete(e));let n=this.iconUrls[e];n&&URL.revokeObjectURL(n);let r={...this.iconUrls};delete r[e],this.iconUrls=r,this.iconMisses.add(e)}resetIcons(){for(let e of this.iconRequests.values())clearTimeout(e.timeout),e.controller.abort();for(let e of Object.values(this.iconUrls))URL.revokeObjectURL(e);this.iconRequests.clear(),this.iconMisses.clear(),this.iconUrls={}}async detect(){let e=this.context.gateway.snapshot.client;if(!this.canUseSetup(e))return null;let t=++this.detectEpoch;this.resetVerify(),this.detectAbort?.abort();let n=new AbortController;this.detectAbort=n,this.pageState={phase:`loading`};try{let r=await te(e,n.signal);return t!==this.detectEpoch||this.context.gateway.snapshot.client!==e?null:(this.pageState={phase:`ready`,result:r},this.dataClient=e,this.syncManualProvider(this.pageState),r)}catch(r){return t===this.detectEpoch&&this.context.gateway.snapshot.client===e&&!n.signal.aborted&&(this.pageState={phase:`detect-error`,message:Q(r)}),null}finally{this.detectAbort===n&&(this.detectAbort=null)}}canVerify(e){let t=this.context.gateway.snapshot;return this.canUseSetup(e)&&g(t,`openclaw.setup.verify`)===!0}resetVerify(){this.verifyEpoch+=1,this.verifyAbort?.abort(),this.verifyAbort=null,this.verifyState={phase:`idle`}}async verifyConnection(){let e=this.context.gateway.snapshot.client;if(!this.canVerify(e)||this.actionsDisabled())return;let t=++this.verifyEpoch;this.verifyAbort?.abort();let n=new AbortController;this.verifyAbort=n,this.verifyState={phase:`checking`};try{let i=await ee(e,n.signal);if(t!==this.verifyEpoch||this.context.gateway.snapshot.client!==e)return;this.verifyState=r(i)}catch(r){t===this.verifyEpoch&&this.context.gateway.snapshot.client===e&&!n.signal.aborted&&(this.verifyState={phase:`failed`,status:`unknown`,error:Q(r)})}finally{this.verifyAbort===n&&(this.verifyAbort=null)}}async activate(e,t,n){let r=this.context.gateway.snapshot.client;if(!this.canUseSetup(r)||this.actionsDisabled())return;let a=++this.activationEpoch;this.activationAbort?.abort();let o=new AbortController;this.activationAbort=o,this.manualError=null,this.activationState={phase:`testing`,targetId:t,modelRef:n};try{let n=await r.request(`openclaw.setup.activate`,e,{timeoutMs:l(e.kind),signal:o.signal});if(a!==this.activationEpoch||this.context.gateway.snapshot.client!==r)return;this.activationState=i({result:n,targetId:t,fallbackError:O(`modelSetup.errors.activationFailed`)}),this.activationState.phase===`success`&&(this.manualApiKey=``)}catch(e){a===this.activationEpoch&&this.context.gateway.snapshot.client===r&&!o.signal.aborted&&(this.activationState={phase:`failure`,targetId:t,status:`unknown`,error:Q(e)})}finally{this.activationAbort===o&&(this.activationAbort=null)}}activateCandidate(e){this.activate({kind:e.kind,modelRef:e.modelRef},c(e.kind,e.modelRef),e.modelRef)}connectManual(){let e=this.manualApiKey.trim();if(!this.manualProviderId||!e){this.manualError=O(`modelSetup.manual.required`);return}this.activate({kind:`api-key`,authChoice:this.manualProviderId,apiKey:e},`manual:${this.manualProviderId}`,this.manualProviderId)}async handleWizardDone(){let e=await this.detect();if(!e){this.wizard.fail(O(`modelSetup.errors.requestFailed`));return}if(!e.setupComplete){this.wizard.fail(O(`modelSetup.wizard.notComplete`));return}this.activationState={phase:`success`,modelRef:e.configuredModel??O(`modelSetup.success.configuredModel`)},this.wizard.close()}actionsDisabled(){return this.activationState.phase===`testing`||this.verifyState.phase===`checking`||this.wizardState.phase!==`idle`&&this.wizardState.phase!==`error`&&this.wizardState.phase!==`cancelled`}render(){let e=this.context.gateway.snapshot,t=S(e.hello?.auth??null),n=e.connected&&g(e,`openclaw.setup.detect`)!==!0,r=t&&!n&&g(e,`openclaw.setup.verify`)===!0,i=me({page:this.pageState,activation:this.activationState,verify:this.verifyState,wizard:this.wizardState,wizardValue:this.wizardValue,canAdmin:t,canVerify:r,gatewayTooOld:n,actionsDisabled:this.actionsDisabled(),manualProviderId:this.manualProviderId,manualApiKey:this.manualApiKey,manualError:this.manualError,moreSignInOpen:this.moreSignInOpen,iconUrls:this.iconUrls,onDetect:()=>void this.detect(),onVerify:()=>void this.verifyConnection(),onActivateCandidate:e=>this.activateCandidate(e),onStartAuth:e=>void this.wizard.start(e.id),onManualProviderChange:e=>{this.manualProviderId=e,this.manualError=null},onManualApiKeyChange:e=>{this.manualApiKey=e,this.manualError=null},onManualConnect:()=>this.connectManual(),onMoreSignInToggle:e=>this.moreSignInOpen=e,onIconError:e=>this.invalidateIcon(e),onOpenChat:()=>{if(this.routeData?.firstRun){this.context.navigate(`custodian`,{search:`?onboarding=1`});return}this.context.navigate(`chat`)},onWizardValueChange:e=>this.wizardValue=e,onWizardAnswer:(e,t)=>void this.wizard.answer(e,t),onWizardCancel:()=>void this.wizard.cancel(),onWizardClose:()=>this.wizard.close()});return f`
      <section class="content-header">
        <div class="page-title">${w(`model-setup`)}</div>
      </section>
      ${N(i)}
    `}},t([d({context:E,subscribe:!0})],$.prototype,`context`,void 0),t([ie({attribute:!1})],$.prototype,`routeData`,void 0),t([m()],$.prototype,`pageState`,void 0),t([m()],$.prototype,`activationState`,void 0),t([m()],$.prototype,`verifyState`,void 0),t([m()],$.prototype,`wizardState`,void 0),t([m()],$.prototype,`wizardValue`,void 0),t([m()],$.prototype,`manualProviderId`,void 0),t([m()],$.prototype,`manualApiKey`,void 0),t([m()],$.prototype,`manualError`,void 0),t([m()],$.prototype,`moreSignInOpen`,void 0),t([m()],$.prototype,`iconUrls`,void 0),customElements.get(`openclaw-model-setup-page`)||customElements.define(`openclaw-model-setup-page`,$)}))();
//# sourceMappingURL=model-setup-page-DP6EpxaU.js.map