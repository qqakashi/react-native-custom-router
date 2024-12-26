import React from "react"
/**路由映射表，由此定义路由 */
const routerMap = new Map<string, React.LazyExoticComponent<React.ComponentType<any>>>()
routerMap.set("home", React.lazy(() => import("./pages/home")))
routerMap.set("videos", React.lazy(() => import("./pages/videos")))
routerMap.set("text", React.lazy(() => import("./pages/text")))
routerMap.set("like", React.lazy(() => import("./pages/like")))
routerMap.set("mine", React.lazy(() => import("./pages/mine")))
routerMap.set("login", React.lazy(() => import("./pages/login")))
routerMap.set("user-detail", React.lazy(() => import("./pages/user-detail")))
export {routerMap}