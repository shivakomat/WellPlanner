package model.api.clients

case class NewClientMessage(clientId: Option[Int], customerName: String, phoneNumber: String, emailAddress: String,
                            eventType: String, budget: Double, notes: Option[String] = None, status: String, businessId: Int)
