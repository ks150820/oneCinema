import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const FeaturedSkeleton = () => {
  return (
    <SkeletonPlaceholder
      backgroundColor="rgba(25,52,89,0.5)"
      highlightColor="#193459">
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
      </View>
    </SkeletonPlaceholder>
  );
};

export default FeaturedSkeleton;

const styles = StyleSheet.create({
  Skeleton: {
    width: 190,
    height: 250,
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
  },
});
