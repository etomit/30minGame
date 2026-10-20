"use strict";

const canvas = document.getElementById("jeu");
const ctx = canvas.getContext("2d");
const boutonRedemarrer = document.getElementById("redemarrer");

const LARGEUR_BULLET = 48;
const HAUTEUR_BULLET = 24;
const DELAI_BULLET = 800; // Millisecondes
const POINTS_PAR_BULLET = 100;
const VITESSE_BULLET_INITIALE = 360; // Pixels par seconde
const VITESSE_BULLET_MAXIMALE = 720;
const ACCELERATION_PAR_BULLET = 3;
const DELTA_MAXIMAL = 0.05; // Secondes

// Zone visible de notre PNG de 512 × 512, sans ses marges transparentes.
const DECOUPE_AVION = { x: 0, y: 143, largeur: 512, hauteur: 226 };
const avion = {
    x: 20,
    y: 0,
    largeur: 100,
    hauteur: 100 * DECOUPE_AVION.hauteur / DECOUPE_AVION.largeur,
    vitesse: 450
};

const touches = new Set();
const imageAvion = new Image();
const fond = new FondParallaxe(canvas.width, canvas.height);
const imageBalle = new Image();

let bullets = [];
let score = 0;
let perdu = false;
let enPause = true;
let imagesChargees = false;
let messageDefaite = "";
let dernierInstant = null;
let animation = null;
let delaiAvantBullet = DELAI_BULLET;

const extensions = (window.extensionsJeu ?? []).map(creer => creer({
    canvas, ctx, avion, chargerImage, rectanglesSeTouchent, projeterZone,
    terminerPartie(message) {
        perdu = true;
        messageDefaite = message;
    }
}));

function creerBullet() {
    bullets.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - HAUTEUR_BULLET)
    });
}

function dessiner() {
    fond.dessiner(ctx);

    for (const extension of extensions) extension.dessiner();

    ctx.drawImage(
        imageAvion,
        DECOUPE_AVION.x, DECOUPE_AVION.y,
        DECOUPE_AVION.largeur, DECOUPE_AVION.hauteur,
        avion.x, avion.y, avion.largeur, avion.hauteur
    );

    for (const bullet of bullets) {
        ctx.drawImage(imageBalle, bullet.x, bullet.y, LARGEUR_BULLET, HAUTEUR_BULLET);
    }

    ctx.fillStyle = "white";
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "left";
    ctx.fillText("SCORE " + String(score).padStart(6, "0"), 20, 35);

    if (perdu) {
        ctx.font = "36px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Perdu !", canvas.width / 2, canvas.height / 2);

        if (messageDefaite) {
            ctx.font = "24px sans-serif";
            ctx.fillText(messageDefaite, canvas.width / 2, canvas.height / 2 + 40, canvas.width - 40);
        }
    }
    if (enPause && !perdu) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 36px monospace";
        ctx.textAlign = "center";
        ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
    }
}

function deplacerAvion(delta) {
    const direction = Number(touches.has("ArrowDown")) - Number(touches.has("ArrowUp"));
    avion.y += direction * avion.vitesse * delta;
    avion.y = Math.max(0, Math.min(avion.y, canvas.height - avion.hauteur));
}

function rectanglesSeTouchent(a, b) {
    return a.x < b.x + b.largeur &&
        a.x + a.largeur > b.x &&
        a.y < b.y + b.hauteur &&
        a.y + a.hauteur > b.y;
}

function toucheAvion({ x, y, largeur = LARGEUR_BULLET, hauteur = HAUTEUR_BULLET }) {
    return rectanglesSeTouchent(avion, { x, y, largeur, hauteur });
}

function projeterZone([x, y, largeur, hauteur], objet, decoupe) {
    const echelleX = objet.largeur / decoupe.largeur;
    const echelleY = objet.hauteur / decoupe.hauteur;
    return {
        x: objet.x + x * echelleX,
        y: objet.y + y * echelleY,
        largeur: largeur * echelleX,
        hauteur: hauteur * echelleY
    };
}

function mettreAJourBullets(delta) {
    const bulletsEsquivees = score / POINTS_PAR_BULLET;
    const vitesse = Math.min(
        VITESSE_BULLET_MAXIMALE,
        VITESSE_BULLET_INITIALE + bulletsEsquivees * ACCELERATION_PAR_BULLET
    );

    for (const bullet of bullets) {
        bullet.x -= vitesse * delta;
    }

    perdu = bullets.some(toucheAvion);
    if (perdu) return;

    const nombreAvant = bullets.length;
    bullets = bullets.filter(bullet => bullet.x + LARGEUR_BULLET > 0);
    score += (nombreAvant - bullets.length) * POINTS_PAR_BULLET;
}

function animer(instant) {
    if (enPause || perdu) return;

    const dureeImage = dernierInstant === null ? 0 : instant - dernierInstant;
    // Éviter un saut après une interruption ou un changement d'onglet.
    const delta = Math.min(dureeImage / 850, DELTA_MAXIMAL);
    dernierInstant = instant;

    // Le temps des apparitions avance uniquement pendant la partie.
    delaiAvantBullet -= Math.min(dureeImage, DELTA_MAXIMAL * 1000);
    if (delaiAvantBullet <= 0) {
        creerBullet();
        delaiAvantBullet += DELAI_BULLET;
    }

    fond.deplacer(delta);
    deplacerAvion(delta);
    mettreAJourBullets(delta);
    for (const extension of extensions) {
        if (perdu) break;
        extension.mettreAJour(delta, score);
    }
    dessiner();

    if (perdu) {
        arreter();
        return;
    }

    animation = requestAnimationFrame(animer);
}

function arreter() {
    cancelAnimationFrame(animation);
    animation = null;
    touches.clear();
}

function mettreEnPause() {
    if (!imagesChargees || perdu || enPause) return;

    enPause = true;
    arreter();
    dernierInstant = null;
    dessiner();
}

function reprendre() {
    if (!imagesChargees || perdu || !enPause || document.hidden || !document.hasFocus()) return;

    enPause = false;
    dernierInstant = null;
    dessiner();
    animation = requestAnimationFrame(animer);
}

function demarrer() {
    arreter();

    avion.y = (canvas.height - avion.hauteur) / 2;
    bullets = [];
    fond.reinitialiser();
    for (const extension of extensions) extension.reinitialiser();
    score = 0;
    perdu = false;
    enPause = true;
    messageDefaite = "";
    dernierInstant = null;
    delaiAvantBullet = DELAI_BULLET;

    dessiner();
    reprendre();
}

function gererTouche(event) {
    if (perdu && event.code === "Space") {
        event.preventDefault();
        if (!event.repeat) demarrer();
        return;
    }

    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (!perdu && !enPause) touches.add(event.key);
}

boutonRedemarrer.addEventListener("click", demarrer);
document.addEventListener("keydown", gererTouche);
document.addEventListener("keyup", event => touches.delete(event.key));

window.addEventListener("blur", mettreEnPause);
window.addEventListener("focus", reprendre);
document.addEventListener("visibilitychange", function () {
    if (document.hidden) mettreEnPause();
    else reprendre();
});

function chargerImage(image, source) {
    return new Promise(function (resolve, reject) {
        image.onload = resolve;
        image.onerror = () => reject(new Error("Impossible de charger " + source));
        image.src = source;
    });
}

Promise.all([
    chargerImage(imageAvion, "avion.png"),
    fond.charger(chargerImage),
    chargerImage(imageBalle, "balle.png"),
    ...extensions.map(extension => extension.charger())
]).then(function () {
    imagesChargees = true;
    boutonRedemarrer.disabled = false;
    demarrer();
}).catch(function (erreur) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(erreur.message, canvas.width / 2, canvas.height / 2);
});
