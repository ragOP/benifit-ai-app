#!/usr/bin/env bash
set -euo pipefail

### ── CONFIG: EDIT ME ─────────────────────────────────────────────
IOS_DIR="ios"
WORKSPACE="MyBenifitAiApp.xcworkspace"   # e.g. your .xcworkspace
SCHEME="MyBenifitAiApp"                   # e.g. your scheme
CONFIGURATION="Release"                   # usually Release
ARCHIVE_PATH="$(pwd)/build/MyBenifitAiApp.xcarchive"
### ───────────────────────────────────────────────────────────────

bold() { printf "\n\033[1m%s\033[0m\n" "$*"; }
info() { printf "• %s\n" "$*"; }
warn() { printf "\033[33m⚠ %s\033[0m\n" "$*"; }
ok()   { printf "\033[32m✓ %s\033[0m\n" "$*"; }
fail() { printf "\033[31m✗ %s\033[0m\n" "$*"; exit 1; }

command -v xcodebuild >/dev/null || fail "xcodebuild not found"
command -v dwarfdump  >/dev/null || fail "dwarfdump not found"

cd "$IOS_DIR"

bold "1) Ensure CocoaPods installed via Bundler (safe to re-run)"
if ! command -v bundle >/dev/null; then
  info "Installing bundler (no sudo)…"
  gem install bundler --no-document
fi
bundle config set path 'vendor/bundle' >/dev/null
bundle install

bold "2) Install Pods with Hermes ON"
export RCT_NO_HERMES=0
bundle exec pod install

bold "3) Clean & Archive"
rm -rf "$ARCHIVE_PATH"
xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -destination "generic/platform=iOS" \
  -archivePath "$ARCHIVE_PATH" \
  clean archive \
  CODE_SIGNING_ALLOWED=YES \
  DEBUG_INFORMATION_FORMAT="dwarf-with-dsym" \
  BUILD_LIBRARY_FOR_DISTRIBUTION=NO

[ -d "$ARCHIVE_PATH" ] || fail "Archive not found at $ARCHIVE_PATH"

bold "4) Find Hermes.framework inside the archive"
APP_FRAMEWORKS_DIR=$(find "$ARCHIVE_PATH/Products/Applications" -type d -name "*.app" -maxdepth 2 | head -n1)/Frameworks
[ -d "$APP_FRAMEWORKS_DIR" ] || fail "No Frameworks folder inside app"
HERMES_FRAMEWORK=$(find "$APP_FRAMEWORKS_DIR" -type d -name "Hermes.framework" -maxdepth 1 | head -n1)
[ -d "$HERMES_FRAMEWORK" ] || fail "Hermes.framework not embedded in the app"
HERMES_BIN="$HERMES_FRAMEWORK/Hermes"
[ -f "$HERMES_BIN" ] || fail "Hermes binary not found"

bold "5) Read UUID(s) from Hermes binary (these are what the dSYM must match)"
BIN_UUIDS=$(dwarfdump -uuid "$HERMES_BIN" | awk '{print $2}')
echo "$BIN_UUIDS" | sed 's/^/   • /'

bold "6) Search for matching Hermes.framework.dSYM"
# Look in Pods, DerivedData, and archive’s own dSYMs for good measure
CANDIDATE_DSYMS=$( \
  { find "Pods" -type d -name "Hermes.framework.dSYM" -prune 2>/dev/null; \
    find ~/Library/Developer/Xcode/DerivedData -type d -name "Hermes.framework.dSYM" 2>/dev/null; \
    find "$ARCHIVE_PATH" -type d -name "Hermes.framework.dSYM" 2>/dev/null; } \
)

[ -n "$CANDIDATE_DSYMS" ] || fail "No Hermes.framework.dSYM candidates found anywhere"

MATCHING_DSYM=""
while IFS= read -r DSYM; do
  DSYM_UUIDS=$(dwarfdump -uuid "$DSYM/Contents/Resources/DWARF/Hermes" 2>/dev/null | awk '{print $2}')
  for U1 in $BIN_UUIDS; do
    for U2 in $DSYM_UUIDS; do
      if [[ "$U1" == "$U2" ]]; then
        MATCHING_DSYM="$DSYM"
      fi
    done
  done
  [ -n "$MATCHING_DSYM" ] && break
done <<< "$CANDIDATE_DSYMS"

if [ -z "$MATCHING_DSYM" ]; then
  warn "No matching Hermes dSYM found for the binary UUID(s):"
  echo "$BIN_UUIDS" | sed 's/^/   • /'
  fail "You likely built Pods with a different toolchain than the app. Try: rm -rf Pods Podfile.lock && pod install, then re-run."
fi

ok "Found matching Hermes dSYM: $MATCHING_DSYM"

bold "7) Inject matching dSYM into archive"
ARCHIVE_DSYMS_DIR="$ARCHIVE_PATH/dSYMs"
mkdir -p "$ARCHIVE_DSYMS_DIR"
rsync -a "$MATCHING_DSYM" "$ARCHIVE_DSYMS_DIR/"
ok "Copied Hermes dSYM into archive dSYMs folder"

bold "8) Verify final match in-place"
FINAL_DSYM="$ARCHIVE_DSYMS_DIR/$(basename "$MATCHING_DSYM")"
FINAL_UUIDS=$(dwarfdump -uuid "$FINAL_DSYM/Contents/Resources/DWARF/Hermes" | awk '{print $2}')
echo "Archive Hermes dSYM UUIDs now:"
echo "$FINAL_UUIDS" | sed 's/^/   • /'

ok "Done. Open Xcode → Organizer, select this archive and use “Distribute Content → Re-upload dSYMs”."
echo
echo "If you prefer CLI, create a zip of $ARCHIVE_DSYMS_DIR and upload via Xcode Organizer."
