import React from 'react';
import {G, Path, Svg} from 'react-native-svg';
import {SvgIconProps} from './type';
import {theme} from '@/libs/config/theme';

export const IndicatorIcon: React.FunctionComponent<SvgIconProps> = ({
  color = theme.colors.green[400],
}) => {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16">
      <G fill={color}>
        <Path d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1z" />
        <Path d="M16 3a3 3 0 1 1-6 0a3 3 0 0 1 6 0" />
      </G>
    </Svg>
  );
};
