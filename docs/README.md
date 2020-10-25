# Spletno programiranje 2020/2021

Dokumentacija lastnega projekta pri predmetu **Spletno programiranje** v študijskem letu **2020/2021**.

# [Homepage - index.html](./index.html) 
Zaslonska maska vsebuje “svet” na katerem se nahajajo avatarji nas in drugih uporabnikov. Po svetu se lahko premikamo s kliki z miško ali prstom na mobilnih napravah. Desno od sveta se nahaja “sporočilno polje” kjer se lahko pogovarjaš z igralci, ki se nahajajo v tvoji neposredni bližini. Pod svetom se nahaja tvoja vremenska napoved.
..* “Svet”: ko klikneš na avatarja, se odpre podmeni, kjer lahko utišaš(mute) človeka, prebereš njegov “bio”, ga povabiš v svojo privatno sobo, zaprosiš dovoljenje za vstop v njegovo privatno sobo ali pa mu pošlješ privatno sporočilo. Nad njegovim imenom se nahaja simbol, ki ponazarja njegovo trenutno vreme. Desno spodaj bo gumb za iskanje uporabnikov s katerim boš lahko lociral prijatelje. Omogočal bo autocomplete glede na prijavljene uporabnike.
..* “Sporočilno polje”: sestavljeno je iz vnosnega polja kamor natipkamo sporočilo in ga oddamo z gumbom send. Pod njima se nahaja zgodovina sporočil.
..* “Vremenska napoved”: vsebuje 7 dnevno vremensko napoved, ki se bo prenašala preko API.

# [Private room - private.html](./private.html) 
Uporabniki, ki so sprejeli prošnjo, se ti lahko pridružijo v privatni sobi. Namen privatne sobe je, da lahko pogovor z uporabniki, ki si jih spoznal v javni sobi, nadaljujemo v privatni sobi, zato da ne motiš ostalih uporabnikov. 
Tu bo omogočeno dodajanje oziroma odstranjevanje elementov s katerimi si lahko urediš svojo sobo. 

# [Profile - profile.html](./profile.html) 
Zaslonska maska moj profil vsebuje podatke o prijavljenem uporabniku. Tu uporabnik lahko vidi svoj rank, uporabniško ime, email in geslo, ki ga lahko tudi spremeni. Bio vnosno polje je namenjeno, da uporabnik pove nekaj o sebi in se tako predstavi ostalim uporabnikom. Uporabnik ima možnost, da naloži svoj skin, ki se mu bo prikazal čez njegovega avatarja v “svetu”. Uporabnik lahku tu tudi izbriše svoj račun.

# [Login/Register - register.html](./register.html) 
Zaslonska maska, kjer se uporabnik lahko logira ali registrira. Na razdelku login, ki je namenjen uporabnikom z že obstoječim računom oz. profilom, se nahajata dve vnosni polji. V vnosno polje "username" uporabnik vnese svoje uporabniško ime, v polje "password" pa svoje geslo. Polje geslo vnos skrije s pikami. Odkljuka lahko checkbox "Remember me", zato da si lahko stran njegove vnešene podatke zapomni, zaradi česar se uporabniku ni potrebno vedno znova vpisovati v chat room. S klikom na login gumb se prijavi v sistem. 
Na razdelku Register, namenjen neregistriranim uporabnikom, uporabnik vpiše svoj e-mail naslov v prvo vnosno polje ter izbrano uporabniško ime in geslo v naslednja 2 polja. S klikom na gumb se registrira v sistem. 
Ob registraciji se uporabniku pošlje potrditveni e-mail s katerim potrdi istovetnost svojega naslova.
Pri registraciji se bo preverjal pravilen vnos e-naslova, geslo za minimalno število znakov in da se potrditveno geslo ujema.
