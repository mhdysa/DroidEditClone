import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function CustomKeyboard({
  onInsert,
  onToggleKeyboard,
  onIndent,
  onUnindent,
  currentTheme = 'dark'
}) {
  const [isSymbols, setIsSymbols] = useState(false);
  const isDark = currentTheme === 'dark';

  const letters = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  const symbols = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['@', '#', '$', '%', '^', '&', '*', '(', ')'],
    ['-', '_', '=', '+', '[', ']', '{', '}', '|']
  ];

  const specials = [
    ['Tab', 'Space', 'Enter'],
    ['{', '}', ';', ':', "'", '"', '<', '>', '/', '?']
  ];

  const keys = isSymbols ? symbols : letters;

  return (
    <View style={[
      styles.keyboard,
      {
        backgroundColor: isDark ? '#2d2d2d' : '#f0f0f0',
        borderTopColor: isDark ? '#444' : '#ddd'
      }
    ]}>
      {/* ردیف کنترل */}
      <View style={styles.keyboardRow}>
        <TouchableOpacity
          onPress={onToggleKeyboard}
          style={[styles.key, { backgroundColor: isDark ? '#3d3d3d' : '#e0e0e0' }]}
        >
          <Text style={[styles.keyText, { color: isDark ? '#fff' : '#000' }]}>⌨️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onIndent}
          style={[styles.key, { backgroundColor: isDark ? '#3d3d3d' : '#e0e0e0' }]}
        >
          <Text style={[styles.keyText, { color: isDark ? '#fff' : '#000' }]}>⇨</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onUnindent}
          style={[styles.key, { backgroundColor: isDark ? '#3d3d3d' : '#e0e0e0' }]}
        >
          <Text style={[styles.keyText, { color: isDark ? '#fff' : '#000' }]}>⇦</Text>
        </TouchableOpacity>
      </View>

      {/* ردیف‌های اصلی */}
      {keys.map((row, i) => (
        <View key={i} style={styles.keyboardRow}>
          {row.map(key => (
            <TouchableOpacity
              key={key}
              style={[
                styles.key,
                {
                  backgroundColor: isDark ? '#3d3d3d' : '#e0e0e0',
                  minWidth: width / (row.length + 2) - 4,
                }
              ]}
              onPress={() => onInsert(key)}
            >
              <Text style={[styles.keyText, { color: isDark ? '#fff' : '#000' }]}>
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* دکمه‌های ویژه اول */}
      <View style={styles.keyboardRow}>
        {specials[0].map(key => (
          <TouchableOpacity
            key={key}
            style={[
              styles.key,
              styles.specialKey,
              {
                backgroundColor: isDark ? '#4d4d4d' : '#d0d0d0',
                flex: key === 'Space' ? 3 : 1,
              }
            ]}
            onPress={() => {
              if (key === 'Space') onInsert(' ');
              else if (key === 'Tab') onInsert('  ');
              else if (key === 'Enter') onInsert('\n');
            }}
          >
            <Text style={[styles.keyText, { color: isDark ? '#fff' : '#000', fontWeight: 'bold' }]}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* دکمه‌های ویژه دوم */}
      <View style={styles.keyboardRow}>
        {specials[1].map(key => (
          <TouchableOpacity
            key={key}
            style={[
              styles.key,
              {
                backgroundColor: isDark ? '#3d3d3d' : '#e0e0e0',
                minWidth: width / 12 - 4,
              }
            ]}
            onPress={() => onInsert(key)}
          >
            <Text style={[styles.keyText, { color: isDark ? '#fff' : '#000' }]}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* دکمه تغییر صفحه */}
      <View style={styles.keyboardRow}>
        <TouchableOpacity
          style={[
            styles.key,
            styles.switchKey,
            {
              backgroundColor: isDark ? '#4a9eff' : '#007aff',
              flex: 1,
            }
          ]}
          onPress={() => setIsSymbols(!isSymbols)}
        >
          <Text style={[styles.keyText, { color: '#fff', fontWeight: 'bold' }]}>
            {isSymbols ? 'ABC' : '@?! 123'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    padding: 4,
    borderTopWidth: 1,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 3,
  },
  key: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    margin: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
  },
  keyText: {
    fontSize: 16,
  },
  specialKey: {
    paddingVertical: 10,
    margin: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchKey: {
    paddingVertical: 10,
    margin: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
