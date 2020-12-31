# Spletno programiranje 2020/2021

Dokumentacija lastnega projekta pri predmetu **Spletno programiranje** v študijskem letu **2020/2021**.

# [Homepage](http://157.245.36.23/) 
Zaslonska maska vsebuje “svet” na katerem se nahajajo avatarji nas in drugih uporabnikov. Po svetu se lahko premikamo s kliki z miško ali prstom na mobilnih napravah. Desno od sveta se nahaja “sporočilno polje” kjer se lahko pogovarjaš z uporabniki, ki se nahajajo v tvoji neposredni bližini. Pod svetom se nahaja tvoja vremenska napoved.
* “Svet”: 
    * Ko z desnim klikom klikneš na avatarja, se odpre podmeni, kjer lahko utišaš uporabnika, mu pošlješ privatno sporočilo, ga povabiš v svojo privatno sobo ali pa se mu pridružiš v privatni sobi. Poleg se nahajajo tudi informacije uporabnika (njegovo ime[], profilna slika ter kratka biografija z naslovom - master/detail vzorec).
    * Nad njegovim imenom se nahaja simbol, ki ponazarja njegovo trenutno vreme.
    * Ob desnem kliku na svet (ne na uporabnika) se prikaže gumb za iskanje uporabnikov s katerim lahko lociraš prijatelje. Omogočal bo autocomplete glede na prijavljene uporabnike. Uporablja se filtriranje po vnosu izmed vseh uporabnikov sveta.
* “Sporočilno polje”: sestavljeno je iz vnosnega polja kamor natipkamo sporočilo in gumba "send" s katerim ga pošljemo. Pod njima se nahaja zgodovina sporočil. Za izmenjavanje sporočil smo uporabili Web Socket npm knjižnico. Na odjemalcu in na web socket strežniku se preverja dolžina sporočila (biti mora večja od nič).
* “Vremenska napoved”: vsebuje lokalno 7 dnevno vremensko napoved, ki se prenaša preko OpenWeather API.

# [Private room](http://157.245.36.23/private) 
Uporabniki, ki so sprejeli prošnjo, se ti lahko pridružijo v privatni sobi. Namen privatne sobe je da razkažemo svojo ureditev pohištva in, da lahko pogovor z uporabniki, ki si jih spoznal v javni sobi, nadaljujemo brez motenja ostalih uporabnikov. Ureditev pohištva je narejena tako, da lahko dodajaš ali odstranjuješ (drag&drop) elemente, ki se nahajajo pod privatnim svetom. Tu je omogočeno dodajanje oziroma odstranjevanje elementov (drag&drop) s katerimi si lahko urediš svojo sobo. Preverja se pravilnost vnosa na strani odjemalca in na strani strežnika (kliče se direktno API).

# [Profile](http://157.245.36.23/profile) 
Zaslonska maska profil vsebuje podatke o prijavljenem uporabniku, ki so deljeni na nastavitve(settings) in izgled vašega računa (appearance).
* V nastavitvah lahko uporabnik vidi svoj rank, uporabniško ime, email in geslo, katerega lahko tudi spremeni. Najnižje v nastavitvah se nahaja gumb terminate s katerim lahko uporabnik izbriše svoj račun. Ob spremembi gesla je zahtevana minimalna dolžina gesla treh znakov.
* Izgled zajema  izbiro profilne slike, izbor lika prikazanega v svetu, naslov biografije ter njen opis. Slednje vnosno polje je namenjeno, da uporabnik pove nekaj o sebi in se tako predstavi ostalim uporabnikom. Tako za naslov kot za biografijo se preverja pravilnost vnosa na strani odjemalca in serverja za minimalno (0) in maksimalno dolžino (naslov 20, biografija 200). V primeru, da uporabnik pusti polja prazna se vrednost teh nastavi na privzeto. V primeru, da so vnosi predolgi se porežejo.

# [Statistics](http://157.245.36.23/graphAndData)
Zaslonska maska, ki je dostopna le administratorjem (admin) in vsebuje:
* Veliko količino podatkov nad katero sta uporabljena filtriranje in paginacija na strani strežnika (API).
  * Vsebuje vnosno polje s klikom na katerega se nam odpre majhen koledar. Na njem lahko s klikom izberemo datum. Podatke pridobimo s klikom na gumb 'Get data'.
  * Pod njim se nahaja polje s prikazom veliko količine podatkov (sporočil) oziroma sporočila ob napaki.
  * Na dnu je postavljen 'bootstrap-ov' vmesnik za upravljanje s paginacijo. Vsebuje gumba 'Previous' in 'Next' s katerima se premikamo po straneh s podatki. Ob kliku na gumb se nam na strežnik (API) pošlje nova poizvedba, ki nam vrne le točno določeno stran. Vmes se nahaja trenutna številka prikazane strani in število vseh strani, ki obstajajo za to poizvedbo.
  
* Graf, ki nam prikazuje statistiko števila poslanih sporočil v odvisnosti od ure ob kateri so bila sporočila poslana. Nad vsako uro se nam izriše krogec ob katerem se nam prikaže izbrana ura in število sporočil poslanih ob tej uri, če pomaknemo miškin kazalec nanj. Podatki se nam osvežijo/spremenijo ob spremembi datuma (izvede se poizvedba na strežnik (API)).
* Vnosno polje za spremembo navadnega uporabnika (user) v administratorja (admin). Ob vnosu pravilnega (obstoječega) uporabniškega imena nam ob kliku na gumb 'an admin' spremeni 'rank' uporabnika. 

# [Login/Register](http://157.245.36.23) 
Zaslonska maska, kjer se uporabnik lahko vpiše v račun ali pa registrira novega.
* Na razdelku "Login", ki je namenjen uporabnikom z že obstoječim računom, se nahajata dve vnosni polji. V vnosno polje "username" uporabnik vnese svoje uporabniško ime (preverja se pravilnost vnosa na strani odjemalca in serverja - vsebuje lahko le črke in številke z dolžino od 1 do 10 znakov), v polje "password" pa svoje geslo (preverja se pravilnost vnosa na strani odjemalca in serverja - preverja se dolžina niza (vsaj 3 znaki)). Polje geslo vnos skrije s pikami. Odkljuka lahko checkbox "Remember me", zato da si lahko stran njegove vnešene podatke zapomni, zaradi česar se uporabniku ni potrebno vedno znova vpisovati v chat room. S klikom na login gumb se prijavi v sistem. V primeru neobstoječega uporabniškega imena ali nepravilnem geslu se pod gumbom za vpis izpiše kratko sporočilo o napaki.
* Na razdelku "Register", ki je namenjen neregistriranim uporabnikom, uporabnik vpiše svoj e-mail naslov (preverja se pravilnost vnosa na strani odjemalca in serverja - x@x), izbrano uporabniško ime (preverja se pravilnost vnosa na strani odjemalca in serverja - vsebuje lahko le črke in številke z dolžino od 1 do 10 znakov)  in geslo (preverja se pravilnost vnosa na strani odjemalca in serverja - preverja se dolžina niza (vsaj 3 znaki)). Tudi slednje polje skrije vnos s pikami. S klikom na gumb "Register" se novega uporabnika registrira v sistem. Uporabnika se tudi prestavi na začetno stran s svetom. V primeru, da uporabnik z enakim uporabniškim imenom že obstaja se pod gumbom izpiše kratko sporočilo o napaki.

# [Log out](http://157.245.36.23/logout)
S klikom na "Log out" povezavo v navigaciji se izpišemo iz računa.

# Razlika med navadnim uporabnikom in administratorjem
Razlika med navadnim uporabnikom (user) in administratorjem (admin) se pokaže ob desnem kliku na lik uporabnika. Med tem, ko ima navadni uporabnik možnosti za utišanje, pošiljanje privatnega sporočila, vabilo ali vstopanje v privatno sobo, ima administrator še nekaj dodatnih. Administrator lahko tako še globalno utiša uporabnika (global mute/unmute), mu pošlje opozorilo (warn), ga začasno vrže iz sveta (kick), ga trajno vrže iz sveta (ban) ali pa vstopi v tujo sobo brez vabila drugega uporabnika.

Dodatno smo pripravili zaslonsko masko 'STATISTICS' do katere lahko dostopa zgolj administrator (admin). V njej lahko najde sporočila poslana na določen dan in statistiko poslanih sporočil glede na ure v dnevu. Tu se lahko nastavi tudi 'rank' navadnega uporabnika (user) v administratorja (admin).

# Naprave, ki jih spletna aplikacija podpira
Spletno stran nam je brez težav uspelo odpreti na računalnikih (Google Chrome in Mozilla Firefox). Preizkušena pa je bila tudi v "developer" opciji na velikostih zaslona iPhonov 6/7/8 ter iPada.

# [Povezava na Heroku](https://fri-tinytalk.herokuapp.com)
Če povezava ob kliku na naslov ne deluje uporabite spodnjo.

    http://157.245.36.23/

# LP2/LP3 Navodila za zagon aplikacije lokalno
Naložen morate imeti node.js.

    npm install
    npm start
    
Naložen morate imeti docker.

    docker-compose up --no-start
    docker start sp-smalltalk-mongodb
    docker start sp-smalltalk-app   // trenutno ne deluje

# Navodila in odgovori
* Preko vaše aplikacije mora biti možno dodajanje in brisanje vseh tipov dokumentov pri čemer morajo biti te operacije tudi izvedljive iz spletne aplikacije.
    * Nekaterih tipov dokumentov (kot je private room) v naši aplikaciji ni logično brisati.

# Uporabljene npm knjižnice
* Uporabili smo knjižnico **ws**, ki jo uporabljamo za prenos sporočil in vso komunikacijo potrebno za delovanje interkativnega chata.
* Dodatno smo uporabili **nodemailer**, ki ob registraciji na mail sporoči, da je bil uporabnik kreiran.


# LP4/LP5 Navodila za zagon aplikacije lokalno

## Povezava na [TINYROOM](http://157.245.36.23/)

* Če povezava ob kliku na naslov ne deluje uporabite spodnjo.

      http://157.245.36.23/
  
## Navodila za zagon aplikacije lokalno:
  
* Prestaviti se morate v korenski imenik projekta
  
      cd ../LP-23
    

* Naložen morate imeti Node.js

      npm install
      npm start
  
* Naložen morate imeti Angular CLI

      cd app_public
      ng build --prod --output-path build

* Naložen morate imeti Docker

      docker-compose up --no-start
      docker start sp-smalltalk-mongodb
      docker start sp-smalltalk-app
