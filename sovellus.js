// Sisäänkirjautuminen sovellukseen
function kirjautuminen() {
    const kayttaja = document.getElementById("kayttaja").value;
    const salasana = document.getElementById("salasana").value;

    if (kayttaja == "") {
        alert("Käyttäjänimi puuttuu.");
        return;
    } else if (kayttaja != "admin" && kayttaja != "user") {
        alert("Tuntematon käyttäjä.");
        return;
    }
    
    if (kayttaja == "" && salasana == "") {
        alert("Anna käyttäjänimi ja salasana.");
        return;
    }

    if (kayttaja == "" || salasana == "") {
        alert(kayttaja == "" ? "Käyttäjänimi puuttuu." : "Salasana puuttuu.");
        return;
    }

    if ((kayttaja == "admin" && salasana == "admin") || (kayttaja == "user" && salasana == "user")) {
        localStorage.setItem('kirjautunut', true);

        document.getElementById("kirjautuminen").style.display = "none";
        document.getElementById(kayttaja == "admin" ? "adminOsio" : "userOsio").style.display = "block";
        kayttaja == "admin" ? yllapitajaToiminnot() : kayttajaToiminnot();

    } else {
        alert((kayttaja != "admin" && kayttaja != "user") ? "Tuntematon käyttäjä." : "Virheellinen salasana.");
        document.getElementById("salasana").placeholder = "Salasana";
    }
}

// Uloskirjautuminen sovelluksesta
function ulosKirjautuminen() {
    if (confirm("Olet kirjautumassa ulos sovelluksesta.")) {
        window.location.href="./index.html"
    }
}

// Ylläpitäjän toiminnot ---------------------------------------------------------------
function yllapitajaToiminnot() {
    let kaikkiAiheAlueet = JSON.parse(localStorage.getItem("aiheAlueet")) || [];
    const aiheAlueetSisalto = document.getElementById("aiheAlueet");
    aiheAlueetSisalto.innerHTML = "";

    if (kaikkiAiheAlueet.length > 0) {
        document.querySelector(".lisaInfoAdmin").innerHTML = "<h2 style='text-align: left;'>Äänestystulokset</h2>";
    } else {
        document.querySelector(".lisaInfoAdmin").innerHTML = "";
    }

    kaikkiAiheAlueet.forEach((aiheAlue, index) => {
        const aiheAlueOsio = document.createElement("div");
        const kaikkiAanet = haeAanet(aiheAlue.vaihtoehdot);
        const viiva = document.createElement("hr");
        aiheAlueOsio.innerHTML = `<h3>${aiheAlue.aihe}</h3>`;
        
        aiheAlue.vaihtoehdot.forEach(vaihtoehto => {
            let prosentti = 0;
            if (kaikkiAanet > 0) {
                prosentti = ((vaihtoehto.count / kaikkiAanet) * 100).toFixed(2);
            }
            const vaihtoehtoOsio = document.createElement("p");
            
            if (vaihtoehto.count == 1) {
                vaihtoehtoOsio.innerHTML = `${vaihtoehto.aihe}: ${vaihtoehto.count} ääni<span style="float: right;">(${prosentti}%)</span>`;
            } else {
                vaihtoehtoOsio.innerHTML = `${vaihtoehto.aihe}: ${vaihtoehto.count} ääntä<span style="float: right;">(${prosentti}%)</span>`;
            }
            aiheAlueOsio.appendChild(vaihtoehtoOsio);
        });
        
        const poistaAiheAlueNappi = document.createElement("button");
        poistaAiheAlueNappi.innerText = "Poista äänestys";
        poistaAiheAlueNappi.onclick = () => poistaAanestys(index);
        aiheAlueOsio.appendChild(poistaAiheAlueNappi);
        aiheAlueetSisalto.appendChild(aiheAlueOsio);
        aiheAlueetSisalto.appendChild(viiva);
    });
}


// Lisätään uusi äänestys
function lisaaAanestys() {
    const aiheNimi = document.getElementById("aiheNimi").value;
    const vaihtoehtoA = document.getElementById("vaihtoehtoA").value;
    const vaihtoehtoB = document.getElementById("vaihtoehtoB").value;

    if (aiheNimi && vaihtoehtoA && vaihtoehtoB) {
        let kaikkiAiheAlueet = JSON.parse(localStorage.getItem("aiheAlueet")) || [];

        if (kaikkiAiheAlueet.some(aihe => aihe.aihe == aiheNimi)) {
            alert("Saman niminen äänestysaihe on jo olemassa.");
            return;
        }

        const aiheAlue = {
            aihe: aiheNimi,
            vaihtoehdot: [{aihe: vaihtoehtoA, count: 0}, {aihe: vaihtoehtoB, count: 0}]
        };

        kaikkiAiheAlueet.push(aiheAlue);
        localStorage.setItem("aiheAlueet", JSON.stringify(kaikkiAiheAlueet));
        yllapitajaToiminnot();

        document.getElementById("aiheNimi").value = "";
        document.getElementById("vaihtoehtoA").value = "";
        document.getElementById("vaihtoehtoB").value = "";

    } else {
        alert("Täytä kaikki kentät.");
    }
}

// Poistetaan äänestys
function poistaAanestys(index) {
    let kaikkiAiheAlueet = JSON.parse(localStorage.getItem("aiheAlueet")) || [];
    kaikkiAiheAlueet.splice(index, 1);
    localStorage.setItem("aiheAlueet", JSON.stringify(kaikkiAiheAlueet));
    yllapitajaToiminnot();
}

// Käyttäjän toiminnot -----------------------------------------------------------------
function kayttajaToiminnot() {
    let kaikkiAiheAlueet = JSON.parse(localStorage.getItem("aiheAlueet")) || [];
    const aiheAluetSisaltoUser = document.getElementById("aiheAlueetUser");
    aiheAluetSisaltoUser.innerHTML = "";

    if (kaikkiAiheAlueet.length > 0) {
        document.querySelector(".lisaInfoUser").innerHTML = "Äänestä haluamaasi vaihtoehtoa painamalla nappia.";
    } else {
        document.querySelector(".lisaInfoUser").innerHTML = "Äänestystä ei ole vielä avattu.";
    }

    kaikkiAiheAlueet.forEach((aiheAlue, aiheIndeksi) => {
        const aiheAlueOsio = document.createElement("div");
        aiheAlueOsio.innerHTML = `<h3>${aiheAlue.aihe}</h3>`;
        
        aiheAlue.vaihtoehdot.forEach((vaihtoehto, vaihtoehtoIndeksi) => {
            const prosentit = (vaihtoehto.count / haeAanet(aiheAlue.vaihtoehdot)) * 100 || 0;
            const vaihtoehdotSisalto = document.createElement("div");
            const infoSisalto = document.createElement("div");
            const prosentitNaytolle = document.createElement('span');
            const aanetNaytolle = document.createElement('span');
            const aanestaNappi = document.createElement("button");

            vaihtoehdotSisalto.style.display = "flex";
            vaihtoehdotSisalto.style.flexDirection = "column";
            infoSisalto.style.display = "flex";
            infoSisalto.style.justifyContent = "space-between";
            
            aanestaNappi.innerText = vaihtoehto.aihe;
            aanestaNappi.style.fontSize = "1.1em"
            aanestaNappi.style.letterSpacing = ".4px";
            vaihtoehdotSisalto.appendChild(aanestaNappi);
            aanestaNappi.onclick = function() {
                lisaaAani(aiheIndeksi, vaihtoehtoIndeksi);
            };
        
            aanetNaytolle.style.marginTop = "-10px";
            aanetNaytolle.style.marginLeft = "10px";
            if (vaihtoehto.count == 1) {
                aanetNaytolle.textContent = `${vaihtoehto.count} ääni`;
            } else {
                aanetNaytolle.textContent = `${vaihtoehto.count} ääntä`;
            }

            prosentitNaytolle.style.marginRight = "10px";
            prosentitNaytolle.textContent = `(${prosentit.toFixed(2)}%)`;

            aiheAlueOsio.appendChild(document.createElement('br'));
            aiheAlueOsio.appendChild(vaihtoehdotSisalto);  
            infoSisalto.appendChild(aanetNaytolle);
            infoSisalto.appendChild(prosentitNaytolle);
            vaihtoehdotSisalto.appendChild(infoSisalto);
        });
        const viiva = document.createElement("hr");
        aiheAluetSisaltoUser.appendChild(aiheAlueOsio);
        aiheAluetSisaltoUser.appendChild(viiva);
    });
}

// Lisätään ääni
function lisaaAani(aiheIndeksi, vaihtoehtoIndeksi) {
    let kaikkiAiheAlueet = JSON.parse(localStorage.getItem("aiheAlueet")) || [];
    kaikkiAiheAlueet[aiheIndeksi].vaihtoehdot[vaihtoehtoIndeksi].count++;
    localStorage.setItem("aiheAlueet", JSON.stringify(kaikkiAiheAlueet));
    kayttajaToiminnot();
}

// Lasketaan äänien kokonaismäärä
function haeAanet(vaihtoehdot) {
    let kaikkiAanet = 0;
    vaihtoehdot.forEach(vaihtoehto => {
        kaikkiAanet += vaihtoehto.count;
    });
    return kaikkiAanet;
}
