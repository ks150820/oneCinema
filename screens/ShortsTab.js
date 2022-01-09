import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  FlatList,
  ImageBackground,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-paper';
import YouTube from 'react-native-youtube';
import ShortDetail from '../Components/ShortDetail';

const ShortsTab = ({navigation}) => {
  const [ottData, setOTTData] = useState([]);
  const [lang, setLang] = useState();
  const [gen, setGenres] = useState([]);
  const [shown, setShown] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoId, setVideoId] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [movieKey, setMovieKey] = useState();

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

  const handleLanguage = langs => {
    setLang(langs);
    setShown(false);
    setIsLoading(true);
    setGenres(['ks']);

    firestore()
      .collection('Shorts')
      .where('lang', '==', langs)
      .get()
      .then(query => {
        const array = [];
        query.docs.forEach(doc => {
          array.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        setData(array);
        setIsLoading(false);
      });
  };

  const handleGenres = genst => {
    setGenres([genst]);
    setIsLoading(true);

    const setGe = [genst];

    const slct = lang ? lang : 'English';

    firestore()
      .collection('Shorts')
      .where('lang', '==', slct)
      .where('genres', 'array-contains-any', setGe)
      .get()
      .then(query => {
        const array = [];
        query.docs.forEach(doc => {
          array.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        setData(array);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = firestore()
      .collection('Shorts')
      .get()
      .then(query => {
        const array = [];
        query.docs.forEach(doc => {
          array.push({
            ...doc.data(),
            docId: doc.id,
          });
        });

        setData(array);
        setIsLoading(false);
      });

    return () => unsubscribe;
  }, []);

  const handlePlaying = id => {
    setIsPlaying(true);
    setVideoId(id);
  };

  const handleISFullScreen = e => {
    setIsPlaying(e.isFullscreen);
  };

  const handleModalVisible = mKey => {
    setMovieKey(mKey);
    setIsVisible(prevState => !prevState);
  };

  const renderItem = ({item}) => (
    <TouchableNativeFeedback
      style={{flex: 1}}
      onPress={() => handleModalVisible(item.Key)}>
      <ImageBackground
        source={{uri: item.image}}
        style={styles.imgBck}
        resizeMode="cover">
        <View
          style={{
            backgroundColor: '#193459',
            padding: 5,
            borderRadius: 50,
            alignSelf: 'flex-end',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 15,
              fontWeight: 'bold',
            }}>
            {item.age}
          </Text>
        </View>
        {item.forFilter.includes('YouTube') ? (
          <TouchableNativeFeedback onPress={() => handlePlaying(item.videoId)}>
            <View style={styles.plyBtn}>
              <Icon name="play" color="#fff" size={20} />
            </View>
          </TouchableNativeFeedback>
        ) : null}
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 3,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>
              {item.lang}
            </Text>
            <Text style={{color: '#ffba00', fontSize: 15, fontWeight: 'bold'}}>
              {item.runtime}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {item.ratings.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 2,
                  marginRight: 2,
                }}>
                <Avatar.Image
                  source={{uri: item.logo}}
                  size={23}
                  style={{backgroundColor: 'transparent'}}
                />
                <Text style={{color: '#fff', fontSize: 13, marginLeft: 3}}>
                  {item.rating}
                </Text>
              </View>
            ))}

            {item.OTTlogo.map((item, index) => (
              <Avatar.Image
                source={{uri: item.logo}}
                size={20}
                key={index}
                style={{backgroundColor: 'transparent'}}
              />
            ))}
          </View>
        </View>
      </ImageBackground>
    </TouchableNativeFeedback>
  );

  const handleClose = get => {
    setIsVisible(get);
  };

  return (
    <View style={styles.Shorts}>
      <View style={{marginTop: 20, flex: 1}}>
        {isPlaying && (
          <View style={styles.youtube}>
            <YouTube
              videoId={videoId}
              play
              fullscreen
              loop
              onChangeFullscreen={e => handleISFullScreen(e)}
              apiKey="AIzaSyDzMhrZykvex83wQiWlDlG2GVaoUkoE4qk"
              style={{
                alignSelf: 'stretch',
                height: 300,
              }}
            />
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="play" color="#fff" size={20} />
            <Text style={{color: '#fff', fontSize: 25}}>Short Movies</Text>
          </View>
          <View>
            <TouchableNativeFeedback
              onPress={() => setShown(prevState => !prevState)}>
              <View
                style={{
                  marginRight: 20,
                }}>
                <Text style={{color: '#ffba00', fontSize: 20}}>
                  Select Language
                </Text>
              </View>
            </TouchableNativeFeedback>
            {shown && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.lang}>
                {ottData.map((item, index) => {
                  if (item.type === 'Language') {
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.5}
                        onPress={() => handleLanguage(item.label)}>
                        <Text style={styles.langText}>{item.label}</Text>
                      </TouchableOpacity>
                    );
                  }
                })}
              </ScrollView>
            )}
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          {lang && (
            <View
              style={{
                backgroundColor: 'tomato',
                padding: 10,
                borderRadius: 20,
                alignSelf: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>
                {lang}
              </Text>
            </View>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {ottData.map((item, index) => {
              if (item.type === 'Genres') {
                return (
                  <TouchableNativeFeedback
                    key={index}
                    onPress={() => handleGenres(item.label)}>
                    <View
                      style={
                        gen.includes(item.label)
                          ? styles.checkGenres
                          : styles.genres
                      }>
                      <Text
                        style={
                          gen.includes(item.label)
                            ? styles.checkGenText
                            : styles.genText
                        }>
                        {item.label}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                );
              }
            })}
          </ScrollView>
        </View>
        <View
          style={{
            top: 10,
            alignItems: 'center',
            flex: 1,
            marginBottom: 40,
          }}>
          {isLoading ? (
            <View style={{alignSelf: 'center'}}>
              <ActivityIndicator size="small" color="red" />
            </View>
          ) : (
            <FlatList
              data={data}
              renderItem={renderItem}
              ListEmptyComponent={() => (
                <View style={{justifyContent: 'center'}}>
                  <Text
                    style={{color: '#fff', fontSize: 25, textAlign: 'center'}}>
                    No short Movie's Found
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
            />
          )}
        </View>
      </View>
      {isVisible && (
        <View style={styles.centeredView}>
          <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={() => setIsVisible(false)}>
            <ShortDetail Key={movieKey} handleClose={handleClose} />
          </Modal>
        </View>
      )}
    </View>
  );
};

export default ShortsTab;

const styles = StyleSheet.create({
  Shorts: {
    backgroundColor: '#000',
    flex: 1,
    top: 30,
  },
  genres: {
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 5,
    marginLeft: 5,
  },
  checkGenres: {
    backgroundColor: '#46b2e0',
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 5,
    marginLeft: 5,
  },
  genText: {fontSize: 15, color: 'black'},
  checkGenText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  lang: {
    height: 150,
    width: 120,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 25,
    zIndex: 999,
    right: 50,
    borderRadius: 10,
    overflow: 'hidden',
  },
  langText: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
    fontWeight: 'bold',
    paddingTop: 5,
  },
  imgBck: {
    width: 180,
    height: 270,
    margin: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  plyBtn: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  youtube: {
    position: 'absolute',
    top: 0,
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
