package model.dataModels

case class VendorContact(id: Option[Int] = None, name: Option[String] = None, description: String, contact: String, location: String,
                         vendor_type: Option[String] = None, phone_number: String, email: Option[String] = None, estimated_costs: Double,
                         notes: Option[String] = None, business_id: Int, modified_date: Option[Int] = None, created_date: Option[Int] = None)


case class VendorManage(id: Option[Int] = None, vendor_contact_id: Int, project_id: Int, business_id: Int, modified_date: Option[Int] = None, created_date: Option[Int] = None)

case class VendorCategory(id: Option[Int] = None, name: String, project_id: Int, business_id: Int, modified_date: Option[Int] = None, created_date: Option[Int] = None)