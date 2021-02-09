import * as commander from "commander";
import {translate} from "./main";

const program = new commander.Command();

program
    .version("0.0.1")
    .command("fy <English>")
    .description("translation the word")
    .action((argv) => {
        translate(argv);
    });

program.parse(process.argv);
