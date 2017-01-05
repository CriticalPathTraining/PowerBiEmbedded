using System.Collections.Generic;
using Microsoft.PowerBI.Api.V1.Models;

namespace PBIEmbeddedDemo_Embedding.Models {

  public class ReportViewModel {
    public Report Report { get; set; }
    public string AccessToken { get; set; }
  }

  public class ReportsViewModel {
    public List<Report> Reports { get; set; }
    public ReportViewModel CurrentReport { get; set;  }
  }

}