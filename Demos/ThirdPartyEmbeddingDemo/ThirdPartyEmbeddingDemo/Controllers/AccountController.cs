using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using ThirdPartyEmbeddingDemo.Models;

namespace ThirdPartyEmbeddingDemo.Controllers {

  [Authorize]
  public class AccountController : Controller {

    private ApplicationSignInManager _signInManager;
    private ApplicationUserManager _userManager;

    public AccountController() {
    }

    public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) {
      UserManager = userManager;
      SignInManager = signInManager;
    }

    public ApplicationSignInManager SignInManager {
      get {
        return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
      }
      private set {
        _signInManager = value;
      }
    }

    public ApplicationUserManager UserManager {
      get {
        return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
      }
      private set {
        _userManager = value;
      }
    }

    // GET: /Account/Login
    [AllowAnonymous]
    public ActionResult Login(string returnUrl) {
      ViewBag.ReturnUrl = returnUrl;
      return View();
    }

    //
    // POST: /Account/Login
    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> Login(LoginViewModel model, string returnUrl) {

      if (!ModelState.IsValid) {
        return View(model);
      }

      // This doesn't count login failures towards account lockout
      // To enable password failures to trigger account lockout, change to shouldLockout: true
      var result = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, shouldLockout: false);
      switch (result) {
        case SignInStatus.Success:
          return RedirectToLocal(returnUrl);
        case SignInStatus.LockedOut:
          return View("Lockout");
        case SignInStatus.RequiresVerification:
          return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
        case SignInStatus.Failure:
        default:
          ModelState.AddModelError("", "Invalid login attempt.");
          return View(model);
      }
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult LogOff() {
      AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
      return RedirectToAction("Index", "Home");
    }

    private IAuthenticationManager AuthenticationManager {
      get {
        return HttpContext.GetOwinContext().Authentication;
      }
    }


    private ActionResult RedirectToLocal(string returnUrl) {
      if (Url.IsLocalUrl(returnUrl)) {
        return Redirect(returnUrl);
      }
      return RedirectToAction("Index", "Home");
    }


  }
}