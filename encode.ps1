$indexPath = "d:\New folder (2)\beggy\beggy\index.html"
$html = [IO.File]::ReadAllText($indexPath)

$logoPath = "C:\Users\user\.gemini\antigravity-ide\brain\ef27bd47-1bb9-4d23-96b3-8a874c8d6146\3d_rendered_logo_1782027312245.png"
$eaglePath = "C:\Users\user\.gemini\antigravity-ide\brain\ef27bd47-1bb9-4d23-96b3-8a874c8d6146\eagle_view_simulation_1782027326349.png"

$logoBytes = [IO.File]::ReadAllBytes($logoPath)
$logoB64 = [Convert]::ToBase64String($logoBytes)
$html = $html -replace "file:///C:/Users/user/\.gemini/antigravity-ide/brain/ef27bd47-1bb9-4d23-96b3-8a874c8d6146/3d_rendered_logo_1782027312245\.png", "data:image/png;base64,$logoB64"

$eagleBytes = [IO.File]::ReadAllBytes($eaglePath)
$eagleB64 = [Convert]::ToBase64String($eagleBytes)
$html = $html -replace "file:///C:/Users/user/\.gemini/antigravity-ide/brain/ef27bd47-1bb9-4d23-96b3-8a874c8d6146/eagle_view_simulation_1782027326349\.png", "data:image/png;base64,$eagleB64"

[IO.File]::WriteAllText($indexPath, $html)
Write-Host "Successfully encoded HTML"

$stylePath = "d:\New folder (2)\beggy\beggy\style.css"
$css = [IO.File]::ReadAllText($stylePath)

$pollutedPath = "C:\Users\user\.gemini\antigravity-ide\brain\ef27bd47-1bb9-4d23-96b3-8a874c8d6146\coal_mine_polluted_1782019856270.png"
$cleanPath = "C:\Users\user\.gemini\antigravity-ide\brain\ef27bd47-1bb9-4d23-96b3-8a874c8d6146\coal_mine_clean_1782019870428.png"

$pollutedBytes = [IO.File]::ReadAllBytes($pollutedPath)
$pollutedB64 = [Convert]::ToBase64String($pollutedBytes)
$css = $css -replace "file:///C:/Users/user/\.gemini/antigravity-ide/brain/ef27bd47-1bb9-4d23-96b3-8a874c8d6146/coal_mine_polluted_1782019856270\.png", "data:image/png;base64,$pollutedB64"

$cleanBytes = [IO.File]::ReadAllBytes($cleanPath)
$cleanB64 = [Convert]::ToBase64String($cleanBytes)
$css = $css -replace "file:///C:/Users/user/\.gemini/antigravity-ide/brain/ef27bd47-1bb9-4d23-96b3-8a874c8d6146/coal_mine_clean_1782019870428\.png", "data:image/png;base64,$cleanB64"

[IO.File]::WriteAllText($stylePath, $css)
Write-Host "Successfully encoded CSS"
