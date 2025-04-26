import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {SvgIconProps} from './type';
import {theme} from '@/libs/config/theme';

export const BatteryIcon: React.FunctionComponent<SvgIconProps> = ({
  color = theme.colors.blue[100],
  size = '29',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Path
        fill={color}
        d="M18.59 11.77a1 1 0 0 0-1.73 1l2.5 4.34l-6.07-1l5.29 10.59a1 1 0 0 0 1.79-.89l-3.53-7.08l6.38 1.06Z"
      />
      <Path
        fill={color}
        d="M25.12 4H23v-.42A1.58 1.58 0 0 0 21.42 2h-6.84A1.58 1.58 0 0 0 13 3.58V4h-2.12A1.88 1.88 0 0 0 9 5.88v26.24A1.88 1.88 0 0 0 10.88 34h14.24A1.88 1.88 0 0 0 27 32.12V5.88A1.88 1.88 0 0 0 25.12 4M25 32H11V6h4V4h6v2h4Z"
      />
      <Path fill="none" d="M0 0h36v36H0z" />
    </Svg>
  );
};
