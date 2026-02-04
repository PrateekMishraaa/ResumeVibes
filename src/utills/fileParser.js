// src/utils/fileParser.js
export const extractTextFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        let text = e.target.result;
        
        let parsedData = {
          personalInfo: {},
          summary: '',
          experience: [],
          education: [],
          skills: [],
          certifications: [],
          projects: []
        };
        
        const lines = text.split('\n');
        
        let currentSection = '';
        
        lines.forEach(line => {
          line = line.trim();
          
          if (line.toLowerCase().includes('name') || line.toLowerCase().includes('contact')) {
            currentSection = 'personalInfo';
          } else if (line.toLowerCase().includes('summary') || line.toLowerCase().includes('objective')) {
            currentSection = 'summary';
          } else if (line.toLowerCase().includes('experience') || line.toLowerCase().includes('work')) {
            currentSection = 'experience';
          } else if (line.toLowerCase().includes('education')) {
            currentSection = 'education';
          } else if (line.toLowerCase().includes('skills')) {
            currentSection = 'skills';
          } else if (line.toLowerCase().includes('certification')) {
            currentSection = 'certifications';
          } else if (line.toLowerCase().includes('project')) {
            currentSection = 'projects';
          }
          
          if (currentSection === 'personalInfo') {
            if (!parsedData.personalInfo.name && /^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(line)) {
              parsedData.personalInfo.name = line;
            }
            
            if (!parsedData.personalInfo.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line)) {
              parsedData.personalInfo.email = line;
            }
            
            if (!parsedData.personalInfo.phone && /[\+]?[1-9][\d]{0,15}/.test(line.replace(/\D/g, ''))) {
              parsedData.personalInfo.phone = line;
            }
            
            if (!parsedData.personalInfo.location && /[A-Z][a-z]+,\s*[A-Z]{2}/.test(line)) {
              parsedData.personalInfo.location = line;
            }
          } else if (currentSection === 'summary' && line.length > 10) {
            parsedData.summary += line + ' ';
          }
        });
        
        parsedData.summary = parsedData.summary.trim();
        
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    
    if (file.type === 'application/pdf') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  });
};

export const extractKeywords = (text) => {
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me'
  ]);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !commonWords.has(word) &&
      !/^\d+$/.test(word)
    );
  
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(entry => entry[0]);
};

export const formatExtractedText = (parsedData) => {
  let result = '';
  
  if (parsedData.personalInfo.name) {
    result += `Name: ${parsedData.personalInfo.name}\n`;
  }
  if (parsedData.personalInfo.email) {
    result += `Email: ${parsedData.personalInfo.email}\n`;
  }
  if (parsedData.personalInfo.phone) {
    result += `Phone: ${parsedData.personalInfo.phone}\n`;
  }
  if (parsedData.personalInfo.location) {
    result += `Location: ${parsedData.personalInfo.location}\n`;
  }
  
  result += '\n';
  
  if (parsedData.summary) {
    result += `Summary: ${parsedData.summary}\n\n`;
  }
  
  if (parsedData.experience.length > 0) {
    result += 'Experience:\n';
    parsedData.experience.forEach(exp => {
      result += `- ${exp.title} at ${exp.company} (${exp.period})\n`;
    });
    result += '\n';
  }
  
  if (parsedData.education.length > 0) {
    result += 'Education:\n';
    parsedData.education.forEach(edu => {
      result += `- ${edu.degree}, ${edu.institution} (${edu.period})\n`;
    });
    result += '\n';
  }
  
  if (parsedData.skills.length > 0) {
    result += 'Skills: ' + parsedData.skills.join(', ') + '\n';
  }
  
  if (parsedData.certifications.length > 0) {
    result += 'Certifications: ' + parsedData.certifications.join(', ') + '\n';
  }
  
  return result;
};