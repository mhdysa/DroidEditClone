import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';

export default function CodeEditor({
  code,
  fontSize,
  isReadOnly,
  fileExtension,
  currentTheme = 'dark'
}) {
  const getLanguage = (ext) => {
    const map = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'json': 'json',
      'xml': 'xml',
      'svg': 'xml',
      'sql': 'sql',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'sh': 'bash',
      'bash': 'bash',
      'md': 'markdown',
      'txt': 'text',
      '': 'text'
    };
    return map[ext] || 'javascript';
  };

  const isDark = currentTheme === 'dark';

  return (
    <View style={styles.container}>
      {isReadOnly && (
        <Text style={[
          styles.readOnlyMessage,
          { color: isDark ? '#666' : '#999' }
        ]}>
          ⚠️ حالت فقط خواندنی فعال است
        </Text>
      )}
      <ScrollView style={styles.scrollView}>
        <SyntaxHighlighter
          language={getLanguage(fileExtension)}
          style={docco}
          customStyle={[
            styles.highlight,
            {
              backgroundColor: isDark ? '#1e1e1e' : '#f8f8f8',
              color: isDark ? '#d4d4d4' : '#000',
            }
          ]}
          highlighterProps={{ wrapLines: true }}
        >
          {code}
        </SyntaxHighlighter>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  highlight: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 24,
    padding: 8,
  },
  readOnlyMessage: {
    padding: 10,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#2d2d2d',
  },
});