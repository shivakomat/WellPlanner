package controllers

import javax.inject.Inject
import util.JsonFormats._
import model.api.users.UsersFacade
import play.api.cache._
import play.api.db.DBApi
import play.api.libs.json._
import play.api.mvc._

class ProfileController @Inject() (dbApi: DBApi, cache: DefaultSyncCacheApi, cc: ControllerComponents) extends BaseController {
  override protected def controllerComponents: ControllerComponents = cc

  private val userApi = new UsersFacade(dbApi)

  def AuthenticatedAction(f: Request[AnyContent] => Result): Action[AnyContent] = {
    Action {
      request =>
        println(request.session.get("id"))
        request.session.get("id")
          .flatMap(id => Some(cache.get[JsValue](id + "profile")))
          .map(profile => f(request))
          .orElse(Some(Redirect(routes.HomeController.loginPage))).get
    }
  }

  def getUserId(session: Session): Int = {
    val id = session.get("id").get
    val profile = cache.get[JsValue](id + "profile").get
    println(id)
    println(profile)
    (profile \ "app_user_id").as[Int]
  }


  def profilePage: Action[AnyContent] = AuthenticatedAction { request =>
    val id = request.session.get("id").get
    val profile = cache.get[JsValue](id + "profile").get
    val userId = (profile \ "app_user_id").as[Int]
    val authUserId =  (profile \ "sub").as[String].split('|').last
    println("------------------->")
    println(id)
    println(profile)
    println(userId)
    println(authUserId)
    println("------------------->")
    val user = userApi.byAuth0Id(authUserId).get
    Ok(views.html.mainDashboard(Json.toJson(user), user.id.get, user.business_id))
  }

  def businessMainPage: Action[AnyContent]  = AuthenticatedAction { request =>
    val id = request.session.get("id").get
    val profile = cache.get[JsValue](id + "profile").get
    val userId = (profile \ "app_user_id").as[Int]
    val authUserId =  (profile \ "sub").as[String].split('|').last
    val user = userApi.byAuth0Id(authUserId).get
    Ok(views.html.mainDashboard(Json.toJson(user), user.id.get, user.business_id))
  }

}

