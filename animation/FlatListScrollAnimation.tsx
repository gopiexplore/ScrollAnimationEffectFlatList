/* eslint-disable react-native/no-inline-styles */
import { View, Text,  Image, StatusBar, StyleSheet, ImageBackground, Animated } from 'react-native'
import React from 'react'

type Props = {}
import { faker } from '@faker-js/faker';

faker.seed(10);

const DATA=[...Array(30).keys()].map((_,i)=>{
  return{
    _id: faker.string.uuid(),
    avatar: faker.image.url(),
    jobTitle: faker.person.jobTitle().length>10? faker.person.jobTitle().slice(0,20):faker.person.jobTitle(),
    email: faker.internet.email(),
    name: faker.person.fullName().length>10?faker.person.fullName().slice(0,15):faker.person.fullName(),
  };
});
const SPACING=20;
const AVATAR_SIZE=70;
const ITEM_SIZE=AVATAR_SIZE+SPACING*3;
console.log(DATA);

const FlatListScrollAnimation = (props: Props) => {
  const scrollY=React.useRef(new Animated.Value(0)).current;
  return (
    <>
    <StatusBar
    backgroundColor={"pink"}
    translucent
    />
    <View style={{flex:1,backgroundColor:'#fff'}}>
      <ImageBackground
      source={require('../animation/11567.jpg')}
      style={StyleSheet.absoluteFillObject}
      blurRadius={90}
      />
      <Animated.FlatList
      data={DATA}
      onScroll={Animated.event(
        [{nativeEvent:{contentOffset:{y:scrollY}}}],
        {useNativeDriver:true}
      )}
      keyExtractor={item=>item._id}
      contentContainerStyle={{
        padding:SPACING,
        paddingTop:StatusBar.currentHeight || 42,
      }}
      renderItem={({item,index})=>{
        const inputRange=[
          -1,
          0,
          ITEM_SIZE*index,
          ITEM_SIZE*(index+2),
        ]
        const opacityInputRange=[
          -1,
          0,
          ITEM_SIZE*index,
          ITEM_SIZE*(index+.5),
        ]
        const scale=scrollY.interpolate({
          inputRange,
          outputRange:[1,1,1,0]
        })
        const opacity=scrollY.interpolate({
          inputRange:opacityInputRange,
          outputRange:[1,1,1,0]
        })
        return <Animated.View style={{flexDirection:'row',padding:SPACING,marginBottom:SPACING,borderRadius:16,backgroundColor:'rgba(255,255,255,.9)',
          shadowColor:'#000',
          shadowOffset:{
            width:0,
            height:10,
          },
          shadowOpacity:0.3,
          shadowRadius:20,
          opacity,
          transform:[{scale}]
        }}>
          <Image
          source={{uri:item.avatar}}
          style={{
            width:AVATAR_SIZE,
            height:AVATAR_SIZE,
            borderRadius:AVATAR_SIZE,
            marginRight:SPACING,
          }}
          />
          <View>
            <Text style={{fontSize:22,fontWeight:'700'}}>{item.name}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:18,opacity:.7}}  >{item.jobTitle}</Text>
            <Text style={{fontSize:12,opacity:.8,color:'#0099cc'}}>{item.email}</Text>
           
          </View>


          </Animated.View>
      }}
      />
    </View>
    
    
    </>
    
  )
}

export default FlatListScrollAnimation