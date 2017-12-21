interface Document {
  mozCancelFullScreen: Function;
  msExitFullscreen: Function;
}
interface HTMLIFrameElement {
  mozRequestFullScreen: Function;
  msRequestFullscreen: Function;
}

declare module hpm {
  /*! http-post-message v0.2.3 | (c) 2016 Microsoft Corporation MIT */
  interface IHttpPostMessageRequest {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    url: string;
    headers: any;
    body?: any;
  }
  interface IHttpPostMessageResponse<T> {
    statusCode: number;
    statusText: string;
    headers: any;
    body: T;
  }
  interface IPostMessage {
    postMessage<T>(window: Window, message: any): Promise<T>;
  }
  class HttpPostMessage {
    static addTrackingProperties(message: any, trackingProperties: any): any;
    static getTrackingProperties(message: any): any;
    static isErrorMessage(message: any): boolean;
    defaultHeaders: any;
    defaultTargetWindow: Window;
    windowPostMessageProxy: IPostMessage;
    constructor(windowPostMessageProxy: IPostMessage, defaultHeaders?: any, defaultTargetWindow?: Window);
    get<T>(url: string, headers?: any, targetWindow?: Window): Promise<IHttpPostMessageResponse<T>>;
    post<T>(url: string, body: any, headers?: any, targetWindow?: Window): Promise<IHttpPostMessageResponse<T>>;
    put<T>(url: string, body: any, headers?: any, targetWindow?: Window): Promise<IHttpPostMessageResponse<T>>;
    patch<T>(url: string, body: any, headers?: any, targetWindow?: Window): Promise<IHttpPostMessageResponse<T>>;
    delete<T>(url: string, body?: any, headers?: any, targetWindow?: Window): Promise<IHttpPostMessageResponse<T>>;
    send<T>(request: IHttpPostMessageRequest, targetWindow?: Window): Promise<IHttpPostMessageResponse<T>>;
    /**
     * Object.assign() polyfill
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
     */
    private assign(target, ...sources);
  }

}

declare module wpmp {
  /*! window-post-message-proxy v0.2.4 | (c) 2016 Microsoft Corporation MIT */
  interface ITrackingProperties {
    id: string;
  }
  interface IAddTrackingProperties {
    <T>(message: T, trackingProperties: ITrackingProperties): T;
  }
  interface IGetTrackingProperties {
    (message: any): ITrackingProperties;
  }
  interface IProcessTrackingProperties {
    addTrackingProperties: IAddTrackingProperties;
    getTrackingProperties: IGetTrackingProperties;
  }
  interface IIsErrorMessage {
    (message: any): boolean;
  }
  interface IMessageHandler {
    test(message: any): boolean;
    handle(message: any): any;
  }
  interface IWindowPostMessageProxyOptions {
    receiveWindow?: Window;
    processTrackingProperties?: IProcessTrackingProperties;
    isErrorMessage?: IIsErrorMessage;
    name?: string;
    logMessages?: boolean;
    eventSourceOverrideWindow?: Window;
    suppressWarnings?: boolean;
  }
  class WindowPostMessageProxy {
    static defaultAddTrackingProperties<T>(message: T, trackingProperties: ITrackingProperties): T;
    static defaultGetTrackingProperties(message: any): ITrackingProperties;
    static defaultIsErrorMessage(message: any): boolean;
    private static messagePropertyName;
    /**
     * Utility to create a deferred object.
     */
    private static createDeferred();
    /**
     * Utility to generate random sequence of characters used as tracking id for promises.
     */
    private static createRandomString();
    private logMessages;
    private name;
    private addTrackingProperties;
    private getTrackingProperties;
    private isErrorMessage;
    private receiveWindow;
    private pendingRequestPromises;
    private handlers;
    private windowMessageHandler;
    private eventSourceOverrideWindow;
    private suppressWarnings;
    constructor(options?: IWindowPostMessageProxyOptions);
    /**
     * Adds handler.
     * If the first handler whose test method returns true will handle the message and provide a response.
     */
    addHandler(handler: IMessageHandler): void;
    /**
     * Removes handler.
     * The reference must match the original object that was provided when adding the handler.
     */
    removeHandler(handler: IMessageHandler): void;
    /**
     * Start listening to message events.
     */
    start(): void;
    /**
     * Stops listening to message events.
     */
    stop(): void;
    /**
     * Post message to target window with tracking properties added and save deferred object referenced by tracking id.
     */
    postMessage<T>(targetWindow: Window, message: any): Promise<T>;
    /**
     * Send response message to target window.
     * Response messages re-use tracking properties from a previous request message.
     */
    private sendResponse(targetWindow, message, trackingProperties);
    /**
     * Message handler.
     */
    private onMessageReceived(event);
  }

}

declare namespace models {
  /*! powerbi-models v0.11.3 | (c) 2016 Microsoft Corporation MIT */
  const advancedFilterSchema: any;
  const filterSchema: any;
  const loadSchema: any;
  const dashboardLoadSchema: any;
  const pageSchema: any;
  const settingsSchema: any;
  const basicFilterSchema: any;
  const createReportSchema: any;
  const saveAsParametersSchema: any;
  interface ITechnicalDetails {
    requestId?: string;
  }
  interface IError {
    message: string;
    detailedMessage?: string;
    errorCode?: string;
    technicalDetails?: ITechnicalDetails;
  }
  interface ISettings {
    filterPaneEnabled?: boolean;
    navContentPaneEnabled?: boolean;
    useCustomSaveAsDialog?: boolean;
  }
  const validateSettings: (x: any) => IError[];
  interface IReportLoadConfiguration {
    accessToken: string;
    id: string;
    settings?: ISettings;
    pageName?: string;
    filters?: (IBasicFilter | IAdvancedFilter)[];
    permissions?: Permissions;
    viewMode?: ViewMode;
    tokenType?: TokenType;
  }
  const validateReportLoad: (x: any) => IError[];
  interface IReportCreateConfiguration {
    accessToken: string;
    datasetId: string;
    settings?: ISettings;
    tokenType?: TokenType;
  }
  const validateCreateReport: (x: any) => IError[];
  type PageView = "fitToWidth" | "oneColumn" | "actualSize";
  interface IDashboardLoadConfiguration {
    accessToken: string;
    id: string;
    pageView?: PageView;
    tokenType?: TokenType;
  }
  const validateDashboardLoad: (x: any) => IError[];
  interface IReport {
    id: string;
    displayName: string;
  }
  interface IPage {
    name: string;
    displayName: string;
    isActive?: boolean;
  }
  interface IVisual {
    name: string;
    title: string;
    type: string;
  }
  const validatePage: (x: any) => IError[];
  const validateFilter: (x: any) => IError[];
  /**
   * Copied powerbi-filters code into this file.
   */
  interface IBaseFilterTarget {
    table: string;
  }
  interface IFilterColumnTarget extends IBaseFilterTarget {
    column: string;
    aggregationFunction?: string;
  }
  interface IFilterKeyColumnsTarget extends IFilterColumnTarget {
    keys: string[];
  }
  interface IFilterKeyHierarchyTarget extends IFilterHierarchyTarget {
    keys: string[];
  }
  interface IFilterHierarchyTarget extends IBaseFilterTarget {
    hierarchy: string;
    hierarchyLevel: string;
    aggregationFunction?: string;
  }
  interface IFilterMeasureTarget extends IBaseFilterTarget {
    measure: string;
  }
  type IFilterKeyTarget = (IFilterKeyColumnsTarget | IFilterKeyHierarchyTarget);
  type IFilterTarget = (IFilterColumnTarget | IFilterHierarchyTarget | IFilterMeasureTarget);
  interface IFilter {
    $schema: string;
    target: IFilterTarget;
  }
  interface IBasicFilter extends IFilter {
    operator: BasicFilterOperators;
    values: (string | number | boolean)[];
  }
  interface IBasicFilterWithKeys extends IBasicFilter {
    target: IFilterKeyTarget;
    keyValues: (string | number | boolean)[][];
  }
  type BasicFilterOperators = "In" | "NotIn" | "All";
  type AdvancedFilterLogicalOperators = "And" | "Or";
  type AdvancedFilterConditionOperators = "None" | "LessThan" | "LessThanOrEqual" | "GreaterThan" | "GreaterThanOrEqual" | "Contains" | "DoesNotContain" | "StartsWith" | "DoesNotStartWith" | "Is" | "IsNot" | "IsBlank" | "IsNotBlank";
  interface IAdvancedFilterCondition {
    value: (string | number | boolean);
    operator: AdvancedFilterConditionOperators;
  }
  interface IAdvancedFilter extends IFilter {
    logicalOperator: AdvancedFilterLogicalOperators;
    conditions: IAdvancedFilterCondition[];
  }
  enum FilterType {
    Advanced = 0,
    Basic = 1,
    Unknown = 2,
  }
  function isFilterKeyColumnsTarget(target: IFilterTarget): boolean;
  function isBasicFilterWithKeys(filter: IFilter): boolean;
  function getFilterType(filter: IFilter): FilterType;
  function isMeasure(arg: any): arg is IFilterMeasureTarget;
  function isColumn(arg: any): arg is IFilterColumnTarget;
  function isHierarchy(arg: any): arg is IFilterHierarchyTarget;
  abstract class Filter {
    static schema: string;
    protected static schemaUrl: string;
    target: IFilterTarget;
    protected schemaUrl: string;
    constructor(target: IFilterTarget);
    toJSON(): IFilter;
  }
  class BasicFilter extends Filter {
    static schemaUrl: string;
    operator: BasicFilterOperators;
    values: (string | number | boolean)[];
    keyValues: (string | number | boolean)[][];
    constructor(target: IFilterTarget, operator: BasicFilterOperators, ...values: ((string | number | boolean) | (string | number | boolean)[])[]);
    toJSON(): IBasicFilter;
  }
  class BasicFilterWithKeys extends BasicFilter {
    keyValues: (string | number | boolean)[][];
    target: IFilterKeyTarget;
    constructor(target: IFilterKeyTarget, operator: BasicFilterOperators, values: ((string | number | boolean) | (string | number | boolean)[]), keyValues: (string | number | boolean)[][]);
    toJSON(): IBasicFilter;
  }
  class AdvancedFilter extends Filter {
    static schemaUrl: string;
    logicalOperator: AdvancedFilterLogicalOperators;
    conditions: IAdvancedFilterCondition[];
    constructor(target: IFilterTarget, logicalOperator: AdvancedFilterLogicalOperators, ...conditions: (IAdvancedFilterCondition | IAdvancedFilterCondition[])[]);
    toJSON(): IAdvancedFilter;
  }
  interface IDataReference {
    target: IFilterTarget;
  }
  interface IEqualsDataReference extends IDataReference {
    equals: string | boolean | number | Date;
  }
  interface IBetweenDataReference extends IDataReference {
    between: (string | boolean | number)[];
  }
  interface IValueDataReference extends IDataReference {
    value: string | boolean | number | Date;
    formattedValue: string;
  }
  interface IIdentityValue<T extends IDataReference> {
    identity: T[];
    values: IValueDataReference[];
  }
  interface ISelection {
    visual: IVisual;
    page: IPage;
    report: IReport;
    dataPoints: IIdentityValue<IEqualsDataReference>[];
    regions: IIdentityValue<IEqualsDataReference | IBetweenDataReference>[];
    filters: (IBasicFilter | IAdvancedFilter)[];
  }
  enum Permissions {
    Read = 0,
    ReadWrite = 1,
    Copy = 2,
    Create = 4,
    All = 7,
  }
  enum ViewMode {
    View = 0,
    Edit = 1,
  }
  enum TokenType {
    Aad = 0,
    Embed = 1,
  }
  interface ISaveAsParameters {
    name: string;
  }
  const validateSaveAsParameters: (x: any) => IError[];

}

declare module router {
  /*! powerbi-router v0.1.5 | (c) 2016 Microsoft Corporation MIT */
  interface IAddHandler {
    addHandler(handler: any): void;
  }
  interface IRouterHandler {
    (request: IExtendedRequest, response: Response): void | Promise<void>;
  }
  class Router {
    private handlers;
    private getRouteRecognizer;
    private patchRouteRecognizer;
    private postRouteRecognizer;
    private putRouteRecognizer;
    private deleteRouteRecognizer;
    constructor(handlers: IAddHandler);
    get(url: string, handler: IRouterHandler): this;
    patch(url: string, handler: IRouterHandler): this;
    post(url: string, handler: IRouterHandler): this;
    put(url: string, handler: IRouterHandler): this;
    delete(url: string, handler: IRouterHandler): this;
    /**
     * TODO: This method could use some refactoring.  There is conflict of interest between keeping clean separation of test and handle method
     * Test method only returns boolean indicating if request can be handled, and handle method has opportunity to modify response and return promise of it.
     * In the case of the router with route-recognizer where handlers are associated with routes, this already guarantees that only one handler is selected and makes the test method feel complicated
     * Will leave as is an investigate cleaner ways at later time.
     */
    private registerHandler(routeRecognizer, method, url, handler);
  }
  interface IExtendedRequest extends IRequest {
    params: any;
    queryParams: any;
    handler: any;
  }
  interface IRequest {
    method: "GET" | "POST" | "PUT" | "DELETE";
    url: string;
    headers: {
      [key: string]: string;
    };
    body: any;
  }
  interface IResponse {
    statusCode: number;
    headers?: {
      [key: string]: string;
    };
    body: any;
  }
  class Response implements IResponse {
    statusCode: number;
    headers: any;
    body: any;
    constructor();
    send(statusCode: number, body?: any): void;
  }

}

declare module service {

  interface IEvent<T> {
    type: string;
    id: string;
    name: string;
    value: T;
  }
  interface ICustomEvent<T> extends CustomEvent {
    detail: T;
  }
  interface IEventHandler<T> {
    (event: ICustomEvent<T>): any;
  }
  interface IHpmFactory {
    (wpmp: wpmp.WindowPostMessageProxy, targetWindow?: Window, version?: string, type?: string, origin?: string): hpm.HttpPostMessage;
  }
  interface IWpmpFactory {
    (name?: string, logMessages?: boolean, eventSourceOverrideWindow?: Window): wpmp.WindowPostMessageProxy;
  }
  interface IRouterFactory {
    (wpmp: wpmp.WindowPostMessageProxy): router.Router;
  }
  interface IPowerBiElement extends HTMLElement {
    powerBiEmbed: embed.Embed;
  }
  interface IDebugOptions {
    logMessages?: boolean;
    wpmpName?: string;
  }
  interface IServiceConfiguration extends IDebugOptions {
    autoEmbedOnContentLoaded?: boolean;
    onError?: (error: any) => any;
    version?: string;
    type?: string;
  }
  interface IService {
    hpm: hpm.HttpPostMessage;
  }
  /**
   * The Power BI Service embed component, which is the entry point to embed all other Power BI components into your application
   *
   * @export
   * @class Service
   * @implements {IService}
   */
  class Service implements IService {
    /**
     * A list of components that this service can embed
     */
    private static components;
    /**
     * The default configuration for the service
     */
    private static defaultConfig;
    /**
     * Gets or sets the access token as the global fallback token to use when a local token is not provided for a report or tile.
     *
     * @type {string}
     */
    accessToken: string;
    /**The Configuration object for the service*/
    private config;
    /** A list of Dashboard, Report and Tile components that have been embedded using this service instance. */
    private embeds;
    /** TODO: Look for way to make hpm private without sacraficing ease of maitenance. This should be private but in embed needs to call methods. */
    hpm: hpm.HttpPostMessage;
    /** TODO: Look for way to make wpmp private.  This is only public to allow stopping the wpmp in tests */
    wpmp: wpmp.WindowPostMessageProxy;
    private router;
    /**
     * Creates an instance of a Power BI Service.
     *
     * @param {IHpmFactory} hpmFactory The http post message factory used in the postMessage communication layer
     * @param {IWpmpFactory} wpmpFactory The window post message factory used in the postMessage communication layer
     * @param {IRouterFactory} routerFactory The router factory used in the postMessage communication layer
     * @param {IServiceConfiguration} [config={}]
     */
    constructor(hpmFactory: IHpmFactory, wpmpFactory: IWpmpFactory, routerFactory: IRouterFactory, config?: IServiceConfiguration);
    /**
     * Creates new report
     * @param {HTMLElement} element
     * @param {embed.IEmbedConfiguration} [config={}]
     * @returns {embed.Embed}
     */
    createReport(element: HTMLElement, config: embed.IEmbedConfiguration): embed.Embed;
    /**
     * TODO: Add a description here
     *
     * @param {HTMLElement} [container]
     * @param {embed.IEmbedConfiguration} [config=undefined]
     * @returns {embed.Embed[]}
     */
    init(container?: HTMLElement, config?: embed.IEmbedConfiguration): embed.Embed[];
    /**
     * Given a configuration based on an HTML element,
     * if the component has already been created and attached to the element, reuses the component instance and existing iframe,
     * otherwise creates a new component instance.
     *
     * @param {HTMLElement} element
     * @param {embed.IEmbedConfiguration} [config={}]
     * @returns {embed.Embed}
     */
    embed(element: HTMLElement, config?: embed.IEmbedConfiguration): embed.Embed;
    /**
     * Given a configuration based on a Power BI element, saves the component instance that reference the element for later lookup.
     *
     * @private
     * @param {IPowerBiElement} element
     * @param {embed.IEmbedConfiguration} config
     * @returns {embed.Embed}
     */
    private embedNew(element, config);
    /**
     * Given an element that already contains an embed component, load with a new configuration.
     *
     * @private
     * @param {IPowerBiElement} element
     * @param {embed.IEmbedConfiguration} config
     * @returns {embed.Embed}
     */
    private embedExisting(element, config);
    /**
     * Adds an event handler for DOMContentLoaded, which searches the DOM for elements that have the 'powerbi-embed-url' attribute,
     * and automatically attempts to embed a powerbi component based on information from other powerbi-* attributes.
     *
     * Note: Only runs if `config.autoEmbedOnContentLoaded` is true when the service is created.
     * This handler is typically useful only for applications that are rendered on the server so that all required data is available when the handler is called.
     */
    enableAutoEmbed(): void;
    /**
     * Returns an instance of the component associated with the element.
     *
     * @param {HTMLElement} element
     * @returns {(Report | Tile)}
     */
    get(element: HTMLElement): embed.Embed;
    /**
     * Finds an embed instance by the name or unique ID that is provided.
     *
     * @param {string} uniqueId
     * @returns {(Report | Tile)}
     */
    find(uniqueId: string): embed.Embed;
    addOrOverwriteEmbed(component: embed.Embed, element: HTMLElement): void;
    /**
     * Given an HTML element that has a component embedded within it, removes the component from the list of embedded components, removes the association between the element and the component, and removes the iframe.
     *
     * @param {HTMLElement} element
     * @returns {void}
     */
    reset(element: HTMLElement): void;
    /**
     * handles tile events
     *
     * @param {IEvent<any>} event
     */
    handleTileEvents(event: IEvent<any>): void;
    /**
     * Given an event object, finds the embed component with the matching type and ID, and invokes its handleEvent method with the event object.
     *
     * @private
     * @param {IEvent<any>} event
     */
    private handleEvent(event);
  }
  
}

declare module embed {
  /**
 * Configuration settings for Power BI embed components
 *
 * @export
 * @interface IEmbedConfiguration
 */
  interface IEmbedConfiguration {
    type?: string;
    id?: string;
    uniqueId?: string;
    embedUrl?: string;
    accessToken?: string;
    settings?: models.ISettings;
    pageName?: string;
    filters?: models.IFilter[];
    pageView?: models.PageView;
    datasetId?: string;
    permissions?: models.Permissions;
    viewMode?: models.ViewMode;
    tokenType?: models.TokenType;
    action?: string;
    dashboardId?: string;
    height?: number;
    width?: number;
  }
  interface IInternalEmbedConfiguration extends models.IReportLoadConfiguration {
    uniqueId: string;
    type: string;
    embedUrl: string;
    height?: number;
    width?: number;
    action?: string;
  }
  interface IInternalEventHandler<T> {
    test(event: service.IEvent<T>): boolean;
    handle(event: service.ICustomEvent<T>): void;
  }
  /**
   * Base class for all Power BI embed components
   *
   * @export
   * @abstract
   * @class Embed
   */
  abstract class Embed {
    static allowedEvents: string[];
    static accessTokenAttribute: string;
    static embedUrlAttribute: string;
    static nameAttribute: string;
    static typeAttribute: string;
    static type: string;
    private static defaultSettings;
    allowedEvents: any[];
    /**
     * Gets or sets the event handler registered for this embed component.
     *
     * @type {IInternalEventHandler<any>[]}
     */
    eventHandlers: IInternalEventHandler<any>[];
    /**
     * Gets or sets the Power BI embed service.
     *
     * @type {service.Service}
     */
    service: service.Service;
    /**
     * Gets or sets the HTML element that contains the Power BI embed component.
     *
     * @type {HTMLElement}
     */
    element: HTMLElement;
    /**
     * Gets or sets the HTML iframe element that renders the Power BI embed component.
     *
     * @type {HTMLIFrameElement}
     */
    iframe: HTMLIFrameElement;
    /**
     * Gets or sets the configuration settings for the Power BI embed component.
     *
     * @type {IInternalEmbedConfiguration}
     */
    config: IInternalEmbedConfiguration;
    /**
     * Gets or sets the configuration settings for creating report.
     *
     * @type {models.IReportCreateConfiguration}
     */
    createConfig: models.IReportCreateConfiguration;
    /**
     * Url used in the load request.
     */
    loadPath: string;
    /**
     * Type of embed
     */
    embeType: string;
    /**
     * Creates an instance of Embed.
     *
     * Note: there is circular reference between embeds and the service, because
     * the service has a list of all embeds on the host page, and each embed has a reference to the service that created it.
     *
     * @param {service.Service} service
     * @param {HTMLElement} element
     * @param {IEmbedConfiguration} config
     */
    constructor(service: service.Service, element: HTMLElement, config: IEmbedConfiguration, iframe?: HTMLIFrameElement);
    /**
     * Sends createReport configuration data.
     *
     * ```javascript
     * createReport({
     *   datasetId: '5dac7a4a-4452-46b3-99f6-a25915e0fe55',
     *   accessToken: 'eyJ0eXA ... TaE2rTSbmg',
     * ```
     *
     * @param {models.IReportCreateConfiguration} config
     * @returns {Promise<void>}
     */
    createReport(config: models.IReportCreateConfiguration): Promise<void>;
    /**
     * Saves Report.
     *
     * @returns {Promise<void>}
     */
    save(): Promise<void>;
    /**
     * SaveAs Report.
     *
     * @returns {Promise<void>}
     */
    saveAs(saveAsParameters: models.ISaveAsParameters): Promise<void>;
    /**
     * Sends load configuration data.
     *
     * ```javascript
     * report.load({
     *   type: 'report',
     *   id: '5dac7a4a-4452-46b3-99f6-a25915e0fe55',
     *   accessToken: 'eyJ0eXA ... TaE2rTSbmg',
     *   settings: {
     *     navContentPaneEnabled: false
     *   },
     *   pageName: "DefaultPage",
     *   filters: [
     *     {
     *        ...  DefaultReportFilter ...
     *     }
     *   ]
     * })
     *   .catch(error => { ... });
     * ```
     *
     * @param {models.ILoadConfiguration} config
     * @returns {Promise<void>}
     */
    load(config: models.IReportLoadConfiguration | models.IDashboardLoadConfiguration): Promise<void>;
    /**
     * Removes one or more event handlers from the list of handlers.
     * If a reference to the existing handle function is specified, remove the specific handler.
     * If the handler is not specified, remove all handlers for the event name specified.
     *
     * ```javascript
     * report.off('pageChanged')
     *
     * or
     *
     * const logHandler = function (event) {
     *    console.log(event);
     * };
     *
     * report.off('pageChanged', logHandler);
     * ```
     *
     * @template T
     * @param {string} eventName
     * @param {service.IEventHandler<T>} [handler]
     */
    off<T>(eventName: string, handler?: service.IEventHandler<T>): void;
    /**
     * Adds an event handler for a specific event.
     *
     * ```javascript
     * report.on('pageChanged', (event) => {
     *   console.log('PageChanged: ', event.page.name);
     * });
     * ```
     *
     * @template T
     * @param {string} eventName
     * @param {service.IEventHandler<T>} handler
     */
    on<T>(eventName: string, handler: service.IEventHandler<T>): void;
    /**
     * Reloads embed using existing configuration.
     * E.g. For reports this effectively clears all filters and makes the first page active which simulates resetting a report back to loaded state.
     *
     * ```javascript
     * report.reload();
     * ```
     */
    reload(): Promise<void>;
    /**
     * Set accessToken.
     *
     * @returns {Promise<void>}
     */
    setAccessToken(accessToken: string): Promise<void>;
    /**
     * Gets an access token from the first available location: config, attribute, global.
     *
     * @private
     * @param {string} globalAccessToken
     * @returns {string}
     */
    private getAccessToken(globalAccessToken);
    /**
     * Populate config for create and load
     *
     * @private
     * @param {IEmbedConfiguration}
     * @returns {void}
     */
    private populateConfig(config);
    /**
     * Gets an embed url from the first available location: options, attribute.
     *
     * @private
     * @returns {string}
     */
    private getEmbedUrl();
    /**
     * Gets a unique ID from the first available location: options, attribute.
     * If neither is provided generate a unique string.
     *
     * @private
     * @returns {string}
     */
    private getUniqueId();
    /**
     * Gets the report ID from the first available location: options, attribute.
     *
     * @abstract
     * @returns {string}
     */
    abstract getId(): string;
    /**
     * Requests the browser to render the component's iframe in fullscreen mode.
     */
    fullscreen(): void;
    /**
     * Requests the browser to exit fullscreen mode.
     */
    exitFullscreen(): void;
    /**
     * Returns true if the iframe is rendered in fullscreen mode,
     * otherwise returns false.
     *
     * @private
     * @param {HTMLIFrameElement} iframe
     * @returns {boolean}
     */
    private isFullscreen(iframe);
    /**
     * Validate load and create configuration.
     */
    abstract validate(config: models.IReportLoadConfiguration | models.IDashboardLoadConfiguration | models.IReportCreateConfiguration): models.IError[];
    /**
     * Sets Iframe for embed
     */
    private setIframe(isLoad);
  }

}

interface IFilterable {
  getFilters(): Promise<models.IFilter[]>;
  setFilters(filters: models.IFilter[]): Promise<void>;
  removeFilters(): Promise<void>;
}

interface IReportNode {
  iframe: HTMLIFrameElement;
  service: service.IService;
  config: embed.IInternalEmbedConfiguration;
}

declare class Report extends embed.Embed implements IReportNode, IFilterable {
  static allowedEvents: string[];
  static reportIdAttribute: string;
  static filterPaneEnabledAttribute: string;
  static navContentPaneEnabledAttribute: string;
  static typeAttribute: string;
  static type: string;
  /**
   * Creates an instance of a Power BI Report.
   *
   * @param {service.Service} service
   * @param {HTMLElement} element
   * @param {embed.IEmbedConfiguration} config
   */
  constructor(service: service.Service, element: HTMLElement, config: embed.IEmbedConfiguration, iframe?: HTMLIFrameElement);
  /**
   * Adds backwards compatibility for the previous load configuration, which used the reportId query parameter to specify the report ID
   * (e.g. http://embedded.powerbi.com/appTokenReportEmbed?reportId=854846ed-2106-4dc2-bc58-eb77533bf2f1).
   *
   * By extracting the ID we can ensure that the ID is always explicitly provided as part of the load configuration.
   *
   * @static
   * @param {string} url
   * @returns {string}
   */
  static findIdFromEmbedUrl(url: string): string;
  /**
   * Gets filters that are applied at the report level.
   *
   * ```javascript
   * // Get filters applied at report level
   * report.getFilters()
   *   .then(filters => {
   *     ...
   *   });
   * ```
   *
   * @returns {Promise<models.IFilter[]>}
   */
  getFilters(): Promise<models.IFilter[]>;
  /**
   * Gets the report ID from the first available location: options, attribute, embed url.
   *
   * @returns {string}
   */
  getId(): string;
  /**
   * Gets the list of pages within the report.
   *
   * ```javascript
   * report.getPages()
   *  .then(pages => {
   *      ...
   *  });
   * ```
   *
   * @returns {Promise<Page[]>}
   */
  getPages(): Promise<Page[]>;
  /**
   * Creates an instance of a Page.
   *
   * Normally you would get Page objects by calling `report.getPages()`, but in the case
   * that the page name is known and you want to perform an action on a page without having to retrieve it
   * you can create it directly.
   *
   * Note: Because you are creating the page manually there is no guarantee that the page actually exists in the report, and subsequent requests could fail.
   *
   * ```javascript
   * const page = report.page('ReportSection1');
   * page.setActive();
   * ```
   *
   * @param {string} name
   * @param {string} [displayName]
   * @returns {Page}
   */
  page(name: string, displayName?: string): Page;
  /**
   * Prints the active page of the report by invoking `window.print()` on the embed iframe component.
   */
  print(): Promise<void>;
  /**
   * Removes all filters at the report level.
   *
   * ```javascript
   * report.removeFilters();
   * ```
   *
   * @returns {Promise<void>}
   */
  removeFilters(): Promise<void>;
  /**
   * Sets the active page of the report.
   *
   * ```javascript
   * report.setPage("page2")
   *  .catch(error => { ... });
   * ```
   *
   * @param {string} pageName
   * @returns {Promise<void>}
   */
  setPage(pageName: string): Promise<void>;
  /**
   * Sets filters at the report level.
   *
   * ```javascript
   * const filters: [
   *    ...
   * ];
   *
   * report.setFilters(filters)
   *  .catch(errors => {
   *    ...
   *  });
   * ```
   *
   * @param {(models.IFilter[])} filters
   * @returns {Promise<void>}
   */
  setFilters(filters: models.IFilter[]): Promise<void>;
  /**
   * Updates visibility settings for the filter pane and the page navigation pane.
   *
   * ```javascript
   * const newSettings = {
   *   navContentPaneEnabled: true,
   *   filterPaneEnabled: false
   * };
   *
   * report.updateSettings(newSettings)
   *   .catch(error => { ... });
   * ```
   *
   * @param {models.ISettings} settings
   * @returns {Promise<void>}
   */
  updateSettings(settings: models.ISettings): Promise<void>;
  /**
   * Validate load configuration.
   */
  validate(config: models.IReportLoadConfiguration): models.IError[];
  /**
   * Switch Report view mode.
   *
   * @returns {Promise<void>}
   */
  switchMode(viewMode: string): Promise<void>;
  /**
  * Refreshes data sources for the report.
  *
  * ```javascript
  * report.refresh();
  * ```
  */
  refresh(): Promise<void>;
}

interface IPageNode {
  report: IReportNode;
  name: string;
}

/**
 * A Power BI report page
 *
 * @export
 * @class Page
 * @implements {IPageNode}
 * @implements {IFilterable}
 */
declare class Page implements IPageNode, IFilterable {
  /**
   * The parent Power BI report that this page is a member of
   *
   * @type {IReportNode}
   */
  report: IReportNode;
  /**
   * The report page name
   *
   * @type {string}
   */
  name: string;
  /**
   * The user defined display name of the report page, which is undefined if the page is created manually
   *
   * @type {string}
   */
  displayName: string;
  /**
   * Creates an instance of a Power BI report page.
   *
   * @param {IReportNode} report
   * @param {string} name
   * @param {string} [displayName]
   */
  constructor(report: IReportNode, name: string, displayName?: string);
  /**
   * Gets all page level filters within the report.
   *
   * ```javascript
   * page.getFilters()
   *  .then(pages => { ... });
   * ```
   *
   * @returns {(Promise<models.IFilter[]>)}
   */
  getFilters(): Promise<models.IFilter[]>;
  /**
   * Removes all filters from this page of the report.
   *
   * ```javascript
   * page.removeFilters();
   * ```
   *
   * @returns {Promise<void>}
   */
  removeFilters(): Promise<void>;
  /**
   * Makes the current page the active page of the report.
   *
   * ```javascripot
   * page.setActive();
   * ```
   *
   * @returns {Promise<void>}
   */
  setActive(): Promise<void>;
  /**
   * Sets all filters on the current page.
   *
   * ```javascript
   * page.setFilters(filters);
   *   .catch(errors => { ... });
   * ```
   *
   * @param {(models.IFilter[])} filters
   * @returns {Promise<void>}
   */
  setFilters(filters: models.IFilter[]): Promise<void>;
}




declare var powerbi: service.Service;
