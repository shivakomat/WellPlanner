package controllers

import javax.inject.Inject
import play.api.cache._
import play.api.libs.json._
import play.api.mvc._

class ProfileController @Inject() (cache: DefaultSyncCacheApi) extends Controller {

  def AuthenticatedAction(f: Request[AnyContent] => Result): Action[AnyContent] = {
    Action {
      request =>
        println(request.session.get("id"))
        request.session.get("id")
          .flatMap(id => Some(cache.get[JsValue](id + "profile")))
          .map(profile => f(request))
          .orElse(Some(Redirect(routes.HomeController.loginPage()))).get
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
    println("user Id ------>>>>>> " + userId)
    Ok(views.html.mainDashboard(profile, userId, 2))
  }

}

