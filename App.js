import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  FlatList,
  Image,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Canvas,
  Rect,
  RadialGradient,
  vec
} from "@shopify/react-native-skia";
import { PRODUCT } from './data';
import { View } from 'react-native';

const { width, height } = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.8;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.2;
const SPACING = IMAGE_WIDTH * 0.05;

export default function App() {

  const [product, setProduct] = useState(PRODUCT);
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{

        }}
        style={{

        }}
        data={product}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {

          const inputRange = [
            width * (index - 0.5),
            width * index,
            width * (index + 0.5),
          ]

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5]
          })

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [width * 0.5, 0, -width * 0.5]
          })

          const rotate = scrollX.interpolate({
            inputRange,
            outputRange: ["-15deg", "0deg", "15deg"],
            //extrapolate: 'clamp',
          })

          const BGTranslateX = scrollX.interpolate({
            inputRange,
            outputRange: [width, 0, -width],
            //extrapolate: 'clamp',
          })

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8]
          })

          return (
            <View style={styles.itemContainer}>
              <Animated.View style={{
                position: 'absolute',
                width,
                height,
                backgroundColor: item.bg,
                transform: [
                  {
                    rotate,
                  },
                  {
                    translateX: BGTranslateX,
                  },
                  {
                    scale: 1.3,
                  }
                ]
              }} />
              <Canvas style={{
                width: width,
                height: height,
                position: 'absolute',
              }}>
                <Rect x={0} y={0} width={width} height={height}>
                  <RadialGradient
                    c={vec(width / 2, IMAGE_HEIGHT / 1.2)}
                    r={IMAGE_WIDTH / 1.5}
                    colors={["white", `rgba(255,255,255,0)`]}
                  />
                </Rect>
              </Canvas>
              <View style={styles.imageContainer}>
                <Animated.Image
                  style={[styles.image, {
                    opacity,
                    transform: [
                      { scale, }
                    ]
                  }]}
                  source={{ uri: item.image }}
                />
              </View>
              <Animated.View style={[styles.detailsContainer, {
                opacity,
                transform: [
                  { translateX, }
                ]
              }]}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    {item.title}{`\n`}
                    <Text style={styles.subtitle}>
                      {item.subtitle}
                    </Text>
                  </Text>
                </View>
                <Text style={styles.description}>
                  {item.description}
                </Text>
                <Text style={styles.price}>
                  {item.price}
                </Text>
              </Animated.View>
            </View>
          )
        }}
      />
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  itemContainer: {
    width,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: 'green',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
    //backgroundColor: 'pink',
  },
  detailsContainer: {
    //backgroundColor: 'blue',
    flex: 0.4,
    padding: SPACING,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING,
  },
  title: {
    textAlign: 'center',
    fontSize: 44,
    fontWeight: 'bold',
  },
  subtitle: {
    lineHeight: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: SPACING,
  },
  price: {
    textAlign: 'center',
    fontSize: 44,
    fontWeight: 'bold',
  }
});