/* ============================================================
   SCRIPT.JS — Le comportement du site

   JavaScript = électricité de la maison
   Ici on gère tout ce qui bouge, clique, répond.

   Comment ça marche ?
   On écrit des FONCTIONS — des recettes qu'on peut appeler.
   Exemple : function direBonjour() { alert("Bonjour !"); }

   Pour la tester : direBonjour()
============================================================ */


/* ============================================================
   1. LE CHATBOT IA

   C'est une IA SIMULÉE.
   Elle ne se connecte pas à Internet.
   Elle cherche des mots-clés dans ta question,
   et affiche une réponse correspondante.

   C'est comme un livre de réponses préparées.
============================================================ */

/* --- La personnalité de l'IA ---
   Ce texte décrit comment l'IA doit se comporter.
   Sur une vraie IA (OpenAI, Claude...), on l'appellerait le "system prompt".

   🌿 TODO Mission 5 : Lis ce texte et comprends ce que ça signifie !
*/
const systemPrompt = `
  Tu es un assistant expert et sympathique en espaces verts et paysage.
  Tu travailles pour LAJUS, spécialiste des espaces verts et de l'environnement.
  Tu réponds toujours de façon simple et pratique.
  Tu aimes la nature et tu le montres !
`;

/* --- La base de connaissances de l'IA ---

   C'est un tableau (une liste) de règles.
   Chaque règle dit :
     - mots-clés : les mots à chercher dans la question
     - réponse   : ce qu'on affiche si on trouve un de ces mots

   L'IA cherche les mots dans l'ordre.
   Elle s'arrête à la première correspondance.

   🌿 TODO Mission 5 : Ajoute une nouvelle règle dans ce tableau !
   Copie un bloc { mots: [...], réponse: "..." }
   et modifie-le.
*/
const connaissances = [

  {
    mots: ["arbre", "arbres", "planter un arbre"],
    reponse: `🌳 <strong>Les arbres</strong><br><br>
      Pour planter un arbre :<br>
      • Creuse un trou 2× plus large que la motte<br>
      • Arrose abondamment avant de planter<br>
      • Mets du compost dans le fond<br>
      • Plante à l'automne ou au printemps<br>
      • Arrose régulièrement la première année<br><br>
      <em>Astuce : Un arbre bien planté = 10 ans de bonheur !</em>`
  },

  {
    mots: ["haie", "haies", "tailler", "taille"],
    reponse: `✂️ <strong>La haie</strong><br><br>
      Pour tailler une haie :<br>
      • Taille au printemps (mars-avril) et en été (août)<br>
      • Évite la canicule et le gel<br>
      • Taille toujours de bas en haut<br>
      • Nettoie tes outils après chaque utilisation<br>
      • Laisse les fleurs pour les abeilles<br><br>
      <em>Astuce : Une haie taillée en trapèze reçoit plus de lumière !</em>`
  },

  {
    mots: ["gazon", "pelouse", "herbe", "tondeuse", "tondre"],
    reponse: `🌿 <strong>Le gazon</strong><br><br>
      Pour un beau gazon :<br>
      • Tonds toutes les 1 à 2 semaines en été<br>
      • Ne tonds jamais plus d'⅓ de la hauteur<br>
      • Arrose tôt le matin ou le soir<br>
      • Scarifie au printemps pour retirer le feutre<br>
      • Sème en septembre pour les zones abîmées<br><br>
      <em>Astuce : Un gazon haut (6cm) résiste mieux à la sécheresse !</em>`
  },

  {
    mots: ["arrosage", "arroser", "eau", "irrigation", "arrose"],
    reponse: `💧 <strong>L'arrosage</strong><br><br>
      Les règles d'or de l'arrosage :<br>
      • Arrose tôt le matin ou le soir (jamais en plein soleil)<br>
      • Préfère peu d'arrosages mais abondants<br>
      • Arrose au pied des plantes, pas sur les feuilles<br>
      • En été : les légumes ont besoin de 2L/m² par jour<br>
      • Utilise un paillage pour conserver l'humidité<br><br>
      <em>Astuce : Plonge ton doigt dans la terre — si c'est sec, il faut arroser !</em>`
  },

  {
    mots: ["fleur", "fleurs", "rosier", "rose", "floraison"],
    reponse: `🌸 <strong>Les fleurs</strong><br><br>
      Pour de belles fleurs :<br>
      • Plante les bulbes en automne pour le printemps<br>
      • Les annuelles se replantent chaque année<br>
      • Coupe les fleurs fanées pour stimuler la floraison<br>
      • Taille les rosiers en mars<br>
      • Adapte le sol : roses = sol riche, lavande = sol pauvre<br><br>
      <em>Astuce : Mélange des variétés pour avoir des fleurs toute l'année !</em>`
  },

  {
    mots: ["potager", "légume", "légumes", "tomate", "carotte", "jardin potager"],
    reponse: `🥕 <strong>Le potager</strong><br><br>
      Pour démarrer un potager :<br>
      • Choisis un emplacement ensoleillé (6h de soleil minimum)<br>
      • Améliore la terre avec du compost<br>
      • Commence simple : tomates, salades, haricots<br>
      • Respecte les associations (tomates + basilic = parfait !)<br>
      • Rotation des cultures chaque année<br><br>
      <em>Astuce : Un potager surélevé est plus facile à entretenir !</em>`
  },

  {
    mots: ["compost", "composter", "déchets verts", "fumier"],
    reponse: `♻️ <strong>Le compost</strong><br><br>
      Fabrique ton compost :<br>
      • Mélange déchets verts (épluchures) et secs (carton)<br>
      • Retourne-le toutes les 2 semaines<br>
      • Garde-le humide mais pas détrempé<br>
      • Évite la viande, le poisson et les agrumes<br>
      • Prêt en 6 à 12 mois<br><br>
      <em>Astuce : Le compost = l'or du jardinier — gratuit et excellent !</em>`
  },

  {
    mots: ["paillage", "paillis", "paille", "mulch"],
    reponse: `🍂 <strong>Le paillage</strong><br><br>
      Le paillage protège la terre :<br>
      • Réduit l'évaporation de l'eau (-50%)<br>
      • Limite les mauvaises herbes<br>
      • Protège les racines du gel<br>
      • Utilise : copeaux de bois, paille, feuilles mortes<br>
      • Étale 5 à 10 cm d'épaisseur<br><br>
      <em>Astuce : Un bon paillage = 2× moins d'arrosage en été !</em>`
  },

  {
    mots: ["engrais", "fertiliser", "fertilisant", "nourrir les plantes"],
    reponse: `🌱 <strong>Les engrais</strong><br><br>
      Nourrir ses plantes :<br>
      • Engrais naturels : compost, fumier, algues<br>
      • Engrais NPK : N=azote (feuilles), P=phosphore (racines), K=potassium (fleurs)<br>
      • Apporte au printemps et en été<br>
      • Jamais en hiver (les plantes dorment)<br>
      • Moins, c'est souvent mieux !<br><br>
      <em>Astuce : La terre noire et grumeleuse n'a pas besoin d'engrais !</em>`
  },

  /* 🌿 TODO Mission 5 : Ajoute ta règle ici !
     Exemple pour "arbre fruitier" :
     {
       mots: ["pommier", "poirier", "fruitier", "fruit"],
       reponse: "Ta réponse ici..."
     },
  */

  /* Cette règle doit TOUJOURS rester en dernier !
     Elle correspond à tout ce qu'on n't pas trouvé. */
  {
    mots: [],  // Tableau vide = réponse par défaut
    reponse: `🤔 <strong>Je ne suis pas sûr...</strong><br><br>
      Je n'ai pas de réponse précise pour cette question.<br>
      Tu peux essayer de reformuler avec des mots comme :<br>
      <em>arbre, haie, gazon, arrosage, fleur, potager, compost...</em><br><br>
      Ou pose la question à ton tuteur ! 🌿`
  }

];


/* --- La fonction principale du chatbot ---

   Cette fonction est appelée quand on clique sur "Envoyer".
   Elle :
   1. Récupère le texte de l'input
   2. L'affiche dans le chat (bulle utilisateur)
   3. Cherche une réponse dans les connaissances
   4. Affiche la réponse (bulle IA)
   5. Vide l'input
*/
function envoyerMessage() {

  // Étape 1 : Récupérer ce que l'utilisateur a tapé
  const input = document.getElementById("chat-input");
  const question = input.value.trim(); // .trim() enlève les espaces au début et à la fin

  // Si la question est vide, on ne fait rien
  if (question === "") return;

  // Étape 2 : Afficher la question de l'utilisateur
  afficherBulleUtilisateur(question);

  // Étape 3 : Trouver la réponse
  const reponse = trouverReponse(question);

  // Étape 4 : Afficher la réponse avec un délai (pour simuler la réflexion)
  setTimeout(function() {
    afficherBulleIA(reponse);
  }, 600); // 600 millisecondes = 0.6 secondes

  // Étape 5 : Vider l'input
  input.value = "";
  input.focus(); // Remettre le curseur dans l'input
}


/* --- Chercher une réponse ---

   Cette fonction parcourt toutes les connaissances.
   Elle cherche si un mot-clé est dans la question.
   Elle retourne la première réponse trouvée.
*/
function trouverReponse(question) {

  // On met la question en minuscules pour faciliter la comparaison
  // "Arbre" et "arbre" seront traités pareil
  const questionMinuscule = question.toLowerCase();

  // On parcourt chaque règle du tableau connaissances
  for (let i = 0; i < connaissances.length; i++) {

    const regle = connaissances[i];

    // Si la règle n'a pas de mots-clés, c'est la réponse par défaut
    if (regle.mots.length === 0) {
      return regle.reponse;
    }

    // On cherche si UN des mots-clés est dans la question
    for (let j = 0; j < regle.mots.length; j++) {
      const mot = regle.mots[j];

      // .includes() vérifie si une chaîne contient une autre
      if (questionMinuscule.includes(mot)) {
        return regle.reponse; // Trouvé ! On retourne la réponse
      }
    }
  }

  // Si on n'a rien trouvé (ne devrait pas arriver grâce à la règle par défaut)
  return "Je n'ai pas compris ta question. Essaie avec d'autres mots !";
}


/* --- Afficher une bulle utilisateur ---

   Crée un élément HTML et l'ajoute dans le chat.
*/
function afficherBulleUtilisateur(texte) {

  // On récupère la zone de messages
  const zone = document.getElementById("chat-messages");

  // On crée un nouveau div
  const bulle = document.createElement("div");
  bulle.className = "message-utilisateur";
  bulle.innerHTML = `
    <div class="message-nom">Toi</div>
    ${texte}
  `;

  // On l'ajoute dans la zone
  zone.appendChild(bulle);

  // On fait défiler vers le bas pour voir le nouveau message
  zone.scrollTop = zone.scrollHeight;
}


/* --- Afficher une bulle IA ---

   Même chose mais pour l'IA (style différent).
*/
function afficherBulleIA(texte) {

  const zone = document.getElementById("chat-messages");

  const bulle = document.createElement("div");
  bulle.className = "message-ia";
  bulle.innerHTML = `
    <div class="message-nom">🌿 Assistant LAJUS</div>
    ${texte}
  `;

  zone.appendChild(bulle);
  zone.scrollTop = zone.scrollHeight;
}


/* --- Gérer la touche Entrée ---

   Quand l'utilisateur appuie sur Entrée dans l'input,
   on envoie le message (comme si on avait cliqué sur Envoyer).
*/
function gererEntree(event) {
  // event.key contient la touche pressée
  if (event.key === "Enter") {
    envoyerMessage();
  }
}


/* --- Poser une question prédéfinie ---

   Appelée quand on clique sur un bouton exemple.
   Met la question dans l'input et l'envoie.
*/
function poserQuestion(question) {
  const input = document.getElementById("chat-input");
  input.value = question;
  envoyerMessage();
}


/* ============================================================
   2. LES FICHES PLANTES
============================================================ */

/* --- Informations sur chaque plante ---

   Un objet JavaScript (comme un dictionnaire).
   Chaque clé correspond à une plante.
*/
const infosPlantes = {

  arbre: {
    titre: "🌳 L'arbre",
    texte: `L'arbre est la star du jardin ! Il apporte de l'ombre, du fruit ou des fleurs selon les espèces.
      <br><br>
      <strong>Quand planter ?</strong> À l'automne (oct-nov) ou au printemps (mars-avril).
      <br><strong>Durée de vie :</strong> 50 à plusieurs centaines d'années !
      <br><strong>Attention :</strong> Vérifie la hauteur adulte avant de planter !`
  },

  haie: {
    titre: "✂️ La haie",
    texte: `La haie est une clôture vivante. Elle protège le jardin du vent et abrite les oiseaux.
      <br><br>
      <strong>Taille :</strong> 2 fois par an (printemps et fin d'été).
      <br><strong>Espèces populaires :</strong> Laurier palme, photinia, troène, charme.
      <br><strong>Astuce :</strong> Une haie mixte (plusieurs espèces) est plus résistante.`
  },

  gazon: {
    titre: "🌿 Le gazon",
    texte: `Un beau gazon vert, c'est le rêve de tout jardinier. Mais ça demande des soins réguliers !
      <br><br>
      <strong>Tonte :</strong> Toutes les 1-2 semaines en saison.
      <br><strong>Arrosage :</strong> 2 à 3 fois par semaine en été, tôt le matin.
      <br><strong>Astuce :</strong> Plus la pelouse est haute, plus elle résiste à la chaleur.`
  },

  fleur: {
    titre: "🌸 Les fleurs",
    texte: `Les fleurs égayent le jardin et attirent les pollinisateurs (abeilles, papillons).
      <br><br>
      <strong>Annuelles :</strong> À replanter chaque année (géraniums, pétunias).
      <br><strong>Vivaces :</strong> Reviennent seules chaque année (lavande, iris, rudbeckia).
      <br><strong>Astuce :</strong> Coupe les fleurs fanées pour prolonger la floraison !`
  }

};


/* --- Afficher les infos d'une plante ---

   Appelée quand on clique sur une carte plante.
*/
function afficherInfo(nomPlante) {

  // On récupère les infos de la plante
  const info = infosPlantes[nomPlante];

  // Si la plante n'existe pas dans notre liste, on arrête
  if (!info) return;

  // On met à jour le titre et le texte
  document.getElementById("info-titre").textContent = info.titre;
  document.getElementById("info-texte").innerHTML = info.texte;

  // On affiche la zone d'info
  const zone = document.getElementById("info-plante");
  zone.style.display = "block";

  // On défile vers la zone d'info
  zone.scrollIntoView({ behavior: "smooth" });
}


/* --- Fermer la zone d'info --- */
function fermerInfo() {
  document.getElementById("info-plante").style.display = "none";
}


/* ============================================================
   3. LES ASTUCES JARDINAGE

   🌿 TODO Mission 6 : Ajoute une nouvelle astuce dans ce tableau !
   Copie une ligne et modifie-la.
============================================================ */
const astuces = [
  "🌧️ Récupère l'eau de pluie dans une cuve — c'est gratuit et les plantes adorent !",
  "🐛 Les coccinelles mangent les pucerons — laisse-les tranquilles, ce sont tes alliées !",
  "🌡️ Arrose toujours tôt le matin ou le soir, jamais en plein soleil.",
  "✂️ Un outil propre coupe mieux et ne transmet pas les maladies.",
  "🍂 Les feuilles mortes font un excellent paillis naturel et gratuit.",
  "🌱 Un sol vivant avec des vers de terre est le signe d'une bonne terre.",
  "🧤 Porte toujours des gants — certaines plantes sont irritantes.",
  "📅 Note dans un carnet ce que tu plantes et quand — tu t'en souviendras l'année suivante !",
  "🌻 Le tournesol pousse vite et fleurit en 3 mois — parfait pour débutant !",
  "💧 Enfonce ton doigt dans la terre : si c'est humide, pas besoin d'arroser.",
  /* 🌿 TODO Mission 6 : Ajoute ton astuce ici ! */
];

/* Numéro de la dernière astuce affichée */
let derniereAstuce = -1;


/* --- Afficher une nouvelle astuce au hasard ---

   .Math.random() génère un nombre entre 0 et 1.
   On le multiplie par le nombre d'astuces.
   .Math.floor() arrondit vers le bas.
*/
function nouvelleAstuce() {

  let index;

  // On évite de montrer la même astuce deux fois de suite
  do {
    index = Math.floor(Math.random() * astuces.length);
  } while (index === derniereAstuce);

  derniereAstuce = index;

  // On met à jour le texte
  const zone = document.getElementById("astuce-texte");
  zone.textContent = astuces[index];

  // Animation : on fait clignoter légèrement la carte
  zone.style.opacity = "0";
  setTimeout(function() {
    zone.style.opacity = "1";
    zone.style.transition = "opacity 0.4s";
  }, 100);
}


/* ============================================================
   4. INITIALISATION AU CHARGEMENT DE LA PAGE

   Ce code s'exécute automatiquement quand la page est chargée.
============================================================ */
window.addEventListener("load", function() {

  // Message d'accueil du chatbot
  afficherBulleIA(`Bonjour ! 🌿 Je suis l'assistant espaces verts de LAJUS.<br>
    Pose-moi une question sur les espaces verts ou le jardinage !<br>
    Par exemple : <em>"Comment arroser mon jardin ?"</em>`);

  // Affiche une première astuce au hasard
  nouvelleAstuce();

  console.log("✅ Site chargé avec succès !");
  console.log("💡 Conseil développeur : appuie sur F12 pour voir cette console !");

});
