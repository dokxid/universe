const environment_doc = {
    name: "Environment",
    // catpuccin mocha - green
    color: "#a6e3a1",
    categories: [
        {
            name: "Geographical",
            tags: [
                { name: "Ocean" },
                { name: "SeaWater" },
                { name: "River" },
                { name: "Land" },
                { name: "Mountain" },
                { name: "Glacier" },
                { name: "Arctic" },
                { name: "Valley" },
                { name: "Oasis" },
                { name: "Forest" },
                { name: "Desert (Geographical)" },
                { name: "Canyon" },
            ],
        },
        {
            name: "Climate",
            tags: [
                { name: "Temperate" },
                { name: "Tropic" },
                { name: "Humid" },
                { name: "Desert (Climate)" },
                { name: "Polar" },
                { name: "Arid" },
            ],
        },
        {
            name: "Natural Disasters",
            tags: [],
        },
        {
            name: "Cultural Effects",
            tags: [
                { name: "Population Density" },
                { name: "Pollution" },
                { name: "Climate change" },
            ],
        },
    ],
};

const religious_practices_doc = {
    name: "Religious Practices",
    // catpuccin mocha - mauve
    color: "#cba6f7",
    categories: [
        {
            name: "Spiritualism",
            tags: [],
        },
        {
            name: "Mythology",
            tags: [],
        },
        {
            name: "Symbolism",
            tags: [],
        },
        {
            name: "Sacred Cities",
            tags: [{ name: "Mecca" }, { name: "Jerusalem" }],
        },
        {
            name: "Sacred Landscapes / Beings",
            tags: [
                { name: "Pilgrim's route" },
                { name: "Beaches" },
                { name: "Trees" },
                { name: "Rocks" },
            ],
        },
        {
            name: "Sacred Places",
            tags: [
                { name: "Church" },
                { name: "Mosque" },
                { name: "Musjid" },
                { name: "Synagogue" },
                { name: "Temple" },
                { name: "Cemetery" },
                { name: "Columbarium" },
                { name: "Chapel" },
                { name: "Shrine" },
            ],
        },
        {
            name: "Multi-layered Sanctity",
            tags: [{ name: "Hagia" }, { name: "Sophia" }],
        },
        {
            name: "Belief Systems",
            tags: [
                { name: "Islam" },
                { name: "Christianism" },
                { name: "Judaism" },
                { name: "Sufism" },
                { name: "Hinduism" },
                { name: "Buddhism" },
                { name: "Shamanism" },
                { name: "Nature worshiping" },
                { name: "New age beliefs" },
            ],
        },
        {
            name: "Religious Music",
            tags: [
                { name: "Islamic Music" },
                { name: "Christian Music" },
                { name: "Jewish Music" },
                { name: "Buddhist Music" },
                { name: "Hindu Music" },
                { name: "Shamanic music" },
                { name: "New age music" },
            ],
        },
        {
            name: "Religious Art",
            tags: [
                { name: "Christian Art" },
                { name: "Buddhist Art" },
                { name: "Confucian Art" },
                { name: "Islamic Art" },
                { name: "Hindu Art" },
            ],
        },
        {
            name: "Religious Conflict",
            tags: [
                { name: "Heritage sites under attack" },
                { name: "Genocide" },
                { name: "Forced migration" },
                { name: "Restricted communities" },
            ],
        },
        {
            name: "Rites and Ceremonies",
            tags: [
                { name: "Sacrifice" },
                { name: "Ramadan, fasting" },
                { name: "Circumcision ritual" },
                { name: "Funerals" },
                { name: "Baptism" },
                { name: "Feast" },
                { name: "Holly festivals" },
                { name: "Eids" },
            ],
        },
    ],
};

const trade_and_economic_activity_doc = {
    name: "Trade and Economic Activity",
    // catpuccin mocha - sapphire
    color: "#74c7ec",
    categories: [
        {
            name: "Trade Routes",
            tags: [
                { name: "Caravansary" },
                { name: "Spice Route" },
                { name: "Silk Road" },
                { name: "Indian Ocean" },
                { name: "Navigation (Trade and Economic Activity)" },
            ],
        },
        {
            name: "Markets",
            tags: [
                { name: "Open Bazaars" },
                { name: "Covered Bazaars (souks)" },
                { name: "Historical Bazaars" },
                { name: "Bakkalas" },
            ],
        },
        {
            name: "Crossroad Cities",
            tags: [
                { name: "Transportation (Caravans etc.)" },
                { name: "Caravansaries" },
                { name: "Cosmopolitanism (Crossroad Cities)" },
                { name: "Culture Amalgamation (Crossroad Cities)" },
            ],
        },
        {
            name: "Port Cities",
            tags: [
                { name: "Transportation (Dhow etc.)" },
                { name: "Cosmopolitanism (Port Cities)" },
                { name: "Culture Amalgamation (Port Cities)" },
            ],
        },
        {
            name: "Importation & Exportation",
            tags: [],
        },
        {
            name: "Commercial Activities and Institutions",
            tags: [
                { name: "Slavery (Commercial Activities)" },
                { name: "Colonialism" },
                { name: "Companies (e.g. VOC)" },
            ],
        },
        {
            name: "Taxation",
            tags: [],
        },
        {
            name: "Tourism",
            tags: [
                { name: "Cultural tourism" },
                { name: "Mass tourism" },
                { name: "Business tourism" },
                { name: "Dark Heritage tourism" },
            ],
        },
        {
            name: "Skills",
            tags: [
                { name: "Fishing" },
                { name: "Pearling" },
                { name: "Agriculture" },
                { name: "Mining" },
                { name: "Water management" },
                { name: "Shipbuilding (Skills)" },
                { name: "Artisanship" },
            ],
        },
    ],
};

const arts_and_communication_doc = {
    name: "Arts and Communication",
    // catpuccin mocha - peach
    color: "#fab387",
    categories: [
        {
            name: "Arts",
            tags: [],
        },
        {
            name: "Performings",
            tags: [
                { name: "Theater" },
                { name: "Opera" },
                { name: "Dance" },
                { name: "Music" },
            ],
        },
        {
            name: "Media",
            tags: [
                { name: "Installation Art" },
                { name: "Film" },
                { name: "Computer / Digital Art (e.g. AI, VR, 3D)" },
            ],
        },
        {
            name: "Visual",
            tags: [
                { name: "Painting" },
                { name: "Sculpture" },
                { name: "Masks (Visual)" },
                { name: "Crafts" },
            ],
        },
        {
            name: "Literary",
            tags: [
                { name: "Fiction" },
                { name: "Poetry (Literary)" },
                { name: "Novel" },
            ],
        },
        {
            name: "Cultural / Social Communication",
            tags: [
                { name: "Narratives" },
                { name: "Storytelling" },
                { name: "Oral history" },
                { name: "Proverbs" },
                { name: "Rhetoric" },
                { name: "Poetry (Cultural / Social Communication)" },
                { name: "Quotes" },
                { name: "Literature" },
                { name: "Museum" },
                { name: "Exhibitions" },
                { name: "Media" },
                { name: "Presentation" },
                { name: "Travel" },
                { name: "Rites and ceremonies" },
            ],
        },
    ],
};

const social_structures_and_governance_doc = {
    name: "Social Structures and Governance",
    // catpuccin mocha - yellow
    color: "#f9e2af",
    categories: [
        {
            name: "Social Structures",
            tags: [
                { name: "Status" },
                { name: "Religion" },
                { name: "Age" },
                { name: "Ethnicity" },
                { name: "Class" },
                { name: "Gender" },
                { name: "Slavery (Social Structures)" },
                { name: "Discrimination" },
                { name: "Family" },
                { name: "Household" },
                { name: "Neighbors" },
                { name: "Community" },
                { name: "Citizenship" },
                { name: "Outsiders" },
                { name: "Patriarchy" },
                { name: "Matriarchy" },
            ],
        },
        {
            name: "Socio-political Communities",
            tags: [
                { name: "Majorities" },
                { name: "Minorities" },
                { name: "Discriminated people" },
            ],
        },
        {
            name: "Governance",
            tags: [
                { name: "Monarchy" },
                { name: "Democracy" },
                { name: "Dictatorship" },
                { name: "Tribal authority" },
                { name: "Sheikhdom" },
                { name: "Shariah" },
                { name: "Secular" },
            ],
        },
        {
            name: "Living Societies",
            tags: [],
        },
        {
            name: "Disappeared Societies",
            tags: [],
        },
        {
            name: "Past Societies",
            tags: [],
        },
    ],
};

const human_interaction_and_encountering_doc = {
    name: "Human Interaction and Encountering",
    // catpuccin mocha - flamingo
    color: "#f2cdcd",
    categories: [
        {
            name: "Mobility",
            tags: [
                { name: "Expedition" },
                { name: "Tourism" },
                { name: "Education" },
                { name: "Trade" },
                { name: "Migration" },
                { name: "Immigration" },
                { name: "Displacement" },
                { name: "Colonization (Mobility)" },
                { name: "Exile" },
                { name: "Slavery (Human Interaction and Encountering)" },
            ],
        },
        {
            name: "Cultural Amalgamation",
            tags: [
                { name: "Cosmopolitanism (Cultural Amalgamation)" },
                { name: "Multi-culturality" },
            ],
        },
    ],
};

const human_habitation_doc = {
    name: "Human Habitation",
    // catpuccin mocha - lavender
    color: "#b4befe",
    categories: [
        {
            name: "Past / Ancient Settlements",
            tags: [
                { name: "Preliterate Period" },
                { name: "Bronze Age" },
                { name: "Iron Age" },
                { name: "Medieval" },
                { name: "Religious buildings" },
                { name: "Administrative buildings" },
                { name: "Historical buildings" },
                { name: "Ruins (Past / Ancient Settlements)" },
                { name: "World heritage site (Past / Ancient Settlements)" },
            ],
        },
        {
            name: "Modern / Contemporary Settlements",
            tags: [
                { name: "Villages" },
                { name: "Towns" },
                { name: "Cities" },
                { name: "Mega-cities" },
                { name: "Ruins (Modern / Contemporary Settlements)" },
                { name: "Suburbs" },
                { name: "Ghettos" },
                { name: "Gentrificated Districts" },
            ],
        },
        {
            name: "Continuous",
            tags: [
                { name: "Living heritage site" },
                { name: "World heritage site (Continuous)" },
                { name: "Old towns of the cities" },
            ],
        },
        {
            name: "Settlement Elements",
            tags: [
                { name: "Palaces" },
                { name: "Monuments" },
                { name: "Residential Buildings" },
                { name: "Administrative Buildings" },
                { name: "Plaza, square" },
                { name: "Graveyards" },
                { name: "Neighborhoods" },
                { name: "Ghetto" },
                { name: "Ethnic clusters" },
                { name: "Central / suburb" },
                { name: "Slum / squatted spaces" },
            ],
        },
    ],
};

const tradition_doc = {
    name: "Tradition",
    // catpuccin mocha - maroon
    color: "#eba0ac",
    categories: [
        {
            name: "Traditional Knowledge",
            tags: [
                { name: "Oral Traditions" },
                { name: "Traditional Training" },
                { name: "Traditional Agriculture" },
                { name: "Traditional Art" },
                { name: "Vernacular Architecture" },
                { name: "Shipbuilding (Traditional Knowledge)" },
            ],
        },
        {
            name: "Traditional Food and Beverage",
            tags: [
                { name: "Winemaking" },
                { name: "Olive Oil Process" },
                { name: "Bread making" },
                { name: "Ceremonial Feasts" },
                { name: "Festival Feasts" },
                { name: "Funeral Feasts" },
                { name: "Circumcise Feasts" },
                { name: "Religious Feasts (iftar)" },
                { name: "Treating neighbor with food" },
                { name: "Welcoming stranger" },
                { name: "Sacrification" },
                { name: "Fruit offering" },
            ],
        },
        {
            name: "Traditional Healing",
            tags: [
                { name: "Devil Dances" },
                { name: "Masks (Traditional Healing)" },
                { name: "Ayurvedic" },
                { name: "Religious Healing" },
            ],
        },
        {
            name: "Traditions under Threat",
            tags: [
                { name: "Cultural loses" },
                { name: "Woman rights" },
                { name: "Marriage tradition" },
            ],
        },
    ],
};

const science_and_technology_doc = {
    name: "Science and Technology",
    // catpuccin mocha - teal
    color: "#94e2d5",
    categories: [
        {
            name: "Science",
            tags: [
                { name: "Medicine" },
                { name: "Maps / Mapping" },
                { name: "Conservation" },
                { name: "Mineralogy" },
            ],
        },
        {
            name: "Technology",
            tags: [
                { name: "Pyrotechnology" },
                { name: "Architecture" },
                { name: "Shipbuilding (Technology)" },
                { name: "Automobile" },
                { name: "Navigation (Technology)" },
                { name: "Agriculture tools" },
                { name: "Hunting tools" },
                { name: "Pearl diving tools" },
                { name: "Communication tools" },
            ],
        },
    ],
};

const shared_and_contested_heritage_doc = {
    name: "Shared and Contested Heritage",
    // catpuccin mocha - pink
    color: "#f5c2e7",
    categories: [
        {
            name: "Memory and Identity",
            tags: [
                { name: "Resistance" },
                { name: "Conflict" },
                { name: "Wars" },
                { name: "Indigenous peoples" },
                { name: "Identity" },
                { name: "Memory politics" },
                { name: "Revolution" },
                { name: "Colonization (Memory and Identity)" },
                { name: "Decolonization" },
                { name: "Reconciliation" },
            ],
        },
        {
            name: "Heritage Preservation",
            tags: [
                { name: "Heritage management" },
                { name: "Heritage tourism" },
                { name: "Heritage diplomacy" },
                { name: "Heritage ownership" },
            ],
        },
    ],
};

export const UNESCO_TAGS_SEEDS = [
    environment_doc,
    religious_practices_doc,
    trade_and_economic_activity_doc,
    arts_and_communication_doc,
    social_structures_and_governance_doc,
    human_interaction_and_encountering_doc,
    human_habitation_doc,
    tradition_doc,
    science_and_technology_doc,
    shared_and_contested_heritage_doc,
];

export const ALL_UNESCO_TAGS = UNESCO_TAGS_SEEDS.flatMap((theme) =>
    theme.categories.flatMap((category) => category.tags.map((tag) => tag.name))
);
