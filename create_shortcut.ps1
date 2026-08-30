
$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "토큰 (스포츠의 모든 것).lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "C:\Users\user\Desktop\스포츠의모든것_실행.bat"
$Shortcut.WorkingDirectory = "C:\Users\user\Desktop\스포츠의모든것_v2"
$Shortcut.Description = "토큰 (Tokeon) 100% 오피셜 팩트 분석기 실행"
$Shortcut.IconLocation = "shell32.dll,23"
$Shortcut.Save()
Write-Output "SUCCESS"
