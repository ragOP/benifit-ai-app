import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  MonitorSpeaker,
  User,
  Mic,
  HexagonIcon,
} from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';

function DeviceScreen() {
  return <View style={{ flex: 1, backgroundColor: '#222' }} />;
}
function CenterScreen() {
  return <View style={{ flex: 1, backgroundColor: 'red' }} />;
}
function SettingsScreen() {
  return <View style={{ flex: 1, backgroundColor: '#444' }} />;
}
function ProfileScreen() {
  return <View style={{ flex: 1, backgroundColor: '#555' }} />;
}

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const OUTER_H_GAP = 18;
const OUTER_B_GAP = 18;
const CARD_RADIUS = 20;
const TAB_HEIGHT = 72;
const FLOAT_SIZE = 72;

const TABS = [
  { icon: Home },
  { icon: MonitorSpeaker },
  { icon: HexagonIcon },
  { icon: User },
];

function CustomTabBar({ state, descriptors, navigation }) {
  const [active, setActive] = useState(0);

  const cardWidth = width - OUTER_H_GAP * 2;
  const notchWidth = 120;
  const notchDepth = 36;
  const d = `
    M0 ${CARD_RADIUS}
    Q0 0 ${CARD_RADIUS} 0
    H${cardWidth / 2 - notchWidth / 2}
    C${cardWidth / 2 - notchWidth / 4} 0, ${
    cardWidth / 2 - notchWidth / 4
  } ${notchDepth}, ${cardWidth / 2} ${notchDepth}
    C${cardWidth / 2 + notchWidth / 4} ${notchDepth}, ${
    cardWidth / 2 + notchWidth / 4
  } 0, ${cardWidth / 2 + notchWidth / 2} 0
    H${cardWidth - CARD_RADIUS}
    Q${cardWidth} 0 ${cardWidth} ${CARD_RADIUS}
    V${TAB_HEIGHT - CARD_RADIUS}
    Q${cardWidth} ${TAB_HEIGHT} ${cardWidth - CARD_RADIUS} ${TAB_HEIGHT}
    H${CARD_RADIUS}
    Q0 ${TAB_HEIGHT} 0 ${TAB_HEIGHT - CARD_RADIUS}
    Z
  `;

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.cardWrap,
          { marginHorizontal: OUTER_H_GAP, marginBottom: OUTER_B_GAP },
        ]}
      >
        <Svg
          width={cardWidth}
          height={TAB_HEIGHT}
          style={StyleSheet.absoluteFill}
          viewBox={`0 0 ${cardWidth} ${TAB_HEIGHT}`}
        >
          <Path d={d} fill="#22282f" />
        </Svg>

        <View style={styles.tabsRow}>
          {state.routes.map((route, index) => {
            if (route.name === 'Center') {
              return <View key={route.key} style={{ width: FLOAT_SIZE }} />;
            }

            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            let Icon = Home;
            if (route.name === 'Home') Icon = Home;
            if (route.name === 'Device') Icon = MonitorSpeaker;
            if (route.name === 'Settings') Icon = HexagonIcon;
            if (route.name === 'Profile') Icon = User;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={[
                  styles.tabBtn,
                  route.name === 'Device' && {
                    marginRight: FLOAT_SIZE / 2 - 60,
                  },
                  route.name === 'Settings' && {
                    marginLeft: FLOAT_SIZE / 2 - 60,
                  },
                ]}
              >
                <Icon
                  size={26}
                  color={isFocused ? '#FFFFFF' : '#7C848D'}
                  strokeWidth={1.8}
                />
                {isFocused && <View style={styles.activeBar} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.fab,
          {
            left: width / 2 - FLOAT_SIZE / 2,
            bottom: TAB_HEIGHT + OUTER_B_GAP - FLOAT_SIZE / 2 + 8,
          },
        ]}
        onPress={() => navigation.navigate('Center')}
      >
        <View style={styles.fabInner}>
          <Mic size={28} color="#0B0E12" strokeWidth={2} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Device" component={DeviceScreen} />
      <Tab.Screen name="Center" component={CenterScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cardWrap: {
    height: TAB_HEIGHT,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: TAB_HEIGHT,
    paddingHorizontal: 32,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBar: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#A8FF4B',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    width: FLOAT_SIZE,
    height: FLOAT_SIZE,
    borderRadius: FLOAT_SIZE / 2,
    backgroundColor: '#9eca30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  fabInner: {
    width: FLOAT_SIZE - 14,
    height: FLOAT_SIZE - 14,
    borderRadius: (FLOAT_SIZE - 14) / 2,
    backgroundColor: '#9eca30',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
