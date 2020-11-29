package model.api.businesses

case class AdminSignUpMessage(email: String, businessName: String, socialMediaUrl: String, password: String, auth0Id: String)
