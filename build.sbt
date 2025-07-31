name := "well-planner"

version := "1.0"

scalaVersion := "2.13.12"
lazy val playVersion = "2.9.0"

// Force scala-xml to resolve version conflicts (required for Play plugins)
dependencyOverrides += "org.scala-lang.modules" %% "scala-xml" % "1.2.0"

// Enable Play Framework
lazy val wellplanner = (project in file(".")).enablePlugins(PlayScala)

// Modern, working resolvers
resolvers ++= Seq(
  "Akka Snapshot Repository" at "https://repo.akka.io/snapshots/"
)

// Required Play modules
libraryDependencies ++= Seq(
  guice,
  ehcache,
  ws,
  specs2 % Test,
  evolutions,
  caffeine,
  "com.h2database" % "h2" % "1.4.197",
  "org.playframework.anorm" %% "anorm" % "2.7.0",
  "org.postgresql" % "postgresql" % "42.7.3", // upgraded for SCRAM-SHA-256 auth
  "com.typesafe.play" %% "play-slick" % "5.1.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "5.1.0",
  "com.typesafe.slick" %% "slick-codegen" % "3.4.1",
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test,
  "com.sun.mail" % "javax.mail" % "1.6.2",
  "com.typesafe.akka" %% "akka-http-core" % "10.2.10",
  "org.jsoup" % "jsoup" % "1.11.3",
  "com.typesafe.play" %% "play-json-joda" % "2.10.0",
  "com.github.jwt-scala" %% "jwt-play" % "9.4.4",
  "com.github.jwt-scala" %% "jwt-core" % "9.4.4",
  "com.auth0" % "jwks-rsa" % "0.6.1",
  "net.java.dev.jna" % "jna" % "5.13.0",
  "com.typesafe.play" %% "play" % playVersion
)

// sbt-web fix for Play's test assets
unmanagedResourceDirectories in Test += baseDirectory.value / "target/web/public/test"

// Disable file watch service (optional but speeds up dev mode on macOS)
javaOptions in Runtime += "-Dplay.fileWatchService=noop"
