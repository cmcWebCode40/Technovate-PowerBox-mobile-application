import {colors} from '@/libs/constants';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

interface ActionDropdownProps {
  data: {label: string; value: string}[];
  label: string;
  search?: boolean;
  defaultValue?: string;
  placeholder?: string;
  onSelect: (command: string) => void;
}

export const Select: React.FunctionComponent<ActionDropdownProps> = ({
  label,
  onSelect,
  data,
  search = false,
  defaultValue,
  placeholder = 'Select item',
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    return (
      <Text style={[styles.label, isFocus && {color: 'white'}]}>{label}</Text>
    );
  };
  const renderItem = (item: any) => {
    const isSelected = value === item.value;
    return (
      <View
        style={[
          styles.itemContainer,
          isSelected && styles.selectedItemContainer,
        ]}>
        <Text style={isSelected ? styles.selectedItemText : styles.itemText}>
          {item.label}
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        mode="modal"
        data={data}
        renderItem={renderItem}
        inputSearchStyle={styles.inputSearch}
        maxHeight={400}
        itemContainerStyle={styles.itemContainerStyle}
        containerStyle={styles.containerStyle}
        labelField="label"
        valueField="value"
        search={search}
        placeholder={!isFocus ? placeholder : '...'}
        searchPlaceholder="Search..."
        searchPlaceholderTextColor="black"
        value={value ?? defaultValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onSelect(item.value);
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    marginTop: 16,
  },
  containerStyle: {
    borderRadius: 10,
    backgroundColor: colors.black[200],
  },
  itemContainerStyle: {
    borderBottomColor: colors.black[200],
    borderBottomWidth: 1,
    backgroundColor: colors.black[200],
  },
  dropdown: {
    height: 48,
    width: 'auto',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    backgroundColor: colors.black[200],
    marginBottom: 24,
    marginTop: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    position: 'absolute',
    left: 0,
    top: 3,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: 'white',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: colors.black[200],
  },
  itemContainer: {
    padding: 20,
    backgroundColor: colors.black[200],
  },
  selectedItemContainer: {
    backgroundColor: colors.black[200],
  },
  itemText: {
    color: 'white',
  },
  selectedItemText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputSearch: {
    backgroundColor: colors.black[200],
    borderRadius: 8,
    color: colors.white[100],
  },
});
