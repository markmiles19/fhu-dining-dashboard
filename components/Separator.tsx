import React from 'react';
import { View, useColorScheme } from 'react-native';

export default function Separator() {
  const colorScheme = useColorScheme();
  const separatorColor = colorScheme === 'dark' ? '#fff' : '#000';

  return (
    <View
      style={{
        height: 1,
        width: '80%',
        marginVertical: 20,
        backgroundColor: separatorColor,
        alignSelf: 'center',
      }}
    />
  );
}