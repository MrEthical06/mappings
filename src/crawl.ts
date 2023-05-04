import { existsSync, readFileSync, writeFileSync } from "fs";
import axios from "axios";
import { getMappings } from "./getMappings";
import colors from "colors";


(async() => {
    const { data } = await axios.get("https://raw.githubusercontent.com/5H4D0WILA/IDFetch/main/ids.txt")
    const ids = data.split('\n')


    let lastId = 0;

     try {
        let lastIdString = readFileSync("lastId.txt", "utf8");
        lastId = isNaN(parseInt(lastIdString)) ? 0 : parseInt(lastIdString);
    } catch(err) {
        if (!existsSync("lastId.txt")) {
            console.log(colors.yellow("lastId.txt does not exist. Creating..."));
            writeFileSync("lastId.txt", "0");
            console.log(colors.green("Created lastId.txt"));
        } else {
            console.log(colors.red("Could not read lastId.txt"));
        }
    }
    

    //how many ids do you want to map
    const doIds = ids.length;  // put val equal to ids.length to map all

    let maxIds: number = doIds+ lastId;
    maxIds = maxIds ? maxIds : ids.length;

    for (let i = lastId; i < ids.length && i < maxIds; i++) {
        // stop if we reached the max ids or end of the list
        if (i >= maxIds && i >= ids.length) {
            break;
        }

        try {
            console.time('mappings')
            const mappings = await getMappings(ids[i])
            console.timeEnd('mappings')
            console.log(`[?] ${i + 1}/${ids.length}`);
            writeFileSync("lastId.txt", i.toString());

        } catch (error: unknown) {
            if (error instanceof Error) {
                 console.log(`[!] Failed to get mappings for ${ids[i]} - ${error.message}`)
            }
        }
    }
})()
