import { LitElement, html, TemplateResult, render } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { pipe, subscribe } from "wonka";
import { ref, Ref, createRef } from "lit/directives/ref.js";
import dayjs from "dayjs";
import PfeToast from "@patternfly/pfe-toast/dist/pfe-toast.min.js";

import styles from "./opc-provider.styles";

import "../components/opc-loader/opc-loader";
import "../components/opc-toast/opc-toast";
import "../components/opc-drawer-footer/opc-drawer-footer";
import "../components/opc-menu-drawer/opc-avatar/opc-avatar";
import "../components/opc-notification-drawer/opc-filter-chip/opc-filter-chip";

import opcBase from "../opc-base/opc-base";

// api
import {
  CREATE_FEEDBACK,
  GET_APP_LIST,
  SUBSCRIBE_NOTIFICATION,
} from "../gql/opc-app-layout";
import {
  Apps,
  CreateFeedback,
  CreateFeedbackVariable,
  GetAppList,
} from "../gql/types";
import { subscriptionT } from 'wonka/dist/types/src/Wonka_types.gen';

import { APIService } from "../config/graphql";

import opLogo from "../assets/logo.svg";

import { Notification } from "./types";
import { OpcToast } from "../components/opc-toast/opc-toast";
import { ToastOptions } from "../components/opc-toast/types";
import { getNotificationAppCount } from "./opc-provider.helper";

@customElement("opc-provider")
export class OpcProvider extends LitElement {
  static styles = styles;
  @property({ reflect: true, type: Boolean }) isWarningHidden = true;

  @query(".opc-toast-container") toastContainer!: HTMLDivElement;

  @state() private opcNotificationDrawer!: any;
  @state() private opcMenuDrawer!: any;
  @state() private opcNavBar!: any;

  @state() private isLoading = true;
  @state() private searchValue = "";

  @state() private notifications: Notification[] = [];
  @state() private apps: Apps[] = [];

  @state() private selectedAppsForNotificationFilter: string[] = [];
  @state() private notificationAppCount: Record<string, number> = {};

  private _notificationsSubscription: subscriptionT | null = null;

  api!: APIService;

  constructor() {
    super();
    // register patternfly toast component
    new PfeToast();
    /**
     * obtain search value if seen in url
     * eg: /search?query="search"
     * onmount value search must be initialzed
     */
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.searchValue =
      (window.location.pathname === "/search" && urlParams.get("query")) || "";
  }

  /**
   * Inside constructor accessing template node may get failed because
   * constructor is called as soon as element is in html dom and the nested nodes may not have rendered yet
   * Using firstUpdated lifecycle this can be avoided as this function is only executed
   * after the entire template has been created, giving access to inside template nodes
   */
  firstUpdated() {
    opcBase.auth?.onLogin(async (user) => {
      const config = opcBase.config;

      if (!user) throw Error("user not found");

      // get the references to each component inside the opc-provider
      this.opcNavBar = this.querySelector("opc-nav");
      this.opcMenuDrawer = this.querySelector("opc-menu-drawer");
      this.opcNotificationDrawer = this.querySelector(
        "opc-notification-drawer"
      );

      const userDetails = [user.kerberosID, user.email, ...user.role];

      // inject business logic for all the components needed
      this.injectNav();
      this.injectOpcProviderFn();
      this.injectMenuDrawer();
      this.injectNotificationDrawer();
      this.injectFeedback();
      this.isLoading = false;

      this.api = new APIService({
        apiBasePath: config.apiBasePath,
        subscriptionsPath: config.subscriptionsPath,
        cachePolicy: config.cachePolicy,
      });

      // load the app list and notificatins for the user
      this.getAppListAndNotifications(userDetails).finally(() => {
        this.loadDrawerAppList(this.apps);
      });
      // subscribe to notifications
      this.handleNotificationSubscription(userDetails);
    });
  }

  /**
   * This function is called on top of constructor
   * It injects feedback and toast to window and opcBase
   */
  private injectOpcProviderFn() {
    window.OpNotification = {
      showToast: this.showToast.bind(this),
    } as any;
    /* MAGIC: Aliases for different toast variants */
    (
      ["success", "warn", "danger", "info"] as ToastOptions["variant"][]
    ).forEach((variant) => {
      window.OpNotification[variant] = (...args) => {
        if (args.length > 1) {
          args[1]!["variant"] = variant;
        } else {
          args.push({ variant });
        }
        this.showToast(...args);
      };
    });

    opcBase.toast = window.OpNotification;
    window.sendFeedback = this.sendFeedback.bind(this);
    opcBase.feedback = { sendFeedback: window.sendFeedback };
  }

  private injectNav() {
    // check
    if (!this.opcNavBar) {
      !this.isWarningHidden && console.warn("nav bar not found");
      return;
    }
    // links in navbar
    this.opcNavBar.links = [
      {
        href: " /get-started/docs",
        name: "Documentation",
      },
      {
        href: " /get-started/blog",
        name: "Blog",
      },
    ];

    // adding event listeners to nav button clicks
    this.opcNavBar.addEventListener("opc-nav-btn-menu:click", () => {
      this.opcMenuDrawer.open();
      this.opcNavBar.activeButton = "menu";
    });
    this.opcNavBar.addEventListener("opc-nav-btn-notification:click", () => {
      this.opcNotificationDrawer.open();
      this.opcNavBar.activeButton = "notification";
    });

    render(
      html` <style>
          opc-nav {
            --opc-nav-container__z-index: var(--opc-app-layout__nav-zIndex);
          }
          opc-menu-drawer {
            --opc-menu-drawer__z-index: var(--opc-app-layout__drawer-zIndex);
          }
          opc-notification-drawer {
            --opc-notification-drawer__z-index: var(
              --opc-app-layout__drawer-zIndex
            );
          }
          opc-feedback {
            --op-feedback__z-index: var(--opc-app-layout__feedback-zIndex);
          }
        </style>
        <opc-nav-search
          slot="opc-nav-search"
          value=${this.searchValue}
          @opc-nav-search:change=${(evt: any) =>
            (this.searchValue = evt.detail.value)}
          @opc-nav-search:submit=${(evt: any) =>
            (window.location.href = `/search?query=${evt.detail.value}`)}
        ></opc-nav-search>
        <a slot="opc-nav-logo" href="/">
          <img slot="" src="${opLogo}" height="30px" alt="logo" />
        </a>`,
      this.opcNavBar
    );
  }

  private injectMenuDrawer() {
    // check
    if (!this.opcMenuDrawer) {
      !this.isWarningHidden && console.warn("menu drawer not found");
      return;
    }
    this.opcMenuDrawer.menuTitle = this.userInfo?.fullName;

    this.opcMenuDrawer.addEventListener("opc-menu-drawer:close", () => {
      this.opcNavBar.activeButton = "";
    });

    // rendering avatar and footer for the drawer
    render(
      html`
        <opc-avatar slot="avatar">
          ${this.userInfo?.firstName.charAt(0)}
          ${this.userInfo?.lastName.charAt(0)}
        </opc-avatar>
        <button slot="menu" onclick="window.OpAuthHelper.logout()">
          Log Out
        </button>
      `,
      this.opcMenuDrawer
    );
  }

  private injectNotificationDrawer() {
    // check
    if (!this.opcNotificationDrawer) {
      !this.isWarningHidden && console.warn("notification drawer not found");
      return;
    }

    this.opcNotificationDrawer.addEventListener(
      "opc-notification-drawer:close",
      () => {
        this.opcNavBar.activeButton = "";
      }
    );

    // rendering drawer header for filter operations and footer
    render(
      html`
        <style>
          .p-4 {
            padding: 1rem;
          }
          .opc-notification-drawer__header-chip-group {
            margin-top: 0.5rem;
            display: flex;
            flex-wrap: wrap;
          }
          .opc-notification-drawer__header-chip-group
            opc-filter-chip:not(:last-child) {
            margin-right: 4px;
          }
        </style>
        <div
          slot="header-body"
          class="opc-notification-drawer__header-chip-group"
        ></div>
        <div class="opc-notification-item"></div>
        <div class="p-4" slot="footer">
          <opc-drawer-footer></opc-drawer-footer>
        </div>
      `,
      this.opcNotificationDrawer
    );
  }

  private injectFeedback() {
    // check
    const feedback = this.querySelector("opc-feedback");
    if (!feedback) {
      !this.isWarningHidden && console.warn("feedback component not found");
      return;
    }
    // adding event listeners on feedback component
    feedback.addEventListener("opc-feedback:submit", (event: any) => {
      event.detail.data.createdBy =
        window.OpAuthHelper?.getUserInfo()?.rhatUUID;
      window.sendFeedback(event.detail.data);
    });
  }

  private async getAppListAndNotifications(userDetails: string[]) {
    try {
      // get app and notifications from server
      const res = await this.api.gqlClient
        .query<GetAppList>(GET_APP_LIST, {
          targets: userDetails,
        })
        .toPromise();

      if ( !res?.data ) return;

      this.apps =
        res.data.appsList
          ?.slice()
          .sort((prev, next) =>
            prev.name?.toLowerCase() <= next.name?.toLowerCase() ? -1 : 1
          ) || [];
      this.notifications = res.data.notificationsList.map((notification) => ({
        ...notification,
        app: notification.config.source.name,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  private loadDrawerAppList(apps: Apps[]) {
    this.opcMenuDrawer.links = [
      {
        title: "Applications",
        isSearchable: true,
        links: apps
          .filter(({ applicationType }) => applicationType === "HOSTED")
          .map(({ name, path, isActive }) => ({
            name,
            href: path,
            isDisabled: !(isActive && Boolean(path)),
          })),
      },
      {
        title: "Built In Services",
        links: apps
          .filter(({ applicationType }) => applicationType === "BUILTIN")
          .map(({ name, path, isActive }) => ({
            name,
            href: path,
            isDisabled: !(isActive && Boolean(path)),
          })),
      },
    ];
  }

  private async handleNotificationSubscription(userDetails: string[]) {
    try {
      if (this._notificationsSubscription) {
        this._notificationsSubscription.unsubscribe();
      }

      this._notificationsSubscription = pipe(
        this.api.gqlClient.subscription(SUBSCRIBE_NOTIFICATION),
        subscribe((res) => {
          if (res.error) {
            throw res.error;
          }
          if (res?.data?.notification) {
            this.showToast(res.data.notification, {
              addToDrawer: true,
              variant: "info",
            });
          }
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  showToast(
    notification: Notification,
    options: ToastOptions = { variant: "info" }
  ): void {
    if (!notification.sentOn) {
      notification.sentOn = dayjs().toISOString();
    }

    // if no id save as timestamp to do the close operation
    if (!notification.id) {
      notification.id = String(new Date().getTime());
    }
    options = { addToDrawer: false, duration: "5s", ...options };

    // creating the toast component dynamically
    const toastRef: Ref<HTMLDivElement> = createRef();
    const toast = html`<opc-toast
      ${ref(toastRef)}
      .notification=${notification}
      .options=${options}
    ></opc-toast>`;

    // rendering it in toast-container
    this.addToastToList(toast);
    this.requestUpdate();
    this.updateComplete.then(() => {
      (toastRef.value as any)?.toastRef?.open();
    });

    if (options.addToDrawer) {
      this.notifications = [
        ...this.notifications,
        { ...notification, variant: options.variant },
      ];
    }
  }

  async sendFeedback(feedbackInput: CreateFeedbackVariable["input"]) {
    try {
      const res = await this.api.gqlClient
        .mutation<CreateFeedback, CreateFeedbackVariable>(CREATE_FEEDBACK, {
          input: feedbackInput,
        })
        .toPromise();
      if (res?.data?.createFeedback) {
        window.OpNotification
          ? window.OpNotification.success({
              subject: `Submitted Feedback`,
              link: res?.data?.createFeedback?.ticketUrl,
            })
          : alert("Submitted Feedback");
      } else {
        window.OpNotification
          ? window.OpNotification.danger({
              subject: `Error in Feedback Submission`,
            })
          : alert("Error in Feedback Submission");
        throw new Error(
          "There were some errors in the query" + JSON.stringify(res.error)
        );
      }
      return res.data;
    } catch (error) {
      window.OpNotification
        ? window.OpNotification.danger({
            subject: `Error in Feedback Submission`,
            body: `The Server returned an empty response.`,
          })
        : alert("Error in Feedback Submission");
      throw new Error("The Server returned an empty response.");
    }
  }

  private addToastToList(newToast: TemplateResult<1>) {
    render(newToast, this.toastContainer, {
      renderBefore: this.toastContainer.firstChild,
    });
    const toasts = [
      ...this.toastContainer.querySelectorAll("opc-toast"),
    ] as OpcToast[];
    toasts.slice(5).map((toast) => (toast.toastRef as any).open());
  }

  private get userInfo() {
    return window.OpAuthHelper.getUserInfo();
  }

  private handleNotificationClose(removedId: string) {
    this.notifications = this.notifications.filter(
      ({ id }) => id !== removedId
    );
  }

  private handleFilterChipSelect(app: string) {
    if (this.selectedAppsForNotificationFilter.includes(app)) {
      this.selectedAppsForNotificationFilter =
        this.selectedAppsForNotificationFilter.filter(
          (selectedApp) => app !== selectedApp
        );
    } else {
      this.selectedAppsForNotificationFilter = [
        ...this.selectedAppsForNotificationFilter,
        app,
      ];
    }
  }

  /**
   * Will update is used for derived propery calculation
   * notification -> app count is recomputed on notification state change
   */
  willUpdate(changedProperties: any): void {
    // only need to check changed properties for an expensive computation.
    if (
      changedProperties.has("notifications") ||
      changedProperties.has("selectedAppsForNotificationFilter")
    ) {
      this.notificationAppCount = getNotificationAppCount(this.notifications);
      const chipContainer: any = this.querySelector(
        ".opc-notification-drawer__header-chip-group"
      );
      const headerContainer: any = this.querySelector(".opc-notification-item");
      if (chipContainer) {
        render(
          html`
            ${Object.entries(this.notificationAppCount).map(([app, count]) => {
              if (!count) {
                return null;
              }
              const isChipActive =
                this.selectedAppsForNotificationFilter.includes(
                  app.toLowerCase()
                );
              return html`<opc-filter-chip
                @click=${() => this.handleFilterChipSelect(app.toLowerCase())}
                ?isChipActive=${isChipActive}
              >
                ${app} +${count}
              </button>`;
            })}
          `,
          chipContainer
        );
      }
      // to render the chips for filtering in notification drawer
      if (headerContainer) {
        render(
          html`${this.notifications
            .filter(({ app = "others" }) => {
              if (this.selectedAppsForNotificationFilter.length === 0) {
                return true;
              }
              return this.selectedAppsForNotificationFilter.includes(
                app.toLowerCase()
              );
            })
            .map(
              (notification) =>
                html` <opc-notification-item
                  title=${notification.subject}
                  variant=${notification.variant}
                  key=${notification.id}
                  @opc-notification-item:close=${() => {
                    this.handleNotificationClose(notification.id!);
                  }}
                >
                  <span>
                    ${notification.body}.
                    ${notification.link
                      ? html`<a href=${notification.link}>This is the link.</a>`
                      : ""}
                  </span>
                </opc-notification-item>`
            )}`,
          this.opcNotificationDrawer,
          { renderBefore: headerContainer }
        );
      }
    }
  }

  render() {
    return html`
      <opc-loader ?hidden=${!this.isLoading}></opc-loader>
      <slot></slot>
      <div class="opc-toast-container"></div>
    `;
  }
}
