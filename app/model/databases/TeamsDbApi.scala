package model.databases

import model.dataModels.TeamMember

trait TeamsDbApi {
  def addNewTeamMember(teamMember: TeamMember): Option[Long]

  def list(businessId: Int): Seq[TeamMember]

  def byBusinessIdAndMemberId(businessId: Int, memberId: Int): Option[TeamMember]

  def updateTeamMemberBy(updatedTeamMember: TeamMember): Int
}

