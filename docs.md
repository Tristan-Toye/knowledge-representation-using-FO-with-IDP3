# Knowledge Representation using First-Order Logic with IDP3 - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [System Components](#system-components)
3. [API Reference](#api-reference)
4. [Configuration](#configuration)
5. [Development Guide](#development-guide)
6. [Troubleshooting](#troubleshooting)
7. [Performance Considerations](#performance-considerations)

## Architecture Overview

The application follows a client-server architecture with the following key components:

### Backend Architecture
- **HTTP Server**: Python-based SimpleHTTPRequestHandler
- **IDP3 Integration**: Subprocess-based communication with IDP3 engine
- **File Management**: Dynamic file creation and management for IDP3 theories
- **Configuration Management**: JSON-based configuration system

### Frontend Architecture
- **Single Page Application**: HTML-based interface with JavaScript modules
- **Code Editor**: CodeMirror integration for IDP3 syntax highlighting
- **Real-time Communication**: AJAX-based communication with backend
- **Responsive Design**: Bootstrap-based responsive UI

### Data Flow
1. User interacts with web interface
2. JavaScript sends AJAX requests to Python server
3. Server processes requests and communicates with IDP3
4. Results are returned to frontend for display

## System Components

### Core Server (`set.py`)

The main server application that handles all HTTP requests and IDP3 communication.

#### Key Classes

##### `SetHandler`
Main HTTP request handler class that extends `SimpleHTTPRequestHandler`.

**Constructor Parameters:**
- `command` (str): Path to IDP3 executable
- `timeout` (int): Timeout limit for IDP3 operations in seconds

**Key Methods:**
- `do_GET()`: Handles all GET requests and routes them appropriately
- `serve_page()`: Serves HTML pages from the pages directory
- `handle_is_set()`: Processes set validation requests
- `handle_show_sets()`: Processes set discovery requests
- `handle_are_there_sets()`: Checks for set existence
- `handle_ltc_progress()`: Manages LTC progress tracking
- `send_zip_file()`: Handles solution download requests

#### Utility Functions

##### `find_idp()`
Locates the IDP3 executable in the system PATH or configuration.

**Returns:** String path to IDP3 executable or empty string if not found

##### `get_timeout()`
Reads timeout configuration from config.json.

**Returns:** Integer timeout value in seconds

##### `get_port()`
Reads port configuration from config.json.

**Returns:** Integer port number

### Frontend Components

#### JavaScript Modules

##### `CodeManager.js`
Manages code editing and synchronization with the server.

**Key Functions:**
- `loadCode(name)`: Loads IDP3 code from server
- `saveCode(name, code)`: Saves IDP3 code to server
- `executeCode(name, params)`: Executes IDP3 theories

##### `GameState.js`
Manages game state and player interactions.

**Key Functions:**
- `initializeGame()`: Sets up initial game state
- `processPlayerAction(action)`: Handles player moves
- `updateScore(playerId, points)`: Updates player scores

##### `EngineCom.js`
Handles communication with the IDP3 engine.

**Key Functions:**
- `sendRequest(endpoint, params)`: Sends requests to server
- `parseResponse(response)`: Parses server responses
- `handleError(error)`: Handles communication errors

## API Reference

### HTTP Endpoints

#### GET Endpoints

##### `/`
Serves the main menu page.

**Response:** HTML content of menu.html

##### `/assignment`
Serves the project assignment description.

**Response:** HTML content of assignment.html

##### `/set1`
Serves the Part 1 interface.

**Response:** HTML content of set1.html

##### `/set2`
Serves the Part 2 interface.

**Response:** HTML content of set2.html

##### `/help`
Serves the help and support page.

**Response:** HTML content of help.html

##### `/video`
Serves the demo video page.

**Response:** HTML content of video.html

#### API Endpoints

##### `/get_code`
Retrieves IDP3 code from the server.

**Parameters:**
- `name` (string): Name of the IDP3 file to retrieve

**Response:**
```json
{
  "code": "IDP3 code content"
}
```

##### `/save_code`
Saves IDP3 code to the server.

**Parameters:**
- `name` (string): Name of the IDP3 file to save
- `code` (string): IDP3 code content

**Response:** "File saved!" on success

##### `/is_set`
Validates if a given structure represents a valid set.

**Parameters:**
- `structure` (string): IDP3 structure definition

**Response:**
```json
{
  "value": "true|false|unknown|timeout|error",
  "msg": "Human-readable message"
}
```

##### `/show_sets`
Finds all possible sets in a given table structure.

**Parameters:**
- `structure` (string): IDP3 table structure definition

**Response:**
```json
{
  "value": "success|unsatisfiable|timeout|error",
  "msg": "Found sets or error message"
}
```

##### `/are_there_sets`
Checks if any sets exist in a given table structure.

**Parameters:**
- `structure` (string): IDP3 table structure definition

**Response:**
```json
{
  "value": "true|false|timeout|error",
  "msg": "Human-readable message"
}
```

##### `/ltc_progress`
Tracks progress in LTC development.

**Parameters:**
- `progress` (string): Progress data in JSON format

**Response:** Success confirmation

##### `/download`
Downloads the complete solution as a ZIP file.

**Parameters:** None

**Response:** ZIP file containing all IDP3 files

## Configuration

### Configuration File (`config.json`)

The application uses a JSON configuration file for system settings.

```json
{
  "_comment_idp_path": "Leave this value empty if you want the system to try to find the command itself.",
  "idp_path": "",
  "_comment_timeout": "Change if you would like to increase IDP timeout (in seconds).",
  "timeout": 20,
  "_comment_port": "Change if you would like app to be on another port.",
  "port": 8000
}
```

#### Configuration Parameters

- **`idp_path`** (string): Path to IDP3 executable. Leave empty for auto-detection.
- **`timeout`** (integer): Timeout limit for IDP3 operations in seconds (default: 20).
- **`port`** (integer): HTTP server port (default: 8000).

### Environment Variables

The application can be configured using environment variables:

- **`IDP_PATH`**: Overrides the IDP3 path from config.json
- **`IDP_TIMEOUT`**: Overrides the timeout from config.json
- **`IDP_PORT`**: Overrides the port from config.json

## Development Guide

### Setting Up Development Environment

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd knowledge-representation-using-FO-with-IDP3
   ```

2. **Install dependencies:**
   ```bash
   # Python dependencies (included in standard library)
   # No additional pip packages required
   ```

3. **Install IDP3:**
   - Download IDP3 from the official website
   - Add to system PATH or specify path in config.json

4. **Run in development mode:**
   ```bash
   python set.py
   ```

### Code Structure Guidelines

#### Python Code Style
- Follow PEP 8 guidelines
- Use descriptive variable and function names
- Add docstrings for all public methods
- Handle exceptions appropriately

#### JavaScript Code Style
- Use ES6+ features where appropriate
- Follow consistent naming conventions
- Modularize code into separate files
- Add JSDoc comments for functions

#### IDP3 Code Style
- Use descriptive predicate and function names
- Add comprehensive comments explaining logic
- Follow IDP3 best practices for theory organization
- Test theories with multiple examples

### Adding New Features

#### Adding New API Endpoints

1. **Add route mapping in `do_GET()`:**
   ```python
   requests = {
       "/new_endpoint": self.handle_new_endpoint,
       # ... existing endpoints
   }
   ```

2. **Implement handler method:**
   ```python
   def handle_new_endpoint(self, query_params):
       # Implementation here
       pass
   ```

3. **Add frontend JavaScript function:**
   ```javascript
   async function callNewEndpoint(params) {
       const response = await fetch(`/new_endpoint?${new URLSearchParams(params)}`);
       return await response.json();
   }
   ```

#### Adding New IDP3 Theories

1. **Create theory file in appropriate directory:**
   ```
   idp/set1/new-theory.idp
   ```

2. **Add vocabulary definitions:**
   ```idp
   vocabulary V {
       // Type definitions
       type Card
       
       // Predicate definitions
       predicate isValidSet(Card, Card, Card)
   }
   ```

3. **Add theory definitions:**
   ```idp
   theory T : V {
       // Theory axioms
       !c1 c2 c3: isValidSet(c1, c2, c3) <=> ...
   }
   ```

### Testing

#### Manual Testing
- Test all web interface components
- Verify IDP3 theory execution
- Check error handling scenarios
- Test with different IDP3 configurations

#### Automated Testing
- Unit tests for Python functions
- Integration tests for API endpoints
- Frontend JavaScript testing
- IDP3 theory validation

## Troubleshooting

### Common Issues

#### IDP3 Not Found
**Symptoms:** Application shows "IDP command not found" error.

**Solutions:**
1. Verify IDP3 is installed and in system PATH
2. Specify full path in config.json
3. Check file permissions for IDP3 executable

#### Timeout Errors
**Symptoms:** Operations fail with timeout messages.

**Solutions:**
1. Increase timeout value in config.json
2. Check system resources
3. Simplify complex IDP3 theories

#### Port Already in Use
**Symptoms:** Server fails to start with port binding error.

**Solutions:**
1. Change port in config.json
2. Kill existing processes on the port
3. Use different port via command line

#### File Permission Errors
**Symptoms:** Cannot save or read IDP3 files.

**Solutions:**
1. Check directory permissions
2. Ensure write access to idp/ directory
3. Run with appropriate user privileges

### Debug Mode

Enable debug logging by setting environment variable:
```bash
export IDP_DEBUG=1
python set.py
```

### Log Files

The application logs to stdout/stderr. For production deployment, redirect to log files:
```bash
python set.py > app.log 2>&1
```

## Performance Considerations

### IDP3 Performance
- **Theory Complexity**: Complex theories may cause timeouts
- **Instance Size**: Large instances require more processing time
- **Memory Usage**: Monitor memory consumption for large operations

### Web Server Performance
- **Concurrent Users**: Single-threaded server limits concurrent access
- **File I/O**: Frequent file operations may impact performance
- **Network Latency**: Consider server location for remote access

### Optimization Strategies
- **Caching**: Implement result caching for repeated queries
- **Connection Pooling**: Reuse IDP3 connections where possible
- **Asynchronous Processing**: Use async/await for non-blocking operations
- **Resource Monitoring**: Monitor CPU and memory usage

### Scalability Considerations
- **Load Balancing**: Use reverse proxy for multiple instances
- **Database Integration**: Consider persistent storage for large datasets
- **Microservices**: Split functionality into separate services
- **Containerization**: Use Docker for consistent deployment

## Security Considerations

### Input Validation
- Validate all user inputs before processing
- Sanitize IDP3 code to prevent injection attacks
- Implement proper error handling

### File System Security
- Restrict file access to necessary directories
- Validate file paths to prevent directory traversal
- Implement proper file permissions

### Network Security
- Use HTTPS in production environments
- Implement proper authentication if needed
- Monitor for suspicious activity

## Deployment

### Production Deployment
1. **Environment Setup:**
   ```bash
   # Install production dependencies
   pip install gunicorn
   
   # Set production environment variables
   export IDP_ENV=production
   ```

2. **Server Configuration:**
   ```bash
   # Use Gunicorn for production
   gunicorn -w 4 -b 0.0.0.0:8000 set:app
   ```

3. **Reverse Proxy Setup:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY . .

RUN apt-get update && apt-get install -y idp3

EXPOSE 8000
CMD ["python", "set.py"]
```

## Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review and merge

### Code Review Guidelines
- Ensure all tests pass
- Follow coding standards
- Add appropriate documentation
- Consider performance implications

### Release Process
1. Update version numbers
2. Update documentation
3. Create release notes
4. Tag release
5. Deploy to production

---

*This documentation is maintained by the MCS didactic team. For questions or contributions, please contact the development team.* 