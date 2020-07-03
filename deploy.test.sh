#!node_modules/bats/bin/bats

skip_without_spashiprc() {
    # Check if spashiprc exists
    if [ ! -e ~/.spashiprc.yml ]; then
        skip "spashiprc missing: Skipping test case."
    fi
}

@test "0. Script should check for the existence of spashiprc" {
    validate_spashiprc() {
        run ./deploy.sh
        [ "$status" -eq 2 ]
        [ "${lines[1]}" = "Error: spashiprc missing from $HOME" ]
        [ "${lines[2]}" = "Check https://tinyurl.com/ybh248uo or https://spaship.io for details on how to configure spashiprc." ]
    }

    if [ -e ~/.spashiprc.yml ]; then
        mv ~/.spashiprc.yml ~/.spashiprc.yml.tst.bkp
        validate_spashiprc
        mv ~/.spashiprc.yml.tst.bkp ~/.spashiprc.yml
    else
        validate_spashiprc
    fi
}

@test "1. Syntax parameters length should not be less than 5" {
    skip_without_spashiprc
    run ./deploy.sh
    [ "$status" -eq 2 ]
    [ "${lines[1]}" = "Error: Arguments Missing!" ]
    [ "${lines[2]}" = "Expected Syntax: npm run deploy <PackageType[spa/service]> <PackageName> <PackagePath> <DeploymentEnv[qa/stage]> <RefValue>" ]
}

@test "2. Package Type parameter can only be 'spa' or 'service" {
    skip_without_spashiprc
    run ./deploy.sh other dummyPackage /dummy qa 0.0.0
    [ "$status" -eq 2 ]
    [ "${lines[1]}" = "Parameter Input Error: Incorrect package type. Package type can only be 'spa' or 'service'." ]
}

@test "3. Package Type parameter 'service' should return exit code 1 since it isn't yet supported" {
    skip_without_spashiprc
    run ./deploy.sh service dummyService /dummy qa 0.0.0
    [ "$status" -eq 1 ]
    [ "${lines[1]}" = "Oops! We haven't yet gotten around to support Service deployments! :(" ]
}

@test "4. PackageNames should generate appropriate PKG_NAME and Non-existent Packages should throw directory access error." {
    skip_without_spashiprc
    run ./deploy.sh spa dummyspa /dummy qa 0.0.0
    [ "$status" -eq 1 ]
    [ "${lines[0]}" = "Initiating deployment process for op-dummyspa..." ]
    [ "${lines[2]}" = "Error: Could not access directory: one-platform/packages/dummyspa" ]
}
