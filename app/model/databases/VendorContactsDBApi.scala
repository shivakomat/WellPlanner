package model.databases

import model.dataModels.VendorContact

trait VendorContactsDBApi {

    def addNewVendorContact(contact: VendorContact): Option[Long]

    def byId(contactId: Long): Option[VendorContact]

    def updateBasicVendorInfo(updatedContact: VendorContact): Int

    def updateVendorNotes(contactId: Int, businessId: Int, newNotes: String, modifiedDate: Int): Int

    def list(): Seq[VendorContact]

    def deleteByVendorIdAndBusinessId(contactId: Int, businessId: Int): Int
}
