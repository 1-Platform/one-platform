import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: "Microservices",
    imageUrl: "img/op_document_illustration_micoservice.svg",
    description: (
      <>
        One Platform Microservices were designed from the ground up to be
        modular, independent, easy to use and greatly extensible to get your SPA
        up and running quickly.
      </>
    ),
  },
  {
    title: "Single Page Applications",
    imageUrl: "img/op_document_illustration_application.svg",
    description: (
      <>
        One Platform lets you focus on your application's core logic, and while
        it takes care of the rest. One Platform offerings can be used in a
        number of ways, including SSI and reusable components.
      </>
    ),
  },
  {
    title: "Component Library",
    imageUrl: "img/op_document_illustration_component_lib.svg",
    description: (
      <>
        The OP Component Library provides a set of reusable brand compliant
        components that can be extended and used by any hosted Application to
        extend or customize it's visual appearance.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Develop fast · Deliver faster`}
      description="{siteConfig.tagline}"
    >
      <header className={clsx("hero hero--secondary", styles.heroBanner)}>
        <div className="container">
          <p className="hero__title">
            Develop fast · <span>Deliver faster</span>
          </p>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--red button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
