import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{c as t,l as n,o as r,u as i}from"./control-ui-foundation-43q8Lf_T.js";import{dt as a,ft as o}from"./control-ui-foundation-DQl2NL7K.js";import{$ as s,G as c,J as l,U as u,X as d,tt as f,z as p}from"./lit-runtime-CE4wpvNA.js";import{B as m,G as h,L as g,M as _,P as v,ct as y,j as b,ut as x}from"./control-ui-foundation-DFIFKu9N.js";import{$n as S,Bo as C,Ci as w,Mi as T,Mr as E,Nr as ee,Pi as D,_i as te,ar as O,bi as k,di as A,fi as j,ir as M,mi as N,nr as P,or as F,ui as I,yi as L}from"./control-ui-core-Dx4utKSD.js";import{Ut as R,at as ne,it as z,jt as B}from"./control-ui-core-6OhF3OIO.js";import{o as V,t as H}from"./control-ui-core-CXeSrnoQ.js";import{Q as U,tt as W}from"./control-ui-core-vPyynwls.js";import{d as re,f as ie}from"./control-ui-shared-Ca9fxTB8.js";import{n as ae,t as G}from"./settings-workspace-BhCB-OeS.js";import{a as oe,c as K,t as q}from"./settings-ui-BJ5HJKwt.js";import{n as se,t as ce}from"./agent-scope-control-ClLrhBs5.js";import{a as le,i as ue,n as de,o as fe,r as pe,t as me}from"./panel-refresh-status-CvTXJ1Oh.js";import{n as he,r as ge,t as _e}from"./usage-fJoz44Iu.js";import{n as ve,r as ye}from"./refresh-policy-CVMdOh-W.js";function be(e,t){if(!e)return t;if(!t)return e;let n={fresh:0,partial:1,stale:2,refreshing:3};return{status:n[t.status]>n[e.status]?t.status:e.status,cachedFiles:Math.max(e.cachedFiles,t.cachedFiles),pendingFiles:Math.max(e.pendingFiles,t.pendingFiles),staleFiles:Math.max(e.staleFiles,t.staleFiles),refreshedAt:Math.max(e.refreshedAt??0,t.refreshedAt??0)||void 0}}function xe(e){return!e||e.status!==`refreshing`&&e.status!==`stale`&&e.status!==`partial`?null:V(`usage.cacheStatus.title`,{status:V(`usage.cacheStatus.status.${e.status}`),pending:String(e.pendingFiles),stale:String(e.staleFiles),cached:String(e.cachedFiles)})}var Se=e((()=>{H()}));function Ce(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function we(e){if(typeof e==`string`)return e;if(e instanceof Error&&e.message.trim())return e.message;if(e&&typeof e==`object`)try{return JSON.stringify(e)||`request failed`}catch{}return`request failed`}function Te(e,t,n,r,i){if(r&&e.length>0)for(let r of e.slice(-1)){let i=n.indexOf(r),a=n.indexOf(t);if(i!==-1&&a!==-1){let[t,r]=i<a?[i,a]:[a,i];return[...new Set([...e,...n.slice(t,r+1)])]}}return e.includes(t)?e.filter(e=>e!==t):i?[...e,t]:[t]}function Ee(e,t,n,r,i){if(i&&e.length>0){let i=[...n].toSorted((e,t)=>{let n=r?e.usage?.totalTokens??0:e.usage?.totalCost??0;return(r?t.usage?.totalTokens??0:t.usage?.totalCost??0)-n}).map(e=>e.key),a=i.indexOf(e.at(-1)??``),o=i.indexOf(t);if(a!==-1&&o!==-1){let[t,n]=a<o?[a,o]:[o,a];return[...new Set([...e,...i.slice(t,n+1)])]}}return e.length===1&&e[0]===t?[]:[t]}function De(e){let t=e.split(`
`),n=new Map,r=[];for(let e of t){let t=/^\[Tool:\s*([^\]]+)\]/.exec(e.trim())?.[1];if(t){n.set(t,(n.get(t)??0)+1);continue}e.trim().startsWith(`[Tool Result]`)||r.push(e)}let i=Array.from(n.entries()).toSorted((e,t)=>t[1]-e[1]),a=i.reduce((e,[,t])=>e+t,0);return{tools:i,summary:i.length>0?`Tools: ${i.map(([e,t])=>`${e}×${t}`).join(`, `)} (${a} calls)`:``,cleanContent:r.join(`
`).trim()}}var Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue=e((()=>{C(),Oe=e=>x(e),ke=e=>{let t=e.replace(/[.+^${}()|[\]\\]/g,`\\$&`).replace(/\*/g,`.*`).replace(/\?/g,`.`);return RegExp(`^${t}$`,`i`)},Ae=e=>{let t=x(e);if(!t)return null;t.startsWith(`$`)&&(t=t.slice(1));let n=1;if(t.endsWith(`k`)?(n=1e3,t=t.slice(0,-1)):t.endsWith(`m`)&&(n=1e6,t=t.slice(0,-1)),!/^\d+(?:\.\d+)?$/.test(t))return null;let r=Number(t)*n;return!Number.isFinite(r)||!Number.isSafeInteger(Math.round(r))?null:r},je=e=>(e.match(/"[^"]+"|\S+/g)??[]).map(e=>{let t=e.replace(/^"|"$/g,``),n=t.indexOf(`:`);return n>0?{key:t.slice(0,n),value:t.slice(n+1),raw:t}:{value:t,raw:t}}),Me=e=>[e.label,e.key,e.sessionId].filter(e=>!!e).map(e=>x(e)),Ne=e=>{let t=new Set;e.modelProvider&&t.add(x(e.modelProvider)),e.providerOverride&&t.add(x(e.providerOverride)),e.origin?.provider&&t.add(x(e.origin.provider));for(let n of e.usage?.modelUsage??[])n.provider&&t.add(x(n.provider));return Array.from(t)},Pe=e=>{let t=new Set;e.model&&t.add(x(e.model));for(let n of e.usage?.modelUsage??[])n.model&&t.add(x(n.model));return Array.from(t)},Fe=e=>(e.usage?.toolUsage?.tools??[]).map(e=>x(e.name)),Ie={tools:e=>(e.usage?.toolUsage?.totalCalls??0)>0,errors:e=>(e.usage?.messageCounts?.errors??0)>0,context:e=>!!e.contextWeight,usage:e=>!!e.usage,model:e=>Pe(e).length>0,provider:e=>Ne(e).length>0},Le=(e,t)=>e>=t,Re=(e,t)=>e<=t,ze={mintokens:[e=>e.usage?.totalTokens??0,Le],maxtokens:[e=>e.usage?.totalTokens??0,Re],mincost:[e=>e.usage?.totalCost??0,Le],maxcost:[e=>e.usage?.totalCost??0,Re],minmessages:[e=>e.usage?.messageCounts?.total??0,Le],maxmessages:[e=>e.usage?.messageCounts?.total??0,Re]},Be=new Set([`agent`,`channel`,`chat`,`provider`,`model`,`tool`,`label`,`key`,`session`,`id`,`has`,...Object.keys(ze)]),Ve=(e,t)=>{let n=Oe(t.value??``);if(!n)return!0;if(!t.key)return Me(e).some(e=>e.includes(n));let r=Oe(t.key);switch(r){case`agent`:return x(e.agentId).includes(n);case`channel`:return x(e.channel).includes(n);case`chat`:return x(e.chatType).includes(n);case`provider`:return Ne(e).some(e=>e.includes(n));case`model`:return Pe(e).some(e=>e.includes(n));case`tool`:return Fe(e).some(e=>e.includes(n));case`label`:return x(e.label).includes(n);case`key`:case`session`:case`id`:if(n.includes(`*`)||n.includes(`?`)){let t=ke(n);return t.test(e.key)||(e.sessionId?t.test(e.sessionId):!1)}return x(e.key).includes(n)||x(e.sessionId).includes(n);case`has`:return(Object.hasOwn(Ie,n)?Ie[n]:void 0)?.(e)??!0}let i=Object.hasOwn(ze,r)?ze[r]:void 0;if(!i)return!0;let a=Ae(n),[o,s]=i;return a===null||s(o(e),a)},He=(e,t)=>{let n=je(t);if(n.length===0)return{sessions:e,warnings:[]};let r=[];for(let e of n){if(!e.key)continue;let t=Oe(e.key);if(!Be.has(t)){r.push(`Unknown filter: ${e.key}`);continue}e.value===``&&r.push(`Missing value for ${e.key}`),t===`has`&&e.value&&!Object.hasOwn(Ie,Oe(e.value))&&r.push(`Unknown has:${e.value}`),Object.hasOwn(ze,t)&&e.value&&Ae(e.value)===null&&r.push(`Invalid number for ${e.key}`)}return{sessions:e.filter(e=>n.every(t=>Ve(e,t))),warnings:r}}}));function We(e,t){return j(t)?{clearData:!0,status:ue(pe(),I(`usage details`))}:{clearData:!1,status:ue(e,we(t))}}var Ge=e((()=>{le(),A(),Ue()}));function Ke(e,t,n){let r=t?.sessions.map(e=>e.agentId).filter(e=>!!e?.trim())??[];return s`
    <section class="content-header content-header--page">
      <div>
        <div class="page-title">${R(`usage`)}</div>
      </div>
      ${se({agents:e.agents.state.agentsList?.agents??[],additionalAgentIds:r,selection:e.agentSelection})}
    </section>
    ${ae(n)}
  `}var qe=e((()=>{l(),B(),ce(),G()})),Je,Ye=e((()=>{Je=[`channel`,`agent`,`provider`,`model`,`messages`,`tools`,`errors`,`duration`]})),Xe,Ze=e((()=>{ee(),ye(),Xe=class{constructor(e,t){this.options=t,this.currentClient=null,this.currentConnected=!1,this.lastLoadedAtMs=null,this.pendingAutomaticRefresh=!1,this.reloadPending=!1,this.hasBoundGatewaySource=!1,this.handlePageActivation=()=>{this.request(`focus`)},this.subscriptions=new E(e).effect(t.getGateway,e=>{let t=this.hasBoundGatewaySource;this.hasBoundGatewaySource=!0;let n=e.subscribe(e=>this.applyGatewaySnapshot(e,!1));return this.applyGatewaySnapshot(e.snapshot,t),n})}get client(){return this.currentClient}get connected(){return this.currentConnected}connect(){document.addEventListener(`visibilitychange`,this.handlePageActivation),globalThis.addEventListener(`focus`,this.handlePageActivation)}disconnect(){document.removeEventListener(`visibilitychange`,this.handlePageActivation),globalThis.removeEventListener(`focus`,this.handlePageActivation),this.subscriptions.clear(),this.currentClient=null,this.currentConnected=!1}applyGatewaySnapshot(e,t=!1){let n=t||e.client!==this.currentClient,r=e.connected&&!this.currentConnected;if(this.adoptGatewaySnapshot(e),n&&this.options.resetForClientChange(),!e.connected||!e.client){this.reloadPending||=this.options.isLoading(),this.options.invalidateRequests();return}this.options.ensureAgents(),this.options.isRouteDataInitialized()&&(n||r)&&this.request(`reconnect`)}adoptGatewaySnapshot(e){this.currentClient=e.client,this.currentConnected=e.connected}setLastLoadedAtMs(e){this.lastLoadedAtMs=e}markLoaded(){this.lastLoadedAtMs=Date.now()}resetPayload(){this.lastLoadedAtMs=null,this.reloadPending=!1}markLoadDeferred(){this.reloadPending=!0}beginLoad(){this.reloadPending=!1}reload(){this.pendingAutomaticRefresh=!1,this.options.reload()}request(e){if(this.options.isLoading()&&e!==`manual`){this.pendingAutomaticRefresh=!0;return}this.pendingAutomaticRefresh=!1,ve({reason:e,visible:document.visibilityState===`visible`&&document.hasFocus(),interrupted:this.reloadPending,nowMs:Date.now(),lastLoadedAtMs:this.lastLoadedAtMs})===`fetch`&&this.reload()}flushPending(){this.pendingAutomaticRefresh&&(this.pendingAutomaticRefresh=!1,this.request(`focus`))}}}));function Qe(e,t){!t||t.count<=0||(e.count+=t.count,e.sum+=t.avgMs*t.count,e.min=Math.min(e.min,t.minMs),e.max=Math.max(e.max,t.maxMs),e.p95Max=Math.max(e.p95Max,t.p95Ms))}function $e(e,t){for(let n of t??[]){let t=e.get(n.date)??{date:n.date,count:0,sum:0,min:1/0,max:0,p95Max:0};t.count+=n.count,t.sum+=n.avgMs*n.count,t.min=Math.min(t.min,n.minMs),t.max=Math.max(t.max,n.maxMs),t.p95Max=Math.max(t.p95Max,n.p95Ms),e.set(n.date,t)}}function et(e){return{byChannel:Array.from(e.byChannelMap.entries()).map(([e,t])=>({channel:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),latency:e.latencyTotals.count>0?{count:e.latencyTotals.count,avgMs:e.latencyTotals.sum/e.latencyTotals.count,minMs:e.latencyTotals.min===1/0?0:e.latencyTotals.min,maxMs:e.latencyTotals.max,p95Ms:e.latencyTotals.p95Max}:void 0,dailyLatency:Array.from(e.dailyLatencyMap.values()).map(e=>({date:e.date,count:e.count,avgMs:e.count?e.sum/e.count:0,minMs:e.min===1/0?0:e.min,maxMs:e.max,p95Ms:e.p95Max})).toSorted((e,t)=>e.date.localeCompare(t.date)),modelDaily:Array.from(e.modelDailyMap.values()).toSorted((e,t)=>e.date.localeCompare(t.date)||t.cost-e.cost),daily:Array.from(e.dailyMap.values()).toSorted((e,t)=>e.date.localeCompare(t.date))}}var tt=e((()=>{}));function nt(e){return Math.round(e/Tt)}function J(e){return N(e,{thousandsSuffix:`K`,trimTrailingZero:!1})}function rt(e){let t=new Date;return t.setHours(e,0,0,0),t.toLocaleTimeString(void 0,{hour:`numeric`})}function it(e,t,n){let r=e.usage;if(!r)return!1;let i=r.firstActivity??e.updatedAt,a=r.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a);if(o===s){let e=new Date(o);return n({usage:r,hour:ot(e,t),weekday:st(e,t),share:1}),!0}let c=(s-o)/6e4,l=o;for(;l<s;){let e=new Date(l),i=ut(e,t),a=Math.min(i.getTime(),s),o=Math.max((a-l)/6e4,0);n({usage:r,hour:ot(e,t),weekday:st(e,t),share:o/c}),l=a+1}return!0}function at(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:24},()=>0);for(let i of e){let e=i.usage;if(!e?.messageCounts||e.messageCounts.total===0)continue;let a=e.messageCounts;if(e.utcQuarterHourMessageCounts&&e.utcQuarterHourMessageCounts.length>0){for(let i of e.utcQuarterHourMessageCounts){let e=lt(i.date,i.quarterIndex,t);e&&(n[e.hour]=(n[e.hour]??0)+i.errors,r[e.hour]=(r[e.hour]??0)+i.total)}continue}it(i,t,({hour:e,share:t})=>{n[e]=(n[e]??0)+(a.errors??0)*t,r[e]=(r[e]??0)+a.total*t})}return r.map((e,t)=>{let r=n[t]??0;return{hour:t,rate:e>0?r/e:0,errors:r,msgs:e}}).filter(e=>e.msgs>0&&e.errors>0).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(e=>({label:rt(e.hour),value:`${(e.rate*100).toFixed(2)}%`,sub:`${Math.round(e.errors)} ${x(V(`usage.overview.errors`))} · ${Math.round(e.msgs)} ${V(`usage.overview.messagesAbbrev`)}`}))}function ot(e,t){return t===`utc`?e.getUTCHours():e.getHours()}function st(e,t){return t===`utc`?e.getUTCDay():e.getDay()}function ct(e,t){let n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!n||!Number.isInteger(t)||t<0||t>95)return null;let[,r,i,a]=n,o=Number(r),s=Number(i),c=Number(a),l=new Date(Date.UTC(o,s-1,c,0,t*15));return Number.isNaN(l.valueOf())||l.getUTCFullYear()!==o||l.getUTCMonth()!==s-1||l.getUTCDate()!==c?null:l}function lt(e,t,n){let r=ct(e,t);return r?{hour:ot(r,n),weekday:st(r,n)}:null}function ut(e,t){let n=new Date(e);return t===`utc`?n.setUTCMinutes(59,59,999):n.setMinutes(59,59,999),n}function dt(e,t,n){let r=e.usage?.utcQuarterHourTokenUsage;if(!r||r.length===0)return!1;let i=!1;for(let e of r){if(e.totalTokens<=0)continue;let r=lt(e.date,e.quarterIndex,t);r&&(i=!0,n({hour:r.hour,weekday:r.weekday,tokens:e.totalTokens}))}return i}function ft(e,t,n){let r=e.usage,i=r?.firstActivity??e.updatedAt,a=r?.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a),c=o;for(;c<=s;){let e=new Date(c),r=ot(e,n);if(t.includes(r))return!0;let i=ut(e,n);c=Math.min(i.getTime(),s)+1}return!1}function pt(e,t,n){if(t.length===0)return!0;let r=!1;return dt(e,n,({hour:e})=>{t.includes(e)&&(r=!0)})?r:ft(e,t,n)}function mt(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:7},()=>0),i=0,a=!1;for(let o of e){let e=o.usage;if(!(!e||!e.totalTokens||e.totalTokens<=0)){if(i+=e.totalTokens,dt(o,t,({hour:e,weekday:t,tokens:i})=>{n[e]=(n[e]??0)+i,r[t]=(r[t]??0)+i})){a=!0;continue}it(o,t,({usage:e,hour:t,weekday:i,share:a})=>{n[t]=(n[t]??0)+e.totalTokens*a,r[i]=(r[i]??0)+e.totalTokens*a})&&(a=!0)}}let o=[V(`usage.mosaic.sun`),V(`usage.mosaic.mon`),V(`usage.mosaic.tue`),V(`usage.mosaic.wed`),V(`usage.mosaic.thu`),V(`usage.mosaic.fri`),V(`usage.mosaic.sat`)].map((e,t)=>({label:e,tokens:r[t]??0}));return{hasData:a,totalTokens:i,hourTotals:n,weekdayTotals:o}}function ht(e,t,n,r){let i=mt(e,t);if(!i.hasData)return K({title:V(`usage.mosaic.title`),description:V(`usage.mosaic.subtitleEmpty`),actions:s`
          <div class="usage-mosaic-total">
            ${J(0)} ${x(V(`usage.metrics.tokens`))}
          </div>
        `},s`
        <div class="usage-panel usage-mosaic">
          <div class="usage-empty-block usage-empty-block--compact">
            ${V(`usage.mosaic.noTimelineData`)}
          </div>
        </div>
      `);let a=Math.max(...i.hourTotals,1),o=Math.max(...i.weekdayTotals.map(e=>e.tokens),1);return K({title:V(`usage.mosaic.title`),description:V(`usage.mosaic.subtitle`,{zone:V(t===`utc`?`usage.filters.timeZoneUtc`:`usage.filters.timeZoneLocal`)}),actions:s`
        <div class="usage-mosaic-total">
          ${J(i.totalTokens)}
          ${x(V(`usage.metrics.tokens`))}
        </div>
      `},s`
      <div class="usage-panel usage-mosaic">
        <div class="usage-mosaic-grid">
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">${V(`usage.mosaic.dayOfWeek`)}</div>
            <div class="usage-daypart-grid">
              ${i.weekdayTotals.map(e=>{let t=Math.min(e.tokens/o,1);return s`
                  <div class="usage-daypart-cell" style="background: ${e.tokens>0?`color-mix(in srgb, var(--accent) ${(12+t*60).toFixed(1)}%, transparent)`:`transparent`};">
                    <div class="usage-daypart-label">${e.label}</div>
                    <div class="usage-daypart-value">${J(e.tokens)}</div>
                  </div>
                `})}
            </div>
          </div>
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">
              <span>${V(`usage.filters.hours`)}</span>
              <span class="usage-mosaic-sub">0 → 23</span>
            </div>
            <div class="usage-hour-grid">
              ${i.hourTotals.map((e,t)=>{let i=Math.min(e/a,1),o=e>0?`color-mix(in srgb, var(--accent) ${(8+i*70).toFixed(1)}%, transparent)`:`transparent`,c=`${t}:00 · ${J(e)} ${x(V(`usage.metrics.tokens`))}`,l=i>.7?`color-mix(in srgb, var(--accent) 60%, transparent)`:`color-mix(in srgb, var(--accent) 24%, transparent)`;return s`
                  <div
                    class="usage-hour-cell ${n.includes(t)?`selected`:``}"
                    style="background: ${o}; border-color: ${l};"
                    title="${c}"
                    @click=${e=>r(t,e.shiftKey)}
                  ></div>
                `})}
            </div>
            <div class="usage-hour-labels">
              <span>${V(`usage.mosaic.midnight`)}</span>
              <span>${V(`usage.mosaic.fourAm`)}</span>
              <span>${V(`usage.mosaic.eightAm`)}</span>
              <span>${V(`usage.mosaic.noon`)}</span>
              <span>${V(`usage.mosaic.fourPm`)}</span>
              <span>${V(`usage.mosaic.eightPm`)}</span>
            </div>
            <div class="usage-hour-legend">
              <span></span>
              ${V(`usage.mosaic.legend`)}
            </div>
          </div>
        </div>
      </div>
    `)}function gt(e,t=2){return`$${e.toFixed(t)}`}function _t(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function vt(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let[,n,r,i]=t,a=Number(n),o=Number(r)-1,s=Number(i),c=new Date(a,o,s);return Number.isNaN(c.valueOf())||c.getFullYear()!==a||c.getMonth()!==o||c.getDate()!==s?null:c}function yt(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let n=Number(t[1]),r=Number(t[2]),i=Number(t[3]),a=Date.UTC(n,r-1,i),o=new Date(a);return o.getUTCFullYear()!==n||o.getUTCMonth()!==r-1||o.getUTCDate()!==i?null:a/Et}function bt(e){return new Date(e*Et).toISOString().slice(0,10)}function xt(e){let t=vt(e);return t?t.toLocaleDateString(void 0,{month:`short`,day:`numeric`}):e}function St(e){let t=vt(e);return t?t.toLocaleDateString(void 0,{month:`long`,day:`numeric`,year:`numeric`}):e}function Ct(e,t,n){let r=yt(t),i=yt(n);if(r===null||i===null||r>i)return null;let a=Dt();for(let t of e){let e=yt(t.date);e!==null&&e>=r&&e<=i&&Ot(a,t)}return{days:i-r+1,startDate:t,endDate:n,totals:a}}function wt(e,t,n,r=[1,7,30,90]){let i=yt(t),a=yt(n);if(i===null||a===null||i>a)return[];let o=a-i+1;return Array.from(new Set(r.map(e=>Math.max(1,Math.trunc(e))))).filter(e=>e<o).toSorted((e,t)=>e-t).map(t=>Ct(e,bt(a-t+1),n)).filter(e=>e!==null)}var Tt,Et,Dt,Ot,kt,At,jt=e((()=>{l(),tt(),q(),H(),w(),C(),Tt=4,Et=864e5,Dt=()=>({input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}),Ot=(e,t)=>{e.input+=t.input??0,e.output+=t.output??0,e.cacheRead+=t.cacheRead??0,e.cacheWrite+=t.cacheWrite??0,e.totalTokens+=t.totalTokens??0,e.totalCost+=t.totalCost??0,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0},kt=(e,t)=>{if(e.length===0)return t??{messages:{total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},tools:{totalCalls:0,uniqueTools:0,tools:[]},byModel:[],byProvider:[],byAgent:[],byChannel:[],daily:[]};let n={total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},r=new Map,i=new Map,a=new Map,o=new Map,s=new Map,c=new Map,l=new Map,u=new Map,d={count:0,sum:0,min:1/0,max:0,p95Max:0};for(let t of e){let e=t.usage;if(e){if(e.messageCounts&&(n.total+=e.messageCounts.total,n.user+=e.messageCounts.user,n.assistant+=e.messageCounts.assistant,n.toolCalls+=e.messageCounts.toolCalls,n.toolResults+=e.messageCounts.toolResults,n.errors+=e.messageCounts.errors),e.toolUsage)for(let t of e.toolUsage.tools)r.set(t.name,(r.get(t.name)??0)+t.count);if(e.modelUsage)for(let t of e.modelUsage){let e=`${t.provider??`unknown`}::${t.model??`unknown`}`,n=i.get(e)??{provider:t.provider,model:t.model,count:0,totals:Dt()};n.count+=t.count,Ot(n.totals,t.totals),i.set(e,n);let r=t.provider??`unknown`,o=a.get(r)??{provider:t.provider,model:void 0,count:0,totals:Dt()};o.count+=t.count,Ot(o.totals,t.totals),a.set(r,o)}if(Qe(d,e.latency),t.agentId){let n=o.get(t.agentId)??Dt();Ot(n,e),o.set(t.agentId,n)}if(t.channel){let n=s.get(t.channel)??Dt();Ot(n,e),s.set(t.channel,n)}for(let t of e.dailyBreakdown??[]){let e=c.get(t.date)??{date:t.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};e.tokens+=t.tokens,e.cost+=t.cost,c.set(t.date,e)}for(let t of e.dailyMessageCounts??[]){let e=c.get(t.date)??{date:t.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};e.messages+=t.total,e.toolCalls+=t.toolCalls,e.errors+=t.errors,c.set(t.date,e)}$e(l,e.dailyLatency);for(let t of e.dailyModelUsage??[]){let e=`${t.date}::${t.provider??`unknown`}::${t.model??`unknown`}`,n=u.get(e)??{date:t.date,provider:t.provider,model:t.model,tokens:0,cost:0,count:0};n.tokens+=t.tokens,n.cost+=t.cost,n.count+=t.count,u.set(e,n)}}}let f=et({byChannelMap:s,latencyTotals:d,dailyLatencyMap:l,modelDailyMap:u,dailyMap:c});return{messages:n,tools:{totalCalls:Array.from(r.values()).reduce((e,t)=>e+t,0),uniqueTools:r.size,tools:Array.from(r.entries()).map(([e,t])=>({name:e,count:t})).toSorted((e,t)=>t.count-e.count)},byModel:Array.from(i.values()).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byProvider:Array.from(a.values()).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byAgent:Array.from(o.entries()).map(([e,t])=>({agentId:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),...f}},At=(e,t,n)=>{let r=0,i=0;for(let t of e){let e=t.usage?.durationMs??0;e>0&&(r+=e,i+=1)}let a=i?r/i:0,o=t&&r>0?t.totalTokens/(r/6e4):void 0,s=t&&r>0?t.totalCost/(r/6e4):void 0,c=n.messages.total?n.messages.errors/n.messages.total:0,l;for(let e of n.daily){if(e.messages<=0||e.errors<=0)continue;let t={date:e.date,errors:e.errors,messages:e.messages,rate:e.errors/e.messages};(!l||t.rate>l.rate||t.rate===l.rate&&t.errors>l.errors)&&(l=t)}return{durationSumMs:r,durationCount:i,avgDurationMs:a,throughputTokensPerMin:o,throughputCostPerMin:s,errorRate:c,peakErrorDay:l}}}));function Mt(e,t,n=`text/plain`){let r=new Blob([t],{type:`${n};charset=utf-8`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,a.click(),URL.revokeObjectURL(i)}function Nt(e){return/^[ \t\r\n]*[=+\-@\uFF0B\uFF0D\uFF1D\uFF20]/u.test(e)?`'${e}`:e}function Pt(e,t=!0){let n=t?Nt(e):e;return/[",\r\n]/.test(n)?`"${n.replaceAll(`"`,`""`)}"`:n}function Ft(e){return e.map(e=>e==null?``:Pt(String(e),typeof e==`string`)).join(`,`)}var It,Lt,Rt,zt,Y,Bt,Vt,Ht,Ut=e((()=>{g(),C(),Ue(),It=e=>{let t=[Ft([`key`,`label`,`agentId`,`channel`,`provider`,`model`,`updatedAt`,`durationMs`,`messages`,`errors`,`toolCalls`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`totalCost`])];for(let n of e){let e=n.usage;t.push(Ft([n.key,n.label??``,n.agentId??``,n.channel??``,n.modelProvider??n.providerOverride??``,n.model??n.modelOverride??``,m(n.updatedAt)??``,e?.durationMs??``,e?.messageCounts?.total??``,e?.messageCounts?.errors??``,e?.messageCounts?.toolCalls??``,e?.input??``,e?.output??``,e?.cacheRead??``,e?.cacheWrite??``,e?.totalTokens??``,e?.totalCost??``]))}return t.join(`
`)},Lt=e=>{let t=[Ft([`date`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`inputCost`,`outputCost`,`cacheReadCost`,`cacheWriteCost`,`totalCost`])];for(let n of e)t.push(Ft([n.date,n.input,n.output,n.cacheRead,n.cacheWrite,n.totalTokens,n.inputCost??``,n.outputCost??``,n.cacheReadCost??``,n.cacheWriteCost??``,n.totalCost]));return t.join(`
`)},Rt=(e,t,n)=>{let r=e.trim();if(!r)return[];let i=(r.length?r.split(/\s+/):[]).at(-1)??``,[a,o]=i.includes(`:`)?[i.slice(0,i.indexOf(`:`)),i.slice(i.indexOf(`:`)+1)]:[``,``],s=x(a),c=x(o),l=e=>y(e.filter(e=>!!e)),u=l(t.map(e=>e.agentId)).slice(0,6),d=l(t.map(e=>e.channel)).slice(0,6),f=l([...t.map(e=>e.modelProvider),...t.map(e=>e.providerOverride),...n?.byProvider.map(e=>e.provider)??[]]).slice(0,6),p=l([...t.map(e=>e.model),...n?.byModel.map(e=>e.model)??[]]).slice(0,6),m=l(n?.tools.tools.map(e=>e.name)??[]).slice(0,6);if(!s)return[{label:`agent:`,value:`agent:`},{label:`channel:`,value:`channel:`},{label:`provider:`,value:`provider:`},{label:`model:`,value:`model:`},{label:`tool:`,value:`tool:`},{label:`has:errors`,value:`has:errors`},{label:`has:tools`,value:`has:tools`},{label:`minTokens:`,value:`minTokens:`},{label:`maxCost:`,value:`maxCost:`}];let h=[],g=(e,t)=>{for(let n of t)(!c||x(n).includes(c))&&h.push({label:`${e}:${n}`,value:`${e}:${n}`})};switch(s){case`agent`:g(`agent`,u);break;case`channel`:g(`channel`,d);break;case`provider`:g(`provider`,f);break;case`model`:g(`model`,p);break;case`tool`:g(`tool`,m);break;case`has`:[`errors`,`tools`,`context`,`usage`,`model`,`provider`].forEach(e=>{(!c||e.includes(c))&&h.push({label:`has:${e}`,value:`has:${e}`})});break;default:break}return h},zt=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=n.split(/\s+/);return r[r.length-1]=t,`${r.join(` `)} `},Y=e=>x(e),Bt=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=n.split(/\s+/),i=r[r.length-1]??``,a=t.includes(`:`)?t.split(`:`)[0]:null,o=i.includes(`:`)?i.split(`:`)[0]:null;return i.endsWith(`:`)&&a&&o===a?(r[r.length-1]=t,`${r.join(` `)} `):r.includes(t)?`${r.join(` `)} `:`${r.join(` `)} ${t} `},Vt=(e,t)=>{let n=e.trim().split(/\s+/).filter(Boolean).filter(e=>e!==t);return n.length?`${n.join(` `)} `:``},Ht=(e,t,n)=>{let r=Y(t),i=[...je(e).filter(e=>Y(e.key??``)!==r).map(e=>e.raw),...n.map(e=>`${t}:${e}`)];return i.length?`${i.join(` `)} `:``}}));function Wt(e,t){return t===0?0:e/t*100}function X(e){let t=Math.abs(e);return gt(e,t===0||t>=.01?2:t>=1e-4?4:6)}function Gt(e,t,n){e.key!==`Enter`&&e.key!==` `||(e.preventDefault(),n(t,e.shiftKey))}function Kt(e){let t=e.totalCost||0;return{input:{tokens:e.input,cost:e.inputCost||0,pct:Wt(e.inputCost||0,t)},output:{tokens:e.output,cost:e.outputCost||0,pct:Wt(e.outputCost||0,t)},cacheRead:{tokens:e.cacheRead,cost:e.cacheReadCost||0,pct:Wt(e.cacheReadCost||0,t)},cacheWrite:{tokens:e.cacheWrite,cost:e.cacheWriteCost||0,pct:Wt(e.cacheWriteCost||0,t)},totalCost:t}}function qt(e,t,n,r,i,a,o,c){if(!(e.length>0||t.length>0||n.length>0))return d;let l=n.at(0)??``,u=n.length===1?r.find(e=>e.key===l):null,f=u?v(u.label||u.key,20)+((u.label||u.key).length>20?`…`:``):n.length===1?l.slice(0,8)+`…`:V(`usage.filters.sessionsCount`,{count:String(n.length)}),p=u?u.label||u.key:n.length===1?l:n.join(`, `),m=e.length===1?e[0]:V(`usage.filters.daysCount`,{count:String(e.length)}),h=t.length===1?`${t[0]}:00`:V(`usage.filters.hoursCount`,{count:String(t.length)});return s`
    <div class="active-filters">
      ${e.length>0?s`
            <div class="filter-chip">
              <span class="filter-chip-label">${V(`usage.filters.days`)}: ${m}</span>
              <openclaw-tooltip .content=${V(`usage.filters.remove`)}>
                <button
                  class="filter-chip-remove"
                  @click=${i}
                  aria-label=${V(`usage.filters.removeDays`)}
                >
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `:d}
      ${t.length>0?s`
            <div class="filter-chip">
              <span class="filter-chip-label">${V(`usage.filters.hours`)}: ${h}</span>
              <openclaw-tooltip .content=${V(`usage.filters.remove`)}>
                <button
                  class="filter-chip-remove"
                  @click=${a}
                  aria-label=${V(`usage.filters.removeHours`)}
                >
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `:d}
      ${n.length>0?s`
            <div class="filter-chip" title="${p}">
              <span class="filter-chip-label">${V(`usage.filters.session`)}: ${f}</span>
              <openclaw-tooltip .content=${V(`usage.filters.remove`)}>
                <button
                  class="filter-chip-remove"
                  @click=${o}
                  aria-label=${V(`usage.filters.removeSession`)}
                >
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `:d}
      ${(e.length>0||t.length>0)&&n.length>0?s`
            <button class="btn btn--sm" @click=${c}>
              ${V(`usage.filters.clearAll`)}
            </button>
          `:d}
    </div>
  `}function Jt(e,t,n){let r=Ct(e,t,n);if(!r||e.length===0)return d;let i=wt(e,t,n),a=_t(new Date),o=(e,t)=>e===1?t===a?V(`usage.presets.today`):xt(t):V(`usage.costWindows.lastDays`,{count:String(e)}),c=[{label:V(`usage.costWindows.selectedRange`),summary:r,range:!0},...i.map(e=>({label:o(e.days,e.endDate),summary:e,range:!1}))];return s`
    <section class="cost-window-analysis">
      <div class="cost-window-header">
        <div>
          <div class="card-title usage-section-title">${V(`usage.costWindows.title`)}</div>
          <div class="card-sub">
            ${V(`usage.costWindows.subtitle`,{date:St(n)})}
          </div>
        </div>
        <div class="cost-window-range-label">
          ${xt(t)} – ${xt(n)}
        </div>
      </div>
      <div class="cost-window-grid">
        ${c.map(({label:e,summary:t,range:n})=>{let r=t.totals.totalCost/t.days;return s`
            <div class="cost-window-card ${n?`cost-window-card--range`:``}">
              <div class="cost-window-card__label">${e}</div>
              <div class="cost-window-card__value">
                ${X(t.totals.totalCost)}
              </div>
              <div class="cost-window-card__meta">
                ${J(t.totals.totalTokens)} ${V(`usage.metrics.tokens`)} ·
                ${X(r)} ${V(`usage.costWindows.perDay`)}
              </div>
            </div>
          `})}
      </div>
    </section>
  `}function Yt(e,t,n,r,i,a){if(!e.length)return s`
      <div class="daily-chart-compact">
        <div class="card-title usage-section-title">${V(`usage.daily.title`)}</div>
        <div class="usage-empty-block">${V(`usage.empty.noData`)}</div>
      </div>
    `;let o=n===`tokens`,c=e.map(e=>o?e.totalTokens:e.totalCost),l=Math.max(...c,0),u=l>0?l:o?1:1e-4,f=c.filter(e=>e>0),p=u/(f.length>0?Math.min(...f):u)>50,m=c.map(e=>{if(e<=0)return 0;let t=p?Math.sqrt(e/u):e/u;return Math.max(6,t*200)}),g=e.length>30?12:e.length>20?18:e.length>14?24:32,_=e.length<=14,v=new Set(t);return s`
    <div class="daily-chart-compact">
      <div class="daily-chart-header">
        <div class="chart-toggle small sessions-toggle">
          <button
            class="btn btn--sm toggle-btn ${r===`total`?`active`:``}"
            @click=${()=>i(`total`)}
          >
            ${V(`usage.daily.total`)}
          </button>
          <button
            class="btn btn--sm toggle-btn ${r===`by-type`?`active`:``}"
            @click=${()=>i(`by-type`)}
          >
            ${V(`usage.daily.byType`)}
          </button>
        </div>
        <div class="card-title">
          ${V(o?`usage.daily.tokensTitle`:`usage.daily.costTitle`)}
          ${p?s`<span
                class="daily-chart-scale-badge"
                title=${V(`usage.daily.compressedScaleHint`)}
                aria-label=${V(`usage.daily.compressedScaleHint`)}
                >√</span
              >`:d}
        </div>
      </div>
      <div class="daily-chart">
        <div class="daily-chart-plot">
          <div class="daily-chart-scale" aria-hidden="true">
            ${l>0?s`
                  <span
                    >${o?J(l):X(l)}</span
                  >
                  <span
                    >${o?J(p?l/4:l/2):X(p?l/4:l/2)}</span
                  >
                  <span>${o?J(0):gt(0)}</span>
                `:s`<span>${o?J(0):gt(0)}</span>`}
          </div>
          <div class="daily-chart-bars" style="--bar-max-width: ${g}px">
            ${e.map((t,n)=>{let i=h(m[n],`daily usage bar height`),c=v.has(t.date),l=xt(t.date),u=e.length>20?String(Number.parseInt(t.date.slice(8),10)):l,d=e.length>20?`daily-bar-label daily-bar-label--compact`:`daily-bar-label`,f=r===`by-type`?o?[{value:t.output,class:`output`},{value:t.input,class:`input`},{value:t.cacheWrite,class:`cache-write`},{value:t.cacheRead,class:`cache-read`}]:[{value:t.outputCost??0,class:`output`},{value:t.inputCost??0,class:`input`},{value:t.cacheWriteCost??0,class:`cache-write`},{value:t.cacheReadCost??0,class:`cache-read`}]:[],p=r===`by-type`?o?[`${V(`usage.breakdown.output`)} ${J(t.output)}`,`${V(`usage.breakdown.input`)} ${J(t.input)}`,`${V(`usage.breakdown.cacheWrite`)} ${J(t.cacheWrite)}`,`${V(`usage.breakdown.cacheRead`)} ${J(t.cacheRead)}`]:[`${V(`usage.breakdown.output`)} ${X(t.outputCost??0)}`,`${V(`usage.breakdown.input`)} ${X(t.inputCost??0)}`,`${V(`usage.breakdown.cacheWrite`)} ${X(t.cacheWriteCost??0)}`,`${V(`usage.breakdown.cacheRead`)} ${X(t.cacheReadCost??0)}`]:[],g=o?J(t.totalTokens):X(t.totalCost),y={dateLabel:St(t.date),tokensLabel:`${J(t.totalTokens)} ${x(V(`usage.metrics.tokens`))}`.trim(),costLabel:X(t.totalCost),breakdownLines:p};return s`
                <openclaw-tooltip
                  .content=${[y.dateLabel,y.tokensLabel,y.costLabel,...y.breakdownLines].join(`
`)}
                >
                  <div
                    class="daily-bar-wrapper ${c?`selected`:``}"
                    role="button"
                    tabindex="0"
                    aria-pressed=${c?`true`:`false`}
                    aria-label=${`${y.dateLabel}: ${y.tokensLabel}, ${y.costLabel}`}
                    @keydown=${e=>Gt(e,t.date,a)}
                    @click=${e=>a(t.date,e.shiftKey)}
                  >
                    ${r===`by-type`?s`
                          <div
                            class="daily-bar daily-bar--stacked"
                            style="height: ${i.toFixed(0)}px;"
                          >
                            ${(()=>{let e=f.reduce((e,t)=>e+t.value,0)||1;return f.map(t=>s`
                                  <div
                                    class="cost-segment ${t.class}"
                                    style="height: ${t.value/e*100}%"
                                  ></div>
                                `)})()}
                          </div>
                        `:s`
                          <div class="daily-bar" style="height: ${i.toFixed(0)}px"></div>
                        `}
                    ${_?s`<div class="daily-bar-total">${g}</div>`:s`<div
                          class="daily-bar-total daily-bar-total--placeholder"
                          aria-hidden="true"
                        ></div>`}
                    <div class="${d}">${u}</div>
                  </div>
                </openclaw-tooltip>
              `})}
          </div>
        </div>
      </div>
    </div>
  `}function Xt(e,t){let n=Kt(e),r=t===`tokens`,i=e.totalTokens||1,a={output:Wt(e.output,i),input:Wt(e.input,i),cacheWrite:Wt(e.cacheWrite,i),cacheRead:Wt(e.cacheRead,i)};return s`
    <div class="cost-breakdown cost-breakdown-compact">
      <div class="cost-breakdown-header">
        ${V(r?`usage.breakdown.tokensByType`:`usage.breakdown.costByType`)}
      </div>
      <div class="cost-breakdown-bar">
        <div
          class="cost-segment output"
          style="width: ${(r?a.output:n.output.pct).toFixed(1)}%"
          title="${V(`usage.breakdown.output`)}: ${r?J(e.output):X(n.output.cost)}"
        ></div>
        <div
          class="cost-segment input"
          style="width: ${(r?a.input:n.input.pct).toFixed(1)}%"
          title="${V(`usage.breakdown.input`)}: ${r?J(e.input):X(n.input.cost)}"
        ></div>
        <div
          class="cost-segment cache-write"
          style="width: ${(r?a.cacheWrite:n.cacheWrite.pct).toFixed(1)}%"
          title="${V(`usage.breakdown.cacheWrite`)}: ${r?J(e.cacheWrite):X(n.cacheWrite.cost)}"
        ></div>
        <div
          class="cost-segment cache-read"
          style="width: ${(r?a.cacheRead:n.cacheRead.pct).toFixed(1)}%"
          title="${V(`usage.breakdown.cacheRead`)}: ${r?J(e.cacheRead):X(n.cacheRead.cost)}"
        ></div>
      </div>
      <div class="cost-breakdown-legend">
        <span class="legend-item"
          ><span class="legend-dot output"></span>${V(`usage.breakdown.output`)}
          ${r?J(e.output):X(n.output.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot input"></span>${V(`usage.breakdown.input`)}
          ${r?J(e.input):X(n.input.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot cache-write"></span>${V(`usage.breakdown.cacheWrite`)}
          ${r?J(e.cacheWrite):X(n.cacheWrite.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot cache-read"></span>${V(`usage.breakdown.cacheRead`)}
          ${r?J(e.cacheRead):X(n.cacheRead.cost)}</span
        >
      </div>
      <div class="cost-breakdown-total">
        ${V(`usage.breakdown.total`)}:
        ${r?J(e.totalTokens):X(e.totalCost)}
      </div>
    </div>
  `}function Zt(e,t,n){return s`
    <div class="usage-insight-card">
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?s`<div class="muted">${n}</div>`:s`
            <div class="usage-list">
              ${t.map(e=>s`
                  <div class="usage-list-item">
                    <span>${e.label}</span>
                    <span class="usage-list-value">
                      <span>${e.value}</span>
                      ${e.sub?s`<span class="usage-list-sub">${e.sub}</span>`:d}
                    </span>
                  </div>
                `)}
            </div>
          `}
    </div>
  `}function Qt(e,t,n,r){let i=[`usage-insight-card`,r?.className].filter(Boolean).join(` `),a=[`usage-error-list`,r?.listClassName].filter(Boolean).join(` `);return s`
    <div class=${i}>
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?s`<div class="muted">${n}</div>`:s`
            <div class=${a}>
              ${t.map(e=>s`
                  <div class="usage-error-row">
                    <div class="usage-error-date">${e.label}</div>
                    <div class="usage-error-rate">${e.value}</div>
                    ${e.sub?s`<div class="usage-error-sub">${e.sub}</div>`:d}
                  </div>
                `)}
            </div>
          `}
    </div>
  `}function $t(e){e.currentTarget instanceof HTMLElement&&e.currentTarget.focus()}function Z(e){let t=`usage-summary-hint-${e.hintId}`,n=`${t}-tooltip`,r=[`stat`,`usage-summary-card`,e.className,e.tone?`usage-summary-card--${e.tone}`:``].filter(Boolean).join(` `),i=[`stat-value`,`usage-summary-value`,e.tone??``,e.compactValue?`usage-summary-value--compact`:``].filter(Boolean).join(` `);return s`
    <div class=${r}>
      <div class="usage-summary-title">
        ${e.title}
        <button
          id=${t}
          type="button"
          class="usage-summary-hint"
          aria-label=${e.hint}
          @click=${$t}
        >
          ?
        </button>
        <!-- Some browsers do not focus buttons on pointer activation; the
             click handler normalizes that path without adding a second toggle. -->
        <wa-tooltip
          id=${n}
          class="usage-summary-tooltip"
          for=${t}
          trigger="hover focus"
        >
          ${e.hint}
        </wa-tooltip>
      </div>
      <div class=${i}>${e.value}</div>
      <div class="usage-summary-sub">${e.sub}</div>
    </div>
  `}function en(e,t,n,i,a,o,c,l){if(!e)return d;let u=t.messages.total?Math.round(e.totalTokens/t.messages.total):0,f=t.messages.total?e.totalCost/t.messages.total:0,p=e.input+e.cacheRead+e.cacheWrite,m=p>0?e.cacheRead/p:0,h=p>0?`${(m*100).toFixed(1)}%`:V(`usage.common.emptyValue`),g=n.errorRate*100,_=n.throughputTokensPerMin===void 0?V(`usage.common.emptyValue`):`${J(Math.round(n.throughputTokensPerMin))} ${V(`usage.overview.tokensPerMinute`)}`,v=n.throughputCostPerMin===void 0?V(`usage.common.emptyValue`):`${X(n.throughputCostPerMin)} ${V(`usage.overview.perMinute`)}`,y=n.durationCount>0?r(n.avgDurationMs,{spaced:!0})??V(`usage.common.emptyValue`):V(`usage.common.emptyValue`),b=V(`usage.overview.cacheHint`),S=V(`usage.overview.errorHint`),C=V(`usage.overview.throughputHint`),w=V(`usage.overview.avgTokensHint`),T=V(i?`usage.overview.avgCostHintMissing`:`usage.overview.avgCostHint`),E=t.daily.filter(e=>e.messages>0&&e.errors>0).map(e=>{let t=e.errors/e.messages;return{label:xt(e.date),value:`${(t*100).toFixed(2)}%`,sub:`${e.errors} ${x(V(`usage.overview.errors`))} · ${e.messages} ${V(`usage.overview.messagesAbbrev`)} · ${J(e.tokens)}`,rate:t}}).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(({rate:e,...t})=>t),ee=t=>a&&e.totalCost>0?V(`usage.overview.costShare`,{percent:(t/e.totalCost*100).toFixed(1)}):null,D=(e,t,n)=>[ee(e),J(t),n===void 0?null:`${n} ${V(`usage.overview.messagesAbbrev`)}`].filter(e=>e!==null).join(` · `),te=t.byModel.slice(0,5).map(e=>({label:e.model??V(`usage.common.unknown`),value:X(e.totals.totalCost),sub:D(e.totals.totalCost,e.totals.totalTokens,e.count)})),O=t.byProvider.slice(0,5).map(e=>({label:e.provider??V(`usage.common.unknown`),value:X(e.totals.totalCost),sub:D(e.totals.totalCost,e.totals.totalTokens,e.count)})),k=t.tools.tools.slice(0,6).map(e=>({label:e.name,value:`${e.count}`,sub:V(`usage.overview.calls`)})),A=t.byAgent.slice(0,5).map(e=>({label:e.agentId,value:X(e.totals.totalCost),sub:D(e.totals.totalCost,e.totals.totalTokens)})),j=t.byChannel.slice(0,5).map(e=>({label:e.channel,value:X(e.totals.totalCost),sub:D(e.totals.totalCost,e.totals.totalTokens)}));return K({title:V(`usage.overview.title`)},s`
      <section class="usage-panel usage-overview-card">
        <div class="usage-overview-layout">
          <div class="usage-summary-grid">
            ${Z({hintId:`messages`,title:V(`usage.overview.messages`),hint:V(`usage.overview.messagesHint`),value:t.messages.total,sub:`${t.messages.user} ${x(V(`usage.overview.user`))} · ${t.messages.assistant} ${x(V(`usage.overview.assistant`))}`,className:`usage-summary-card--hero`})}
            ${Z({hintId:`throughput`,title:V(`usage.overview.throughput`),hint:C,value:_,sub:v,className:`usage-summary-card--hero usage-summary-card--throughput`,compactValue:!0})}
            ${Z({hintId:`tool-calls`,title:V(`usage.overview.toolCalls`),hint:V(`usage.overview.toolCallsHint`),value:t.tools.totalCalls,sub:`${t.tools.uniqueTools} ${V(`usage.overview.toolsUsed`)}`,className:`usage-summary-card--half`})}
            ${Z({hintId:`average-tokens`,title:V(`usage.overview.avgTokens`),hint:w,value:J(u),sub:V(`usage.overview.acrossMessages`,{count:String(t.messages.total||0)}),className:`usage-summary-card--half`})}
            ${Z({hintId:`cache-hit-rate`,title:V(`usage.overview.cacheHitRate`),hint:b,value:h,sub:`${J(e.cacheRead)} ${V(`usage.overview.cached`)} · ${J(p)} ${V(`usage.overview.prompt`)}`,tone:m>.6?`good`:m>.3?`warn`:`bad`,className:`usage-summary-card--medium`})}
            ${Z({hintId:`error-rate`,title:V(`usage.overview.errorRate`),hint:S,value:`${g.toFixed(2)}%`,sub:`${t.messages.errors} ${x(V(`usage.overview.errors`))} · ${y} ${V(`usage.overview.avgSession`)}`,tone:g>5?`bad`:g>1?`warn`:`good`,className:`usage-summary-card--medium`})}
            ${Z({hintId:`average-cost`,title:V(`usage.overview.avgCost`),hint:T,value:X(f),sub:`${X(e.totalCost)} ${x(V(`usage.breakdown.total`))}`,className:`usage-summary-card--compact`})}
            ${Z({hintId:`sessions`,title:V(`usage.overview.sessions`),hint:V(`usage.overview.sessionsHint`),value:c,sub:V(`usage.overview.sessionsInRange`,{count:String(l)}),className:`usage-summary-card--compact`})}
            ${Z({hintId:`errors`,title:V(`usage.overview.errors`),hint:V(`usage.overview.errorsHint`),value:t.messages.errors,sub:`${t.messages.toolResults} ${V(`usage.overview.toolResults`)}`,className:`usage-summary-card--compact`})}
          </div>
          <div class="usage-insights-grid">
            ${Zt(V(`usage.overview.topModels`),te,V(`usage.overview.noModelData`))}
            ${Zt(V(`usage.overview.topProviders`),O,V(`usage.overview.noProviderData`))}
            ${Zt(V(`usage.overview.topTools`),k,V(`usage.overview.noToolCalls`))}
            ${Zt(V(`usage.overview.topAgents`),A,V(`usage.overview.noAgentData`))}
            ${Zt(V(`usage.overview.topChannels`),j,V(`usage.overview.noChannelData`))}
            ${Qt(V(`usage.overview.peakErrorDays`),E,V(`usage.overview.noErrorData`))}
            ${Qt(V(`usage.overview.peakErrorHours`),o,V(`usage.overview.noErrorData`),{className:`usage-insight-card--wide`,listClassName:`usage-error-list--hours`})}
          </div>
        </div>
      </section>
    `)}function tn(e,t,n,i,a,o,c,l,u,f,p,m,h,g,_){let v=e=>h.includes(e),y=e=>{let t=e.label||e.key;return t.startsWith(`agent:`)&&t.includes(`?token=`)?t.slice(0,t.indexOf(`?token=`)):t},b=async e=>{await re(y(e))},S=e=>{let t=[];return v(`channel`)&&e.channel&&t.push(`channel:${e.channel}`),v(`agent`)&&e.agentId&&t.push(`agent:${e.agentId}`),v(`provider`)&&(e.modelProvider||e.providerOverride)&&t.push(`provider:${e.modelProvider??e.providerOverride}`),v(`model`)&&e.model&&t.push(`model:${e.model}`),v(`messages`)&&e.usage?.messageCounts&&t.push(`msgs:${e.usage.messageCounts.total}`),v(`tools`)&&e.usage?.toolUsage&&t.push(`tools:${e.usage.toolUsage.totalCalls}`),v(`errors`)&&e.usage?.messageCounts&&t.push(`errors:${e.usage.messageCounts.errors}`),v(`duration`)&&e.usage?.durationMs&&t.push(`dur:${r(e.usage.durationMs,{spaced:!0})??`—`}`),t},C=new Set(n),w=(e,t)=>{let n=e.usage;return n?C.size>0&&n.dailyBreakdown&&n.dailyBreakdown.length>0?n.dailyBreakdown.reduce((e,n)=>C.has(n.date)?e+(t===`tokens`?n.tokens:n.cost):e,0):t===`tokens`?n.totalTokens??0:n.totalCost??0:0},T=e=>w(e,i?`tokens`:`cost`),E=e=>{switch(a){case`recent`:return e.updatedAt??0;case`messages`:return e.usage?.messageCounts?.total??0;case`errors`:return e.usage?.messageCounts?.errors??0;case`cost`:return w(e,`cost`);case`tokens`:return w(e,`tokens`)}return a},ee=[...e].toSorted((e,t)=>{let n=E(t)-E(e);if(n!==0)return n;let r=(t.updatedAt??0)-(e.updatedAt??0);return r===0?y(e).localeCompare(y(t)):r}),D=o===`asc`?ee.toReversed():ee,te=D.reduce((e,t)=>e+T(t),0),O=D.length?te/D.length:0,k=D.reduce((e,t)=>e+(t.usage?.messageCounts?.errors??0),0),A=(e,t)=>{let n=T(e),r=y(e),a=S(e);return s`
      <div
        class="session-bar-row ${t?`selected`:``}"
        @click=${t=>u(e.key,t.shiftKey)}
        title="${e.key}"
      >
        <div class="session-bar-label">
          <div class="session-bar-title">${r}</div>
          ${a.length>0?s`<div class="session-bar-meta">${a.join(` · `)}</div>`:d}
        </div>
        <div class="session-bar-actions">
          <button
            class="btn btn--sm btn--ghost"
            @click=${t=>{t.stopPropagation(),b(e)}}
          >
            ${V(`usage.sessions.copy`)}
          </button>
          <div class="session-bar-value">
            ${i?J(n):X(n)}
          </div>
        </div>
      </div>
    `},j=new Set(t),M=D.filter(e=>j.has(e.key)),N=M.length,P=new Map(D.map(e=>[e.key,e])),F=c.map(e=>P.get(e)).filter(e=>!!e);return K({title:V(`usage.sessions.title`)},s`
      <div class="usage-panel sessions-card">
        <div class="sessions-card-header">
          <div class="sessions-card-count">
            ${V(`usage.sessions.shown`,{count:String(e.length)})}
            ${g===e.length?``:` · ${V(`usage.sessions.total`,{count:String(g)})}`}
          </div>
        </div>
        <div class="sessions-card-meta">
          <div class="sessions-card-stats">
            <span>
              ${i?J(O):X(O)}
              ${V(`usage.sessions.avg`)}
            </span>
            <span
              >${k} ${x(V(`usage.overview.errors`))}</span
            >
          </div>
          <div class="chart-toggle small">
            <button
              class="btn btn--sm toggle-btn ${l===`all`?`active`:``}"
              @click=${()=>m(`all`)}
            >
              ${V(`usage.sessions.all`)}
            </button>
            <button
              class="btn btn--sm toggle-btn ${l===`recent`?`active`:``}"
              @click=${()=>m(`recent`)}
            >
              ${V(`usage.sessions.recent`)}
            </button>
          </div>
          <label class="sessions-sort">
            <span>${V(`usage.sessions.sort`)}</span>
            <select
              class="settings-select"
              @change=${e=>f(e.target.value)}
            >
              <option value="cost" ?selected=${a===`cost`}>
                ${V(`usage.metrics.cost`)}
              </option>
              <option value="errors" ?selected=${a===`errors`}>
                ${V(`usage.overview.errors`)}
              </option>
              <option value="messages" ?selected=${a===`messages`}>
                ${V(`usage.overview.messages`)}
              </option>
              <option value="recent" ?selected=${a===`recent`}>
                ${V(`usage.sessions.recentShort`)}
              </option>
              <option value="tokens" ?selected=${a===`tokens`}>
                ${V(`usage.metrics.tokens`)}
              </option>
            </select>
          </label>
          <openclaw-tooltip
            .content=${V(o===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
          >
            <button
              class="btn btn--sm"
              aria-label=${V(o===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
              @click=${()=>p(o===`desc`?`asc`:`desc`)}
            >
              ${o===`desc`?`↓`:`↑`}
            </button>
          </openclaw-tooltip>
          ${N>0?s`
                <button class="btn btn--sm" @click=${_}>
                  ${V(`usage.sessions.clearSelection`)}
                </button>
              `:d}
        </div>
        ${l===`recent`?F.length===0?s` <div class="usage-empty-block">${V(`usage.sessions.noRecent`)}</div> `:s`
                <div class="session-bars session-bars--recent">
                  ${F.map(e=>A(e,j.has(e.key)))}
                </div>
              `:e.length===0?s` <div class="usage-empty-block">${V(`usage.sessions.noneInRange`)}</div> `:s`
                <div class="session-bars">
                  ${D.slice(0,50).map(e=>A(e,j.has(e.key)))}
                  ${e.length>50?s`
                        <div class="usage-more-sessions">
                          ${V(`usage.sessions.more`,{count:String(e.length-50)})}
                        </div>
                      `:d}
                </div>
              `}
        ${N>1?s`
              <div class="sessions-selected-group">
                <div class="sessions-card-count">
                  ${V(`usage.sessions.selected`,{count:String(N)})}
                </div>
                <div class="session-bars session-bars--selected">
                  ${M.map(e=>A(e,!0))}
                </div>
              </div>
            `:d}
      </div>
    `)}var nn=e((()=>{b(),_(),l(),t(),q(),H(),U(),ie(),C(),jt()}));function rn(e,t){return!t||t<=0?0:e/t*100}function an(e){return e<0xe8d4a51000?e*1e3:e}function on(e,t,n){let r=Number(e.slice(0,4)),i=Number(e.slice(5,7))-1,a=Number(e.slice(8,10))+n;return t===`utc`?Date.UTC(r,i,a):new Date(r,i,a).getTime()}function sn(e,t){let n=new Date(e),r=t===`utc`?n.getUTCFullYear():n.getFullYear(),i=(t===`utc`?n.getUTCMonth():n.getMonth())+1,a=t===`utc`?n.getUTCDate():n.getDate();return`${r}-${String(i).padStart(2,`0`)}-${String(a).padStart(2,`0`)}`}function cn(e,t,n){let r=Math.min(t,n),i=Math.max(t,n);return e.filter(e=>{if(e.timestamp<=0)return!0;let t=an(e.timestamp);return t>=r&&t<=i})}function ln(e,t,n){let i=t||e.usage;if(!i)return s` <div class="usage-empty-block">${V(`usage.details.noUsageData`)}</div> `;let a=e=>e?L(e):V(`usage.common.emptyValue`),o=[];e.channel&&o.push(`channel:${e.channel}`),e.agentId&&o.push(`agent:${e.agentId}`),(e.modelProvider||e.providerOverride)&&o.push(`provider:${e.modelProvider??e.providerOverride}`),e.model&&o.push(`model:${e.model}`);let c=i.toolUsage?.tools.slice(0,6)??[],l,u,f;if(n){let e=new Map;for(let t of n){let{tools:n}=De(t.content);for(let[t]of n)e.set(t,(e.get(t)||0)+1)}f=c.map(t=>({label:t.name,value:`${e.get(t.name)??0}`,sub:V(`usage.overview.calls`)})),l=[...e.values()].reduce((e,t)=>e+t,0),u=e.size}else f=c.map(e=>({label:e.name,value:`${e.count}`,sub:V(`usage.overview.calls`)})),l=i.toolUsage?.totalCalls??0,u=i.toolUsage?.uniqueTools??0;let p=i.modelUsage?.slice(0,6).map(e=>({label:e.model??V(`usage.common.unknown`),value:gt(e.totals.totalCost),sub:J(e.totals.totalTokens)}))??[];return s`
    ${o.length>0?s`<div class="usage-badges">
          ${o.map(e=>s`<span class="settings-row__value">${e}</span>`)}
        </div>`:d}
    <div class="session-summary-grid">
      <div class="stat session-summary-card">
        <div class="session-summary-title">${V(`usage.overview.messages`)}</div>
        <div class="stat-value session-summary-value">${i.messageCounts?.total??0}</div>
        <div class="session-summary-meta">
          ${i.messageCounts?.user??0}
          ${x(V(`usage.overview.user`))} ·
          ${i.messageCounts?.assistant??0}
          ${x(V(`usage.overview.assistant`))}
        </div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${V(`usage.overview.toolCalls`)}</div>
        <div class="stat-value session-summary-value">${l}</div>
        <div class="session-summary-meta">${u} ${V(`usage.overview.toolsUsed`)}</div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${V(`usage.overview.errors`)}</div>
        <div class="stat-value session-summary-value">${i.messageCounts?.errors??0}</div>
        <div class="session-summary-meta">
          ${i.messageCounts?.toolResults??0} ${V(`usage.overview.toolResults`)}
        </div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${V(`usage.details.duration`)}</div>
        <div class="stat-value session-summary-value">
          ${r(i.durationMs,{spaced:!0})??V(`usage.common.emptyValue`)}
        </div>
        <div class="session-summary-meta">
          ${a(i.firstActivity)} → ${a(i.lastActivity)}
        </div>
      </div>
    </div>
    <div class="usage-insights-grid usage-insights-grid--tight">
      ${Zt(V(`usage.overview.topTools`),f,V(`usage.overview.noToolCalls`))}
      ${Zt(V(`usage.details.modelMix`),p,V(`usage.overview.noModelData`))}
    </div>
  `}function un(e,t,n,r){let i=Math.min(n,r),a=Math.max(n,r),o=t.filter(e=>e.timestamp>=i&&e.timestamp<=a);if(o.length===0)return;let s=0,c=0,l=0,u=0,d=0,f=0,p=0,m=0;for(let e of o)s+=e.totalTokens||0,c+=e.cost||0,d+=e.input||0,f+=e.output||0,p+=e.cacheRead||0,m+=e.cacheWrite||0,e.output>0&&u++,e.input>0&&l++;let g=h(o[0],`filtered usage first point`),_=h(o.at(-1),`filtered usage last point`);return{...e,totalTokens:s,totalCost:c,input:d,output:f,cacheRead:p,cacheWrite:m,durationMs:_.timestamp-g.timestamp,firstActivity:g.timestamp,lastActivity:_.timestamp,messageCounts:{total:o.length,user:l,assistant:u,toolCalls:0,toolResults:0,errors:0}}}function dn(e,t,n,r,i,a,o,c,l,u,f,p,m,h,g,_,y,b,S,C,w,T,E,ee,D,te,O,k,A,j,M){let N=e.label||e.key,P=N.length>50?v(N,50)+`…`:N,F=e.usage,I=u!==null&&f!==null,L=u!==null&&f!==null&&t?.points&&F?un(F,t.points,u,f):void 0,R=L?{totalTokens:L.totalTokens,totalCost:L.totalCost}:{totalTokens:F?.totalTokens??0,totalCost:F?.totalCost??0},ne=L?V(`usage.details.filtered`):``;return s`
    <div class="settings-group usage-panel session-detail-panel">
      <div class="session-detail-header">
        <div class="session-detail-header-left">
          <div class="session-detail-title">
            ${P}
            ${ne?s`<span class="session-detail-indicator">${ne}</span>`:d}
          </div>
        </div>
        <div class="session-detail-stats">
          ${F?s`
                <span
                  ><strong>${J(R.totalTokens)}</strong>
                  ${x(V(`usage.metrics.tokens`))}${ne}</span
                >
                <span><strong>${gt(R.totalCost)}</strong>${ne}</span>
              `:d}
        </div>
        <openclaw-tooltip .content=${V(`usage.details.close`)}>
          <button
            class="btn btn--sm btn--ghost"
            @click=${M}
            aria-label=${V(`usage.details.close`)}
          >
            ×
          </button>
        </openclaw-tooltip>
      </div>
      ${e.scope===`family`&&e.includedSessionIds?.length?s`
            <div class="usage-lineage-note">
              ${V(`usage.scope.familyIncluded`,{count:String(e.includedSessionIds.length)})}
            </div>
          `:d}
      <div class="session-detail-content">
        ${ln(e,L,u!=null&&f!=null&&y?cn(y,u,f):void 0)}
        <div class="session-detail-row">
          ${fn(t,n,r,i,a,o,c,l,m,h,g,_,u,f,p)}
        </div>
        <div class="session-detail-bottom">
          ${mn(y,b,S,C,w,T,E,ee,D,te,O,k,I?u:null,I?f:null)}
          ${pn(e.contextWeight,F,A,j)}
        </div>
      </div>
    </div>
  `}function fn(e,t,n,r,i,a,o,c,l,u,p,m=`local`,g,_,v){if(t&&!n.hasLoaded)return s`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${V(`usage.loading.badge`)}</div>
      </div>
    `;let y=fe({status:n,errorMessage:n.error?V(`usage.details.loadFailed`,{detail:x(V(`usage.details.usageOverTime`)),error:n.error}):void 0,onRetry:r,className:`usage-callout usage-detail-error--timeline`});if(n.error&&!n.hasLoaded)return s`
      <div class="session-timeseries-compact">
        <div class="card-title usage-section-title">${V(`usage.details.usageOverTime`)}</div>
        ${y}
      </div>
    `;if(!e||e.points.length<2)return s`
      <div class="session-timeseries-compact">
        ${y}
        <div class="usage-empty-block">${V(`usage.details.noTimeline`)}</div>
      </div>
    `;let b=e.points;if(l||u||p&&p.length>0){let t=l?on(l,m,0):0,n=u?on(u,m,1):1/0,r=p?.length?new Set(p):void 0;b=e.points.filter(e=>e.timestamp<t||e.timestamp>=n?!1:r?r.has(sn(e.timestamp,m)):!0)}if(b.length<2)return s`
      <div class="session-timeseries-compact">
        ${y}
        <div class="usage-empty-block">${V(`usage.details.noDataInRange`)}</div>
      </div>
    `;let S=0,C=0,w=0,T=0,E=0,ee=0;b=b.map(e=>(S+=e.totalTokens,C+=e.cost,w+=e.output,T+=e.input,E+=e.cacheRead,ee+=e.cacheWrite,{...e,cumulativeTokens:S,cumulativeCost:C}));let D=g!=null&&_!=null,O=D?Math.min(g,_):0,A=D?Math.max(g,_):1/0,j=0,M=b.length;if(D){j=b.findIndex(e=>e.timestamp>=O),j===-1&&(j=b.length);let e=b.findIndex(e=>e.timestamp>A);M=e===-1?b.length:e}let N=D?b.slice(j,M):b,P=0,F=0,I=0,L=0;for(let e of N)P+=e.output,F+=e.input,I+=e.cacheRead,L+=e.cacheWrite;let R={top:8,right:4,bottom:14,left:30},ne=400-R.left-R.right,z=100-R.top-R.bottom,B=i===`cumulative`,H=i===`per-turn`&&o===`by-type`,U=m===`utc`?{timeZone:`UTC`}:{},W=P+F+I+L,re=b.map(e=>B?e.cumulativeTokens:H?e.input+e.output+e.cacheRead+e.cacheWrite:e.totalTokens),ie=Math.max(...re,1),ae=ne/b.length,G=Math.min(gn,Math.max(1,ae*hn)),oe=ae-G,K=R.left+j*(G+oe),q=M>=b.length?R.left+(b.length-1)*(G+oe)+G:R.left+(M-1)*(G+oe)+G;return s`
    <div class="session-timeseries-compact">
      <div class="timeseries-header-row">
        <div class="card-title usage-section-title">${V(`usage.details.usageOverTime`)}</div>
        <div class="timeseries-controls">
          ${D?s`
                <div class="chart-toggle small">
                  <button
                    class="btn btn--sm toggle-btn active"
                    @click=${()=>v?.(null,null)}
                  >
                    ${V(`usage.details.reset`)}
                  </button>
                </div>
              `:d}
          <div class="chart-toggle small">
            <button
              class="btn btn--sm toggle-btn ${B?``:`active`}"
              @click=${()=>a(`per-turn`)}
            >
              ${V(`usage.details.perTurn`)}
            </button>
            <button
              class="btn btn--sm toggle-btn ${B?`active`:``}"
              @click=${()=>a(`cumulative`)}
            >
              ${V(`usage.details.cumulative`)}
            </button>
          </div>
          ${B?d:s`
                <div class="chart-toggle small">
                  <button
                    class="btn btn--sm toggle-btn ${o===`total`?`active`:``}"
                    @click=${()=>c(`total`)}
                  >
                    ${V(`usage.daily.total`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${o===`by-type`?`active`:``}"
                    @click=${()=>c(`by-type`)}
                  >
                    ${V(`usage.daily.byType`)}
                  </button>
                </div>
              `}
        </div>
      </div>
      ${y}
      <div class="timeseries-chart-wrapper">
        <svg viewBox="0 0 ${400} ${118}" class="timeseries-svg">
          <!-- Y axis -->
          <line
            x1="${R.left}"
            y1="${R.top}"
            x2="${R.left}"
            y2="${R.top+z}"
            stroke="var(--border)"
          />
          <!-- X axis -->
          <line
            x1="${R.left}"
            y1="${R.top+z}"
            x2="${400-R.right}"
            y2="${R.top+z}"
            stroke="var(--border)"
          />
          <!-- Y axis labels -->
          <text
            x="${R.left-4}"
            y="${R.top+5}"
            text-anchor="end"
            class="ts-axis-label"
          >
            ${J(ie)}
          </text>
          <text
            x="${R.left-4}"
            y="${R.top+z}"
            text-anchor="end"
            class="ts-axis-label"
          >
            0
          </text>
          <!-- X axis labels (first and last) -->
          ${b.length>0?f`
            <text x="${R.left}" y="${R.top+z+10}" text-anchor="start" class="ts-axis-label">${k(h(b[0],`time series first point`).timestamp,{hour:`2-digit`,minute:`2-digit`,...U},``)}</text>
            <text x="${400-R.right}" y="${R.top+z+10}" text-anchor="end" class="ts-axis-label">${k(h(b.at(-1),`time series last point`).timestamp,{hour:`2-digit`,minute:`2-digit`,...U},``)}</text>
          `:d}
          <!-- Bars -->
          ${b.map((e,t)=>{let n=h(re[t],`time series bar total`),r=R.left+t*(G+oe),i=n/ie*z,a=R.top+z-i,o=[te(e.timestamp,{month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`,...U},``),`${J(n)} ${x(V(`usage.metrics.tokens`))}`];H&&(o.push(`Out ${J(e.output)}`),o.push(`In ${J(e.input)}`),o.push(`CW ${J(e.cacheWrite)}`),o.push(`CR ${J(e.cacheRead)}`));let s=o.join(` · `),c=D&&(t<j||t>=M);if(!H)return f`<rect x="${r}" y="${a}" width="${G}" height="${i}" class="ts-bar${c?` dimmed`:``}" rx="1"><title>${s}</title></rect>`;let l=[{value:e.output,cls:`output`},{value:e.input,cls:`input`},{value:e.cacheWrite,cls:`cache-write`},{value:e.cacheRead,cls:`cache-read`}],u=R.top+z,p=c?` dimmed`:``;return f`
              ${l.map(e=>{if(e.value<=0||n<=0)return d;let t=i*(e.value/n);return u-=t,f`<rect x="${r}" y="${u}" width="${G}" height="${t}" class="ts-bar ${e.cls}${p}" rx="1"><title>${s}</title></rect>`})}
            `})}
          <!-- Selection highlight overlay (always visible between handles) -->
          ${f`
            <rect 
              x="${K}" 
              y="${R.top}" 
              width="${Math.max(1,q-K)}" 
              height="${z}" 
              fill="var(--accent)" 
              opacity="${_n}" 
              pointer-events="none"
            />
          `}
          <!-- Left cursor line + handle -->
          ${f`
            <line x1="${K}" y1="${R.top}" x2="${K}" y2="${R.top+z}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${K-vn/2}" y="${R.top+z/2-Q/2}" width="${vn}" height="${Q}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${K-yn}" y1="${R.top+z/2-Q/5}" x2="${K-yn}" y2="${R.top+z/2+Q/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${K+yn}" y1="${R.top+z/2-Q/5}" x2="${K+yn}" y2="${R.top+z/2+Q/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
          <!-- Right cursor line + handle -->
          ${f`
            <line x1="${q}" y1="${R.top}" x2="${q}" y2="${R.top+z}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${q-vn/2}" y="${R.top+z/2-Q/2}" width="${vn}" height="${Q}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${q-yn}" y1="${R.top+z/2-Q/5}" x2="${q-yn}" y2="${R.top+z/2+Q/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${q+yn}" y1="${R.top+z/2-Q/5}" x2="${q+yn}" y2="${R.top+z/2+Q/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
        </svg>
        <!-- Handle drag zones (only on handles, not full chart) -->
        ${(()=>{let e=`${(K/400*100).toFixed(1)}%`,t=`${(q/400*100).toFixed(1)}%`,n=e=>t=>{if(!v)return;t.preventDefault(),t.stopPropagation();let n=t.currentTarget.closest(`.timeseries-chart-wrapper`)?.querySelector(`svg`);if(!n)return;let r=n.getBoundingClientRect(),i=r.width,a=R.left/400*i,o=(400-R.right)/400*i-a,s=e=>{let t=Math.max(0,Math.min(1,(e-r.left-a)/o));return Math.min(Math.floor(t*b.length),b.length-1)},c=e===`left`?K:q,l=r.left+c/400*i,u=t.clientX-l;document.body.style.cursor=`col-resize`;let d=t=>{let n=t.clientX-u,r=s(n),i=b[r];if(i)if(e===`left`){let e=_??h(b.at(-1),`time series right cursor point`).timestamp;v(Math.min(i.timestamp,e),e)}else{let e=g??h(b[0],`time series left cursor point`).timestamp;v(e,Math.max(i.timestamp,e))}},f=()=>{document.body.style.cursor=``,document.removeEventListener(`mousemove`,d),document.removeEventListener(`mouseup`,f)};document.addEventListener(`mousemove`,d),document.addEventListener(`mouseup`,f)};return s`
            <div
              class="chart-handle-zone chart-handle-left"
              style="left: ${e};"
              @mousedown=${n(`left`)}
            ></div>
            <div
              class="chart-handle-zone chart-handle-right"
              style="left: ${t};"
              @mousedown=${n(`right`)}
            ></div>
          `})()}
      </div>
      <div class="timeseries-summary">
        ${D?s`
              <span class="timeseries-summary__range">
                ${V(`usage.details.turnRange`,{start:String(j+1),end:String(M),total:String(b.length)})}
              </span>
              ·
              ${k(O,{hour:`2-digit`,minute:`2-digit`,...U},``)}–${k(A,{hour:`2-digit`,minute:`2-digit`,...U},``)}
              ·
              ${J(P+F+I+L)}
              · ${gt(N.reduce((e,t)=>e+(t.cost||0),0))}
            `:s`${b.length} ${V(`usage.overview.messagesAbbrev`)} · ${J(S)}
            · ${gt(C)}`}
      </div>
      ${H?s`
            <div class="timeseries-breakdown">
              <div class="card-title usage-section-title">${V(`usage.breakdown.tokensByType`)}</div>
              <div class="cost-breakdown-bar cost-breakdown-bar--compact">
                <div
                  class="cost-segment output"
                  style="width: ${rn(P,W).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment input"
                  style="width: ${rn(F,W).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment cache-write"
                  style="width: ${rn(L,W).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment cache-read"
                  style="width: ${rn(I,W).toFixed(1)}%"
                ></div>
              </div>
              <div class="cost-breakdown-legend">
                <div class="legend-item" title=${V(`usage.details.assistantOutputTokens`)}>
                  <span class="legend-dot output"></span>${V(`usage.breakdown.output`)}
                  ${J(P)}
                </div>
                <div class="legend-item" title=${V(`usage.details.userToolInputTokens`)}>
                  <span class="legend-dot input"></span>${V(`usage.breakdown.input`)}
                  ${J(F)}
                </div>
                <div class="legend-item" title=${V(`usage.details.tokensWrittenToCache`)}>
                  <span class="legend-dot cache-write"></span>${V(`usage.breakdown.cacheWrite`)}
                  ${J(L)}
                </div>
                <div class="legend-item" title=${V(`usage.details.tokensReadFromCache`)}>
                  <span class="legend-dot cache-read"></span>${V(`usage.breakdown.cacheRead`)}
                  ${J(I)}
                </div>
              </div>
              <div class="cost-breakdown-total">
                ${V(`usage.breakdown.total`)}: ${J(W)}
              </div>
            </div>
          `:d}
    </div>
  `}function pn(e,t,n,r){if(!e)return s`
      <div class="context-details-panel">
        <div class="usage-empty-block">${V(`usage.details.noContextData`)}</div>
      </div>
    `;let i=nt(e.systemPrompt.chars),a=nt(e.skills.promptChars),o=nt(e.tools.listChars+e.tools.schemaChars),c=nt(e.injectedWorkspaceFiles.reduce((e,t)=>e+t.injectedChars,0)),l=i+a+o+c,u=``;if(t&&t.totalTokens>0){let e=t.input+t.cacheRead;e>0&&(u=`~${Math.min(l/e*100,100).toFixed(0)}% ${V(`usage.details.ofInput`)}`)}let f=e.skills.entries.toSorted((e,t)=>t.blockChars-e.blockChars),p=e.tools.entries.toSorted((e,t)=>t.summaryChars+t.schemaChars-(e.summaryChars+e.schemaChars)),m=e.injectedWorkspaceFiles.toSorted((e,t)=>t.injectedChars-e.injectedChars),h=n,g=h?f:f.slice(0,4),_=h?p:p.slice(0,4),v=h?m:m.slice(0,4),y=f.length>4||p.length>4||m.length>4;return s`
    <div class="context-details-panel">
      <div class="context-breakdown-header">
        <div class="card-title usage-section-title">
          ${V(`usage.details.systemPromptBreakdown`)}
        </div>
        ${y?s`<button class="btn btn--sm" @click=${r}>
              ${V(h?`usage.details.collapse`:`usage.details.expandAll`)}
            </button>`:d}
      </div>
      <p class="context-weight-desc">${u||V(`usage.details.baseContextPerMessage`)}</p>
      <div class="context-stacked-bar">
        <div
          class="context-segment system"
          style="width: ${rn(i,l).toFixed(1)}%"
          title="${V(`usage.details.system`)}: ~${J(i)}"
        ></div>
        <div
          class="context-segment skills"
          style="width: ${rn(a,l).toFixed(1)}%"
          title="${V(`usage.details.skills`)}: ~${J(a)}"
        ></div>
        <div
          class="context-segment tools"
          style="width: ${rn(o,l).toFixed(1)}%"
          title="${V(`usage.details.tools`)}: ~${J(o)}"
        ></div>
        <div
          class="context-segment files"
          style="width: ${rn(c,l).toFixed(1)}%"
          title="${V(`usage.details.files`)}: ~${J(c)}"
        ></div>
      </div>
      <div class="context-legend">
        <span class="legend-item"
          ><span class="legend-dot system"></span>${V(`usage.details.systemShort`)}
          ~${J(i)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot skills"></span>${V(`usage.details.skills`)}
          ~${J(a)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot tools"></span>${V(`usage.details.tools`)}
          ~${J(o)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot files"></span>${V(`usage.details.files`)}
          ~${J(c)}</span
        >
      </div>
      <div class="context-total">
        ${V(`usage.breakdown.total`)}: ~${J(l)}
      </div>
      <div class="context-breakdown-grid">
        ${f.length>0?(()=>{let e=f.length-g.length;return s`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${V(`usage.details.skills`)} (${f.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${g.map(e=>s`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted">~${J(nt(e.blockChars))}</span>
                        </div>
                      `)}
                  </div>
                  ${e>0?s`
                        <div class="context-breakdown-more">
                          ${V(`usage.sessions.more`,{count:String(e)})}
                        </div>
                      `:d}
                </div>
              `})():d}
        ${p.length>0?(()=>{let e=p.length-_.length;return s`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${V(`usage.details.tools`)} (${p.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${_.map(e=>s`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted"
                            >~${J(nt(e.summaryChars+e.schemaChars))}</span
                          >
                        </div>
                      `)}
                  </div>
                  ${e>0?s`
                        <div class="context-breakdown-more">
                          ${V(`usage.sessions.more`,{count:String(e)})}
                        </div>
                      `:d}
                </div>
              `})():d}
        ${m.length>0?(()=>{let e=m.length-v.length;return s`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${V(`usage.details.files`)} (${m.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${v.map(e=>s`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted"
                            >~${J(nt(e.injectedChars))}</span
                          >
                        </div>
                      `)}
                  </div>
                  ${e>0?s`
                        <div class="context-breakdown-more">
                          ${V(`usage.sessions.more`,{count:String(e)})}
                        </div>
                      `:d}
                </div>
              `})():d}
      </div>
    </div>
  `}function mn(e,t,n,r,i,a,o,c,l,u,f,p,m,h){if(t&&!n.hasLoaded)return s`
      <div class="session-logs-compact">
        <div class="session-logs-header">${V(`usage.details.conversation`)}</div>
        <div class="usage-empty-block">${V(`usage.loading.badge`)}</div>
      </div>
    `;let g=fe({status:n,errorMessage:n.error?V(`usage.details.loadFailed`,{detail:x(V(`usage.details.conversation`)),error:n.error}):void 0,onRetry:r,className:`usage-callout usage-detail-error--conversation`});if(n.error&&!n.hasLoaded)return s`
      <div class="session-logs-compact">
        <div class="session-logs-header">${V(`usage.details.conversation`)}</div>
        ${g}
      </div>
    `;if(!e||e.length===0)return s`
      <div class="session-logs-compact">
        <div class="session-logs-header">${V(`usage.details.conversation`)}</div>
        ${g}
        <div class="usage-empty-block">${V(`usage.details.noMessages`)}</div>
      </div>
    `;let _=x(o.query),v=e.map(e=>{let t=De(e.content);return{log:e,toolInfo:t,cleanContent:t.cleanContent||e.content}}),y=Array.from(new Set(v.flatMap(e=>e.toolInfo.tools.map(([e])=>e)))).toSorted((e,t)=>e.localeCompare(t)),b=v.filter(e=>{if(m!=null&&h!=null){let t=e.log.timestamp;if(t>0){let e=Math.min(m,h),n=Math.max(m,h),r=an(t);if(r<e||r>n)return!1}}return!(o.roles.length>0&&!o.roles.includes(e.log.role)||o.hasTools&&e.toolInfo.tools.length===0||o.tools.length>0&&!e.toolInfo.tools.some(([e])=>o.tools.includes(e))||_&&!x(e.cleanContent).includes(_))}),S=o.roles.length>0||o.tools.length>0||o.hasTools||_,C=m!=null&&h!=null,w=S||C?`${b.length} ${V(`usage.details.of`)} ${e.length}${C?` (${V(`usage.details.timelineFiltered`)})`:``}`:`${e.length}`,T=new Set(o.roles),E=new Set(o.tools);return s`
    <div class="session-logs-compact">
      <div class="session-logs-header">
        <span>
          ${V(`usage.details.conversation`)}
          <span class="session-logs-header-count">
            (${w} ${x(V(`usage.overview.messages`))})
          </span>
        </span>
        <button class="btn btn--sm" @click=${a}>
          ${V(i?`usage.details.collapseAll`:`usage.details.expandAll`)}
        </button>
      </div>
      ${g}
      <div class="usage-filters-inline session-log-filters">
        <select
          multiple
          size="4"
          aria-label=${V(`usage.details.filterByRole`)}
          @change=${e=>c(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          <option value="user" ?selected=${T.has(`user`)}>
            ${V(`usage.overview.user`)}
          </option>
          <option value="assistant" ?selected=${T.has(`assistant`)}>
            ${V(`usage.overview.assistant`)}
          </option>
          <option value="tool" ?selected=${T.has(`tool`)}>
            ${V(`usage.details.tool`)}
          </option>
          <option value="toolResult" ?selected=${T.has(`toolResult`)}>
            ${V(`usage.details.toolResult`)}
          </option>
        </select>
        <select
          multiple
          size="4"
          aria-label=${V(`usage.details.filterByTool`)}
          @change=${e=>l(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${y.map(e=>s`<option value=${e} ?selected=${E.has(e)}>${e}</option>`)}
        </select>
        <label class="usage-filters-inline session-log-has-tools">
          <input
            type="checkbox"
            .checked=${o.hasTools}
            @change=${e=>u(e.target.checked)}
          />
          ${V(`usage.details.hasTools`)}
        </label>
        <input
          type="text"
          placeholder=${V(`usage.details.searchConversation`)}
          aria-label=${V(`usage.details.searchConversation`)}
          .value=${o.query}
          @input=${e=>f(e.target.value)}
        />
        <button class="btn btn--sm" @click=${p}>${V(`usage.filters.clear`)}</button>
      </div>
      <div class="session-logs-list">
        ${b.map(e=>{let{log:t,toolInfo:n,cleanContent:r}=e;return s`
            <div class="session-log-entry ${t.role===`user`?`user`:`assistant`}">
              <div class="session-log-meta">
                <span class="session-log-role">${t.role===`user`?V(`usage.details.you`):t.role===`assistant`?V(`usage.overview.assistant`):V(`usage.details.tool`)}</span>
                <span>${L(t.timestamp)}</span>
                ${t.tokens?s`<span>${J(t.tokens)}</span>`:d}
              </div>
              <div class="session-log-content">${r}</div>
              ${n.tools.length>0?s`
                    <details class="session-log-tools" ?open=${i}>
                      <summary>${n.summary}</summary>
                      <div class="session-log-tools-list">
                        ${n.tools.map(([e,t])=>s`
                            <span class="session-log-tools-pill">${e} × ${t}</span>
                          `)}
                      </div>
                    </details>
                  `:d}
            </div>
          `})}
        ${b.length===0?s`
              <div class="usage-empty-block usage-empty-block--compact">
                ${V(`usage.details.noMessagesMatch`)}
              </div>
            `:d}
      </div>
    </div>
  `}var hn,gn,_n,vn,Q,yn,bn=e((()=>{b(),_(),l(),t(),le(),H(),U(),w(),C(),Ue(),jt(),nn(),hn=.75,gn=8,_n=.06,vn=5,Q=12,yn=.7}));function xn(){return{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}}function Sn(e,t){return e.input+=t.input,e.output+=t.output,e.cacheRead+=t.cacheRead,e.cacheWrite+=t.cacheWrite,e.totalTokens+=t.totalTokens,e.totalCost+=t.totalCost,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0,e}function Cn(e,t){return s`
    <span class="settings-status settings-status--accent" title=${t??d}>
      <span class="usage-loading-spinner" aria-hidden="true"></span>
      ${e}
    </span>
  `}function wn(e){return K({title:V(`usage.loading.title`),actions:Cn(V(`usage.loading.badge`))},s`
      <div class="usage-panel usage-loading-card">
        <div class="usage-loading-header">
          <div class="usage-loading-controls">
            <div class="usage-date-range usage-date-range--loading">
              <input class="usage-date-input" type="date" .value=${e.startDate} disabled />
              <span class="usage-separator">${V(`usage.filters.to`)}</span>
              <input class="usage-date-input" type="date" .value=${e.endDate} disabled />
            </div>
          </div>
        </div>
        <div class="usage-loading-grid">
          <div class="usage-skeleton-block usage-skeleton-block--tall"></div>
          <div class="usage-skeleton-block"></div>
          <div class="usage-skeleton-block"></div>
        </div>
      </div>
    `)}function Tn(e){return s`
    <section class="settings-group usage-panel usage-empty-state">
      <div class="usage-empty-state__title">${V(`usage.empty.title`)}</div>
      <div class="card-sub usage-empty-state__subtitle">${V(`usage.empty.subtitle`)}</div>
      <div class="usage-empty-state__features">
        <span class="usage-empty-state__feature">${V(`usage.empty.featureOverview`)}</span>
        <span class="usage-empty-state__feature">${V(`usage.empty.featureSessions`)}</span>
        <span class="usage-empty-state__feature">${V(`usage.empty.featureTimeline`)}</span>
      </div>
      <div class="usage-empty-state__actions">
        <button class="btn primary" @click=${e}>${V(`common.refresh`)}</button>
      </div>
    </section>
  `}function En(e){return e.length===0?d:K({title:V(`usage.providerUsage.title`),count:e.length,description:V(`usage.providerUsage.subtitle`)},s`
      <div class="usage-panel provider-usage-section">
        <div class="provider-usage-grid">
          ${e.map(e=>s`
              <article class="provider-usage-card">
                <div class="provider-usage-card__header">
                  <div>
                    <div class="provider-usage-card__name">${e.displayName}</div>
                    <div class="provider-usage-card__id">${e.provider}</div>
                  </div>
                  ${e.plan?s`<span class="provider-usage-plan">${e.plan}</span>`:d}
                </div>
                ${ge(e)}
              </article>
            `)}
        </div>
      </div>
    `)}function Dn(e){let{data:t,filters:n,display:r,detail:i,callbacks:a}=e,o=a.filters,c=a.display,l=a.details;if(t.loading&&!t.totals)return oe(s`<div class="usage-page">${wn(n)}</div>`,{wide:!0});let u=r.chartMode===`tokens`,f=n.query.trim().length>0,p=n.queryDraft.trim().length>0,m=new Set(n.selectedDays),h=new Set(n.selectedSessions),g=[...t.sessions].toSorted((e,t)=>{let n=u?e.usage?.totalTokens??0:e.usage?.totalCost??0;return(u?t.usage?.totalTokens??0:t.usage?.totalCost??0)-n}),_=n.agentId?g.filter(e=>Y(e.agentId??``)===Y(n.agentId??``)):g,v=m.size>0?_.filter(e=>{if(e.usage?.activityDates?.length)return e.usage.activityDates.some(e=>m.has(e));if(!e.updatedAt)return!1;let t=new Date(e.updatedAt),n=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}-${String(t.getDate()).padStart(2,`0`)}`;return m.has(n)}):_,y=He(n.selectedHours.length>0?v.filter(e=>pt(e,n.selectedHours,n.timeZone)):v,n.query),b=y.sessions,x=y.warnings,S=Rt(n.queryDraft,_,t.aggregates),C=je(n.query),w=e=>{let t=Y(e);return C.filter(e=>Y(e.key??``)===t).map(e=>e.value).filter(Boolean)},T=e=>{let t=new Set;for(let n of e)n&&t.add(n);return Array.from(t)},E=T(_.map(e=>e.channel)).slice(0,12),ee=T([..._.map(e=>e.modelProvider),..._.map(e=>e.providerOverride),...t.aggregates?.byProvider.map(e=>e.provider)??[]]).slice(0,12),D=T([..._.map(e=>e.model),...t.aggregates?.byModel.map(e=>e.model)??[]]).slice(0,12),te=T(t.aggregates?.tools.tools.map(e=>e.name)??[]).slice(0,12),O=n.selectedSessions.length===1?t.sessions.find(e=>e.key===n.selectedSessions[0])??b.find(e=>e.key===n.selectedSessions[0]):null,k=e=>e.reduce((e,t)=>t.usage?Sn(e,t.usage):e,xn()),A=e=>t.costDaily.filter(t=>e.has(t.date)).reduce((e,t)=>Sn(e,t),xn()),j,M,N=_.length;if(n.selectedSessions.length>0){let e=b.filter(e=>h.has(e.key));j=k(e),M=e.length}else n.selectedDays.length>0&&n.selectedHours.length===0?(j=A(m),M=b.length):n.selectedHours.length>0||f?(j=k(b),M=b.length):n.agentId?(j=k(_),M=N):(j=t.totals,M=N);let P=n.selectedSessions.length>0?b.filter(e=>h.has(e.key)):f||n.selectedHours.length>0?b:n.selectedDays.length>0?v:_,F=n.selectedSessions.length>0||f||n.selectedHours.length>0||n.selectedDays.length>0||!!n.agentId,I=F?kt(P):kt([],t.aggregates),L=t.sessionsLimitReached&&!F,R=L?k(P):j,ne=L?kt(P):I,z=F?d:Jt(t.costDaily,n.startDate,n.endDate),B=n.selectedSessions.length>0?(()=>{let e=b.filter(e=>h.has(e.key)),n=new Set;for(let t of e)for(let e of t.usage?.activityDates??[])n.add(e);return n.size>0?t.costDaily.filter(e=>n.has(e.date)):t.costDaily})():t.costDaily,H=At(P,R,ne),U=!t.loading&&!t.totals&&t.sessions.length===0,W=xe(t.cacheStatus),re=(R?.missingCostEntries??0)>0||(R?R.totalTokens>0&&R.totalCost===0&&R.input+R.output+R.cacheRead+R.cacheWrite>0:!1),ie=[{label:V(`usage.presets.today`),days:1},{label:V(`usage.presets.last7d`),days:7},{label:V(`usage.presets.last30d`),days:30},{label:V(`usage.presets.last90d`),days:90},{label:V(`usage.presets.last1y`),days:365}],ae=e=>{let t=new Date,n=new Date;n.setDate(n.getDate()-(e-1)),o.onStartDateChange(_t(n)),o.onEndDateChange(_t(t))},G=()=>{o.onStartDateChange(`1970-01-01`),o.onEndDateChange(_t(new Date))},K=(e,t,r)=>{if(r.length===0)return d;let i=w(e),a=new Set(i.map(e=>Y(e))),c=r.length>0&&r.every(e=>a.has(Y(e))),l=i.length;return s`
      <wa-dropdown
        class="usage-filter-select"
        placement="bottom-start"
        @wa-select=${t=>{t.preventDefault();let i=t.detail.item.value;if(i===`command:select-all`){o.onQueryDraftChange(Ht(n.queryDraft,e,r));return}if(i===`command:clear`){o.onQueryDraftChange(Ht(n.queryDraft,e,[]));return}if(i?.startsWith(`option:`)){let t=decodeURIComponent(i.slice(7)),r=`${e}:${t}`,s=a.has(Y(t));o.onQueryDraftChange(s?Vt(n.queryDraft,r):Bt(n.queryDraft,r))}}}
      >
        <button slot="trigger" type="button" class="usage-filter-trigger">
          <span>${t}</span>
          ${l>0?s`<span class="settings-count">${l}</span>`:s` <span class="settings-count">${V(`usage.filters.all`)}</span> `}
        </button>
        <wa-dropdown-item value="command:select-all" ?disabled=${c}>
          ${V(`usage.filters.selectAll`)}
        </wa-dropdown-item>
        <wa-dropdown-item value="command:clear" ?disabled=${l===0}>
          ${V(`usage.filters.clear`)}
        </wa-dropdown-item>
        <div class="session-menu__separator" role="separator"></div>
        ${r.map(e=>{let t=a.has(Y(e));return s`
            <wa-dropdown-item
              class="usage-filter-option"
              type="checkbox"
              value=${`option:${encodeURIComponent(e)}`}
              .checked=${t}
            >
              ${e}
            </wa-dropdown-item>
          `})}
      </wa-dropdown>
    `},q=_t(new Date);return oe(s`
      <div class="usage-page">
        <section class="settings-section">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${V(`usage.filters.title`)}</h2>
            <div class="settings-section__actions">
              ${t.loading||W?Cn(V(`usage.loading.badge`),W??``):d}
              ${U?s`<span class="usage-query-hint">${V(`usage.empty.hint`)}</span>`:d}
            </div>
          </div>
          <div
            class="settings-group usage-panel usage-header ${r.headerPinned?`pinned`:``}"
          >
            <div class="usage-header-row">
              <div class="usage-header-metrics">
                ${j?s`
                      <span class="usage-metric-badge">
                        <strong>${J(j.totalTokens)}</strong>
                        ${V(`usage.metrics.tokens`)}
                      </span>
                      <span class="usage-metric-badge">
                        <strong>${gt(j.totalCost)}</strong>
                        ${V(`usage.metrics.cost`)}
                      </span>
                      <span class="usage-metric-badge">
                        <strong>${M}</strong>
                        ${V(M===1?`usage.metrics.session`:`usage.metrics.sessions`)}
                      </span>
                    `:d}
                <button
                  class="btn btn--sm usage-pin-btn ${r.headerPinned?`active`:``}"
                  @click=${o.onToggleHeaderPinned}
                >
                  ${r.headerPinned?V(`usage.filters.pinned`):V(`usage.filters.pin`)}
                </button>
                <wa-dropdown
                  class="usage-export-menu"
                  placement="bottom-end"
                  @wa-select=${e=>{switch(e.detail.item.value){case`sessions-csv`:Mt(`openclaw-usage-sessions-${q}.csv`,It(b),`text/csv`);break;case`daily-csv`:Mt(`openclaw-usage-daily-${q}.csv`,Lt(B),`text/csv`);break;case`json`:Mt(`openclaw-usage-${q}.json`,JSON.stringify({totals:j,sessions:b,daily:B,aggregates:I},null,2),`application/json`);break;case void 0:break}}}
                >
                  <button slot="trigger" type="button" class="btn btn--sm">
                    ${V(`usage.export.label`)} ▾
                  </button>
                  <wa-dropdown-item value="sessions-csv" ?disabled=${b.length===0}>
                    ${V(`usage.export.sessionsCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item value="daily-csv" ?disabled=${B.length===0}>
                    ${V(`usage.export.dailyCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item
                    value="json"
                    ?disabled=${b.length===0&&B.length===0}
                  >
                    ${V(`usage.export.json`)}
                  </wa-dropdown-item>
                </wa-dropdown>
              </div>
            </div>

            <div class="usage-header-row">
              <div class="usage-controls">
                ${qt(n.selectedDays,n.selectedHours,n.selectedSessions,t.sessions,o.onClearDays,o.onClearHours,o.onClearSessions,o.onClearFilters)}
                <div class="usage-presets">
                  ${ie.map(e=>s`
                      <button class="btn btn--sm" @click=${()=>ae(e.days)}>
                        ${e.label}
                      </button>
                    `)}
                  <button class="btn btn--sm" @click=${G}>
                    ${V(`usage.presets.all`)}
                  </button>
                </div>
                <div class="usage-date-range">
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.startDate}
                    title=${V(`usage.filters.startDate`)}
                    aria-label=${V(`usage.filters.startDate`)}
                    @change=${e=>o.onStartDateChange(e.target.value)}
                  />
                  <span class="usage-separator">${V(`usage.filters.to`)}</span>
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.endDate}
                    title=${V(`usage.filters.endDate`)}
                    aria-label=${V(`usage.filters.endDate`)}
                    @change=${e=>o.onEndDateChange(e.target.value)}
                  />
                </div>
                <select
                  class="usage-select"
                  title=${V(`usage.filters.timeZone`)}
                  aria-label=${V(`usage.filters.timeZone`)}
                  .value=${n.timeZone}
                  @change=${e=>o.onTimeZoneChange(e.target.value)}
                >
                  <option value="local">${V(`usage.filters.timeZoneLocal`)}</option>
                  <option value="utc">${V(`usage.filters.timeZoneUtc`)}</option>
                </select>
                <div class="chart-toggle">
                  <button
                    class="btn btn--sm toggle-btn ${n.scope===`instance`?`active`:``}"
                    title=${V(`usage.scope.instanceHint`)}
                    @click=${()=>o.onScopeChange(`instance`)}
                  >
                    ${V(`usage.scope.instance`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${n.scope===`family`?`active`:``}"
                    title=${V(`usage.scope.familyHint`)}
                    @click=${()=>o.onScopeChange(`family`)}
                  >
                    ${V(`usage.scope.family`)}
                  </button>
                </div>
                <div class="chart-toggle">
                  <button
                    class="btn btn--sm toggle-btn ${u?`active`:``}"
                    @click=${()=>c.onChartModeChange(`tokens`)}
                  >
                    ${V(`usage.metrics.tokens`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${u?``:`active`}"
                    @click=${()=>c.onChartModeChange(`cost`)}
                  >
                    ${V(`usage.metrics.cost`)}
                  </button>
                </div>
                <button
                  class="btn btn--sm primary"
                  @click=${o.onRefresh}
                  ?disabled=${t.loading}
                >
                  ${V(`common.refresh`)}
                </button>
              </div>
            </div>

            <div class="usage-query-section">
              <div class="usage-query-bar">
                <input
                  class="usage-query-input"
                  type="text"
                  .value=${n.queryDraft}
                  placeholder=${V(`usage.query.placeholder`)}
                  @input=${e=>o.onQueryDraftChange(e.target.value)}
                  @keydown=${e=>{e.key===`Enter`&&(e.preventDefault(),o.onApplyQuery())}}
                />
                <div class="usage-query-actions">
                  <button
                    class="btn btn--sm"
                    @click=${o.onApplyQuery}
                    ?disabled=${t.loading||!p&&!f}
                  >
                    ${V(`usage.query.apply`)}
                  </button>
                  ${p||f?s`
                        <button class="btn btn--sm" @click=${o.onClearQuery}>
                          ${V(`usage.filters.clear`)}
                        </button>
                      `:d}
                  <span class="usage-query-hint">
                    ${f?V(`usage.query.matching`,{shown:String(b.length),total:String(N)}):V(`usage.query.inRange`,{total:String(N)})}
                  </span>
                </div>
              </div>
              <div class="usage-filter-row">
                ${K(`channel`,V(`usage.filters.channel`),E)}
                ${K(`provider`,V(`usage.filters.provider`),ee)}
                ${K(`model`,V(`usage.filters.model`),D)}
                ${K(`tool`,V(`usage.filters.tool`),te)}
                <span class="usage-query-hint">${V(`usage.query.tip`)}</span>
              </div>
              ${C.length>0?s`
                    <div class="usage-query-chips">
                      ${C.map(e=>{let t=e.raw;return s`
                          <span class="usage-query-chip">
                            ${t}
                            <openclaw-tooltip .content=${V(`usage.filters.remove`)}>
                              <button
                                aria-label=${V(`usage.filters.remove`)}
                                @click=${()=>o.onQueryDraftChange(Vt(n.queryDraft,t))}
                              >
                                ×
                              </button>
                            </openclaw-tooltip>
                          </span>
                        `})}
                    </div>
                  `:d}
              ${S.length>0?s`
                    <div class="usage-query-suggestions">
                      ${S.map(e=>s`
                          <button
                            class="usage-query-suggestion"
                            @click=${()=>o.onQueryDraftChange(zt(n.queryDraft,e.value))}
                          >
                            ${e.label}
                          </button>
                        `)}
                    </div>
                  `:d}
              ${x.length>0?s`
                    <div class="callout warning usage-callout usage-callout--tight">
                      ${x.join(` · `)}
                    </div>
                  `:d}
            </div>

            ${t.error?s`<div class="callout danger usage-callout">${t.error}</div>`:d}
            ${W?s`
                  <div class="callout warning usage-callout usage-cache-warning">
                    ${V(`usage.cacheStatus.warning`)} ${W}
                  </div>
                `:d}
            ${t.sessionsLimitReached?s`
                  <div class="callout warning usage-callout">
                    ${V(`usage.sessions.limitReached`)}
                  </div>
                `:d}
          </div>
        </section>

        ${En(t.providerUsage)}
        ${U?Tn(o.onRefresh):s`
              ${en(R,ne,H,re,n.selectedDays.length===0,at(P,n.timeZone),M,N)}
              ${ht(P,n.timeZone,n.selectedHours,o.onSelectHour)}

              <div class="usage-grid">
                <div class="usage-grid-column">
                  <div class="settings-group usage-panel usage-left-card">
                    ${z}
                    ${Yt(B,n.selectedDays,r.chartMode,r.dailyChartMode,c.onDailyChartModeChange,o.onSelectDay)}
                    ${j?Xt(j,r.chartMode):d}
                  </div>
                  ${tn(b,n.selectedSessions,n.selectedDays,u,r.sessionSort,r.sessionSortDir,r.recentSessions,r.sessionsTab,l.onSelectSession,c.onSessionSortChange,c.onSessionSortDirChange,c.onSessionsTabChange,r.visibleColumns,N,o.onClearSessions)}
                </div>
                ${O?s`<div class="usage-grid-column">
                      ${dn(O,i.timeSeries,i.timeSeriesLoading,i.timeSeriesStatus,l.onRetryTimeSeries,i.timeSeriesMode,l.onTimeSeriesModeChange,i.timeSeriesBreakdownMode,l.onTimeSeriesBreakdownChange,i.timeSeriesCursorStart,i.timeSeriesCursorEnd,l.onTimeSeriesCursorRangeChange,n.startDate,n.endDate,n.selectedDays,n.timeZone,i.sessionLogs,i.sessionLogsLoading,i.sessionLogsStatus,l.onRetrySessionLogs,i.sessionLogsExpanded,l.onToggleSessionLogsExpanded,i.logFilters,l.onLogFilterRolesChange,l.onLogFilterToolsChange,l.onLogFilterHasToolsChange,l.onLogFilterQueryChange,l.onLogFilterClear,r.contextExpanded,l.onToggleContextExpanded,o.onClearSessions)}
                    </div>`:d}
              </div>
            `}
      </div>
    `,{wide:!0})}var On=e((()=>{l(),he(),q(),U(),W(),H(),_e(),Se(),Ue(),jt(),Ut(),bn(),nn()})),$;e((()=>{a(),p(),ne(),le(),A(),S(),C(),D(),ee(),Se(),Ge(),Ue(),qe(),Ye(),Ze(),On(),i(),$=class extends T{constructor(...e){super(...e),this.usageLoading=!0,this.usageResult=null,this.usageCostSummary=null,this.providerUsageSummary=null,this.usageError=null,this.usageStartDate=Ce(),this.usageEndDate=Ce(),this.usageScope=`family`,this.usageAgentId=null,this.usageSelectedSessions=[],this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageChartMode=`tokens`,this.usageDailyChartMode=`by-type`,this.usageTimeSeriesMode=`per-turn`,this.usageTimeSeriesBreakdownMode=`by-type`,this.usageTimeSeries=null,this.usageTimeSeriesSessionKey=null,this.usageTimeSeriesLoading=!1,this.usageTimeSeriesStatus=pe(),this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null,this.usageSessionLogs=null,this.usageSessionLogsSessionKey=null,this.usageSessionLogsLoading=!1,this.usageSessionLogsStatus=pe(),this.usageSessionLogsExpanded=!1,this.usageQuery=``,this.usageQueryDraft=``,this.usageSessionSort=`recent`,this.usageSessionSortDir=`desc`,this.usageRecentSessions=[],this.usageTimeZone=`local`,this.usageContextExpanded=!1,this.usageHeaderPinned=!1,this.usageSessionsTab=`all`,this.usageVisibleColumns=[...Je],this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``,this.usageRequestId=0,this.timeSeriesRequestId=0,this.logsRequestId=0,this.dateDebounceTimer=null,this.queryDebounceTimer=null,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.refreshRuntime=new Xe(this,{getGateway:()=>this.context?.gateway,isLoading:()=>this.usageLoading,isRouteDataInitialized:()=>this.routeDataInitialized,ensureAgents:()=>void this.context.agents.ensureList(),invalidateRequests:()=>this.invalidateRequests(),resetForClientChange:()=>this.resetForClientChange(),reload:()=>this.performUsageReload()}),this.subscriptions=new E(this).effect(()=>this.context?.agentSelection,e=>{let t=()=>{let t=e.state.scopeId,n=this.observedAgentScopeId!==t;this.observedAgentScopeId=t,n&&this.routeDataInitialized&&this.usageAgentId!==t&&(this.usageAgentId=t,this.clearSelectionsAndDetails(),this.refreshRuntime.reload()),this.requestUpdate()};return t(),e.subscribe(t)}).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t))}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}connectedCallback(){super.connectedCallback(),this.refreshRuntime.connect()}disconnectedCallback(){this.refreshRuntime.disconnect(),this.subscriptions.clear(),this.clearDateDebounce(),this.clearQueryDebounce(),this.invalidateRequests(),super.disconnectedCallback()}applyRouteData(){let e=this.routeData;if(!e||(this.routeDataInitialized=!0,!this.routeDataEnabled))return;let t=this.context.gateway,n=t.snapshot;if(this.refreshRuntime.adoptGatewaySnapshot(n),e.gateway!==t||e.gatewaySnapshot!==n){this.routeDataEnabled=!1,this.usageLoading=!1;return}let r=this.context.agentSelection.state.scopeId;if(e.query.agentId!==r){this.usageAgentId=r,this.clearSelectionsAndDetails(),this.refreshRuntime.reload();return}this.usageStartDate=e.query.startDate,this.usageEndDate=e.query.endDate,this.usageScope=e.query.scope,this.usageTimeZone=e.query.timeZone,this.usageAgentId=e.query.agentId,this.usageResult=e.result,this.usageCostSummary=e.costSummary,this.providerUsageSummary=e.providerUsageSummary,this.refreshRuntime.setLastLoadedAtMs(e.loadedAtMs),this.usageError=e.error,this.usageLoading=!1}ensureInitialData(){this.routeDataEnabled||!this.routeDataInitialized||!this.refreshRuntime.client||!this.refreshRuntime.connected||this.usageLoading||this.loadUsage()}resetForClientChange(){this.clearDateDebounce(),this.invalidateRequests(),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.usageResult=null,this.usageCostSummary=null,this.providerUsageSummary=null,this.refreshRuntime.resetPayload(),this.usageError=null,this.usageAgentId=this.context.agentSelection.state.scopeId,this.clearSelectionsAndDetails()}invalidateRequests(){this.usageRequestId+=1,this.timeSeriesRequestId+=1,this.logsRequestId+=1,this.usageLoading=!1,this.usageTimeSeriesLoading=!1,this.usageSessionLogsLoading=!1}invalidateUsageRequest(){this.usageRequestId+=1,this.routeDataEnabled=!1,this.usageLoading=!1}invalidateDetailRequests(){this.timeSeriesRequestId+=1,this.logsRequestId+=1,this.usageTimeSeriesLoading=!1,this.usageSessionLogsLoading=!1}isCurrentRequest(e,t){let n=this.context.gateway.snapshot;return this.isConnected&&e===this.usageRequestId&&n.client===t}isCurrentDetailRequest(e,t,n,r){let i=this.context.gateway.snapshot;return this.isConnected&&e===t&&i.client===n&&this.usageSelectedSessions.length===1&&this.usageSelectedSessions[0]===r}async loadUsage(){let e=this.refreshRuntime.client;if(!e||!this.refreshRuntime.connected){this.refreshRuntime.markLoadDeferred();return}if(this.usageLoading)return;this.refreshRuntime.beginLoad(),this.routeDataEnabled=!1;let t=++this.usageRequestId,n=this.usageStartDate,r=this.usageEndDate,i=this.usageScope,a=this.usageTimeZone,o=x(this.usageAgentId??``)||void 0;this.usageLoading=!0,this.usageError=null;try{let s=o?{agentId:o}:{agentScope:`all`},[c,l,u]=await Promise.all([M(e,{startDate:n,endDate:r,agentId:o,scope:i,timeZone:a}),e.request(`usage.cost`,{startDate:n,endDate:r,...s,...P(a)}),e.request(`usage.status`).catch(()=>null)]);if(!this.isCurrentRequest(t,e))return;this.usageResult=c,this.usageCostSummary=l,this.providerUsageSummary=u,this.refreshRuntime.markLoaded()}catch(n){if(!this.isCurrentRequest(t,e))return;j(n)?(this.usageResult=null,this.usageCostSummary=null,this.usageError=I(`usage`)):this.usageError=we(n)}finally{this.isCurrentRequest(t,e)&&(this.usageLoading=!1,this.refreshRuntime.flushPending())}}async loadSessionTimeSeries(e){let t=this.refreshRuntime.client;if(!t||!this.refreshRuntime.connected)return;this.usageTimeSeriesSessionKey!==e&&(this.usageTimeSeries=null,this.usageTimeSeriesSessionKey=null,this.usageTimeSeriesStatus=pe());let n=++this.timeSeriesRequestId;this.usageTimeSeriesLoading=!0,this.usageTimeSeriesStatus=me(this.usageTimeSeriesStatus);try{let r=await F(t,e);this.isCurrentDetailRequest(n,this.timeSeriesRequestId,t,e)&&(this.usageTimeSeries=r,this.usageTimeSeriesSessionKey=e,this.usageTimeSeriesStatus=de())}catch(r){if(this.isCurrentDetailRequest(n,this.timeSeriesRequestId,t,e)){let e=We(this.usageTimeSeriesStatus,r);this.usageTimeSeriesStatus=e.status,e.clearData&&(this.usageTimeSeries=null,this.usageTimeSeriesSessionKey=null)}}finally{this.isCurrentDetailRequest(n,this.timeSeriesRequestId,t,e)&&(this.usageTimeSeriesLoading=!1)}}async loadSessionLogs(e){let t=this.refreshRuntime.client;if(!t||!this.refreshRuntime.connected)return;this.usageSessionLogsSessionKey!==e&&(this.usageSessionLogs=null,this.usageSessionLogsSessionKey=null,this.usageSessionLogsStatus=pe());let n=++this.logsRequestId;this.usageSessionLogsLoading=!0,this.usageSessionLogsStatus=me(this.usageSessionLogsStatus);try{let r=await O(t,e);if(!this.isCurrentDetailRequest(n,this.logsRequestId,t,e))return;this.usageSessionLogs=Array.isArray(r.logs)?r.logs:null,this.usageSessionLogsSessionKey=e,this.usageSessionLogsStatus=de()}catch(r){if(this.isCurrentDetailRequest(n,this.logsRequestId,t,e)){let e=We(this.usageSessionLogsStatus,r);this.usageSessionLogsStatus=e.status,e.clearData&&(this.usageSessionLogs=null,this.usageSessionLogsSessionKey=null)}}finally{this.isCurrentDetailRequest(n,this.logsRequestId,t,e)&&(this.usageSessionLogsLoading=!1)}}clearSelections(){this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageSelectedSessions=[]}clearDetails(){this.invalidateDetailRequests(),this.usageTimeSeries=null,this.usageTimeSeriesSessionKey=null,this.usageTimeSeriesStatus=pe(),this.usageSessionLogs=null,this.usageSessionLogsSessionKey=null,this.usageSessionLogsStatus=pe(),this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null}clearSelectionsAndDetails(){this.clearSelections(),this.clearDetails()}clearDateDebounce(){this.dateDebounceTimer!==null&&(window.clearTimeout(this.dateDebounceTimer),this.dateDebounceTimer=null)}scheduleUsageLoad(){this.clearDateDebounce(),this.invalidateUsageRequest(),this.dateDebounceTimer=window.setTimeout(()=>{this.dateDebounceTimer=null,this.loadUsage()},400)}performUsageReload(){this.clearDateDebounce(),this.invalidateUsageRequest(),this.loadUsage()}clearQueryDebounce(){this.queryDebounceTimer!==null&&(window.clearTimeout(this.queryDebounceTimer),this.queryDebounceTimer=null)}selectSession(e,t){if(this.clearDetails(),this.usageRecentSessions=[e,...this.usageRecentSessions.filter(t=>t!==e)].slice(0,8),this.usageSelectedSessions=Ee(this.usageSelectedSessions,e,this.usageResult?.sessions??[],this.usageChartMode===`tokens`,t),this.usageSelectedSessions.length===1){let e=this.usageSelectedSessions[0];e&&(this.loadSessionTimeSeries(e),this.loadSessionLogs(e))}}render(){let e={data:{loading:this.usageLoading,error:this.usageError,sessions:this.usageResult?.sessions??[],agents:this.context.agents.state.agentsList?.agents.map(e=>e.id).filter(Boolean)??[],sessionsLimitReached:(this.usageResult?.sessions.length??0)>=1e3,totals:this.usageResult?.totals??null,aggregates:this.usageResult?.aggregates??null,costDaily:this.usageCostSummary?.daily??[],cacheStatus:be(this.usageResult?.cacheStatus,this.usageCostSummary?.cacheStatus),providerUsage:this.providerUsageSummary?.providers??[]},filters:{startDate:this.usageStartDate,endDate:this.usageEndDate,scope:this.usageScope,selectedSessions:this.usageSelectedSessions,selectedDays:this.usageSelectedDays,selectedHours:this.usageSelectedHours,agentId:this.usageAgentId,query:this.usageQuery,queryDraft:this.usageQueryDraft,timeZone:this.usageTimeZone},display:{chartMode:this.usageChartMode,dailyChartMode:this.usageDailyChartMode,sessionSort:this.usageSessionSort,sessionSortDir:this.usageSessionSortDir,recentSessions:this.usageRecentSessions,sessionsTab:this.usageSessionsTab,visibleColumns:this.usageVisibleColumns,contextExpanded:this.usageContextExpanded,headerPinned:this.usageHeaderPinned},detail:{timeSeriesMode:this.usageTimeSeriesMode,timeSeriesBreakdownMode:this.usageTimeSeriesBreakdownMode,timeSeries:this.usageTimeSeries,timeSeriesLoading:this.usageTimeSeriesLoading,timeSeriesStatus:this.usageTimeSeriesStatus,timeSeriesCursorStart:this.usageTimeSeriesCursorStart,timeSeriesCursorEnd:this.usageTimeSeriesCursorEnd,sessionLogs:this.usageSessionLogs,sessionLogsLoading:this.usageSessionLogsLoading,sessionLogsStatus:this.usageSessionLogsStatus,sessionLogsExpanded:this.usageSessionLogsExpanded,logFilters:{roles:this.usageLogFilterRoles,tools:this.usageLogFilterTools,hasTools:this.usageLogFilterHasTools,query:this.usageLogFilterQuery}},callbacks:{filters:{onStartDateChange:e=>{this.usageStartDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onEndDateChange:e=>{this.usageEndDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onScopeChange:e=>{this.usageScope=e,this.clearSelectionsAndDetails(),this.refreshRuntime.reload()},onAgentChange:e=>{this.context.agentSelection.setScope(e)},onRefresh:()=>this.refreshRuntime.request(`manual`),onTimeZoneChange:e=>{this.usageTimeZone=e,this.clearSelectionsAndDetails(),this.refreshRuntime.reload()},onToggleHeaderPinned:()=>{this.usageHeaderPinned=!this.usageHeaderPinned},onSelectHour:(e,t)=>{this.usageSelectedHours=Te(this.usageSelectedHours,e,Array.from({length:24},(e,t)=>t),t,!0)},onQueryDraftChange:e=>{this.usageQueryDraft=e,this.clearQueryDebounce(),this.queryDebounceTimer=window.setTimeout(()=>{this.usageQuery=this.usageQueryDraft,this.queryDebounceTimer=null},250)},onApplyQuery:()=>{this.clearQueryDebounce(),this.usageQuery=this.usageQueryDraft},onClearQuery:()=>{this.clearQueryDebounce(),this.usageQueryDraft=``,this.usageQuery=``},onSelectDay:(e,t)=>{this.usageSelectedDays=Te(this.usageSelectedDays,e,(this.usageCostSummary?.daily??[]).map(e=>e.date),t,!1)},onClearDays:()=>{this.usageSelectedDays=[]},onClearHours:()=>{this.usageSelectedHours=[]},onClearSessions:()=>{this.usageSelectedSessions=[],this.clearDetails()},onClearFilters:()=>this.clearSelectionsAndDetails()},display:{onChartModeChange:e=>{this.usageChartMode=e},onDailyChartModeChange:e=>{this.usageDailyChartMode=e},onSessionSortChange:e=>{this.usageSessionSort=e},onSessionSortDirChange:e=>{this.usageSessionSortDir=e},onSessionsTabChange:e=>{this.usageSessionsTab=e},onToggleColumn:e=>{this.usageVisibleColumns=this.usageVisibleColumns.includes(e)?this.usageVisibleColumns.filter(t=>t!==e):[...this.usageVisibleColumns,e]}},details:{onToggleContextExpanded:()=>{this.usageContextExpanded=!this.usageContextExpanded},onToggleSessionLogsExpanded:()=>{this.usageSessionLogsExpanded=!this.usageSessionLogsExpanded},onLogFilterRolesChange:e=>{this.usageLogFilterRoles=e},onLogFilterToolsChange:e=>{this.usageLogFilterTools=e},onLogFilterHasToolsChange:e=>{this.usageLogFilterHasTools=e},onLogFilterQueryChange:e=>{this.usageLogFilterQuery=e},onLogFilterClear:()=>{this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``},onSelectSession:(e,t)=>this.selectSession(e,t),onTimeSeriesModeChange:e=>{this.usageTimeSeriesMode=e},onTimeSeriesBreakdownChange:e=>{this.usageTimeSeriesBreakdownMode=e},onTimeSeriesCursorRangeChange:(e,t)=>{this.usageTimeSeriesCursorStart=e,this.usageTimeSeriesCursorEnd=t},onRetryTimeSeries:()=>{let e=this.usageSelectedSessions[0];e&&this.loadSessionTimeSeries(e)},onRetrySessionLogs:()=>{let e=this.usageSelectedSessions[0];e&&this.loadSessionLogs(e)}}}};return Ke(this.context,this.usageResult,Dn(e))}},n([o({context:z,subscribe:!0})],$.prototype,`context`,void 0),n([c({attribute:!1})],$.prototype,`routeData`,void 0),n([u()],$.prototype,`usageLoading`,void 0),n([u()],$.prototype,`usageResult`,void 0),n([u()],$.prototype,`usageCostSummary`,void 0),n([u()],$.prototype,`providerUsageSummary`,void 0),n([u()],$.prototype,`usageError`,void 0),n([u()],$.prototype,`usageStartDate`,void 0),n([u()],$.prototype,`usageEndDate`,void 0),n([u()],$.prototype,`usageScope`,void 0),n([u()],$.prototype,`usageAgentId`,void 0),n([u()],$.prototype,`usageSelectedSessions`,void 0),n([u()],$.prototype,`usageSelectedDays`,void 0),n([u()],$.prototype,`usageSelectedHours`,void 0),n([u()],$.prototype,`usageChartMode`,void 0),n([u()],$.prototype,`usageDailyChartMode`,void 0),n([u()],$.prototype,`usageTimeSeriesMode`,void 0),n([u()],$.prototype,`usageTimeSeriesBreakdownMode`,void 0),n([u()],$.prototype,`usageTimeSeries`,void 0),n([u()],$.prototype,`usageTimeSeriesLoading`,void 0),n([u()],$.prototype,`usageTimeSeriesStatus`,void 0),n([u()],$.prototype,`usageTimeSeriesCursorStart`,void 0),n([u()],$.prototype,`usageTimeSeriesCursorEnd`,void 0),n([u()],$.prototype,`usageSessionLogs`,void 0),n([u()],$.prototype,`usageSessionLogsLoading`,void 0),n([u()],$.prototype,`usageSessionLogsStatus`,void 0),n([u()],$.prototype,`usageSessionLogsExpanded`,void 0),n([u()],$.prototype,`usageQuery`,void 0),n([u()],$.prototype,`usageQueryDraft`,void 0),n([u()],$.prototype,`usageSessionSort`,void 0),n([u()],$.prototype,`usageSessionSortDir`,void 0),n([u()],$.prototype,`usageRecentSessions`,void 0),n([u()],$.prototype,`usageTimeZone`,void 0),n([u()],$.prototype,`usageContextExpanded`,void 0),n([u()],$.prototype,`usageHeaderPinned`,void 0),n([u()],$.prototype,`usageSessionsTab`,void 0),n([u()],$.prototype,`usageVisibleColumns`,void 0),n([u()],$.prototype,`usageLogFilterRoles`,void 0),n([u()],$.prototype,`usageLogFilterTools`,void 0),n([u()],$.prototype,`usageLogFilterHasTools`,void 0),n([u()],$.prototype,`usageLogFilterQuery`,void 0),customElements.get(`openclaw-usage-page`)||customElements.define(`openclaw-usage-page`,$)}))();
//# sourceMappingURL=usage-page-BzfkoBj9.js.map