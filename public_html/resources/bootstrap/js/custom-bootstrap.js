/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/
 
 * Version: 0.10.0 - 2014-01-14
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.position", "ui.bootstrap.bindHtml", "ui.bootstrap.tooltip"]), angular.module("ui.bootstrap.tpls", ["template/tooltip/tooltip-html-unsafe-popup.html", "template/tooltip/tooltip-popup.html"]), angular.module("ui.bootstrap.position", []).factory("$position", ["$document", "$window", function (a, b) {
        function c(a, c) {
            return a.currentStyle ? a.currentStyle[c] : b.getComputedStyle ? b.getComputedStyle(a)[c] : a.style[c]
        }
        function d(a) {
            return"static" === (c(a, "position") || "static")
        }
        var e = function (b) {
            for (var c = a[0], e = b.offsetParent || c; e && e !== c && d(e); )
                e = e.offsetParent;
            return e || c
        };
        return{position: function (b) {
                var c = this.offset(b), d = {top: 0, left: 0}, f = e(b[0]);
                f != a[0] && (d = this.offset(angular.element(f)), d.top += f.clientTop - f.scrollTop, d.left += f.clientLeft - f.scrollLeft);
                var g = b[0].getBoundingClientRect();
                return{width: g.width || b.prop("offsetWidth"), height: g.height || b.prop("offsetHeight"), top: c.top - d.top, left: c.left - d.left}
            }, offset: function (c) {
                var d = c[0].getBoundingClientRect();
                return{width: d.width || c.prop("offsetWidth"), height: d.height || c.prop("offsetHeight"), top: d.top + (b.pageYOffset || a[0].body.scrollTop || a[0].documentElement.scrollTop), left: d.left + (b.pageXOffset || a[0].body.scrollLeft || a[0].documentElement.scrollLeft)}
            }}
    }]), angular.module("ui.bootstrap.bindHtml", []).directive("bindHtmlUnsafe", function () {
    return function (a, b, c) {
        b.addClass("ng-binding").data("$binding", c.bindHtmlUnsafe), a.$watch(c.bindHtmlUnsafe, function (a) {
            b.html(a || "")
        })
    }
}), angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"]).provider("$tooltip", function () {
    function a(a) {
        var b = /[A-Z]/g, c = "-";
        return a.replace(b, function (a, b) {
            return(b ? c : "") + a.toLowerCase()
        })
    }
    var b = {placement: "top", animation: !0, popupDelay: 0}, c = {mouseenter: "mouseleave", click: "click", focus: "blur"}, d = {};
    this.options = function (a) {
        angular.extend(d, a)
    }, this.setTriggers = function (a) {
        angular.extend(c, a)
    }, this.$get = ["$window", "$compile", "$timeout", "$parse", "$document", "$position", "$interpolate", function (e, f, g, h, i, j, k) {
            return function (e, l, m) {
                function n(a) {
                    var b = a || o.trigger || m, d = c[b] || b;
                    return{show: b, hide: d}
                }
                var o = angular.extend({}, b, d), p = a(e), q = k.startSymbol(), r = k.endSymbol(), s = "<div " + p + "-popup " + 'title="' + q + "tt_title" + r + '" ' + 'content="' + q + "tt_content" + r + '" ' + 'placement="' + q + "tt_placement" + r + '" ' + 'animation="tt_animation" ' + 'is-open="tt_isOpen"' + ">" + "</div>";
                return{restrict: "EA", scope: !0, compile: function () {
                        var a = f(s);
                        return function (b, c, d) {
                            function f() {
                                b.tt_isOpen ? m() : k()
                            }
                            function k() {
                                (!z || b.$eval(d[l + "Enable"])) && (b.tt_popupDelay ? (v = g(p, b.tt_popupDelay, !1), v.then(function (a) {
                                    a()
                                })) : p()())
                            }
                            function m() {
                                b.$apply(function () {
                                    q()
                                })
                            }
                            function p() {
                                return b.tt_content ? (r(), u && g.cancel(u), t.css({top: 0, left: 0, display: "block"}), w ? i.find("body").append(t) : c.after(t), A(), b.tt_isOpen = !0, b.$digest(), A) : angular.noop
                            }
                            function q() {
                                b.tt_isOpen = !1, g.cancel(v), b.tt_animation ? u = g(s, 500) : s()
                            }
                            function r() {
                                t && s(), t = a(b, function () {
                                }), b.$digest()
                            }
                            function s() {
                                t && (t.remove(), t = null)
                            }
                            var t, u, v, w = angular.isDefined(o.appendToBody) ? o.appendToBody : !1, x = n(void 0), y = !1, z = angular.isDefined(d[l + "Enable"]), A = function () {
                                var a, d, e, f;
                                switch (a = w ? j.offset(c) : j.position(c), d = t.prop("offsetWidth"), e = t.prop("offsetHeight"), b.tt_placement) {
                                    case"right":
                                        f = {top: a.top + a.height / 2 - e / 2, left: a.left + a.width};
                                        break;
                                    case"bottom":
                                        f = {top: a.top + a.height, left: a.left + a.width / 2 - d / 2};
                                        break;
                                    case"left":
                                        f = {top: a.top + a.height / 2 - e / 2, left: a.left - d};
                                        break;
                                    default:
                                        f = {top: a.top - e, left: a.left + a.width / 2 - d / 2}
                                }
                                f.top += "px", f.left += "px", t.css(f)
                            };
                            b.tt_isOpen = !1, d.$observe(e, function (a) {
                                b.tt_content = a, !a && b.tt_isOpen && q()
                            }), d.$observe(l + "Title", function (a) {
                                b.tt_title = a
                            }), d.$observe(l + "Placement", function (a) {
                                b.tt_placement = angular.isDefined(a) ? a : o.placement
                            }), d.$observe(l + "PopupDelay", function (a) {
                                var c = parseInt(a, 10);
                                b.tt_popupDelay = isNaN(c) ? o.popupDelay : c
                            });
                            var B = function () {
                                y && (c.unbind(x.show, k), c.unbind(x.hide, m))
                            };
                            d.$observe(l + "Trigger", function (a) {
                                B(), x = n(a), x.show === x.hide ? c.bind(x.show, f) : (c.bind(x.show, k), c.bind(x.hide, m)), y = !0
                            });
                            var C = b.$eval(d[l + "Animation"]);
                            b.tt_animation = angular.isDefined(C) ? !!C : o.animation, d.$observe(l + "AppendToBody", function (a) {
                                w = angular.isDefined(a) ? h(a)(b) : w
                            }), w && b.$on("$locationChangeSuccess", function () {
                                b.tt_isOpen && q()
                            }), b.$on("$destroy", function () {
                                g.cancel(u), g.cancel(v), B(), s()
                            })
                        }
                    }}
            }
        }]
}).directive("tooltipPopup", function () {
    return{restrict: "EA", replace: !0, scope: {content: "@", placement: "@", animation: "&", isOpen: "&"}, templateUrl: "template/tooltip/tooltip-popup.html"}
}).directive("tooltip", ["$tooltip", function (a) {
        return a("tooltip", "tooltip", "mouseenter")
    }]).directive("tooltipHtmlUnsafePopup", function () {
    return{restrict: "EA", replace: !0, scope: {content: "@", placement: "@", animation: "&", isOpen: "&"}, templateUrl: "template/tooltip/tooltip-html-unsafe-popup.html"}
}).directive("tooltipHtmlUnsafe", ["$tooltip", function (a) {
        return a("tooltipHtmlUnsafe", "tooltip", "mouseenter")
    }]), angular.module("template/tooltip/tooltip-html-unsafe-popup.html", []).run(["$templateCache", function (a) {
        a.put("template/tooltip/tooltip-html-unsafe-popup.html", '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n')
    }]), angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function (a) {
        a.put("template/tooltip/tooltip-popup.html", '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')
    }]);