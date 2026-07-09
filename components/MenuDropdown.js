import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';

const { height } = Dimensions.get('window');

export default function MenuDropdown({
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onClose,
  onFind,
  onReplace,
  onGotoLine,
  onReadOnly,
  onInsertColor,
  onIndent,
  onUnindent,
  isReadOnly,
  onSettings,
  onHelp,
  onExit,
  currentTheme = 'dark'
}) {
  const isDark = currentTheme === 'dark';

  return (
    <View style={[
      styles.dropdown,
      {
        backgroundColor: isDark ? '#2d2d2d' : '#f5f5f5',
        borderBottomColor: isDark ? '#444' : '#ddd'
      }
    ]}>
      <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={true}>
        <MenuItem icon="📄 + New" onPress={onNew} isDark={isDark} />
        <MenuItem icon="📂 ☑ Open" onPress={onOpen} isDark={isDark} />
        <MenuItem icon="💾 ☑ Save" onPress={onSave} isDark={isDark} />
        <MenuItem icon="📝 ☑ Save as..." onPress={onSaveAs} isDark={isDark} />
        <MenuItem icon="❌ ☑ Close" onPress={onClose} isDark={isDark} isDanger />
        <MenuDivider isDark={isDark} />

        <MenuItem icon="🔍 Find" onPress={onFind} isDark={isDark} />
        <MenuItem icon="🔄 Replace" onPress={onReplace} isDark={isDark} />
        <MenuDivider isDark={isDark} />

        <MenuItem icon="🎨 Insert Color" onPress={onInsertColor} isDark={isDark} />
        <MenuItem icon="⇨ Indent" onPress={onIndent} isDark={isDark} />
        <MenuItem icon="⇦ Unindent" onPress={onUnindent} isDark={isDark} />
        <MenuDivider isDark={isDark} />

        <MenuItem icon="📍 Goto Line..." onPress={onGotoLine} isDark={isDark} />
        <MenuItem 
          icon={isReadOnly ? "🔒 Read Only (ON)" : "🔓 Read Only (OFF)"} 
          onPress={onReadOnly} 
          isDark={isDark} 
        />
        <MenuDivider isDark={isDark} />

        <MenuItem icon="⚙️ Settings..." onPress={onSettings} isDark={isDark} />
        <MenuItem icon="❓ Help..." onPress={onHelp} isDark={isDark} />
        <MenuItem icon="🚪 Exit" onPress={onExit} isDark={isDark} isDanger style={styles.exitItem} />
      </ScrollView>
    </View>
  );
}

const MenuItem = ({ icon, onPress, isDark, isDanger, style }) => (
  <TouchableOpacity
    style={[
      styles.menuItem,
      {
        borderBottomColor: isDark ? '#444' : '#ddd',
        backgroundColor: isDark ? '#2d2d2d' : '#f5f5f5'
      },
      style
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.menuText,
      {
        color: isDanger ? '#ff4444' : (isDark ? '#fff' : '#000')
      }
    ]}>
      {icon}
    </Text>
  </TouchableOpacity>
);

const MenuDivider = ({ isDark }) => (
  <View style={[
    styles.divider,
    { backgroundColor: isDark ? '#555' : '#ddd' }
  ]} />
);

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    maxHeight: height * 0.7,
    zIndex: 1000,
    borderBottomWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  menuScroll: {
    maxHeight: height * 0.7,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  exitItem: {
    borderTopWidth: 1,
    borderTopColor: '#ff4444',
  },
});