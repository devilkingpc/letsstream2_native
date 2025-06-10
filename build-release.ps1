$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

Write-Host "Using Java from: $env:JAVA_HOME"
Write-Host "Verifying Java version:"
java -version

Write-Host "`nCreating assets directory..."
New-Item -ItemType Directory -Force -Path ".\android\app\src\main\assets"

Write-Host "`nBundling JavaScript..."
npx react-native bundle --platform android --dev false --entry-file index.ts --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

Write-Host "`nCleaning and building release APK..."
Set-Location -Path android
$env:GRADLE_OPTS="-Dorg.gradle.java.home=`"$env:JAVA_HOME`""

Write-Host "`nCleaning previous build..."
./gradlew clean

Write-Host "`nBuilding release APK..."
./gradlew assembleRelease --warning-mode all

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nBuild successful! APK location:"
    Write-Host ".\android\app\build\outputs\apk\release\app-release.apk"
} else {
    Write-Host "`nBuild failed with exit code: $LASTEXITCODE"
}

Set-Location -Path ..
