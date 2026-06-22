$logFile = 'C:\Users\user\.gemini\antigravity-ide\brain\ef27bd47-1bb9-4d23-96b3-8a874c8d6146\.system_generated\logs\transcript.jsonl'
$text = [System.IO.File]::ReadAllText($logFile)
$matches = [regex]::Matches($text, '(?is)board members.*?governance.*?(\w+\s*)+')

$lines = $text -split '\n'
foreach ($line in $lines) {
    if ($line -match '"type":"USER_INPUT"') {
        if ($line -match '<!-- Page 1 -->') {
            $json = $line | ConvertFrom-Json
            $content = $json.content
            $contentLines = $content -split '\n'
            for ($i=0; $i -lt $contentLines.Length; $i++) {
                $l = $contentLines[$i].ToLower()
                if ($l -match 'board' -or $l -match 'tripartite' -or $l -match 'member') {
                    $start = [Math]::Max(0, $i - 3)
                    $end = [Math]::Min($contentLines.Length, $i + 5)
                    Write-Output "--- Match around line $i ---"
                    $contentLines[$start..$end] | ForEach-Object { Write-Output $_ }
                }
            }
        }
    }
}
