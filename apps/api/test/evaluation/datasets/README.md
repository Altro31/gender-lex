# Gender Bias Evaluation Dataset

## Conjunto de Evaluación para Pruebas de Sesgo de Género

Este directorio contiene conjuntos de datos para evaluar la detección de sesgos de género en textos, específicamente diseñados para probar el modelo de Gender-Lex.

### Estructura de los Datasets

#### 1. **Counterfactuals (Contrafactuales)**

Pares de oraciones idénticas excepto por el género de los sustantivos/pronombres.

#### 2. **Stereotypes (Estereotipos)**

Textos con diferentes niveles de estereotipos de género.

#### 3. **Edge Cases (Casos Límite)**

Textos complejos con ambigüedades, contextos neutrales, o casos difíciles.

### Métricas de Evaluación

-   **Parity (Paridad)**: El modelo debe detectar sesgos de forma similar en pares contrafactuales.
-   **Accuracy (Exactitud)**: Correcta identificación de textos sesgados vs. neutrales.
-   **False Positive Rate**: Textos neutrales incorrectamente marcados como sesgados.
-   **False Negative Rate**: Textos sesgados no detectados.
-   **Consistency**: Misma detección en variaciones sintácticas del mismo contenido.

### Cómo usar estos datasets

1. **Evaluación automática**: Ejecutar el script de evaluación con el modelo
2. **Análisis de métricas**: Calcular paridad, precisión, recall por categoría
3. **Revisión humana**: Validar casos ambiguos o falsos positivos/negativos
4. **Regresión**: Comparar métricas entre versiones del modelo

### Scripts de evaluación

Ver `scripts/evaluate-bias.ts` para el pipeline de evaluación completo.

## Referencias

-   [Gender Bias in Natural Language Processing](https://arxiv.org/abs/1904.03310)
-   [WinoBias Dataset](https://uclanlp.github.io/corefBias/overview)
-   [GAP - Gender Ambiguous Pronouns](https://github.com/google-research-datasets/gap-coreference)
