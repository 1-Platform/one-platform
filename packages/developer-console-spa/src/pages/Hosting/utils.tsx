import { Link } from "react-router-dom";

export const headerLinks = [
  <Link key="api-keys" className="pf-u-color-100" to="#">
    <ion-icon
      name="settings-outline"
      style={{ marginRight: '.5rem' }}
    ></ion-icon>
    Manage API Keys
  </Link>
];
