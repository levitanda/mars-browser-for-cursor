$HostName = "com.mars.browser_bridge"
$InstallDir = Join-Path $env:LOCALAPPDATA "MarsBrowserBridge"
New-Item -Path $InstallDir -ItemType Directory -Force | Out-Null
$BinPath = Join-Path (Resolve-Path "$PSScriptRoot\\..").Path "dist\\native-host.js"
$ManifestPath = Join-Path $InstallDir "$HostName.json"
@"
{
  "name": "$HostName",
  "description": "Mars Browser Bridge native host",
  "path": "$BinPath",
  "type": "stdio",
  "allowed_origins": ["chrome-extension://__EXTENSION_ID__/"]
}
"@ | Set-Content -Path $ManifestPath -Encoding UTF8
$RegPath = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\$HostName"
New-Item -Path $RegPath -Force | Out-Null
Set-ItemProperty -Path $RegPath -Name "(default)" -Value $ManifestPath
Write-Host "Installed manifest at $ManifestPath"
