#!/bin/sh
ng build --c=qa --base-href /feedback/
cd dist/feedback
spaship init --name=op-feedback --path=/feedback --single --overwrite
zip -r op-feedback.zip .
spaship deploy --env=opqa --ref=0.1.0 op-feedback.zip
cd ../../
