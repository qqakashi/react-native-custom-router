import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useRouterParams } from "../useRouterParams";
import Page from "../page";



export default function Home(){
    const page = useRouterParams()

    return(<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Button onPress={()=>page?.navigate?.("videos")}>跳转</Button>
    </View>)
}