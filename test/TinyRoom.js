/* FUNKCIONALNI TESTI */

(async function TinyRoom() {

    // Knjižnice
    const { exec } = require("child_process");
    const { describe, it, after, before } = require("mocha");
    const { Builder, By, until } = require("selenium-webdriver");
    const chrome = require("selenium-webdriver/chrome");
    const expect = require("chai").expect;
    
    // Parametri
    let aplikacijaUrl = "http://localhost:3000/";
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
      describe("Testiranje funkcionalnosti na začetni strani", function() {
        this.timeout(30 * 1000);
        before(async function() {await brskalnik.get(aplikacijaUrl);});

        context("Registracija", function() {

            it("Registracija novega uporabnika", async function() {

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
        
              it("Preverjanje, ali je bila registracija uspešna", async function() {

                await pocakajStranNalozena(brskalnik, 10, "//div");

                let uporabnik = await brskalnik.findElement(
                By.xpath("//div[contains(text(), 'testiranje')]"));
                expect(uporabnik).to.not.be.empty;
              });
        });

       context("Odjava in prijava", function() {

            it("Odjava uporabnika", async function() {
                let odjava = await brskalnik.findElement(
                  By.xpath("//a[contains(text(), 'LOG OUT')]"));
                expect(odjava).to.not.be.empty;
                await odjava.click();
              });

              it("Preveri, ali je bila odjava uspešna", async function() {

                await pocakajStranNalozena(brskalnik, 10, "//div");

                let prijava = await brskalnik.findElement(
                  By.xpath("//button[contains(text(), 'Login')]"));
                expect(prijava).to.not.be.empty;
              });

              it("Prijava uporabnika", async function() {
                let upime = await brskalnik.findElement(By.xpath("//*[@id='username']"));
                expect(upime).to.not.be.empty;
                upime.sendKeys("testiranje");
                let geslo = await brskalnik.findElement(By.xpath("//*[@id='password']"));
                expect(geslo).to.not.be.empty;
                geslo.sendKeys("testiranje");

                brskalnik.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();
              });

              it("Preverjanje, ali je bila prijava uspešna", async function() {

                await pocakajStranNalozena(brskalnik, 10, "//div");

                let uporabnik = await brskalnik.findElement(
                  By.xpath("//div[contains(text(), 'testiranje')]"));
                expect(uporabnik).to.not.be.empty;
              });
        });
  
      });

// STRAN CHAT
    // - pošiljanje in prejemanje sporočil,
    // - iskanje (search - desni klik kamorkoli na mapo) !kako bomo preverjali, če deluje?!,
    // - dropdown funkcija (desni klik na uporabnika)
        // - klik na vsako izmed funkcij in preverjanje pričakovanega odziva
    // - weather prikazovanje ob potrditvi lokacije
      describe("Chat", async function() {
        this.timeout(30 * 1000);
        before(function() { brskalnik.get(aplikacijaUrl);});

        it("Preveri, ali se prikaže mapa", async function() {

            await pocakajStranNalozena(brskalnik, 10, "//div");

            let mapa = await brskalnik.findElement(
              By.xpath('//*[@id="tinyroom"]'));
            expect(mapa).to.not.be.empty;
          });

          context("Pošiljanje sporočil", function() {
            it("Pošiljanje sporočila", async function() {
                gumb = await brskalnik.findElement(
                    By.xpath("//*[@id='messagesend']"));
                  expect(gumb).to.not.be.empty;
                await brskalnik.findElement(By.xpath("//*[@id='message']"))
                  .sendKeys("To je moje sporočilo.");
                await gumb.click();
            });

            it("Preverjanje, ali je bilo sporočilo dodano", async function() {
                await pocakajStranNalozena(brskalnik, 10,"//*[@id='chatlogs']");
                  let mojeSporocilo = await brskalnik.findElement(
                    By.xpath("//div[contains(text(), 'To je moje sporočilo.')]"));
                  expect(mojeSporocilo).to.not.be.empty;
              });
          });

      });

// STRAN MY ROOM
        // - dodajanje elementa
        // - shranjevanje
        // - preverjanje, če so elementi tam kot so
        // - brisanje elementa z desnim klikom

// STRAN PROFILE
        // - preverjanje ali so podatki (rank, username, email....) takšni kot morajo biti
        // - spreminjanje gesla in preverjanje ponovnega vpisa
        // - terminate se že pri login preverja
        // - preverjanje celotnega update profile gumba
            // - zamenjava slike
            // - zamenjava skina
            // - zamenjava BIO naslova
            // - zamenjava BIO opisa
            // - preverjanje ob kliku na gumb, da ne vrne napake in če se stvari poupdejtajo v textboxih
      describe("Profile", async function() {
        this.timeout(30 * 1000);
        before(function() { brskalnik.get(aplikacijaUrl);});

          context("Spreminanje podatkov profila", function() {

            it ("Odpri profilno stran", async function() {
                await pocakajStranNalozena(brskalnik, 10,"//div[contains(text(), 'testiranje')]");

                let profilnastran = await brskalnik.findElement(
                By.xpath("//a[contains(text(), 'PROFILE')]"));
                expect(profilnastran).to.not.be.empty;
                await profilnastran.click();
            });

            it("Spreminjanje podatkov", async function() {
                await pocakajStranNalozena(brskalnik, 10,"//div[contains(text(), 'testiranje')]");

                let novtitle = await brskalnik.findElement(By.xpath("//*[@id='biotitle']"));
                expect(novtitle).to.not.be.empty;
                novtitle.sendKeys("Moj nov title");
                let novbio = await brskalnik.findElement(By.xpath("//*[@id='bio']"));
                expect(novbio).to.not.be.empty;
                novbio.sendKeys("Moj nov bio");

                brskalnik.findElement(
                    By.xpath("//button[contains(text(), 'UPDATE PROFILE')]")).click();                
            });

            it("Preverjanje, ali je bilo spreminjanje uspešno", async function() {

                await pocakajStranNalozena(brskalnik, 10,"//div[contains(text(), 'testiranje')]");

                let novtitle = await brskalnik.findElement(By.xpath("//input[@value='Moj nov title']"));
                expect(novtitle).to.not.be.empty;
                let novbio = await brskalnik.findElement(By.xpath("//textarea[@value='Moj nov bio']"));
                expect(novbio).to.not.be.empty;
              });
          });

      });

// STRAN STATISTICS
        // - izberi datum 30.12.2020 in poglej če se izpisujejo sporočila
            // - vrnit bi moglo 10 strani glej med gumba "PREVIOUS" in "NEXT"
        // - izpis na grafu
        // - spremeni uporabnika v administratorja
            // - uporabi neveljavno ime in preveri message pod vnosnim poljem
            // - uporabi veljavno ime in preveri message pod vnosnim poljem



// To je bilo že pri tjaši - nisem brisal ampak mora bit že pr sign in narjeno
    // IZBRIS UPORABNIKA
      describe("Izbris uporabnika", async function() {
        this.timeout(30 * 1000);
        before(function() { brskalnik.get(aplikacijaUrl);});
  
        it("Preveri, ali je uporabnik prijavljen", async function() {
            await pocakajStranNalozena(brskalnik, 10, "//div");
            
            let uporabnik = await brskalnik.findElement(
             By.xpath("//div[contains(text(), 'testiranje')]"));
            expect(uporabnik).to.not.be.empty;
        });
  
        it("Zahtevaj izbris računa", async function() {
          let profilnastran = await brskalnik.findElement(
              By.xpath("//a[contains(text(), 'PROFILE')]"));
          expect(profilnastran).to.not.be.empty;
          await profilnastran.click();

          let izbris = await brskalnik.findElement(
            By.xpath("//input[@value='TERMINATE']"));
          expect(izbris).to.not.be.empty;
          await izbris.click();
        });
  
        it("Preveri, ali je bil izbris uspešen", async function() {
          let prijava = await brskalnik.findElement(
            By.xpath("//a[contains(text(), 'Login')]"));
          expect(prijava).to.not.be.empty;
        });
  
      });

// TU KONČAMO MI DELAT -------------------------------------------------------------------------------------------------
      after(async () => {
        brskalnik.quit();
      });
  
    } catch (napaka) {
      console.log("Med testom je prišlo do napake!");
    }
  })();
