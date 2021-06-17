import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import RNBounceable from '@freakycoder/react-native-bounceable';

const {width, height} = Dimensions.get('window');

const AllMoviesScreen = ({navigation, route}) => {
  const getTypeOfMovies = route.params ? route.params.movieType : null;

  const fullMovies = useSelector((state) => state.fullMovie.fullMovies);

  console.log(width);

  const numCol = width < 500 ? 2 : 4;

  const getHindiMovies = fullMovies.filter(
    (data) => data.lang === getTypeOfMovies,
  );

  const renderItem = ({item}) => (
    <RNBounceable onPress={() => handleSendToMovie(item.title)}>
      <Image source={{uri: item.image}} style={styles.movieItemImage} />
    </RNBounceable>
  );

  const handleSendToMovie = (titleName) => {
    console.log(titleName);
    switch (getTypeOfMovies) {
      case 'Hindi':
        const getFilterDataForHindi = getHindiMovies.filter(
          (data) => data.title === titleName,
        );
        getFilterDataForHindi.map((movie) =>
          navigation.navigate('Movie', {movie}),
        );

      case 'English Language Movies':
        const getFilterDataForEnglish = getEnglishMovies.filter(
          (data) => data.title === titleName,
        );
        getFilterDataForEnglish.map((movie) =>
          navigation.navigate('Movie', {movie}),
        );
      case 'Tamil Language Movies':
        const getFilterDataForTamil = getTamilMovies.filter(
          (data) => data.title === titleName,
        );
        getFilterDataForTamil.map((movie) =>
          navigation.navigate('Movie', {movie}),
        );
      case 'Dubbed Language Movies':
        const getFilterDataForDubbed = getDubbedMovies.filter(
          (data) => data.title === titleName,
        );
        getFilterDataForDubbed.map((movie) =>
          navigation.navigate('Movie', {movie}),
        );
      default:
        return null;
    }
  };

  switch (getTypeOfMovies) {
    case 'Hindi':
      return (
        <ScrollView
          style={{backgroundColor: '#000'}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.forAllContainer}>
            {getHindiMovies.map((item, index) => (
              <View key={index}>
                <Image
                  source={{uri: item.image}}
                  style={styles.movieItemImage}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      );

    default:
      return (
        <View>
          <Text>No Movie's found</Text>
        </View>
      );
  }
};

export default AllMoviesScreen;

const styles = StyleSheet.create({
  forAllContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
    overflow: 'hidden',
  },
  movieItemImage: {
    width: (width - 60) / 2,
    height: width - 150,
    borderRadius: 5,
    overflow: 'hidden',
    margin: 5,
  },
});
