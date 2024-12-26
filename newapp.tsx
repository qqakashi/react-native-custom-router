import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Snackbar } from "react-native-paper";

interface Character{
    name: string;
    blood: number;
    attack: number;
    defense: number;
    heals: number;
}

export default function NewApp(){
    const [visible, setvisible] = useState<boolean>(false)
    const [startatt,setstartatt] = useState<Record<string, {anima:boolean, att:number}>>(Object.create(null))
    const [startatt2,setstartatt2] = useState<Record<string, {anima:boolean, att:number}>>(Object.create(null))
    const time1s = React.createRef<NodeJS.Timeout>()
    const time2s = React.createRef<NodeJS.Timeout>()
    const [attarr,setattarr] = useState<any[]>([])
    const [attarr2,setattarr2] = useState<any[]>([])
    const [index1, setindex1] = useState<number>(0)
    const [index2, setindex2] = useState<number>(0)
    useEffect(()=>{
        return ()=>{
            if (time1s.current) clearTimeout(time1s.current)
            if (time2s.current) clearTimeout(time2s.current)
        }
    },[])

    const menu = [{name:"道友"},{name:"道友"},{name:"道友"},{name:"道友"},{name:"道友"},{name:"道友"},{name:"道友"},{name:"道友"}]
    const [myhr, setmyhr] = useState([
        {name: "关羽", blood:1000, attack: 5222, defense: 10, heals: 0.3, dodge: 0.1}, 
        {name: "张飞", blood:1000, attack: 7884, defense: 10, heals: 0.3, dodge: 0.1},
        {name: "赵云", blood:1000, attack: 62145, defense: 10, heals: 0.3, dodge: 0.1}, 
        {name: "刘备", blood:1000, attack: 1000, defense: 10, heals: 0.3, dodge: 0.1},
        {name: "曹操", blood:1000, attack: 51111, defense: 10, heals: 0.3, dodge: 0.1}, 
        {name: "甄姬", blood:1000, attack: 78466, defense: 10, heals: 0.3, dodge: 0.1}
    ])
    const [ote,setote] = useState([
        {name: "长生", blood:10000, attack: 400, defense: 0, heals: 0.3, dodge: 0.5}, 
        {name: "短命", blood:10000, attack: 400, defense: 0, heals: 0.3, dodge: 0.5},
        {name: "冷血", blood:35544, attack: 400, defense: 0, heals: 0.3, dodge: 0.5}, 
        {name: "追命", blood:35544, attack: 400, defense: 0, heals: 0.3, dodge: 0.5},
        {name: "无情", blood:7887, attack: 400, defense: 0, heals: 0.3, dodge: 0.5}, 
        {name: "铁手", blood:69989, attack: 400, defense: 0, heals: 0.3, dodge: 0.5}
    ])


    const win = useCallback((item:any,item2:any)=>{
        const arr = ote
        if (arr.every(it=>it.blood <= 0)) {
            if (time1s.current) clearInterval(time1s.current)
            return
        }
        const att = item2?.blood - myRandom2((item?.attack - item2?.defense), item2.dodge, item.heals)
        const index = ote.findIndex(v=>v.name == item2?.name)
        arr[index].blood = att
        attarr.push({name: item.name, atts: (myRandom2((item?.attack - item2?.defense), item2.dodge, item.heals)), name2: item2.name})
        // if (att <= 0) {
        //     arr.splice(index,1)
        // }
        setattarr(()=>[...attarr])
        setote(arr)
    },[ote])

    const defeat = useCallback((item:any,item2:any)=>{
        const arr = myhr
        if (arr.every(it=>it.blood <= 0)) {
            if (time1s.current) clearInterval(time1s.current)
            return
        }
        const att = item?.blood - myRandom2((item2?.attack - item?.defense), item.dodge, item2.heals)
        const index = myhr.findIndex(v=>v.name == item?.name)
        arr[index].blood = att
        attarr.push({name: item2.name, atts: myRandom2((item2?.attack - item?.defense), item.dodge, item2.heals), name2: item.name})
        // if (att <= 0) {
        //     arr.splice(index,1)
        // }
        setattarr(()=>[...attarr])
        setmyhr(arr)
    },[myhr])



    const timerB = useCallback(async(time1: number,time2: number)=> {
        console.log('Timer B');
        setstartatt({...startatt, [time1]: {...[time1], anima: false}})
        sleep(1000)
        setstartatt2({...startatt2, [time2]: {...[time2], anima: true}})
        if (ote[index2] != undefined) {
            if (myhr[time1].blood) defeat(myhr[time1],ote[time2])
        }
        if (myhr.every(it=>it.blood <= 0) || ote.every(it=>it.blood <= 0)) {
            if (time1s.current) clearInterval(time1s.current)
            setstartatt(Object.create(null))
            setstartatt2(Object.create(null))
            return
        }
        //@ts-ignore
    },[ myhr,ote, startatt2, time1s.current])

    const timerA = useCallback(async(time1: number,time2: number)=> {
        console.log('Timer A');
        setstartatt({...startatt, [time1]: {...[time1], anima: true}})
        sleep(1000)
        setstartatt2({...startatt2, [time2]: {...[time2], anima: false}})
        if (myhr[index1] != undefined) {
            if (ote[time2].blood) win(myhr[time1], ote[time2])
        }
        if (myhr.every(it=>it.blood <= 0) || ote.every(it=>it.blood <= 0)) {
            if (time1s.current) clearInterval(time1s.current)
            setstartatt(Object.create(null))
            setstartatt2(Object.create(null))
            return
        }
    },[startatt, myhr, ote, time1s.current])

    const onDismissSnackBar = useCallback(async()=>{
        let time1 = 0
        let time2 = 0
        timerA(time1, time2)
        return
        await sleep(1000)
        timerB(time1, time2)
        time1++
        time2++
        return
        //@ts-ignore
        time1s.current = setInterval(async()=>{
            await wait(myhr[time1].blood<=0?()=>{}:timerA, 1000, time1, time2);
            await wait(ote[time2].blood<=0?()=>{}:timerB, 1000, time1, time2);
            time1++
            time2++
            if (time1 > myhr.length-1 || time2 > ote.length-1) {
                time1 = 0
                time2 = 0
            }
            if (myhr.every(it=>it.blood <= 0) || ote.every(it=>it.blood <= 0)) {
                if (time1s.current) clearInterval(time1s.current)
                setstartatt(Object.create(null))
                setstartatt2(Object.create(null))
                return
            }
        },1000)
    },[time1s.current, ote, myhr])


    return <View style={{flex: 1}}>
        <View style={{width: "100%", height: isIPhonex()?56:0, backgroundColor: "red"}} />
        <View style={{flex: 1}}>
            <View style={{width: "100%", borderWidth: 1, borderColor: "#ccc", height: 250, padding: 10}}>
                <View style={{width: "100%", alignItems: "center"}}>
                    <TouchableOpacity>
                        <Text>第1关</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: "row", justifyContent: 'space-between', marginTop: 10, height: 180}}>
                    <View style={{flexWrap: "wrap", justifyContent: "space-between", width: "40%", flexDirection: "row"}}>
                        {
                            myhr.map((it,index)=><View key={index} style={{width: 50, height: 60, position: "absolute", justifyContent: "center", alignItems: "center", 
                            backgroundColor: it.blood <=0? "grey":"green", 
                            top: (index%2 == 0)?index*30:index == 1?0:index == 5?120:(60*(index-2)), left: startatt[index]?.anima?((index%2 == 0)? 120: 0):((index == 0 || index%2 == 0)? 98: 0)}}>
                                <Text> {it.name} </Text>
                                <Text> {it.blood} </Text>
                            </View>)
                        }
                    </View>
                    <View style={{flexWrap: "wrap", justifyContent: "space-between", width: "40%", flexDirection: "row"}}>
                        {
                            ote.map((it,index)=><View key={index} style={{width: 50, height: 60, position: "absolute", justifyContent: "center", alignItems: "center", 
                            backgroundColor: it.blood <=0? "grey":"red", 
                            top: (index%2 == 0)?index*30:index == 1?0:index == 5?120:(60*(index-2)), right: startatt2[index]?.anima?((index%2 == 0)? 120: 0):((index == 0 || index%2 == 0)? 98: 0)}}>
                                <Text> {it.name} </Text>
                                <Text> {it.blood} </Text>
                            </View>)
                        }
                    </View>
                </View>
                <TouchableOpacity onPress={onDismissSnackBar}>
                    <Text>开始挑战</Text>
                </TouchableOpacity>
            </View>
            <View style={{height: 50}}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {
                        menu.map((it,index)=> <TouchableOpacity key={index} style={{paddingHorizontal: 15, backgroundColor: "red", height: 50, justifyContent: "center", marginRight: index+1 == menu.length?0:10}}>
                            <Text>{it.name}</Text>
                        </TouchableOpacity>)
                    }
                </ScrollView>
            </View>
            <View style={{flex: 1}}>
                <ScrollView>
                    {attarr.map((it,index)=> <View key={index}>
                        {it.atts?<Text>{it.name}对{it.name2}造成了{it.atts}伤害</Text>:<Text>{it.name2}闪避了这次伤害</Text>}
                    </View>)}
                    {myhr.every(it=>it.blood <= 0)? <Text style={{color: "red", fontSize: 20}}>你输了</Text>:<></>}
                    {ote.every(it=>it.blood <= 0)? <Text style={{color: "orange", fontSize: 20}}>你赢了</Text>:<></>}
                </ScrollView>
            </View>
        </View>
        <View style={{width: "100%", height: isIPhonex()?30:0, backgroundColor: "red"}} />
    </View>
}

function isIPhonex(){
    const height = Dimensions.get("screen").height
    const platform = Platform.OS
    if (height > 812 && platform == "ios") return true 
    return false
}

function myRandom(att:number, heals: number) {
    var rand = Math.random();
    if (rand < heals) return att * 2;
    return att
}

function myRandom2(att:number, dodge: number, heals: number) {
    var rand = Math.random();
    if (rand <= dodge) return 0;
    return myRandom(att, heals)
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

async function wait(fn:(index: number, index2: number)=> void, delay: number, index: number, index2: number) {
    await fn(index, index2);
    await new Promise(resolve => setTimeout(resolve, delay));
}