import React, {useState, useLayoutEffect, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import AIcon from 'react-native-vector-icons/AntDesign';
import Swiper from 'react-native-swiper';
import Skeleton from '../Components/Skeleton';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import DeviceInfo, {isLandscape} from 'react-native-device-info';
import {bookmarkData, bookmarkTitle} from '../store/action/BookmarksData';
import MoviePosterLayout from '../Components/MoviePosterLayout';

const SwiperSkelton = () => {
  return (
    <SkeletonPlaceholder
      backgroundColor="rgba(25,52,89,0.5)"
      highlightColor="#193459">
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.Skeleton} />
      </View>
    </SkeletonPlaceholder>
  );
};

const KidsScreen = ({navigation}) => {
  const [bookmarktwo, setBookmarkTwo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [swiperData, setSwiper] = useState([]);
  const [andId, setAndroidId] = useState();

  const titles = useSelector((state) => state.ottt.kids);
  const labels = useSelector((state) => state.label.title);
  const getLabels = useSelector((state) => state.label.title);
  //console.log('getLabels = >>>>', getLabels);

  const bookmark = useSelector((state) => state.bookmark.bookmarkTitle);
  //console.log('bookark = ', bookmark);
  const bookmarkDataFor = useSelector((state) => state.bookmark.bookmarkData);

  const dispatch = useDispatch();

  useEffect(() => {
    DeviceInfo.getAndroidId().then((id) => {
      setAndroidId(id);
    });
  }, [DeviceInfo]);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('BTotalMovies')
      .where('for', '==', 'swiper')
      .get()
      .then((query) => {
        const array = [];
        query.docs.forEach((doc) => {
          array.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        //console.log(array);
        setSwiper(array);
        setIsLoading(false);
      });

    return () => unsubscribe;
  }, [firestore]);

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
    <ScrollView style={styles.kidsContainer}>
      <View style={{marginTop: 5, marginBottom: 5}}>
        <Text style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
          Kids
        </Text>
      </View>

      {isLoading ? (
        <SwiperSkelton />
      ) : (
        <View style={styles.sliderContainer}>
          <Swiper
            autoplay
            height={200}
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
            paginationStyle={{
              bottom: -23,
              left: null,
              right: 10,
            }}
            loop>
            {swiperData.map((data, index) => (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  navigation.navigate('Kid Detail', {
                    movieId: data.Key,
                    title: data.title,
                  })
                }
                key={index}
                style={styles.slide}
                title={
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: '#fff', fontSize: 15}}>
                      {data.title}
                    </Text>
                    <View style={{marginLeft: 10}}>
                      {data.OTTlogo.map((item, index) => (
                        <Image
                          key={index}
                          source={{uri: item.logo}}
                          style={{width: 20, height: 20}}
                        />
                      ))}
                    </View>
                  </View>
                }>
                <Image
                  source={{uri: data.image}}
                  resizeMode="cover"
                  style={styles.sliderImage}
                />
              </TouchableOpacity>
            ))}
          </Swiper>
        </View>
      )}
      <View>
        {titles.map((item, index) => (
          <View key={index}>
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 25}}>
                {item.titleName}
              </Text>
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
                    ht: item.titleName,
                    g: item.genres,
                    ttype: item.titletype,
                  })
                }>
                <Text style={{color: '#ffba00', fontSize: 15}}>View All</Text>
                <AIcon name="right" color="#fff" size={10} />
              </TouchableOpacity>
            </View>
            <View style={{padding: 15}}>
              {getLabels.length === 0 ? (
                <Skeleton />
              ) : (
                <ScrollView horizontal>
                  {getLabels.map((data, index) => {
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
                            nav="Kid Detail"
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
      </View>
    </ScrollView>
  );
};

export default KidsScreen;

const styles = StyleSheet.create({
  kidsContainer: {flex: 1, backgroundColor: '#000'},

  title: {fontSize: 18, width: 140},

  sliderContainer: {
    height: 200,
    width: '90%',
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  sliderImage: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 5,
    height: 5,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#ff6347',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  Skeleton: {
    width: 400,
    height: 200,
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
  },
});

//'Kid Detail'
