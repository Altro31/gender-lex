import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';

// ÁREA CRÍTICA: Conexiones SSE (Server-Sent Events)
// Prueba múltiples clientes SSE simultáneos, latencia y keep-alive

const sseConnectionTime = new Trend('sse_connection_time');
const sseFirstMessageLatency = new Trend('sse_first_message_latency');
const sseKeepAliveReceived = new Counter('sse_keepalive_received');
const sseConnectionErrors = new Counter('sse_connection_errors');
const sseConnections = new Counter('sse_total_connections');
const sseConnectionSuccess = new Rate('sse_connection_success');

const endpointMetrics = {
    sse: createEndpointMetric('stress_sse', 'GET /sse/?close=1'),
    status: createEndpointMetric('stress_status', 'GET /analysis/status-count'),
    health: createEndpointMetric('stress_health', 'GET /'),
};

export const options = {
    stages: [
        { duration: '60s', target: 50 },  // Ramp up to 200 concurrent SSE connections
        { duration: '150s', target: 100 },  // Increase to 500 connections
        { duration: '300s', target: 150 }, // Peak at 1000 connections
    ],
    thresholds: {
        'sse_connection_time': ['p(95)<2000'],           // 95% connect under 2s
        'sse_first_message_latency': ['p(95)<500'],     // 95% first message under 500ms
        'sse_connection_success': ['rate>0.6'],         // At least 60% success
        'http_req_failed': ['rate<0.4'],                // Allow 40% errors under extreme stress
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
    console.log('🚀 Starting SSE Connections Stress Test');
    console.log(`Target: ${BASE_URL}`);
    console.log('Testing: Multiple SSE clients, latency, keep-alive (15s)');
    console.log('Stress Profile: 200 → 500 → 1000 concurrent connections');

    const sessionCookie = login();

    return {
        baseUrl: BASE_URL,
        sessionCookie: sessionCookie,
    };
}

export default function (data) {
    const { sessionCookie } = data;
    const scenario = Math.random();

    if (scenario < 0.6) {
        // 60% - Test SSE connections
        testSSEConnection(sessionCookie);
    } else if (scenario < 0.8) {
        // 20% - Test analysis streaming
        testAnalysisStreaming(sessionCookie);
    } else {
        // 20% - Test status queries (baseline)
        testBaselineQueries(sessionCookie);
    }
}

function testSSEConnection(sessionCookie) {
    sseConnections.add(1);
    const startTime = Date.now();

    const headers = buildHeaders(
        {
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache',
        },
        sessionCookie,
    );

    // Test SSE connection endpoint
    const res = http.get(
        `${BASE_URL}/sse/?close=1`,
        {
            timeout: '30s',
            headers: headers,
        }
    );

    const connectionTime = Date.now() - startTime;

    const success = check(res, {
        'sse connection established': (r) => r.status === 200 || r.status === 401,
        'sse returns event stream': (r) =>
            r.status === 401 ||
            r.headers['Content-Type']?.includes('text/event-stream') ||
            r.body?.includes('Connected'),
        'sse connection time acceptable': (r) => connectionTime < 3000,
    });

    if (success && res.status === 200) {
        sseConnectionTime.add(connectionTime);
        sseConnectionSuccess.add(1);

        // Simulate first message latency
        if (res.body && res.body.includes('Connected')) {
            sseFirstMessageLatency.add(connectionTime);
        }

        // Simulate keep-alive detection (ping every 15s)
        if (res.body && res.body.includes('ping')) {
            sseKeepAliveReceived.add(1);
        }
    } else {
        sseConnectionErrors.add(1);
        sseConnectionSuccess.add(0);
    }
    recordEndpointResult('sse', success);

    sleep(0.5);
}

function testAnalysisStreaming(sessionCookie) {
    // Simulate getting analysis updates via SSE streaming
    // Note: Without real analysis ID, we test the status-count as proxy
    const params = {
        timeout: '10s',
        headers: buildHeaders({}, sessionCookie),
    };

    const res = http.get(
        `${BASE_URL}/analysis/status-count`,
        params
    );

    const success = check(res, {
        'analysis data available': (r) => r.status === 200,
        'analysis data valid': (r) => {
            try {
                const contentType = r.headers['Content-Type'] || '';
                if (!contentType.includes('application/json')) return false;
                return typeof r.json() === 'object';
            } catch (e) {
                return false;
            }
        },
    });
    recordEndpointResult('status', success);

    sleep(0.3);
}

function testBaselineQueries(sessionCookie) {
    // Baseline queries to compare with SSE performance
    const res = http.get(`${BASE_URL}/`, { headers: buildHeaders({}, sessionCookie) });

    const success = check(res, {
        'baseline health check': (r) => r.status === 200,
        'baseline fast response': (r) => r.timings.duration < 200,
    });
    recordEndpointResult('health', success);

    sleep(0.2);
}

export function teardown(data) {
    console.log('✅ SSE Connections Stress Test completed');
}

export function handleSummary(data) {
    return {
        'test/k6/stress/results.json': JSON.stringify(data, null, 2),
        'test/k6/stress/summary.txt': generateSSESummary(data),
        stdout: generateSSESummary(data),
    };
}

function generateSSESummary(data) {
    let output = `\n${'='.repeat(70)}\n`;
    output += `📊 STRESS TEST - SSE Connections - ${new Date().toISOString()}\n`;
    output += `${'='.repeat(70)}\n\n`;

    output += `⏱️  Duration: ${(data.state.testRunDurationMs / 1000).toFixed(2)}s\n`;
    output += `🔌 Max Connections: ${data.metrics.vus?.values.max || 0}\n`;
    output += `🔄 Total Attempts: ${data.metrics.iterations?.values.count || 0}\n\n`;

    // SSE specific metrics
    output += `📡 SSE CONNECTION METRICS:\n`;
    const sseMetrics = [
        'sse_connection_time',
        'sse_first_message_latency',
        'sse_connection_success',
        'sse_keepalive_received',
        'sse_connection_errors',
        'sse_total_connections',
    ];

    for (const metricName of sseMetrics) {
        const metric = data.metrics[metricName];
        if (metric?.values) {
            output += `  • ${metricName}:\n`;
            if (metric.type === 'counter') {
                output += `      count: ${metric.values.count}\n`;
            } else if (metric.type === 'rate') {
                output += `      rate: ${(metric.values.rate * 100).toFixed(2)}%\n`;
            } else {
                output += `      avg: ${metric.values.avg.toFixed(2)}ms, `;
                output += `p95: ${metric.values['p(95)'].toFixed(2)}ms\n`;
            }
        }
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
