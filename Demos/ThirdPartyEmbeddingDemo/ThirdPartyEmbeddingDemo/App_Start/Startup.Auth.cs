using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ThirdPartyEmbeddingDemo.Models;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin;
using Microsoft.AspNet.Identity.Owin;

namespace ThirdPartyEmbeddingDemo {
  public partial class Startup {

    public void ConfigureAuth(IAppBuilder app) {

      // Configure the db context, user manager and signin manager to use a single instance per request
      app.CreatePerOwinContext(ApplicationDbContext.Create);
      app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
      app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);

      app.UseCookieAuthentication(new CookieAuthenticationOptions {
        AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
        LoginPath = new PathString("/Account/Login"),
        Provider = new CookieAuthenticationProvider {
          // Enables the application to validate the security stamp when the user logs in.
          // This is a security feature which is used when you change a password or add an external login to your account.  
          OnValidateIdentity = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager, ApplicationUser>(
                  validateInterval: TimeSpan.FromMinutes(30),
                  regenerateIdentity: (manager, user) => user.GenerateUserIdentityAsync(manager))
        }
      });

      ApplicationDbContext db = new ApplicationDbContext();
      db.Database.Initialize(true);


    }
  }
}