;Copyright 2004-2016 John T. Haller of PortableApps.com

;Website: http://PortableApps.com/FirefoxPortable

;This software is OSI Certified Open Source Software.
;OSI Certified is a certification mark of the Open Source Initiative.

;This program is free software; you can redistribute it and/or
;modify it under the terms of the GNU General Public License
;as published by the Free Software Foundation; either version 2
;of the License, or (at your option) any later version.

;This program is distributed in the hope that it will be useful,
;but WITHOUT ANY WARRANTY; without even the implied warranty of
;MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;GNU General Public License for more details.

;You should have received a copy of the GNU General Public License
;along with this program; if not, write to the Free Software
;Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

;=== Program Details
Name "AppName"
OutFile "AppName.exe"
Caption "AppName | PortableApps.com"
VIProductVersion "0.0.0.0"
VIAddVersionKey ProductName "AppName"
VIAddVersionKey Comments "Example app stub"
VIAddVersionKey CompanyName "PortableApps.com"
VIAddVersionKey LegalCopyright "John T. Haller"
VIAddVersionKey FileDescription "Example app stub"
VIAddVersionKey FileVersion "0.0.0.0"
VIAddVersionKey ProductVersion "0.0.0.0"
VIAddVersionKey InternalName "AppName"
VIAddVersionKey LegalTrademarks ""
VIAddVersionKey OriginalFilename "AppName.exe"
;VIAddVersionKey PrivateBuild ""
;VIAddVersionKey SpecialBuild ""

;=== Runtime Switches
CRCCheck On
WindowIcon Off
SilentInstall Silent
AutoCloseWindow True
RequestExecutionLevel user
XPStyle on

; Best Compression
SetCompress Auto
SetCompressor /SOLID lzma
SetCompressorDictSize 32
SetDatablockOptimize On

;=== Program Icon
Icon "..\..\App\AppInfo\appicon.ico"

;=== Icon & Stye ===
BrandingText "PortableApps.com®"

;=== Languages
LoadLanguageFile "${NSISDIR}\Contrib\Language files\English.nlf"

Section "Main"
	MessageBox MB_OK|MB_ICONINFORMATION "AppName.exe is running and will close when you click OK. This is just an example stub app for inclusion with the PortableApps.com Template."
SectionEnd