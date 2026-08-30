import os

try:
    import win32com.client
    shell = win32com.client.Dispatch("WScript.Shell")
    desktop = shell.SpecialFolders("Desktop")
    shortcut_path = os.path.join(desktop, "토큰 (스포츠의 모든 것).lnk")
    shortcut = shell.CreateShortcut(shortcut_path)
    shortcut.TargetPath = os.path.join(desktop, "스포츠의모든것_실행.bat")
    shortcut.WorkingDirectory = r"c:\Users\user\Desktop\스포츠의모든것_v2"
    shortcut.Description = "스포츠의 모든 것 (토큰 Tokeon) 실행"
    shortcut.IconLocation = "shell32.dll, 43"
    shortcut.Save()
    print("SUCCESS: Shortcut created via win32com at", shortcut_path)
except Exception as e:
    print("win32com failed:", e)
