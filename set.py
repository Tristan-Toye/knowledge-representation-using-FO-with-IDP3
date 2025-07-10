from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from io import BytesIO
import os
import subprocess
import json
import shutil
import platform
import zipfile
import shlex
import re

class SetHandler(SimpleHTTPRequestHandler):

    def __init__(self, command=None, timeout=20, *args, **kwargs):
        self.idp_command = command
        self.timeout_limit = timeout
        if(self.idp_command):
            print(f"Handler initialized with command: {self.idp_command}")
        else:
            print(f"Looks like 'idp' command was not found! Please make 'idp' command on the path or provide a custom path in the config file, and restart the app!")
        super().__init__(*args, **kwargs)

    def do_GET(self):

        # Parse the URL and query parameters
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)

        pages = {
            "/" : "menu",
            "/assignment" : "assignment",
            "/help" : "help",
            "/video": "video",
            "/set1" : "set1",  
            "/set2" : "set2"
        }

        requests = {
            "/get_code" : self.handle_get_code,
            "/save_code" : self.handle_save_code,
            "/is_set" : self.handle_is_set,
            "/show_sets" : self.handle_show_sets,
            "/are_there_sets" : self.handle_are_there_sets,
            "/ltc_progress" : self.handle_ltc_progress,
            "/download" : self.send_zip_file
        }

        # Serve the pages
        file_to_serve = pages.get(parsed_url.path)
        function_to_run = requests.get(parsed_url.path)

        if file_to_serve:
            # If no idp command
            if(self.idp_command == ""):
                self.serve_page("idperror")
            else:
                self.serve_page(file_to_serve)
        elif function_to_run:
            # If no idp command
            if(self.idp_command == ""):
                self.serve_page("idperror")
            else:
                function_to_run(query_params)
        else:
            super().do_GET()
        
    # Index server
    def serve_page(self, title):
        # Serve the html file from the current directory
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        
        # Read the contents of html
        try:
            with open("./pages/" + title + ".html", "rb") as file:
                self.wfile.write(file.read())
        except FileNotFoundError:
            self.wfile.write(b"<html><body><h1>404 - File Not Found</h1></body></html>")

    def handle_get_code(self, query_params):
        name = query_params.get("name", [""])[0]
        try:
            with open(f"./idp/{name}.idp", "rb") as file:
                code = file.read()
                code_str = code.decode('utf-8')

                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()

                response = json.dumps({"code": code_str})
                self.wfile.write(response.encode())

        except FileNotFoundError:
            self.wfile.write(b"<html><body><h1>404 - File Not Found</h1></body></html>")

    def handle_save_code(self, query_params):
        name = query_params.get("name", [""])[0]
        code = query_params.get("code", [""])[0]

        try:
            with open(f"./idp/{name}.idp", "w") as file:
                file.write(code)

                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(b"File saved!")

        except FileNotFoundError:
            self.wfile.write(b"<html><body><h1>404 - File Not Found</h1></body></html>")

    # is_set handler
    def handle_is_set(self, query_params):
        """Handle the /is_set endpoint with optional query parameters."""
        structure = query_params.get("structure", [""])[0]  # Get 'structure' parameter (default empty string)
        
        with open("./idp/set1/selected-instance.idp", "w") as file:
            file.write(structure)

        value = ""
        retrun_val = ""

        try:
            cmd_list = shlex.split(self.idp_command)
            function = r"checkIfSet\(\)" if platform.system() == "Windows" else "checkIfSet()"
            cmd_list.extend(["-e", function, "--nowarnings", "./idp/set1/set.idp"])
            result = subprocess.run(cmd_list, capture_output=True, text=True, check=True, timeout=self.timeout_limit)

            output = result.stdout.strip()

            # Check if the output contains "true" or "false"
            if "true" in output.lower():
                value = "true"
                retrun_val = "Your theory: This is a set!"
            elif "false" in output.lower():
                value = "false"
                retrun_val = "Your theory: This is not a set!"
            else:
                value = "unknown"
                retrun_val = "Unknown output!"

        except subprocess.TimeoutExpired:
            value = "timeout"
            retrun_val = "IDP timeout! You can change the timeout limit in the config file. Note that it should not exceed 1 minute!"

        except subprocess.CalledProcessError as e:
            value = "error"
            retrun_val = e.stderr.replace('"', '\\"').replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

        response = f'{{"value": "{value}", "msg": "{retrun_val}"}}'
        self.wfile.write(response.encode())

    # is_set handler
    def handle_show_sets(self, query_params):
        """Handle the /is_set endpoint with optional query parameters."""
        structure = query_params.get("structure", [""])[0]  # Get 'structure' parameter (default empty string)
        
        with open("./idp/set1/table-instance.idp", "w") as file:
            file.write(structure)

        value = ""
        retrun_val = ""

        try:
            cmd_list = shlex.split(self.idp_command)
            function = r"findSetsOnTable\(\)" if platform.system() == "Windows" else "findSetsOnTable()"
            cmd_list.extend(["-e", function, "--nowarnings", "./idp/set1/set.idp"])
            result = subprocess.run(cmd_list, capture_output=True, text=True, check=True, timeout=self.timeout_limit)
            output = result.stdout.strip()

            if "unsatisfiable" in output.lower():
                value = "unsatisfiable"
                retrun_val = ""
            else:
                value = "success"
                retrun_val = output.replace('"', '\\"').replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")

        except subprocess.TimeoutExpired:
            value = "timeout"
            retrun_val = "IDP timeout! You can change the timeout limit in the config file. Note that it should not exceed 1 minute!"

        except subprocess.CalledProcessError as e:
            value = "error"
            retrun_val = e.stderr.replace('"', '\\"').replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

        response = f'{{"value": "{value}", "msg": "{retrun_val}"}}'
        self.wfile.write(response.encode())

    def handle_are_there_sets(self, query_params):
        """Handle the /is_set endpoint with optional query parameters."""
        structure = query_params.get("structure", [""])[0]  # Get 'structure' parameter (default empty string)
        
        with open("./idp/set1/table-instance.idp", "w") as file:
            file.write(structure)

        value = ""
        retrun_val = ""

        try:
            cmd_list = shlex.split(self.idp_command)
            function = r"areThereSetsOnTheTable\(\)" if platform.system() == "Windows" else "areThereSetsOnTheTable()"
            cmd_list.extend(["-e", function, "--nowarnings", "./idp/set1/set.idp"])
            result = subprocess.run(cmd_list, capture_output=True, text=True, check=True, timeout=self.timeout_limit)

            output = result.stdout.strip()

            # Check if the output contains "true" or "false"
            if "true" in output.lower():
                value = "true"
                retrun_val = "Your theory: This is a set!"
            elif "false" in output.lower():
                value = "false"
                retrun_val = "Your theory: This is not a set!"
            else:
                value = "unknown"
                retrun_val = "Unknown output!"

        except subprocess.TimeoutExpired:
            value = "timeout"
            retrun_val = "IDP timeout! You can change the timeout limit in the config file. Note that it should not exceed 1 minute!"

        except subprocess.CalledProcessError as e:
            value = "error"
            retrun_val = e.stderr.replace('"', '\\"').replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

        response = f'{{"value": "{value}", "msg": "{retrun_val}"}}'
        self.wfile.write(response.encode())


    def handle_ltc_progress(self, query_params):
        """Handle the /is_set endpoint with optional query parameters."""
        structure = query_params.get("structure", [""])[0]
        inference = query_params.get("inference", [""])[0]
       
        #structure = structure[:structure.find("deck = ")] + structure[structure.find("deck = "):structure.find("13->")]  + structure[structure.find("13->"):][structure[structure.find("13->"):].find("}"):]
    
        with open("./idp/set2/structure.idp", "w") as file:
            file.write(structure)

        value = ""
        retrun_val = ""

        try:
            cmd_list = shlex.split(self.idp_command)
            function = r"writeTheHelpVoc\(\)" if platform.system() == "Windows" else "writeTheHelpVoc()"

            cmd_list.extend(["-e", function, "--nowarnings", "./vocabulary-util.idp"])
            subprocess.run(cmd_list, cwd="./idp/set2", capture_output=True, text=True, check=True, timeout=self.timeout_limit)

            cmd_list = shlex.split(self.idp_command)
            function = r"\(\)" if platform.system() == "Windows" else "()"

            cmd_list.extend(["-e", inference+function, "--nowarnings", "./idp/set2/set.idp"])
            result = subprocess.run(cmd_list, capture_output=True, text=True, check=True, timeout=self.timeout_limit)

            output = result.stdout.strip()

            nil_pattern = r"^waiting for compilation of file \(.+\)\nnil$"
            if "unsatisfiable" in output.lower():
                value = "unsatisfiable"
                retrun_val = ""
            elif re.match(nil_pattern, output.lower()):
                value = "error"
                retrun_val = "No init or next state was found! This can be caused by many reasons. Some hints: check that all symbols used are introduced in the vocabulary; verify that causalities and successor state axioms follow the required pattern; verify that definitions of function concepts are total."
            elif "more-then-expected-models" in output.lower():
                value = "success-more-models"
                retrun_val = output.replace('"', '\\"').replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")
            else:
                value = "success"
                retrun_val = output.replace('"', '\\"').replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")

        except subprocess.TimeoutExpired:
            value = "timeout"
            retrun_val = "IDP timeout! You can change the timeout limit in the config file. Note that it should not exceed 1 minute!"

        except subprocess.CalledProcessError as e:
            value = "error"
            retrun_val = e.stderr.replace('"', '\\"').replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

        response = f'{{"value": "{value}", "msg": "{retrun_val}"}}'
        self.wfile.write(response.encode())

    def send_zip_file(self, query_params):
        part = query_params.get("part", ["one"])[0]
        zip_name = query_params.get("zipname", ["files.zip"])[0]

        file_names = []
        # Populate the list of files based on the part
        if part == "one":
            file_names = ["./idp/set1/base-theory.idp", "./idp/set1/selected-theory.idp", "./idp/set1/table-theory.idp"]
        else:
            file_names = ["./idp/set2/voc-student.idp", "./idp/set2/theory-player.idp", "./idp/set2/theory-table.idp", "./idp/set2/theory-score.idp", "./idp/set2/theory-actions.idp", "./idp/set2/theory-constraints.idp"]

        zip_buffer = BytesIO()

        # Create a ZIP file in memory
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file in file_names:
                if os.path.exists(file):
                    zipf.write(file, os.path.basename(file))

        # Prepare the response
        self.send_response(200)
        self.send_header("Content-type", "application/zip")
        self.send_header("Content-Disposition", f"attachment; filename={zip_name}")
        self.end_headers()

        # Write zip content to response
        zip_buffer.seek(0)
        self.wfile.write(zip_buffer.read())

# Search for idp binaries
def find_idp():
    print("Searching for IDP!")
    commands = {
        "Windows": ["wsl idp", "idp"],
        "Linux": ["idp", "/opt/idp3/resources/app/idp3/bin/idp", "/usr/local/bin/idp", "/export/home1/localhost/packages/IDP3-IDE/v0.3.4/resources/app/idp3/bin/idp"],
        "Darwin": ["idp", "/Applications/idp3-ide.app/Contents/Resources/app/idp3/bin/idp"]
    }

    # Load from file
    with open("config.json", "r") as f:
        loaded_data = json.load(f)

    system = platform.system()
    possible_commands = commands.get(system, [])
    
    if loaded_data["idp_path"]:
        possible_commands.insert(0, loaded_data["idp_path"])
        
    for cmd in possible_commands:
        print("Checing commands from the confing and the preset: (" + cmd + ")")
        try:
            cmd_list = shlex.split(cmd)
            cmd_list.append("-h")
            result = subprocess.run(cmd_list, capture_output=True, text=True, check=True)
            output = result.stdout.strip()

            if "idp [options] [filename [filename [...]]]" in output.lower():
                print(f"Command '{cmd}' is valid.")
                return cmd 
        except subprocess.CalledProcessError:
            print(f"Command '{cmd}' failed to execute.")

    return "" 

# Get timeout limit
def get_timeout():
    print("Searching config for timeout limit!")

    # Load from file
    with open("config.json", "r") as f:
        loaded_data = json.load(f)

    if loaded_data["timeout"]:
        print("Timeout set by config to: " + str(loaded_data["timeout"]) + "(s).")
        return loaded_data["timeout"]
    else: 
        print("Timeout set to default value: 20(s).")
        return 20

# Get the port
def get_port():
    print("Searching config for port!")

    # Load from file
    with open("config.json", "r") as f:
        loaded_data = json.load(f)

    if loaded_data["port"]:
        print("Port set by config to: " + str(loaded_data["port"]))
        return loaded_data["port"]
    else: 
        print("Port set to default value: 8000.")
        return 8000


# Factory function to inject parameters
def handler_factory(idp_path, timeout):
    return lambda *args, **kwargs: SetHandler(idp_path, timeout, *args, **kwargs)

if __name__ == "__main__":
    # Define server address and port
    host = "localhost"
    port = get_port()

    # Set up server
    server_address = (host, port)
    httpd = HTTPServer(server_address, handler_factory(find_idp(), get_timeout()))

    print(f"Serving HTTP on {host}:{port}")
    httpd.serve_forever()



