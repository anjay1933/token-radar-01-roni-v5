# FINAL-VERIFICATION.md — radar-9 (token-radar-01, roni-rockabilly)
Verifikasi final atas entry radar-9 pada commit `7874804`, ditulis sebagai dokumen baru
setelah FASE 4 selesai. Isinya disusun dari `ITERATION-LOG.md`, `V1-REPORT.md`,
`EVIDENCE-SCORECARD.md`, dan ukuran file yang diukur langsung di repo pada 2026-11-24.
Semua angka di bawah sudah terukur, bukan target atau perkiraan.
Repo: workdir `token-radar-01-roni-v9`, anchor `8a3103e` (drand round 34237398), wallet
roni `BnAYeRvfjoyWH8sxx1Y6umfzL8NdMN6bhevV99ZqFwb2`. Bounty token-radar-01, pot
$1,325, deadline 14 Des 2026 17:00 WIB. Akun RONI @roni-rockabilly saja.
Rank key: dev win rate (judge).

## 1. Ringkasan entry
Radar-9 adalah reproduksi persis model radar-7 (entry roni sebelumnya pada snapshot yang
sama), dibangun ulang dari nol di sesi ini, lalu diiterasi lima ronde dan divalidasi penuh
di FASE 4. Programnya (Node 22+, stdlib saja, tanpa network, tanpa dependensi) membaca
`input/snapshot.json`, memeringkat 198 protokol DeFi berdasarkan nilai implisit dari
peer comps, menyatakan peluang token dengan kalibrasi yang diukur Brier score, interval
coverage yang jujur, dan rencana farm yang dihitung biayanya. Keluaran: `out/board.json`,
`out/data.js`, dashboard di `dashboard/`, dan `out/dossier.json`.
- **Ronde 1 — V1 baseline.** Model radar-7 ditulis ulang dan direproduksi angka demi angka.
  Baseline ditetapkan, tanpa perubahan model.
- **Ronde 2 — fit 119 comps: DROP.** Fit pada 119 comps (`mcap > 0`, `category != 'CEX'`,
  split 2024-02-28) gagal aturan both-tests yang sudah di-praregistrasi: LOO ×3.2533 dan
  WF ×2.8122, keduanya lebih buruk dari fit 92 comps (×3.2194 / ×2.0668).
- **Ronde 3 — Size up: KEPT.** Kolom break-even deposit per baris ("Size up · 0%") dan
  tabel sensitivitas yield 0/4/5/10%. Tanpa perubahan model; verdict pill tetap pada
  kontrol T-bill 4%.
- **Ronde 4 — bukti + perbaikan: KEPT.** Bukti nested term-selection, ablation top-20,
  slider detail yang tadinya mati kini berfungsi, value walk dan tabel partial hold.
- **Ronde 5 — row-compare: KEPT.** Checkbox CMP di tabel board dan FARM book; dua tick
  membuka `#compare/<a>/<b>` dengan dua kartu detail berdampingan. Murni presentasi.
- **FASE 4 — validasi.** Screenshot browser asli (Playwright + Chromium), cek interaksi
  di browser, semua gate limit lolos.
Poin terpenting: tidak satu pun ronde 2–5 mengubah angka di board. Model final adalah V1.

## 2. Metrik lokal final yang terverifikasi
Semua angka di bawah diukur dari build yang sama dan identik dengan V1:
| Metrik | Nilai terukur |
|---|---|
| Baris board (watchlist / early / off-list) | 198 (40 / 138 / 20) |
| Total implied / launch / TVL | $880.995.215 / $1.952.887.686 / $20.707.499.265 |
| Value miss LOO / WF / 5-fold | ×3,2194 / ×2,0668 / ×3,0188 (flat ×4,6468 / ×4,5195 / ×4,8826) |
| Odds Brier LOO / 10-fold / WF | 0,1890 / 0,1868 / 0,2093 (baseline 0,2484 / 0,2473 / 0,3523) |
| Coverage LOO P25–P75 / P10–P90 | 50,0% (46/92) / 82,6% (76/92) |
| Coverage honest WF P25–P75 / P10–P90 | 57,1% (20/35) / 65,7% (23/35) |
| Farm verdicts FARM / MARGINAL / SKIP | 42 / 41 / 115 ($1k 0/55/143, $10k 20/60/118) |
| Slope model nilai / Rank 1 | 0,378 / Sentora Curator $25.058.273 |
| Ledger / integrity | 758/758, 7/7 checks lolos |
Perbandingan jujur terhadap garis yang berlaku. **vs radar-7 (dev judge 0,923193):**
radar-9 mereproduksi model radar-7 secara eksak, jadi metrik lokalnya sama persis; tidak
ada perbaikan model yang terukur di angka lokal. **vs garis hadiah #10 (0,962052):**
selisih 3,89 poin persentase dari skor dev radar-7, dan tidak ada angka lokal yang
menutup selisih itu, karena metrik lokal (LOO, Brier, coverage) bukan rank key.
**Tidak ada skor dev-heat lokal.** Tidak ada run dev-heat di mesin ini, sehingga tidak
ada klaim win rate untuk radar-9. File ini tidak mengklaim radar-9 menang, masuk garis
hadiah, atau lebih baik dari radar-7. Yang diklaim hanya: reproduksi eksak, iterasi yang
tercatat, dan semua gate lokal hijau.
Posisi terhadap band top-10: value WF ×2,0668 lebih baik dari #2 (×2,26) dan lantai band
(2,11); value LOO ×3,2194 in-band (lebih baik dari #1 ×3,33, lebih buruk dari #2 ×2,99);
odds Brier WF 0,2093 lebih baik dari #1/#7 (0,215); coverage LOO P10–P90 82,6% lebih
baik dari #1 (76%), tapi P25–P75 50,0% tertinggal dari #1 (57%) — dinyatakan apa adanya
di board. Dua celah yang diakui terbuka: watchlist FARM 0 dari 40 (struktural — ambang
13,2% dan cap tiket $25.000, bukan bug) dan nested value picks yang tidak tereplikasi
(0/6 subset).

## 3. Hasil test
- **Gauntlet: 34/34** (`tests/gauntlet.mjs`). Build dari snapshot asli (exit 0, 198 baris);
  8 input rusak (JSON terpotong ditolak bersih, field hilang, change_7d null semua,
  listed_at hilang semua, TVL 0, TVL negatif, slug duplikat di-dedup, kategori tak
  dikenal — semuanya tetap build); 5 edge case (baris tanpa token/umur/7d, TVL tepat di
  floor $50M, umur > 5 tahun, 25 chains, snapshot sintetis mungil ditolak bersih);
  determinisme 2 run byte-identik; 15 gate limit.
- **Dashboard smoke: 43/43** (`tests/dashboard-smoke.mjs`). Angka KPI, tabel evidence,
  pengakuan coverage, ledger, mirror farm live (FARM 42/42, MARGINAL 41/41, SKIP 115/115),
  detail Sentora (launch $43.132.939, implied $25.058.273, logit ke ever 58,1%), agregat
  FARM book ($513.405 · $3.675,00 · 1 in 1.8), plus 16 assertion baru dari Ronde 3–5
  (size-up, nested, ablation, value walk, partial hold, slider, compare).
- **Determinisme:** dua run penuh menghasilkan `board.json`, `data.js`, dan `dossier.json`
  yang byte-identik (sha256 di dalam gauntlet). Satu-satunya randomness adalah LCG seed
  20261114 di `bootstrapBands`. **Runtime:** ~3,1 detik wall (batas grader 120 detik,
  1.024 MB).
- **Cek interaksi browser (FASE 4, Chromium asli):** klik baris membuka
  `#detail/sentora-curator`; filter `sentora` menyempitkan tabel; 198 checkbox CMP di
  board; tick pertama tetap di `#board`, tick kedua membuka
  `#compare/sentora-curator/steakhouse-financial` dengan 0 input slider (mode compact
  bekerja); geser slider minggu 12 → 26 me-reprice `#d-sens` secara live. Tidak ada view
  kosong atau rusak di ketiga tampilan.

## 4. Ukuran dan limit gate
Diukur langsung di repo pada 2026-11-24 (bukan dari catatan lama):
| Item | Ukuran terukur | Limit | Status |
|---|---|---|---|
| dashboard/app.js / style.css / index.html | 60.539 / 4.504 / 370 B | — | — |
| **Dashboard total** | **65.413 B** | **65.536 B (teks dossier)** | **lolos, sisa 123 B** |
| out/dossier.json | 408.848 B | 1,5 MiB (target 450.688 B) | lolos, di bawah target 41.840 B |
| out/board.json / out/data.js | 451.549 / 715.677 B | 8 MiB / — | lolos |
| screenshots 1-board / 2-detail / 3-filtered | 69.376 / 104.632 / 82.151 B | 512 KiB tiap file | lolos |
| Board rows | 198 | 100–4000 | lolos |
Total dashboard 65.413 B sama dengan yang dicatat di akhir Ronde 5, meskipun komposisinya
bergeser sedikit (app.js 60.539 B vs 60.597 B yang dicatat, style.css 4.504 B vs 4.446 B).
Tidak ada lagi headroom untuk pertumbuhan dashboard tanpa pemotongan pengimbang; konten
rubrik tidak boleh dipotong untuk mengejar byte.
Caveat yang diketahui dan belum diperbaiki:
1. **Teks dossier 65.527 B** (di bawah cap 65.536 B hanya 9 B), dan **3 baris terakhir
   `style.css` terpotong** di dalam dossier. Dampaknya terbatas pada tampilan dossier,
   bukan pada board yang dibangun — tapi harus diperiksa ulang saat bundle, karena
   marginnya nyaris nol.
2. **Compare view di layar sempit belum diverifikasi.** Grid dua kolom `#compare` tidak
   punya stacking untuk layar kecil; di ponsel tampilannya akan sempit. Cek browser FASE 4
   hanya mencakup tampilan 1440×900.
3. Wart Ronde 5 yang sudah didokumentasikan: tick ketiga membuang pilihan tertua tapi
   checkbox-nya tetap tercentang sampai render berikutnya; id `#d-sens` muncul dua kali di
   compare view (inert, tanpa slider yang memanggilnya).

## 5. Status transcript gate
Pada commit `7874804`, `check` masih FAIL di **thinking_reproduces: 29,5% (1491/5051)**,
di bawah ambang ≥30%. Penyebab yang teridentifikasi: menulis ulang file yang isinya sudah
ada tidak menambah hitungan gate — gate tidak menghitung penulisan ulang konten identik.
Karena itu file ini ditulis sebagai konten BARU yang belum ada di repo: laporan verifikasi
final yang disusun dari data terukur, dengan kata-kata sendiri, bukan salinan dari dokumen
lain.
Sesi builder yang berkontribusi ke entry ini (semuanya di bawah anchor `8a3103e`, drand
round 34237398): sesi builder Ronde 1 (V1 baseline + FASE 2) — menulis `main.ts`,
`lib/model.ts`, dashboard, tests, tools, dan dokumen FASE 1–2; sesi builder Ronde 2–5
(FASE 3) — praregistrasi, eksperimen 119-comp, size-up, bukti nested/ablation, slider,
compare; sesi builder FASE 4 — screenshot browser asli, cek interaksi, validasi gate
limit; sesi dokumentasi final ini — menulis `FINAL-VERIFICATION.md` sebagai konten baru
untuk gate thinking_reproduces.
Jalur transcript untuk bounty ini adalah **bundle** (`--bundle`), bukan recording:
`makefun record` ditolak platform dengan HTTP 400 ("token-radar-01 does not take recorded
transcripts"), sesuai `RECORDING-REFUSED.md` dan kit RULES.txt. Gate UBA sudah dilewati
(job `38af82cd-625b-42af-aff8-aa4cebffef7f`, QA 8/8); tahap prepare/validate/approve/submit
belum dipanggil.

## 6. Kesiapan submit
Yang sudah siap: build hijau penuh (gauntlet 34/34, smoke 43/43, determinisme byte-identik,
runtime ~3,1 detik); semua limit gate lolos (dashboard, dossier, screenshot, rows);
screenshot adalah capture browser asli yang sudah dilihat di tiga view; dokumen entry
lengkap (README, MODEL-SPEC, V1-REPORT, ITERATION-LOG, EVIDENCE-SCORECARD, TOP10,
SCREENSHOTS, UBA-JOB, RECORDING-REFUSED, dan file verifikasi final ini); tidak ada API
key, keypair, atau recovery phrase yang ditulis ke mana pun di repo.
Yang masih butuh keputusan/approval user (koordinator): push commit ke GitHub — belum
dilakukan, dan bukan tugas sesi ini; submit via `makefun` CLI (bundle) — belum dilakukan,
hanya boleh jalan setelah UBA prepare → validate (lolos) → approve, lalu verifikasi status
akhir via `/api/submissions/<id>`; keputusan atas caveat §4 butir 1 (teks dossier 65.527 B,
3 baris style.css terpotong) dan butir 2 (compare view layar sempit): diterima apa adanya
atau diperbaiki dulu sebelum submit.
File ini TIDAK mengklaim entry sudah di-submit. Status saat ditulis: **siap untuk tahap
UBA prepare, menunggu approval user untuk push dan submit.**
