#!node_modules/bats/bin/bats

@test "1. Syntax parameters length should not be less than 5" {
    run ./deploy.sh
    [ "$status" -eq 2 ]
    [ "${lines[0]}" = "Error: Arguments Missing!" ]
    [ "${lines[1]}" = "Expected Syntax: npm run deploy <PackageType[spa/service]> <PackageName> <PackagePath> <DeploymentEnv[qa/stage]> <RefValue>" ]
}

@test "2. Package Type parameter can only be 'spa' or 'service" {
    run ./deploy.sh other dummyPackage /dummy qa 0.0.0
    [ "$status" -eq 2 ]
    [ "${lines[1]}" = "Parameter Input Error: Incorrect package type. Package type can only be 'spa' or 'service'." ]
}

@test "3. Package Type parameter 'service' should return exit code 1 since it isn't yet supported" {
    run ./deploy.sh service dummyService /dummy qa 0.0.0
    [ "$status" -eq 1 ]
    [ "${lines[1]}" = "Oops! We haven't yet gotten around to support Service deployments! :(" ]
}

@test "4. Non-existent PackageNames should generate appropriate PKG_NAME and also throw directory access error." {
    run ./deploy.sh spa dummyspa /dummy qa 0.0.0
    [ "$status" -eq 1 ]
    [ "${lines[0]}" = "Initiating deployment process for op-dummyspa..." ]
    [ "${lines[2]}" = "Error: Could not access directory: one-platform/packages/dummyspa" ]
}
