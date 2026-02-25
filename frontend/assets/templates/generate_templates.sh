#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="$(cd "$(dirname "$0")" && pwd)"

make_svg() {
  local file="$1"
  local title="$2"
  local subtitle="$3"
  local bg1="$4"
  local bg2="$5"
  local accent="$6"
  local cloth1="$7"
  local cloth2="$8"

  cat > "${OUT_DIR}/${file}" <<SVG
<svg width="900" height="1200" viewBox="0 0 900 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="60" y1="30" x2="840" y2="1170" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <pattern id="orn" width="64" height="64" patternUnits="userSpaceOnUse">
      <rect width="64" height="64" fill="${accent}" fill-opacity="0.09"/>
      <path d="M32 6 L40 18 L32 30 L24 18 Z" fill="${accent}" fill-opacity="0.35"/>
      <path d="M6 32 L18 24 L30 32 L18 40 Z" fill="${accent}" fill-opacity="0.2"/>
    </pattern>
    <filter id="soft" x="0" y="0" width="900" height="1200" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#14303a" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect x="0" y="0" width="900" height="1200" fill="url(#bg)"/>
  <rect x="34" y="34" width="832" height="1132" rx="36" fill="url(#orn)"/>

  <rect x="74" y="74" width="752" height="1052" rx="48" fill="#FFFFFF" fill-opacity="0.84" filter="url(#soft)"/>

  <rect x="114" y="104" width="672" height="676" rx="46" fill="#F5EFE0"/>

  <path d="M220 516 C272 420, 628 420, 680 516" stroke="${accent}" stroke-width="14" stroke-linecap="round"/>
  <rect x="260" y="516" width="380" height="208" rx="28" fill="#EEDFB8"/>
  <ellipse cx="450" cy="516" rx="92" ry="46" fill="#E9C97A"/>
  <circle cx="450" cy="510" r="20" fill="${accent}"/>

  <circle cx="340" cy="584" r="42" fill="#F3C18A"/>
  <rect x="302" y="626" width="76" height="118" rx="20" fill="${cloth1}"/>
  <rect x="316" y="742" width="18" height="66" rx="8" fill="#B17A58"/>
  <rect x="346" y="742" width="18" height="66" rx="8" fill="#B17A58"/>

  <circle cx="560" cy="584" r="42" fill="#F3C18A"/>
  <rect x="522" y="626" width="76" height="118" rx="20" fill="${cloth2}"/>
  <rect x="536" y="742" width="18" height="66" rx="8" fill="#B17A58"/>
  <rect x="566" y="742" width="18" height="66" rx="8" fill="#B17A58"/>

  <rect x="114" y="826" width="672" height="238" rx="40" fill="#8E4452"/>
  <text x="450" y="900" text-anchor="middle" font-family="Manrope, sans-serif" font-size="56" font-weight="800" fill="#FFF9EE">${title}</text>
  <text x="450" y="956" text-anchor="middle" font-family="Manrope, sans-serif" font-size="34" font-weight="600" fill="#FCEAD0">${subtitle}</text>

  <circle cx="770" cy="774" r="38" fill="#8E4452"/>
  <path d="M758 757 L784 774 L758 791 Z" fill="#F9EBD3"/>

  <text x="450" y="1098" text-anchor="middle" font-family="Unbounded, sans-serif" font-size="42" font-weight="700" fill="#1E2C2D">shaqyrtu.kz</text>
</svg>
SVG
}

make_svg "uzatu-1.svg" "ҰЗАТУ ТОЙ" "Қазақы дәстүрмен" "#FFF2D9" "#F8E6C2" "#9F495A" "#6BAA78" "#4E7CB8"
make_svg "uzatu-2.svg" "ҰЗАТУ КЕШІ" "Қыз ұзату" "#FDEED9" "#F8DFC8" "#8A3C4D" "#6C8BC8" "#D47A67"
make_svg "uzatu-3.svg" "ҰЗАТУ ШАҚЫРУ" "Берекелі күн" "#FEF1E2" "#F7E2CD" "#90485A" "#5EAF87" "#658DC4"

make_svg "wedding-1.svg" "ҮЙЛЕНУ ТОЙЫ" "Жас жұпты құттықтайық" "#FDEFE5" "#F4DCC8" "#8F4957" "#789D5A" "#4D78B0"
make_svg "wedding-2.svg" "НЕKЕ ТОЙ" "Бақытты сәт" "#FFF3E9" "#F5E0D0" "#94495A" "#6EA8A0" "#5A76B8"
make_svg "wedding-3.svg" "ШАҚЫРТУ" "Ақ тілектеріңізбен" "#FDF0DD" "#F0D8C1" "#8E4354" "#73A565" "#567CB4"

make_svg "sundet-1.svg" "СҮНДЕТ ТОЙ" "Жақсы тілек айтыңыз" "#F9F0D9" "#EED9B7" "#8B4456" "#6E9A5D" "#5B81BE"
make_svg "sundet-2.svg" "СҮНДЕТ КЕШІ" "Баланың қуанышы" "#FBF1DF" "#EEDFC3" "#954F61" "#6AA373" "#5A7ABA"
make_svg "sundet-3.svg" "ТОЙ ШАҚЫРУ" "Достар, туыстар" "#FDEFD9" "#F3DBBB" "#8F4558" "#6EA36B" "#5F83C0"

make_svg "tusau-1.svg" "ТҰСАУКЕСЕР" "Алғашқы қадам" "#F8EED8" "#EFE1C2" "#8B4756" "#6FAF8D" "#6387C3"
make_svg "tusau-2.svg" "ТҰСАУ ТОЙ" "Балаға бата" "#FAEFD9" "#F0DFC5" "#914A5A" "#65A68A" "#5A83BB"
make_svg "tusau-3.svg" "ҚАДАМ ТОЙ" "Қуанышымызға ортақтас" "#FFF1DF" "#F2DFC7" "#90495C" "#6FA57E" "#6289C2"

make_svg "merei-1.svg" "МЕРЕЙТОЙ" "Отбасылық мереке" "#FFF1DE" "#F5DFC5" "#904857" "#76A467" "#6284B5"
make_svg "merei-2.svg" "МЕРЕЙ КҮНІ" "Құрметті қонақтар" "#FDEFD9" "#F1DEC0" "#8F4352" "#70A06A" "#5A7FB5"
make_svg "merei-3.svg" "МЕЙРАМ ШАҚЫРУ" "Береке, бірлік" "#FFF4E4" "#F5E2CB" "#984F5F" "#6FA374" "#6488BD"

make_svg "besik-1.svg" "БЕСІК ТОЙ" "Нәрестенің қуанышы" "#FDF1E2" "#F3E2CC" "#8E4957" "#6FAE86" "#6186C1"
make_svg "besik-2.svg" "БЕСІК КЕШІ" "Жылы тілектер" "#FEF2DF" "#F4E1C8" "#924C5D" "#68A790" "#5E84BE"
make_svg "besik-3.svg" "ШАҚЫРТУ" "Сәбиге ақ жол" "#FCF0DD" "#F1DFC4" "#8C4555" "#71A78A" "#638BC5"

echo "Generated templates in ${OUT_DIR}"
