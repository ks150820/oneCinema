import React, {useState, useLayoutEffect} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Skeleton from '../Components/Skeleton';
import MoviePosterLayout from '../Components/MoviePosterLayout';

const OttSpecificScreen = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTitleData = route.params ? route.params.item : null;
  const img = route.params ? route.params.image : null;
  const state = route.params ? route.params.state : null;

  //console.log('Netflix =', state);

  useLayoutEffect(
    () =>
      navigation.setOptions({
        headerTitle: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
            <View
              style={{
                width: 30,
                height: 30,
                overflow: 'hidden',
                borderRadius: 5,
              }}>
              <Image
                source={{uri: img}}
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View>
              <Text style={{color: '#fff', fontSize: 15, marginLeft: 10}}>
                {getTitleData}
              </Text>
            </View>
          </View>
        ),
      }),
    [navigation, getTitleData],
  );

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('BTotalMovies')
      .where('forFilter', 'array-contains', getTitleData)
      .limit(200)
      .get()
      .then(query => {
        const array = [];

        query.docs.map(doc => {
          array.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        //console.log(array);

        setData(array);
        setIsLoading(false);
      });

    return () => unsubscribe;
  }, [firestore]);

  //console.log(data);

  return (
    <ScrollView style={styles.OttSpecificScreen}>
      {state.map((item, index) => (
        <View key={index}>
          <View style={{margin: 5}}>
            <Text style={{color: '#fff', fontSize: 25}}>{item.titleName}</Text>
          </View>
          <View style={{padding: 15}}>
            {isLoading ? (
              <Skeleton />
            ) : (
              <ScrollView horizontal>
                {data.map((data, index) => {
                  if (data.titleId === item.titleId) {
                    return (
                      <View key={index}>
                        <MoviePosterLayout
                          navigation={navigation}
                          image={data.image}
                          age={data.age}
                          Key={data.Key}
                          data={data}
                          OTTlogo={data.OTTlogo}
                          lang={data.lang}
                          title={data.title}
                          runtime={data.runtime}
                          ratings={data.ratings}
                        />
                      </View>
                    );
                  }
                })}
              </ScrollView>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default OttSpecificScreen;

const styles = StyleSheet.create({
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: 'yellow',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 100,
    zIndex: 999,
  },
  OttSpecificScreen: {
    backgroundColor: '#000',
    flex: 1,
  },
  container: {
    alignItems: 'center',
    position: 'absolute',
    marginLeft: 40,
    borderWidth: 2,
    borderColor: '#fff',
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

{
  /* <View style={{borderWidth: 1, borderColor: '#FFF', flex: 1}}>
        {switchScreen ? (
          <OttSpecificWebSeriesScreen />
        ) : (
          <OttSpecificMoviesScreen />
        )}
      </View>
      {switchScreen ? (
        <RNBounceable
          style={[styles.button, styles.menu]}
          onPress={() => setSwitchScreen((prevState) => !prevState)}>
          <Icon name="play" color="#fff" size={30} />
        </RNBounceable>
      ) : (
        <RNBounceable
          style={[styles.button, styles.menu]}
          onPress={() => setSwitchScreen((prevState) => !prevState)}>
          <Image
            source={require('../assets/icons/smart-tv.png')}
            style={{width: 30, height: 30, resizeMode: 'contain'}}
          />
        </RNBounceable>
      )} */
}
