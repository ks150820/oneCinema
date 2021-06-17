import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SearchBarSkeleton = () => {
  return (
    <SkeletonPlaceholder
      backgroundColor="rgba(25,52,89,0.5)"
      highlightColor="#193459">
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
        <View style={styles.image} />
        <View style={{marginLeft: 20}}>
          <View style={{width: 120, height: 20, borderRadius: 4}} />
          <View
            style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
          />
          <View
            style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
          />
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
        <View style={styles.image} />
        <View style={{marginLeft: 20}}>
          <View style={{width: 120, height: 20, borderRadius: 4}} />
          <View
            style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
          />
          <View
            style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default SearchBarSkeleton;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 150,
    borderRadius: 5,
  },
});
