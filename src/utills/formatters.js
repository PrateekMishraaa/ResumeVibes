// ========== DATE FORMATTING ==========

/**
 * Format date to human-readable string
 * @param {Date|string} date - Date object or ISO string
 * @param {string} format - Format style: 'short', 'medium', 'long', 'relative'
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    case 'medium':
      return d.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    
    case 'long':
      return d.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    
    case 'time':
      return d.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    
    case 'datetime':
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    
    case 'relative':
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    
    case 'iso':
      return d.toISOString().split('T')[0];
    
    case 'month-year':
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    default:
      return d.toLocaleDateString();
  }
};

/**
 * Format date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date (null for present)
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate = null) => {
  if (!startDate) return 'N/A';
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  if (isNaN(start.getTime())) return 'Invalid Date';
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  
  if (!end) {
    return `${startMonth} - Present`;
  }
  
  if (isNaN(end.getTime())) return `${startMonth} - Present`;
  
  const endMonth = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  
  // If same month and year, show only once
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return startMonth;
  }
  
  // If same year, show month only for end
  if (start.getFullYear() === end.getFullYear()) {
    const startMonthOnly = start.toLocaleDateString('en-US', { month: 'short' });
    return `${startMonthOnly} - ${endMonth}`;
  }
  
  return `${startMonth} - ${endMonth}`;
};

/**
 * Calculate duration between dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date (null for present)
 * @returns {string} Formatted duration
 */
export const calculateDuration = (startDate, endDate = null) => {
  if (!startDate) return '';
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
  
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months += end.getMonth() - start.getMonth();
  
  if (end.getDate() < start.getDate()) {
    months--;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
  }
  
  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  
  return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
};

// ========== NUMBER FORMATTING ==========

/**
 * Format number with commas
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '0';
  
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  if (isNaN(num)) return '0';
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (USD, EUR, etc.)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '$0';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '$0';
  
  return num.toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

/**
 * Format percentage
 * @param {number} value - Percentage value (0-100)
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0%';
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) + '%';
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format large numbers with suffixes (K, M, B)
 * @param {number} num - Number to format
 * @returns {string} Formatted number with suffix
 */
export const formatCompactNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  const n = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(n)) return '0';
  
  if (n < 1000) return n.toString();
  
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const suffixNum = Math.floor(('' + n).length / 3);
  let shortNum = parseFloat((suffixNum !== 0 ? (n / Math.pow(1000, suffixNum)) : n).toPrecision(2));
  
  if (shortNum % 1 !== 0) {
    shortNum = shortNum.toFixed(1);
  }
  
  return shortNum + suffixes[suffixNum];
};

// ========== TEXT FORMATTING ==========

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Convert camelCase to Title Case
 * @param {string} text - Camel case text
 * @returns {string} Title case text
 */
export const camelToTitle = (text) => {
  if (!text) return '';
  
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

/**
 * Convert snake_case to Title Case
 * @param {string} text - Snake case text
 * @returns {string} Title case text
 */
export const snakeToTitle = (text) => {
  if (!text) return '';
  
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Remove HTML tags from text
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtml = (html) => {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Format phone number
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Format URL for display
 * @param {string} url - URL to format
 * @returns {string} Formatted URL
 */
export const formatUrl = (url) => {
  if (!url) return '';
  
  // Remove protocol and www
  return url
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/$/, '');
};

/**
 * Format email for display (hide part of it)
 * @param {string} email - Email to format
 * @param {boolean} hide - Whether to hide part of email
 * @returns {string} Formatted email
 */
export const formatEmail = (email, hide = false) => {
  if (!email) return '';
  
  if (!hide) return email;
  
  const [username, domain] = email.split('@');
  
  if (!username || !domain) return email;
  
  const hiddenUsername = username.length > 2 
    ? username.substring(0, 2) + '***'
    : '***';
  
  return `${hiddenUsername}@${domain}`;
};

// ========== RESUME SPECIFIC FORMATTING ==========

/**
 * Format resume section title
 * @param {string} section - Section name
 * @returns {string} Formatted section title
 */
export const formatResumeSection = (section) => {
  const sections = {
    'personalInfo': 'Personal Information',
    'summary': 'Professional Summary',
    'experience': 'Work Experience',
    'education': 'Education',
    'skills': 'Skills & Expertise',
    'projects': 'Projects',
    'certifications': 'Certifications',
    'languages': 'Languages',
    'references': 'References'
  };
  
  return sections[section] || capitalize(section);
};

/**
 * Format experience description bullets
 * @param {string[]} bullets - Array of bullet points
 * @param {number} maxLength - Maximum length per bullet
 * @returns {string[]} Formatted bullet points
 */
export const formatExperienceBullets = (bullets, maxLength = 120) => {
  if (!bullets || !Array.isArray(bullets)) return [];
  
  return bullets.map(bullet => {
    if (!bullet || typeof bullet !== 'string') return '';
    
    // Capitalize first letter
    let formatted = bullet.trim();
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    
    // Ensure it ends with a period
    if (!formatted.endsWith('.') && !formatted.endsWith('!')) {
      formatted += '.';
    }
    
    // Truncate if too long
    if (formatted.length > maxLength) {
      formatted = truncateText(formatted, maxLength);
    }
    
    return formatted;
  });
};

/**
 * Format skills list
 * @param {string[]} skills - Array of skills
 * @param {number} maxSkills - Maximum number of skills to show
 * @returns {string[]} Formatted skills array
 */
export const formatSkills = (skills, maxSkills = 15) => {
  if (!skills || !Array.isArray(skills)) return [];
  
  // Remove duplicates and empty values
  const uniqueSkills = [...new Set(skills
    .filter(skill => skill && typeof skill === 'string')
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0)
  )];
  
  // Capitalize each skill
  const formattedSkills = uniqueSkills.map(skill => {
    // Handle special cases
    if (skill.toUpperCase() === skill) {
      return skill; // Keep acronyms as is
    }
    
    return skill
      .split(' ')
      .map(word => {
        // Don't capitalize short prepositions
        const lower = word.toLowerCase();
        if (['and', 'or', 'for', 'the', 'of', 'in', 'on', 'at'].includes(lower)) {
          return lower;
        }
        
        // Capitalize first letter
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  });
  
  // Limit number of skills
  return formattedSkills.slice(0, maxSkills);
};

/**
 * Format GPA
 * @param {number|string} gpa - GPA value
 * @param {number} scale - GPA scale (default 4.0)
 * @returns {string} Formatted GPA
 */
export const formatGPA = (gpa, scale = 4.0) => {
  if (!gpa) return '';
  
  const num = typeof gpa === 'string' ? parseFloat(gpa) : gpa;
  
  if (isNaN(num)) return gpa.toString();
  
  if (scale === 4.0) {
    return num.toFixed(1) + '/4.0';
  }
  
  return num.toFixed(2) + `/${scale.toFixed(1)}`;
};

/**
 * Format job level/title
 * @param {string} title - Job title
 * @returns {string} Formatted job title
 */
export const formatJobTitle = (title) => {
  if (!title) return '';
  
  const levels = {
    'jr': 'Junior',
    'junior': 'Junior',
    'sr': 'Senior',
    'senior': 'Senior',
    'lead': 'Lead',
    'principal': 'Principal',
    'director': 'Director',
    'vp': 'VP',
    'c-level': 'C-Level',
    'cto': 'CTO',
    'ceo': 'CEO'
  };
  
  const words = title.toLowerCase().split(' ');
  
  return words
    .map((word, index) => {
      if (index === 0 && levels[word]) {
        return levels[word];
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

// ========== SCORE & RATING FORMATTING ==========

/**
 * Format optimization score with color class
 * @param {number} score - Score from 0-100
 * @returns {object} Object with formatted score and color class
 */
export const formatScore = (score) => {
  if (score === null || score === undefined) {
    return {
      value: 'N/A',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-500'
    };
  }
  
  const num = typeof score === 'string' ? parseFloat(score) : score;
  
  if (isNaN(num)) {
    return {
      value: 'N/A',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-500'
    };
  }
  
  let color, bgColor, textColor;
  
  if (num >= 90) {
    color = 'text-green-600';
    bgColor = 'bg-green-100';
    textColor = 'text-green-700';
  } else if (num >= 80) {
    color = 'text-blue-600';
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-700';
  } else if (num >= 70) {
    color = 'text-yellow-600';
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-700';
  } else if (num >= 60) {
    color = 'text-orange-600';
    bgColor = 'bg-orange-100';
    textColor = 'text-orange-700';
  } else {
    color = 'text-red-600';
    bgColor = 'bg-red-100';
    textColor = 'text-red-700';
  }
  
  return {
    value: Math.round(num).toString(),
    color,
    bgColor,
    textColor,
    raw: num
  };
};

/**
 * Format rating with stars
 * @param {number} rating - Rating from 0-5
 * @returns {object} Object with stars array and text
 */
export const formatRating = (rating) => {
  const num = typeof rating === 'string' ? parseFloat(rating) : rating;
  
  if (isNaN(num) || num < 0 || num > 5) {
    return {
      stars: Array(5).fill('empty'),
      text: 'No rating',
      numeric: 0
    };
  }
  
  const fullStars = Math.floor(num);
  const hasHalfStar = num % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  const stars = [
    ...Array(fullStars).fill('full'),
    ...(hasHalfStar ? ['half'] : []),
    ...Array(emptyStars).fill('empty')
  ];
  
  return {
    stars,
    text: num.toFixed(1) + '/5',
    numeric: num
  };
};

// ========== KEYWORD & SEO FORMATTING ==========

/**
 * Extract keywords from text
 * @param {string} text - Text to extract keywords from
 * @param {number} maxKeywords - Maximum number of keywords
 * @returns {string[]} Array of keywords
 */
export const extractKeywords = (text, maxKeywords = 10) => {
  if (!text) return [];
  
  // Remove special characters and split into words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2); // Filter out short words
  
  // Count word frequency
  const wordCount = {};
  words.forEach(word => {
    if (wordCount[word]) {
      wordCount[word]++;
    } else {
      wordCount[word] = 1;
    }
  });
  
  // Sort by frequency and get top keywords
  const sortedWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .slice(0, maxKeywords);
  
  return sortedWords;
};

/**
 * Format keywords for display
 * @param {string[]} keywords - Array of keywords
 * @param {number} maxLength - Maximum total length
 * @returns {string} Formatted keywords string
 */
export const formatKeywords = (keywords, maxLength = 100) => {
  if (!keywords || !Array.isArray(keywords)) return '';
  
  const validKeywords = keywords
    .filter(keyword => keyword && typeof keyword === 'string')
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 0);
  
  let result = '';
  for (const keyword of validKeywords) {
    const potentialResult = result ? `${result}, ${keyword}` : keyword;
    
    if (potentialResult.length > maxLength) {
      break;
    }
    
    result = potentialResult;
  }
  
  return result;
};

// ========== FILE FORMATTING ==========

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  
  return filename.split('.').pop().toLowerCase();
};

/**
 * Check if file type is supported for resume
 * @param {string} filename - Filename
 * @returns {boolean} Whether file type is supported
 */
export const isSupportedResumeFormat = (filename) => {
  const extension = getFileExtension(filename);
  const supported = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  
  return supported.includes(extension);
};

/**
 * Format file name for display
 * @param {string} filename - Full filename
 * @param {number} maxLength - Maximum length
 * @returns {string} Formatted filename
 */
export const formatFileName = (filename, maxLength = 30) => {
  if (!filename) return 'Untitled';
  
  if (filename.length <= maxLength) return filename;
  
  const extension = getFileExtension(filename);
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  const charsToKeep = maxLength - extension.length - 4; // Account for "..."
  
  return nameWithoutExt.substring(0, charsToKeep) + '...' + extension;
};

// ========== SOCIAL MEDIA FORMATTING ==========

/**
 * Format LinkedIn URL
 * @param {string} url - LinkedIn URL or username
 * @returns {string} Formatted LinkedIn URL
 */
export const formatLinkedInUrl = (url) => {
  if (!url) return '';
  
  // If it's already a full URL, return as is
  if (url.startsWith('http')) return url;
  
  // If it's just a username, construct URL
  const username = url.replace(/^@/, '').replace(/\/$/, '');
  return `https://linkedin.com/in/${username}`;
};

/**
 * Format GitHub URL
 * @param {string} url - GitHub URL or username
 * @returns {string} Formatted GitHub URL
 */
export const formatGitHubUrl = (url) => {
  if (!url) return '';
  
  if (url.startsWith('http')) return url;
  
  const username = url.replace(/^@/, '').replace(/\/$/, '');
  return `https://github.com/${username}`;
};

/**
 * Format portfolio URL
 * @param {string} url - Portfolio URL
 * @returns {string} Formatted portfolio URL
 */
export const formatPortfolioUrl = (url) => {
  if (!url) return '';
  
  if (url.startsWith('http')) return url;
  
  return `https://${url}`;
};

// ========== VALIDATION FORMATTING ==========

/**
 * Format validation errors
 * @param {object} errors - Validation errors object
 * @returns {string[]} Array of error messages
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') return [];
  
  return Object.entries(errors)
    .map(([field, error]) => {
      if (typeof error === 'string') {
        return `${capitalize(field.replace(/([A-Z])/g, ' $1').toLowerCase())}: ${error}`;
      }
      if (error.message) {
        return `${capitalize(field.replace(/([A-Z])/g, ' $1').toLowerCase())}: ${error.message}`;
      }
      return null;
    })
    .filter(error => error !== null);
};

/**
 * Format API error response
 * @param {Error|object} error - Error object
 * @returns {string} Formatted error message
 */
export const formatApiError = (error) => {
  if (!error) return 'An unknown error occurred';
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};

// ========== COLOR FORMATTING ==========

/**
 * Get color based on score
 * @param {number} score - Score from 0-100
 * @returns {string} Tailwind CSS color class
 */
export const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get background color based on score
 * @param {number} score - Score from 0-100
 * @returns {string} Tailwind CSS background color class
 */
export const getScoreBgColor = (score) => {
  if (score >= 90) return 'bg-green-100';
  if (score >= 80) return 'bg-blue-100';
  if (score >= 70) return 'bg-yellow-100';
  if (score >= 60) return 'bg-orange-100';
  return 'bg-red-100';
};

/**
 * Get gradient color based on category
 * @param {string} category - Category name
 * @returns {string} Tailwind CSS gradient class
 */
export const getCategoryGradient = (category) => {
  const gradients = {
    'experience': 'from-blue-500 to-cyan-500',
    'education': 'from-purple-500 to-pink-500',
    'skills': 'from-green-500 to-emerald-500',
    'projects': 'from-orange-500 to-red-500',
    'summary': 'from-indigo-500 to-purple-500',
    'personal': 'from-teal-500 to-green-500',
    'default': 'from-blue-600 to-purple-600'
  };
  
  return gradients[category?.toLowerCase()] || gradients.default;
};

// ========== TIME FORMATTING ==========

/**
 * Format time duration
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

/**
 * Format time ago
 * @param {Date|string} date - Date to compare
 * @returns {string} Time ago string
 */
export const timeAgo = (date) => {
  if (!date) return 'Just now';
  
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? '' : 's'} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) === 1 ? '' : 's'} ago`;
  
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) === 1 ? '' : 's'} ago`;
};

// ========== EXPORT ALL FORMATTERS ==========

export default {
  // Date Formatting
  formatDate,
  formatDateRange,
  calculateDuration,
  
  // Number Formatting
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  formatCompactNumber,
  
  // Text Formatting
  capitalize,
  camelToTitle,
  snakeToTitle,
  truncateText,
  stripHtml,
  formatPhone,
  formatUrl,
  formatEmail,
  
  // Resume Specific
  formatResumeSection,
  formatExperienceBullets,
  formatSkills,
  formatGPA,
  formatJobTitle,
  
  // Score & Rating
  formatScore,
  formatRating,
  
  // Keywords & SEO
  extractKeywords,
  formatKeywords,
  
  // File Formatting
  getFileExtension,
  isSupportedResumeFormat,
  formatFileName,
  
  // Social Media
  formatLinkedInUrl,
  formatGitHubUrl,
  formatPortfolioUrl,
  
  // Validation
  formatValidationErrors,
  formatApiError,
  
  // Colors
  getScoreColor,
  getScoreBgColor,
  getCategoryGradient,
  
  // Time
  formatDuration,
  timeAgo
};

// ========== USAGE EXAMPLES ==========

/*
// Date Formatting
formatDate('2024-01-15', 'medium') // "Mon, Jan 15, 2024"
formatDateRange('2022-01-01', '2023-12-31') // "Jan 2022 - Dec 2023"
calculateDuration('2023-01-01', '2023-12-31') // "1 year"

// Number Formatting
formatNumber(1234567.89, 2) // "1,234,567.89"
formatCurrency(1234.56) // "$1,234.56"
formatPercentage(85.5) // "85.5%"

// Text Formatting
capitalize('hello world') // "Hello World"
truncateText('This is a long text', 10) // "This is a..."
formatPhone('1234567890') // "(123) 456-7890"

// Resume Specific
formatResumeSection('experience') // "Work Experience"
formatSkills(['javascript', 'react', 'node.js']) // ["JavaScript", "React", "Node.js"]
formatScore(85) // { value: "85", color: "text-blue-600", ... }

// Keywords
extractKeywords('Senior React Developer with Node.js experience', 5)
// ["senior", "react", "developer", "node", "experience"]

// Validation
formatValidationErrors({ email: 'Invalid email', password: 'Too short' })
// ["Email: Invalid email", "Password: Too short"]
*/