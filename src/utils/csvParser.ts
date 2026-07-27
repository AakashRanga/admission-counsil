export interface ParsedCSVRow {
  studentId: string;
  studentName: string;
  department: string;
  mobile: string;
  subjectOrBuilding: string;
  facultyOrFloor: string;
  courseOrRoom: string;
  categoryOrLocation: string;
  description: string;
  remarks: string;
  rawCols: string[];
}

/**
 * Parses CSV text taking into account quoted fields containing commas or quotes.
 */
export function parseCSVLines(text: string): string[][] {
  const lines: string[] = [];
  let curLine = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        curLine += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n in \r\n
      }
      if (curLine.trim().length > 0) {
        lines.push(curLine);
      }
      curLine = '';
    } else {
      curLine += char;
    }
  }
  if (curLine.trim().length > 0) {
    lines.push(curLine);
  }

  return lines.map(line => parseCSVLine(line));
}

function parseCSVLine(line: string): string[] {
  const cols: string[] = [];
  let curVal = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        curVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cols.push(curVal.trim());
      curVal = '';
    } else {
      curVal += char;
    }
  }
  cols.push(curVal.trim());
  return cols;
}

export const DEPARTMENT_ALIASES: Record<string, string> = {
  'cse': 'Computer Science & Engineering',
  'computer science': 'Computer Science & Engineering',
  'computer science & engineering': 'Computer Science & Engineering',
  'computer science and engineering': 'Computer Science & Engineering',
  'dept of cse': 'Computer Science & Engineering',
  'eee': 'Electrical & Electronics Eng.',
  'electrical': 'Electrical & Electronics Eng.',
  'electrical & electronics engineering': 'Electrical & Electronics Eng.',
  'ece': 'Electronics & Communication Eng.',
  'electronics': 'Electronics & Communication Eng.',
  'mech': 'Mechanical Engineering',
  'mechanical': 'Mechanical Engineering',
  'mechanical engineering': 'Mechanical Engineering',
  'bio': 'Biotechnology & Bioengineering',
  'biotech': 'Biotechnology & Bioengineering',
  'biotechnology': 'Biotechnology & Bioengineering',
  'arch': 'School of Architecture & Design',
  'architecture': 'School of Architecture & Design',
  'smb': 'School of Management & Business',
  'management': 'School of Management & Business',
  'business': 'School of Management & Business'
};

export function normalizeDepartmentName(rawInput: string): string {
  if (!rawInput) return 'Computer Science & Engineering';
  const clean = rawInput.toLowerCase().trim();
  return DEPARTMENT_ALIASES[clean] || rawInput.trim();
}
