${SegmentFile}

${SegmentPre}
	${SetEnvironmentVariablesPath} PAL:LAUNCHERPATH '$EXEPATH'
	${SetEnvironmentVariablesPath} PAL:LAUNCHERDIR '$EXEDIR'
	${SetEnvironmentVariablesPath} PAL:LAUNCHERFILE '$EXEFILE'
	${SetEnvironmentVariablesPath} LOCALAPPDATALOW '$PROFILE\AppData\LocalLow'
!macroend

${SegmentPost}
	Delete '$APPDATA\Microsoft\Word\Startup\Zotero.*'
!macroend
