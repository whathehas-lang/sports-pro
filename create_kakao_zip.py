import os
import zipfile
import sys

sys.stdout.reconfigure(encoding='utf-8')

source_dir = r"C:\Users\user\Desktop\스포츠의모든것_v2"
output_zip = r"C:\Users\user\Desktop\스포츠의모든것_v2_최신본.zip"

# Exclude patterns
EXCLUDE_DIRS = {"node_modules", "dist", ".git", ".tempmediaStorage", ".gemini", "__pycache__", ".vscode"}
EXCLUDE_EXTS = {".png", ".jpg", ".jpeg", ".pyc", ".log", ".tmp"}

print(f"Creating lightweight KakaoTalk-ready zip file from: {source_dir}")
print(f"Target Zip File: {output_zip}")

file_count = 0

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(source_dir):
        # Exclude directories in-place
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            # Check extension
            _, ext = os.path.splitext(file)
            if ext.lower() in EXCLUDE_EXTS:
                continue
            if file.endswith("_최신본.zip"):
                continue

            full_path = os.path.join(root, file)
            # Relative path within zip
            rel_path = os.path.relpath(full_path, source_dir)
            zipf.write(full_path, rel_path)
            file_count += 1

size_bytes = os.path.getsize(output_zip)
size_mb = size_bytes / (1024 * 1024)

print(f"\nSUCCESS: Successfully compressed {file_count} files!")
print(f"Zip File Path: {output_zip}")
print(f"Zip File Size: {size_mb:.2f} MB (Perfect for KakaoTalk transfer!)")
