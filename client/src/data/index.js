
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
        "Macassins",
        "Bottes",
        "Habillées",
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
          "Ponchon",
          "Veste",
        ]
      },
      {
        filter: "Sweats",
        subs: [
          "Gilets",
          "Polères",
          "Vestes",
          "Pull en laine"
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
      "Chaussures à talons",
      "Chaussons",
      "Mules",
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

const CAREGORIES_ENFANTS = CAREGORIES_HOMMES;
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
