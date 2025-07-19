export function getBiasColor(biasPercentage: number) {
    if (biasPercentage < 0.3) return 'bg-green-500'
    if (biasPercentage < 0.7) return 'bg-yellow-500'
    return 'bg-red-500'
}
