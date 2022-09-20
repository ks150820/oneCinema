import React, {useState, useLayoutEffect, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TouchableNativeFeedback,
  Linking,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import FeaturedMovies from '../Components/FeaturedMovies';
import OTTHeaderImages from '../Components/OTTHeaderImages';
import PushNotification from 'react-native-push-notification';
import YouTube from 'react-native-youtube';
import Quickly from '../Components/Quickly';

const Home = ({navigation}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoId, setVideoId] = useState();

  const getLabelTitle = useSelector(state => state.title.title);

  useLayoutEffect(
    () =>
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.headerOtt}
            onPress={() => {
              navigation.navigate('OTT');
            }}>
            <Icon name="add" size={24} color="#fff" />
            <View>
              <Text style={{color: '#fff', fontSize: 12}}>OTT</Text>
            </View>
          </TouchableOpacity>
        ),
        headerTitle: () => (
          <View
            style={{
              width: 100,
              height: 50,
              marginRight: 10,
            }}>
            <Image
              source={require('../assets/splashVideo/hlogo.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </View>
        ),
      }),
    [],
  );

  PushNotification.configure({
    // onRegister: function (token) {
    //   console.log('TOKEN:', token);
    // },

    onNotification: function (notification) {
      // console.log('NOTIFICATION:', notification);

      if (notification.data.type) {
        // alert(notification.data.type);
        console.log(notification.data.type);
        navigation.navigate('Movie Detail', {
          movieId: notification.data.type,
        });
      } else {
        console.log('Notification Else block');
      }

      PushNotification.cancelAllLocalNotifications();
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,

    requestPermissions: true,
  });

  useEffect(() => {
    const getUrl = async () => {
      const initialUrl = await Linking.getInitialURL();

      if (initialUrl === null) {
        return;
      }

      if (initialUrl.includes('Details')) {
        const lastItem = initialUrl.substring(initialUrl.lastIndexOf('/') + 1);
        navigation.navigate('Movie Detail', {movieId: lastItem});
      }
    };

    return getUrl();
  }, []);

  useEffect(() => {
    navigation.addListener('beforeRemove', () => BackHandler.exitApp());
  }, []);

  const handleBottomSheet = item => {
    navigation.navigate('Ott Specific Screen', {
      item: item.label,
      image: item.image,
      state: getLabelTitle,
    });
  };

  const handlePlaying = id => {
    setIsPlaying(true);
    setVideoId(id);
  };

  const handleISFullScreen = e => {
    setIsPlaying(e.isFullscreen);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      {isPlaying && (
        <View style={styles.youtube}>
          <YouTube
            videoId={videoId}
            play
            fullscreen
            loop
            onChangeFullscreen={e => handleISFullScreen(e)}
            apiKey="AIzaSyDzMhrZykvex83wQiWlDlG2GVaoUkoE4qk"
            style={{
              alignSelf: 'stretch',
              height: 300,
            }}
          />
        </View>
      )}
      <OTTHeaderImages
        OpenBottomSheet={handleBottomSheet}
        navigation={navigation}
      />
      <TouchableNativeFeedback onPress={() => navigation.navigate('SearchBar')}>
        <View style={styles.SearchboxContainer}>
          <Text style={{color: 'gray'}}>Search Movies</Text>
          <Icon name="search" size={25} />
        </View>
      </TouchableNativeFeedback>
      <View>
        <FeaturedMovies navigation={navigation} />
      </View>

      {getLabelTitle.map((item, index) => (
        <View key={index}>
          <Quickly
            navigation={navigation}
            headingTitle={item.titleId}
            index={index}
            handlePlaying={handlePlaying}
            titleName={item.titleName}
            titleId={item.titleId}
            genres={item.genres}
            titletype={item.titletype}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  SearchboxContainer: {
    marginVertical: 20,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
  },
  headerOtt: {
    flexDirection: 'row',
    marginRight: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 3,
    borderWidth: 2,
    borderColor: '#193549',
    borderRadius: 10,
    paddingRight: 6,
  },
  image: {
    width: 150,
    height: 220,
    overflow: 'hidden',
    borderRadius: 5,
  },
  youtube: {
    position: 'absolute',
    top: 0,
  },
});

export default Home;

// youtube api key - AIzaSyCmC2w2eMCYsg61k8wTmQXOplb3ephYGB0
// {exeData.length === 0 ? (
//   <Skeleton />
// ) : (
//   <ScrollView horizontal>
//     {exeData.map((data, index) => {
//       if (data.titleId === item.titleId) {
//         return (
//           <View key={index}>
//             <MoviePosterLayout
//               navigation={navigation}
//               image={data.image}
//               age={data.age}
//               Key={data.Key}
//               data={data}
//               OTTlogo={data.OTTlogo}
//               lang={data.lang}
//               title={data.title}
//               runtime={data.runtime}
//               ratings={data.ratings}
//               nav="Movie Detail"
//             />
//           </View>
//         );
//       }
//     })}
//   </ScrollView>
// )}
