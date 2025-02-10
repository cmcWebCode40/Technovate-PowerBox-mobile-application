import React from 'react';
import {Circle, G, Path, Svg} from 'react-native-svg';
import {SvgIconProps} from './type';
import {theme} from '@/libs/config/theme';

export const TransactionIcon: React.FunctionComponent<SvgIconProps> = ({
    size = '24',
  color = theme.colors.orange[400],
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G fill="none" stroke={color}>
        <Circle cx="5.5" cy="7.5" r="1" />
        <Path strokeLinecap="round" d="M8.5 6.5h11m-11 2h6" />
        <Circle cx="5.5" cy="12" r="1" />
        <Path strokeLinecap="round" d="M8.5 11h8m-8 2h7" />
        <Circle cx="5.5" cy="16.5" r="1" />
        <Path strokeLinecap="round" d="M8.5 15.5H18m-9.5 2h4" />
      </G>
    </Svg>
  );
};
