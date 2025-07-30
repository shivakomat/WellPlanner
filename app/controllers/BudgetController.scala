package controllers

import com.google.inject.Inject
import controllers.util.ResponseTypes.{errorResponse, successResponse}
import model.api.projects.ProjectBudgetingAPI
import model.dataModels.BudgetBreakdowns
import model.dataModels.Payment
import play.api.Logger
import play.api.db.DBApi
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSClient
import play.api.mvc.{AbstractController, Action, BodyParsers, ControllerComponents, Result}
import scala.concurrent.Future
import controllers.util.JsonFormats._

class BudgetController @Inject() (dbApi: DBApi, cc: ControllerComponents, ws: WSClient) extends AbstractController(cc) {

  private val logger = Logger(this.getClass)

  private val breakdownsApi = new ProjectBudgetingAPI(dbApi, ws)

  def logForSuccess(data: String) =
    logger.info(s"Successfully created \n tasks and id follows : \n { $data } ")

  private def badRequest: Future[Result] =
    Future.successful(errorResponse(BAD_REQUEST, Seq("Unable to recognize request")))


  def updateBreakdownInfo(): Action[JsValue] = Action.async(parse.json) { request =>
    println("Updating task request accepted")

    def updateOperation(breakdown: BudgetBreakdowns): Future[Result] =
      breakdownsApi.updateBudgetBreakdown(breakdown) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully update breakdown item / list ${data.title}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }

    request.body.validate[BudgetBreakdowns].fold(
      errors => badRequest,
      payload => updateOperation(payload)
    )
  }

  def addNew(): Action[JsValue] = Action.async(parse.json) { request =>
    def create(newBreakDown: BudgetBreakdowns): Future[Result] = {
      breakdownsApi.addNewBreakDown(newBreakDown) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully created break down ${data.title}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }
    }
    request.body.validate[BudgetBreakdowns].fold(
      errors => badRequest,
      payload => create(payload)
    )
  }

  def addNewPayment(): Action[JsValue] = Action.async(parse.json) { request =>
    def create(payment: Payment): Future[Result] = {
      breakdownsApi.addPaymentToBudgetItem(payment) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully created a payment")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }
    }
    request.body.validate[Payment].fold(
      errors => badRequest,
      payload => create(payload)
    )
  }

  def updatePayment(): Action[JsValue] = Action.async(parse.json) { request =>

    def updateOperation(payment: Payment): Future[Result] =
      breakdownsApi.updatePayment(payment) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully update payment item to ${data.payment_amount}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }

    request.body.validate[Payment].fold(
      errors => badRequest,
      payload => updateOperation(payload)
    )
  }

  def payments(budgetId: Long, projectId: Int, businessId: Int) =  Action {
    successResponse(OK, Json.toJson(breakdownsApi.paymentsByBudgetItem(budgetId, projectId, businessId)), Seq("Successfully processed"))
  }

  def allPaymentsByProject(projectId: Int, businessId: Int) =  Action {
    successResponse(OK, Json.toJson(breakdownsApi.paymentsByProject(projectId, businessId)), Seq("Successfully processed"))
  }

  def deletePaymentById(paymentId: Int, projectId: Int, businessId: Int, budgetId: Int) = Action {
    successResponse(OK, Json.toJson(breakdownsApi.deletePayment(paymentId, projectId, businessId, budgetId)), Seq("Successfully processed"))
  }

  def budgetBreakdownsBy(businessId: Int, projectId: Int) =  Action {
    successResponse(OK, Json.toJson(breakdownsApi.budgetBreakdownsByProject(projectId, businessId)), Seq("Successfully processed"))
  }

  def deleteBudgetBreakdownById(breakdownId: Int, projectId: Int, businessId: Int) = Action {
    successResponse(OK, Json.toJson(breakdownsApi.deleteBreakDown(breakdownId, projectId, businessId)), Seq("Successfully processed"))
  }
}
