import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableNativeFeedback,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LGOComponent from '../Components/LGOComponent';

const ProducedByScreen = ({navigation, route}) => {
  const [ott, setOTT] = useState([]);
  const [cott, setCOtt] = useState();
  const [ShowArrayData, setShowArray] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getOtt = route.params ? route.params.ot : null;

  useLayoutEffect(() => {
    setIsLoading(true);
    const unsubscribe = firestore()
      .collection('BTotalMovies')
      .where('produceBy', '==', getOtt)
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
      .where('for', '==', 'p')
      .get()
      .then(querysnapshot => {
        const emptyArra = [];
        querysnapshot.docs.forEach(doc => {
          emptyArra.push(doc.data().label);
        });

        setOTT(emptyArra);
        //setIsLoading(false);
      });

    return () => unsubscribe;
  }, [firestore]);

  const handleFilter = data => {
    setIsLoading(true);
    setCOtt(data);

    const forFind = [data];

    firestore()
      .collection('BTotalMovies')
      .where('produceBy', '==', getOtt)
      .where('forFilter', 'array-contains-any', forFind)
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
        <View style={styles.checkedStyle}>
          <Text style={{fontSize: 15, color: '#fff', fontWeight: 'bold'}}>
            {getOtt}
          </Text>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={{paddingHorizontal: 20}}
          showsHorizontalScrollIndicator={false}>
          {ott.map((data, index) => {
            return (
              <TouchableNativeFeedback
                key={index}
                onPress={() => handleFilter(data)}>
                <View
                  style={
                    data === cott ? styles.checkedStylet : styles.uncheckedStyle
                  }>
                  <Text
                    style={
                      cott == data
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

export default ProducedByScreen;

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
  MoviesScreen: {
    backgroundColor: '#000',
    padding: 10,
    marginTop: 20,
  },
  checkedStylet: {
    backgroundColor: '#46b2e0',
    padding: 10,
    borderRadius: 20,
    height: 40,
    margin: 5,
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
