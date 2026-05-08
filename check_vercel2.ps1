# Check what Vercel is serving - simplified
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Continue'
try {
    $r = Invoke-WebRequest -Uri 'https://tutoring-admin-ugl6.vercel.app' -UserAgent 'Mozilla/5.0' -TimeoutSec 15
    $content = $r.GetResponseBody()
    Write-Output "Status: $($r.StatusCode)"
    Write-Output "Len: $($content.Length)"
    if ($content -match '开发中') { Write-Output "RESULT: HAS_DEV_TEXT" }
    else { Write-Output "RESULT: NO_DEV_TEXT" }
    if ($content -match 'src="(/_next/static/([^"]+\.js))"') {
        Write-Output "JS_BUNDLE: $($Matches[2])"
    }
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
}
