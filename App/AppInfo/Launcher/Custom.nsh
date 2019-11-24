${SegmentFile}

${SegmentPre}
	${SetEnvironmentVariablesPath} PAL:LAUNCHERPATH '$EXEPATH'
	${SetEnvironmentVariablesPath} PAL:LAUNCHERDIR '$EXEDIR'
	${SetEnvironmentVariablesPath} PAL:LAUNCHERFILE '$EXEFILE'
	
	${If} ${FileExists} '$PROFILE\AppData\LocalLow\*.*'
		${SetEnvironmentVariablesPath} LOCALAPPDATALOW '$PROFILE\AppData\LocalLow'
	${EndIf}
!macroend