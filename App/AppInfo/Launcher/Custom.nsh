${SegmentFile}

${SegmentPre}
	; Full path to the launcher executable file
	${SetEnvironmentVariablesPath} PAL:LAUNCHERPATH '$EXEPATH'

	; Full path to the launcher folder
	${SetEnvironmentVariablesPath} PAL:LAUNCHERDIR '$EXEDIR'

	; Only the launcher executable file
	${SetEnvironmentVariablesPath} PAL:LAUNCHERFILE '$EXEFILE'

	; Environment variable for LocalLowAppData
	ReadRegStr $0 HKCU 'Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders' {A520A1A4-1780-4FF6-BD18-167343C5AF16}
	${If} ${Errors}
		${SetEnvironmentVariablesPath} LOCALLOWAPPDATA '%USERPROFILE%\AppData\LocalLow'
	${Else}
		${SetEnvironmentVariablesPath} LOCALLOWAPPDATA '$0'
	${EndIf}
!macroend
