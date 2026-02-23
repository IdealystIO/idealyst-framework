require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "idealyst-live-activity"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["documentation"]
  s.license      = package["license"]
  s.authors      = { "Idealyst" => "contact@idealyst.io" }
  s.source       = { :git => package["repository"]["url"], :tag => s.version }

  s.platforms    = { :ios => "16.2" }
  s.swift_version = "5.9"

  s.source_files = "ios/**/*.{swift,h,m,mm}"

  s.dependency "React-Core"

  s.frameworks = "ActivityKit", "WidgetKit", "SwiftUI"
end
