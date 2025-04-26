import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {LargePlugIcon, SwitchIcon, Typography} from '../common';
import {fontPixel, pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {colors} from '@/libs/constants';
import LineImage from '../../../assets/images/line.png';

interface EnergyDeviceCardProps {
  upsFlag:boolean;
  voltage?: number;
  power: string;
  socketNo?: string;
  balance:number
  upsFlagHandler:(state:boolean)=>void
}

export const EnergyDeviceCard: React.FunctionComponent<
  EnergyDeviceCardProps
> = ({ upsFlag, power, voltage, balance, socketNo, upsFlagHandler}) => {
  const {green} = colors;
  const mainStyle = useThemedStyles(styles);


  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={mainStyle.container}>
      <View style={mainStyle.cardHeader}>
        <View style={mainStyle.subHeader}>
          <LargePlugIcon />
          <View>
            <Typography style={mainStyle.headerTitle}>
              Overview
            </Typography>
            <Typography style={mainStyle.caption}>{balance} Unit</Typography>
          </View>
        </View>
        <View
          style={[
            mainStyle.status,
            {backgroundColor: green[700]},
          ]}>
          <Typography
            style={[
              mainStyle.statusText,
              {color:green[600]},
            ]}>
            {socketNo}
          </Typography>
        </View>
      </View>
      <View style={mainStyle.footer}>
        <View style={mainStyle.ups}>
          <Typography style={mainStyle.title}>UPS Mode</Typography>
          <SwitchIcon onChange={upsFlagHandler}  isEnabled={upsFlag} />
        </View>
        <Image source={LineImage} />
        <View>
          <Typography variant="b1" style={mainStyle.reading}>
            {power} W
          </Typography>
          <Typography variant="b1" style={mainStyle.reading}>
            {voltage} V
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    btnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: pixelSizeHorizontal(16),
      marginTop: pixelSizeVertical(8),
    },
    btnFooter: {
      width: '50%',
    },
    btnSpaceRight: {},
    btnSpaceLeft: {
      marginLeft: pixelSizeHorizontal(4),
      borderRadius: theme.radius.lg,
    },
    container: {
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 10,
      shadowRadius: 6.65,
      elevation: 4,
      borderWidth: 1,
      borderRadius: theme.radius.lg,
      shadowColor: theme.colors.black[100],
      backgroundColor: theme.colors.black[200],
      paddingVertical: pixelSizeVertical(16),
      marginBottom: pixelSizeVertical(24),
    },
    headerTitle: {
      fontSize: fontPixel(24),
      textTransform: 'capitalize',
      fontFamily: theme.fonts.ManropeBold,
    },
    status: {
      borderRadius: theme.radius.xxl,
      paddingVertical: pixelSizeVertical(8),
      paddingHorizontal: pixelSizeHorizontal(8),
      marginTop: '2%',
      marginRight: pixelSizeHorizontal(8),
    },
    statusText: {
      fontWeight:'700',
      textTransform: 'uppercase',
      fontSize: fontPixel(theme.fontSize.s),
    },
    subHeader: {
      flexDirection: 'row',
    },
    caption: {
      marginTop: pixelSizeVertical(12),
      color: theme.colors.blue[200],
      fontSize: fontPixel(16),
    },
    cardHeader: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: pixelSizeVertical(-24),
    },
    powerRating: {
      fontSize: fontPixel(theme.fontSize.m),
    },
    btn: {
      flexBasis: '60%',
    },
    title: {
      fontSize: fontPixel(20),
      marginVertical: pixelSizeVertical(8),
      color: theme.colors.blue[200],
      marginRight:pixelSizeHorizontal(10)
    },
    deviceId: {
      fontSize: fontPixel(theme.fontSize.s),
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // marginTop: pixelSizeVertical(-8),
      paddingHorizontal: pixelSizeVertical(12),
    },
    reading: {
      fontFamily: theme.fonts.ManropeBold,
      color: theme.colors.blue[200],
    },
    switch: {
      marginTop: pixelSizeVertical(8),
    },
    ups:{
      justifyContent:'space-between',
      alignItems:'center',
      flexDirection:'row',
    },
  });
};
