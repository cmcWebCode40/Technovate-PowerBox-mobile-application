import LottieView from 'lottie-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {ModalProps, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Button, Modal, Typography} from '../common';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {heightPixel, widthPixel, fontPixel, pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {colors} from '@/libs/constants';
import { SheetManager } from 'react-native-actions-sheet';

interface FirmwareInfo {
  newVersion: string;
  currentVersion: string;
}

interface NotificationModalProps extends Omit<ModalProps, 'children'> {
  onProceed?: () => void;
  firmwareInfo?: FirmwareInfo;
  loading?: boolean;
}

const NotificationModal: React.FunctionComponent<NotificationModalProps> = ({
  onProceed,
  firmwareInfo = {
    newVersion: '1.3.0',
    currentVersion: '1.1.1',
  },
  loading = false,
  ...otherModalProps
}) => {
  const [openModal, setOpenModal] = useState(true);
  const animation = useRef<LottieView>(null);
  const styles = useThemedStyles(createStyles);

  const hasNewUpdate = firmwareInfo.newVersion.length > 5 && firmwareInfo.currentVersion.length > 5 && firmwareInfo.newVersion !== firmwareInfo.currentVersion;

  useEffect(() => {

    if (!hasNewUpdate) {
      setOpenModal(true);
    }

  }, [firmwareInfo.currentVersion, firmwareInfo.newVersion, hasNewUpdate]);


  const handleClose = ()=>{
    setOpenModal(false);
  };

  const connectToBluetooth = ()=>{
    handleClose();
    SheetManager.show('bluetooth-connect-sheet');
  }


  return (
    <Modal onClose={handleClose} visible={openModal} {...otherModalProps}>
      <View style={styles.container}>
        <LottieView
          autoPlay
          loop
          ref={animation}
          style={styles.lottieContainer}
          source={require('../../../assets/new_notification.json')}
          key={'firmware-update'}
        />
        <View style={styles.content}>
          <Typography style={styles.title}>
            Firmware Update Available
          </Typography>
          <View style={styles.versionContainer}>
            <View style={styles.versionBadge}>
              <Typography style={styles.versionLabel}>New</Typography>
              <Typography style={styles.versionText}>
                {firmwareInfo.newVersion}
              </Typography>
            </View>
            <Typography style={styles.arrow}>→</Typography>
            <View style={[styles.versionBadge, styles.currentVersionBadge]}>
              <Typography style={styles.currentVersionLabel}>Current</Typography>
              <Typography style={styles.currentVersionText}>
                {firmwareInfo.currentVersion}
              </Typography>
            </View>
          </View>
          <View style={styles.actionContainer}>
            <Button
              style={styles.installButton}
              textStyles={styles.installButtonText}
              onPress={onProceed}
              loading={loading}
              disabled={loading}
              variant="contained"
            >
              {loading ? 'Installing...' : 'Install Update'}
            </Button>
            {!loading && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Typography style={styles.skipButtonText}>
                  Skip for Now
                </Typography>
              </TouchableOpacity>
            )}
          </View>

          {/* Warning Text */}
          <Typography style={styles.warningText}>
            ⚠️ Keep device connected during update
          </Typography>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationModal;

const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    lottieContainer: {
      width: widthPixel(140),
      height: heightPixel(100),
      marginBottom: pixelSizeVertical(8),
      alignSelf: 'center',
    },
    content: {
      width: '100%',
      paddingHorizontal: pixelSizeHorizontal(20),
      paddingVertical: pixelSizeVertical(14),
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      shadowColor: theme.colors.black[100],
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    title: {
      fontSize: fontPixel(theme.fontSize.l),
      fontFamily: theme.fonts.ManropeBold,
      color: theme.colors.white[100],
      textAlign: 'center',
      marginBottom: pixelSizeVertical(16),
      marginTop:-20,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    versionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: pixelSizeHorizontal(10),
      marginBottom: pixelSizeVertical(20),
    },
    versionBadge: {
      backgroundColor: colors.blue[400],
      paddingHorizontal: pixelSizeHorizontal(14),
      paddingVertical: pixelSizeVertical(7),
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      minWidth: widthPixel(66),
    },
    currentVersionBadge: {
      backgroundColor: theme.colors.black[300],
    },
    versionLabel: {
      fontSize: fontPixel(10),
      fontFamily: theme.fonts.ManropeSemibold,
      color: colors.white[100],
      textTransform: 'uppercase',
      marginBottom: 1,
    },
    currentVersionLabel: {
      color: theme.colors.white[300],
      fontSize: fontPixel(10),
      fontFamily: theme.fonts.ManropeSemibold,
      textTransform: 'uppercase',
      marginBottom: 1,
    },
    versionText: {
      fontSize: fontPixel(10),
      fontFamily: theme.fonts.ManropeBold,
      color: colors.white[100],
      fontWeight: '700',
    },
    currentVersionText: {
      color: theme.colors.white[100],
      fontSize: fontPixel(10),
      fontFamily: theme.fonts.ManropeBold,
      fontWeight: '700',
    },
    arrow: {
      fontSize: fontPixel(18),
      color: theme.colors.white[300],
      fontWeight: 'bold',
    },
    sizeContainer: {
      marginBottom: pixelSizeVertical(16),
      alignItems: 'center',
    },
    sizeText: {
      fontSize: fontPixel(theme.fontSize.s),
      fontFamily: theme.fonts.ManropeRegular,
      color: theme.colors.white[300],
      textAlign: 'center',
    },
    actionContainer: {
      width: '100%',
      gap: pixelSizeVertical(11),
      marginBottom: pixelSizeVertical(12),
      alignItems: 'center',
    },
    installButton: {
      // backgroundColor: colors.blue[400],
      borderRadius: theme.radius.lg,
      paddingVertical: pixelSizeVertical(12),
      width: '100%',
    },
    installButtonText: {
      fontSize: fontPixel(theme.fontSize.m),
      fontFamily: theme.fonts.ManropeBold,
      color: colors.white[100],
      fontWeight: '700',
    },
    skipButton: {
      paddingVertical: pixelSizeVertical(10),
      alignItems: 'center',
      width: '100%',
    },
    skipButtonText: {
      fontSize: fontPixel(theme.fontSize.s),
      fontFamily: theme.fonts.ManropeRegular,
      color: theme.colors.white[300],
      fontWeight: '500',
      textDecorationLine: 'underline',
    },
    warningText: {
      fontSize: fontPixel(theme.fontSize.s),
      fontFamily: theme.fonts.ManropeRegular,
      color: theme.colors.white[300],
      textAlign: 'center',
      lineHeight: fontPixel(16),
      marginTop: pixelSizeVertical(8),
    },
  });
};
