import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {SvgIconProps} from './type';
import {theme} from '@/libs/config/theme';

export const ChargingBatteryIcon: React.FunctionComponent<SvgIconProps> = ({
  color = theme.colors.green[400],
  size = '24',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M18 6a2 2 0 0 1 2 2v1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2v1a2 2 0 0 1-2 2h-5.101l2.664-4.441c.986-1.642.197-3.65-1.405-4.325l.415-.69c.478-.799.543-1.73.255-2.544z"
        opacity="0.3"
      />
      <Path
        fill={color}
        d="M11.142 6.486a1 1 0 0 1 1.77.925l-.055.104L10.768 11h2.215c.746 0 1.221.773.92 1.427l-.054.103l-2.99 4.985a1 1 0 0 1-1.77-.926l.055-.104L11.233 13H9.019a1.01 1.01 0 0 1-.92-1.427l.054-.103l2.99-4.984z"
      />
      <Path
        fill={color}
        d="m9.101 6l-2.664 4.441c-.953 1.587-.247 3.516 1.247 4.253l.158.072l-.414.69a3 3 0 0 0-.317 2.354l.06.19H4a2 2 0 0 1-1.995-1.85L2 16V8a2 2 0 0 1 1.85-1.994L4 6z"
        opacity="0.3"
      />
    </Svg>
  );
};
