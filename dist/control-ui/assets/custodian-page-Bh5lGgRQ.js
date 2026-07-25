import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,r as n,u as r}from"./control-ui-foundation-43q8Lf_T.js";import{dt as i,ft as a,lt as o}from"./control-ui-foundation-DQl2NL7K.js";import{$ as s,G as c,J as l,U as u,X as d,z as f}from"./lit-runtime-CE4wpvNA.js";import{i as p,n as ee}from"./gateway-runtime-DWs8EJ0W.js";import{Ba as m,Ci as te,Ha as ne,Mi as re,Mr as h,Nr as ie,Pi as ae,mr as oe,xr as se}from"./control-ui-core-Dx4utKSD.js";import{Gt as ce,Wt as le,at as ue,it as de}from"./control-ui-core-6OhF3OIO.js";import{o as g,t as _}from"./control-ui-core-CXeSrnoQ.js";import{at as fe,ot as pe}from"./control-ui-core-vPyynwls.js";import{K as me,W as he,c as v,et as y,i as b,it as x,l as S,n as C}from"./chat-message-RLWYyOXr.js";import{t as w}from"./text-BbRV7ftC.js";var T=e((()=>{})),E=e((()=>{})),D=e((()=>{}));function O(e){switch(e){case`system-agent`:return g(`custodian.history.sources.systemAgent`);case`doctor`:return g(`custodian.history.sources.doctor`);case`config-rpc`:return g(`custodian.history.sources.settings`);case`external`:return g(`custodian.history.sources.manualEdit`);case`cli`:return g(`custodian.history.sources.cli`);case`plugin-install`:return g(`custodian.history.sources.pluginInstall`);case`unknown`:return g(`custodian.history.sources.unknown`)}return e}function k(e){return s`
    <article class="custodian__change-card ${e.invalid?`is-invalid`:``}">
      <div class="custodian__change-meta">
        <span class="custodian__change-source">${O(e.source)}</span>
        <time datetime=${new Date(e.at).toISOString()}
          >${n(e.at)}</time
        >
      </div>
      <div class="custodian__change-summary">${e.summary}</div>
      ${e.invalid?s`<div class="custodian__change-warning">${g(`custodian.history.invalidEdit`)}</div>`:d}
      ${e.opaqueChange?s`<div class="custodian__change-note">${g(`custodian.history.opaqueChange`)}</div>`:d}
      ${e.changedPaths?.length?s`<details class="custodian__change-paths">
            <summary>
              ${g(`custodian.history.changedPaths`,{count:String(e.changedPaths.length)})}
            </summary>
            <ul>
              ${e.changedPaths.map(e=>s`<li><code>${e}</code></li>`)}
            </ul>
          </details>`:d}
    </article>
  `}function A(e){return s`
    <section class="custodian__history" aria-label=${g(`custodian.history.title`)}>
      <div class="custodian__history-heading">
        <strong>${g(`custodian.history.title`)}</strong>
        <span>${g(`custodian.history.description`)}</span>
      </div>
      ${e.error?s`<div class="custodian__history-error" role="alert">
            <span>${e.error}</span>
            <button class="btn btn--sm" type="button" @click=${()=>e.onLoad(!0)}>
              ${g(`common.retry`)}
            </button>
          </div>`:d}
      <div class="custodian__change-list">
        ${e.entries.map(k)}
        ${e.loading?s`<div class="custodian__history-state" role="status">
              ${g(`custodian.history.loading`)}
            </div>`:e.loaded&&e.entries.length===0&&!e.error?s`<div class="custodian__history-state" role="status">
                ${g(`custodian.history.empty`)}
              </div>`:d}
      </div>
      ${e.nextCursor?s`<button
            class="btn btn--ghost custodian__history-more"
            type="button"
            ?disabled=${e.loadingMore}
            @click=${()=>e.onLoad(!1)}
          >
            ${e.loadingMore?g(`custodian.history.loadingMore`):g(`custodian.history.loadMore`)}
          </button>`:d}
    </section>
  `}var j=e((()=>{l(),_(),te()})),M=e((()=>{})),N,P=e((()=>{l(),f(),_(),M(),r(),N=class extends o{constructor(...e){super(...e),this.selectedValue=``,this.requestKey=``,this.focusPreselection=!1}createRenderRoot(){return this}willUpdate(){let e=this.props,t=e?JSON.stringify([e.header??``,e.question,e.options.map(e=>[e.value,e.label,e.recommended===!0])]):``;t!==this.requestKey&&(this.requestKey=t,this.selectedValue=e?.options.slice(0,4).find(e=>e.recommended)?.value??``,this.focusPreselection=!!this.selectedValue)}updated(e){!this.focusPreselection||this.props?.disabled||(this.focusPreselection=!1,[...this.querySelectorAll(`.option-card__choice`)].find(e=>e.dataset.optionValue===this.selectedValue)?.focus({preventScroll:!0}))}select(e){this.props?.disabled||(this.selectedValue=e,this.props?.onSelect?.(e),this.dispatchEvent(new CustomEvent(`option-select`,{bubbles:!0,composed:!0,detail:{value:e}})))}skip(){this.props?.disabled||(this.props?.onSkip?.(),this.dispatchEvent(new CustomEvent(`option-skip`,{bubbles:!0,composed:!0})))}render(){let e=this.props;if(!e)return d;let t=e.options.slice(0,4),n=t.findIndex(e=>e.recommended===!0);return s`
      <section class="option-card" role="group" aria-label=${e.question}>
        ${e.header?s`<div class="option-card__chip">${e.header}</div>`:d}
        <div class="option-card__question">${e.question}</div>
        <div class="option-card__choices" role="radiogroup">
          ${t.map((t,r)=>{let i=r===n,a=t.value===this.selectedValue;return s`
              <button
                class=${`option-card__choice ${i?`option-card__choice--recommended`:``} ${a?`option-card__choice--selected`:``}`}
                type="button"
                role="radio"
                aria-checked=${a?`true`:`false`}
                data-option-value=${t.value}
                ?disabled=${e.disabled}
                @click=${()=>this.select(t.value)}
              >
                <span class="option-card__choice-copy">
                  <strong>${t.label}</strong>
                  ${t.description?s`<span class="option-card__description">${t.description}</span>`:d}
                </span>
                ${i?s`<span class="option-card__recommended">
                      ${g(`optionCard.recommended`)}
                    </span>`:d}
              </button>
            `})}
        </div>
        <button
          class="option-card__skip"
          type="button"
          ?disabled=${e.disabled}
          @click=${()=>this.skip()}
        >
          ${g(`optionCard.skip`)}
        </button>
      </section>
    `}},t([c({attribute:!1})],N.prototype,`props`,void 0),t([u()],N.prototype,`selectedValue`,void 0),customElements.get(`openclaw-option-card`)||customElements.define(`openclaw-option-card`,N)}));function F(e){return s`<div class="custodian__option-card">
    <openclaw-option-card
      .props=${{header:e.question.header,question:e.question.question,options:e.question.options.map(e=>({value:e.label,label:e.label,description:e.description,recommended:e.recommended})),disabled:e.disabled,onSelect:e.onSelect,onSkip:e.onSkip}}
    ></openclaw-option-card>
  </div>`}var I=e((()=>{l(),P()}));function L(e,t){return t===`received`?`sent`:e instanceof le||t===`unsent`?`rejected`:`unknown`}function R(e,t){return t===`sent`?!1:t===`unknown`?!0:e}function ge(e,t,n){return n!==`rejected`&&e!==null&&e.severity===t.severity&&e.message===t.message}function _e(e,t,n){if(n.event!==`health`)return[e,t];let r=Ce(n);return t?[r,t]:[r,null]}function z(e){if(e.kind===`config-reload`)return g(`custodian.nudge.configReload`);let t=e.channelLabel??g(`custodian.nudge.channelFallback`);return e.kind===`channel-auth`?g(`custodian.nudge.channelAuth`,{channel:t}):e.kind===`channel-disconnected`?g(`custodian.nudge.channelDisconnected`,{channel:t}):g(`custodian.nudge.channelDegraded`,{channel:t})}function ve(e){return s`<div class="custodian__nudge" role="status">
    <button
      class="custodian__nudge-action"
      type="button"
      ?disabled=${e.disabled}
      @click=${e.onSend}
    >
      ${z(e.nudge)}
    </button>
    <button
      class="custodian__nudge-dismiss"
      type="button"
      aria-label=${g(`custodian.nudge.dismiss`)}
      @click=${e.onDismiss}
    >
      ×
    </button>
  </div>`}function B(e){return typeof e==`object`&&e&&!Array.isArray(e)?e:null}function ye(e){return H.some(t=>e[t]===`configured_unavailable`)}function be(e){return B(e.probe)?.ok===!1}function xe(e,t,n){if(n.configured===!1||n.enabled===!1)return null;let r=e.toLowerCase();if(ye(n))return{severity:3,kind:`channel-auth`,channelLabel:t,message:`what happened with ${r} authentication?`};let i=typeof n.healthState==`string`?n.healthState.trim().toLowerCase():void 0;if(i===`terminal-disconnect`||be(n))return{severity:3,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`};if(i===`not-running`&&n.running===!1){let e=typeof n.reconnectAttempts==`number`?n.reconnectAttempts:0,t=typeof n.lastStartAt==`number`?n.lastStartAt:void 0,r=typeof n.lastStopAt==`number`?n.lastStopAt:void 0;if(n.restartPending===!1&&r!==void 0&&(t===void 0||r>=t)&&e<10)return null}return n.connected!==!0&&i!==`healthy`&&typeof n.lastError==`string`&&n.lastError.trim()?{severity:3,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`}:n.connected===!1&&n.running===!0?{severity:2,kind:`channel-disconnected`,channelLabel:t,message:`what happened with ${r}?`}:i&&V.has(i)?{severity:1,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`}:null}function Se(e){let t=B(e);if(!t)return null;if(B(t.configReload)?.hotReloadStatus===`disabled`)return{severity:3,kind:`config-reload`,message:`what happened with configuration reload?`};let n=B(t.channels);if(!n)return null;let r=B(t.channelLabels),i=null;for(let[e,t]of Object.entries(n)){let n=B(t);if(!n)continue;let a=typeof r?.[e]==`string`?r[e]:e,o=B(n.accounts),s=o?Object.values(o).map(B).filter(e=>e!==null):[],c=s.length>0?s:[n];for(let t of c){let n=xe(e,a,t);n&&(!i||n.severity>i.severity)&&(i=n)}}return i}function Ce(e){return e.event===`health`?Se(e.payload):null}var V,H,we=e((()=>{l(),ce(),_(),V=new Set([`disconnected`,`stale-socket`,`stuck`,`terminal-disconnect`]),H=[`tokenStatus`,`botTokenStatus`,`appTokenStatus`,`signingSecretStatus`,`userTokenStatus`]}));function U(e,t){return e?`onboarding`:t?`new-agent`:`caretaker`}function W(e){return e===`caretaker`?{}:{welcomeVariant:e}}function Te(e){return x(e&&typeof e==`object`?e.details:void 0)!==void 0}var Ee=e((()=>{y()}));function G(e){return typeof e==`string`&&e.trim()?e.trim():null}function De(e){if(!e||typeof e!=`object`)return null;let t=G(e.id),n=G(e.header),r=G(e.question);if(!t||!n||!r||!Array.isArray(e.options)||e.options.length<2||e.options.length>4)return null;let i=[];for(let t of e.options){let e=G(t?.label);if(!e)return null;let n=G(t.description??null),r=G(t.reply??null);i.push({label:e,...n?{description:n}:{},...t.recommended===!0?{recommended:!0}:{},...r?{reply:r}:{}})}return new Set(i.map(e=>e.label.toLocaleLowerCase())).size!==i.length||i.filter(e=>e.recommended).length>1?null:{id:t,header:n,question:r,options:i,isOther:e.isOther===!0}}var Oe=e((()=>{}));function ke(e,t,n,r,i){return r||i||e.some(e=>e.question!==null&&!t.has(`${e.id}:${e.question.id}`)&&!n.has(`${e.id}:${e.question.id}`))}function K(e,t){let n=new Set(t);for(let t of e)t.question&&n.add(`${t.id}:${t.question.id}`);return n}function q(){return typeof crypto.randomUUID==`function`?`control-ui-onboarding-${crypto.randomUUID()}`:`control-ui-onboarding-${[...crypto.getRandomValues(new Uint32Array(4))].map(e=>e.toString(16).padStart(8,`0`)).join(``)}`}function J(e){return e instanceof Error&&e.message.trim()?e.message:g(`custodian.requestFailed`)}function Ae(e){let t=`msg-${e.id}`;return{kind:`group`,key:t,role:e.role,messages:[{message:{role:e.role,content:e.text},key:t}],timestamp:e.at,isStreaming:!1}}async function je(e){try{return(await e.request(`openclaw.chat.history`,{},{timeoutMs:Y})).turns}catch{return null}}function Me(e,t){let n=t;return{messages:e.map(e=>({id:n++,role:e.role,text:e.role===`user`&&e.text===X?g(`custodian.sensitiveReply`):e.text,at:e.at,question:null})),nextMessageId:n}}function Ne(e,t){return e.id===t?S({kind:`divider`,key:`custodian-earlier`,label:g(`custodian.earlier`),timestamp:e.at}):d}var Y,X,Pe=e((()=>{l(),_(),v(),Y=15e3,X=`<redacted secret>`})),Z,Q,$;e((()=>{i(),l(),f(),ue(),pe(),_(),ee(),oe(),ne(),ae(),ie(),T(),E(),w(),D(),he(),C(),j(),I(),we(),Ee(),Oe(),Pe(),r(),Z=19e4,Q=50,$=class extends re{constructor(...e){super(...e),this.onboarding=!1,this.newAgentIntent=!1,this.messages=[],this.input=``,this.sending=!1,this.sensitive=!1,this.wizardInputPending=!1,this.questionReplyUncertain=!1,this.error=null,this.dismissedQuestions=new Set,this.answeredQuestions=new Set,this.activeClient=null,this.chatAvailable=!1,this.historyAvailable=!1,this.historyOpen=!1,this.historyEntries=[],this.historyNextCursor=null,this.historyLoading=!1,this.historyLoadingMore=!1,this.historyError=null,this.eventNudge=null,this.eventNudgePending=null,this.sessionId=q(),this.requestEpoch=0,this.nextMessageId=1,this.retryParams=null,this.sessionVariant=null,this.sessionClient=null,this.sessionOwnershipKey=null,this.sessionStarted=!1,this.earlierBoundaryAfterId=null,this.lastHelloDeviceToken=``,this.eventNudgeClosed=!1,this.abandonedTurnOutcomeUnknown=!1,this.historyLoaded=!1,this.subscriptions=new h(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)),this.eventSubscriptions=new h(this).effect(()=>this.context?.gateway,e=>e.subscribeEvents(e=>{this.onboarding||this.newAgentIntent||this.eventNudgeClosed||([this.eventNudge,this.eventNudgePending]=_e(this.eventNudge,this.eventNudgePending,e))}))}disconnectedCallback(){this.requestEpoch+=1,this.subscriptions.clear(),this.eventSubscriptions.clear(),super.disconnectedCallback()}updated(e){if(this.synchronizeClient(),e.has(`messages`)){let e=this.querySelector(`.custodian__messages`)?.lastElementChild;e instanceof HTMLElement&&e.scrollIntoView?.({block:`nearest`})}}currentSessionOwnershipKey(){let{gatewayUrl:e,token:t,password:n,bootstrapToken:r}=this.context.gateway.connection,i=this.context.gateway.snapshot.hello?.auth;return i&&(this.lastHelloDeviceToken=i.deviceToken??``),JSON.stringify([e,t,n,r,this.lastHelloDeviceToken])}startSession(e,t,n){this.sessionId=q(),this.sessionVariant=t,this.sessionClient=e,this.sessionOwnershipKey=this.currentSessionOwnershipKey(),this.sessionStarted=!0,this.initializeSession(e,{sessionId:this.sessionId,...W(t)},n)}abandonPendingUserTurn(e){e?.message!==void 0&&(this.retryParams=null,this.abandonedTurnOutcomeUnknown=!0)}rotateVolatileSession(e,t){this.answeredQuestions=K(this.messages,this.answeredQuestions),this.retryParams=null,this.input=``,this.sensitive=this.wizardInputPending=this.questionReplyUncertain=!1,this.error=null,this.earlierBoundaryAfterId=this.messages.at(-1)?.id??null,this.startSession(e,t,!1)}synchronizeClient(){let e=this.context.gateway.snapshot,t=e.connected?e.client:null,n=t!==null&&p(e,`openclaw.chat`)===!0,r=t!==null&&p(e,`openclaw.changes.list`)===!0;this.historyAvailable!==r&&(this.historyAvailable=r,r||(this.historyOpen=!1,this.resetHistory()));let i=U(this.onboarding,this.newAgentIntent),a=this.sessionStarted&&this.sessionVariant!==i,o=this.currentSessionOwnershipKey(),s=this.sessionStarted&&t!==null&&this.sessionClient!==null&&t!==this.sessionClient,c=this.sessionOwnershipKey!==null&&o!==this.sessionOwnershipKey;if(t===this.activeClient&&!a&&!s&&!c&&this.chatAvailable===n)return;let l=this.sending&&this.retryParams!==null,u=l?this.retryParams:null;if(this.activeClient=t,this.requestEpoch+=1,this.historyOpen=!1,this.resetHistory(),this.sending=!1,this.chatAvailable=!1,a||c)[this.eventNudge,this.eventNudgePending]=[null,null],this.abandonedTurnOutcomeUnknown=!1,this.sessionStarted=!1,this.clearConversation();else if(t&&s){if(!n){this.sessionStarted=!1,this.abandonPendingUserTurn(u),this.error=g(`custodian.unsupportedGateway`);return}this.chatAvailable=!0,this.abandonPendingUserTurn(u),this.rotateVolatileSession(t,i);return}else l&&(u?.message===void 0&&(this.error=g(`custodian.connectionChanged`)),this.abandonPendingUserTurn(u));if(t){if(!n){this.error=g(`custodian.unsupportedGateway`);return}if(this.chatAvailable=!0,this.sessionStarted){this.retryParams||(this.error=l?this.error:null);return}this.clearConversation(),this.startSession(t,i,!0)}}async initializeSession(e,t,n=!0){let r=++this.requestEpoch;this.sending=!0,this.error=null,this.retryParams=t,n&&await this.refreshTranscriptHistory(e,r),!(r!==this.requestEpoch||e!==this.activeClient)&&await this.requestReply(e,t)}async refreshTranscriptHistory(e,t){if(p(this.context.gateway.snapshot,`openclaw.chat.history`)!==!0)return;let n=await je(e);if(n===null||t!==this.requestEpoch||e!==this.activeClient)return;let r=Me(n,this.nextMessageId);this.messages=r.messages,this.nextMessageId=r.nextMessageId,this.earlierBoundaryAfterId=this.messages.at(-1)?.id??null}clearConversation(){this.messages=[],this.dismissedQuestions=new Set,this.answeredQuestions=new Set,this.retryParams=null,this.error=null,this.input=``,this.sensitive=this.wizardInputPending=this.questionReplyUncertain=!1,this.earlierBoundaryAfterId=null}resetHistory(){this.historyEntries=[],this.historyNextCursor=null,this.historyLoading=!1,this.historyLoadingMore=!1,this.historyError=null,this.historyLoaded=!1}toggleHistory(){this.historyOpen=!this.historyOpen,this.historyOpen&&!this.historyLoading&&!this.historyLoadingMore&&this.loadHistory(!0)}async loadHistory(e){let t=this.activeClient,n=e?void 0:this.historyNextCursor??void 0;if(!t||!this.historyAvailable||this.historyLoading||this.historyLoadingMore||!e&&!n)return;let r=this.requestEpoch;e?this.historyLoading=!0:this.historyLoadingMore=!0,this.historyError=null;let i=()=>this.isConnected&&this.activeClient===t&&this.requestEpoch===r&&this.historyAvailable;try{let r=await t.request(`openclaw.changes.list`,{limit:Q,...n?{beforeCursor:n}:{}});if(!i())return;this.historyEntries=e?r.entries:[...this.historyEntries,...r.entries],this.historyNextCursor=r.nextCursor??null,this.historyLoaded=!0}catch{i()&&(this.historyError=g(`custodian.history.requestFailed`),this.historyLoaded=!0)}finally{i()&&(this.historyLoading=!1,this.historyLoadingMore=!1)}}appendAssistant(e,t){this.messages=[...this.messages,{id:this.nextMessageId++,role:`assistant`,text:e,at:Date.now(),question:t}]}async requestReply(e,t){let n=++this.requestEpoch,r=`unsent`;this.sending=!0,this.error=null,this.retryParams=t;try{let i=await e.request(`openclaw.chat`,t,{timeoutMs:Z,onSent:()=>r=`sent`});if(r=`received`,n!==this.requestEpoch||e!==this.activeClient)return`sent`;if(this.sessionId=i.sessionId,this.sensitive=i.sensitive===!0,this.wizardInputPending=i.wizardInputPending===!0,this.retryParams=null,this.appendAssistant(i.reply,De(i.question)),i.action===`open-agent`){let t=this.context.gateway.snapshot.sessionKey?.trim();if(i.agentId){let r=await this.context.agents.refreshList();if(n!==this.requestEpoch||e!==this.activeClient)return`sent`;t=m({agentId:i.agentId,mainKey:r?.mainKey}),this.context.gateway.setSessionKey(t)}i.agentDraft===`hatch`&&t?this.context.navigate(`chat`,{search:`${se(t)}&draft=${encodeURIComponent(g(`custodian.hatchDraft`))}`}):this.exitSetup()}else i.action===`exit`&&this.exitSetup();return`sent`}catch(i){return n===this.requestEpoch&&e===this.activeClient&&(this.error=J(i),t.message!==void 0&&Te(i)&&(this.rotateVolatileSession(e,U(this.onboarding,this.newAgentIntent)),this.error=g(`custodian.sessionRestarted`,{error:J(i)}))),t.message!==void 0&&this.retryParams===t&&(this.retryParams=null),L(i,r)}finally{n===this.requestEpoch&&(this.sending=!1)}}async send(e=this.input,t,n=this.hasUnresolvedQuestion()){let r=this.sensitive?e:e.trim(),i=this.activeClient,a=[this.answeredQuestions,this.questionReplyUncertain];if(n&&(this.questionReplyUncertain=!0),!r.trim()||!i||!this.chatAvailable||this.sending)return`rejected`;let o=this.sensitive?g(`custodian.sensitiveReply`):t??r;this.abandonedTurnOutcomeUnknown=!1,this.answeredQuestions=K(this.messages,this.answeredQuestions),this.messages=[...this.messages,{id:this.nextMessageId++,role:`user`,text:o,at:Date.now(),question:null}],this.input=``;let s=this.requestReply(i,{sessionId:this.sessionId,...W(U(this.onboarding,this.newAgentIntent)),message:r}),c=this.requestEpoch,l=await s;return n&&this.requestEpoch===c&&(this.questionReplyUncertain=R(a[1],l),l===`rejected`&&(this.answeredQuestions=a[0])),l}async sendEventNudge(){let e=this.eventNudge;if(!e||this.sensitive||this.hasUnresolvedQuestion())return;this.eventNudgePending=e;let t=await this.send(e.message);if(this.eventNudgePending===e){this.eventNudgePending=null;let n=ge(this.eventNudge,e,t);[this.eventNudgeClosed,this.eventNudge]=[n,n?null:this.eventNudge]}}async dismissQuestion(e){let t=e.question;t&&await this.send(t.isOther?g(`optionCard.skip`):`cancel`,g(`optionCard.skip`),!0)!==`rejected`&&this.messages.includes(e)&&(this.dismissedQuestions=new Set(this.dismissedQuestions).add(`${e.id}:${t.id}`))}answerQuestion(e,t){let n=e.question;if(!n)return;let r=n.options.find(e=>e.label===t);this.send(r?.reply??t,t,!0)}hasUnresolvedQuestion(){return ke(this.messages,this.dismissedQuestions,this.answeredQuestions,this.wizardInputPending,this.questionReplyUncertain)}exitSetup(){this.context.navigate(`chat`)}canRetry(){return this.retryParams!==null&&this.retryParams.message===void 0}retry(){let e=this.activeClient,t=this.retryParams;e&&t&&t.message===void 0&&this.chatAvailable&&!this.sending&&this.initializeSession(e,t)}handleComposerKeydown(e){e.key!==`Enter`||e.shiftKey||e.isComposing||(e.preventDefault(),this.send())}render(){return s`
      <section class="custodian">
        <header class="custodian__header">
          <div class="custodian__identity">
            <div class="custodian__mark" aria-hidden="true">OC</div>
            <div>
              <h1>${g(`custodian.title`)}</h1>
              <p>${g(this.onboarding?`custodian.subtitle`:`custodian.subtitleCaretaker`)}</p>
            </div>
          </div>
          <div class="custodian__header-actions">
            ${this.historyAvailable?s`<button
                  class="btn btn--ghost custodian__history-toggle"
                  type="button"
                  aria-expanded=${this.historyOpen?`true`:`false`}
                  @click=${()=>this.toggleHistory()}
                >
                  ${g(`custodian.history.button`)}
                </button>`:d}
            ${this.onboarding?s`<button class="btn btn--ghost" type="button" @click=${()=>this.exitSetup()}>
                  ${g(`custodian.exitSetup`)}
                </button>`:d}
          </div>
        </header>

        <div class="custodian__messages" aria-live="polite">
          ${!this.onboarding&&this.eventNudge&&!this.eventNudgePending?ve({nudge:this.eventNudge,disabled:!this.activeClient||!this.chatAvailable||this.sending||this.sensitive||this.hasUnresolvedQuestion(),onSend:()=>void this.sendEventNudge(),onDismiss:()=>void([this.eventNudge,this.eventNudgeClosed]=[null,!0])}):d}
          ${this.messages.map(e=>{let t=e.question?`${e.id}:${e.question.id}`:``,n=e.question!==null&&!this.dismissedQuestions.has(t);return s`
              ${b(Ae(e),{showReasoning:!1,showToolCalls:!1,assistantName:g(`custodian.title`),assistantAvatar:`OC`})}
              ${Ne(e,this.earlierBoundaryAfterId)}
              ${n?F({question:e.question,disabled:this.sending||!this.chatAvailable||this.answeredQuestions.has(t),onSelect:t=>this.answerQuestion(e,t),onSkip:()=>void this.dismissQuestion(e)}):d}
            `})}
          ${this.sending?s`<div class="chat-group assistant custodian__thinking-row" role="status">
                ${me(`assistant`,{name:g(`custodian.title`),avatar:`OC`})}
                <div class="chat-group-messages custodian__thinking">
                  <span></span><span></span><span></span>
                  <span class="sr-only">${g(`custodian.thinking`)}</span>
                </div>
              </div>`:d}
          ${this.abandonedTurnOutcomeUnknown?s`<div class="custodian__error" role="alert">
                <span>${g(`custodian.connectionChanged`)}</span>
              </div>`:d}
          ${this.error&&!(this.abandonedTurnOutcomeUnknown&&this.error===g(`custodian.connectionChanged`))?s`<div class="custodian__error" role="alert">
                <span>${this.error}</span>
                ${this.activeClient&&this.chatAvailable&&this.canRetry()?s`<button class="btn btn--sm" type="button" @click=${()=>this.retry()}>
                      ${g(`common.retry`)}
                    </button>`:d}
              </div>`:d}
        </div>

        ${this.historyOpen&&this.historyAvailable?A({entries:this.historyEntries,error:this.historyError,loaded:this.historyLoaded,loading:this.historyLoading,loadingMore:this.historyLoadingMore,nextCursor:this.historyNextCursor,onLoad:e=>{this.loadHistory(e)}}):d}

        <div class="agent-chat__composer-shell">
          <div class="agent-chat__input">
            <div class="agent-chat__composer-input-row">
              <div class="agent-chat__composer-combobox">
                ${this.sensitive?s`<input
                      type="password"
                      .value=${this.input}
                      autocomplete="off"
                      placeholder=${g(`custodian.sensitivePlaceholder`)}
                      aria-label=${g(`custodian.sensitivePlaceholder`)}
                      ?disabled=${!this.activeClient||!this.chatAvailable||this.sending}
                      @input=${e=>this.input=e.target.value}
                      @keydown=${e=>this.handleComposerKeydown(e)}
                    />`:s`<textarea
                      rows="1"
                      .value=${this.input}
                      autocomplete="on"
                      placeholder=${g(`custodian.placeholder`)}
                      aria-label=${g(`custodian.placeholder`)}
                      ?disabled=${!this.activeClient||!this.chatAvailable||this.sending}
                      @input=${e=>this.input=e.target.value}
                      @keydown=${e=>this.handleComposerKeydown(e)}
                    ></textarea>`}
              </div>
              <div class="agent-chat__composer-actions">
                <button
                  class="chat-send-btn"
                  type="button"
                  aria-label=${g(`custodian.send`)}
                  ?disabled=${!this.input.trim()||!this.activeClient||!this.chatAvailable||this.sending}
                  @click=${()=>void this.send()}
                >
                  ${fe.arrowUp}
                  <span class="agent-chat__control-label">${g(`custodian.send`)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `}},t([a({context:de,subscribe:!0})],$.prototype,`context`,void 0),t([c({attribute:!1})],$.prototype,`onboarding`,void 0),t([c({attribute:!1})],$.prototype,`newAgentIntent`,void 0),t([u()],$.prototype,`messages`,void 0),t([u()],$.prototype,`input`,void 0),t([u()],$.prototype,`sending`,void 0),t([u()],$.prototype,`sensitive`,void 0),t([u()],$.prototype,`wizardInputPending`,void 0),t([u()],$.prototype,`questionReplyUncertain`,void 0),t([u()],$.prototype,`error`,void 0),t([u()],$.prototype,`dismissedQuestions`,void 0),t([u()],$.prototype,`answeredQuestions`,void 0),t([u()],$.prototype,`activeClient`,void 0),t([u()],$.prototype,`chatAvailable`,void 0),t([u()],$.prototype,`historyAvailable`,void 0),t([u()],$.prototype,`historyOpen`,void 0),t([u()],$.prototype,`historyEntries`,void 0),t([u()],$.prototype,`historyNextCursor`,void 0),t([u()],$.prototype,`historyLoading`,void 0),t([u()],$.prototype,`historyLoadingMore`,void 0),t([u()],$.prototype,`historyError`,void 0),t([u()],$.prototype,`eventNudge`,void 0),t([u()],$.prototype,`eventNudgePending`,void 0),customElements.get(`openclaw-custodian-page`)||customElements.define(`openclaw-custodian-page`,$)}))();
//# sourceMappingURL=custodian-page-Bh5lGgRQ.js.map