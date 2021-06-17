import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
  Linking,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-paper';

const FloatingButton = props => {
  const animation = new Animated.Value(0);

  let open = 'true';
  const toggleMenu = () => {
    const toValue = open ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();

    open = !open;
  };

  const heartStyle = {
    transform: [
      {scale: animation},
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -98],
        }),
      },
    ],
  };

  const thumbStyle = {
    transform: [
      {scale: animation},
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -65],
        }),
      },
    ],
  };

  const pinStyle = {
    transform: [
      {scale: animation},
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -32],
        }),
      },
    ],
  };

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const handlePress = useCallback(async link => {
    // Checking if the link is supported for links with custom URL scheme.
    const url = 'whatsapp://';
    const supported = await Linking.canOpenURL(link);
    console.log(supported);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(link);
    } else {
      Alert.alert(`Don't know how to open the URL`);
    }
  }, []);

  return (
    <View style={[styles.container, props.style]}>
      {/* <TouchableWithoutFeedback>
        <Animated.View style={[styles.button, styles.secondary, heartStyle]}>
          <Foundation name="social-amazon" size={15} color="#f02a4b" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback>
        <Animated.View style={[styles.button, styles.secondary, thumbStyle]}>
          <MCI name="netflix" size={15} color="#f02a4b" />
        </Animated.View>
      </TouchableWithoutFeedback> */}

      {props.url.map((item, index) => (
        <TouchableWithoutFeedback
          key={index}
          onPress={() => handlePress(item.link)}>
          <Animated.View style={[styles.button, styles.secondary, pinStyle]}>
            <Avatar.Image
              source={{uri: item.logo}}
              size={25}
              style={{backgroundColor: '#193459'}}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      ))}
      <TouchableWithoutFeedback onPress={toggleMenu}>
        <Animated.View style={[styles.button, styles.menu]}>
          <Icon name="caret-forward" size={20} color="#fff" />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    marginLeft: 17,
  },
  button: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 20 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 10,
    shadowColor: '#F02A4B',
    shadowOpacity: 0.3,
    shadowOffset: {height: 10},
    flexDirection: 'row',
  },
  menu: {
    backgroundColor: '#F02A4B',
  },
});
