package model.databases

import anorm.{Macro, RowParser, _}
import javax.inject.Inject
import model.dataModels.VendorContact
import model.dataModels.VendorManage
import model.dataModels.VendorCategory
import play.api.db.DBApi

@javax.inject.Singleton
class VendorContactsDB @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) with VendorContactsDBApi  {

  val parser: RowParser[VendorContact] = Macro.namedParser[VendorContact]
  val vendorManageParser: RowParser[VendorManage] = Macro.namedParser[VendorManage]

  override def addNewVendorContact(contact: VendorContact): Option[Long] = {
    db.withConnection { implicit connection =>
      SQL("insert into vendor_contacts(name, description, contact, location, vendor_type, phone_number, email, estimated_costs, notes, business_id, modified_date, created_date) " +
        "values ({name} , {description}, {contact}, {location}, {vendor_type} , {phone_number}, {email}, {estimated_costs}, {notes}, {business_id}, {modified_date}, {created_date})")
        .on("name"  -> contact.name, "phone_number" -> contact.phone_number, "description" -> contact.description, "contact" -> contact.contact, "location" -> contact.location,
            "vendor_type" -> contact.vendor_type, "email" -> contact.email, "notes" -> contact.notes, "estimated_costs" -> contact.estimated_costs,  "business_id" -> contact.business_id,
          "modified_date" -> contact.modified_date, "created_date" -> contact.created_date)
        .executeInsert()
    }
  }

  override def byId(contactId: Long): Option[VendorContact] =
    db.withConnection { implicit connection =>
      SQL(s"select * from vendor_contacts where id = {contactId}")
        .on("contactId" -> contactId)
        .as(parser.singleOpt)
    }

  override def getVendorManageByProject(projectId: Long, businessId: Long): Seq[VendorManage] =
    db.withConnection { implicit connection =>
      SQL(s"select * from vendor_manage where project_id = {projectId} and business_id = {businessId}")
        .on("projectId" -> projectId, "businessId" -> businessId)
        .as(vendorManageParser.*)
    }

  override def updateBasicVendorInfo(updatedContact: VendorContact): Int =
    db.withConnection { implicit connection =>
      SQL("update vendor_contacts set name = {name}, description = {description}, email = {email}, location = {location}, contact = {contact}," +
        " vendor_type = {vendor_type}, phone_number = {phone_number}, estimated_costs = {estimated_costs}, modified_date = {modified_date}" +
        " where id = {contact_id} and business_id = {business_id}")
        .on("name" -> updatedContact.name, "description" -> updatedContact.description, "email" -> updatedContact.email,"phone_number" -> updatedContact.phone_number, "estimated_costs" -> updatedContact.estimated_costs,
          "vendor_type" -> updatedContact.vendor_type, "location" -> updatedContact.location, "contact" -> updatedContact.contact,
          "modified_date" -> updatedContact.modified_date, "business_id" -> updatedContact.business_id, "contact_id" -> updatedContact.id)
        .executeUpdate()
    }

  override def updateVendorNotes(contactId: Int, businessId: Int, newNotes: String, modifiedDate: Int): Int =
    db.withConnection { implicit connection =>
      SQL("update vendor_contacts set notes = {new_notes}, modified_date = {modified_date}" +
        " where id = {contactId} and business_id = {businessId}")
        .on("modified_date" -> modifiedDate, "businessId" -> businessId, "contactId" -> contactId)
        .executeUpdate()
    }

  override def list(): Seq[VendorContact] =
    db.withConnection { implicit connection =>
      SQL("select * from vendor_contacts").as(parser.*)
    }

  override def deleteByVendorIdAndBusinessId(contactId: Int, businessId: Int): Int =
    db.withConnection { implicit connection =>
      SQL("delete from vendor_contacts where id = {contactId} and business_id = {businessId}")
        .on("contactId" -> contactId, "businessId" -> businessId)
        .executeUpdate()
    }

  override def addVendorToManage(vendorManage: VendorManage): Option[Long] =
    db.withConnection { implicit connection =>
      SQL("insert into vendor_manage(vendor_contact_id, project_id, business_id, modified_date, created_date) " +
        "values ({vendor_contact_id} , {project_id}, {business_id}, {modified_date}, {created_date})")
        .on("vendor_contact_id"  -> vendorManage.vendor_contact_id, "project_id" -> vendorManage.project_id,  "business_id" -> vendorManage.business_id,
          "modified_date" -> vendorManage.modified_date, "created_date" -> vendorManage.created_date)
        .executeInsert()
    }

  override def addVendorCategory(vendorCategory: VendorCategory): Option[Long] =
    db.withConnection { implicit connection =>
      SQL("insert into vendor_categories(name, project_id, business_id, modified_date, created_date) " +
        "values ({name} , {project_id}, {business_id}, {modified_date}, {created_date})")
        .on("name"  -> vendorCategory.name, "project_id" -> vendorCategory.project_id, "business_id" -> vendorCategory.business_id,
          "modified_date" -> vendorCategory.modified_date, "created_date" -> vendorCategory.created_date)
        .executeInsert()
    }

  override def byVendorManageId(vendorManageId: Long): Option[VendorManage] =
    db.withConnection { implicit connection =>
      SQL(s"select * from vendor_manage where id = {vendorManageId}")
        .on("vendorManageId" -> vendorManageId)
        .as(vendorManageParser.singleOpt)
    }

}