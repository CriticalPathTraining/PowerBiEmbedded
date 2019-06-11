Clear-Host
$userName = "user1@MY_TENANT.onMicrosoft.com"
$password = ""

$securePassword = ConvertTo-SecureString –String $password –AsPlainText -Force
$credential = New-Object –TypeName System.Management.Automation.PSCredential `
                         –ArgumentList $userName, $securePassword

$authResult = Connect-AzureAD -Credential $credential

$powerBiServiceAppId = "00000009-0000-0000-c000-000000000000"
$powerBiService = Get-AzureADServicePrincipal -All $true | Where-Object {$_.AppId -eq $powerBiServiceAppId}

$outputFile = "$PSScriptRoot\PowerBiServicePermissions.txt"

"--- Power BI Service API Delegated Permissions (Scopes)---" | Out-File -FilePath $outputFile
$powerBiService.Oauth2Permissions | Sort-Object Type, Value | Format-Table Type, Value, Id | Out-File -FilePath $outputFile -Append

"--- Application Permissions (AppRoles) ---" | Out-File -FilePath $outputFile -Append
$powerBiService.AppRoles | Sort-Object Type, Value | Format-Table Value, Id, DisplayName | Out-File -FilePath $outputFile -Append

Notepad $outputFile