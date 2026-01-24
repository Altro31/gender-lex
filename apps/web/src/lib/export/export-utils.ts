import type { Analysis } from "@repo/db/models";

export type ExportFormat = "pdf" | "txt" | "markdown";

/**
 * Formats the analysis data as plain text
 */
export function formatAsText(analysis: Analysis): string {
  const lines: string[] = [];

  // Header
  lines.push("=".repeat(80));
  lines.push("GENDER BIAS ANALYSIS REPORT");
  lines.push("=".repeat(80));
  lines.push("");
  lines.push(`Analysis ID: ${analysis.id}`);
  lines.push(`Date: ${new Date(analysis.createdAt).toLocaleString()}`);
  lines.push(`Status: ${analysis.status}`);
  lines.push("");

  // Original Text
  if (analysis.originalText) {
    lines.push("-".repeat(80));
    lines.push("ORIGINAL TEXT");
    lines.push("-".repeat(80));
    lines.push(analysis.originalText);
    lines.push("");
  }

  // Summary Statistics
  lines.push("-".repeat(80));
  lines.push("SUMMARY STATISTICS");
  lines.push("-".repeat(80));
  lines.push(`Biased Terms: ${analysis.biasedTerms?.length || 0}`);
  lines.push(`Biased Metaphors: ${analysis.biasedMetaphors?.length || 0}`);
  lines.push(`Text Alternatives: ${analysis.modifiedTextAlternatives?.length || 0}`);
  lines.push("");

  // Biased Terms
  if (analysis.biasedTerms && analysis.biasedTerms.length > 0) {
    lines.push("-".repeat(80));
    lines.push("IDENTIFIED BIASED TERMS");
    lines.push("-".repeat(80));
    analysis.biasedTerms.forEach((term, index) => {
      lines.push(`${index + 1}. "${term.content}"`);
      lines.push(`   Category: ${term.category}`);
      lines.push(`   Influence: ${Math.round(term.influencePercentage * 100)}%`);
      lines.push(`   Explanation: ${term.explanation}`);
      lines.push("");
    });
  }

  // Biased Metaphors
  if (analysis.biasedMetaphors && analysis.biasedMetaphors.length > 0) {
    lines.push("-".repeat(80));
    lines.push("BIASED METAPHORS");
    lines.push("-".repeat(80));
    analysis.biasedMetaphors.forEach((metaphor, index) => {
      lines.push(`${index + 1}. "${metaphor.content}"`);
      lines.push(`   Influence: ${Math.round(metaphor.influencePercentage * 100)}%`);
      lines.push(`   Explanation: ${metaphor.explanation}`);
      lines.push(`   Historical Context: ${metaphor.historicalContext}`);
      lines.push("");
    });
  }

  // Additional Context Evaluation
  if (analysis.additionalContextEvaluation) {
    lines.push("-".repeat(80));
    lines.push("ADDITIONAL CONTEXT EVALUATION");
    lines.push("-".repeat(80));

    const ctx = analysis.additionalContextEvaluation;

    if (ctx.stereotype) {
      lines.push("Stereotype:");
      lines.push(`  Present: ${ctx.stereotype.presence ? "Yes" : "No"}`);
      lines.push(`  Influence: ${Math.round(ctx.stereotype.influencePercentage * 100)}%`);
      lines.push(`  Explanation: ${ctx.stereotype.explanation}`);
      if (ctx.stereotype.examples && ctx.stereotype.examples.length > 0) {
        lines.push(`  Examples: ${ctx.stereotype.examples.join(", ")}`);
      }
      lines.push("");
    }

    if (ctx.powerAsymmetry) {
      lines.push("Power Asymmetry:");
      lines.push(`  Present: ${ctx.powerAsymmetry.presence ? "Yes" : "No"}`);
      lines.push(`  Influence: ${Math.round(ctx.powerAsymmetry.influencePercentage * 100)}%`);
      lines.push(`  Explanation: ${ctx.powerAsymmetry.explanation}`);
      if (ctx.powerAsymmetry.examples && ctx.powerAsymmetry.examples.length > 0) {
        lines.push(`  Examples: ${ctx.powerAsymmetry.examples.join(", ")}`);
      }
      lines.push("");
    }

    if (ctx.genderRepresentationAbsence) {
      lines.push("Gender Representation Absence:");
      lines.push(`  Present: ${ctx.genderRepresentationAbsence.presence ? "Yes" : "No"}`);
      lines.push(
        `  Influence: ${Math.round(ctx.genderRepresentationAbsence.influencePercentage * 100)}%`
      );
      lines.push(`  Explanation: ${ctx.genderRepresentationAbsence.explanation}`);
      if (
        ctx.genderRepresentationAbsence.affectedGroups &&
        ctx.genderRepresentationAbsence.affectedGroups.length > 0
      ) {
        lines.push(
          `  Affected Groups: ${ctx.genderRepresentationAbsence.affectedGroups.join(", ")}`
        );
      }
      lines.push("");
    }

    if (ctx.intersectionality) {
      lines.push("Intersectionality:");
      lines.push(`  Present: ${ctx.intersectionality.presence ? "Yes" : "No"}`);
      lines.push(`  Influence: ${Math.round(ctx.intersectionality.influencePercentage * 100)}%`);
      lines.push(`  Explanation: ${ctx.intersectionality.explanation}`);
      if (
        ctx.intersectionality.excludedGroups &&
        ctx.intersectionality.excludedGroups.length > 0
      ) {
        lines.push(`  Excluded Groups: ${ctx.intersectionality.excludedGroups.join(", ")}`);
      }
      lines.push("");
    }

    if (ctx.systemicBiases) {
      lines.push("Systemic Biases:");
      lines.push(`  Present: ${ctx.systemicBiases.presence ? "Yes" : "No"}`);
      lines.push(`  Influence: ${Math.round(ctx.systemicBiases.influencePercentage * 100)}%`);
      lines.push(`  Explanation: ${ctx.systemicBiases.explanation}`);
      if (ctx.systemicBiases.examples && ctx.systemicBiases.examples.length > 0) {
        lines.push(`  Examples: ${ctx.systemicBiases.examples.join(", ")}`);
      }
      lines.push("");
    }
  }

  // Impact Analysis
  if (analysis.impactAnalysis) {
    lines.push("-".repeat(80));
    lines.push("IMPACT ANALYSIS");
    lines.push("-".repeat(80));

    if (analysis.impactAnalysis.accessToCare) {
      lines.push("Access to Care:");
      lines.push(`  Affected: ${analysis.impactAnalysis.accessToCare.affected ? "Yes" : "No"}`);
      lines.push(`  Description: ${analysis.impactAnalysis.accessToCare.description}`);
      lines.push("");
    }

    if (analysis.impactAnalysis.stigmatization) {
      lines.push("Stigmatization:");
      lines.push(
        `  Affected: ${analysis.impactAnalysis.stigmatization.affected ? "Yes" : "No"}`
      );
      lines.push(`  Description: ${analysis.impactAnalysis.stigmatization.description}`);
      lines.push("");
    }
  }

  // Modified Text Alternatives
  if (analysis.modifiedTextAlternatives && analysis.modifiedTextAlternatives.length > 0) {
    lines.push("-".repeat(80));
    lines.push("TEXT ALTERNATIVES");
    lines.push("-".repeat(80));
    analysis.modifiedTextAlternatives.forEach((alternative) => {
      lines.push(`Alternative ${alternative.alternativeNumber}:`);
      lines.push(alternative.alternativeText);
      lines.push("");
      if (
        alternative.modificationsExplanation &&
        alternative.modificationsExplanation.length > 0
      ) {
        lines.push("Modifications:");
        alternative.modificationsExplanation.forEach((mod, i) => {
          lines.push(`  ${i + 1}. Original: "${mod.originalFragment}"`);
          lines.push(`     Modified: "${mod.modifiedFragment}"`);
          lines.push(`     Reason: ${mod.reason}`);
        });
        lines.push("");
      }
    });
  }

  // Conclusion
  if (analysis.conclusion) {
    lines.push("-".repeat(80));
    lines.push("CONCLUSION");
    lines.push("-".repeat(80));
    lines.push(analysis.conclusion);
    lines.push("");
  }

  // Footer
  lines.push("=".repeat(80));
  lines.push("End of Report");
  lines.push("=".repeat(80));

  return lines.join("\n");
}

/**
 * Formats the analysis data as markdown
 */
export function formatAsMarkdown(analysis: Analysis): string {
  const lines: string[] = [];

  // Header
  lines.push("# Gender Bias Analysis Report");
  lines.push("");
  lines.push(`**Analysis ID:** ${analysis.id}`);
  lines.push(`**Date:** ${new Date(analysis.createdAt).toLocaleString()}`);
  lines.push(`**Status:** ${analysis.status}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // Original Text
  if (analysis.originalText) {
    lines.push("## Original Text");
    lines.push("");
    lines.push(analysis.originalText);
    lines.push("");
  }

  // Summary Statistics
  lines.push("## Summary Statistics");
  lines.push("");
  lines.push(`- **Biased Terms:** ${analysis.biasedTerms?.length || 0}`);
  lines.push(`- **Biased Metaphors:** ${analysis.biasedMetaphors?.length || 0}`);
  lines.push(`- **Text Alternatives:** ${analysis.modifiedTextAlternatives?.length || 0}`);
  lines.push("");

  // Biased Terms
  if (analysis.biasedTerms && analysis.biasedTerms.length > 0) {
    lines.push("## Identified Biased Terms");
    lines.push("");
    analysis.biasedTerms.forEach((term, index) => {
      lines.push(`### ${index + 1}. "${term.content}"`);
      lines.push("");
      lines.push(`- **Category:** ${term.category}`);
      lines.push(`- **Influence:** ${Math.round(term.influencePercentage * 100)}%`);
      lines.push(`- **Explanation:** ${term.explanation}`);
      lines.push("");
    });
  }

  // Biased Metaphors
  if (analysis.biasedMetaphors && analysis.biasedMetaphors.length > 0) {
    lines.push("## Biased Metaphors");
    lines.push("");
    analysis.biasedMetaphors.forEach((metaphor, index) => {
      lines.push(`### ${index + 1}. "${metaphor.content}"`);
      lines.push("");
      lines.push(`- **Influence:** ${Math.round(metaphor.influencePercentage * 100)}%`);
      lines.push(`- **Explanation:** ${metaphor.explanation}`);
      lines.push(`- **Historical Context:** ${metaphor.historicalContext}`);
      lines.push("");
    });
  }

  // Additional Context Evaluation
  if (analysis.additionalContextEvaluation) {
    lines.push("## Additional Context Evaluation");
    lines.push("");

    const ctx = analysis.additionalContextEvaluation;

    if (ctx.stereotype) {
      lines.push("### Stereotype");
      lines.push("");
      lines.push(`- **Present:** ${ctx.stereotype.presence ? "Yes" : "No"}`);
      lines.push(`- **Influence:** ${Math.round(ctx.stereotype.influencePercentage * 100)}%`);
      lines.push(`- **Explanation:** ${ctx.stereotype.explanation}`);
      if (ctx.stereotype.examples && ctx.stereotype.examples.length > 0) {
        lines.push(`- **Examples:** ${ctx.stereotype.examples.join(", ")}`);
      }
      lines.push("");
    }

    if (ctx.powerAsymmetry) {
      lines.push("### Power Asymmetry");
      lines.push("");
      lines.push(`- **Present:** ${ctx.powerAsymmetry.presence ? "Yes" : "No"}`);
      lines.push(`- **Influence:** ${Math.round(ctx.powerAsymmetry.influencePercentage * 100)}%`);
      lines.push(`- **Explanation:** ${ctx.powerAsymmetry.explanation}`);
      if (ctx.powerAsymmetry.examples && ctx.powerAsymmetry.examples.length > 0) {
        lines.push(`- **Examples:** ${ctx.powerAsymmetry.examples.join(", ")}`);
      }
      lines.push("");
    }

    if (ctx.genderRepresentationAbsence) {
      lines.push("### Gender Representation Absence");
      lines.push("");
      lines.push(`- **Present:** ${ctx.genderRepresentationAbsence.presence ? "Yes" : "No"}`);
      lines.push(
        `- **Influence:** ${Math.round(ctx.genderRepresentationAbsence.influencePercentage * 100)}%`
      );
      lines.push(`- **Explanation:** ${ctx.genderRepresentationAbsence.explanation}`);
      if (
        ctx.genderRepresentationAbsence.affectedGroups &&
        ctx.genderRepresentationAbsence.affectedGroups.length > 0
      ) {
        lines.push(
          `- **Affected Groups:** ${ctx.genderRepresentationAbsence.affectedGroups.join(", ")}`
        );
      }
      lines.push("");
    }

    if (ctx.intersectionality) {
      lines.push("### Intersectionality");
      lines.push("");
      lines.push(`- **Present:** ${ctx.intersectionality.presence ? "Yes" : "No"}`);
      lines.push(
        `- **Influence:** ${Math.round(ctx.intersectionality.influencePercentage * 100)}%`
      );
      lines.push(`- **Explanation:** ${ctx.intersectionality.explanation}`);
      if (
        ctx.intersectionality.excludedGroups &&
        ctx.intersectionality.excludedGroups.length > 0
      ) {
        lines.push(`- **Excluded Groups:** ${ctx.intersectionality.excludedGroups.join(", ")}`);
      }
      lines.push("");
    }

    if (ctx.systemicBiases) {
      lines.push("### Systemic Biases");
      lines.push("");
      lines.push(`- **Present:** ${ctx.systemicBiases.presence ? "Yes" : "No"}`);
      lines.push(`- **Influence:** ${Math.round(ctx.systemicBiases.influencePercentage * 100)}%`);
      lines.push(`- **Explanation:** ${ctx.systemicBiases.explanation}`);
      if (ctx.systemicBiases.examples && ctx.systemicBiases.examples.length > 0) {
        lines.push(`- **Examples:** ${ctx.systemicBiases.examples.join(", ")}`);
      }
      lines.push("");
    }
  }

  // Impact Analysis
  if (analysis.impactAnalysis) {
    lines.push("## Impact Analysis");
    lines.push("");

    if (analysis.impactAnalysis.accessToCare) {
      lines.push("### Access to Care");
      lines.push("");
      lines.push(
        `- **Affected:** ${analysis.impactAnalysis.accessToCare.affected ? "Yes" : "No"}`
      );
      lines.push(`- **Description:** ${analysis.impactAnalysis.accessToCare.description}`);
      lines.push("");
    }

    if (analysis.impactAnalysis.stigmatization) {
      lines.push("### Stigmatization");
      lines.push("");
      lines.push(
        `- **Affected:** ${analysis.impactAnalysis.stigmatization.affected ? "Yes" : "No"}`
      );
      lines.push(`- **Description:** ${analysis.impactAnalysis.stigmatization.description}`);
      lines.push("");
    }
  }

  // Modified Text Alternatives
  if (analysis.modifiedTextAlternatives && analysis.modifiedTextAlternatives.length > 0) {
    lines.push("## Text Alternatives");
    lines.push("");
    analysis.modifiedTextAlternatives.forEach((alternative) => {
      lines.push(`### Alternative ${alternative.alternativeNumber}`);
      lines.push("");
      lines.push(alternative.alternativeText);
      lines.push("");
      if (
        alternative.modificationsExplanation &&
        alternative.modificationsExplanation.length > 0
      ) {
        lines.push("#### Modifications");
        lines.push("");
        alternative.modificationsExplanation.forEach((mod, i) => {
          lines.push(`${i + 1}. **Original:** "${mod.originalFragment}"`);
          lines.push(`   - **Modified:** "${mod.modifiedFragment}"`);
          lines.push(`   - **Reason:** ${mod.reason}`);
          lines.push("");
        });
      }
    });
  }

  // Conclusion
  if (analysis.conclusion) {
    lines.push("## Conclusion");
    lines.push("");
    lines.push(analysis.conclusion);
    lines.push("");
  }

  // Footer
  lines.push("---");
  lines.push("");
  lines.push("*Report generated by Gender-Lex*");

  return lines.join("\n");
}

/**
 * Generates HTML content for PDF export (using browser print)
 */
export function formatAsHTML(analysis: Analysis): string {
  const escapeHtml = (text: string): string => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Gender Bias Analysis Report - ${analysis.id}</title>
  <style>
    @page {
      margin: 2cm;
    }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #2563eb;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h2 {
      color: #1e40af;
      border-bottom: 2px solid #93c5fd;
      padding-bottom: 8px;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    h3 {
      color: #1e3a8a;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .metadata {
      background: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .metadata p {
      margin: 5px 0;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .stat-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 5px;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .term-card, .metaphor-card, .context-item {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }
    .term-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .term-content {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }
    .influence {
      font-size: 1.125rem;
      font-weight: bold;
      color: #dc2626;
    }
    .category {
      display: inline-block;
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.875rem;
      margin-top: 5px;
    }
    .explanation {
      color: #6b7280;
      margin-top: 10px;
      line-height: 1.6;
    }
    .original-text {
      background: #f9fafb;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 15px 0;
      font-style: italic;
    }
    .alternative-text {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
      padding: 15px;
      margin: 15px 0;
    }
    .modification {
      background: #fef3c7;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
    }
    .modification-label {
      font-weight: 600;
      color: #92400e;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin: 8px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }
    @media print {
      body {
        max-width: 100%;
      }
      .term-card, .metaphor-card, .context-item {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <h1>Gender Bias Analysis Report</h1>
  
  <div class="metadata">
    <p><strong>Analysis ID:</strong> ${analysis.id}</p>
    <p><strong>Date:</strong> ${new Date(analysis.createdAt).toLocaleString()}</p>
    <p><strong>Status:</strong> ${analysis.status}</p>
  </div>

  ${
    analysis.originalText
      ? `
  <h2>Original Text</h2>
  <div class="original-text">${escapeHtml(analysis.originalText)}</div>
  `
      : ""
  }

  <h2>Summary Statistics</h2>
  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Biased Terms</div>
      <div class="stat-value" style="color: #dc2626;">${analysis.biasedTerms?.length || 0}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Biased Metaphors</div>
      <div class="stat-value" style="color: #ea580c;">${analysis.biasedMetaphors?.length || 0}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Text Alternatives</div>
      <div class="stat-value" style="color: #2563eb;">${analysis.modifiedTextAlternatives?.length || 0}</div>
    </div>
  </div>

  ${
    analysis.biasedTerms && analysis.biasedTerms.length > 0
      ? `
  <h2>Identified Biased Terms</h2>
  ${analysis.biasedTerms
    .map(
      (term) => `
    <div class="term-card">
      <div class="term-header">
        <div>
          <div class="term-content">"${escapeHtml(term.content)}"</div>
          <span class="category">${term.category}</span>
        </div>
        <div class="influence">${Math.round(term.influencePercentage * 100)}%</div>
      </div>
      <div class="explanation">${escapeHtml(term.explanation)}</div>
    </div>
  `
    )
    .join("")}
  `
      : ""
  }

  ${
    analysis.biasedMetaphors && analysis.biasedMetaphors.length > 0
      ? `
  <h2>Biased Metaphors</h2>
  ${analysis.biasedMetaphors
    .map(
      (metaphor) => `
    <div class="metaphor-card">
      <div class="term-header">
        <div class="term-content">"${escapeHtml(metaphor.content)}"</div>
        <div class="influence">${Math.round(metaphor.influencePercentage * 100)}%</div>
      </div>
      <div class="explanation">${escapeHtml(metaphor.explanation)}</div>
      <div class="explanation" style="margin-top: 5px;"><strong>Historical Context:</strong> ${escapeHtml(metaphor.historicalContext)}</div>
    </div>
  `
    )
    .join("")}
  `
      : ""
  }

  ${
    analysis.additionalContextEvaluation
      ? `
  <h2>Additional Context Evaluation</h2>
  ${
    analysis.additionalContextEvaluation.stereotype
      ? `
    <div class="context-item">
      <h3>Stereotype</h3>
      <ul>
        <li><strong>Present:</strong> ${analysis.additionalContextEvaluation.stereotype.presence ? "Yes" : "No"}</li>
        <li><strong>Influence:</strong> ${Math.round(analysis.additionalContextEvaluation.stereotype.influencePercentage * 100)}%</li>
        <li><strong>Explanation:</strong> ${escapeHtml(analysis.additionalContextEvaluation.stereotype.explanation)}</li>
        ${
          analysis.additionalContextEvaluation.stereotype.examples &&
          analysis.additionalContextEvaluation.stereotype.examples.length > 0
            ? `<li><strong>Examples:</strong> ${analysis.additionalContextEvaluation.stereotype.examples.map(escapeHtml).join(", ")}</li>`
            : ""
        }
      </ul>
    </div>
  `
      : ""
  }
  ${
    analysis.additionalContextEvaluation.powerAsymmetry
      ? `
    <div class="context-item">
      <h3>Power Asymmetry</h3>
      <ul>
        <li><strong>Present:</strong> ${analysis.additionalContextEvaluation.powerAsymmetry.presence ? "Yes" : "No"}</li>
        <li><strong>Influence:</strong> ${Math.round(analysis.additionalContextEvaluation.powerAsymmetry.influencePercentage * 100)}%</li>
        <li><strong>Explanation:</strong> ${escapeHtml(analysis.additionalContextEvaluation.powerAsymmetry.explanation)}</li>
        ${
          analysis.additionalContextEvaluation.powerAsymmetry.examples &&
          analysis.additionalContextEvaluation.powerAsymmetry.examples.length > 0
            ? `<li><strong>Examples:</strong> ${analysis.additionalContextEvaluation.powerAsymmetry.examples.map(escapeHtml).join(", ")}</li>`
            : ""
        }
      </ul>
    </div>
  `
      : ""
  }
  ${
    analysis.additionalContextEvaluation.genderRepresentationAbsence
      ? `
    <div class="context-item">
      <h3>Gender Representation Absence</h3>
      <ul>
        <li><strong>Present:</strong> ${analysis.additionalContextEvaluation.genderRepresentationAbsence.presence ? "Yes" : "No"}</li>
        <li><strong>Influence:</strong> ${Math.round(analysis.additionalContextEvaluation.genderRepresentationAbsence.influencePercentage * 100)}%</li>
        <li><strong>Explanation:</strong> ${escapeHtml(analysis.additionalContextEvaluation.genderRepresentationAbsence.explanation)}</li>
        ${
          analysis.additionalContextEvaluation.genderRepresentationAbsence.affectedGroups &&
          analysis.additionalContextEvaluation.genderRepresentationAbsence.affectedGroups.length >
            0
            ? `<li><strong>Affected Groups:</strong> ${analysis.additionalContextEvaluation.genderRepresentationAbsence.affectedGroups.map(escapeHtml).join(", ")}</li>`
            : ""
        }
      </ul>
    </div>
  `
      : ""
  }
  ${
    analysis.additionalContextEvaluation.intersectionality
      ? `
    <div class="context-item">
      <h3>Intersectionality</h3>
      <ul>
        <li><strong>Present:</strong> ${analysis.additionalContextEvaluation.intersectionality.presence ? "Yes" : "No"}</li>
        <li><strong>Influence:</strong> ${Math.round(analysis.additionalContextEvaluation.intersectionality.influencePercentage * 100)}%</li>
        <li><strong>Explanation:</strong> ${escapeHtml(analysis.additionalContextEvaluation.intersectionality.explanation)}</li>
        ${
          analysis.additionalContextEvaluation.intersectionality.excludedGroups &&
          analysis.additionalContextEvaluation.intersectionality.excludedGroups.length > 0
            ? `<li><strong>Excluded Groups:</strong> ${analysis.additionalContextEvaluation.intersectionality.excludedGroups.map(escapeHtml).join(", ")}</li>`
            : ""
        }
      </ul>
    </div>
  `
      : ""
  }
  ${
    analysis.additionalContextEvaluation.systemicBiases
      ? `
    <div class="context-item">
      <h3>Systemic Biases</h3>
      <ul>
        <li><strong>Present:</strong> ${analysis.additionalContextEvaluation.systemicBiases.presence ? "Yes" : "No"}</li>
        <li><strong>Influence:</strong> ${Math.round(analysis.additionalContextEvaluation.systemicBiases.influencePercentage * 100)}%</li>
        <li><strong>Explanation:</strong> ${escapeHtml(analysis.additionalContextEvaluation.systemicBiases.explanation)}</li>
        ${
          analysis.additionalContextEvaluation.systemicBiases.examples &&
          analysis.additionalContextEvaluation.systemicBiases.examples.length > 0
            ? `<li><strong>Examples:</strong> ${analysis.additionalContextEvaluation.systemicBiases.examples.map(escapeHtml).join(", ")}</li>`
            : ""
        }
      </ul>
    </div>
  `
      : ""
  }
  `
      : ""
  }

  ${
    analysis.impactAnalysis
      ? `
  <h2>Impact Analysis</h2>
  ${
    analysis.impactAnalysis.accessToCare
      ? `
    <div class="context-item">
      <h3>Access to Care</h3>
      <ul>
        <li><strong>Affected:</strong> ${analysis.impactAnalysis.accessToCare.affected ? "Yes" : "No"}</li>
        <li><strong>Description:</strong> ${escapeHtml(analysis.impactAnalysis.accessToCare.description)}</li>
      </ul>
    </div>
  `
      : ""
  }
  ${
    analysis.impactAnalysis.stigmatization
      ? `
    <div class="context-item">
      <h3>Stigmatization</h3>
      <ul>
        <li><strong>Affected:</strong> ${analysis.impactAnalysis.stigmatization.affected ? "Yes" : "No"}</li>
        <li><strong>Description:</strong> ${escapeHtml(analysis.impactAnalysis.stigmatization.description)}</li>
      </ul>
    </div>
  `
      : ""
  }
  `
      : ""
  }

  ${
    analysis.modifiedTextAlternatives && analysis.modifiedTextAlternatives.length > 0
      ? `
  <h2>Text Alternatives</h2>
  ${analysis.modifiedTextAlternatives
    .map(
      (alternative) => `
    <div class="context-item">
      <h3>Alternative ${alternative.alternativeNumber}</h3>
      <div class="alternative-text">${escapeHtml(alternative.alternativeText)}</div>
      ${
        alternative.modificationsExplanation && alternative.modificationsExplanation.length > 0
          ? `
        <h4 style="margin-top: 15px;">Modifications:</h4>
        ${alternative.modificationsExplanation
          .map(
            (mod) => `
          <div class="modification">
            <div><span class="modification-label">Original:</span> "${escapeHtml(mod.originalFragment)}"</div>
            <div><span class="modification-label">Modified:</span> "${escapeHtml(mod.modifiedFragment)}"</div>
            <div><span class="modification-label">Reason:</span> ${escapeHtml(mod.reason)}</div>
          </div>
        `
          )
          .join("")}
      `
          : ""
      }
    </div>
  `
    )
    .join("")}
  `
      : ""
  }

  ${
    analysis.conclusion
      ? `
  <h2>Conclusion</h2>
  <div class="context-item">
    <p>${escapeHtml(analysis.conclusion)}</p>
  </div>
  `
      : ""
  }

  <div class="footer">
    <p>Report generated by Gender-Lex</p>
    <p>Analysis ID: ${analysis.id} | Generated: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Downloads a file with the given content
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports the analysis in the specified format
 */
export function exportAnalysis(analysis: Analysis, format: ExportFormat) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  const baseFilename = `analysis-${analysis.id}-${timestamp}`;

  switch (format) {
    case "txt":
      downloadFile(formatAsText(analysis), `${baseFilename}.txt`, "text/plain");
      break;

    case "markdown":
      downloadFile(formatAsMarkdown(analysis), `${baseFilename}.md`, "text/markdown");
      break;

    case "pdf":
      // For PDF, we'll open a new window with the HTML content and trigger print
      const htmlContent = formatAsHTML(analysis);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        // Wait for content to load before printing
        printWindow.onload = () => {
          printWindow.print();
        };
      }
      break;
  }
}
