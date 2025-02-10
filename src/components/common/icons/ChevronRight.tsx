import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {SvgIconProps} from './type';

export const ChevronRightIcon: React.FunctionComponent<SvgIconProps> = ({
  color = '#307399',
  size = '20',
}) => {
  return (
    <Svg
      accessibilityHint="chevron right"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4818 9.99982L5.34175 16.2468C4.92575 16.6108 4.88375 17.2428 5.24775 17.6578C5.61175 18.0738 6.24375 18.1158 6.65875 17.7528L14.6587 10.7518C15.1138 10.3538 15.1138 9.64582 14.6587 9.24782L6.65875 2.24782C6.24375 1.88382 5.61175 1.92582 5.24775 2.34082C4.88375 2.75682 4.92575 3.38882 5.34175 3.75182L12.4818 9.99982Z"
        fill={color}
      />
    </Svg>
  );
};
