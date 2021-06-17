import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import YouTube from 'react-native-youtube';

const {width, height} = Dimensions.get('window');

const TrailorScreen = ({navigation, route}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayLoad, setIsPlayLoad] = useState(false);
  const [videoId, setVideoId] = useState();

  const getData = route.params ? route.params.trailerData : null;
  const critics = route.params ? route.params.critics : null;
  console.log('c =', critics);

  const handleISFullScreen = (e) => {
    setIsPlaying(e.isFullscreen);
  };

  const handlePlaying = (id) => {
    setIsPlayLoad(true);
    setIsPlaying(true);
    setVideoId(id);
    setIsPlayLoad(false);
  };

  if (isPlayLoad) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="small" color="red" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.trailors}
      contentContainerStyle={{
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      {isPlaying && (
        <View style={styles.youtube}>
          <YouTube
            videoId={videoId}
            play
            fullscreen
            loop
            onChangeFullscreen={(e) => handleISFullScreen(e)}
            apiKey="AIzaSyCmC2w2eMCYsg61k8wTmQXOplb3ephYGB0"
            style={{
              alignSelf: 'stretch',
              height: 300,
            }}
          />
        </View>
      )}
      <View>
        <View
          style={{backgroundColor: 'tomato', borderRadius: 10, padding: 10}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              marginLeft: 10,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Trailers
          </Text>
        </View>
        {getData.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 120,
                zIndex: 999,
                alignSelf: 'center',
              }}
              activeOpacity={0.5}
              onPress={() => handlePlaying(item.videoId)}>
              <Image
                source={{
                  uri:
                    'https://firebasestorage.googleapis.com/v0/b/febstreming.appspot.com/o/youtube-icon-play.png?alt=media&token=761d0f9e-ea8c-492a-a427-cdbfdc4af12d',
                }}
                style={{
                  width: 50,
                  height: 30,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>

            <Image
              source={{
                uri: `https://img.youtube.com/vi/${item.videoId}/0.jpg`,
              }}
              style={styles.image}
              resizeMode="stretch"
            />
          </View>
        ))}
      </View>
      <View>
        <View
          style={{backgroundColor: 'tomato', borderRadius: 10, padding: 10}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              marginLeft: 10,
              textAlign: 'center',
            }}>
            Critics
          </Text>
        </View>
        {critics.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 120,
                zIndex: 999,
                alignSelf: 'center',
              }}
              activeOpacity={0.5}
              onPress={() => handlePlaying(item.videoId)}>
              <Image
                source={{
                  uri:
                    'https://firebasestorage.googleapis.com/v0/b/febstreming.appspot.com/o/youtube-icon-play.png?alt=media&token=761d0f9e-ea8c-492a-a427-cdbfdc4af12d',
                }}
                style={{
                  width: 50,
                  height: 30,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>

            <Image
              source={{uri: `https://img.youtube.com/vi/${item.videoId}/0.jpg`}}
              style={styles.image}
              resizeMode="stretch"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default TrailorScreen;

const styles = StyleSheet.create({
  trailors: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  youtube: {
    position: 'absolute',
    top: 0,
  },
  image: {
    width: width,
    height: 250,
    marginTop: 5,
  },
});
