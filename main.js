const SKILL_ORDER = ["attack", "strength", "defence", "ranged", "prayer", "magic", "runecraft", "construction",
                    "hitpoints", "agility", "herblore", "thieving", "crafting", "fletching", "slayer", "hunter",
                    "mining", "smithing", "fishing", "cooking", "firemaking", "woodcutting", "farming", "sailing"]

const REFRESH_INTERVAL_MS = 60 * 1000 // 1 minute

let refreshInterval = null;

run();

async function run() {
    try {
        const rawData = await getApiData();
        const refreshButton = document.getElementById("last-updated-icon");

        initSkills(rawData["skills"]);
        initBosses(rawData["activities"].slice(20)); // Actvities also contains non-boss data items 0-19

        refreshButton.addEventListener("click", function() {
            refreshData();
        })

        refreshData(rawData);

    } catch (error) {
        console.error("Initial load failed:", error);
    }
}

let isRefreshing = false;

// Use passed-in data on initial load; otherwise fetch fresh data.
async function refreshData(existingData = null) {
    if (isRefreshing) {
        return;
    }

    isRefreshing = true;
    clearInterval(refreshInterval);
    updateRefreshTime("-");
    hideRefreshButton(true);

    try {
        const rawData = existingData !== null ? existingData : await getApiData();
        const username = rawData["name"];
        const arrCombat = getCombatSummary(rawData["skills"]);
        const overall = rawData["skills"].find(skill => skill.name.toLowerCase() === "overall");

        refreshSkills(rawData["skills"]);
        refreshBosses(rawData["activities"].slice(20));
        addUserSummary(username);
        addCombatSummary(arrCombat);
        addTotalSummary(overall);
        
        hideRefreshButton(false);
        updateRefreshTime("Last refreshed: " + getTimeNow());

        console.log("Data refreshed");
    } catch (error) {
        console.error("Refresh failed:", error);
    } finally {
        isRefreshing = false;
        resetRefreshInterval();
    }
}

function resetRefreshInterval() {
    clearInterval(refreshInterval);
    refreshInterval = setInterval(function () {
        refreshData();
    }, REFRESH_INTERVAL_MS);
}

function hideRefreshButton(isTrue) {
    const targetButton = document.getElementById("last-updated-icon");

    isTrue ? targetButton.style.display="none" : targetButton.style.display="block";
}

async function getApiData() {
    if (!workerUrl) {
        throw new Error("workerUrl is not set");
    }

    console.log("Worker URL:", workerUrl);

    const response = await fetch(workerUrl);
    const text = await response.text();

    console.log("API status:", response.status);
    console.log("API response:", text);

    if(!response.ok) {
        throw new Error("API requst failed: " + response.status);
    }

    if (!text) {
        throw new Error("API returned an empty response");
    }

    const result = JSON.parse(text);

    console.log(result);
    return result;
}

function getTimeNow() {
    const d = new Date();
    return d.toLocaleTimeString();
}

function updateRefreshTime(time) {
    const targetDiv = document.getElementById("last-updated-text");

    targetDiv.innerText = time;
}

function refreshSkills(arr) {
    SKILL_ORDER.forEach(skill => {
        const obj = matchSkill(skill, arr);
        const parent = document.getElementById(skill);
        const targetDiv = parent.querySelector("div.skill-level");

        targetDiv.innerText = obj["level"];
    })
}

function initSkills(arr) {
    console.log(arr);
    const template = document.getElementById("skills-template");

    SKILL_ORDER.forEach(skill => {
        const obj = matchSkill(skill, arr);
        const currentDiv = document.getElementById("skills")
        const skillName = obj["name"].toLowerCase();
        const clone = document.importNode(template.content, true);

        clone.firstElementChild.id = skillName;
        clone.querySelector(".skill-icon").src = `resources/skill_icons/${skillName}.png`;
        clone.querySelector(".skill-level").innerText = "--";

        if(skillName == "overall") {
            clone.firstElementChild.classList.add("skill-header");
        }

        currentDiv.append(clone);
    })
}

// function addSkills(arr) {
//     console.log(arr);
//     const template = document.getElementById("skills-template");

//     SKILL_ORDER.forEach(skill => {
//         const obj = matchSkill(skill, arr);
//         const currentDiv = document.getElementById("skills")
//         const skillName = obj["name"].toLowerCase();
//         const skillLevel = obj["level"];
//         const skillRank = obj["rank"];
//         const skillExperience = obj["xp"];
//         const clone = document.importNode(template.content, true);

//         clone.firstElementChild.id = skillName;
//         clone.querySelector(".skill-icon").src = `resources/skill_icons/${skillName}.png`;
//         clone.querySelector(".skill-level").innerText = skillLevel;

//         if(skillName == "overall") {
//             clone.firstElementChild.classList.add("skill-header");
//         }

//         currentDiv.append(clone);
//     })
// }

function initBosses(arr) {
    const template = document.getElementById("bosses-template");
    let arrFormatted = [];

    arr.forEach(object => {
        const nameFormatted = object["name"]
                            .toLowerCase()
                            .replaceAll(" ", "_")
                            .replaceAll("-", "_")
                            .replaceAll("'", "")
                            .replaceAll(":", "");
                            

        let objFormatted = {
            "id": object["id"],
            "name": object["name"],
            "rank": object["rank"],
            "score": object["score"],
            "nameFormatted": nameFormatted
        }

        arrFormatted.push(objFormatted);
    });

    arrFormatted.forEach(bossObject => {
        const currentDiv = document.getElementById("bosses");
        const clone = document.importNode(template.content, true);

        clone.firstElementChild.id = bossObject["nameFormatted"];
        clone.querySelector(".boss-icon").src = `resources/high-scores/${bossObject["nameFormatted"]}.png`;

        currentDiv.append(clone);
    }) 
}

function refreshBosses(arr) {
    let arrFormatted = [];

    arr.forEach(object => {
        const nameFormatted = object["name"]
                            .toLowerCase()
                            .replaceAll(" ", "_")
                            .replaceAll("-", "_")
                            .replaceAll("'", "")
                            .replaceAll(":", "");
                            

        let objFormatted = {
            "id": object["id"],
            "name": object["name"],
            "rank": object["rank"],
            "score": object["score"],
            "nameFormatted": nameFormatted
        }

        arrFormatted.push(objFormatted);
    });

    arrFormatted.forEach(bossObject => {
        const parent = document.getElementById(bossObject["nameFormatted"]);
        const targetDiv = parent.querySelector("div.boss-score");

        targetDiv.innerText = bossObject["score"];
    })
}

// function addBosses(arr) {
//     const template = document.getElementById("bosses-template");
//     let arrFormatted = [];

//     arr.forEach(object => {
//         const nameFormatted = object["name"]
//                             .toLowerCase()
//                             .replaceAll(" ", "_")
//                             .replaceAll("-", "_")
//                             .replaceAll("'", "")
//                             .replaceAll(":", "");
                            

//         let objFormatted = {
//             "id": object["id"],
//             "name": object["name"],
//             "rank": object["rank"],
//             "score": object["score"],
//             "nameFormatted": nameFormatted
//         }

//         arrFormatted.push(objFormatted);
//     });

//     arrFormatted.forEach(bossObject => {
//         const currentDiv = document.getElementById("bosses");
//         const clone = document.importNode(template.content, true);

//         clone.firstElementChild.id = bossObject["nameFormatted"];
//         clone.querySelector(".boss-icon").src = `resources/high-scores/${bossObject["nameFormatted"]}.png`;
//         if (bossObject["score"] != 0) {
//             clone.querySelector(".boss-score").innerText = bossObject["score"];
//         }

//         currentDiv.append(clone);
//     })
// }

function addUserSummary(user) {
    document.getElementById('user').textContent = user;
}

function addCombatSummary(arr) {
    document.getElementById('combat-level').textContent = arr["roundedCombatLevel"];
}

function addTotalSummary(arr) {
    document.getElementById('total-level').textContent = arr["level"];
}

function capitaliseFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1)
}

function matchSkill(string, arr) {
    return arr.find(o => o.name.toLowerCase() === string);
}

function getCombatSummary(arr) {
    const attack = arr.find(skill => skill.name.toLowerCase() === "attack");
    const defence = arr.find(skill => skill.name.toLowerCase() === "defence");
    const strength = arr.find(skill => skill.name.toLowerCase() === "strength");
    const hitpoints = arr.find(skill => skill.name.toLowerCase() === "hitpoints");
    const prayer = arr.find(skill => skill.name.toLowerCase() === "prayer");
    const ranged = arr.find(skill => skill.name.toLowerCase() === "ranged");
    const magic = arr.find(skill => skill.name.toLowerCase() === "magic");

    const base = 0.25 * (defence["level"] + hitpoints["level"] + (prayer["level"] * 0.5));
    const melee = 13 / 40 * (attack["level"] + strength["level"]);
    const range = 13 / 40 * (ranged["level"] * 3 / 2);
    const mage = 13 / 40 * (magic["level"] * 3 / 2);

    const combatLevel = base + Math.max(melee, range, mage);
    const combatSkills = [attack, defence, strength, hitpoints, prayer, ranged, magic];

    const totalExperience = combatSkills.reduce((accumulator, currentValue) => accumulator + currentValue["xp"], 0);
    
    return {
        "roundedCombatLevel": parseInt(combatLevel),
        "exactCombatLevel": combatLevel,
        "totalCombatExperience": totalExperience
    }
}