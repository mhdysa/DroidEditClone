import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@droidedit_files';
const CURRENT_KEY = '@droidedit_current';

export const saveFile = async (code, fileName, extension) => {
  try {
    const fileData = {
      code,
      fileName,
      extension,
      lastModified: new Date().toISOString()
    };
    
    // ذخیره فایل فعلی
    await AsyncStorage.setItem(CURRENT_KEY, JSON.stringify(fileData));
    
    // ذخیره در لیست فایل‌ها
    const filesList = await AsyncStorage.getItem(STORAGE_KEY);
    const files = filesList ? JSON.parse(filesList) : [];
    const existingIndex = files.findIndex(f => f.fileName === fileName);
    
    if (existingIndex !== -1) {
      files[existingIndex] = fileData;
    } else {
      files.push(fileData);
    }
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    return true;
  } catch (error) {
    console.error('Save file error:', error);
    return false;
  }
};

export const loadFile = async (fileName = null) => {
  try {
    if (fileName) {
      const filesList = await AsyncStorage.getItem(STORAGE_KEY);
      const files = filesList ? JSON.parse(filesList) : [];
      const file = files.find(f => f.fileName === fileName);
      return file || null;
    } else {
      const current = await AsyncStorage.getItem(CURRENT_KEY);
      return current ? JSON.parse(current) : null;
    }
  } catch (error) {
    console.error('Load file error:', error);
    return null;
  }
};

export const listFiles = async () => {
  try {
    const filesList = await AsyncStorage.getItem(STORAGE_KEY);
    return filesList ? JSON.parse(filesList) : [];
  } catch (error) {
    console.error('List files error:', error);
    return [];
  }
};

export const deleteFile = async (fileName) => {
  try {
    const filesList = await AsyncStorage.getItem(STORAGE_KEY);
    const files = filesList ? JSON.parse(filesList) : [];
    const filtered = files.filter(f => f.fileName !== fileName);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Delete file error:', error);
    return false;
  }
};
