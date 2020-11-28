# Spletno programiranje 2020/2021

Dokumentacija lastnega projekta pri predmetu **Spletno programiranje** v študijskem letu **2020/2021**.

# [Homepage](../index.html) 
Zaslonska maska vsebuje “svet” na katerem se nahajajo avatarji nas in drugih uporabnikov. Po svetu se lahko premikamo s kliki z miško ali prstom na mobilnih napravah. Desno od sveta se nahaja “sporočilno polje” kjer se lahko pogovarjaš z uporabniki, ki se nahajajo v tvoji neposredni bližini. Pod svetom se nahaja tvoja vremenska napoved.
* “Svet”: 
    * Ko z desnim klikom klikneš na avatarja, se odpre podmeni, kjer lahko utišaš uporabnika, mu pošlješ privatno sporočilo, ga povabiš v svojo privatno sobo ali pa se mu pridružiš v privatni sobi. Poleg se nahajajo tudi informacije uporabnika (njegovo ime[], profilna slika ter kratka biografija z naslovom - master/detail vzorec).
    * Nad njegovim imenom se [lahko] nahaja simbol [srčka s katerim nam daje vedeti, da smo povabljeni v njegovo privatno sobo.]_[, ki ponazarja njegovo trenutno vreme].
    * Desno spodaj se nahaja gumb za iskanje uporabnikov s katerim lahko lociraš prijatelje. Omogočal bo autocomplete glede na prijavljene uporabnike.
* “Sporočilno polje”: sestavljeno je iz vnosnega polja kamor natipkamo sporočilo in gumba "send" s katerim ga pošljemo. Pod njima se nahaja zgodovina sporočil. Za izmenjavanje sporočil smo uporabili Web Socket npm knjižnico.
* “Vremenska napoved”: vsebuje lokalno 7 dnevno vremensko napoved, ki se prenaša preko OpenWeather API.

# [Private room](../private.html) 
Uporabniki, ki so sprejeli prošnjo, se ti lahko pridružijo v privatni sobi. Namen privatne sobe je da razkažemo svojo ureditev pohištva in, da lahko pogovor z uporabniki, ki si jih spoznal v javni sobi, nadaljujemo brez motenja ostalih uporabnikov. Ureditev pohištva je narejena tako, da lahko dodajaš ali odstranjuješ (drag&drop) elemente, ki se nahajajo pod privatnim svetom. [ Podrobneje je potrebno opisati zaslonsko masko za dodajanje elementa kot so recimo atributi elementa?!][Tu bo omogočeno dodajanje oziroma odstranjevanje elementov s katerimi si lahko urediš svojo sobo.]

# [Profile](../profile.html) 
Zaslonska maska profil vsebuje podatke o prijavljenem uporabniku, ki so deljeni na nastavitve(settings) in izgled vašega računa (appearance).
* V nastavitvah lahko uporabnik vidi svoj rank, uporabniško ime, email in geslo, katerega lahko tudi spremeni. Najnižje v nastavitvah se nahaja gumb terminate s katerim lahko uporabnik izbriše svoj račun.
* Izgled zajema  izbiro profilne slike, izbor lika prikazanega v svetu, naslov biografije ter njen opis. Slednje vnosno polje je namenjeno, da uporabnik pove nekaj o sebi in se tako predstavi ostalim uporabnikom.
* Ob spremembi gesla je zahtevana minimalna dolžina gesla treh znakov.

# [Login/Register](../register.html) 
Zaslonska maska, kjer se uporabnik lahko vpiše v račun ali pa registrira novega.
* Na razdelku "Login", ki je namenjen uporabnikom z že obstoječim računom, se nahajata dve vnosni polji. V vnosno polje "username" uporabnik vnese svoje uporabniško ime, v polje "password" pa svoje geslo. Polje geslo vnos skrije s pikami. Odkljuka lahko checkbox "Remember me", zato da si lahko stran njegove vnešene podatke zapomni, zaradi česar se uporabniku ni potrebno vedno znova vpisovati v chat room. S klikom na login gumb se prijavi v sistem. V primeru neobstoječega uporabniškega imena ali nepravilnem geslu se pod gumbom za vpis izpiše kratko sporočilo o napaki.
* Na razdelku "Register", ki je namenjen neregistriranim uporabnikom, uporabnik vpiše svoj e-mail naslov (preverja se pravilnost vnosa na strani odjemalca in serverja - x@x), izbrano uporabniško ime (preverja se pravilnost vnosa na strani odjemalca in serverja - vsebuje lahko le črke in številke)  in geslo (preverja se pravilnost vnosa na strani odjemalca in serverja - preverja se dolžina niza (vsaj 3 znaki)). Tudi slednje polje skrije vnos s pikami. S klikom na gumb "Register" se novega uporabnika registrira v sistem. Uporabnika se tudi prestavi na začetno stran s svetom. V primeru, da uporabnik z enakim uporabniškim imenom že obstaja se pod gumbom izpiše kratko sporočilo o napaki.

# Log out
S klikom na "Log out" povezavo v navigaciji se izpišemo iz računa.

# Razlika med navadnim uporabnikom in administratorjem
Razlika med navadnim uporabnikom (user) in administratorjem (admin) se pokaže ob desnem kliku na lik uporabnika. Med tem, ko ima navadni uporabnik možnosti za utišanje, pošiljanje privatnega sporočila, vabilo ali vstopanje v privatno sobo, ima administrator še nekaj dodatnih. Administrator lahko tako še globalno utiša uporabnika (global mute/unmute), mu pošlje opozorilo (warn), ga začasno vrže iz sveta (kick), ga trajno vrže iz sveta (ban) ali pa vstopi v tujo sobo brez vabila drugega uporabnika.

npm web socket smo uporabli