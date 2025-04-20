import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Typography} from '@/components/common';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '@/libs/utils';

interface ProfileInformationProps {
  avatarName?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  meterType?: string;
  email?: string;
  powerBoxId?: string;
  phoneNumber?: string;
}

export const ProfileInformation: React.FunctionComponent<
  ProfileInformationProps
> = ({avatarName, firstName, lastName, email, phoneNumber, powerBoxId}) => {
  const style = useThemedStyles(styles);

  return (
    <View testID="profile-information" style={style.container}>
      <View>
        <View style={style.avatar}>
          <Typography variant="h2" style={style.avatarText}>
            {avatarName}
          </Typography>
        </View>
      </View>
      <View style={style.content}>
        <Typography style={style.heading}>
          {firstName} {lastName}
        </Typography>
        <Typography style={style.body}>{email}</Typography>
        <Typography style={style.body}>{phoneNumber}</Typography>
        {powerBoxId && (
          <View style={style.boxIdContainer}>
            <Typography style={style.boxId} variant="b2">
             BOX ID: {powerBoxId}
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: pixelSizeHorizontal(24),
    },
    heading: {
      fontSize: theme.fontSize.l,
      fontFamily: theme.fonts.ManropeSemibold,
      color: theme.colors.white[100],
      lineHeight: heightPixel(20),
      textTransform: 'capitalize',
      marginBottom: pixelSizeVertical(4),
    },
    body: {
      fontSize: theme.fontSize.m,
      color: theme.colors.gray[400],
      lineHeight: heightPixel(16),
      marginBottom: pixelSizeVertical(10),
    },
    avatar: {
      backgroundColor: theme.colors.black[300],
      borderRadius: theme.radius.full,
      justifyContent: 'center',
      alignItems: 'center',
      height: 80,
      width: 80,
      paddingVertical: pixelSizeVertical(4),
      borderWidth: 0.3,
      borderColor: theme.colors.blue[300],
    },
    avatarText: {
      lineHeight: heightPixel(32),
      textTransform: 'uppercase',
      color: theme.colors.blue[300],
    },
    content: {
      marginLeft: pixelSizeHorizontal(16),
    },
    button: {
      borderRadius: 40,
      backgroundColor: theme.colors.gray[400],
      paddingHorizontal: pixelSizeHorizontal(8),
      paddingVertical: pixelSizeVertical(4),
    },
    boxIdContainer: {
      borderRadius: theme.radius.xxl,
      backgroundColor: theme.colors.black[300],
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: pixelSizeVertical(4),
      borderWidth: 0.3,
      borderColor: theme.colors.blue[300],
    },
    boxId: {
      color: theme.colors.blue[300],
      fontWeight: '500',
      fontFamily: theme.fonts.ManropeSemibold,
    },
  });
};
