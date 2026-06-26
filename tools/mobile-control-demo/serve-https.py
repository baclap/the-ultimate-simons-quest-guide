#!/usr/bin/env python3
import http.server
import os
from pathlib import Path
import ssl
import socketserver


REPO_ROOT = Path(__file__).resolve().parents[2]
HOST = "0.0.0.0"
PORT = int(os.environ.get("CV2_CONTROL_DEMO_PORT", "4443"))
CERT_PATH = REPO_ROOT / "out/mobile-control-demo-https/cert.pem"
KEY_PATH = REPO_ROOT / "out/mobile-control-demo-https/key.pem"


class NoStoreHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".wasm": "application/wasm",
        ".js": "text/javascript",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


class ReuseTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def main():
    os.chdir(REPO_ROOT)
    with ReuseTCPServer((HOST, PORT), NoStoreHandler) as httpd:
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(CERT_PATH, KEY_PATH)
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        print(f"Serving https://{HOST}:{PORT}/ from {REPO_ROOT}", flush=True)
        httpd.serve_forever()


if __name__ == "__main__":
    main()
