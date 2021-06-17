import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNBounceable from '@freakycoder/react-native-bounceable';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SearchBarSkeleton from '../Components/SearchBarSkeleton';

const SearchBarScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [forSearchData, setForSearchData] = useState([]);

  // const handleOnChangeText = async searchTText => {
  //   setSearchText(searchTText);
  //   setIsLoading(true);

  //   await firestore()
  //     .collection('BTotalMovies')
  //     .orderBy('title')
  //     .startAt(searchTText)
  //     .endAt(searchTText + '\uf8ff')
  //     .get()
  //     .then(querySnapshot => {
  //       const searchArray = [];

  //       querySnapshot.docs.forEach(doc => {
  //         searchArray.push({
  //           ...doc.data(),
  //           key: doc.id,
  //         });
  //       });

  //       setForSearchData(searchArray);

  //       //console.log(searchArray);
  //       setIsLoading(false);
  //     });
  // };

  const handleOnChangeText = async searchTText => {
    setSearchText(searchTText);
    setIsLoading(true);

    console.log(searchTText.trim().replace(/ +/g, '').toLowerCase());

    await firestore()
      .collection('BTotalMovies')
      .where(
        'searchkey',
        'array-contains',
        searchTText.trim().replace(/ +/g, '').toLowerCase(),
      )
      .limit(30)
      .get()
      .then(querySnapshot => {
        const searchArray = [];

        querySnapshot.docs.forEach(doc => {
          searchArray.push({
            ...doc.data(),
            key: doc.id,
          });
        });

        setForSearchData(searchArray);

        //console.log(searchArray);
        setIsLoading(false);
      });
  };

  const handleOnPressEvent = (id, title, image) => {
    console.log(id);
    navigation.navigate('Movie Detail', {
      movieId: id,
      title: title,
      image: image,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.searchbar} behavior="height">
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={styles.textInput}>
        <RNBounceable
          bounceFriction={5}
          bounceEffect={0.8}
          onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back"
            color="#fff"
            size={24}
            style={{marginLeft: 5}}
          />
        </RNBounceable>
        <TextInput
          placeholder="Search by movies name"
          placeholderTextColor="gray"
          value={searchText}
          style={styles.input}
          returnKeyType="search"
          onChangeText={handleOnChangeText}
        />
        <RNBounceable bounceFriction={5} bounceEffect={0.8}>
          {searchText.length != 0 ? (
            <RNBounceable
              bounceFriction={5}
              bounceEffect={0.8}
              onPress={() => setSearchText('')}>
              <Icon
                name="ios-close-sharp"
                color="#FFF"
                size={24}
                style={{marginRight: 5}}
              />
            </RNBounceable>
          ) : (
            <Icon
              name="search"
              color="#fff"
              size={24}
              style={{marginRight: 5}}
            />
          )}
        </RNBounceable>
      </View>
      <View style={styles.flatlist}>
        <View>
          {isLoading ? (
            <View>
              {searchText.length === 0 ? null : <SearchBarSkeleton />}
            </View>
          ) : (
            <View>
              {searchText.length !== 0 && (
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={forSearchData}
                  renderItem={({item}) => (
                    <TouchableNativeFeedback
                      onPress={() =>
                        handleOnPressEvent(item.Key, item.title, item.image)
                      }>
                      <View style={styles.renderItem}>
                        <Image
                          source={{uri: item.image}}
                          style={{
                            width: 100,
                            resizeMode: 'stretch',
                            height: 150,
                          }}
                        />
                        <View style={{padding: 10, flex: 1}}>
                          <Text
                            style={{color: '#fff', fontSize: 25}}
                            numberOfLines={1}>
                            {item.title}
                          </Text>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#193459', fontSize: 15}}>
                              Release Year :{' '}
                            </Text>
                            <Text style={{color: '#fff'}}>{item.year}</Text>
                          </View>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#193459', fontSize: 15}}>
                              Genres :
                            </Text>
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                marginLeft: 5,
                              }}>
                              {item.genres.map((item, index) => (
                                <View key={index} style={{marginRight: 5}}>
                                  <Text
                                    style={{color: '#fff'}}
                                    numberOfLines={1}>
                                    {item}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 10,
                            }}>
                            <Text style={{color: '#193459', fontSize: 15}}>
                              RunTime :
                            </Text>
                            <Text style={{color: '#fff', marginLeft: 5}}>
                              {item.runtime}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 10,
                            }}>
                            <Text style={{color: '#193459', fontSize: 15}}>
                              Available On :
                            </Text>
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                              }}>
                              {item.OTTlogo.map((item, index) => (
                                <View key={index} style={{marginRight: 5}}>
                                  <Image
                                    source={{uri: item.logo}}
                                    style={{width: 25, height: 25}}
                                  />
                                </View>
                              ))}
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableNativeFeedback>
                  )}
                  ListEmptyComponent={() => (
                    <View>
                      <Text
                        style={{
                          color: '#fff',
                          textAlign: 'center',
                          marginTop: 20,
                        }}>
                        No result found
                      </Text>
                    </View>
                  )}
                />
              )}
            </View>
          )}
        </View>
        <ScrollView>
          {searchText.length === 0 && (
            <View>
              <View>
                <View style={{padding: 10}}>
                  <Text style={{color: '#fff', fontSize: 20}}>Browse By</Text>
                </View>
                <View style={{padding: 15}}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableNativeFeedback
                      onPress={() => navigation.navigate('Kids')}>
                      <View style={styles.browseby}>
                        <Text style={{color: '#fff', fontWeight: 'bold'}}>
                          Kids
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                  <TouchableNativeFeedback
                    onPress={() => {
                      navigation.navigate('SearchModal', {
                        titleName: 'Web Series',
                        titleType: 'Language',
                        for: 'web series',
                      });
                    }}>
                    <View style={styles.browseby}>
                      <Text style={{color: '#fff', fontWeight: 'bold'}}>
                        Web Series
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
              <View>
                <View
                  style={{
                    padding: 10,
                    borderBottomWidth: 0.3,
                    borderBottomColor: 'gray',
                  }}>
                  <Text style={{color: '#fff', fontSize: 20}}>Genres</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('SearchModal', {
                      titleName: 'Drama',
                      titleType: 'Genres',
                      for: 'movie',
                    });
                  }}>
                  <View style={styles.genresStyle}>
                    <Text style={{color: 'gray'}}>Drama</Text>
                    <AntDesign name="right" color="gray" size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('SearchModal', {
                      titleName: 'Action',
                      titleType: 'Genres',
                      for: 'movie',
                    });
                  }}>
                  <View style={styles.genresStyle}>
                    <Text style={{color: 'gray'}}>Action</Text>
                    <AntDesign name="right" color="gray" size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('SearchModal', {
                      titleName: 'Romance',
                      titleType: 'Genres',
                      for: 'movie',
                    });
                  }}>
                  <View style={styles.genresStyle}>
                    <Text style={{color: 'gray'}}>Romance</Text>
                    <AntDesign name="right" color="gray" size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('SearchModal', {
                      titleName: 'Comedy',
                      titleType: 'Genres',
                      for: 'movie',
                    });
                  }}>
                  <View style={styles.genresStyle}>
                    <Text style={{color: 'gray'}}>Comedy</Text>
                    <AntDesign name="right" color="gray" size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('SearchModal', {
                      titleName: 'Thriller',
                      titleType: 'Genres',
                      for: 'movie',
                    });
                  }}>
                  <View style={styles.genresStyle}>
                    <Text style={{color: 'gray'}}>Thriller</Text>
                    <AntDesign name="right" color="gray" size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('SearchModal', {
                      titleName: 'Horror',
                      titleType: 'Genres',
                      for: 'movie',
                    });
                  }}>
                  <View style={styles.genresStyle}>
                    <Text style={{color: 'gray'}}>Horror</Text>
                    <AntDesign name="right" color="gray" size={20} />
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <View
                  style={{
                    padding: 10,
                    borderBottomWidth: 0.3,
                    borderBottomColor: 'gray',
                  }}>
                  <Text style={{color: '#fff', fontSize: 20}}>Languages</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('SearchModal', {
                      titleName: 'Hindi',
                      titleType: 'Language',
                      for: 'movie',
                    });
                  }}>
                  <View style={styles.genresStyle}>
                    <Text style={{color: 'gray'}}>Hindi</Text>
                    <AntDesign name="right" color="gray" size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('SearchModal', {
                      titleName: 'English',
                      titleType: 'Language',
                      for: 'movie',
                    });
                  }}>
                  <View style={styles.genresStyle}>
                    <Text style={{color: 'gray'}}>English</Text>
                    <AntDesign name="right" color="gray" size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('SearchModal', {
                      titleName: 'Tamil',
                      titleType: 'Language',
                      for: 'movie',
                    });
                  }}>
                  <View style={styles.genresStyle}>
                    <Text style={{color: 'gray'}}>Tamil</Text>
                    <AntDesign name="right" color="gray" size={20} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SearchBarScreen;

const styles = StyleSheet.create({
  searchbar: {
    backgroundColor: 'black',
    flex: 1,
    padding: 15,
  },
  input: {
    backgroundColor: '#193459',
    height: 40,
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  textInput: {
    backgroundColor: '#193459',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 5,
    borderWidth: 0.3,
    borderColor: 'whitesmoke',
    marginTop: 30,
  },
  renderItem: {
    flexDirection: 'row',
    marginTop: 10,
    overflow: 'hidden',
  },
  flatlist: {
    flex: 1,
    marginTop: 10,
  },
  browseby: {
    backgroundColor: '#193459',
    padding: 10,
    flex: 1,
    alignItems: 'center',
    margin: 5,
  },
  genresStyle: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#193459',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
