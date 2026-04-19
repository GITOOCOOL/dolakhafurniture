module.exports = [
  93695,
  (a, b, c) => {
    b.exports = a.x("next/dist/shared/lib/no-fallback-error.external.js", () =>
      require("next/dist/shared/lib/no-fallback-error.external.js"),
    );
  },
  50645,
  (a) => {
    a.n(a.i(27572));
  },
  43619,
  (a) => {
    a.n(a.i(79962));
  },
  13718,
  (a) => {
    a.n(a.i(85523));
  },
  18198,
  (a) => {
    a.n(a.i(45518));
  },
  62212,
  (a) => {
    a.n(a.i(66114));
  },
  64240,
  (a, b, c) => {
    "use strict";
    function d(a) {
      if ("function" != typeof WeakMap) return null;
      var b = new WeakMap(),
        c = new WeakMap();
      return (d = function (a) {
        return a ? c : b;
      })(a);
    }
    c._ = function (a, b) {
      if (!b && a && a.__esModule) return a;
      if (null === a || ("object" != typeof a && "function" != typeof a))
        return { default: a };
      var c = d(b);
      if (c && c.has(a)) return c.get(a);
      var e = { __proto__: null },
        f = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var g in a)
        if ("default" !== g && Object.prototype.hasOwnProperty.call(a, g)) {
          var h = f ? Object.getOwnPropertyDescriptor(a, g) : null;
          h && (h.get || h.set)
            ? Object.defineProperty(e, g, h)
            : (e[g] = a[g]);
        }
      return ((e.default = a), c && c.set(a, e), e);
    };
  },
  790,
  (a, b, c) => {
    let { createClientModuleProxy: d } = a.r(11857);
    a.n(
      d(
        "[project]/node_modules/next/dist/client/app-dir/link.js <module evaluation>",
      ),
    );
  },
  84707,
  (a, b, c) => {
    let { createClientModuleProxy: d } = a.r(11857);
    a.n(d("[project]/node_modules/next/dist/client/app-dir/link.js"));
  },
  97647,
  (a) => {
    "use strict";
    a.i(790);
    var b = a.i(84707);
    a.n(b);
  },
  95936,
  (a, b, c) => {
    "use strict";
    Object.defineProperty(c, "__esModule", { value: !0 });
    var d = {
      default: function () {
        return i;
      },
      useLinkStatus: function () {
        return h.useLinkStatus;
      },
    };
    for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] });
    let f = a.r(64240),
      g = a.r(7997),
      h = f._(a.r(97647));
    function i(a) {
      let b = a.legacyBehavior,
        c =
          "string" == typeof a.children ||
          "number" == typeof a.children ||
          "string" == typeof a.children?.type,
        d = a.children?.type?.$$typeof === Symbol.for("react.client.reference");
      return (
        !b ||
          c ||
          d ||
          (a.children?.type?.$$typeof === Symbol.for("react.lazy")
            ? console.error(
                "Using a Lazy Component as a direct child of `<Link legacyBehavior>` from a Server Component is not supported. If you need legacyBehavior, wrap your Lazy Component in a Client Component that renders the Link's `<a>` tag.",
              )
            : console.error(
                "Using a Server Component as a direct child of `<Link legacyBehavior>` is not supported. If you need legacyBehavior, wrap your Server Component in a Client Component that renders the Link's `<a>` tag.",
              )),
        (0, g.jsx)(h.default, { ...a })
      );
    }
    ("function" == typeof c.default ||
      ("object" == typeof c.default && null !== c.default)) &&
      void 0 === c.default.__esModule &&
      (Object.defineProperty(c.default, "__esModule", { value: !0 }),
      Object.assign(c.default, c),
      (b.exports = c.default));
  },
  98941,
  (a) => {
    "use strict";
    var b = a.i(7997),
      c = a.i(95936);
    function d() {
      return (0, b.jsx)("div", {
        className:
          "bg-[#fdfaf5] min-h-screen pt-32 pb-20 font-sans text-[#3d2b1f]",
        children: (0, b.jsxs)("div", {
          className: "container mx-auto px-6",
          children: [
            (0, b.jsxs)("header", {
              className: "mb-24 text-center max-w-4xl mx-auto",
              children: [
                (0, b.jsx)("p", {
                  className:
                    "text-[10px] font-bold uppercase tracking-[0.4em] text-[#a3573a] mb-6",
                  children: "Our Heritage & Vision",
                }),
                (0, b.jsxs)("h1", {
                  className:
                    "text-6xl md:text-8xl font-serif italic font-medium text-[#3d2b1f] leading-tight mb-12",
                  children: [
                    "The Story of Dolakha",
                    (0, b.jsx)("span", {
                      className: "text-[#a3573a]",
                      children: ".",
                    }),
                  ],
                }),
                (0, b.jsx)("div", {
                  className: "h-[1px] w-24 bg-[#a3573a] mx-auto opacity-50",
                }),
              ],
            }),
            (0, b.jsxs)("div", {
              className:
                "grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40",
              children: [
                (0, b.jsxs)("div", {
                  className: "space-y-10 order-2 lg:order-1",
                  children: [
                    (0, b.jsxs)("h2", {
                      className:
                        "text-4xl md:text-5xl font-serif italic font-medium text-[#3d2b1f] leading-snug",
                      children: [
                        "Born in Kathmandu, ",
                        (0, b.jsx)("br", {}),
                        "Inspired by Tradition.",
                      ],
                    }),
                    (0, b.jsxs)("div", {
                      className: "space-y-6",
                      children: [
                        (0, b.jsx)("p", {
                          className:
                            "text-lg text-[#a89f91] leading-relaxed font-light",
                          children:
                            "Established as a leading furniture designer and supplier in the heart of Kathmandu, Dolakha Furniture was founded with a singular purpose: to bring the strength and beauty of  craftsmanship into every Nepali home.",
                        }),
                        (0, b.jsx)("p", {
                          className:
                            "text-[#a3573a] italic font-serif text-2xl leading-relaxed",
                          children:
                            '"Quality product with beauty is in our mind."',
                        }),
                      ],
                    }),
                  ],
                }),
                (0, b.jsxs)("div", {
                  className:
                    "order-1 lg:order-2 aspect-[4/5] bg-[#e5dfd3] rounded-[4rem] overflow-hidden shadow-sm relative group",
                  children: [
                    (0, b.jsx)("img", {
                      src: "/hero.jpg",
                      alt: "Dolakha Craftsmanship",
                      className:
                        "object-cover w-full h-full opacity-90 sepia-[0.3] hover:sepia-0 transition-all duration-1000",
                    }),
                    (0, b.jsx)("div", {
                      className:
                        "absolute inset-0 bg-[#a3573a]/5 mix-blend-multiply",
                    }),
                  ],
                }),
              ],
            }),
            (0, b.jsxs)("div", {
              className:
                "grid grid-cols-1 md:grid-cols-3 gap-16 border-y border-[#e5dfd3] border-dotted py-24 mb-40",
              children: [
                (0, b.jsxs)("div", {
                  className: "space-y-4",
                  children: [
                    (0, b.jsx)("span", {
                      className: "text-[#a3573a] font-serif italic text-4xl",
                      children: "01.",
                    }),
                    (0, b.jsx)("h3", {
                      className:
                        "text-lg font-serif italic font-semibold text-[#3d2b1f]",
                      children: "Smart Design",
                    }),
                    (0, b.jsx)("p", {
                      className:
                        "text-sm text-[#a89f91] leading-relaxed font-light",
                      children:
                        "From our famous metallic swings to versatile plant stands, we blend iron and wood using smart ideas to maximize your home's potential.",
                    }),
                  ],
                }),
                (0, b.jsxs)("div", {
                  className: "space-y-4",
                  children: [
                    (0, b.jsx)("span", {
                      className: "text-[#a3573a] font-serif italic text-4xl",
                      children: "02.",
                    }),
                    (0, b.jsx)("h3", {
                      className:
                        "text-lg font-serif italic font-semibold text-[#3d2b1f]",
                      children: "Enduring Quality",
                    }),
                    (0, b.jsx)("p", {
                      className:
                        "text-sm text-[#a89f91] leading-relaxed font-light",
                      children:
                        "Every product—whether a bed, daraz, or console table—is built to be as strong as it is good-looking, ensuring it lasts for generations.",
                    }),
                  ],
                }),
                (0, b.jsxs)("div", {
                  className: "space-y-4",
                  children: [
                    (0, b.jsx)("span", {
                      className: "text-[#a3573a] font-serif italic text-4xl",
                      children: "03.",
                    }),
                    (0, b.jsx)("h3", {
                      className:
                        "text-lg font-serif italic font-semibold text-[#3d2b1f]",
                      children: "Personal Touch",
                    }),
                    (0, b.jsx)("p", {
                      className:
                        "text-sm text-[#a89f91] leading-relaxed font-light",
                      children:
                        "Based in Samakhusi, we pride ourselves on direct connection—delivering personally to your doorstep across Kathmandu.",
                    }),
                  ],
                }),
              ],
            }),
            (0, b.jsxs)("section", {
              className:
                "bg-[#1a1c13] text-[#fdfaf5] rounded-[5rem] p-12 md:p-24 text-center",
              children: [
                (0, b.jsxs)("h2", {
                  className:
                    "text-4xl md:text-6xl font-serif italic font-medium mb-10 leading-snug",
                  children: [
                    "Visit Our Samakhusi ",
                    (0, b.jsx)("br", {}),
                    " Showroom",
                    (0, b.jsx)("span", {
                      className: "text-[#df9152]",
                      children: ".",
                    }),
                  ],
                }),
                (0, b.jsx)("p", {
                  className:
                    "text-[#e2e8da] mb-12 max-w-xl mx-auto text-xl italic font-serif leading-relaxed",
                  children:
                    '"Experience the texture and strength of our pieces in person. We are ready to deliver beauty to your home."',
                }),
                (0, b.jsxs)("div", {
                  className: "flex flex-col md:flex-row gap-6 justify-center",
                  children: [
                    (0, b.jsx)(c.default, {
                      href: "/shop",
                      className:
                        "bg-[#fdfaf5] text-[#1a1c13] px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#a3573a] hover:text-white transition-all",
                      children: "Explore Archive",
                    }),
                    (0, b.jsx)("a", {
                      href: "https://www.facebook.com/dolakhafurniture/",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className:
                        "border border-[#fdfaf5]/20 text-[#fdfaf5] px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:border-[#a3573a] hover:text-[#a3573a] transition-all",
                      children: "Message Us",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      });
    }
    a.s(["default", () => d]);
  },
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ad42935a._.js.map
