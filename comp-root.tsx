import React, { useCallback } from "react";
import DynamicComponentLoader from "./DynamicComponentLoader"
import { CompProps } from "./interface";

interface CompRootProps{
    /**需要跳转的路由名 */
    routeKey: string;
    /**统一回调 */
    onCallBack?(val: any): void;
}

/** 页面渲染容器 */
export default function CompRoot(props:CompRootProps){
    const btn = useCallback((t:any)=>{
        props.onCallBack?.(t);
    },[props.onCallBack])

    if(props.routeKey){
        return <DynamicComponentLoader<CompProps> componentName={props.routeKey} componentProps={{onCallBack: btn}} />
    }
    return <></>
}