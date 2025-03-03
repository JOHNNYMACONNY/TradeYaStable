import {
  require_client
} from "./chunk-43WAGOG3.js";
import "./chunk-V2X5ZORR.js";
import {
  require_react
} from "./chunk-32E4H3EV.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/sweetalert2-react-content/dist/sweetalert2-react-content.es.js
var import_react = __toESM(require_react());
var import_client = __toESM(require_client());
var mounts = [{
  key: "title",
  getter: (swal) => swal.getTitle()
}, {
  key: "html",
  getter: (swal) => swal.getHtmlContainer()
}, {
  key: "confirmButtonText",
  getter: (swal) => swal.getConfirmButton()
}, {
  key: "denyButtonText",
  getter: (swal) => swal.getDenyButton()
}, {
  key: "cancelButtonText",
  getter: (swal) => swal.getCancelButton()
}, {
  key: "footer",
  getter: (swal) => swal.getFooter()
}, {
  key: "closeButtonHtml",
  getter: (swal) => swal.getCloseButton()
}, {
  key: "iconHtml",
  getter: (swal) => swal.getIconContent()
}, {
  key: "loaderHtml",
  getter: (swal) => swal.getLoader()
}];
var noop = () => {
};
function withReactContent(ParentSwal) {
  function extractReactParams(params) {
    const reactParams = {};
    const otherParams = {};
    const mountKeys = mounts.map((mount) => mount.key);
    Object.entries(params).forEach((_ref) => {
      let [key, value] = _ref;
      if (mountKeys.includes(key) && import_react.default.isValidElement(value)) {
        reactParams[key] = value;
        otherParams[key] = " ";
      } else {
        otherParams[key] = value;
      }
    });
    return [reactParams, otherParams];
  }
  function render(swal, reactParams) {
    Object.entries(reactParams).forEach((_ref2) => {
      let [key, value] = _ref2;
      const mount = mounts.find((mount2) => mount2.key === key);
      const domElement = mount.getter(ParentSwal);
      const root = (0, import_client.createRoot)(domElement);
      root.render(value);
      swal.__roots.push(root);
    });
  }
  function unrender(swal) {
    swal.__roots.forEach((root) => {
      root.unmount();
    });
    swal.__roots = [];
  }
  return class extends ParentSwal {
    static argsToParams(args) {
      if (import_react.default.isValidElement(args[0]) || import_react.default.isValidElement(args[1])) {
        const params = {};
        ["title", "html", "icon"].forEach((name, index) => {
          if (args[index] !== void 0) {
            params[name] = args[index];
          }
        });
        return params;
      } else {
        return ParentSwal.argsToParams(args);
      }
    }
    _main(params, mixinParams) {
      this.__roots = [];
      this.__params = Object.assign({}, mixinParams, params);
      const [reactParams, otherParams] = extractReactParams(this.__params);
      const superWillOpen = otherParams.willOpen || noop;
      const superDidOpen = otherParams.didOpen || noop;
      const superDidDestroy = otherParams.didDestroy || noop;
      return super._main(Object.assign({}, otherParams, {
        willOpen: (popup) => {
          render(this, reactParams);
          superWillOpen(popup);
        },
        didOpen: (popup) => {
          setTimeout(() => {
            superDidOpen(popup);
          });
        },
        didDestroy: (popup) => {
          superDidDestroy(popup);
          unrender(this);
        }
      }));
    }
    update(params) {
      Object.assign(this.__params, params);
      unrender(this);
      const [reactParams, otherParams] = extractReactParams(this.__params);
      super.update(otherParams);
      render(this, reactParams);
    }
  };
}
export {
  withReactContent as default
};
//# sourceMappingURL=sweetalert2-react-content.js.map
