#!/usr/bin/env bash
set -euo pipefail

# ---------- EDIT THESE IF YOU WANT CLI ARCHIVE AT THE END ----------
WORKSPACE="ios/MyBenifitAiApp.xcworkspace"
SCHEME="MyBenifitAiApp"
CONFIGURATION="Debug"    # or Release
# -------------------------------------------------------------------

bold() { printf "\n\033[1m%s\033[0m\n" "$*"; }
ok()   { printf "\033[32m✓ %s\033[0m\n" "$*"; }
warn() { printf "\033[33m⚠ %s\033[0m\n" "$*"; }

bold "1) Quit Xcode and kill stuck build/package services"
osascript -e 'tell application "Xcode" to quit' >/dev/null 2>&1 || true
for p in Xcode xcodebuild XCBBuildService xcsbuildd SourceKitService sourcekitd swift-frontend swift packagecollectiond; do
  pkill -9 -x "$p" >/dev/null 2>&1 || true
done
ok "Killed lingering build/package processes"

bold "2) Remove DerivedData, ModuleCache, and all SwiftPM caches"
rm -rf ~/Library/Developer/Xcode/DerivedData/*
rm -rf ~/Library/Developer/Xcode/ModuleCache.noindex
rm -rf ~/Library/Developer/Xcode/Previews
rm -rf ~/Library/Developer/Xcode/SourcePackages
rm -rf ~/Library/Caches/org.swift.swiftpm
rm -rf ~/Library/org.swift.swiftpm
rm -rf ~/Library/Caches/com.apple.dt.Xcode/Downloads
ok "Caches removed"

bold "3) (RN) ensure Pods are installed (safe if already done)"
pushd ios >/dev/null
if command -v bundle >/dev/null 2>&1; then
  bundle exec pod install
else
  pod install
fi
popd >/dev/null
ok "CocoaPods ready"

bold "4) Pre-resolve Swift packages via CLI (avoids GUI deadlock)"
if [ -d "$WORKSPACE" ]; then
  xcodebuild -resolvePackageDependencies -workspace "$WORKSPACE" -scheme "$SCHEME" \
    -clonedSourcePackagesDirPath "$HOME/Library/Developer/Xcode/SourcePackages"
  ok "Swift packages resolved"
else
  warn "Workspace $WORKSPACE not found. Skipping package resolution."
fi

bold "5) Optional quick build to warm caches (Debug)"
if [ -d "$WORKSPACE" ]; then
  xcodebuild -workspace "$WORKSPACE" -scheme "$SCHEME" -configuration "$CONFIGURATION" \
    -destination 'generic/platform=iOS' -disableAutomaticPackageResolution YES \
    -quiet | xcpretty || true
  ok "Warm build attempt finished"
fi

bold "Done. Reopen Xcode and try: Product → Clean Build Folder (⇧⌘K) then Build/Archive."
