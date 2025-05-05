const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class MetricsTracker {
    constructor() {
        this.metrics = [];
        this.reportPath = path.join(__dirname, '../../reports');

        // Create reports directory if it doesn't exist
        if (!fs.existsSync(this.reportPath)) {
            fs.mkdirSync(this.reportPath, { recursive: true });
        }
    }

    addMetric(data) {
        this.metrics.push({
            timestamp: new Date(),
            ...data
        });
    }

    generateCSV() {
        // CSV Headers
        const headers = [
            'Timestamp',
            'Endpoint',
            'Method',
            'Source',
            'Response Time (ms)',
            'Status'
        ].join(',');

        // Convert metrics to CSV rows
        const rows = this.metrics.map(metric => {
            return [
                metric.timestamp.toISOString(),
                metric.endpoint || '',
                metric.method || '',
                metric.source || '',
                metric.responseTime || 0,
                metric.status || ''
            ].join(',');
        });

        // Add summary statistics
        const redisMetrics = this.metrics.filter(m => m.source === 'redis');
        const dbMetrics = this.metrics.filter(m => m.source === 'database');

        const summary = [
            '\nSummary Statistics',
            'Source,Count,Average Response Time (ms),Min Response Time (ms),Max Response Time (ms)'
        ];

        if (redisMetrics.length > 0) {
            summary.push([
                'Redis',
                redisMetrics.length,
                this.calculateAverage(redisMetrics),
                Math.min(...redisMetrics.map(m => m.responseTime)),
                Math.max(...redisMetrics.map(m => m.responseTime))
            ].join(','));
        }

        if (dbMetrics.length > 0) {
            summary.push([
                'Database',
                dbMetrics.length,
                this.calculateAverage(dbMetrics),
                Math.min(...dbMetrics.map(m => m.responseTime)),
                Math.max(...dbMetrics.map(m => m.responseTime))
            ].join(','));
        }

        // Combine everything
        return [headers, ...rows, ...summary].join('\n');
    }

    calculateAverage(metrics) {
        const sum = metrics.reduce((acc, curr) => acc + curr.responseTime, 0);
        return (sum / metrics.length).toFixed(2);
    }
}

// Create a singleton instance
const metricsTracker = new MetricsTracker();

module.exports = metricsTracker; 