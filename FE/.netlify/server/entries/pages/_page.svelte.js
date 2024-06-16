import { c as create_ssr_component, b as compute_rest_props, d as get_current_component, f as spread, h as escape_attribute_value, i as escape_object, j as add_attribute, k as each, g as getContext, a as subscribe, s as setContext, o as onDestroy, l as set_store_value, v as validate_component, m as missing_component, e as escape, n as compute_slots } from "../../chunks/ssr.js";
import { MDCRippleFoundation, util } from "@material/ripple";
import { events, ponyfill } from "@material/dom";
import { w as writable, r as readable } from "../../chunks/index.js";
import { MDCTopAppBarBaseFoundation, MDCShortTopAppBarFoundation, MDCFixedTopAppBarFoundation, MDCTopAppBarFoundation } from "@material/top-app-bar";
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);
const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(name) {
  return void_element_names.test(name) || name.toLowerCase() === "!doctype";
}
function classMap(classObj) {
  return Object.entries(classObj).filter(([name, value]) => name !== "" && value).map(([name]) => name).join(" ");
}
function dispatch(element, eventType, detail, eventInit = { bubbles: true }, duplicateEventForMDC = false) {
  if (typeof Event === "undefined") {
    throw new Error("Event not defined.");
  }
  {
    throw new Error("Tried to dipatch event without element.");
  }
}
function exclude(obj, keys) {
  let names = Object.getOwnPropertyNames(obj);
  const newObj = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const cashIndex = name.indexOf("$");
    if (cashIndex !== -1 && keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
      continue;
    }
    if (keys.indexOf(name) !== -1) {
      continue;
    }
    newObj[name] = obj[name];
  }
  return newObj;
}
const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
function forwardEventsBuilder(component) {
  let $on;
  let events2 = [];
  component.$on = (fullEventType, callback) => {
    let eventType = fullEventType;
    let destructor = () => {
    };
    if ($on) {
      destructor = $on(eventType, callback);
    } else {
      events2.push([eventType, callback]);
    }
    const oldModifierMatch = eventType.match(oldModifierRegex);
    if (oldModifierMatch && console) {
      console.warn('Event modifiers in SMUI now use "$" instead of ":", so that all events can be bound with modifiers. Please update your event binding: ', eventType);
    }
    return () => {
      destructor();
    };
  };
  function bubble(e) {
    const callbacks = component.$$.callbacks[e.type];
    if (callbacks) {
      callbacks.slice().forEach((fn) => fn.call(this, e));
    }
  }
  return (node) => {
    const destructors = [];
    const forwardDestructors = {};
    $on = (fullEventType, callback) => {
      let eventType = fullEventType;
      let handler = callback;
      let options = false;
      const oldModifierMatch = eventType.match(oldModifierRegex);
      const newModifierMatch = eventType.match(newModifierRegex);
      const modifierMatch = oldModifierMatch || newModifierMatch;
      if (eventType.match(/^SMUI:\w+:/)) {
        const newEventTypeParts = eventType.split(":");
        let newEventType = "";
        for (let i = 0; i < newEventTypeParts.length; i++) {
          newEventType += i === newEventTypeParts.length - 1 ? ":" + newEventTypeParts[i] : newEventTypeParts[i].split("-").map((value) => value.slice(0, 1).toUpperCase() + value.slice(1)).join("");
        }
        console.warn(`The event ${eventType.split("$")[0]} has been renamed to ${newEventType.split("$")[0]}.`);
        eventType = newEventType;
      }
      if (modifierMatch) {
        const parts = eventType.split(oldModifierMatch ? ":" : "$");
        eventType = parts[0];
        const eventOptions = parts.slice(1).reduce((obj, mod) => {
          obj[mod] = true;
          return obj;
        }, {});
        if (eventOptions.passive) {
          options = options || {};
          options.passive = true;
        }
        if (eventOptions.nonpassive) {
          options = options || {};
          options.passive = false;
        }
        if (eventOptions.capture) {
          options = options || {};
          options.capture = true;
        }
        if (eventOptions.once) {
          options = options || {};
          options.once = true;
        }
        if (eventOptions.preventDefault) {
          handler = prevent_default(handler);
        }
        if (eventOptions.stopPropagation) {
          handler = stop_propagation(handler);
        }
        if (eventOptions.stopImmediatePropagation) {
          handler = stop_immediate_propagation(handler);
        }
        if (eventOptions.self) {
          handler = self_event(node, handler);
        }
        if (eventOptions.trusted) {
          handler = trusted_event(handler);
        }
      }
      const off = listen(node, eventType, handler, options);
      const destructor = () => {
        off();
        const idx = destructors.indexOf(destructor);
        if (idx > -1) {
          destructors.splice(idx, 1);
        }
      };
      destructors.push(destructor);
      if (!(eventType in forwardDestructors)) {
        forwardDestructors[eventType] = listen(node, eventType, bubble);
      }
      return destructor;
    };
    for (let i = 0; i < events2.length; i++) {
      $on(events2[i][0], events2[i][1]);
    }
    return {
      destroy: () => {
        for (let i = 0; i < destructors.length; i++) {
          destructors[i]();
        }
        for (let entry of Object.entries(forwardDestructors)) {
          entry[1]();
        }
      }
    };
  };
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function stop_propagation(fn) {
  return function(event) {
    event.stopPropagation();
    return fn.call(this, event);
  };
}
function stop_immediate_propagation(fn) {
  return function(event) {
    event.stopImmediatePropagation();
    return fn.call(this, event);
  };
}
function self_event(node, fn) {
  return function(event) {
    if (event.target !== node) {
      return;
    }
    return fn.call(this, event);
  };
}
function trusted_event(fn) {
  return function(event) {
    if (!event.isTrusted) {
      return;
    }
    return fn.call(this, event);
  };
}
function prefixFilter(obj, prefix) {
  let names = Object.getOwnPropertyNames(obj);
  const newObj = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (name.substring(0, prefix.length) === prefix) {
      newObj[name.substring(prefix.length)] = obj[name];
    }
  }
  return newObj;
}
const CircularProgress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "indeterminate", "closed", "progress", "fourColor", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { indeterminate = false } = $$props;
  let { closed = false } = $$props;
  let { progress = 0 } = $$props;
  let { fourColor = false } = $$props;
  let element;
  let internalClasses = {};
  let internalAttrs = {};
  let determinateCircleAttrs = {};
  let determinateCircle;
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.indeterminate === void 0 && $$bindings.indeterminate && indeterminate !== void 0)
    $$bindings.indeterminate(indeterminate);
  if ($$props.closed === void 0 && $$bindings.closed && closed !== void 0)
    $$bindings.closed(closed);
  if ($$props.progress === void 0 && $$bindings.progress && progress !== void 0)
    $$bindings.progress(progress);
  if ($$props.fourColor === void 0 && $$bindings.fourColor && fourColor !== void 0)
    $$bindings.fourColor(fourColor);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-circular-progress": true,
          "mdc-circular-progress--indeterminate": indeterminate,
          "mdc-circular-progress--closed": closed,
          ...internalClasses
        }))
      },
      { role: "progressbar" },
      {
        "aria-valuemin": escape_attribute_value(0)
      },
      {
        "aria-valuemax": escape_attribute_value(1)
      },
      {
        "aria-valuenow": escape_attribute_value(indeterminate ? void 0 : progress)
      },
      escape_object(internalAttrs),
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}><div class="mdc-circular-progress__determinate-container"><svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle class="mdc-circular-progress__determinate-track" cx="24" cy="24" r="18" stroke-width="4"></circle><circle${spread(
    [
      {
        class: "mdc-circular-progress__determinate-circle"
      },
      { cx: "24" },
      { cy: "24" },
      { r: "18" },
      { "stroke-dasharray": "113.097" },
      { "stroke-dashoffset": "113.097" },
      { "stroke-width": "4" },
      escape_object(determinateCircleAttrs)
    ],
    {}
  )}${add_attribute("this", determinateCircle, 0)}></circle></svg></div> <div class="mdc-circular-progress__indeterminate-container">${each(fourColor ? [1, 2, 3, 4] : [1], (color) => {
    return `<div${add_attribute(
      "class",
      classMap({
        [className]: true,
        "mdc-circular-progress__spinner-layer": true,
        ["mdc-circular-progress__color-" + color]: fourColor
      }),
      0
    )}><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left" data-svelte-h="svelte-1d4f91x"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"></circle></svg></div> <div class="mdc-circular-progress__gap-patch" data-svelte-h="svelte-qvm4qv"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.2"></circle></svg></div> <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right" data-svelte-h="svelte-c3k2p4"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"></circle></svg></div> </div>`;
  })}</div> </div>`;
});
const { applyPassive } = events;
const { matches } = ponyfill;
function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve() } = {}) {
  let instance;
  let addLayoutListener = getContext("SMUI:addLayoutListener");
  let removeLayoutListener;
  let oldActive = active;
  let oldEventTarget = eventTarget;
  let oldActiveTarget = activeTarget;
  function handleProps() {
    if (surface) {
      addClass("mdc-ripple-surface");
      if (color === "primary") {
        addClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      } else if (color === "secondary") {
        removeClass("smui-ripple-surface--primary");
        addClass("smui-ripple-surface--secondary");
      } else {
        removeClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      }
    } else {
      removeClass("mdc-ripple-surface");
      removeClass("smui-ripple-surface--primary");
      removeClass("smui-ripple-surface--secondary");
    }
    if (instance && oldActive !== active) {
      oldActive = active;
      if (active) {
        instance.activate();
      } else if (active === false) {
        instance.deactivate();
      }
    }
    if (ripple && !instance) {
      instance = new MDCRippleFoundation({
        addClass,
        browserSupportsCssVars: () => util.supportsCssVariables(window),
        computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
        containsEventTarget: (target) => node.contains(target),
        deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
        deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
        deregisterResizeHandler: (handler) => window.removeEventListener("resize", handler),
        getWindowPageOffset: () => ({
          x: window.pageXOffset,
          y: window.pageYOffset
        }),
        isSurfaceActive: () => active == null ? matches(activeTarget || node, ":active") : active,
        isSurfaceDisabled: () => !!disabled,
        isUnbounded: () => !!unbounded,
        registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
        registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
        registerResizeHandler: (handler) => window.addEventListener("resize", handler),
        removeClass,
        updateCssVariable: addStyle
      });
      initPromise.then(() => {
        if (instance) {
          instance.init();
          instance.setUnbounded(unbounded);
        }
      });
    } else if (instance && !ripple) {
      initPromise.then(() => {
        if (instance) {
          instance.destroy();
          instance = void 0;
        }
      });
    }
    if (instance && (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
      oldEventTarget = eventTarget;
      oldActiveTarget = activeTarget;
      instance.destroy();
      requestAnimationFrame(() => {
        if (instance) {
          instance.init();
          instance.setUnbounded(unbounded);
        }
      });
    }
    if (!ripple && unbounded) {
      addClass("mdc-ripple-upgraded--unbounded");
    }
  }
  handleProps();
  if (addLayoutListener) {
    removeLayoutListener = addLayoutListener(layout);
  }
  function layout() {
    if (instance) {
      instance.layout();
    }
  }
  return {
    update(props) {
      ({
        ripple,
        surface,
        unbounded,
        disabled,
        color,
        active,
        rippleElement,
        eventTarget,
        activeTarget,
        addClass,
        removeClass,
        addStyle,
        initPromise
      } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: void 0, active: void 0, rippleElement: void 0, eventTarget: void 0, activeTarget: void 0, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
      handleProps();
    },
    destroy() {
      if (instance) {
        instance.destroy();
        instance = void 0;
        removeClass("mdc-ripple-surface");
        removeClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      }
      if (removeLayoutListener) {
        removeLayoutListener();
      }
    }
  };
}
const SmuiElement = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selfClosing;
  let $$restProps = compute_rest_props($$props, ["use", "tag", "getElement"]);
  let { use = [] } = $$props;
  let { tag } = $$props;
  forwardEventsBuilder(get_current_component());
  let element;
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  selfClosing = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ].indexOf(tag) > -1;
  return `${tag === "svg" ? `<svg${spread([escape_object($$restProps)], {})}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}</svg>` : `${selfClosing ? `${((tag$1) => {
    return tag$1 ? `<${tag}${spread([escape_object($$restProps)], {})}${add_attribute("this", element, 0)}>${is_void(tag$1) ? "" : ``}${is_void(tag$1) ? "" : `</${tag$1}>`}` : "";
  })(tag)}` : `${((tag$1) => {
    return tag$1 ? `<${tag}${spread([escape_object($$restProps)], {})}${add_attribute("this", element, 0)}>${is_void(tag$1) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag$1) ? "" : `</${tag$1}>`}` : "";
  })(tag)}`}`}`;
});
const ContextFragment = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $storeValue, $$unsubscribe_storeValue;
  let { key } = $$props;
  let { value } = $$props;
  const storeValue = writable(value);
  $$unsubscribe_storeValue = subscribe(storeValue, (value2) => $storeValue = value2);
  setContext(key, storeValue);
  onDestroy(() => {
    storeValue.set(void 0);
  });
  if ($$props.key === void 0 && $$bindings.key && key !== void 0)
    $$bindings.key(key);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  set_store_value(storeValue, $storeValue = value, $storeValue);
  $$unsubscribe_storeValue();
  return `${slots.default ? slots.default({}) : ``}`;
});
const { Object: Object_1$2 } = globals;
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let actionProp;
  let defaultProp;
  let secondaryProp;
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "ripple",
    "color",
    "variant",
    "touch",
    "href",
    "action",
    "defaultAction",
    "secondary",
    "component",
    "tag",
    "getElement"
  ]);
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { ripple = true } = $$props;
  let { color = "primary" } = $$props;
  let { variant = "text" } = $$props;
  let { touch = false } = $$props;
  let { href = void 0 } = $$props;
  let { action = "close" } = $$props;
  let { defaultAction = false } = $$props;
  let { secondary = false } = $$props;
  let element;
  let internalClasses = {};
  let internalStyles = {};
  let context = getContext("SMUI:button:context");
  let { component = SmuiElement } = $$props;
  let { tag = component === SmuiElement ? href == null ? "button" : "a" : void 0 } = $$props;
  let previousDisabled = $$restProps.disabled;
  setContext("SMUI:label:context", "button");
  setContext("SMUI:icon:context", "button");
  function addClass(className2) {
    if (!internalClasses[className2]) {
      internalClasses[className2] = true;
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      internalClasses[className2] = false;
    }
  }
  function addStyle(name, value) {
    if (internalStyles[name] != value) {
      if (value === "" || value == null) {
        delete internalStyles[name];
        internalStyles = internalStyles;
      } else {
        internalStyles[name] = value;
      }
    }
  }
  function getElement() {
    return element.getElement();
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.ripple === void 0 && $$bindings.ripple && ripple !== void 0)
    $$bindings.ripple(ripple);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.touch === void 0 && $$bindings.touch && touch !== void 0)
    $$bindings.touch(touch);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.defaultAction === void 0 && $$bindings.defaultAction && defaultAction !== void 0)
    $$bindings.defaultAction(defaultAction);
  if ($$props.secondary === void 0 && $$bindings.secondary && secondary !== void 0)
    $$bindings.secondary(secondary);
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    actionProp = context === "dialog:action" && action != null ? { "data-mdc-dialog-action": action } : { action: $$props.action };
    defaultProp = context === "dialog:action" && defaultAction ? { "data-mdc-dialog-button-default": "" } : { default: $$props.default };
    secondaryProp = context === "banner" ? {} : { secondary: $$props.secondary };
    {
      if (previousDisabled !== $$restProps.disabled) {
        if (element) {
          const el = getElement();
          if ("blur" in el) {
            el.blur();
          }
        }
        previousDisabled = $$restProps.disabled;
      }
    }
    $$rendered = `${validate_component(component || missing_component, "svelte:component").$$render(
      $$result,
      Object_1$2.assign(
        {},
        { tag },
        {
          use: [
            [
              Ripple,
              {
                ripple,
                unbounded: false,
                color,
                disabled: !!$$restProps.disabled,
                addClass,
                removeClass,
                addStyle
              }
            ],
            forwardEvents,
            ...use
          ]
        },
        {
          class: classMap({
            [className]: true,
            "mdc-button": true,
            "mdc-button--raised": variant === "raised",
            "mdc-button--unelevated": variant === "unelevated",
            "mdc-button--outlined": variant === "outlined",
            "smui-button--color-secondary": color === "secondary",
            "mdc-button--touch": touch,
            "mdc-card__action": context === "card:action",
            "mdc-card__action--button": context === "card:action",
            "mdc-dialog__button": context === "dialog:action",
            "mdc-top-app-bar__navigation-icon": context === "top-app-bar:navigation",
            "mdc-top-app-bar__action-item": context === "top-app-bar:action",
            "mdc-snackbar__action": context === "snackbar:actions",
            "mdc-banner__secondary-action": context === "banner" && secondary,
            "mdc-banner__primary-action": context === "banner" && !secondary,
            "mdc-tooltip__action": context === "tooltip:rich-actions",
            ...internalClasses
          })
        },
        {
          style: Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" ")
        },
        actionProp,
        defaultProp,
        secondaryProp,
        { href },
        $$restProps,
        { this: element }
      ),
      {
        this: ($$value) => {
          element = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<div class="mdc-button__ripple"></div> ${slots.default ? slots.default({}) : ``}${touch ? `<div class="mdc-button__touch"></div>` : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const TopAppBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "variant",
    "color",
    "collapsed",
    "prominent",
    "dense",
    "scrollTarget",
    "getPropStore",
    "getElement"
  ]);
  forwardEventsBuilder(get_current_component());
  let uninitializedValue = () => {
  };
  function isUninitializedValue(value) {
    return value === uninitializedValue;
  }
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { variant = "standard" } = $$props;
  let { color = "primary" } = $$props;
  let { collapsed = uninitializedValue } = $$props;
  const alwaysCollapsed = !isUninitializedValue(collapsed) && !!collapsed;
  if (isUninitializedValue(collapsed)) {
    collapsed = false;
  }
  let { prominent = false } = $$props;
  let { dense = false } = $$props;
  let { scrollTarget = void 0 } = $$props;
  let element;
  let instance;
  let internalClasses = {};
  let internalStyles = {};
  let propStoreSet;
  let propStore = readable({ variant, prominent, dense }, (set) => {
    propStoreSet = set;
  });
  let oldScrollTarget = void 0;
  let oldVariant = variant;
  function getInstance() {
    const Foundation = {
      static: MDCTopAppBarBaseFoundation,
      short: MDCShortTopAppBarFoundation,
      fixed: MDCFixedTopAppBarFoundation,
      standard: MDCTopAppBarFoundation
    }[variant] || MDCTopAppBarFoundation;
    return new Foundation({
      hasClass,
      addClass,
      removeClass,
      setStyle: addStyle,
      getTopAppBarHeight: () => element.clientHeight,
      notifyNavigationIconClicked: () => dispatch(element, "SMUITopAppBar:nav", void 0, void 0, true),
      getViewportScrollY: () => scrollTarget == null ? window.pageYOffset : scrollTarget.scrollTop,
      getTotalActionItems: () => element.querySelectorAll(".mdc-top-app-bar__action-item").length
    });
  }
  function hasClass(className2) {
    return className2 in internalClasses ? internalClasses[className2] : getElement().classList.contains(className2);
  }
  function addClass(className2) {
    if (!internalClasses[className2]) {
      internalClasses[className2] = true;
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      internalClasses[className2] = false;
    }
  }
  function addStyle(name, value) {
    if (internalStyles[name] != value) {
      if (value === "" || value == null) {
        delete internalStyles[name];
        internalStyles = internalStyles;
      } else {
        internalStyles[name] = value;
      }
    }
  }
  function handleTargetScroll() {
    if (instance) {
      instance.handleTargetScroll();
      if (variant === "short") {
        collapsed = "isCollapsed" in instance && instance.isCollapsed;
      }
    }
  }
  function getPropStore() {
    return propStore;
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.collapsed === void 0 && $$bindings.collapsed && collapsed !== void 0)
    $$bindings.collapsed(collapsed);
  if ($$props.prominent === void 0 && $$bindings.prominent && prominent !== void 0)
    $$bindings.prominent(prominent);
  if ($$props.dense === void 0 && $$bindings.dense && dense !== void 0)
    $$bindings.dense(dense);
  if ($$props.scrollTarget === void 0 && $$bindings.scrollTarget && scrollTarget !== void 0)
    $$bindings.scrollTarget(scrollTarget);
  if ($$props.getPropStore === void 0 && $$bindings.getPropStore && getPropStore !== void 0)
    $$bindings.getPropStore(getPropStore);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  {
    if (propStoreSet) {
      propStoreSet({ variant, prominent, dense });
    }
  }
  {
    if (oldVariant !== variant && instance) {
      oldVariant = variant;
      instance.destroy();
      internalClasses = {};
      internalStyles = {};
      instance = getInstance();
      instance.init();
    }
  }
  {
    if (instance && variant === "short" && "setAlwaysCollapsed" in instance) {
      instance.setAlwaysCollapsed(alwaysCollapsed);
    }
  }
  {
    if (oldScrollTarget !== scrollTarget) {
      if (oldScrollTarget) {
        oldScrollTarget.removeEventListener("scroll", handleTargetScroll);
      }
      if (scrollTarget) {
        scrollTarget.addEventListener("scroll", handleTargetScroll);
      }
      oldScrollTarget = scrollTarget;
    }
  }
  return ` <header${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-top-app-bar": true,
          "mdc-top-app-bar--short": variant === "short",
          "mdc-top-app-bar--short-collapsed": collapsed,
          "mdc-top-app-bar--fixed": variant === "fixed",
          "smui-top-app-bar--static": variant === "static",
          "smui-top-app-bar--color-secondary": color === "secondary",
          "mdc-top-app-bar--prominent": prominent,
          "mdc-top-app-bar--dense": dense,
          ...internalClasses
        }))
      },
      {
        style: escape_attribute_value(Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" "))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``} </header>`;
});
const { Object: Object_1$1 } = globals;
const internals = {
  component: SmuiElement,
  tag: "div",
  class: "",
  classMap: {},
  contexts: {},
  props: {}
};
const ClassAdder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "component", "tag", "getElement"]);
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let element;
  const smuiClass = internals.class;
  const smuiClassMap = {};
  const smuiClassUnsubscribes = [];
  const contexts = internals.contexts;
  const props = internals.props;
  let { component = internals.component } = $$props;
  let { tag = component === SmuiElement ? internals.tag : void 0 } = $$props;
  Object.entries(internals.classMap).forEach(([name, context]) => {
    const store = getContext(context);
    if (store && "subscribe" in store) {
      smuiClassUnsubscribes.push(store.subscribe((value) => {
        smuiClassMap[name] = value;
      }));
    }
  });
  const forwardEvents = forwardEventsBuilder(get_current_component());
  for (let context in contexts) {
    if (contexts.hasOwnProperty(context)) {
      setContext(context, contexts[context]);
    }
  }
  onDestroy(() => {
    for (const unsubscribe of smuiClassUnsubscribes) {
      unsubscribe();
    }
  });
  function getElement() {
    return element.getElement();
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(component || missing_component, "svelte:component").$$render(
      $$result,
      Object_1$1.assign(
        {},
        { tag },
        { use: [forwardEvents, ...use] },
        {
          class: classMap({
            [className]: true,
            [smuiClass]: true,
            ...smuiClassMap
          })
        },
        props,
        $$restProps,
        { this: element }
      ),
      {
        this: ($$value) => {
          element = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const defaults = Object.assign({}, internals);
function classAdderBuilder(props) {
  return new Proxy(ClassAdder, {
    construct: function(target, args) {
      Object.assign(internals, defaults, props);
      return new target(...args);
    },
    get: function(target, prop) {
      Object.assign(internals, defaults, props);
      return target[prop];
    }
  });
}
const Row$1 = classAdderBuilder({
  class: "mdc-top-app-bar__row",
  tag: "div"
});
const Section = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "align", "toolbar", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { align = "start" } = $$props;
  let { toolbar = false } = $$props;
  let element;
  setContext("SMUI:icon-button:context", toolbar ? "top-app-bar:action" : "top-app-bar:navigation");
  setContext("SMUI:button:context", toolbar ? "top-app-bar:action" : "top-app-bar:navigation");
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  if ($$props.toolbar === void 0 && $$bindings.toolbar && toolbar !== void 0)
    $$bindings.toolbar(toolbar);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<section${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-top-app-bar__section": true,
          "mdc-top-app-bar__section--align-start": align === "start",
          "mdc-top-app-bar__section--align-end": align === "end"
        }))
      },
      escape_object(toolbar ? { role: "toolbar" } : {}),
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``} </section>`;
});
const Title = classAdderBuilder({
  class: "mdc-top-app-bar__title",
  tag: "span"
});
const FloatingLabel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "for",
    "floatAbove",
    "required",
    "wrapped",
    "shake",
    "float",
    "setRequired",
    "getWidth",
    "getElement"
  ]);
  var _a;
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { for: forId = void 0 } = $$props;
  let { floatAbove = false } = $$props;
  let { required = false } = $$props;
  let { wrapped = false } = $$props;
  let element;
  let instance;
  let internalClasses = {};
  let internalStyles = {};
  let inputProps = (_a = getContext("SMUI:generic:input:props")) !== null && _a !== void 0 ? _a : {};
  function shake(shouldShake) {
    instance.shake(shouldShake);
  }
  function float(shouldFloat) {
    floatAbove = shouldFloat;
  }
  function setRequired(isRequired) {
    required = isRequired;
  }
  function getWidth() {
    return instance.getWidth();
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.for === void 0 && $$bindings.for && forId !== void 0)
    $$bindings.for(forId);
  if ($$props.floatAbove === void 0 && $$bindings.floatAbove && floatAbove !== void 0)
    $$bindings.floatAbove(floatAbove);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.wrapped === void 0 && $$bindings.wrapped && wrapped !== void 0)
    $$bindings.wrapped(wrapped);
  if ($$props.shake === void 0 && $$bindings.shake && shake !== void 0)
    $$bindings.shake(shake);
  if ($$props.float === void 0 && $$bindings.float && float !== void 0)
    $$bindings.float(float);
  if ($$props.setRequired === void 0 && $$bindings.setRequired && setRequired !== void 0)
    $$bindings.setRequired(setRequired);
  if ($$props.getWidth === void 0 && $$bindings.getWidth && getWidth !== void 0)
    $$bindings.getWidth(getWidth);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `${wrapped ? `<span${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-floating-label": true,
          "mdc-floating-label--float-above": floatAbove,
          "mdc-floating-label--required": required,
          ...internalClasses
        }))
      },
      {
        style: escape_attribute_value(Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" "))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}</span>` : `<label${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-floating-label": true,
          "mdc-floating-label--float-above": floatAbove,
          "mdc-floating-label--required": required,
          ...internalClasses
        }))
      },
      {
        style: escape_attribute_value(Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" "))
      },
      {
        for: escape_attribute_value(forId || (inputProps ? inputProps.id : void 0))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}</label>`}`;
});
const LineRipple = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "active",
    "activate",
    "deactivate",
    "setRippleCenter",
    "getElement"
  ]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { active = false } = $$props;
  let element;
  let instance;
  let internalClasses = {};
  let internalStyles = {};
  function activate() {
    instance.activate();
  }
  function deactivate() {
    instance.deactivate();
  }
  function setRippleCenter(xCoordinate) {
    instance.setRippleCenter(xCoordinate);
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.activate === void 0 && $$bindings.activate && activate !== void 0)
    $$bindings.activate(activate);
  if ($$props.deactivate === void 0 && $$bindings.deactivate && deactivate !== void 0)
    $$bindings.deactivate(deactivate);
  if ($$props.setRippleCenter === void 0 && $$bindings.setRippleCenter && setRippleCenter !== void 0)
    $$bindings.setRippleCenter(setRippleCenter);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-line-ripple": true,
          "mdc-line-ripple--active": active,
          ...internalClasses
        }))
      },
      {
        style: escape_attribute_value(Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" "))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}></div>`;
});
const NotchedOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "notched", "noLabel", "notch", "closeNotch", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { notched = false } = $$props;
  let { noLabel = false } = $$props;
  let element;
  let instance;
  let internalClasses = {};
  let notchStyles = {};
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      internalClasses[className2] = false;
    }
  }
  function notch(notchWidth) {
    instance.notch(notchWidth);
  }
  function closeNotch() {
    instance.closeNotch();
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.notched === void 0 && $$bindings.notched && notched !== void 0)
    $$bindings.notched(notched);
  if ($$props.noLabel === void 0 && $$bindings.noLabel && noLabel !== void 0)
    $$bindings.noLabel(noLabel);
  if ($$props.notch === void 0 && $$bindings.notch && notch !== void 0)
    $$bindings.notch(notch);
  if ($$props.closeNotch === void 0 && $$bindings.closeNotch && closeNotch !== void 0)
    $$bindings.closeNotch(closeNotch);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  {
    {
      removeClass("mdc-notched-outline--upgraded");
    }
  }
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-notched-outline": true,
          "mdc-notched-outline--notched": notched,
          "mdc-notched-outline--no-label": noLabel,
          ...internalClasses
        }))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}><div class="mdc-notched-outline__leading"></div> ${!noLabel ? `<div class="mdc-notched-outline__notch"${add_attribute("style", Object.entries(notchStyles).map(([name, value]) => `${name}: ${value};`).join(" "), 0)}>${slots.default ? slots.default({}) : ``}</div>` : ``} <div class="mdc-notched-outline__trailing"></div> </div>`;
});
const HelperLine = classAdderBuilder({
  class: "mdc-text-field-helper-line",
  tag: "div"
});
const Prefix = classAdderBuilder({
  class: "mdc-text-field__affix mdc-text-field__affix--prefix",
  tag: "span"
});
const Suffix = classAdderBuilder({
  class: "mdc-text-field__affix mdc-text-field__affix--suffix",
  tag: "span"
});
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "type",
    "placeholder",
    "value",
    "files",
    "dirty",
    "invalid",
    "updateInvalid",
    "emptyValueNull",
    "emptyValueUndefined",
    "getAttr",
    "addAttr",
    "removeAttr",
    "focus",
    "blur",
    "getElement"
  ]);
  forwardEventsBuilder(get_current_component());
  let uninitializedValue = () => {
  };
  function isUninitializedValue(value2) {
    return value2 === uninitializedValue;
  }
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { type = "text" } = $$props;
  let { placeholder = " " } = $$props;
  let { value = uninitializedValue } = $$props;
  const valueUninitialized = isUninitializedValue(value);
  if (valueUninitialized) {
    value = "";
  }
  let { files = null } = $$props;
  let { dirty = false } = $$props;
  let { invalid = false } = $$props;
  let { updateInvalid = true } = $$props;
  let { emptyValueNull = value === null } = $$props;
  if (valueUninitialized && emptyValueNull) {
    value = null;
  }
  let { emptyValueUndefined = value === void 0 } = $$props;
  if (valueUninitialized && emptyValueUndefined) {
    value = void 0;
  }
  let element;
  let internalAttrs = {};
  let valueProp = {};
  function getAttr(name) {
    var _a;
    return name in internalAttrs ? (_a = internalAttrs[name]) !== null && _a !== void 0 ? _a : null : getElement().getAttribute(name);
  }
  function addAttr(name, value2) {
    if (internalAttrs[name] !== value2) {
      internalAttrs[name] = value2;
    }
  }
  function removeAttr(name) {
    if (!(name in internalAttrs) || internalAttrs[name] != null) {
      internalAttrs[name] = void 0;
    }
  }
  function focus() {
    getElement().focus();
  }
  function blur() {
    getElement().blur();
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.files === void 0 && $$bindings.files && files !== void 0)
    $$bindings.files(files);
  if ($$props.dirty === void 0 && $$bindings.dirty && dirty !== void 0)
    $$bindings.dirty(dirty);
  if ($$props.invalid === void 0 && $$bindings.invalid && invalid !== void 0)
    $$bindings.invalid(invalid);
  if ($$props.updateInvalid === void 0 && $$bindings.updateInvalid && updateInvalid !== void 0)
    $$bindings.updateInvalid(updateInvalid);
  if ($$props.emptyValueNull === void 0 && $$bindings.emptyValueNull && emptyValueNull !== void 0)
    $$bindings.emptyValueNull(emptyValueNull);
  if ($$props.emptyValueUndefined === void 0 && $$bindings.emptyValueUndefined && emptyValueUndefined !== void 0)
    $$bindings.emptyValueUndefined(emptyValueUndefined);
  if ($$props.getAttr === void 0 && $$bindings.getAttr && getAttr !== void 0)
    $$bindings.getAttr(getAttr);
  if ($$props.addAttr === void 0 && $$bindings.addAttr && addAttr !== void 0)
    $$bindings.addAttr(addAttr);
  if ($$props.removeAttr === void 0 && $$bindings.removeAttr && removeAttr !== void 0)
    $$bindings.removeAttr(removeAttr);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.blur === void 0 && $$bindings.blur && blur !== void 0)
    $$bindings.blur(blur);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  {
    if (type === "file") {
      delete valueProp.value;
      valueProp = valueProp;
    } else {
      valueProp.value = value == null ? "" : value;
    }
  }
  return `<input${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-text-field__input": true
        }))
      },
      { type: escape_attribute_value(type) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      escape_object(valueProp),
      escape_object(internalAttrs),
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>`;
});
const Textarea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "value",
    "dirty",
    "invalid",
    "updateInvalid",
    "resizable",
    "getAttr",
    "addAttr",
    "removeAttr",
    "focus",
    "blur",
    "getElement"
  ]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { value = "" } = $$props;
  let { dirty = false } = $$props;
  let { invalid = false } = $$props;
  let { updateInvalid = true } = $$props;
  let { resizable = true } = $$props;
  let element;
  let internalAttrs = {};
  function getAttr(name) {
    var _a;
    return name in internalAttrs ? (_a = internalAttrs[name]) !== null && _a !== void 0 ? _a : null : getElement().getAttribute(name);
  }
  function addAttr(name, value2) {
    if (internalAttrs[name] !== value2) {
      internalAttrs[name] = value2;
    }
  }
  function removeAttr(name) {
    if (!(name in internalAttrs) || internalAttrs[name] != null) {
      internalAttrs[name] = void 0;
    }
  }
  function focus() {
    getElement().focus();
  }
  function blur() {
    getElement().blur();
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.dirty === void 0 && $$bindings.dirty && dirty !== void 0)
    $$bindings.dirty(dirty);
  if ($$props.invalid === void 0 && $$bindings.invalid && invalid !== void 0)
    $$bindings.invalid(invalid);
  if ($$props.updateInvalid === void 0 && $$bindings.updateInvalid && updateInvalid !== void 0)
    $$bindings.updateInvalid(updateInvalid);
  if ($$props.resizable === void 0 && $$bindings.resizable && resizable !== void 0)
    $$bindings.resizable(resizable);
  if ($$props.getAttr === void 0 && $$bindings.getAttr && getAttr !== void 0)
    $$bindings.getAttr(getAttr);
  if ($$props.addAttr === void 0 && $$bindings.addAttr && addAttr !== void 0)
    $$bindings.addAttr(addAttr);
  if ($$props.removeAttr === void 0 && $$bindings.removeAttr && removeAttr !== void 0)
    $$bindings.removeAttr(removeAttr);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.blur === void 0 && $$bindings.blur && blur !== void 0)
    $$bindings.blur(blur);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<textarea${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-text-field__input": true
        }))
      },
      {
        style: escape_attribute_value(`${resizable ? "" : "resize: none; "}${style}`)
      },
      escape_object(internalAttrs),
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${escape(value || "")}</textarea>`;
});
const { Object: Object_1 } = globals;
const Textfield = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "ripple",
    "disabled",
    "required",
    "textarea",
    "variant",
    "noLabel",
    "label",
    "type",
    "value",
    "files",
    "invalid",
    "updateInvalid",
    "dirty",
    "prefix",
    "suffix",
    "validateOnValueChange",
    "useNativeValidation",
    "withLeadingIcon",
    "withTrailingIcon",
    "input",
    "floatingLabel",
    "lineRipple",
    "notchedOutline",
    "focus",
    "blur",
    "layout",
    "getElement"
  ]);
  let $$slots = compute_slots(slots);
  forwardEventsBuilder(get_current_component());
  let uninitializedValue = () => {
  };
  function isUninitializedValue(value2) {
    return value2 === uninitializedValue;
  }
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { ripple = true } = $$props;
  let { disabled = false } = $$props;
  let { required = false } = $$props;
  let { textarea = false } = $$props;
  let { variant = textarea ? "outlined" : "standard" } = $$props;
  let { noLabel = false } = $$props;
  let { label = void 0 } = $$props;
  let { type = "text" } = $$props;
  let { value = $$restProps.input$emptyValueUndefined ? void 0 : uninitializedValue } = $$props;
  let { files = uninitializedValue } = $$props;
  const valued = !isUninitializedValue(value) || !isUninitializedValue(files);
  if (isUninitializedValue(value)) {
    value = void 0;
  }
  if (isUninitializedValue(files)) {
    files = null;
  }
  let { invalid = uninitializedValue } = $$props;
  let { updateInvalid = isUninitializedValue(invalid) } = $$props;
  if (isUninitializedValue(invalid)) {
    invalid = false;
  }
  let { dirty = false } = $$props;
  let { prefix = void 0 } = $$props;
  let { suffix = void 0 } = $$props;
  let { validateOnValueChange = updateInvalid } = $$props;
  let { useNativeValidation = updateInvalid } = $$props;
  let { withLeadingIcon = uninitializedValue } = $$props;
  let { withTrailingIcon = uninitializedValue } = $$props;
  let { input = void 0 } = $$props;
  let { floatingLabel = void 0 } = $$props;
  let { lineRipple = void 0 } = $$props;
  let { notchedOutline = void 0 } = $$props;
  let element;
  let internalClasses = {};
  let internalStyles = {};
  let helperId = void 0;
  let addLayoutListener = getContext("SMUI:addLayoutListener");
  let removeLayoutListener;
  new Promise((resolve) => resolve);
  if (addLayoutListener) {
    removeLayoutListener = addLayoutListener(layout);
  }
  onDestroy(() => {
    if (removeLayoutListener) {
      removeLayoutListener();
    }
  });
  function focus() {
    input === null || input === void 0 ? void 0 : input.focus();
  }
  function blur() {
    input === null || input === void 0 ? void 0 : input.blur();
  }
  function layout() {
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.ripple === void 0 && $$bindings.ripple && ripple !== void 0)
    $$bindings.ripple(ripple);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.textarea === void 0 && $$bindings.textarea && textarea !== void 0)
    $$bindings.textarea(textarea);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.noLabel === void 0 && $$bindings.noLabel && noLabel !== void 0)
    $$bindings.noLabel(noLabel);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.files === void 0 && $$bindings.files && files !== void 0)
    $$bindings.files(files);
  if ($$props.invalid === void 0 && $$bindings.invalid && invalid !== void 0)
    $$bindings.invalid(invalid);
  if ($$props.updateInvalid === void 0 && $$bindings.updateInvalid && updateInvalid !== void 0)
    $$bindings.updateInvalid(updateInvalid);
  if ($$props.dirty === void 0 && $$bindings.dirty && dirty !== void 0)
    $$bindings.dirty(dirty);
  if ($$props.prefix === void 0 && $$bindings.prefix && prefix !== void 0)
    $$bindings.prefix(prefix);
  if ($$props.suffix === void 0 && $$bindings.suffix && suffix !== void 0)
    $$bindings.suffix(suffix);
  if ($$props.validateOnValueChange === void 0 && $$bindings.validateOnValueChange && validateOnValueChange !== void 0)
    $$bindings.validateOnValueChange(validateOnValueChange);
  if ($$props.useNativeValidation === void 0 && $$bindings.useNativeValidation && useNativeValidation !== void 0)
    $$bindings.useNativeValidation(useNativeValidation);
  if ($$props.withLeadingIcon === void 0 && $$bindings.withLeadingIcon && withLeadingIcon !== void 0)
    $$bindings.withLeadingIcon(withLeadingIcon);
  if ($$props.withTrailingIcon === void 0 && $$bindings.withTrailingIcon && withTrailingIcon !== void 0)
    $$bindings.withTrailingIcon(withTrailingIcon);
  if ($$props.input === void 0 && $$bindings.input && input !== void 0)
    $$bindings.input(input);
  if ($$props.floatingLabel === void 0 && $$bindings.floatingLabel && floatingLabel !== void 0)
    $$bindings.floatingLabel(floatingLabel);
  if ($$props.lineRipple === void 0 && $$bindings.lineRipple && lineRipple !== void 0)
    $$bindings.lineRipple(lineRipple);
  if ($$props.notchedOutline === void 0 && $$bindings.notchedOutline && notchedOutline !== void 0)
    $$bindings.notchedOutline(notchedOutline);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.blur === void 0 && $$bindings.blur && blur !== void 0)
    $$bindings.blur(blur);
  if ($$props.layout === void 0 && $$bindings.layout && layout !== void 0)
    $$bindings.layout(layout);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    input && input.getElement();
    $$rendered = `${valued ? `<label${spread(
      [
        {
          class: escape_attribute_value(classMap({
            [className]: true,
            "mdc-text-field": true,
            "mdc-text-field--disabled": disabled,
            "mdc-text-field--textarea": textarea,
            "mdc-text-field--filled": variant === "filled",
            "mdc-text-field--outlined": variant === "outlined",
            "smui-text-field--standard": variant === "standard" && !textarea,
            "mdc-text-field--no-label": noLabel || label == null && !$$slots.label,
            "mdc-text-field--label-floating": value != null && value !== "",
            "mdc-text-field--with-leading-icon": isUninitializedValue(withLeadingIcon) ? $$slots.leadingIcon : withLeadingIcon,
            "mdc-text-field--with-trailing-icon": isUninitializedValue(withTrailingIcon) ? $$slots.trailingIcon : withTrailingIcon,
            "mdc-text-field--with-internal-counter": textarea && $$slots.internalCounter,
            "mdc-text-field--invalid": invalid,
            ...internalClasses
          }))
        },
        {
          style: escape_attribute_value(Object.entries(internalStyles).map(([name, value2]) => `${name}: ${value2};`).concat([style]).join(" "))
        },
        {
          for: escape_attribute_value(
            /* suppress a11y warning, since this is wrapped */
            void 0
          )
        },
        escape_object(exclude($$restProps, ["input$", "label$", "ripple$", "outline$", "helperLine$"]))
      ],
      {}
    )}${add_attribute("this", element, 0)}>${!textarea && variant !== "outlined" ? `${variant === "filled" ? `<span class="mdc-text-field__ripple"></span>` : ``} ${!noLabel && (label != null || $$slots.label) ? `${validate_component(FloatingLabel, "FloatingLabel").$$render(
      $$result,
      Object_1.assign(
        {},
        {
          floatAbove: value != null && value !== "" && (typeof value !== "number" || !isNaN(value))
        },
        { required },
        { wrapped: true },
        prefixFilter($$restProps, "label$"),
        { this: floatingLabel }
      ),
      {
        this: ($$value) => {
          floatingLabel = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${escape(label == null ? "" : label)}${slots.label ? slots.label({}) : ``}`;
        }
      }
    )}` : ``}` : ``} ${textarea || variant === "outlined" ? `${validate_component(NotchedOutline, "NotchedOutline").$$render(
      $$result,
      Object_1.assign(
        {},
        {
          noLabel: noLabel || label == null && !$$slots.label
        },
        prefixFilter($$restProps, "outline$"),
        { this: notchedOutline }
      ),
      {
        this: ($$value) => {
          notchedOutline = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${!noLabel && (label != null || $$slots.label) ? `${validate_component(FloatingLabel, "FloatingLabel").$$render(
            $$result,
            Object_1.assign(
              {},
              {
                floatAbove: value != null && value !== "" && (typeof value !== "number" || !isNaN(value))
              },
              { required },
              { wrapped: true },
              prefixFilter($$restProps, "label$"),
              { this: floatingLabel }
            ),
            {
              this: ($$value) => {
                floatingLabel = $$value;
                $$settled = false;
              }
            },
            {
              default: () => {
                return `${escape(label == null ? "" : label)}${slots.label ? slots.label({}) : ``}`;
              }
            }
          )}` : ``}`;
        }
      }
    )}` : ``} ${validate_component(ContextFragment, "ContextFragment").$$render(
      $$result,
      {
        key: "SMUI:textfield:icon:leading",
        value: true
      },
      {},
      {
        default: () => {
          return `${slots.leadingIcon ? slots.leadingIcon({}) : ``}`;
        }
      }
    )} ${slots.default ? slots.default({}) : ``} ${textarea && typeof value === "string" ? `<span${add_attribute(
      "class",
      classMap({
        "mdc-text-field__resizer": !("input$resizable" in $$restProps) || $$restProps.input$resizable
      }),
      0
    )}>${validate_component(Textarea, "Textarea").$$render(
      $$result,
      Object_1.assign({}, { disabled }, { required }, { updateInvalid }, { "aria-controls": helperId }, { "aria-describedby": helperId }, prefixFilter($$restProps, "input$"), { this: input }, { value }, { dirty }, { invalid }),
      {
        this: ($$value) => {
          input = $$value;
          $$settled = false;
        },
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        },
        dirty: ($$value) => {
          dirty = $$value;
          $$settled = false;
        },
        invalid: ($$value) => {
          invalid = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${slots.internalCounter ? slots.internalCounter({}) : ``}</span>` : `${slots.prefix ? slots.prefix({}) : ``} ${prefix != null ? `${validate_component(Prefix, "Prefix").$$render($$result, {}, {}, {
      default: () => {
        return `${escape(prefix)}`;
      }
    })}` : ``} ${validate_component(Input, "Input").$$render(
      $$result,
      Object_1.assign({}, { type }, { disabled }, { required }, { updateInvalid }, { "aria-controls": helperId }, { "aria-describedby": helperId }, noLabel && label != null ? { placeholder: label } : {}, prefixFilter($$restProps, "input$"), { this: input }, { value }, { files }, { dirty }, { invalid }),
      {
        this: ($$value) => {
          input = $$value;
          $$settled = false;
        },
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        },
        files: ($$value) => {
          files = $$value;
          $$settled = false;
        },
        dirty: ($$value) => {
          dirty = $$value;
          $$settled = false;
        },
        invalid: ($$value) => {
          invalid = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${suffix != null ? `${validate_component(Suffix, "Suffix").$$render($$result, {}, {}, {
      default: () => {
        return `${escape(suffix)}`;
      }
    })}` : ``} ${slots.suffix ? slots.suffix({}) : ``}`} ${validate_component(ContextFragment, "ContextFragment").$$render(
      $$result,
      {
        key: "SMUI:textfield:icon:leading",
        value: false
      },
      {},
      {
        default: () => {
          return `${slots.trailingIcon ? slots.trailingIcon({}) : ``}`;
        }
      }
    )} ${!textarea && variant !== "outlined" && ripple ? `${validate_component(LineRipple, "LineRipple").$$render(
      $$result,
      Object_1.assign({}, prefixFilter($$restProps, "ripple$"), { this: lineRipple }),
      {
        this: ($$value) => {
          lineRipple = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : ``}</label>` : `<div${spread(
      [
        {
          class: escape_attribute_value(classMap({
            [className]: true,
            "mdc-text-field": true,
            "mdc-text-field--disabled": disabled,
            "mdc-text-field--textarea": textarea,
            "mdc-text-field--filled": variant === "filled",
            "mdc-text-field--outlined": variant === "outlined",
            "smui-text-field--standard": variant === "standard" && !textarea,
            "mdc-text-field--no-label": noLabel || !$$slots.label,
            "mdc-text-field--with-leading-icon": $$slots.leadingIcon,
            "mdc-text-field--with-trailing-icon": $$slots.trailingIcon,
            "mdc-text-field--invalid": invalid,
            ...internalClasses
          }))
        },
        {
          style: escape_attribute_value(Object.entries(internalStyles).map(([name, value2]) => `${name}: ${value2};`).concat([style]).join(" "))
        },
        escape_object(exclude($$restProps, ["input$", "label$", "ripple$", "outline$", "helperLine$"]))
      ],
      {}
    )}${add_attribute("this", element, 0)}>${slots.label ? slots.label({}) : ``} ${validate_component(ContextFragment, "ContextFragment").$$render(
      $$result,
      {
        key: "SMUI:textfield:icon:leading",
        value: true
      },
      {},
      {
        default: () => {
          return `${slots.leadingIcon ? slots.leadingIcon({}) : ``}`;
        }
      }
    )} ${slots.default ? slots.default({}) : ``} ${validate_component(ContextFragment, "ContextFragment").$$render(
      $$result,
      {
        key: "SMUI:textfield:icon:leading",
        value: false
      },
      {},
      {
        default: () => {
          return `${slots.trailingIcon ? slots.trailingIcon({}) : ``}`;
        }
      }
    )} ${slots.ripple ? slots.ripple({}) : ``}</div>`} ${$$slots.helper ? `${validate_component(HelperLine, "HelperLine").$$render($$result, Object_1.assign({}, prefixFilter($$restProps, "helperLine$")), {}, {
      default: () => {
        return `${slots.helper ? slots.helper({}) : ``}`;
      }
    })}` : ``}`;
  } while (!$$settled);
  return $$rendered;
});
const css$1 = {
  code: ".input.svelte-15opjqo{display:flex;justify-content:space-evenly;align-items:center}.svelte-15opjqo .sub{margin:1em}.svelte-15opjqo .label{color:aliceblue}",
  map: `{"version":3,"file":"form_input.svelte","sources":["form_input.svelte"],"sourcesContent":["<script lang=\\"ts\\">\\n    export let answer = '';\\n    export let label = '';\\n    export let status = false;\\n    export let election_store;\\n    export let win_info;\\n    export let loading = false;\\n    import Textfield from '@smui/textfield';\\n    import Button from '@smui/button';\\n    import Label from '@smui/button';\\n    const handleSubmit = async () => {\\n      // Logic to handle form submission\\n      console.log(\`Answer: \${answer}\`);\\n      loading = true\\n      status = true;\\n      const response = await fetch(\`http://127.0.0.1:5000/postcode/\${answer}\`);\\n      const data = await response.json();\\n      election_store.set(collateData(data));\\n      loading = false\\n      \\n    };\\n    const collateData = (data) => {\\n      let most_votes = 0;\\n      let most_votes_party = \\"\\";\\n      let total_votes = 0;\\n      let cand_list = [];\\n      for (const [key, value] of Object.entries(data[\\"candidate\\"])) {\\n        cand_list.push([key,value])\\n      }\\n      console.log(cand_list)\\n      cand_list.forEach((cand, index)=>{\\n\\n\\n        let party = data[\\"party_name\\"][cand[0]]\\n        let votes = data[\\"votes\\"][cand[0]]\\n        let percent = data[\\"vote_share_percent\\"][cand[0]]\\n        total_votes += votes;\\n        if (votes > most_votes){\\n          most_votes = votes\\n          most_votes_party = party\\n        }\\n        \\n\\n        cand_list[index].push(party)\\n        cand_list[index].push(votes)\\n        cand_list[index].push(percent)\\n      });\\n     \\n      win_info.win_party = most_votes_party; \\n      win_info.win_votes = total_votes - most_votes; \\n      return cand_list\\n    };\\n  <\/script>\\n<div class=\\"input\\">\\n\\n    <Textfield variant=\\"outlined\\" bind:value={answer} label={label} class=\\"sub\\" disabled={status}>\\n    </Textfield>\\n \\n\\n    <Button on:click={() => handleSubmit()} variant=\\"raised\\" class=\\"sub button\\" disabled={status}>\\n      <Label class=\\"label\\">Submit</Label>\\n    </Button>\\n\\n  </div>\\n\\n<style>\\n  .input{\\n    display: flex;\\n    justify-content: space-evenly;\\n    align-items: center;\\n  }\\n  * :global(.sub){\\n    margin: 1em;\\n  }\\n  * :global(.label){\\n    color: aliceblue;\\n  }\\n\\n</style>\\n    \\n \\n"],"names":[],"mappings":"AAkEE,qBAAM,CACJ,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,YAAY,CAC7B,WAAW,CAAE,MACf,CACA,eAAC,CAAS,IAAK,CACb,MAAM,CAAE,GACV,CACA,eAAC,CAAS,MAAO,CACf,KAAK,CAAE,SACT"}`
};
const Form_input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { answer = "" } = $$props;
  let { label = "" } = $$props;
  let { status = false } = $$props;
  let { election_store } = $$props;
  let { win_info } = $$props;
  let { loading = false } = $$props;
  if ($$props.answer === void 0 && $$bindings.answer && answer !== void 0)
    $$bindings.answer(answer);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.election_store === void 0 && $$bindings.election_store && election_store !== void 0)
    $$bindings.election_store(election_store);
  if ($$props.win_info === void 0 && $$bindings.win_info && win_info !== void 0)
    $$bindings.win_info(win_info);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="input svelte-15opjqo">${validate_component(Textfield, "Textfield").$$render(
      $$result,
      {
        variant: "outlined",
        label,
        class: "sub",
        disabled: status,
        value: answer
      },
      {
        value: ($$value) => {
          answer = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Button, "Button").$$render(
      $$result,
      {
        variant: "raised",
        class: "sub button",
        disabled: status
      },
      {},
      {
        default: () => {
          return `${validate_component(Button, "Label").$$render($$result, { class: "label" }, {}, {
            default: () => {
              return `Submit`;
            }
          })}`;
        }
      }
    )} </div>`;
  } while (!$$settled);
  return $$rendered;
});
const DataTable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "stickyHeader",
    "sortable",
    "sort",
    "sortDirection",
    "sortAscendingAriaLabel",
    "sortDescendingAriaLabel",
    "container$use",
    "container$class",
    "table$use",
    "table$class",
    "layout",
    "getElement"
  ]);
  let $$slots = compute_slots(slots);
  let $progressClosed, $$unsubscribe_progressClosed;
  let $sortDirectionStore, $$unsubscribe_sortDirectionStore;
  let $sortStore, $$unsubscribe_sortStore;
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { stickyHeader = false } = $$props;
  let { sortable = false } = $$props;
  let { sort = null } = $$props;
  let { sortDirection = "ascending" } = $$props;
  let { sortAscendingAriaLabel = "sorted, ascending" } = $$props;
  let { sortDescendingAriaLabel = "sorted, descending" } = $$props;
  let { container$use = [] } = $$props;
  let { container$class = "" } = $$props;
  let { table$use = [] } = $$props;
  let { table$class = "" } = $$props;
  let element;
  let instance;
  let container;
  let internalClasses = {};
  let progressIndicatorStyles = { height: "auto", top: "initial" };
  let addLayoutListener = getContext("SMUI:addLayoutListener");
  let removeLayoutListener;
  let progressClosed = writable(false);
  $$unsubscribe_progressClosed = subscribe(progressClosed, (value) => $progressClosed = value);
  let sortStore = writable(sort);
  $$unsubscribe_sortStore = subscribe(sortStore, (value) => $sortStore = value);
  let sortDirectionStore = writable(sortDirection);
  $$unsubscribe_sortDirectionStore = subscribe(sortDirectionStore, (value) => $sortDirectionStore = value);
  setContext("SMUI:checkbox:context", "data-table");
  setContext("SMUI:linear-progress:context", "data-table");
  setContext("SMUI:linear-progress:closed", progressClosed);
  setContext("SMUI:data-table:sortable", sortable);
  setContext("SMUI:data-table:sort", sortStore);
  setContext("SMUI:data-table:sortDirection", sortDirectionStore);
  setContext("SMUI:data-table:sortAscendingAriaLabel", sortAscendingAriaLabel);
  setContext("SMUI:data-table:sortDescendingAriaLabel", sortDescendingAriaLabel);
  if (addLayoutListener) {
    removeLayoutListener = addLayoutListener(layout);
  }
  let previousProgressClosed = void 0;
  onDestroy(() => {
    if (removeLayoutListener) {
      removeLayoutListener();
    }
  });
  function layout() {
    return instance.layout();
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.stickyHeader === void 0 && $$bindings.stickyHeader && stickyHeader !== void 0)
    $$bindings.stickyHeader(stickyHeader);
  if ($$props.sortable === void 0 && $$bindings.sortable && sortable !== void 0)
    $$bindings.sortable(sortable);
  if ($$props.sort === void 0 && $$bindings.sort && sort !== void 0)
    $$bindings.sort(sort);
  if ($$props.sortDirection === void 0 && $$bindings.sortDirection && sortDirection !== void 0)
    $$bindings.sortDirection(sortDirection);
  if ($$props.sortAscendingAriaLabel === void 0 && $$bindings.sortAscendingAriaLabel && sortAscendingAriaLabel !== void 0)
    $$bindings.sortAscendingAriaLabel(sortAscendingAriaLabel);
  if ($$props.sortDescendingAriaLabel === void 0 && $$bindings.sortDescendingAriaLabel && sortDescendingAriaLabel !== void 0)
    $$bindings.sortDescendingAriaLabel(sortDescendingAriaLabel);
  if ($$props.container$use === void 0 && $$bindings.container$use && container$use !== void 0)
    $$bindings.container$use(container$use);
  if ($$props.container$class === void 0 && $$bindings.container$class && container$class !== void 0)
    $$bindings.container$class(container$class);
  if ($$props.table$use === void 0 && $$bindings.table$use && table$use !== void 0)
    $$bindings.table$use(table$use);
  if ($$props.table$class === void 0 && $$bindings.table$class && table$class !== void 0)
    $$bindings.table$class(table$class);
  if ($$props.layout === void 0 && $$bindings.layout && layout !== void 0)
    $$bindings.layout(layout);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  set_store_value(sortStore, $sortStore = sort, $sortStore);
  set_store_value(sortDirectionStore, $sortDirectionStore = sortDirection, $sortDirectionStore);
  {
    if ($$slots.progress && instance && previousProgressClosed !== $progressClosed) {
      previousProgressClosed = $progressClosed;
      if ($progressClosed) {
        instance.hideProgress();
      } else {
        instance.showProgress();
      }
    }
  }
  $$unsubscribe_progressClosed();
  $$unsubscribe_sortDirectionStore();
  $$unsubscribe_sortStore();
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-data-table": true,
          "mdc-data-table--sticky-header": stickyHeader,
          ...internalClasses
        }))
      },
      escape_object(exclude($$restProps, ["container$", "table$"]))
    ],
    {}
  )}${add_attribute("this", element, 0)}><div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [container$class]: true,
          "mdc-data-table__table-container": true
        }))
      },
      escape_object(prefixFilter($$restProps, "container$"))
    ],
    {}
  )}${add_attribute("this", container, 0)}><table${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [table$class]: true,
          "mdc-data-table__table": true
        }))
      },
      escape_object(prefixFilter($$restProps, "table$"))
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</table></div> ${$$slots.progress ? `<div class="mdc-data-table__progress-indicator"${add_attribute("style", Object.entries(progressIndicatorStyles).map(([name, value]) => `${name}: ${value};`).join(" "), 0)}><div class="mdc-data-table__scrim"></div> ${slots.progress ? slots.progress({}) : ``}</div>` : ``} ${slots.paginate ? slots.paginate({}) : ``} </div>`;
});
const Head = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let element;
  setContext("SMUI:data-table:row:header", true);
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<thead${spread([escape_object($$restProps)], {})}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}</thead>`;
});
const Body = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let element;
  setContext("SMUI:data-table:row:header", false);
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<tbody${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-data-table__content": true
        }))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}</tbody>`;
});
let counter$1 = 0;
const Row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "rowId", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { rowId = "SMUI-data-table-row-" + counter$1++ } = $$props;
  let element;
  let checkbox = void 0;
  let internalClasses = {};
  let internalAttrs = {};
  let header = getContext("SMUI:data-table:row:header");
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.rowId === void 0 && $$bindings.rowId && rowId !== void 0)
    $$bindings.rowId(rowId);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<tr${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-data-table__header-row": header,
          "mdc-data-table__row": !header,
          "mdc-data-table__row--selected": !header && checkbox && checkbox.checked,
          ...internalClasses
        }))
      },
      {
        "aria-selected": escape_attribute_value(void 0)
      },
      escape_object(internalAttrs),
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}</tr>`;
});
let counter = 0;
const Cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "numeric", "checkbox", "columnId", "sortable", "getElement"]);
  let $sort, $$unsubscribe_sort;
  let $sortDirection, $$unsubscribe_sortDirection;
  forwardEventsBuilder(get_current_component());
  let header = getContext("SMUI:data-table:row:header");
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { numeric = false } = $$props;
  let { checkbox = false } = $$props;
  let { columnId = header ? "SMUI-data-table-column-" + counter++ : "SMUI-data-table-unused" } = $$props;
  let { sortable = getContext("SMUI:data-table:sortable") } = $$props;
  let element;
  let internalClasses = {};
  let internalAttrs = {};
  let sort = getContext("SMUI:data-table:sort");
  $$unsubscribe_sort = subscribe(sort, (value) => $sort = value);
  let sortDirection = getContext("SMUI:data-table:sortDirection");
  $$unsubscribe_sortDirection = subscribe(sortDirection, (value) => $sortDirection = value);
  let sortAscendingAriaLabel = getContext("SMUI:data-table:sortAscendingAriaLabel");
  let sortDescendingAriaLabel = getContext("SMUI:data-table:sortDescendingAriaLabel");
  if (sortable) {
    setContext("SMUI:label:context", "data-table:sortable-header-cell");
    setContext("SMUI:icon-button:context", "data-table:sortable-header-cell");
    setContext("SMUI:icon-button:aria-describedby", columnId + "-status-label");
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.numeric === void 0 && $$bindings.numeric && numeric !== void 0)
    $$bindings.numeric(numeric);
  if ($$props.checkbox === void 0 && $$bindings.checkbox && checkbox !== void 0)
    $$bindings.checkbox(checkbox);
  if ($$props.columnId === void 0 && $$bindings.columnId && columnId !== void 0)
    $$bindings.columnId(columnId);
  if ($$props.sortable === void 0 && $$bindings.sortable && sortable !== void 0)
    $$bindings.sortable(sortable);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  $$unsubscribe_sort();
  $$unsubscribe_sortDirection();
  return `${header ? `<th${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-data-table__header-cell": true,
          "mdc-data-table__header-cell--numeric": numeric,
          "mdc-data-table__header-cell--checkbox": checkbox,
          "mdc-data-table__header-cell--with-sort": sortable,
          "mdc-data-table__header-cell--sorted": sortable && $sort === columnId,
          ...internalClasses
        }))
      },
      { role: "columnheader" },
      { scope: "col" },
      {
        "data-column-id": escape_attribute_value(columnId)
      },
      {
        "aria-sort": escape_attribute_value(sortable ? $sort === columnId ? $sortDirection : "none" : void 0)
      },
      escape_object(internalAttrs),
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${sortable ? ` <div class="mdc-data-table__header-cell-wrapper">${slots.default ? slots.default({}) : ``} <div class="mdc-data-table__sort-status-label" aria-hidden="true" id="${escape(columnId, true) + "-status-label"}">${escape($sort === columnId ? $sortDirection === "ascending" ? sortAscendingAriaLabel : sortDescendingAriaLabel : "")}</div></div> ` : `${slots.default ? slots.default({}) : ``}`}</th>` : `<td${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-data-table__cell": true,
          "mdc-data-table__cell--numeric": numeric,
          "mdc-data-table__cell--checkbox": checkbox,
          ...internalClasses
        }))
      },
      escape_object(internalAttrs),
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}</td>`}`;
});
const Result = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { election_data } = $$props;
  let { win_info } = $$props;
  const partyColors = {
    "Labour": "rgb(146, 31, 39)",
    // Red
    "Conservative": "rgb(0, 135, 220)",
    // Blue
    "Liberal Democrat": "rgb(253, 187, 48)",
    // Yellow
    "Green Party": "rgb(0, 116, 95)",
    // Green
    "Scottish National Party": "rgb(255, 249, 93)",
    // Yellow
    "Democratic Unionist Party": "rgb(211, 48, 47)",
    // Red
    "Sinn Féin": "rgb(0, 158, 115)",
    // Green
    "Plaid Cymru": "rgb(63, 132, 197)",
    // Blue
    "UKIP": "rgb(0, 50, 120)",
    // Dark Blue
    "The Brexit Party": "rgb(0, 38, 84)",
    // Dark Blue
    "Social Democratic & Labour Party": "rgb(233, 116, 81)",
    // Light Red
    "Ulster Unionist Party": "rgb(51, 102, 153)",
    // Blue
    "Alliance Party": "rgb(255, 198, 47)",
    // Yellow
    "English Democrats": "rgb(207, 20, 43)",
    // Red
    "Monster Raving Loony Party": "rgb(255, 165, 0)",
    // Orange
    "Liberal Party": "rgb(253, 218, 36)",
    // Yellow
    "Socialist Party of Great Britain": "rgb(255, 0, 0)",
    // Red
    "National Health Action Party": "rgb(185, 17, 55)",
    // Dark Red
    "Women's Equality Party": "rgb(232, 5, 89)",
    // Pink
    "Renew": "rgb(101, 203, 207)"
    // Cyan
  };
  if ($$props.election_data === void 0 && $$bindings.election_data && election_data !== void 0)
    $$bindings.election_data(election_data);
  if ($$props.win_info === void 0 && $$bindings.win_info && win_info !== void 0)
    $$bindings.win_info(win_info);
  return `<div><h3>The ${escape(win_info.win_party)} party holds this seat by ${escape(win_info.win_votes)} votes.</h3> ${validate_component(DataTable, "DataTable").$$render(
    $$result,
    {
      "table$aria-label": "People list",
      style: "max-width: 100%;"
    },
    {},
    {
      default: () => {
        return `${validate_component(Head, "Head").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Row, "Row").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Cell, "Cell").$$render($$result, {}, {}, {
                  default: () => {
                    return `Name`;
                  }
                })} ${validate_component(Cell, "Cell").$$render($$result, {}, {}, {
                  default: () => {
                    return `Party`;
                  }
                })} ${validate_component(Cell, "Cell").$$render($$result, { numeric: true }, {}, {
                  default: () => {
                    return `Votes`;
                  }
                })} ${validate_component(Cell, "Cell").$$render($$result, {}, {}, {
                  default: () => {
                    return `Vote Share`;
                  }
                })}`;
              }
            })}`;
          }
        })} ${validate_component(Body, "Body").$$render($$result, {}, {}, {
          default: () => {
            return `${each(election_data, (cand, i) => {
              return `${validate_component(Row, "Row").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Cell, "Cell").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(cand[1])}`;
                    }
                  })} ${validate_component(Cell, "Cell").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(cand[2])}`;
                    }
                  })} ${validate_component(Cell, "Cell").$$render($$result, { numeric: true }, {}, {
                    default: () => {
                      return `${escape(cand[3])}`;
                    }
                  })} ${validate_component(Cell, "Cell").$$render($$result, {}, {}, {
                    default: () => {
                      return `<div style="display:flex; align-items: center; position: relative; width: 15em; height: 2em;"><div style="${"width: " + escape(cand[4], true) + "%; height: 50%; background-color:" + escape(partyColors[cand[2]], true) + ";"}"></div>  </div>`;
                    }
                  })} ${validate_component(Cell, "Cell").$$render($$result, {}, {}, {})} ${validate_component(Cell, "Cell").$$render($$result, {}, {}, {
                    default: () => {
                      return `<div style="width: 50%; color:aqua"></div>`;
                    }
                  })} `;
                }
              })}`;
            })}`;
          }
        })}`;
      }
    }
  )} </div>`;
});
const css = {
  code: ".hbox.svelte-nebih9{display:flex;justify-content:space-evenly}.vbox.svelte-nebih9{display:flex;justify-content:space-between;flex-direction:column;align-content:center;height:40%}.svelte-nebih9 .card-display{margin:1em;border:2px dotted grey;border-radius:5px}.svelte-nebih9 .b{margin:0 auto}@media(max-width: 1300px){.hbox.svelte-nebih9{flex-direction:column}}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">\\n    import CircularProgress from '@smui/circular-progress';\\n     import Button from '@smui/button';\\n     import Label from '@smui/button';\\n     import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';\\n    import { writable } from 'svelte/store';\\n    import FormInput from './form_input.svelte';\\n    import Result from './result.svelte';\\n \\n    let home_postcode = '';\\n    let uni_postcode = '';\\n    let uni_submitted = false;\\n    let loading_home = false\\n    let loading_uni = false\\n    let uni_win_info = {\\n    win_party : \\"\\" ,\\n    win_votes : 0 ,        \\n   \\n        }\\n    let home_win_info = {\\n        win_party : \\"\\" ,\\n        win_votes : 0 ,        \\n   \\n        }\\n    \\n    let home_submitted = false;\\n    const election_data_uni = writable([]);\\n    const election_data_home = writable([]);\\n    const startOver = () => {\\n        uni_submitted = false\\n        home_submitted = false\\n        uni_win_info = {\\n            win_party : \\"\\" ,\\n            win_votes : 0 ,        \\n        }\\n        home_win_info = {\\n            win_party : \\"\\" ,\\n            win_votes : 0 ,        \\n        }\\n        home_postcode = \\"\\"\\n        uni_postcode = \\"\\"\\n    }\\n\\n    \\n    \\n\\n<\/script>\\n<TopAppBar variant=\\"static\\">\\n    <Row>\\n      <Section>\\n        <Title>Where to Vote!</Title>\\n      </Section>\\n    </Row>\\n  </TopAppBar>\\n<div class=\\"vbox\\">\\n    <div class=\\"card-display\\">\\n        <div class=\\"card-container\\">\\n            <FormInput bind:loading = {loading_uni} bind:win_info = {uni_win_info} answer = {uni_postcode} label = 'University Postcode' bind:status = {uni_submitted} election_store = {election_data_uni}></FormInput>\\n            <FormInput bind:loading = {loading_home} bind:win_info = {home_win_info} answer = {home_postcode} label = 'Home Postcode' bind:status = {home_submitted} election_store = {election_data_home}></FormInput>\\n        </div>\\n    </div>\\n    {#if uni_submitted && home_submitted}\\n\\n    <div class=\\"card-display\\">\\n        <div class=\\"card-container\\">\\n            {#if loading_home || loading_uni}\\n            <CircularProgress style=\\"height: 32px; width: 32px;\\" indeterminate />\\n\\n            {:else}\\n\\n        {#if uni_win_info.win_votes <= home_win_info.win_votes}\\n          <h1>Your university seat is more marginal than your home seat</h1>\\n          {:else}\\n          <h1>Your home seat is more marginal than your university seat</h1>\\n          {/if}\\n          {/if}\\n       \\n        </div>\\n    </div>\\n    {/if}\\n<div class=\\"hbox\\">\\n    {#if uni_submitted && home_submitted && !(loading_home || loading_uni)}\\n    \\n    <div class=\\"card-display\\">\\n        <div class=\\"card-container\\">\\n         \\n            <Result election_data={$election_data_home} win_info = {home_win_info}></Result>\\n       \\n        </div>\\n    </div>\\n    <div class=\\"card-display\\">\\n        <div class=\\"card-container\\">\\n      \\n    \\n            <Result election_data={$election_data_uni} win_info = {uni_win_info}></Result>\\n \\n        </div>\\n    </div>\\n    {/if}\\n</div>\\n{#if uni_submitted && home_submitted}\\n<div class=\\"card-display\\">\\n    <div style = \\"margin: 0 auto; color: white; \\" class=\\"card-container b\\">\\n        <Button   on:click={() => startOver()} variant=\\"raised\\" class=\\"sub button\\">\\n            <Label style = \\"color: white; \\" class=\\"label\\">Start Over</Label>\\n          </Button>\\n     \\n    </div>\\n</div>\\n{/if}\\n</div>\\n\\n<style>\\n    .hbox{\\n        display: flex;\\n        justify-content: space-evenly;\\n    }\\n    .vbox{\\n        display: flex;\\n        justify-content: space-between;\\n        flex-direction: column;\\n        align-content: center;\\n        height: 40%;\\n    }\\n    * :global(.card-display){\\n        margin: 1em;\\n        border: 2px dotted grey;\\n        border-radius: 5px;\\n  }\\n    * :global(.b){\\n        margin: 0 auto;\\n  }\\n  @media (max-width: 1300px) {\\n    .hbox {\\n      flex-direction: column;\\n    }\\n  }\\n</style>\\n"],"names":[],"mappings":"AAiHI,mBAAK,CACD,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,YACrB,CACA,mBAAK,CACD,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,cAAc,CAAE,MAAM,CACtB,aAAa,CAAE,MAAM,CACrB,MAAM,CAAE,GACZ,CACA,cAAC,CAAS,aAAc,CACpB,MAAM,CAAE,GAAG,CACX,MAAM,CAAE,GAAG,CAAC,MAAM,CAAC,IAAI,CACvB,aAAa,CAAE,GACrB,CACE,cAAC,CAAS,EAAG,CACT,MAAM,CAAE,CAAC,CAAC,IAChB,CACA,MAAO,YAAY,MAAM,CAAE,CACzB,mBAAM,CACJ,cAAc,CAAE,MAClB,CACF"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $election_data_home, $$unsubscribe_election_data_home;
  let $election_data_uni, $$unsubscribe_election_data_uni;
  let home_postcode = "";
  let uni_postcode = "";
  let uni_submitted = false;
  let loading_home = false;
  let loading_uni = false;
  let uni_win_info = { win_party: "", win_votes: 0 };
  let home_win_info = { win_party: "", win_votes: 0 };
  let home_submitted = false;
  const election_data_uni = writable([]);
  $$unsubscribe_election_data_uni = subscribe(election_data_uni, (value) => $election_data_uni = value);
  const election_data_home = writable([]);
  $$unsubscribe_election_data_home = subscribe(election_data_home, (value) => $election_data_home = value);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(TopAppBar, "TopAppBar").$$render($$result, { variant: "static" }, {}, {
      default: () => {
        return `${validate_component(Row$1, "Row").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Section, "Section").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Title, "Title").$$render($$result, {}, {}, {
                  default: () => {
                    return `Where to Vote!`;
                  }
                })}`;
              }
            })}`;
          }
        })}`;
      }
    })} <div class="vbox svelte-nebih9"><div class="card-display svelte-nebih9"><div class="card-container svelte-nebih9">${validate_component(Form_input, "FormInput").$$render(
      $$result,
      {
        answer: uni_postcode,
        label: "University Postcode",
        election_store: election_data_uni,
        loading: loading_uni,
        win_info: uni_win_info,
        status: uni_submitted
      },
      {
        loading: ($$value) => {
          loading_uni = $$value;
          $$settled = false;
        },
        win_info: ($$value) => {
          uni_win_info = $$value;
          $$settled = false;
        },
        status: ($$value) => {
          uni_submitted = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Form_input, "FormInput").$$render(
      $$result,
      {
        answer: home_postcode,
        label: "Home Postcode",
        election_store: election_data_home,
        loading: loading_home,
        win_info: home_win_info,
        status: home_submitted
      },
      {
        loading: ($$value) => {
          loading_home = $$value;
          $$settled = false;
        },
        win_info: ($$value) => {
          home_win_info = $$value;
          $$settled = false;
        },
        status: ($$value) => {
          home_submitted = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div> ${uni_submitted && home_submitted ? `<div class="card-display svelte-nebih9"><div class="card-container svelte-nebih9">${loading_home || loading_uni ? `${validate_component(CircularProgress, "CircularProgress").$$render(
      $$result,
      {
        style: "height: 32px; width: 32px;",
        indeterminate: true
      },
      {},
      {}
    )}` : `${uni_win_info.win_votes <= home_win_info.win_votes ? `<h1 class="svelte-nebih9" data-svelte-h="svelte-rd8a1q">Your university seat is more marginal than your home seat</h1>` : `<h1 class="svelte-nebih9" data-svelte-h="svelte-6fcx4s">Your home seat is more marginal than your university seat</h1>`}`}</div></div>` : ``} <div class="hbox svelte-nebih9">${uni_submitted && home_submitted && !(loading_home || loading_uni) ? `<div class="card-display svelte-nebih9"><div class="card-container svelte-nebih9">${validate_component(Result, "Result").$$render(
      $$result,
      {
        election_data: $election_data_home,
        win_info: home_win_info
      },
      {},
      {}
    )}</div></div> <div class="card-display svelte-nebih9"><div class="card-container svelte-nebih9">${validate_component(Result, "Result").$$render(
      $$result,
      {
        election_data: $election_data_uni,
        win_info: uni_win_info
      },
      {},
      {}
    )}</div></div>` : ``}</div> ${uni_submitted && home_submitted ? `<div class="card-display svelte-nebih9"><div style="margin: 0 auto; color: white; " class="card-container b svelte-nebih9">${validate_component(Button, "Button").$$render($$result, { variant: "raised", class: "sub button" }, {}, {
      default: () => {
        return `${validate_component(Button, "Label").$$render($$result, { style: "color: white; ", class: "label" }, {}, {
          default: () => {
            return `Start Over`;
          }
        })}`;
      }
    })}</div></div>` : ``} </div>`;
  } while (!$$settled);
  $$unsubscribe_election_data_home();
  $$unsubscribe_election_data_uni();
  return $$rendered;
});
export {
  Page as default
};
