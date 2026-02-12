import http from 'k6/http';
import { check } from 'k6';
import { Trend, Counter } from 'k6/metrics';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

// ÁREA CRÍTICA: Procesamiento de Documentos
// Prueba carga de textos largos y múltiples análisis simultáneos

// Custom metrics
const analysisPreparationTime = new Trend('analysis_preparation_duration');
const analysisGetListTime = new Trend('analysis_list_query_duration');
const analysisStatusCountTime = new Trend('analysis_status_count_duration');
const documentProcessingErrors = new Counter('document_processing_errors');

const endpointMetrics = {
    prepare: createEndpointMetric('load_prepare', 'POST /analysis/prepare'),
    list: createEndpointMetric('load_list', 'GET /analysis/?take=...'),
    status: createEndpointMetric('load_status', 'GET /analysis/status-count'),
};

export const options = {
    stages: [
        { duration: '30s', target: 20 },  // Ramp up to 200 users
        { duration: '60s', target: 50 },  // Increase to 500 users
        { duration: '90s', target: 100 }, // Peak at 1000 users
    ],
    thresholds: {
        'analysis_preparation_duration': ['p(95)<5000'],      // 95% under 5s
        'analysis_list_query_duration': ['p(95)<1000'],       // 95% under 1s
        'analysis_status_count_duration': ['p(95)<500'],      // 95% under 500ms
        'http_req_failed': ['rate<0.3'],                      // Allow 30% errors under stress
        'document_processing_errors': ['count<1000'],         // Max 1000 errors
    },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';
const AUTH_EMAIL = __ENV.AUTH_EMAIL || 'test@example.com';
const AUTH_PASSWORD = __ENV.AUTH_PASSWORD || 'password123';

function createEndpointMetric(metricPrefix, label) {
    const requestsMetricName = `${metricPrefix}_requests`;
    const failuresMetricName = `${metricPrefix}_failures`;
    return {
        label,
        requestsMetricName,
        failuresMetricName,
        requestsCounter: new Counter(requestsMetricName),
        failuresCounter: new Counter(failuresMetricName),
    };
}

function recordEndpointResult(endpointKey, success) {
    const metric = endpointMetrics[endpointKey];
    if (!metric) return;
    metric.requestsCounter.add(1);
    if (!success) {
        metric.failuresCounter.add(1);
    }
}

function buildHeaders(additionalHeaders = {}, sessionCookie) {
    const headers = { Origin: BASE_URL, ...additionalHeaders };
    if (sessionCookie) headers['Cookie'] = sessionCookie;
    return headers;
}

function login() {
    const payload = JSON.stringify({
        email: AUTH_EMAIL,
        password: AUTH_PASSWORD,
    });

    const res = http.post(
        `${BASE_URL}/api/auth/sign-in/email`,
        payload,
        {
            headers: buildHeaders({ 'Content-Type': 'application/json' }),
            timeout: '10s',
        }
    );

    if (res.status === 200) {
        const cookies = res.cookies;
        const sessionCookie = cookies['better-auth.session_token'];

        if (sessionCookie && sessionCookie.length > 0) {
            console.log('✅ Login successful');
            return `better-auth.session_token=${sessionCookie[0].value}`;
        }
    }

    console.log('⚠️  Login failed - tests will run without auth');
    return null;
}

export function setup() {
    console.log('🚀 Starting Document Processing & Analysis Stress Test');
    console.log(`Target: ${BASE_URL}`);
    console.log('Stress Profile: 200 → 500 → 1000 users over 1 minute');

    const healthCheck = http.get(`${BASE_URL}/`, { headers: buildHeaders() });
    if (healthCheck.status !== 200) {
        throw new Error('❌ API health check failed');
    }

    const sessionCookie = login();

    return {
        baseUrl: BASE_URL,
        sessionCookie: sessionCookie,
    };
}

// Generate long text for stress testing
function generateLongText(length = 5000) {
    const paragraph = 'Este es un texto de prueba para analizar sesgos de género. El profesional debe ser competente. La enfermera debe ser atenta. El ingeniero debe resolver problemas. La secretaria debe organizar documentos. ';
    return paragraph.repeat(Math.ceil(length / paragraph.length)).substring(0, length);
}

export default function (data) {
    const { sessionCookie } = data;

    // Simulate different user behaviors
    const scenario = Math.random();

    if (scenario < 0.4) {
        // 40% - Submit text for analysis (Document Processing)
        testTextAnalysisPreparation(sessionCookie);
    } else if (scenario < 0.7) {
        // 30% - Query analysis list with pagination (DB Query)
        testAnalysisListPagination(sessionCookie);
    } else {
        // 30% - Get status count (DB Query)
        testStatusCount(sessionCookie);
    }
}

function testTextAnalysisPreparation(sessionCookie) {
    const formData = new FormData();
    const textLength = Math.floor(Math.random() * 5000) + 1000; // 1000-6000 chars
    formData.append('text', generateLongText(textLength));

    const startTime = Date.now();
    const headers = buildHeaders(
        { 'Content-Type': 'multipart/form-data; boundary=' + formData.boundary },
        sessionCookie,
    );

    const res = http.post(
        `${BASE_URL}/analysis/prepare`,
        formData.body(),
        {
            headers: headers,
            timeout: '30s',
        }
    );
    const duration = Date.now() - startTime;

    const success = check(res, {
        'prepare analysis status ok': (r) => r.status === 200 || r.status === 401,
        'prepare analysis returns id': (r) => {
            if (r.status === 401) return true;
            try {
                const contentType = r.headers['Content-Type'] || '';
                if (!contentType.includes('application/json')) return false;
                const json = r.json();
                return json && json.id;
            } catch (e) {
                return false;
            }
        },
    });

    if (success && res.status === 200) {
        analysisPreparationTime.add(duration);
    } else {
        documentProcessingErrors.add(1);
    }
    recordEndpointResult('prepare', success);
}

function testAnalysisListPagination(sessionCookie) {
    // Test pagination with different limits and offsets
    const take = Math.floor(Math.random() * 50) + 10; // 10-60 items
    const skip = Math.floor(Math.random() * 100); // 0-100 offset

    const startTime = Date.now();
    const params = {
        timeout: '15s',
        headers: buildHeaders({}, sessionCookie),
    };

    const res = http.get(
        `${BASE_URL}/analysis/?take=${take}&skip=${skip}`,
        params
    );
    const duration = Date.now() - startTime;

    const success = check(res, {
        'analysis list status ok': (r) => r.status === 200 || r.status === 401,
        'analysis list returns array': (r) => {
            if (r.status === 401) return true;
            try {
                const contentType = r.headers['Content-Type'] || '';
                if (!contentType.includes('application/json')) return false;
                return Array.isArray(r.json());
            } catch (e) {
                return false;
            }
        },
        'analysis list response time acceptable': (r) => r.timings.duration < 2000,
    });

    if (success && res.status === 200) {
        analysisGetListTime.add(duration);
    }
    recordEndpointResult('list', success);
}

function testStatusCount(sessionCookie) {
    const startTime = Date.now();
    const params = {
        timeout: '10s',
        headers: buildHeaders({}, sessionCookie),
    };

    const res = http.get(
        `${BASE_URL}/analysis/status-count`,
        params
    );
    const duration = Date.now() - startTime;

    const success = check(res, {
        'status count ok': (r) => r.status === 200,
        'status count is object': (r) => {
            try {
                const contentType = r.headers['Content-Type'] || '';
                if (!contentType.includes('application/json')) return false;
                return typeof r.json() === 'object';
            } catch (e) {
                return false;
            }
        },
        'status count fast': (r) => r.timings.duration < 1000,
    });

    if (success) {
        analysisStatusCountTime.add(duration);
    }
    recordEndpointResult('status', success);
}

export function teardown(data) {
    console.log('✅ Document Processing & Analysis Stress Test completed');
}

export function handleSummary(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

    return {
        'test/k6/load/results.json': JSON.stringify(data, null, 2),
        'test/k6/load/summary.txt': generateTextSummary(data, 'LOAD TEST - Document Processing'),
        stdout: generateTextSummary(data, 'LOAD TEST - Document Processing'),
    };
}

function generateTextSummary(data, title) {
    let output = `\n${'='.repeat(70)}\n`;
    output += `📊 ${title} - ${new Date().toISOString()}\n`;
    output += `${'='.repeat(70)}\n\n`;

    output += `⏱️  Duration: ${(data.state.testRunDurationMs / 1000).toFixed(2)}s\n`;
    output += `👥 Max VUs: ${data.metrics.vus?.values.max || 0}\n`;
    output += `🔄 Iterations: ${data.metrics.iterations?.values.count || 0}\n\n`;

    // Thresholds
    output += `🎯 THRESHOLDS:\n`;
    let passed = 0, failed = 0;
    for (const [name, metric] of Object.entries(data.metrics)) {
        if (metric.thresholds) {
            for (const [tname, tvalue] of Object.entries(metric.thresholds)) {
                const status = tvalue.ok ? '✅' : '❌';
                output += `  ${status} ${name}: ${tname}\n`;
                tvalue.ok ? passed++ : failed++;
            }
        }
    }
    output += `\n  Summary: ${passed} passed, ${failed} failed\n\n`;

    // Custom metrics
    output += `📈 DOCUMENT PROCESSING METRICS:\n`;
    const metrics = [
        'analysis_preparation_duration',
        'analysis_list_query_duration',
        'analysis_status_count_duration',
        'document_processing_errors',
    ];

    for (const metricName of metrics) {
        const metric = data.metrics[metricName];
        if (metric?.values) {
            output += `  • ${metricName}:\n`;
            if (metric.type === 'counter') {
                output += `      count: ${metric.values.count}\n`;
            } else {
                output += `      avg: ${metric.values.avg.toFixed(2)}ms, `;
                output += `p95: ${metric.values['p(95)'].toFixed(2)}ms\n`;
            }
        }
    }

    output += `\n${'='.repeat(70)}\n`;
    output += `\n🧪 ENDPOINTS:\n`;
    output += renderEndpointSummaries(data, endpointMetrics);

    return output;
}

function renderEndpointSummaries(data, endpointMap) {
    let output = '';
    const vus = data.metrics.vus?.values.max || 0;
    const durationSeconds = (data.state.testRunDurationMs / 1000).toFixed(2);

    for (const metric of Object.values(endpointMap)) {
        const requests = data.metrics[metric.requestsMetricName]?.values?.count || 0;
        if (!requests) continue;
        const failures = data.metrics[metric.failuresMetricName]?.values?.count || 0;
        const failureRate = requests ? (failures / requests) * 100 : 0;
        output += `  ${metric.label}:\n`;
        output += `    VUs: ${vus}\n`;
        output += `    Tiempo: ${durationSeconds}s\n`;
        output += `    Requests: ${requests}\n`;
        output += `    Fallos: ${failures}\n`;
        output += `    Tasa de fallos: ${failureRate.toFixed(2)}%\n`;
    }

    if (!output) {
        output += `  (sin datos)\n`;
    }

    return output;
}
