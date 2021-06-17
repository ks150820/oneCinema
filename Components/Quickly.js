import React, {useState, useLayoutEffect, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableNativeFeedback,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Skeleton from './Skeleton';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {bookmarkData, bookmarkTitle} from '../store/action/BookmarksData';
import LanguageFilter from './LanguageFilter';
import AIcon from 'react-native-vector-icons/AntDesign';

const Quickly = ({
  headingTitle,
  navigation,
  index,
  handlePlaying,
  titleName,
  titleId,
  genres,
  titletype,
}) => {
  const [lastData, setLast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarktwo, setBookmarkTwo] = useState([]);
  const [andId, setAndId] = useState();

  const dispatch = useDispatch();

  //-----bookmark---//

  const bookmark = useSelector(state => state.bookmark.bookmarkTitle);
  //console.log('bookark = ', bookmark);
  const bookmarkDataFor = useSelector(state => state.bookmark.bookmarkData);
  ///---endbookmark---//

  const ottNames = useSelector(state => state.htitle.homeT);
  const getLabelTitle = useSelector(state => state.title.title);

  useLayoutEffect(() => {
    DeviceInfo.getAndroidId().then(id => setAndId(id));
  }, [firestore]);

  useEffect(() => {
    const fetch = navigation.addListener('focus', () => {
      firestore()
        .collection('BTotalMovies')
        .where('forFilter', 'array-contains-any', ottNames)
        .where('titleId', '==', headingTitle)
        .limit(20)
        .get()
        .then(last => {
          const array = [];
          last.docs.forEach(doc => {
            array.push({
              ...doc.data(),
              docId: doc.id,
            });
          });
          setLast(array);
          setIsLoading(false);
        });
    });

    return () => fetch;
  }, [firestore, ottNames, navigation]);

  const handleBookmark = (key, data) => {
    //console.log(data);

    console.log(bookmark.indexOf(key));

    if (bookmark.includes(key)) {
      console.log('He is right!');
      let keyId;

      setBookmarkTwo(['cinema']);

      bookmarkDataFor.map(item => {
        if (item.Key === key) {
          keyId = item.docId;
        }
      });

      console.log('docId =', keyId);

      firestore()
        .collection('Bookmarks')
        .doc(andId)
        .collection('Bookmarks')
        .doc(keyId)
        .delete();

      handleSecBookmark();
    } else {
      setBookmarkTwo([key]);
      firestore()
        .collection('Bookmarks')
        .doc(andId)
        .collection('Bookmarks')
        .add(data);

      handleSecBookmark();
    }
  };

  function handleSecBookmark() {
    firestore()
      .collection('Bookmarks')
      .doc(andId)
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

        console.log('titlesArray =', titlesArray);
        dispatch(bookmarkTitle(titlesArray));

        dispatch(bookmarkData(array));
      });
  }

  const handlePlay = id => {
    handlePlaying(id);
  };

  if (isLoading) {
    return (
      <View style={{padding: 10}}>
        <Skeleton />
      </View>
    );
  }

  const renderItem = ({item}) => (
    <TouchableNativeFeedback
      activeOpacity={0.5}
      onPress={() =>
        navigation.navigate('Movie Detail', {
          movieId: item.Key,
          title: item.title,
        })
      }>
      <View style={{margin: 5}}>
        <FastImage
          style={styles.image}
          source={{
            uri: item.image,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.age}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>{item.age}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookmarkIcon}
          onPress={() => handleBookmark(item.Key, item)}>
          <Icon
            name={
              bookmark.includes(item.Key) || bookmarktwo.includes(item.Key)
                ? 'bookmark'
                : 'bookmark-outline'
            }
            color="#fff"
            size={10}
          />
        </TouchableOpacity>
        <View>
          {item.OTTlogo.map((item, index) => (
            <View key={index} style={styles.ottLogo}>
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
        <View style={styles.langContainer}>
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
    <View>
      {lastData.length !== 0 && (
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{color: '#fff', fontSize: 25}}>{titleName}</Text>
          {titleId === 'trailer' ? null : (
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                flexDirection: 'row',
                marginRight: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() =>
                navigation.navigate('ViewAll', {
                  ht: titleName,
                  g: genres,
                  ttype: titletype,
                })
              }>
              <Text style={{color: '#ffba00', fontSize: 15}}>View All</Text>
              <AIcon name="right" color="#fff" size={10} />
            </TouchableOpacity>
          )}
        </View>
      )}
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={lastData}
        renderItem={renderItem}
        horizontal
      />
      <LanguageFilter navigation={navigation} index={index} play={handlePlay} />
    </View>
  );
};

export default Quickly;

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
    borderRadius: 15,
    padding: 5,
    backgroundColor: 'rgba(25,52,89,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    right: 2,
  },
  title: {
    width: 80,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 4,
  },
  langContainer: {
    position: 'absolute',
    bottom: 48,
    right: 3,
    backgroundColor: 'rgba(25,52,89,0.6)',
    padding: 3,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  ottLogo: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 48,
    backgroundColor: 'rgba(25,52,89,0.6)',
    borderRadius: 20 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    left: 3,
    padding: 2,
  },
});
