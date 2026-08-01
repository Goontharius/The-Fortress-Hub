(() => {
  "use strict";
  var e = {
    255(e, t, o) {
      (o.r(t), o.d(t, { default: () => j }));
      var n = o(5170),
        r = o(7917),
        a = o(5225),
        i = o(6729),
        l = o(3133),
        s = o(3780),
        d = o(1553),
        c = o(5685),
        u = o(5346),
        f = o(3390),
        p = o(606),
        h = o(7904),
        y = o(4562),
        x = o(1690);
      const g = y.default.expoConfig?.extra?.apiBase ?? "http://localhost:4000",
        b = {
          Authorization: `Bearer ${y.default.expoConfig?.extra?.apiToken ?? "fortress-hub-api-token"}`,
        };
      function j() {
        const [e, t] = (0, n.useState)([]),
          [o, c] = (0, n.useState)(""),
          [y, j] = (0, n.useState)(""),
          [w, v] = (0, n.useState)(""),
          [S, T] = (0, n.useState)("Supplies"),
          [C, O] = (0, n.useState)(""),
          [k, B] = (0, n.useState)(!0),
          [P, E] = (0, n.useState)(!1),
          [D, R] = (0, n.useState)(null);
        (0, n.useEffect)(() => {
          M();
        }, []);
        const A = (0, n.useMemo)(() => parseFloat(y) || 0, [y]);
        async function M() {
          B(!0);
          try {
            const e = await (async function () {
              const e = await fetch(`${g}/receipts`, { headers: b });
              if (!e.ok) throw new Error("Unable to load receipts");
              return e.json();
            })();
            t(e);
          } catch (e) {
            a.default.alert("Load error", String(e));
          } finally {
            B(!1);
          }
        }
        async function $(e) {
          try {
            (await (async function (e) {
              if (
                !(
                  await fetch(`${g}/receipts/${e}`, {
                    method: "DELETE",
                    headers: b,
                  })
                ).ok
              )
                throw new Error("Unable to delete receipt");
            })(e),
              t((t) => t.filter((t) => t.id !== e)));
          } catch (o) {
            a.default.alert("Delete error", String(o));
          }
        }
        return (0, x.jsx)(s.default, {
          style: m.safeArea,
          children: (0, x.jsxs)(d.default, {
            contentContainerStyle: m.container,
            keyboardShouldPersistTaps: "handled",
            children: [
              (0, x.jsx)(u.default, {
                style: m.title,
                children: "The Fortress Hub Mobile",
              }),
              (0, x.jsx)(u.default, {
                style: m.subtitle,
                children: "Secure receipt tracking with backend persistence.",
              }),
              (0, x.jsxs)(h.default, {
                style: m.card,
                children: [
                  (0, x.jsx)(u.default, {
                    style: m.sectionTitle,
                    children: D ? "Edit Receipt" : "New Receipt",
                  }),
                  (0, x.jsx)(f.default, {
                    style: m.input,
                    placeholder: "Vendor",
                    value: o,
                    onChangeText: c,
                  }),
                  (0, x.jsx)(f.default, {
                    style: m.input,
                    placeholder: "Amount",
                    keyboardType: "decimal-pad",
                    value: y,
                    onChangeText: j,
                  }),
                  (0, x.jsx)(f.default, {
                    style: m.input,
                    placeholder: "Date (YYYY-MM-DD)",
                    value: w,
                    onChangeText: v,
                  }),
                  (0, x.jsx)(f.default, {
                    style: m.input,
                    placeholder: "Category",
                    value: S,
                    onChangeText: T,
                  }),
                  (0, x.jsx)(f.default, {
                    style: [m.input, m.textArea],
                    placeholder: "Notes",
                    value: C,
                    onChangeText: O,
                    multiline: !0,
                  }),
                  (0, x.jsxs)(h.default, {
                    style: m.buttonRow,
                    children: [
                      (0, x.jsx)(i.default, {
                        title: D ? "Update" : "Save",
                        onPress: async function () {
                          if (o && y && w) {
                            E(!0);
                            try {
                              const e = {
                                  vendor: o,
                                  amount: A,
                                  currency: "USD",
                                  date: w,
                                  category: S,
                                  notes: C || void 0,
                                },
                                n = D
                                  ? await (async function (e, t) {
                                      const o = await fetch(
                                        `${g}/receipts/${e}`,
                                        {
                                          method: "PUT",
                                          headers: Object.assign(
                                            {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            b,
                                          ),
                                          body: JSON.stringify(t),
                                        },
                                      );
                                      if (!o.ok)
                                        throw new Error(
                                          "Unable to update receipt",
                                        );
                                      return o.json();
                                    })(D, e)
                                  : await (async function (e) {
                                      const t = await fetch(`${g}/receipts`, {
                                        method: "POST",
                                        headers: Object.assign(
                                          {
                                            "Content-Type": "application/json",
                                          },
                                          b,
                                        ),
                                        body: JSON.stringify(e),
                                      });
                                      if (!t.ok)
                                        throw new Error(
                                          "Unable to save receipt",
                                        );
                                      return t.json();
                                    })(e);
                              (t((e) =>
                                D
                                  ? e.map((e) => (e.id === n.id ? n : e))
                                  : [n, ...e],
                              ),
                                c(""),
                                j(""),
                                v(""),
                                T("Supplies"),
                                O(""),
                                R(null));
                            } catch (e) {
                              a.default.alert("Save error", String(e));
                            } finally {
                              E(!1);
                            }
                          } else
                            a.default.alert(
                              "Validation",
                              "Vendor, amount, and date are required.",
                            );
                        },
                        disabled: P,
                      }),
                      D
                        ? (0, x.jsx)(i.default, {
                            title: "Cancel",
                            onPress: () => R(null),
                            color: "#888",
                          })
                        : null,
                    ],
                  }),
                ],
              }),
              (0, x.jsxs)(h.default, {
                style: m.card,
                children: [
                  (0, x.jsxs)(h.default, {
                    style: m.sectionHeader,
                    children: [
                      (0, x.jsx)(u.default, {
                        style: m.sectionTitle,
                        children: "Receipts",
                      }),
                      (0, x.jsx)(i.default, { title: "Refresh", onPress: M }),
                    ],
                  }),
                  k
                    ? (0, x.jsx)(r.default, { size: "large" })
                    : (0, x.jsx)(l.default, {
                        data: e,
                        keyExtractor: (e) => e.id,
                        renderItem: ({ item: e }) =>
                          (0, x.jsxs)(h.default, {
                            style: m.listItem,
                            children: [
                              (0, x.jsxs)(h.default, {
                                style: m.listItemText,
                                children: [
                                  (0, x.jsx)(u.default, {
                                    style: m.itemVendor,
                                    children: e.vendor,
                                  }),
                                  (0, x.jsxs)(u.default, {
                                    style: m.itemMeta,
                                    children: [e.date, " \u2022 ", e.category],
                                  }),
                                  (0, x.jsxs)(u.default, {
                                    children: ["$", e.amount.toFixed(2)],
                                  }),
                                ],
                              }),
                              (0, x.jsxs)(h.default, {
                                style: m.listButtons,
                                children: [
                                  (0, x.jsx)(p.default, {
                                    onPress: () => {
                                      return (
                                        R((t = e).id),
                                        c(t.vendor),
                                        j(t.amount.toString()),
                                        v(t.date),
                                        T(t.category),
                                        void O(t.notes ?? "")
                                      );
                                      var t;
                                    },
                                    style: m.actionButton,
                                    children: (0, x.jsx)(u.default, {
                                      style: m.actionText,
                                      children: "Edit",
                                    }),
                                  }),
                                  (0, x.jsx)(p.default, {
                                    onPress: () => $(e.id),
                                    style: [m.actionButton, m.deleteButton],
                                    children: (0, x.jsx)(u.default, {
                                      style: m.actionText,
                                      children: "Delete",
                                    }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ListEmptyComponent: (0, x.jsx)(u.default, {
                          style: m.emptyText,
                          children: "No receipts available.",
                        }),
                      }),
                ],
              }),
            ],
          }),
        });
      }
      const m = c.default.create({
        safeArea: { flex: 1, backgroundColor: "#f7f7fb" },
        container: { padding: 16, gap: 16 },
        title: { fontSize: 28, fontWeight: "700", marginBottom: 4 },
        subtitle: { fontSize: 16, color: "#555" },
        card: {
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 4,
        },
        sectionHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        },
        sectionTitle: { fontSize: 18, fontWeight: "700" },
        input: {
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
        },
        textArea: { minHeight: 86, textAlignVertical: "top" },
        buttonRow: {
          flexDirection: "row",
          gap: 12,
          justifyContent: "space-between",
        },
        listItem: {
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        listItemText: { flex: 1, marginRight: 12 },
        itemVendor: { fontSize: 16, fontWeight: "700" },
        itemMeta: { color: "#666", marginBottom: 4 },
        listButtons: { flexDirection: "row", gap: 8 },
        actionButton: {
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 10,
          backgroundColor: "#1f8ef1",
        },
        deleteButton: { backgroundColor: "#e63946" },
        actionText: { color: "#fff", fontWeight: "700" },
        emptyText: { padding: 12, color: "#666" },
      });
    },
  };
  const t = {};
  function o(n) {
    const r = t[n];
    if (void 0 !== r) return r.exports;
    const a = (t[n] = { exports: {} });
    return (e[n](a, a.exports, o), a.exports);
  }
  ((o.m = e),
    (() => {
      const e = [];
      o.O = (t, n, r, a) => {
        if (n) {
          a = a || 0;
          for (var i = e.length; i > 0 && e[i - 1][2] > a; i--) e[i] = e[i - 1];
          return void (e[i] = [n, r, a]);
        }
        let l = 1 / 0;
        for (i = 0; i < e.length; i++) {
          let [n, r, a] = e[i],
            d = !0;
          for (var s = 0; s < n.length; s++)
            (!1 & a || l >= a) && Object.keys(o.O).every((e) => o.O[e](n[s]))
              ? n.splice(s--, 1)
              : ((d = !1), a < l && (l = a));
          if (d) {
            e.splice(i--, 1);
            const o = r();
            void 0 !== o && (t = o);
          }
        }
        return t;
      };
    })(),
    (o.n = (e) => {
      const t = e && e.__esModule ? () => e.default : () => e;
      return (o.d(t, { a: t }), t);
    }),
    (o.d = (e, t) => {
      if (Array.isArray(t))
        for (var n = 0; n < t.length;) {
          var r = t[n++],
            a = t[n++];
          o.o(e, r)
            ? 0 === a && n++
            : 0 === a
              ? Object.defineProperty(e, r, { enumerable: !0, value: t[n++] })
              : Object.defineProperty(e, r, { enumerable: !0, get: a });
        }
      else
        for (var r in t)
          o.o(t, r) &&
            !o.o(e, r) &&
            Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
    }),
    (o.g = (function () {
      if ("object" === typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" === typeof window) return window;
      }
    })()),
    (o.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (o.r = (e) => {
      (Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 }));
    }),
    (o.cjs = (e) => {
      const t = { exports: {} };
      return (e.call(t.exports, t, t.exports), t.exports);
    }),
    (() => {
      const e = { 792: 0 };
      o.O.j = (t) => 0 === e[t];
      const t = (t, n) => {
          let [r, a, i] = n;
          var l,
            s,
            d = 0;
          if (r.some((t) => 0 !== e[t])) {
            for (l in a) o.o(a, l) && (o.m[l] = a[l]);
            if (i) var c = i(o);
          }
          for (t && t(n); d < r.length; d++)
            ((s = r[d]), o.o(e, s) && e[s] && e[s][0](), (e[s] = 0));
          return o.O(c);
        },
        n = (self.webpackChunkweb = self.webpackChunkweb || []);
      (n.forEach(t.bind(null, 0)), (n.push = t.bind(null, n.push.bind(n))));
    })());
  let n = o.O(void 0, [368], () => o(2792));
  n = o.O(n);
})();
//# sourceMappingURL=main.4e97c972.js.map
