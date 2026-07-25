import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{A as t,B as n,D as r,E as i,F as a,H as o,I as s,M as c,N as l,O as u,P as d,S as f,U as p,V as m,W as h,c as g,d as _,k as v,l as y,u as ee,x as b,z as x}from"./control-ui-foundation-DQl2NL7K.js";import{$ as S,B as C,G as w,J as T,S as E,T as D,U as O,X as k,b as A,f as te,it as j,q as M,u as N,w as P,z as F}from"./lit-runtime-CE4wpvNA.js";import{Q as ne,at as I,ot as L}from"./control-ui-core-vPyynwls.js";import{i as R,n as z,r as B,t as re}from"./chunk.GWSUX3V5-Cq8hGAxG.js";var V,H=e((()=>{T(),V=j`
  :host {
    --checked-icon-color: var(--wa-form-control-activated-color);
    --checked-icon-scale: 0.7;

    color: var(--wa-form-control-value-color);
    display: inline-flex;
    flex-direction: row;
    align-items: top;
    font-family: inherit;
    font-weight: var(--wa-form-control-value-font-weight);
    line-height: var(--wa-form-control-value-line-height);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  /* When the control isn't checked, hide the circle for Windows High Contrast mode a11y */
  :host(:not(:state(checked))) svg circle {
    opacity: 0;
  }

  [part~='label'] {
    display: inline;
  }

  [part~='hint'] {
    margin-block-start: 0.5em;
  }

  /* Default spacing for default appearance radios */
  :host([appearance='default']) {
    margin-block: 0.375em; /* Half of the original 0.75em gap on each side */
  }

  :host([appearance='default'][data-wa-radio-horizontal]) {
    margin-block: 0;
    margin-inline: 0.5em; /* Half of the original 1em gap on each side */
  }

  /* Remove margin from first/last items to prevent extra space */
  :host([appearance='default'][data-wa-radio-first]) {
    margin-block-start: 0;
    margin-inline-start: 0;
  }

  :host([appearance='default'][data-wa-radio-last]) {
    margin-block-end: 0;
    margin-inline-end: 0;
  }

  /* Button appearance have no spacing, they get handled by the overlap margins below */
  :host([appearance='button']) {
    margin: 0;
    align-items: center;
    min-height: var(--wa-form-control-height);
    background-color: var(--wa-color-surface-default);
    border: var(--wa-form-control-border-width) var(--wa-form-control-border-style) var(--wa-form-control-border-color);
    border-radius: var(--wa-border-radius-m);
    padding: 0 var(--wa-form-control-padding-inline);
    transition:
      background-color var(--wa-transition-fast),
      border-color var(--wa-transition-fast);
  }

  /* Default appearance */
  :host([appearance='default']) {
    .control {
      flex: 0 0 auto;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--wa-form-control-toggle-size);
      height: var(--wa-form-control-toggle-size);
      border-color: var(--wa-form-control-border-color);
      border-radius: 50%;
      border-style: var(--wa-form-control-border-style);
      border-width: var(--wa-form-control-border-width);
      background-color: var(--wa-form-control-background-color);
      color: transparent;
      transition:
        background var(--wa-transition-normal),
        border-color var(--wa-transition-fast),
        box-shadow var(--wa-transition-fast),
        color var(--wa-transition-fast);
      transition-timing-function: var(--wa-transition-easing);

      margin-inline-end: 0.5em;
    }

    .checked-icon {
      display: flex;
      fill: currentColor;
      width: var(--wa-form-control-toggle-size);
      height: var(--wa-form-control-toggle-size);
      scale: var(--checked-icon-scale);
    }
  }

  /* Button appearance */
  :host([appearance='button']) {
    .control {
      display: none;
    }
  }

  /* Checked */
  :host(:state(checked)) .control {
    color: var(--checked-icon-color);
    border-color: var(--wa-form-control-activated-color);
    background-color: var(--wa-form-control-background-color);
  }

  /* Focus */
  :host(:focus-visible) .control {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Disabled */
  :host(:state(disabled)) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Horizontal grouping - remove inner border radius */
  :host([appearance='button'][data-wa-radio-horizontal][data-wa-radio-inner]) {
    border-radius: 0;
  }

  :host([appearance='button'][data-wa-radio-horizontal][data-wa-radio-first]) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([appearance='button'][data-wa-radio-horizontal][data-wa-radio-last]) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* Vertical grouping - remove inner border radius */
  :host([appearance='button'][data-wa-radio-vertical][data-wa-radio-inner]) {
    border-radius: 0;
  }

  :host([appearance='button'][data-wa-radio-vertical][data-wa-radio-first]) {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  :host([appearance='button'][data-wa-radio-vertical][data-wa-radio-last]) {
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }

  @media (hover: hover) {
    :host([appearance='button']:hover:not(:state(disabled), :state(checked))) {
      background-color: color-mix(in srgb, var(--wa-color-surface-default) 95%, var(--wa-color-mix-hover));
    }
  }

  :host([appearance='button']:focus-visible) {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  :host([appearance='button']:state(checked)) {
    border-color: var(--wa-form-control-activated-color);
    background-color: var(--wa-color-brand-fill-quiet);
  }

  :host([appearance='button']:state(checked):focus-visible) {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Button overlap margins */
  :host([appearance='button'][data-wa-radio-horizontal]:not([data-wa-radio-first])) {
    margin-inline-start: calc(-1 * var(--wa-form-control-border-width));
  }

  :host([appearance='button'][data-wa-radio-vertical]:not([data-wa-radio-first])) {
    margin-block-start: calc(-1 * var(--wa-form-control-border-width));
  }

  /* Ensure interactive states are visible above adjacent buttons */
  :host([appearance='button']:hover),
  :host([appearance='button']:state(checked)) {
    position: relative;
    z-index: 1;
  }

  :host([appearance='button']:focus-visible) {
    z-index: 2;
  }
`})),U,W=e((()=>{H(),R(),y(),m(),x(),a(),d(),T(),F(),U=class extends g{constructor(){super(),this.checked=!1,this.forceDisabled=!1,this.appearance=`default`,this.disabled=!1,this.handleClick=()=>{!this.disabled&&!this.forceDisabled&&(this.checked=!0)},this.addEventListener(`click`,this.handleClick)}handleSizeChange(){o(this.localName,this.size)}connectedCallback(){super.connectedCallback(),this.setInitialAttributes()}setInitialAttributes(){this.setAttribute(`role`,`radio`),this.tabIndex=0,this.setAttribute(`aria-disabled`,this.disabled||this.forceDisabled?`true`:`false`)}updated(e){if(super.updated(e),e.has(`checked`)&&(this.customStates.set(`checked`,this.checked),this.setAttribute(`aria-checked`,this.checked?`true`:`false`),!this.disabled&&!this.forceDisabled&&(this.tabIndex=this.checked?0:-1)),e.has(`disabled`)||e.has(`forceDisabled`)){let e=this.disabled||this.forceDisabled;this.customStates.set(`disabled`,e),this.setAttribute(`aria-disabled`,e?`true`:`false`),e?this.tabIndex=-1:this.tabIndex=this.checked?0:-1}}setValue(){}render(){return S`
      <span part="control" class="control">
        ${this.checked?S`
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" part="checked-icon" class="checked-icon">
                <circle cx="8" cy="8" r="8" />
              </svg>
            `:``}
      </span>

      <slot part="label" class="label"></slot>
    `}},U.css=[B,n,V],l([O()],U.prototype,`checked`,2),l([O()],U.prototype,`forceDisabled`,2),l([w({reflect:!0})],U.prototype,`value`,2),l([w({reflect:!0})],U.prototype,`appearance`,2),l([w({reflect:!0})],U.prototype,`size`,2),l([s(`size`)],U.prototype,`handleSizeChange`,1),l([w({type:Boolean})],U.prototype,`disabled`,2),U=l([M(`wa-radio`)],U),U.disableWarning?.(`change-in-update`)})),G=e((()=>{W(),H(),R(),y(),x(),b(),f(),c()})),K,q=e((()=>{T(),K=j`
  .form-control {
    position: relative;
    border: none;
    padding: 0;
    margin: 0;
  }

  .label {
    padding: 0;
  }

  .radio-group-required .label::after {
    content: var(--wa-form-control-required-content);
    margin-inline-start: var(--wa-form-control-required-content-offset);
  }

  [part~='form-control-input'] {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 0; /* Radios handle their own spacing */
  }

  /* Horizontal */
  :host([orientation='horizontal']) [part~='form-control-input'] {
    flex-direction: row;
  }

  /* Help text */
  [part~='hint'] {
    margin-block-start: 0.5em;
  }
`})),J,Y=e((()=>{q(),z(),R(),p(),y(),m(),r(),x(),a(),d(),T(),F(),P(),J=class extends g{constructor(){super(),this.hasSlotController=new i(this,`hint`,`label`),this.label=``,this.hint=``,this.name=null,this.disabled=!1,this.orientation=`vertical`,this._value=null,this.defaultValue=this.getAttribute(`value`)||null,this.required=!1,this.withLabel=!1,this.withHint=!1,this.handleRadioClick=e=>{let t=e.target.closest(`wa-radio`);if(!t||t.disabled||t.forceDisabled||this.disabled)return;let n=this.value;this.value=t.value,t.checked=!0;let r=this.getAllRadios();for(let e of r)t!==e&&(e.checked=!1,e.setAttribute(`tabindex`,`-1`));this.value!==n&&this.updateComplete.then(()=>{this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))})},this.addEventListener(`keydown`,this.handleKeyDown),this.addEventListener(`click`,this.handleRadioClick)}static get validators(){let e=[re({validationElement:Object.assign(document.createElement(`input`),{required:!0,type:`radio`,name:h(`__wa-radio`)})})];return[...super.validators,...e]}get value(){return this.valueHasChanged?this._value:this._value??this.defaultValue}set value(e){typeof e==`number`&&(e=String(e)),this.valueHasChanged=!0,this._value=e}handleSizeChange(){o(this.localName,this.size)}get validationTarget(){let e=this.querySelector(`:is(wa-radio):not([disabled])`);if(e)return e}updated(e){(e.has(`disabled`)||e.has(`size`)||e.has(`value`)||e.has(`defaultValue`))&&this.syncRadioElements()}formResetCallback(...e){this._value=null,super.formResetCallback(...e),this.syncRadioElements()}getAllRadios(){return[...this.querySelectorAll(`wa-radio`)]}handleLabelClick(){this.focus()}async syncRadioElements(){let e=this.getAllRadios();if(e.forEach((t,n)=>{this.size&&t.setAttribute(`size`,this.size),t.toggleAttribute(`data-wa-radio-horizontal`,this.orientation!==`vertical`),t.toggleAttribute(`data-wa-radio-vertical`,this.orientation===`vertical`),t.toggleAttribute(`data-wa-radio-first`,n===0),t.toggleAttribute(`data-wa-radio-inner`,n!==0&&n!==e.length-1),t.toggleAttribute(`data-wa-radio-last`,n===e.length-1),t.forceDisabled=this.disabled}),await Promise.all(e.map(async e=>{await e.updateComplete,!e.disabled&&e.value===this.value?e.checked=!0:e.checked=!1})),this.disabled)e.forEach(e=>{e.tabIndex=-1});else{let t=e.filter(e=>!e.disabled),n=t.find(e=>e.checked);t.length>0&&(n?t.forEach(e=>{e.tabIndex=e.checked?0:-1}):t.forEach((e,t)=>{e.tabIndex=t===0?0:-1})),e.filter(e=>e.disabled).forEach(e=>{e.tabIndex=-1})}}handleKeyDown(e){if(![`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,` `].includes(e.key)||this.disabled)return;let t=this.getAllRadios().filter(e=>!e.disabled);if(t.length<=0)return;e.preventDefault();let n=this.value,r=t.find(e=>e.checked)??t[0],i=e.key===` `?0:[`ArrowUp`,`ArrowLeft`].includes(e.key)?-1:1,a=t.indexOf(r)+i;a||=0,a<0&&(a=t.length-1),a>t.length-1&&(a=0);let o=t.some(e=>e.tagName.toLowerCase()===`wa-radio-button`);this.getAllRadios().forEach(e=>{e.checked=!1,o||e.setAttribute(`tabindex`,`-1`)}),this.value=t[a].value,t[a].checked=!0,o?t[a].shadowRoot.querySelector(`button`).focus():(t[a].setAttribute(`tabindex`,`0`),t[a].focus()),this.value!==n&&this.updateComplete.then(()=>{this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}),e.preventDefault()}focus(e){if(this.disabled)return;let t=this.getAllRadios(),n=t.find(e=>e.checked),r=t.find(e=>!e.disabled),i=n||r;i&&i.focus(e)}render(){let e=this.hasSlotController.test(`label`,`withLabel`),t=this.hasSlotController.test(`hint`,`withHint`),n=this.label?!0:!!e,r=this.hint?!0:!!t;return S`
      <fieldset
        part="form-control"
        class=${D({"form-control":!0,"form-control-radio-group":!0,"form-control-has-label":n})}
        role="radiogroup"
        aria-labelledby="label"
        aria-describedby="hint"
        aria-errormessage="error-message"
        aria-orientation=${this.orientation}
      >
        <label
          part="form-control-label"
          id="label"
          class=${D({label:!0,"has-label":n})}
          aria-hidden=${n?`false`:`true`}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <slot part="form-control-input" @slotchange=${this.syncRadioElements}></slot>

        <slot
          id="hint"
          name="hint"
          part="hint"
          class=${D({"has-slotted":r})}
          aria-hidden=${r?`false`:`true`}
          >${this.hint}</slot
        >
      </fieldset>
    `}},J.css=[n,B,K],J.shadowRootOptions={...g.shadowRootOptions,delegatesFocus:!0},l([C(`slot:not([name])`)],J.prototype,`defaultSlot`,2),l([w()],J.prototype,`label`,2),l([w({attribute:`hint`})],J.prototype,`hint`,2),l([w({reflect:!0})],J.prototype,`name`,2),l([w({type:Boolean,reflect:!0})],J.prototype,`disabled`,2),l([w({reflect:!0})],J.prototype,`orientation`,2),l([O()],J.prototype,`value`,1),l([w({attribute:`value`,reflect:!0})],J.prototype,`defaultValue`,2),l([w({reflect:!0})],J.prototype,`size`,2),l([s(`size`)],J.prototype,`handleSizeChange`,1),l([w({type:Boolean,reflect:!0})],J.prototype,`required`,2),l([w({type:Boolean,attribute:`with-label`})],J.prototype,`withLabel`,2),l([w({type:Boolean,attribute:`with-hint`})],J.prototype,`withHint`,2),J=l([M(`wa-radio-group`)],J),J.disableWarning?.(`change-in-update`)})),X=e((()=>{Y(),q(),W(),H(),R(),y(),x(),b(),f(),c()})),Z,Q=e((()=>{T(),Z=j`
  :host {
    --height: var(--wa-form-control-toggle-size);
    --width: calc(var(--height) * 1.75);
    --thumb-size: 0.75em;

    display: inline-flex;
    line-height: var(--wa-form-control-value-line-height);
  }

  label {
    position: relative;
    display: flex;
    align-items: center;
    font: inherit;
    color: var(--wa-form-control-value-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .switch {
    flex: 0 0 auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--wa-form-control-background-color);
    border-color: var(--wa-form-control-border-color);
    border-radius: var(--height);
    border-style: var(--wa-form-control-border-style);
    border-width: var(--wa-form-control-border-width);
    transition-property: translate, background, border-color, box-shadow;
    transition-duration: var(--wa-transition-normal);
    transition-timing-function: var(--wa-transition-easing);
  }

  :host([did-ssr]:not(:defined)) .switch {
    transition-property: unset;
    transition-duration: unset;
    transition-timing-function: unset;
  }

  .switch .thumb {
    aspect-ratio: 1 / 1;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--wa-form-control-border-color);
    border-radius: 50%;
    translate: calc((var(--width) - var(--height)) / -2);
    transition: inherit;
  }
  .switch .thumb:dir(rtl) {
    translate: calc((var(--width) - var(--height)) / 2);
  }

  .input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Focus */
  label:not(.disabled) .input:focus-visible ~ .switch .thumb {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Checked */
  .checked .switch {
    background-color: var(--wa-form-control-activated-color);
    border-color: var(--wa-form-control-activated-color);
  }

  .checked .switch .thumb {
    background-color: var(--wa-color-surface-default);
    translate: calc((var(--width) - var(--height)) / 2);
  }
  .checked .switch .thumb:dir(rtl) {
    translate: calc((var(--width) - var(--height)) / -2);
  }

  /* Disabled */
  label:has(> :disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  [part~='label'] {
    display: inline-block;
    line-height: var(--height);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) [part~='label']::after {
    content: var(--wa-form-control-required-content);
    color: var(--wa-form-control-required-content-color);
    margin-inline-start: var(--wa-form-control-required-content-offset);
  }

  @media (forced-colors: active) {
    :checked:enabled + .switch:hover .thumb,
    :checked + .switch .thumb {
      background-color: ButtonText;
    }
  }
`})),$,ie=e((()=>{Q(),R(),_(),y(),m(),r(),x(),a(),v(),d(),T(),F(),P(),A(),N(),$=class extends g{constructor(){super(...arguments),this.hasSlotController=new i(this,`hint`),this.localize=new u(this),this.title=``,this.name=null,this._value=this.getAttribute(`value`)??null,this.size=`m`,this.disabled=!1,this._checked=null,this.defaultChecked=this.hasAttribute(`checked`),this.required=!1,this.hint=``,this.withHint=!1}static get validators(){return[...super.validators,ee()]}get value(){return this._value??`on`}set value(e){this._value=e}handleSizeChange(){o(this.localName,this.size)}get checked(){return this.valueHasChanged?!!this._checked:this._checked??this.defaultChecked}set checked(e){this._checked=!!e,this.valueHasChanged=!0}handleClick(){this.hasInteracted=!0,this.checked=!this.checked,this.updateComplete.then(()=>{this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))})}handleKeyDown(e){let t=this.localize.dir()===`rtl`;e.key===`ArrowLeft`&&(e.preventDefault(),this.checked=t,this.updateComplete.then(()=>{this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})),this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0}))})),e.key===`ArrowRight`&&(e.preventDefault(),this.checked=!t,this.updateComplete.then(()=>{this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})),this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0}))}))}willUpdate(e){super.willUpdate(e),(e.has(`value`)||e.has(`checked`)||e.has(`defaultChecked`))&&this.handleValueOrCheckedChange()}handleValueOrCheckedChange(){if(this.didSSR&&!this.hasUpdated){this.updateComplete.then(()=>{this.handleValueOrCheckedChange()});return}this.setValue(this.checked?this.value:null,this._value),this.updateValidity()}handleStateChange(){this.hasUpdated&&(this.input.checked=this.checked),this.customStates.set(`checked`,this.checked),this.updateValidity()}handleDisabledChange(){this.updateValidity()}click(){this.input.click()}focus(e){this.input.focus(e)}blur(){this.input.blur()}setValue(e,t){if(!this.checked){this.internals.setFormValue(null,null);return}this.internals.setFormValue(e??`on`,t)}formResetCallback(){this._checked=null,super.formResetCallback(),this.handleValueOrCheckedChange()}render(){let e=this.hasSlotController.test(`hint`,`withHint`),t=this.hint?!0:!!e,n=this.didSSR&&!this.hasUpdated?this.checked:this.defaultChecked,r=this.didSSR&&!this.hasUpdated?null:te(this.checked);return S`
      <label
        part="base"
        class=${D({checked:this.checked,disabled:this.disabled})}
      >
        <input
          class="input"
          type="checkbox"
          title=${this.title}
          name=${E(this.name)}
          value=${E(this.value)}
          .checked=${E(r)}
          ?checked=${n}
          ?disabled=${this.disabled}
          ?required=${this.required}
          role="switch"
          aria-checked=${this.checked?`true`:`false`}
          aria-describedby="hint"
          @click=${this.handleClick}
          @keydown=${this.handleKeyDown}
        />

        <span part="control" class="switch">
          <span part="thumb" class="thumb"></span>
        </span>

        <slot part="label" class="label"></slot>
      </label>

      <slot
        id="hint"
        name="hint"
        part="hint"
        class=${D({"has-slotted":t})}
        aria-hidden=${t?`false`:`true`}
        >${this.hint}</slot
      >
    `}},$.shadowRootOptions={...g.shadowRootOptions,delegatesFocus:!0},$.css=[B,n,Z],l([C(`input[type="checkbox"]`)],$.prototype,`input`,2),l([w()],$.prototype,`title`,2),l([w({reflect:!0})],$.prototype,`name`,2),l([w({reflect:!0})],$.prototype,`value`,1),l([w({reflect:!0})],$.prototype,`size`,2),l([s(`size`)],$.prototype,`handleSizeChange`,1),l([w({type:Boolean})],$.prototype,`disabled`,2),l([w({type:Boolean,attribute:!1})],$.prototype,`checked`,1),l([w({type:Boolean,attribute:`checked`,reflect:!0})],$.prototype,`defaultChecked`,2),l([w({type:Boolean,reflect:!0})],$.prototype,`required`,2),l([w({attribute:`hint`})],$.prototype,`hint`,2),l([w({attribute:`with-hint`,type:Boolean})],$.prototype,`withHint`,2),l([s([`checked`,`defaultChecked`])],$.prototype,`handleStateChange`,1),l([s(`disabled`,{waitUntilFirstUpdate:!0})],$.prototype,`handleDisabledChange`,1),$=l([M(`wa-switch`)],$),$.disableWarning?.(`change-in-update`)})),ae=e((()=>{ie(),Q(),R(),y(),x(),c(),v(),t()}));function oe(e,t={}){return S`
    <div class=${t.wide?`settings-page settings-page--wide`:`settings-page`}>
      ${t.intro?S`<p class="settings-page__intro">${t.intro}</p>`:k}
      ${e}
    </div>
  `}function se(e,t){return S`
    <section class="settings-section">
      ${e.title||e.actions?S`
          <div class="settings-section__header">
            ${e.title?S`
                  <h2 class="settings-section__heading">
                    ${e.title}${e.count===void 0?k:S` <span class="settings-count">${e.count}</span>`}
                  </h2>
                `:k}
            ${e.actions?S`<div class="settings-section__actions">${e.actions}</div>`:k}
          </div>
        `:k}${e.description?S`<p class="settings-section__desc">${e.description}</p>`:k}
      <div class=${e.danger?`settings-group settings-group--danger`:`settings-group`}>${t}</div>
    </section>
  `}function ce(e,t={}){return S`<div class=${t.danger?`settings-group settings-group--danger`:`settings-group`}>${e}</div>`}function le(e){return S`
    <div class=${e.stacked?`settings-row settings-row--stacked`:`settings-row`}>
      <div class="settings-row__text">
        <span class="settings-row__title">${e.title}</span>
        ${e.description?S`<span class="settings-row__desc">${e.description}</span>`:k}
      </div>
      ${e.control!==void 0&&e.control!==k?S`<div class="settings-row__control">${e.control}</div>`:k}
    </div>
  `}function ue(e){return S`
    <button type="button" class="settings-row settings-row--nav" @click=${e.onClick}>
      <div class="settings-row__text">
        <span class="settings-row__title">${e.title}</span>
        ${e.description?S`<span class="settings-row__desc">${e.description}</span>`:k}
      </div>
      <div class="settings-row__control">
        ${e.control??k}
        <span class="settings-row__chevron">${I.chevronRight}</span>
      </div>
    </button>
  `}function de(e){return S`
    <wa-switch
      class="settings-toggle"
      size="s"
      .checked=${e.checked}
      ?disabled=${e.disabled??!1}
      @change=${t=>{e.onChange(t.currentTarget.checked)}}
    >
      <span class="settings-control__sr-label">${e.ariaLabel}</span>
    </wa-switch>
  `}function fe(e){return S`
    <div
      class="settings-row settings-row--toggle"
      @click=${t=>{let n=t.target;e.disabled||n instanceof Element&&n.closest(`wa-switch`)!==null||e.onChange(!e.checked)}}
    >
      <div class="settings-row__text">
        <span class="settings-row__title">${e.title}</span>
        ${e.description?S`<span class="settings-row__desc">${e.description}</span>`:k}
      </div>
      <div class="settings-row__control">
        <wa-switch
          class="settings-toggle"
          size="s"
          .checked=${e.checked}
          ?disabled=${e.disabled??!1}
          @change=${t=>{e.onChange(t.currentTarget.checked)}}
        >
          <span class="settings-control__sr-label">${e.title}</span>
        </wa-switch>
      </div>
    </div>
  `}function pe(e){return S`
    <wa-radio-group
      class="settings-segmented"
      size="s"
      orientation="horizontal"
      .value=${e.value}
      ?disabled=${e.disabled??!1}
      @change=${t=>{let n=t.currentTarget.value;if(n!==void 0){let r=t.currentTarget,i=[...r.querySelectorAll(`wa-radio`)].find(e=>e.getAttribute(`value`)===n);e.onChange(n,i??r)}}}
    >
      ${e.ariaLabel?S`<span slot="label" class="settings-control__sr-label">${e.ariaLabel}</span>`:k}
      ${e.options.map(t=>S`
          <wa-radio
            class="settings-segmented__btn ${t.value===e.value?`settings-segmented__btn--active`:``}"
            appearance="button"
            value=${t.value}
            .checked=${t.value===e.value}
            title=${t.title??k}
          >
            ${t.label}
          </wa-radio>
        `)}
    </wa-radio-group>
  `}function me(e){return S`
    <span class="settings-status${e.kind===`muted`?``:` settings-status--${e.kind}`}">
      <span class="settings-status__dot"></span>
      ${e.label}
    </span>
  `}function he(e,t={}){return S`<span class=${t.mono?`settings-row__value settings-row__value--mono`:`settings-row__value`}>${e}</span>`}function ge(e){return S`<div class="settings-empty">${e}</div>`}function _e(e){return S`
    <span class="settings-secret">
      <input
        class="settings-input"
        type=${e.visible?`text`:`password`}
        autocomplete="off"
        spellcheck="false"
        .value=${e.value}
        placeholder=${e.placeholder??``}
        @input=${t=>e.onInput(t.target.value)}
      />
      <openclaw-tooltip .content=${e.visible?e.hideLabel:e.showLabel}>
        <button
          type="button"
          class="settings-secret__toggle"
          aria-label=${e.toggleLabel}
          aria-pressed=${e.visible}
          @click=${e.onToggle}
        >
          ${e.visible?I.eye:I.eyeOff}
        </button>
      </openclaw-tooltip>
    </span>
  `}var ve=e((()=>{G(),X(),ae(),T(),L(),ne()}));export{oe as a,se as c,de as d,fe as f,G as h,ue as i,pe as l,X as m,ge as n,le as o,he as p,ce as r,_e as s,ve as t,me as u};
//# sourceMappingURL=settings-ui-BJ5HJKwt.js.map