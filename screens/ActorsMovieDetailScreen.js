import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import YouTube from 'react-native-youtube';
import MovieDetailComponent from '../Components/MovieDetailComponent';

const {width, height} = Dimensions.get('window');

const ActorsMovieDetailScreen = ({navigation, route}) => {
  const [partiularMovie, setParticularMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMovieId = route.params ? route.params.movieId : null;

  const [androidId, setAndroidId] = useState();
  const [videoId, setVideoId] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayLoad, setIsPlayLoad] = useState(false);

  useEffect(() => {
    DeviceInfo.getAndroidId().then((id) => {
      setAndroidId(id);
    });
  }, [DeviceInfo]);

  useLayoutEffect(() => {
    firestore()
      .collection('BTotalMovies')
      .where('Key', '==', getMovieId)
      .get()
      .then((data) => {
        const total = [];
        data.docs.forEach((doc) => {
          total.push({
            ...doc.data(),
            keyId: doc.id,
          });
        });

        setParticularMovie(total);
        setIsLoading(false);
        //console.log('particular movie = ', total);
      });
  }, [firestore]);

  const handlePlaying = (id) => {
    setIsPlayLoad(true);
    setIsPlaying(true);
    setVideoId(id);
    setIsPlayLoad(false);
  };

  const handleISFullScreen = (e) => {
    setIsPlaying(e.isFullscreen);
  };

  const renderItem = ({item, index}) => {
    return (
      <MovieDetailComponent
        image={item.image}
        navigation={navigation}
        trailer={item.trailer}
        critics={item.critics}
        keyId={item.keyId}
        isSeen={item.isSeen}
        isLike={item.isLike}
        isDisLike={item.isDisLike}
        title={item.title}
        year={item.year}
        age={item.age}
        runtime={item.runtime}
        ratings={item.ratings}
        genres={item.genres}
        lang={item.lang}
        description={item.description}
        OTTlogo={item.OTTlogo}
        directors={item.directors}
        stars={item.stars}
        handlePlaying={handlePlaying}
        Key={item.Key}
        item={item}
      />
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}>
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isPlaying && (
        <View style={styles.youtube}>
          <YouTube
            videoId={videoId}
            play
            fullscreen
            loop
            onChangeFullscreen={(e) => handleISFullScreen(e)}
            apiKey="AIzaSyCmC2w2eMCYsg61k8wTmQXOplb3ephYGB0"
            style={{
              alignSelf: 'stretch',
              height: 300,
            }}
          />
        </View>
      )}
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={partiularMovie}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ActorsMovieDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202123',
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    resizeMode: 'stretch',
    opacity: 0.5,
  },
  ratingNumber: {fontFamily: 'Menlo', fontSize: 7},
  rating: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 4,
  },
  forAllContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  Genres: {
    marginTop: 5,
  },
  trailorPortion: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    padding: 8,
    borderRadius: 20 / 2,
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 80,
  },
  GoBack: {
    backgroundColor: '#ffba00',
    padding: 5,
    borderRadius: 40,
    position: 'absolute',
    zIndex: 999,
    left: 8,
    top: 45,
  },
  search: {
    backgroundColor: '#ffba00',
    padding: 5,
    borderRadius: 40,
    position: 'absolute',
    zIndex: 999,
    right: 10,
    top: 43,
  },
  headerImage: {
    width: width,
    height: 300,
    overflow: 'hidden',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bookmarkIcon: {
    backgroundColor: '#fff',
    borderRadius: 40 / 2,
    padding: 5,
    width: 40,
    alignItems: 'center',
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  backImage: {
    width: 190,
    height: 140,
    margin: 10,
    padding: 10,
    justifyContent: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
  },
  youtube: {
    position: 'absolute',
    top: 0,
  },
});

{
  /* <View
        style={{
          padding: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <RNBounceable>
          <Icon name="bookmark-outline" color="#fff" size={25} />
        </RNBounceable>
        <RNBounceable>
          <Icon name="eye-off" color="#fff" size={25} />
        </RNBounceable>
        <RNBounceable>
          <AntIcon name="like2" color="#fff" size={25} />
        </RNBounceable>
        <RNBounceable>
          <AntIcon name="dislike2" color="#fff" size={25} />
        </RNBounceable>
      </View>

      <View style={{padding: 20}}>
        <Text style={{color: '#193459', fontSize: 20}}>Title</Text>
        <Text style={{color: '#fff', fontSize: 30, letterSpacing: 1}}>
          {item.title}
        </Text>
        <View style={{marginTop: 20}}>
          <Text style={{color: '#fff', fontSize: 20}}>{item.description}</Text>
        </View>

        <View
          style={{
            backgroundColor: '#193459',
            height: 40,
            width: '100%',
            marginTop: 20,
          }}>
          <Text
            style={{
              color: '#475C7A',
              fontSize: 30,
              marginLeft: 10,
              alignItems: 'center',
            }}>
            Watch Now On
          </Text>
        </View>
        <RNBounceable
          style={{marginTop: 10}}
          onPress={() => handlePress(item.OTTlink)}>
          <Image source={{uri: item.OTTlogo}} style={{width: 60, height: 60}} />
        </RNBounceable>
      </View> */
}
