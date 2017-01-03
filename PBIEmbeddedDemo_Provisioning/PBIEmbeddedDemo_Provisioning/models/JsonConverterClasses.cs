using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PBIEmbeddedDemo_Provisioning {

    public class Tags {
    }

    public class Properties {
        public string provisioningState { get; set; }
        public string createdDate { get; set; }
        public string status { get; set; }
    }

    public class Sku {
        public string name { get; set; }
        public string tier { get; set; }
    }

    public class WorkspaceCollectionResult {
        public string type { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string location { get; set; }
        public Tags tags { get; set; }
        public Properties properties { get; set; }
        public Sku sku { get; set; }
    }

    public class WorkspaceCollectionsResult{
        public List<WorkspaceCollectionResult> value { get; set; }
    }

    public class BillingUsage {
        public int renders { get; set; }
    }

    public class WorkspaceCollectionKeysResult {
        public string key1 { get; set; }
        public string key2 { get; set; }
    }

}
