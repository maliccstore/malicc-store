import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./index.module.css";

const sidebarItems = [
  { label: "API Overview", active: true },
  { label: "Services", href: "/docs/api" },
  { label: "Store", href: "/docs/api" },
  { label: "Types", href: "/docs/api" },
  { label: "Utils", href: "/docs/api" },
];

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const handleNavigate = (href: string) => () => {
    window.location.href = href;
  };

  return (
    <Layout
      title={siteConfig.title}
      description="Modern API reference and developer documentation for Malicc Store."
    >
      <div className={styles.pageShell}>
        <div className={styles.pageFrame} />

        <div className={styles.workspace}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <p className={styles.sidebarTitle}>Navigation</p>
              <span className={styles.badge}>Pro</span>
            </div>
            <div className={styles.sidebarDescription}>
              Explore frontend API sections and generated docs.
            </div>
            <div className={styles.sectionList}>
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={handleNavigate(item.href)}
                  className={
                    item.active
                      ? `${styles.sectionLink} ${styles.activeSection}`
                      : styles.sectionLink
                  }
                >
                  <span className={styles.sectionBullet} />
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          <main className={styles.mainContent}>
            <div className={styles.heroCard}>
              <div className={styles.headlineRow}>
                <span className={styles.miniLabel}>API Reference</span>
                <span className={styles.statusPill}>Live</span>
              </div>
              <h1 className={styles.pageHeading}>API Reference</h1>
              <p className={styles.pageSubtitle}>
                Auto-generated frontend documentation for Malicc Store's
                services, store utilities, types, and helper functions.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryCta} to="/docs/api">
                  Browse API docs
                </Link>
                <Link className={styles.secondaryCta} to="/blog">
                  Read release notes
                </Link>
              </div>
            </div>

            <section className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <div>
                  <p className={styles.detailTitle}>Modules</p>
                  <p className={styles.detailSubtitle}>
                    The API reference is organized into core frontend modules.
                  </p>
                </div>
                <div className={styles.modulePill}>Updated now</div>
              </div>

              <ul className={styles.moduleList}>
                <li>
                  <span>Services</span>
                  <p>API calls & business logic</p>
                </li>
                <li>
                  <span>Store</span>
                  <p>State management</p>
                </li>
                <li>
                  <span>Types</span>
                  <p>TypeScript interfaces</p>
                </li>
                <li>
                  <span>Utils</span>
                  <p>Helper functions</p>
                </li>
              </ul>
            </section>

            <section className={styles.codePanel}>
              <div className={styles.codeHeader}>
                <p className={styles.codeTitle}>Sample API call</p>
                <span className={styles.codeMeta}>TypeScript</span>
              </div>
              <pre className={styles.codeBlock}>
                <code>{`import { productService } from '@malicc-store/services';

const product = await productService.getProductById('123');
console.log(product);`}</code>
              </pre>
            </section>
          </main>
        </div>
      </div>
    </Layout>
  );
}
