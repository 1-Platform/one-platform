// write your helper functions here
import fetch from "node-fetch";

class NotificationAPIHelper {
  buildGqlQuery(response: NotificationsConfigType[]) {
    return response
      .map(
        (
          notificationsConfig
        ) => `source_${notificationsConfig.source}: getHomeType( _id: "${notificationsConfig.source}" ){
              owners
            }`
      )
      .join();
  }

  getSourceDetails(query: string) {
    return fetch(
      `http://home-service.one-platform.int.open.paas.redhat.com/graphql`,
      {
        method: "post",
        body: JSON.stringify({ query: query }),
        headers: { "Content-Type": "application/json" },
      }
    ).then((res: any) => res.json());
  }
}

export const NotificationHelper = new NotificationAPIHelper();
