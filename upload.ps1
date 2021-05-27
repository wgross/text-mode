@"
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} -s [OR]
RewriteCond %{REQUEST_FILENAME} -l [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^.*$ - [NC,L]

RewriteRule ^(.*) /index.html [NC,L]
"@ | Out-File -Path $PSScriptRoot\dist\text-mode\.htaccess

Sync-RCloneRemote $PSScriptRoot\dist\text-mode -RemoteName text-mode -RemotePath '/' -Verbose
