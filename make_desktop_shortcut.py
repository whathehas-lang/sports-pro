import subprocess

ps_script = """
$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "토큰 (스포츠의 모든 것).lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "C:\\Users\\user\\Desktop\\스포츠의모든것_실행.bat"
$Shortcut.WorkingDirectory = "C:\\Users\\user\\Desktop\\스포츠의모든것_v2"
$Shortcut.Description = "토큰 (Tokeon) 100% 오피셜 팩트 분석기 실행"
$Shortcut.IconLocation = "shell32.dll,23"
$Shortcut.Save()
Write-Output "SUCCESS"
"""

with open("create_shortcut.ps1", "w", encoding="utf-8") as f:
    f.write(ps_script)

res = subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", "create_shortcut.ps1"], capture_output=True, text=True)
print("Result:", res.stdout, res.stderr)
