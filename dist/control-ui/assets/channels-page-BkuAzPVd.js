import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,r as n,s as r,u as i}from"./control-ui-foundation-43q8Lf_T.js";import{dt as a,ft as o}from"./control-ui-foundation-DQl2NL7K.js";import{$ as s,D as c,J as l,U as u,X as d,k as f,z as p}from"./lit-runtime-CE4wpvNA.js";import{Ci as m,Mi as h,Mr as g,Nr as _,Pi as v,_t as y,gt as b,ht as ee}from"./control-ui-core-Dx4utKSD.js";import{I as te,P as ne,Ut as re,at as ie,it as ae,jt as oe}from"./control-ui-core-6OhF3OIO.js";import{o as x,t as S}from"./control-ui-core-CXeSrnoQ.js";import{D as se,at as C,ot as ce}from"./control-ui-core-vPyynwls.js";import{d as le,f as ue,u as de}from"./control-ui-shared-Ca9fxTB8.js";import{n as fe,t as pe}from"./settings-workspace-BhCB-OeS.js";import{a as me,c as w,h as he,m as ge,n as _e,t as T,u as E}from"./settings-ui-BJ5HJKwt.js";import{n as ve,r as ye}from"./markdown-UmoHCmlv.js";import{t as be}from"./openclaw-mascot-Bo-d0_tR.js";import{a as xe,c as Se,i as Ce,s as we}from"./presentation-DqKeN4xp.js";import{n as Te,s as Ee,t as De}from"./config-form-n-iRU_E_.js";async function D(e,t){let n=new AbortController,r=setTimeout(()=>n.abort(new DOMException(`Nostr profile request timed out after 30 seconds`,`TimeoutError`)),k);try{let r=await fetch(e,{...t,signal:n.signal}),i=null;try{i=await r.json()}catch(e){if(n.signal.aborted)throw n.signal.reason??e}return{data:i,response:r}}finally{clearTimeout(r)}}function Oe(e){if(!Array.isArray(e))return{};let t={};for(let n of e){if(typeof n!=`string`)continue;let[e,...r]=n.split(`:`);if(!e||r.length===0)continue;let i=e.trim(),a=r.join(`:`).trim();i&&a&&(t[i]=a)}return t}function O(e,t=``){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}async function ke(e){return await D(O(e.accountId),{method:`PUT`,headers:{"Content-Type":`application/json`,...e.headers},body:JSON.stringify(e.values)})}async function Ae(e){return await D(O(e.accountId,`/import`),{method:`POST`,headers:{"Content-Type":`application/json`,...e.headers},body:JSON.stringify({autoMerge:!0})})}var k,je=e((()=>{k=3e4}));function Me(e){let{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function Ne(e){let{state:t,callbacks:n,accountId:r}=e,i=Me(t),a=(e,r,i={})=>{let{type:a=`text`,placeholder:o,maxLength:c,help:l}=i,u=t.values[e]??``,f=t.fieldErrors[e],p=`nostr-profile-${e}`,m=a===`textarea`?s`
            <textarea
              id="${p}"
              class="settings-input"
              .value=${u}
              placeholder=${o??``}
              maxlength=${c??2e3}
              rows="3"
              @input=${t=>{let r=t.target;n.onFieldChange(e,r.value)}}
              ?disabled=${t.saving}
            ></textarea>
          `:s`
            <input
              id="${p}"
              class="settings-input"
              type=${a}
              .value=${u}
              placeholder=${o??``}
              maxlength=${c??256}
              @input=${t=>{let r=t.target;n.onFieldChange(e,r.value)}}
              ?disabled=${t.saving}
            />
          `;return s`
      <div class="settings-row settings-row--stacked">
        <div class="settings-row__text">
          <label class="settings-row__title" for="${p}">${r}</label>
          ${l?s`<span class="settings-row__desc">${l}</span>`:d}
          ${f?s`<span class="settings-row__desc" style="color: var(--danger);">${f}</span>`:d}
        </div>
        <div class="settings-row__control">${m}</div>
      </div>
    `};return s`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${x(`channels.nostr.editProfile`)}</span>
        <span class="settings-row__desc">${x(`channels.nostr.account`)}: ${r}</span>
      </div>
    </div>

    ${t.error?s`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__title"
                >${E({kind:`danger`,label:x(`channels.lastError`)})}</span
              >
              <span class="settings-row__desc">${t.error}</span>
            </div>
          </div>
        `:d}
    ${t.success?s`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__desc">${t.success}</span>
            </div>
          </div>
        `:d}
    ${(()=>{let e=t.values.picture;return e?s`
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${x(`channels.nostr.profilePicturePreview`)}</span>
        </div>
        <div class="settings-row__control">
          <img
            src=${e}
            alt=${x(`channels.nostr.profilePicturePreview`)}
            style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover;"
            @error=${e=>{let t=e.target;t.style.display=`none`}}
            @load=${e=>{let t=e.target;t.style.display=`block`}}
          />
        </div>
      </div>
    `:d})()}
    ${a(`name`,x(`channels.nostr.username`),{placeholder:x(`channels.nostr.placeholders.username`),maxLength:256,help:x(`channels.nostr.usernameHelp`)})}
    ${a(`displayName`,x(`channels.nostr.displayName`),{placeholder:x(`channels.nostr.placeholders.displayName`),maxLength:256,help:x(`channels.nostr.displayNameHelp`)})}
    ${a(`about`,x(`channels.nostr.bio`),{type:`textarea`,placeholder:x(`channels.nostr.bioPlaceholder`),maxLength:2e3,help:x(`channels.nostr.bioHelp`)})}
    ${a(`picture`,x(`channels.nostr.avatarUrl`),{type:`url`,placeholder:x(`channels.nostr.placeholders.avatarUrl`),help:x(`channels.nostr.avatarHelp`)})}
    ${t.showAdvanced?s`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__title">${x(`channels.nostr.advanced`)}</span>
            </div>
          </div>

          ${a(`banner`,x(`channels.nostr.bannerUrl`),{type:`url`,placeholder:x(`channels.nostr.placeholders.bannerUrl`),help:x(`channels.nostr.bannerHelp`)})}
          ${a(`website`,x(`channels.nostr.website`),{type:`url`,placeholder:x(`channels.nostr.placeholders.website`),help:x(`channels.nostr.websiteHelp`)})}
          ${a(`nip05`,x(`channels.nostr.nip05Identifier`),{placeholder:x(`channels.nostr.placeholders.nip05`),help:x(`channels.nostr.nip05Help`)})}
          ${a(`lud16`,x(`channels.nostr.lightningAddress`),{placeholder:x(`channels.nostr.placeholders.lightningAddress`),help:x(`channels.nostr.lightningHelp`)})}
        `:d}

    <div class="settings-row">
      <div class="settings-row__text">
        ${i?s`<span class="settings-row__desc">${x(`common.unsavedChanges`)}</span>`:d}
      </div>
      <div class="settings-row__control">
        <button
          class="btn primary"
          @click=${n.onSave}
          ?disabled=${t.saving||!i}
        >
          ${t.saving?x(`common.saving`):x(`common.saveAndPublish`)}
        </button>

        <button
          class="btn"
          @click=${n.onImport}
          ?disabled=${t.importing||t.saving}
        >
          ${t.importing?x(`common.importing`):x(`common.importFromRelays`)}
        </button>

        <button class="btn" @click=${n.onToggleAdvanced}>
          ${t.showAdvanced?x(`common.hideAdvanced`):x(`common.showAdvanced`)}
        </button>

        <button class="btn" @click=${n.onCancel} ?disabled=${t.saving}>
          ${x(`common.cancel`)}
        </button>
      </div>
    </div>
  `}function Pe(e){let t={name:e?.name??``,displayName:e?.displayName??``,about:e?.about??``,picture:e?.picture??``,banner:e?.banner??``,website:e?.website??``,nip05:e?.nip05??``,lud16:e?.lud16??``};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}var A=e((()=>{l(),T(),S()})),Fe=e((()=>{}));function Ie(e){switch(e){case`telegram`:return{setupLinks:[{label:`@BotFather`,url:`https://t.me/BotFather`},{label:`web.telegram.org`,url:`https://web.telegram.org`}]};case`discord`:return{setupLinks:[{label:`Developer Portal`,url:`https://discord.com/developers/applications`}]};case`slack`:return{setupLinks:[{label:`api.slack.com/apps`,url:`https://api.slack.com/apps`}]};case`signal`:return{setupLinks:[{label:`signal-cli`,url:`https://github.com/AsamK/signal-cli`}]};default:return{}}}function Le(e){return`https://docs.openclaw.ai/channels/${encodeURIComponent(e)}`}function j(e,t,n){let r=xe(e);if(r)return s`<span class="channels-${n}">
      <img src=${r} alt="" loading="lazy" decoding="async" />
    </span>`;let[i,a]=we(e),o=Se(t);return s`<span
    class="channels-${n} channels-${n}--fallback"
    style=${`--channels-art-a:${i};--channels-art-b:${a}`}
    aria-hidden="true"
  >
    <span>${o}</span>
  </span>`}var M=e((()=>{l(),Ce()}));function Re(e,t){let n=e;for(let e of t){if(!n)return null;let t=de(n);if(t===`object`){let t=n.properties??{};if(typeof e==`string`&&t[e]){n=t[e];continue}let r=n.additionalProperties;if(typeof e==`string`&&r&&typeof r==`object`){n=r;continue}return null}if(t===`array`){if(typeof e!=`number`)return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function ze(e,t){return y(e,t)??{}}function Be(e){let t=P.flatMap(t=>t in e?[[t,e[t]]]:[]);return t.length===0?null:s`
    <div>
      ${t.map(([e,t])=>s`
          <div class="settings-row__desc">${e}: ${ee(t)}</div>
        `)}
    </div>
  `}function Ve(e){let t=Te(e.schema),n=t.schema;if(!n)return s`<div class="settings-row__desc">${x(`channels.config.schemaUnavailable`)}</div>`;let r=Re(n,[`channels`,e.channelId]);if(!r)return s`
      <div class="settings-row__desc">${x(`channels.config.channelSchemaUnavailable`)}</div>
    `;let i=ze(e.configValue??{},e.channelId);return s`
    <div class="config-form">
      ${Ee({schema:r,value:i,path:[`channels`,e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
    ${Be(i)}
  `}function N(e){let{channelId:t,props:n}=e,r=n.configSaving||n.configSchemaLoading;return s`
    <div class="settings-row settings-row--stacked">
      ${n.configSchemaLoading?s`<div class="settings-row__desc">${x(`channels.config.loadingSchema`)}</div>`:Ve({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:r,onPatch:n.onConfigPatch})}
      <div class="settings-row__control">
        <button
          class="btn primary"
          ?disabled=${r||!n.configFormDirty}
          @click=${()=>n.onConfigSave()}
        >
          ${n.configSaving?x(`common.saving`):x(`common.save`)}
        </button>
        <button class="btn" ?disabled=${r} @click=${()=>n.onConfigReload()}>
          ${x(`common.reload`)}
        </button>
      </div>
    </div>
  `}var P,F=e((()=>{l(),De(),S(),b(),P=[`groupPolicy`,`streamMode`,`dmPolicy`]}));function He(e,t){return t.snapshot?.channels?.[e]}function Ue(e,t){let n=t.snapshot?.channelAccounts?.[e]??[],r=t.snapshot?.channelDefaultAccountId?.[e];return(r?n.find(e=>e.accountId===r):void 0)??n[0]??null}function I(e,t){let n=He(e,t),r=t.snapshot?.channelAccounts?.[e]??[],i=Ue(e,t);return{configured:typeof n?.configured==`boolean`?n.configured:typeof i?.configured==`boolean`?i.configured:null,running:typeof n?.running==`boolean`?n.running:null,connected:typeof n?.connected==`boolean`?n.connected:null,defaultAccount:i,hasAnyActiveAccount:r.some(e=>e.configured||e.running||e.connected),status:n}}function L(e,t){if(!t.snapshot)return!1;let n=I(e,t);return n.configured===!0||n.running===!0||n.connected===!0||n.hasAnyActiveAccount}function R(e,t){return I(e,t).configured}function z(e){return x(e==null?`common.na`:e?`common.yes`:`common.no`)}function B(e){return e===!0?`ok`:`muted`}function V(e){return s`
    <dl class="settings-kv">
      ${e.map(e=>s`
          <dt>${e.label}</dt>
          <dd>
            ${e.kind===void 0?e.value:E({kind:e.kind,label:e.value})}
          </dd>
        `)}
    </dl>
  `}function H(e){return s`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${E({kind:`danger`,label:x(`channels.lastError`)})}</span
        >
        <span class="settings-row__desc">${e}</span>
      </div>
    </div>
  `}function U(e){let t=[e.status??``,e.error??``].filter(Boolean).join(` `);return s`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${E({kind:e.ok?`ok`:`danger`,label:e.ok?x(`common.probeOk`):x(`common.probeFailed`)})}</span
        >
        ${t?s`<span class="settings-row__desc">${t}</span>`:d}
      </div>
    </div>
  `}function W(e){return s`
    <div class="settings-row">
      <div class="settings-row__text"></div>
      <div class="settings-row__control">${e}</div>
    </div>
  `}function G(e){let t=[e.accountId,...e.facts??[]].join(` · `);return s`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${e.title}</span>
        <span class="settings-row__desc">${t}</span>
        ${e.lastError?s`<span class="settings-row__desc">${e.lastError}</span>`:d}
      </div>
      <div class="settings-row__control">
        ${E(e.status)}
        <span class="settings-row__value"
          >${e.lastInboundAt?n(e.lastInboundAt):x(`common.na`)}</span
        >
      </div>
    </div>
  `}function K(e){return w({title:e.title,description:e.subtitle,...e.accountCount===void 0?{}:{count:e.accountCount}},s`
      ${V(e.statusRows)}
      ${e.lastError?H(e.lastError):d}
      ${e.secondaryCallout??d} ${e.extraContent??d}
      ${e.configSection} ${e.footer?W(e.footer):d}
    `)}function We(e,t){return t?.[e]?.length??0}function q(e,t){let n=We(e,t);return n>=2?n:void 0}var J=e((()=>{l(),T(),S(),m()}));function Ge(e){let{props:t,discord:r,accountCount:i}=e,a=R(`discord`,t);return K({title:x(`channels.discord.title`),subtitle:x(`channels.discord.subtitle`),accountCount:i,statusRows:[{label:x(`common.configured`),value:z(a),kind:B(a)},{label:x(`common.running`),value:r?.running?x(`common.yes`):x(`common.no`),kind:B(r?.running)},{label:x(`common.lastStart`),value:r?.lastStartAt?n(r.lastStartAt):x(`common.na`)},{label:x(`common.lastProbe`),value:r?.lastProbeAt?n(r.lastProbeAt):x(`common.na`)}],lastError:r?.lastError,secondaryCallout:r?.probe?U(r.probe):d,configSection:N({channelId:`discord`,props:t}),footer:s`<button class="btn" @click=${()=>t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`})}var Ke=e((()=>{l(),S(),m(),F(),J()}));function qe(e){let{props:t,googleChat:r,accountCount:i}=e,a=R(`googlechat`,t);return K({title:x(`channels.googleChat.title`),subtitle:x(`channels.googleChat.subtitle`),accountCount:i,statusRows:[{label:x(`common.configured`),value:z(a),kind:B(a)},{label:x(`common.running`),value:r?r.running?x(`common.yes`):x(`common.no`):x(`common.na`),kind:B(r?.running)},{label:x(`common.credential`),value:r?.credentialSource??x(`common.na`)},{label:x(`common.audience`),value:r?.audienceType?`${r.audienceType}${r.audience?` · ${r.audience}`:``}`:x(`common.na`)},{label:x(`common.lastStart`),value:r?.lastStartAt?n(r.lastStartAt):x(`common.na`)},{label:x(`common.lastProbe`),value:r?.lastProbeAt?n(r.lastProbeAt):x(`common.na`)}],lastError:r?.lastError,secondaryCallout:r?.probe?U(r.probe):d,configSection:N({channelId:`googlechat`,props:t}),footer:s`<button class="btn" @click=${()=>t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`})}var Je=e((()=>{l(),S(),m(),F(),J()}));function Ye(e){let{props:t,imessage:r,accountCount:i}=e,a=R(`imessage`,t);return K({title:x(`channels.imessage.title`),subtitle:x(`channels.imessage.subtitle`),accountCount:i,statusRows:[{label:x(`common.configured`),value:z(a),kind:B(a)},{label:x(`common.running`),value:r?.running?x(`common.yes`):x(`common.no`),kind:B(r?.running)},{label:x(`common.lastStart`),value:r?.lastStartAt?n(r.lastStartAt):x(`common.na`)},{label:x(`common.lastProbe`),value:r?.lastProbeAt?n(r.lastProbeAt):x(`common.na`)}],lastError:r?.lastError,secondaryCallout:r?.probe?U(r.probe):d,configSection:N({channelId:`imessage`,props:t}),footer:s`<button class="btn" @click=${()=>t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`})}var Xe=e((()=>{l(),S(),m(),F(),J()}));function Y(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:x(`common.na`)}function Ze(e){let{props:t,nostr:r,nostrAccounts:i,accountCount:a,profileFormState:o,profileFormCallbacks:c,onEditProfile:l}=e,u=i[0],f=r?.configured??u?.configured??!1,p=r?.running??u?.running??!1,m=r?.publicKey??u?.publicKey,h=r?.lastStartAt??u?.lastStartAt??null,g=r?.lastError??u?.lastError??null,_=i.length>1,v=o!=null,y=e=>{let t=e.publicKey,n=e.profile;return G({title:n?.displayName??n?.name??e.name??e.accountId,accountId:e.accountId,facts:[`${x(`common.configured`)}: ${e.configured?x(`common.yes`):x(`common.no`)}`,`${x(`common.publicKey`)}: ${Y(t)}`],status:{kind:B(e.running),label:e.running?x(`common.running`):x(`common.no`)},lastInboundAt:e.lastInboundAt,lastError:e.lastError})},b=()=>{if(v&&c)return Ne({state:o,callbacks:c,accountId:i[0]?.accountId??`default`});let{name:e,displayName:t,about:n,picture:a,nip05:p}=u?.profile??r?.profile??{},m=e||t||n||a||p;return s`
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${x(`channels.nostr.profile`)}</span>
          ${m?d:s`<span class="settings-row__desc"
                >${x(`channels.nostr.noProfile`)} ${x(`channels.nostr.noProfileHint`)}</span
              >`}
        </div>
        ${f?s`
              <div class="settings-row__control">
                <button class="btn btn--sm" @click=${l}>
                  ${x(`channels.nostr.editProfile`)}
                </button>
              </div>
            `:d}
      </div>
      ${m?s`
            <dl class="settings-kv">
              ${a?s`
                    <dt>${x(`channels.nostr.profilePicture`)}</dt>
                    <dd>
                      <img
                        style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;"
                        src=${a}
                        alt=${x(`channels.nostr.profilePicture`)}
                        @error=${e=>{e.target.style.display=`none`}}
                      />
                    </dd>
                  `:d}
              ${e?s`<dt>${x(`channels.nostr.name`)}</dt>
                    <dd>${e}</dd>`:d}
              ${t?s`<dt>${x(`channels.nostr.displayName`)}</dt>
                    <dd>${t}</dd>`:d}
              ${n?s`<dt>${x(`channels.nostr.about`)}</dt>
                    <dd>${n}</dd>`:d}
              ${p?s`<dt>NIP-05</dt>
                    <dd>${p}</dd>`:d}
            </dl>
          `:d}
    `};return w({title:x(`channels.nostr.title`),description:x(`channels.nostr.subtitle`),...a===void 0?{}:{count:a}},s`
      ${_?i.map(e=>y(e)):V([{label:x(`common.configured`),value:x(f?`common.yes`:`common.no`),kind:B(f)},{label:x(`common.running`),value:x(p?`common.yes`:`common.no`),kind:B(p)},{label:x(`common.publicKey`),value:s`<code title="${m??``}"
                >${Y(m)}</code
              >`},{label:x(`common.lastStart`),value:h?n(h):x(`common.na`)}])}
      ${g?H(g):d}
      ${b()} ${N({channelId:`nostr`,props:t})}
      ${W(s`<button class="btn" @click=${()=>t.onRefresh(!1)}>
          ${x(`common.refresh`)}
        </button>`)}
    `)}var Qe=e((()=>{l(),T(),S(),m(),F(),A(),J()}));function $e(e){let{props:t,signal:r,accountCount:i}=e,a=R(`signal`,t);return K({title:x(`channels.signal.title`),subtitle:x(`channels.signal.subtitle`),accountCount:i,statusRows:[{label:x(`common.configured`),value:z(a),kind:B(a)},{label:x(`common.running`),value:r?.running?x(`common.yes`):x(`common.no`),kind:B(r?.running)},{label:x(`common.baseUrl`),value:r?.baseUrl??x(`common.na`)},{label:x(`common.lastStart`),value:r?.lastStartAt?n(r.lastStartAt):x(`common.na`)},{label:x(`common.lastProbe`),value:r?.lastProbeAt?n(r.lastProbeAt):x(`common.na`)}],lastError:r?.lastError,secondaryCallout:r?.probe?U(r.probe):d,configSection:N({channelId:`signal`,props:t}),footer:s`<button class="btn" @click=${()=>t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`})}var et=e((()=>{l(),S(),m(),F(),J()}));function tt(e){let{props:t,slack:r,accountCount:i}=e,a=R(`slack`,t);return K({title:x(`channels.slack.title`),subtitle:x(`channels.slack.subtitle`),accountCount:i,statusRows:[{label:x(`common.configured`),value:z(a),kind:B(a)},{label:x(`common.running`),value:r?.running?x(`common.yes`):x(`common.no`),kind:B(r?.running)},{label:x(`common.lastStart`),value:r?.lastStartAt?n(r.lastStartAt):x(`common.na`)},{label:x(`common.lastProbe`),value:r?.lastProbeAt?n(r.lastProbeAt):x(`common.na`)}],lastError:r?.lastError,secondaryCallout:r?.probe?U(r.probe):d,configSection:N({channelId:`slack`,props:t}),footer:s`<button class="btn" @click=${()=>t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`})}var nt=e((()=>{l(),S(),m(),F(),J()}));function rt(e){let{props:t,telegram:r,telegramAccounts:i,accountCount:a}=e,o=i.length>1,c=R(`telegram`,t),l=e=>{let t=e.probe?.bot?.username,n=e.name||e.accountId;return G({title:t?`@${t}`:n,accountId:e.accountId,facts:[`${x(`common.configured`)}: ${e.configured?x(`common.yes`):x(`common.no`)}`],status:{kind:B(e.running),label:e.running?x(`common.running`):x(`common.no`)},lastInboundAt:e.lastInboundAt,lastError:e.lastError})};return o?w({title:x(`channels.telegram.title`),description:x(`channels.telegram.subtitle`),...a===void 0?{}:{count:a}},s`
        ${i.map(e=>l(e))}
        ${r?.lastError?H(r.lastError):d}
        ${r?.probe?U(r.probe):d}
        ${N({channelId:`telegram`,props:t})}
        ${W(s`<button class="btn" @click=${()=>t.onRefresh(!0)}>
            ${x(`common.probe`)}
          </button>`)}
      `):K({title:x(`channels.telegram.title`),subtitle:x(`channels.telegram.subtitle`),accountCount:a,statusRows:[{label:x(`common.configured`),value:z(c),kind:B(c)},{label:x(`common.running`),value:r?.running?x(`common.yes`):x(`common.no`),kind:B(r?.running)},{label:x(`common.mode`),value:r?.mode??x(`common.na`)},{label:x(`common.lastStart`),value:r?.lastStartAt?n(r.lastStartAt):x(`common.na`)},{label:x(`common.lastProbe`),value:r?.lastProbeAt?n(r.lastProbeAt):x(`common.na`)}],lastError:r?.lastError,secondaryCallout:r?.probe?U(r.probe):d,configSection:N({channelId:`telegram`,props:t}),footer:s`<button class="btn" @click=${()=>t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`})}var it=e((()=>{l(),T(),S(),m(),F(),J()}));function at(e){let{props:t,whatsapp:i,accountCount:a}=e,o=R(`whatsapp`,t),c=i?.linked===!0,l=t.whatsappQrDataUrl!=null;return K({title:x(`channels.whatsapp.title`),subtitle:x(`channels.whatsapp.subtitle`),accountCount:a,statusRows:[{label:x(`common.configured`),value:z(o),kind:B(o)},{label:x(`common.linked`),value:i?.linked?x(`common.yes`):x(`common.no`),kind:B(i?.linked)},{label:x(`common.running`),value:i?.running?x(`common.yes`):x(`common.no`),kind:B(i?.running)},{label:x(`common.connected`),value:i?.connected?x(`common.yes`):x(`common.no`),kind:B(i?.connected)},{label:x(`common.lastConnect`),value:i?.lastConnectedAt?n(i.lastConnectedAt):x(`common.na`)},{label:x(`common.lastMessage`),value:i?.lastMessageAt?n(i.lastMessageAt):x(`common.na`)},{label:x(`common.authAge`),value:i?.authAgeMs==null?x(`common.na`):r(i.authAgeMs)}],lastError:i?.lastError,extraContent:s`
      ${t.whatsappMessage?s`
            <div class="settings-row">
              <div class="settings-row__text">
                <span class="settings-row__desc">${t.whatsappMessage}</span>
              </div>
            </div>
          `:d}
      ${t.whatsappQrDataUrl?s`
            <div class="settings-row settings-row--stacked">
              <div class="qr-wrap">
                <img src=${t.whatsappQrDataUrl} alt="WhatsApp QR" />
              </div>
            </div>
          `:d}
    `,configSection:N({channelId:`whatsapp`,props:t}),footer:s`
      ${c?s`<button
            class="btn"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppStart(!0)}
          >
            ${x(`common.relink`)}
          </button>`:s`<button
            class="btn primary"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppStart(!1)}
          >
            ${t.whatsappBusy?x(`common.working`):x(`common.showQr`)}
          </button>`}
      ${l?s`<button
            class="btn"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppWait()}
          >
            ${x(`common.waitForScan`)}
          </button>`:d}
      <button
        class="btn danger"
        ?disabled=${t.whatsappBusy}
        @click=${()=>t.onWhatsAppLogout()}
      >
        ${x(`common.logout`)}
      </button>
      <button class="btn" @click=${()=>t.onRefresh(!0)}>${x(`common.refresh`)}</button>
    `})}var ot=e((()=>{l(),S(),m(),F(),J()}));function st(e,t,n){let r=q(e,n.channelAccounts);switch(e){case`whatsapp`:return at({props:t,whatsapp:n.whatsapp,accountCount:r});case`telegram`:return rt({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCount:r});case`discord`:return Ge({props:t,discord:n.discord,accountCount:r});case`googlechat`:return qe({props:t,googleChat:n.googlechat,accountCount:r});case`slack`:return tt({props:t,slack:n.slack,accountCount:r});case`signal`:return $e({props:t,signal:n.signal,accountCount:r});case`imessage`:return Ye({props:t,imessage:n.imessage,accountCount:r});case`nostr`:{let e=n.channelAccounts?.nostr??[],i=e[0],a=i?.accountId??`default`,o=i?.profile??null,s=t.nostrProfileAccountId===a?t.nostrProfileFormState:null,c=s?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return Ze({props:t,nostr:n.nostr,nostrAccounts:e,accountCount:r,profileFormState:s,profileFormCallbacks:c,onEditProfile:()=>t.onNostrProfileEdit(a,o)})}default:return ct(e,t,n.channelAccounts??{})}}function ct(e,t,n){let r=t.snapshot?.channelLabels?.[e]??e,i=I(e,t),a=typeof i.status?.lastError==`string`?i.status.lastError:void 0,o=n[e]??[],c=q(e,n);return w({title:r,description:x(`channels.generic.subtitle`),...c===void 0?{}:{count:c}},s`
      ${o.length>0?o.map(e=>G({title:e.name||e.accountId,accountId:e.accountId,status:{kind:B(e.running??e.configured),label:e.running?x(`common.running`):e.configured?x(`common.configured`):x(`common.no`)},lastInboundAt:e.lastInboundAt,lastError:e.lastError})):V([{label:x(`common.configured`),value:z(i.configured),kind:B(i.configured)},{label:x(`common.running`),value:z(i.running),kind:B(i.running)},{label:x(`common.connected`),value:z(i.connected),kind:B(i.connected)}])}
      ${a?H(a):d}
      ${N({channelId:e,props:t})}
    `)}function lt(e){let t=st(e.channelId,e.props,e.data);return s`
    <openclaw-modal-dialog label=${e.label} @modal-cancel=${()=>e.onClose()}>
      <div class="channels-detail">
        <div class="channels-detail__header">
          ${j(e.channelId,e.label,`cover`)}
          <div class="channels-detail__header-actions">
            <button type="button" class="btn btn--sm" @click=${()=>e.onSetup()}>
              ${x(`channels.hub.runSetup`)}
            </button>
            <button
              type="button"
              class="btn channels-detail__close"
              aria-label=${x(`common.close`)}
              @click=${()=>e.onClose()}
            >
              ✕
            </button>
          </div>
        </div>
        <div class="channels-detail__body">
          ${e.props.setupBlockedByDirtyConfig&&e.props.configFormDirty?s`<div class="callout warn">${x(`channels.hub.saveBeforeSetup`)}</div>`:d}
          ${t}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var ut=e((()=>{l(),T(),S(),se(),M(),F(),Ke(),Je(),Xe(),Qe(),J(),et(),nt(),it(),ot()}));function dt(e){return typeof e.initialValue==`string`?e.initialValue:``}function X(e){return e.wizard.phase===`step`&&e.wizard.busy}function ft(e,t){let n=e.message?.trim()??``,r=n.includes(`{`)||n.includes(`  `);return s`
    ${e.title?s`<div class="channels-wizard__message">${e.title}</div>`:d}
    ${n?s`<div
          class="channels-wizard__note ${r?`channels-wizard__note--code`:``}"
        >
          ${n}
        </div>`:d}
    ${n?s`
          <div class="channels-wizard__links">
            <button type="button" class="btn btn--sm" @click=${()=>void le(n)}>
              ${x(`channels.setup.copyText`)}
            </button>
          </div>
        `:d}
    <div class="channels-wizard__footer">
      <button
        type="button"
        class="btn primary"
        ?disabled=${X(t)}
        @click=${()=>t.onAnswer(null)}
      >
        ${x(`channels.setup.continue`)}
      </button>
    </div>
  `}function pt(e,t){let n=e.options??[],r=n.findIndex(t=>t.value===e.initialValue);return s`
    <wa-radio-group
      class="channels-wizard__options"
      label=${e.message??``}
      orientation="vertical"
      .value=${r>=0?String(r):null}
      ?disabled=${X(t)}
      @change=${e=>{let r=e.currentTarget.value,i=n[Number(r)];i&&t.onAnswer(i.value)}}
    >
      ${n.map((e,t)=>s`
          <wa-radio
            class="channels-wizard__option"
            appearance="button"
            value=${String(t)}
            .checked=${t===r}
          >
            <span class="channels-wizard__option-label">${e.label}</span>
            ${e.hint?s`<span class="channels-wizard__option-hint">${e.hint}</span>`:d}
          </wa-radio>
        `)}
    </wa-radio-group>
  `}function mt(e,t){let n=e.options??[],r=new Set(t.multiselectValues);return s`
    <div class="channels-wizard__message">${e.message??``}</div>
    <div class="channels-wizard__options">
      ${n.map(e=>s`
          <button
            type="button"
            class="channels-wizard__option"
            aria-pressed=${r.has(e.value)?`true`:`false`}
            ?disabled=${X(t)}
            @click=${()=>t.onToggleMultiselect(e.value)}
          >
            <span class="channels-wizard__option-label">
              ${r.has(e.value)?`☑`:`☐`} ${e.label}
            </span>
            ${e.hint?s`<span class="channels-wizard__option-hint">${e.hint}</span>`:d}
          </button>
        `)}
    </div>
    <div class="channels-wizard__footer">
      <button
        type="button"
        class="btn primary"
        ?disabled=${X(t)}
        @click=${()=>t.onAnswer([...t.multiselectValues])}
      >
        ${x(`channels.setup.continue`)}
      </button>
    </div>
  `}function ht(e,t){return s`
    <form @submit=${e=>{e.preventDefault();let n=e.currentTarget.elements.namedItem(`wizard-text`);t.onAnswer(n?.value??``)}}>
      <div class="channels-wizard__message">${e.message??``}</div>
      <input
        class="input"
        style="margin-top: 10px; width: 100%;"
        name="wizard-text"
        type=${e.sensitive?`password`:`text`}
        autocomplete=${e.sensitive?`off`:`on`}
        placeholder=${e.placeholder??``}
        .value=${dt(e)}
        ?disabled=${X(t)}
      />
      <div class="channels-wizard__footer" style="margin-top: 12px;">
        <button type="submit" class="btn primary" ?disabled=${X(t)}>
          ${x(`channels.setup.continue`)}
        </button>
      </div>
    </form>
  `}function gt(e,t){return s`
    <div class="channels-wizard__message">${e.message??``}</div>
    <div class="channels-wizard__footer">
      <button
        type="button"
        class="btn"
        ?disabled=${X(t)}
        @click=${()=>t.onAnswer(!1)}
      >
        ${x(`common.no`)}
      </button>
      <button
        type="button"
        class="btn primary"
        ?disabled=${X(t)}
        @click=${()=>t.onAnswer(!0)}
      >
        ${x(`common.yes`)}
      </button>
    </div>
  `}function _t(e,t){switch(e.type){case`select`:return pt(e,t);case`multiselect`:return mt(e,t);case`text`:return ht(e,t);case`confirm`:return gt(e,t);default:return ft(e,t)}}function vt(e){let t=e.whatsappConnected===!0;return s`
    <div class="channels-wizard__message">
      ${x(t?`channels.setup.whatsappLinked`:`channels.setup.whatsappScanTitle`)}
    </div>
    ${e.whatsappMessage?s`<div class="channels-wizard__note">${e.whatsappMessage}</div>`:d}
    ${t?d:s`
          <div class="channels-wizard__qr">
            ${e.whatsappQrDataUrl?s`<img src=${e.whatsappQrDataUrl} alt="WhatsApp pairing QR code" />`:s`<div class="channels-wizard__spinner">
                  ${e.whatsappBusy?x(`channels.setup.whatsappQrLoading`):x(`channels.setup.whatsappQrHint`)}
                </div>`}
          </div>
          <div class="channels-wizard__note">${x(`channels.setup.whatsappScanHelp`)}</div>
        `}
    <div class="channels-wizard__footer">
      ${t?s`
            <button type="button" class="btn primary" @click=${()=>e.onClose()}>
              ${x(`channels.setup.finish`)}
            </button>
          `:s`
            <button
              type="button"
              class="btn"
              ?disabled=${e.whatsappBusy}
              @click=${()=>e.onWhatsAppStart(!0)}
            >
              ${e.whatsappQrDataUrl?x(`channels.setup.regenerateQr`):x(`common.showQr`)}
            </button>
            ${e.whatsappQrDataUrl?s`
                  <button
                    type="button"
                    class="btn primary"
                    ?disabled=${e.whatsappBusy}
                    @click=${()=>e.onWhatsAppWait()}
                  >
                    ${x(`common.waitForScan`)}
                  </button>
                `:d}
            <button type="button" class="btn" @click=${()=>e.onClose()}>
              ${x(`channels.setup.linkLater`)}
            </button>
          `}
    </div>
  `}function yt(e,t){return e.includes(`whatsapp`)?vt(t):e.length===0?s`
      <div class="channels-wizard__message">${x(`channels.setup.doneNoChangesTitle`)}</div>
      <div class="channels-wizard__note">${x(`channels.setup.doneNoChangesBody`)}</div>
      <div class="channels-wizard__footer">
        <button type="button" class="btn primary" @click=${()=>t.onClose()}>
          ${x(`common.close`)}
        </button>
      </div>
    `:s`
    <div class="channels-wizard__message">${x(`channels.setup.doneTitle`)}</div>
    <div class="channels-wizard__note">${x(`channels.setup.doneBody`)}</div>
    <div class="channels-wizard__footer">
      <button type="button" class="btn primary" @click=${()=>t.onClose()}>
        ${x(`channels.setup.finish`)}
      </button>
    </div>
  `}function bt(e,t){let n=[...e?Ie(e).setupLinks??[]:[]];return t?.externalUrl&&n.unshift({label:x(`channels.setup.openLink`),url:t.externalUrl}),e&&n.push({label:x(`channels.setup.docs`),url:Le(e)}),n.length===0?d:s`
    <div class="channels-wizard__links">
      ${n.map(e=>s`
          <a class="btn btn--sm" href=${e.url} target="_blank" rel="noreferrer noopener">
            ${e.label} ↗
          </a>
        `)}
    </div>
  `}function xt(e){let t=e.wizard;if(t.phase===`idle`)return d;let n=t.channel,r=n?e.channelLabel(n):x(`channels.setup.genericTitle`),i=t.phase===`step`?t.step:null,a;return t.phase===`starting`?a=s`<div class="channels-wizard__spinner">${x(`channels.setup.starting`)}</div>`:t.phase===`error`?a=s`
      <div class="channels-wizard__error">${t.message}</div>
      <div class="channels-wizard__footer">
        <button type="button" class="btn" @click=${()=>e.onClose()}>
          ${x(`common.close`)}
        </button>
      </div>
    `:t.phase===`done`?a=yt(t.channels,e):i&&(a=s`
      ${t.phase===`step`&&t.validationError?s`<div class="channels-wizard__error">${t.validationError}</div>`:d}
      ${_t(i,e)}
      ${t.phase===`step`&&t.busy?s`<div class="channels-wizard__spinner">${x(`channels.setup.working`)}</div>`:d}
    `),s`
    <openclaw-modal-dialog
      label=${x(`channels.setup.dialogLabel`,{channel:r})}
      @modal-cancel=${()=>e.onClose()}
    >
      <div class="channels-wizard">
        <div class="channels-wizard__header">
          ${n?j(n,r,`tile`):d}
          <div class="channels-wizard__heading">
            <h2>${x(`channels.setup.title`,{channel:r})}</h2>
            <div class="muted">${x(`channels.setup.subtitle`)}</div>
          </div>
        </div>
        <div class="channels-wizard__body">${bt(n,i)} ${a}</div>
      </div>
    </openclaw-modal-dialog>
  `}var St=e((()=>{he(),ge(),l(),S(),se(),ue(),M()}));function Ct(e){let t=Tt(e.snapshot),r=t.filter(t=>L(t,e)),i=t.filter(t=>!L(t,e)),a=!!(e.loading&&e.snapshot&&e.lastSuccessAt),o=e.snapshot?.warnings?.filter(e=>e.trim())??[],c=wt(e),l=e.selectedChannel;return s`
    ${me(s`
      ${a?s`<div class="callout info">${x(`channels.refreshingStaleSnapshot`)}</div>`:d}
      ${e.snapshot?.partial?s`
            <div class="callout warn">
              ${x(`channels.hub.partialSnapshot`)}
              ${o.length>0?o.slice(0,3).join(`; `):``}
            </div>
          `:d}
      ${e.lastError?s`<div class="callout danger">${e.lastError}</div>`:d}
      ${e.setupBlockedByDirtyConfig&&e.configFormDirty?s`<div class="callout warn">${x(`channels.hub.saveBeforeSetup`)}</div>`:d}
      ${w({title:x(`channels.hub.connectedTitle`),...r.length>0?{count:r.length}:{},actions:s`
            <span class="settings-row__value">
              ${e.lastSuccessAt?x(`channels.hub.updatedAgo`,{ago:n(e.lastSuccessAt)}):x(`common.na`)}
            </span>
            <button
              type="button"
              class="btn btn--sm"
              ?disabled=${e.loading}
              @click=${()=>e.onRefresh(!0)}
            >
              ${x(`common.refresh`)}
            </button>
          `},r.length===0?s`
              <div class="channels-empty">
                <!-- No configured transports is a true empty state, so Clawd rests here. -->
                <openclaw-mascot mood="sleepy" .size=${80}></openclaw-mascot>
                ${_e(x(`channels.hub.noneConnected`))}
              </div>
            `:r.map(t=>At(t,e)))}
      ${w({title:x(`channels.hub.addTitle`),description:x(`channels.hub.addSubtitle`)},s`
          ${i.map(t=>jt(t,e))} ${Mt(e)}
        `)}
      ${w({title:x(`channels.health.title`),description:x(`channels.health.subtitle`)},s`
          <div class="settings-row settings-row--stacked">
            <pre class="code-block">
${e.snapshot?f(ve(JSON.stringify(e.snapshot,null,2))):x(`channels.health.noSnapshotYet`)}</pre>
          </div>
        `)}
    `)}
    ${l?lt({channelId:l,label:Q(e.snapshot,l),props:e,data:c,onClose:()=>e.onCloseDetail(),onSetup:()=>e.onStartSetup(l)}):d}
    ${xt({wizard:e.wizard,channelLabel:t=>Q(e.snapshot,t),multiselectValues:e.wizardMultiselect,onToggleMultiselect:e.onWizardToggleMultiselect,onAnswer:e.onWizardAnswer,onClose:e.onWizardClose,whatsappQrDataUrl:e.whatsappQrDataUrl,whatsappMessage:e.whatsappMessage,whatsappConnected:e.whatsappConnected,whatsappBusy:e.whatsappBusy,onWhatsAppStart:e.onWhatsAppStart,onWhatsAppWait:e.onWhatsAppWait})}
  `}function wt(e){let t=e.snapshot?.channels;return{whatsapp:t?.whatsapp??void 0,telegram:t?.telegram??void 0,discord:t?.discord??null,googlechat:t?.googlechat??null,slack:t?.slack??null,signal:t?.signal??null,imessage:t?.imessage??null,nostr:t?.nostr??null,channelAccounts:e.snapshot?.channelAccounts??null}}function Tt(e){return e?.channelMeta?.length?e.channelMeta.map(e=>e.id):e?.channelOrder?.length?e.channelOrder:[`whatsapp`,`telegram`,`discord`,`googlechat`,`slack`,`signal`,`imessage`,`nostr`]}function Z(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(e=>[e.id,e])):{}}function Q(e,t){return Z(e)[t]?.label??e?.channelLabels?.[t]??t}function Et(e,t){let n=Z(e)[t]?.detailLabel??e?.channelDetailLabels?.[t]??null;return n&&n!==Q(e,t)?n:null}function Dt(e,t){let n=I(e,t);return(typeof n.status?.lastError==`string`&&n.status.lastError.trim()?n.status.lastError:(t.snapshot?.channelAccounts?.[e]??[]).find(e=>e.lastError)?.lastError)?`attention`:n.running===!0||n.connected===!0?`running`:`configured`}function Ot(e){switch(e){case`running`:return E({kind:`ok`,label:x(`channels.hub.stateRunning`)});case`configured`:return E({kind:`muted`,label:x(`channels.hub.stateConfigured`)});case`attention`:return E({kind:`danger`,label:x(`channels.hub.stateAttention`)});default:return e}}function kt(e,t){let r=(t.snapshot?.channelAccounts?.[e]??[]).map(e=>e.lastInboundAt??0).reduce((e,t)=>Math.max(e,t),0);return r?x(`channels.hub.lastMessageAgo`,{ago:n(r)}):null}function At(e,t){let n=Q(t.snapshot,e),r=kt(e,t)??Et(t.snapshot,e)??x(`channels.hub.openDetails`);return s`
    <button
      type="button"
      class="settings-row settings-row--nav channels-item"
      @click=${()=>t.onShowDetail(e)}
    >
      ${j(e,n,`tile`)}
      <div class="settings-row__text">
        <span class="settings-row__title">${n}</span>
        <span class="settings-row__desc">${r}</span>
      </div>
      <div class="settings-row__control">
        ${Ot(Dt(e,t))}
        <span class="settings-row__chevron">${C.chevronRight}</span>
      </div>
    </button>
  `}function jt(e,t){let n=Q(t.snapshot,e),r=Et(t.snapshot,e)??x(`channels.hub.guidedSetup`);return s`
    <div class="settings-row channels-item">
      <button
        type="button"
        class="channels-item__detail"
        title=${x(`channels.hub.openDetails`)}
        @click=${()=>t.onShowDetail(e)}
      >
        ${j(e,n,`tile`)}
        <span class="settings-row__text">
          <span class="settings-row__title">${n}</span>
          <span class="settings-row__desc">${r}</span>
        </span>
      </button>
      <div class="settings-row__control">
        <button type="button" class="btn btn--sm" @click=${()=>t.onStartSetup(e)}>
          ${x(`channels.hub.setUp`)}
        </button>
      </div>
    </div>
  `}function Mt(e){return s`
    <button
      type="button"
      class="settings-row settings-row--nav channels-item"
      @click=${()=>e.onStartSetup(null)}
    >
      <span
        class="channels-tile channels-tile--fallback"
        style="--channels-art-a:#64748b;--channels-art-b:#1e293b"
        aria-hidden="true"
      >
        <span>+</span>
      </span>
      <div class="settings-row__text">
        <span class="settings-row__title">${x(`channels.hub.browseAllTitle`)}</span>
        <span class="settings-row__desc">${x(`channels.hub.browseAllSubtitle`)}</span>
      </div>
      <div class="settings-row__control">
        <span class="settings-row__chevron">${C.chevronRight}</span>
      </div>
    </button>
  `}var Nt=e((()=>{l(),c(),Fe(),ce(),ye(),be(),T(),S(),m(),M(),ut(),J(),St()}));async function Pt(e,t,n,r){let i,a=!1,o=e.request(t,n).then(e=>(a&&r?.(e),e));try{return await Promise.race([o,new Promise((e,n)=>{i=setTimeout(()=>{a=!0,n(Error(`wizard request timed out: ${t}`))},It)})])}finally{clearTimeout(i)}}function Ft(e,t){!t.sessionId||t.done||e.request(`wizard.cancel`,{sessionId:t.sessionId}).catch(()=>{})}var It,Lt,Rt=e((()=>{It=12e4,Lt=class{constructor(e,t,n=()=>!1){this.getClient=e,this.onChange=t,this.isKnownChannel=n,this.currentState={phase:`idle`},this.sessionId=null,this.channel=null,this.stepIndex=0,this.generation=0}get state(){return this.currentState}async start(e){let t=this.getClient();if(!t)return;let n=++this.generation;this.sessionId=null,this.channel=e,this.stepIndex=0,this.setState({phase:`starting`,channel:e});try{let r=await Pt(t,`wizard.start`,{flow:`channels`,...e?{channel:e}:{}},e=>Ft(t,e));if(this.generation!==n){Ft(t,r);return}this.sessionId=r.sessionId??null,this.applyResult(r)}catch(t){if(this.generation!==n)return;this.setState({phase:`error`,channel:e,message:String(t)})}}async answer(e){let t=this.getClient(),n=this.currentState;if(!t||!this.sessionId||n.phase!==`step`||n.busy)return;let r=this.generation;n.step.type===`select`&&typeof e==`string`&&this.isKnownChannel(e)&&(this.channel??=e),this.setState({...n,busy:!0,validationError:null});try{let i=await Pt(t,`wizard.next`,{sessionId:this.sessionId,answer:{stepId:n.step.id,value:e}});if(this.generation!==r)return;this.applyResult(i)}catch(e){if(this.generation!==r)return;this.setState({phase:`error`,channel:this.channel,message:String(e)})}}async cancel(){let e=this.getClient(),t=this.sessionId;if(this.generation+=1,this.sessionId=null,this.channel=null,this.setState({phase:`idle`}),e&&t)try{await e.request(`wizard.cancel`,{sessionId:t})}catch{}}applyResult(e){if(!e.done&&e.step){this.stepIndex+=1,this.setState({phase:`step`,channel:this.channel,step:e.step,stepIndex:this.stepIndex,busy:!1,validationError:e.error??null});return}if(e.status===`done`){this.sessionId=null;let t=e.channels??[];this.setState({phase:`done`,channel:this.channel??t[0]??null,channels:t,accounts:e.accounts??[]});return}if(e.status===`cancelled`){this.sessionId=null,this.channel=null,this.setState({phase:`idle`});return}this.sessionId=null,this.setState({phase:`error`,channel:this.channel,message:e.error??`Wizard failed.`})}setState(e){this.currentState=e,this.onChange()}}})),zt,Bt=e((()=>{Rt(),zt=class{constructor(e){this.deps=e,this.multiselect=[],this.blockedByDirtyConfig=!1,this.multiselectStepId=null,this.lastPhase=`idle`,this.controller=new Lt(()=>e.getContext()?.gateway.snapshot.client??null,()=>this.handleControllerChange(),t=>e.getContext()?.channels.state.channelsSnapshot?.channelMeta?.some(e=>e.id===t)??!1)}get state(){return this.controller.state}startSetup(e){if(this.deps.getContext()?.runtimeConfig.state.configFormDirty){this.blockedByDirtyConfig=!0,this.deps.requestUpdate();return}this.blockedByDirtyConfig=!1,this.whatsappAccountId=void 0,this.deps.clearSelection(),this.controller.start(e)}close(){let e=this.controller.state.phase!==`idle`;this.controller.cancel(),e&&this.deps.getContext()?.channels.refresh(!0)}cancelOnDisconnect(){this.controller.cancel()}answer(e){this.controller.answer(e)}toggleMultiselect(e){this.multiselect=this.multiselect.includes(e)?this.multiselect.filter(t=>t!==e):[...this.multiselect,e],this.deps.requestUpdate()}handleControllerChange(){let e=this.controller.state,t=e.phase===`step`?e.step.id:null;t!==this.multiselectStepId&&(this.multiselectStepId=t,this.multiselect=e.phase===`step`&&Array.isArray(e.step.initialValue)?[...e.step.initialValue]:[]),e.phase===`done`&&this.lastPhase!==`done`&&this.handleCompleted(e.accounts),this.lastPhase=e.phase,this.deps.requestUpdate()}async handleCompleted(e){let t=this.deps.getContext();if(!t)return;await t.runtimeConfig.refresh({discardPendingChanges:!0}),await t.channels.refresh(!0);let n=e.find(e=>e.channel===`whatsapp`);n&&(this.whatsappAccountId=n.accountId,await t.channels.startWhatsApp(!1,n.accountId))}}}));function Vt(e,t){return e instanceof DOMException&&e.name===`TimeoutError`?Ht:`${t}: ${String(e)}`}var Ht,$;e((()=>{a(),l(),p(),oe(),ie(),ne(),pe(),v(),_(),je(),A(),Nt(),Bt(),i(),Ht=`Request timed out after 30 seconds; the server may still have applied the change — check the profile before retrying.`,$=class extends h{constructor(...e){super(...e),this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.selectedChannel=null,this.wizardHost=new zt({getContext:()=>this.context,requestUpdate:()=>this.requestUpdate(),clearSelection:()=>{this.selectedChannel=null}}),this.schemaLoadStarted=!1,this.gatewayClient=null,this.gatewayConnected=!1,this.hasGatewaySnapshot=!1,this.nostrOperationGeneration=0,this.subscriptions=new g(this).effect(()=>this.context?.channels,e=>{let t=this.channelsSource!==void 0&&this.channelsSource!==e;this.channelsSource=e,t&&this.invalidateNostrForm();let n=()=>{this.channelsSource===e&&this.requestUpdate()};return n(),e.subscribe(n)}).effect(()=>this.context?.runtimeConfig,e=>{this.schemaLoadStarted=!1;let t=()=>{this.context.runtimeConfig===e&&(this.requestUpdate(),this.ensureInitialData())};t();let n=e.subscribe(t);return()=>{n(),this.schemaLoadStarted=!1}}).effect(()=>this.context?.gateway,e=>{let t=this.gatewaySource!==void 0&&this.gatewaySource!==e;return this.gatewaySource=e,this.applyGatewaySnapshot(e.snapshot,t),e.subscribe(t=>{this.gatewaySource===e&&this.applyGatewaySnapshot(t,!1)})})}applyGatewaySnapshot(e,t){let n=this.hasGatewaySnapshot&&this.gatewayClient!==e.client,r=this.hasGatewaySnapshot&&this.gatewayConnected!==e.connected;(!this.hasGatewaySnapshot||t||n||r)&&(this.nostrOperationGeneration+=1),(t||n||!e.connected)&&this.clearNostrForm(),this.hasGatewaySnapshot=!0,this.gatewayClient=e.client,this.gatewayConnected=e.connected,e.connected&&e.client?this.ensureInitialData():this.schemaLoadStarted=!1}ensureInitialData(){let e=this.context,t=e.gateway.snapshot,n=t.client;if(!t.connected||!n)return;let r=e.channels.state,i=e.runtimeConfig.state;!r.channelsSnapshot&&!r.channelsLoading&&e.channels.refresh(!1),!i.configSnapshot&&!i.configLoading&&e.runtimeConfig.ensureLoaded(),!i.configSchema&&!i.configSchemaLoading&&!this.schemaLoadStarted&&(this.schemaLoadStarted=!0,e.runtimeConfig.ensureSchemaLoaded())}disconnectedCallback(){this.wizardHost.cancelOnDisconnect(),this.selectedChannel=null,this.gatewaySource=void 0,this.channelsSource=void 0,this.gatewayClient=null,this.gatewayConnected=!1,this.hasGatewaySnapshot=!1,this.invalidateNostrForm(),this.subscriptions.clear(),this.schemaLoadStarted=!1,super.disconnectedCallback()}async saveChannelConfig(){let e=this.context;if(!e)return;let t=await e.runtimeConfig.save(),n=e.runtimeConfig.state.lastError;if(!t){await e.runtimeConfig.refresh(),n&&!e.runtimeConfig.state.lastError&&(e.runtimeConfig.state.lastError=n),this.requestUpdate();return}await e.channels.refresh(!0)}async reloadChannelConfig(){let e=this.context;e&&(await e.runtimeConfig.refresh({discardPendingChanges:!0}),await e.channels.refresh(!0))}resolveNostrAccountId(){let e=this.context?.channels.state.channelsSnapshot?.channelAccounts?.nostr??[];return this.nostrProfileAccountId??e[0]?.accountId??`default`}buildGatewayHttpHeaders(e){let t=te({hello:e.snapshot.hello,settings:{token:e.connection.token},password:e.connection.password});return t?{Authorization:t}:{}}clearNostrForm(){this.nostrProfileFormState=null,this.nostrProfileAccountId=null}invalidateNostrForm(){this.nostrOperationGeneration+=1,this.clearNostrForm()}beginNostrOperation(){let e=this.context.gateway,t=this.context.channels,n=e.snapshot.client;if(!this.isConnected||this.gatewaySource!==e||this.channelsSource!==t||!e.snapshot.connected||!n)return null;let r=this.nostrOperationGeneration+1;return this.nostrOperationGeneration=r,{generation:r,gateway:e,channels:t,client:n,formAccountId:this.nostrProfileAccountId,accountId:this.resolveNostrAccountId(),headers:this.buildGatewayHttpHeaders(e)}}currentNostrForm(e){let t=this.nostrProfileFormState;return!t||!this.isConnected||this.nostrOperationGeneration!==e.generation||this.nostrProfileAccountId!==e.formAccountId||this.context.gateway!==e.gateway||this.context.channels!==e.channels||e.gateway.snapshot.client!==e.client||!e.gateway.snapshot.connected?null:t}editNostrProfile(e,t){this.nostrOperationGeneration+=1,this.nostrProfileAccountId=e,this.nostrProfileFormState=Pe(t??void 0)}cancelNostrProfile(){this.invalidateNostrForm()}changeNostrProfileField(e,t){let n=this.nostrProfileFormState;n&&(this.nostrProfileFormState={...n,values:{...n.values,[e]:t},fieldErrors:{...n.fieldErrors,[e]:``}})}toggleNostrProfileAdvanced(){let e=this.nostrProfileFormState;e&&(this.nostrProfileFormState={...e,showAdvanced:!e.showAdvanced})}async saveNostrProfile(){let e=this.nostrProfileFormState;if(!e||e.saving||e.importing)return;let t=this.beginNostrOperation();if(!t)return;let n={...e,saving:!0,error:null,success:null,fieldErrors:{}};this.nostrProfileFormState=n;try{let{data:n,response:r}=await ke({accountId:t.accountId,headers:t.headers,values:e.values}),i=this.currentNostrForm(t);if(!i)return;if(!r.ok||n?.ok===!1||!n){this.nostrProfileFormState={...i,saving:!1,error:n?.error??`Profile update failed (${r.status})`,success:null,fieldErrors:Oe(n?.details)};return}if(!n.persisted){this.nostrProfileFormState={...i,saving:!1,error:`Profile publish failed on all relays.`,success:null};return}this.nostrProfileFormState={...i,saving:!1,error:null,success:`Profile published to relays.`,fieldErrors:{},original:{...e.values}},await t.channels.refresh(!0)}catch(e){let n=this.currentNostrForm(t);if(!n)return;this.nostrProfileFormState={...n,saving:!1,error:Vt(e,`Profile update failed`),success:null}}}async importNostrProfile(){let e=this.nostrProfileFormState;if(!e||e.importing||e.saving)return;let t=this.beginNostrOperation();if(t){this.nostrProfileFormState={...e,importing:!0,error:null,success:null};try{let{data:e,response:n}=await Ae({accountId:t.accountId,headers:t.headers}),r=this.currentNostrForm(t);if(!r)return;if(!n.ok||e?.ok===!1||!e){this.nostrProfileFormState={...r,importing:!1,error:e?.error??`Profile import failed (${n.status})`,success:null};return}let i=e.merged??e.imported??null,a=i?{...r.values,...i}:r.values;this.nostrProfileFormState={...r,importing:!1,values:a,error:null,success:e.saved?`Profile imported from relays. Review and publish.`:`Profile imported. Review and publish.`,showAdvanced:!!(a.banner||a.website||a.nip05||a.lud16)},e.saved&&await t.channels.refresh(!0)}catch(e){let n=this.currentNostrForm(t);if(!n)return;this.nostrProfileFormState={...n,importing:!1,error:Vt(e,`Profile import failed`),success:null}}}}render(){let e=this.context,t=e.channels.state,n=e.runtimeConfig.state;return s`
      <section class="content-header">
        <div>
          <div class="page-title">${re(`channels`)}</div>
        </div>
      </section>
      ${fe(Ct({connected:t.connected,loading:t.channelsLoading,snapshot:t.channelsSnapshot,lastError:t.channelsError,lastSuccessAt:t.channelsLastSuccess,whatsappMessage:t.whatsappLoginMessage,whatsappQrDataUrl:t.whatsappLoginQrDataUrl,whatsappConnected:t.whatsappLoginConnected,whatsappBusy:t.whatsappBusy,configSchema:n.configSchema,configSchemaLoading:n.configSchemaLoading,configForm:n.configForm,configUiHints:n.configUiHints,configSaving:n.configSaving,configFormDirty:n.configFormDirty,nostrProfileFormState:this.nostrProfileFormState,nostrProfileAccountId:this.nostrProfileAccountId,selectedChannel:this.selectedChannel,wizard:this.wizardHost.state,wizardMultiselect:this.wizardHost.multiselect,setupBlockedByDirtyConfig:this.wizardHost.blockedByDirtyConfig,onShowDetail:e=>{this.selectedChannel=e},onCloseDetail:()=>{this.selectedChannel=null},onStartSetup:e=>this.wizardHost.startSetup(e),onWizardAnswer:e=>this.wizardHost.answer(e),onWizardToggleMultiselect:e=>this.wizardHost.toggleMultiselect(e),onWizardClose:()=>this.wizardHost.close(),onRefresh:t=>void e.channels.refresh(t),onWhatsAppStart:t=>void e.channels.startWhatsApp(t,this.wizardHost.whatsappAccountId),onWhatsAppWait:()=>void e.channels.waitWhatsApp(this.wizardHost.whatsappAccountId),onWhatsAppLogout:()=>void e.channels.logoutWhatsApp(this.wizardHost.whatsappAccountId),onConfigPatch:(t,n)=>e.runtimeConfig.patchForm(t,n),onConfigSave:()=>void this.saveChannelConfig(),onConfigReload:()=>void this.reloadChannelConfig(),onNostrProfileEdit:(e,t)=>this.editNostrProfile(e,t),onNostrProfileCancel:()=>this.cancelNostrProfile(),onNostrProfileFieldChange:(e,t)=>this.changeNostrProfileField(e,t),onNostrProfileSave:()=>void this.saveNostrProfile(),onNostrProfileImport:()=>void this.importNostrProfile(),onNostrProfileToggleAdvanced:()=>this.toggleNostrProfileAdvanced()}))}
    `}},t([o({context:ae,subscribe:!0})],$.prototype,`context`,void 0),t([u()],$.prototype,`nostrProfileFormState`,void 0),t([u()],$.prototype,`nostrProfileAccountId`,void 0),t([u()],$.prototype,`selectedChannel`,void 0),customElements.get(`openclaw-channels-page`)||customElements.define(`openclaw-channels-page`,$)}))();
//# sourceMappingURL=channels-page-BkuAzPVd.js.map