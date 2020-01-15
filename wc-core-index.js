!(function(t, e) {
    'object' == typeof exports && 'object' == typeof module
        ? (module.exports = e())
        : 'function' == typeof define && define.amd
        ? define('Connector', [], e)
        : 'object' == typeof exports
        ? (exports.Connector = e())
        : (t.Connector = e());
})(this, function() {
    return (function(t) {
        var e = {};
        function r(n) {
            if (e[n]) return e[n].exports;
            var i = (e[n] = { i: n, l: !1, exports: {} });
            return t[n].call(i.exports, i, i.exports, r), (i.l = !0), i.exports;
        }
        return (
            (r.m = t),
            (r.c = e),
            (r.d = function(t, e, n) {
                r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
            }),
            (r.r = function(t) {
                'undefined' != typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
                    Object.defineProperty(t, '__esModule', { value: !0 });
            }),
            (r.t = function(t, e) {
                if ((1 & e && (t = r(t)), 8 & e)) return t;
                if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
                var n = Object.create(null);
                if (
                    (r.r(n),
                    Object.defineProperty(n, 'default', { enumerable: !0, value: t }),
                    2 & e && 'string' != typeof t)
                )
                    for (var i in t)
                        r.d(
                            n,
                            i,
                            function(e) {
                                return t[e];
                            }.bind(null, i)
                        );
                return n;
            }),
            (r.n = function(t) {
                var e =
                    t && t.__esModule
                        ? function() {
                              return t.default;
                          }
                        : function() {
                              return t;
                          };
                return r.d(e, 'a', e), e;
            }),
            (r.o = function(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e);
            }),
            (r.p = ''),
            r((r.s = 2))
        );
    })([
        function(t, e, r) {
            'use strict';
            r.r(e),
                r.d(e, '__extends', function() {
                    return i;
                }),
                r.d(e, '__assign', function() {
                    return o;
                }),
                r.d(e, '__rest', function() {
                    return s;
                }),
                r.d(e, '__decorate', function() {
                    return u;
                }),
                r.d(e, '__param', function() {
                    return a;
                }),
                r.d(e, '__metadata', function() {
                    return h;
                }),
                r.d(e, '__awaiter', function() {
                    return f;
                }),
                r.d(e, '__generator', function() {
                    return c;
                }),
                r.d(e, '__exportStar', function() {
                    return l;
                }),
                r.d(e, '__values', function() {
                    return p;
                }),
                r.d(e, '__read', function() {
                    return d;
                }),
                r.d(e, '__spread', function() {
                    return g;
                }),
                r.d(e, '__spreadArrays', function() {
                    return m;
                }),
                r.d(e, '__await', function() {
                    return v;
                }),
                r.d(e, '__asyncGenerator', function() {
                    return y;
                }),
                r.d(e, '__asyncDelegator', function() {
                    return w;
                }),
                r.d(e, '__asyncValues', function() {
                    return b;
                }),
                r.d(e, '__makeTemplateObject', function() {
                    return _;
                }),
                r.d(e, '__importStar', function() {
                    return M;
                }),
                r.d(e, '__importDefault', function() {
                    return E;
                });
            /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
            var n = function(t, e) {
                return (n =
                    Object.setPrototypeOf ||
                    ({ __proto__: [] } instanceof Array &&
                        function(t, e) {
                            t.__proto__ = e;
                        }) ||
                    function(t, e) {
                        for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
                    })(t, e);
            };
            function i(t, e) {
                function r() {
                    this.constructor = t;
                }
                n(t, e),
                    (t.prototype =
                        null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
            }
            var o = function() {
                return (o =
                    Object.assign ||
                    function(t) {
                        for (var e, r = 1, n = arguments.length; r < n; r++)
                            for (var i in (e = arguments[r]))
                                Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                        return t;
                    }).apply(this, arguments);
            };
            function s(t, e) {
                var r = {};
                for (var n in t)
                    Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
                if (null != t && 'function' == typeof Object.getOwnPropertySymbols) {
                    var i = 0;
                    for (n = Object.getOwnPropertySymbols(t); i < n.length; i++)
                        e.indexOf(n[i]) < 0 &&
                            Object.prototype.propertyIsEnumerable.call(t, n[i]) &&
                            (r[n[i]] = t[n[i]]);
                }
                return r;
            }
            function u(t, e, r, n) {
                var i,
                    o = arguments.length,
                    s = o < 3 ? e : null === n ? (n = Object.getOwnPropertyDescriptor(e, r)) : n;
                if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
                    s = Reflect.decorate(t, e, r, n);
                else
                    for (var u = t.length - 1; u >= 0; u--)
                        (i = t[u]) && (s = (o < 3 ? i(s) : o > 3 ? i(e, r, s) : i(e, r)) || s);
                return o > 3 && s && Object.defineProperty(e, r, s), s;
            }
            function a(t, e) {
                return function(r, n) {
                    e(r, n, t);
                };
            }
            function h(t, e) {
                if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
                    return Reflect.metadata(t, e);
            }
            function f(t, e, r, n) {
                return new (r || (r = Promise))(function(i, o) {
                    function s(t) {
                        try {
                            a(n.next(t));
                        } catch (t) {
                            o(t);
                        }
                    }
                    function u(t) {
                        try {
                            a(n.throw(t));
                        } catch (t) {
                            o(t);
                        }
                    }
                    function a(t) {
                        t.done
                            ? i(t.value)
                            : new r(function(e) {
                                  e(t.value);
                              }).then(s, u);
                    }
                    a((n = n.apply(t, e || [])).next());
                });
            }
            function c(t, e) {
                var r,
                    n,
                    i,
                    o,
                    s = {
                        label: 0,
                        sent: function() {
                            if (1 & i[0]) throw i[1];
                            return i[1];
                        },
                        trys: [],
                        ops: []
                    };
                return (
                    (o = { next: u(0), throw: u(1), return: u(2) }),
                    'function' == typeof Symbol &&
                        (o[Symbol.iterator] = function() {
                            return this;
                        }),
                    o
                );
                function u(o) {
                    return function(u) {
                        return (function(o) {
                            if (r) throw new TypeError('Generator is already executing.');
                            for (; s; )
                                try {
                                    if (
                                        ((r = 1),
                                        n &&
                                            (i =
                                                2 & o[0]
                                                    ? n.return
                                                    : o[0]
                                                    ? n.throw || ((i = n.return) && i.call(n), 0)
                                                    : n.next) &&
                                            !(i = i.call(n, o[1])).done)
                                    )
                                        return i;
                                    switch (((n = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                                        case 0:
                                        case 1:
                                            i = o;
                                            break;
                                        case 4:
                                            return s.label++, { value: o[1], done: !1 };
                                        case 5:
                                            s.label++, (n = o[1]), (o = [0]);
                                            continue;
                                        case 7:
                                            (o = s.ops.pop()), s.trys.pop();
                                            continue;
                                        default:
                                            if (
                                                !(i = (i = s.trys).length > 0 && i[i.length - 1]) &&
                                                (6 === o[0] || 2 === o[0])
                                            ) {
                                                s = 0;
                                                continue;
                                            }
                                            if (
                                                3 === o[0] &&
                                                (!i || (o[1] > i[0] && o[1] < i[3]))
                                            ) {
                                                s.label = o[1];
                                                break;
                                            }
                                            if (6 === o[0] && s.label < i[1]) {
                                                (s.label = i[1]), (i = o);
                                                break;
                                            }
                                            if (i && s.label < i[2]) {
                                                (s.label = i[2]), s.ops.push(o);
                                                break;
                                            }
                                            i[2] && s.ops.pop(), s.trys.pop();
                                            continue;
                                    }
                                    o = e.call(t, s);
                                } catch (t) {
                                    (o = [6, t]), (n = 0);
                                } finally {
                                    r = i = 0;
                                }
                            if (5 & o[0]) throw o[1];
                            return { value: o[0] ? o[1] : void 0, done: !0 };
                        })([o, u]);
                    };
                }
            }
            function l(t, e) {
                for (var r in t) e.hasOwnProperty(r) || (e[r] = t[r]);
            }
            function p(t) {
                var e = 'function' == typeof Symbol && t[Symbol.iterator],
                    r = 0;
                return e
                    ? e.call(t)
                    : {
                          next: function() {
                              return (
                                  t && r >= t.length && (t = void 0),
                                  { value: t && t[r++], done: !t }
                              );
                          }
                      };
            }
            function d(t, e) {
                var r = 'function' == typeof Symbol && t[Symbol.iterator];
                if (!r) return t;
                var n,
                    i,
                    o = r.call(t),
                    s = [];
                try {
                    for (; (void 0 === e || e-- > 0) && !(n = o.next()).done; ) s.push(n.value);
                } catch (t) {
                    i = { error: t };
                } finally {
                    try {
                        n && !n.done && (r = o.return) && r.call(o);
                    } finally {
                        if (i) throw i.error;
                    }
                }
                return s;
            }
            function g() {
                for (var t = [], e = 0; e < arguments.length; e++) t = t.concat(d(arguments[e]));
                return t;
            }
            function m() {
                for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
                var n = Array(t),
                    i = 0;
                for (e = 0; e < r; e++)
                    for (var o = arguments[e], s = 0, u = o.length; s < u; s++, i++) n[i] = o[s];
                return n;
            }
            function v(t) {
                return this instanceof v ? ((this.v = t), this) : new v(t);
            }
            function y(t, e, r) {
                if (!Symbol.asyncIterator)
                    throw new TypeError('Symbol.asyncIterator is not defined.');
                var n,
                    i = r.apply(t, e || []),
                    o = [];
                return (
                    (n = {}),
                    s('next'),
                    s('throw'),
                    s('return'),
                    (n[Symbol.asyncIterator] = function() {
                        return this;
                    }),
                    n
                );
                function s(t) {
                    i[t] &&
                        (n[t] = function(e) {
                            return new Promise(function(r, n) {
                                o.push([t, e, r, n]) > 1 || u(t, e);
                            });
                        });
                }
                function u(t, e) {
                    try {
                        (r = i[t](e)).value instanceof v
                            ? Promise.resolve(r.value.v).then(a, h)
                            : f(o[0][2], r);
                    } catch (t) {
                        f(o[0][3], t);
                    }
                    var r;
                }
                function a(t) {
                    u('next', t);
                }
                function h(t) {
                    u('throw', t);
                }
                function f(t, e) {
                    t(e), o.shift(), o.length && u(o[0][0], o[0][1]);
                }
            }
            function w(t) {
                var e, r;
                return (
                    (e = {}),
                    n('next'),
                    n('throw', function(t) {
                        throw t;
                    }),
                    n('return'),
                    (e[Symbol.iterator] = function() {
                        return this;
                    }),
                    e
                );
                function n(n, i) {
                    e[n] = t[n]
                        ? function(e) {
                              return (r = !r)
                                  ? { value: v(t[n](e)), done: 'return' === n }
                                  : i
                                  ? i(e)
                                  : e;
                          }
                        : i;
                }
            }
            function b(t) {
                if (!Symbol.asyncIterator)
                    throw new TypeError('Symbol.asyncIterator is not defined.');
                var e,
                    r = t[Symbol.asyncIterator];
                return r
                    ? r.call(t)
                    : ((t = p(t)),
                      (e = {}),
                      n('next'),
                      n('throw'),
                      n('return'),
                      (e[Symbol.asyncIterator] = function() {
                          return this;
                      }),
                      e);
                function n(r) {
                    e[r] =
                        t[r] &&
                        function(e) {
                            return new Promise(function(n, i) {
                                (function(t, e, r, n) {
                                    Promise.resolve(n).then(function(e) {
                                        t({ value: e, done: r });
                                    }, e);
                                })(n, i, (e = t[r](e)).done, e.value);
                            });
                        };
                }
            }
            function _(t, e) {
                return (
                    Object.defineProperty
                        ? Object.defineProperty(t, 'raw', { value: e })
                        : (t.raw = e),
                    t
                );
            }
            function M(t) {
                if (t && t.__esModule) return t;
                var e = {};
                if (null != t) for (var r in t) Object.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                return (e.default = t), e;
            }
            function E(t) {
                return t && t.__esModule ? t : { default: t };
            }
        },
        function(t, e, r) {
            t.exports = (function(t) {
                var e = {};
                function r(n) {
                    if (e[n]) return e[n].exports;
                    var i = (e[n] = { i: n, l: !1, exports: {} });
                    return t[n].call(i.exports, i, i.exports, r), (i.l = !0), i.exports;
                }
                return (
                    (r.m = t),
                    (r.c = e),
                    (r.d = function(t, e, n) {
                        r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
                    }),
                    (r.r = function(t) {
                        'undefined' != typeof Symbol &&
                            Symbol.toStringTag &&
                            Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
                            Object.defineProperty(t, '__esModule', { value: !0 });
                    }),
                    (r.t = function(t, e) {
                        if ((1 & e && (t = r(t)), 8 & e)) return t;
                        if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
                        var n = Object.create(null);
                        if (
                            (r.r(n),
                            Object.defineProperty(n, 'default', { enumerable: !0, value: t }),
                            2 & e && 'string' != typeof t)
                        )
                            for (var i in t)
                                r.d(
                                    n,
                                    i,
                                    function(e) {
                                        return t[e];
                                    }.bind(null, i)
                                );
                        return n;
                    }),
                    (r.n = function(t) {
                        var e =
                            t && t.__esModule
                                ? function() {
                                      return t.default;
                                  }
                                : function() {
                                      return t;
                                  };
                        return r.d(e, 'a', e), e;
                    }),
                    (r.o = function(t, e) {
                        return Object.prototype.hasOwnProperty.call(t, e);
                    }),
                    (r.p = ''),
                    r((r.s = 6))
                );
            })([
                function(t, e, r) {
                    'use strict';
                    r.r(e);
                    var n = r(1);
                    r.d(e, 'isBytesLike', function() {
                        return u;
                    }),
                        r.d(e, 'isBytes', function() {
                            return a;
                        }),
                        r.d(e, 'arrayify', function() {
                            return h;
                        }),
                        r.d(e, 'concat', function() {
                            return f;
                        }),
                        r.d(e, 'stripZeros', function() {
                            return c;
                        }),
                        r.d(e, 'zeroPad', function() {
                            return l;
                        }),
                        r.d(e, 'isHexString', function() {
                            return p;
                        }),
                        r.d(e, 'hexlify', function() {
                            return d;
                        }),
                        r.d(e, 'hexDataLength', function() {
                            return g;
                        }),
                        r.d(e, 'hexDataSlice', function() {
                            return m;
                        }),
                        r.d(e, 'hexConcat', function() {
                            return v;
                        }),
                        r.d(e, 'hexValue', function() {
                            return y;
                        }),
                        r.d(e, 'hexStripZeros', function() {
                            return w;
                        }),
                        r.d(e, 'hexZeroPad', function() {
                            return b;
                        }),
                        r.d(e, 'splitSignature', function() {
                            return _;
                        }),
                        r.d(e, 'joinSignature', function() {
                            return M;
                        });
                    const i = new n.a('bytes/5.0.0-beta.136');
                    function o(t) {
                        return !!t.toHexString;
                    }
                    function s(t) {
                        return t.slice
                            ? t
                            : ((t.slice = function() {
                                  const e = Array.prototype.slice.call(arguments);
                                  return s(new Uint8Array(Array.prototype.slice.apply(t, e)));
                              }),
                              t);
                    }
                    function u(t) {
                        return (p(t) && !(t.length % 2)) || a(t);
                    }
                    function a(t) {
                        if (null == t) return !1;
                        if (t.constructor === Uint8Array) return !0;
                        if ('string' == typeof t) return !1;
                        if (null == t.length) return !1;
                        for (let e = 0; e < t.length; e++) {
                            const r = t[e];
                            if (r < 0 || r >= 256 || r % 1) return !1;
                        }
                        return !0;
                    }
                    function h(t, e) {
                        if ((e || (e = {}), 'number' == typeof t)) {
                            i.checkSafeUint53(t, 'invalid arrayify value');
                            const e = [];
                            for (; t; ) e.unshift(255 & t), (t /= 256);
                            return 0 === e.length && e.push(0), s(new Uint8Array(e));
                        }
                        if (
                            (e.allowMissingPrefix &&
                                'string' == typeof t &&
                                '0x' !== t.substring(0, 2) &&
                                (t = '0x' + t),
                            o(t) && (t = t.toHexString()),
                            p(t))
                        ) {
                            let r = t.substring(2);
                            r.length % 2 &&
                                ('left' === e.hexPad
                                    ? (r = '0x0' + r.substring(2))
                                    : 'right' === e.hexPad
                                    ? (r += '0')
                                    : i.throwArgumentError('hex data is odd-length', 'value', t));
                            const n = [];
                            for (let t = 0; t < r.length; t += 2)
                                n.push(parseInt(r.substring(t, t + 2), 16));
                            return s(new Uint8Array(n));
                        }
                        return a(t)
                            ? s(new Uint8Array(t))
                            : i.throwArgumentError('invalid arrayify value', 'value', t);
                    }
                    function f(t) {
                        const e = t.map(t => h(t)),
                            r = e.reduce((t, e) => t + e.length, 0),
                            n = new Uint8Array(r);
                        return e.reduce((t, e) => (n.set(e, t), t + e.length), 0), s(n);
                    }
                    function c(t) {
                        let e = h(t);
                        if (0 === e.length) return e;
                        let r = 0;
                        for (; r < e.length && 0 === e[r]; ) r++;
                        return r && (e = e.slice(r)), e;
                    }
                    function l(t, e) {
                        (t = h(t)).length > e &&
                            i.throwArgumentError('value out of range', 'value', arguments[0]);
                        const r = new Uint8Array(e);
                        return r.set(t, e - t.length), s(r);
                    }
                    function p(t, e) {
                        return !(
                            'string' != typeof t ||
                            !t.match(/^0x[0-9A-Fa-f]*$/) ||
                            (e && t.length !== 2 + 2 * e)
                        );
                    }
                    function d(t, e) {
                        if ((e || (e = {}), 'number' == typeof t)) {
                            i.checkSafeUint53(t, 'invalid hexlify value');
                            let e = '';
                            for (; t; )
                                (e = '0123456789abcdef'[15 & t] + e), (t = Math.floor(t / 16));
                            return e.length ? (e.length % 2 && (e = '0' + e), '0x' + e) : '0x00';
                        }
                        if (
                            (e.allowMissingPrefix &&
                                'string' == typeof t &&
                                '0x' !== t.substring(0, 2) &&
                                (t = '0x' + t),
                            o(t))
                        )
                            return t.toHexString();
                        if (p(t))
                            return (
                                t.length % 2 &&
                                    ('left' === e.hexPad
                                        ? (t = '0x0' + t.substring(2))
                                        : 'right' === e.hexPad
                                        ? (t += '0')
                                        : i.throwArgumentError(
                                              'hex data is odd-length',
                                              'value',
                                              t
                                          )),
                                t.toLowerCase()
                            );
                        if (a(t)) {
                            let e = '0x';
                            for (let r = 0; r < t.length; r++) {
                                let n = t[r];
                                e +=
                                    '0123456789abcdef'[(240 & n) >> 4] + '0123456789abcdef'[15 & n];
                            }
                            return e;
                        }
                        return i.throwArgumentError('invalid hexlify value', 'value', t);
                    }
                    function g(t) {
                        if ('string' != typeof t) t = d(t);
                        else if (!p(t) || t.length % 2) return null;
                        return (t.length - 2) / 2;
                    }
                    function m(t, e, r) {
                        return (
                            'string' != typeof t
                                ? (t = d(t))
                                : (!p(t) || t.length % 2) &&
                                  i.throwArgumentError('invalid hexData', 'value', t),
                            (e = 2 + 2 * e),
                            null != r ? '0x' + t.substring(e, 2 + 2 * r) : '0x' + t.substring(e)
                        );
                    }
                    function v(t) {
                        let e = '0x';
                        return (
                            t.forEach(t => {
                                e += d(t).substring(2);
                            }),
                            e
                        );
                    }
                    function y(t) {
                        const e = w(d(t, { hexPad: 'left' }));
                        return '0x' === e ? '0x0' : e;
                    }
                    function w(t) {
                        'string' != typeof t && (t = d(t)),
                            p(t) || i.throwArgumentError('invalid hex string', 'value', t),
                            (t = t.substring(2));
                        let e = 0;
                        for (; e < t.length && '0' === t[e]; ) e++;
                        return '0x' + t.substring(e);
                    }
                    function b(t, e) {
                        for (
                            'string' != typeof t
                                ? (t = d(t))
                                : p(t) || i.throwArgumentError('invalid hex string', 'value', t),
                                t.length > 2 * e + 2 &&
                                    i.throwArgumentError(
                                        'value out of range',
                                        'value',
                                        arguments[1]
                                    );
                            t.length < 2 * e + 2;

                        )
                            t = '0x0' + t.substring(2);
                        return t;
                    }
                    function _(t) {
                        const e = { r: '0x', s: '0x', _vs: '0x', recoveryParam: 0, v: 0 };
                        if (u(t)) {
                            const r = h(t);
                            65 !== r.length &&
                                i.throwArgumentError(
                                    'invalid signature string; must be 65 bytes',
                                    'signature',
                                    t
                                ),
                                (e.r = d(r.slice(0, 32))),
                                (e.s = d(r.slice(32, 64))),
                                (e.v = r[64]),
                                (e.recoveryParam = 1 - (e.v % 2)),
                                e.v < 27 &&
                                    (0 === e.v || 1 === e.v
                                        ? (e.v += 27)
                                        : i.throwArgumentError(
                                              'signature invalid v byte',
                                              'signature',
                                              t
                                          )),
                                e.recoveryParam && (r[32] |= 128),
                                (e._vs = d(r.slice(32, 64)));
                        } else {
                            if (
                                ((e.r = t.r),
                                (e.s = t.s),
                                (e.v = t.v),
                                (e.recoveryParam = t.recoveryParam),
                                (e._vs = t._vs),
                                null != e._vs)
                            ) {
                                const r = l(h(e._vs), 32);
                                e._vs = d(r);
                                const n = r[0] >= 128 ? 1 : 0;
                                null == e.recoveryParam
                                    ? (e.recoveryParam = n)
                                    : e.recoveryParam !== n &&
                                      i.throwArgumentError(
                                          'signature recoveryParam mismatch _vs',
                                          'signature',
                                          t
                                      ),
                                    (r[0] &= 127);
                                const o = d(r);
                                null == e.s
                                    ? (e.s = o)
                                    : e.s !== o &&
                                      i.throwArgumentError(
                                          'signature v mismatch _vs',
                                          'signature',
                                          t
                                      );
                            }
                            null == e.recoveryParam
                                ? null == e.v
                                    ? i.throwArgumentError(
                                          'signature missing v and recoveryParam',
                                          'signature',
                                          t
                                      )
                                    : (e.recoveryParam = 1 - (e.v % 2))
                                : null == e.v
                                ? (e.v = 27 + e.recoveryParam)
                                : e.recoveryParam !== 1 - (e.v % 2) &&
                                  i.throwArgumentError(
                                      'signature recoveryParam mismatch v',
                                      'signature',
                                      t
                                  ),
                                null != e.r && p(e.r)
                                    ? (e.r = b(e.r, 32))
                                    : i.throwArgumentError(
                                          'signature missing or invalid r',
                                          'signature',
                                          t
                                      ),
                                null != e.s && p(e.s)
                                    ? (e.s = b(e.s, 32))
                                    : i.throwArgumentError(
                                          'signature missing or invalid s',
                                          'signature',
                                          t
                                      );
                            const r = h(e.s);
                            r[0] >= 128 &&
                                i.throwArgumentError('signature s out of range', 'signature', t),
                                e.recoveryParam && (r[0] |= 128);
                            const n = d(r);
                            e._vs &&
                                (p(e._vs) ||
                                    i.throwArgumentError('signature invalid _vs', 'signature', t),
                                (e._vs = b(e._vs, 32))),
                                null == e._vs
                                    ? (e._vs = n)
                                    : e._vs !== n &&
                                      i.throwArgumentError(
                                          'signature _vs mismatch v and s',
                                          'signature',
                                          t
                                      );
                        }
                        return e;
                    }
                    function M(t) {
                        return d(f([(t = _(t)).r, t.s, t.recoveryParam ? '0x1c' : '0x1b']));
                    }
                },
                function(t, e, r) {
                    'use strict';
                    r.d(e, 'a', function() {
                        return h;
                    });
                    let n = !1,
                        i = !1;
                    const o = { debug: 1, default: 2, info: 2, warn: 3, error: 4, off: 5 };
                    let s = o.default,
                        u = null;
                    const a = (function() {
                        try {
                            const t = [];
                            if (
                                (['NFD', 'NFC', 'NFKD', 'NFKC'].forEach(e => {
                                    try {
                                        if ('test' !== 'test'.normalize(e))
                                            throw new Error('bad normalize');
                                    } catch (r) {
                                        t.push(e);
                                    }
                                }),
                                t.length)
                            )
                                throw new Error('missing ' + t.join(', '));
                            if (
                                String.fromCharCode(233).normalize('NFD') !==
                                String.fromCharCode(101, 769)
                            )
                                throw new Error('broken implementation');
                        } catch (t) {
                            return t.message;
                        }
                        return null;
                    })();
                    class h {
                        constructor(t) {
                            Object.defineProperty(this, 'version', {
                                enumerable: !0,
                                value: t,
                                writable: !1
                            });
                        }
                        setLogLevel(t) {
                            const e = o[t];
                            null != e ? (s = e) : this.warn('invalid log level - ' + t);
                        }
                        _log(t, e) {
                            s > o[t] || console.log.apply(console, e);
                        }
                        debug(...t) {
                            this._log(h.levels.DEBUG, t);
                        }
                        info(...t) {
                            this._log(h.levels.INFO, t);
                        }
                        warn(...t) {
                            this._log(h.levels.WARNING, t);
                        }
                        makeError(t, e, r) {
                            if (i) return new Error('unknown error');
                            e || (e = h.errors.UNKNOWN_ERROR), r || (r = {});
                            const n = [];
                            Object.keys(r).forEach(t => {
                                try {
                                    n.push(t + '=' + JSON.stringify(r[t]));
                                } catch (e) {
                                    n.push(t + '=' + JSON.stringify(r[t].toString()));
                                }
                            }),
                                n.push('version=' + this.version);
                            const o = t;
                            n.length && (t += ' (' + n.join(', ') + ')');
                            const s = new Error(t);
                            return (
                                (s.reason = o),
                                (s.code = e),
                                Object.keys(r).forEach(function(t) {
                                    s[t] = r[t];
                                }),
                                s
                            );
                        }
                        throwError(t, e, r) {
                            throw this.makeError(t, e, r);
                        }
                        throwArgumentError(t, e, r) {
                            return this.throwError(t, h.errors.INVALID_ARGUMENT, {
                                argument: e,
                                value: r
                            });
                        }
                        checkNormalize(t) {
                            null == t && (t = 'platform missing String.prototype.normalize'),
                                a &&
                                    this.throwError(
                                        'platform missing String.prototype.normalize',
                                        h.errors.UNSUPPORTED_OPERATION,
                                        { operation: 'String.prototype.normalize', form: a }
                                    );
                        }
                        checkSafeUint53(t, e) {
                            'number' == typeof t &&
                                (null == e && (e = 'value not safe'),
                                (t < 0 || t >= 9007199254740991) &&
                                    this.throwError(e, h.errors.NUMERIC_FAULT, {
                                        operation: 'checkSafeInteger',
                                        fault: 'out-of-safe-range',
                                        value: t
                                    }),
                                t % 1 &&
                                    this.throwError(e, h.errors.NUMERIC_FAULT, {
                                        operation: 'checkSafeInteger',
                                        fault: 'non-integer',
                                        value: t
                                    }));
                        }
                        checkArgumentCount(t, e, r) {
                            (r = r ? ': ' + r : ''),
                                t < e &&
                                    this.throwError(
                                        'missing argument' + r,
                                        h.errors.MISSING_ARGUMENT,
                                        { count: t, expectedCount: e }
                                    ),
                                t > e &&
                                    this.throwError(
                                        'too many arguments' + r,
                                        h.errors.UNEXPECTED_ARGUMENT,
                                        { count: t, expectedCount: e }
                                    );
                        }
                        checkNew(t, e) {
                            (t !== Object && null != t) ||
                                this.throwError('missing new', h.errors.MISSING_NEW, {
                                    name: e.name
                                });
                        }
                        checkAbstract(t, e) {
                            t === e
                                ? this.throwError(
                                      'cannot instantiate abstract class ' +
                                          JSON.stringify(e.name) +
                                          ' directly; use a sub-class',
                                      h.errors.UNSUPPORTED_OPERATION,
                                      { name: t.name, operation: 'new' }
                                  )
                                : (t !== Object && null != t) ||
                                  this.throwError('missing new', h.errors.MISSING_NEW, {
                                      name: e.name
                                  });
                        }
                        static globalLogger() {
                            return u || (u = new h('logger/5.0.0-beta.133')), u;
                        }
                        static setCensorship(t, e) {
                            if (n) {
                                if (!t) return;
                                this.globalLogger().throwError(
                                    'error censorship permanent',
                                    h.errors.UNSUPPORTED_OPERATION,
                                    { operation: 'setCensorship' }
                                );
                            }
                            (i = !!t), (n = !!e);
                        }
                    }
                    (h.errors = {
                        UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                        NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
                        UNSUPPORTED_OPERATION: 'UNSUPPORTED_OPERATION',
                        NETWORK_ERROR: 'NETWORK_ERROR',
                        SERVER_ERROR: 'SERVER_ERROR',
                        TIMEOUT: 'TIMEOUT',
                        BUFFER_OVERRUN: 'BUFFER_OVERRUN',
                        NUMERIC_FAULT: 'NUMERIC_FAULT',
                        MISSING_NEW: 'MISSING_NEW',
                        INVALID_ARGUMENT: 'INVALID_ARGUMENT',
                        MISSING_ARGUMENT: 'MISSING_ARGUMENT',
                        UNEXPECTED_ARGUMENT: 'UNEXPECTED_ARGUMENT',
                        CALL_EXCEPTION: 'CALL_EXCEPTION',
                        INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
                        NONCE_EXPIRED: 'NONCE_EXPIRED',
                        REPLACEMENT_UNDERPRICED: 'REPLACEMENT_UNDERPRICED',
                        UNPREDICTABLE_GAS_LIMIT: 'UNPREDICTABLE_GAS_LIMIT'
                    }),
                        (h.levels = {
                            DEBUG: 'DEBUG',
                            INFO: 'INFO',
                            WARNING: 'WARNING',
                            ERROR: 'ERROR',
                            OFF: 'OFF'
                        });
                },
                function(t, e, r) {
                    'use strict';
                    var n = r(3),
                        i = r(0),
                        o = r(1);
                    const s = 'bignumber/5.0.0-beta.135',
                        u = new o.a(s),
                        a = {};
                    class h {
                        constructor(t, e) {
                            u.checkNew(new.target, h),
                                t !== a &&
                                    u.throwError(
                                        'cannot call consturtor directly; use BigNumber.from',
                                        o.a.errors.UNSUPPORTED_OPERATION,
                                        { operation: 'new (BigNumber)' }
                                    ),
                                (this._hex = e),
                                (this._isBigNumber = !0),
                                Object.freeze(this);
                        }
                        fromTwos(t) {
                            return c(l(this).fromTwos(t));
                        }
                        toTwos(t) {
                            return c(l(this).toTwos(t));
                        }
                        abs() {
                            return '-' === this._hex[0] ? h.from(this._hex.substring(1)) : this;
                        }
                        add(t) {
                            return c(l(this).add(l(t)));
                        }
                        sub(t) {
                            return c(l(this).sub(l(t)));
                        }
                        div(t) {
                            return (
                                h.from(t).isZero() && p('division by zero', 'div'),
                                c(l(this).div(l(t)))
                            );
                        }
                        mul(t) {
                            return c(l(this).mul(l(t)));
                        }
                        mod(t) {
                            return c(l(this).mod(l(t)));
                        }
                        pow(t) {
                            return c(l(this).pow(l(t)));
                        }
                        maskn(t) {
                            return c(l(this).maskn(t));
                        }
                        eq(t) {
                            return l(this).eq(l(t));
                        }
                        lt(t) {
                            return l(this).lt(l(t));
                        }
                        lte(t) {
                            return l(this).lte(l(t));
                        }
                        gt(t) {
                            return l(this).gt(l(t));
                        }
                        gte(t) {
                            return l(this).gte(l(t));
                        }
                        isZero() {
                            return l(this).isZero();
                        }
                        toNumber() {
                            try {
                                return l(this).toNumber();
                            } catch (t) {
                                p('overflow', 'toNumber', this.toString());
                            }
                            return null;
                        }
                        toString() {
                            return (
                                0 !== arguments.length &&
                                    u.throwError(
                                        'bigNumber.toString does not accept parameters',
                                        o.a.errors.UNEXPECTED_ARGUMENT,
                                        {}
                                    ),
                                l(this).toString(10)
                            );
                        }
                        toHexString() {
                            return this._hex;
                        }
                        static from(t) {
                            return t instanceof h
                                ? t
                                : 'string' == typeof t
                                ? t.match(/-?0x[0-9a-f]+/i)
                                    ? new h(a, f(t))
                                    : t.match(/^-?[0-9]+$/)
                                    ? new h(a, f(new n.BN(t)))
                                    : u.throwArgumentError('invalid BigNumber string', 'value', t)
                                : 'number' == typeof t
                                ? (t % 1 && p('underflow', 'BigNumber.from', t),
                                  (t >= 9007199254740991 || t <= -9007199254740991) &&
                                      p('overflow', 'BigNumber.from', t),
                                  h.from(String(t)))
                                : 'bigint' == typeof t
                                ? h.from(t.toString())
                                : Object(i.isBytes)(t)
                                ? h.from(Object(i.hexlify)(t))
                                : t._hex && Object(i.isHexString)(t._hex)
                                ? h.from(t._hex)
                                : t.toHexString && 'string' == typeof (t = t.toHexString())
                                ? h.from(t)
                                : u.throwArgumentError('invalid BigNumber value', 'value', t);
                        }
                        static isBigNumber(t) {
                            return !(!t || !t._isBigNumber);
                        }
                    }
                    function f(t) {
                        if ('string' != typeof t) return f(t.toString(16));
                        if ('-' === t[0])
                            return (
                                '-' === (t = t.substring(1))[0] &&
                                    u.throwArgumentError('invalid hex', 'value', t),
                                '0x00' === (t = f(t)) ? t : '-' + t
                            );
                        if (('0x' !== t.substring(0, 2) && (t = '0x' + t), '0x' === t))
                            return '0x00';
                        for (
                            t.length % 2 && (t = '0x0' + t.substring(2));
                            t.length > 4 && '0x00' === t.substring(0, 4);

                        )
                            t = '0x' + t.substring(4);
                        return t;
                    }
                    function c(t) {
                        return h.from(f(t));
                    }
                    function l(t) {
                        const e = h.from(t).toHexString();
                        return '-' === e[0]
                            ? new n.BN('-' + e.substring(3), 16)
                            : new n.BN(e.substring(2), 16);
                    }
                    function p(t, e, r) {
                        const n = { fault: t, operation: e };
                        return (
                            null != r && (n.value = r), u.throwError(t, o.a.errors.NUMERIC_FAULT, n)
                        );
                    }
                    new o.a(s), h.from(0), h.from(-1);
                    let d = '0';
                    for (; d.length < 256; ) d += d;
                    r.d(e, 'a', function() {
                        return h;
                    });
                },
                function(t, e, r) {
                    (function(t) {
                        !(function(t, e) {
                            'use strict';
                            function n(t, e) {
                                if (!t) throw new Error(e || 'Assertion failed');
                            }
                            function i(t, e) {
                                t.super_ = e;
                                var r = function() {};
                                (r.prototype = e.prototype),
                                    (t.prototype = new r()),
                                    (t.prototype.constructor = t);
                            }
                            function o(t, e, r) {
                                if (o.isBN(t)) return t;
                                (this.negative = 0),
                                    (this.words = null),
                                    (this.length = 0),
                                    (this.red = null),
                                    null !== t &&
                                        (('le' !== e && 'be' !== e) || ((r = e), (e = 10)),
                                        this._init(t || 0, e || 10, r || 'be'));
                            }
                            var s;
                            'object' == typeof t ? (t.exports = o) : (e.BN = o),
                                (o.BN = o),
                                (o.wordSize = 26);
                            try {
                                s = r(14).Buffer;
                            } catch (t) {}
                            function u(t, e, r) {
                                for (var n = 0, i = Math.min(t.length, r), o = e; o < i; o++) {
                                    var s = t.charCodeAt(o) - 48;
                                    (n <<= 4),
                                        (n |=
                                            s >= 49 && s <= 54
                                                ? s - 49 + 10
                                                : s >= 17 && s <= 22
                                                ? s - 17 + 10
                                                : 15 & s);
                                }
                                return n;
                            }
                            function a(t, e, r, n) {
                                for (var i = 0, o = Math.min(t.length, r), s = e; s < o; s++) {
                                    var u = t.charCodeAt(s) - 48;
                                    (i *= n),
                                        (i += u >= 49 ? u - 49 + 10 : u >= 17 ? u - 17 + 10 : u);
                                }
                                return i;
                            }
                            (o.isBN = function(t) {
                                return (
                                    t instanceof o ||
                                    (null !== t &&
                                        'object' == typeof t &&
                                        t.constructor.wordSize === o.wordSize &&
                                        Array.isArray(t.words))
                                );
                            }),
                                (o.max = function(t, e) {
                                    return t.cmp(e) > 0 ? t : e;
                                }),
                                (o.min = function(t, e) {
                                    return t.cmp(e) < 0 ? t : e;
                                }),
                                (o.prototype._init = function(t, e, r) {
                                    if ('number' == typeof t) return this._initNumber(t, e, r);
                                    if ('object' == typeof t) return this._initArray(t, e, r);
                                    'hex' === e && (e = 16), n(e === (0 | e) && e >= 2 && e <= 36);
                                    var i = 0;
                                    '-' === (t = t.toString().replace(/\s+/g, ''))[0] && i++,
                                        16 === e ? this._parseHex(t, i) : this._parseBase(t, e, i),
                                        '-' === t[0] && (this.negative = 1),
                                        this.strip(),
                                        'le' === r && this._initArray(this.toArray(), e, r);
                                }),
                                (o.prototype._initNumber = function(t, e, r) {
                                    t < 0 && ((this.negative = 1), (t = -t)),
                                        t < 67108864
                                            ? ((this.words = [67108863 & t]), (this.length = 1))
                                            : t < 4503599627370496
                                            ? ((this.words = [
                                                  67108863 & t,
                                                  (t / 67108864) & 67108863
                                              ]),
                                              (this.length = 2))
                                            : (n(t < 9007199254740992),
                                              (this.words = [
                                                  67108863 & t,
                                                  (t / 67108864) & 67108863,
                                                  1
                                              ]),
                                              (this.length = 3)),
                                        'le' === r && this._initArray(this.toArray(), e, r);
                                }),
                                (o.prototype._initArray = function(t, e, r) {
                                    if ((n('number' == typeof t.length), t.length <= 0))
                                        return (this.words = [0]), (this.length = 1), this;
                                    (this.length = Math.ceil(t.length / 3)),
                                        (this.words = new Array(this.length));
                                    for (var i = 0; i < this.length; i++) this.words[i] = 0;
                                    var o,
                                        s,
                                        u = 0;
                                    if ('be' === r)
                                        for (i = t.length - 1, o = 0; i >= 0; i -= 3)
                                            (s = t[i] | (t[i - 1] << 8) | (t[i - 2] << 16)),
                                                (this.words[o] |= (s << u) & 67108863),
                                                (this.words[o + 1] = (s >>> (26 - u)) & 67108863),
                                                (u += 24) >= 26 && ((u -= 26), o++);
                                    else if ('le' === r)
                                        for (i = 0, o = 0; i < t.length; i += 3)
                                            (s = t[i] | (t[i + 1] << 8) | (t[i + 2] << 16)),
                                                (this.words[o] |= (s << u) & 67108863),
                                                (this.words[o + 1] = (s >>> (26 - u)) & 67108863),
                                                (u += 24) >= 26 && ((u -= 26), o++);
                                    return this.strip();
                                }),
                                (o.prototype._parseHex = function(t, e) {
                                    (this.length = Math.ceil((t.length - e) / 6)),
                                        (this.words = new Array(this.length));
                                    for (var r = 0; r < this.length; r++) this.words[r] = 0;
                                    var n,
                                        i,
                                        o = 0;
                                    for (r = t.length - 6, n = 0; r >= e; r -= 6)
                                        (i = u(t, r, r + 6)),
                                            (this.words[n] |= (i << o) & 67108863),
                                            (this.words[n + 1] |= (i >>> (26 - o)) & 4194303),
                                            (o += 24) >= 26 && ((o -= 26), n++);
                                    r + 6 !== e &&
                                        ((i = u(t, e, r + 6)),
                                        (this.words[n] |= (i << o) & 67108863),
                                        (this.words[n + 1] |= (i >>> (26 - o)) & 4194303)),
                                        this.strip();
                                }),
                                (o.prototype._parseBase = function(t, e, r) {
                                    (this.words = [0]), (this.length = 1);
                                    for (var n = 0, i = 1; i <= 67108863; i *= e) n++;
                                    n--, (i = (i / e) | 0);
                                    for (
                                        var o = t.length - r,
                                            s = o % n,
                                            u = Math.min(o, o - s) + r,
                                            h = 0,
                                            f = r;
                                        f < u;
                                        f += n
                                    )
                                        (h = a(t, f, f + n, e)),
                                            this.imuln(i),
                                            this.words[0] + h < 67108864
                                                ? (this.words[0] += h)
                                                : this._iaddn(h);
                                    if (0 !== s) {
                                        var c = 1;
                                        for (h = a(t, f, t.length, e), f = 0; f < s; f++) c *= e;
                                        this.imuln(c),
                                            this.words[0] + h < 67108864
                                                ? (this.words[0] += h)
                                                : this._iaddn(h);
                                    }
                                }),
                                (o.prototype.copy = function(t) {
                                    t.words = new Array(this.length);
                                    for (var e = 0; e < this.length; e++)
                                        t.words[e] = this.words[e];
                                    (t.length = this.length),
                                        (t.negative = this.negative),
                                        (t.red = this.red);
                                }),
                                (o.prototype.clone = function() {
                                    var t = new o(null);
                                    return this.copy(t), t;
                                }),
                                (o.prototype._expand = function(t) {
                                    for (; this.length < t; ) this.words[this.length++] = 0;
                                    return this;
                                }),
                                (o.prototype.strip = function() {
                                    for (; this.length > 1 && 0 === this.words[this.length - 1]; )
                                        this.length--;
                                    return this._normSign();
                                }),
                                (o.prototype._normSign = function() {
                                    return (
                                        1 === this.length &&
                                            0 === this.words[0] &&
                                            (this.negative = 0),
                                        this
                                    );
                                }),
                                (o.prototype.inspect = function() {
                                    return (
                                        (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>'
                                    );
                                });
                            var h = [
                                    '',
                                    '0',
                                    '00',
                                    '000',
                                    '0000',
                                    '00000',
                                    '000000',
                                    '0000000',
                                    '00000000',
                                    '000000000',
                                    '0000000000',
                                    '00000000000',
                                    '000000000000',
                                    '0000000000000',
                                    '00000000000000',
                                    '000000000000000',
                                    '0000000000000000',
                                    '00000000000000000',
                                    '000000000000000000',
                                    '0000000000000000000',
                                    '00000000000000000000',
                                    '000000000000000000000',
                                    '0000000000000000000000',
                                    '00000000000000000000000',
                                    '000000000000000000000000',
                                    '0000000000000000000000000'
                                ],
                                f = [
                                    0,
                                    0,
                                    25,
                                    16,
                                    12,
                                    11,
                                    10,
                                    9,
                                    8,
                                    8,
                                    7,
                                    7,
                                    7,
                                    7,
                                    6,
                                    6,
                                    6,
                                    6,
                                    6,
                                    6,
                                    6,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5,
                                    5
                                ],
                                c = [
                                    0,
                                    0,
                                    33554432,
                                    43046721,
                                    16777216,
                                    48828125,
                                    60466176,
                                    40353607,
                                    16777216,
                                    43046721,
                                    1e7,
                                    19487171,
                                    35831808,
                                    62748517,
                                    7529536,
                                    11390625,
                                    16777216,
                                    24137569,
                                    34012224,
                                    47045881,
                                    64e6,
                                    4084101,
                                    5153632,
                                    6436343,
                                    7962624,
                                    9765625,
                                    11881376,
                                    14348907,
                                    17210368,
                                    20511149,
                                    243e5,
                                    28629151,
                                    33554432,
                                    39135393,
                                    45435424,
                                    52521875,
                                    60466176
                                ];
                            function l(t, e, r) {
                                r.negative = e.negative ^ t.negative;
                                var n = (t.length + e.length) | 0;
                                (r.length = n), (n = (n - 1) | 0);
                                var i = 0 | t.words[0],
                                    o = 0 | e.words[0],
                                    s = i * o,
                                    u = 67108863 & s,
                                    a = (s / 67108864) | 0;
                                r.words[0] = u;
                                for (var h = 1; h < n; h++) {
                                    for (
                                        var f = a >>> 26,
                                            c = 67108863 & a,
                                            l = Math.min(h, e.length - 1),
                                            p = Math.max(0, h - t.length + 1);
                                        p <= l;
                                        p++
                                    ) {
                                        var d = (h - p) | 0;
                                        (f +=
                                            ((s = (i = 0 | t.words[d]) * (o = 0 | e.words[p]) + c) /
                                                67108864) |
                                            0),
                                            (c = 67108863 & s);
                                    }
                                    (r.words[h] = 0 | c), (a = 0 | f);
                                }
                                return 0 !== a ? (r.words[h] = 0 | a) : r.length--, r.strip();
                            }
                            (o.prototype.toString = function(t, e) {
                                var r;
                                if (((e = 0 | e || 1), 16 === (t = t || 10) || 'hex' === t)) {
                                    r = '';
                                    for (var i = 0, o = 0, s = 0; s < this.length; s++) {
                                        var u = this.words[s],
                                            a = (16777215 & ((u << i) | o)).toString(16);
                                        (r =
                                            0 != (o = (u >>> (24 - i)) & 16777215) ||
                                            s !== this.length - 1
                                                ? h[6 - a.length] + a + r
                                                : a + r),
                                            (i += 2) >= 26 && ((i -= 26), s--);
                                    }
                                    for (0 !== o && (r = o.toString(16) + r); r.length % e != 0; )
                                        r = '0' + r;
                                    return 0 !== this.negative && (r = '-' + r), r;
                                }
                                if (t === (0 | t) && t >= 2 && t <= 36) {
                                    var l = f[t],
                                        p = c[t];
                                    r = '';
                                    var d = this.clone();
                                    for (d.negative = 0; !d.isZero(); ) {
                                        var g = d.modn(p).toString(t);
                                        r = (d = d.idivn(p)).isZero()
                                            ? g + r
                                            : h[l - g.length] + g + r;
                                    }
                                    for (this.isZero() && (r = '0' + r); r.length % e != 0; )
                                        r = '0' + r;
                                    return 0 !== this.negative && (r = '-' + r), r;
                                }
                                n(!1, 'Base should be between 2 and 36');
                            }),
                                (o.prototype.toNumber = function() {
                                    var t = this.words[0];
                                    return (
                                        2 === this.length
                                            ? (t += 67108864 * this.words[1])
                                            : 3 === this.length && 1 === this.words[2]
                                            ? (t += 4503599627370496 + 67108864 * this.words[1])
                                            : this.length > 2 &&
                                              n(!1, 'Number can only safely store up to 53 bits'),
                                        0 !== this.negative ? -t : t
                                    );
                                }),
                                (o.prototype.toJSON = function() {
                                    return this.toString(16);
                                }),
                                (o.prototype.toBuffer = function(t, e) {
                                    return n(void 0 !== s), this.toArrayLike(s, t, e);
                                }),
                                (o.prototype.toArray = function(t, e) {
                                    return this.toArrayLike(Array, t, e);
                                }),
                                (o.prototype.toArrayLike = function(t, e, r) {
                                    var i = this.byteLength(),
                                        o = r || Math.max(1, i);
                                    n(i <= o, 'byte array longer than desired length'),
                                        n(o > 0, 'Requested array length <= 0'),
                                        this.strip();
                                    var s,
                                        u,
                                        a = 'le' === e,
                                        h = new t(o),
                                        f = this.clone();
                                    if (a) {
                                        for (u = 0; !f.isZero(); u++)
                                            (s = f.andln(255)), f.iushrn(8), (h[u] = s);
                                        for (; u < o; u++) h[u] = 0;
                                    } else {
                                        for (u = 0; u < o - i; u++) h[u] = 0;
                                        for (u = 0; !f.isZero(); u++)
                                            (s = f.andln(255)), f.iushrn(8), (h[o - u - 1] = s);
                                    }
                                    return h;
                                }),
                                Math.clz32
                                    ? (o.prototype._countBits = function(t) {
                                          return 32 - Math.clz32(t);
                                      })
                                    : (o.prototype._countBits = function(t) {
                                          var e = t,
                                              r = 0;
                                          return (
                                              e >= 4096 && ((r += 13), (e >>>= 13)),
                                              e >= 64 && ((r += 7), (e >>>= 7)),
                                              e >= 8 && ((r += 4), (e >>>= 4)),
                                              e >= 2 && ((r += 2), (e >>>= 2)),
                                              r + e
                                          );
                                      }),
                                (o.prototype._zeroBits = function(t) {
                                    if (0 === t) return 26;
                                    var e = t,
                                        r = 0;
                                    return (
                                        0 == (8191 & e) && ((r += 13), (e >>>= 13)),
                                        0 == (127 & e) && ((r += 7), (e >>>= 7)),
                                        0 == (15 & e) && ((r += 4), (e >>>= 4)),
                                        0 == (3 & e) && ((r += 2), (e >>>= 2)),
                                        0 == (1 & e) && r++,
                                        r
                                    );
                                }),
                                (o.prototype.bitLength = function() {
                                    var t = this.words[this.length - 1],
                                        e = this._countBits(t);
                                    return 26 * (this.length - 1) + e;
                                }),
                                (o.prototype.zeroBits = function() {
                                    if (this.isZero()) return 0;
                                    for (var t = 0, e = 0; e < this.length; e++) {
                                        var r = this._zeroBits(this.words[e]);
                                        if (((t += r), 26 !== r)) break;
                                    }
                                    return t;
                                }),
                                (o.prototype.byteLength = function() {
                                    return Math.ceil(this.bitLength() / 8);
                                }),
                                (o.prototype.toTwos = function(t) {
                                    return 0 !== this.negative
                                        ? this.abs()
                                              .inotn(t)
                                              .iaddn(1)
                                        : this.clone();
                                }),
                                (o.prototype.fromTwos = function(t) {
                                    return this.testn(t - 1)
                                        ? this.notn(t)
                                              .iaddn(1)
                                              .ineg()
                                        : this.clone();
                                }),
                                (o.prototype.isNeg = function() {
                                    return 0 !== this.negative;
                                }),
                                (o.prototype.neg = function() {
                                    return this.clone().ineg();
                                }),
                                (o.prototype.ineg = function() {
                                    return this.isZero() || (this.negative ^= 1), this;
                                }),
                                (o.prototype.iuor = function(t) {
                                    for (; this.length < t.length; ) this.words[this.length++] = 0;
                                    for (var e = 0; e < t.length; e++)
                                        this.words[e] = this.words[e] | t.words[e];
                                    return this.strip();
                                }),
                                (o.prototype.ior = function(t) {
                                    return n(0 == (this.negative | t.negative)), this.iuor(t);
                                }),
                                (o.prototype.or = function(t) {
                                    return this.length > t.length
                                        ? this.clone().ior(t)
                                        : t.clone().ior(this);
                                }),
                                (o.prototype.uor = function(t) {
                                    return this.length > t.length
                                        ? this.clone().iuor(t)
                                        : t.clone().iuor(this);
                                }),
                                (o.prototype.iuand = function(t) {
                                    var e;
                                    e = this.length > t.length ? t : this;
                                    for (var r = 0; r < e.length; r++)
                                        this.words[r] = this.words[r] & t.words[r];
                                    return (this.length = e.length), this.strip();
                                }),
                                (o.prototype.iand = function(t) {
                                    return n(0 == (this.negative | t.negative)), this.iuand(t);
                                }),
                                (o.prototype.and = function(t) {
                                    return this.length > t.length
                                        ? this.clone().iand(t)
                                        : t.clone().iand(this);
                                }),
                                (o.prototype.uand = function(t) {
                                    return this.length > t.length
                                        ? this.clone().iuand(t)
                                        : t.clone().iuand(this);
                                }),
                                (o.prototype.iuxor = function(t) {
                                    var e, r;
                                    this.length > t.length
                                        ? ((e = this), (r = t))
                                        : ((e = t), (r = this));
                                    for (var n = 0; n < r.length; n++)
                                        this.words[n] = e.words[n] ^ r.words[n];
                                    if (this !== e)
                                        for (; n < e.length; n++) this.words[n] = e.words[n];
                                    return (this.length = e.length), this.strip();
                                }),
                                (o.prototype.ixor = function(t) {
                                    return n(0 == (this.negative | t.negative)), this.iuxor(t);
                                }),
                                (o.prototype.xor = function(t) {
                                    return this.length > t.length
                                        ? this.clone().ixor(t)
                                        : t.clone().ixor(this);
                                }),
                                (o.prototype.uxor = function(t) {
                                    return this.length > t.length
                                        ? this.clone().iuxor(t)
                                        : t.clone().iuxor(this);
                                }),
                                (o.prototype.inotn = function(t) {
                                    n('number' == typeof t && t >= 0);
                                    var e = 0 | Math.ceil(t / 26),
                                        r = t % 26;
                                    this._expand(e), r > 0 && e--;
                                    for (var i = 0; i < e; i++)
                                        this.words[i] = 67108863 & ~this.words[i];
                                    return (
                                        r > 0 &&
                                            (this.words[i] =
                                                ~this.words[i] & (67108863 >> (26 - r))),
                                        this.strip()
                                    );
                                }),
                                (o.prototype.notn = function(t) {
                                    return this.clone().inotn(t);
                                }),
                                (o.prototype.setn = function(t, e) {
                                    n('number' == typeof t && t >= 0);
                                    var r = (t / 26) | 0,
                                        i = t % 26;
                                    return (
                                        this._expand(r + 1),
                                        (this.words[r] = e
                                            ? this.words[r] | (1 << i)
                                            : this.words[r] & ~(1 << i)),
                                        this.strip()
                                    );
                                }),
                                (o.prototype.iadd = function(t) {
                                    var e, r, n;
                                    if (0 !== this.negative && 0 === t.negative)
                                        return (
                                            (this.negative = 0),
                                            (e = this.isub(t)),
                                            (this.negative ^= 1),
                                            this._normSign()
                                        );
                                    if (0 === this.negative && 0 !== t.negative)
                                        return (
                                            (t.negative = 0),
                                            (e = this.isub(t)),
                                            (t.negative = 1),
                                            e._normSign()
                                        );
                                    this.length > t.length
                                        ? ((r = this), (n = t))
                                        : ((r = t), (n = this));
                                    for (var i = 0, o = 0; o < n.length; o++)
                                        (e = (0 | r.words[o]) + (0 | n.words[o]) + i),
                                            (this.words[o] = 67108863 & e),
                                            (i = e >>> 26);
                                    for (; 0 !== i && o < r.length; o++)
                                        (e = (0 | r.words[o]) + i),
                                            (this.words[o] = 67108863 & e),
                                            (i = e >>> 26);
                                    if (((this.length = r.length), 0 !== i))
                                        (this.words[this.length] = i), this.length++;
                                    else if (r !== this)
                                        for (; o < r.length; o++) this.words[o] = r.words[o];
                                    return this;
                                }),
                                (o.prototype.add = function(t) {
                                    var e;
                                    return 0 !== t.negative && 0 === this.negative
                                        ? ((t.negative = 0),
                                          (e = this.sub(t)),
                                          (t.negative ^= 1),
                                          e)
                                        : 0 === t.negative && 0 !== this.negative
                                        ? ((this.negative = 0),
                                          (e = t.sub(this)),
                                          (this.negative = 1),
                                          e)
                                        : this.length > t.length
                                        ? this.clone().iadd(t)
                                        : t.clone().iadd(this);
                                }),
                                (o.prototype.isub = function(t) {
                                    if (0 !== t.negative) {
                                        t.negative = 0;
                                        var e = this.iadd(t);
                                        return (t.negative = 1), e._normSign();
                                    }
                                    if (0 !== this.negative)
                                        return (
                                            (this.negative = 0),
                                            this.iadd(t),
                                            (this.negative = 1),
                                            this._normSign()
                                        );
                                    var r,
                                        n,
                                        i = this.cmp(t);
                                    if (0 === i)
                                        return (
                                            (this.negative = 0),
                                            (this.length = 1),
                                            (this.words[0] = 0),
                                            this
                                        );
                                    i > 0 ? ((r = this), (n = t)) : ((r = t), (n = this));
                                    for (var o = 0, s = 0; s < n.length; s++)
                                        (o = (e = (0 | r.words[s]) - (0 | n.words[s]) + o) >> 26),
                                            (this.words[s] = 67108863 & e);
                                    for (; 0 !== o && s < r.length; s++)
                                        (o = (e = (0 | r.words[s]) + o) >> 26),
                                            (this.words[s] = 67108863 & e);
                                    if (0 === o && s < r.length && r !== this)
                                        for (; s < r.length; s++) this.words[s] = r.words[s];
                                    return (
                                        (this.length = Math.max(this.length, s)),
                                        r !== this && (this.negative = 1),
                                        this.strip()
                                    );
                                }),
                                (o.prototype.sub = function(t) {
                                    return this.clone().isub(t);
                                });
                            var p = function(t, e, r) {
                                var n,
                                    i,
                                    o,
                                    s = t.words,
                                    u = e.words,
                                    a = r.words,
                                    h = 0,
                                    f = 0 | s[0],
                                    c = 8191 & f,
                                    l = f >>> 13,
                                    p = 0 | s[1],
                                    d = 8191 & p,
                                    g = p >>> 13,
                                    m = 0 | s[2],
                                    v = 8191 & m,
                                    y = m >>> 13,
                                    w = 0 | s[3],
                                    b = 8191 & w,
                                    _ = w >>> 13,
                                    M = 0 | s[4],
                                    E = 8191 & M,
                                    R = M >>> 13,
                                    S = 0 | s[5],
                                    O = 8191 & S,
                                    I = S >>> 13,
                                    A = 0 | s[6],
                                    N = 8191 & A,
                                    T = A >>> 13,
                                    B = 0 | s[7],
                                    x = 8191 & B,
                                    P = B >>> 13,
                                    k = 0 | s[8],
                                    C = 8191 & k,
                                    U = k >>> 13,
                                    D = 0 | s[9],
                                    j = 8191 & D,
                                    L = D >>> 13,
                                    F = 0 | u[0],
                                    q = 8191 & F,
                                    G = F >>> 13,
                                    Y = 0 | u[1],
                                    z = 8191 & Y,
                                    H = Y >>> 13,
                                    J = 0 | u[2],
                                    Z = 8191 & J,
                                    V = J >>> 13,
                                    W = 0 | u[3],
                                    K = 8191 & W,
                                    $ = W >>> 13,
                                    X = 0 | u[4],
                                    Q = 8191 & X,
                                    tt = X >>> 13,
                                    et = 0 | u[5],
                                    rt = 8191 & et,
                                    nt = et >>> 13,
                                    it = 0 | u[6],
                                    ot = 8191 & it,
                                    st = it >>> 13,
                                    ut = 0 | u[7],
                                    at = 8191 & ut,
                                    ht = ut >>> 13,
                                    ft = 0 | u[8],
                                    ct = 8191 & ft,
                                    lt = ft >>> 13,
                                    pt = 0 | u[9],
                                    dt = 8191 & pt,
                                    gt = pt >>> 13;
                                (r.negative = t.negative ^ e.negative), (r.length = 19);
                                var mt =
                                    (((h + (n = Math.imul(c, q))) | 0) +
                                        ((8191 &
                                            (i = ((i = Math.imul(c, G)) + Math.imul(l, q)) | 0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = Math.imul(l, G)) + (i >>> 13)) | 0) + (mt >>> 26)) | 0),
                                    (mt &= 67108863),
                                    (n = Math.imul(d, q)),
                                    (i = ((i = Math.imul(d, G)) + Math.imul(g, q)) | 0),
                                    (o = Math.imul(g, G));
                                var vt =
                                    (((h + (n = (n + Math.imul(c, z)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(c, H)) | 0) +
                                                    Math.imul(l, z)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(l, H)) | 0) + (i >>> 13)) | 0) +
                                        (vt >>> 26)) |
                                    0),
                                    (vt &= 67108863),
                                    (n = Math.imul(v, q)),
                                    (i = ((i = Math.imul(v, G)) + Math.imul(y, q)) | 0),
                                    (o = Math.imul(y, G)),
                                    (n = (n + Math.imul(d, z)) | 0),
                                    (i = ((i = (i + Math.imul(d, H)) | 0) + Math.imul(g, z)) | 0),
                                    (o = (o + Math.imul(g, H)) | 0);
                                var yt =
                                    (((h + (n = (n + Math.imul(c, Z)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(c, V)) | 0) +
                                                    Math.imul(l, Z)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(l, V)) | 0) + (i >>> 13)) | 0) +
                                        (yt >>> 26)) |
                                    0),
                                    (yt &= 67108863),
                                    (n = Math.imul(b, q)),
                                    (i = ((i = Math.imul(b, G)) + Math.imul(_, q)) | 0),
                                    (o = Math.imul(_, G)),
                                    (n = (n + Math.imul(v, z)) | 0),
                                    (i = ((i = (i + Math.imul(v, H)) | 0) + Math.imul(y, z)) | 0),
                                    (o = (o + Math.imul(y, H)) | 0),
                                    (n = (n + Math.imul(d, Z)) | 0),
                                    (i = ((i = (i + Math.imul(d, V)) | 0) + Math.imul(g, Z)) | 0),
                                    (o = (o + Math.imul(g, V)) | 0);
                                var wt =
                                    (((h + (n = (n + Math.imul(c, K)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(c, $)) | 0) +
                                                    Math.imul(l, K)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(l, $)) | 0) + (i >>> 13)) | 0) +
                                        (wt >>> 26)) |
                                    0),
                                    (wt &= 67108863),
                                    (n = Math.imul(E, q)),
                                    (i = ((i = Math.imul(E, G)) + Math.imul(R, q)) | 0),
                                    (o = Math.imul(R, G)),
                                    (n = (n + Math.imul(b, z)) | 0),
                                    (i = ((i = (i + Math.imul(b, H)) | 0) + Math.imul(_, z)) | 0),
                                    (o = (o + Math.imul(_, H)) | 0),
                                    (n = (n + Math.imul(v, Z)) | 0),
                                    (i = ((i = (i + Math.imul(v, V)) | 0) + Math.imul(y, Z)) | 0),
                                    (o = (o + Math.imul(y, V)) | 0),
                                    (n = (n + Math.imul(d, K)) | 0),
                                    (i = ((i = (i + Math.imul(d, $)) | 0) + Math.imul(g, K)) | 0),
                                    (o = (o + Math.imul(g, $)) | 0);
                                var bt =
                                    (((h + (n = (n + Math.imul(c, Q)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(c, tt)) | 0) +
                                                    Math.imul(l, Q)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(l, tt)) | 0) + (i >>> 13)) | 0) +
                                        (bt >>> 26)) |
                                    0),
                                    (bt &= 67108863),
                                    (n = Math.imul(O, q)),
                                    (i = ((i = Math.imul(O, G)) + Math.imul(I, q)) | 0),
                                    (o = Math.imul(I, G)),
                                    (n = (n + Math.imul(E, z)) | 0),
                                    (i = ((i = (i + Math.imul(E, H)) | 0) + Math.imul(R, z)) | 0),
                                    (o = (o + Math.imul(R, H)) | 0),
                                    (n = (n + Math.imul(b, Z)) | 0),
                                    (i = ((i = (i + Math.imul(b, V)) | 0) + Math.imul(_, Z)) | 0),
                                    (o = (o + Math.imul(_, V)) | 0),
                                    (n = (n + Math.imul(v, K)) | 0),
                                    (i = ((i = (i + Math.imul(v, $)) | 0) + Math.imul(y, K)) | 0),
                                    (o = (o + Math.imul(y, $)) | 0),
                                    (n = (n + Math.imul(d, Q)) | 0),
                                    (i = ((i = (i + Math.imul(d, tt)) | 0) + Math.imul(g, Q)) | 0),
                                    (o = (o + Math.imul(g, tt)) | 0);
                                var _t =
                                    (((h + (n = (n + Math.imul(c, rt)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(c, nt)) | 0) +
                                                    Math.imul(l, rt)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(l, nt)) | 0) + (i >>> 13)) | 0) +
                                        (_t >>> 26)) |
                                    0),
                                    (_t &= 67108863),
                                    (n = Math.imul(N, q)),
                                    (i = ((i = Math.imul(N, G)) + Math.imul(T, q)) | 0),
                                    (o = Math.imul(T, G)),
                                    (n = (n + Math.imul(O, z)) | 0),
                                    (i = ((i = (i + Math.imul(O, H)) | 0) + Math.imul(I, z)) | 0),
                                    (o = (o + Math.imul(I, H)) | 0),
                                    (n = (n + Math.imul(E, Z)) | 0),
                                    (i = ((i = (i + Math.imul(E, V)) | 0) + Math.imul(R, Z)) | 0),
                                    (o = (o + Math.imul(R, V)) | 0),
                                    (n = (n + Math.imul(b, K)) | 0),
                                    (i = ((i = (i + Math.imul(b, $)) | 0) + Math.imul(_, K)) | 0),
                                    (o = (o + Math.imul(_, $)) | 0),
                                    (n = (n + Math.imul(v, Q)) | 0),
                                    (i = ((i = (i + Math.imul(v, tt)) | 0) + Math.imul(y, Q)) | 0),
                                    (o = (o + Math.imul(y, tt)) | 0),
                                    (n = (n + Math.imul(d, rt)) | 0),
                                    (i = ((i = (i + Math.imul(d, nt)) | 0) + Math.imul(g, rt)) | 0),
                                    (o = (o + Math.imul(g, nt)) | 0);
                                var Mt =
                                    (((h + (n = (n + Math.imul(c, ot)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(c, st)) | 0) +
                                                    Math.imul(l, ot)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(l, st)) | 0) + (i >>> 13)) | 0) +
                                        (Mt >>> 26)) |
                                    0),
                                    (Mt &= 67108863),
                                    (n = Math.imul(x, q)),
                                    (i = ((i = Math.imul(x, G)) + Math.imul(P, q)) | 0),
                                    (o = Math.imul(P, G)),
                                    (n = (n + Math.imul(N, z)) | 0),
                                    (i = ((i = (i + Math.imul(N, H)) | 0) + Math.imul(T, z)) | 0),
                                    (o = (o + Math.imul(T, H)) | 0),
                                    (n = (n + Math.imul(O, Z)) | 0),
                                    (i = ((i = (i + Math.imul(O, V)) | 0) + Math.imul(I, Z)) | 0),
                                    (o = (o + Math.imul(I, V)) | 0),
                                    (n = (n + Math.imul(E, K)) | 0),
                                    (i = ((i = (i + Math.imul(E, $)) | 0) + Math.imul(R, K)) | 0),
                                    (o = (o + Math.imul(R, $)) | 0),
                                    (n = (n + Math.imul(b, Q)) | 0),
                                    (i = ((i = (i + Math.imul(b, tt)) | 0) + Math.imul(_, Q)) | 0),
                                    (o = (o + Math.imul(_, tt)) | 0),
                                    (n = (n + Math.imul(v, rt)) | 0),
                                    (i = ((i = (i + Math.imul(v, nt)) | 0) + Math.imul(y, rt)) | 0),
                                    (o = (o + Math.imul(y, nt)) | 0),
                                    (n = (n + Math.imul(d, ot)) | 0),
                                    (i = ((i = (i + Math.imul(d, st)) | 0) + Math.imul(g, ot)) | 0),
                                    (o = (o + Math.imul(g, st)) | 0);
                                var Et =
                                    (((h + (n = (n + Math.imul(c, at)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(c, ht)) | 0) +
                                                    Math.imul(l, at)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(l, ht)) | 0) + (i >>> 13)) | 0) +
                                        (Et >>> 26)) |
                                    0),
                                    (Et &= 67108863),
                                    (n = Math.imul(C, q)),
                                    (i = ((i = Math.imul(C, G)) + Math.imul(U, q)) | 0),
                                    (o = Math.imul(U, G)),
                                    (n = (n + Math.imul(x, z)) | 0),
                                    (i = ((i = (i + Math.imul(x, H)) | 0) + Math.imul(P, z)) | 0),
                                    (o = (o + Math.imul(P, H)) | 0),
                                    (n = (n + Math.imul(N, Z)) | 0),
                                    (i = ((i = (i + Math.imul(N, V)) | 0) + Math.imul(T, Z)) | 0),
                                    (o = (o + Math.imul(T, V)) | 0),
                                    (n = (n + Math.imul(O, K)) | 0),
                                    (i = ((i = (i + Math.imul(O, $)) | 0) + Math.imul(I, K)) | 0),
                                    (o = (o + Math.imul(I, $)) | 0),
                                    (n = (n + Math.imul(E, Q)) | 0),
                                    (i = ((i = (i + Math.imul(E, tt)) | 0) + Math.imul(R, Q)) | 0),
                                    (o = (o + Math.imul(R, tt)) | 0),
                                    (n = (n + Math.imul(b, rt)) | 0),
                                    (i = ((i = (i + Math.imul(b, nt)) | 0) + Math.imul(_, rt)) | 0),
                                    (o = (o + Math.imul(_, nt)) | 0),
                                    (n = (n + Math.imul(v, ot)) | 0),
                                    (i = ((i = (i + Math.imul(v, st)) | 0) + Math.imul(y, ot)) | 0),
                                    (o = (o + Math.imul(y, st)) | 0),
                                    (n = (n + Math.imul(d, at)) | 0),
                                    (i = ((i = (i + Math.imul(d, ht)) | 0) + Math.imul(g, at)) | 0),
                                    (o = (o + Math.imul(g, ht)) | 0);
                                var Rt =
                                    (((h + (n = (n + Math.imul(c, ct)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(c, lt)) | 0) +
                                                    Math.imul(l, ct)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(l, lt)) | 0) + (i >>> 13)) | 0) +
                                        (Rt >>> 26)) |
                                    0),
                                    (Rt &= 67108863),
                                    (n = Math.imul(j, q)),
                                    (i = ((i = Math.imul(j, G)) + Math.imul(L, q)) | 0),
                                    (o = Math.imul(L, G)),
                                    (n = (n + Math.imul(C, z)) | 0),
                                    (i = ((i = (i + Math.imul(C, H)) | 0) + Math.imul(U, z)) | 0),
                                    (o = (o + Math.imul(U, H)) | 0),
                                    (n = (n + Math.imul(x, Z)) | 0),
                                    (i = ((i = (i + Math.imul(x, V)) | 0) + Math.imul(P, Z)) | 0),
                                    (o = (o + Math.imul(P, V)) | 0),
                                    (n = (n + Math.imul(N, K)) | 0),
                                    (i = ((i = (i + Math.imul(N, $)) | 0) + Math.imul(T, K)) | 0),
                                    (o = (o + Math.imul(T, $)) | 0),
                                    (n = (n + Math.imul(O, Q)) | 0),
                                    (i = ((i = (i + Math.imul(O, tt)) | 0) + Math.imul(I, Q)) | 0),
                                    (o = (o + Math.imul(I, tt)) | 0),
                                    (n = (n + Math.imul(E, rt)) | 0),
                                    (i = ((i = (i + Math.imul(E, nt)) | 0) + Math.imul(R, rt)) | 0),
                                    (o = (o + Math.imul(R, nt)) | 0),
                                    (n = (n + Math.imul(b, ot)) | 0),
                                    (i = ((i = (i + Math.imul(b, st)) | 0) + Math.imul(_, ot)) | 0),
                                    (o = (o + Math.imul(_, st)) | 0),
                                    (n = (n + Math.imul(v, at)) | 0),
                                    (i = ((i = (i + Math.imul(v, ht)) | 0) + Math.imul(y, at)) | 0),
                                    (o = (o + Math.imul(y, ht)) | 0),
                                    (n = (n + Math.imul(d, ct)) | 0),
                                    (i = ((i = (i + Math.imul(d, lt)) | 0) + Math.imul(g, ct)) | 0),
                                    (o = (o + Math.imul(g, lt)) | 0);
                                var St =
                                    (((h + (n = (n + Math.imul(c, dt)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(c, gt)) | 0) +
                                                    Math.imul(l, dt)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(l, gt)) | 0) + (i >>> 13)) | 0) +
                                        (St >>> 26)) |
                                    0),
                                    (St &= 67108863),
                                    (n = Math.imul(j, z)),
                                    (i = ((i = Math.imul(j, H)) + Math.imul(L, z)) | 0),
                                    (o = Math.imul(L, H)),
                                    (n = (n + Math.imul(C, Z)) | 0),
                                    (i = ((i = (i + Math.imul(C, V)) | 0) + Math.imul(U, Z)) | 0),
                                    (o = (o + Math.imul(U, V)) | 0),
                                    (n = (n + Math.imul(x, K)) | 0),
                                    (i = ((i = (i + Math.imul(x, $)) | 0) + Math.imul(P, K)) | 0),
                                    (o = (o + Math.imul(P, $)) | 0),
                                    (n = (n + Math.imul(N, Q)) | 0),
                                    (i = ((i = (i + Math.imul(N, tt)) | 0) + Math.imul(T, Q)) | 0),
                                    (o = (o + Math.imul(T, tt)) | 0),
                                    (n = (n + Math.imul(O, rt)) | 0),
                                    (i = ((i = (i + Math.imul(O, nt)) | 0) + Math.imul(I, rt)) | 0),
                                    (o = (o + Math.imul(I, nt)) | 0),
                                    (n = (n + Math.imul(E, ot)) | 0),
                                    (i = ((i = (i + Math.imul(E, st)) | 0) + Math.imul(R, ot)) | 0),
                                    (o = (o + Math.imul(R, st)) | 0),
                                    (n = (n + Math.imul(b, at)) | 0),
                                    (i = ((i = (i + Math.imul(b, ht)) | 0) + Math.imul(_, at)) | 0),
                                    (o = (o + Math.imul(_, ht)) | 0),
                                    (n = (n + Math.imul(v, ct)) | 0),
                                    (i = ((i = (i + Math.imul(v, lt)) | 0) + Math.imul(y, ct)) | 0),
                                    (o = (o + Math.imul(y, lt)) | 0);
                                var Ot =
                                    (((h + (n = (n + Math.imul(d, dt)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(d, gt)) | 0) +
                                                    Math.imul(g, dt)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(g, gt)) | 0) + (i >>> 13)) | 0) +
                                        (Ot >>> 26)) |
                                    0),
                                    (Ot &= 67108863),
                                    (n = Math.imul(j, Z)),
                                    (i = ((i = Math.imul(j, V)) + Math.imul(L, Z)) | 0),
                                    (o = Math.imul(L, V)),
                                    (n = (n + Math.imul(C, K)) | 0),
                                    (i = ((i = (i + Math.imul(C, $)) | 0) + Math.imul(U, K)) | 0),
                                    (o = (o + Math.imul(U, $)) | 0),
                                    (n = (n + Math.imul(x, Q)) | 0),
                                    (i = ((i = (i + Math.imul(x, tt)) | 0) + Math.imul(P, Q)) | 0),
                                    (o = (o + Math.imul(P, tt)) | 0),
                                    (n = (n + Math.imul(N, rt)) | 0),
                                    (i = ((i = (i + Math.imul(N, nt)) | 0) + Math.imul(T, rt)) | 0),
                                    (o = (o + Math.imul(T, nt)) | 0),
                                    (n = (n + Math.imul(O, ot)) | 0),
                                    (i = ((i = (i + Math.imul(O, st)) | 0) + Math.imul(I, ot)) | 0),
                                    (o = (o + Math.imul(I, st)) | 0),
                                    (n = (n + Math.imul(E, at)) | 0),
                                    (i = ((i = (i + Math.imul(E, ht)) | 0) + Math.imul(R, at)) | 0),
                                    (o = (o + Math.imul(R, ht)) | 0),
                                    (n = (n + Math.imul(b, ct)) | 0),
                                    (i = ((i = (i + Math.imul(b, lt)) | 0) + Math.imul(_, ct)) | 0),
                                    (o = (o + Math.imul(_, lt)) | 0);
                                var It =
                                    (((h + (n = (n + Math.imul(v, dt)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(v, gt)) | 0) +
                                                    Math.imul(y, dt)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(y, gt)) | 0) + (i >>> 13)) | 0) +
                                        (It >>> 26)) |
                                    0),
                                    (It &= 67108863),
                                    (n = Math.imul(j, K)),
                                    (i = ((i = Math.imul(j, $)) + Math.imul(L, K)) | 0),
                                    (o = Math.imul(L, $)),
                                    (n = (n + Math.imul(C, Q)) | 0),
                                    (i = ((i = (i + Math.imul(C, tt)) | 0) + Math.imul(U, Q)) | 0),
                                    (o = (o + Math.imul(U, tt)) | 0),
                                    (n = (n + Math.imul(x, rt)) | 0),
                                    (i = ((i = (i + Math.imul(x, nt)) | 0) + Math.imul(P, rt)) | 0),
                                    (o = (o + Math.imul(P, nt)) | 0),
                                    (n = (n + Math.imul(N, ot)) | 0),
                                    (i = ((i = (i + Math.imul(N, st)) | 0) + Math.imul(T, ot)) | 0),
                                    (o = (o + Math.imul(T, st)) | 0),
                                    (n = (n + Math.imul(O, at)) | 0),
                                    (i = ((i = (i + Math.imul(O, ht)) | 0) + Math.imul(I, at)) | 0),
                                    (o = (o + Math.imul(I, ht)) | 0),
                                    (n = (n + Math.imul(E, ct)) | 0),
                                    (i = ((i = (i + Math.imul(E, lt)) | 0) + Math.imul(R, ct)) | 0),
                                    (o = (o + Math.imul(R, lt)) | 0);
                                var At =
                                    (((h + (n = (n + Math.imul(b, dt)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(b, gt)) | 0) +
                                                    Math.imul(_, dt)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(_, gt)) | 0) + (i >>> 13)) | 0) +
                                        (At >>> 26)) |
                                    0),
                                    (At &= 67108863),
                                    (n = Math.imul(j, Q)),
                                    (i = ((i = Math.imul(j, tt)) + Math.imul(L, Q)) | 0),
                                    (o = Math.imul(L, tt)),
                                    (n = (n + Math.imul(C, rt)) | 0),
                                    (i = ((i = (i + Math.imul(C, nt)) | 0) + Math.imul(U, rt)) | 0),
                                    (o = (o + Math.imul(U, nt)) | 0),
                                    (n = (n + Math.imul(x, ot)) | 0),
                                    (i = ((i = (i + Math.imul(x, st)) | 0) + Math.imul(P, ot)) | 0),
                                    (o = (o + Math.imul(P, st)) | 0),
                                    (n = (n + Math.imul(N, at)) | 0),
                                    (i = ((i = (i + Math.imul(N, ht)) | 0) + Math.imul(T, at)) | 0),
                                    (o = (o + Math.imul(T, ht)) | 0),
                                    (n = (n + Math.imul(O, ct)) | 0),
                                    (i = ((i = (i + Math.imul(O, lt)) | 0) + Math.imul(I, ct)) | 0),
                                    (o = (o + Math.imul(I, lt)) | 0);
                                var Nt =
                                    (((h + (n = (n + Math.imul(E, dt)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(E, gt)) | 0) +
                                                    Math.imul(R, dt)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(R, gt)) | 0) + (i >>> 13)) | 0) +
                                        (Nt >>> 26)) |
                                    0),
                                    (Nt &= 67108863),
                                    (n = Math.imul(j, rt)),
                                    (i = ((i = Math.imul(j, nt)) + Math.imul(L, rt)) | 0),
                                    (o = Math.imul(L, nt)),
                                    (n = (n + Math.imul(C, ot)) | 0),
                                    (i = ((i = (i + Math.imul(C, st)) | 0) + Math.imul(U, ot)) | 0),
                                    (o = (o + Math.imul(U, st)) | 0),
                                    (n = (n + Math.imul(x, at)) | 0),
                                    (i = ((i = (i + Math.imul(x, ht)) | 0) + Math.imul(P, at)) | 0),
                                    (o = (o + Math.imul(P, ht)) | 0),
                                    (n = (n + Math.imul(N, ct)) | 0),
                                    (i = ((i = (i + Math.imul(N, lt)) | 0) + Math.imul(T, ct)) | 0),
                                    (o = (o + Math.imul(T, lt)) | 0);
                                var Tt =
                                    (((h + (n = (n + Math.imul(O, dt)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(O, gt)) | 0) +
                                                    Math.imul(I, dt)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(I, gt)) | 0) + (i >>> 13)) | 0) +
                                        (Tt >>> 26)) |
                                    0),
                                    (Tt &= 67108863),
                                    (n = Math.imul(j, ot)),
                                    (i = ((i = Math.imul(j, st)) + Math.imul(L, ot)) | 0),
                                    (o = Math.imul(L, st)),
                                    (n = (n + Math.imul(C, at)) | 0),
                                    (i = ((i = (i + Math.imul(C, ht)) | 0) + Math.imul(U, at)) | 0),
                                    (o = (o + Math.imul(U, ht)) | 0),
                                    (n = (n + Math.imul(x, ct)) | 0),
                                    (i = ((i = (i + Math.imul(x, lt)) | 0) + Math.imul(P, ct)) | 0),
                                    (o = (o + Math.imul(P, lt)) | 0);
                                var Bt =
                                    (((h + (n = (n + Math.imul(N, dt)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(N, gt)) | 0) +
                                                    Math.imul(T, dt)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(T, gt)) | 0) + (i >>> 13)) | 0) +
                                        (Bt >>> 26)) |
                                    0),
                                    (Bt &= 67108863),
                                    (n = Math.imul(j, at)),
                                    (i = ((i = Math.imul(j, ht)) + Math.imul(L, at)) | 0),
                                    (o = Math.imul(L, ht)),
                                    (n = (n + Math.imul(C, ct)) | 0),
                                    (i = ((i = (i + Math.imul(C, lt)) | 0) + Math.imul(U, ct)) | 0),
                                    (o = (o + Math.imul(U, lt)) | 0);
                                var xt =
                                    (((h + (n = (n + Math.imul(x, dt)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(x, gt)) | 0) +
                                                    Math.imul(P, dt)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(P, gt)) | 0) + (i >>> 13)) | 0) +
                                        (xt >>> 26)) |
                                    0),
                                    (xt &= 67108863),
                                    (n = Math.imul(j, ct)),
                                    (i = ((i = Math.imul(j, lt)) + Math.imul(L, ct)) | 0),
                                    (o = Math.imul(L, lt));
                                var Pt =
                                    (((h + (n = (n + Math.imul(C, dt)) | 0)) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = (i + Math.imul(C, gt)) | 0) +
                                                    Math.imul(U, dt)) |
                                                0)) <<
                                            13)) |
                                    0;
                                (h =
                                    ((((o = (o + Math.imul(U, gt)) | 0) + (i >>> 13)) | 0) +
                                        (Pt >>> 26)) |
                                    0),
                                    (Pt &= 67108863);
                                var kt =
                                    (((h + (n = Math.imul(j, dt))) | 0) +
                                        ((8191 &
                                            (i =
                                                ((i = Math.imul(j, gt)) + Math.imul(L, dt)) | 0)) <<
                                            13)) |
                                    0;
                                return (
                                    (h =
                                        ((((o = Math.imul(L, gt)) + (i >>> 13)) | 0) +
                                            (kt >>> 26)) |
                                        0),
                                    (kt &= 67108863),
                                    (a[0] = mt),
                                    (a[1] = vt),
                                    (a[2] = yt),
                                    (a[3] = wt),
                                    (a[4] = bt),
                                    (a[5] = _t),
                                    (a[6] = Mt),
                                    (a[7] = Et),
                                    (a[8] = Rt),
                                    (a[9] = St),
                                    (a[10] = Ot),
                                    (a[11] = It),
                                    (a[12] = At),
                                    (a[13] = Nt),
                                    (a[14] = Tt),
                                    (a[15] = Bt),
                                    (a[16] = xt),
                                    (a[17] = Pt),
                                    (a[18] = kt),
                                    0 !== h && ((a[19] = h), r.length++),
                                    r
                                );
                            };
                            function d(t, e, r) {
                                return new g().mulp(t, e, r);
                            }
                            function g(t, e) {
                                (this.x = t), (this.y = e);
                            }
                            Math.imul || (p = l),
                                (o.prototype.mulTo = function(t, e) {
                                    var r = this.length + t.length;
                                    return 10 === this.length && 10 === t.length
                                        ? p(this, t, e)
                                        : r < 63
                                        ? l(this, t, e)
                                        : r < 1024
                                        ? (function(t, e, r) {
                                              (r.negative = e.negative ^ t.negative),
                                                  (r.length = t.length + e.length);
                                              for (var n = 0, i = 0, o = 0; o < r.length - 1; o++) {
                                                  var s = i;
                                                  i = 0;
                                                  for (
                                                      var u = 67108863 & n,
                                                          a = Math.min(o, e.length - 1),
                                                          h = Math.max(0, o - t.length + 1);
                                                      h <= a;
                                                      h++
                                                  ) {
                                                      var f = o - h,
                                                          c = (0 | t.words[f]) * (0 | e.words[h]),
                                                          l = 67108863 & c;
                                                      (u = 67108863 & (l = (l + u) | 0)),
                                                          (i +=
                                                              (s =
                                                                  ((s =
                                                                      (s + ((c / 67108864) | 0)) |
                                                                      0) +
                                                                      (l >>> 26)) |
                                                                  0) >>> 26),
                                                          (s &= 67108863);
                                                  }
                                                  (r.words[o] = u), (n = s), (s = i);
                                              }
                                              return (
                                                  0 !== n ? (r.words[o] = n) : r.length--, r.strip()
                                              );
                                          })(this, t, e)
                                        : d(this, t, e);
                                }),
                                (g.prototype.makeRBT = function(t) {
                                    for (
                                        var e = new Array(t),
                                            r = o.prototype._countBits(t) - 1,
                                            n = 0;
                                        n < t;
                                        n++
                                    )
                                        e[n] = this.revBin(n, r, t);
                                    return e;
                                }),
                                (g.prototype.revBin = function(t, e, r) {
                                    if (0 === t || t === r - 1) return t;
                                    for (var n = 0, i = 0; i < e; i++)
                                        (n |= (1 & t) << (e - i - 1)), (t >>= 1);
                                    return n;
                                }),
                                (g.prototype.permute = function(t, e, r, n, i, o) {
                                    for (var s = 0; s < o; s++) (n[s] = e[t[s]]), (i[s] = r[t[s]]);
                                }),
                                (g.prototype.transform = function(t, e, r, n, i, o) {
                                    this.permute(o, t, e, r, n, i);
                                    for (var s = 1; s < i; s <<= 1)
                                        for (
                                            var u = s << 1,
                                                a = Math.cos((2 * Math.PI) / u),
                                                h = Math.sin((2 * Math.PI) / u),
                                                f = 0;
                                            f < i;
                                            f += u
                                        )
                                            for (var c = a, l = h, p = 0; p < s; p++) {
                                                var d = r[f + p],
                                                    g = n[f + p],
                                                    m = r[f + p + s],
                                                    v = n[f + p + s],
                                                    y = c * m - l * v;
                                                (v = c * v + l * m),
                                                    (m = y),
                                                    (r[f + p] = d + m),
                                                    (n[f + p] = g + v),
                                                    (r[f + p + s] = d - m),
                                                    (n[f + p + s] = g - v),
                                                    p !== u &&
                                                        ((y = a * c - h * l),
                                                        (l = a * l + h * c),
                                                        (c = y));
                                            }
                                }),
                                (g.prototype.guessLen13b = function(t, e) {
                                    var r = 1 | Math.max(e, t),
                                        n = 1 & r,
                                        i = 0;
                                    for (r = (r / 2) | 0; r; r >>>= 1) i++;
                                    return 1 << (i + 1 + n);
                                }),
                                (g.prototype.conjugate = function(t, e, r) {
                                    if (!(r <= 1))
                                        for (var n = 0; n < r / 2; n++) {
                                            var i = t[n];
                                            (t[n] = t[r - n - 1]),
                                                (t[r - n - 1] = i),
                                                (i = e[n]),
                                                (e[n] = -e[r - n - 1]),
                                                (e[r - n - 1] = -i);
                                        }
                                }),
                                (g.prototype.normalize13b = function(t, e) {
                                    for (var r = 0, n = 0; n < e / 2; n++) {
                                        var i =
                                            8192 * Math.round(t[2 * n + 1] / e) +
                                            Math.round(t[2 * n] / e) +
                                            r;
                                        (t[n] = 67108863 & i),
                                            (r = i < 67108864 ? 0 : (i / 67108864) | 0);
                                    }
                                    return t;
                                }),
                                (g.prototype.convert13b = function(t, e, r, i) {
                                    for (var o = 0, s = 0; s < e; s++)
                                        (o += 0 | t[s]),
                                            (r[2 * s] = 8191 & o),
                                            (o >>>= 13),
                                            (r[2 * s + 1] = 8191 & o),
                                            (o >>>= 13);
                                    for (s = 2 * e; s < i; ++s) r[s] = 0;
                                    n(0 === o), n(0 == (-8192 & o));
                                }),
                                (g.prototype.stub = function(t) {
                                    for (var e = new Array(t), r = 0; r < t; r++) e[r] = 0;
                                    return e;
                                }),
                                (g.prototype.mulp = function(t, e, r) {
                                    var n = 2 * this.guessLen13b(t.length, e.length),
                                        i = this.makeRBT(n),
                                        o = this.stub(n),
                                        s = new Array(n),
                                        u = new Array(n),
                                        a = new Array(n),
                                        h = new Array(n),
                                        f = new Array(n),
                                        c = new Array(n),
                                        l = r.words;
                                    (l.length = n),
                                        this.convert13b(t.words, t.length, s, n),
                                        this.convert13b(e.words, e.length, h, n),
                                        this.transform(s, o, u, a, n, i),
                                        this.transform(h, o, f, c, n, i);
                                    for (var p = 0; p < n; p++) {
                                        var d = u[p] * f[p] - a[p] * c[p];
                                        (a[p] = u[p] * c[p] + a[p] * f[p]), (u[p] = d);
                                    }
                                    return (
                                        this.conjugate(u, a, n),
                                        this.transform(u, a, l, o, n, i),
                                        this.conjugate(l, o, n),
                                        this.normalize13b(l, n),
                                        (r.negative = t.negative ^ e.negative),
                                        (r.length = t.length + e.length),
                                        r.strip()
                                    );
                                }),
                                (o.prototype.mul = function(t) {
                                    var e = new o(null);
                                    return (
                                        (e.words = new Array(this.length + t.length)),
                                        this.mulTo(t, e)
                                    );
                                }),
                                (o.prototype.mulf = function(t) {
                                    var e = new o(null);
                                    return (
                                        (e.words = new Array(this.length + t.length)), d(this, t, e)
                                    );
                                }),
                                (o.prototype.imul = function(t) {
                                    return this.clone().mulTo(t, this);
                                }),
                                (o.prototype.imuln = function(t) {
                                    n('number' == typeof t), n(t < 67108864);
                                    for (var e = 0, r = 0; r < this.length; r++) {
                                        var i = (0 | this.words[r]) * t,
                                            o = (67108863 & i) + (67108863 & e);
                                        (e >>= 26),
                                            (e += (i / 67108864) | 0),
                                            (e += o >>> 26),
                                            (this.words[r] = 67108863 & o);
                                    }
                                    return 0 !== e && ((this.words[r] = e), this.length++), this;
                                }),
                                (o.prototype.muln = function(t) {
                                    return this.clone().imuln(t);
                                }),
                                (o.prototype.sqr = function() {
                                    return this.mul(this);
                                }),
                                (o.prototype.isqr = function() {
                                    return this.imul(this.clone());
                                }),
                                (o.prototype.pow = function(t) {
                                    var e = (function(t) {
                                        for (
                                            var e = new Array(t.bitLength()), r = 0;
                                            r < e.length;
                                            r++
                                        ) {
                                            var n = (r / 26) | 0,
                                                i = r % 26;
                                            e[r] = (t.words[n] & (1 << i)) >>> i;
                                        }
                                        return e;
                                    })(t);
                                    if (0 === e.length) return new o(1);
                                    for (
                                        var r = this, n = 0;
                                        n < e.length && 0 === e[n];
                                        n++, r = r.sqr()
                                    );
                                    if (++n < e.length)
                                        for (var i = r.sqr(); n < e.length; n++, i = i.sqr())
                                            0 !== e[n] && (r = r.mul(i));
                                    return r;
                                }),
                                (o.prototype.iushln = function(t) {
                                    n('number' == typeof t && t >= 0);
                                    var e,
                                        r = t % 26,
                                        i = (t - r) / 26,
                                        o = (67108863 >>> (26 - r)) << (26 - r);
                                    if (0 !== r) {
                                        var s = 0;
                                        for (e = 0; e < this.length; e++) {
                                            var u = this.words[e] & o,
                                                a = ((0 | this.words[e]) - u) << r;
                                            (this.words[e] = a | s), (s = u >>> (26 - r));
                                        }
                                        s && ((this.words[e] = s), this.length++);
                                    }
                                    if (0 !== i) {
                                        for (e = this.length - 1; e >= 0; e--)
                                            this.words[e + i] = this.words[e];
                                        for (e = 0; e < i; e++) this.words[e] = 0;
                                        this.length += i;
                                    }
                                    return this.strip();
                                }),
                                (o.prototype.ishln = function(t) {
                                    return n(0 === this.negative), this.iushln(t);
                                }),
                                (o.prototype.iushrn = function(t, e, r) {
                                    var i;
                                    n('number' == typeof t && t >= 0),
                                        (i = e ? (e - (e % 26)) / 26 : 0);
                                    var o = t % 26,
                                        s = Math.min((t - o) / 26, this.length),
                                        u = 67108863 ^ ((67108863 >>> o) << o),
                                        a = r;
                                    if (((i -= s), (i = Math.max(0, i)), a)) {
                                        for (var h = 0; h < s; h++) a.words[h] = this.words[h];
                                        a.length = s;
                                    }
                                    if (0 === s);
                                    else if (this.length > s)
                                        for (this.length -= s, h = 0; h < this.length; h++)
                                            this.words[h] = this.words[h + s];
                                    else (this.words[0] = 0), (this.length = 1);
                                    var f = 0;
                                    for (h = this.length - 1; h >= 0 && (0 !== f || h >= i); h--) {
                                        var c = 0 | this.words[h];
                                        (this.words[h] = (f << (26 - o)) | (c >>> o)), (f = c & u);
                                    }
                                    return (
                                        a && 0 !== f && (a.words[a.length++] = f),
                                        0 === this.length &&
                                            ((this.words[0] = 0), (this.length = 1)),
                                        this.strip()
                                    );
                                }),
                                (o.prototype.ishrn = function(t, e, r) {
                                    return n(0 === this.negative), this.iushrn(t, e, r);
                                }),
                                (o.prototype.shln = function(t) {
                                    return this.clone().ishln(t);
                                }),
                                (o.prototype.ushln = function(t) {
                                    return this.clone().iushln(t);
                                }),
                                (o.prototype.shrn = function(t) {
                                    return this.clone().ishrn(t);
                                }),
                                (o.prototype.ushrn = function(t) {
                                    return this.clone().iushrn(t);
                                }),
                                (o.prototype.testn = function(t) {
                                    n('number' == typeof t && t >= 0);
                                    var e = t % 26,
                                        r = (t - e) / 26,
                                        i = 1 << e;
                                    return !(this.length <= r || !(this.words[r] & i));
                                }),
                                (o.prototype.imaskn = function(t) {
                                    n('number' == typeof t && t >= 0);
                                    var e = t % 26,
                                        r = (t - e) / 26;
                                    if (
                                        (n(
                                            0 === this.negative,
                                            'imaskn works only with positive numbers'
                                        ),
                                        this.length <= r)
                                    )
                                        return this;
                                    if (
                                        (0 !== e && r++,
                                        (this.length = Math.min(r, this.length)),
                                        0 !== e)
                                    ) {
                                        var i = 67108863 ^ ((67108863 >>> e) << e);
                                        this.words[this.length - 1] &= i;
                                    }
                                    return this.strip();
                                }),
                                (o.prototype.maskn = function(t) {
                                    return this.clone().imaskn(t);
                                }),
                                (o.prototype.iaddn = function(t) {
                                    return (
                                        n('number' == typeof t),
                                        n(t < 67108864),
                                        t < 0
                                            ? this.isubn(-t)
                                            : 0 !== this.negative
                                            ? 1 === this.length && (0 | this.words[0]) < t
                                                ? ((this.words[0] = t - (0 | this.words[0])),
                                                  (this.negative = 0),
                                                  this)
                                                : ((this.negative = 0),
                                                  this.isubn(t),
                                                  (this.negative = 1),
                                                  this)
                                            : this._iaddn(t)
                                    );
                                }),
                                (o.prototype._iaddn = function(t) {
                                    this.words[0] += t;
                                    for (
                                        var e = 0;
                                        e < this.length && this.words[e] >= 67108864;
                                        e++
                                    )
                                        (this.words[e] -= 67108864),
                                            e === this.length - 1
                                                ? (this.words[e + 1] = 1)
                                                : this.words[e + 1]++;
                                    return (this.length = Math.max(this.length, e + 1)), this;
                                }),
                                (o.prototype.isubn = function(t) {
                                    if ((n('number' == typeof t), n(t < 67108864), t < 0))
                                        return this.iaddn(-t);
                                    if (0 !== this.negative)
                                        return (
                                            (this.negative = 0),
                                            this.iaddn(t),
                                            (this.negative = 1),
                                            this
                                        );
                                    if (
                                        ((this.words[0] -= t),
                                        1 === this.length && this.words[0] < 0)
                                    )
                                        (this.words[0] = -this.words[0]), (this.negative = 1);
                                    else
                                        for (var e = 0; e < this.length && this.words[e] < 0; e++)
                                            (this.words[e] += 67108864), (this.words[e + 1] -= 1);
                                    return this.strip();
                                }),
                                (o.prototype.addn = function(t) {
                                    return this.clone().iaddn(t);
                                }),
                                (o.prototype.subn = function(t) {
                                    return this.clone().isubn(t);
                                }),
                                (o.prototype.iabs = function() {
                                    return (this.negative = 0), this;
                                }),
                                (o.prototype.abs = function() {
                                    return this.clone().iabs();
                                }),
                                (o.prototype._ishlnsubmul = function(t, e, r) {
                                    var i,
                                        o,
                                        s = t.length + r;
                                    this._expand(s);
                                    var u = 0;
                                    for (i = 0; i < t.length; i++) {
                                        o = (0 | this.words[i + r]) + u;
                                        var a = (0 | t.words[i]) * e;
                                        (u = ((o -= 67108863 & a) >> 26) - ((a / 67108864) | 0)),
                                            (this.words[i + r] = 67108863 & o);
                                    }
                                    for (; i < this.length - r; i++)
                                        (u = (o = (0 | this.words[i + r]) + u) >> 26),
                                            (this.words[i + r] = 67108863 & o);
                                    if (0 === u) return this.strip();
                                    for (n(-1 === u), u = 0, i = 0; i < this.length; i++)
                                        (u = (o = -(0 | this.words[i]) + u) >> 26),
                                            (this.words[i] = 67108863 & o);
                                    return (this.negative = 1), this.strip();
                                }),
                                (o.prototype._wordDiv = function(t, e) {
                                    var r = (this.length, t.length),
                                        n = this.clone(),
                                        i = t,
                                        s = 0 | i.words[i.length - 1];
                                    0 != (r = 26 - this._countBits(s)) &&
                                        ((i = i.ushln(r)),
                                        n.iushln(r),
                                        (s = 0 | i.words[i.length - 1]));
                                    var u,
                                        a = n.length - i.length;
                                    if ('mod' !== e) {
                                        ((u = new o(null)).length = a + 1),
                                            (u.words = new Array(u.length));
                                        for (var h = 0; h < u.length; h++) u.words[h] = 0;
                                    }
                                    var f = n.clone()._ishlnsubmul(i, 1, a);
                                    0 === f.negative && ((n = f), u && (u.words[a] = 1));
                                    for (var c = a - 1; c >= 0; c--) {
                                        var l =
                                            67108864 * (0 | n.words[i.length + c]) +
                                            (0 | n.words[i.length + c - 1]);
                                        for (
                                            l = Math.min((l / s) | 0, 67108863),
                                                n._ishlnsubmul(i, l, c);
                                            0 !== n.negative;

                                        )
                                            l--,
                                                (n.negative = 0),
                                                n._ishlnsubmul(i, 1, c),
                                                n.isZero() || (n.negative ^= 1);
                                        u && (u.words[c] = l);
                                    }
                                    return (
                                        u && u.strip(),
                                        n.strip(),
                                        'div' !== e && 0 !== r && n.iushrn(r),
                                        { div: u || null, mod: n }
                                    );
                                }),
                                (o.prototype.divmod = function(t, e, r) {
                                    return (
                                        n(!t.isZero()),
                                        this.isZero()
                                            ? { div: new o(0), mod: new o(0) }
                                            : 0 !== this.negative && 0 === t.negative
                                            ? ((u = this.neg().divmod(t, e)),
                                              'mod' !== e && (i = u.div.neg()),
                                              'div' !== e &&
                                                  ((s = u.mod.neg()),
                                                  r && 0 !== s.negative && s.iadd(t)),
                                              { div: i, mod: s })
                                            : 0 === this.negative && 0 !== t.negative
                                            ? ((u = this.divmod(t.neg(), e)),
                                              'mod' !== e && (i = u.div.neg()),
                                              { div: i, mod: u.mod })
                                            : 0 != (this.negative & t.negative)
                                            ? ((u = this.neg().divmod(t.neg(), e)),
                                              'div' !== e &&
                                                  ((s = u.mod.neg()),
                                                  r && 0 !== s.negative && s.isub(t)),
                                              { div: u.div, mod: s })
                                            : t.length > this.length || this.cmp(t) < 0
                                            ? { div: new o(0), mod: this }
                                            : 1 === t.length
                                            ? 'div' === e
                                                ? { div: this.divn(t.words[0]), mod: null }
                                                : 'mod' === e
                                                ? { div: null, mod: new o(this.modn(t.words[0])) }
                                                : {
                                                      div: this.divn(t.words[0]),
                                                      mod: new o(this.modn(t.words[0]))
                                                  }
                                            : this._wordDiv(t, e)
                                    );
                                    var i, s, u;
                                }),
                                (o.prototype.div = function(t) {
                                    return this.divmod(t, 'div', !1).div;
                                }),
                                (o.prototype.mod = function(t) {
                                    return this.divmod(t, 'mod', !1).mod;
                                }),
                                (o.prototype.umod = function(t) {
                                    return this.divmod(t, 'mod', !0).mod;
                                }),
                                (o.prototype.divRound = function(t) {
                                    var e = this.divmod(t);
                                    if (e.mod.isZero()) return e.div;
                                    var r = 0 !== e.div.negative ? e.mod.isub(t) : e.mod,
                                        n = t.ushrn(1),
                                        i = t.andln(1),
                                        o = r.cmp(n);
                                    return o < 0 || (1 === i && 0 === o)
                                        ? e.div
                                        : 0 !== e.div.negative
                                        ? e.div.isubn(1)
                                        : e.div.iaddn(1);
                                }),
                                (o.prototype.modn = function(t) {
                                    n(t <= 67108863);
                                    for (
                                        var e = (1 << 26) % t, r = 0, i = this.length - 1;
                                        i >= 0;
                                        i--
                                    )
                                        r = (e * r + (0 | this.words[i])) % t;
                                    return r;
                                }),
                                (o.prototype.idivn = function(t) {
                                    n(t <= 67108863);
                                    for (var e = 0, r = this.length - 1; r >= 0; r--) {
                                        var i = (0 | this.words[r]) + 67108864 * e;
                                        (this.words[r] = (i / t) | 0), (e = i % t);
                                    }
                                    return this.strip();
                                }),
                                (o.prototype.divn = function(t) {
                                    return this.clone().idivn(t);
                                }),
                                (o.prototype.egcd = function(t) {
                                    n(0 === t.negative), n(!t.isZero());
                                    var e = this,
                                        r = t.clone();
                                    e = 0 !== e.negative ? e.umod(t) : e.clone();
                                    for (
                                        var i = new o(1),
                                            s = new o(0),
                                            u = new o(0),
                                            a = new o(1),
                                            h = 0;
                                        e.isEven() && r.isEven();

                                    )
                                        e.iushrn(1), r.iushrn(1), ++h;
                                    for (var f = r.clone(), c = e.clone(); !e.isZero(); ) {
                                        for (
                                            var l = 0, p = 1;
                                            0 == (e.words[0] & p) && l < 26;
                                            ++l, p <<= 1
                                        );
                                        if (l > 0)
                                            for (e.iushrn(l); l-- > 0; )
                                                (i.isOdd() || s.isOdd()) && (i.iadd(f), s.isub(c)),
                                                    i.iushrn(1),
                                                    s.iushrn(1);
                                        for (
                                            var d = 0, g = 1;
                                            0 == (r.words[0] & g) && d < 26;
                                            ++d, g <<= 1
                                        );
                                        if (d > 0)
                                            for (r.iushrn(d); d-- > 0; )
                                                (u.isOdd() || a.isOdd()) && (u.iadd(f), a.isub(c)),
                                                    u.iushrn(1),
                                                    a.iushrn(1);
                                        e.cmp(r) >= 0
                                            ? (e.isub(r), i.isub(u), s.isub(a))
                                            : (r.isub(e), u.isub(i), a.isub(s));
                                    }
                                    return { a: u, b: a, gcd: r.iushln(h) };
                                }),
                                (o.prototype._invmp = function(t) {
                                    n(0 === t.negative), n(!t.isZero());
                                    var e = this,
                                        r = t.clone();
                                    e = 0 !== e.negative ? e.umod(t) : e.clone();
                                    for (
                                        var i, s = new o(1), u = new o(0), a = r.clone();
                                        e.cmpn(1) > 0 && r.cmpn(1) > 0;

                                    ) {
                                        for (
                                            var h = 0, f = 1;
                                            0 == (e.words[0] & f) && h < 26;
                                            ++h, f <<= 1
                                        );
                                        if (h > 0)
                                            for (e.iushrn(h); h-- > 0; )
                                                s.isOdd() && s.iadd(a), s.iushrn(1);
                                        for (
                                            var c = 0, l = 1;
                                            0 == (r.words[0] & l) && c < 26;
                                            ++c, l <<= 1
                                        );
                                        if (c > 0)
                                            for (r.iushrn(c); c-- > 0; )
                                                u.isOdd() && u.iadd(a), u.iushrn(1);
                                        e.cmp(r) >= 0
                                            ? (e.isub(r), s.isub(u))
                                            : (r.isub(e), u.isub(s));
                                    }
                                    return (
                                        (i = 0 === e.cmpn(1) ? s : u).cmpn(0) < 0 && i.iadd(t), i
                                    );
                                }),
                                (o.prototype.gcd = function(t) {
                                    if (this.isZero()) return t.abs();
                                    if (t.isZero()) return this.abs();
                                    var e = this.clone(),
                                        r = t.clone();
                                    (e.negative = 0), (r.negative = 0);
                                    for (var n = 0; e.isEven() && r.isEven(); n++)
                                        e.iushrn(1), r.iushrn(1);
                                    for (;;) {
                                        for (; e.isEven(); ) e.iushrn(1);
                                        for (; r.isEven(); ) r.iushrn(1);
                                        var i = e.cmp(r);
                                        if (i < 0) {
                                            var o = e;
                                            (e = r), (r = o);
                                        } else if (0 === i || 0 === r.cmpn(1)) break;
                                        e.isub(r);
                                    }
                                    return r.iushln(n);
                                }),
                                (o.prototype.invm = function(t) {
                                    return this.egcd(t).a.umod(t);
                                }),
                                (o.prototype.isEven = function() {
                                    return 0 == (1 & this.words[0]);
                                }),
                                (o.prototype.isOdd = function() {
                                    return 1 == (1 & this.words[0]);
                                }),
                                (o.prototype.andln = function(t) {
                                    return this.words[0] & t;
                                }),
                                (o.prototype.bincn = function(t) {
                                    n('number' == typeof t);
                                    var e = t % 26,
                                        r = (t - e) / 26,
                                        i = 1 << e;
                                    if (this.length <= r)
                                        return this._expand(r + 1), (this.words[r] |= i), this;
                                    for (var o = i, s = r; 0 !== o && s < this.length; s++) {
                                        var u = 0 | this.words[s];
                                        (o = (u += o) >>> 26), (u &= 67108863), (this.words[s] = u);
                                    }
                                    return 0 !== o && ((this.words[s] = o), this.length++), this;
                                }),
                                (o.prototype.isZero = function() {
                                    return 1 === this.length && 0 === this.words[0];
                                }),
                                (o.prototype.cmpn = function(t) {
                                    var e,
                                        r = t < 0;
                                    if (0 !== this.negative && !r) return -1;
                                    if (0 === this.negative && r) return 1;
                                    if ((this.strip(), this.length > 1)) e = 1;
                                    else {
                                        r && (t = -t), n(t <= 67108863, 'Number is too big');
                                        var i = 0 | this.words[0];
                                        e = i === t ? 0 : i < t ? -1 : 1;
                                    }
                                    return 0 !== this.negative ? 0 | -e : e;
                                }),
                                (o.prototype.cmp = function(t) {
                                    if (0 !== this.negative && 0 === t.negative) return -1;
                                    if (0 === this.negative && 0 !== t.negative) return 1;
                                    var e = this.ucmp(t);
                                    return 0 !== this.negative ? 0 | -e : e;
                                }),
                                (o.prototype.ucmp = function(t) {
                                    if (this.length > t.length) return 1;
                                    if (this.length < t.length) return -1;
                                    for (var e = 0, r = this.length - 1; r >= 0; r--) {
                                        var n = 0 | this.words[r],
                                            i = 0 | t.words[r];
                                        if (n !== i) {
                                            n < i ? (e = -1) : n > i && (e = 1);
                                            break;
                                        }
                                    }
                                    return e;
                                }),
                                (o.prototype.gtn = function(t) {
                                    return 1 === this.cmpn(t);
                                }),
                                (o.prototype.gt = function(t) {
                                    return 1 === this.cmp(t);
                                }),
                                (o.prototype.gten = function(t) {
                                    return this.cmpn(t) >= 0;
                                }),
                                (o.prototype.gte = function(t) {
                                    return this.cmp(t) >= 0;
                                }),
                                (o.prototype.ltn = function(t) {
                                    return -1 === this.cmpn(t);
                                }),
                                (o.prototype.lt = function(t) {
                                    return -1 === this.cmp(t);
                                }),
                                (o.prototype.lten = function(t) {
                                    return this.cmpn(t) <= 0;
                                }),
                                (o.prototype.lte = function(t) {
                                    return this.cmp(t) <= 0;
                                }),
                                (o.prototype.eqn = function(t) {
                                    return 0 === this.cmpn(t);
                                }),
                                (o.prototype.eq = function(t) {
                                    return 0 === this.cmp(t);
                                }),
                                (o.red = function(t) {
                                    return new M(t);
                                }),
                                (o.prototype.toRed = function(t) {
                                    return (
                                        n(!this.red, 'Already a number in reduction context'),
                                        n(0 === this.negative, 'red works only with positives'),
                                        t.convertTo(this)._forceRed(t)
                                    );
                                }),
                                (o.prototype.fromRed = function() {
                                    return (
                                        n(
                                            this.red,
                                            'fromRed works only with numbers in reduction context'
                                        ),
                                        this.red.convertFrom(this)
                                    );
                                }),
                                (o.prototype._forceRed = function(t) {
                                    return (this.red = t), this;
                                }),
                                (o.prototype.forceRed = function(t) {
                                    return (
                                        n(!this.red, 'Already a number in reduction context'),
                                        this._forceRed(t)
                                    );
                                }),
                                (o.prototype.redAdd = function(t) {
                                    return (
                                        n(this.red, 'redAdd works only with red numbers'),
                                        this.red.add(this, t)
                                    );
                                }),
                                (o.prototype.redIAdd = function(t) {
                                    return (
                                        n(this.red, 'redIAdd works only with red numbers'),
                                        this.red.iadd(this, t)
                                    );
                                }),
                                (o.prototype.redSub = function(t) {
                                    return (
                                        n(this.red, 'redSub works only with red numbers'),
                                        this.red.sub(this, t)
                                    );
                                }),
                                (o.prototype.redISub = function(t) {
                                    return (
                                        n(this.red, 'redISub works only with red numbers'),
                                        this.red.isub(this, t)
                                    );
                                }),
                                (o.prototype.redShl = function(t) {
                                    return (
                                        n(this.red, 'redShl works only with red numbers'),
                                        this.red.shl(this, t)
                                    );
                                }),
                                (o.prototype.redMul = function(t) {
                                    return (
                                        n(this.red, 'redMul works only with red numbers'),
                                        this.red._verify2(this, t),
                                        this.red.mul(this, t)
                                    );
                                }),
                                (o.prototype.redIMul = function(t) {
                                    return (
                                        n(this.red, 'redMul works only with red numbers'),
                                        this.red._verify2(this, t),
                                        this.red.imul(this, t)
                                    );
                                }),
                                (o.prototype.redSqr = function() {
                                    return (
                                        n(this.red, 'redSqr works only with red numbers'),
                                        this.red._verify1(this),
                                        this.red.sqr(this)
                                    );
                                }),
                                (o.prototype.redISqr = function() {
                                    return (
                                        n(this.red, 'redISqr works only with red numbers'),
                                        this.red._verify1(this),
                                        this.red.isqr(this)
                                    );
                                }),
                                (o.prototype.redSqrt = function() {
                                    return (
                                        n(this.red, 'redSqrt works only with red numbers'),
                                        this.red._verify1(this),
                                        this.red.sqrt(this)
                                    );
                                }),
                                (o.prototype.redInvm = function() {
                                    return (
                                        n(this.red, 'redInvm works only with red numbers'),
                                        this.red._verify1(this),
                                        this.red.invm(this)
                                    );
                                }),
                                (o.prototype.redNeg = function() {
                                    return (
                                        n(this.red, 'redNeg works only with red numbers'),
                                        this.red._verify1(this),
                                        this.red.neg(this)
                                    );
                                }),
                                (o.prototype.redPow = function(t) {
                                    return (
                                        n(this.red && !t.red, 'redPow(normalNum)'),
                                        this.red._verify1(this),
                                        this.red.pow(this, t)
                                    );
                                });
                            var m = { k256: null, p224: null, p192: null, p25519: null };
                            function v(t, e) {
                                (this.name = t),
                                    (this.p = new o(e, 16)),
                                    (this.n = this.p.bitLength()),
                                    (this.k = new o(1).iushln(this.n).isub(this.p)),
                                    (this.tmp = this._tmp());
                            }
                            function y() {
                                v.call(
                                    this,
                                    'k256',
                                    'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f'
                                );
                            }
                            function w() {
                                v.call(
                                    this,
                                    'p224',
                                    'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001'
                                );
                            }
                            function b() {
                                v.call(
                                    this,
                                    'p192',
                                    'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff'
                                );
                            }
                            function _() {
                                v.call(
                                    this,
                                    '25519',
                                    '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed'
                                );
                            }
                            function M(t) {
                                if ('string' == typeof t) {
                                    var e = o._prime(t);
                                    (this.m = e.p), (this.prime = e);
                                } else
                                    n(t.gtn(1), 'modulus must be greater than 1'),
                                        (this.m = t),
                                        (this.prime = null);
                            }
                            function E(t) {
                                M.call(this, t),
                                    (this.shift = this.m.bitLength()),
                                    this.shift % 26 != 0 && (this.shift += 26 - (this.shift % 26)),
                                    (this.r = new o(1).iushln(this.shift)),
                                    (this.r2 = this.imod(this.r.sqr())),
                                    (this.rinv = this.r._invmp(this.m)),
                                    (this.minv = this.rinv
                                        .mul(this.r)
                                        .isubn(1)
                                        .div(this.m)),
                                    (this.minv = this.minv.umod(this.r)),
                                    (this.minv = this.r.sub(this.minv));
                            }
                            (v.prototype._tmp = function() {
                                var t = new o(null);
                                return (t.words = new Array(Math.ceil(this.n / 13))), t;
                            }),
                                (v.prototype.ireduce = function(t) {
                                    var e,
                                        r = t;
                                    do {
                                        this.split(r, this.tmp),
                                            (e = (r = (r = this.imulK(r)).iadd(
                                                this.tmp
                                            )).bitLength());
                                    } while (e > this.n);
                                    var n = e < this.n ? -1 : r.ucmp(this.p);
                                    return (
                                        0 === n
                                            ? ((r.words[0] = 0), (r.length = 1))
                                            : n > 0
                                            ? r.isub(this.p)
                                            : r.strip(),
                                        r
                                    );
                                }),
                                (v.prototype.split = function(t, e) {
                                    t.iushrn(this.n, 0, e);
                                }),
                                (v.prototype.imulK = function(t) {
                                    return t.imul(this.k);
                                }),
                                i(y, v),
                                (y.prototype.split = function(t, e) {
                                    for (var r = Math.min(t.length, 9), n = 0; n < r; n++)
                                        e.words[n] = t.words[n];
                                    if (((e.length = r), t.length <= 9))
                                        return (t.words[0] = 0), void (t.length = 1);
                                    var i = t.words[9];
                                    for (
                                        e.words[e.length++] = 4194303 & i, n = 10;
                                        n < t.length;
                                        n++
                                    ) {
                                        var o = 0 | t.words[n];
                                        (t.words[n - 10] = ((4194303 & o) << 4) | (i >>> 22)),
                                            (i = o);
                                    }
                                    (i >>>= 22),
                                        (t.words[n - 10] = i),
                                        0 === i && t.length > 10
                                            ? (t.length -= 10)
                                            : (t.length -= 9);
                                }),
                                (y.prototype.imulK = function(t) {
                                    (t.words[t.length] = 0),
                                        (t.words[t.length + 1] = 0),
                                        (t.length += 2);
                                    for (var e = 0, r = 0; r < t.length; r++) {
                                        var n = 0 | t.words[r];
                                        (e += 977 * n),
                                            (t.words[r] = 67108863 & e),
                                            (e = 64 * n + ((e / 67108864) | 0));
                                    }
                                    return (
                                        0 === t.words[t.length - 1] &&
                                            (t.length--, 0 === t.words[t.length - 1] && t.length--),
                                        t
                                    );
                                }),
                                i(w, v),
                                i(b, v),
                                i(_, v),
                                (_.prototype.imulK = function(t) {
                                    for (var e = 0, r = 0; r < t.length; r++) {
                                        var n = 19 * (0 | t.words[r]) + e,
                                            i = 67108863 & n;
                                        (n >>>= 26), (t.words[r] = i), (e = n);
                                    }
                                    return 0 !== e && (t.words[t.length++] = e), t;
                                }),
                                (o._prime = function(t) {
                                    if (m[t]) return m[t];
                                    var e;
                                    if ('k256' === t) e = new y();
                                    else if ('p224' === t) e = new w();
                                    else if ('p192' === t) e = new b();
                                    else {
                                        if ('p25519' !== t) throw new Error('Unknown prime ' + t);
                                        e = new _();
                                    }
                                    return (m[t] = e), e;
                                }),
                                (M.prototype._verify1 = function(t) {
                                    n(0 === t.negative, 'red works only with positives'),
                                        n(t.red, 'red works only with red numbers');
                                }),
                                (M.prototype._verify2 = function(t, e) {
                                    n(
                                        0 == (t.negative | e.negative),
                                        'red works only with positives'
                                    ),
                                        n(
                                            t.red && t.red === e.red,
                                            'red works only with red numbers'
                                        );
                                }),
                                (M.prototype.imod = function(t) {
                                    return this.prime
                                        ? this.prime.ireduce(t)._forceRed(this)
                                        : t.umod(this.m)._forceRed(this);
                                }),
                                (M.prototype.neg = function(t) {
                                    return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
                                }),
                                (M.prototype.add = function(t, e) {
                                    this._verify2(t, e);
                                    var r = t.add(e);
                                    return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this);
                                }),
                                (M.prototype.iadd = function(t, e) {
                                    this._verify2(t, e);
                                    var r = t.iadd(e);
                                    return r.cmp(this.m) >= 0 && r.isub(this.m), r;
                                }),
                                (M.prototype.sub = function(t, e) {
                                    this._verify2(t, e);
                                    var r = t.sub(e);
                                    return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this);
                                }),
                                (M.prototype.isub = function(t, e) {
                                    this._verify2(t, e);
                                    var r = t.isub(e);
                                    return r.cmpn(0) < 0 && r.iadd(this.m), r;
                                }),
                                (M.prototype.shl = function(t, e) {
                                    return this._verify1(t), this.imod(t.ushln(e));
                                }),
                                (M.prototype.imul = function(t, e) {
                                    return this._verify2(t, e), this.imod(t.imul(e));
                                }),
                                (M.prototype.mul = function(t, e) {
                                    return this._verify2(t, e), this.imod(t.mul(e));
                                }),
                                (M.prototype.isqr = function(t) {
                                    return this.imul(t, t.clone());
                                }),
                                (M.prototype.sqr = function(t) {
                                    return this.mul(t, t);
                                }),
                                (M.prototype.sqrt = function(t) {
                                    if (t.isZero()) return t.clone();
                                    var e = this.m.andln(3);
                                    if ((n(e % 2 == 1), 3 === e)) {
                                        var r = this.m.add(new o(1)).iushrn(2);
                                        return this.pow(t, r);
                                    }
                                    for (
                                        var i = this.m.subn(1), s = 0;
                                        !i.isZero() && 0 === i.andln(1);

                                    )
                                        s++, i.iushrn(1);
                                    n(!i.isZero());
                                    var u = new o(1).toRed(this),
                                        a = u.redNeg(),
                                        h = this.m.subn(1).iushrn(1),
                                        f = this.m.bitLength();
                                    for (
                                        f = new o(2 * f * f).toRed(this);
                                        0 !== this.pow(f, h).cmp(a);

                                    )
                                        f.redIAdd(a);
                                    for (
                                        var c = this.pow(f, i),
                                            l = this.pow(t, i.addn(1).iushrn(1)),
                                            p = this.pow(t, i),
                                            d = s;
                                        0 !== p.cmp(u);

                                    ) {
                                        for (var g = p, m = 0; 0 !== g.cmp(u); m++) g = g.redSqr();
                                        n(m < d);
                                        var v = this.pow(c, new o(1).iushln(d - m - 1));
                                        (l = l.redMul(v)),
                                            (c = v.redSqr()),
                                            (p = p.redMul(c)),
                                            (d = m);
                                    }
                                    return l;
                                }),
                                (M.prototype.invm = function(t) {
                                    var e = t._invmp(this.m);
                                    return 0 !== e.negative
                                        ? ((e.negative = 0), this.imod(e).redNeg())
                                        : this.imod(e);
                                }),
                                (M.prototype.pow = function(t, e) {
                                    if (e.isZero()) return new o(1).toRed(this);
                                    if (0 === e.cmpn(1)) return t.clone();
                                    var r = new Array(16);
                                    (r[0] = new o(1).toRed(this)), (r[1] = t);
                                    for (var n = 2; n < r.length; n++) r[n] = this.mul(r[n - 1], t);
                                    var i = r[0],
                                        s = 0,
                                        u = 0,
                                        a = e.bitLength() % 26;
                                    for (0 === a && (a = 26), n = e.length - 1; n >= 0; n--) {
                                        for (var h = e.words[n], f = a - 1; f >= 0; f--) {
                                            var c = (h >> f) & 1;
                                            i !== r[0] && (i = this.sqr(i)),
                                                0 !== c || 0 !== s
                                                    ? ((s <<= 1),
                                                      (s |= c),
                                                      (4 == ++u || (0 === n && 0 === f)) &&
                                                          ((i = this.mul(i, r[s])),
                                                          (u = 0),
                                                          (s = 0)))
                                                    : (u = 0);
                                        }
                                        a = 26;
                                    }
                                    return i;
                                }),
                                (M.prototype.convertTo = function(t) {
                                    var e = t.umod(this.m);
                                    return e === t ? e.clone() : e;
                                }),
                                (M.prototype.convertFrom = function(t) {
                                    var e = t.clone();
                                    return (e.red = null), e;
                                }),
                                (o.mont = function(t) {
                                    return new E(t);
                                }),
                                i(E, M),
                                (E.prototype.convertTo = function(t) {
                                    return this.imod(t.ushln(this.shift));
                                }),
                                (E.prototype.convertFrom = function(t) {
                                    var e = this.imod(t.mul(this.rinv));
                                    return (e.red = null), e;
                                }),
                                (E.prototype.imul = function(t, e) {
                                    if (t.isZero() || e.isZero())
                                        return (t.words[0] = 0), (t.length = 1), t;
                                    var r = t.imul(e),
                                        n = r
                                            .maskn(this.shift)
                                            .mul(this.minv)
                                            .imaskn(this.shift)
                                            .mul(this.m),
                                        i = r.isub(n).iushrn(this.shift),
                                        o = i;
                                    return (
                                        i.cmp(this.m) >= 0
                                            ? (o = i.isub(this.m))
                                            : i.cmpn(0) < 0 && (o = i.iadd(this.m)),
                                        o._forceRed(this)
                                    );
                                }),
                                (E.prototype.mul = function(t, e) {
                                    if (t.isZero() || e.isZero()) return new o(0)._forceRed(this);
                                    var r = t.mul(e),
                                        n = r
                                            .maskn(this.shift)
                                            .mul(this.minv)
                                            .imaskn(this.shift)
                                            .mul(this.m),
                                        i = r.isub(n).iushrn(this.shift),
                                        s = i;
                                    return (
                                        i.cmp(this.m) >= 0
                                            ? (s = i.isub(this.m))
                                            : i.cmpn(0) < 0 && (s = i.iadd(this.m)),
                                        s._forceRed(this)
                                    );
                                }),
                                (E.prototype.invm = function(t) {
                                    return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this);
                                });
                        })(t, this);
                    }.call(this, r(13)(t)));
                },
                function(t, e) {
                    var r;
                    r = (function() {
                        return this;
                    })();
                    try {
                        r = r || new Function('return this')();
                    } catch (t) {
                        'object' == typeof window && (r = window);
                    }
                    t.exports = r;
                },
                function(t, e, r) {
                    (function(e, r) {
                        /**
                         * [js-sha3]{@link https://github.com/emn178/js-sha3}
                         *
                         * @version 0.5.7
                         * @author Chen, Yi-Cyuan [emn178@gmail.com]
                         * @copyright Chen, Yi-Cyuan 2015-2016
                         * @license MIT
                         */
                        !(function() {
                            'use strict';
                            var n = 'object' == typeof window ? window : {};
                            !n.JS_SHA3_NO_NODE_JS &&
                                'object' == typeof e &&
                                e.versions &&
                                e.versions.node &&
                                (n = r);
                            for (
                                var i =
                                        !n.JS_SHA3_NO_COMMON_JS &&
                                        'object' == typeof t &&
                                        t.exports,
                                    o = '0123456789abcdef'.split(''),
                                    s = [0, 8, 16, 24],
                                    u = [
                                        1,
                                        0,
                                        32898,
                                        0,
                                        32906,
                                        2147483648,
                                        2147516416,
                                        2147483648,
                                        32907,
                                        0,
                                        2147483649,
                                        0,
                                        2147516545,
                                        2147483648,
                                        32777,
                                        2147483648,
                                        138,
                                        0,
                                        136,
                                        0,
                                        2147516425,
                                        0,
                                        2147483658,
                                        0,
                                        2147516555,
                                        0,
                                        139,
                                        2147483648,
                                        32905,
                                        2147483648,
                                        32771,
                                        2147483648,
                                        32770,
                                        2147483648,
                                        128,
                                        2147483648,
                                        32778,
                                        0,
                                        2147483658,
                                        2147483648,
                                        2147516545,
                                        2147483648,
                                        32896,
                                        2147483648,
                                        2147483649,
                                        0,
                                        2147516424,
                                        2147483648
                                    ],
                                    a = [224, 256, 384, 512],
                                    h = ['hex', 'buffer', 'arrayBuffer', 'array'],
                                    f = function(t, e, r) {
                                        return function(n) {
                                            return new _(t, e, t).update(n)[r]();
                                        };
                                    },
                                    c = function(t, e, r) {
                                        return function(n, i) {
                                            return new _(t, e, i).update(n)[r]();
                                        };
                                    },
                                    l = function(t, e) {
                                        var r = f(t, e, 'hex');
                                        (r.create = function() {
                                            return new _(t, e, t);
                                        }),
                                            (r.update = function(t) {
                                                return r.create().update(t);
                                            });
                                        for (var n = 0; n < h.length; ++n) {
                                            var i = h[n];
                                            r[i] = f(t, e, i);
                                        }
                                        return r;
                                    },
                                    p = [
                                        {
                                            name: 'keccak',
                                            padding: [1, 256, 65536, 16777216],
                                            bits: a,
                                            createMethod: l
                                        },
                                        {
                                            name: 'sha3',
                                            padding: [6, 1536, 393216, 100663296],
                                            bits: a,
                                            createMethod: l
                                        },
                                        {
                                            name: 'shake',
                                            padding: [31, 7936, 2031616, 520093696],
                                            bits: [128, 256],
                                            createMethod: function(t, e) {
                                                var r = c(t, e, 'hex');
                                                (r.create = function(r) {
                                                    return new _(t, e, r);
                                                }),
                                                    (r.update = function(t, e) {
                                                        return r.create(e).update(t);
                                                    });
                                                for (var n = 0; n < h.length; ++n) {
                                                    var i = h[n];
                                                    r[i] = c(t, e, i);
                                                }
                                                return r;
                                            }
                                        }
                                    ],
                                    d = {},
                                    g = [],
                                    m = 0;
                                m < p.length;
                                ++m
                            )
                                for (var v = p[m], y = v.bits, w = 0; w < y.length; ++w) {
                                    var b = v.name + '_' + y[w];
                                    g.push(b), (d[b] = v.createMethod(y[w], v.padding));
                                }
                            function _(t, e, r) {
                                (this.blocks = []),
                                    (this.s = []),
                                    (this.padding = e),
                                    (this.outputBits = r),
                                    (this.reset = !0),
                                    (this.block = 0),
                                    (this.start = 0),
                                    (this.blockCount = (1600 - (t << 1)) >> 5),
                                    (this.byteCount = this.blockCount << 2),
                                    (this.outputBlocks = r >> 5),
                                    (this.extraBytes = (31 & r) >> 3);
                                for (var n = 0; n < 50; ++n) this.s[n] = 0;
                            }
                            (_.prototype.update = function(t) {
                                var e = 'string' != typeof t;
                                e && t.constructor === ArrayBuffer && (t = new Uint8Array(t));
                                for (
                                    var r,
                                        n,
                                        i = t.length,
                                        o = this.blocks,
                                        u = this.byteCount,
                                        a = this.blockCount,
                                        h = 0,
                                        f = this.s;
                                    h < i;

                                ) {
                                    if (this.reset)
                                        for (
                                            this.reset = !1, o[0] = this.block, r = 1;
                                            r < a + 1;
                                            ++r
                                        )
                                            o[r] = 0;
                                    if (e)
                                        for (r = this.start; h < i && r < u; ++h)
                                            o[r >> 2] |= t[h] << s[3 & r++];
                                    else
                                        for (r = this.start; h < i && r < u; ++h)
                                            (n = t.charCodeAt(h)) < 128
                                                ? (o[r >> 2] |= n << s[3 & r++])
                                                : n < 2048
                                                ? ((o[r >> 2] |= (192 | (n >> 6)) << s[3 & r++]),
                                                  (o[r >> 2] |= (128 | (63 & n)) << s[3 & r++]))
                                                : n < 55296 || n >= 57344
                                                ? ((o[r >> 2] |= (224 | (n >> 12)) << s[3 & r++]),
                                                  (o[r >> 2] |=
                                                      (128 | ((n >> 6) & 63)) << s[3 & r++]),
                                                  (o[r >> 2] |= (128 | (63 & n)) << s[3 & r++]))
                                                : ((n =
                                                      65536 +
                                                      (((1023 & n) << 10) |
                                                          (1023 & t.charCodeAt(++h)))),
                                                  (o[r >> 2] |= (240 | (n >> 18)) << s[3 & r++]),
                                                  (o[r >> 2] |=
                                                      (128 | ((n >> 12) & 63)) << s[3 & r++]),
                                                  (o[r >> 2] |=
                                                      (128 | ((n >> 6) & 63)) << s[3 & r++]),
                                                  (o[r >> 2] |= (128 | (63 & n)) << s[3 & r++]));
                                    if (((this.lastByteIndex = r), r >= u)) {
                                        for (
                                            this.start = r - u, this.block = o[a], r = 0;
                                            r < a;
                                            ++r
                                        )
                                            f[r] ^= o[r];
                                        M(f), (this.reset = !0);
                                    } else this.start = r;
                                }
                                return this;
                            }),
                                (_.prototype.finalize = function() {
                                    var t = this.blocks,
                                        e = this.lastByteIndex,
                                        r = this.blockCount,
                                        n = this.s;
                                    if (
                                        ((t[e >> 2] |= this.padding[3 & e]),
                                        this.lastByteIndex === this.byteCount)
                                    )
                                        for (t[0] = t[r], e = 1; e < r + 1; ++e) t[e] = 0;
                                    for (t[r - 1] |= 2147483648, e = 0; e < r; ++e) n[e] ^= t[e];
                                    M(n);
                                }),
                                (_.prototype.toString = _.prototype.hex = function() {
                                    this.finalize();
                                    for (
                                        var t,
                                            e = this.blockCount,
                                            r = this.s,
                                            n = this.outputBlocks,
                                            i = this.extraBytes,
                                            s = 0,
                                            u = 0,
                                            a = '';
                                        u < n;

                                    ) {
                                        for (s = 0; s < e && u < n; ++s, ++u)
                                            (t = r[s]),
                                                (a +=
                                                    o[(t >> 4) & 15] +
                                                    o[15 & t] +
                                                    o[(t >> 12) & 15] +
                                                    o[(t >> 8) & 15] +
                                                    o[(t >> 20) & 15] +
                                                    o[(t >> 16) & 15] +
                                                    o[(t >> 28) & 15] +
                                                    o[(t >> 24) & 15]);
                                        u % e == 0 && (M(r), (s = 0));
                                    }
                                    return (
                                        i &&
                                            ((t = r[s]),
                                            i > 0 && (a += o[(t >> 4) & 15] + o[15 & t]),
                                            i > 1 && (a += o[(t >> 12) & 15] + o[(t >> 8) & 15]),
                                            i > 2 && (a += o[(t >> 20) & 15] + o[(t >> 16) & 15])),
                                        a
                                    );
                                }),
                                (_.prototype.arrayBuffer = function() {
                                    this.finalize();
                                    var t,
                                        e = this.blockCount,
                                        r = this.s,
                                        n = this.outputBlocks,
                                        i = this.extraBytes,
                                        o = 0,
                                        s = 0,
                                        u = this.outputBits >> 3;
                                    t = i ? new ArrayBuffer((n + 1) << 2) : new ArrayBuffer(u);
                                    for (var a = new Uint32Array(t); s < n; ) {
                                        for (o = 0; o < e && s < n; ++o, ++s) a[s] = r[o];
                                        s % e == 0 && M(r);
                                    }
                                    return i && ((a[o] = r[o]), (t = t.slice(0, u))), t;
                                }),
                                (_.prototype.buffer = _.prototype.arrayBuffer),
                                (_.prototype.digest = _.prototype.array = function() {
                                    this.finalize();
                                    for (
                                        var t,
                                            e,
                                            r = this.blockCount,
                                            n = this.s,
                                            i = this.outputBlocks,
                                            o = this.extraBytes,
                                            s = 0,
                                            u = 0,
                                            a = [];
                                        u < i;

                                    ) {
                                        for (s = 0; s < r && u < i; ++s, ++u)
                                            (t = u << 2),
                                                (e = n[s]),
                                                (a[t] = 255 & e),
                                                (a[t + 1] = (e >> 8) & 255),
                                                (a[t + 2] = (e >> 16) & 255),
                                                (a[t + 3] = (e >> 24) & 255);
                                        u % r == 0 && M(n);
                                    }
                                    return (
                                        o &&
                                            ((t = u << 2),
                                            (e = n[s]),
                                            o > 0 && (a[t] = 255 & e),
                                            o > 1 && (a[t + 1] = (e >> 8) & 255),
                                            o > 2 && (a[t + 2] = (e >> 16) & 255)),
                                        a
                                    );
                                });
                            var M = function(t) {
                                var e,
                                    r,
                                    n,
                                    i,
                                    o,
                                    s,
                                    a,
                                    h,
                                    f,
                                    c,
                                    l,
                                    p,
                                    d,
                                    g,
                                    m,
                                    v,
                                    y,
                                    w,
                                    b,
                                    _,
                                    M,
                                    E,
                                    R,
                                    S,
                                    O,
                                    I,
                                    A,
                                    N,
                                    T,
                                    B,
                                    x,
                                    P,
                                    k,
                                    C,
                                    U,
                                    D,
                                    j,
                                    L,
                                    F,
                                    q,
                                    G,
                                    Y,
                                    z,
                                    H,
                                    J,
                                    Z,
                                    V,
                                    W,
                                    K,
                                    $,
                                    X,
                                    Q,
                                    tt,
                                    et,
                                    rt,
                                    nt,
                                    it,
                                    ot,
                                    st,
                                    ut,
                                    at,
                                    ht,
                                    ft;
                                for (n = 0; n < 48; n += 2)
                                    (i = t[0] ^ t[10] ^ t[20] ^ t[30] ^ t[40]),
                                        (o = t[1] ^ t[11] ^ t[21] ^ t[31] ^ t[41]),
                                        (s = t[2] ^ t[12] ^ t[22] ^ t[32] ^ t[42]),
                                        (a = t[3] ^ t[13] ^ t[23] ^ t[33] ^ t[43]),
                                        (h = t[4] ^ t[14] ^ t[24] ^ t[34] ^ t[44]),
                                        (f = t[5] ^ t[15] ^ t[25] ^ t[35] ^ t[45]),
                                        (c = t[6] ^ t[16] ^ t[26] ^ t[36] ^ t[46]),
                                        (l = t[7] ^ t[17] ^ t[27] ^ t[37] ^ t[47]),
                                        (e =
                                            (p = t[8] ^ t[18] ^ t[28] ^ t[38] ^ t[48]) ^
                                            ((s << 1) | (a >>> 31))),
                                        (r =
                                            (d = t[9] ^ t[19] ^ t[29] ^ t[39] ^ t[49]) ^
                                            ((a << 1) | (s >>> 31))),
                                        (t[0] ^= e),
                                        (t[1] ^= r),
                                        (t[10] ^= e),
                                        (t[11] ^= r),
                                        (t[20] ^= e),
                                        (t[21] ^= r),
                                        (t[30] ^= e),
                                        (t[31] ^= r),
                                        (t[40] ^= e),
                                        (t[41] ^= r),
                                        (e = i ^ ((h << 1) | (f >>> 31))),
                                        (r = o ^ ((f << 1) | (h >>> 31))),
                                        (t[2] ^= e),
                                        (t[3] ^= r),
                                        (t[12] ^= e),
                                        (t[13] ^= r),
                                        (t[22] ^= e),
                                        (t[23] ^= r),
                                        (t[32] ^= e),
                                        (t[33] ^= r),
                                        (t[42] ^= e),
                                        (t[43] ^= r),
                                        (e = s ^ ((c << 1) | (l >>> 31))),
                                        (r = a ^ ((l << 1) | (c >>> 31))),
                                        (t[4] ^= e),
                                        (t[5] ^= r),
                                        (t[14] ^= e),
                                        (t[15] ^= r),
                                        (t[24] ^= e),
                                        (t[25] ^= r),
                                        (t[34] ^= e),
                                        (t[35] ^= r),
                                        (t[44] ^= e),
                                        (t[45] ^= r),
                                        (e = h ^ ((p << 1) | (d >>> 31))),
                                        (r = f ^ ((d << 1) | (p >>> 31))),
                                        (t[6] ^= e),
                                        (t[7] ^= r),
                                        (t[16] ^= e),
                                        (t[17] ^= r),
                                        (t[26] ^= e),
                                        (t[27] ^= r),
                                        (t[36] ^= e),
                                        (t[37] ^= r),
                                        (t[46] ^= e),
                                        (t[47] ^= r),
                                        (e = c ^ ((i << 1) | (o >>> 31))),
                                        (r = l ^ ((o << 1) | (i >>> 31))),
                                        (t[8] ^= e),
                                        (t[9] ^= r),
                                        (t[18] ^= e),
                                        (t[19] ^= r),
                                        (t[28] ^= e),
                                        (t[29] ^= r),
                                        (t[38] ^= e),
                                        (t[39] ^= r),
                                        (t[48] ^= e),
                                        (t[49] ^= r),
                                        (g = t[0]),
                                        (m = t[1]),
                                        (Z = (t[11] << 4) | (t[10] >>> 28)),
                                        (V = (t[10] << 4) | (t[11] >>> 28)),
                                        (N = (t[20] << 3) | (t[21] >>> 29)),
                                        (T = (t[21] << 3) | (t[20] >>> 29)),
                                        (ut = (t[31] << 9) | (t[30] >>> 23)),
                                        (at = (t[30] << 9) | (t[31] >>> 23)),
                                        (Y = (t[40] << 18) | (t[41] >>> 14)),
                                        (z = (t[41] << 18) | (t[40] >>> 14)),
                                        (C = (t[2] << 1) | (t[3] >>> 31)),
                                        (U = (t[3] << 1) | (t[2] >>> 31)),
                                        (v = (t[13] << 12) | (t[12] >>> 20)),
                                        (y = (t[12] << 12) | (t[13] >>> 20)),
                                        (W = (t[22] << 10) | (t[23] >>> 22)),
                                        (K = (t[23] << 10) | (t[22] >>> 22)),
                                        (B = (t[33] << 13) | (t[32] >>> 19)),
                                        (x = (t[32] << 13) | (t[33] >>> 19)),
                                        (ht = (t[42] << 2) | (t[43] >>> 30)),
                                        (ft = (t[43] << 2) | (t[42] >>> 30)),
                                        (et = (t[5] << 30) | (t[4] >>> 2)),
                                        (rt = (t[4] << 30) | (t[5] >>> 2)),
                                        (D = (t[14] << 6) | (t[15] >>> 26)),
                                        (j = (t[15] << 6) | (t[14] >>> 26)),
                                        (w = (t[25] << 11) | (t[24] >>> 21)),
                                        (b = (t[24] << 11) | (t[25] >>> 21)),
                                        ($ = (t[34] << 15) | (t[35] >>> 17)),
                                        (X = (t[35] << 15) | (t[34] >>> 17)),
                                        (P = (t[45] << 29) | (t[44] >>> 3)),
                                        (k = (t[44] << 29) | (t[45] >>> 3)),
                                        (S = (t[6] << 28) | (t[7] >>> 4)),
                                        (O = (t[7] << 28) | (t[6] >>> 4)),
                                        (nt = (t[17] << 23) | (t[16] >>> 9)),
                                        (it = (t[16] << 23) | (t[17] >>> 9)),
                                        (L = (t[26] << 25) | (t[27] >>> 7)),
                                        (F = (t[27] << 25) | (t[26] >>> 7)),
                                        (_ = (t[36] << 21) | (t[37] >>> 11)),
                                        (M = (t[37] << 21) | (t[36] >>> 11)),
                                        (Q = (t[47] << 24) | (t[46] >>> 8)),
                                        (tt = (t[46] << 24) | (t[47] >>> 8)),
                                        (H = (t[8] << 27) | (t[9] >>> 5)),
                                        (J = (t[9] << 27) | (t[8] >>> 5)),
                                        (I = (t[18] << 20) | (t[19] >>> 12)),
                                        (A = (t[19] << 20) | (t[18] >>> 12)),
                                        (ot = (t[29] << 7) | (t[28] >>> 25)),
                                        (st = (t[28] << 7) | (t[29] >>> 25)),
                                        (q = (t[38] << 8) | (t[39] >>> 24)),
                                        (G = (t[39] << 8) | (t[38] >>> 24)),
                                        (E = (t[48] << 14) | (t[49] >>> 18)),
                                        (R = (t[49] << 14) | (t[48] >>> 18)),
                                        (t[0] = g ^ (~v & w)),
                                        (t[1] = m ^ (~y & b)),
                                        (t[10] = S ^ (~I & N)),
                                        (t[11] = O ^ (~A & T)),
                                        (t[20] = C ^ (~D & L)),
                                        (t[21] = U ^ (~j & F)),
                                        (t[30] = H ^ (~Z & W)),
                                        (t[31] = J ^ (~V & K)),
                                        (t[40] = et ^ (~nt & ot)),
                                        (t[41] = rt ^ (~it & st)),
                                        (t[2] = v ^ (~w & _)),
                                        (t[3] = y ^ (~b & M)),
                                        (t[12] = I ^ (~N & B)),
                                        (t[13] = A ^ (~T & x)),
                                        (t[22] = D ^ (~L & q)),
                                        (t[23] = j ^ (~F & G)),
                                        (t[32] = Z ^ (~W & $)),
                                        (t[33] = V ^ (~K & X)),
                                        (t[42] = nt ^ (~ot & ut)),
                                        (t[43] = it ^ (~st & at)),
                                        (t[4] = w ^ (~_ & E)),
                                        (t[5] = b ^ (~M & R)),
                                        (t[14] = N ^ (~B & P)),
                                        (t[15] = T ^ (~x & k)),
                                        (t[24] = L ^ (~q & Y)),
                                        (t[25] = F ^ (~G & z)),
                                        (t[34] = W ^ (~$ & Q)),
                                        (t[35] = K ^ (~X & tt)),
                                        (t[44] = ot ^ (~ut & ht)),
                                        (t[45] = st ^ (~at & ft)),
                                        (t[6] = _ ^ (~E & g)),
                                        (t[7] = M ^ (~R & m)),
                                        (t[16] = B ^ (~P & S)),
                                        (t[17] = x ^ (~k & O)),
                                        (t[26] = q ^ (~Y & C)),
                                        (t[27] = G ^ (~z & U)),
                                        (t[36] = $ ^ (~Q & H)),
                                        (t[37] = X ^ (~tt & J)),
                                        (t[46] = ut ^ (~ht & et)),
                                        (t[47] = at ^ (~ft & rt)),
                                        (t[8] = E ^ (~g & v)),
                                        (t[9] = R ^ (~m & y)),
                                        (t[18] = P ^ (~S & I)),
                                        (t[19] = k ^ (~O & A)),
                                        (t[28] = Y ^ (~C & D)),
                                        (t[29] = z ^ (~U & j)),
                                        (t[38] = Q ^ (~H & Z)),
                                        (t[39] = tt ^ (~J & V)),
                                        (t[48] = ht ^ (~et & nt)),
                                        (t[49] = ft ^ (~rt & it)),
                                        (t[0] ^= u[n]),
                                        (t[1] ^= u[n + 1]);
                            };
                            if (i) t.exports = d;
                            else for (m = 0; m < g.length; ++m) n[g[m]] = d[g[m]];
                        })();
                    }.call(this, r(15), r(4)));
                },
                function(t, e, r) {
                    'use strict';
                    (function(t) {
                        Object.defineProperty(e, '__esModule', { value: !0 });
                        var n = r(11),
                            i = n.__importDefault(r(12)),
                            o = r(0),
                            s = r(17),
                            u = r(16);
                        function a(t) {
                            return u.toUtf8String(new Uint8Array(t));
                        }
                        function h(t, e) {
                            var r = o.hexlify(new Uint8Array(t));
                            return e && (r = w(r)), r;
                        }
                        function f(t, e) {
                            var r = t.toString('hex');
                            return e || (r = y(r)), r;
                        }
                        function c(t) {
                            return u.toUtf8Bytes(t).buffer;
                        }
                        function l(t, e) {
                            return h(c(t), e);
                        }
                        function p(t, e) {
                            var r = new i.default(t).toString(16);
                            return (r = v(r)), e && (r = w(r)), r;
                        }
                        function d(e) {
                            return (e = w(e)), t.from(e, 'hex');
                        }
                        function g(t) {
                            return (t = y(t)), o.arrayify(t).buffer;
                        }
                        function m(t) {
                            return new i.default(t).toNumber();
                        }
                        function v(t) {
                            return (t = (t = w(t)).length % 2 != 0 ? '0' + t : t) && (t = y(t)), t;
                        }
                        function y(t) {
                            return '0x' === t.toLowerCase().substring(0, 2) ? t : '0x' + t;
                        }
                        function w(t) {
                            return '0x' === t.toLowerCase().substring(0, 2) ? t.substring(2) : t;
                        }
                        function b(t) {
                            return y((t = (t = w(t)).startsWith('0') ? t.substring(1) : t));
                        }
                        function _(t) {
                            return o.isHexString(t);
                        }
                        function M(t) {
                            return '' === t || ('string' == typeof t && '' === t.trim());
                        }
                        function E(t) {
                            for (
                                var e = {}, r = ('?' === t[0] ? t.substr(1) : t).split('&'), n = 0;
                                n < r.length;
                                n++
                            ) {
                                var i = r[n].match(/\w+(?==)/i) || [],
                                    o = r[n].match(/=.+/i) || [];
                                i[0] &&
                                    (e[decodeURIComponent(i[0])] = decodeURIComponent(
                                        o[0].substr(1)
                                    ));
                            }
                            return e;
                        }
                        function R(t) {
                            return !(t && t.length);
                        }
                        (e.convertArrayBufferToBuffer = function(t) {
                            return d(h(t));
                        }),
                            (e.convertArrayBufferToUtf8 = a),
                            (e.convertArrayBufferToHex = h),
                            (e.convertArrayBufferToNumber = function(t) {
                                return m(h(t));
                            }),
                            (e.concatArrayBuffers = function() {
                                for (var t = [], e = 0; e < arguments.length; e++)
                                    t[e] = arguments[e];
                                var r = t
                                        .map(function(t) {
                                            return h(t, !0);
                                        })
                                        .join(''),
                                    n = g(r);
                                return n;
                            }),
                            (e.convertBufferToArrayBuffer = function(t) {
                                return g(f(t));
                            }),
                            (e.convertBufferToUtf8 = function(t) {
                                return t.toString('utf8');
                            }),
                            (e.convertBufferToHex = f),
                            (e.convertBufferToNumber = function(t) {
                                return m(f(t));
                            }),
                            (e.concatBuffers = function() {
                                for (var e = [], r = 0; r < arguments.length; r++)
                                    e[r] = arguments[r];
                                var n = t.concat(e);
                                return n;
                            }),
                            (e.convertUtf8ToArrayBuffer = c),
                            (e.convertUtf8ToBuffer = function(e) {
                                return t.from(e, 'utf8');
                            }),
                            (e.convertUtf8ToHex = l),
                            (e.convertUtf8ToNumber = function(t) {
                                return new i.default(t).toNumber();
                            }),
                            (e.convertNumberToBuffer = function(t) {
                                return d(p(t));
                            }),
                            (e.convertNumberToArrayBuffer = function(t) {
                                return g(p(t));
                            }),
                            (e.convertNumberToUtf8 = function(t) {
                                return new i.default(t).toString();
                            }),
                            (e.convertNumberToHex = p),
                            (e.convertHexToBuffer = d),
                            (e.convertHexToArrayBuffer = g),
                            (e.convertHexToUtf8 = function(t) {
                                return a(g(t));
                            }),
                            (e.convertHexToNumber = m),
                            (e.sanitizeHex = v),
                            (e.addHexPrefix = y),
                            (e.removeHexPrefix = w),
                            (e.removeHexLeadingZeros = b),
                            (e.isHexString = _),
                            (e.isEmptyString = M),
                            (e.payloadId = function() {
                                return (
                                    new Date().getTime() * Math.pow(10, 3) +
                                    Math.floor(Math.random() * Math.pow(10, 3))
                                );
                            }),
                            (e.uuid = function() {
                                return (function(t, e) {
                                    for (
                                        e = t = '';
                                        t++ < 36;
                                        e +=
                                            (51 * t) & 52
                                                ? (15 ^ t
                                                      ? 8 ^ (Math.random() * (20 ^ t ? 16 : 4))
                                                      : 4
                                                  ).toString(16)
                                                : '-'
                                    );
                                    return e;
                                })();
                            }),
                            (e.toChecksumAddress = function(t) {
                                return s.getAddress(t);
                            }),
                            (e.isValidAddress = function(t) {
                                return !(
                                    !t ||
                                    '0x' !== t.toLowerCase().substring(0, 2) ||
                                    !/^(0x)?[0-9a-f]{40}$/i.test(t) ||
                                    (!/^(0x)?[0-9a-f]{40}$/.test(t) &&
                                        !/^(0x)?[0-9A-F]{40}$/.test(t) &&
                                        t !== e.toChecksumAddress(t))
                                );
                            }),
                            (e.getMeta = function() {
                                if (
                                    'undefined' == typeof window ||
                                    'undefined' == typeof document ||
                                    void 0 === window.location
                                )
                                    return null;
                                function t() {
                                    for (var t = [], e = 0; e < arguments.length; e++)
                                        t[e] = arguments[e];
                                    for (
                                        var r = document.getElementsByTagName('meta'),
                                            n = function(e) {
                                                var n = r[e],
                                                    i = ['itemprop', 'property', 'name']
                                                        .map(function(t) {
                                                            return n.getAttribute(t);
                                                        })
                                                        .filter(function(e) {
                                                            e && t.includes(e);
                                                        });
                                                if (i.length && i) {
                                                    var o = n.getAttribute('content');
                                                    if (o) return { value: o };
                                                }
                                            },
                                            i = 0;
                                        i < r.length;
                                        i++
                                    ) {
                                        var o = n(i);
                                        if ('object' == typeof o) return o.value;
                                    }
                                    return '';
                                }
                                var e = (function() {
                                    var e = t('name', 'og:site_name', 'og:title', 'twitter:title');
                                    return e || (e = document.title), e;
                                })();
                                return {
                                    description: t(
                                        'description',
                                        'og:description',
                                        'twitter:description',
                                        'keywords'
                                    ),
                                    url: window.location.origin,
                                    icons: (function() {
                                        for (
                                            var t = document.getElementsByTagName('link'),
                                                e = [],
                                                r = 0;
                                            r < t.length;
                                            r++
                                        ) {
                                            var n = t[r],
                                                i = n.getAttribute('rel');
                                            if (i && i.toLowerCase().indexOf('icon') > -1) {
                                                var o = n.getAttribute('href');
                                                if (o)
                                                    if (
                                                        -1 === o.toLowerCase().indexOf('https:') &&
                                                        -1 === o.toLowerCase().indexOf('http:') &&
                                                        0 !== o.indexOf('//')
                                                    ) {
                                                        var s =
                                                            window.location.protocol +
                                                            '//' +
                                                            window.location.host;
                                                        if (0 === o.indexOf('/')) s += o;
                                                        else {
                                                            var u = window.location.pathname.split(
                                                                '/'
                                                            );
                                                            u.pop(), (s += u.join('/') + '/' + o);
                                                        }
                                                        e.push(s);
                                                    } else if (0 === o.indexOf('//')) {
                                                        var a = window.location.protocol + o;
                                                        e.push(a);
                                                    } else e.push(o);
                                            }
                                        }
                                        return e;
                                    })(),
                                    name: e
                                };
                            }),
                            (e.parseQueryString = E),
                            (e.parseWalletConnectUri = function(t) {
                                var e = t.indexOf(':'),
                                    r = -1 !== t.indexOf('?') ? t.indexOf('?') : void 0,
                                    i = t.substring(0, e),
                                    o = (function(t) {
                                        var e = t.split('@');
                                        return {
                                            handshakeTopic: e[0],
                                            version: parseInt(e[1], 10)
                                        };
                                    })(t.substring(e + 1, r)),
                                    s = (function(t) {
                                        var e = E(t);
                                        return { key: e.key || '', bridge: e.bridge || '' };
                                    })(void 0 !== r ? t.substr(r) : '');
                                return n.__assign(n.__assign({ protocol: i }, o), s);
                            }),
                            (e.promisify = function(t, e) {
                                var r = this;
                                return function() {
                                    for (var i = [], o = 0; o < arguments.length; o++)
                                        i[o] = arguments[o];
                                    return n.__awaiter(r, void 0, void 0, function() {
                                        return n.__generator(this, function(r) {
                                            return [
                                                2,
                                                new Promise(function(r, o) {
                                                    t.apply(
                                                        e,
                                                        n.__spread(i, [
                                                            function(t, e) {
                                                                null == t && o(t), r(e);
                                                            }
                                                        ])
                                                    );
                                                })
                                            ];
                                        });
                                    });
                                };
                            }),
                            (e.isEmptyArray = R),
                            (e.parsePersonalSign = function(t) {
                                return R(t) || _(t[0]) || (t[0] = l(t[0])), t;
                            }),
                            (e.parseTransactionData = function(t) {
                                if (void 0 === t.from || !e.isValidAddress(t.from))
                                    throw new Error(
                                        "Transaction object must include a valid 'from' value."
                                    );
                                function r(t) {
                                    var e = t;
                                    return (
                                        ('number' == typeof t || ('string' == typeof t && !M(t))) &&
                                            (_(t)
                                                ? 'string' == typeof t && (e = v(t))
                                                : (e = p(t))),
                                        'string' == typeof e && (e = b(e)),
                                        e
                                    );
                                }
                                var n = {
                                        from: v(t.from),
                                        to: void 0 === t.to ? '' : v(t.to),
                                        gasPrice: void 0 === t.gasPrice ? '' : r(t.gasPrice),
                                        gasLimit:
                                            void 0 === t.gasLimit
                                                ? void 0 === t.gas
                                                    ? ''
                                                    : r(t.gas)
                                                : r(t.gasLimit),
                                        value: void 0 === t.value ? '' : r(t.value),
                                        nonce: void 0 === t.nonce ? '' : r(t.nonce),
                                        data: void 0 === t.data ? '' : v(t.data) || '0x'
                                    },
                                    i = ['gasPrice', 'gasLimit', 'value', 'nonce'];
                                return (
                                    Object.keys(n).forEach(function(t) {
                                        !n[t].trim().length && i.includes(t) && delete n[t];
                                    }),
                                    n
                                );
                            }),
                            (e.formatRpcError = function(t) {
                                var e = t.message || 'Failed or Rejected Request',
                                    r = -32e3;
                                if (t && !t.code)
                                    switch (e) {
                                        case 'Parse error':
                                            r = -32700;
                                            break;
                                        case 'Invalid request':
                                            r = -32600;
                                            break;
                                        case 'Method not found':
                                            r = -32601;
                                            break;
                                        case 'Invalid params':
                                            r = -32602;
                                            break;
                                        case 'Internal error':
                                            r = -32603;
                                            break;
                                        default:
                                            r = -32e3;
                                    }
                                return { code: r, message: e };
                            }),
                            (e.isJsonRpcSubscription = function(t) {
                                return 'object' == typeof t.params;
                            }),
                            (e.isJsonRpcRequest = function(t) {
                                return void 0 !== t.method;
                            }),
                            (e.isJsonRpcResponseSuccess = function(t) {
                                return void 0 !== t.result;
                            }),
                            (e.isJsonRpcResponseError = function(t) {
                                return void 0 !== t.error;
                            }),
                            (e.isInternalEvent = function(t) {
                                return void 0 !== t.event;
                            }),
                            (e.isWalletConnectSession = function(t) {
                                return void 0 !== t.bridge;
                            }),
                            (e.isReservedEvent = function(t) {
                                return (
                                    [
                                        'session_request',
                                        'session_update',
                                        'exchange_key',
                                        'connect',
                                        'disconnect',
                                        'display_uri',
                                        'transport_open',
                                        'transport_close'
                                    ].includes(t) || t.startsWith('wc_')
                                );
                            }),
                            (e.signingMethods = [
                                'eth_sendTransaction',
                                'eth_signTransaction',
                                'eth_sign',
                                'eth_signTypedData',
                                'eth_signTypedData_v1',
                                'eth_signTypedData_v3',
                                'personal_sign',
                                'moonletGetState',
                                'moonletSignTransaction'
                            ]),
                            (e.stateMethods = ['eth_accounts', 'eth_chainId', 'net_version']),
                            (e.isSilentPayload = function(t) {
                                return (
                                    !!t.method.startsWith('wc_') ||
                                    !e.signingMethods.includes(t.method)
                                );
                            });
                    }.call(this, r(7).Buffer));
                },
                function(t, e, r) {
                    'use strict';
                    (function(t) {
                        /*!
                         * The buffer module from node.js, for the browser.
                         *
                         * @author   Feross Aboukhadijeh <http://feross.org>
                         * @license  MIT
                         */
                        var n = r(8),
                            i = r(9),
                            o = r(10);
                        function s() {
                            return a.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
                        }
                        function u(t, e) {
                            if (s() < e) throw new RangeError('Invalid typed array length');
                            return (
                                a.TYPED_ARRAY_SUPPORT
                                    ? ((t = new Uint8Array(e)).__proto__ = a.prototype)
                                    : (null === t && (t = new a(e)), (t.length = e)),
                                t
                            );
                        }
                        function a(t, e, r) {
                            if (!(a.TYPED_ARRAY_SUPPORT || this instanceof a))
                                return new a(t, e, r);
                            if ('number' == typeof t) {
                                if ('string' == typeof e)
                                    throw new Error(
                                        'If encoding is specified then the first argument must be a string'
                                    );
                                return c(this, t);
                            }
                            return h(this, t, e, r);
                        }
                        function h(t, e, r, n) {
                            if ('number' == typeof e)
                                throw new TypeError('"value" argument must not be a number');
                            return 'undefined' != typeof ArrayBuffer && e instanceof ArrayBuffer
                                ? (function(t, e, r, n) {
                                      if ((e.byteLength, r < 0 || e.byteLength < r))
                                          throw new RangeError("'offset' is out of bounds");
                                      if (e.byteLength < r + (n || 0))
                                          throw new RangeError("'length' is out of bounds");
                                      return (
                                          (e =
                                              void 0 === r && void 0 === n
                                                  ? new Uint8Array(e)
                                                  : void 0 === n
                                                  ? new Uint8Array(e, r)
                                                  : new Uint8Array(e, r, n)),
                                          a.TYPED_ARRAY_SUPPORT
                                              ? ((t = e).__proto__ = a.prototype)
                                              : (t = l(t, e)),
                                          t
                                      );
                                  })(t, e, r, n)
                                : 'string' == typeof e
                                ? (function(t, e, r) {
                                      if (
                                          (('string' == typeof r && '' !== r) || (r = 'utf8'),
                                          !a.isEncoding(r))
                                      )
                                          throw new TypeError(
                                              '"encoding" must be a valid string encoding'
                                          );
                                      var n = 0 | d(e, r),
                                          i = (t = u(t, n)).write(e, r);
                                      return i !== n && (t = t.slice(0, i)), t;
                                  })(t, e, r)
                                : (function(t, e) {
                                      if (a.isBuffer(e)) {
                                          var r = 0 | p(e.length);
                                          return 0 === (t = u(t, r)).length
                                              ? t
                                              : (e.copy(t, 0, 0, r), t);
                                      }
                                      if (e) {
                                          if (
                                              ('undefined' != typeof ArrayBuffer &&
                                                  e.buffer instanceof ArrayBuffer) ||
                                              'length' in e
                                          )
                                              return 'number' != typeof e.length ||
                                                  (n = e.length) != n
                                                  ? u(t, 0)
                                                  : l(t, e);
                                          if ('Buffer' === e.type && o(e.data)) return l(t, e.data);
                                      }
                                      var n;
                                      throw new TypeError(
                                          'First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.'
                                      );
                                  })(t, e);
                        }
                        function f(t) {
                            if ('number' != typeof t)
                                throw new TypeError('"size" argument must be a number');
                            if (t < 0) throw new RangeError('"size" argument must not be negative');
                        }
                        function c(t, e) {
                            if ((f(e), (t = u(t, e < 0 ? 0 : 0 | p(e))), !a.TYPED_ARRAY_SUPPORT))
                                for (var r = 0; r < e; ++r) t[r] = 0;
                            return t;
                        }
                        function l(t, e) {
                            var r = e.length < 0 ? 0 : 0 | p(e.length);
                            t = u(t, r);
                            for (var n = 0; n < r; n += 1) t[n] = 255 & e[n];
                            return t;
                        }
                        function p(t) {
                            if (t >= s())
                                throw new RangeError(
                                    'Attempt to allocate Buffer larger than maximum size: 0x' +
                                        s().toString(16) +
                                        ' bytes'
                                );
                            return 0 | t;
                        }
                        function d(t, e) {
                            if (a.isBuffer(t)) return t.length;
                            if (
                                'undefined' != typeof ArrayBuffer &&
                                'function' == typeof ArrayBuffer.isView &&
                                (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)
                            )
                                return t.byteLength;
                            'string' != typeof t && (t = '' + t);
                            var r = t.length;
                            if (0 === r) return 0;
                            for (var n = !1; ; )
                                switch (e) {
                                    case 'ascii':
                                    case 'latin1':
                                    case 'binary':
                                        return r;
                                    case 'utf8':
                                    case 'utf-8':
                                    case void 0:
                                        return F(t).length;
                                    case 'ucs2':
                                    case 'ucs-2':
                                    case 'utf16le':
                                    case 'utf-16le':
                                        return 2 * r;
                                    case 'hex':
                                        return r >>> 1;
                                    case 'base64':
                                        return q(t).length;
                                    default:
                                        if (n) return F(t).length;
                                        (e = ('' + e).toLowerCase()), (n = !0);
                                }
                        }
                        function g(t, e, r) {
                            var n = !1;
                            if (((void 0 === e || e < 0) && (e = 0), e > this.length)) return '';
                            if (((void 0 === r || r > this.length) && (r = this.length), r <= 0))
                                return '';
                            if ((r >>>= 0) <= (e >>>= 0)) return '';
                            for (t || (t = 'utf8'); ; )
                                switch (t) {
                                    case 'hex':
                                        return N(this, e, r);
                                    case 'utf8':
                                    case 'utf-8':
                                        return O(this, e, r);
                                    case 'ascii':
                                        return I(this, e, r);
                                    case 'latin1':
                                    case 'binary':
                                        return A(this, e, r);
                                    case 'base64':
                                        return S(this, e, r);
                                    case 'ucs2':
                                    case 'ucs-2':
                                    case 'utf16le':
                                    case 'utf-16le':
                                        return T(this, e, r);
                                    default:
                                        if (n) throw new TypeError('Unknown encoding: ' + t);
                                        (t = (t + '').toLowerCase()), (n = !0);
                                }
                        }
                        function m(t, e, r) {
                            var n = t[e];
                            (t[e] = t[r]), (t[r] = n);
                        }
                        function v(t, e, r, n, i) {
                            if (0 === t.length) return -1;
                            if (
                                ('string' == typeof r
                                    ? ((n = r), (r = 0))
                                    : r > 2147483647
                                    ? (r = 2147483647)
                                    : r < -2147483648 && (r = -2147483648),
                                (r = +r),
                                isNaN(r) && (r = i ? 0 : t.length - 1),
                                r < 0 && (r = t.length + r),
                                r >= t.length)
                            ) {
                                if (i) return -1;
                                r = t.length - 1;
                            } else if (r < 0) {
                                if (!i) return -1;
                                r = 0;
                            }
                            if (('string' == typeof e && (e = a.from(e, n)), a.isBuffer(e)))
                                return 0 === e.length ? -1 : y(t, e, r, n, i);
                            if ('number' == typeof e)
                                return (
                                    (e &= 255),
                                    a.TYPED_ARRAY_SUPPORT &&
                                    'function' == typeof Uint8Array.prototype.indexOf
                                        ? i
                                            ? Uint8Array.prototype.indexOf.call(t, e, r)
                                            : Uint8Array.prototype.lastIndexOf.call(t, e, r)
                                        : y(t, [e], r, n, i)
                                );
                            throw new TypeError('val must be string, number or Buffer');
                        }
                        function y(t, e, r, n, i) {
                            var o,
                                s = 1,
                                u = t.length,
                                a = e.length;
                            if (
                                void 0 !== n &&
                                ('ucs2' === (n = String(n).toLowerCase()) ||
                                    'ucs-2' === n ||
                                    'utf16le' === n ||
                                    'utf-16le' === n)
                            ) {
                                if (t.length < 2 || e.length < 2) return -1;
                                (s = 2), (u /= 2), (a /= 2), (r /= 2);
                            }
                            function h(t, e) {
                                return 1 === s ? t[e] : t.readUInt16BE(e * s);
                            }
                            if (i) {
                                var f = -1;
                                for (o = r; o < u; o++)
                                    if (h(t, o) === h(e, -1 === f ? 0 : o - f)) {
                                        if ((-1 === f && (f = o), o - f + 1 === a)) return f * s;
                                    } else -1 !== f && (o -= o - f), (f = -1);
                            } else
                                for (r + a > u && (r = u - a), o = r; o >= 0; o--) {
                                    for (var c = !0, l = 0; l < a; l++)
                                        if (h(t, o + l) !== h(e, l)) {
                                            c = !1;
                                            break;
                                        }
                                    if (c) return o;
                                }
                            return -1;
                        }
                        function w(t, e, r, n) {
                            r = Number(r) || 0;
                            var i = t.length - r;
                            n ? (n = Number(n)) > i && (n = i) : (n = i);
                            var o = e.length;
                            if (o % 2 != 0) throw new TypeError('Invalid hex string');
                            n > o / 2 && (n = o / 2);
                            for (var s = 0; s < n; ++s) {
                                var u = parseInt(e.substr(2 * s, 2), 16);
                                if (isNaN(u)) return s;
                                t[r + s] = u;
                            }
                            return s;
                        }
                        function b(t, e, r, n) {
                            return G(F(e, t.length - r), t, r, n);
                        }
                        function _(t, e, r, n) {
                            return G(
                                (function(t) {
                                    for (var e = [], r = 0; r < t.length; ++r)
                                        e.push(255 & t.charCodeAt(r));
                                    return e;
                                })(e),
                                t,
                                r,
                                n
                            );
                        }
                        function M(t, e, r, n) {
                            return _(t, e, r, n);
                        }
                        function E(t, e, r, n) {
                            return G(q(e), t, r, n);
                        }
                        function R(t, e, r, n) {
                            return G(
                                (function(t, e) {
                                    for (
                                        var r, n, i, o = [], s = 0;
                                        s < t.length && !((e -= 2) < 0);
                                        ++s
                                    )
                                        (n = (r = t.charCodeAt(s)) >> 8),
                                            (i = r % 256),
                                            o.push(i),
                                            o.push(n);
                                    return o;
                                })(e, t.length - r),
                                t,
                                r,
                                n
                            );
                        }
                        function S(t, e, r) {
                            return 0 === e && r === t.length
                                ? n.fromByteArray(t)
                                : n.fromByteArray(t.slice(e, r));
                        }
                        function O(t, e, r) {
                            r = Math.min(t.length, r);
                            for (var n = [], i = e; i < r; ) {
                                var o,
                                    s,
                                    u,
                                    a,
                                    h = t[i],
                                    f = null,
                                    c = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
                                if (i + c <= r)
                                    switch (c) {
                                        case 1:
                                            h < 128 && (f = h);
                                            break;
                                        case 2:
                                            128 == (192 & (o = t[i + 1])) &&
                                                (a = ((31 & h) << 6) | (63 & o)) > 127 &&
                                                (f = a);
                                            break;
                                        case 3:
                                            (o = t[i + 1]),
                                                (s = t[i + 2]),
                                                128 == (192 & o) &&
                                                    128 == (192 & s) &&
                                                    (a =
                                                        ((15 & h) << 12) |
                                                        ((63 & o) << 6) |
                                                        (63 & s)) > 2047 &&
                                                    (a < 55296 || a > 57343) &&
                                                    (f = a);
                                            break;
                                        case 4:
                                            (o = t[i + 1]),
                                                (s = t[i + 2]),
                                                (u = t[i + 3]),
                                                128 == (192 & o) &&
                                                    128 == (192 & s) &&
                                                    128 == (192 & u) &&
                                                    (a =
                                                        ((15 & h) << 18) |
                                                        ((63 & o) << 12) |
                                                        ((63 & s) << 6) |
                                                        (63 & u)) > 65535 &&
                                                    a < 1114112 &&
                                                    (f = a);
                                    }
                                null === f
                                    ? ((f = 65533), (c = 1))
                                    : f > 65535 &&
                                      ((f -= 65536),
                                      n.push(((f >>> 10) & 1023) | 55296),
                                      (f = 56320 | (1023 & f))),
                                    n.push(f),
                                    (i += c);
                            }
                            return (function(t) {
                                var e = t.length;
                                if (e <= 4096) return String.fromCharCode.apply(String, t);
                                for (var r = '', n = 0; n < e; )
                                    r += String.fromCharCode.apply(String, t.slice(n, (n += 4096)));
                                return r;
                            })(n);
                        }
                        function I(t, e, r) {
                            var n = '';
                            r = Math.min(t.length, r);
                            for (var i = e; i < r; ++i) n += String.fromCharCode(127 & t[i]);
                            return n;
                        }
                        function A(t, e, r) {
                            var n = '';
                            r = Math.min(t.length, r);
                            for (var i = e; i < r; ++i) n += String.fromCharCode(t[i]);
                            return n;
                        }
                        function N(t, e, r) {
                            var n = t.length;
                            (!e || e < 0) && (e = 0), (!r || r < 0 || r > n) && (r = n);
                            for (var i = '', o = e; o < r; ++o) i += L(t[o]);
                            return i;
                        }
                        function T(t, e, r) {
                            for (var n = t.slice(e, r), i = '', o = 0; o < n.length; o += 2)
                                i += String.fromCharCode(n[o] + 256 * n[o + 1]);
                            return i;
                        }
                        function B(t, e, r) {
                            if (t % 1 != 0 || t < 0) throw new RangeError('offset is not uint');
                            if (t + e > r)
                                throw new RangeError('Trying to access beyond buffer length');
                        }
                        function x(t, e, r, n, i, o) {
                            if (!a.isBuffer(t))
                                throw new TypeError('"buffer" argument must be a Buffer instance');
                            if (e > i || e < o)
                                throw new RangeError('"value" argument is out of bounds');
                            if (r + n > t.length) throw new RangeError('Index out of range');
                        }
                        function P(t, e, r, n) {
                            e < 0 && (e = 65535 + e + 1);
                            for (var i = 0, o = Math.min(t.length - r, 2); i < o; ++i)
                                t[r + i] =
                                    (e & (255 << (8 * (n ? i : 1 - i)))) >>> (8 * (n ? i : 1 - i));
                        }
                        function k(t, e, r, n) {
                            e < 0 && (e = 4294967295 + e + 1);
                            for (var i = 0, o = Math.min(t.length - r, 4); i < o; ++i)
                                t[r + i] = (e >>> (8 * (n ? i : 3 - i))) & 255;
                        }
                        function C(t, e, r, n, i, o) {
                            if (r + n > t.length) throw new RangeError('Index out of range');
                            if (r < 0) throw new RangeError('Index out of range');
                        }
                        function U(t, e, r, n, o) {
                            return o || C(t, 0, r, 4), i.write(t, e, r, n, 23, 4), r + 4;
                        }
                        function D(t, e, r, n, o) {
                            return o || C(t, 0, r, 8), i.write(t, e, r, n, 52, 8), r + 8;
                        }
                        (e.Buffer = a),
                            (e.SlowBuffer = function(t) {
                                return +t != t && (t = 0), a.alloc(+t);
                            }),
                            (e.INSPECT_MAX_BYTES = 50),
                            (a.TYPED_ARRAY_SUPPORT =
                                void 0 !== t.TYPED_ARRAY_SUPPORT
                                    ? t.TYPED_ARRAY_SUPPORT
                                    : (function() {
                                          try {
                                              var t = new Uint8Array(1);
                                              return (
                                                  (t.__proto__ = {
                                                      __proto__: Uint8Array.prototype,
                                                      foo: function() {
                                                          return 42;
                                                      }
                                                  }),
                                                  42 === t.foo() &&
                                                      'function' == typeof t.subarray &&
                                                      0 === t.subarray(1, 1).byteLength
                                              );
                                          } catch (t) {
                                              return !1;
                                          }
                                      })()),
                            (e.kMaxLength = s()),
                            (a.poolSize = 8192),
                            (a._augment = function(t) {
                                return (t.__proto__ = a.prototype), t;
                            }),
                            (a.from = function(t, e, r) {
                                return h(null, t, e, r);
                            }),
                            a.TYPED_ARRAY_SUPPORT &&
                                ((a.prototype.__proto__ = Uint8Array.prototype),
                                (a.__proto__ = Uint8Array),
                                'undefined' != typeof Symbol &&
                                    Symbol.species &&
                                    a[Symbol.species] === a &&
                                    Object.defineProperty(a, Symbol.species, {
                                        value: null,
                                        configurable: !0
                                    })),
                            (a.alloc = function(t, e, r) {
                                return (function(t, e, r, n) {
                                    return (
                                        f(e),
                                        e <= 0
                                            ? u(t, e)
                                            : void 0 !== r
                                            ? 'string' == typeof n
                                                ? u(t, e).fill(r, n)
                                                : u(t, e).fill(r)
                                            : u(t, e)
                                    );
                                })(null, t, e, r);
                            }),
                            (a.allocUnsafe = function(t) {
                                return c(null, t);
                            }),
                            (a.allocUnsafeSlow = function(t) {
                                return c(null, t);
                            }),
                            (a.isBuffer = function(t) {
                                return !(null == t || !t._isBuffer);
                            }),
                            (a.compare = function(t, e) {
                                if (!a.isBuffer(t) || !a.isBuffer(e))
                                    throw new TypeError('Arguments must be Buffers');
                                if (t === e) return 0;
                                for (
                                    var r = t.length, n = e.length, i = 0, o = Math.min(r, n);
                                    i < o;
                                    ++i
                                )
                                    if (t[i] !== e[i]) {
                                        (r = t[i]), (n = e[i]);
                                        break;
                                    }
                                return r < n ? -1 : n < r ? 1 : 0;
                            }),
                            (a.isEncoding = function(t) {
                                switch (String(t).toLowerCase()) {
                                    case 'hex':
                                    case 'utf8':
                                    case 'utf-8':
                                    case 'ascii':
                                    case 'latin1':
                                    case 'binary':
                                    case 'base64':
                                    case 'ucs2':
                                    case 'ucs-2':
                                    case 'utf16le':
                                    case 'utf-16le':
                                        return !0;
                                    default:
                                        return !1;
                                }
                            }),
                            (a.concat = function(t, e) {
                                if (!o(t))
                                    throw new TypeError(
                                        '"list" argument must be an Array of Buffers'
                                    );
                                if (0 === t.length) return a.alloc(0);
                                var r;
                                if (void 0 === e)
                                    for (e = 0, r = 0; r < t.length; ++r) e += t[r].length;
                                var n = a.allocUnsafe(e),
                                    i = 0;
                                for (r = 0; r < t.length; ++r) {
                                    var s = t[r];
                                    if (!a.isBuffer(s))
                                        throw new TypeError(
                                            '"list" argument must be an Array of Buffers'
                                        );
                                    s.copy(n, i), (i += s.length);
                                }
                                return n;
                            }),
                            (a.byteLength = d),
                            (a.prototype._isBuffer = !0),
                            (a.prototype.swap16 = function() {
                                var t = this.length;
                                if (t % 2 != 0)
                                    throw new RangeError(
                                        'Buffer size must be a multiple of 16-bits'
                                    );
                                for (var e = 0; e < t; e += 2) m(this, e, e + 1);
                                return this;
                            }),
                            (a.prototype.swap32 = function() {
                                var t = this.length;
                                if (t % 4 != 0)
                                    throw new RangeError(
                                        'Buffer size must be a multiple of 32-bits'
                                    );
                                for (var e = 0; e < t; e += 4)
                                    m(this, e, e + 3), m(this, e + 1, e + 2);
                                return this;
                            }),
                            (a.prototype.swap64 = function() {
                                var t = this.length;
                                if (t % 8 != 0)
                                    throw new RangeError(
                                        'Buffer size must be a multiple of 64-bits'
                                    );
                                for (var e = 0; e < t; e += 8)
                                    m(this, e, e + 7),
                                        m(this, e + 1, e + 6),
                                        m(this, e + 2, e + 5),
                                        m(this, e + 3, e + 4);
                                return this;
                            }),
                            (a.prototype.toString = function() {
                                var t = 0 | this.length;
                                return 0 === t
                                    ? ''
                                    : 0 === arguments.length
                                    ? O(this, 0, t)
                                    : g.apply(this, arguments);
                            }),
                            (a.prototype.equals = function(t) {
                                if (!a.isBuffer(t))
                                    throw new TypeError('Argument must be a Buffer');
                                return this === t || 0 === a.compare(this, t);
                            }),
                            (a.prototype.inspect = function() {
                                var t = '',
                                    r = e.INSPECT_MAX_BYTES;
                                return (
                                    this.length > 0 &&
                                        ((t = this.toString('hex', 0, r)
                                            .match(/.{2}/g)
                                            .join(' ')),
                                        this.length > r && (t += ' ... ')),
                                    '<Buffer ' + t + '>'
                                );
                            }),
                            (a.prototype.compare = function(t, e, r, n, i) {
                                if (!a.isBuffer(t))
                                    throw new TypeError('Argument must be a Buffer');
                                if (
                                    (void 0 === e && (e = 0),
                                    void 0 === r && (r = t ? t.length : 0),
                                    void 0 === n && (n = 0),
                                    void 0 === i && (i = this.length),
                                    e < 0 || r > t.length || n < 0 || i > this.length)
                                )
                                    throw new RangeError('out of range index');
                                if (n >= i && e >= r) return 0;
                                if (n >= i) return -1;
                                if (e >= r) return 1;
                                if (this === t) return 0;
                                for (
                                    var o = (i >>>= 0) - (n >>>= 0),
                                        s = (r >>>= 0) - (e >>>= 0),
                                        u = Math.min(o, s),
                                        h = this.slice(n, i),
                                        f = t.slice(e, r),
                                        c = 0;
                                    c < u;
                                    ++c
                                )
                                    if (h[c] !== f[c]) {
                                        (o = h[c]), (s = f[c]);
                                        break;
                                    }
                                return o < s ? -1 : s < o ? 1 : 0;
                            }),
                            (a.prototype.includes = function(t, e, r) {
                                return -1 !== this.indexOf(t, e, r);
                            }),
                            (a.prototype.indexOf = function(t, e, r) {
                                return v(this, t, e, r, !0);
                            }),
                            (a.prototype.lastIndexOf = function(t, e, r) {
                                return v(this, t, e, r, !1);
                            }),
                            (a.prototype.write = function(t, e, r, n) {
                                if (void 0 === e) (n = 'utf8'), (r = this.length), (e = 0);
                                else if (void 0 === r && 'string' == typeof e)
                                    (n = e), (r = this.length), (e = 0);
                                else {
                                    if (!isFinite(e))
                                        throw new Error(
                                            'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                                        );
                                    (e |= 0),
                                        isFinite(r)
                                            ? ((r |= 0), void 0 === n && (n = 'utf8'))
                                            : ((n = r), (r = void 0));
                                }
                                var i = this.length - e;
                                if (
                                    ((void 0 === r || r > i) && (r = i),
                                    (t.length > 0 && (r < 0 || e < 0)) || e > this.length)
                                )
                                    throw new RangeError('Attempt to write outside buffer bounds');
                                n || (n = 'utf8');
                                for (var o = !1; ; )
                                    switch (n) {
                                        case 'hex':
                                            return w(this, t, e, r);
                                        case 'utf8':
                                        case 'utf-8':
                                            return b(this, t, e, r);
                                        case 'ascii':
                                            return _(this, t, e, r);
                                        case 'latin1':
                                        case 'binary':
                                            return M(this, t, e, r);
                                        case 'base64':
                                            return E(this, t, e, r);
                                        case 'ucs2':
                                        case 'ucs-2':
                                        case 'utf16le':
                                        case 'utf-16le':
                                            return R(this, t, e, r);
                                        default:
                                            if (o) throw new TypeError('Unknown encoding: ' + n);
                                            (n = ('' + n).toLowerCase()), (o = !0);
                                    }
                            }),
                            (a.prototype.toJSON = function() {
                                return {
                                    type: 'Buffer',
                                    data: Array.prototype.slice.call(this._arr || this, 0)
                                };
                            }),
                            (a.prototype.slice = function(t, e) {
                                var r,
                                    n = this.length;
                                if (
                                    ((t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n),
                                    (e = void 0 === e ? n : ~~e) < 0
                                        ? (e += n) < 0 && (e = 0)
                                        : e > n && (e = n),
                                    e < t && (e = t),
                                    a.TYPED_ARRAY_SUPPORT)
                                )
                                    (r = this.subarray(t, e)).__proto__ = a.prototype;
                                else {
                                    var i = e - t;
                                    r = new a(i, void 0);
                                    for (var o = 0; o < i; ++o) r[o] = this[o + t];
                                }
                                return r;
                            }),
                            (a.prototype.readUIntLE = function(t, e, r) {
                                (t |= 0), (e |= 0), r || B(t, e, this.length);
                                for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256); )
                                    n += this[t + o] * i;
                                return n;
                            }),
                            (a.prototype.readUIntBE = function(t, e, r) {
                                (t |= 0), (e |= 0), r || B(t, e, this.length);
                                for (var n = this[t + --e], i = 1; e > 0 && (i *= 256); )
                                    n += this[t + --e] * i;
                                return n;
                            }),
                            (a.prototype.readUInt8 = function(t, e) {
                                return e || B(t, 1, this.length), this[t];
                            }),
                            (a.prototype.readUInt16LE = function(t, e) {
                                return e || B(t, 2, this.length), this[t] | (this[t + 1] << 8);
                            }),
                            (a.prototype.readUInt16BE = function(t, e) {
                                return e || B(t, 2, this.length), (this[t] << 8) | this[t + 1];
                            }),
                            (a.prototype.readUInt32LE = function(t, e) {
                                return (
                                    e || B(t, 4, this.length),
                                    (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
                                        16777216 * this[t + 3]
                                );
                            }),
                            (a.prototype.readUInt32BE = function(t, e) {
                                return (
                                    e || B(t, 4, this.length),
                                    16777216 * this[t] +
                                        ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
                                );
                            }),
                            (a.prototype.readIntLE = function(t, e, r) {
                                (t |= 0), (e |= 0), r || B(t, e, this.length);
                                for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256); )
                                    n += this[t + o] * i;
                                return n >= (i *= 128) && (n -= Math.pow(2, 8 * e)), n;
                            }),
                            (a.prototype.readIntBE = function(t, e, r) {
                                (t |= 0), (e |= 0), r || B(t, e, this.length);
                                for (var n = e, i = 1, o = this[t + --n]; n > 0 && (i *= 256); )
                                    o += this[t + --n] * i;
                                return o >= (i *= 128) && (o -= Math.pow(2, 8 * e)), o;
                            }),
                            (a.prototype.readInt8 = function(t, e) {
                                return (
                                    e || B(t, 1, this.length),
                                    128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
                                );
                            }),
                            (a.prototype.readInt16LE = function(t, e) {
                                e || B(t, 2, this.length);
                                var r = this[t] | (this[t + 1] << 8);
                                return 32768 & r ? 4294901760 | r : r;
                            }),
                            (a.prototype.readInt16BE = function(t, e) {
                                e || B(t, 2, this.length);
                                var r = this[t + 1] | (this[t] << 8);
                                return 32768 & r ? 4294901760 | r : r;
                            }),
                            (a.prototype.readInt32LE = function(t, e) {
                                return (
                                    e || B(t, 4, this.length),
                                    this[t] |
                                        (this[t + 1] << 8) |
                                        (this[t + 2] << 16) |
                                        (this[t + 3] << 24)
                                );
                            }),
                            (a.prototype.readInt32BE = function(t, e) {
                                return (
                                    e || B(t, 4, this.length),
                                    (this[t] << 24) |
                                        (this[t + 1] << 16) |
                                        (this[t + 2] << 8) |
                                        this[t + 3]
                                );
                            }),
                            (a.prototype.readFloatLE = function(t, e) {
                                return e || B(t, 4, this.length), i.read(this, t, !0, 23, 4);
                            }),
                            (a.prototype.readFloatBE = function(t, e) {
                                return e || B(t, 4, this.length), i.read(this, t, !1, 23, 4);
                            }),
                            (a.prototype.readDoubleLE = function(t, e) {
                                return e || B(t, 8, this.length), i.read(this, t, !0, 52, 8);
                            }),
                            (a.prototype.readDoubleBE = function(t, e) {
                                return e || B(t, 8, this.length), i.read(this, t, !1, 52, 8);
                            }),
                            (a.prototype.writeUIntLE = function(t, e, r, n) {
                                (t = +t),
                                    (e |= 0),
                                    (r |= 0),
                                    n || x(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                                var i = 1,
                                    o = 0;
                                for (this[e] = 255 & t; ++o < r && (i *= 256); )
                                    this[e + o] = (t / i) & 255;
                                return e + r;
                            }),
                            (a.prototype.writeUIntBE = function(t, e, r, n) {
                                (t = +t),
                                    (e |= 0),
                                    (r |= 0),
                                    n || x(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                                var i = r - 1,
                                    o = 1;
                                for (this[e + i] = 255 & t; --i >= 0 && (o *= 256); )
                                    this[e + i] = (t / o) & 255;
                                return e + r;
                            }),
                            (a.prototype.writeUInt8 = function(t, e, r) {
                                return (
                                    (t = +t),
                                    (e |= 0),
                                    r || x(this, t, e, 1, 255, 0),
                                    a.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                                    (this[e] = 255 & t),
                                    e + 1
                                );
                            }),
                            (a.prototype.writeUInt16LE = function(t, e, r) {
                                return (
                                    (t = +t),
                                    (e |= 0),
                                    r || x(this, t, e, 2, 65535, 0),
                                    a.TYPED_ARRAY_SUPPORT
                                        ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8))
                                        : P(this, t, e, !0),
                                    e + 2
                                );
                            }),
                            (a.prototype.writeUInt16BE = function(t, e, r) {
                                return (
                                    (t = +t),
                                    (e |= 0),
                                    r || x(this, t, e, 2, 65535, 0),
                                    a.TYPED_ARRAY_SUPPORT
                                        ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t))
                                        : P(this, t, e, !1),
                                    e + 2
                                );
                            }),
                            (a.prototype.writeUInt32LE = function(t, e, r) {
                                return (
                                    (t = +t),
                                    (e |= 0),
                                    r || x(this, t, e, 4, 4294967295, 0),
                                    a.TYPED_ARRAY_SUPPORT
                                        ? ((this[e + 3] = t >>> 24),
                                          (this[e + 2] = t >>> 16),
                                          (this[e + 1] = t >>> 8),
                                          (this[e] = 255 & t))
                                        : k(this, t, e, !0),
                                    e + 4
                                );
                            }),
                            (a.prototype.writeUInt32BE = function(t, e, r) {
                                return (
                                    (t = +t),
                                    (e |= 0),
                                    r || x(this, t, e, 4, 4294967295, 0),
                                    a.TYPED_ARRAY_SUPPORT
                                        ? ((this[e] = t >>> 24),
                                          (this[e + 1] = t >>> 16),
                                          (this[e + 2] = t >>> 8),
                                          (this[e + 3] = 255 & t))
                                        : k(this, t, e, !1),
                                    e + 4
                                );
                            }),
                            (a.prototype.writeIntLE = function(t, e, r, n) {
                                if (((t = +t), (e |= 0), !n)) {
                                    var i = Math.pow(2, 8 * r - 1);
                                    x(this, t, e, r, i - 1, -i);
                                }
                                var o = 0,
                                    s = 1,
                                    u = 0;
                                for (this[e] = 255 & t; ++o < r && (s *= 256); )
                                    t < 0 && 0 === u && 0 !== this[e + o - 1] && (u = 1),
                                        (this[e + o] = (((t / s) >> 0) - u) & 255);
                                return e + r;
                            }),
                            (a.prototype.writeIntBE = function(t, e, r, n) {
                                if (((t = +t), (e |= 0), !n)) {
                                    var i = Math.pow(2, 8 * r - 1);
                                    x(this, t, e, r, i - 1, -i);
                                }
                                var o = r - 1,
                                    s = 1,
                                    u = 0;
                                for (this[e + o] = 255 & t; --o >= 0 && (s *= 256); )
                                    t < 0 && 0 === u && 0 !== this[e + o + 1] && (u = 1),
                                        (this[e + o] = (((t / s) >> 0) - u) & 255);
                                return e + r;
                            }),
                            (a.prototype.writeInt8 = function(t, e, r) {
                                return (
                                    (t = +t),
                                    (e |= 0),
                                    r || x(this, t, e, 1, 127, -128),
                                    a.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                                    t < 0 && (t = 255 + t + 1),
                                    (this[e] = 255 & t),
                                    e + 1
                                );
                            }),
                            (a.prototype.writeInt16LE = function(t, e, r) {
                                return (
                                    (t = +t),
                                    (e |= 0),
                                    r || x(this, t, e, 2, 32767, -32768),
                                    a.TYPED_ARRAY_SUPPORT
                                        ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8))
                                        : P(this, t, e, !0),
                                    e + 2
                                );
                            }),
                            (a.prototype.writeInt16BE = function(t, e, r) {
                                return (
                                    (t = +t),
                                    (e |= 0),
                                    r || x(this, t, e, 2, 32767, -32768),
                                    a.TYPED_ARRAY_SUPPORT
                                        ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t))
                                        : P(this, t, e, !1),
                                    e + 2
                                );
                            }),
                            (a.prototype.writeInt32LE = function(t, e, r) {
                                return (
                                    (t = +t),
                                    (e |= 0),
                                    r || x(this, t, e, 4, 2147483647, -2147483648),
                                    a.TYPED_ARRAY_SUPPORT
                                        ? ((this[e] = 255 & t),
                                          (this[e + 1] = t >>> 8),
                                          (this[e + 2] = t >>> 16),
                                          (this[e + 3] = t >>> 24))
                                        : k(this, t, e, !0),
                                    e + 4
                                );
                            }),
                            (a.prototype.writeInt32BE = function(t, e, r) {
                                return (
                                    (t = +t),
                                    (e |= 0),
                                    r || x(this, t, e, 4, 2147483647, -2147483648),
                                    t < 0 && (t = 4294967295 + t + 1),
                                    a.TYPED_ARRAY_SUPPORT
                                        ? ((this[e] = t >>> 24),
                                          (this[e + 1] = t >>> 16),
                                          (this[e + 2] = t >>> 8),
                                          (this[e + 3] = 255 & t))
                                        : k(this, t, e, !1),
                                    e + 4
                                );
                            }),
                            (a.prototype.writeFloatLE = function(t, e, r) {
                                return U(this, t, e, !0, r);
                            }),
                            (a.prototype.writeFloatBE = function(t, e, r) {
                                return U(this, t, e, !1, r);
                            }),
                            (a.prototype.writeDoubleLE = function(t, e, r) {
                                return D(this, t, e, !0, r);
                            }),
                            (a.prototype.writeDoubleBE = function(t, e, r) {
                                return D(this, t, e, !1, r);
                            }),
                            (a.prototype.copy = function(t, e, r, n) {
                                if (
                                    (r || (r = 0),
                                    n || 0 === n || (n = this.length),
                                    e >= t.length && (e = t.length),
                                    e || (e = 0),
                                    n > 0 && n < r && (n = r),
                                    n === r)
                                )
                                    return 0;
                                if (0 === t.length || 0 === this.length) return 0;
                                if (e < 0) throw new RangeError('targetStart out of bounds');
                                if (r < 0 || r >= this.length)
                                    throw new RangeError('sourceStart out of bounds');
                                if (n < 0) throw new RangeError('sourceEnd out of bounds');
                                n > this.length && (n = this.length),
                                    t.length - e < n - r && (n = t.length - e + r);
                                var i,
                                    o = n - r;
                                if (this === t && r < e && e < n)
                                    for (i = o - 1; i >= 0; --i) t[i + e] = this[i + r];
                                else if (o < 1e3 || !a.TYPED_ARRAY_SUPPORT)
                                    for (i = 0; i < o; ++i) t[i + e] = this[i + r];
                                else Uint8Array.prototype.set.call(t, this.subarray(r, r + o), e);
                                return o;
                            }),
                            (a.prototype.fill = function(t, e, r, n) {
                                if ('string' == typeof t) {
                                    if (
                                        ('string' == typeof e
                                            ? ((n = e), (e = 0), (r = this.length))
                                            : 'string' == typeof r && ((n = r), (r = this.length)),
                                        1 === t.length)
                                    ) {
                                        var i = t.charCodeAt(0);
                                        i < 256 && (t = i);
                                    }
                                    if (void 0 !== n && 'string' != typeof n)
                                        throw new TypeError('encoding must be a string');
                                    if ('string' == typeof n && !a.isEncoding(n))
                                        throw new TypeError('Unknown encoding: ' + n);
                                } else 'number' == typeof t && (t &= 255);
                                if (e < 0 || this.length < e || this.length < r)
                                    throw new RangeError('Out of range index');
                                if (r <= e) return this;
                                var o;
                                if (
                                    ((e >>>= 0),
                                    (r = void 0 === r ? this.length : r >>> 0),
                                    t || (t = 0),
                                    'number' == typeof t)
                                )
                                    for (o = e; o < r; ++o) this[o] = t;
                                else {
                                    var s = a.isBuffer(t) ? t : F(new a(t, n).toString()),
                                        u = s.length;
                                    for (o = 0; o < r - e; ++o) this[o + e] = s[o % u];
                                }
                                return this;
                            });
                        var j = /[^+\/0-9A-Za-z-_]/g;
                        function L(t) {
                            return t < 16 ? '0' + t.toString(16) : t.toString(16);
                        }
                        function F(t, e) {
                            var r;
                            e = e || 1 / 0;
                            for (var n = t.length, i = null, o = [], s = 0; s < n; ++s) {
                                if ((r = t.charCodeAt(s)) > 55295 && r < 57344) {
                                    if (!i) {
                                        if (r > 56319) {
                                            (e -= 3) > -1 && o.push(239, 191, 189);
                                            continue;
                                        }
                                        if (s + 1 === n) {
                                            (e -= 3) > -1 && o.push(239, 191, 189);
                                            continue;
                                        }
                                        i = r;
                                        continue;
                                    }
                                    if (r < 56320) {
                                        (e -= 3) > -1 && o.push(239, 191, 189), (i = r);
                                        continue;
                                    }
                                    r = 65536 + (((i - 55296) << 10) | (r - 56320));
                                } else i && (e -= 3) > -1 && o.push(239, 191, 189);
                                if (((i = null), r < 128)) {
                                    if ((e -= 1) < 0) break;
                                    o.push(r);
                                } else if (r < 2048) {
                                    if ((e -= 2) < 0) break;
                                    o.push((r >> 6) | 192, (63 & r) | 128);
                                } else if (r < 65536) {
                                    if ((e -= 3) < 0) break;
                                    o.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (63 & r) | 128);
                                } else {
                                    if (!(r < 1114112)) throw new Error('Invalid code point');
                                    if ((e -= 4) < 0) break;
                                    o.push(
                                        (r >> 18) | 240,
                                        ((r >> 12) & 63) | 128,
                                        ((r >> 6) & 63) | 128,
                                        (63 & r) | 128
                                    );
                                }
                            }
                            return o;
                        }
                        function q(t) {
                            return n.toByteArray(
                                (function(t) {
                                    if (
                                        (t = (function(t) {
                                            return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, '');
                                        })(t).replace(j, '')).length < 2
                                    )
                                        return '';
                                    for (; t.length % 4 != 0; ) t += '=';
                                    return t;
                                })(t)
                            );
                        }
                        function G(t, e, r, n) {
                            for (var i = 0; i < n && !(i + r >= e.length || i >= t.length); ++i)
                                e[i + r] = t[i];
                            return i;
                        }
                    }.call(this, r(4)));
                },
                function(t, e, r) {
                    'use strict';
                    (e.byteLength = function(t) {
                        var e = h(t),
                            r = e[0],
                            n = e[1];
                        return (3 * (r + n)) / 4 - n;
                    }),
                        (e.toByteArray = function(t) {
                            var e,
                                r,
                                n = h(t),
                                s = n[0],
                                u = n[1],
                                a = new o(
                                    (function(t, e, r) {
                                        return (3 * (e + r)) / 4 - r;
                                    })(0, s, u)
                                ),
                                f = 0,
                                c = u > 0 ? s - 4 : s;
                            for (r = 0; r < c; r += 4)
                                (e =
                                    (i[t.charCodeAt(r)] << 18) |
                                    (i[t.charCodeAt(r + 1)] << 12) |
                                    (i[t.charCodeAt(r + 2)] << 6) |
                                    i[t.charCodeAt(r + 3)]),
                                    (a[f++] = (e >> 16) & 255),
                                    (a[f++] = (e >> 8) & 255),
                                    (a[f++] = 255 & e);
                            return (
                                2 === u &&
                                    ((e =
                                        (i[t.charCodeAt(r)] << 2) | (i[t.charCodeAt(r + 1)] >> 4)),
                                    (a[f++] = 255 & e)),
                                1 === u &&
                                    ((e =
                                        (i[t.charCodeAt(r)] << 10) |
                                        (i[t.charCodeAt(r + 1)] << 4) |
                                        (i[t.charCodeAt(r + 2)] >> 2)),
                                    (a[f++] = (e >> 8) & 255),
                                    (a[f++] = 255 & e)),
                                a
                            );
                        }),
                        (e.fromByteArray = function(t) {
                            for (
                                var e, r = t.length, i = r % 3, o = [], s = 0, u = r - i;
                                s < u;
                                s += 16383
                            )
                                o.push(f(t, s, s + 16383 > u ? u : s + 16383));
                            return (
                                1 === i
                                    ? ((e = t[r - 1]), o.push(n[e >> 2] + n[(e << 4) & 63] + '=='))
                                    : 2 === i &&
                                      ((e = (t[r - 2] << 8) + t[r - 1]),
                                      o.push(
                                          n[e >> 10] + n[(e >> 4) & 63] + n[(e << 2) & 63] + '='
                                      )),
                                o.join('')
                            );
                        });
                    for (
                        var n = [],
                            i = [],
                            o = 'undefined' != typeof Uint8Array ? Uint8Array : Array,
                            s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
                            u = 0,
                            a = s.length;
                        u < a;
                        ++u
                    )
                        (n[u] = s[u]), (i[s.charCodeAt(u)] = u);
                    function h(t) {
                        var e = t.length;
                        if (e % 4 > 0)
                            throw new Error('Invalid string. Length must be a multiple of 4');
                        var r = t.indexOf('=');
                        return -1 === r && (r = e), [r, r === e ? 0 : 4 - (r % 4)];
                    }
                    function f(t, e, r) {
                        for (var i, o, s = [], u = e; u < r; u += 3)
                            (i =
                                ((t[u] << 16) & 16711680) +
                                ((t[u + 1] << 8) & 65280) +
                                (255 & t[u + 2])),
                                s.push(
                                    n[((o = i) >> 18) & 63] +
                                        n[(o >> 12) & 63] +
                                        n[(o >> 6) & 63] +
                                        n[63 & o]
                                );
                        return s.join('');
                    }
                    (i['-'.charCodeAt(0)] = 62), (i['_'.charCodeAt(0)] = 63);
                },
                function(t, e) {
                    (e.read = function(t, e, r, n, i) {
                        var o,
                            s,
                            u = 8 * i - n - 1,
                            a = (1 << u) - 1,
                            h = a >> 1,
                            f = -7,
                            c = r ? i - 1 : 0,
                            l = r ? -1 : 1,
                            p = t[e + c];
                        for (
                            c += l, o = p & ((1 << -f) - 1), p >>= -f, f += u;
                            f > 0;
                            o = 256 * o + t[e + c], c += l, f -= 8
                        );
                        for (
                            s = o & ((1 << -f) - 1), o >>= -f, f += n;
                            f > 0;
                            s = 256 * s + t[e + c], c += l, f -= 8
                        );
                        if (0 === o) o = 1 - h;
                        else {
                            if (o === a) return s ? NaN : (1 / 0) * (p ? -1 : 1);
                            (s += Math.pow(2, n)), (o -= h);
                        }
                        return (p ? -1 : 1) * s * Math.pow(2, o - n);
                    }),
                        (e.write = function(t, e, r, n, i, o) {
                            var s,
                                u,
                                a,
                                h = 8 * o - i - 1,
                                f = (1 << h) - 1,
                                c = f >> 1,
                                l = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                                p = n ? 0 : o - 1,
                                d = n ? 1 : -1,
                                g = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0;
                            for (
                                e = Math.abs(e),
                                    isNaN(e) || e === 1 / 0
                                        ? ((u = isNaN(e) ? 1 : 0), (s = f))
                                        : ((s = Math.floor(Math.log(e) / Math.LN2)),
                                          e * (a = Math.pow(2, -s)) < 1 && (s--, (a *= 2)),
                                          (e += s + c >= 1 ? l / a : l * Math.pow(2, 1 - c)) * a >=
                                              2 && (s++, (a /= 2)),
                                          s + c >= f
                                              ? ((u = 0), (s = f))
                                              : s + c >= 1
                                              ? ((u = (e * a - 1) * Math.pow(2, i)), (s += c))
                                              : ((u = e * Math.pow(2, c - 1) * Math.pow(2, i)),
                                                (s = 0)));
                                i >= 8;
                                t[r + p] = 255 & u, p += d, u /= 256, i -= 8
                            );
                            for (
                                s = (s << i) | u, h += i;
                                h > 0;
                                t[r + p] = 255 & s, p += d, s /= 256, h -= 8
                            );
                            t[r + p - d] |= 128 * g;
                        });
                },
                function(t, e) {
                    var r = {}.toString;
                    t.exports =
                        Array.isArray ||
                        function(t) {
                            return '[object Array]' == r.call(t);
                        };
                },
                function(t, e, r) {
                    'use strict';
                    r.r(e),
                        r.d(e, '__extends', function() {
                            return i;
                        }),
                        r.d(e, '__assign', function() {
                            return o;
                        }),
                        r.d(e, '__rest', function() {
                            return s;
                        }),
                        r.d(e, '__decorate', function() {
                            return u;
                        }),
                        r.d(e, '__param', function() {
                            return a;
                        }),
                        r.d(e, '__metadata', function() {
                            return h;
                        }),
                        r.d(e, '__awaiter', function() {
                            return f;
                        }),
                        r.d(e, '__generator', function() {
                            return c;
                        }),
                        r.d(e, '__exportStar', function() {
                            return l;
                        }),
                        r.d(e, '__values', function() {
                            return p;
                        }),
                        r.d(e, '__read', function() {
                            return d;
                        }),
                        r.d(e, '__spread', function() {
                            return g;
                        }),
                        r.d(e, '__spreadArrays', function() {
                            return m;
                        }),
                        r.d(e, '__await', function() {
                            return v;
                        }),
                        r.d(e, '__asyncGenerator', function() {
                            return y;
                        }),
                        r.d(e, '__asyncDelegator', function() {
                            return w;
                        }),
                        r.d(e, '__asyncValues', function() {
                            return b;
                        }),
                        r.d(e, '__makeTemplateObject', function() {
                            return _;
                        }),
                        r.d(e, '__importStar', function() {
                            return M;
                        }),
                        r.d(e, '__importDefault', function() {
                            return E;
                        });
                    /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
                    var n = function(t, e) {
                        return (n =
                            Object.setPrototypeOf ||
                            ({ __proto__: [] } instanceof Array &&
                                function(t, e) {
                                    t.__proto__ = e;
                                }) ||
                            function(t, e) {
                                for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
                            })(t, e);
                    };
                    function i(t, e) {
                        function r() {
                            this.constructor = t;
                        }
                        n(t, e),
                            (t.prototype =
                                null === e
                                    ? Object.create(e)
                                    : ((r.prototype = e.prototype), new r()));
                    }
                    var o = function() {
                        return (o =
                            Object.assign ||
                            function(t) {
                                for (var e, r = 1, n = arguments.length; r < n; r++)
                                    for (var i in (e = arguments[r]))
                                        Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                                return t;
                            }).apply(this, arguments);
                    };
                    function s(t, e) {
                        var r = {};
                        for (var n in t)
                            Object.prototype.hasOwnProperty.call(t, n) &&
                                e.indexOf(n) < 0 &&
                                (r[n] = t[n]);
                        if (null != t && 'function' == typeof Object.getOwnPropertySymbols) {
                            var i = 0;
                            for (n = Object.getOwnPropertySymbols(t); i < n.length; i++)
                                e.indexOf(n[i]) < 0 &&
                                    Object.prototype.propertyIsEnumerable.call(t, n[i]) &&
                                    (r[n[i]] = t[n[i]]);
                        }
                        return r;
                    }
                    function u(t, e, r, n) {
                        var i,
                            o = arguments.length,
                            s =
                                o < 3
                                    ? e
                                    : null === n
                                    ? (n = Object.getOwnPropertyDescriptor(e, r))
                                    : n;
                        if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
                            s = Reflect.decorate(t, e, r, n);
                        else
                            for (var u = t.length - 1; u >= 0; u--)
                                (i = t[u]) &&
                                    (s = (o < 3 ? i(s) : o > 3 ? i(e, r, s) : i(e, r)) || s);
                        return o > 3 && s && Object.defineProperty(e, r, s), s;
                    }
                    function a(t, e) {
                        return function(r, n) {
                            e(r, n, t);
                        };
                    }
                    function h(t, e) {
                        if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
                            return Reflect.metadata(t, e);
                    }
                    function f(t, e, r, n) {
                        return new (r || (r = Promise))(function(i, o) {
                            function s(t) {
                                try {
                                    a(n.next(t));
                                } catch (t) {
                                    o(t);
                                }
                            }
                            function u(t) {
                                try {
                                    a(n.throw(t));
                                } catch (t) {
                                    o(t);
                                }
                            }
                            function a(t) {
                                t.done
                                    ? i(t.value)
                                    : new r(function(e) {
                                          e(t.value);
                                      }).then(s, u);
                            }
                            a((n = n.apply(t, e || [])).next());
                        });
                    }
                    function c(t, e) {
                        var r,
                            n,
                            i,
                            o,
                            s = {
                                label: 0,
                                sent: function() {
                                    if (1 & i[0]) throw i[1];
                                    return i[1];
                                },
                                trys: [],
                                ops: []
                            };
                        return (
                            (o = { next: u(0), throw: u(1), return: u(2) }),
                            'function' == typeof Symbol &&
                                (o[Symbol.iterator] = function() {
                                    return this;
                                }),
                            o
                        );
                        function u(o) {
                            return function(u) {
                                return (function(o) {
                                    if (r) throw new TypeError('Generator is already executing.');
                                    for (; s; )
                                        try {
                                            if (
                                                ((r = 1),
                                                n &&
                                                    (i =
                                                        2 & o[0]
                                                            ? n.return
                                                            : o[0]
                                                            ? n.throw ||
                                                              ((i = n.return) && i.call(n), 0)
                                                            : n.next) &&
                                                    !(i = i.call(n, o[1])).done)
                                            )
                                                return i;
                                            switch (
                                                ((n = 0), i && (o = [2 & o[0], i.value]), o[0])
                                            ) {
                                                case 0:
                                                case 1:
                                                    i = o;
                                                    break;
                                                case 4:
                                                    return s.label++, { value: o[1], done: !1 };
                                                case 5:
                                                    s.label++, (n = o[1]), (o = [0]);
                                                    continue;
                                                case 7:
                                                    (o = s.ops.pop()), s.trys.pop();
                                                    continue;
                                                default:
                                                    if (
                                                        !(i =
                                                            (i = s.trys).length > 0 &&
                                                            i[i.length - 1]) &&
                                                        (6 === o[0] || 2 === o[0])
                                                    ) {
                                                        s = 0;
                                                        continue;
                                                    }
                                                    if (
                                                        3 === o[0] &&
                                                        (!i || (o[1] > i[0] && o[1] < i[3]))
                                                    ) {
                                                        s.label = o[1];
                                                        break;
                                                    }
                                                    if (6 === o[0] && s.label < i[1]) {
                                                        (s.label = i[1]), (i = o);
                                                        break;
                                                    }
                                                    if (i && s.label < i[2]) {
                                                        (s.label = i[2]), s.ops.push(o);
                                                        break;
                                                    }
                                                    i[2] && s.ops.pop(), s.trys.pop();
                                                    continue;
                                            }
                                            o = e.call(t, s);
                                        } catch (t) {
                                            (o = [6, t]), (n = 0);
                                        } finally {
                                            r = i = 0;
                                        }
                                    if (5 & o[0]) throw o[1];
                                    return { value: o[0] ? o[1] : void 0, done: !0 };
                                })([o, u]);
                            };
                        }
                    }
                    function l(t, e) {
                        for (var r in t) e.hasOwnProperty(r) || (e[r] = t[r]);
                    }
                    function p(t) {
                        var e = 'function' == typeof Symbol && t[Symbol.iterator],
                            r = 0;
                        return e
                            ? e.call(t)
                            : {
                                  next: function() {
                                      return (
                                          t && r >= t.length && (t = void 0),
                                          { value: t && t[r++], done: !t }
                                      );
                                  }
                              };
                    }
                    function d(t, e) {
                        var r = 'function' == typeof Symbol && t[Symbol.iterator];
                        if (!r) return t;
                        var n,
                            i,
                            o = r.call(t),
                            s = [];
                        try {
                            for (; (void 0 === e || e-- > 0) && !(n = o.next()).done; )
                                s.push(n.value);
                        } catch (t) {
                            i = { error: t };
                        } finally {
                            try {
                                n && !n.done && (r = o.return) && r.call(o);
                            } finally {
                                if (i) throw i.error;
                            }
                        }
                        return s;
                    }
                    function g() {
                        for (var t = [], e = 0; e < arguments.length; e++)
                            t = t.concat(d(arguments[e]));
                        return t;
                    }
                    function m() {
                        for (var t = 0, e = 0, r = arguments.length; e < r; e++)
                            t += arguments[e].length;
                        var n = Array(t),
                            i = 0;
                        for (e = 0; e < r; e++)
                            for (var o = arguments[e], s = 0, u = o.length; s < u; s++, i++)
                                n[i] = o[s];
                        return n;
                    }
                    function v(t) {
                        return this instanceof v ? ((this.v = t), this) : new v(t);
                    }
                    function y(t, e, r) {
                        if (!Symbol.asyncIterator)
                            throw new TypeError('Symbol.asyncIterator is not defined.');
                        var n,
                            i = r.apply(t, e || []),
                            o = [];
                        return (
                            (n = {}),
                            s('next'),
                            s('throw'),
                            s('return'),
                            (n[Symbol.asyncIterator] = function() {
                                return this;
                            }),
                            n
                        );
                        function s(t) {
                            i[t] &&
                                (n[t] = function(e) {
                                    return new Promise(function(r, n) {
                                        o.push([t, e, r, n]) > 1 || u(t, e);
                                    });
                                });
                        }
                        function u(t, e) {
                            try {
                                (r = i[t](e)).value instanceof v
                                    ? Promise.resolve(r.value.v).then(a, h)
                                    : f(o[0][2], r);
                            } catch (t) {
                                f(o[0][3], t);
                            }
                            var r;
                        }
                        function a(t) {
                            u('next', t);
                        }
                        function h(t) {
                            u('throw', t);
                        }
                        function f(t, e) {
                            t(e), o.shift(), o.length && u(o[0][0], o[0][1]);
                        }
                    }
                    function w(t) {
                        var e, r;
                        return (
                            (e = {}),
                            n('next'),
                            n('throw', function(t) {
                                throw t;
                            }),
                            n('return'),
                            (e[Symbol.iterator] = function() {
                                return this;
                            }),
                            e
                        );
                        function n(n, i) {
                            e[n] = t[n]
                                ? function(e) {
                                      return (r = !r)
                                          ? { value: v(t[n](e)), done: 'return' === n }
                                          : i
                                          ? i(e)
                                          : e;
                                  }
                                : i;
                        }
                    }
                    function b(t) {
                        if (!Symbol.asyncIterator)
                            throw new TypeError('Symbol.asyncIterator is not defined.');
                        var e,
                            r = t[Symbol.asyncIterator];
                        return r
                            ? r.call(t)
                            : ((t = p(t)),
                              (e = {}),
                              n('next'),
                              n('throw'),
                              n('return'),
                              (e[Symbol.asyncIterator] = function() {
                                  return this;
                              }),
                              e);
                        function n(r) {
                            e[r] =
                                t[r] &&
                                function(e) {
                                    return new Promise(function(n, i) {
                                        !(function(t, e, r, n) {
                                            Promise.resolve(n).then(function(e) {
                                                t({ value: e, done: r });
                                            }, e);
                                        })(n, i, (e = t[r](e)).done, e.value);
                                    });
                                };
                        }
                    }
                    function _(t, e) {
                        return (
                            Object.defineProperty
                                ? Object.defineProperty(t, 'raw', { value: e })
                                : (t.raw = e),
                            t
                        );
                    }
                    function M(t) {
                        if (t && t.__esModule) return t;
                        var e = {};
                        if (null != t)
                            for (var r in t) Object.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                        return (e.default = t), e;
                    }
                    function E(t) {
                        return t && t.__esModule ? t : { default: t };
                    }
                },
                function(t, e, r) {
                    var n;
                    !(function(i) {
                        'use strict';
                        var o,
                            s = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
                            u = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator,
                            a = Math.ceil,
                            h = Math.floor,
                            f = '[BigNumber Error] ',
                            c = f + 'Number primitive has more than 15 significant digits: ',
                            l = [
                                1,
                                10,
                                100,
                                1e3,
                                1e4,
                                1e5,
                                1e6,
                                1e7,
                                1e8,
                                1e9,
                                1e10,
                                1e11,
                                1e12,
                                1e13
                            ];
                        function p(t) {
                            var e = 0 | t;
                            return t > 0 || t === e ? e : e - 1;
                        }
                        function d(t) {
                            for (var e, r, n = 1, i = t.length, o = t[0] + ''; n < i; ) {
                                for (r = 14 - (e = t[n++] + '').length; r--; e = '0' + e);
                                o += e;
                            }
                            for (i = o.length; 48 === o.charCodeAt(--i); );
                            return o.slice(0, i + 1 || 1);
                        }
                        function g(t, e) {
                            var r,
                                n,
                                i = t.c,
                                o = e.c,
                                s = t.s,
                                u = e.s,
                                a = t.e,
                                h = e.e;
                            if (!s || !u) return null;
                            if (((r = i && !i[0]), (n = o && !o[0]), r || n))
                                return r ? (n ? 0 : -u) : s;
                            if (s != u) return s;
                            if (((r = s < 0), (n = a == h), !i || !o))
                                return n ? 0 : !i ^ r ? 1 : -1;
                            if (!n) return (a > h) ^ r ? 1 : -1;
                            for (u = (a = i.length) < (h = o.length) ? a : h, s = 0; s < u; s++)
                                if (i[s] != o[s]) return (i[s] > o[s]) ^ r ? 1 : -1;
                            return a == h ? 0 : (a > h) ^ r ? 1 : -1;
                        }
                        function m(t, e, r, n) {
                            if (t < e || t > r || t !== h(t))
                                throw Error(
                                    f +
                                        (n || 'Argument') +
                                        ('number' == typeof t
                                            ? t < e || t > r
                                                ? ' out of range: '
                                                : ' not an integer: '
                                            : ' not a primitive number: ') +
                                        String(t)
                                );
                        }
                        function v(t) {
                            var e = t.c.length - 1;
                            return p(t.e / 14) == e && t.c[e] % 2 != 0;
                        }
                        function y(t, e) {
                            return (
                                (t.length > 1 ? t.charAt(0) + '.' + t.slice(1) : t) +
                                (e < 0 ? 'e' : 'e+') +
                                e
                            );
                        }
                        function w(t, e, r) {
                            var n, i;
                            if (e < 0) {
                                for (i = r + '.'; ++e; i += r);
                                t = i + t;
                            } else if (++e > (n = t.length)) {
                                for (i = r, e -= n; --e; i += r);
                                t += i;
                            } else e < n && (t = t.slice(0, e) + '.' + t.slice(e));
                            return t;
                        }
                        ((o = (function t(e) {
                            var r,
                                n,
                                i,
                                o,
                                b,
                                _,
                                M,
                                E,
                                R,
                                S = (j.prototype = {
                                    constructor: j,
                                    toString: null,
                                    valueOf: null
                                }),
                                O = new j(1),
                                I = 20,
                                A = 4,
                                N = -7,
                                T = 21,
                                B = -1e7,
                                x = 1e7,
                                P = !1,
                                k = 1,
                                C = 0,
                                U = {
                                    prefix: '',
                                    groupSize: 3,
                                    secondaryGroupSize: 0,
                                    groupSeparator: ',',
                                    decimalSeparator: '.',
                                    fractionGroupSize: 0,
                                    fractionGroupSeparator: ' ',
                                    suffix: ''
                                },
                                D = '0123456789abcdefghijklmnopqrstuvwxyz';
                            function j(t, e) {
                                var r,
                                    o,
                                    u,
                                    a,
                                    f,
                                    l,
                                    p,
                                    d,
                                    g = this;
                                if (!(g instanceof j)) return new j(t, e);
                                if (null == e) {
                                    if (t && !0 === t._isBigNumber)
                                        return (
                                            (g.s = t.s),
                                            void (!t.c || t.e > x
                                                ? (g.c = g.e = null)
                                                : t.e < B
                                                ? (g.c = [(g.e = 0)])
                                                : ((g.e = t.e), (g.c = t.c.slice())))
                                        );
                                    if ((l = 'number' == typeof t) && 0 * t == 0) {
                                        if (((g.s = 1 / t < 0 ? ((t = -t), -1) : 1), t === ~~t)) {
                                            for (a = 0, f = t; f >= 10; f /= 10, a++);
                                            return void (a > x
                                                ? (g.c = g.e = null)
                                                : ((g.e = a), (g.c = [t])));
                                        }
                                        d = String(t);
                                    } else {
                                        if (!s.test((d = String(t)))) return i(g, d, l);
                                        g.s = 45 == d.charCodeAt(0) ? ((d = d.slice(1)), -1) : 1;
                                    }
                                    (a = d.indexOf('.')) > -1 && (d = d.replace('.', '')),
                                        (f = d.search(/e/i)) > 0
                                            ? (a < 0 && (a = f),
                                              (a += +d.slice(f + 1)),
                                              (d = d.substring(0, f)))
                                            : a < 0 && (a = d.length);
                                } else {
                                    if ((m(e, 2, D.length, 'Base'), 10 == e))
                                        return G((g = new j(t)), I + g.e + 1, A);
                                    if (((d = String(t)), (l = 'number' == typeof t))) {
                                        if (0 * t != 0) return i(g, d, l, e);
                                        if (
                                            ((g.s = 1 / t < 0 ? ((d = d.slice(1)), -1) : 1),
                                            j.DEBUG && d.replace(/^0\.0*|\./, '').length > 15)
                                        )
                                            throw Error(c + t);
                                    } else
                                        g.s = 45 === d.charCodeAt(0) ? ((d = d.slice(1)), -1) : 1;
                                    for (r = D.slice(0, e), a = f = 0, p = d.length; f < p; f++)
                                        if (r.indexOf((o = d.charAt(f))) < 0) {
                                            if ('.' == o) {
                                                if (f > a) {
                                                    a = p;
                                                    continue;
                                                }
                                            } else if (
                                                !u &&
                                                ((d == d.toUpperCase() && (d = d.toLowerCase())) ||
                                                    (d == d.toLowerCase() && (d = d.toUpperCase())))
                                            ) {
                                                (u = !0), (f = -1), (a = 0);
                                                continue;
                                            }
                                            return i(g, String(t), l, e);
                                        }
                                    (l = !1),
                                        (a = (d = n(d, e, 10, g.s)).indexOf('.')) > -1
                                            ? (d = d.replace('.', ''))
                                            : (a = d.length);
                                }
                                for (f = 0; 48 === d.charCodeAt(f); f++);
                                for (p = d.length; 48 === d.charCodeAt(--p); );
                                if ((d = d.slice(f, ++p))) {
                                    if (
                                        ((p -= f),
                                        l &&
                                            j.DEBUG &&
                                            p > 15 &&
                                            (t > 9007199254740991 || t !== h(t)))
                                    )
                                        throw Error(c + g.s * t);
                                    if ((a = a - f - 1) > x) g.c = g.e = null;
                                    else if (a < B) g.c = [(g.e = 0)];
                                    else {
                                        if (
                                            ((g.e = a),
                                            (g.c = []),
                                            (f = (a + 1) % 14),
                                            a < 0 && (f += 14),
                                            f < p)
                                        ) {
                                            for (f && g.c.push(+d.slice(0, f)), p -= 14; f < p; )
                                                g.c.push(+d.slice(f, (f += 14)));
                                            f = 14 - (d = d.slice(f)).length;
                                        } else f -= p;
                                        for (; f--; d += '0');
                                        g.c.push(+d);
                                    }
                                } else g.c = [(g.e = 0)];
                            }
                            function L(t, e, r, n) {
                                var i, o, s, u, a;
                                if ((null == r ? (r = A) : m(r, 0, 8), !t.c)) return t.toString();
                                if (((i = t.c[0]), (s = t.e), null == e))
                                    (a = d(t.c)),
                                        (a =
                                            1 == n || (2 == n && (s <= N || s >= T))
                                                ? y(a, s)
                                                : w(a, s, '0'));
                                else if (
                                    ((o = (t = G(new j(t), e, r)).e),
                                    (u = (a = d(t.c)).length),
                                    1 == n || (2 == n && (e <= o || o <= N)))
                                ) {
                                    for (; u < e; a += '0', u++);
                                    a = y(a, o);
                                } else if (((e -= s), (a = w(a, o, '0')), o + 1 > u)) {
                                    if (--e > 0) for (a += '.'; e--; a += '0');
                                } else if ((e += o - u) > 0)
                                    for (o + 1 == u && (a += '.'); e--; a += '0');
                                return t.s < 0 && i ? '-' + a : a;
                            }
                            function F(t, e) {
                                for (var r, n = 1, i = new j(t[0]); n < t.length; n++) {
                                    if (!(r = new j(t[n])).s) {
                                        i = r;
                                        break;
                                    }
                                    e.call(i, r) && (i = r);
                                }
                                return i;
                            }
                            function q(t, e, r) {
                                for (var n = 1, i = e.length; !e[--i]; e.pop());
                                for (i = e[0]; i >= 10; i /= 10, n++);
                                return (
                                    (r = n + 14 * r - 1) > x
                                        ? (t.c = t.e = null)
                                        : r < B
                                        ? (t.c = [(t.e = 0)])
                                        : ((t.e = r), (t.c = e)),
                                    t
                                );
                            }
                            function G(t, e, r, n) {
                                var i,
                                    o,
                                    s,
                                    u,
                                    f,
                                    c,
                                    p,
                                    d = t.c,
                                    g = l;
                                if (d) {
                                    t: {
                                        for (i = 1, u = d[0]; u >= 10; u /= 10, i++);
                                        if ((o = e - i) < 0)
                                            (o += 14),
                                                (s = e),
                                                (p = ((f = d[(c = 0)]) / g[i - s - 1]) % 10 | 0);
                                        else if ((c = a((o + 1) / 14)) >= d.length) {
                                            if (!n) break t;
                                            for (; d.length <= c; d.push(0));
                                            (f = p = 0), (i = 1), (s = (o %= 14) - 14 + 1);
                                        } else {
                                            for (f = u = d[c], i = 1; u >= 10; u /= 10, i++);
                                            p =
                                                (s = (o %= 14) - 14 + i) < 0
                                                    ? 0
                                                    : (f / g[i - s - 1]) % 10 | 0;
                                        }
                                        if (
                                            ((n =
                                                n ||
                                                e < 0 ||
                                                null != d[c + 1] ||
                                                (s < 0 ? f : f % g[i - s - 1])),
                                            (n =
                                                r < 4
                                                    ? (p || n) && (0 == r || r == (t.s < 0 ? 3 : 2))
                                                    : p > 5 ||
                                                      (5 == p &&
                                                          (4 == r ||
                                                              n ||
                                                              (6 == r &&
                                                                  (o > 0
                                                                      ? s > 0
                                                                          ? f / g[i - s]
                                                                          : 0
                                                                      : d[c - 1]) %
                                                                      10 &
                                                                      1) ||
                                                              r == (t.s < 0 ? 8 : 7)))),
                                            e < 1 || !d[0])
                                        )
                                            return (
                                                (d.length = 0),
                                                n
                                                    ? ((e -= t.e + 1),
                                                      (d[0] = g[(14 - (e % 14)) % 14]),
                                                      (t.e = -e || 0))
                                                    : (d[0] = t.e = 0),
                                                t
                                            );
                                        if (
                                            (0 == o
                                                ? ((d.length = c), (u = 1), c--)
                                                : ((d.length = c + 1),
                                                  (u = g[14 - o]),
                                                  (d[c] =
                                                      s > 0 ? h((f / g[i - s]) % g[s]) * u : 0)),
                                            n)
                                        )
                                            for (;;) {
                                                if (0 == c) {
                                                    for (o = 1, s = d[0]; s >= 10; s /= 10, o++);
                                                    for (
                                                        s = d[0] += u, u = 1;
                                                        s >= 10;
                                                        s /= 10, u++
                                                    );
                                                    o != u && (t.e++, 1e14 == d[0] && (d[0] = 1));
                                                    break;
                                                }
                                                if (((d[c] += u), 1e14 != d[c])) break;
                                                (d[c--] = 0), (u = 1);
                                            }
                                        for (o = d.length; 0 === d[--o]; d.pop());
                                    }
                                    t.e > x ? (t.c = t.e = null) : t.e < B && (t.c = [(t.e = 0)]);
                                }
                                return t;
                            }
                            function Y(t) {
                                var e,
                                    r = t.e;
                                return null === r
                                    ? t.toString()
                                    : ((e = d(t.c)),
                                      (e = r <= N || r >= T ? y(e, r) : w(e, r, '0')),
                                      t.s < 0 ? '-' + e : e);
                            }
                            return (
                                (j.clone = t),
                                (j.ROUND_UP = 0),
                                (j.ROUND_DOWN = 1),
                                (j.ROUND_CEIL = 2),
                                (j.ROUND_FLOOR = 3),
                                (j.ROUND_HALF_UP = 4),
                                (j.ROUND_HALF_DOWN = 5),
                                (j.ROUND_HALF_EVEN = 6),
                                (j.ROUND_HALF_CEIL = 7),
                                (j.ROUND_HALF_FLOOR = 8),
                                (j.EUCLID = 9),
                                (j.config = j.set = function(t) {
                                    var e, r;
                                    if (null != t) {
                                        if ('object' != typeof t)
                                            throw Error(f + 'Object expected: ' + t);
                                        if (
                                            (t.hasOwnProperty((e = 'DECIMAL_PLACES')) &&
                                                (m((r = t[e]), 0, 1e9, e), (I = r)),
                                            t.hasOwnProperty((e = 'ROUNDING_MODE')) &&
                                                (m((r = t[e]), 0, 8, e), (A = r)),
                                            t.hasOwnProperty((e = 'EXPONENTIAL_AT')) &&
                                                ((r = t[e]) && r.pop
                                                    ? (m(r[0], -1e9, 0, e),
                                                      m(r[1], 0, 1e9, e),
                                                      (N = r[0]),
                                                      (T = r[1]))
                                                    : (m(r, -1e9, 1e9, e),
                                                      (N = -(T = r < 0 ? -r : r)))),
                                            t.hasOwnProperty((e = 'RANGE')))
                                        )
                                            if ((r = t[e]) && r.pop)
                                                m(r[0], -1e9, -1, e),
                                                    m(r[1], 1, 1e9, e),
                                                    (B = r[0]),
                                                    (x = r[1]);
                                            else {
                                                if ((m(r, -1e9, 1e9, e), !r))
                                                    throw Error(f + e + ' cannot be zero: ' + r);
                                                B = -(x = r < 0 ? -r : r);
                                            }
                                        if (t.hasOwnProperty((e = 'CRYPTO'))) {
                                            if ((r = t[e]) !== !!r)
                                                throw Error(f + e + ' not true or false: ' + r);
                                            if (r) {
                                                if (
                                                    'undefined' == typeof crypto ||
                                                    !crypto ||
                                                    (!crypto.getRandomValues && !crypto.randomBytes)
                                                )
                                                    throw ((P = !r),
                                                    Error(f + 'crypto unavailable'));
                                                P = r;
                                            } else P = r;
                                        }
                                        if (
                                            (t.hasOwnProperty((e = 'MODULO_MODE')) &&
                                                (m((r = t[e]), 0, 9, e), (k = r)),
                                            t.hasOwnProperty((e = 'POW_PRECISION')) &&
                                                (m((r = t[e]), 0, 1e9, e), (C = r)),
                                            t.hasOwnProperty((e = 'FORMAT')))
                                        ) {
                                            if ('object' != typeof (r = t[e]))
                                                throw Error(f + e + ' not an object: ' + r);
                                            U = r;
                                        }
                                        if (t.hasOwnProperty((e = 'ALPHABET'))) {
                                            if (
                                                'string' != typeof (r = t[e]) ||
                                                /^.$|[+-.\s]|(.).*\1/.test(r)
                                            )
                                                throw Error(f + e + ' invalid: ' + r);
                                            D = r;
                                        }
                                    }
                                    return {
                                        DECIMAL_PLACES: I,
                                        ROUNDING_MODE: A,
                                        EXPONENTIAL_AT: [N, T],
                                        RANGE: [B, x],
                                        CRYPTO: P,
                                        MODULO_MODE: k,
                                        POW_PRECISION: C,
                                        FORMAT: U,
                                        ALPHABET: D
                                    };
                                }),
                                (j.isBigNumber = function(t) {
                                    if (!t || !0 !== t._isBigNumber) return !1;
                                    if (!j.DEBUG) return !0;
                                    var e,
                                        r,
                                        n = t.c,
                                        i = t.e,
                                        o = t.s;
                                    t: if ('[object Array]' == {}.toString.call(n)) {
                                        if (
                                            (1 === o || -1 === o) &&
                                            i >= -1e9 &&
                                            i <= 1e9 &&
                                            i === h(i)
                                        ) {
                                            if (0 === n[0]) {
                                                if (0 === i && 1 === n.length) return !0;
                                                break t;
                                            }
                                            if (
                                                ((e = (i + 1) % 14) < 1 && (e += 14),
                                                String(n[0]).length == e)
                                            ) {
                                                for (e = 0; e < n.length; e++)
                                                    if ((r = n[e]) < 0 || r >= 1e14 || r !== h(r))
                                                        break t;
                                                if (0 !== r) return !0;
                                            }
                                        }
                                    } else if (
                                        null === n &&
                                        null === i &&
                                        (null === o || 1 === o || -1 === o)
                                    )
                                        return !0;
                                    throw Error(f + 'Invalid BigNumber: ' + t);
                                }),
                                (j.maximum = j.max = function() {
                                    return F(arguments, S.lt);
                                }),
                                (j.minimum = j.min = function() {
                                    return F(arguments, S.gt);
                                }),
                                (j.random =
                                    ((o =
                                        (9007199254740992 * Math.random()) & 2097151
                                            ? function() {
                                                  return h(9007199254740992 * Math.random());
                                              }
                                            : function() {
                                                  return (
                                                      8388608 * ((1073741824 * Math.random()) | 0) +
                                                      ((8388608 * Math.random()) | 0)
                                                  );
                                              }),
                                    function(t) {
                                        var e,
                                            r,
                                            n,
                                            i,
                                            s,
                                            u = 0,
                                            c = [],
                                            p = new j(O);
                                        if (
                                            (null == t ? (t = I) : m(t, 0, 1e9), (i = a(t / 14)), P)
                                        )
                                            if (crypto.getRandomValues) {
                                                for (
                                                    e = crypto.getRandomValues(
                                                        new Uint32Array((i *= 2))
                                                    );
                                                    u < i;

                                                )
                                                    (s = 131072 * e[u] + (e[u + 1] >>> 11)) >= 9e15
                                                        ? ((r = crypto.getRandomValues(
                                                              new Uint32Array(2)
                                                          )),
                                                          (e[u] = r[0]),
                                                          (e[u + 1] = r[1]))
                                                        : (c.push(s % 1e14), (u += 2));
                                                u = i / 2;
                                            } else {
                                                if (!crypto.randomBytes)
                                                    throw ((P = !1),
                                                    Error(f + 'crypto unavailable'));
                                                for (e = crypto.randomBytes((i *= 7)); u < i; )
                                                    (s =
                                                        281474976710656 * (31 & e[u]) +
                                                        1099511627776 * e[u + 1] +
                                                        4294967296 * e[u + 2] +
                                                        16777216 * e[u + 3] +
                                                        (e[u + 4] << 16) +
                                                        (e[u + 5] << 8) +
                                                        e[u + 6]) >= 9e15
                                                        ? crypto.randomBytes(7).copy(e, u)
                                                        : (c.push(s % 1e14), (u += 7));
                                                u = i / 7;
                                            }
                                        if (!P)
                                            for (; u < i; ) (s = o()) < 9e15 && (c[u++] = s % 1e14);
                                        for (
                                            t %= 14,
                                                (i = c[--u]) &&
                                                    t &&
                                                    ((s = l[14 - t]), (c[u] = h(i / s) * s));
                                            0 === c[u];
                                            c.pop(), u--
                                        );
                                        if (u < 0) c = [(n = 0)];
                                        else {
                                            for (n = -1; 0 === c[0]; c.splice(0, 1), n -= 14);
                                            for (u = 1, s = c[0]; s >= 10; s /= 10, u++);
                                            u < 14 && (n -= 14 - u);
                                        }
                                        return (p.e = n), (p.c = c), p;
                                    })),
                                (j.sum = function() {
                                    for (var t = 1, e = arguments, r = new j(e[0]); t < e.length; )
                                        r = r.plus(e[t++]);
                                    return r;
                                }),
                                (n = (function() {
                                    function t(t, e, r, n) {
                                        for (var i, o, s = [0], u = 0, a = t.length; u < a; ) {
                                            for (o = s.length; o--; s[o] *= e);
                                            for (
                                                s[0] += n.indexOf(t.charAt(u++)), i = 0;
                                                i < s.length;
                                                i++
                                            )
                                                s[i] > r - 1 &&
                                                    (null == s[i + 1] && (s[i + 1] = 0),
                                                    (s[i + 1] += (s[i] / r) | 0),
                                                    (s[i] %= r));
                                        }
                                        return s.reverse();
                                    }
                                    return function(e, n, i, o, s) {
                                        var u,
                                            a,
                                            h,
                                            f,
                                            c,
                                            l,
                                            p,
                                            g,
                                            m = e.indexOf('.'),
                                            v = I,
                                            y = A;
                                        for (
                                            m >= 0 &&
                                                ((f = C),
                                                (C = 0),
                                                (e = e.replace('.', '')),
                                                (l = (g = new j(n)).pow(e.length - m)),
                                                (C = f),
                                                (g.c = t(w(d(l.c), l.e, '0'), 10, i, '0123456789')),
                                                (g.e = g.c.length)),
                                                h = f = (p = t(
                                                    e,
                                                    n,
                                                    i,
                                                    s
                                                        ? ((u = D), '0123456789')
                                                        : ((u = '0123456789'), D)
                                                )).length;
                                            0 == p[--f];
                                            p.pop()
                                        );
                                        if (!p[0]) return u.charAt(0);
                                        if (
                                            (m < 0
                                                ? --h
                                                : ((l.c = p),
                                                  (l.e = h),
                                                  (l.s = o),
                                                  (p = (l = r(l, g, v, y, i)).c),
                                                  (c = l.r),
                                                  (h = l.e)),
                                            (m = p[(a = h + v + 1)]),
                                            (f = i / 2),
                                            (c = c || a < 0 || null != p[a + 1]),
                                            (c =
                                                y < 4
                                                    ? (null != m || c) &&
                                                      (0 == y || y == (l.s < 0 ? 3 : 2))
                                                    : m > f ||
                                                      (m == f &&
                                                          (4 == y ||
                                                              c ||
                                                              (6 == y && 1 & p[a - 1]) ||
                                                              y == (l.s < 0 ? 8 : 7)))),
                                            a < 1 || !p[0])
                                        )
                                            e = c ? w(u.charAt(1), -v, u.charAt(0)) : u.charAt(0);
                                        else {
                                            if (((p.length = a), c))
                                                for (--i; ++p[--a] > i; )
                                                    (p[a] = 0), a || (++h, (p = [1].concat(p)));
                                            for (f = p.length; !p[--f]; );
                                            for (m = 0, e = ''; m <= f; e += u.charAt(p[m++]));
                                            e = w(e, h, u.charAt(0));
                                        }
                                        return e;
                                    };
                                })()),
                                (r = (function() {
                                    function t(t, e, r) {
                                        var n,
                                            i,
                                            o,
                                            s,
                                            u = 0,
                                            a = t.length,
                                            h = e % 1e7,
                                            f = (e / 1e7) | 0;
                                        for (t = t.slice(); a--; )
                                            (u =
                                                (((i =
                                                    h * (o = t[a] % 1e7) +
                                                    ((n = f * o + (s = (t[a] / 1e7) | 0) * h) %
                                                        1e7) *
                                                        1e7 +
                                                    u) /
                                                    r) |
                                                    0) +
                                                ((n / 1e7) | 0) +
                                                f * s),
                                                (t[a] = i % r);
                                        return u && (t = [u].concat(t)), t;
                                    }
                                    function e(t, e, r, n) {
                                        var i, o;
                                        if (r != n) o = r > n ? 1 : -1;
                                        else
                                            for (i = o = 0; i < r; i++)
                                                if (t[i] != e[i]) {
                                                    o = t[i] > e[i] ? 1 : -1;
                                                    break;
                                                }
                                        return o;
                                    }
                                    function r(t, e, r, n) {
                                        for (var i = 0; r--; )
                                            (t[r] -= i),
                                                (i = t[r] < e[r] ? 1 : 0),
                                                (t[r] = i * n + t[r] - e[r]);
                                        for (; !t[0] && t.length > 1; t.splice(0, 1));
                                    }
                                    return function(n, i, o, s, u) {
                                        var a,
                                            f,
                                            c,
                                            l,
                                            d,
                                            g,
                                            m,
                                            v,
                                            y,
                                            w,
                                            b,
                                            _,
                                            M,
                                            E,
                                            R,
                                            S,
                                            O,
                                            I = n.s == i.s ? 1 : -1,
                                            A = n.c,
                                            N = i.c;
                                        if (!(A && A[0] && N && N[0]))
                                            return new j(
                                                n.s && i.s && (A ? !N || A[0] != N[0] : N)
                                                    ? (A && 0 == A[0]) || !N
                                                        ? 0 * I
                                                        : I / 0
                                                    : NaN
                                            );
                                        for (
                                            y = (v = new j(I)).c = [],
                                                I = o + (f = n.e - i.e) + 1,
                                                u ||
                                                    ((u = 1e14),
                                                    (f = p(n.e / 14) - p(i.e / 14)),
                                                    (I = (I / 14) | 0)),
                                                c = 0;
                                            N[c] == (A[c] || 0);
                                            c++
                                        );
                                        if ((N[c] > (A[c] || 0) && f--, I < 0)) y.push(1), (l = !0);
                                        else {
                                            for (
                                                E = A.length,
                                                    S = N.length,
                                                    c = 0,
                                                    I += 2,
                                                    (d = h(u / (N[0] + 1))) > 1 &&
                                                        ((N = t(N, d, u)),
                                                        (A = t(A, d, u)),
                                                        (S = N.length),
                                                        (E = A.length)),
                                                    M = S,
                                                    b = (w = A.slice(0, S)).length;
                                                b < S;
                                                w[b++] = 0
                                            );
                                            (O = N.slice()),
                                                (O = [0].concat(O)),
                                                (R = N[0]),
                                                N[1] >= u / 2 && R++;
                                            do {
                                                if (((d = 0), (a = e(N, w, S, b)) < 0)) {
                                                    if (
                                                        ((_ = w[0]),
                                                        S != b && (_ = _ * u + (w[1] || 0)),
                                                        (d = h(_ / R)) > 1)
                                                    )
                                                        for (
                                                            d >= u && (d = u - 1),
                                                                m = (g = t(N, d, u)).length,
                                                                b = w.length;
                                                            1 == e(g, w, m, b);

                                                        )
                                                            d--,
                                                                r(g, S < m ? O : N, m, u),
                                                                (m = g.length),
                                                                (a = 1);
                                                    else
                                                        0 == d && (a = d = 1),
                                                            (m = (g = N.slice()).length);
                                                    if (
                                                        (m < b && (g = [0].concat(g)),
                                                        r(w, g, b, u),
                                                        (b = w.length),
                                                        -1 == a)
                                                    )
                                                        for (; e(N, w, S, b) < 1; )
                                                            d++,
                                                                r(w, S < b ? O : N, b, u),
                                                                (b = w.length);
                                                } else 0 === a && (d++, (w = [0]));
                                                (y[c++] = d),
                                                    w[0]
                                                        ? (w[b++] = A[M] || 0)
                                                        : ((w = [A[M]]), (b = 1));
                                            } while ((M++ < E || null != w[0]) && I--);
                                            (l = null != w[0]), y[0] || y.splice(0, 1);
                                        }
                                        if (1e14 == u) {
                                            for (c = 1, I = y[0]; I >= 10; I /= 10, c++);
                                            G(v, o + (v.e = c + 14 * f - 1) + 1, s, l);
                                        } else (v.e = f), (v.r = +l);
                                        return v;
                                    };
                                })()),
                                (b = /^(-?)0([xbo])(?=\w[\w.]*$)/i),
                                (_ = /^([^.]+)\.$/),
                                (M = /^\.([^.]+)$/),
                                (E = /^-?(Infinity|NaN)$/),
                                (R = /^\s*\+(?=[\w.])|^\s+|\s+$/g),
                                (i = function(t, e, r, n) {
                                    var i,
                                        o = r ? e : e.replace(R, '');
                                    if (E.test(o)) t.s = isNaN(o) ? null : o < 0 ? -1 : 1;
                                    else {
                                        if (
                                            !r &&
                                            ((o = o.replace(b, function(t, e, r) {
                                                return (
                                                    (i =
                                                        'x' == (r = r.toLowerCase())
                                                            ? 16
                                                            : 'b' == r
                                                            ? 2
                                                            : 8),
                                                    n && n != i ? t : e
                                                );
                                            })),
                                            n &&
                                                ((i = n),
                                                (o = o.replace(_, '$1').replace(M, '0.$1'))),
                                            e != o)
                                        )
                                            return new j(o, i);
                                        if (j.DEBUG)
                                            throw Error(
                                                f +
                                                    'Not a' +
                                                    (n ? ' base ' + n : '') +
                                                    ' number: ' +
                                                    e
                                            );
                                        t.s = null;
                                    }
                                    t.c = t.e = null;
                                }),
                                (S.absoluteValue = S.abs = function() {
                                    var t = new j(this);
                                    return t.s < 0 && (t.s = 1), t;
                                }),
                                (S.comparedTo = function(t, e) {
                                    return g(this, new j(t, e));
                                }),
                                (S.decimalPlaces = S.dp = function(t, e) {
                                    var r,
                                        n,
                                        i,
                                        o = this;
                                    if (null != t)
                                        return (
                                            m(t, 0, 1e9),
                                            null == e ? (e = A) : m(e, 0, 8),
                                            G(new j(o), t + o.e + 1, e)
                                        );
                                    if (!(r = o.c)) return null;
                                    if (
                                        ((n = 14 * ((i = r.length - 1) - p(this.e / 14))),
                                        (i = r[i]))
                                    )
                                        for (; i % 10 == 0; i /= 10, n--);
                                    return n < 0 && (n = 0), n;
                                }),
                                (S.dividedBy = S.div = function(t, e) {
                                    return r(this, new j(t, e), I, A);
                                }),
                                (S.dividedToIntegerBy = S.idiv = function(t, e) {
                                    return r(this, new j(t, e), 0, 1);
                                }),
                                (S.exponentiatedBy = S.pow = function(t, e) {
                                    var r,
                                        n,
                                        i,
                                        o,
                                        s,
                                        u,
                                        c,
                                        l,
                                        p = this;
                                    if ((t = new j(t)).c && !t.isInteger())
                                        throw Error(f + 'Exponent not an integer: ' + Y(t));
                                    if (
                                        (null != e && (e = new j(e)),
                                        (s = t.e > 14),
                                        !p.c ||
                                            !p.c[0] ||
                                            (1 == p.c[0] && !p.e && 1 == p.c.length) ||
                                            !t.c ||
                                            !t.c[0])
                                    )
                                        return (
                                            (l = new j(Math.pow(+Y(p), s ? 2 - v(t) : +Y(t)))),
                                            e ? l.mod(e) : l
                                        );
                                    if (((u = t.s < 0), e)) {
                                        if (e.c ? !e.c[0] : !e.s) return new j(NaN);
                                        (n = !u && p.isInteger() && e.isInteger()) &&
                                            (p = p.mod(e));
                                    } else {
                                        if (
                                            t.e > 9 &&
                                            (p.e > 0 ||
                                                p.e < -1 ||
                                                (0 == p.e
                                                    ? p.c[0] > 1 || (s && p.c[1] >= 24e7)
                                                    : p.c[0] < 8e13 || (s && p.c[0] <= 9999975e7)))
                                        )
                                            return (
                                                (o = p.s < 0 && v(t) ? -0 : 0),
                                                p.e > -1 && (o = 1 / o),
                                                new j(u ? 1 / o : o)
                                            );
                                        C && (o = a(C / 14 + 2));
                                    }
                                    for (
                                        s
                                            ? ((r = new j(0.5)), u && (t.s = 1), (c = v(t)))
                                            : (c = (i = Math.abs(+Y(t))) % 2),
                                            l = new j(O);
                                        ;

                                    ) {
                                        if (c) {
                                            if (!(l = l.times(p)).c) break;
                                            o
                                                ? l.c.length > o && (l.c.length = o)
                                                : n && (l = l.mod(e));
                                        }
                                        if (i) {
                                            if (0 === (i = h(i / 2))) break;
                                            c = i % 2;
                                        } else if ((G((t = t.times(r)), t.e + 1, 1), t.e > 14))
                                            c = v(t);
                                        else {
                                            if (0 == (i = +Y(t))) break;
                                            c = i % 2;
                                        }
                                        (p = p.times(p)),
                                            o
                                                ? p.c && p.c.length > o && (p.c.length = o)
                                                : n && (p = p.mod(e));
                                    }
                                    return n
                                        ? l
                                        : (u && (l = O.div(l)),
                                          e ? l.mod(e) : o ? G(l, C, A, void 0) : l);
                                }),
                                (S.integerValue = function(t) {
                                    var e = new j(this);
                                    return null == t ? (t = A) : m(t, 0, 8), G(e, e.e + 1, t);
                                }),
                                (S.isEqualTo = S.eq = function(t, e) {
                                    return 0 === g(this, new j(t, e));
                                }),
                                (S.isFinite = function() {
                                    return !!this.c;
                                }),
                                (S.isGreaterThan = S.gt = function(t, e) {
                                    return g(this, new j(t, e)) > 0;
                                }),
                                (S.isGreaterThanOrEqualTo = S.gte = function(t, e) {
                                    return 1 === (e = g(this, new j(t, e))) || 0 === e;
                                }),
                                (S.isInteger = function() {
                                    return !!this.c && p(this.e / 14) > this.c.length - 2;
                                }),
                                (S.isLessThan = S.lt = function(t, e) {
                                    return g(this, new j(t, e)) < 0;
                                }),
                                (S.isLessThanOrEqualTo = S.lte = function(t, e) {
                                    return -1 === (e = g(this, new j(t, e))) || 0 === e;
                                }),
                                (S.isNaN = function() {
                                    return !this.s;
                                }),
                                (S.isNegative = function() {
                                    return this.s < 0;
                                }),
                                (S.isPositive = function() {
                                    return this.s > 0;
                                }),
                                (S.isZero = function() {
                                    return !!this.c && 0 == this.c[0];
                                }),
                                (S.minus = function(t, e) {
                                    var r,
                                        n,
                                        i,
                                        o,
                                        s = this,
                                        u = s.s;
                                    if (((e = (t = new j(t, e)).s), !u || !e)) return new j(NaN);
                                    if (u != e) return (t.s = -e), s.plus(t);
                                    var a = s.e / 14,
                                        h = t.e / 14,
                                        f = s.c,
                                        c = t.c;
                                    if (!a || !h) {
                                        if (!f || !c)
                                            return f ? ((t.s = -e), t) : new j(c ? s : NaN);
                                        if (!f[0] || !c[0])
                                            return c[0]
                                                ? ((t.s = -e), t)
                                                : new j(f[0] ? s : 3 == A ? -0 : 0);
                                    }
                                    if (((a = p(a)), (h = p(h)), (f = f.slice()), (u = a - h))) {
                                        for (
                                            (o = u < 0) ? ((u = -u), (i = f)) : ((h = a), (i = c)),
                                                i.reverse(),
                                                e = u;
                                            e--;
                                            i.push(0)
                                        );
                                        i.reverse();
                                    } else
                                        for (
                                            n = (o = (u = f.length) < (e = c.length)) ? u : e,
                                                u = e = 0;
                                            e < n;
                                            e++
                                        )
                                            if (f[e] != c[e]) {
                                                o = f[e] < c[e];
                                                break;
                                            }
                                    if (
                                        (o && ((i = f), (f = c), (c = i), (t.s = -t.s)),
                                        (e = (n = c.length) - (r = f.length)) > 0)
                                    )
                                        for (; e--; f[r++] = 0);
                                    for (e = 1e14 - 1; n > u; ) {
                                        if (f[--n] < c[n]) {
                                            for (r = n; r && !f[--r]; f[r] = e);
                                            --f[r], (f[n] += 1e14);
                                        }
                                        f[n] -= c[n];
                                    }
                                    for (; 0 == f[0]; f.splice(0, 1), --h);
                                    return f[0]
                                        ? q(t, f, h)
                                        : ((t.s = 3 == A ? -1 : 1), (t.c = [(t.e = 0)]), t);
                                }),
                                (S.modulo = S.mod = function(t, e) {
                                    var n,
                                        i,
                                        o = this;
                                    return (
                                        (t = new j(t, e)),
                                        !o.c || !t.s || (t.c && !t.c[0])
                                            ? new j(NaN)
                                            : !t.c || (o.c && !o.c[0])
                                            ? new j(o)
                                            : (9 == k
                                                  ? ((i = t.s),
                                                    (t.s = 1),
                                                    (n = r(o, t, 0, 3)),
                                                    (t.s = i),
                                                    (n.s *= i))
                                                  : (n = r(o, t, 0, k)),
                                              (t = o.minus(n.times(t))).c[0] ||
                                                  1 != k ||
                                                  (t.s = o.s),
                                              t)
                                    );
                                }),
                                (S.multipliedBy = S.times = function(t, e) {
                                    var r,
                                        n,
                                        i,
                                        o,
                                        s,
                                        u,
                                        a,
                                        h,
                                        f,
                                        c,
                                        l,
                                        d,
                                        g,
                                        m = this,
                                        v = m.c,
                                        y = (t = new j(t, e)).c;
                                    if (!(v && y && v[0] && y[0]))
                                        return (
                                            !m.s || !t.s || (v && !v[0] && !y) || (y && !y[0] && !v)
                                                ? (t.c = t.e = t.s = null)
                                                : ((t.s *= m.s),
                                                  v && y
                                                      ? ((t.c = [0]), (t.e = 0))
                                                      : (t.c = t.e = null)),
                                            t
                                        );
                                    for (
                                        n = p(m.e / 14) + p(t.e / 14),
                                            t.s *= m.s,
                                            (a = v.length) < (c = y.length) &&
                                                ((g = v),
                                                (v = y),
                                                (y = g),
                                                (i = a),
                                                (a = c),
                                                (c = i)),
                                            i = a + c,
                                            g = [];
                                        i--;
                                        g.push(0)
                                    );
                                    for (i = c; --i >= 0; ) {
                                        for (
                                            r = 0,
                                                l = y[i] % 1e7,
                                                d = (y[i] / 1e7) | 0,
                                                o = i + (s = a);
                                            o > i;

                                        )
                                            (r =
                                                (((h =
                                                    l * (h = v[--s] % 1e7) +
                                                    ((u = d * h + (f = (v[s] / 1e7) | 0) * l) %
                                                        1e7) *
                                                        1e7 +
                                                    g[o] +
                                                    r) /
                                                    1e14) |
                                                    0) +
                                                ((u / 1e7) | 0) +
                                                d * f),
                                                (g[o--] = h % 1e14);
                                        g[o] = r;
                                    }
                                    return r ? ++n : g.splice(0, 1), q(t, g, n);
                                }),
                                (S.negated = function() {
                                    var t = new j(this);
                                    return (t.s = -t.s || null), t;
                                }),
                                (S.plus = function(t, e) {
                                    var r,
                                        n = this,
                                        i = n.s;
                                    if (((e = (t = new j(t, e)).s), !i || !e)) return new j(NaN);
                                    if (i != e) return (t.s = -e), n.minus(t);
                                    var o = n.e / 14,
                                        s = t.e / 14,
                                        u = n.c,
                                        a = t.c;
                                    if (!o || !s) {
                                        if (!u || !a) return new j(i / 0);
                                        if (!u[0] || !a[0])
                                            return a[0] ? t : new j(u[0] ? n : 0 * i);
                                    }
                                    if (((o = p(o)), (s = p(s)), (u = u.slice()), (i = o - s))) {
                                        for (
                                            i > 0 ? ((s = o), (r = a)) : ((i = -i), (r = u)),
                                                r.reverse();
                                            i--;
                                            r.push(0)
                                        );
                                        r.reverse();
                                    }
                                    for (
                                        (i = u.length) - (e = a.length) < 0 &&
                                            ((r = a), (a = u), (u = r), (e = i)),
                                            i = 0;
                                        e;

                                    )
                                        (i = ((u[--e] = u[e] + a[e] + i) / 1e14) | 0),
                                            (u[e] = 1e14 === u[e] ? 0 : u[e] % 1e14);
                                    return i && ((u = [i].concat(u)), ++s), q(t, u, s);
                                }),
                                (S.precision = S.sd = function(t, e) {
                                    var r,
                                        n,
                                        i,
                                        o = this;
                                    if (null != t && t !== !!t)
                                        return (
                                            m(t, 1, 1e9),
                                            null == e ? (e = A) : m(e, 0, 8),
                                            G(new j(o), t, e)
                                        );
                                    if (!(r = o.c)) return null;
                                    if (((n = 14 * (i = r.length - 1) + 1), (i = r[i]))) {
                                        for (; i % 10 == 0; i /= 10, n--);
                                        for (i = r[0]; i >= 10; i /= 10, n++);
                                    }
                                    return t && o.e + 1 > n && (n = o.e + 1), n;
                                }),
                                (S.shiftedBy = function(t) {
                                    return (
                                        m(t, -9007199254740991, 9007199254740991),
                                        this.times('1e' + t)
                                    );
                                }),
                                (S.squareRoot = S.sqrt = function() {
                                    var t,
                                        e,
                                        n,
                                        i,
                                        o,
                                        s = this,
                                        u = s.c,
                                        a = s.s,
                                        h = s.e,
                                        f = I + 4,
                                        c = new j('0.5');
                                    if (1 !== a || !u || !u[0])
                                        return new j(
                                            !a || (a < 0 && (!u || u[0])) ? NaN : u ? s : 1 / 0
                                        );
                                    if (
                                        (0 == (a = Math.sqrt(+Y(s))) || a == 1 / 0
                                            ? (((e = d(u)).length + h) % 2 == 0 && (e += '0'),
                                              (a = Math.sqrt(+e)),
                                              (h = p((h + 1) / 2) - (h < 0 || h % 2)),
                                              (n = new j(
                                                  (e =
                                                      a == 1 / 0
                                                          ? '1e' + h
                                                          : (e = a.toExponential()).slice(
                                                                0,
                                                                e.indexOf('e') + 1
                                                            ) + h)
                                              )))
                                            : (n = new j(a + '')),
                                        n.c[0])
                                    )
                                        for ((a = (h = n.e) + f) < 3 && (a = 0); ; )
                                            if (
                                                ((o = n),
                                                (n = c.times(o.plus(r(s, o, f, 1)))),
                                                d(o.c).slice(0, a) === (e = d(n.c)).slice(0, a))
                                            ) {
                                                if (
                                                    (n.e < h && --a,
                                                    '9999' != (e = e.slice(a - 3, a + 1)) &&
                                                        (i || '4999' != e))
                                                ) {
                                                    (+e && (+e.slice(1) || '5' != e.charAt(0))) ||
                                                        (G(n, n.e + I + 2, 1),
                                                        (t = !n.times(n).eq(s)));
                                                    break;
                                                }
                                                if (
                                                    !i &&
                                                    (G(o, o.e + I + 2, 0), o.times(o).eq(s))
                                                ) {
                                                    n = o;
                                                    break;
                                                }
                                                (f += 4), (a += 4), (i = 1);
                                            }
                                    return G(n, n.e + I + 1, A, t);
                                }),
                                (S.toExponential = function(t, e) {
                                    return null != t && (m(t, 0, 1e9), t++), L(this, t, e, 1);
                                }),
                                (S.toFixed = function(t, e) {
                                    return (
                                        null != t && (m(t, 0, 1e9), (t = t + this.e + 1)),
                                        L(this, t, e)
                                    );
                                }),
                                (S.toFormat = function(t, e, r) {
                                    var n,
                                        i = this;
                                    if (null == r)
                                        null != t && e && 'object' == typeof e
                                            ? ((r = e), (e = null))
                                            : t && 'object' == typeof t
                                            ? ((r = t), (t = e = null))
                                            : (r = U);
                                    else if ('object' != typeof r)
                                        throw Error(f + 'Argument not an object: ' + r);
                                    if (((n = i.toFixed(t, e)), i.c)) {
                                        var o,
                                            s = n.split('.'),
                                            u = +r.groupSize,
                                            a = +r.secondaryGroupSize,
                                            h = r.groupSeparator || '',
                                            c = s[0],
                                            l = s[1],
                                            p = i.s < 0,
                                            d = p ? c.slice(1) : c,
                                            g = d.length;
                                        if (
                                            (a && ((o = u), (u = a), (a = o), (g -= o)),
                                            u > 0 && g > 0)
                                        ) {
                                            for (o = g % u || u, c = d.substr(0, o); o < g; o += u)
                                                c += h + d.substr(o, u);
                                            a > 0 && (c += h + d.slice(o)), p && (c = '-' + c);
                                        }
                                        n = l
                                            ? c +
                                              (r.decimalSeparator || '') +
                                              ((a = +r.fractionGroupSize)
                                                  ? l.replace(
                                                        new RegExp('\\d{' + a + '}\\B', 'g'),
                                                        '$&' + (r.fractionGroupSeparator || '')
                                                    )
                                                  : l)
                                            : c;
                                    }
                                    return (r.prefix || '') + n + (r.suffix || '');
                                }),
                                (S.toFraction = function(t) {
                                    var e,
                                        n,
                                        i,
                                        o,
                                        s,
                                        u,
                                        a,
                                        h,
                                        c,
                                        p,
                                        g,
                                        m,
                                        v = this,
                                        y = v.c;
                                    if (
                                        null != t &&
                                        ((!(a = new j(t)).isInteger() && (a.c || 1 !== a.s)) ||
                                            a.lt(O))
                                    )
                                        throw Error(
                                            f +
                                                'Argument ' +
                                                (a.isInteger()
                                                    ? 'out of range: '
                                                    : 'not an integer: ') +
                                                Y(a)
                                        );
                                    if (!y) return new j(v);
                                    for (
                                        e = new j(O),
                                            c = n = new j(O),
                                            i = h = new j(O),
                                            m = d(y),
                                            s = e.e = m.length - v.e - 1,
                                            e.c[0] = l[(u = s % 14) < 0 ? 14 + u : u],
                                            t = !t || a.comparedTo(e) > 0 ? (s > 0 ? e : c) : a,
                                            u = x,
                                            x = 1 / 0,
                                            a = new j(m),
                                            h.c[0] = 0;
                                        (p = r(a, e, 0, 1)),
                                            1 != (o = n.plus(p.times(i))).comparedTo(t);

                                    )
                                        (n = i),
                                            (i = o),
                                            (c = h.plus(p.times((o = c)))),
                                            (h = o),
                                            (e = a.minus(p.times((o = e)))),
                                            (a = o);
                                    return (
                                        (o = r(t.minus(n), i, 0, 1)),
                                        (h = h.plus(o.times(c))),
                                        (n = n.plus(o.times(i))),
                                        (h.s = c.s = v.s),
                                        (g =
                                            r(c, i, (s *= 2), A)
                                                .minus(v)
                                                .abs()
                                                .comparedTo(
                                                    r(h, n, s, A)
                                                        .minus(v)
                                                        .abs()
                                                ) < 1
                                                ? [c, i]
                                                : [h, n]),
                                        (x = u),
                                        g
                                    );
                                }),
                                (S.toNumber = function() {
                                    return +Y(this);
                                }),
                                (S.toPrecision = function(t, e) {
                                    return null != t && m(t, 1, 1e9), L(this, t, e, 2);
                                }),
                                (S.toString = function(t) {
                                    var e,
                                        r = this,
                                        i = r.s,
                                        o = r.e;
                                    return (
                                        null === o
                                            ? i
                                                ? ((e = 'Infinity'), i < 0 && (e = '-' + e))
                                                : (e = 'NaN')
                                            : (null == t
                                                  ? (e =
                                                        o <= N || o >= T
                                                            ? y(d(r.c), o)
                                                            : w(d(r.c), o, '0'))
                                                  : 10 === t
                                                  ? (e = w(
                                                        d((r = G(new j(r), I + o + 1, A)).c),
                                                        r.e,
                                                        '0'
                                                    ))
                                                  : (m(t, 2, D.length, 'Base'),
                                                    (e = n(w(d(r.c), o, '0'), 10, t, i, !0))),
                                              i < 0 && r.c[0] && (e = '-' + e)),
                                        e
                                    );
                                }),
                                (S.valueOf = S.toJSON = function() {
                                    return Y(this);
                                }),
                                (S._isBigNumber = !0),
                                u &&
                                    ((S[Symbol.toStringTag] = 'BigNumber'),
                                    (S[Symbol.for('nodejs.util.inspect.custom')] = S.valueOf)),
                                null != e && j.set(e),
                                j
                            );
                        })()).default = o.BigNumber = o),
                            void 0 ===
                                (n = function() {
                                    return o;
                                }.call(e, r, e, t)) || (t.exports = n);
                    })();
                },
                function(t, e) {
                    t.exports = function(t) {
                        return (
                            t.webpackPolyfill ||
                                ((t.deprecate = function() {}),
                                (t.paths = []),
                                t.children || (t.children = []),
                                Object.defineProperty(t, 'loaded', {
                                    enumerable: !0,
                                    get: function() {
                                        return t.l;
                                    }
                                }),
                                Object.defineProperty(t, 'id', {
                                    enumerable: !0,
                                    get: function() {
                                        return t.i;
                                    }
                                }),
                                (t.webpackPolyfill = 1)),
                            t
                        );
                    };
                },
                function(t, e) {},
                function(t, e) {
                    var r,
                        n,
                        i = (t.exports = {});
                    function o() {
                        throw new Error('setTimeout has not been defined');
                    }
                    function s() {
                        throw new Error('clearTimeout has not been defined');
                    }
                    function u(t) {
                        if (r === setTimeout) return setTimeout(t, 0);
                        if ((r === o || !r) && setTimeout)
                            return (r = setTimeout), setTimeout(t, 0);
                        try {
                            return r(t, 0);
                        } catch (e) {
                            try {
                                return r.call(null, t, 0);
                            } catch (e) {
                                return r.call(this, t, 0);
                            }
                        }
                    }
                    !(function() {
                        try {
                            r = 'function' == typeof setTimeout ? setTimeout : o;
                        } catch (t) {
                            r = o;
                        }
                        try {
                            n = 'function' == typeof clearTimeout ? clearTimeout : s;
                        } catch (t) {
                            n = s;
                        }
                    })();
                    var a,
                        h = [],
                        f = !1,
                        c = -1;
                    function l() {
                        f &&
                            a &&
                            ((f = !1), a.length ? (h = a.concat(h)) : (c = -1), h.length && p());
                    }
                    function p() {
                        if (!f) {
                            var t = u(l);
                            f = !0;
                            for (var e = h.length; e; ) {
                                for (a = h, h = []; ++c < e; ) a && a[c].run();
                                (c = -1), (e = h.length);
                            }
                            (a = null),
                                (f = !1),
                                (function(t) {
                                    if (n === clearTimeout) return clearTimeout(t);
                                    if ((n === s || !n) && clearTimeout)
                                        return (n = clearTimeout), clearTimeout(t);
                                    try {
                                        n(t);
                                    } catch (e) {
                                        try {
                                            return n.call(null, t);
                                        } catch (e) {
                                            return n.call(this, t);
                                        }
                                    }
                                })(t);
                        }
                    }
                    function d(t, e) {
                        (this.fun = t), (this.array = e);
                    }
                    function g() {}
                    (i.nextTick = function(t) {
                        var e = new Array(arguments.length - 1);
                        if (arguments.length > 1)
                            for (var r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
                        h.push(new d(t, e)), 1 !== h.length || f || u(p);
                    }),
                        (d.prototype.run = function() {
                            this.fun.apply(null, this.array);
                        }),
                        (i.title = 'browser'),
                        (i.browser = !0),
                        (i.env = {}),
                        (i.argv = []),
                        (i.version = ''),
                        (i.versions = {}),
                        (i.on = g),
                        (i.addListener = g),
                        (i.once = g),
                        (i.off = g),
                        (i.removeListener = g),
                        (i.removeAllListeners = g),
                        (i.emit = g),
                        (i.prependListener = g),
                        (i.prependOnceListener = g),
                        (i.listeners = function(t) {
                            return [];
                        }),
                        (i.binding = function(t) {
                            throw new Error('process.binding is not supported');
                        }),
                        (i.cwd = function() {
                            return '/';
                        }),
                        (i.chdir = function(t) {
                            throw new Error('process.chdir is not supported');
                        }),
                        (i.umask = function() {
                            return 0;
                        });
                },
                function(t, e, r) {
                    'use strict';
                    r.r(e);
                    var n = r(2);
                    n.a.from(-1),
                        n.a.from(0),
                        n.a.from(1),
                        n.a.from(2),
                        n.a.from('1000000000000000000'),
                        n.a.from(
                            '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                        );
                    var i = r(0);
                    const o = new (r(1).a)('strings/5.0.0-beta.135');
                    var s;
                    function u(t, e) {
                        t = Object(i.arrayify)(t);
                        const r = [];
                        let n = 0;
                        for (; n < t.length; ) {
                            const i = t[n++];
                            if (i >> 7 == 0) {
                                r.push(i);
                                continue;
                            }
                            let o = null,
                                s = null;
                            if (192 == (224 & i)) (o = 1), (s = 127);
                            else if (224 == (240 & i)) (o = 2), (s = 2047);
                            else {
                                if (240 != (248 & i)) {
                                    if (!e) {
                                        if (128 == (192 & i))
                                            throw new Error(
                                                'invalid utf8 byte sequence; unexpected continuation byte'
                                            );
                                        throw new Error(
                                            'invalid utf8 byte sequence; invalid prefix'
                                        );
                                    }
                                    continue;
                                }
                                (o = 3), (s = 65535);
                            }
                            if (n + o > t.length) {
                                if (!e) throw new Error('invalid utf8 byte sequence; too short');
                                for (; n < t.length && t[n] >> 6 == 2; n++);
                                continue;
                            }
                            let u = i & ((1 << (8 - o - 1)) - 1);
                            for (let e = 0; e < o; e++) {
                                let e = t[n];
                                if (128 != (192 & e)) {
                                    u = null;
                                    break;
                                }
                                (u = (u << 6) | (63 & e)), n++;
                            }
                            if (null !== u)
                                if (u <= s) {
                                    if (!e) throw new Error('invalid utf8 byte sequence; overlong');
                                } else if (u > 1114111) {
                                    if (!e)
                                        throw new Error('invalid utf8 byte sequence; out-of-range');
                                } else if (u >= 55296 && u <= 57343) {
                                    if (!e)
                                        throw new Error(
                                            'invalid utf8 byte sequence; utf-16 surrogate'
                                        );
                                } else r.push(u);
                            else if (!e)
                                throw new Error(
                                    'invalid utf8 byte sequence; invalid continuation byte'
                                );
                        }
                        return r;
                    }
                    function a(t, e = s.current) {
                        e != s.current && (o.checkNormalize(), (t = t.normalize(e)));
                        let r = [];
                        for (let e = 0; e < t.length; e++) {
                            const n = t.charCodeAt(e);
                            if (n < 128) r.push(n);
                            else if (n < 2048) r.push((n >> 6) | 192), r.push((63 & n) | 128);
                            else if (55296 == (64512 & n)) {
                                e++;
                                const i = t.charCodeAt(e);
                                if (e >= t.length || 56320 != (64512 & i))
                                    throw new Error('invalid utf-8 string');
                                const o = 65536 + ((1023 & n) << 10) + (1023 & i);
                                r.push((o >> 18) | 240),
                                    r.push(((o >> 12) & 63) | 128),
                                    r.push(((o >> 6) & 63) | 128),
                                    r.push((63 & o) | 128);
                            } else
                                r.push((n >> 12) | 224),
                                    r.push(((n >> 6) & 63) | 128),
                                    r.push((63 & n) | 128);
                        }
                        return Object(i.arrayify)(r);
                    }
                    function h(t) {
                        const e = '0000' + t.toString(16);
                        return '\\u' + e.substring(e.length - 4);
                    }
                    function f(t, e) {
                        return (
                            '"' +
                            u(t, e)
                                .map(t => {
                                    if (t < 256) {
                                        switch (t) {
                                            case 8:
                                                return '\\b';
                                            case 9:
                                                return '\\t';
                                            case 10:
                                                return '\\n';
                                            case 13:
                                                return '\\r';
                                            case 34:
                                                return '\\"';
                                            case 92:
                                                return '\\\\';
                                        }
                                        if (t >= 32 && t < 127) return String.fromCharCode(t);
                                    }
                                    return t <= 65535
                                        ? h(t)
                                        : h(55296 + (((t -= 65536) >> 10) & 1023)) +
                                              h(56320 + (1023 & t));
                                })
                                .join('') +
                            '"'
                        );
                    }
                    function c(t) {
                        return t
                            .map(t =>
                                t <= 65535
                                    ? String.fromCharCode(t)
                                    : ((t -= 65536),
                                      String.fromCharCode(
                                          55296 + ((t >> 10) & 1023),
                                          56320 + (1023 & t)
                                      ))
                            )
                            .join('');
                    }
                    function l(t, e) {
                        return c(u(t, e));
                    }
                    function p(t, e = s.current) {
                        return u(a(t, e));
                    }
                    function d(t) {
                        const e = a(t);
                        if (e.length > 31)
                            throw new Error('bytes32 string must be less than 32 bytes');
                        return Object(i.hexlify)(
                            Object(i.concat)([
                                e,
                                '0x0000000000000000000000000000000000000000000000000000000000000000'
                            ]).slice(0, 32)
                        );
                    }
                    function g(t) {
                        const e = Object(i.arrayify)(t);
                        if (32 !== e.length) throw new Error('invalid bytes32 - not 32 bytes long');
                        if (0 !== e[31])
                            throw new Error('invalid bytes32 string - no null terminator');
                        let r = 31;
                        for (; 0 === e[r - 1]; ) r--;
                        return l(e.slice(0, r));
                    }
                    function m(t, e) {
                        e ||
                            (e = function(t) {
                                return [parseInt(t, 16)];
                            });
                        let r = 0,
                            n = {};
                        return (
                            t.split(',').forEach(t => {
                                let i = t.split(':');
                                (r += parseInt(i[0], 16)), (n[r] = e(i[1]));
                            }),
                            n
                        );
                    }
                    function v(t) {
                        let e = 0;
                        return t.split(',').map(t => {
                            let r = t.split('-');
                            1 === r.length ? (r[1] = '0') : '' === r[1] && (r[1] = '1');
                            let n = e + parseInt(r[0], 16);
                            return (e = parseInt(r[1], 16)), { l: n, h: e };
                        });
                    }
                    function y(t, e) {
                        let r = 0;
                        for (let n = 0; n < e.length; n++) {
                            let i = e[n];
                            if (((r += i.l), t >= r && t <= r + i.h && (t - r) % (i.d || 1) == 0)) {
                                if (i.e && -1 !== i.e.indexOf(t - r)) continue;
                                return i;
                            }
                        }
                        return null;
                    }
                    !(function(t) {
                        (t.current = ''),
                            (t.NFC = 'NFC'),
                            (t.NFD = 'NFD'),
                            (t.NFKC = 'NFKC'),
                            (t.NFKD = 'NFKD');
                    })(s || (s = {}));
                    const w = v(
                            '221,13-1b,5f-,40-10,51-f,11-3,3-3,2-2,2-4,8,2,15,2d,28-8,88,48,27-,3-5,11-20,27-,8,28,3-5,12,18,b-a,1c-4,6-16,2-d,2-2,2,1b-4,17-9,8f-,10,f,1f-2,1c-34,33-14e,4,36-,13-,6-2,1a-f,4,9-,3-,17,8,2-2,5-,2,8-,3-,4-8,2-3,3,6-,16-6,2-,7-3,3-,17,8,3,3,3-,2,6-3,3-,4-a,5,2-6,10-b,4,8,2,4,17,8,3,6-,b,4,4-,2-e,2-4,b-10,4,9-,3-,17,8,3-,5-,9-2,3-,4-7,3-3,3,4-3,c-10,3,7-2,4,5-2,3,2,3-2,3-2,4-2,9,4-3,6-2,4,5-8,2-e,d-d,4,9,4,18,b,6-3,8,4,5-6,3-8,3-3,b-11,3,9,4,18,b,6-3,8,4,5-6,3-6,2,3-3,b-11,3,9,4,18,11-3,7-,4,5-8,2-7,3-3,b-11,3,13-2,19,a,2-,8-2,2-3,7,2,9-11,4-b,3b-3,1e-24,3,2-,3,2-,2-5,5,8,4,2,2-,3,e,4-,6,2,7-,b-,3-21,49,23-5,1c-3,9,25,10-,2-2f,23,6,3,8-2,5-5,1b-45,27-9,2a-,2-3,5b-4,45-4,53-5,8,40,2,5-,8,2,5-,28,2,5-,20,2,5-,8,2,5-,8,8,18,20,2,5-,8,28,14-5,1d-22,56-b,277-8,1e-2,52-e,e,8-a,18-8,15-b,e,4,3-b,5e-2,b-15,10,b-5,59-7,2b-555,9d-3,5b-5,17-,7-,27-,7-,9,2,2,2,20-,36,10,f-,7,14-,4,a,54-3,2-6,6-5,9-,1c-10,13-1d,1c-14,3c-,10-6,32-b,240-30,28-18,c-14,a0,115-,3,66-,b-76,5,5-,1d,24,2,5-2,2,8-,35-2,19,f-10,1d-3,311-37f,1b,5a-b,d7-19,d-3,41,57-,68-4,29-3,5f,29-37,2e-2,25-c,2c-2,4e-3,30,78-3,64-,20,19b7-49,51a7-59,48e-2,38-738,2ba5-5b,222f-,3c-94,8-b,6-4,1b,6,2,3,3,6d-20,16e-f,41-,37-7,2e-2,11-f,5-b,18-,b,14,5-3,6,88-,2,bf-2,7-,7-,7-,4-2,8,8-9,8-2ff,20,5-b,1c-b4,27-,27-cbb1,f7-9,28-2,b5-221,56,48,3-,2-,3-,5,d,2,5,3,42,5-,9,8,1d,5,6,2-2,8,153-3,123-3,33-27fd,a6da-5128,21f-5df,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3,2-1d,61-ff7d'
                        ),
                        b = 'ad,34f,1806,180b,180c,180d,200b,200c,200d,2060,feff'
                            .split(',')
                            .map(t => parseInt(t, 16)),
                        _ = [
                            { h: 25, s: 32, l: 65 },
                            { h: 30, s: 32, e: [23], l: 127 },
                            { h: 54, s: 1, e: [48], l: 64, d: 2 },
                            { h: 14, s: 1, l: 57, d: 2 },
                            { h: 44, s: 1, l: 17, d: 2 },
                            { h: 10, s: 1, e: [2, 6, 8], l: 61, d: 2 },
                            { h: 16, s: 1, l: 68, d: 2 },
                            { h: 84, s: 1, e: [18, 24, 66], l: 19, d: 2 },
                            { h: 26, s: 32, e: [17], l: 435 },
                            { h: 22, s: 1, l: 71, d: 2 },
                            { h: 15, s: 80, l: 40 },
                            { h: 31, s: 32, l: 16 },
                            { h: 32, s: 1, l: 80, d: 2 },
                            { h: 52, s: 1, l: 42, d: 2 },
                            { h: 12, s: 1, l: 55, d: 2 },
                            { h: 40, s: 1, e: [38], l: 15, d: 2 },
                            { h: 14, s: 1, l: 48, d: 2 },
                            { h: 37, s: 48, l: 49 },
                            { h: 148, s: 1, l: 6351, d: 2 },
                            { h: 88, s: 1, l: 160, d: 2 },
                            { h: 15, s: 16, l: 704 },
                            { h: 25, s: 26, l: 854 },
                            { h: 25, s: 32, l: 55915 },
                            { h: 37, s: 40, l: 1247 },
                            { h: 25, s: -119711, l: 53248 },
                            { h: 25, s: -119763, l: 52 },
                            { h: 25, s: -119815, l: 52 },
                            { h: 25, s: -119867, e: [1, 4, 5, 7, 8, 11, 12, 17], l: 52 },
                            { h: 25, s: -119919, l: 52 },
                            { h: 24, s: -119971, e: [2, 7, 8, 17], l: 52 },
                            { h: 24, s: -120023, e: [2, 7, 13, 15, 16, 17], l: 52 },
                            { h: 25, s: -120075, l: 52 },
                            { h: 25, s: -120127, l: 52 },
                            { h: 25, s: -120179, l: 52 },
                            { h: 25, s: -120231, l: 52 },
                            { h: 25, s: -120283, l: 52 },
                            { h: 25, s: -120335, l: 52 },
                            { h: 24, s: -119543, e: [17], l: 56 },
                            { h: 24, s: -119601, e: [17], l: 58 },
                            { h: 24, s: -119659, e: [17], l: 58 },
                            { h: 24, s: -119717, e: [17], l: 58 },
                            { h: 24, s: -119775, e: [17], l: 58 }
                        ],
                        M = m(
                            'b5:3bc,c3:ff,7:73,2:253,5:254,3:256,1:257,5:259,1:25b,3:260,1:263,2:269,1:268,5:26f,1:272,2:275,7:280,3:283,5:288,3:28a,1:28b,5:292,3f:195,1:1bf,29:19e,125:3b9,8b:3b2,1:3b8,1:3c5,3:3c6,1:3c0,1a:3ba,1:3c1,1:3c3,2:3b8,1:3b5,1bc9:3b9,1c:1f76,1:1f77,f:1f7a,1:1f7b,d:1f78,1:1f79,1:1f7c,1:1f7d,107:63,5:25b,4:68,1:68,1:68,3:69,1:69,1:6c,3:6e,4:70,1:71,1:72,1:72,1:72,7:7a,2:3c9,2:7a,2:6b,1:e5,1:62,1:63,3:65,1:66,2:6d,b:3b3,1:3c0,6:64,1b574:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3'
                        ),
                        E = m(
                            '179:1,2:1,2:1,5:1,2:1,a:4f,a:1,8:1,2:1,2:1,3:1,5:1,3:1,4:1,2:1,3:1,4:1,8:2,1:1,2:2,1:1,2:2,27:2,195:26,2:25,1:25,1:25,2:40,2:3f,1:3f,33:1,11:-6,1:-9,1ac7:-3a,6d:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,b:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,c:-8,2:-8,2:-8,2:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,49:-8,1:-8,1:-4a,1:-4a,d:-56,1:-56,1:-56,1:-56,d:-8,1:-8,f:-8,1:-8,3:-7'
                        ),
                        R = m(
                            'df:00730073,51:00690307,19:02BC006E,a7:006A030C,18a:002003B9,16:03B903080301,20:03C503080301,1d7:05650582,190f:00680331,1:00740308,1:0077030A,1:0079030A,1:006102BE,b6:03C50313,2:03C503130300,2:03C503130301,2:03C503130342,2a:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,3:1F7003B9,1:03B103B9,1:03AC03B9,2:03B10342,1:03B1034203B9,5:03B103B9,6:1F7403B9,1:03B703B9,1:03AE03B9,2:03B70342,1:03B7034203B9,5:03B703B9,6:03B903080300,1:03B903080301,3:03B90342,1:03B903080342,b:03C503080300,1:03C503080301,1:03C10313,2:03C50342,1:03C503080342,b:1F7C03B9,1:03C903B9,1:03CE03B9,2:03C90342,1:03C9034203B9,5:03C903B9,ac:00720073,5b:00B00063,6:00B00066,d:006E006F,a:0073006D,1:00740065006C,1:0074006D,124f:006800700061,2:00610075,2:006F0076,b:00700061,1:006E0061,1:03BC0061,1:006D0061,1:006B0061,1:006B0062,1:006D0062,1:00670062,3:00700066,1:006E0066,1:03BC0066,4:0068007A,1:006B0068007A,1:006D0068007A,1:00670068007A,1:00740068007A,15:00700061,1:006B00700061,1:006D00700061,1:006700700061,8:00700076,1:006E0076,1:03BC0076,1:006D0076,1:006B0076,1:006D0076,1:00700077,1:006E0077,1:03BC0077,1:006D0077,1:006B0077,1:006D0077,1:006B03C9,1:006D03C9,2:00620071,3:00632215006B0067,1:0063006F002E,1:00640062,1:00670079,2:00680070,2:006B006B,1:006B006D,9:00700068,2:00700070006D,1:00700072,2:00730076,1:00770062,c723:00660066,1:00660069,1:0066006C,1:006600660069,1:00660066006C,1:00730074,1:00730074,d:05740576,1:05740565,1:0574056B,1:057E0576,1:0574056D',
                            function(t) {
                                if (t.length % 4 != 0) throw new Error('bad data');
                                let e = [];
                                for (let r = 0; r < t.length; r += 4)
                                    e.push(parseInt(t.substring(r, r + 4), 16));
                                return e;
                            }
                        ),
                        S = v(
                            '80-20,2a0-,39c,32,f71,18e,7f2-f,19-7,30-4,7-5,f81-b,5,a800-20ff,4d1-1f,110,fa-6,d174-7,2e84-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,2,1f-5f,ff7f-20001'
                        );
                    function O(t) {
                        if (t.match(/^[a-z0-9-]*$/i) && t.length <= 59) return t.toLowerCase();
                        let e = p(t);
                        var r;
                        (r = e.map(t =>
                            b.indexOf(t) >= 0
                                ? []
                                : t >= 65024 && t <= 65039
                                ? []
                                : (function(t) {
                                      let e = y(t, _);
                                      if (e) return [t + e.s];
                                      let r = M[t];
                                      if (r) return r;
                                      let n = E[t];
                                      return n ? [t + n[0]] : R[t] || null;
                                  })(t) || [t]
                        )),
                            (e = r.reduce(
                                (t, e) => (
                                    e.forEach(e => {
                                        t.push(e);
                                    }),
                                    t
                                ),
                                []
                            )),
                            (e = p(c(e), s.NFKC)),
                            e.forEach(t => {
                                if (y(t, S)) throw new Error('STRINGPREP_CONTAINS_PROHIBITED');
                            }),
                            e.forEach(t => {
                                if (y(t, w)) throw new Error('STRINGPREP_CONTAINS_UNASSIGNED');
                            });
                        let n = c(e);
                        if (
                            '-' === n.substring(0, 1) ||
                            '--' === n.substring(2, 4) ||
                            '-' === n.substring(n.length - 1)
                        )
                            throw new Error('invalid hyphen');
                        if (n.length > 63) throw new Error('too long');
                        return n;
                    }
                    r.d(e, '_toEscapedUtf8String', function() {
                        return f;
                    }),
                        r.d(e, 'toUtf8Bytes', function() {
                            return a;
                        }),
                        r.d(e, 'toUtf8CodePoints', function() {
                            return p;
                        }),
                        r.d(e, 'toUtf8String', function() {
                            return l;
                        }),
                        r.d(e, 'UnicodeNormalizationForm', function() {
                            return s;
                        }),
                        r.d(e, 'formatBytes32String', function() {
                            return d;
                        }),
                        r.d(e, 'parseBytes32String', function() {
                            return g;
                        }),
                        r.d(e, 'nameprep', function() {
                            return O;
                        });
                },
                function(t, e, r) {
                    'use strict';
                    r.r(e);
                    var n = r(3),
                        i = r(0),
                        o = r(2),
                        s = r(5),
                        u = r.n(s);
                    function a(t) {
                        return '0x' + u.a.keccak_256(Object(i.arrayify)(t));
                    }
                    function h(t) {
                        const e = [];
                        for (; t; ) e.unshift(255 & t), (t >>= 8);
                        return e;
                    }
                    var f = r(1);
                    r.d(e, 'getAddress', function() {
                        return v;
                    }),
                        r.d(e, 'isAddress', function() {
                            return y;
                        }),
                        r.d(e, 'getIcapAddress', function() {
                            return w;
                        }),
                        r.d(e, 'getContractAddress', function() {
                            return b;
                        }),
                        r.d(e, 'getCreate2Address', function() {
                            return _;
                        });
                    const c = new f.a('address/5.0.0-beta.134');
                    function l(t) {
                        Object(i.isHexString)(t, 20) ||
                            c.throwArgumentError('invalid address', 'address', t);
                        const e = (t = t.toLowerCase()).substring(2).split(''),
                            r = new Uint8Array(40);
                        for (let t = 0; t < 40; t++) r[t] = e[t].charCodeAt(0);
                        const n = Object(i.arrayify)(a(r));
                        for (let t = 0; t < 40; t += 2)
                            n[t >> 1] >> 4 >= 8 && (e[t] = e[t].toUpperCase()),
                                (15 & n[t >> 1]) >= 8 && (e[t + 1] = e[t + 1].toUpperCase());
                        return '0x' + e.join('');
                    }
                    const p = {};
                    for (let t = 0; t < 10; t++) p[String(t)] = String(t);
                    for (let t = 0; t < 26; t++) p[String.fromCharCode(65 + t)] = String(10 + t);
                    const d = Math.floor(
                        ((g = 9007199254740991),
                        Math.log10 ? Math.log10(g) : Math.log(g) / Math.LN10)
                    );
                    var g;
                    function m(t) {
                        let e = (t = (t = t.toUpperCase()).substring(4) + t.substring(0, 2) + '00')
                            .split('')
                            .map(t => p[t])
                            .join('');
                        for (; e.length >= d; ) {
                            let t = e.substring(0, d);
                            e = (parseInt(t, 10) % 97) + e.substring(t.length);
                        }
                        let r = String(98 - (parseInt(e, 10) % 97));
                        for (; r.length < 2; ) r = '0' + r;
                        return r;
                    }
                    function v(t) {
                        let e = null;
                        if (
                            ('string' != typeof t &&
                                c.throwArgumentError('invalid address', 'address', t),
                            t.match(/^(0x)?[0-9a-fA-F]{40}$/))
                        )
                            '0x' !== t.substring(0, 2) && (t = '0x' + t),
                                (e = l(t)),
                                t.match(/([A-F].*[a-f])|([a-f].*[A-F])/) &&
                                    e !== t &&
                                    c.throwArgumentError('bad address checksum', 'address', t);
                        else if (t.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
                            for (
                                t.substring(2, 4) !== m(t) &&
                                    c.throwArgumentError('bad icap checksum', 'address', t),
                                    e = new n.BN(t.substring(4), 36).toString(16);
                                e.length < 40;

                            )
                                e = '0' + e;
                            e = l('0x' + e);
                        } else c.throwArgumentError('invalid address', 'address', t);
                        return e;
                    }
                    function y(t) {
                        try {
                            return v(t), !0;
                        } catch (t) {}
                        return !1;
                    }
                    function w(t) {
                        let e = new n.BN(v(t).substring(2), 16).toString(36).toUpperCase();
                        for (; e.length < 30; ) e = '0' + e;
                        return 'XE' + m('XE00' + e) + e;
                    }
                    function b(t) {
                        let e = null;
                        try {
                            e = v(t.from);
                        } catch (e) {
                            c.throwArgumentError('missing from address', 'transaction', t);
                        }
                        const r = Object(i.stripZeros)(
                            Object(i.arrayify)(o.a.from(t.nonce).toHexString())
                        );
                        return v(
                            Object(i.hexDataSlice)(
                                a(
                                    (function(t) {
                                        return Object(i.hexlify)(
                                            (function t(e) {
                                                if (Array.isArray(e)) {
                                                    let r = [];
                                                    if (
                                                        (e.forEach(function(e) {
                                                            r = r.concat(t(e));
                                                        }),
                                                        r.length <= 55)
                                                    )
                                                        return r.unshift(192 + r.length), r;
                                                    const n = h(r.length);
                                                    return n.unshift(247 + n.length), n.concat(r);
                                                }
                                                const r = Array.prototype.slice.call(
                                                    Object(i.arrayify)(e)
                                                );
                                                if (1 === r.length && r[0] <= 127) return r;
                                                if (r.length <= 55)
                                                    return r.unshift(128 + r.length), r;
                                                const n = h(r.length);
                                                return n.unshift(183 + n.length), n.concat(r);
                                            })(t)
                                        );
                                    })([e, r])
                                ),
                                12
                            )
                        );
                    }
                    function _(t, e, r) {
                        return (
                            32 !== Object(i.hexDataLength)(e) &&
                                c.throwArgumentError('salt must be 32 bytes', 'salt', e),
                            32 !== Object(i.hexDataLength)(r) &&
                                c.throwArgumentError(
                                    'initCodeHash must be 32 bytes',
                                    'initCodeHash',
                                    r
                                ),
                            v(Object(i.hexDataSlice)(a(Object(i.concat)(['0xff', v(t), e, r])), 12))
                        );
                    }
                }
            ]);
        },
        function(t, e, r) {
            'use strict';
            Object.defineProperty(e, '__esModule', { value: !0 });
            var n = r(0),
                i = r(1),
                o = r(3),
                s = n.__importDefault(r(4)),
                u = n.__importDefault(r(5)),
                a = (function() {
                    function t(t, e, r, n, i) {
                        if (
                            ((this.cryptoLib = t),
                            (this.protocol = 'wc'),
                            (this.version = 1),
                            (this._bridge = ''),
                            (this._key = null),
                            (this._nextKey = null),
                            (this._clientId = ''),
                            (this._clientMeta = null),
                            (this._peerId = ''),
                            (this._peerMeta = null),
                            (this._handshakeId = 0),
                            (this._handshakeTopic = ''),
                            (this._accounts = []),
                            (this._chainId = 0),
                            (this._networkId = 0),
                            (this._rpcUrl = ''),
                            (this._eventManager = new u.default()),
                            (this._connected = !1),
                            (this._storage = n || null),
                            i && (this.clientMeta = i),
                            !e.bridge && !e.uri && !e.session)
                        )
                            throw new Error(o.ERROR_MISSING_REQUIRED);
                        e.bridge && (this.bridge = e.bridge), e.uri && (this.uri = e.uri);
                        var a = e.session || null;
                        a || (a = this._getStorageSession()),
                            a && (this.session = a),
                            this.handshakeId &&
                                this._subscribeToSessionResponse(
                                    this.handshakeId,
                                    'Session request rejected'
                                ),
                            (this._transport =
                                r ||
                                new s.default({ bridge: this.bridge, clientId: this.clientId })),
                            e.uri && this._subscribeToSessionRequest(),
                            this._subscribeToInternalEvents(),
                            this._transport.open();
                    }
                    return (
                        Object.defineProperty(t.prototype, 'bridge', {
                            get: function() {
                                return this._bridge;
                            },
                            set: function(t) {
                                t && (this._bridge = t);
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'key', {
                            get: function() {
                                return this._key ? i.convertArrayBufferToHex(this._key, !0) : '';
                            },
                            set: function(t) {
                                if (t) {
                                    var e = i.convertHexToArrayBuffer(t);
                                    this._key = e;
                                }
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'nextKey', {
                            get: function() {
                                return this._nextKey
                                    ? i.convertArrayBufferToHex(this._nextKey)
                                    : '';
                            },
                            set: function(t) {
                                if (t) {
                                    var e = i.convertHexToArrayBuffer(t);
                                    this._nextKey = e;
                                }
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'clientId', {
                            get: function() {
                                var t = this._clientId;
                                return t || (t = this._clientId = i.uuid()), this._clientId;
                            },
                            set: function(t) {
                                t && (this._clientId = t);
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'peerId', {
                            get: function() {
                                return this._peerId;
                            },
                            set: function(t) {
                                t && (this._peerId = t);
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'clientMeta', {
                            get: function() {
                                var t = this._clientMeta;
                                return t || (t = this._clientMeta = i.getMeta()), t;
                            },
                            set: function(t) {},
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'peerMeta', {
                            get: function() {
                                return this._peerMeta;
                            },
                            set: function(t) {
                                this._peerMeta = t;
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'handshakeTopic', {
                            get: function() {
                                return this._handshakeTopic;
                            },
                            set: function(t) {
                                t && (this._handshakeTopic = t);
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'handshakeId', {
                            get: function() {
                                return this._handshakeId;
                            },
                            set: function(t) {
                                t && (this._handshakeId = t);
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'uri', {
                            get: function() {
                                return this._formatUri();
                            },
                            set: function(t) {
                                if (t) {
                                    var e = this._parseUri(t),
                                        r = e.handshakeTopic,
                                        n = e.bridge,
                                        i = e.key;
                                    (this.handshakeTopic = r), (this.bridge = n), (this.key = i);
                                }
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'chainId', {
                            get: function() {
                                return this._chainId;
                            },
                            set: function(t) {
                                this._chainId = t;
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'networkId', {
                            get: function() {
                                return this._networkId;
                            },
                            set: function(t) {
                                this._networkId = t;
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'accounts', {
                            get: function() {
                                return this._accounts;
                            },
                            set: function(t) {
                                this._accounts = t;
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'rpcUrl', {
                            get: function() {
                                return this._rpcUrl;
                            },
                            set: function(t) {
                                this._rpcUrl = t;
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'connected', {
                            get: function() {
                                return this._connected;
                            },
                            set: function(t) {},
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'pending', {
                            get: function() {
                                return !!this._handshakeTopic;
                            },
                            set: function(t) {},
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'session', {
                            get: function() {
                                return {
                                    connected: this.connected,
                                    accounts: this.accounts,
                                    chainId: this.chainId,
                                    bridge: this.bridge,
                                    key: this.key,
                                    clientId: this.clientId,
                                    clientMeta: this.clientMeta,
                                    peerId: this.peerId,
                                    peerMeta: this.peerMeta,
                                    handshakeId: this.handshakeId,
                                    handshakeTopic: this.handshakeTopic
                                };
                            },
                            set: function(t) {
                                t &&
                                    ((this._connected = t.connected),
                                    (this.accounts = t.accounts),
                                    (this.chainId = t.chainId),
                                    (this.bridge = t.bridge),
                                    (this.key = t.key),
                                    (this.clientId = t.clientId),
                                    (this.clientMeta = t.clientMeta),
                                    (this.peerId = t.peerId),
                                    (this.peerMeta = t.peerMeta),
                                    (this.handshakeId = t.handshakeId),
                                    (this.handshakeTopic = t.handshakeTopic));
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        (t.prototype.on = function(t, e) {
                            var r = { event: t, callback: e };
                            this._eventManager.subscribe(r);
                        }),
                        (t.prototype.createSession = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e, r;
                                return n.__generator(this, function(n) {
                                    switch (n.label) {
                                        case 0:
                                            if (this._connected)
                                                throw new Error(o.ERROR_SESSION_CONNECTED);
                                            return this.pending
                                                ? [2]
                                                : ((e = this), [4, this._generateKey()]);
                                        case 1:
                                            return (
                                                (e._key = n.sent()),
                                                (r = this._formatRequest({
                                                    method: 'wc_sessionRequest',
                                                    params: [
                                                        {
                                                            peerId: this.clientId,
                                                            peerMeta: this.clientMeta,
                                                            chainId:
                                                                t && t.chainId ? t.chainId : null
                                                        }
                                                    ]
                                                })),
                                                (this.handshakeId = r.id),
                                                (this.handshakeTopic = i.uuid()),
                                                this._sendSessionRequest(
                                                    r,
                                                    'Session update rejected',
                                                    this.handshakeTopic
                                                ),
                                                this._eventManager.trigger({
                                                    event: 'display_uri',
                                                    params: [this.uri]
                                                }),
                                                [2]
                                            );
                                    }
                                });
                            });
                        }),
                        (t.prototype.approveSession = function(t) {
                            if (this._connected) throw new Error(o.ERROR_SESSION_CONNECTED);
                            (this.chainId = t.chainId),
                                (this.accounts = t.accounts),
                                (this.networkId = t.networkId || 0),
                                (this.rpcUrl = t.rpcUrl || '');
                            var e = {
                                    approved: !0,
                                    chainId: this.chainId,
                                    networkId: this.networkId,
                                    accounts: this.accounts,
                                    rpcUrl: this.rpcUrl,
                                    peerId: this.clientId,
                                    peerMeta: this.clientMeta
                                },
                                r = { id: this.handshakeId, jsonrpc: '2.0', result: e };
                            this._sendResponse(r),
                                (this._connected = !0),
                                this._eventManager.trigger({
                                    event: 'connect',
                                    params: [
                                        {
                                            peerId: this.peerId,
                                            peerMeta: this.peerMeta,
                                            chainId: this.chainId,
                                            accounts: this.accounts
                                        }
                                    ]
                                }),
                                this._connected && this._setStorageSession();
                        }),
                        (t.prototype.rejectSession = function(t) {
                            if (this._connected) throw new Error(o.ERROR_SESSION_CONNECTED);
                            var e = t && t.message ? t.message : o.ERROR_SESSION_REJECTED,
                                r = this._formatResponse({
                                    id: this.handshakeId,
                                    error: { message: e }
                                });
                            this._sendResponse(r),
                                (this._connected = !1),
                                this._eventManager.trigger({
                                    event: 'disconnect',
                                    params: [{ message: e }]
                                }),
                                this._removeStorageSession();
                        }),
                        (t.prototype.updateSession = function(t) {
                            if (!this._connected) throw new Error(o.ERROR_SESSION_DISCONNECTED);
                            (this.chainId = t.chainId),
                                (this.accounts = t.accounts),
                                (this.networkId = t.networkId || 0),
                                (this.rpcUrl = t.rpcUrl || '');
                            var e = {
                                    approved: !0,
                                    chainId: this.chainId,
                                    networkId: this.networkId,
                                    accounts: this.accounts,
                                    rpcUrl: this.rpcUrl
                                },
                                r = this._formatRequest({
                                    method: 'wc_sessionUpdate',
                                    params: [e]
                                });
                            this._sendSessionRequest(r, 'Session update rejected'),
                                this._eventManager.trigger({
                                    event: 'session_update',
                                    params: [{ chainId: this.chainId, accounts: this.accounts }]
                                }),
                                this._manageStorageSession();
                        }),
                        (t.prototype.killSession = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e, r, i;
                                return n.__generator(this, function(n) {
                                    switch (n.label) {
                                        case 0:
                                            return (
                                                (e = t ? t.message : 'Session Disconnected'),
                                                (r = {
                                                    approved: !1,
                                                    chainId: null,
                                                    networkId: null,
                                                    accounts: null
                                                }),
                                                (i = this._formatRequest({
                                                    method: 'wc_sessionUpdate',
                                                    params: [r]
                                                })),
                                                [4, this._sendRequest(i)]
                                            );
                                        case 1:
                                            return n.sent(), this._handleSessionDisconnect(e), [2];
                                    }
                                });
                            });
                        }),
                        (t.prototype.sendTransaction = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e, r;
                                return n.__generator(this, function(n) {
                                    switch (n.label) {
                                        case 0:
                                            if (!this._connected)
                                                throw new Error(o.ERROR_SESSION_DISCONNECTED);
                                            (e = i.parseTransactionData(t)),
                                                (r = this._formatRequest({
                                                    method: 'eth_sendTransaction',
                                                    params: [e]
                                                })),
                                                (n.label = 1);
                                        case 1:
                                            return (
                                                n.trys.push([1, 3, , 4]),
                                                [4, this._sendCallRequest(r)]
                                            );
                                        case 2:
                                            return [2, n.sent()];
                                        case 3:
                                            throw n.sent();
                                        case 4:
                                            return [2];
                                    }
                                });
                            });
                        }),
                        (t.prototype.signTransaction = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e, r;
                                return n.__generator(this, function(n) {
                                    switch (n.label) {
                                        case 0:
                                            if (!this._connected)
                                                throw new Error(o.ERROR_SESSION_DISCONNECTED);
                                            (e = i.parseTransactionData(t)),
                                                (r = this._formatRequest({
                                                    method: 'eth_signTransaction',
                                                    params: [e]
                                                })),
                                                (n.label = 1);
                                        case 1:
                                            return (
                                                n.trys.push([1, 3, , 4]),
                                                [4, this._sendCallRequest(r)]
                                            );
                                        case 2:
                                            return [2, n.sent()];
                                        case 3:
                                            throw n.sent();
                                        case 4:
                                            return [2];
                                    }
                                });
                            });
                        }),
                        (t.prototype.signMessage = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e;
                                return n.__generator(this, function(r) {
                                    switch (r.label) {
                                        case 0:
                                            if (!this._connected)
                                                throw new Error(o.ERROR_SESSION_DISCONNECTED);
                                            (e = this._formatRequest({
                                                method: 'eth_sign',
                                                params: t
                                            })),
                                                (r.label = 1);
                                        case 1:
                                            return (
                                                r.trys.push([1, 3, , 4]),
                                                [4, this._sendCallRequest(e)]
                                            );
                                        case 2:
                                            return [2, r.sent()];
                                        case 3:
                                            throw r.sent();
                                        case 4:
                                            return [2];
                                    }
                                });
                            });
                        }),
                        (t.prototype.signPersonalMessage = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e;
                                return n.__generator(this, function(r) {
                                    switch (r.label) {
                                        case 0:
                                            if (!this._connected)
                                                throw new Error(o.ERROR_SESSION_DISCONNECTED);
                                            (t = i.parsePersonalSign(t)),
                                                (e = this._formatRequest({
                                                    method: 'personal_sign',
                                                    params: t
                                                })),
                                                (r.label = 1);
                                        case 1:
                                            return (
                                                r.trys.push([1, 3, , 4]),
                                                [4, this._sendCallRequest(e)]
                                            );
                                        case 2:
                                            return [2, r.sent()];
                                        case 3:
                                            throw r.sent();
                                        case 4:
                                            return [2];
                                    }
                                });
                            });
                        }),
                        (t.prototype.signTypedData = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e;
                                return n.__generator(this, function(r) {
                                    switch (r.label) {
                                        case 0:
                                            if (!this._connected)
                                                throw new Error(o.ERROR_SESSION_DISCONNECTED);
                                            (e = this._formatRequest({
                                                method: 'eth_signTypedData',
                                                params: t
                                            })),
                                                (r.label = 1);
                                        case 1:
                                            return (
                                                r.trys.push([1, 3, , 4]),
                                                [4, this._sendCallRequest(e)]
                                            );
                                        case 2:
                                            return [2, r.sent()];
                                        case 3:
                                            throw r.sent();
                                        case 4:
                                            return [2];
                                    }
                                });
                            });
                        }),
                        (t.prototype.updateChain = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e;
                                return n.__generator(this, function(r) {
                                    switch (r.label) {
                                        case 0:
                                            if (!this._connected)
                                                throw new Error('Session currently disconnected');
                                            (e = this._formatRequest({
                                                method: 'wallet_updateChain',
                                                params: [t]
                                            })),
                                                (r.label = 1);
                                        case 1:
                                            return (
                                                r.trys.push([1, 3, , 4]),
                                                [4, this._sendCallRequest(e)]
                                            );
                                        case 2:
                                            return [2, r.sent()];
                                        case 3:
                                            throw r.sent();
                                        case 4:
                                            return [2];
                                    }
                                });
                            });
                        }),
                        (t.prototype.unsafeSend = function(t) {
                            var e = this;
                            return (
                                this._sendRequest(t),
                                new Promise(function(r, n) {
                                    e._subscribeToResponse(t.id, function(t, e) {
                                        if (t) n(t);
                                        else {
                                            if (!e) throw new Error(o.ERROR_MISSING_JSON_RPC);
                                            r(e);
                                        }
                                    });
                                })
                            );
                        }),
                        (t.prototype.sendCustomRequest = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e;
                                return n.__generator(this, function(r) {
                                    switch (r.label) {
                                        case 0:
                                            if (!this._connected)
                                                throw new Error(o.ERROR_SESSION_DISCONNECTED);
                                            switch (t.method) {
                                                case 'eth_accounts':
                                                    return [2, this.accounts];
                                                case 'eth_chainId':
                                                    return [2, i.convertNumberToHex(this.chainId)];
                                                case 'eth_sendTransaction':
                                                case 'eth_signTransaction':
                                                    t.params &&
                                                        (t.params[0] = i.parseTransactionData(
                                                            t.params[0]
                                                        ));
                                                    break;
                                                case 'personal_sign':
                                                    t.params &&
                                                        (t.params = i.parsePersonalSign(t.params));
                                            }
                                            (e = this._formatRequest(t)), (r.label = 1);
                                        case 1:
                                            return (
                                                r.trys.push([1, 3, , 4]),
                                                [4, this._sendCallRequest(e)]
                                            );
                                        case 2:
                                            return [2, r.sent()];
                                        case 3:
                                            throw r.sent();
                                        case 4:
                                            return [2];
                                    }
                                });
                            });
                        }),
                        (t.prototype.approveRequest = function(t) {
                            if (!i.isJsonRpcResponseSuccess(t))
                                throw new Error(o.ERROR_MISSING_RESULT);
                            var e = this._formatResponse(t);
                            this._sendResponse(e);
                        }),
                        (t.prototype.rejectRequest = function(t) {
                            if (!i.isJsonRpcResponseError(t))
                                throw new Error(o.ERROR_MISSING_ERROR);
                            var e = this._formatResponse(t);
                            this._sendResponse(e);
                        }),
                        (t.prototype._sendRequest = function(t, e) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var r, o, s, u, a, h;
                                return n.__generator(this, function(n) {
                                    switch (n.label) {
                                        case 0:
                                            return (
                                                (r = this._formatRequest(t)), [4, this._encrypt(r)]
                                            );
                                        case 1:
                                            return (
                                                (o = n.sent()),
                                                (s = e || this.peerId),
                                                (u = JSON.stringify(o)),
                                                (a = i.isSilentPayload(r)),
                                                (h = {
                                                    topic: s,
                                                    type: 'pub',
                                                    payload: u,
                                                    silent: a
                                                }),
                                                this._transport.send(h),
                                                [2]
                                            );
                                    }
                                });
                            });
                        }),
                        (t.prototype._sendResponse = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e, r, i, o;
                                return n.__generator(this, function(n) {
                                    switch (n.label) {
                                        case 0:
                                            return [4, this._encrypt(t)];
                                        case 1:
                                            return (
                                                (e = n.sent()),
                                                (r = this.peerId),
                                                (i = JSON.stringify(e)),
                                                (o = {
                                                    topic: r,
                                                    type: 'pub',
                                                    payload: i,
                                                    silent: !0
                                                }),
                                                this._transport.send(o),
                                                [2]
                                            );
                                    }
                                });
                            });
                        }),
                        (t.prototype._sendSessionRequest = function(t, e, r) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                return n.__generator(this, function(n) {
                                    return (
                                        this._sendRequest(t, r),
                                        this._subscribeToSessionResponse(t.id, e),
                                        [2]
                                    );
                                });
                            });
                        }),
                        (t.prototype._sendCallRequest = function(t) {
                            return this._sendRequest(t), this._subscribeToCallResponse(t.id);
                        }),
                        (t.prototype._formatRequest = function(t) {
                            if (void 0 === t.method) throw new Error(o.ERROR_MISSING_METHOD);
                            return {
                                id: void 0 === t.id ? i.payloadId() : t.id,
                                jsonrpc: '2.0',
                                method: t.method,
                                params: void 0 === t.params ? [] : t.params
                            };
                        }),
                        (t.prototype._formatResponse = function(t) {
                            if (void 0 === t.id) throw new Error(o.ERROR_MISSING_ID);
                            if (i.isJsonRpcResponseError(t)) {
                                var e = i.formatRpcError(t.error);
                                return n.__assign(n.__assign({ id: t.id, jsonrpc: '2.0' }, t), {
                                    error: e
                                });
                            }
                            if (i.isJsonRpcResponseSuccess(t))
                                return n.__assign({ id: t.id, jsonrpc: '2.0' }, t);
                            throw new Error(o.ERROR_INVALID_RESPONSE);
                        }),
                        (t.prototype._handleSessionDisconnect = function(t) {
                            var e = t || 'Session Disconnected';
                            this._connected && (this._connected = !1),
                                this._eventManager.trigger({
                                    event: 'disconnect',
                                    params: [{ message: e }]
                                }),
                                this._removeStorageSession(),
                                this._transport.close();
                        }),
                        (t.prototype._handleSessionResponse = function(t, e) {
                            e && e.approved
                                ? (this._connected
                                      ? (e.chainId && (this.chainId = e.chainId),
                                        e.accounts && (this.accounts = e.accounts),
                                        this._eventManager.trigger({
                                            event: 'session_update',
                                            params: [
                                                { chainId: this.chainId, accounts: this.accounts }
                                            ]
                                        }))
                                      : ((this._connected = !0),
                                        e.chainId && (this.chainId = e.chainId),
                                        e.accounts && (this.accounts = e.accounts),
                                        e.peerId && !this.peerId && (this.peerId = e.peerId),
                                        e.peerMeta &&
                                            !this.peerMeta &&
                                            (this.peerMeta = e.peerMeta),
                                        this._eventManager.trigger({
                                            event: 'connect',
                                            params: [
                                                {
                                                    peerId: this.peerId,
                                                    peerMeta: this.peerMeta,
                                                    chainId: this.chainId,
                                                    accounts: this.accounts
                                                }
                                            ]
                                        })),
                                  this._manageStorageSession())
                                : this._handleSessionDisconnect(t);
                        }),
                        (t.prototype._handleIncomingMessages = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e, r;
                                return n.__generator(this, function(n) {
                                    switch (n.label) {
                                        case 0:
                                            if (
                                                ![this.clientId, this.handshakeTopic].includes(
                                                    t.topic
                                                )
                                            )
                                                return [2];
                                            try {
                                                e = JSON.parse(t.payload);
                                            } catch (t) {
                                                return [2];
                                            }
                                            return [4, this._decrypt(e)];
                                        case 1:
                                            return (
                                                (r = n.sent()) && this._eventManager.trigger(r), [2]
                                            );
                                    }
                                });
                            });
                        }),
                        (t.prototype._subscribeToSessionRequest = function() {
                            this._transport.send({
                                topic: '' + this.handshakeTopic,
                                type: 'sub',
                                payload: '',
                                silent: !0
                            });
                        }),
                        (t.prototype._subscribeToResponse = function(t, e) {
                            this.on('response:' + t, e);
                        }),
                        (t.prototype._subscribeToSessionResponse = function(t, e) {
                            var r = this;
                            this._subscribeToResponse(t, function(t, n) {
                                t
                                    ? r._handleSessionResponse(t.message)
                                    : n.result
                                    ? r._handleSessionResponse(e, n.result)
                                    : n.error && n.error.message
                                    ? r._handleSessionResponse(n.error.message)
                                    : r._handleSessionResponse(e);
                            });
                        }),
                        (t.prototype._subscribeToCallResponse = function(t) {
                            var e = this;
                            return new Promise(function(r, n) {
                                e._subscribeToResponse(t, function(t, e) {
                                    t
                                        ? n(t)
                                        : e.result
                                        ? r(e.result)
                                        : e.error && e.error.message
                                        ? n(new Error(e.error.message))
                                        : n(new Error(o.ERROR_INVALID_RESPONSE));
                                });
                            });
                        }),
                        (t.prototype._subscribeToInternalEvents = function() {
                            var t = this;
                            this._transport.on('message', function(e) {
                                return t._handleIncomingMessages(e);
                            }),
                                this._transport.on('open', function() {
                                    return t._eventManager.trigger({
                                        event: 'transport_open',
                                        params: []
                                    });
                                }),
                                this._transport.on('close', function() {
                                    return t._eventManager.trigger({
                                        event: 'transport_close',
                                        params: []
                                    });
                                }),
                                this.on('wc_sessionRequest', function(e, r) {
                                    e &&
                                        t._eventManager.trigger({
                                            event: 'error',
                                            params: [
                                                {
                                                    code: 'SESSION_REQUEST_ERROR',
                                                    message: e.toString()
                                                }
                                            ]
                                        }),
                                        (t.handshakeId = r.id),
                                        (t.peerId = r.params[0].peerId),
                                        (t.peerMeta = r.params[0].peerMeta);
                                    var i = n.__assign(n.__assign({}, r), {
                                        method: 'session_request'
                                    });
                                    t._eventManager.trigger(i);
                                }),
                                this.on('wc_sessionUpdate', function(e, r) {
                                    e && t._handleSessionResponse(e.message),
                                        t._handleSessionResponse(
                                            'Session disconnected',
                                            r.params[0]
                                        );
                                });
                        }),
                        (t.prototype._formatUri = function() {
                            return (
                                this.protocol +
                                ':' +
                                this.handshakeTopic +
                                '@' +
                                this.version +
                                '?bridge=' +
                                encodeURIComponent(this.bridge) +
                                '&key=' +
                                this.key
                            );
                        }),
                        (t.prototype._parseUri = function(t) {
                            var e = i.parseWalletConnectUri(t);
                            if (e.protocol === this.protocol) {
                                if (!e.handshakeTopic)
                                    throw Error(
                                        'Invalid or missing handshakeTopic parameter value'
                                    );
                                var r = e.handshakeTopic;
                                if (!e.bridge)
                                    throw Error('Invalid or missing bridge url parameter value');
                                var n = decodeURIComponent(e.bridge);
                                if (!e.key) throw Error('Invalid or missing kkey parameter value');
                                return { handshakeTopic: r, bridge: n, key: e.key };
                            }
                            throw new Error(o.ERROR_INVALID_URI);
                        }),
                        (t.prototype._generateKey = function() {
                            return n.__awaiter(this, void 0, void 0, function() {
                                return n.__generator(this, function(t) {
                                    switch (t.label) {
                                        case 0:
                                            return this.cryptoLib
                                                ? [4, this.cryptoLib.generateKey()]
                                                : [3, 2];
                                        case 1:
                                            return [2, t.sent()];
                                        case 2:
                                            return [2, null];
                                    }
                                });
                            });
                        }),
                        (t.prototype._encrypt = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e;
                                return n.__generator(this, function(r) {
                                    switch (r.label) {
                                        case 0:
                                            return (
                                                (e = this._key),
                                                this.cryptoLib && e
                                                    ? [4, this.cryptoLib.encrypt(t, e)]
                                                    : [3, 2]
                                            );
                                        case 1:
                                            return [2, r.sent()];
                                        case 2:
                                            return [2, null];
                                    }
                                });
                            });
                        }),
                        (t.prototype._decrypt = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e;
                                return n.__generator(this, function(r) {
                                    switch (r.label) {
                                        case 0:
                                            return (
                                                (e = this._key),
                                                this.cryptoLib && e
                                                    ? [4, this.cryptoLib.decrypt(t, e)]
                                                    : [3, 2]
                                            );
                                        case 1:
                                            return [2, r.sent()];
                                        case 2:
                                            return [2, null];
                                    }
                                });
                            });
                        }),
                        (t.prototype._getStorageSession = function() {
                            var t = null;
                            return this._storage && (t = this._storage.getSession()), t;
                        }),
                        (t.prototype._setStorageSession = function() {
                            this._storage && this._storage.setSession(this.session);
                        }),
                        (t.prototype._removeStorageSession = function() {
                            this._storage && this._storage.removeSession();
                        }),
                        (t.prototype._manageStorageSession = function() {
                            this._connected
                                ? this._setStorageSession()
                                : this._removeStorageSession();
                        }),
                        t
                    );
                })();
            e.default = a;
        },
        function(t, e, r) {
            'use strict';
            Object.defineProperty(e, '__esModule', { value: !0 }),
                (e.ERROR_SESSION_CONNECTED = 'Session currently connected'),
                (e.ERROR_SESSION_DISCONNECTED = 'Session currently disconnected'),
                (e.ERROR_SESSION_REJECTED = 'Session Rejected'),
                (e.ERROR_MISSING_JSON_RPC = 'Missing JSON RPC response'),
                (e.ERROR_MISSING_RESULT = 'JSON-RPC success response must include "result" field'),
                (e.ERROR_MISSING_ERROR = 'JSON-RPC error response must include "error" field'),
                (e.ERROR_MISSING_METHOD = 'JSON RPC request must have valid "method" value'),
                (e.ERROR_MISSING_ID = 'JSON RPC request must have valid "id" value'),
                (e.ERROR_MISSING_REQUIRED =
                    'Missing one of the required parameters: bridge / uri / session'),
                (e.ERROR_INVALID_RESPONSE = 'JSON RPC response format is invalid'),
                (e.ERROR_INVALID_URI = 'URI format is invalid');
        },
        function(t, e, r) {
            'use strict';
            Object.defineProperty(e, '__esModule', { value: !0 });
            var n = r(0),
                i = (function() {
                    function t(t) {
                        if (
                            ((this._events = []),
                            (this._initiating = !1),
                            (this._bridge = ''),
                            (this._socket = null),
                            (this._queue = []),
                            !t.bridge || 'string' != typeof t.bridge)
                        )
                            throw new Error('Missing or invalid bridge field');
                        if (
                            ((this._bridge = t.bridge),
                            !t.clientId || 'string' != typeof t.clientId)
                        )
                            throw new Error('Missing or invalid clientId field');
                        this._clientId = t.clientId;
                    }
                    return (
                        Object.defineProperty(t.prototype, 'readyState', {
                            get: function() {
                                return this._socket ? this._socket.readyState : -1;
                            },
                            set: function(t) {},
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'connecting', {
                            get: function() {
                                return 0 === this.readyState;
                            },
                            set: function(t) {},
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'connected', {
                            get: function() {
                                return 1 === this.readyState;
                            },
                            set: function(t) {},
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'closing', {
                            get: function() {
                                return 2 === this.readyState;
                            },
                            set: function(t) {},
                            enumerable: !0,
                            configurable: !0
                        }),
                        Object.defineProperty(t.prototype, 'closed', {
                            get: function() {
                                return 3 === this.readyState;
                            },
                            set: function(t) {},
                            enumerable: !0,
                            configurable: !0
                        }),
                        (t.prototype.open = function() {
                            this._socketOpen();
                        }),
                        (t.prototype.send = function(t) {
                            this._socketSend(t);
                        }),
                        (t.prototype.close = function() {
                            this._socketClose();
                        }),
                        (t.prototype.on = function(t, e) {
                            this._events.push({ event: t, callback: e });
                        }),
                        (t.prototype._socketOpen = function(t) {
                            var e = this;
                            if ((void 0 === t || t) && !this._initiating) {
                                this._initiating = !0;
                                var r = this._bridge;
                                this._setToQueue({
                                    topic: '' + this._clientId,
                                    type: 'sub',
                                    payload: '',
                                    silent: !0
                                });
                                var n = r.startsWith('https')
                                        ? r.replace('https', 'wss')
                                        : r.startsWith('http')
                                        ? r.replace('http', 'ws')
                                        : r,
                                    i = new WebSocket(n);
                                (i.onmessage = function(t) {
                                    return e._socketReceive(t);
                                }),
                                    (i.onopen = function() {
                                        e._trigger('open'),
                                            e._socketClose(),
                                            (e._initiating = !1),
                                            (e._socket = i),
                                            e._pushQueue();
                                    }),
                                    (i.onclose = function() {
                                        e._trigger('close'), e._socketOpen(!0);
                                    });
                            }
                        }),
                        (t.prototype._socketClose = function() {
                            this._socket &&
                                ((this._socket.onclose = function() {}), this._socket.close());
                        }),
                        (t.prototype._socketSend = function(t) {
                            var e = JSON.stringify(t);
                            this._socket && this.connected
                                ? this._socket.send(e)
                                : (this._setToQueue(t), this._socketOpen());
                        }),
                        (t.prototype._socketReceive = function(t) {
                            return n.__awaiter(this, void 0, void 0, function() {
                                var e;
                                return n.__generator(this, function(r) {
                                    try {
                                        e = JSON.parse(t.data);
                                    } catch (t) {
                                        return [2];
                                    }
                                    return this.connected && this._trigger('message', e), [2];
                                });
                            });
                        }),
                        (t.prototype._setToQueue = function(t) {
                            this._queue.push(t);
                        }),
                        (t.prototype._pushQueue = function() {
                            var t = this;
                            this._queue.forEach(function(e) {
                                return t._socketSend(e);
                            }),
                                (this._queue = []);
                        }),
                        (t.prototype._trigger = function(t, e) {
                            var r = this._events.filter(function(e) {
                                return e.event === t;
                            });
                            r &&
                                r.length &&
                                r.forEach(function(t) {
                                    return t.callback(e);
                                });
                        }),
                        t
                    );
                })();
            e.default = i;
        },
        function(t, e, r) {
            'use strict';
            Object.defineProperty(e, '__esModule', { value: !0 });
            var n = r(1),
                i = (function() {
                    function t() {
                        this._eventEmitters = [];
                    }
                    return (
                        (t.prototype.subscribe = function(t) {
                            this._eventEmitters.push(t);
                        }),
                        (t.prototype.trigger = function(t) {
                            var e,
                                r = [];
                            (e = n.isJsonRpcRequest(t)
                                ? t.method
                                : n.isJsonRpcResponseSuccess(t) || n.isJsonRpcResponseError(t)
                                ? 'response:' + t.id
                                : n.isInternalEvent(t)
                                ? t.event
                                : '') &&
                                (r = this._eventEmitters.filter(function(t) {
                                    return t.event === e;
                                })),
                                (r && r.length) ||
                                    n.isReservedEvent(e) ||
                                    n.isInternalEvent(e) ||
                                    (r = this._eventEmitters.filter(function(t) {
                                        return 'call_request' === t.event;
                                    })),
                                r.forEach(function(e) {
                                    if (n.isJsonRpcResponseError(t)) {
                                        var r = new Error(t.error.message);
                                        e.callback(r, null);
                                    } else e.callback(null, t);
                                });
                        }),
                        t
                    );
                })();
            e.default = i;
        }
    ]);
});
//# sourceMappingURL=index.js.map
