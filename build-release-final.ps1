# ---
# Script to build a release APK for the Let's Stream Expo app on WINDOWS.
#
# This version uses the user-provided Android SDK path. It assumes it is
# run from the root of the project directory and that Node.js v18 and
# JDK 17 are already installed and configured.
# ---

# --- Configuration ---
$RequiredJavaVersion = "17"
# Use the specific Android SDK path you provided.
$AndroidSdkPath = "C:\Users\Human\AppData\Local\Android\Sdk"

# --- Main Build Process ---
Write-Host "🚀 Starting Android APK release build for Windows..." -ForegroundColor Green

# 1. Prerequisites Check
Write-Host "🔎 Checking prerequisites..."

# Check for Java
if ($env:JAVA_HOME -and (Test-Path $env:JAVA_HOME)) {
    Write-Host "✓ JAVA_HOME is set to: $env:JAVA_HOME" -ForegroundColor Green
} else {
    Write-Host "❌ Error: JAVA_HOME is not set. Please install JDK $RequiredJavaVersion and set the JAVA_HOME environment variable." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Skipping Node.js check as requested." -ForegroundColor Green
Write-Host "✓ Skipping repository clone as requested." -ForegroundColor Green


# 2. Install Dependencies
Write-Host "📥 Installing npm dependencies..."
# Using 'npm ci' for a clean, reproducible install from package-lock.json
Write-Host "📲 Installing Expo dependencies..."
npm install -g eas-cli

# 3. Configure Android SDK Environment
Write-Host "🤖 Configuring Android SDK environment..."
if (-not (Test-Path $AndroidSdkPath)) {
    Write-Host "❌ Error: Android SDK not found at the specified path: $AndroidSdkPath" -ForegroundColor Red
    Write-Host "Please ensure the path is correct and the SDK is installed." -ForegroundColor Yellow
    exit 1
}

# Set the ANDROID_HOME environment variable for this session
$env:ANDROID_HOME = $AndroidSdkPath
# Add SDK tools to the PATH for this session
$env:PATH = "$env:PATH;$AndroidSdkPath\cmdline-tools\latest\bin;$AndroidSdkPath\platform-tools"
Write-Host "✓ Set ANDROID_HOME to: $env:ANDROID_HOME" -ForegroundColor Green

# Accept SDK licenses (Windows-compatible way)
Write-Host "✅ Accepting SDK licenses..."
1..10 | ForEach-Object { "y" } | & sdkmanager --licenses --sdk_root="$AndroidSdkPath"

# 4. Build Android Release APK
Write-Host "🛠️  Building Android Release APK..."
Set-Location "./android"

# Use the gradlew.bat script for building
if (Test-Path -Path "./gradlew.bat") {
    ./gradlew.bat assembleRelease
} else {
    Write-Host "❌ Error: gradlew.bat not found in the 'android' directory." -ForegroundColor Red
    exit 1
}

Set-Location ".."
Write-Host "✅ Gradle build finished."

# 5. Locate and Store the APK
Write-Host "🔍 Finding the generated APK file..."
$apkPath = Get-ChildItem -Path "android/app/build/outputs/apk/release" -Filter "*.apk" | Select-Object -First 1

if (-not $apkPath) {
    Write-Host "❌ Error: APK file not found after build!" -ForegroundColor Red
    exit 1
}

# Create a final output directory and copy the APK
$outputDir = "$PWD/build-output"
New-Item -ItemType Directory -Force -Path $outputDir
Copy-Item -Path $apkPath.FullName -Destination $outputDir

Write-Host "🎉 Successfully built the APK!" -ForegroundColor Green
Write-Host "➡️ APK located at: $($apkPath.FullName)"
Write-Host "➡️ Copied to: $outputDir"

exit 0