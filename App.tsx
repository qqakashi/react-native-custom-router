/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { RouterList, RouterPathParams } from './interface';
import { RouterContext } from './useRouterParams';
import CompRoot from "./comp-root"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { UserService } from './userinfo';

function Router(props: RouterPathParams) {

  const contextValue = useMemo(()=>({
      router: props.routerList, 
      pageParams: props.pageParams, 
      navigate: props.onNavigate, 
      goBack: props.goBack,
      onLoginStatus: props.onLoginStatus
  }),[props.routerList,props.pageParams,props.onNavigate])

  return (
      <RouterContext.Provider value={contextValue}>
          {props.children}
      </RouterContext.Provider>
  );
}


function App() {
  const [routerList, setRouterList] = useState<RouterList[][]>([[{path: "home", element: <CompRoot routeKey="home" />}]])
  const [pageParams, setPageParams] = useState<Record<string, any>>();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const translateY = useSharedValue(30);
  const tabs = [{key: "home", title: "首页"}, {key: "text", title: "文章"}, {key: "like", title: "兴趣"}, {key: "mine", title: "我的"}]

  useEffect(()=>{
    UserService.removeUserToken()
  },[])

  useEffect(()=>{
    if(routerList[tabIndex]?.length<=1){
      translateY.value = withTiming(0, {
        duration: 500,
        easing: Easing.bezier(.02,.54,.34,.97)
      });
    }else{
      translateY.value = withTiming(100, {
        duration: 500,
        easing: Easing.bezier(.02,.54,.34,.97)
      });
    }
  },[routerList, tabIndex])

  /**根据登陆状态执行对路由数组的操作 */
  const loginCallBack = useCallback((val: any)=>{
    setRouterList(prevRouterList=>{
      let newRouterList = [...prevRouterList];
      newRouterList[tabIndex].splice(newRouterList[tabIndex].length-1, 1, { path: val.path, params: val.params, element: <CompRoot routeKey={val.path} />})
      return newRouterList
    })
  },[tabIndex])

  const goBack = useCallback(()=>{
    setRouterList(prevRouterList => {
      const newRouterList = [...prevRouterList];
      newRouterList[tabIndex] = newRouterList[tabIndex].slice(0, -1);
      setPageParams(newRouterList[tabIndex][newRouterList[tabIndex].length - 1]?.params);
      return newRouterList;
    });
  },[tabIndex])

  const tabsChange = useCallback((key: string, index: number)=>{
    const list = routerList;
    if(!list[index]?.length){
      list[index] = [{path: key, element: <CompRoot routeKey={key} />}]
      setRouterList(list)
    }
    setPageParams(list[index][list[tabIndex].length-1]?.params)
    setTabIndex(index)
  },[routerList])

  const onNavigate = useCallback((key: string, params: Record<string, any> = Object.create(null))=>{
    setPageParams(params)
    setRouterList(prevRouterList=>{
      let newRouterList = [...prevRouterList];
      newRouterList[tabIndex] = [...newRouterList[tabIndex], { path: key, params, element: <CompRoot routeKey={key} />}];
      return newRouterList
    })
  },[tabIndex])

  const tabsStyle = useAnimatedStyle(()=>({
    transform: [{
      translateY: translateY.value
    }]
  }))

  return (<View style={{flex: 1}}>
      <Router routerList={routerList} pageParams={pageParams} onNavigate={onNavigate} goBack={goBack} onLoginStatus={loginCallBack}>
        {routerList[tabIndex][routerList[tabIndex].length-1]?.element}
      </Router>
      <Animated.View style={[tabsStyle,{ position: "absolute", bottom: 30, width: "100%", alignItems: "center" }]}>
        <View style={{width: "90%", borderRadius: 25, backgroundColor: "#eee", flexDirection: "row", justifyContent: 'space-evenly'}}>
          {tabs.map((v,i)=><TouchableOpacity key={i} style={{width: 50, height: 50, alignItems: "center", justifyContent: "center"}} onPress={()=>tabsChange(v.key, i)}>
            <Text style={{color: tabIndex==i?"green":"#333"}}>{v.title}</Text>
          </TouchableOpacity>)}
        </View>
      </Animated.View>
    </View>)
}

export default App;
