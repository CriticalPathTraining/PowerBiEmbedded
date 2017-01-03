# Set-PSRepository -Name PSGallery -InstallationPolicy Trusted
# Install-Module -Name AzureRM.PowerBIEmbedded

cls


$tenantName = "YOUR_TENANT"
$tenantAdminAccountName = "YOUR_ADMIN_ACCOUNT"
$tenantDomain = $tenantName + ".onMicrosoft.com"
$tenantAdminSPN = $tenantAdminAccountName + "@" + $tenantDomain

$password = "YOUR_PASSWORD"
$securePassword = ConvertTo-SecureString –String $password –AsPlainText -Force
$credential = New-Object –TypeName System.Management.Automation.PSCredential `
                         –ArgumentList $tenantAdminSPN, $securePassword

# $credential = Get-Credential -UserName $tenantAdminSPN -Message "Enter password"


Login-AzureRmAccount -Credential $credential | Out-Null

$location = "southcentralus" 

$resourceGroupName = "powerbi-demo"

$resourceGroup = Get-AzureRmResourceGroup -Name $resourceGroupName -ErrorAction Ignore

# Create resource group if it does't exist
if(!$resourceGroup){
  Write-Host "Resource group named" $resourceGroupName "does not exist - now creating it"
  $resourceGroup = New-AzureRmResourceGroup -Name $resourceGroupName -Location $location
}

$workspaceCollectionName = "wingtip-sales"
$workspaceCollection = Get-AzureRmPowerBIWorkspaceCollection -ResourceGroupName $resourceGroupName -WorkspaceCollectionName $workspaceCollectionName -ErrorAction Ignore


# Create workspace collection if it does't exist
if(!$workspaceCollection){
  Write-Host "Workspace collection named" $workspaceCollectionName "does not exist - now creating it"
  $workspaceCollection = New-AzureRmPowerBIWorkspaceCollection -ResourceGroupName $resourceGroupName -WorkspaceCollectionName $workspaceCollectionName -Location $location
}

$keys = Get-AzureRmPowerBIWorkspaceCollectionAccessKeys -ResourceGroupName $resourceGroupName -WorkspaceCollectionName $workspaceCollectionName
$accessKey = $keys[0].Value

# determine if there are any workspaces in this workspace collection
$workspaces = Get-AzureRmPowerBIWorkspace -ResourceGroupName $resourceGroupName -WorkspaceCollectionName $workspaceCollectionName

if(!$workspaces) {
    Write-Host "This workspace collection has no workspaces. Creating new workspace..."
    powerbi create-workspace -c $workspaceCollectionName -k $accessKey
    $workspaces = Get-AzureRmPowerBIWorkspace -ResourceGroupName $resourceGroupName -WorkspaceCollectionName $workspaceCollectionName
}

$workspace = $workspaces[0].Name

Write-Host "Importing PBIX file into workspace with name of $workspace ..."

$pbixFilePath = "C:\PowerBIEmbedded\NorthwindRetro.pbix" 
$reportName = "Wingtip Sales"

$importResult = powerbi import -c $workspaceCollectionName -k $accessKey -w $workspace -f $pbixFilePath -n $reportName

$createEmbedTokenResult = powerbi create-embed-token -c $workspaceCollectionName -w $workspace -r $reportName -k $accessKey 


Write-Host 
Write-Host 
Write-Host "PBIX Import information"
Write-Host "-----------------------"
$importResult 
Write-Host 
Write-Host 
Write-Host "Embed Token"
Write-Host "-----------"
$createEmbedTokenResult 

