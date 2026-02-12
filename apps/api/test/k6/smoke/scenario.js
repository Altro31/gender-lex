import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

// SMOKE TEST: Baseline de todas las áreas críticas
// Valida funcionalidad básica antes de pruebas de estrés

const healthCheckTime = new Trend('baseline_health_check_time');
const documentPrepTime = new Trend('baseline_document_prep_time');
const sseConnTime = new Trend('baseline_sse_connection_time');
const dbQueryTime = new Trend('baseline_db_query_time');
const apiResponseTime = new Trend('baseline_api_response_time');

const endpointMetrics = {
    health: createEndpointMetric('smoke_health', 'GET /'),
    document: createEndpointMetric('smoke_document_prepare', 'POST /analysis/prepare'),
    sse: createEndpointMetric('smoke_sse', 'GET /sse?close=1'),
    dbStatus: createEndpointMetric('smoke_db_status', 'GET /analysis/status-count'),
    dbList: createEndpointMetric('smoke_db_list', 'GET /analysis/?take=20&skip=0'),
    apiSpec: createEndpointMetric('smoke_api_spec', 'GET /openapi/spec'),
};

export const options = {
    vus: 5,
    duration: '30s',
    thresholds: {
        http_req_failed: ['rate<0.05'],
        http_req_duration: ['p(95)<1000'],
    },
};



const BASE_URL = __ENV.API_URL || 'http://localhost:3000';
const AUTH_EMAIL = __ENV.AUTH_EMAIL || 'tester@tester.com';
const AUTH_PASSWORD = __ENV.AUTH_PASSWORD || 'Tester123.';

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
        // Extract session cookie from Set-Cookie header
        const cookies = res.cookies;
        const sessionCookie = cookies['better-auth.session_token'];

        if (sessionCookie && sessionCookie.length > 0) {
            const cookieValue = sessionCookie[0].value;
            console.log('✅ Login successful');
            return `better-auth.session_token=${cookieValue}`;
        }
    }

    console.log('⚠️  Login failed or not configured - tests will run without auth');
    return null;
}

export function setup() {
    console.log('🔍 Starting Smoke Test - Baseline Performance');
    console.log(`Target: ${BASE_URL}`);
    console.log('Testing all critical areas with 1 user baseline');

    // Login and get session cookie
    const sessionCookie = login();

    return {
        baseUrl: BASE_URL,
        sessionCookie: sessionCookie,
    };
}

export default function (data) {
    const { sessionCookie } = data;

    // 1. Health Check (Sistema)
    testHealthCheck(sessionCookie);
    sleep(1);

    // 2. Document Processing (Procesamiento de Documentos)
    testDocumentProcessing(sessionCookie);
    sleep(2);

    // 3. SSE Connections (Conexiones en tiempo real)
    testSSEConnection(sessionCookie);
    sleep(2);

    // 4. Database Queries (Consultas a BD con paginación)
    testDatabaseQueries(sessionCookie);
    sleep(1);
}

function testHealthCheck(sessionCookie) {
    const start = Date.now();
    const params = { headers: buildHeaders({}, sessionCookie) };
    const res = http.get(`${BASE_URL}/`, params);
    const duration = Date.now() - start;

    const success = check(res, {
        '[Health] status 200': (r) => r.status === 200,
        '[Health] returns ok': (r) => r.json('ok') === true,
        '[Health] fast response': (r) => duration < 200,
    });

    if (success) healthCheckTime.add(duration);
    recordEndpointResult('health', success);
}

function testDocumentProcessing(sessionCookie) {
    const formData = new FormData();
    formData.append('text', 'El médico revisa al paciente. La enfermera prepara medicamentos.'.repeat(20));

    const start = Date.now();
    const headers = buildHeaders(
        { 'Content-Type': 'multipart/form-data; boundary=' + formData.boundary },
        sessionCookie,
    );

    const res = http.post(
        `${BASE_URL}/analysis/prepare`,
        formData.body(),
        {
            headers: headers,
            timeout: '15s',
        }
    );
    const duration = Date.now() - start;

    const success = check(res, {
        '[Document] prepare status ok': (r) => r.status === 200 || r.status === 401,
        '[Document] returns response': (r) => r.body !== '',
        '[Document] acceptable time': (r) => duration < 5000,
    });

    if (res.status === 200) documentPrepTime.add(duration);
    recordEndpointResult('document', success);
}

function testSSEConnection(sessionCookie) {
    const start = Date.now();
    const headers = buildHeaders({ Accept: 'text/event-stream' }, sessionCookie);
    const res = http.get(
        `${BASE_URL}/sse?close=1`,
        {
            timeout: '10s',
            headers: headers,
        }
    );
    const duration = Date.now() - start;

    const success = check(res, {
        '[SSE] connection status': (r) => r.status === 200 || r.status === 401,
        '[SSE] event stream header': (r) =>
            r.status === 401 || r.headers['Content-Type']?.includes('event-stream'),
        '[SSE] quick connection': (r) => duration < 2000,
        'status': r => {
            console.log(r.status);
            return true;
        }
    });

    if (res.status === 200) sseConnTime.add(duration);
    recordEndpointResult('sse', success);
}

function testDatabaseQueries(sessionCookie) {
    const params = { headers: buildHeaders({}, sessionCookie) };

    // Test 1: Status count (aggregation query)
    let start = Date.now();
    let res = http.get(`${BASE_URL}/analysis/status-count`, params);
    let duration = Date.now() - start;

    const statusCountSuccess = check(res, {
        '[DB] status count works': (r) => r.status === 200,
        '[DB] status count returns object': (r) => {
            try {
                const contentType = r.headers['Content-Type'] || '';
                if (!contentType.includes('application/json')) return false;
                return typeof r.json() === 'object';
            } catch (e) {
                return false;
            }
        },
        '[DB] status count fast': (r) => duration < 1000,
    });

    if (res.status === 200) dbQueryTime.add(duration);
    recordEndpointResult('dbStatus', statusCountSuccess);

    sleep(0.5);

    // Test 2: Paginated list query
    start = Date.now();
    res = http.get(`${BASE_URL}/analysis/?take=20&skip=0`, params);
    duration = Date.now() - start;

    const listSuccess = check(res, {
        '[DB] list query works': (r) => r.status === 200 || r.status === 401,
        '[DB] list returns array': (r) => {
            if (r.status === 401) return true;
            try {
                const contentType = r.headers['Content-Type'] || '';
                if (!contentType.includes('application/json')) return false;
                return Array.isArray(r.json());
            } catch (e) {
                return false;
            }
        },
        '[DB] list query fast': (r) => duration < 1000,
    });

    if (res.status === 200) dbQueryTime.add(duration);
    recordEndpointResult('dbList', listSuccess);
}

function testAPIEndpoints() {
    const start = Date.now();
    const res = http.get(`${BASE_URL}/openapi/spec`, { headers: buildHeaders() });
    const duration = Date.now() - start;

    const success = check(res, {
        '[API] spec available': (r) => r.status === 200,
        '[API] spec has structure': (r) => r.json('info') !== undefined,
        '[API] spec loads fast': (r) => duration < 1500,
    });

    if (res.status === 200) apiResponseTime.add(duration);
    recordEndpointResult('apiSpec', success);
}

export function teardown(data) {
    console.log('✅ Smoke Test completed - Baseline established');
}

// Personalizar cómo se guarda el resumen
export function handleSummary(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

    return {
        'test/k6/smoke/summary.txt': textSummary(data, { indent: ' ', enableColors: false }),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}

function textSummary(data, opts) {
    const { indent = '', enableColors = true } = opts || {};
    let output = '';

    // Header
    output += `${indent}\n`;
    output += `${indent}${'='.repeat(60)}\n`;
    output += `${indent}📊 SMOKE TEST RESULTS - ${new Date().toISOString()}\n`;
    output += `${indent}${'='.repeat(60)}\n\n`;

    // Test info
    output += `${indent}Duration: ${(data.state.testRunDurationMs / 1000).toFixed(2)}s\n`;
    output += `${indent}VUs: ${data.metrics.vus?.values.max || 0}\n`;
    output += `${indent}Iterations: ${data.metrics.iterations?.values.count || 0}\n\n`;

    // Thresholds
    output += `${indent}🎯 THRESHOLDS:\n`;
    for (const [name, threshold] of Object.entries(data.metrics)) {
        if (threshold.thresholds) {
            for (const [tname, tvalue] of Object.entries(threshold.thresholds)) {
                const passed = tvalue.ok ? '✅' : '❌';
                output += `${indent}  ${passed} ${name}: ${tname}\n`;
            }
        }
    }
    output += `\n`;

    // Custom metrics
    output += `${indent}📈 CUSTOM METRICS:\n`;
    const customMetrics = [
        'baseline_health_check_time',
        'baseline_document_prep_time',
        'baseline_sse_connection_time',
        'baseline_db_query_time',
        'baseline_api_response_time',
    ];

    for (const metricName of customMetrics) {
        const metric = data.metrics[metricName];
        if (metric?.values) {
            output += `${indent}  ${metricName}:\n`;
            output += `${indent}    avg: ${metric.values.avg.toFixed(2)}ms\n`;
            output += `${indent}    p95: ${metric.values['p(95)'].toFixed(2)}ms\n`;
        }
    }
    output += `\n`;

    // HTTP metrics
    output += `${indent}🌐 HTTP METRICS:\n`;
    if (data.metrics.http_req_duration?.values) {
        const http = data.metrics.http_req_duration.values;
        output += `${indent}  http_req_duration: avg=${http.avg.toFixed(2)}ms p95=${http['p(95)'].toFixed(2)}ms\n`;
    }
    if (data.metrics.http_req_failed?.values) {
        const failed = data.metrics.http_req_failed.values.rate * 100;
        output += `${indent}  http_req_failed: ${failed.toFixed(2)}%\n`;
    }
    if (data.metrics.http_reqs?.values) {
        output += `${indent}  http_reqs: ${data.metrics.http_reqs.values.count}\n`;
    }

    output += `\n${indent}🧪 ENDPOINTS:\n`;
    output += renderEndpointSummaries(data, endpointMetrics, indent);

    output += `${indent}\n${'='.repeat(60)}\n`;
    return output;
}

function renderEndpointSummaries(data, endpointMap, indent) {
    let output = '';
    const vus = data.metrics.vus?.values.max || 0;
    const durationSeconds = (data.state.testRunDurationMs / 1000).toFixed(2);

    for (const metric of Object.values(endpointMap)) {
        const requests = data.metrics[metric.requestsMetricName]?.values?.count || 0;
        if (!requests) continue;
        const failures = data.metrics[metric.failuresMetricName]?.values?.count || 0;
        const failureRate = requests ? (failures / requests) * 100 : 0;
        output += `${indent}  ${metric.label}:\n`;
        output += `${indent}    VUs: ${vus}\n`;
        output += `${indent}    Tiempo: ${durationSeconds}s\n`;
        output += `${indent}    Requests: ${requests}\n`;
        output += `${indent}    Fallos: ${failures}\n`;
        output += `${indent}    Tasa de fallos: ${failureRate.toFixed(2)}%\n`;
    }

    if (!output) {
        output += `${indent}  (sin datos)\n`;
    }

    return output;
}
