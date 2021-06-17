import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkeletopnForViewAll = () => {
  return (
    <SkeletonPlaceholder
      backgroundColor="rgba(25,52,89,0.5)"
      highlightColor="#193459">
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.Skeleton} />
        <View style={styles.Skeleton} />
      </View>
    </SkeletonPlaceholder>
  );
};

export default SkeletopnForViewAll;

const styles = StyleSheet.create({
  Skeleton: {
    width: 180,
    height: 250,
    borderRadius: 10,
    margin: 5,
  },
});
