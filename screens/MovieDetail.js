import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import YouTube from 'react-native-youtube';
import MovieDetailComponent from '../Components/MovieDetailComponent';

const {width} = Dimensions.get('window');

const MovieDetail = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [partiularMovie, setParticularMovie] = useState([]);
  const [videoId, setVideoId] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  //console.log(data);

  const getMovieId = route.params ? route.params.movieId : null;

  //console.log('getMovieId -->>', partiularMovie);

  useLayoutEffect(() => {
    setIsLoading(true);
    const unsubscribe = firestore()
      .collection('BTotalMovies')
      .where('Key', '==', getMovieId)
      .limit(1)
      .get()
      .then(data => {
        console.log('inside..');
        const total = [];
        data.docs.forEach(doc => {
          total.push({
            ...doc.data(),
            keyId: doc.id,
          });
        });

        setParticularMovie(total);
        setIsLoading(false);
        //console.log('particular movie = ', total);
      });

    return () => unsubscribe;
  }, [firestore]);

  const handlePlaying = id => {
    setIsPlaying(true);
    setVideoId(id);
  };

  const handleISFullScreen = e => {
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
            onChangeFullscreen={e => handleISFullScreen(e)}
            apiKey="AIzaSyDzMhrZykvex83wQiWlDlG2GVaoUkoE4qk"
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

export default MovieDetail;

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
    width: 150,
    height: 120,
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
