#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Color Definitions ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# --- Helper Functions ---
step() {
  echo -e "\n${GREEN}>>> $1${NC}"
}
info() {
  echo -e "${YELLOW}INFO: $1${NC}"
}
error() {
  echo -e "${RED}ERROR: $1${NC}" >&2
  exit 1
}
check_and_install() {
  if ! command -v "$1" &> /dev/null; then
    info "'$1' command could not be found. Attempting to install '$2' with sudo..."
    sudo apt-get update && sudo apt-get install -y "$2"
  else
    echo -e "✓ '$1' is already installed."
  fi
}

# --- Main Script ---

step "Starting the Android Release APK build process..."

# 1. Check and Install Prerequisites
# ------------------------------------
step "Checking system prerequisites..."
check_and_install "curl" "curl"
check_and_install "wget" "wget"
check_and_install "gpg" "gpg"
check_and_install "unzip" "unzip"

# Check for Node.js v18
if command -v node &> /dev/null && [[ "$(node -v)" == v18* ]]; then
  echo "✓ Node.js v18 is already installed."
else
  info "Node.js v18 is not installed. Installing via NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# Check for Java v17 (Temurin)
if ! command -v java &> /dev/null || [[ ! "$(java -version 2>&1)" == *'version "17'* ]]; then
    info "A compatible Java 17 was not found. Installing Temurin JDK 17..."
    sudo apt-get update && sudo apt-get install -y apt-transport-https
    sudo mkdir -p /etc/apt/keyrings
    wget -qO- https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor | sudo tee /etc/apt/keyrings/adoptium.gpg > /dev/null
    echo "deb [signed-by=/etc/apt/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/adoptium.list
    sudo apt-get update && sudo apt-get install -y temurin-17-jdk
fi
info "Prerequisite check complete."

# 2. Set Up Build Environment
# ------------------------------------
step "Configuring Build Environment..."

# Set NODE_ENV for production bundling
export NODE_ENV=production
info "NODE_ENV set to 'production'."

# Set and verify Java 17 environment
JDK_17_PATH=$(ls -d /usr/lib/jvm/temurin-17-jdk-* 2>/dev/null | head -n 1)
if [ -z "$JDK_17_PATH" ] || [ ! -d "$JDK_17_PATH" ]; then
    error "Could not automatically find the JDK 17 installation path."
fi
export JAVA_HOME="$JDK_17_PATH"
export PATH="$JAVA_HOME/bin:$PATH"
info "JAVA_HOME has been set to: $JAVA_HOME"
java -version

# 3. Set Up Android SDK
# ------------------------------------
step "Configuring Android SDK environment..."
export ANDROID_HOME="$HOME/Android/sdk"
CMDLINE_TOOLS_PATH="$ANDROID_HOME/cmdline-tools/latest"

if [ ! -d "$CMDLINE_TOOLS_PATH" ]; then
    info "Android SDK command-line tools not found. Installing..."
    SDK_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
    wget -qO android_tools.zip "$SDK_URL"
    unzip -q android_tools.zip
    rm android_tools.zip
    mkdir -p "$ANDROID_HOME/cmdline-tools"
    mv cmdline-tools "$CMDLINE_TOOLS_PATH"
    info "Android SDK command-line tools installed."
else
    echo "✓ Android SDK command-line tools already installed."
fi

export PATH="$ANDROID_HOME/platform-tools:$CMDLINE_TOOLS_PATH/bin:$PATH"

info "Accepting SDK licenses and installing necessary packages..."
yes | sdkmanager --licenses > /dev/null
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" > /dev/null
info "Android SDK setup complete."

info "Creating local.properties file..."
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
echo "✓ android/local.properties created successfully."

# 4. Install Project Dependencies
# ------------------------------------
step "Installing project dependencies using npm..."
npm install

# 5. Build the Android Release APK
# ------------------------------------
step "Building the Android release APK..."
info "This is the final step and may take several minutes."
cd android
chmod +x gradlew

# **FIXED COMMAND**: Run Gradle without the daemon and with increased memory
./gradlew --no-daemon -Dorg.gradle.jvmargs="-Xmx4g" assembleRelease

cd ..

# 6. Final Output
# ------------------------------------
APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
step "BUILD SUCCESSFUL!"
echo -e "${GREEN}Your release APK is located at: ${YELLOW}${APK_PATH}${NC}"