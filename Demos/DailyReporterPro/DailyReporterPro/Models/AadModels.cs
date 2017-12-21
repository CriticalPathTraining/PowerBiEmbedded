using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DailyReporterPro.Models {

  public class JsonWebToken {
    public string token_type { get; set; }
    public string resource { get; set; }
    public string scope { get; set; }
    public string expires_in { get; set; }
    public string expires_on { get; set; }
    public string not_before { get; set; }
    public string id_token { get; set; }
    public string access_token { get; set; }
    public string refresh_token { get; set; }

    public static JsonWebToken Deserialize(string json) {
      return Newtonsoft.Json.JsonConvert.DeserializeObject<JsonWebToken>(json);
    }

  }

}