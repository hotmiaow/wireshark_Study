#!/usr/bin/env python3
"""
Wireshark Study Portal - Local Web Server
Runs a lightweight HTTP server on port 8000 (or the first available port)
"""
import os, sys, http.server, socketserver, webbrowser

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
        
    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server():
    port = PORT
    for _ in range(20):
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                url = f"http://localhost:{port}"
                print("=" * 65)
                print(f"  Wireshark Sample Captures Study Portal is running at:")
                print(f"  --> {url}")
                print(f"  Press Ctrl+C to stop the server.")
                print("=" * 65)
                httpd.serve_forever()
                break
        except OSError as e:
            if e.errno == 98: # Address already in use
                port += 1
            else:
                raise

if __name__ == "__main__":
    run_server()
