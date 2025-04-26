import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Button, Typography} from '@/components/common';
import {useThemedStyles} from '@/libs/hooks';
import {FormGroup} from '@/components/common/form-group';
import * as Yup from 'yup';
import {Theme} from '@/libs/config/theme';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {Formik} from 'formik';
import AppLogo from '../../assets/images/power_box_logo.webp';
import {PhoneNumberInput} from '@/components/common/phone-number-input';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackScreens} from '@/navigation/type';
import authInstance from '@/libs/server/Auth';
import {showMessage} from 'react-native-flash-message';

const phoneRegExp = /^0[789]\d{9}$/;
export const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email is not valid!')
    .required('Email name is required!')
    .trim()
    .lowercase(),
  firstName: Yup.string().required('First name is required!').trim(),
  lastName: Yup.string().required('Last name is required!').trim(),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid (e.g 070xxxx)')
    .required('Phone number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required!'),
  confirmPassword: Yup.string()
    .min(8, 'Confirm password must be at least 8 characters')
    .oneOf([Yup.ref('password')], 'Passwords are not the same!')
    .required('Password confirmation is required!'),
});

const isDev = process.env.NODE_ENV === 'development';

const formInitialValues = {
  email: isDev ? 'infinity_michael@yahoo.com' : '',
  firstName: isDev ? 'Michael' : '',
  lastName: isDev ? 'Chinweike' : '',
  password: isDev ? '1234567890' : '',
  phoneNumber: isDev ? '08165084064' : '',
  confirmPassword: isDev ? '1234567890' : '',
};

export const SignupScreen: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const style = useThemedStyles(styles);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackScreens>>();

  const handleSignUp = async (payload: typeof formInitialValues) => {
    try {
      setIsLoading(true);
      const {email, firstName, lastName, password, phoneNumber} = payload;
      const trimmedEmail = email.trim();
      await authInstance.signUp(
        firstName,
        lastName,
        trimmedEmail,
        phoneNumber,
        password,
      );
      showMessage({
        message: 'Your account has been successfully created.',
        type: 'success',
      });
      signIn();
    } catch (error) {
      Alert.alert('Signup Error:', authInstance.handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  function signIn() {
    navigation.navigate('SignIn');
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Image style={style.image} source={AppLogo} />
      </View>
      <ScrollView>
        <Formik
          enableReinitialize={true}
          onSubmit={handleSignUp}
          initialValues={formInitialValues as any}
          validationSchema={SignUpSchema}>
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
              <View style={style.space}>
                <FormGroup
                  onChangeText={handleChange('firstName')}
                  onBlur={() => setFieldTouched('firstName')}
                  value={values.firstName}
                  editable={!isLoading}
                  errorMessage={errors.firstName}
                  placeholder="Enter first name"
                />
              </View>
              <View style={style.space}>
                <FormGroup
                  onChangeText={handleChange('lastName')}
                  onBlur={() => setFieldTouched('lastName')}
                  value={values.lastName}
                  editable={!isLoading}
                  errorMessage={errors.lastName}
                  placeholder="Enter last name"
                />
              </View>
              <View style={style.space}>
                <PhoneNumberInput
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={() => setFieldTouched('phoneNumber')}
                  value={values.phoneNumber}
                  editable={!isLoading}
                  errorMessage={errors.phoneNumber}
                  placeholder="Phone number"
                />
              </View>
              <View style={style.space}>
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
              <View style={style.space}>
                <FormGroup
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={() => setFieldTouched('confirmPassword')}
                  value={values.confirmPassword}
                  editable={!isLoading}
                  errorMessage={errors.confirmPassword}
                  placeholder="Confirm password"
                  usePassword={true}
                />
              </View>
              <View style={style.submitButton}>
                <Button
                  loading={isLoading}
                  testID="sign-up"
                  disabled={!isValid || isLoading}
                  onPress={() => {
                    handleSubmit();
                  }}
                  variant="contained">
                  Sign Up
                </Button>
              </View>
            </>
          )}
        </Formik>
        <TouchableOpacity onPress={signIn} style={style.footer}>
          <Typography variant="b1" style={style.footerText}>
            Already have an account? Sign In.
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = ({colors, fonts}: Theme) => {
  return StyleSheet.create({
    space: {
      marginBottom: pixelSizeVertical(24),
    },
    image: {height: 150, width: 150},
    error: {
      color: colors.red[100],
      marginBottom: 10,
    },
    submitButton: {
      marginTop: pixelSizeVertical(16),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      paddingVertical: pixelSizeVertical(16),
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: colors.black[100],
      justifyContent: 'center',
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
