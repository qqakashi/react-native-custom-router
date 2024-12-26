import React, { useEffect, useState } from "react";
import Animated, { Easing, Keyframe, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { RouterPageParams } from "./interface";
import { Button, Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouterParams } from "./useRouterParams";


export default function Page(props: RouterPageParams){
    const page = useRouterParams()
    const translateX = useSharedValue(30); // 页面位置
    const opacity = useSharedValue(0.85); // 页面透明度
    const keyframe = new Keyframe({
        0: {
            transform: [
              { translateX: 30 },
            ],
        },
        100: {
            transform: [
              { translateX: 0 },
            ],
            easing: Easing.out(Easing.quad),
        },
      }).duration(200);
      

    // useEffect(()=>{
    //     translateX.value = withTiming(0, {
    //         duration: 500,
    //         easing: Easing.bezier(.02,.54,.34,.97)
    //     });
    //     opacity.value = withTiming(1, {
    //         duration: 500,
    //         easing: Easing.bezier(.02,.54,.34,.97)
    //     });
    // },[])

    // const foregroundStyle = useAnimatedStyle(() => ({
    //     transform: [{ translateX: translateX.value }],
    //     opacity: opacity.value
    // }));
    

    return (<Animated.View style={[{flex: 1}]} entering={keyframe}>
        {
            props.navBar?.coustom?
                props.navBar?.coustomNavbar:
                <View style={[{width: Dimensions.get("window").width, backgroundColor: "#fff"},props.navBar?.style]}>
                    <View style={{width: "100%", flexDirection: "row", alignItems: "center", marginTop: 55, paddingBottom: 10}}>
                        <TouchableOpacity style={{width: 80, flexDirection: "row", alignItems: "center"}} onPress={()=>page?.goBack?.()}>
                            <Image source={require("./image/fanhui.png")} style={{width: 25, height: 25, marginLeft: 10}} />
                            <Text style={{color: "#333", fontSize: 18}}>&nbsp;返回</Text>
                        </TouchableOpacity>
                        <Text style={{flex: 1, textAlign: "center", fontSize: 18}}>{props.title}</Text>
                        <View style={{width: 80}}>{props.navBar?.right}</View>
                    </View>
                </View>
        }
        {props.children}
    </Animated.View>)
}