import { LitElement, html, TemplateResult, render } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ref, Ref, createRef } from "lit/directives/ref.js";
import dayjs from "dayjs";

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
  SubscribeNotification,
} from "../gql/types";

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

  private _notificationsSubscription: ZenObservable.Subscription | null = null;

  api!: APIService;

  constructor() {
    super();
    /**
     * obtain search value if seen in url
     * eg: /search?query="search"
     * onmount value search must be initialzed
     */
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.searchValue =
      (window.location.pathname === "/search" && urlParams.get("query")) || "";
    opcBase.auth?.onLogin(async (user) => {
      const config = opcBase.config;

      if (!user) throw Error("user not found");

      this.api = new APIService({
        apiBasePath: config.apiBasePath,
        subscriptionsPath: config.subscriptionsPath,
        cachePolicy:config.cachePolicy
      });

      const userDetails = [user.kerberosID, user.email, ...user.role];

      try {
        // get app and notifications from server
        const res = await this.api.apollo.query<GetAppList>({
          query: GET_APP_LIST,
          variables: {
            targets: userDetails,
          },
        });
        this.isLoading = res.loading;

        // get the references to vari
        this.opcNavBar = this.querySelector("opc-nav");
        this.opcMenuDrawer = this.querySelector("opc-menu-drawer");
        this.opcNotificationDrawer = this.querySelector(
          "opc-notification-drawer"
        );

        this.injectOpcProviderFn();

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

        // inject business logic for all the components needed
        this.renderNav();
        this.renderMenuDrawer();
        this.renderNotificationDrawer();
        this.renderFeedBack();

        // initialize subscription to notification service
        if (this._notificationsSubscription) {
          this._notificationsSubscription.unsubscribe();
        }

        this._notificationsSubscription = this.api.apollo
          .subscribe<SubscribeNotification>({
            query: SUBSCRIBE_NOTIFICATION,
            variables: {
              targets: userDetails,
            },
          })
          .subscribe((res) => {
            if (res.errors) {
              throw res.errors;
            }
            if (res?.data?.notification) {
              this.showToast(res.data.notification, {
                addToDrawer: true,
                variant: "info",
              });
            }
          });
      } catch (error) {
        console.error(error);
      }
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

  private renderNav() {
    // check
    if (!this.opcNavBar) {
      this.isWarningHidden && console.warn("nav bar not found");
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
      this.opcMenuDrawer.toggle();
      this.opcNavBar.activeButton = "menu";
    });
    this.opcNavBar.addEventListener("opc-nav-btn-notification:click", () => {
      this.opcNotificationDrawer.toggle();
      this.opcNavBar.activeButton = "notification";
    });
    /**
     * Injecting css-var to make navbar on top to drawer
     */
    render(
      html` <style>
          opc-nav {
            --opc-nav-container__z-index: 15;
          }

          opc-menu-drawer {
            --opc-menu-drawer__top: 60px;
            --opc-menu-drawer__z-index: 10;
          }

          opc-notification-drawer {
            --opc-notification-drawer__top: 60px;
            --opc-notification-drawer__z-index: 10;
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
        <img slot="opc-nav-logo" src="${opLogo}" height="28px" alt="logo" />`,
      this.opcNavBar
    );
  }

  private renderMenuDrawer() {
    // check
    if (!this.opcMenuDrawer) {
      this.isWarningHidden && console.warn("menu drawer not found");
      return;
    }
    this.opcMenuDrawer.headerTitle = this.userInfo?.fullName;

    // adding event listener
    this.opcMenuDrawer.addEventListener("opc-menu-drawer:open", () =>
      this.opcNotificationDrawer.close()
    );
    this.opcMenuDrawer.addEventListener("opc-menu-drawer:close", () => {
      if (!this.opcNotificationDrawer.isOpen) {
        this.opcNavBar.activeButton = "";
      }
    });

    // app links for the drawer
    this.opcMenuDrawer.links = [
      {
        title: "Built In Services",
        links: this.apps
          .filter(({ applicationType }) => applicationType === "BUILTIN")
          .map(({ name, path }) => ({ name, href: path })),
      },
      {
        title: "Applications",
        links: this.apps
          .filter(({ applicationType }) => applicationType === "HOSTED")
          .map(({ name, path }) => ({ name, href: path })),
      },
    ];

    // rendering avatar and footer for the drawer
    render(
      html` <opc-avatar slot="avatar">
          ${this.userInfo?.firstName.charAt(0)}
          ${this.userInfo?.lastName.charAt(0)}
        </opc-avatar>
        <button slot="menu" onclick="window.OpAuthHelper.logout()">
          Log Out
        </button>
        <opc-drawer-footer slot="footer"></opc-drawer-footer>`,
      this.opcMenuDrawer
    );
  }

  private renderNotificationDrawer() {
    // check
    if (!this.opcNotificationDrawer) {
      this.isWarningHidden && console.warn("notification drawer not found");
      return;
    }
    // adding notification drawer event listeners
    this.opcNotificationDrawer.addEventListener(
      "opc-notification-drawer:open",
      () => this.opcMenuDrawer.close()
    );
    this.opcNotificationDrawer.addEventListener(
      "opc-notification-drawer:close",
      () => {
        if (!this.opcMenuDrawer.isOpen) {
          this.opcNavBar.activeButton = "";
        }
      }
    );

    // rendering drawer header for filter operations and footer
    render(
      html`
        <style>
          .opc-notification-drawer-header {
            display: flex;
            padding: 1rem;
            flex-direction: column;
            border-bottom: 0.5px solid #6a6e73;
            color: #6a6e73;
          }

          .opc-notification-drawer__header-title {
            font: 400 12px
              var(--opc-global--Heading--Font-Family, "Red Hat Display");
            text-transform: uppercase;
            margin: 0;
          }
          .p-4 {
            padding: 1rem;
          }
        </style>
        <div slot="header" class="opc-notification-drawer-header">
          <div>
            <h6 class="opc-notification-drawer__header-title">NOTIFICATIONS</h6>
          </div>
          <div class="opc-notification-drawer__header-chip-group"></div>
        </div>
        <div class="p-4" slot="footer"><opc-drawer-footer></opc-drawer-footer></div>
      `,
      this.opcNotificationDrawer
    );
  }

  private renderFeedBack() {
    // check
    const feedback = this.querySelector("opc-feedback");
    if (!feedback) {
      this.isWarningHidden && console.warn("feedback component not found");
      return;
    }
    // adding event listeners on feedback component
    feedback.addEventListener("opc-feedback:submit", (event: any) => {
      event.detail.data.createdBy =
        window.OpAuthHelper?.getUserInfo()?.rhatUUID;
      window.sendFeedback(event.detail.data);
    });
  }

  showToast(
    notification: Notification,
    options: ToastOptions = { variant: "info" }
  ) {
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
      const res = await this.api.apollo.mutate<
        CreateFeedback,
        CreateFeedbackVariable
      >({
        mutation: CREATE_FEEDBACK,
        variables: {
          input: feedbackInput,
        },
      });
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
          "There were some errors in the query" + JSON.stringify(res.errors)
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
   * notification - app count is recomputed on notification state change
   */
  willUpdate(changedProperties: any) {
    // only need to check changed properties for an expensive computation.
    if (
      changedProperties.has("notifications") ||
      changedProperties.has("selectedAppsForNotificationFilter")
    ) {
      this.notificationAppCount = getNotificationAppCount(this.notifications);
      const chipContainer: any = this.querySelector(
        ".opc-notification-drawer__header-chip-group"
      );
      const headerContainer: any = this.querySelector(
        ".opc-notification-drawer-header"
      );
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
    if (this.isLoading) {
      return html`<opc-loader></opc-loader>`;
    }

    return html`
      <slot></slot>
      <div class="opc-toast-container"></div>
    `;
  }
}
