package model.api.projects

import model.dataModels.BudgetBreakdowns

case class BudgetBreakdownList(breakDown: BudgetBreakdowns, subBreakDowns: Seq[BudgetBreakdowns])
