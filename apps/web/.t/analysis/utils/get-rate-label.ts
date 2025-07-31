export function getRateLabel(biasRate: number) {
	if (biasRate < 0.3) return "low"
	if (biasRate < 0.7) return "medium"
	return "high"
}
