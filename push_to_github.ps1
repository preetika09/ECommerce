Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Pushing ShopVerse Project to GitHub..." -ForegroundColor Cyan
Write-Host "Repository: https://github.com/preetika09/ECommerce.git" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan

git init
git remote remove origin 2>$null
git remote add origin https://github.com/preetika09/ECommerce.git
git add .
git commit -m "Initial commit - ShopVerse Full Stack E-Commerce Web Application"
git branch -M main
git push -u origin main

Write-Host "================================================" -ForegroundColor Green
Write-Host "Done!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
