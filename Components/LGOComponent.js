import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import {bookmarkData, bookmarkTitle} from '../store/action/BookmarksData';
import {useDispatch, useSelector} from 'react-redux';

const LGOComponent = (props) => {
  const [bookmarktwo, setBookmarkTwo] = useState([]);
  const [androidId, setAndroidId] = useState();

  useEffect(() => {
    DeviceInfo.getAndroidId().then((id) => {
      setAndroidId(id);
    });
  }, [DeviceInfo]);

  const dispatch = useDispatch();

  const bookmark = useSelector((state) => state.bookmark.bookmarkTitle);
  //console.log('bookark = ', bookmark);
  const bookmarkDataFor = useSelector((state) => state.bookmark.bookmarkData);

  const handleBookmark = (key, data) => {
    //console.log(data);

    console.log(bookmark.indexOf(key));

    if (bookmark.includes(key)) {
      console.log('He is right!');
      let keyId;

      setBookmarkTwo([]);

      bookmarkDataFor.map((item) => {
        if (item.Key === key) {
          keyId = item.docId;
        }
      });

      console.log('docId =', keyId);

      firestore()
        .collection('Bookmarks')
        .doc(androidId)
        .collection('Bookmarks')
        .doc(keyId)
        .delete();

      handleSecBookmark();
    } else {
      setBookmarkTwo([key]);
      firestore()
        .collection('Bookmarks')
        .doc(androidId)
        .collection('Bookmarks')
        .add(data);

      handleSecBookmark();
    }
  };

  function handleSecBookmark() {
    firestore()
      .collection('Bookmarks')
      .doc(androidId)
      .collection('Bookmarks')
      .get()
      .then((query) => {
        const array = [];
        const titlesArray = [];
        query.docs.map((doc) => {
          array.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        array.map((item) => titlesArray.push(item.Key));

        console.log('titlesArray =', titlesArray);
        dispatch(bookmarkTitle(titlesArray));

        dispatch(bookmarkData(array));
      });
  }
  return (
    <View style={styles.MoviesScreen}>
      <View>
        <TouchableNativeFeedback
          activeOpacity={0.5}
          onPress={() =>
            props.navigation.navigate('Movie Detail', {
              movieId: props.Key,
              title: props.title,
              image: props.image,
            })
          }>
          <View style={{margin: 5}}>
            <Image
              source={{uri: props.image}}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.age}>
              <Text style={{color: 'red', fontWeight: 'bold'}}>
                {props.age}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.bookmarkIcon}
              onPress={() => handleBookmark(props.Key, props.item)}>
              <Icon
                name={
                  bookmark.includes(props.Key) ||
                  bookmarktwo.includes(props.Key)
                    ? 'bookmark'
                    : 'bookmark-outline'
                }
                color="#fff"
                size={10}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                bottom: 48,
                width: 20,
                backgroundColor: 'rgba(25,52,89,0.6)',
                borderRadius: 20 / 2,
                alignItems: 'center',
                padding: 5,
                justifyContent: 'center',
              }}>
              {props.OTTlogo.map((data, index) => (
                <View key={index} style={{margin: 2}}>
                  <Image
                    source={{uri: data.logo}}
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
                right: 0,
                backgroundColor: 'rgba(25,52,89,0.6)',
                padding: 3,
                paddingTop: 0,
                marginRight: 3,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}>
                {props.lang}
              </Text>
            </View>
            <View style={styles.overLayDetails}>
              <View style={styles.flexRow}>
                <Text
                  style={[styles.carouselText, styles.title]}
                  numberOfLines={1}>
                  {props.title}
                </Text>
                <View>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 12,
                      marginLeft: 10,
                    }}>
                    {props.runtime}
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
                {props.ratings.map((item, index) => (
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
    </View>
  );
};

export default LGOComponent;

const styles = StyleSheet.create({
  MoviesScreen: {
    backgroundColor: '#000',
    padding: 10,
    marginTop: 20,
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
    height: 20,
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
