
const CAREGORIES_HOMMES = [
    {
      filter: "Vêtements",
      subs: [
        {
          filter: "Jeans",
          subs: [
            "Droits",
            "Slim",
            "Troués",
            "Larges",
          ]
        },
        {
          filter: "Pulls",
          subs: [
            "Sweat",
            "Sweat à capuche",
            "Vestes",
            "Gilets",
            "Hiver"
          ]
        },
        {
          filter: "Hauts",
          subs: [
            "Chemises",
            "T-shirts",
            "T-shirts manches longues",
            "Debardeur",
            "Polo",
          ]
        },
        {
          filter: "Vestes",
          subs: [
            "Costume",
            "Gilets de costume",
            "Survêtements",
          ]
        },
        {
          filter: "Pantalon",
          subs: [
            "Chino",
            "Costume",
            "Jogging",
            "Large",
          ]
        },
        {
          filter: "Shorts",
          subs: [
            "Chinos",
            "Joggings",
            "Jeans"
          ]
        },
        {
          filter: "Maillots de bain",
          subs: []
        },
        {
          filter: "Sous-vêtements",
          subs: []
        }, 
        {
          filter: "Sport",
          subs: [
            "Survêtements",
            "Pantalons",
            "Shorts",
            "Hauts",
            "Pulls",
          ]
        }
      ]
    },
    {
      filter: "Chaussures",
      subs: [
        "Baskets",
        "Sport",
        "Chaussons",
        "Mocassins",
        "Bottes",
        "Habillées",
      ]
    },
    {
      filter: "Sous-vêtements",
      subs: [
        "Boxers",
        "Slips",
        "Chaussettes",
      ]
    },
    {
      filter: "Accessoires",
      subs: [
        "Montres",
        "Ceintures",
        "Chapeaux",
        "Echarpes",
        "Gants",
        "Cravates",
      ]
    },
    
];

const CAREGORIES_FEMMES = [
  {
    filter: "Vêtements",
    subs: [
      {
        filter: "Manteaux",
        subs: [
          "Ponchos",
          "Vestes",
          "Manteaux",
        ]
      },
      {
        filter: "Sweats",
        subs: [
          "Gilets",
          "Polaires",
          "Vestes",
          "Pull en laine",
          "Pulls"
        ]
      },
      {
        filter: "Blazers & Tailleurs",
        subs: [
          "Blazers",
          "Tailleurs complets",
          "Tailleurs séparés",
        ]
      },
      {
        filter: "Robes",
        subs: [
          "Robes longues",
          "Robes courtes",
          "Robes d'occasion",
          "Robes mi-longues",
        ]
      },
      {
        filter: "Jupes",
        subs: [
          "Jupes longues",
          "Jupes mi-courtes",
          "Jupes courtes",
          "Jupes taille haute",
        ]
      },
      {
        filter: "Shorts",
        subs: [
          "Shorts en jean",
          "Shorts taille haute",
          "Short genoux",
          "Shorts courts",
          "Pantacourts",
        ]
      },
      {
        filter: "Maillots de bain",
        subs: [
          "Une pièce",
          "Deux pièces",
          "Accessoires de plage",
        ]
      },
      {
        filter: "Sport",
        subs: [
          "Shorts",
          "Brassières",
          "Pantalons",
          "Hauts",
          "Pulls",
          "Survêtements",
        ]
      }
    ]
  },
  {
    filter: "Chaussures",
    subs: [
      "Bottes",
      "Baskets",
      "Chaussures plates",
      "Sandales",
      "Chaussures à talon",
      "Chaussons",
      "Mules",
    ]
  },
  {
    filter: "Sous-vêtements",
    subs: [
      "Soutiens-gorge",
      "Culottes",
      "Collants",
      "Chaussettes",
    ]
  },
  {
    filter: "Accessoires",
    subs: [
      "Bijoux",
      "Montres",
      "Ceintures",
      "Echarpes",
      "Gants",
    ]
  },
];

const CAREGORIES_ENFANTS = [
  {
    filter: "Bébé",
    subs: [
      {
        filter: "Bodies",
        subs: [
          "Filles",
          "Garçons",
        ]
      },
      {
        filter: "Pantalons",
        subs: [
          "Filles",
          "Garçons",
        ]
      },
      {
        filter: "Pyjamas",
        subs: [
          "Filles",
          "Garçons",
        ]
      },
      {
        filter: "Hauts",
        subs: [
          "Filles",
          "Garçons",
        ]
      },
      {
        filter: "Manteaux",
        subs: [
          "Filles",
          "Garçons",
        ]
      },
    ]
  },
  {
    filter: "Garçons",
    subs: [
      {
        filter: "Chaussures",
        subs: [
          "Bottes",
          "Chaussures habillées",
          "Baskets",
          "Mocassins",
          "Chaussons",
          "Sandales",
        ]
      },
      {
        filter: "Manteaux",
        subs: [
          "Vestes",
          "Vêtements sky"
        ]
      },
      {
        filter: "Pulls",
        subs: [
          "Gilets",
          "Gilets à zip",
          "Autres"
        ]
      },
      {
        filter: "Chemises et TeeShirts",
        subs: [
          "Polos",
          "Chemises",
          "T-shirts",
          "Autres"
        ]
      },
      {
        filter: "Pantalons",
        subs: [
          "Leggings",
          "Jeans",
          "Salopettes",
          "Pantacourts",
          "Autres"
        ]
      },
      {
        filter: "Shorts",
        subs: ["Shorts"]
      },
      {
        filter: "Maillots de bain",
        subs: [
          "Accessoires",
          "Maillots de bain"
        ]
      },
      {
        filter: "Sous-vêtements",
        subs: ["Sous-vêtements"]
      },
      {
        filter: "Pyjamas",
        subs: [
          "Une pièce",
          "Deux pièces",
        ]
      },
      {
        filter: "Déguisements",
        subs: ["Déguisements"]
      },
    ]
  },
  {
    filter: "Filles",
    subs: [
      {
        filter: "Chaussures",
        subs: [
          "Bottes",
          "Chaussures habillées",
          "Baskets",
          "Mocassins",
          "Chaussons",
          "Sandales",
        ]
      },
      {
        filter: "Manteaux",
        subs: [
          "Manteaux",
          "Vestes",
          "Vêtements sky"
        ]
      },
      {
        filter: "Pulls",
        subs: ["Pulls"]
      },
      {
        filter: "Chemises et TeeShirts",
        subs: [
          "Chemises",
          "T-shirts",
          "Tuniques",
          "Polos",
        ]
      },
      {
        filter: "Robes",
        subs: [
          "Courtes",
          "Longues",
        ]
      },
      {
        filter: "Jupes",
        subs: ["Jupes"]
      },
      {
        filter: "Pantalons",
        subs: [
          "Leggings",
          "Jeans",
          "Salopettes",
        ]
      },
      {
        filter: "Shorts",
        subs: ["Shorts"]
      },
      {
        filter: "Maillots de bain",
        subs: [
          "Accessoires",
          "Maillots"
        ]
      },
      {
        filter: "Pyjamas",
        subs: ["Pyjamas"]
      },
      {
        filter: "Déguisements",
        subs: ["Déguisements"]
      },
      {
        filter: "Sous-vêtements",
        subs: [
          "Culottes",
          "Collants",
          "Brassières",
          "Chaussettes",
        ]
      }
    ]
  }
];

const ALL = [
  {
    filter: "Femmes",
    subs: CAREGORIES_FEMMES
  },
  {
    filter: "Hommes",
    subs: CAREGORIES_HOMMES
  },
  {
    filter: "Enfants",
    subs: CAREGORIES_ENFANTS
  }
]

module.exports = {
  CAREGORIES_HOMMES,
  CAREGORIES_FEMMES,
  CAREGORIES_ENFANTS,
  ALL
};
