// COMMENTED OUT OLD BOTTOM NAVIGATION CODE
/*
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  MonitorSpeaker,
  User,
  Mic,
  HexagonIcon,
} from 'lucide-react-native';
// import DeviceScreen from '../screens/DeviceScreen';
// import CenterScreen from '../screens/CenterScreen';
// import SettingsScreen from '../screens/SettingsScreen';
// import ProfileScreen from '../screens/ProfileScreen';

// Stack for Home + Question
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import QuestionScreen from '../screens/QuestionScreen';
import FormQuestion from '../screens/FormQuestion';
import MiddleScreen from '../screens/MiddleScreen';
import CongratsScreen from '../screens/CongratsScreen';
import BenefitBlogPage from '../screens/BenefitBlogPage';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const { width } = Dimensions.get('window');

const OUTER_H_GAP = 18;
const OUTER_B_GAP = 18;
const CARD_RADIUS = 20;
const TAB_HEIGHT = 72;
const FLOAT_SIZE = 72;

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Question" component={QuestionScreen} />
      <HomeStack.Screen name="Form" component={FormQuestion} />
      <HomeStack.Screen name="Middle" component={MiddleScreen} />
      <HomeStack.Screen name="Congrats" component={CongratsScreen} />
    </HomeStack.Navigator>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const cardWidth = width - OUTER_H_GAP * 2;

  const d = `
    M0 ${CARD_RADIUS}
    Q0 0 ${CARD_RADIUS} 0
    H${cardWidth / 2 - 120 / 2}
    C${cardWidth / 2 - 120 / 4} 0, ${cardWidth / 2 - 120 / 4} 36, ${
    cardWidth / 2
  } 36
    C${cardWidth / 2 + 120 / 4} 36, ${cardWidth / 2 + 120 / 4} 0, ${
    cardWidth / 2 + 120 / 2
  } 0
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
          {(() => {
            const centerIndex = state.routes.findIndex(
              r => r.name === 'Center',
            );
            const isFocused = state.index === centerIndex;

            return (
              <Mic
                size={28}
                color={isFocused ? '#FFFFFF' : '#7C848D'}
                strokeWidth={2}
              />
            );
          })()}
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
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Device" component={BenefitBlogPage} />
      <Tab.Screen name="Center" component={BenefitBlogPage} />
      <Tab.Screen name="Settings" component={BenefitBlogPage} />
      <Tab.Screen name="Profile" component={BenefitBlogPage} />
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
  },
  fabInner: {
    backgroundColor: '#1A242F',
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});
*/

// NEW BOTTOM NAVIGATION USING REACT NATIVE PAPER & VECTOR ICONS
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import QuestionScreen from '../screens/QuestionScreen';
import FormQuestion from '../screens/FormQuestion';
import MiddleScreen from '../screens/MiddleScreen';
import CongratsScreen from '../screens/CongratsScreen';
import BenefitBlogPage from '../screens/BenefitBlogPage';

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Question" component={QuestionScreen} />
      <HomeStack.Screen name="Form" component={FormQuestion} />
      <HomeStack.Screen name="Middle" component={MiddleScreen} />
      <HomeStack.Screen name="Congrats" component={CongratsScreen} />
    </HomeStack.Navigator>
  );
}

const CustomBottomNavigation = () => {
  const [index, setIndex] = useState(0);
  const PRIMARY_COLOR = '#0F766E';

  const routes = [
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
      component: HomeStackScreen,
    },
    {
      key: 'menu',
      title: 'Menu',
      focusedIcon: 'menu',
      unfocusedIcon: 'menu',
      component: BenefitBlogPage,
    },
    {
      key: 'bag',
      title: 'Bag',
      focusedIcon: 'shopping',
      unfocusedIcon: 'shopping-outline',
      component: BenefitBlogPage,
    },
    {
      key: 'me',
      title: 'Me',
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
      component: BenefitBlogPage,
    },
  ];

  const renderIcon = ({ route, focused, color }) => {
    const iconName = focused ? route.focusedIcon : route.unfocusedIcon;

    return (
      <View style={styles.iconContainer}>
        <MaterialIcon name={iconName} size={24} color={color} />
      </View>
    );
  };

  const renderLabel = ({ route, focused, color }) => {
    return (
      <Text 
        style={[
          styles.tabLabel,
          { 
            color: color,
            fontWeight: focused ? '600' : '400'
          }
        ]}
      >
        {route.title}
      </Text>
    );
  };

  const renderTab = (route, routeIndex) => {
    const isFocused = index === routeIndex;
    const color = isFocused ? PRIMARY_COLOR : '#6B7280';

    return (
      <TouchableOpacity
        key={route.key}
        style={styles.tabItem}
        onPress={() => setIndex(routeIndex)}
        activeOpacity={0.7}
      >
        {renderIcon({ route, focused: isFocused, color })}
        {renderLabel({ route, focused: isFocused, color })}
      </TouchableOpacity>
    );
  };

  const renderScene = () => {
    const currentRoute = routes[index];
    const Component = currentRoute.component;
    return <Component />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {renderScene()}
      </View>
      <View style={styles.bottomNavBar}>
        {routes.map((route, index) => renderTab(route, index))}
      </View>
    </View>
  );
};

export default function AppBottomNavigation() {
  return <CustomBottomNavigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  bottomNavBar: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 60,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});
