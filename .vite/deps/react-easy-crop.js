import {
  require_react
} from "./chunk-32E4H3EV.js";
import {
  __assign,
  __extends
} from "./chunk-TELS5YMJ.js";
import {
  __commonJS,
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/normalize-wheel/src/UserAgent_DEPRECATED.js
var require_UserAgent_DEPRECATED = __commonJS({
  "node_modules/normalize-wheel/src/UserAgent_DEPRECATED.js"(exports, module) {
    var _populated = false;
    var _ie;
    var _firefox;
    var _opera;
    var _webkit;
    var _chrome;
    var _ie_real_version;
    var _osx;
    var _windows;
    var _linux;
    var _android;
    var _win64;
    var _iphone;
    var _ipad;
    var _native;
    var _mobile;
    function _populate() {
      if (_populated) {
        return;
      }
      _populated = true;
      var uas = navigator.userAgent;
      var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(uas);
      var os = /(Mac OS X)|(Windows)|(Linux)/.exec(uas);
      _iphone = /\b(iPhone|iP[ao]d)/.exec(uas);
      _ipad = /\b(iP[ao]d)/.exec(uas);
      _android = /Android/i.exec(uas);
      _native = /FBAN\/\w+;/i.exec(uas);
      _mobile = /Mobile/i.exec(uas);
      _win64 = !!/Win64/.exec(uas);
      if (agent) {
        _ie = agent[1] ? parseFloat(agent[1]) : agent[5] ? parseFloat(agent[5]) : NaN;
        if (_ie && document && document.documentMode) {
          _ie = document.documentMode;
        }
        var trident = /(?:Trident\/(\d+.\d+))/.exec(uas);
        _ie_real_version = trident ? parseFloat(trident[1]) + 4 : _ie;
        _firefox = agent[2] ? parseFloat(agent[2]) : NaN;
        _opera = agent[3] ? parseFloat(agent[3]) : NaN;
        _webkit = agent[4] ? parseFloat(agent[4]) : NaN;
        if (_webkit) {
          agent = /(?:Chrome\/(\d+\.\d+))/.exec(uas);
          _chrome = agent && agent[1] ? parseFloat(agent[1]) : NaN;
        } else {
          _chrome = NaN;
        }
      } else {
        _ie = _firefox = _opera = _chrome = _webkit = NaN;
      }
      if (os) {
        if (os[1]) {
          var ver = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(uas);
          _osx = ver ? parseFloat(ver[1].replace("_", ".")) : true;
        } else {
          _osx = false;
        }
        _windows = !!os[2];
        _linux = !!os[3];
      } else {
        _osx = _windows = _linux = false;
      }
    }
    var UserAgent_DEPRECATED = {
      /**
       *  Check if the UA is Internet Explorer.
       *
       *
       *  @return float|NaN Version number (if match) or NaN.
       */
      ie: function() {
        return _populate() || _ie;
      },
      /**
       * Check if we're in Internet Explorer compatibility mode.
       *
       * @return bool true if in compatibility mode, false if
       * not compatibility mode or not ie
       */
      ieCompatibilityMode: function() {
        return _populate() || _ie_real_version > _ie;
      },
      /**
       * Whether the browser is 64-bit IE.  Really, this is kind of weak sauce;  we
       * only need this because Skype can't handle 64-bit IE yet.  We need to remove
       * this when we don't need it -- tracked by #601957.
       */
      ie64: function() {
        return UserAgent_DEPRECATED.ie() && _win64;
      },
      /**
       *  Check if the UA is Firefox.
       *
       *
       *  @return float|NaN Version number (if match) or NaN.
       */
      firefox: function() {
        return _populate() || _firefox;
      },
      /**
       *  Check if the UA is Opera.
       *
       *
       *  @return float|NaN Version number (if match) or NaN.
       */
      opera: function() {
        return _populate() || _opera;
      },
      /**
       *  Check if the UA is WebKit.
       *
       *
       *  @return float|NaN Version number (if match) or NaN.
       */
      webkit: function() {
        return _populate() || _webkit;
      },
      /**
       *  For Push
       *  WILL BE REMOVED VERY SOON. Use UserAgent_DEPRECATED.webkit
       */
      safari: function() {
        return UserAgent_DEPRECATED.webkit();
      },
      /**
       *  Check if the UA is a Chrome browser.
       *
       *
       *  @return float|NaN Version number (if match) or NaN.
       */
      chrome: function() {
        return _populate() || _chrome;
      },
      /**
       *  Check if the user is running Windows.
       *
       *  @return bool `true' if the user's OS is Windows.
       */
      windows: function() {
        return _populate() || _windows;
      },
      /**
       *  Check if the user is running Mac OS X.
       *
       *  @return float|bool   Returns a float if a version number is detected,
       *                       otherwise true/false.
       */
      osx: function() {
        return _populate() || _osx;
      },
      /**
       * Check if the user is running Linux.
       *
       * @return bool `true' if the user's OS is some flavor of Linux.
       */
      linux: function() {
        return _populate() || _linux;
      },
      /**
       * Check if the user is running on an iPhone or iPod platform.
       *
       * @return bool `true' if the user is running some flavor of the
       *    iPhone OS.
       */
      iphone: function() {
        return _populate() || _iphone;
      },
      mobile: function() {
        return _populate() || (_iphone || _ipad || _android || _mobile);
      },
      nativeApp: function() {
        return _populate() || _native;
      },
      android: function() {
        return _populate() || _android;
      },
      ipad: function() {
        return _populate() || _ipad;
      }
    };
    module.exports = UserAgent_DEPRECATED;
  }
});

// node_modules/normalize-wheel/src/ExecutionEnvironment.js
var require_ExecutionEnvironment = __commonJS({
  "node_modules/normalize-wheel/src/ExecutionEnvironment.js"(exports, module) {
    "use strict";
    var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
    var ExecutionEnvironment = {
      canUseDOM,
      canUseWorkers: typeof Worker !== "undefined",
      canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),
      canUseViewport: canUseDOM && !!window.screen,
      isInWorker: !canUseDOM
      // For now, this is true - might change in the future.
    };
    module.exports = ExecutionEnvironment;
  }
});

// node_modules/normalize-wheel/src/isEventSupported.js
var require_isEventSupported = __commonJS({
  "node_modules/normalize-wheel/src/isEventSupported.js"(exports, module) {
    "use strict";
    var ExecutionEnvironment = require_ExecutionEnvironment();
    var useHasFeature;
    if (ExecutionEnvironment.canUseDOM) {
      useHasFeature = document.implementation && document.implementation.hasFeature && // always returns true in newer browsers as per the standard.
      // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
      document.implementation.hasFeature("", "") !== true;
    }
    function isEventSupported(eventNameSuffix, capture) {
      if (!ExecutionEnvironment.canUseDOM || capture && !("addEventListener" in document)) {
        return false;
      }
      var eventName = "on" + eventNameSuffix;
      var isSupported = eventName in document;
      if (!isSupported) {
        var element = document.createElement("div");
        element.setAttribute(eventName, "return;");
        isSupported = typeof element[eventName] === "function";
      }
      if (!isSupported && useHasFeature && eventNameSuffix === "wheel") {
        isSupported = document.implementation.hasFeature("Events.wheel", "3.0");
      }
      return isSupported;
    }
    module.exports = isEventSupported;
  }
});

// node_modules/normalize-wheel/src/normalizeWheel.js
var require_normalizeWheel = __commonJS({
  "node_modules/normalize-wheel/src/normalizeWheel.js"(exports, module) {
    "use strict";
    var UserAgent_DEPRECATED = require_UserAgent_DEPRECATED();
    var isEventSupported = require_isEventSupported();
    var PIXEL_STEP = 10;
    var LINE_HEIGHT = 40;
    var PAGE_HEIGHT = 800;
    function normalizeWheel2(event) {
      var sX = 0, sY = 0, pX = 0, pY = 0;
      if ("detail" in event) {
        sY = event.detail;
      }
      if ("wheelDelta" in event) {
        sY = -event.wheelDelta / 120;
      }
      if ("wheelDeltaY" in event) {
        sY = -event.wheelDeltaY / 120;
      }
      if ("wheelDeltaX" in event) {
        sX = -event.wheelDeltaX / 120;
      }
      if ("axis" in event && event.axis === event.HORIZONTAL_AXIS) {
        sX = sY;
        sY = 0;
      }
      pX = sX * PIXEL_STEP;
      pY = sY * PIXEL_STEP;
      if ("deltaY" in event) {
        pY = event.deltaY;
      }
      if ("deltaX" in event) {
        pX = event.deltaX;
      }
      if ((pX || pY) && event.deltaMode) {
        if (event.deltaMode == 1) {
          pX *= LINE_HEIGHT;
          pY *= LINE_HEIGHT;
        } else {
          pX *= PAGE_HEIGHT;
          pY *= PAGE_HEIGHT;
        }
      }
      if (pX && !sX) {
        sX = pX < 1 ? -1 : 1;
      }
      if (pY && !sY) {
        sY = pY < 1 ? -1 : 1;
      }
      return {
        spinX: sX,
        spinY: sY,
        pixelX: pX,
        pixelY: pY
      };
    }
    normalizeWheel2.getEventType = function() {
      return UserAgent_DEPRECATED.firefox() ? "DOMMouseScroll" : isEventSupported("wheel") ? "wheel" : "mousewheel";
    };
    module.exports = normalizeWheel2;
  }
});

// node_modules/normalize-wheel/index.js
var require_normalize_wheel = __commonJS({
  "node_modules/normalize-wheel/index.js"(exports, module) {
    module.exports = require_normalizeWheel();
  }
});

// node_modules/react-easy-crop/index.module.js
var React = __toESM(require_react());
var import_normalize_wheel = __toESM(require_normalize_wheel());
function getCropSize(mediaWidth, mediaHeight, containerWidth, containerHeight, aspect, rotation) {
  if (rotation === void 0) {
    rotation = 0;
  }
  var _a = rotateSize(mediaWidth, mediaHeight, rotation), width = _a.width, height = _a.height;
  var fittingWidth = Math.min(width, containerWidth);
  var fittingHeight = Math.min(height, containerHeight);
  if (fittingWidth > fittingHeight * aspect) {
    return {
      width: fittingHeight * aspect,
      height: fittingHeight
    };
  }
  return {
    width: fittingWidth,
    height: fittingWidth / aspect
  };
}
function getMediaZoom(mediaSize) {
  return mediaSize.width > mediaSize.height ? mediaSize.width / mediaSize.naturalWidth : mediaSize.height / mediaSize.naturalHeight;
}
function restrictPosition(position, mediaSize, cropSize, zoom, rotation) {
  if (rotation === void 0) {
    rotation = 0;
  }
  var _a = rotateSize(mediaSize.width, mediaSize.height, rotation), width = _a.width, height = _a.height;
  return {
    x: restrictPositionCoord(position.x, width, cropSize.width, zoom),
    y: restrictPositionCoord(position.y, height, cropSize.height, zoom)
  };
}
function restrictPositionCoord(position, mediaSize, cropSize, zoom) {
  var maxPosition = mediaSize * zoom / 2 - cropSize / 2;
  return clamp(position, -maxPosition, maxPosition);
}
function getDistanceBetweenPoints(pointA, pointB) {
  return Math.sqrt(Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2));
}
function getRotationBetweenPoints(pointA, pointB) {
  return Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180 / Math.PI;
}
function computeCroppedArea(crop, mediaSize, cropSize, aspect, zoom, rotation, restrictPosition2) {
  if (rotation === void 0) {
    rotation = 0;
  }
  if (restrictPosition2 === void 0) {
    restrictPosition2 = true;
  }
  var limitAreaFn = restrictPosition2 ? limitArea : noOp;
  var mediaBBoxSize = rotateSize(mediaSize.width, mediaSize.height, rotation);
  var mediaNaturalBBoxSize = rotateSize(mediaSize.naturalWidth, mediaSize.naturalHeight, rotation);
  var croppedAreaPercentages = {
    x: limitAreaFn(100, ((mediaBBoxSize.width - cropSize.width / zoom) / 2 - crop.x / zoom) / mediaBBoxSize.width * 100),
    y: limitAreaFn(100, ((mediaBBoxSize.height - cropSize.height / zoom) / 2 - crop.y / zoom) / mediaBBoxSize.height * 100),
    width: limitAreaFn(100, cropSize.width / mediaBBoxSize.width * 100 / zoom),
    height: limitAreaFn(100, cropSize.height / mediaBBoxSize.height * 100 / zoom)
  };
  var widthInPixels = Math.round(limitAreaFn(mediaNaturalBBoxSize.width, croppedAreaPercentages.width * mediaNaturalBBoxSize.width / 100));
  var heightInPixels = Math.round(limitAreaFn(mediaNaturalBBoxSize.height, croppedAreaPercentages.height * mediaNaturalBBoxSize.height / 100));
  var isImgWiderThanHigh = mediaNaturalBBoxSize.width >= mediaNaturalBBoxSize.height * aspect;
  var sizePixels = isImgWiderThanHigh ? {
    width: Math.round(heightInPixels * aspect),
    height: heightInPixels
  } : {
    width: widthInPixels,
    height: Math.round(widthInPixels / aspect)
  };
  var croppedAreaPixels = __assign(__assign({}, sizePixels), {
    x: Math.round(limitAreaFn(mediaNaturalBBoxSize.width - sizePixels.width, croppedAreaPercentages.x * mediaNaturalBBoxSize.width / 100)),
    y: Math.round(limitAreaFn(mediaNaturalBBoxSize.height - sizePixels.height, croppedAreaPercentages.y * mediaNaturalBBoxSize.height / 100))
  });
  return {
    croppedAreaPercentages,
    croppedAreaPixels
  };
}
function limitArea(max, value) {
  return Math.min(max, Math.max(0, value));
}
function noOp(_max, value) {
  return value;
}
function getInitialCropFromCroppedAreaPercentages(croppedAreaPercentages, mediaSize, rotation, cropSize, minZoom, maxZoom) {
  var mediaBBoxSize = rotateSize(mediaSize.width, mediaSize.height, rotation);
  var zoom = clamp(cropSize.width / mediaBBoxSize.width * (100 / croppedAreaPercentages.width), minZoom, maxZoom);
  var crop = {
    x: zoom * mediaBBoxSize.width / 2 - cropSize.width / 2 - mediaBBoxSize.width * zoom * (croppedAreaPercentages.x / 100),
    y: zoom * mediaBBoxSize.height / 2 - cropSize.height / 2 - mediaBBoxSize.height * zoom * (croppedAreaPercentages.y / 100)
  };
  return {
    crop,
    zoom
  };
}
function getZoomFromCroppedAreaPixels(croppedAreaPixels, mediaSize, cropSize) {
  var mediaZoom = getMediaZoom(mediaSize);
  return cropSize.height > cropSize.width ? cropSize.height / (croppedAreaPixels.height * mediaZoom) : cropSize.width / (croppedAreaPixels.width * mediaZoom);
}
function getInitialCropFromCroppedAreaPixels(croppedAreaPixels, mediaSize, rotation, cropSize, minZoom, maxZoom) {
  if (rotation === void 0) {
    rotation = 0;
  }
  var mediaNaturalBBoxSize = rotateSize(mediaSize.naturalWidth, mediaSize.naturalHeight, rotation);
  var zoom = clamp(getZoomFromCroppedAreaPixels(croppedAreaPixels, mediaSize, cropSize), minZoom, maxZoom);
  var cropZoom = cropSize.height > cropSize.width ? cropSize.height / croppedAreaPixels.height : cropSize.width / croppedAreaPixels.width;
  var crop = {
    x: ((mediaNaturalBBoxSize.width - croppedAreaPixels.width) / 2 - croppedAreaPixels.x) * cropZoom,
    y: ((mediaNaturalBBoxSize.height - croppedAreaPixels.height) / 2 - croppedAreaPixels.y) * cropZoom
  };
  return {
    crop,
    zoom
  };
}
function getCenter(a, b) {
  return {
    x: (b.x + a.x) / 2,
    y: (b.y + a.y) / 2
  };
}
function getRadianAngle(degreeValue) {
  return degreeValue * Math.PI / 180;
}
function rotateSize(width, height, rotation) {
  var rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
  };
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function classNames() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return args.filter(function(value) {
    if (typeof value === "string" && value.length > 0) {
      return true;
    }
    return false;
  }).join(" ").trim();
}
var css_248z = ".reactEasyCrop_Container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  overflow: hidden;\n  user-select: none;\n  touch-action: none;\n  cursor: move;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.reactEasyCrop_Image,\n.reactEasyCrop_Video {\n  will-change: transform; /* this improves performances and prevent painting issues on iOS Chrome */\n}\n\n.reactEasyCrop_Contain {\n  max-width: 100%;\n  max-height: 100%;\n  margin: auto;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n}\n.reactEasyCrop_Cover_Horizontal {\n  width: 100%;\n  height: auto;\n}\n.reactEasyCrop_Cover_Vertical {\n  width: auto;\n  height: 100%;\n}\n\n.reactEasyCrop_CropArea {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  box-sizing: border-box;\n  box-shadow: 0 0 0 9999em;\n  color: rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n}\n\n.reactEasyCrop_CropAreaRound {\n  border-radius: 50%;\n}\n\n.reactEasyCrop_CropAreaGrid::before {\n  content: ' ';\n  box-sizing: border-box;\n  position: absolute;\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  top: 0;\n  bottom: 0;\n  left: 33.33%;\n  right: 33.33%;\n  border-top: 0;\n  border-bottom: 0;\n}\n\n.reactEasyCrop_CropAreaGrid::after {\n  content: ' ';\n  box-sizing: border-box;\n  position: absolute;\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  top: 33.33%;\n  bottom: 33.33%;\n  left: 0;\n  right: 0;\n  border-left: 0;\n  border-right: 0;\n}\n";
var MIN_ZOOM = 1;
var MAX_ZOOM = 3;
var KEYBOARD_STEP = 1;
var Cropper = (
  /** @class */
  function(_super) {
    __extends(Cropper2, _super);
    function Cropper2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.imageRef = React.createRef();
      _this.videoRef = React.createRef();
      _this.containerPosition = {
        x: 0,
        y: 0
      };
      _this.containerRef = null;
      _this.styleRef = null;
      _this.containerRect = null;
      _this.mediaSize = {
        width: 0,
        height: 0,
        naturalWidth: 0,
        naturalHeight: 0
      };
      _this.dragStartPosition = {
        x: 0,
        y: 0
      };
      _this.dragStartCrop = {
        x: 0,
        y: 0
      };
      _this.gestureZoomStart = 0;
      _this.gestureRotationStart = 0;
      _this.isTouching = false;
      _this.lastPinchDistance = 0;
      _this.lastPinchRotation = 0;
      _this.rafDragTimeout = null;
      _this.rafPinchTimeout = null;
      _this.wheelTimer = null;
      _this.currentDoc = typeof document !== "undefined" ? document : null;
      _this.currentWindow = typeof window !== "undefined" ? window : null;
      _this.resizeObserver = null;
      _this.state = {
        cropSize: null,
        hasWheelJustStarted: false,
        mediaObjectFit: void 0
      };
      _this.initResizeObserver = function() {
        if (typeof window.ResizeObserver === "undefined" || !_this.containerRef) {
          return;
        }
        var isFirstResize = true;
        _this.resizeObserver = new window.ResizeObserver(function(entries) {
          if (isFirstResize) {
            isFirstResize = false;
            return;
          }
          _this.computeSizes();
        });
        _this.resizeObserver.observe(_this.containerRef);
      };
      _this.preventZoomSafari = function(e) {
        return e.preventDefault();
      };
      _this.cleanEvents = function() {
        if (!_this.currentDoc) return;
        _this.currentDoc.removeEventListener("mousemove", _this.onMouseMove);
        _this.currentDoc.removeEventListener("mouseup", _this.onDragStopped);
        _this.currentDoc.removeEventListener("touchmove", _this.onTouchMove);
        _this.currentDoc.removeEventListener("touchend", _this.onDragStopped);
        _this.currentDoc.removeEventListener("gesturemove", _this.onGestureMove);
        _this.currentDoc.removeEventListener("gestureend", _this.onGestureEnd);
        _this.currentDoc.removeEventListener("scroll", _this.onScroll);
      };
      _this.clearScrollEvent = function() {
        if (_this.containerRef) _this.containerRef.removeEventListener("wheel", _this.onWheel);
        if (_this.wheelTimer) {
          clearTimeout(_this.wheelTimer);
        }
      };
      _this.onMediaLoad = function() {
        var cropSize = _this.computeSizes();
        if (cropSize) {
          _this.emitCropData();
          _this.setInitialCrop(cropSize);
        }
        if (_this.props.onMediaLoaded) {
          _this.props.onMediaLoaded(_this.mediaSize);
        }
      };
      _this.setInitialCrop = function(cropSize) {
        if (_this.props.initialCroppedAreaPercentages) {
          var _a = getInitialCropFromCroppedAreaPercentages(_this.props.initialCroppedAreaPercentages, _this.mediaSize, _this.props.rotation, cropSize, _this.props.minZoom, _this.props.maxZoom), crop = _a.crop, zoom = _a.zoom;
          _this.props.onCropChange(crop);
          _this.props.onZoomChange && _this.props.onZoomChange(zoom);
        } else if (_this.props.initialCroppedAreaPixels) {
          var _b = getInitialCropFromCroppedAreaPixels(_this.props.initialCroppedAreaPixels, _this.mediaSize, _this.props.rotation, cropSize, _this.props.minZoom, _this.props.maxZoom), crop = _b.crop, zoom = _b.zoom;
          _this.props.onCropChange(crop);
          _this.props.onZoomChange && _this.props.onZoomChange(zoom);
        }
      };
      _this.computeSizes = function() {
        var _a, _b, _c, _d, _e, _f;
        var mediaRef = _this.imageRef.current || _this.videoRef.current;
        if (mediaRef && _this.containerRef) {
          _this.containerRect = _this.containerRef.getBoundingClientRect();
          _this.saveContainerPosition();
          var containerAspect = _this.containerRect.width / _this.containerRect.height;
          var naturalWidth = ((_a = _this.imageRef.current) === null || _a === void 0 ? void 0 : _a.naturalWidth) || ((_b = _this.videoRef.current) === null || _b === void 0 ? void 0 : _b.videoWidth) || 0;
          var naturalHeight = ((_c = _this.imageRef.current) === null || _c === void 0 ? void 0 : _c.naturalHeight) || ((_d = _this.videoRef.current) === null || _d === void 0 ? void 0 : _d.videoHeight) || 0;
          var isMediaScaledDown = mediaRef.offsetWidth < naturalWidth || mediaRef.offsetHeight < naturalHeight;
          var mediaAspect = naturalWidth / naturalHeight;
          var renderedMediaSize = void 0;
          if (isMediaScaledDown) {
            switch (_this.state.mediaObjectFit) {
              default:
              case "contain":
                renderedMediaSize = containerAspect > mediaAspect ? {
                  width: _this.containerRect.height * mediaAspect,
                  height: _this.containerRect.height
                } : {
                  width: _this.containerRect.width,
                  height: _this.containerRect.width / mediaAspect
                };
                break;
              case "horizontal-cover":
                renderedMediaSize = {
                  width: _this.containerRect.width,
                  height: _this.containerRect.width / mediaAspect
                };
                break;
              case "vertical-cover":
                renderedMediaSize = {
                  width: _this.containerRect.height * mediaAspect,
                  height: _this.containerRect.height
                };
                break;
            }
          } else {
            renderedMediaSize = {
              width: mediaRef.offsetWidth,
              height: mediaRef.offsetHeight
            };
          }
          _this.mediaSize = __assign(__assign({}, renderedMediaSize), {
            naturalWidth,
            naturalHeight
          });
          if (_this.props.setMediaSize) {
            _this.props.setMediaSize(_this.mediaSize);
          }
          var cropSize = _this.props.cropSize ? _this.props.cropSize : getCropSize(_this.mediaSize.width, _this.mediaSize.height, _this.containerRect.width, _this.containerRect.height, _this.props.aspect, _this.props.rotation);
          if (((_e = _this.state.cropSize) === null || _e === void 0 ? void 0 : _e.height) !== cropSize.height || ((_f = _this.state.cropSize) === null || _f === void 0 ? void 0 : _f.width) !== cropSize.width) {
            _this.props.onCropSizeChange && _this.props.onCropSizeChange(cropSize);
          }
          _this.setState({
            cropSize
          }, _this.recomputeCropPosition);
          if (_this.props.setCropSize) {
            _this.props.setCropSize(cropSize);
          }
          return cropSize;
        }
      };
      _this.saveContainerPosition = function() {
        if (_this.containerRef) {
          var bounds = _this.containerRef.getBoundingClientRect();
          _this.containerPosition = {
            x: bounds.left,
            y: bounds.top
          };
        }
      };
      _this.onMouseDown = function(e) {
        if (!_this.currentDoc) return;
        e.preventDefault();
        _this.currentDoc.addEventListener("mousemove", _this.onMouseMove);
        _this.currentDoc.addEventListener("mouseup", _this.onDragStopped);
        _this.saveContainerPosition();
        _this.onDragStart(Cropper2.getMousePoint(e));
      };
      _this.onMouseMove = function(e) {
        return _this.onDrag(Cropper2.getMousePoint(e));
      };
      _this.onScroll = function(e) {
        if (!_this.currentDoc) return;
        e.preventDefault();
        _this.saveContainerPosition();
      };
      _this.onTouchStart = function(e) {
        if (!_this.currentDoc) return;
        _this.isTouching = true;
        if (_this.props.onTouchRequest && !_this.props.onTouchRequest(e)) {
          return;
        }
        _this.currentDoc.addEventListener("touchmove", _this.onTouchMove, {
          passive: false
        });
        _this.currentDoc.addEventListener("touchend", _this.onDragStopped);
        _this.saveContainerPosition();
        if (e.touches.length === 2) {
          _this.onPinchStart(e);
        } else if (e.touches.length === 1) {
          _this.onDragStart(Cropper2.getTouchPoint(e.touches[0]));
        }
      };
      _this.onTouchMove = function(e) {
        e.preventDefault();
        if (e.touches.length === 2) {
          _this.onPinchMove(e);
        } else if (e.touches.length === 1) {
          _this.onDrag(Cropper2.getTouchPoint(e.touches[0]));
        }
      };
      _this.onGestureStart = function(e) {
        if (!_this.currentDoc) return;
        e.preventDefault();
        _this.currentDoc.addEventListener("gesturechange", _this.onGestureMove);
        _this.currentDoc.addEventListener("gestureend", _this.onGestureEnd);
        _this.gestureZoomStart = _this.props.zoom;
        _this.gestureRotationStart = _this.props.rotation;
      };
      _this.onGestureMove = function(e) {
        e.preventDefault();
        if (_this.isTouching) {
          return;
        }
        var point = Cropper2.getMousePoint(e);
        var newZoom = _this.gestureZoomStart - 1 + e.scale;
        _this.setNewZoom(newZoom, point, {
          shouldUpdatePosition: true
        });
        if (_this.props.onRotationChange) {
          var newRotation = _this.gestureRotationStart + e.rotation;
          _this.props.onRotationChange(newRotation);
        }
      };
      _this.onGestureEnd = function(e) {
        _this.cleanEvents();
      };
      _this.onDragStart = function(_a) {
        var _b, _c;
        var x = _a.x, y = _a.y;
        _this.dragStartPosition = {
          x,
          y
        };
        _this.dragStartCrop = __assign({}, _this.props.crop);
        (_c = (_b = _this.props).onInteractionStart) === null || _c === void 0 ? void 0 : _c.call(_b);
      };
      _this.onDrag = function(_a) {
        var x = _a.x, y = _a.y;
        if (!_this.currentWindow) return;
        if (_this.rafDragTimeout) _this.currentWindow.cancelAnimationFrame(_this.rafDragTimeout);
        _this.rafDragTimeout = _this.currentWindow.requestAnimationFrame(function() {
          if (!_this.state.cropSize) return;
          if (x === void 0 || y === void 0) return;
          var offsetX = x - _this.dragStartPosition.x;
          var offsetY = y - _this.dragStartPosition.y;
          var requestedPosition = {
            x: _this.dragStartCrop.x + offsetX,
            y: _this.dragStartCrop.y + offsetY
          };
          var newPosition = _this.props.restrictPosition ? restrictPosition(requestedPosition, _this.mediaSize, _this.state.cropSize, _this.props.zoom, _this.props.rotation) : requestedPosition;
          _this.props.onCropChange(newPosition);
        });
      };
      _this.onDragStopped = function() {
        var _a, _b;
        _this.isTouching = false;
        _this.cleanEvents();
        _this.emitCropData();
        (_b = (_a = _this.props).onInteractionEnd) === null || _b === void 0 ? void 0 : _b.call(_a);
      };
      _this.onWheel = function(e) {
        if (!_this.currentWindow) return;
        if (_this.props.onWheelRequest && !_this.props.onWheelRequest(e)) {
          return;
        }
        e.preventDefault();
        var point = Cropper2.getMousePoint(e);
        var pixelY = (0, import_normalize_wheel.default)(e).pixelY;
        var newZoom = _this.props.zoom - pixelY * _this.props.zoomSpeed / 200;
        _this.setNewZoom(newZoom, point, {
          shouldUpdatePosition: true
        });
        if (!_this.state.hasWheelJustStarted) {
          _this.setState({
            hasWheelJustStarted: true
          }, function() {
            var _a, _b;
            return (_b = (_a = _this.props).onInteractionStart) === null || _b === void 0 ? void 0 : _b.call(_a);
          });
        }
        if (_this.wheelTimer) {
          clearTimeout(_this.wheelTimer);
        }
        _this.wheelTimer = _this.currentWindow.setTimeout(function() {
          return _this.setState({
            hasWheelJustStarted: false
          }, function() {
            var _a, _b;
            return (_b = (_a = _this.props).onInteractionEnd) === null || _b === void 0 ? void 0 : _b.call(_a);
          });
        }, 250);
      };
      _this.getPointOnContainer = function(_a, containerTopLeft) {
        var x = _a.x, y = _a.y;
        if (!_this.containerRect) {
          throw new Error("The Cropper is not mounted");
        }
        return {
          x: _this.containerRect.width / 2 - (x - containerTopLeft.x),
          y: _this.containerRect.height / 2 - (y - containerTopLeft.y)
        };
      };
      _this.getPointOnMedia = function(_a) {
        var x = _a.x, y = _a.y;
        var _b = _this.props, crop = _b.crop, zoom = _b.zoom;
        return {
          x: (x + crop.x) / zoom,
          y: (y + crop.y) / zoom
        };
      };
      _this.setNewZoom = function(zoom, point, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.shouldUpdatePosition, shouldUpdatePosition = _c === void 0 ? true : _c;
        if (!_this.state.cropSize || !_this.props.onZoomChange) return;
        var newZoom = clamp(zoom, _this.props.minZoom, _this.props.maxZoom);
        if (shouldUpdatePosition) {
          var zoomPoint = _this.getPointOnContainer(point, _this.containerPosition);
          var zoomTarget = _this.getPointOnMedia(zoomPoint);
          var requestedPosition = {
            x: zoomTarget.x * newZoom - zoomPoint.x,
            y: zoomTarget.y * newZoom - zoomPoint.y
          };
          var newPosition = _this.props.restrictPosition ? restrictPosition(requestedPosition, _this.mediaSize, _this.state.cropSize, newZoom, _this.props.rotation) : requestedPosition;
          _this.props.onCropChange(newPosition);
        }
        _this.props.onZoomChange(newZoom);
      };
      _this.getCropData = function() {
        if (!_this.state.cropSize) {
          return null;
        }
        var restrictedPosition = _this.props.restrictPosition ? restrictPosition(_this.props.crop, _this.mediaSize, _this.state.cropSize, _this.props.zoom, _this.props.rotation) : _this.props.crop;
        return computeCroppedArea(restrictedPosition, _this.mediaSize, _this.state.cropSize, _this.getAspect(), _this.props.zoom, _this.props.rotation, _this.props.restrictPosition);
      };
      _this.emitCropData = function() {
        var cropData = _this.getCropData();
        if (!cropData) return;
        var croppedAreaPercentages = cropData.croppedAreaPercentages, croppedAreaPixels = cropData.croppedAreaPixels;
        if (_this.props.onCropComplete) {
          _this.props.onCropComplete(croppedAreaPercentages, croppedAreaPixels);
        }
        if (_this.props.onCropAreaChange) {
          _this.props.onCropAreaChange(croppedAreaPercentages, croppedAreaPixels);
        }
      };
      _this.emitCropAreaChange = function() {
        var cropData = _this.getCropData();
        if (!cropData) return;
        var croppedAreaPercentages = cropData.croppedAreaPercentages, croppedAreaPixels = cropData.croppedAreaPixels;
        if (_this.props.onCropAreaChange) {
          _this.props.onCropAreaChange(croppedAreaPercentages, croppedAreaPixels);
        }
      };
      _this.recomputeCropPosition = function() {
        if (!_this.state.cropSize) return;
        var newPosition = _this.props.restrictPosition ? restrictPosition(_this.props.crop, _this.mediaSize, _this.state.cropSize, _this.props.zoom, _this.props.rotation) : _this.props.crop;
        _this.props.onCropChange(newPosition);
        _this.emitCropData();
      };
      _this.onKeyDown = function(event) {
        var _a = _this.props, crop = _a.crop, onCropChange = _a.onCropChange, keyboardStep = _a.keyboardStep, zoom = _a.zoom, rotation = _a.rotation;
        var step = keyboardStep;
        if (!_this.state.cropSize) return;
        if (event.shiftKey) {
          step *= 0.2;
        }
        var newCrop = __assign({}, crop);
        switch (event.key) {
          case "ArrowUp":
            newCrop.y -= step;
            event.preventDefault();
            break;
          case "ArrowDown":
            newCrop.y += step;
            event.preventDefault();
            break;
          case "ArrowLeft":
            newCrop.x -= step;
            event.preventDefault();
            break;
          case "ArrowRight":
            newCrop.x += step;
            event.preventDefault();
            break;
          default:
            return;
        }
        if (_this.props.restrictPosition) {
          newCrop = restrictPosition(newCrop, _this.mediaSize, _this.state.cropSize, zoom, rotation);
        }
        onCropChange(newCrop);
      };
      return _this;
    }
    Cropper2.prototype.componentDidMount = function() {
      if (!this.currentDoc || !this.currentWindow) return;
      if (this.containerRef) {
        if (this.containerRef.ownerDocument) {
          this.currentDoc = this.containerRef.ownerDocument;
        }
        if (this.currentDoc.defaultView) {
          this.currentWindow = this.currentDoc.defaultView;
        }
        this.initResizeObserver();
        if (typeof window.ResizeObserver === "undefined") {
          this.currentWindow.addEventListener("resize", this.computeSizes);
        }
        this.props.zoomWithScroll && this.containerRef.addEventListener("wheel", this.onWheel, {
          passive: false
        });
        this.containerRef.addEventListener("gesturestart", this.onGestureStart);
      }
      this.currentDoc.addEventListener("scroll", this.onScroll);
      if (!this.props.disableAutomaticStylesInjection) {
        this.styleRef = this.currentDoc.createElement("style");
        this.styleRef.setAttribute("type", "text/css");
        if (this.props.nonce) {
          this.styleRef.setAttribute("nonce", this.props.nonce);
        }
        this.styleRef.innerHTML = css_248z;
        this.currentDoc.head.appendChild(this.styleRef);
      }
      if (this.imageRef.current && this.imageRef.current.complete) {
        this.onMediaLoad();
      }
      if (this.props.setImageRef) {
        this.props.setImageRef(this.imageRef);
      }
      if (this.props.setVideoRef) {
        this.props.setVideoRef(this.videoRef);
      }
    };
    Cropper2.prototype.componentWillUnmount = function() {
      var _a, _b;
      if (!this.currentDoc || !this.currentWindow) return;
      if (typeof window.ResizeObserver === "undefined") {
        this.currentWindow.removeEventListener("resize", this.computeSizes);
      }
      (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
      if (this.containerRef) {
        this.containerRef.removeEventListener("gesturestart", this.preventZoomSafari);
      }
      if (this.styleRef) {
        (_b = this.styleRef.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(this.styleRef);
      }
      this.cleanEvents();
      this.props.zoomWithScroll && this.clearScrollEvent();
    };
    Cropper2.prototype.componentDidUpdate = function(prevProps) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j;
      if (prevProps.rotation !== this.props.rotation) {
        this.computeSizes();
        this.recomputeCropPosition();
      } else if (prevProps.aspect !== this.props.aspect) {
        this.computeSizes();
      } else if (prevProps.objectFit !== this.props.objectFit) {
        this.computeSizes();
      } else if (prevProps.zoom !== this.props.zoom) {
        this.recomputeCropPosition();
      } else if (((_a = prevProps.cropSize) === null || _a === void 0 ? void 0 : _a.height) !== ((_b = this.props.cropSize) === null || _b === void 0 ? void 0 : _b.height) || ((_c = prevProps.cropSize) === null || _c === void 0 ? void 0 : _c.width) !== ((_d = this.props.cropSize) === null || _d === void 0 ? void 0 : _d.width)) {
        this.computeSizes();
      } else if (((_e = prevProps.crop) === null || _e === void 0 ? void 0 : _e.x) !== ((_f = this.props.crop) === null || _f === void 0 ? void 0 : _f.x) || ((_g = prevProps.crop) === null || _g === void 0 ? void 0 : _g.y) !== ((_h = this.props.crop) === null || _h === void 0 ? void 0 : _h.y)) {
        this.emitCropAreaChange();
      }
      if (prevProps.zoomWithScroll !== this.props.zoomWithScroll && this.containerRef) {
        this.props.zoomWithScroll ? this.containerRef.addEventListener("wheel", this.onWheel, {
          passive: false
        }) : this.clearScrollEvent();
      }
      if (prevProps.video !== this.props.video) {
        (_j = this.videoRef.current) === null || _j === void 0 ? void 0 : _j.load();
      }
      var objectFit = this.getObjectFit();
      if (objectFit !== this.state.mediaObjectFit) {
        this.setState({
          mediaObjectFit: objectFit
        }, this.computeSizes);
      }
    };
    Cropper2.prototype.getAspect = function() {
      var _a = this.props, cropSize = _a.cropSize, aspect = _a.aspect;
      if (cropSize) {
        return cropSize.width / cropSize.height;
      }
      return aspect;
    };
    Cropper2.prototype.getObjectFit = function() {
      var _a, _b, _c, _d;
      if (this.props.objectFit === "cover") {
        var mediaRef = this.imageRef.current || this.videoRef.current;
        if (mediaRef && this.containerRef) {
          this.containerRect = this.containerRef.getBoundingClientRect();
          var containerAspect = this.containerRect.width / this.containerRect.height;
          var naturalWidth = ((_a = this.imageRef.current) === null || _a === void 0 ? void 0 : _a.naturalWidth) || ((_b = this.videoRef.current) === null || _b === void 0 ? void 0 : _b.videoWidth) || 0;
          var naturalHeight = ((_c = this.imageRef.current) === null || _c === void 0 ? void 0 : _c.naturalHeight) || ((_d = this.videoRef.current) === null || _d === void 0 ? void 0 : _d.videoHeight) || 0;
          var mediaAspect = naturalWidth / naturalHeight;
          return mediaAspect < containerAspect ? "horizontal-cover" : "vertical-cover";
        }
        return "horizontal-cover";
      }
      return this.props.objectFit;
    };
    Cropper2.prototype.onPinchStart = function(e) {
      var pointA = Cropper2.getTouchPoint(e.touches[0]);
      var pointB = Cropper2.getTouchPoint(e.touches[1]);
      this.lastPinchDistance = getDistanceBetweenPoints(pointA, pointB);
      this.lastPinchRotation = getRotationBetweenPoints(pointA, pointB);
      this.onDragStart(getCenter(pointA, pointB));
    };
    Cropper2.prototype.onPinchMove = function(e) {
      var _this = this;
      if (!this.currentDoc || !this.currentWindow) return;
      var pointA = Cropper2.getTouchPoint(e.touches[0]);
      var pointB = Cropper2.getTouchPoint(e.touches[1]);
      var center = getCenter(pointA, pointB);
      this.onDrag(center);
      if (this.rafPinchTimeout) this.currentWindow.cancelAnimationFrame(this.rafPinchTimeout);
      this.rafPinchTimeout = this.currentWindow.requestAnimationFrame(function() {
        var distance = getDistanceBetweenPoints(pointA, pointB);
        var newZoom = _this.props.zoom * (distance / _this.lastPinchDistance);
        _this.setNewZoom(newZoom, center, {
          shouldUpdatePosition: false
        });
        _this.lastPinchDistance = distance;
        var rotation = getRotationBetweenPoints(pointA, pointB);
        var newRotation = _this.props.rotation + (rotation - _this.lastPinchRotation);
        _this.props.onRotationChange && _this.props.onRotationChange(newRotation);
        _this.lastPinchRotation = rotation;
      });
    };
    Cropper2.prototype.render = function() {
      var _this = this;
      var _a;
      var _b = this.props, image = _b.image, video = _b.video, mediaProps = _b.mediaProps, transform = _b.transform, _c = _b.crop, x = _c.x, y = _c.y, rotation = _b.rotation, zoom = _b.zoom, cropShape = _b.cropShape, showGrid = _b.showGrid, _d = _b.style, containerStyle = _d.containerStyle, cropAreaStyle = _d.cropAreaStyle, mediaStyle = _d.mediaStyle, _e = _b.classes, containerClassName = _e.containerClassName, cropAreaClassName = _e.cropAreaClassName, mediaClassName = _e.mediaClassName;
      var objectFit = (_a = this.state.mediaObjectFit) !== null && _a !== void 0 ? _a : this.getObjectFit();
      return React.createElement("div", {
        onMouseDown: this.onMouseDown,
        onTouchStart: this.onTouchStart,
        ref: function ref(el) {
          return _this.containerRef = el;
        },
        "data-testid": "container",
        style: containerStyle,
        className: classNames("reactEasyCrop_Container", containerClassName)
      }, image ? React.createElement("img", __assign({
        alt: "",
        className: classNames("reactEasyCrop_Image", objectFit === "contain" && "reactEasyCrop_Contain", objectFit === "horizontal-cover" && "reactEasyCrop_Cover_Horizontal", objectFit === "vertical-cover" && "reactEasyCrop_Cover_Vertical", mediaClassName)
      }, mediaProps, {
        src: image,
        ref: this.imageRef,
        style: __assign(__assign({}, mediaStyle), {
          transform: transform || "translate(".concat(x, "px, ").concat(y, "px) rotate(").concat(rotation, "deg) scale(").concat(zoom, ")")
        }),
        onLoad: this.onMediaLoad
      })) : video && React.createElement("video", __assign({
        autoPlay: true,
        playsInline: true,
        loop: true,
        muted: true,
        className: classNames("reactEasyCrop_Video", objectFit === "contain" && "reactEasyCrop_Contain", objectFit === "horizontal-cover" && "reactEasyCrop_Cover_Horizontal", objectFit === "vertical-cover" && "reactEasyCrop_Cover_Vertical", mediaClassName)
      }, mediaProps, {
        ref: this.videoRef,
        onLoadedMetadata: this.onMediaLoad,
        style: __assign(__assign({}, mediaStyle), {
          transform: transform || "translate(".concat(x, "px, ").concat(y, "px) rotate(").concat(rotation, "deg) scale(").concat(zoom, ")")
        }),
        controls: false
      }), (Array.isArray(video) ? video : [{
        src: video
      }]).map(function(item) {
        return React.createElement("source", __assign({
          key: item.src
        }, item));
      })), this.state.cropSize && React.createElement("div", {
        style: __assign(__assign({}, cropAreaStyle), {
          width: this.state.cropSize.width,
          height: this.state.cropSize.height
        }),
        tabIndex: 0,
        onKeyDown: this.onKeyDown,
        "data-testid": "cropper",
        className: classNames("reactEasyCrop_CropArea", cropShape === "round" && "reactEasyCrop_CropAreaRound", showGrid && "reactEasyCrop_CropAreaGrid", cropAreaClassName)
      }));
    };
    Cropper2.defaultProps = {
      zoom: 1,
      rotation: 0,
      aspect: 4 / 3,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      cropShape: "rect",
      objectFit: "contain",
      showGrid: true,
      style: {},
      classes: {},
      mediaProps: {},
      zoomSpeed: 1,
      restrictPosition: true,
      zoomWithScroll: true,
      keyboardStep: KEYBOARD_STEP
    };
    Cropper2.getMousePoint = function(e) {
      return {
        x: Number(e.clientX),
        y: Number(e.clientY)
      };
    };
    Cropper2.getTouchPoint = function(touch) {
      return {
        x: Number(touch.clientX),
        y: Number(touch.clientY)
      };
    };
    return Cropper2;
  }(React.Component)
);
export {
  Cropper as default,
  getInitialCropFromCroppedAreaPercentages,
  getInitialCropFromCroppedAreaPixels
};
/*! Bundled license information:

normalize-wheel/src/isEventSupported.js:
  (**
   * Checks if an event is supported in the current execution environment.
   *
   * NOTE: This will not work correctly for non-generic events such as `change`,
   * `reset`, `load`, `error`, and `select`.
   *
   * Borrows from Modernizr.
   *
   * @param {string} eventNameSuffix Event name, e.g. "click".
   * @param {?boolean} capture Check if the capture phase is supported.
   * @return {boolean} True if the event is supported.
   * @internal
   * @license Modernizr 3.0.0pre (Custom Build) | MIT
   *)
*/
//# sourceMappingURL=react-easy-crop.js.map
