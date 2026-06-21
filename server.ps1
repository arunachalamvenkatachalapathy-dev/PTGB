Add-Type -AssemblyName System.Net.HttpListener

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://127.0.0.1:8080/')
$listener.Start()
Write-Host 'Server running at http://127.0.0.1:8080'

$basePath = 'd:\New folder (2)\beggy\beggy'

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $url = $context.Request.Url.LocalPath
    
    if ($url -eq '/') { $url = '/index.html' }
    
    $filePath = Join-Path $basePath ($url.TrimStart('/'))
    
    if (Test-Path $filePath) {
        $ext = [System.IO.Path]::GetExtension($filePath)
        
        $contentType = 'text/plain'
        if ($ext -eq '.html') { $contentType = 'text/html; charset=utf-8' }
        elseif ($ext -eq '.css') { $contentType = 'text/css; charset=utf-8' }
        elseif ($ext -eq '.js') { $contentType = 'application/javascript; charset=utf-8' }
        
        $context.Response.ContentType = $contentType
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $context.Response.StatusCode = 404
        $bytes = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    
    $context.Response.Close()
}
