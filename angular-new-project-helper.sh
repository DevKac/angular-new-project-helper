set -e
# used to load and read parameters
for i in "$@"
do
case $i in
  -p=*|--path=*)
    TARGETPATH="${i#*=}"
    shift # past argument=value
  	;;
  -s=*|--style=*)
    TARGETSTYLE="${i#*=}"
    shift # past argument=value
  	;;
  --default)
    DEFAULT=YES
    shift # past argument with no value
    ;;
  *)
    # unknown option
    ;;
	esac
done

if [ -v TARGETPATH ]
then
	echo "Helper will now copy all starting files to your solution"; 
	
	# Navigate to given directory
	HELPERPATH=$PWD
	cd "$TARGETPATH"
	# echo "Downloading font-awesome"
	npm install --save font-awesome angular-font-awesome
	# echo "Downloaded font-awesome"

	# echo "Downloading ngx-translate"
	npm install --save @ngx-translate/core @ngx-translate/http-loader
	mkdir -p "src/assets/i18n/"
	cp "$HELPERPATH/data/assets/i18n/en.json" "$PWD/src/assets/i18n/en.json"
	cp "$HELPERPATH/data/assets/i18n/pl.json" "$PWD/src/assets/i18n/pl.json"
	# echo "Downloaded ngx-translate"

	# echo "Creating shared.service.ts"
	ng g service app-shared/shared
	cp "$HELPERPATH/data/app-shared/shared.service.ts" "$PWD/src/app/app-shared/shared.service.ts"
	# echo "Created shared.service.ts"

	# echo "Creating config.ts"
	cp "$HELPERPATH/data/app-shared/config.ts" "$PWD/src/app/app-shared/config.ts"
	# echo "Created config.ts"

	# echo "Creating abstracts"
	mkdir -p "src/app/app-shared/abstracts/"

	# echo "Creating basic-component.ts"
	cp "$HELPERPATH/data/app-shared/abstracts/basic-component.ts" "$PWD/src/app/app-shared/abstracts/basic-component.ts"
	# echo "Created basic-component.ts"

	# echo "Creating basic-object.ts"
	cp "$HELPERPATH/data/app-shared/abstracts/basic-object.ts" "$PWD/src/app/app-shared/abstracts/basic-object.ts"
	# echo "Created basic-object.ts"

	# echo "Creating basic-service.ts"
	cp "$HELPERPATH/data/app-shared/abstracts/basic-service.ts" "$PWD/src/app/app-shared/abstracts/basic-service.ts"
	# echo "Created basic-service.ts"

	# echo "Created abstracts"

	# echo "Creating alerts"
	mkdir -p "src/app/app-shared/alerts/"
	cp "$HELPERPATH/data/app-shared/alerts/basic-message.ts" "$PWD/src/app/app-shared/alerts/basic-message.ts"

	# echo "Creating error alert"
	ng g component app-shared/alerts/error
	cp "$HELPERPATH/data/app-shared/alerts/error/error.component.html" "$PWD/src/app/app-shared/alerts/error/error.component.html"
	cp "$HELPERPATH/data/app-shared/alerts/error/error.component.ts" "$PWD/src/app/app-shared/alerts/error/error.component.ts"
	if [ -v TARGETSTYLE ]
	then
		sed -i "s/error.component.css/error.component.$TARGETSTYLE/g" "$PWD/src/app/app-shared/alerts/error/error.component.ts"
	fi
	# echo "Created error alert"

	# echo "Creating loading alert"
	ng g component app-shared/alerts/loading
	cp "$HELPERPATH/data/app-shared/alerts/loading/loading.component.html" "$PWD/src/app/app-shared/alerts/loading/loading.component.html"
	cp "$HELPERPATH/data/app-shared/alerts/loading/loading.component.ts" "$PWD/src/app/app-shared/alerts/loading/loading.component.ts"
	if [ -v TARGETSTYLE ]
	then
		sed -i "s/loading.component.css/loading.component.$TARGETSTYLE/g" "$PWD/src/app/app-shared/alerts/loading/loading.component.ts"
	fi
	# echo "Created loading alert"

	# echo "Creating success alert"
	ng g component app-shared/alerts/success
	cp "$HELPERPATH/data/app-shared/alerts/success/success.component.html" "$PWD/src/app/app-shared/alerts/success/success.component.html"
	cp "$HELPERPATH/data/app-shared/alerts/success/success.component.ts" "$PWD/src/app/app-shared/alerts/success/success.component.ts"
	if [ -v TARGETSTYLE ]
	then
		sed -i "s/success.component.css/success.component.$TARGETSTYLE/g" "$PWD/src/app/app-shared/alerts/success/success.component.ts"
	fi
	# echo "Created success alert"

	# echo "Created alerts"

	# echo "Creating proxy"
	cp "$HELPERPATH/data/proxy.conf.json" "$PWD/proxy.conf.json"
	# echo "Created proxy"

	# echo "Update README"
	cat "$HELPERPATH/README.md" >> "$PWD/README.md"
	# echo "Updated README"

	echo "Helper finished copying starting files to your solution. A number of manual changes are needed, check Post-install requirements chapter in your README.md file!";
else
	echo "Path (-p) needs to be specified!";  
fi
