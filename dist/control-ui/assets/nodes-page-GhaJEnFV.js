import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{b as t,i as n,l as r,r as i,u as a,x as o}from"./control-ui-foundation-43q8Lf_T.js";import{dt as s,ft as c}from"./control-ui-foundation-DQl2NL7K.js";import{$ as l,G as u,J as d,U as f,X as p,z as m}from"./lit-runtime-CE4wpvNA.js";import{Ot as h,ft as g,it as ee,jt as te,kt as _,ot as ne}from"./control-ui-foundation-DFIFKu9N.js";import{Ao as re,Bo as v,Ci as y,Co as b,Do as ie,Eo as ae,Io as oe,Mi as se,Mo as ce,Mr as le,No as ue,Nr as de,Oo as fe,Pi as pe,So as x,_o as me,ct as he,di as ge,fi as _e,fn as ve,ho as ye,jo as be,ko as xe,mo as Se,ot as Ce,pi as S,pn as we,vi as C,vo as w,xo as T,yo as E}from"./control-ui-core-Dx4utKSD.js";import{B as Te,U as Ee,Ut as De,at as Oe,it as ke,jt as Ae}from"./control-ui-core-6OhF3OIO.js";import{o as D,t as O}from"./control-ui-core-CXeSrnoQ.js";import{D as je,at as k,ot as A}from"./control-ui-core-vPyynwls.js";import{n as Me,t as Ne}from"./settings-workspace-BhCB-OeS.js";import{a as Pe,c as j,d as Fe,l as Ie,n as Le,o as M,p as N,t as P,u as F}from"./settings-ui-BJ5HJKwt.js";var Re=e((()=>{}));function ze(e){let t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],r=[];return n.forEach((e,t)=>{if(!e||typeof e!=`object`)return;let n=e,i=g(n.id)??``;if(!i)return;let a=g(n.name),o=n.default===!0;r.push({id:i,name:a,isDefault:o,index:t,record:n})}),r}function Be(e,t){let n=new Set(t),r=[];for(let t of e){if(!(Array.isArray(t.commands)?t.commands:[]).some(e=>n.has(String(e))))continue;let e=g(t.nodeId)??``;if(!e)continue;let i=g(t.displayName)??e;r.push({id:e,label:i===e?e:`${i} · ${e}`})}return r.sort((e,t)=>e.label.localeCompare(t.label)),r}function Ve(e){let t=e.platform?.trim().toLowerCase()??``,n=e.clientId?.trim().toLowerCase()??``,r=e.clientMode?.trim().toLowerCase()??``;return We.test(t)||n===h.WATCHOS_APP?Ue:Ge.test(t)?He:Ke.test(t)||L.has(n)?k.smartphone:R.has(n)||r===_.WEBCHAT?k.globe:z.has(r)||B.has(n)?k.terminal:k.monitor}function I(e){return l`
    <div class="nodes-entry__tile" aria-hidden="true">
      <span class="nodes-entry__tile-icon">${e}</span>
    </div>
  `}var He,Ue,We,Ge,Ke,L,R,z,B,V=e((()=>{d(),te(),A(),v(),He=l`
  <svg viewBox="0 0 24 24">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
`,Ue=l`
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="6" />
    <polyline points="12 10 12 12 13 13" />
    <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
    <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
  </svg>
`,We=/\bwatchos\b/,Ge=/\b(ipados|ipad)\b/,Ke=/\b(ios|android|iphone)\b/,L=new Set([h.IOS_APP,h.ANDROID_APP]),R=new Set([h.CONTROL_UI,h.WEBCHAT_UI,h.WEBCHAT]),z=new Set([_.CLI,_.BACKEND,_.PROBE,_.TEST]),B=new Set([h.CLI,h.TUI])}));function H(e){return e===`allowlist`||e===`full`||e===`deny`?e:`deny`}function qe(e){return e===`always`||e===`off`||e===`on-miss`?e:`on-miss`}function Je(e){let t=e?.defaults??{};return{security:H(t.security),ask:qe(t.ask),askFallback:H(t.askFallback??`deny`),autoAllowSkills:t.autoAllowSkills??!1}}function Ye(e){return ze(e).map(e=>({id:e.id,name:e.name,isDefault:e.isDefault}))}function Xe(e,t){let n=Ye(e),r=Object.keys(t?.agents??{}),i=new Map;n.forEach(e=>i.set(e.id,e)),r.forEach(e=>{i.has(e)||i.set(e,{id:e})});let a=Array.from(i.values());return a.length===0&&a.push({id:`main`,isDefault:!0}),a.sort((e,t)=>{if(e.isDefault&&!t.isDefault)return-1;if(!e.isDefault&&t.isDefault)return 1;let n=e.name?.trim()?e.name:e.id,r=t.name?.trim()?t.name:t.id;return n.localeCompare(r)}),a}function Ze(e,t){return e===W?W:e&&t.some(t=>t.id===e)?e:W}function Qe(e){let t=e.execApprovalsSnapshot,n=E(t)?t:null,r=t&&!E(t)?t:null,i=n?null:e.execApprovalsForm??r?.file??null,a=!!(i||n),o=Je(i),s=Xe(e.configForm,i),c=ot(e.nodes),l=e.execApprovalsTarget,u=l===`node`&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;l===`node`&&u&&!c.some(e=>e.id===u)&&(u=null);let d=Ze(e.execApprovalsSelectedAgent,s),f=d===W?null:(i?.agents??{})[d]??null,p=Array.isArray(f?.allowlist)?f.allowlist??[]:[];return{ready:a,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:i,nativePolicy:n,defaults:o,selectedScope:d,selectedAgent:f,agents:s,allowlist:p,target:l,targetNodeId:u,targetNodes:c,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function $e(e){let t=e.ready,n=e.target!==`node`||!!e.targetNodeId,r=l`
    <button
      class="btn"
      ?disabled=${e.disabled||!e.dirty||!n||!!e.nativePolicy}
      @click=${e.onSave}
    >
      ${e.saving?D(`common.saving`):D(`common.save`)}
    </button>
  `,i=l`
    ${tt(e)}
    ${t?e.nativePolicy?et(e.nativePolicy):l`${nt(e)} ${rt(e)}`:M({title:D(`nodes.execApprovals.loadHint`),control:l`
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?D(`common.loading`):D(`common.loadApprovals`)}
            </button>
          `})}
  `;return l`
    ${j({title:D(`nodes.execApprovals.title`),description:l`
          ${D(`nodes.execApprovals.subtitlePrefix`)}
          <span class="mono">exec host=gateway/node</span>.
        `,actions:r},i)}
    ${t&&!e.nativePolicy&&e.selectedScope!==W?it(e):p}
  `}function et(e){let t=e.enabled&&Array.isArray(e.rules)?e.rules:[],n=e.enabled?e.defaultAction:e.message??`unavailable`;return l`
    ${M({title:D(`nodes.execApprovals.hostNativePolicy`),description:D(`nodes.execApprovals.hostNativeHint`),control:N(D(`nodes.execApprovals.native`))})}
    ${M({title:D(`nodes.execApprovals.defaultAction`),description:n,control:N(D(t.length===1?`nodes.execApprovals.rule`:`nodes.execApprovals.rules`,{count:String(t.length)}))})}
    ${t.map(e=>M({title:e.pattern,description:l`
          ${e.action} · ${e.shells?.join(`, `)||D(`nodes.execApprovals.allShells`)} ·
          ${e.enabled===!1?D(`nodes.execApprovals.off`):D(`nodes.execApprovals.on`)}
          ${e.description?l`<br />${S(e.description,120)}`:p}
        `}))}
  `}function tt(e){let t=e.targetNodes.length>0,n=e.targetNodeId??``;return l`
    ${M({title:D(`nodes.execApprovals.target`),description:D(`nodes.execApprovals.targetHint`),control:l`
        <select
          class="settings-select"
          aria-label=${D(`nodes.execApprovals.host`)}
          ?disabled=${e.disabled}
          @change=${t=>{if(t.target.value===`node`){let t=e.targetNodes[0]?.id??null;e.onSelectTarget(`node`,n||t)}else e.onSelectTarget(`gateway`,null)}}
        >
          <option value="gateway" ?selected=${e.target===`gateway`}>
            ${D(`nodes.execApprovals.gateway`)}
          </option>
          <option value="node" ?selected=${e.target===`node`}>
            ${D(`nodes.execApprovals.node`)}
          </option>
        </select>
      `})}
    ${e.target===`node`?M({title:D(`nodes.execApprovals.node`),description:t?void 0:D(`nodes.execApprovals.noNodes`),control:l`
            <select
              class="settings-select"
              aria-label=${D(`nodes.execApprovals.node`)}
              ?disabled=${e.disabled||!t}
              @change=${t=>{let n=t.target.value.trim();e.onSelectTarget(`node`,n||null)}}
            >
              <option value="" ?selected=${n===``}>
                ${D(`nodes.execApprovals.selectNode`)}
              </option>
              ${e.targetNodes.map(e=>l`<option value=${e.id} ?selected=${n===e.id}>
                    ${e.label}
                  </option>`)}
            </select>
          `}):p}
  `}function nt(e){let t=[{value:W,label:D(`nodes.execApprovals.defaults`)},...e.agents.map(e=>({value:e.id,label:e.name?.trim()?`${e.name} (${e.id})`:e.id}))];return M({title:D(`nodes.execApprovals.scope`),stacked:!0,control:Ie({value:e.selectedScope,options:t,onChange:t=>e.onSelectScope(t)})})}function U(e,t){return l`
    <select
      class="settings-select"
      aria-label=${t.ariaLabel}
      ?disabled=${e.disabled}
      @change=${n=>{let r=n.target.value;!t.isDefaults&&r===`__default__`?e.onRemove([...t.basePath,t.key]):e.onPatch([...t.basePath,t.key],r)}}
    >
      ${t.isDefaults?p:l`<option value="__default__" ?selected=${t.currentValue===`__default__`}>
            ${D(`nodes.execApprovals.useDefaultValue`,{value:t.defaultValue})}
          </option>`}
      ${t.values.map(e=>l`<option value=${e.value} ?selected=${t.currentValue===e.value}>
            ${D(e.labelKey)}
          </option>`)}
    </select>
  `}function rt(e){let t=e.selectedScope===W,n=e.defaults,r=e.selectedAgent??{},i=t?[`defaults`]:[`agents`,e.selectedScope],a=typeof r.security==`string`?r.security:void 0,o=typeof r.ask==`string`?r.ask:void 0,s=typeof r.askFallback==`string`?r.askFallback:void 0,c=t?n.security:a??`__default__`,u=t?n.ask:o??`__default__`,d=t?n.askFallback:s??`__default__`,f=typeof r.autoAllowSkills==`boolean`?r.autoAllowSkills:void 0,m=f??n.autoAllowSkills,h=f==null;return l`
    ${M({title:D(`nodes.execApprovals.security`),description:t?D(`nodes.execApprovals.defaultSecurity`):D(`nodes.execApprovals.defaultValue`,{value:n.security}),control:U(e,{key:`security`,ariaLabel:D(`nodes.execApprovals.mode`),values:G,currentValue:c,defaultValue:n.security,isDefaults:t,basePath:i})})}
    ${M({title:D(`nodes.execApprovals.ask`),description:t?D(`nodes.execApprovals.defaultPrompt`):D(`nodes.execApprovals.defaultValue`,{value:n.ask}),control:U(e,{key:`ask`,ariaLabel:D(`nodes.execApprovals.mode`),values:K,currentValue:u,defaultValue:n.ask,isDefaults:t,basePath:i})})}
    ${M({title:D(`nodes.execApprovals.askFallback`),description:t?D(`nodes.execApprovals.promptUnavailable`):D(`nodes.execApprovals.defaultValue`,{value:n.askFallback}),control:U(e,{key:`askFallback`,ariaLabel:D(`nodes.execApprovals.fallback`),values:G,currentValue:d,defaultValue:n.askFallback,isDefaults:t,basePath:i})})}
    ${M({title:D(`nodes.execApprovals.autoAllowSkills`),description:t?D(`nodes.execApprovals.autoAllowSkillsHint`):h?D(`nodes.execApprovals.usingDefault`,{value:n.autoAllowSkills?D(`nodes.execApprovals.on`):D(`nodes.execApprovals.off`)}):D(`nodes.execApprovals.override`,{value:D(m?`nodes.execApprovals.on`:`nodes.execApprovals.off`)}),control:l`
        ${!t&&!h?l`<button
              class="btn btn--sm"
              ?disabled=${e.disabled}
              @click=${()=>e.onRemove([...i,`autoAllowSkills`])}
            >
              ${D(`nodes.execApprovals.useDefault`)}
            </button>`:p}
        ${Fe({checked:m,disabled:e.disabled,ariaLabel:D(`nodes.execApprovals.autoAllowSkills`),onChange:t=>e.onPatch([...i,`autoAllowSkills`],t)})}
      `})}
  `}function it(e){let t=[`agents`,e.selectedScope,`allowlist`],n=e.allowlist;return j({title:D(`nodes.execApprovals.allowlist`),description:D(`nodes.execApprovals.allowlistHint`),actions:l`
        <button
          class="btn btn--sm"
          ?disabled=${e.disabled}
          @click=${()=>{let r=[...n,{pattern:``}];e.onPatch(t,r)}}
        >
          ${D(`nodes.execApprovals.addPattern`)}
        </button>
      `},n.length===0?Le(D(`nodes.execApprovals.emptyAllowlist`)):n.map((t,n)=>at(e,t,n)))}function at(e,t,n){let r=t.lastUsedAt?i(t.lastUsedAt):D(`common.never`),a=t.lastUsedCommand?S(t.lastUsedCommand,120):null,o=t.lastResolvedPath?S(t.lastResolvedPath,120):null;return M({title:t.pattern?.trim()?t.pattern:D(`nodes.execApprovals.newPattern`),description:l`
      ${D(`nodes.execApprovals.lastUsed`,{time:r})}
      ${a?l`<br /><span class="mono">${a}</span>`:p}
      ${o?l`<br /><span class="mono">${o}</span>`:p}
    `,control:l`
      <input
        class="settings-input"
        type="text"
        aria-label=${D(`nodes.execApprovals.pattern`)}
        .value=${t.pattern??``}
        ?disabled=${e.disabled}
        @input=${t=>{let r=t.target;e.onPatch([`agents`,e.selectedScope,`allowlist`,n,`pattern`],r.value)}}
      />
      <button
        class="btn btn--sm danger"
        ?disabled=${e.disabled}
        @click=${()=>{if(e.allowlist.length<=1){e.onRemove([`agents`,e.selectedScope,`allowlist`]);return}e.onRemove([`agents`,e.selectedScope,`allowlist`,n])}}
      >
        ${D(`nodes.execApprovals.remove`)}
      </button>
    `})}function ot(e){return Be(e,[`system.execApprovals.get`,`system.execApprovals.set`])}var W,G,K,st=e((()=>{d(),P(),O(),y(),w(),V(),W=`__defaults__`,G=[{value:`deny`,labelKey:`nodes.execApprovals.options.deny`},{value:`allowlist`,labelKey:`nodes.execApprovals.options.allowlist`},{value:`full`,labelKey:`nodes.execApprovals.options.full`}],K=[{value:`off`,labelKey:`nodes.execApprovals.options.off`},{value:`on-miss`,labelKey:`nodes.execApprovals.options.onMiss`},{value:`always`,labelKey:`nodes.execApprovals.options.always`}]}));function q(e){return typeof e==`number`&&Number.isFinite(e)?e:void 0}function J(e){return Array.isArray(e)?e.map(e=>g(e)).filter(e=>e!==void 0):[]}function ct(e){let t=g(e.nodeId);if(!t)return null;let n=g(e.approvalState);return{nodeId:t,displayName:g(e.displayName),platform:g(e.platform),version:g(e.version),coreVersion:g(e.coreVersion),uiVersion:g(e.uiVersion),modelIdentifier:g(e.modelIdentifier),clientId:g(e.clientId),clientMode:g(e.clientMode),remoteIp:g(e.remoteIp),caps:J(e.caps),commands:J(e.commands),approvalState:n&&xt.has(n)?n:void 0,pendingRequestId:g(e.pendingRequestId),connected:e.connected===!0,paired:e.paired===!0,connectedAtMs:q(e.connectedAtMs),lastSeenAtMs:q(e.lastSeenAtMs),approvedAtMs:q(e.approvedAtMs)}}function lt(e){let t=new Set;for(let n of[...e.roles??[],e.role]){let e=g(n);e&&t.add(e)}return[...t]}function ut(...e){let t;for(let n of e)n!==void 0&&(t===void 0||n>t)&&(t=n);return t}function dt(e,t,n,r){let i=t?lt(t):[];n?.paired&&!i.includes(`node`)&&i.push(`node`);let a=g(t?.operatorLabel),o=g(t?.displayName)??g(n?.displayName),s=g(t?.clientId)??n?.clientId;return{id:e,name:a??o??s??e,displayName:o,clientId:s,clientMode:g(t?.clientMode)??n?.clientMode,platform:g(r?.platform)??g(t?.platform)??n?.platform,version:g(r?.version)??n?.version,modelIdentifier:g(r?.modelIdentifier)??n?.modelIdentifier,remoteIp:g(t?.remoteIp)??n?.remoteIp,roles:i,scopes:J(t?.scopes),connected:n?.connected===!0||t?.connected===!0,autoApproved:t?.approvedVia===`silent`||t?.approvedVia===`trusted-cidr`||t?.approvedVia===`ssh-verified`,lastSeenAtMs:ut(t?.lastSeenAtMs,n?.lastSeenAtMs,n?.connectedAtMs,q(r?.ts)),approvedAtMs:ut(t?.approvedAtMs,n?.approvedAtMs),presence:r,device:t,node:n}}function ft(e){let t=e.displayName?.trim().toLowerCase();if(t)return`name:${t}`;let n=e.clientId?.trim().toLowerCase(),r=e.clientMode?.trim().toLowerCase();return n||r?`client:${n??``}:${r??``}`:`id:${e.id}`}function pt(e){return e.lastSeenAtMs??e.approvedAtMs??0}function mt(e,t){if(e.connected!==t.connected)return e.connected?-1:1;let n=pt(t)-pt(e);return n===0?e.id.localeCompare(t.id):n}function ht(e,t){let n=mt(e.primary,t.primary);return n===0?e.name.localeCompare(t.name):n}function gt(e){let t=new Map;for(let n of e.nodes){let e=ct(n);e&&t.set(e.nodeId,e)}let n=new Map;for(let t of e.presence??[])for(let e of[t.deviceId,t.instanceId]){let r=g(e)?.toLowerCase();r&&n.set(r,t)}let r=[],i=new Set;for(let a of e.paired){let e=g(a.deviceId);!e||i.has(e)||(i.add(e),r.push(dt(e,a,t.get(e),n.get(e.toLowerCase()))))}for(let[e,a]of t)i.has(e)||r.push(dt(e,void 0,a,n.get(e.toLowerCase())));let a=new Map;for(let e of r){let t=ft(e),n=a.get(t);n?n.push(e):a.set(t,[e])}let o=[];for(let[e,t]of a){let n=t.toSorted(mt),r=n[0];r&&o.push({key:e,name:r.name,primary:r,duplicates:n.slice(1)})}return o.toSorted(ht)}function _t(e){return e.flatMap(e=>e.duplicates.filter(e=>!e.connected&&(e.autoApproved||e.device!==void 0&&e.device.approvedVia===void 0)))}function vt(e){return e.find(e=>g(e.mode)?.toLowerCase()===`gateway`)}function yt(e,t){let n=new Set;for(let e of t)for(let t of[e.primary,...e.duplicates])n.add(t.id.toLowerCase());return e.filter(e=>{if(g(e.mode)?.toLowerCase()===`gateway`||g(e.reason)?.toLowerCase()===`disconnect`)return!1;let t=[e.deviceId,e.instanceId].map(e=>g(e)?.toLowerCase()).filter(e=>e!==void 0);return t.length===0&&!g(e.host)&&!g(e.mode)?!1:!t.some(e=>n.has(e))})}function bt(e){let t=e.roles.includes(`node`),n=e.roles.filter(e=>e!==`node`);return{removeNode:t||e.node?.paired===!0,removeDevice:!!e.device&&(n.length>0||e.roles.length===0)}}var xt,St=e((()=>{v(),xt=new Set([`approved`,`pending-approval`,`pending-reapproval`,`unapproved`])}));function Y(...e){let t=new Set;for(let n of e)for(let e of ne(n))t.add(e);return[...t].toSorted()}function Ct(e,t){let n=new Set(e);return t.every(e=>n.has(e))}function wt(e){return{roles:Y(e.roles,e.role),scopes:o(e.scopes)}}function Tt(e){let t=Y(e.roles,e.role),n=Array.isArray(e.tokens)?e.tokens:e.tokens?Object.values(e.tokens):void 0;return{roles:n===void 0?t:Y(n.filter(e=>!e.revokedAtMs).flatMap(e=>e.role??[])).filter(e=>t.includes(e)),scopes:o(e.scopes)}}function Et(e,t){let n=wt(e),r=t?Tt(t):null;return r?Ct(r.roles,n.roles)?Ct(r.scopes,n.scopes)?{kind:`re-approval`,requested:n,approved:r}:{kind:`scope-upgrade`,requested:n,approved:r}:{kind:`role-upgrade`,requested:n,approved:r}:{kind:`new-pairing`,requested:n,approved:null}}var Dt=e((()=>{ee(),t()}));function Ot(e,t,n){let r=new Map(t.map(e=>[g(e.deviceId),e]).filter(e=>!!e[0]));return e.map(e=>Mt(e,n,kt(r,e)))}function kt(e,t){let n=g(t.deviceId);if(!n)return;let r=e.get(n);if(!r)return;let i=g(t.publicKey),a=g(r.publicKey);if(!(i&&a&&i!==a))return r}function At(e){return e?D(`nodes.inventory.rolesAndScopes`,{roles:C(e.roles),scopes:C(e.scopes)}):D(`nodes.inventory.none`)}function jt(e){switch(e){case`scope-upgrade`:return D(`nodes.inventory.scopeUpgrade`);case`role-upgrade`:return D(`nodes.inventory.roleUpgrade`);case`re-approval`:return D(`nodes.inventory.reapproval`);case`new-pairing`:return D(`nodes.inventory.newPairing`)}throw Error(`unsupported pending approval kind`)}function Mt(e,t,n){let r=g(e.displayName)||e.deviceId,a=typeof e.ts==`number`?i(e.ts):D(`common.na`),o=Et(e,n),s=e.isRepair?` · ${D(`nodes.inventory.repair`)}`:``,c=e.remoteIp?` · ${e.remoteIp}`:``;return l`
    <div class="settings-row nodes-entry">
      ${I(k.monitorSmartphone)}
      <div class="settings-row__text">
        <span class="settings-row__title">${r}</span>
        <span class="settings-row__desc">${e.deviceId}${c}</span>
        <span class="settings-row__desc">
          ${D(`nodes.inventory.requestedAt`,{note:jt(o.kind),time:a})}${s}
        </span>
        <span class="settings-row__desc">
          ${D(`nodes.inventory.requestedAccess`,{access:At(o.requested)})}
        </span>
        ${o.approved?l`
              <span class="settings-row__desc">
                ${D(`nodes.inventory.approvedAccess`,{access:At(o.approved)})}
              </span>
            `:p}
      </div>
      <div class="settings-row__control">
        <button class="btn btn--sm" @click=${()=>t.onDeviceApprove(e.requestId)}>
          ${D(`nodes.inventory.approve`)}
        </button>
        <button class="btn btn--sm" @click=${()=>t.onDeviceReject(e.requestId)}>
          ${D(`nodes.inventory.reject`)}
        </button>
      </div>
    </div>
  `}var Nt=e((()=>{d(),Dt(),A(),O(),y(),v(),V()}));function Pt(e){let t=bt(e);return{id:e.id,name:e.name,...t}}function Ft(e,t,n){if(n&&e.length===0)return D(`common.loading`);let r=e.filter(e=>e.primary.connected).length,i=[D(`nodes.inventory.summaryConnected`,{connected:String(r),total:String(e.length)})];return t>0&&i.push(D(`nodes.inventory.summaryPending`,{count:String(t)})),i.join(` · `)}function It(e){let t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],r=Array.isArray(t.paired)?t.paired:[],i=gt({paired:r,nodes:e.nodes,presence:e.presence}),a=vt(e.presence),o=yt(e.presence,i),s=_t(i),c=e.loading||e.devicesLoading,u=l`
    ${s.length>0?l`
          <button
            class="btn btn--sm danger"
            @click=${()=>e.onInventoryCleanup(s.map(Pt))}
          >
            ${k.trash} ${D(`nodes.inventory.cleanupStale`,{count:String(s.length)})}
          </button>
        `:p}
    <button
      class="btn"
      title=${e.canPairDevice?``:D(`nodes.pairing.adminRequired`)}
      ?disabled=${!e.canPairDevice}
      @click=${e.onDevicePairSetupOpen}
    >
      ${k.plus} ${D(`nodes.pairing.button`)}
    </button>
  `,d=i.length===0&&!a,f=l`
    ${a?Jt(a):p}
    ${d?Le(D(c?`common.loading`:`nodes.inventory.empty`)):i.map(t=>Rt(t,e))}
  `;return l`
    ${e.devicesError?l`<div class="callout danger">${e.devicesError}</div>`:p}
    ${e.lastError?l`<div class="callout danger">${e.lastError}</div>`:p}
    ${n.length>0?j({title:D(`nodes.inventory.pendingApproval`),count:n.length},Ot(n,r,e)):p}
    ${j({title:D(`nodes.inventory.title`),description:Ft(i,n.length,c),actions:u},f)}
    ${o.length>0?j({title:D(`nodes.inventory.connectedWithoutPairing`)},o.map(e=>Yt(e))):p}
    ${Lt(e)}
  `}function Lt(e){let t=e.inventoryRemovalPrompt;if(!t)return p;let n=t.kind===`entry`?D(`nodes.inventory.removePromptTitle`,{name:t.entry.name}):D(t.entries.length===1?`nodes.inventory.removeStalePromptTitleOne`:`nodes.inventory.removeStalePromptTitle`,{count:String(t.entries.length)}),r=t.kind===`entry`?D(`nodes.inventory.removePromptBody`):D(`nodes.inventory.removeStalePromptBody`);return l`
    <openclaw-modal-dialog
      label=${n}
      description=${r}
      @modal-cancel=${e.onInventoryRemovalCancel}
    >
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">${n}</div>
            <div class="exec-approval-sub">${r}</div>
          </div>
        </div>
        ${t.kind===`entry`?l`<div class="exec-approval-command mono">
              ${D(`nodes.inventory.deviceId`,{id:t.entry.id})}
            </div>`:p}
        <div class="exec-approval-actions">
          <button class="btn danger" @click=${e.onInventoryRemovalConfirm}>
            ${D(`nodes.inventory.remove`)}
          </button>
          <button class="btn" autofocus @click=${e.onInventoryRemovalCancel}>
            ${D(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function Rt(e,t){return e.duplicates.length===0?Z(e.primary,t):l`
    ${Z(e.primary,t)}
    <details class="nodes-group__dups">
      <summary>
        ${D(e.duplicates.length===1?`nodes.inventory.olderPairing`:`nodes.inventory.olderPairings`,{count:String(e.duplicates.length),name:e.name})}
      </summary>
      ${e.duplicates.map(e=>Z(e,t))}
    </details>
  `}function zt(e){let t=g(e)?.toLowerCase();return t===`win32`||t===`windows`||t?.startsWith(`windows `)===!0}function Bt(e){let t=e.node;return t?.paired?t.approvalState===void 0||t.approvalState===`approved`:!1}function Vt(e){let t=g(e.node?.coreVersion);if(t)return t;if(g(e.node?.uiVersion))return;let n=g(e.node?.platform)?.toLowerCase();return n===`darwin`||n===`linux`||n===`win32`||n===`windows`?g(e.node?.version):void 0}function Ht(e,t){let n=[],r=Bt(e),i=Vt(e),a=g(t);if(r&&i&&a&&i!==a){let e=D(`nodes.inventory.versionDriftTitle`,{nodeVersion:i,gatewayVersion:a});n.push(l`<span title=${e}>
        ${F({kind:`warn`,label:D(`nodes.inventory.versionDrift`)})}
      </span>`)}r&&!e.connected&&zt(e.platform)&&n.push(l`<span title=${D(`nodes.inventory.manualWakeTitle`)}>
        ${F({kind:`warn`,label:D(`nodes.inventory.manualWake`)})}
      </span>`);let o=e.node?.approvalState;return(o===`pending-approval`||o===`pending-reapproval`)&&n.push(F({kind:`warn`,label:D(`nodes.inventory.approvalNeeded`)})),n}function Ut(e){let[t=``,...n]=e.trim().split(/\s+/u),r=t===t.toLowerCase()?`${t.charAt(0).toUpperCase()}${t.slice(1)}`:t;return[Zt[t.toLowerCase()]??r,...n].join(` `)}function X(e){return D(`nodes.inventory.inputAgo`,{time:n(e*1e3,{suffix:!1})})}function Wt(e){let t=[];e.platform&&t.push(Ut(e.platform)),e.modelIdentifier&&t.push(e.modelIdentifier),e.version&&t.push(e.version),e.connected&&e.presence?.lastInputSeconds!=null?t.push(X(e.presence.lastInputSeconds)):!e.connected&&e.lastSeenAtMs?t.push(D(`nodes.inventory.seen`,{time:i(e.lastSeenAtMs)})):!e.connected&&e.approvedAtMs&&t.push(D(`nodes.inventory.approved`,{time:i(e.approvedAtMs)}));for(let n of e.roles)t.push(n);return e.autoApproved&&t.push(D(`nodes.inventory.autoPaired`)),t.join(` · `)}function Gt(e,t){if(t.length===0)return p;let n=t.slice(0,Qt),r=t.length-n.length,i=r>0?` +${r}`:``;return l`<div class="muted">${e}: ${C(n)}${i}</div>`}function Kt(e,t){let n=e.device?.tokens??[],r=e.node?.caps??[],i=e.node?.commands??[],a=e.scopes;return l`
    <details class="nodes-entry__details">
      <summary>${D(`nodes.inventory.details`)}</summary>
      <div class="muted">${D(`nodes.inventory.deviceId`,{id:e.id})}</div>
      ${e.remoteIp?l`<div class="muted">${D(`nodes.inventory.remoteIp`,{ip:e.remoteIp})}</div>`:p}
      ${a.length>0?l`<div class="muted">
            ${D(`nodes.inventory.scopes`,{scopes:C(a)})}
          </div>`:p}
      ${n.length>0?l`
            <div class="muted">${D(`nodes.inventory.tokens`)}</div>
            ${n.map(n=>Xt(e.id,n,t))}
          `:p}
      ${Gt(D(`nodes.inventory.capabilities`),r)}
      ${Gt(D(`nodes.inventory.commands`),i)}
    </details>
  `}function Z(e,t){let n=e.node?.approvalState===`pending-approval`||e.node?.approvalState===`pending-reapproval`?e.node.pendingRequestId:void 0,r=e.connected?F({kind:`ok`,label:D(`nodes.inventory.connected`)}):F({kind:`muted`,label:D(`nodes.inventory.offline`)});return l`
    <div class="settings-row nodes-entry">
      ${I(Ve(e))}
      <div class="settings-row__text">
        <span class="settings-row__title">${e.name}</span>
        <span class="settings-row__desc">${Wt(e)}</span>
        ${Kt(e,t)}
      </div>
      <div class="settings-row__control">
        ${r} ${Ht(e,t.gatewayVersion)}
        ${n?l`
              <button class="btn btn--sm" @click=${()=>t.onNodeApprove(n)}>
                ${D(`nodes.inventory.approve`)}
              </button>
              <button class="btn btn--sm" @click=${()=>t.onNodeReject(n)}>
                ${D(`nodes.inventory.reject`)}
              </button>
            `:p}
        <button
          class="btn btn--sm danger"
          aria-label=${D(`nodes.inventory.removeName`,{name:e.name})}
          title=${D(`nodes.inventory.remove`)}
          @click=${()=>t.onInventoryRemove(Pt(e))}
        >
          ${k.x}
        </button>
      </div>
    </div>
  `}function qt(e){let t=[];return e.platform&&t.push(Ut(e.platform)),e.modelIdentifier&&t.push(e.modelIdentifier),e.version&&t.push(e.version),e.lastInputSeconds!=null&&t.push(X(e.lastInputSeconds)),t}function Jt(e){let t=qt(e);return l`
    <div class="settings-row nodes-entry">
      ${I(k.server)}
      <div class="settings-row__text">
        <span class="settings-row__title">${e.host??D(`nodes.execApprovals.gateway`)}</span>
        ${t.length>0?l`<span class="settings-row__desc">${t.join(` · `)}</span>`:p}
      </div>
      <div class="settings-row__control">
        ${F({kind:`ok`,label:D(`nodes.inventory.connected`)})}
        ${F({kind:`accent`,label:D(`nodes.inventory.gateway`)})}
      </div>
    </div>
  `}function Yt(e){let t=Array.isArray(e.roles)?e.roles.filter(Boolean):[],n=[...qt(e),...t];return l`
    <div class="settings-row nodes-entry">
      ${I(Ve({clientMode:e.mode??void 0,platform:e.platform??void 0}))}
      <div class="settings-row__text">
        <span class="settings-row__title">
          ${e.host??e.mode??D(`nodes.inventory.unknownClient`)}
        </span>
        ${n.length>0?l`<span class="settings-row__desc">${n.join(` · `)}</span>`:p}
      </div>
      <div class="settings-row__control">
        ${F({kind:`ok`,label:D(`nodes.inventory.connected`)})}
        ${F({kind:`muted`,label:D(`nodes.inventory.unpaired`)})}
      </div>
    </div>
  `}function Xt(e,t,n){let r=t.revokedAtMs?D(`nodes.inventory.revoked`):D(`nodes.inventory.active`),a=D(`nodes.inventory.scopes`,{scopes:C(t.scopes)}),o=i(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return l`
    <div class="nodes-entry__token">
      <span class="muted">${t.role} · ${r} · ${a} · ${o}</span>
      <span class="nodes-entry__token-actions">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          ${D(`nodes.inventory.rotate`)}
        </button>
        ${t.revokedAtMs?p:l`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e,t.role)}
              >
                ${D(`nodes.inventory.revoke`)}
              </button>
            `}
      </span>
    </div>
  `}var Zt,Qt,$t=e((()=>{d(),je(),A(),P(),O(),y(),St(),v(),Nt(),V(),Zt={macos:`macOS`,darwin:`macOS`,win32:`Windows`,windows:`Windows`,linux:`Linux`,ios:`iOS`,ipados:`iPadOS`,watchos:`watchOS`,android:`Android`,web:`Web`},Qt=16}));function en(e){let t=tn(e),n=Qe(e);return Pe(l`
      ${It(e)} ${$e(n)}
      ${nn(t)}
    `,{wide:!0})}function tn(e){let t=e.configForm,n=an(e.nodes),{defaultBinding:r,agents:i}=on(t);return{ready:!!t,disabled:e.configSaving||e.configFormMode===`raw`,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:r,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function nn(e){let t=e.nodes.length>0,n=e.defaultBinding??``,r=l`
    <button class="btn" ?disabled=${e.disabled||!e.configDirty} @click=${e.onSave}>
      ${e.configSaving?D(`common.saving`):D(`common.save`)}
    </button>
  `,i=l`
    ${e.formMode===`raw`?M({title:D(`nodes.binding.formModeHint`)}):p}
    ${e.ready?l`
          ${M({title:D(`nodes.binding.defaultBinding`),description:t?D(`nodes.binding.defaultBindingHint`):l`${D(`nodes.binding.defaultBindingHint`)} ${D(`nodes.binding.noNodes`)}`,control:l`
              <select
                class="settings-select"
                aria-label=${D(`nodes.binding.node`)}
                ?disabled=${e.disabled||!t}
                @change=${t=>{let n=t.target.value.trim();e.onBindDefault(n||null)}}
              >
                <option value="" ?selected=${n===``}>
                  ${D(`nodes.binding.anyNode`)}
                </option>
                ${e.nodes.map(e=>l`<option value=${e.id} ?selected=${n===e.id}>
                      ${e.label}
                    </option>`)}
              </select>
            `})}
          ${e.agents.length===0?M({title:D(`nodes.binding.noAgents`)}):e.agents.map(t=>rn(t,e))}
        `:M({title:D(`nodes.binding.loadConfigHint`),control:l`
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?D(`common.loading`):D(`common.loadConfig`)}
            </button>
          `})}
  `;return j({title:D(`nodes.binding.execNodeBinding`),description:D(`nodes.binding.execNodeBindingSubtitle`),actions:r},i)}function rn(e,t){let n=e.binding??`__default__`,r=e.name?.trim()?`${e.name} (${e.id})`:e.id,i=t.nodes.length>0;return M({title:r,description:l`
      ${e.isDefault?D(`nodes.binding.defaultAgent`):D(`nodes.binding.agent`)} ·
      ${n===`__default__`?D(`nodes.binding.usesDefault`,{node:t.defaultBinding??D(`nodes.binding.any`)}):D(`nodes.binding.override`,{node:e.binding??``})}
    `,control:l`
      <select
        class="settings-select"
        aria-label=${D(`nodes.binding.binding`)}
        ?disabled=${t.disabled||!i}
        @change=${n=>{let r=n.target.value.trim();t.onBindAgent(e.index,r===`__default__`?null:r)}}
      >
        <option value="__default__" ?selected=${n===`__default__`}>
          ${D(`nodes.binding.useDefault`)}
        </option>
        ${t.nodes.map(e=>l`<option value=${e.id} ?selected=${n===e.id}>
              ${e.label}
            </option>`)}
      </select>
    `})}function an(e){return Be(e,[`system.run`])}function on(e){let t={id:`main`,name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!=`object`)return{defaultBinding:null,agents:[t]};let n=(e.tools??{}).exec??{},r=typeof n.node==`string`&&n.node.trim()?n.node.trim():null,i=e.agents??{};if(!Array.isArray(i.list)||i.list.length===0)return{defaultBinding:r,agents:[t]};let a=ze(e).map(e=>{let t=(e.record.tools??{}).exec??{},n=typeof t.node==`string`&&t.node.trim()?t.node.trim():null;return{id:e.id,name:e.name,index:e.index,isDefault:e.isDefault,binding:n}});return a.length===0&&a.push(t),{defaultBinding:r,agents:a}}var sn=e((()=>{d(),P(),O(),Re(),st(),$t(),V()}));function Q(e){let t=e&&typeof e==`object`?e.presence:null;return Array.isArray(t)?t:null}function cn(e){let t=new Map;for(let n of e){let e=(n.deviceId??n.instanceId)?.trim().toLowerCase();!e||n.mode?.trim().toLowerCase()===`gateway`||t.set(e,n.reason?.trim().toLowerCase()===`disconnect`?`offline`:`connected`)}return JSON.stringify([...t].toSorted(([e],[t])=>e.localeCompare(t)))}var ln,$;e((()=>{s(),d(),m(),Ae(),Oe(),Ee(),Ne(),he(),ge(),w(),pe(),we(),de(),sn(),a(),ln=3e4,$=class extends se{constructor(...e){super(...e),this.client=null,this.connected=!1,this.requestGeneration=0,this.nodesLoading=!1,this.nodes=[],this.presence=[],this.lastError=null,this.chatError=null,this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.canPairDevice=!1,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget=`gateway`,this.execApprovalsTargetNodeId=null,this.inventoryRemovalPrompt=null,this.routeDataInitialized=!1,this.hasBoundGateway=!1,this.presenceRequestId=0,this.gatewaySource=null,this.polling=new ve(this,ln,()=>{b(this,{quiet:!0}),T(this,{quiet:!0})},!1),this.subscriptions=new le(this).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.gateway,e=>{let t=!this.hasBoundGateway;this.hasBoundGateway=!0,this.gatewaySource=e,this.applyGatewaySnapshot(e.snapshot,!t,t);let n=e.subscribe(t=>{this.gatewaySource===e&&this.applyGatewaySnapshot(t,!1)});return()=>{n(),this.gatewaySource===e&&(this.gatewaySource=null)}}).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{if(this.gatewaySource!==e)return;let n=t.event===`presence`?Q(t.payload):null;if(n){let e=cn(n)!==cn(this.presence);this.presenceRequestId+=1,this.presence=n,e&&(T(this,{quiet:!0}),b(this,{quiet:!0}))}(t.event===`device.pair.requested`||t.event===`device.pair.resolved`)&&T(this,{quiet:!0}),(t.event===`node.pair.requested`||t.event===`node.pair.resolved`)&&b(this,{quiet:!0})}))}willUpdate(e){e.has(`routeData`)&&this.applyRouteData()}updated(e){e.has(`routeData`)&&this.ensureInitialData()}disconnectedCallback(){this.subscriptions.clear(),this.requestGeneration+=1,this.presenceRequestId+=1,this.client=null,this.connected=!1,this.presence=[],this.canPairDevice=!1,this.inventoryRemovalPrompt=null,super.disconnectedCallback()}applyGatewaySnapshot(e,t,n=!1){let r=this.client!==e.client,i=this.connected!==e.connected;if((t||r||i||!e.connected)&&(this.requestGeneration+=1),this.syncGatewayState(e),(t||!n&&(r||!e.connected))&&this.resetServerState(e),this.routeDataInitialized&&e.connected&&e.client&&(t||r||i)){let t=Q(e.hello?.snapshot);this.presence=t??[],this.loadPresence()}this.syncPolling(),this.ensureInitialData()}syncGatewayState(e){this.client=e.client,this.connected=e.connected,this.canPairDevice=e.connected&&Te(e.hello?.auth??null)}applyRouteData(){let e=this.routeData;if(!e)return;this.routeDataInitialized=!0;let t=this.context.gateway,n=t.snapshot;if(e.gateway!==t||e.gatewaySnapshot!==n){this.resetServerState(n),this.presence=Q(n.hello?.snapshot)??[],this.loadPresence(),this.ensureInitialData();return}this.client=n.client,this.connected=n.connected,this.nodesLoading=e.nodes.nodesLoading,this.nodes=e.nodes.nodes,this.lastError=e.nodes.lastError,this.chatError=e.nodes.chatError??null,this.devicesLoading=e.nodes.devicesLoading,this.devicesError=e.nodes.devicesError,this.devicesList=e.nodes.devicesList,this.execApprovalsLoading=e.nodes.execApprovalsLoading,this.execApprovalsSaving=e.nodes.execApprovalsSaving,this.execApprovalsDirty=e.nodes.execApprovalsDirty,this.execApprovalsSnapshot=e.nodes.execApprovalsSnapshot,this.execApprovalsForm=e.nodes.execApprovalsForm,this.execApprovalsSelectedAgent=e.nodes.execApprovalsSelectedAgent;let r=Q(n.hello?.snapshot);r&&(this.presence=r),this.loadPresence()}resetServerState(e){this.inventoryRemovalPrompt=null;let t=me(e);this.nodesLoading=t.nodesLoading,this.nodes=t.nodes,this.presenceRequestId+=1,this.presence=[],this.lastError=t.lastError,this.chatError=t.chatError??null,this.devicesLoading=t.devicesLoading,this.devicesError=t.devicesError,this.devicesList=t.devicesList,this.execApprovalsLoading=t.execApprovalsLoading,this.execApprovalsSaving=t.execApprovalsSaving,this.execApprovalsDirty=t.execApprovalsDirty,this.execApprovalsSnapshot=t.execApprovalsSnapshot,this.execApprovalsForm=t.execApprovalsForm,this.execApprovalsSelectedAgent=t.execApprovalsSelectedAgent}ensureInitialData(){if(!this.connected||!this.client||!this.routeDataInitialized)return;!this.nodes.length&&!this.nodesLoading&&b(this),!this.devicesList&&!this.devicesLoading&&T(this);let e=this.context.runtimeConfig.state;!e.configSnapshot&&!e.configLoading&&this.context.runtimeConfig.refresh(),!this.execApprovalsSnapshot&&!this.execApprovalsLoading&&x(this,this.resolveExecApprovalsTarget())}syncPolling(){if(this.connected&&this.client){this.polling.start();return}this.polling.stop()}async loadPresence(){let e=this.context.gateway.snapshot,t=e.client;if(!e.connected||!t)return;let n=this.requestGeneration,r=++this.presenceRequestId;try{let e=await t.request(`system-presence`,{});this.isCurrentPresenceRequest(t,n,r)&&Array.isArray(e)&&(this.presence=e)}catch(e){this.isCurrentPresenceRequest(t,n,r)&&_e(e)&&(this.presence=[])}}isCurrentPresenceRequest(e,t,n){let r=this.context.gateway.snapshot;return r.connected&&r.client===e&&this.requestGeneration===t&&this.presenceRequestId===n}confirmInventoryRemoval(){let e=this.inventoryRemovalPrompt;if(this.inventoryRemovalPrompt=null,e){if(e.kind===`entry`){xe(this,e.entry);return}re(this,e.entries)}}resolveExecApprovalsTarget(){return this.execApprovalsTarget===`node`&&this.execApprovalsTargetNodeId?{kind:`node`,nodeId:this.execApprovalsTargetNodeId}:{kind:`gateway`}}render(){let e=this.context.runtimeConfig.state,t=this.context.gateway.snapshot,n=t.connected&&t.hello?.server?.version?.trim()||null;return l`
      <section class="content-header">
        <div>
          <div class="page-title">${De(`nodes`)}</div>
        </div>
      </section>
      ${Me(en({loading:this.nodesLoading,nodes:this.nodes,presence:this.presence,gatewayVersion:n,lastError:this.lastError,devicesLoading:this.devicesLoading,devicesError:this.devicesError,devicesList:this.devicesList,canPairDevice:this.canPairDevice,configForm:Ce(e),configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:this.execApprovalsLoading,execApprovalsSaving:this.execApprovalsSaving,execApprovalsDirty:this.execApprovalsDirty,execApprovalsSnapshot:this.execApprovalsSnapshot,execApprovalsForm:this.execApprovalsForm,execApprovalsSelectedAgent:this.execApprovalsSelectedAgent,execApprovalsTarget:this.execApprovalsTarget,execApprovalsTargetNodeId:this.execApprovalsTargetNodeId,onDevicePairSetupOpen:()=>void this.context.overlays.openDevicePairSetup(),onDeviceApprove:e=>void Se(this,e),onDeviceReject:e=>void ae(this,e),onNodeApprove:e=>void ye(this,e),onNodeReject:e=>void ie(this,e),inventoryRemovalPrompt:this.inventoryRemovalPrompt,onInventoryRemove:e=>{this.inventoryRemovalPrompt={kind:`entry`,entry:e}},onInventoryCleanup:e=>{e.length>0&&(this.inventoryRemovalPrompt={kind:`stale`,entries:e})},onInventoryRemovalConfirm:()=>this.confirmInventoryRemoval(),onInventoryRemovalCancel:()=>{this.inventoryRemovalPrompt=null},onDeviceRotate:(e,t,n)=>void ce(this,{deviceId:e,gatewayUrl:this.context.gateway.connection.gatewayUrl,role:t,scopes:n}),onDeviceRevoke:(e,t)=>void be(this,{deviceId:e,gatewayUrl:this.context.gateway.connection.gatewayUrl,role:t}),onLoadConfig:()=>void this.context.runtimeConfig.refresh({discardPendingChanges:!0}),onLoadExecApprovals:()=>void x(this,this.resolveExecApprovalsTarget()),onBindDefault:e=>{e?this.context.runtimeConfig.patchForm([`tools`,`exec`,`node`],e):this.context.runtimeConfig.removeFormValue([`tools`,`exec`,`node`])},onBindAgent:(e,t)=>{let n=[`agents`,`list`,e,`tools`,`exec`,`node`];t?this.context.runtimeConfig.patchForm(n,t):this.context.runtimeConfig.removeFormValue(n)},onSaveBindings:()=>void this.context.runtimeConfig.save(),onExecApprovalsTargetChange:(e,t)=>{this.execApprovalsTarget=e,this.execApprovalsTargetNodeId=t,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsDirty=!1,this.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:e=>{this.execApprovalsSelectedAgent=e},onExecApprovalsPatch:(e,t)=>oe(this,e,t),onExecApprovalsRemove:e=>fe(this,e),onSaveExecApprovals:()=>void ue(this,this.resolveExecApprovalsTarget())}))}
    `}},r([c({context:ke,subscribe:!0})],$.prototype,`context`,void 0),r([u({attribute:!1})],$.prototype,`routeData`,void 0),r([f()],$.prototype,`client`,void 0),r([f()],$.prototype,`connected`,void 0),r([f()],$.prototype,`nodesLoading`,void 0),r([f()],$.prototype,`nodes`,void 0),r([f()],$.prototype,`presence`,void 0),r([f()],$.prototype,`lastError`,void 0),r([f()],$.prototype,`chatError`,void 0),r([f()],$.prototype,`devicesLoading`,void 0),r([f()],$.prototype,`devicesError`,void 0),r([f()],$.prototype,`devicesList`,void 0),r([f()],$.prototype,`canPairDevice`,void 0),r([f()],$.prototype,`execApprovalsLoading`,void 0),r([f()],$.prototype,`execApprovalsSaving`,void 0),r([f()],$.prototype,`execApprovalsDirty`,void 0),r([f()],$.prototype,`execApprovalsSnapshot`,void 0),r([f()],$.prototype,`execApprovalsForm`,void 0),r([f()],$.prototype,`execApprovalsSelectedAgent`,void 0),r([f()],$.prototype,`execApprovalsTarget`,void 0),r([f()],$.prototype,`execApprovalsTargetNodeId`,void 0),r([f()],$.prototype,`inventoryRemovalPrompt`,void 0),customElements.get(`openclaw-nodes-page`)||customElements.define(`openclaw-nodes-page`,$)}))();
//# sourceMappingURL=nodes-page-GhaJEnFV.js.map