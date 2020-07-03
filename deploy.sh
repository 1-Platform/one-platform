#!/bin/sh
## Usage: npm run deploy <PackageType[spa/service]> <PackageName> <PackagePath> <DeploymentEnv[qa/stage]> <RefValue>
## Author: Sayak Sarkar <sayak.bugsmith@gmail.com>
## Version: 0.1.0
##

EXP_SYNTAX="Expected Syntax: npm run deploy <PackageType[spa/service]> <PackageName> <PackagePath> <DeploymentEnv[qa/stage]> <RefValue>"
SEPARATOR1="=================================================================================="
SEPARATOR2="----------------------------------------------------------------------------------"

check_spashiprc() {
    if [ ! -e ~/.spashiprc.yml ]; then
        printf "\n%s\nError: spashiprc missing from $HOME\n" "$SEPARATOR2"
        printf "\nCheck https://tinyurl.com/ybh248uo or https://spaship.io for details on how to configure spashiprc.\n%s\n\n" "$SEPARATOR2"
        exit 2
    fi
}

parse_params() {
    # Validate syntax parameters length and execute accordingly.
    if [ $# -lt 5 ];
    then
        # Throw syntax error and exit
        printf "\n%s\nError: Arguments Missing!\n\n" "$SEPARATOR2"
        printf "%s\n%s\n" "$EXP_SYNTAX" "$SEPARATOR2"
        exit 2
    else
        execute_params $1 $2 $3 $4 $5
    fi
}

execute_params() {
    # Map parameters to variables
    PKG_TYPE=$1
    PKG_NAME=$2
    PKG_PATH=$3
    ENV_NAME=$4
    REF_VAL=$5

    parse_package_type $PKG_TYPE $PKG_NAME $PKG_PATH $ENV_NAME $REF_VAL
}

parse_package_type() {
    # Check package type
    if [ "$PKG_TYPE" = 'spa' ]
    then
        deploy_spa $PKG_TYPE $PKG_NAME $PKG_PATH $ENV_NAME $REF_VAL
    else
        if [ "$PKG_TYPE" = 'service' ]
        then
            printf "\n%s\nOops! We haven't yet gotten around to support Service deployments! :(\n%s\n" "$SEPARATOR2" "$SEPARATOR2"
            exit 1
        else
            printf "\n%s\nParameter Input Error: Incorrect package type. Package type can only be 'spa' or 'service'.\n%s\n" "$SEPARATOR2" "$SEPARATOR2"
            exit 2
        fi
    fi
}

deploy_spa() {
    # Generate SPA Name
    SPA_NAME="op-"${2%-spa}

    printf "\nInitiating deployment process for %s...\n%s\n" "$SPA_NAME" "$SEPARATOR1"

    access_package_directory
    execute_build
    access_build_directory
    generate_spaship_config
    compress_build
    deploy_to_spaship
}

access_package_directory() {
    # Enter package directory
    cd packages/$PKG_NAME 2> /dev/null
    if [ $? -eq 0 ]; then
        printf "\nStarting %s build...\n%s\n" "$PKG_NAME" "$SEPARATOR2"
    else
        printf "\nError: Could not access directory: %s%s%s\n%s\n" "${PWD##*/}" "/packages/" "$PKG_NAME" "$SEPARATOR2"
        exit 1
    fi
}

execute_build() {
    # Execute npm build script
    npm run build
    if [ $? -eq 0 ]; then
        printf "\n%s\nSuccess: %s Built Successfully!\n" "$SEPARATOR2" "$PKG_NAME"
    else
        printf "\n%s\nError: %s Build Failed! Check NPM logs above.\n%s\n" "$SEPARATOR2" "$PKG_NAME" "$SEPARATOR2"
        exit 1
    fi
}

access_build_directory() {
    # Enter build directory
    cd dist 2> /dev/null
    if [ $? -ne 0 ]; then
        printf "\n%s\nError: Could not access build directory: %s%s\n%s\n" "${PWD##*/}" "/dist/" "$SEPARATOR2"
        exit 1
    fi
}

generate_spaship_config() {
     # Initialize SPAship config
    printf "\nGenerating SPAship configuration...\n%s\n" "$SEPARATOR2"
    spaship init --name=$SPA_NAME --path=$PKG_PATH --single --overwrite
    if [ $? -eq 0 ]; then
        printf "\nSPAship Configuration Details:\n\n"
        cat spaship.yaml
        printf "%s\n" "$SEPARATOR2"
    else
        printf "\n%s\nError: SPAship configuration failed! Check error logs above.\n%s\n" "$SEPARATOR2" "$SEPARATOR2"
        exit 1
    fi
}

compress_build() {
    # Compress build files to a zip package
    printf "\nPackaging build files...\n%s\n" "$SEPARATOR2"
    zip -r $SPA_NAME.zip .
    if [ $? -eq 0 ]; then
        printf "\n%s\nBuild compressed and packaged successfully!\n\nPackage file details:\n" "$SEPARATOR2"
        file $SPA_NAME.zip
        printf "%s\n" "$SEPARATOR2"
    else
        printf "\n%s\nError: Build compression and packaging failed! Check error logs above.\n%s\n" "$SEPARATOR2" "$SEPARATOR2"
        exit 1
    fi
}

deploy_to_spaship() {
    # Deploy to SPAship
    printf "\nDeploying package to SPAship...\n%s\n" "$SEPARATOR2"
    printf "\n"
    spaship deploy --env=$ENV_NAME --ref=$REF_VAL $SPA_NAME.zip
    printf "\n%s\n" "$SEPARATOR1"
    exit 1
}

# Main script to initiate execution.
check_spashiprc
parse_params $1 $2 $3 $4 $5
