import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import {useSelector} from 'react-redux';
import RNBounceable from '@freakycoder/react-native-bounceable';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';

const OTTHeaderImages = props => {
  const [ottArray, setOttArray] = useState([]);

  const getOtt = useSelector(state => state.label.label);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      DeviceInfo.getAndroidId().then(id => {
        firestore()
          .collection('userOtt')
          .doc(id)
          .collection('userOtt')
          .get()
          .then(query => {
            const array = [];
            query.docs.forEach(doc => {
              array.push({
                ...doc.data(),
                docId: doc.id,
              });
            });
            setOttArray(array);
          });
      });
    });

    return () => unsubscribe;
  });

  return (
    <View>
      <FlatList
        horizontal
        keyExtractor={(item, index) => index.toString()}
        data={getOtt.length !== 0 ? getOtt : ottArray}
        renderItem={({item}) => (
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <RNBounceable onPress={() => props.OpenBottomSheet(item)}>
              <View style={styles.topOTT}>
                <Image
                  source={{uri: item.image}}
                  style={{width: 40, height: 40, resizeMode: 'contain'}}
                />
              </View>
            </RNBounceable>
          </View>
        )}
      />
    </View>
  );
};

export default OTTHeaderImages;

const styles = StyleSheet.create({
  topOTT: {
    marginRight: 5,
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 0,
    overflow: 'hidden',
    borderRadius: 5,
    flexDirection: 'row',
  },
});

//onPress={() => props.OpenBottomSheet(item.label)}
