import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {
  ActiveRadioIcon,
  Button,
  CloseIcon,
  LogoutIcon,
  RadioIcon,
  Typography,
} from '@/components/common';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
  saveToAsyncStore,
  USER_SESSION,
} from '@/libs/utils';
import {TextField} from '@/components/common/form-group';
import authInstance from '@/libs/server/Auth';
import {useAuthContext} from '@/libs/context';
import {BackDrop} from '@/components/common/modal/BackDrop';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackScreens} from '@/navigation/type';
import {SettingCard} from '@/components/settings';

export const LinkAccountScreen: React.FunctionComponent = () => {
  const [selectedOption, setSelectedOption] = useState<'id' | 'qr' | undefined>(
    undefined,
  );
  const [idInput, setIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const [startScan, setStartScan] = useState(false);
  const {user, updateUser, clearUser} = useAuthContext();
  const style = useThemedStyles(styles);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackScreens>>();

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleProceed = () => {
    if (selectedOption === 'id' && idInput.length === 13) {
      linkDevice(idInput);
      return;
    }
    if (selectedOption === 'id' && idInput.length !== 13) {
      Alert.alert('Error', 'Please enter a valid ID.');
      return;
    } else {
      Alert.alert('Error', 'Please select an option');
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      const powrBoxId = codes[0]?.value;
      setStartScan(false);
      setSelectedOption(undefined);
      if (powrBoxId?.length === 13) {
        linkDevice(powrBoxId);
      } else {
        Alert.alert('Error', 'Please scan a valid ID.');
      }
    },
  });

  async function linkDevice(powerBoxId: string) {
    try {
      setIsLoading(true);
      if (user?.userId) {
        await authInstance.updateUserDeviceLink(user?.userId, powerBoxId);
        showMessage({
          message: `Your account has bee successfully linked to this PowerBox (${powerBoxId})`,
          type: 'success',
          position: 'top',
        });
        const updatedUserData = {...user, powerBoxId, isDeviceLinked: true};
        await saveToAsyncStore(USER_SESSION, updatedUserData);
        updateUser(updatedUserData);
        navigation.navigate<any>('Dashboard', {screen: 'Home'});
      }
    } catch (error) {
      Alert.alert('Error: Linking Device');
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      setIsLoading(true);
      await authInstance.logout();
      clearUser();
    } catch (error) {
      Alert.alert(authInstance.handleError(error));
      clearUser();
    } finally {
      setIsLoading(false);
    }
  }

  const requestToLogout = () => {
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: logout,
        },
      ],
      {cancelable: false},
    );
  };

  const handleAction = (screen: string) => {
    switch (screen) {
      case 'logout':
        requestToLogout();
        return;
    }
  };

  if (device == null) {
    return (
      <View>
        <Typography>Device Not Found</Typography>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <BackDrop isLoading={isLoading} />
      <View>
      {startScan && (
        <View style={style.closeContainer}>
          <View />
          <TouchableOpacity
            onPress={() => setStartScan(false)}
            style={style.closeIcon}>
            <CloseIcon size={32} />
          </TouchableOpacity>
        </View>
      )}

      <Typography style={style.header}>
        Link Your Account to Power Box
      </Typography>
      <View style={style.optionsContainer}>
        <TouchableOpacity
          style={[
            style.option,
            selectedOption === 'id' && style.selectedOption,
          ]}
          onPress={() => setSelectedOption('id')}>
          <View style={style.inputContainer}>
            <Typography style={style.optionText}>
              By typing the ID directly
            </Typography>
            {selectedOption === 'id' && (
              <TextField
                placeholder="Enter Power Box ID"
                value={idInput}
                onChangeText={setIdInput}
                style={style.inputField}
                keyboardType="number-pad"
              />
            )}
          </View>
          <View>
            {selectedOption === 'id' ? <ActiveRadioIcon /> : <RadioIcon />}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            style.option,
            selectedOption === 'qr' && style.selectedOption,
          ]}
          onPress={() => {
            setSelectedOption('qr');
            setStartScan(true);
          }}>
          <View>
            <Typography style={style.optionText}>Via QR code scan</Typography>
            {selectedOption === 'qr' && (
              <Typography style={style.optionSubText}>
                Scan the QR code on your Power Box.
              </Typography>
            )}
          </View>
          <View>
            {selectedOption === 'qr' ? <ActiveRadioIcon /> : <RadioIcon />}
          </View>
        </TouchableOpacity>
      </View>
      <Button variant="contained" onPress={handleProceed}>
        Proceed
      </Button>
      {startScan && (
        <Camera
          style={StyleSheet.absoluteFill}
          codeScanner={codeScanner}
          device={device}
          isActive={true}
        />
      )}
      </View>

      <SettingCard
        screen={'logout'}
        image={<LogoutIcon />}
        onPress={handleAction}
        title={'Logout'}
      />
    </View>
  );
};

const styles = ({colors, spacing, radius}: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: pixelSizeVertical(16),
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: colors.black[100],
      justifyContent:'space-between'
    },
    closeIcon: {
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 40,
    },
    closeContainer: {
      zIndex: 99999,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    header: {
      textAlign: 'center',
      marginBottom: spacing.lg,
      color: colors.white[100],
    },
    optionsContainer: {
      marginBottom: spacing.xl,
    },
    option: {
      padding: spacing.m,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.gray[600],
      marginBottom: spacing.xl,
      backgroundColor: colors.black[200],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectedOption: {
      borderColor: colors.blue[200],
      // backgroundColor: colors.blue[200],
    },
    optionText: {
      fontSize: 18,
      color: colors.white[100],
      marginBottom: spacing.sm,
    },
    optionSubText: {
      fontSize: 14,
      color: colors.white[300],
    },
    inputField: {
      marginTop: spacing.sm,
      color: colors.black[100],
      backgroundColor: colors.gray[100],
    },
    inputContainer: {
      flexBasis: '75%',
    },
  });
};
