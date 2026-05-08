# Check what Vercel is serving
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Continue'
try {
    $r = Invoke-WebRequest -Uri 'https://tutoring-admin-ugl6.vercel.app' -UserAgent 'Mozilla/5.0' -TimeoutSec 15
    Write-Output "Status: $($r.StatusCode)"
    Write-Output "Content length: $($r.Content.Length)"
    $content = $r.Content

    # Check for SSR content
    if ($content -match '开发中') {
        Write-Output "RESULT: HAS_DEV_TEXT"
    } else {
        Write-Output "RESULT: NO_DEV_TEXT"
    }

    # Extract JS bundle name
    if ($content -match 'src="(/_next/static/[^/"]+/([^"]+\.js))"') {
        Write-Output "JS_BUNDLE: $($Matches[2])"
        Write-Output "JS_PATH: $($Matches[1])"
    }

    # Extract page title
    if ($content -match '<title>([^<]+)</title>') {
        Write-Output "TITLE: $($Matches[1])"
    }

    # Show first 400 chars of body
    if ($content -match '<body[^>]*>(.*)', '', 'Singleline') {
        $body = $Matches[1]
        Write-Output "BODY_START: $($body.Substring(0, [Math]::Min(400, $body.Length)))"
    }
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
}
