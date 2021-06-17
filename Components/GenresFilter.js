import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import RNBounceable from '@freakycoder/react-native-bounceable';

const GenresFilter = () => {
  const getOttDetail = useSelector((state) => state.filter.filterData);
  const Genres = getOttDetail.filter((data) => data.type === 'Genres');
  return (
    <View style={styles.genresContainer}>
      <View style={styles.title}>
        <Text style={{color: '#fff', fontSize: 20}}>
          Browse your movies acc. to Genres
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {Genres.map((item, index) => (
          <RNBounceable
            key={index}
            style={{
              flexDirection: 'row',
              backgroundColor: 'tomato',
              margin: 10,
              padding: 10,
              justifyContent: 'center',
              borderRadius: 20,
            }}>
            <Text style={{color: '#fff'}}>{item.label}</Text>
          </RNBounceable>
        ))}
      </ScrollView>
    </View>
  );
};

export default GenresFilter;

const styles = StyleSheet.create({
  genresContainer: {
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
});
