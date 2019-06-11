# log into Azure AD
$userName = "user1@MY_TENANT.onMicrosoft.com"
$password = ""

$securePassword = ConvertTo-SecureString –String $password –AsPlainText -Force
$credential = New-Object –TypeName System.Management.Automation.PSCredential `
                         –ArgumentList $userName, $securePassword

$authResult = Connect-AzureAD -Credential $credential

$adSecurityGroupName = "Power BI Apps"

$adSecurityGroup = 
`New-AzureADGroup `
    -DisplayName $adSecurityGroupName `
    -SecurityEnabled $true `
    -MailEnabled $false `
    -MailNickName notSet

$adSecurityGroup | Format-Table DisplayName, ObjectId