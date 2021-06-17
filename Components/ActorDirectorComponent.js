import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import {Avatar} from 'react-native-paper';

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

const ActorDirectorComponent = (props) => {
  return (
    <TouchableNativeFeedback
      onPress={() =>
        props.navigation.navigate('ActorDetail', {
          movieId: props.Key,
          title: props.title,
          image: props.image,
        })
      }>
      <View style={styles.container}>
        <Image
          source={{uri: props.image}}
          style={styles.imageTwo}
          resizeMode="cover"
        />
        <View style={styles.RightContainer}>
          <View style={styles.left}>
            <View style={styles.flexRow}>
              <Text
                style={[styles.carouselText, styles.title]}
                numberOfLines={1}>
                {props.title}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Text style={{color: '#fff', fontSize: 12}}>Duration :</Text>
              <Text style={{color: '#fff', fontSize: 12, marginLeft: 5}}>
                {props.runtime}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Text style={{color: '#fff', fontSize: 12}}>Language :</Text>
              <Text style={{color: '#fff', fontSize: 12, marginLeft: 5}}>
                {props.lang}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}>
              {props.ratings.map((item, index) => (
                <View key={index} style={styles.flexRowRating}>
                  <View>
                    <Image
                      source={{uri: item.logo}}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 20 / 2,
                      }}
                      resizeMode="cover"
                    />

                    <Text style={[styles.carouselText, styles.imdbScore]}>
                      {item.rating}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={[styles.forAllContainer, styles.Genres]}>
              {props.genres.map((item, index) => (
                <View key={index}>
                  <Genres index={index} item={item} />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.right}>
            <View
              style={{
                flex: 1,
              }}>
              {props.OTTlogo.map((data, index) => (
                <View key={index}>
                  <Avatar.Image
                    source={{uri: data.logo}}
                    size={30}
                    style={{backgroundColor: '#000'}}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

export default ActorDirectorComponent;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  container: {
    backgroundColor: '#193459',
    flexDirection: 'row',
    borderRadius: 10,
    width: '95%',
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
  },
  carouselText: {
    color: '#D7F3FA',
    fontWeight: 'bold',
  },
  flexRowRating: {
    alignItems: 'center',
    margin: 5,
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
    width: 180,
  },
  ratingNumber: {fontFamily: 'Menlo', fontSize: 7},
  rating: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 4,
  },
  RightContainer: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageTwo: {
    width: 130,
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
