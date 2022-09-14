/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import clsx from "clsx";
import ErrorBoundary from "@docusaurus/ErrorBoundary";
import Head from "@docusaurus/Head";
import {
  ThemeClassNames,
  useKeyboardNavigation,
} from "@docusaurus/theme-common";
import useBaseUrl from "@docusaurus/useBaseUrl";
import SkipToContent from "@theme/SkipToContent";
import AnnouncementBar from "@theme/AnnouncementBar";
import Navbar from "@theme/Navbar";
import Footer from "@theme/Footer";
import LayoutProviders from "@theme/LayoutProviders";
import ErrorPageContent from "@theme/ErrorPageContent";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

import * as Sentry from "@sentry/react";
import siteConfig from "@generated/docusaurus.config";
import pkg from "../../../package.json";

// As these modules uses window object, build fails with error window is not defined in server part
// To avoid this dyanmic importing is done with a check on dom is active
if (ExecutionEnvironment.canUseDOM) {
  import("@one-platform/opc-base").then((opcBase) => {
    opcBase.default.configure({
      apiBasePath: siteConfig.customFields.opcBaseAPIBasePath,
      subscriptionsPath: siteConfig.customFields.opcBaseSubscriptionPath,
      keycloakUrl: siteConfig.customFields.opcBaseKeycloakURL,
      keycloakClientId: siteConfig.customFields.opcBaseKeycloakClientID,
      keycloakRealm: siteConfig.customFields.opcBaseKeycloakRealm,
    });
  });

  import("@one-platform/opc-nav/dist/opc-nav");
  import("@one-platform/opc-menu-drawer/dist/opc-menu-drawer");
  import("@one-platform/opc-notification-drawer/dist/opc-notification-drawer");
  import("@one-platform/opc-feedback/dist/opc-feedback");

  import("@one-platform/opc-base/dist/opc-provider");
}

import "./styles.css";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: siteConfig.customFields.REACT_APP_SENTRY_DSN,
    release: `op-documentation-spa@${pkg.version}`,
    environment: "production",
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

function Layout(props) {
  const {
    favicon,
    title: siteTitle,
    themeConfig: { image: defaultImage },
    url: siteUrl,
  } = siteConfig;
  const {
    children,
    title,
    noFooter,
    description,
    image,
    keywords,
    permalink,
    version,
    wrapperClassName,
  } = props;
  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaImage = image || defaultImage;
  const metaImageUrl = useBaseUrl(metaImage, { absolute: true });
  const faviconUrl = useBaseUrl(favicon);
  useKeyboardNavigation();

  return (
    <LayoutProviders>
      <Head>
        <html lang="en" />

        {metaTitle && <title>{metaTitle}</title>}
        {metaTitle && <meta property="og:title" content={metaTitle} />}
        {favicon && <link rel="shortcut icon" href={faviconUrl} />}
        {description && <meta name="description" content={description} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {version && <meta name="docsearch:version" content={version} />}
        {keywords && keywords.length && (
          <meta name="keywords" content={keywords.join(",")} />
        )}
        {metaImage && <meta property="og:image" content={metaImageUrl} />}
        {metaImage && <meta property="twitter:image" content={metaImageUrl} />}
        {metaImage && (
          <meta name="twitter:image:alt" content={`Image for ${metaTitle}`} />
        )}
        {permalink && <meta property="og:url" content={siteUrl + permalink} />}
        {permalink && <link rel="canonical" href={siteUrl + permalink} />}
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="module"
          src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/5.5.0/ionicons/ionicons.esm.js"
        ></script>
        <script
          nomodule=""
          src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/5.2.3/ionicons/ionicons.js"
        ></script>
      </Head>
      <opc-provider>
        <opc-nav></opc-nav>
        <opc-menu-drawer></opc-menu-drawer>
        <opc-notification-drawer></opc-notification-drawer>
        <opc-feedback theme="blue"></opc-feedback>
      </opc-provider>
      <SkipToContent />
      <Navbar />

      <AnnouncementBar />

      <div className={clsx(ThemeClassNames.wrapper.main, wrapperClassName)}>
        <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
          {children}
        </ErrorBoundary>
      </div>

      {!noFooter && <Footer />}
    </LayoutProviders>
  );
}

export default Layout;
