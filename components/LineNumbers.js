import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LineNumbers({ lines, foldedLines, onToggle }) {
  return (
    <View style={styles.container}>
      {lines.map((num, index) => (
        <TouchableOpacity 
          key={index} 
          onPress={() => onToggle(index)}
          style={styles.lineNumber}
        >
          <Text style={styles.number}>
            {num}
            {foldedLines[index + 1] && ' ▶'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252525',
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  lineNumber: {
    paddingVertical: 2,
    minHeight: 24,
    justifyContent: 'center',
  },
  number: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
