import {Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Button, Typography} from '@/components/common';
import {useThemedStyles} from '@/libs/hooks';
import {FormGroup} from '@/components/common/form-group';
import * as Yup from 'yup';
import {Theme} from '@/libs/config/theme';
import {
  USER_SESSION,
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  saveToAsyncStore,
} from '@/libs/utils';
import {useAuthContext} from '@/libs/context';
import {Formik} from 'formik';
import AppLogo from '../../assets/images/power_box_logo.webp';
import {Spinner} from '@/components/common/loader/index.';
import {AuthStackScreens} from '@/navigation/type';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import authInstance from '@/libs/server/Auth';
import {UserInfo} from '@/libs/types/auth';
import { saveTokenExpiration } from '@/libs/utils/authHelper';
import { ScreenLayout } from '@/components/common/layout';

export const SignInSchema = Yup.object().shape({
  email: Yup.string().required('Email is required!').trim(),
  password: Yup.string().required('Password is required!').trim(),
});

const isDev  = process.env.NODE_ENV === 'development';

const formInitialValues = {
  email:  isDev ? 'infinity_michael@yahoo.com' : '',
  password: isDev ? '1234567890' : '',
};

export const SignInScreen: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {updateUser, isLoadingSession} = useAuthContext();
  const style = useThemedStyles(styles);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackScreens>>();

  const handleLogin = async (payload: typeof formInitialValues) => {
    try {
      setIsLoading(true);
      const trimmedEmail = payload.email.trim()
      const session = await authInstance.signIn(
        trimmedEmail,
        payload.password,
      );
      const user = await authInstance.getUserProfile(session.uid);
      const userInfo: UserInfo = {
        ...user,
        userId: session.uid,
        emailVerified: session.emailVerified,
        creationTime: session.metadata.creationTime,
      };
      await saveToAsyncStore(USER_SESSION, userInfo);
      const DEFAULT_SESSION_EXPIRATION = 12 * 60 * 60; // 3 hours in seconds
      await saveTokenExpiration(DEFAULT_SESSION_EXPIRATION);
      updateUser(userInfo);
    } catch (error) {
      console.log('=========ERROR===========================');
      console.log(error);
      console.log('====================================');
      Alert.alert('Login Error:', authInstance.handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = () => {
    navigation.navigate('SignUp');
  };

  if (isLoadingSession) {
    return (
      <ScreenLayout style={style.container}>
        <Spinner loading />
      </ScreenLayout>
    );
  }
  return (
    <ScreenLayout style={style.container}>
      <ScrollView>
      <View style={style.header}>
        <Image source={AppLogo} />
      </View>
      <Formik
        enableReinitialize={true}
        initialValues={formInitialValues}
        onSubmit={handleLogin}
        validationSchema={SignInSchema}>
        {({
          values,
          isValid,
          errors,
          handleChange,
          setFieldTouched,
          handleSubmit,
        }) => (
          <>
            <View style={style.space}>
              <FormGroup
                onChangeText={handleChange('email')}
                onBlur={() => setFieldTouched('email')}
                value={values.email}
                editable={!isLoading}
                errorMessage={errors.email}
                placeholder="Enter email"
              />
            </View>
            <View>
              <FormGroup
                onChangeText={handleChange('password')}
                onBlur={() => setFieldTouched('password')}
                value={values.password}
                editable={!isLoading}
                errorMessage={errors.password}
                placeholder="Enter password"
                usePassword={true}
              />
            </View>
            <Button
              loading={isLoading}
              disabled={!isValid || isLoading}
              onPress={() => {
                handleSubmit();
              }}
              style={style.button}
              variant="contained">
              Login
            </Button>
          </>
        )}
      </Formik>
      <TouchableOpacity onPress={signIn} style={style.footer}>
        <Typography variant="b1" style={style.footerText}>
          Don't have an account? Create one now.
        </Typography>
      </TouchableOpacity>
      </ScrollView>
     
    </ScreenLayout>
  );
};

const styles = ({colors, fontSize, fonts}: Theme) => {
  return StyleSheet.create({
    space: {
      marginBottom: pixelSizeVertical(24),
    },
    error: {
      color: colors.red[100],
      marginBottom: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: pixelSizeVertical(24),
    },
    title: {
      fontSize: fontPixel(fontSize.xxl),
      fontFamily: fonts.ManropeBold,
      fontWeight: '700',
      textAlign: 'center',
    },
    button: {
      marginTop: pixelSizeVertical(40),
      backgroundColor: colors.blue[300],
    },
    container: {
      // justifyContent: 'center',
    },
    text: {
      color: colors.gray[200],
      fontSize: fontPixel(fontSize.s),
      marginLeft: pixelSizeHorizontal(4),
    },
    footer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: pixelSizeVertical(24),
    },
    footerText: {
      textAlign: 'center',
      color: colors.blue[100],
      fontWeight: '600',
      lineHeight: 24,
      textDecorationLine: 'underline',
      fontFamily: fonts.ManropeBold,
    },
  });
};
