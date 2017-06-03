[[ -s "pack" ]] || mkdir pack
[ "$(ls -A pack)" ] && rm pack/*
zip -9 -r pack/extension.zip src -x .DS_Store
echo -e "\nSaved in \"pack/extension.zip\"\n"
