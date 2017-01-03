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

# Create resource group if it doesn't already exist
if(!$resourceGroup){
  Write-Host "Resource group named" $resourceGroupName "does not exist - now creating it"
  $resourceGroup = New-AzureRmResourceGroup -Name $resourceGroupName -Location $location
}

$workspaceCollectionName = "wingtip-sales"
$workspaceCollection = Get-AzureRmPowerBIWorkspaceCollection -ResourceGroupName $resourceGroupName -WorkspaceCollectionName $workspaceCollectionName -ErrorAction Ignore

# Create new workspace collection if it doesn't already exist
if(!$workspaceCollection){
  Write-Host "Workspace collection named" $workspaceCollectionName "does not exist - now creating it"
  $workspaceCollection = New-AzureRmPowerBIWorkspaceCollection -ResourceGroupName $resourceGroupName -WorkspaceCollectionName $workspaceCollectionName -Location $location
}

Write-Host
Write-Host "Workspace Collection Name: " + $workspaceCollection.Name
Write-Host "Workspace Collection Location: " + $workspaceCollection.Location
Write-Host "Workspace Collection ID: " + $workspaceCollection.Id
Write-Host

# get access key for workspace collection
$keys = Get-AzureRmPowerBIWorkspaceCollectionAccessKeys -ResourceGroupName $resourceGroupName -WorkspaceCollectionName $workspaceCollectionName
$accessKey = $keys[0].Value

Write-Host
Write-Host "Access Key: " $accessKey 
Write-Host
Write-Host
Write-Host

# determine if there are any workspaces in this workspace collection
$workspaces = Get-AzureRmPowerBIWorkspace -ResourceGroupName $resourceGroupName -WorkspaceCollectionName $workspaceCollectionName

if($workspaces) {
    Write-Host "Workspaces in this worksapce collection"
    $workspaces | Format-List Name, Id
}
else {
    Write-Host "This workspace collection has no workspaces."
}