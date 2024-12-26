import React, { Suspense } from 'react';
import { DynamicComponentLoaderProps } from './interface';
import { routerMap } from './router';
import { ActivityIndicator, View } from 'react-native';

const loadComponent = <P extends object>(componentName: string): React.ComponentType<P> => {
  return routerMap.get(componentName)!
};

export default function DynamicComponentLoader<P extends object>({componentName, componentProps}: DynamicComponentLoaderProps<P>) {

  // 使用Suspense组件来处理异步加载过程中的等待状态
  return (
    <Suspense fallback={<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ActivityIndicator />
    </View>}>
      {React.createElement(loadComponent<P>(componentName), componentProps)}
    </Suspense>
  );
};