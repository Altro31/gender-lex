export function getBiasLevel(biasPercentage: number) {
    if (biasPercentage < 0.3) return 'Bajo'
    if (biasPercentage < 0.7) return 'Medio'
    return 'Alto'
}
