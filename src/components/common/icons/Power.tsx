import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {SvgIconProps} from './type';

export const PowerSupplyIcon: React.FunctionComponent<SvgIconProps> = ({
  color = '#519E47',
  size = '23',
}) => {
    const actualWidth = Number(size) - 1 ?? '22';
  return (
    <Svg width={actualWidth.toString()} height={size} testID="power-switch" viewBox="0 0 21 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.86523 9.83594C8.86523 10.5879 9.34375 11.0957 10.0566 11.0957C10.7793 11.0957 11.2578 10.5879 11.2578 9.83594V1.39844C11.2578 0.636719 10.7793 0.138672 10.0566 0.138672C9.34375 0.138672 8.86523 0.636719 8.86523 1.39844V9.83594ZM0.0273438 9.95898C0.0273438 15.457 4.55859 19.9883 10.0566 19.9883C15.5547 19.9883 20.0957 15.457 20.0957 9.95898C20.0957 7.11719 18.8848 4.5293 16.9805 2.76172C15.877 1.6582 14.168 3.10352 15.3984 4.35352C16.873 5.74023 17.8008 7.74219 17.8008 9.95898C17.8008 14.2461 14.3438 17.6934 10.0566 17.6934C5.76953 17.6934 2.32227 14.2461 2.32227 9.95898C2.32227 7.74219 3.25 5.75 4.72461 4.35352C5.95508 3.10352 4.24609 1.6582 3.13281 2.76172C1.23828 4.5293 0.0273438 7.11719 0.0273438 9.95898Z"
        fill={color}
      />
    </Svg>
  );
};