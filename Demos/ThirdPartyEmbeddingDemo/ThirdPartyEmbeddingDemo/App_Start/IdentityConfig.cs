using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using ThirdPartyEmbeddingDemo.Models;

namespace ThirdPartyEmbeddingDemo {

  // Configure the application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.
  public class ApplicationUserManager : UserManager<ApplicationUser> {

    public ApplicationUserManager(IUserStore<ApplicationUser> store)
        : base(store) {
    }

    public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context) {

      var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context.Get<ApplicationDbContext>()));

      manager.UserValidator = new UserValidator<ApplicationUser>(manager) {
        AllowOnlyAlphanumericUserNames = false,
        RequireUniqueEmail = true
      };

      // Configure validation logic for passwords
      manager.PasswordValidator = new PasswordValidator {
        RequiredLength = 6,
        RequireDigit = false,
        RequireLowercase = false,
        RequireNonLetterOrDigit = false,
        RequireUppercase = false
      };

      // Configure user lockout defaults
      manager.UserLockoutEnabledByDefault = false;
      manager.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5);
      manager.MaxFailedAccessAttemptsBeforeLockout = 5;

      var dataProtectionProvider = options.DataProtectionProvider;
      if (dataProtectionProvider != null) {
        manager.UserTokenProvider =
            new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("ASP.NET Identity"));
      }
      return manager;
    }
  }

  // Configure the application sign-in manager which is used in this application.
  public class ApplicationSignInManager : SignInManager<ApplicationUser, string> {

    public ApplicationSignInManager(ApplicationUserManager userManager, IAuthenticationManager authenticationManager)
        : base(userManager, authenticationManager) {
    }

    public override Task<ClaimsIdentity> CreateUserIdentityAsync(ApplicationUser user) {
      return user.GenerateUserIdentityAsync((ApplicationUserManager)UserManager);
    }

    public static ApplicationSignInManager Create(IdentityFactoryOptions<ApplicationSignInManager> options, IOwinContext context) {
      return new ApplicationSignInManager(context.GetUserManager<ApplicationUserManager>(), context.Authentication);
    }

  }

}