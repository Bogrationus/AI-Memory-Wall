#!/usr/bin/env python3
import os
import markdown
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

# Configure fonts for proper CJK support
font_config = FontConfiguration()
css = CSS(string='''
    @font-face {
        font-family: 'Noto Sans CJK';
        src: url('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc');
    }
    @font-face {
        font-family: 'WenQuanYi Zen Hei';
        src: url('/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc');
    }
    body {
        font-family: 'Noto Sans CJK', 'WenQuanYi Zen Hei', sans-serif;
        font-size: 12px;
        line-height: 1.5;
        margin: 2cm;
    }
    h1 {
        font-size: 24px;
        margin-top: 1cm;
        margin-bottom: 0.5cm;
        color: #0090a3;
        page-break-before: always;
    }
    h1:first-of-type {
        page-break-before: avoid;
    }
    h2 {
        font-size: 18px;
        margin-top: 0.8cm;
        margin-bottom: 0.3cm;
        color: #0090a3;
    }
    h3 {
        font-size: 14px;
        margin-top: 0.6cm;
        margin-bottom: 0.2cm;
    }
    p {
        margin-bottom: 0.3cm;
    }
    code {
        font-family: monospace;
        background-color: #f0f0f0;
        padding: 2px 4px;
        border-radius: 3px;
    }
    pre {
        background-color: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
        white-space: pre-wrap;
    }
    img {
        max-width: 100%;
        height: auto;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0.5cm;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
    @page {
        @top-center {
            content: "AI Memory Wall - Отчет о проекте";
            font-family: 'Noto Sans CJK', sans-serif;
            font-size: 10px;
        }
        @bottom-center {
            content: counter(page);
            font-family: 'Noto Sans CJK', sans-serif;
            font-size: 10px;
        }
    }
''', font_config=font_config)

# Read the markdown file
with open('docs/report.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

# Convert markdown to HTML
html_content = markdown.markdown(md_content, extensions=['tables', 'fenced_code'])

# Add HTML wrapper
html_document = f'''
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AI Memory Wall - Отчет о проекте</title>
</head>
<body>
    {html_content}
</body>
</html>
'''

# Create PDF
HTML(string=html_document).write_pdf('docs/AI_Memory_Wall_Report.pdf', stylesheets=[css], font_config=font_config)

print("PDF report generated successfully: docs/AI_Memory_Wall_Report.pdf")
