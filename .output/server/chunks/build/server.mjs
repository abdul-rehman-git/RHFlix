import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, ref, inject, h, hasInjectionContext, getCurrentInstance, readonly, toRef, isRef, computed, shallowRef, resolveComponent, getCurrentScope, unref, isVNode, createCommentVNode, useSSRContext, Suspense, Fragment, createApp, watch, mergeProps, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, provide, shallowReactive, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, reactive, effectScope, defineAsyncComponent, isReadonly, isShallow, isReactive, toRaw } from 'vue';
import { p as parseQuery, i as getContext, k as hasProtocol, l as joinURL, m as parseURL, e as encodePath, n as decodePath, o as isScriptProtocol, w as withQuery, q as withTrailingSlash, r as withoutTrailingSlash, s as sanitizeStatusCode, $ as $fetch$1, t as createHooks, c as createError$1, v as executeAsync, x as defu } from '../nitro/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.21.11";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
function isScopeWithinInstance(instance) {
  const instanceScope = instance.scope;
  let scope = getCurrentScope();
  while (scope) {
    if (scope === instanceScope) {
      return true;
    }
    scope = scope.parent;
  }
  return false;
}
const useRoute = () => {
  if (hasInjectionContext()) {
    const instance = getCurrentInstance();
    if (!instance || isScopeWithinInstance(instance)) {
      return inject(PageRouteSymbol, useNuxtApp()._route);
    }
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
const HTML_ATTR_ENCODE_MAP = {
  "&": "%26",
  '"': "%22",
  "'": "%27",
  "<": "%3C",
  ">": "%3E"
};
function encodeForHtmlAttr(value) {
  return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedHeader = encodeURL(location2, isExternalHost);
        const encodedLoc = encodeForHtmlAttr(encodedHeader);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
  return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    const pathname = url.pathname.replace(/^\/{2,}/, "/");
    return pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
function encodeRoutePath(url) {
  const parsed = parseURL(url);
  return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  Object.defineProperty(nuxtError, "status", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusCode,
    configurable: true
  });
  Object.defineProperty(nuxtError, "statusText", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusMessage,
    configurable: true
  });
  return nuxtError;
};
function freezeHead(head) {
  const realPush = head.push;
  head.push = () => ({ dispose: () => {
  }, patch: () => {
  }, _poll: () => {
  } });
  return () => {
    head.push = realPush;
  };
}
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    if (nuxtApp.ssrContext.islandContext) {
      const unfreeze = freezeHead(head);
      nuxtApp.hooks.hookOnce("app:created", unfreeze);
    }
    nuxtApp.vueApp.use(head);
  }
});
const ROUTE_KEY_PARENTHESES_RE$1 = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE$1 = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE$1 = /:\w+/g;
const interpolatePath = (route, match) => {
  return match.path.replace(ROUTE_KEY_PARENTHESES_RE$1, "$1").replace(ROUTE_KEY_SYMBOLS_RE$1, "$1").replace(ROUTE_KEY_NORMAL_RE$1, (r) => route.params[r.slice(1)]?.toString() || "");
};
const generateRouteKey$1 = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => m.components?.default === routeProps.Component.type);
  const source = matchedRoute?.meta.key ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const router = useRouter();
    const hashScrollBehaviour = router.options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    if (from === START_LOCATION) {
      return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
    }
    return new Promise((resolve) => {
      const doScroll = () => {
        requestAnimationFrame(() => {
          if (router.currentRoute.value.fullPath !== to.fullPath) {
            resolve(false);
            return;
          }
          resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        });
      };
      nuxtApp.hooks.hookOnce("page:loading:end", () => {
        const transitionPromise = nuxtApp["~transitionPromise"];
        if (transitionPromise) {
          transitionPromise.then(doScroll);
        } else {
          doScroll();
        }
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const sensitiveMatcher = (m, p) => {
  return [];
};
const foldedMatcher = sensitiveMatcher;
const decodeRoutePath = function decodeRoutePath2(path) {
  if (!path.includes("%")) return path;
  const queryIndex = path.indexOf("?");
  const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
  try {
    return queryIndex === -1 ? decodeURI(pathname) : decodeURI(pathname) + path.slice(queryIndex);
  } catch {
    return path;
  }
};
const normalizePath = (path, fold) => {
  if (typeof path !== "string") {
    return path;
  }
  const decoded = decodeRoutePath(path);
  return fold ? decoded.toLowerCase() : decoded;
};
const _routeRulesMatcher = (path) => routerOptions.sensitive ? defu({}, ...sensitiveMatcher("", normalizePath(path, false)).map((r) => r.data).reverse()) : defu({}, ...foldedMatcher("", normalizePath(path, true)).map((r) => r.data).reverse());
const routeRulesMatcher = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher(path);
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
const __nuxt_page_meta$3 = {
  key: (route2) => route2.fullPath
};
const __nuxt_page_meta$2 = null;
const __nuxt_page_meta$1 = {
  key: (route2) => route2.fullPath
};
const __nuxt_page_meta = {
  key: (route2) => route2.fullPath
};
const _routes = [
  {
    name: __nuxt_page_meta$2?.name,
    path: "/tv",
    component: () => import('./tv-BBbkoNCT.mjs'),
    children: [
      {
        name: "tv-id",
        path: ":id()",
        meta: __nuxt_page_meta$3 || {},
        component: () => import('./_id_-D1xQ0z3u.mjs')
      },
      {
        name: "tv",
        path: "",
        component: () => import('./index-Bohl6vDG.mjs')
      }
    ]
  },
  {
    name: "index",
    path: "/",
    component: () => import('./index-CnkJx0Ld.mjs')
  },
  {
    name: "movies",
    path: "/movies",
    component: () => import('./movies-Ii0IJt6a.mjs')
  },
  {
    name: "search",
    path: "/search",
    component: () => import('./search-CD17lICZ.mjs')
  },
  {
    name: "my-list",
    path: "/my-list",
    component: () => import('./my-list-UWEEz_Up.mjs')
  },
  {
    name: "movie-id",
    path: "/movie/:id()",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./_id_-BmNi8n_5.mjs')
  },
  {
    name: "watch-tv-id",
    path: "/watch/tv/:id()",
    component: () => import('./_id_-CYUtfXmG.mjs'),
    children: [
      {
        name: "watch-tv-id-season-episode",
        path: ":season()/:episode()",
        meta: __nuxt_page_meta || {},
        component: () => import('./_episode_-CumAErwv.mjs')
      }
    ]
  },
  {
    name: "watch-movie-id",
    path: "/watch/movie/:id()",
    component: () => import('./_id_-BOZ3Z3-T.mjs')
  }
];
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    status: result && (result.status || result.statusCode) || 404,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
Object.assign(/* @__PURE__ */ Object.create(null), {});
const pageIslandRoutes = Object.assign(/* @__PURE__ */ Object.create(null), {});
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      const lastTo = to.matched.at(-1)?.components?.default;
      const lastFrom = from.matched.at(-1)?.components?.default;
      if (lastTo === lastFrom) {
        const toKey = generateRouteKey$1({ route: to, Component: { type: lastTo } });
        const fromKey = generateRouteKey$1({ route: from, Component: { type: lastFrom } });
        if (toKey === fromKey) {
          syncCurrentRoute();
        }
        return;
      }
      if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const error = /* @__PURE__ */ useError();
    const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
    if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        {
          delete nuxtApp._middlewareTo;
        }
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    const hasDeferredRoute = false;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext && !isServerPage) {
      return { provide: { router } };
    }
    function pushErroredRoute(to) {
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      {
        nuxtApp._middlewareTo = to;
      }
      if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        const routeRules = getRouteRules({ path: to.path });
        if (routeRules.appMiddleware) {
          for (const key in routeRules.appMiddleware) {
            if (routeRules.appMiddleware[key]) {
              middlewareEntries.add(key);
            } else {
              middlewareEntries.delete(key);
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
                pushErroredRoute(to);
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    if (isServerPage) {
      router.beforeResolve((to) => {
        const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
        const actual = to.matched.find((m) => m.components?.default?.__nuxt_island)?.components?.default;
        if (!expected || expected !== actual?.__nuxt_island) {
          nuxtApp.ssrContext["~renderResponse"] = {
            statusCode: 400,
            statusMessage: "Invalid island request path"
          };
          return false;
        }
      });
    }
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      {
        delete nuxtApp._middlewareTo;
      }
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0 && !error.value) {
        return nuxtApp.runWithContext(() => showError(createError({
          status: 404,
          fatal: false,
          statusText: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        const pluginNavigatedAway = false;
        if (pluginNavigatedAway) ;
        else if (hasDeferredRoute) ;
        else {
          await router.replace({
            ...resolvedInitialRoute,
            force: true
          });
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4
];
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
function sanitizeExternalHref(value) {
  let candidate = value.replace(/[\u0000-\u001f\s]+/g, "");
  while (candidate.toLowerCase().startsWith("view-source:")) {
    candidate = candidate.slice("view-source:".length);
  }
  const colon = candidate.indexOf(":");
  if (colon > 0 && isScriptProtocol(candidate.slice(0, colon + 1))) {
    return null;
  }
  return value;
}
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (unref(props.external)) {
        return true;
      }
      const path = unref(props.to) || unref(props.href) || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to, viewTransition: unref(props.viewTransition) });
    const href = computed(() => {
      const effectiveTrailingSlash = unref(props.trailingSlash) ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        const raw = to.value;
        return typeof raw === "string" ? sanitizeExternalHref(raw) : raw;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        const safe = typeof href2 === "string" ? sanitizeExternalHref(href2) : href2;
        return safe === null ? null : applyTrailingSlashBehavior(safe, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        if (href.value === null) {
          return;
        }
        await navigateTo(href.value, { replace: unref(props.replace), external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: async (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            try {
              const encodedHref = encodeRoutePath(href.value ?? "");
              return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
            } finally {
            }
          }
        }, slots.default?.());
      };
    }
  });
}
const __nuxt_component_0$1 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  if (trailingSlash !== "append" && trailingSlash !== "remove") {
    return to;
  }
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const SVG_PLACEHOLDER = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450" fill="%230e1017"%3E%3Crect width="100%25" height="100%25" fill="%230e1017"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23e50914" font-weight="bold"%3EMARXI%3C/text%3E%3C/svg%3E';
const apiCache = /* @__PURE__ */ new Map();
const CACHE_TTL_MS = 5 * 60 * 1e3;
const MOCK_MOVIES = [
  {
    id: 550,
    title: "Fight Club",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/hZkgoQY85WAgW2s5FiBGfiG3Mws.jpg",
    media_type: "movie",
    popularity: 92.5,
    release_date: "1999-10-15",
    vote_average: 8.4,
    vote_count: 28e3,
    genre_ids: [18]
  },
  {
    id: 157336,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsX2k.jpg",
    media_type: "movie",
    popularity: 140.2,
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 34e3,
    genre_ids: [12, 18, 878]
  },
  {
    id: 27205,
    title: "Inception",
    overview: "Cobb, a skilled thief who steals corporate secrets through dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_path: "/oYu2T8CrmDhM8PhbK3LUBnmxI7d.jpg",
    backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAu4C.jpg",
    media_type: "movie",
    popularity: 110.8,
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 36e3,
    genre_ids: [28, 878, 12]
  }
];
const MOCK_TV_SHOWS = [
  {
    id: 1399,
    name: "Game of Thrones",
    overview: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war.",
    poster_path: "/1XS1oqL89opfnbLl8WnZY1j1uJx.jpg",
    backdrop_path: "/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
    media_type: "tv",
    popularity: 250.5,
    first_air_date: "2011-04-17",
    vote_average: 8.4,
    vote_count: 22e3,
    genre_ids: [10765, 18, 10759]
  },
  {
    id: 60625,
    name: "Rick and Morty",
    overview: "An intelligent, alcohol-addicted scientist named Rick travels through time and space with his anxious 14-year-old grandson Morty.",
    poster_path: "/gd1W0dyaVGe2flaxLDFvPHpBxTJ.jpg",
    backdrop_path: "/m7tG5E1ESuL9Z8T593E9V2Z.jpg",
    media_type: "tv",
    popularity: 180.2,
    first_air_date: "2013-12-02",
    vote_average: 8.7,
    vote_count: 9500,
    genre_ids: [16, 35, 10765]
  }
];
const useTmdb = () => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const apiKey = config.public.tmdbApiKey;
  const isConfigured = computed(() => {
    return Boolean(apiKey && apiKey.trim().length > 0 && apiKey !== "YOUR_TMDB_API_KEY");
  });
  const getImageUrl = (path, size = "w500") => {
    if (!path || typeof path !== "string" || path.trim().length === 0) {
      return SVG_PLACEHOLDER;
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
  };
  const fetchFromTmdb = async (endpoint, params = {}) => {
    if (!isConfigured.value) {
      throw new Error("TMDB API Key is missing. Set NUXT_PUBLIC_TMDB_API_KEY in .env file.");
    }
    const query = new URLSearchParams({
      api_key: apiKey,
      ...params
    });
    const cacheKey = `${endpoint}?${query.toString()}`;
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    const url = `${TMDB_BASE_URL}${endpoint}?${query.toString()}`;
    try {
      const data = await $fetch(url);
      apiCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (err) {
      console.error(`[TMDB API Error] ${endpoint}:`, err);
      throw err;
    }
  };
  const getTrending = async (type = "movie", page = 1) => {
    if (!isConfigured.value) {
      const items = type === "movie" ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
    try {
      return await fetchFromTmdb(`/trending/${type}/day`, { page });
    } catch (_) {
      const items = type === "movie" ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
  };
  const getPopular = async (type = "movie", page = 1) => {
    if (!isConfigured.value) {
      const items = type === "movie" ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
    try {
      return await fetchFromTmdb(`/${type}/popular`, { page });
    } catch (_) {
      const items = type === "movie" ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
  };
  const getTopRated = async (type = "movie", page = 1) => {
    if (!isConfigured.value) {
      const items = type === "movie" ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
    try {
      return await fetchFromTmdb(`/${type}/top_rated`, { page });
    } catch (_) {
      const items = type === "movie" ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
  };
  const getNowPlaying = async (page = 1) => {
    if (!isConfigured.value) {
      return { page: 1, results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
    }
    try {
      return await fetchFromTmdb("/movie/now_playing", { page });
    } catch (_) {
      return { page: 1, results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
    }
  };
  const getUpcoming = async (page = 1) => {
    if (!isConfigured.value) {
      return { page: 1, results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
    }
    try {
      return await fetchFromTmdb("/movie/upcoming", { page });
    } catch (_) {
      return { page: 1, results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
    }
  };
  const getAiringToday = async (page = 1) => {
    if (!isConfigured.value) {
      return { page: 1, results: MOCK_TV_SHOWS, total_pages: 1, total_results: MOCK_TV_SHOWS.length };
    }
    try {
      return await fetchFromTmdb("/tv/airing_today", { page });
    } catch (_) {
      return { page: 1, results: MOCK_TV_SHOWS, total_pages: 1, total_results: MOCK_TV_SHOWS.length };
    }
  };
  const getOnTheAir = async (page = 1) => {
    if (!isConfigured.value) {
      return { page: 1, results: MOCK_TV_SHOWS, total_pages: 1, total_results: MOCK_TV_SHOWS.length };
    }
    try {
      return await fetchFromTmdb("/tv/on_the_air", { page });
    } catch (_) {
      return { page: 1, results: MOCK_TV_SHOWS, total_pages: 1, total_results: MOCK_TV_SHOWS.length };
    }
  };
  const getGenres = async (type = "movie") => {
    if (!isConfigured.value) {
      return [
        { id: 28, name: "Action" },
        { id: 18, name: "Drama" },
        { id: 878, name: "Sci-Fi" },
        { id: 35, name: "Comedy" }
      ];
    }
    try {
      const res = await fetchFromTmdb(`/genre/${type}/list`);
      return res.genres || [];
    } catch (_) {
      return [
        { id: 28, name: "Action" },
        { id: 18, name: "Drama" },
        { id: 878, name: "Sci-Fi" },
        { id: 35, name: "Comedy" }
      ];
    }
  };
  const getByGenre = async (type, genreId, page = 1) => {
    if (!isConfigured.value) {
      const items = type === "movie" ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
    try {
      return await fetchFromTmdb(`/discover/${type}`, {
        with_genres: genreId.toString(),
        page
      });
    } catch (_) {
      const items = type === "movie" ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
  };
  const getMovieDetails = async (id) => {
    if (!isConfigured.value) {
      const found = MOCK_MOVIES.find((m) => m.id === Number(id)) || MOCK_MOVIES[0];
      return {
        ...found,
        runtime: 148,
        status: "Released",
        tagline: "Mind-bending cinematic experience.",
        budget: 16e7,
        revenue: 8368e5,
        original_language: "en",
        genres: [{ id: 28, name: "Action" }, { id: 878, name: "Sci-Fi" }]
      };
    }
    return fetchFromTmdb(`/movie/${id}`);
  };
  const getTVDetails = async (id) => {
    if (!isConfigured.value) {
      const found = MOCK_TV_SHOWS.find((t) => t.id === Number(id)) || MOCK_TV_SHOWS[0];
      return {
        ...found,
        number_of_seasons: 8,
        number_of_episodes: 73,
        status: "Ended",
        tagline: "Winter is Coming.",
        original_language: "en",
        genres: [{ id: 10765, name: "Sci-Fi & Fantasy" }, { id: 18, name: "Drama" }],
        seasons: [
          { id: 3624, season_number: 1, name: "Season 1", episode_count: 10, poster_path: found.poster_path },
          { id: 3625, season_number: 2, name: "Season 2", episode_count: 10, poster_path: found.poster_path }
        ]
      };
    }
    return fetchFromTmdb(`/tv/${id}`);
  };
  const getSeasonDetails = async (tvId, seasonNumber) => {
    if (!isConfigured.value) {
      return {
        id: 3624,
        season_number: seasonNumber,
        name: `Season ${seasonNumber}`,
        poster_path: MOCK_TV_SHOWS[0].poster_path,
        episodes: [
          {
            id: 63056,
            name: "Winter Is Coming",
            overview: "Lord Robert Baratheon and his queen, Cersei Lannister, travel north to Winterfell.",
            episode_number: 1,
            season_number: seasonNumber,
            still_path: MOCK_TV_SHOWS[0].backdrop_path,
            air_date: "2011-04-17",
            vote_average: 8.8,
            vote_count: 1200
          },
          {
            id: 63057,
            name: "The Kingsroad",
            overview: "An injured Bran learns of his fate; Ned leaves for King's Landing with daughters Sansa and Arya.",
            episode_number: 2,
            season_number: seasonNumber,
            still_path: MOCK_TV_SHOWS[0].backdrop_path,
            air_date: "2011-04-24",
            vote_average: 8.6,
            vote_count: 1100
          }
        ]
      };
    }
    return fetchFromTmdb(`/tv/${tvId}/season/${seasonNumber}`);
  };
  const search = async (query, type = "multi", page = 1) => {
    if (!query.trim()) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    if (!isConfigured.value) {
      const q = query.toLowerCase();
      const all = [...MOCK_MOVIES, ...MOCK_TV_SHOWS];
      const filtered = all.filter(
        (item) => item.title && item.title.toLowerCase().includes(q) || item.name && item.name.toLowerCase().includes(q)
      );
      return { page: 1, results: filtered, total_pages: 1, total_results: filtered.length };
    }
    try {
      return await fetchFromTmdb(`/search/${type}`, { query, page });
    } catch (_) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
  };
  const getCredits = async (type, id) => {
    if (!isConfigured.value) {
      return {
        id: Number(id),
        cast: [
          { id: 1, name: "Lead Actor", character: "Main Protagonist", profile_path: null, order: 0 },
          { id: 2, name: "Co-Star Actor", character: "Supporting Role", profile_path: null, order: 1 }
        ],
        crew: [
          { id: 3, name: "Famous Director", job: "Director", department: "Directing", profile_path: null }
        ]
      };
    }
    try {
      return await fetchFromTmdb(`/${type}/${id}/credits`);
    } catch (_) {
      return { id: Number(id), cast: [], crew: [] };
    }
  };
  const getSimilar = async (type, id) => {
    if (!isConfigured.value) {
      const items = type === "movie" ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
    try {
      return await fetchFromTmdb(`/${type}/${id}/similar`);
    } catch (_) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
  };
  return {
    isConfigured,
    getImageUrl,
    getTrending,
    getPopular,
    getTopRated,
    getNowPlaying,
    getUpcoming,
    getAiringToday,
    getOnTheAir,
    getGenres,
    getByGenre,
    getMovieDetails,
    getTVDetails,
    getSeasonDetails,
    getCredits,
    getSimilar,
    search
  };
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useMyList = () => {
  const myList = useState("marxi_my_list", () => []);
  const saveToStorage = (items) => {
  };
  const isInList = (id, type = "movie") => {
    const targetId = Number(id);
    return myList.value.some((item) => {
      const itemType = item.media_type || (item.title ? "movie" : "tv");
      return Number(item.id) === targetId && itemType === type;
    });
  };
  const toggleMyList = (item) => {
    if (!item || !item.id) return;
    const type = item.media_type || (item.title ? "movie" : "tv");
    const existingIndex = myList.value.findIndex((i) => {
      const iType = i.media_type || (i.title ? "movie" : "tv");
      return Number(i.id) === Number(item.id) && iType === type;
    });
    if (existingIndex > -1) {
      myList.value.splice(existingIndex, 1);
    } else {
      myList.value.unshift({
        ...item,
        media_type: type
      });
    }
    saveToStorage(myList.value);
  };
  const removeItem = (id, type) => {
    const targetId = Number(id);
    myList.value = myList.value.filter((i) => {
      const iType = i.media_type || (i.title ? "movie" : "tv");
      return !(Number(i.id) === targetId && iType === type);
    });
    saveToStorage(myList.value);
  };
  return {
    myList: readonly(myList),
    isInList,
    toggleMyList,
    removeItem
  };
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const { getImageUrl } = useTmdb();
    const { myList } = useMyList();
    const searchQuery = ref("");
    const isScrolled = ref(false);
    const mobileMenuOpen = ref(false);
    const suggestions = ref([]);
    const showSuggestions = ref(false);
    const loadingSuggestions = ref(false);
    const selectedIndex = ref(-1);
    ref(null);
    const myListCount = computed(() => myList.value?.length || 0);
    watch(() => route.path, () => {
      mobileMenuOpen.value = false;
      showSuggestions.value = false;
      selectedIndex.value = -1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: ["fixed top-0 left-0 right-0 z-50 transition-all duration-300", [
          unref(mobileMenuOpen) ? "bg-marxi-950 border-b border-marxi-800 shadow-2xl py-3" : unref(isScrolled) ? "glass-nav shadow-lg py-3" : "bg-gradient-to-b from-marxi-950/95 via-marxi-950/60 to-transparent py-4 sm:py-5"
        ]]
      }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between"><div class="flex items-center space-x-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center space-x-2 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-marxi-accent to-red-500 flex items-center justify-center shadow-glow-red group-hover:scale-105 transition-transform duration-300"${_scopeId}><span class="font-display font-black text-base text-white tracking-tighter"${_scopeId}>RH</span></div><span class="font-display font-extrabold text-2xl tracking-tight text-white group-hover:text-red-400 transition-colors"${_scopeId}> RHFlix<span class="text-marxi-accent"${_scopeId}>.</span></span>`);
          } else {
            return [
              createVNode("div", { class: "w-9 h-9 rounded-xl bg-gradient-to-tr from-marxi-accent to-red-500 flex items-center justify-center shadow-glow-red group-hover:scale-105 transition-transform duration-300" }, [
                createVNode("span", { class: "font-display font-black text-base text-white tracking-tighter" }, "RH")
              ]),
              createVNode("span", { class: "font-display font-extrabold text-2xl tracking-tight text-white group-hover:text-red-400 transition-colors" }, [
                createTextVNode(" RHFlix"),
                createVNode("span", { class: "text-marxi-accent" }, ".")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="hidden md:flex items-center space-x-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: ["text-sm font-medium transition-colors hover:text-white", [unref(route).path === "/" ? "text-white font-semibold" : "text-gray-400"]]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Home `);
          } else {
            return [
              createTextVNode(" Home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/movies",
        class: ["text-sm font-medium transition-colors hover:text-white", [unref(route).path.startsWith("/movies") || unref(route).path.startsWith("/movie") ? "text-white font-semibold" : "text-gray-400"]]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Movies `);
          } else {
            return [
              createTextVNode(" Movies ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tv",
        class: ["text-sm font-medium transition-colors hover:text-white", [unref(route).path.startsWith("/tv") ? "text-white font-semibold" : "text-gray-400"]]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` TV Shows `);
          } else {
            return [
              createTextVNode(" TV Shows ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/my-list",
        class: ["text-sm font-medium transition-colors hover:text-white flex items-center space-x-1.5", [unref(route).path === "/my-list" ? "text-white font-semibold" : "text-gray-400"]]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>My List</span>`);
            if (unref(myListCount) > 0) {
              _push2(`<span class="px-1.5 py-0.5 text-xs bg-marxi-accent text-white font-bold rounded-full"${_scopeId}>${ssrInterpolate(unref(myListCount))}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("span", null, "My List"),
              unref(myListCount) > 0 ? (openBlock(), createBlock("span", {
                key: 0,
                class: "px-1.5 py-0.5 text-xs bg-marxi-accent text-white font-bold rounded-full"
              }, toDisplayString(unref(myListCount)), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div><div class="flex items-center space-x-3 sm:space-x-4"><div class="relative hidden sm:block"><form class="relative flex items-center"><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search movies, TV shows..." class="w-48 lg:w-64 bg-marxi-800/80 border border-marxi-700 text-sm text-gray-200 placeholder-gray-400 rounded-full py-2 pl-9 pr-4 focus:outline-none focus:border-marxi-accent focus:w-72 transition-all duration-300"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></form>`);
      if (unref(showSuggestions) && (unref(suggestions).length > 0 || unref(loadingSuggestions))) {
        _push(`<div class="absolute top-full right-0 mt-2 w-80 lg:w-96 bg-marxi-850/95 border border-marxi-700/80 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl z-50">`);
        if (unref(loadingSuggestions)) {
          _push(`<div class="p-4 text-center text-xs text-gray-400 space-y-2"><div class="w-5 h-5 border-2 border-marxi-accent border-t-transparent rounded-full animate-spin mx-auto"></div><p>Searching suggestions...</p></div>`);
        } else if (unref(suggestions).length > 0) {
          _push(`<div class="divide-y divide-marxi-800/60 max-h-[70vh] overflow-y-auto"><div class="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-black/40 flex items-center justify-between"><span>Search Suggestions</span><span class="text-[9px] text-gray-500 font-normal">Use ↑ ↓ &amp; Enter</span></div><!--[-->`);
          ssrRenderList(unref(suggestions), (item, index) => {
            _push(`<div class="${ssrRenderClass([[
              unref(selectedIndex) === index ? "bg-marxi-800/90 border-marxi-accent text-white pl-3.5 shadow-md" : "border-transparent hover:bg-marxi-800/50"
            ], "flex items-center space-x-3 p-2.5 cursor-pointer transition-all group border-l-4"])}"><div class="w-10 h-14 rounded-md overflow-hidden bg-marxi-800 shrink-0 border border-marxi-700"><img${ssrRenderAttr("src", unref(getImageUrl)(item.poster_path, "w185"))}${ssrRenderAttr("alt", item.title || item.name)} class="w-full h-full object-cover group-hover:scale-105 transition-transform"></div><div class="flex-1 min-w-0"><h5 class="${ssrRenderClass([[unref(selectedIndex) === index ? "text-marxi-accent" : "text-white group-hover:text-marxi-accent"], "text-xs font-bold truncate transition-colors"])}">${ssrInterpolate(item.title || item.name)}</h5><div class="flex items-center space-x-2 text-[10px] text-gray-400 mt-0.5"><span class="px-1.5 py-0.5 bg-marxi-700/60 rounded text-gray-300 font-semibold uppercase text-[9px]">${ssrInterpolate(item.media_type || (item.title ? "Movie" : "TV"))}</span>`);
            if (item.release_date || item.first_air_date) {
              _push(`<span>${ssrInterpolate((item.release_date || item.first_air_date || "").substring(0, 4))}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (item.vote_average) {
              _push(`<span class="text-marxi-gold flex items-center"> ★ ${ssrInterpolate(item.vote_average.toFixed(1))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></div>`);
          });
          _push(`<!--]--><div class="${ssrRenderClass([[
            unref(selectedIndex) === unref(suggestions).length ? "bg-marxi-accent/20 border-marxi-accent text-white font-black" : "border-transparent text-marxi-accent hover:bg-marxi-800 bg-black/20"
          ], "p-2.5 text-center text-xs font-bold transition-all cursor-pointer border-l-4"])}"> View all results for &quot;${ssrInterpolate(unref(searchQuery))}&quot; → </div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/search",
        class: "sm:hidden p-2 text-gray-300 hover:text-white rounded-xl hover:bg-marxi-850 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center",
        "aria-label": "Search"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "h-5 w-5",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="md:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-marxi-850 focus:outline-none transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Toggle Navigation Menu">`);
      if (!unref(mobileMenuOpen)) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
      }
      _push(`</button></div></div>`);
      if (unref(mobileMenuOpen)) {
        _push(`<div class="md:hidden mt-3 pt-3 pb-4 border-t border-marxi-800/80 space-y-2 bg-marxi-950 rounded-2xl px-2 shadow-2xl">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          onClick: ($event) => mobileMenuOpen.value = false,
          class: ["flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all", [unref(route).path === "/" ? "bg-marxi-accent text-white font-bold shadow-glow-red" : "text-gray-300 hover:bg-marxi-850 hover:text-white"]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011.414-1.414L12 3.586l7.293 7.293a1 1 0 01.1414 1.414z"${_scopeId}></path></svg><span${_scopeId}>Home</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-5 w-5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011.414-1.414L12 3.586l7.293 7.293a1 1 0 01.1414 1.414z"
                  })
                ])),
                createVNode("span", null, "Home")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/movies",
          onClick: ($event) => mobileMenuOpen.value = false,
          class: ["flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all", [unref(route).path.startsWith("/movies") || unref(route).path.startsWith("/movie") ? "bg-marxi-accent text-white font-bold shadow-glow-red" : "text-gray-300 hover:bg-marxi-850 hover:text-white"]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h18M3 16h18"${_scopeId}></path></svg><span${_scopeId}>Movies</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-5 w-5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M7 4v16M17 4v16M3 8h18M3 16h18"
                  })
                ])),
                createVNode("span", null, "Movies")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/tv",
          onClick: ($event) => mobileMenuOpen.value = false,
          class: ["flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all", [unref(route).path.startsWith("/tv") ? "bg-marxi-accent text-white font-bold shadow-glow-red" : "text-gray-300 hover:bg-marxi-850 hover:text-white"]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"${_scopeId}></path></svg><span${_scopeId}>TV Shows</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-5 w-5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  })
                ])),
                createVNode("span", null, "TV Shows")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/my-list",
          onClick: ($event) => mobileMenuOpen.value = false,
          class: ["flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all", [unref(route).path === "/my-list" ? "bg-marxi-accent text-white font-bold shadow-glow-red" : "text-gray-300 hover:bg-marxi-850 hover:text-white"]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center space-x-3"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"${_scopeId}></path></svg><span${_scopeId}>My List</span></div>`);
              if (unref(myListCount) > 0) {
                _push2(`<span class="px-2.5 py-0.5 text-xs bg-marxi-accent text-white font-bold rounded-full border border-white/20"${_scopeId}>${ssrInterpolate(unref(myListCount))}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("div", { class: "flex items-center space-x-3" }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    class: "h-5 w-5",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    })
                  ])),
                  createVNode("span", null, "My List")
                ]),
                unref(myListCount) > 0 ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "px-2.5 py-0.5 text-xs bg-marxi-accent text-white font-bold rounded-full border border-white/20"
                }, toDisplayString(unref(myListCount)), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/search",
          onClick: ($event) => mobileMenuOpen.value = false,
          class: ["flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all", [unref(route).path === "/search" ? "bg-marxi-accent text-white font-bold shadow-glow-red" : "text-gray-300 hover:bg-marxi-850 hover:text-white"]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"${_scopeId}></path></svg><span${_scopeId}>Search</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-5 w-5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  })
                ])),
                createVNode("span", null, "Search")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Navbar.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: markStableSlot((routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        })
      });
    };
  }
});
function markStableSlot(fn) {
  const wrapped = ((routeProps) => {
    const result = fn(routeProps);
    if (Array.isArray(result)) {
      return result;
    }
    if (result == null || !isVNode(result)) {
      return [createCommentVNode()];
    }
    return [result];
  });
  wrapped._n = true;
  return wrapped;
}
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "MobileBottomNav",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { myList } = useMyList();
    const myListCount = computed(() => myList.value?.length || 0);
    const isWatchPage = computed(() => route.path.startsWith("/watch/"));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      if (!unref(isWatchPage)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "md:hidden fixed bottom-0 left-0 right-0 z-50 bg-marxi-950/95 backdrop-blur-xl border-t border-marxi-800/80 shadow-2xl transition-all duration-300 pb-[env(safe-area-inset-bottom)]" }, _attrs))}><nav class="grid grid-cols-5 h-16 items-center px-1">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: ["flex flex-col items-center justify-center space-y-1 py-1 transition-colors min-h-[44px]", [unref(route).path === "/" ? "text-marxi-accent font-bold" : "text-gray-400 hover:text-white"]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"${_scopeId}></path></svg><span class="text-[10px] tracking-tight"${_scopeId}>Home</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-5 w-5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  })
                ])),
                createVNode("span", { class: "text-[10px] tracking-tight" }, "Home")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/movies",
          class: ["flex flex-col items-center justify-center space-y-1 py-1 transition-colors min-h-[44px]", [unref(route).path.startsWith("/movies") || unref(route).path.startsWith("/movie") ? "text-marxi-accent font-bold" : "text-gray-400 hover:text-white"]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"${_scopeId}></path></svg><span class="text-[10px] tracking-tight"${_scopeId}>Movies</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-5 w-5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  })
                ])),
                createVNode("span", { class: "text-[10px] tracking-tight" }, "Movies")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/tv",
          class: ["flex flex-col items-center justify-center space-y-1 py-1 transition-colors min-h-[44px]", [unref(route).path.startsWith("/tv") ? "text-marxi-accent font-bold" : "text-gray-400 hover:text-white"]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"${_scopeId}></path></svg><span class="text-[10px] tracking-tight"${_scopeId}>TV Shows</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-5 w-5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  })
                ])),
                createVNode("span", { class: "text-[10px] tracking-tight" }, "TV Shows")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/search",
          class: ["flex flex-col items-center justify-center space-y-1 py-1 transition-colors min-h-[44px]", [unref(route).path === "/search" ? "text-marxi-accent font-bold" : "text-gray-400 hover:text-white"]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"${_scopeId}></path></svg><span class="text-[10px] tracking-tight"${_scopeId}>Search</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-5 w-5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  })
                ])),
                createVNode("span", { class: "text-[10px] tracking-tight" }, "Search")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/my-list",
          class: ["relative flex flex-col items-center justify-center space-y-1 py-1 transition-colors min-h-[44px]", [unref(route).path === "/my-list" ? "text-marxi-accent font-bold" : "text-gray-400 hover:text-white"]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="relative"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"${_scopeId}></path></svg>`);
              if (unref(myListCount) > 0) {
                _push2(`<span class="absolute -top-1 -right-2 px-1 py-0.2 text-[9px] bg-marxi-accent text-white font-extrabold rounded-full min-w-[14px] text-center"${_scopeId}>${ssrInterpolate(unref(myListCount))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><span class="text-[10px] tracking-tight"${_scopeId}>My List</span>`);
            } else {
              return [
                createVNode("div", { class: "relative" }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    class: "h-5 w-5",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    })
                  ])),
                  unref(myListCount) > 0 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "absolute -top-1 -right-2 px-1 py-0.2 text-[9px] bg-marxi-accent text-white font-extrabold rounded-full min-w-[14px] text-center"
                  }, toDisplayString(unref(myListCount)), 1)) : createCommentVNode("", true)
                ]),
                createVNode("span", { class: "text-[10px] tracking-tight" }, "My List")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</nav></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MobileBottomNav.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-marxi-950 border-t border-marxi-800/80 pt-12 pb-8 text-gray-400 text-sm" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"><div class="md:col-span-2 space-y-4"><div class="flex items-center space-x-2"><div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-marxi-accent to-red-500 flex items-center justify-center shadow-glow-red"><span class="font-display font-black text-xs text-white tracking-tight">RH</span></div><span class="font-display font-extrabold text-xl text-white"> RHFlix<span class="text-marxi-accent">.</span></span></div><p class="text-gray-400 max-w-sm text-xs leading-relaxed"> Stream your favorite movies, top-rated TV series, trending blockbusters, and exclusive releases online with fast, high-definition streaming on RHFlix. </p><div class="flex items-center space-x-3 text-xs text-gray-500"><span>Ultra HD Playback</span> • <span>Fast Streaming</span> • <span>Multi-Device</span></div></div><div><h4 class="text-white font-semibold text-xs tracking-wider uppercase mb-3">Quick Navigation</h4><ul class="space-y-2 text-xs"><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "hover:text-white transition-colors"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Home`);
      } else {
        return [
          createTextVNode("Home")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/movies",
    class: "hover:text-white transition-colors"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Popular Movies`);
      } else {
        return [
          createTextVNode("Popular Movies")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/tv",
    class: "hover:text-white transition-colors"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`TV Series`);
      } else {
        return [
          createTextVNode("TV Series")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/my-list",
    class: "hover:text-white transition-colors"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`My Watchlist`);
      } else {
        return [
          createTextVNode("My Watchlist")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/search",
    class: "hover:text-white transition-colors"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Global Search`);
      } else {
        return [
          createTextVNode("Global Search")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></div><div><h4 class="text-white font-semibold text-xs tracking-wider uppercase mb-3">Legal &amp; Terms</h4><p class="text-xs text-gray-400 leading-relaxed"> All entertainment titles, posters, and trademarks are property of their respective owners. Streaming is powered by seamless external media networks. </p></div></div><div class="pt-6 border-t border-marxi-800/40 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3"><p>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} RHFlix OTT Platform. All rights reserved.</p><div class="flex items-center space-x-4"><span>Privacy Policy</span> • <span>Terms of Service</span></div></div></div></footer>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const { isConfigured } = useTmdb();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Navbar = _sfc_main$5;
      const _component_NuxtPage = __nuxt_component_0;
      const _component_MobileBottomNav = _sfc_main$4;
      const _component_Footer = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-marxi-900 text-gray-100 flex flex-col font-sans selection:bg-marxi-accent selection:text-white" }, _attrs))}>`);
      if (!unref(isConfigured)) {
        _push(`<div class="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white text-xs py-2 px-4 text-center font-medium shadow-md z-[60] flex items-center justify-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span><strong>RHFlix Notice:</strong> Media catalog connection is currently offline. Please configure your API key to access full live content. </span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_Navbar, null, null, _parent));
      _push(`<main class="flex-grow pt-16 pb-20 md:pb-0">`);
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_MobileBottomNav, null, null, _parent));
      _push(ssrRenderComponent(_component_Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const status = Number(_error.statusCode || 500);
    const is404 = status === 404;
    const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-D9iLtlSB.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-Dm1QEZYg.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ status: unref(status), statusText: unref(statusText), statusCode: unref(status), statusMessage: unref(statusText), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    function invokeAppErrorHandler(err, target, info) {
      const errorHandler = nuxtApp.vueApp.config.errorHandler;
      if (errorHandler && !errorHandler.__nuxt_default) {
        try {
          errorHandler(err, target, info);
        } catch (handlerError) {
          console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
        }
      }
    }
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        invokeAppErrorHandler(err, target, info);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));

export { _export_sfc as _, __nuxt_component_0$1 as a, __nuxt_component_0 as b, useRoute as c, useMyList as d, entry_default as default, useRouter as e, useState as f, tryUseNuxtApp as t, useTmdb as u };
//# sourceMappingURL=server.mjs.map
