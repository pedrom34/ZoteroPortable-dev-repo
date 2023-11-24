${SegmentFile}

${SegmentPre}
	; Environment variables that can be used in the INI file

	; Full path to "ZoteroPortable.exe" file
	${SetEnvironmentVariablesPath} PAL:LAUNCHERPATH '$EXEPATH'
	; Path to folder where "ZoteroPortable.exe" exist
	${SetEnvironmentVariablesPath} PAL:LAUNCHERDIR '$EXEDIR'
	; The launcher executable itself (ZoteroPortable.exe)
	${SetEnvironmentVariablesPath} PAL:LAUNCHERFILE '$EXEFILE'
	; Shortcut to "%UserProfile%\AppData\LocalLow" directory
	${SetEnvironmentVariablesPath} LOCALAPPDATALOW '$PROFILE\AppData\LocalLow'
!macroend

${SegmentPreExecPrimary}
	; Shortcut to Zotero Word plugin directory
	StrCpy $1 '$EXEDIR\App\Zotero\extensions\zoteroWinWordIntegration@zotero.org\install'

	${IfNot} ${FileExists} '$APPDATA\Microsoft\Word\Startup\Zotero.dotm'
		; Always copy the latest version of Zotero Word plugin
		; This will replace the outdated version (unlike FilesMove, which create a backup)
		CopyFiles '$1\Zotero.dotm' '$APPDATA\Microsoft\Word\Startup\Zotero.dotm'

		${If} ${ProcessExists} 'winword.exe'
			; Show an error dialog if Microsoft Word is already running
			MessageBox MB_OK|MB_ICONINFORMATION 'You may need to restart Microsoft Word to use the Zotero plugin.'
		${EndIf}
	${EndIf}
!macroend

${SegmentPostPrimary}
	ClearErrors
	; Delete the Zotero Word plugin
	Delete '$APPDATA\Microsoft\Word\Startup\Zotero.dotm'

	${If} ${Errors}
		; Show an error dialog if Microsoft Word is still running
		MessageBox MB_OK|MB_ICONEXCLAMATION 'Unable to delete Zotero plugin, is Microsoft Word still running? Postponing deletion until the next Zotero launch.'
	${Else}
		; Remove directory only if empty
		RMDir '$APPDATA\Microsoft\Word\Startup'
		RMDir '$APPDATA\Microsoft\Word'
	${EndIf}
!macroend
