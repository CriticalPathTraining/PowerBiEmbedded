using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ThirdPartyEmbeddingDemo.Models {

  public class UserIfoViewModel {
    public bool IsAuthenticated { get; set; }
    public bool IsAdmin { get; set; }
    public string UserId { get; set; }
    public string UserName { get; set; }
    public string UserEmail { get; set; }
    public string UserDisplayName { get; set; }
    public bool HasRoles { get; set; }
    public string[] Roles { get; set; }
  }

  public class LoginViewModel {

    [Required]
    [Display(Name = "User Name")]
    public string UserName{ get; set; }

    [Required]
    [DataType(DataType.Password)]
    [Display(Name = "Password")]
    public string Password { get; set; }

    [Display(Name = "Remember me?")]
    public bool RememberMe { get; set; }

  }

 
}