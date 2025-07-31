error id: file://<WORKSPACE>/app/model/databases/BusinessDbApi.scala:`<none>`.
file://<WORKSPACE>/app/model/databases/BusinessDbApi.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -model/dataModels/Business#
	 -Business#
	 -scala/Predef.Business#
offset: 291
uri: file://<WORKSPACE>/app/model/databases/BusinessDbApi.scala
text:
```scala
package model.databases

import model.dataModels.Business

trait BusinessDbApi {

  def addNewBusiness(business: Business): Option[Long]

  def list(): Seq[Business]

  def deleteBusiness(id: Int): Int

//  def businessKpi(id: Int)
//
 def updateBusinessInfo(business: Business): Future[Busi@@ness]
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: `<none>`.