package model.databases

import anorm.{Macro, RowParser, SQL}
import javax.inject.Inject
import model.dataModels.{BudgetBreakdowns, BudgetPayments}
import play.api.db.DBApi

class BudgetingDbApi @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) {

  val budgetBreakDownParser: RowParser[BudgetBreakdowns] = Macro.namedParser[BudgetBreakdowns]

  def addNewBreakDown(budgetBreakdown: BudgetBreakdowns): Option[Long] =
    db.withConnection { implicit connection =>
      SQL("insert into budget_breakdowns(title , parent_budget_id, is_budget_header, estimate, actual, project_id, business_id, modified_date, created_date) " +
        "values ({title} , {parent_budget_id} , {is_budget_header}, {estimate}, {actual},  {project_id}, {business_id}, {modified_date}, {created_date})")
        .on("title"  -> budgetBreakdown.title, "parent_budget_id" -> budgetBreakdown.parent_budget_id, "is_budget_header" -> budgetBreakdown.is_budget_header,
          "estimate" -> budgetBreakdown.estimate, "actual" -> budgetBreakdown.actual, "project_id" -> budgetBreakdown.project_id,  "business_id" -> budgetBreakdown.business_id,
          "modified_date" -> budgetBreakdown.modified_date, "created_date" -> budgetBreakdown.created_date)
        .executeInsert()
    }

  def allBudgetBreakdowns(): Seq[BudgetBreakdowns] =
    db.withConnection { implicit connection =>
      SQL("select * from  budget_breakdowns").as(budgetBreakDownParser.*)
    }

  def byBudgetBreakDownId(id : Long): Option[BudgetBreakdowns] =
    db.withConnection { implicit connection =>
      SQL(s"select * from budget_breakdowns where id = {id}")
        .on("id" -> id)
        .as(budgetBreakDownParser.singleOpt)
    }

  def deleteBudgetBreakDown(id: Long, projectId: Long, businessId: Long): Int =
    db.withConnection { implicit connection =>
      SQL("delete from budget_breakdowns where id = {id} and business_id = {business_id}")
        .on("id" -> id, "projectId" -> projectId, "business_id" -> businessId)
        .executeUpdate()
    }
}