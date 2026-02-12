# K6 Load Testing Scripts

Scripts de prueba de carga para la API de Gender-Lex usando [k6](https://k6.io/).

# K6 Load Testing Scripts

Scripts de prueba de carga para la API de Gender-Lex usando [k6](https://k6.io/).

## Prerequisitos

Instalar k6:

### Windows

```powershell
winget install k6 --source winget
```

O descargar desde: https://k6.io/docs/get-started/installation/

### Linux/Mac

```bash
# Linux (Debian/Ubuntu)
sudo apt-get update
sudo apt-get install k6
k6 run apps/api/test/k6/smoke/scenario.js

# macOS
brew install k6
```

## Scripts Disponibles

Prueba básica con carga mínima para verificar funcionalidad.

k6 run apps/api/test/k6/load/scenario.js

-   **VUs**: 1 usuario
-   **Duración**: 1 minuto
-   **Uso**: Validación rápida después de despliegues

````powershell
k6 run k6-smoke-test.js

Prueba de carga normal con incremento gradual.
k6 run apps/api/test/k6/stress/scenario.js

-   **VUs**: 10-20 usuarios
-   **Duración**: ~4 minutos
-   **Uso**: Pruebas regulares de rendimiento

```powershell
### 3. Stress Test (`k6-stress-test.js`)

k6 run apps/api/test/k6/spike/scenario.js
Prueba de estrés para encontrar límites del sistema.

-   **VUs**: hasta 150 usuarios
-   **Duración**: ~21 minutos
-   **Uso**: Identificar punto de quiebre

```powershell
k6 run k6-stress-test.js
````

### 4. Spike Test (`k6-spike-test.js`)

k6 run apps/api/test/k6/load/scenario.js

Prueba de picos súbitos de tráfico.

-   **VUs**: 10 → 200 → 10 usuarios
-   **Duración**: ~6 minutos
-   **Uso**: Verificar manejo de tráfico repentino

```powershell
k6 run k6-spike-test.js
```

## Configuración

k6 run -e API_URL=http://localhost:3000 apps/api/test/k6/load/scenario.js

### URL de la API

Por defecto, los scripts usan `http://localhost:3232`. Para cambiar:

```powershell
$env:API_URL = "https://api.production.com"
k6 run k6-load-test.js
# Bash
API_URL=https://api.production.com k6 run k6-load-test.js
```

### Variables de Entorno Adicionales

Puedes pasar variables adicionales:

```powershell
k6 run -e API_URL=http://localhost:3232 k6-load-test.js
```

## Análisis de Resultados

### Métricas Clave

-   **http_req_duration**: Tiempo de respuesta de las peticiones
    -   p(95): 95% de las peticiones deben estar por debajo del umbral
    -   p(99): 99% de las peticiones deben estar por debajo del umbral
-   **http_req_failed**: Tasa de errores HTTP
-   **iterations**: Número de iteraciones completadas
-   **vus**: Usuarios virtuales activos

### Resultados en la Consola

k6 muestra resultados en tiempo real y un resumen al final. Ejemplo de Load Test:

````
🚀 Starting Document Processing & Analysis Stress Test
Target: http://localhost:3000
k6 run --out json=results.json apps/api/test/k6/load/scenario.js
Stress Profile: 200 → 500 → 1000 users over 1 minute

     ✓ prepare analysis status ok
     ✓ analysis list returns array
     ✓ status count is object
k6 run --out csv=results.csv apps/api/test/k6/load/scenario.js

█ CUSTOM METRICS
     analysis_preparation_duration..: avg=2.3s  min=1.2s med=2.1s max=8.5s  p(90)=3.8s p(95)=4.2s
     analysis_list_query_duration...: avg=450ms min=120ms med=380ms max=1.2s p(90)=780ms p(95)=920ms
     document_processing_errors.....: 245 errors
k6 run --out influxdb=http://localhost:8086/k6 apps/api/test/k6/load/scenario.js

█ HTTP METRICS
     http_req_duration..............: avg=1.5s  min=100ms med=1.2s max=10s  p(90)=3.2s p(95)=4.5s
     http_req_failed................: 24.5% ✓ 245 / ✗ 755
     http_reqs......................: 1000   16.67/s
k6 cloud apps/api/test/k6/load/scenario.js

✅ Document Processing & Analysis Stress Test completed

Además, cada escenario genera automáticamente un `summary.txt` y un `results.json` hipotético bajo su carpeta (por ejemplo, `apps/api/test/k6/smoke/summary.txt`). Estos archivos contienen métricas agregadas por endpoint (VUs, duración efectiva, total de requests, fallos y tasa de error) para compartir resultados rápidamente sin necesidad de rerun.
### Exportar Resultados

#### JSON

```powershell
k6 run --out json=results.json k6-load-test.js
````

#### CSV

```powershell
k6 run --out csv=results.csv k6-load-test.js
```

#### InfluxDB (para visualización con Grafana)

```powershell
k6 run --out influxdb=http://localhost:8086/k6 k6-load-test.js
```

#### K6 Cloud (servicio en línea)

```powershell
k6 cloud k6-load-test.js
```

## 🎯 Thresholds (Umbrales)

Cada prueba tiene umbrales específicos según el área crítica:

### Smoke Test (Baseline)

```javascript
thresholds: {
  'baseline_health_check_time': ['p(95)<100'],      // <100ms
  'baseline_document_prep_time': ['p(95)<3000'],    // <3s
  'baseline_sse_connection_time': ['p(95)<1000'],   // <1s
  'baseline_db_query_time': ['p(95)<500'],          // <500ms
  'http_req_failed': ['rate<0.05'],                 // <5% errors
}
```

### Load/Stress/Spike Tests (Alta Carga)

```javascript
thresholds: {
  'analysis_preparation_duration': ['p(95)<5000'],  // Prep <5s
  'sse_connection_time': ['p(95)<2000'],            // SSE <2s
  'workflow_start_time': ['p(95)<3000'],            // Workflow <3s
  'http_req_failed': ['rate<0.3'],                  // <30% errors bajo estrés
}
```

**Nota**: Los umbrales son más permisivos en pruebas de estrés (200-1000 usuarios) para identificar límites reales del sistema.

Si algún umbral no se cumple, k6 retorna exit code ≠ 0 (útil para CI/CD).

## Personalización

### Ajustar Stages

Modifica las etapas en `options.stages`:

```javascript
export const options = {
    stages: [
        { duration: "1m", target: 50 }, // Tu configuración
        { duration: "3m", target: 50 },
        { duration: "1m", target: 0 },
    ],
}
```

### Agregar Nuevos Endpoints

Agrega funciones de prueba en el script:

```javascript
function testNuevoEndpoint() {
    const res = http.get(`${BASE_URL}/tu-endpoint`)

    check(res, {
        "response tiene data": r => r.json("data") !== undefined,
    })
}
```

### Autenticación

```javascript
const params = {
    headers: {
        Authorization: "Bearer YOUR_TOKEN",
        "Content-Type": "application/json",
    },
}

const res = http.get(`${BASE_URL}/protected`, params)
```

## Integración CI/CD

-   name: Run k6 smoke test
    run: |
    k6 run k6-smoke-test.js
-   `0`: Todas las pruebas pasaron
-   `99`: Algunos umbrales fallaron
-   `Otro`: Error en la ejecución

1. **Smoke Test**: Establecer baseline y validar funcionalidad
2. **Load Test**: Evaluar procesamiento de documentos con carga moderada
3. **Stress Test**: Probar SSE con conexiones extremas
4. **Spike Test**: Validar workflows con análisis masivos paralelos

-   **Monitorear Recursos**: Usar `htop` (Linux) o Task Manager (Windows) para CPU/RAM
-   **Observar Base de Datos**: Queries lentas, conexiones abiertas, locks
-   **Revisar Logs**: Errores de aplicación en tiempo real

-   Usar staging con specs similares a producción
-   Limpiar datos de prueba entre ejecuciones

### Interpretación de Resultados

-   **Smoke Test falla**: Problema funcional básico - NO ejecutar otras pruebas
-   **Tasa de error <10%**: Sistema saludable bajo carga normal
-   **Tasa de error 10-30%**: Carga alta pero manejable

### Error: "connection refused"

-   Verifica que la API esté corriendo

### Performance Degradado

-   Verifica recursos del sistema

### Timeout Errors

-   Incrementa timeouts: `http.setDefaultTimeout(30000);`
-   Revisa consultas lentas en la base de datos
-   Optimiza endpoints problemáticos

## 📚 Recursos

k6 run apps/api/test/k6/smoke/scenario.js

### Documentación k6

k6 run apps/api/test/k6/load/scenario.js

-   [Documentación oficial](https://k6.io/docs/)
    k6 run apps/api/test/k6/stress/scenario.js
-   [Ejemplos de k6](https://k6.io/docs/examples/)
-   [Best Practices](https://k6.io/docs/testing-guides/test-builder/)
    k6 run apps/api/test/k6/spike/scenario.js
-   [Community Forum](https://community.k6.io/)

k6 run --out json=results.json apps/api/test/k6/load/scenario.js

### Métricas y Monitoreo

-   [Custom Metrics](https://k6.io/docs/using-k6/metrics/#custom-metrics)
-   [Thresholds Guide](https://k6.io/docs/using-k6/thresholds/)
-   [Grafana + k6](https://k6.io/docs/results-output/real-time/grafana/)

### Performance Testing

-   [Load Testing Best Practices](https://k6.io/docs/testing-guides/load-testing-best-practices/)
-   [SSE Testing](https://k6.io/docs/examples/server-sent-events/)
-   [FormData Upload](https://k6.io/docs/examples/data-uploads/)

---

## 📝 Resumen Rápido

```powershell
# 1. Validar funcionalidad básica (1 min)
k6 run apps/api/test/k6/smoke/scenario.js

# 2. Estrés de procesamiento de documentos (1 min, 200-1000 users)
k6 run apps/api/test/k6/load/scenario.js

# 3. Estrés de conexiones SSE (1 min, 200-1000 connections)
k6 run apps/api/test/k6/stress/scenario.js

# 4. Estrés de workflows paralelos (1 min, 200-1000 workflows)
k6 run apps/api/test/k6/spike/scenario.js

# Exportar resultados
k6 run --out json=results.json apps/api/test/k6/load/scenario.js
```

**Perfil de Estrés**: Todas las pruebas (excepto smoke) ejecutan con 200 → 500 → 1000 usuarios durante 1 minuto máximo, probando las 5 áreas críticas de la aplicación.
