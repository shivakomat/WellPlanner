package model.databases

import model.dataModels.VendorContact
import model.dataModels.VendorManage
import model.dataModels.VendorCategory

trait VendorContactsDBApi {

    def addNewVendorContact(contact: VendorContact): Option[Long]

    def byId(contactId: Long): Option[VendorContact]

    def updateBasicVendorInfo(updatedContact: VendorContact): Int

    def updateVendorNotes(contactId: Int, businessId: Int, newNotes: String, modifiedDate: Int): Int

    def list(): Seq[VendorContact]

    def deleteByVendorIdAndBusinessId(contactId: Int, businessId: Int): Int

    def addVendorToManage(vendorManage: VendorManage): Option[Long]

    def byVendorManageId(vendorManageId: Long): Option[VendorManage]

    def addVendorCategory(vendorCategory: VendorCategory): Option[Long]

    def getVendorManageByProject(projectId: Long, businessId: Long): Seq[VendorManage]
}
