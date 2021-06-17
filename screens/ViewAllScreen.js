import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const ViewAllScreen = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const headerTitle = route.params ? route.params.ht : null;
  const genres = route.params ? route.params.g : null;
  const type = route.params ? route.params.ttype : null;

  useLayoutEffect(
    () =>
      navigation.setOptions({
        headerTitle: headerTitle,
      }),
    [navigation],
  );

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('BTotalMovies')
      .where('titletype', '==', type)
      .where('forFilter', 'array-contains-any', genres)
      .get()
      .then(query => {
        const array = [];
        query.docs.map(doc => {
          array.push({
            ...doc.data(),
            key: doc.id,
          });
        });

        setData(array);
        setIsLoading(false);
      });

    return () => unsubscribe;
  }, [firestore]);

  const renderItem = ({item, index}) => (
    <View>
      <TouchableNativeFeedback
        activeOpacity={0.5}
        onPress={() =>
          navigation.navigate('Movie Detail', {
            movieId: item.Key,
            title: item.title,
          })
        }>
        <View style={{margin: 5}}>
          <Image
            source={{uri: item.image}}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.age}>
            <Text style={{color: 'red', fontWeight: 'bold'}}>{item.age}</Text>
          </View>
          <TouchableOpacity style={styles.bookmarkIcon}>
            <Icon name="bookmark-outline" color="#fff" size={13} />
          </TouchableOpacity>
          <View>
            {item.OTTlogo.map((data, index) => (
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
                  left: 5,
                  padding: 2,
                }}>
                <Image
                  source={{uri: data.logo}}
                  style={{
                    resizeMode: 'contain',
                    width: 20,
                    height: 20,
                    borderRadius: 20 / 2,
                  }}
                />
              </View>
            ))}
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 48,
              right: 7,
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
              <Text
                style={[styles.carouselText, styles.title]}
                numberOfLines={1}>
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
    </View>
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}>
        <ActivityIndicator size="small" color="red" />
      </View>
    );
  }

  return (
    <View style={styles.ViewAll}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
};

export default ViewAllScreen;

const styles = StyleSheet.create({
  ViewAll: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  OttSpecificScreen: {
    backgroundColor: '#000',
    flex: 1,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 999,
    bottom: 30,
    right: 50,
  },
  menu: {
    backgroundColor: '#F02A4B',
    alignSelf: 'flex-end',
    flex: 1,
  },

  imageBottom: {
    bottom: 5,
  },
  image: {
    width: 180,
    height: 250,
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
    fontSize: 15,
    color: '#ffffff80',
  },
  flexRowRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(25,52,89,0.6)',
    padding: 5,
    borderRadius: 15,
    left: 6,
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
    right: 7,
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
});
