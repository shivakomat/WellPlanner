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
    Ok(views.html.welcome_page("Welcome to Travel Buddy - Travel management site for everyone"))
  }

  def profile = Action {
    Ok(views.html.profile("Your new application is ready."))
  }

  def projectTasks = Action {
    Ok(views.html.projectTasks("Project Tasks"))
  }

  def projectBudgetPage = Action {
    Ok(views.html.budget("Project Budget"))
  }

  def projectsPages(businessId: Int) = Action {
    Ok(views.html.projects("Projects", businessId))
  }

  // TODO temporary page render, this needs to be replaced with profile page which has user authentication built in
  def mainDashboard(businessId: Int) = Action {
    Ok(views.html.mainDashboard(JsNull, 0, businessId))
  }

  def settingsPage = Action {
    Ok(views.html.projectSettings("Company Settings"))
  }

  def loginPage = Action {
    Redirect("https://well-wedding-planner.herokuapp.com/rubik-presentation-site/well-planner.html")
  }

  def registerPage = Action {
    Ok(views.html.register())
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
