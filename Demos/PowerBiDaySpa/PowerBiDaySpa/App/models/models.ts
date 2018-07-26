module myApp {

  // data required for embedding a report
  export class Report {
    id: string;
    embedUrl: string;
    name: string;
  }

  // data required for embedding a new report
  export class NewReport {
    workspaceId: string;
    datasetId: string;
    embedUrl: string;
    accessToken: string;
  }

  // data required for embedding a dashboard
  export class Dashboard {
    displayName: string;
    embedUrl: string;
    id: string;
  }

  export class Dataset {
    name: string;
    id: string;
  }

  // data required for embedding a dashboard
  export class Qna {
    datasetId: string;
    embedUrl: string;
    accessToken: string;
  }

}