# FIGHT Solana Program Verified Build Guide

This guide explains how to produce and publish a verified (reproducible) build for the FIGHT OFT Solana program (`FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL`) following the official Solana *Verified Builds* process.

---
## 1. Prerequisites

Install required tools:
```bash
# Docker (follow official install instructions for your OS)
# Rust toolchain already pinned (rust-toolchain.toml) -> channel 1.75.0

cargo install solana-verify
solana --version     # Ensure recent CLI
```

Make sure you have a clean git working tree:
```bash
git status
```

---
## 2. Deterministic Build

Use the provided script (wraps `solana-verify build`).
```bash
bash scripts/solana/verified-build.sh \
  PROGRAM_ID=FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL \
  LIB_NAME=oft \
  REPO_URL=https://github.com/Fight-Foundation/token
```
Optional overrides:
- `COMMIT_HASH=<git commit>` (defaults to HEAD)
- `RPC_URL=<your paid RPC>`
- `UPLOADER=<program authority pubkey>` (set if multisig controls program)

The script will:
1. Build inside Docker via `solana-verify build`
2. Print executable hash and on-chain hash
3. Run local `verify-from-repo`
4. Export PDA transaction (if `UPLOADER` set) to `.verified-build/pda_tx_base58.txt`

---
## 3. Hash Comparison (Manual)

Individual commands if needed:
```bash
solana-verify build --library-name oft
solana-verify get-executable-hash target/deploy/oft.so
solana-verify get-program-hash -u $RPC_URL FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL
```
Hashes must match for a successful local verification.

---
## 4. Local Repository Verification
```bash
solana-verify verify-from-repo -u $RPC_URL \
  --program-id FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL \
  https://github.com/Fight-Foundation/token \
  --library-name oft \
  --mount-path programs/oft \
  --commit-hash $(git rev-parse HEAD)
```
If you hold the upgrade/program authority locally, you’ll be prompted to upload verification data on-chain automatically.

---
## 5. Multisig (Squads) Flow
If the program authority is the Squads vault (multisig):
1. Export PDA transaction (already done if `UPLOADER` provided):
   ```bash
   solana-verify export-pda-tx https://github.com/Fight-Foundation/token \
     --program-id FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL \
     --uploader <MULTISIG_PUBKEY> \
     --encoding base58 \
     --library-name oft \
     --mount-path programs/oft \
     --commit-hash $(git rev-parse HEAD)
   ```
2. In Squads V4 UI: Import the base58 transaction -> simulate -> ensure ONLY `verify` program + compute budget.
3. Approve & execute with required multisig signers.
4. Submit remote job for public verification:
   ```bash
   solana-verify remote submit-job --program-id FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL --uploader <MULTISIG_PUBKEY>
   ```
5. Monitor: https://verify.osec.io/status/FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL

---
## 6. Remote Verification (OtterSec API)
```bash
solana-verify verify-from-repo --remote -u $RPC_URL \
  --program-id FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL \
  https://github.com/Fight-Foundation/token \
  --library-name oft \
  --mount-path programs/oft \
  --commit-hash $(git rev-parse HEAD)
```
Answer 'yes' to on-chain upload if authority is local; otherwise use PDA export approach above.

---
## 7. Updating After an Upgrade
Every program upgrade requires:
1. New deterministic build: `solana-verify build --library-name oft`
2. Deploy new buffer + upgrade via Squads
3. New verification: repeat steps 4–6 with new commit hash
4. Export & submit new PDA transaction; remote job again

---
## 8. Security.txt (Optional Enhancement)
Add contact metadata for security researchers:
```toml
# programs/oft/Cargo.toml
[dependencies]
solana-security-txt = "1.1.1"
```
In `lib.rs` (entrypoint enabled build):
```rust
#[cfg(not(feature = "no-entrypoint"))]
use solana_security_txt::security_txt;

#[cfg(not(feature = "no-entrypoint"))]
security_txt! {
    name: "FIGHT Token OFT",
    project_url: "https://fight.foundation",
    contacts: "email:security@fight.foundation,github:Fight-Foundation",
    source_code: "https://github.com/Fight-Foundation/token",
    source_revision: "${GIT_COMMIT}",
    auditors: "",
    acknowledgements: "Thanks to community contributors"
}
```
Build & redeploy (multisig upgrade flow). Explorer will show a Security tab.

---
## 9. Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| Hash mismatch | Non-deterministic local build | Only use `solana-verify build` artifact for deploy |
| PDA export fails | Wrong program ID / uploader | Confirm authority matches current upgrade authority |
| Remote job stuck | RPC rate limited | Use paid RPC URL in `--url` or `SOLANA_RPC_URL` |
| Squads simulation shows extra instructions | Corrupted transaction | Re-export PDA tx and re-import |

---
## 10. Quick Commands Cheat Sheet
```bash
# Build deterministically
solana-verify build --library-name oft

# Local hash comparison
solana-verify get-executable-hash target/deploy/oft.so
solana-verify get-program-hash -u $RPC_URL FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL

# Local repo verification
solana-verify verify-from-repo -u $RPC_URL --program-id FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL \
  https://github.com/Fight-Foundation/token --library-name oft --mount-path programs/oft --commit-hash $(git rev-parse HEAD)

# Export PDA tx (multisig)
solana-verify export-pda-tx https://github.com/Fight-Foundation/token --program-id FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL \
  --uploader <MULTISIG> --encoding base58 --library-name oft --mount-path programs/oft --commit-hash $(git rev-parse HEAD)

# Remote job
solana-verify remote submit-job --program-id FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL --uploader <MULTISIG>
```

---
## 11. Next Steps
1. Transfer upgrade authority to Squads (if not already) before uploading verification PDA.
2. Run initial verified build and publish remote job.
3. Embed `security.txt` on next upgrade for better discoverability.
4. Automate via CI: trigger script + hash comparison on tagged release.

---
**Guide Version:** 1.0  
**Last Updated:** $(date +%Y-%m-%d)
