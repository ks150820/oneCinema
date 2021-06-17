import React, {useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableNativeFeedback,
} from 'react-native';
import {useSelector} from 'react-redux';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon from 'react-native-vector-icons/Ionicons';

const Genres = ({item, index}) => {
  switch (index) {
    case 0:
      return (
        <View
          style={{
            backgroundColor: 'tomato',
            padding: 5,
            borderRadius: 5,
            margin: 5,
          }}>
          <Text style={{color: '#fff', fontSize: 11, fontWeight: 'bold'}}>
            {item}
          </Text>
        </View>
      );
    case 1:
      return (
        <View
          style={{
            backgroundColor: '#3B95FF',
            padding: 5,
            borderRadius: 5,
            margin: 5,
          }}>
          <Text style={{color: '#fff', fontSize: 11, fontWeight: 'bold'}}>
            {item}
          </Text>
        </View>
      );
    case 2:
      return (
        <View
          style={{
            backgroundColor: '#F13BFF',
            padding: 5,
            borderRadius: 5,
            margin: 5,
          }}>
          <Text style={{color: '#fff', fontSize: 11}}>{item}</Text>
        </View>
      );
    case 3:
      return (
        <View
          style={{
            backgroundColor: '#F5D138',
            padding: 5,
            borderRadius: 5,
            margin: 5,
          }}>
          <Text style={{color: '#fff', fontSize: 11}}>{item}</Text>
        </View>
      );
    case 4:
      return (
        <View
          style={{
            backgroundColor: '#1AF541',
            padding: 5,
            borderRadius: 5,
            margin: 5,
          }}>
          <Text style={{color: '#fff', fontSize: 11}}>{item}</Text>
        </View>
      );
    default:
      return null;
  }
};

const Profile = ({navigation}) => {
  const bookmarkMovies = useSelector(state => state.bookmark.bookmarkData);

  useLayoutEffect(
    () =>
      navigation.setOptions({
        headerLeft: null,
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

  const renderItem = ({item, index}) => (
    <TouchableNativeFeedback
      onPress={() =>
        navigation.navigate('Movie Detail', {
          image: item.image,
          movieId: item.Key,
          title: item.title,
        })
      }>
      <View style={styles.container}>
        <Image
          source={{uri: item.image}}
          style={styles.image}
          resizeMode="stretch"
        />
        <View style={styles.RightContainer}>
          <View style={styles.flexRow}>
            <Text style={[styles.carouselText, styles.title]} numberOfLines={1}>
              {item.title}
            </Text>
            <View>
              <Text style={{color: '#fff', fontSize: 12, marginRight: 10}}>
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
                <View
                  style={{
                    alignItems: 'center',
                    paddingLeft: 5,
                    paddingRight: 9,
                  }}>
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
                {/* <Rating rating={item.imdb} /> */}
              </View>
            ))}
          </View>
          <View style={{marginTop: 10}}>
            <Text style={{color: '#ffba00'}}>Cast's</Text>
            <View style={styles.forAllContainer}>
              {item.stars.map((item, index) => (
                <View key={index}>
                  <Text style={{color: '#fff', fontSize: 13, marginLeft: 20}}>
                    {item.actorName}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={[styles.forAllContainer, styles.Genres]}>
            {item.genres.map((item, index) => (
              <View key={index}>
                <Genres index={index} item={item} />
              </View>
            ))}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            {item.OTTlogo.map((data, index) => (
              <View key={index}>
                <Image
                  source={{uri: data.logo}}
                  style={{resizeMode: 'contain', width: 30, height: 20}}
                />
              </View>
            ))}
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                textAlign: 'center',
              }}>
              {item.lang}
            </Text>
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  );

  return (
    <View style={styles.bookmark}>
      <View style={{top: 35}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: '#fff', fontSize: 25}}>Favourite Movies</Text>
          <RNBounceable
            bounceFriction={9}
            bounceEffect={0.8}
            style={{marginRight: 20}}
            onPress={() => navigation.navigate('SearchBar')}>
            <Icon name="search" size={24} color="#fff" />
          </RNBounceable>
        </View>
        <View style={{marginRight: 10}}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={bookmarkMovies}
            renderItem={renderItem}
          />
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  bookmark: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },

  container: {
    backgroundColor: '#193459',
    flexDirection: 'row',
    borderRadius: 10,
    width: '100%',
    overflow: 'hidden',
    marginTop: 10,
  },
  carouselText: {
    color: '#D7F3FA',
    fontWeight: 'bold',
  },
  flexRowRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imdbScore: {fontFamily: 'Inter_600SemiBold', fontSize: 15},
  imdbScoreOverall: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#ffffff80',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingNumber: {fontFamily: 'Menlo', fontSize: 7},
  rating: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 4,
  },
  RightContainer: {
    flex: 1,
    padding: 5,
    paddingRight: 10,
  },
  image: {
    width: 150,
    height: '100%',
  },
  title: {
    fontSize: 20,
  },
  forAllContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  Genres: {
    marginTop: 5,
  },
});
