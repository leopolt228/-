import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{r as t}from"./control-ui-foundation-43q8Lf_T.js";import{$ as n,J as r,X as i,m as a,p as o}from"./lit-runtime-CE4wpvNA.js";import{M as s,P as c}from"./control-ui-foundation-DFIFKu9N.js";import{$a as l,$n as u,Ca as d,Ci as f,Cr as p,Da as m,Dr as h,Ea as g,Er as ee,Ga as te,Ha as _,La as v,Ma as ne,Na as re,Qa as y,Ra as ie,Ro as b,Sa as ae,Sr as x,Ta as oe,Tr as se,Ya as S,_ as ce,_r as C,ba as w,eo as le,fo as ue,g as de,ka as fe,mr as pe,no as me,po as he,pr as ge,qa as T,to as _e,wa as ve,xa as E,ya as ye,zo as be}from"./control-ui-core-Dx4utKSD.js";import{o as D,t as xe}from"./control-ui-core-CXeSrnoQ.js";import{Q as Se,at as O,ot as Ce,tt as k}from"./control-ui-core-vPyynwls.js";import{t as we}from"./openclaw-mascot-Bo-d0_tR.js";import{a as A,c as j,i as Te,o as Ee,r as De,s as Oe,t as ke}from"./attachment-payload-store-CcQeaOvD.js";import{a as Ae,r as je}from"./fast-mode-Drf8gt-u.js";import{a as Me,h as Ne,i as Pe,l as Fe,m as Ie}from"./thinking-DEtfIII5.js";import{i as Le,n as Re,r as ze,t as Be}from"./provider-icon-S1L7nSch.js";var Ve=e((()=>{}));function He(e){return typeof e==`string`&&e.trim().length>0}function Ue(e){return e.kind===`steered`}function We(e){return Ue(e)&&He(e.sendRunId)&&e.sendState===`steering`}function Ge(e){return Ue(e)&&He(e.sendRunId)&&e.sendState===void 0&&He(e.pendingRunId)}function Ke(e,t,n){return{...e,kind:`steered`,sendRunId:t,...n?{pendingRunId:n}:{},sendState:`steering`}}function qe(e,t){let{sendState:n,...r}=e;return{...r,pendingRunId:t}}var Je=e((()=>{}));function M(e){let t=e?.trim()||`default`,n=encodeURIComponent(t);return{key:`${Et}${n}`,legacyKey:`${Tt}${n.slice(0,240)}`,gatewayOwner:t,legacyOwnerIsUnambiguous:n.length<240}}function Ye(e,t){let n=t.trim().toLowerCase();return n===`main`||n===y(e)}function Xe(e){if(e.agentsList!==null&&e.agentsList!==void 0)return!0;let t=e.hello?.snapshot;return!t||typeof t!=`object`||!(`sessionDefaults`in t)?!1:!!(t.sessionDefaults&&typeof t.sessionDefaults==`object`)}function Ze(e,t){if(!Xe(t))return!1;let n=y(t);if(n===`main`)return e.mainAlias?(delete e.mainAlias,!0):!1;let r={key:n,agentId:l(t)};return e.mainAlias?.key===r.key&&e.mainAlias.agentId===r.agentId?!1:(e.mainAlias=r,!0)}function N(e,t,n){let r=It.get(e);r||(r=new Map,It.set(e,r)),r.set(t,n??null)}function Qe(e,t){return It.get(e)?.get(t)??void 0}function $e(e,t){return te(t)||Ye(e,t)||le(e,t)!==null}function P(e,t,n,r){let i=S(t),a=t.trim().toLowerCase(),o=Xe(e),s=i?.rest??a,c=!o&&r?.key===s,u=!o&&!i&&r&&(a===`main`||c)?r.agentId:void 0,d=!o&&!i&&a===`main`,f=$e(e,t)||c,p=i?.agentId??n?.trim(),m=_e(e),h=o&&!i&&Ye(e,t)?l(e):void 0,g=f?p?T(p):h?T(h):u?T(u):d?void 0:m?T(m):c?T(r.agentId):void 0:i?.agentId?T(i.agentId):void 0;return{conversationKey:d&&!g?v:f?`global`:t,agentScope:g??(f?K:`main`),...g?{routingAgentId:g}:{},isGlobal:f}}function F(e,t){return`${e}\u0000agent:${t}`}function I(e,t,n){let r=b(),i=M(e.settings?.gatewayUrl),a=P(e,t,n,r?Qe(r,i.key):void 0);return{sessionKey:a.conversationKey,...a.routingAgentId?{agentId:a.routingAgentId}:{}}}function L(e){let t=e.sessionKey.trim().toLowerCase(),n=e.agentId??(t===`global`||t===`main`?K:`main`);return F(e.sessionKey,n)}function R(e=0){let t=Math.max(Date.now(),jt+1,e+1);return jt=t,t}function et(e,t,n,r){if(r===void 0)return;let i=Mt.get(e);i||(i=new Map,Mt.set(e,i));let a=i.get(t);a||(a=new Map,i.set(t,a)),a.set(n,Math.max(a.get(n)??0,r))}function tt(e,t,n,r){let i=Nt.get(e);i||(i=new Map,Nt.set(e,i));let a=i.get(t);a||(a=new Map,i.set(t,a)),a.set(n,Math.max(a.get(n)??0,r))}function nt(e,t,n){return Mt.get(e)?.get(t)?.get(n)??0}function rt(e,t,n){return Nt.get(e)?.get(t)?.get(n)??0}function it(e,t){if(!e)return t;let n=e.updatedAt>t.updatedAt?e:t,r=n===e?t:e,i=e.draftRevision,a=t.draftRevision,o=i===void 0?a===void 0?null:t:a===void 0||i>a?e:t,s=new Map([...r.queue??[],...n.queue??[]].map(e=>[e.id,e])),c=Array.from(s.values()).toSorted((e,t)=>e.createdAt-t.createdAt).slice(0,kt);return{...o?.draft?{draft:o.draft}:{},...o?.draftRevision===void 0?{}:{draftRevision:o.draftRevision},...c.length?{queue:c}:{},updatedAt:Math.max(e.updatedAt,t.updatedAt)}}function z(e,t,n,r){let i=Ze(e,t),a=P(t,n,r,e.mainAlias),o=F(a.conversationKey,a.agentScope),s=y(t),c=Xe(t)?l(t):void 0;if(c){let t=F(`global`,c),n=U(e.sessions[t]),r=new Set([v,s]);for(let a of Object.keys(e.sessions)){if(a===t)continue;let o=a.lastIndexOf(`\0agent:`);if(o<0)continue;let s=a.slice(0,o).trim().toLowerCase();if(!r.has(s))continue;let l=U(e.sessions[a]);if(!l)continue;let u=l.queue?.map(e=>({...e,agentId:c,sessionKey:`global`}));n=it(n,{...l,...u?{queue:u}:{}}),e.sessions[t]=n,delete e.sessions[a],i=!0}}let u=U(e.sessions[o]);if(!a.isGlobal&&!S(n)){let t=`${a.conversationKey}\u0000agent:`;for(let n of Object.keys(e.sessions)){if(n===o||!n.startsWith(t))continue;let r=U(e.sessions[n]);if(!r)continue;let s=r.queue?.map(({agentId:e,...t})=>({...t,sessionKey:a.conversationKey}));u=it(u,{...r,...s?{queue:s}:{}}),e.sessions[o]=u,delete e.sessions[n],i=!0}}let d=`\u0000agent:${a.agentScope}`;for(let n of Object.keys(e.sessions)){if(n===o||!n.endsWith(d)||P(t,n.slice(0,-d.length),a.agentScope===K?void 0:a.agentScope,e.mainAlias).conversationKey!==a.conversationKey)continue;let r=U(e.sessions[n]);if(r){let t=r.queue?.map(({agentId:e,...t})=>({...t,sessionKey:a.conversationKey,...a.routingAgentId?{agentId:a.routingAgentId}:{}}));u=it(u,{...r,...t?{queue:t}:{}}),e.sessions[o]=u,delete e.sessions[n],i=!0}}if(!a.isGlobal)return{session:u,storeSessionKey:o,migrated:i};let f=_e(t);if(!f||a.agentScope!==f)return{session:u,storeSessionKey:o,migrated:i};let p=F(a.conversationKey,K);if(o===p)return{session:u,storeSessionKey:o,migrated:i};let m=U(e.sessions[p]);if(!m)return{session:u,storeSessionKey:o,migrated:i};let h=m.queue?.map(e=>e.agentId?e:{...e,agentId:a.agentScope}),g=it(u,{...m,...h?{queue:h}:{}});return e.sessions[o]=g,delete e.sessions[p],{session:g,storeSessionKey:o,migrated:!0}}function at(e,t,n,r){try{let i=JSON.parse(n);if(!i||i.version!==r||r===2&&i.gatewayOwner!==t.gatewayOwner||!i.sessions||typeof i.sessions!=`object`)return null;let a={};for(let[n,r]of Object.entries(i.sessions)){let i=U(r);i&&(a[n]=i,jt=Math.max(jt,i.draftRevision??0),et(e,t.key,n,i.draftRevision))}let o=i.mainAlias,s=o&&typeof o==`object`&&`key`in o&&typeof o.key==`string`&&o.key.trim()&&`agentId`in o&&typeof o.agentId==`string`&&o.agentId.trim()?{key:o.key.trim().toLowerCase(),agentId:T(o.agentId)}:void 0;return N(e,t.key,s),{version:2,gatewayOwner:t.gatewayOwner,sessions:a,...s?{mainAlias:s}:{}}}catch{return null}}function B(e,t){let n=e.getItem(t.key);if(n)return at(e,t,n,2)||(N(e,t.key,void 0),{version:2,gatewayOwner:t.gatewayOwner,sessions:{}});if(t.legacyOwnerIsUnambiguous){let n=e.getItem(t.legacyKey);if(n){let r=at(e,t,n,1);if(r){try{V(e,t,r),e.removeItem(t.legacyKey)}catch{}return r}}}return N(e,t.key,void 0),{version:2,gatewayOwner:t.gatewayOwner,sessions:{}}}function V(e,t,n){let r=Object.entries(n.sessions),i=r.filter(([,e])=>e.queue?.length);if(i.length>Dt)throw Error(`Chat outbox session limit reached`);let a=r.filter(([,e])=>!e.queue?.length),o=F(`global`,K),s=a.find(([e])=>e===o),c=(e,t)=>t[1].updatedAt-e[1].updatedAt||(t[1].draftRevision??0)-(e[1].draftRevision??0)||e[0].localeCompare(t[0]),l=a.filter(([e,t])=>e!==o&&!t.draft&&t.draftRevision!==void 0).toSorted(c),u=[...s?[s]:[],...l].slice(0,Dt),d=a.filter(([e,t])=>e!==o&&!!t.draft),f=[...[...i.toSorted(c),...d.toSorted(c)].slice(0,Dt),...u];if(f.length===0&&!n.mainAlias){e.removeItem(t.key),N(e,t.key,void 0);return}e.setItem(t.key,JSON.stringify({version:2,gatewayOwner:t.gatewayOwner,sessions:Object.fromEntries(f),...n.mainAlias?{mainAlias:n.mainAlias}:{}})),N(e,t.key,n.mainAlias)}function H(e){return typeof e==`string`&&e.trim()?e:void 0}function ot(e){return typeof e==`boolean`?e:void 0}function st(e){if(!e||typeof e!=`object`||Array.isArray(e))return null;let t=e,n=H(t.id),r=H(t.mimeType);if(!n||!r)return null;let i={id:n,mimeType:r},a=H(t.fileName);a&&(i.fileName=a),typeof t.sizeBytes==`number`&&Number.isFinite(t.sizeBytes)&&(i.sizeBytes=t.sizeBytes);let o=H(t.dataUrl);return o&&(i.dataUrl=o),i}function ct(e){let t=De(e);return t?{id:e.id,mimeType:e.mimeType,...e.fileName?{fileName:e.fileName}:{},...typeof e.sizeBytes==`number`?{sizeBytes:e.sizeBytes}:{},dataUrl:t}:null}function lt(e){if(!e||typeof e!=`object`||Array.isArray(e))return;let t=e,n=H(t.proposalId);if(!n)return;let r=H(t.agentId);return{proposalId:n,...r?{agentId:T(r)}:{}}}function ut(e){let t=H(e.id),n=typeof e.text==`string`?e.text:``;if(!t||!n.trim()&&!e.attachments?.length||e.pendingRunId||e.sendState===`sending`&&!e.sendRunId)return null;let r=e.attachments?.map(ct)??[];if(e.attachments?.length&&r.some(e=>e===null))return null;let i=e.sendState===`sending`?`waiting-reconnect`:e.sendState===`executing-command`||We(e)?`unconfirmed`:e.sendState===`waiting-model`?`failed`:e.sendState===`failed`||e.sendState===`unconfirmed`||e.sendState===`waiting-idle`||e.sendState===`waiting-reconnect`?e.sendState:void 0,a=e.sendState===`waiting-model`?Pt:e.sendError,o=lt(e.skillWorkshopRevision),s=ce(e.sender);return{id:t,text:n,createdAt:typeof e.createdAt==`number`&&Number.isFinite(e.createdAt)?e.createdAt:Date.now(),...e.kind===`queued`||Ue(e)?{kind:e.kind}:{},...r.length?{attachments:r}:{},...typeof e.refreshSessions==`boolean`?{refreshSessions:e.refreshSessions}:{},...e.replyToId?{replyToId:e.replyToId}:{},...e.localCommandArgs?{localCommandArgs:e.localCommandArgs}:{},...e.localCommandName?{localCommandName:e.localCommandName}:{},...e.sessionKey?{sessionKey:e.sessionKey}:{},...e.agentId?{agentId:e.agentId}:{},...s?{sender:s}:{},...o?{skillWorkshopRevision:o}:{},...i?{sendState:i}:{},...a?{sendError:a}:{},...e.sendRunId?{sendRunId:e.sendRunId}:{},...typeof e.sendAttempts==`number`&&Number.isFinite(e.sendAttempts)?{sendAttempts:e.sendAttempts}:{}}}function dt(e){if(!e||typeof e!=`object`||Array.isArray(e))return null;let t=e,n=H(t.id),r=typeof t.text==`string`?t.text:``,i=typeof t.createdAt==`number`&&Number.isFinite(t.createdAt)?t.createdAt:Date.now();if(!n||!r.trim()&&!Array.isArray(t.attachments))return null;let a=Array.isArray(t.attachments)?t.attachments.map(st).filter(e=>e!==null):[],o={id:n,text:r,createdAt:i},s=ce(t.sender);s&&(o.sender=s),(t.kind===`queued`||t.kind===`steered`)&&(o.kind=t.kind),a.length&&(o.attachments=a);let c=ot(t.refreshSessions);c!==void 0&&(o.refreshSessions=c);let l=H(t.replyToId);l&&(o.replyToId=l),t.sendState===`failed`||t.sendState===`unconfirmed`||t.sendState===`waiting-idle`||t.sendState===`waiting-reconnect`?o.sendState=t.sendState:t.sendState===`waiting-model`&&(o.sendState=`failed`,o.sendError=Pt);let u=H(t.sendError);u&&(o.sendError=u);let d=H(t.sendRunId);d&&(o.sendRunId=d),typeof t.sendAttempts==`number`&&Number.isFinite(t.sendAttempts)&&(o.sendAttempts=t.sendAttempts);let f=H(t.localCommandArgs);f&&(o.localCommandArgs=f);let p=H(t.localCommandName);p&&(o.localCommandName=p);let m=H(t.sessionKey);m&&(o.sessionKey=m);let h=H(t.agentId);h&&(o.agentId=T(h));let g=lt(t.skillWorkshopRevision);return g&&(o.skillWorkshopRevision=g),o}function U(e){if(!e||typeof e!=`object`||Array.isArray(e))return null;let t=e,n=typeof t.draft==`string`?t.draft:void 0,r=Array.isArray(t.queue)?t.queue.slice(0,kt).map(dt).filter(e=>e!==null):void 0,i=Array.isArray(t.removedQueueItemIds)?t.removedQueueItemIds.map(H).filter(e=>e!==void 0):void 0,a=new Set(i??[]),o=r?.filter(e=>!a.has(e.id)),s=typeof t.updatedAt==`number`&&Number.isFinite(t.updatedAt)?t.updatedAt:Date.now(),c=(typeof t.draftRevision==`number`&&Number.isSafeInteger(t.draftRevision)?t.draftRevision:void 0)??(n?s:void 0);return!n&&c===void 0&&(!o||o.length===0)?null:{...n?{draft:n}:{},...c===void 0?{}:{draftRevision:c},...o&&o.length>0?{queue:o}:{},updatedAt:s}}function W(e,t){let n=ut(e);if(!n)return null;let{agentId:r,...i}=n;return{...i,sessionKey:t.conversationKey,...t.routingAgentId?{agentId:t.routingAgentId}:{}}}function ft(e,t,n){let r=W(t,n);return!!(r&&e.id===r.id&&e.sendRunId===r.sendRunId&&e.sendAttempts===r.sendAttempts&&e.sendState===r.sendState&&e.agentId===r.agentId&&e.sessionKey===r.sessionKey)}function pt(e,t,n){let r=W(e,n),i=W(t,n);return!!(r&&i&&JSON.stringify(r)===JSON.stringify(i))}function mt(e,t,n,r){if(!n?.draft&&n?.draftRevision===void 0&&r.length===0){delete e.sessions[t];return}e.sessions[t]={...n?.draft?{draft:n.draft}:{},...n?.draftRevision===void 0?{}:{draftRevision:n.draftRevision},...r.length?{queue:r}:{},updatedAt:Date.now()}}function ht(e,t,n){let r=b();if(!r)return{committed:0,latestAttempt:0};try{let i=M(e.settings?.gatewayUrl),a=B(r,i),o=z(a,e,t,n);if(o.migrated)try{V(r,i,a)}catch{}let s=o.session?.draftRevision;et(r,i.key,o.storeSessionKey,s);let c=Math.max(s??0,nt(r,i.key,o.storeSessionKey));return{committed:c,latestAttempt:Math.max(c,rt(r,i.key,o.storeSessionKey))}}catch{return{committed:0,latestAttempt:0}}}function gt(e,t,n){return ht(e,t,n).latestAttempt}function _t(e,t,n){return ht(e,t,n).committed}function vt(e,t,n){let r=b();if(!r)return null;try{let i=M(e.settings?.gatewayUrl),a=B(r,i),o=P(e,t,n,a.mainAlias),s=z(a,e,t,n);if(!s.session&&o.isGlobal&&o.agentScope===K){let n=new Set;for(let[t,r]of Object.entries(a.sessions)){let i=t.lastIndexOf(`\0agent:`);if(i<0)continue;let o=t.slice(0,i),s=t.slice(i+7),c=U(r),l=P(e,o,s,a.mainAlias);s!==K&&l.isGlobal&&c!==null&&n.add(s)}if(n.size===1){let r=n.values().next().value;typeof r==`string`&&(o=P(e,t,r,a.mainAlias),s=z(a,e,t,r))}}if(s.migrated)try{V(r,i,a)}catch{}let c=s.session;return!c||!c.draft&&!c.queue?.length?null:{draft:c.draft??``,queue:(c.queue??[]).map(e=>W(e,o)).filter(e=>e!==null).map(e=>Object.assign(e,{sessionKey:t}))}}catch{return null}}function yt(e,t=e.sessionKey,n={}){let r=b();if(!r||!t.trim())return`storage-failed`;try{let i=M(e.settings?.gatewayUrl),a=B(r,i),{session:o,storeSessionKey:s}=z(a,e,t,n.agentId),c=Object.hasOwn(n,`draft`)?n.draft??``:e.chatMessage,l=o?.draftRevision;et(r,i.key,s,l);let u=Math.max(l??0,nt(r,i.key,s)),d=Math.max(u,rt(r,i.key,s)),f=n.draftRevision??R(d);if(!Number.isSafeInteger(f)||f<=0)return`conflict`;let p=o?.draft??``,m=n.expectedDraftRevision;if(!(m===void 0||u===m||l===f&&p===c)||f<d||l===f&&p!==c)return`conflict`;tt(r,i.key,s,f),a.sessions[s]={...c?{draft:c}:{},draftRevision:f,...o?.queue?.length?{queue:o.queue}:{},updatedAt:Date.now()},V(r,i,a);let h=z(B(r,i),e,t,n.agentId).session;return h?.draftRevision===f&&(h.draft??``)===c?`persisted`:(h?.draftRevision??0)>=f?`conflict`:`storage-failed`}catch{return`storage-failed`}}function bt(e,t=e.sessionKey,n={}){return yt(e,t,n)===`persisted`}function xt(e,t,n,r){let i=b();if(!i||!t.trim())return!1;try{let a=M(e.settings?.gatewayUrl),o=B(i,a),s=P(e,t,r??n.agentId,o.mainAlias),c=W(n,s);if(!c)return!1;let{session:l,storeSessionKey:u,migrated:d}=z(o,e,t,s.agentScope===K?void 0:s.agentScope),f=l?.queue??[],p=f.find(e=>e.id===c.id);if(p)return pt(p,c,s)?(d&&V(i,a,o),!0):!1;if(f.length>=Ot)return!1;mt(o,u,l,[...f,c]),V(i,a,o);let m=z(B(i,a),e,t,s.agentScope===K?void 0:s.agentScope).session?.queue?.find(e=>e.id===c.id);return!!(m&&pt(m,c,s))}catch{return!1}}function St(e,t,n,r,i){let a=b();if(!a||!t.trim()||n.id!==r.id)return!1;try{let o=M(e.settings?.gatewayUrl),s=B(a,o),c=P(e,t,i??n.agentId??r.agentId,s.mainAlias),l=W(r,c);if(!l)return!1;let{session:u,storeSessionKey:d}=z(s,e,t,c.agentScope===K?void 0:c.agentScope),f=u?.queue??[],p=f.findIndex(e=>e.id===n.id),m=f[p];if(!m||!ft(m,n,c))return!1;let h=f.slice();h[p]=l,mt(s,d,u,h),V(a,o,s);let g=z(B(a,o),e,t,c.agentScope===K?void 0:c.agentScope).session?.queue?.find(e=>e.id===l.id);return!!(g&&pt(g,l,c))}catch{return!1}}function Ct(e,t,n,r,i){let a=b();if(!a||!t.trim()||!n.trim())return!1;try{let o=M(e.settings?.gatewayUrl),s=B(a,o),c=P(e,t,i??r?.agentId,s.mainAlias),{session:l,storeSessionKey:u}=z(s,e,t,c.agentScope===K?void 0:c.agentScope),d=l?.queue??[],f=d.findIndex(e=>e.id===n);if(f<0)return!0;let p=d[f];return!p||r&&!ft(p,r,c)?!1:(mt(s,u,l,d.filter((e,t)=>t!==f)),V(a,o,s),!z(B(a,o),e,t,c.agentScope===K?void 0:c.agentScope).session?.queue?.some(e=>e.id===n))}catch{return!1}}function G(e){let t=b();if(!t)return[];try{let n=M(e.settings?.gatewayUrl),r=B(t,n),i=`\0agent:`,a=!1,o=_e(e),s=Xe(e)?l(e):void 0;s&&(a=z(r,e,`global`,s).migrated),o&&(a=z(r,e,`global`,o).migrated||a);for(let t of Object.keys(r.sessions)){let n=t.lastIndexOf(i);if(n<0)continue;let o=t.slice(0,n),s=t.slice(n+7);a=z(r,e,o,s===K?void 0:s).migrated||a}if(a)try{V(t,n,r)}catch{}let c=[];for(let[t,n]of Object.entries(r.sessions)){let a=t.lastIndexOf(i);if(a<0)continue;let o=t.slice(0,a),s=t.slice(a+7),l=U(n);if(!l?.queue?.length)continue;let u=P(e,o,s===K?void 0:s,r.mainAlias),d=l.queue.map(e=>W(e,u)).filter(e=>e!==null);d.length&&c.push({sessionKey:u.conversationKey,...u.routingAgentId?{agentId:u.routingAgentId}:{},queue:d})}return c.toSorted((e,t)=>(e.queue[0]?.createdAt??2**53-1)-(t.queue[0]?.createdAt??2**53-1)||e.sessionKey.localeCompare(t.sessionKey))}catch{return[]}}function wt(e,t={}){let n=vt(e,t.sessionKey??e.sessionKey);return n?((!t.preserveCurrent||!e.chatMessage)&&(e.chatMessage=n.draft),(!t.preserveCurrent&&n.queue.length>0||e.chatQueue.length===0)&&(e.chatQueue=n.queue),!0):!1}var Tt,Et,Dt,Ot,kt,At,K,jt,Mt,Nt,Pt,Ft,It,Lt,Rt=e((()=>{de(),_(),be(),A(),Je(),Tt=`openclaw.control.chatComposer.v1:`,Et=`openclaw.control.chatComposer.v2:`,Dt=20,Ot=50,kt=Dt*Ot,At=200,K=`@unresolved`,jt=0,Mt=new WeakMap,Nt=new WeakMap,Pt=`Chat settings update was interrupted. Review and retry when ready.`,Ft=`Could not store the previous draft in browser storage. It remains available in this tab.`,It=new WeakMap,Lt=class{constructor(e){this.getState=e,this.timer=null,this.ready=!1,this.pending=null,this.lastPersisted=null,this.committedDraftRevision=0,this.latestDraftRevision=0}start(){let e=this.getState();if(!e)return;this.ready=!0,this.pending=null;let t=this.readDraftRevisions(e);this.committedDraftRevision=t.committed,this.latestDraftRevision=t.latestAttempt,this.lastPersisted=this.snapshot(e,t.committed,t.committed)}stop(){this.persistNow(),this.ready=!1,this.pending=null,this.clearTimer()}restore(e={}){let t=this.getState();if(!t)return!1;let n=wt(t,e);this.pending=null,this.clearTimer();let r=this.readDraftRevisions(t);return this.committedDraftRevision=r.committed,this.latestDraftRevision=r.latestAttempt,this.lastPersisted=this.snapshot(t,r.committed,r.committed),n}schedule(){let e=this.getState();if(!this.ready||!e)return;let t=this.snapshot(e);if(this.isUnchanged(t)){if(!this.pending){this.clearTimer();return}if(this.pending.chatMessage===t.chatMessage){this.clearTimer(),this.timer=globalThis.setTimeout(()=>this.persistNow(),At);return}}let n=R(Math.max(this.latestDraftRevision,this.pending?.draftRevision??0));this.latestDraftRevision=n,this.pending=this.snapshot(e,n,this.committedDraftRevision),this.clearTimer(),this.timer=globalThis.setTimeout(()=>this.persistNow(),At)}persistNow(){let e=this.getState();if(!this.ready||!e)return;let t=this.pending;if(!t){let n=this.snapshot(e);if(this.isUnchanged(n))return;t=this.snapshot(e,R(this.latestDraftRevision),this.committedDraftRevision),this.latestDraftRevision=t.draftRevision}this.clearTimer(),this.pending=this.persistSnapshot(e,t).status===`persisted`?null:t}persistChangedState(){this.persistNow()}scopeForRouteSwitch(){let e=this.getState();if(!e)return null;let t=this.snapshot(e),n=this.pending??(this.isUnchanged(t)?this.lastPersisted??t:t);return I(e,n.sessionKey,n.agentId)}persistForRouteSwitch(){return this.persistForRouteSwitchResult().status===`persisted`}persistForRouteSwitchResult(){let e=this.getState();if(!e)return{status:`persisted`};let t=this.pending,n=!1,r=this.snapshot(e);if(!t&&this.ready&&this.isUnchanged(r)){let i=this.lastPersisted??r;if(!i.chatMessage)return this.pending=null,this.clearTimer(),{status:`persisted`};let a=this.readDraftRevisions(e,i.sessionKey,i.agentId),o=a.committed,s=vt(e,i.sessionKey,i.agentId);if(o===i.draftRevision&&s?.draft===i.chatMessage)return this.pending=null,this.clearTimer(),{status:`persisted`};if(o!==i.draftRevision||s?.draft||a.latestAttempt>i.draftRevision)return{status:`conflict`};t={...i,expectedDraftRevision:o,draftRevision:R(Math.max(o,a.latestAttempt,this.latestDraftRevision))},this.latestDraftRevision=t.draftRevision,n=!0}else if(!t&&!this.ready&&!r.chatMessage)return this.pending=null,this.clearTimer(),{status:`persisted`};t??=this.snapshot(e,R(this.latestDraftRevision),this.committedDraftRevision),this.latestDraftRevision=Math.max(this.latestDraftRevision,t.draftRevision),this.clearTimer();let i=this.persistSnapshot(e,t,n);return this.pending=i.status===`persisted`?null:t,i}adoptCurrentRoute(){let e=this.getState();if(!e)return;this.pending=null,this.clearTimer();let t=this.readDraftRevisions(e);this.committedDraftRevision=t.committed,this.latestDraftRevision=t.latestAttempt,this.lastPersisted=this.snapshot(e,t.committed,t.committed)}persistSnapshot(e,t,n=!1){let r=yt(e,t.sessionKey,{agentId:t.agentId,draft:t.chatMessage,draftRevision:t.draftRevision,...n?{expectedDraftRevision:t.expectedDraftRevision}:{}});return r===`persisted`?(this.committedDraftRevision=t.draftRevision,this.latestDraftRevision=Math.max(this.latestDraftRevision,t.draftRevision),this.lastPersisted=t,{status:r}):r===`storage-failed`?{status:r,expectedDraftRevision:t.expectedDraftRevision,draftRevision:t.draftRevision}:{status:r}}clearTimer(){this.timer!==null&&(globalThis.clearTimeout(this.timer),this.timer=null)}isUnchanged(e){let t=this.lastPersisted;return!!(t&&t.sessionKey===e.sessionKey&&t.chatMessage===e.chatMessage)}snapshot(e,t=this.latestDraftRevision,n=this.committedDraftRevision){let r=I(e,e.sessionKey);return{sessionKey:e.sessionKey,chatMessage:e.chatMessage,...r.agentId?{agentId:r.agentId}:{},expectedDraftRevision:n,draftRevision:t}}readDraftRevisions(e,t=e.sessionKey,n){return ht(e,t,n)}}}));function zt(e,t){let n=X.get(e)??new Set;n.add(t),X.set(e,n)}function Bt(e,t){let n=X.get(e);n?.delete(t),n?.size===0&&X.delete(e)}function Vt(e,t){return Z.get(e)?.has(t)===!0}function Ht(e,t){let n=Z.get(e)??new Set;n.add(t),Z.set(e,n)}function Ut(e,t){let n=Z.get(e);n?.delete(t),n?.size===0&&Z.delete(e)}function Wt(e){return e.settings?.gatewayUrl?.trim()||`default`}function Gt(e,t,n){return`${Wt(e)}\u0000${L(t)}\u0000${n}`}function Kt(e,t,n){return Y.get(Gt(e,t,n))}function qt(e){return e.sendState===`sending`||e.sendState===`executing-command`}function Jt(e,t,n){let r=Gt(e,t,n.id);qt(n)?Y.set(r,n):Y.delete(r)}function Yt(e,t){return G(e).find(e=>e.queue.some(e=>e.id===t))}function Xt(e,t){return e.sessionKey===t.sessionKey&&e.agentId===t.agentId}function Zt(e,t){return G(e).find(e=>Xt(e,t))??{sessionKey:t.sessionKey,...t.agentId?{agentId:t.agentId}:{},queue:[]}}function q(e,t,n={}){let r=x(e,t.sessionKey,t.agentId),i=L(t),a=r?e.chatQueue:e.chatQueueByScope?.[i]??[],o=a.filter(e=>e.pendingRunId),s=new Map(o.map(e=>[e.id,e])),c=new Set(t.queue.map(e=>e.id)),l=a.filter(t=>!t.pendingRunId&&!c.has(t.id)&&X.get(e)?.has(t.id)),u=t.queue.map(n=>{let r=s.get(n.id);if(r)return r;let o=Kt(e,t,n.id);if(o)return o;let c=a.find(e=>e.id===n.id&&e.sendRunId===n.sendRunId),l=n.sendState===`waiting-reconnect`&&c?.sendState===`sending`&&c.sendAttempts===n.sendAttempts&&(e.chatSending===!0&&e.chatSendingScopeKey===i||e.chatRunId===n.sendRunId),u=n.sendState===`unconfirmed`&&c?.sendState===`executing-command`&&c.localCommandName===n.localCommandName&&c.localCommandArgs===n.localCommandArgs;return{...n,...l?{sendState:`sending`}:u?{sendState:`executing-command`}:{},...typeof c?.sendSubmittedAtMs==`number`?{sendSubmittedAtMs:c.sendSubmittedAtMs}:{},...typeof c?.sendRequestStartedAtMs==`number`?{sendRequestStartedAtMs:c.sendRequestStartedAtMs}:{}}}),d=o.filter(e=>!c.has(e.id)),f=[...u,...l,...d].toSorted((e,t)=>e.createdAt-t.createdAt);if(r)e.chatQueue=f;else{let t={...e.chatQueueByScope};f.length?t[i]=f:delete t[i],e.chatQueueByScope=t}n.requestUpdate!==!1&&e.requestUpdate?.()}function Qt(e,t={}){let n=G(e).find(t=>x(e,t.sessionKey,t.agentId));n&&q(e,n,t)}function J(e,t){for(let n of wn){let r=(n.settings?.gatewayUrl?.trim()||`default`)===(e.settings?.gatewayUrl?.trim()||`default`),i=x(n,t.sessionKey,t.agentId),a=Object.hasOwn(n.chatQueueByScope??{},L(t));n===e||!r||!i&&!a||q(n,t)}}function $t(e,t){return G(e).find(e=>Xt(e,t))??{...t,queue:[]}}function en(e,t,n,r){let i=I(e,t,r),a=$t(e,i);return a.queue.some(e=>e.id===n.id)?(Y.set(Gt(e,i,n.id),n),q(e,a),J(e,a),!0):!1}function tn(e,t,n,r){let i=I(e,t,r);Y.delete(Gt(e,i,n));let a=$t(e,i);q(e,a),J(e,a)}function nn(e){wn.add(e);for(let t of G(e)){let n=x(e,t.sessionKey,t.agentId),r=Object.hasOwn(e.chatQueueByScope??{},L(t));(n||r)&&q(e,t)}return()=>wn.delete(e)}function rn(e,t,n,r,i,a){let o=t.trim(),s=!!(n&&n.length>0);if(!o&&!s)return null;let c={id:ue(),text:o,createdAt:Date.now(),attachments:s?ke(n??[]):void 0,refreshSessions:r,localCommandArgs:i?.args,localCommandName:i?.name,sessionKey:e.sessionKey,agentId:C(e,e.sessionKey),...a?{sender:a}:{}};return e.chatQueue=[...e.chatQueue,c],c}function an(e,t,n,r,i){let a=t.trim(),o=!!(r&&r.length>0);!a&&!o||(e.chatQueue=[...e.chatQueue,{id:ue(),text:a,createdAt:Date.now(),kind:`steered`,attachments:o?ke(r??[]):void 0,pendingRunId:n,...i?{sender:i}:{}}])}function on(e,t,n){let r=I(e,t,n);return x(e,r.sessionKey,r.agentId)?e.chatQueue:e.chatQueueByScope?.[L(r)]??[]}function sn(e,t,n,r,i,a){let o=on(e,t,a);return o.some(e=>e.id===n&&e.pendingRunId===r)?(cn(e,t,o.map(e=>e.id===n&&e.pendingRunId===r?i:e),a),!0):!1}function cn(e,t,n,r){let i=I(e,t,r);if(x(e,i.sessionKey,i.agentId)){e.chatQueue=n;return}let a=L(i),o={...e.chatQueueByScope};n.length>0?o[a]=n:delete o[a],e.chatQueueByScope=o,e.requestUpdate?.()}function ln(e,t){if(e.chatQueue.some(e=>e.id===t))return{active:!0,queue:e.chatQueue};for(let[n,r]of Object.entries(e.chatQueueByScope??{}))if(r.some(e=>e.id===t))return{active:!1,queue:r,scopeKey:n};return null}function un(e,t,n){if(t.active){e.chatQueue=n;return}if(!t.scopeKey)return;let r={...e.chatQueueByScope};n.length?r[t.scopeKey]=n:delete r[t.scopeKey],e.chatQueueByScope=r,e.requestUpdate?.()}function dn(e,t){return ln(e,t)?.queue.find(e=>e.id===t)??Yt(e,t)?.queue.find(e=>e.id===t)??null}function fn(e,t,n){return mn(e,e.sessionKey,t,n)}function pn(e,t,n){let r=ln(e,t),i=r?.queue.find(e=>e.id===t);if(!r||!i)return null;zt(e,t),Ht(e,t);let a=n(i);return un(e,r,r.queue.map(e=>e.id===t?a:e)),a}function mn(e,t,n,r,i){let a=ln(e,n),o=Yt(e,n),s=o??I(e,t,i),c=a?.queue??on(e,s.sessionKey,s.agentId),l=o?.queue.find(e=>e.id===n),u=c.find(e=>e.id===n)??l;if(!u)return null;let d=c.length||!o?c:o.queue,f=r(u);if(o&&!St(e,o.sessionKey,u,f,o.agentId??u.agentId??f.agentId)){qt(f)||Jt(e,s,f);let t=Zt(e,o);return q(e,t),J(e,t),null}Jt(e,s,f);let p=d.map(e=>e.id===n?f:e);if(a?un(e,a,p):cn(e,s.sessionKey,p,s.agentId),o){let t=Zt(e,o);J(e,{...t,queue:t.queue.map(e=>e.id===n?f:e)})}return f}function hn(e,t,n){if(!xt(e,t,n,n.agentId))return n.sendState===`failed`&&zt(e,n.id),!1;Bt(e,n.id),Ut(e,n.id);let r=Yt(e,n.id);return r?(J(e,r),!0):!1}function gn(e,t,n=e.sessionKey,r){let i=ln(e,t),a=Yt(e,t),o=a??I(e,n,r),s=i?.queue??on(e,o.sessionKey,o.agentId),c=a?.queue.find(e=>e.id===t)??null,l=s.find(e=>e.id===t)??c,u=s.length||!a?s:a.queue;if(l&&a&&!Ct(e,a.sessionKey,t,l,a.agentId??l.agentId)){let t=Zt(e,a);return q(e,t),J(e,t),null}l&&Y.delete(Gt(e,o,l.id));let d=u.filter(e=>e.id!==t);return i?un(e,i,d):cn(e,o.sessionKey,d,o.agentId),a&&J(e,Zt(e,a)),l&&(Bt(e,t),Ut(e,t)),l}function _n(e,t,n){return gn(e,t)??(n?gn(e,t,n):null)}function vn(e,t){if(!t?.length)return t?[]:void 0;let n=new Set((e.chatAttachments??[]).map(e=>e.id));return t.filter(e=>!n.has(e.id))}function yn(e,t){let n=gn(e,t);n&&j(vn(e,n.attachments))}function bn(e,t){let n=xn(e,t);if(!n)return null;let r=gn(e,n.item.id,n.outbox.sessionKey,n.outbox.agentId);return r?(j(vn(e,r.attachments)),r):null}function xn(e,t){return t?G(e).flatMap(e=>e.queue.map(t=>({item:t,outbox:e}))).find(({item:e})=>e.sendRunId===t)??null:null}function Sn(e,t){if(!t)return;let n=e.chatQueue.filter(e=>e.pendingRunId===t);e.chatQueue=e.chatQueue.filter(e=>e.pendingRunId!==t);for(let t of n)j(vn(e,t.attachments))}function Cn(e){let t=[...e.chatQueue,...Object.values(e.chatQueueByScope??{}).flat()];for(let n of t)if(!(!n.sendRunId||n.sendState!==`sending`&&n.sendState!==`waiting-idle`)){if(Vt(e,n.id)){pn(e,n.id,e=>({...e,sendState:`unconfirmed`}));continue}mn(e,n.sessionKey??e.sessionKey,n.id,e=>({...e,sendState:`waiting-reconnect`}),n.agentId)}}var wn,Y,X,Z,Tn=e((()=>{u(),he(),A(),Rt(),wn=new Set,Y=new Map,X=new WeakMap,Z=new WeakMap}));function En(e){let t=/^data:([^;]+);base64,(.+)$/.exec(e);if(!t)return null;let n=t[1],r=t[2];return n&&r?{mimeType:n,content:r}:null}function Dn(e){return e?.length?e.map(e=>{let t=De(e),n=t?En(t):null;return n?{type:n.mimeType.startsWith(`image/`)?`image`:`file`,mimeType:n.mimeType,fileName:e.fileName,content:n.content}:null}).filter(e=>e!==null):void 0}function On(e){return e?.length?e.flatMap(e=>{if(!e||typeof e!=`object`)return[];let t=e,n=typeof t.mimeType==`string`?t.mimeType.trim():``,r=typeof t.content==`string`?t.content:``;return!/^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/i.test(n)||!/^[A-Za-z0-9+/]+={0,2}$/.test(r)?[]:[{id:ue(),dataUrl:`data:${n};base64,${r}`,mimeType:n,fileName:typeof t.fileName==`string`?t.fileName:void 0}]}):[]}var kn=e((()=>{he(),A()}));function An(e){return e.sessionsResult?.sessions?.find(t=>t.key===e.sessionKey)}function jn(e){let t=e.chatModelCatalog??[],n=e.modelOverrides;if(Object.hasOwn(n,e.sessionKey)){let r=n[e.sessionKey];return r==null?``:oe(ae(r),t)}let r=An(e);return m(r?.model,r?.modelProvider,t)}function Mn(e){return m(e.agentDefaultModel,void 0,e.chatModelCatalog??[])||m(e.sessionsResult?.defaults?.model,e.sessionsResult?.defaults?.modelProvider,e.chatModelCatalog??[])}function Q(e){let t=e.trim().toLowerCase(),n=t.indexOf(`/`);return n<=0?t:`${g(t.slice(0,n))}/${t.slice(n+1)}`}function Nn(e,t){let n=new Set(e.filter(e=>e.available!==!1).map(e=>Q(w(e,t).value)));return new Set(e.filter(e=>e.available===!1).map(e=>Q(w(e,t).value)).filter(e=>!n.has(e)))}function Pn(e,t,n){let r=e.trim().toLowerCase();if(!r)return e;for(let e of t){if(e.available===!1)continue;let t=w(e,n);if(t.value.trim().toLowerCase()===r)return t.value}let i=Q(e);for(let e of t){if(e.available===!1)continue;let t=w(e,n);if(Q(t.value)===i)return t.value}return e}function Fn(e,t,n,r){let i=new Set,a=[],o=Nn(e,t),s=(e,t)=>{Ne(a,i,e,e=>t??e)},c=(e,t)=>{o.has(Q(e))||s(e,t)};for(let n of e){if(n.available===!1)continue;let e=w(n,t);s(e.value,e.label)}return n&&c(n,d(n,t)),r&&c(r,d(r,t)),a}function In(e){let t=e.chatModelCatalog??[],n=ye(t.filter(e=>e.available!==!1)),r=Pn(jn(e),t,n),i=Pn(Mn(e),t,n),a=d(i,n),o=Nn(t,n);return{currentOverride:r,defaultSelectable:!i||!o.has(Q(i)),defaultModel:i,defaultDisplay:a,defaultLabel:i?`Default (${a})`:`Default model`,options:Fn(t,n,r,i)}}function Ln(e){if(e===`auto`)return`auto`;if(e===`on`)return!0;if(e===`off`)return!1}function Rn(e){return je({mode:e?.effectiveFastMode??e?.fastMode,source:e?.effectiveFastModeSource,fastAutoOnSeconds:e?.fastAutoOnSeconds})}function zn(e,t,n){let r=e.trim();if(!r)return null;let i=r.toLowerCase(),a=new Set(t.filter(e=>e.id.trim().toLowerCase()===i).map(e=>g(e.provider)).filter(Boolean)),o=new Set(t.filter(e=>E(e.id,e.provider).trim().toLowerCase()===i).map(e=>g(e.provider)).filter(Boolean));return o.size===1?[...o][0]??null:n&&a.has(n)&&!o.has(n)?n:a.size===1?[...a][0]??null:null}function Bn(e,t){let n=e.trim().toLowerCase();return n?t.some(e=>{let t=e.id.trim().toLowerCase(),r=E(e.id,e.provider).trim().toLowerCase();return t===n||r===n}):!1}function Vn(e){let t=e.sessionsResult?.sessions?.find(t=>t.key===e.sessionKey),n=g(t?.modelProvider??``)||null,r=g(e.sessionsResult?.defaults?.modelProvider??``)||null,i=Bn(e.currentModelOverride,e.catalog),a=!e.currentModelOverride||!i?n??r:null,o=zn(e.currentModelOverride,e.catalog,n)??a??null,s=t?.fastMode===`auto`?`auto`:t?.fastMode===!0?`on`:t?.fastMode===!1?`off`:``,c=o===`openai`,l=t?.effectiveFastMode??t?.fastMode,u=c?l===!0?`on`:l===`auto`?`auto`:`off`:s,d=!!(o&&Hn.has(o)),f=d||!!s,p=l===!0||l===`auto`,m=l===`auto`?`Auto`:p?`Fast`:c||u===`off`?`Standard`:`Default`,h=d?p?`off`:`on`:``;return{active:p,currentOverride:u,disabled:!f||!e.connected||e.loading||e.sending||!!e.activeRunId||e.stream!==null||!e.gatewayAvailable,label:m,nextValue:h,supported:f}}var Hn,Un=e((()=>{Ae(),Ie(),ve(),Hn=new Set([`anthropic`,`minimax`,`minimax-portal`,`openai`,`xai`])}));function Wn(e){$&&=(globalThis.clearTimeout($.timer),e&&j($.item.attachments??[]),null)}function Gn(e,t){Wn(!0),$={item:t,sessionKey:e,timer:globalThis.setTimeout(()=>Wn(!0),Jn)}}function Kn(e){if(!$||!ie($.sessionKey,e))return null;let t=$.item;return Wn(!1),t}function qn(e,t){let n=Kn(t);if(!n)return!1;let r=on(e,t,n.agentId);return r.some(e=>e.id===n.id)||cn(e,t,[...r,n],n.agentId),zt(e,n.id),Ht(e,n.id),!0}var Jn,$,Yn=e((()=>{_(),A(),Tn(),Jn=6e4,$=null}));function Xn(e){return Array.from(e?.types??[]).includes(`Files`)}function Zn(e){let t=e.target;if(!(t instanceof Element))return!1;let n=t.closest(`textarea, input, [contenteditable]`);return n instanceof HTMLInputElement?kr.has(n.type)&&!n.disabled&&!n.readOnly:n instanceof HTMLTextAreaElement?!n.disabled&&!n.readOnly:n instanceof HTMLElement&&n.isContentEditable}function Qn(e){return e.getAttachments?.()??e.attachments??[]}function $n(e){return e.type.startsWith(`video/`)?!1:!/\.(?:avi|m4v|mov|mp4|mpeg|mpg|webm)$/i.test(e.name)}function er(e,t){e.closest(`details`)?.removeAttribute(`open`),e.closest(`.agent-chat__composer-shell, .new-session-page__composer`)?.querySelector(t)?.click()}function tr(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function nr(e,t){return Ee({attachment:{id:tr(),mimeType:e.type||`application/octet-stream`,fileName:e.name||void 0,sizeBytes:e.size},dataUrl:t,file:e})}function rr(e){return Dr.has(e)}function ir(e){let t=new TextEncoder().encode(e),n=[],r=32768;for(let e=0;e<t.length;e+=r)n.push(String.fromCharCode(...t.subarray(e,e+r)));return`data:${wr};base64,${btoa(n.join(``))}`}function ar(e){let t=nr(new File([e],`${Tr}${Date.now()}.txt`,{type:wr}),ir(e));Dr.add(t);let n=sr(e);return n&&Or.set(t,n),t}function or(e){let t=/^data:([^,]*),(.*)$/s.exec(e);if(!t)return null;let n=t[1],r=t[2];if(n===void 0||r===void 0)return null;if(n.toLowerCase().includes(`;base64`))try{let e=atob(r),t=Uint8Array.from(e,e=>e.charCodeAt(0));return new TextDecoder().decode(t)}catch{return null}try{return decodeURIComponent(r.replace(/\+/g,`%20`))}catch{return null}}function sr(e){let t=e.replace(/\s+/gu,` `).trim();return t?t.length<=Er?t:`${c(t,Er).trimEnd()}...`:null}function cr(e){return Or.get(e)??e.fileName??`Attached file`}function lr(e,t){return e.trim()?`${e.replace(/\s+$/u,``)}\n\n${t}`:t}function ur(e,t){if(!t.onAttachmentsChange)return!1;let n=e.clipboardData?.getData(`text/plain`);if(!n||n.length<=Cr)return!1;e.preventDefault();let r=ar(n);return t.onAttachmentsChange([...Qn(t),r]),!0}function dr(e,t=`pasted-image`){let n=/^\s*data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/=\s]+)\s*$/i.exec(e);if(!n)return null;let r=n[1]?.toLowerCase(),i=n[2];if(!r||!i||!$n({name:t,type:r}))return null;let a=i.replace(/\s+/g,``);try{let e=atob(a),n=new Uint8Array(e.length);for(let t=0;t<e.length;t++)n[t]=e.charCodeAt(t);let i=r.split(`/`)[1]?.replace(/[^a-z0-9.+-]/gi,``)||`png`;return{file:new File([n],`${t}.${i}`,{type:r}),dataUrl:`data:${r};base64,${a}`}}catch{return null}}function fr(e,t){let n=dr(e,t.replace(/\.[a-z0-9]+$/i,``)||`image`);return n?nr(n.file,n.dataUrl):null}function pr(e,t){return t.readSignal?.aborted?Promise.resolve(null):(t.onPendingReadsChange?.(1),new Promise(n=>{let r=new FileReader,i=!1,a=e=>{i||(i=!0,t.readSignal?.removeEventListener(`abort`,o),t.onPendingReadsChange?.(-1),n(e))},o=()=>{r.abort(),a(null)};t.readSignal?.addEventListener(`abort`,o,{once:!0}),r.addEventListener(`error`,()=>a(null),{once:!0}),r.addEventListener(`abort`,()=>a(null),{once:!0}),r.addEventListener(`load`,()=>{let n=typeof r.result==`string`?r.result:null;a(n&&!t.readSignal?.aborted?nr(e,n):null)},{once:!0}),r.readAsDataURL(e)}))}async function mr(e,t){let n=e.filter($n);if(!t.onAttachmentsChange||n.length===0)return;let r=(await Promise.all(n.map(e=>pr(e,t)))).filter(e=>e!==null);if(t.readSignal?.aborted){for(let e of r)Oe(e.id);return}r.length!==0&&t.onAttachmentsChange([...Qn(t),...r])}function hr(e,t){let n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;let r=Array.from(n).filter(e=>e.type.startsWith(`image/`)).map(e=>e.getAsFile()).filter(e=>e!==null);if(r.length===0){let n=e.clipboardData?.getData(`text/plain`),r=n?dr(n):null;if(!r){ur(e,t);return}e.preventDefault(),t.onAttachmentsChange([...Qn(t),nr(r.file,r.dataUrl)]);return}e.preventDefault(),mr(r,t)}function gr(e,t){let n=De(e),r=n?or(n):null;if(!r||!t.onDraftChange)return;let i=Qn(t).filter(t=>t.id!==e.id);Oe(e.id),t.onAttachmentsChange?.(i),t.onDraftChange(lr(t.getDraft?.()??t.draft??``,r)),t.onRequestUpdate?.()}function _r(e,t){let n=e.target,r=[...n.files??[]];n.value=``,mr(r,t)}function vr(e,t){e.preventDefault(),mr([...e.dataTransfer?.files??[]],t)}function yr(e){return n`
    <input
      type="file"
      accept=${Sr}
      multiple
      class="agent-chat__file-input"
      ?disabled=${e.disabled}
      @change=${t=>{e.disabled||_r(t,e)}}
    />
    <input
      type="file"
      accept="image/*"
      multiple
      class="agent-chat__photo-input"
      ?disabled=${e.disabled}
      @change=${t=>{e.disabled||_r(t,e)}}
    />
    <input
      type="file"
      accept="image/*"
      capture="environment"
      class="agent-chat__camera-input"
      ?disabled=${e.disabled}
      @change=${t=>{e.disabled||_r(t,e)}}
    />
  `}function br(e){return n`
    <wa-dropdown
      class="agent-chat__attach-menu"
      placement="top-start"
      aria-label=${D(`chat.composer.addAttachment`)}
      @wa-select=${e=>{let t=e.currentTarget,n=e.detail.item.value===`camera`?`.agent-chat__camera-input`:e.detail.item.value===`photo`?`.agent-chat__photo-input`:e.detail.item.value===`file`?`.agent-chat__file-input`:null;n&&er(t,n)}}
    >
      <button
        slot="trigger"
        type="button"
        class="agent-chat__input-btn agent-chat__input-btn--attach"
        aria-label=${D(`chat.composer.addAttachment`)}
        ?disabled=${e.disabled}
        title=${D(`chat.composer.addAttachment`)}
        @pointerdown=${e=>{let t=e.currentTarget.closest(`.agent-chat__composer-shell`)?.querySelector(`textarea`);document.activeElement===t&&e.preventDefault()}}
      >
        ${O.plus}
      </button>
      <wa-dropdown-item class="agent-chat__attach-menu-option" value="camera">
        <span slot="icon" aria-hidden="true">${O.camera}</span>
        <span>${D(`chat.composer.takePhoto`)}</span>
      </wa-dropdown-item>
      <wa-dropdown-item class="agent-chat__attach-menu-option" value="photo">
        <span slot="icon" aria-hidden="true">${O.image}</span>
        <span>${D(`chat.composer.attachPhoto`)}</span>
      </wa-dropdown-item>
      <wa-dropdown-item class="agent-chat__attach-menu-option" value="file">
        <span slot="icon" aria-hidden="true">${O.folder}</span>
        <span>${D(`chat.composer.attachFileOption`)}</span>
      </wa-dropdown-item>
    </wa-dropdown>
  `}function xr(e){let t=e.attachments??[];return t.length===0?i:n`
    <div class="chat-attachments-preview">
      ${t.map(t=>n`
          <div
            class=${[`chat-attachment-thumb`,t.mimeType.startsWith(`image/`)?``:`chat-attachment-thumb--file`,rr(t)?`chat-attachment-thumb--pasted-text`:``].filter(Boolean).join(` `)}
          >
            ${t.mimeType.startsWith(`image/`)&&Te(t)?n`<img src=${Te(t)} alt="Attachment preview" />`:rr(t)?n`
                    <div class="chat-attachment-file chat-attachment-file--pasted-text">
                      <span class="chat-attachment-file__icon">${O.fileText}</span>
                      <span class="chat-attachment-file__body">
                        <span class="chat-attachment-file__name">${cr(t)}</span>
                        <button
                          class="chat-attachment-text-action"
                          type="button"
                          aria-label=${D(`worktrees.restore`)}
                          ?disabled=${e.disabled}
                          @click=${()=>gr(t,e)}
                        >
                          ${D(`worktrees.restore`)}
                          <span aria-hidden="true">${O.chevronRight}</span>
                        </button>
                      </span>
                    </div>
                  `:n`
                    <openclaw-tooltip .content=${t.fileName??`Attached file`}>
                      <div class="chat-attachment-file">
                        <span class="chat-attachment-file__icon">${O.paperclip}</span>
                        <span class="chat-attachment-file__name"
                          >${t.fileName??`Attached file`}</span
                        >
                      </div>
                    </openclaw-tooltip>
                  `}
            <openclaw-tooltip .content=${D(`chat.composer.removeAttachment`)}>
              <button
                class="chat-attachment-remove"
                type="button"
                aria-label=${D(`chat.composer.removeAttachment`)}
                ?disabled=${e.disabled}
                @click=${()=>{let n=Qn(e).filter(e=>e.id!==t.id);Oe(t.id),e.onAttachmentsChange?.(n)}}
              >
                ${O.x}
              </button>
            </openclaw-tooltip>
          </div>
        `)}
    </div>
  `}var Sr,Cr,wr,Tr,Er,Dr,Or,kr,Ar=e((()=>{s(),r(),Ce(),Se(),k(),xe(),A(),Sr=`image/*,audio/*,application/pdf,text/*,.csv,.json,.md,.txt,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx`,Cr=1e3,wr=`text/plain`,Tr=`pasted-text-`,Er=20,Dr=new WeakSet,Or=new WeakMap,kr=new Set([`email`,`number`,`password`,`search`,`tel`,`text`,`url`])}));function jr(e){return re(e.assistantAvatarUrl,{identity:{avatar:e.assistantAvatar??void 0,avatarUrl:e.assistantAvatarUrl??void 0}})}function Mr(e){return jr(e)??ne(e.assistantAvatar)}function Nr(e){if(!e.sessions)return[];let t=me(e.sessionHost??{}),n=S(e.sessionKey)?.agentId??t;return ge(e.sessions,{agentId:n,defaultAgentId:t,filterByAgent:!0}).filter(t=>!ie(t.key,e.sessionKey)&&!se(t.key,t.channel).channelSession).toSorted((e,t)=>(t.updatedAt??0)-(e.updatedAt??0)||e.key.localeCompare(t.key)).slice(0,Br)}function Pr(){return n`
    <div class="agent-chat__welcome-clawd" aria-hidden="true">
      <openclaw-mascot mood="idle" .size=${112}></openclaw-mascot>
    </div>
  `}function Fr(e,r){return n`
    <div class="agent-chat__recents">
      <div class="agent-chat__recents-title">${D(`chat.welcome.recentSessions`)}</div>
      ${e.map(e=>{let a=h(e);return n`
          <button type="button" class="agent-chat__recent" @click=${()=>r?.(e.key)}>
            <span class="agent-chat__recent-name">${ee(e.key,e)}</span>
            ${a?n`<span class="agent-chat__recent-sub">${a}</span>`:i}
            <span class="agent-chat__recent-time">
              ${t(e.updatedAt,{fallback:``})}
            </span>
          </button>
        `})}
    </div>
  `}function Ir(e){return n`
    <div class="agent-chat__suggestions">
      ${zr.map(t=>{let r=D(t);return n`
          <button
            type="button"
            class="agent-chat__suggestion"
            @click=${()=>{e.onDraftChange(r),e.onSend()}}
          >
            ${r}
          </button>
        `})}
    </div>
  `}function Lr(e){let t=e.assistantName||`Assistant`,r=jr(e),i=r?null:ne(e.assistantAvatar);return n`
    ${r?n`<img class="agent-chat__welcome-avatar" src=${r} alt=${t} />`:i?n`<div class="agent-chat__avatar agent-chat__avatar--text" aria-label=${t}>
            ${i}
          </div>`:Pr()}
    <h2>${t}</h2>
    <p class="agent-chat__hint">${e.hint}</p>
  `}function Rr(e){let t=Nr(e),r=0,a=e=>{let t=e.currentTarget;return t instanceof HTMLElement?t.querySelector(`.agent-chat__welcome-clawd openclaw-mascot`):null};return n`
    <div
      class="agent-chat__welcome"
      style="--agent-color: var(--accent)"
      @dragenter=${e=>{if(!Array.from(e.dataTransfer?.types??[]).includes(`Files`))return;r+=1;let t=a(e);t&&(t.tease=!0)}}
      @dragleave=${e=>{r=Math.max(0,r-1);let t=a(e);t&&r===0&&(t.tease=!1)}}
      @drop=${e=>{if(!Array.from(e.dataTransfer?.types??[]).includes(`Files`))return;r=0;let t=a(e);t&&(t.tease=!1,t.catchOnce())}}
    >
      ${Lr({assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,assistantAvatarUrl:e.assistantAvatarUrl,hint:e.hint??n`${D(`chat.welcome.hintBeforeShortcut`)} <kbd>/</kbd> ${D(`chat.welcome.hintAfterShortcut`)}`})}
      ${e.composer??i}
      ${t.length>0?Fr(t,e.onOpenSession):Ir(e)}
    </div>
  `}var zr,Br,Vr=e((()=>{r(),we(),xe(),fe(),f(),p(),pe(),_(),zr=[`chat.welcome.suggestions.whatCanYouDo`,`chat.welcome.suggestions.summarizeRecentSessions`,`chat.welcome.suggestions.configureChannel`,`chat.welcome.suggestions.checkSystemHealth`],Br=5}));function Hr(e,t){e.preventDefault(),e.stopPropagation();let n=e.currentTarget.closest(`.chat-controls__inline-select-menu--combined`);n instanceof HTMLElement&&(n.querySelectorAll(`[data-chat-model-provider]`).forEach(e=>{e.setAttribute(`aria-pressed`,e.dataset.chatModelProvider===t?`true`:`false`)}),n.querySelectorAll(`[data-chat-model-provider-group]`).forEach(e=>{e.hidden=e.dataset.chatModelProviderGroup!==t}))}var Ur=e((()=>{}));function Wr(e){let t=g(e);return ei[t]??t}function Gr(e){return Le(g(e),{className:`chat-controls__provider-icon`})}function Kr(e,t,n=``,r=``){let i=(e||n).trim(),a=i.toLowerCase(),o=t.find(e=>{let t=e.id.trim().toLowerCase();return`${g(e.provider)}/${t}`===a});if(o)return Wr(o.provider);let s=t.filter(e=>e.id.trim().toLowerCase()===a),c=g(r),l=s.some(e=>g(e.provider)===c);if(c&&(s.length===0||l))return Wr(c);if(s.length===1)return Wr(s[0]?.provider??``);let u=i.indexOf(`/`);return u>0?Wr(i.slice(0,u)):`other`}function qr(e,t,n){let r=e.trim().toLowerCase(),i=r.indexOf(`/`),a=i>0?`${g(r.slice(0,i))}/${r.slice(i+1)}`:r;if(!a)return t;let o=n.filter(e=>`${g(e.provider)}/${e.id.trim().toLowerCase()}`===a),s=o.find(e=>e.provider.trim().toLowerCase()===`openai`)??o[0];return s&&g(s.provider)===`openai`&&s.name.trim()||t}function Jr(e){let{currentOverride:t,defaultSelectable:n,defaultModel:r,defaultLabel:i,options:a}=In({agentDefaultModel:e.agentDefaultModel,chatModelCatalog:e.modelCatalog,modelOverrides:e.modelOverrides??{},sessionKey:e.sessionKey,sessionsResult:e.sessionsResult}),o=Fe({catalog:e.modelCatalog,defaults:e.thinkingDefaults,session:e.thinkingSession,sessionKey:e.sessionKey,sessionsResult:e.sessionsResult}),s=Vn({activeRunId:e.activeRunId,catalog:e.modelCatalog,connected:e.connected,currentModelOverride:t,gatewayAvailable:e.gatewayAvailable,loading:e.loading,sending:e.sending,sessionKey:e.sessionKey,sessionsResult:e.sessionsResult,stream:e.stream}),c=e.modelSwitching?{...s,disabled:!0}:s,l=e.sessionsResult?.sessions.find(t=>ie(t.key,e.sessionKey))?.modelProvider??``,u=e.sessionsResult?.defaults?.modelProvider??``,d=qr(r,i,e.modelCatalog),f=r&&d!==i?`Default (${d})`:i,p=r.trim().toLowerCase(),m=a.map(r=>{let i=n&&r.value.trim().toLowerCase()===p;return{commitValue:i?``:r.value,isDefault:i,value:r.value,label:qr(r.value,r.label,e.modelCatalog),provider:Kr(r.value,e.modelCatalog,``,i?u:r.value===t?l:``)}}),h=e.modelSelectionRuntimeId?.trim().toLowerCase()===`codex`?D(`chat.selectors.nativeCodexModel`):D(`chat.selectors.lockedSessionModel`),g=e.modelSelectionLocked===!0?h:m.find(e=>e.value===t)?.label??qr(t,t||f,e.modelCatalog),ee=o.currentOverride===``?o.defaultLabel:o.options.find(e=>e.value===o.currentOverride)?.label??o.currentOverride,te=e.loading||e.sending||!!e.activeRunId||e.stream!==null,_=!e.connected||te||e.modelSwitching||e.modelsLoading&&a.length===0||!e.gatewayAvailable,v=!e.connected||te||e.modelSwitching||!e.gatewayAvailable||o.options.length===0&&o.currentOverride===``;return $r({defaultModelLabel:Yr(f),disabled:_,fastMode:c,modelSelectionLocked:e.modelSelectionLocked===!0,modelOptions:m,onRequestUpdate:e.onRequestUpdate,selectedModelValue:t,selectedThinkingValue:o.currentOverride,sessionKey:e.sessionKey,showFastMode:e.showFastMode!==!1,thinkingDefaultValue:o.defaultValue,thinkingDisabled:v,thinkingOptions:[{value:``,label:o.defaultLabel},...o.options],triggerModelLabel:g,triggerThinkingLabel:ee,onFastModeSelect:async(t,n)=>e.onFastModeSelect?.(t,n),onModelSelect:async(t,n)=>e.onModelSelect?.(t,n),onThinkingSelect:async(t,n)=>e.onThinkingSelect?.(t,n)})}function Yr(e){return/^Default \((.+)\)$/u.exec(e)?.[1]??e}function Xr(e){let t=e.label,n=[Be(e.provider),ze(e.provider)].toSorted((e,t)=>t.length-e.length);for(let e of n)if(t.toLowerCase().startsWith(`${e.toLowerCase()} `))return t.slice(e.length+1);return t}function Zr(e){return e.replace(/^Inherited:\s*/u,``)}function Qr(e){return n`
    <div class="chat-controls__model-provenance">
      <span class="chat-controls__inline-select-section-label">
        ${D(`chat.selectors.modelSection`)}
      </span>
      <span class="chat-controls__model-provenance-state">
        <span
          class="chat-controls__model-provenance-value ${e.hasModelOverride?``:`chat-controls__model-provenance-value--inherit`}"
        >
          ${e.hasModelOverride?D(`chat.modelControls.sessionOverride`):D(`chat.modelControls.usingDefault`)}
        </span>
        ${e.hasModelOverride?n`
              <openclaw-tooltip
                .content=${D(`chat.modelControls.resetToDefault`,{model:e.defaultModelLabel})}
              >
                <button
                  class="chat-controls__model-reset"
                  data-chat-model-reset="true"
                  type="button"
                  aria-label=${D(`chat.modelControls.resetToDefault`,{model:e.defaultModelLabel})}
                  ?disabled=${e.disabled}
                  @click=${t=>{if(t.stopPropagation(),e.disabled){t.preventDefault();return}e.onReset()}}
                >
                  ${O.x}
                </button>
              </openclaw-tooltip>
            `:``}
      </span>
    </div>
  `}function $r(e){let{defaultModelLabel:t,disabled:r,fastMode:o,modelSelectionLocked:s,modelOptions:c,selectedModelValue:l,selectedThinkingValue:u,sessionKey:d,showFastMode:f,thinkingDefaultValue:p,thinkingDisabled:m,thinkingOptions:h,triggerModelLabel:g,triggerThinkingLabel:ee,onFastModeSelect:te,onModelSelect:_,onRequestUpdate:v,onThinkingSelect:ne}=e,re=Yr(g),y=`${re} · ${Zr(ee)}`,ie=y,b=h.filter(e=>e.value!==``),ae=b.findIndex(e=>e.value===p),x=u!==``,oe=b.findIndex(e=>e.value===u),se=Math.max(x?oe:ae,0),S=!x&&ae<0,ce=e=>b.length>1?e/(b.length-1)*100:0,C=Pe(p),w=h.find(e=>e.value===u),le=x?Zr(w?.label??Pe(u)):C,ue=x?le:`Default (${C})`,de=e=>{s||(_(e,d).finally(()=>v?.()),v?.())},fe=e=>{ne(e,d).finally(()=>v?.()),v?.()},pe=e=>{te(e,d).finally(()=>v?.()),v?.()},me=o.supported?`Fast responses finish sooner and can use more of your usage limits.`:`Speed control is not supported for this model.`,he=e=>{let t=e.currentTarget,n=b[Number(t.value)];n&&(t.style.setProperty(`--reasoning-fill`,`${ce(Number(t.value))}%`),t.setAttribute(`aria-valuetext`,Zr(n.label)))},ge=e=>{if(m)return;let t=e.currentTarget,n=b[Number(t.value)];!n||n.value===u||fe(n.value)},T=e=>{let t=e.currentTarget;!S||Number(t.value)!==se||ge(e)},_e=e=>{!S||![`Home`,`ArrowLeft`,`ArrowDown`,`PageDown`].includes(e.key)||ge(e)},ve=b.length>0,E=b.length===1?b[0]:void 0,ye=u||p,be=E?.value===ye,xe=ve||f,Se=new Map;for(let e of c){let t=Se.get(e.provider);t?t.push(e):Se.set(e.provider,[e])}let Ce=c.find(e=>e.isDefault),k=[...Se],we=k.findIndex(([e])=>e===Ce?.provider);if(we>0){let[e]=k.splice(we,1);e&&k.unshift(e)}let A=((l===``?Ce:c.find(e=>e.value===l))??c[0])?.provider??k[0]?.[0]??`other`,j=e=>{let t=e.value===l||e.isDefault&&l===``,a=Xr(e);return n`
      <div class="chat-controls__combined-model">
        <openclaw-tooltip .content=${e.label}>
          <button
            class="chat-controls__inline-select-option chat-controls__combined-model-option ${t?`chat-controls__inline-select-option--selected`:``}"
            data-chat-model-option=${e.value}
            data-chat-model-default=${e.isDefault?`true`:i}
            role="option"
            aria-selected=${t?`true`:`false`}
            type="button"
            ?disabled=${r||s}
            @click=${t=>{if(t.stopPropagation(),r||s||e.commitValue===l){t.preventDefault();return}de(e.commitValue)}}
          >
            <span class="chat-controls__model-option-copy">
              <span class="chat-controls__model-option-title">
                <span class="chat-controls__model-option-name">${a}</span>
                ${e.isDefault?n`<span class="chat-controls__model-default-label"
                      >${D(`chat.modelControls.default`)}</span
                    >`:``}
              </span>
              <span class="chat-controls__model-option-provider">
                ${ze(e.provider)}
              </span>
            </span>
            ${t?n`
                  <span class="chat-controls__inline-select-check" aria-hidden="true">
                    ${O.check}
                  </span>
                `:``}
          </button>
        </openclaw-tooltip>
      </div>
    `};return n`
    <details class="chat-controls__session chat-controls__inline-select chat-controls__model">
      <summary
        class="chat-controls__inline-select-trigger ${r?`chat-controls__inline-select-trigger--disabled`:``}"
        data-chat-model-select="true"
        data-chat-model-locked=${s?`true`:`false`}
        data-chat-thinking-select="true"
        data-chat-select-value=${l}
        data-chat-thinking-value=${u}
        data-chat-thinking-disabled=${m?`true`:`false`}
        aria-label="${D(`chat.selectors.model`)}, ${D(`chat.selectors.thinkingLevel`)}: ${y}"
        aria-disabled=${r?`true`:`false`}
        @click=${e=>{r&&e.preventDefault()}}
      >
        <span class="chat-controls__inline-select-label">${ie}</span>
        <span class="chat-controls__inline-select-icon" aria-hidden="true">
          ${O.chevronDown}
        </span>
      </summary>
      <div
        class="chat-controls__inline-select-menu chat-controls__inline-select-menu--combined"
        aria-label=${D(`chat.selectors.model`)}
      >
        ${s?n`
              <div
                class="chat-controls__locked-model"
                aria-label=${D(`chat.selectors.modelLockedLabel`)}
              >
                <span class="chat-controls__inline-select-section-label">
                  ${D(`chat.selectors.modelSection`)}
                </span>
                <span class="chat-controls__locked-model-value">${re}</span>
                <span class="chat-controls__locked-model-badge">
                  ${D(`chat.selectors.modelLocked`)}
                </span>
              </div>
            `:n`
              ${Qr({defaultModelLabel:t,disabled:r,hasModelOverride:l!==``,onReset:()=>de(``)})}
              <div class="chat-controls__model-browser">
                <div class="chat-controls__provider-list" aria-label=${D(`sessionsView.provider`)}>
                  <div class="chat-controls__inline-select-section-label">
                    ${D(`sessionsView.provider`)}
                  </div>
                  ${a(k,([e])=>e,([e])=>n`
                        <button
                          class="chat-controls__provider-option"
                          data-chat-model-provider=${e}
                          type="button"
                          aria-pressed=${e===A?`true`:`false`}
                          @click=${t=>Hr(t,e)}
                        >
                          ${Gr(e)}
                          <span>${ze(e)}</span>
                        </button>
                      `)}
                </div>
                <div
                  class="chat-controls__provider-models"
                  role="listbox"
                  aria-label=${D(`chat.selectors.model`)}
                >
                  ${a(k,([e])=>e,([e,t])=>n`
                      <div
                        class="chat-controls__provider-model-group"
                        data-chat-model-provider-group=${e}
                        aria-label=${`${ze(e)} models`}
                        ?hidden=${e!==A}
                      >
                        ${a(t,e=>e.value,e=>j(e))}
                      </div>
                    `)}
                </div>
              </div>
            `}
        ${xe?n`
              <div class="chat-controls__reasoning-panel">
                ${ve?n`
                      <div class="chat-controls__reasoning-head">
                        <span class="chat-controls__inline-select-section-label"
                          >${D(`chat.modelControls.reasoning`)}</span
                        >
                        <span class="chat-controls__reasoning-state">
                          <span
                            class="chat-controls__reasoning-value ${x?``:`chat-controls__reasoning-value--inherit`}"
                          >
                            ${le}
                          </span>
                          ${x?n`
                                <openclaw-tooltip
                                  .content=${`Reset to default (${C})`}
                                >
                                  <button
                                    class="chat-controls__reasoning-reset"
                                    data-chat-thinking-option=""
                                    type="button"
                                    aria-label=${`Use default reasoning (${C})`}
                                    ?disabled=${m}
                                    @click=${e=>{if(e.stopPropagation(),m){e.preventDefault();return}fe(``)}}
                                  >
                                    ${O.x}
                                  </button>
                                </openclaw-tooltip>
                              `:``}
                        </span>
                      </div>
                      ${b.length>1?n`
                            <div class="chat-controls__reasoning-slider">
                              <div class="chat-controls__reasoning-dots" aria-hidden="true">
                                ${b.map((e,t)=>n`<span
                                      class="chat-controls__reasoning-dot ${t===ae?`chat-controls__reasoning-dot--default`:``}"
                                      data-stop=${e.value}
                                    ></span>`)}
                              </div>
                              <input
                                class="chat-controls__reasoning-range ${x?``:`chat-controls__reasoning-range--inherit`} ${S?`chat-controls__reasoning-range--unanchored`:``}"
                                type="range"
                                min="0"
                                max=${b.length-1}
                                step="1"
                                .value=${String(se)}
                                style=${`--reasoning-fill: ${ce(se)}%`}
                                data-chat-thinking-slider="true"
                                data-chat-thinking-values=${b.map(e=>e.value).join(`,`)}
                                aria-label=${D(`chat.selectors.thinkingLevel`)}
                                aria-valuetext=${ue}
                                ?disabled=${m}
                                @input=${he}
                                @change=${ge}
                                @click=${T}
                                @keydown=${_e}
                              />
                            </div>
                          `:E?n`
                              <button
                                class="chat-controls__reasoning-option ${be?`chat-controls__reasoning-option--selected`:``}"
                                data-chat-thinking-option=${E.value}
                                type="button"
                                aria-pressed=${be?`true`:`false`}
                                ?disabled=${m}
                                @click=${e=>{if(e.stopPropagation(),m||be){e.preventDefault();return}fe(E.value)}}
                              >
                                <span>${E.label}</span>
                                ${be?n`
                                      <span
                                        class="chat-controls__inline-select-check"
                                        aria-hidden="true"
                                      >
                                        ${O.check}
                                      </span>
                                    `:``}
                              </button>
                            `:``}
                    `:``}
                ${f?n`
                      <div class="chat-controls__speed-row">
                        <span class="chat-controls__inline-select-section-label"
                          >${D(`chat.modelControls.speed`)}</span
                        >
                        <openclaw-tooltip .content=${me}>
                          <button
                            class="chat-controls__speed-toggle ${o.active?`chat-controls__speed-toggle--active`:``}"
                            data-chat-speed-toggle=${o.nextValue}
                            type="button"
                            role="switch"
                            aria-checked=${o.active?`true`:`false`}
                            aria-label=${`Fast responses: ${o.label}`}
                            ?disabled=${o.disabled}
                            @click=${e=>{if(e.stopPropagation(),o.disabled){e.preventDefault();return}pe(o.nextValue)}}
                          >
                            <span class="chat-controls__speed-toggle-icon" aria-hidden="true">
                              ${O.zap}
                            </span>
                            <span>${o.label}</span>
                          </button>
                        </openclaw-tooltip>
                      </div>
                    `:i}
              </div>
            `:``}
      </div>
    </details>
  `}var ei,ti=e((()=>{r(),o(),Ce(),Se(),Re(),xe(),ve(),Un(),Me(),_(),Ur(),ei={"google-gemini-cli":`google`,"opencode-go":`opencode`,"opencode-zen":`opencode`}}));export{xt as $,an as A,gn as B,Dn as C,Sn as D,hn as E,on as F,q as G,sn as H,xn as I,mn as J,Qt as K,dn as L,Tn as M,Vt as N,tn as O,Cn as P,Pt as Q,bn as R,jn as S,On as T,en as U,_n as V,nn as W,Ft as X,pn as Y,Lt as Z,Yn as _,Mr as a,bt as at,Ln as b,hr as c,L as ct,Xn as d,Je as dt,Rt as et,rr as f,Ge as ft,qn as g,br as h,Ve as ht,Rr as i,vt as it,vn as j,rn as k,Ar as l,qe as lt,yr as m,Ue as mt,Jr as n,_t as nt,fr as o,I as ot,xr as p,We as pt,fn as q,Vr as r,gt as rt,vr as s,wt as st,ti as t,G as tt,Zn as u,Ke as ut,Gn as v,kn as w,Rn as x,Un as y,yn as z};
//# sourceMappingURL=chat-model-controls-Dkjngm_b.js.map