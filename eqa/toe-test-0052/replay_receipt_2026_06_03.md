# TOE-TEST-0052 Replay Receipt
## Receipt Date: 2026-06-03

This receipt pins the two **current** replay surfaces used in the public `0052` comparison:

- current TOE legacy SPAR replay
- current external `toe-spar` / `spar-framework` replay

It does **not** retroactively pin the historical `73 / MINOR REVISION` archive snapshot. That historical state remains an imported record without an exact published commit anchor.

---

## Shared Replay Input

Both current replays used the same manually encoded review payload:

- `hypothesis_id = pedagogical-hierarchy-gte`
- `gate = REJECTED`
- `sidrce_omega = 0.697`
- `sr9_score = 0.549`
- `di2_score = 0.548`
- identical bounded critique `report_text`

This keeps the subject fixed and makes the replay difference attributable to the policy surface, not to new source material.

---

## Receipt A — Current TOE Legacy Replay

**Repository path**

`D:\Sanctum\Flamehaven-TOE\Flamehaven-TOE(Theory of Everything)`

**Commit**

`a0994390f746120efefc67eca2683d1753e00401`

**Entry path**

`toe.spar.spar_engine.run_spar -> _run_spar_legacy`

**Replay command**

```powershell
@'
import json, hashlib, sys
sys.path.insert(0, r"D:\Sanctum\Flamehaven-TOE\Flamehaven-TOE(Theory of Everything)\src")
from toe.spar.spar_engine import run_spar
phys = {
    "hypothesis_id": "pedagogical-hierarchy-gte",
    "beta_G_norm": 0.0,
    "beta_B_norm": 0.0,
    "beta_Phi_norm": 0.0,
    "sidrce_omega": 0.697,
    "gate": "REJECTED",
    "ricci_norm": 0.0,
    "pde_status": "stable",
    "brst_ok": True,
    "dimension": 4,
    "sr9_score": 0.549,
    "di2_score": 0.548,
}
report_text = (
    "The General Transport Equation provides a mathematically valid unifying PDE form "
    "for incompressible Newtonian flow. However, the claim that fluid dynamics is taught 'in reverse' "
    "and that the GTE is universally fundamental overreaches. It fails to naturally incorporate "
    "pressure forces or non-Newtonian rheology, and improperly classifies temperature as a conserved quantity. "
    "The pedagogical effectiveness of top-down abstraction lacks empirical support compared to progressive learning."
)
res = run_spar(phys=phys, source="fluid-dynamics-pedagogy", gate="REJECTED", report_text=report_text)
payload = {
    "source": "fluid-dynamics-pedagogy",
    "gate": "REJECTED",
    "verdict": res.verdict,
    "spar_score": res.spar_score,
    "spar_grade": res.spar_grade,
    "core_verdict": res.core_verdict,
}
canon = json.dumps(payload, sort_keys=True, separators=(",", ":"))
print(json.dumps({"payload": payload, "output_sha256": hashlib.sha256(canon.encode()).hexdigest()}, separators=(",", ":")))
'@ | python -
```

**Canonical output payload**

```json
{"source":"fluid-dynamics-pedagogy","gate":"REJECTED","verdict":"MINOR REVISION","spar_score":76,"spar_grade":"PASS","core_verdict":"MINOR REVISION"}
```

**Output SHA256**

`451249fff262458b5a8d36410f5cad53e9255e7a6b9a390afa903e425604d4ac`

---

## Receipt B — Current External toe-spar Replay

**Repository path**

`D:\Sanctum\spar-framework`

**Commit**

`24748be5f19fc0c2f6a231d85a0d84fd5393663a`

**Entry path**

`D:\Sanctum\Flamehaven-TOE\TOE-TEST\TOE-TEST-0052\analysis_script.py`

**Replay command**

```powershell
python D:\Sanctum\Flamehaven-TOE\TOE-TEST\TOE-TEST-0052\analysis_script.py
```

**Equivalent canonical payload used for hashing**

```json
{"source":"fluid-dynamics-pedagogy","gate":"REJECTED","verdict":"ACCEPT","score":98,"grade":"PASS"}
```

**Output SHA256**

`8e6838f7bc4b43bc3f4d0f782953517ae8e2c74f914c230237a1cf4e2bd3c6c9`

---

## Reading Rule

From this point forward:

- `73 / MINOR REVISION` = historical imported snapshot
- `76 / MINOR REVISION` = receipt-backed current TOE legacy replay
- `98 / ACCEPT` = receipt-backed current external toe-spar replay

That separation is the honest basis for calling `TOE-TEST-0052` a **framework-sensitive review artifact** rather than a single timeless experiment verdict.
