import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {SvgIconProps} from './type';

export const RechargeIcon: React.FunctionComponent<SvgIconProps> = ({
  color = '#fff',
  size = '24',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m41.426 19.656l-9.81 9.81l6.54 6.541c-7.225 7.225-18.938 7.225-26.163 0s-7.225-18.937 0-26.162l13.08 13.08l-18.5 18.5M28.344 6.574l-7.358 7.358"
      />
    </Svg>
  );
};
