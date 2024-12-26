import { useEffect, useMemo, useRef, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { UserService } from "./userinfo";
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";

export interface RouterList{
    path: string;
    element: React.JSX.Element;
    params?: Record<string, any>;
}

export interface DynamicComponentLoaderProps<P> {
    componentName: string;
    componentProps?: P;
}

export interface CompProps {
    /**统一回调 */
    onCallBack?(t: any): void;
}

export interface RouterPathParams {
    children: React.JSX.Element;
    routerList: RouterList[][];
    /**全局筛选 */
    searchParams?: Record<string,any>;
    /**页面传递参数 */
    pageParams?: Record<string, any>;
    /**跳转页面 */
    onNavigate?(key: string, params?: Record<string,any>): void;
    goBack?():void;
    /**登录态回调 */
    onLoginStatus(val?: Record<string, any>): void;
}

interface navbarParams{
    /**如果为true，需传入coustomNavbarc参数 */
    coustom?: boolean;
    coustomNavbar?: React.JSX.Element;
    style?: StyleProp<ViewStyle>;
    right?: React.JSX.Element;
}

export interface RouterPageParams{
    children: React.JSX.Element;
    title: string;
    navBar?: navbarParams
}


export interface PagesContent{
    key: string;
    element: React.ReactNode
}

export function useStateRef<T>(defaultValue: T) {
    const [state, setState] = useState<T>(defaultValue);
    const cache = useRef(state);
    const setCache = useRef(setState);
    setCache.current = setState;
    return useMemo(() => {
        return {
            get current(): T { return cache.current; },
            set current(value: T) {
                if (cache.current === value) return;
                cache.current = value;
                setCache.current(value);
            },
            set(value: T) {
                if (cache.current === value) return;
                cache.current = value;
                setCache.current(value);
            }
        }
    }, []);
}

export function useGetUserToken(){
    const [token,setToken] = useState<string>("")
    useEffect(()=>{
        (async()=>{
            const tk = await UserService.getUserToken()
            if(tk) setToken(tk)
        })()
    },[])
    return token
}

export const LoginEmit = new EventEmitter()