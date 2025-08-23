import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const D =
  'M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function InfinityLoader() {
  const prog = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(prog, {
        toValue: 1,
        duration: 2500, // quicker for “spinner” feel
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [prog]);

  // Short dash segment that circles around
  const dashOffset = prog.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -480], // longer offset = full lap
  });

  return (
    <View style={styles.wrap}>
      <Svg
        viewBox="0 0 187.3 93.7"
        width={65} // was 64
        height={29} // was 28
        preserveAspectRatio="xMidYMid meet"
      >
        {/* faint track */}
        <Path
          d={D}
          stroke="#0ea5a0"
          strokeWidth={11} // was 10
          opacity={0.08}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* inner soft track */}
        <Path
          d={D}
          stroke="#60A5FA"
          strokeWidth={7} // was 6
          opacity={0.08}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* moving blue arc */}
        <AnimatedPath
          d={D}
          stroke="#3B82F6"
          strokeWidth={7} // was 6
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="32 380"
          strokeDashoffset={dashOffset}
        />
      </Svg>

      <Text style={styles.label}>Activating AI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '800', // bolder like screenshot
    color: '#0b1220', // near-black
  },
});
