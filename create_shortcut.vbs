Set WshShell = CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
Set oShellLink = WshShell.CreateShortcut(strDesktop & "\Tokeon_Sports.lnk")
oShellLink.TargetPath = "c:\Users\user\Desktop\스포츠의모든것_실행.bat"
oShellLink.WindowStyle = 1
oShellLink.Hotkey = ""
oShellLink.IconLocation = "shell32.dll, 43"
oShellLink.Description = "스포츠의 모든 것 (토큰 Tokeon) 실행기"
oShellLink.WorkingDirectory = "c:\Users\user\Desktop\스포츠의모든것_v2"
oShellLink.Save
