/* eslint-disable react-native/no-inline-styles */
import { ActivityIndicator, Animated, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useRef, useState } from 'react'

const {height,width}=Dimensions.get('screen');
const API_URL="https://picsum.photos/v2/list";
const IMAGE_SIZE=80;
const SPACING=10;

type ImageItem={
    id:string,
    dowload_url:string,
    author:string,
}

const fetchImageFromPixels=async():Promise<ImageItem[]>=>{
    const response=await fetch(API_URL);
    if(response.ok){
        return response.json();
    }
    throw new Error("Failed to Fetch Images")
}
const GalleryView = (props: Props) => {

    const [images,setImages]=useState<ImageItem[]>([]);
    const [loading,setLoading]=useState(true);
    const [activeIndex,setActiveIndex]=useState(0);
    const topRef=useRef<FlatList>(null)
    const thumbRef=useRef<FlatList>(null)
    useEffect(()=>{
        const fetchImages=async()=>{
            try {
                const fetchedImages=await fetchImageFromPixels();
                setImages(fetchedImages);
            } catch (error) {
                console.log("Error-->",error);
                
            }finally{
                setLoading(false)
            }
        };
        fetchImages();
    },[])

    console.log('Images-->',images);
    const scorllToActiveIndex=(index:number)=>{
        setActiveIndex(index);
        topRef?.current?.scrollToOffset({
            offset:index*width,
            animated:true,
        });
        if(index*(IMAGE_SIZE+SPACING)-IMAGE_SIZE/2>width/2){
            thumbRef?.current?.scrollToOffset({
                offset:index*(IMAGE_SIZE+SPACING)-width/2+IMAGE_SIZE/2,
                animated:true,

            })
        }else{
            thumbRef?.current?.scrollToOffset({
                offset:0,
                animated:true,
            })
        }
    }
    if(loading){
        return(
            <View style={styles.center}>
                <ActivityIndicator size={'large'} color={'white'}/>
            </View>
        );
    }
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
     <View style={styles.container}>
        <FlatList
        ref={topRef}
        data={images}
        keyExtractor={(item)=>item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={ev=>
            scorllToActiveIndex(
                Math.floor(ev.nativeEvent.contentOffset.x/width)
            )
        }
        renderItem={({item})=>(
          //console.log(item.author)
          <ImageWithAnimation
          uri={item.download_url}
          author={item.author}
          activeIndex={activeIndex}
          />
        )}
        />
        <FlatList
        ref={thumbRef}
        data={images}
        keyExtractor={(item)=>item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.thumbnailContainer}
        contentContainerStyle={styles.thumbnailContent}
        renderItem={({item,index})=>(
          //console.log(item.author)
          <ThumbnailWithAnimation
          uri={item.download_url}
          isActive={activeIndex===index}
          onPress={()=>scorllToActiveIndex(index)}
          />
        )}
        />

     </View>
    </View>
  )
};
const ThumbnailWithAnimation:FC<{
    uri:string,
    isActive:boolean,
    onPress:()=>void;
}>=({isActive,onPress,uri})=>{

    const opacity=useRef(new Animated.Value(0)).current;
    useEffect(()=>{
        Animated.timing(opacity,{
            toValue:1,
            duration:300,
            useNativeDriver:true,
        }).start();
    })
    return(
        <TouchableOpacity
        onPress={onPress}
        >
            <Animated.Image
            source={{uri}}
            style={[styles.thumbnail,{
                borderColor:isActive?'white':'transparent',
            }]}
            />
        </TouchableOpacity>
    )

}

const ImageWithAnimation:FC<({uri:string;
    author:string;
    activeIndex:number;
})>=({activeIndex,author,uri})=>{

    const opacity=useRef(new Animated.Value(0)).current;
    const translateY=useRef(new Animated.Value(0)).current;
    const [prevIndex,setPrevIndex]=useState(activeIndex);
    useEffect(()=>{
        if(prevIndex !==activeIndex){
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(opacity,{
                        toValue:0,
                        duration:200,
                        useNativeDriver:true,
                    }),
                    Animated.timing(translateY,{
                        toValue:0,
                        duration:200,
                        useNativeDriver:true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(opacity,{
                        toValue:1,
                        duration:500,
                        useNativeDriver:true,
                    }),
                    Animated.timing(translateY,{
                        toValue:0,
                        duration:500,
                        useNativeDriver:true,
                    }),
                ]),
            ]).start();

        }
    });
    return(
        <View style={{width,height ,backgroundColor:'red'}}>
            <Image
            source={{uri}}
            style={StyleSheet.absoluteFillObject}
            />
            <Animated.View
            style={{
                position:'absolute',
                bottom:50,
                width:'100%',
                alignItems:'center',
                paddingBottom:40,
                opacity,
                transform:[{translateY}],
            }}
            >
                <Text style={styles.authorText}>{author}</Text>
            </Animated.View>

        </View>
    )
}
export default GalleryView

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'black',
    },
    center:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'black',
    },
    authorText:{
        color:'white',
        fontSize:16,
        fontWeight:'bold',
        textAlign:'center',
    },
    thumbnailContent:{
       paddingHorizontal:SPACING,
    },
    thumbnail:{
        width:IMAGE_SIZE,
        height:IMAGE_SIZE,
        borderRadius:12,
        marginRight:SPACING,
        borderWidth:2,


    },
    thumbnailContainer:{
        position:'absolute',
        bottom:IMAGE_SIZE,
    }
})