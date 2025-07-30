package controllers

import com.google.inject.Inject
import controllers.util.JsonFormats._
import controllers.util.ResponseTypes.{errorResponse, successResponse}
import model.api.vendors.VendorContactsApi
import model.dataModels.VendorContact
import model.dataModels.VendorManage
import play.api.Logger
import play.api.db.DBApi
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.Future

class VendorContactsController  @Inject()(dbApi: DBApi, cc: ControllerComponents, ws: WSClient) extends AbstractController(cc) {

  private val logger = Logger(this.getClass)

  private val vendorContactsApi = new VendorContactsApi(dbApi, ws)

  def logForSuccess(data: String) =
    logger.info(s"Successfully created a new client and details follow : \n { $data } ")

  private def badRequest: Future[Result] =
    Future.successful(errorResponse(BAD_REQUEST, Seq("Unable to recognize request")))

  def newVendorContact(): Action[JsValue] = Action.async(parse.json) { request =>
    println("A new vendor contact request accepted ")

    def createContact(newVendor: VendorContact): Future[Result] =
      vendorContactsApi.addNew(newVendor) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully created client ${data.name}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }

    request.body.validate[VendorContact].fold(
      errors => badRequest,
      payload => createContact(payload)
    )
  }

  def vendorManagesBy(projectId: Int, businessId: Int) =  Action {
    successResponse(OK, Json.toJson(vendorContactsApi.getAllVendoMangeBy(projectId, businessId)), Seq("Successfully processed"))
  }

  def newVendorManage(): Action[JsValue] = Action.async(parse.json) { request =>
    println("A new vendor manage request accepted ")

    def createVendorManage(newVendorManageItem: VendorManage): Future[Result] =
      vendorContactsApi.addNewVendorManage(newVendorManageItem) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully created vendor to manage ${data.id}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }

    request.body.validate[VendorManage].fold(
      errors => badRequest,
      payload => createVendorManage(payload)
    )
  }

  def updateVendorContact(): Action[JsValue] = Action.async(parse.json) { request =>
    println("Updating vendor contact request accepted")

    def update(vendor: VendorContact): Future[Result] =
      vendorContactsApi.updateBasicInfo(vendor) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully update client ${data.name}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }

    request.body.validate[VendorContact].fold(
      errors => badRequest,
      payload => update(payload)
    )
  }

  def vendorContactsByBusiness(businessId: Int) =  Action {
    successResponse(OK, Json.toJson(vendorContactsApi.allByBusiness(businessId)), Seq("Successfully processed"))
  }

  def deleteVendorById(vendorId: Int, businessId: Int) = Action {
    successResponse(OK, Json.toJson(vendorContactsApi.deleteById(vendorId, businessId)), Seq("Successfully processed"))
  }

}