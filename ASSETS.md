# Images du jeu

`ville.png` et `balle.png` ont été créés avec l'outil intégré imagegen.
Les originaux générés ont été copiés dans ce dossier sans modification.
Le cadrage de la balle est réalisé à l'affichage dans `jeu.js`.
La ville est répétée alternativement en miroir pour raccorder ses bords.
Le ciel avance avec `VITESSE_NUAGES` et la ville avec `VITESSE_VILLE`.
La couche de ville est mise en cache dans un canvas avec une transition transparente entre 45 % et 56 % de la hauteur, avant les toits, pour raccorder les deux vitesses sans coupure.

## Prompt de ville.png

Use case: stylized-concept. Asset type: opaque PNG background tile for a 2D side scrolling airplane arcade game on an 800 by 600 canvas. Create a wide landscape city skyline at blue hour, clean polished 2D game illustration with simplified buildings, muted navy and slate blue colors, a few warm windows, subtle distant city layers and soft clouds. Open dark blue sky occupies the upper two thirds so projectiles remain readable; a dense varied modern skyline occupies the bottom third, buildings cut off naturally at bottom. Orthographic side view, no perspective ground plane. Seamlessly tileable horizontally: the far left and right edges must match exactly in sky colors, cloud continuity, skyline height and ground. Quiet decorative backdrop, no towers as a focus, no aircraft, no projectiles, no characters, no text, no logos, no watermark, no borders. Landscape aspect ratio, detailed enough for 1600 pixel wide scrolling background.

## Prompt de balle.png

Use case: stylized-concept. Asset type: one transparent PNG projectile sprite for a 2D arcade airplane game. A single compact horizontally oriented golden brass bullet, rounded pointed nose facing LEFT, brass cartridge base on the RIGHT, clean crisp cartoon game icon shading with subtle orange highlight and dark outline. Center the bullet and make it occupy about 90 percent of the image width, approximately twice as wide as high. Simple silhouette legible at 28 by 14 pixels. No motion trail, no particles, no sparks, no shadow outside the object, no text, no border, no watermark, no other objects. Genuine transparent alpha background.
