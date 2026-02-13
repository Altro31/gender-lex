import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

// Métricas específicas para evaluación de modelos AI
const aiLatencyTrend = new Trend('ai_model_latency');
const aiP95Trend = new Trend('ai_p95_response_time');
const aiP99Trend = new Trend('ai_p99_response_time');
const aiThroughput = new Counter('ai_requests_completed');
const aiErrorRate = new Rate('ai_request_errors');
const analysisCompletionRate = new Rate('analysis_completion_rate');

// Métricas de calidad del modelo
const biasTermsDetected = new Counter('bias_terms_detected_total');
const suggestionsGenerated = new Counter('suggestions_generated_total');
const emptyResultsRate = new Rate('empty_analysis_results');

export const options = {
    scenarios: {
        // Escenario 1: Carga constante para medir latencia estable
        constant_load: {
            executor: 'constant-vus',
            vus: 10,
            duration: '5m',
            tags: { scenario: 'constant' },
        },
        // Escenario 2: Rampa gradual para ver degradación
        ramp_up: {
            executor: 'ramping-vus',
            startVUs: 5,
            stages: [
                { duration: '2m', target: 20 },
                { duration: '3m', target: 50 },
                { duration: '2m', target: 10 },
            ],
            startTime: '5m', // Comienza después del scenario 1
            tags: { scenario: 'ramp' },
        },
    },
    thresholds: {
        // Latencia del modelo AI
        'ai_model_latency': [
            'p(95)<10000', // p95 bajo 10s
            'p(99)<15000', // p99 bajo 15s
            'avg<7000',    // promedio bajo 7s
        ],
        // Tasa de error
        'ai_request_errors': ['rate<0.05'], // menos del 5% de errores
        // Tasa de completación
        'analysis_completion_rate': ['rate>0.90'], // al menos 90% completan
        // Resultados vacíos (calidad)
        'empty_analysis_results': ['rate<0.10'], // menos del 10% vacíos
    },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';
const AUTH_EMAIL = __ENV.AUTH_EMAIL || 'test@example.com';
const AUTH_PASSWORD = __ENV.AUTH_PASSWORD || 'password123';

// Conjunto de textos con diferentes niveles de sesgo para evaluar el modelo
const TEST_TEXTS = [
    {
        name: 'high_bias',
        text: 'El director debe ser un hombre de negocios astuto y decidido. La enfermera debe cuidar a los pacientes con ternura maternal. La secretaria debe ser bella y organizada.',
        expectedBias: 'high',
    },
    {
        name: 'medium_bias',
        text: 'El ingeniero resolvió el problema técnico. La diseñadora preparó una presentación atractiva. El gerente tomó decisiones estratégicas.',
        expectedBias: 'medium',
    },
    {
        name: 'low_bias',
        text: 'El equipo técnico trabajó en el proyecto. La gerencia evaluó los resultados. El personal administrativo coordinó las reuniones.',
        expectedBias: 'low',
    },
    {
        name: 'neutral',
        text: 'La organización implementó políticas inclusivas. El personal recibió capacitación en diversidad. Los equipos colaboraron efectivamente.',
        expectedBias: 'none',
    },
];

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
            console.log('✅ Login successful for AI latency test');
            return `better-auth.session_token=${sessionCookie[0].value}`;
        }
    }

    console.log('⚠️  Login failed - AI tests will run without auth');
    return null;
}

export function setup() {
    console.log('🤖 Starting AI Model Performance & Latency Test');
    console.log(`Target: ${BASE_URL}`);
    console.log('Focus: Model latency, throughput, and quality metrics');

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

export default function (data) {
    const { sessionCookie } = data;

    // Seleccionar texto de prueba de forma aleatoria (distribución uniforme)
    const testCase = TEST_TEXTS[Math.floor(Math.random() * TEST_TEXTS.length)];

    const analysisId = submitAnalysis(sessionCookie, testCase);

    if (!analysisId) {
        aiErrorRate.add(1);
        return;
    }

    // Esperar y polling del resultado
    const result = pollAnalysisResult(sessionCookie, analysisId, testCase.expectedBias);

    if (result.success) {
        analysisCompletionRate.add(1);
        aiThroughput.add(1);
    } else {
        analysisCompletionRate.add(0);
        aiErrorRate.add(1);
    }

    // Pequeña pausa para simular comportamiento real
    sleep(1);
}

function submitAnalysis(sessionCookie, testCase) {
    const formData = new FormData();
    formData.append('text', testCase.text);

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

    const submitSuccess = check(res, {
        'submit: status 200': (r) => r.status === 200,
        'submit: has response body': (r) => r.body && r.body.length > 0,
    });

    if (!submitSuccess) {
        console.log(`❌ Failed to submit analysis: ${res.status}`);
        return null;
    }

    try {
        const body = JSON.parse(res.body);
        return body.id || body.analysisId;
    } catch (e) {
        console.log(`⚠️  Failed to parse submit response: ${e.message}`);
        return null;
    }
}

function pollAnalysisResult(sessionCookie, analysisId, expectedBias) {
    const maxAttempts = 30; // 30 intentos = máximo 60 segundos
    const pollInterval = 2000; // 2 segundos entre intentos
    const startTime = Date.now();

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        sleep(pollInterval / 1000);

        const res = http.get(
            `${BASE_URL}/analysis/${analysisId}`,
            {
                headers: buildHeaders({}, sessionCookie),
                timeout: '10s',
            }
        );

        if (res.status !== 200) {
            continue;
        }

        try {
            const analysis = JSON.parse(res.body);

            // Check si el análisis está completo
            if (analysis.status === 'done') {
                const totalLatency = Date.now() - startTime;
                aiLatencyTrend.add(totalLatency);

                // Registrar métricas de p95/p99 aproximadas
                if (totalLatency > 0.99 * 15000) {
                    aiP99Trend.add(totalLatency);
                } else if (totalLatency > 0.95 * 10000) {
                    aiP95Trend.add(totalLatency);
                }

                // Evaluar calidad del resultado
                const qualityMetrics = evaluateAnalysisQuality(analysis, expectedBias);

                return {
                    success: true,
                    latency: totalLatency,
                    quality: qualityMetrics,
                };
            }

            // Si está en error, fallar inmediatamente
            if (analysis.status === 'error' || analysis.status === 'failed') {
                console.log(`❌ Analysis failed with status: ${analysis.status}`);
                return { success: false, error: 'analysis_failed' };
            }

        } catch (e) {
            console.log(`⚠️  Error parsing analysis result: ${e.message}`);
        }
    }

    // Timeout
    console.log(`⏱️  Analysis ${analysisId} timed out after ${maxAttempts * pollInterval / 1000}s`);
    return { success: false, error: 'timeout' };
}

function evaluateAnalysisQuality(analysis, expectedBias) {
    let hasResults = false;
    let termsCount = 0;
    let suggestionsCount = 0;

    // Contar términos sesgados detectados
    if (analysis.biasedTerms && Array.isArray(analysis.biasedTerms)) {
        termsCount = analysis.biasedTerms.length;
        biasTermsDetected.add(termsCount);
        hasResults = termsCount > 0;
    }

    // Contar sugerencias generadas
    if (analysis.modifiedTextAlternatives && Array.isArray(analysis.modifiedTextAlternatives)) {
        suggestionsCount = analysis.modifiedTextAlternatives.length;
        suggestionsGenerated.add(suggestionsCount);
        hasResults = hasResults || suggestionsCount > 0;
    }

    // Registrar si el resultado está vacío
    if (!hasResults) {
        emptyResultsRate.add(1);
    } else {
        emptyResultsRate.add(0);
    }

    return {
        termsCount,
        suggestionsCount,
        hasResults,
        expectedBias,
    };
}

export function handleSummary(data) {
    console.log('\n📊 AI Model Performance Summary:');
    console.log('================================');

    const metrics = data.metrics;

    // Latencia
    if (metrics.ai_model_latency) {
        console.log('\n🕐 Latency Metrics:');
        console.log(`   Average: ${metrics.ai_model_latency.values.avg.toFixed(2)}ms`);
        console.log(`   Median:  ${metrics.ai_model_latency.values.med.toFixed(2)}ms`);
        console.log(`   P95:     ${metrics.ai_model_latency.values['p(95)'].toFixed(2)}ms`);
        console.log(`   P99:     ${metrics.ai_model_latency.values['p(99)'].toFixed(2)}ms`);
        console.log(`   Max:     ${metrics.ai_model_latency.values.max.toFixed(2)}ms`);
    }

    // Throughput y errores
    if (metrics.ai_requests_completed) {
        console.log(`\n✅ Completed Requests: ${metrics.ai_requests_completed.values.count}`);
    }

    if (metrics.ai_request_errors) {
        const errorRate = (metrics.ai_request_errors.values.rate * 100).toFixed(2);
        console.log(`❌ Error Rate: ${errorRate}%`);
    }

    if (metrics.analysis_completion_rate) {
        const completionRate = (metrics.analysis_completion_rate.values.rate * 100).toFixed(2);
        console.log(`🎯 Completion Rate: ${completionRate}%`);
    }

    // Calidad del modelo
    console.log('\n🤖 Model Quality Metrics:');
    if (metrics.bias_terms_detected_total) {
        console.log(`   Bias Terms Detected: ${metrics.bias_terms_detected_total.values.count}`);
    }
    if (metrics.suggestions_generated_total) {
        console.log(`   Suggestions Generated: ${metrics.suggestions_generated_total.values.count}`);
    }
    if (metrics.empty_analysis_results) {
        const emptyRate = (metrics.empty_analysis_results.values.rate * 100).toFixed(2);
        console.log(`   Empty Results Rate: ${emptyRate}%`);
    }

    console.log('\n================================\n');

    return {
        'stdout': '', // Ya imprimimos en consola
        'summary.json': JSON.stringify(data, null, 2),
    };
}

export function teardown(data) {
    console.log('✅ AI Model Performance Test Complete');
}
