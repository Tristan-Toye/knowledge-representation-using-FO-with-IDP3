# IDP3 Installation Guide

This guide provides step-by-step instructions for installing IDP3 (Interactive Development of Programs) on Windows, Linux, and macOS systems.

## Table of Contents

1. [What is IDP3?](#what-is-idp3)
2. [System Requirements](#system-requirements)
3. [Windows Installation](#windows-installation)
4. [Linux Installation](#linux-installation)
5. [macOS Installation](#macos-installation)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)
8. [Alternative Installation Methods](#alternative-installation-methods)

## What is IDP3?

IDP3 (Interactive Development of Programs) is a knowledge base system that supports the development of programs in the declarative language FO(.) (First-Order Logic with inductive definitions). It provides:

- A declarative language for knowledge representation
- Support for model expansion and querying
- Integration with various reasoning engines
- Interactive development environment

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, Ubuntu 18.04+, macOS 10.14+
- **Memory**: 4 GB RAM (8 GB recommended)
- **Storage**: 2 GB free disk space
- **Java**: Java 8 or higher (required for IDP3)

### Recommended Requirements
- **Operating System**: Latest stable version
- **Memory**: 8 GB RAM or more
- **Storage**: 5 GB free disk space
- **Java**: Java 11 or higher
- **Processor**: Multi-core processor

## Windows Installation

### Method 1: Using the Official Installer

1. **Download IDP3**:
   - Visit the official IDP3 website: [https://dtai.cs.kuleuven.be/software/idp3](https://dtai.cs.kuleuven.be/software/idp3)
   - Click on "Download" and select the Windows version
   - Download the latest stable release

2. **Install Java** (if not already installed):
   ```cmd
   # Check if Java is installed
   java -version
   
   # If not installed, download from Oracle or OpenJDK
   # Visit: https://adoptium.net/ or https://www.oracle.com/java/technologies/
   ```

3. **Run the Installer**:
   - Double-click the downloaded `.exe` file
   - Follow the installation wizard
   - Choose installation directory (default: `C:\Program Files\IDP3`)
   - Complete the installation

4. **Add to PATH**:
   - Open System Properties → Advanced → Environment Variables
   - Edit the `Path` variable
   - Add the IDP3 installation directory (e.g., `C:\Program Files\IDP3\bin`)
   - Click OK to save

### Method 2: Manual Installation

1. **Download and Extract**:
   ```cmd
   # Create installation directory
   mkdir C:\IDP3
   
   # Extract downloaded zip file to C:\IDP3
   # The structure should be: C:\IDP3\bin\idp.exe
   ```

2. **Add to PATH**:
   ```cmd
   # Add to system PATH
   setx PATH "%PATH%;C:\IDP3\bin"
   ```

3. **Verify Installation**:
   ```cmd
   idp --version
   ```

## Linux Installation

### Method 1: Using Package Manager (Ubuntu/Debian)

1. **Update Package List**:
   ```bash
   sudo apt update
   ```

2. **Install Java** (if not already installed):
   ```bash
   # Install OpenJDK
   sudo apt install openjdk-11-jdk
   
   # Verify installation
   java -version
   ```

3. **Download IDP3**:
   ```bash
   # Create installation directory
   sudo mkdir -p /opt/idp3
   
   # Download IDP3 (replace URL with actual download link)
   wget https://dtai.cs.kuleuven.be/software/idp3/download/idp3-linux.tar.gz
   
   # Extract to installation directory
   sudo tar -xzf idp3-linux.tar.gz -C /opt/idp3 --strip-components=1
   ```

4. **Add to PATH**:
   ```bash
   # Add to system PATH
   echo 'export PATH=$PATH:/opt/idp3/bin' >> ~/.bashrc
   source ~/.bashrc
   ```

5. **Set Permissions**:
   ```bash
   # Make IDP3 executable
   sudo chmod +x /opt/idp3/bin/idp
   ```

### Method 2: Using Snap (if available)

```bash
# Install via snap (if available)
sudo snap install idp3
```

### Method 3: Manual Installation

1. **Download and Extract**:
   ```bash
   # Create installation directory
   sudo mkdir -p /usr/local/idp3
   
   # Download and extract IDP3
   wget https://dtai.cs.kuleuven.be/software/idp3/download/idp3-linux.tar.gz
   sudo tar -xzf idp3-linux.tar.gz -C /usr/local/idp3 --strip-components=1
   ```

2. **Create Symbolic Link**:
   ```bash
   # Create symbolic link for easy access
   sudo ln -s /usr/local/idp3/bin/idp /usr/local/bin/idp
   ```

3. **Set Permissions**:
   ```bash
   # Set appropriate permissions
   sudo chmod +x /usr/local/idp3/bin/idp
   ```

## macOS Installation

### Method 1: Using Homebrew

1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Java**:
   ```bash
   # Install OpenJDK
   brew install openjdk@11
   
   # Link Java
   sudo ln -sfn /opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk
   ```

3. **Install IDP3** (if available via Homebrew):
   ```bash
   brew install idp3
   ```

### Method 2: Manual Installation

1. **Download IDP3**:
   ```bash
   # Create installation directory
   sudo mkdir -p /usr/local/idp3
   
   # Download IDP3 for macOS
   curl -O https://dtai.cs.kuleuven.be/software/idp3/download/idp3-macos.tar.gz
   ```

2. **Extract and Install**:
   ```bash
   # Extract to installation directory
   sudo tar -xzf idp3-macos.tar.gz -C /usr/local/idp3 --strip-components=1
   
   # Set permissions
   sudo chmod +x /usr/local/idp3/bin/idp
   ```

3. **Add to PATH**:
   ```bash
   # Add to shell profile
   echo 'export PATH=$PATH:/usr/local/idp3/bin' >> ~/.zshrc
   source ~/.zshrc
   ```

### Method 3: Using MacPorts (if available)

```bash
# Install via MacPorts
sudo port install idp3
```

## Verification

After installation, verify that IDP3 is working correctly:

### Basic Verification

1. **Check Version**:
   ```bash
   idp --version
   # Expected output: IDP version information
   ```

2. **Check Help**:
   ```bash
   idp --help
   # Expected output: Command-line options and usage
   ```

3. **Test Basic Functionality**:
   ```bash
   # Create a simple test file
   echo "vocabulary V { type T }" > test.idp
   
   # Run IDP3 on the test file
   idp test.idp
   ```

### Advanced Verification

1. **Test with Project Files**:
   ```bash
   # Navigate to project directory
   cd knowledge-representation-using-FO-with-IDP3
   
   # Test with a project theory
   idp idp/set1/base-theory.idp
   ```

2. **Check Integration**:
   ```bash
   # Run the Python application
   python set.py
   
   # Open browser to http://localhost:8000
   # Verify that IDP3 integration works
   ```

## Troubleshooting

### Common Issues

#### IDP3 Command Not Found

**Symptoms**: `'idp' is not recognized as an internal or external command`

**Solutions**:
1. **Check PATH**:
   ```bash
   # Windows
   echo %PATH%
   
   # Linux/macOS
   echo $PATH
   ```

2. **Re-add to PATH**:
   ```bash
   # Windows
   setx PATH "%PATH%;C:\path\to\idp3\bin"
   
   # Linux/macOS
   export PATH=$PATH:/path/to/idp3/bin
   ```

3. **Restart Terminal**: Close and reopen your terminal/command prompt

#### Java Not Found

**Symptoms**: `Error: Could not find or load main class`

**Solutions**:
1. **Install Java**:
   ```bash
   # Ubuntu/Debian
   sudo apt install openjdk-11-jdk
   
   # macOS
   brew install openjdk@11
   
   # Windows: Download from Oracle or Adoptium
   ```

2. **Set JAVA_HOME**:
   ```bash
   # Linux/macOS
   export JAVA_HOME=/usr/lib/jvm/java-11-openjdk
   export PATH=$JAVA_HOME/bin:$PATH
   
   # Windows
   setx JAVA_HOME "C:\Program Files\Java\jdk-11"
   ```

#### Permission Denied

**Symptoms**: `Permission denied` when running IDP3

**Solutions**:
```bash
# Make executable
chmod +x /path/to/idp3/bin/idp

# Check file permissions
ls -la /path/to/idp3/bin/idp
```

#### Out of Memory

**Symptoms**: `java.lang.OutOfMemoryError`

**Solutions**:
1. **Increase Java heap size**:
   ```bash
   # Set environment variable
   export IDP_OPTS="-Xmx2g"
   
   # Or modify IDP3 startup script
   # Add: java -Xmx2g -jar idp.jar
   ```

2. **Check available memory**:
   ```bash
   # Linux/macOS
   free -h
   
   # Windows
   wmic computersystem get TotalPhysicalMemory
   ```

### Platform-Specific Issues

#### Windows Issues

1. **Antivirus Blocking**:
   - Add IDP3 directory to antivirus exclusions
   - Temporarily disable antivirus for testing

2. **Windows Defender**:
   - Allow IDP3 through Windows Defender
   - Add to trusted applications

#### Linux Issues

1. **Library Dependencies**:
   ```bash
   # Install required libraries
   sudo apt install libc6 libstdc++6
   ```

2. **Display Issues**:
   ```bash
   # Set display for GUI components
   export DISPLAY=:0
   ```

#### macOS Issues

1. **Gatekeeper**:
   ```bash
   # Allow IDP3 to run
   sudo spctl --master-disable
   # Or right-click → Open for specific app
   ```

2. **Rosetta 2** (for Apple Silicon):
   ```bash
   # Install Rosetta 2
   softwareupdate --install-rosetta
   ```

## Alternative Installation Methods

### Using Docker

1. **Create Dockerfile**:
   ```dockerfile
   FROM openjdk:11-jre-slim
   
   # Install IDP3
   RUN apt-get update && apt-get install -y wget
   RUN wget https://dtai.cs.kuleuven.be/software/idp3/download/idp3-linux.tar.gz
   RUN tar -xzf idp3-linux.tar.gz -C /opt --strip-components=1
   
   # Add to PATH
   ENV PATH="/opt/bin:${PATH}"
   
   # Set working directory
   WORKDIR /workspace
   
   # Expose port
   EXPOSE 8000
   
   # Default command
   CMD ["idp", "--help"]
   ```

2. **Build and Run**:
   ```bash
   # Build image
   docker build -t idp3 .
   
   # Run container
   docker run -it -v $(pwd):/workspace idp3
   ```

### Using Virtual Environment

1. **Create Virtual Environment**:
   ```bash
   # Create virtual environment
   python -m venv idp3_env
   
   # Activate environment
   source idp3_env/bin/activate  # Linux/macOS
   # or
   idp3_env\Scripts\activate     # Windows
   ```

2. **Install in Virtual Environment**:
   ```bash
   # Install IDP3 in virtual environment
   pip install idp3  # if available via pip
   ```

## Support and Resources

### Official Resources
- **IDP3 Website**: [https://dtai.cs.kuleuven.be/software/idp3](https://dtai.cs.kuleuven.be/software/idp3)
- **Documentation**: [https://dtai.cs.kuleuven.be/software/idp3/documentation](https://dtai.cs.kuleuven.be/software/idp3/documentation)
- **GitHub Repository**: [https://github.com/KULeuven-DTAI/IDP3](https://github.com/KULeuven-DTAI/IDP3)

### Community Support
- **Mailing List**: [idp-users@cs.kuleuven.be](mailto:idp-users@cs.kuleuven.be)
- **Issue Tracker**: [GitHub Issues](https://github.com/KULeuven-DTAI/IDP3/issues)
- **Discussion Forum**: [IDP3 Forum](https://dtai.cs.kuleuven.be/software/idp3/forum)

### Additional Help
- **Tutorials**: [IDP3 Tutorials](https://dtai.cs.kuleuven.be/software/idp3/tutorials)
- **Examples**: [IDP3 Examples](https://dtai.cs.kuleuven.be/software/idp3/examples)
- **FAQ**: [Frequently Asked Questions](https://dtai.cs.kuleuven.be/software/idp3/faq)

---

*This installation guide is maintained by the MCS didactic team. For additional support, please contact the development team or refer to the official IDP3 documentation.* 