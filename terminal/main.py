#!/usr/bin/env python3
import os
import sys
import json
import subprocess
import time
import requests

def read_private_key():
    try:
        with open('private_key.txt', 'r') as file:
            private_key = file.read().strip()
            return private_key
    except FileNotFoundError:
        print("Error: private_key.txt file not found in the current directory.")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading private key: {e}")
        sys.exit(1)

def deploy_to_enclave(private_key):
    print("Deploying to secure enclave for your AI agent...")
    try:
        result = subprocess.run(
            [
                "oyster-cvm", "deploy",
                "--wallet-private-key", private_key,
                "--duration-in-minutes", "15",
                "--docker-compose", "docker-compose.yml",
                "--arch", "amd64"
            ],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Extract IP address from the response
        output_lines = result.stdout.strip().split('\n')
        ip_address = None
        for line in output_lines:
            if line.strip().startswith("http://") and ":" in line:
                ip_address = line.strip().split("//")[1].split(":")[0]
                break
                
        if not ip_address:
            print("Could not extract IP address from deployment output.")
            print("Raw output:", result.stdout)
            sys.exit(1)
            
        return ip_address
    except subprocess.CalledProcessError as e:
        print(f"Deployment failed: {e}")
        print(f"Output: {e.stdout}")
        print(f"Error: {e.stderr}")
        sys.exit(1)

def initialize_api(ip_address, claude_api_key):
    endpoint = f"http://{ip_address}:8000/initialize"
    
    payload = {
        "provider": "anthropic",
        "model": "claude-3-5-sonnet-latest",
        "api_key": claude_api_key,
        "system_prompt": "You are a helpful AI assistant",
        "mcp_servers": {
            "fetch": {
                "command": "uvx",
                "args": ["mcp-server-fetch"]
            },
            "brave-search": {
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-brave-search"],
                "env": {
                    "BRAVE_API_KEY": "BSA2rzaY9ydQB9nxSnk380nJ8v85KfP"
                }
            }
        }
    }
    
    try:
        response = requests.post(endpoint, json=payload)
        response.raise_for_status()
        print(f"Initialization successful: {response.text}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Initialization failed: {e}")
        return False

def send_chat_query(ip_address, query):
    endpoint = f"http://{ip_address}:8000/chat"
    
    payload = {
        "query": query
    }
    
    try:
        response = requests.post(endpoint, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Chat API request failed: {e}")
        return None

def main():
    # Read private key
    private_key = read_private_key()
    print(f"Loading AI agents of wallet: {private_key[:6]}...{private_key[-4:]}")
    
    # Deploy to enclave
    ip_address = deploy_to_enclave(private_key)
    print(f"Deployment successful. Service running at: {ip_address}")
    
    # Wait a moment for the service to start
    print("Waiting for service to initialize...")
    time.sleep(5)
    
    # Get Claude API key
    claude_api_key = input("Enter your Claude API key: ")
    
    # Initialize the API
    init_success = initialize_api(ip_address, claude_api_key)
    
    if init_success:
        # Get chat query
        chat_query = input("Enter your chat query: ")
        
        # Send chat request
        response = send_chat_query(ip_address, chat_query)
        
        if response:
            print("\nResponse from AI agent:")
            print(json.dumps(response, indent=2))
    
if __name__ == "__main__":
    main()