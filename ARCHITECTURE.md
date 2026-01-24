# Export Functionality - Implementation Architecture

## Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Analysis Details Page                        │
│                    /[locale]/analysis/[id]                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AnalysisHeader Component                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [Status Badge]  [Export Button ▼]  [Private] [Copy]    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ onClick
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ExportDialog Component                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Choose Export Format                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  [📥] PDF                                          │  │  │
│  │  │  Professional formatted document for printing      │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  [</>] Markdown                                    │  │  │
│  │  │  Formatted text for documentation and notes        │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  [📄] Plain Text                                   │  │  │
│  │  │  Simple text format compatible with any editor     │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                    │           │            │
                    │ PDF       │ Markdown   │ Text
                    ▼           ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Export Utils (export-utils.ts)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │formatAsHTML()│  │formatAsMark  │  │formatAsText()│          │
│  │              │  │down()        │  │              │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                   │
│         ▼                 ▼                  ▼                   │
│  ┌──────────────────────────────────────────────────┐          │
│  │         exportAnalysis(analysis, format)         │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                    │           │            │
                    │           │            │
                    ▼           ▼            ▼
┌──────────────┐ ┌─────────────────────────────┐
│ Print Dialog │ │    Browser Download         │
│ (New Window) │ │  (Blob + <a> download)      │
│              │ │                             │
│  User saves  │ │  Saves to downloads folder  │
│  as PDF      │ │  .md or .txt file           │
└──────────────┘ └─────────────────────────────┘
```

## Data Flow

```
Analysis Object (from useAnalysisStream)
    │
    ├── id, createdAt, status (metadata)
    ├── originalText (string)
    ├── biasedTerms[] (array of BiasedTerm)
    │   ├── content, category, influencePercentage, explanation
    ├── biasedMetaphors[] (array of BiasedMetaphor)
    │   ├── content, influencePercentage, explanation, historicalContext
    ├── additionalContextEvaluation (object)
    │   ├── stereotype, powerAsymmetry, genderRepresentationAbsence
    │   ├── intersectionality, systemicBiases
    ├── impactAnalysis (object)
    │   ├── accessToCare, stigmatization
    ├── modifiedTextAlternatives[] (array of ModifiedAlternative)
    │   ├── alternativeNumber, alternativeText
    │   ├── modificationsExplanation[]
    └── conclusion (string)
    
    │
    ├─── formatAsHTML() ────────────────► Styled HTML String
    │                                      │
    │                                      └──► window.open() + print()
    │
    ├─── formatAsMarkdown() ────────────► Markdown String
    │                                      │
    │                                      └──► downloadFile(.md)
    │
    └─── formatAsText() ────────────────► Plain Text String
                                           │
                                           └──► downloadFile(.txt)
```

## File Structure

```
apps/web/src/
├── sections/analysis/
│   ├── details/
│   │   └── analysis-header.tsx          [MODIFIED]
│   │       - Added state: exportDialogOpen
│   │       - Added onClick to Export button
│   │       - Renders ExportDialog
│   │
│   └── components/
│       └── dialogs/
│           └── export-dialog.tsx        [NEW]
│               - Format selection UI
│               - Calls exportAnalysis()
│               - Error handling & toasts
│
└── lib/
    └── export/
        └── export-utils.ts              [NEW]
            - formatAsText()
            - formatAsMarkdown()
            - formatAsHTML()
            - exportAnalysis()
            - downloadFile()
            - createFileTimestamp()
```

## Export Format Examples

### 1. PDF Format (HTML → Print Dialog)
```html
<h1>Gender Bias Analysis Report</h1>
<div class="metadata">
  <p><strong>Analysis ID:</strong> abc123</p>
  <p><strong>Date:</strong> 2024-01-24</p>
</div>
<h2>Summary Statistics</h2>
<div class="stats">
  <div class="stat-card">
    <div class="stat-label">Biased Terms</div>
    <div class="stat-value">5</div>
  </div>
  ...
</div>
```
*Styled with CSS for professional appearance*

### 2. Markdown Format (.md file)
```markdown
# Gender Bias Analysis Report

**Analysis ID:** abc123
**Date:** 2024-01-24

---

## Summary Statistics

- **Biased Terms:** 5
- **Biased Metaphors:** 2

## Identified Biased Terms

### 1. "term example"

- **Category:** paternalistic
- **Influence:** 75%
- **Explanation:** ...
```

### 3. Plain Text Format (.txt file)
```
================================================================================
GENDER BIAS ANALYSIS REPORT
================================================================================

Analysis ID: abc123
Date: 2024-01-24

--------------------------------------------------------------------------------
SUMMARY STATISTICS
--------------------------------------------------------------------------------
Biased Terms: 5
Biased Metaphors: 2

--------------------------------------------------------------------------------
IDENTIFIED BIASED TERMS
--------------------------------------------------------------------------------
1. "term example"
   Category: paternalistic
   Influence: 75%
   Explanation: ...
```

## Error Handling Flow

```
User clicks format button
    │
    ├──► Try exportAnalysis()
    │        │
    │        ├──► Success
    │        │     ├──► Show success toast
    │        │     └──► Close dialog
    │        │
    │        └──► Error
    │              ├──► Popup blocked (PDF)
    │              │     └──► Show "Allow popups" message
    │              │
    │              ├──► Download failed
    │              │     └──► Show "Download failed" message
    │              │
    │              └──► Generic error
    │                    └──► Show error.message
    │
    └──► Finally
          └──► Log error to console
```

## Security Features

1. **HTML Escaping**: All user content is escaped before HTML generation
   ```typescript
   const escapeHtml = (text: string): string => {
     const div = document.createElement("div");
     div.textContent = text;
     return div.innerHTML;
   };
   ```

2. **Error Boundaries**: Try-catch blocks prevent crashes
3. **Safe Downloads**: Uses Blob API with proper MIME types
4. **No External Dependencies**: Browser-native APIs only

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| PDF Export (window.open + print) | ✅ | ✅ | ✅ | ✅ |
| Markdown Download (Blob + <a>) | ✅ | ✅ | ✅ | ✅ |
| Text Download (Blob + <a>) | ✅ | ✅ | ✅ | ✅ |
| Error Handling | ✅ | ✅ | ✅ | ✅ |

## Performance Considerations

- **Client-side generation**: No server round-trip needed
- **Lazy execution**: Only generates format user selects
- **Memory efficient**: Blobs are cleaned up with revokeObjectURL()
- **No large dependencies**: ~900 lines of pure TypeScript

## Future Enhancement Ideas

1. **Custom styling options** - Let users choose color themes
2. **Batch export** - Export multiple analyses at once
3. **Email export** - Send directly via email
4. **JSON format** - For data interchange
5. **Charts/visualizations** - Include graphs in PDF
6. **Cloud storage** - Save to Google Drive, Dropbox
7. **Scheduled exports** - Automatic periodic exports
