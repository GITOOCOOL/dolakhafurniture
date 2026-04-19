module.exports = [
  35112,
  (a, b, c) => {
    "use strict";
    b.exports = a.r(42602).vendored["react-ssr"].ReactDOM;
  },
  33095,
  (a, b, c) => {
    "use strict";
    Object.defineProperty(c, "__esModule", { value: !0 });
    var d = {
      default: function () {
        return k;
      },
      getImageProps: function () {
        return j;
      },
    };
    for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] });
    let f = a.r(33354),
      g = a.r(94915),
      h = a.r(67161),
      i = f._(a.r(2305));
    function j(a) {
      let { props: b } = (0, g.getImgProps)(a, {
        defaultLoader: i.default,
        imgConf: {
          deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
          imageSizes: [32, 48, 64, 96, 128, 256, 384],
          qualities: [75],
          path: "/_next/image",
          loader: "default",
          dangerouslyAllowSVG: !1,
          unoptimized: !1,
        },
      });
      for (let [a, c] of Object.entries(b)) void 0 === c && delete b[a];
      return { props: b };
    }
    let k = h.Image;
  },
  71987,
  (a, b, c) => {
    b.exports = a.r(33095);
  },
  51727,
  (a) => {
    "use strict";
    var b = a.i(87924),
      c = a.i(71987),
      d = a.i(72131),
      e = a.i(70047);
    function f({ user: a, orders: f, showSuccess: g }) {
      let [h, i] = (0, d.useState)(g);
      return (
        (0, d.useEffect)(() => {
          if (g) {
            let a = setTimeout(() => i(!1), 5e3);
            return () => clearTimeout(a);
          }
        }, [g]),
        (0, b.jsxs)("div", {
          className: "max-w-6xl mx-auto text-[#3d2b1f]",
          children: [
            h &&
              (0, b.jsx)("div", {
                className:
                  "mb-12 p-8 bg-[#a3573a] text-[#fdfaf5] rounded-[3rem] font-sans font-bold uppercase tracking-[0.3em] text-center animate-in fade-in slide-in-from-top-4 duration-1000 shadow-xl",
                children: "✨ Your  order is being prepared",
              }),
            (0, b.jsxs)("header", {
              className: "mb-16 border-b border-[#e5dfd3] border-dotted pb-10",
              children: [
                (0, b.jsxs)("h1", {
                  className:
                    "text-6xl md:text-8xl font-serif italic font-medium text-[#3d2b1f] leading-none",
                  children: [
                    "My Profile",
                    (0, b.jsx)("span", {
                      className: "text-[#a3573a]",
                      children: ".",
                    }),
                  ],
                }),
                (0, b.jsxs)("div", {
                  className: "flex items-center gap-3 mt-4",
                  children: [
                    (0, b.jsx)(e.Leaf, {
                      size: 14,
                      className: "text-[#a3573a] opacity-60",
                    }),
                    (0, b.jsx)("p", {
                      className:
                        "text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#a89f91]",
                      children: " Member / Handcrafted Excellence",
                    }),
                  ],
                }),
              ],
            }),
            (0, b.jsxs)("div", {
              className: "grid grid-cols-1 lg:grid-cols-12 gap-16",
              children: [
                (0, b.jsx)("div", {
                  className: "lg:col-span-4",
                  children: (0, b.jsxs)("div", {
                    className:
                      "bg-white/60 backdrop-blur-md p-10 rounded-[4rem] border border-[#e5dfd3] shadow-sm sticky top-32",
                    children: [
                      (0, b.jsx)("div", {
                        className:
                          "relative w-24 h-24 mb-8 rounded-full overflow-hidden border border-[#e5dfd3] shadow-inner bg-[#fdfaf5] flex items-center justify-center",
                        children: a.user_metadata.avatar_url
                          ? (0, b.jsx)(c.default, {
                              src: a.user_metadata.avatar_url,
                              alt: "profile",
                              fill: !0,
                              className: "object-cover",
                            })
                          : (0, b.jsx)("span", {
                              className:
                                "text-3xl font-bold text-[#3d2b1f] tracking-tighter",
                              children: ((a) => {
                                if (!a) return "U";
                                let b = a.split(" ");
                                return b.length >= 2
                                  ? `${b[0][0]}${b[1][0]}`.toUpperCase()
                                  : b[0][0].toUpperCase();
                              })(a.user_metadata?.full_name),
                            }),
                      }),
                      (0, b.jsx)("h2", {
                        className:
                          "text-3xl font-serif italic font-medium text-[#3d2b1f] leading-none",
                        children: a.user_metadata.full_name,
                      }),
                      (0, b.jsx)("p", {
                        className:
                          "text-[#a89f91] text-xs font-sans font-medium mt-3 mb-8",
                        children: a.email,
                      }),
                      (0, b.jsx)("div", {
                        className:
                          "pt-8 border-t border-[#e5dfd3] border-dotted",
                        children: (0, b.jsxs)("div", {
                          className:
                            "flex justify-between items-center text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91]",
                          children: [
                            (0, b.jsx)("span", { children: "Member Tier" }),
                            (0, b.jsx)("span", {
                              className: "text-[#a3573a]",
                              children: "Premium ",
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                }),
                (0, b.jsxs)("div", {
                  className: "lg:col-span-8 space-y-8",
                  children: [
                    (0, b.jsxs)("h3", {
                      className:
                        "text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-[#a89f91] mb-4 ml-2",
                      children: ["Order History (", f.length, ")"],
                    }),
                    0 === f.length
                      ? (0, b.jsx)("div", {
                          className:
                            "bg-white/40 p-20 rounded-[4rem] border-2 border-dotted border-[#e5dfd3] text-center",
                          children: (0, b.jsx)("p", {
                            className:
                              "text-[#a89f91] font-serif italic text-2xl",
                            children: '"Your home awaits its first pillar."',
                          }),
                        })
                      : (0, b.jsx)("div", {
                          className: "space-y-8",
                          children: f.map((a) =>
                            (0, b.jsxs)(
                              "div",
                              {
                                className:
                                  "bg-white/60 backdrop-blur-sm p-10 rounded-[4rem] border border-[#e5dfd3] shadow-sm hover:border-[#a3573a]/40 transition-all duration-700 group",
                                children: [
                                  (0, b.jsxs)("div", {
                                    className:
                                      "flex justify-between items-start mb-10",
                                    children: [
                                      (0, b.jsxs)("div", {
                                        children: [
                                          (0, b.jsx)("p", {
                                            className:
                                              "text-[9px] font-sans font-bold uppercase tracking-widest text-[#a89f91] mb-2",
                                            children: "Order Date",
                                          }),
                                          (0, b.jsx)("p", {
                                            className:
                                              "text-sm font-sans font-bold text-[#3d2b1f]",
                                            children: new Date(
                                              a._createdAt,
                                            ).toLocaleDateString("en-US", {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                            }),
                                          }),
                                        ],
                                      }),
                                      (0, b.jsx)("span", {
                                        className:
                                          "bg-[#3d2b1f] text-[#fdfaf5] px-6 py-2 rounded-full text-[9px] font-sans font-bold uppercase tracking-widest shadow-md group-hover:bg-[#a3573a] transition-colors",
                                        children: a.status || "Processing",
                                      }),
                                    ],
                                  }),
                                  (0, b.jsx)("div", {
                                    className: "space-y-6",
                                    children: a.items?.map((a, c) =>
                                      (0, b.jsxs)(
                                        "div",
                                        {
                                          className:
                                            "flex justify-between items-center text-sm border-b border-[#e5dfd3] border-dotted pb-5 last:border-0 last:pb-0",
                                          children: [
                                            (0, b.jsxs)("span", {
                                              className:
                                                "text-[#a89f91] font-serif italic text-lg",
                                              children: [
                                                (0, b.jsxs)("span", {
                                                  className:
                                                    "text-[#3d2b1f] font-sans font-bold not-italic mr-2",
                                                  children: [a.quantity, "x"],
                                                }),
                                                a.title,
                                              ],
                                            }),
                                            (0, b.jsxs)("span", {
                                              className:
                                                "font-sans font-bold text-[#3d2b1f]",
                                              children: [
                                                "Rs. ",
                                                a.price * a.quantity,
                                              ],
                                            }),
                                          ],
                                        },
                                        c,
                                      ),
                                    ),
                                  }),
                                  (0, b.jsxs)("div", {
                                    className:
                                      "mt-10 pt-8 border-t border-[#e5dfd3] border-dotted flex justify-between items-end",
                                    children: [
                                      (0, b.jsx)("span", {
                                        className:
                                          "text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91]",
                                        children: "Total ",
                                      }),
                                      (0, b.jsxs)("span", {
                                        className:
                                          "text-4xl font-sans font-bold text-[#3d2b1f] tracking-tighter",
                                        children: ["Rs. ", a.totalPrice],
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              a._id,
                            ),
                          ),
                        }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    }
    a.s(["default", () => f]);
  },
];

//# sourceMappingURL=_fe4877ef._.js.map
