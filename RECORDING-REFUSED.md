# Radar-9 — recording DITOLAK platform (24 Nov 2026 ~17:55 WIB)

## Temuan
`node cli/makefun.mjs record --competition token-radar-01` GAGAL:
> "makefun record: the recording did not start (HTTP 400): token-radar-01 does not take
> recorded transcripts: its entries upload their transcripts (a bundle or loose files) as
> the requirements say"

Kit RULES.txt (Transcripts) mengonfirmasi: "Every submission must include the transcripts
... as a makefun bundle or as loose files, up to 200 MB." Dan "To enter a source bundle,
have your agent run the kit's init first, in a new repository from the session that will
build the dashboard, before it writes any of it."

## Kesimpulan
- token-radar-01 BUKAN strict-transcripts (kebalikan gta6-01). Jalur recording TIDAK
  MUNGKIN untuk bounty ini — platform menolaknya.
- TR-INSTRUKSI.md langkah 2 (record dulu) TIDAK berlaku untuk bounty ini. File itu
  kemungkinan template generik / untuk bounty strict-transcripts lain.
- Jalur yang BENAR = --bundle (seperti radar-7, authorship 78,7%, lolos).
- Kerjaan bundle Ronde 1–4 (workdir v9, anchor 8a3103e) VALID dan dilanjutkan.
- Repo baru tr-entry (anchor 57fb343, hanya starter) TIDAK dipakai — jangan copy kode
  Ronde 1–4 ke sana (akan merusak thinking_fresh: sesi builder menunjukkan anchor 8a3103e).
- TR-PROMPT-MUSE.md (A–F) tetap dipakai sebagai SPESIFIKASI build (model, farm plan,
  dashboard, verifikasi, screenshot), bukan sebagai prompt fresh-build.
- Kuota roni saat record dicoba: 5/5 hari ini, hard limit 36/40 tersisa.
