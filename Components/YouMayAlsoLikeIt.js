import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import {bookmarkData, bookmarkTitle} from '../store/action/BookmarksData';

const YouMayAlsoLikeIt = props => {
  const [andId, setAndroidId] = useState();
  const [GenresMovies, setGenresMovies] = useState([]);
  const [bookmarktwo, setBookmarkTwo] = useState([]);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('BTotalMovies')
      .where('genres', 'array-contains-any', props.Genres)
      .limit(12)
      .get()
      .then(data => {
        const array = [];

        data.docs.forEach(doc => {
          array.push({
            ...doc.data(),
            key: doc.id,
          });
        });
        setGenresMovies(array);
        //console.log('you may like it =', array);
      });

    return () => unsubscribe;
  }, [firestore, setGenresMovies]);

  const bookmark = useSelector(state => state.bookmark.bookmarkTitle);
  //console.log('bookark = ', bookmark);

  useEffect(() => {
    DeviceInfo.getAndroidId().then(id => {
      setAndroidId(id);
    });
  }, [DeviceInfo]);

  const renderItem = ({item, index}) => (
    <TouchableNativeFeedback
      onPress={() => props.NavigationProp(item.Key, item.title, item.image)}>
      <View style={{margin: 5}}>
        <Image source={{uri: item.image}} style={styles.image} />
        <View style={styles.age}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>{item.age}</Text>
        </View>

        <View>
          {item.OTTlogo.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                position: 'absolute',
                bottom: 48,
                backgroundColor: 'rgba(25,52,89,0.6)',
                borderRadius: 20 / 2,
                alignItems: 'center',
                justifyContent: 'center',
                left: 3,
                padding: 2,
              }}>
              <Image
                source={{uri: item.logo}}
                style={{
                  resizeMode: 'contain',
                  width: 20,
                  height: 15,
                }}
              />
            </View>
          ))}
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 48,
            right: 3,
            backgroundColor: 'rgba(25,52,89,0.6)',
            padding: 3,
            paddingTop: 0,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: 'yellow',
              fontSize: 15,
              fontWeight: 'bold',
            }}>
            {item.lang}
          </Text>
        </View>
        <View style={styles.overLayDetails}>
          <View style={styles.flexRow}>
            <Text style={[styles.carouselText, styles.title]} numberOfLines={1}>
              {item.title}
            </Text>
            <View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  marginLeft: 10,
                }}>
                {item.runtime}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {item.ratings.map((item, index) => (
              <View key={index} style={styles.flexRowRating}>
                <Image
                  source={{uri: item.logo}}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20 / 2,
                  }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 5,
                  }}>
                  <Text style={[styles.carouselText, styles.imdbScore]}>
                    {item.rating}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  );

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={GenresMovies}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="small" color="red" />
          </View>
        )}
        horizontal
      />
    </View>
  );
};

export default YouMayAlsoLikeIt;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 220,
    overflow: 'hidden',
    borderRadius: 5,
  },
  overLayDetails: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    bottom: 0,
    flex: 1,
    width: '100%',
    padding: 5,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carouselText: {
    color: '#D7F3FA',
    fontWeight: 'bold',
  },
  imdbScore: {fontFamily: 'Inter_600SemiBold', fontSize: 10},
  imdbScoreOverall: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#ffffff80',
  },
  flexRowRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(25,52,89,0.6)',
    padding: 5,
    borderRadius: 15,
    left: 2,
  },
  title: {
    width: 80,
  },

  ratingNumber: {fontFamily: 'Menlo', fontSize: 7},
  rating: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 4,
  },
  age: {
    position: 'absolute',
    top: 2,
    borderRadius: 15,
    padding: 5,
    backgroundColor: 'rgba(25,52,89,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    right: 2,
  },
});
