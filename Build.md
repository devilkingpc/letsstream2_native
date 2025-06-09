# Linux Build Instructions for Let's Stream

## Prerequisites Installation

### 1. Update System

```bash
sudo apt update && sudo apt upgrade
```

### 2. Install Node.js and npm (using nvm)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### 3. Install JDK 17
```bash
sudo apt install openjdk-17-jdk
```
Verify installation:
```bash
java -version
```

### 4. Install Android Studio
```bash
# Download Android Studio
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2022.3.1.20/android-studio-2022.3.1.20-linux.tar.gz

# Extract it
sudo tar -xvf android-studio-*.tar.gz -C /opt/

# Make it executable
cd /opt/android-studio/bin
sudo chmod +x studio.sh
```

### 5. Install SDK Components
Launch Android Studio and install:
- Tools → SDK Manager
- In "SDK Platforms" tab:
  - Android 13 (API Level 33)
- In "SDK Tools" tab:
  - Android SDK Build-Tools 33.0.0
  - Android SDK Command-line Tools
  - Android SDK Platform-Tools
  - Android Emulator
  - NDK 23.1.7779620
  - CMake

### 6. Set Environment Variables
Add to ~/.bashrc:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

### 7. Install System Dependencies
```bash
sudo apt install libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386
```

## Building the App

### 1. Clone and Setup Project
```bash
# Clone repository
git clone <your-repo>
cd lets_stream

# Install dependencies
npm install

# Install React Native CLI globally
npm install -g react-native-cli
```

### 2. Configure Android SDK Path
```bash
echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties
```

### 3. Prepare Assets Directory
```bash
mkdir -p android/app/src/main/assets
```

### 4. Bundle JavaScript
```bash
npx react-native bundle --platform android --dev false --entry-file index.ts --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
```

### 5. Build Configuration
```bash
# Make gradlew executable
cd android
chmod +x gradlew

# Optional: Add to gradle.properties for better performance
echo "org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=4096m -XX:+HeapDumpOnOutOfMemoryError" >> gradle.properties
echo "org.gradle.daemon=true" >> gradle.properties
echo "org.gradle.parallel=true" >> gradle.properties
echo "org.gradle.configureondemand=true" >> gradle.properties
```

### 6. Clean and Build
```bash
# Clean project
./gradlew clean

# Build release APK
./gradlew assembleRelease
```

The built APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

### Memory Issues
If you encounter memory errors during build:
- Increase Java heap size in android/gradle.properties
- Clear Gradle cache: `rm -rf ~/.gradle/caches/`

### NDK Not Found
If NDK is not found:
- Verify NDK installation in Android Studio → SDK Manager
- Check NDK path matches in local.properties

### Permission Issues
```bash
sudo chown -R $USER:$USER .
chmod +x android/gradlew
```

### SDK Location Errors
- Verify ANDROID_HOME is set correctly
- Check local.properties has correct sdk.dir path

### Detailed Build Logs
To see detailed build logs:
```bash
./gradlew assembleRelease --info
```

### Build Progress Check
To verify the APK was built:
```bash
ls -l app/build/outputs/apk/release/
```

**Note**: The build process might take several minutes depending on your system's specifications. Ensure you have at least 4-5GB of free disk space for the build process.
