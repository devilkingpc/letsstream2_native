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

step "Java Version Manager: Setting Java 17 as default"

# 1. Ensure Temurin JDK 17 is installed
# --------------------------------------------------
step "Checking for Temurin JDK 17 installation..."

if dpkg -s temurin-17-jdk &> /dev/null; then
    echo "✓ Temurin JDK 17 is already installed."
else
    info "Temurin JDK 17 not found. Installing now..."
    sudo apt-get update
    sudo apt-get install -y apt-transport-https wget gpg
    
    sudo mkdir -p /etc/apt/keyrings
    wget -qO- https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor | sudo tee /etc/apt/keyrings/adoptium.gpg > /dev/null
    
    echo "deb [signed-by=/etc/apt/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/adoptium.list
    
    sudo apt-get update
    sudo apt-get install -y temurin-17-jdk
    info "Temurin JDK 17 has been installed."
fi


# 2. Find the installation paths for Java 17
# --------------------------------------------------
step "Locating Java 17 executables..."

# Find the specific directory, as it can vary slightly (e.g., -amd64, -arm64)
JAVA_17_HOME_PATH=$(ls -d /usr/lib/jvm/temurin-17-jdk-* | head -n 1)

if [ -z "$JAVA_17_HOME_PATH" ]; then
    error "Could not find the Java 17 installation directory after installation."
    exit 1
fi

JAVA_EXEC_PATH="$JAVA_17_HOME_PATH/bin/java"
JAVAC_EXEC_PATH="$JAVA_17_HOME_PATH/bin/javac"

if [ ! -f "$JAVA_EXEC_PATH" ]; then
    error "Could not find the Java 17 executable at '$JAVA_EXEC_PATH'."
    exit 1
fi

info "Found Java 17 at: $JAVA_17_HOME_PATH"


# 3. Set Java 17 as the default using update-alternatives
# --------------------------------------------------
step "Setting Java 17 as the system default..."

# This command tells the system to use our desired Java 17 path for the `java` command.
# The priority `2000` is set high to ensure it's selected.
sudo update-alternatives --install /usr/bin/java java "$JAVA_EXEC_PATH" 2000
sudo update-alternatives --install /usr/bin/javac javac "$JAVAC_EXEC_PATH" 2000

# Set the chosen version non-interactively
sudo update-alternatives --set java "$JAVA_EXEC_PATH"
sudo update-alternatives --set javac "$JAVAC_EXEC_PATH"

info "System default has been switched to Java 17."


# 4. Verification
# --------------------------------------------------
step "Verifying the new default Java version..."
java -version

echo -e "\n${GREEN}✓ Success! Your system will now use Java 17 by default.${NC}"