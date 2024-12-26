import { useCallback, useLayoutEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useRouterParams } from "../useRouterParams";
import { UserService } from "../userinfo";


export default function Mine(){
    const page = useRouterParams()
    const todetail = useCallback(async()=>{
        const token = await UserService.getUserToken()
        if(token){
            page?.navigate?.("user-detail")
        }else{
            page?.navigate?.("login", {path: "user-detail"})
        }
    },[])

    return (<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Button onPress={todetail}>我的</Button>
    </View>)
}