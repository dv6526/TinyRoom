/* FUNKCIONALNI TESTI */

(async function TinyRoom() {

  // Knjižnice
  const { exec } = require("child_process");
  const { describe, it, after, before } = require("mocha");
  const { Builder, By, until } = require("selenium-webdriver");
  const chrome = require("selenium-webdriver/chrome");
  const expect = require("chai").expect;

  // Parametri
  let aplikacijaUrl = "http://host.docker.internal:3000/";
  // let aplikacijaUrl = "http://http://157.245.36.23/";
  let seleniumStreznikUrl = "http://localhost:4445/wd/hub";
  let brskalnik;

  const axios = require('axios').create({
    baseURL: aplikacijaUrl + "api/",
    timeout: 5000
  });

  // Obvladovanje napak
  process.on("unhandledRejection", (napaka) => {
    console.log(napaka);
  });

  let pocakajStranNalozenaSec = (brskalnik) => {
    brskalnik.manage().setTimeouts({ implicit: 1000 });
  }

  // Počakaj določeno število sekund na zahtevani element na strani
  let pocakajStranNalozena = async (brskalnik, casVS, xpath) => {
    await brskalnik.wait(() => {
      return brskalnik.findElements(By.xpath(xpath)).then(elementi => {
        return elementi[0];
      });
    }, casVS * 1000, `Stran se ni naložila v ${casVS} s.`);
  };

  try {

    before(() => {
      brskalnik = new Builder()
        .forBrowser("chrome")
        .setChromeOptions(new chrome.Options()
          .addArguments("start-maximized")
          .addArguments("disable-infobars")
          .addArguments("allow-insecure-localhost")
          .addArguments("allow-running-insecure-content")
        )
        .usingServer(seleniumStreznikUrl)
        .build();
    });

    // TU ZAČNEMO MI DELAT -------------------------------------------------------------------------------------------------

    // REGISTRACIJA, PRIJAVA, ODJAVA
    describe("Testiranje funkcionalnosti na 'SIGN IN' strani", function () {
      this.timeout(30 * 1000);
      before(async function () { await brskalnik.get(aplikacijaUrl); });

      context("Registracija", function () {

        it("Registracija novega uporabnika", async function () {

          await pocakajStranNalozena(brskalnik, 10,
            "//button[contains(text(), 'Register')]");

          let email = await brskalnik.findElement(By.xpath("//*[@id='email']"));
          expect(email).to.not.be.empty;
          email.sendKeys("testiranje@example.com");
          let ime = await brskalnik.findElement(By.xpath("//*[@id='usernameRegister']"));
          expect(ime).to.not.be.empty;
          ime.sendKeys("testiranje");
          let geslo = await brskalnik.findElement(By.xpath("//*[@id='passwordRegister']"));
          expect(geslo).to.not.be.empty;
          geslo.sendKeys("testiranje");

          brskalnik.findElement(
            By.xpath("//button[contains(text(), 'Register')]")).click();
        });

        it("Preverjanje, ali je bila registracija uspešna", async function () {

          await pocakajStranNalozena(brskalnik, 10, "//span");

          let uporabnik = await brskalnik.findElement(
            By.xpath("//span[contains(text(), 'testiranje')]"));
          expect(uporabnik).to.not.be.empty;
        });
      });

      context("Odjava in prijava", function () {

        it("Odjava uporabnika", async function () {
          let odjava = await brskalnik.findElement(
            By.xpath("//a[contains(text(), 'LOG OUT')]"));
          expect(odjava).to.not.be.empty;
          await odjava.click();
        });

        it("Preveri, ali je bila odjava uspešna", async function () {

          await pocakajStranNalozena(brskalnik, 10, "//div");

          let prijava = await brskalnik.findElement(
            By.xpath("//button[contains(text(), 'Login')]"));
          expect(prijava).to.not.be.empty;
        });

        it("Prijava uporabnika", async function () {
          let upime = await brskalnik.findElement(By.xpath("//*[@id='username']"));
          expect(upime).to.not.be.empty;
          upime.sendKeys("testiranje");
          let geslo = await brskalnik.findElement(By.xpath("//*[@id='password']"));
          expect(geslo).to.not.be.empty;
          geslo.sendKeys("testiranje");

          brskalnik.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();
        });

        it("Preverjanje, ali je bila prijava uspešna", async function () {
          await pocakajStranNalozena(brskalnik, 10, "//span");

          let uporabnik = await brskalnik.findElement(
            By.xpath("//span[contains(text(), 'testiranje')]"));
          expect(uporabnik).to.not.be.empty;
        });
      });

    });



    // STRAN CHAT
    describe("Testiranje funkcionalnosti na 'CHAT' strani", async function () {
      this.timeout(30 * 1000);
      before(function () { brskalnik.get(aplikacijaUrl); });

      context("Preverjanje sveta", function () {
        it("Preveri, ali se prikaže svet", async function () {

          await pocakajStranNalozena(brskalnik, 10, "//div");

          let mapa = await brskalnik.findElement(
            By.xpath('//*[@id="tinyroom"]'));
          expect(mapa).to.not.be.empty;
        });
        // TODO:
        // preveri ob desnem kliku na svet ali se prikaže search
        // preveri ali deluje search??!!

        // preveri ob desnem kliku na igralca ali se prikaže dropdown (kako boš kliknu na uporabnika?)
        // preveri klike na funkcije dropdown menija
      });

      context("Pošiljanje sporočil", function () {
        it("Pošiljanje sporočila", async function () {
          let gumb = await brskalnik.findElement(
            By.xpath("//*[@id='messagesend']"));
          expect(gumb).to.not.be.empty;
          await brskalnik.findElement(By.xpath("//*[@id='message']"))
            .sendKeys("To je moje sporočilo.");
          await gumb.click();
        });

        it("Preverjanje, ali je bilo sporočilo dodano", async function () {
          await pocakajStranNalozena(brskalnik, 10, "//*[@id='chatlogs']");
          let mojeSporocilo = await brskalnik.findElement(
            By.xpath("//div[contains(text(), 'To je moje sporočilo.')]"));
          expect(mojeSporocilo).to.not.be.empty;
        });
      });

      // TODO: ne vem, če se da v seleniumu
      // - weather prikazovanje ob potrditvi lokacije, ne morem omogočiti lokacije v seleniumu
      // context("Preverjanje vremena", function() {
      //     it("Preverjanje, ali je bilo sporočilo dodano", async function() {
      //         await pocakajStranNalozena(brskalnik, 10,"//*[@id='weather']");
      //         let danVTednu = await brskalnik.findElement(
      //           By.xpath("//div[contains(text(), 'Sunday')]"));
      //         expect(danVTednu).to.not.be.empty;
      //     });
      // });

    });



    // STRAN MY ROOM
    describe("Testiranje funkcionalnosti na 'CHAT' strani", async function () {
      it("Prestavi se na 'MY ROOM' stran", async function () {
        let profilnastran = await brskalnik.findElement(By.xpath("//a[contains(text(), 'MY ROOM')]"));
        expect(profilnastran).to.not.be.empty;
        await profilnastran.click();
      });

      // - dodajanje elementa

      // - shranjevanje
      context("Shranjevanje pohištva", function () {


        it("Shrani pohištvo", async function () {
          let gumb = await brskalnik.findElement(By.xpath("//*[@id='save-room']"));
          expect(gumb).to.not.be.empty;
          await gumb.click();
        });

        it("Preverjanje sporočilo o uspešnosti", async function () {
          await pocakajStranNalozena(brskalnik, 10, "//div[contains(text(), 'Furniture has been updated!')]");
          let mojeSporocilo = await brskalnik.findElement(By.xpath("//div[contains(text(), 'Furniture has been updated!')]"));
          expect(mojeSporocilo).to.not.be.empty;
        });
      });

      // - preverjanje, če so elementi tam kot so

      // - brisanje elementa z desnim klikom
    });


    // STRAN PROFILE
    describe("Profile", async function () {
      // - preverjanje ali so podatki (rank, username, email....) takšni kot morajo biti
      // - spreminjanje gesla in preverjanje ponovnega vpisa
      // - terminate se že pri login preverja
      // - preverjanje celotnega update profile gumba
      // - zamenjava slike
      // - zamenjava skina
      // - zamenjava BIO naslova
      // - zamenjava BIO opisa
      // - preverjanje ob kliku na gumb, da ne vrne napake in če se stvari poupdejtajo v textboxih
      this.timeout(30 * 1000);
      before(function () { brskalnik.get(aplikacijaUrl + '/profile'); });

      context("Spreminanje podatkov profila", function () {


        it("Odpri profilno stran", async function () {
          await pocakajStranNalozena(brskalnik, 10, "//div[contains(text(), 'testiranje')]");

          let profilnastran = await brskalnik.findElement(
            By.xpath("//a[contains(text(), 'PROFILE')]"));
          expect(profilnastran).to.not.be.empty;
          await profilnastran.click();
        });

        it("Preverjanje uporabniškega imena in e-naslova", async function () {
          let username = await brskalnik.findElement(By.xpath("//div[contains(text(), 'testiranje')]"));
          expect(username).to.not.be.empty;
          let email = await brskalnik.findElement(By.xpath("//div[contains(text(), 'testiranje@example.com')]"));
          expect(email).to.not.be.empty;
        });

        it("Spreminjanje podatkov", async function () {
          await pocakajStranNalozena(brskalnik, 10, "//div[contains(text(), 'testiranje')]");

          let novtitle = await brskalnik.findElement(By.xpath("//*[@id='biotitle']"));
          expect(novtitle).to.not.be.empty;
          novtitle.sendKeys("123");
          let novbio = await brskalnik.findElement(By.xpath("//*[@id='bio']"));
          expect(novbio).to.not.be.empty;
          novbio.sendKeys("123");

          let skin = await brskalnik.findElement(By.xpath("//img[contains(@class, 'goat')]"));
          await skin.click();

          let potrdi = brskalnik.findElement(By.xpath("//button[contains(text(), 'UPDATE PROFILE')]"));
          await potrdi.click();
        });

        it("Potrdi modalno okno", async function () {
          await pocakajStranNalozenaSec(brskalnik);
          let potrdi = await brskalnik.findElement(By.xpath("//button[contains(text(), 'Yes')]"));
          expect(potrdi).to.not.be.empty;
          await potrdi.click();
        });


        /*
        it("Preverjanje, ali je bilo spreminjanje uspešno", async function () {
          before(function () { brskalnik.get(aplikacijaUrl + '/profile'); });
          //await pocakajStranNalozena(brskalnik, 10, "//input");
          //let biotitle = await brskalnik.findElement(By.css("input[name='biotitle']"));
          pocakajStranNalozenaSec(brskalnik);
          let novtitle = await brskalnik.findElement(By.xpath("//*[@id='biotitle']"));
          console.log(novtitle.getText());
          expect(novtitle.getText()).to.be.equal('Moj nov title');
          //let novtitle = await brskalnik.findElement(By.xpath("//input[@value='Moj nov title']"));
          //expect(novtitle).to.not.be.empty;
          //let novbio = await brskalnik.findElement(By.xpath("//textarea[@value='Moj nov bio']"));
          //expect(novbio).to.not.be.empty;
        });
        */

        it("Preverjanje, ali je bilo spreminjanje uspešno", async function () {

          let status = await brskalnik.findElement(By.xpath("//div[contains(text(), 'Profile info is UPDATED.')]"));
          expect(await status.getText()).to.have.string("Profile info is UPDATED.");

          axios({
            method: 'get',
            url: 'uporabniki/testiranje/profile/'
          })
            .then(async (odgovor) => {
              expect(odgovor.data.bio).to.be.equal("This is default bio123");
              expect(odgovor.data.bio_title).to.be.equal("Default bio title123");
              expect(odgovor.data.chosen_skin).to.be.equal("goat");
            });
        });


      });

    });

    // IZBRIS UPORABNIKA
    describe("Izbris uporabnika", async function () {
      this.timeout(30 * 1000);
      before(function () { brskalnik.get(aplikacijaUrl); });

      context("Preveri vpis in izbriši račun", function () {
        it("Preveri ali je uporabnik prijavljen", async function () {
          await pocakajStranNalozena(brskalnik, 10, "//span");

          let uporabnik = await brskalnik.findElement(
            By.xpath("//span[contains(text(), 'testiranje')]"));
          expect(uporabnik).to.not.be.empty;
        });

        it("Izbriši račun", async function () {
          let profilnastran = await brskalnik.findElement(
            By.xpath("//a[contains(text(), 'PROFILE')]"));
          expect(profilnastran).to.not.be.empty;
          await profilnastran.click();

          let izbris = await brskalnik.findElement(
            By.xpath("//input[@value='TERMINATE']"));
          expect(izbris).to.not.be.empty;
          await izbris.click();
        });

        // Potrdi modalno okno
        it("Potrdi izbris računa v modalnem oknu", async function () {
          //await pocakajStranNalozena(brskalnik, 10, "//button[contains(text(), 'Yes')]");
          await pocakajStranNalozenaSec(brskalnik);
          let potrdi = await brskalnik.findElement(
            By.xpath("//button[contains(text(), 'Yes')]"));
          expect(potrdi).to.not.be.empty;
          await potrdi.click();
        });
      });

      context("Preverjanje vpisa z izbrisanim računom", function () {
        it("Preveri, ali je bil uporabnik odjavljen", async function () {
          await pocakajStranNalozena(brskalnik, 10, "//button[contains(text(), 'Login')]");

          let prijava = await brskalnik.findElement(
            By.xpath("//button[contains(text(), 'Login')]"));
          expect(prijava).to.not.be.empty;
        });

        it("Prijava neobstoječega uporabnika", async function () {
          let upime = await brskalnik.findElement(By.xpath("//*[@id='username']"));
          expect(upime).to.not.be.empty;
          upime.sendKeys("testiranje");

          let geslo = await brskalnik.findElement(By.xpath("//*[@id='password']"));
          expect(geslo).to.not.be.empty;
          geslo.sendKeys("testiranje");

          brskalnik.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();
        });

        it("Preverjanje ali je bila prijava z neobstoječim računom neuspešna", async function () {
          await pocakajStranNalozena(brskalnik, 10, "//div[contains(text(), 'Wrong username or password!')]");

          let loginInfo = await brskalnik.findElement(
            By.xpath("//div[contains(text(), 'Wrong username or password!')]"));
          expect(loginInfo).to.not.be.empty;
        });

        it("Briši vnose za seboj", async function () {
          let upime = await brskalnik.findElement(By.xpath("//*[@id='username']"));
          expect(upime).to.not.be.empty;
          upime.clear();
          let geslo = await brskalnik.findElement(By.xpath("//*[@id='password']"));
          expect(geslo).to.not.be.empty;
          geslo.clear();
        });
      });

    });

    // STRAN STATISTICS
    describe("Testiranje funkcionalnosti na 'STATISTICS' strani", async function () {
      context("Prijava z administratorskim računom", function () {
        // db delete all
        // db add entries
        it("Prijava uporabnika", async function () {
          let upime = await brskalnik.findElement(By.xpath("//*[@id='username']"));
          expect(upime).to.not.be.empty;
          upime.sendKeys("profesor");
          let geslo = await brskalnik.findElement(By.xpath("//*[@id='password']"));
          expect(geslo).to.not.be.empty;
          geslo.sendKeys("profesor");

          brskalnik.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();
        });

        it("Preverjanje, ali je bila prijava uspešna", async function () {
          await pocakajStranNalozena(brskalnik, 10, "//span");

          let uporabnik = await brskalnik.findElement(
            By.xpath("//span[contains(text(), 'profesor')]"));
          expect(uporabnik).to.not.be.empty;
        });

        // prestavi se na stran
        it("Prestavi se na 'STATISTICS' stran", async function () {
          let statistika = await brskalnik.findElement(By.xpath("//a[contains(text(), 'STATISTICS')]"));
          expect(statistika).to.not.be.empty;
          await statistika.click();
        });
      });

      context("Preveri ali smo pridobili sporočila iz baze", async function () {
        it("Preveri ali je sporočilo med podatki", async function () {
          await pocakajStranNalozenaSec(brskalnik);
          await pocakajStranNalozena(brskalnik, 10, "//div[contains(text(), 'To je moje sporočilo.')]");
          let mojeSporocilo = await brskalnik.findElement(By.xpath("//div[contains(text(), 'To je moje sporočilo.')]"));
          expect(mojeSporocilo).to.not.be.empty;
        });

        it("Nastavi uporabniku administratorske pravice", async function () {
          await pocakajStranNalozena(brskalnik, 10, "//*[@name='setAdmin']");
          let setAdminInput = await brskalnik.findElement(By.xpath("//*[@name='setAdmin']"));
          expect(setAdminInput).to.not.be.empty;
          setAdminInput.sendKeys("student");

          brskalnik.findElement(By.xpath("//button[contains(text(), 'an admin.')]")).click();
        });

        it("Preveri ali so bile dodane pravice", async function () {
          brskalnik.findElement(By.xpath("//div[contains(text(), 'successfully')]")).click();
        });
      });

      // - izberi datum 30.12.2020 in poglej če se izpisujejo sporočila

      // - vrnit bi moglo 10 strani glej med gumba "PREVIOUS" in "NEXT"
      // - izpis na grafu
      // - spremeni uporabnika v administratorja
      // - uporabi neveljavno ime in preveri message pod vnosnim poljem
      // - uporabi veljavno ime in preveri message pod vnosnim poljem
    });

    // TU KONČAMO MI DELAT -------------------------------------------------------------------------------------------------
    after(async () => {
      brskalnik.quit();
    });

  } catch (napaka) {
    console.log("Med testom je prišlo do napake!");
  }
})();