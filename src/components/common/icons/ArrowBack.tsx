import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {SvgIconProps} from './type';
import {theme} from '@/libs/config/theme';

export const ArrowBackIcon: React.FunctionComponent<SvgIconProps> = ({
  color = theme.colors.white[100],
  size = '29',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      <Path
        fill={color}
        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64"
      />
      <Path
        fill={color}
        d="m237.248 512l265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312z"
      />
    </Svg>
  );
};
