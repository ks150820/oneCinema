import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import {bookmarkData, bookmarkTitle} from '../store/action/BookmarksData';

const Movies = (props) => {
  const [androidId, setAndroidId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const bookmark = useSelector((state) => state.bookmark.bookmarkTitle);
  //console.log('bookark = ', bookmark);
  const bookmarkDataFor = useSelector((state) => state.bookmark.bookmarkData);

  useEffect(() => {
    DeviceInfo.getAndroidId().then((id) => {
      setAndroidId(id);
    });
  }, [DeviceInfo]);

  const handleBookmark = (key, data) => {
    //console.log(data);

    console.log(bookmark.indexOf(key));

    if (bookmark.includes(key)) {
      console.log('He is right!');
      let keyId;

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
    <View style={{marginTop: 20}}>
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{color: '#fff', fontSize: 25}}>{props.title}</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            flexDirection: 'row',
            marginRight: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() =>
            props.navigation.navigate('ViewAll', {
              ht: props.title,
              g: props.genres,
            })
          }>
          <Text style={{color: '#ffba00', fontSize: 15}}>View All</Text>
          <AntDesign name="right" color="#fff" size={10} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal>
        {props.data.length === 0 ? (
          <View
            style={{
              width: Dimensions.get('window').width,
              justifyContent: 'center',
            }}>
            <Text style={{color: '#fff', textAlign: 'center'}}>
              Sorry , No Filter Found
            </Text>
          </View>
        ) : (
          props.data.map((item, index) => (
            <View key={index}>
              <TouchableNativeFeedback
                activeOpacity={0.5}
                onPress={() => props.NavigationProp(item.Key, item.title)}>
                <View style={{margin: 5}}>
                  <Image
                    source={{uri: item.image}}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <View style={styles.age}>
                    <Text style={{color: 'red', fontWeight: 'bold'}}>
                      {item.age}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookmarkIcon}
                    onPress={() => handleBookmark(item.Key, item)}>
                    <Icon
                      name={
                        bookmark.includes(item.Key)
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
                      backgroundColor: 'rgba(25,52,89,0.6)',
                      borderRadius: 20 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      left: 3,
                      padding: 2,
                    }}>
                    {item.OTTlogo.map((data, index) => (
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
                      <Text
                        style={[styles.carouselText, styles.title]}
                        numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View>
                        <Text
                          style={{color: '#fff', fontSize: 12, marginLeft: 10}}>
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
                            <Text
                              style={[styles.carouselText, styles.imdbScore]}>
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
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Movies;

const styles = StyleSheet.create({
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
    borderRadius: 15,
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
