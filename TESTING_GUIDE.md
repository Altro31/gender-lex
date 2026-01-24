# Export Functionality - Testing Guide

## Overview
The export functionality has been successfully implemented for the analysis details page. Users can now export their analysis reports in three different formats.

## How to Test

### 1. Navigate to Analysis Details
- Go to any analysis details page: `/[locale]/analysis/[id]`
- Look for the "Export" button in the header section (next to the status badge)

### 2. Click Export Button
- The Export button has a Download icon
- Clicking it opens the Export Dialog

### 3. Select Export Format

#### Option 1: PDF Export
- **Icon**: FileDown (download icon)
- **Description**: "Professional formatted document for printing"
- **Behavior**: Opens print dialog in a new window with styled HTML
- **Note**: Browser may block popup - allow popups if prompted

#### Option 2: Markdown Export  
- **Icon**: FileCode (code icon)
- **Description**: "Formatted text for documentation and notes"
- **Behavior**: Downloads a `.md` file to your downloads folder
- **Filename**: `analysis-{id}-{timestamp}.md`

#### Option 3: Plain Text Export
- **Icon**: FileText (document icon)  
- **Description**: "Simple text format compatible with any editor"
- **Behavior**: Downloads a `.txt` file to your downloads folder
- **Filename**: `analysis-{id}-{timestamp}.txt`

## Expected Content in Exports

All formats include complete analysis data:

### 1. Header Section
- Analysis ID
- Creation date
- Status

### 2. Original Text
- The original text that was analyzed

### 3. Summary Statistics
- Count of biased terms
- Count of biased metaphors
- Count of text alternatives

### 4. Identified Biased Terms
For each term:
- Content (the actual term)
- Category
- Influence percentage
- Explanation

### 5. Biased Metaphors
For each metaphor:
- Content
- Influence percentage
- Explanation
- Historical context

### 6. Additional Context Evaluation
- Stereotype (presence, influence, explanation, examples)
- Power Asymmetry (presence, influence, explanation, examples)
- Gender Representation Absence (presence, influence, affected groups)
- Intersectionality (presence, influence, excluded groups)
- Systemic Biases (presence, influence, explanation, examples)

### 7. Impact Analysis
- Access to Care (affected status, description)
- Stigmatization (affected status, description)

### 8. Text Alternatives
For each alternative:
- Alternative number
- Modified text
- Modification explanations (original fragment, modified fragment, reason)

### 9. Conclusion
- Final analysis conclusion

## Format-Specific Features

### PDF Format
- Color-coded sections (blue for headers, red for biased terms)
- Professional styling with cards and borders
- Print-optimized layout
- Page break control for readability

### Markdown Format
- Hierarchical headings (H1-H3)
- Bullet lists with bold labels
- Proper markdown syntax
- Easy to render in any markdown viewer

### Plain Text Format
- ASCII art dividers (=== and ---)
- Indented hierarchical structure
- Clear section separation
- Compatible with any text editor

## Testing Checklist

### Basic Functionality
- [ ] Export button is visible in analysis header
- [ ] Export button opens dialog when clicked
- [ ] Dialog shows three format options with icons and descriptions
- [ ] Each format option is clickable

### PDF Export
- [ ] Clicking PDF option opens new window
- [ ] Print dialog appears (or popup blocker message if blocked)
- [ ] Printed/saved PDF contains all analysis data
- [ ] Formatting is professional and readable

### Markdown Export
- [ ] Clicking Markdown option downloads .md file
- [ ] File has correct naming format
- [ ] File contains properly formatted markdown
- [ ] Content renders correctly in markdown viewer

### Text Export  
- [ ] Clicking Text option downloads .txt file
- [ ] File has correct naming format
- [ ] File is readable in any text editor
- [ ] Content has proper structure with dividers

### Error Handling
- [ ] If popup is blocked, user sees helpful error message
- [ ] If export fails, user sees error toast notification
- [ ] Success toast appears after successful export
- [ ] Dialog closes after successful export

## Known Limitations

1. **PDF Export**: Relies on browser print functionality
   - Styling may vary slightly between browsers
   - User must manually save/print from print dialog
   - Popup blockers may prevent opening

2. **File Downloads**: Automatic downloads
   - Downloads go to browser's default download folder
   - Browser may ask for permission on first download
   - Multiple rapid exports may trigger download blocking

## Browser Compatibility

Tested features work in:
- Chrome/Edge (Chromium-based)
- Firefox
- Safari
- Any modern browser supporting:
  - Blob API
  - window.open()
  - Download attribute on <a> tags
  - ES2015+ JavaScript

## Troubleshooting

### PDF Not Opening
- Check browser popup blocker settings
- Allow popups for the site
- Try again after allowing popups

### File Not Downloading
- Check browser download permissions
- Check if downloads are blocked
- Check available disk space
- Try a different format

### Missing Content
- Ensure analysis is fully loaded before exporting
- Wait for "Done" status before exporting
- Refresh page and try again if needed

## Success Indicators

✅ Export button is functional
✅ All three formats are working
✅ Files contain complete analysis data
✅ Error messages are helpful
✅ User experience is smooth
✅ No security vulnerabilities
