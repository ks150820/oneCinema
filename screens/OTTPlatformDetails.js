import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import Checkbox from '@react-native-community/checkbox';
import {ottLabel, ottTitle} from '../store/action/OttLabels';
import {forHome} from '../store/action/ForHomeTitle';

const OTTPlatformDetails = ({navigation}) => {
  const [androidId, setAndroidId] = useState();
  const [ottData, setOTTData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ottArray, setOttArray] = useState([]);
  const [ottlabel, setOttLabel] = useState([]);

  const dispatch = useDispatch();

  // console.log(ottlabel);

  useLayoutEffect(
    () =>
      navigation.setOptions({
        title: 'Streaming Service',
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            <RNBounceable
              bounceFriction={9}
              bounceEffect={0.8}
              style={{marginRight: 20}}
              onPress={() => navigation.navigate('SearchBar')}>
              <Icon name="search" size={24} color="#fff" />
            </RNBounceable>
          </View>
        ),
      }),
    [navigation],
  );

  useEffect(() => {
    DeviceInfo.getAndroidId().then(id => {
      setAndroidId(id);

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

          //console.log(EmptyottArray);
          EmptyottArray.map(data => Emptyott.push(data.label));

          //console.log(Emptyott);

          setOttLabel(Emptyott);
          setOttArray(EmptyottArray);
          setIsLoading(false);
        });
    });
  }, [DeviceInfo, setAndroidId]);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('OTT')
      .orderBy('Position', 'asc')
      .get()
      .then(querysnapshot => {
        const emptyArra = [];
        querysnapshot.docs.forEach(doc => {
          emptyArra.push({
            ...doc.data(),
            key: doc.id,
          });
        });

        setOTTData(emptyArra);
        //setIsLoading(false);
      });

    return () => unsubscribe;
  }, [firestore]);

  const onUpdateValue = (index, value, type) => {
    const getkey = ottData[index];

    if (ottlabel.includes(getkey.label)) {
      const index = ottlabel.indexOf(getkey.label);
      const dockey = ottArray[index].docId;
      console.log(dockey);

      firestore()
        .collection('userOtt')
        .doc(androidId)
        .collection('userOtt')
        .doc(dockey)
        .delete();

      handleFunction();
    } else {
      firestore()
        .collection('userOtt')
        .doc(androidId)
        .collection('userOtt')
        .add(getkey);

      handleFunction();
    }
  };

  function handleFunction() {
    firestore()
      .collection('userOtt')
      .doc(androidId)
      .collection('userOtt')
      .get()
      .then(querysnapshot => {
        const EmptyottArray = [];
        const Emptyott = [];
        const zerodata = ['Netflix', 'Amazon Prime Video', 'Hotstar'];
        querysnapshot.docs.forEach(doc => {
          EmptyottArray.push({...doc.data(), docId: doc.id});
        });

        EmptyottArray.map(data => Emptyott.push(data.label));

        console.log('Empty Ott ===>>', Emptyott);

        if (Emptyott.length === 0) {
          dispatch(ottTitle(zerodata));
          dispatch(forHome(zerodata));
          navigation.setOptions({headerLeft: null});
        } else {
          dispatch(ottTitle(Emptyott));
          dispatch(forHome(Emptyott));
          navigation.setOptions({
            headerLeft: () => (
              <Icon
                name="arrow-back"
                color="#fff"
                size={25}
                style={{marginLeft: 10}}
                onPress={() => navigation.goBack()}
              />
            ),
          });
        }

        dispatch(ottLabel(EmptyottArray));
        setOttLabel(Emptyott);
        setOttArray(EmptyottArray);
      });
  }

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.container} activeOpacity={0.8}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: item.image}}
            style={{
              width: 40,
              height: 30,
              borderRadius: 5,
              resizeMode: 'contain',
            }}
          />
          <Text style={{color: '#fff', marginLeft: 15, fontSize: 20}}>
            {item.label}
          </Text>
        </View>

        <Checkbox
          onValueChange={value => onUpdateValue(index, value, item.type)}
          value={ottlabel.includes(item.label)}
        />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: '#000',
        }}>
        <ActivityIndicator size="small" color="red" />
      </View>
    );
  }

  return (
    <View style={{backgroundColor: 'black', flex: 1}}>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={ottData}
        renderItem={renderItem}
      />
    </View>
  );
};

export default OTTPlatformDetails;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#193549',
    margin: 5,
  },
});

{
  /* <RBSheet
        ref={refRBSheet}
        closeOnPressMask={true}
        closeOnDragDown={true}
        closeOnPressBack={true}
        closeOnPressMask={false}
        keyboardAvoidingViewEnabled={true}
        openDuration={200}
        height={500}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.34)',
          },
          draggableIcon: {
            backgroundColor: 'yellow',
          },
          container: {
            backgroundColor: '#193459',
          },
        }}>
        <ScrollView>
          <BottomSheet />
        </ScrollView>
      </RBSheet> */
}
