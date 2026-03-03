import os
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor

# Configuration
SERVICES = {
    "ai-service": {
        "path": "ai-service",
        "command": "python run.py",
        "port": 5001
    },
    "backend": {
        "path": "backend",
        "command": "python run.py",
        "port": 5000
    }
}

def run_command(service_name, config):
    print(f"🚀 Starting {service_name}...")
    
    # Path to the service's directory
    service_path = os.path.join(os.getcwd(), config["path"])
    
    # Setup virtual environment if not exists
    venv_path = os.path.join(service_path, "venv")
    if not os.path.exists(venv_path):
        print(f"📦 Creating virtual environment for {service_name}...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], cwd=service_path)
    
    # Python executable in venv
    python_exe = os.path.join(venv_path, "Scripts", "python.exe")
    pip_exe = os.path.join(venv_path, "Scripts", "pip.exe")
    
    # Install requirements
    print(f"📝 Installing dependencies for {service_name}...")
    subprocess.run([pip_exe, "install", "-r", "requirements.txt"], cwd=service_path)
    
    # Specific fix for Werkzeug/Flask issue
    subprocess.run([pip_exe, "install", "--upgrade", "Flask", "Werkzeug"], cwd=service_path)
    
    # Run the service
    print(f"✅ Executing {service_name} at http://localhost:{config['port']}")
    process = subprocess.Popen([python_exe, "run.py"], cwd=service_path, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    
    # Stream the output
    for line in iter(process.stdout.readline, ""):
        print(f"[{service_name}] {line.strip()}")
    
    process.stdout.close()
    return process.wait()

def main():
    print("--- FairDeal AI Manual Runner ---")
    print("Pre-requisites: Ensure MongoDB (27017) and Redis (6379) are running locally.")
    
    # We use a ThreadPool to run services in parallel
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = []
        for name, cfg in SERVICES.items():
            futures.append(executor.submit(run_command, name, cfg))
        
        # Wait for all (this will block as services are long-running)
        for future in futures:
            future.result()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Stopping services...")
        sys.exit(0)
