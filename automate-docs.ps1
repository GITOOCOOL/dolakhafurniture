# automate-docs.ps1
Write-Host "Updating Project Maps..." -ForegroundColor Cyan

# 1. Generate Root Tree
tree /f /a | findstr /v /i "node_modules .next .sanity .git" > tree.txt

# 2. Generate Web Tree
if (Test-Path "web") {
    Set-Location web
    tree /f /a | findstr /v /i "node_modules .next .git" > tree.txt
    Set-Location ..
}

# 3. Add changes to Git
git add tree.txt web/tree.txt AGENTS.md

# 4. Commit if there are changes
$status = git status --porcelain
if ($status) {
    Write-Host "Changes detected. Committing documentation..." -ForegroundColor Yellow
    git commit -m "docs: auto-update project maps and AGENTS.md status"
} else {
    Write-Host "No documentation changes needed." -ForegroundColor Green
}
