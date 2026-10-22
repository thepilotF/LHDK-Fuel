# Tankoló app – beüzemelés

## 1. Google táblázat + Apps Script
1. Hozz létre egy új Google táblázatot (pl. „Tankolások”).
2. Bővítmények → Apps Script → töröld a mintakódot, másold be a `Code.gs` tartalmát, mentsd.
3. **Drive API bekapcsolása** (a fotó-leolvasáshoz): bal oldalt *Szolgáltatások* mellett **+** →
   **Drive API** → Hozzáadás.
4. Felül a függvénylistában válaszd a `beallitas`-t → Futtatás → engedélyezd a hozzáférést
   (a Drive-hoz is kérni fog engedélyt).
   Létrejön / frissül:
   - **Tankolások** lap (új oszlopok: *Hobbs*, *Fotó*)
   - **Lajstromok** lap: IDEGEN, HA-BEG, HA-BFD, HA-FBG, HA-FBL, HA-MJC, HA-SAU, HA-SBL, HA-SEP, HA-SGK, HA-SGM, HA-SGY, HA-TUS, HA-VEU, OK-TOG, OM-DJS, OM-DLP (az appban IDEGEN az első, a többi ABC sorrendben)
   - **Beállítások** lap: kezdő óraállás 247 345, tartály készlet 945 l, kapacitás 5 000 l,
     és a fotók mappájának azonosítója
   - A Drive-odban egy **„Tankolás fotók”** mappa
5. Telepítés → Új telepítés → típus: **Webalkalmazás**
   - Végrehajtás mint: **Én**
   - Hozzáférés: **Bárki**
   → Telepítés, majd másold ki a `.../exec` végű URL-t.

## 2. GitHub Pages
1. Az `index.html`-ben az `API_URL` értékét cseréld le a kimásolt URL-re.
2. Töltsd fel az `index.html`-t a GitHub repóba (pl. `tankolas/index.html`).
3. Settings → Pages → a main ágról publikálva elérhető.

## Működés
- Az app felülete angol nyelvű; a táblázat lapjai és oszlopnevei magyarul maradnak.
- A kötelező mezők (Aircraft Registration, Hobbs, Name, Closing meter reading, idegen gépnél a lajstrom) pirosan villognak, amíg üresek. Ha üresen akarják menteni, a telefon bemondja: „Enter data”, és pirosan kiírja: ENTER DATA.
- Idegen gépnél a táblázatba `D-EABC (foreign)` formában kerül a lajstrom.
- **Dátum**: automatikusan a mai nap.
- **Hobbs**: nem kötelező. Ha üresen marad, mentés előtt az app egy ablakban rákérdez (ott beírható, vagy „No, skip”). Az app kiírja a kiválasztott gép utolsó rögzített Hobbs-értékét,
  és rákérdez, ha kisebbet írsz be.
- **Záró óraállás**: beírható kézzel, vagy a 📷 gombbal lefotózható. A fotóról a Google
  szövegfelismerője olvassa le az értéket, és beírja a mezőbe. **Mindig ellenőrizd!**
  Ha nem sikerül leolvasni, írd be kézzel, a fotó ettől még mentésre kerül.
- **Fotó**: a „Tankolás fotók” mappába kerül, pl. `2026.10.18 15-13 HA-FBL Kiss Péter.jpg`.
  A link a Tankolások lap *Fotó* oszlopában van.
- Tankolt mennyiség = záró óraállás − utolsó óraállás; levonódik a tartály készletéből.
- Tartály színe: **1500 l felett zöld**, **500–1500 l narancs**, **500 l alatt piros**.

## Készlet (v1.9.1-től automatikusan számolt)
- A **Beállítások B3** egy képlet: **nyitó készlet (B9) + összes szállítás − összes tankolás**.
  Ha egy tankolás- vagy szállítássort törölsz vagy javítasz, a készlet magától helyreáll – B3-at ne írd át kézzel.
- A tényleges (mért) készlet beállítása: a táblázat menüjében **⛽ LHDK Fuel → Készlet beállítása (mért érték)…** → beírod a litert.
  A script ebből visszaszámolja a B9-et, és újraindítja az e-mail értesítési szinteket.
- Szállítás érkezésekor az appban a Fuel delivery csempét használd (az hozzáadja a Szállítások laphoz).

## Ha módosítod a Code.gs-t
Futtasd újra a `beallitas`-t, aztán: Telepítés → Telepítések kezelése → ceruza →
Verzió: **Új verzió** → Telepítés. (Így az URL ugyanaz marad.)

## Ha „Nem sikerült betölteni az adatokat” üzenet jön
- Az `API_URL` le van-e cserélve az `/exec` végű URL-re?
- A telepítésnél a hozzáférés **Bárki**-e?
- Lefutott-e a `beallitas`?
- Próba: nyisd meg az `/exec` URL-t böngészőben – egy `{"lajstromok":[...` kezdetű sort kell látnod.

## Üzemanyag-szállítás (Fuel delivery)
1. A **Beállítások** lap **B6** cellájába írd be a szállítás jelszavát (amíg üres, a funkció nem használható).
2. Az app alján a **Fuel delivery** csempe → jelszó → érkezett liter → átvevő neve → fotó a szállítólevélről → előnézet → **Save** vagy **New photo**.
3. Mentéskor:
   - a fotó a Drive-ban a **CLAUDE BACKEND / FUEL APP / ARRIVALS** mappába kerül
     (pl. `2026.10.18 20-50 Arrival 2500 l Fülöp Ádám.jpg`; a mappát a script hozza létre, ha nincs),
   - a mennyiség hozzáadódik a tartály készletéhez (Beállítások B3),
   - a **Szállítások** lapra új sor kerül (dátum, liter, átvevő, készlet előtte/utána, fotó link),
   - az app összefoglalót mutat: dátum, mennyiség, átvevő, új készlet.
A jelszót csak a script ellenőrzi, az appban nincs benne, így a GitHubon sem látható.

## Alsó csempék (oldalra húzva váltanak)
- **Monthly**: tortadiagram az aktuális hónapra, a ▲▼ gombokkal lehet hónapot váltani (12 hónap).
- **Refuel log**: az elmúlt 2 év összes tankolása minden adattal (dátum, idő, lajstrom, liter, név, Hobbs, óraállás, fotó link), lefelé görgethető.
- **Forecast**: az elmúlt 28 nap átlagos napi fogyasztása alapján hány nap múlva éri el a tartály az 1500 / 1000 / 500 / 0 litert.

## Készlet-értesítés e-mailben (1500 / 1000 / 500 l)
- A script automatikusan e-mailt küld, amikor a készlet lefelé átlépi az 1500, 1000 vagy 500 litert
  (tankolás mentésekor azonnal, és minden reggel 7-kor egy ellenőrzéssel is).
- Minden szintről csak egyszer jön levél; szállítás után, ha a készlet újra a szint fölé kerül, a figyelés újraindul.
- Címzettek: **Beállítások B7** (vesszővel elválasztva). Alapból: fulopadi@gmail.com.
- **B8** belső mező (melyik szintről ment már levél) – ne írd át; ha törlöd, a következő ellenőrzés újra értesít.
- Teszt: az Apps Scriptben válaszd az `ertesitesTeszt` függvényt → Futtatás.

## Offline működés (v1.6.0-tól)
- Az app **telepíthető** (Android: Chrome felajánlja; iPhone: Megosztás › Főképernyőhöz adás), és **internet nélkül is megnyílik**.
- Az utolsó letöltött adatokat (lajstromok, óraállás, készlet) a telefon megjegyzi; offline ezekkel dolgozik.
- Ha nincs net, a tankolás **a telefonon tárolódik** („Saved on this phone”), és amint újra van kapcsolat
  (vagy az app újra megnyílik), **magától feltöltődik**. A várakozó tankolások száma az app-ban látszik.
- Ha közben más is tankolt, a szerver a késve érkező tankolást a helyére teszi (a későbbi sort kettébontja),
  így a mennyiségek és a készlet nem duplázódnak. A sorok „Megjegyzés” oszlopa jelzi ezt.
- Ugyanaz a tankolás kétszer nem kerülhet be (minden beküldésnek egyedi azonosítója van – „Azonosító” oszlop).
- iPhone-on a feltöltés akkor történik meg, amikor az app meg van nyitva és van net.

## Biztonság és fenntarthatóság
- Szerveroldali ellenőrzés: lajstrom a listából, Hobbs 0–100 000, óraállás csak növekedhet (élő mentésnél),
  egy tankolás max. 1100 l, név max. 60 karakter.
- Táblázat-képlet befecskendezés ellen védett (=, +, -, @ kezdetű szöveg nem fut le képletként).
- Szállítás jelszó: 5 hibás próbálkozás után 10 percig zárolva; a jelszó csak a táblázatban van (B6).
- Forgalomkorlát: percenként max. 60 írás.
- **Heti biztonsági mentés**: hétfőnként 3:00-kor a táblázat másolata a Drive-ba
  (CLAUDE BACKEND / FUEL APP / BACKUPS), az utolsó 8 marad meg.
- Tudnivaló: az app adatai (tankolási napló nevekkel) bárki számára lekérhetők, aki ismeri az app címét.

## Kimaradt tankolás felismerése (v1.7.0-tól)
A kútnak két számlálója van: a **nem nullázható összesítő** (ezt írják be záró óraállásnak) és a **kézzel nullázható kijelző**.
Szabály: **tankolás előtt nullázd a kijelzőt**, utána rögzíts az appban.
- Mentés előtt az összefoglaló megkérdezi: *„A kút nullázható kijelzője X l-t mutat?”*
  - Ha igen: egy koppintás (**Yes, X l – SAVE**).
  - Ha nem: **No, it shows a different amount** → beírja, mit mutat a kijelző.
- Ha a kijelző **kevesebbet** mutat (legalább 2 l eltérés), akkor előtte valaki nem rögzített:
  - a tankoló csak a saját mennyiségét kapja,
  - a különbözet külön sorba kerül **UNRECORDED / Unknown** néven, „pótolandó” megjegyzéssel,
  - e-mail megy a B7 címzetteknek.
  **Javítás:** a táblázatban az UNRECORDED sor *Lajstrom* és *Név* celláját írd át a papír füzet alapján (a mennyiség és a készlet már helyes).
- Ha a kijelző **többet** mutat (nem nullázták előtte), a mentés normálisan megy, a Megjegyzés oszlopba bekerül a jelzés.
- 2 l alatti eltérés tűrés, nem jelez.
- **Heti egyeztető e-mail**: hétfőnként 7:00-kor a múlt heti tankolások listája, kiemelve a még pótolandó UNRECORDED sorokat.
- **Papír füzet emlékeztető**: a bevezetés alatt minden mentés után kiírja „Please also write it in the paper log.”
  Kikapcsolás: `index.html`-ben `const FUZET_EMLEKEZTETO = false;`.

## Nyelv (v1.9.0-tól)
Az app a telefon nyelve alapján automatikusan magyarul vagy angolul jelenik meg (magyar telefon → magyar, minden más → angol).
A táblázat, az e-mailek és a lajstromok nem változnak; az „UNRECORDED” jelölés mindkét nyelven így marad.
