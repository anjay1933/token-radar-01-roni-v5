# OpenRouter consult — radar-9 token-radar-01 (roni) — 24 Nov 2026 ~17:35 WIB

Model: `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`
Cost: **$0** (12,193 tokens total; usage.cost = 0). Advice only, no entry code written.
Launcher: `python3 ~/workspace/custom-connectors/custom.openrouter/bin/run-with-openrouter.py`
Raw output: `/tmp/or_radar9_out.txt` (21,575 B). Prompt: `/tmp/or_radar9_prompt.txt`.
Context given: BOARD.md + TOP10.md + RULES.md + BOUNTY-PROFILE.md (FASE 1, data 24 Nov 17:05 WIB).

> CATATAN VERIFIKASI (penting — baca sebelum memakai jawaban di bawah): model membuat
> beberapa kesalahan faktual/kontradiksi. Semua dikoreksi di bagian "Koreksi atas jawaban
> model" di akhir file. Jangan pakai angka $12,400 / $3,600 / rumus value-walk model —
> itu karangan model, bukan angka terukur radar-7/8.

## Q1 — 3 ide teratas yang paling berpeluang menaikkan dev win rate tanpa merusak akurasi

Model mengurutkan:

1. **Ide 1 — "Size up" farm framing + break-even deposit sebagai headline.**
   > "Directly satisfies Criterion 3 (farm plans)… Gives an ownable headline that can be
   > recalled instantly (the number the judge will remember)."
   > "The break-even deposit is derived from the same TVL/7-day-growth numbers that
   > already feed the value model, so no new parameters are introduced."
2. **Ide 3 — Nested term-selection proof.**
   > "Demonstrates 'second-order honesty'… Shows that every term that enters the model
   > has been re-picked inside each split."
   > "The proof is a report of the existing fitting process; it does not add new terms
   > or change the regression."
3. **Ide 10 — Ablasi "Top 20 kept".**
   > "Provides a clear, pre-registered robustness check that the model's predictions
   > survive a worst-case subset of protocols… reported side-by-side with the baseline,
   > so any degradation is visible and cannot be hidden."

**Ide yang dipotong model: Ide 4 (fit value 119 comps).**
> "Expands the training set from the proven 92-comp 'honest ceiling' to a harder
> 119-comp set… Any gain on 119 would be interpreted as p-hacking, instantly eroding
> the dev-win-rate margin."

Kesesuaian dengan FASE 1: #1 dan #2 cocok dengan rekomendasi FASE 1 (inti = Ide 1 + Ide 7,
upgrade bukti = Ide 3). **#3 berbeda**: FASE 1 menaruh Ide 10 di urutan TERAKHIR;
model menaikkannya ke #3 dengan alasan "robustness check yang mudah diaudit juri".
Potong Ide 4 bertentangan dengan rencana FASE 1 (R2 = eksperimen 119-comp dengan
pre-registered keep/drop) — lihat koreksi di bawah.

## Q2 — Dimensi dashboard apa yang paling membedakan 0.962+ dari 0.92?

Urutan model (paling → paling tidak menentukan):

1. **Ownable features** (verdict "Size-up", slider, row-compare, break-even deposit).
   > "Margin 4-5: a single, crystal-clear quantitative verdict ('Size-up – break-even
   > $12,400') plus a concrete farm-step table. Margin 1-2: the dashboard is functional
   > but offers only generic 'ranking' rows with no explicit, ownable decision."
2. **Second-order honesty** (nested term-selection, ablasi top-20, label "kept / no-signal").
   > "Margin 4-5: the judge sees a transparent audit trail… Margin 1-2: honesty is
   > present only as a vague statement; no explicit proof is shown."
3. **Farm framing** (cost-time steps konkret, bahasa "how big").
4. **Coherence / working radar** (board lengkap, screenshot cocok dengan kode).
5. **Dashboard page** (readability, spacing, palette).
6. **Looks made** (palette, tipografi) — model memisahkan #5 dan #6 padahal keduanya
   adalah kriteria 4 dan 5 dari RULES.txt yang tumpang tindih.

> "Bottom line: Ownable features (the 'size-up' verdict + break-even deposit) are the
> single most powerful margin-inflator. Second-order honesty is the next lever; farm
> framing follows. Coherence is a prerequisite but does not by itself create a margin > 0.02."

Nuansa penting (dari kami, bukan model): urutan ini MEMBALIK urutan kriteria resmi
(working radar > value model > farm plans > page > looks). Itu masuk akal HANYA karena
semua entry top-10 sudah seri di kriteria 1–2 (semuanya radar jalan dengan model layak),
sehingga keputusan juri jatuh ke kriteria 3–4. Coherence tetap prasyarat: gagal di
kriteria 1 = kalah berapa pun bagusnya fitur ownable.

## Q3 — Risiko kejujuran ("inflasi" / p-hacking) per ide

**Paling rawan: Ide 4 (119-comp fit) — HIGH.**
> "Expands the training set beyond the 92-comp 'honest ceiling'. Any improvement could
> be interpreted as over-fitting…"
> Penyajian defensible: pre-register daftar 119 protokol + rumus regresi + threshold
> keep/drop SEBELUM fitting; laporkan 92-fit vs 119-fit berdampingan; kalau DROP,
> tulis eksplisit "the 119-fit is excluded from the final model"; sensitivity: miss
> 119-fit dalam ±0.10 dari 92-fit, kalau menyimpang lebih jauh beri label "not used".

**Ide 6 — deposit-yield offset 5%/yr — MEDIUM-HIGH.**
> "Introduces an external assumption (yield on idle capital) that is not present in the
> snapshot. The judge may view it as an unfounded inflation of value."
> Penyajian defensible: nyatakan yield sebagai SKENARIO ("Assume 5% annual yield on idle
> capital"), jalankan SELURUH radar di asumsi itu DAN di baseline 0%, tabel sensitivitas
> 0%→10%, dan **nilai final yang dilaporkan memakai baseline 0%** kecuali juri
> eksplisit meminta view yield-offset. (Ini cocok dengan rencana FASE 1 R3:
> sensitivitas 0% vs 5% + kontrol.)

**Ide 8 — kind-grouping (6 grup) di odds — MEDIUM.**
> Pre-register aturan grouping; tampilkan grouped vs un-grouped; kontrol acak
> (randomised grouping — kalau hasil tidak berubah, grouping bukan penggerak skor).
> Catatan: syarat model "grouped version must improve the Brier score by ≤ 0.001 to be
> considered" ditulis terbalik/tidak jelas — lihat koreksi.

**Ide 2 — slider (odds horizon, weeks-held, partial-hold) — LOW.**
> "Treat sliders as presentation rather than model changes… the sliders simply let the
> reader re-price the same numbers." Model odds tidak berubah; range slider mencakup
> data yang teramati.

**Ide 9 — ensemble ever-rate + conditional sebagai band — LOW.**
> Pisahkan kedua komponen di kode/komentar; laporkan sebagai visual band
> ("odds range = 30%–70%"), bukan parameter fitted tambahan.

**Ide 10 — ablasi "Top 20 kept" — LOW.**
> Pre-register daftar 20 protokol; tampilkan performa set penuh vs subset; kalau subset
> mendegradasi > 0.10, beri label "not used for final claim". Catatan: definisi subset
> model ("20 protokol dengan 7-day growth tertinggi") adalah cherry-pick — lihat koreksi.

**Ide 3 — nested term-selection proof — LOW.**
> "Publish the full list of terms selected by the rule-based step and by the score-based
> step for each split… any term that appears only in one step is labelled 'rejected'."

## Q4 — Protokol pre-registered keep/drop untuk eksperimen 119-comp

Model memberi pseudocode lengkap (disalin di raw output `/tmp/or_radar9_out.txt`).
Poin-poin kuncinya:

- **Pre-registrasi** sebelum fitting: daftar 119 protokol yang persis, threshold keep,
  jumlah tes maksimum (model: 3 re-spec independen).
- **Both-tests rule**: model harus memperbaiki LOO DAN WF (model menulis "by ≤ 10%").
- **Brier ceiling**: model menulis "combined Brier ≤ 0.218" (SALAH — lihat koreksi).
- **Farm minimum**: watchlist FARM ≥ 3 tetap.
- **Term justification**: term baru hanya boleh masuk bila didukung ≥ 2 metrik independen.
- **Laporan berdampingan**: tabel 92-fit dan 119-fit, keputusan KEEP/DROP, dan kalau DROP
  tulis eksplisit "the 119-fit is excluded".
- **Penanganan arah berlawanan**: kalau LOO membaik tapi WF memburuk (atau sebaliknya),
  keputusan tetap **DROP** — simetris, mencegah "improve one, hide the other".

> "If LOO improves but WF worsens (or vice-versa) the decision is still 'DROP',
> preventing the 'improve one, hide the other' trick."

## Q5 — SATU angle utama untuk radar-9 + struktur dashboard

**Rekomendasi model: angle "Size-up" farm framing (Ide 1), didukung nested
term-selection proof (Ide 3).**
> "Adopt the 'Size-up' farm-framing angle – present a single, quantifiable break-even
> deposit as the headline verdict, and back it with a transparent, pre-registered
> 'nested term-selection' proof…"

Alasan model: langsung memenuhi 3 kriteria teratas juri; headline ownable yang mudah
diingat; model value tidak berubah (92-comp ceiling tetap); overhead UI minimal;
selaras dengan pola lhowann (#4) + silver-ibis (#10).

**Struktur dashboard yang diusulkan model (urutan seksi):**
1. Header — "Radar-9: Size-up Value Radar", tagline break-even deposit.
2. Board tingkat atas (sortable, filterable) — 40 baris watchlist: nama, TVL, 7-day
   growth, days run, implied value; kode warna Pre-token vs Traded-token.
3. Headline verdict row (sticky): "Size-up – break-even deposit $12,400
   (5% yr idle-capital yield) – expected profit $3,600 in 30 h farming."
4. Tabel farm-steps per protokol (klik detail): deposit → stake 30 h → harvest,
   net profit + ROI.
5. Sidebar "Value-walk" (derivasi langkah demi langkah).
6. Tabel partial-hold ROI (4/8/13/26 minggu, toggle checkbox).
7. Row-compare checkbox (bandingkan 2 protokol berdampingan).
8. Nested term-selection proof (dossier): terms by rule vs by score vs final kept.
9. Footer — "One number to remember: $12,400".

**Satu angka yang harus diingat juri (menurut model): $12,400 — break-even deposit.**
> "It is the quantitative embodiment of the implied value, ties the valuation model
> directly to a concrete farm plan, and is easy to recall."

## Rekomendasi akhir (sintesis konsultasi)

- **Angle utama: Ide 1 "Size up"** (break-even deposit sebagai headline verdict) +
  **Ide 3 nested term-selection proof** sebagai tulang bukti. Ini sejalan dengan
  rekomendasi FASE 1 (inti Ide 1 + Ide 7, bukti Ide 3).
- **Lapisan kedua (risiko nol model): Ide 2 slider + Ide 7 paket presentasi**
  (Value walk + row-compare + partial-hold) — murni presentasi, tidak menyentuh
  koefisien fitted.
- **Ide 10 (ablasi Top-20) naik daun** menurut model — layak dipertimbangkan sebagai
  bukti robustness murah di Ronde 5, dengan definisi subset yang sudah di-pre-register
  (top-20 by implied value, BUKAN by growth).
- **Ide 4 (119-comp): JANGAN diadopsi membabi buta; jalankan HANYA sebagai eksperimen
  R2 dengan protokol keep/drop yang sudah diperbaiki** (lihat koreksi) — dan terima
  hasil DROP sebagai hasil yang sah.
- **Ide 6 (yield 5%/yr): hanya sebagai sensitivitas** (0% vs 5%), nilai headline
  tetap baseline 0%.

## Koreksi atas jawaban model (WAJIB dibaca builder — jangan pakai versi mentah)

1. **Angka $12,400 / $3,600 / "30 h farming" / ROI 29% adalah KARANGAN model.**
   Tidak ada angka itu di data radar-7/8 (lhowann memakai $19K untuk OnRe; itu pun
   angka mereka, bukan kita). Break-even deposit radar-9 HARUS dihitung dari data
   snapshot + farm economics kita sendiri, per baris, dan headline memakai nilai
   terukur (mis. break-even termurah / median watchlist). JANGAN hardcode $12,400.
2. **Rumus value-walk model SALAH**: "Implied value = TVL × (1+growth)^(t/365) ×
   (1+yield)" bukan model radar-7 (size curve ln(cap) pada ln(TVL) + slope 0.378,
   odds logistic 24-bulan). Value walk harus mengikuti rumus fitted kita yang sebenarnya.
3. **Q1 vs Q4 kontradiksi**: Q1 bilang "CUT Ide 4", Q4 malah mendesain protokol
   eksperimennya. Posisi yang benar = posisi FASE 1: eksperimen R2 dengan
   pre-registered keep/drop; DROP adalah hasil yang sah, bukan kegagalan.
4. **Pseudocode keep/drop Q4 cacat dan TIDAK BOLEH dipakai mentah**:
   - `loo_improve` ditulis `(loo92 - loo119)/loo92 <= 0.10` — ini LULUS bahkan bila
     119-fit LEBIH BURUK sampai 10% (nilai negatif ≤ 0.10). Aturan keep yang benar
     (FASE 1 both-tests): **loo119 < loo92 DAN wf119 < wf92** (keduanya membaik
     secara ketat; toleransi numerik kecil saja, mis. perbaikan > 0).
   - `brier_max: 0.218` diterapkan pada JUMLAH Brier LOO+WF (~0.398 pada radar-7)
     — tidak masuk akal. Yang benar: Brier LOO 119 ≤ 0.1890 DAN Brier WF 119 ≤ 0.2093
     (tidak regresi dari radar-7), masing-masing terpisah.
   - `max_tests: 3` re-spec independen justru membuka pintu p-hacking
     (coba 3 varian, pilih yang lolos). FASE 1: SATU kandidat pre-registered,
     satu kali uji; gagal = DROP, tanpa re-spec.
   - `term_justified` / `at_least_two_metrics` tidak didefinisikan — ganti dengan:
     tidak ada term baru di luar yang sudah diuji radar-7/8; 119-fit memakai rumus
     yang SAMA, hanya set comp yang berubah.
5. **Q5 menaruh yield 5% di headline** ("break-even deposit $12,400 (5% yr
   idle-capital yield)") — bertentangan dengan saran Q3-nya sendiri (nilai final
   pakai baseline 0%) dan dengan risiko Ide 6. Headline HARUS baseline 0%
   (T-bill/cost-of-capital radar-7); view 5% hanya sebagai sensitivitas berlabel.
6. **Q1 klaim "break-even deposit tidak menambah parameter baru" terlalu kuat.**
   Break-even deposit bergantung pada farm economics (drop share, fee, ambang $25/h,
   horizon minggu) — parameter presentasi yang harus dinyatakan eksplisit per baris,
   bukan disamakan dengan parameter model value.
7. **Q3 Ide 8**: "grouped version must improve the Brier score by ≤ 0.001" —
   terbalik/tidak jelas. Yang defensible: kind-grouping hanya di-keep bila memperbaiki
   Brier LOO DAN WF (both-tests), dan laporkan keduanya berdampingan.
8. **Q3 Ide 10**: subset "20 protokol dengan 7-day growth tertinggi" adalah
   definisi cherry-pick. Definisi yang jujur: top-20 by implied value (board top 20)
   atau 20 protokol watchlist — ditetapkan sebelum melihat hasil.
9. **Q2 memisahkan "dashboard page" dan "looks made"** sebagai dua dimensi padahal
   itu kriteria 4 dan 5 RULES.txt yang tumpang tindih; dan klaim "margin > 0.02"
   untuk coherence tidak berdasar angka apa pun. Pakai urutan dimensi model sebagai
   heuristik, bukan sebagai kuantifikasi.

## Risiko yang harus diwaspadai (untuk builder)

- **Jangan kejar angka headline miss 119-comp**: miss 119 (LOO ×4.34 lhowann) tidak
  comparable dengan miss 92 (×3.22 radar-7) karena set-nya lebih sulit — juri yang
  membaca tabel tanpa konteks set bisa salah menilai; kalau 119-fit diadopsi, tabel
  HARUS menulis ukuran set + baseline flat masing-masing berdampingan.
- **Yield 5% di headline = risiko inflasi**: yield bukan data snapshot; satu baris
  headline yang salah label bisa dibaca juri sebagai asumsi tersembunyi.
- **Dossier budget**: semua bukti baru (nested proof, value walk, partial-hold) harus
  muat dalam dossier ≤ 450,688 B (stretch ≤ 410,000 B) — potong byte screenshot/kode,
  bukan konten rubrik.
- **Dev rate bergerak**: 3 entry baru masuk top 10 dalam ~9 jam pada 24 Nov; garis
  hadiah 0.962052 adalah tie 7 entry, bukan tembok tetap. Jangan laporkan dev rate
  provisional sebagai kemenangan.

---
*Konsultasi selesai. Tidak ada kode entry yang ditulis. Tidak ada submit/push.*
*Biaya konsultasi: $0 (model gratis nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free).*
