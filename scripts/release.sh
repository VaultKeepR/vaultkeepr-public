#!/usr/bin/env bash
# VaultKeepR — publish a signed release from locally built artifacts.
#
# The apps are closed-source and built on a developer machine, so provenance
# is established by signature, not by CI build attestation: every artifact is
# signed with minisign (Ed25519) and a signed checksums.txt covers the set.
# The public key is committed at the repository root (minisign.pub).
#
# One-time setup (developer Mac):
#   brew install minisign gh
#   minisign -G -p minisign.pub -s ~/.minisign/vaultkeepr-release.key
#   # -> send minisign.pub to be committed into this repository
#
# Per release:
#   ./scripts/release.sh 0.2.0 \
#       vaultkeepr-android-v0.2.0.apk \
#       vaultkeepr-ios-v0.2.0.ipa \
#       vaultkeepr-firefox-v0.2.0.zip \
#       vaultkeepr-chrome-v0.2.0.zip
#
# Recommended artifact naming: <product>-<platform>-v<version>.<ext>
# so verification instructions stay copy-pasteable in SECURITY.md.
set -euo pipefail

VERSION="${1:?usage: release.sh <version> <artifact>... (version without leading v)}"
shift
ARTIFACTS=("$@")
[ "${#ARTIFACTS[@]}" -gt 0 ] || { echo "error: no artifacts given" >&2; exit 1; }

command -v gh >/dev/null      || { echo "error: gh CLI required (brew install gh)" >&2; exit 1; }
command -v minisign >/dev/null || { echo "error: minisign required (brew install minisign)" >&2; exit 1; }
command -v shasum >/dev/null  || { echo "error: shasum required" >&2; exit 1; }

KEY="${MINISIGN_KEY:-$HOME/.minisign/vaultkeepr-release.key}"
[ -f "$KEY" ] || { echo "error: signing key not found at $KEY (see header for setup)" >&2; exit 1; }

# minisign reads the passphrase from stdin when no TTY is attached; feeding
# one empty line per invocation keeps automated runs working with an
# empty-passphrase key (interactive runs keep the normal prompt).
sign() {
  if [ -t 0 ]; then minisign -S -s "$KEY" -m "$1"
  else printf '\n' | minisign -S -s "$KEY" -m "$1"; fi
}

TAG="v${VERSION#v}"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
echo "==> staging ${#ARTIFACTS[@]} artifact(s) for ${TAG}"

for artifact in "${ARTIFACTS[@]}"; do
  [ -f "$artifact" ] || { echo "error: artifact not found: $artifact" >&2; exit 1; }
  base="$(basename "$artifact")"
  cp "$artifact" "$STAGE/$base"
  sign "$STAGE/$base"
  echo "    signed: $base (+ .minisig)"
done

# checksums.txt covers every artifact (not the signatures themselves,
# not itself) — then the whole set is sealed by signing checksums.txt.
( cd "$STAGE"
  for f in *; do
    case "$f" in *.minisig|checksums.txt) continue ;; esac
    shasum -a 256 "$f"
  done > checksums.txt )
sign "$STAGE/checksums.txt"
echo "==> checksums.txt written and signed"

gh release view "$TAG" >/dev/null 2>&1 && \
  { echo "error: release $TAG already exists" >&2; exit 1; }

gh release create "$TAG" "$STAGE"/* \
  --verify \
  --title "VaultKeepR ${TAG}" \
  --generate-notes

echo ""
echo "==> ${TAG} published with:"
ls -1 "$STAGE"
echo ""
echo "Users verify with:  minisign -Vm <artifact> -p minisign.pub  (key committed in this repo)"
