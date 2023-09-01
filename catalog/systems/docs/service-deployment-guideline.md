---
id: service-deployment-guideline
title: OP Service Deployment Guideline
slug: /deployments/service
sidebar_label: Service Guideline
---

This document shares the steps on how we can deploy the microservice on the kubernetes cluster in the openshift environment.

## Workflow

1. Once the PR/ MR is merged, run the github actions configured with the repository with proper tags.
2. Github actions containerizes the code and pushes images to the Github Container Registry(GHCR).
3. Once Image is published in GHCR, update the imagestreams of the respective microservice in OpenShift.
4. Roll out the microservice deployment and restart the One Platform API Gateway if required.
5. Now your changes are live now

## Building an Image

1. For building the image after PR navigate to GIthub Actions and select the action you want to perform. Trigger the run workflow button for the action which you have selected.
2. Once the GitHub action is completed you will be able to see the new/updated image on the packages section of the One Platform repository.

![GH Workflow Trigger](/img/service-deploymeny-guide/step1.png)

3. Details of the new/updated image is available over the package page over the GitHub repository with the history of the update.

![GH Workflow Progress](/img/service-deploymeny-guide/step2.png)

4. Login to the Openshift Console and copy the login command with oc CLI.

```sh
oc login --token=token-test --server=https://test.openshiftapps.com:6442
```

![GH Workflow History](/img/service-deploymeny-guide/step3.png)

5. Switch to the project in openshift to update the imagestream.

```sh
oc project <project-name>
```

6. Update the imagestream with a new image.

```sh
oc import-image <image-name>:<tagname>
```

7. Under the imagestreams section of the openshift web ui you can see that the new image has rolled out.
8. Navigate to respective Deployment config and redeploy the microservice to update what changes through web UI
