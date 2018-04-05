using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerBiEmbeddedScratchpad.Models {

  // data required for embedding a report
  class ReportEmbeddingData {
    public string reportId;
    public string reportName;
    public string embedUrl;
    public string accessToken;
  }

  // data required for embedding a new report
  class NewReportEmbeddingData {
    public string workspaceId;
    public string datasetId;
    public string embedUrl;
    public string accessToken;
  }

  // data required for embedding a dashboard
  class DashboardEmbeddingData {
    public string dashboardId;
    public string dashboardName;
    public string embedUrl;
    public string accessToken;
  }

  // data required for embedding a dashboard
  class DashboardTileEmbeddingData {
    public string dashboardId;
    public string TileId;
    public string TileTitle;
    public string embedUrl;
    public string accessToken;
  }

  // data required for embedding a dashboard
  class QnaEmbeddingData {
    public string datasetId;
    public string embedUrl;
    public string accessToken;
  }

}
