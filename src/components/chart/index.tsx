import { Theme } from '@/libs/config/theme';
import { colors } from '@/libs/constants';
import { useThemedStyles } from '@/libs/hooks';
import { pixelSizeVertical } from '@/libs/utils';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Typography } from '../common';

interface EnergyUsageChartProps {
  value:number
}

export const EnergyUsageChart:React.FunctionComponent<EnergyUsageChartProps> = ({value}) => {
  const [lineData, setLineData] = useState([{ value: 0 }]);
  const style = useThemedStyles(styles);

  console.log('===============value=====================');
  console.log(lineData);
  console.log('====================================');

  useEffect(() => {
    const interval = setInterval(() => {
      const newConsumptionValue = value;

      setLineData((prevData) => [
        ...prevData.slice(-7),
        { value: newConsumptionValue },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <View style={style.container}>
      <Typography style={style.text}>
        EnergyConsumption
      </Typography>
       <LineChart
        data={lineData}
        color={'#177AD5'}
        thickness={3}
        dataPointsColor={'red'}
        noOfSections={5}
        yAxisColor={colors.white[100]}
        rulesColor={colors.white[100]}
        xAxisColor={colors.white[100]}
      />
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.black[200],
      justifyContent: 'space-between',
      borderRadius:8,
      paddingVertical:10,
    },
    content: {
      marginTop: pixelSizeVertical(48),
    },
    deviceItem: {
      marginBottom: pixelSizeVertical(40),
    },
    text: {
      fontSize: 16,
      textAlign: 'center',
      flexBasis: '10%',
      marginBottom:16,
    },
    rotate: {
      transform: [{rotate: '-90deg'}],
    },
    chart: {},
  });
};

