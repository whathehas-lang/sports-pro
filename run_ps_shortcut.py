import os
import subprocess

ps_content = """$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "토큰 (스포츠의 모든 것).lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "c:\\Users\\user\\Desktop\\스포츠의모든것_실행.bat"
$Shortcut.WorkingDirectory = "c:\\Users\\user\\Desktop\\스포츠의모든것_v2"
$Shortcut.Description = "스포츠의 모든 것 (토큰 Tokeon) 실행기"
$Shortcut.IconLocation = "shell32.dll, 43"
$Shortcut.Save()
Write-Output "SHORTCUT_CREATED_OK"
"""

with open("create_shortcut_bom.ps1", "w", encoding="utf-8-sig") as f:
    f.write(ps_content)

res = subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", "create_shortcut_bom.ps1"], capture_output=True, text=True, encoding="utf-8")
print("PowerShell Output:", res.stdout, res.stderr)
