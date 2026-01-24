# Export Analysis Functionality

## Overview
This implementation adds export functionality to the analysis details page, allowing users to export their analysis reports in three formats: PDF, Markdown, and Plain Text.

## Implementation Details

### Files Created

1. **`/apps/web/src/lib/export/export-utils.ts`**
   - Contains export utility functions for formatting and downloading analysis data
   - Supports three export formats:
     - **PDF**: Opens a print dialog with beautifully formatted HTML
     - **Markdown**: Downloads a .md file with structured markdown formatting
     - **Plain Text**: Downloads a .txt file with simple text formatting

2. **`/apps/web/src/sections/analysis/components/dialogs/export-dialog.tsx`**
   - Dialog component for selecting export format
   - Shows format options with descriptions and icons
   - Handles export process and provides user feedback

### Files Modified

1. **`/apps/web/src/sections/analysis/details/analysis-header.tsx`**
   - Added state management for export dialog
   - Connected Export button to open export dialog
   - Integrated ExportDialog component

## Features

### Export Formats

#### 1. PDF Export
- Opens browser print dialog with styled HTML content
- Professional formatting with:
  - Color-coded sections and headers
  - Statistical cards with visual hierarchy
  - Structured content blocks
  - Print-optimized CSS

#### 2. Markdown Export
- Creates a `.md` file with:
  - Hierarchical headings (H1-H3)
  - Bulleted lists for structured data
  - Bold emphasis for labels
  - Proper markdown formatting

#### 3. Plain Text Export
- Creates a `.txt` file with:
  - ASCII dividers (=== and ---)
  - Indented hierarchical content
  - Clear section separation
  - Easy to read in any text editor

### Content Included in Exports

All formats include complete analysis data:
- Analysis metadata (ID, date, status)
- Original text
- Summary statistics
- Biased terms with explanations
- Biased metaphors with historical context
- Additional context evaluation (stereotypes, power asymmetry, etc.)
- Impact analysis
- Text alternatives with modification details
- Conclusion

## User Experience

1. User clicks "Export" button in analysis header
2. Export dialog opens with three format options
3. User selects desired format
4. Export is triggered:
   - **PDF**: Print dialog opens
   - **Markdown/Text**: File downloads automatically
5. Success notification appears
6. Dialog closes

## Technical Notes

- Uses browser-native APIs (no external dependencies required)
- Exports are generated client-side for performance
- HTML escaping is used to prevent XSS in PDF export
- File names include analysis ID and timestamp for easy identification
- All text content is properly formatted and escaped

## Browser Compatibility

- PDF export uses `window.print()` - supported in all modern browsers
- File downloads use Blob API and `<a>` download attribute
- Requires ES2015+ JavaScript features (String.repeat, template literals)

## Future Enhancements (Optional)

- Add custom styling options for exports
- Include charts and visualizations in PDF
- Support batch export of multiple analyses
- Add export to JSON format for data interchange
- Email export functionality
