@echo off
echo ================================================
echo Pushing ShopVerse Project to GitHub...
echo Repository: https://github.com/preetika09/ECommerce.git
echo ================================================

git init
git remote remove origin 2>nul
git remote add origin https://github.com/preetika09/ECommerce.git
git add .
git commit -m "Initial commit - ShopVerse Full Stack E-Commerce Web Application"
git branch -M main
git push -u origin main

echo ================================================
echo Done!
echo ================================================
pause
