using Microsoft.PowerBI.Api.V1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HelloPBIEmbedded.Models {

    public class ReportViewModel {
        public Report Report { get; set; }
        public string AccessToken { get; set; }
    }
}