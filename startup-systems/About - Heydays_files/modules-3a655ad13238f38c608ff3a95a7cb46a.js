(function() {
    window.hj = window.hj || function() {
        (window.hj.q = window.hj.q || []).push(arguments)
    };
    hj.exceptions = function() {
        function m() {
            var d = setInterval(function() {
                if ("undefined" !== typeof StackTrace)
                    clearInterval(d), c = "loaded", a();
                else if ("loading" != c) {
                    c = "loading";
                    var b = document.createElement("script");
                    b.src = h;
                    document.getElementsByTagName("head")[0]
                        .appendChild(b)
                }
            }, 10)
        }

        function a(d) {
            d && f.length < p && f.push(d);
            k || (k = !0, d = f.splice(0, 1), l++, l <= p && (b(d[0]),
                setTimeout(function() {
                    k = !1;
                    1 <= f.length && a()
                }, n)))
        }

        function b(a) {
            var d = a.exception,
                b = "",
                h = {
                    scriptversion: hj.scriptVersion,
                    module: a.module,
                    message: d.message ? d.message.toString() : "<unknown>",
                    url: location.href,
                    useragent: navigator.userAgent
                };
            StackTrace.fromError(d, {
                offline: !0
            }).then(function(f) {
                var c = a.module;
                hj.hq.each(f, function(a, d) {
                    b += d.source + "\n";
                    c += d.functionName
                });
                h.errorgroup = hj.md5(c, !0);
                h.errormessagegroup = hj.md5(d.message ? d.message
                    .toString().replace(/\s/g, "") :
                    "<unknown>", !0);
                h.stacktrace = b;
                d.cause && (h.cause = d.cause);
                g(h)
            })
        }

        function g(a) {
            var d = "undefined" !== typeof hj.log ? hj.log.debug :
                function() {},
                b;
            d("Exception occurred", "Exception", a);
            try {
                b = {
                    "http:": 12080,
                    "https:": 12443
                }[location.protocol], hj.hq.ajax({
                    url: "//graylog.hotjar.com:" + b +
                        "/gelf",
                    type: "POST",
                    data: hj.json.stringify(a)
                })
            } catch (h) {
                d("Failed to log exception: " + h, "Exception")
            }
        }
        var d = {},
            h =
            "https://cdn.jsdelivr.net/stacktrace.js/1.0.1/stacktrace-with-polyfills.min.js",
            c = "unloaded",
            f = [],
            p = 10,
            l = 0,
            n = 1E3,
            k = !1;
        d.tryCatch = function(a, b) {
            return function() {
                try {
                    return a.apply(this, arguments)
                } catch (h) {
                    d.log(h, b || "Generic")
                }
            }
        };
        hj.tryCatch = d.tryCatch;
        d.log = function(d, b) {
            var h = {
                module: b || "",
                exception: d
            };
            "loaded" == c ? a(h) : (f.push(h), "unloaded" == c && m())
        };
        d.getQueue = function() {
            return f
        };
        d.getStacktraceJSisLoaded = function() {
            return "loaded" == c
        };
        d.testWithStackTrace = function() {
            try {
                "test".push([])
            } catch (a) {
                hj.exceptions.log(a, "exceptions")
            }
        };
        d.testThrottlingWithStackTrace = function() {
            for (var a = 0; 5 > a; a++) d.testWithStackTrace()
        };
        d.testCallbackWrapper = function() {
            setTimeout(hj.tryCatch(d.testWithStackTrace,
                "Exceptions"), 1E3)
        };
        return d
    }()
})();
try {
    (function(m, a) {
        var b = function(a) {
            return new g(a)
        };
        b.isValidSelector = function(a) {
            try {
                return hj.hq(a), !0
            } catch (b) {
                return !1
            }
        };
        b.isEmptyObject = function(a) {
            return Object.keys(a).length ? !1 : !0
        };
        b.isFunction = function(a) {
            return "function" === typeof a
        };
        b.isWindow = function(a) {
            return a === window
        };
        b.isDocument = function(a) {
            return a === window.document
        };
        b.noop = function() {};
        b.each = function(a, b) {
            var c, f;
            if ("object" === typeof a && "[object Array]" !== Object.prototype
                .toString.call(a))
                if ((f = a[Object.keys(a)[0]]) && void 0 !== f.nodeName)
                    for (c in a) {
                        if (a.hasOwnProperty(c) && "length" !== c && !1 ===
                            b(c, a[c], a)) break
                    } else
                        for (c in a) {
                            if (a.hasOwnProperty(c) && !1 === b(c, a[c],
                                a)) break
                        } else if ("undefined" !== typeof a)
                            for (c = 0; c < a.length && !1 !== b(c, a[c],
                                a); c += 1);
        };
        b.trim = function(a) {
            return "string" === typeof a ? a.replace(/^\s+|\s+$/gm, "") :
                ""
        };
        b.inArray = function(a, b) {
            var c = b.indexOf(a);
            return "undefined" === typeof c || -1 === c ? !1 : !0
        };
        b.indexOf = function(a, b) {
            if ("object" === typeof b) {
                var c = b.indexOf(a);
                return "undefined" !== typeof c ? c : -1
            }
            return -1
        };
        b.ajax = function(a) {
            var h = new XMLHttpRequest;
            a.type = a.type || "GET";
            h.open(a.type, a.url, !0);
            "POST" === a.type && h.setRequestHeader("Content-Type", (a.contentType ?
                    a.contentType :
                    "application/x-www-form-urlencoded") +
                "; charset=UTF-8");
            h.onload = function() {
                200 <= h.status && 400 > h.status ? b.isFunction(a.success) &&
                    a.success(h.responseText && hj.json.parse(h.responseText),
                        h) : b.isFunction(a.error) && a.error(h)
            };
            h.onerror = function() {
                b.isFunction(a.error) && a.error(h)
            };
            b.isFunction(a.requestAnnotator) && a.requestAnnotator(h);
            "POST" === a.type && a.data ? h.send(a.data) : h.send()
        };
        b.get = function(a, b) {
            var c = new XMLHttpRequest;
            c.open("GET", a, !0);
            c.onload = function() {
                200 <= c.status && 400 > c.status && b && b(c.responseText)
            };
            c.send()
        };
        b.eventHandlers = {};
        b.selector = "";
        var g = function(d) {
            var h;
            b.selector = d;
            if (b.isWindow(d)) this[0] = window, this.length = 1;
            else if (b.isDocument(d)) this[0] = a, this.length = 1;
            else if ("object" === typeof d) this[0] = d, this.length =
                1;
            else if ("string" === typeof d && "<" === d.charAt(0) &&
                ">" === d.charAt(d.length - 1) && 3 <= d.length) h = a.createElement(
                    "div"),
                h.innerHTML = d, this[0] = h.childNodes[0], this.length =
                1;
            else if ("string" === typeof d) {
                if (!isNaN(d.charAt(1)) && ("." === d.charAt(0) || "#" ===
                    d.charAt(0))) d = d.charAt(0) + "\\3" + d.charAt(1) +
                    " " + d.slice(2);
                try {
                    h = a.querySelectorAll(d)
                } catch (c) {
                    return this.length = 0, this
                }
                for (d = 0; d < h.length; d += 1) this[d] = h[d];
                this.length = h.length
            }
            return this
        };
        g.prototype.val = function(a) {
            "undefined" !== typeof a && 0 < this.length && (this[0].value =
                a);
            if (void 0 !== this[0]) return this[0] ? this[0].value : ""
        };
        g.prototype.text = function(a) {
            return void 0 === a ? this[0].textContent : this[0].textContent =
                a
        };
        g.prototype.each = function(a, b) {
            Array.prototype.forEach.call(this, function(a, d, p) {
                b(d, a, p)
            })
        };
        g.prototype.append = function(d) {
            var h;
            "object" === typeof d ? "body" === b.selector ? a.body.appendChild(
                    d.get(0)) : this[0].appendChild(d.get(0)) : "body" ===
                b.selector ? (h = a.createElement("div"), h.innerHTML =
                    d, a.body.appendChild(h)) : (h = a.createElement(
                    "div"), h.innerHTML = d, this[0].appendChild(h))
        };
        g.prototype.hasClass = function(a) {
            return this[0].classList ? this[0].classList.contains(a) :
                RegExp("(^| )" + a + "( |$)", "gi").test(this[0].className)
        };
        g.prototype.addClass = function(a) {
            var b;
            for (b = 0; b < this.length; b += 1) this[b].classList ?
                this[b].classList.add(a) : this[b].className += " " + a;
            return this
        };
        g.prototype.removeClass = function(a) {
            var b;
            for (b = 0; b < this.length; b += 1) this[b].classList ?
                this[b].classList.remove(a) : this[b].className = this[
                    b].className.replace(RegExp("(^|\\b)" + a.split(" ")
                    .join("|") + "(\\b|$)", "gi"), " ");
            return this
        };
        g.prototype.toggleClass = function(a) {
            var b;
            for (b = 0; b < this.length; b += 1) this[b].classList ?
                this[b].classList.contains(a) ? this[b].classList.remove(
                    a) : this[b].classList.add(a) : RegExp("(^| )" + a +
                    "( |$)", "gi").test(this[0].className) ? this[b].className =
                this[b].className.replace(RegExp("(^|\\b)" + a.split(
                    " ").join("|") + "(\\b|$)", "gi"), " ") : this[b].className +=
                " " + a;
            return this
        };
        g.prototype.is = function(a) {
            var b;
            a: {
                b = this[0];
                var c = b.matchesSelector || b.msMatchesSelector ||
                    b.mozMatchesSelector || b.webkitMatchesSelector ||
                    b.oMatchesSelector;
                if (c) b = c.call(b, a);
                else {
                    a = b.parentNode.querySelectorAll(a);
                    for (c = a.length; 0 <= c; c -= 1)
                        if (a[c] === b) {
                            b = !0;
                            break a
                        }
                    b = !1
                }
            }
            return b
        };
        g.prototype.remove = function() {
            var a;
            for (a = 0; a < this.length; a += 1) this[a].parentNode.removeChild(
                this[a])
        };
        g.prototype.click = function(b) {
            var h;
            for (h = 0; h < this.length; h += 1) event = a.createEvent(
                    "HTMLEvents"), event.initEvent("click", !0, !1),
                this[h].dispatchEvent(event), b && b()
        };
        g.prototype.trigger = function(b) {
            var h, c = b.split(" "),
                f;
            for (b = 0; b < this.length; b += 1)
                for (h = 0; h < c.length; h += 1) f = a.createEvent(
                    "HTMLEvents"), f.initEvent(c[h], !0, !1), this[
                    b].dispatchEvent(f)
        };
        g.prototype.on = function(d, h, c) {
            var f, p = d.split(" "),
                l, n, k, g, t, r;
            if (b.isDocument(this[0]) && "string" === typeof h)
                for (d = 0; d < p.length; d += 1) "string" === typeof h ?
                    ("boolean" === typeof c && !1 === c && (c =
                        function(a) {
                            a.preventDefault();
                            return !1
                        }), l = h + "." + p[d], n = function(b) {
                        if (k = a.querySelectorAll(h)) {
                            g = b.target;
                            for (t = -1; g && -1 === (t = Array.prototype
                                .indexOf.call(k, g));) g = g.parentElement; -
                            1 < t && c.call(g, b)
                        }
                    }, "array" !== typeof b.eventHandlers[l] && (b.eventHandlers[
                        l] = []), b.eventHandlers[l].push(n), a.addEventListener(
                        p[d].split(".")[0], n, !0)) : ("boolean" ===
                        typeof h && !1 === h && (h = function(a) {
                            a.preventDefault();
                            return !1
                        }), "array" !== typeof b.eventHandlers.document &&
                        (b.eventHandlers.document = []), b.eventHandlers
                        .document.push(h), this[0].addEventListener(p[d]
                            .split(".")[0], h, !1));
            else if (b.isDocument(this[0]))
                for (d = 0; d < p.length; d += 1) "boolean" === typeof h &&
                    !1 === h && (h = function(a) {
                        a.preventDefault();
                        return !1
                    }), l = "document." + p[d], "array" !== typeof b.eventHandlers[
                        l] && (b.eventHandlers[l] = []), b.eventHandlers[
                        l].push(h), a.addEventListener(p[d].split(".")[
                        0], h, !1);
            else if (b.isWindow(this[0]))
                for (d = 0; d < p.length; d += 1) "boolean" === typeof h &&
                    !1 === h && (h = function(a) {
                        a.preventDefault();
                        return !1
                    }), l = "window." + p[d], "array" !== typeof b.eventHandlers[
                        l] && (b.eventHandlers[l] = []), b.eventHandlers[
                        l].push(h), window.addEventListener(p[d].split(
                        ".")[0], h, !1);
            else
                for (f = 0; f < this.length; f += 1)
                    for (d = 0; d < p.length; d += 1) "object" ===
                        typeof h ? (r = h, h = function(a) {
                            a.data = r;
                            c.call(this[f], a)
                        }) : "boolean" === typeof h && !1 === h && (h =
                            function(a) {
                                a.preventDefault();
                                return !1
                            }), l = b.selector + "." + p[d], "array" !==
                        typeof b.eventHandlers[l] && (b.eventHandlers[l] = []),
                        b.eventHandlers[l].push(h), this[f].addEventListener(
                            p[d].split(".")[0], h, !1);
            return this
        };
        g.prototype.off = function(d, h, c) {
            var f, p, l = d.split(" ");
            for (d = 0; d < this.length; d += 1)
                for (f = 0; f < l.length; f += 1)
                    if (b.isDocument(this[d]) && "string" === typeof h)
                        if ("undefined" === typeof c) {
                            if ("object" === typeof b.eventHandlers[h +
                                "." + l[f]])
                                for (p = 0; p < b.eventHandlers[h + "." +
                                    l[f]].length; p += 1) a.removeEventListener(
                                    l[f].split(".")[0], b.eventHandlers[
                                        h + "." + l[f]][p], !0)
                        } else a.removeEventListener(l[f].split(".")[0],
                            c, !1);
            else if (b.isDocument(this[d]))
                if ("undefined" === typeof h) {
                    if ("object" === typeof b.eventHandlers["document." +
                        l[f]])
                        for (p = 0; p < b.eventHandlers["document." + l[
                            f]].length; p += 1) a.removeEventListener(l[
                            f].split(".")[0], b.eventHandlers[
                            "document." + l[f]][p], !1)
                } else a.removeEventListener(l[f].split(".")[0], h, !1);
            else if (b.isWindow(this[d]))
                if ("undefined" === typeof h) {
                    if ("object" === typeof b.eventHandlers["window." +
                        l[f]])
                        for (p = 0; p < b.eventHandlers["window." + l[f]]
                            .length; p += 1) window.removeEventListener(
                            l[f].split(".")[0], b.eventHandlers[
                                "window." + l[f]][p], !1)
                } else window.removeEventListener(l[f].split(".")[0], h, !
                    1);
            else if ("undefined" === typeof h) {
                if ("object" === typeof b.eventHandlers[b.selector +
                    "." + l[f]])
                    for (p = 0; p < b.eventHandlers[b.selector + "." +
                        l[f]].length; p += 1) this[d].removeEventListener(
                        l[f].split(".")[0], b.eventHandlers[b.selector +
                            "." + l[f]][p], !1)
            } else this[d].removeEventListener(l[f].split(".")[0], h, !
                1);
            return this
        };
        g.prototype.scrollTop = function() {
            return window.document.body.scrollTop || window.document.documentElement
                .scrollTop
        };
        g.prototype.height = function() {
            var d;
            return b.isWindow(this[0]) ? a.documentElement.clientHeight :
                9 === this[0].nodeType ? (d = this[0].documentElement,
                    Math.max(this[0].body.scrollHeight, d.scrollHeight,
                        this[0].body.offsetHeight, d.offsetHeight, d.clientHeight
                    )) : Math.max(this[0].scrollHeight, this[0].offsetHeight)
        };
        g.prototype.width = function() {
            var d;
            return b.isWindow(this[0]) ? a.documentElement.clientWidth :
                9 === this[0].nodeType ? (d = this[0].documentElement,
                    Math.max(this[0].body.scrollWidth, d.scrollWidth,
                        this[0].body.offsetWidth, d.offsetWidth, d.clientWidth
                    )) : Math.max(this[0].scrollWidth, this[0].offsetWidth)
        };
        g.prototype.outerHeight = function() {
            return this[0].offsetHeight
        };
        g.prototype.offset = function() {
            var a = (this[0] && this[0].ownerDocument).documentElement;
            return {
                top: this[0].getBoundingClientRect().top + window.pageYOffset -
                    a.clientTop,
                left: this[0].getBoundingClientRect().left + window.pageXOffset -
                    a.clientLeft
            }
        };
        g.prototype.attr = function(a, b) {
            var c;
            if (b || "" === b) {
                for (c = 0; c < this.length; c += 1) this[c].setAttribute(
                    a, b);
                return this
            }
            if ("object" === typeof this[0] && null !== this[0].getAttribute(
                a)) return this[0].getAttribute(a)
        };
        g.prototype.ready = function(d) {
            b.isDocument(this[0]) && ("interactive" === a.readyState ||
                "complete" === a.readyState || "loaded" === a.readyState ?
                d() : a.addEventListener("DOMContentLoaded", d, !1)
            )
        };
        g.prototype.parent = function() {
            return b(this[0].parentNode)
        };
        g.prototype.get = function(a) {
            return this[a]
        };
        g.prototype.show = function() {
            var a;
            for (a = 0; a < this.length; a += 1) this[a].style.display =
                "";
            return this
        };
        g.prototype.hide = function() {
            var a;
            for (a = 0; a < this.length; a += 1) this[a].style.display =
                "none";
            return this
        };
        g.prototype.focus = function() {
            var a;
            for (a = 0; a < this.length; a += 1) this[a].focus();
            return this
        };
        g.prototype.blur = function() {
            var a;
            for (a = 0; a < this.length; a += 1) this[a].blur();
            return this
        };
        g.prototype.clone = function() {
            return this[0].cloneNode(!0)
        };
        g.prototype.removeAttr = function(a) {
            var b;
            for (b = 0; b < this.length; b += 1) this[b].removeAttribute(
                a);
            return this
        };
        g.prototype.find = function(a) {
            var h = b(),
                c;
            try {
                c = this[0].querySelectorAll(a)
            } catch (f) {
                return this.length = 0, this
            }
            for (a = 0; a < c.length; a += 1) h[a] = c[a];
            h.length = c.length;
            return h
        };
        g.prototype.is = function(a) {
            var h, c = !1;
            if (!a || "object" !== typeof this[0]) return !1;
            if ("object" === typeof a) return b(this[0]).get(0) === a.get(
                0);
            if ("string" === typeof a) {
                if (":visible" === a) return !(0 >= this[0].offsetWidth &&
                    0 >= this[0].offsetHeight);
                if (":hidden" === a) return 0 >= this[0].offsetWidth &&
                    0 >= this[0].offsetHeight;
                if (":checked" === a) return this[0].checked;
                if (-1 < a.indexOf("[")) {
                    if (h = /([A-Za-z]+)\[([A-Za-z-]+)\=([A-Za-z]+)\]/g
                        .exec(a), h.length) return b.each(b(this[0]).get(
                            0).attributes, function(a, b) {
                            b.name === h[2] && b.value === h[3] &&
                                (c = !0)
                        }), b(this[0]).get(0).nodeName.toLowerCase() ===
                        h[1] && c
                } else return b(this[0]).get(0).nodeName.toLowerCase() ===
                    a
            }
        };
        g.prototype.css = function(a, b) {
            var c, f;
            for (f = 0; f < this.length; f += 1)
                if ("object" === typeof a)
                    for (c in a) this[f].style[c] = a[c];
                else if ("number" === typeof b || "string" === typeof b)
                this[f].style[a] = b;
            else return getComputedStyle(this[f])[a];
            return this
        };
        g.prototype.animate = function(a, h) {
            var c, f = this;
            "undefined" === typeof h && (h = 400);
            for (c = 0; c < f.length; c += 1) b.each(a, function(a, b) {
                function n(a, b) {
                    a.style[b[0].attribute] = b[0].value;
                    b.shift();
                    b.length ? w = setTimeout(function() {
                        n(a, b)
                    }, 10) : clearTimeout(w)
                }
                b = b.toString();
                var k = parseFloat(getComputedStyle(f[c])[a]) ||
                    0,
                    d = getComputedStyle(f[c])[a].replace(
                        /[0-9.-]/g, ""),
                    g = parseFloat(b),
                    r = b.replace(/[0-9.-]/g, ""),
                    d = d || r,
                    m = g - k,
                    r = parseFloat(h / 10),
                    m = m / r,
                    u = [],
                    s, w;
                for (s = 0; s < r; s += 1) k += m, u.push({
                    attribute: a,
                    value: d ? parseInt(k) + d : parseFloat(
                        k).toFixed(1)
                });
                u.pop();
                u.push({
                    attribute: a,
                    value: g + d
                });
                u.length && n(f[c], u)
            });
            return this
        };
        g.prototype.filter = function(d) {
            return Array.prototype.filter.call(a.querySelectorAll(b.selector),
                function(a, b) {
                    d(b, a)
                })
        };
        m.hj = m.hj || {};
        m.hj.hq = m.hj.hq || b
    })(this, document)
} catch (exception$$4) {
    hj.exceptions.log(exception$$4, "hquery")
}
hj.tryCatch(function() {
    if ("undefined" !== typeof window.MutationObserver || "undefined" !==
        typeof window.WebKitMutationObserver || "undefined" !== typeof window
        .MozMutationObserver) {
        var m = this.__extends || function(a, b) {
                function f() {
                    this.constructor = a
                }
                for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
                f.prototype = b.prototype;
                a.prototype = new f
            },
            a;
        a = "undefined" !== typeof WebKitMutationObserver ?
            WebKitMutationObserver : MutationObserver;
        if (void 0 === a) throw console.error(
                "DOM Mutation Observers are required."), console.error(
                "https://developer.mozilla.org/en-US/docs/DOM/MutationObserver"
            ),
            Error("DOM Mutation Observers are required");
        var b = function() {
                function a() {
                    this.nodes = [];
                    this.values = []
                }
                a.prototype.isIndex = function(a) {
                    return +a === a >>> 0
                };
                a.prototype.nodeId = function(b) {
                    var f = b[a.ID_PROP];
                    f || (f = b[a.ID_PROP] = a.nextId_++);
                    return f
                };
                a.prototype.set = function(a, b) {
                    var f = this.nodeId(a);
                    this.nodes[f] = a;
                    this.values[f] = b
                };
                a.prototype.get = function(a) {
                    a = this.nodeId(a);
                    return this.values[a]
                };
                a.prototype.has = function(a) {
                    return this.nodeId(a) in this.nodes
                };
                a.prototype.deleteNode = function(a) {
                    a = this.nodeId(a);
                    delete this.nodes[a];
                    this.values[a] = void 0
                };
                a.prototype.keys = function() {
                    var a = [],
                        b;
                    for (b in this.nodes) this.isIndex(b) && a.push(
                        this.nodes[b]);
                    return a
                };
                a.ID_PROP = "__hj_mutation_summary_node_map_id__";
                a.nextId_ = 1;
                return a
            }(),
            g;
        (function(a) {
            a[a.STAYED_OUT = 0] = "STAYED_OUT";
            a[a.ENTERED = 1] = "ENTERED";
            a[a.STAYED_IN = 2] = "STAYED_IN";
            a[a.REPARENTED = 3] = "REPARENTED";
            a[a.REORDERED = 4] = "REORDERED";
            a[a.EXITED = 5] = "EXITED"
        })(g || (g = {}));
        var d = function() {
                function a(b, f, c, k, p, l, n, h) {
                    "undefined" === typeof f && (f = !1);
                    "undefined" === typeof c && (c = !1);
                    "undefined" === typeof k && (k = !1);
                    "undefined" === typeof p && (p = null);
                    "undefined" === typeof l && (l = !1);
                    "undefined" === typeof n && (n = null);
                    "undefined" === typeof h && (h = null);
                    this.node = b;
                    this.childList = f;
                    this.attributes = c;
                    this.characterData = k;
                    this.oldParentNode = p;
                    this.added = l;
                    this.attributeOldValues = n;
                    this.characterDataOldValue = h;
                    this.isCaseInsensitive = this.node.nodeType ===
                        Node.ELEMENT_NODE && this.node instanceof HTMLElement &&
                        this.node.ownerDocument instanceof HTMLDocument
                }
                a.prototype.getAttributeOldValue = function(a) {
                    if (this.attributeOldValues) return this.isCaseInsensitive &&
                        (a = a.toLowerCase()), this.attributeOldValues[
                            a]
                };
                a.prototype.getAttributeNamesMutated = function() {
                    var a = [];
                    if (!this.attributeOldValues) return a;
                    for (var b in this.attributeOldValues) a.push(b);
                    return a
                };
                a.prototype.attributeMutated = function(a, b) {
                    this.attributes = !0;
                    this.attributeOldValues = this.attributeOldValues || {};
                    a in this.attributeOldValues || (this.attributeOldValues[
                        a] = b)
                };
                a.prototype.characterDataMutated = function(a) {
                    this.characterData || (this.characterData = !0,
                        this.characterDataOldValue = a)
                };
                a.prototype.removedFromParent = function(a) {
                    this.childList = !0;
                    this.added || this.oldParentNode ? this.added = !
                        1 : this.oldParentNode = a
                };
                a.prototype.insertedIntoParent = function() {
                    this.added = this.childList = !0
                };
                a.prototype.getOldParent = function() {
                    if (this.childList) {
                        if (this.oldParentNode) return this.oldParentNode;
                        if (this.added) return null
                    }
                    return this.node.parentNode
                };
                return a
            }(),
            h = function() {
                return function() {
                    this.added = new b;
                    this.removed = new b;
                    this.maybeMoved = new b;
                    this.oldPrevious = new b;
                    this.moved = void 0
                }
            }(),
            c = function(a) {
                function f(b, c) {
                    a.call(this);
                    this.rootNode = b;
                    this.wasReachableCache = this.reachableCache =
                        void 0;
                    this.anyCharacterDataChanged = this.anyAttributesChanged =
                        this.anyParentsChanged = !1;
                    for (var k = 0; k < c.length; k++) {
                        var p = c[k];
                        switch (p.type) {
                            case "childList":
                                this.anyParentsChanged = !0;
                                for (var l = 0; l < p.removedNodes.length; l++) {
                                    var n = p.removedNodes[l];
                                    this.getChange(n).removedFromParent(
                                        p.target)
                                }
                                for (l = 0; l < p.addedNodes.length; l++)
                                    n = p.addedNodes[l],
                                    this.getChange(n).insertedIntoParent();
                                break;
                            case "attributes":
                                this.anyAttributesChanged = !0;
                                l = this.getChange(p.target);
                                l.attributeMutated(p.attributeName,
                                    p.oldValue);
                                break;
                            case "characterData":
                                this.anyCharacterDataChanged = !0,
                                    l = this.getChange(p.target), l
                                    .characterDataMutated(p.oldValue)
                        }
                    }
                }
                m(f, a);
                f.prototype.getChange = function(a) {
                    var b = this.get(a);
                    b || (b = new d(a), this.set(a, b));
                    return b
                };
                f.prototype.getOldParent = function(a) {
                    var b = this.get(a);
                    return b ? b.getOldParent() : a.parentNode
                };
                f.prototype.getIsReachable = function(a) {
                    if (a === this.rootNode) return !0;
                    if (!a) return !1;
                    this.reachableCache = this.reachableCache ||
                        new b;
                    var f = this.reachableCache.get(a);
                    void 0 === f && (f = this.getIsReachable(a.parentNode),
                        this.reachableCache.set(a, f));
                    return f
                };
                f.prototype.getWasReachable = function(a) {
                    if (a === this.rootNode) return !0;
                    if (!a) return !1;
                    this.wasReachableCache = this.wasReachableCache ||
                        new b;
                    var f = this.wasReachableCache.get(a);
                    void 0 === f && (f = this.getWasReachable(this.getOldParent(
                        a)), this.wasReachableCache.set(a,
                        f));
                    return f
                };
                f.prototype.reachabilityChange = function(a) {
                    return this.getIsReachable(a) ? this.getWasReachable(
                            a) ? 2 : 1 : this.getWasReachable(a) ?
                        5 : 0
                };
                return f
            }(b),
            f = function() {
                function a(f, k, p, l, n) {
                    this.rootNode = f;
                    this.mutations = k;
                    this.selectors = p;
                    this.calcReordered = l;
                    this.calcOldPreviousSibling = n;
                    this.treeChanges = new c(f, k);
                    this.entered = [];
                    this.exited = [];
                    this.stayedIn = new b;
                    this.visited = new b;
                    this.matchCache = this.characterDataOnly = this
                        .childListChangeMap = void 0;
                    this.processMutations()
                }
                a.prototype.processMutations = function() {
                    if (this.treeChanges.anyParentsChanged || this.treeChanges
                        .anyAttributesChanged)
                        for (var a = this.treeChanges.keys(), b = 0; b <
                            a.length; b++) this.visitNode(a[b],
                            void 0)
                };
                a.prototype.visitNode = function(a, b) {
                    if (!this.visited.has(a)) {
                        this.visited.set(a, !0);
                        var f = this.treeChanges.get(a),
                            c = b;
                        if (f && f.childList || void 0 == c) c =
                            this.treeChanges.reachabilityChange(a);
                        if (0 !== c) {
                            this.matchabilityChange(a);
                            if (1 === c) this.entered.push(a);
                            else if (5 === c) this.exited.push(a),
                                this.ensureHasOldPreviousSiblingIfNeeded(
                                    a);
                            else if (2 === c) {
                                var k = 2;
                                f && f.childList && (f.oldParentNode !==
                                    a.parentNode ? (k = 3, this
                                        .ensureHasOldPreviousSiblingIfNeeded(
                                            a)) : this.calcReordered &&
                                    this.wasReordered(a) && (k =
                                        4));
                                this.stayedIn.set(a, k)
                            }
                            if (2 !== c)
                                for (f = a.firstChild; f; f = f.nextSibling)
                                    this.visitNode(f, c)
                        }
                    }
                };
                a.prototype.ensureHasOldPreviousSiblingIfNeeded =
                    function(a) {
                        if (this.calcOldPreviousSibling) {
                            this.processChildlistChanges();
                            var b = a.parentNode,
                                f = this.treeChanges.get(a);
                            f && f.oldParentNode && (b = f.oldParentNode);
                            (f = this.childListChangeMap.get(b)) || (f =
                                new h, this.childListChangeMap.set(b, f)
                            );
                            f.oldPrevious.has(a) || f.oldPrevious.set(a,
                                a.previousSibling)
                        }
                    };
                a.prototype.getChanged = function(a, b, f) {
                    this.selectors = b;
                    this.characterDataOnly = f;
                    for (b = 0; b < this.entered.length; b++) {
                        f = this.entered[b];
                        var c = this.matchabilityChange(f);
                        (1 === c || 2 === c) && a.added.push(f)
                    }
                    var k = this.stayedIn.keys();
                    for (b = 0; b < k.length; b++)
                        if (f = k[b], c = this.matchabilityChange(f),
                            1 === c) a.added.push(f);
                        else if (5 === c) a.removed.push(f);
                    else if (2 === c && (a.reparented || a.reordered))
                        c = this.stayedIn.get(f), a.reparented && 3 ===
                        c ? a.reparented.push(f) : a.reordered && 4 ===
                        c && a.reordered.push(f);
                    for (b = 0; b < this.exited.length; b++) f =
                        this.exited[b], c = this.matchabilityChange(
                            f), (5 === c || 2 === c) && a.removed.push(
                            f)
                };
                a.prototype.getOldParentNode = function(a) {
                    var b = this.treeChanges.get(a);
                    if (b && b.childList) return b.oldParentNode ?
                        b.oldParentNode : null;
                    b = this.treeChanges.reachabilityChange(a);
                    if (0 === b || 1 === b) throw Error(
                        "getOldParentNode requested on invalid node."
                    );
                    return a.parentNode
                };
                a.prototype.getOldPreviousSibling = function(a) {
                    var b = a.parentNode,
                        f = this.treeChanges.get(a);
                    f && f.oldParentNode && (b = f.oldParentNode);
                    b = this.childListChangeMap.get(b);
                    if (!b) throw Error(
                        "getOldPreviousSibling requested on invalid node."
                    );
                    return b.oldPrevious.get(a)
                };
                a.prototype.getOldAttribute = function(a, b) {
                    var f = this.treeChanges.get(a);
                    if (!f || !f.attributes) throw Error(
                        "getOldAttribute requested on invalid node."
                    );
                    f = f.getAttributeOldValue(b);
                    if (void 0 === f) throw Error(
                        "getOldAttribute requested for unchanged attribute name."
                    );
                    return f
                };
                a.prototype.attributeChangedNodes = function(a) {
                    if (!this.treeChanges.anyAttributesChanged)
                        return {};
                    var b, f;
                    if (a) {
                        b = {};
                        f = {};
                        for (var c = 0; c < a.length; c++) {
                            var k = a[c];
                            b[k] = !0;
                            f[k.toLowerCase()] = k
                        }
                    }
                    a = {};
                    for (var p = this.treeChanges.keys(), c = 0; c <
                        p.length; c++) {
                        var k = p[c],
                            l = this.treeChanges.get(k);
                        if (l.attributes && !(2 !== this.treeChanges
                            .reachabilityChange(k) || 2 !==
                            this.matchabilityChange(k)))
                            for (var n = k, h = l.getAttributeNamesMutated(),
                                d = 0; d < h.length; d++)
                                if (k = h[d], (!b || b[k] || l.isCaseInsensitive &&
                                    f[k]) && l.getAttributeOldValue(
                                    k) !== n.getAttribute(k)) f &&
                                    l.isCaseInsensitive && (k = f[k]),
                                    a[k] = a[k] || [], a[k].push(n)
                    }
                    return a
                };
                a.prototype.getOldCharacterData = function(a) {
                    a = this.treeChanges.get(a);
                    if (!a || !a.characterData) throw Error(
                        "getOldCharacterData requested on invalid node."
                    );
                    return a.characterDataOldValue
                };
                a.prototype.getCharacterDataChanged = function() {
                    if (!this.treeChanges.anyCharacterDataChanged)
                        return [];
                    for (var a = this.treeChanges.keys(), b = [], f =
                        0; f < a.length; f++) {
                        var c = a[f];
                        if (2 === this.treeChanges.reachabilityChange(
                            c)) {
                            var k = this.treeChanges.get(c);
                            k.characterData && c.textContent != k.characterDataOldValue &&
                                b.push(c)
                        }
                    }
                    return b
                };
                a.prototype.computeMatchabilityChange = function(a, f) {
                    this.matchCache || (this.matchCache = []);
                    this.matchCache[a.uid] || (this.matchCache[a.uid] =
                        new b);
                    var c = this.matchCache[a.uid],
                        k = c.get(f);
                    void 0 === k && (k = a.matchabilityChange(f,
                        this.treeChanges.get(f)), c.set(f,
                        k));
                    return k
                };
                a.prototype.matchabilityChange = function(a) {
                    var b = this;
                    if (this.characterDataOnly) switch (a.nodeType) {
                        case Node.COMMENT_NODE:
                        case Node.TEXT_NODE:
                            return 2;
                        default:
                            return 0
                    }
                    if (!this.selectors) return 2;
                    if (a.nodeType !== Node.ELEMENT_NODE) return 0;
                    for (var f = this.selectors.map(function(f) {
                        return b.computeMatchabilityChange(
                            f, a)
                    }), c = 0, k = 0; 2 !== c && k < f.length;) {
                        switch (f[k]) {
                            case 2:
                                c = 2;
                                break;
                            case 1:
                                c = 5 === c ? 2 : 1;
                                break;
                            case 5:
                                c = 1 === c ? 2 : 5
                        }
                        k++
                    }
                    return c
                };
                a.prototype.getChildlistChange = function(a) {
                    var b = this.childListChangeMap.get(a);
                    b || (b = new h, this.childListChangeMap.set(a,
                        b));
                    return b
                };
                a.prototype.processChildlistChanges = function() {
                    if (!this.childListChangeMap) {
                        this.childListChangeMap = new b;
                        for (var a = 0; a < this.mutations.length; a++) {
                            var f = this.mutations[a];
                            if ("childList" == f.type && (2 ===
                                this.treeChanges.reachabilityChange(
                                    f.target) || this.calcOldPreviousSibling
                            )) {
                                for (var c = this.getChildlistChange(
                                            f.target), k = f.previousSibling,
                                        p = function(a, b) {
                                            a && !c.oldPrevious.has(
                                                    a) && !c.added.has(
                                                    a) && !c.maybeMoved
                                                .has(a) && (!b || !
                                                    c.added.has(b) &&
                                                    !c.maybeMoved.has(
                                                        b)) && c.oldPrevious
                                                .set(a, b)
                                        }, l = 0; l < f.removedNodes
                                    .length; l++) {
                                    var n = f.removedNodes[l];
                                    p(n, k);
                                    c.added.has(n) ? c.added.deleteNode(
                                        n) : (c.removed.set(n, !
                                        0), c.maybeMoved.deleteNode(
                                        n));
                                    k = n
                                }
                                p(f.nextSibling, k);
                                for (l = 0; l < f.addedNodes.length; l++)
                                    n = f.addedNodes[l], c.removed.has(
                                        n) ? (c.removed.deleteNode(
                                        n), c.maybeMoved.set(n, !
                                        0)) : c.added.set(n, !0)
                            }
                        }
                    }
                };
                a.prototype.wasReordered = function(a) {
                    function f(a) {
                        if (!a || !l.maybeMoved.has(a)) return !
                            1;
                        var b = l.moved.get(a);
                        if (void 0 !== b) return b;
                        if (n.has(a)) b = !0;
                        else {
                            n.set(a, !0);
                            if (d.has(a)) b = d.get(a);
                            else {
                                for (b = a.previousSibling; b &&
                                    (l.added.has(b) || f(b));) b =
                                    b.previousSibling;
                                d.set(a, b)
                            }
                            b = b !== c(a)
                        }
                        n.has(a) ? (n.deleteNode(a), l.moved.set(
                            a, b)) : b = l.moved.get(a);
                        return b
                    }

                    function c(a) {
                        var b = h.get(a);
                        if (void 0 !== b) return b;
                        for (b = l.oldPrevious.get(a); b && (l.removed
                            .has(b) || f(b));) b = c(b);
                        void 0 === b && (b = a.previousSibling);
                        h.set(a, b);
                        return b
                    }
                    if (!this.treeChanges.anyParentsChanged) return
                        !1;
                    this.processChildlistChanges();
                    var k = a.parentNode,
                        p = this.treeChanges.get(a);
                    p && p.oldParentNode && (k = p.oldParentNode);
                    var l = this.childListChangeMap.get(k);
                    if (!l) return !1;
                    if (l.moved) return l.moved.get(a);
                    l.moved = new b;
                    var n = new b,
                        h = new b,
                        d = new b;
                    l.maybeMoved.keys().forEach(f);
                    return l.moved.get(a)
                };
                return a
            }(),
            p = function() {
                function a(b, f) {
                    var c = this;
                    this.projection = b;
                    this.added = [];
                    this.removed = [];
                    this.reparented = f.all || f.element || f.characterData ? [] :
                        void 0;
                    this.reordered = f.all ? [] : void 0;
                    b.getChanged(this, f.elementFilter, f.characterData);
                    if (f.all || f.attribute || f.attributeList) {
                        var k = b.attributeChangedNodes(f.attribute ? [
                            f.attribute
                        ] : f.attributeList);
                        f.attribute ? this.valueChanged = k[f.attribute] || [] :
                            (this.attributeChanged = k, f.attributeList &&
                                f.attributeList.forEach(function(a) {
                                    c.attributeChanged.hasOwnProperty(
                                        a) || (c.attributeChanged[
                                        a] = [])
                                }))
                    }
                    if (f.all || f.characterData) k = b.getCharacterDataChanged(),
                        f.characterData ? this.valueChanged = k :
                        this.characterDataChanged = k;
                    this.reordered && (this.getOldPreviousSibling =
                        b.getOldPreviousSibling.bind(b))
                }
                a.prototype.getOldParentNode = function(a) {
                    return this.projection.getOldParentNode(a)
                };
                a.prototype.getOldAttribute = function(a, b) {
                    return this.projection.getOldAttribute(a, b)
                };
                a.prototype.getOldCharacterData = function(a) {
                    return this.projection.getOldCharacterData(a)
                };
                a.prototype.getOldPreviousSibling = function(a) {
                    return this.projection.getOldPreviousSibling(a)
                };
                return a
            }(),
            l = /[a-zA-Z_]+/,
            n = /[a-zA-Z0-9_\-]+/,
            k = function() {
                function a() {}
                a.prototype.matches = function(a) {
                    if (null === a) return !1;
                    if (void 0 === this.attrValue) return !0;
                    if (!this.contains) return this.attrValue == a;
                    a = a.split(" ");
                    for (var b = 0; b < a.length; b++)
                        if (this.attrValue === a[b]) return !0;
                    return !1
                };
                a.prototype.toString = function() {
                    return "class" === this.attrName && this.contains ?
                        "." + this.attrValue : "id" === this.attrName &&
                        !this.contains ? "#" + this.attrValue :
                        this.contains ? "[" + this.attrName + "~=" +
                        ('"' + this.attrValue.replace(/"/, '\\"') +
                            '"') + "]" : "attrValue" in this ? "[" +
                        this.attrName + "=" + ('"' + this.attrValue
                            .replace(/"/, '\\"') + '"') + "]" : "[" +
                        this.attrName + "]"
                };
                return a
            }(),
            q = function() {
                function a() {
                    this.uid = a.nextUid++;
                    this.qualifiers = []
                }
                Object.defineProperty(a.prototype,
                    "caseInsensitiveTagName", {
                        get: function() {
                            return this.tagName.toUpperCase()
                        },
                        enumerable: !0,
                        configurable: !0
                    });
                Object.defineProperty(a.prototype, "selectorString", {
                    get: function() {
                        return this.tagName + this.qualifiers
                            .join("")
                    },
                    enumerable: !0,
                    configurable: !0
                });
                a.prototype.isMatching = function(b) {
                    return b[a.matchesSelector](this.selectorString)
                };
                a.prototype.wasMatching = function(a, b, f) {
                    if (!b || !b.attributes) return f;
                    var c = b.isCaseInsensitive ? this.caseInsensitiveTagName :
                        this.tagName;
                    if ("*" !== c && c !== a.tagName) return !1;
                    for (var c = [], k = !1, l = 0; l < this.qualifiers
                        .length; l++) {
                        var p = this.qualifiers[l],
                            n = b.getAttributeOldValue(p.attrName);
                        c.push(n);
                        k = k || void 0 !== n
                    }
                    if (!k) return f;
                    for (l = 0; l < this.qualifiers.length; l++)
                        if (p = this.qualifiers[l], n = c[l], void 0 ===
                            n && (n = a.getAttribute(p.attrName)), !
                            p.matches(n)) return !1;
                    return !0
                };
                a.prototype.matchabilityChange = function(a, b) {
                    var f = this.isMatching(a);
                    return f ? this.wasMatching(a, b, f) ? 2 : 1 :
                        this.wasMatching(a, b, f) ? 5 : 0
                };
                a.parseSelectors = function(b) {
                    function f() {
                        h && (d && (h.qualifiers.push(d), d =
                            void 0), p.push(h));
                        h = new a
                    }

                    function c() {
                        d && h.qualifiers.push(d);
                        d = new k
                    }
                    for (var p = [], h, d, g = /\s/, q, r = 1, t =
                        0; t < b.length;) {
                        var m = b[t++];
                        switch (r) {
                            case 1:
                                if (m.match(l)) {
                                    f();
                                    h.tagName = m;
                                    r = 2;
                                    break
                                }
                                if ("*" == m) {
                                    f();
                                    h.tagName = "*";
                                    r = 3;
                                    break
                                }
                                if ("." == m) {
                                    f();
                                    c();
                                    h.tagName = "*";
                                    d.attrName = "class";
                                    d.contains = !0;
                                    r = 4;
                                    break
                                }
                                if ("#" == m) {
                                    f();
                                    c();
                                    h.tagName = "*";
                                    d.attrName = "id";
                                    r = 4;
                                    break
                                }
                                if ("[" == m) {
                                    f();
                                    c();
                                    h.tagName = "*";
                                    d.attrName = "";
                                    r = 6;
                                    break
                                }
                                if (m.match(g)) break;
                                throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                            case 2:
                                if (m.match(n)) {
                                    h.tagName += m;
                                    break
                                }
                                if ("." == m) {
                                    c();
                                    d.attrName = "class";
                                    d.contains = !0;
                                    r = 4;
                                    break
                                }
                                if ("#" == m) {
                                    c();
                                    d.attrName = "id";
                                    r = 4;
                                    break
                                }
                                if ("[" == m) {
                                    c();
                                    d.attrName = "";
                                    r = 6;
                                    break
                                }
                                if (m.match(g)) {
                                    r = 14;
                                    break
                                }
                                if ("," == m) {
                                    r = 1;
                                    break
                                }
                                throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                            case 3:
                                if ("." == m) {
                                    c();
                                    d.attrName = "class";
                                    d.contains = !0;
                                    r = 4;
                                    break
                                }
                                if ("#" == m) {
                                    c();
                                    d.attrName = "id";
                                    r = 4;
                                    break
                                }
                                if ("[" == m) {
                                    c();
                                    d.attrName = "";
                                    r = 6;
                                    break
                                }
                                if (m.match(g)) {
                                    r = 14;
                                    break
                                }
                                if ("," == m) {
                                    r = 1;
                                    break
                                }
                                throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                            case 4:
                                if (m.match(l)) {
                                    d.attrValue = m;
                                    r = 5;
                                    break
                                }
                                throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                            case 5:
                                if (m.match(n)) {
                                    d.attrValue += m;
                                    break
                                }
                                if ("." == m) {
                                    c();
                                    d.attrName = "class";
                                    d.contains = !0;
                                    r = 4;
                                    break
                                }
                                if ("#" == m) {
                                    c();
                                    d.attrName = "id";
                                    r = 4;
                                    break
                                }
                                if ("[" == m) {
                                    c();
                                    r = 6;
                                    break
                                }
                                if (m.match(g)) {
                                    r = 14;
                                    break
                                }
                                if ("," == m) {
                                    r = 1;
                                    break
                                }
                                throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                            case 6:
                                if (m.match(l)) {
                                    d.attrName = m;
                                    r = 7;
                                    break
                                }
                                if (m.match(g)) break;
                                throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                            case 7:
                                if (m.match(n)) {
                                    d.attrName += m;
                                    break
                                }
                                if (m.match(g)) {
                                    r = 8;
                                    break
                                }
                                if ("~" == m) {
                                    d.contains = !0;
                                    r = 9;
                                    break
                                }
                                if ("=" == m) {
                                    d.attrValue = "";
                                    r = 11;
                                    break
                                }
                                if ("]" == m) {
                                    r = 3;
                                    break
                                }
                                throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                            case 8:
                                if ("~" == m) {
                                    d.contains = !0;
                                    r = 9;
                                    break
                                }
                                if ("=" == m) {
                                    d.attrValue = "";
                                    r = 11;
                                    break
                                }
                                if ("]" == m) {
                                    r = 3;
                                    break
                                }
                                if (m.match(g)) break;
                                throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                            case 9:
                                if ("=" == m) {
                                    d.attrValue = "";
                                    r = 11;
                                    break
                                }
                                throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                            case 10:
                                if ("]" == m) {
                                    r = 3;
                                    break
                                }
                                if (m.match(g)) break;
                                throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                            case 11:
                                if (m.match(g)) break;
                                if ('"' == m || "'" == m) {
                                    q = m;
                                    r = 13;
                                    break
                                }
                                d.attrValue += m;
                                r = 12;
                                break;
                            case 12:
                                if (m.match(g)) {
                                    r = 10;
                                    break
                                }
                                if ("]" == m) {
                                    r = 3;
                                    break
                                }
                                if ("'" == m || '"' == m) throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                                d.attrValue += m;
                                break;
                            case 13:
                                if (m == q) {
                                    r = 10;
                                    break
                                }
                                d.attrValue += m;
                                break;
                            case 14:
                                if (m.match(g)) break;
                                if ("," == m) {
                                    r = 1;
                                    break
                                }
                                throw Error(
                                    "Invalid or unsupported selector syntax."
                                );
                        }
                    }
                    switch (r) {
                        case 1:
                        case 2:
                        case 3:
                        case 5:
                        case 14:
                            f();
                            break;
                        default:
                            throw Error(
                                "Invalid or unsupported selector syntax."
                            );
                    }
                    if (!p.length) throw Error(
                        "Invalid or unsupported selector syntax."
                    );
                    return p
                };
                a.nextUid = 1;
                a.matchesSelector = function() {
                    var a = document.createElement("div");
                    return "function" === typeof a.webkitMatchesSelector ?
                        "webkitMatchesSelector" : "function" ===
                        typeof a.mozMatchesSelector ?
                        "mozMatchesSelector" : "function" ===
                        typeof a.msMatchesSelector ?
                        "msMatchesSelector" : "matchesSelector"
                }();
                return a
            }(),
            t = /^([a-zA-Z:_]+[a-zA-Z0-9_\-:\.]*)$/,
            r = function(a) {
                if ("string" != typeof a) throw Error(
                    "Invalid request option. attribute must be a non-zero length string."
                );
                a = a.trim();
                if (!a) throw Error(
                    "Invalid request option. attribute must be a non-zero length string."
                );
                if (!a.match(t)) throw Error(
                    "Invalid request option. invalid attribute name: " +
                    a);
                return a
            },
            v = function(a) {
                var b = {};
                a.forEach(function(a) {
                    a.qualifiers.forEach(function(a) {
                        b[a.attrName] = !0
                    })
                });
                return Object.keys(b)
            };
        hj.MutationSummary = function() {
            function c(b) {
                var f = this;
                this.connected = !1;
                this.options = c.validateOptions(b);
                this.observerOptions = c.createObserverOptions(
                    this.options.queries);
                this.root = this.options.rootNode;
                this.callback = this.options.callback;
                this.elementFilter = Array.prototype.concat.apply(
                    [], this.options.queries.map(function(a) {
                        return a.elementFilter ? a.elementFilter : []
                    }));
                this.elementFilter.length || (this.elementFilter =
                    void 0);
                this.calcReordered = this.options.queries.some(
                    function(a) {
                        return a.all
                    });
                this.queryValidators = [];
                c.createQueryValidator && (this.queryValidators =
                    this.options.queries.map(function(a) {
                        return c.createQueryValidator(f
                            .root, a)
                    }));
                this.observer = new a(function(a) {
                    f.observerCallback(a)
                });
                this.reconnect()
            }
            c.createObserverOptions = function(a) {
                function b(a) {
                    if (!f.attributes || c) f.attributes = !
                        0, f.attributeOldValue = !0, a ? (c =
                            c || {}, a.forEach(function(a) {
                                c[a] = !0;
                                c[a.toLowerCase()] = !0
                            })) : c = void 0
                }
                var f = {
                        childList: !0,
                        subtree: !0
                    },
                    c;
                a.forEach(function(a) {
                    a.characterData ? (f.characterData = !
                        0, f.characterDataOldValue = !
                        0) : a.all ? (b(), f.characterData = !
                        0, f.characterDataOldValue = !
                        0) : a.attribute ? b([a.attribute
                        .trim()
                    ]) : (a = v(a.elementFilter).concat(
                            a.attributeList || []),
                        a.length && b(a))
                });
                c && (f.attributeFilter = Object.keys(c));
                return f
            };
            c.validateOptions = function(a) {
                for (var b in a)
                    if (!(b in c.optionKeys)) throw Error(
                        "Invalid option: " + b);
                if ("function" !== typeof a.callback) throw Error(
                    "Invalid options: callback is required and must be a function"
                );
                if (!a.queries || !a.queries.length) throw Error(
                    "Invalid options: queries must contain at least one query request object."
                );
                b = {
                    callback: a.callback,
                    rootNode: a.rootNode || document,
                    observeOwnChanges: !!a.observeOwnChanges,
                    oldPreviousSibling: !!a.oldPreviousSibling,
                    queries: []
                };
                for (var f = 0; f < a.queries.length; f++) {
                    var k = a.queries[f];
                    if (k.all) {
                        if (1 < Object.keys(k).length) throw Error(
                            "Invalid request option. all has no options."
                        );
                        b.queries.push({
                            all: !0
                        })
                    } else if ("attribute" in k) {
                        var l = {
                            attribute: r(k.attribute)
                        };
                        l.elementFilter = q.parseSelectors("*[" +
                            l.attribute + "]");
                        if (1 < Object.keys(k).length) throw Error(
                            "Invalid request option. attribute has no options."
                        );
                        b.queries.push(l)
                    } else if ("element" in k) {
                        var p = Object.keys(k).length,
                            l = {
                                element: k.element,
                                elementFilter: q.parseSelectors(
                                    k.element)
                            };
                        if (k.hasOwnProperty(
                            "elementAttributes")) {
                            var n = l,
                                k = k.elementAttributes;
                            if (!k.trim().length) throw Error(
                                "Invalid request option: elementAttributes must contain at least one attribute."
                            );
                            for (var d = {}, h = {}, k = k.split(
                                /\s+/), g = 0; g < k.length; g++) {
                                var m = k[g];
                                if (m) {
                                    var m = r(m),
                                        t = m.toLowerCase();
                                    if (d[t]) throw Error(
                                        "Invalid request option: observing multiple case variations of the same attribute is not supported."
                                    );
                                    h[m] = !0;
                                    d[t] = !0
                                }
                            }
                            k = Object.keys(h);
                            n.attributeList = k;
                            p--
                        }
                        if (1 < p) throw Error(
                            "Invalid request option. element only allows elementAttributes option."
                        );
                        b.queries.push(l)
                    } else if (k.characterData) {
                        if (1 < Object.keys(k).length) throw Error(
                            "Invalid request option. characterData has no options."
                        );
                        b.queries.push({
                            characterData: !0
                        })
                    } else throw Error(
                        "Invalid request option. Unknown query request."
                    );
                }
                return b
            };
            c.prototype.createSummaries = function(a) {
                if (!a || !a.length) return [];
                a = new f(this.root, a, this.elementFilter,
                    this.calcReordered, this.options.oldPreviousSibling
                );
                for (var b = [], c = 0; c < this.options.queries
                    .length; c++) b.push(new p(a, this.options.queries[
                    c]));
                return b
            };
            c.prototype.checkpointQueryValidators = function() {
                this.queryValidators.forEach(function(a) {
                    a && a.recordPreviousState()
                })
            };
            c.prototype.runQueryValidators = function(a) {
                this.queryValidators.forEach(function(b, f) {
                    b && b.validate(a[f])
                })
            };
            c.prototype.changesToReport = function(a) {
                return a.some(function(a) {
                    return
                        "added removed reordered reparented valueChanged characterDataChanged"
                        .split(" ").some(function(b) {
                            return a[b] && a[b].length
                        }) || a.attributeChanged &&
                        Object.keys(a.attributeChanged)
                        .some(function(b) {
                            return !!a.attributeChanged[
                                b].length
                        }) ? !0 : !1
                })
            };
            c.prototype.observerCallback = function(a) {
                this.options.observeOwnChanges || this.observer
                    .disconnect();
                a = this.createSummaries(a);
                this.runQueryValidators(a);
                this.options.observeOwnChanges && this.checkpointQueryValidators();
                this.changesToReport(a) && this.callback(a);
                !this.options.observeOwnChanges && this.connected &&
                    (this.checkpointQueryValidators(), this.observer
                        .observe(this.root, this.observerOptions)
                    )
            };
            c.prototype.reconnect = function() {
                if (this.connected) throw Error(
                    "Already connected");
                this.observer.observe(this.root, this.observerOptions);
                this.connected = !0;
                this.checkpointQueryValidators()
            };
            c.prototype.takeSummaries = function() {
                if (!this.connected) throw Error(
                    "Not connected");
                var a = this.createSummaries(this.observer.takeRecords());
                return this.changesToReport(a) ? a : void 0
            };
            c.prototype.disconnect = function() {
                var a = this.takeSummaries();
                this.observer.disconnect();
                this.connected = !1;
                return a
            };
            c.NodeMap = b;
            c.parseElementFilter = q.parseSelectors;
            c.optionKeys = {
                callback: !0,
                queries: !0,
                rootNode: !0,
                oldPreviousSibling: !0,
                observeOwnChanges: !0
            };
            return c
        }()
    }
}, "mutation-summary")();
hj.tryCatch(function() {
    if ("undefined" !== typeof window.MutationObserver || "undefined" !==
        typeof window.WebKitMutationObserver || "undefined" !== typeof window
        .MozMutationObserver) hj.treeMirrorClient = hj.tryCatch(
        function() {
            function m(a, b, g) {
                var d = this;
                this.target = a;
                this.mirror = b;
                this.nextId = 1;
                this.knownNodes = new hj.MutationSummary.NodeMap;
                b = this.serializeNode(a).id;
                for (var h = [], c = a.firstChild; c; c = c.nextSibling)
                    h.push(this.serializeNode(c, !0));
                this.mirror.initialize(b, h);
                b = [{
                    all: !0
                }];
                g && (b = b.concat(g));
                this.mutationSummary = new hj.MutationSummary({
                    rootNode: a,
                    callback: hj.tryCatch(function(a) {
                        d.applyChanged(a)
                    }, "TreeMirror"),
                    queries: b
                })
            }
            m.prototype.disconnect = function() {
                this.mutationSummary && (this.mutationSummary.disconnect(),
                    this.mutationSummary = void 0)
            };
            m.prototype.rememberNode = function(a) {
                var b = this.nextId++;
                this.knownNodes.set(a, b);
                return b
            };
            m.prototype.forgetNode = function(a) {
                this.knownNodes.deleteNode(a)
            };
            m.prototype.serializeNode = function(a, b, g) {
                if (null === a) return null;
                var d = this.knownNodes.get(a),
                    h = a.parentNode ? a.parentNode : null;
                if (void 0 !== d) return {
                    id: d
                };
                for (d = {
                    nodeType: a.nodeType,
                    id: this.rememberNode(a)
                }; h && !g;) h.attributes && h.attributes[
                        "data-hj-masked"] && (g = !0), h = h.parentNode ?
                    h.parentNode : null;
                switch (d.nodeType) {
                    case Node.DOCUMENT_TYPE_NODE:
                        d.name = a.name;
                        d.publicId = a.publicId;
                        d.systemId = a.systemId;
                        break;
                    case Node.COMMENT_NODE:
                    case Node.TEXT_NODE:
                        d.textContent = "undefined" !== typeof a
                            .parentNode && null != a.parentNode &&
                            ("TEXTAREA" === a.parentNode.tagName &&
                                !hj.settings.recording_capture_keystrokes ||
                                "undefined" !== typeof a.parentNode
                                .attributes && null != a.parentNode
                                .attributes && "undefined" !==
                                typeof a.parentNode.attributes[
                                    "data-hj-masked"] || g) ?
                            hj.hq.trim(a.textContent).replace(
                                /./g, "*") : a.textContent;
                        break;
                    case Node.ELEMENT_NODE:
                        d.tagName = a.tagName;
                        d.attributes = {};
                        for (var c, h = 0; h < a.attributes.length; h++)
                            c = a.attributes[h], e = "INPUT" ===
                            a.tagName && "value" === c.name &&
                            (!hj.settings.recording_capture_keystrokes ||
                                "undefined" !== typeof a.attributes &&
                                "undefined" !== typeof a.attributes[
                                    "data-hj-masked"] || g) ? c
                            .value.replace(/./g, "*") : c.value,
                            d.attributes[c.name] = e;
                        if (b && a.childNodes.length) {
                            d.childNodes = [];
                            for (h = a.firstChild; h; h = h.nextSibling)
                                d.childNodes.push(this.serializeNode(
                                    h, !0, g))
                        }
                }
                return d
            };
            m.prototype.serializeAddedAndMoved = function(a, b, g) {
                var d = this;
                a = a.concat(b).concat(g);
                var h = new hj.MutationSummary.NodeMap;
                a.forEach(function(a) {
                    var b = a.parentNode,
                        c = h.get(b);
                    c || (c = new hj.MutationSummary.NodeMap,
                        h.set(b, c));
                    c.set(a, !0)
                });
                var c = [];
                h.keys().forEach(function(a) {
                    a = h.get(a);
                    for (var b = a.keys(); b.length;) {
                        for (b = b[0]; b.previousSibling &&
                            a.has(b.previousSibling);) b =
                            b.previousSibling;
                        for (; b && a.has(b);) {
                            var l = d.serializeNode(b);
                            l.previousSibling = d.serializeNode(
                                b.previousSibling);
                            l.parentNode = d.serializeNode(
                                b.parentNode);
                            c.push(l);
                            a.deleteNode(b);
                            b = b.nextSibling
                        }
                        b = a.keys()
                    }
                });
                return c
            };
            m.prototype.serializeAttributeChanges = function(a) {
                var b = this,
                    g = new hj.MutationSummary.NodeMap;
                Object.keys(a).forEach(function(d) {
                    a[d].forEach(function(a) {
                        var c = g.get(a);
                        c || (c = b.serializeNode(
                                a), c.attributes = {},
                            g.set(a, c));
                        a = a.getAttribute(d);
                        a = "string" === typeof a &&
                            a.length ? a.replace(
                                /-?\d+\.\d+%/g,
                                function(a) {
                                    return Math
                                        .round(
                                            parseFloat(
                                                a
                                            )) +
                                        "%"
                                }).replace(
                                /-?\d+\.\d+/g,
                                function(a) {
                                    return
                                        parseFloat(
                                            a).toFixed(
                                            1)
                                }) : "";
                        c.attributes[d] = a
                    })
                });
                return g.keys().map(function(a) {
                    return g.get(a)
                })
            };
            m.prototype.applyChanged = function(a) {
                var b = this;
                a = a[0];
                var g = a.removed.map(function(a) {
                        return b.serializeNode(a)
                    }),
                    d = this.serializeAddedAndMoved(a.added, a.reparented,
                        a.reordered),
                    h = this.serializeAttributeChanges(a.attributeChanged),
                    c = a.characterDataChanged.map(function(a) {
                        var c = b.serializeNode(a);
                        c.textContent = a.textContent;
                        return c
                    });
                this.mirror.applyChanged(g, d, h, c);
                a.removed.forEach(function(a) {
                    b.forgetNode(a)
                })
            };
            return m
        }, "tree-mirror")()
}, "tree-mirror")();
hj.tryCatch(function() {
    var m = null;
    hj.fingerprinter = function(a) {
        this.options = this.extend(a, {
            sortPluginsFor: [/palemoon/i]
        });
        this.nativeForEach = Array.prototype.forEach;
        this.nativeMap = Array.prototype.map
    };
    hj.fingerprinter.prototype = {
        extend: function(a, b) {
            if (null == a) return b;
            for (var g in a) null != a[g] && b[g] !== a[g] && (
                b[g] = a[g]);
            return b
        },
        log: function(a) {
            window.console && console.log(a)
        },
        get: function() {
            var a = [];
            null === m && (a = this.userAgentKey(a), a = this.languageKey(
                    a), a = this.colorDepthKey(a), a = this
                .timezoneOffsetKey(a), a = this.sessionStorageKey(
                    a), a = this.localStorageKey(a), a =
                this.indexedDbKey(a), a = this.addBehaviorKey(
                    a), a = this.openDatabaseKey(a), a =
                this.cpuClassKey(a), a = this.platformKey(a),
                a = this.doNotTrackKey(a), a = this.pluginsKey(
                    a), a = this.adBlockKey(a), a = this.hasLiedLanguagesKey(
                    a), a = this.hasLiedResolutionKey(a), a =
                this.hasLiedOsKey(a), a = this.hasLiedBrowserKey(
                    a), m = this.x64hash128(a.join("~~~"),
                    31));
            return m
        },
        getAsNumber: function() {
            var a, b;
            a = parseInt(this.get().slice(-10), 16);
            b = Math.pow(2, 40);
            return a / b
        },
        compareRatio: function(a, b) {
            return this.getAsNumber() * (b ? 100 : 1) <= a
        },
        userAgentKey: function(a) {
            a.push(navigator.userAgent);
            return a
        },
        languageKey: function(a) {
            a.push(navigator.language);
            return a
        },
        colorDepthKey: function(a) {
            a.push(screen.colorDepth);
            return a
        },
        screenResolutionKey: function(a) {
            return this.getScreenResolution(a)
        },
        getScreenResolution: function(a) {
            var b, g;
            b = this.options.detectScreenOrientation ? screen.height >
                screen.width ? [screen.height, screen.width] : [
                    screen.width, screen.height
                ] : [screen.height, screen.width];
            "undefined" !== typeof b && a.push(b);
            screen.availWidth && screen.availHeight && (g =
                this.options.detectScreenOrientation ?
                screen.availHeight > screen.availWidth ? [
                    screen.availHeight, screen.availWidth
                ] : [screen.availWidth, screen.availHeight] : [
                    screen.availHeight, screen.availWidth
                ]);
            "undefined" !== typeof g && a.push(g);
            return a
        },
        timezoneOffsetKey: function(a) {
            a.push((new Date(1979, 3, 13)).getTimezoneOffset());
            return a
        },
        sessionStorageKey: function(a) {
            this.hasSessionStorage() && a.push(
                "sessionStorageKey");
            return a
        },
        localStorageKey: function(a) {
            this.hasLocalStorage() && a.push("localStorageKey");
            return a
        },
        indexedDbKey: function(a) {
            this.hasIndexedDB() && a.push("indexedDbKey");
            return a
        },
        addBehaviorKey: function(a) {
            document.body && document.body.addBehavior && a.push(
                "addBehaviorKey");
            return a
        },
        openDatabaseKey: function(a) {
            window.openDatabase && a.push("openDatabase");
            return a
        },
        cpuClassKey: function(a) {
            a.push(this.getNavigatorCpuClass());
            return a
        },
        platformKey: function(a) {
            a.push(this.getNavigatorPlatform());
            return a
        },
        doNotTrackKey: function(a) {
            a.push(this.getDoNotTrack());
            return a
        },
        adBlockKey: function(a) {
            a.push(this.getAdBlock());
            return a
        },
        hasLiedLanguagesKey: function(a) {
            a.push(this.getHasLiedLanguages());
            return a
        },
        hasLiedResolutionKey: function(a) {
            a.push(this.getHasLiedResolution());
            return a
        },
        hasLiedOsKey: function(a) {
            a.push(this.getHasLiedOs());
            return a
        },
        hasLiedBrowserKey: function(a) {
            a.push(this.getHasLiedBrowser());
            return a
        },
        pluginsKey: function(a) {
            this.isIE() || a.push(this.getRegularPluginsString());
            return a
        },
        getRegularPluginsString: function() {
            var a = [];
            if ("undefined" === typeof navigator.plugins) return
                "no-plugins";
            for (var b = 0, g = navigator.plugins.length; b < g; b++)
                a.push(navigator.plugins[b]);
            this.pluginsShouldBeSorted() && (a = a.sort(
                function(a, b) {
                    return a.name > b.name ? 1 : a.name <
                        b.name ? -1 : 0
                }));
            return this.map(a, function(a) {
                var b = this.map(a, function(a) {
                    return [a.type, a.suffixes]
                        .join("~")
                }).join(",");
                return [a.name, a.description, b].join(
                    "::")
            }, this).join(";")
        },
        pluginsShouldBeSorted: function() {
            for (var a = !1, b = 0, g = this.options.sortPluginsFor
                .length; b < g; b++)
                if (navigator.userAgent.match(this.options.sortPluginsFor[
                    b])) {
                    a = !0;
                    break
                }
            return a
        },
        hasSessionStorage: function() {
            try {
                return !!window.sessionStorage
            } catch (a) {
                return !0
            }
        },
        hasLocalStorage: function() {
            try {
                return !!window.localStorage
            } catch (a) {
                return !0
            }
        },
        hasIndexedDB: function() {
            return !!window.indexedDB
        },
        getNavigatorCpuClass: function() {
            return navigator.cpuClass ? "navigatorCpuClass: " +
                navigator.cpuClass :
                "navigatorCpuClass: unknown"
        },
        getNavigatorPlatform: function() {
            return navigator.platform ? "navigatorPlatform: " +
                navigator.platform :
                "navigatorPlatform: unknown"
        },
        getDoNotTrack: function() {
            return navigator.doNotTrack ? "doNotTrack: " +
                navigator.doNotTrack : "doNotTrack: unknown"
        },
        getAdBlock: function() {
            var a = document.createElement("div");
            a.setAttribute("id", "ads");
            try {
                return document.body.appendChild(a), document.getElementById(
                    "ads") ? !1 : !0
            } catch (b) {
                return !1
            }
        },
        getHasLiedLanguages: function() {
            if ("undefined" !== typeof navigator.languages) try {
                if (navigator.languages[0].substr(0, 2) !==
                    navigator.language.substr(0, 2)) return
                    !0
            } catch (a) {
                return !0
            }
            return !1
        },
        getHasLiedResolution: function() {
            return screen.width < screen.availWidth || screen.height <
                screen.availHeight ? !0 : !1
        },
        getHasLiedOs: function() {
            var a = navigator.userAgent,
                b = navigator.oscpu,
                g = navigator.platform,
                a = 0 <= a.toLowerCase().indexOf(
                    "windows phone") ? "Windows Phone" : 0 <= a
                .toLowerCase().indexOf("win") ? "Windows" : 0 <=
                a.toLowerCase().indexOf("android") ? "Android" :
                0 <= a.toLowerCase().indexOf("linux") ? "Linux" :
                0 <= a.toLowerCase().indexOf("iPhone") || 0 <=
                a.toLowerCase().indexOf("iPad") ? "iOS" : 0 <=
                a.toLowerCase().indexOf("mac") ? "Mac" :
                "Other";
            return ("ontouchstart" in window || 0 < navigator.maxTouchPoints ||
                    0 < navigator.msMaxTouchPoints) &&
                "Windows Phone" !== a && "Android" !== a &&
                "iOS" !== a && "Other" !== a || "undefined" !==
                typeof b && (0 <= b.toLowerCase().indexOf("win") &&
                    "Windows" !== a && "Windows Phone" !== a ||
                    0 <= b.toLowerCase().indexOf("linux") &&
                    "Linux" !== a && "Android" !== a || 0 <= b.toLowerCase()
                    .indexOf("mac") && "Mac" !== a && "iOS" !==
                    a || 0 === b.toLowerCase().indexOf("win") &&
                    0 === b.toLowerCase().indexOf("linux") && 0 <=
                    b.toLowerCase().indexOf("mac") && "other" !==
                    a) || 0 <= g.toLowerCase().indexOf("win") &&
                "Windows" !== a && "Windows Phone" !== a || (0 <=
                    g.toLowerCase().indexOf("linux") || 0 <= g.toLowerCase()
                    .indexOf("android") || 0 <= g.toLowerCase()
                    .indexOf("pike")) && "Linux" !== a &&
                "Android" !== a || (0 <= g.toLowerCase().indexOf(
                    "mac") || 0 <= g.toLowerCase().indexOf(
                    "ipad") || 0 <= g.toLowerCase().indexOf(
                    "ipod") || 0 <= g.toLowerCase().indexOf(
                    "iphone")) && "Mac" !== a && "iOS" !== a ||
                0 === g.toLowerCase().indexOf("win") && 0 === g
                .toLowerCase().indexOf("linux") && 0 <= g.toLowerCase()
                .indexOf("mac") && "other" !== a ? !0 :
                "undefined" === typeof navigator.plugins &&
                "Windows" !== a && "Windows Phone" !== a ? !0 :
                !1
        },
        getHasLiedBrowser: function() {
            var a = navigator.userAgent,
                b = navigator.productSub,
                a = 0 <= a.toLowerCase().indexOf("firefox") ?
                "Firefox" : 0 <= a.toLowerCase().indexOf(
                    "opera") || 0 <= a.toLowerCase().indexOf(
                    "opr") ? "Opera" : 0 <= a.toLowerCase().indexOf(
                    "chrome") ? "Chrome" : 0 <= a.toLowerCase()
                .indexOf("safari") ? "Safari" : 0 <= a.toLowerCase()
                .indexOf("trident") ? "Internet Explorer" :
                "Other";
            if (("Chrome" === a || "Safari" === a || "Opera" ===
                a) && "20030107" !== b) return !0;
            b = eval.toString().length;
            if (37 === b && "Safari" !== a && "Firefox" !== a &&
                "Other" !== a || 39 === b &&
                "Internet Explorer" !== a && "Other" !== a ||
                33 === b && "Chrome" !== a && "Opera" !== a &&
                "Other" !== a) return !0;
            var g;
            try {
                throw "a";
            } catch (d) {
                try {
                    d.toSource(), g = !0
                } catch (h) {
                    g = !1
                }
            }
            return g && "Firefox" !== a && "Other" !== a ? !0 :
                !1
        },
        isIE: function() {
            return "Microsoft Internet Explorer" === navigator.appName ||
                "Netscape" === navigator.appName && /Trident/.test(
                    navigator.userAgent) ? !0 : !1
        },
        each: function(a, b, g) {
            if (null !== a)
                if (this.nativeForEach && a.forEach === this.nativeForEach)
                    a.forEach(b, g);
                else if (a.length === +a.length)
                for (var d = 0, h = a.length; d < h && b.call(g,
                    a[d], d, a) !== {}; d++);
            else
                for (d in a)
                    if (a.hasOwnProperty(d) && b.call(g, a[d],
                        d, a) === {}) break
        },
        map: function(a, b, g) {
            var d = [];
            if (null == a) return d;
            if (this.nativeMap && a.map === this.nativeMap)
                return a.map(b, g);
            this.each(a, function(a, c, f) {
                d[d.length] = b.call(g, a, c, f)
            });
            return d
        },
        x64Add: function(a, b) {
            a = [a[0] >>> 16, a[0] & 65535, a[1] >>> 16, a[1] &
                65535
            ];
            b = [b[0] >>> 16, b[0] & 65535, b[1] >>> 16, b[1] &
                65535
            ];
            var g = [0, 0, 0, 0];
            g[3] += a[3] + b[3];
            g[2] += g[3] >>> 16;
            g[3] &= 65535;
            g[2] += a[2] + b[2];
            g[1] += g[2] >>> 16;
            g[2] &= 65535;
            g[1] += a[1] + b[1];
            g[0] += g[1] >>> 16;
            g[1] &= 65535;
            g[0] += a[0] + b[0];
            g[0] &= 65535;
            return [g[0] << 16 | g[1], g[2] << 16 | g[3]]
        },
        x64Multiply: function(a, b) {
            a = [a[0] >>> 16, a[0] & 65535, a[1] >>> 16, a[1] &
                65535
            ];
            b = [b[0] >>> 16, b[0] & 65535, b[1] >>> 16, b[1] &
                65535
            ];
            var g = [0, 0, 0, 0];
            g[3] += a[3] * b[3];
            g[2] += g[3] >>> 16;
            g[3] &= 65535;
            g[2] += a[2] * b[3];
            g[1] += g[2] >>> 16;
            g[2] &= 65535;
            g[2] += a[3] * b[2];
            g[1] += g[2] >>> 16;
            g[2] &= 65535;
            g[1] += a[1] * b[3];
            g[0] += g[1] >>> 16;
            g[1] &= 65535;
            g[1] += a[2] * b[2];
            g[0] += g[1] >>> 16;
            g[1] &= 65535;
            g[1] += a[3] * b[1];
            g[0] += g[1] >>> 16;
            g[1] &= 65535;
            g[0] += a[0] * b[3] + a[1] * b[2] + a[2] * b[1] + a[
                3] * b[0];
            g[0] &= 65535;
            return [g[0] << 16 | g[1], g[2] << 16 | g[3]]
        },
        x64Rotl: function(a, b) {
            b %= 64;
            if (32 === b) return [a[1], a[0]];
            if (32 > b) return [a[0] << b | a[1] >>> 32 - b, a[
                1] << b | a[0] >>> 32 - b];
            b -= 32;
            return [a[1] << b | a[0] >>> 32 - b, a[0] << b | a[
                1] >>> 32 - b]
        },
        x64LeftShift: function(a, b) {
            b %= 64;
            return 0 === b ? a : 32 > b ? [a[0] << b | a[1] >>>
                32 - b, a[1] << b
            ] : [a[1] << b - 32, 0]
        },
        x64Xor: function(a, b) {
            return [a[0] ^ b[0], a[1] ^ b[1]]
        },
        x64Fmix: function(a) {
            a = this.x64Xor(a, [0, a[0] >>> 1]);
            a = this.x64Multiply(a, [4283543511,
                3981806797
            ]);
            a = this.x64Xor(a, [0, a[0] >>> 1]);
            a = this.x64Multiply(a, [3301882366, 444984403]);
            return a = this.x64Xor(a, [0, a[0] >>> 1])
        },
        x64hash128: function(a, b) {
            a = a || "";
            b = b || 0;
            for (var g = a.length % 16, d = a.length - g, h = [
                    0, b
                ], c = [0, b], f = [0, 0], p = [0, 0], l = [
                    2277735313, 289559509
                ], n = [1291169091, 658871167], k = 0; k < d; k +=
                16) f = [a.charCodeAt(k + 4) & 255 | (a.charCodeAt(
                    k + 5) & 255) << 8 | (a.charCodeAt(k +
                    6) & 255) << 16 | (a.charCodeAt(k + 7) &
                    255) << 24, a.charCodeAt(k) & 255 | (a.charCodeAt(
                    k + 1) & 255) << 8 | (a.charCodeAt(k +
                    2) & 255) << 16 | (a.charCodeAt(k + 3) &
                    255) << 24], p = [a.charCodeAt(k + 12) &
                    255 | (a.charCodeAt(k + 13) & 255) << 8 | (
                        a.charCodeAt(k + 14) & 255) << 16 | (a.charCodeAt(
                        k + 15) & 255) << 24, a.charCodeAt(k +
                        8) & 255 | (a.charCodeAt(k + 9) & 255) <<
                    8 | (a.charCodeAt(k + 10) & 255) << 16 | (a
                        .charCodeAt(k + 11) & 255) << 24
                ], f = this.x64Multiply(f, l), f = this.x64Rotl(
                    f, 31), f = this.x64Multiply(f, n), h =
                this.x64Xor(h, f), h = this.x64Rotl(h, 27), h =
                this.x64Add(h, c), h = this.x64Add(this.x64Multiply(
                    h, [0, 5]), [0, 1390208809]), p = this.x64Multiply(
                    p, n), p = this.x64Rotl(p, 33), p = this.x64Multiply(
                    p, l), c = this.x64Xor(c, p), c = this.x64Rotl(
                    c, 31), c = this.x64Add(c, h), c = this.x64Add(
                    this.x64Multiply(c, [0, 5]), [0, 944331445]
                );
            f = [0, 0];
            p = [0, 0];
            switch (g) {
                case 15:
                    p = this.x64Xor(p, this.x64LeftShift([0, a.charCodeAt(
                        k + 14)], 48));
                case 14:
                    p = this.x64Xor(p, this.x64LeftShift([0, a.charCodeAt(
                        k + 13)], 40));
                case 13:
                    p = this.x64Xor(p, this.x64LeftShift([0, a.charCodeAt(
                        k + 12)], 32));
                case 12:
                    p = this.x64Xor(p, this.x64LeftShift([0, a.charCodeAt(
                        k + 11)], 24));
                case 11:
                    p = this.x64Xor(p, this.x64LeftShift([0, a.charCodeAt(
                        k + 10)], 16));
                case 10:
                    p = this.x64Xor(p, this.x64LeftShift([0, a.charCodeAt(
                        k + 9)], 8));
                case 9:
                    p = this.x64Xor(p, [0, a.charCodeAt(k + 8)]),
                        p = this.x64Multiply(p, n), p = this.x64Rotl(
                            p, 33), p = this.x64Multiply(p, l),
                        c = this.x64Xor(c, p);
                case 8:
                    f = this.x64Xor(f, this.x64LeftShift([0, a.charCodeAt(
                        k + 7)], 56));
                case 7:
                    f = this.x64Xor(f, this.x64LeftShift([0, a.charCodeAt(
                        k + 6)], 48));
                case 6:
                    f = this.x64Xor(f, this.x64LeftShift([0, a.charCodeAt(
                        k + 5)], 40));
                case 5:
                    f = this.x64Xor(f, this.x64LeftShift([0, a.charCodeAt(
                        k + 4)], 32));
                case 4:
                    f = this.x64Xor(f, this.x64LeftShift([0, a.charCodeAt(
                        k + 3)], 24));
                case 3:
                    f = this.x64Xor(f, this.x64LeftShift([0, a.charCodeAt(
                        k + 2)], 16));
                case 2:
                    f = this.x64Xor(f, this.x64LeftShift([0, a.charCodeAt(
                        k + 1)], 8));
                case 1:
                    f = this.x64Xor(f, [0, a.charCodeAt(k)]), f =
                        this.x64Multiply(f, l), f = this.x64Rotl(
                            f, 31), f = this.x64Multiply(f, n),
                        h = this.x64Xor(h, f)
            }
            h = this.x64Xor(h, [0, a.length]);
            c = this.x64Xor(c, [0, a.length]);
            h = this.x64Add(h, c);
            c = this.x64Add(c, h);
            h = this.x64Fmix(h);
            c = this.x64Fmix(c);
            h = this.x64Add(h, c);
            c = this.x64Add(c, h);
            return ("00000000" + (h[0] >>> 0).toString(16)).slice(-
                    8) + ("00000000" + (h[1] >>> 0).toString(16))
                .slice(-8) + ("00000000" + (c[0] >>> 0).toString(
                    16)).slice(-8) + ("00000000" + (c[1] >>> 0)
                    .toString(16)).slice(-8)
        }
    };
    hj.fingerprinter.VERSION = "0.7.1";
    return hj.fingerprinter
}, "fingerprinter")();
hj.tryCatch(function(m, a, b) {
    hj.deviceDetection = {
        getDevice: b(m, a)
    }
}("categorizr", this, function(m, a) {
    function b() {
        for (var b = h.length; b--;) l["is" + h[b]] = p(h[b].toLowerCase()),
            d && (a.$["is" + h[b]] = p(h[b].toLowerCase()))
    }
    var g, d = null != a && a == a.window && a.$,
        h = ["Tv", "Desktop", "Tablet", "Mobile"],
        c = function(a) {
            return a.match(
                    /GoogleTV|SmartTV|Internet.TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE\-HTML/i
                ) ? "tv" : a.match(/Xbox|PLAYSTATION.3|Wii/i) ?
                "tv" : a.match(/iPad/i) || a.match(/tablet/i) && !a
                .match(/RX-34/i) || a.match(/FOLIO/i) ? "tablet" :
                a.match(/Linux/i) && a.match(/Android/i) && !a.match(
                    /Fennec|mobi|HTC.Magic|HTCX06HT|Nexus.One|SC-02B|fone.945/i
                ) ? "tablet" : a.match(/Kindle/i) || a.match(
                    /Mac.OS/i) && a.match(/Silk/i) ? "tablet" : a.match(
                    /GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC(.Flyer|\_Flyer)|Sprint.ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos.S7|Dell.Streak.7|Advent.Vega|A101IT|A70BHT|MID7015|Next2|nook/i
                ) || a.match(/MB511/i) && a.match(/RUTEM/i) ?
                "tablet" : a.match(
                    /BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google.Wireless.Transcoder/i
                ) ? "mobile" : a.match(/Opera/i) && a.match(
                    /Windows.NT.5/i) && a.match(
                    /HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9/i
                ) ? "mobile" : a.match(/Windows.(NT|XP|ME|9)/) && !
                a.match(/Phone/i) || a.match(/Win(9|.9|NT)/i) ?
                "desktop" : a.match(/Macintosh|PowerPC/i) && !a.match(
                    /Silk/i) ? "desktop" : a.match(/Linux/i) && a.match(
                    /X11/i) ? "desktop" : a.match(
                    /Solaris|SunOS|BSD/i) ? "desktop" : a.match(
                    /Bot|Crawler|Spider|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|TinEye/i
                ) && !a.match(/Mobile/i) ? "desktop" : "mobile"
        },
        f = c(a.navigator ? a.navigator.userAgent : a.request ? a.request
            .headers["user-agent"] : "No User-Agent Provided"),
        p = function(a) {
            return f === a
        },
        l = function() {
            var a = [].slice.call(arguments, 0);
            2 === a.length && f === a[0] ? (f = a[1], b()) : 1 ===
                a.length && "string" === typeof a[0] && (f = a[0],
                    b());
            return f
        };
    l.is = p;
    l.test = c;
    b();
    if (d) {
        for (g in l) Object.hasOwnProperty.call(l, g) && (a.$[
            "test" == g ? "testUserAgent" : "is" == g ?
            "isDeviceType" : g] = l[g]);
        a.$.categorizr = l
    }
    return l
}), "device-detection");
hj.tryCatch(function() {
    function m(f, c) {
        var l = f[0],
            n = f[1],
            k = f[2],
            q = f[3],
            l = b(l, n, k, q, c[0], 7, -680876936),
            q = b(q, l, n, k, c[1], 12, -389564586),
            k = b(k, q, l, n, c[2], 17, 606105819),
            n = b(n, k, q, l, c[3], 22, -1044525330),
            l = b(l, n, k, q, c[4], 7, -176418897),
            q = b(q, l, n, k, c[5], 12, 1200080426),
            k = b(k, q, l, n, c[6], 17, -1473231341),
            n = b(n, k, q, l, c[7], 22, -45705983),
            l = b(l, n, k, q, c[8], 7, 1770035416),
            q = b(q, l, n, k, c[9], 12, -1958414417),
            k = b(k, q, l, n, c[10], 17, -42063),
            n = b(n, k, q, l, c[11], 22, -1990404162),
            l = b(l, n, k, q, c[12], 7, 1804603682),
            q = b(q, l, n, k, c[13], 12, -40341101),
            k = b(k, q, l, n, c[14], 17, -1502002290),
            n = b(n, k, q, l, c[15], 22, 1236535329),
            l = g(l, n, k, q, c[1], 5, -165796510),
            q = g(q, l, n, k, c[6], 9, -1069501632),
            k = g(k, q, l, n, c[11], 14, 643717713),
            n = g(n, k, q, l, c[0], 20, -373897302),
            l = g(l, n, k, q, c[5], 5, -701558691),
            q = g(q, l, n, k, c[10], 9, 38016083),
            k = g(k, q, l, n, c[15], 14, -660478335),
            n = g(n, k, q, l, c[4], 20, -405537848),
            l = g(l, n, k, q, c[9], 5, 568446438),
            q = g(q, l, n, k, c[14], 9, -1019803690),
            k = g(k, q, l, n, c[3], 14, -187363961),
            n = g(n, k, q, l, c[8], 20, 1163531501),
            l = g(l, n, k, q, c[13], 5, -1444681467),
            q = g(q, l, n, k, c[2], 9, -51403784),
            k = g(k, q, l, n, c[7], 14, 1735328473),
            n = g(n, k, q, l, c[12], 20, -1926607734),
            l = a(n ^ k ^ q, l, n, c[5], 4, -378558),
            q = a(l ^ n ^ k, q, l, c[8], 11, -2022574463),
            k = a(q ^ l ^ n, k, q, c[11], 16, 1839030562),
            n = a(k ^ q ^ l, n, k, c[14], 23, -35309556),
            l = a(n ^ k ^ q, l, n, c[1], 4, -1530992060),
            q = a(l ^ n ^ k, q, l, c[4], 11, 1272893353),
            k = a(q ^ l ^ n, k, q, c[7], 16, -155497632),
            n = a(k ^ q ^ l, n, k, c[10], 23, -1094730640),
            l = a(n ^ k ^ q, l, n, c[13], 4, 681279174),
            q = a(l ^ n ^ k, q, l, c[0], 11, -358537222),
            k = a(q ^ l ^ n, k, q, c[3], 16, -722521979),
            n = a(k ^ q ^ l, n, k, c[6], 23, 76029189),
            l = a(n ^ k ^ q, l, n, c[9], 4, -640364487),
            q = a(l ^ n ^ k, q, l, c[12], 11, -421815835),
            k = a(q ^ l ^ n, k, q, c[15], 16, 530742520),
            n = a(k ^ q ^ l, n, k, c[2], 23, -995338651),
            l = d(l, n, k, q, c[0], 6, -198630844),
            q = d(q, l, n, k, c[7], 10, 1126891415),
            k = d(k, q, l, n, c[14], 15, -1416354905),
            n = d(n, k, q, l, c[5], 21, -57434055),
            l = d(l, n, k, q, c[12], 6, 1700485571),
            q = d(q, l, n, k, c[3], 10, -1894986606),
            k = d(k, q, l, n, c[10], 15, -1051523),
            n = d(n, k, q, l, c[1], 21, -2054922799),
            l = d(l, n, k, q, c[8], 6, 1873313359),
            q = d(q, l, n, k, c[15], 10, -30611744),
            k = d(k, q, l, n, c[6], 15, -1560198380),
            n = d(n, k, q, l, c[13], 21, 1309151649),
            l = d(l, n, k, q, c[4], 6, -145523070),
            q = d(q, l, n, k, c[11], 10, -1120210379),
            k = d(k, q, l, n, c[2], 15, 718787259),
            n = d(n, k, q, l, c[9], 21, -343485551);
        f[0] = h(l, f[0]);
        f[1] = h(n, f[1]);
        f[2] = h(k, f[2]);
        f[3] = h(q, f[3])
    }

    function a(a, b, c, d, k, g) {
        b = h(h(b, a), h(d, g));
        return h(b << k | b >>> 32 - k, c)
    }

    function b(b, c, l, d, k, g, h) {
        return a(c & l | ~c & d, b, c, k, g, h)
    }

    function g(b, c, l, d, k, g, h) {
        return a(c & d | l & ~d, b, c, k, g, h)
    }

    function d(b, c, l, d, k, g, h) {
        return a(l ^ (c | ~d), b, c, k, g, h)
    }

    function h(a, b) {
        return a + b & 4294967295
    }
    if ("undefined" !== typeof hj.scriptLoaded) window.console = window
        .console || {
            warn: function() {}
        }, console.warn(
            "Hotjar Tracking Warning: Multiple Hotjar tracking codes were detected on this page. Tracking will not work as expected."
        ), hj.verifyInstall && hj.notification.show(
            "Hotjar installation invalid.",
            "It appears you have more than one Hotjar tracking code set up on this page. Hotjar cannot work properly if multiple Hotjar scripts are loaded concurrently. Please make sure you only install the one tracking code provided for this site.",
            "bad");
    else {
        window.hj = window.hj || function() {
            (window.hj.q = window.hj.q || []).push(arguments)
        };
        window.hj.q = window.hj.q || [];
        window._hjSettings = window._hjSettings || {};
        hj.defaults = {
            host: "insights.hotjar.com",
            staticHost: "static.hotjar.com"
        };
        hj.host = _hjSettings.host || hj.defaults.host;
        hj.staticHost = _hjSettings.staticHost || hj.defaults.staticHost;
        hj.hostname = hj.host.split(":")[0];
        hj.secure = "https:" == location.protocol;
        hj.port = hj.host.split(":")[1] || (hj.secure ? "443" : "80");
        hj.apiUrlBase = location.protocol + "//" + hj.host + "/api/v1";
        hj.includedInSample = !1;
        hj.isPreview = Boolean(_hjSettings.preview);
        hj.placeholderPolyfill = !1 !== _hjSettings.hjPlaceholderPolyfill;
        hj.settings = null;
        hj.startTime = (new Date).getTime();
        hj.userDeviceType = null;
        hj.doNotTrack = !1;
        hj.windowSize = null;
        hj.scriptVersion = 16041304;
        var c = "0123456789abcdef".split("");
        hj.md5 = function(a, b) {
            var l = "";
            try {
                var d = a,
                    k = d.length,
                    g = [1732584193, -271733879, -1732584194,
                        271733878
                    ],
                    h;
                for (h = 64; h <= d.length; h += 64) {
                    for (var r = g, v = d.substring(h - 64, h), u = [],
                        s = void 0, s = 0; 64 > s; s += 4) u[s >> 2] =
                        v.charCodeAt(s) + (v.charCodeAt(s + 1) << 8) +
                        (v.charCodeAt(s + 2) << 16) + (v.charCodeAt(
                            s + 3) << 24);
                    m(r, u)
                }
                d = d.substring(h - 64);
                r = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (h = 0; h < d.length; h++) r[h >> 2] |= d.charCodeAt(
                    h) << (h % 4 << 3);
                r[h >> 2] |= 128 << (h % 4 << 3);
                if (55 < h) {
                    m(g, r);
                    for (h = 0; 16 > h; h++) r[h] = 0
                }
                r[14] = 8 * k;
                m(g, r);
                for (d = 0; d < g.length; d++) {
                    k = g;
                    h = d;
                    for (var w = g[d], r = "", v = 0; 4 > v; v++) r +=
                        c[w >> 8 * v + 4 & 15] + c[w >> 8 * v & 15];
                    k[h] = r
                }
                l = g.join("")
            } catch (x) {
                b ? l = "" : hj.exceptions.log(x, "md5")
            }
            return l
        };
        "5d41402abc4b2a76b9719d911017c592" != hj.md5("hello") && (h =
            function(a, b) {
                var c = (a & 65535) + (b & 65535);
                return (a >> 16) + (b >> 16) + (c >> 16) << 16 | c &
                    65535
            });
        hj.debug = function() {
            return {
                on: function(a) {
                    _hjSettings.hjdebug = !0;
                    a && hj.cookie.set("hjDebug", !0)
                },
                off: function() {
                    _hjSettings.hjdebug = !1;
                    hj.cookie.set("hjDebug", !1)
                }
            }
        }();
        hj.url = function() {
            var a = {};
            a.getParameter = hj.tryCatch(function(a) {
                var b, c = [];
                for (a = RegExp("[^?&]?" + a.replace(/[\[]/,
                        "\\[").replace(/[\]]/, "\\]") +
                    "=([^&]+)", "g"); b = a.exec(
                    location.search);) c.push(hj.url.tryDecodeURIComponent(
                    b[1]));
                switch (c.length) {
                    case 0:
                        return "";
                    case 1:
                        return c[0];
                    default:
                        return c
                }
            }, "common");
            a.tryDecodeURIComponent = hj.tryCatch(function(a) {
                try {
                    return decodeURIComponent(a)
                } catch (b) {
                    return a
                }
            }, "common");
            return a
        }();
        hj.cookie = function() {
            var a = {};
            a.get = hj.tryCatch(function(a) {
                return (a = RegExp("(?:^|; )" + a +
                        "=([^;]*)").exec(document.cookie)) ?
                    a[1] : null
            }, "common");
            a.set = hj.tryCatch(function(a, b, c) {
                var f = new Date;
                a = a + "=" + b + "; path=/; ";
                c || (f.setTime(f.getTime() + 31536E6), a +=
                    "expires=" + f.toUTCString());
                document.cookie = a
            }, "common");
            a.add = hj.tryCatch(function(a, b) {
                var c = hj.cookie.get(a),
                    c = c ? c.split(",") : [];
                hj.hq.inArray(b.toString(), c) || (c.push(b),
                    hj.cookie.set(a, c.join(","), !1))
            }, "common");
            a.find = hj.tryCatch(function(a, b) {
                var c = hj.cookie.get(a),
                    f, c = c ? c.split(",") : [];
                for (f = 0; f < c.length; f++)
                    if (b.toString() === c[f]) return !0;
                return !1
            }, "common");
            return a
        }();
        hj.json = function() {
            var a = {};
            a.parse = hj.tryCatch(function(a) {
                return (JSON.parse || JSON.decode)(a)
            }, "common");
            a.stringify = hj.tryCatch(function(a, b, c) {
                var f, d, h;
                if (void 0 !== a) return f = Array.prototype
                    .toJSON, delete Array.prototype.toJSON,
                    d = JSON.stringify || JSON.encode,
                    h = '"\u2028"' === d("\u2028") ?
                    function(a, b, c) {
                        return d(a, b, c).replace(
                            /\u2028|\u2029/g,
                            function(a) {
                                return "\\u202" + (
                                    "\u2028" ===
                                    a ? "8" :
                                    "9")
                            })
                    } : d, a = h(a, b, c), f && (Array.prototype
                        .toJSON = f), a
            }, "common");
            return a
        }();
        hj.log = function() {
            var a = {},
                b = !1,
                c = "",
                d = {
                    init: "#6600cc",
                    recording: "#c00000",
                    heatmap: "#c00000",
                    forms: "#c00000",
                    tester: "#009900",
                    survey: "#009900",
                    poll: "#009900",
                    events: "#ffc000",
                    event: "#ffc000",
                    property: "#ff33cc",
                    deferredpagecontent: "#7c7c7c",
                    websocket: "#0dc0ff",
                    data: "#009bd2",
                    command: "#0079a4",
                    pagevisit: "#00668a",
                    dataqueue: "#00445c",
                    targeting: "#00ee00",
                    rendering: "#bd00ea"
                };
            a.init = function() {
                "undefined" === typeof window.console && (
                    window.console = {
                        debug: function() {},
                        trace: function() {},
                        log: function() {},
                        info: function() {},
                        warn: function() {},
                        error: function() {}
                    })
            };
            a.debug = function(k, h, g) {
                var m = !h ? "#333" : d[h.toLowerCase()] ||
                    "#333";
                c != k && b && (console.groupEnd(), b = !1);
                c = k;
                _hjSettings.hjdebug && ("object" === typeof k ?
                    hj.hq.each(k, function(b, c) {
                        a.debug(b + ": " + c, h, null)
                    }) : (k = h && "string" === typeof k ?
                        h.toUpperCase() + ": " + k : k, k =
                        "%c" + (new Date).toTimeString().replace(
                            /.*(\d{2}:\d{2}:\d{2}).*/, "$1"
                        ) + ":%c " + k, g ? (b || (console.groupCollapsed(
                                k + ":", "color: #999;",
                                "color: " + m + ";"), b = !
                            0), console.log(g)) : console.log(
                            k, "color: #999;", "color: " +
                            m + ";")))
            };
            a.info = function(a) {
                console.log("%c" + a, "color: #006EFF")
            };
            a.warn = function(a) {
                console.log("%c" + a, "color: #E8910C")
            };
            a.error = function(a) {
                console.error("Hotjar error: " + a)
            };
            return a
        }();
        hj.loader = function() {
            var a = {},
                b = [];
            a.getModules = hj.tryCatch(function() {
                return b
            }, "common");
            a.registerModule = hj.tryCatch(function(a, c, f) {
                b.push({
                    name: a,
                    module: c,
                    nonTracking: "undefined" !==
                        typeof f ? f : !1
                })
            }, "common");
            a.loadScripts = hj.tryCatch(function(a, b) {
                function c(k) {
                    f += 1;
                    hj.log.debug("Script loaded: " + f +
                        " (" + k + ")");
                    f === a.length && hj.tryCatch(b,
                        "URL")()
                }
                var f = 0,
                    d = {},
                    h;
                0 === a.length && hj.tryCatch(b, "URL")();
                for (h = 0; h < a.length; h++) d[h] =
                    document.createElement("script"), d[h].src =
                    a[h], d[h].onload = function(a) {
                        return function() {
                            hj.tryCatch(c, "URL")(d[a].src)
                        }
                    }(h), d[h].onreadystatechange =
                    function(a) {
                        return function() {
                            if ("complete" === this.readyState ||
                                "loaded" === this.readyState
                            ) hj.log.debug(this.readyState +
                                    ": " + d[a].src +
                                    " (IE onreadystatechange)"
                                ), d[a].onreadystatechange =
                                null, c(d[a].src)
                        }
                    }(h), document.getElementsByTagName(
                        "head")[0].appendChild(d[h])
            }, "common");
            a.loadSettings = hj.tryCatch(function(a) {
                hj.isPreview ? hj.tryCatch(a, "Loader")() :
                    "undefined" !== typeof window.hjSiteSettings ?
                    hj.tryCatch(a, "Loader")(window.hjSiteSettings) :
                    hj.ajax.get(hj.apiUrlBase +
                        "/client/sites/" + hj.settings.site_id,
                        hj.tryCatch(a, "common"))
            }, "common");
            return a
        }();
        hj.targeting = function() {
            var a = {};
            a.ruleMatches = hj.tryCatch(function(a, b) {
                var f, h = [],
                    g = [],
                    p = [];
                for (f = 0; f < a.length; f += 1) "url" ===
                    a[f].component && !a[f].negate ? h.push(
                        a[f]) : "url" === a[f].component &&
                    a[f].negate ? g.push(a[f]) : "device" ===
                    a[f].component && p.push(a[f]);
                return (!h.length || c(h, b)) && (!g.length ||
                    !c(g, b)) && d(p)
            }, "common");
            a.onMatch = hj.tryCatch(function(a, f, h) {
                var g, m = [],
                    u = [],
                    s = [],
                    w = [];
                for (g = 0; g < a.length; g += 1) "url" ===
                    a[g].component && !a[g].negate ? m.push(
                        a[g]) : "url" === a[g].component &&
                    a[g].negate ? u.push(a[g]) : "device" ===
                    a[g].component ? s.push(a[g]) :
                    "trigger" === a[g].component && w.push(
                        a[g]);
                d(s) && (w.length && b(w, hj.tryCatch(f)), (!
                    m.length || c(m, h)) && ((!u.length ||
                    !c(u, h)) && (m.length || u
                    .length)) && hj.tryCatch(f,
                    "Targeting")())
            }, "common");
            var b = hj.tryCatch(function(a, b) {
                    var c = 0;
                    for (c; c < a.length; c += 1) hj.event.listen(
                        ["trigger:" + a[c].pattern],
                        function() {
                            hj.tryCatch(b)()
                        })
                }, "common"),
                c = hj.tryCatch(function(a, b) {
                    var c = b || hj.url.tryDecodeURIComponent(
                            window.location.href),
                        f, d = !1,
                        h, g;
                    if (0 === a.length) hj.log.debug(
                            "No URL rules set.", "targeting"),
                        d = !0;
                    else
                        for (g = 0; g < a.length; g += 1) {
                            h = a[g];
                            h.pattern.length || (h.pattern =
                                "/");
                            "regex" !== h.match_operation && (h
                                .pattern = hj.url.tryDecodeURIComponent(
                                    h.pattern));
                            switch (h.match_operation) {
                                case "simple":
                                    f = c.split("#")[0].split(
                                            "?")[0].replace(
                                            "http://www.", "").replace(
                                            "https://www.", "")
                                        .replace("http://", "")
                                        .replace("https://", "");
                                    h.pattern = h.pattern.split(
                                            "#")[0].split("?")[
                                            0].replace(
                                            "http://www.", "").replace(
                                            "https://www.", "")
                                        .replace("http://", "")
                                        .replace("https://", "");
                                    f = f === h.pattern;
                                    break;
                                case "exact":
                                    f = c === h.pattern;
                                    break;
                                case "starts_with":
                                    f = 0 === c.indexOf(h.pattern);
                                    break;
                                case "ends_with":
                                    f = -1 === c.length - h.pattern
                                        .length ? 0 : c.length -
                                        h.pattern.length;
                                    f = c.substring(f, c.length) ===
                                        h.pattern;
                                    break;
                                case "contains":
                                    f = -1 !== c.indexOf(h.pattern);
                                    break;
                                case "regex":
                                    f = RegExp(h.pattern).test(
                                        c)
                            }
                            if (f) {
                                hj.log.debug("URL match: " + h.component +
                                    "|" + h.match_operation +
                                    "|" + h.pattern,
                                    "targeting");
                                d = !0;
                                break
                            }
                        }
                    d || hj.log.debug("No URL match found.",
                        "targeting");
                    return d
                }, "common"),
                d = hj.tryCatch(function(a) {
                    var b = !1,
                        c, f, h;
                    if (0 === a.length || 3 === a.length) hj.log
                        .debug("No specific device rules set.",
                            "targeting"), b = !0;
                    else {
                        f = hj.utils.deviceType();
                        for (h = 0; h < a.length; h += 1) c = a[
                            h].pattern, c === f && (hj.log.debug(
                            "Device match: " + c,
                            "targeting"), b = !0)
                    }
                    b || hj.log.debug("No device match found.",
                        "targeting");
                    return b
                }, "common");
            return a
        }();
        hj.utils = function() {
            var a = {
                ieVersion: function(a) {
                    a = a || navigator.userAgent;
                    return 0 < a.indexOf("MSIE ") ?
                        document.all && !document.compatMode ?
                        5 : document.all && !window.XMLHttpRequest ?
                        6 : document.all && !document.querySelector ?
                        7 : document.all && !document.addEventListener ?
                        8 : document.all && !window.atob ?
                        9 : 10 : -1 !== a.indexOf(
                            "Trident/") ? 11 : -1 !== a.indexOf(
                            "Edge/") ? 12 : "notIE"
                },
                isFirefox: function(a) {
                    return -1 < (a || navigator.userAgent).indexOf(
                        "Firefox")
                },
                shuffle: function(a) {
                    var b, c, f;
                    for (b = a.length - 1; 0 < b; b -= 1) c =
                        Math.floor(Math.random() * (b + 1)),
                        f = a[b], a[b] = a[c], a[c] = f;
                    return a
                },
                uuid4: function() {
                    return
                        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
                        .replace(/[xy]/g, function(a) {
                            var b = 16 * Math.random() |
                                0;
                            return ("x" == a ? b : b &
                                3 | 8).toString(16)
                        })
                }
            };
            a.deviceType = hj.tryCatch(function() {
                hj.userDeviceType || (hj.userDeviceType =
                    hj.deviceDetection.getDevice(),
                    "mobile" === hj.userDeviceType && (
                        hj.userDeviceType = "phone"));
                return hj.userDeviceType
            }, "common");
            return a
        }();
        hj.rendering = function() {
            function a(b, c) {
                hj.tryCatch(c, "Rendering")(b)
            }

            function b(a, c) {
                setTimeout(function() {
                    hj.tryCatch(c, "Rendering")(a)
                }, 1E3 * a.display_delay)
            }

            function c(a, b, f) {
                function h() {
                    hj.tryCatch(b, "Rendering")(a);
                    d.off("mousemove." + f);
                    d.off("mouseout." + f)
                }
                var d = hj.hq(document),
                    k = hj.hq(window),
                    g = [];
                d.off("mousemove." + f);
                d.off("mouseout." + f);
                d.on("mousemove." + f, hj.tryCatch(function(a) {
                    g.push({
                        x: a.clientX,
                        y: a.clientY
                    });
                    2 < g.length && (g[1].x === g[2]
                        .x && g[1].y === g[2].y ?
                        g.pop() : g.shift())
                }, "Rendering"));
                d.on("mouseout." + f, hj.tryCatch(function(a) {
                    if (!a.relatedTarget || a.relatedTarget !==
                        this && !(this.compareDocumentPosition(
                                a.relatedTarget) &
                            Node.DOCUMENT_POSITION_CONTAINED_BY
                        )) {
                        var b = g[1];
                        a = g[0];
                        "undefined" !== typeof b &&
                            !(b.y >= a.y) && (a.x ===
                                b.x && h(), b = (a.y -
                                    b.y) / (a.x - b
                                    .x), a = a.y -
                                b * a.x, a = -a / b,
                                0 < a && a < k.width() &&
                                h())
                    }
                }, "Rendering"))
            }

            function h(a, b, c) {
                var f = hj.hq(document),
                    d = hj.hq(window);
                d.on("scroll." + c, hj.tryCatch(function() {
                    var h = f.height();
                    0.5 <= (f.scrollTop() + hj.ui.getWindowSize()
                        .height) / h && (d.off(
                        "scroll." + c), b(a))
                }, "Rendering"))
            }

            function d(a) {
                for (var b in a) {
                    var c;
                    if (a.hasOwnProperty(b))
                        if (c = a[b], "object" === typeof c) c instanceof hj
                            .rendering.TrustedString ? a[b] = c
                            .value : d(c);
                        else if ("string" === typeof c) {
                        var f = a,
                            h = b;
                        c = g.escapeHtml(c);
                        c = c.replace(
                            /(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig,
                            '<a href="$1" target="_blank">$1</a>'
                        );
                        c = c.replace(
                            /(^|[^\/])(www\.[\S]+(\b|$))/gim,
                            '$1<a href="http://$2" target="_blank">$2</a>'
                        );
                        f[h] = c
                    }
                }
            }
            var g = {},
                m = {};
            g.renderTemplate = hj.tryCatch(function(a, b) {
                var c = m[a];
                c || (c =
                    "var pieces=[],print=function(){pieces.push.apply(pieces,arguments);};with(obj){pieces.push('" +
                    a.replace(/[\r\t\n]/g, " ").replace(
                        /'(?=[^%]*%>)/g, "\t").split(
                        "'").join("\\'").split("\t").join(
                        "'").replace(/<%=(.+?)%>/g,
                        "',$1,'").split("<%").join(
                        "');").split("%>").join(
                        "pieces.push('") +
                    "');}return pieces.join('');", c =
                    new Function("obj", c), m[a] = c);
                d(b);
                return c(b)
            }, "common");
            g.addToDom = hj.tryCatch(function(a, b) {
                hj.hq("#" + a).remove();
                hj.hq("body").append(b);
                return hj.hq("#" + a + ">div")
            }, "common");
            g.TrustedString = function(a) {
                this.value = a
            };
            g.callAccordingToCondition = hj.tryCatch(function(d, k,
                g) {
                var m = {
                    immediate: a,
                    delay: b,
                    abandon: c,
                    scroll: h
                }[d.display_condition];
                hj.log.debug("Calling active item (" + k +
                    "): " + d.display_condition,
                    "rendering");
                if (m) {
                    var q = !0;
                    "undefined" !== typeof d.targeting_percentage &&
                        !hj.isPreview && (q = (new hj.fingerprinter)
                            .compareRatio(d.targeting_percentage, !
                                0));
                    q && hj.tryCatch(m, "Rendering")(d, g,
                        k)
                } else throw Error(
                    'Unhandled display condition: "' +
                    d.display_condition + '"');
            }, "common");
            g.escapeHtml = function(a) {
                var b = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                };
                return String(a).replace(/[&<>"']/g, function(a) {
                    return b[a]
                })
            };
            return g
        }();
        hj.survey = hj.tryCatch(function() {
            return {
                ctrl: void 0,
                data: void 0,
                model: {},
                activeLanguageDirection: "ltr"
            }
        }, "common")();
        hj.ui = function() {
            var a = {};
            a.getWindowSize = hj.tryCatch(function() {
                return {
                    width: window.innerWidth || document.documentElement
                        .clientWidth || document.body.clientWidth,
                    height: window.innerHeight || document.documentElement
                        .clientHeight || document.body.clientHeight
                }
            }, "common");
            a.distanceFromTop = hj.tryCatch(function() {
                return hj.hq(window).scrollTop()
            }, "common");
            a.getBottomAsPercentage = hj.tryCatch(function() {
                return parseInt(1E3 * (hj.hq(window).scrollTop() +
                        hj.ui.getWindowSize().height) /
                    hj.hq(document).height(), 10)
            }, "common");
            return a
        }();
        hj.dom = function() {
            var a = {},
                b =
                /(#|@|&|~|=|>|`|'|:|"|!|;|,|\?|\%|\}|\{|\.|\*|\+|\||\[|\]|\(|\)|\/|\^|\$)/g;
            a.getPath = hj.tryCatch(function(a) {
                var b = void 0 === a.attr(
                        "data-hj-ignore-attributes"),
                    c, f, d, h;
                d = function(a, b) {
                    f = hj.hq(b);
                    for (c = 0; c < f.length; c++)
                        if (f[c] === a[0]) return c;
                    return 0
                };
                if (b) {
                    b = hj.dom.sanitizeAttributeName(a.attr(
                        "id"));
                    h = hj.dom.sanitizeAttributeName(a.attr(
                        "name"));
                    if (b) return "0:#" + b;
                    if (h) return b = '*[name="' + h + '"]',
                        d(a, b) + ":" + b
                }
                b = hj.dom.getLongSelector(a);
                return d(a, b) + ":" + b
            }, "common");
            a.getLongSelector = hj.tryCatch(function(a, b) {
                var c = void 0 === a.attr(
                        "data-hj-ignore-attributes"),
                    f;
                "undefined" === typeof b && (b = "");
                if (a.is("html")) return "html" + b;
                f = hj.dom.sanitizeTagName(a.get(0).nodeName
                    .toLowerCase());
                if (c) {
                    if (c = hj.dom.sanitizeAttributeName(a.attr(
                        "id"))) return f + "#" + c + b;
                    (c = hj.dom.sanitizeAttributeName(a.attr(
                        "class"))) && (f += "." + c.split(
                        /[\s\n]+/).join("."))
                }
                return hj.dom.getLongSelector(a.parent(),
                    ">" + f + b)
            }, "common");
            a.sanitizeAttributeName = function(a) {
                a = hj.hq.trim((a || "").replace(/\s\s+/g, " "));
                return "" === a || -1 < a.indexOf("yui_") || !
                    isNaN(a.charAt(0)) ? !1 : a = a.replace(b,
                        "\\$1")
            };
            a.sanitizeTagName = function(a) {
                return a.replace(/[^a-zA-Z0-9]/g, "")
            };
            return a
        }()
    }
}, "common")();
hj.tryCatch(function() {
    hj.xcom = hj.tryCatch(function() {
        var m = {},
            a = [],
            b = 1,
            g = location.protocol + "//" + hj.host + "/x",
            d, h = hj.tryCatch(function() {
                if (1 == b) {
                    window.addEventListener ? window.addEventListener(
                        "message", c, !1) : window.attachEvent(
                        "onmessage", c);
                    b = 2;
                    var a = document.createElement("iframe");
                    a.style.position = "fixed";
                    a.style.top = -100;
                    a.style.left = -100;
                    a.width = 1;
                    a.height = 1;
                    a.id = "_hjXcomProxyFrame";
                    a.src = g;
                    document.body.appendChild(a);
                    d = document.getElementById(
                        "_hjXcomProxyFrame")
                }
            }, "data");
        m.send = hj.tryCatch(function(c, g) {
            10 == b ? d.contentWindow.postMessage({
                eventId: c,
                data: g
            }, "*") : (a.push({
                eventId: c,
                data: g
            }), h())
        });
        var c = function(c) {
            "knockknock" == c.data.eventId && (b = 10, a.forEach(
                function(a) {
                    m.send(a.eventId, a.data)
                }), a = [])
        };
        return m
    }, "xcom")()
}, "xcom")();
hj.tryCatch(function() {
    var m = new hj.fingerprinter;
    hj.pageVisit = hj.tryCatch(function() {
        var a = {},
            b = {},
            g = !1,
            d = !1,
            h = !1;
        a.setup = hj.tryCatch(function() {
            var a = hj.ui.getWindowSize();
            b = {
                window_width: a.width,
                window_height: a.height,
                included_in_sample: hj.includedInSample,
                url: document.location.href,
                fingerprint: m.get()
            }
        }, "data");
        a.requirePageVisitId = hj.tryCatch(function() {
            !h && !hj.property.get("pageVisitId") && (
                hj.log.debug(
                    "Page Visit ID is required. ",
                    "pageVisit"), h = !0, (g || !hj
                    .includedInSample) && a.send())
        }, "data");
        a.track = hj.tryCatch(function(c) {
            c && (b.url = c);
            hj.log.debug("Tracking " + b.url,
                "pageVisit");
            d = !0;
            a.send()
        }, "data");
        a.send = hj.tryCatch(function() {
            g = !0;
            if ((h || d) && !hj.isPreview) b.insert_page_visit =
                h, b.insert_traffic_log_entry = d, hj.log
                .debug(
                    "Sending visit-data request. (Insert Page Visit: " +
                    b.insert_page_visit +
                    " / Insert Traffic Log Entry: " + b
                    .insert_traffic_log_entry + ")",
                    "pageVisit", b), hj.ajax.post(hj.apiUrlBase +
                    "/client/sites/" + hj.settings.site_id +
                    "/visit-data?sv=" + (_hjSettings.hjsv ||
                        0), b, function(a) {
                        a.success && (a.user_id && hj.property
                            .set("userId", a.user_id),
                            b.insert_page_visit &&
                            (hj.property.set(
                                "pageId", a.page_id
                            ), hj.property.set(
                                "pageVisitId",
                                a.page_visit_id
                            )), hj.command ? hj.command
                            .activate() : hj.initialPageVisitSent = !
                            0)
                    }), d = h = !1
        }, "data");
        return a
    }, "data")();
    hj.request = hj.tryCatch(function() {
        var a = {};
        a.saveFeedbackResponse = hj.tryCatch(function(a) {
            hj.pageVisit.requirePageVisitId();
            hj.property.ready("pageVisitId", function() {
                a.action =
                    "feedback_widget_response";
                a.page_visit_id = hj.property.get(
                    "pageVisitId");
                hj.ajax.post(hj.apiUrlBase +
                    "/client/sites/" + hj.settings
                    .site_id + "/feedback/" +
                    hj.widget.feedbackData.id,
                    a)
            })
        }, "data");
        a.savePollResponse = hj.tryCatch(function(a, g) {
            hj.pageVisit.requirePageVisitId();
            hj.property.ready("pageVisitId", function() {
                a.page_visit_id = hj.property.get(
                    "pageVisitId");
                hj.ajax.post(hj.apiUrlBase +
                    "/client/sites/" + hj.settings
                    .site_id + "/polls/" +
                    hj.widget.pollData.id,
                    a, function(a) {
                        a.success && a.poll_response_id &&
                            hj.tryCatch(g,
                                "Data")(a)
                    })
            })
        }, "data");
        a.saveTesterResponse = hj.tryCatch(function(a) {
            hj.pageVisit.requirePageVisitId();
            hj.property.ready("pageVisitId", function() {
                a.page_visit_id = hj.property.get(
                    "pageVisitId");
                hj.ajax.post(hj.apiUrlBase +
                    "/client/sites/" + hj.settings
                    .site_id + "/testers/" +
                    hj.widget.testersData.id,
                    a)
            })
        }, "data");
        return a
    }, "data")();
    hj.webSocket = hj.tryCatch(function() {
        var a = {},
            b = !1,
            g = !1,
            d = !1,
            h = void 0,
            c = !1,
            f = null,
            p = "";
        a.connect = hj.tryCatch(function() {
            !b && !g && (p = (hj.secure ? "wss://" :
                    "ws://") + q() +
                "/api/v1/client/ws", l())
        }, "data");
        a.disconnect = hj.tryCatch(function() {
            b && (hj.log.debug(
                    "Disconnecting Web Socket.",
                    "websocket"), hj.dataPusher.pushToServer(),
                g = b = !1, d = !0, f.close())
        }, "data");
        a.ping = hj.tryCatch(function() {
            b && (hj.log.debug("Pinging Web Socket.",
                "websocket"), f.send("ping"))
        }, "data");
        a.isConnected = hj.tryCatch(function() {
            if (b) {
                if (!h || 6E5 >= (new Date).getTime() -
                    h) return !0;
                sessionStorage.removeItem(
                    "_hjRecordingEnabled");
                a.close()
            }
            return !1
        }, "data");
        a.send = hj.tryCatch(function(a) {
            h = (new Date).getTime();
            hj.log.debug("Sending data to Web Socket",
                "websocket", a);
            f.send(a)
        }, "data");
        a.close = hj.tryCatch(function() {
            hj.log.debug("Closing Web Socket.",
                "websocket");
            f.close()
        }, "data");
        var l = hj.tryCatch(function() {
                d ? (hj.log.debug(
                    "Unload event triggered, don't reconnect"
                ), !1 === c && (c = !0, setTimeout(
                    function() {
                        c = d = !1
                    }, 1E3))) : (g = !0, hj.log.debug(
                        "Connecting to Web Socket [" +
                        p + "]", "websocket"), f = new WebSocket(
                        p), f.onopen = n, f.onclose = k,
                    window.addEventListener(
                        "beforeunload", hj.tryCatch(a.disconnect,
                            "Data"), !1))
            }, "data"),
            n = hj.tryCatch(function() {
                hj.log.debug("Web Socket opened.",
                    "websocket");
                b = !0;
                g = !1;
                hj.dataPusher.pushToServer()
            }, "data"),
            k = hj.tryCatch(function(a) {
                hj.log.debug("Web Socket closed.",
                    "websocket");
                a.wasClean || hj.log.warn(
                    "Websocket close was unclean: " + a
                    .code);
                b && (b = !1)
            }, "data"),
            q = hj.tryCatch(function() {
                var a;
                return hj.host === hj.defaults.host ? (a =
                        parseInt(m.get().slice(-10), 16) %
                        9 + 1, "ins" + a + ".hotjar.com") :
                    hj.host
            }, "data");
        return a
    }, "data")();
    hj.dataPusher = hj.tryCatch(function() {
        var a = {},
            b = void 0,
            g = void 0;
        a.pushToServerLater = hj.tryCatch(function() {
            "undefined" === typeof b && (b =
                setInterval(a.pushToServer, 5E3))
        }, "data");
        a.pushToServer = hj.tryCatch(function() {
            hj.webSocket.isConnected() && f(hj.dataQueue
                .pushData) && (clearInterval(b), b =
                setInterval(a.pushToServer, 5E3),
                clearInterval(g), g = setInterval(
                    hj.webSocket.ping, 5E4), c())
        }, "data");
        var d = hj.tryCatch(function(a) {
                hj.property.get("pageVisitId") && (a.page_visit_id =
                    hj.property.get("pageVisitId"));
                "object" === typeof a.mutation && (a.mutation =
                    h(a.mutation));
                return hj.property.get("userId") + "\n" +
                    hj.json.stringify(a)
            }, "data"),
            h = hj.tryCatch(function(a) {
                var b, c = "";
                if ("object" === typeof a) return hj.hq.each(
                    a, function(f, h) {
                        "object" === typeof h.c &&
                            (hj.hq.each(h.c,
                                    function(h, d) {
                                        "object" ===
                                        typeof d.attributes &&
                                            "string" ===
                                            typeof d
                                            .attributes
                                            .style &&
                                            (d.attributes
                                                .style ===
                                                b &&
                                                d.id ===
                                                c &&
                                                (a[
                                                        f
                                                    ]
                                                    .c[
                                                        h
                                                    ] =
                                                    null
                                                ),
                                                b =
                                                d.attributes
                                                .style,
                                                c =
                                                d.id
                                            )
                                    }), a[f].c = a[
                                    f].c.filter(
                                    function(a) {
                                        return a
                                    }), a[f].c.length ||
                                delete a[f].c);
                        "undefined" === typeof a[f]
                            .a && ("undefined" ===
                                typeof a[f].b &&
                                "undefined" ===
                                typeof a[f].c &&
                                "undefined" ===
                                typeof a[f].d) && (
                                a[f] = null)
                    }), a.filter(function(a) {
                    return a
                })
            }, "data"),
            c = hj.tryCatch(function() {
                var a = d(hj.dataQueue.pushData);
                hj.dataQueue.clear();
                hj.webSocket.send(a)
            }, "data"),
            f = hj.tryCatch(function(a) {
                return !(hj.hq.isEmptyObject(a) || hj.isPreview)
            }, "data");
        return a
    }, "data")();
    hj.ajax = function() {
        var a = {};
        a.get = hj.tryCatch(function(a, g, d) {
            g = g || hj.hq.noop;
            if ("XDomainRequest" in window && null !==
                window.XDomainRequest && 10 > hj.utils.ieVersion()
            ) {
                var h = new XDomainRequest;
                h._hjDontCapture = !1 === d;
                h.open("get", a);
                h.onprogress = function() {};
                h.onload = function() {
                    hj.tryCatch(g, "Data")(h.responseText &&
                        hj.json.parse(h.responseText)
                    )
                };
                h.send()
            } else hj.hq.ajax({
                url: a,
                success: hj.tryCatch(g, "Data"),
                requestAnnotator: function(a) {
                    a._hjDontCapture = !1 === d
                }
            })
        }, "data");
        a.post = hj.tryCatch(function(a, g, d, h) {
            d = d || hj.hq.noop;
            if ("XDomainRequest" in window && null !==
                window.XDomainRequest && 10 > hj.utils.ieVersion()
            ) {
                var c = new XDomainRequest;
                c._hjDontCapture = !1 === h;
                c.open("post", a);
                c.onprogress = function() {};
                c.onload = function() {
                    hj.tryCatch(d, "Data")(c.responseText &&
                        hj.json.parse(c.responseText)
                    )
                };
                c.send(hj.json.stringify(g))
            } else d = d || hj.hq.noop, hj.hq.ajax({
                url: a,
                type: "POST",
                data: hj.json.stringify(g),
                contentType: "application/json",
                success: hj.tryCatch(d, "Data"),
                requestAnnotator: hj.tryCatch(
                    function(a) {
                        a._hjDontCapture = !1 ===
                            h
                    }, "Data")
            })
        }, "data");
        return a
    }();
    hj.dataQueue = hj.tryCatch(function() {
        var a = {
                pushData: {},
                pushDataDirty: !1
            },
            b = 0,
            g = [];
        a.startSendingData = hj.tryCatch(function(a) {
            hj.log.debug("Data queue has been setup: " +
                hj.json.stringify(a), "dataQueue");
            c(a, !0);
            b--;
            b || (hj.log.debug(
                "No more pending queue setups. Processing push data queue.",
                "dataQueue"), d())
        }, "data");
        a.create = hj.tryCatch(function() {
            b++;
            hj.log.debug(
                "Starting a new data queue. No further events sent until all pending queues have been setup.",
                "dataQueue")
        }, "data");
        a.pushLater = hj.tryCatch(function(a, c, d) {
            hj.log.debug("Push Later (" + a + ")",
                "dataQueue", c);
            b ? h(a, c, d) : f(a, c, d)
        }, "data");
        a.pushImmediately = hj.tryCatch(function(a, f, d) {
            hj.log.debug("Push Immediately (" + a + ")",
                "dataQueue", f);
            b ? h(a, f, d) : c(a, f, d)
        }, "data");
        a.clear = hj.tryCatch(function() {
            a.pushData = {};
            a.pushDataDirty = !1
        }, "data");
        var d = hj.tryCatch(function() {
                hj.hq.each(g, function(a, b) {
                    c(b[0], b[1], b[2])
                });
                hj.log.debug("Processing pushData queue.",
                    "dataQueue")
            }, "data"),
            h = hj.tryCatch(function(a, b, c) {
                hj.log.debug("Adding data to queue (" + a +
                    ")", "dataQueue", b);
                g.push([a, b, c])
            }, "data"),
            c = hj.tryCatch(function(a, b, c) {
                m(a, b, c);
                hj.dataPusher.pushToServer()
            }, "data"),
            f = hj.tryCatch(function(a, b, c) {
                m(a, b, c);
                hj.dataPusher.pushToServerLater()
            }, "data"),
            m = hj.tryCatch(function(a, b, c) {
                "undefined" !== typeof a && ("object" ===
                    typeof a ? hj.hq.each(a, function(a,
                        b) {
                        l(a, b, !0)
                    }) : "string" === typeof a && l(a,
                        b, c))
            }, "data"),
            l = hj.tryCatch(function(b, c, f) {
                f ? a.pushData[b] = c : (a.pushData[b] = a.pushData[
                    b] || [], a.pushData[b].push(c));
                a._pushDataDirty = !0;
                hj.webSocket.connect()
            }, "data");
        return a
    }, "data")();
    hj.property = hj.tryCatch(function() {
        var a = {},
            b = {},
            g = {};
        a.ready = hj.tryCatch(function(a, h) {
            h = hj.tryCatch(h, "Data");
            g[a] ? (hj.log.debug("Property " + a +
                " is ready. Calling callback() now.",
                "property", h), h(g[a])) : (hj.log.debug(
                "Property " + a +
                " is not ready. Saving callback().",
                "property", h), b[a] ? b[a].push(
                h) : b[a] = [h])
        }, "data");
        a.set = hj.tryCatch(function(a, h) {
            hj.log.debug("Setting properties." + a +
                " to " + h, "property");
            g[a] = h;
            "object" === typeof b[a] && (hj.hq.each(b[a],
                function(b, f) {
                    hj.log.debug("Calling " + a +
                        " callback.",
                        "property");
                    f(h)
                }), b[a] = {})
        }, "data");
        a.get = hj.tryCatch(function(a) {
            return g[a]
        }, "data");
        return a
    }, "data")();
    hj.event = hj.tryCatch(function() {
        var a = {},
            b = [],
            g = {};
        a.listen = hj.tryCatch(function(a, c) {
            b.unshift({
                eventIds: a,
                callback: hj.tryCatch(c, "Data")
            });
            d()
        }, "data");
        a.signal = hj.tryCatch(function(a, b) {
            "undefined" === typeof b ? hj.log.debug(
                'Event signalled: "' + a + '".',
                "event") : hj.log.debug(
                'Event signalled: "' + a +
                '". Data: "' + hj.json.stringify(b) +
                '".', "event");
            g[a] = "undefined" === typeof b ? !0 : b;
            d()
        }, "data");
        var d = hj.tryCatch(function() {
            var a, c, f, d;
            for (c in g)
                if (g.hasOwnProperty(c))
                    for (a = b.length - 1; 0 <= a; a -=
                        1) d = b[a], f = hj.hq.indexOf(
                            c, d.eventIds), -1 !== f &&
                        (hj.log.debug(
                            'Event triggered: "' +
                            c + '".', "event"), d.callback(
                            g[c]), delete g[c])
        }, "data");
        return a
    }, "data")()
}, "data")();
hj.tryCatch(function() {
    hj.notification = function() {
        function m() {
            hj.hq("#" + b).removeClass(b + "_active");
            setTimeout(function() {
                hj.hq("#" + b).remove()
            }, 350)
        }
        var a = {},
            b = "_hj-f5b2a1eb-9b07_hotjar_notification",
            g =
            '                    <style type="text/css">                        #' +
            b + ", #" + b +
            ' * {                            font-family: "Open Sans", Helvetica, Arial, sans-serif, Tahoma !important;                        }                                                #' +
            b +
            " {                            transition-duration: .3s;                            opacity: 0;                            transform: scale(.9);                        }                                                #" +
            b + "." + b +
            "_active {                            opacity: 1;                            transform: scale(1);                        }                                                #" +
            b +
            " {                                background: #263345;                                border-radius: 2px;                                position: fixed;                                z-index: 2147483646;                                top: 20px;                                left: 20px;                                width: 400px;                                padding: 25px;                                -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);                                -moz-box-shadow:    0 2px 4px 0 rgba(0,0,0,.3);                                box-shadow:         0 2px 4px 0 rgba(0,0,0,.3);                        }                                                #" +
            b + " ." + b +
            "_status {                            float: left;                            margin: 0 20px 0 0;                            border-radius: 50%;                            width: 50px;                            height: 50px;                            -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);                            -moz-box-shadow:    0 2px 4px 0 rgba(0,0,0,.3);                            box-shadow:         0 2px 4px 0 rgba(0,0,0,.3);                        }                                                #" +
            b + " ." + b +
            "_status_good {                            background: url(//<%= hjStaticHost %>/static/client/modules/assets/checkmark@2x.png)                                             no-repeat 52% 53% #3ACC40;                            background-size: 25px 18px;                        }                                                #" +
            b + " ." + b +
            "_status_bad {                            background: url(//<%= hjStaticHost %>/static/client/modules/assets/attention@2x.png)                                             no-repeat center center #EA4031;                            background-size: 6px 30px;                        }                                                #" +
            b + " ." + b +
            "_status {                            float: left;                        }                                                                        #" +
            b + " ." + b +
            "_content {                            float: left;                            color: #dedede;                            font-size: 13px;                            width: 78%;                            min-height: 50px;                            vertical-align: middle;                        }                                                #" +
            b + " ." + b +
            "_title {                            color: white;                            font-size: 16px;                            font-weight: bold;                            margin: 0 0 4px 0;                            display: inline-block                        }                                                ." +
            b +
            "_close {                            position: absolute;                            top: 15px;                            right: 15px;                            font-size: 22px;                            color: white;                            cursor: pointer;                            line-height: 11px;                        }                                                _hj-f5b2a1eb-9b07_clear {                            clear: both;                        }                                            </style>",
            d = '                    <div id="' + b +
            '">                        <div class="' + b +
            '_close">&times;</div>                        <% if (status) { %>                            <div class="' +
            b + "_status                             " + b +
            '_status_<%= status %>"></div>                        <% } %>                        <div class="' +
            b +
            '_content">                            <% if (title) { %>                                <span class="' +
            b +
            '_title"><%= title %></span>                            <% } %>                            <% if (message) { %>                                <br /><%= message %>                            <% } %>                        </div>                        <div class="_hj-f5b2a1eb-9b07_clear" />                    </div>                ';
        a.show = function(a, c, f) {
            a = hj.rendering.renderTemplate(g + d, {
                title: a,
                message: c,
                status: f || "good",
                hjStaticHost: new hj.rendering.TrustedString(
                    hj.staticHost)
            });
            hj.rendering.addToDom(b, a);
            hj.hq("." + b + "_close").on("click", m);
            setTimeout(function() {
                hj.hq("#" + b).addClass(b + "_active")
            }, 1)
        };
        return a
    }()
}, "notifications")();
hj.tryCatch(function() {
    hj.loader.registerModule("Command", function() {
        function m() {
            d.push = function() {
                var b;
                for (b = 0; b < arguments.length; b +=
                    1) this[this.length] = arguments[b];
                a();
                return this.length
            }
        }

        function a() {
            var b = Array.prototype.slice.call(d.shift()),
                f = g[b[0]],
                h = b.slice(1);
            hj.log.debug("Processing command: " + b.join(
                ", "), "command");
            hj.hq.isFunction(f) ? hj.tryCatch(f, "command")
                (h) : hj.log.debug('Unknown command: "' + b[
                    0] + '"', "command");
            0 < d.length && hj.tryCatch(a)()
        }
        var b = {},
            g = {},
            d = window.hj.q,
            h = !1;
        g.vpv = function(a) {
            a = a[0];
            hj.includedInSample && a && (hj.log.debug(
                    'Sending virtual page view for URL "' +
                    location.protocol + "//" + location
                    .hostname + a + '"', "command"), hj
                .pageVisit.requirePageVisitId = !0, hj.pageVisit
                .track(location.protocol + "//" +
                    location.hostname + a))
        };
        g.formSubmitSuccessful = function() {
            hj.forms.cmdFormSubmitSuccessful()
        };
        g.formSubmitFailed = function() {
            hj.forms.cmdFormSubmitFailed()
        };
        g.tagRecording = function(a) {
            a[0] && hj.behaviorData.tagRecording(a[0])
        };
        g.trigger = function(a) {
            a[0] && hj.event.signal("trigger:" + a[0])
        };
        g._xhr = function() {};
        g.ready = function(a) {
            a.forEach(function(a) {
                a()
            })
        };
        b.run = function() {
            hj.command = this
        };
        b.activate = function() {
            h || (h = !0, m(), 0 < d.length && a())
        };
        hj.initialPageVisitSent && b.activate();
        return b
    }())
}, "command")();
hj.tryCatch(function() {
    hj.loader.registerModule("DeferredPageContentModule", function() {
        function m(a, b) {
            var g = hj.apiUrlBase + "/sites/" + hj.settings
                .site_id + "/deferred-page-content/" + a,
                d = hj.url.getParameter("hjDelay"),
                h = d ? d : 1E3;
            hj.ajax.get(g + "/is-empty", function(a) {
                a.is_empty && (hj.log.debug(
                        "Deferred page content is empty: " +
                        a.is_empty,
                        "DeferredPageContent"),
                    setTimeout(hj.tryCatch(
                        function() {
                            hj.ajax.post(g, {
                                url: location
                                    .href,
                                content: hj
                                    .html
                                    .getPageContent()
                            })
                        }, "dpc"), h))
            })
        }
        return {
            run: function() {
                hj.hq.each(hj.settings.deferred_page_contents || [],
                    function(a, b) {
                        hj.targeting.onMatch(b.targeting,
                            function() {
                                m(b.id);
                                return !1
                            })
                    })
            }
        }
    }(), !1)
}, "deferredpagecontent")();
hj.tryCatch(function() {
    hj.loader.registerModule("BehaviorData", function() {
        var m = {},
            a, b = !1,
            g, d, h;
        g = function() {
            var c = {};
            c.mouseClick = hj.tryCatch(function() {
                var a = {},
                    c = !1;
                a.listen = hj.tryCatch(function() {
                    c || (hj.log.debug(
                            "Setting up mouse click listeners.",
                            "events"),
                        hj.hq(document)
                        .on("mousedown",
                            a.send), c = !
                        0)
                }, "behavior-data");
                a.send = hj.tryCatch(function(a) {
                    var c = hj.dom.getPath(
                            hj.hq(a.target)
                        ),
                        f = [],
                        d;
                    "target" in a && (
                            "pageX" in a &&
                            "pageY" in a &&
                            void 0 !== c) &&
                        (d = hj.hq(a.target)
                            .offset(), f.left =
                            a.pageX - d.left,
                            f.top = a.pageY -
                            d.top, a = {
                                offset_x: f
                                    .left,
                                offset_y: f
                                    .top,
                                selector: c
                            }, b && (a.time =
                                (new Date).getTime() -
                                hj.startTime
                            ), hj.dataQueue
                            .pushImmediately(
                                "mouse_click",
                                a, !0))
                }, "behavior-data");
                return a
            }, "behavior-data")();
            c.mouseMove = hj.tryCatch(function() {
                var c = {},
                    d = !1,
                    h = 0,
                    g = 0,
                    k = !1,
                    m = 0,
                    t = 0,
                    r = null;
                c.listen = hj.tryCatch(function() {
                    d || (hj.log.debug(
                            "Setting up mouse move listeners.",
                            "events"),
                        hj.hq(document)
                        .on("mousemove",
                            c.update),
                        setInterval(c.send,
                            100), d = !
                        0)
                }, "behavior-data");
                c.update = hj.tryCatch(function(a) {
                    var b,
                        c;
                    h = a.clientX;
                    g = a.clientY;
                    b = hj.hq(document.elementFromPoint(
                        h, g));
                    if (b[0] && (c = b.offset()))
                        m = a.pageX -
                        parseInt(c.left, 10),
                        t = a.pageY -
                        parseInt(c.top, 10),
                        r = hj.dom.getPath(
                            b), k = !0
                }, "behavior-data");
                c.send = hj.tryCatch(function() {
                    k && (b && hj.dataQueue
                        .pushLater(
                            "mouse_move", {
                                time: (
                                        new Date
                                    ).getTime() -
                                    hj.startTime,
                                x: h,
                                y: g
                            }), a && hj
                        .dataQueue.pushLater(
                            "relative_mouse_move", {
                                offset_x: m,
                                offset_y: t,
                                selector: r
                            }), k = !1)
                }, "behavior-data");
                return c
            }, "behavior-data")();
            c.frameMouseClicks = hj.tryCatch(function() {
                var a = {},
                    c = !1;
                a.listen = hj.tryCatch(function() {
                        c || (hj.log.debug(
                                "Setting up frame mouse click listeners.",
                                "events"),
                            a.send(), c = !
                            0)
                    },
                    "behavior-data.frameMouseClicks.listen"
                );
                a.send = hj.tryCatch(function() {
                        var a = hj.hq("iframe"),
                            c = !1,
                            f = location.protocol +
                            "//" + hj.hostname +
                            (location.port ?
                                ":" + location.port :
                                ""),
                            d = hj.utils.isFirefox() ?
                            document : window;
                        if (a.length) {
                            var h = function() {
                                "notIE" ===
                                hj.utils.ieVersion() &&
                                    hj.hq(
                                        window
                                    ).focus();
                                c = !1
                            };
                            hj.hq.each(a,
                                function(a,
                                    b) {
                                    if (-1 !==
                                        b.src
                                        .indexOf(
                                            f
                                        ))
                                        hj.hq(
                                            b
                                            .contentWindow
                                        ).on(
                                            "mousedown",
                                            function(
                                                a
                                            ) {
                                                g
                                                    (
                                                        b,
                                                        a
                                                    )
                                            }
                                        );
                                    else hj
                                        .hq(
                                            b
                                        ).on(
                                            "mouseover",
                                            function() {
                                                c
                                                    =
                                                    b
                                            }
                                        );
                                    hj.hq(b)
                                        .on(
                                            "mouseout",
                                            h
                                        )
                                });
                            hj.hq(d).on("blur",
                                function() {
                                    c && g(
                                        c
                                    )
                                });
                            var g = function(a,
                                c) {
                                var f = hj.hq(
                                        a),
                                    d = hj.dom
                                    .getPath(
                                        f),
                                    h = [];
                                d && (c ? (
                                        h
                                        .left =
                                        c
                                        .pageX,
                                        h
                                        .top =
                                        c
                                        .pageY
                                    ) :
                                    (h.left =
                                        f
                                        .width() /
                                        2,
                                        h
                                        .top =
                                        f
                                        .height() /
                                        2
                                    ),
                                    f = {
                                        offset_x: h
                                            .left,
                                        offset_y: h
                                            .top,
                                        selector: d
                                    },
                                    b &&
                                    (f.time =
                                        (
                                            new Date
                                        )
                                        .getTime() -
                                        hj
                                        .startTime
                                    ),
                                    hj.dataQueue
                                    .pushImmediately(
                                        "mouse_click",
                                        f, !
                                        0
                                    ))
                            }
                        }
                    },
                    "behavior-data.frameMouseClicks.send"
                );
                return a
            }, "behavior-data.frameMouseClicks")();
            c.scrollReach = hj.tryCatch(function() {
                var a = {},
                    b = !1,
                    c = 0;
                a.listen = hj.tryCatch(function() {
                        b || (hj.log.debug(
                                "Setting up scroll reach listeners.",
                                "events"),
                            hj.hq(window).on(
                                "scroll resize",
                                a.send), b = !
                            0)
                    },
                    "behavior-data.scrollReach.listen"
                );
                a.send = hj.tryCatch(function() {
                        var a = hj.ui.getBottomAsPercentage();
                        a > c && (c = a, hj.dataQueue
                            .pushLater(
                                "scroll_reach", {
                                    max_bottom: c
                                }, !0))
                    },
                    "behavior-data.scrollReach.send"
                );
                return a
            }, "behavior-data.scrollReach")();
            c.scroll = hj.tryCatch(function() {
                var a = {},
                    b = !1,
                    c = !1;
                a.listen = hj.tryCatch(function() {
                        b || (hj.log.debug(
                                "Setting up scroll listeners.",
                                "events"),
                            hj.hq(window).on(
                                "scroll", a
                                .update),
                            setInterval(a.send,
                                100), 0 !==
                            hj.ui.distanceFromTop() &&
                            a.update(), b = !
                            0)
                    },
                    "behavior-data.scroll.listen"
                );
                a.update = hj.tryCatch(function() {
                        c = !0
                    },
                    "behavior-data.scroll.update"
                );
                a.send = hj.tryCatch(function() {
                        c && (hj.dataQueue.pushLater(
                            "scroll", {
                                time: (
                                        new Date
                                    ).getTime() -
                                    hj.startTime,
                                y: hj.ui
                                    .distanceFromTop()
                            }), c = !1)
                    },
                    "behavior-data.scroll.send"
                );
                return a
            }, "behavior-data.scroll")();
            c.viewportResize = hj.tryCatch(function() {
                var a = {},
                    b = !1;
                a.listen = hj.tryCatch(function() {
                        b || (hj.log.debug(
                                "Setting up screen size change listeners.",
                                "events"),
                            setInterval(a.checkResize,
                                1E3), a.checkResize(),
                            b = !0)
                    },
                    "behavior-data.viewportResize.listen"
                );
                a.checkResize = hj.tryCatch(
                    function() {
                        var b = hj.ui.getWindowSize();
                        if (b.width !== hj.windowSize
                            .width || b.height !==
                            hj.windowSize.height
                        ) hj.windowSize = b, a.send()
                    },
                    "behavior-data.viewportResize.checkResize"
                );
                a.send = hj.tryCatch(function() {
                        hj.dataQueue.pushImmediately(
                            "viewport_resize", {
                                time: (new Date)
                                    .getTime() -
                                    hj.startTime,
                                w: hj.windowSize
                                    .width,
                                h: hj.windowSize
                                    .height
                            })
                    },
                    "behavior-data.viewportResize.send"
                );
                return a
            }, "behavior-data.viewportResize")();
            c.keyPress = hj.tryCatch(function() {
                var a = {},
                    b = !1,
                    c = !1,
                    d = !1,
                    h = [];
                a.listen = hj.tryCatch(function() {
                        b || (hj.log.debug(
                                "Setting up key press listeners.",
                                "events"),
                            hj.hq(document)
                            .on("input",
                                "input", a.update
                            ), hj.hq(
                                document).on(
                                "blur",
                                "input", a.send
                            ), hj.hq(
                                document).on(
                                "input",
                                "textarea",
                                a.update),
                            hj.hq(document)
                            .on("blur",
                                "textarea",
                                a.send), b = !
                            0)
                    },
                    "behavior-data.keyPress.listen"
                );
                a.update = hj.tryCatch(function(a) {
                        a = hj.hq(a.target);
                        var b = a.val();
                        d |= !1 === hj.settings
                            .recording_capture_keystrokes;
                        d |= a.is(
                            "input[type=password]"
                        );
                        d |= !isNaN(parseInt(b,
                            10)) && 12 < b.length;
                        d |= "undefined" !==
                            typeof a.attr(
                                "data-hj-masked"
                            );
                        for (var f = a[0].parentNode; f &&
                            !d;) f.attributes &&
                            f.attributes[
                                "data-hj-masked"
                            ] && (d = !0), f =
                            f.parentNode;
                        h.push({
                            time: (new Date)
                                .getTime() -
                                hj.startTime,
                            selector: hj
                                .dom.getPath(
                                    a),
                            text: b
                        });
                        c = !0
                    },
                    "behavior-data.keyPress.update"
                );
                a.send = hj.tryCatch(function() {
                        c && (d && hj.hq.each(h,
                                function(a,
                                    b) {
                                    b.text =
                                        Array(
                                            b
                                            .text
                                            .length +
                                            1
                                        ).join(
                                            "*"
                                        )
                                }), hj.dataQueue
                            .pushImmediately(
                                "key_press",
                                h, !0), d =
                            c = !1, h = [])
                    },
                    "behavior-data.keyPress.send"
                );
                return a
            }, "behavior-data.keyPress")();
            c.selectChange = hj.tryCatch(function() {
                var a = {},
                    b = !1;
                a.listen = hj.tryCatch(function() {
                        b || (hj.log.debug(
                                "Setting up select change listeners.",
                                "events"),
                            hj.hq(document)
                            .on("change",
                                "select", a
                                .send), b = !
                            0)
                    },
                    "behavior-data.selectChange.listen"
                );
                a.send = hj.tryCatch(function(a) {
                        var b = hj.hq(a.target);
                        a = hj.dom.getPath(b);
                        b = b.val();
                        hj.dataQueue.pushImmediately(
                            "select_change", {
                                value: b,
                                selector: a,
                                time: (new Date)
                                    .getTime() -
                                    hj.startTime
                            }, !0)
                    },
                    "behavior-data.selectChange.send"
                );
                return a
            }, "behavior-data")();
            c.inputChoiceChange = hj.tryCatch(function() {
                var a = {},
                    b = !1;
                a.listen = hj.tryCatch(function() {
                        b || (hj.log.debug(
                                "Setting up input choice change listeners.",
                                "events"),
                            hj.hq(document)
                            .on("change",
                                "input[type=checkbox], input[type=radio]",
                                a.send), b = !
                            0)
                    },
                    "behavior-data.inputChoiceChange.listen"
                );
                a.send = hj.tryCatch(function(a) {
                        var b = hj.hq(a.target);
                        a = hj.dom.getPath(b);
                        b = b.is(":checked");
                        hj.dataQueue.pushImmediately(
                            "input_choice_change", {
                                value: b,
                                selector: a,
                                time: (new Date)
                                    .getTime() -
                                    hj.startTime
                            }, !0)
                    },
                    "behavior-data.inputChoiceChange.send"
                );
                return a
            }, "behavior-data.inputChoiceChange")();
            return c
        }();
        d = hj.tryCatch(function() {
            var a = {};
            a.setup = hj.tryCatch(function(a) {
                hj.dataQueue.create();
                hj.pageVisit.requirePageVisitId();
                hj.property.ready("pageVisitId",
                    function() {
                        hj.dataQueue.startSendingData({
                            heatmap_helo: {
                                heatmap_id: a,
                                max_bottom: hj
                                    .ui
                                    .getBottomAsPercentage()
                            }
                        })
                    });
                g.mouseMove.listen();
                g.mouseClick.listen();
                g.scrollReach.listen();
                g.frameMouseClicks.listen()
            }, "behavior-data.heatmap.setup");
            return a
        }, "behavior-data.heatmap")();
        h = hj.tryCatch(function() {
            var a = {
                tagsToProcess: [],
                active: !1
            };
            a.start = hj.tryCatch(function() {
                b = !0;
                sessionStorage.setItem(
                    "_hjRecordingEnabled", !
                    0);
                hj.dataQueue.create();
                hj.pageVisit.requirePageVisitId();
                hj.property.ready("pageVisitId",
                    a.initializeTreeMirror);
                hj.property.ready(
                    "pageContentId",
                    function() {
                        hj.dataQueue.startSendingData({
                            recording_helo: {
                                start_time: (
                                        new Date
                                    )
                                    .getTime() -
                                    hj
                                    .startTime,
                                playback_version: 2,
                                page_content_id: hj
                                    .property
                                    .get(
                                        "pageContentId"
                                    )
                            }
                        });
                        a.tagsToProcess.length &&
                            hj.dataQueue.pushImmediately(
                                "tag_recording",
                                a.tagsToProcess, !
                                0, !1);
                        a.active = !0
                    });
                g.scroll.listen();
                g.keyPress.listen();
                g.mouseMove.listen();
                g.mouseClick.listen();
                g.selectChange.listen();
                g.viewportResize.listen();
                g.frameMouseClicks.listen();
                g.inputChoiceChange.listen()
            }, "behavior-data.recording.start");
            a.sendPageContent = function(a) {
                var b = hj.md5(a),
                    c = hj.apiUrlBase + "/sites/" +
                    hj.settings.site_id + "/pages/" +
                    hj.property.get("pageId");
                hj.ajax.get(c + "/content-id/" + b,
                    hj.tryCatch(function(d) {
                            d.exists ? hj.property
                                .set(
                                    "pageContentId",
                                    d.page_content_id
                                ) : hj.ajax.post(
                                    c +
                                    "/content", {
                                        content: a,
                                        content_md5: b
                                    }, hj.tryCatch(
                                        function(
                                            a) {
                                            hj.property
                                                .set(
                                                    "pageContentId",
                                                    a
                                                    .page_content_id
                                                )
                                        },
                                        "behavior-data.sendPageContent.setPageContentId"
                                    ))
                        },
                        "behavior-data.sendPageContent.getPageContentId"
                    ))
            };
            a.initializeTreeMirror = hj.tryCatch(
                function() {
                    var b = {};
                    ("undefined" !== typeof window.MutationObserver ||
                        "undefined" !== typeof window
                        .WebKitMutationObserver ||
                        "undefined" !== typeof window
                        .MozMutationObserver) &&
                    new hj.treeMirrorClient(
                        document, {
                            initialize: function(
                                b, f) {
                                a.sendPageContent(
                                    hj.json
                                    .stringify({
                                        docType: hj
                                            .html
                                            .getPageDoctype(),
                                        rootId: b,
                                        children: f
                                    }))
                            },
                            applyChanged: function(
                                a, c, d, h) {
                                b = {};
                                if (a.length ||
                                    c.length ||
                                    d.length ||
                                    h.length
                                ) b.time =
                                    (new Date)
                                    .getTime() -
                                    hj.startTime,
                                    a.length &&
                                    (b.a =
                                        a),
                                    c.length &&
                                    (b.b =
                                        c),
                                    d.length &&
                                    (b.c =
                                        d),
                                    h.length &&
                                    (b.d =
                                        h),
                                    hj.dataQueue
                                    .pushLater(
                                        "mutation",
                                        b, !
                                        1)
                            }
                        })
                },
                "behavior-data.initializeTreeMirror"
            );
            return a
        }, "behavior-data.recording")();
        hj.behaviorData = hj.tryCatch(function() {
            return {
                tagRecording: function(a) {
                    a = a || [];
                    var b = [],
                        d, g;
                    for (d = 0; d < a.length; d +=
                        1) g = hj.hq.trim(a[d]), g.length &&
                        b.push({
                            name: g
                        });
                    b.length && (h.active ? hj.dataQueue
                        .pushImmediately(
                            "tag_recording", b, !
                            0, !1) : h.tagsToProcess =
                        b)
                },
                startRecording: function() {
                    hj.notification.show(
                        "Recording session",
                        "Hotjar is recording this session.",
                        "good");
                    h.start()
                },
                setupHeatmap: function(a) {
                    hj.notification.show(
                        "Collecting Heatmap data",
                        "Hotjar is tracking this session.",
                        "good");
                    d.setup(a)
                }
            }
        }, "behavior-data.behaviorData")();
        m.run = hj.tryCatch(function() {
            if (!hj.isPreview && (hj.includedInSample &&
                !(10 > hj.utils.ieVersion())) && (
                hj.hq.each(hj.hq(
                    "[data-hj-ignore-attributes]"
                ), function(a, b) {
                    hj.hq(b).find("*").attr(
                        "data-hj-ignore-attributes",
                        "")
                }), hj.hq.each(hj.settings.heatmaps || [],
                    function(b, f) {
                        hj.targeting.onMatch(f.targeting,
                            function() {
                                a = f.id;
                                d.setup(a);
                                return !1
                            })
                    }), hj.settings.record && !(11 >
                    hj.utils.ieVersion())))
                if (b = sessionStorage.getItem(
                        "_hjRecordingEnabled") ? !0 : !
                    1, hj.log.debug(
                        "_hjRecordingEnabled is set to " +
                        b, "recordings"), b ||
                    "undefined" === typeof hj.settings.record_targeting_rules ||
                    !hj.settings.record_targeting_rules
                    .length) h.start();
                else hj.targeting.onMatch(hj.settings.record_targeting_rules,
                    function() {
                        h.start()
                    })
        }, "behavior-data.run");
        return m
    }(), !1)
}, "behavior-data")();
hj.tryCatch(function() {
    hj.widget = function() {
        var m = {},
            a = "collapsed",
            b = ["ar", "fa", "he"],
            g, d = [],
            h = !1;
        m.ctrl = void 0;
        m.data = void 0;
        m.model = {};
        m.activeLanguageDirection = "ltr";
        m.widgetAttributePrefix = "_hj-f5b2a1eb-9b07";
        m.ctaLinks = {
            polls: "https://www.hotjar.com/?utm_source=client&utm_medium=poll&utm_campaign=insights",
            surveys: "https://www.hotjar.com/?utm_source=client&utm_medium=survey&utm_campaign=insights&utm_term=notusing",
            testers: "https://www.hotjar.com/?utm_source=client&utm_medium=recruiter&utm_campaign=insights"
        };
        m._ = function(a) {
            if (!g) throw Error(
                "No active language has been set yet.");
            return g[a]
        };
        m.addMatchingWidget = function(a, b) {
            h ? b() : d.push({
                created: a,
                callback: b
            })
        };
        m.runLatestMatchingWidget = function() {
            var a;
            d.forEach(function(b) {
                if (!a || a.created < b.created) a = b
            });
            a && a.callback();
            h = !0
        };
        m.setLanguage = hj.tryCatch(function(a) {
            var f = {
                af: {
                    age: "Ouderdom",
                    city: "Stad",
                    close: "Sluit",
                    email: "ePos",
                    female: "Vroulik",
                    full_name: "Volle naam",
                    male: "Manlik",
                    phone_number: "Telefoon nommer",
                    please_type_here: "Tik asb. hier ...",
                    powered_by_hotjar: "aangedryf deur Hotjar",
                    reply: "Antwoort",
                    send: "Stuur",
                    sent: "Gestuur",
                    sign_me_up: "Skryf my in!"
                },
                ar: {
                    age: "\u0627\u0644\u0639\u0645\u0631",
                    city: "\u0627\u0644\u0645\u062f\u064a\u0646\u0629",
                    close: "\u0623\u063a\u0644\u0642",
                    email: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0623\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
                    female: "\u0627\u0646\u062b\u0649",
                    full_name: "\u0627\u0644\u0623\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
                    male: "\u0630\u0643\u0631",
                    phone_number: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641",
                    please_type_here: "\u0631\u062c\u0627\u0621\u0627\u064b \u0627\u0643\u062a\u0628 \u0647\u0646\u0627...",
                    powered_by_hotjar: "\u0628\u0625\u062f\u0627\u0631\u0629 Hotjar",
                    reply: "\u0631\u062f",
                    send: "\u0623\u0631\u0633\u0650\u0644",
                    sent: "\u0623\u064f\u0631\u0633\u0650\u0644\u062a",
                    sign_me_up: "\u0631\u062c\u0627\u0621\u0627\u064b \u0627\u0643\u062a\u0628 \u0647\u0646\u0627..."
                },
                bg: {
                    age: "\u0412\u044a\u0437\u0440\u0430\u0441\u0442",
                    city: "\u0413\u0440\u0430\u0434",
                    close: "\u0417\u0430\u0442\u0432\u043e\u0440\u0438",
                    email: "E-mail",
                    female: "\u0416\u0435\u043d\u0430",
                    full_name: "\u0418\u043c\u0435 \u0438 \u0444\u0430\u043c\u0438\u043b\u0438\u044f",
                    male: "\u041c\u044a\u0436",
                    phone_number: "\u0422\u0435\u043b\u0435\u0444\u043e\u043d",
                    please_type_here: "\u041c\u043e\u043b\u044f \u043d\u0430\u043f\u0438\u0448\u0435\u0442\u0435 \u0412\u0430\u0448\u0438\u044f \u043e\u0442\u0433\u043e\u0432\u043e\u0440 \u0442\u0443\u043a...",
                    powered_by_hotjar: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442 \u043d\u0430 Hotjar",
                    reply: "\u041e\u0442\u0433\u043e\u0432\u043e\u0440",
                    send: "\u0418\u0437\u043f\u0440\u0430\u0442\u0438",
                    sent: "\u0418\u0437\u043f\u0440\u0430\u0442\u0435\u043d\u043e",
                    sign_me_up: "\u0417\u0430\u043f\u0438\u0448\u0438 \u043c\u0435!"
                },
                ca: {
                    age: "Edat",
                    city: "Ciutat",
                    close: "Tanca",
                    email: "E-mail",
                    female: "Dona",
                    full_name: "Nom complet",
                    male: "Home",
                    phone_number: "Tel\u00e8fon",
                    please_type_here: "Introdueix aqu\u00ed...",
                    powered_by_hotjar: "Gr\u00e0cies a Hotjar",
                    reply: "Respondre",
                    send: "Envia",
                    sent: "Enviat",
                    sign_me_up: "Apunta'm-hi!"
                },
                cs: {
                    age: "V\u011bk",
                    city: "M\u011bsto",
                    close: "Zav\u0159\u00edt",
                    email: "E-mail",
                    female: "\u017dena",
                    full_name: "Cel\u00e9 jm\u00e9no",
                    male: "Mu\u017e",
                    phone_number: "Telefon",
                    please_type_here: " Zde pros\u00edm odpov\u011bzte...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Odpov\u011bd\u011bt",
                    send: "Odeslat",
                    sent: "Odesl\u00e1no",
                    sign_me_up: "Zaregistruj m\u011b!"
                },
                da: {
                    age: "Alder",
                    city: "By",
                    close: "Luk",
                    email: "Email",
                    female: "Kvinde",
                    full_name: "Navn",
                    male: "Mand",
                    phone_number: "Telefonnummer",
                    please_type_here: "Skriv venligst her...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Svar",
                    send: "Send",
                    sent: "Sendt",
                    sign_me_up: "Deltag!"
                },
                de: {
                    age: "Alter",
                    city: "Stadt",
                    close: "Schliessen",
                    email: "E-Mail",
                    female: "Weiblich",
                    full_name: "Name",
                    male: "M\u00e4nnlich",
                    phone_number: "Telefonnummer",
                    please_type_here: "Bitte hier schreiben...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Antworten",
                    send: "Senden",
                    sent: "Gesendet",
                    sign_me_up: "Jetzt anmelden!"
                },
                el: {
                    age: "\u0397\u03bb\u03b9\u03ba\u03af\u03b1",
                    city: "\u03a0\u03cc\u03bb\u03b7",
                    close: "\u039a\u03bb\u03b5\u03af\u03c3\u03b9\u03bc\u03bf",
                    email: "Email",
                    female: "\u0393\u03c5\u03bd\u03b1\u03af\u03ba\u03b1",
                    full_name: "\u039f\u03bd\u03bf\u03bc\u03b1\u03c4\u03b5\u03c0\u03ce\u03bd\u03c5\u03bc\u03bf",
                    male: "\u0386\u03bd\u03b4\u03c1\u03b1\u03c2",
                    phone_number: "\u03a4\u03b7\u03bb\u03ad\u03c6\u03c9\u03bd\u03bf",
                    please_type_here: "\u03a0\u03b1\u03c1\u03b1\u03ba\u03b1\u03bb\u03ce \u03c0\u03bb\u03b7\u03ba\u03c4\u03c1\u03bf\u03bb\u03bf\u03b3\u03ae\u03c3\u03c4\u03b5 \u03b5\u03b4\u03ce...",
                    powered_by_hotjar: "\u03c5\u03bb\u03bf\u03c0\u03bf\u03b9\u03ae\u03b8\u03b7\u03ba\u03b5 \u03b1\u03c0\u03cc \u03c4\u03bf Hotjar",
                    reply: "\u0391\u03c0\u03ac\u03bd\u03c4\u03b7\u03c3\u03b7",
                    send: "\u0391\u03c0\u03bf\u03c3\u03c4\u03bf\u03bb\u03ae",
                    sent: "\u03a3\u03c4\u03ac\u03bb\u03b8\u03b7\u03ba\u03b5",
                    sign_me_up: "\u0395\u03b3\u03b3\u03c1\u03b1\u03c6\u03ae!"
                },
                en: {
                    age: "Age",
                    cancel: "Cancel",
                    change_selection: "Change selection",
                    click_to_select: "Click to Select",
                    city: "City",
                    close: "Close",
                    email: "Email",
                    email_example: "E.g. john@doe.com",
                    female: "Female",
                    full_name: "Full name",
                    highlight_element: "You can highlight an element to give specific feedback.",
                    include_screenshot_with_feedback: "Include screenshot with my feedback.",
                    male: "Male",
                    next: "Next",
                    phone_number: "Phone number",
                    please_type_here: "Please type here...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Reply",
                    send: "Send",
                    sent: "Sent",
                    sign_me_up: "Sign me up!",
                    select_the_area: "Select the area you want to give feedback on.",
                    tap_again_to_confirm: "Tap again to confirm",
                    tell_us_about_your_experience: "Tell us about your experience today. Please be blunt and detailed."
                },
                es: {
                    age: "Edad",
                    city: "Ciudad",
                    close: "Cerrar",
                    email: "Email",
                    female: "Mujer",
                    full_name: "Nombre completo",
                    male: "Hombre",
                    phone_number: "Tel\u00e9fono",
                    please_type_here: "Por favor, escriba aqu\u00ed...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Responder",
                    send: "Enviar",
                    sent: "Enviado",
                    sign_me_up: "\u00a1Inscr\u00edbeme!"
                },
                et: {
                    age: "Vanus",
                    city: "Linn",
                    close: "Sulge",
                    email: "Email",
                    female: "Naine",
                    full_name: "Nimi",
                    male: "Mees",
                    phone_number: "Tel. nr.",
                    please_type_here: "Palun sisestage siia...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Vasta",
                    send: "Saada",
                    sent: "Saadetud",
                    sign_me_up: "Registreeru!"
                },
                fa: {
                    age: "\u0633\u0646",
                    city: "\u0634\u0647\u0631",
                    close: "\u0628\u0633\u062a\u0646",
                    email: "\u067e\u0633\u062a \u0627\u0644\u06a9\u062a\u0631\u0648\u0646\u06cc\u06a9",
                    female: "\u0632\u0646",
                    full_name: "\u0646\u0627\u0645 \u06a9\u0627\u0645\u0644",
                    male: "\u0645\u0631\u062f",
                    phone_number: "\u0634\u0645\u0627\u0631\u0647 \u062a\u0644\u0641\u0646",
                    please_type_here: "\u0644\u0637\u0641\u0627 \u0627\u06cc\u0646\u062c\u0627 \u0628\u0646\u0648\u06cc\u0633\u06cc\u062f",
                    powered_by_hotjar: "\u0646\u06cc\u0631\u0648 \u06af\u0631\u0641\u062a\u0647 \u0627\u0632 Hotjar",
                    reply: "\u067e\u0627\u0633\u062e",
                    send: "\u0628\u0641\u0631\u0633\u062a",
                    sent: "\u0641\u0631\u0633\u062a\u0627\u062f\u0647 \u0634\u062f",
                    sign_me_up: "\u062b\u0628\u062a\u200c\u0646\u0627\u0645"
                },
                fi: {
                    age: "Ik\u00e4",
                    city: "Kaupunki",
                    close: "Sulje",
                    email: "S\u00e4hk\u00f6posti",
                    female: "Nainen",
                    full_name: "Koko nimi",
                    male: "Mies",
                    phone_number: "Puhelinnumero",
                    please_type_here: "Kirjoita t\u00e4h\u00e4n",
                    powered_by_hotjar: "Alustana toimii Hotjar",
                    reply: "Vastaa",
                    send: "L\u00e4het\u00e4",
                    sent: "L\u00e4hetetty",
                    sign_me_up: "Rekister\u00f6i minut!"
                },
                fr: {
                    age: "\u00c2ge",
                    city: "Ville",
                    close: "Fermer",
                    email: "E-mail",
                    female: "Femme",
                    full_name: "Nom et pr\u00e9nom",
                    male: "Homme",
                    phone_number: "Num\u00e9ro de t\u00e9l\u00e9phone",
                    please_type_here: "Ecrivez ici",
                    powered_by_hotjar: "Propuls\u00e9 par Hotjar",
                    reply: "R\u00e9pondre",
                    send: "Envoyer",
                    sent: "Envoy\u00e9",
                    sign_me_up: "M'inscrire !"
                },
                he: {
                    age: "\u05d2\u05d9\u05dc",
                    city: "\u05e2\u05d9\u05e8",
                    close: "\u05e1\u05d2\u05d5\u05e8",
                    email: "\u05d3\u05d5\u05d0\u05e8 \u05d0\u05dc\u05e7\u05d8\u05e8\u05d5\u05e0\u05d9",
                    female: "\u05e0\u05e7\u05d1\u05d4",
                    full_name: "\u05e9\u05dd \u05de\u05dc\u05d0",
                    male: "\u05d6\u05db\u05e8",
                    phone_number: "\u05d8\u05dc\u05e4\u05d5\u05df",
                    please_type_here: "\u05d4\u05e7\u05dc\u05d3 \u05db\u05d0\u05df...",
                    powered_by_hotjar: "\u05e4\u05d5\u05e2\u05dc \u05d1\u05d0\u05de\u05e6\u05e2\u05d5\u05ea Hotjar",
                    reply: "\u05ea\u05d2\u05d5\u05d1\u05d4",
                    send: "\u05e9\u05dc\u05d7",
                    sent: "\u05e0\u05e9\u05dc\u05d7",
                    sign_me_up: "\u05d4\u05e8\u05e9\u05dd \u05e2\u05db\u05e9\u05d9\u05d5!"
                },
                hr: {
                    age: "Dob",
                    city: "Mjesto",
                    close: "Zatvori",
                    email: "Email",
                    female: "\u017densko",
                    full_name: "Ime i prezime",
                    male: "Mu\u0161ko",
                    phone_number: "Telefon",
                    please_type_here: "Pi\u0161ite ovdje",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Odgovor",
                    send: "Po\u0161alji",
                    sent: "Poslano",
                    sign_me_up: "Prijavi me!"
                },
                hu: {
                    age: "Kor",
                    city: "Telep\u00fcl\u00e9s",
                    close: "Bez\u00e1r\u00e1s",
                    email: "E-mail",
                    female: "N\u0151",
                    full_name: "Teljes n\u00e9v",
                    male: "F\u00e9rfi",
                    phone_number: "Telefon",
                    please_type_here: "Ide \u00edrhat...",
                    powered_by_hotjar: "k\u00e9sz\u00edtette a Hotjar",
                    reply: "V\u00e1lasz",
                    send: "K\u00fcld\u00e9s",
                    sent: "Elk\u00fcldve",
                    sign_me_up: "Regisztr\u00e1lok!"
                },
                it: {
                    age: "Et\u00e0",
                    city: "Citt\u00e0",
                    close: "Chiudi",
                    email: "Email",
                    female: "Femmina",
                    full_name: "Nome e cognome",
                    male: "Maschio",
                    phone_number: "Telefono",
                    please_type_here: "Scrivi qui...",
                    powered_by_hotjar: "offerto da Hotjar",
                    reply: "Rispondi",
                    send: "Invia",
                    sent: "Inviato",
                    sign_me_up: "Iscrivimi!"
                },
                ja: {
                    age: "\u5e74\u9f62",
                    city: "\u5e02\u533a\u753a\u6751",
                    close: "\u9589\u3058\u308b",
                    email: "\u96fb\u5b50\u30e1\u30fc\u30eb",
                    female: "\u5973\u6027",
                    full_name: "\u59d3\u540d",
                    male: "\u7537\u6027",
                    phone_number: "\u96fb\u8a71\u756a\u53f7",
                    please_type_here: "\u304a\u554f\u3044\u5408\u308f\u305b\u5185\u5bb9\u3092\u4e0b\u8a18\u306b\u3054\u8a18\u5165\u304f\u3060\u3055\u3044\uff0e\uff0e\uff0e",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "\u8fd4\u4fe1",
                    send: "\u9001\u4fe1",
                    sent: "\u9001\u4fe1\u5b8c\u4e86\u3057\u307e\u3057\u305f",
                    sign_me_up: "\u767b\u9332\u3057\u307e\u3059"
                },
                ko: {
                    age: "\ub098\uc774",
                    city: "\ub3c4\uc2dc",
                    close: "\ub2eb\uae30",
                    email: "\uc774\uba54\uc77c",
                    female: "\uc5ec\uc790",
                    full_name: "\uc774\ub984",
                    male: "\ub0a8\uc790",
                    phone_number: "\uc804\ud654\ubc88\ud638",
                    please_type_here: "\uc5ec\uae30\uc5d0 \uc785\ub825\ud574\uc8fc\uc138\uc694",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "\ub2f5\ubcc0\ud558\uae30",
                    send: "\ubcf4\ub0b4\uae30",
                    sent: "\ubcf4\ub0c8\uc2b5\ub2c8\ub2e4",
                    sign_me_up: "\ucc38\uc5ec\ud558\uae30!"
                },
                lt: {
                    age: "Am\u017eius",
                    city: "Miestas",
                    close: "U\u017edaryti",
                    email: "El. pa\u0161tas",
                    female: "Moteris",
                    full_name: "Pilnas vardas",
                    male: "Vyras",
                    phone_number: "Telefonas",
                    please_type_here: "Ra\u0161yti \u010dia...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Atsakyti",
                    send: "Si\u0173sti",
                    sent: "I\u0161siusta",
                    sign_me_up: "Registruotis"
                },
                lv: {
                    age: "Vecums",
                    city: "Pils\u0113ta",
                    close: "Aizv\u0113rt",
                    email: "E-pasts",
                    female: "Sieviete",
                    full_name: "Pilns v\u0101rds",
                    male: "V\u012brietis",
                    phone_number: "T\u0101lru\u0146a numurs",
                    please_type_here: "L\u016bdzu, ievadiet \u0161eit...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Atbilde",
                    send: "Nos\u016bt\u012bt",
                    sent: "Nos\u016bt\u012bts",
                    sign_me_up: "Pierakstiet mani!"
                },
                mis: {
                    age: "Starost",
                    city: "Grad",
                    close: "Zatvori",
                    email: "Email",
                    female: "\u017densko",
                    full_name: "Ime i prezime",
                    male: "Mu\u0161ko",
                    phone_number: "Telefon",
                    please_type_here: "Pi\u0161ite ovdje...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Odgovori",
                    send: "Po\u0161alji",
                    sent: "Poslato",
                    sign_me_up: "Prijavi me!"
                },
                nb: {
                    age: "Alder",
                    city: "Sted",
                    close: "Lukk",
                    email: "E-post",
                    female: "Kvinne",
                    full_name: "Navn",
                    male: "Mann",
                    phone_number: "Telefon",
                    please_type_here: "Skriv her...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Svar",
                    send: "Send",
                    sent: "Sendt",
                    sign_me_up: "Delta!"
                },
                nl: {
                    age: "Leeftijd",
                    city: "Plaats",
                    close: "Sluiten",
                    email: "E-mailadres",
                    female: "Vrouw",
                    full_name: "Volledige naam",
                    male: "Man",
                    phone_number: "Telefoonnummer",
                    please_type_here: "Uw bericht...",
                    powered_by_hotjar: "ondersteund door Hotjar",
                    reply: "Reageer",
                    send: "Verstuur",
                    sent: "Verstuurd",
                    sign_me_up: "Schrijf me in!"
                },
                pl: {
                    age: "Wiek",
                    city: "Miasto",
                    close: "Zamknij",
                    email: "Email",
                    female: "Kobieta",
                    full_name: "Imi\u0119 i nazwisko",
                    male: "M\u0119\u017cczyzna",
                    phone_number: "Numer telefonu",
                    please_type_here: "Wpisz wiadomo\u015b\u0107...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Odpowiedz",
                    send: "Wy\u015blij",
                    sent: "Wys\u0142ano",
                    sign_me_up: "Zarejestruj mnie!"
                },
                pt: {
                    age: "Idade",
                    city: "Cidade",
                    close: "Fechar",
                    email: "Email",
                    female: "Feminino",
                    full_name: "Nome completo",
                    male: "Masculino",
                    phone_number: "Telem\u00f3vel",
                    please_type_here: "Por favor, escreva aqui ...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Responder",
                    send: "Enviar",
                    sent: "Enviado",
                    sign_me_up: "Quero Registar-me!"
                },
                pt_BR: {
                    age: "Idade",
                    city: "Cidade",
                    close: "Fechar",
                    email: "Email",
                    female: "Feminino",
                    full_name: "Nome completo",
                    male: "Masculino",
                    phone_number: "Telefone",
                    please_type_here: "Por favor, escreva aqui...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Responder",
                    send: "Enviar",
                    sent: "Enviado",
                    sign_me_up: "Inscreva-se!"
                },
                ro: {
                    age: "V\u00e2rsta",
                    city: "Ora\u0219",
                    close: "\u00cenchide",
                    email: "Email",
                    female: "Femeie",
                    full_name: "Nume complet",
                    male: "B\u0103rbat",
                    phone_number: "Telefon",
                    please_type_here: "Scrie aici...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "R\u0103spunde",
                    send: "Trimite",
                    sent: "Trimis",
                    sign_me_up: "M\u0103 \u00eenscriu"
                },
                ru: {
                    age: "\u0412\u043e\u0437\u0440\u0430\u0441\u0442",
                    city: "\u0413\u043e\u0440\u043e\u0434",
                    close: "\u0417\u0430\u043a\u0440\u044b\u0442\u044c",
                    email: "Email",
                    female: "\u0416\u0435\u043d\u0449\u0438\u043d\u0430",
                    full_name: "\u041f\u043e\u043b\u043d\u043e\u0435 \u0438\u043c\u044f",
                    male: "\u041c\u0443\u0436\u0447\u0438\u043d\u0430",
                    phone_number: "\u041d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430",
                    please_type_here: "\u041c\u0435\u0441\u0442\u043e \u0434\u043b\u044f \u0432\u0432\u043e\u0434\u0430...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "\u041e\u0442\u0432\u0435\u0442\u0438\u0442\u044c",
                    send: "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c",
                    sent: "\u041e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e",
                    sign_me_up: "\u041f\u043e\u0434\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f!"
                },
                sk: {
                    age: "Vek",
                    city: "Mesto",
                    close: "Zavrie\u0165",
                    email: "Email",
                    female: "\u017dena",
                    full_name: "Cel\u00e9 meno",
                    male: "Mu\u017e",
                    phone_number: "Telef\u00f3nne \u010d\u00edslo",
                    please_type_here: "Za\u010dnite p\u00edsa\u0165 tu",
                    powered_by_hotjar: "powered bz Hotjar",
                    reply: "Odpoveda\u0165",
                    send: "Odosla\u0165",
                    sent: "Poslan\u00e9",
                    sign_me_up: "Vytvori\u0165 konto"
                },
                sl: {
                    age: "Starost",
                    city: "Kraj",
                    close: "Zapri",
                    email: "Email",
                    female: "\u017denska",
                    full_name: "Ime in priimek",
                    male: "Mo\u0161ki",
                    phone_number: "Telefon",
                    please_type_here: "Prosimo vnesite tukaj...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Odgovori",
                    send: "Po\u0161lji",
                    sent: "Poslano",
                    sign_me_up: "Prijavi me!"
                },
                sv: {
                    age: "\u00c5lder",
                    city: "Stad",
                    close: "St\u00e4ng",
                    email: "Email",
                    female: "Kvinna",
                    full_name: "Namn",
                    male: "Man",
                    phone_number: "Telefon",
                    please_type_here: "Skriv h\u00e4r...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Besvara",
                    send: "Skicka",
                    sent: "Skickat",
                    sign_me_up: "Registrera mig!"
                },
                tl: {
                    age: "Edad",
                    city: "Lunsod",
                    close: "Isara",
                    email: "E-mail",
                    female: "Babae",
                    full_name: "Buong Pangalan",
                    male: "Lalaki",
                    phone_number: "Telepono",
                    please_type_here: "Dito po magsimulang magsulat...",
                    powered_by_hotjar: "iniabot sa inyo ng Hotjar",
                    reply: "Tumugon",
                    send: "Ipadala",
                    sent: "Naipadala",
                    sign_me_up: "I-rehistro nyo ako!"
                },
                tr: {
                    age: "Ya\u015f",
                    city: "\u015eehir",
                    close: "Kapat",
                    email: "E-posta",
                    female: "Kad\u0131n",
                    full_name: "\u0130sim",
                    male: "Erkek",
                    phone_number: "Telefon Numaran\u0131z",
                    please_type_here: "Cevab\u0131n\u0131z\u0131 buraya giriniz...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Cevapla",
                    send: "G\u00f6nder",
                    sent: "G\u00f6nderildi",
                    sign_me_up: "Kay\u0131t ol!"
                },
                uk: {
                    age: "\u0412\u0456\u043a",
                    city: "\u041c\u0456\u0441\u0442\u043e",
                    close: "\u0417\u0430\u043a\u0440\u0438\u0442\u0438",
                    email: "Email",
                    female: "\u0416\u0456\u043d\u043a\u0430",
                    full_name: "\u041f\u043e\u0432\u043d\u0435 \u0456\u043c'\u044f",
                    male: "\u0427\u043e\u043b\u043e\u0432\u0456\u043a",
                    phone_number: "\u041d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0443",
                    please_type_here: "\u041c\u0456\u0441\u0446\u0435 \u0434\u043b\u044f \u0432\u0432\u043e\u0434\u0443...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "\u0412\u0456\u0434\u043f\u043e\u0432\u0456\u0441\u0442\u0438",
                    send: "\u041d\u0430\u0434\u0456\u0441\u043b\u0430\u0442\u0438",
                    sent: "\u041d\u0430\u0434\u0456\u0441\u043b\u0430\u043d\u043e",
                    sign_me_up: "\u041f\u0456\u0434\u043f\u0438\u0441\u0430\u0442\u0438\u0441\u044f!"
                },
                vi: {
                    age: "Tu\u1ed5i",
                    city: "Th\u00e0nh ph\u1ed1",
                    close: "\u0110\u00f3ng",
                    email: "Email",
                    female: "N\u1eef",
                    full_name: "T\u00ean \u0111\u1ea7y \u0111\u1ee7",
                    male: "Nam",
                    phone_number: "\u0110i\u1ec7n tho\u1ea1i",
                    please_type_here: "Vui l\u00f2ng nh\u1eadp n\u1ed9i dung t\u1ea1i \u0111\u00e2y...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "Tr\u1ea3 l\u1eddi",
                    send: "G\u1edfi",
                    sent: "\u0110\u00e3 g\u1edfi",
                    sign_me_up: "\u0110\u0103ng k\u00fd!"
                },
                zh_TW: {
                    age: "\u5e74\u9f61",
                    city: "\u57ce\u5e02",
                    close: "\u95dc\u9589",
                    email: "Email",
                    female: "\u5973",
                    full_name: "\u540d\u7a31",
                    male: "\u7537",
                    phone_number: "\u96fb\u8a71",
                    please_type_here: "\u8acb\u8f38\u5165...",
                    powered_by_hotjar: "powered by Hotjar",
                    reply: "\u56de\u8986",
                    send: "\u9001\u51fa",
                    sent: "\u5df2\u9001\u51fa",
                    sign_me_up: "\u6211\u8981\u53c3\u52a0!"
                }
            };
            if (!(a in f)) throw Error('Invalid language "' +
                a + '"');
            g = f[a];
            hj.widget.activeLanguageDirection = -1 < b.indexOf(
                a) ? "rtl" : "ltr"
        }, "common");
        m.applyMobileClasses = hj.tryCatch(function() {
            hj.isPreview || hj.widget.isNarrowScreen() ? hj
                .widget.ctrl.addClass(
                    "_hj-f5b2a1eb-9b07_widget_centered") :
                hj.widget.ctrl.removeClass(
                    "_hj-f5b2a1eb-9b07_widget_centered");
            hj.widget.isShortScreen() ? hj.widget.ctrl.addClass(
                    "_hj-f5b2a1eb-9b07_widget_short") : hj.widget
                .ctrl.removeClass(
                    "_hj-f5b2a1eb-9b07_widget_short")
        }, "common");
        m.changeState = hj.tryCatch(function(b, f) {
            f = f || b.data.state;
            if ("open" === f || "collapsed" === f) a = f;
            hj.widget.ctrl.removeClass(
                "_hj-f5b2a1eb-9b07_widget_open").removeClass(
                "_hj-f5b2a1eb-9b07_widget_collapsed").removeClass(
                "_hj-f5b2a1eb-9b07_widget_thankyou").removeClass(
                "_hj-f5b2a1eb-9b07_widget_hidden").addClass(
                "_hj-f5b2a1eb-9b07_widget_" + f)
        }, "common");
        m.openWidget = hj.tryCatch(function() {
            var b = hj.isPreview ? 0 : 300;
            hj.widget.ctrl.removeClass(
                "_hj-f5b2a1eb-9b07_widget_collapsed").addClass(
                "_hj-f5b2a1eb-9b07_widget_open").animate({
                bottom: "0"
            }, b);
            a = "open"
        }, "common");
        m.collapseWidget = hj.tryCatch(function() {
            var b = hj.isPreview ? 0 : 450;
            hj.widget.ctrl.removeClass(
                "_hj-f5b2a1eb-9b07_widget_open").addClass(
                "_hj-f5b2a1eb-9b07_widget_collapsed").animate({
                bottom: "0"
            }, b);
            a = "collapsed"
        }, "common");
        m.toggleWidget = hj.tryCatch(function() {
            hj.widget.ctrl.hasClass(
                    "_hj-f5b2a1eb-9b07_widget_hidden") ? hj
                .widget.changeState(null, a) : (hj.widget.changeState(
                    null, "hidden"), hj.widget.setMinimized())
        }, "common");
        m.changeColorLuminance = hj.tryCatch(function(a, b) {
            a = String(a).replace(/[^0-9a-f]/gi, "");
            6 > a.length && (a = a[0] + a[0] + a[1] + a[1] +
                a[2] + a[2]);
            b = b || 0;
            var d = "#",
                h, g;
            for (g = 0; 3 > g; g++) h = parseInt(a.substr(2 *
                g, 2), 16), h = Math.round(Math.min(
                Math.max(0, h + 255 * b), 255)).toString(
                16), d += ("00" + h).substr(h.length);
            return d
        }, "common");
        m.disableSubmit = hj.tryCatch(function() {
            hj.widget.ctrl.find(
                "#_hj-f5b2a1eb-9b07_action_submit").addClass(
                "_hj-f5b2a1eb-9b07_btn_disabled")
        }, "common");
        m.dismissWidget = hj.tryCatch(function() {
            hj.widget.setDone();
            hj.widget.ctrl.hide()
        }, "common");
        m.init = hj.tryCatch(function() {
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_action_toggle_widget"
            ).on("click", hj.widget.toggleWidget);
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_action_open_widget"
            ).on("click", {
                state: "open"
            }, hj.widget.changeState);
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_action_dismiss_widget"
            ).on("click", hj.widget.dismissWidget)
        }, "common");
        m.enableSubmit = hj.tryCatch(function() {
            hj.widget.ctrl.find(
                "#_hj-f5b2a1eb-9b07_action_submit").removeClass(
                "_hj-f5b2a1eb-9b07_btn_disabled")
        }, "common");
        m.isNarrowScreen = hj.tryCatch(function() {
            return 768 > hj.hq(window).width()
        }, "common");
        m.isShortScreen = hj.tryCatch(function() {
            return 400 > hj.hq(window).height()
        }, "common");
        m.commonCSS =
            '                <style type="text/css">                    /*reset css*/                    .<%=p%>_widget, .<%=p%>_widget * {                        line-height: normal;                        font-family: Arial,                        sans-serif, Tahoma !important;                        text-transform: initial !important;                    }                    .<%=p%>_widget, .<%=p%>_widget div {                        height: auto;                    }                    .<%=p%>_widget div,                    .<%=p%>_widget span,                    .<%=p%>_widget p,                    .<%=p%>_widget a,                    .<%=p%>_widget img,                    .<%=p%>_widget strong,                    .<%=p%>_widget form,                    .<%=p%>_widget label {                        border: 0;                        outline: 0;                        font-size: 100%;                        vertical-align: baseline;                        background: transparent;                        margin: 0;                        padding: 0;                        float: none !important;                    }                    .<%=p%>_widget span {color:inherit}                    .<%=p%>_widget ol,                    .<%=p%>_widget ul,                    .<%=p%>_widget li {                        list-style-type:none !important;                        margin: 0 !important;                        padding: 0 !important;                     }                    .<%=p%>_widget hr {                        display:block;                        height:1px;                        border:0;                        border-top:1px                        solid #ccc;                        margin:1em 0;                        padding:0;                    }                    .<%=p%>_widget input[type=submit],                    .<%=p%>_widget input[type=button],                    .<%=p%>_widget button {                        margin: 0;                        padding:0;                        float: none !important;                    }                    .<%=p%>_widget input,                    .<%=p%>_widget select,                    .<%=p%>_widget a img {                        vertical-align:middle;                    }                                        /*generic css*/                    .<%=p%>_widget {                        font-size:13px !important;                        position: fixed;                        z-index: 2147483644;                        bottom: -400px;                        right: 100px;                        width: 300px;                        -webkit-border-radius: 5px 5px 0 0;                        -moz-border-radius: 5px 5px 0 0;                        border-radius: 5px 5px 0 0;                        -webkit-transform: translateZ(0) !important;                    }                    .<%=p%>_widget.<%=p%>_position_left {                        right: auto;                        left: 100px;                    }                     .<%=p%>_widget .<%=p%>_rounded_corners {                        -webkit-border-radius: 4px;                        -moz-border-radius: 4px;                        border-radius: 4px;                    }                    .<%=p%>_widget .<%=p%>_shadow {                        -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);                        -moz-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);                        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);                    }                    .<%=p%>_widget .<%=p%>_transition {                        -webkit-transition: all 0.2s ease-in-out;                        -moz-transition: all 0.2s ease-in-out;                        -o-transition: all 0.2s ease-in-out;                        -ms-transition: all 0.2s ease-in-out;                        transition: all 0.2s ease-in-out;                    }                    .<%=p%>_widget .<%=p%>_pull_left {                        float: left !important;                    }                    .<%=p%>_widget .<%=p%>_pull_right {                        float: right !important;                    }                    .<%=p%>_widget .<%=p%>_clear_both {clear: both !important;}                    .<%=p%>_widget .<%=p%>_hidden {display: none !important;}                    .<%=p%>_widget .<%=p%>_link_no_underline:hover {                        text-decoration: none !important;                    }                                        /*common css*/                    .<%=p%>_widget.<%=p%>_widget_centered {                        right:50%;                        margin-right: -150px;                        left: auto;                    }                    .<%=p%>_widget .<%=p%>_widget_state {display: none;}                                        .<%=p%>_widget .<%=p%>_widget_icon {                        background-repeat: no-repeat;                        width: 16px;                        height: 16px;                        display: -moz-inline-stack;                        display: inline-block;                        zoom: 1;                        *display: inline;                        vertical-align: top;                    }                    .<%=p%>_widget .<%=p%>_widget_open_close {                        text-align: center;                        position: absolute;                        top: -18px;                        right: 20px;                        width: 40px;                        height: 18px;                        padding-top: 2px;                        cursor: pointer;                        -webkit-border-radius: 5px 5px 0 0;                        -moz-border-radius: 5px 5px 0 0;                        border-radius: 5px 5px 0 0;                    }                    .<%=p%>_widget .<%=p%>_widget_open_close .<%=p%>_widget_icon {                        background-position: -32px 0;                    }                    .<%=p%>_widget .<%=p%>_widget_open_close::before {                        content: "";                        position: absolute;                        left: -4px;                        right: -4px;                        bottom: -8px;                        height: 8px;                    }                    .<%=p%>_widget .<%=p%>_widget_hidden_handle {                        display:none;                        height: 4px;                        cursor:pointer;                        -webkit-border-radius: 5px 5px 0 0;                        -moz-border-radius: 5px 5px 0 0;                        border-radius: 5px 5px 0 0;                    }                                        .<%=p%>_widget .<%=p%>_widget_title {                        font-weight: bold;                        text-align: center;                        padding: 12px;                        margin: 0;                        line-height: 17px;                        min-height: 17px;                        word-break: break-word;                        word-wrap: break-word;                        cursor: pointer;                    }                    .<%=p%>_widget .<%=p%>_widget_initiator {                        display: none;                        padding: 0 12px 12px 12px;                        text-align: center;                    }                    .<%=p%>_widget .<%=p%>_widget_initiator button {                        padding-left: 20px;                        padding-right: 20px;                    }                                        .<%=p%>_widget .<%=p%>_btn,                    .<%=p%>_widget .<%=p%>_btn_primary {                        cursor: pointer;                        text-decoration: none !important;                        font-size: 13px !important;                        font-weight: bold !important;                        padding: 7px 10px !important;                        border: 0 !important;                        outline: 0 !important;                        height: initial !important;                        min-height: initial !important;                        display: -moz-inline-stack;                        display: inline-block;                        zoom: 1;                        *display: inline;                        vertical-align: top;                        width: auto;                    }                    .<%=p%>_widget .<%=p%>_btn_primary {                        background: #00C764 !important;                        color: white;                    }                    .<%=p%>_widget .<%=p%>_btn_primary:hover,                    .<%=p%>_widget .<%=p%>_btn_primary:focus,                    .<%=p%>_widget .<%=p%>_btn_primary:active {                        background: #00a251 !important;                    }                    .<%=p%>_widget .<%=p%>_btn_disabled,                    .<%=p%>_widget .<%=p%>_btn_disabled:hover,                    .<%=p%>_widget .<%=p%>_btn_disabled:focus,                    .<%=p%>_widget .<%=p%>_btn_disabled:active {                        cursor: default;                        -webkit-box-shadow: none;                        -moz-box-shadow: none;                        box-shadow: none;                    }                                        /*content*/                    .<%=p%>_widget .<%=p%>_widget_content {padding:0 12px;}                    .<%=p%>_widget .<%=p%>_widget_content_overflow {                        max-height: 280px;                        overflow-y: auto;                        overflow-x: hidden;                    }                    .<%=p%>_widget.<%=p%>_widget_short .<%=p%>_widget_content {                        padding:0 11px 0 12px;                        max-height: 120px;                        overflow-y: auto;                        overflow-x: hidden;                    }                                        /*open ended*/                    .<%=p%>_widget .<%=p%>_widget_content .<%=p%>_input_field {                        font-family: Arial, sans-serif, Tahoma;                        font-size: 14px; color: #333;                        padding: 6px !important;                        height: 30px;                        width:100%;                        margin: 0 0 12px 0;                        background: white;                        border: 1px solid <%= widgetStyle.footerBorderColor %> !important;                        -webkit-box-sizing: border-box;                        -moz-box-sizing: border-box;                        box-sizing: border-box;                        outline: none !important;                        max-width: none !important;                        float: none;                    }                    .<%=p%>_widget .<%=p%>_widget_content .<%=p%>_input_field:focus {                        border: 1px solid #00a251;                    }                    .<%=p%>_widget .<%=p%>_widget_content textarea.<%=p%>_input_field {                        resize: none; height: 100px;                    }                                        /*close ended*/                    .<%=p%>_widget .<%=p%>_widget_content .<%=p%>_button_radio_checkbox {                        position: relative;                        min-height: 45px;                        text-align:left !important;                        height:auto !important;                        height: 45px;                        -webkit-box-sizing: border-box;                        -moz-box-sizing: border-box;                        box-sizing: border-box;                    }                    .<%=p%>_widget .<%=p%>_widget_content .<%=p%>_button_radio_checkbox span.<%=p%>_widget_icon {                        -webkit-border-radius: 30px;                        -moz-border-radius: 30px;                        border-radius: 30px;                        border: 2px solid #AAA;                        width: 22px;                        height: 22px;                        display: block;                        position: absolute;                        left: 12px;                        top: 50%;                        margin-top: -14px;                        background-position: -64px -100px;                        -webkit-box-sizing: content-box;                        -moz-box-sizing: content-box;                        box-sizing: content-box;                    }                    .<%=p%>_widget .<%=p%>_widget_content                        .<%=p%>_button_radio_checkbox span.<%=p%>_radio_checkbox_text {                        text-align: left !important;                        padding: 14px 20px 14px 50px;                        position: relative;                        display: block;                        word-break: break-word;                        word-wrap: break-word;                    }                    .<%=p%>_widget .<%=p%>_widget_content .<%=p%>_button_radio_checkbox_full {                        margin-left:-12px;                        margin-right: -12px;                    }                    .<%=p%>_widget .<%=p%>_widget_content                        .<%=p%>_button_radio_checkbox.<%=p%>_button_radio_checkbox_active span {                        border-color: white;                        background-position: -97px 4px;                    }                    .<%=p%>_widget .<%=p%>_widget_content .<%=p%>_button_checkbox span.<%=p%>_widget_icon {                        -webkit-border-radius: 4px;                        -moz-border-radius: 4px;                        border-radius: 4px;                    }                    .<%=p%>_widget .<%=p%>_double_control {                        margin: 0 0 12px 0;                        width: 100%;                    }                    .<%=p%>_widget .<%=p%>_double_control .<%=p%>_double_first {                        width:49% !important;                        float:left !important;                        margin-bottom: 0;                    }                    .<%=p%>_widget .<%=p%>_double_control .<%=p%>_double_second {                        width:49% !important;                        float:left !important;                        margin-bottom: 0;                        margin-left:2%;                    }                                        /* footer*/                    .<%=p%>_widget .<%=p%>_widget_footer {width: 100%;}                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_left {padding: 21px 0 0 12px; font-size: 11px;}                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_left a,                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_left a:hover,                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_left a:focus,                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_left a:active {                        text-decoration: underline;                    }                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_left span {                        background-position: -16px 0; margin-right: 4px;                    }                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_right {padding: 12px 12px 12px 0;}                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_right button {padding-right: 5px;}                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_right button span {                        background-position: -64px 0;                        margin-left: 8px;                    }                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_right button.<%=p%>_btn_disabled span {                        background-position: -48px 0;                    }                                        /*state: hidden*/                    .<%=p%>_widget.<%=p%>_widget_hidden .<%=p%>_widget_open_close                        .<%=p%>_widget_icon {background-position: 0 0;}                    .<%=p%>_widget.<%=p%>_widget_hidden .<%=p%>_widget_title {display: none;}                    .<%=p%>_widget.<%=p%>_widget_hidden .<%=p%>_widget_hidden_handle {display: block;}                                        /*state: collapsed */                    .<%=p%>_widget.<%=p%>_widget_collapsed .<%=p%>_widget_initiator {display: block;}                                        /*state: open*/                    .<%=p%>_widget.<%=p%>_widget_open .<%=p%>_widget_state_open {display: block;}                                        /*state: thankyou*/                    .<%=p%>_widget.<%=p%>_widget_thankyou .<%=p%>_widget_state_thankyou {display: block;}                    .<%=p%>_widget.<%=p%>_widget_thankyou .<%=p%>_widget_open_close {display: none;}                    .<%=p%>_widget.<%=p%>_widget_thankyou .<%=p%>_widget_title {display: none;}                    .<%=p%>_widget.<%=p%>_widget_thankyou .<%=p%>_widget_footer .<%=p%>_pull_right .<%=p%>_btn span {                        background-position: -80px 0;                    }                    .<%=p%>_widget .<%=p%>_thankyou_message {text-align: center; padding: 20px; margin: 0;}                    .<%=p%>_widget .<%=p%>_thankyou_message button {margin-top: 12px; padding: 7px 20px !important;}                                        /* theme css */                    .<%=p%>_widget {                        background: <%= widgetStyle.primaryColor %> !important;                        color: <%= widgetStyle.fontColor %> !important;                    }                    .<%=p%>_widget a, .<%=p%>_widget a:link, .<%=p%>_widget a:hover, .<%=p%>_widget a:active {                        color: <%= widgetStyle.fontColor %> !important;                    }                    .<%=p%>_widget p {color: <%= widgetStyle.fontColor %> !important;}                    .<%=p%>_widget .<%=p%>_widget_open_close::before {                        background: <%= widgetStyle.primaryColor %> !important;                    }                    .<%=p%>_widget .<%=p%>_widget_icon {                        background-image:                             url(//<%= hjStaticHost %>/static/client/modules/assets/widget_icons_light.png) !important;                    }                    .<%=p%>_widget .<%=p%>_widget_open_close {background: <%= widgetStyle.primaryColor %> !important;}                    .<%=p%>_widget .<%=p%>_widget_hidden_handle {                        background: <%= widgetStyle.primaryColor %> !important;                    }                    .<%=p%>_widget .<%=p%>_btn {                        background: <%= widgetStyle.secondaryColor %> !important;                        color: <%= widgetStyle.fontColor %> !important;                    }                    .<%=p%>_widget .<%=p%>_btn:hover, .<%=p%>_widget .<%=p%>_btn:focus,  .<%=p%>_btn:active {                        background: #666 !important;                    }                                        .<%=p%>_widget .<%=p%>_widget_content .<%=p%>_input_field {                        border: 1px solid <%= widgetStyle.footerBorderColor %> !important;                    }                                        .<%=p%>_widget .<%=p%>_button_radio_checkbox {                        border-bottom: 1px solid <%= widgetStyle.primaryColor %> !important;                        border-top: 1px solid <%= widgetStyle.alternateColor %> !important;                        background: <%= widgetStyle.secondaryColor %> !important;                        cursor: pointer !important;                    }                    .<%=p%>_widget .<%=p%>_button_radio_checkbox_last {border-bottom:0 !important;}                    .<%=p%>_widget .<%=p%>_button_radio_checkbox:hover {                        background: <%= widgetStyle.alternateColor %> !important;                        color: <%= widgetStyle.fontColorNegative %>;                    }                    .<%=p%>_widget .<%=p%>_button_radio_checkbox.<%=p%>_button_radio_checkbox_active,                    .<%=p%>_widget .<%=p%>_button_radio_checkbox.<%=p%>_button_radio_checkbox_active:hover {                        background: <%= widgetStyle.alternateColor %> !important;                        color: white !important;                        cursor: default;                    }                                        .<%=p%>_widget .<%=p%>_widget_footer {                        border-top: 1px solid <%= widgetStyle.footerBorderColor %> !important;                    }                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_left,                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_left a,                    .<%=p%>_widget .<%=p%>_widget_footer .<%=p%>_pull_left a:hover {                        color: <%= widgetStyle.footerTextColor %> !important;                    }                    .<%=p%>_widget .<%=p%>_btn_disabled,                    .<%=p%>_widget .<%=p%>_btn_disabled:hover,                    .<%=p%>_widget .<%=p%>_btn_disabled:focus,                    .<%=p%>_widget .<%=p%>_btn_disabled:active {                        color: <%= widgetStyle.primaryColor %> !important;                        background: <%= widgetStyle.secondaryColor %> !important;                    }                                        /*light theme css*/                    .<%=p%>_widget.<%=p%>_skin_light, .<%=p%>_widget.<%=p%>_skin_light .<%=p%>_widget_open_close {                        -webkit-box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.3) !important;                        -moz-box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.3) !important;                        box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.3) !important;                    }                    .<%=p%>_widget.<%=p%>_skin_light .<%=p%>_widget_icon {                        background-image:                             url(//<%= hjStaticHost %>/static/client/modules/assets/widget_icons_light.png) !important;                    }                                        /*dark theme css*/                    .<%=p%>_widget.<%=p%>_skin_dark, .<%=p%>_widget.<%=p%>_skin_dark .<%=p%>_widget_open_close {                        -webkit-box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.6) !important;                        -moz-box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.6) !important;                        box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.6) !important;                    }                    .<%=p%>_widget.<%=p%>_skin_dark .<%=p%>_widget_icon {                        background-image:                             url(//<%= hjStaticHost %>/static/client/modules/assets/widget_icons_dark.png) !important;                    }                                        /*right-to-left css*/                    .<%=p%>_widget.<%=p%>_rtl, .<%=p%>_widget.<%=p%>_rtl * {direction: rtl !important;}                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_widget_footer .<%=p%>_pull_left {direction: ltr !important;}                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_widget_footer .<%=p%>_pull_right button {padding-right: 10px;}                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_widget_footer .<%=p%>_pull_right button span {margin-left: 0;}                    .<%=p%>_widget.<%=p%>_rtl.<%=p%>_widget_open .<%=p%>_widget_footer .<%=p%>_pull_right button span {                        display: none;                    }                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_widget_content .<%=p%>_button_radio_checkbox {                        text-align:right !important;                    }                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_widget_content .<%=p%>_button_radio_checkbox                        span.<%=p%>_widget_icon {                        left: auto;                        right: 12px;                    }                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_widget_content .<%=p%>_button_radio_checkbox                        span.<%=p%>_radio_checkbox_text {                        text-align:right !important;                        padding: 14px 50px 14px 20px;                    }                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_double_control .<%=p%>_double_first {                        float:right;                        margin-left:2%;}                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_double_control .<%=p%>_double_second {                        float:left;                        margin-left:0;}                </style>';
        return m
    }();
    hj.html = function() {
        function m(a) {
            a.nodeType === Node.TEXT_NODE && (a.nodeValue = hj.hq
                .trim(a.nodeValue).replace(/./g, "*")); - 1 !==
                "text color date datetime datetime-local email month number range search tel time url week"
                .split(" ").indexOf(a.type) && a.setAttribute(
                    "value", hj.hq.trim(a.value).replace(/./g,
                        "*"));
            hj.hq.each(a.childNodes, function(g, d) {
                a.childNodes[g] = m(d)
            });
            return a
        }
        var a = {
            getPageContent: function() {
                var a = document.cloneNode(!0),
                    g = a.querySelectorAll(
                        "*[data-hj-masked]"),
                    d = 0 == document.getElementsByTagName(
                        "base").length ? location.origin :
                    document.getElementsByTagName("base")[0]
                    .href;
                hj.hq.each(g, function(a, b) {
                    g[a] = m(b)
                });
                Array.prototype.slice.call(a.getElementsByTagName(
                    "img")).forEach(function(a) {
                    var b = "";
                    if ("" === a.src && a.srcset) {
                        if (b = a.srcset.match(
                            /(?:([^"'\s,]+)(\s*(?:\s+\d+[wx]))?(?:,\s*)?)/g
                        )[0]) {
                            var f = b.indexOf(" ");
                            0 < f && (b = b.substring(
                                0, f));
                            b = b.replace(",", "");
                            0 !== b.indexOf("http") &&
                                (b = d + b);
                            a.src = b;
                            a.removeAttribute(
                                "srcset")
                        }
                    } else a.srcset && a.removeAttribute(
                        "srcset")
                });
                Array.prototype.slice.call(a.getElementsByTagName(
                    "source")).forEach(function(a) {
                    a.attributes.srcset && a.removeAttribute(
                        "srcset")
                });
                return hj.html.getPageDoctype() + a.documentElement
                    .outerHTML.replace(/<script/g,
                        "<noscript").replace(/\/script *>/g,
                        "/noscript>")
            }
        };
        a.getPageDoctype = hj.tryCatch(function() {
            return null === document.doctype ? "" :
                "<!DOCTYPE " + document.doctype.name + (
                    document.doctype.publicId ? ' PUBLIC "' +
                    document.doctype.publicId + '"' : "") +
                (!document.doctype.publicId && document.doctype
                    .systemId ? " SYSTEM" : "") + (document
                    .doctype.systemId ? ' "' + document.doctype
                    .systemId + '"' : "") + ">\n"
        }, "common");
        return a
    }()
}, "widgets")();
hj.tryCatch(function() {
    hj.loader.registerModule("Feedback", function() {
        function m() {
            hj.widget.currentStepIndex = 0;
            hj.widget.resetDataValues = {
                selector: "html",
                step1: {
                    comment: null,
                    emotion: null
                },
                step2: {
                    email: null
                }
            };
            hj.widget.data = hj.widget.resetDataValues;
            hj.widget.ctrl.find('[data-bind="emotion"]').on(
                "click", hj.tryCatch(function() {
                    var a = hj.hq(this),
                        b = a.attr(
                            "data-emotion-option"),
                        d = hj.hq(
                            "#_hj-f5b2a1eb-9b07_feedback_open"
                        );
                    hj.widget.data.step1.emotion =
                        b;
                    d.find(
                        "._hj-f5b2a1eb-9b07_icon_face"
                    ).addClass(
                        "_hj-f5b2a1eb-9b07_icon_face_off"
                    );
                    a.find(
                        "._hj-f5b2a1eb-9b07_icon_face"
                    ).removeClass(
                        "_hj-f5b2a1eb-9b07_icon_face_off"
                    );
                    hj.hq(
                        "._hj-f5b2a1eb-9b07_emotion_comment_holder"
                    ).attr(
                        "data-caret-position",
                        b);
                    hj.widget.showPageHighlight();
                    hj.widget.showPageScreenshotToggle();
                    hj.widget.showFooter();
                    hj.widget.showOverlay()
                }, "feedback"));
            hj.widget.ctrl.find('[data-bind="comment"]').on(
                "keyup change", hj.tryCatch(function() {
                    hj.widget.data.step1.comment =
                        hj.hq(this).val();
                    hj.widget.validateCurrentStep()
                }, "feedback"));
            hj.widget.ctrl.find('[data-bind="email"]').on(
                "keyup change", hj.tryCatch(function() {
                    hj.widget.data.step2.email = hj
                        .hq(this).val();
                    hj.widget.validateCurrentStep()
                }, "feedback"));
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_hotjar_buddy, ._hj-f5b2a1eb-9b07_feedback_minimized_message"
            ).on("click", hj.tryCatch(function() {
                hj.widget.goToNextStep()
            }, "feedback"));
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_feedback_minimized_close"
            ).on("click", hj.tryCatch(function(a) {
                a.stopPropagation();
                hj.widget.closeMinimizedMessage()
            }, "feedback"));
            var a = hj.hq(
                    "#_hj-f5b2a1eb-9b07_feedback_page_highlight"
                ),
                b = hj.hq(
                    "#_hj-f5b2a1eb-9b07_feedback_overlay");
            hj.widget.ctrl.find(
                "#_hj-f5b2a1eb-9b07_feedback_screenshot_checkbox"
            ).on("change", hj.tryCatch(function() {
                hj.hq(this).is(":checked") ? (a
                    .removeClass(
                        "_hj-f5b2a1eb-9b07_feedback_page_highlight_grey"
                    ), hj.widget.data.selectors = [
                        "html"
                    ]) : (a.addClass(
                        "_hj-f5b2a1eb-9b07_feedback_page_highlight_grey"
                    ), hj.widget.data.selectors =
                    null)
            }, "feedback"));
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_feedback_open_close"
            ).on("click", hj.tryCatch(function() {
                hj.widget.startInboundFeedback()
            }, "feedback"));
            b.on("click", hj.tryCatch(function() {},
                "feedback"));
            hj.widget.ctrl.find(
                "#_hj-f5b2a1eb-9b07_action_cancel_selection"
            ).on("click", hj.tryCatch(function() {
                hj.widget.disableSelectionState()
            }, "feedback"));
            hj.widget.ctrl.find(
                "#_hj-f5b2a1eb-9b07_action_submit").on(
                "click", hj.tryCatch(function() {
                    hj.hq(this).hasClass(
                        "_hj-f5b2a1eb-9b07_btn_disabled"
                    ) || hj.widget.goToNextStep()
                }, "feedback"));
            setTimeout(function() {
                hj.widget.startInboundFeedback(!0)
            }, 0);
            hj.widget.goToNextStep = hj.tryCatch(function() {
                var a = hj.widget.currentStepIndex +
                    1;
                hj.widget.hide('[data-node="step"]');
                hj.widget.disableSubmit();
                0 < a && 3 > a && (hj.widget.showOpenState(),
                    hj.widget.show(
                        "#_hj-f5b2a1eb-9b07_step-" +
                        a));
                1 < a && hj.widget.hidePageHighlight();
                3 <= a && (a = 0, hj.widget.endInboundFeedback(!
                    0));
                hj.widget.currentStepIndex = a
            }, "feedback");
            hj.widget.validateCurrentStep = hj.tryCatch(
                function() {
                    var a = !1;
                    switch (hj.widget.currentStepIndex) {
                        case 1:
                            hj.widget.data.step1.comment &&
                                hj.widget.data.step1.emotion &&
                                (a = !0);
                            break;
                        case 2:
                            hj.widget.data.step2.email &&
                                (a = !0)
                    }
                    a ? hj.widget.enableSubmit() : hj.widget
                        .disableSubmit()
                }, "feedback");
            hj.widget.resetWidget = hj.tryCatch(function() {
                var b = hj.hq(
                    "#_hj-f5b2a1eb-9b07_feedback_open"
                );
                hj.widget.data = hj.widget.resetDataValues;
                hj.widget.hideSelectionModal();
                hj.widget.hideFooter();
                document.getElementById(
                    "_hj-f5b2a1eb-9b07_feedback_screenshot_checkbox"
                ).checked = !0;
                a.removeClass(
                    "_hj-f5b2a1eb-9b07_feedback_page_highlight_grey"
                );
                b.find('[data-bind="comment"]').val(
                    "");
                b.find(
                    "._hj-f5b2a1eb-9b07_icon_face"
                ).removeClass(
                    "_hj-f5b2a1eb-9b07_icon_face_off"
                );
                hj.hq(
                    "._hj-f5b2a1eb-9b07_emotion_comment_holder"
                ).attr("data-caret-position",
                    "-");
                b.find('[data-bind="email"]').val(
                    "");
                b.find(
                    "._hj-f5b2a1eb-9b07_button_score"
                ).removeClass(
                    "_hj-f5b2a1eb-9b07_button_score_active"
                )
            }, "feedback");
            hj.widget.startInboundFeedback = hj.tryCatch(
                function(a) {
                    hj.widget.currentStepIndex = 0;
                    hj.widget.closeMinimizedMessage();
                    hj.widget.showMinimizedState();
                    hj.widget.show(
                        "._hj-f5b2a1eb-9b07_hotjar_buddy"
                    );
                    a && setTimeout(function() {
                        hj.hq(
                            "._hj-f5b2a1eb-9b07_hotjar_buddy"
                        ).attr("data-face",
                            "wink");
                        hj.hq(
                            "#_hj-f5b2a1eb-9b07_feedback_minimized_text"
                        ).text(hj.widget.feedbackData
                            .content.initial
                        );
                        hj.widget.show(
                            "._hj-f5b2a1eb-9b07_feedback_minimized_message"
                        )
                    }, 2E3);
                    setTimeout(function() {
                        hj.hq(
                            "._hj-f5b2a1eb-9b07_hotjar_buddy"
                        ).attr("data-face",
                            "happy")
                    }, 2400)
                }, "feedback");
            hj.widget.endInboundFeedback = hj.tryCatch(
                function(a) {
                    var b, d, h, g;
                    hj.widget.showMinimizedState();
                    b = {
                        response: {
                            emotion: parseInt(hj.widget
                                .data.step1.emotion,
                                10),
                            message: hj.widget.data
                                .step1.comment,
                            email: hj.widget.data.step2
                                .email
                        }
                    };
                    null !== hj.widget.data.selectors &&
                        (g = hj.ui.getWindowSize(), d =
                            hj.hq(window).scrollTop(),
                            h = d + g.height, g = 0 + g
                            .width, b.page_content = hj
                            .html.getPageContent(), b.viewport = [
                                d, 0, h, g
                            ], b.selectors = hj.widget.data
                            .selectors);
                    hj.request.saveFeedbackResponse(b);
                    hj.widget.show(
                        "._hj-f5b2a1eb-9b07_hotjar_buddy"
                    );
                    hj.hq(
                        "._hj-f5b2a1eb-9b07_hotjar_buddy"
                    ).attr("data-face", "wink");
                    a && (hj.hq(
                            "#_hj-f5b2a1eb-9b07_feedback_minimized_text"
                        ).text(hj.widget.feedbackData
                            .content.thankyou), hj.widget
                        .show(
                            "._hj-f5b2a1eb-9b07_feedback_minimized_message"
                        ), setTimeout(function() {
                            hj.widget.closeMinimizedMessage()
                        }, 6E3))
                }, "feedback");
            hj.widget.closeMinimizedMessage = hj.tryCatch(
                function() {
                    hj.hq(
                        "._hj-f5b2a1eb-9b07_hotjar_buddy"
                    ).attr("data-face", "happy");
                    hj.widget.hide(
                        "._hj-f5b2a1eb-9b07_feedback_minimized_message"
                    )
                }, "feedback");
            hj.widget.showMinimizedState = hj.tryCatch(
                function() {
                    hj.hq("#_hj-f5b2a1eb-9b07_feedback")
                        .removeClass(
                            "_hj-f5b2a1eb-9b07_feedback_open"
                        ).addClass(
                            "_hj-f5b2a1eb-9b07_feedback_minimized"
                        );
                    hj.widget.hideOverlay();
                    hj.widget.resetWidget();
                    hj.widget.hidePageHighlight()
                }, "feedback");
            hj.widget.showOpenState = hj.tryCatch(function() {
                hj.hq("#_hj-f5b2a1eb-9b07_feedback")
                    .removeClass(
                        "_hj-f5b2a1eb-9b07_feedback_minimized"
                    ).addClass(
                        "_hj-f5b2a1eb-9b07_feedback_open"
                    )
            }, "feedback");
            hj.widget.hideOpenState = hj.tryCatch(function() {
                hj.hq("#_hj-f5b2a1eb-9b07_feedback")
                    .removeClass(
                        "_hj-f5b2a1eb-9b07_feedback_open"
                    )
            }, "feedback");
            hj.widget.show = hj.tryCatch(function(a) {
                hj.hq(a).removeClass(
                    "_hj-f5b2a1eb-9b07_hidden")
            }, "feedback");
            hj.widget.hide = hj.tryCatch(function(a) {
                hj.hq(a).addClass(
                    "_hj-f5b2a1eb-9b07_hidden")
            }, "feedback");
            hj.widget.showFooter = hj.tryCatch(function() {
                hj.widget.show(
                    "._hj-f5b2a1eb-9b07_widget_footer"
                )
            }, "feedback");
            hj.widget.hideFooter = hj.tryCatch(function() {
                hj.widget.hide(
                    "._hj-f5b2a1eb-9b07_widget_footer"
                )
            }, "feedback");
            hj.widget.showOverlay = hj.tryCatch(function() {
                hj.hq("#_hj_feedback_container").addClass(
                    "_hj-f5b2a1eb-9b07_show_overlay"
                )
            }, "feedback");
            hj.widget.hideOverlay = hj.tryCatch(function() {
                hj.hq("#_hj_feedback_container").removeClass(
                    "_hj-f5b2a1eb-9b07_show_overlay"
                )
            }, "feedback");
            hj.widget.showSelectionModal = hj.tryCatch(
                function() {
                    hj.widget.show(
                        "#_hj-f5b2a1eb-9b07_feedback_select_button"
                    )
                }, "feedback");
            hj.widget.hideSelectionModal = hj.tryCatch(
                function() {
                    hj.widget.hide(
                        "#_hj-f5b2a1eb-9b07_feedback_select_button"
                    )
                }, "feedback");
            hj.widget.showPageHighlight = hj.tryCatch(
                function() {
                    hj.widget.show(
                        "#_hj-f5b2a1eb-9b07_feedback_page_highlight"
                    )
                }, "feedback");
            hj.widget.hidePageHighlight = hj.tryCatch(
                function() {
                    hj.widget.hide(
                        "#_hj-f5b2a1eb-9b07_feedback_page_highlight"
                    )
                }, "feedback");
            hj.widget.showPageScreenshotToggle = hj.tryCatch(
                function() {
                    hj.widget.show(
                        "#_hj-f5b2a1eb-9b07_feedback_toggle_screenshot"
                    )
                }, "feedback");
            hj.widget.hidePageScreenshotToggle = hj.tryCatch(
                function() {
                    hj.widget.hide(
                        "#_hj-f5b2a1eb-9b07_feedback_toggle_screenshot"
                    )
                }, "feedback");
            hj.widget.enableSelectionState = hj.tryCatch(
                function() {
                    hj.hq("#_hj_feedback_container").addClass(
                        "_hj-f5b2a1eb-9b07_selection_state"
                    );
                    hj.widget.hideSelectionModal();
                    hj.widget.hideOpenState();
                    hj.widget.enableElementHighlighting()
                }, "feedback");
            hj.widget.disableSelectionState = hj.tryCatch(
                function() {
                    hj.hq("#_hj_feedback_container").removeClass(
                        "_hj-f5b2a1eb-9b07_selection_state"
                    );
                    hj.widget.data.selectors === [
                        "html"
                    ] && hj.widget.showSelectionModal();
                    hj.widget.showOpenState();
                    hj.widget.disableElementHighlighting()
                }, "feedback");
            hj.widget.enableElementHighlighting = hj.tryCatch(
                function() {
                    hj.hq("body *").on("mouseover", hj.tryCatch(
                        function(a) {
                            a.stopPropagation();
                            hj.hq(this).hasClass(
                                "_hj-f5b2a1eb-9b07_feedback_selection_ignore"
                            ) || (hj.hq(
                                "._hj-f5b2a1eb-9b07_feedback_selection_hover"
                            ).removeClass(
                                "_hj-f5b2a1eb-9b07_feedback_selection_hover"
                            ), hj.hq(
                                this).addClass(
                                "_hj-f5b2a1eb-9b07_feedback_selection_hover"
                            ))
                        }, "feedback"));
                    setTimeout(function() {
                        hj.hq("body *").on(
                            "click", hj.tryCatch(
                                function(a) {
                                    a.stopPropagation();
                                    hj.hq(
                                            this
                                        ).hasClass(
                                            "_hj-f5b2a1eb-9b07_feedback_selection_ignore"
                                        ) ||
                                        (hj
                                            .hq(
                                                "._hj-f5b2a1eb-9b07_feedback_selection_hover"
                                            )
                                            .removeClass(
                                                "_hj-f5b2a1eb-9b07_feedback_selection_hover"
                                            ),
                                            hj
                                            .hq(
                                                this
                                            )
                                            .addClass(
                                                "_hj-f5b2a1eb-9b07_feedback_selection_selected"
                                            ),
                                            hj
                                            .widget
                                            .data
                                            .selectors = [
                                                hj
                                                .dom
                                                .getPath(
                                                    hj
                                                    .hq(
                                                        this
                                                    )
                                                )
                                            ],
                                            hj
                                            .widget
                                            .disableSelectionState()
                                        )
                                },
                                "feedback")
                        )
                    }, 0)
                }, "feedback");
            hj.widget.disableElementHighlighting = hj.tryCatch(
                function() {
                    hj.hq("body *").off("mouseover");
                    hj.hq("body *").off("click")
                }, "feedback");
            hj.widget.init()
        }

        function a() {
            hj.log.debug("Rendering feedback widget.",
                "feedback");
            hj.widget.setLanguage(hj.widget.feedbackData.language);
            hj.widget.feedbackData.baseColor = "#333333";
            hj.widget.feedbackData.backgroundColor =
                "#FFFFFF";
            hj.widget.feedbackData.accentColor = "#F4364C";
            var a = hj.rendering.renderTemplate(g, {
                apiUrlBase: new hj.rendering.TrustedString(
                    hj.apiUrlBase),
                hjStaticHost: new hj.rendering.TrustedString(
                    hj.staticHost),
                hjid: _hjSettings.hjid,
                p: hj.widget.widgetAttributePrefix,
                preview: hj.isPreview || !1,
                feedback: {
                    id: hj.widget.feedbackData.id,
                    effectiveShowBranding: hj.widget
                        .feedbackData.effective_show_branding,
                    content: hj.widget.feedbackData
                        .content
                },
                widgetStyle: {
                    backgroundColor: "#ffffff",
                    textColor: "#3c3c3c",
                    mainColor: "#F4364C",
                    mainTextColor: "#ffffff",
                    footerTextColor: "#999999",
                    footerBorderColor: "#ccc",
                    secondaryColor: "#999999"
                }
            });
            hj.widget.ctrl = hj.rendering.addToDom(
                "_hj_feedback_container", a);
            m()
        }
        var b = {},
            g = ['<div id="_hj_feedback_container">', hj.widget
                .commonCSS,
                '<style type="text/css">                    /* Generic CSS */                    @font-face {                        font-family: "hotjar";                        src: url("//<%= hjStaticHost %>/static/client/modules/assets/font-hotjar.eot?yoby9o");                        src: url("//<%= hjStaticHost %>/static/client/modules/assets/font-hotjar.eot?yoby9o#iefix") format("embedded-opentype"),                             url("//<%= hjStaticHost %>/static/client/modules/assets/font-hotjar.ttf?yoby9o") format("truetype"),                             url("//<%= hjStaticHost %>/static/client/modules/assets/font-hotjar.woff?yoby9o") format("woff"),                             url("//<%= hjStaticHost %>/static/client/modules/assets/font-hotjar.svg?yoby9o#hotjar") format("svg");                        font-weight: normal;                        font-style: normal;                    }                                        ._hj-f5b2a1eb-9b07_icon {speak: none; font-style: normal; font-weight: normal; font-variant: normal; text-transform: none; line-height: 1; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;}                    ._hj-f5b2a1eb-9b07_icon, ._hj-f5b2a1eb-9b07_icon * {font-family: "hotjar" !important;}                    ._hj-f5b2a1eb-9b07_icon-down:before     {content: "\\\\e800";}                    ._hj-f5b2a1eb-9b07_icon-up:before       {content: "\\\\e801";}                    ._hj-f5b2a1eb-9b07_icon-right:before    {content: "\\\\e802";}                    ._hj-f5b2a1eb-9b07_icon-x:before        {content: "\\\\e803";}                    ._hj-f5b2a1eb-9b07_icon-ok:before       {content: "\\\\e804";}                    ._hj-f5b2a1eb-9b07_icon-left:before     {content: "\\\\e805";}                    ._hj-f5b2a1eb-9b07_icon-hotjar:before   {content: "\\\\e806";}                    ._hj-f5b2a1eb-9b07_icon-camera:before   {content: "\\\\e807";}                    ._hj-f5b2a1eb-9b07_icon-pointer:before  {content: "\\\\e808";}                                        /* Faces (emotions) */                    ._hj-f5b2a1eb-9b07_icon_face *:before {color: #3c3c3c; margin-left: -1.34765625em;}                    ._hj-f5b2a1eb-9b07_icon_face .path1:before {content: "\\\\e900"; color: #FFD902; margin: 0;}                                        ._hj-f5b2a1eb-9b07_icon_face[data-face="angry"] .path2:before {content: "\\\\e901";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="angry"] .path3:before {content: "\\\\e902";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="angry"] .path4:before {content: "\\\\e903";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="angry"] .path5:before {content: "\\\\e904";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="angry"] .path6:before {content: "\\\\e905";}                                        ._hj-f5b2a1eb-9b07_icon_face[data-face="sad"] .path2:before {content: "\\\\e907";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="sad"] .path3:before {content: "\\\\e908";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="sad"] .path4:before {content: "\\\\e909";}                                        ._hj-f5b2a1eb-9b07_icon_face[data-face="neutral"] .path2:before {content: "\\\\e90b";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="neutral"] .path3:before {content: "\\\\e90c";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="neutral"] .path4:before {content: "\\\\e90d";}                                        ._hj-f5b2a1eb-9b07_icon_face[data-face="happy"] .path2:before {content: "\\\\e90f";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="happy"] .path3:before {content: "\\\\e910";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="happy"] .path4:before {content: "\\\\e911";}                                        ._hj-f5b2a1eb-9b07_icon_face[data-face="love"] .path2:before {content: "\\\\e913"; margin-left: -1.3427734375em;}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="love"] .path3:before {content: "\\\\e914"; margin-left: -1.3427734375em;}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="love"] .path4:before {content: "\\\\e915"; margin-left: -1.3427734375em;}                                        ._hj-f5b2a1eb-9b07_icon_face[data-face="wink"] .path2:before {content: "\\\\e90f";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="wink"] .path3:before {content: "\\\\e910";}                    ._hj-f5b2a1eb-9b07_icon_face[data-face="wink"] .path4:before {content: "\\\\e915"; margin-left: -1.3427734375em;}                                        ._hj-f5b2a1eb-9b07_icon_face_off .path1:before {color: #ccc;}                                        ._hj-f5b2a1eb-9b07_icon_face_main *:before{color: <%= widgetStyle.mainTextColor %>}                    ._hj-f5b2a1eb-9b07_icon_face_main .path1:before {color: <%= widgetStyle.mainColor %>}                                        /* Main container */                    #_hj-f5b2a1eb-9b07_feedback {bottom:0; right: 0;}                                        /* Overlay */                    #_hj-f5b2a1eb-9b07_feedback_overlay {display: none; background: black; position: fixed; top: 0; bottom: 0; left: 0; right: 0; opacity: .8; filter: alpha(opacity=80); -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";}                    #_hj_feedback_container._hj-f5b2a1eb-9b07_show_overlay #_hj-f5b2a1eb-9b07_feedback_overlay {display: block;}                                        /* Selection modal */                    #_hj-f5b2a1eb-9b07_feedback_select_button {position: fixed; top: 30%; left: 50%; width: 200px; margin-left: -100px; text-align: center; color: rgba(255,255,255,.3); font-weight: bold; font-size: 14px;}                     #_hj-f5b2a1eb-9b07_feedback_select_button > div {border: 4px dashed rgba(255,255,255,.3); padding: 20px; display: inline-block !important; border-radius: 2px; margin-bottom: 15px; line-height: 20px;}                    #_hj-f5b2a1eb-9b07_feedback_select_button > div > span {font-size: 40px; font-weight: normal;}                                        #_hj-f5b2a1eb-9b07_feedback_overlay:hover #_hj-f5b2a1eb-9b07_feedback_select_button {color: rgba(255,255,255,.5);}                    #_hj-f5b2a1eb-9b07_feedback_overlay:hover #_hj-f5b2a1eb-9b07_feedback_select_button > div {border: 4px dashed rgba(255,255,255,.5); background: rgba(0,0,0,.7);}                                        /* Initial state */                    #_hj-f5b2a1eb-9b07_feedback_minimized {display: none; opacity: .94; height: 60px; width: 269px; bottom: 20px; right: 29px; font-size: 12px !important; position: fixed;}                    ._hj-f5b2a1eb-9b07_feedback_minimized #_hj-f5b2a1eb-9b07_feedback_minimized {display: block;}                    ._hj-f5b2a1eb-9b07_feedback_minimized ._hj-f5b2a1eb-9b07_hotjar_buddy {position: absolute; right: 0; bottom: 0; height: 50px; width: 50px; font-size: 37px; cursor: pointer;}                    ._hj-f5b2a1eb-9b07_feedback_minimized ._hj-f5b2a1eb-9b07_hotjar_buddy .path1 {text-shadow: 0 2px 30px rgba(0,0,0,.4) !important;}                    ._hj-f5b2a1eb-9b07_feedback_minimized ._hj-f5b2a1eb-9b07_feedback_minimized_message {position: absolute; right: 70px; bottom: 7px; padding: 12px 15px; max-width: 200px; text-align: center; cursor: pointer; background: <%= widgetStyle.backgroundColor %>; border: 1px solid #ddd; border-radius: 4px; -webkit-box-shadow: 0 2px 32px rgba(0,0,0,.16); -moz-box-shadow: 0 2px 32px rgba(0,0,0,.16); box-shadow: 0 2px 32px rgba(0,0,0,.16);}                    ._hj-f5b2a1eb-9b07_feedback_minimized ._hj-f5b2a1eb-9b07_feedback_minimized_message:before {content: ""; width: 1px; height: 1px; position: absolute; right: -8px; bottom: 17px; border-left: 7px solid #ddd; border-top: 6px solid transparent; border-bottom: 6px solid transparent;}                    ._hj-f5b2a1eb-9b07_feedback_minimized ._hj-f5b2a1eb-9b07_feedback_minimized_message ._hj-f5b2a1eb-9b07_feedback_minimized_close {position: absolute; top: -8px; left: -8px; width: 20px; height: 20px; border-radius: 50%; font-size: 11px; line-height: 22px; text-align: center; cursor: pointer; background-color: #666666; color: <%= widgetStyle.mainTextColor %>}                                        #_hj-f5b2a1eb-9b07_feedback_minimized:hover {opacity: 1;}                    #_hj-f5b2a1eb-9b07_feedback_minimized:hover ._hj-f5b2a1eb-9b07_hotjar_buddy .path1 {text-shadow: 0 4px 35px rgba(0,0,0,.45) !important;}                                        /* Open state */                    ._hj-f5b2a1eb-9b07_feedback_open {top: 0; bottom: 0; left: 0; right: 0; width: auto;}                    #_hj-f5b2a1eb-9b07_feedback_open {display: none; width: 320px; bottom: 92px; position: fixed; right: 20px; background: <%= widgetStyle.backgroundColor %>; border-radius: 3px; box-shadow: 0 5px 60px rgba(0,0,0,.40) !important;}                    ._hj-f5b2a1eb-9b07_feedback_open #_hj-f5b2a1eb-9b07_feedback_open {display: block;}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_feedback_open_close {position: absolute; bottom: -60px; right: 10px; width: 43px; height: 37px; font-size: 20px; line-height: 36px; text-align: center; cursor: pointer; background-color: #666666; color: white; border-radius: 11px; padding-left: 1px; }                                        /* Step 1 (emotion + comment) */                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_content {margin-bottom: 18px;}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_content ._hj-f5b2a1eb-9b07_emotion_option {float: left !important; width: 20%; text-align: center; font-size: 26px; cursor: pointer;}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_content:hover ._hj-f5b2a1eb-9b07_emotion_option {opacity: .6}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_content ._hj-f5b2a1eb-9b07_emotion_option:hover {opacity: 1;}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder {position: relative; display: none;}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder:before {content: ""; width: 1px; height: 1px; position: absolute; left: auto; top: -6px; border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 5px solid rgba(0,0,0,.1);}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder[data-caret-position="0"],                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder[data-caret-position="1"],                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder[data-caret-position="2"],                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder[data-caret-position="3"],                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder[data-caret-position="4"] {display: block;}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder[data-caret-position="0"]:before {left: 9.5%;}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder[data-caret-position="1"]:before {left: 29.5%;}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder[data-caret-position="2"]:before {left: 49.5%;}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder[data-caret-position="3"]:before {left: 69.5%;}                    ._hj-f5b2a1eb-9b07_feedback_open ._hj-f5b2a1eb-9b07_emotion_comment_holder[data-caret-position="4"]:before {left: 89.5%;}                                        /* Page highlight - ENABLED */                    #_hj-f5b2a1eb-9b07_feedback_page_highlight > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_top,                    #_hj-f5b2a1eb-9b07_feedback_page_highlight > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_right,                    #_hj-f5b2a1eb-9b07_feedback_page_highlight > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_bottom,                    #_hj-f5b2a1eb-9b07_feedback_page_highlight > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_left {position: absolute; background: <%= widgetStyle.mainColor %>}                    #_hj-f5b2a1eb-9b07_feedback_page_highlight > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_top {top: 0; left: 0; right: 0; height: 4px;}                    #_hj-f5b2a1eb-9b07_feedback_page_highlight > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_right {top: 0; bottom: 0; right: 0; width: 4px;}                    #_hj-f5b2a1eb-9b07_feedback_page_highlight > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_bottom {bottom: 0; left: 0; right: 0; height: 4px;}                    #_hj-f5b2a1eb-9b07_feedback_page_highlight > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_left {top: 0; left: 0; bottom: 0; width: 4px;}                                        #_hj-f5b2a1eb-9b07_feedback_page_highlight > #_hj-f5b2a1eb-9b07_feedback_toggle_screenshot {position: fixed; top: -4px; left: 50%; width: 280px; margin-left: -160px; text-align: center; font-weight: bold; font-size: 13px; background-color: <%= widgetStyle.mainColor %>; color: <%= widgetStyle.mainTextColor %>; padding: 20px 20px 15px 20px; border-radius: 3px;}                    #_hj-f5b2a1eb-9b07_feedback_page_highlight > #_hj-f5b2a1eb-9b07_feedback_toggle_screenshot > label {cursor: pointer;}                    #_hj-f5b2a1eb-9b07_feedback_page_highlight > #_hj-f5b2a1eb-9b07_feedback_toggle_screenshot > input {margin: -3px 6px 0 0;}                                        /* Page highlight - DISABLED */                    #_hj-f5b2a1eb-9b07_feedback_page_highlight._hj-f5b2a1eb-9b07_feedback_page_highlight_grey > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_top,                    #_hj-f5b2a1eb-9b07_feedback_page_highlight._hj-f5b2a1eb-9b07_feedback_page_highlight_grey > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_right,                    #_hj-f5b2a1eb-9b07_feedback_page_highlight._hj-f5b2a1eb-9b07_feedback_page_highlight_grey > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_bottom,                    #_hj-f5b2a1eb-9b07_feedback_page_highlight._hj-f5b2a1eb-9b07_feedback_page_highlight_grey > ._hj-f5b2a1eb-9b07_feedback_page_highlight_line_left {background: #666666 !important;}                    #_hj-f5b2a1eb-9b07_feedback_page_highlight._hj-f5b2a1eb-9b07_feedback_page_highlight_grey > #_hj-f5b2a1eb-9b07_feedback_toggle_screenshot {background: #666666 !important;}                                        ._hj-f5b2a1eb-9b07_selection_state ._hj-f5b2a1eb-9b07_widget {top: 0; bottom: 0; left: 0; right: 0; width: auto;}                    ._hj-f5b2a1eb-9b07_selection_state #_hj-f5b2a1eb-9b07_select_screen {display: block;}                    #_hj_feedback_container._hj-f5b2a1eb-9b07_selection_state._hj-f5b2a1eb-9b07_show_overlay:before {opacity: .1; filter: alpha(opacity=10); -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=10)";}                     ._hj-f5b2a1eb-9b07_selection_state,                    ._hj-f5b2a1eb-9b07_selection_state._hj-f5b2a1eb-9b07_show_overlay:before {pointer-events: none;}                    ._hj-f5b2a1eb-9b07_feedback_selection_hover {-webkit-box-shadow: inset 0 0 0 3px <%= widgetStyle.mainColor %> !important; -moz-box-shadow: inset 0 0 0 3px <%= widgetStyle.mainColor %> !important; box-shadow: inset 0 0 0 3px <%= widgetStyle.mainColor %> !important; cursor: pointer;}                    ._hj-f5b2a1eb-9b07_feedback_selection_selected {-webkit-box-shadow: inset 0 0 0 3px <%= widgetStyle.mainColor %> !important; -moz-box-shadow: inset 0 0 0 3px <%= widgetStyle.mainColor %> !important; box-shadow: inset 0 0 0 3px <%= widgetStyle.mainColor %> !important; cursor: pointer;}                                        /* Old widgets CSS overrides */                    ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_btn_primary,                    ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_btn_primary:hover,                    ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_btn_primary:focus,                    ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_btn_primary:active {background: <%= widgetStyle.mainColor %> !important}                                        ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_btn_disabled,                    ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_btn_disabled:hover,                    ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_btn_disabled:focus,                    ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_btn_disabled:active {                        background: <%= widgetStyle.secondaryColor %> !important;                    }                                        ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_widget_content ._hj-f5b2a1eb-9b07_input_field {border: 0 !important; background: rgba(0,0,0,.1) !important; color: rgba(0,0,0,.7); padding: 12px !important;}                                        ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_widget_footer {border-top: 0!important;}                    ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_widget_footer ._hj-f5b2a1eb-9b07_pull_left {padding-top: 9px;}                    ._hj-f5b2a1eb-9b07_widget ._hj-f5b2a1eb-9b07_widget_footer ._hj-f5b2a1eb-9b07_pull_right {padding-top: 0;}                                    </style><div id="_hj-f5b2a1eb-9b07_feedback" class="_hj-f5b2a1eb-9b07_widget _hj-f5b2a1eb-9b07_<%= hj.widget.activeLanguageDirection %>">                                        <div id="_hj-f5b2a1eb-9b07_feedback_overlay">                                            \x3c!-- SELECT AN ELEMENT BUTTON --\x3e                        <div id="_hj-f5b2a1eb-9b07_feedback_select_button" class="_hj-f5b2a1eb-9b07_hidden" >                            <div>                                <span class="_hj-f5b2a1eb-9b07_icon _hj-f5b2a1eb-9b07_icon-pointer"></span>                            </div>                            <br />                            <%=hj.widget._("highlight_element")%>                        </div>                                            </div>                                        \x3c!-- Minimized State --\x3e                    <div id="_hj-f5b2a1eb-9b07_feedback_minimized">                        <div class="_hj-f5b2a1eb-9b07_hotjar_buddy _hj-f5b2a1eb-9b07_icon _hj-f5b2a1eb-9b07_icon_face _hj-f5b2a1eb-9b07_icon_face_main _hj-f5b2a1eb-9b07_hidden" data-face="happy">                            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>                        </div>                        <div class="_hj-f5b2a1eb-9b07_feedback_minimized_message _hj-f5b2a1eb-9b07_hidden">                            <a class="_hj-f5b2a1eb-9b07_feedback_minimized_close _hj-f5b2a1eb-9b07_link_no_underline _hj-f5b2a1eb-9b07_icon _hj-f5b2a1eb-9b07_icon-x"></a>                            <span id="_hj-f5b2a1eb-9b07_feedback_minimized_text"><%= feedback.content.initial %></span>                        </div>                    </div>                                        \x3c!-- Opened State --\x3e                    <div id="_hj-f5b2a1eb-9b07_feedback_open">                        <a class="_hj-f5b2a1eb-9b07_feedback_open_close _hj-f5b2a1eb-9b07_link_no_underline _hj-f5b2a1eb-9b07_icon _hj-f5b2a1eb-9b07_icon-x"></a>                                                \x3c!-- STEP 1: EMOTION --\x3e                        <div id="_hj-f5b2a1eb-9b07_step-1" class="_hj-f5b2a1eb-9b07_hidden" data-node="step">                            <p class="_hj-f5b2a1eb-9b07_widget_title"><%= feedback.content.emotion %></p>                            <div class="_hj-f5b2a1eb-9b07_widget_content">                                <div class="_hj-f5b2a1eb-9b07_emotion_content">                                    <div class="_hj-f5b2a1eb-9b07_emotion_option" data-bind="emotion" data-emotion-option="0">                                        <div class="_hj-f5b2a1eb-9b07_icon _hj-f5b2a1eb-9b07_icon_face" data-face="angry">                                            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span>                                        </div>                                    </div>                                    <div class="_hj-f5b2a1eb-9b07_emotion_option" data-bind="emotion" data-emotion-option="1">                                        <div class="_hj-f5b2a1eb-9b07_icon _hj-f5b2a1eb-9b07_icon_face" data-face="sad">                                            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>                                        </div>                                    </div>                                    <div class="_hj-f5b2a1eb-9b07_emotion_option" data-bind="emotion" data-emotion-option="2">                                        <div class="_hj-f5b2a1eb-9b07_icon _hj-f5b2a1eb-9b07_icon_face" data-face="neutral">                                            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>                                        </div>                                    </div>                                    <div class="_hj-f5b2a1eb-9b07_emotion_option" data-bind="emotion" data-emotion-option="3">                                        <div class="_hj-f5b2a1eb-9b07_icon _hj-f5b2a1eb-9b07_icon_face" data-face="happy">                                            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>                                        </div>                                    </div>                                    <div class="_hj-f5b2a1eb-9b07_emotion_option" data-bind="emotion" data-emotion-option="4">                                        <div class="_hj-f5b2a1eb-9b07_icon _hj-f5b2a1eb-9b07_icon_face" data-face="love">                                            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>                                        </div>                                    </div>                                    <div class="_hj-f5b2a1eb-9b07_clear_both"></div>                                </div>                                <div class="_hj-f5b2a1eb-9b07_emotion_comment_holder" data-caret-position="-">                                    <textarea maxlength="255" class="_hj-f5b2a1eb-9b07_input_field _hj-f5b2a1eb-9b07_rounded_corners" id="_hj-f5b2a1eb-9b07_emotion_comment" name="_hj-f5b2a1eb-9b07_emotion_comment" placeholder="<%=hj.widget._("tell_us_about_your_experience")%>" rows="3" data-bind="comment"></textarea>                                </div>                            </div>                        </div>                                                \x3c!-- STEP 2: EMAIL --\x3e                        <div id="_hj-f5b2a1eb-9b07_step-2" class="_hj-f5b2a1eb-9b07_hidden" data-node="step">                            <p class="_hj-f5b2a1eb-9b07_widget_title"><%= feedback.content.email %></p>                            <div class="_hj-f5b2a1eb-9b07_widget_content">                                 <input maxlength="255" class="_hj-f5b2a1eb-9b07_input_field _hj-f5b2a1eb-9b07_rounded_corners" type="text" id="_hj-f5b2a1eb-9b07_email name="_hj-f5b2a1eb-9b07_email" placeholder="<%=hj.widget._("email_example")%>" data-bind="email" />                             </div>                        </div>                                                \x3c!-- FOOTER --\x3e                        <div class="_hj-f5b2a1eb-9b07_widget_footer _hj-f5b2a1eb-9b07_hidden">                            <% if (feedback.effectiveShowBranding) { %>                                <div class="_hj-f5b2a1eb-9b07_pull_left">                                    <span class="_hj-f5b2a1eb-9b07_link_no_underline _hj-f5b2a1eb-9b07_icon _hj-f5b2a1eb-9b07_icon-hotjar"></span>                                    Not using <a href="https://www.hotjar.com/?utm_source=client&utm_medium=poll&utm_campaign=insights" target="_blank">Hotjar</a> yet?                                </div>                            <% } %>                            <div class="_hj-f5b2a1eb-9b07_pull_right">                                <button type="button" id="_hj-f5b2a1eb-9b07_action_submit" class="_hj-f5b2a1eb-9b07_btn_primary _hj-f5b2a1eb-9b07_btn_disabled _hj-f5b2a1eb-9b07_rounded_corners _hj-f5b2a1eb-9b07_transition _hj-f5b2a1eb-9b07_shadow"><%=hj.widget._("next")%></button>                            </div>                            <div class="_hj-f5b2a1eb-9b07_clear_both"></div>                        </div>                    </div>                                        \x3c!-- SELECTION LAYER --\x3e                    <div id="_hj-f5b2a1eb-9b07_feedback_page_highlight" class="_hj-f5b2a1eb-9b07_hidden">                        <div class="_hj-f5b2a1eb-9b07_feedback_page_highlight_line_top"></div>                        <div class="_hj-f5b2a1eb-9b07_feedback_page_highlight_line_right"></div>                        <div class="_hj-f5b2a1eb-9b07_feedback_page_highlight_line_bottom"></div>                        <div class="_hj-f5b2a1eb-9b07_feedback_page_highlight_line_left"></div>                        <div id="_hj-f5b2a1eb-9b07_feedback_toggle_screenshot" class="_hj-f5b2a1eb-9b07_feedback_top_container _hj-f5b2a1eb-9b07_hidden">                            <input type="checkbox" checked="checked" id="_hj-f5b2a1eb-9b07_feedback_screenshot_checkbox" name="_hj-f5b2a1eb-9b07_feedback_screenshot_checkbox" />                            <label for="_hj-f5b2a1eb-9b07_feedback_screenshot_checkbox"><%=hj.widget._("include_screenshot_with_feedback")%></label>                        </div>                    </div>                                    </div>'
            ].join("");
        b.run = hj.tryCatch(function(b) {
            b ? (hj.widget.feedbackData = b, hj.tryCatch(
                a, "feedback")()) : hj.hq.each(hj.settings
                .feedback_widgets || [], function(b,
                    c) {
                    hj.targeting.onMatch(c.targeting,
                        hj.tryCatch(function() {
                            hj.log.debug(
                                "Feedback widget #" +
                                c.id +
                                " has matched.",
                                "feedback"
                            );
                            hj.widget.data ?
                                hj.log.debug(
                                    "Another feedback widget is already present.",
                                    "feedback"
                                ) : hj.widget
                                .addMatchingWidget(
                                    c.created_epoch_time,
                                    function() {
                                        hj.widget
                                            .feedbackData =
                                            c;
                                        hj.rendering
                                            .callAccordingToCondition(
                                                hj
                                                .widget
                                                .feedbackData,
                                                "feedback",
                                                hj
                                                .tryCatch(
                                                    a,
                                                    "feedback"
                                                )
                                            )
                                    })
                        }, "feedback"))
                })
        }, "feedback");
        hj.isPreview && (window._hjFeedbackReload = hj.tryCatch(
            function(a) {
                b.run(a)
            }, "feedback"));
        return b
    }(), !0)
}, "feedback")();
hj.tryCatch(function() {
    hj.loader.registerModule("Polls", function() {
        function m() {
            function a() {
                var b = hj.hq(
                        "._hj-f5b2a1eb-9b07_button_radio_checkbox_active"
                    ).length,
                    c = !0,
                    d, f, h;
                if (0 === b) c = !1;
                else
                    for (d = 0; d < b; d += 1)
                        if (f = hj.hq(hj.hq(
                            "._hj-f5b2a1eb-9b07_button_radio_checkbox_active"
                        )[d]), h = f.find(
                            "._hj-f5b2a1eb-9b07_input_field"
                        ).val(), f.hasClass(
                            "_hj-f5b2a1eb-9b07_with_comment"
                        ) && 0 === h.length) {
                            c = !1;
                            break
                        } return c
            }
            var d;
            hj.widget.currentQuestionIndex = 0;
            hj.widget.submitResponse = hj.tryCatch(function() {
                var a = hj.hq(
                        "#_hj-f5b2a1eb-9b07_action_submit"
                    ),
                    d, h, g, l, m, n, p;
                if (!a.hasClass(
                    "_hj-f5b2a1eb-9b07_btn_disabled"
                )) {
                    a.addClass(
                        "_hj-f5b2a1eb-9b07_btn_disabled"
                    );
                    d = hj.widget.pollData.content.questions[
                        hj.widget.currentQuestionIndex
                    ];
                    h = hj.hq(hj.hq(
                        "#_hj-f5b2a1eb-9b07_question_content_" +
                        hj.widget.currentQuestionIndex
                    )[0]);
                    switch (d.type) {
                        case "single-close-ended":
                        case "multiple-close-ended":
                            l = h.find(
                                "._hj-f5b2a1eb-9b07_button_radio_checkbox_active"
                            ).length;
                            for (p = 0; p < l; p +=
                                1) m = hj.hq(h.find(
                                    "._hj-f5b2a1eb-9b07_button_radio_checkbox_active"
                                )[p]),
                                n = m.hasClass(
                                    "_hj-f5b2a1eb-9b07_with_comment"
                                ), a = m.attr(
                                    "data-value"),
                                g = parseInt(m.attr(
                                    "data-index"
                                ), 10), m = m.find(
                                    "textarea").val(),
                                c.push({
                                    question: b(
                                        d.text
                                    ),
                                    answer: a,
                                    comment: n &&
                                        m ? m : null
                                });
                            break;
                        case "net-promoter-score":
                            m = h.find(
                                "._hj-f5b2a1eb-9b07_button_score_active"
                            );
                            a = m.attr("data-value");
                            g = parseInt(a, 10);
                            if (6 >= g) g = 0;
                            else if (8 >= g) g = 1;
                            else if (10 >= g) g = 2;
                            else throw Error(
                                "Got unexpected NPS answer: " +
                                a);
                            c.push({
                                question: b(
                                    d.text
                                ),
                                answer: a,
                                comment: null
                            });
                            break;
                        case "single-open-ended-multiple-line":
                        case "single-open-ended-single-line":
                            a = h.find(
                                "input[name=_hj-f5b2a1eb-9b07_question_" +
                                hj.widget.currentQuestionIndex +
                                "_answer]").val();
                            g = null;
                            void 0 === a && (a = h.find(
                                    "textarea[name=_hj-f5b2a1eb-9b07_question_" +
                                    hj.widget.currentQuestionIndex +
                                    "_answer]")
                                .val() || "");
                            c.push({
                                question: b(
                                    d.text
                                ),
                                answer: a,
                                comment: null
                            });
                            break;
                        default:
                            throw Error(
                                "Unhandled question type: " +
                                d.type);
                    }
                    a = null === f ? {
                        action: "create_poll_response",
                        utk: hj.cookie.get(
                            "hubspotutk"),
                        response_content: hj.json
                            .stringify({
                                version: 4,
                                answers: c
                            })
                    } : {
                        action: "update_poll_response",
                        utk: hj.cookie.get(
                            "hubspotutk"),
                        response_content: hj.json
                            .stringify({
                                version: 4,
                                answers: c
                            }),
                        poll_response_id: f
                    };
                    c && (hj.isPreview || (hj.request
                        .savePollResponse(a,
                            function(a) {
                                f = a.poll_response_id
                            }), hj.widget.setDone()
                    ), hj.widget.goToNextQuestion(
                        g))
                }
            }, "polls");
            hj.widget.goToNextQuestion = hj.tryCatch(
                function(a) {
                    var b = hj.widget.pollData.content.questions[
                            hj.widget.currentQuestionIndex
                        ],
                        c = hj.hq(hj.hq(
                            "#_hj-f5b2a1eb-9b07_question_content_" +
                            hj.widget.currentQuestionIndex
                        )[0]);
                    switch (b.type) {
                        case "single-close-ended":
                        case "multiple-close-ended":
                            c.find(
                                "._hj-f5b2a1eb-9b07_button_radio_checkbox_active"
                            ).removeClass(
                                "_hj-f5b2a1eb-9b07_button_radio_checkbox_active"
                            );
                            c.find(
                                "._hj-f5b2a1eb-9b07_with_comment"
                            ).find("textarea").val(
                                "");
                            break;
                        case "net-promoter-score":
                            c.find(
                                "._hj-f5b2a1eb-9b07_button_score_active"
                            ).removeClass(
                                "_hj-f5b2a1eb-9b07_button_score_active"
                            );
                            break;
                        case "single-open-ended-multiple-line":
                        case "single-open-ended-single-line":
                            c.find(
                                "[name=_hj-f5b2a1eb-9b07_question_" +
                                hj.widget.currentQuestionIndex +
                                "_answer]").val("");
                            break;
                        default:
                            throw Error(
                                "Unhandled question type: " +
                                b.type);
                    }
                    if ("thankYou" === b.next) hj.widget
                        .goToQuestion("thankYou");
                    else if ("byAnswer" === b.next) hj.widget
                        .goToQuestion(b.nextByAnswer[a]);
                    else if (0 == b.next.indexOf(
                        "question:")) hj.widget.goToQuestion(
                        b.next);
                    else if ("byOrder" === b.next ||
                        "undefined" === typeof b.next)
                        hj.widget.goToQuestion(
                            "byOrder");
                    else throw Error(
                        "Unknown question.next value: " +
                        b.next);
                }, "polls");
            hj.widget.goToQuestion = hj.tryCatch(function(a) {
                switch (a) {
                    case "thankYou":
                        hj.widget.changeState(!1,
                            "thankyou");
                        return;
                    case "byOrder":
                        if (hj.widget.pollData.content
                            .questions.length ===
                            hj.widget.currentQuestionIndex +
                            1) {
                            hj.widget.changeState(!
                                1, "thankyou");
                            return
                        }
                        a = hj.widget.currentQuestionIndex +
                            1;
                        break;
                    default:
                        a = "string" === typeof a &&
                            -1 !== a.indexOf(":") ?
                            parseInt(a.split(":")[1],
                                10) : a
                }
                hj.widget.ctrl.find(
                    "#_hj-f5b2a1eb-9b07_question_text_" +
                    hj.widget.currentQuestionIndex
                ).addClass(
                    "_hj-f5b2a1eb-9b07_hidden");
                hj.widget.ctrl.find(
                    "#_hj-f5b2a1eb-9b07_question_content_" +
                    hj.widget.currentQuestionIndex
                ).addClass(
                    "_hj-f5b2a1eb-9b07_hidden");
                hj.widget.currentQuestionIndex = a;
                hj.widget.ctrl.find(
                    "#_hj-f5b2a1eb-9b07_question_text_" +
                    hj.widget.currentQuestionIndex
                ).removeClass(
                    "_hj-f5b2a1eb-9b07_hidden");
                hj.widget.ctrl.find(
                    "#_hj-f5b2a1eb-9b07_question_content_" +
                    hj.widget.currentQuestionIndex
                ).removeClass(
                    "_hj-f5b2a1eb-9b07_hidden");
                hj.widget.disableSubmit()
            }, "polls");
            hj.widget.setDone = hj.tryCatch(function() {
                hj.isPreview || "always" !== hj.widget
                    .pollData.persist_condition &&
                    hj.cookie.add("_hjDonePolls",
                        hj.widget.pollData.id)
            }, "polls");
            hj.widget.setMinimized = hj.tryCatch(function() {
                hj.isPreview || hj.cookie.add(
                    "_hjMinimizedPolls", hj.widget
                    .pollData.id)
            }, "polls");
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_button_radio_checkbox textarea"
            ).on("click", hj.tryCatch(function(a) {
                a.stopPropagation()
            }, "polls"));
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_button_radio").on(
                "click", hj.tryCatch(function() {
                    var b = hj.hq(this),
                        c = b.find(
                            "._hj-f5b2a1eb-9b07_input_field"
                        );
                    hj.hq(hj.hq(
                        "#_hj-f5b2a1eb-9b07_question_content_" +
                        hj.widget.currentQuestionIndex
                    )[0]).find(
                        "._hj-f5b2a1eb-9b07_button_radio_checkbox"
                    ).removeClass(
                        "_hj-f5b2a1eb-9b07_button_radio_checkbox_active"
                    );
                    b.addClass(
                        "_hj-f5b2a1eb-9b07_button_radio_checkbox_active"
                    );
                    c.focus();
                    setTimeout(function() {
                        a() ? hj.widget.enableSubmit() :
                            hj.widget.disableSubmit()
                    }, 0)
                }, "polls"));
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_button_checkbox").on(
                "click", hj.tryCatch(function() {
                    var b = hj.hq(this),
                        c = b.find(
                            "._hj-f5b2a1eb-9b07_input_field"
                        );
                    b.toggleClass(
                        "_hj-f5b2a1eb-9b07_button_radio_checkbox_active"
                    );
                    c.focus();
                    setTimeout(function() {
                        a() ? hj.widget.enableSubmit() :
                            hj.widget.disableSubmit()
                    }, 0)
                }, "polls"));
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_button_score").on(
                "click", hj.tryCatch(function() {
                    var a = hj.hq(this);
                    hj.widget.ctrl.find(
                        "._hj-f5b2a1eb-9b07_button_score"
                    ).removeClass(
                        "_hj-f5b2a1eb-9b07_button_score_active"
                    );
                    a.addClass(
                        "_hj-f5b2a1eb-9b07_button_score_active"
                    );
                    hj.widget.enableSubmit()
                }, "polls"));
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_input_field").on(
                "keyup", hj.tryCatch(function() {
                    var b = hj.widget.ctrl.find(
                        "#_hj-f5b2a1eb-9b07_question_content_" +
                        hj.widget.currentQuestionIndex
                    );
                    (
                        "single-open-ended-multiple-line" ===
                        b.attr("_hj_question_type") ||
                        "single-open-ended-single-line" ===
                        b.attr("_hj_question_type") ?
                        0 < hj.hq(this).val().length :
                        a()) ? hj.widget.enableSubmit():
                        hj.widget.disableSubmit()
                }, "polls"));
            hj.widget.ctrl.find(
                "#_hj-f5b2a1eb-9b07_action_submit").on(
                "click", hj.tryCatch(function() {
                    hj.widget.submitResponse()
                }, "polls"));
            hj.hq(window).on("resize", hj.tryCatch(function() {
                hj.widget.applyMobileClasses()
            }, "polls"));
            hj.widget.applyMobileClasses();
            d = hj.isPreview && "desktop" === hj.widget.pollData
                .previewDevice;
            hj.widget.isNarrowScreen() && !d ? hj.widget.collapseWidget() :
                hj.widget.openWidget();
            !hj.isPreview && hj.cookie.find(
                "_hjMinimizedPolls", hj.widget.pollData
                .id) && hj.widget.changeState(null,
                "hidden");
            d = hj.widget.pollData.activeStepInPreview;
            hj.isPreview && d && (hj.widget.goToQuestion(d),
                parseInt(d) && hj.widget.openWidget());
            hj.widget.init()
        }

        function a() {
            hj.log.debug("Rendering poll widget.", "poll");
            hj.widget.setLanguage(hj.widget.pollData.language);
            var a = hj.widget.changeColorLuminance(hj.widget
                    .pollData.background, -0.1),
                b = hj.widget.changeColorLuminance(hj.widget
                    .pollData.background, 0.1),
                c = hj.widget.changeColorLuminance(hj.widget
                    .pollData.background, -0.2),
                d = hj.widget.changeColorLuminance(hj.widget
                    .pollData.background, 0.2),
                f = hj.widget.changeColorLuminance(hj.widget
                    .pollData.background, -0.6),
                h = hj.widget.changeColorLuminance(hj.widget
                    .pollData.background, 0.6),
                a = hj.rendering.renderTemplate(p, {
                    apiUrlBase: new hj.rendering.TrustedString(
                        hj.apiUrlBase),
                    hjStaticHost: new hj.rendering.TrustedString(
                        hj.staticHost),
                    hjid: hj.settings.site_id,
                    preview: hj.isPreview || !1,
                    poll: {
                        id: hj.widget.pollData.id,
                        effectiveShowBranding: hj.widget
                            .pollData.effective_show_branding,
                        questions: hj.widget.pollData.content
                            .questions,
                        thankyou: hj.widget.pollData.content
                            .thankyou
                    },
                    widgetStyle: {
                        position: hj.widget.pollData.position,
                        skin: hj.widget.pollData.skin,
                        primaryColor: hj.widget.pollData
                            .background,
                        secondaryColor: "light" === hj.widget
                            .pollData.skin ? a : b,
                        alternateColor: "light" === hj.widget
                            .pollData.skin ? c : d,
                        footerTextColor: "light" === hj
                            .widget.pollData.skin ? f : h,
                        footerBorderColor: "light" ===
                            hj.widget.pollData.skin ? c : a,
                        fontColor: "light" === hj.widget
                            .pollData.skin ? "#111" : "#FFF",
                        fontColorNegative: "light" ===
                            hj.widget.pollData.skin ?
                            "#FFF" : "#111"
                    },
                    p: hj.widget.widgetAttributePrefix,
                    cta: new hj.rendering.TrustedString(
                        hj.widget.ctaLinks.polls)
                });
            hj.widget.ctrl = hj.rendering.addToDom(
                "_hj_poll_container", a);
            m();
            "once" == hj.widget.pollData.persist_condition &&
                hj.cookie.add("_hjDonePolls", hj.widget.pollData
                    .id)
        }

        function b(a) {
            return hj.hq("<span>" + a + "</span>").text()
        }

        function g(a) {
            hj.hq.each(a.content.questions, function(a, b) {
                b.answers && hj.hq.each(b.answers,
                    function(a, b) {
                        b.index = a
                    })
            })
        }

        function d(a) {
            hj.hq.each(a.content.questions, function(a, b) {
                b.randomize_answer_order && hj.utils
                    .shuffle(b.answers)
            })
        }
        var h = {},
            c = [],
            f = null,
            p = ['<div id="_hj_poll_container">',
                hj.widget.commonCSS,
                '<style type="text/css">                    /* Multiple question css adaptations */                                        /*comment fields*/                    .<%=p%>_widget .<%=p%>_button_radio_checkbox .<%=p%>_comment_box {                        display: none; margin: 0 20px 0 50px;                    }                    .<%=p%>_widget .<%=p%>_button_radio_checkbox .<%=p%>_comment_box > textarea {                        font-size: 13px !important;                        height: 45px !important;                        margin-bottom: 8px !important;                        border: 0 !important;                    }                                        .<%=p%>_widget                         .<%=p%>_button_radio_checkbox.<%=p%>_button_radio_checkbox_active.<%=p%>_with_comment                             span.<%=p%>_widget_icon {                        top: 14px !important; margin-top: 0 !important;                    }                    .<%=p%>_widget                         .<%=p%>_button_radio_checkbox.<%=p%>_button_radio_checkbox_active.<%=p%>_with_comment                             span.<%=p%>_radio_checkbox_text {                        padding-bottom: 10px !important;                    }                    .<%=p%>_widget                         .<%=p%>_button_radio_checkbox.<%=p%>_button_radio_checkbox_active.<%=p%>_with_comment                             .<%=p%>_comment_box {                        display: block;                    }                                        /*net promoter score*/                    .<%=p%>_widget .<%=p%>_net_promoter_score > ul {                        margin: 4px 0 0 0 !important; height: 28px;                    }                    .<%=p%>_widget .<%=p%>_net_promoter_score > ul > li.<%=p%>_button_score {                        float: left !important; width: 22px !important;                         padding: 4px 0 5px 0 !important;                        margin: 0 3px 0 0 !important;                        border-radius: 2px;                        text-align: center !important;                        opacity: 0.75 !important;                        cursor:pointer;                    }                    .<%=p%>_widget .<%=p%>_net_promoter_score > ul > li.<%=p%>_button_score_last {                        margin-right: 0 !important; width: 22px !important; padding-right: 1px !important;                    }                    .<%=p%>_widget .<%=p%>_net_promoter_score .<%=p%>_net_promoter_score_labels {                        padding: 5px 0 12px 0; font-size: 12px;                    }                    .<%=p%>_widget .<%=p%>_net_promoter_score .<%=p%>_net_promoter_score_labels .<%=p%>_pull_left,                    .<%=p%>_widget .<%=p%>_net_promoter_score .<%=p%>_net_promoter_score_labels .<%=p%>_pull_right {                        max-width: 45%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;                    }                                        .<%=p%>_widget .<%=p%>_net_promoter_score > ul > li.<%=p%>_button_score {                        border-bottom: 1px solid <%= widgetStyle.primaryColor %> !important;                        border-top: 1px solid <%= widgetStyle.alternateColor %> !important;                        background: <%= widgetStyle.secondaryColor %> !important;                    }                    .<%=p%>_widget .<%=p%>_net_promoter_score > ul > li.<%=p%>_button_score:hover {                        background: <%= widgetStyle.alternateColor %> !important;                        color: <%= widgetStyle.fontColorNegative %>;                        opacity: 1 !important;                    }                    .<%=p%>_widget .<%=p%>_net_promoter_score > ul                             > li.<%=p%>_button_score.<%=p%>_button_score_active,                     .<%=p%>_widget .<%=p%>_net_promoter_score                         > ul                             > li.<%=p%>_button_score.<%=p%>_button_score_active:hover {                        background: <%= widgetStyle.alternateColor %> !important;                         color: white !important;                         cursor: default;                        opacity: 1 !important;                    }                                        /*right-to-left css*/                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_button_radio_checkbox .<%=p%>_comment_box {                        margin: 0 50px 0 20px !important;                    }                    .<%=p%>_widget.<%=p%>_rtl                     .<%=p%>_button_radio_checkbox.<%=p%>_button_radio_checkbox_active.<%=p%>_with_comment span                    .<%=p%>_radio_checkbox_text {                        padding: 14px 50px 10px 20px !important;                    }                                        .<%=p%>_widget.<%=p%>_rtl .<%=p%>_net_promoter_score > ul > li.<%=p%>_button_score {                        float: right !important;                        margin: 0 0 0 3px !important;                        border-radius: 2px;                        text-align: center !important;                        opacity: 0.75 !important;                        cursor:pointer;                    }                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_net_promoter_score > ul > li.<%=p%>_button_score_last {                        margin-left: 0 !important;                    }                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_net_promoter_score .<%=p%>_net_promoter_score_labels                         .<%=p%>_pull_left {                        float: right !important;                    }                    .<%=p%>_widget.<%=p%>_rtl .<%=p%>_net_promoter_score .<%=p%>_net_promoter_score_labels                         .<%=p%>_pull_right {                        float: left !important;                    }                </style><div id="<%=p%>_poll" class="<%=p%>_widget <%=p%>_<%= hj.widget.activeLanguageDirection %>                         <%=p%>_skin_<%= widgetStyle.skin %> <%=p%>_position_<%= widgetStyle.position %>">                    <a                         class="<%=p%>_widget_open_close <%=p%>_action_toggle_widget"                    ><span class="<%=p%>_widget_icon"></span></a>                    <div class="<%=p%>_widget_hidden_handle <%=p%>_action_toggle_widget"></div>                    <p class="<%=p%>_widget_title <%=p%>_action_open_widget">                        <% for (var q = 0; q < poll.questions.length; q++) { %>                            <span id="<%=p%>_question_text_<%=q%>" class="<%=p%>_question_text <% if (q !== 0) { %>                                <%=p%>_hidden<%                             } %>"><%= poll.questions[q].text %></span>                        <% } %>                    </p>                    <div class="<%=p%>_widget_initiator">                        <button type="button" class="<%=p%>_btn_primary <%=p%>_rounded_corners <%=p%>_transition                             <%=p%>_shadow <%=p%>_action_open_widget"><%=hj.widget._("reply")%></button>                    </div>                    <div class="<%=p%>_widget_state <%=p%>_widget_state_open">                        <% for (var q = 0; q < poll.questions.length; q++) { %>                            <div id="<%=p%>_question_content_<%=q%>" _hj_question_type="<%=poll.questions[q].type%>"                                 class="<%=p%>_question_content <% if (q !== 0) { %><%=p%>_hidden<% } %>">                                <% if (poll.questions[q].type === "single-close-ended") { %>                                    <div class="<%=p%>_widget_content<% if (poll.questions[q].answers.length >= 5) { %>                                        <%=p%>_widget_content_overflow                                    <% } %>">                                        <% for (var i = 0; i < poll.questions[q].answers.length; i++) { %>                                        <div class="<%=p%>_button_radio_checkbox <%=p%>_button_radio_checkbox_full                                             <%=p%>_button_radio<%if (poll.questions[q].answers[i].comments) { %>                                                <%=p%>_with_comment                                            <% } %><%if (i+1 === poll.questions[q].answers.length) { %>                                                <%=p%>_button_radio_checkbox_last                                            <% } %>" data-key="response"                                             data-index="<%= poll.questions[q].answers[i].index %>"                                             data-value="<%= hj.rendering.escapeHtml(poll.questions[q].answers[i].text)                                        %>">                                            <% if (poll.questions[q].answers.length > 1) { %>                                                <span class="<%=p%>_widget_icon"></span>                                                <span class="<%=p%>_radio_checkbox_text">                                                    <%= poll.questions[q].answers[i].text %>                                                </span>                                                <div class="<%=p%>_comment_box">                                                    <textarea maxlength="255"                                                         class="<%=p%>_input_field <%=p%>_rounded_corners"                                                         name="<%=p%>_question_<%=q%>_answer_<%=i%>_comment"                                                         rows="3"                                                         placeholder="<%=hj.widget._("please_type_here")%>">                                                    </textarea>                                                </div>                                            <% } %>                                        </div>                                        <% } %>                                    </div>                                <% } else if (poll.questions[q].type === "multiple-close-ended") { %>                                    <div class="<%=p%>_widget_content<% if (poll.questions[q].answers.length >= 5) { %>                                        <%=p%>_widget_content_overflow<% } %>"                                    >                                        <% for (var i = 0; i < poll.questions[q].answers.length; i++) { %>                                        <div class="<%=p%>_button_radio_checkbox <%=p%>_button_radio_checkbox_full                                             <%=p%>_button_checkbox<%if (poll.questions[q].answers[i].comments) { %>                                                 <%=p%>_with_comment                                            <% } %><%if (i+1 === poll.questions[q].answers.length) { %>                                                 <%=p%>_button_radio_checkbox_last<% } %>"                                             data-key="response" data-index="<%= poll.questions[q].answers[i].index %>"                                            data-value="<%=hj.rendering.escapeHtml(poll.questions[q].answers[i].text)%>                                        ">                                            <% if (poll.questions[q].answers.length > 1) { %>                                                <span class="<%=p%>_widget_icon"></span>                                                <span class="<%=p%>_radio_checkbox_text">                                                    <%= poll.questions[q].answers[i].text %>                                                </span>                                                <div class="<%=p%>_comment_box">                                                    <textarea maxlength="255"                                                         class="<%=p%>_input_field <%=p%>_rounded_corners"                                                         name="<%=p%>_question_<%=q%>_answer_<%=i%>_comment"                                                         rows="3"                                                         placeholder="<%=hj.widget._("please_type_here")%>"></textarea>                                                </div>                                            <% } %>                                        </div>                                        <% } %>                                    </div>                                <% } else if (poll.questions[q].type === "single-open-ended-single-line") { %>                                    <div class="<%=p%>_widget_content">                                        <input maxlength="255" class="<%=p%>_input_field <%=p%>_rounded_corners"                                             type="text"                                             name="<%=p%>_question_<%=q%>_answer"                                             placeholder="<%=hj.widget._("please_type_here")%>" />                                    </div>                                <% } else if (poll.questions[q].type === "single-open-ended-multiple-line") { %>                                    <div class="<%=p%>_widget_content">                                        <textarea maxlength="255" class="<%=p%>_input_field <%=p%>_rounded_corners"                                             name="<%=p%>_question_<%=q%>_answer"                                             rows="3"                                             placeholder="<%=hj.widget._("please_type_here")%>"></textarea>                                    </div>                                <% } else if (poll.questions[q].type === "net-promoter-score") { %>                                    <div class="<%=p%>_widget_content <%=p%>_net_promoter_score">                                        <ul>                                            <% for (var i = 0; i < 11; i++) { %>                                            <li class="<%=p%>_button_score <%if (i === 10) { %>                                                <%=p%>_button_score_last<% } %>"                                             data-key="response" data-value="<%=i%>"><%=i%></li>                                            <% } %>                                        </ul>                                        <div class="<%=p%>_net_promoter_score_labels">                                            <div class="<%=p%>_pull_left"                                            ><%= poll.questions[q].labels[0].text %></div>                                            <div class="<%=p%>_pull_right"                                            ><%= poll.questions[q].labels[1].text %></div>                                            <div class="<%=p%>_clear_both"></div>                                        </div>                                    </div>                                <% } %>                            </div>                        <% } %>                        <div class="<%=p%>_widget_footer">                            <% if (poll.effectiveShowBranding) { %>                                <div class="<%=p%>_pull_left">                                    <span class="<%=p%>_widget_icon"></span>                                    Not using <a href="<%=cta%>" target="_blank">Hotjar</a> yet?                                </div>                            <% } %>                            <div class="<%=p%>_pull_right">                                <button type="button" id="<%=p%>_action_submit"                                     class="<%=p%>_btn_primary <%=p%>_btn_disabled <%=p%>_rounded_corners                                         <%=p%>_transition <%=p%>_shadow"><%=hj.widget._("send")%>                                     <span class="<%=p%>_widget_icon"></span>                                </button>                            </div>                            <div class="<%=p%>_clear_both"></div>                        </div>                    </div>                    <div class="<%=p%>_widget_state <%=p%>_widget_state_thankyou">                        <p class="<%=p%>_thankyou_message">                            <%= poll.thankyou %><br />                            <button type="button" class="<%=p%>_btn_primary <%=p%>_rounded_corners <%=p%>_transition                                 <%=p%>_shadow <%=p%>_action_dismiss_widget"><%=hj.widget._("close")%></button>                        </p>                        <div class="<%=p%>_widget_footer">                            <% if (poll.effectiveShowBranding) { %>                                <div class="<%=p%>_pull_left">                                    <span class="<%=p%>_widget_icon"></span>                                    Not using <a href="<%=cta%>" target="_blank">Hotjar</a> yet?                                </div>                            <% } %>                            <div class="<%=p%>_pull_right">                                <button type="button" class="<%=p%>_btn <%=p%>_btn_disabled <%=p%>_rounded_corners                                     <%=p%>_transition <%=p%>_shadow"><%=hj.widget._("sent")%>                                     <span class="<%=p%>_widget_icon"></span>                                </button>                            </div>                            <div class="<%=p%>_clear_both"></div>                        </div>                    </div>                </div></div>'
            ].join("");
        h.run = hj.tryCatch(function(b) {
            b ? (hj.tryCatch(g, "polls")(b), hj.tryCatch(
                        d, "polls")(b), hj.widget.pollData =
                    b, hj.tryCatch(a, "polls")()) : hj.hq
                .each(hj.settings.polls || [], function(
                    b, c) {
                    hj.targeting.onMatch(c.targeting,
                        function() {
                            hj.log.debug(
                                "Poll #" +
                                c.id +
                                " has matched.",
                                "poll");
                            hj.cookie.find(
                                    "_hjDonePolls",
                                    c.id) ? hj.log
                                .debug(
                                    "Poll was already submitted.",
                                    "poll") :
                                hj.widget.pollData ?
                                hj.log.debug(
                                    "Another poll is already present.",
                                    "poll") :
                                hj.widget.addMatchingWidget(
                                    c.created_epoch_time,
                                    function() {
                                        hj.tryCatch(
                                            g,
                                            "polls"
                                        )(c);
                                        hj.tryCatch(
                                            d,
                                            "polls"
                                        )(c);
                                        hj.widget
                                            .pollData =
                                            c;
                                        hj.tryCatch(
                                            hj
                                            .rendering
                                            .callAccordingToCondition,
                                            "polls"
                                        )(
                                            hj
                                            .widget
                                            .pollData,
                                            "poll",
                                            a
                                        )
                                    })
                        })
                })
        }, "polls");
        hj.isPreview && (window._hjPollReload = hj.tryCatch(
            function(a) {
                h.run(a)
            }, "polls"));
        return h
    }(), !0)
}, "polls")();
hj.tryCatch(function() {
    hj.loader.registerModule("Surveys", function() {
        function m() {
            hj.log.debug("-- RENDERING SURVEY INVITE --",
                "survey");
            var h = hj.rendering.renderTemplate(d, {
                hjHost: new hj.rendering.TrustedString(
                    hj.host),
                survey: {
                    id: hj.survey.data.id,
                    effectiveShowBranding: hj.survey
                        .data.effective_show_branding,
                    title: hj.survey.data.invite.title,
                    description: hj.survey.data.invite
                        .description,
                    button: hj.survey.data.invite.button,
                    close: hj.survey.data.invite.close,
                    url: new hj.rendering.TrustedString(
                        hj.survey.data.public_url
                    )
                },
                p: hj.widget.widgetAttributePrefix,
                cta: new hj.rendering.TrustedString(
                    hj.widget.ctaLinks.surveys)
            });
            hj.survey.ctrl = hj.rendering.addToDom(
                "_hj_survey_invite_container", h);
            setTimeout(hj.tryCatch(function() {
                hj.survey.ctrl.addClass(
                    "_hj-f5b2a1eb-9b07_survey_show"
                )
            }, "surveys"), 0);
            hj.survey.ctrl.find(
                "._hj-f5b2a1eb-9b07_survey_close, ._hj-f5b2a1eb-9b07_survey_button, ._hj-f5b2a1eb-9b07_survey_close_link a, #_hj-f5b2a1eb-9b07_survey_invite_overlay"
            ).on("click", a);
            hj.hq(window).on("resize", function() {
                hj.tryCatch(b(), "surveys")
            });
            hj.tryCatch(b(), "surveys")
        }

        function a() {
            hj.log.debug("-- CLOSING SURVEY INVITE --",
                "survey");
            hj.survey.ctrl.hide();
            hj.cookie.add("_hjClosedSurveyInvites", hj.survey
                .data.id)
        }

        function b() {
            580 > hj.hq(window).width() ? hj.survey.ctrl.addClass(
                    "_hj-f5b2a1eb-9b07_survey_full") : hj.survey
                .ctrl.removeClass(
                    "_hj-f5b2a1eb-9b07_survey_full")
        }
        var g = {},
            d =
            '<style type="text/css">                    /*reset and generic css*/                    div#_hj_survey_invite_container,                    div#_hj_survey_invite_container * {                        line-height: normal;                        font-family: Arial, sans-serif, Tahoma !important;                        text-transform: initial !important;                        height: auto;                    }                    div#<%=p%>_survey .<%=p%>_transition {                        -webkit-transition: all 0.3s ease-in-out;                        -moz-transition: all 0.3s ease-in-out;                        -o-transition: all 0.3s ease-in-out;                        -ms-transition: all 0.3s ease-in-out;                        transition: all 0.3s ease-in-out;                    }                                        /*containers css*/                    div#_hj_survey_invite_container,                     div#_hj_survey_invite_container div,                     #_hj_survey_invite_container span,                     #_hj_survey_invite_container p,                     #_hj_survey_invite_container a,                     #_hj_survey_invite_container img,                     #_hj_survey_invite_container strong,                     #_hj_survey_invite_container form,                     #_hj_survey_invite_container label {                        border: 0;                        outline: 0;                        font-size: 100%;                        vertical-align: baseline;                        background: transparent;                        margin: 0;                        padding: 0;                    }                    div#<%=p%>_survey #<%=p%>_survey_invite_overlay {                        background: black;                        position: fixed;                        top: 0;                        bottom: 0;                        left: 0;                        right: 0;                        opacity: 0;                        z-index: 2147483645;                        filter: alpha(opacity=0);                        -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";                    }                    div#<%=p%>_survey #<%=p%>_survey_invite_container {                        background: white;                        width: 550px;                        position: fixed;                        z-index: 2147483646;                        top: 50%;                        left: 50%;                        margin-top: -210px;                        margin-left: -275px;                        border-radius: 6px;                        -moz-border-radius: 6px;                        -webkit-border-radius: 6px;                        -webkit-box-shadow: 0 5px 13px 0 rgba(0, 0, 0, 0.65) !important;                        -moz-box-shadow: 0 5px 13px 0 rgba(0, 0, 0, 0.65) !important;                        box-shadow: 0 5px 13px 0 rgba(0, 0, 0, 0.65) !important;                        opacity: 0;                        filter: alpha(opacity=0);                        -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";                    }                    /*SHOW classes*/                    div#<%=p%>_survey.<%=p%>_survey_show #<%=p%>_survey_invite_overlay {                        opacity: .8;                        filter: alpha(opacity=80);                        -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";                    }                    div#<%=p%>_survey.<%=p%>_survey_show #<%=p%>_survey_invite_container {                        opacity: 1;                        filter: alpha(opacity=100);                        -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";                        margin-top: -200px;                    }                                        /*content and elements*/                    div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_close {                        background-image:                             url(//<%= hjHost %>/static/client/modules/assets/widget_icons_light.png) !important;                        background-repeat: no-repeat;                        background-position: -120px 0;                        cursor: pointer;                        opacity: .60;                        filter: alpha(opacity=60);                        -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=60)";                        position: absolute;                        right: 10px;                        top: 10px;                        width: 16px;                        height: 16px;                    }                    div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_close:hover {                        opacity: 1;                        filter: alpha(opacity=100);                        -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";                    }                    div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_content {                        padding: 50px 20px;                        text-align: center;                    }                    div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_title {                        padding: 0 20px 20px 20px;                        font-size: 24px;                        color: #333333;                        white-space: pre-wrap;                        word-wrap: break-word;                        overflow-wrap: break-word;                    }                    div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_description {                        padding: 0 30px 40px 30px;                        font-weight: normal;                        font-size: 16px;                        line-height: 25px;                        color: #666666;                        white-space: pre-wrap;                        word-wrap: break-word;                        overflow-wrap: break-word;                    }                    div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_button {                        border-radius: 5px;                         -moz-border-radius: 5px;                        -webkit-border-radius: 5px;                        -webkit-box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.25);                        -moz-box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.25);                        box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.25);                        cursor: pointer;                        text-decoration: none !important;                        font-size: 18px !important;                        font-weight: bold !important;                        padding: 16px 26px !important;                        border: 0 !important;                        outline: 0 !important;                        height: initial !important;                        min-height: initial !important;                        display: -moz-inline-stack;                        display: inline-block;                        zoom: 1;                        *display: inline;                        vertical-align: top;                        width: auto;                        background: #00C764 !important;                        color: white !important;                        font-family: Tahoma, Arial !important;                        white-space: pre-wrap;                        word-wrap: break-word;                        overflow-wrap: break-word;                    }                     div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_button:hover,                     div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_button:focus,                     div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_button:active {                        background: #00a251 !important;                    }                     div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_close_link {                        text-align: center;                        padding: 20px 0 0 0;                    }                     div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_close_link > a {                        cursor: pointer;                        text-decoration: underline;                        color: #666666;                        font-size: 13px;                    }                                        div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_close_link > a:hover {                        color: #333333;                    }                    div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_powered_by {                        color: #666666;                        position: absolute;                        left: 0;                        bottom: 0;                        margin-bottom: 10px;                        margin-left: 10px;                        font-size: 11px;                    }                    div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_powered_by > span {                        background-image:                             url(//<%= hjHost %>/static/client/modules/assets/widget_icons_light.png) !important;                        background-repeat: no-repeat;                        background-position: -16px 0;                        margin-right: 4px;                        width: 16px;                        height: 16px;                        display: -moz-inline-stack;                        display: inline-block;                        zoom: 1;                        *display: inline;                        vertical-align: middle;                    }                    div#<%=p%>_survey #<%=p%>_survey_invite_container .<%=p%>_survey_powered_by > a {                        color: #666666;                        text-decoration: underline;                    }                                        /*mobile classes*/                    div#<%=p%>_survey.<%=p%>_survey_full * {                        -webkit-transition: none !important;                        -moz-transition: none !important;                        -o-transition: none !important;                        -ms-transition: none !important;                        transition: none !important;                    }                    div#<%=p%>_survey.<%=p%>_survey_full #<%=p%>_survey_invite_container {                        width: auto;                        margin: 0;                        top: 15px;                        left: 15px;                        right: 15px;                    }                    div#<%=p%>_survey.<%=p%>_survey_full #<%=p%>_survey_invite_container .<%=p%>_survey_content {                       padding: 40px 20px 70px 20px;                    }                    div#<%=p%>_survey.<%=p%>_survey_full #<%=p%>_survey_invite_container .<%=p%>_survey_title {                        padding: 0 10px 20px 10px;                        font-size: 20px;                    }                    div#<%=p%>_survey.<%=p%>_survey_full #<%=p%>_survey_invite_container .<%=p%>_survey_description {                        padding: 0 10px 30px 10px;                        font-size: 14px;                    }                    div#<%=p%>_survey.<%=p%>_survey_full #<%=p%>_survey_invite_container .<%=p%>_survey_button {                        font-size: 17px !important;                        font-weight: normal !important;                        padding: 12px 15px !important;                    }                    div#<%=p%>_survey.<%=p%>_survey_full #<%=p%>_survey_invite_container .<%=p%>_survey_powered_by{                        left: 50%;                        margin: 0 0 10px -55px;                    }                </style>                <div id="_hj_survey_invite_container">                    <div id="<%=p%>_survey">                        <div id="<%=p%>_survey_invite_overlay" class="<%=p%>_transition"></div>                        <div id="<%=p%>_survey_invite_container" class="<%=p%>_transition">                            <a class="<%=p%>_survey_close <%=p%>_transition"></a>                            <div class="<%=p%>_survey_content">                                <div class="<%=p%>_survey_title"><%= survey.title %></div>                                <div class="<%=p%>_survey_description"><%= survey.description %></div>                                <a class="<%=p%>_survey_button <%=p%>_transition" href="<%= survey.url %>"                                     target="_blank"><%= survey.button %></a>                                <div class="<%=p%>_survey_close_link">                                    <a class="<%=p%>_transition"><%= survey.close %></a>                                </div>                            </div>                            <% if (survey.effectiveShowBranding) { %>                                <div class="<%=p%>_survey_powered_by">                                    <span class="<%=p%>_widget_icon"></span>                                    Not using <a href="<%=cta%>" target="_blank">Hotjar</a> yet?                                </div>                            <% } %>                        </div>                    </div>                </div>';
        g.run = hj.tryCatch(function(a) {
            a ? (hj.survey.data = a, m()) : hj.hq.each(
                hj.settings.surveys || [], function(
                    a, b) {
                    hj.targeting.onMatch(b.targeting,
                        hj.tryCatch(function() {
                            hj.log.debug(
                                "Survey #" +
                                b.id +
                                " has matched.",
                                "survey"
                            );
                            hj.survey.data ?
                                hj.log.debug(
                                    "Another survey is already present.",
                                    "survey"
                                ) : hj.cookie
                                .find(
                                    "_hjClosedSurveyInvites",
                                    b.id) ?
                                hj.log.debug(
                                    "Survey was already viewed.",
                                    "survey"
                                ) : hj.widget
                                .addMatchingWidget(
                                    b.created_epoch_time,
                                    function() {
                                        hj.survey
                                            .data =
                                            b;
                                        hj.rendering
                                            .callAccordingToCondition(
                                                hj
                                                .survey
                                                .data,
                                                "survey",
                                                m
                                            )
                                    })
                        }, "surveys"))
                })
        }, "surveys");
        return g
    }(), !0)
}, "surveys")();
hj.tryCatch(function() {
    hj.loader.registerModule("Testers", function() {
        function m() {
            function a() {
                var b = !0;
                hj.hq.each(hj.widget.testersData.content
                    .fields, function(a, d) {
                        Boolean(hj.widget.model[d]) ||
                            (b = !1)
                    });
                return b
            }
            hj.widget.submitResponse = hj.tryCatch(function() {
                a() && (hj.isPreview || (hj.request
                    .saveTesterResponse({
                        action: "testers_widget_response",
                        response: hj.widget
                            .model
                    }), hj.widget.setDone()
                ), hj.widget.changeState(!1,
                    "thankyou"))
            }, "testers");
            hj.widget.setDone = hj.tryCatch(function() {
                hj.isPreview || hj.cookie.add(
                    "_hjDoneTestersWidgets", hj
                    .widget.testersData.id)
            }, "testers");
            hj.widget.setMinimized = hj.tryCatch(function() {
                hj.isPreview || hj.cookie.add(
                    "_hjMinimizedTestersWidgets",
                    hj.widget.testersData.id)
            }, "testers");
            hj.widget.ctrl.find(
                "._hj-f5b2a1eb-9b07_button_radio").on(
                "click", hj.tryCatch(function() {
                    var b = hj.hq(this),
                        c = b.attr("data-key"),
                        f = b.attr("data-value");
                    hj.widget.model[c] = f;
                    a() ? hj.widget.enableSubmit() :
                        hj.widget.disableSubmit();
                    hj.widget.ctrl.find(
                        "._hj-f5b2a1eb-9b07_button_radio_checkbox"
                    ).removeClass(
                        "_hj-f5b2a1eb-9b07_button_radio_checkbox_active"
                    );
                    b.addClass(
                        "_hj-f5b2a1eb-9b07_button_radio_checkbox_active"
                    )
                }, "testers"));
            hj.widget.ctrl.find("[data-bind]").on(
                "keyup change", hj.tryCatch(function() {
                    var b = hj.hq(this),
                        c = b.attr("name").split(
                            "_hj-f5b2a1eb-9b07_")[1];
                    hj.widget.model[c] = b.val();
                    a() ? hj.widget.enableSubmit() :
                        hj.widget.disableSubmit()
                }, "testers"));
            hj.widget.ctrl.find(
                "#_hj-f5b2a1eb-9b07_action_submit").on(
                "click", hj.tryCatch(function() {
                    hj.widget.submitResponse()
                }, "testers"));
            hj.hq(window).on("resize", hj.tryCatch(function() {
                hj.widget.applyMobileClasses()
            }, "testers"));
            hj.tryCatch(hj.widget.applyMobileClasses,
                "testers")();
            hj.tryCatch(hj.widget.collapseWidget, "testers")
                ();
            !hj.isPreview && hj.cookie.find(
                "_hjMinimizedTestersWidgets", hj.widget
                .testersData.id) && hj.tryCatch(hj.widget
                .changeState, "testers")(null, "hidden");
            hj.tryCatch(hj.widget.init, "testers")()
        }

        function a() {
            hj.log.debug("-- RENDERING TESTERS WIDGET --");
            hj.widget.setLanguage(hj.widget.testersData.language);
            var a = hj.widget.changeColorLuminance(hj.widget
                    .testersData.background, -0.1),
                b = hj.widget.changeColorLuminance(hj.widget
                    .testersData.background, 0.1),
                c = hj.widget.changeColorLuminance(hj.widget
                    .testersData.background, -0.2),
                f = hj.widget.changeColorLuminance(hj.widget
                    .testersData.background, 0.2),
                p = hj.widget.changeColorLuminance(hj.widget
                    .testersData.background, -0.6),
                l = hj.widget.changeColorLuminance(hj.widget
                    .testersData.background, 0.6),
                a = hj.rendering.renderTemplate(g, {
                    apiUrlBase: new hj.rendering.TrustedString(
                        hj.apiUrlBase),
                    hjStaticHost: new hj.rendering.TrustedString(
                        hj.staticHost),
                    hjid: hj.settings.site_id,
                    preview: hj.isPreview || !1,
                    testersWidget: {
                        id: hj.widget.testersData.id,
                        effectiveShowBranding: hj.widget
                            .testersData.effective_show_branding,
                        fields: {
                            name: -1 < hj.widget.testersData
                                .content.fields.indexOf(
                                    "name"),
                            age: -1 < hj.widget.testersData
                                .content.fields.indexOf(
                                    "age"),
                            city: -1 < hj.widget.testersData
                                .content.fields.indexOf(
                                    "city"),
                            email: -1 < hj.widget.testersData
                                .content.fields.indexOf(
                                    "email"),
                            phone: -1 < hj.widget.testersData
                                .content.fields.indexOf(
                                    "phone"),
                            sex: -1 < hj.widget.testersData
                                .content.fields.indexOf(
                                    "sex")
                        },
                        invitation: hj.widget.testersData
                            .content.invitation,
                        description: hj.widget.testersData
                            .content.description,
                        thankyou: hj.widget.testersData
                            .content.thankyou
                    },
                    widgetStyle: {
                        position: hj.widget.testersData
                            .position,
                        skin: hj.widget.testersData.skin,
                        primaryColor: hj.widget.testersData
                            .background,
                        secondaryColor: "light" === hj.widget
                            .testersData.skin ? a : b,
                        alternateColor: "light" === hj.widget
                            .testersData.skin ? c : f,
                        footerTextColor: "light" === hj
                            .widget.testersData.skin ?
                            p : l,
                        footerBorderColor: "light" ===
                            hj.widget.testersData.skin ?
                            c : a,
                        fontColor: "light" === hj.widget
                            .testersData.skin ? "#111" : "#FFF",
                        fontColorNegative: "light" ===
                            hj.widget.testersData.skin ?
                            "#FFF" : "#111"
                    },
                    p: hj.widget.widgetAttributePrefix,
                    cta: new hj.rendering.TrustedString(
                        hj.widget.ctaLinks.testers)
                });
            hj.widget.ctrl = hj.rendering.addToDom(
                "_hj_testers_container", a);
            m();
            "once" == hj.widget.testersData.persist_condition &&
                hj.cookie.add("_hjDoneTestersWidgets", hj.widget
                    .testersData.id)
        }
        var b = {},
            g = ['<div id="_hj_testers_container">', hj.widget.commonCSS,
                '<style type="text/css">                    .<%=p%>_widget .<%=p%>_widget_content .<%=p%>_widget_description {                        padding: 0;                        margin: 0 0 12px 0;                        text-align: center;                    }                    .<%=p%>_widget .<%=p%>_widget_content .<%=p%>_input_field {margin-bottom: 6px;}                     .<%=p%>_widget .<%=p%>_widget_content .<%=p%>_double_control {margin-bottom: 6px;}                     .<%=p%>_widget .<%=p%>_widget_content .<%=p%>_double_control .<%=p%>_input_field  {                        margin-bottom: 0;                    }                 </style><div id="<%=p%>_testers" class="<%=p%>_widget <%=p%>_<%= hj.widget.activeLanguageDirection %>                     <%=p%>_skin_<%= widgetStyle.skin %> <%=p%>_position_<%= widgetStyle.position %>">                    <a class="<%=p%>_widget_open_close <%=p%>_action_toggle_widget"                    ><span class="<%=p%>_widget_icon"></span></a>                    <div class="<%=p%>_widget_hidden_handle <%=p%>_action_toggle_widget"></div>                    <p class="<%=p%>_widget_title <%=p%>_action_open_widget"><%= testersWidget.invitation %></p>                    <div class="<%=p%>_widget_initiator">                        <button type="button" class="<%=p%>_btn_primary <%=p%>_rounded_corners <%=p%>_transition                             <%=p%>_shadow <%=p%>_action_open_widget">                            <%= hj.widget._("sign_me_up")%>                        </button>                    </div>                    <div class="<%=p%>_widget_state <%=p%>_widget_state_open">                        <div class="<%=p%>_widget_content <%=p%>_widget_content_overflow">                            <p class="<%=p%>_widget_description"><%= testersWidget.description %></p>                                                        <% if (testersWidget.fields.name) { %>                                <input type="text" name="<%=p%>_name" class="<%=p%>_input_field <%=p%>_rounded_corners"                                    placeholder="<%= hj.widget._("full_name")%>" data-bind />                            <% } %>                            <div <% if (testersWidget.fields.age && testersWidget.fields.city) { %>                                class="<%=p%>_double_control"                            <% } %>>                                 <% if (testersWidget.fields.age) { %>                                    <input type="text" name="<%=p%>_age"                                         class="<%=p%>_input_field <%=p%>_rounded_corners                                         <%=p%>_double_first" placeholder="<%= hj.widget._("age")%>" data-bind />                                <% } %>                                <% if (testersWidget.fields.city) { %>                                    <input type="text" name="<%=p%>_city"                                         class="<%=p%>_input_field <%=p%>_rounded_corners                                         <%=p%>_double_second" placeholder="<%= hj.widget._("city")%>" data-bind />                                <% } %>                                <div class="<%=p%>_clear_both"></div>                            </div>                            <% if (testersWidget.fields.email) { %>                                <input type="text" name="<%=p%>_email"                                     class="<%=p%>_input_field <%=p%>_rounded_corners"                                     placeholder="<%= hj.widget._("email")%>" data-bind />                            <% } %>                            <% if (testersWidget.fields.phone) { %>                                <input type="text" name="<%=p%>_phone"                                     class="<%=p%>_input_field <%=p%>_rounded_corners"                                     placeholder="<%= hj.widget._("phone_number")%>" data-bind />                            <% } %>                            <% if (testersWidget.fields.sex) { %>                                <div class="<%=p%>_double_control">                                     <div class="<%=p%>_button_radio <%=p%>_button_radio_checkbox <%=p%>_rounded_corners                                        <%=p%>_double_first" data-key="sex" data-value="male">                                            <span class="<%=p%>_widget_icon"></span>                                            <span class="<%=p%>_radio_checkbox_text"><%= hj.widget._("male")%></span>                                    </div>                                    <div class="<%=p%>_button_radio <%=p%>_button_radio_checkbox <%=p%>_rounded_corners                                        <%=p%>_double_second" data-key="sex" data-value="female">                                            <span class="<%=p%>_widget_icon"></span>                                            <span class="<%=p%>_radio_checkbox_text"><%= hj.widget._("female")%></span>                                    </div>                                    <div class="<%=p%>_clear_both"></div>                                </div>                            <% } %>                        </div>                        <div class="<%=p%>_widget_footer">                            <% if (testersWidget.effectiveShowBranding) { %>                                <div class="<%=p%>_pull_left">                                    <span class="<%=p%>_widget_icon"></span>                                    Not using <a href="<%=cta%>" target="_blank">Hotjar</a> yet?                                </div>                            <% } %>                            <div class="<%=p%>_pull_right">                                <button type="button" id="<%=p%>_action_submit"                                     class="<%=p%>_btn_primary <%=p%>_btn_disabled                                     <%=p%>_rounded_corners <%=p%>_transition <%=p%>_shadow"><%= hj.widget._("send")%>                                     <span class="<%=p%>_widget_icon"></span>                                </button>                            </div>                            <div class="<%=p%>_clear_both"></div>                        </div>                    </div>                    <div class="<%=p%>_widget_state <%=p%>_widget_state_thankyou">                        <p class="<%=p%>_thankyou_message">                            <%= testersWidget.thankyou %><br />                            <button type="button" class="<%=p%>_btn_primary <%=p%>_rounded_corners <%=p%>_transition                                 <%=p%>_shadow <%=p%>_action_dismiss_widget"><%= hj.widget._("close")%>                            </button>                        </p>                        <div class="<%=p%>_widget_footer">                            <% if (testersWidget.effectiveShowBranding) { %>                                <div class="<%=p%>_pull_left">                                    <span class="<%=p%>_widget_icon"></span>                                    Not using <a href="<%=cta%>" target="_blank">Hotjar</a> yet?                                </div>                            <% } %>                            <div class="<%=p%>_pull_right">                                <button type="button" class="<%=p%>_btn <%=p%>_btn_disabled <%=p%>_rounded_corners                                     <%=p%>_transition <%=p%>_shadow"><%= hj.widget._("sent")%>                                     <span class="<%=p%>_widget_icon"></span>                                </button>                            </div>                            <div class="<%=p%>_clear_both"></div>                        </div>                    </div>                </div></div>'
            ].join("");
        b.run = hj.tryCatch(function(b) {
            b ? (hj.widget.testersData = b, a()) : hj.hq
                .each(hj.settings.testers_widgets || [],
                    function(b, c) {
                        hj.targeting.onMatch(c.targeting,
                            function() {
                                hj.log.debug(
                                    "Tester #" +
                                    c.id +
                                    " has matched.",
                                    "tester");
                                hj.widget.testersData ?
                                    hj.log.debug(
                                        "Another tester is already present.",
                                        "tester") :
                                    hj.cookie.find(
                                        "_hjDoneTestersWidgets",
                                        c.id) ? hj.log
                                    .debug(
                                        "Tester was already submitted.",
                                        "tester") :
                                    hj.widget.addMatchingWidget(
                                        c.created_epoch_time,
                                        function() {
                                            hj.widget
                                                .testersData =
                                                c;
                                            hj.tryCatch(
                                                hj
                                                .rendering
                                                .callAccordingToCondition,
                                                "testers"
                                            )(
                                                hj
                                                .widget
                                                .testersData,
                                                "testersWidget",
                                                a
                                            )
                                        })
                            })
                    })
        }, "testers");
        hj.isPreview && (window._hjTestersWidgetReload =
            function(a) {
                b.run(a)
            });
        return b
    }(), !0)
}, "testers")();
hj.tryCatch(function() {
    hj.loader.registerModule("Forms", function() {
        var m = null,
            a = {},
            b = null,
            g = [],
            d = hj.tryCatch(function(a, b, c, d) {
                var f, g, k;
                hj.hq.each(m.field_info, function(l, m) {
                    g = -1 !== b.indexOf("*") || -1 !==
                        b.indexOf(m.field_type);
                    k = -1 !== c.indexOf(m.field_type);
                    g && !k && (f = h(m), f.on(a,
                        function() {
                            d(this, m)
                        }))
                })
            }, "forms"),
            h = hj.tryCatch(function(a) {
                var b, c;
                if ("id" === m.selector_type) b = hj.hq(
                    "form[id='" + m.selector + "']");
                else if ("css" === m.selector_type) c =
                    parseInt(m.selector.split(":", 1)), b =
                    m.selector.slice(c.toString().length +
                        1), b = hj.hq(hj.hq(b)[c]);
                else throw Error("Invalid selector_type: " +
                    m.selector_type);
                return b.find("*[" + a.match_attribute +
                    "='" + a.match_value.replace(/'/g,
                        "\\'") + "']")
            }, "forms"),
            c = hj.tryCatch(function() {
                var a = sessionStorage.getItem("_hjForm"),
                    b = a ? hj.json.parse(a).id : 0;
                hj.hq.each(hj.settings.forms || [],
                    function(a, b) {
                        if (hj.targeting.ruleMatches(b.targeting))
                            return m = b, hj.log.debug(
                                "Setting active form to form[id=" +
                                m.id + "]", "forms"
                            ), !1
                    });
                !m && b && hj.hq.each(hj.settings.forms || [],
                    function(a, c) {
                        if (c.id == b) return m = c, hj
                            .log.debug(
                                "Setting active form to form[id=" +
                                m.id + "]", "forms"
                            ), !1
                    })
            }, "forms"),
            f = hj.tryCatch(function(a, b) {
                var c, d;
                if ("id" === b) return 0 < hj.hq(
                    "form[id='" + a + "']").length;
                if ("css" === b) return d = a.split(":", 1),
                    c = a.slice(d.length + 1), hj.hq(c)
                    .length > parseInt(d);
                throw Error("Invalid selector_type: " + m.selector_type);
            }, "forms"),
            p = hj.tryCatch(function(a) {
                hj.log.debug(
                    "Saving forms using manual tracking: " +
                    hj.json.stringify(a), "forms");
                sessionStorage.setItem(
                    "_hjFormsManualTracking", hj.json.stringify(
                        a))
            }, "forms"),
            l = hj.tryCatch(function() {
                var a = hj.json.parse(sessionStorage.getItem(
                    "_hjFormsManualTracking")) || [];
                a.length && hj.log.debug(
                    "Getting forms using manual tracking: " +
                    hj.json.stringify(a), "forms");
                return a
            }, "forms"),
            n = hj.tryCatch(function(a) {
                hj.hq.inArray(a.id, g) || (g.push(a.id), hj
                    .log.debug(
                        "Form using manual tracking added: form[id=" +
                        a.id + "]", "forms"), p(g))
            }, "forms"),
            k = hj.tryCatch(function() {
                hj.log.debug("Saving active form: form[id=" +
                    m.id + "]", "forms");
                sessionStorage.setItem("_hjForm", hj.json.stringify(
                    m))
            }, "forms"),
            q = hj.tryCatch(function() {
                return Boolean(sessionStorage.getItem(
                    "_hjForm"))
            }, "forms"),
            t = hj.tryCatch(function() {
                var a = sessionStorage.getItem("_hjForm"),
                    b;
                sessionStorage.removeItem("_hjForm");
                a = hj.json.parse(a);
                b = !f(a.selector, a.selector_type) && hj.targeting
                    .ruleMatches(a.targeting, document.referrer);
                r(a, b, !0)
            }, "forms"),
            r = hj.tryCatch(function(a, b, c) {
                c || n(m);
                if (!c || !hj.hq.inArray(a.id, g)) hj.dataQueue
                    .pushImmediately({
                        form_id: a.id,
                        form_event: b ?
                            "form_submit_successful" : "form_submit_failed"
                    })
            }, "forms"),
            v = hj.tryCatch(function() {
                b = new Date
            }, "forms"),
            u = hj.tryCatch(function(a, c) {
                b && (hj.dataQueue.pushImmediately({
                    form_id: m.id,
                    form_field_event: {
                        form_field_id: c.id,
                        interaction_time: new Date -
                            b,
                        content_hash: hj.md5(hj
                            .hq(a).val())
                    }
                }), b = null)
            }, "forms"),
            s = hj.tryCatch(function(a, b) {
                hj.dataQueue.pushImmediately({
                    form_id: m.id,
                    form_field_event: {
                        form_field_id: b.id,
                        interaction_time: null,
                        content_hash: hj.md5(hj.hq(
                            a).val())
                    }
                })
            }, "forms"),
            w = hj.tryCatch(function(a, b) {
                var c = h(b),
                    d = [],
                    f;
                for (f = 0; f < c.length; f += 1) d.push(hj
                    .md5(c[f].checked ? c[f].value : "")
                );
                hj.dataQueue.pushImmediately({
                    form_id: m.id,
                    form_field_event: {
                        form_field_id: b.id,
                        interaction_time: null,
                        content_hash: d.join(",")
                    }
                })
            }, "forms"),
            x = hj.tryCatch(function(a, b) {
                var c = a.toString().split("."),
                    d = b.toString().split("."),
                    f = Math.max(c.length, d.length),
                    g, h, k;
                for (k = 0; k < f && !(g = parseInt(c[k] ||
                        0), h = parseInt(d[k] || 0), g >
                    h); k += 1)
                    if (g < h) return !1;
                return !0
            }, "forms"),
            y = hj.tryCatch(function() {
                var a = "undefined" !== typeof window.jQuery,
                    b, c;
                c = !1;
                if ("id" === m.selector_type) a ? (b =
                        window.jQuery("form[id='" + m.selector +
                            "']:eq(0)"), c = 0 < b.length) :
                    (b = document.getElementById(m.selector),
                        c = Boolean(b));
                else if ("css" === m.selector_type) b =
                    parseInt(m.selector.split(":", 1)), c =
                    m.selector.slice(b.toString().length +
                        1), a ? (b = window.jQuery(c +
                        ":eq(" + b + ")"), c = 0 < b.length) :
                    (b = hj.hq(c)[b], c = Boolean(b));
                else throw Error("Invalid selector_type: " +
                    m.selector_type); if (c)
                    if (a)
                        if (function(a) {
                            function b(c, d, f) {
                                var h = d.split(
                                    /\s+/);
                                c.each(function() {
                                    for (
                                        var
                                            b =
                                            0; h
                                        .length >
                                        b; ++
                                        b) {
                                        var
                                            c =
                                            a
                                            .trim(
                                                h[
                                                    b
                                                ]
                                            )
                                            .match(
                                                /[^\.]+/i
                                            )[
                                                0
                                            ];
                                        var
                                            d =
                                            a(
                                                this
                                            ),
                                            k =
                                            c,
                                            c =
                                            f,
                                            d =
                                            g ?
                                            d
                                            .data(
                                                "events"
                                            ) :
                                            a
                                            ._data(
                                                d[
                                                    0
                                                ]
                                            )
                                            .events,
                                            k =
                                            d[
                                                k
                                            ];
                                        g ?
                                            c ?
                                            d
                                            .live
                                            .unshift(
                                                d
                                                .live
                                                .pop()
                                            ) :
                                            k
                                            .unshift(
                                                k
                                                .pop()
                                            ) :
                                            (
                                                d =
                                                c ?
                                                k
                                                .splice(
                                                    k
                                                    .delegateCount -
                                                    1,
                                                    1
                                                )[
                                                    0
                                                ] :
                                                k
                                                .pop(),
                                                k
                                                .splice(
                                                    c ?
                                                    0 :
                                                    k
                                                    .delegateCount ||
                                                    0,
                                                    0,
                                                    d
                                                )
                                            )
                                    }
                                })
                            }

                            function c(d) {
                                a.fn[d + "First"] =
                                    function() {
                                        var c = a.makeArray(
                                            arguments
                                        ).shift();
                                        return c &&
                                            (a.fn[d]
                                                .apply(
                                                    this,
                                                    arguments
                                                ),
                                                b(
                                                    this,
                                                    c
                                                )),
                                            this
                                    }
                            }
                            var d = a.fn.jquery.split(
                                    "."),
                                f = parseInt(d[0]),
                                d = parseInt(d[1]),
                                g = 1 > f || 1 == f &&
                                7 > d;
                            c("bind");
                            c("one");
                            a.fn.delegateFirst =
                                function() {
                                    var c = a.makeArray(
                                            arguments),
                                        d = c[1];
                                    return d && (c.splice(
                                                0, 2),
                                            a.fn.delegate
                                            .apply(this,
                                                arguments
                                            ), b(this,
                                                d, !0)),
                                        this
                                };
                            a.fn.liveFirst = function() {
                                var b = a.makeArray(
                                    arguments);
                                return b.unshift(
                                        this.selector
                                    ), a.fn.delegateFirst
                                    .apply(a(
                                        document
                                    ), b), this
                            };
                            g || (a.fn.onFirst =
                                function(c, d) {
                                    var f = a(this),
                                        g =
                                        "string" ==
                                        typeof d;
                                    if (a.fn.on.apply(
                                            f,
                                            arguments
                                        ), "object" ==
                                        typeof c)
                                        for (type in
                                            c) c.hasOwnProperty(
                                            type
                                        ) && b(
                                            f,
                                            type,
                                            g);
                                    else "string" ==
                                        typeof c &&
                                        b(f, c, g);
                                    return f
                                })
                        }(jQuery), x(window.jQuery.fn.jquery,
                            "1.7")) b.onFirst("submit", k);
                        else x(window.jQuery.fn.jquery,
                            "1.3") && b.liveFirst(
                            "submit", k);
                else hj.hq(b).on("submit", k);
                else hj.log.debug(
                    'Could not find form with selector "' +
                    m.selector + '".', "forms")
            }, "forms");
        hj.forms = hj.tryCatch(function() {
            return {
                cmdFormSubmitSuccessful: function() {
                    null !== m && r(m, !0, !1)
                },
                cmdFormSubmitFailed: function() {
                    null !== m && r(m, !1, !1)
                }
            }
        }, "forms")();
        a.run = hj.tryCatch(function() {
            var a = q();
            if (hj.includedInSample && (c(), m || a)) g =
                l(), hj.dataQueue.create(), hj.property
                .ready("userId", function() {
                    hj.dataQueue.startSendingData({
                        form_id: m.id,
                        form_event: "form_helo"
                    })
                }),
                a ? t() : m && (d("focus", ["*"], [
                        "checkbox", "radio"
                    ], v), d("blur", ["*"], ["checkbox",
                        "radio"
                    ], u), d("change", ["checkbox"], [],
                        w), d("focus", ["radio"], [], s),
                    y())
        }, "forms");
        return a
    }())
}, "forms")();
hj.tryCatch(function() {
    "undefined" === typeof hj.scriptLoaded && (hj._init = {
        _determineIncludedInSample: function() {
            var m = new hj.fingerprinter,
                a = hj.url.getParameter("hjIncludeInSample"),
                b = hj.cookie.get("_hjIncludedInSample");
            if (b) hj.includedInSample = "1" === b, hj.log.debug(
                "User is included in sample", "init");
            else switch (a) {
                case "0":
                    hj.includedInSample = !1;
                    hj.log.debug(
                        "You have set includedInSample to false.",
                        "init");
                    break;
                case "1":
                    hj.includedInSample = !0;
                    hj.cookie.set("_hjIncludedInSample",
                        hj.includedInSample ? "1" :
                        "0", !0);
                    hj.log.debug(
                        "You have set includedInSample to true.",
                        "init");
                    break;
                default:
                    hj.includedInSample = m.compareRatio(
                            hj.settings.r || 1), hj.includedInSample &&
                        hj.cookie.set(
                            "_hjIncludedInSample", "1", !
                            0), hj.log.debug(
                            "Included in sample: " + hj
                            .includedInSample, "init", {
                                r: hj.settings.r,
                                fingerprintValue: m.getAsNumber()
                            })
            }
        },
        _verifyInstallation: function() {
            var m = hj.url.getParameter("hjVerifyInstall"),
                a;
            try {
                a = sessionStorage.getItem(
                    "hjVerifyInstall")
            } catch (b) {}
            if (m || a) {
                hj.verifyInstall = parseInt(m || a);
                try {
                    sessionStorage.setItem(
                        "hjVerifyInstall", m || a)
                } catch (g) {}
                hj.includedInSample || hj.pageVisit.track();
                hj.verifyInstall === hjSiteSettings.site_id ?
                    (hj.notification.show(
                        "Hotjar installation verified.",
                        "The Hotjar tracking code has been properly installed on this page. Browse your site in this window if you wish to verify installation on any other pages.",
                        "good"), hj.xcom.send(
                        "scriptActive", [])) : hj.notification
                    .show("Hotjar installation invalid.",
                        "The tracking code you are trying to verify does not match the one installed on this page. Please make sure you install the correct tracking code provided for this site.",
                        "bad")
            }
        },
        run: hj.tryCatch(function() {
            hj.scriptLoaded = !0;
            hj.windowSize = hj.ui.getWindowSize();
            if (9 > hj.utils.ieVersion()) hj.log.debug(
                    "IE < 9 is not supported.", "init"),
                "1" === hj.url.getParameter(
                    "hjVerifyInstallation") && hj.notification
                .show(
                    "Hotjar installation cannot be verified.",
                    "Sorry \u2013 your browser is not supported.",
                    "bad");
            else {
                if ("1" === navigator.doNotTrack || "1" ===
                    window.doNotTrack || "1" ===
                    navigator.msDoNotTrack) hj.log.debug(
                    "Do Not Track header detected.",
                    "init"), hj.doNotTrack = !0;
                if (navigator.cookieEnabled || "cookie" in
                    document && (0 < document.cookie.length ||
                        -1 < (document.cookie = "test")
                        .indexOf.call(document.cookie,
                            "test"))) {
                    try {
                        localStorage.setItem("test", 1),
                            localStorage.removeItem(
                                "test")
                    } catch (m) {
                        hj.log.debug(
                            "localStorage is not available",
                            "init");
                        hj._init._verifyInstallation();
                        return
                    }
                    try {
                        sessionStorage.setItem("test",
                            1), sessionStorage.removeItem(
                            "test")
                    } catch (a) {
                        hj.log.debug(
                            "sessionStorage is not available",
                            "init");
                        hj._init._verifyInstallation();
                        return
                    }
                    hj.loader.loadSettings(function(a) {
                        var g = hj.url.getParameter(
                            "hjDebug");
                        hj.settings = a || {};
                        if ("" !== g)
                            if (!0 == g) hj.debug
                                .on(!0);
                            else hj.debug.off();
                        if ("true" == hj.cookie
                            .get("hjDebug")) hj
                            .debug.on(!1);
                        hj.log.debug(
                            "Site settings",
                            "init", hj.settings
                        ); - 1 === navigator.userAgent
                            .indexOf("Hotjar") &&
                            (hj._init._determineIncludedInSample(),
                                hj.pageVisit.setup(),
                                a = [], 10 > hj
                                .utils.ieVersion() &&
                                hj.placeholderPolyfill &&
                                a.push(
                                    "//cdn.jsdelivr.net/placeholders/3.0.2/placeholders.min.js"
                                ), hj.loader.loadScripts(
                                    a, hj.tryCatch(
                                        function() {
                                            hj.hq
                                                .each(
                                                    hj
                                                    .loader
                                                    .getModules(),
                                                    function(
                                                        a,
                                                        b
                                                    ) {
                                                        if (!
                                                            hj
                                                            .doNotTrack ||
                                                            b
                                                            .nonTracking
                                                        )
                                                            hj
                                                            .log
                                                            .debug(
                                                                "Running module " +
                                                                b
                                                                .name,
                                                                "init"
                                                            ),
                                                            b
                                                            .module
                                                            .run()
                                                    }
                                                );
                                            hj.widget
                                                .runLatestMatchingWidget();
                                            hj.includedInSample &&
                                                hj
                                                .pageVisit
                                                .track();
                                            hj._init
                                                ._verifyInstallation();
                                            "1" ===
                                            hj.url
                                                .getParameter(
                                                    "hjIncludeInSample"
                                                ) &&
                                                hj
                                                .notification
                                                .show(
                                                    "Hotjar tracking active.",
                                                    "Hotjar tracking is active for your session.",
                                                    "good"
                                                )
                                        },
                                        "init")
                                ))
                    })
                } else hj.log.debug(
                        "Cookies are not enabled"), hj._init
                    ._verifyInstallation()
            }
        }, "init")
    }, hj.hq(document).ready(function() {
        hj.log.debug("Document is ready. Initializing...",
            "init");
        hj._init.run()
    }))
}, "init")();
