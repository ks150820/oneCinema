import React, {useLayoutEffect, useCallback, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Linking,
  TouchableNativeFeedback,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useSelector, useDispatch} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {bookmarkData, bookmarkTitle} from '../store/action/BookmarksData';
import firestore from '@react-native-firebase/firestore';
import YouMayAlsoLikeIt from './YouMayAlsoLikeIt';
import Share from 'react-native-share';

const {width, height} = Dimensions.get('window');

const Genres = ({item, index, handleGenres}) => {
  switch (index) {
    case 0:
      return (
        <TouchableNativeFeedback onPress={() => handleGenres(item)}>
          <View
            style={{
              backgroundColor: 'tomato',
              padding: 5,
              borderRadius: 5,
              margin: 5,
            }}>
            <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>
              {item}
            </Text>
          </View>
        </TouchableNativeFeedback>
      );
    case 1:
      return (
        <TouchableNativeFeedback onPress={() => handleGenres(item)}>
          <View
            style={{
              backgroundColor: '#CEF024',
              padding: 5,
              borderRadius: 5,
              margin: 5,
            }}>
            <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>
              {item}
            </Text>
          </View>
        </TouchableNativeFeedback>
      );
    case 2:
      return (
        <TouchableNativeFeedback onPress={() => handleGenres(item)}>
          <View
            style={{
              backgroundColor: '#2D8EE3',
              padding: 5,
              borderRadius: 5,
              margin: 5,
            }}>
            <Text style={{color: '#fff', fontSize: 15}}>{item}</Text>
          </View>
        </TouchableNativeFeedback>
      );
    case 3:
      return (
        <TouchableNativeFeedback onPress={() => handleGenres(item)}>
          <View
            style={{
              backgroundColor: '#8F25FA',
              padding: 5,
              borderRadius: 5,
              margin: 5,
            }}>
            <Text style={{color: '#fff', fontSize: 15}}>{item}</Text>
          </View>
        </TouchableNativeFeedback>
      );
    case 4:
      return (
        <TouchableNativeFeedback onPress={() => handleGenres(item)}>
          <View
            style={{
              backgroundColor: '#1AF541',
              padding: 5,
              borderRadius: 5,
              margin: 5,
            }}>
            <Text style={{color: '#fff', fontSize: 15}}>{item}</Text>
          </View>
        </TouchableNativeFeedback>
      );
    default:
      return null;
  }
};

const MovieDetailComponent = props => {
  const [isBookmark, setBookmark] = useState([]);
  const [isLike1, setIsLike1] = useState(false);
  const [isDislike1, setIsDislike1] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const [data, setData] = useState([]);
  const [androidId, setAndroidId] = useState();

  const dispatch = useDispatch();

  const bookmark = useSelector(state => state.bookmark.bookmarkTitle);
  // console.log('bookark = ', bookmark);
  const bookmarkDataFor = useSelector(state => state.bookmark.bookmarkData);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('OTT')
      .get()
      .then(querysnapshot => {
        const emptyArra = [];
        querysnapshot.docs.forEach(doc => {
          emptyArra.push({
            ...doc.data(),
            key: doc.id,
          });
        });

        setData(emptyArra);
        //setIsLoading(false);
      });

    return () => unsubscribe;
  }, [firestore]);

  useEffect(() => {
    DeviceInfo.getAndroidId().then(id => {
      setAndroidId(id);
    });
  }, [DeviceInfo]);

  const handleBookmark = (key, data) => {
    //console.log(data);

    // console.log(bookmark.indexOf(key));

    if (bookmark.includes(key)) {
      setBookmark(['hjv']);
      console.log('He is right!');
      let keyId;

      bookmarkDataFor.map(item => {
        if (item.Key === key) {
          keyId = item.docId;
        }
      });

      firestore()
        .collection('Bookmarks')
        .doc(androidId)
        .collection('Bookmarks')
        .doc(keyId)
        .delete();

      handleSecBookmark();
    } else {
      setBookmark([key]);
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
      .then(query => {
        const array = [];
        const titlesArray = [];
        query.docs.map(doc => {
          array.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        array.map(item => titlesArray.push(item.Key));

        dispatch(bookmarkTitle(titlesArray));

        dispatch(bookmarkData(array));
      });
  }

  //--endbookmark--//
  const handlePress = useCallback(async url => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Server Error');
    }
  }, []);

  const handlePressGenres = label => {
    props.navigation.navigate('GMovies', {g: label});
  };

  const handleLanguage = lang => {
    props.navigation.navigate('LMovies', {l: lang});
  };

  const handleTrailorNavigation = (data, critics) => {
    props.navigation.navigate('Trailors', {
      trailerData: data,
      critics: critics,
    });
  };

  const handleLikes = (keyId, name, like, dislike) => {
    console.log(keyId, ' ', name, '', like, '', dislike);
    if (isLike1 === false && isDislike1 === false) {
      setIsLike1(like);
      setIsDislike1(dislike);
    }

    console.log('isLike =', isLike1, 'isDisLike = ', isDislike1);

    if (name === 'isLike') {
      if (isLike1 === false && isDislike1 === false) {
        console.log("isLike case 'if' called!!");
        setIsLike1(true);
        setIsDislike1(false);
        firestore().collection('BTotalMovies').doc(keyId).update({
          isLike: true,
          isDisLike: false,
        });
      } else if (isDislike1 === true) {
        console.log("isLike case 'else if' called!!");
        setIsDislike1(false);
        setIsLike1(true);
        firestore().collection('BTotalMovies').doc(keyId).update({
          isLike: true,
          isDisLike: false,
        });
      } else {
        console.log("isLike case 'else' called!!");
        setIsLike1(false);
        firestore().collection('BTotalMovies').doc(keyId).update({
          isLike: false,
        });
      }
    }

    if (name === 'isDisLike') {
      if (isLike1 === false && isDislike1 === false) {
        setIsDislike1(true);
        setIsLike1(false);
        firestore().collection('BTotalMovies').doc(keyId).update({
          isLike: false,
          isDisLike: true,
        });
      } else if (isLike1 === true) {
        setIsDislike1(true);
        setIsLike1(false);
        firestore().collection('BTotalMovies').doc(keyId).update({
          isLike: false,
          isDisLike: true,
        });
      } else {
        setIsDislike1(false);
        firestore().collection('BTotalMovies').doc(keyId).update({
          isDisLike: false,
        });
      }
    }
  };

  const handleIsSeen = keyId => {
    console.log(keyId);
    setIsSeen(prevState => !prevState);
    firestore().collection('BTotalMovies').doc(keyId).update({isSeen: !isSeen});
  };

  const navigationFunction = (id, title, image) => {
    console.log('Id = ', id);
    props.navigation.navigate('youMayLikeIt', {
      movieId: id,
      title: title,
      image: image,
    });
  };

  const MovieShare = async (movieId, image) => {
    const shareOptions = {
      message: `https://app.oneCinema.com/Details/${movieId}`,
    };

    try {
      const shareResponse = await Share.open(shareOptions);
    } catch (Error) {
      console.log('Error =', Error);
    }
  };

  return (
    <View>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.headerImage}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.GoBack}
          onPress={() => props.navigation.navigate('Home')}>
          <Icon name="chevron-back-outline" size={23} color="whitesmoke" />
        </TouchableOpacity>
        <Image source={{uri: props.image}} style={styles.image} />

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.search}
          onPress={() => props.navigation.navigate('SearchBar')}>
          <Icon name="search" size={20} color="whitesmoke" />
        </TouchableOpacity>

        <TouchableNativeFeedback
          onPress={() => handleTrailorNavigation(props.trailer, props.critics)}>
          <View style={styles.trailorPortion}>
            <Icon name="caret-forward" size={12} color="#fff" />
            <Text style={{color: '#fff'}}>Trailors</Text>
            <Text style={{color: '#fff'}}>({props.trailer.length})</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
      <View style={{top: -125}}>
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
          }}>
          {/* ---left section */}
          <View>
            <View style={{width: 150, height: 230}}>
              <Image
                source={{uri: props.image}}
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                top: 5,
              }}>
              <RNBounceable onPress={() => handleIsSeen(props.keyId)}>
                <Icon
                  name={props.isSeen || isSeen ? 'eye-outline' : 'eye-off'}
                  color="#fff"
                  size={20}
                />
              </RNBounceable>
              <RNBounceable onPress={() => MovieShare(props.Key)}>
                <AntIcon name="sharealt" color="#fff" size={20} />
              </RNBounceable>
              <RNBounceable
                onPress={() =>
                  handleLikes(
                    props.keyId,
                    'isLike',
                    props.isLike,
                    props.isDisLike,
                  )
                }>
                <AntIcon
                  name={props.isLike || isLike1 ? 'like1' : 'like2'}
                  color={props.isLike || isLike1 ? 'tomato' : '#fff'}
                  size={20}
                />
              </RNBounceable>
              <RNBounceable
                onPress={() =>
                  handleLikes(
                    props.keyId,
                    'isDisLike',
                    props.isLike,
                    props.isDisLike,
                  )
                }>
                <AntIcon
                  name={props.isDisLike || isDislike1 ? 'dislike1' : 'dislike2'}
                  color={props.isDisLike || isDislike1 ? 'tomato' : '#fff'}
                  size={20}
                />
              </RNBounceable>
            </View>
          </View>
          {/* ---right section-- */}
          <View
            style={{
              marginLeft: 15,
              width: '60%',
            }}>
            <Text style={{color: '#fff', fontSize: 30}} numberOfLines={1}>
              {props.title}
            </Text>
            <Text style={{color: '#fff', fontSize: 13}}>
              Release Year : {props.year}
            </Text>
            <Text style={{color: '#fff', fontSize: 13}}>Age : {props.age}</Text>

            <Text style={{color: '#fff', fontSize: 13}}>
              Runtime : {props.runtime}
            </Text>

            <View>
              <TouchableNativeFeedback
                onPress={() => handleBookmark(props.Key, props.item)}>
                <View style={styles.bookmarkIcon}>
                  <Icon
                    name={
                      bookmark.includes(props.Key) ||
                      isBookmark.includes(props.Key)
                        ? 'bookmark'
                        : 'bookmark-outline'
                    }
                    color="tomato"
                    size={25}
                  />
                </View>
              </TouchableNativeFeedback>
            </View>
            <View
              style={{
                flexDirection: 'row',
                margin: 5,
                alignItems: 'center',
              }}>
              {props.ratings.map((data, index) => (
                <TouchableNativeFeedback
                  key={index}
                  onPress={() => handlePress(data.url)}>
                  <View
                    style={{
                      alignItems: 'center',
                      marginLeft: 5,
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={{uri: data.logo}}
                      style={{width: 20, height: 20}}
                      resizeMode="contain"
                    />
                    <Text style={{color: '#fff', fontSize: 10, marginLeft: 5}}>
                      {data.rating}
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              ))}
            </View>
            <View style={[styles.forAllContainer, styles.Genres]}>
              {props.genres.map((item, index) => (
                <View key={index}>
                  <Genres
                    index={index}
                    item={item}
                    handleGenres={handlePressGenres}
                  />
                </View>
              ))}
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#fff', fontSize: 13}}>Language :</Text>
              <TouchableOpacity
                style={{
                  marginTop: 3,
                  marginLeft: 5,
                  backgroundColor: '#ce1212',

                  alignSelf: 'center',
                  padding: 5,
                  paddingLeft: 8,
                  paddingRight: 8,
                  borderRadius: 10,
                  borderWidth: 0.8,
                  borderColor: '#fff',
                }}
                onPress={() => handleLanguage(props.lang)}
                activeOpacity={0.5}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {props.lang}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{padding: 15}}>
          <Text
            style={{
              color: 'whitesmoke',
              fontSize: 15,
              textAlign: 'left',
            }}>
            {props.description}
          </Text>
        </View>

        <View>
          <Text style={{color: '#fff', fontSize: 22, marginLeft: 20}}>
            Available On
          </Text>
          <View
            style={{
              width: 120,
              height: 1,
              backgroundColor: 'tomato',
              marginTop: 5,
              marginBottom: 5,
              marginLeft: 20,
            }}
          />
          <View style={{marginLeft: 30}}>
            {props.OTTlogo.map((item, index) => (
              <TouchableNativeFeedback
                key={index}
                onPress={() => handlePress(item.link)}>
                <Image
                  source={{uri: item.logo}}
                  style={{width: 50, height: 50, margin: 10}}
                />
              </TouchableNativeFeedback>
            ))}
          </View>
        </View>

        <View style={{marginTop: 10}}>
          <Text style={{color: '#fff', fontSize: 26, marginLeft: 20}}>
            Director's / Creators's
          </Text>
          <View
            style={{
              width: 240,
              height: 1,
              backgroundColor: 'tomato',
              marginTop: 5,
              marginBottom: 5,
              marginLeft: 20,
            }}
          />
          <View>
            <ScrollView horizontal>
              {props.directors.map((item, index) => (
                <TouchableNativeFeedback
                  key={index}
                  onPress={() =>
                    props.navigation.navigate('Director', {
                      dName: item.directorName,
                      dImgUrl: item.directorImage,
                      did: item.DId,
                    })
                  }>
                  <View style={{alignItems: 'center'}}>
                    <View style={styles.dirImage}>
                      <Image
                        resizeMode="stretch"
                        source={{uri: item.directorImage}}
                        style={{width: '100%', height: '100%'}}
                      />
                    </View>
                    <Text style={{color: '#fff'}}>{item.directorName}</Text>
                  </View>
                </TouchableNativeFeedback>
              ))}
            </ScrollView>
          </View>

          <Text
            style={{
              color: '#fff',
              fontSize: 26,
              marginLeft: 20,
              marginTop: 30,
            }}>
            Actor(s)
          </Text>
          <View
            style={{
              width: 90,
              height: 1,
              backgroundColor: 'tomato',
              marginTop: 5,
              marginBottom: 5,
              marginLeft: 20,
            }}
          />
          <View>
            <ScrollView horizontal>
              {props.stars.map((item, index) => (
                <TouchableNativeFeedback
                  key={index}
                  onPress={() =>
                    props.navigation.navigate('Actor', {
                      aName: item.actorName,
                      aImgUrl: item.actorImage,
                      aid: item.actorId,
                    })
                  }>
                  <View style={{alignItems: 'center'}}>
                    <ImageBackground
                      resizeMode="stretch"
                      source={{uri: item.actorImage}}
                      style={styles.backImage}
                    />
                    <Text style={{color: '#fff'}}>{item.actorName}</Text>
                  </View>
                </TouchableNativeFeedback>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={{marginTop: 10}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 26,
              marginLeft: 20,
              marginTop: 20,
            }}>
            Trailer(s)
          </Text>
          <View
            style={{
              width: 100,
              height: 1,
              backgroundColor: 'tomato',
              marginTop: 5,
              marginBottom: 5,
              marginLeft: 20,
            }}
          />
          <ScrollView horizontal>
            {props.trailer.map((item, index) => (
              <ImageBackground
                key={index}
                source={{
                  uri: `https://img.youtube.com/vi/${item.videoId}/0.jpg`,
                }}
                style={{
                  width: 400,
                  height: 250,
                  margin: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => props.handlePlaying(item.videoId)}>
                  <Image
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/febstreming.appspot.com/o/youtube-icon-play.png?alt=media&token=761d0f9e-ea8c-492a-a427-cdbfdc4af12d',
                    }}
                    style={{
                      width: 50,
                      height: 30,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </ImageBackground>
            ))}
          </ScrollView>

          <Text style={{color: '#fff', fontSize: 22, marginLeft: 20}}>
            Critic(s)
          </Text>
          <View
            style={{
              width: 100,
              height: 1,
              backgroundColor: 'tomato',
              marginTop: 5,
              marginBottom: 5,
              marginLeft: 20,
            }}
          />
          <ScrollView horizontal>
            {props.critics.map((item, index) => (
              <ImageBackground
                key={index}
                source={{
                  uri: `https://img.youtube.com/vi/${item.videoId}/0.jpg`,
                }}
                style={{
                  width: 400,
                  height: 250,
                  margin: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => props.handlePlaying(item.videoId)}>
                  <Image
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/febstreming.appspot.com/o/youtube-icon-play.png?alt=media&token=761d0f9e-ea8c-492a-a427-cdbfdc4af12d',
                    }}
                    style={{
                      width: 50,
                      height: 30,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </ImageBackground>
            ))}
          </ScrollView>
        </View>
        <View style={{marginTop: 10}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              marginLeft: 20,
            }}>
            You May Also Like It
          </Text>
          <View
            style={{
              width: 180,
              height: 1,
              backgroundColor: 'tomato',
              marginTop: 5,
              marginBottom: 5,
              marginLeft: 20,
            }}
          />
        </View>
        <YouMayAlsoLikeIt
          Genres={props.genres}
          NavigationProp={navigationFunction}
          navigation={props.navigation}
        />
      </View>
    </View>
  );
};

export default MovieDetailComponent;

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    resizeMode: 'stretch',
    opacity: 0.5,
  },
  ratingNumber: {fontFamily: 'Menlo', fontSize: 7},
  rating: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 4,
  },
  forAllContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  Genres: {
    marginTop: 5,
  },
  trailorPortion: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    padding: 8,
    borderRadius: 20 / 2,
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 80,
  },
  GoBack: {
    backgroundColor: '#ffba00',
    padding: 5,
    borderRadius: 40,
    position: 'absolute',
    zIndex: 999,
    left: 8,
    top: 45,
  },
  search: {
    backgroundColor: '#ffba00',
    padding: 5,
    borderRadius: 40,
    position: 'absolute',
    zIndex: 999,
    right: 10,
    top: 43,
  },
  headerImage: {
    width: width,
    height: 300,
    overflow: 'hidden',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bookmarkIcon: {
    backgroundColor: '#fff',
    borderRadius: 40 / 2,
    padding: 5,
    width: 40,
    alignItems: 'center',
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  backImage: {
    width: 110,
    height: 105,
    margin: 10,
    borderRadius: 110 / 2,
    overflow: 'hidden',
  },
  dirImage: {
    width: 110,
    height: 105,
    margin: 10,
    borderRadius: 110 / 2,
    overflow: 'hidden',
  },
});
