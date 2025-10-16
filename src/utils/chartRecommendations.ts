import { ColumnMetadata, ChartRecommendation, ChartType, AggregationType } from '../types/data';

function generateInsights(
  data: any[],
  xCol: ColumnMetadata,
  yCol?: ColumnMetadata,
  aggregation?: AggregationType
): string[] {
  const insights: string[] = [];

  if (!yCol) return insights;

  if (yCol.type === 'numeric' && yCol.min !== undefined && yCol.max !== undefined) {
    const range = yCol.max - yCol.min;
    insights.push(`${yCol.originalName} ranges from ${yCol.min.toFixed(2)} to ${yCol.max.toFixed(2)}`);

    if (yCol.mean !== undefined) {
      insights.push(`Average ${yCol.originalName}: ${yCol.mean.toFixed(2)}`);
    }
  }

  if (xCol.type === 'categorical' && data.length > 0) {
    const grouped = data.reduce((acc, row) => {
      const key = row[xCol.originalName];
      if (!acc[key]) acc[key] = [];
      acc[key].push(row[yCol.originalName]);
      return acc;
    }, {} as Record<string, any[]>);

    const categories = Object.keys(grouped);
    if (categories.length > 0) {
      const aggregated = categories.map(cat => {
        const values = grouped[cat].filter(v => v != null && !isNaN(Number(v))).map(Number);
        if (values.length === 0) return { category: cat, value: 0 };

        const value = aggregation === 'sum'
          ? values.reduce((sum, v) => sum + v, 0)
          : values.reduce((sum, v) => sum + v, 0) / values.length;

        return { category: cat, value };
      });

      const sorted = aggregated.sort((a, b) => b.value - a.value);
      if (sorted.length > 0) {
        insights.push(`Top category: ${sorted[0].category} (${sorted[0].value.toFixed(2)})`);
      }

      const total = sorted.reduce((sum, item) => sum + item.value, 0);
      if (total > 0 && sorted.length > 0) {
        const topPercent = (sorted[0].value / total * 100).toFixed(1);
        insights.push(`${sorted[0].category} contributes ${topPercent}% of total`);
      }
    }
  }

  return insights;
}

function recommendForNumericVsNumeric(
  col1: ColumnMetadata,
  col2: ColumnMetadata,
  data: any[]
): ChartRecommendation[] {
  const recommendations: ChartRecommendation[] = [];

  recommendations.push({
    id: `scatter-${col1.name}-${col2.name}`,
    type: 'scatter',
    title: `${col1.originalName} vs ${col2.originalName}`,
    description: `Relationship between ${col1.originalName} and ${col2.originalName}`,
    rationale: 'Scatter plot is ideal for exploring correlations between two numeric variables',
    xAxis: col1.originalName,
    yAxis: col2.originalName,
    confidence: 0.9,
    insights: generateInsights(data, col1, col2),
  });

  return recommendations;
}

function recommendForCategoricalVsNumeric(
  catCol: ColumnMetadata,
  numCol: ColumnMetadata,
  data: any[]
): ChartRecommendation[] {
  const recommendations: ChartRecommendation[] = [];

  const categoryCount = catCol.uniqueCount;

  if (categoryCount <= 15) {
    recommendations.push({
      id: `bar-${catCol.name}-${numCol.name}`,
      type: 'bar',
      title: `${numCol.originalName} by ${catCol.originalName}`,
      description: `Compare ${numCol.originalName} across ${catCol.originalName}`,
      rationale: `Bar chart clearly shows comparisons between ${categoryCount} categories`,
      xAxis: catCol.originalName,
      yAxis: numCol.originalName,
      aggregation: 'sum',
      confidence: 0.95,
      insights: generateInsights(data, catCol, numCol, 'sum'),
    });
  } else {
    recommendations.push({
      id: `bar-${catCol.name}-${numCol.name}-top`,
      type: 'bar',
      title: `Top 10 ${catCol.originalName} by ${numCol.originalName}`,
      description: `Compare top categories by ${numCol.originalName}`,
      rationale: `Showing top 10 of ${categoryCount} categories for clarity`,
      xAxis: catCol.originalName,
      yAxis: numCol.originalName,
      aggregation: 'sum',
      topN: 10,
      confidence: 0.85,
      insights: generateInsights(data, catCol, numCol, 'sum'),
    });
  }

  return recommendations;
}

function recommendForDatetimeVsNumeric(
  dateCol: ColumnMetadata,
  numCol: ColumnMetadata,
  data: any[]
): ChartRecommendation[] {
  const recommendations: ChartRecommendation[] = [];

  recommendations.push({
    id: `line-${dateCol.name}-${numCol.name}`,
    type: 'line',
    title: `${numCol.originalName} over time`,
    description: `Track ${numCol.originalName} trends across ${dateCol.originalName}`,
    rationale: 'Line chart is best for visualizing trends and patterns over time',
    xAxis: dateCol.originalName,
    yAxis: numCol.originalName,
    confidence: 0.95,
    insights: generateInsights(data, dateCol, numCol),
  });

  recommendations.push({
    id: `area-${dateCol.name}-${numCol.name}`,
    type: 'area',
    title: `${numCol.originalName} over time (area)`,
    description: `Cumulative view of ${numCol.originalName}`,
    rationale: 'Area chart emphasizes magnitude and cumulative trends',
    xAxis: dateCol.originalName,
    yAxis: numCol.originalName,
    confidence: 0.8,
  });

  return recommendations;
}

function recommendDistribution(numCol: ColumnMetadata, data: any[]): ChartRecommendation[] {
  const recommendations: ChartRecommendation[] = [];

  recommendations.push({
    id: `histogram-${numCol.name}`,
    type: 'histogram',
    title: `Distribution of ${numCol.originalName}`,
    description: `Frequency distribution showing the spread of ${numCol.originalName}`,
    rationale: 'Histogram reveals the distribution pattern, central tendency, and spread',
    xAxis: numCol.originalName,
    yAxis: 'count',
    confidence: 0.85,
    insights: [
      numCol.mean !== undefined ? `Mean: ${numCol.mean.toFixed(2)}` : '',
      numCol.median !== undefined ? `Median: ${numCol.median.toFixed(2)}` : '',
      numCol.stdDev !== undefined ? `Std Dev: ${numCol.stdDev.toFixed(2)}` : '',
    ].filter(Boolean),
  });

  return recommendations;
}

function recommendComposition(catCol: ColumnMetadata, data: any[]): ChartRecommendation[] {
  const recommendations: ChartRecommendation[] = [];

  if (catCol.uniqueCount <= 8) {
    const grouped = data.reduce((acc, row) => {
      const key = row[catCol.originalName];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(grouped).reduce((sum, count) => sum + count, 0);
    const topCategory = Object.entries(grouped).sort((a, b) => b[1] - a[1])[0];

    recommendations.push({
      id: `pie-${catCol.name}`,
      type: 'pie',
      title: `Composition by ${catCol.originalName}`,
      description: `Part-to-whole breakdown of ${catCol.originalName}`,
      rationale: `Pie chart shows relative proportions of ${catCol.uniqueCount} categories`,
      colorBy: catCol.originalName,
      confidence: 0.8,
      insights: topCategory
        ? [`${topCategory[0]} represents ${((topCategory[1] / total) * 100).toFixed(1)}% of total`]
        : [],
    });
  }

  return recommendations;
}

export function generateChartRecommendations(
  columns: ColumnMetadata[],
  data: any[]
): ChartRecommendation[] {
  const recommendations: ChartRecommendation[] = [];

  const numericCols = columns.filter(c => c.type === 'numeric');
  const categoricalCols = columns.filter(c => c.type === 'categorical');
  const datetimeCols = columns.filter(c => c.type === 'datetime');

  numericCols.forEach(numCol => {
    recommendations.push(...recommendDistribution(numCol, data));
  });

  if (datetimeCols.length > 0 && numericCols.length > 0) {
    const dateCol = datetimeCols[0];
    numericCols.slice(0, 2).forEach(numCol => {
      recommendations.push(...recommendForDatetimeVsNumeric(dateCol, numCol, data));
    });
  }

  if (categoricalCols.length > 0 && numericCols.length > 0) {
    categoricalCols.slice(0, 2).forEach(catCol => {
      numericCols.slice(0, 2).forEach(numCol => {
        recommendations.push(...recommendForCategoricalVsNumeric(catCol, numCol, data));
      });
    });
  }

  if (numericCols.length >= 2) {
    for (let i = 0; i < Math.min(2, numericCols.length - 1); i++) {
      for (let j = i + 1; j < Math.min(i + 2, numericCols.length); j++) {
        recommendations.push(...recommendForNumericVsNumeric(numericCols[i], numericCols[j], data));
      }
    }
  }

  categoricalCols.slice(0, 2).forEach(catCol => {
    if (catCol.uniqueCount <= 8) {
      recommendations.push(...recommendComposition(catCol, data));
    }
  });

  return recommendations
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6);
}
