import React from 'react';
import {Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from '../screens/home';
import StudioWiseMoviesScreen from '../screens/StudioWiseMoviesScreen';
import Profile from '../screens/profile';
import OTTPlatformDetails from '../screens/OTTPlatformDetails';
import SearchBarScreen from '../screens/SearchBarScreen';
import TimelineScreen from '../screens/TimelineScreen';
import AllMoviesScreen from '../screens/AllMoviesScreen';
import OttSpecificScreen from '../screens/OttSpecificScreen';
import MovieDetail from '../screens/MovieDetail';
import YouMayAlsoLikeIt from '../screens/YouMayLikeItScreen';
import DirectorsScreen from '../screens/DirectorsScreen';
import ActorsDetailScreen from '../screens/ActorsDetailScreen';
import MoviesScreen from '../screens/MoviesScreen';
import GenresMoviesScreen from '../screens/GenresMoviesScreen';
import TrailorScreen from '../screens/TrailorScreen';
import SearchBarModal from '../screens/SearchbarModal';
import ActorsMovieDetailScreen from '../screens/ActorsMovieDetailScreen';
import SplashScreen from '../screens/SplashScreen';
import KidsScreen from '../screens/KidsScreen';
import ViewAllScreen from '../screens/ViewAllScreen';
import TabMovieDetailScreen from '../screens/TabMovieDetailScreen';
import ProducedByScreen from '../screens/ProducedByScreen';
import ShortsTab from '../screens/ShortsTab';

const Tab = createMaterialBottomTabNavigator();
const stack = createStackNavigator();
const stackNav = createStackNavigator();
const profileStackNav = createStackNavigator();
const TimeLineStackNav = createStackNavigator();

const ProfileStack = () => {
  return (
    <profileStackNav.Navigator>
      <profileStackNav.Screen
        name="profile"
        component={Profile}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#fff',
        }}
      />
    </profileStackNav.Navigator>
  );
};

const TimeLineStack = () => {
  return (
    <TimeLineStackNav.Navigator>
      <TimeLineStackNav.Screen
        name="TimeLine"
        component={TimelineScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#fff',
          headerLeft: null,
        }}
      />
    </TimeLineStackNav.Navigator>
  );
};

const defaultOptions = {
  headerShown: true,
  headerStyle: {backgroundColor: 'black'},
  headerTintColor: '#fff',
};

const stackNavigator = () => {
  return (
    <stackNav.Navigator>
      <stackNav.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#fff',
          headerLeft: null,
        }}
      />
      <stackNav.Screen
        name="Movie Detail"
        component={MovieDetail}
        options={{
          headerShown: false,
        }}
      />
      <stackNav.Screen
        name="Studio"
        component={StudioWiseMoviesScreen}
        options={defaultOptions}
      />
      <stackNav.Screen
        name="OTT"
        component={OTTPlatformDetails}
        options={defaultOptions}
      />
      <stackNav.Screen
        name="All Movies"
        component={AllMoviesScreen}
        options={defaultOptions}
      />
      <stackNav.Screen
        name="Ott Specific Screen"
        component={OttSpecificScreen}
        options={defaultOptions}
      />

      <stackNav.Screen
        name="ViewAll"
        component={ViewAllScreen}
        options={defaultOptions}
      />
      <stackNav.Screen
        name="ActorDetail"
        component={ActorsMovieDetailScreen}
        options={{headerShown: false}}
      />
      <stackNav.Screen
        name="youMayLikeIt"
        component={YouMayAlsoLikeIt}
        options={{headerShown: false}}
      />
      <stackNav.Screen
        name="Director"
        component={DirectorsScreen}
        options={{
          headerShown: false,
        }}
      />
      <stackNav.Screen
        name="Actor"
        component={ActorsDetailScreen}
        options={{
          headerShown: false,
          headerTintColor: '#fff',
          headerTitle: null,
        }}
      />
      <stackNav.Screen
        name="LMovies"
        component={MoviesScreen}
        options={defaultOptions}
      />
      <stackNav.Screen
        name="GMovies"
        component={GenresMoviesScreen}
        options={defaultOptions}
      />
      <stackNav.Screen
        name="Produce Movies"
        component={ProducedByScreen}
        options={defaultOptions}
      />
      <stackNav.Screen
        name="Trailors"
        component={TrailorScreen}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: 'black'},
          headerTintColor: '#fff',
          headerTitle: "Trailor's & Critics",
        }}
      />
    </stackNav.Navigator>
  );
};

const kidsStack = createStackNavigator();

const kidNav = () => {
  return (
    <kidsStack.Navigator>
      <kidsStack.Screen
        name="kid"
        component={KidsScreen}
        options={{
          headerShown: false,
        }}
      />
      <kidsStack.Screen
        name="Kid Detail"
        component={TabMovieDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </kidsStack.Navigator>
  );
};

const ShortsStack = createStackNavigator();

const ShortsTabStack = () => {
  return (
    <ShortsStack.Navigator>
      <ShortsStack.Screen
        name="Short Movies"
        component={ShortsTab}
        options={{headerShown: false}}
      />
    </ShortsStack.Navigator>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRoute="Home"
      inactiveColor="#dedede"
      barStyle={{
        backgroundColor: '#193459',
      }}>
      <Tab.Screen
        name="Home"
        component={stackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <Icon name="ios-home" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Shorts"
        component={ShortsTabStack}
        options={{
          tabBarLabel: 'Shorts',
          tabBarIcon: ({color}) => <Icon name="play" color={color} size={25} />,
        }}
      />
      <Tab.Screen
        name="Kids"
        component={kidNav}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <Image
              source={require('../assets/icons/minimum-age.png')}
              style={{width: 45, height: 30}}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <Icon name="ios-bookmarks" color={color} size={25} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="TimeLine"
        component={TimeLineStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="clock-outline"
              color={color}
              size={25}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNAvigator = () => {
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen
          name="splash"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
        <stack.Screen
          name="Home"
          component={HomeTabs}
          options={{
            headerShown: false,
            headerLeft: false,
          }}
        />
        <stack.Screen
          name="SearchBar"
          component={SearchBarScreen}
          options={{
            headerShown: false,
          }}
        />
        <stack.Screen
          name="SearchModal"
          component={SearchBarModal}
          options={{headerShown: false, tabBarVisible: false}}
        />
      </stack.Navigator>
    </NavigationContainer>
  );
};
