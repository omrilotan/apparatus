[[ -s "dist" ]] || mkdir dist
[ "$(ls -A dist)" ] && rm dist/*
zip -9 -r dist/apparatus.zip ./ -x dist/ screenshots/ screenshots/* pack.sh readme.md *.git* .gitignore .DS_Store
echo -e "\nSaved in \"dist/apparatus.zip\"\n"