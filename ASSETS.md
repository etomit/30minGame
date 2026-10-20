# Images du jeu

`ville.png` et `balle.png` ont été créés avec l'outil intégré imagegen.
Les originaux générés ont été copiés dans ce dossier sans modification.
Le cadrage de la balle est réalisé à l'affichage dans `jeu.js`.
La ville est répétée alternativement en miroir pour raccorder ses bords.

## Prompt de ville.png

Use case: stylized-concept. Asset type: opaque PNG background tile for a 2D side scrolling airplane arcade game on an 800 by 600 canvas. Create a wide landscape city skyline at blue hour, clean polished 2D game illustration with simplified buildings, muted navy and slate blue colors, a few warm windows, subtle distant city layers and soft clouds. Open dark blue sky occupies the upper two thirds so projectiles remain readable; a dense varied modern skyline occupies the bottom third, buildings cut off naturally at bottom. Orthographic side view, no perspective ground plane. Seamlessly tileable horizontally: the far left and right edges must match exactly in sky colors, cloud continuity, skyline height and ground. Quiet decorative backdrop, no towers as a focus, no aircraft, no projectiles, no characters, no text, no logos, no watermark, no borders. Landscape aspect ratio, detailed enough for 1600 pixel wide scrolling background.

## Prompt de balle.png

Use case: stylized-concept. Asset type: one transparent PNG projectile sprite for a 2D arcade airplane game. A single compact horizontally oriented golden brass bullet, rounded pointed nose facing LEFT, brass cartridge base on the RIGHT, clean crisp cartoon game icon shading with subtle orange highlight and dark outline. Center the bullet and make it occupy about 90 percent of the image width, approximately twice as wide as high. Simple silhouette legible at 28 by 14 pixels. No motion trail, no particles, no sparks, no shadow outside the object, no text, no border, no watermark, no other objects. Genuine transparent alpha background.

## Plans de parallaxe independants

Le fond utilise maintenant cinq plans : un ciel fixe dessine dans `fond.js`, puis deux niveaux de nuages et deux plans de ville, a partir de trois PNG transparents generes avec l'outil integre imagegen. Chaque image conserve ses propres contours ; aucun batiment n'est decoupe en bandes horizontales.

- `nuages.png` : deux niveaux, vitesse 6 en altitude et vitesse 14 plus bas, avec des tailles et opacites differentes.
- `ville-lointaine.png` : vitesse 32, silhouettes plus petites et plus claires a l'horizon.
- `ville-proche.png` : vitesse 85, batiments plus grands et plus sombres au premier plan.

Les positions, hauteurs et vitesses se reglent dans `fond.js`. `ville.png` est conserve comme ancien fond ; il n'est plus charge par le jeu.

### Prompt de nuages.png

Use case: stylized-concept. Asset type: wide transparent PNG cloud layer for a 2D parallax scrolling airplane arcade game. A sparse horizontal bank of soft illustrated blue-hour clouds, muted slate blue and dusty medium blue, gentle shapes with subtle shading and soft alpha edges. Several groups of clouds across a very wide horizontal landscape strip, with generous transparent gaps between cloud groups; bottom of clouds stays soft, no flat opaque band. Flat side view, stylized polished 2D game background matching a navy-blue evening city. Clouds only: no sky color background, no gradient backdrop, no city, no buildings, no stars, no moon, no aircraft, no text, no border or watermark. Genuine transparent background all around and between clouds. Request 2048 by 768 landscape composition; clouds occupy the central horizontal band, neither extreme left nor right is cut by a solid edge. Background decorative layer, quiet contrast.

### Prompt de ville-lointaine.png

Use case: stylized-concept. Asset type: wide transparent PNG of the DISTANT city skyline layer for a 2D parallax arcade airplane game. A continuous wide row of small and medium distant modern urban buildings, no foreground buildings. Cool desaturated blue and blue-gray silhouettes with subtle atmospheric haze; a few small muted windows, very low contrast and simplified details. Clean polished 2D illustrated evening city style. Flat orthographic side view, buildings anchored to a perfectly flat bottom edge. Irregular roof silhouette with transparent sky above and between the rooftops, including varied building heights but no huge landmark or recognizable towers. Occupy most of the image width with a natural skyline extending to both side edges. Wide landscape 2048 by 768 composition, city buildings fill the lower two thirds, upper third fully transparent. Background is genuinely transparent, NO sky, NO clouds, NO ground plane, NO full rectangular color backdrop, NO text, NO logos, NO watermark.

### Prompt de ville-proche.png

Use case: stylized-concept. Asset type: wide transparent PNG of the FOREGROUND city skyline layer for a 2D parallax arcade airplane game. A continuous wide row of large near urban buildings, deep dark navy and midnight blue facades, crisp subtle architectural details and scattered warm yellow lit windows. Clear contrast with a more hazy distant skyline layer; polished 2D illustrated evening city matching a navy blue-hour sky. Flat orthographic side view, no perspective streets. Irregular readable rooftops, some tall rectangular towers and several lower buildings, generous height variation, no recognizable landmarks. Buildings anchored to a perfectly flat bottom edge, naturally extending to both horizontal edges; sky above the roofs genuinely transparent, no fill, no clouds, no gradient backdrop. Wide landscape 2048 by 768 composition, buildings occupy the lower two thirds, upper third is fully transparent. No aircraft, no projectiles, no text, no logos, no border, no watermark.
