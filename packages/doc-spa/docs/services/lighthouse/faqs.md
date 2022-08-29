---
id: faqs
title: Lighthouse FAQs
slug: /lighthouse/faqs
sidebar_label: FAQs
---

# FAQ

> Can I get a weekly report about our project’s progress?

Lighthouse service right now doesn’t support this feature yet. We provide the ability to export the data from the spa. We will soon work on this with our new reporting service,

> Why does the performance score vary in my Lighthouse audits?

Performance is a very relative metric as it depends on the auditing server. To avoid performance error lighthouse executes it multiple times and averages it. There will be still errors, due to server load

> How to audit an app if its protected by a login?

In Lighthouse configuration we can setup puppeteer script to bypass the login
