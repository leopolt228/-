import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,o as n,u as r}from"./control-ui-foundation-43q8Lf_T.js";import{T as i,w as a}from"./control-ui-core-DF5v1q4q.js";import{dt as o,ft as s}from"./control-ui-foundation-DQl2NL7K.js";import{$ as c,J as l,U as u,X as d,tt as f,z as ee}from"./lit-runtime-CE4wpvNA.js";import{$n as te,Ci as p,Ma as m,Mi as ne,Pi as re,di as ie,fi as ae,hi as oe,ja as se,ka as ce,nr as le,sr as h,ui as ue}from"./control-ui-core-Dx4utKSD.js";import{Ut as de,at as fe,ct as pe,it as me,jt as he,lt as g,ot as ge}from"./control-ui-core-6OhF3OIO.js";import{o as _,t as v}from"./control-ui-core-CXeSrnoQ.js";import{at as _e,ot as ve}from"./control-ui-core-vPyynwls.js";import{t as ye}from"./viewer-facepile-iLhMW_aV.js";import{n as be,t as xe}from"./settings-workspace-BhCB-OeS.js";import{a as y,c as b,n as x,o as S,p as Se,r as C,t as w}from"./settings-ui-BJ5HJKwt.js";import{n as Ce,r as we,t as T}from"./refresh-policy-CVMdOh-W.js";var E=e((()=>{}));function D(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<=0||t<=0)throw new P(`invalid-image`);let n=Math.min(e,t),r=Math.min(1,A/n);return{sourceEdge:n,sourceX:Math.max(0,Math.round((e-n)/2)),sourceY:Math.max(0,Math.round((t-n)/2)),edge:Math.max(1,Math.round(n*r))}}async function O(e){let t=URL.createObjectURL(e);try{let e=new Image;return e.decoding=`async`,e.src=t,await e.decode(),e}catch{throw new P(`invalid-image`)}finally{URL.revokeObjectURL(t)}}function k(e,t,n){return new Promise(r=>{e.toBlob(r,t,n)})}function Te(e){let t=[];for(let n=0;n<e.length;n+=32768)t.push(String.fromCharCode(...e.subarray(n,n+32768)));return btoa(t.join(``))}async function Ee(e,t){if(e.size>j)throw new P(`too-large`);let n=new Uint8Array(await e.arrayBuffer()),r=Te(n);if(r.length>M)throw new P(`too-large`);return{mime:t,avatarBase64:r,byteLength:n.byteLength}}async function De(e){if(![`image/png`,`image/jpeg`,`image/webp`].includes(e.type))throw new P(`invalid-image`);if(e.size>N)throw new P(`source-too-large`);let t=await O(e),n=D(t.naturalWidth,t.naturalHeight),r=document.createElement(`canvas`);r.width=n.edge,r.height=n.edge;let i=r.getContext(`2d`);if(!i)throw new P(`invalid-image`);i.drawImage(t,n.sourceX,n.sourceY,n.sourceEdge,n.sourceEdge,0,0,n.edge,n.edge);let a=e.type===`image/webp`?`image/webp`:`image/png`,o=await k(r,a,a===`image/webp`?.9:void 0);if((!o||o.type!==a||o.size>j)&&(a=`image/webp`,o=await k(r,a,.82)),!o||o.type!==a)throw new P(`invalid-image`);return Ee(o,a)}var A,j,M,N,P,Oe=e((()=>{A=512,j=512*1024,M=7e5,N=10*1024*1024,P=class extends Error{constructor(e){super(e),this.code=e,this.name=`ProfileAvatarError`}}}));function ke(e,t){return{id:e.id,name:e.displayName??void 0,email:e.emails[0],avatarUrl:t??void 0,watchedSessions:[]}}function Ae(e){let t=e.profile.displayName??``,n=e.displayName.trim()!==t,r=e.profile.emails.join(`, `);return c`<div id=${a.identity}>
    ${b({title:_(`profilePage.identity.title`),description:_(`profilePage.identity.description`)},c`
        ${S({title:_(`profilePage.identity.avatar`),description:_(`profilePage.identity.avatarDescription`),control:c`
            <span class="identity-avatar-control">
              <openclaw-viewer-avatar
                .user=${ke(e.profile,e.avatarUrl)}
                variant="profile"
              ></openclaw-viewer-avatar>
              <label class="btn btn--sm">
                ${e.busy===`avatar`?_(`profilePage.identity.processingAvatar`):_(`profilePage.identity.chooseAvatar`)}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  ?disabled=${e.busy!==null}
                  @change=${t=>{let n=t.currentTarget,r=n.files?.[0];n.value=``,r&&e.onAvatarSelect(r)}}
                />
              </label>
            </span>
          `})}
        ${S({title:_(`profilePage.identity.displayName`),description:_(`profilePage.identity.displayNameDescription`),control:c`
            <form
              class="identity-name-control"
              @submit=${t=>{t.preventDefault(),e.onSaveDisplayName()}}
            >
              <input
                class="settings-input"
                type="text"
                maxlength="256"
                aria-label=${_(`profilePage.identity.displayName`)}
                .value=${e.displayName}
                ?disabled=${e.busy!==null}
                @input=${t=>e.onDisplayNameInput(t.currentTarget.value)}
              />
              <button
                type="submit"
                class="btn btn--sm"
                ?disabled=${e.busy!==null||!n}
              >
                ${e.busy===`display-name`?_(`common.saving`):_(`common.save`)}
              </button>
            </form>
          `})}
        ${S({title:_(`profilePage.identity.linkedEmails`),description:_(`profilePage.identity.linkedEmailsDescription`),control:r?Se(r):d})}
        ${e.error?c`<div class="settings-row identity-error" role="alert">
              <span class="settings-row__desc">${e.error}</span>
            </div>`:d}
      `)}
  </div>`}var F=e((()=>{l(),w(),ye(),v(),i()}));function I(e){return new Date(`${e}T12:00:00Z`).getTime()}function je(e){return new Date(e).toISOString().slice(0,10)}function L(e=new Date){let t=String(e.getMonth()+1).padStart(2,`0`),n=String(e.getDate()).padStart(2,`0`);return`${e.getFullYear()}-${t}-${n}`}function R(e){if(e==null||!Number.isFinite(e)||e<=0)return`0`;for(let t of[{threshold:0xe8d4a51000,suffix:`T`},{threshold:1e9,suffix:`B`},{threshold:1e6,suffix:`M`},{threshold:1e3,suffix:`k`}]){if(e<t.threshold)continue;let n=e/t.threshold;return`${n<100?n.toFixed(1).replace(/\.0$/,``):String(Math.round(n))}${t.suffix}`}return String(Math.round(e))}function Me(e){return n(e,{spaced:!0})??`0s`}function z(e){return e.filter(e=>e.totalTokens>0).map(e=>e.date).toSorted()}function Ne(e,t){let n=z(e);if(n.length===0)return{current:0,longest:0};let r=1,i=1;for(let e=1;e<n.length;e+=1){let t=n[e],a=n[e-1];!t||!a||(i=Math.round((I(t)-I(a))/B)===1?i+1:1,r=Math.max(r,i))}let a=n.at(-1)??t;return{current:Math.round((I(t)-I(a))/B)<=1?i:0,longest:r}}function Pe(e){let t=e.toSorted((e,t)=>e-t),n=e=>t[Math.min(t.length-1,Math.floor(t.length*e))]??0;return[n(.25),n(.5),n(.75)]}function Fe(e,t){return e<=0?0:e<t[0]?1:e<t[1]?2:e<t[2]?3:4}function Ie(e,t,n){let r=I(t),i=r-(V*7-1)*B,a=new Map(e.map(e=>[e.date,e.totalTokens])),o=e.filter(e=>e.totalTokens>0&&I(e.date)>=i).map(e=>e.totalTokens),s=o.length>0?Pe(o):[0,0,0],c=i-new Date(i).getUTCDay()*B,l=new Intl.DateTimeFormat(n,{month:`short`,timeZone:`UTC`}),u=[],d=[],f=-1;for(let e=c;e<=r;e+=7*B){let t=[];for(let n=0;n<7;n+=1){let o=e+n*B;if(o<i||o>r){t.push(null);continue}let c=je(o),l=a.get(c)??0;t.push({date:c,tokens:l,level:Fe(l,s)})}u.push({days:t});let n=new Date(e).getUTCMonth();d.push(n===f?``:l.format(new Date(e))),f=n}return{weeks:u,monthLabels:d}}function Le(e){let t=null;for(let n of e)n.totalTokens>0&&n.totalTokens>(t?.totalTokens??0)&&(t=n);return t}function Re(e){return z(e)[0]??null}function ze(e){let t=e.aggregates,n=t.byModel.filter(e=>e.model).toSorted((e,t)=>t.totals.totalTokens-e.totals.totalTokens)[0],r=t.tools.tools.toSorted((e,t)=>t.count-e.count).slice(0,5).map(e=>({name:e.name,count:e.count})),i=t.byChannel.toSorted((e,t)=>t.totals.totalTokens-e.totals.totalTokens).slice(0,3).map(e=>({channel:H(e.channel),tokens:e.totals.totalTokens})),a=t.longestSessionDurationMs??null;if(a==null)for(let t of e.sessions){let e=t.usage?.durationMs;e!=null&&e>(a??0)&&(a=e)}return{topModel:n?.model??null,messages:t.messages.total,toolCalls:t.tools.totalCalls,uniqueTools:t.tools.uniqueTools,agents:t.byAgent.length,sessions:t.sessionCount??e.sessions.length,sessionsCapped:t.sessionCount==null&&e.sessions.length>=1e3,topTools:r,topChannels:i,longestSessionMs:a}}var B,V,H,U=e((()=>{p(),B=1440*60*1e3,V=52,H=e=>e.charAt(0).toUpperCase()+e.slice(1)}));function W(){return new Intl.NumberFormat(void 0,{maximumFractionDigits:0})}function G(e){return new Intl.DateTimeFormat(void 0,{dateStyle:`medium`,timeZone:`UTC`}).format(new Date(`${e}T12:00:00Z`))}function K(e){return _(e===1?`profilePage.streakDay`:`profilePage.streakDays`,{count:W().format(e)})}function Be(e,t){if(!e)return d;let n=Ne(e.daily,L()),r=Le(e.daily);return C(c`
    <section class="profile-stats">
      ${[{label:_(`profilePage.statLifetimeTokens`),value:R(e.totals.totalTokens),sub:e.totals.totalCost>0?`≈ ${oe(e.totals.totalCost)}`:void 0},{label:_(`profilePage.statPeakDay`),value:R(r?.totalTokens??0),sub:r?G(r.date):void 0},{label:_(`profilePage.statLongestSession`),value:t?.longestSessionMs==null?`—`:Me(t.longestSessionMs)},{label:_(`profilePage.statCurrentStreak`),value:K(n.current)},{label:_(`profilePage.statLongestStreak`),value:K(n.longest)}].map(e=>c`
          <div class="profile-stats__cell">
            <div class="profile-stats__value">${e.value}</div>
            <div class="profile-stats__label">${e.label}</div>
            ${e.sub?c`<div class="profile-stats__sub">${e.sub}</div>`:d}
          </div>
        `)}
    </section>
  `)}function Ve(e){let t=e.weeks.length,n=Y+t*J,r=W(),i=new Intl.DateTimeFormat(void 0,{weekday:`short`,timeZone:`UTC`});return c`
    <div class="profile-heatmap__scroll">
      <svg
        class="profile-heatmap__svg"
        width=${n}
        height=${116}
        viewBox="0 0 ${n} ${116}"
        role="img"
        aria-label=${_(`profilePage.heatmapTitle`)}
      >
        ${e.monthLabels.map((e,t)=>e?f`<text class="profile-heatmap__month" x=${Y+t*J} y="10">${e}</text>`:d)}
        ${Z.map(({row:e,utcDay:t})=>f`<text class="profile-heatmap__weekday" x=${Y-6} y=${X+e*J+q-2}>${i.format(new Date(t))}</text>`)}
        ${e.weeks.map((e,t)=>e.days.map((e,n)=>{if(!e)return d;let i=`${G(e.date)} · ${_(`profilePage.heatmapCellTokens`,{tokens:r.format(e.tokens)})}`;return f`
              <rect
                class="profile-heatmap__cell profile-heatmap__cell--l${e.level}"
                x=${Y+t*J}
                y=${X+n*J}
                width=${q}
                height=${q}
                rx="2.5"
              ><title>${i}</title></rect>
            `}))}
      </svg>
    </div>
  `}function He(e){if(!e)return d;let t=Ie(e.daily,L()),n=c`
    <div class="profile-heatmap__legend" aria-hidden="true">
      <span>${_(`profilePage.legendLess`)}</span>
      ${[0,1,2,3,4].map(e=>c`<span class="profile-heatmap__swatch profile-heatmap__cell--l${e}"></span>`)}
      <span>${_(`profilePage.legendMore`)}</span>
    </div>
  `;return b({title:_(`profilePage.heatmapTitle`),description:_(`profilePage.heatmapSub`),actions:n},c`<div class="profile-heatmap">${Ve(t)}</div>`)}function Ue(e){if(!e)return d;let t=W(),n=[{label:_(`profilePage.insightModel`),value:e.topModel??`—`},{label:_(`profilePage.insightMessages`),value:t.format(e.messages)},{label:_(`profilePage.insightToolCalls`),value:t.format(e.toolCalls)},{label:_(`profilePage.insightUniqueTools`),value:t.format(e.uniqueTools)},{label:_(`profilePage.insightAgents`),value:t.format(e.agents)},{label:_(`profilePage.insightSessions`),value:e.sessionsCapped?_(`profilePage.sessionsCapped`,{count:t.format(e.sessions)}):t.format(e.sessions)}],r=e.topTools[0]?.count??0;return c`${b({title:_(`profilePage.insightsTitle`)},c`
      <dl class="settings-kv">
        ${n.map(e=>c`
            <dt>${e.label}</dt>
            <dd>${e.value}</dd>
          `)}
      </dl>
    `)} ${b({title:_(`profilePage.toolsTitle`)},e.topTools.length===0?x(_(`profilePage.toolsEmpty`)):c`
          <div class="profile-tools">
            ${e.topTools.map(e=>c`
                <div class="profile-tools__row">
                  <span class="profile-tools__name">${e.name}</span>
                  <span class="profile-tools__bar" aria-hidden="true">
                    <span
                      class="profile-tools__bar-fill"
                      style="width: ${r>0?Math.max(4,Math.round(e.count/r*100)):0}%"
                    ></span>
                  </span>
                  <span class="profile-tools__count">
                    ${_(e.count===1?`profilePage.toolRun`:`profilePage.toolRuns`,{count:W().format(e.count)})}
                  </span>
                </div>
              `)}
          </div>
        `)}`}var q,J,Y,X,Z,We=e((()=>{l(),w(),v(),p(),U(),q=11,J=14,Y=30,X=18,Z=[{row:1,utcDay:Date.UTC(2024,0,1)},{row:3,utcDay:Date.UTC(2024,0,3)},{row:5,utcDay:Date.UTC(2024,0,5)}]}));function Ge(e){return new Intl.DateTimeFormat(void 0,{month:`short`,year:`numeric`,timeZone:`UTC`}).format(new Date(`${e}T12:00:00Z`))}function Ke(e){return ae(e)?ue(`usage`):e instanceof Error&&e.message.trim()?e.message:typeof e==`string`?e:`request failed`}function Q(e){return e instanceof Error&&e.message.trim()?e.message:typeof e==`string`&&e.trim()?e:_(`profilePage.identity.profileUnavailable`)}var $;e((()=>{o(),l(),ee(),he(),fe(),ge(),ve(),w(),xe(),v(),ce(),ie(),te(),re(),i(),we(),E(),Oe(),F(),We(),U(),r(),$=class extends ne{constructor(...e){super(...e),this.loading=!1,this.error=null,this.costSummary=null,this.sessionsResult=null,this.selfUser=null,this.ownProfile=null,this.displayName=``,this.identityLoading=!1,this.identityBusy=null,this.identityError=null,this.client=null,this.connected=!1,this.requestId=0,this.identityRequestId=0,this.refreshTimer=null,this.lastProfileLoadedAtMs=null,this.pendingAutomaticProfileRefresh=!1,this.profileReloadPending=!1,this.subscriptions=[],this.handlePageActivation=()=>{this.requestProfileRefresh(`focus`)}}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.context.agents.subscribe(()=>this.requestUpdate()),this.context.agentIdentity.subscribe(()=>this.requestUpdate())],document.addEventListener(`visibilitychange`,this.handlePageActivation),globalThis.addEventListener(`focus`,this.handlePageActivation),this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],document.removeEventListener(`visibilitychange`,this.handlePageActivation),globalThis.removeEventListener(`focus`,this.handlePageActivation),this.requestId+=1,this.identityRequestId+=1,this.clearRefreshTimer(),this.pendingAutomaticProfileRefresh=!1,this.profileReloadPending=!1,this.client=null,this.connected=!1,super.disconnectedCallback()}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.connected&&!this.connected,r=e.connected?pe({snapshotUser:e.selfUser}):null,i=r?.id!==this.selfUser?.id;if(this.client=e.client,this.connected=e.connected,this.selfUser=r,t&&(this.clearRefreshTimer(),this.requestId+=1,this.loading=!1,this.lastProfileLoadedAtMs=null,this.pendingAutomaticProfileRefresh=!1,this.profileReloadPending=!1,this.costSummary=null,this.sessionsResult=null,this.error=null),(t||i)&&(this.identityRequestId+=1,this.ownProfile=null,this.displayName=``,this.identityLoading=!1,this.identityBusy=null,this.identityError=null),!e.connected||!e.client){this.profileReloadPending||=this.loading,this.requestId+=1,this.clearRefreshTimer(),this.loading=!1;return}r&&(t||i)&&this.loadIdentity(),this.context.agents.ensureList().then(e=>{e&&this.context.agentIdentity.ensure([e.defaultId])}),(t||n||!this.costSummary&&!this.loading&&!this.error)&&this.requestProfileRefresh(`reconnect`)}async loadProfile(){let e=this.client;if(!e||!this.connected){this.profileReloadPending=!0;return}this.profileReloadPending=!1;let t=++this.requestId;this.loading=!0,this.error=null;let n=le(`local`);try{let[r,i]=await Promise.all([e.request(`usage.cost`,{range:`all`,agentScope:`all`,...n}),h(e,{range:`all`,agentScope:`all`,groupBy:`instance`,limit:1e3,...n}).catch(()=>null)]);if(t!==this.requestId)return;this.costSummary=r,this.sessionsResult=i,this.lastProfileLoadedAtMs=Date.now(),this.scheduleCacheSettleRefresh()}catch(e){if(t!==this.requestId)return;this.error=Ke(e)}finally{t===this.requestId&&(this.loading=!1,this.flushPendingAutomaticProfileRefresh())}}isCacheSettling(){return[this.costSummary?.cacheStatus?.status,this.sessionsResult?.cacheStatus?.status].some(e=>e===`refreshing`||e===`partial`)}scheduleCacheSettleRefresh(){if(this.clearRefreshTimer(),!this.isCacheSettling())return;let e=this.lastProfileLoadedAtMs??Date.now(),t=Math.max(0,Date.now()-e),n=Math.max(0,T-t);this.refreshTimer=window.setTimeout(()=>{this.refreshTimer=null,this.requestProfileRefresh(`poll`)},n)}clearRefreshTimer(){this.refreshTimer!==null&&(window.clearTimeout(this.refreshTimer),this.refreshTimer=null)}requestProfileRefresh(e){if(this.loading&&e!==`manual`){this.pendingAutomaticProfileRefresh=!0;return}this.pendingAutomaticProfileRefresh=!1;let t=Ce({reason:e,visible:document.visibilityState===`visible`&&document.hasFocus(),interrupted:this.profileReloadPending,nowMs:Date.now(),lastLoadedAtMs:this.lastProfileLoadedAtMs});t===`fetch`?(this.clearRefreshTimer(),this.loadProfile()):t===`skip`&&this.isCacheSettling()&&this.scheduleCacheSettleRefresh()}flushPendingAutomaticProfileRefresh(){this.pendingAutomaticProfileRefresh&&(this.pendingAutomaticProfileRefresh=!1,this.requestProfileRefresh(`focus`))}async loadIdentity(){let e=this.client;if(!e||!this.connected)return;let t=++this.identityRequestId,n=this.ownProfile,r=this.displayName,i=n!==null&&r.trim()!==(n.displayName??``);this.identityLoading=!0,this.identityError=null;try{let n=await e.request(`users.self`,{});if(t!==this.identityRequestId)return;this.ownProfile=n.profile,this.displayName=i?r:n.profile.displayName??``}catch(e){t===this.identityRequestId&&(this.identityError=Q(e))}finally{t===this.identityRequestId&&(this.identityLoading=!1)}}applyOwnProfile(e){this.ownProfile=e,this.displayName=e.displayName??``}async saveDisplayName(){let e=this.client,t=this.ownProfile;if(!e||!t||this.identityBusy||this.identityLoading)return;this.identityBusy=`display-name`,this.identityError=null;let n=this.identityRequestId,r=!1;try{let i=this.displayName.trim()||null,a=await e.request(`users.setDisplayName`,{profileId:t.id,displayName:i});if(e!==this.client||n!==this.identityRequestId)return;this.applyOwnProfile(a.profile),this.context.gateway.updateSelfUser?.({name:a.profile.displayName??void 0}),r=!0}catch(t){e===this.client&&n===this.identityRequestId&&(this.identityError=Q(t))}finally{n===this.identityRequestId&&this.identityBusy===`display-name`&&(this.identityBusy=null)}r&&e===this.client&&n===this.identityRequestId&&this.loadIdentity()}async saveAvatar(e){let t=this.client,n=this.ownProfile;if(!t||!n||this.identityBusy||this.identityLoading)return;this.identityBusy=`avatar`,this.identityError=null;let r=this.identityRequestId,i=this.displayName,a=i.trim()!==(n.displayName??``),o=!1;try{let s=await De(e);if(t!==this.client||r!==this.identityRequestId)return;let c=await t.request(`users.setAvatar`,{profileId:n.id,mime:s.mime,avatarBase64:s.avatarBase64});if(t!==this.client||r!==this.identityRequestId)return;this.ownProfile=c.profile,this.displayName=a?i:c.profile.displayName??``;let l=g(this.context.gateway.connection.gatewayUrl,c.profile.id,c.profile.updatedAt);l&&this.context.gateway.updateSelfUser?.({avatarUrl:l}),o=!0}catch(e){t===this.client&&r===this.identityRequestId&&(this.identityError=e instanceof P?_(e.code===`too-large`?`profilePage.identity.avatarErrors.tooLarge`:e.code===`source-too-large`?`profilePage.identity.avatarErrors.sourceTooLarge`:`profilePage.identity.avatarErrors.invalid`):Q(e))}finally{r===this.identityRequestId&&this.identityBusy===`avatar`&&(this.identityBusy=null)}o&&t===this.client&&r===this.identityRequestId&&this.loadIdentity()}renderIdentity(){if(!this.selfUser)return d;if(!this.ownProfile)return c`<div id=${a.identity}>
        ${b({title:_(`profilePage.identity.title`)},x(this.identityLoading?_(`profilePage.identity.loading`):this.identityError??_(`profilePage.identity.profileUnavailable`)))}
      </div>`;let e=g(this.context.gateway.connection.gatewayUrl,this.ownProfile.id,this.ownProfile.updatedAt);return Ae({profile:this.ownProfile,avatarUrl:e,displayName:this.displayName,busy:this.identityLoading?`loading`:this.identityBusy,error:this.identityError,onDisplayNameInput:e=>{this.displayName=e},onSaveDisplayName:()=>void this.saveDisplayName(),onAvatarSelect:e=>void this.saveAvatar(e)})}refreshManually(){this.requestProfileRefresh(`manual`),this.selfUser&&!this.identityBusy&&this.loadIdentity()}featuredAgent(){let e=this.context.agents.state.agentsList,t=e?.defaultId??`main`,n=e?.agents.find(e=>e.id===t)??{id:t},r=this.context.agentIdentity.get(t),i=se(n,r),a=m(r?.avatar)??m(n.identity?.emoji)??m(n.identity?.avatar);return{agentId:t,name:r?.name?.trim()||n.identity?.name?.trim()||n.name?.trim()||t,avatarUrl:i,textAvatar:a}}renderAvatar(e,t,n){return e?c`<img class="profile-hero__avatar-image" src=${e} alt=${n} />`:t?c`<span class="profile-hero__avatar-text">${t}</span>`:c`<span class="profile-hero__avatar-mascot" aria-hidden="true"
      >${_e.lobster}</span
    >`}renderHero(e){let{agentId:t,name:n,avatarUrl:r,textAvatar:i}=this.featuredAgent(),a=this.costSummary?Re(this.costSummary.daily):null,o=e?.topChannels??[];return C(c`
      <section class="profile-hero">
        <div class="profile-hero__avatar">${this.renderAvatar(r,i,n)}</div>
        <div class="profile-hero__name">${n}</div>
        <div class="profile-hero__handle">
          <span>@${t}</span>
          <span class="profile-hero__badge">OpenClaw</span>
        </div>
        <div class="profile-hero__chips">
          ${a?c`<span class="profile-hero__chip">
                ${_(`profilePage.sinceChip`,{date:Ge(a)})}
              </span>`:d}
          ${o.map(e=>c`
              <span
                class="profile-hero__chip profile-hero__chip--channel"
                title=${_(`profilePage.channelChipTitle`,{tokens:R(e.tokens)})}
              >
                ${e.channel}
              </span>
            `)}
        </div>
      </section>
    `)}renderBody(){if(!this.connected||!this.client)return y(C(x(_(`profilePage.offline`))));let e=e=>y(this.selfUser?c`${this.renderIdentity()} ${e}`:e);if(this.loading&&!this.costSummary)return e(C(x(_(`profilePage.loading`))));if(this.error&&!this.costSummary)return e(C(x(this.error),{danger:!0}));let t=this.sessionsResult?ze(this.sessionsResult):null,n=(this.costSummary?.totals.totalTokens??0)>0,r=this.isCacheSettling()?C(x(_(`profilePage.loading`))):C(x(c`<strong>${_(`profilePage.emptyTitle`)}</strong><br />${_(`profilePage.emptyBody`)}`));return y(n?c`${this.renderHero(t)} ${Be(this.costSummary,t)}
          ${this.renderIdentity()} ${He(this.costSummary)}
          ${Ue(t)}`:c`${this.renderHero(t)} ${this.renderIdentity()} ${r}`)}render(){return c`
      <section class="content-header">
        <div>
          <div class="page-title">${de(`profile`)}</div>
        </div>
        <button class="btn profile-refresh" @click=${()=>this.refreshManually()}>
          ${this.loading?_(`common.refreshing`):_(`common.refresh`)}
        </button>
      </section>
      ${be(this.renderBody())}
    `}},t([s({context:me,subscribe:!1})],$.prototype,`context`,void 0),t([u()],$.prototype,`loading`,void 0),t([u()],$.prototype,`error`,void 0),t([u()],$.prototype,`costSummary`,void 0),t([u()],$.prototype,`sessionsResult`,void 0),t([u()],$.prototype,`selfUser`,void 0),t([u()],$.prototype,`ownProfile`,void 0),t([u()],$.prototype,`displayName`,void 0),t([u()],$.prototype,`identityLoading`,void 0),t([u()],$.prototype,`identityBusy`,void 0),t([u()],$.prototype,`identityError`,void 0),customElements.get(`openclaw-profile-page`)||customElements.define(`openclaw-profile-page`,$)}))();
//# sourceMappingURL=profile-page-GhZWetnA.js.map