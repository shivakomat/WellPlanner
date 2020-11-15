package model.api.projects

case class NewWeddingProjectMessage(bride: String, groom: String, eventDate: Int, budget: Double, businessId: Int, clientId: Int)