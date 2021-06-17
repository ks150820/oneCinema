import React, {useState, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

const LanguageFilter = props => {
  const [ottData, setOTTData] = useState([]);
  const [ott, setOTT] = useState([]);
  const [trailerData, setTrailerData] = useState([]);

  const ottNames = useSelector(state => state.htitle.homeT);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('BTotalMovies')
      .orderBy('Date', 'desc')
      .limit(12)
      .get()
      .then(query => {
        const array = [];

        query.docs.forEach(doc => {
          array.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        setTrailerData(array);
      });

    return () => unsubscribe;
  }, []);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('OTT')
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

        setOTT(emptyArra);
        //setIsLoading(false);
      });

    return () => unsubscribe;
  }, [firestore]);

  switch (props.index) {
    case 1:
      return (
        <View>
          {ottData.length !== 0 && (
            <View style={styles.languageContainer}>
              <View style={styles.title}>
                <Text style={{color: '#fff', fontSize: 20}}>
                  Browse By Language's
                </Text>
              </View>
              <ScrollView
                contentContainerStyle={styles.contentContainerStyle}
                horizontal
                showsHorizontalScrollIndicator={false}>
                {ottData.map((item, index) => {
                  if (item.type === 'Language') {
                    return (
                      <RNBounceable
                        key={index}
                        onPress={() =>
                          props.navigation.navigate('LMovies', {
                            l: item.label,
                          })
                        }
                        style={styles.label}>
                        <Text
                          style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 15,
                          }}>
                          {item.label}
                        </Text>
                      </RNBounceable>
                    );
                  }
                })}
              </ScrollView>
            </View>
          )}
        </View>
      );

    case 2:
      return (
        <View>
          {ott.length !== 0 && (
            <View style={styles.languageContainer}>
              <View style={styles.title}>
                <Text style={{color: '#fff', fontSize: 20}}>
                  OTT Produce Movies
                </Text>
              </View>
              <ScrollView
                contentContainerStyle={styles.contentContainerStyle}
                horizontal
                showsHorizontalScrollIndicator={false}>
                {ott.map((item, index) => {
                  return (
                    <RNBounceable
                      key={index}
                      onPress={() =>
                        props.navigation.navigate('Produce Movies', {
                          ot: item.label,
                        })
                      }
                      style={styles.label}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 15,
                        }}>
                        {item.label}
                      </Text>
                    </RNBounceable>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      );

    case 4:
      return (
        <View>
          {ottData.length !== 0 && (
            <View style={styles.languageContainer}>
              <View style={styles.title}>
                <Text style={{color: '#fff', fontSize: 20}}>
                  Browse By Genres
                </Text>
              </View>
              <ScrollView
                contentContainerStyle={styles.contentContainerStyle}
                horizontal
                showsHorizontalScrollIndicator={false}>
                {ottData.map((item, index) => {
                  if (item.type === 'Genres') {
                    return (
                      <RNBounceable
                        key={index}
                        onPress={() =>
                          props.navigation.navigate('GMovies', {
                            g: item.label,
                          })
                        }
                        style={styles.label}>
                        <Text
                          style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 15,
                          }}>
                          {item.label}
                        </Text>
                      </RNBounceable>
                    );
                  }
                })}
              </ScrollView>
            </View>
          )}
        </View>
      );
    case 5:
      return (
        <View>
          {trailerData.length !== 0 && (
            <View style={{padding: 10}}>
              <View style={styles.title}>
                <Text style={{color: '#fff', fontSize: 25}}>Trailer's</Text>
              </View>
              <ScrollView horizontal>
                {trailerData.map((data, index) => (
                  <View key={index} style={styles.trailer}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => props.play(data.trailer[0].videoId)}
                      style={styles.plyIcon}>
                      <Icon name="play" color="#fff" size={20} />
                    </TouchableOpacity>
                    <Image
                      source={{
                        uri: `https://img.youtube.com/vi/${data.trailer[0].videoId}/0.jpg`,
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                        overflow: 'hidden',
                      }}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      );
    default:
      return null;
  }
};

export default LanguageFilter;

const styles = StyleSheet.create({
  languageContainer: {
    backgroundColor: '#193459',
    height: 100,
    padding: 10,
    marginTop: 20,
  },
  contentContainerStyle: {
    alignItems: 'center',
  },
  title: {
    paddingBottom: 10,
  },
  label: {
    backgroundColor: 'tomato',
    margin: 10,
    padding: 10,
    height: 40,
    borderRadius: 20,
  },
  trailer: {
    width: 350,
    height: 200,
    marginLeft: 10,
    marginBottom: 10,
    padding: 15,
  },
  plyIcon: {
    padding: 10,
    position: 'absolute',
    top: 75,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    zIndex: 999,
  },
});
