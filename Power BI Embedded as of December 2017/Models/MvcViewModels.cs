using System;
using System.Collections.Generic;
using Microsoft.PowerBI.Api.V2.Models;

namespace DailyReporterPro.Models {

  public class HomeViewModel {
    public string WorkspaceName;
    public string WorkspaceId;
  }

  public class DatasetViewModel {
    public Dataset dataset { get; set; }
    public EmbedConfiguration EmbedConfig { get; set; }
  }

  public class DatasetsViewModel {
    public List<Dataset> Datasets { get; set; }
  }

  public class ReportViewModel {
    public Report Report { get; set; }
    public EmbedConfiguration EmbedConfig { get; set; }
  }

  public enum ReportMode {
    NoReport,
    ExistingReport,
    NewReport
  }

  public class ReportsViewModel {
    public List<Report> Reports { get; set; }
    public List<Dataset> Datasets { get; set; }
    public ReportMode ReportMode { get; set; }
    public ReportViewModel CurrentReport { get; set; }
    public DatasetViewModel CurrentDataset { get; set; }
  }

  public class DashboardViewModel {
    public Dashboard Dashboard { get; set; }
    public EmbedConfiguration EmbedConfig { get; set; }
  }

  public class DashboardsViewModel {
    public List<Dashboard> Dashboards { get; set; }
    public DashboardViewModel CurrentDashboard { get; set; }
  }

}