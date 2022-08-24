---
id: overview
title: What is User Group Service
slug: /user-group
sidebar_label: Overview
---

# Overview

User group service acts as the primary pillar for obtaining enterprise user information for the one platform. This service uses organizational data sources like Rover/LDAP.

## Features

1. View User details such as User information, LDAP groups, etc.
2. Create and Manage User Groups (independent of ldap groups)
3. Create and Manage Service Accounts / API Keys

## Data sources

User Groups Service uses LDAP / Rover as the primary Data Source for syncing user data. But instead of duplicating the entire user directory from LDAP / Rover, it stores the data on a request basis. So whenever someone makes a request for a user, and that user does not exist in the local cache of the service, it will fetch the data from LDAP / Rover.

At the same time, to keep the cache up-to-date, it periodically checks for any updates to the user data and syncs the cache with LDAP / Rover.
