import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Dimensions, GestureResponderEvent, Image, Keyboard, NativeSyntheticEvent, PanResponder, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import PagerView from "react-native-pager-view"
import { Provider } from "react-native-paper"
import Animated, { Easing, useAnimatedKeyboard, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import Video, { LoadError, OnBufferData, OnProgressData, OnSeekData } from "react-native-video"
import Page from "../page"
import Slider from "@react-native-community/slider"
import { useStateRef } from "../interface"


interface VideoItemProps{
    index: number;
    paused?: boolean;
    uri: string;
    onBuffer?(data: OnBufferData): void;
    onError?(data: LoadError): void;
    onSeek?(data: OnSeekData): void;
    onProgress?(data: OnProgressData): void;
    seek?: {current: string, totel: string, seek: number};
    dz?: boolean;
    onPaused?(index: number): void;
    onDianzhan?(index: number): void;
}

export default function Videos(){
    const [plays, setPlays] = useState<Record<number,boolean>>({"0":true})
    const [dz, setdz] = useState<Record<number,boolean>>(Object.create(null))
    const [seek, setseek] = useState<Record<number,{current: string, totel: string, seek: number}>>(Object.create(null))
    const [list] = useState<string[]>([
      "https://vd4.bdstatic.com/mda-pkv3mbxw969ymswy/720p/h264/1701311769146917741/mda-pkv3mbxw969ymswy.mp4?v_from_s=hkapp-haokan-hnb&auth_key=1701341934-0-0-4baf3638cecf772c5f5fcc01bc0c067c&bcevod_channel=searchbox_feed&cr=2&cd=0&pd=1&pt=3&logid=3534025943&vid=9846471208378635378&klogid=3534025943&abtest=114032_1-114240_1-114675_1",
      "https://vd4.bdstatic.com/mda-pkv4k3qupfickrw6/720p/h264/1701314091541050413/mda-pkv4k3qupfickrw6.mp4?v_from_s=hkapp-haokan-hnb&auth_key=1701341326-0-0-99546859c32dc646765029ed15dcf0fc&bcevod_channel=searchbox_feed&cr=2&cd=0&pd=1&pt=3&logid=2926000649&vid=11373876806183871772&klogid=2926000649&abtest=114032_1-114240_1-114675_1",
      "https://vd4.bdstatic.com/mda-pkv7g7yatb0en2jg/720p/h264/1701321423196871340/mda-pkv7g7yatb0en2jg.mp4?v_from_s=hkapp-haokan-hnb&auth_key=1701341282-0-0-e6cfb693a8064c4b05a41204e4c1ded8&bcevod_channel=searchbox_feed&cr=2&cd=0&pd=1&pt=3&logid=2881979380&vid=9847450126336556252&klogid=2881979380&abtest=114032_1-114240_1-114675_1",
      "https://vd3.bdstatic.com/mda-pfgh0w8iz0e3r09g/sc/cae_h264/1687004274191228607/mda-pfgh0w8iz0e3r09g.mp4?v_from_s=hkapp-haokan-hnb&auth_key=1701340783-0-0-0a7093f68c3f2c755775b582b9d38cc8&bcevod_channel=searchbox_feed&cr=2&cd=0&pd=1&pt=3&logid=2383847148&vid=6534605089486394281&klogid=2383847148&abtest=114032_1-114240_1-114675_1"
    ])


        
    useEffect(()=>{
      return ()=>{
        const p2 = plays
        for(let p in p2){
          p2[p] = false
        }
        console.log(p2);
        setPlays({...p2})
      }
    },[])


    const onError = useCallback(()=>{
  
    },[])
  
    const onBuffer = useCallback(()=>{
  
    },[])
  
    const onSeek = useCallback((data: OnSeekData)=>{
    },[])
  
    const onProgress = useCallback((data: OnProgressData, index:number)=>{
      setseek({...seek, [index]: {...[index], current: formatSecondsToMinutes(data.currentTime), totel: formatSecondsToMinutes(data.seekableDuration) , seek: data.currentTime / data.seekableDuration}})
    },[seek])
  
    const onPageSelected = useCallback((e: NativeSyntheticEvent<Readonly<{
      position: number;
    }>>)=>{
      for(let p in plays){
        plays[p] = false
      }
      plays[e.nativeEvent.position] = true
      setPlays({...plays})
    },[plays])
  
    const paused = useCallback((index:number)=>{
      setPlays({...plays, [index]: !plays[index]})
    },[plays])
  
    const dianzhan = useCallback((index:number)=>{
      setdz({...dz, [index]: !dz[index]})
    },[dz])
  
    return (<Page title="看视频">
        <Provider>
            <PagerView style={{flex: 1}} initialPage={0} orientation="vertical" onPageSelected={onPageSelected}>
              {list.map((it,index)=> <VideoItem key={index}
                index={index} 
                uri={it} 
                paused={plays[index]} 
                seek={seek[index]}
                onSeek={onSeek}
                dz={dz[index]}
                onPaused={paused}
                onDianzhan={dianzhan}
                onProgress={e=>onProgress(e, index)} 
              />)}
            </PagerView>
        </Provider>
    </Page>)
}

function VideoItem(props: VideoItemProps){
    const [open,setopen] = useState<boolean>(false);
    const keyboard2 = useAnimatedKeyboard();
    const videoPlayer = useRef<Video>(null);

    const panResponder = useMemo(()=>
      PanResponder.create({
        // 要求成为响应者：
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
  
        onPanResponderGrant: (evt, gestureState) => {
          // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
          // gestureState.d{x,y} 现在会被设置为0
        },
        onPanResponderMove: (evt, gestureState) => {
          videoPlayer.current?.seek(convertTimeToSeconds(props.seek?.current!)+gestureState.dx)
          // 最近一次的移动距离为gestureState.move{X,Y}
          // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        },
        onPanResponderTerminationRequest: (evt, gestureState) =>
          true,
        onPanResponderRelease: (evt, gestureState) => {
          // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
          // 一般来说这意味着一个手势操作已经成功完成。
        },
        onPanResponderTerminate: (evt, gestureState) => {
          // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
          // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
          // 默认返回true。目前暂时只支持android。
          return true;
        },
    }),[props.seek])

    const openKeyBoard = useCallback(()=>{
      setopen(true)
    },[])

    const closeKeyBoard = useCallback(()=>{
      setopen(false)
    },[])

    const stl = useAnimatedStyle(() => ({ transform: [{ translateY: -keyboard2.height.value}] }))
  
    return (<ScrollView key={props.index+""} style={{backgroundColor: "black", height: Dimensions.get("screen").height}} contentContainerStyle={{flex: 1, justifyContent: "center"}}>
        <Video ref={videoPlayer} source={{uri: props.uri}} paused={props.paused?false:true} style={{width: "100%", height:"70%"}} repeat
          onBuffer={props.onBuffer} 
          onError={props.onError}
          onSeek={props.onSeek}
          onProgress={props.onProgress}
          playInBackground={false}
          resizeMode="contain" />
          <View {...panResponder.panHandlers} style={{width: "100%", backgroundColor: "grey", height: 2.5}}>
            <View style={{width: props.seek?`${props.seek.seek*100}%`:"0%", height: 2.5, position: "absolute", top: 0, backgroundColor: "white", justifyContent: "center", alignItems: "flex-end" }}>
              <TouchableOpacity style={{width: 5, height: 5, backgroundColor: "white", borderRadius: 10 }} />
            </View>
          </View>
        <Text style={{color: "white", marginTop: 7, textAlign: "right"}}>{props.seek?.current + " / "+ props.seek?.totel}</Text>
        <TouchableOpacity style={{position: "absolute", top: 0, left: 0, bottom: 0, right: 0, justifyContent: "center", alignItems: "center", height: "70%"}} onPress={()=>props.onPaused?.(props.index)} activeOpacity={1}>
          {!props.paused?<Image source={require("../image/bofang.png")} style={{width: 70, height: 70, opacity: .6}} />:<></>}
        </TouchableOpacity>
        <View style={{position: "absolute", right: 7, bottom: Dimensions.get("screen").height / 3, width: 40, height: 150, alignItems: 'center'}}>
          <TouchableOpacity style={{paddingVertical: 15}} onPress={()=>{props.onDianzhan?.(props.index)}}>
            <Image source={props.dz?require("../image/dianzan.png"):require("../image/dianzan2.png")} style={{width: 32, height: 32}} />
            <Text style={styles.actbtn}>点赞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingVertical: 15}}>
            <Image source={require("../image/pinglun.png")} style={{width: 32, height: 32}} />
            <Text style={styles.actbtn}>评论</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingVertical: 15}}>
            <Image source={require("../image/fenxiang.png")} style={{width: 32, height: 32}} />
            <Text style={styles.actbtn}>分享</Text>
          </TouchableOpacity>
        </View>
        <View style={{position: "absolute", bottom: 80, width: "100%", left: 0, height: 10, alignItems: "center"}}>
          <TouchableOpacity onPress={openKeyBoard} style={{width: "95%", height: 40, backgroundColor: "rgba(255,255,255,.3)", borderRadius: 10, justifyContent: "center" }}>
            <Text style={{color: "#ddd", fontSize: 16, marginLeft: 10}}>输入评论</Text>
          </TouchableOpacity>
        </View>
        {open?<Animated.View style={[stl,{position: "absolute", width: "100%", bottom: 0, backgroundColor: "#fff"}]}>
          <TextInput autoFocus placeholder="期待你的评论" style={{height: 50, paddingLeft: 10}} onBlur={closeKeyBoard} />
        </Animated.View>:<></>}
      </ScrollView>)
}

function formatSecondsToMinutes(seconds: number) {
    if (isNaN(seconds) || seconds < 0) {
      return "Invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes>=10?minutes:"0"+minutes}:${remainingSeconds>=10?remainingSeconds:"0"+remainingSeconds}`;
  }

  const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    actbtn:{
      color: "white",
      fontSize: 16, 
      fontWeight: "600"
    },
    highlight: {
      fontWeight: '700',
    },
  });

  const convertTimeToSeconds = (timeStr:string) => {
    const [minutes, seconds] = timeStr?.split(":").map(Number); // 分割字符串并转换为数字
    if (isNaN(minutes) || isNaN(seconds)) {
      throw new Error("输入的时间格式无效");
    }
    return minutes * 60 + seconds; // 转换为总秒数
  };
  