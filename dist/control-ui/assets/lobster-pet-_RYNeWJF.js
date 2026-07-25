import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{l as n,u as r}from"./control-ui-foundation-43q8Lf_T.js";import{lt as i}from"./control-ui-foundation-DQl2NL7K.js";import{$ as a,G as o,J as s,U as c,X as l,tt as u,z as d}from"./lit-runtime-CE4wpvNA.js";import{G as f,j as p}from"./control-ui-foundation-DFIFKu9N.js";import{Lo as m,zo as h}from"./control-ui-core-Dx4utKSD.js";import{F as g,I as ee,L as te,R as ne,z as re}from"./control-ui-core-vPyynwls.js";var ie=e((()=>{}));function ae(e){let t=`${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()}`,n=2166136261;for(let e=0;e<t.length;e++)n^=t.charCodeAt(e),n=Math.imul(n,16777619);return n>>>0}function oe(e){return ae(e)%16==3}var se=e((()=>{}));function _(){try{let e=m()?.getItem(y),t=e?JSON.parse(e):{},n=new Map;if(Array.isArray(t)){for(let e of t)typeof e==`string`&&e&&n.set(e,{firstSeenAt:null,name:null});return n}if(t&&typeof t==`object`)for(let[e,r]of Object.entries(t))e&&n.set(e,{firstSeenAt:typeof r?.firstSeenAt==`number`?r.firstSeenAt:null,name:typeof r?.name==`string`&&r.name?r.name:null});return n}catch{return new Map}}function ce(e){let t={};for(let[n,r]of[...e.entries()].toSorted(([e],[t])=>e.localeCompare(t)))t[n]={...r.firstSeenAt===null?{}:{firstSeenAt:r.firstSeenAt},...r.name===null?{}:{name:r.name}};m()?.setItem(y,JSON.stringify(t))}function le(){return new Set(_().keys())}function ue(){return _()}function de(e,t={}){try{let n=_(),r=n.get(e);if(r){if(r.firstSeenAt!==null&&r.name!==null)return;n.set(e,{firstSeenAt:r.firstSeenAt??Date.now(),name:r.name??t.name??null})}else n.set(e,{firstSeenAt:Date.now(),name:t.name??null});ce(n)}catch{}}function v(){try{let e=m()?.getItem(b),t=e?JSON.parse(e):{},n=t&&typeof t==`object`?t:{};return{visits:typeof n.visits==`number`&&n.visits>=0?n.visits:0,shoos:typeof n.shoos==`number`&&n.shoos>=0?n.shoos:0}}catch{return{visits:0,shoos:0}}}function fe(e){try{m()?.setItem(b,JSON.stringify(e))}catch{}}function pe(){let e=v();fe({...e,visits:e.visits+1})}function me(){let e=v();fe({...e,shoos:e.shoos+1})}function he(){let{visits:e,shoos:t}=v();return{tier:e<3?`shy`:e<15?`regular`:`friend`,wary:t>=3&&t>e*.3,visits:e,shoos:t}}function ge(e){for(let[t,n]of ve)if(e>=t)return n;return null}function _e(e,t){if(e===null||t.getTime()-e<ye)return!1;let n=new Date(e);return n.getMonth()===t.getMonth()&&n.getDate()===t.getDate()}var y,b,x,ve,ye,S=e((()=>{h(),y=`openclaw.control.lobsterdex.v1`,b=`openclaw.control.lobsterpet.familiarity.v1`,x={shy:{stayMul:.6,firstDelayMul:1.3,gapMul:1},regular:{stayMul:1,firstDelayMul:1,gapMul:1},friend:{stayMul:1.6,firstDelayMul:.7,gapMul:.8},waryGapMul:1.7},ve=[[250,`Elder`],[100,`Captain`],[50,`Sir`]],ye=300*24*60*60*1e3}));function be(e,t,n){let r=e;if(!t)return r;try{let e=window.AudioContext;if(!e)return r;r??=new e,r.state===`suspended`&&r.resume();let t=r.currentTime,i=r.createOscillator(),a=r.createGain();i.type=`sine`,n===`poke`?(i.frequency.setValueAtTime(330,t),i.frequency.exponentialRampToValueAtTime(165,t+.09)):(i.frequency.setValueAtTime(392,t),i.frequency.exponentialRampToValueAtTime(523,t+.18)),a.gain.setValueAtTime(1e-4,t),a.gain.exponentialRampToValueAtTime(.05,t+.02),a.gain.exponentialRampToValueAtTime(1e-4,t+(n===`poke`?.12:.24)),i.connect(a).connect(r.destination),i.start(t),i.stop(t+.26)}catch{}return r}var xe=e((()=>{}));function Se(e){return{palette:e,scale:2,accessory:`none`,antennae:`perky`,side:`left`,spotPct:0,facing:1,personality:`friendly`,blinkDelayS:0,build:`round`,clawSize:`regular`,tailFan:!1}}function Ce(e){return e.getMonth()===N.month&&e.getDate()===N.day}function we(e){let t=e.getMonth(),n=e.getDate();return t===11?[[`santa`,18]]:t===9&&n>=20?[[`pumpkin`,18]]:[]}function C(e,t){return V[e.palette.id]??f(B[(t>>>3)%B.length],`lobster pet name catalog entry`)}function Te(e,t){for(let n=1;n<=24;n++){let r=D(e+n*7919>>>0);if(r.palette.id!==t)return r}return D(e+1>>>0)}function w(e){let t=e>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function T(e,t){let n=t.reduce((e,[,t])=>e+t,0),r=e()*n;for(let[e,n]of t)if(r-=n,r<=0)return e;return f(t.at(-1),`weighted lobster choice fallback`)[0]}function E(e,t,n){return t+e()*(n-t)}function D(e,t=new Date){let n=w(e),r=T(n,A),i=T(n,F),a=T(n,[...M,...we(t)]),o=n()<.6?`perky`:`droopy`,s=n()<.5?`left`:`right`,c=H[s],l=Math.round(E(n,c[0],c[1])),u=n()<.5?1:-1,d=T(n,P),f=Math.round(E(n,0,4)*10)/10,p=T(n,I),m=T(n,L),h=n()<.3;return Ce(t)?{palette:A.find(([e])=>e.id===`retro`)?.[0]??r,scale:i,accessory:`party`,antennae:o,side:s,spotPct:l,facing:u,personality:d,blinkDelayS:f,build:p,clawSize:m,tailFan:h}:{palette:r,scale:i,accessory:a,antennae:o,side:s,spotPct:l,facing:u,personality:d,blinkDelayS:f,build:p,clawSize:m,tailFan:h}}function Ee(){return u`
    <svg
      class="lobster-pet__svg"
      viewBox="0 0 120 105"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="#a63a2e" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M22 78 L8 88" />
        <path d="M28 88 L16 99" />
        <path d="M98 78 L112 88" />
        <path d="M92 88 L104 99" />
      </g>
      <g stroke="#c44536" stroke-width="3.5" stroke-linecap="round" fill="none">
        <path d="M44 38 L40 24" />
        <path d="M76 38 L80 24" />
      </g>
      <circle cx="40" cy="22" r="4.5" fill="#0a1014" />
      <circle cx="80" cy="22" r="4.5" fill="#0a1014" />
      <circle cx="41.5" cy="20.5" r="1.8" fill="#ffd166" />
      <circle cx="81.5" cy="20.5" r="1.8" fill="#ffd166" />
      <ellipse cx="60" cy="70" rx="46" ry="30" fill="#c44536" />
      <ellipse cx="48" cy="60" rx="16" ry="9" fill="#ffffff" opacity="0.1" />
      <path
        d="M16 58 C2 52 -2 62 4 72 C10 82 20 76 24 66 C26 60 22 58 16 58 Z"
        fill="#d95f4b"
      />
      <path
        d="M104 58 C118 52 122 62 116 72 C110 82 100 76 96 66 C94 60 98 58 104 58 Z"
        fill="#d95f4b"
      />
      <path d="M48 82 Q60 90 72 82" stroke="#7e2a20" stroke-width="3" stroke-linecap="round" fill="none" />
    </svg>
  `}function O(e,t={}){return u`
    <svg
      class="lobster-pet__svg"
      viewBox="0 0 120 105"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      ${e.palette.id===`retro`?Me:ze[e.antennae]}
      ${e.tailFan?Pe:l}
      <g class="lob-claw lob-claw--l">
        <path
          d="M20 42 C5 37 0 47 5 57 C10 67 20 62 25 52 C28 45 25 42 20 42 Z"
          fill="var(--lob-claw)"
        />
      </g>
      ${e.palette.id===`retro`?l:u`
            <g class="lob-claw lob-claw--r">
              <path
                d="M100 42 C115 37 120 47 115 57 C110 67 100 62 95 52 C92 45 95 42 100 42 Z"
                fill="var(--lob-claw)"
              />
            </g>
          `}
      <path
        d="M60 8 C32 8 16 32 16 52 C16 72 30 90 44 95 L44 104 L54 104 L54 96 C58 97.5 62 97.5 66 96 L66 104 L76 104 L76 95 C90 90 104 72 104 52 C104 32 88 8 60 8 Z"
        fill="var(--lob-shell)"
      />
      ${e.palette.id===`split`?Ae:l}
      ${e.palette.id===`calico`?ke:l}
      <ellipse cx="48" cy="28" rx="20" ry="11" fill="#ffffff" opacity="0.1" />
      <g class="lob-eye-open" style=${t.shell||t.sleeping?`display:none`:``}>
        <circle cx="45" cy="32" r="5.5" fill="#0a1014" />
        <circle cx="75" cy="32" r="5.5" fill="#0a1014" />
        <circle cx="46.5" cy="30.5" r="2.2" fill="var(--lob-glint, #00e5cc)" />
        <circle cx="76.5" cy="30.5" r="2.2" fill="var(--lob-glint, #00e5cc)" />
      </g>
      ${t.sleeping?u`
            <g class="lob-eye-peek">
              <circle cx="45" cy="32" r="4" fill="#0a1014" />
              <circle cx="46" cy="30.8" r="1.6" fill="var(--lob-glint, #00e5cc)" />
            </g>
          `:l}
      <g
        class="lob-eye-closed"
        stroke="#0a1014"
        stroke-width="3"
        stroke-linecap="round"
        fill="none"
        style=${t.shell||t.sleeping?`opacity:1`:t.standalone?`display:none`:``}
      >
        <path d="M39 33 Q45 28 51 33" />
        <path d="M69 33 Q75 28 81 33" />
      </g>
      ${e.palette.id===`retro`?u`
            ${Ne}
            <g class="lob-claw lob-claw--r">${je}</g>
          `:l}
      ${t.grumpy&&e.palette.id!==`retro`?Re:l}
      ${e.accessory===`none`||t.shell?l:Oe[e.accessory]}
      ${t.bindle&&e.palette.id!==`retro`?Fe:l}
      ${t.sailorCap&&!t.shell&&!Ie.has(e.accessory)?Le:l}
    </svg>
  `}function k(e,t,n,r){return[`--lob-shell:${e.palette.shell}`,`--lob-claw:${e.palette.claw}`,`--lob-scale:${t}`,`--lob-x:${n}%`,`--lob-face:${r}`,`--lob-blink-delay:${e.blinkDelayS}s`,`--lob-w:${R[e.build].w}`,`--lob-h:${R[e.build].h}`,`--lob-claw-scale:${z[e.clawSize]}`].join(`;`)}function De(e){let t=t=>e.anchor===`bar`?Math.min(t,e.barMaxScale):t,n=n=>{let r=e.anniversary&&e.look.accessory!==`party`?{...e.look,accessory:`party`}:e.look,i=[`lobster-pet`,`lobster-pet--${e.mode}`,`lobster-pet--palette-${e.look.palette.id}`,n?`lobster-pet--twin`:``,r.accessory===`party`?`lobster-pet--party`:``,e.presence===`leaving`?`lobster-pet--away`:``,e.entering?`lobster-pet--entering`:``,e.grumpy?`lobster-pet--grumpy`:``,e.vigil?`lobster-pet--vigil`:``,e.act?`lobster-pet--act-${e.act}`:``].filter(Boolean).join(` `),o=n?Math.min(e.zone[1],Math.max(e.zone[0],e.spotPct+(e.facing===1?-12:12))):e.spotPct,s=t(n?e.look.scale*.55:e.look.scale),c=n?`${k(e.look,s,o,e.facing===1?-1:1)};--lob-act-delay:0.18s`:k(e.look,s,o,e.facing),l=ge(e.familiarityVisits),u=C(e.look,e.seed),d=l?`${l} ${u}`:u,f=e.movingDay&&!n;return a`
      <div
        class=${i}
        style=${c}
        aria-hidden="true"
        title=${n?`${d} Jr.`:f?`${d} · just moved in`:d}
        @pointerdown=${e.onPointerDown}
        @pointerup=${e.onPointerUp}
        @pointercancel=${e.onPointerCancel}
        @pointerleave=${e.onPointerCancel}
        @contextmenu=${e.onContextMenu}
      >
        <div class="lobster-pet__body">
          ${O(r,{grumpy:e.grumpy,bindle:f,sailorCap:e.sailorDay})}
          <span class="lobster-pet__z" style="--i:0">z</span>
          <span class="lobster-pet__z" style="--i:1">z</span>
          <span class="lobster-pet__z" style="--i:2">Z</span>
          <span class="lobster-pet__bubble" style="--i:0"></span>
          <span class="lobster-pet__bubble" style="--i:1"></span>
          <span class="lobster-pet__bubble" style="--i:2"></span>
          <span class="lobster-pet__heart">♥</span>
          <svg class="lobster-pet__broom" viewBox="0 0 24 40" aria-hidden="true">
            <path d="M12 2 L12 24" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round" />
            <path d="M6 24 L18 24 L21 38 L3 38 Z" fill="#e8b04b" />
            <path
              d="M7.5 28 L6.5 36 M12 28 L12 36 M16.5 28 L17.5 36"
              stroke="#b6791f"
              stroke-width="1.5"
            />
          </svg>
        </div>
      </div>
    `},r=e.presence!==`out`&&!e.logoPerched,i=e.shellVisible&&e.visitsEnabled&&!e.dismissed,o=e.passer!==null&&e.visitsEnabled;if(!r&&!i&&!o)return l;let s=k(e.look,t(e.shellScale),e.shellSpotPct,e.facing),c=e.passer?.kind===`stranger`?Te(e.seed,e.look.palette.id):e.look,u=e.passer?[`lobster-pet`,`lobster-pet--passer`,e.passer.kind===`crab`?`lobster-pet--crab`:`lobster-pet--palette-${c.palette.id}`,e.passer.direction===1?`lobster-pet--passer-ltr`:`lobster-pet--passer-rtl`].join(` `):``,d=e.passer?.kind===`crab`?`--lob-scale:2;--lob-w:1;--lob-h:0.82;--lob-face:1`:e.passer?k(c,Math.min(c.scale,2),0,e.passer.direction):``;return a`
    ${i?a`
          <div class="lobster-pet lobster-pet--shell" style=${s} aria-hidden="true">
            <div class="lobster-pet__body">${O(e.look,{shell:!0})}</div>
          </div>
        `:l}
    ${r?n(!1):l}
    ${r&&e.twinPlanned?n(!0):l}
    ${o&&e.passer?a`
          <div
            class=${u}
            style=${d}
            aria-hidden="true"
            title=${e.passer.kind===`crab`?`definitely a lobster`:`a stranger`}
          >
            <div class="lobster-pet__body">
              ${e.passer.kind===`crab`?Ee():O(c,{standalone:!0})}
            </div>
          </div>
        `:l}
  `}var A,j,M,N,P,F,I,L,R,z,B,V,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,H,U=e((()=>{p(),s(),S(),A=[[{id:`crimson`,shell:`#ff4f40`,claw:`#ff775f`},26],[{id:`coral`,shell:`#d0836a`,claw:`#de9b80`},26],[{id:`teal`,shell:`#2fbfa7`,claw:`#5cd9c4`},10],[{id:`violet`,shell:`#9f7dfa`,claw:`#bba4fd`},10],[{id:`ink`,shell:`#5e6b7a`,claw:`#7b8996`},9],[{id:`blue`,shell:`#4a7dfc`,claw:`#7fa4ff`},7],[{id:`gold`,shell:`#f4b840`,claw:`#f9d47a`},5],[{id:`calico`,shell:`#d97a3d`,claw:`#e89a63`},3],[{id:`abyss`,shell:`#2c3b68`,claw:`#465b96`},2],[{id:`ghost`,shell:`#dce8f2`,claw:`#ecf3fa`},1],[{id:`split`,shell:`#ff4f40`,claw:`#ff775f`},1],[{id:`retro`,shell:`#e8262c`,claw:`#f04a3e`},.5]],j=A.map(([e])=>e),M=[[`none`,62],[`sprout`,14],[`patch`,14],[`crown`,10]],N={month:10,day:24},P=[[`sleepy`,25],[`zoomy`,25],[`friendly`,25],[`showoff`,25]],F=[[1.7,25],[2,55],[2.5,20]],I=[[`round`,40],[`squat`,30],[`slender`,30]],L=[[`regular`,55],[`dainty`,25],[`mighty`,20]],R={round:{w:1,h:1},squat:{w:1.14,h:.9},slender:{w:.88,h:1.1}},z={dainty:.85,regular:1,mighty:1.18},B=[`Pinchy`,`Barnaby`,`Thermidor`,`Clawdette`,`Sheldon`,`Scuttles`,`Bisque`,`Crusty`,`Snips`,`Bubbles`,`Clawdia`,`Ferdinand`,`Maple`,`Pearl`,`Biscuit`,`Captain`,`Ziggy`,`Noodle`,`Waffles`,`Pippin`,`Squirt`,`Chip`,`Clementine`,`Moss`],V={blue:`Blueberry`,gold:`Goldie`,calico:`Patches`,abyss:`Lantern`,ghost:`Boo`,split:`Picasso`,retro:`OG`},Oe={crown:u`
    <path
      d="M46 12 L46 2 L53 8 L60 0 L67 8 L74 2 L74 12 Q60 8 46 12 Z"
      fill="#f6c945"
    />
  `,sprout:u`
    <g>
      <path d="M60 12 Q58 4 63 1" stroke="#3f9d63" stroke-width="3" stroke-linecap="round" fill="none" />
      <ellipse cx="67" cy="3" rx="5" ry="3" fill="#57c785" transform="rotate(-24 67 3)" />
    </g>
  `,patch:u`
    <g>
      <path d="M28 27 Q60 14 92 22" stroke="#101820" stroke-width="4" stroke-linecap="round" fill="none" />
      <circle cx="75" cy="32" r="9" fill="#101820" />
    </g>
  `,santa:u`
    <g>
      <path d="M47 10 Q54 1 68 3 L72 9 Z" fill="#e0312f" />
      <circle cx="71" cy="3.5" r="3.5" fill="#f5f7fa" />
      <ellipse cx="59" cy="10.5" rx="15" ry="3.5" fill="#f5f7fa" />
    </g>
  `,pumpkin:u`
    <g>
      <ellipse cx="60" cy="6.5" rx="8.5" ry="5.5" fill="#e8871e" />
      <path d="M56 2.5 Q56 6.5 56 10.5 M64 2.5 Q64 6.5 64 10.5" stroke="#c96a10" stroke-width="1.5" fill="none" />
      <path d="M60 1.5 Q60.5 0 63 0.5" stroke="#4c9a4c" stroke-width="2.5" stroke-linecap="round" fill="none" />
    </g>
  `,party:u`
    <g>
      <path d="M52 11 L60 0.5 L68 11 Z" fill="#7c5cff" />
      <path d="M55.5 6.5 L64.5 6.5" stroke="#ffd166" stroke-width="2" />
      <circle cx="60" cy="1" r="2.4" fill="#ff5c8a" />
    </g>
  `},ke=u`
  <g class="lob-spots" fill="#2a1f16" opacity="0.8">
    <ellipse cx="40" cy="50" rx="6" ry="4" transform="rotate(-15 40 50)" />
    <ellipse cx="72" cy="62" rx="7" ry="4.5" transform="rotate(18 72 62)" />
    <ellipse cx="55" cy="76" rx="5" ry="3.5" transform="rotate(-8 55 76)" />
    <ellipse cx="84" cy="42" rx="4" ry="3" transform="rotate(25 84 42)" />
    <ellipse cx="47" cy="18" rx="4.5" ry="3" transform="rotate(-20 47 18)" />
    <ellipse cx="30" cy="64" rx="4" ry="3" transform="rotate(12 30 64)" />
  </g>
`,Ae=u`
  <path
    class="lob-split-half"
    d="M60 8 C88 8 104 32 104 52 C104 72 90 90 76 95 L76 104 L66 104 L66 96 C64 96.8 62 97.1 60 97.1 L60 8 Z"
    fill="var(--lob-shell2, #46536b)"
  />
`,je=u`
  <path
    d="M95 55 C112 53 119 39 116 25 C113 11 99 5 91 12 C88 15 87 19 88 23 C83 27 83 36 88 43 C91 49 93 52 95 55 Z"
    fill="var(--lob-claw)"
  />
  <path
    d="M92 14 C97 22 99 31 95 41"
    stroke="#b8151b"
    stroke-width="3"
    stroke-linecap="round"
    fill="none"
  />
`,Me=u`
  <g class="lob-antennae" stroke="var(--lob-shell)" stroke-width="4" stroke-linecap="round" fill="none">
    <path d="M50 16 Q45 4 37 1" />
    <path d="M70 16 Q75 4 83 1" />
  </g>
`,Ne=u`
  <g stroke="#0a1014" stroke-linecap="round" fill="none">
    <path d="M37 24 L51 28" stroke-width="3.5" />
    <path d="M69 28 L83 24" stroke-width="3.5" />
    <path d="M49 45 Q59 51 69 45 L72 42" stroke-width="3" />
  </g>
`,Pe=u`
  <g class="lob-tail">
    <ellipse cx="16" cy="84" rx="11" ry="7" transform="rotate(-32 16 84)" />
    <ellipse cx="104" cy="84" rx="11" ry="7" transform="rotate(32 104 84)" />
  </g>
`,Fe=u`
  <g class="lob-bindle">
    <path d="M70 62 L99 30" stroke="#8a5a2b" stroke-width="3.5" stroke-linecap="round" />
    <circle cx="101" cy="27" r="9.5" fill="#e8b04b" />
    <circle cx="98" cy="24" r="1.6" fill="#b6791f" />
    <circle cx="104" cy="29" r="1.6" fill="#b6791f" />
    <circle cx="100" cy="32" r="1.3" fill="#b6791f" />
  </g>
`,Ie=new Set([`crown`,`sprout`,`santa`,`pumpkin`,`party`]),Le=u`
  <g class="lob-cap">
    <path d="M46 10 Q60 -3 74 10 L74 13 Q60 7 46 13 Z" fill="#f5f7fa" />
    <path d="M45 12 Q60 6 75 12 L75 16 Q60 10.5 45 16 Z" fill="#dfe7ee" />
    <circle cx="60" cy="2.5" r="1.8" fill="#3b6ea5" />
  </g>
`,Re=u`
  <g stroke="#0a1014" stroke-linecap="round" fill="none">
    <path d="M37 24 L51 28" stroke-width="3.5" />
    <path d="M69 28 L83 24" stroke-width="3.5" />
    <path d="M50 48 Q60 42 70 48" stroke-width="3" />
  </g>
`,ze={perky:u`
    <g class="lob-antennae" stroke="var(--lob-shell)" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M46 14 Q38 4 31 7" />
      <path d="M74 14 Q82 4 89 7" />
    </g>
  `,droopy:u`
    <g class="lob-antennae" stroke="var(--lob-shell)" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M46 14 Q36 8 34 18" />
      <path d="M74 14 Q84 8 86 18" />
    </g>
  `},H={left:[12,38],right:[60,84]}})),W,Be=e((()=>{s(),d(),U(),r(),W=class extends i{constructor(...e){super(...e),this.visit=null}createRenderRoot(){return this}render(){let e=this.visit;if(!e?.look)return l;let t=e.look;return a`
      <span class=${[`sidebar-brand__pet`,`lobster-pet--palette-${t.palette.id}`,e.phase===`leaving`?`sidebar-brand__pet--leaving`:``].filter(Boolean).join(` `)} style=${[`--lob-shell:${t.palette.shell}`,`--lob-claw:${t.palette.claw}`,`--lob-blink-delay:${t.blinkDelayS}s`,`--lob-w:${R[t.build].w}`,`--lob-h:${R[t.build].h}`,`--lob-claw-scale:${z[t.clawSize]}`].join(`;`)} title=${`${e.name} · filling in for the logo`}
        >${O(t)}</span
      >
    `}},n([o({attribute:!1})],W.prototype,`visit`,void 0),customElements.get(`openclaw-lobster-logo-standin`)||customElements.define(`openclaw-lobster-logo-standin`,W)}));function Ve(e,t,n=new Date){return e===`busy`||e===`offline`?Xe[e]:Je(n)?K.sleepy:t?K[t]:null}function He(e){return e===`error`?`droop`:e===`aborted`?`startle`:`cheer`}function Ue(e){return w((e^12317)>>>0)()<.12}function We(e){return w((e^30485)>>>0)()<.04}function Ge(e){return w((e^4195)>>>0)()<.12}function Ke(e){let t=w((e^3243)>>>0),n=t();return n>=.095?null:{kind:n<.015?`crab`:`stranger`,atMs:Math.round(6e4+t()*84e4),direction:t()<.5?1:-1}}function qe(e){try{let t=m();if(!t)return!1;let n=t.getItem(Q);return n===e?!1:(t.setItem(Q,e),n!==null)}catch{return!1}}function Je(e=new Date){let t=e.getHours();return t>=22||t<6}function G(){return typeof window<`u`&&typeof window.matchMedia==`function`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}var Ye,K,Xe,q,Ze,Qe,J,Y,X,Z,Q,$e=e((()=>{h(),U(),Ye={wave:1400,snip:1e3,hop:750,spin:950,peek:1700,nap:4400,bubble:2600,scuttle:1250,startle:750,cheer:1300,molt:2600,pet:1500,droop:1600,sweep:1800},K={sleepy:{delayMs:[6e3,12e3],acts:[[`nap`,40],[`bubble`,20],[`wave`,12],[`scuttle`,12],[`peek`,10],[`hop`,6]]},zoomy:{delayMs:[2800,6e3],acts:[[`scuttle`,42],[`hop`,22],[`spin`,12],[`peek`,12],[`wave`,12]]},friendly:{delayMs:[3600,7500],acts:[[`wave`,32],[`snip`,22],[`scuttle`,18],[`hop`,14],[`bubble`,14]]},showoff:{delayMs:[3600,7500],acts:[[`spin`,24],[`snip`,22],[`peek`,20],[`hop`,18],[`wave`,16]]}},Xe={busy:{delayMs:[2200,4500],acts:[[`scuttle`,40],[`hop`,20],[`snip`,20],[`wave`,12],[`spin`,8]]},offline:{delayMs:[2800,5600],acts:[[`scuttle`,55],[`peek`,30],[`hop`,15]]}},q=11e3,Ze=[18,50],Qe=1.7,J=[15e3,18e4],Y=[9e4,3e5],X=[36e4,108e4],Z=.3,Q=`openclaw.control.lobsterpet.gatewayVersion.v1`})),et=t({LOBSTER_LOGO_VISIT_EVENT:()=>g,LOBSTER_PET_BUILD_MULS:()=>R,LOBSTER_PET_CLAW_MULS:()=>z,LOBSTER_PET_PALETTES:()=>j,canonicalLobsterLook:()=>Se,createLobsterPetLook:()=>D,lobsterPetSeed:()=>te,renderLobsterSvg:()=>O,resolveLobsterPetMode:()=>ne,resolveLobsterRunOutcome:()=>re}),$,tt=e((()=>{ie(),p(),s(),d(),se(),S(),xe(),ee(),U(),Be(),$e(),r(),$=class extends i{constructor(...e){super(...e),this.seed=0,this.mode=`idle`,this.visitsEnabled=!0,this.runOutcome=`ok`,this.soundsEnabled=!1,this.gatewayVersion=null,this.act=null,this.spotPct=80,this.facing=1,this.entering=!1,this.presence=`out`,this.anchor=`ledge`,this.scheduledVisiting=!1,this.logoPerched=!1,this.logoScared=!1,this.logoScarePending=!1,this.logoScareTimer=null,this.scareRng=w(0),this.logoPlanned=!1,this.logoDone=!1,this.lastLogoPhase=`out`,this.dismissed=!1,this.grumpy=!1,this.vigil=!1,this.outcomePresenceOwner=null,this.passer=null,this.movingDay=!1,this.movingDayChecked=!1,this.anniversary=!1,this.sailorDay=!1,this.shellVisible=!1,this.shellSpotPct=50,this.shellScale=2,this.molted=!1,this.moltPlanned=!1,this.twinPlanned=!1,this.shellTimer=null,this.passerTimer=null,this.passerEndTimer=null,this.passerWatchTimer=null,this.familiarity={tier:`regular`,wary:!1,visits:0,shoos:0},this.greetedThisLoad=!1,this.look=null,this.rng=w(0),this.visitRng=w(0),this.idleTimer=null,this.actEndTimer=null,this.enterTimer=null,this.visitTimer=null,this.leaveTimer=null,this.grumpyTimer=null,this.vigilTimer=null,this.holdTimer=null,this.holdPetted=!1,this.audioCtx=null,this.pokeTimes=[],this.lastGazeAt=0,this.restartPending=!1,this.handleVisibilityChange=()=>{document.hidden?(this.outcomePresenceOwner=null,this.clearActTimers(),this.act=null):this.scheduleNextAct()},this.handleHoldStart=()=>{G()||(this.holdPetted=!1,this.holdTimer!==null&&window.clearTimeout(this.holdTimer),this.holdTimer=window.setTimeout(()=>{this.holdTimer=null,this.holdPetted=!0,this.grumpy=!1,this.playChirp(`pet`),this.performAct(`pet`)},600))},this.handleHoldEnd=()=>{this.holdTimer!==null&&(window.clearTimeout(this.holdTimer),this.holdTimer=null,this.holdPetted||this.pokeNow()),this.holdPetted=!1},this.handleHoldCancel=()=>{this.holdTimer!==null&&(window.clearTimeout(this.holdTimer),this.holdTimer=null),this.holdPetted=!1},this.handleGaze=e=>{if(this.presence!==`in`||this.act!==null||this.vigil||G())return;let t=Date.now();if(t-this.lastGazeAt<120)return;this.lastGazeAt=t;let n=this.querySelector(`.lobster-pet:not(.lobster-pet--shell)`);if(!n)return;let r=n.getBoundingClientRect(),i=r.left+r.width/2,a=e.clientX<i?-1:1;a!==this.facing&&(this.facing=a)},this.handleShoo=e=>{e.preventDefault(),this.dismissed=!0,me()}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),document.addEventListener(`visibilitychange`,this.handleVisibilityChange),document.addEventListener(`pointermove`,this.handleGaze,{passive:!0})}disconnectedCallback(){document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.clearActTimers(),this.clearVisitTimers(),this.grumpyTimer!==null&&(window.clearTimeout(this.grumpyTimer),this.grumpyTimer=null),this.shellTimer!==null&&(window.clearTimeout(this.shellTimer),this.shellTimer=null);for(let e of[this.vigilTimer,this.holdTimer,this.passerTimer,this.passerEndTimer,this.passerWatchTimer,this.logoScareTimer])e!==null&&window.clearTimeout(e);this.vigilTimer=null,this.holdTimer=null,this.passerTimer=null,this.passerEndTimer=null,this.passerWatchTimer=null,this.logoScareTimer=null,this.audioCtx&&=(this.audioCtx.close().catch(()=>{}),null),document.removeEventListener(`pointermove`,this.handleGaze),super.disconnectedCallback()}wantsVisible(){return this.visitsEnabled&&!this.dismissed&&(this.mode===`offline`||this.vigil||this.outcomePresenceOwner!==null||this.scheduledVisiting)}willUpdate(e){if(this.look===null||e.has(`seed`))this.look=D(this.seed),this.rng=w(this.seed^2654435769),this.visitRng=w(this.seed^99282957),this.scareRng=w((this.seed^379438)>>>0),this.spotPct=this.look.spotPct,this.facing=this.look.facing,this.clearActTimers(),this.act=null,this.dismissed=!1,this.presence=`out`,this.molted=!1,this.shellVisible=!1,this.shellTimer!==null&&(window.clearTimeout(this.shellTimer),this.shellTimer=null),this.moltPlanned=Ue(this.seed),this.twinPlanned=We(this.seed),this.logoPlanned=Ge(this.seed),this.logoDone=!1,this.logoPerched=!1,this.logoScared=!1,this.logoScarePending=!1,this.logoScareTimer!==null&&(window.clearTimeout(this.logoScareTimer),this.logoScareTimer=null),this.familiarity=he(),this.sailorDay=oe(new Date),this.greetedThisLoad=!1,this.scheduleVisits(),this.schedulePasser(),this.vigil=!1,this.outcomePresenceOwner=null,this.trackVigil();else if(e.has(`mode`)){this.logoPerched&&this.mode!==`idle`&&(this.logoPerched=!1);let t=e.get(`mode`)===`busy`&&this.mode===`idle`,n=t&&this.vigil?`vigil`:null;if(this.trackVigil(),this.presence===`in`&&!G()){let e=He(this.runOutcome);this.performAct(t?e:`startle`,n)}}!this.movingDayChecked&&this.gatewayVersion&&(this.movingDayChecked=!0,this.movingDay=qe(this.gatewayVersion)),this.reconcilePresence()}reconcilePresence(){let e=this.wantsVisible();if(e&&this.presence!==`in`){if(this.leaveTimer!==null&&(window.clearTimeout(this.leaveTimer),this.leaveTimer=null),this.presence===`out`){this.rollPerch(),this.logoPerched=this.logoPlanned&&!this.logoDone&&this.scheduledVisiting&&this.mode===`idle`,this.logoPerched&&(this.logoDone=!0);let e=this.scareRng()<Z;this.logoScarePending=e&&!this.logoPerched&&this.scheduledVisiting&&this.mode===`idle`&&!G(),this.look&&(this.anniversary=_e(ue().get(this.look.palette.id)?.firstSeenAt??null,new Date),de(this.look.palette.id,{name:C(this.look,this.seed)}),pe())}this.presence=`in`,this.entering=!G(),this.restartPending=!0;return}!e&&this.presence===`in`&&(this.outcomePresenceOwner=null,this.clearActTimers(),this.act=null,this.entering=!1,this.logoScarePending=!1,this.logoScareTimer!==null&&(window.clearTimeout(this.logoScareTimer),this.logoScareTimer=null),this.presence=`leaving`,this.leaveTimer=window.setTimeout(()=>{this.leaveTimer=null,this.presence=`out`,this.logoPerched=!1,this.logoScared=!1},350))}updated(){this.dispatchLogoPhase(),this.restartPending&&(this.restartPending=!1,this.enterTimer=window.setTimeout(()=>{this.enterTimer=null,this.entering=!1,!this.greetedThisLoad&&this.familiarity.tier===`friend`&&this.presence===`in`&&!this.logoPerched&&!G()&&(this.greetedThisLoad=!0,this.performAct(`wave`))},450),this.logoScarePending&&(this.logoScarePending=!1,this.logoScareTimer=window.setTimeout(()=>{this.logoScareTimer=null,this.presence===`in`&&!this.logoPerched&&(this.logoScared=!0)},900)),this.scheduleNextAct())}logoVisitPhase(){return!(this.logoPerched||this.logoScared)||!this.visitsEnabled||this.dismissed?`out`:this.presence===`in`?`in`:this.presence===`leaving`?`leaving`:`out`}dispatchLogoPhase(){let e=this.logoVisitPhase();if(e===this.lastLogoPhase)return;this.lastLogoPhase=e;let t=e===`out`||!this.logoPerched||!this.look?null:this.look,n=t&&this.anniversary&&t.accessory!==`party`?{...t,accessory:`party`}:t;this.dispatchEvent(new CustomEvent(g,{detail:{phase:e,look:n,name:n?C(n,this.seed):null},bubbles:!0,composed:!0}))}playChirp(e){this.audioCtx=be(this.audioCtx,this.soundsEnabled,e)}pokeNow(){this.playChirp(`poke`);let e=Date.now();if(this.pokeTimes=[...this.pokeTimes.filter(t=>e-t<6e3),e],this.pokeTimes.length>=10&&this.mode!==`offline`){this.huffOff();return}this.pokeTimes.length>=3&&this.enterGrumpy(),this.performAct(`startle`)}enterGrumpy(){this.grumpy=!0,this.grumpyTimer!==null&&window.clearTimeout(this.grumpyTimer),this.grumpyTimer=window.setTimeout(()=>{this.grumpyTimer=null,this.grumpy=!1},6e4)}huffOff(){this.pokeTimes=[],this.grumpy=!1,this.clearVisitTimers(),this.scheduledVisiting=!1,this.armArrival(E(this.visitRng,X[0],X[1]))}trackVigil(){this.vigilTimer!==null&&(window.clearTimeout(this.vigilTimer),this.vigilTimer=null),this.mode===`busy`?this.vigilTimer=window.setTimeout(()=>{this.vigilTimer=null,this.vigil=!0,this.clearActTimers(),this.act=null},6e5):this.vigil=!1}clearActTimers(){for(let e of[this.idleTimer,this.actEndTimer,this.enterTimer])e!==null&&window.clearTimeout(e);this.idleTimer=null,this.actEndTimer=null,this.enterTimer=null}clearVisitTimers(){for(let e of[this.visitTimer,this.leaveTimer])e!==null&&window.clearTimeout(e);this.visitTimer=null,this.leaveTimer=null}scheduleVisits(){if(this.clearVisitTimers(),this.scheduledVisiting=!1,this.visitRng()<.25)return;let e=x[this.familiarity.tier];this.armArrival(E(this.visitRng,J[0],J[1])*e.firstDelayMul)}armArrival(e){this.visitTimer=window.setTimeout(()=>{this.visitTimer=null,this.rollPerch(),this.scheduledVisiting=!0,this.armDeparture(E(this.visitRng,Y[0],Y[1])*x[this.familiarity.tier].stayMul)},e)}armDeparture(e){this.visitTimer=window.setTimeout(()=>{this.visitTimer=null,this.scheduledVisiting=!1;let e=x[this.familiarity.tier],t=this.familiarity.wary?x.waryGapMul:1;this.armArrival(E(this.visitRng,X[0],X[1])*e.gapMul*t)},e)}schedulePasser(){for(let e of[this.passerTimer,this.passerEndTimer,this.passerWatchTimer])e!==null&&window.clearTimeout(e);this.passerTimer=null,this.passerEndTimer=null,this.passerWatchTimer=null,this.passer=null;let e=Ke(this.seed);!e||G()||(this.passerTimer=window.setTimeout(()=>{this.passerTimer=null,!(!this.visitsEnabled||document.hidden)&&(this.passer=e,this.watchPasser(e),this.passerEndTimer=window.setTimeout(()=>{this.passerEndTimer=null,this.passer=null,this.scheduleNextAct()},q))},e.atMs))}watchPasser(e){let t=e=>{this.presence===`in`&&this.act!==`scuttle`&&!this.vigil&&(this.facing=e)};t(e.direction===1?-1:1),this.passerWatchTimer=window.setTimeout(()=>{this.passerWatchTimer=null,t(e.direction)},q/2)}rollPerch(){this.anchor=this.visitRng()<.6?`ledge`:`bar`,this.setAttribute(`data-spot`,this.anchor);let e=this.currentZone();this.spotPct=Math.round(E(this.visitRng,e[0],e[1])),this.facing=this.visitRng()<.5?1:-1}currentZone(){if(this.anchor===`bar`)return Ze;let e=this.look?.side??`right`;return H[e]}scheduleNextAct(){if(!this.look||this.presence!==`in`||this.logoPerched||this.vigil||this.passer!==null||this.idleTimer!==null||this.actEndTimer!==null||G())return;let e=Ve(this.mode,this.look.personality);if(!e)return;let t=E(this.rng,e.delayMs[0],e.delayMs[1]);this.idleTimer=window.setTimeout(()=>{this.idleTimer=null;let e=Ve(this.mode,this.look?.personality??null);if(!(!e||document.hidden||this.presence!==`in`||this.passer!==null)){if(this.moltPlanned&&!this.molted&&this.mode===`idle`){this.performAct(`molt`);return}this.performAct(T(this.rng,e.acts))}},t)}performAct(e,t=null){this.clearActTimers(),this.outcomePresenceOwner=t,this.entering=!1,e===`scuttle`&&this.startScuttle(),this.act=e,this.actEndTimer=window.setTimeout(()=>{if(this.actEndTimer=null,this.act=null,e===`molt`&&this.completeMolt(),e===`droop`){this.performAct(`sweep`,t);return}this.outcomePresenceOwner=null,this.wantsVisible()&&this.scheduleNextAct()},Ye[e])}completeMolt(){if(this.molted=!0,this.look){let e=[1.7,2,2.5],t=e.indexOf(this.look.scale);this.shellScale=this.look.scale,this.look={...this.look,scale:f(e[Math.min(t+1,e.length-1)],`lobster molt size tier`)}}this.shellSpotPct=this.spotPct,this.shellVisible=!0;let e=this.currentZone();this.spotPct=Math.min(e[1],Math.max(e[0],this.spotPct+(this.facing===1?9:-9))),this.shellTimer!==null&&window.clearTimeout(this.shellTimer),this.shellTimer=window.setTimeout(()=>{this.shellTimer=null,this.shellVisible=!1},6e4)}startScuttle(){if(!this.look)return;let e=this.currentZone(),t=Math.round(E(this.rng,e[0],e[1]));Math.abs(t-this.spotPct)<4&&(t=Math.abs(e[0]-this.spotPct)>Math.abs(e[1]-this.spotPct)?e[0]:e[1]),this.facing=t<this.spotPct?-1:1,this.spotPct=t}render(){let e=this.look;return e?De({look:e,mode:this.mode,presence:this.presence,logoPerched:this.logoPerched,shellVisible:this.shellVisible,visitsEnabled:this.visitsEnabled,dismissed:this.dismissed,passer:this.passer,twinPlanned:this.twinPlanned,anniversary:this.anniversary,entering:this.entering,grumpy:this.grumpy,vigil:this.vigil,act:this.act,zone:this.currentZone(),spotPct:this.spotPct,facing:this.facing,anchor:this.anchor,barMaxScale:Qe,shellScale:this.shellScale,shellSpotPct:this.shellSpotPct,familiarityVisits:this.familiarity.visits,seed:this.seed,movingDay:this.movingDay,sailorDay:this.sailorDay,onPointerDown:this.handleHoldStart,onPointerUp:this.handleHoldEnd,onPointerCancel:this.handleHoldCancel,onContextMenu:this.handleShoo}):l}},n([o({attribute:!1})],$.prototype,`seed`,void 0),n([o({attribute:!1})],$.prototype,`mode`,void 0),n([o({attribute:!1})],$.prototype,`visitsEnabled`,void 0),n([o({attribute:!1})],$.prototype,`runOutcome`,void 0),n([o({attribute:!1})],$.prototype,`soundsEnabled`,void 0),n([o({attribute:!1})],$.prototype,`gatewayVersion`,void 0),n([c()],$.prototype,`act`,void 0),n([c()],$.prototype,`spotPct`,void 0),n([c()],$.prototype,`facing`,void 0),n([c()],$.prototype,`entering`,void 0),n([c()],$.prototype,`presence`,void 0),n([c()],$.prototype,`anchor`,void 0),n([c()],$.prototype,`scheduledVisiting`,void 0),n([c()],$.prototype,`logoPerched`,void 0),n([c()],$.prototype,`logoScared`,void 0),n([c()],$.prototype,`dismissed`,void 0),n([c()],$.prototype,`grumpy`,void 0),n([c()],$.prototype,`vigil`,void 0),n([c()],$.prototype,`outcomePresenceOwner`,void 0),n([c()],$.prototype,`passer`,void 0),n([c()],$.prototype,`movingDay`,void 0),n([c()],$.prototype,`anniversary`,void 0),n([c()],$.prototype,`shellVisible`,void 0),customElements.get(`openclaw-lobster-pet`)||customElements.define(`openclaw-lobster-pet`,$)}));export{D as a,le as c,ie as d,Se as i,ue as l,et as n,U as o,j as r,O as s,tt as t,S as u};
//# sourceMappingURL=lobster-pet-_RYNeWJF.js.map