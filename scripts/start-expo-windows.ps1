param(
  [switch]$InstallOnly
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$nodeVersion = "v22.16.0"
$nodeName = "node-$nodeVersion-win-x64"
$toolsDir = Join-Path $repoRoot ".tools"
$nodeDir = Join-Path $toolsDir $nodeName
$zipPath = Join-Path $toolsDir "$nodeName.zip"
$nodeUrl = "https://nodejs.org/dist/$nodeVersion/$nodeName.zip"

if (!(Test-Path $toolsDir)) {
  New-Item -ItemType Directory -Path $toolsDir | Out-Null
}

if (!(Test-Path (Join-Path $nodeDir "npm.cmd"))) {
  Write-Host "Downloading portable Node.js $nodeVersion..."
  Invoke-WebRequest -Uri $nodeUrl -OutFile $zipPath
  Expand-Archive -LiteralPath $zipPath -DestinationPath $toolsDir -Force
}

$env:Path = "$nodeDir;$env:Path"

Write-Host "Using Node: $(& "$nodeDir\node.exe" --version)"
Write-Host "Using npm:  $(& "$nodeDir\npm.cmd" --version)"

Push-Location $repoRoot
try {
  if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    & "$nodeDir\npm.cmd" install
  }

  if ($InstallOnly) {
    Write-Host "Dependencies are installed."
    exit 0
  }

  Write-Host "Starting Expo..."
  & "$nodeDir\npx.cmd" expo start
}
finally {
  Pop-Location
}
