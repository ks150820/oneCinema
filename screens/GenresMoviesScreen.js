import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LGOComponent from '../Components/LGOComponent';

const GenresMoviesScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ShowArrayData, setShowArray] = useState([]);
  const [cott, setCOtt] = useState(getOtt);

  const getOtt = route.params ? route.params.g : null;

  const [ottData, setOTTData] = useState([]);

  useEffect(() => {
    setCOtt(getOtt);
  }, []);

  useLayoutEffect(() => {
    setIsLoading(true);
    const unsubscribe = firestore()
      .collection('BTotalMovies')
      .where('genres', 'array-contains', getOtt)
      .limit(70)
      .get()
      .then(query => {
        const arr = [];
        query.docs.map(doc => {
          arr.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        setShowArray(arr);
        setIsLoading(false);
      });

    return () => unsubscribe;
  }, [firestore]);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('OTT')
      .where('type', '==', 'Genres')
      .get()
      .then(querysnapshot => {
        const emptyArra = [];
        querysnapshot.docs.forEach(doc => {
          emptyArra.push(doc.data().label);
        });

        setOTTData(emptyArra);
        //setIsLoading(false);
      });

    return () => unsubscribe;
  }, [firestore]);

  useLayoutEffect(
    () =>
      navigation.setOptions({
        headerTitle: 'Movies',
      }),
    [],
  );

  const handleFilter = data => {
    setIsLoading(true);
    setCOtt(data);

    const forFind = [data];
    console.log(forFind);

    firestore()
      .collection('BTotalMovies')
      .where('forFilter', 'array-contains-any', forFind)
      .get()
      .then(query => {
        const arr = [];
        query.docs.map(doc => {
          arr.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        setShowArray(arr);
        setIsLoading(false);
      });
  };

  const renderItem = ({item}) => (
    <LGOComponent
      navigation={navigation}
      image={item.image}
      age={item.age}
      Key={item.Key}
      OTTlogo={item.OTTlogo}
      lang={item.lang}
      title={item.title}
      runtime={item.runtime}
      ratings={item.ratings}
      item={item}
    />
  );

  return (
    <View style={{backgroundColor: '#000', flex: 1}}>
      <View style={{flexDirection: 'row', marginLeft: 5}}>
        <ScrollView
          horizontal
          contentContainerStyle={{paddingHorizontal: 20}}
          showsHorizontalScrollIndicator={false}>
          {ottData.map((data, index) => {
            return (
              <TouchableNativeFeedback
                key={index}
                onPress={() => handleFilter(data)}>
                <View
                  style={
                    data === cott ? styles.checkedStyle : styles.uncheckedStyle
                  }>
                  <Text
                    style={
                      data === cott
                        ? {fontSize: 15, color: '#fff', fontWeight: 'bold'}
                        : {fontSize: 15, color: '#000'}
                    }>
                    {data}
                  </Text>
                </View>
              </TouchableNativeFeedback>
            );
          })}
        </ScrollView>
      </View>
      {isLoading ? (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <ActivityIndicator size="small" color="red" />
        </View>
      ) : (
        <FlatList
          data={ShowArrayData}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View style={{flex: 1, marginTop: 40, alignSelf: 'center'}}>
              <Text style={{color: '#fff', fontSize: 25, textAlign: 'center'}}>
                No, Movies found
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      )}
    </View>
  );
};

export default GenresMoviesScreen;

const styles = StyleSheet.create({
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
  checkedStylet: {
    backgroundColor: '#46b2e0',
    padding: 10,
    borderRadius: 20,
    height: 40,
    margin: 5,
  },
});
