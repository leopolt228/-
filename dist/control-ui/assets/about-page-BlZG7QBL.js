import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,r as n,u as r}from"./control-ui-foundation-43q8Lf_T.js";import{dt as i,ft as a}from"./control-ui-foundation-DQl2NL7K.js";import{$ as o,J as s,U as c,X as l,z as u}from"./lit-runtime-CE4wpvNA.js";import{G as d,j as f}from"./control-ui-foundation-DFIFKu9N.js";import{Ci as p,Mi as m,Mr as h,Nr as ee,Pi as te,bn as ne,vn as re,yn as ie}from"./control-ui-core-Dx4utKSD.js";import{Ut as ae,at as g,it as _,jt as v}from"./control-ui-core-6OhF3OIO.js";import{i as y,o as b,t as x}from"./control-ui-core-CXeSrnoQ.js";import{Q as S,at as C,ot as w}from"./control-ui-core-vPyynwls.js";import{d as T,f as E,h as D,p as O}from"./control-ui-shared-Ca9fxTB8.js";import{d as k,i as A,r as j,s as M,t as N}from"./lobster-pet-_RYNeWJF.js";import{n as P,t as F}from"./settings-workspace-BhCB-OeS.js";import{a as oe,c as I,o as L,p as R,t as z}from"./settings-ui-BJ5HJKwt.js";import{n as B,t as V}from"./brand-icons-dFHXqxOT.js";var H=e((()=>{}));function U(e,t){if(!e)return null;let n=new Date(e);return Number.isNaN(n.getTime())?null:new Intl.DateTimeFormat(t,{dateStyle:`medium`,timeZone:`UTC`}).format(n)}function W(e){return b(e===`copying`?`aboutPage.copyingCommit`:e===`copied`?`aboutPage.copiedCommit`:e===`error`?`aboutPage.copyCommitFailed`:`aboutPage.copyCommit`)}function G(e){return e===`copied`?b(`aboutPage.copiedCommit`):e===`error`?b(`aboutPage.copyCommitFailed`):``}function K(){return o`<span class="muted">${b(`aboutPage.unavailable`)}</span>`}function q(e){if(!e)return l;let t=Date.parse(e);return Number.isFinite(t)?o`
    <time class="about-commit__age" dir="auto" datetime=${e} title=${new Intl.DateTimeFormat(y.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(t))}
      >${n(t,{fallback:``})}</time
    >
  `:l}function se(e){let t=e.buildInfo.commit;if(!t)return K();let n=W(e.copyState);return o`
    <span class="about-commit">
      <code dir="ltr" title=${t}>${t.slice(0,J)}</code>
      ${q(e.buildInfo.commitAt)}
      <openclaw-tooltip .content=${n}>
        <button
          type="button"
          class="about-commit__copy"
          aria-label=${n}
          aria-busy=${e.copyState===`copying`?`true`:l}
          ?disabled=${e.copyState===`copying`}
          @click=${e.onCopyCommit}
        >
          <span aria-hidden="true">${e.copyState===`copied`?C.check:C.copy}</span>
        </button>
      </openclaw-tooltip>
      <span class="about-sr-only" role="status" aria-live="polite"
        >${G(e.copyState)}</span
      >
    </span>
  `}function ce(e){let t=A(j.find(e=>e.id===`crimson`)??d(j[0],`about lobster palette`));return o`
    <section class="about-hero">
      <button
        type="button"
        class="about-hero__clawd ${e.clawdWaving?`about-hero__clawd--wave`:``}"
        style=${`--lob-shell:${t.palette.shell};--lob-claw:${t.palette.claw}`}
        aria-label=${b(`aboutPage.waveHello`)}
        @click=${e.onPokeClawd}
      >
        ${M(t)}
      </button>
      <h2 class="about-hero__name">${b(`aboutPage.productName`)}</h2>
      <p class="about-hero__tagline">${b(`aboutPage.tagline`)}</p>
      ${e.buildInfo.version?o`<code class="about-hero__version" dir="ltr">v${e.buildInfo.version}</code>`:l}
      <nav class="about-hero__links" aria-label=${b(`aboutPage.linksLabel`)}>
        ${Y.map(e=>o`
            <a
              class="about-hero__link"
              href=${e.href}
              target=${re}
              rel=${ie()}
            >
              <span class="about-hero__link-icon" aria-hidden="true">${e.icon}</span>
              <span>${e.label()}</span>
            </a>
          `)}
      </nav>
    </section>
  `}function le(e){let t=U(e.buildInfo.builtAt,y.getLocale()),n=o`
    <dl
      class="settings-kv about-build-grid"
      role="group"
      aria-label=${b(`aboutPage.artifactDetails`)}
    >
      <dt>${b(`aboutPage.version`)}</dt>
      <dd>
        ${e.buildInfo.version?o`<code dir="ltr" title=${e.buildInfo.version}>${e.buildInfo.version}</code>`:K()}
      </dd>
      <dt>${b(`aboutPage.commit`)}</dt>
      <dd>${se(e)}</dd>
      ${e.buildInfo.branch?o`
            <dt>${b(`aboutPage.branch`)}</dt>
            <dd>
              <code dir="ltr" title=${e.buildInfo.branch}
                >${e.buildInfo.branch}${e.buildInfo.dirty===!0?`*`:``}</code
              >
            </dd>
          `:l}
      <dt>${b(`aboutPage.built`)}</dt>
      <dd>
        ${t&&e.buildInfo.builtAt?o`<time
              dir="auto"
              datetime=${e.buildInfo.builtAt}
              title=${e.buildInfo.builtAt}
              >${t}</time
            >`:K()}
      </dd>
    </dl>
  `;return oe([ce(e),I({title:b(`aboutPage.artifactTitle`),description:b(`aboutPage.artifactSubtitle`)},n),I({},L({title:b(`aboutPage.gatewayVersion`),description:b(`aboutPage.gatewayVersionHint`),control:e.gatewayVersion?R(o`<code dir="ltr" title=${e.gatewayVersion}>${e.gatewayVersion}</code>`,{mono:!0}):R(b(`aboutPage.unavailable`))})),o`<p class="about-footer">${b(`aboutPage.license`)}</p>`])}var J,Y,X=e((()=>{k(),f(),s(),w(),N(),z(),S(),x(),ne(),p(),H(),B(),J=12,Y=[{href:`https://openclaw.ai`,icon:C.globe,label:()=>b(`aboutPage.linkWebsite`)},{href:`https://docs.openclaw.ai`,icon:C.book,label:()=>b(`aboutPage.linkDocs`)},{href:`https://github.com/openclaw/openclaw`,icon:V.github,label:()=>b(`aboutPage.linkGitHub`)},{href:`https://discord.gg/clawd`,icon:V.discord,label:()=>b(`aboutPage.linkDiscord`)},{href:`https://x.com/openclaw`,icon:V.x,label:()=>b(`aboutPage.linkX`)},{href:`https://docs.openclaw.ai/releases`,icon:C.scrollText,label:()=>b(`aboutPage.linkChangelog`)}]})),Z,Q,$;e((()=>{i(),s(),u(),v(),g(),D(),F(),E(),te(),ee(),X(),r(),Z=1800,Q=1400,$=class extends m{constructor(...e){super(...e),this.copyState=`idle`,this.clawdWaving=!1,this.copyResetTimer=null,this.waveResetTimer=null,this.subscriptions=new h(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.subscriptions.clear(),this.copyResetTimer!==null&&(globalThis.clearTimeout(this.copyResetTimer),this.copyResetTimer=null),this.waveResetTimer!==null&&(globalThis.clearTimeout(this.waveResetTimer),this.waveResetTimer=null),super.disconnectedCallback()}pokeClawd(){this.clawdWaving||(this.clawdWaving=!0,this.waveResetTimer=globalThis.setTimeout(()=>{this.waveResetTimer=null,this.clawdWaving=!1},Q))}async copyCommit(){let e=O.commit;if(!e||this.copyState===`copying`)return;this.copyState=`copying`;let t=await T(e);this.isConnected&&(this.copyState=t?`copied`:`error`,this.copyResetTimer!==null&&globalThis.clearTimeout(this.copyResetTimer),this.copyResetTimer=globalThis.setTimeout(()=>{this.copyResetTimer=null,this.copyState=`idle`},Z))}render(){let e=this.context.gateway.snapshot,t=le({buildInfo:O,gatewayVersion:e.connected&&e.hello?.server?.version?.trim()||null,copyState:this.copyState,onCopyCommit:()=>void this.copyCommit(),clawdWaving:this.clawdWaving,onPokeClawd:()=>this.pokeClawd()});return o`
      <section class="content-header">
        <div>
          <div class="page-title">${ae(`about`)}</div>
        </div>
      </section>
      ${P(t)}
    `}},t([a({context:_,subscribe:!0})],$.prototype,`context`,void 0),t([c()],$.prototype,`copyState`,void 0),t([c()],$.prototype,`clawdWaving`,void 0),customElements.get(`openclaw-about-page`)||customElements.define(`openclaw-about-page`,$)}))();
//# sourceMappingURL=about-page-BlZG7QBL.js.map