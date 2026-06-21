const fs = require('fs');

const logFile = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\ef27bd47-1bb9-4d23-96b3-8a874c8d6146\\.system_generated\\logs\\transcript.jsonl';

try {
    const data = fs.readFileSync(logFile, 'utf8');
    const lines = data.split('\n');
    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const obj = JSON.parse(line);
            if (obj.type === 'USER_INPUT' && obj.content && obj.content.includes('<!-- Page 1 -->')) {
                console.log("Found paper.");
                const contentLines = obj.content.split('\n');
                for (let i = 0; i < contentLines.length; i++) {
                    const l = contentLines[i].toLowerCase();
                    if (l.includes('board') || l.includes('member') || l.includes('tripartite') || l.includes('governance')) {
                        console.log(`\n--- Match around line ${i} ---`);
                        const start = Math.max(0, i - 2);
                        const end = Math.min(contentLines.length, i + 5);
                        console.log(contentLines.slice(start, end).join('\n'));
                    }
                }
                break;
            }
        } catch (e) {
            // ignore JSON parse errors for single lines
        }
    }
} catch (e) {
    console.error(e);
}
