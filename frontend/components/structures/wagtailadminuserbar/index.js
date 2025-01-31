import {useEffect} from "react";
import {buildPublicApiUrl, fetcherForSWR, getAdminUserBar, getUserContext} from "../../../wagtail/api/public";
import {useRouter} from "next/router";
import useSWRImmutable from "swr/immutable";

function bootstrap () {
  // This code is copied from the wagtail static javascript file
  (function () {
    var e = document.querySelector("[data-wagtail-userbar]"), t = e.querySelector("[data-wagtail-userbar-trigger]"),
      n = e.querySelector("[role=menu]"), i = n.querySelectorAll("li"), o = "is-active";

    function a(i) {
      e.classList.add(o), t.setAttribute("aria-expanded", "true"), n.addEventListener("click", d, !1), window.addEventListener("click", l, !1), e.addEventListener("keydown", s, !1), i && n.querySelector("a[href]:not([tabindex='-1']),\n    button:not([disabled]):not([tabindex='-1']),\n    input:not([disabled]):not([tabindex='-1']),\n    [tabindex]:not([tabindex='-1'])") && setTimeout((function () {
        c()
      }), 300)
    }

    function r() {
      e.classList.remove(o), t.setAttribute("aria-expanded", "false"), n.addEventListener("click", d, !1), window.removeEventListener("click", l, !1), e.removeEventListener("keydown", s, !1)
    }

    function c() {
      i.length > 0 && setTimeout((function () {
        i[0].firstElementChild.focus()
      }), 100)
    }

    function u() {
      i.length > 0 && setTimeout((function () {
        i[i.length - 1].firstElementChild.focus()
      }), 100)
    }

    function s(e) {
      if ("true" !== t.getAttribute("aria-expanded")) ; else {
        if ("Escape" === e.key) return r(), void setTimeout((function () {
          return t.focus()
        }), 300);
        if (document.activeElement && document.activeElement.closest(".wagtail-userbar-items")) switch (e.key) {
          case"ArrowDown":
            e.preventDefault(), i.forEach((function (e, t) {
              e.firstElementChild === document.activeElement && setTimeout((function () {
                t + 1 < i.length ? i[t + 1].firstElementChild.focus() : c()
              }), 100)
            }));
            break;
          case"ArrowUp":
            e.preventDefault(), i.forEach((function (e, t) {
              e.firstElementChild === document.activeElement && setTimeout((function () {
                t > 0 ? i[t - 1].firstElementChild.focus() : u()
              }), 100)
            }));
            break;
          case"Home":
            e.preventDefault(), c();
            break;
          case"End":
            e.preventDefault(), u()
        }
      }
    }

    function d(e) {
      e.stopPropagation()
    }

    function l() {
      r()
    }

    t.addEventListener("click", (function (t) {
      t.stopPropagation(), e.classList.contains(o) ? r() : a(!0)
    }), !1), window.addEventListener("pageshow", r, !1), e.addEventListener("keydown", (function (e) {
      if (t === document.activeElement && "false" === t.getAttribute("aria-expanded")) switch (e.key) {
        case"ArrowUp":
          e.preventDefault(), a(!1), setTimeout((function () {
            return u()
          }), 300);
          break;
        case"ArrowDown":
          e.preventDefault(), a(!1), setTimeout((function () {
            return c()
          }), 300)
      }
    }))
  })()
}


export default function WagtailAdminUserBar({data: {id}}) {
  const { data, loading, error } = useSWRImmutable(
      buildPublicApiUrl(`/pages/wagtail_user_bar/${id}/`),
      fetcherForSWR
  )

  useEffect(() => {
    if (data && data.html) {
      bootstrap()
    }
  }, [data])

  return data && data.html && <div dangerouslySetInnerHTML={{__html: data.html}} /> || <div />
}
