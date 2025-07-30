logLevel := Level.Warn

resolvers += "Typesafe repository" at "https://repo.typesafe.com/typesafe/releases/"

// Use the latest stable Play 2.9 plugin
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.9.0")

// Recommended: sbt-native-packager (used by Play for packaging/deployment tasks)
addSbtPlugin("com.github.sbt" % "sbt-native-packager" % "1.10.0")




