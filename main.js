const url = "https://corsproxy.io/?url=https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=goosey%20duck"

const SKILL_ORDER = ["attack", "strength", "defence", "ranged", "prayer", "magic", "runecraft", "construction",
                    "hitpoints", "agility", "herblore", "thieving", "crafting", "fletching", "slayer", "hunter",
                    "mining", "smithing", "fishing", "cooking", "firemaking", "woodcutting", "farming", "sailing"]

run();

async function run() {
    const rawData = await getApiData();
    addSkills(rawData["skills"]);
    addBosses(rawData["activities"]);
}

async function getApiData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

function addSkills(arr) {
    console.log(arr);
    const template = document.getElementById("skills-template");

    SKILL_ORDER.forEach(skill => {
        const obj = matchSkill(skill, arr);
        const currentDiv = document.getElementById("skills")
        const skillName = obj["name"].toLowerCase();
        const skillLevel = obj["level"];
        const skillRank = obj["rank"];
        const skillExperience = obj["xp"];
        const clone = document.importNode(template.content, true);

        clone.firstElementChild.id = skillName;
        clone.querySelector(".skill-icon").src = `/resources/skill_icons/${skillName}.png`;
        clone.querySelector(".skill-level").innerText = skillLevel;

        clone.querySelector(".skill-info-container").id = `popup-${skillName}`;
        clone.querySelector(".skill-name").innerText = "Skill: " + capitaliseFirstLetter(skillName);
        clone.querySelector(".skill-rank").innerText = "Rank: " + skillRank;
        clone.querySelector(".skill-experience").innerText = "Experience: " + skillExperience;
        clone.querySelector(".skill-experience-remaining").innerText = "Remaining XP: " + "tbc";

        if(skillName == "overall") {
            clone.firstElementChild.classList.add("skill-header");
        }

        currentDiv.append(clone);

        // Show/Hide info box event listener
        document.getElementById(skillName).addEventListener("click", function(e) {
            const popupEl = document.getElementById(`popup-${skillName}`);
            popupEl.classList.contains("hidden") ? popupEl.classList.remove("hidden") : popupEl.classList.add("hidden");
        })

    })


  

    arr.forEach(skill => {
        
    });
}

function addBosses(arr) {
    console.log(arr);
    const template = document.getElementById("bosses-template");

    
}

function capitaliseFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1)
}

function matchSkill(string, arr) {
    return arr.find(o => o.name.toLowerCase() === string);
}