using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace ThirdPartyEmbeddingDemo.Models {

  public class ApplicationUser : IdentityUser {
   
    // add custom properties to user profile
    public string DisplayName { get; set; }

    public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager) {
      // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
      var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
      return userIdentity;
    }
  }

  public class ApplicationDbContext : IdentityDbContext<ApplicationUser> {
    public ApplicationDbContext()
        : base("DefaultConnection", throwIfV1Schema: false) {
      Database.SetInitializer(new IdentityDropCreateInitializer());
    }

    public static ApplicationDbContext Create() {
      return new ApplicationDbContext();
    }
  }

  public class IdentityDropCreateInitializer : DropCreateDatabaseAlways<ApplicationDbContext> {

    protected override void Seed(ApplicationDbContext context) {

      //Seed identity tables here
      var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
      var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new ApplicationDbContext()));

      roleManager.Create(new IdentityRole { Id = "Admin", Name = "Admin" });
 
      userManager.Create(new ApplicationUser { Email = "JasonB@cpt.net", UserName = "JasonB", DisplayName = "Jason Borne" }, "Password1");
      userManager.AddToRole(userManager.FindByEmail("JasonB@cpt.net").Id, "Admin");

      userManager.Create(new ApplicationUser { Email = "JamesB@cpt.net", UserName = "JamesB", DisplayName = "James Bond" }, "Password1");
      userManager.Create(new ApplicationUser { Email = "MaxwellS@cpt.net", UserName = "MaxwellS", DisplayName = "Maxwell Smart" }, "Password1");
      userManager.Create(new ApplicationUser { Email = "EmmaP@cpt.net", UserName = "EmmaP", DisplayName = "Emma Peel" }, "Password1");
      userManager.Create(new ApplicationUser { Email = "AustinP@cpt.net", UserName = "AustinP", DisplayName = "Austin Powers" }, "Password1");

      context.SaveChanges();

    }
  }

}