import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableNativeFeedback,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Avatar} from 'react-native-paper';

const SearchbarModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [ott, setOTT] = useState([]);
  const [cott, setCOtt] = useState();

  const gettitle = props.route.params ? props.route.params.titleName : null;
  const gettitleType = props.route.params ? props.route.params.titleType : null;
  const getFor = props.route.params ? props.route.params.for : null;

  // console.log(
  //   'gettitle -->>',
  //   gettitle,
  //   'gettitleType ==->>',
  //   gettitleType,
  //   'getfor --==>>',
  //   getFor,
  // );

  useLayoutEffect(() => {
    setIsLoading(true);
    if (getFor === 'movie') {
      firestore()
        .collection('BTotalMovies')
        .where('titletype', '==', getFor)
        .where('forFilter', 'array-contains', gettitle)
        .limit(50)
        .get()
        .then(data => {
          const emptyArray = [];
          data.docs.forEach(querySnapshot => {
            emptyArray.push({
              ...querySnapshot.data(),
              key: querySnapshot.id,
            });
          });

          //console.log(emptyArray);
          setModalData(emptyArray);
          setIsLoading(false);
        });
    }
    if (getFor === 'web series') {
      firestore()
        .collection('BTotalMovies')
        .where('titletype', '==', getFor)
        .limit(50)
        .get()
        .then(data => {
          const emptyArray = [];
          data.docs.forEach(querySnapshot => {
            emptyArray.push({
              ...querySnapshot.data(),
              key: querySnapshot.id,
            });
          });

          //console.log(emptyArray);
          setModalData(emptyArray);
          setIsLoading(false);
        });
    }
  }, [firestore]);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('OTT')
      .where('for', '==', 'p')
      .get()
      .then(querysnapshot => {
        const emptyArra = [];
        querysnapshot.docs.forEach(doc => {
          emptyArra.push({...doc.data(), docId: doc.id});
        });

        setOTT(emptyArra);
        //setIsLoading(false);
      });

    return () => unsubscribe;
  }, [firestore]);

  const handleModalMovie = (key, title, image) => {
    props.navigation.navigate('Movie Detail', {
      movieId: key,
      title: title,
      image: image,
    });
  };

  const handleFilter = async data => {
    setCOtt(data);

    const forFind = [data, gettitle];
    console.log('forFind ===', forFind);

    if (gettitleType === 'Genres' && getFor === 'movie') {
      setIsLoading(true);
      await firestore()
        .collection('BTotalMovies')
        .where('lang', '==', data)
        .where('genres', 'array-contains', gettitle)
        .limit(50)
        .get()
        .then(query => {
          const arr = [];
          query.docs.map(doc => {
            arr.push({
              ...doc.data(),
              docId: doc.id,
            });
          });
          setModalData(arr);
          setIsLoading(false);
        });
    }

    if (gettitleType === 'Language' && getFor === 'movie') {
      setIsLoading(true);
      await firestore()
        .collection('BTotalMovies')
        .where('lang', '==', gettitle)
        .where('genres', 'array-contains', data)
        .limit(50)
        .get()
        .then(query => {
          const arr = [];
          query.docs.map(doc => {
            arr.push({
              ...doc.data(),
              docId: doc.id,
            });
          });
          setModalData(arr);
          setIsLoading(false);
        });
    }

    if (gettitleType === 'Language' && getFor === 'web series') {
      console.log('inside web series block!!');
      setIsLoading(true);
      await firestore()
        .collection('BTotalMovies')
        .where('titletype', '==', getFor)
        .where('lang', '==', data)
        .limit(50)
        .get()
        .then(query => {
          const arr = [];
          query.docs.map(doc => {
            arr.push({
              ...doc.data(),
              docId: doc.id,
            });
          });
          setModalData(arr);
          setIsLoading(false);
        });
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableNativeFeedback
        activeOpacity={0.5}
        onPress={() =>
          props.navigation.navigate('Movie Detail', {
            movieId: item.Key,
            title: item.title,
            image: item.image,
          })
        }>
        <View style={{margin: 5}}>
          <Image source={{uri: item.image}} style={styles.image} />
          <View style={styles.age}>
            <Text style={{color: 'red', fontWeight: 'bold'}}>{item.age}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              bottom: 48,
              backgroundColor: '#193459',
            }}>
            {item.OTTlogo.map((data, index) => (
              <View key={index} style={{margin: 2}}>
                <Avatar.Image
                  source={{uri: data.logo}}
                  size={20}
                  style={{backgroundColor: 'transparent'}}
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
                color: '#ffba00',
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
  };

  return (
    <View style={styles.searchbarModal}>
      <View style={{flexDirection: 'row', marginTop: 30}}>
        <Text style={{color: '#fff', fontSize: 20}}>{gettitle}</Text>
      </View>
      {getFor === 'movie' ? (
        <View style={{flexDirection: 'row', marginLeft: 5, marginTop: 5}}>
          <ScrollView
            horizontal
            contentContainerStyle={{paddingHorizontal: 20}}
            showsHorizontalScrollIndicator={false}>
            {ott.map((data, index) => {
              if (gettitleType === 'Genres' && data.type === 'Language') {
                return (
                  <TouchableNativeFeedback
                    key={index}
                    onPress={() => handleFilter(data.label)}>
                    <View
                      style={
                        data.label === cott
                          ? styles.checkedStylet
                          : styles.uncheckedStyle
                      }>
                      <Text
                        style={
                          cott == data.label
                            ? {fontSize: 15, color: '#fff', fontWeight: 'bold'}
                            : {fontSize: 15, color: '#000'}
                        }>
                        {data.label}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                );
              }
              if (gettitleType === 'Language' && data.type === 'Genres') {
                return (
                  <TouchableNativeFeedback
                    key={index}
                    onPress={() => handleFilter(data.label)}>
                    <View
                      style={
                        data.label === cott
                          ? styles.checkedStylet
                          : styles.uncheckedStyle
                      }>
                      <Text
                        style={
                          cott == data.label
                            ? {fontSize: 15, color: '#fff', fontWeight: 'bold'}
                            : {fontSize: 15, color: '#000'}
                        }>
                        {data.label}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                );
              }
            })}
          </ScrollView>
        </View>
      ) : (
        <View style={{flexDirection: 'row', marginLeft: 5, marginTop: 5}}>
          <ScrollView
            horizontal
            contentContainerStyle={{paddingHorizontal: 20}}
            showsHorizontalScrollIndicator={false}>
            {ott.map((data, index) => {
              if (data.type === 'Language') {
                return (
                  <TouchableNativeFeedback
                    key={index}
                    onPress={() => handleFilter(data.label)}>
                    <View
                      style={
                        data.label === cott
                          ? styles.checkedStylet
                          : styles.uncheckedStyle
                      }>
                      <Text
                        style={
                          cott == data.label
                            ? {fontSize: 15, color: '#fff', fontWeight: 'bold'}
                            : {fontSize: 15, color: '#000'}
                        }>
                        {data.label}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                );
              }
            })}
          </ScrollView>
        </View>
      )}
      <View>
        {isLoading ? (
          <View style={{alignItems: 'center', flex: 1, marginTop: 20}}>
            <ActivityIndicator size="small" color="red" />
          </View>
        ) : (
          <View style={{marginBottom: 100}}>
            <FlatList
              data={modalData}
              renderItem={renderItem}
              ListEmptyComponent={() => (
                <View style={{flex: 1, marginTop: 40, alignSelf: 'center'}}>
                  <Text
                    style={{color: '#fff', fontSize: 25, textAlign: 'center'}}>
                    No, Movies found
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchbarModal;

const styles = StyleSheet.create({
  searchbarModal: {
    flex: 1,
    backgroundColor: '#193459',
    alignItems: 'center',
    padding: 5,
  },
  checkedStyle: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'tomato',
    height: 40,
    margin: 5,
  },
  uncheckedStyle: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 40,
    margin: 5,
  },

  overLayDetails: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    bottom: 0,
    flex: 1,
    width: '100%',
    padding: 5,
  },
  image: {
    width: 180,
    height: 250,
    overflow: 'hidden',
    borderRadius: 5,
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
    padding: 2,
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
  checkedStylet: {
    backgroundColor: '#46b2e0',
    padding: 10,
    borderRadius: 20,
    height: 40,
    margin: 5,
  },
});
