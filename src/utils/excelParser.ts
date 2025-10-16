import * as XLSX from 'xlsx';
import { DataType, ColumnMetadata, DataQuality, ParsedSheet, ParsedWorkbook } from '../types/data';

function inferDataType(values: any[]): DataType {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');

  if (nonNullValues.length === 0) return 'text';

  const uniqueCount = new Set(nonNullValues).size;
  const uniqueRatio = uniqueCount / nonNullValues.length;

  if (uniqueRatio > 0.95 && nonNullValues.length > 20) {
    return 'identifier';
  }

  let numericCount = 0;
  let booleanCount = 0;
  let dateCount = 0;

  for (const val of nonNullValues) {
    if (typeof val === 'boolean' || val === 'true' || val === 'false' || val === 'yes' || val === 'no') {
      booleanCount++;
    } else if (!isNaN(Number(val)) && val !== '' && typeof val !== 'boolean') {
      numericCount++;
    } else if (val instanceof Date || isDateString(String(val))) {
      dateCount++;
    }
  }

  const total = nonNullValues.length;

  if (booleanCount / total > 0.9) return 'boolean';
  if (dateCount / total > 0.8) return 'datetime';
  if (numericCount / total > 0.9) return 'numeric';
  if (uniqueCount < 50 && uniqueRatio < 0.5) return 'categorical';

  return 'text';
}

function isDateString(str: string): boolean {
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}/,
    /^\d{2}\/\d{2}\/\d{4}/,
    /^\d{2}-\d{2}-\d{4}/,
    /^\d{1,2}\/\d{1,2}\/\d{2,4}/,
  ];

  return datePatterns.some(pattern => pattern.test(str)) && !isNaN(Date.parse(str));
}

function normalizeColumnName(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

function calculateStats(values: any[], type: DataType) {
  if (type !== 'numeric') return {};

  const numericValues = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => Number(v))
    .filter(v => !isNaN(v));

  if (numericValues.length === 0) return {};

  const sorted = [...numericValues].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = sum / sorted.length;

  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sorted.length;
  const stdDev = Math.sqrt(variance);

  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  const outliers = sorted.filter(v => v < lowerBound || v > upperBound);

  return { min, max, mean, median, stdDev, outliers };
}

function analyzeColumn(data: any[], columnName: string): ColumnMetadata {
  const values = data.map(row => row[columnName]);
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');

  const type = inferDataType(values);
  const uniqueCount = new Set(nonNullValues).size;
  const missingCount = values.length - nonNullValues.length;
  const missingPercent = (missingCount / values.length) * 100;

  const sampleSize = Math.min(5, nonNullValues.length);
  const sampleValues = nonNullValues.slice(0, sampleSize);

  const stats = calculateStats(values, type);

  return {
    name: normalizeColumnName(columnName),
    originalName: columnName,
    type,
    uniqueCount,
    missingCount,
    missingPercent,
    sampleValues,
    cardinality: type === 'categorical' ? uniqueCount : undefined,
    isPrimaryKey: uniqueCount === values.length && missingCount === 0,
    ...stats,
  };
}

function analyzeDataQuality(data: any[], columns: ColumnMetadata[]): DataQuality {
  const warnings: string[] = [];
  const missingValuesByColumn: Record<string, number> = {};

  columns.forEach(col => {
    missingValuesByColumn[col.originalName] = col.missingCount;

    if (col.missingPercent > 50) {
      warnings.push(`Column "${col.originalName}" has ${col.missingPercent.toFixed(1)}% missing values`);
    }

    if (col.type === 'text' && col.uniqueCount === data.length) {
      warnings.push(`Column "${col.originalName}" appears to be high-cardinality text`);
    }
  });

  const rowStrings = data.map(row => JSON.stringify(row));
  const uniqueRows = new Set(rowStrings).size;
  const duplicateRows = data.length - uniqueRows;

  if (duplicateRows > 0) {
    warnings.push(`Found ${duplicateRows} duplicate rows`);
  }

  return {
    totalRows: data.length,
    totalColumns: columns.length,
    missingValuesByColumn,
    duplicateRows,
    warnings,
  };
}

export function parseExcelFile(file: File): Promise<ParsedWorkbook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        const sheets: ParsedSheet[] = workbook.SheetNames.map(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            defval: null,
            raw: false
          });

          if (jsonData.length === 0) {
            return {
              name: sheetName,
              data: [],
              columns: [],
              quality: {
                totalRows: 0,
                totalColumns: 0,
                missingValuesByColumn: {},
                duplicateRows: 0,
                warnings: ['Sheet is empty'],
              },
            };
          }

          const columnNames = Object.keys(jsonData[0]);
          const columns = columnNames.map(colName => analyzeColumn(jsonData, colName));
          const quality = analyzeDataQuality(jsonData, columns);

          return {
            name: sheetName,
            data: jsonData,
            columns,
            quality,
          };
        });

        resolve({
          sheets,
          selectedSheet: 0,
        });
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}
