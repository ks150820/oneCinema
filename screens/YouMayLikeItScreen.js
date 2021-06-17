import React, {useLayoutEffect, useCallback, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import MovieDetailComponent from '../Components/MovieDetailComponent';
import YouTube from 'react-native-youtube';

const {width, height} = Dimensions.get('window');

const YouMayLikeItScreen = ({navigation, route}) => {
  const [partiularMovie, setParticularMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videoId, setVideoId] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayLoad, setIsPlayLoad] = useState(false);

  const getMovieId = route.params ? route.params.movieId : null;
  const getTitle = route.params ? route.params.title : null;
  const [androidId, setAndroidId] = useState();

  useEffect(() => {
    DeviceInfo.getAndroidId().then((id) => {
      setAndroidId(id);
    });
  }, [DeviceInfo]);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('BTotalMovies')
      .where('Key', '==', getMovieId)
      .get()
      .then((data) => {
        const total = [];
        data.docs.forEach((doc) => {
          total.push({
            ...doc.data(),
            key: doc.id,
          });
        });

        setParticularMovie(total);
        setIsLoading(false);
        //console.log('particular movie = ', total);
      });
    return () => unsubscribe;
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

export default YouMayLikeItScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    height: 200,
    width: width,
    borderRadius: 5,
    overflow: 'hidden',
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
  youtube: {
    position: 'absolute',
    top: 0,
  },
});
