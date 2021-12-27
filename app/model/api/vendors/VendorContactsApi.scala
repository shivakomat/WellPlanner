package model.api.vendors

import model.dataModels.VendorContact
import model.databases.VendorContactsDB
import model.tools.DateTimeNow
import play.api.db.DBApi
import play.api.libs.ws.WSClient
import model.dataModels.VendorManage

class VendorContactsApi(dbApi: DBApi, ws: WSClient) {

  val vendorContactDbApi = new VendorContactsDB(dbApi)

  def getAllVendoMangeBy(projectId: Int, businessId: Int): Seq[VendorManage] =
    vendorContactDbApi.getVendorManageByProject(projectId, businessId)


  def addNewVendorManage(newVendorManage: VendorManage): Either[String, VendorManage] = {
    val newVendorManageAdded =
      vendorContactDbApi.addVendorToManage(
        newVendorManage.copy(modified_date = Some(DateTimeNow.getCurrent), created_date = Some(DateTimeNow.getCurrent)))

    val vendorManage =
      for {
        id <- newVendorManageAdded
        vendorManageData <- vendorContactDbApi.byVendorManageId(id)
      } yield vendorManageData

    if(vendorManage.nonEmpty)
      Right(vendorManage.get)
    else
      Left("Failed during database insertion or reading the newly created data")
  }

  def addNew(newContact: VendorContact): Either[String, VendorContact] = {
    val newContactAdded =
      vendorContactDbApi
        .addNewVendorContact(
          newContact.copy(modified_date = Some(DateTimeNow.getCurrent), created_date = Some(DateTimeNow.getCurrent)))

    val newVendorContact =
      for {
        id <- newContactAdded
        clientData <- vendorContactDbApi.byId(id)
      } yield clientData

    if(newVendorContact.nonEmpty)
      Right(newVendorContact.get)
    else
      Left("Failed during database insertion or reading the newly created data")
  }

  def updateBasicInfo(contact: VendorContact): Either[String, VendorContact] = {
    val updatedRows = vendorContactDbApi.updateBasicVendorInfo(contact.copy(modified_date = Some(DateTimeNow.getCurrent)))
    if(updatedRows == 1) {
      val updatedClient = vendorContactDbApi.byId(contact.id.get)
      Right(updatedClient.get)
    } else
      Left("Failed during database update or reading the update client data back from database")
  }

  def updateNotes(vendorId: Int, businessId: Int, newNote: String): Either[String, VendorContact] = {
    val rowsUpdated = vendorContactDbApi.updateVendorNotes(vendorId, businessId, newNote, DateTimeNow.getCurrent)
    if(rowsUpdated == 1) {
      Right(vendorContactDbApi.byId(vendorId).get)
    } else {
      Left("Failed during database update")
    }
  }

  def allByBusiness(businessId: Int): Seq[VendorContact] =
    vendorContactDbApi.list().filter(_.business_id == businessId)


  def deleteById(contactId: Int, businessId: Int): Seq[VendorContact] = {
    val rowsDeleted = vendorContactDbApi.deleteByVendorIdAndBusinessId(contactId, businessId)
    vendorContactDbApi.list()
  }

}