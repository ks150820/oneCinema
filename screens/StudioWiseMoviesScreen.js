import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNBounceable from '@freakycoder/react-native-bounceable';

const {width, height} = Dimensions.get('window');

const listToMatrix = (list, elementsPerSubArray) => {
  var matrix = [],
    i,
    k;
  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }
    matrix[k].push(list[i]);
  }
  return matrix;
};

const MovieItem = ({movie, navigation}) => (
  <TouchableOpacity
    style={styles.movieItem}
    onPress={() => navigation.navigate('Movie', {movie})}>
    <Image source={{uri: movie.image}} style={styles.movieItemImage} />
  </TouchableOpacity>
);

const StudioWiseMoviesScreen = ({route, navigation}) => {
  const [StudioData, setStudioData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getStudioName = route.params ? route.params.StudioNames : null;

  useLayoutEffect(
    () =>
      navigation.setOptions({
        headerRight: () => (
          <RNBounceable
            bounceFriction={9}
            bounceEffect={0.8}
            style={{marginRight: 30}}
            onPress={() => navigation.navigate('SearchBar')}>
            <Icon name="search" size={24} color="#fff" />
          </RNBounceable>
        ),
      }),
    [navigation],
  );

  useEffect(() => {
    const fetching = async () => {
      setIsLoading(true);
      const response = await fetch(
        'https://febstreming-default-rtdb.firebaseio.com/StudiosWise/StudiosWise.json',
      );

      const resData = await response.json();
      setStudioData(resData);
      setIsLoading(false);
    };

    fetching();
  }, []);

  const getFilterData = StudioData.filter(
    (Item) => Item.StudioName === getStudioName,
  );

  if (isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {getFilterData.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 30, fontStyle: 'italic'}}>
            OOp's No Data Found
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.movieItemContainer}>
          {listToMatrix(getFilterData, 2).map((movieRow, i) => (
            <View key={`movie-row-${i}`} style={styles.movieItemRow}>
              {movieRow.map((movie, j) => (
                <MovieItem
                  key={`movie-item-${i}-${j}`}
                  {...{movie, navigation}}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default StudioWiseMoviesScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ccc'},
  topContainer: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  avatarContainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000075',
  },
  avatarText: {fontFamily: 'Inter_600SemiBold', color: '#ffffff'},
  headerContainer: {paddingHorizontal: 25},
  headerText: {
    fontFamily: 'Oswald_600SemiBold',
    fontSize: 32,
    color: '#000000',
  },
  headerBtnContainer: {flexDirection: 'row'},
  headerBtn: {marginRight: 15, marginVertical: 5},
  headerBtnText: {fontFamily: 'Inter_600SemiBold', fontSize: 12},
  headerBtnActive: {color: '#000000'},
  headerBtnInactive: {color: '#00000040'},
  movieItemContainer: {flex: 1},
  movieItemRow: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  movieItemImage: {
    width: (width - 60) / 2,
    height: width - 150,
    borderRadius: 5,
    overflow: 'hidden',
  },
});
