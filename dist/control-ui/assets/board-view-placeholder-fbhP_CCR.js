import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{l as t,u as n}from"./control-ui-foundation-43q8Lf_T.js";import{$ as r,G as i,J as a,it as o,z as s}from"./lit-runtime-CE4wpvNA.js";import{Ni as c,Pi as l}from"./control-ui-core-Dx4utKSD.js";import{o as u,t as d}from"./control-ui-core-CXeSrnoQ.js";var f;e((()=>{a(),s(),d(),l(),n(),f=class extends c{constructor(...e){super(...e),this.activeTabId=``}static{this.styles=o`
    :host {
      display: grid;
      min-width: 0;
      min-height: 0;
      height: 100%;
      place-items: center;
      color: var(--muted);
      background:
        linear-gradient(color-mix(in srgb, var(--border) 22%, transparent) 1px, transparent 1px),
        linear-gradient(
          90deg,
          color-mix(in srgb, var(--border) 22%, transparent) 1px,
          transparent 1px
        );
      background-size: 24px 24px;
    }

    div {
      padding: 12px 16px;
      border: 1px dashed var(--border);
      border-radius: var(--radius-md);
      background: color-mix(in srgb, var(--panel) 88%, transparent);
      font-size: 12px;
      letter-spacing: 0.01em;
    }
  `}render(){let e=this.snapshot?.widgets??[];return r`<div data-board-view-placeholder>
      ${u(`chat.board.mockPlaceholder`,{tabs:String(this.snapshot?.tabs.length??0),widgets:String(e.length)})}
    </div>`}},t([i({attribute:!1})],f.prototype,`snapshot`,void 0),t([i({attribute:!1})],f.prototype,`activeTabId`,void 0),t([i({attribute:!1})],f.prototype,`widgetFrameUrl`,void 0),t([i({attribute:!1})],f.prototype,`callbacks`,void 0),customElements.get(`openclaw-board-view`)||customElements.define(`openclaw-board-view`,f)}))();
//# sourceMappingURL=board-view-placeholder-fbhP_CCR.js.map