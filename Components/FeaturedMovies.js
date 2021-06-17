import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableNativeFeedback,
} from 'react-native';
import FloatingButton from '../screens/FloatingButton';
import firestore from '@react-native-firebase/firestore';
import FeaturedSkeleton from './FeaturedSkeleton';

const FeaturedMovies = props => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //console.log(props.image);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('Featured')
      .get()
      .then(data => {
        const featuredMovies = [];
        data.docs.forEach(doc => {
          featuredMovies.push({
            ...doc.data(),
            key: doc.id,
          });
        });
        // setHindiMovies(HindiArray);
        setData(featuredMovies);
        setIsLoading(false);
      });

    return () => unsubscribe;
  }, [firestore]);

  const renderItem = ({item}) => {
    return (
      <TouchableNativeFeedback
        onPress={() =>
          props.navigation.navigate('Movie Detail', {
            movieId: item.Key,
            title: item.title,
          })
        }>
        <View style={{margin: 5}}>
          <Image
            source={{uri: item.image}}
            style={styles.image}
            resizeMode="stretch"
          />
          <View>
            <FloatingButton style={{bottom: 75}} url={item.OTTlogo} />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 48,
              right: 0,
              backgroundColor: 'rgba(25,52,89,0.6)',
              padding: 3,
              paddingTop: 0,
              marginRight: 3,
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
                <Text style={{color: '#fff', fontSize: 12, marginLeft: 10}}>
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

                  {/* <Rating rating={item.imdb} /> */}
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  };

  if (isLoading) {
    return <FeaturedSkeleton />;
  }

  return (
    <View>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={data}
        renderItem={renderItem}
        horizontal
      />
    </View>
  );
};

export default FeaturedMovies;

const styles = StyleSheet.create({
  image: {
    width: 190,
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
    borderRadius: 10,
    left: 2,
  },
  age: {
    position: 'absolute',
    top: 2,
    padding: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(25,52,89,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 20,
    right: 2,
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

//
