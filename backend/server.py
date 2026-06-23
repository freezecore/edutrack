import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

from edutrack import load_database

DB_PORT = int(os.environ.get("PORT", "8000"))


class EduTrackRequestHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/students":
            registry = load_database()
            students = [
                {
                    **student.to_dict(),
                    "gpa": student.calculate_gpa(),
                }
                for student in registry.values()
            ]
            self._send_json({"students": students})
            return

        if parsed.path == "/api/summary":
            registry = load_database()
            students = list(registry.values())
            total = len(students)
            average_gpa = round(sum((s.calculate_gpa() for s in students), 0.0) / total, 2) if total else 0.0
            honours = len([s for s in students if s.calculate_gpa() >= 3.5])
            self._send_json(
                {
                    "totalEnrollment": total,
                    "averageGPA": average_gpa,
                    "honoursCount": honours,
                }
            )
            return

        self.send_response(404)
        self.end_headers()


def run_server(port: int = DB_PORT) -> None:
    server_address = ("0.0.0.0", port)
    httpd = HTTPServer(server_address, EduTrackRequestHandler)
    print(f"Starting EduTrack API server on http://127.0.0.1:{port}")
    httpd.serve_forever()


if __name__ == "__main__":
    run_server()
