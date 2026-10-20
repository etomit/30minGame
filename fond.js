"use strict";

class FondParallaxe {
    constructor(largeur, hauteur) {
        this.largeur = largeur;
        this.hauteur = hauteur;
        this.ciel = null;
        this.couches = [
            { source: "nuages.png", vitesse: 6, hauteur: hauteur * 0.28, y: hauteur * 0.01, opacite: 0.4 },
            { source: "nuages.png", vitesse: 14, hauteur: hauteur * 0.42, y: hauteur * 0.12, opacite: 0.65 },
            { source: "ville-lointaine.png", vitesse: 32, hauteur: hauteur * 0.38, y: hauteur * 0.52 - 30, opacite: 0.85 },
            { source: "ville-proche.png", vitesse: 85, hauteur: hauteur * 0.5, y: hauteur * 0.5, opacite: 1 }
        ].map(couche => ({ ...couche, image: new Image(), decalage: 0 }));
    }

    async charger(chargerImage) {
        await Promise.all(this.couches.map(couche => chargerImage(couche.image, couche.source)));

        for (const couche of this.couches) {
            couche.decoupe ??= {
                x: 0, y: 0,
                largeur: couche.image.naturalWidth,
                hauteur: couche.image.naturalHeight
            };
            couche.largeur = couche.hauteur * couche.decoupe.largeur / couche.decoupe.hauteur;
        }
    }

    deplacer(delta) {
        for (const couche of this.couches) {
            couche.decalage = (couche.decalage + couche.vitesse * delta) % (couche.largeur * 2);
        }
    }

    reinitialiser() {
        for (const couche of this.couches) couche.decalage = 0;
    }

    dessiner(ctx) {
        if (!this.ciel) {
            this.ciel = ctx.createLinearGradient(0, 0, 0, this.hauteur);
            this.ciel.addColorStop(0, "#0b2347");
            this.ciel.addColorStop(0.6, "#285580");
            this.ciel.addColorStop(1, "#829bb5");
        }

        ctx.fillStyle = this.ciel;
        ctx.fillRect(0, 0, this.largeur, this.hauteur);

        // Les plans se superposent selon leurs silhouettes, du plus lointain au plus proche.
        for (const couche of this.couches) this.dessinerCouche(ctx, couche);
    }

    dessinerCouche(ctx, couche) {
        const premiereTuile = Math.floor(couche.decalage / couche.largeur);
        let x = -(couche.decalage % couche.largeur);
        const zone = couche.decoupe;

        // Le miroir raccorde les bords de chaque plan pendant son propre defilement.
        for (let tuile = premiereTuile; x < this.largeur; tuile++, x += couche.largeur) {
            const miroir = tuile % 2 === 1;
            ctx.save();
            ctx.globalAlpha = couche.opacite;
            ctx.translate(x + (miroir ? couche.largeur : 0), 0);
            ctx.scale(miroir ? -1 : 1, 1);
            ctx.drawImage(
                couche.image,
                zone.x, zone.y, zone.largeur, zone.hauteur,
                0, couche.y, couche.largeur, couche.hauteur
            );
            ctx.restore();
        }
    }
}
