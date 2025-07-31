package controllers

import javax.inject.{Inject, _}
import play.api.libs.json.JsNull
import play.api.mvc._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def welcome = Action {
    Redirect("https://well-planner-248f4a7d862e.herokuapp.com/assets/rubik-presentation-site/well-planner.html")
    // Redirect("https://localhost:9000/assets/rubik-presentation-site/well-planner.html")
  }

  def profile = Action {
    Ok(views.html.profile("Your new application is ready."))
  }

  def projectTasks(projectId: Int, businessId: Int) = Action {
    Ok(views.html.projectTasks("Project Tasks", projectId, businessId))
  }

  def timelinePage(projectId: Int, businessId: Int) = Action {
    Ok(views.html.timeline("Wedding Day Timeline", projectId, businessId))
  }

  def userRegisterPage = Action {
    Ok(views.html.userRegister("User Registration"))
  }

  def projectSettings(projectId: Int, businessId: Int) = Action {
    Ok(views.html.projectSettings("Project Settings", projectId, businessId))
  }

  def projectVendorsShortlists(projectId: Int, businessId: Int) = Action {
    Ok(views.html.projectVendorManager("Project Vendors Shortlists", projectId, businessId))
  }

  def projectBudgetPage(projectId: Int, businessId: Int) = Action {
    Ok(views.html.budget("Project Budget", projectId, businessId))
  }

  def projectPaymentsPage(projectId: Int, businessId: Int) = Action {
    Ok(views.html.payments("Project Payments Tracking", projectId, businessId))
  }

  def projectsPages(businessId: Int) = Action {
    Ok(views.html.projects("Projects", businessId))
  }

  def projectOverviewDashboard(projectId: Int, businessId: Int) = Action {
    Ok(views.html.projectDashboard("Overview", projectId, businessId))
  }

  // TODO temporary page render, this needs to be replaced with profile page which has user authentication built in
  def mainDashboard(businessId: Int) = Action {
    Ok(views.html.mainDashboard(JsNull, 0, businessId))
  }

  def businessSettingsPage(businessId: Int) = Action {
    Ok(views.html.settings(JsNull, 0, businessId))
  }

  def loginPage = Action {
    Ok(views.html.login("Login Page"))
  }

  def registerPage = Action {
    Ok(views.html.register())
  }

  def clientPortalPage() = Action {
    Ok(views.html.clientPortalLogin("Clients Portal"))
  }

  def clientPortalMainPage(projectId: Int, businessId: Int) = Action {
    Ok(views.html.clientsProjectTasks("Clients Portal - Project Tasks", projectId, businessId))
  }

  def clientPortalBudgetPage(projectId: Int, businessId: Int) = Action {
    Ok(views.html.clientPortalBudgetPage("Clients Portal - Budget Page", projectId, businessId))
  }

  def customerPage(businessId: Int) = Action {
    Ok(views.html.customers("Customers", businessId))
  }

  def invoicesPage = Action {
    Ok(views.html.invoices("Invoices"))
  }

  def businessCalendar = Action {
    Ok(views.html.calendar("Calendar"))
  }

  def vendors(businessId: Int) = Action {
    Ok(views.html.vendors("Vendor Contacts", businessId))
  }

  def businessUserRegisterPage = Action {
    Ok(views.html.businessUserRegistration("Welcome to the registration process"))
  }

  def businessTeamUsersSettingsPage = Action {
    Ok(views.html.teamSettings("Welcome to the team settings process"))
  }

}
