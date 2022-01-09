import React, {useCallback, useEffect, useState, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

const TimelineScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [timelineData1, setTimelineData1] = useState([]);

  useLayoutEffect(
    () =>
      navigation.setOptions({
        headerTitle: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 20,
            }}>
            <MaterialCommunityIcons
              name="clock-outline"
              color="#fff"
              size={24}
            />
            <Text
              style={{
                fontSize: 18,
                color: '#fff',
                marginLeft: 5,
              }}>
              Latest Release's
            </Text>
          </View>
        ),
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
    [navigation, MaterialCommunityIcons],
  );

  useEffect(() => {
    loadData();
  }, [firestore]);

  const loadData = () => {
    for (let i = 0; i < 6; i++) {
      firestore()
        .collection('BTotalMovies')
        .where(
          'Date',
          '==',
          `${new Date().getDate() - i}` +
            '/' +
            `${new Date().getMonth() + 1}` +
            '/' +
            new Date().getFullYear(),
        )
        .get()
        .then(data => {
          let emptyArray = [];
          data.docs.forEach(doc => {
            emptyArray.push({
              ...doc.data(),
              key: doc.id,
            });
          });

          setTimelineData1(currentArray => [...currentArray, emptyArray]);
          setIsLoading(false);
        });
      
    }
  };

  const handleNavigation = (id, title, image) => {
    navigation.navigate('Movie Detail', {
      movieId: id,
      title: title,
      image: image,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <View
          style={{
            backgroundColor: '#000',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <ActivityIndicator size="small" color="red" />
        </View>
      ) : (
        <View style={{marginTop: 10}}>
          {timelineData1  && timelineData1[0] && timelineData1[0].length === 0 ? (
            <Text style={{color: '#fff', textAlign: 'center'}}>
              No Movies Found !
            </Text>
          ) : (
            timelineData1.map((data, index) => {
              if (data.length !== 0) {
                return (
                  <View key={index}>
                    <View style={styles.dateContainer}>
                      <View style={styles.roundedBalls} />
                      <View style={styles.date}>
                        <Text style={{color: '#000', fontWeight: 'bold'}}>
                          {data[0].Date}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', left: 40}}>
                      <View style={styles.line} />
                      <ScrollView horizontal style={{marginVertical: 30}}>
                        {data.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            style={{margin: 10}}
                            activeOpacity={0.6}
                            onPress={() =>
                              handleNavigation(item.Key, item.title, item.image)
                            }>
                            <View>
                              {item.OTTlogo.map((item, index) => (
                                <View key={index} style={styles.ottLogo}>
                                  <Image
                                    source={{uri: item.logo}}
                                    style={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: 20 / 2,
                                    }}
                                  />
                                </View>
                              ))}
                            </View>
                            <Image
                              source={{uri: item.image}}
                              style={{width: 150, height: 200, marginTop: 5}}
                              resizeMode="contain"
                            />
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
                                  <View
                                    key={index}
                                    style={styles.flexRowRating}>
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
                                      <Text
                                        style={[
                                          styles.carouselText,
                                          styles.imdbScore,
                                        ]}>
                                        {item.rating}
                                      </Text>
                                    </View>
                                  </View>
                                ))}
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                );
              }
            })
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default TimelineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 10,
  },
  date: {
    backgroundColor: '#d5e8ee',
    padding: 5,
    position: 'absolute',
    top: -5,
    left: 15,
    overflow: 'hidden',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    paddingLeft: 10,
    alignItems: 'center',
  },
  line: {
    width: 3,
    height: '100%',
    backgroundColor: '#454e5a',
  },
  roundedBalls: {
    backgroundColor: '#454e5a',
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    left: 36,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overLayDetails: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    bottom: 0,
    flex: 1,
    width: '100%',
    padding: 5,
  },
  carouselText: {
    color: '#D7F3FA',
    fontWeight: 'bold',
  },
  title: {
    width: 80,
  },
  flexRowRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  imdbScore: {fontFamily: 'Inter_600SemiBold', fontSize: 10},
  ottLogo: {
    backgroundColor: '#193459',
    borderRadius: 30 / 2,
    width: 30,
    height: 30,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    top: -10,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
