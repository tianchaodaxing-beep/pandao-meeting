# Meeting action organizer

[简体中文](README.md) · English

Extract action items from notes, edit owners and due dates, then export.

Runs locally in your browser. No account or paid API is required. Demo data is fictional.

[Open online](https://tianchaodaxing-beep.github.io/pandao-meeting/?lang=en) · [Download](https://github.com/tianchaodaxing-beep/pandao-meeting/releases/latest) · [All projects](https://github.com/tianchaodaxing-beep/pandao-open-tools)

## Getting started

Download and extract the ZIP, then open `index.html`. On Windows you can double-click `Start-tool.cmd`. Keep the entire extracted folder together. Click **English** in the header; click **中文** to return to Chinese. Language selection preserves current inputs. Use `?lang=en` for a direct English page.

1. Choose a meeting date and paste notes, or import a TXT or Markdown file.
2. Extract action items and review each description, owner and due date.
3. Fill missing information, add or remove tasks, then export a spreadsheet or text list.

## Files and data

Spreadsheet import supports `.xlsx`, `.xls`, `.csv` and `.tsv`. Only the first worksheet is read. A spreadsheet is limited to 20,000 rows and 10 MB. Text-file support varies by tool.

Spreadsheet templates and export headers follow the selected language. Chinese and English template headers can both be imported. User-entered content and numeric results are retained as entered. Data is processed on your device and is not uploaded by the tool. External feedback links open GitHub. Export any data you need before closing: inputs are not saved automatically.

## Supported scope

Extraction uses local text rules, without a language model. Chinese notes and explicitly marked TODO items are supported; it does not understand arbitrary English prose. Relative dates use the selected meeting date. Missing information stays blank. Review all extracted tasks.

## Development and licensing

Run `npm test` with Node.js 20 or later. Using the page requires no Node.js installation or runtime dependency.

MIT licensed. Commercial use, modification and redistribution are allowed while retaining the license notice. SheetJS Community Edition 0.20.3 uses Apache-2.0; see `THIRD_PARTY_NOTICES.md` and `vendor/SheetJS-LICENSE`.

## Feedback

Use the [issue tracker](https://github.com/tianchaodaxing-beep/pandao-meeting/issues) to describe your use case and expected result. Use fictional examples in public reports; do not post customer data or credentials.
