const _excluded = ["children"],
  _excluded2 = ["children"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { isFragment, isLazy, isPortal, isMemo, isSuspense, isForwardRef } from 'react-is';
import ElementExplorer from './ElementExplorer';
const getNodeName = node => node.displayName || node.name || '';
class ReactShallowRenderer {
  constructor(children) {
    let {
      Wrapper = null
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _defineProperty(this, "shallowRenderer", null);
    this.shallowRenderer = new ShallowRenderer();
    this.shallowWrapper = Wrapper ? this.shallowRenderer.render( /*#__PURE__*/React.createElement(Wrapper, null, children)) : this.shallowRenderer.render(children);
  }
  static shallow(Component) {
    let out;
    try {
      out = new ReactShallowRenderer(Component);
    } catch (error) {
      if (!error.message.includes('ReactShallowRenderer')) {
        console.log({
          error,
          out
        });
      }
      out = ReactShallowRenderer.flatRender(Component);
    }
    return out;
  }
  static flatRender(child) {
    const loadEl = toLoad => {
      if (typeof toLoad === 'object') {
        const _toLoad$props = toLoad.props,
          {
            children
          } = _toLoad$props,
          props = _objectWithoutProperties(_toLoad$props, _excluded);
        const el = {
          type: toLoad.type,
          props
        };
        if (Array.isArray(children)) {
          el.children = children.map(loadEl);
        } else if (children !== undefined) {
          el.children = [loadEl(children)];
        } else {
          el.children = [];
        }
        return el;
      }
      // custom return for basic jsx components (mostly for shallow comparison)
      return {
        el: toLoad,
        type: null,
        props: {},
        children: []
      };
    };
    return loadEl(child);
  }
  isEmptyRender() {
    const data = this.getRenderOutput();
    return data === null || data === false;
  }
  get snapshot() {
    return this.getRenderOutput(true);
  }
  get instance() {
    return new ElementExplorer(this.getRenderOutput(), ReactShallowRenderer.toSnapshot);
  }
  extractType(node) {
    if (typeof node === 'string') {
      return node;
    }
    const name = getNodeName(node.type) || node.type || 'Component';
    if (isLazy(node)) {
      return 'Lazy';
    }
    if (isMemo(node)) {
      return `Memo(${name || this.extractType(node.type)})`;
    }
    if (isSuspense(node)) {
      return 'Suspense';
    }
    if (isPortal(node)) {
      return 'Portal';
    }
    if (isFragment(node)) {
      return 'Fragment';
    }
    if (isForwardRef(node)) {
      return this.getWrappedName(node, node.type.render, 'ForwardRef');
    }
    return name;
  }
  getWrappedName(outerNode, innerNode, wrapperName) {
    const functionName = getNodeName(innerNode);
    return outerNode.type.displayName || (functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName);
  }
  getRenderOutput() {
    let render = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!this.shallowWrapper) {
      return this.shallowWrapper;
    }
    return this.transformNode(this.shallowWrapper, render);
  }

  // eslint-disable-next-line
  extractProps() {
    let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let key = arguments.length > 1 ? arguments[1] : undefined;
    let render = arguments.length > 2 ? arguments[2] : undefined;
    let {
        children
      } = _ref,
      props = _objectWithoutProperties(_ref, _excluded2);
    const childrenArray = Array.isArray(children) ? children : [children];
    return {
      children: childrenArray.filter(Boolean).flatMap(node => this.transformNode(node, render)),
      props: _objectSpread(_objectSpread({}, props), key ? {
        key
      } : {})
    };
  }
  transformNode(node, render) {
    if (Array.isArray(node)) {
      return node.map(n => this.transformNode(n, render));
    }
    if (typeof node !== 'object') {
      return node;
    }
    const out = _objectSpread({
      type: this.extractType(node)
    }, this.extractProps(node.props, node.key, render));
    if (render) {
      // this symbol is used by Jest to prettify serialized React test objects:
      // https://github.com/facebook/jest/blob/e0b33b74b5afd738edc183858b5c34053cfc26dd/packages/pretty-format/src/plugins/ReactTestComponent.ts
      out.$$typeof = Symbol.for('react.test.json');
    }
    return out;
  }
  static toSnapshot(data) {
    return _objectSpread(_objectSpread({}, data), {}, {
      $$typeof: Symbol.for('react.test.json'),
      children: data.children.map(ReactShallowRenderer.toSnapshot)
    });
  }
}
export default ReactShallowRenderer.shallow;
//# sourceMappingURL=shallow.js.map