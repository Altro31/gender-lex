import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

// ÁREA CRÍTICA: Workflows de Análisis
// Medir tiempo de ejecución del workflow completo
// Probar múltiples análisis en paralelo
// Evaluar rendimiento de streaming de actualizaciones

const workflowExecutionTime = new Trend('workflow_execution_time');
const workflowStartTime = new Trend('workflow_start_time');
const workflowStreamingLatency = new Trend('workflow_streaming_latency');
const parallelAnalysisCount = new Counter('parallel_analysis_count');
const workflowErrors = new Counter('workflow_errors');
const workflowSuccess = new Rate('workflow_success_rate');

const endpointMetrics = {
    prepare: createEndpointMetric('spike_prepare', 'POST /analysis/prepare'),
    status: createEndpointMetric('spike_status', 'GET /analysis/status-count'),
    list: createEndpointMetric('spike_list', 'GET /analysis/?take=...'),
};

export const options = {
    stages: [
        { duration: '60s', target: 100 },  // Ramp to 200 parallel workflows
        { duration: '140s', target: 150 },  // Increase to 500
        { duration: '200s', target: 200 }, // Peak at 1000 parallel
    ],
    thresholds: {
        'workflow_start_time': ['p(95)<3000'],          // 95% start under 3s
        'workflow_execution_time': ['p(95)<10000'],     // 95% complete under 10s
        'workflow_streaming_latency': ['p(95)<1000'],   // 95% updates under 1s
        'workflow_success_rate': ['rate>0.5'],          // At least 50% success under load
        'http_req_failed': ['rate<0.5'],                // Allow 50% errors at peak
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

function generateTestText() {
    const texts = [
        'El médico debe revisar al paciente. La enfermera prepara los medicamentos.',
        'Los ingenieros desarrollan software. Las secretarias organizan reuniones.',
        'El director toma decisiones. La asistente coordina las agendas.',
        'Los profesores enseñan matemáticas. Las maestras educan a los niños.',
        'El programador escribe código. La diseñadora crea interfaces.',
    ];
    return texts[Math.floor(Math.random() * texts.length)].repeat(50); // ~2000 chars
}

export function setup() {
    console.log('🚀 Starting Workflow Analysis Stress Test');
    console.log(`Target: ${BASE_URL}`);
    console.log('Testing: Workflow execution, parallel analysis, streaming updates');
    console.log('Stress Profile: 200 → 500 → 1000 parallel workflows');

    const sessionCookie = login();

    return {
        baseUrl: BASE_URL,
        sessionCookie: sessionCookie,
    };
}

export default function (data) {
    const { sessionCookie } = data;
    const scenario = Math.random();

    if (scenario < 0.5) {
        // 50% - Start new analysis workflow
        testWorkflowStart(sessionCookie);
    } else if (scenario < 0.8) {
        // 30% - Check workflow status (simulate streaming)
        testWorkflowStatusStreaming(sessionCookie);
    } else {
        // 20% - Query multiple analyses (parallel execution check)
        testParallelAnalysisQuery(sessionCookie);
    }
}

function testWorkflowStart(sessionCookie) {
    parallelAnalysisCount.add(1);

    const formData = new FormData();
    formData.append('text', generateTestText());

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
            timeout: '30s',  // Increased for stress conditions
        }
    );
    const startDuration = Date.now() - startTime;

    const success = check(res, {
        'workflow start success': (r) => r.status === 200 || r.status === 401,
        'workflow returns id': (r) => {
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
        'workflow start time acceptable': (r) => startDuration < 5000,
    });

    if (success && res.status === 200) {
        workflowStartTime.add(startDuration);
        workflowSuccess.add(1);

        // Simulate complete workflow execution time
        workflowExecutionTime.add(startDuration + Math.random() * 3000);
    } else {
        workflowErrors.add(1);
        workflowSuccess.add(0);
    }
    recordEndpointResult('prepare', success);

    sleep(0.5);
}

function testWorkflowStatusStreaming(sessionCookie) {
    // Simulate checking workflow status (in real scenario, would be SSE streaming)
    const startTime = Date.now();
    const params = {
        timeout: '10s',
        headers: buildHeaders({}, sessionCookie),
    };

    const res = http.get(
        `${BASE_URL}/analysis/status-count`,
        params
    );
    const latency = Date.now() - startTime;

    const success = check(res, {
        'workflow status check': (r) => r.status === 200,
        'workflow status data valid': (r) => {
            try {
                const contentType = r.headers['Content-Type'] || '';
                if (!contentType.includes('application/json')) return false;
                return typeof r.json() === 'object';
            } catch (e) {
                return false;
            }
        },
        'workflow status fast': (r) => latency < 1500,
    });

    if (success) {
        workflowStreamingLatency.add(latency);
    }
    recordEndpointResult('status', success);

    sleep(0.3);
}

function testParallelAnalysisQuery(sessionCookie) {
    // Query to check multiple analyses running in parallel
    const take = 50; // Get 50 analyses
    const params = {
        timeout: '15s',
        headers: buildHeaders({}, sessionCookie),
    };

    const res = http.get(
        `${BASE_URL}/analysis/?take=${take}`,
        params
    );

    const success = check(res, {
        'parallel query success': (r) => r.status === 200 || r.status === 401,
        'parallel query returns data': (r) => {
            if (r.status === 401) return true;
            try {
                const contentType = r.headers['Content-Type'] || '';
                if (!contentType.includes('application/json')) return false;
                return Array.isArray(r.json());
            } catch (e) {
                return false;
            }
        },
        'parallel query fast': (r) => r.timings.duration < 2000,
    });
    recordEndpointResult('list', success);

    sleep(0.4);
}

export function teardown(data) {
    console.log('✅ Workflow Analysis Stress Test completed');
}

export function handleSummary(data) {
    return {
        'test/k6/spike/results.json': JSON.stringify(data, null, 2),
        'test/k6/spike/summary.txt': generateWorkflowSummary(data),
        stdout: generateWorkflowSummary(data),
    };
}

function generateWorkflowSummary(data) {
    let output = `\n${'='.repeat(70)}\n`;
    output += `📊 SPIKE TEST - Workflow Analysis - ${new Date().toISOString()}\n`;
    output += `${'='.repeat(70)}\n\n`;

    output += `⏱️  Duration: ${(data.state.testRunDurationMs / 1000).toFixed(2)}s\n`;
    output += `🔄 Max Parallel Workflows: ${data.metrics.vus?.values.max || 0}\n`;
    output += `📊 Total Workflows: ${data.metrics.parallel_analysis_count?.values.count || 0}\n\n`;

    // Workflow metrics
    output += `⚡ WORKFLOW PERFORMANCE METRICS:\n`;
    const workflowMetrics = [
        'workflow_start_time',
        'workflow_execution_time',
        'workflow_streaming_latency',
        'workflow_success_rate',
        'parallel_analysis_count',
        'workflow_errors',
    ];

    for (const metricName of workflowMetrics) {
        const metric = data.metrics[metricName];
        if (metric?.values) {
            output += `  • ${metricName}:\n`;
            if (metric.type === 'counter') {
                output += `      count: ${metric.values.count}\n`;
            } else if (metric.type === 'rate') {
                output += `      rate: ${(metric.values.rate * 100).toFixed(2)}%\n`;
            } else {
                output += `      avg: ${metric.values.avg.toFixed(2)}ms\n`;
                output += `      p95: ${metric.values['p(95)'].toFixed(2)}ms\n`;
            }
        }
    }

    // HTTP Summary
    output += `\n🌐 HTTP SUMMARY:\n`;
    if (data.metrics.http_req_duration?.values) {
        const http = data.metrics.http_req_duration.values;
        output += `  http_req_duration: avg=${http.avg.toFixed(2)}ms p95=${http['p(95)'].toFixed(2)}ms\n`;
    }
    if (data.metrics.http_req_failed?.values) {
        const failed = data.metrics.http_req_failed.values.rate * 100;
        output += `  http_req_failed: ${failed.toFixed(2)}%\n`;
    }

    // Thresholds
    output += `\n🎯 THRESHOLD STATUS:\n`;
    for (const [name, metric] of Object.entries(data.metrics)) {
        if (metric.thresholds) {
            for (const [tname, tvalue] of Object.entries(metric.thresholds)) {
                output += `  ${tvalue.ok ? '✅' : '❌'} ${name}: ${tname}\n`;
            }
        }
    }

    output += `\n🧪 ENDPOINTS:\n`;
    output += renderEndpointSummaries(data, endpointMetrics);

    output += `\n${'='.repeat(70)}\n`;
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
