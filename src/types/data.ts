export type DataType = 'numeric' | 'categorical' | 'datetime' | 'text' | 'boolean' | 'identifier';

export interface ColumnMetadata {
  name: string;
  originalName: string;
  type: DataType;
  uniqueCount: number;
  missingCount: number;
  missingPercent: number;
  sampleValues: any[];
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
  outliers?: number[];
  cardinality?: number;
  isPrimaryKey?: boolean;
}

export interface DataQuality {
  totalRows: number;
  totalColumns: number;
  missingValuesByColumn: Record<string, number>;
  duplicateRows: number;
  warnings: string[];
}

export interface ParsedSheet {
  name: string;
  data: any[];
  columns: ColumnMetadata[];
  quality: DataQuality;
}

export interface ParsedWorkbook {
  sheets: ParsedSheet[];
  selectedSheet: number;
}

export type ChartType =
  | 'bar'
  | 'line'
  | 'area'
  | 'scatter'
  | 'pie'
  | 'histogram'
  | 'box'
  | 'stacked-bar'
  | 'stacked-area'
  | '100-stacked-bar'
  | '100-stacked-area';

export type AggregationType = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median';

export interface ChartRecommendation {
  id: string;
  type: ChartType;
  title: string;
  description: string;
  rationale: string;
  xAxis?: string;
  yAxis?: string | string[];
  colorBy?: string;
  aggregation?: AggregationType;
  filters?: Record<string, any>;
  confidence: number;
  insights?: string[];
}

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  xAxis?: string;
  yAxis?: string | string[];
  colorBy?: string;
  aggregation?: AggregationType;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  topN?: number;
  showTrendline?: boolean;
  stacked?: boolean;
  normalized?: boolean;
}

export interface FilterState {
  [columnName: string]: any[];
}
