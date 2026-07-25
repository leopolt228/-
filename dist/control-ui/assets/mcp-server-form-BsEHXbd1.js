import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{$ as t,J as n}from"./lit-runtime-CE4wpvNA.js";import{gt as r,pt as i}from"./control-ui-foundation-DFIFKu9N.js";import{o as a,t as o}from"./control-ui-core-CXeSrnoQ.js";function s(e){return typeof e==`string`?e.trim().toLowerCase():``}function c(e){return e.replace(O,`/bot***`)}function l(e){let t=e.replace(D,``);for(let e=0;e<=k;e+=1){let e;try{e=decodeURIComponent(t).replace(D,``)}catch{return{value:s(t).replaceAll(`-`,`_`),unresolvedEncoding:t.includes(`%`)}}if(e===t)return{value:s(t).replaceAll(`-`,`_`),unresolvedEncoding:!1};t=e}return{value:s(t).replaceAll(`-`,`_`),unresolvedEncoding:t.includes(`%`)}}function u(e){if(A.test(e))return!0;let t=e.indexOf(`//`),n=e.indexOf(`\\\\`),r=t<0?n:n<0?t:Math.min(t,n);if(r>=0&&e.includes(`@`,r+2))return!0;let i=e.search(/[?&]/u);if(i>=0&&e.includes(`=`,i+1))return!0;let a=e.indexOf(`#`);return a>=0&&e.includes(`=`,a+1)?!0:/%[\da-f]{2}/iu.test(e)}function d(e){let t=l(e);return t.unresolvedEncoding||E.has(t.value)}function f(e){try{let t=new URL(e),n=!1,r=c(t.pathname);r!==t.pathname&&(t.pathname=r,n=!0),(t.username||t.password)&&(t.username=t.username?`***`:``,t.password=t.password?`***`:``,n=!0);for(let e of Array.from(t.searchParams.keys()))d(e)&&(t.searchParams.set(e,`***`),n=!0);return n?t.toString():e}catch{return e}}function p(e,t){let n=new URLSearchParams(e),r=Array.from(n.entries()),i=[],a=new Set,o=!1;for(let[e,n]of r){if(d(e)){o=!0,a.has(e)||(a.add(e),i.push([e,`***`]));continue}let r=w(e,t+1),s=w(n,t+1);(r!==e||s!==n)&&(o=!0),i.push([r,s])}if(!o)return e;let s=new URLSearchParams;for(let[e,t]of i)s.append(e,t);return s.toString()}function m(e){return c(g(e).replace(/([?&])([^=&]+)=([^&]*)/g,(e,t,n)=>d(n)?`${t}${n}=***`:e))}function h(e,t){let n=e.slice(t),r=n.lastIndexOf(`@`);return r<0?e:`${e.slice(0,t)}***:***@${n.slice(r+1)}`}function g(e){return e.replace(j,e=>{let t=e.indexOf(`:`)+1;for(;t<e.length&&(e[t]===`/`||e[t]===`\\`);)t+=1;return h(e,t)}).replace(M,e=>{let t=e.indexOf(`:`)+1;for(;t<e.length&&(e[t]===`/`||e[t]===`\\`);)t+=1;let n=e.lastIndexOf(`@`),r=e.slice(t).search(/[\\/?#]/u);if(n<0||r<0)return e;let i=t+r;if(i>=n)return e;let a=e.indexOf(`:`,t);if(a<0||a>i)return e;let o=e.slice(t,i),s=e.slice(a+1,i);return/^\d+$/u.test(s)||/^\[[^\]]+\](?::\d+)?$/u.test(o)?e:`${e.slice(0,t)}***:***@${e.slice(n+1)}`}).replace(N,e=>{let t=0;for(;t<e.length&&(e[t]===`/`||e[t]===`\\`);)t+=1;return h(e,t)})}function _(e){for(let t of e.matchAll(/(?:\b(?:https?|wss?|ftp):[\\/]{0,2}|[\\/]{2,})/giu)){let n=e.slice((t.index??0)+t[0].length),r=n.search(/(?<!\*\*\*:\*\*\*)@/u),i=n.search(/[\\/?#]/u),a=n.slice(i+1,r);if(r>=0&&(i<0||r<=i||n[i]===`/`&&(a.includes(`:`)||/^[^/?#\s]+\.[^/?#\s]+(?:[/?#]|$)/u.test(n.slice(r+1)))))return!0}return!1}function v(e,t){let n=e.indexOf(`#`);if(n<0)return e;let r=e.slice(n+1),i=y(r,t+1);return i===r?e:`${e.slice(0,n+1)}${i}`}function y(e,t){if(!e)return e;if(t>k&&u(e))return`***`;let n=x(e,t);if(n.parsedWholeUrl)return m(n.value);let r=e,i=r.search(/[?&]/u),a=r.indexOf(`=`);if(a>=0&&(i<0||a<i))return p(r,t);let o=r.indexOf(`?`);if(o>=0){let e=p(r.slice(o+1),t);return`${C(m(r.slice(0,o+1)),t+1)}${e}`}let s=m(r);if(!u(s))return s;let c;try{c=decodeURIComponent(s)}catch{return`***`}if(c===s)return s;let l=y(c,t+1);return l===c?s:encodeURIComponent(l)}function b(e,t){if(!u(e))return e;if(t>k)return`***`;let n;try{n=decodeURIComponent(e)}catch{return`***`}if(n===e)return e;let r=S(n,t);if(r.value!==n||_(n))return r.value===n?`***`:r.value;if(r.parsedWholeUrl)return e;let i=b(n,t+1);return i===n?e:i}function x(e,t){try{let n=f(e),r=new URL(n);if(t>k)return{value:`***`,parsedWholeUrl:!0};let i=n!==e,a=g(b(r.pathname,t+1));if(a!==r.pathname){let e=r.pathname;if(r.pathname=a,r.pathname===e)return{value:n,parsedWholeUrl:!1};i=!0}let o=p(r.search.slice(1),t);o!==r.search.slice(1)&&(r.search=o,i=!0);let s=r.hash.slice(1),c=y(s,t+1);return c!==s&&(r.hash=c,i=!0),{value:i?r.toString():e,parsedWholeUrl:!0}}catch{return{value:e,parsedWholeUrl:!1}}}function S(e,t){let n=x(e,t);return n.parsedWholeUrl?n:{value:C(v(m(n.value),t),t+1),parsedWholeUrl:!1}}function C(e,t){if(!u(e))return e;if(t>k)return`***`;let n;try{n=decodeURIComponent(e)}catch{return`***`}if(n===e)return e;let r=S(n,t+1);return r.value!==n||r.parsedWholeUrl?r.value===n?e:r.value:_(n)?`***`:e}function w(e,t){if(!u(e))return e;if(t>k)return`***`;let n=S(e,t);if(n.value!==e)return n.value;if(_(e))return`***`;if(n.parsedWholeUrl)return e;let r;try{r=decodeURIComponent(e)}catch{return`***`}if(r===e||!u(r))return e;let i=w(r,t+1);return i===r?e:encodeURIComponent(i)}function T(e){return S(e,0).value}var E,D,O,k,A,j,M,N,P=e((()=>{E=new Set([`token`,`key`,`api_key`,`apikey`,`secret`,`access_token`,`auth_token`,`password`,`pass`,`passwd`,`auth`,`jwt`,`session`,`id_token`,`code`,`client_secret`,`app_secret`,`hook_token`,`refresh_token`,`signature`,`x_amz_signature`,`x_amz_security_token`,`private_key`,`credential`,`authorization`]),D=/[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu,O=/\/bot\d{6,}(?::|%3[aA])[A-Za-z0-9_-]{20,}(?=\/|$)/giu,k=8,A=/(?:^|[^a-z\d+.-])[a-z][a-z\d+.-]{0,31}:/iu,j=/\b(?:https?|wss?|ftp):[\\/]{0,2}[^\\/?#\s]*/giu,M=/\b(?:https?|wss?|ftp):[\\/]{0,2}[^\s]*@[^\\/?#\s]*/giu,N=/[\\/]{2,}[^\\/?#\s]*/gu}));function F(e){let t=[],n=``,r=null,i=!1;for(let a=0;a<e.length;a+=1){let o=e[a]??``;if(o===`\\`&&r===`"`){let t=1;for(;e[a+t]===`\\`;)t+=1;e[a+t]===`"`?(n+=`\\`.repeat(Math.floor(t/2)),t%2==0?r=null:n+=`"`,a+=t):(n+=`\\`.repeat(t),a+=t-1),i=!0;continue}if(o===`\\`&&r===null){let t=e[a+1];t&&(t===`"`||t===`'`||/\s/u.test(t))?(n+=t,i=!0,a+=1):(n+=o,i=!0);continue}if(r){o===r?r=null:n+=o,i=!0;continue}if(o===`'`||o===`"`){r=o,i=!0;continue}if(/\s/u.test(o)){i&&=(t.push(n),n=``,!1);continue}n+=o,i=!0}return r?null:(i&&t.push(n),t)}function I(e,t){if(t!==`stdio`)return/^https?:\/\//i.test(e)?{url:e,transport:t}:null;if(/^https?:\/\//i.test(e))return null;let[n,...r]=F(e.trim())??[];return n?r.length>0?{command:n,args:r}:{command:n}:null}function L(e){if(!e)return null;let t=i(i(e.mcp)?.servers)??{};return Object.entries(t).map(([e,t])=>{let n=i(t)??{},r=typeof n.url==`string`?n.url:``,a=typeof n.command==`string`?n.command:``,o=a?`stdio`:r?n.transport===`streamable-http`?`streamable-http`:n.transport===void 0||n.transport===`sse`?`sse`:`invalid`:`invalid`;return{name:e,enabled:n.enabled!==!1,transport:o,target:a||T(r),auth:typeof n.auth==`string`?n.auth:null,toolFilter:!!n.toolFilter,parallel:n.supportsParallelToolCalls===!0,tls:n.sslVerify===!1?`verify-off`:n.clientCert||n.clientKey?`mtls`:null}}).toSorted((e,t)=>e.name.localeCompare(t.name))}function R(e,t,n){return Object.hasOwn(e,t)?{error:a(`mcpServers.nameTaken`,{name:t})}:{patch:{[t]:n}}}function z(e,t,n){return Object.hasOwn(e,t)?{patch:{[t]:{enabled:n?null:!1}}}:{error:a(`mcpServers.missing`,{name:t})}}function B(e,t){return Object.hasOwn(e,t)?{patch:{[t]:null}}:{error:a(`mcpServers.missing`,{name:t})}}async function V(e,t){try{return await e.ensureLoaded(),await e.patchFromSnapshot(e=>{let n=i(i(e.mcp)?.servers)??{},r=t.buildPatch(n);return`error`in r?r:{options:{raw:{mcp:{servers:r.patch}},note:t.note}}})?(await e.refresh(),{ok:!0}):{ok:!1,error:e.state.lastError??a(`mcpServers.configUnavailable`)}}catch(e){return{ok:!1,error:e instanceof Error?e.message:String(e)}}}var H,U=e((()=>{P(),r(),o(),H=/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/}));function W(e){let n=e.busy||e.disabled===!0;return t`
    <form class="mcp-server-form" @submit=${t=>{t.preventDefault();let n=t.currentTarget,r=new FormData(n),i=r.get(`mcp-name`),a=r.get(`mcp-transport`),o=r.get(`mcp-target`);e.onSubmit({name:typeof i==`string`?i.trim():``,transport:a===`sse`||a===`stdio`?a:`streamable-http`,target:typeof o==`string`?o.trim():``})}}>
      <label>
        <span>${a(`mcpServers.nameLabel`)}</span>
        <input
          name="mcp-name"
          class="settings-input"
          type="text"
          required
          placeholder="context7"
          autocomplete="off"
          title=${e.blockedReason??``}
          ?disabled=${n}
        />
      </label>
      <label>
        <span>${a(`mcpServers.transportLabel`)}</span>
        <select
          name="mcp-transport"
          class="settings-select"
          title=${e.blockedReason??``}
          ?disabled=${n}
        >
          <option value="streamable-http">${a(`mcpServers.transportStreamableHttp`)}</option>
          <option value="sse">${a(`mcpServers.transportSse`)}</option>
          <option value="stdio">${a(`mcpServers.transportStdio`)}</option>
        </select>
      </label>
      <label class="mcp-server-form__target">
        <span>${a(`mcpServers.targetLabel`)}</span>
        <input
          name="mcp-target"
          class="settings-input"
          type="text"
          required
          placeholder="https://mcp.example.com/mcp  ·  npx some-mcp-server"
          autocomplete="off"
          title=${e.blockedReason??``}
          ?disabled=${n}
        />
      </label>
      <div class="mcp-server-form__actions">
        <button
          type="submit"
          class="btn btn--sm"
          title=${e.blockedReason??``}
          ?disabled=${n}
        >
          ${e.busy?a(`mcpServers.adding`):a(`mcpServers.add`)}
        </button>
        <button type="button" class="btn btn--sm" ?disabled=${e.busy} @click=${e.onCancel}>
          ${a(`common.cancel`)}
        </button>
      </div>
    </form>
  `}var G=e((()=>{n(),o()}));export{B as a,I as c,R as i,V as l,W as n,z as o,H as r,U as s,G as t,L as u};
//# sourceMappingURL=mcp-server-form-BsEHXbd1.js.map