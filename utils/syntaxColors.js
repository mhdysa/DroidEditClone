export const getLanguage = (ext) => {
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

export const getColor = (ext) => {
  const colors = {
    'js': '#f7df1e',
    'jsx': '#61dafb',
    'ts': '#3178c6',
    'tsx': '#3178c6',
    'py': '#3776ab',
    'java': '#b07219',
    'cpp': '#f34b7d',
    'c': '#555555',
    'html': '#e34c26',
    'htm': '#e34c26',
    'css': '#563d7c',
    'scss': '#c6538c',
    'sass': '#c6538c',
    'json': '#000000',
    'xml': '#0060ac',
    'svg': '#ffb13b',
    'sql': '#e38c00',
    'php': '#4f5d95',
    'rb': '#701516',
    'go': '#00add8',
    'rs': '#dea584',
    'swift': '#ffac45',
    'kt': '#a97bff',
    'sh': '#89e051',
    'bash': '#89e051',
    'md': '#083fa1',
    'txt': '#808080',
    '': '#808080'
  };
  return colors[ext] || '#ffffff';
};
