import { ActivityIndicator, Button, MD2Colors,  } from "react-native-paper";
import Page from "../page";
import { Dimensions, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { UserService } from "../userinfo";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useRouterParams } from "../useRouterParams";



export default function Login(){
    const page = useRouterParams()
    const loginTransY = useSharedValue(Dimensions.get("screen").height);
    const [load,setload] = useState(false)

    useEffect(()=>{
        loginTransY.value = withTiming(0, {duration: 350, easing: Easing.bezier(.02,.54,.34,.97)})
        return()=>{
            loginTransY.value = withTiming(Dimensions.get("screen").height, {duration: 1500, easing: Easing.bezier(.02,.54,.34,.97)})
        }
    },[])


    const style = useAnimatedStyle(()=>({
        transform: [{translateY: loginTransY.value}]
    }))

    const login = useCallback(()=>{
        setTimeout(async() => {
            await UserService.saveUserToken("6666")
            page?.onLoginStatus({path: page?.pageParams?.path})
        }, 2000);
        setload(true)
    },[])

    return(<Animated.View style={[style,{flex: 1, backgroundColor: "#ccc", height: Dimensions.get("screen").height, justifyContent: "center", alignItems: "center"}]}>
        <Button onPress={login}>登陆</Button>
        <Button onPress={()=>page?.goBack?.()}>取消登陆</Button>
        {load?<ActivityIndicator animating={true} color={MD2Colors.red800} style={{marginTop: 20}} />:<></>}
    </Animated.View>)
}