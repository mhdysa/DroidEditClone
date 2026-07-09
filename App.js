import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  StatusBar,
  Dimensions,
  BackHandler,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuDropdown from './components/MenuDropdown';
import CodeEditor from './components/CodeEditor';
import CustomKeyboard from './components/CustomKeyboard';
import { getColor } from './utils/syntaxColors';
import { saveFile, loadFile } from './utils/fileStorage';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [code, setCode] = useState('// کد خود را اینجا بنویسید\nconsole.log("Hello DroidEdit!");');
  const [fileName, setFileName] = useState('untitled');
  const [fileExtension, setFileExtension] = useState('js');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineNumbers, setLineNumbers] = useState([]);
  const [foldedLines, setFoldedLines] = useState({});
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [lineCount, setLineCount] = useState(0);

  // تولید شماره خطوط
  useEffect(() => {
    const lines = code.split('\n');
    setLineNumbers(lines.map((_, i) => i + 1));
    setLineCount(lines.length);
  }, [code]);

  // بارگذاری فایل ذخیره شده
  useEffect(() => {
    loadSavedFile();
  }, []);

  const loadSavedFile = async () => {
    try {
      const saved = await loadFile();
      if (saved) {
        setCode(saved.code || code);
        setFileName(saved.fileName || 'untitled');
        setFileExtension(saved.extension || 'js');
      }
    } catch (error) {
      console.log('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ذخیره خودکار
  useEffect(() => {
    if (autoSave && !isLoading) {
      const saveTimer = setTimeout(() => {
        handleSave();
      }, 3000);
      return () => clearTimeout(saveTimer);
    }
  }, [code, autoSave]);

  const handleSave = async () => {
    try {
      await saveFile(code, fileName, fileExtension);
    } catch (error) {
      console.log('Save error:', error);
    }
  };

  const handleNewFile = () => {
    Alert.alert(
      'فایل جدید',
      'تغییرات ذخیره نشده از دست می‌روند',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'ایجاد',
          onPress: () => {
            setCode('');
            setFileName('untitled');
            setFileExtension('txt');
            setFoldedLines({});
            setShowMenu(false);
          }
        }
      ]
    );
  };

  const handleOpenFile = () => {
    Alert.prompt('باز کردن فایل', 'نام فایل را وارد کنید (با پسوند):', [
      { text: 'انصراف', style: 'cancel' },
      {
        text: 'باز کردن',
        onPress: async (name) => {
          if (name) {
            try {
              const saved = await loadFile(name);
              if (saved) {
                setCode(saved.code);
                setFileName(name);
                const ext = name.split('.').pop() || 'txt';
                setFileExtension(ext);
                setShowMenu(false);
                Alert.alert('موفق', `فایل ${name} باز شد`);
              } else {
                Alert.alert('خطا', 'فایل یافت نشد');
              }
            } catch (error) {
              Alert.alert('خطا', 'مشکل در باز کردن فایل');
            }
          }
        }
      }
    ]);
  };

  const handleSaveAs = () => {
    Alert.prompt('ذخیره با نام جدید', 'نام فایل را وارد کنید (با پسوند):', [
      { text: 'انصراف', style: 'cancel' },
      {
        text: 'ذخیره',
        onPress: async (name) => {
          if (name) {
            const ext = name.split('.').pop() || 'txt';
            setFileName(name);
            setFileExtension(ext);
            await saveFile(code, name, ext);
            setShowMenu(false);
            Alert.alert('موفق', `فایل ${name} ذخیره شد`);
          }
        }
      }
    ]);
  };

  const handleClose = () => {
    Alert.alert(
      'بستن فایل',
      'آیا مطمئن هستید؟',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'بستن',
          style: 'destructive',
          onPress: () => {
            setCode('');
            setFileName('untitled');
            setFileExtension('txt');
            setFoldedLines({});
            setShowMenu(false);
          }
        }
      ]
    );
  };

  const handleFind = () => {
    Alert.prompt('جستجو', 'متن مورد نظر را وارد کنید:', [
      { text: 'انصراف', style: 'cancel' },
      {
        text: 'جستجو',
        onPress: (searchText) => {
          if (searchText) {
            const occurrences = code.split(searchText).length - 1;
            if (occurrences > 0) {
              Alert.alert('یافت شد', `${occurrences} مورد برای "${searchText}" پیدا شد`);
            } else {
              Alert.alert('یافت نشد', `"${searchText}" پیدا نشد`);
            }
          }
        }
      }
    ]);
    setShowMenu(false);
  };

  const handleReplace = () => {
    Alert.prompt('جایگزینی', 'متن مورد جستجو را وارد کنید:', [
      { text: 'انصراف', style: 'cancel' },
      {
        text: 'بعدی',
        onPress: (searchText) => {
          if (searchText && code.includes(searchText)) {
            Alert.prompt('جایگزینی', `"${searchText}" را با چه چیزی جایگزین کنم؟`, [
              { text: 'انصراف', style: 'cancel' },
              {
                text: 'جایگزینی همه',
                onPress: (replaceText) => {
                  if (replaceText !== undefined) {
                    setCode(code.replaceAll(searchText, replaceText));
                    Alert.alert('موفق', 'جایگزینی انجام شد');
                  }
                }
              }
            ]);
          } else if (searchText) {
            Alert.alert('یافت نشد', `"${searchText}" پیدا نشد`);
          }
        }
      }
    ]);
    setShowMenu(false);
  };

  const handleGotoLine = () => {
    Alert.prompt('رفتن به خط', `شماره خط (1 تا ${lineCount}) را وارد کنید:`, [
      { text: 'انصراف', style: 'cancel' },
      {
        text: 'برو',
        onPress: (text) => {
          const lineNum = parseInt(text);
          if (!isNaN(lineNum) && lineNum > 0 && lineNum <= lineCount) {
            Alert.alert('رفتن به خط', `خط ${lineNum} انتخاب شد`);
          } else {
            Alert.alert('خطا', `شماره خط باید بین 1 تا ${lineCount} باشد`);
          }
        }
      }
    ]);
    setShowMenu(false);
  };

  const toggleFold = (lineIndex) => {
    setFoldedLines(prev => ({
      ...prev,
      [lineIndex]: !prev[lineIndex]
    }));
  };

  const insertText = (text) => {
    setCode(prev => prev + text);
  };

  const insertColor = () => {
    Alert.prompt('درج رنگ', 'کد رنگ را وارد کنید (مثلاً #FF0000):', [
      { text: 'انصراف', style: 'cancel' },
      {
        text: 'درج',
        onPress: (color) => {
          if (color) {
            setCode(prev => prev + `color: ${color};`);
          }
        }
      }
    ]);
    setShowMenu(false);
  };

  const handleIndent = () => {
    setCode(prev => prev + '  ');
  };

  const handleUnindent = () => {
    setCode(prev => prev.replace(/\s{2}$/, ''));
  };

  const toggleReadOnly = () => {
    setIsReadOnly(!isReadOnly);
    setShowMenu(false);
  };

  const changeFontSize = (delta) => {
    setFontSize(prev => Math.max(10, Math.min(30, prev + delta)));
  };

  const toggleAutoSave = () => {
    setAutoSave(!autoSave);
  };

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleExit = () => {
    Alert.alert(
      'خروج',
      'آیا مطمئن هستید؟',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'خروج',
          style: 'destructive',
          onPress: () => {
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
            } else {
              Alert.alert('خروج', 'برای خروج کلید Home را بزنید');
            }
          }
        }
      ]
    );
    setShowMenu(false);
  };

  const handleSettings = () => {
    Alert.alert(
      'تنظیمات',
      `تنظیمات فعلی:
      - فونت: ${fontSize}
      - تم: ${currentTheme === 'dark' ? 'تاریک' : 'روشن'}
      - ذخیره خودکار: ${autoSave ? 'فعال' : 'غیرفعال'}
      - حالت فقط خواندنی: ${isReadOnly ? 'فعال' : 'غیرفعال'}`,
      [
        { text: 'بستن', style: 'cancel' },
        { text: 'تغییر تم', onPress: toggleTheme },
        { text: 'تغییر ذخیره خودکار', onPress: toggleAutoSave }
      ]
    );
    setShowMenu(false);
  };

  const handleHelp = () => {
    Alert.alert(
      'راهنما',
      `📱 DroidEdit Clone v1.0

🔹 منوها:
• New: ایجاد فایل جدید
• Open: باز کردن فایل
• Save: ذخیره فایل
• Save as: ذخیره با نام جدید

🔹 ویرایش:
• Find: جستجوی متن
• Replace: جایگزینی متن
• Goto Line: رفتن به خط خاص

🔹 کیبورد:
• @?!: تغییر به صفحه اعداد و علائم
• ⇨/⇦: تورفتگی/برگشت

🔹 پسوندهای پشتیبانی شده:
JS, Python, Java, C++, HTML, CSS و...`
    );
    setShowMenu(false);
  };

  // نمایش خطوط کد
  const renderCodeLines = () => {
    const lines = code.split('\n');
    const color = getColor(fileExtension);

    return lines.map((line, index) => {
      if (foldedLines[index]) return null;

      return (
        <View key={index} style={styles.codeLine}>
          <TouchableOpacity
            onPress={() => toggleFold(index)}
            style={styles.lineNumberContainer}
          >
            <Text style={[styles.lineNumber, { color: '#666' }]}>
              {lineNumbers[index]}
              {index < lines.length - 1 && foldedLines[index + 1] && (
                <Text style={{ color: '#4a9eff' }}> ▶</Text>
              )}
              {index < lines.length - 1 && !foldedLines[index + 1] && (
                <Text style={{ color: '#4a9eff', fontSize: 10 }}> ▼</Text>
              )}
            </Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text
              style={[
                styles.codeText,
                {
                  fontSize: fontSize,
                  color: isReadOnly ? '#888' : '#d4d4d4',
                }
              ]}
            >
              {line || ' '}
            </Text>
          </ScrollView>
        </View>
      );
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>بارگذاری...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme === 'dark' ? '#1e1e1e' : '#ffffff' }]}>
      <StatusBar barStyle="light-content" />

      {/* نوار ابزار */}
      <View style={[styles.toolbar, { backgroundColor: currentTheme === 'dark' ? '#2d2d2d' : '#f0f0f0' }]}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.menuButton}>
            <Text style={[styles.toolbarText, { color: currentTheme === 'dark' ? '#fff' : '#000' }]}>☰</Text>
          </TouchableOpacity>

          <View style={styles.fileInfo}>
            <Text style={[styles.fileName, { color: currentTheme === 'dark' ? '#fff' : '#000' }]}>
              {fileName}
            </Text>
            <View style={[styles.extensionDot, { backgroundColor: getColor(fileExtension) }]} />
            <Text style={[styles.extensionText, { color: currentTheme === 'dark' ? '#888' : '#666' }]}>
              {fileExtension}
            </Text>
          </View>
        </View>

        <View style={styles.toolbarRight}>
          <TouchableOpacity onPress={() => setShowKeyboard(!showKeyboard)} style={styles.toolbarButton}>
            <Text style={[styles.toolbarText, { color: currentTheme === 'dark' ? '#fff' : '#000' }]}>⌨️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.toolbarButton}>
            <Text style={[styles.toolbarText, { color: currentTheme === 'dark' ? '#fff' : '#000' }]}>💾</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeFontSize(1)} style={styles.toolbarButton}>
            <Text style={[styles.toolbarText, { color: currentTheme === 'dark' ? '#fff' : '#000' }]}>A+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeFontSize(-1)} style={styles.toolbarButton}>
            <Text style={[styles.toolbarText, { color: currentTheme === 'dark' ? '#fff' : '#000' }]}>A-</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* منوی کشویی */}
      {showMenu && (
        <MenuDropdown
          onNew={handleNewFile}
          onOpen={handleOpenFile}
          onSave={handleSave}
          onSaveAs={handleSaveAs}
          onClose={handleClose}
          onFind={handleFind}
          onReplace={handleReplace}
          onGotoLine={handleGotoLine}
          onReadOnly={toggleReadOnly}
          onInsertColor={insertColor}
          onIndent={handleIndent}
          onUnindent={handleUnindent}
          isReadOnly={isReadOnly}
          onSettings={handleSettings}
          onHelp={handleHelp}
          onExit={handleExit}
          currentTheme={currentTheme}
        />
      )}

      {/* ویرایشگر کد */}
      <View style={styles.editorWrapper}>
        <ScrollView style={styles.editorScroll}>
          <View style={styles.editorContent}>
            {code ? (
              isReadOnly ? (
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  fontSize={fontSize}
                  isReadOnly={isReadOnly}
                  fileExtension={fileExtension}
                  currentTheme={currentTheme}
                />
              ) : (
                <TextInput
                  style={[
                    styles.codeInput,
                    {
                      fontSize: fontSize,
                      color: currentTheme === 'dark' ? '#d4d4d4' : '#000',
                      backgroundColor: currentTheme === 'dark' ? '#1e1e1e' : '#ffffff',
                    }
                  ]}
                  value={code}
                  onChangeText={setCode}
                  multiline
                  textAlignVertical="top"
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  placeholder="// کد خود را اینجا بنویسید..."
                  placeholderTextColor="#666"
                />
              )
            ) : (
              <Text style={[styles.emptyText, { color: currentTheme === 'dark' ? '#666' : '#999' }]}>
                فایل خالی است
              </Text>
            )}
          </View>
        </ScrollView>
      </View>

      {/* کیبورد سفارشی */}
      {showKeyboard && (
        <CustomKeyboard
          onInsert={insertText}
          onToggleKeyboard={() => setShowKeyboard(false)}
          onIndent={handleIndent}
          onUnindent={handleUnindent}
          currentTheme={currentTheme}
        />
      )}

      {/* خط وضعیت */}
      <View style={[styles.statusBar, { backgroundColor: currentTheme === 'dark' ? '#2d2d2d' : '#f0f0f0' }]}>
        <Text style={[styles.statusText, { color: currentTheme === 'dark' ? '#888' : '#666' }]}>
          خطوط: {lineCount}
        </Text>
        <Text style={[styles.statusText, { color: currentTheme === 'dark' ? '#888' : '#666' }]}>
          {isReadOnly ? '🔒 فقط خواندنی' : '✏️ قابل ویرایش'}
        </Text>
        <Text style={[styles.statusText, { color: currentTheme === 'dark' ? '#888' : '#666' }]}>
          {autoSave ? '💾 ذخیره خودکار' : '⏸️ ذخیره دستی'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    minHeight: 50,
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarText: {
    color: '#fff',
    fontSize: 18,
  },
  menuButton: {
    padding: 5,
    marginRight: 8,
  },
  toolbarButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  fileName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  extensionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  extensionText: {
    color: '#888',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  editorWrapper: {
    flex: 1,
  },
  editorScroll: {
    flex: 1,
  },
  editorContent: {
    flex: 1,
    padding: 10,
  },
  codeInput: {
    flex: 1,
    fontFamily: 'monospace',
    lineHeight: 24,
    minHeight: 400,
    padding: 8,
  },
  codeLine: {
    flexDirection: 'row',
    paddingVertical: 2,
    borderBottomWidth: 0.3,
    borderBottomColor: '#333',
  },
  lineNumberContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineNumber: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  codeText: {
    color: '#d4d4d4',
    paddingHorizontal: 10,
    fontFamily: 'monospace',
    lineHeight: 24,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 4,
    backgroundColor: '#2d2d2d',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  statusText: {
    color: '#888',
    fontSize: 11,
  },
});
