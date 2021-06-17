import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableNativeFeedback,
  Linking,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Entypo';

const ShortDetail = ({Key, handleClose}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsunbscribe = firestore()
      .collection('Shorts')
      .where('Key', '==', Key)
      .get()
      .then((query) => {
        const array = [];

        query.docs.forEach((doc) => {
          array.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        setData(array);
        setIsLoading(false);
      });
    return () => unsunbscribe;
  }, [firestore]);

  const handlePress = useCallback(async (link) => {
    const supported = await Linking.canOpenURL(link);

    if (supported) {
      await Linking.openURL(link);
    } else {
      Alert.alert(`Don't know how to open the URL`);
    }
  }, []);

  const renderItem = ({item}) => (
    <View>
      <Icon
        name="cross"
        size={25}
        color="red"
        onPress={() => handleClose(false)}
      />
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: item.image}}
          style={{width: 150, height: 220, borderRadius: 5, overflow: 'hidden'}}
        />
        <View style={{padding: 15}}>
          <Text
            style={{color: '#fff', fontSize: 25, fontWeight: 'bold'}}
            numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.headerT}>
            <Text style={styles.righth}>Language :</Text>
            <Text style={styles.rightt}>{item.lang}</Text>
          </View>
          <View style={styles.headerT}>
            <Text style={styles.righth}>RunTime :</Text>
            <Text style={styles.rightt}>{item.runtime}</Text>
          </View>
          <View style={styles.headerT}>
            <Text style={styles.righth}>Ratings :</Text>
            <View>
              {item.ratings.map((item, index) => (
                <View key={index}>
                  <TouchableNativeFeedback>
                    <View style={{marginLeft: 10}}>
                      <Image
                        source={{uri: item.logo}}
                        style={{width: 30, height: 30}}
                      />
                    </View>
                  </TouchableNativeFeedback>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    {item.rating}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.headerT}>
            <Text style={styles.righth}>Age :</Text>
            <Text style={styles.rightt}>{item.age}</Text>
          </View>
        </View>
      </View>
      <View style={{marginTop: 10}}>
        <Text style={{color: '#fff', fontSize: 30}}>Description</Text>
        <View style={{padding: 15}}>
          <Text style={{color: '#fff', fontSize: 15}}>{item.description}</Text>
        </View>
      </View>
      <View style={{marginTop: 10}}>
        <Text style={{color: '#fff', fontSize: 30}}>Available On </Text>
        <View style={{padding: 15}}>
          {item.OTTlogo.map((item, index) => (
            <TouchableNativeFeedback
              key={index}
              onPress={() => handlePress(item.link)}>
              <View style={{width: 40, height: 40}}>
                <Image
                  source={{uri: item.logo}}
                  style={{width: '100%', height: '100%', resizeMode: 'contain'}}
                />
              </View>
            </TouchableNativeFeedback>
          ))}
        </View>
      </View>
      <View style={{marginTop: 10}}>
        <Text style={{color: '#fff', fontSize: 22}}>
          Director's / Creators's
        </Text>
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.directors.map((item, index) => (
              <TouchableNativeFeedback key={index}>
                <ImageBackground
                  resizeMode="stretch"
                  source={{uri: item.directorImage}}
                  style={styles.backImage}>
                  <Text style={{color: '#fff'}}>{item.directorName}</Text>
                </ImageBackground>
              </TouchableNativeFeedback>
            ))}
          </ScrollView>
        </View>

        <Text style={{color: '#fff', fontSize: 22}}>Actor(s)</Text>
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.stars.map((item, index) => (
              <TouchableNativeFeedback key={index}>
                <ImageBackground
                  resizeMode="stretch"
                  source={{uri: item.actorImage}}
                  style={styles.backImage}>
                  <Text style={{color: '#fff'}}>{item.actorName}</Text>
                </ImageBackground>
              </TouchableNativeFeedback>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="small" color="red" />
      </View>
    );
  }

  return (
    <View style={styles.shortDetails}>
      <StatusBar barStyle="light-content" backgroundColor="#193459" />
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={data}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ShortDetail;

const styles = StyleSheet.create({
  shortDetails: {flex: 1, padding: 15, backgroundColor: '#193459'},
  righth: {color: '#ffba00', fontSize: 20},
  rightt: {color: '#fff', marginLeft: 5, fontSize: 15},
  headerT: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  backImage: {
    width: 150,
    height: 120,
    margin: 10,
    padding: 10,
    justifyContent: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
  },
});
