import { Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import Video from 'react-native-video';

const VideoBackground = () => {
  return (
    <Video
        source={require('../../../../assets/galaxy.mp4')}
        style={style.backgroundVideo}
        muted={true}
        repeat={true}
        resizeMode="cover"
        rate={1.0}
        ignoreSilentSwitch="obey"
      />
  );
};

export default VideoBackground;


const style = StyleSheet.create({
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });
