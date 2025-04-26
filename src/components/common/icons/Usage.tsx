import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {SvgIconProps} from './type';
import {theme} from '@/libs/config/theme';

export const UsageIcon: React.FunctionComponent<SvgIconProps> = ({
  color = theme.colors.gray[500],
  size = '21',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        fill={color}
        d="M13 28V5.828l7.586 7.586L22 12L12 2L2 12l1.414 1.414L11 5.83V28a2 2 0 0 0 2 2h15v-2z"
      />
    </Svg>
  );
};
