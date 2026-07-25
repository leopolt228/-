import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{$ as t,J as n,X as r}from"./lit-runtime-CE4wpvNA.js";import{Ci as i,Si as a}from"./control-ui-core-Dx4utKSD.js";import{o,t as s}from"./control-ui-core-CXeSrnoQ.js";import{Q as c,a as l,at as u,c as d,d as f,i as p,l as m,o as h,ot as g,r as _,s as v,u as y}from"./control-ui-core-vPyynwls.js";import{a as b,i as x,l as S,o as C,r as w,s as T,t as E,u as D}from"./control-ui-shared-Ca9fxTB8.js";import{a as O,d as ee,f as k,l as A,n as j,t as M}from"./settings-ui-BJ5HJKwt.js";function te(e){return Object.keys(e??{}).filter(e=>!G.has(e)).length===0}function N(e){if(e===void 0)return``;try{return JSON.stringify(e,null,2)??``}catch{return``}}function P(e){return typeof e==`string`||typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`?String(e):null}function ne(e,t){if(Object.is(e,t))return!0;let n=P(e),r=P(t);return n!==null&&n===r}function re(e){if(!e||typeof e!=`object`||Array.isArray(e))return!1;let t=e;return typeof t.source!=`string`||typeof t.id!=`string`?!1:t.provider===void 0||typeof t.provider==`string`}function F(e){let t=x(e.value,e.path,e.hints),n=t&&(e.revealSensitive||(e.isSensitivePathRevealed?.(e.path)??!1));return{isSensitive:t,isRedacted:t&&!n,isRevealed:n,canReveal:t}}function I(e){let{state:n}=e;if(!n.isSensitive||!e.onToggleSensitivePath)return r;let i=n.canReveal?n.isRevealed?o(`configForm.hideValue`):o(`configForm.revealValue`):o(`configForm.disableStreamToReveal`);return t`
    <openclaw-tooltip .content=${i}>
      <button
        type="button"
        class="settings-secret__toggle"
        aria-label=${i}
        aria-pressed=${n.isRevealed}
        ?disabled=${e.disabled||!n.canReveal}
        @click=${()=>e.onToggleSensitivePath?.(e.path)}
      >
        ${n.isRevealed?u.eye:u.eyeOff}
      </button>
    </openclaw-tooltip>
  `}function L(e,n){return n===r?e:t`<span class="settings-secret">${e}${n}</span>`}function R(e){return e.length===0?r:t`
    <div class="cfg-tags">${e.map(e=>t`<span class="cfg-tag">${e}</span>`)}</div>
  `}function z(e){let n=e.showLabel||!!e.help||e.tags.length>0||!!e.error;return t`
    <div class=${e.stacked||!n?`settings-row settings-row--stacked`:`settings-row`}>
      ${n?t`
            <div class="settings-row__text">
              ${e.showLabel?t`<span class="settings-row__title">${e.label}</span>`:r}
              ${e.help?t`<span class="settings-row__desc">${e.help}</span>`:r}
              ${R(e.tags)}
              ${e.error?t`<span class="cfg-field__error">${e.error}</span>`:r}
            </div>
          `:r}
      ${e.control===r?r:t`<div class="settings-row__control">${e.control}</div>`}
    </div>
  `}function B(e){let t=e.options.findIndex(t=>ne(t,e.resolvedValue));return A({value:t<0?``:String(t),options:e.options.map((e,t)=>({value:String(t),label:a(e)})),disabled:e.disabled,ariaLabel:e.ariaLabel,onChange:t=>{let n=e.options[Number(t)];n!==void 0&&e.onSelect(n)}})}function V(e){let{schema:n,value:i,path:a,hints:s,unsupported:c,disabled:l,onPatch:u}=e,d=e.showLabel??!0,f=D(n),{label:p,help:g,tags:v}=m(a,n,s),y=S(a),b=e.searchCriteria;if(c.has(y))return z({label:p,tags:[],showLabel:!0,control:r,error:o(`configForm.unsupportedNode`)});if(b&&_(b)&&!h({schema:n,value:i,path:a,hints:s,criteria:b}))return r;if(n.anyOf||n.oneOf){let t=(n.anyOf??n.oneOf??[]).filter(e=>!(e.type===`null`||Array.isArray(e.type)&&e.type.includes(`null`)));if(t.length===1){let n=t[0];return n?V({...e,schema:n}):r}let o=t.map(e=>{if(e.const!==void 0)return e.const;if(e.enum&&e.enum.length===1)return e.enum[0]}),c=o.every(e=>e!==void 0);if(c&&o.length>0&&o.length<=5)return z({label:p,help:g,tags:v,showLabel:d,control:B({options:o,resolvedValue:i??n.default,disabled:l,ariaLabel:p,onSelect:e=>u(a,e)})});if(c&&o.length>5)return U({...e,options:o,value:i??n.default});let f=new Set(t.map(e=>D(e)).filter(Boolean)),m=new Set([...f].map(e=>e===`integer`?`number`:e));if([...m].every(e=>[`string`,`number`,`boolean`].includes(e))){let t=m.has(`string`),r=m.has(`number`);if(m.has(`boolean`)&&m.size===1)return V({...e,schema:{...n,type:`boolean`,anyOf:void 0,oneOf:void 0}});if(t||r)return H({...e,inputType:r&&!t?`number`:`text`})}return ae({schema:n,value:i,path:a,hints:s,disabled:l,showLabel:d,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:u})}if(n.enum){let t=n.enum;return t.length<=5?z({label:p,help:g,tags:v,showLabel:d,control:B({options:t,resolvedValue:i??n.default,disabled:l,ariaLabel:p,onSelect:e=>u(a,e)})}):U({...e,options:t,value:i??n.default})}if(f===`object`)return oe(e);if(f===`array`)return se(e);if(f===`boolean`){let e=typeof i==`boolean`?i:typeof n.default==`boolean`?n.default:!1,o=e=>u(a,e);return d?k({title:p,description:g||v.length>0?t`${g??r}${R(v)}`:void 0,checked:e,disabled:l,onChange:o}):z({label:p,help:g,tags:v,showLabel:d,control:ee({checked:e,disabled:l,ariaLabel:p,onChange:o})})}return f===`number`||f===`integer`?ie(e):f===`string`?H({...e,inputType:`text`}):z({label:p,tags:[],showLabel:!0,control:r,error:o(`configForm.unsupportedType`,{type:String(f)})})}function H(e){let{schema:n,value:i,path:s,hints:c,disabled:l,onPatch:u,inputType:d}=e,f=e.showLabel??!0,p=b(s,c),{label:h,help:g,tags:_}=m(s,n,c),v=F({path:s,value:i,hints:c,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed}),y=typeof i==`object`&&!!i&&!Array.isArray(i),x=re(i),S=e.rawAvailable??!0,C=v.isRedacted||x,w=C?x?o(S?`configForm.structuredSecretRaw`:`configForm.structuredSecretFile`):E:p?.placeholder??(n.default===void 0?``:o(`configForm.defaultValue`,{value:a(n.default)})),T=C?``:y?N(i):i??``;return z({label:h,help:g,tags:_,showLabel:f,control:t`
    ${L(t`
    <input
      type=${v.isSensitive&&!C?`text`:d}
      class="settings-input${C?` cfg-redacted`:``}"
      placeholder=${w}
      .value=${a(T)}
      ?disabled=${l}
      ?readonly=${C}
      @click=${()=>{v.isRedacted&&!x&&e.onToggleSensitivePath&&e.onToggleSensitivePath(s)}}
      @input=${e=>{if(C)return;let t=e.target.value;if(d===`number`){if(t.trim()===``){u(s,void 0);return}let e=Number(t);u(s,Number.isNaN(e)?t:e);return}u(s,t)}}
      @change=${e=>{if(d===`number`||C)return;let t=e.target.value;u(s,t.trim())}}
    />
  `,x?r:I({path:s,state:v,disabled:l,onToggleSensitivePath:e.onToggleSensitivePath}))}
    ${n.default===void 0?r:t`
          <openclaw-tooltip .content=${o(`configForm.resetToDefault`)}>
            <button
              type="button"
              class="btn btn--icon"
              style="width:28px;height:28px;padding:0;"
              aria-label=${o(`configForm.resetToDefault`)}
              ?disabled=${l||C}
              @click=${()=>u(s,n.default)}
            >
              ↺
            </button>
          </openclaw-tooltip>
        `}
  `})}function ie(e){let{schema:n,value:r,path:i,hints:o,disabled:s,onPatch:c}=e,l=e.showLabel??!0,{label:u,help:d,tags:f}=m(i,n,o),p=r??n.default??``,h=e=>{if(s)return;let t=Number(p);c(i,(Number.isFinite(t)?t:0)+e)};return z({label:u,help:d,tags:f,showLabel:l,control:t`
    <button
      type="button"
      class="btn btn--sm btn--icon"
      aria-label=${`${u}: -1`}
      ?disabled=${s}
      @click=${()=>h(-1)}
    >
      −
    </button>
    <input
      type="number"
      class="settings-input"
      aria-label=${u}
      .value=${a(p)}
      ?disabled=${s}
      @input=${e=>{let t=e.target.value,n=t===``?void 0:Number(t);c(i,n)}}
    />
    <button
      type="button"
      class="btn btn--sm btn--icon"
      aria-label=${`${u}: +1`}
      ?disabled=${s}
      @click=${()=>h(1)}
    >
      +
    </button>
  `})}function U(e){let{schema:n,value:r,path:i,hints:a,disabled:s,options:c,onPatch:l}=e,u=e.showLabel??!0,{label:d,help:f,tags:p}=m(i,n,a),h=r??n.default,g=c.findIndex(e=>e===h||String(e)===String(h)),_=`__unset__`;return z({label:d,help:f,tags:p,showLabel:u,control:t`
    <select
      class="settings-select"
      ?disabled=${s}
      .value=${g>=0?String(g):_}
      @change=${e=>{let t=e.target.value;l(i,t===_?void 0:c[Number(t)])}}
    >
      <option value=${_} ?selected=${g<0}>${o(`configForm.select`)}</option>
      ${c.map((e,n)=>t` <option value=${String(n)} ?selected=${n===g}>
            ${String(e)}
          </option>`)}
    </select>
  `})}function W(e){let{path:n,fallback:r,sensitiveState:i,disabled:a,onPatch:s}=e;return L(t`
    <textarea
      class="settings-input${i.isRedacted?` cfg-redacted`:``}"
      placeholder=${i.isRedacted?E:o(`configForm.jsonValue`)}
      rows=${e.rows}
      .value=${i.isRedacted?``:r}
      ?disabled=${a}
      ?readonly=${i.isRedacted}
      @click=${()=>{i.isRedacted&&e.onToggleSensitivePath&&e.onToggleSensitivePath(n)}}
      @change=${e=>{if(i.isRedacted)return;let t=e.target,a=t.value.trim();if(!a){s(n,void 0);return}try{s(n,JSON.parse(a))}catch{t.value=r}}}
    ></textarea>
  `,I({path:n,state:i,disabled:a,onToggleSensitivePath:e.onToggleSensitivePath}))}function ae(e){let{schema:t,value:n,path:r,hints:i,disabled:a,onPatch:o}=e,s=e.showLabel??!0,{label:c,help:l,tags:u}=m(r,t,i);return z({label:c,help:l,tags:u,showLabel:s,stacked:!0,control:W({path:r,fallback:N(n),rows:3,sensitiveState:F({path:r,value:n,hints:i,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed}),disabled:a,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:o})})}function oe(e){let{schema:n,value:i,path:a,hints:o,unsupported:s,disabled:c,onPatch:l,searchCriteria:d,rawAvailable:f,revealSensitive:p,isSensitivePathRevealed:h,onToggleSensitivePath:g}=e,y=e.showLabel??!0,{label:x,help:S,tags:C}=m(a,n,o),w=d&&_(d)&&v({schema:n,path:a,hints:o,criteria:d})?void 0:d,T=i??n.default,E=T&&typeof T==`object`&&!Array.isArray(T)?T:{},D=n.properties??{},O=Object.entries(D).toSorted((e,t)=>{let n=b([...a,e[0]],o)?.order??0,r=b([...a,t[0]],o)?.order??0;return n===r?e[0].localeCompare(t[0]):n-r}),ee=new Set(Object.keys(D)),k=n.additionalProperties,A=!!k&&typeof k==`object`,j=t`
    ${O.map(([e,t])=>V({schema:t,value:E[e],path:[...a,e],hints:o,rawAvailable:f,unsupported:s,disabled:c,searchCriteria:w,revealSensitive:p,isSensitivePathRevealed:h,onToggleSensitivePath:g,onPatch:l}))}
    ${A?ce({schema:k,value:E,path:a,hints:o,rawAvailable:f,unsupported:s,disabled:c,reservedKeys:ee,searchCriteria:w,revealSensitive:p,isSensitivePathRevealed:h,onToggleSensitivePath:g,onPatch:l}):r}
  `;return a.length===1||!y?t`${j}`:t`
    <details class="cfg-object cfg-block" ?open=${a.length<=2}>
      <summary class="settings-row cfg-object__summary">
        <div class="settings-row__text">
          <span class="settings-row__title">${x}</span>
          ${S?t`<span class="settings-row__desc">${S}</span>`:r}
          ${R(C)}
        </div>
        <span class="settings-row__chevron cfg-object__chevron">${u.chevronDown}</span>
      </summary>
      <div class="settings-subrows">${j}</div>
    </details>
  `}function se(e){let{schema:n,value:i,path:a,hints:s,unsupported:c,disabled:l,onPatch:d,searchCriteria:f,rawAvailable:p,revealSensitive:h,isSensitivePathRevealed:g,onToggleSensitivePath:y}=e,b=e.showLabel??!0,{label:x,help:S,tags:C}=m(a,n,s),T=f&&_(f)&&v({schema:n,path:a,hints:s,criteria:f})?void 0:f,E=Array.isArray(n.items)?n.items[0]:n.items;if(!E)return z({label:x,tags:[],showLabel:!0,control:r,error:o(`configForm.unsupportedArray`)});let D=Array.isArray(i)?i:Array.isArray(n.default)?n.default:[];return t`
    <div class="cfg-block cfg-array">
      <div class="settings-row">
        <div class="settings-row__text">
          ${b?t`<span class="settings-row__title">${x}</span>`:r}
          ${S?t`<span class="settings-row__desc">${S}</span>`:r}
          ${R(C)}
        </div>
        <div class="settings-row__control">
          <span class="settings-row__value"
            >${o(D.length===1?`configForm.itemCountOne`:`configForm.itemCount`,{count:String(D.length)})}</span
          >
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${l}
            @click=${()=>{let e=[...D,w(E)];d(a,e)}}
          >
            ${o(`configForm.add`)}
          </button>
        </div>
      </div>
      ${D.length===0?j(o(`configForm.noItems`)):t`
            <div class="settings-subrows">
              ${D.map((e,n)=>t`
                  <div class="settings-row">
                    <div class="settings-row__text">
                      <span class="settings-row__title">#${n+1}</span>
                    </div>
                    <div class="settings-row__control">
                      <openclaw-tooltip .content=${o(`configForm.removeItem`)}>
                        <button
                          type="button"
                          class="btn btn--icon"
                          style="width:28px;height:28px;padding:0;"
                          aria-label=${o(`configForm.removeItem`)}
                          ?disabled=${l}
                          @click=${()=>{let e=[...D];e.splice(n,1),d(a,e)}}
                        >
                          ${u.trash}
                        </button>
                      </openclaw-tooltip>
                    </div>
                  </div>
                  ${V({schema:E,value:e,path:[...a,n],hints:s,rawAvailable:p,unsupported:c,disabled:l,searchCriteria:T,showLabel:!1,revealSensitive:h,isSensitivePathRevealed:g,onToggleSensitivePath:y,onPatch:d})}
                `)}
            </div>
          `}
    </div>
  `}function ce(e){let{schema:n,value:r,path:i,hints:a,rawAvailable:s,unsupported:c,disabled:l,reservedKeys:d,onPatch:f,searchCriteria:p,revealSensitive:m,isSensitivePathRevealed:g,onToggleSensitivePath:v}=e,y=te(n),b=Object.entries(r??{}).filter(([e])=>!d.has(e)),x=p&&_(p)?b.filter(([e,t])=>h({schema:n,value:t,path:[...i,e],hints:a,criteria:p})):b;return t`
    <div class="cfg-block cfg-map">
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${o(`configForm.customEntries`)}</span>
        </div>
        <div class="settings-row__control">
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${l}
            @click=${()=>{let e={...r},t=1,a=`custom-${t}`;for(;a in e;)t+=1,a=`custom-${t}`;e[a]=y?{}:w(n),f(i,e)}}
          >
            ${o(`configForm.addEntry`)}
          </button>
        </div>
      </div>

      ${x.length===0?j(o(`configForm.noCustomEntries`)):t`
            <div class="settings-subrows">
              ${x.map(([e,d])=>{let h=[...i,e],_=N(d),b=F({path:h,value:d,hints:a,revealSensitive:m??!1,isSensitivePathRevealed:g});return t`
                  <div class="settings-row">
                    <div class="settings-row__text">
                      <input
                        type="text"
                        class="settings-input"
                        placeholder=${o(`configForm.key`)}
                        aria-label=${o(`configForm.key`)}
                        .value=${e}
                        ?disabled=${l}
                        @change=${t=>{let n=t.target.value.trim();if(!n||n===e)return;let a={...r};n in a||(a[n]=a[e],delete a[e],f(i,a))}}
                      />
                    </div>
                    <div class="settings-row__control">
                      <openclaw-tooltip .content=${o(`configForm.removeEntry`)}>
                        <button
                          type="button"
                          class="btn btn--icon"
                          style="width:28px;height:28px;padding:0;"
                          aria-label=${o(`configForm.removeEntry`)}
                          ?disabled=${l}
                          @click=${()=>{let t={...r};delete t[e],f(i,t)}}
                        >
                          ${u.trash}
                        </button>
                      </openclaw-tooltip>
                    </div>
                  </div>
                  ${y?z({label:e,tags:[],showLabel:!1,stacked:!0,control:W({path:h,fallback:_,rows:2,sensitiveState:b,disabled:l,onToggleSensitivePath:v,onPatch:f})}):V({schema:n,value:d,path:h,hints:a,rawAvailable:s,unsupported:c,disabled:l,searchCriteria:p,showLabel:!1,revealSensitive:m,isSensitivePathRevealed:g,onToggleSensitivePath:v,onPatch:f})}
                `})}
            </div>
          `}
    </div>
  `}var G,K=e((()=>{n(),g(),c(),s(),i(),p(),T(),M(),G=new Set([`title`,`description`,`default`,`nullable`,`tags`,`x-tags`])}));function le(e){let t=y[e.key];return l({key:e.key,schema:e.schema,value:e.sectionValue,hints:e.uiHints,query:e.query,label:t?.label,description:t?.description})}function ue(e){if(!e.schema)return t` <div class="muted">${o(`configForm.schemaUnavailable`)}</div> `;let n=e.schema,i=e.value??{};if(D(n)!==`object`||!n.properties)return t` <div class="callout danger">${o(`configForm.unsupportedSchema`)}</div> `;let a=new Set(e.unsupportedPaths??[]),s=n.properties,c=e.searchQuery??``,l=d(c),u=e.activeSection,f=e.activeSubsection??null,p=Object.entries(s).toSorted((t,n)=>{let r=b([t[0]],e.uiHints)?.order??50,i=b([n[0]],e.uiHints)?.order??50;return r===i?t[0].localeCompare(n[0]):r-i}).filter(([t,n])=>!(u&&t!==u||c&&!le({key:t,schema:n,sectionValue:i[t],uiHints:e.uiHints,query:c}))),m=null;if(u&&f&&p.length===1){let e=p[0]?.[1];e&&D(e)===`object`&&e.properties&&e.properties[f]&&(m={sectionKey:u,subsectionKey:f,schema:e.properties[f]})}if(p.length===0)return e.embedded&&!c?r:O(j(c?o(`configForm.noSettingsMatch`,{query:c}):o(`configForm.noSettingsInSection`)));let h=n=>t`
    <section class="settings-section" id=${n.id}>
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${n.label}</h2>
        ${e.sectionActions?t`<div class="settings-section__actions">${e.sectionActions}</div>`:r}
      </div>
      ${n.description?t`<p class="settings-section__desc">${n.description}</p>`:r}
      <div class="settings-group">
        ${V({schema:n.node,value:n.nodeValue,path:n.path,hints:e.uiHints,rawAvailable:e.rawAvailable??!0,unsupported:a,disabled:e.disabled??!1,showLabel:!1,searchCriteria:l,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:e.onPatch})}
      </div>
    </section>
  `;return O(m?(()=>{let{sectionKey:t,subsectionKey:n,schema:r}=m,a=b([t,n],e.uiHints),o=a?.label??r.title??C(n),s=a?.help??r.description??``,c=i[t],l=c&&typeof c==`object`?c[n]:void 0;return h({id:`config-section-${t}-${n}`,label:o,description:s,node:r,nodeValue:l,path:[t,n]})})():p.map(([e,t])=>{let n=y[e]??{label:e.charAt(0).toUpperCase()+e.slice(1),description:t.description??``};return h({id:`config-section-${e}`,label:n.label,description:n.description,node:t,nodeValue:i[e],path:[e]})}))}var q=e((()=>{n(),s(),f(),K(),p(),T(),M()}));function de(e){return Object.keys(e??{}).filter(e=>!Z.has(e)).length===0}function J(e){let t=e.filter(e=>e!=null),n=t.length!==e.length;return{enumValues:Y(t),nullable:n}}function Y(e){let t=[];for(let n of e)t.some(e=>Object.is(e,n))||t.push(n);return t}function fe(e){return!e||typeof e!=`object`?{schema:null,unsupportedPaths:[`<root>`]}:X(e,[])}function X(e,t){let n=new Set,r={...e},i=S(t)||`<root>`;if(e.anyOf||e.oneOf||e.allOf)return ge(e,t)||{schema:e,unsupportedPaths:[i]};let a=Array.isArray(e.type)&&e.type.includes(`null`),o=D(e)??(e.properties||e.additionalProperties?`object`:void 0);if(r.type=o??e.type,r.nullable=a||e.nullable,r.enum){let{enumValues:e,nullable:t}=J(r.enum);r.enum=e,t&&(r.nullable=!0),e.length===0&&n.add(i)}if(o===`object`){let a=e.properties??{},o={};for(let[e,r]of Object.entries(a)){let i=X(r,[...t,e]);i.schema&&(o[e]=i.schema);for(let e of i.unsupportedPaths)n.add(e)}if(r.properties=o,e.additionalProperties===!0)r.additionalProperties={};else if(e.additionalProperties===!1)r.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties==`object`&&!de(e.additionalProperties)){let a=X(e.additionalProperties,[...t,`*`]);r.additionalProperties=a.schema??e.additionalProperties,a.unsupportedPaths.length>0&&n.add(i)}}else if(o===`array`){let a=Array.isArray(e.items)?e.items[0]:e.items;if(!a)n.add(i);else{let e=X(a,[...t,`*`]);r.items=e.schema??a,e.unsupportedPaths.length>0&&n.add(i)}}else o!==`string`&&o!==`number`&&o!==`integer`&&o!==`boolean`&&!r.enum&&n.add(i);return{schema:r,unsupportedPaths:Array.from(n)}}function pe(e){if(D(e)!==`object`)return!1;let t=e.properties?.source,n=e.properties?.provider,r=e.properties?.id;return!t||!n||!r?!1:typeof t.const==`string`&&D(n)===`string`&&D(r)===`string`}function me(e){let t=e.oneOf??e.anyOf;return!t||t.length===0?!1:t.every(e=>pe(e))}function he(e,t,n,r){let i=n.findIndex(e=>D(e)===`string`);if(i<0)return null;let a=n.filter((e,t)=>t!==i),o=a[0],s=n[i];return a.length!==1||!o||!s||!me(o)?null:X({...e,...s,nullable:r||s.nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t)}function ge(e,t){if(e.allOf)return null;let n=e.anyOf??e.oneOf;if(!n)return null;let r=[],i=[],a=!1;for(let e of n){if(!e||typeof e!=`object`)return null;if(Array.isArray(e.enum)){let{enumValues:t,nullable:n}=J(e.enum);r.push(...t),n&&(a=!0);continue}if(`const`in e){if(e.const==null){a=!0;continue}r.push(e.const);continue}if(D(e)===`null`){a=!0;continue}i.push(e)}let o=he(e,t,i,a);if(o)return o;if(r.length>0&&i.length===0)return{schema:{...e,enum:Y(r),nullable:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]};if(i.length===1){let n=i[0];return n?X({...e,...n,nullable:a||n.nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t):null}return i.length>0&&r.length===0&&i.every(e=>{let t=D(e);return!!t&&Q.has(String(t))})?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}var Z,Q,$=e((()=>{T(),Z=new Set([`title`,`description`,`default`,`nullable`,`tags`,`x-tags`]),Q=new Set([`string`,`number`,`integer`,`boolean`,`object`,`array`])})),_e=e((()=>{q(),$(),K(),T()}));export{ue as a,q as i,fe as n,K as o,$ as r,V as s,_e as t};
//# sourceMappingURL=config-form-n-iRU_E_.js.map