type RouteParams = {
  appId: string
}

interface IAppContext {
  appId: string
  app: App
  loading: boolean
  setApp: React.Dispatch<any>
  forceRefreshApp: any
}
