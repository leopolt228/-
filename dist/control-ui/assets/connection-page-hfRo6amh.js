import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,r as n,s as r,u as i}from"./control-ui-foundation-43q8Lf_T.js";import{dt as a,ft as o}from"./control-ui-foundation-DQl2NL7K.js";import{$ as s,J as c,U as l,z as u}from"./lit-runtime-CE4wpvNA.js";import{Ci as d,Mi as f,Mr as p,Nr as m,Pi as h}from"./control-ui-core-Dx4utKSD.js";import{Ut as g,at as _,g as v,it as y,jt as b,m as x,p as S,w as C}from"./control-ui-core-6OhF3OIO.js";import{o as w,t as T}from"./control-ui-core-CXeSrnoQ.js";import{n as E,t as D}from"./settings-workspace-BhCB-OeS.js";import{a as O,c as k,o as A,p as j,s as M,t as N,u as P}from"./settings-ui-BJ5HJKwt.js";function F(e){let{label:t,...n}=e;return A({title:t,control:M(n)})}function I(e){let t=e.hello?.snapshot,i=t?.uptimeMs?r(t.uptimeMs):w(`common.na`),a=e.hello?.policy?.tickIntervalMs,o=a?`${(a/1e3).toFixed(a%1e3==0?0:1)}s`:w(`common.na`),c=t?.authMode===`trusted-proxy`,l=s`
    ${A({title:w(`connection.access.wsUrl`),control:s`
        <input
          class="settings-input"
          .value=${e.settings.gatewayUrl}
          @input=${t=>{let n=e.settings,r=t.target.value;e.onConnectionChange({gatewayUrl:r,token:C(n.gatewayUrl,r,n.token)})}}
          placeholder="ws://100.x.y.z:18789"
        />
      `})}
    ${c?``:s`
          ${F({label:w(`connection.access.token`),value:e.settings.token,placeholder:`OPENCLAW_GATEWAY_TOKEN`,visible:e.showGatewayToken,showLabel:w(`connection.access.showToken`),hideLabel:w(`connection.access.hideToken`),toggleLabel:w(`connection.access.toggleTokenVisibility`),onInput:t=>e.onConnectionChange({token:t}),onToggle:e.onToggleGatewayTokenVisibility})}
          ${F({label:w(`connection.access.password`),value:e.password,placeholder:w(`connection.access.passwordPlaceholder`),visible:e.showGatewayPassword,showLabel:w(`connection.access.showPassword`),hideLabel:w(`connection.access.hidePassword`),toggleLabel:w(`connection.access.togglePasswordVisibility`),onInput:e.onPasswordChange,onToggle:e.onToggleGatewayPasswordVisibility})}
        `}
    ${A({title:w(`connection.access.sessionKey`),control:s`
        <input
          class="settings-input"
          .value=${e.settings.sessionKey}
          @input=${t=>e.onSessionKeyChange(t.target.value)}
        />
      `})}
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__desc"
          >${w(c?`connection.access.trustedProxy`:`connection.access.connectHint`)}</span
        >
      </div>
      <div class="settings-row__control">
        <button class="btn" @click=${()=>e.onConnect()}>${w(`common.connect`)}</button>
        <button class="btn" @click=${()=>e.onRefresh()}>${w(`common.refresh`)}</button>
      </div>
    </div>
  `,u=s`
    ${A({title:w(`connection.snapshot.status`),control:P({kind:e.connected?`ok`:`warn`,label:e.connected?w(`common.ok`):w(`common.offline`)})})}
    ${A({title:w(`connection.snapshot.uptime`),control:j(i)})}
    ${A({title:w(`connection.snapshot.tickInterval`),control:j(o)})}
    ${A({title:w(`connection.snapshot.lastChannelsRefresh`),control:j(e.lastChannelsRefresh?n(e.lastChannelsRefresh):w(`common.na`))})}
    ${e.lastError?A({title:P({kind:`danger`,label:w(`connection.snapshot.lastError`)}),description:e.lastError}):``}
  `;return O([k({title:w(`connection.access.title`),description:w(`connection.access.subtitle`)},l),k({title:w(`connection.snapshot.title`),description:w(`connection.snapshot.subtitle`)},u)])}var L=e((()=>{c(),S(),N(),T(),d()})),R;e((()=>{a(),c(),u(),b(),_(),S(),D(),h(),m(),L(),i(),R=class extends f{constructor(...e){super(...e),this.settings=v(),this.password=``,this.gatewayTokenVisible=!1,this.gatewayPasswordVisible=!1,this.sessionKeyDirty=!1,this.gatewayClient=null,this.subscriptions=new p(this).effect(()=>this.context?.gateway,e=>(this.resetDraft(e),e.subscribe(t=>{t.client===this.gatewayClient?t.connected||this.resetSensitiveUi():this.resetDraft(e),this.requestUpdate()}))).watch(()=>this.context?.channels,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.subscriptions.clear(),this.resetSensitiveUi(),super.disconnectedCallback()}resetSensitiveUi(){this.gatewayTokenVisible=!1,this.gatewayPasswordVisible=!1}resetDraft(e){let t=e.snapshot.sessionKey,{gatewayUrl:n,token:r,password:i}=e.connection;this.gatewayClient=e.snapshot.client,this.settings={...v(),gatewayUrl:n,token:r,sessionKey:t,lastActiveSessionKey:t},this.password=i,this.sessionKeyDirty=!1,this.resetSensitiveUi()}connect(){let e=this.sessionKeyDirty?{sessionKey:this.settings.sessionKey,lastActiveSessionKey:this.settings.sessionKey}:x(this.settings.gatewayUrl);this.settings={...this.settings,...e},this.sessionKeyDirty=!1,this.context.gateway.connect({gatewayUrl:this.settings.gatewayUrl,token:this.settings.token,password:this.password,sessionKey:e.sessionKey})}render(){let e=this.context.gateway.snapshot,t=I({connected:e.connected,hello:e.hello,settings:this.settings,password:this.password,lastError:e.lastError,lastChannelsRefresh:this.context.channels.state.channelsLastSuccess,showGatewayToken:this.gatewayTokenVisible,showGatewayPassword:this.gatewayPasswordVisible,onConnectionChange:e=>{this.settings={...this.settings,...e}},onPasswordChange:e=>this.password=e,onSessionKeyChange:e=>{this.sessionKeyDirty=!0,this.settings={...this.settings,sessionKey:e,lastActiveSessionKey:e}},onToggleGatewayTokenVisibility:()=>{this.gatewayTokenVisible=!this.gatewayTokenVisible},onToggleGatewayPasswordVisibility:()=>{this.gatewayPasswordVisible=!this.gatewayPasswordVisible},onConnect:()=>this.connect(),onRefresh:()=>void this.context.channels.refresh(!1)});return s`
      <section class="content-header">
        <div>
          <div class="page-title">${g(`connection`)}</div>
        </div>
      </section>
      ${E(t)}
    `}},t([o({context:y,subscribe:!0})],R.prototype,`context`,void 0),t([l()],R.prototype,`settings`,void 0),t([l()],R.prototype,`password`,void 0),t([l()],R.prototype,`gatewayTokenVisible`,void 0),t([l()],R.prototype,`gatewayPasswordVisible`,void 0),customElements.get(`openclaw-connection-page`)||customElements.define(`openclaw-connection-page`,R)}))();
//# sourceMappingURL=connection-page-hfRo6amh.js.map