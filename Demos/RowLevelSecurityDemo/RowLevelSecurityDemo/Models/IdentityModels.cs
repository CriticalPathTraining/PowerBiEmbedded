using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace RowLevelSecurityDemo.Models {

  public class ApplicationUser : IdentityUser {
    // custom properties
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

  public class IdentityDropCreateInitializer :
    DropCreateDatabaseAlways<ApplicationDbContext> {
    protected override void Seed(ApplicationDbContext context) {
      //Seed identity tables here
      var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
      var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new ApplicationDbContext()));


      roleManager.Create(new IdentityRole { Id = "Admin", Name = "Admin" });
      roleManager.Create(new IdentityRole { Id = "AllSalesRegions", Name = "All Sales Regions" });
      roleManager.Create(new IdentityRole { Id = "EasternSalesRegion", Name = "Eastern Sales Region" });
      roleManager.Create(new IdentityRole { Id = "CentralSalesRegion", Name = "Central Sales Region" });
      roleManager.Create(new IdentityRole { Id = "WesternSalesRegion", Name = "Western Sales Region" });

      userManager.Create(new ApplicationUser { Email = "JasonB@cpt.net", UserName = "JasonB", DisplayName = "Jason Borne" }, "Password1");
      userManager.AddToRole(userManager.FindByEmail("JasonB@cpt.net").Id, "Admin");
      userManager.AddToRole(userManager.FindByEmail("JasonB@cpt.net").Id, "All Sales Regions");

      userManager.Create(new ApplicationUser { Email = "JamesB@cpt.net", UserName = "JamesB", DisplayName = "James Bond" }, "Password1");
      userManager.AddToRole(userManager.FindByEmail("JamesB@cpt.net").Id, "Eastern Sales Region");
      userManager.AddClaim(userManager.FindByEmail("JamesB@cpt.net").Id, new Claim("ViewState", "MA"));
      userManager.AddClaim(userManager.FindByEmail("JamesB@cpt.net").Id, new Claim("ViewState", "CT"));
      userManager.AddClaim(userManager.FindByEmail("JamesB@cpt.net").Id, new Claim("ViewState", "NY"));
      userManager.AddClaim(userManager.FindByEmail("JamesB@cpt.net").Id, new Claim("ViewState", "NJ"));
      userManager.AddClaim(userManager.FindByEmail("JamesB@cpt.net").Id, new Claim("ViewState", "PA"));

      userManager.Create(new ApplicationUser { Email = "MaxwellS@cpt.net", UserName = "MaxwellS", DisplayName = "Maxwell Smart" }, "Password1");
      userManager.AddToRole(userManager.FindByEmail("MaxwellS@cpt.net").Id, "Central Sales Region");
      userManager.AddClaim(userManager.FindByEmail("MaxwellS@cpt.net").Id, new Claim("ViewState", "FL"));
      userManager.AddClaim(userManager.FindByEmail("MaxwellS@cpt.net").Id, new Claim("ViewState", "GA"));
      userManager.AddClaim(userManager.FindByEmail("MaxwellS@cpt.net").Id, new Claim("ViewState", "NC"));
      userManager.AddClaim(userManager.FindByEmail("MaxwellS@cpt.net").Id, new Claim("ViewState", "LA"));
      userManager.AddClaim(userManager.FindByEmail("MaxwellS@cpt.net").Id, new Claim("ViewState", "Al"));

      userManager.Create(new ApplicationUser { Email = "EmmaP@cpt.net", UserName = "EmmaP", DisplayName = "Emma Peel" }, "Password1");
      userManager.AddToRole(userManager.FindByEmail("EmmaP@cpt.net").Id, "Western Sales Region");
      userManager.AddClaim(userManager.FindByEmail("EmmaP@cpt.net").Id, new Claim("ViewState", "AZ"));
      userManager.AddClaim(userManager.FindByEmail("EmmaP@cpt.net").Id, new Claim("ViewState", "NM"));
      userManager.AddClaim(userManager.FindByEmail("EmmaP@cpt.net").Id, new Claim("ViewState", "TX"));

      userManager.Create(new ApplicationUser { Email = "AustinP@cpt.net", UserName = "AustinP", DisplayName = "Austin Powers" }, "Password1");
      userManager.AddToRole(userManager.FindByEmail("AustinP@cpt.net").Id, "Eastern Sales Region");
      userManager.AddToRole(userManager.FindByEmail("AustinP@cpt.net").Id, "Central Sales Region");
      userManager.AddClaim(userManager.FindByEmail("AustinP@cpt.net").Id, new Claim("ViewState", "UT"));
      userManager.AddClaim(userManager.FindByEmail("AustinP@cpt.net").Id, new Claim("ViewState", "CO"));
      userManager.AddClaim(userManager.FindByEmail("AustinP@cpt.net").Id, new Claim("ViewState", "AZ"));
      userManager.AddClaim(userManager.FindByEmail("AustinP@cpt.net").Id, new Claim("ViewState", "NM"));
      userManager.AddClaim(userManager.FindByEmail("AustinP@cpt.net").Id, new Claim("ViewState", "TX"));

      context.SaveChanges();

      //userManager.AddToRole("ted@ted.net", "EasternRegion");

      //8context.SaveChanges();
    }
  }


}