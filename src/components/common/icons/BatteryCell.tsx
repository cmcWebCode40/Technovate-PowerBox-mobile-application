

import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {SvgIconProps} from './type';

export const BatteryCellIcon: React.FunctionComponent<SvgIconProps> = ({
  color = '#0275D8',
  size = '24',
}) => {
  return (
<Svg width={size} height={size} viewBox="0 0 64 64">
    <Path fill={color} d="M48 6h-6V4c0-1.1-.9-2-2-2H24c-1.1 0-2 .9-2 2v2h-6a4.01 4.01 0 0 0-4 4v48c0 2.199 1.799 4 4 4h32c2.199 0 4-1.801 4-4V10c0-2.201-1.801-4-4-4m1 48c0 .541-.459 1-1 1H16c-.543 0-1-.459-1-1V14c0-.543.457-1 1-1h32c.541 0 1 .457 1 1z"/>
    <Path fill={color} d="M44 17H20c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2m0 13H20c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2m0 13H20c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2"/>
    </Svg>


  );
};
