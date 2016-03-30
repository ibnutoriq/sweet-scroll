/*!
 * sweet-scroll
 * Modern and the sweet smooth scroll library.
 * 
 * @author tsuyoshiwada
 * @homepage https://github.com/tsuyoshiwada/sweet-scroll
 * @license MIT
 * @version 0.3.1
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.SweetScroll = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var classTypeList = ["Boolean", "Number", "String", "Function", "Array", "Object"];
  var classTypes = {};

  classTypeList.forEach(function (name) {
    classTypes["[object " + name + "]"] = name.toLowerCase();
  });

  function getType(obj) {
    if (obj == null) {
      return obj + "";
    }
    return (typeof obj === "undefined" ? "undefined" : babelHelpers.typeof(obj)) === "object" || typeof obj === "function" ? classTypes[Object.prototype.toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : babelHelpers.typeof(obj);
  }

  function isArray(obj) {
    return Array.isArray(obj);
  }

  function isArrayLike(obj) {
    var length = obj == null ? null : obj.length;
    return isNumber(length) && length >= 0 && length <= MAX_ARRAY_INDEX;
  }

  function isObject(obj) {
    return !isArray(obj) && getType(obj) === "object";
  }

  function isNumber(obj) {
    return getType(obj) === "number";
  }

  function isString(obj) {
    return getType(obj) === "string";
  }

  function isFunction(obj) {
    return getType(obj) === "function";
  }

  function isNumeric(obj) {
    return !isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
  }

  function hasProp(obj, key) {
    return obj && obj.hasOwnProperty(key);
  }

  function merge(obj) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    each(sources, function (source) {
      each(source, function (value, key) {
        obj[key] = value;
      });
    });
    return obj;
  }

  function each(obj, iterate, context) {
    if (obj == null) return obj;

    context = context || obj;

    if (isObject(obj)) {
      for (var key in obj) {
        if (!hasProp(obj, key)) continue;
        if (iterate.call(context, obj[key], key) === false) break;
      }
    } else if (isArrayLike(obj)) {
      var i = void 0,
          length = obj.length;
      for (i = 0; i < length; i++) {
        if (iterate.call(context, obj[i], i) === false) break;
      }
    }

    return obj;
  }

  function removeSpaces(str) {
    return str.replace(/\s*/g, "") || "";
  }

  function $(selector) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    if (!selector) return;
    return (context == null ? document : context).querySelector(selector);
  }

  function $$(selector) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    if (!selector) return;
    return (context == null ? document : context).querySelectorAll(selector);
  }

  function matches(el, selector) {
    var matches = (el.document || el.ownerDocument).querySelectorAll(selector);
    var i = matches.length;
    while (--i >= 0 && matches.item(i) !== el) {}
    return i > -1;
  }

  var directionMethodMap = {
    y: "scrollTop",
    x: "scrollLeft"
  };

  var directionPropMap = {
    y: "pageYOffset",
    x: "pageXOffset"
  };

  function isRootContainer(el) {
    var doc = document;
    return el === doc.documentElement || el === doc.body;
  }

  function getScrollable(selectors) {
    var direction = arguments.length <= 1 || arguments[1] === undefined ? "y" : arguments[1];
    var all = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var method = directionMethodMap[direction];
    var elements = selectors instanceof HTMLElement ? [selectors] : $$(selectors);
    var scrollables = [];
    var $div = document.createElement("div");

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];

      if (el[method] > 0) {
        scrollables.push(el);
      } else {
        $div.style.width = el.clientWidth + 1 + "px";
        $div.style.height = el.clientHeight + 1 + "px";
        el.appendChild($div);

        el[method] = 1;
        if (el[method] > 0) {
          scrollables.push(el);
        }
        el[method] = 0;

        el.removeChild($div);
      }

      if (!all && scrollables.length > 0) break;
    }

    return scrollables;
  }

  function scrollableFind(selectors, direction) {
    var scrollables = getScrollable(selectors, direction, false);
    return scrollables.length >= 1 ? scrollables[0] : undefined;
  }

  function getWindow(el) {
    return el != null && el === el.window ? el : el.nodeType === 9 && el.defaultView;
  }

  function getScroll(el) {
    var direction = arguments.length <= 1 || arguments[1] === undefined ? "y" : arguments[1];

    var method = directionMethodMap[direction];
    var prop = directionPropMap[direction];
    var win = getWindow(el);
    return win ? win[prop] : el[method];
  }

  function setScroll(el, offset) {
    var direction = arguments.length <= 2 || arguments[2] === undefined ? "y" : arguments[2];

    var method = directionMethodMap[direction];
    var win = getWindow(el);
    var top = direction === "y";
    if (win) {
      win.scrollTo(!top ? offset : win.pageXOffset, top ? offset : win.pageYOffset);
    } else {
      el[method] = offset;
    }
  }

  function getOffset(el) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    if (!el || el && !el.getClientRects().length) {
      return { top: 0, left: 0 };
    }
    var rect = el.getBoundingClientRect();
    if (rect.width || rect.height) {
      var scroll = {};
      var ctx = void 0;
      if (context == null || isRootContainer(context)) {
        ctx = el.ownerDocument.documentElement;
        scroll.top = window.pageYOffset;
        scroll.left = window.pageXOffset;
      } else {
        ctx = context;
        var ctxRect = ctx.getBoundingClientRect();
        scroll.top = ctxRect.top * -1 + ctx.scrollTop;
        scroll.left = ctxRect.left * -1 + ctx.scrollLeft;
      }
      return {
        top: rect.top + scroll.top - ctx.clientTop,
        left: rect.left + scroll.left - ctx.clientLeft
      };
    }
    return rect;
  }

  function addEvent(el, event, listener) {
    var events = event.split(",");
    events.forEach(function (eventName) {
      el.addEventListener(eventName.trim(), listener, false);
    });
  }

  function removeEvent(el, event, listener) {
    var events = event.split(",");
    events.forEach(function (eventName) {
      el.removeEventListener(eventName.trim(), listener, false);
    });
  }

  var math = Math;
  var mathCos = math.cos;
  var mathSin = math.sin;
  var mathPow = math.pow;
  var mathAbs = math.abs;
  var mathSqrt = math.sqrt;
  var mathAsin = math.asin;
  var PI = math.PI;

  function linear(p) {
    return p;
  }

  function InQuad(x, t, b, c, d) {
    return c * (t /= d) * t + b;
  }

  function OutQuad(x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  }

  function InOutQuad(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
    }
    return -c / 2 * (--t * (t - 2) - 1) + b;
  }

  function InCubic(x, t, b, c, d) {
    return c * (t /= d) * t * t + b;
  }

  function OutCubic(x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  }

  function InOutCubic(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  }

  function InQuart(x, t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  }

  function OutQuart(x, t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  }

  function InOutQuart(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t + b;
    }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  }

  function InQuint(x, t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  }

  function OutQuint(x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  }

  function InOutQuint(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  }

  function InSine(x, t, b, c, d) {
    return -c * mathCos(t / d * (PI / 2)) + c + b;
  }

  function OutSine(x, t, b, c, d) {
    return c * mathSin(t / d * (PI / 2)) + b;
  }

  function InOutSine(x, t, b, c, d) {
    return -c / 2 * (mathCos(PI * t / d) - 1) + b;
  }

  function InExpo(x, t, b, c, d) {
    return t === 0 ? b : c * mathPow(2, 10 * (t / d - 1)) + b;
  }

  function OutExpo(x, t, b, c, d) {
    return t === d ? b + c : c * (-mathPow(2, -10 * t / d) + 1) + b;
  }

  function InOutExpo(x, t, b, c, d) {
    if (t === 0) return b;
    if (t === d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * mathPow(2, 10 * (t - 1)) + b;
    return c / 2 * (-mathPow(2, -10 * --t) + 2) + b;
  }

  function InCirc(x, t, b, c, d) {
    return -c * (mathSqrt(1 - (t /= d) * t) - 1) + b;
  }

  function OutCirc(x, t, b, c, d) {
    return c * mathSqrt(1 - (t = t / d - 1) * t) + b;
  }

  function InOutCirc(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return -c / 2 * (mathSqrt(1 - t * t) - 1) + b;
    }
    return c / 2 * (mathSqrt(1 - (t -= 2) * t) + 1) + b;
  }

  function InElastic(x, t, b, c, d) {
    var s = 1.70158,
        p = 0,
        a = c;
    if (t === 0) return b;
    if ((t /= d) === 1) return b + c;
    if (!p) p = d * .3;
    if (a < mathAbs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * PI) * mathAsin(c / a);
    }
    return -(a * mathPow(2, 10 * (t -= 1)) * mathSin((t * d - s) * (2 * PI) / p)) + b;
  }

  function OutElastic(x, t, b, c, d) {
    var s = 1.70158,
        p = 0,
        a = c;
    if (t === 0) return b;
    if ((t /= d) === 1) return b + c;
    if (!p) p = d * .3;
    if (a < mathAbs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * PI) * mathAsin(c / a);
    }
    return a * mathPow(2, -10 * t) * mathSin((t * d - s) * (2 * PI) / p) + c + b;
  }

  function InOutElastic(x, t, b, c, d) {
    var s = 1.70158,
        p = 0,
        a = c;
    if (t === 0) return b;
    if ((t /= d / 2) === 2) return b + c;
    if (!p) p = d * (.3 * 1.5);
    if (a < mathAbs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * PI) * mathAsin(c / a);
    }
    if (t < 1) {
      return -.5 * (a * mathPow(2, 10 * (t -= 1)) * mathSin((t * d - s) * (2 * PI) / p)) + b;
    }
    return a * mathPow(2, -10 * (t -= 1)) * mathSin((t * d - s) * (2 * PI) / p) * .5 + c + b;
  }

  function InBack(x, t, b, c, d) {
    var s = arguments.length <= 5 || arguments[5] === undefined ? 1.70158 : arguments[5];

    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  }

  function OutBack(x, t, b, c, d) {
    var s = arguments.length <= 5 || arguments[5] === undefined ? 1.70158 : arguments[5];

    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  }

  function InOutBack(x, t, b, c, d) {
    var s = arguments.length <= 5 || arguments[5] === undefined ? 1.70158 : arguments[5];

    if ((t /= d / 2) < 1) {
      return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
    }
    return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
  }

  function InBounce(x, t, b, c, d) {
    return c - OutBounce(x, d - t, 0, c, d) + b;
  }

  function OutBounce(x, t, b, c, d) {
    if ((t /= d) < 1 / 2.75) {
      return c * (7.5625 * t * t) + b;
    } else if (t < 2 / 2.75) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
    } else if (t < 2.5 / 2.75) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
    } else {
      return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
    }
  }

  function InOutBounce(x, t, b, c, d) {
    if (t < d / 2) {
      return InBounce(x, t * 2, 0, c, d) * .5 + b;
    }
    return OutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
  }

var Easing = Object.freeze({
    linear: linear,
    InQuad: InQuad,
    OutQuad: OutQuad,
    InOutQuad: InOutQuad,
    InCubic: InCubic,
    OutCubic: OutCubic,
    InOutCubic: InOutCubic,
    InQuart: InQuart,
    OutQuart: OutQuart,
    InOutQuart: InOutQuart,
    InQuint: InQuint,
    OutQuint: OutQuint,
    InOutQuint: InOutQuint,
    InSine: InSine,
    OutSine: OutSine,
    InOutSine: InOutSine,
    InExpo: InExpo,
    OutExpo: OutExpo,
    InOutExpo: InOutExpo,
    InCirc: InCirc,
    OutCirc: OutCirc,
    InOutCirc: InOutCirc,
    InElastic: InElastic,
    OutElastic: OutElastic,
    InOutElastic: InOutElastic,
    InBack: InBack,
    OutBack: OutBack,
    InOutBack: InOutBack,
    InBounce: InBounce,
    OutBounce: OutBounce,
    InOutBounce: InOutBounce
  });

  var lastTime = 0;

  var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    var currentTime = Date.now();
    var timeToCall = Math.max(0, 16 - (currentTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currentTime + timeToCall);
    }, timeToCall);
    lastTime = currentTime + timeToCall;
    return id;
  };

  var ScrollTween = function () {
    function ScrollTween(el) {
      babelHelpers.classCallCheck(this, ScrollTween);

      this.el = el;
      this.props = {};
      this.progress = false;
      this.startTime = null;
    }

    babelHelpers.createClass(ScrollTween, [{
      key: "run",
      value: function run(x, y, duration, delay, easing) {
        var _this = this;

        var callback = arguments.length <= 5 || arguments[5] === undefined ? function () {} : arguments[5];

        if (this.progress) return;
        this.props = { x: x, y: y };
        this.duration = duration;
        this.delay = delay;
        this.easing = easing.replace("ease", "");
        this.callback = callback;
        this.progress = true;

        setTimeout(function () {
          _this.startProps = {
            x: getScroll(_this.el, "x"),
            y: getScroll(_this.el, "y")
          };
          raf(function (time) {
            return _this._loop(time);
          });
        }, delay);
      }
    }, {
      key: "stop",
      value: function stop() {
        var gotoEnd = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

        this.startTime = null;
        this.progress = false;

        if (gotoEnd) {
          setScroll(this.el, this.props.x, "x");
          setScroll(this.el, this.props.y, "y");
        }

        if (isFunction(this.callback)) {
          this.callback();
          this.callback = null;
        }
      }
    }, {
      key: "_loop",
      value: function _loop(time) {
        var _this2 = this;

        if (!this.startTime) {
          this.startTime = time;
        }

        if (!this.progress) {
          this.stop(false);
          return;
        }

        var el = this.el;
        var props = this.props;
        var duration = this.duration;
        var startTime = this.startTime;
        var startProps = this.startProps;

        var toProps = {};
        var easing = Easing[this.easing];
        var timeElapsed = time - startTime;
        var t = Math.min(1, Math.max(timeElapsed / duration, 0));

        each(props, function (value, key) {
          var initialValue = startProps[key];
          var delta = value - initialValue;
          if (delta === 0) return true;

          var val = easing(t, duration * t, 0, 1, duration);
          toProps[key] = Math.round(initialValue + delta * val);
        });

        each(toProps, function (value, key) {
          setScroll(el, value, key);
        });

        timeElapsed <= duration ? raf(function (time) {
          return _this2._loop(time);
        }) : this.stop(true);
      }
    }]);
    return ScrollTween;
  }();

  var win = window;
  var doc = document;
  var WHEEL_EVENT = "onwheel" in doc ? "wheel" : "onmousewheel" in doc ? "mousewheel" : "DOMMouseScroll";
  var CONTAINER_STOP_EVENTS = WHEEL_EVENT + ", touchstart, touchmove";
  var DOM_CONTENT_LOADED = "DOMContentLoaded";
  var isDomContentLoaded = false;

  addEvent(doc, DOM_CONTENT_LOADED, function () {
    isDomContentLoaded = true;
  });

  var SweetScroll = function () {

    /**
     * SweetScroll constructor
     * @param {Object}
     * @param {String} | {HTMLElement}
     */

    function SweetScroll() {
      var _this = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var container = arguments.length <= 1 || arguments[1] === undefined ? "body, html" : arguments[1];
      babelHelpers.classCallCheck(this, SweetScroll);

      var params = merge({}, SweetScroll.defaults, options);
      this.options = params;
      this.getContainer(container, function (target) {
        _this.container = target;
        _this.header = $(params.header);
        _this.tween = new ScrollTween(target);
        _this._trigger = null;
        _this._shouldCallCancelScroll = false;
        _this.bindContainerClick();
        _this.initialized();
        _this.hook(params.initialized);
      });
    }

    /**
     * Scroll animation to the specified position
     * @param {Any}
     * @param {Object}
     * @return {Void}
     */


    // Default options


    babelHelpers.createClass(SweetScroll, [{
      key: "to",
      value: function to(distance) {
        var _this2 = this;

        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var container = this.container;
        var header = this.header;

        var params = merge({}, this.options, options);
        var offset = this.parseCoodinate(params.offset);
        var trigger = this._trigger;
        var scroll = this.parseCoodinate(distance);

        // Remove the triggering elements which has been temporarily retained
        this._trigger = null;

        // Disable the call flag of `cancelScroll`
        this._shouldCallCancelScroll = false;

        // Stop current animation
        this.stop();

        // Does not move if the container is not found
        if (!container) return;

        // Using the coordinates in the case of CSS Selector
        if (!scroll && isString(distance)) {
          if (distance === "#") {
            scroll = { top: 0, left: 0 };
          } else if (!/[:,]/.test(distance)) {
            var target = $(distance);
            var targetOffset = getOffset(target, container);
            if (!targetOffset) return;
            scroll = targetOffset;
          }
        }

        if (!scroll) return;

        // Apply `offset` value
        if (offset) {
          scroll.top += offset.top;
          scroll.left += offset.left;
        }

        // If the header is present apply the height
        if (header) {
          scroll.top = Math.max(0, scroll.top - this.header.clientHeight);
        }

        // Determine the final scroll coordinates
        var frameSize = void 0;
        var size = void 0;
        if (isRootContainer(container)) {
          frameSize = { width: win.innerWidth, height: win.innerHeight };
          size = { width: doc.body.scrollWidth, height: doc.body.scrollHeight };
        } else {
          frameSize = { width: container.clientWidth, height: container.clientHeight };
          size = { width: container.scrollWidth, height: container.scrollHeight };
        }

        // Call `beforeScroll`
        // Stop scrolling when it returns false
        if (this.hook(params.beforeScroll, scroll, trigger) === false || this.beforeScroll(scroll, trigger) === false) {
          return;
        }

        // Adjustment of the maximum value
        // vertical
        if (params.verticalScroll) {
          scroll.top = Math.max(0, Math.min(size.height - frameSize.height, scroll.top));
        } else {
          scroll.top = getScroll(container, "y");
        }

        // horizontal
        if (params.horizontalScroll) {
          scroll.left = Math.max(0, Math.min(size.width - frameSize.width, scroll.left));
        } else {
          scroll.left = getScroll(container, "x");
        }

        // Run the animation!!
        this.tween.run(scroll.left, scroll.top, params.duration, params.delay, params.easing, function () {
          // Unbind the scroll stop events, And call `afterScroll` or `cancelScroll`
          _this2.unbindContainerStop();
          if (_this2._shouldCallCancelScroll) {
            _this2.hook(params.cancelScroll);
            _this2.cancelScroll();
          } else {
            _this2.hook(params.afterScroll, scroll, trigger);
            _this2.afterScroll(scroll, trigger);
          }
        });

        // Bind the scroll stop events
        this.bindContainerStop();
      }

      /**
       * Scroll animation to the specified top position
       * @param {Any}
       * @param {Object}
       * @return {Void}
       */

    }, {
      key: "toTop",
      value: function toTop(distance) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.to(distance, merge({}, options, {
          verticalScroll: true,
          horizontalScroll: false
        }));
      }

      /**
       * Scroll animation to the specified left position
       * @param {Any}
       * @param {Object}
       * @return {Void}
       */

    }, {
      key: "toLeft",
      value: function toLeft(distance) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.to(distance, merge({}, options, {
          verticalScroll: false,
          horizontalScroll: true
        }));
      }

      /**
       * Scroll animation to the specified element
       * @param {HTMLElement}
       * @param {Object}
       * @return {Void}
       */

    }, {
      key: "toElement",
      value: function toElement($el) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if ($el instanceof HTMLElement) {
          var offset = getOffset($el, this.container);
          this.to(offset, merge({}, options));
        }
      }

      /**
       * Stop the current animation
       * @param {Boolean}
       * @return {Void}
       */

    }, {
      key: "stop",
      value: function stop() {
        var gotoEnd = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        if (this._stopScrollListener) {
          this._shouldCallCancelScroll = true;
        }
        this.tween.stop(gotoEnd);
      }

      /**
       * Update the instance
       * @param {Object}
       * @return {Void}
       */

    }, {
      key: "update",
      value: function update() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        this.stop();
        this.unbindContainerClick();
        this.unbindContainerStop();
        this.options = merge({}, this.options, options);
        this.header = $(this.options.header);
        this.bindContainerClick();
      }

      /**
       * Destroy SweetScroll instance
       * @param {Boolean}
       * @return {Void}
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this.stop();
        this.unbindContainerClick();
        this.unbindContainerStop();
        this.container = null;
        this.header = null;
        this.tween = null;
      }

      /**
       * Called at after of the initialize.
       * @return {Void}
       */

    }, {
      key: "initialized",
      value: function initialized() {}

      /**
       * Called at before of the scroll.
       * @param {Object}
       * @param {HTMLElement}
       * @return {Boolean}
       */

    }, {
      key: "beforeScroll",
      value: function beforeScroll(toScroll, trigger) {
        return true;
      }

      /**
       * Called at cancel of the scroll.
       * @return {Void}
       */

    }, {
      key: "cancelScroll",
      value: function cancelScroll() {}

      /**
       * Called at after of the scroll.
       * @param {Object}
       * @param {HTMLElement}
       * @return {Void}
       */

    }, {
      key: "afterScroll",
      value: function afterScroll(toScroll, trigger) {}

      /**
       * Parse the value of coordinate
       * @param {Any}
       * @return {Object}
       */

    }, {
      key: "parseCoodinate",
      value: function parseCoodinate(coodinate) {
        var enableTop = this.options.verticalScroll;
        var scroll = { top: 0, left: 0 };

        // Object
        if (hasProp(coodinate, "top") || hasProp(coodinate, "left")) {
          scroll = merge(scroll, coodinate);

          // Array
        } else if (isArray(coodinate)) {
            if (coodinate.length === 2) {
              scroll.top = coodinate[0];
              scroll.left = coodinate[1];
            } else {
              scroll.top = enableTop ? coodinate[0] : 0;
              scroll.left = !enableTop ? coodinate[0] : 0;
            }

            // Number
          } else if (isNumeric(coodinate)) {
              scroll.top = enableTop ? coodinate : 0;
              scroll.left = !enableTop ? coodinate : 0;

              // String
            } else if (isString(coodinate)) {
                coodinate = removeSpaces(coodinate);

                // "{n},{n}" (Array like syntax)
                if (/^\d+,\d+$/.test(coodinate)) {
                  coodinate = coodinate.split(",");
                  scroll.top = coodinate[0];
                  scroll.left = coodinate[1];

                  // "top:{n}, left:{n}" (Object like syntax)
                } else if (/^(top|left):\d+,?(?:(top|left):\d+)?$/.test(coodinate)) {
                    var top = coodinate.match(/top:(\d+)/);
                    var left = coodinate.match(/left:(\d+)/);
                    scroll.top = top ? top[1] : 0;
                    scroll.left = left ? left[1] : 0;

                    // "+={n}", "-={n}" (Relative position)
                  } else if (this.container && /^(\+|-)=(\d+)$/.test(coodinate)) {
                      var current = getScroll(this.container, enableTop ? "y" : "x");
                      var _matches = coodinate.match(/^(\+|-)\=(\d+)$/);
                      var op = _matches[1];
                      var value = parseInt(_matches[2], 10);
                      if (op === "+") {
                        scroll.top = enableTop ? current + value : 0;
                        scroll.left = !enableTop ? current + value : 0;
                      } else {
                        scroll.top = enableTop ? current - value : 0;
                        scroll.left = !enableTop ? current - value : 0;
                      }
                    } else {
                      return null;
                    }
              } else {
                return null;
              }

        scroll.top = parseInt(scroll.top, 10);
        scroll.left = parseInt(scroll.left, 10);

        return scroll;
      }

      /**
       * Get the container for the scroll, depending on the options.
       * @param {String} | {HTMLElement}
       * @param {Function}
       * @return {Void}
       * @private
       */

    }, {
      key: "getContainer",
      value: function getContainer(selector, callback) {
        var _this3 = this;

        var _options = this.options;
        var verticalScroll = _options.verticalScroll;
        var horizontalScroll = _options.horizontalScroll;

        var container = void 0;

        if (verticalScroll) {
          container = scrollableFind(selector, "y");
        }

        if (!container && horizontalScroll) {
          container = scrollableFind(selector, "x");
        }

        if (!container && !isDomContentLoaded) {
          addEvent(doc, DOM_CONTENT_LOADED, function () {
            _this3.getContainer(selector, callback);
          });
        } else {
          callback.call(this, container);
        }
      }

      /**
       * Bind a click event to the container
       * @return {Void}
       * @private
       */

    }, {
      key: "bindContainerClick",
      value: function bindContainerClick() {
        var container = this.container;

        if (!container) return;
        this._containerClickListener = this.handleContainerClick.bind(this);
        addEvent(container, "click", this._containerClickListener);
      }

      /**
       * Unbind a click event to the container
       * @return {Void}
       * @private
       */

    }, {
      key: "unbindContainerClick",
      value: function unbindContainerClick() {
        var container = this.container;

        if (!container || !this._containerClickListener) return;
        removeEvent(container, "click", this._containerClickListener);
        this._containerClickListener = null;
      }

      /**
       * Bind the scroll stop of events
       * @return {Void}
       * @private
       */

    }, {
      key: "bindContainerStop",
      value: function bindContainerStop() {
        var container = this.container;

        if (!container) return;
        this._stopScrollListener = this.handleStopScroll.bind(this);
        addEvent(container, CONTAINER_STOP_EVENTS, this._stopScrollListener);
      }

      /**
       * Unbind the scroll stop of events
       * @return {Void}
       * @private
       */

    }, {
      key: "unbindContainerStop",
      value: function unbindContainerStop() {
        var container = this.container;

        if (!container || !this._stopScrollListener) return;
        removeEvent(container, CONTAINER_STOP_EVENTS, this._stopScrollListener);
        this._stopScrollListener = null;
      }

      /**
       * Call the specified callback
       * @param {Function}
       * @param {...Any}
       * @return {Void}
       * @private
       */

    }, {
      key: "hook",
      value: function hook(callback) {
        if (isFunction(callback)) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          return callback.apply(this, args);
        }
      }

      /**
       * Handling of scroll stop event
       * @param {Event}
       * @return {Void}
       * @private
       */

    }, {
      key: "handleStopScroll",
      value: function handleStopScroll(e) {
        if (this.options.stopScroll) {
          this.stop();
        } else {
          e.preventDefault();
        }
      }

      /**
       * Handling of container click event
       * @param {Event}
       * @return {Void}
       * @private
       */

    }, {
      key: "handleContainerClick",
      value: function handleContainerClick(e) {
        var options = this.options;

        var el = e.target;

        // Explore parent element until the trigger selector matches
        for (; el && el !== doc; el = el.parentNode) {
          if (!matches(el, options.trigger)) continue;
          var data = el.getAttribute("data-scroll");
          var dataOptions = this.parseDataOptions(el);
          var href = data || el.getAttribute("href");

          options = merge({}, options, dataOptions);

          e.preventDefault();
          e.stopPropagation();

          // Passes the trigger elements to callback
          this._trigger = el;

          if (options.horizontalScroll && options.verticalScroll) {
            this.to(href, options);
          } else if (options.verticalScroll) {
            this.toTop(href, options);
          } else if (options.horizontalScroll) {
            this.toLeft(href, options);
          }
        }
      }

      /**
       * Parse the data-scroll-options attribute
       * @param {HTMLElement}
       * @return {Object}
       * @private
       */

    }, {
      key: "parseDataOptions",
      value: function parseDataOptions(el) {
        var options = el.getAttribute("data-scroll-options");
        return options ? JSON.parse(options) : {};
      }
    }]);
    return SweetScroll;
  }();

  // Export SweetScroll class


  SweetScroll.defaults = {
    trigger: "[data-scroll]", // Selector for trigger (must be a valid css selector)
    header: "[data-scroll-header]", // Selector for fixed header (must be a valid css selector)
    duration: 1000, // Specifies animation duration in integer
    delay: 0, // Specifies timer for delaying the execution of the scroll in milliseconds
    easing: "easeOutQuint", // Specifies the pattern of easing
    offset: 0, // Specifies the value to offset the scroll position in pixels
    verticalScroll: true, // Enable the vertical scroll
    horizontalScroll: false, // Enable the horizontal scroll
    stopScroll: true, // When fired wheel or touchstart events to stop scrolling

    // Callbacks
    initialized: null,
    beforeScroll: null,
    afterScroll: null,
    cancelScroll: null
  };

  return SweetScroll;

}));