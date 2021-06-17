import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import YouTube from 'react-native-youtube';
import MovieDetailComponent from '../Components/MovieDetailComponent';

const TabMovieDetailScreen = ({navigation, route}) => {
  const [partiularMovie, setParticularMovie] = useState([]);
  const [videoId, setVideoId] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayLoad, setIsPlayLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getMovieId = route.params ? route.params.movieId : null;
  //console.log(getMovieId);

  useLayoutEffect(() => {
    firestore()
      .collection('BTotalMovies')
      .where('Key', '==', getMovieId)
      .get()
      .then(data => {
        const total = [];
        data.docs.forEach(doc => {
          total.push({
            ...doc.data(),
            key: doc.id,
          });
        });

        setParticularMovie(total);
        setIsLoading(false);
        //console.log('particular movie = ', total);
      });
  }, [firestore]);

  const handlePlaying = id => {
    setIsPlayLoad(true);
    setIsPlaying(true);
    setVideoId(id);
    setIsPlayLoad(false);
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
        key={(item, index) => index.toString()}
        data={partiularMovie}
        renderItem={renderItem}
      />
    </View>
  );
};

export default TabMovieDetailScreen;

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
  Genres: {
    marginTop: 5,
  },
  youtube: {
    position: 'absolute',
    top: 0,
  },
});
