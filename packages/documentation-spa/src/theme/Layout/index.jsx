/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";

import ThemeProvider from "@theme/ThemeProvider";
import UserPreferencesProvider from "@theme/UserPreferencesProvider";
import AnnouncementBar from "@theme/AnnouncementBar";
import Footer from "@theme/Footer";

import "@one-platform/opc-nav/dist/opc-nav";
import "@one-platform/opc-menu-drawer/dist/opc-menu-drawer";
import "@one-platform/opc-notification-drawer/dist/opc-notification-drawer";
import "@one-platform/opc-feedback/dist/opc-feedback";

import opcBase from "@one-platform/opc-base";
import "@one-platform/opc-base/dist/opc-provider";

import "./styles.css";

opcBase.configure({
  apiBasePath: process.env.REACT_APP_OPCBASE_API_BASE_PATH,
  subscriptionsPath: process.env.REACT_APP_OPCBASE_SUBSCRIPTION_BASE_PATH,
  keycloakUrl: process.env.REACT_APP_OPCBASE_KEYCLOAK_URL,
  keycloakClientId: process.env.REACT_APP_OPCBASE_KEYCLOAK_CLIENT_ID,
  keycloakRealm: process.env.REACT_APP_OPCBASE_KEYCLOAK_REALM,
});

function Providers({ children }) {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>{children}</UserPreferencesProvider>
    </ThemeProvider>
  );
}

function Layout(props) {
  const { siteConfig = {} } = useDocusaurusContext();
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
  } = props;
  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaImage = image || defaultImage;
  const metaImageUrl = useBaseUrl(metaImage, { absolute: true });
  const faviconUrl = useBaseUrl(favicon);

  return (
    <Providers>
      <Head>
        {/* TODO: Do not assume that it is in english language */}
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
      </Head>
      <opc-provider>
        <opc-nav></opc-nav>
        <opc-menu-drawer></opc-menu-drawer>
        <opc-notification-drawer></opc-notification-drawer>
        <opc-feedback theme="blue"></opc-feedback>
      </opc-provider>
      <AnnouncementBar />
      <div className="main-wrapper">{children}</div>
      {!noFooter && <Footer />}
    </Providers>
  );
}

export default Layout;
