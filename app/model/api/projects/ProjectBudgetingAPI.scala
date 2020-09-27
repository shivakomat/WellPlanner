package model.api.projects

import model.dataModels.BudgetBreakdowns
import model.databases.BudgetingDbApi
import model.tools.DateTimeNow
import play.api.db.DBApi
import play.api.libs.ws.WSClient

class ProjectBudgetingAPI(dbApi: DBApi, ws: WSClient) {

  private val breakDownsDb = new BudgetingDbApi(dbApi)

  def budgetBreakdownsByProject(projectId: Long, businessId: Long): Seq[BudgetBreakdownList] = {
    val list = breakDownsDb.allBudgetBreakdowns()

    val mapOfParentBudgetWithBreakdowns = list.groupBy(e => e.parent_budget_id)
    val parentBudgetBreakdowns = mapOfParentBudgetWithBreakdowns.get(None)

    if(parentBudgetBreakdowns.nonEmpty)
        parentBudgetBreakdowns.get.map(parentBudget => BudgetBreakdownList(breakDown = parentBudget, subBreakDowns = mapOfParentBudgetWithBreakdowns.getOrElse(parentBudget.id, Seq.empty[BudgetBreakdowns])))
    else {
        Seq.empty[BudgetBreakdownList]
    }
  }

  def addNewBreakDown(breakDown: BudgetBreakdowns): Either[String, BudgetBreakdowns] = {
     val newBreakDownAdded =
       breakDownsDb.addNewBreakDown(breakDown.copy(modified_date = Some(DateTimeNow.getCurrent), created_date = Some(DateTimeNow.getCurrent)))

     val newBreakDown =
       for {  id <- newBreakDownAdded
         breakDown <- breakDownsDb.byBudgetBreakDownId(id)
       } yield (breakDown)

     newBreakDown match {
       case Some(_) => Right(newBreakDown.get)
       case None => Left("failed during database insertion or reading the newly created data")
     }
  }


  def deleteBreakDown(id: Long, projectId: Long, businessId: Long): Seq[BudgetBreakdownList] = {
    val rowsDeleted = breakDownsDb.deleteBudgetBreakDown(id, projectId, businessId)
    this.budgetBreakdownsByProject(projectId, businessId)
  }

}
