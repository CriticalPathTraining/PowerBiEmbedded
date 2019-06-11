using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using ThirdPartyEmbeddingDemo.Models;

namespace ThirdPartyEmbeddingDemo.Controllers {
  public class HomeController : Controller {

    public ActionResult Index() {      
      return View();
    }

    [Authorize]
    public ActionResult UserInfo() {

      UserIfoViewModel viewModel = new UserIfoViewModel { IsAuthenticated = false };

      if (User.Identity.IsAuthenticated) {
        viewModel.IsAuthenticated = true;

        ApplicationDbContext context = new ApplicationDbContext();
        var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
        ApplicationUser currentUser = userManager.FindByName(User.Identity.GetUserName());        

        viewModel.UserId = currentUser.Id;
        viewModel.UserEmail = currentUser.Email;
        viewModel.UserName = currentUser.UserName;
        viewModel.UserDisplayName = currentUser.DisplayName;

        var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));

        List<string> roles = new List<string>();

        foreach (var role in currentUser.Roles) {
          roles.Add(roleManager.FindById(role.RoleId).Name);
        }

        viewModel.HasRoles = (roles.Count > 0);
        viewModel.Roles = roles.ToArray();
      }



      return View(viewModel);
    }


  }
}