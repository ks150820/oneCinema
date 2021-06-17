import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {title} from '../store/action/Title';
import DeviceInfo from 'react-native-device-info';
import {ottLabel, ottTitle} from '../store/action/OttLabels';
import {bookmarkData, bookmarkTitle} from '../store/action/BookmarksData';
import {forHome} from '../store/action/ForHomeTitle';
import Video from 'react-native-video';
import {kidsTitle} from '../store/action/OttTitleNames';

const SplashScreen = ({navigation}) => {
  const [titles, setTitles] = useState([]);
  const [andid, setId] = useState();

  let OTT = [
    {
      label: 'Netflix',
      image:
        'https://firebasestorage.googleapis.com/v0/b/febstreming.appspot.com/o/i_netflix_n.png?alt=media&token=7af9d22c-64f9-451f-b393-fb3ea914aa03',
      checked: false,
      type: 'OTT',
      Position: 1,
    },
    {
      label: 'Amazon Prime Video',
      image:
        'https://firebasestorage.googleapis.com/v0/b/febstreming.appspot.com/o/amazonPrime.jpg?alt=media&token=b7533066-e8bc-4438-b2a1-82ba5441863d',
      checked: false,
      type: 'OTT',
      Position: 2,
    },
    {
      label: 'Hotstar',
      image:
        'https://firebasestorage.googleapis.com/v0/b/febstreming.appspot.com/o/icons8-hotstar-96.png?alt=media&token=00da7e99-5d42-497c-82e2-e4a5e6485f1a',
      checked: false,
      type: 'OTT',
      Position: 3,
    },
  ];

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('TitleName')
      .orderBy('Order', 'asc')
      .get()
      .then(querySnapshot => {
        const titleArray = [];
        querySnapshot.forEach(doc => {
          titleArray.push({...doc.data(), key: doc.id});
        });

        //console.log(titleArray);
        setTitles(titleArray);
        dispatch(title(titleArray));
      });

    return () => unsubscribe;
  }, [firestore]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      DeviceInfo.getAndroidId().then(id => {
        //setAndroidId(id);

        firestore()
          .collection('userOtt')
          .doc(id)
          .collection('userOtt')
          .orderBy('Position', 'asc')
          .get()
          .then(querysnapshot => {
            const EmptyottArray = [];
            const Emptyott = [];
            //console.log(querysnapshot.docs);
            querysnapshot.docs.forEach(doc => {
              EmptyottArray.push({...doc.data(), docId: doc.id});
            });

            EmptyottArray.map(data => Emptyott.push(data.label));

            //console.log('EmptyOtt =', Emptyott);

            // console.log(Emptyott);

            if (Emptyott.length === 0) {
              console.log('Inside if bolck!!');
              const Emptyottt = ['Netflix', 'Hotstar', 'Amazon Prime Video'];
              dispatch(ottTitle(Emptyottt));
              //dispatch(filterOTT(zerodata));
              dispatch(forHome(Emptyottt));
              dispatch(ottLabel(OTT));
              handleFunction();
            } else {
              dispatch(forHome(Emptyott));
              console.log('inside else bloack');
              dispatch(ottTitle(Emptyott));
              //dispatch(filterOTT(Emptyott));

              dispatch(ottLabel(EmptyottArray));
            }
            navigation.navigate('Home');
          });
      });
    });
    return () => unsubscribe;
  }, [firestore, DeviceInfo]);

  const handleFunction = async () => {
    await DeviceInfo.getAndroidId().then(id => {
      setId(id);

      for (let i = 0; i < OTT.length; i++) {
        firestore()
          .collection('userOtt')
          .doc(id)
          .collection('userOtt')
          .add(OTT[i]);
      }
      // fetchingOtt();
    });
  };

  // const fetchingOtt = () => {
  //   const EmptyottArray = [];

  //   //console.log(querysnapshot.docs);

  //   // EmptyottArray.map(data => Emptyott.push(data.label));
  //   // console.log(Emptyott);

  //   //  console.log(Emptyott);
  // };

  useLayoutEffect(() => {
    DeviceInfo.getAndroidId().then(id => {
      firestore()
        .collection('Bookmarks')
        .doc(id)
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

          //console.log('titlesArray =', titlesArray);
          dispatch(bookmarkTitle(titlesArray));

          dispatch(bookmarkData(array));
        });
    });
  }, [firestore]);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('KidaTitleName')
      .get()
      .then(query => {
        const array = [];
        query.docs.forEach(doc => {
          array.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        dispatch(kidsTitle(array));
      });

    return () => unsubscribe;
  }, [firestore]);

  const onBuffer = data => {
    console.log('Buffer -->', data);
  };

  const videoError = data => {
    console.log('videError -->', data);
  };

  return (
    <View style={styles.splashContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      <Video
        source={require('../assets/splashVideo/cinema.mp4')}
        muted={true}
        repeat={true}
        onBuffer={onBuffer}
        onError={videoError}
        style={styles.backgroundVideo}
        resizeMode="cover"
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          bottom: 20,
        }}>
        <ActivityIndicator size="small" color="#fff" />
        <View>
          <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>
            It All Starts Here
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
  },
  backgroundVideo: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
