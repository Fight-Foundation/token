#!/usr/bin/env bash
# Verified build workflow for Solana programs per https://solana.com/docs/programs/verified-builds
# Project-specific defaults are set for FIGHT's OFT program.

set -euo pipefail

# ------- Config (override via env) -------
PROGRAM_ID=${PROGRAM_ID:-FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL}
LIB_NAME=${LIB_NAME:-oft}
REPO_URL=${REPO_URL:-https://github.com/Fight-Foundation/token}
MOUNT_PATH=${MOUNT_PATH:-programs/oft}
RPC_URL=${SOLANA_RPC_URL:-https://api.mainnet-beta.solana.com}
UPLOADER=${UPLOADER:-}   # Public key of the program authority (wallet or Squads vault)

# ------- Helpers -------
log() { echo -e "\033[1;34m[verified-build]\033[0m $*"; }
warn() { echo -e "\033[1;33m[warn]\033[0m $*"; }
err() { echo -e "\033[1;31m[error]\033[0m $*"; }

need() { command -v "$1" >/dev/null 2>&1 || { err "Missing required command: $1"; exit 1; }; }

# ------- Pre-flight -------
need docker
need cargo
need solana-verify || true

if ! command -v solana-verify >/dev/null 2>&1; then
  warn "solana-verify not found. Installing via cargo (cargo install solana-verify) ..."
  cargo install solana-verify
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  err "This script must be run inside a git repository (for commit hash)."
  exit 1
fi

COMMIT_HASH=${COMMIT_HASH:-$(git rev-parse HEAD)}

log "Config:" 
cat <<CFG
  PROGRAM_ID  = ${PROGRAM_ID}
  LIB_NAME    = ${LIB_NAME}
  REPO_URL    = ${REPO_URL}
  MOUNT_PATH  = ${MOUNT_PATH}
  RPC_URL     = ${RPC_URL}
  COMMIT_HASH = ${COMMIT_HASH}
  UPLOADER    = ${UPLOADER:-<not set>}
CFG

# ------- 1) Deterministic build inside Docker -------
log "Building verifiable program (this may take several minutes) ..."
solana-verify build --library-name "${LIB_NAME}"

# ------- 2) Compute hashes -------
ELF=target/deploy/${LIB_NAME}.so
if [[ ! -f "$ELF" ]]; then
  err "Expected ELF not found: $ELF"
  exit 1
fi

log "Executable hash (local build):"
solana-verify get-executable-hash "$ELF"

log "On-chain program hash:"
solana-verify get-program-hash -u "$RPC_URL" "$PROGRAM_ID"

# ------- 3) Verify against repository (local) -------
log "Verifying against repository (local build -> on-chain) ..."
solana-verify verify-from-repo -u "$RPC_URL" \
  --program-id "$PROGRAM_ID" \
  "$REPO_URL" \
  --commit-hash "$COMMIT_HASH" \
  --library-name "$LIB_NAME" \
  --mount-path "$MOUNT_PATH"

# The CLI may ask to upload verification data onchain if you have authority locally.
# If you do NOT have authority locally (e.g., Squads controls the program), export PDA tx below.

# ------- 4) Export PDA transaction for Squads (if UPLOADER provided) -------
if [[ -n "${UPLOADER}" ]]; then
  log "Exporting PDA transaction (base58) to write verification data on-chain (for Squads) ..."
  OUT_DIR=.verified-build
  mkdir -p "$OUT_DIR"
  OUT_TX="$OUT_DIR/pda_tx_base58.txt"
  solana-verify export-pda-tx "$REPO_URL" \
    --program-id "$PROGRAM_ID" \
    --uploader "$UPLOADER" \
    --encoding base58 \
    --compute-unit-price 0 \
    --commit-hash "$COMMIT_HASH" \
    --library-name "$LIB_NAME" \
    --mount-path "$MOUNT_PATH" \
    > "$OUT_TX"
  log "Exported base58 transaction to: $OUT_TX"
  cat "$OUT_TX" | head -c 120; echo "..."
  cat > "$OUT_DIR/README.txt" <<TXT
Import the base58-encoded transaction into Squads Transaction Builder and submit it from the vault:

  Vault (uploader): ${UPLOADER}
  Program ID:       ${PROGRAM_ID}

After it confirms, trigger a remote verification job:

  solana-verify remote submit-job --program-id ${PROGRAM_ID} --uploader ${UPLOADER}

You can monitor status at: https://verify.osec.io/status/${PROGRAM_ID}
TXT
  log "Wrote helper notes to $OUT_DIR/README.txt"
else
  warn "UPLOADER not set. Skipping PDA export step (required if program authority is held by a multisig)."
fi

log "Done. If local verification matched, your next step is uploading verification data on-chain (or PDA flow via Squads), then optionally submit a remote job:"
cat <<NEXT

Optional remote verification (OtterSec API):

  solana-verify verify-from-repo --remote -u "${RPC_URL}" \
    --program-id "${PROGRAM_ID}" \
    "${REPO_URL}" \
    --commit-hash "${COMMIT_HASH}" \
    --library-name "${LIB_NAME}" \
    --mount-path "${MOUNT_PATH}"

If using a multisig, after the PDA write is executed, run:

  solana-verify remote submit-job --program-id ${PROGRAM_ID} --uploader ${UPLOADER:-<vault pubkey>}

NEXT
