    // koodi localstoragea varten
    let albumit = [];
    try {
      albumit = JSON.parse(localStorage.getItem("omatAlbumit")) || [];
    } catch (virhe) {
      albumit = [];
    }

    const lomake = document.getElementById("albumiLomake");
    const kentta = document.getElementById("uusiAlbumi");
    const albumilista = document.getElementById("albumilista");
    const suosikkilista = document.getElementById("suosikkilista");
    const eiSuosikkeja = document.getElementById("eiSuosikkeja");

    // tallentaa albumit ja suosikit localstorageen
    function tallennaJaPaivita() {
      localStorage.setItem("omatAlbumit", JSON.stringify(albumit));
      naytaListat();
    }

    // lisää albumin listaan
    lomake.addEventListener("submit", function (tapahtuma) {
      tapahtuma.preventDefault(); 

      const nimi = kentta.value.trim();
      if (nimi === "") return;

      albumit.push({ nimi: nimi, suosikki: false, kuunneltu: false });
      kentta.value = "";
      tallennaJaPaivita();
    });

    function luoNappi(teksti, toiminto, poista = false) {
      const nappi = document.createElement("button");
      nappi.type = "button";
      nappi.className = poista ? "tekstinappi poista" : "tekstinappi";
      nappi.textContent = teksti;
      nappi.addEventListener("click", toiminto);
      return nappi;
    }

    //näyttää lisätyt albumit 
    function naytaListat() {
      albumilista.innerHTML = "";
      suosikkilista.innerHTML = "";

      if (albumit.length === 0) {
        const tyhja = document.createElement("p");
        tyhja.className = "tyhja";
        tyhja.textContent = "Ei albumeita vielä.";
        albumilista.appendChild(tyhja);
      }

      albumit.forEach(function (albumi, indeksi) {
        // luo albumille ja sen tiedoille kortin
        const kortti = document.createElement("div");
        kortti.className = "albumi";

        const nimi = document.createElement("div");
        nimi.className = "albumin-nimi";
        nimi.textContent = albumi.nimi;
        kortti.appendChild(nimi);

        // kuunneltu/ei kuunneltu
        const kuuntelu = document.createElement("div");
        kuuntelu.className = "kuuntelu";

        [true, false].forEach(function (tila) {
          const valinta = document.createElement("label");
          const nappi = document.createElement("input");
          nappi.type = "radio";
          nappi.name = "kuuntelu" + indeksi;
          nappi.checked = albumi.kuunneltu === tila;

          nappi.addEventListener("change", function () {
            albumi.kuunneltu = tila;
            tallennaJaPaivita();
          });

          valinta.append(nappi, tila ? " Kuunneltu" : " Ei kuunneltu");
          kuuntelu.appendChild(valinta);
        });
        kortti.appendChild(kuuntelu);

        // suosikit osioon lisääminen ja sieltä poistaminen
        const napit = document.createElement("div");
        napit.className = "albumin-napit";

        const suosikkinappi = luoNappi(
          albumi.suosikki ? "Poista suosikeista" : "Lisää suosikkeihin",
          function () {
            albumi.suosikki = !albumi.suosikki;
            tallennaJaPaivita();
          }
        );

        const poistonappi = luoNappi("Poista albumi", function () {
          albumit.splice(indeksi, 1);
          tallennaJaPaivita();
        }, true);

        napit.append(suosikkinappi, poistonappi);
        kortti.appendChild(napit);
        albumilista.appendChild(kortti);

        // suosikit listataan oikealla
        if (albumi.suosikki) {
          const suosikki = document.createElement("li");
          const suosikinNimi = document.createElement("span");
          suosikinNimi.textContent = albumi.nimi;

          // tämä jotta suosikit listalta poistaminen ei poista albumia normi listalta
          const poistaSuosikki = luoNappi("Poista suosikeista", function () {
            albumi.suosikki = false;
            tallennaJaPaivita();
          }, true);

          suosikki.append(suosikinNimi, poistaSuosikki);
          suosikkilista.appendChild(suosikki);
        }
      });

      eiSuosikkeja.hidden = suosikkilista.children.length > 0;
    }

    // näyttää mahdolliset localstorageen tallennetut listat
    naytaListat();