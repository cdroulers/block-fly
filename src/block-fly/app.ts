import BoardParser from "./game/symbolsBoardParser";
import LevelSet from "./game/levelSet";
import { writeToCanvas } from "./display/canvasDisplay";
import { bindDefaultControls } from "./display/defaultControls";
import { bindMobileControls } from "./display/mobileControls";

const canvas = document.getElementById("root") as HTMLCanvasElement;

const parser = new BoardParser();

const levels = getLevels();
const levelSet = new LevelSet(levels, parser);

levelSet.onLevelFinished = () => {
  alert("YOU WIN THIS LEVEL. Give yourself a high-five");
  levelSet.nextLevel();
  writeToCanvas(canvas, levelSet.currentLevel);
};

levelSet.onSetFinished = () => {
  alert("YOU Finished all levels. Sweet Christmas!");
};

writeToCanvas(canvas, levelSet.currentLevel);

bindDefaultControls(canvas, levelSet);
bindMobileControls(canvas, levelSet);

function getLevels(): string[] {
  return [
`
#                  #
#                  #
#                  #
#   #       #      #
#D  #   # B # B P  #
####################`,

" #    ##        ##    \n" +
" #                #   \n" +
"##                 #  \n" +
"#D                  # \n" +
"##                   #\n" +
" #           #  B    #\n" +
" #           #B BBP  #\n" +
" #####   #############\n" +
"     #  B#            \n" +
"     #####            ",

" #                 \n" +
" #   ############# \n" +
"# # #             #\n" +
"#  #              #\n" +
"#                B#\n" +
"#               BB#\n" +
"# ###    P   #B ## \n" +
"# # #    #  #####  \n" +
"# # #BB ##  #      \n" +
"#D# ###### ##      \n" +
"### ##   ###       ",

"                  #     \n" +
"                 # #    \n" +
"       #        #   #   \n" +
"      # #      #     #  \n" +
"   ###   #    #       # \n" +
"  #       #  #         #\n" +
" #         ##          #\n" +
" #                    B#\n" +
" #                   BB#\n" +
" #               P   ###\n" +
"##    #          #   #  \n" +
"#D    # B        #####  \n" +
"##### # B   B  ###      \n" +
"    # # B # #B #        \n" +
"    # ##########        \n" +
"    ###                 ",

"     ###    ######### \n" +
" ####   ####         #\n" +
"#                    #\n" +
"#                    #\n" +
"#                    #\n" +
"#     #              #\n" +
"#     #              #\n" +
"#     #BBBB          #\n" +
"#D   #######P        #\n" +
"## ###     ## #     B#\n" +
" # #        # ##   BB#\n" +
" # #        # ##  BBB#\n" +
" ###        # ########\n" +
"            ###       ",

" ###             ####\n" +
" #  #############   #\n" +
"##                  #\n" +
"#D                  #\n" +
"##                  #\n" +
" #                BB#\n" +
" #BB        #  B  ###\n" +
" #BBB       #PBBB #  \n" +
" #BBBB      ##### #  \n" +
" #####    ###   ###  \n" +
"     #   B#          \n" +
"     ## ###          \n" +
"      ###            ",

"  #   #####   ##   ###  \n" +
" # # #     # #  # #   # \n" +
" #  ##      ##   ##    #\n" +
" #   #       #    #    #\n" +
" #                    B#\n" +
" #                    B#\n" +
"##                   BB#\n" +
"#D   B               ###\n" +
"##   # B     #    ## #  \n" +
" #   # B    ## B P####  \n" +
" ##  # BBB  ## BBB#     \n" +
"  #  ###### #######     \n" +
"  ## #    ###           \n" +
"   ###                  ",

" ###       ####   #######  \n" +
"#   #     #    # #       # \n" +
"#    #   #     ##         #\n" +
"#B    ###    # #     ###  #\n" +
"#BB         ##      ## #  #\n" +
"####       ##          #D #\n" +
"   ##            ##    ## #\n" +
"  #    B #      #  #      #\n" +
"  #    B# #    #   #      #\n" +
" #   ###   #    #  #     B#\n" +
" #      # #      ##     BB#\n" +
"#        #           ######\n" +
"#            B            #\n" +
"#    B      ###          B#\n" +
"#   ###                 BB#\n" +
"#        B       B  P  BBB#\n" +
"###########################",

"        ###         \n" +
"       #   #        \n" +
"      #     #  #####\n" +
"     #       ##    #\n" +
"    #     B        #\n" +
"   #      BB      B#\n" +
"  #       ###    BB#\n" +
" #            P ####\n" +
"#             B    #\n" +
"#D           ###   #\n" +
"##    ##   #      B#\n" +
" #    ##B  ##   ####\n" +
" #    #######  ##   \n" +
" ###  #     # ##    \n" +
"   # ##     ###     \n" +
"   ###              ",

"   #####################   \n" +
" ##           #         #  \n" +
"####B       BB#B   BBB B## \n" +
"#  ##  #   #####  B### ## #\n" +
"#   #  ##        ### ###  #\n" +
"#   ##  ##BBBB            #\n" +
"#D       #######          #\n" +
"##        #   ###        ##\n" +
" #     B   # #  ##        #\n" +
" #     #    #    ##       #\n" +
" ####  ##             #####\n" +
"   #####      P           #\n" +
"   #          #           #\n" +
"   #         ##    ########\n" +
"   #        ##           # \n" +
"   #          B         B# \n" +
"   #B    ###########   BB# \n" +
"   #BB  ##         ## BBB# \n" +
"   ######           ###### ",

"#############################\n" +
"#  #   #                    #\n" +
"#     B#BB            ##### #\n" +
"#B   ### B##     B  ##  D # #\n" +
"#BB    ###   P  B       # # #\n" +
"###  BB#     # B          # #\n" +
"#   ####      #  ###   ###  #\n" +
"#B            # #      #  B #\n" +
"#BB       ### # #B    #  ####\n" +
"#### B   ###  # ##B  # B #  #\n" +
"#           B ###  B#   #   #\n" +
"#   B     BB #   ####       #\n" +
"#    #########        ##### #\n" +
"#              B   B##    # #\n" +
"####           B   #    BB# #\n" +
"#B##   #    #          #### #\n" +
"##B### #    #   BBB B       #\n" +
"#B#B#B##    #        BBB    #\n" +
"#############################"
  ];
}
