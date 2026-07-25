import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{l as n,u as r}from"./control-ui-foundation-43q8Lf_T.js";import{$ as i,G as a,J as o,U as s,X as c,z as l}from"./lit-runtime-CE4wpvNA.js";import{Pi as u,d,f,ji as p}from"./control-ui-core-Dx4utKSD.js";import{o as m,t as h}from"./control-ui-core-CXeSrnoQ.js";import{Q as g,et as _,rt as v,st as y,tt as b}from"./control-ui-core-vPyynwls.js";var x=t({presenceViewerLabel:()=>D});function S(e){return e?.trim()||void 0}function C(e){return[...e].map(S).filter(e=>e!==void 0).toSorted()[0]}function w(e){if(!e||typeof e!=`object`)return[];let t=e.presence;return Array.isArray(t)?t:[]}function T(e,t){let n=new Map,r;for(let i of e){if(i.reason===`disconnect`||!i.user?.id)continue;let e=i.user.id,a=n.get(e);a?a.push(i):n.set(e,[i]),t&&i.instanceId===t&&(r=e)}return{selfUserId:r,users:[...n.entries()].toSorted(([e],[t])=>e<t?-1:+(e>t)).map(([e,t])=>({id:e,name:C(t.map(e=>e.user?.name)),email:C(t.map(e=>e.user?.email)),avatarUrl:C(t.map(e=>e.user?.avatarUrl)),watchedSessions:[...new Set(t.flatMap(e=>e.watchedSessions??[]))].toSorted()}))}}function E(e,t){return F&&N===e&&P===t?F:(N=e,P=t,F=T(w(e),t),F)}function D(e){return e.name??e.email??e.id}function O(e){let t=D(e),n=t.replace(/@.*$/u,``).split(/[^\p{L}\p{N}]+/u).filter(Boolean);return n.length>1?`${n[0]?.[0]??``}${n.at(-1)?.[0]??``}`.toUpperCase():(n[0]??t).slice(0,2).toUpperCase()}function k(e){let t=2166136261;for(let n of e)t^=n.codePointAt(0)??0,t=Math.imul(t,16777619);return`hsl(${(t>>>0)%360} 48% 42%)`}function A(e){return i`<span style=${`background: ${k(e.id)}`}>${O(e)}</span>`}function j(e){let t=f({id:e.email??e.id,name:e.name,profileAvatarUrl:e.avatarUrl});return t.kind===`initials`?A(e):i`<img
      src=${t.url}
      alt=""
      referrerpolicy="no-referrer"
      @error=${e=>{let t=e.currentTarget;t instanceof HTMLImageElement&&t.closest(`.viewer-avatar`)?.classList.add(`is-fallback`)}}
      @load=${e=>{let t=e.currentTarget;t instanceof HTMLImageElement&&t.closest(`.viewer-avatar`)?.classList.remove(`is-fallback`)}}
    />
    <span class="viewer-avatar__fallback" style=${`background: ${k(e.id)}`}
      >${O(e)}</span
    >`}function M(e,t){let n=D(e),r=e.email&&e.email!==n?e.email:void 0;return i`<wa-dropdown-item class="presence-roster-menu__item" data-viewer-id=${e.id}>
    <openclaw-viewer-avatar slot="icon" .user=${e} variant="footer"></openclaw-viewer-avatar>
    <span class="presence-roster-menu__text">
      <span class="presence-roster-menu__name"
        >${n}${t?i` <span class="presence-roster-menu__you">(${m(`presence.you`)})</span>`:c}</span
      >
      ${r?i`<span class="presence-roster-menu__email">${r}</span>`:c}
    </span>
  </wa-dropdown-item>`}var N,P,F,I,L,R=e((()=>{o(),l(),h(),d(),u(),y(),g(),b(),r(),I=class extends p{constructor(...e){super(...e),this.user=null,this.variant=`session`}render(){let e=this.user;if(!e)return c;let t=D(e);return i`<span
      class="viewer-avatar viewer-avatar--${this.variant}"
      data-viewer-id=${e.id}
      aria-label=${t}
    >
      ${j(e)}
    </span>`}},n([a({attribute:!1})],I.prototype,`user`,void 0),n([a()],I.prototype,`variant`,void 0),L=class extends p{constructor(...e){super(...e),this.maxVisible=3,this.variant=`session`,this.rosterPosition=null}openRoster(e){let t=e.currentTarget;if(!(t instanceof HTMLElement))return;let n=t.getBoundingClientRect();this.rosterPosition={x:n.left,y:n.top}}focusRosterTrigger(){this.querySelector(`button.viewer-facepile-trigger`)?.focus()}willUpdate(){if(!this.rosterPosition)return;let e=E(this.presencePayload,this.selfInstanceId);this.variant===`footer`&&!this.sessionKey&&e.users.some(t=>t.id!==e.selfUserId)||(this.rosterPosition=null)}renderRosterMenu(e,t){let n=this.rosterPosition;return n?i`<openclaw-menu-surface>
      <wa-dropdown
        class="presence-roster-menu"
        .open=${!0}
        placement="top-start"
        .distance=${4}
        aria-label=${m(`presence.rosterTitle`)}
        @wa-select=${e=>{e.preventDefault(),this.rosterPosition=null,this.focusRosterTrigger()}}
        @keydown=${e=>v(e,()=>this.focusRosterTrigger())}
        @wa-after-hide=${e=>{let t=_(e);this.rosterPosition=null,t&&this.focusRosterTrigger()}}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          style="position: fixed; left: ${n.x}px; top: ${n.y}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        <div class="presence-roster-menu__title" role="presentation">
          ${m(`presence.rosterTitle`)} · ${e.length}
        </div>
        ${e.map(e=>M(e,e.id===t))}
      </wa-dropdown>
    </openclaw-menu-surface>`:c}render(){let e=E(this.presencePayload,this.selfInstanceId),t=this.sessionKey,n=t?e.users.filter(n=>n.id!==e.selfUserId&&n.watchedSessions.includes(t)):this.variant===`footer`?e.users.filter(t=>t.id!==e.selfUserId):e.users;if(n.length===0)return c;let r=n.slice(0,this.maxVisible),a=n.slice(this.maxVisible),o=i`<span
      class="viewer-facepile viewer-facepile--${this.variant}"
      data-viewer-count=${n.length}
      aria-label=${n.map(D).join(`, `)}
    >
      ${r.map(e=>i`<openclaw-tooltip .content=${D(e)}>
          <openclaw-viewer-avatar .user=${e} .variant=${this.variant}></openclaw-viewer-avatar>
        </openclaw-tooltip>`)}
      ${a.length>0?i`<openclaw-tooltip .content=${a.map(D).join(`
`)}>
            <span
              class="viewer-avatar viewer-avatar--overflow"
              aria-label=${a.map(D).join(`, `)}
              >+${a.length}</span
            >
          </openclaw-tooltip>`:c}
    </span>`;if(this.variant!==`footer`)return o;let s=[...e.users].toSorted((t,n)=>t.id===e.selfUserId?-1:+(n.id===e.selfUserId));return i`<button
        type="button"
        class="viewer-facepile-trigger"
        aria-label=${m(`presence.rosterLabel`)}
        aria-haspopup="menu"
        aria-expanded=${this.rosterPosition!==null}
        @click=${e=>this.openRoster(e)}
      >
        ${o}
      </button>
      ${this.renderRosterMenu(s,e.selfUserId)}`}},n([a({attribute:!1})],L.prototype,`presencePayload`,void 0),n([a({attribute:!1})],L.prototype,`selfInstanceId`,void 0),n([a({attribute:!1})],L.prototype,`sessionKey`,void 0),n([a({type:Number,attribute:`max-visible`})],L.prototype,`maxVisible`,void 0),n([a()],L.prototype,`variant`,void 0),n([s()],L.prototype,`rosterPosition`,void 0),globalThis.customElements&&(customElements.get(`openclaw-viewer-avatar`)||customElements.define(`openclaw-viewer-avatar`,I),customElements.get(`openclaw-viewer-facepile`)||customElements.define(`openclaw-viewer-facepile`,L))}));export{x as n,R as t};
//# sourceMappingURL=viewer-facepile-iLhMW_aV.js.map