// Date and time utilities
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return formatDate(d);
};

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const capitalizeFirst = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Array utilities
export const paginate = <T>(array: T[], page: number, pageSize: number) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    items: array.slice(startIndex, endIndex),
    total: array.length,
    page,
    pageSize,
    hasMore: endIndex < array.length,
    totalPages: Math.ceil(array.length / pageSize)
  };
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Object utilities
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result as Omit<T, K>;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Local storage utilities (with fallbacks for environments without localStorage)
export const storage = {
  get: (key: string): string | null => {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
    return null;
  },
  
  set: (key: string, value: string): void => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  },
  
  getObject: <T>(key: string): T | null => {
    const value = storage.get(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.warn('Failed to parse stored object:', error);
      }
    }
    return null;
  },
  
  setObject: <T>(key: string, value: T): void => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to stringify object for storage:', error);
    }
  }
};

// Debounce utility for search and input handling
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Theme utilities
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Error handling utilities
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

// Platform detection utilities
export const isWeb = (): boolean => {
  return typeof window !== 'undefined';
};

export const isMobile = (): boolean => {
  return typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Constants for demo data
export const DEMO_USERS = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://via.placeholder.com/150/4CAF50/white?text=AJ',
    bio: 'Full-stack developer passionate about React and TypeScript',
    location: 'San Francisco, CA',
    website: 'https://alice-dev.com'
  },
  {
    id: '2', 
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://via.placeholder.com/150/2196F3/white?text=BS',
    bio: 'UI/UX designer and frontend enthusiast',
    location: 'New York, NY',
    website: 'https://bobdesigns.co'
  },
  {
    id: '3',
    name: 'Carol Williams', 
    email: 'carol@example.com',
    avatar: 'https://via.placeholder.com/150/FF9800/white?text=CW',
    bio: 'Product manager with a love for user research',
    location: 'Austin, TX'
  }
];

export const DEMO_POSTS = [
  {
    id: '1',
    title: 'Getting Started with React Native',
    content: 'React Native is a powerful framework for building cross-platform mobile applications...',
    excerpt: 'Learn the basics of React Native development',
    authorId: '1',
    tags: ['react-native', 'mobile', 'javascript'],
    published: true,
    views: 234,
    likes: 15
  },
  {
    id: '2',
    title: 'Design Systems in Modern Web Development',
    content: 'A design system is a complete set of standards intended to manage design at scale...',
    excerpt: 'Building consistent user interfaces across applications',
    authorId: '2', 
    tags: ['design-systems', 'ui-ux', 'frontend'],
    published: true,
    views: 189,
    likes: 23
  },
  {
    id: '3',
    title: 'User Research Best Practices',
    content: 'Understanding your users is crucial for building successful products...',
    excerpt: 'How to conduct effective user research',
    authorId: '3',
    tags: ['user-research', 'product-management', 'ux'],
    published: true,
    views: 156,
    likes: 31
  }
];
