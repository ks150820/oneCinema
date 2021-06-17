import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TouchableNativeFeedback,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-paper';
import SearchBarSkeleton from '../Components/SearchBarSkeleton';
import ActorDirectorComponent from '../Components/ActorDirectorComponent';

const {width, height} = Dimensions.get('window');

const DirectorsScreen = ({navigation, route}) => {
  const [specificDirectorData, setSpecificDirectData] = useState([]);

  const directorId = route.params ? route.params.did : null;
  const dName = route.params ? route.params.dName : null;
  const dImgUrl = route.params ? route.params.dImgUrl : null;
  console.log(directorId);

  useLayoutEffect(() => {
    firestore()
      .collection('BTotalMovies')
      .where('directors', 'array-contains', {
        DId: directorId,
        directorImage: dImgUrl,
        directorName: dName,
      })
      .get()
      .then((data) => {
        const array = [];
        data.docs.forEach((doc) => {
          array.push({
            ...doc.data(),
            key: doc.id,
          });
        });
        setSpecificDirectData(array);
      });
  }, [firestore]);

  useLayoutEffect(
    () =>
      navigation.setOptions({
        headerTitle: () => (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#fff', fontSize: 20}}>{dName}</Text>
          </View>
        ),
      }),
    [],
  );

  return (
    <View style={{backgroundColor: '#000', flex: 1}}>
      <StatusBar translucent backgroundColor="transparent" />
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.GoBack}
        onPress={() => navigation.goBack()}>
        <Icon name="chevron-back-outline" size={23} color="whitesmoke" />
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: dImgUrl}}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={{top: -80}}>
        <View
          style={{
            borderColor: '#000',
            borderWidth: 5,
            borderRadius: 150 / 2,
            alignSelf: 'center',
          }}>
          <Avatar.Image source={{uri: dImgUrl}} size={150} />
        </View>
        <View>
          <Text
            style={{
              color: 'whitesmoke',
              fontSize: 25,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {dName}
          </Text>
        </View>
      </View>
      <View
        style={{
          padding: 3,
          top: -50,
        }}>
        {specificDirectorData.length === 0 ? (
          <SearchBarSkeleton />
        ) : (
          specificDirectorData.map((item, index) => (
            <View key={index}>
              <ActorDirectorComponent
                navigation={navigation}
                image={item.image}
                title={item.title}
                runtime={item.runtime}
                lang={item.lang}
                ratings={item.ratings}
                genres={item.genres}
                OTTlogo={item.OTTlogo}
                Key={item.Key}
              />
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default DirectorsScreen;

const styles = StyleSheet.create({
  imageContainer: {
    width: width,
    height: 280,
    padding: 5,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  GoBack: {
    backgroundColor: '#ffba00',
    padding: 5,
    borderRadius: 40,
    position: 'absolute',
    zIndex: 999,
    left: 14,
    top: 45,
  },
});
